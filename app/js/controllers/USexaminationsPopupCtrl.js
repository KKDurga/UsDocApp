"use strict";
eHnoteWebApp.controller("USexaminationsPopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "cache", "CategoryList", "checkInvArray", "eHnoteDiagnosisDataServices", "EDitData", "eHnotePatientDataService", "eHnoteMasterDataService", "WorthfourList", "StereopsisList", "eHnoteDbStaticDataService", "$uibModal", "$timeout", "eHnoteCacheStorageService", "eHnotePatientAddressDataServices", "AmslerGridDropdowmList", "AmslerGridODDrawList", "AmslerGridOSDrawList", "ConfrontationalOSDrawListFourField", "ConfrontationalODDrawListFourField", "FieldTestObj", "ConfrontationalDropdownList", "ConfrontationalODDrawList", "ConfrontationalOSDrawList", "ExaminationPossiableDiagosis", "FocusSubTab", "PosteriorLensDetails", "$q",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, cache, CategoryList, checkInvArray, eHnoteDiagnosisDataServices, EDitData, eHnotePatientDataService, eHnoteMasterDataService, WorthfourList, StereopsisList, eHnoteDbStaticDataService, $uibModal, $timeout, eHnoteCacheStorageService, eHnotePatientAddressDataServices, AmslerGridDropdowmList, AmslerGridODDrawList, AmslerGridOSDrawList, ConfrontationalOSDrawListFourField, ConfrontationalODDrawListFourField, FieldTestObj, ConfrontationalDropdownList, ConfrontationalODDrawList, ConfrontationalOSDrawList, ExaminationPossiableDiagosis, FocusSubTab, PosteriorLensDetails, $q) {


        $scope.examinationtab = 1;
        $scope.subexaminationtab = 1;
        $scope.submotorexaminationtab = 1;
        console.log(FocusSubTab);
        FocusSubTab = FocusSubTab || "";
        $scope.cat = checkInvArray[0] || [];
        $scope.cat.CategoryDetails = $filter("filter")($scope.cat.CategoryDetails, function (iterator, ind) { return iterator.SubCategoryId !== 35 }) || [];
        $scope.CategoryDetails = CategoryList || [];
        $scope.WorthfourList = WorthfourList || [];
        $scope.StereopsisList = StereopsisList || [];
        $scope.AmslerGridDropdowmList = AmslerGridDropdowmList || [];
        $scope.AmslerGridODDrawList = AmslerGridODDrawList || [];
        $scope.AmslerGridOSDrawList = AmslerGridOSDrawList || [];
        $scope.ConfrontationalODDrawListFourField = ConfrontationalODDrawListFourField || [];
        $scope.ConfrontationalOSDrawListFourField = ConfrontationalOSDrawListFourField || [];
        $scope.ConfrontationalODDrawList = ConfrontationalODDrawList || [];
        $scope.ConfrontationalOSDrawList = ConfrontationalOSDrawList || [];
        $scope.ConfrontationalDropdownList = ConfrontationalDropdownList || [];
        $scope.ExaminationPossiableDiagosis = ExaminationPossiableDiagosis || {};
        /*$scope.FieldTestObj = FieldTestObj || '';*/
        $scope.cacheStorageItem = cache || '';
        //if ($scope.cacheStorageItem.DryEyeEvaluationData.length>0) {
        //    angular.forEach($scope.cacheStorageItem.DryEyeEvaluationData, function (Bitem) {
        //        Bitem.ActiveInd = 'Y';
        //    });
        //}

        //if ($scope.cacheStorageItem.ColorVisionDetails.length > 0) {
        //    angular.forEach($scope.cacheStorageItem.ColorVisionDetails, function (Bitem) {
        //        Bitem.ActiveInd = 'Y';
        //    });
        //}

        //if ($scope.cacheStorageItem.LacrimalPatiencyDetails.length > 0) {
        //    angular.forEach($scope.cacheStorageItem.LacrimalPatiencyDetails, function (Bitem) {
        //        Bitem.ActiveInd = 'Y';
        //    });
        //}

        //$scope.cacheStorageItem.HertelsExaminationArray[0].ActiveInd = 'Y';



        //$scope.DryEyeEvalution.SummaryEdit = true;
        //$scope.ColorVision.SummaryEdit = true;
        $scope.PrismSubTab = 1;
        $scope.appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.Investigation = {};
        $scope.Investigation.SelectedEye = '1';
        $scope.Investigation.RightEyediv = false;
        $scope.Investigation.LeftEyediv = false;
        $scope.PosteriorLensDetails = PosteriorLensDetails || [];

        $scope.fileReaderSupported = window.FileReader !== null;

        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.PatientData = eHnoteMasterDataService.getpatientData();
        $scope.UserId = eHnoteMasterDataService.getLoginId();

        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {

            $scope.HospitalID = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

        }

        $scope.cacheStorageItem.AnteriorODIsNormal = false;
        $scope.cacheStorageItem.AnteriorOSIsNormal = false;
        $scope.cacheStorageItem.PosteriorODIsNormal = false;
        $scope.cacheStorageItem.PosteriorOSIsNormal = false;

        $scope.cacheStorageItem.AnteriorIsNormal = $scope.cacheStorageItem.AnteriorIsNormal || false;
        $scope.cacheStorageItem.PosteriorIsNormal = $scope.cacheStorageItem.PosteriorIsNormal || false;
        $scope.cacheStorageItem.IsPosteriorExtendedOpthalmology = $scope.cacheStorageItem.IsPosteriorExtendedOpthalmology || false;
        $scope.cacheStorageItem.ExternalExaminactionIsNormal = $scope.cacheStorageItem.ExternalExaminactionIsNormal || false;

        $scope.FieldTestObj = {
            "Fourfield": true,
            "Eightfield": false,
        };

        $scope.Conforntfield = {
            "ObjectValue1": false,
            "ObjectValue2": false
        }

        $scope.AmslerGridNormal = {
            "AmslerODNormal": false,
            "AmslerOSNormal": false
        }
        $scope.Conforntational = {
            "Object1": false,
            "Object2": false
        }

        function GetExtraOcularandNineGaze() {
            return [
                { "Id": 1, "Value": "-1" }, { "Id": 2, "Value": "-2" }, { "Id": 3, "Value": "-3" }, { "Id": 4, "Value": "-4" },
                { "Id": 5, "Value": "0" }, { "Id": 6, "Value": "1" }, { "Id": 7, "Value": "2" }, { "Id": 8, "Value": "3" }, { "Id": 9, "Value": "4" }
            ];
        };
        $scope.ExtraOcularDropdownList = GetExtraOcularandNineGaze();
        $scope.NineGazeDropdownList = GetExtraOcularandNineGaze();
        $scope.GetDuctionsList = function () {
            return [
                { "Id": 1, "Name": "Abduction", "IsChecked": false },
                { "Id": 2, "Name": "Adduction", "IsChecked": false },
                { "Id": 3, "Name": "Elevation in Abduction", "IsChecked": false },
                { "Id": 4, "Name": "Elevation in Adduction", "IsChecked": false },
                { "Id": 5, "Name": "Depression in Abduction", "IsChecked": false },
                { "Id": 6, "Name": "Depression in Adduction", "IsChecked": false }];
        };
        $scope.DuctionsArrayListOD = angular.copy($scope.GetDuctionsList());
        $scope.DuctionsArrayListOS = angular.copy($scope.GetDuctionsList());
        $scope.CoverOrthoList = [{ "Id": 1, "Value": "Orthophoria" }, { "Id": 2, "Value": "Orthotropia" }];

        $scope.CoverPhoriaList = [{ "Id": 1, "Value": "Esophoria" }, { "Id": 2, "Value": "Exophoria" },
        { "Id": 3, "Value": "Hypophoria" }, { "Id": 4, "Value": "Hyperphoria" },
        { "Id": 5, "Value": "Incyclophoria" }, { "Id": 6, "Value": "Excyclophoria" }];

        $scope.CoverTropiaList = [{ "Id": 1, "Value": "Exotropia" }, { "Id": 2, "Value": "Esotropia" },
        { "Id": 3, "Value": "Hypotropia" }, { "Id": 4, "Value": "Hypertropia" },
        { "Id": 5, "Value": "Incyclotropia" }, { "Id": 6, "Value": "Excyclotropia" }];

        $scope.FixationPreferencesList = [{ "Id": 1, "Value": "OD" }, { "Id": 2, "Value": "OS" }, { "Id": 3, "Value": "OU" }, { "Id": 4, "Value": "Alternator" }];
        $scope.GetCornealDetails = angular.copy(eHnotePatientDataService.GetCornealReflexType());
        $scope.GetLeftCornealDetails = angular.copy(eHnotePatientDataService.GetCornealReflexType());
        function GetPrismCoverList() {
            return [{ "Id": 1, "Value": "1" }, { "Id": 2, "Value": "2" }, { "Id": 3, "Value": "3" }, { "Id": 4, "Value": "4" },
            { "Id": 5, "Value": "5" }, { "Id": 6, "Value": "6" }, { "Id": 7, "Value": "7" }, { "Id": 8, "Value": "8" },
            { "Id": 9, "Value": "9" }, { "Id": 10, "Value": "10" }, { "Id": 11, "Value": "12" }, { "Id": 12, "Value": "15" },
            { "Id": 13, "Value": "20" }, { "Id": 14, "Value": "25" }, { "Id": 15, "Value": "30" }, { "Id": 16, "Value": "35" },
            { "Id": 17, "Value": "40" }, { "Id": 18, "Value": "45" }, { "Id": 19, "Value": "50" }, { "Id": 20, "Value": "55" },
            { "Id": 21, "Value": "60" }, { "Id": 22, "Value": "65" }, { "Id": 23, "Value": "70" }];
        };
        $scope.PrismCoverList = GetPrismCoverList();
        $scope.FusionalVergenceList = GetPrismCoverList();
        $scope.RelativeAccommodationList = GetPrismCoverList();
        $scope.GetPrismCoverTypeOfSquintList = function () {
            return [{ "Id": 1, "Value": "ET" }, { "Id": 2, "Value": "E(T)" }, { "Id": 3, "Value": "XT" }, { "Id": 4, "Value": "X(T)" }, { "Id": 5, "Value": "Hypertropia" }, { "Id": 6, "Value": "Hypotropia" },
            { "Id": 7, "Value": "Right Hypertropia" }, { "Id": 8, "Value": "Left Hypertropia" }, { "Id": 9, "Value": "Right Hypotropia" }, { "Id": 10, "Value": "Left Hypotropia" }, { "Id": 11, "Value": "Right Incyclotorsion" }, { "Id": 12, "Value": "Left Incyclotorsion" },
            { "Id": 13, "Value": "Orthotropia" }, { "Id": 14, "Value": "Orthophoria" }];
        };
        $scope.PrismCoverTypeOfSquintList = $scope.GetPrismCoverTypeOfSquintList();

        $scope.GetNystagmusList = [{ "NystagmusId": 1, "NystagmusValue": "Latent" }, { "NystagmusId": 2, "NystagmusValue": "End Gaze" }, { "NystagmusId": 3, "NystagmusValue": "Pendular" },
        { "NystagmusId": 4, "NystagmusValue": "Right side Jerk" }, { "NystagmusId": 5, "NystagmusValue": "Left Side Jerk" }, { "NystagmusId": 6, "NystagmusValue": "None" }];
        function GetNearPointList() {
            return [{ "Id": 1, "Value": "1" }, { "Id": 2, "Value": "2" }, { "Id": 3, "Value": "3" }, { "Id": 4, "Value": "4" }, { "Id": 5, "Value": "5" }, { "Id": 6, "Value": "6" }, { "Id": 7, "Value": "7" }, { "Id": 8, "Value": "8" }, { "Id": 9, "Value": "9" }, { "Id": 10, "Value": "10" },
            { "Id": 11, "Value": "11" }, { "Id": 12, "Value": "12" }, { "Id": 13, "Value": "13" }, { "Id": 14, "Value": "14" }, { "Id": 15, "Value": "15" }, { "Id": 16, "Value": "16" }, { "Id": 17, "Value": "17" }, { "Id": 18, "Value": "18" }, { "Id": 19, "Value": "19" }, { "Id": 20, "Value": "20" },
            { "Id": 21, "Value": "21" }, { "Id": 22, "Value": "22" }, { "Id": 23, "Value": "23" }, { "Id": 24, "Value": "24" }, { "Id": 25, "Value": "25" }, { "Id": 26, "Value": "26" }, { "Id": 27, "Value": "27" }, { "Id": 28, "Value": "28" }, { "Id": 29, "Value": "29" }, { "Id": 30, "Value": "30" }];
        }
        $scope.NearPointAccommodationList = GetNearPointList();
        $scope.NearPointConvergenceList = GetNearPointList();
        function GetSchirmerTest() {
            return [{ "Id": 1, "Value": "0" }, { "Id": 2, "Value": "1" }, { "Id": 3, "Value": "2" }, { "Id": 4, "Value": "3" }, { "Id": 5, "Value": "4" }, { "Id": 6, "Value": "5" }, { "Id": 7, "Value": "6" }, { "Id": 8, "Value": "7" }, { "Id": 9, "Value": "8" }, { "Id": 10, "Value": "9" }, { "Id": 11, "Value": "10" },
            { "Id": 12, "Value": "11" }, { "Id": 13, "Value": "12" }, { "Id": 14, "Value": "13" }, { "Id": 15, "Value": "14" }, { "Id": 16, "Value": "15" }, { "Id": 17, "Value": "16" }, { "Id": 18, "Value": "17" }, { "Id": 19, "Value": "18" }, { "Id": 20, "Value": "19" }, { "Id": 21, "Value": "20" },
            { "Id": 22, "Value": "21" }, { "Id": 23, "Value": "22" }, { "Id": 24, "Value": "23" }, { "Id": 25, "Value": "24" }, { "Id": 26, "Value": "25" }, { "Id": 27, "Value": "26" }, { "Id": 28, "Value": "27" }, { "Id": 29, "Value": "28" }, { "Id": 30, "Value": "29" }, { "Id": 31, "Value": "30" }];
        }
        $scope.SchirmerTestList = GetSchirmerTest();
        function GetSchirmerTestMin() {
            return [{ "Id": 1, "Value": "1" }, { "Id": 2, "Value": "<3" }, { "Id": 3, "Value": "3" }, { "Id": 4, "Value": "<5" }, { "Id": 5, "Value": "5" }, { "Id": 6, "Value": "<10" }, { "Id": 7, "Value": "10" }, { "Id": 8, "Value": "<15" }, { "Id": 9, "Value": "15" }];
        }
        $scope.SchirmerTestMin = GetSchirmerTestMin();
        function GetColorVisionIshihara() {
            return [{ "Id": 1, "Value": "1/17" }, { "Id": 2, "Value": "2/17" }, { "Id": 3, "Value": "3/17" }, { "Id": 4, "Value": "4/17" }, { "Id": 5, "Value": "5/17" }, { "Id": 6, "Value": "6/17" }, { "Id": 7, "Value": "7/17" }, { "Id": 8, "Value": "8/17" }, { "Id": 9, "Value": "9/17" }, { "Id": 10, "Value": "10/17" },
            { "Id": 11, "Value": "11/17" }, { "Id": 12, "Value": "12/17" }, { "Id": 13, "Value": "13/17" }, { "Id": 14, "Value": "14/17" }, { "Id": 15, "Value": "15/17" }, { "Id": 16, "Value": "16/17" }, { "Id": 17, "Value": "17/17" }, { "Id": 18, "Value": "Only Demo Plate" }, { "Id": 19, "Value": "Red green deficiency" }, { "Id": 20, "Value": "Blue yellow color deficiency" }, { "Id": 21, "Value": "Total Color Blind" }, { "Id": 22, "Value": "NA" }];
        }
        $scope.ColorVisionIshiharaList = GetColorVisionIshihara();
        function GetTVTList() {
            return [{ "Id": 1, "Value": "0" }, { "Id": 2, "Value": "1" }, { "Id": 3, "Value": "2" }, { "Id": 4, "Value": "3" }, { "Id": 5, "Value": "4" }, { "Id": 6, "Value": "5" }, { "Id": 7, "Value": "6" }, { "Id": 8, "Value": "7" }, { "Id": 9, "Value": "8" }, { "Id": 10, "Value": "9" }, { "Id": 11, "Value": "10" },
            { "Id": 12, "Value": "11" }, { "Id": 13, "Value": "12" }, { "Id": 14, "Value": "13" }, { "Id": 15, "Value": "14" }, { "Id": 16, "Value": "15" }, { "Id": 17, "Value": "16" }, { "Id": 18, "Value": "17" }, { "Id": 19, "Value": "18" }, { "Id": 20, "Value": "19" }, { "Id": 21, "Value": "20" },
            { "Id": 22, "Value": "21" }, { "Id": 23, "Value": "22" }, { "Id": 24, "Value": "23" }, { "Id": 25, "Value": "24" }, { "Id": 26, "Value": "25" }, { "Id": 27, "Value": "26" }, { "Id": 28, "Value": "27" }, { "Id": 29, "Value": "28" }, { "Id": 30, "Value": "29" }, { "Id": 31, "Value": "30" }, { "Id": 32, "Value": "31" },
            { "Id": 33, "Value": "32" }, { "Id": 34, "Value": "33" }, { "Id": 35, "Value": "34" }, { "Id": 36, "Value": "35" }, { "Id": 37, "Value": "36" }
            ];
        }
        $scope.TVTList = GetTVTList();
        function GetTBUTList() {
            return [{ "Id": 1, "Value": "0" }, { "Id": 2, "Value": "1" }, { "Id": 3, "Value": "2" }, { "Id": 4, "Value": "3" }, { "Id": 5, "Value": "4" }, { "Id": 6, "Value": "5" }, { "Id": 7, "Value": "6" }, { "Id": 8, "Value": "7" }, { "Id": 9, "Value": "8" }, { "Id": 10, "Value": "9" }, { "Id": 11, "Value": "10" },
            { "Id": 12, "Value": "11" }, { "Id": 13, "Value": "12" }, { "Id": 14, "Value": "13" }, { "Id": 15, "Value": "14" }, { "Id": 16, "Value": "15" }, { "Id": 17, "Value": "16" }, { "Id": 18, "Value": "17" }, { "Id": 19, "Value": "18" }, { "Id": 20, "Value": "19" }, { "Id": 21, "Value": "20" },
            { "Id": 22, "Value": "21" }, { "Id": 23, "Value": "22" }, { "Id": 24, "Value": "23" }, { "Id": 25, "Value": "24" }, { "Id": 26, "Value": "25" }, { "Id": 27, "Value": "26" }, { "Id": 28, "Value": "27" }, { "Id": 29, "Value": "28" }, { "Id": 30, "Value": "29" }, { "Id": 31, "Value": "30" }, { "Id": 32, "Value": "31" },
            { "Id": 33, "Value": "32" }, { "Id": 34, "Value": "33" }, { "Id": 35, "Value": "34" }, { "Id": 36, "Value": "35" }, { "Id": 37, "Value": "36" }
            ];
        }
        $scope.TBUTList = GetTBUTList();

        $scope.Examinationobj = {
            "EnterAnteriorTemplateName": '',
            "EnterPosteriorTemplateName": '',
            "EnterExternalExaminationTemplateName": '',
            "SelectedPosteriorTemplateName": '',
            "SelectedAnteriorTemplateName": '',
            "SelectedExternalExaminationTemplateName": '',

        }
        $scope.Selectedtemplateobj = {
            "TemplateName": ""
        }
        $scope.GonioscopyNormal = {
            "GonioscopyODNormal": false,
            "GonioscopyOSNormal": false,
        }
        $scope.AnteriorSegmentArrayNew = $scope.cacheStorageItem.AnteriorSegmentArrayNew || [];
        $scope.PoteriorSegmentArrayNew = $scope.cacheStorageItem.PoteriorSegmentArrayNew || [];

        $scope.cacheStorageItem.AnteriorDetails = $scope.cacheStorageItem.AnteriorDetails || [];
        if ($scope.cacheStorageItem.AnteriorDetails.length > 0) {
            angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (item) {
                item.IsSelected = false;
            });
            $scope.cacheStorageItem.AnteriorDetails[0].IsSelected = true;
        }

        $scope.cacheStorageItem.NewAmslerGridArray = $scope.cacheStorageItem.NewAmslerGridArray || [];
        if ($scope.cacheStorageItem.NewAmslerGridArray.length > 0) {
            angular.forEach($scope.cacheStorageItem.NewAmslerGridArray, function (item) {
                var filetrODarray = $filter("filter")(item.RDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                var filetrOSarray = $filter("filter")(item.LDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                if (item.InvestigationId == 2132) {
                    if (filetrODarray.length > 0) {
                        $scope.AmslerGridODDrawList = item.RDrawList || [];
                    }
                    if (filetrOSarray.length > 0) {
                        $scope.AmslerGridOSDrawList = item.LDrawList || [];
                    }

                    if (item.RightEyeId == 69) {
                        angular.forEach($scope.AmslerGridODDrawList, function (item) {
                            item.IsChecked = false;
                        });
                        $scope.AmslerGridNormal.AmslerODNormal = true;
                    } if (item.LeftEyeId == 69) {
                        angular.forEach($scope.AmslerGridOSDrawList, function (item) {
                            item.IsChecked = false;
                        });
                        $scope.AmslerGridNormal.AmslerOSNormal = true;
                    }
                }
            });
        }
        $scope.cacheStorageItem.AnteriorSegmentImagesArray = $scope.cacheStorageItem.AnteriorSegmentImagesArray || [];
        $scope.cacheStorageItem.PosteriorSegmentImagesArray = $scope.cacheStorageItem.PosteriorSegmentImagesArray || [];
        $scope.cacheStorageItem.ExternalExaminationImagesArray = $scope.cacheStorageItem.ExternalExaminationImagesArray || [];

        $scope.cacheStorageItem.ConfrontationalFieldArray = $scope.cacheStorageItem.ConfrontationalFieldArray || [];
        if ($scope.cacheStorageItem.ConfrontationalFieldArray.length > 0) {
            angular.forEach($scope.cacheStorageItem.ConfrontationalFieldArray, function (item) {
                var filetrFourFieldODarray = $filter("filter")(item.FRDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                var filetrFourFieldOSarray = $filter("filter")(item.FLDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                var filetrEightFieldODarray = $filter("filter")(item.RDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                var filetrEightFieldOSarray = $filter("filter")(item.LDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                if (item.InvestigationId == 2164) {
                    if (filetrFourFieldODarray.length > 0 || filetrFourFieldOSarray.length > 0 || filetrEightFieldODarray.length > 0 || filetrEightFieldOSarray.length > 0) {
                        $scope.ConfrontationalODDrawListFourField = item.FRDrawList || [];
                        $scope.ConfrontationalOSDrawListFourField = item.FLDrawList || [];
                        $scope.ConfrontationalODDrawList = item.RDrawList || [];
                        $scope.ConfrontationalOSDrawList = item.LDrawList || [];
                    } if (item.RightEyeId == 68) {
                        $scope.Conforntational.Object1 = true;
                    } if (item.LeftEyeId == 68) {
                        $scope.Conforntational.Object2 = true;
                    } if (item.FRightEyeId == 68) {
                        $scope.Conforntfield.ObjectValue1 = true;
                    } if (item.FLeftEyeId == 68) {
                        $scope.Conforntfield.ObjectValue2 = true;
                    }
                }
            });
        }



        $scope.GetSeverity = function () {
            return [
                {
                    "AllergyDescription": "Mild",
                    "ROSAllergiesID": 1, //38
                },
                {
                    "AllergyDescription": "Moderate",
                    "ROSAllergiesID": 40,
                },
                {
                    "AllergyDescription": "Severe",
                    "ROSAllergiesID": 42,
                },

            ];
        };
        $scope.GetSeverityList = angular.copy($scope.GetSeverity());
        $scope.getsbObject = function () {
            var obj = {
                "superBillId": 0,
                "BillingHistoryId": 0,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "IsBillSelected": false,
                "IsBillingDone": false,
                "ICD10Code": "",
                "CPTCode": "",
                "Description": "",
                "IsDiagnosis": "",
                "DescriptionId": "",
                "OrgDescriptionId": "",
                "Comments": "",
                "Quantity": "",
                "Cost": "",
                "Type": "",
                "SelectedObject": "",
                "DeleteInd": "N",
                "RowId": 0
            };
            return obj;
        };



        if (EDitData !== undefined) {
            //if (EDitData.InvestigationId == 2079 || EDitData.InvestigationId == 2082 || EDitData.InvestigationId == 2103 || EDitData.InvestigationId == 2166) {
            //    $scope.examinationtab = 4;
            //    $scope.submotorexaminationtab = 5;
            //    $scope.DryEyeEvalution.SummaryEdit = false;
            //}
            if (EDitData == 'ExtraOcular') {
                $scope.examinationtab = 3;
                $scope.submotorexaminationtab = 1;
            } else if (EDitData == '9Gaze') {
                $scope.examinationtab = 3;
                $scope.submotorexaminationtab = 2;
            } else if (EDitData == 'Squint') {
                $scope.examinationtab = 3;
                $scope.submotorexaminationtab = 3;
            } else if (EDitData == 'MotorExamination') {
                $scope.examinationtab = 3;
                $scope.submotorexaminationtab = 4;
            } else if (EDitData.InvestigationId == 2079) {
                $scope.examinationtab = 4;
                $scope.submotorexaminationtab = 1;
            } else if (EDitData.InvestigationId == 2132) {
                $scope.examinationtab = 4;
                $scope.submotorexaminationtab = 6;
            } else if (EDitData.InvestigationId == 2164) {
                $scope.examinationtab = 4;
                $scope.submotorexaminationtab = 7;
            } else if (EDitData.InvestigationId == 14) {
                $scope.examinationtab = 4;
                $scope.submotorexaminationtab = 5;
                // $scope.DryEyeEvalution.SummaryEdit = false;
            } else if (EDitData.InvestigationId == 2159) {
                $scope.examinationtab = 4;
                $scope.submotorexaminationtab = 9;
                $scope.cacheStorageItem.HertelsExaminationArray = $scope.cacheStorageItem.HertelsExaminationArray || [];
                if ($scope.cacheStorageItem.HertelsExaminationArray.length > 0) {
                    angular.forEach($scope.cacheStorageItem.HertelsExaminationArray, function (item) {
                        item.IsSummaryEdit = false;
                    });
                }
            } else if (EDitData == 'Lacrimal') {
                $scope.examinationtab = 4;
                $scope.submotorexaminationtab = 10;
                $scope.Lacrimal.SummaryEdit = true;
            } else if (EDitData.SubCategoryName == "Color Vision test") {
                $scope.examinationtab = 4;
                $scope.submotorexaminationtab = 8;
                //if ($scope.colorVisionObj.Array.length > 0) {
                //    $scope.ColorVision.SummaryEdit = false;
                //}
            }
            else if (EDitData.SubCategoryName == "Dry Eye Evaluation") {
                $scope.examinationtab = 4;
                $scope.submotorexaminationtab = 5;
                //if ($scope.cacheStorageItem.DryEyeEvaluationData.length > 0) {
                //    $scope.DryEyeEvalution.SummaryEdit = false;
                //}
            }
        }


        //if (FocusSubTab.Focus !== undefined) {
        //    $scope.examinationtab = FocusSubTab.Focus;
        //}
        //if (FocusSubTab.Type !== undefined) {
        //    $scope.subexaminationtab = FocusSubTab.Type;
        //}
        //if (FocusSubTab.Subtype !== undefined) {
        //    $scope.submotorexaminationtab = FocusSubTab.Subtype;
        //}
        //if ($scope.examinationtab == 2) {
        //    $timeout(function () {
        //        $scope.ClickTabExam(2);
        //    }, 1000)

        //}
        $scope.cacheStorageItem.HertelsExaminationArray = $scope.cacheStorageItem.HertelsExaminationArray || [];
        if ($scope.cacheStorageItem.HertelsExaminationArray.length > 0) {
            angular.forEach($scope.cacheStorageItem.HertelsExaminationArray, function (item) {
                item.IsSummaryEdit = false;
            });
        }
        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        };

        $scope.GetFindingCheckValues = function () {
            eHnotePatientAddressDataServices.FindingCheckValues().then(function (resp) {
                $scope.cacheStorageItem.FindingCheckValuesList = resp.data;
                $scope.AddToCache();
            }, function (err) {
                console.log(err);
                alertify.error("Getting FindingCheckValues Failed");
            });
        };
        if ($scope.cacheStorageItem.FindingCheckValuesList != undefined) {
            if ($scope.cacheStorageItem.FindingCheckValuesList.length === 0) {
                $scope.GetFindingCheckValues();
            }
        }


        $scope.GetTemplate = function (type, item, Categoryid) {
            if (Categoryid == 5) {
                $scope.newAnteriorObj.SelectedAnteriorObj = $scope.newAnteriorObj.SelectedAnteriorObj || '';
                if ($scope.newAnteriorObj.SelectedAnteriorObj == '') {
                    alertify.error("Please Select Investigation");
                    return false;
                }
            }
            if (Categoryid == 6) {
                $scope.newPosteriorObj.SelectedPosteriorObj = $scope.newPosteriorObj.SelectedPosteriorObj || '';
                if ($scope.newPosteriorObj.SelectedPosteriorObj == '') {
                    alertify.error("Please Select Investigation");
                    return false;
                }
            }
            if (type === "Right") {
                item.RightTemplateUrl = item.RightTemplateUrl || '';
                if (item.RightTemplateUrl === "") {
                    alertify.log("No Images Found");
                } else {
                    item.RightOrganDocUrl = item.RightTemplateUrl;
                    item.RightEyefileName = item.RightTemplateUrl.substring(item.LeftTemplateUrl.lastIndexOf("/") + 1);
                    $("#maineHnoteLoader").show();
                    $scope.toDataURL(item.RightTemplateUrl, function (dataURL) {
                        item.RightEyediv = true;
                        item.thumbnailRightEye = dataURL;
                        //$("#maineHnoteLoader").hide();
                        $timeout(function () {
                            $("#maineHnoteLoader").hide();
                        }, 200);
                    });
                }
            }
            if (type === "Left") {
                if (item.LeftTemplateUrl === "") {
                    alertify.log("No Images Found");
                } else {
                    item.LeftOrganDocUrl = item.LeftTemplateUrl;
                    item.LeftEyefileName = item.LeftTemplateUrl.substring(item.LeftTemplateUrl.lastIndexOf("/") + 1);
                    $("#maineHnoteLoader").show();
                    $scope.toDataURL(item.LeftTemplateUrl, function (dataURL) {
                        item.LeftEyediv = true;
                        item.thumbnailLeftEye = dataURL;
                        //  $("#maineHnoteLoader").hide();
                        $timeout(function () {
                            $("#maineHnoteLoader").hide();
                        }, 200);
                    });
                }
            }
        };

        $scope.PossibleDiagnosisObj = [
            {
                "Id": 1,
                "PossibleDiagnosis": "Esotropia"
            },
            {
                "Id": 2,
                "PossibleDiagnosis": "Exotropia"
            },
            {
                "id": 3,
                "PossibleDiagnosis": "Heterophoria"
            },
            {
                "Id": 4,
                "PossibleDiagnosis": "Hypertropia"
            },
            {
                "Id": 5,
                "PossibleDiagnosis": "Intermittent Heterotropia"
            },
            {
                "Id": 6,
                "PossibleDiagnosis": "Mechanical Strabismus"
            },
            {
                "Id": 7,
                "PossibleDiagnosis": "Monofixation syndrome"
            },
            {
                "Id": 8,
                "PossibleDiagnosis": "Paralytic Strabismus"
            }
        ];

        $scope.PossiableDiagonsis = [{ "Id": 1, "Value": "Esotropia" }, { "Id": 2, "Value": "Exotropia" }, { "Id": 3, "Value": "Heterophoria" }, { "Id": 4, "Value": "Hypertropia" }, { "Id": 5, "Value": "Intermittent Heterotropia" }, { "Id": 6, "Value": "Mechanical Strabismus" }, { "Id": 7, "Value": "Monofixation syndrome" }, { "Id": 8, "Value": "Paralytic Strabismus" }]

        $scope.GetPrismCoverTypeOfSquintList = function () {
            return [{ "Id": 1, "Value": "ET" }, { "Id": 2, "Value": "E(T)" }, { "Id": 3, "Value": "XT" }, { "Id": 4, "Value": "X(T)" }, { "Id": 5, "Value": "Hypertropia" }, { "Id": 6, "Value": "Hypotropia" },
            { "Id": 7, "Value": "Right Hypertropia" }, { "Id": 8, "Value": "Left Hypertropia" }, { "Id": 9, "Value": "Right Hypotropia" }, { "Id": 10, "Value": "Left Hypotropia" }, { "Id": 11, "Value": "Right Incyclotorsion" }, { "Id": 12, "Value": "Left Incyclotorsion" },
            { "Id": 13, "Value": "Orthotropia" }, { "Id": 14, "Value": "Orthophoria" }];
        };
        $scope.PrismCoverTypeOfSquintList = $scope.GetPrismCoverTypeOfSquintList();

        function GetPosteriorCDR() {
            return [{ "Id": 1, "Value": "0.95", "IsChecked": false }, { "Id": 1, "Value": "0.9", "IsChecked": false }, { "Id": 2, "Value": "0.85", "IsChecked": false }, { "Id": 2, "Value": "0.8", "IsChecked": false }, { "Id": 3, "Value": "0.75", "IsChecked": false }, { "Id": 3, "Value": "0.7", "IsChecked": false }, { "Id": 4, "Value": "0.65", "IsChecked": false }, { "Id": 4, "Value": "0.6", "IsChecked": false },
            { "Id": 5, "Value": "0.55", "IsChecked": false }, { "Id": 5, "Value": "0.5", "IsChecked": false }, { "Id": 6, "Value": "0.4", "IsChecked": false }, { "Id": 6, "Value": "0.45", "IsChecked": false },
            { "Id": 7, "Value": "0.35", "IsChecked": false }, { "Id": 7, "Value": "0.3", "IsChecked": false }, { "Id": 8, "Value": "0.25", "IsChecked": false }, { "Id": 8, "Value": "0.2", "IsChecked": false }, { "Id": 9, "Value": "0.15", "IsChecked": false }, { "Id": 9, "Value": "0.1", "IsChecked": false }]
        };
        $scope.CDRHorizantalList = GetPosteriorCDR();
        $scope.CDRVerticalList = GetPosteriorCDR();
        $scope.CDR_DPSList = GetPosteriorCDR();
        $scope.PosteriorDPSSelectedEye = "OD";

        $scope.PrismCoverSubTabList = [{ "PrismTypeId": 1, "PrismTypeName": "ACT" }, { "PrismTypeId": 2, "PrismTypeName": "Double Madddox Rod" }, { "PrismTypeId": 3, "PrismTypeName": "Krimsky" },
        { "PrismTypeId": 4, "PrismTypeName": "Hirshburg" }, { "PrismTypeId": 5, "PrismTypeName": "Madddox Rod" }];

        function GetHertelODandOSList() {
            return [{ "Id": 1, "Value": "90" }, { "Id": 2, "Value": "91" }, { "Id": 3, "Value": "92" }, { "Id": 4, "Value": "93" }, { "Id": 5, "Value": "94" }, { "Id": 6, "Value": "95" }, { "Id": 7, "Value": "96" }, { "Id": 8, "Value": "97" }, { "Id": 9, "Value": "98" }, { "Id": 10, "Value": "99" },
            { "Id": 11, "Value": "100" }, { "Id": 12, "Value": "101" }, { "Id": 13, "Value": "102" }, { "Id": 14, "Value": "103" }, { "Id": 15, "Value": "104" }, { "Id": 16, "Value": "105" }, { "Id": 17, "Value": "106" }, { "Id": 18, "Value": "107" }, { "Id": 19, "Value": "108" }, { "Id": 20, "Value": "109" }, { "Id": 21, "Value": "110" }]
        }
        $scope.HertelODandOSList = GetHertelODandOSList();

        function GetHertelBaseList() {
            return [{ "Id": 1, "Value": "16" }, { "Id": 2, "Value": "17" }, { "Id": 3, "Value": "18" }, { "Id": 4, "Value": "19" }, { "Id": 5, "Value": "20" },
            { "Id": 6, "Value": "21" }, { "Id": 7, "Value": "22" }, { "Id": 8, "Value": "23" }, { "Id": 9, "Value": "24" }, { "Id": 10, "Value": "25" }, { "Id": 11, "Value": "26" }, { "Id": 12, "Value": "27" }, { "Id": 13, "Value": "28" }];
        }
        $scope.HertelBaseList = GetHertelBaseList();

        $scope.PrismCoverSubObjArray = [];
        angular.forEach($scope.PrismCoverSubTabList, function (pitem) {
            var obj = {
                "PatientPrismCoverId": 0,
                "PrismTypeId": pitem.PrismTypeId,
                "PrismTypeName": pitem.PrismTypeName,
                "DistanceRPrismValue": "",
                "DistanceRTypeOfSquintId": 0,
                "DistanceRTypeOfSquintValue": "",
                "DistanceRTypeOfSquintObj": "",
                "DistanceRFixationPreference": "",
                "DistanceLPrismValue": "",
                "DistanceLTypeOfSquintId": 0,
                "DistanceLTypeOfSquintValue": "",
                "DistanceLTypeOfSquintObj": "",
                "DistanceLFixationPreference": "",
                "IsDistanceChecked": true,
                //"IsShowPrismDetails": false,
                "IsNearChecked": false,
                "NearLTypeOfSquintObj": "",
                "NearLFixationPreference": "",
                "NearLPrismValue": "",
                "NearRFixationPreference": "",
                "NearRTypeOfSquintObj": "",
                "NearRPrismValue": "",
                "NearLTypeOfSquintId": 0,
                "NearLTypeOfSquintValue": "",
                "NearRTypeOfSquintId": 0,
                "NearRTypeOfSquintValue": "",
            };
            $scope.PrismCoverSubObjArray.push(obj);
        });


        $scope.motorexaminationClick = function (value) {

            if ($scope.submotorexaminationtab != value) {
                if (value == 8) {
                    //if ($scope.colorVisionObj.Array.length > 0) {
                    //    $scope.ColorVision.SummaryEdit = false;
                    //}
                }
                if (value == 5) {
                    //if ($scope.cacheStorageItem.DryEyeEvaluationData.length > 0) {
                    //    $scope.DryEyeEvalution.SummaryEdit = false;
                    //}
                }
            }

            $scope.submotorexaminationtab = value;
            $scope.FieldTestObj.Fourfield = true;
            $scope.FieldTestObj.Eightfield = false;
        }
        $scope.IsShowExaminationDrawingInd = false;
        $scope.SubexaminationClick = function (Id) {
            $scope.PosteriorHistoryButton = false;
            $scope.AnteriorHistoryButton = false;

            if (Id == 2) {
                $scope.PosteriorHistoryButton = true;
            }

            if (Id == 1) {
                $scope.AnteriorHistoryButton = true;
            }
            $scope.subexaminationtab = Id || 1;
            $scope.AnteriorDropdownList = [];
            $scope.IsshowIndicator = false;
            $scope.IsShowExaminationDrawingInd = false;
            //var item = 0;
            //if (Id == 1) {
            //    item = 5;
            //} else {
            //    item = 6;
            //}
            //$scope.getMasterFindingValuesByInvestigaction(item);
            //if (Id == 1) {
            //    $scope.AnteriorINVDropdownList = angular.copy($scope.AnteriorINVDropdownListMain);
            //} else if(Id == 2) {
            //    $scope.PosteriorINVDropdownList = angular.copy($scope.PosteriorINVDropdownListMain);
            //}

        }
        $scope.clickmenupopover = {
            templateUrl: 'templates/uibpopups/menu-popover.html',
        }; 
          
        
        $scope.GonioscopyDetailsList = [];
        $scope.GonioscopyDetailsList = angular.copy($scope.cacheStorageItem.GonioscopyDetails);
        $scope.GonioscopyStructuresdropdown = angular.copy($scope.GetGonioscopyStructuresdropdown);
        $scope.PigmentArrayList = angular.copy($scope.GetPigmentArrayList);
        //  $scope.PossibleDiagnosisArray = angular.copy($scope.GetPossibleDiagnosisArray);
        $scope.DepthArrayList = angular.copy($scope.GetDepthArrayList);

        $scope.PossibleDiagnosisArray = $scope.ExaminationPossiableDiagosis.GonioscopyPossiableDiagosisList || [];
        $scope.SquintPossibleDiagnosis = $scope.ExaminationPossiableDiagosis.SquintPossibleDiagnosisList || [];
        $scope.BinocularPossibleDiagnosis = $scope.ExaminationPossiableDiagosis.BVPossibleDiagnosisList || [];


        function GetColorVisionAddobj() {
            var ColorVisionAddobj = {
                "Ishihara": {
                    "InvestigationId": '',
                    "OrgInvestigationId": "",
                    "Investigation": "",
                    "InvestigationDesc": "",
                    "SelectedInvestigationObj": "",
                    "ODRemarks": "",
                    "OSRemarks": "",
                    "EditColorVision": false,
                    "ColorVisionimgArr": []
                },
                "HRR": {
                    "InvestigationId": '',
                    "OrgInvestigationId": "",
                    "Investigation": "",
                    "InvestigationDesc": "",
                    "SelectedInvestigationObj": "",
                    "ODRemarks": "",
                    "OSRemarks": "",
                    "EditColorVision": false,
                    "ColorVisionimgArr1": []
                },
                "FransworthD15": {
                    "InvestigationId": '',
                    "OrgInvestigationId": "",
                    "Investigation": "",
                    "InvestigationDesc": "",
                    "SelectedInvestigationObj": "",
                    "ODRemarks": "",
                    "OSRemarks": "",
                    "EditColorVision": false,
                    "ColorVisionimgArr2": []
                },
                "FransworthD100": {
                    "InvestigationId": '',
                    "OrgInvestigationId": "",
                    "Investigation": "",
                    "InvestigationDesc": "",
                    "SelectedInvestigationObj": "",
                    "ODRemarks": "",
                    "OSRemarks": "",
                    "EditColorVision": false,
                    "ColorVisionimgArr3": []
                },
            };
            var obj = {
                "RS3Url": "",
                "IsRS3Url": false,
                "LS3Url": "",
                "IsLS3Url": false
            };
            ColorVisionAddobj.Ishihara.ColorVisionimgArr.push(obj);
            ColorVisionAddobj.HRR.ColorVisionimgArr1.push(obj);
            ColorVisionAddobj.FransworthD15.ColorVisionimgArr2.push(obj);
            ColorVisionAddobj.FransworthD100.ColorVisionimgArr3.push(obj);

            return ColorVisionAddobj;
        }

        $scope.ColorVisionAddobj = GetColorVisionAddobj();

        $scope.MotorExaminationObj = {
            "HeadPosterDetails": "",
            "NineGazeExtraOcularDetails": "",
            "NearInvestigationdetails": "",
            "SquintDetails": "",
            "SquintPossibleDiagnosisId": 0,
            "SquintPossibleDiagnosis": "",
            "BVPossibleDiagnosisId": 0,
            "BVPossibleDiagnosis": "",
            "ODExtraOcularFreelymovingInd": false,
            "OSExtraOcularFreelymovingInd": false,
            "OD9GazeFreelymovingInd": false,
            "OS9GazeFreelymovingInd": false
        };
        $scope.MotorExaminationObj.HeadPosterDetails = angular.copy($scope.cacheStorageItem.HeadPosterDetails);
        $scope.MotorExaminationObj.NineGazeExtraOcularDetails = angular.copy($scope.cacheStorageItem.NineGazeExtraOcularDetails);
        $scope.MotorExaminationObj.NearInvestigationdetails = angular.copy($scope.cacheStorageItem.NearInvestigationdetails);
        $scope.MotorExaminationObj.SquintDetails = angular.copy($scope.cacheStorageItem.SquintDetails);
        $scope.MotorExaminationObj.SquintPossibleDiagnosis = angular.copy($scope.cacheStorageItem.SquintPossibleDiagnosis) || "";
        $scope.MotorExaminationObj.BVPossibleDiagnosis = angular.copy($scope.cacheStorageItem.BVPossibleDiagnosis) || "";
        $scope.MotorExaminationObj.SquintPossibleDiagnosisId = angular.copy($scope.cacheStorageItem.SquintPossibleDiagnosisId) || 0;
        $scope.MotorExaminationObj.BVPossibleDiagnosisId = angular.copy($scope.cacheStorageItem.BVPossibleDiagnosisId) || 0;

        if ($scope.MotorExaminationObj.SquintDetails.length > 0) {
            angular.forEach($scope.MotorExaminationObj.SquintDetails, function (sitem) {
                if (sitem.InvestigationId === 699) {
                    sitem.DistanceTypeOfSquintValue = sitem.DistanceTypeOfSquintValue || "";
                    if (sitem.DistanceTypeOfSquintValue != "") {
                        if (sitem.DistanceValue === "Ortho") {
                            var Filter = $filter("filter")($scope.CoverOrthoList, { "Value": sitem.DistanceTypeOfSquintValue }, true) || [];
                            if (Filter.length > 0) {
                                sitem.DistanceTypeOfSquintObj = Filter[0];
                            }
                        } else if (sitem.DistanceValue === "Phoria") {
                            var Filter = $filter("filter")($scope.CoverPhoriaList, { "Value": sitem.DistanceTypeOfSquintValue }, true) || [];
                            if (Filter.length > 0) {
                                sitem.DistanceTypeOfSquintObj = Filter[0];
                            }
                        } else if (sitem.DistanceValue === "Tropia") {
                            var Filter = $filter("filter")($scope.CoverTropiaList, { "Value": sitem.DistanceTypeOfSquintValue }, true) || [];
                            if (Filter.length > 0) {
                                sitem.DistanceTypeOfSquintObj = Filter[0];
                            }
                        }
                    }

                    sitem.NearTypeOfSquintValue = sitem.NearTypeOfSquintValue || "";
                    if (sitem.NearTypeOfSquintValue != "") {
                        if (sitem.NearValue === "Ortho") {
                            var Filter = $filter("filter")($scope.CoverOrthoList, { "Value": sitem.NearTypeOfSquintValue }, true) || [];
                            if (Filter.length > 0) {
                                sitem.NearTypeOfSquintObj = Filter[0];
                            }
                        } else if (sitem.NearValue === "Phoria") {
                            var Filter = $filter("filter")($scope.CoverPhoriaList, { "Value": sitem.NearTypeOfSquintValue }, true) || [];
                            if (Filter.length > 0) {
                                sitem.NearTypeOfSquintObj = Filter[0];
                            }
                        } else if (sitem.NearValue === "Tropia") {
                            var Filter = $filter("filter")($scope.CoverTropiaList, { "Value": sitem.NearTypeOfSquintValue }, true) || [];
                            if (Filter.length > 0) {
                                sitem.NearTypeOfSquintObj = Filter[0];
                            }
                        }
                    }
                }
                if (sitem.InvestigationId === 719) {
                    angular.forEach(sitem.PrismCoverDetailsArray, function (spitem) {
                        angular.forEach($scope.PrismCoverSubObjArray, function (subpitem) {
                            if (subpitem.PrismTypeId === spitem.PrismTypeId) {
                                subpitem.PatientPrismCoverId = spitem.PatientPrismCoverId || 0;
                                subpitem.PrismTypeId = spitem.PrismTypeId;
                                subpitem.PrismTypeName = spitem.PrismTypeName;
                                subpitem.IsDistanceChecked = spitem.IsDistanceChecked || false;
                                subpitem.IsNearChecked = spitem.IsNearChecked || false;
                                if (subpitem.IsDistanceChecked == true) {
                                    subpitem.DistanceRPrismValue = spitem.Distance.DistanceRPrismValue || "";
                                    subpitem.DistanceRTypeOfSquintId = spitem.Distance.DistanceRTypeOfSquintId || 0;
                                    subpitem.DistanceRTypeOfSquintValue = spitem.Distance.DistanceRTypeOfSquintValue || "";
                                    subpitem.DistanceRFixationPreference = spitem.Distance.DistanceRFixationPreference || "";
                                    subpitem.DistanceLPrismValue = spitem.Distance.DistanceLPrismValue || "";
                                    subpitem.DistanceLTypeOfSquintId = spitem.Distance.DistanceLTypeOfSquintId || 0;
                                    subpitem.DistanceLTypeOfSquintValue = spitem.Distance.DistanceLTypeOfSquintValue || "";
                                    subpitem.DistanceLFixationPreference = spitem.Distance.DistanceLFixationPreference || "";
                                } if (subpitem.IsNearChecked == true) {
                                    subpitem.NearRPrismValue = spitem.Near.NearRPrismValue || "";
                                    subpitem.NearRTypeOfSquintId = spitem.Near.NearRTypeOfSquintId || 0;
                                    subpitem.NearRTypeOfSquintValue = spitem.Near.NearRTypeOfSquintValue || "";
                                    subpitem.NearRFixationPreference = spitem.Near.NearRFixationPreference || "";
                                    subpitem.NearLPrismValue = spitem.Near.NearLPrismValue || "";
                                    subpitem.NearLTypeOfSquintId = spitem.Near.NearLTypeOfSquintId || 0;
                                    subpitem.NearLTypeOfSquintValue = spitem.Near.NearLTypeOfSquintValue || "";
                                    subpitem.NearLFixationPreference = spitem.Near.NearLFixationPreference || "";
                                }

                                if (subpitem.DistanceRTypeOfSquintValue !== "") {
                                    var Filter = $filter("filter")($scope.PrismCoverTypeOfSquintList, { "Value": subpitem.DistanceRTypeOfSquintValue }, true) || [];
                                    if (Filter.length > 0) {
                                        subpitem.DistanceRTypeOfSquintObj = Filter[0];
                                    }
                                }
                                if (subpitem.DistanceLTypeOfSquintValue !== "") {
                                    var Filter = $filter("filter")($scope.PrismCoverTypeOfSquintList, { "Value": subpitem.DistanceLTypeOfSquintValue }, true) || [];
                                    if (Filter.length > 0) {
                                        subpitem.DistanceLTypeOfSquintObj = Filter[0];
                                    }
                                }
                                if (subpitem.NearRTypeOfSquintValue !== "") {
                                    var Filter = $filter("filter")($scope.PrismCoverTypeOfSquintList, { "Value": subpitem.NearRTypeOfSquintValue }, true) || [];
                                    if (Filter.length > 0) {
                                        subpitem.NearRTypeOfSquintObj = Filter[0];
                                    }
                                }
                                if (subpitem.NearLTypeOfSquintValue !== "") {
                                    var Filter = $filter("filter")($scope.PrismCoverTypeOfSquintList, { "Value": subpitem.NearLTypeOfSquintValue }, true) || [];
                                    if (Filter.length > 0) {
                                        subpitem.NearLTypeOfSquintObj = Filter[0];
                                    }
                                }

                            }
                        });
                    });
                }
                if (sitem.InvestigationId === 2095) {
                    if (sitem.InvestigationOrgans.length > 0) {
                        var odfilter = $filter("filter")(sitem.InvestigationOrgans, { "PositionID": 1 }, true) || [];
                        var osfilter = $filter("filter")(sitem.InvestigationOrgans, { "PositionID": 2 }, true) || [];
                        angular.forEach(sitem.InvestigationOrgans, function (nitem) {
                            if (nitem.DeleteInd == 'N') {
                                if (odfilter.length > 0) { //IsChecked
                                    angular.forEach($scope.DuctionsArrayListOD, function (item1) {
                                        angular.forEach(odfilter, function (item2) {
                                            if (item1.Name === item2.Value) {
                                                item1.IsChecked = true;
                                            }
                                        });
                                    });
                                }
                                if (osfilter.length > 0) {//IsChecked
                                    angular.forEach($scope.DuctionsArrayListOS, function (item1) {
                                        angular.forEach(osfilter, function (item2) {
                                            if (item1.Name === item2.Value) {
                                                item1.IsChecked = true;
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }

        $scope.SaveExamination = function () {

            if ($scope.MotorExaminationObj.SquintDetails.length > 0) {
                angular.forEach($scope.MotorExaminationObj.SquintDetails, function (sitem) {
                    if (sitem.InvestigationId === 719) {
                        sitem.PrismCoverDetailsArray = [];
                        angular.forEach($scope.PrismCoverSubObjArray, function (subitem) {

                            if (subitem.PatientPrismCoverId === 0 && subitem.IsDistanceChecked === false && subitem.IsNearChecked === false && subitem.DistanceRPrismValue == "" && subitem.DistanceLPrismValue == "" && subitem.DistanceRTypeOfSquintId == 0 && subitem.DistanceRTypeOfSquintValue == "" &&
                                subitem.DistanceLTypeOfSquintId == 0 && subitem.DistanceLTypeOfSquintValue == "" && subitem.DistanceRFixationPreference == "" && subitem.DistanceLFixationPreference == "" && subitem.NearRPrismValue == "" && subitem.NearLPrismValue == "" && subitem.NearRTypeOfSquintId == 0 && subitem.NearRTypeOfSquintValue == "" &&
                                subitem.NearLTypeOfSquintId == 0 && subitem.NearLTypeOfSquintValue == "" && subitem.NearRFixationPreference == "" && subitem.NearLFixationPreference == "") {
                                return false;
                            }

                            var obj = {
                                "PatientPrismCoverId": subitem.PatientPrismCoverId || 0,
                                "PrismTypeId": subitem.PrismTypeId,
                                "PrismTypeName": subitem.PrismTypeName,
                                "ActiveInd": "Y",
                                "IsDistanceChecked": subitem.IsDistanceChecked || false,
                                "IsNearChecked": subitem.IsNearChecked || false,
                                "Distance": {
                                    "DistanceRPrismValue": "",
                                    "DistanceRTypeOfSquintId": 0,
                                    "DistanceRTypeOfSquintValue": "",
                                    "DistanceRFixationPreference": "",
                                    "DistanceLPrismValue": "",
                                    "DistanceLTypeOfSquintId": 0,
                                    "DistanceLTypeOfSquintValue": "",
                                    "DistanceLFixationPreference": ""
                                },
                                "Near": {
                                    "NearRPrismValue": "",
                                    "NearRTypeOfSquintId": 0,
                                    "NearRTypeOfSquintValue": "",
                                    "NearRFixationPreference": "",
                                    "NearLPrismValue": "",
                                    "NearLTypeOfSquintId": 0,
                                    "NearLTypeOfSquintValue": "",
                                    "NearLFixationPreference": ""
                                }
                            };
                            if (obj.IsDistanceChecked == true) {
                                obj.Distance.DistanceRPrismValue = subitem.DistanceRPrismValue;
                                obj.Distance.DistanceRTypeOfSquintId = subitem.DistanceRTypeOfSquintId;
                                obj.Distance.DistanceRTypeOfSquintValue = subitem.DistanceRTypeOfSquintValue;
                                obj.Distance.DistanceRFixationPreference = subitem.DistanceRFixationPreference;
                                obj.Distance.DistanceLPrismValue = subitem.DistanceLPrismValue;
                                obj.Distance.DistanceLTypeOfSquintId = subitem.DistanceLTypeOfSquintId;
                                obj.Distance.DistanceLTypeOfSquintValue = subitem.DistanceLTypeOfSquintValue;
                                obj.Distance.DistanceLFixationPreference = subitem.DistanceLFixationPreference;
                            }
                            if (obj.IsNearChecked == true) {
                                obj.Near.NearRPrismValue = subitem.NearRPrismValue;
                                obj.Near.NearRTypeOfSquintId = subitem.NearRTypeOfSquintId;
                                obj.Near.NearRTypeOfSquintValue = subitem.NearRTypeOfSquintValue;
                                obj.Near.NearRFixationPreference = subitem.NearRFixationPreference;
                                obj.Near.NearLPrismValue = subitem.NearLPrismValue;
                                obj.Near.NearLTypeOfSquintId = subitem.NearLTypeOfSquintId;
                                obj.Near.NearLTypeOfSquintValue = subitem.NearLTypeOfSquintValue;
                                obj.Near.NearLFixationPreference = subitem.NearLFixationPreference;
                            }
                            sitem.IsInvDataAdded = true;
                            sitem.PrismCoverDetailsArray.push(obj);
                        });
                    }
                    if (sitem.InvestigationId === 2095) {
                        var i = 0;
                        if (sitem.InvestigationOrgans.length > 0) {
                            angular.forEach(sitem.InvestigationOrgans, function (item) {
                                if (item.DeleteInd == 'N') {
                                    i++
                                }
                            });
                        }
                        if (i == 0) {
                            sitem.ActiveInd = 'N';
                        } else {
                            sitem.ActiveInd = 'Y';
                        }
                    }
                });
            }

            $scope.cacheStorageItem.GonioscopyDetails = angular.copy($scope.GonioscopyDetailsList);

            $scope.cacheStorageItem.AnteriorSegmentArrayNew = angular.copy($scope.AnteriorSegmentArrayNew);
            $scope.cacheStorageItem.PoteriorSegmentArrayNew = angular.copy($scope.PoteriorSegmentArrayNew);

            $scope.obj = {
                "cacheStorageItem": $scope.cacheStorageItem,
                "MotorExaminationObj": $scope.MotorExaminationObj,
                "AmslerGridODDrawList": $scope.AmslerGridODDrawList || [],
                "AmslerGridOSDrawList": $scope.AmslerGridOSDrawList || [],
                "ConfrontationalODDrawListFourField": $scope.ConfrontationalODDrawListFourField || [],
                "ConfrontationalOSDrawListFourField": $scope.ConfrontationalOSDrawListFourField || [],
                "ConfrontationalODDrawList": $scope.ConfrontationalODDrawList || [],
                "ConfrontationalOSDrawList": $scope.ConfrontationalOSDrawList || [],
                "Conforntfield": $scope.Conforntfield,
                "Conforntational": $scope.Conforntational
            }

            $scope.cacheStorageItem.NewAmslerGridArray = angular.copy($scope.cacheStorageItem.NewAmslerGridArray);
            $scope.cacheStorageItem.NewAmslerGridArray = $scope.cacheStorageItem.NewAmslerGridArray || [];
            if ($scope.cacheStorageItem.NewAmslerGridArray.length > 0) {
                var filetrODarray = $filter("filter")($scope.AmslerGridODDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                var filetrOSarray = $filter("filter")($scope.AmslerGridOSDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                if (filetrODarray.length > 0 || filetrOSarray.length > 0) {
                    angular.forEach($scope.cacheStorageItem.NewAmslerGridArray, function (item) {
                        item.IsSummaryEdit = false;
                        if (item.InvestigationId == 2132) {
                            item.LDrawList = $scope.AmslerGridOSDrawList || [];
                            item.RDrawList = $scope.AmslerGridODDrawList || [];
                        }
                        if (filetrODarray.length > 0 || filetrODarray.length > 0 ) {
                            item.IsInvDataAdded = true;
                        }
                    });


                }

            }
            $scope.cacheStorageItem.ConfrontationalFieldArray = $scope.cacheStorageItem.ConfrontationalFieldArray || [];
            if ($scope.cacheStorageItem.ConfrontationalFieldArray.length > 0) {
                var filetrFourFieldODarray = $filter("filter")($scope.ConfrontationalODDrawListFourField, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                var filetrFourFieldOSarray = $filter("filter")($scope.ConfrontationalOSDrawListFourField, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                var filetrEightFieldODarray = $filter("filter")($scope.ConfrontationalODDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                var filetrEightFieldOSarray = $filter("filter")($scope.ConfrontationalOSDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
                if (filetrFourFieldODarray.length > 0 || filetrFourFieldOSarray.length > 0 || filetrEightFieldODarray.length > 0 || filetrEightFieldOSarray.length > 0) {
                    angular.forEach($scope.cacheStorageItem.ConfrontationalFieldArray, function (item) {
                        item.IsSummaryEdit = false;
                        if (item.InvestigationId == 2164) {
                            item.FRDrawList = $scope.ConfrontationalODDrawListFourField || [];
                            item.FLDrawList = $scope.ConfrontationalOSDrawListFourField || [];
                            item.RDrawList = $scope.ConfrontationalODDrawList || [];
                            item.LDrawList = $scope.ConfrontationalOSDrawList || [];
                        }
                        if (filetrFourFieldODarray.length > 0 || filetrFourFieldOSarray.length > 0) {
                            item.IsInvDataAdded = true;
                            item.IsfourFieldDataAdded = true;
                        }
                        if (filetrEightFieldODarray.length > 0 || filetrEightFieldOSarray.length > 0) {
                            item.IsInvDataAdded = true;
                            item.IseightyFieldDataAdded = true;
                        }
                    });
                }
            }
            $scope.FinalColorVisionDetails = [];
            $scope.FinalColorVisionDetails = $filter("filter")($scope.cacheStorageItem.ColorVisionDetails, { "IsInvDataAdded": true }, true);
            $scope.FinalLacrimalPatiencyDetails = [];
            $scope.FinalLacrimalPatiencyDetails = $filter("filter")($scope.cacheStorageItem.LacrimalPatiencyDetails, { "IsInvDataAdded": true }, true);
            $scope.FinalNineGazeExtraOcularDetails = [];
            $scope.FinalNineGazeExtraOcularDetails = $filter("filter")($scope.MotorExaminationObj.NineGazeExtraOcularDetails, { "IsInvDataAdded": true }, true);
            $scope.FinalNewAmslerGridArray = [];
            $scope.FinalNewAmslerGridArray = $filter("filter")($scope.cacheStorageItem.NewAmslerGridArray, { "IsInvDataAdded": true }, true);
            $scope.FinalHertelsExaminationArray = [];
            $scope.FinalHertelsExaminationArray = $filter("filter")($scope.cacheStorageItem.HertelsExaminationArray, { "IsInvDataAdded": true }, true);
            $scope.FinalHeadPosterDetails = [];
            $scope.FinalHeadPosterDetails = $filter("filter")($scope.MotorExaminationObj.HeadPosterDetails, { "IsInvDataAdded": true }, true);
            $scope.FinalDryEyeEvaluationData = [];
            $scope.FinalDryEyeEvaluationData = $filter("filter")($scope.cacheStorageItem.DryEyeEvaluationData, { "IsInvDataAdded": true }, true);
            $scope.FinalNearInvestigationdetails = [];
            $scope.FinalNearInvestigationdetails = $filter("filter")($scope.MotorExaminationObj.NearInvestigationdetails, { "IsInvDataAdded": true }, true);
            $scope.FinalExternalExaminationDetails = [];
            $scope.FinalExternalExaminationDetails = $filter("filter")($scope.cacheStorageItem.ExternalExaminationDetails, { "IsInvDataAdded": true }, true);
            $scope.FinalSquintDetails = [];
            $scope.FinalSquintDetails = $filter("filter")($scope.MotorExaminationObj.SquintDetails, { "IsInvDataAdded": true }, true);
            $scope.FinalGonioscopyDetails = [];
            $scope.FinalGonioscopyDetails = $filter("filter")($scope.cacheStorageItem.GonioscopyDetails, { "IsInvDataAdded": true }, true);
            $scope.FinalConfrontationalFieldArray = [];
            $scope.FinalConfrontationalFieldArray = $filter("filter")($scope.cacheStorageItem.ConfrontationalFieldArray, { "IsInvDataAdded": true }, true);

            $scope.ExaminationReqobj = {
                "ConsultationID": $scope.cacheStorageItem.ConsultationID,
                "AppointmentID": $scope.cacheStorageItem.appointmentid,
                "OrganizationId": $scope.HospitalId,
                "StatusFlag": 'D',
                "ConsultationDate": $scope.cacheStorageItem.ConsultationDate || "",
                "UserId": $scope.UserId,
                "AppointmentDoctorId": "",
                "AppointmentDoctorName": "",
                "AppointmentDoctorRcopiaId": "",
                "AppointmentDate": "",
                /*   "MotorExaminationObj": $scope.MotorExaminationObj,*/
                "SquintPossibleDiagnosis": $scope.MotorExaminationObj.SquintPossibleDiagnosis,
                "SquintPossibleDiagnosisId": $scope.MotorExaminationObj.SquintPossibleDiagnosisId,
                "BVPossibleDiagnosis": $scope.MotorExaminationObj.BVPossibleDiagnosis,
                "BVPossibleDiagnosisId": $scope.MotorExaminationObj.BVPossibleDiagnosisId,
                //"Conforntfield": $scope.Conforntfield,
                //"Conforntational": $scope.Conforntational,
                "ColorVisionDetails": $scope.FinalColorVisionDetails || [],
                "AmslergridDetails": $scope.FinalNewAmslerGridArray || [],
                "ConfrontationalFieldArray": $scope.FinalConfrontationalFieldArray || [],
                "GonioscopyDetails": $scope.FinalGonioscopyDetails || [],
                "DryEyeEvaluationData": $scope.FinalDryEyeEvaluationData || [],
                "SquintDetails": $scope.FinalSquintDetails || [],
                "HeadPosterDetails": $scope.FinalHeadPosterDetails || [],
                "NearInvestigationdetails": $scope.FinalNearInvestigationdetails || [],
                "NineGazeExtraOcularDetails": $scope.FinalNineGazeExtraOcularDetails || [],
                //"AnteriorSegmentDetails": $scope.cacheStorageItem.AnteriorDetails || [],
                //"PosteriorSegmentDetails": $scope.cacheStorageItem.PosteriorSegmentDetails ||[],
                "ExternalExaminationDetails": $scope.FinalExternalExaminationDetails || [],
                "AnteriorIsNormal": $scope.cacheStorageItem.AnteriorIsNormal || false,
                "PosteriorIsNormal": $scope.cacheStorageItem.PosteriorIsNormal || false,
                "IsPosteriorExtendedOpthalmology": $scope.cacheStorageItem.IsPosteriorExtendedOpthalmology || false,
                "ExternalExaminationIsNormal": $scope.cacheStorageItem.IsPosteriorExtendedOpthalmology || false,
                "HertelsExaminationDetails": $scope.FinalHertelsExaminationArray || [],
                "LacrimalPatiencyDetails": $scope.FinalLacrimalPatiencyDetails || [],
                "LacrimalPatencyRemarks": $scope.cacheStorageItem.LacrimalPatencyRemarks || "",
                "AnteriorSegmentArrayNew": $scope.cacheStorageItem.AnteriorSegmentArrayNew || [],
                "PoteriorSegmentArrayNew": $scope.cacheStorageItem.PoteriorSegmentArrayNew || [],
                "PosteriorLensId": $scope.cacheStorageItem.PosteriorLensId || 0,
                "PosteriorRemarks": "",
                "IsExamedwithTorchused": $scope.cacheStorageItem.IsExamedwithTorchused || false,
                "ODExtraOcularFreelymovingInd": $scope.MotorExaminationObj.ODExtraOcularFreelymovingInd,
                "OSExtraOcularFreelymovingInd": $scope.MotorExaminationObj.OSExtraOcularFreelymovingInd

            }
            /*  console.log($scope.ExaminationReqobj);*/
            eHnoteDiagnosisDataServices.AddupdateExaminationsData($scope.ExaminationReqobj).then(function (response) {
                if (response.data.data.Status === 'Success') {


                    var consultationid = $scope.cacheStorageItem.ConsultationID
                    var AppointmentID = $scope.cacheStorageItem.appointmentid;
                    /*     $scope.GetPatientAppointmenthistroy = function (consultationid, AppointmentID) {*/
                    var type = 0;
                    if (consultationid === 0) {
                        type = 1;
                    }
                    var object = {
                        "AppointmentId": AppointmentID,
                        "Type": type
                    };
                    //eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
                    //    if (resp.data !== undefined) {
                    //        $scope.treatmentData = resp.data;
                    //        $scope.treatmentArray = [];
                    //        $scope.SelectedPlanArray = [];
                    //        $scope.SelectedPlanArray = $filter("filter")($scope.treatmentData, { "AppointmentId": AppointmentID }, true);
                    //        if ($scope.SelectedPlanArray.length > 0) {
                    //            if ($scope.SelectedPlanArray[0].AnteriorSegmentDetails.length != 0) {
                    //                $scope.cacheStorageItem.AnteriorSegmentArrayNew = [];
                    //                $scope.cacheStorageItem.AnteriorSegmentArrayNew = $scope.SelectedPlanArray[0].AnteriorSegmentDetails || [];
                    //                //angular.forEach($scope.SelectedPlanArray[0].AnteriorSegmentDetails, function (Aitem) {
                    //                //    //angular.forEach($scope.cacheStorageItem.AnteriorSegmentArrayNew, function (Bitem) {
                    //                //    //    if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                //    //        Bitem.PatientFindingAnteriorId = Aitem.PatientFindingAnteriorId;
                    //                //    //    }
                    //                //    //});


                    //                //});
                    //            }
                    //            if ($scope.SelectedPlanArray[0].ColorVisionDetails.length != 0) {

                    //                angular.forEach($scope.SelectedPlanArray[0].ColorVisionDetails, function (Aitem) {
                    //                    angular.forEach($scope.cacheStorageItem.ColorVisionDetails, function (Bitem) {
                    //                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                            Bitem.PatientFindingColorVisionId = Aitem.PatientFindingColorVisionId;
                    //                        }
                    //                    });

                    //                });
                    //            }
                    //            if ($scope.SelectedPlanArray[0].ConfrontationalFieldTestDetails.length != 0) {

                    //                angular.forEach($scope.SelectedPlanArray[0].ConfrontationalFieldTestDetails, function (Aitem) {
                    //                    angular.forEach($scope.cacheStorageItem.ConfrontationalFieldArray, function (Bitem) {
                    //                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                            Bitem.PatientConfrontationalFieldTestId = Aitem.PatientConfrontationalFieldTestId;
                    //                        }
                    //                    });

                    //                });
                    //            }
                    //            if ($scope.SelectedPlanArray[0].NewAmslerGridArray.length != 0) {

                    //                angular.forEach($scope.SelectedPlanArray[0].NewAmslerGridArray, function (Aitem) {
                    //                    angular.forEach($scope.cacheStorageItem.NewAmslerGridArray, function (Bitem) {
                    //                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                            Bitem.PatientAmslerGridId = Aitem.PatientAmslerGridId;
                    //                        }
                    //                    });

                    //                });
                    //            }
                    //            if ($scope.SelectedPlanArray[0].DryEyeEvaluationData.length != 0) {

                    //                angular.forEach($scope.SelectedPlanArray[0].DryEyeEvaluationData, function (Aitem) {
                    //                    angular.forEach($scope.cacheStorageItem.DryEyeEvaluationData, function (Bitem) {
                    //                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                            Bitem.PatientDryEyeEvalutionId = Aitem.PatientDryEyeEvalutionId;
                    //                        }
                    //                    });

                    //                });
                    //            }
                    //            if ($scope.SelectedPlanArray[0].GonioscopyDetails.length != 0) {
                    //                angular.forEach($scope.SelectedPlanArray[0].GonioscopyDetails, function (Aitem) {
                    //                    angular.forEach($scope.cacheStorageItem.GonioscopyDetails, function (Bitem) {
                    //                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                            Bitem.PatientGonioscopyId = Aitem.PatientGonioscopyId;
                    //                        }
                    //                    });
                    //                });
                    //            }
                    //            if ($scope.SelectedPlanArray[0].HeadPosterDetails.length != 0) {
                    //                angular.forEach($scope.SelectedPlanArray[0].HeadPosterDetails, function (Aitem) {
                    //                    angular.forEach($scope.MotorExaminationObj.HeadPosterDetails, function (Bitem) {
                    //                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                            Bitem.PatientSquintId = Aitem.PatientSquintId;
                    //                        }
                    //                    });
                    //                });
                    //            }
                    //            if ($scope.SelectedPlanArray[0].HertelsExaminationDetails.length != 0) {
                    //                angular.forEach($scope.SelectedPlanArray[0].HertelsExaminationDetails, function (Aitem) {
                    //                    angular.forEach($scope.cacheStorageItem.HertelsExaminationArray, function (Bitem) {
                    //                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                            Bitem.PatientHertelsExaminationId = Aitem.PatientHertelsExaminationId;
                    //                        }
                    //                    });
                    //                });
                    //            }
                    //            if ($scope.SelectedPlanArray[0].LacrimalPatiencyDetails.length != 0) {
                    //                angular.forEach($scope.SelectedPlanArray[0].LacrimalPatiencyDetails, function (Aitem) {
                    //                    angular.forEach($scope.cacheStorageItem.LacrimalPatiencyDetails, function (Bitem) {
                    //                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                            Bitem.PatientFindingLacrimalPatiencyId = Aitem.PatientFindingLacrimalPatiencyId;
                    //                        }
                    //                    });
                    //                });
                    //            }
                    //            if ($scope.SelectedPlanArray[0].NearInvestigationdetails.length != 0) {
                    //                angular.forEach($scope.SelectedPlanArray[0].NearInvestigationdetails, function (Aitem) {
                    //                    angular.forEach($scope.MotorExaminationObj.NearInvestigationdetails, function (Bitem) {
                    //                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                            Bitem.PatientSquintId = Aitem.PatientSquintId;
                    //                        }
                    //                    });
                    //                });
                    //            }
                    //            if ($scope.SelectedPlanArray[0].NineGazeExtraOcularDetails.length != 0) {
                    //                angular.forEach($scope.SelectedPlanArray[0].NineGazeExtraOcularDetails, function (Aitem) {
                    //                    angular.forEach($scope.MotorExaminationObj.NineGazeExtraOcularDetails, function (Bitem) {
                    //                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                            Bitem.PatientSquintId = Aitem.PatientSquintId;
                    //                        }
                    //                    });
                    //                });
                    //            }
                    //            if ($scope.SelectedPlanArray[0].PosteriorSegmentDetails.length != 0) {
                    //                //angular.forEach($scope.SelectedPlanArray[0].PosteriorSegmentDetails, function (Aitem) {
                    //                //    angular.forEach($scope.cacheStorageItem.PoteriorSegmentArrayNew, function (Bitem) {
                    //                //        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                //            Bitem.PatientFindingPosteriorId = Aitem.PatientFindingPosteriorId;
                    //                //        }
                    //                //    });
                    //                //});

                    //                $scope.cacheStorageItem.PoteriorSegmentArrayNew = [];
                    //                $scope.cacheStorageItem.PoteriorSegmentArrayNew = $scope.SelectedPlanArray[0].PosteriorSegmentDetails || [];
                    //            }
                    //            if ($scope.SelectedPlanArray[0].SquintDetails.length != 0) {
                    //                angular.forEach($scope.SelectedPlanArray[0].SquintDetails, function (Aitem) {
                    //                    angular.forEach($scope.MotorExaminationObj.SquintDetails, function (Bitem) {
                    //                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                    //                            Bitem.PatientSquintId = Aitem.PatientSquintId;
                    //                            if (Aitem.InvestigationId == 719 && Bitem.InvestigationId == 719) {
                    //                                if (Aitem.PrismCoverDetailsArray != undefined) {
                    //                                    if (Aitem.PrismCoverDetailsArray.length > 0) {
                    //                                        Bitem.PrismCoverDetailsArray = [];
                    //                                        Bitem.PrismCoverDetailsArray = Aitem.PrismCoverDetailsArray || [];
                    //                                    }
                    //                                }
                    //                            }
                    //                            if (Aitem.InvestigationId == 2095 && Bitem.InvestigationId == 2095) {
                    //                                if (Aitem.InvestigationOrgans != undefined) {
                    //                                    if (Aitem.InvestigationOrgans.length > 0) {
                    //                                        Bitem.InvestigationOrgans = [];
                    //                                        Bitem.InvestigationOrgans = Aitem.InvestigationOrgans || [];
                    //                                    }
                    //                                }
                    //                            }
                    //                        }
                    //                    });
                    //                });
                    //            }

                    //            $uibModalInstance.close($scope.obj);
                    //        }

                    //    }
                    //}, function (err) {
                    //    alertify.error(err.data.ExceptionMessage);
                    //});


                    $uibModalInstance.close($scope.obj);

                }

            });
              
        }
        //$scope.GonioscopyGetPigmentData = function () {
        //    eHnoteDiagnosisDataServices.GetMasterGonioscopyPigmentValues().then(function (response) {
        //        if (response.data.status === "Success") {
        //            if (response.data.rows.length > 0) {
        //                $scope.PigmentArrayList = [];
        //                $scope.GetPigmentArrayList = [];
        //                $scope.GetDepthArrayList = [];
        //                $scope.DepthArrayList = [];

        //                $scope.PigmentArrayList = response.data.rows;
        //                $scope.GetPigmentArrayList = response.data.rows;
        //                $scope.GetDepthArrayList = response.data.DepthGonioscopy;
        //                $scope.DepthArrayList = response.data.DepthGonioscopy;
        //            }
        //        }
        //        if (response.Status === 'Failure') {
        //            alertify.error(response.data.Message);
        //        }
        //    });
        //};

        //$scope.GonioscopyGetPigmentData();
        //$scope.GonioscopyGetStructureData = function () {
        //    eHnoteDiagnosisDataServices.GetMasterGonioscopyStructureValues().then(function (response) {
        //        if (response.data.status === "Success") {
        //            if (response.data.rows.length > 0) {
        //                $scope.GonioscopyStructuresdropdown = [];
        //                $scope.GetGonioscopyStructuresdropdown = [];

        //                $scope.GonioscopyStructuresdropdown = response.data.rows;
        //                $scope.GetGonioscopyStructuresdropdown = response.data.rows;
        //            }
        //        }
        //        if (response.Status === 'Failure') {
        //            alertify.error(response.data.Message);
        //        }
        //    });
        //};
        //$scope.GonioscopyGetStructureData();

        //$scope.GetExaminationMasterDataDetails = function () {
        //    eHnoteDiagnosisDataServices.GetExaminationMasterData().then(function (response) {
        //        if (response.data.status === "Success") {
        //            if (response.data.rows.length > 0) {
        //                $scope.PigmentArrayList = [];
        //                $scope.GetPigmentArrayList = [];
        //                $scope.GetDepthArrayList = [];
        //                $scope.DepthArrayList = [];
        //                /* $scope.PossiableDiagonsis = [];*/
        //                // $scope.PossibleDiagnosisArray = [];
        //                // $scope.GetPossibleDiagnosisArray = [];



        //                $scope.PigmentArrayList = response.data.rows;
        //                $scope.GetPigmentArrayList = response.data.rows;
        //                $scope.GetDepthArrayList = response.data.DepthGonioscopy;
        //                $scope.DepthArrayList = response.data.DepthGonioscopy;




        //                //$scope.PossibleDiagnosisArray = response.data.GonioscopyPossible;
        //                // $scope.GetPossibleDiagnosisArray = response.data.GonioscopyPossible;



        //                //$scope.SquintPossibleDiagnosis = response.data.SquintEvaluationPossible;
        //                // $scope.BinocularPossibleDiagnosis = response.data.BinocularVisionPossible;




        //            }
        //        }
        //        if (response.Status === 'Failure') {
        //            alertify.error(response.data.Message);
        //        }
        //    });
        //};


       
        //$scope.GetExaminationMasterDataDetails();
      
        $scope.init = function () {
            //let obj = {
            //    "UserId": doctorinfo.doctorid,
            //    "SearchText": "",
            //    "PageSize": 10,
            //    /*"TypeId": 1,*/
            //    "PageNumber": 1,
            //    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            //    "IsFavoriteInd": 0
            //}
            //let obj1 = {
            //    "UserId": doctorinfo.doctorid,
            //    "SearchText": "",
            //    "PageSize": 10,
            //    "TypeId": 2,
            //    "PageNumber": 1,
            //    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            //    "IsFavoriteInd": 0
            //}
            var params = {
                "CategoryId": 5,
                "FindingId": 0,
                "PageSize": 1000,
                "PageNumber": 1,
                "SearchText": "",
            }
            var params1 = {
                "CategoryId": 6,
                "FindingId": 0,
                "PageSize": 1000,
                "PageNumber": 1,
                "SearchText": "",
            }
            var params2 = {
                "UserId": $scope.UserId,
                "SearchText": "",
                "PageSize": 10,
                "PageNumber": 1,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "IsFavoriteInd": 0
            }
            $q.all([

                eHnoteDiagnosisDataServices.GetExaminationMasterData(),
                eHnoteDbStaticDataService.getMasterFindingValues(params),
                eHnoteDbStaticDataService.getMasterFindingValues(params1),
                eHnotePatientDataService.GetUserConsultationTemplateDetails(params2)
                /*eHnoteDiagnosisDataServices.GetMasterGonioscopyPigmentValues(),*/
                /*eHnoteDiagnosisDataServices.GetMasterGonioscopyStructureValues(),*/
                /*eHnotePatientDataService.GetExaminationTemplateDetails(obj),*/
                /*eHnotePatientDataService.GetExaminationTemplateDetails(obj1),*/
               
            ]).then(function (response) {

                if (response[0].data.status === "Success") {
                    if (response[0].data.rows.length > 0) {
                        $scope.PigmentArrayList = [];
                        $scope.GetPigmentArrayList = [];
                        $scope.GetDepthArrayList = [];
                        $scope.DepthArrayList = [];
                        /* $scope.PossiableDiagonsis = [];*/
                        // $scope.PossibleDiagnosisArray = [];
                        // $scope.GetPossibleDiagnosisArray = [];
                        $scope.GonioscopyStructuresdropdown = [];
                        
                        $scope.PigmentArrayList = response[0].data.rows;
                        $scope.GetPigmentArrayList = response[0].data.rows;
                        $scope.GetDepthArrayList = response[0].data.DepthGonioscopy;
                        $scope.DepthArrayList = response[0].data.DepthGonioscopy;
                        $scope.GonioscopyStructuresdropdown = response[0].data.GonioscopyStructurevalues;
                        
                        //$scope.PossibleDiagnosisArray = response.data.GonioscopyPossible;
                        // $scope.GetPossibleDiagnosisArray = response.data.GonioscopyPossible;

                        //$scope.SquintPossibleDiagnosis = response.data.SquintEvaluationPossible;
                        // $scope.BinocularPossibleDiagnosis = response.data.BinocularVisionPossible;


                    }
                }
                if (response[1].data.status === "Success") {
                    if (response[1].data.rows !== undefined) {
                        $scope.AnteriorINVDropdownListMain = response[1].data.rows || [];
                        $scope.AnteriorINVDropdownList = angular.copy($scope.AnteriorINVDropdownListMain);
                    }
                }
                if (response[2].data.status == "Success") {
                    if (response[2].data.rows !== undefined) {
                        $scope.PosteriorINVDropdownListMain = response[2].data.rows || [];
                        if ($scope.PosteriorINVDropdownListMain.length > 0) {
                            $scope.PosteriorINVDropdownList = angular.copy($scope.AnteriorINVDropdownListMain);
                        }

                    }
                }
                if (response[3].data.Status == "Success") {
                    $scope.DiagnosisTemplatesArray = response[3].data.AssessmentsPlanArray || [];
                    $scope.AnteriorTemplatesArray = response[3].data.ExaminationTemplatesArray || [];
                    if ($scope.AnteriorTemplatesArray.length > 0) {
                        angular.forEach($scope.AnteriorTemplatesArray, function (mitem) {
                            mitem.IsEdit = false;
                            //item.IsDescriptionEdit = false;
                        });
                    }
                    $scope.AnteriorTemplatesArray[0].IsEdit = true;
                }
                //if (response[1].data.status === "Success") {
                //    if (response[1].data.rows.length > 0) {
                //        $scope.PigmentArrayList = [];
                //        $scope.GetPigmentArrayList = [];
                //        $scope.GetDepthArrayList = [];
                //        $scope.DepthArrayList = [];

                //        $scope.PigmentArrayList = response[1].data.rows;
                //        $scope.GetPigmentArrayList = response[1].data.rows;
                //        $scope.GetDepthArrayList = response[1].data.DepthGonioscopy;
                //        $scope.DepthArrayList = response[1].data.DepthGonioscopy;
                //    }
                //}
                //if (response[2].data.status === "Success") {
                //    if (response[2].data.rows.length > 0) {
                //        $scope.GonioscopyStructuresdropdown = [];
                //        $scope.GetGonioscopyStructuresdropdown = [];
                //        /*GonioscopyStructuresvalues*/
                //        $scope.GonioscopyStructuresdropdown = response[2].data.rows;
                //        $scope.GetGonioscopyStructuresdropdown = response[2].data.rows;
                //    }
                //}
                //if (response[1].data.Status == "Success") {
                //    $scope.AnteriorTemplatesArray = response[1].data.rows || [];
                //}
                //if (response[4].data.Status == "Success") {
                //    $scope.PosteriorTemplatesArray = response[4].data.rows || [];
                //}
                
                if ($scope.CategoryDetails.length > 0) {
                    angular.forEach($scope.CategoryDetails, function (subitem) {
                        if (subitem.SubCategoryId == 38) {
                            $scope.examinationtab = 1;
                            $scope.submotorexaminationtab = 5;
                        }
                    });
                }
                if ($scope.CategoryDetails.length > 0) {
                    angular.forEach($scope.CategoryDetails, function (subitem) {
                        if (subitem.SubCategoryId == 23) {
                            $scope.examinationtab = 1;
                            $scope.submotorexaminationtab = 8;
                        }
                    });
                }
                if ($scope.CategoryDetails.length > 0) {
                    angular.forEach($scope.CategoryDetails, function (subitem) {
                        if (subitem.SubCategoryId == 22) {
                            $scope.examinationtab = 1;
                            $scope.submotorexaminationtab = 6;
                        }
                    });
                }

                if ($scope.CategoryDetails.length > 0) {
                    angular.forEach($scope.CategoryDetails, function (subitem) {
                        if (subitem.SubCategoryId == 78) {
                            $scope.examinationtab = 1;
                            $scope.submotorexaminationtab = 7;
                        }
                    });
                }

                if (FocusSubTab.Focus !== undefined) {
                    $scope.examinationtab = FocusSubTab.Focus;
                }
                if (FocusSubTab.Type !== undefined) {
                    $scope.subexaminationtab = FocusSubTab.Type;
                }
                if (FocusSubTab.Subtype !== undefined) {
                    $scope.submotorexaminationtab = FocusSubTab.Subtype;
                }
                if (FocusSubTab.Focus == 1) {
                    $scope.SubexaminationClick($scope.submotorexaminationtab);
                }
                if (FocusSubTab.Focus == 2) {
                    //$timeout(function () {
                    $scope.ClickTabExam(2);
                    //}, 1000)

                }

            }, function (err) {
                alertify.error("Getting Data Failed");
            });

        };
        $scope.init();

        $scope.ClickTabExam = function (value) {
            if (value == 1) {
                $scope.subexaminationtab = 1;
                $scope.closeTemplateView();
            }
            if (value == 3) {
                if ($scope.examinationtab != value) {
                    $scope.submotorexaminationtab = 1;
                }
            }
            if (value == 4) {
                if ($scope.examinationtab != value) {
                    $scope.submotorexaminationtab = 6;
                }
            }

            $scope.examinationtab = value;
            if ($scope.examinationtab == 3) {
                $scope.submotorexaminationtab = 1;
            }
            if ($scope.examinationtab == 4) {
                $scope.submotorexaminationtab = 6;
                //if ($scope.cacheStorageItem.DryEyeEvaluationData.length > 0) {
                //    $scope.DryEyeEvalution.SummaryEdit = false;
                //}
            }
            if ($scope.examinationtab == 2) {


                angular.forEach($scope.GonioscopyDetailsList, function (ritem) {
                    if (ritem.RightEye.RightValue != '') {
                        ritem.RightEye.RightValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": ritem.RightEye.RightValue }, true)[0] || [];
                    }
                    if (ritem.RightEye.LeftValue != '') {
                        ritem.RightEye.LeftValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": ritem.RightEye.LeftValue }, true)[0] || [];
                    }
                    if (ritem.RightEye.TopValue != '') {
                        ritem.RightEye.TopValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": ritem.RightEye.TopValue }, true)[0] || [];
                    }
                    if (ritem.RightEye.BottomValue != '') {
                        ritem.RightEye.BottomValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": ritem.RightEye.BottomValue }, true)[0] || [];
                    }
                    if (ritem.RightEye.PigmentValue != '') {
                        ritem.RightEye.PigmentValueObj = $filter("filter")($scope.PigmentArrayList, { "Name": ritem.RightEye.PigmentValue }, true)[0] || [];
                    }
                    if (ritem.RightEye.PossibleDiagnosisName != '') {
                        // ritem.RightEye.PossibleDiagnosisObject = $filter("filter")($scope.PossibleDiagnosisArray, { "DiagnosisName": ritem.RightEye.PossibleDiagnosisName }, true)[0] || [];
                        var filterpossiable = $filter("filter")($scope.PossibleDiagnosisArray, { "DiagnosisId": ritem.RightEye.PossibleDiagnosisId }, true) || [];
                        if (filterpossiable.length > 0) {
                            ritem.RightEye.PossibleDiagnosisObject = filterpossiable[0];
                            ritem.RightEye.PossibleDiagnosisName = filterpossiable[0].DiagnosisName;
                        }

                    }
                    //vijay//

                    if (ritem.RightEye.DepthRightValue != '') {
                        ritem.RightEye.DepthRightValueObj = $filter("filter")($scope.DepthArrayList, { "Name": ritem.RightEye.DepthRightValue }, true)[0] || [];
                    }
                    if (ritem.RightEye.DepthLeftValue != '') {
                        ritem.RightEye.DepthLeftValueObj = $filter("filter")($scope.DepthArrayList, { "Name": ritem.RightEye.DepthLeftValue }, true)[0] || [];
                    }
                    if (ritem.RightEye.DepthTopValue != '') {
                        ritem.RightEye.DepthTopValueObj = $filter("filter")($scope.DepthArrayList, { "Name": ritem.RightEye.DepthTopValue }, true)[0] || [];
                    }
                    if (ritem.RightEye.DepthBottomValue != '') {
                        ritem.RightEye.DepthBottomValueObj = $filter("filter")($scope.DepthArrayList, { "Name": ritem.RightEye.DepthBottomValue }, true)[0] || [];
                    }

                    //vijay//

                    if (ritem.LeftEye.RightValue != '') {
                        ritem.LeftEye.RightValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": ritem.LeftEye.RightValue }, true)[0] || [];
                    }
                    if (ritem.LeftEye.LeftValue != '') {
                        ritem.LeftEye.LeftValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": ritem.LeftEye.LeftValue }, true)[0] || [];
                    }
                    if (ritem.LeftEye.TopValue != '') {
                        ritem.LeftEye.TopValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": ritem.LeftEye.TopValue }, true)[0] || [];
                    }
                    if (ritem.LeftEye.BottomValue != '') {
                        ritem.LeftEye.BottomValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": ritem.LeftEye.BottomValue }, true)[0] || [];
                    }
                    if (ritem.LeftEye.PigmentValue != '') {
                        ritem.LeftEye.PigmentValueObj = $filter("filter")($scope.PigmentArrayList, { "Name": ritem.LeftEye.PigmentValue }, true)[0] || [];
                    }
                    if (ritem.LeftEye.PossibleDiagnosisName != '') {
                        // ritem.LeftEye.PossibleDiagnosisObject = $filter("filter")($scope.PossibleDiagnosisArray, { "DiagnosisName": ritem.LeftEye.PossibleDiagnosisName }, true)[0] || [];

                        // var filterpossiable = $filter("filter")($scope.PossibleDiagnosisArray, { "DiagnosisId": ritem.LeftEye.PossibleDiagnosisId }, true) || [];
                        var filterpossiable = $filter("filter")($scope.PossibleDiagnosisArray, { "DiagnosisName": ritem.LeftEye.PossibleDiagnosisName }, true) || [];
                        if (filterpossiable.length > 0) {
                            ritem.LeftEye.PossibleDiagnosisObject = filterpossiable[0];
                            //ritem.LeftEye.PossibleDiagnosisName = filterpossiable[0].DiagnosisName;
                            ritem.LeftEye.PossibleDiagnosisId = filterpossiable[0].DiagnosisId;
                        }
                    }

                    //vijay//

                    if (ritem.LeftEye.DepthRightValue != '') {
                        ritem.LeftEye.DepthRightValueObj = $filter("filter")($scope.DepthArrayList, { "Name": ritem.LeftEye.DepthRightValue }, true)[0] || [];
                    }
                    if (ritem.LeftEye.DepthLeftValue != '') {
                        ritem.LeftEye.DepthLeftValueObj = $filter("filter")($scope.DepthArrayList, { "Name": ritem.LeftEye.DepthLeftValue }, true)[0] || [];
                    }
                    if (ritem.LeftEye.DepthTopValue != '') {
                        ritem.LeftEye.DepthTopValueObj = $filter("filter")($scope.DepthArrayList, { "Name": ritem.LeftEye.DepthTopValue }, true)[0] || [];
                    }
                    if (ritem.LeftEye.DepthBottomValue != '') {
                        ritem.LeftEye.DepthBottomValueObj = $filter("filter")($scope.DepthArrayList, { "Name": ritem.LeftEye.DepthBottomValue }, true)[0] || [];
                    }

                    //vijay//


                });
            }

        }
        //$scope.gonioscopyuibclose = function (item) {           
        //    $uibModalInstance.dismiss("cancel");
        //};
        //$scope.gonioscopySave = function () {
        //    $scope.cacheStorageItem.GonioscopyDetails = angular.copy($scope.GonioscopyDetailsList);
        //    $uibModalInstance.dismiss("cancel");
        //};
        $scope.changeGonioscopyValue = function (item, mitem, type, mtype) {
            mitem = mitem || "";
            if (mtype === 'Right') {
                if (type === 'top') {
                    if (mitem === "") {
                        item.RightEye.TopValue = "";
                    }
                    else {
                        item.RightEye.TopValue = mitem.Name;
                    }
                }
                if (type === 'right') {
                    if (mitem === "") {
                        item.RightEye.RightValue = "";
                    }
                    else {
                        item.RightEye.RightValue = mitem.Name;
                    }
                }
                if (type === 'left') {
                    if (mitem === "") {
                        item.RightEye.LeftValue = "";
                    }
                    else {
                        item.RightEye.LeftValue = mitem.Name;
                    }
                }
                if (type === 'bottom') {
                    if (mitem === "") {
                        item.RightEye.BottomValue = "";
                    }
                    else {
                        item.RightEye.BottomValue = mitem.Name;
                    }
                }
                if (type === 'Pigment') {
                    if (mitem === "") {
                        item.RightEye.PigmentValue = "";
                    }
                    else {
                        item.RightEye.PigmentValue = mitem.Name;
                    }
                }
                if (type === 'depthtop') {
                    if (mitem === "") {
                        item.RightEye.DepthTopValue = "";
                    }
                    else {
                        item.RightEye.DepthTopValue = mitem.Name;
                    }
                }
                if (type === 'depthright') {
                    if (mitem === "") {
                        item.RightEye.DepthRightValue = "";
                    }
                    else {
                        item.RightEye.DepthRightValue = mitem.Name;
                    }
                }
                if (type === 'depthleft') {
                    if (mitem === "") {
                        item.RightEye.DepthLeftValue = "";
                    }
                    else {
                        item.RightEye.DepthLeftValue = mitem.Name;
                    }
                }
                if (type === 'depthbottom') {
                    if (mitem === "") {
                        item.RightEye.DepthBottomValue = "";
                    }
                    else {
                        item.RightEye.DepthBottomValue = mitem.Name;
                    }
                }
            }
            else {
                if (type === 'top') {

                    if (mitem === "") {
                        item.LeftEye.TopValue = "";
                    }
                    else {
                        item.LeftEye.TopValue = mitem.Name;
                    }
                }
                if (type === 'right') {
                    if (mitem === "") {
                        item.LeftEye.RightValue = "";
                    }
                    else {
                        item.LeftEye.RightValue = mitem.Name;
                    }
                }
                if (type === 'left') {
                    if (mitem === "") {
                        item.LeftEye.LeftValue = "";
                    }
                    else {
                        item.LeftEye.LeftValue = mitem.Name;
                    }
                }
                if (type === 'bottom') {
                    if (mitem === "") {
                        item.LeftEye.BottomValue = "";
                    }
                    else {
                        item.LeftEye.BottomValue = mitem.Name;
                    }
                }
                if (type === 'Pigment') {
                    if (mitem === "") {
                        item.LeftEye.PigmentValue = "";
                    }
                    else {
                        item.LeftEye.PigmentValue = mitem.Name;
                    }
                }
                if (type === 'depthtop') {
                    if (mitem === "") {
                        item.LeftEye.DepthTopValue = "";
                    }
                    else {
                        item.LeftEye.DepthTopValue = mitem.Name;
                    }
                }
                if (type === 'depthright') {
                    if (mitem === "") {
                        item.LeftEye.DepthRightValue = "";
                    }
                    else {
                        item.LeftEye.DepthRightValue = mitem.Name;
                    }
                }
                if (type === 'depthleft') {
                    if (mitem === "") {
                        item.LeftEye.DepthLeftValue = "";
                    }
                    else {
                        item.LeftEye.DepthLeftValue = mitem.Name;
                    }
                }
                if (type === 'depthbottom') {
                    if (mitem === "") {
                        item.LeftEye.DepthBottomValue = "";
                    }
                    else {
                        item.LeftEye.DepthBottomValue = mitem.Name;
                    }
                }

            }

            $scope.AddToCache();
        }
        $scope.closeuib = function () {
            angular.forEach($scope.ConfrontationalODDrawListFourField, function (hitem, index) {
                hitem.IsChecked = false;
            });
            angular.forEach($scope.ConfrontationalOSDrawListFourField, function (hitem, index) {
                hitem.IsChecked = false;
            });
            angular.forEach($scope.ConfrontationalODDrawList, function (hitem, index) {
                hitem.IsChecked = false;
            });
            angular.forEach($scope.ConfrontationalOSDrawList, function (hitem, index) {
                hitem.IsChecked = false;
            });
            $uibModalInstance.dismiss("cancel");
        };

        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        };

        $scope.changeInvestigationDryDate = function (obj, ssitem) {
            if (ssitem == null) {
                return false
            }
            obj.SelectedInvestigationObj = angular.copy(ssitem);

            var ddArray = [];
            ddArray = $filter("filter")($scope.cacheStorageItem.DryEyeEvaluationData, function (item, index) { return item.InvestigationId === obj.SelectedInvestigationObj.InvestigationId && item.ActiveInd === "Y" });

            if (ddArray.length > 0) {
                $scope.DryEyeEvalution.SummaryEdit = false;
                $scope.DryEyeEvalution.DryEyeInvestigationId = ddArray[0].InvestigationId;
            } else {
                $scope.DryEyeEvalution.SummaryEdit = true;
            }
            //if (ddArray.length > 0) {
            //    alertify.error("Already Added");
            //    return false;
            //} else {
            if (obj.SelectedInvestigationObj != "" && obj.SelectedInvestigationObj != null) {
                obj.InvestigationId = obj.SelectedInvestigationObj.InvestigationId;
                obj.OrgInvestigationId = obj.SelectedInvestigationObj.OrgInvestigationId;
                obj.InvestigationDesc = obj.SelectedInvestigationObj.Investigation;

                obj.ODValue1 = "";
                obj.ODValue2 = "";
                obj.ODvalue3 = "";
                obj.OSValue1 = "";
                obj.OSValue2 = "";
                obj.OSvalue3 = "";
                obj.RemarksEdit = "";
                obj.Remarks = "";
                obj.ODValue21 = "";
                obj.ODvalue31 = "";
                obj.OSValue21 = "";
                obj.OSvalue31 = "";
            }
            //}

            angular.forEach($scope.dryEyeEvalution.Array, function (subitem) {
                subitem.IsSubtabActive = false;
            });
            ssitem.IsSubtabActive = true;
        };

        $scope.DiscardDryEyeEvalData = function () {

            if ($scope.DryEyeEvalutionAddobj.InvestigationId == 2079) {
                $scope.DryEyeEvalutionAddobj.ODValue2 = "";
                $scope.DryEyeEvalutionAddobj.ODvalue3 = "";
                $scope.DryEyeEvalutionAddobj.OSValue2 = "";
                $scope.DryEyeEvalutionAddobj.OSvalue3 = "";
                $scope.DryEyeEvalutionAddobj.Remarks = "";
                $scope.DryEyeEvalutionAddobj.ODValue21 = "";
                $scope.DryEyeEvalutionAddobj.ODvalue31 = "";
                $scope.DryEyeEvalutionAddobj.OSValue21 = "";
                $scope.DryEyeEvalutionAddobj.OSvalue31 = "";
            }
            if ($scope.DryEyeEvalutionAddobj.InvestigationId == 2082) {
                $scope.DryEyeEvalutionAddobj.ODValue1 = "";
                $scope.DryEyeEvalutionAddobj.OSValue1 = "";
            }
            if ($scope.DryEyeEvalutionAddobj.InvestigationId == 2103) {
                $scope.DryEyeEvalutionAddobj.ODValue2 = "";
                $scope.DryEyeEvalutionAddobj.OSValue2 = "";
            }
            if ($scope.DryEyeEvalutionAddobj.InvestigationId == 2166) {
                $scope.DryEyeEvalutionAddobj.ODValue1 = "";
                $scope.DryEyeEvalutionAddobj.OSValue1 = "";
            }
        }

        function resetdryEyeEvalution() {
            if ($scope.dryEyeEvalution.Array.length > 0) {
                $scope.DryEyeEvalutionAddobj.SelectedInvestigationObj = $scope.dryEyeEvalution.Array[0];
                $scope.DryEyeEvalutionAddobj.InvestigationId = $scope.dryEyeEvalution.Array[0].InvestigationId;
                $scope.DryEyeEvalutionAddobj.OrgInvestigationId = $scope.dryEyeEvalution.Array[0].OrgInvestigationId;
                $scope.DryEyeEvalutionAddobj.InvestigationDesc = $scope.dryEyeEvalution.Array[0].Investigation;
            }
        }
        //  resetdryEyeEvalution();

        $scope.AddDryEyeEvalData = function (obj, Edit) {

            //if (Edit !== true) {
            //    var ddArray = $filter("filter")($scope.cacheStorageItem.DryEyeEvaluationData, function (item, index) { return item.InvestigationId === obj.SelectedInvestigationObj.InvestigationId && item.ActiveInd === "Y" });
            //    if (ddArray.length > 0) {
            //        alertify.error("Already Added");
            //        return false;
            //    }
            //}
            if (obj.ODValue1 == "" && obj.ODValue2 == "" && obj.ODvalue3 == "" && obj.OSValue1 == "" && obj.OSValue2 == "" && obj.OSvalue3 == "" && obj.Remarks == "" &&
                obj.ODValue11 == "" && obj.ODValue21 == "" && obj.ODvalue31 == "" && obj.OSValue11 == "" && obj.OSValue21 == "" && obj.OSvalue31 == "") {
                alertify.error("Enter Values");
                return false;
            }

            obj.RightEyeArray = [];
            obj.LeftEyeArray = [];
            obj.RightEyeUndoCount = 0;
            obj.LeftEyeUndoCount = 0;
            obj.SelectedInvestigationObj = obj.SelectedInvestigationObj || "";
            obj.RightEyeEdit = false;
            obj.LeftEyeEdit = false;
            obj.RightPwCanvas = "RightPwCanvas" + obj.InvestigationId;
            obj.LeftPwCanvas = "LeftPwCanvas" + obj.InvestigationId;
            obj.RightEyeRemarks = obj.RightEyeRemarks || "";
            obj.RightEyeRemarksId = 0;
            obj.LeftEyeRemarksId = 0;
            obj.LeftEyeRemarks = obj.LeftEyeRemarks || "";
            obj.IsSelected = "N";
            obj.ActiveInd = "Y";
            obj.LeftEyemm = "";
            obj.RightEyemm = "";
            obj.ContentType = "";
            obj.RightEyefileName = "";
            obj.LeftEyefileName = "";
            obj.PatientDryEyeEvalutionId = obj.PatientDryEyeEvalutionId || 0;

            obj.Investigation = obj.SelectedInvestigationObj.Investigation;
            obj.Category = "Dry Eye Evaluation";
            obj.CategoryId = 296;
            if (Edit === true) {
                angular.forEach($scope.cacheStorageItem.DryEyeEvaluationData, function (sitem) {
                    if (sitem.InvestigationId === obj.InvestigationId) {
                        sitem.ODValue1 = obj.ODValue1;
                        sitem.ODValue2 = obj.ODValue2;
                        sitem.ODvalue3 = obj.ODvalue3;
                        sitem.OSValue1 = obj.OSValue1;
                        sitem.OSValue2 = obj.OSValue2;
                        sitem.OSvalue3 = obj.OSvalue3;
                        sitem.Remarks = obj.Remarks;
                        sitem.ODValue11 = obj.ODValue11;
                        sitem.ODValue21 = obj.ODValue21;
                        sitem.ODvalue31 = obj.ODvalue31;
                        sitem.OSValue11 = obj.OSValue11;
                        sitem.OSValue21 = obj.OSValue21;
                        sitem.OSvalue31 = obj.OSvalue31;
                    }
                });
            } else {
                $scope.cacheStorageItem.DryEyeEvaluationData.push(obj);
            }
            $scope.DryEyeEvalutionAddobj = {
                "InvestigationId": "",
                "OrgInvestigationId": "",
                "Investigation": "",
                "InvestigationDesc": "",
                "SelectedInvestigationObj": "",
                "ODValue1": "I",
                "ODValue2": "",
                "ODvalue3": "",
                "OSValue1": "I",
                "OSValue2": "",
                "OSvalue3": "",
                "RemarksEdit": "",
                "Remarks": "",
                "ODValue11": "II",
                "ODValue21": "",
                "ODvalue31": "",
                "OSValue11": "II",
                "OSValue21": "",
                "OSvalue31": ""
            };

            resetdryEyeEvalution();
            $scope.AddToCache();
            $scope.DryEyeEvalution.SummaryEdit = false;

        };

        $scope.removeDryEyeEvalution = function (objj, index) {
            if (objj.PatientDryEyeEvalutionId === 0) {
                $scope.cacheStorageItem.DryEyeEvaluationData.splice(index, 1);
            } else {
                angular.forEach($scope.cacheStorageItem.DryEyeEvaluationData, function (Aitem) {
                    if (Aitem.PatientDryEyeEvalutionId == objj.PatientDryEyeEvalutionId) {
                        Aitem.ActiveInd = "N";
                        Aitem.ActiveIND = "N";
                    }
                });
            }

            angular.forEach($scope.dryEyeEvalution.Array, function (subitem) {
                subitem.IsSubtabActive = false;
            });
        };

        $scope.editDryEyeData = function (data, index) {

            $scope.DryEyeEvalutionAddobj = {
                "InvestigationId": data.InvestigationId,
                "OrgInvestigationId": data.OrgInvestigationId,
                "Investigation": data.Investigation,
                "InvestigationDesc": data.Investigation,
                "SelectedInvestigationObj": "",
                "ODValue1": data.ODValue1,
                "ODValue2": data.ODValue2,
                "ODvalue3": data.ODvalue3,   //data.ODValue3,
                "OSValue1": data.OSValue1,
                "OSValue2": data.OSValue2,
                "OSvalue3": data.OSvalue3,  //data.OSValue3,
                "Remarks": data.Remarks,
                "RemarksEdit": true,
                "ODValue11": data.ODValue11,
                "ODValue21": data.ODValue21,
                "ODvalue31": data.ODvalue31,
                "OSValue11": data.OSValue11,
                "OSValue21": data.OSValue21,
                "OSvalue31": data.OSvalue31
            };
            var ddArray = $filter("filter")($scope.dryEyeEvalution.Array, function (item, index) { return item.InvestigationId === data.InvestigationId });

            $scope.DryEyeEvalutionAddobj.SelectedInvestigationObj = ddArray[0];
            //$scope.cacheStorageItem.DryEyeEvaluationData.splice(index, 1);
            $scope.DryEyeEvalution.SummaryEdit = true;

            angular.forEach($scope.dryEyeEvalution.Array, function (subitem) {
                if (subitem.InvestigationId == data.InvestigationId) {
                    subitem.IsSubtabActive = true;
                } else {
                    subitem.IsSubtabActive = false;
                }
            });
        };

        $scope.AmslerGrisFileupload = function (file, eyetype) {
            if (file == undefined || file == null || file == "") {
                return false;
            }
            file = file || "";
            if (file != "") {
                var DocumentArray = [];
                var Documentobj = {
                    "file": file,
                    "DeleteInd": "N",
                    "DocumentId": 0,
                    "DocumentExt": "",
                    "DocumentName": ""
                };
                DocumentArray.push(Documentobj);
                var obj = {
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "HospitalId": $scope.HospitalID,
                    "PatientName": $scope.appointmentInfo.PatientName,
                    "PatientId": $scope.appointmentInfo.PatientID,
                    "AppointmentId": $scope.appointmentInfo.AppointmentID,
                    "S3Url": "",
                    "DocumentArray": DocumentArray || []
                };
                eHnotePatientDataService.GetFileUploadToS3Url(obj, Success1, Error1);
                function Success1(response) {
                    console.log(response);
                    if (response != "") {
                        angular.forEach($scope.cacheStorageItem.NewAmslerGridArray, function (item) {
                            if (item.InvestigationId == 2132) {
                                if (eyetype == "OD") {
                                    item.RS3Url = response;
                                    item.IsRS3Url = true;
                                } else {
                                    item.LS3Url = response;
                                    item.IsLS3Url = true;
                                }
                            }
                        });
                    }
                }
                function Error1(err) {
                    alertify.error(err);
                }
            }
        }
        $scope.AmslerODFileUpload = function (file) {
            if (file == undefined || file == null || file == "") {
                return false;
            } else {
                $scope.AmslerGrisFileupload(file, "OD");
            }
        }
        $scope.AmslerOSFileUpload = function (file) {
            if (file == undefined || file == null || file == "") {
                return false;
            } else {
                $scope.AmslerGrisFileupload(file, "OS");
            }
        }

        $scope.deleteAmslerGridImage = function (eye, Item) {
            if (eye === "OD") {
                Item.RS3Url = "";
                Item.IsRS3Url = false;
            } else {
                Item.LS3Url = "";
                Item.IsLS3Url = false;
            }
        }

        $scope.examinationConfrontationalfieldPopup = function (item) {
            $scope.mInstanceAdd1 = $uibModal.open({
                "templateUrl": "examinationConfrontationalfieldtestPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "windowClass": "newassessmentspopupuib",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {

                    $scope.ConfrontationalODDrawList = GetConfrontationalDrawList();
                    $scope.ConfrontationalOSDrawList = GetConfrontationalDrawList();
                    $scope.ConfrontationalPopObj = {
                        "RightEyeId": item.RightEyeId || "",
                        "RightEyeRemarks": item.RightEyeRemarks || "",
                        "RDrawList": item.RDrawList || [],
                        "LeftEyeId": item.LeftEyeId || "",
                        "LeftEyeRemarks": item.LeftEyeRemarks || "",
                        "LDrawList": item.LDrawList || [],

                        "FRightEyeId": item.FRightEyeId || "",
                        "FRightEyeRemarks": item.FRightEyeRemarks || "",
                        "FRDrawList": item.FRDrawList || [],
                        "FLeftEyeId": item.FLeftEyeId || "",
                        "FLeftEyeRemarks": item.FLeftEyeRemarks || "",
                        "FLDrawList": item.FLDrawList || []
                    };
                    angular.forEach($scope.ConfrontationalODDrawList, function (Aitem) {
                        angular.forEach($scope.ConfrontationalPopObj.RDrawList, function (Asubitem) {
                            if (Aitem.Id == Asubitem.Id) {
                                Aitem.IsChecked = true;
                            }
                        });
                    });
                    angular.forEach($scope.ConfrontationalOSDrawList, function (Aitem) {
                        angular.forEach($scope.ConfrontationalPopObj.LDrawList, function (Asubitem) {
                            if (Aitem.Id == Asubitem.Id) {
                                Aitem.IsChecked = true;
                            }
                        });
                    });
                    //vijay (06-06-2023) //

                    $scope.ConfrontationalODDrawListFourField = GetConfrontationalDrawListFourField();
                    $scope.ConfrontationalOSDrawListFourField = GetConfrontationalDrawListFourField();
                    angular.forEach($scope.ConfrontationalODDrawListFourField, function (Aitem) {
                        angular.forEach($scope.ConfrontationalPopObj.FRDrawList, function (Asubitem) {
                            if (Aitem.Id == Asubitem.Id) {
                                Aitem.IsChecked = true;
                            }
                        });
                    });
                    angular.forEach($scope.ConfrontationalOSDrawListFourField, function (Aitem) {
                        angular.forEach($scope.ConfrontationalPopObj.FLDrawList, function (Asubitem) {
                            if (Aitem.Id == Asubitem.Id) {
                                Aitem.IsChecked = true;
                            }
                        });
                    });






                    //vijay//

                    $scope.ConfrontationCloseuib = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.SaveConfrontationluib = function () {
                        var OdFilter = $filter("filter")($scope.ConfrontationalODDrawList, { "IsChecked": true }, true) || [];
                        if (OdFilter.length > 0) {
                            $scope.ConfrontationalPopObj.RDrawList = angular.copy(OdFilter);
                        } else {
                            $scope.ConfrontationalPopObj.RDrawList = [];
                        }
                        var OsFilter = $filter("filter")($scope.ConfrontationalOSDrawList, { "IsChecked": true }, true) || [];
                        if (OdFilter.length > 0) {
                            $scope.ConfrontationalPopObj.LDrawList = angular.copy(OsFilter);
                        } else {
                            $scope.ConfrontationalPopObj.LDrawList = [];
                        }

                        var OdfourFilter = $filter("filter")($scope.ConfrontationalODDrawListFourField, { "IsChecked": true }, true) || [];
                        if (OdFilter.length > 0) {
                            $scope.ConfrontationalPopObj.FRDrawList = angular.copy(OdfourFilter);
                        } else {
                            $scope.ConfrontationalPopObj.FRDrawList = [];
                        }
                        var OsfourFilter = $filter("filter")($scope.ConfrontationalOSDrawListFourField, { "IsChecked": true }, true) || [];
                        if (OdFilter.length > 0) {
                            $scope.ConfrontationalPopObj.FLDrawList = angular.copy(OsfourFilter);
                        } else {
                            $scope.ConfrontationalPopObj.FLDrawList = [];
                        }

                        $uibModalInstance.close($scope.ConfrontationalPopObj);
                    };
                }
            });
            $scope.mInstanceAdd1.result.then(function (response) {
                angular.forEach($scope.cacheStorageItem.ConfrontationalFieldArray, function (item) {
                    if (item.InvestigationId == 2164) {
                        item.RightEyeId = response.RightEyeId || "";
                        item.RightEyeRemarks = response.RightEyeRemarks || "";
                        item.RDrawList = response.RDrawList || [];
                        item.LeftEyeId = response.LeftEyeId || "";
                        item.LeftEyeRemarks = response.LeftEyeRemarks || "";
                        item.LDrawList = response.LDrawList || [];

                        item.FRightEyeId = response.FRightEyeId || "";
                        item.FRightEyeRemarks = response.FRightEyeRemarks || "";
                        item.FRDrawList = response.FRDrawList || [];
                        item.FLeftEyeId = response.FLeftEyeId || "";
                        item.FLeftEyeRemarks = response.FLeftEyeRemarks || "";
                        item.FLDrawList = response.FLDrawList || [];
                    }
                });
                $scope.AddToCache();
                $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
            }, function (cancel) { });
        }

        $scope.changecolorvisionData = function (obj, item) {
            if (item == null) {
                return false
            }
            obj.SelectedInvestigationObj = angular.copy(item);

            var ddArray = $filter("filter")($scope.cacheStorageItem.ColorVisionDetails, function (item, index) { return item.InvestigationId === obj.SelectedInvestigationObj.InvestigationId && item.ActiveInd === 'Y' });

            if (ddArray.length > 0) {
                $scope.ColorVision.SummaryEdit = false;
                //alertify.error("Already Added");
                //return false;
            } else {
                obj.InvestigationId = obj.SelectedInvestigationObj.InvestigationId;
                obj.OrgInvestigationId = obj.SelectedInvestigationObj.OrgInvestigationId;
                obj.InvestigationDesc = obj.SelectedInvestigationObj.Investigation;
                $scope.ColorVision.SummaryEdit = true;
                obj.ODRemarks = "";
                obj.OSRemarks = "";
                obj.EditColorVision = false;
                if (obj.InvestigationId == 14) {
                    obj.ColorVisionimgArr[0].IsLS3Url = false;
                    obj.ColorVisionimgArr[0].IsRS3Url = false;
                    obj.ColorVisionimgArr[0].LS3Url = '';
                    obj.ColorVisionimgArr[0].RS3Url = '';
                } else if (obj.InvestigationId == 15) {
                    obj.ColorVisionimgArr1[0].IsLS3Url = false;
                    obj.ColorVisionimgArr1[0].IsRS3Url = false;
                    obj.ColorVisionimgArr1[0].LS3Url = '';
                    obj.ColorVisionimgArr1[0].RS3Url = '';
                } else if (obj.InvestigationId == 16) {
                    obj.ColorVisionimgArr2[0].IsLS3Url = false;
                    obj.ColorVisionimgArr2[0].IsRS3Url = false;
                    obj.ColorVisionimgArr2[0].LS3Url = '';
                    obj.ColorVisionimgArr2[0].RS3Url = '';
                } else if (obj.InvestigationId == 17) {
                    obj.ColorVisionimgArr3[0].IsLS3Url = false;
                    obj.ColorVisionimgArr3[0].IsRS3Url = false;
                    obj.ColorVisionimgArr3[0].LS3Url = '';
                    obj.ColorVisionimgArr3[0].RS3Url = '';
                }
            }

            angular.forEach($scope.colorVisionObj.Array, function (subitem) {
                subitem.IsSubtabActive = false;
                subitem.IsEditPirticularItem = false;
            });
            item.IsSubtabActive = true;

        };

        $scope.clearColorVisionData = function (obj) {
            obj.ODRemarks = "";
            obj.OSRemarks = "";
            if (obj.InvestigationId == 14) {
                obj.ColorVisionimgArr[0].LS3Url = '';
                obj.ColorVisionimgArr[0].RS3Url = '';
                obj.ColorVisionimgArr[0].IsLS3Url = false;
                obj.ColorVisionimgArr[0].IsRS3Url = false;
            }
            if (obj.InvestigationId == 15) {
                obj.ColorVisionimgArr1[0].LS3Url = '';
                obj.ColorVisionimgArr1[0].RS3Url = '';
                obj.ColorVisionimgArr1[0].IsLS3Url = false;
                obj.ColorVisionimgArr1[0].IsRS3Url = false;
            }
            if (obj.InvestigationId == 16) {
                obj.ColorVisionimgArr2[0].LS3Url = '';
                obj.ColorVisionimgArr2[0].RS3Url = '';
                obj.ColorVisionimgArr2[0].IsLS3Url = false;
                obj.ColorVisionimgArr2[0].IsRS3Url = false;
            }
            if (obj.InvestigationId == 17) {
                obj.ColorVisionimgArr3[0].LS3Url = '';
                obj.ColorVisionimgArr3[0].RS3Url = '';
                obj.ColorVisionimgArr3[0].IsLS3Url = false;
                obj.ColorVisionimgArr3[0].IsRS3Url = false;
            }
        }

        $scope.addcolorvisionnewData = function (obj) {

            //if (obj.InvestigationDesc == '') {
            //    alertify.error('Select Colorvision');
            //    return false;
            //}
            if (obj.ODRemarks == '' && obj.OSRemarks == '') {
                alertify.error('Enter Notes');
                return false;
            }

            if (obj.InvestigationId == 14) {

                var object = {
                    "PatientFindingColorVisionId": 0,
                    "InvestigationId": obj.SelectedInvestigationObj.InvestigationId,
                    "CategoryId": obj.SelectedInvestigationObj.CategoryId,
                    "CategoryDesc": obj.SelectedInvestigationObj.Category || "",
                    "InvestigationDesc": obj.SelectedInvestigationObj.Investigation,
                    "Investigation": obj.SelectedInvestigationObj.Investigation,
                    "RightEyeRemarks": obj.ODRemarks,
                    "LeftEyeRemarks": obj.OSRemarks,
                    "ActiveInd": "Y",
                    "SubCategoryChildId": obj.SelectedInvestigationObj.SubCategoryChildId,
                    "RS3Url": obj.ColorVisionimgArr[0].RS3Url,
                    "LS3Url": obj.ColorVisionimgArr[0].LS3Url,
                    "IsRS3Url": obj.ColorVisionimgArr[0].IsRS3Url,
                    "IsLS3Url": obj.ColorVisionimgArr[0].IsLS3Url
                };


                //if (!$scope.ColorVisionAddobj.Ishihara.EditColorVision) {
                //    if ($scope.cacheStorageItem.ColorVisionDetails.length > 0) {
                //        var filterarray = $filter("filter")($scope.cacheStorageItem.ColorVisionDetails, { "InvestigationId": object.InvestigationId, "ActiveInd": 'Y' }, true);
                //        if (filterarray.length > 0) {
                //            alertify.error('Colorvision Already Added');
                //            return false;
                //        }
                //    }
                //}
                if ($scope.ColorVisionAddobj.Ishihara.EditColorVision === true) {
                    angular.forEach($scope.cacheStorageItem.ColorVisionDetails, function (Aitem) {
                        if (Aitem.InvestigationId == obj.InvestigationId && Aitem.ActiveInd === "Y") {
                            Aitem.RightEyeRemarks = obj.ODRemarks;
                            Aitem.LeftEyeRemarks = obj.OSRemarks;

                            Aitem.RS3Url = obj.ColorVisionimgArr[0].RS3Url;
                            Aitem.LS3Url = obj.ColorVisionimgArr[0].LS3Url;
                            Aitem.IsRS3Url = obj.ColorVisionimgArr[0].IsRS3Url;
                            Aitem.IsLS3Url = obj.ColorVisionimgArr[0].IsLS3Url;

                        }
                    });
                } else {
                    $scope.cacheStorageItem.ColorVisionDetails.push(object);
                }
            }

            if (obj.InvestigationId == 15) {

                var object = {
                    "PatientFindingColorVisionId": 0,
                    "InvestigationId": obj.SelectedInvestigationObj.InvestigationId,
                    "CategoryId": obj.SelectedInvestigationObj.CategoryId,
                    "CategoryDesc": obj.SelectedInvestigationObj.Category || "",
                    "InvestigationDesc": obj.SelectedInvestigationObj.Investigation,
                    "Investigation": obj.SelectedInvestigationObj.Investigation,
                    "RightEyeRemarks": obj.ODRemarks,
                    "LeftEyeRemarks": obj.OSRemarks,
                    "ActiveInd": "Y",
                    "SubCategoryChildId": obj.SelectedInvestigationObj.SubCategoryChildId,
                    "RS3Url": obj.ColorVisionimgArr1[0].RS3Url,
                    "LS3Url": obj.ColorVisionimgArr1[0].LS3Url,
                    "IsRS3Url": obj.ColorVisionimgArr1[0].IsRS3Url,
                    "IsLS3Url": obj.ColorVisionimgArr1[0].IsLS3Url
                };

                //if (!$scope.ColorVisionAddobj.HRR.EditColorVision) {
                //    if ($scope.cacheStorageItem.ColorVisionDetails.length > 0) {
                //        var filterarray = $filter("filter")($scope.cacheStorageItem.ColorVisionDetails, { "InvestigationId": object.InvestigationId, "ActiveInd": 'Y' }, true);
                //        if (filterarray.length > 0) {
                //            alertify.error('Colorvision Already Added');
                //            return false;
                //        }
                //    }
                //}
                if ($scope.ColorVisionAddobj.HRR.EditColorVision === true) {
                    angular.forEach($scope.cacheStorageItem.ColorVisionDetails, function (Aitem) {
                        if (Aitem.InvestigationId == obj.InvestigationId && Aitem.ActiveInd === "Y") {
                            Aitem.RightEyeRemarks = obj.ODRemarks;
                            Aitem.LeftEyeRemarks = obj.OSRemarks;

                            Aitem.RS3Url = obj.ColorVisionimgArr1[0].RS3Url;
                            Aitem.LS3Url = obj.ColorVisionimgArr1[0].LS3Url;
                            Aitem.IsRS3Url = obj.ColorVisionimgArr1[0].IsRS3Url;
                            Aitem.IsLS3Url = obj.ColorVisionimgArr1[0].IsLS3Url;

                        }
                    });
                } else {
                    $scope.cacheStorageItem.ColorVisionDetails.push(object);
                }
            }

            if (obj.InvestigationId == 16) {

                var object = {
                    "PatientFindingColorVisionId": 0,
                    "InvestigationId": obj.SelectedInvestigationObj.InvestigationId,
                    "CategoryId": obj.SelectedInvestigationObj.CategoryId,
                    "CategoryDesc": obj.SelectedInvestigationObj.Category || "",
                    "InvestigationDesc": obj.SelectedInvestigationObj.Investigation,
                    "Investigation": obj.SelectedInvestigationObj.Investigation,
                    "RightEyeRemarks": obj.ODRemarks,
                    "LeftEyeRemarks": obj.OSRemarks,
                    "ActiveInd": "Y",
                    "SubCategoryChildId": obj.SelectedInvestigationObj.SubCategoryChildId,
                    "RS3Url": obj.ColorVisionimgArr2[0].RS3Url,
                    "LS3Url": obj.ColorVisionimgArr2[0].LS3Url,
                    "IsRS3Url": obj.ColorVisionimgArr2[0].IsRS3Url,
                    "IsLS3Url": obj.ColorVisionimgArr2[0].IsLS3Url
                };

                //if (!$scope.ColorVisionAddobj.FransworthD15.EditColorVision) {
                //    if ($scope.cacheStorageItem.ColorVisionDetails.length > 0) {
                //        var filterarray = $filter("filter")($scope.cacheStorageItem.ColorVisionDetails, { "InvestigationId": object.InvestigationId, "ActiveInd": 'Y' }, true);
                //        if (filterarray.length > 0) {
                //            alertify.error('Colorvision Already Added');
                //            return false;
                //        }
                //    }
                //}
                if ($scope.ColorVisionAddobj.FransworthD15.EditColorVision === true) {
                    angular.forEach($scope.cacheStorageItem.ColorVisionDetails, function (Aitem) {
                        if (Aitem.InvestigationId == obj.InvestigationId && Aitem.ActiveInd === "Y") {
                            Aitem.RightEyeRemarks = obj.ODRemarks;
                            Aitem.LeftEyeRemarks = obj.OSRemarks;

                            Aitem.RS3Url = obj.ColorVisionimgArr2[0].RS3Url;
                            Aitem.LS3Url = obj.ColorVisionimgArr2[0].LS3Url;
                            Aitem.IsRS3Url = obj.ColorVisionimgArr2[0].IsRS3Url;
                            Aitem.IsLS3Url = obj.ColorVisionimgArr2[0].IsLS3Url;

                        }
                    });
                } else {
                    $scope.cacheStorageItem.ColorVisionDetails.push(object);
                }
            }

            if (obj.InvestigationId == 17) {

                var object = {
                    "PatientFindingColorVisionId": 0,
                    "InvestigationId": obj.SelectedInvestigationObj.InvestigationId,
                    "CategoryId": obj.SelectedInvestigationObj.CategoryId,
                    "CategoryDesc": obj.SelectedInvestigationObj.Category || "",
                    "InvestigationDesc": obj.SelectedInvestigationObj.Investigation,
                    "Investigation": obj.SelectedInvestigationObj.Investigation,
                    "RightEyeRemarks": obj.ODRemarks,
                    "LeftEyeRemarks": obj.OSRemarks,
                    "ActiveInd": "Y",
                    "SubCategoryChildId": obj.SelectedInvestigationObj.SubCategoryChildId,
                    "RS3Url": obj.ColorVisionimgArr3[0].RS3Url,
                    "LS3Url": obj.ColorVisionimgArr3[0].LS3Url,
                    "IsRS3Url": obj.ColorVisionimgArr3[0].IsRS3Url,
                    "IsLS3Url": obj.ColorVisionimgArr3[0].IsLS3Url
                };

                //if (!$scope.ColorVisionAddobj.FransworthD100.EditColorVision) {
                //    if ($scope.cacheStorageItem.ColorVisionDetails.length > 0) {
                //        var filterarray = $filter("filter")($scope.cacheStorageItem.ColorVisionDetails, { "InvestigationId": object.InvestigationId, "ActiveInd": 'Y' }, true);
                //        if (filterarray.length > 0) {
                //            alertify.error('Colorvision Already Added');
                //            return false;
                //        }
                //    }
                //}
                if ($scope.ColorVisionAddobj.FransworthD100.EditColorVision === true) {
                    angular.forEach($scope.cacheStorageItem.ColorVisionDetails, function (Aitem) {
                        if (Aitem.InvestigationId == obj.InvestigationId && Aitem.ActiveInd === "Y") {
                            Aitem.RightEyeRemarks = obj.ODRemarks;
                            Aitem.LeftEyeRemarks = obj.OSRemarks;

                            Aitem.RS3Url = obj.ColorVisionimgArr3[0].RS3Url;
                            Aitem.LS3Url = obj.ColorVisionimgArr3[0].LS3Url;
                            Aitem.IsRS3Url = obj.ColorVisionimgArr3[0].IsRS3Url;
                            Aitem.IsLS3Url = obj.ColorVisionimgArr3[0].IsLS3Url;

                        }
                    });
                } else {
                    $scope.cacheStorageItem.ColorVisionDetails.push(object);
                }
            }
            $scope.ColorVisionAddobj = GetColorVisionAddobj();

            $scope.ColorVision.SummaryEdit = false;

            angular.forEach($scope.colorVisionObj.Array, function (item) {
                item.IsEditPirticularItem = false;
            });

        };

        $scope.ColorVisionODFileUpload = function (file, id) {
            if (file == undefined || file == null || file == "") {
                return false;
            } else {
                $scope.ColorVisionFileupload(file, "OD", id);
            }
        }

        $scope.ColorVisionOSFileUpload = function (file, id) {
            if (file == undefined || file == null || file == "") {
                return false;
            } else {
                $scope.ColorVisionFileupload(file, "OS", id);
            }
        }

        $scope.ColorVisionFileupload = function (file, eyetype, Invid) {
            if (file == undefined || file == null || file == "") {
                return false;
            }
            file = file || "";
            if (file != "") {
                var DocumentArray = [];
                var Documentobj = {
                    "file": file,
                    "DeleteInd": "N",
                    "DocumentId": 0,
                    "DocumentExt": "",
                    "DocumentName": ""
                };
                DocumentArray.push(Documentobj);
                var obj = {
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "HospitalId": $scope.HospitalID,
                    "PatientName": $scope.appointmentInfo.PatientName,
                    "PatientId": $scope.appointmentInfo.PatientID,
                    "AppointmentId": $scope.appointmentInfo.AppointmentID,
                    "S3Url": "",
                    "DocumentArray": DocumentArray || []
                };
                eHnotePatientDataService.GetFileUploadToS3Url(obj, Success1, Error1);
                function Success1(response) {
                    if (response != "") {

                        angular.forEach($scope.cacheStorageItem.ColorVisionDetails, function (item) {
                            if (Invid === item.InvestigationId) {
                                if (eyetype == "OD") {
                                    item.RS3Url = response;
                                    item.IsRS3Url = true;
                                } else {
                                    item.LS3Url = response;
                                    item.IsLS3Url = true;
                                }
                            }
                        });

                        /*  if (Invid == 14) {
                              angular.forEach($scope.ColorVisionAddobj.Ishihara.ColorVisionimgArr, function (item) {
                                  if (eyetype == "OD") {
                                      item.RS3Url = response;
                                      item.IsRS3Url = true;
                                  } else {
                                      item.LS3Url = response;
                                      item.IsLS3Url = true;
                                  }
                              });
                          }
  
                          if (Invid == 15) {
                              angular.forEach($scope.ColorVisionAddobj.HRR.ColorVisionimgArr1, function (item) {
                                  if (eyetype == "OD") {
                                      item.RS3Url = response;
                                      item.IsRS3Url = true;
                                  } else {
                                      item.LS3Url = response;
                                      item.IsLS3Url = true;
                                  }
                              });
                          }
  
                          if (Invid == 16) {
                              angular.forEach($scope.ColorVisionAddobj.FransworthD15.ColorVisionimgArr2, function (item) {
                                  if (eyetype == "OD") {
                                      item.RS3Url = response;
                                      item.IsRS3Url = true;
                                  } else {
                                      item.LS3Url = response;
                                      item.IsLS3Url = true;
                                  }
                              });
                          }
  
                          if (Invid == 17) {
                              angular.forEach($scope.ColorVisionAddobj.FransworthD100.ColorVisionimgArr3, function (item) {
                                  if (eyetype == "OD") {
                                      item.RS3Url = response;
                                      item.IsRS3Url = true;
                                  } else {
                                      item.LS3Url = response;
                                      item.IsLS3Url = true;
                                  }
                              });
                          }*/

                    }
                }
                function Error1(err) {
                    alertify.error(err);
                }
            }
        }

        $scope.editColorVisionDatainpopup = function (data, index) {

            if (data.InvestigationId == 14) {
                $scope.ColorVisionAddobj = {
                    "Ishihara": {
                        "InvestigationId": data.InvestigationId,
                        "OrgInvestigationId": data.OrgInvestigationId,
                        "Investigation": data.Investigation,
                        "InvestigationDesc": data.Investigation,
                        "SelectedInvestigationObj": "",
                        "ODRemarks": data.RightEyeRemarks,
                        "OSRemarks": data.LeftEyeRemarks,
                        "EditColorVision": true,
                        "ColorVisionimgArr": []
                    },
                };
                var obj = {
                    "RS3Url": data.RS3Url,
                    "IsRS3Url": data.IsRS3Url,
                    "LS3Url": data.LS3Url,
                    "IsLS3Url": data.IsLS3Url
                };
                $scope.ColorVisionAddobj.Ishihara.ColorVisionimgArr.push(obj);
            }
            if (data.InvestigationId == 15) {
                $scope.ColorVisionAddobj = {
                    "HRR": {
                        "InvestigationId": data.InvestigationId,
                        "OrgInvestigationId": data.OrgInvestigationId,
                        "Investigation": data.Investigation,
                        "InvestigationDesc": data.Investigation,
                        "SelectedInvestigationObj": "",
                        "ODRemarks": data.RightEyeRemarks,
                        "OSRemarks": data.LeftEyeRemarks,
                        "EditColorVision": true,
                        "ColorVisionimgArr1": []
                    },
                };
                var obj = {
                    "RS3Url": data.RS3Url,
                    "IsRS3Url": data.IsRS3Url,
                    "LS3Url": data.LS3Url,
                    "IsLS3Url": data.IsLS3Url
                };
                $scope.ColorVisionAddobj.HRR.ColorVisionimgArr1.push(obj);
            }
            if (data.InvestigationId == 16) {
                $scope.ColorVisionAddobj = {
                    "FransworthD15": {
                        "InvestigationId": data.InvestigationId,
                        "OrgInvestigationId": data.OrgInvestigationId,
                        "Investigation": data.Investigation,
                        "InvestigationDesc": data.Investigation,
                        "SelectedInvestigationObj": "",
                        "ODRemarks": data.RightEyeRemarks,
                        "OSRemarks": data.LeftEyeRemarks,
                        "EditColorVision": true,
                        "ColorVisionimgArr2": []
                    },
                };
                var obj = {
                    "RS3Url": data.RS3Url,
                    "IsRS3Url": data.IsRS3Url,
                    "LS3Url": data.LS3Url,
                    "IsLS3Url": data.IsLS3Url
                };
                $scope.ColorVisionAddobj.FransworthD15.ColorVisionimgArr2.push(obj);
            }

            if (data.InvestigationId == 17) {
                $scope.ColorVisionAddobj = {
                    "FransworthD100": {
                        "InvestigationId": data.InvestigationId,
                        "OrgInvestigationId": data.OrgInvestigationId,
                        "Investigation": data.Investigation,
                        "InvestigationDesc": data.Investigation,
                        "SelectedInvestigationObj": "",
                        "ODRemarks": data.RightEyeRemarks,
                        "OSRemarks": data.LeftEyeRemarks,
                        "EditColorVision": true,
                        "ColorVisionimgArr3": []
                    },
                };
                var obj = {
                    "RS3Url": data.RS3Url,
                    "IsRS3Url": data.IsRS3Url,
                    "LS3Url": data.LS3Url,
                    "IsLS3Url": data.IsLS3Url
                };
                $scope.ColorVisionAddobj.FransworthD100.ColorVisionimgArr3.push(obj);
            }

            var ddArray = $filter("filter")($scope.colorVisionObj.Array, function (item, index) { return item.InvestigationId === data.InvestigationId });
            $scope.ColorVisionAddobj.SelectedInvestigationObj = ddArray[0];
            //  $scope.cacheStorageItem.ColorVisionDetails.splice(index, 1);

            $scope.ColorVision.SummaryEdit = true;
            angular.forEach($scope.colorVisionObj.Array, function (subitem) {
                if (subitem.InvestigationId == data.InvestigationId) {
                    subitem.IsSubtabActive = true;
                    subitem.IsEditPirticularItem = false;
                } else {
                    subitem.IsSubtabActive = false;
                    subitem.IsEditPirticularItem = true;
                }
            });

        };

        $scope.ODExtraOcularFreelymovingClick = function (Ind, item) {
            if (Ind) {
                item.RsrValue = "0";
                item.RIoValue = "0";
                item.RLrValue = "0";
                item.RMrValue = "0";
                item.RIrValue = "0";
                item.RSoValue = "0";
            } else {
                item.RsrValue = "";
                item.RIoValue = "";
                item.RLrValue = "";
                item.RMrValue = "";
                item.RIrValue = "";
                item.RSoValue = "";
            }
        };
        $scope.OSExtraOcularFreelymovingClick = function (Ind, item) {
            if (Ind) {
                item.LIoValue = "0";
                item.LSrValue = "0";
                item.LMrValue = "0";
                item.LLrValue = "0";
                item.LSoValue = "0";
                item.LIrValue = "0";
            } else {
                item.LIoValue = "";
                item.LSrValue = "";
                item.LMrValue = "";
                item.LLrValue = "";
                item.LSoValue = "";
                item.LIrValue = "";
            }
        };
        $scope.OD9GazeFreelymovingClick = function (Ind, item) {
            if (Ind) {
                item.RIoValue = "0";
                item.RsrIoValue = "0";
                item.RsrValue = "0";
                item.RLrValue = "0";
                item.RPgValue = "0";
                item.RMrValue = "0";
                item.RSoValue = "0";
                item.RIrSoValue = "0";
                item.RIrValue = "0";
            } else {
                item.RIoValue = "";
                item.RsrIoValue = "";
                item.RsrValue = "";
                item.RLrValue = "";
                item.RPgValue = "";
                item.RMrValue = "";
                item.RSoValue = "";
                item.RIrSoValue = "";
                item.RIrValue = "";
            }
        };
        $scope.OS9GazeFreelymovingClick = function (Ind, item) {
            if (Ind) {
                item.LIoValue = "0";
                item.LIoSrValue = "0";
                item.LSrValue = "0";
                item.LMrValue = "0";
                item.LPgValue = "0";
                item.LLrValue = "0";
                item.LSoValue = "0";
                item.LSoIrValue = "0";
                item.LIrValue = "0";
            } else {
                item.LIoValue = "";
                item.LIoSrValue = "";
                item.LSrValue = "";
                item.LMrValue = "";
                item.LPgValue = "";
                item.LLrValue = "";
                item.LSoValue = "";
                item.LSoIrValue = "";
                item.LIrValue = "";
            }
        };

        $scope.$watch("MotorExaminationObj.NineGazeExtraOcularDetails", function () {

            if ($scope.MotorExaminationObj.NineGazeExtraOcularDetails === undefined) { return; }
            if ($scope.MotorExaminationObj.NineGazeExtraOcularDetails.length > 0) {
                angular.forEach($scope.MotorExaminationObj.NineGazeExtraOcularDetails, function (item) {
                    if (item.InvestigationId == 18) {
                        if (item.RsrValue == "0" && item.RIoValue == "0" && item.RLrValue == "0" && item.RMrValue == "0" && item.RIrValue == "0" && item.RSoValue == "0") {
                            $scope.MotorExaminationObj.ODExtraOcularFreelymovingInd = true;
                        } else {
                            $scope.MotorExaminationObj.ODExtraOcularFreelymovingInd = false;
                        }
                        if (item.LIoValue == "0" && item.LSrValue == "0" && item.LMrValue == "0" && item.LLrValue == "0" && item.LSoValue == "0" && item.LIrValue == "0") {
                            $scope.MotorExaminationObj.OSExtraOcularFreelymovingInd = true;
                        } else {
                            $scope.MotorExaminationObj.OSExtraOcularFreelymovingInd = false;
                        }
                    }

                    if (item.InvestigationId == 695) {
                        if (item.RIoValue == "0" && item.RsrIoValue == "0" && item.RsrValue == "0" && item.RLrValue == "0" && item.RPgValue == "0" && item.RMrValue == "0" && item.RSoValue == "0" && item.RIrSoValue == "0" && item.RIrValue == "0") {
                            $scope.MotorExaminationObj.OD9GazeFreelymovingInd = true;
                        } else {
                            $scope.MotorExaminationObj.OD9GazeFreelymovingInd = false;
                        }
                        if (item.LIoValue == "0" && item.LIoSrValue == "0" && item.LSrValue == "0" && item.LMrValue == "0" && item.LPgValue == "0" && item.LLrValue == "0" && item.LSoValue == "0" && item.LSoIrValue == "0" && item.LIrValue == "0") {
                            $scope.MotorExaminationObj.OS9GazeFreelymovingInd = true;
                        } else {
                            $scope.MotorExaminationObj.OS9GazeFreelymovingInd = false;
                        }
                    }

                });
            }
        }, true);

        $scope.ChangePrismSubTab = function (item) {
            $scope.PrismSubTab = item.PrismTypeId;
        }

        $scope.ChangeCoverFixationPreferences = function (item) {
            item = item || "";
        }
        $scope.ChangeCoverFixationPreferences1 = function (item, id) {
            id = id || 0;
            if (id === 0) {
                item.SquintPossibleDiagnosis = "";
                item.SquintPossibleDiagnosisId = 0;
            }
            else {
                var filetrODarray = $filter("filter")($scope.SquintPossibleDiagnosis, function (iterator, ind) {
                    return iterator.DiagnosisId == item.SquintPossibleDiagnosisId
                }) || [];
                if (filetrODarray.length > 0) {
                    item.SquintPossibleICD10CODE = filetrODarray[0].ICD10CODE || "";
                    item.SquintPossibleDiagnosis = filetrODarray[0].DiagnosisName || "";
                    item.SquintPossibleDiagnosisId = filetrODarray[0].DiagnosisId || 0;
                }
            }
        }
        $scope.ChangeBVPossibleDiagnosis = function (item, id) {
            id = id || 0;
            if (id === 0) {
                item.BVPossibleDiagnosis = "";
                item.BVPossibleDiagnosisId = 0;
            }
            else {
                var filetrODarray = $filter("filter")($scope.BinocularPossibleDiagnosis, function (iterator, ind) {
                    return iterator.DiagnosisId == item.BVPossibleDiagnosisId
                }) || [];
                if (filetrODarray.length > 0) {
                    item.BVPossibleICD10CODE = filetrODarray[0].ICD10CODE || "";
                    item.BVPossibleDiagnosis = filetrODarray[0].DiagnosisName || "";
                    item.BVPossibleDiagnosisId = filetrODarray[0].DiagnosisId || 0;
                }
            }
        }

        $scope.ChangeDistanceWorth = function (ditem) {
            if (ditem.DistanceValueId == null) {
                ditem.DistanceValueId = ditem.DistanceValueId || "";
                ditem.DistanceValue = "";
            } else {
                var List = $filter("filter")($scope.WorthfourList, { "Id": ditem.DistanceValueId }, true) || [];
                if (List.length > 0) {
                    ditem.DistanceValue = List[0].Values || "";
                } else {
                    ditem.DistanceValue = "";
                }
            }
        };
        $scope.ChangeNearWorth = function (ditem) {
            if (ditem.NearValueId == null) {
                ditem.NearValueId = ditem.NearValueId || "";
                ditem.NearValue = "";
            } else {
                var List = $filter("filter")($scope.WorthfourList, { "Id": ditem.NearValueId }, true) || [];
                if (List.length > 0) {
                    ditem.NearValue = List[0].Values || "";
                } else {
                    ditem.NearValue = "";
                }
            }
        };

        $scope.ChangeStereopsisValues = function (ditem, Steretype) {
            switch (Steretype) {
                case "Fly":
                    if (ditem.FlyId == null) {
                        ditem.FlyId = ditem.FlyId || "";
                        ditem.Fly = "";
                    } else {
                        var List = $filter("filter")($scope.StereopsisList, { "Id": ditem.FlyId }, true) || [];
                        if (List.length > 0) {
                            ditem.Fly = List[0].Values || "";
                        } else {
                            ditem.Fly = "";
                        }
                    }
                    break;
                case "Animals":
                    if (ditem.AnimalsId == null) {
                        ditem.AnimalsId = ditem.AnimalsId || "";
                        ditem.Animals = "";
                    } else {
                        var List = $filter("filter")($scope.StereopsisList, { "Id": ditem.AnimalsId }, true) || [];
                        if (List.length > 0) {
                            ditem.Animals = List[0].Values || "";
                        } else {
                            ditem.Animals = "";
                        }
                    }
                    break;
                case "Circles":
                    if (ditem.CirclesId == null) {
                        ditem.CirclesId = ditem.CirclesId || "";
                        ditem.Circles = "";
                    } else {
                        var List = $filter("filter")($scope.StereopsisList, { "Id": ditem.CirclesId }, true) || [];
                        if (List.length > 0) {
                            ditem.Circles = List[0].Values || "";
                        } else {
                            ditem.Circles = "";
                        }
                    }
                    break;
                case "Randot Circle":
                    if (ditem.RandotCirclesId == null) {
                        ditem.RandotCirclesId = ditem.RandotCirclesId || "";
                        ditem.RandotCircles = "";
                    } else {
                        var List = $filter("filter")($scope.StereopsisList, { "Id": ditem.RandotCirclesId }, true) || [];
                        if (List.length > 0) {
                            ditem.RandotCircles = List[0].Values || "";
                        } else {
                            ditem.RandotCircles = "";
                        }
                    }
                    break;
                case "Dist Vectograph":
                    if (ditem.DistVectographId == null) {
                        ditem.DistVectographId = ditem.DistVectographId || "";
                        ditem.DistVectograph = "";
                    } else {
                        var List = $filter("filter")($scope.StereopsisList, { "Id": ditem.DistVectographId }, true) || [];
                        if (List.length > 0) {
                            ditem.DistVectograph = List[0].Values || "";
                        } else {
                            ditem.DistVectograph = "";
                        }
                    }
                    break;
                case "Dist Stereo":
                    if (ditem.DistStereoId == null) {
                        ditem.DistStereoId = ditem.DistStereoId || "";
                        ditem.DistStereo = "";
                    } else {
                        var List = $filter("filter")($scope.StereopsisList, { "Id": ditem.DistStereoId }, true) || [];
                        if (List.length > 0) {
                            ditem.DistStereo = List[0].Values || "";
                        } else {
                            ditem.DistStereo = "";
                        }
                    }
                    break;
                case "Frisby":
                    if (ditem.FrisbyId == null) {
                        ditem.FrisbyId = ditem.FrisbyId || "";
                        ditem.Frisby = "";
                    } else {
                        var List = $filter("filter")($scope.StereopsisList, { "Id": ditem.FrisbyId }, true) || [];
                        if (List.length > 0) {
                            ditem.Frisby = List[0].Values || "";
                        } else {
                            ditem.Frisby = "";
                        }
                    }
                    break;
                case "Lang":
                    if (ditem.LangId == null) {
                        ditem.LangId = ditem.LangId || "";
                        ditem.Lang = "";
                    } else {
                        var List = $filter("filter")($scope.StereopsisList, { "Id": ditem.LangId }, true) || [];
                        if (List.length > 0) {
                            ditem.Lang = List[0].Values || "";
                        } else {
                            ditem.Lang = "";
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        $scope.SelectedExaminactionINVId = null;
        $scope.SelectAnteriorInvestigation = function (item) {
            item.RightPwCanvas = item.RightPwCanvas;
            item.SelectedEye = "1";
            $scope.IsShowExaminationDrawingInd = true;
            item.IsSelected = !item.IsSelected;
            $scope.Investigation = {};
            item.RightEyediv = false;
            item.LeftEyediv = false;
            $scope.Investigation = angular.copy(item);
            item.IsShowAnterior = "Y";
            $scope.SelectedExaminactionINVId = item.InvestigationId || null;
            $scope.AnteriorDropdownList = [];
        };

        $scope.EditImage = function (parentItem, childItem, type) {
            $scope.newAnteriorObj.SelectedAnteriorObj = $scope.newAnteriorObj.SelectedAnteriorObj || '';
            //if ($scope.newAnteriorObj.SelectedAnteriorObj == '' && childItem.CategoryId == 5) {
            //    $scope.newAnteriorObj.SelectedAnteriorObj = $filter('filter')($scope.cacheStorageItem.AnteriorDetails, { 'InvestigationId': childItem.InvestigationId }, true)[0];
            //    $scope.Investigation = $filter('filter')($scope.cacheStorageItem.AnteriorDetails, { 'InvestigationId': childItem.InvestigationId }, true)[0];
            //}
            //if ($scope.newPosteriorObj.SelectedPosteriorObj == '' && childItem.CategoryId == 6) {
            //    $scope.newPosteriorObj.SelectedPosteriorObj = $filter('filter')($scope.cacheStorageItem.PosteriorDetails, { 'InvestigationId': childItem.InvestigationId }, true)[0];
            //    $scope.Investigation = $filter('filter')($scope.cacheStorageItem.PosteriorDetails, { 'InvestigationId': childItem.InvestigationId }, true)[0];
            //}
            //if (childItem.CategoryId == 5) {
            //    if ($scope.newAnteriorObj.SelectedAnteriorObj == '') {
            //        alertify.error("Please Select Investigation");
            //        return false;
            //    }
            //}
            //if (childItem.CategoryId == 6) {
            //    if ($scope.newPosteriorObj.SelectedPosteriorObj == '') {
            //        alertify.error("Please Select Investigation");
            //        return false;
            //    }
            //}

            if ($scope.newAnteriorObj.SelectedAnteriorObj == '') {
                $scope.newAnteriorObj.SelectedAnteriorObj = $filter('filter')($scope.TempInvestigactionslist, { 'InvestigationId': childItem.InvestigationId }, true)[0];
                $scope.Investigation = $filter('filter')($scope.TempInvestigactionslist, { 'InvestigationId': childItem.InvestigationId }, true)[0];
            }

            $timeout(function () {
                if (type === "Right") {
                    $scope.RightEyefileName = childItem.DocURL.substring(childItem.DocURL.lastIndexOf("/") + 1);
                    $scope.Investigation.RightOrganDocId = childItem.DocumentID;
                    $scope.Investigation.RightOrganDocUrl = childItem.DocURL;
                    $scope.Investigation.OrganId = childItem.OrganId || 1;
                    $scope.Investigation.SelectedEye = '1';
                    $("#maineHnoteLoader").show();
                    $scope.toDataURL(childItem.DocURL, function (dataURL) {
                        $scope.Investigation.RightEyediv = true;
                        $scope.Investigation.RightEyeEdit = true;
                        $scope.Investigation.thumbnailRightEye = dataURL;
                        $timeout(function () {
                            $("#maineHnoteLoader").hide();
                        }, 200);
                    });
                    $scope.Investigation.RightEyeUndoCount = 0;
                    if ($scope.Investigation.RightPwCanvas == undefined) {
                        $scope.Investigation.RightPwCanvas = "RightPwCanvas" + childItem.InvestigationId;
                    }
                    $scope.fixImage($scope.Investigation.RightPwCanvas);
                }
                if (type === "Left") {
                    $scope.LeftEyefileName = childItem.DocURL.substring(childItem.DocURL.lastIndexOf("/") + 1);
                    $scope.Investigation.LeftOrganDocId = childItem.DocumentID;
                    $scope.Investigation.LeftOrganDocUrl = childItem.DocURL;
                    $scope.Investigation.OrganId = childItem.OrganId || 2;
                    $scope.Investigation.SelectedEye = '2';
                    $("#maineHnoteLoader").show();
                    $scope.toDataURL(childItem.DocURL, function (dataURL) {
                        $scope.Investigation.LeftEyediv = true;
                        $scope.Investigation.LeftEyeEdit = true;
                        $scope.Investigation.thumbnailLeftEye = dataURL;
                        $timeout(function () {
                            $("#maineHnoteLoader").hide();
                        }, 200);
                    });
                    $scope.Investigation.LeftEyeUndoCount = 0;

                    $scope.fixImage($scope.Investigation.LeftPwCanvas);
                }
                /*$scope.newAnteriorObj.SelectedAnteriorObj = $filter('filter')($scope.cacheStorageItem.AnteriorDetails, { 'InvestigationId': childItem.InvestigationId }, true)[0];*/
                $scope.newAnteriorObj.SelectedAnteriorObj = $filter('filter')($scope.TempInvestigactionslist, { 'InvestigationId': childItem.InvestigationId }, true)[0];
            }, 500);

        };
        $scope.removeImage = function (subitem, type, DeleteIndicator, ParentItem) {
            var object = {
                "AppointmentID": $scope.appointmentInfo.AppointmentID,
                "DeleteIndicator": DeleteIndicator,
                "HospitalID": $scope.doctorinfo.hospitalID,
                "ImagesArray": []
            };
            if (DeleteIndicator === 0) {//Single Image Deletion
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                    object.ImagesArray.push({ "DocumentID": subitem.DocumentID, "FileName": subitem.DocURL.substring(subitem.DocURL.lastIndexOf("/") + 1) });
                    removeImage(subitem.DocumentID, type, object, ParentItem);
                }, function () {
                    return;
                });
            }
        };
        function removeImage(docid, type, object, ParentItem) {
            eHnotePatientDataService.DeletePatientInvImg(object).then(function (resp) {
                if (resp.data.Status === "Success") {
                    if (type !== "") {
                        var ind = -1;
                        if (type === "Right") {
                            ParentItem.RightEye.ImagesArray.some(function (obj, i) {
                                return obj.DocumentId === docid ? ind = i : false;
                            });
                            ParentItem.RightEye.ImagesArray.splice(ind, 1);
                            ParentItem.RightEyefileName = "";
                            ParentItem.RightOrganDocUrl = "";
                            ParentItem.thumbnailRightEye = "";
                            ParentItem.RightEyediv = false;
                            ParentItem.RightEyeUndoCount = 0;
                            ParentItem.RightEyeEdit = false;
                        }
                        if (type === "Left") {
                            ParentItem.LeftEye.ImagesArray.some(function (obj, i) {
                                return obj.DocumentId === docid ? ind = i : false;
                            });
                            ParentItem.LeftEye.ImagesArray.splice(ind, 1);
                            ParentItem.LeftEyefileName = "";
                            ParentItem.LeftOrganDocUrl = "";
                            ParentItem.thumbnailLeftEye = "";
                            ParentItem.LeftEyediv = false;
                            ParentItem.LeftEyeUndoCount = 0;
                            ParentItem.LeftEyeEdit = false;
                        }
                        alertify.success("Image Deleted Successfully");
                    }
                }
            }, function (err) {
                alertify.error(err.Messege);
            });
        }

        $scope.removeImage1 = function (subitem, type, DeleteIndicator) {
            var object = {
                "AppointmentID": $scope.appointmentInfo.AppointmentID,
                "DeleteIndicator": DeleteIndicator,
                "HospitalID": $scope.doctorinfo.hospitalID,
                "ImagesArray": []
            };
            if (DeleteIndicator === 0) {//Single Image Deletion
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                    object.ImagesArray.push({ "DocumentID": subitem.DocumentID, "FileName": subitem.DocURL.substring(subitem.DocURL.lastIndexOf("/") + 1) });
                    removeImage1(subitem.DocumentID, type, object, subitem);
                }, function () {
                    return;
                });
            }
        };
        function removeImage1(docid, type, object, subitem) {
            /*eHnotePatientDataService.DeletePatientInvImg(object).then(function (resp) {*/
            eHnotePatientDataService.DeletePatientConsultationImg1(object).then(function (resp) {
                if (resp.data.Status === "Success") {
                    if (subitem.CategoryId == 5) {
                        if (type !== "") {
                            var ind = -1;
                            if (type === "Right") {
                                $scope.cacheStorageItem.AnteriorSegmentImagesArray.some(function (obj, i) {
                                    return obj.DocumentID === docid ? ind = i : false;
                                });
                                $scope.cacheStorageItem.AnteriorSegmentImagesArray.splice(ind, 1);

                            }
                            if (type === "Left") {
                                $scope.cacheStorageItem.AnteriorSegmentImagesArray.some(function (obj, i) {
                                    return obj.DocumentID === docid ? ind = i : false;
                                });
                                $scope.cacheStorageItem.AnteriorSegmentImagesArray.splice(ind, 1);
                            }
                            alertify.success("Image Deleted Successfully");
                        }
                    } else if (subitem.CategoryId == 6) {
                        if (type !== "") {
                            var ind = -1;
                            if (type === "Right") {
                                $scope.cacheStorageItem.PosteriorSegmentImagesArray.some(function (obj, i) {
                                    return obj.DocumentID === docid ? ind = i : false;
                                });
                                $scope.cacheStorageItem.PosteriorSegmentImagesArray.splice(ind, 1);

                            }
                            if (type === "Left") {
                                $scope.cacheStorageItem.PosteriorSegmentImagesArray.some(function (obj, i) {
                                    return obj.DocumentID === docid ? ind = i : false;
                                });
                                $scope.cacheStorageItem.PosteriorSegmentImagesArray.splice(ind, 1);
                            }
                            alertify.success("Image Deleted Successfully");
                        }
                    } else if (subitem.CategoryId == 12) {
                        if (type !== "") {
                            var ind = -1;
                            if (type === "Right") {
                                $scope.cacheStorageItem.ExternalExaminationImagesArray.some(function (obj, i) {
                                    return obj.DocumentID === docid ? ind = i : false;
                                });
                                $scope.cacheStorageItem.ExternalExaminationImagesArray.splice(ind, 1);

                            }
                            if (type === "Left") {
                                $scope.cacheStorageItem.ExternalExaminationImagesArray.some(function (obj, i) {
                                    return obj.DocumentID === docid ? ind = i : false;
                                });
                                $scope.cacheStorageItem.ExternalExaminationImagesArray.splice(ind, 1);
                            }
                            alertify.success("Image Deleted Successfully");
                        }
                    }
                }
            }, function (err) {
                alertify.error(err.Messege);
            });
        }

        $scope.ClearCanvas = function (type, Investigation) {
            if (type === "Right") {
                Investigation.RightEyediv = false;
                Investigation.RightEyeUndoCount = 0;
                Investigation.thumbnailRightEye = "";
                $scope.RightEyefileName = "";
                $scope.Investigation.RightEyeEdit = false;
            }
            if (type === "Left") {
                Investigation.LeftEyediv = false;
                Investigation.LeftEyeUndoCount = 0;
                Investigation.thumbnailLeftEye = "";
                $scope.LeftEyefileName = "";
                $scope.Investigation.LeftEyeEdit = false;
            }
        };

        $scope.updatecanvas = function (type, item, isTemplate, whichCat) {


            console.log(item);


            var RightId = item.RightPwCanvas;
            var LeftId = item.LeftPwCanvas;

            if (type === "Right") {
                item.RightEyeEdit = false;
                item.RightEyediv = false;
                var canvas = document.getElementById(RightId);
                var dataURL = canvas.toDataURL();
                var S3URL = item.RightOrganDocUrl || "";
                var sdate = $filter('date')(new Date(), "yyyy-MM-dd");
                var object = {
                    "UserID": $scope.UserId,
                    "HospitalID": $scope.doctorinfo.hospitalID,
                    "PatientID": $scope.PatientData.Patient[0].PatientID,
                    "PatientName": $scope.PatientData.Patient[0].FullName,
                    "AppointmentID": $scope.appointmentInfo.AppointmentID,
                    "Remarks": "",
                    "Base64": dataURL,
                    "SignedDate": sdate,
                    "FileTypeId": 16,
                    "S3URL": S3URL,
                    "DeleteInd": "N",
                    "DocumentID": item.RightOrganDocId,
                    "DisplayName": item.RightOrganDocUrl.substring(item.RightOrganDocUrl.lastIndexOf("/") + 1),
                    "FileName": item.RightOrganDocUrl.substring(item.RightOrganDocUrl.lastIndexOf("/") + 1),
                    "FileExt": item.ContentType,
                    "InvestigationId": item.InvestigationId,
                    "OrganId": item.OrganId,
                    "ContentType": item.ContentType,
                    "OrganizationInvestigationId": item.OrganizationInvestigationId || null,
                    "CategoryId": item.CategoryId
                };
                eHnotePatientDataService.AddUpdatePatientDrawingImage(object).then(function (resp) {

                    if (item.CategoryId == 5) {
                        var ind = -1;
                        $scope.cacheStorageItem.AnteriorSegmentImagesArray.some(function (obj, i) {
                            return obj.DocumentID === item.RightOrganDocId ? ind = i : false;
                        });
                        var result = resp.data;
                        /*result.ActiveInd = 'Y';*/
                        /*item.ImagesArray[ind] = result;*/
                        var obj1 = {
                            "DocumentID": result.DocumentID || 0,
                            "DocURL": result.DocURL || "",
                            "CategoryId": result.CategoryId,
                            "DocName": result.DocName || '',
                            "DeleteInd": result.DeleteInd || 'N',
                            "OrganId": 1,
                        }
                        $scope.cacheStorageItem.AnteriorSegmentImagesArray[ind] = obj1;
                        item.RightOrganDocId = 0;
                        item.thumbnailRightEye = "";
                        item.RightEyeUndoCount = 0;
                        $scope.RightEyefileName = "";
                        alertify.success("Image Updated Successfully");

                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
                    }
                    else if (item.CategoryId == 12) {
                        var ind = -1;
                        $scope.cacheStorageItem.ExternalExaminationImagesArray.some(function (obj, i) {
                            return obj.DocumentID === item.RightOrganDocId ? ind = i : false;
                        });
                        var result = resp.data;
                        /*result.ActiveInd = 'Y';*/
                        /*item.ImagesArray[ind] = result;*/
                        var obj1 = {
                            "DocumentID": result.DocumentID || 0,
                            "DocURL": result.DocURL || "",
                            "CategoryId": result.CategoryId,
                            "DocName": result.DocName || '',
                            "DeleteInd": result.DeleteInd || 'N',
                            "OrganId": 1,
                        }
                        $scope.cacheStorageItem.ExternalExaminationImagesArray[ind] = obj1;
                        item.RightOrganDocId = 0;
                        item.thumbnailRightEye = "";
                        item.RightEyeUndoCount = 0;
                        $scope.RightEyefileName = "";
                        alertify.success("Image Updated Successfully");

                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.ExternalExaminationDetails);
                    }
                    else if (item.CategoryId == 6) {
                        var ind = -1;
                        $scope.cacheStorageItem.PosteriorSegmentImagesArray.some(function (obj, i) {
                            return obj.DocumentID === item.RightOrganDocId ? ind = i : false;
                        });
                        var result = resp.data;
                        /*result.ActiveInd = 'Y';*/
                        /*item.ImagesArray[ind] = result;*/
                        var obj1 = {
                            "DocumentID": result.DocumentID || 0,
                            "DocURL": result.DocURL || "",
                            "CategoryId": result.CategoryId,
                            "DocName": result.DocName || '',
                            "DeleteInd": result.DeleteInd || 'N',
                            "OrganId": 1,
                        }
                        $scope.cacheStorageItem.PosteriorSegmentImagesArray[ind] = obj1;
                        item.RightOrganDocId = 0;
                        item.thumbnailRightEye = "";
                        item.RightEyeUndoCount = 0;
                        $scope.RightEyefileName = "";
                        alertify.success("Image Updated Successfully");

                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
                    }

                    var SelectEye = type == "Right" ? '1' : '2';
                    $scope.ClickShowExaminationDrawingpad(SelectEye);

                }, function (err) {
                    alertify.error(err.Messege);
                });
            }
            if (type === "Left") {
                item.LeftEyeEdit = false;
                item.LeftEyediv = false;
                var canvas = document.getElementById(LeftId);
                var dataURL = canvas.toDataURL();
                var S3URL = item.LeftOrganDocUrl || "";

                var sdate = $filter('date')(new Date(), "yyyy-MM-dd");
                var object = {
                    "UserID": $scope.UserId,
                    "HospitalID": $scope.doctorinfo.hospitalID,
                    "PatientID": $scope.PatientData.Patient[0].PatientID,
                    "PatientName": $scope.PatientData.Patient[0].FullName,
                    "AppointmentID": $scope.appointmentInfo.AppointmentID,
                    "Remarks": "",
                    "Base64": dataURL,
                    "SignedDate": sdate,
                    "FileTypeId": 16,
                    "S3URL": S3URL,
                    "DeleteInd": "N",
                    "DocumentID": item.LeftOrganDocId,
                    "DisplayName": item.LeftOrganDocUrl.substring(item.LeftOrganDocUrl.lastIndexOf("/") + 1),
                    "FileName": item.LeftOrganDocUrl.substring(item.LeftOrganDocUrl.lastIndexOf("/") + 1),
                    "FileExt": item.ContentType,
                    "InvestigationId": item.InvestigationId,
                    "OrganId": 2,
                    "ContentType": item.ContentType,
                    "OrganizationInvestigationId": item.OrganizationInvestigationId || null,
                    "CategoryId": item.CategoryId
                };
                eHnotePatientDataService.AddUpdatePatientDrawingImage(object).then(function (resp) {

                    if (item.CategoryId == 5) {
                        var ind = -1;
                        if (type === "Right") {
                            $scope.cacheStorageItem.AnteriorSegmentImagesArray.some(function (obj, i) {
                                return obj.DocumentID === item.RightOrganDocId ? ind = i : false;
                            });
                        } else {
                            $scope.cacheStorageItem.AnteriorSegmentImagesArray.some(function (obj, i) {
                                return obj.DocumentID === item.LeftOrganDocId ? ind = i : false;
                            });
                        }
                        var result = resp.data;
                        //result.ActiveInd = 'Y';
                        //item.LeftEye.ImagesArray[ind] = result;
                        var obj1 = {
                            "DocumentID": result.DocumentID || 0,
                            "DocURL": result.DocURL || "",
                            "CategoryId": result.CategoryId,
                            "DocName": result.DocName || '',
                            "DeleteInd": result.DeleteInd || 'N',
                            "OrganId": result.OrganId || 1,
                        }
                        $scope.cacheStorageItem.AnteriorSegmentImagesArray[ind] = obj1;
                        item.LeftOrganDocId = 0;
                        item.thumbnailLeftEye = "";
                        item.LeftEyeUndoCount = 0;
                        $scope.LeftEyefileName = "";
                        alertify.success("Image Updated Successfully");

                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
                    } else if (item.CategoryId == 12) {
                        var ind = -1;
                        $scope.cacheStorageItem.ExternalExaminationImagesArray.some(function (obj, i) {
                            return obj.DocumentID === item.RightOrganDocId ? ind = i : false;
                        });
                        var result = resp.data;
                        //result.ActiveInd = 'Y';
                        //item.LeftEye.ImagesArray[ind] = result;
                        var obj1 = {
                            "DocumentID": result.DocumentID || 0,
                            "DocURL": result.DocURL || "",
                            "CategoryId": result.CategoryId,
                            "DocName": result.DocName || '',
                            "DeleteInd": result.DeleteInd || 'N',
                            "OrganId": 1,
                        }
                        $scope.cacheStorageItem.ExternalExaminationImagesArray[ind] = obj1;
                        item.LeftOrganDocId = 0;
                        item.thumbnailLeftEye = "";
                        item.LeftEyeUndoCount = 0;
                        $scope.LeftEyefileName = "";
                        alertify.success("Image Updated Successfully");

                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.ExternalExaminationDetails);
                    } else if (item.CategoryId == 6) {
                        var ind = -1;
                        if (type === "Right") {
                            $scope.cacheStorageItem.PosteriorSegmentImagesArray.some(function (obj, i) {
                                return obj.DocumentID === item.RightOrganDocId ? ind = i : false;
                            });
                        } else {
                            $scope.cacheStorageItem.PosteriorSegmentImagesArray.some(function (obj, i) {
                                return obj.DocumentID === item.LeftOrganDocId ? ind = i : false;
                            });
                        }
                        var result = resp.data;
                        //result.ActiveInd = 'Y';
                        //item.LeftEye.ImagesArray[ind] = result;
                        var obj1 = {
                            "DocumentID": result.DocumentID || 0,
                            "DocURL": result.DocURL || "",
                            "CategoryId": result.CategoryId,
                            "DocName": result.DocName || '',
                            "DeleteInd": result.DeleteInd || 'N',
                            "OrganId": result.OrganId || 1,
                        }
                        $scope.cacheStorageItem.PosteriorSegmentImagesArray[ind] = obj1;
                        item.LeftOrganDocId = 0;
                        item.thumbnailLeftEye = "";
                        item.LeftEyeUndoCount = 0;
                        $scope.LeftEyefileName = "";
                        alertify.success("Image Updated Successfully");

                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
                    }

                    var SelectEye = type == "Right" ? '1' : '2';
                    $scope.ClickShowExaminationDrawingpad(SelectEye);

                }, function (err) {
                    alertify.error(err.Messege);
                });
            }


        };

        $scope.syncImages = function (type, item) {
            if (type === "Right") {
                var object = {
                    "AppointmentId": $scope.appointmentInfo.AppointmentID,
                    "CategoryId": item.CategoryId,
                    "InvestigationID": item.InvestigationId,
                    "OrganId": 1
                };
                eHnotePatientDataService.GetPatientInvestigationImages(object).then(function (resp) {
                    if (resp.data.length === 0) {
                        alertify.log("No Images Found");
                    } else {
                        item.RightEye.ImagesArray = resp.data;
                    }
                }, function (err) {
                    alertify.error(err.Messege);
                });
            }
            if (type === "Left") {
                var object = {
                    "AppointmentId": $scope.appointmentInfo.AppointmentID,
                    "CategoryId": item.CategoryId,
                    "InvestigationID": item.InvestigationId,
                    "OrganId": 2
                };
                eHnotePatientDataService.GetPatientInvestigationImages(object).then(function (resp) {
                    if (resp.data.length === 0) {
                        alertify.log("No Images Found");
                    } else {
                        item.LeftEye.ImagesArray = resp.data;
                    }
                }, function (err) {
                    alertify.error(err.Messege);
                });
            }
        };

        $scope.undoEyeCount = function (item, type) {
            //item.IsUndoClicked = true;
            if (type === "Right") {
                item.RightEyeUndoCount--;
            }
            if (type === "Left") {
                item.LeftEyeUndoCount--;
            }
        };
        $scope.undoEyeCount1 = function (item, type) {
            //item.IsUndoClicked = true;
            if (type === "Right") {
                item.RightEyeUndoCount++;
            }
            if (type === "Left") {
                item.LeftEyeUndoCount++;
            }
        };

        $scope.zoomIn = function (View) {
            var View1 = View;
            var imageId = document.getElementById(View1);
            var currWidth = imageId.clientWidth;
            var currHeight = imageId.clientHeight;
            imageId.style.width = (currWidth + 50) + "px";
            imageId.style.height = (currHeight + 20) + "px";
            //if (imageId.style.width == "630px") {
            //imageId.style.width = "100";
            //imageId.style.height = "100";
            //} else {
            //    imageId.style.width = "400px";
            //    imageId.style.height = "400px";
            //}

            var View2 = View + "Tmp";
            var imageId2 = document.getElementById(View2);
            var currWidth2 = imageId2.clientWidth;
            var currHeight2 = imageId.clientHeight;
            imageId2.style.width = imageId.style.width;//(currWidth2 + 50) + "px";
            imageId2.style.height = imageId.style.height;//(currHeight2 + 20) + "px";
        }
        $scope.zoomOut = function (View) {
            var View1 = View;
            var imageId = document.getElementById(View1);
            var currWidth = imageId.clientWidth;
            var currHeight = imageId.clientHeight;
            imageId.style.width = (currWidth - 50) + "px";
            imageId.style.height = (currHeight - 20) + "px";

            var View2 = View + "Tmp";
            var imageId2 = document.getElementById(View2);
            var currWidth2 = imageId2.clientWidth;
            var currHeight2 = imageId.clientHeight;
            imageId2.style.width = imageId.style.width;//(currWidth2 + 50) + "px";
            imageId2.style.height = imageId.style.height;//(currHeight2 + 20) + "px";
        };

        $scope.fixImage = function (View) {
            var View1 = View;
            var imageId = document.getElementById(View1);
            // var currWidth = imageId.clientWidth;
            // var currHeight = imageId.clientHeight;
            imageId.style.width = "630px";
            imageId.style.height = "300px";

            var View2 = View + "Tmp";
            var imageId2 = document.getElementById(View2);
            imageId2.style.width = imageId.style.width;
            imageId2.style.height = imageId.style.height;
        }

        $scope.FileChange = function (files, type, item) {
            var file = "";
            files = files || null;
            $scope.newAnteriorObj.SelectedAnteriorObj = $scope.newAnteriorObj.SelectedAnteriorObj || '';
            if (item.CategoryId == undefined) {
                alertify.error("Before You Choose A File Please Select Investigation");
                return false;
            }
            if (item.CategoryId == 5 || item.CategoryId == 6) {
                if ($scope.newAnteriorObj.SelectedAnteriorObj == '') {
                    alertify.error("Before You Choose A File Please Select Investigation");
                    return false;
                }
            }
            //$scope.newPosteriorObj.SelectedPosteriorObj = $scope.newPosteriorObj.SelectedPosteriorObj || '';
            //if (item.CategoryId == 6) {
            //    if ($scope.newPosteriorObj.SelectedPosteriorObj == '') {
            //        alertify.error("Before You Choose A File Please Select Investigation");
            //        return false;
            //    }
            //}
            if (type === "Right") {
                if (files !== null) {
                    file = files[0];
                    item.RightEyefileName = file.name;
                    item.ContentType = file.type;
                    $scope.RightEyefileName = file.name;
                    if ($scope.fileReaderSupported && file.type.indexOf("image") > -1) {
                        $timeout(function () {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function (e) {
                                item.thumbnailRightEye = "";
                                item.RightEyediv = true;
                                $timeout(function () {

                                    item.thumbnailRightEye = e.target.result;
                                });
                            };
                        });
                    }

                    $scope.fixImage(item.RightPwCanvas);
                }
            }
            if (type === "Left") {
                if (files !== null) {
                    file = files[0];
                    item.LeftEyefileName = file.name;
                    item.ContentType = file.type;
                    $scope.LeftEyefileName = file.name;
                    if ($scope.fileReaderSupported && file.type.indexOf("image") > -1) {
                        $timeout(function () {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function (e) {
                                item.thumbnailLeftEye = "";
                                item.LeftEyediv = true;
                                $timeout(function () {
                                    item.thumbnailLeftEye = e.target.result;
                                });
                            };
                        });
                    }

                    $scope.fixImage(item.LeftPwCanvas);
                }
            }
        };

        $scope.savecanvas = function (type, item, isTemplate, whichCat) {

            console.log(item);

            var RightId = item.RightPwCanvas;
            var LeftId = item.LeftPwCanvas;

            if (type === "Right") {
                item.RightEyediv = false;
                var canvas = null;
                canvas = document.getElementById(RightId);
                var dataURL = canvas.toDataURL();

                var sdate = $filter('date')(new Date(), "yyyy-MM-dd");

                var object = {
                    "UserID": $scope.UserId,
                    "HospitalID": $scope.doctorinfo.hospitalID,
                    "PatientID": $scope.PatientData.Patient[0].PatientID,
                    "PatientName": $scope.PatientData.Patient[0].FullName,
                    "AppointmentID": $scope.appointmentInfo.AppointmentID,
                    "Remarks": "",
                    "Base64": dataURL,
                    "SignedDate": sdate,
                    "FileTypeId": 16,
                    "S3URL": "",
                    "DeleteInd": "N",
                    "DocumentID": 0,
                    "DisplayName": item.RightEyefileName,
                    "FileName": item.RightEyefileName,
                    "FileExt": item.ContentType,
                    "InvestigationId": item.InvestigationId,
                    "OrganId": 1,
                    "OrganizationInvestigationId": item.OrganizationInvestigationId || null,
                    "CategoryId": item.CategoryId
                };

                eHnotePatientDataService.AddUpdatePatientDrawingImage(object).then(function (resp) {

                    console.log(resp);

                    var result = resp.data;
                    result.DocumentId = 0;
                    /*result.ActiveInd = 'Y';*/
                    result.DeleteInd = 'N';
                    item.RightEye.ImagesArray.push(result);
                    alertify.success("Image Uploaded Successfully");
                    item.thumbnailRightEye = "";
                    item.RightEyeUndoCount = 0;
                    $scope.RightEyefileName = "";

                    if (item.CategoryId == 5) {
                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
                        $scope.SaveExaminationImages(item, $scope.cacheStorageItem.AnteriorDetails);
                    } else if (item.CategoryId == 12) {
                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.ExternalExaminationDetails);
                        $scope.SaveExaminationImages(item, $scope.cacheStorageItem.ExternalExaminationDetails);
                    } else if (item.CategoryId == 6) {
                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
                        $scope.SaveExaminationImages(item, $scope.cacheStorageItem.ExternalExaminationDetails);
                    }
                    var SelectEye = type == "Right" ? '1' : '2';
                    $scope.ClickShowExaminationDrawingpad(SelectEye);

                }, function (err) {
                    alertify.error(err.Messege);
                });
            }
            if (type === "Left") {
                item.LeftEyediv = false;
                var canvas = null;
                canvas = document.getElementById(LeftId);
                var dataURL = canvas.toDataURL();


                var object = {
                    "UserID": $scope.UserId,
                    "HospitalID": $scope.doctorinfo.hospitalID,
                    "PatientID": $scope.PatientData.Patient[0].PatientID,
                    "PatientName": $scope.PatientData.Patient[0].FullName,
                    "AppointmentID": $scope.appointmentInfo.AppointmentID,
                    "Remarks": "",
                    "Base64": dataURL,
                    "SignedDate": sdate,
                    "FileTypeId": 16,
                    "S3URL": "",
                    "DeleteInd": "N",
                    "DocumentID": 0,
                    "DisplayName": item.LeftEyefileName,
                    "FileName": item.LeftEyefileName,
                    "FileExt": item.ContentType,
                    "InvestigationId": item.InvestigationId,
                    "OrganId": 2,
                    "OrganizationInvestigationId": item.OrganizationInvestigationId || null,
                    "CategoryId": item.CategoryId
                };
                eHnotePatientDataService.AddUpdatePatientDrawingImage(object).then(function (resp) {
                    var result = resp.data;
                    result.DocumentId = 0;
                    result.DeleteInd = 'N';
                    item.LeftEye.ImagesArray.push(result);
                    alertify.success("Image Uploaded Successfully");
                    item.thumbnailLeftEye = "";
                    item.LeftEyeUndoCount = 0;
                    $scope.LeftEyefileName = "";

                    if (item.CategoryId == 5) {
                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
                        $scope.SaveExaminationImages(item, $scope.cacheStorageItem.AnteriorDetails);
                    } else if (item.CategoryId == 6) {
                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
                        $scope.SaveExaminationImages(item, $scope.cacheStorageItem.ExternalExaminationDetails);
                    } else if (item.CategoryId == 12) {
                        $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.ExternalExaminationDetails);
                        $scope.SaveExaminationImages(item, $scope.cacheStorageItem.ExternalExaminationDetails);
                    }
                    var SelectEye = type == "Right" ? '1' : '2';
                    $scope.ClickShowExaminationDrawingpad(SelectEye);
                }, function (err) {
                    alertify.error(err.Messege);
                });
            }


        };

        $scope.getFindingValues = function (val, invId) {
            var phospid = "";
            phospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

            $scope.SearchText = val || "";
            $scope.PageNumber = 1;
            eHnoteDbStaticDataService.GetAllInvestigationFindingValuesForNewTemplate(phospid, invId, 10, $scope.PageNumber, $scope.SearchText).then(function (resp) {
                $scope.AnteriorDropdownList = [];
                if (resp.data.Count !== 0) {
                    if (resp.data.Rows !== undefined) {
                        $scope.AnteriorDropdownList = resp.data.Rows;
                        angular.forEach($scope.AnteriorDropdownList, function (ditem) {
                            ditem.RiskLevel = "";
                        });
                    }
                }
            });
        };

        $scope.onInvestigationSelect = function (inv, type, RiskLevel, item) {
            var sfindingValue = "";
            type = type == "1" ? "Right" : (type == "2" ? "Left" : (type == "3" ? "Both" : ''));

            if (type === "Right") {
                if (item != undefined && item != null) {
                    inv.SelectedRightEyeRemarksObj = angular.copy(item);
                }

                inv.RightEyeRemarks = inv.SelectedRightEyeRemarksObj.FindingValue;
                inv.RightEyeRemarksId = inv.SelectedRightEyeRemarksObj.InvFindingId;
                sfindingValue = inv.SelectedRightEyeRemarksObj.FindingValue || "";

                var obj = {
                    "RemarksId": 0,
                    "ActiveInd": 'Y',
                    "DiagnosisRiskLevel": RiskLevel !== "" ? RiskLevel : 'Mild',
                    "Remarks": inv.SelectedRightEyeRemarksObj.FindingValue || "",
                    "InvFindingId": inv.SelectedRightEyeRemarksObj.InvFindingId || 0
                };

                var GOrganId = parseFloat(inv.SelectedEye) || 1;
                var obj1 = {
                    "InvFindingId": inv.SelectedRightEyeRemarksObj.InvFindingId || 0,
                    "FindingId": inv.InvestigationId,
                    "OrganizationId": $scope.HospitalID,
                    "OrganId": GOrganId
                }

                $scope.InvFindingId = inv.SelectedRightEyeRemarksObj.InvFindingId || 0;
                inv.RightEye.RemarksArray = inv.RightEye.RemarksArray || [];
                inv.SelectedRightEyeRemarksObj = inv.LeftEyeRemarks;
                if (inv.RightEye.RemarksArray.length !== 0) {
                    var List = $filter("filter")(inv.RightEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
                    if (List.length > 0) {
                        inv.SelectedRightEyeRemarksObj = "";
                        alertify.error('Its already added');
                        return;
                    }
                }
                if (inv.RightEye.RemarksArray.length > 0) {
                    angular.forEach(inv.RightEye.RemarksArray, function (Eitem, index) {
                        if (Eitem.Remarks == "Normal") {
                            inv.RightEye.RemarksArray.splice(index, 1);
                        }
                    });
                }
                inv.RightEye.RemarksArray.push(obj);
                inv.SelectedRightEyeRemarksObj = "";

                $scope.getFindingValues("", inv.InvestigationId);

                if (inv.CategoryDesc !== "External Examination") {
                }


            }
            if (type === "Left") {
                if (item != undefined && item != null) {
                    inv.SelectedLeftEyeRemarksObj = angular.copy(item);
                }

                inv.LeftEyeRemarks = inv.SelectedLeftEyeRemarksObj.FindingValue;
                inv.LeftEyeRemarksId = inv.SelectedLeftEyeRemarksObj.InvFindingId;

                sfindingValue = inv.SelectedLeftEyeRemarksObj.FindingValue || "";
                obj = {
                    "RemarksId": 0,
                    "ActiveInd": 'Y',
                    "DiagnosisRiskLevel": RiskLevel !== "" ? RiskLevel : 'Mild',
                    "Remarks": inv.SelectedLeftEyeRemarksObj.FindingValue || "",
                    "InvFindingId": inv.SelectedLeftEyeRemarksObj.InvFindingId || 0
                };


                var GOrganId = parseFloat(inv.SelectedEye) || 2;
                var obj1 = {
                    "InvFindingId": inv.SelectedLeftEyeRemarksObj.InvFindingId || 0,
                    "FindingId": inv.InvestigationId,
                    "OrganizationId": $scope.HospitalID,
                    "OrganId": GOrganId
                }

                $scope.InvFindingId = inv.SelectedLeftEyeRemarksObj.InvFindingId || 0;
                inv.LeftEye.RemarksArray = inv.LeftEye.RemarksArray || [];
                inv.SelectedLeftEyeRemarksObj = inv.LeftEyeRemarks;
                if (inv.LeftEye.RemarksArray.length > 0) {
                    var List = $filter("filter")(inv.LeftEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
                    if (List.length > 0) {
                        inv.SelectedLeftEyeRemarksObj = "";
                        alertify.error('Its already added');
                        return;
                    }
                }
                if (inv.LeftEye.RemarksArray.length > 0) {
                    angular.forEach(inv.LeftEye.RemarksArray, function (Eitem, index) {
                        if (Eitem.Remarks == "Normal") {
                            inv.LeftEye.RemarksArray.splice(index, 1);
                        }
                    });
                }
                inv.LeftEye.RemarksArray.push(obj);
                inv.SelectedLeftEyeRemarksObj = "";
                $scope.getFindingValues("", inv.InvestigationId);

                if (inv.CategoryDesc !== "External Examination") {
                }

            }
            if (type === "Both") {
                if (item != undefined && item != null) {
                    inv.SelectedBothEyeRemarksObj = angular.copy(item);
                }

                inv.BothEyeRemarks = inv.SelectedBothEyeRemarksObj.FindingValue;
                inv.BothEyeRemarksId = inv.SelectedBothEyeRemarksObj.InvFindingId;

                sfindingValue = inv.SelectedBothEyeRemarksObj.FindingValue || "";
                obj = {
                    "RemarksId": 0,
                    "ActiveInd": 'Y',
                    "DiagnosisRiskLevel": RiskLevel !== "" ? RiskLevel : 'Mild',
                    "Remarks": inv.SelectedBothEyeRemarksObj.FindingValue || "",
                    "InvFindingId": inv.SelectedBothEyeRemarksObj.InvFindingId || 0
                };



                var GOrganId = parseFloat(inv.SelectedEye) || 3;
                var obj1 = {
                    "InvFindingId": inv.SelectedBothEyeRemarksObj.InvFindingId || 0,
                    "FindingId": inv.InvestigationId,
                    "OrganizationId": $scope.HospitalID,
                    "OrganId": GOrganId
                }

                $scope.InvFindingId = inv.SelectedBothEyeRemarksObj.InvFindingId || 0;
                inv.BothEye.RemarksArray = inv.BothEye.RemarksArray || [];
                inv.SelectedBothEyeRemarksObj = inv.BothEyeRemarks;
                if (inv.BothEye.RemarksArray.length > 0) {
                    var List = $filter("filter")(inv.BothEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
                    if (List.length > 0) {
                        inv.SelectedBothEyeRemarksObj = "";
                        alertify.error('Its already added');
                        return;
                    }
                }
                inv.BothEye.RemarksArray.push(obj);
                inv.SelectedBothEyeRemarksObj = "";
                $scope.getFindingValues("", inv.InvestigationId);

                if (inv.CategoryDesc !== "External Examination") {



                }

            }

            $scope.AddToCache();
        };

        $scope.GetUserAnteriorTemplateDetails = function (type) {
            var params = {
                "UserId": $scope.UserId,
                "SearchText": "",
                "PageSize": 10,
                /*"TypeId": 1,*/
                "PageNumber": 1,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "IsFavoriteInd": 0
            }
            eHnotePatientDataService.GetExaminationTemplateDetails(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.AnteriorTemplatesArray = resp.data.rows || [];
                }
            }, function (err) {

            });
        }
        /*$scope.GetUserAnteriorTemplateDetails();*/

        $scope.SelectedExaminactionposteriorINVId = null;
        $scope.SelectPosteriorInvestigation = function (item) {
            item.RightPwCanvas = item.RightPwCanvas;
            item.IsSelected = !item.IsSelected;
            item.SelectedEye = "1";
            $scope.IsShowExaminationDrawingInd = true;
            $scope.Investigation = {};
            item.RightEyediv = false;
            item.LeftEyediv = false;
            $scope.Investigation = angular.copy(item);
            //if (item.IsSelected == false) {
            //    item.RightEye.RemarksArray = [];
            //    item.RightEye.ImagesArray = [];
            //    item.LeftEye.RemarksArray = [];
            //    item.LeftEye.ImagesArray = [];
            //    item.BothEye.RemarksArray = [];
            //    item.BothEye.ImagesArray = [];
            //    item.RightEye.Horizontal = "";
            //    item.RightEye.Vertical = "";
            //    item.RightEye.DPS = "";
            //    item.LeftEye.Horizontal = "";
            //    item.LeftEye.Vertical = "";
            //    item.LeftEye.DPS = "";
            //    item.BothEye.Horizontal = "";
            //    item.BothEye.Vertical = "";
            //    item.BothEye.DPS = "";
            //}
            item.IsShowPosterior = "Y";
            $scope.SelectedExaminactionposteriorINVId = item.InvestigationId || null;
            $scope.AnteriorDropdownList = [];
        };

        $scope.ChangesForAnteriorTemp = function (item) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Added data will be cleared. Do you still want to continue? </h4>", function () {
                if (item != null) {
                    angular.forEach($scope.AnteriorTemplatesArray, function (subitem) {
                        subitem.IsChecked = false;
                    });
                    item.IsChecked = true;
                    item.AnteriorArray = item.AnteriorArray || [];
                    if ($scope.AnteriorSegmentArrayNew.length > 0) {
                        angular.forEach($scope.AnteriorSegmentArrayNew, function (Citem) {
                            if (Citem.RemarksArray.length > 0) {
                                angular.forEach(Citem.RemarksArray, function (hitem, index) {
                                    if (hitem.RemarksId === 0) {
                                        Citem.RemarksArray.splice(index, 2);
                                    }
                                    else {
                                        hitem.ActiveInd = 'N';
                                    }
                                });
                            }
                        });
                        /* $scope.AnteriorSegmentArrayNew = [];*/
                    }

                    angular.forEach(item.AnteriorArray, function (Aitem) {
                        var object = {
                            "PatientFindingAnteriorId": 0,
                            "IsNormal": false,
                            "CategoryId": Aitem.CategoryId || 5,
                            "CategoryDesc": Aitem.CategoryName || "Anterior Segment",
                            "InvestigationId": Aitem.InvestigationId || 0,
                            "InvestigationDesc": Aitem.InvestigationDesc || "",
                            "ActiveInd": "Y",
                            "SelectedGlobalSearch": "",
                            "SelectedRightEye": 1,
                            "SelectedLeftEye": 0,
                            "RemarksArray": [],
                        };
                        angular.forEach(Aitem.AnteriorRemarks, function (Mitem) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": Mitem.InvestigationFindingId || 0,
                                "FindingValue": Mitem.Remarks || '',
                                "OrganId": Mitem.OrganId || 1,
                                "FindingId": 0,
                                "FindingName": '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": false,
                                "SubFindingList": Mitem.Subfindingslist || []
                            }
                            object.RemarksArray.push(obj);
                        });


                        $scope.AnteriorSegmentArrayNew.push(object);
                    });
                }

            }, function () {
                return;
            });


            //if ($scope.AnteriorSegmentArrayNew.length > 0) {
            //    var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Are you sure you want to clear all the data entered so far. Would you like to continue? </h4>",
            //        function () {
            //            if ($scope.AnteriorSegmentArrayNew.length > 0) {
            //                angular.forEach($scope.AnteriorSegmentArrayNew, function (Citem) {
            //                    if (Citem.RemarksArray.length > 0) {
            //                        angular.forEach(Citem.RemarksArray, function (hitem, index) {
            //                            if (hitem.RemarksId === 0) {
            //                                Citem.RemarksArray.splice(index, 2);
            //                            }
            //                            else {
            //                                hitem.ActiveInd = 'N';
            //                            }
            //                        });
            //                    }
            //                });
            //                $scope.AnteriorSegmentArrayNew = [];
            //            }

            //            angular.forEach(item.AnteriorArray, function (Aitem) {
            //                var object = {
            //                    "PatientFindingAnteriorId": 0,
            //                    "IsNormal": false,
            //                    "CategoryId": Aitem.CategoryId || 5,
            //                    "CategoryDesc": Aitem.CategoryName || "Anterior Segment",
            //                    "InvestigationId": Aitem.InvestigationId || 0,
            //                    "InvestigationDesc": Aitem.InvestigationDesc || "",
            //                    "ActiveInd": "Y",
            //                    "SelectedGlobalSearch": "",
            //                    "SelectedRightEye": 1,
            //                    "SelectedLeftEye": 0,
            //                    "RemarksArray": [],
            //                };
            //                angular.forEach(Aitem.AnteriorRemarks, function (Mitem) {
            //                    var obj = {
            //                        "RemarksId": 0,
            //                        "InvFindingId": Mitem.InvestigationFindingId || 0,
            //                        "FindingValue": Mitem.Remarks || '',
            //                        "OrganId": Mitem.OrganId || 1,
            //                        "FindingId": 0,
            //                        "FindingName": '',
            //                        "DiagnosisRiskLevel": "",
            //                        "ActiveInd": "Y",
            //                        "Notes": "",
            //                        "IsShowNotesTextBox": false,
            //                        "SubFindingList": Mitem.Subfindingslist || []
            //                    }
            //                    object.RemarksArray.push(obj);
            //                });


            //                $scope.AnteriorSegmentArrayNew.push(object);
            //            });
            //        }, function () {
            //            $scope.Examinationobj.SelectedAnteriorTemplateName = '';
            //            return false;
            //        });
            //} else {
            //    angular.forEach(item.AnteriorArray, function (Aitem) {
            //        var object = {
            //            "PatientFindingAnteriorId": 0,
            //            "IsNormal": false,
            //            "CategoryId": Aitem.CategoryId || 5,
            //            "CategoryDesc": Aitem.CategoryName || "Anterior Segment",
            //            "InvestigationId": Aitem.InvestigationId || 0,
            //            "InvestigationDesc": Aitem.InvestigationDesc || "",
            //            "ActiveInd": "Y",
            //            "SelectedGlobalSearch": "",
            //            "SelectedRightEye": 1,
            //            "SelectedLeftEye": 0,
            //            "RemarksArray": [],
            //        };
            //        angular.forEach(Aitem.AnteriorRemarks, function (Mitem) {
            //            var obj = {
            //                "RemarksId": 0,
            //                "InvFindingId": Mitem.InvestigationFindingId || 0,
            //                "FindingValue": Mitem.Remarks || '',
            //                "OrganId": Mitem.OrganId || 1,
            //                "FindingId": 0,
            //                "FindingName": '',
            //                "DiagnosisRiskLevel": "",
            //                "ActiveInd": "Y",
            //                "Notes": "",
            //                "IsShowNotesTextBox": false,
            //                "SubFindingList": Mitem.Subfindingslist || []
            //            }
            //            object.RemarksArray.push(obj);
            //        });


            //        $scope.AnteriorSegmentArrayNew.push(object);
            //    });
            //}

            //if (item.AnteriorArray.length > 0) {
            //    angular.forEach(item.AnteriorArray, function (Aitem) {
            //        var filetrarray = $filter("filter")($scope.AnteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == Aitem.InvestigationId }) || [];
            //        if (filetrarray.length == 0) {

            //            var object = {
            //                "PatientFindingAnteriorId": 0,
            //                "IsNormal": false,
            //                "CategoryId": Aitem.CategoryId || 5,
            //                "CategoryDesc": Aitem.CategoryName || "Anterior Segment",
            //                "InvestigationId": Aitem.InvestigationId || 0,
            //                "InvestigationDesc": Aitem.InvestigationDesc || "",
            //                "ActiveInd": "Y",
            //                "SelectedGlobalSearch": "",
            //                "SelectedRightEye": 1,
            //                "SelectedLeftEye": 0,
            //                "RemarksArray": [],

            //            };
            //            angular.forEach(Aitem.AnteriorRemarks, function (Mitem) {
            //                if (Mitem.OrganId == 1) {
            //                    var obj = {
            //                        "RemarksId": 0,
            //                        "InvFindingId": Mitem.InvestigationFindingId || 0,
            //                        "FindingValue": Mitem.Remarks || '',
            //                        "OrganId": Mitem.OrganId || 1,
            //                        "FindingId": 0,
            //                        "FindingName": '',
            //                        "DiagnosisRiskLevel": "",
            //                        "ActiveInd": "Y",
            //                        "Notes": "",
            //                        "IsShowNotesTextBox": false,
            //                        "SubFindingList": Mitem.Subfindingslist || []
            //                    }
            //                }
            //                if (Mitem.OrganId == 2) {
            //                    var obj = {
            //                        "RemarksId": 0,
            //                        "InvFindingId": Mitem.InvestigationFindingId || 0,
            //                        "FindingValue": Mitem.Remarks || '',
            //                        "OrganId": Mitem.OrganId || 2,
            //                        "FindingId": 0,
            //                        "FindingName": '',
            //                        "DiagnosisRiskLevel": "",
            //                        "ActiveInd": "Y",
            //                        "Notes": "",
            //                        "IsShowNotesTextBox": false,
            //                        "SubFindingList": Mitem.Subfindingslist || []
            //                    }
            //                }
            //                object.RemarksArray.push(obj);
            //            });


            //            $scope.AnteriorSegmentArrayNew.push(object);


            //        } else {
            //            angular.forEach($scope.AnteriorSegmentArrayNew, function (Citem) {
            //                if (Citem.InvestigationId == Aitem.InvestigationId) {
            //                    angular.forEach(Aitem.AnteriorRemarks, function (Mitem) {
            //                        var obj = {
            //                            "RemarksId": 0,
            //                            "InvFindingId": Mitem.InvestigationFindingId || 0,
            //                            "FindingValue": Mitem.Remarks || '',
            //                            "OrganId": Mitem.OrganId || 1,
            //                            "FindingId": 0,
            //                            "FindingName": '',
            //                            "DiagnosisRiskLevel": "",
            //                            "ActiveInd": "Y",
            //                            "Notes": "",
            //                            "IsShowNotesTextBox": false,
            //                            "SubFindingList": Mitem.Subfindingslist || []
            //                        }
            //                        var List = $filter("filter")(Citem.RemarksArray, { "FindingValue": obj.FindingValue, "ActiveInd": "Y" }, true);
            //                        if (List.length == 0) {
            //                            Citem.RemarksArray.push(obj);
            //                        }
            //                    });

            //                }

            //            });
            //        }
            //    });

            //}

            //item.AnteriorArray = item.AnteriorArray || [];
            //if (item.AnteriorArray.length > 0) {
            //    angular.forEach(item.AnteriorArray, function (Aitem) {
            //        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (Bitem) {
            //            if (Aitem.InvestigationId == Bitem.InvestigationId) {
            //                Bitem.IsShowAnterior = "Y";
            //                Bitem.IsSelected = true;
            //                angular.forEach(Aitem.AnteriorRemarks, function (Mitem) {
            //                    if (Mitem.OrganId == 1) {
            //                        var obj = {
            //                            "RemarksId": 0,
            //                            "ActiveInd": 'Y',
            //                            "DiagnosisRiskLevel": Mitem.DiagnosisRiskLevel,
            //                            "Remarks": Mitem.Remarks || "",
            //                            "InvFindingId": Mitem.InvFindingId || 0,
            //                        };
            //                        if (Bitem.RightEye.RemarksArray.length !== 0) {
            //                            var List = $filter("filter")(Bitem.RightEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
            //                            if (List.length > 0) {
            //                                return;
            //                            } else {
            //                                angular.forEach(Bitem.RightEye.RemarksArray, function (Eitem, index) {
            //                                    if (Eitem.Remarks == "Normal") {
            //                                        Bitem.RightEye.RemarksArray.splice(index, 1);
            //                                    }
            //                                });
            //                            }
            //                        }
            //                        Bitem.RightEye.RemarksArray.push(obj);
            //                    }
            //                    if (Mitem.OrganId == 2) {
            //                        var obj = {
            //                            "RemarksId": 0,
            //                            "ActiveInd": 'Y',
            //                            "DiagnosisRiskLevel": Mitem.DiagnosisRiskLevel,
            //                            "Remarks": Mitem.Remarks || "",
            //                            "InvFindingId": Mitem.InvFindingId || 0,
            //                        };
            //                        if (Bitem.LeftEye.RemarksArray.length !== 0) {
            //                            var List = $filter("filter")(Bitem.LeftEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
            //                            if (List.length > 0) {
            //                                //alertify.error('Its already added');
            //                                return;
            //                            } else {
            //                                angular.forEach(Bitem.LeftEye.RemarksArray, function (Eitem, index) {
            //                                    if (Eitem.Remarks == "Normal") {
            //                                        Bitem.LeftEye.RemarksArray.splice(index, 1);
            //                                    }
            //                                });
            //                            }
            //                        }
            //                        Bitem.LeftEye.RemarksArray.push(obj);
            //                    }
            //                    if (Mitem.OrganId == 3) {
            //                        var obj = {
            //                            "RemarksId": 0,
            //                            "ActiveInd": 'Y',
            //                            "DiagnosisRiskLevel": Mitem.DiagnosisRiskLevel,
            //                            "Remarks": Mitem.Remarks || "",
            //                            "InvFindingId": Mitem.InvFindingId || 0,
            //                        };
            //                        if (Bitem.BothEye.RemarksArray.length !== 0) {
            //                            var List = $filter("filter")(Bitem.BothEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
            //                            if (List.length > 0) {
            //                                //alertify.error('Its already added');
            //                                return;
            //                            }
            //                        }
            //                        Bitem.BothEye.RemarksArray.push(obj);
            //                    }
            //                });
            //            }
            //        });
            //    });

            //}
        }

        $scope.SaveExaminationTemplates = function (type) {

            if (type == 'Anterior') {
                $scope.TempAnteriorArray = [];
                $scope.cacheStorageItem.AnteriorDetails = $scope.cacheStorageItem.AnteriorDetails || [];
                if ($scope.cacheStorageItem.AnteriorDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (item) {
                        $scope.temparray = [];
                        angular.forEach(item.RightEye.RemarksArray, function (Sitem) {
                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": 1,
                                    "OrganName": "OD",
                                    "RemarksId": 0,
                                    "ActiveInd": "Y",
                                    "DiagnosisRiskLevel": Sitem.DiagnosisRiskLevel,
                                    "Remarks": Sitem.Remarks,
                                    "InvFindingId": Sitem.InvFindingId
                                }
                                $scope.temparray.push(obj);
                            }

                        });
                        angular.forEach(item.LeftEye.RemarksArray, function (Sitem) {
                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": 2,
                                    "OrganName": "OS",
                                    "RemarksId": 0,
                                    "ActiveInd": "Y",
                                    "DiagnosisRiskLevel": Sitem.DiagnosisRiskLevel,
                                    "Remarks": Sitem.Remarks,
                                    "InvFindingId": Sitem.InvFindingId
                                }
                                $scope.temparray.push(obj);
                            }

                        });
                        angular.forEach(item.BothEye.RemarksArray, function (Sitem) {
                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": 3,
                                    "OrganName": "OU",
                                    "RemarksId": 0,
                                    "ActiveInd": "Y",
                                    "DiagnosisRiskLevel": Sitem.DiagnosisRiskLevel,
                                    "Remarks": Sitem.Remarks,
                                    "InvFindingId": Sitem.InvFindingId
                                }
                                $scope.temparray.push(obj);
                            }

                        });

                        if ($scope.temparray.length > 0) {
                            var obj1 = {
                                "CategoryId": 5,
                                "CategoryName": "Anterior Segment",
                                "InvestigationId": item.InvestigationId,
                                "InvestigationDesc": item.InvestigationDesc,
                                "SubCategoryChildId": item.SubCategoryChildId,
                                "RemarksList": $scope.temparray || [],

                            }
                            $scope.TempAnteriorArray.push(obj1);
                        }

                    });

                    if ($scope.Examinationobj.EnterAnteriorTemplateName === "") {
                        alertify.error("Please Enter Template Name");
                        return false;
                    }
                    if ($scope.TempAnteriorArray.length === 0) {
                        alertify.error("Please Select The Anterior");
                        return false;
                    }

                    var params = {
                        "UserId": $scope.UserId,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "TypeName": "Anterior",
                        "TypeId": 1,
                        "TemplateId": 0,
                        "TemplateName": $scope.Examinationobj.EnterAnteriorTemplateName || "",
                        "AnteriorArray": $scope.TempAnteriorArray || [],
                        "PosteriorArray": [],
                        "ExternalExaminationsArray": [],
                        "DeleteInd": 'N',
                        "IsTemplateFavorites": false
                    }

                    eHnotePatientDataService.AddUpdateExaminationTemplates(params).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $scope.Examinationobj.EnterAnteriorTemplateName = '';
                            if (params.TemplateId === 0) {
                                alertify.success("Save successfully");
                            } else {
                                alertify.success("Update successfully");
                            }
                            $scope.GetUserAnteriorTemplateDetails();
                        } else {
                            alertify.error("TemplateName Already Exists");
                        }
                    }, function (err) {

                    });

                }
                $scope.GetUserAnteriorTemplateDetails();
            }
            if (type == 'Posterior') {
                $scope.TempPosteriorArray = [];
                $scope.cacheStorageItem.PosteriorDetails = $scope.cacheStorageItem.PosteriorDetails || [];
                if ($scope.cacheStorageItem.PosteriorDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (item) {
                        $scope.temparray = [];
                        angular.forEach(item.RightEye.RemarksArray, function (Sitem) {
                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": 1,
                                    "OrganName": "OD",
                                    "RemarksId": 0,
                                    "ActiveInd": "Y",
                                    "DiagnosisRiskLevel": Sitem.DiagnosisRiskLevel,
                                    "Remarks": Sitem.Remarks,
                                    "InvFindingId": Sitem.InvFindingId
                                }
                                $scope.temparray.push(obj);
                            }

                        });
                        angular.forEach(item.LeftEye.RemarksArray, function (Sitem) {
                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": 2,
                                    "OrganName": "OS",
                                    "RemarksId": 0,
                                    "ActiveInd": "Y",
                                    "DiagnosisRiskLevel": Sitem.DiagnosisRiskLevel,
                                    "Remarks": Sitem.Remarks,
                                    "InvFindingId": Sitem.InvFindingId
                                }
                                $scope.temparray.push(obj);
                            }

                        });
                        angular.forEach(item.BothEye.RemarksArray, function (Sitem) {
                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": 3,
                                    "OrganName": "OU",
                                    "RemarksId": 0,
                                    "ActiveInd": "Y",
                                    "DiagnosisRiskLevel": Sitem.DiagnosisRiskLevel,
                                    "Remarks": Sitem.Remarks,
                                    "InvFindingId": Sitem.InvFindingId
                                }
                                $scope.temparray.push(obj);
                            }

                        });

                        if ($scope.temparray.length > 0) {
                            var obj1 = {
                                "CategoryId": 6,
                                "CategoryName": "Posterior Segment",
                                "InvestigationId": item.InvestigationId,
                                "InvestigationDesc": item.InvestigationDesc,
                                "SubCategoryChildId": item.SubCategoryChildId,
                                "RemarksList": $scope.temparray || [],

                            }
                            $scope.TempPosteriorArray.push(obj1);
                        }

                    });

                    if ($scope.Examinationobj.EnterPosteriorTemplateName === "") {
                        alertify.error("Please Enter Template Name");
                        return false;
                    }
                    if ($scope.TempPosteriorArray.length === 0) {
                        alertify.error("Please Select The Posterior");
                        return false;
                    }

                    var params = {
                        "UserId": $scope.UserId,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "TypeName": "Posterior",
                        "TypeId": 2,
                        "TemplateId": 0,
                        "TemplateName": $scope.Examinationobj.EnterPosteriorTemplateName || "",
                        "AnteriorArray": [],
                        "PosteriorArray": $scope.TempPosteriorArray || [],
                        "ExternalExaminationsArray": [],
                        "DeleteInd": 'N',
                        "IsTemplateFavorites": false
                    }

                    eHnotePatientDataService.AddUpdateExaminationTemplates(params).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $scope.Examinationobj.EnterPosteriorTemplateName = '';
                            if (params.TemplateId === 0) {
                                alertify.success("Save successfully");
                            } else {
                                alertify.success("Update successfully");
                            }
                            $scope.GetUserPosteriorTemplateDetails();
                        } else {
                            alertify.error("TemplateName Already Exists");
                        }
                    }, function (err) {

                    });

                }
                $scope.GetUserPosteriorTemplateDetails();
            }
            if (type == 'ExternalExamination') {
                $scope.TempExternalExaminationArray = [];
                $scope.cacheStorageItem.ExternalExaminationDetails = $scope.cacheStorageItem.ExternalExaminationDetails || [];
                if ($scope.cacheStorageItem.ExternalExaminationDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (item) {
                        $scope.temparray = [];
                        angular.forEach(item.RightEye.RemarksArray, function (Sitem) {
                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": 1,
                                    "OrganName": "OD",
                                    "RemarksId": 0,
                                    "ActiveInd": "Y",
                                    "DiagnosisRiskLevel": Sitem.DiagnosisRiskLevel,
                                    "Remarks": Sitem.Remarks,
                                    "InvFindingId": Sitem.InvFindingId
                                }
                                $scope.temparray.push(obj);
                            }

                        });
                        angular.forEach(item.LeftEye.RemarksArray, function (Sitem) {
                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": 2,
                                    "OrganName": "OS",
                                    "RemarksId": 0,
                                    "ActiveInd": "Y",
                                    "DiagnosisRiskLevel": Sitem.DiagnosisRiskLevel,
                                    "Remarks": Sitem.Remarks,
                                    "InvFindingId": Sitem.InvFindingId
                                }
                                $scope.temparray.push(obj);
                            }

                        });
                        angular.forEach(item.BothEye.RemarksArray, function (Sitem) {
                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": 3,
                                    "OrganName": "OU",
                                    "RemarksId": 0,
                                    "ActiveInd": "Y",
                                    "DiagnosisRiskLevel": Sitem.DiagnosisRiskLevel,
                                    "Remarks": Sitem.Remarks,
                                    "InvFindingId": Sitem.InvFindingId
                                }
                                $scope.temparray.push(obj);
                            }

                        });

                        if ($scope.temparray.length > 0) {
                            var obj1 = {
                                "CategoryId": 12,
                                "CategoryName": "External Examination",
                                "InvestigationId": item.InvestigationId,
                                "InvestigationDesc": item.InvestigationDesc,
                                "SubCategoryChildId": item.SubCategoryChildId,
                                "RemarksList": $scope.temparray || [],

                            }
                            $scope.TempExternalExaminationArray.push(obj1);
                        }

                    });

                    if ($scope.Examinationobj.EnterExternalExaminationTemplateName === "") {
                        alertify.error("Please Enter Template Name");
                        return false;
                    }
                    if ($scope.TempExternalExaminationArray.length === 0) {
                        alertify.error("Please Select The ExternalExamination");
                        return false;
                    }

                    var params = {
                        "UserId": $scope.UserId,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "TypeName": "ExternalExamination",
                        "TypeId": 3,
                        "TemplateId": 0,
                        "TemplateName": $scope.Examinationobj.EnterExternalExaminationTemplateName || "",
                        "AnteriorArray": [],
                        "PosteriorArray": [],
                        "ExternalExaminationsArray": $scope.TempExternalExaminationArray || [],
                        "DeleteInd": 'N',
                        "IsTemplateFavorites": false
                    }

                    console.log(JSON.stringify(params));
                    eHnotePatientDataService.AddUpdateExaminationTemplates(params).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $scope.Examinationobj.EnterExternalExaminationTemplateName = '';
                            if (params.TemplateId === 0) {
                                alertify.success("Save successfully");
                            } else {
                                alertify.success("Update successfully");
                            }
                            $scope.GetUserExternalExaminationTemplateDetails();
                        } else {
                            alertify.error("TemplateName Already Exists");
                        }
                    }, function (err) {

                    });

                }
                $scope.GetUserExternalExaminationTemplateDetails();
            }

        }


        $scope.ChangeCheckAll = function (CategoryId, status, type) {
            //  status = !status;
            var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
            if (status) {
                if (type === "RightEyeAnt") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                //  subitem.SelectedRightEyeRemarksObj = item.FindingValue;
                                subitem.SelectedRightEyeRemarksObj = "";
                                subitem.RightEyeRemarks = item.FindingValue;
                                subitem.RightEyeRemarksId = item.InvFindingId;
                                subitem.IsSelected = true;
                                subitem.RightEyeArray = [];
                                subitem.RightEye.RemarksArray = [];
                                var obj = {
                                    "RemarksId": 0,
                                    "ActiveInd": 'Y',
                                    "Remarks": item.FindingValue || "",
                                    "InvFindingId": item.InvFindingId || 0
                                };
                                var List = [];
                                if (subitem.RightEye.RemarksArray.length > 0) {
                                    List = $filter("filter")(subitem.RightEye.RemarksArray, { "InvFindingId": obj.InvFindingId }, true);
                                    if (List.length > 0) {
                                        //alertify.error('Its already added');
                                        //return;
                                    }
                                }
                                if (List.length == 0) {
                                    subitem.RightEye.RemarksArray.push(obj);
                                }

                            }
                        });
                    });
                    $scope.cacheStorageItem.AnteriorODIsNormal = true;
                }
                if (type === "LeftEyeAnt") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.SelectedLeftEyeRemarksObj = "";
                                //  subitem.SelectedLeftEyeRemarksObj = item.FindingValue;
                                subitem.LeftEyeRemarksId = item.InvFindingId;
                                subitem.LeftEyeRemarks = item.FindingValue;
                                subitem.LeftEye.RemarksArray = [];
                                subitem.IsSelected = true;
                                var obj = {
                                    "RemarksId": 0,
                                    "ActiveInd": 'Y',
                                    "Remarks": item.FindingValue || "",
                                    "InvFindingId": item.InvFindingId || 0
                                };
                                var List = [];
                                if (subitem.LeftEye.RemarksArray.length > 0) {
                                    List = $filter("filter")(subitem.LeftEye.RemarksArray, { "InvFindingId": obj.InvFindingId }, true);
                                    if (List.length > 0) {
                                        //alertify.error('Its already added');
                                        //return;
                                    }
                                }
                                if (List.length == 0) {
                                    subitem.LeftEye.RemarksArray.push(obj);
                                }


                            }
                        });
                    });
                    $scope.cacheStorageItem.AnteriorOSIsNormal = true;
                }

                if (type === "RightEyePost") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {

                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.SelectedRightEyeRemarksObj = "";
                                //subitem.SelectedRightEyeRemarksObj = item.FindingValue;
                                subitem.RightEyeRemarks = item.FindingValue;
                                subitem.RightEyeRemarksId = item.InvFindingId;
                                subitem.RightEyeArray = [];
                                subitem.IsSelected = true;
                                subitem.RightEye.RemarksArray = [];
                                var obj = {
                                    "RemarksId": 0,
                                    "ActiveInd": 'Y',
                                    "Remarks": item.FindingValue || "",
                                    "InvFindingId": item.InvFindingId || 0
                                };
                                var List = [];
                                if (subitem.RightEye.RemarksArray.length > 0) {
                                    var List = $filter("filter")(subitem.RightEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                    if (List.length > 0) {
                                        //alertify.error('Its already added');
                                        //return;
                                    }
                                }
                                if (List.length == 0) {
                                    subitem.RightEye.RemarksArray.push(obj);
                                }

                            }
                        });
                    });
                    $scope.cacheStorageItem.PosteriorODIsNormal = true;
                }
                if (type === "LeftEyePost") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {

                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.SelectedLeftEyeRemarksObj = "";
                                //subitem.SelectedLeftEyeRemarksObj = item.FindingValue;
                                subitem.LeftEyeRemarksId = item.InvFindingId;
                                subitem.LeftEyeRemarks = item.FindingValue;
                                subitem.LeftEyeArray = [];
                                subitem.IsSelected = true;
                                subitem.LeftEye.RemarksArray = [];
                                var obj = {
                                    "RemarksId": 0,
                                    "ActiveInd": 'Y',
                                    "Remarks": item.FindingValue || "",
                                    "InvFindingId": item.InvFindingId || 0
                                };
                                var List = [];
                                if (subitem.LeftEye.RemarksArray.length > 0) {
                                    List = $filter("filter")(subitem.LeftEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                    if (List.length > 0) {
                                        alertify.error('Its already added');
                                        return;
                                    }
                                }
                                if (List.length == 0) {
                                    subitem.LeftEye.RemarksArray.push(obj);
                                }

                            }
                        });
                    });
                    $scope.cacheStorageItem.PosteriorOSIsNormal = true;
                }

                if (type === "RightEyeExter") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (subitem, subindex) {

                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.SelectedRightEyeRemarksObj = "";
                                //subitem.SelectedRightEyeRemarksObj = item.FindingValue;
                                subitem.RightEyeRemarks = item.FindingValue;
                                subitem.RightEyeRemarksId = item.InvFindingId;
                                subitem.RightEyeArray = [];
                                subitem.IsSelected = true;
                                subitem.RightEye.RemarksArray = [];
                                var obj = {
                                    "RemarksId": 0,
                                    "ActiveInd": 'Y',
                                    "Remarks": item.FindingValue || "",
                                    "InvFindingId": item.InvFindingId || 0
                                };
                                var List = [];
                                if (subitem.RightEye.RemarksArray.length > 0) {
                                    var List = $filter("filter")(subitem.RightEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                    if (List.length > 0) {
                                        //alertify.error('Its already added');
                                        //return;
                                    }
                                }
                                if (List.length == 0) {
                                    subitem.RightEye.RemarksArray.push(obj);
                                }

                            }
                        });
                    });
                    $scope.cacheStorageItem.ExternalExaminactionODIsNormal = true;
                }
                if (type === "LeftEyeExter") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.SelectedLeftEyeRemarksObj = "";
                                //subitem.SelectedLeftEyeRemarksObj = item.FindingValue;
                                subitem.LeftEyeRemarksId = item.InvFindingId;
                                subitem.LeftEyeRemarks = item.FindingValue;
                                subitem.LeftEyeArray = [];
                                subitem.IsSelected = true;
                                subitem.LeftEye.RemarksArray = [];
                                var obj = {
                                    "RemarksId": 0,
                                    "ActiveInd": 'Y',
                                    "Remarks": item.FindingValue || "",
                                    "InvFindingId": item.InvFindingId || 0
                                };
                                var List = [];
                                if (subitem.LeftEye.RemarksArray.length > 0) {
                                    List = $filter("filter")(subitem.LeftEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                    if (List.length > 0) {
                                        alertify.error('Its already added');
                                        return;
                                    }
                                }
                                if (List.length == 0) {
                                    subitem.LeftEye.RemarksArray.push(obj);
                                }

                            }
                        });
                    });
                    $scope.cacheStorageItem.ExternalExaminactionOSIsNormal = true;
                }

            } else {
                if (type === "RightEyeAnt") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.RightEyeRemarks = "";
                                subitem.RightEyeRemarksId = "";
                                subitem.SelectedRightEyeRemarksObj = "";
                                angular.forEach(subitem.RightEye.RemarksArray, function (hitem, index) {
                                    if (hitem.InvFindingId === item.InvFindingId) {
                                        subitem.RightEye.RemarksArray.splice(index, 1);
                                    }
                                });
                            }
                        });
                    });
                    $scope.cacheStorageItem.AnteriorODIsNormal = false;
                }
                if (type === "LeftEyeAnt") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.LeftEyeRemarks = "";
                                subitem.LeftEyeRemarksId = "";
                                subitem.SelectedLeftEyeRemarksObj = "";
                                angular.forEach(subitem.LeftEye.RemarksArray, function (hitem, index) {
                                    if (hitem.InvFindingId === item.InvFindingId) {
                                        subitem.LeftEye.RemarksArray.splice(index, 1);
                                    }
                                });
                            }
                        });
                    });
                    $scope.cacheStorageItem.AnteriorOSIsNormal = false;
                }

                if (type === "RightEyePost") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.RightEyeRemarks = "";
                                subitem.RightEyeRemarksId = "";
                                subitem.SelectedRightEyeRemarksObj = "";
                                angular.forEach(subitem.RightEye.RemarksArray, function (hitem, index) {
                                    if (hitem.InvFindingId === item.InvFindingId) {
                                        subitem.RightEye.RemarksArray.splice(index, 1);
                                    }
                                });
                            }
                        });
                    });

                    $scope.cacheStorageItem.PosteriorODIsNormal = false;
                }
                if (type === "LeftEyePost") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.LeftEyeRemarks = "";
                                subitem.LeftEyeRemarksId = "";
                                subitem.SelectedLeftEyeRemarksObj = "";
                                angular.forEach(subitem.LeftEye.RemarksArray, function (hitem, index) {
                                    if (hitem.InvFindingId === item.InvFindingId) {
                                        subitem.LeftEye.RemarksArray.splice(index, 1);
                                    }
                                });
                            }
                        });
                    });
                    $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                }

                if (type === "RightEyeExter") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.RightEyeRemarks = "";
                                subitem.RightEyeRemarksId = "";
                                subitem.SelectedRightEyeRemarksObj = "";
                                angular.forEach(subitem.RightEye.RemarksArray, function (hitem, index) {
                                    if (hitem.InvFindingId === item.InvFindingId) {
                                        subitem.RightEye.RemarksArray.splice(index, 1);
                                    }
                                });
                            }
                        });
                    });

                    $scope.cacheStorageItem.PosteriorODIsNormal = false;
                }
                if (type === "LeftEyeExter") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.LeftEyeRemarks = "";
                                subitem.LeftEyeRemarksId = "";
                                subitem.SelectedLeftEyeRemarksObj = "";
                                angular.forEach(subitem.LeftEye.RemarksArray, function (hitem, index) {
                                    if (hitem.InvFindingId === item.InvFindingId) {
                                        subitem.LeftEye.RemarksArray.splice(index, 1);
                                    }
                                });
                            }
                        });
                    });
                    $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                }
            }

            $scope.AddToCache();

        }

        $scope.ChangeAllPartsOfAS = function (CategoryId, status, type) {
            var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
            if (status) {
                if (type === "AllPartsOfAS") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.RightEye.RemarksArray = subitem.RightEye.RemarksArray || [];
                                if (subitem.RightEye.RemarksArray.length == 0) {
                                    subitem.SelectedRightEyeRemarksObj = "";
                                    subitem.RightEyeRemarks = item.FindingValue;
                                    subitem.RightEyeRemarksId = item.InvFindingId;
                                    subitem.IsSelected = true;
                                    subitem.RightEyeArray = [];
                                    subitem.RightEye.RemarksArray = [];
                                    var obj = {
                                        "RemarksId": 0,
                                        "ActiveInd": 'Y',
                                        "Remarks": item.FindingValue || "",
                                        "InvFindingId": item.InvFindingId || 0
                                    };
                                    var List = [];
                                    if (subitem.RightEye.RemarksArray.length > 0) {
                                        List = $filter("filter")(subitem.RightEye.RemarksArray, { "InvFindingId": obj.InvFindingId }, true);
                                    }
                                    if (List.length == 0) {
                                        subitem.RightEye.RemarksArray.push(obj);
                                    }
                                }

                                subitem.LeftEye.RemarksArray = subitem.LeftEye.RemarksArray || [];
                                if (subitem.LeftEye.RemarksArray.length == 0) {
                                    subitem.SelectedLeftEyeRemarksObj = "";
                                    subitem.LeftEyeRemarksId = item.InvFindingId;
                                    subitem.LeftEyeRemarks = item.FindingValue;
                                    subitem.LeftEye.RemarksArray = [];
                                    subitem.IsSelected = true;
                                    var obj = {
                                        "RemarksId": 0,
                                        "ActiveInd": 'Y',
                                        "Remarks": item.FindingValue || "",
                                        "InvFindingId": item.InvFindingId || 0
                                    };
                                    var List = [];
                                    if (subitem.LeftEye.RemarksArray.length > 0) {
                                        List = $filter("filter")(subitem.LeftEye.RemarksArray, { "InvFindingId": obj.InvFindingId }, true);
                                    }
                                    if (List.length == 0) {
                                        subitem.LeftEye.RemarksArray.push(obj);
                                    }
                                }
                            }
                        });
                    });
                    $scope.cacheStorageItem.AnteriorIsNormal = true;
                } else if (type === "AllPartsOfPS") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.RightEye.RemarksArray = subitem.RightEye.RemarksArray || [];
                                if (subitem.RightEye.RemarksArray.length == 0) {
                                    subitem.SelectedRightEyeRemarksObj = "";
                                    subitem.RightEyeRemarks = item.FindingValue;
                                    subitem.RightEyeRemarksId = item.InvFindingId;
                                    subitem.RightEyeArray = [];
                                    subitem.IsSelected = true;
                                    subitem.RightEye.RemarksArray = [];
                                    var obj = {
                                        "RemarksId": 0,
                                        "ActiveInd": 'Y',
                                        "Remarks": item.FindingValue || "",
                                        "InvFindingId": item.InvFindingId || 0
                                    };
                                    var List = [];
                                    if (subitem.RightEye.RemarksArray.length > 0) {
                                        var List = $filter("filter")(subitem.RightEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                    }
                                    if (List.length == 0) {
                                        subitem.RightEye.RemarksArray.push(obj);
                                    }
                                }

                                subitem.LeftEye.RemarksArray = subitem.LeftEye.RemarksArray || [];
                                if (subitem.LeftEye.RemarksArray.length == 0) {
                                    subitem.SelectedLeftEyeRemarksObj = "";
                                    subitem.LeftEyeRemarksId = item.InvFindingId;
                                    subitem.LeftEyeRemarks = item.FindingValue;
                                    subitem.LeftEyeArray = [];
                                    subitem.IsSelected = true;
                                    subitem.LeftEye.RemarksArray = [];
                                    var obj = {
                                        "RemarksId": 0,
                                        "ActiveInd": 'Y',
                                        "Remarks": item.FindingValue || "",
                                        "InvFindingId": item.InvFindingId || 0
                                    };
                                    var List = [];
                                    if (subitem.LeftEye.RemarksArray.length > 0) {
                                        List = $filter("filter")(subitem.LeftEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                    }
                                    if (List.length == 0) {
                                        subitem.LeftEye.RemarksArray.push(obj);
                                    }
                                }
                            }
                        });
                    });
                    $scope.cacheStorageItem.PosteriorIsNormal = true;
                } else if (type === "AllPartsOfEE") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.RightEye.RemarksArray = subitem.RightEye.RemarksArray || [];
                                if (subitem.RightEye.RemarksArray.length == 0) {
                                    subitem.SelectedRightEyeRemarksObj = "";
                                    subitem.RightEyeRemarks = item.FindingValue;
                                    subitem.RightEyeRemarksId = item.InvFindingId;
                                    subitem.RightEyeArray = [];
                                    subitem.IsSelected = true;
                                    subitem.RightEye.RemarksArray = [];
                                    var obj = {
                                        "RemarksId": 0,
                                        "ActiveInd": 'Y',
                                        "Remarks": item.FindingValue || "",
                                        "InvFindingId": item.InvFindingId || 0
                                    };
                                    var List = [];
                                    if (subitem.RightEye.RemarksArray.length > 0) {
                                        var List = $filter("filter")(subitem.RightEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                    }
                                    if (List.length == 0) {
                                        subitem.RightEye.RemarksArray.push(obj);
                                    }
                                }

                                subitem.LeftEye.RemarksArray = subitem.LeftEye.RemarksArray || [];
                                if (subitem.LeftEye.RemarksArray.length == 0) {
                                    subitem.SelectedLeftEyeRemarksObj = "";
                                    subitem.LeftEyeRemarksId = item.InvFindingId;
                                    subitem.LeftEyeRemarks = item.FindingValue;
                                    subitem.LeftEyeArray = [];
                                    subitem.IsSelected = true;
                                    subitem.LeftEye.RemarksArray = [];
                                    var obj = {
                                        "RemarksId": 0,
                                        "ActiveInd": 'Y',
                                        "Remarks": item.FindingValue || "",
                                        "InvFindingId": item.InvFindingId || 0
                                    };
                                    var List = [];
                                    if (subitem.LeftEye.RemarksArray.length > 0) {
                                        List = $filter("filter")(subitem.LeftEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                    }
                                    if (List.length == 0) {
                                        subitem.LeftEye.RemarksArray.push(obj);
                                    }
                                }
                            }
                        });
                    });
                    $scope.cacheStorageItem.ExternalExaminactionIsNormal = true;
                }
            } else {
                if (type === "AllPartsOfAS") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.RightEyeRemarks = subitem.RightEyeRemarks || "";
                                if (subitem.RightEyeRemarks == "Normal" || subitem.RightEyeRemarks == "") {
                                    subitem.RightEyeRemarks = "";
                                    subitem.RightEyeRemarksId = "";
                                    subitem.SelectedRightEyeRemarksObj = "";
                                    angular.forEach(subitem.RightEye.RemarksArray, function (hitem, index) {
                                        if (hitem.InvFindingId === item.InvFindingId) {
                                            subitem.RightEye.RemarksArray.splice(index, 1);
                                        }
                                    });
                                }

                                subitem.LeftEyeRemarks = subitem.LeftEyeRemarks || "";
                                if (subitem.LeftEyeRemarks == "Normal" || subitem.LeftEyeRemarks == "") {
                                    subitem.LeftEyeRemarks = "";
                                    subitem.LeftEyeRemarksId = "";
                                    subitem.SelectedLeftEyeRemarksObj = "";
                                    angular.forEach(subitem.LeftEye.RemarksArray, function (hitem, index) {
                                        if (hitem.InvFindingId === item.InvFindingId) {
                                            subitem.LeftEye.RemarksArray.splice(index, 1);
                                        }
                                    });
                                }
                            }
                        });
                    });
                    $scope.cacheStorageItem.AnteriorIsNormal = false;
                } else if (type === "AllPartsOfPS") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.RightEyeRemarks = subitem.RightEyeRemarks || "";
                                if (subitem.RightEyeRemarks == "Normal" || subitem.RightEyeRemarks == "") {
                                    subitem.RightEyeRemarks = "";
                                    subitem.RightEyeRemarksId = "";
                                    subitem.SelectedRightEyeRemarksObj = "";
                                    angular.forEach(subitem.RightEye.RemarksArray, function (hitem, index) {
                                        if (hitem.InvFindingId === item.InvFindingId) {
                                            subitem.RightEye.RemarksArray.splice(index, 1);
                                        }
                                    });
                                }

                                subitem.LeftEyeRemarks = subitem.LeftEyeRemarks || "";
                                if (subitem.LeftEyeRemarks == "Normal" || subitem.LeftEyeRemarks == "") {
                                    subitem.LeftEyeRemarks = "";
                                    subitem.LeftEyeRemarksId = "";
                                    subitem.SelectedLeftEyeRemarksObj = "";
                                    angular.forEach(subitem.LeftEye.RemarksArray, function (hitem, index) {
                                        if (hitem.InvFindingId === item.InvFindingId) {
                                            subitem.LeftEye.RemarksArray.splice(index, 1);
                                        }
                                    });
                                }
                            }
                        });
                    });
                    $scope.cacheStorageItem.PosteriorIsNormal = false;
                } else if (type === "AllPartsOfEE") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (subitem) {
                            if (item.InvestigationId === subitem.InvestigationId) {
                                subitem.RightEyeRemarks = subitem.RightEyeRemarks || "";
                                if (subitem.RightEyeRemarks == "Normal" || subitem.RightEyeRemarks == "") {
                                    subitem.RightEyeRemarks = "";
                                    subitem.RightEyeRemarksId = "";
                                    subitem.SelectedRightEyeRemarksObj = "";
                                    angular.forEach(subitem.RightEye.RemarksArray, function (hitem, index) {
                                        if (hitem.InvFindingId === item.InvFindingId) {
                                            subitem.RightEye.RemarksArray.splice(index, 1);
                                        }
                                    });
                                }

                                subitem.LeftEyeRemarks = subitem.LeftEyeRemarks || "";
                                if (subitem.LeftEyeRemarks == "Normal" || subitem.LeftEyeRemarks == "") {
                                    subitem.LeftEyeRemarks = "";
                                    subitem.LeftEyeRemarksId = "";
                                    subitem.SelectedLeftEyeRemarksObj = "";
                                    angular.forEach(subitem.LeftEye.RemarksArray, function (hitem, index) {
                                        if (hitem.InvFindingId === item.InvFindingId) {
                                            subitem.LeftEye.RemarksArray.splice(index, 1);
                                        }
                                    });
                                }
                            }
                        });
                    });
                    $scope.cacheStorageItem.ExternalExaminactionIsNormal = false;
                }
            }

            $scope.AddToCache();

        }

        $scope.SaveSelectedDiagnosis = function () {

            angular.forEach($scope.SearchDiagnosisList, function (item) {
                if (item.IsChecked == true) {
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
                        "SnomedCodeId": 0,
                        "SnomedCode": "",
                        "CreatedDateTime": $filter('date')(new Date(), "dd-MMM-yyyy h:mm a"),
                        "SpecializationId": $scope.SpecializationId,
                        "RDiagnosisStatusId": null,
                        "LDiagnosisStatusId": null,
                        /*"RDiagnosisStatus": "Provisional",*/
                        /*"LDiagnosisStatus": "Provisional",*/
                        "Type": "Optha",
                        "GeneralSeverityId": null,
                        "GeneralSeverityName": null,
                        "GeneralDiagnosisStatusId": '',
                        "GeneralDiagnosisStatusName": '',
                        "GeneralVerificationStatusId": '',
                        "GeneralVerificationStatus": '',
                        "OrganId": "1",
                        "OrganName": "OD",
                        "DiagnosisId": item.DiagnosisId,
                        "DiagnosisRiskLevel": 'Mild',
                        "DiagnosisStatus": 1,
                        "FindingDiagnosisId": item.FindingDiagnosisId,
                        "DiagnosisHistoryId": 0,
                        "ICD10CODE": item.ICD10CODE,
                        "ICD10DIAGDESCRIPTION": item.ICD10DIAGDESCRIPTION,
                        "ICD10DIAGNAME": item.ICD10DIAGNAME,
                        "PlanOfcareNotesArray": item.PlanOfcareNotesArray || [],
                        "ProceduresArray": [],
                        "PrescriptionArray": [],
                        "SurgeryArray": [],
                        "InvestigationsArray": [],
                        "ReferralArray": [],
                        "ProceduresAddedTime": "",
                        "PrescriptionAddedTime": "",
                        "PlanOfCareAddedTime": "",
                        "SurgeryAddedTime": "",
                        "InvestigationFindingId": item.InvFindingId || 0,
                        "FindingId": item.InvestigationId || 0,
                        "InvestigationDesc": item.InvestigationDesc,
                        "InvestigationFindingValues": item.InvestigationDesc,
                        "ActiveInd": "Y",
                        "DeleteInd": "N",
                        "StatusList": [],
                        "ODSeverityId": 0,
                        "OSSeverityId": 0,
                        "AssessmentsNotes": "",
                        "PlanofDiscussionsNotes": "",
                        "PatientInstructions": "",
                        "ActionsTaken": "",
                        "DoctorNotes": "",
                    };
                    obj.StatusList = [
                        {
                            "OrganStatusId": null,
                            "OrganId": "1",
                            "SeverityId": null,
                            "Verificationstatusid": null,
                            "DiagnosisStatus": 'Provisional',
                            "DiagnosisStatusId": 1,
                            "EndDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "StartDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "DeleteInd": 'N',

                        },
                        {
                            "OrganStatusId": null,
                            "OrganId": "2",
                            "SeverityId": null,
                            "Verificationstatusid": null,
                            "DiagnosisStatus": 'Provisional',
                            "DiagnosisStatusId": 1,
                            "EndDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "StartDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "DeleteInd": 'N',

                        }
                    ];
                    if (item.OrganId == 1) {
                        obj.RDiagnosisStatusId = item.OrganId || 1;
                    } else {
                        obj.LDiagnosisStatusId = item.OrganId || 1;
                    }
                    console.log(obj);
                    $scope.newsObject = $scope.getsbObject();
                    $scope.newsObject.ICD10Code = item.ICD10CODE;
                    $scope.newsObject.Description = item.ICD10DIAGNAME;
                    $scope.newsObject.IsDiagnosis = true;
                    $scope.newsObject.Quantity = 0;
                    $scope.newsObject.SelectedObject = item;
                    $scope.newsObject.Type = item.Type;
                    $scope.newsObject.DescriptionId = item.DiagnosisId;
                    $scope.newsObject.RowId = $scope.cacheStorageItem.SuperBillDiagnosisArray.length + 1;
                    $scope.cacheStorageItem.SuperBillDiagnosisArray.push($scope.newsObject);
                    if (item.ProceduresArray.length > 0) {
                        angular.forEach(item.ProceduresArray, function (sitem) {
                            var pobject = {
                                "PatientTreatmentId": 0,
                                "SpecializationId": $scope.SpecializationId,
                                "OrganId": 1,
                                "OrganName": GetEyeName(1),
                                "Teethno": [],
                                "showProceduresTreatments": false,
                                "TreatmentData": {
                                    "TreatmentHistoryId": 0,
                                    "ProcedureId": sitem.ProcedureId,
                                    "OrgProcedureId": sitem.OrgProcedureId,
                                    "TreatmentName": sitem.ProcedureName,
                                    "TreatmentNotes": item.ProcedureNotes || "",
                                    "ProcedureMaxCost": item.GeneralCost || 0,
                                    "TreatmentCost": item.GeneralCost || 0,
                                    "Multiplyfactor": 1,
                                    "DiscountCost": 0,
                                    "TreatmentStatus": "1",
                                    "discountValue": "",
                                    "discountType": "P",
                                    "TreatmentDiscountAmt": 0,
                                    "ShowNote": false,
                                    "TreatmentFinalCost": 0,
                                    "RecommendedForSurgery": "N",
                                    "SurgeryData": {},
                                    "SurgeryStatusId": 0,
                                    "TotalSittings": 0,
                                    "ActiveInd": 'Y',
                                    "IsTreatmentInvoiced": false,
                                    "IsProcedureCostdisable": false,
                                    "ModifiedBy": $scope.DisplayName,
                                    "ModifiedDt": $scope.DisplayDate,
                                    "RedoTreatmentInd": false,
                                    "RedoTreatmentRemarks": ""
                                },
                                "ActiveInd": 'Y'
                            };
                            $scope.newsObject = $scope.getsbObject();
                            $scope.newsObject.CPTCode = sitem.BillingCode;
                            $scope.newsObject.Description = sitem.ProcedureName;
                            $scope.newsObject.IsDiagnosis = false;
                            $scope.newsObject.Quantity = 1;
                            $scope.newsObject.SelectedObject = sitem;
                            $scope.newsObject.DescriptionId = sitem.ProcedureId;
                            $scope.newsObject.OrgDescriptionId = sitem.OrgProcedureId;
                            $scope.newsObject.RowId = $scope.cacheStorageItem.SuperBillProceduresArray.length + 1;
                            $scope.cacheStorageItem.SuperBillProceduresArray.push($scope.newsObject);
                            obj.ProceduresArray.push(pobject);
                        });
                    }



                    if (obj.ProceduresArray.length > 0) {
                        obj.ProceduresAddedTime = $filter('date')(new Date(), "dd-MMM-yyyy h:mm a");
                    } else {
                        obj.ProceduresAddedTime = "";
                    }
                    if (obj.PrescriptionArray.length > 0) {
                        obj.PrescriptionAddedTime = $filter('date')(new Date(), "dd-MMM-yyyy h:mm a");
                    } else {
                        obj.PrescriptionAddedTime = "";
                    }
                    if (obj.SurgeryArray.length > 0) {
                        obj.SurgeryAddedTime = $filter('date')(new Date(), "dd-MMM-yyyy h:mm a");
                    } else {
                        obj.SurgeryAddedTime = "";
                    }
                    $scope.cacheStorageItem.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];
                    var List = $filter("filter")($scope.cacheStorageItem.AssessmentPlan, function (FAitem, index) { return FAitem.DiagnosisId === item.DiagnosisId }) || [];
                    if (List.length > 0) {
                        angular.forEach(List, function (Litem) {
                            Litem.RDiagnosisStatusId = item.OrganId || 1;
                            Litem.LDiagnosisStatusId = item.OrganId || 1;
                        });

                    }
                    if (List.length == 0) {
                        $scope.cacheStorageItem.AssessmentPlan.push(obj);
                    }
                }
            });
            $scope.SuggestionsObj.ShowSuggestedCodes = false;

        }
        $scope.SuggestionsObj = {
            "ShowSuggestedCodes": false
        };



        $scope.addDiagnosisForFindingValue = function (inv, item) {

            /*var GOrganId = parseFloat(inv.SelectedEye) || 1;*/
            var GOrganId = parseFloat(inv.OrganId) || 1;
            var obj1 = {
                "InvFindingId": inv.InvFindingId || 0,
                "FindingId": item.InvestigationId,
                "OrganizationId": $scope.HospitalID,
                "OrganId": GOrganId
            }

            eHnotePatientDataService.GetOrgDiagnosisByFindingId(obj1).then(function (resp) {
                if (resp.data.status == "Success") {
                    if (resp.data.DiagnosisList.length > 0) {
                        $scope.SuggestionsObj.ShowSuggestedCodes = true;
                        $scope.SearchDiagnosisList = resp.data.DiagnosisList || [];
                        if ($scope.SearchDiagnosisList.length > 0) {
                            angular.forEach($scope.SearchDiagnosisList, function (item) {
                                item.IsChecked = false;
                                item.InvestigationId = inv.InvestigationId;
                                item.InvestigationDesc = inv.InvestigationDesc;
                                item.InvFindingId = inv.InvFindingId;
                                item.OrganId = inv.OrganId || 1;
                            });
                        }

                        //$scope.AddDiagAutoPOPUP(resp.data.DiagnosisList, inv, citem.Remarks);

                    } else {
                        alertify.error("No Adviced Diagnosis");
                        return false;
                    }

                }

            }, function (err) {
                console.log(err);
            });

            $scope.AddToCache();
        };

        $scope.OpenExaminationImagesPopup = function (item, array) {
            var modalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/notes/ExaminationImagesPopUp.html",
                "controller": "EhnoteExaminationImagePopUpCtrl",
                "resolve": {
                    "Investigation": function () { return item; },
                    "cache": function () { return $scope.cacheStorageItem; },
                    "unaidedInvestigation": function () { return $filter("filter")($scope.cacheStorageItem.VisionDetails, { "InvestigationId": 4 }, true)[0]; },
                    "aidedInvestigation": function () { return $filter("filter")($scope.cacheStorageItem.VisionDetails, { "InvestigationId": 5 }, true)[0]; },
                    "pinholeInvestigation": function () { return $filter("filter")($scope.cacheStorageItem.VisionDetails, { "InvestigationId": 13 }, true)[0]; },
                    "Appointmentinfo": function () { return angular.copy($scope.appointmentInfo); }
                },
                "size": "md",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope
            });
            modalInstance.result.then(function (Investigation) {

                $scope.ReSaveInevstiagtion(Investigation, array);
            }, function (Investigation) {
                $scope.ReSaveInevstiagtion(Investigation, array);
            });
        };

        $scope.ReSaveInevstiagtion = function (Investigation, array) {
            var Index = -1;
            Index = array.findIndex(record => record.InvestigationId === Investigation.InvestigationId);
            if (Index > -1) {
                array[Index] = Investigation;
            }
            /*$scope.AddInvToCache();*/
        };

        $scope.SaveExaminationImages = function (Investigation, array) {
            if (Investigation.CategoryId == 5) {
                if (Investigation.SelectedEye == "1") {
                    if (Investigation.RightEye.ImagesArray.length > 0) {
                        angular.forEach(Investigation.RightEye.ImagesArray, function (Aitem, index) {
                            Aitem.AppointmentId = Aitem.AppointmentId || "";
                            if (Aitem.AppointmentId != "") {
                                var obj = {
                                    "DocumentID": Aitem.DocumentID || 0,
                                    "DocURL": Aitem.DocURL || "",
                                    "CategoryId": Aitem.CategoryId || 5,
                                    "DocName": Aitem.DocName || '',
                                    "DeleteInd": Aitem.DeleteInd || 'N',
                                    "OrganId": 1,
                                    "InvestigationId": Aitem.InvestigationId || 0,
                                }
                                var List = $filter("filter")($scope.cacheStorageItem.AnteriorSegmentImagesArray, { "DocumentID": Aitem.DocumentID, "DeleteInd": "N" }, true);
                                if (List == 0) {
                                    $scope.cacheStorageItem.AnteriorSegmentImagesArray.push(obj);
                                }
                            }
                        });
                    }
                    Investigation.RightEye.ImagesArray = [];
                }
                if (Investigation.SelectedEye == "2") {
                    if (Investigation.LeftEye.ImagesArray.length > 0) {
                        angular.forEach(Investigation.LeftEye.ImagesArray, function (Aitem, index) {
                            Aitem.AppointmentId = Aitem.AppointmentId || "";
                            if (Aitem.AppointmentId != "") {
                                var obj = {
                                    "DocumentID": Aitem.DocumentID || 0,
                                    "DocURL": Aitem.DocURL || "",
                                    "CategoryId": Aitem.CategoryId || 5,
                                    "DocName": Aitem.DocName || '',
                                    "DeleteInd": Aitem.DeleteInd || 'N',
                                    "OrganId": 2,
                                    "InvestigationId": Aitem.InvestigationId || 0,
                                }
                                var List = $filter("filter")($scope.cacheStorageItem.AnteriorSegmentImagesArray, { "DocumentID": Aitem.DocumentID, "DeleteInd": "N" }, true);
                                if (List == 0) {
                                    $scope.cacheStorageItem.AnteriorSegmentImagesArray.push(obj);
                                }
                            }
                        });
                    }
                    Investigation.LeftEye.ImagesArray = [];
                }
            } else if (Investigation.CategoryId == 6) {
                if (Investigation.SelectedEye == "1") {
                    if (Investigation.RightEye.ImagesArray.length > 0) {
                        angular.forEach(Investigation.RightEye.ImagesArray, function (Aitem, index) {
                            Aitem.AppointmentId = Aitem.AppointmentId || "";
                            if (Aitem.AppointmentId != "") {
                                var obj = {
                                    "DocumentID": Aitem.DocumentID || 0,
                                    "DocURL": Aitem.DocURL || "",
                                    "CategoryId": Aitem.CategoryId || 6,
                                    "DocName": Aitem.DocName || '',
                                    "DeleteInd": Aitem.DeleteInd || 'N',
                                    "OrganId": 1,
                                    "InvestigationId": Aitem.InvestigationId || 0,
                                }
                                var List = $filter("filter")($scope.cacheStorageItem.PosteriorSegmentImagesArray, { "DocumentID": Aitem.DocumentID, "DeleteInd": "N" }, true);
                                if (List == 0) {
                                    $scope.cacheStorageItem.PosteriorSegmentImagesArray.push(obj);
                                }
                            }
                        });
                    }
                    Investigation.RightEye.ImagesArray = [];
                }
                if (Investigation.SelectedEye == "2") {
                    if (Investigation.LeftEye.ImagesArray.length > 0) {
                        angular.forEach(Investigation.LeftEye.ImagesArray, function (Aitem, index) {
                            Aitem.AppointmentId = Aitem.AppointmentId || "";
                            if (Aitem.AppointmentId != "") {
                                var obj = {
                                    "DocumentID": Aitem.DocumentID || 0,
                                    "DocURL": Aitem.DocURL || "",
                                    "CategoryId": Aitem.CategoryId || 6,
                                    "DocName": Aitem.DocName || '',
                                    "DeleteInd": Aitem.DeleteInd || 'N',
                                    "OrganId": 2,
                                    "InvestigationId": Aitem.InvestigationId || 0,
                                }
                                var List = $filter("filter")($scope.cacheStorageItem.PosteriorSegmentImagesArray, { "DocumentID": Aitem.DocumentID, "DeleteInd": "N" }, true);
                                if (List == 0) {
                                    $scope.cacheStorageItem.PosteriorSegmentImagesArray.push(obj);
                                }
                            }
                        });
                    }
                    Investigation.LeftEye.ImagesArray = [];
                }
            } else if (Investigation.CategoryId == 12) {
                if (Investigation.SelectedEye == "1") {
                    if (Investigation.RightEye.ImagesArray.length > 0) {
                        angular.forEach(Investigation.RightEye.ImagesArray, function (Aitem, index) {
                            Aitem.AppointmentId = Aitem.AppointmentId || "";
                            if (Aitem.AppointmentId != "") {
                                var obj = {
                                    "DocumentID": Aitem.DocumentID || 0,
                                    "DocURL": Aitem.DocURL || "",
                                    "CategoryId": Aitem.CategoryId || 6,
                                    "DocName": Aitem.DocName || '',
                                    "DeleteInd": Aitem.DeleteInd || 'N',
                                    "OrganId": 1,
                                }
                                var List = $filter("filter")($scope.cacheStorageItem.ExternalExaminationImagesArray, { "DocumentID": Aitem.DocumentID, "DeleteInd": "N" }, true);
                                if (List == 0) {
                                    $scope.cacheStorageItem.ExternalExaminationImagesArray.push(obj);
                                }
                            }
                        });
                    }
                    Investigation.RightEye.ImagesArray = [];
                }
                if (Investigation.SelectedEye == "2") {
                    if (Investigation.LeftEye.ImagesArray.length > 0) {
                        angular.forEach(Investigation.LeftEye.ImagesArray, function (Aitem, index) {
                            Aitem.AppointmentId = Aitem.AppointmentId || "";
                            if (Aitem.AppointmentId != "") {
                                var obj = {
                                    "DocumentID": Aitem.DocumentID || 0,
                                    "DocURL": Aitem.DocURL || "",
                                    "CategoryId": Aitem.CategoryId || 6,
                                    "DocName": Aitem.DocName || '',
                                    "DeleteInd": Aitem.DeleteInd || 'N',
                                    "OrganId": 2,
                                }
                                var List = $filter("filter")($scope.cacheStorageItem.ExternalExaminationImagesArray, { "DocumentID": Aitem.DocumentID, "DeleteInd": "N" }, true);
                                if (List == 0) {
                                    $scope.cacheStorageItem.ExternalExaminationImagesArray.push(obj);
                                }
                            }
                        });
                    }
                    Investigation.LeftEye.ImagesArray = [];
                }
            }
        };

        $scope.ChangeCDRSelectedEye = function (eye) {
            $scope.PosteriorDPSSelectedEye = eye;
            $scope.CDRHorizantalList = GetPosteriorCDR();
            $scope.CDRVerticalList = GetPosteriorCDR();
            $scope.CDR_DPSList = GetPosteriorCDR();

            var horizantal = "";
            var vertical = "";
            var DPS = "";
            if ($scope.cacheStorageItem.PosteriorDetails.length > 0) {
                angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (pitem) {
                    if (pitem.InvestigationId == 32) {
                        if (eye == "OD") {
                            horizantal = pitem.RightEye.Horizontal;
                            vertical = pitem.RightEye.Vertical;
                            DPS = pitem.RightEye.DPS;
                        } else if (eye == "OS") {
                            horizantal = pitem.LeftEye.Horizontal;
                            vertical = pitem.LeftEye.Vertical;
                            DPS = pitem.LeftEye.DPS;
                        } else {
                            horizantal = pitem.BothEye.Horizontal;
                            vertical = pitem.BothEye.Vertical;
                            DPS = pitem.BothEye.DPS;
                        }
                    }
                });
            }

            if (horizantal != undefined && horizantal != "") {
                var filter = $filter("filter")($scope.CDRHorizantalList, { "Value": horizantal }, true);
                if (filter.length > 0) {
                    filter[0].IsChecked = true;
                }
            }
            if (vertical != undefined && vertical != "") {
                var filter = $filter("filter")($scope.CDRVerticalList, { "Value": vertical }, true);
                if (filter.length > 0) {
                    filter[0].IsChecked = true;
                }
            }
            if (DPS != undefined && DPS != "") {
                var filter = $filter("filter")($scope.CDR_DPSList, { "Value": DPS }, true);
                if (filter.length > 0) {
                    filter[0].IsChecked = true;
                }
            }
        }

        $scope.ChangePosteriorCDR = function (array, item, inv, eye, valuetype) {
            angular.forEach(array, function (aitem) {
                aitem.IsChecked = false;
            });
            item.IsChecked = true;
            if ($scope.cacheStorageItem.PosteriorDetails.length > 0) {
                angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (pitem) {
                    if (pitem.InvestigationId == 32) {
                        if (eye == "OD") {
                            if (valuetype == 'HZ') {
                                pitem.RightEye.Horizontal = item.Value || "";
                            } else if (valuetype == 'VT') {
                                pitem.RightEye.Vertical = item.Value || "";
                            } else {
                                pitem.RightEye.DPS = item.Value || "";
                            }
                        } else if (eye == "OS") {
                            if (valuetype == 'HZ') {
                                pitem.LeftEye.Horizontal = item.Value || "";
                            } else if (valuetype == 'VT') {
                                pitem.LeftEye.Vertical = item.Value || "";
                            } else {
                                pitem.LeftEye.DPS = item.Value || "";
                            }
                        } else {
                            if (valuetype == 'HZ') {
                                pitem.BothEye.Horizontal = item.Value || "";
                            } else if (valuetype == 'VT') {
                                pitem.BothEye.Vertical = item.Value || "";
                            } else {
                                pitem.BothEye.DPS = item.Value || "";
                            }
                        }
                    }
                });
            }
        };

        $scope.removeRightPosterior = function (item, inv) {
            angular.forEach(inv.RightEye.RemarksArray, function (hitem, index) {
                if (hitem.InvFindingId === item.InvFindingId && hitem.Remarks === item.Remarks) {
                    if (hitem.RemarksId === 0) {
                        inv.RightEye.RemarksArray.splice(index, 1);
                    }
                    else {
                        hitem.ActiveInd = 'N';
                    }
                    inv.RightEyeRemarks = "";
                }
            });
        };
        $scope.removeLeftPosterior = function (item, inv) {
            angular.forEach(inv.LeftEye.RemarksArray, function (hitem, index) {
                if (hitem.InvFindingId === item.InvFindingId && hitem.Remarks === item.Remarks) {
                    if (hitem.RemarksId === 0) {
                        inv.LeftEye.RemarksArray.splice(index, 1);
                    }
                    else {
                        hitem.ActiveInd = 'N';
                    }
                    inv.LeftEyeRemarks = "";
                }
            });
            /*$scope.PosteriorFocusObj = GetPosteriorFocusObj();*/
        };

        $scope.ChnageAnteriorOrgan = function () {
            $scope.AnteriorDropdownList = [];
        };

        $scope.GetUserPosteriorTemplateDetails = function () {
            var params = {
                "UserId": $scope.UserId,
                "SearchText": "",
                "PageSize": 10,
                "TypeId": 2,
                "PageNumber": 1,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "IsFavoriteInd": 0
            }
            eHnotePatientDataService.GetExaminationTemplateDetails(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.PosteriorTemplatesArray = resp.data.rows || [];
                }

            }, function (err) {

            });
        }
        /*$scope.GetUserPosteriorTemplateDetails();*/

        $scope.GetUserExternalExaminationTemplateDetails = function () {
            var params = {
                "UserId": $scope.UserId,
                "SearchText": "",
                "PageSize": 10,
                "TypeId": 3,
                "PageNumber": 1,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "IsFavoriteInd": 0
            }
            eHnotePatientDataService.GetExaminationTemplateDetails(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.ExternalExaminationTemplatesArray = resp.data.rows || [];
                }

            }, function (err) {

            });
        }
        /*$scope.GetUserExternalExaminationTemplateDetails();*/

        $scope.ChangesForPosteriorTemp = function (item) {

            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Added data will be cleared. Do you still want to continue? </h4>", function () {
                angular.forEach($scope.PosteriorTemplatesArray, function (subitem) {
                    subitem.IsChecked = false;
                });
                item.IsChecked = true;
                item.PosteriorArray = item.PosteriorArray || [];
                if ($scope.PoteriorSegmentArrayNew.length > 0) {
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (Citem) {
                        if (Citem.RemarksArray.length > 0) {
                            angular.forEach(Citem.RemarksArray, function (hitem, index) {
                                if (hitem.RemarksId === 0) {
                                    Citem.RemarksArray.splice(index, 2);
                                }
                                else {
                                    hitem.ActiveInd = 'N';
                                }
                            });
                        }
                    });
                }

                angular.forEach(item.PosteriorArray, function (Aitem) {
                    var object = {
                        "PatientFindingPosteriorId": 0,
                        "IsNormal": false,
                        "CategoryId": Aitem.CategoryId || 6,
                        "CategoryDesc": Aitem.CategoryName || "Posterior Segment",
                        "InvestigationId": Aitem.InvestigationId || 0,
                        "InvestigationDesc": Aitem.InvestigationDesc || "",
                        "ActiveInd": "Y",
                        "SelectedGlobalSearch": "",
                        "SelectedRightEye": 1,
                        "SelectedLeftEye": 0,
                        "RemarksArray": [],
                    };
                    angular.forEach(Aitem.PosteriorRemarks, function (Mitem) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": Mitem.InvestigationFindingId || 0,
                            "FindingValue": Mitem.Remarks || '',
                            "OrganId": Mitem.OrganId || 1,
                            "FindingId": 0,
                            "FindingName": '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": "",
                            "IsShowNotesTextBox": false,
                            "SubFindingList": Mitem.Subfindingslist || []
                        }
                        object.RemarksArray.push(obj);
                    });


                    $scope.PoteriorSegmentArrayNew.push(object);
                });

            }, function () {
                return;
            });

            //if ($scope.PoteriorSegmentArrayNew.length > 0) {
            //    var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Are you sure you want to clear all the data entered so far. Would you like to continue? </h4>",
            //        function () {
            //            if ($scope.PoteriorSegmentArrayNew.length > 0) {
            //                angular.forEach($scope.PoteriorSegmentArrayNew, function (Citem) {
            //                    if (Citem.RemarksArray.length > 0) {
            //                        angular.forEach(Citem.RemarksArray, function (hitem, index) {
            //                            if (hitem.RemarksId === 0) {
            //                                Citem.RemarksArray.splice(index, 2);
            //                            }
            //                            else {
            //                                hitem.ActiveInd = 'N';
            //                            }
            //                        });
            //                    }
            //                });
            //                $scope.PoteriorSegmentArrayNew = [];
            //            }

            //            angular.forEach(item.PosteriorArray, function (Aitem) {
            //                var object = {
            //                    "PatientFindingAnteriorId": 0,
            //                    "IsNormal": false,
            //                    "CategoryId": Aitem.CategoryId || 6,
            //                    "CategoryDesc": Aitem.CategoryName || "Posterior Segment",
            //                    "InvestigationId": Aitem.InvestigationId || 0,
            //                    "InvestigationDesc": Aitem.InvestigationDesc || "",
            //                    "ActiveInd": "Y",
            //                    "SelectedGlobalSearch": "",
            //                    "SelectedRightEye": 1,
            //                    "SelectedLeftEye": 0,
            //                    "RemarksArray": [],
            //                };
            //                angular.forEach(Aitem.AnteriorRemarks, function (Mitem) {
            //                    var obj = {
            //                        "RemarksId": 0,
            //                        "InvFindingId": Mitem.InvestigationFindingId || 0,
            //                        "FindingValue": Mitem.Remarks || '',
            //                        "OrganId": Mitem.OrganId || 1,
            //                        "FindingId": 0,
            //                        "FindingName": '',
            //                        "DiagnosisRiskLevel": "",
            //                        "ActiveInd": "Y",
            //                        "Notes": "",
            //                        "IsShowNotesTextBox": false,
            //                        "SubFindingList": Mitem.Subfindingslist || []
            //                    }
            //                    object.RemarksArray.push(obj);
            //                });


            //                $scope.PoteriorSegmentArrayNew.push(object);
            //            });
            //        }, function () {
            //            $scope.Examinationobj.SelectedAnteriorTemplateName = '';
            //            return false;
            //        });
            //} else {
            //    angular.forEach(item.AnteriorArray, function (Aitem) {
            //        var object = {
            //            "PatientFindingAnteriorId": 0,
            //            "IsNormal": false,
            //            "CategoryId": Aitem.CategoryId || 6,
            //            "CategoryDesc": Aitem.CategoryName || "Posterior Segment",
            //            "InvestigationId": Aitem.InvestigationId || 0,
            //            "InvestigationDesc": Aitem.InvestigationDesc || "",
            //            "ActiveInd": "Y",
            //            "SelectedGlobalSearch": "",
            //            "SelectedRightEye": 1,
            //            "SelectedLeftEye": 0,
            //            "RemarksArray": [],
            //        };
            //        angular.forEach(Aitem.AnteriorRemarks, function (Mitem) {
            //            var obj = {
            //                "RemarksId": 0,
            //                "InvFindingId": Mitem.InvestigationFindingId || 0,
            //                "FindingValue": Mitem.Remarks || '',
            //                "OrganId": Mitem.OrganId || 1,
            //                "FindingId": 0,
            //                "FindingName": '',
            //                "DiagnosisRiskLevel": "",
            //                "ActiveInd": "Y",
            //                "Notes": "",
            //                "IsShowNotesTextBox": false,
            //                "SubFindingList": Mitem.Subfindingslist || []
            //            }
            //            object.RemarksArray.push(obj);
            //        });


            //        $scope.PoteriorSegmentArrayNew.push(object);
            //    });
            //}

            //if (item.PosteriorArray.length > 0) {
            //    angular.forEach(item.PosteriorArray, function (Aitem) {
            //        var filetrarray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == Aitem.InvestigationId }) || [];
            //        if (filetrarray.length == 0) {

            //            var object = {
            //                "PatientFindingPosteriorId": 0,
            //                "IsNormal": false,
            //                "CategoryId": Aitem.CategoryId || 6,
            //                "CategoryDesc": Aitem.CategoryName || "Posterior Segment",
            //                "InvestigationId": Aitem.InvestigationId || 0,
            //                "InvestigationDesc": Aitem.InvestigationDesc || "",
            //                "ActiveInd": "Y",
            //                "SelectedGlobalSearch": "",
            //                "SelectedRightEye": 1,
            //                "SelectedLeftEye": 0,
            //                "RemarksArray": [],

            //            };
            //            angular.forEach(Aitem.PosteriorRemarks, function (Mitem) {
            //                if (Mitem.OrganId == 1) {
            //                    var obj = {
            //                        "RemarksId": 0,
            //                        "InvFindingId": Mitem.InvestigationFindingId || 0,
            //                        "FindingValue": Mitem.Remarks || '',
            //                        "OrganId": Mitem.OrganId || 1,
            //                        "FindingId": 0,
            //                        "FindingName": '',
            //                        "DiagnosisRiskLevel": "",
            //                        "ActiveInd": "Y",
            //                        "Notes": "",
            //                        "IsShowNotesTextBox": false,
            //                        "SubFindingList": Mitem.Subfindingslist || []
            //                    }
            //                }
            //                if (Mitem.OrganId == 2) {
            //                    var obj = {
            //                        "RemarksId": 0,
            //                        "InvFindingId": Mitem.InvestigationFindingId || 0,
            //                        "FindingValue": Mitem.Remarks || '',
            //                        "OrganId": Mitem.OrganId || 2,
            //                        "FindingId": 0,
            //                        "FindingName": '',
            //                        "DiagnosisRiskLevel": "",
            //                        "ActiveInd": "Y",
            //                        "Notes": "",
            //                        "IsShowNotesTextBox": false,
            //                        "SubFindingList": Mitem.Subfindingslist || []
            //                    }
            //                }
            //                object.RemarksArray.push(obj);
            //            });


            //            $scope.PoteriorSegmentArrayNew.push(object);


            //        } else {
            //            angular.forEach($scope.PoteriorSegmentArrayNew, function (Citem) {
            //                if (Citem.InvestigationId == Aitem.InvestigationId) {
            //                    angular.forEach(Aitem.AnteriorRemarks, function (Mitem) {
            //                        var obj = {
            //                            "RemarksId": 0,
            //                            "InvFindingId": Mitem.InvestigationFindingId || 0,
            //                            "FindingValue": Mitem.Remarks || '',
            //                            "OrganId": Mitem.OrganId || 1,
            //                            "FindingId": 0,
            //                            "FindingName": '',
            //                            "DiagnosisRiskLevel": "",
            //                            "ActiveInd": "Y",
            //                            "Notes": "",
            //                            "IsShowNotesTextBox": false,
            //                            "SubFindingList": Mitem.Subfindingslist || []
            //                        }
            //                        var List = $filter("filter")(Citem.RemarksArray, { "FindingValue": obj.FindingValue, "ActiveInd": "Y" }, true);
            //                        if (List.length == 0) {
            //                            Citem.RemarksArray.push(obj);
            //                        }
            //                    });

            //                }

            //            });
            //        }
            //    });

            //}

            //if (item.PosteriorArray.length > 0) {
            //    angular.forEach(item.PosteriorArray, function (Aitem) {
            //        angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (Bitem) {
            //            if (Aitem.InvestigationId == Bitem.InvestigationId) {
            //                Bitem.IsShowAnterior = "Y";
            //                Bitem.IsSelected = true;
            //                angular.forEach(Aitem.PosteriorRemarks, function (Mitem) {
            //                if (Mitem.OrganId == 1) {
            //                    var obj = {
            //                        "RemarksId": 0,
            //                        "ActiveInd": 'Y',
            //                        "DiagnosisRiskLevel": Mitem.DiagnosisRiskLevel,
            //                        "Remarks": Mitem.Remarks || "",
            //                        "InvFindingId": Mitem.InvFindingId || 0,
            //                    };
            //                    if (Bitem.RightEye.RemarksArray.length !== 0) {
            //                        var List = $filter("filter")(Bitem.RightEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
            //                        if (List.length > 0) {
            //                            return;
            //                        } else {
            //                            angular.forEach(Bitem.RightEye.RemarksArray, function (Eitem, index) {
            //                                if (Eitem.Remarks == "Normal") {
            //                                    Bitem.RightEye.RemarksArray.splice(index, 1);
            //                                }
            //                            });
            //                        }
            //                    }
            //                    Bitem.RightEye.RemarksArray.push(obj);
            //                }
            //                if (Mitem.OrganId == 2) {
            //                    var obj = {
            //                        "RemarksId": 0,
            //                        "ActiveInd": 'Y',
            //                        "DiagnosisRiskLevel": Mitem.DiagnosisRiskLevel,
            //                        "Remarks": Mitem.Remarks || "",
            //                        "InvFindingId": Mitem.InvFindingId || 0,
            //                    };
            //                    if (Bitem.LeftEye.RemarksArray.length !== 0) {
            //                        var List = $filter("filter")(Bitem.LeftEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
            //                        if (List.length > 0) {
            //                            return;
            //                        } else {
            //                            angular.forEach(Bitem.LeftEye.RemarksArray, function (Eitem, index) {
            //                                if (Eitem.Remarks == "Normal") {
            //                                    Bitem.LeftEye.RemarksArray.splice(index, 1);
            //                                }
            //                            });
            //                }
            //                        }
            //                        Bitem.LeftEye.RemarksArray.push(obj);
            //                    }
            //                    if (Mitem.OrganId == 3) {
            //                        var obj = {
            //                            "RemarksId": 0,
            //                            "ActiveInd": 'Y',
            //                            "DiagnosisRiskLevel": Mitem.DiagnosisRiskLevel,
            //                            "Remarks": Mitem.Remarks || "",
            //                            "InvFindingId": Mitem.InvFindingId || 0,
            //                        };
            //                        if (Bitem.BothEye.RemarksArray.length !== 0) {
            //                            var List = $filter("filter")(Bitem.BothEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
            //                            if (List.length > 0) {
            //                                return;
            //                            }
            //                        }
            //                        Bitem.BothEye.RemarksArray.push(obj);
            //                    }
            //                });
            //            }
            //        });
            //    });

            //}
        }

        $scope.SelectedExaminactionExternalINVId = null;
        $scope.SelectExternalExamInvestigation = function (item) {
            item.RightPwCanvas = item.RightPwCanvas;
            item.SelectedEye = "1";
            $scope.IsShowExaminationDrawingInd = true;
            item.IsSelected = !item.IsSelected;
            $scope.Investigation = {};
            item.RightEyediv = false;
            item.LeftEyediv = false;
            $scope.Investigation = angular.copy(item);
            //if (item.IsSelected == false) {
            //    item.RightEye.RemarksArray = [];
            //    item.RightEye.ImagesArray = [];
            //    item.LeftEye.RemarksArray = [];
            //    item.LeftEye.ImagesArray = [];
            //}
            item.IsShowExternal = "Y";
            $scope.SelectedExaminactionExternalINVId = item.InvestigationId || null;
            $scope.AnteriorDropdownList = [];
        };

        $scope.ChangesForExternalExaminationTemp = function (item) {
            item.ExternalExaminationsArray = item.ExternalExaminationsArray || [];
            if (item.ExternalExaminationsArray.length > 0) {
                angular.forEach(item.ExternalExaminationsArray, function (Aitem) {
                    angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (Bitem) {
                        if (Aitem.InvestigationId == Bitem.InvestigationId) {
                            Bitem.IsShowAnterior = "Y";
                            Bitem.IsSelected = true;
                            angular.forEach(Aitem.ExaminationRemarks, function (Mitem) {
                                if (Mitem.OrganId == 1) {
                                    var obj = {
                                        "RemarksId": 0,
                                        "ActiveInd": 'Y',
                                        "DiagnosisRiskLevel": Mitem.DiagnosisRiskLevel,
                                        "Remarks": Mitem.Remarks || "",
                                        "InvFindingId": Mitem.InvFindingId || 0,
                                    };
                                    if (Bitem.RightEye.RemarksArray.length !== 0) {
                                        var List = $filter("filter")(Bitem.RightEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
                                        if (List.length > 0) {
                                            //alertify.error('Its already added');
                                            return;
                                        } else {
                                            angular.forEach(Bitem.RightEye.RemarksArray, function (Eitem, index) {
                                                if (Eitem.Remarks == "Normal") {
                                                    Bitem.RightEye.RemarksArray.splice(index, 1);
                                                }
                                            });
                                        }
                                    }
                                    Bitem.RightEye.RemarksArray.push(obj);
                                }
                                if (Mitem.OrganId == 2) {
                                    var obj = {
                                        "RemarksId": 0,
                                        "ActiveInd": 'Y',
                                        "DiagnosisRiskLevel": Mitem.DiagnosisRiskLevel,
                                        "Remarks": Mitem.Remarks || "",
                                        "InvFindingId": Mitem.InvFindingId || 0,
                                    };
                                    if (Bitem.LeftEye.RemarksArray.length !== 0) {
                                        var List = $filter("filter")(Bitem.LeftEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
                                        if (List.length > 0) {
                                            //alertify.error('Its already added');
                                            return;
                                        } else {
                                            angular.forEach(Bitem.LeftEye.RemarksArray, function (Eitem, index) {
                                                if (Eitem.Remarks == "Normal") {
                                                    Bitem.LeftEye.RemarksArray.splice(index, 1);
                                                }
                                            });
                                        }
                                    }
                                    Bitem.LeftEye.RemarksArray.push(obj);
                                }
                                if (Mitem.OrganId == 3) {
                                    var obj = {
                                        "RemarksId": 0,
                                        "ActiveInd": 'Y',
                                        "DiagnosisRiskLevel": Mitem.DiagnosisRiskLevel,
                                        "Remarks": Mitem.Remarks || "",
                                        "InvFindingId": Mitem.InvFindingId || 0,
                                    };
                                    if (Bitem.BothEye.RemarksArray.length !== 0) {
                                        var List = $filter("filter")(Bitem.BothEye.RemarksArray, { "Remarks": obj.Remarks, "ActiveInd": "Y" }, true);
                                        if (List.length > 0) {
                                            //alertify.error('Its already added');
                                            return;
                                        }
                                    }
                                    Bitem.BothEye.RemarksArray.push(obj);
                                }
                            });
                        }
                    });
                });

            }
        }

        $scope.blur9Gaze = function (objj, type) {
            objj.IsSummaryEdit = !objj.IsSummaryEdit;
        };

        $scope.clearValueforExamination = function (objj, type) {
            if (objj.InvestigationId === 2159) {
                objj.RightEyeRemarks = "";
                objj.LeftEyeRemarks = "";
                objj.BaseValue = "";
                objj.IsSummaryEdit = true;
            }
            if (type === "Lacrimal") {
                if ($scope.cacheStorageItem.LacrimalPatiencyDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.LacrimalPatiencyDetails, function (litem) {
                        if (litem.InvestigationId === 2091 || litem.InvestigationId === 2092 || litem.InvestigationId === 2093 || litem.InvestigationId === 2094) {
                            litem.Remarks = "";
                            litem.LeftEyeRemarks = "";
                            $scope.cacheStorageItem.LacrimalPatencyRemarks = "";
                        }
                    });
                }
            }
        }
        $scope.removeRightAnterior = function (item, inv) {

            angular.forEach(inv.RightEye.RemarksArray, function (hitem, index) {
                if (hitem.InvFindingId === item.InvFindingId && hitem.Remarks === item.Remarks) {
                    if (hitem.RemarksId === 0) {
                        inv.RightEye.RemarksArray.splice(index, 1);
                    }
                    else {
                        hitem.ActiveInd = 'N';
                    }
                    inv.RightEyeRemarks = "";
                }
            });
        };
        $scope.removeLeftAnterior = function (item, inv) {
            angular.forEach(inv.LeftEye.RemarksArray, function (hitem, index) {
                if (hitem.InvFindingId === item.InvFindingId && hitem.Remarks === item.Remarks) {
                    if (hitem.RemarksId === 0) {
                        inv.LeftEye.RemarksArray.splice(index, 1);
                    }
                    else {
                        hitem.ActiveInd = 'N';
                    }
                    inv.LeftEyeRemarks = "";
                }
            });
        };

        $scope.CloseFinfingValues = function (item) {
            $scope.AnteriorDropdownList = [];
            item.SelectedRightEyeRemarksObj = "";
            item.SelectedLeftEyeRemarksObj = "";
            $scope.IsshowIndicator = false;
        }
        $scope.removeRightPosterior = function (item, inv) {
            angular.forEach(inv.RightEye.RemarksArray, function (hitem, index) {
                if (hitem.InvFindingId === item.InvFindingId && hitem.Remarks === item.Remarks) {
                    if (hitem.RemarksId === 0) {
                        inv.RightEye.RemarksArray.splice(index, 1);
                    }
                    else {
                        hitem.ActiveInd = 'N';
                    }
                    inv.RightEyeRemarks = "";
                }
            });
        };
        $scope.removeLeftPosterior = function (item, inv) {
            angular.forEach(inv.LeftEye.RemarksArray, function (hitem, index) {
                if (hitem.InvFindingId === item.InvFindingId && hitem.Remarks === item.Remarks) {
                    if (hitem.RemarksId === 0) {
                        inv.LeftEye.RemarksArray.splice(index, 1);
                    }
                    else {
                        hitem.ActiveInd = 'N';
                    }
                    inv.LeftEyeRemarks = "";
                }
            });
        };
        $scope.deleteRightPosterior = function (inv) {
            inv.RHorizontal = "";
            inv.RVertical = "";
            inv.RDPS = "";
            $scope.CDRHorizantalList = GetPosteriorCDR();
            $scope.CDRVerticalList = GetPosteriorCDR();
            $scope.CDR_DPSList = GetPosteriorCDR();
        }
        $scope.deleteLeftPosterior = function (inv) {
            inv.LHorizontal = "";
            inv.LVertical = "";
            inv.LDPS = "";
            $scope.CDRHorizantalList = GetPosteriorCDR();
            $scope.CDRVerticalList = GetPosteriorCDR();
            $scope.CDR_DPSList = GetPosteriorCDR();
        }

        $scope.onclickODAmslerGrid = function (item, subitem) {
            item.IsChecked = !item.IsChecked;
            var filetrFieldODarray = $filter("filter")($scope.AmslerGridODDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
            if (filetrFieldODarray.length == 0) {
                $scope.AmslerGridNormal.AmslerODNormal = true;
                subitem.RightEyeId = 69;
                subitem.RightEyeRemarks = "Normal";
            } else {
                $scope.AmslerGridNormal.AmslerODNormal = false;
                subitem.RightEyeId = '';
                subitem.RightEyeRemarks = "";
            }

        };

        $scope.onclickOSAmslerGrid = function (item, subitem) {
            item.IsChecked = !item.IsChecked;
            var filetrFieldOSarray = $filter("filter")($scope.AmslerGridOSDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
            if (filetrFieldOSarray.length == 0) {
                $scope.AmslerGridNormal.AmslerOSNormal = true;
                subitem.LeftEyeId = 69;
                subitem.LeftEyeRemarks = "Normal";
            } else {
                $scope.AmslerGridNormal.AmslerOSNormal = false;
                subitem.LeftEyeId = '';
                subitem.LeftEyeRemarks = "";
            }

        };

        $scope.onclickODConfrontationalFourField = function (item, subitem) {
            item.IsChecked = !item.IsChecked;
            var filetrFourFieldODarray = $filter("filter")($scope.ConfrontationalODDrawListFourField, function (iterator, ind) { return iterator.IsChecked == true }) || [];
            if (filetrFourFieldODarray.length == 0) {
                $scope.Conforntfield.ObjectValue1 = true;
                subitem.FRightEyeId = 68;
                subitem.FRightEyeRemarks = "Normal";
            } else {
                $scope.Conforntfield.ObjectValue1 = false;
                subitem.FRightEyeId = '';
                subitem.FRightEyeRemarks = "";
            }
        }

        $scope.onclickOSConfrontationalFourField = function (item, subitem) {
            item.IsChecked = !item.IsChecked;
            var filetrFourFieldOSarray = $filter("filter")($scope.ConfrontationalOSDrawListFourField, function (iterator, ind) { return iterator.IsChecked == true }) || [];
            if (filetrFourFieldOSarray.length == 0) {
                $scope.Conforntfield.ObjectValue2 = true;
                subitem.FLeftEyeId = 68;
                subitem.FLeftEyeRemarks = "Normal";
            } else {
                $scope.Conforntfield.ObjectValue2 = false;
                subitem.FLeftEyeId = '';
                subitem.FLeftEyeRemarks = "";
            }
        }

        $scope.OnChangeFieldtest = function (val) {
            if (val === 1) {
                $scope.FieldTestObj.Fourfield = true;
                $scope.FieldTestObj.Eightfield = false;
            }
            if (val === 2) {
                $scope.FieldTestObj.Fourfield = false;
                $scope.FieldTestObj.Eightfield = true;
            }
        };
        $scope.ChangeFourfieldNormal = function (item, ditem, type, zitem) {
            ditem = ditem || '';
            var List = $filter("filter")($scope.ConfrontationalDropdownList, { "Id": 68 }, true) || []

            if (ditem != '') {
                if (type == 'OD') {
                    if (item == true) {
                        if (List.length > 0) {
                            ditem.FRightEyeRemarks = List[0].Values || "";
                            ditem.FRightEyeId = List[0].Id || 0;
                            angular.forEach(zitem, function (pitem) {
                                pitem.IsChecked = false;
                            });


                        }
                    }
                    else {
                        ditem.FRightEyeRemarks = "";
                        ditem.FRightEyeId = 0;
                    }
                } else {
                    if (item == true) {
                        if (List.length > 0) {
                            ditem.FLeftEyeRemarks = List[0].Values || "";
                            ditem.FLeftEyeId = List[0].Id || 0;
                            angular.forEach(zitem, function (pitem) {
                                pitem.IsChecked = false;
                            });
                        }
                    }
                    else {
                        ditem.FLeftEyeRemarks = "";
                        ditem.FLeftEyeId = 0;
                    }
                }
            }

        }
        $scope.ChangeEightfieldNormal = function (item, ditem, type, zitem) {
            var List = $filter("filter")($scope.ConfrontationalDropdownList, { "Id": 68 }, true) || []

            if (type == 'OD') {
                if (item == true) {
                    if (List.length > 0) {
                        ditem.RightEyeRemarks = List[0].Values || "";
                        ditem.RightEyeId = List[0].Id || 0;

                        angular.forEach(zitem, function (pitem) {
                            pitem.IsChecked = false;
                        });
                    }
                }
                else {
                    ditem.RightEyeRemarks = "";
                    ditem.RightEyeId = 0;
                }
            } else {
                if (item == true) {
                    if (List.length > 0) {
                        ditem.LeftEyeRemarks = List[0].Values || "";
                        ditem.LeftEyeId = List[0].Id || 0;

                        angular.forEach(zitem, function (pitem) {
                            pitem.IsChecked = false;
                        });
                    }
                }
                else {
                    ditem.LeftEyeRemarks = "";
                    ditem.LeftEyeId = 0;
                }
            }

        }
        $scope.ChangeLeftConfrontationalDropdownValue = function (ditem) {
            $scope.Conforntational.Object2 = false;
            if (ditem.LeftEyeId == null) {
                ditem.LeftEyeId = ditem.LeftEyeId || "";
                ditem.LeftEyeRemarks = ditem.LeftEyeRemarks || "";
            } else {
                var List = $filter("filter")($scope.ConfrontationalDropdownList, { "Id": ditem.LeftEyeId }, true) || [];
                if (List.length > 0) {
                    ditem.LeftEyeRemarks = List[0].Values || "";
                    if (ditem.LeftEyeId == 68) {
                        $scope.Conforntational.Object2 = true;
                        angular.forEach($scope.ConfrontationalODDrawListFourField, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                    } else {
                        $scope.Conforntational.Object2 = false;
                    }
                } else {
                    ditem.LeftEyeRemarks = "";
                }
            }
        };
        $scope.ChangeLeftConfrontationalDropdownValueFourField = function (ditem) {
            $scope.Conforntfield.ObjectValue2 = false;
            if (ditem.FLeftEyeId == null) {
                ditem.FLeftEyeId = ditem.FLeftEyeId || "";
                ditem.FLeftEyeRemarks = ditem.FLeftEyeRemarks || "";
            } else {
                var List = $filter("filter")($scope.ConfrontationalDropdownList, { "Id": ditem.FLeftEyeId }, true) || [];
                if (List.length > 0) {
                    ditem.FLeftEyeRemarks = List[0].Values || "";
                    if (ditem.FLeftEyeId == 68) {
                        $scope.Conforntfield.ObjectValue2 = true;
                        angular.forEach($scope.ConfrontationalOSDrawListFourField, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                    } else {
                        $scope.Conforntfield.ObjectValue2 = false;
                    }
                } else {
                    ditem.FLeftEyeRemarks = "";
                }
            }
        };
        $scope.ChangeRightConfrontationalDropdownValueFourField = function (ditem) {
            $scope.Conforntfield.ObjectValue1 = false;
            if (ditem.FRightEyeId == null) {
                ditem.FRightEyeId = ditem.FRightEyeId || "";
                ditem.FRightEyeRemarks = "";
            } else {
                var List = $filter("filter")($scope.ConfrontationalDropdownList, { "Id": ditem.FRightEyeId }, true) || [];
                if (List.length > 0) {
                    ditem.FRightEyeRemarks = List[0].Values || "";
                    if (ditem.FRightEyeId == 68) {
                        $scope.Conforntfield.ObjectValue1 = true;
                        angular.forEach($scope.ConfrontationalODDrawListFourField, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                    } else {
                        $scope.Conforntfield.ObjectValue1 = false;
                    }
                } else {
                    ditem.FRightEyeRemarks = "";
                }
            }
        };

        $scope.OnclickODConfrontationalField = function (item, subitem) {
            item.IsChecked = !item.IsChecked;

            var FiletrEightFieldODarray = $filter("filter")($scope.ConfrontationalODDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
            if (FiletrEightFieldODarray.length == 0) {
                $scope.Conforntational.Object1 = true;
                subitem.RightEyeId = 68;
                subitem.RightEyeRemarks = "Normal";
            } else {
                $scope.Conforntational.Object1 = false;
                subitem.RightEyeId = '';
                subitem.RightEyeRemarks = '';
            }
        };
        $scope.OnclickOSConfrontationalField = function (item, subitem) {
            item.IsChecked = !item.IsChecked;
            var FiletrEightFieldOSarray = $filter("filter")($scope.ConfrontationalOSDrawList, function (iterator, ind) { return iterator.IsChecked == true }) || [];
            if (FiletrEightFieldOSarray.length == 0) {
                $scope.Conforntational.Object2 = true;
                subitem.LeftEyeId = 68;
                subitem.LeftEyeRemarks = "Normal";
            } else {
                $scope.Conforntational.Object2 = false;
                subitem.LeftEyeId = "";
                subitem.LeftEyeRemarks = "";
            }
        };
        $scope.IsshowIndicator = false;
        $scope.getFindingValuesOnClick = function (val, invId) {
            var phospid = '';
            phospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.SearchText = val || "";
            $scope.PageNumber = 1;

            return eHnoteDbStaticDataService.GetAllInvestigationFindingValuesForNewTemplate(phospid, invId, 10, $scope.PageNumber, $scope.SearchText).then(function (resp) {
                if (resp.data.count !== 0) {
                    $scope.AnteriorDropdownList = resp.data.Rows;
                    angular.forEach($scope.AnteriorDropdownList, function (ditem) {
                        ditem.RiskLevel = "";
                    });
                    $scope.IsshowIndicator = true;
                }
            });
        };
        $scope.ChangeRightConfrontationalDropdownValue = function (ditem) {
            $scope.Conforntational.Object1 = false;
            if (ditem.RightEyeId == null) {
                ditem.RightEyeId = ditem.RightEyeId || "";
                ditem.RightEyeRemarks = "";
            } else {
                var List = $filter("filter")($scope.ConfrontationalDropdownList, { "Id": ditem.RightEyeId }, true) || [];
                if (List.length > 0) {
                    ditem.RightEyeRemarks = List[0].Values || "";
                    if (ditem.RightEyeId == 68) {
                        $scope.Conforntational.Object1 = true;
                        angular.forEach($scope.ConfrontationalODDrawList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                    } else {
                        $scope.Conforntational.Object1 = false;
                    }

                } else {
                    ditem.RightEyeRemarks = "";
                }
            }
        };

        $scope.Changeprismsquintvalue = function (item, mainitem, eye, type) {
            item = item || "";
            if (type == 'Distance') {
                if (eye === "OD") {
                    if (item != "") {
                        mainitem.DistanceRTypeOfSquintId = item.Id;
                        mainitem.DistanceRTypeOfSquintValue = item.Value;
                    } else {
                        mainitem.DistanceRTypeOfSquintId = 0;
                        mainitem.DistanceRTypeOfSquintValue = "";
                    }
                } else {
                    if (item != '') {
                        mainitem.DistanceLTypeOfSquintId = item.Id;
                        mainitem.DistanceLTypeOfSquintValue = item.Value;
                    } else {
                        mainitem.DistanceLTypeOfSquintId = 0;
                        mainitem.DistanceLTypeOfSquintValue = "";
                    }
                }
            } else {
                if (eye === "OD") {
                    if (item != "") {
                        mainitem.NearRTypeOfSquintId = item.Id;
                        mainitem.NearRTypeOfSquintValue = item.Value;
                    } else {
                        mainitem.NearRTypeOfSquintId = 0;
                        mainitem.NearRTypeOfSquintValue = "";
                    }
                } else {
                    if (item != '') {
                        mainitem.NearLTypeOfSquintId = item.Id;
                        mainitem.NearLTypeOfSquintValue = item.Value;
                    } else {
                        mainitem.NearLTypeOfSquintId = 0;
                        mainitem.NearLTypeOfSquintValue = "";
                    }
                }
            }

        };
        $scope.changeCoverTypeOfSquint = function (item, mainitem, type) {
            if (type == "Distance") {
                if (item == null) {
                    item = item || "";
                    mainitem.DistanceTypeOfSquintId = 0;
                    mainitem.DistanceTypeOfSquintValue = "";
                } else {
                    mainitem.DistanceTypeOfSquintId = item.Id || 0;
                    mainitem.DistanceTypeOfSquintValue = item.Value || "";
                }
            } else {
                if (item == null) {
                    item = item || "";
                    mainitem.NearTypeOfSquintId = 0;
                    mainitem.NearTypeOfSquintValue = "";
                } else {
                    mainitem.NearTypeOfSquintId = item.Id || 0;
                    mainitem.NearTypeOfSquintValue = item.Value || "";
                }
            }
        };
        $scope.ChangeCoverDistance = function (type, mainitem) {
            if (type == "Distance") {
                mainitem.DistanceTypeOfSquintObj = "";
                mainitem.DistanceTypeOfSquintId = 0;
                mainitem.DistanceTypeOfSquintValue = "";
            } else {
                mainitem.NearTypeOfSquintObj = "";
                mainitem.NearTypeOfSquintId = 0;
                mainitem.NearTypeOfSquintValue = "";
            }
        }
        $scope.IndicatorObj = {
            "IsshowEXamFindingValuesOnLeftSide": false,
            "IsshowEXamFindingValuesOnRightSide": false,
        }
        $scope.CloseFinRightfingValues = function (item) {
            $scope.AnteriorDropdownList = [];
            item.SelectedRightEyeRemarksObj = "";
            $scope.IndicatorObj.IsshowEXamFindingValuesOnRightSide = false;
        }
        $scope.CloseFinLeftfingValues = function (item) {
            $scope.AnteriorDropdownList = [];
            item.SelectedLeftEyeRemarksObj = "";
            $scope.IndicatorObj.IsshowEXamFindingValuesOnLeftSide = false;
        }
        $scope.getFindingValuesRightOnClick = function (val, invId) {
            var phospid = '';
            phospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.SearchText = val || "";
            $scope.PageNumber = 1;
            $scope.AnteriorDropdownList = [];
            return eHnoteDbStaticDataService.GetAllInvestigationFindingValuesForNewTemplate(phospid, invId, 10, $scope.PageNumber, $scope.SearchText).then(function (resp) {
                if (resp.data.count !== 0) {
                    $scope.AnteriorDropdownList = resp.data.Rows;
                    angular.forEach($scope.AnteriorDropdownList, function (ditem) {
                        ditem.RiskLevel = "";
                    });
                    $scope.IndicatorObj.IsshowEXamFindingValuesOnRightSide = true;
                    $scope.IndicatorObj.IsshowEXamFindingValuesOnLeftSide = false;
                }
            });
        }
        $scope.getFindingValuesLeftOnClick = function (val, invId) {
            var phospid = '';
            phospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.SearchText = val || "";
            $scope.PageNumber = 1;
            $scope.AnteriorDropdownList = [];
            return eHnoteDbStaticDataService.GetAllInvestigationFindingValuesForNewTemplate(phospid, invId, 10, $scope.PageNumber, $scope.SearchText).then(function (resp) {
                if (resp.data.count !== 0) {
                    $scope.AnteriorDropdownList = resp.data.Rows;
                    angular.forEach($scope.AnteriorDropdownList, function (ditem) {
                        ditem.RiskLevel = "";
                    });
                    $scope.IndicatorObj.IsshowEXamFindingValuesOnLeftSide = true;
                    $scope.IndicatorObj.IsshowEXamFindingValuesOnRightSide = false;
                }
            });
        }


        $scope.changePossibleDiagnosisright1 = function (item, nitem) {
            if (nitem === null) {
                item.RightEye.PossibleDiagnosisName = "";
                item.RightEye.PossibleDiagnosisId = 0;
            }
            else {
                var filetrODarray = $filter("filter")($scope.PossibleDiagnosisArray, function (iterator, ind) {
                    return iterator.DiagnosisId == item.RightEye.PossibleDiagnosisId
                }) || [];
                if (filetrODarray.length > 0) {
                    item.RightEye.PossibleDiagnosisName = filetrODarray[0].DiagnosisName || "";
                    item.RightEye.ICD10CODE = filetrODarray[0].ICD10CODE || "";
                    item.RightEye.PossibleDiagnosisObject = filetrODarray[0] || "";
                }

                // item.RightEye.PossibleDiagnosisId = nitem.DiagnosisId || 0;
            }

        }
        $scope.changePossibleDiagnosisleft1 = function (item, zitem) {
            if (zitem === null) {
                item.LeftEye.PossibleDiagnosisName = "";
                item.LeftEye.PossibleDiagnosisId = 0;
            } else {

                var filetrODarray = $filter("filter")($scope.PossibleDiagnosisArray, function (iterator, ind) {
                    return iterator.DiagnosisId == item.LeftEye.PossibleDiagnosisId
                }) || [];
                if (filetrODarray.length > 0) {
                    item.LeftEye.PossibleDiagnosisName = filetrODarray[0].DiagnosisName || "";
                    item.LeftEye.ICD10CODE = filetrODarray[0].ICD10CODE || "";
                    item.LeftEye.PossibleDiagnosisObject = filetrODarray[0] || "";
                }

                // item.LeftEye.PossibleDiagnosisId = zitem.DiagnosisId || 0;
            }
        }

        $scope.changeDryEyeSubTab = function (item) {
            if ($scope.cacheStorageItem.DryEyeEvaluationData.length > 0) {
                angular.forEach($scope.cacheStorageItem.DryEyeEvaluationData, function (citem) {
                    citem.IsSubtabActive = false;
                });
            }
            item.IsSubtabActive = true;
        }
        $scope.chnageOdSchirmerTest = function (item, type, val) {
            if (val == null) {
                if (type == "mm") {
                    item.ODValue2 = "";
                } else {
                    item.ODValue3 = "";
                }
            }
        }
        $scope.chnageOdSchirmerTest2 = function (item, type, val) {
            if (val == null) {
                if (type == "mm") {
                    item.ODValue21 = "";
                } else {
                    item.ODValue31 = "";
                }
            }
        }
        $scope.chnageOsSchirmerTest = function (item, type, val) {
            if (val == null) {
                if (type == "mm") {
                    item.OSValue2 = "";
                } else {
                    item.OSValue3 = "";
                }
            }
        }
        $scope.chnageOsSchirmerTest2 = function (item, type, val) {
            if (val == null) {
                if (type == "mm") {
                    item.OSValue21 = "";
                } else {
                    item.OSValue31 = "";
                }
            }
        }
        $scope.chnageOsTVTvalues = function (item, type, val) {
            if (val == null) {
                if (type == "OD") {
                    item.ODValue1 = "";
                } else {
                    item.OSValue1 = "";
                }
            }
        }
        $scope.changeColorVisionSubtab = function (item) {
            if ($scope.cacheStorageItem.ColorVisionDetails.length > 0) {
                angular.forEach($scope.cacheStorageItem.ColorVisionDetails, function (citem) {
                    citem.IsSubtabActive = false;
                });
            }
            item.IsSubtabActive = true;
        }
        $scope.chnageColorVisionIshihara = function (item, type, val) {
            if (val == null) {
                if (type == "OD") {
                    item.RightEyeRemarks = "";
                } else {
                    item.LeftEyeRemarks = "";
                }
            }
        }
        $scope.changeDuctionType = function (eye, obj, mainitem) {
            if (eye === 'OD') {
                if (obj.IsChecked) {
                    var obj = {
                        "SquintChildId": 0,
                        "Value": obj.Name,
                        "Id": obj.Id,
                        "PositionID": 1,
                        "PositionDesc": "OD",
                        "ActiveInd": "Y",
                        "DeleteInd": "N"
                    }
                    mainitem.InvestigationOrgans.push(obj);

                }
                else {
                    angular.forEach(mainitem.InvestigationOrgans, function (ritem, rindex) {
                        if (obj.Name == ritem.Value && ritem.PositionID === 1) {
                            //mainitem.InvestigationOrgans.splice(rindex, 1);
                            ritem.DeleteInd = 'Y';
                        }
                    });
                }
            }
            else {
                if (obj.IsChecked) {
                    var obj = {
                        "SquintChildId": 0,
                        "Value": obj.Name,
                        "Id": obj.Id,
                        "PositionID": 2,
                        "PositionDesc": "OS",
                        "ActiveInd": "Y",
                        "DeleteInd": "N"
                    }

                    mainitem.InvestigationOrgans.push(obj);
                }
                else {
                    angular.forEach(mainitem.InvestigationOrgans, function (ritem, rindex) {
                        if (obj.Name == ritem.Value && ritem.PositionID === 2) {
                            // mainitem.InvestigationOrgans.splice(rindex, 1);
                            ritem.DeleteInd = 'Y';
                        }
                    });
                }
            }
            $scope.AddToCache();
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
        $scope.AddNewFindingValue = function (text, inv, type) {
            text = text || null;
            if (text !== null) {
                if (angular.isObject(text)) {
                    text = text.FindingValue || "";
                } else {
                    text = text || "";
                }
            }
            if (text === "") {
                alertify.error("Please add remarks");
                return false;
            }
            var object = {
                "Name": text,
                "UserId": $scope.UserId,
                "FindingId": inv.InvestigationId,
                "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID
            };
            eHnoteDiagnosisDataServices.AddFindingValues(object).then(function (resp) {
                if (resp.data.Status !== 1) {
                    alertify.error(resp.data.Message);
                    return;
                }
                if (type === "Right") {
                    inv.RightEyeRemarks = text;
                    var obj = {
                        "ActiveInd": true,
                        "Remarks": resp.data.data.Rows[0].FindingValue || "",
                        "Id": resp.data.data.Rows[0].InvFindingId || 0
                    };
                    if (inv.RightEye.RemarksArray.length > 0) {
                        var List = $filter("filter")(inv.RightEye.RemarksArray, { "Remarks": obj.Remarks }, true);
                        if (List.length > 0) {
                            alertify.error('Its already added');
                            inv.SelectedRightEyeRemarksObj = "";
                            return;
                        }
                    }

                    inv.SelectedRightEyeRemarksObj = obj.Remarks;
                }
                if (type === "Left") {
                    inv.LeftEyeRemarks = text;
                    var obj = {
                        "ActiveInd": true,
                        "Remarks": resp.data.data.Rows[0].FindingValue || "",
                        "Id": resp.data.data.Rows[0].InvFindingId || 0
                    };
                    if (inv.LeftEye.RemarksArray.length > 0) {
                        var List = $filter("filter")(inv.LeftEye.RemarksArray, { "Remarks": obj.Remarks }, true);
                        if (List.length > 0) {
                            alertify.error('Its already added');
                            inv.SelectedLeftEyeRemarksObj = "";
                            return;
                        }
                    }

                    inv.SelectedLeftEyeRemarksObj = obj.Remarks;
                }
                $scope.cacheStorageItem.InvestigationAutocompleteList = resp.data.data;
                $scope.getFindingValues(text, inv.InvestigationId);
                alertify.success("New Finding Value Added");
            }, function (err) {
                console.log(err);
                alertify.error("Adding New Finding Value Failed");
            });
        };

        $scope.CheckSubCategory = function (cat, subcategory) {
            $scope.PosteriorHistoryButton = false;
            $scope.AnteriorHistoryButton = false;
            subcategory.IsSubCategoryChecked = !subcategory.IsSubCategoryChecked;
            var Index = 0;
            if (cat.CategoryId === 4) {
                Index = cat.CategoryDetails.findIndex(record => record.SubCategoryId === subcategory.SubCategoryId);
                if (Index > -1) {

                    cat.CategoryDetails[Index].IsSubCategoryChecked = subcategory.IsSubCategoryChecked;
                    cat.CategoryDetails[Index].Active = 'Y';
                    if (cat.CategoryDetails[3].IsSubCategoryChecked == false) {
                        $scope.submotorexaminationtab = 7;
                        if (cat.CategoryDetails[4].IsSubCategoryChecked == false) {
                            $scope.submotorexaminationtab = 5;
                        }
                    }
                    else {
                        $scope.submotorexaminationtab = 6;
                    }
                    if (subcategory.IsSubCategoryChecked) {
                        if (subcategory.SubCategoryId === 22   || subcategory.SubCategoryId === 24 || subcategory.SubCategoryId === 25 || subcategory.SubCategoryId === 26 || subcategory.SubCategoryId === 35   || subcategory.SubCategoryId === 43 ) {
                            if (subcategory.SubCategoryId == 22 && subcategory.IsSubCategoryChecked) {
                                angular.forEach(cat.CategoryDetails, function (aditem) {
                                    if (aditem.SubCategoryId == 78 || aditem.SubCategoryId == 38 || aditem.SubCategoryId == 23 || aditem.SubCategoryId == 77 || aditem.SubCategoryId == 41) {
                                        aditem.IsSubCategoryChecked = true;
                                        aditem.Active = 'Y';
                                        if (aditem.SubCategoryDetails.length > 0) {
                                            angular.forEach(aditem.SubCategoryDetails, function (ritem) {
                                                ritem.IsSubChildCategoryChecked = true;
                                                ritem.Active = 'Y';
                                            });
                                        }
                                    }

                                });
                            }
                            if (subcategory.SubCategoryDetails.length > 0) {
                                angular.forEach(subcategory.SubCategoryDetails, function (ritem) {
                                    ritem.IsSubChildCategoryChecked = true;
                                    ritem.Active = 'Y';
                                });
                            }
                        }
                        if (subcategory.SubCategoryId === 38) {

                            angular.forEach(subcategory.SubCategoryDetails, function (ritem) {
                                if (ritem.SubCategoryChildId === 58 || ritem.SubCategoryChildId === 59 || ritem.SubCategoryChildId === 60) {
                                    $scope.ShowTearMeniscusHeight = true;
                                }
                            });
                        }
                        if (subcategory.SubCategoryId === 24) {
                            angular.forEach(cat.CategoryDetails, function (aspitem) {
                                if (aspitem.SubCategoryId == 25) {
                                    aspitem.IsSubCategoryChecked = subcategory.IsSubCategoryChecked || false;
                                    aspitem.Active = cat.CategoryDetails[Index].Active || "N";
                                    if (aspitem.IsSubCategoryChecked) {
                                        angular.forEach(aspitem.SubCategoryDetails, function (subitem) {
                                            subitem.IsSubChildCategoryChecked = true;
                                            subitem.Active = 'Y';
                                        });
                                    } else {

                                    }
                                }

                            });
                            $scope.AnteriorHistoryButton = true;
                        }
                        if (subcategory.SubCategoryId === 25) {
                            $scope.PosteriorHistoryButton = true;
                        }
                    }
                    else {
                        if (subcategory.SubCategoryId === 22  || subcategory.SubCategoryId === 24 || subcategory.SubCategoryId === 25 || subcategory.SubCategoryId === 26 || subcategory.SubCategoryId === 35   || subcategory.SubCategoryId === 43) {
                            if (subcategory.SubCategoryDetails.length > 0) {
                                angular.forEach(subcategory.SubCategoryDetails, function (ritem) {
                                    ritem.IsSubChildCategoryChecked = false;
                                    ritem.Active = 'N';
                                });
                            }
                            if (subcategory.SubCategoryId == 22 ) {
                                angular.forEach(cat.CategoryDetails, function (aditem) {
                                    if (aditem.SubCategoryId == 78 || aditem.SubCategoryId == 38 || aditem.SubCategoryId == 23 || aditem.SubCategoryId == 77 || aditem.SubCategoryId == 41) {
                                        aditem.IsSubCategoryChecked = subcategory.IsSubCategoryChecked || false;
                                        /*aditem.Active = 'Y';*/
                                        if (aditem.SubCategoryDetails.length > 0) {
                                            angular.forEach(aditem.SubCategoryDetails, function (ritem) {
                                                ritem.IsSubChildCategoryChecked = false;
                                                ritem.Active = 'N';
                                            });
                                        }
                                    }

                                });
                            }
                        }
                        if (subcategory.SubCategoryId === 24) {
                            angular.forEach(cat.CategoryDetails, function (aspitem) {
                                if (aspitem.SubCategoryId == 25) {
                                    aspitem.IsSubCategoryChecked = subcategory.IsSubCategoryChecked;
                                    if (aspitem.SubCategoryDetails.length > 0) {
                                        angular.forEach(aspitem.SubCategoryDetails, function (subitem) {
                                            subitem.IsSubChildCategoryChecked = false;
                                            subitem.Active = 'N';
                                        });
                                    } 
                                }

                            });
                            $scope.AnteriorHistoryButton = true;
                        }
                        if (subcategory.SubCategoryId === 25) {
                            $scope.PosteriorHistoryButton = true;
                        }
                    }

                }
            }

            $scope.AddToCache();
        };

        $scope.DeleteColourVisionImage = function (eye, Item) {
            if (eye === "OD") {
                Item.RS3Url = "";
                Item.IsRS3Url = false;
            } else {
                Item.LS3Url = "";
                Item.IsLS3Url = false;
            }
        };

        $scope.ClearSubcategoryPopUp = function () {
            $scope.ActiveCollapseId = 0;
            $scope.SubActiveCollapseId = 0;
        }
        $scope.FileUploadPopUp = {
            "quickfileuploads": false
        };
        $scope.TempPopup = {
            "QuickNotePopContent": false
        };
        $scope.drawingPadPopup = {
            "IsOpen": false
        };
        $scope.Template = {
            "TemplatePOPUpShow": false,
            "TemplateTypeBySelected": "Consultation"
        };

        $scope.frequentlytemplatespopupclick = function (TemplateType) {
            $scope.ClearSubcategoryPopUp();
            $scope.FileUploadPopUp.quickfileuploads = false;
            $scope.TempPopup.QuickNotePopContent = false;
            $scope.drawingPadPopup.IsOpen = true;

            $scope.Template.TemplatePOPUpShow = true;
            $scope.Template.TemplateTypeBySelected = TemplateType;
            $scope.IsShowExaminationDrawingInd = false;
        };

        $scope.$on('myEvent', function (event, data) {
            $scope.AnteriorSegmentArrayNew = data || [];
        });

        $scope.$on('Event', function (event, data1) {
            $scope.PoteriorSegmentArrayNew = data1 || [];
        });

        $scope.clickexamiansubpopover = {
            templateUrl: 'examinationsubpreview.html',
        };

        $scope.$watch("cat.CategoryDetails", function (newVal, oldVal) {
            $scope.ActiveExamTab = false;
            $scope.ActiveGonioscopyTab = false;
            $scope.ActiveMotorExamTab = false;
            $scope.ActiveAdditionalTab = false;
            if ($scope.cat.CategoryDetails === undefined) { return; }
            angular.forEach($scope.cat.CategoryDetails, function (item) {

                if ((item.SubCategoryId == 24 && item.IsSubCategoryChecked) || (item.SubCategoryId == 25 && item.IsSubCategoryChecked)) {
                    $scope.ActiveExamTab = true;
                }
                if (item.SubCategoryId == 26 && item.IsSubCategoryChecked) {
                    $scope.ActiveGonioscopyTab = true;
                }
                if (item.SubCategoryId == 21 && item.IsSubCategoryChecked) {
                    $scope.ActiveMotorExamTab = true;
                }
                if ((item.SubCategoryId == 38 && item.IsSubCategoryChecked) || (item.SubCategoryId == 22 && item.IsSubCategoryChecked) || (item.SubCategoryId == 78 && item.IsSubCategoryChecked) || (item.SubCategoryId == 77 && item.IsSubCategoryChecked) || (item.SubCategoryId == 23 && item.IsSubCategoryChecked) || (item.SubCategoryId == 41 && item.IsSubCategoryChecked)) {
                    $scope.ActiveAdditionalTab = true;
                }
            });
        }, true);

        // $scope.AnteriorSegmentArrayNew = [];

        $scope.newAnteriorObj = {
            "AnteriorSearchObj": "",
            "OSAnteriorSearchObj": "",
            "AnteriorInvSearchObj": "",
            "SelectedExaminactionINVId1": null,
            "SelectedEye": 1,
            "SelectedINVEye": 1,
            "CatId": 5,
            "SelectedAnteriorObj": '',
            "IsShowSearchBar": false,
            "RemarksArray": []
        };
        $scope.newPosteriorObj = {
            "PosteriorSearchObj": "",
            "OSPosteriorSearchObj": "",
            "PosteriorInvSearchObj": "",
            "SelectedExaminactionINVId1": null,
            "SelectedEye": 1,
            "SelectedINVEye": 1,
            "CatId": 6,
            "SelectedPosteriorObj": '',
            "IsShowSearchBar": false,
            "RemarksArray": [],
            "PosteriorDPSSelectedEye": 'OD'
        };
        $scope.changeAnteriorOrgan = function (Organ) {
            $scope.newAnteriorObj.SelectedEye = Organ;
            $scope.newAnteriorObj.AnteriorSearchObj = '';
        };
        $scope.getMasterFindingValues = function (val, Catid, FindingId, Organ) {
            $scope.newAnteriorObj.SelectedEye = Organ || 1;
            $scope.newPosteriorObj.SelectedEye = Organ || 1;
            $scope.SearchText = val || "";
            $scope.CategoryId = Catid || 0;
            $scope.FindingId = FindingId || 0;
            $scope.AnteriorINVDropdownList = [];
            $scope.PosteriorINVDropdownList = [];
            if ($scope.CategoryId == 5) {
                if (Organ == 1) {
                    $scope.newAnteriorObj.OSAnteriorSearchObj = '';
                } else {
                    $scope.newAnteriorObj.AnteriorSearchObj = '';
                }
            } else if ($scope.CategoryId == 6) {
                if (Organ == 1) {
                    $scope.newPosteriorObj.OSPosteriorSearchObj = '';
                } else {
                    $scope.newPosteriorObj.PosteriorSearchObj = '';
                }
            }
            var params = {
                "CategoryId": $scope.CategoryId || 4,
                "FindingId": $scope.FindingId || 0,
                "PageSize": 20,
                "PageNumber": 1,
                "SearchText": $scope.SearchText || "",

            }
            return eHnoteDbStaticDataService.getMasterFindingValues(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }

            }, function (err) {

            });
        }

        $scope.ChangeFindingASValue = function (selectedinv, item, CategoryId) {
            var count = [];
            var i = 0;
            var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);

            if ($scope.AnteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (Ritem) {
                            Ritem.IsShowNotesTextBox = false;
                        });
                    }
                });
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        count = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.OrganId === selectedinv.SelectedEye });
                        if (count.length !== 0) {
                            i++;
                        }
                    }
                });
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem, index) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                            angular.forEach(temparray, function (tempitem, index1) {
                                if (hitem.OrganId == selectedinv.SelectedEye && hitem.InvFindingId === tempitem.InvFindingId && item.FindingId == Mitem.InvestigationId) {
                                    if (hitem.RemarksId === 0) {
                                        Mitem.RemarksArray.splice(index, 1);
                                    }
                                    else {
                                        hitem.ActiveInd = 'N';
                                    }
                                }
                            });

                        });
                    }
                });
            }

            if (i !== 0) {
                $scope.newAnteriorObj.AnteriorSearchObj = '';
                $scope.newAnteriorObj.OSAnteriorSearchObj = '';
                alertify.error("This Item is Already Added");
                return false;
            }

            var filetrarray = $filter("filter")($scope.AnteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.FindingId }) || [];
            if (filetrarray.length == 0) {

                var object = {
                    "PatientFindingAnteriorId": 0,
                    "IsNormal": false,
                    "CategoryId": 5,
                    "CategoryDesc": "Anterior Segment",
                    "InvestigationId": item.FindingId || 0,
                    "InvestigationDesc": item.FindingName || "",
                    "ActiveInd": "Y",
                    "SelectedGlobalSearch": "",
                    "SelectedRightEye": 1,
                    "SelectedLeftEye": 0,
                    "RemarksArray": [],

                };

                if (selectedinv.SelectedEye == 1) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": item.InvFindingId || 0,
                        "FindingValue": item.FindingValue || '',
                        "OrganId": selectedinv.SelectedEye || 1,
                        "FindingId": item.FindingId || 0,
                        "FindingName": item.FindingName || '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": true,
                        "SubFindingList": []
                    }
                    $scope.cacheStorageItem.AnteriorODIsNormal = false;
                } else if (selectedinv.SelectedEye == 2) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": item.InvFindingId || 0,
                        "FindingValue": item.FindingValue || '',
                        "OrganId": selectedinv.SelectedEye || 2,
                        "FindingId": item.FindingId || 0,
                        "FindingName": item.FindingName || '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": true,
                        "SubFindingList": []
                    }
                    $scope.cacheStorageItem.AnteriorOSIsNormal = false;
                }
                object.RemarksArray.push(obj);

                $scope.AnteriorSegmentArrayNew.push(object);


            } else {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.InvestigationId == item.FindingId) {
                        if (selectedinv.SelectedEye == 1) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": selectedinv.SelectedEye || 1,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                            $scope.cacheStorageItem.AnteriorODIsNormal = false;
                        } else if (selectedinv.SelectedEye == 2) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": selectedinv.SelectedEye || 2,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                            $scope.cacheStorageItem.AnteriorOSIsNormal = false;
                        }
                        Mitem.RemarksArray.push(obj);
                    }
                });
            }
            $scope.newAnteriorObj.AnteriorSearchObj = '';
            $scope.newAnteriorObj.OSAnteriorSearchObj = '';
        };
        function chunkArray(arr, chunkSize) {
            let chunkedArray = [];
            for (let i = 0; i < arr.length; i += chunkSize) {
                chunkedArray.push(arr.slice(i, i + chunkSize));
            }
            return chunkedArray;
        }
        //function chunkArray(arr) {
        //    let chunkedArray = [];
        //    const chunkSize = 3; // Set your desired chunk size
        //    let index = 0;

        //    while (index < arr.length) {
        //        let size = Math.ceil((arr.length - index) / chunkSize);
        //        chunkedArray.push(arr.slice(index, index + size));
        //        index += size;
        //    }

        //    return chunkedArray;
        //}
        $scope.SelectAnteriorInvestigation1 = function (item) {
            $scope.newAnteriorObj.SelectedExaminactionINVId1 = item.InvestigationId || null;
            $scope.AnteriorINVDropdownList = [];
            $scope.AnteriorINVDropdownList = $filter("filter")($scope.AnteriorINVDropdownListMain, function (iterator, ind) { return iterator.FindingId == item.InvestigationId }) || [];
            const chunkSize = 3;
            let size = Math.ceil(($scope.AnteriorINVDropdownList.length) / chunkSize);
            /*  $scope.chunkedAnteriorINVDropdownList = chunkArray($scope.AnteriorINVDropdownList);*/
            if (item.InvestigationId == 23) {
                $scope.chunkedAnteriorINVDropdownList = chunkArray($scope.AnteriorINVDropdownList, 39);
            } else if (item.InvestigationId == 26) {
                $scope.chunkedAnteriorINVDropdownList = chunkArray($scope.AnteriorINVDropdownList, 53);
            } else if (item.InvestigationId !== 26 && item.InvestigationId !== 23) {
                $scope.chunkedAnteriorINVDropdownList = chunkArray($scope.AnteriorINVDropdownList, size);
            }

            //angular.forEach($scope.AnteriorINVDropdownList, function (aitem,index) {
            //    aitem.MainIndexValue = 0;
            //    if (index<40) {
            //        aitem.MainIndexValue = 1;
            //    }
            //    if (index >=40 && index < 80) {
            //        aitem.MainIndexValue = 1;
            //    }

            //});

            $scope.newAnteriorObj.AnteriorInvSearchObj = '';
            $scope.newAnteriorObj.SelectedINVEye = 1;
            $scope.newAnteriorObj.IsShowSearchBar = true;
        };
        $scope.changeINVAnteriorOrgan = function (Organ) {
            $scope.newAnteriorObj.SelectedINVEye = Organ;
            $scope.newAnteriorObj.AnteriorInvSearchObj = '';
        };
        //$scope.getMasterFindingValuesByInvestigaction = function (CategoryId) {
        //    var params = {
        //        "CategoryId": 5,
        //        "FindingId": 0,
        //        "PageSize": 1000,
        //        "PageNumber": 1,
        //        "SearchText": "",

        //    }
        //    return eHnoteDbStaticDataService.getMasterFindingValues(params).then(function (resp) {
        //        $scope.AnteriorINVDropdownListMain = [];
        //        if (resp.data.status == "Success") {
        //            if (resp.data.rows !== undefined) {
        //                $scope.AnteriorINVDropdownListMain = resp.data.rows || [];
        //                $scope.AnteriorINVDropdownList = angular.copy($scope.AnteriorINVDropdownListMain);
        //            }
        //        }

        //    }, function (err) {

        //    });
        //}
        //$scope.getMasterFindingValuesByInvestigaction();
        //$scope.getMasterFindingValuesByInvestigaction = function () {
        //    var params = {
        //        "CategoryId": 6,
        //        "FindingId": 0,
        //        "PageSize": 1000,
        //        "PageNumber": 1,
        //        "SearchText": "",

        //    }
        //    return eHnoteDbStaticDataService.getMasterFindingValues(params).then(function (resp) {
        //        $scope.PosteriorINVDropdownListMain = [];
        //        $scope.PosteriorINVDropdownList = [];
        //        if (resp.data.status == "Success") {
        //            if (resp.data.rows !== undefined) {
        //                $scope.PosteriorINVDropdownListMain = resp.data.rows || [];
        //                if ($scope.PosteriorINVDropdownListMain.length>0) {
        //                    $scope.PosteriorINVDropdownList = angular.copy($scope.AnteriorINVDropdownListMain);
        //                }

        //            }
        //        }

        //    }, function (err) {

        //    });
        //}
        //$scope.getMasterFindingValuesByInvestigaction();

        $scope.CopyToOS = function (Mitem, item, organ, CategoryId) {
            var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
            var countList = [];
            countList = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.OrganId === organ && fitem.ActiveInd == 'Y' });

            if (organ == 1) {
                if (countList.length !== 0) {
                    alertify.error("This item already exists in the OD");
                    return false;
                }
            }
            if (organ == 2) {
                if (countList.length !== 0) {
                    alertify.error("This item already exists in the OS");
                    return false;
                }
            }
           

            if (Mitem.RemarksArray.length > 0) {
                angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                    angular.forEach(temparray, function (tempitem) {
                        if (hitem.InvFindingId === tempitem.InvFindingId && hitem.OrganId == organ) {
                            if (hitem.RemarksId === 0) {
                                Mitem.RemarksArray.splice(index, 1);
                            }
                            else {
                                hitem.ActiveInd = 'N';
                            }
                        }
                    });
                });
            }

            if (organ == 1) {
                var obj = {
                    "RemarksId": 0,
                    "InvFindingId": item.InvFindingId || 0,
                    "FindingValue": item.FindingValue || '',
                    "OrganId": 1,
                    "FindingId": item.FindingId || 0,
                    "FindingName": item.FindingName || '',
                    "Notes": item.Notes || '',
                    "DiagnosisRiskLevel": "",
                    "ActiveInd": "Y",
                    "SubFindingList": item.SubFindingList || [],
                }
                Mitem.RemarksArray.push(obj);
            } else if (organ == 2) {
                var obj = {
                    "RemarksId": 0,
                    "InvFindingId": item.InvFindingId || 0,
                    "FindingValue": item.FindingValue || '',
                    "OrganId": 2,
                    "FindingId": item.FindingId || 0,
                    "FindingName": item.FindingName || '',
                    "Notes": item.Notes || '',
                    "DiagnosisRiskLevel": "",
                    "ActiveInd": "Y",
                    "SubFindingList": item.SubFindingList || [],
                }
                Mitem.RemarksArray.push(obj);
            }

        };

        $scope.ChangeNotes = function (item) {
            item.IsShowNotesTextBox = !item.IsShowNotesTextBox;
        };

        $scope.removeRightAnteriorNew = function (item, inv) {

            angular.forEach(inv.RemarksArray, function (hitem, index) {
                if (hitem.InvFindingId === item.InvFindingId && hitem.OrganId == item.OrganId) {
                    if (hitem.RemarksId === 0) {
                        inv.RemarksArray.splice(index, 1);
                    }
                    else {
                        hitem.ActiveInd = 'N';
                    }
                    if (inv.CategoryId === 5) {
                        $scope.cacheStorageItem.AnteriorODIsNormal = false;
                        //    $scope.cacheStorageItem.AnteriorOSIsNormal = false;
                    }
                    if (inv.CategoryId === 6) {
                        $scope.cacheStorageItem.PosteriorODIsNormal = false;
                        //    $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                    }
                }
            });
        };
        $scope.removeLeftAnteriorNew = function (item, inv) {
            angular.forEach(inv.RemarksArray, function (hitem, index) {
                if (hitem.InvFindingId === item.InvFindingId && hitem.OrganId == item.OrganId) {
                    if (hitem.RemarksId === 0) {
                        inv.RemarksArray.splice(index, 1);
                    }
                    else {
                        hitem.ActiveInd = 'N';
                    }
                    if (inv.CategoryId === 5) {
                        //$scope.cacheStorageItem.AnteriorODIsNormal = false;
                        $scope.cacheStorageItem.AnteriorOSIsNormal = false;
                    }
                    if (inv.CategoryId === 6) {
                        //$scope.cacheStorageItem.PosteriorODIsNormal = false;
                        $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                    }
                }
            });
        };

        $scope.SelectedFindingAnteriorSegmentValue = function (selectedinv, item, CategoryId) {
            var i = 0;
            var count = [];
            var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
            if ($scope.AnteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (Ritem) {
                            Ritem.IsShowNotesTextBox = false;
                        });
                    }
                });
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        count = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.OrganId === selectedinv.SelectedINVEye && fitem.ActiveInd == "Y" });
                        if (count.length !== 0) {
                            i++;
                        }
                    }
                });
            }

            if (i !== 0) {
                $scope.newAnteriorObj.AnteriorSearchObj = '';
                $scope.newAnteriorObj.OSAnteriorSearchObj = '';
                alertify.error("This Item is Already Added");
                return false;
            }

            var filetrarray = $filter("filter")($scope.AnteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.FindingId }) || [];
            if (filetrarray.length == 0) {

                var object = {
                    "PatientFindingAnteriorId": 0,
                    "IsNormal": false,
                    "CategoryId": 5,
                    "CategoryDesc": "Anterior Segment",
                    "InvestigationId": item.FindingId || 0,
                    "InvestigationDesc": item.FindingName || "",
                    "ActiveInd": "Y",
                    "SelectedGlobalSearch": "",
                    "SelectedRightEye": 1,
                    "SelectedLeftEye": 0,
                    "RemarksArray": [],

                };

                if (selectedinv.SelectedINVEye == 1) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": item.InvFindingId || 0,
                        "FindingValue": item.FindingValue || '',
                        "OrganId": selectedinv.SelectedINVEye || 1,
                        "FindingId": item.FindingId || 0,
                        "FindingName": item.FindingName || '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": true,
                        "SubFindingList": []
                    }
                } else if (selectedinv.SelectedINVEye == 2) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": item.InvFindingId || 0,
                        "FindingValue": item.FindingValue || '',
                        "OrganId": selectedinv.SelectedINVEye || 2,
                        "FindingId": item.FindingId || 0,
                        "FindingName": item.FindingName || '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": true,
                        "SubFindingList": []
                    }
                }
                object.RemarksArray.push(obj);

                $scope.AnteriorSegmentArrayNew.push(object);


            }
            else {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.InvestigationId == item.FindingId) {
                        if (selectedinv.SelectedINVEye == 1) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": selectedinv.SelectedINVEye || 1,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        } else if (selectedinv.SelectedINVEye == 2) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": selectedinv.SelectedINVEye || 2,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        }
                        if (Mitem.RemarksArray.length > 0) {
                            angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                angular.forEach(temparray, function (tempitem, index1) {
                                    if (hitem.OrganId == selectedinv.SelectedINVEye && hitem.InvFindingId === tempitem.InvFindingId) {
                                        if (hitem.RemarksId === 0) {
                                            Mitem.RemarksArray.splice(index, 1);
                                        }
                                        else {
                                            hitem.ActiveInd = 'N';
                                        }
                                    }
                                });

                            });
                        }
                        Mitem.RemarksArray.push(obj);
                    }
                });
            }
        };

        $scope.SelectAnterirSubvalues = function (item, AntObj) {
            item = item || '';

            $scope.obj = {
                "FindingId": null,
                "FindingName": '',
                "FindingValue": '',
                "InvFindingId": null,
                "Organ": AntObj.SelectedINVEye || 1,
                "AntorpostrId": AntObj.CatId || null,
                "SubFindingArrayInLevel1": [],
                "SubFindingArrayInLevel2": [],
                "SubFindingArrayInLevel3": [],
                "SubFindingArrayInLevel4": [],
            }


            if (item.FindingsValues.length > 0) {
                $scope.obj.FindingId = item.FindingId;
                $scope.obj.FindingName = item.FindingName;
                $scope.obj.FindingValue = item.FindingValue;
                $scope.obj.InvFindingId = item.InvFindingId;
                angular.forEach(item.FindingsValues, function (ritem) {
                    if (ritem.LevelType == "Level1") {
                        var obj = {
                            "DeleteInd": ritem.DeleteInd || "N",
                            "InvFindingId": ritem.InvFindingId || 0,
                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                            "LevelType": ritem.LevelType || 'Level1',
                            "FindingValue": ritem.FindingValue || '',
                            "IsCheckFindingValue": false,
                        }
                        $scope.obj.SubFindingArrayInLevel1.push(obj);
                    } else if (ritem.LevelType == "Level2") {
                        var obj1 = {
                            "DeleteInd": ritem.DeleteInd || "N",
                            "InvFindingId": ritem.InvFindingId || 0,
                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                            "LevelType": ritem.LevelType || 'Level2',
                            "FindingValue": ritem.FindingValue || '',
                            "IsCheckFindingValue": false,
                        }
                        $scope.obj.SubFindingArrayInLevel2.push(obj1);
                    } else if (ritem.LevelType == "Level3") {
                        var obj1 = {
                            "DeleteInd": ritem.DeleteInd || "N",
                            "InvFindingId": ritem.InvFindingId || 0,
                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                            "LevelType": ritem.LevelType || "Level3",
                            "FindingValue": ritem.FindingValue || '',
                            "IsCheckFindingValue": false,
                        }
                        $scope.obj.SubFindingArrayInLevel3.push(obj1);
                    } else if (ritem.LevelType == "Level4") {
                        var obj1 = {
                            "DeleteInd": ritem.DeleteInd || "N",
                            "InvFindingId": ritem.InvFindingId || 0,
                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                            "LevelType": ritem.LevelType || "Level4",
                            "FindingValue": ritem.FindingValue || '',
                            "IsCheckFindingValue": false,
                        }
                        $scope.obj.SubFindingArrayInLevel4.push(obj1);
                    }
                });
            }
            if ($scope.AnteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Aitem) {
                    if (Aitem.RemarksArray.length > 0) {
                        angular.forEach(Aitem.RemarksArray, function (Bitem) {
                            if (Bitem.SubFindingList.length > 0) {
                                angular.forEach(Bitem.SubFindingList, function (Citem) {
                                    if (AntObj.SelectedINVEye == Bitem.OrganId) {
                                        if (Citem.LevelType == 'Level1') {
                                            angular.forEach($scope.obj.SubFindingArrayInLevel1, function (Ditem) {
                                                if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                    Ditem.IsCheckFindingValue = true;
                                                }
                                            });
                                        } else if (Citem.LevelType == 'Level2') {
                                            angular.forEach($scope.obj.SubFindingArrayInLevel2, function (Ditem) {
                                                if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                    Ditem.IsCheckFindingValue = true;
                                                }
                                            });
                                        } else if (Citem.LevelType == 'Level3') {
                                            angular.forEach($scope.obj.SubFindingArrayInLevel3, function (Ditem) {
                                                if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                    Ditem.IsCheckFindingValue = true;
                                                }
                                            });
                                        } else if (Citem.LevelType == 'Level4') {
                                            angular.forEach($scope.obj.SubFindingArrayInLevel4, function (Ditem) {
                                                if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                    Ditem.IsCheckFindingValue = true;
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "examinationsubpreview.html",
                //"size": "md",
                /*"backdrop": "static",*/
                "scope": $scope,
                "keyboard": false,
                "windowClass": "examination-popover-popup overflow-hidden",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.closeExamPopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };

        $scope.SelectSubFindingValue = function (ritem, Selectedobj) {
            if (Selectedobj.AntorpostrId == 5) {
                var FilteredAntArray = $filter("filter")($scope.AnteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == Selectedobj.FindingId }) || [];
                if (FilteredAntArray.length !== 0) {
                    angular.forEach(FilteredAntArray, function (Mitem) {
                        if (Mitem.RemarksArray.length > 0) {
                            var FilteredRemarksArray = $filter("filter")(Mitem.RemarksArray, function (iterator, ind) { return iterator.InvFindingId == ritem.InvFindingId }) || [];

                            if (FilteredRemarksArray.length !== 0) {
                                angular.forEach(Mitem.RemarksArray, function (Nitem) {
                                    if (Nitem.OrganId == Selectedobj.Organ) {
                                        var filetrarray = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.LevelType == ritem.LevelType }) || [];
                                        if (filetrarray.length == 0) {
                                            if (Nitem.InvFindingId == ritem.InvFindingId) {
                                                var obj1 = {
                                                    "AnteriorSegmentRemarksLevelId": 0,
                                                    "DeleteInd": ritem.DeleteInd || "N",
                                                    "InvFindingId": ritem.InvFindingId || 0,
                                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                    "LevelType": ritem.LevelType || '',
                                                    "FindingValue": ritem.FindingValue || '',
                                                    "IsCheckFindingValue": true,
                                                }
                                                if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                    Nitem.SubFindingList.push(obj1);
                                                }
                                            }
                                        } else {
                                            var filetrarray1 = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == ritem.InvFindingLevelId }) || [];
                                            if (filetrarray1.length == 0) {
                                                var obj1 = {
                                                    "AnteriorSegmentRemarksLevelId": 0,
                                                    "DeleteInd": ritem.DeleteInd || "N",
                                                    "InvFindingId": ritem.InvFindingId || 0,
                                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                    "LevelType": ritem.LevelType || '',
                                                    "FindingValue": ritem.FindingValue || '',
                                                    "IsCheckFindingValue": true,
                                                }
                                                if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                    Nitem.SubFindingList.push(obj1);
                                                }
                                            } else {
                                                angular.forEach(Nitem.SubFindingList, function (Mitem, index) {
                                                    if (Mitem.InvFindingLevelId == ritem.InvFindingLevelId) {
                                                        Nitem.SubFindingList.splice(index, 1);
                                                    }
                                                });
                                            }
                                            //angular.forEach(Nitem.SubFindingList, function (oitem) {
                                            //    if (oitem.LevelType == ritem.LevelType && oitem.InvFindingId == ritem.InvFindingId) {
                                            //        oitem.DeleteInd = ritem.DeleteInd || "N",
                                            //            oitem.AnteriorSegmentRemarksLevelId = ritem.AnteriorSegmentRemarksLevelId || 0,
                                            //            oitem.InvFindingId = ritem.InvFindingId || 0,
                                            //            oitem.InvFindingLevelId = ritem.InvFindingLevelId || 0,
                                            //            oitem.LevelType = ritem.LevelType || '',
                                            //            oitem.FindingValue = ritem.FindingValue || '',
                                            //            oitem.IsCheckFindingValue = true
                                            //    }
                                            //});
                                        }
                                    }
                                });
                            } else {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": Selectedobj.InvFindingId || 0,
                                    "FindingValue": Selectedobj.FindingValue || '',
                                    "OrganId": Selectedobj.Organ || 1,
                                    "FindingId": Selectedobj.FindingId || 0,
                                    "FindingName": Selectedobj.FindingName || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": true,
                                    "SubFindingList": []
                                }
                                var obj1 = {
                                    "AnteriorSegmentRemarksLevelId": 0,
                                    "DeleteInd": ritem.DeleteInd || "N",
                                    "InvFindingId": ritem.InvFindingId || 0,
                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                    "LevelType": ritem.LevelType || '',
                                    "FindingValue": ritem.FindingValue || '',
                                    "IsCheckFindingValue": true,
                                }
                                obj.SubFindingList.push(obj1);
                                Mitem.RemarksArray.push(obj);
                            }
                        }
                    });
                } else {
                    var object = {
                        "PatientFindingAnteriorId": 0,
                        "IsNormal": false,
                        "CategoryId": 5,
                        "CategoryDesc": "Anterior Segment",
                        "InvestigationId": Selectedobj.FindingId || 0,
                        "InvestigationDesc": Selectedobj.FindingName || "",
                        "ActiveInd": "Y",
                        "SelectedGlobalSearch": "",
                        "SelectedRightEye": 1,
                        "SelectedLeftEye": 0,
                        "RemarksArray": [],

                    };
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": Selectedobj.InvFindingId || 0,
                        "FindingValue": Selectedobj.FindingValue || '',
                        "OrganId": Selectedobj.Organ || 1,
                        "FindingId": Selectedobj.FindingId || 0,
                        "FindingName": Selectedobj.FindingName || '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": true,
                        "SubFindingList": []
                    }
                    var obj1 = {
                        "AnteriorSegmentRemarksLevelId": 0,
                        "DeleteInd": ritem.DeleteInd || "N",
                        "InvFindingId": ritem.InvFindingId || 0,
                        "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                        "LevelType": ritem.LevelType || '',
                        "FindingValue": ritem.FindingValue || '',
                        "IsCheckFindingValue": true,
                    }
                    obj.SubFindingList.push(obj1);
                    object.RemarksArray.push(obj);
                    $scope.AnteriorSegmentArrayNew.push(object);
                }
            } else if (Selectedobj.AntorpostrId == 6) {
                var FilteredPosteriorArray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == Selectedobj.FindingId }) || [];
                if (FilteredPosteriorArray.length !== 0) {
                    angular.forEach(FilteredPosteriorArray, function (Mitem) {
                        if (Mitem.RemarksArray.length > 0) {
                            var FilteredRemarksArray = $filter("filter")(Mitem.RemarksArray, function (iterator, ind) { return iterator.InvFindingId == ritem.InvFindingId }) || [];

                            if (FilteredRemarksArray.length !== 0) {
                                angular.forEach(Mitem.RemarksArray, function (Nitem) {
                                    if (Nitem.OrganId == Selectedobj.Organ) {
                                        var filetrarray = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.LevelType == ritem.LevelType }) || [];
                                        if (filetrarray.length == 0) {
                                            if (Nitem.InvFindingId == ritem.InvFindingId) {
                                                var obj1 = {
                                                    "PosteriorSegmentRemarksLevelId": 0,
                                                    "DeleteInd": ritem.DeleteInd || "N",
                                                    "InvFindingId": ritem.InvFindingId || 0,
                                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                    "LevelType": ritem.LevelType || '',
                                                    "FindingValue": ritem.FindingValue || '',
                                                    "IsCheckFindingValue": true,
                                                }
                                                if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                    Nitem.SubFindingList.push(obj1);
                                                }
                                            }
                                        } else {
                                            var filetrarray1 = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == ritem.InvFindingLevelId }) || [];
                                            if (filetrarray1.length == 0) {
                                                var obj1 = {
                                                    "AnteriorSegmentRemarksLevelId": 0,
                                                    "DeleteInd": ritem.DeleteInd || "N",
                                                    "InvFindingId": ritem.InvFindingId || 0,
                                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                    "LevelType": ritem.LevelType || '',
                                                    "FindingValue": ritem.FindingValue || '',
                                                    "IsCheckFindingValue": true,
                                                }
                                                if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                    Nitem.SubFindingList.push(obj1);
                                                }
                                            } else {
                                                angular.forEach(Nitem.SubFindingList, function (Mitem, index) {
                                                    if (Mitem.InvFindingLevelId == ritem.InvFindingLevelId) {
                                                        Nitem.SubFindingList.splice(index, 1);
                                                    }
                                                });
                                            }
                                            //angular.forEach(Nitem.SubFindingList, function (oitem) {
                                            //    if (oitem.LevelType == ritem.LevelType && oitem.InvFindingId == ritem.InvFindingId) {
                                            //        oitem.DeleteInd = ritem.DeleteInd || "N",
                                            //        oitem.PosteriorSegmentRemarksLevelId = ritem.PosteriorSegmentRemarksLevelId || 0,
                                            //        oitem.InvFindingId = ritem.InvFindingId || 0,
                                            //        oitem.InvFindingLevelId = ritem.InvFindingLevelId || 0,
                                            //        oitem.LevelType = ritem.LevelType || '',
                                            //        oitem.FindingValue = ritem.FindingValue || '',
                                            //        oitem.IsCheckFindingValue = true
                                            //    }
                                            //});
                                        }
                                    }
                                });
                            } else {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": Selectedobj.InvFindingId || 0,
                                    "FindingValue": Selectedobj.FindingValue || '',
                                    "OrganId": Selectedobj.Organ || 1,
                                    "FindingId": Selectedobj.FindingId || 0,
                                    "FindingName": Selectedobj.FindingName || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": true,
                                    "SubFindingList": []
                                }
                                var obj1 = {
                                    "PosteriorSegmentRemarksLevelId": 0,
                                    "DeleteInd": ritem.DeleteInd || "N",
                                    "InvFindingId": ritem.InvFindingId || 0,
                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                    "LevelType": ritem.LevelType || '',
                                    "FindingValue": ritem.FindingValue || '',
                                    "IsCheckFindingValue": true,
                                }
                                obj.SubFindingList.push(obj1);
                                Mitem.RemarksArray.push(obj);
                            }
                        }
                    });
                } else {
                    var object = {
                        "PatientFindingPosteriorId": 0,
                        "IsNormal": false,
                        "CategoryId": 6,
                        "CategoryDesc": "Posterior Segment",
                        "InvestigationId": Selectedobj.FindingId || 0,
                        "InvestigationDesc": Selectedobj.FindingName || "",
                        "ActiveInd": "Y",
                        "SelectedGlobalSearch": "",
                        "SelectedRightEye": 1,
                        "SelectedLeftEye": 0,
                        "RemarksArray": [],

                    };
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": Selectedobj.InvFindingId || 0,
                        "FindingValue": Selectedobj.FindingValue || '',
                        "OrganId": Selectedobj.Organ || 1,
                        "FindingId": Selectedobj.FindingId || 0,
                        "FindingName": Selectedobj.FindingName || '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": true,
                        "SubFindingList": []
                    }
                    var obj1 = {
                        "PosteriorSegmentRemarksLevelId": 0,
                        "DeleteInd": ritem.DeleteInd || "N",
                        "InvFindingId": ritem.InvFindingId || 0,
                        "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                        "LevelType": ritem.LevelType || '',
                        "FindingValue": ritem.FindingValue || '',
                        "IsCheckFindingValue": true,
                    }
                    obj.SubFindingList.push(obj1);
                    object.RemarksArray.push(obj);
                    $scope.PoteriorSegmentArrayNew.push(object);
                }
            }

        };

        $scope.ChangeIsNormal = function (type, status, Organ, CategoryId) {

            if (status) {
                if (type == 'Anterior') {
                    var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
                    if (Organ === 1) {
                        angular.forEach(temparray, function (item, index) {
                            angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                                var object = {
                                    "PatientFindingAnteriorId": 0,
                                    "IsNormal": true,
                                    "CategoryId": 5,
                                    "CategoryDesc": "Anterior Segment",
                                    "InvestigationId": subitem.InvestigationId || 0,
                                    "InvestigationDesc": subitem.InvestigationDesc || "",
                                    "ActiveInd": "Y",
                                    "SelectedGlobalSearch": "",
                                    "SelectedRightEye": 1,
                                    "SelectedLeftEye": 0,
                                    "RemarksArray": [],

                                };
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || "",
                                    "OrganId": Organ || 1,
                                    "FindingId": 0,
                                    "FindingName": '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": false,
                                    "SubFindingList": []
                                }
                                var List = [];
                                List = $filter("filter")($scope.AnteriorSegmentArrayNew, { "InvestigationId": subitem.InvestigationId }, true);
                                if (List.length == 0) {
                                    if (subitem.InvestigationId == item.InvestigationId) {
                                        object.RemarksArray.push(obj);
                                        $scope.AnteriorSegmentArrayNew.push(object);
                                    }
                                } else {
                                    angular.forEach(List, function (aitem) {
                                        var List1 = [];
                                        List1 = $filter("filter")(aitem.RemarksArray, { "OrganId": 1, "ActiveInd": "Y" }, true);
                                        if (List1.length == 0) {
                                            var obj = {
                                                "RemarksId": 0,
                                                "InvFindingId": item.InvFindingId || 0,
                                                "FindingValue": item.FindingValue || "",
                                                "OrganId": Organ || 1,
                                                "FindingId": 0,
                                                "FindingName": '',
                                                "DiagnosisRiskLevel": "",
                                                "ActiveInd": "Y",
                                                "Notes": "",
                                                "IsShowNotesTextBox": false,
                                                "SubFindingList": []
                                            }
                                            if (subitem.InvestigationId == item.InvestigationId) {
                                                aitem.RemarksArray.push(obj);
                                            }
                                        }
                                    });
                                }
                            });
                        });
                        $scope.newAnteriorObj.AnteriorSearchObj = "";
                        $scope.newAnteriorObj.OSAnteriorSearchObj = "";
                        $scope.cacheStorageItem.AnteriorODIsNormal = true;
                    }
                    if (Organ === 2) {
                        angular.forEach(temparray, function (item, index) {
                            angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {

                                var object = {
                                    "PatientFindingAnteriorId": 0,
                                    "IsNormal": true,
                                    "CategoryId": 5,
                                    "CategoryDesc": "Anterior Segment",
                                    "InvestigationId": subitem.InvestigationId || 0,
                                    "InvestigationDesc": subitem.InvestigationDesc || "",
                                    "ActiveInd": "Y",
                                    "SelectedGlobalSearch": "",
                                    "SelectedRightEye": 1,
                                    "SelectedLeftEye": 0,
                                    "RemarksArray": [],

                                };
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || "",
                                    "OrganId": Organ || 2,
                                    "FindingId": 0,
                                    "FindingName": '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": false,
                                    "SubFindingList": []
                                }
                                var List = [];
                                List = $filter("filter")($scope.AnteriorSegmentArrayNew, { "InvestigationId": subitem.InvestigationId }, true);
                                if (List.length == 0) {
                                    if (subitem.InvestigationId == item.InvestigationId) {
                                        object.RemarksArray.push(obj);
                                        $scope.AnteriorSegmentArrayNew.push(object);
                                    }
                                } else {
                                    angular.forEach(List, function (aitem) {
                                        var List1 = [];
                                        List1 = $filter("filter")(aitem.RemarksArray, { "OrganId": 2, "ActiveInd": "Y" }, true);
                                        if (List1.length == 0) {
                                            var obj = {
                                                "RemarksId": 0,
                                                "InvFindingId": item.InvFindingId || 0,
                                                "FindingValue": item.FindingValue || "",
                                                "OrganId": Organ || 2,
                                                "FindingId": 0,
                                                "FindingName": '',
                                                "DiagnosisRiskLevel": "",
                                                "ActiveInd": "Y",
                                                "Notes": "",
                                                "IsShowNotesTextBox": false,
                                                "SubFindingList": []
                                            }
                                            if (subitem.InvestigationId == item.InvestigationId) {
                                                aitem.RemarksArray.push(obj);
                                            }
                                        }
                                    });
                                }
                            });
                        });

                        $scope.newAnteriorObj.AnteriorSearchObj = "";
                        $scope.newAnteriorObj.OSAnteriorSearchObj = "";
                        $scope.cacheStorageItem.AnteriorOSIsNormal = true;
                    }
                }

                if (type == 'Posterior') {
                    var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
                    if (Organ === 1) {
                        angular.forEach(temparray, function (item, index) {
                            angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {

                                var object = {
                                    "PatientFindingPosteriorId": 0,
                                    "IsNormal": true,
                                    "CategoryId": 6,
                                    "CategoryDesc": "Posterior Segment",
                                    "InvestigationId": subitem.InvestigationId || 0,
                                    "InvestigationDesc": subitem.InvestigationDesc || "",
                                    "ActiveInd": "Y",
                                    "SelectedGlobalSearch": "",
                                    "SelectedRightEye": 1,
                                    "SelectedLeftEye": 0,
                                    "RemarksArray": [],

                                };
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || "",
                                    "OrganId": Organ || 1,
                                    "FindingId": 0,
                                    "FindingName": '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": false,
                                    "SubFindingList": []
                                }
                                var List = [];
                                List = $filter("filter")($scope.PoteriorSegmentArrayNew, { "InvestigationId": subitem.InvestigationId }, true);
                                if (List.length == 0) {
                                    if (subitem.InvestigationId == item.InvestigationId) {
                                        object.RemarksArray.push(obj);
                                        $scope.PoteriorSegmentArrayNew.push(object);
                                    }
                                } else {
                                    angular.forEach(List, function (aitem) {
                                        var List1 = [];
                                        List1 = $filter("filter")(aitem.RemarksArray, { "OrganId": 1, "ActiveInd": "Y" }, true);
                                        if (List1.length == 0) {
                                            var obj = {
                                                "RemarksId": 0,
                                                "InvFindingId": item.InvFindingId || 0,
                                                "FindingValue": item.FindingValue || "",
                                                "OrganId": Organ || 1,
                                                "FindingId": 0,
                                                "FindingName": '',
                                                "DiagnosisRiskLevel": "",
                                                "ActiveInd": "Y",
                                                "Notes": "",
                                                "IsShowNotesTextBox": false,
                                                "SubFindingList": []
                                            }
                                            if (subitem.InvestigationId == item.InvestigationId) {
                                                aitem.RemarksArray.push(obj);
                                            }
                                        }
                                    });
                                }
                            });
                        });
                        $scope.newPosteriorObj.PosteriorSearchObj = "";
                        $scope.newPosteriorObj.OSPosteriorSearchObj = "";
                        $scope.cacheStorageItem.PosteriorODIsNormal = true;
                    }
                    if (Organ === 2) {
                        angular.forEach(temparray, function (item, index) {
                            angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {
                                $scope.newPosteriorObj.PosteriorSearchObj = "";
                                $scope.newPosteriorObj.OSPosteriorSearchObj = "";

                                var object = {
                                    "PatientFindingPosteriorId": 0,
                                    "IsNormal": true,
                                    "CategoryId": 6,
                                    "CategoryDesc": "Posterior Segment",
                                    "InvestigationId": subitem.InvestigationId || 0,
                                    "InvestigationDesc": subitem.InvestigationDesc || "",
                                    "ActiveInd": "Y",
                                    "SelectedGlobalSearch": "",
                                    "SelectedRightEye": 1,
                                    "SelectedLeftEye": 0,
                                    "RemarksArray": [],

                                };
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || "",
                                    "OrganId": 2,
                                    "FindingId": 0,
                                    "FindingName": '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": false,
                                    "SubFindingList": []
                                }
                                var List = [];
                                List = $filter("filter")($scope.PoteriorSegmentArrayNew, { "InvestigationId": subitem.InvestigationId }, true);
                                if (List.length == 0) {
                                    if (subitem.InvestigationId == item.InvestigationId) {
                                        object.RemarksArray.push(obj);
                                        $scope.PoteriorSegmentArrayNew.push(object);
                                    }
                                } else {
                                    angular.forEach(List, function (aitem) {
                                        var List1 = [];
                                        List1 = $filter("filter")(aitem.RemarksArray, { "OrganId": 2, "ActiveInd": "Y" }, true);
                                        if (List1.length == 0) {
                                            var obj = {
                                                "RemarksId": 0,
                                                "InvFindingId": item.InvFindingId || 0,
                                                "FindingValue": item.FindingValue || "",
                                                "OrganId": Organ || 2,
                                                "FindingId": 0,
                                                "FindingName": '',
                                                "DiagnosisRiskLevel": "",
                                                "ActiveInd": "Y",
                                                "Notes": "",
                                                "IsShowNotesTextBox": false,
                                                "SubFindingList": []
                                            }
                                            if (subitem.InvestigationId == item.InvestigationId) {
                                                aitem.RemarksArray.push(obj);
                                            }
                                        }
                                    });
                                }
                            });
                        });

                        $scope.cacheStorageItem.PosteriorOSIsNormal = true;
                    }
                }
            } else {
                if (type == 'Anterior') {
                    var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
                    if (Organ === 1) {
                        //angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                        //    angular.forEach(subitem.RemarksArray, function (Mitem, index1) {
                        //        if (Mitem.OrganId == 1) {
                        //           subitem.RemarksArray.splice(index1, 1);
                        //        }
                        //    });

                        //});
                        angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                            angular.forEach(temparray, function (item, index) {
                                if (Mitem.RemarksArray.length > 0) {
                                    angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                        if (hitem.InvFindingId == item.InvFindingId) {
                                            if (hitem.RemarksId === 0 && hitem.OrganId == 1) {
                                                Mitem.RemarksArray.splice(index, 1);
                                            }
                                            else if (hitem.OrganId == 1) {
                                                hitem.ActiveInd = 'N';
                                            }
                                        }
                                    });
                                }
                            });
                        });
                        $scope.cacheStorageItem.AnteriorODIsNormal = false;
                    }
                    if (Organ === 2) {
                        angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                            angular.forEach(temparray, function (item, index) {
                                if (Mitem.RemarksArray.length > 0) {
                                    angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                        if (hitem.InvFindingId == item.InvFindingId) {
                                            if (hitem.RemarksId === 0 && hitem.OrganId == 2) {
                                                Mitem.RemarksArray.splice(index, 1);
                                            }
                                            else if (hitem.OrganId == 2) {
                                                hitem.ActiveInd = 'N';
                                            }
                                        }
                                    });
                                }
                            });
                        });
                        $scope.cacheStorageItem.AnteriorOSIsNormal = false;
                    }
                }
                if (type == 'Posterior') {
                    var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
                    if (Organ === 1) {
                        angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                            angular.forEach(temparray, function (item, index) {
                                if (Mitem.RemarksArray.length > 0) {
                                    angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                        if (hitem.InvFindingId == item.InvFindingId) {
                                            if (hitem.RemarksId === 0 && hitem.OrganId == 1) {
                                                Mitem.RemarksArray.splice(index, 1);
                                            }
                                            else if (hitem.OrganId == 1) {
                                                hitem.ActiveInd = 'N';
                                            }
                                        }
                                    });
                                }
                            });
                        });
                        $scope.cacheStorageItem.PosteriorODIsNormal = false;
                    }
                    if (Organ === 2) {
                        angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                            angular.forEach(temparray, function (item, index) {
                                if (Mitem.RemarksArray.length > 0) {
                                    angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                        if (hitem.InvFindingId == item.InvFindingId) {
                                            if (hitem.RemarksId === 0 && hitem.OrganId == 2) {
                                                Mitem.RemarksArray.splice(index, 1);
                                            }
                                            else if (hitem.OrganId == 2) {
                                                hitem.ActiveInd = 'N';
                                            }
                                        }
                                    });
                                }
                            });
                        });
                        $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                    }
                }
            }


        }

        $scope.changePosteriorOrgan = function (Organ) {
            $scope.newPosteriorObj.SelectedEye = Organ;
            $scope.newPosteriorObj.PosteriorSearchObj = '';
            $scope.newPosteriorObj.OSPosteriorSearchObj = '';
        };

        $scope.ChangeFindingPSValue = function (selectedinv, item, CategoryId) {
            $scope.newPosteriorObj.PosteriorSearchObj = '';
            $scope.newPosteriorObj.OSPosteriorSearchObj = '';
            var count = [];
            var i = 0;
            var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);

            if ($scope.PoteriorSegmentArrayNew.length > 0) {
                if (item.FindingId != 32) {
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                        if (Mitem.RemarksArray.length > 0) {
                            angular.forEach(Mitem.RemarksArray, function (Ritem) {
                                Ritem.IsShowNotesTextBox = false;
                            });
                        }
                    });
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                        if (Mitem.RemarksArray.length > 0) {
                            count = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.OrganId === selectedinv.SelectedEye });
                            if (count.length !== 0) {
                                i++;
                            }
                        }
                    });
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                        if (Mitem.RemarksArray.length > 0) {
                            angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                angular.forEach(temparray, function (tempitem, index1) {
                                    if (hitem.InvFindingId === tempitem.InvFindingId && hitem.OrganId == selectedinv.SelectedEye && item.FindingId === Mitem.InvestigationId) {
                                        if (hitem.RemarksId === 0) {
                                            Mitem.RemarksArray.splice(index, 1);
                                        }
                                        else {
                                            hitem.ActiveInd = 'N';
                                        }
                                    }
                                });
                            });
                        }
                    });
                } else if (item.FindingId == 32) {
                    var object = {
                        "PatientFindingPosteriorId": 0,
                        "ActiveInd": "Y",
                        "IsNormal": false,
                        "CategoryId": 6,
                        "CategoryDesc": "Posterior Segment",
                        "InvestigationId": 32,
                        "InvestigationDesc": "CDR",
                        "RHorizontal": '',
                        "LHorizontal": '',
                        "RVertical": '',
                        "LVertical": '',
                        "RDPS": '',
                        "LDPS": '',
                        "RemarksArray": [],

                    };

                    var filetrarray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == 32, iterator.ActiveInd== "Y" }) || [];
                    if (filetrarray.length == 0) {
                        $scope.PoteriorSegmentArrayNew.push(object);
                    }
                    item.FindingValue = item.FindingValue || "";
                    var parts = item.FindingValue.split(' ');
                    var value = parts[0]||"";
                    var valuetype = parts[1]||"";
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (pitem) {

                        if (pitem.InvestigationId == 32) {
                            if (selectedinv.SelectedEye == 1) {
                                if (valuetype == 'HZ') {
                                    pitem.RHorizontal = value || "";
                                   /* pitem.RVertical = value|| "";*/
                  
                                } else if (valuetype == 'V.T.') {
                                    pitem.RVertical = value || "";
                                    pitem.RHorizontal = value || "";
                                } else if (valuetype == 'DPS'){
                                    pitem.RDPS = value || "";
                                }
                            } else if (selectedinv.SelectedEye == 2) {
                                if (valuetype == 'HZ') {
                                    pitem.LHorizontal = value|| "";
                                  /*  pitem.LVertical = value || "";*/
               
                                } else if (valuetype == 'V.T.') {
                                    pitem.LVertical = value || "";
                                    pitem.LHorizontal = value || "";
                                } else if (valuetype == 'DPS'){
                                    pitem.LDPS = value  || "";
                                }

                            }
                        }
                    });
                }
                
            }

            if (i !== 0) {
                $scope.newPosteriorObj.AnteriorSearchObj = '';
                $scope.newPosteriorObj.OSAnteriorSearchObj = '';
                alertify.error("This Item is Already Added");
                return false;
            }

            var filetrarray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.FindingId }) || [];
            if (filetrarray.length == 0) {
                if (item.FindingId != 32) {
                    var object = {
                        "PatientFindingPosteriorId": 0,
                        "IsNormal": false,
                        "CategoryId": 6,
                        "CategoryDesc": "Posterior Segment",
                        "InvestigationId": item.FindingId || 0,
                        "InvestigationDesc": item.FindingName || "",
                        "ActiveInd": "Y",
                        "SelectedGlobalSearch": "",
                        "SelectedRightEye": 1,
                        "SelectedLeftEye": 0,
                        "RemarksArray": [],

                    };

                    if (selectedinv.SelectedEye == 1) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": item.InvFindingId || 0,
                            "FindingValue": item.FindingValue || '',
                            "OrganId": selectedinv.SelectedEye || 1,
                            "FindingId": item.FindingId || 0,
                            "FindingName": item.FindingName || '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": "",
                            "IsShowNotesTextBox": false,
                            "SubFindingList": []
                        }
                        $scope.cacheStorageItem.PosteriorODIsNormal = false;
                    } else if (selectedinv.SelectedEye == 2) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": item.InvFindingId || 0,
                            "FindingValue": item.FindingValue || '',
                            "OrganId": selectedinv.SelectedEye || 2,
                            "FindingId": item.FindingId || 0,
                            "FindingName": item.FindingName || '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": "",
                            "IsShowNotesTextBox": false,
                            "SubFindingList": []
                        }
                        $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                    }
                    object.RemarksArray.push(obj);
                    $scope.PoteriorSegmentArrayNew.push(object);
                } else if (item.FindingId == 32) {
                    /*if (item.InvestigationId == 32) {*/

                    var object = {
                        "PatientFindingPosteriorId": 0,
                        "ActiveInd": "Y",
                        "IsNormal": false,
                        "CategoryId": 6,
                        "CategoryDesc": "Posterior Segment",
                        "InvestigationId": 32,
                        "InvestigationDesc": "CDR",
                        "RHorizontal": '',
                        "LHorizontal": '',
                        "RVertical": '',
                        "LVertical": '',
                        "RDPS": '',
                        "LDPS": '',
                        "RemarksArray": [],

                    };

                    var filetrarray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == 32 }) || [];
                    if (filetrarray.length == 0) {
                        $scope.PoteriorSegmentArrayNew.push(object);
                    }
                    item.FindingValue = item.FindingValue || "";
                    var parts = item.FindingValue.split(' ');
                    var value = parts[0]||"";
                    var valuetype = parts[1]||"";
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (pitem) {

                        if (pitem.InvestigationId == 32) {
                            if (selectedinv.SelectedEye == 1) {
                                if (valuetype == 'HZ') {
                                    pitem.RHorizontal = value || "";
                                    /*pitem.RVertical = value || "";*/

                                } else if (valuetype == 'V.T.') {
                                    pitem.RVertical = value || "";
                                    pitem.RHorizontal = value || "";
                                } else if (valuetype == 'DPS') {
                                    pitem.RDPS = value || "";
                                }
                            } else if (selectedinv.SelectedEye == 2) {
                                if (valuetype == 'HZ') {
                                    pitem.LHorizontal = value || "";
                                    /*pitem.LVertical = value || "";*/

                                } else if (valuetype == 'V.T.') {
                                    pitem.LVertical = value || "";
                                    pitem.LHorizontal = value || "";
                                } else if (valuetype =='DPS') {
                                    pitem.LDPS = value || "";
                                }

                            }
                        }
                    });
                    /*}*/
                }
               
                

            } else {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.InvestigationId == item.FindingId && Mitem.InvestigationId != 32) {
                        if (selectedinv.SelectedEye == 1) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": selectedinv.SelectedEye || 1,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": false,
                                "SubFindingList": []
                            }
                            $scope.cacheStorageItem.PosteriorODIsNormal = false;
                        } else if (selectedinv.SelectedEye == 2) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": selectedinv.SelectedEye || 2,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": false,
                                "SubFindingList": []
                            }
                            $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                        }
                        Mitem.RemarksArray.push(obj);
                    }
                    //else if (Mitem.InvestigationId == item.FindingId && Mitem.InvestigationId == 32) {
                    //    var object = {
                    //        "PatientFindingPosteriorId": 0,
                    //        "ActiveInd": "Y",
                    //        "IsNormal": false,
                    //        "CategoryId": 6,
                    //        "CategoryDesc": "Posterior Segment",
                    //        "InvestigationId": 32,
                    //        "InvestigationDesc": "CDR",
                    //        "RHorizontal": '',
                    //        "LHorizontal": '',
                    //        "RVertical": '',
                    //        "LVertical": '',
                    //        "RDPS": '',
                    //        "LDPS": '',
                    //        "RemarksArray": [],

                    //    };
                    //}
                });
            }

        };

        $scope.changeINVPosteriorOrgan = function (Organ) {
            $scope.newPosteriorObj.SelectedINVEye = Organ;
            $scope.newPosteriorObj.PosteriorInvSearchObj = '';
        };
        function PSchunkArray(arr, chunkSize) {
            let pschunkedArray = [];
            for (let i = 0; i < arr.length; i += chunkSize) {
                pschunkedArray.push(arr.slice(i, i + chunkSize));
            }
            return pschunkedArray;
        }
        $scope.SelectPosteriorInvestigation1 = function (item) {
            $scope.newPosteriorObj.SelectedExaminactionINVId1 = item.InvestigationId || null;
            $scope.PosteriorINVDropdownList = [];
            $scope.PosteriorINVDropdownList = $filter("filter")($scope.PosteriorINVDropdownListMain, function (iterator, ind) { return iterator.FindingId == item.InvestigationId }) || [];
            const pschunkSize = 3;
            let size = Math.ceil(($scope.PosteriorINVDropdownList.length) / pschunkSize);
            $scope.chunkedPosteriorINVDropdownList = PSchunkArray($scope.PosteriorINVDropdownList, size);
            $scope.newPosteriorObj.AnteriorInvSearchObj = '';
            $scope.newPosteriorObj.SelectedINVEye = 1;
            $scope.newPosteriorObj.IsShowSearchBar = true;

            if (item.InvestigationId == 32) {

                var object = {
                    "PatientFindingPosteriorId": 0,
                    "ActiveInd": "Y",
                    "IsNormal": false,
                    "CategoryId": 6,
                    "CategoryDesc": "Posterior Segment",
                    "InvestigationId": 32,
                    "InvestigationDesc": "CDR",
                    "RHorizontal": '',
                    "LHorizontal": '',
                    "RVertical": '',
                    "LVertical": '',
                    "RDPS": '',
                    "LDPS": '',
                    "RemarksArray": [],

                };

                var filetrarray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == 32 }) || [];
                if (filetrarray.length == 0) {
                    $scope.PoteriorSegmentArrayNew.push(object);
                }
            }
        };

        $scope.changeRightReflexType = function (val, inv) {
            inv.RightEye.Name = val;
            inv.CornealODType = val;
        }
        $scope.changeLeftReflexType = function (val, inv) {
            inv.LeftEye.Name = val;
            inv.CornealOSType = val;
        }
        $scope.SelectedFindingPosteriorSegmentValue = function (selectedinv, item, CategoryId) {
            var i = 0;
            var count = [];
            var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
            if ($scope.PoteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (Ritem) {
                            Ritem.IsShowNotesTextBox = false;
                        });
                    }
                });
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        count = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.OrganId === selectedinv.SelectedINVEye && fitem.ActiveInd == 'Y' });
                        if (count.length !== 0) {
                            i++;
                        }
                    }
                });
            }

            if (i !== 0) {
                $scope.newAnteriorObj.AnteriorSearchObj = '';
                $scope.newAnteriorObj.OSAnteriorSearchObj = '';
                alertify.error("This Item is Already Added");
                return false;
            }

            var filetrarray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.FindingId }) || [];
            if (filetrarray.length == 0) {

                var object = {
                    "PatientFindingPosteriorId": 0,
                    "IsNormal": false,
                    "CategoryId": 6,
                    "CategoryDesc": "Posterior Segment",
                    "InvestigationId": item.FindingId || 0,
                    "InvestigationDesc": item.FindingName || "",
                    "ActiveInd": "Y",
                    "SelectedGlobalSearch": "",
                    "SelectedRightEye": 1,
                    "SelectedLeftEye": 0,
                    "RemarksArray": [],

                };

                if (selectedinv.SelectedINVEye == 1) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": item.InvFindingId || 0,
                        "FindingValue": item.FindingValue || '',
                        "OrganId": selectedinv.SelectedINVEye || 1,
                        "FindingId": item.FindingId || 0,
                        "FindingName": item.FindingName || '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": true,
                        "SubFindingList": []
                    }
                } else if (selectedinv.SelectedINVEye == 2) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": item.InvFindingId || 0,
                        "FindingValue": item.FindingValue || '',
                        "OrganId": selectedinv.SelectedINVEye || 2,
                        "FindingId": item.FindingId || 0,
                        "FindingName": item.FindingName || '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": true,
                        "SubFindingList": []
                    }
                }
                object.RemarksArray.push(obj);

                $scope.PoteriorSegmentArrayNew.push(object);


            } else {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.InvestigationId == item.FindingId) {
                        if (selectedinv.SelectedINVEye == 1) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": selectedinv.SelectedINVEye || 1,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        } else if (selectedinv.SelectedINVEye == 2) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": selectedinv.SelectedINVEye || 2,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        }
                        if (Mitem.RemarksArray.length > 0) {
                            angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                angular.forEach(temparray, function (tempitem, index1) {
                                    if (hitem.InvFindingId === tempitem.InvFindingId && hitem.OrganId == selectedinv.SelectedINVEye) {
                                        if (hitem.RemarksId === 0) {
                                            Mitem.RemarksArray.splice(index, 1);
                                        }
                                        else {
                                            hitem.ActiveInd = 'N';
                                        }
                                    }
                                });
                            });
                        }
                        Mitem.RemarksArray.push(obj);
                    }
                });
            }
        };
        $scope.AnteriorCopyFromOs = function (OrganID, InvId) {
            if (OrganID == 1) {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (item) {
                    angular.forEach(item.RemarksArray, function (Aitem) {
                        var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 1, "FindingId": InvId }, true) || [];
                        if (Filter.length > 0) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": 2,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "Notes": Aitem.Notes || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "SubFindingList": Aitem.SubFindingList || [],
                            }
                            var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 2, "FindingId": InvId }, true) || [];
                            if (InvFilter.length == 0) {
                                item.RemarksArray.push(obj);
                            }
                        }
                    });
                });
            }
            if (OrganID == 2) {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (item) {
                    angular.forEach(item.RemarksArray, function (Aitem) {
                        var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 2, "FindingId": InvId }, true) || [];
                        if (Filter.length > 0) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": 1,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "Notes": Aitem.Notes || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "SubFindingList": Aitem.SubFindingList || [],
                            }
                            var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 1, "FindingId": InvId }, true) || [];
                            if (InvFilter.length == 0) {
                                item.RemarksArray.push(obj);
                            }
                        }
                    });
                });
            }
        };
        $scope.PoteriorCopyFromOs = function (OrganID, InvId) {
            if (OrganID == 1) {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (item) {
                    angular.forEach(item.RemarksArray, function (Aitem) {
                        var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 1, "FindingId": InvId }, true) || [];
                        if (Filter.length > 0) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": 2,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "Notes": Aitem.Notes || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "SubFindingList": Aitem.SubFindingList || [],
                            }
                            var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 2, "FindingId": InvId }, true) || [];
                            if (InvFilter.length == 0) {
                                item.RemarksArray.push(obj);
                            }
                        }
                    });
                });
            }
            if (OrganID == 2) {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (item) {
                    angular.forEach(item.RemarksArray, function (Aitem) {
                        var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 2, "FindingId": InvId }, true) || [];
                        if (Filter.length > 0) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": 1,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "Notes": Aitem.Notes || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "SubFindingList": Aitem.SubFindingList || [],
                            }
                            var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 1, "FindingId": InvId }, true) || [];
                            if (InvFilter.length == 0) {
                                item.RemarksArray.push(obj);
                            }
                        }
                    });
                });
            }
        };

        $scope.AnteriorCopyToOs = function (OrganID) {
            if (OrganID == 1) {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (item) {
                    angular.forEach(item.RemarksArray, function (Aitem) {
                        var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 1 }, true) || [];
                        if (Filter.length > 0) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": 2,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "Notes": Aitem.Notes || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "SubFindingList": Aitem.SubFindingList || [],
                            }
                            var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 2 }, true) || [];
                            if (InvFilter.length == 0) {
                                item.RemarksArray.push(obj);
                            }
                        }
                    });
                });
            }
            if (OrganID == 2) {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (item) {
                    angular.forEach(item.RemarksArray, function (Aitem) {
                        var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 2 }, true) || [];
                        if (Filter.length > 0) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": 1,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "Notes": Aitem.Notes || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "SubFindingList": Aitem.SubFindingList || [],
                            }
                            var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 1 }, true) || [];
                            if (InvFilter.length == 0) {
                                item.RemarksArray.push(obj);
                            }
                        }
                    });
                });
            }
        };
        $scope.PosteriorCopyToOs = function (OrganID) {
            if (OrganID == 1) {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (item) {
                    if (item.InvestigationId == 32) {
                        item.RHorizontal = item.RHorizontal || '';
                        item.RVertical = item.RVertical || '';
                        item.RDPS = item.RDPS || '';
                        if (item.RHorizontal != '' && item.RVertical != '' && item.RDPS != '') {
                            item.LHorizontal = item.RHorizontal || '';
                            item.LVertical = item.RVertical || '';
                            item.LDPS = item.RDPS || '';
                        }
                        else {
                            if (item.RHorizontal != '') {
                                item.LHorizontal = item.RHorizontal || '';
                            }
                            if (item.RVertical != '') {
                                item.LVertical = item.RVertical || '';
                            }
                            if (item.RDPS != '') {
                                item.LDPS = item.RDPS || '';
                            }
                        }
                    }
                    else {
                        angular.forEach(item.RemarksArray, function (Aitem) {
                            var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 1 }, true) || [];
                            if (Filter.length > 0) {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": Aitem.InvFindingId || 0,
                                    "FindingValue": Aitem.FindingValue || '',
                                    "OrganId": 2,
                                    "FindingId": Aitem.FindingId || 0,
                                    "FindingName": Aitem.FindingName || '',
                                    "Notes": Aitem.Notes || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "SubFindingList": Aitem.SubFindingList || [],
                                }
                                var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 2 }, true) || [];
                                if (InvFilter.length == 0) {
                                    item.RemarksArray.push(obj);
                                }
                            }
                        });
                    }
                });
            }
            if (OrganID == 2) {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (item) {
                    if (item.InvestigationId == 32) {
                        item.LHorizontal = item.LHorizontal || '';
                        item.LVertical = item.LVertical || '';
                        item.LDPS = item.LDPS || '';
                        if (item.LHorizontal != '' && item.LVertical != '' && item.LDPS != '') {
                            item.RHorizontal = item.LHorizontal || '';
                            item.RVertical = item.LVertical || '';
                            item.RDPS = item.LDPS || '';
                        }
                        else {
                            if (item.LHorizontal != '') {
                                item.RHorizontal = item.LHorizontal || '';
                            }
                            if (item.LVertical != '') {
                                item.RVertical = item.LVertical || '';
                            }
                            if (item.LDPS != '') {
                                item.RDPS = item.LDPS || '';
                            }
                        }
                    }
                    else {
                        angular.forEach(item.RemarksArray, function (Aitem) {
                            var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 2 }, true) || [];
                            if (Filter.length > 0) {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": Aitem.InvFindingId || 0,
                                    "FindingValue": Aitem.FindingValue || '',
                                    "OrganId": 1,
                                    "FindingId": Aitem.FindingId || 0,
                                    "FindingName": Aitem.FindingName || '',
                                    "Notes": Aitem.Notes || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "SubFindingList": Aitem.SubFindingList || [],
                                }
                                var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 1 }, true) || [];
                                if (InvFilter.length == 0) {
                                    item.RemarksArray.push(obj);
                                }
                            }
                        });
                    }
                });
            }
        };

        $scope.ClickShowExaminationDrawingpad = function (Organ) {
            /*$scope.IsShowExaminationDrawingInd = !$scope.IsShowExaminationDrawingInd;*/
            $scope.IsShowExaminationDrawingInd = true;
            $scope.Investigation = {};
            $scope.Investigation.SelectedEye = Organ || "1";
            $scope.Investigation.RightEyediv = false;
            $scope.Investigation.LeftEyediv = false;
            $scope.newAnteriorObj.SelectedAnteriorObj = '';
            $scope.newPosteriorObj.SelectedPosteriorObj = '';
            if ($scope.subexaminationtab == 1) {
                $scope.Investigation.CategoryId = 5;
            } else if ($scope.subexaminationtab == 2) {
                $scope.Investigation.CategoryId = 6;
            }
            $scope.IsShowExaminactionTemplateData = false;
        };

        $scope.ChangesForAnteriorInvestigation = function (item, Organ) {
            $scope.Investigation = angular.copy(item);
            $scope.Investigation.SelectedEye = Organ || 1;
            var SelectEye = Organ == 1 ? 'Right' : 'Left';
            $scope.GetTemplate(SelectEye, $scope.Investigation, 5);
        };
        $scope.ChangesForPosteriorInvestigation = function (item, Organ) {
            $scope.Investigation = angular.copy(item);
            $scope.Investigation.SelectedEye = Organ || 1;
            var SelectEye = Organ == 1 ? 'Right' : 'Left';
            $scope.GetTemplate(SelectEye, $scope.Investigation, 6);
        };
        $scope.SaveExamTemplate = function () {
            if ($scope.subexaminationtab == 1) {
                $scope.SaveExaminationTemplatesNew('Anterior');
            } else if ($scope.subexaminationtab == 2) {
                $scope.SaveExaminationTemplatesNew('Posterior');
            }
        };
        $scope.SaveExaminationTemplatesNew = function (type) {

            if (type == 'Anterior') {
                $scope.TempAnteriorArray = [];
                $scope.AnteriorSegmentArrayNew = $scope.AnteriorSegmentArrayNew || [];
                if ($scope.Examinationobj.EnterAnteriorTemplateName == "") {
                    alertify.error("Please Enter Template Name");
                    return false;
                }
                if ($scope.AnteriorSegmentArrayNew.length === 0) {
                    alertify.error("Please Select The Anterior");
                    return false;
                }
                if ($scope.AnteriorSegmentArrayNew.length > 0) {
                    angular.forEach($scope.AnteriorSegmentArrayNew, function (item) {
                        $scope.temparray = [];
                        angular.forEach(item.RemarksArray, function (Sitem) {

                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": Sitem.OrganId || 1,
                                    "OrganName": Sitem.OrganId == 1 ? 'OD' : 'OS',
                                    "RemarksId": Sitem.InvFindingId || 0,
                                    "ActiveInd": "Y",
                                    /*"DiagnosisRiskLevel": Sitem.DiagnosisRiskLevel,*/
                                    "Remarks": Sitem.FindingValue || '',
                                    "InvFindingId": Sitem.InvFindingId,
                                    "SubFindingList": Sitem.SubFindingList || [],
                                }
                                $scope.temparray.push(obj);
                            }
                        });

                        if ($scope.temparray.length > 0) {
                            var obj1 = {
                                "CategoryId": 5,
                                "CategoryName": "Anterior Segment",
                                "InvestigationId": item.InvestigationId,
                                "InvestigationDesc": item.InvestigationDesc,
                                /*"SubCategoryChildId": item.SubCategoryChildId,*/
                                "RemarksList": $scope.temparray || [],
                            }
                            $scope.TempAnteriorArray.push(obj1);
                        }

                    });
                    var params = {
                        "UserId": $scope.UserId,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "TypeName": "Anterior",
                        "TypeId": 1,
                        "TemplateId": 0,
                        "TemplateName": $scope.Examinationobj.EnterAnteriorTemplateName || "",
                        "AnteriorArray": $scope.TempAnteriorArray || [],
                        "PosteriorArray": [],
                        "ExternalExaminationsArray": [],
                        "DeleteInd": 'N',
                        "IsTemplateFavorites": false
                    }
                    eHnotePatientDataService.AddUpdateExaminationTemplates(params).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $scope.Examinationobj.EnterAnteriorTemplateName = '';
                            if (params.TemplateId === 0) {
                                alertify.success("Save successfully");
                            } else {
                                alertify.success("Update successfully");
                            }
                            $scope.GetUserAnteriorTemplateDetails();
                        } else {
                            alertify.error("TemplateName Already Exists");
                        }
                    }, function (err) {

                    });

                }
                $scope.isAnteriorPopoverOpen = false;
                $scope.GetUserAnteriorTemplateDetails();
            }
            if (type == 'Posterior') {
                $scope.TempPosteriorArray = [];
                $scope.PoteriorSegmentArrayNew = $scope.PoteriorSegmentArrayNew || [];
                if ($scope.Examinationobj.EnterAnteriorTemplateName === "") {
                    alertify.error("Please Enter Template Name");
                    return false;
                }
                if ($scope.PoteriorSegmentArrayNew.length === 0) {
                    alertify.error("Please Select The Posterior");
                    return false;
                }
                if ($scope.PoteriorSegmentArrayNew.length > 0) {
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (item) {
                        $scope.temparray = [];
                        angular.forEach(item.RemarksArray, function (Sitem) {
                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": Sitem.OrganId || 1,
                                    "OrganName": Sitem.OrganId == 1 ? 'OD' : 'OS',
                                    "RemarksId": 0,
                                    "ActiveInd": "Y",
                                    /*"DiagnosisRiskLevel": Sitem.DiagnosisRiskLevel,*/
                                    "Remarks": Sitem.FindingValue || '',
                                    "InvFindingId": Sitem.InvFindingId,
                                    "SubFindingList": Sitem.SubFindingList || [],
                                }
                                $scope.temparray.push(obj);
                            }

                        });
                        if ($scope.temparray.length > 0) {
                            var obj1 = {
                                "CategoryId": 6,
                                "CategoryName": "Posterior Segment",
                                "InvestigationId": item.InvestigationId,
                                "InvestigationDesc": item.InvestigationDesc,
                                /*"SubCategoryChildId": item.SubCategoryChildId,*/
                                "RemarksList": $scope.temparray || [],

                            }
                            $scope.TempPosteriorArray.push(obj1);
                        }
                    });
                    var params = {
                        "UserId": $scope.UserId,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "TypeName": "Posterior",
                        "TypeId": 2,
                        "TemplateId": 0,
                        "TemplateName": $scope.Examinationobj.EnterAnteriorTemplateName || "",
                        "AnteriorArray": [],
                        "PosteriorArray": $scope.TempPosteriorArray || [],
                        "ExternalExaminationsArray": [],
                        "DeleteInd": 'N',
                        "IsTemplateFavorites": false
                    }

                    eHnotePatientDataService.AddUpdateExaminationTemplates(params).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $scope.Examinationobj.EnterAnteriorTemplateName = '';
                            if (params.TemplateId === 0) {
                                alertify.success("Save successfully");
                            } else {
                                alertify.success("Update successfully");
                            }
                            $scope.GetUserPosteriorTemplateDetails();
                        } else {
                            alertify.error("TemplateName Already Exists");
                        }
                    }, function (err) {

                    });

                }
                $scope.isPosteriorPopoverOpen = false;
                $scope.GetUserPosteriorTemplateDetails();
            }
        }

        $scope.ChangeAllPartsOfAS1 = function (CategoryId, status, type) {
            var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
            if (status) {
                if (type === "AllPartsOfAS") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {

                            var object = {
                                "PatientFindingAnteriorId": 0,
                                "IsNormal": true,
                                "CategoryId": 5,
                                "CategoryDesc": "Anterior Segment",
                                "InvestigationId": subitem.InvestigationId || 0,
                                "InvestigationDesc": subitem.InvestigationDesc || "",
                                "ActiveInd": "Y",
                                "SelectedGlobalSearch": "",
                                "SelectedRightEye": 1,
                                "SelectedLeftEye": 0,
                                "RemarksArray": [],

                            };
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || "",
                                "OrganId": 1,
                                "FindingId": 0,
                                "FindingName": '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": false,
                                "SubFindingList": []
                            }
                            var obj1 = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || "",
                                "OrganId": 2,
                                "FindingId": 0,
                                "FindingName": '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": false,
                                "SubFindingList": []
                            }
                            var List = [];
                            List = $filter("filter")($scope.AnteriorSegmentArrayNew, { "InvestigationId": subitem.InvestigationId }, true);
                            if (List.length == 0) {
                                if (subitem.InvestigationId == item.InvestigationId) {
                                    object.RemarksArray.push(obj);
                                    object.RemarksArray.push(obj1);
                                    $scope.AnteriorSegmentArrayNew.push(object);
                                }
                            } else {
                                angular.forEach(List, function (aitem) {
                                    var List1 = [];
                                    List1 = $filter("filter")(aitem.RemarksArray, { "OrganId": 1, "ActiveInd": "Y" }, true);
                                    if (List1.length == 0) {
                                        var obj = {
                                            "RemarksId": 0,
                                            "InvFindingId": item.InvFindingId || 0,
                                            "FindingValue": item.FindingValue || "",
                                            "OrganId": 1,
                                            "FindingId": 0,
                                            "FindingName": '',
                                            "DiagnosisRiskLevel": "",
                                            "ActiveInd": "Y",
                                            "Notes": "",
                                            "IsShowNotesTextBox": false,
                                            "SubFindingList": []
                                        }

                                        if (subitem.InvestigationId == item.InvestigationId) {
                                            aitem.RemarksArray.push(obj);
                                        }
                                    }
                                    var List2 = [];
                                    List2 = $filter("filter")(aitem.RemarksArray, { "OrganId": 2, "ActiveInd": "Y" }, true);
                                    if (List2.length == 0) {
                                        var obj1 = {
                                            "RemarksId": 0,
                                            "InvFindingId": item.InvFindingId || 0,
                                            "FindingValue": item.FindingValue || "",
                                            "OrganId": 2,
                                            "FindingId": 0,
                                            "FindingName": '',
                                            "DiagnosisRiskLevel": "",
                                            "ActiveInd": "Y",
                                            "Notes": "",
                                            "IsShowNotesTextBox": false,
                                            "SubFindingList": []
                                        }
                                        if (subitem.InvestigationId == item.InvestigationId) {
                                            aitem.RemarksArray.push(obj1);
                                        }
                                    }
                                });
                            }
                        });
                    });
                    $scope.newAnteriorObj.AnteriorSearchObj = "";
                    $scope.newAnteriorObj.OSAnteriorSearchObj = "";
                    $scope.cacheStorageItem.AnteriorIsNormal = true;
                }
                if (type === "AllPartsOfPS") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {

                            var object = {
                                "PatientFindingPosteriorId": 0,
                                "IsNormal": true,
                                "CategoryId": 6,
                                "CategoryDesc": "Posterior Segment",
                                "InvestigationId": subitem.InvestigationId || 0,
                                "InvestigationDesc": subitem.InvestigationDesc || "",
                                "ActiveInd": "Y",
                                "SelectedGlobalSearch": "",
                                "SelectedRightEye": 1,
                                "SelectedLeftEye": 0,
                                "RemarksArray": [],

                            };
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || "",
                                "OrganId": 1,
                                "FindingId": 0,
                                "FindingName": '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": false,
                                "SubFindingList": []
                            }
                            var obj1 = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || "",
                                "OrganId": 2,
                                "FindingId": 0,
                                "FindingName": '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": false,
                                "SubFindingList": []
                            }
                            var List = [];
                            List = $filter("filter")($scope.PoteriorSegmentArrayNew, { "InvestigationId": subitem.InvestigationId }, true);
                            if (List.length == 0) {
                                if (subitem.InvestigationId == item.InvestigationId) {
                                    object.RemarksArray.push(obj);
                                    object.RemarksArray.push(obj1);
                                    $scope.PoteriorSegmentArrayNew.push(object);
                                }
                            } else {
                                angular.forEach(List, function (aitem) {
                                    var List1 = [];
                                    List1 = $filter("filter")(aitem.RemarksArray, { "OrganId": 1, "ActiveInd": "Y" }, true);
                                    if (List1.length == 0) {
                                        var obj = {
                                            "RemarksId": 0,
                                            "InvFindingId": item.InvFindingId || 0,
                                            "FindingValue": item.FindingValue || "",
                                            "OrganId": 1,
                                            "FindingId": 0,
                                            "FindingName": '',
                                            "DiagnosisRiskLevel": "",
                                            "ActiveInd": "Y",
                                            "Notes": "",
                                            "IsShowNotesTextBox": false,
                                            "SubFindingList": []
                                        }

                                        if (subitem.InvestigationId == item.InvestigationId) {
                                            aitem.RemarksArray.push(obj);
                                        }
                                    }
                                    var List2 = [];
                                    List2 = $filter("filter")(aitem.RemarksArray, { "OrganId": 2, "ActiveInd": "Y" }, true);
                                    if (List2.length == 0) {
                                        var obj1 = {
                                            "RemarksId": 0,
                                            "InvFindingId": item.InvFindingId || 0,
                                            "FindingValue": item.FindingValue || "",
                                            "OrganId": 2,
                                            "FindingId": 0,
                                            "FindingName": '',
                                            "DiagnosisRiskLevel": "",
                                            "ActiveInd": "Y",
                                            "Notes": "",
                                            "IsShowNotesTextBox": false,
                                            "SubFindingList": []
                                        }
                                        if (subitem.InvestigationId == item.InvestigationId) {
                                            aitem.RemarksArray.push(obj1);
                                        }
                                    }
                                });
                            }
                        });
                    });
                    $scope.newAnteriorObj.AnteriorSearchObj = "";
                    $scope.newAnteriorObj.OSAnteriorSearchObj = "";
                    $scope.cacheStorageItem.PosteriorIsNormal = true;
                }
            } else {
                if (type === "AllPartsOfAS") {
                    //angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem, index) {
                    //    angular.forEach(subitem.RemarksArray, function (Mitem, index1) {
                    //        subitem.RemarksArray.splice(index1, 2);
                    //    });
                    //    if (Mitem.RemarksArray.length > 0) {
                    //        angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                    //            if (hitem.RemarksId === 0) {
                    //                Mitem.RemarksArray.splice(index, 2);
                    //            }
                    //            else{
                    //                hitem.ActiveInd = 'N';
                    //            }
                    //        });
                    //    }
                    //});
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                            if (Mitem.RemarksArray.length > 0) {
                                angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                    if (hitem.InvFindingId == item.InvFindingId) {
                                        if (hitem.RemarksId === 0) {
                                            Mitem.RemarksArray.splice(index, 2);
                                        }
                                        else {
                                            hitem.ActiveInd = 'N';
                                        }
                                    }
                                });
                            }
                        });
                    });
                    $scope.cacheStorageItem.AnteriorIsNormal = false;
                } else if (type === "AllPartsOfPS") {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                            if (Mitem.InvestigationId !== 32) {
                                if (Mitem.RemarksArray.length > 0) {
                                    angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                        if (hitem.InvFindingId == item.InvFindingId) {
                                            if (hitem.RemarksId === 0) {
                                                Mitem.RemarksArray.splice(index, 2);
                                            }
                                            else {
                                                hitem.ActiveInd = 'N';
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    });
                    $scope.cacheStorageItem.PosteriorIsNormal = false;
                }
            }

            $scope.AddToCache();

        }

        $scope.changePosteriorDPSSelectedEye = function (eye) {
            $scope.newPosteriorObj.PosteriorDPSSelectedEye = eye;
            $scope.CDRHorizantalList = GetPosteriorCDR();
            $scope.CDRVerticalList = GetPosteriorCDR();
            $scope.CDR_DPSList = GetPosteriorCDR();

            var horizantal = "";
            var vertical = "";
            var DPS = "";
            if ($scope.PoteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (pitem) {
                    if (pitem.InvestigationId == 32) {
                        if (eye == "OD") {
                            horizantal = pitem.RHorizontal;
                            vertical = pitem.RVertical;
                            DPS = pitem.RDPS;
                        } else if (eye == "OS") {
                            horizantal = pitem.LHorizontal;
                            vertical = pitem.LVertical;
                            DPS = pitem.LDPS;
                        }
                    }
                });
            }

            if (horizantal != undefined && horizantal != "") {
                var filter = $filter("filter")($scope.CDRHorizantalList, { "Value": horizantal }, true);
                if (filter.length > 0) {
                    filter[0].IsChecked = true;
                }
            }
            if (vertical != undefined && vertical != "") {
                var filter = $filter("filter")($scope.CDRVerticalList, { "Value": vertical }, true);
                if (filter.length > 0) {
                    filter[0].IsChecked = true;
                }
            }
            if (DPS != undefined && DPS != "") {
                var filter = $filter("filter")($scope.CDR_DPSList, { "Value": DPS }, true);
                if (filter.length > 0) {
                    filter[0].IsChecked = true;
                }
            }
        };
        $scope.ChangePosteriorCDR1 = function (array, item, inv, eye, valuetype) {
            angular.forEach(array, function (aitem) {
                aitem.IsChecked = false;
            });
            item.IsChecked = true;
            if ($scope.PoteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (pitem) {
                    if (pitem.InvestigationId == 32) {
                        if (eye == "OD") {
                            if (valuetype == 'HZ') {
                                pitem.RHorizontal = item.Value || "";
                                /*pitem.RVertical = item.Value || "";*/

                            } else if (valuetype == 'VT') {
                                pitem.RVertical = item.Value || "";
                                pitem.RHorizontal = item.Value || "";
                                if (pitem.RHorizontal != "") {
                                    angular.forEach($scope.CDRHorizantalList, function (caitem) {
                                        if (caitem.Value == pitem.RHorizontal) {
                                            caitem.IsChecked = true;
                                        } else {
                                            caitem.IsChecked = false;
                                        }
                                    });
                                }
                            } else {
                                pitem.RDPS = item.Value || "";
                            }
                        } else if (eye == "OS") {
                            if (valuetype == 'HZ') {
                                pitem.LHorizontal = item.Value || "";
                                /*pitem.LVertical = item.Value || "";*/

                            } else if (valuetype == 'VT') {
                                pitem.LVertical = item.Value || "";
                                pitem.LHorizontal = item.Value || "";
                                if (pitem.LHorizontal != "") {
                                    angular.forEach($scope.CDRHorizantalList, function (caitem) {
                                        if (caitem.Value == pitem.LHorizontal) {
                                            caitem.IsChecked = true;
                                        } else {
                                            caitem.IsChecked = false;
                                        }
                                    });
                                }
                            } else {
                                pitem.LDPS = item.Value || "";
                            }

                        }
                    }
                });
            }
        };
        $scope.CloseDrawingPad = function () {
            $scope.IsShowExaminationDrawingInd = false;
            $scope.closeTemplateView();
        };
        $scope.copyToGonioscopyOS = function (inv, remarks) {
            if ($scope.GonioscopyDetailsList.length > 0) {
                angular.forEach($scope.GonioscopyDetailsList, function (pitem) {
                    pitem.LeftEye.BottomValue = inv.BottomValue;
                    pitem.LeftEye.BottomValueObj = inv.BottomValueObj;
                    pitem.LeftEye.DepthBottomValue = inv.DepthBottomValue
                    pitem.LeftEye.DepthBottomValueObj = inv.DepthBottomValueObj;
                    pitem.LeftEye.RightValue = inv.RightValue
                    pitem.LeftEye.RightValueObj = inv.RightValueObj;
                    pitem.LeftEye.DepthRightValue = inv.DepthRightValue
                    pitem.LeftEye.DepthRightValueObj = inv.DepthRightValueObj;
                    pitem.LeftEye.DepthTopValue = inv.DepthTopValue
                    pitem.LeftEye.DepthTopValueObj = inv.DepthTopValueObj;
                    pitem.LeftEye.TopValue = inv.TopValue
                    pitem.LeftEye.TopValueObj = inv.TopValueObj;
                    pitem.LeftEye.DepthLeftValue = inv.DepthLeftValue
                    pitem.LeftEye.DepthLeftValueObj = inv.DepthLeftValueObj;
                    pitem.LeftEye.LeftValue = inv.LeftValue
                    pitem.LeftEye.LeftValueObj = inv.LeftValueObj;
                    pitem.LeftEye.PigmentValue = inv.PigmentValue
                    pitem.LeftEye.PossibleDiagnosisName = inv.PossibleDiagnosisName
                    pitem.LeftEye.PigmentValueObj = inv.PigmentValueObj;
                    pitem.LeftEye.PossibleDiagnosisId = inv.PossibleDiagnosisId;
                    pitem.LeftEye.ICD10CODE = inv.ICD10CODE;
                    pitem.LeftEyeRemarks = remarks;
                });
            }
        };
        $scope.copyToGonioscopyOD = function (inv, remarks) {
            if ($scope.GonioscopyDetailsList.length > 0) {
                angular.forEach($scope.GonioscopyDetailsList, function (pitem) {
                    pitem.RightEye.BottomValue = inv.BottomValue;
                    pitem.RightEye.BottomValueObj = inv.BottomValueObj;
                    pitem.RightEye.DepthBottomValue = inv.DepthBottomValue
                    pitem.RightEye.DepthBottomValueObj = inv.DepthBottomValueObj;
                    pitem.RightEye.RightValue = inv.RightValue
                    pitem.RightEye.RightValueObj = inv.RightValueObj;
                    pitem.RightEye.DepthRightValue = inv.DepthRightValue
                    pitem.RightEye.DepthRightValueObj = inv.DepthRightValueObj;
                    pitem.RightEye.DepthTopValue = inv.DepthTopValue
                    pitem.RightEye.DepthTopValueObj = inv.DepthTopValueObj;
                    pitem.RightEye.TopValue = inv.TopValue
                    pitem.RightEye.TopValueObj = inv.TopValueObj;
                    pitem.RightEye.DepthLeftValue = inv.DepthLeftValue
                    pitem.RightEye.DepthLeftValueObj = inv.DepthLeftValueObj;
                    pitem.RightEye.LeftValue = inv.LeftValue
                    pitem.RightEye.LeftValueObj = inv.LeftValueObj;
                    pitem.RightEye.PigmentValue = inv.PigmentValue
                    pitem.RightEye.PossibleDiagnosisName = inv.PossibleDiagnosisName
                    pitem.RightEye.PigmentValueObj = inv.PigmentValueObj;
                    pitem.RightEye.PossibleDiagnosisId = inv.PossibleDiagnosisId;
                    pitem.RightEye.ICD10CODE = inv.ICD10CODE;
                    pitem.RightEyeRemarks = remarks;
                });
            }
        };

        $scope.CopyCDRvalues = function (item, organ) {
            if (organ == 1) {
                item.RHorizontal = item.LHorizontal || '';
                item.RVertical = item.LVertical || '';
                item.RDPS = item.LDPS || '';
            }
            if (organ == 2) {
                item.LHorizontal = item.RHorizontal || '';
                item.LVertical = item.RVertical || '';
                item.LDPS = item.RDPS || '';
            }
        };

        $scope.PosteriorCDRvaluesCopy = function (organ, type) {
            angular.forEach($scope.PoteriorSegmentArrayNew, function (item) {
                if (item.InvestigationId == 32) {
                    if (type == 1) {
                        item.RHorizontal = item.RHorizontal || '';
                        item.RVertical = item.RVertical || '';
                        item.RDPS = item.RDPS || '';
                        if (item.RHorizontal != '' && item.RVertical != '' && item.RDPS != '') {
                            item.LHorizontal = item.RHorizontal || '';
                            item.LVertical = item.RVertical || '';
                            item.LDPS = item.RDPS || '';
                        }
                        //else if ((item.RHorizontal == '' || item.RHorizontal == null) && (item.RVertical == '' || item.RVertical == null) && (item.RDPS == '' || item.RDPS==null)) {
                        //    item.RHorizontal =  '';
                        //    item.RVertical = '';
                        //    item.RDPS =  '';
                        //}
                        else {
                            if (item.RHorizontal != '') {
                                item.LHorizontal = item.RHorizontal || '';
                            }
                            if (item.RVertical != '') {
                                item.LVertical = item.RVertical || '';
                            }
                            if (item.RDPS != '') {
                                item.LDPS = item.RDPS || '';
                            }
                        }
                    }
                    if (type == 2) {
                        item.LHorizontal = item.LHorizontal || '';
                        item.LVertical = item.LVertical || '';
                        item.LDPS = item.LDPS || '';
                        if (item.LHorizontal != '' && item.LVertical != '' && item.LDPS != '') {
                            item.RHorizontal = item.LHorizontal || '';
                            item.RVertical = item.LVertical || '';
                            item.RDPS = item.LDPS || '';
                        }
                        //else if ((item.LHorizontal == '' || item.LHorizontal == null) && (item.LVertical == '' || item.LVertical == null) && (item.LDPS == '' || item.LDPS == null)) {
                        //    item.LHorizontal = '';
                        //    item.LVertical = '';
                        //    item.LDPS = '';
                        //}
                        else {
                            if (item.LHorizontal != '') {
                                item.RHorizontal = item.LHorizontal || '';
                            }
                            if (item.LVertical != '') {
                                item.RVertical = item.LVertical || '';
                            }
                            if (item.LDPS != '') {
                                item.RDPS = item.LDPS || '';
                            }
                        }
                    }
                }
            });
        };
        $scope.$watch("cacheStorageItem.ColorVisionDetails", function (newVal, oldVal) {
            if ($scope.cacheStorageItem.ColorVisionDetails === undefined) { return; }
            $scope.cacheStorageItem.ColorVisionDetails = $scope.cacheStorageItem.ColorVisionDetails || [];
            if ($scope.cacheStorageItem.ColorVisionDetails.length > 0) {
                angular.forEach($scope.cacheStorageItem.ColorVisionDetails, function (item) {
                    //if (item.ActiveInd === 'Y') {
                    //    item.IsInvDataAdded = true;
                    //}
                    item.IsInvDataAdded = false;
                    if (item.ActiveInd === 'N') {
                        item.IsInvDataAdded = true;
                    }

                    if (item.InvestigationId === 14) {
                        if (item.RightEyeRemarks != '' || item.LeftEyeRemarks != '' || item.RS3Url != '' || item.LS3Url != '') {
                            item.ActiveInd = 'Y'
                        }
                    }

                    if (item.InvestigationId === 15) {
                        if (item.RightEyeRemarks != '' || item.LeftEyeRemarks != '' || item.RS3Url != '' || item.LS3Url != '') {
                            item.ActiveInd = 'Y'
                        }
                    }

                    if (item.InvestigationId === 16) {
                        if (item.RightEyeRemarks != '' || item.LeftEyeRemarks != '' || item.RS3Url != '' || item.LS3Url != '') {
                            item.ActiveInd = 'Y'
                        }
                    }

                    if (item.InvestigationId === 17) {
                        if (item.RightEyeRemarks != '' || item.LeftEyeRemarks != '' || item.RS3Url != '' || item.LS3Url != '') {
                            item.ActiveInd = 'Y'
                        }
                    }

                    if (item.ActiveInd === 'Y') {
                        if (item.RightEyeRemarks != '' || item.LeftEyeRemarks != '' || item.RS3Url != '' || item.LS3Url != '') {
                            item.IsInvDataAdded = true;
                        }
                    }
                });
            }

        }, true);


        $scope.$watch("cacheStorageItem.DryEyeEvaluationData", function (newVal, oldVal) {

            if ($scope.cacheStorageItem.DryEyeEvaluationData === undefined) { return; }
            angular.forEach($scope.cacheStorageItem.DryEyeEvaluationData, function (item) {
                item.IsInvDataAdded = false;
                if (item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;
                }

                if (item.InvestigationId === 2079) {
                    if (item.ODValue2 != '' || item.ODvalue3 != '' || item.OSValue2 != '' || item.OSvalue3 != '' || item.Remarks != '' || item.ODValue21 != '' || item.ODvalue31 != '' || item.OSValue21 != '' || item.OSvalue31 != '') {
                        item.ActiveInd = 'Y'
                    }

                }

                if (item.InvestigationId === 2166) {
                    if (item.Remarks != '' || item.ODValue1 != '' || item.OSValue1 != '') {
                        item.ActiveInd = 'Y'
                    }

                }

                if (item.InvestigationId === 2082) {
                    if (item.Remarks != '' || item.ODValue1 != '' || item.OSValue1 != '') {
                        item.ActiveInd = 'Y'
                    }

                }

                if (item.InvestigationId === 2103) {
                    if (item.Remarks != '' || item.ODValue2 != '' || item.OSValue2 != '') {
                        item.ActiveInd = 'Y'
                    }

                }


                if (item.ActiveInd === 'Y') {
                    if (item.InvestigationId === 2079) {
                        if (item.ODValue2 != '' || item.ODvalue3 != '' || item.OSValue2 != '' || item.OSvalue3 != '' || item.Remarks != '' || item.ODValue21 != '' || item.ODvalue31 != '' || item.OSValue21 != '' || item.OSvalue31 != '') {
                            item.IsInvDataAdded = true;
                        }
                    } else {
                        if (item.ODValue1 != '' || item.ODValue2 != '' || item.ODvalue3 != '' || item.OSValue1 != '' || item.OSValue2 != '' || item.OSvalue3 != '' || item.Remarks != '') {
                            item.IsInvDataAdded = true;
                        }
                    }
                }
            });
        }, true);

        $scope.$watch("cacheStorageItem.ConfrontationalFieldArray", function (newVal, oldVal) {

            if ($scope.cacheStorageItem.ConfrontationalFieldArray === undefined) { return; }
            angular.forEach($scope.cacheStorageItem.ConfrontationalFieldArray, function (item) {
                item.IsInvDataAdded = false;
                if (item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;
                }
                if (item.ActiveInd === 'Y') {
                    if (item.RightEyeRemarks != "" || item.LeftEyeRemarks != "" || item.RDrawList.length > 0 || item.LDrawList.length > 0 ||
                        item.FRightEyeRemarks != "" || item.FLeftEyeRemarks != "" || item.FRDrawList.length > 0 || item.FLDrawList.length > 0) {
                        item.IsInvDataAdded = true;
                    }
                    var List = [];
                    var List1 = [];
                    if (item.FRDrawList.length > 0) {
                        List = $filter("filter")(item.FRDrawList, { "IsChecked": true }, true) || [];
                    }
                    if (item.FLDrawList.length > 0) {
                        List1 = $filter("filter")(item.FLDrawList, { "IsChecked": true }, true) || [];
                    }
                    if (List.length > 0 || List1.length > 0 || item.FRightEyeRemarks !== '' || item.FLeftEyeRemarks !== '') {
                        item.IsfourFieldDataAdded = true;
                    } else {
                        item.IsfourFieldDataAdded = false;
                    }
                    var List2 = [];
                    var List3 = [];
                    if (item.RDrawList.length > 0) {
                        var List2 = $filter("filter")(item.RDrawList, { "IsChecked": true }, true) || [];
                    }
                    if (item.LDrawList.length > 0) {
                        List3 = $filter("filter")(item.LDrawList, { "IsChecked": true }, true) || [];

                    }
                    if (List2.length > 0 || List3.length > 0 || item.RightEyeRemarks !== '' || item.LeftEyeRemarks !== '') {
                        item.IseightyFieldDataAdded = true;
                    } else {
                        item.IseightyFieldDataAdded = false;
                    }
                }
            });
        }, true);



        $scope.$watch("cacheStorageItem.LacrimalPatiencyDetails", function (newVal, oldVal) {

            if ($scope.cacheStorageItem.LacrimalPatiencyDetails === undefined) { return; }
            angular.forEach($scope.cacheStorageItem.LacrimalPatiencyDetails, function (item) {
                item.IsInvDataAdded = false;
                if (item.PatientFindingLacrimalPatiencyId != 0 && item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;
                }

                if (item.InvestigationId === 2091 || item.InvestigationId === 2092 || item.InvestigationId === 2093 || item.InvestigationId === 2094) {
                    if (item.Remarks != "" || item.LeftEyeRemarks != "") {
                        item.ActiveInd = 'Y';
                    }
                }

                if (item.ActiveInd === 'Y') {
                    if (item.Remarks != "" || item.LeftEyeRemarks != "") {
                        item.IsInvDataAdded = true;
                    }
                }
            });
        }, true);



        $scope.$watch("cacheStorageItem.HertelsExaminationArray", function (newVal, oldVal) {
            if ($scope.cacheStorageItem.HertelsExaminationArray === undefined) { return; }
            angular.forEach($scope.cacheStorageItem.HertelsExaminationArray, function (item) {
                item.IsInvDataAdded = false;
                if (item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;
                }

                if (item.InvestigationId === 2159) {
                    if (item.RightEyeRemarks != "" || item.LeftEyeRemarks != "" || item.BaseValue != "") {
                        item.ActiveInd = 'Y';
                    }
                }
                if (item.ActiveInd === 'Y') {
                    if (item.RightEyeRemarks != "" || item.LeftEyeRemarks != "" || item.BaseValue != "") {
                        item.IsInvDataAdded = true;

                    }
                }
            });
        }, true);




        $scope.$watch("cacheStorageItem.NewAmslerGridArray", function (newVal, oldVal) {

            if ($scope.cacheStorageItem.NewAmslerGridArray === undefined) { return; }
            angular.forEach($scope.cacheStorageItem.NewAmslerGridArray, function (item) {
                item.IsInvDataAdded = false;

                if (item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;
                }

                if (item.ActiveInd === 'Y') {
                    if (item.RightEyeRemarks != "" || item.LeftEyeRemarks != "" || item.RDrawList.length > 0 || item.LDrawList.length > 0) {
                        item.IsInvDataAdded = true;
                    }
                }

                //if (item.ActiveInd === 'Y') {
                //    if (item.RightEyeRemarks != "" || item.LeftEyeRemarks != "" || item.RS3Url != "" || item.LS3Url != "" || item.RDrawList.length > 0 || item.LDrawList.length > 0 || item.RightEyeId != ""|| item.LeftEyeId != "") {
                //        item.IsInvDataAdded = true;
                //        $scope.Accordionobj.IsShowExaminationData = true;
                //    }
                //}
                var List = [];
                var List1 = [];
                if (item.RDrawList.length > 0) {
                    List = $filter("filter")(item.RDrawList, { "IsChecked": true }, true) || [];
                }
                if (item.LDrawList.length > 0) {
                    List1 = $filter("filter")(item.LDrawList, { "IsChecked": true }, true) || [];
                }
                if (item.RightEyeRemarks != "" || item.LeftEyeRemarks != "" || item.RS3Url != "" || item.LS3Url != "" || List.length > 0 || List1.length > 0 || item.RightEyeId != "" || item.LeftEyeId != "") {
                    item.IsInvDataAdded = true;

                }
            });
        }, true);



        $scope.$watch("GonioscopyDetailsList", function (newVal, oldVal) {

            if ($scope.GonioscopyDetailsList === undefined) { return; }
            angular.forEach($scope.GonioscopyDetailsList, function (item) {
                item.IsInvDataAdded = false;
                if (item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;

                }

                if (item.InvestigationId === 2127) {
                    if (item.RightEye.RightValue != '' || item.RightEye.LeftValue != '' || item.RightEye.TopValue != '' || item.RightEye.BottomValue != '' || item.RightEye.PigmentValue != '' || item.RightEyeRemarks != '' || item.RightEye.DepthRightValue != '' || item.RightEye.DepthLeftValue != '' || item.RightEye.DepthTopValue != '' || item.RightEye.DepthBottomValue != '' ||
                        item.LeftEye.RightValue != '' || item.LeftEye.LeftValue != '' || item.LeftEye.TopValue != '' || item.LeftEye.BottomValue != '' || item.LeftEye.PigmentValue != '' || item.LeftEyeRemarks != '' || item.InvestigationOrgans.length > 0 || item.LeftEye.DepthRightValue != '' || item.LeftEye.DepthLeftValue != '' || item.LeftEye.DepthTopValue != '' || item.LeftEye.DepthBottomValue != '') {
                        item.ActiveInd = 'Y';
                    }
                }
              
                if (item.ActiveInd === 'Y') {
                    if (item.RightEye.RightValue != '' || item.RightEye.LeftValue != '' || item.RightEye.TopValue != '' || item.RightEye.BottomValue != '' || item.RightEye.PigmentValue != '' || item.RightEyeRemarks != '' || item.RightEye.DepthRightValue != '' || item.RightEye.DepthLeftValue != '' || item.RightEye.DepthTopValue != '' || item.RightEye.DepthBottomValue != '' ||
                        item.LeftEye.RightValue != '' || item.LeftEye.LeftValue != '' || item.LeftEye.TopValue != '' || item.LeftEye.BottomValue != '' || item.LeftEye.PigmentValue != '' || item.LeftEyeRemarks != '' || item.InvestigationOrgans.length > 0 || item.LeftEye.DepthRightValue != '' || item.LeftEye.DepthLeftValue != '' || item.LeftEye.DepthTopValue != '' || item.LeftEye.DepthBottomValue != '') {
                        item.IsInvDataAdded = true;
                        if (item.RightEye.RightValue == 'Normal' && item.RightEye.LeftValue == 'Normal' && item.RightEye.TopValue == 'Normal' && item.RightEye.BottomValue == 'Normal' && item.RightEye.PigmentValue == 'Normal' && item.RightEye.DepthRightValue == '4' && item.RightEye.DepthLeftValue == '4' && item.RightEye.DepthTopValue == '4' && item.RightEye.DepthBottomValue == '4') {
                            $scope.GonioscopyNormal.GonioscopyODNormal = true;
                        } else {
                            $scope.GonioscopyNormal.GonioscopyODNormal = false;
                        } 
                        if (item.LeftEye.RightValue == 'Normal' && item.LeftEye.LeftValue == 'Normal' && item.LeftEye.TopValue == 'Normal' && item.LeftEye.BottomValue == 'Normal' && item.LeftEye.PigmentValue == 'Normal' && item.LeftEye.DepthRightValue == '4' && item.LeftEye.DepthLeftValue == '4' && item.LeftEye.DepthTopValue == '4' && item.LeftEye.DepthBottomValue == '4') {
                            /* item.IsInvDataAdded = true;*/
                            $scope.GonioscopyNormal.GonioscopyOSNormal = true;

                        } else {
                            $scope.GonioscopyNormal.GonioscopyOSNormal = false;
                        }
                    }

                }
            });
        }, true);




        $scope.$watch("cacheStorageItem.ExternalExaminationDetails", function (newVal, oldVal) {
            $scope.cacheStorageItem.ExternalExamImagesArray = [];
            if ($scope.cacheStorageItem.ExternalExaminationDetails === undefined) { return; }
            angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (item) {
                item.IsInvDataAdded = false;
                if (item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;
                }
                if (item.ActiveInd === 'Y') {
                    if (item.RightEye.RemarksArray.length > 0 || item.LeftEye.RemarksArray.length > 0 || item.RightEye.ImagesArray.length > 0 || item.LeftEye.ImagesArray.length > 0 || item.RightEye.CdRatio != "" || item.LeftEye.CdRatio != "" || item.RightEye.Frequency != "" || item.LeftEye.Frequency != "" || item.SelectedRightEyeRemarksObj !== "" || item.SelectedLeftEyeRemarksObj !== "" ||
                        item.BothEye.RemarksArray.length > 0 || item.BothEye.ImagesArray.length > 0 || item.BothEye.CdRatio != "" || item.BothEye.Frequency != "" || item.SelectedBothEyeRemarksObj !== "")
                        item.IsInvDataAdded = true;
                }

                if (item.RightEye.ImagesArray.length > 0) {

                    angular.forEach(item.RightEye.ImagesArray, function (imgitem) {
                        var nobject = {
                            "InvestigationName": item.InvestigationDesc,
                            "OrganName": "OD",
                            "Imgdata": imgitem
                        };
                        $scope.cacheStorageItem.ExternalExamImagesArray.push(nobject);
                    });

                }

                if (item.LeftEye.ImagesArray.length > 0) {

                    angular.forEach(item.LeftEye.ImagesArray, function (imgitem) {
                        var nobject = {
                            "InvestigationName": item.InvestigationDesc,
                            "OrganName": "OS",
                            "Imgdata": imgitem
                        };
                        $scope.cacheStorageItem.ExternalExamImagesArray.push(nobject);
                    });

                }

                if (item.BothEye.ImagesArray.length > 0) {

                    angular.forEach(item.BothEye.ImagesArray, function (imgitem) {
                        var nobject = {
                            "InvestigationName": item.InvestigationDesc,
                            "OrganName": "OU",
                            "Imgdata": imgitem
                        };
                        $scope.cacheStorageItem.ExternalExamImagesArray.push(nobject);
                    });

                }
            });
            if ($scope.cacheStorageItem.ExternalExamImagesArray.length > 0) {
                $scope.ExternalExamImagesArrayChangedCount++;
            }

        }, true);



        $scope.$watch("MotorExaminationObj.NearInvestigationdetails", function (newVal, oldVal) {

            if ($scope.MotorExaminationObj.NearInvestigationdetails === undefined) { return; }
            angular.forEach($scope.MotorExaminationObj.NearInvestigationdetails, function (item) {
                item.IsInvDataAdded = false;
                if (item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;
                }

                if (item.InvestigationId === 815) {
                    if (item.BlurOUValue != "" || item.BreakOUValue != "" || item.RecoveryOUValue != "" || item.Remarks != "") {
                        item.ActiveInd = 'Y'
                    }
                }

                if (item.InvestigationId === 2122) {
                    if (item.BlurODValue != "" || item.BreakODValue != "" || item.RecoveryODValue != "" || item.Remarks != "" || item.BlurOSValue != "" || item.BreakOSValue != "" || item.RecoveryOSValue != "" || item.BlurOUValue != "" ||
                        item.BreakOUValue != "" || item.RecoveryOUValue != "") {
                        item.ActiveInd = 'Y'
                    }
                }

                if (item.InvestigationId === 2123) {
                    //if (item.ODNegitiveValue != "" || item.ODPositiveValue != "" || item.OSNegitiveValue != "" || item.OSPositiveValue != "" || item.Remarks != "") {
                    //    item.ActiveInd = 'Y'
                    //}
                    if (item.ODNegativeDistaceValue != "" || item.ODNegativeNearValue != "" || item.ODPositiveDistaceValue != "" || item.ODPositiveNearValue != "" || item.OSNegativeDistaceValue != "" || item.OSNegativeNearValue != "" || item.OSPositiveDistaceValue != "" || item.OSPositiveNearValue != "" || item.Remarks != "") {
                        item.ActiveInd = 'Y'
                    }
                }

                if (item.InvestigationId === 2124) {
                    //if (item.ODNegitiveValue != "" || item.ODPositiveValue != "" || item.OSNegitiveValue != "" || item.OSPositiveValue != "" || item.Remarks != "") {
                    //    item.ActiveInd = 'Y'
                    //}
                    if (item.ODNegativeDistaceValue != "" || item.ODNegativeNearValue != "" || item.ODPositiveDistaceValue != "" || item.ODPositiveNearValue != "" || item.OSNegativeDistaceValue != "" || item.OSNegativeNearValue != "" || item.OSPositiveDistaceValue != "" || item.OSPositiveNearValue != "" || item.Remarks != "") {
                        item.ActiveInd = 'Y'
                    }
                }

                if (item.ActiveInd === 'Y') {
                    if (item.InvestigationId === 815) {
                        if (item.BlurOUValue != "" || item.BreakOUValue != "" || item.RecoveryOUValue != "" || item.Remarks != "") {
                            item.IsInvDataAdded = true;
                        }
                    }
                    if (item.InvestigationId === 2122) {
                        if (item.BlurODValue != "" || item.BreakODValue != "" || item.RecoveryODValue != "" || item.Remarks != "" || item.BlurOSValue != "" || item.BreakOSValue != "" || item.RecoveryOSValue != "") {
                            item.IsInvDataAdded = true;
                        }
                    }

                    if (item.InvestigationId === 2123) {
                        //if (item.ODNegitiveValue != "" || item.ODPositiveValue != "" || item.OSNegitiveValue != "" || item.OSPositiveValue != "" || item.Remarks != "") {
                        //    item.IsInvDataAdded = true;
                        //}
                        if (item.ODNegativeDistaceValue != "" || item.ODNegativeNearValue != "" || item.ODPositiveDistaceValue != "" || item.ODPositiveNearValue != "" || item.OSNegativeDistaceValue != "" || item.OSNegativeNearValue != "" || item.OSPositiveDistaceValue != "" || item.OSPositiveNearValue != "" || item.Remarks != "") {
                            item.IsInvDataAdded = true;
                        }
                    }
                    if (item.InvestigationId === 2124) {
                        //if (item.ODNegitiveValue != "" || item.ODPositiveValue != "" || item.OSNegitiveValue != "" || item.OSPositiveValue != "" || item.Remarks != "") {
                        //    item.IsInvDataAdded = true;
                        //}
                        if (item.ODNegativeDistaceValue != "" || item.ODNegativeNearValue != "" || item.ODPositiveDistaceValue != "" || item.ODPositiveNearValue != "" || item.OSNegativeDistaceValue != "" || item.OSNegativeNearValue != "" || item.OSPositiveDistaceValue != "" || item.OSPositiveNearValue != "" || item.Remarks != "") {
                            item.IsInvDataAdded = true;
                        }
                    }

                }


            });
        }, true);


        $scope.$watch("MotorExaminationObj.HeadPosterDetails", function (newVal, oldVal) {

            if ($scope.MotorExaminationObj.HeadPosterDetails === undefined) { return; }
            angular.forEach($scope.MotorExaminationObj.HeadPosterDetails, function (item) {
                item.IsInvDataAdded = false;
                if (item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;

                }

                if (item.InvestigationId === 698) {
                    if (item.HeadTiltValue != "" || item.FaceTurnValue != "" || item.ChinElevationValue != "" || item.ChinDepressionValue != "" || item.Remarks != "") {
                        item.ActiveInd = 'Y';
                    }
                }
                if (item.ActiveInd === 'Y') {
                    //if (item.RHeadTiltValue != "" || item.RFaceTurnValue != "" || item.ChinElevationValue != "" || item.ChinDepressionValue != "" || item.LHeadTiltValue != "" || item.LFaceTurnValue != "") {
                    //    item.IsInvDataAdded = true;
                    //}
                    if (item.HeadTiltValue != "" || item.FaceTurnValue != "" || item.ChinElevationValue != "" || item.ChinDepressionValue != "" || item.Remarks != "") {
                        item.IsInvDataAdded = true;
                    }
                }


            });
        }, true);




        $scope.$watch("MotorExaminationObj.SquintDetails", function (newVal, oldVal) {

            if ($scope.MotorExaminationObj.SquintDetails === undefined) { return; }
            angular.forEach($scope.MotorExaminationObj.SquintDetails, function (item) {
                item.IsInvDataAdded = false;
                if (item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;
                }

                if (item.InvestigationId === 2095) {
                    if (item.InvestigationOrgans.length > 0) {
                        item.ActiveInd = 'Y';
                    }
                }

                if (item.InvestigationId === 64) {
                    if (item.DistanceValue !== '' || item.NearValue !== '') {
                        item.ActiveInd = 'Y';
                    }
                }

                if (item.InvestigationId === 697) {
                    if (item.RightEye.Name != "" || item.RightEye.DegreeValue != "" || item.LeftEye.Name != "" || item.LeftEye.DegreeValue != "") {
                        item.ActiveInd = 'Y';
                    }
                }

                if (item.InvestigationId === 699) {
                    if (item.DistanceValue !== '' || item.NearValue !== '' || item.DistanceTypeOfSquintId !== 0 || item.DistanceTypeOfSquintValue !== '' || item.DistanceFixationPreference !== ''
                        || item.NearTypeOfSquintId !== 0 || item.NearTypeOfSquintValue !== '' || item.NearFixationPreference !== '') {
                        item.ActiveInd = 'Y';
                    }

                }

                if (item.InvestigationId === 701) {
                    if (item.Fly !== "" || item.Animals !== "" || item.Circles !== "" || item.RandotCircles !== "" || item.DistVectograph !== "" || item.DistStereo !== "" || item.Frisby !== "" || item.Lang !== "") {
                        item.ActiveInd = 'Y';
                    }
                }

                if (item.InvestigationId === 721) {
                    if (item.Nystagmus !== '') {
                        item.ActiveInd = 'Y';
                    }
                }


                if (item.ActiveInd === 'Y') {

                    if (item.InvestigationId === 700) {
                        if (item.TypeOfSquint.RightEye.length > 0 || item.TypeOfSquint.LeftEye.length > 0) {
                            item.IsInvDataAdded = true;
                        }
                    }
                    if (item.InvestigationId === 696 || item.InvestigationId === 701) {
                        if (item.Remarks != "") {
                            item.IsInvDataAdded = true;
                        }
                    }
                    if (item.InvestigationId === 701) {
                        if (item.Fly !== "" || item.Animals !== "" || item.Circles !== "" || item.RandotCircles !== "" || item.DistVectograph !== "" || item.DistStereo !== "" || item.Frisby !== "" || item.Lang !== "") {
                            item.IsInvDataAdded = true;
                        }
                    }
                    if (item.InvestigationId === 2095) {
                        if (item.InvestigationOrgans.length > 0) {
                            item.IsInvDataAdded = true;
                        }
                    }
                    if (item.InvestigationId === 697) {
                        if (item.RightEye.Name != "" || item.RightEye.DegreeValue != "" || item.LeftEye.Name != "" || item.LeftEye.DegreeValue != "") {
                            item.IsInvDataAdded = true;
                        }
                    }
                    if (item.InvestigationId === 699) {
                        if (item.DistanceValue !== '' || item.NearValue !== '' || item.DistanceTypeOfSquintId !== 0 || item.DistanceTypeOfSquintValue !== '' || item.DistanceFixationPreference !== ''
                            || item.NearTypeOfSquintId !== 0 || item.NearTypeOfSquintValue !== '' || item.NearFixationPreference !== '') {
                            item.IsInvDataAdded = true;
                        }

                    }
                    if (item.InvestigationId === 719) {
                        if (item.PrismCoverDetailsArray.length > 0) {
                            angular.forEach(item.PrismCoverDetailsArray, function (subitem) {
                                subitem.IsInvDataAdded = false;
                                if (subitem.IsDistanceChecked !== false || subitem.IsNearChecked !== false || subitem.Distance.DistanceRPrismValue != "" || subitem.Distance.DistanceLPrismValue != "" || subitem.Distance.DistanceRTypeOfSquintId != 0 || subitem.Distance.DistanceRTypeOfSquintValue != "" ||
                                    subitem.Distance.DistanceLTypeOfSquintId != 0 || subitem.Distance.DistanceLTypeOfSquintValue != "" || subitem.Distance.DistanceRFixationPreference != "" || subitem.Distance.DistanceLFixationPreference != "" || subitem.Near.NearRPrismValue != "" || subitem.Near.NearLPrismValue != "" || subitem.Near.NearRTypeOfSquintId != 0 || subitem.Near.NearRTypeOfSquintValue != "" ||
                                    subitem.Near.NearLTypeOfSquintId != 0 || subitem.Near.NearLTypeOfSquintValue != "" || subitem.Near.NearRFixationPreference != "" || subitem.Near.NearLFixationPreference != "") {
                                    subitem.IsInvDataAdded = true;
                                    item.IsInvDataAdded = true;
                                }
                            });
                        }

                    }
                    if (item.InvestigationId === 721) {
                        if (item.Nystagmus !== '') {
                            item.IsInvDataAdded = true;
                        }
                    }
                    if (item.InvestigationId === 64) {
                        if (item.DistanceValue !== '' || item.NearValue !== '') {
                            item.IsInvDataAdded = true;
                        }
                    }

                }


            });
        }, true);



        $scope.$watch("MotorExaminationObj.NineGazeExtraOcularDetails", function (newVal, oldVal) {

            if ($scope.MotorExaminationObj.NineGazeExtraOcularDetails === undefined) { return; }
            angular.forEach($scope.MotorExaminationObj.NineGazeExtraOcularDetails, function (item) {
                item.IsInvDataAdded = false;
                if (item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;

                }

                if (item.InvestigationId === 18) {
                    if (item.RsrValue != "" || item.RIoValue != "" || item.RLrValue != "" || item.RPgValue != "" || item.RMrValue != "" || item.RIrValue != "" || item.RIrSoValue != "" || item.RSoValue != "" || item.LIoValue != "" || item.LSrValue != "" || item.LMrValue != "" || item.LPgValue != "" || item.LLrValue != "" || item.LSoValue != "" || item.LIrValue != "" || item.LRemarks != "" || item.RRemarks != "") {
                        item.ActiveInd = 'Y'
                    }
                }

             
                if (item.InvestigationId === 695) {
                    if (item.RsrValue != "" || item.RsrIoValue != "" || item.RIoValue != "" || item.RLrValue != "" || item.RPgValue != "" || item.RMrValue != "" || item.RMrValue != "" || item.RIrValue != "" || item.RIrSoValue != "" || item.RSoValue != "" || item.LIoValue != "" || item.LIoSrValue != "" || item.LSrValue != "" || item.LMrValue != "" || item.LPgValue != "" || item.LLrValue != "" || item.LSoValue != "" || item.LSoIrValue != "" || item.LIrValue != "" || item.LRemarks != "" || item.RRemarks != "" || item.AlphabetPattern !="") {
                        item.ActiveInd = 'Y'
                    }
                }
                if (item.ActiveInd === 'Y') {
                    if (item.InvestigationId === 695) {
                        item.AlphaPatternInd = false;
                        if (item.RsrValue != "" || item.RsrIoValue != "" || item.RIoValue != "" || item.RLrValue != "" || item.RPgValue != "" || item.RMrValue != "" || item.RIrValue != "" || item.RIrSoValue != "" || item.RSoValue != "" || item.LIoValue != "" || item.LIoSrValue != "" || item.LSrValue != "" || item.LMrValue != "" || item.LPgValue != "" || item.LLrValue != "" || item.LSoValue != "" || item.LSoIrValue != "" || item.LIrValue != "" || item.LRemarks != "" || item.RRemarks != "" || item.AlphabetPattern != "") {
                            item.IsInvDataAdded = true;
                        }
                        if (item.AlphabetPattern != "") {
                            item.IsInvDataAdded = true;
                            item.AlphaPatternInd = true;
                        }
                    }


                    if (item.InvestigationId === 18) {
                         item.ExtraOcularInd = false;
                        //item.AlphaPatternInd = false;
                        if (item.RsrValue != "" || item.RIoValue != "" || item.RLrValue != "" || item.RPgValue != "" || item.RMrValue != "" || item.RIrValue != "" || item.RIrSoValue != "" || item.RSoValue != "" || item.LIoValue != "" || item.LSrValue != "" || item.LMrValue != "" || item.LPgValue != "" || item.LLrValue != "" || item.LSoValue != "" || item.LIrValue != "" || item.LRemarks != "" || item.RRemarks != "") {
                            item.IsInvDataAdded = true;
                            item.ExtraOcularInd = true;
                        }
                        //if (item.AlphabetPattern != "") {
                        //    item.IsInvDataAdded = true;
                        //    item.AlphaPatternInd = true;
                        //}
                    }
                    if (item.InvestigationId === 2096) {
                        if (item.DistanceRemarks != "" || item.NearRemarks != "") {
                            item.IsInvDataAdded = true;
                        }
                    }
                }
            });
        }, true);

        $scope.isAnteriorPopoverOpen = false;
        $scope.isPosteriorPopoverOpen = false;
        $scope.togglePopover = function (type) {
            //if (type === 'Anterior') {
            //    $scope.IsAnteriorPopoverOpen = true;
            //    $scope.subexaminationtab = 1;
            //}
            //if (type === 'Posterior') {
            //    $scope.isPosteriorPopoverOpen = true;
            //    $scope.subexaminationtab = 2;
            //}
            $scope.ExamAnteriorPosteriorObject.IsAnteriorTemplatePopover = true;
        };
        $scope.AddExamTemplatePopover = {
            templateUrl: 'ExaminactionTemplateSavePopover.html',
        };

        $scope.IsShowExaminationDrawingInd = false;
        $scope.IsShowExaminactionTemplateData = false;
        $scope.ClickValuesTab = function () {
            $scope.IsShowExaminationDrawingInd = false;
            $scope.IsShowExaminactionTemplateData = false;
        };

        $scope.ExaminactionTemplateClick = function () {
            /*$scope.IsShowExaminactionTemplateData = true;*/

            angular.forEach($scope.AnteriorTemplatesArray, function (subitem) {
                subitem.IsChecked = false;
            });
            angular.forEach($scope.PosteriorTemplatesArray, function (subitem) {
                subitem.IsChecked = false;
            });
            if ($scope.subexaminationtab == 1) {
                var TempExamTemplateArray = $scope.AnteriorTemplatesArray || [];
            } else if ($scope.subexaminationtab == 2) {
                var TempExamTemplateArray = $scope.PosteriorTemplatesArray || [];
            }

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/ExaminactionTemplatepopup.html",
                "keyboard": false,
                "backdrop": "static",
                "scope": $scope,
                "resolve": {
                    "TempExamTemplateArray": function () { return TempExamTemplateArray },
                    "subexaminationtab": function () { return $scope.subexaminationtab },
                },

                "windowClass": "templateschiefcomplaints overflow-hidden",
                "controller": function ($scope, $uibModal, $uibModalInstance, TempExamTemplateArray, subexaminationtab) {
                    /*$scope.selectedTemplateCheckbox = false;*/
                    $scope.TempExamTemplateArray = TempExamTemplateArray || [];
                    $scope.subexaminationtab = subexaminationtab || 0;

                    $scope.ChangeTemplate = function (item) {

                    }

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.ChangesTempData = function (item) {
                        if ($scope.subexaminationtab == 1) {
                            if (item.IsChecked) {
                                // alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Added data will be cleared. Do you still want to continue? </h4>", function () {
                                if (item != null) {
                                    angular.forEach($scope.TempExamTemplateArray, function (subitem) {
                                        subitem.IsChecked = false;
                                    });
                                    item.IsChecked = true;
                                    item.AnteriorArray = item.AnteriorArray || [];
                                    if ($scope.AnteriorSegmentArrayNew.length > 0) {
                                        angular.forEach($scope.AnteriorSegmentArrayNew, function (Citem) {
                                            if (Citem.RemarksArray.length > 0) {
                                                angular.forEach(Citem.RemarksArray, function (hitem, index) {
                                                    if (hitem.RemarksId === 0) {
                                                        Citem.RemarksArray.splice(index, 2);
                                                    }
                                                    else {
                                                        hitem.ActiveInd = 'N';
                                                    }
                                                });
                                            }
                                        });
                                    }

                                    angular.forEach(item.AnteriorArray, function (Aitem) {
                                        var object = {
                                            "PatientFindingAnteriorId": 0,
                                            "IsNormal": false,
                                            "CategoryId": Aitem.CategoryId || 5,
                                            "CategoryDesc": Aitem.CategoryName || "Anterior Segment",
                                            "InvestigationId": Aitem.InvestigationId || 0,
                                            "InvestigationDesc": Aitem.InvestigationDesc || "",
                                            "ActiveInd": "Y",
                                            "SelectedGlobalSearch": "",
                                            "SelectedRightEye": 1,
                                            "SelectedLeftEye": 0,
                                            "RemarksArray": [],
                                        };
                                        angular.forEach(Aitem.AnteriorRemarks, function (Mitem) {
                                            var obj = {
                                                "RemarksId": 0,
                                                "InvFindingId": Mitem.InvestigationFindingId || 0,
                                                "FindingValue": Mitem.Remarks || '',
                                                "OrganId": Mitem.OrganId || 1,
                                                "FindingId": 0,
                                                "FindingName": '',
                                                "DiagnosisRiskLevel": "",
                                                "ActiveInd": "Y",
                                                "Notes": "",
                                                "IsShowNotesTextBox": false,
                                                "SubFindingList": Mitem.Subfindingslist || []
                                            }
                                            object.RemarksArray.push(obj);
                                        });


                                        $scope.AnteriorSegmentArrayNew.push(object);
                                    });
                                }



                                //}, function () {
                                //    return;
                                //});
                            } else {
                                $scope.AnteriorSegmentArrayNew = $scope.AnteriorSegmentArrayNew || [];
                                if ($scope.AnteriorSegmentArrayNew.length > 0) {
                                    angular.forEach($scope.AnteriorSegmentArrayNew, function (Citem) {
                                        if (Citem.RemarksArray.length > 0) {
                                            angular.forEach(Citem.RemarksArray, function (hitem, index) {
                                                if (hitem.RemarksId === 0) {
                                                    Citem.RemarksArray.splice(index, 2);
                                                }
                                                else {
                                                    hitem.ActiveInd = 'N';
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        } else if ($scope.subexaminationtab == 2) {
                            if (item.IsChecked) {
                                //alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Added data will be cleared. Do you still want to continue? </h4>", function () {
                                angular.forEach($scope.TempExamTemplateArray, function (subitem) {
                                    subitem.IsChecked = false;
                                });
                                item.IsChecked = true;
                                item.PosteriorArray = item.PosteriorArray || [];
                                if ($scope.PoteriorSegmentArrayNew.length > 0) {
                                    angular.forEach($scope.PoteriorSegmentArrayNew, function (Citem) {
                                        if (Citem.RemarksArray.length > 0) {
                                            angular.forEach(Citem.RemarksArray, function (hitem, index) {
                                                if (hitem.RemarksId === 0) {
                                                    Citem.RemarksArray.splice(index, 2);
                                                }
                                                else {
                                                    hitem.ActiveInd = 'N';
                                                }
                                            });
                                        }
                                    });
                                }

                                angular.forEach(item.PosteriorArray, function (Aitem) {
                                    var object = {
                                        "PatientFindingPosteriorId": 0,
                                        "IsNormal": false,
                                        "CategoryId": Aitem.CategoryId || 6,
                                        "CategoryDesc": Aitem.CategoryName || "Posterior Segment",
                                        "InvestigationId": Aitem.InvestigationId || 0,
                                        "InvestigationDesc": Aitem.InvestigationDesc || "",
                                        "ActiveInd": "Y",
                                        "SelectedGlobalSearch": "",
                                        "SelectedRightEye": 1,
                                        "SelectedLeftEye": 0,
                                        "RemarksArray": [],
                                    };
                                    angular.forEach(Aitem.PosteriorRemarks, function (Mitem) {
                                        var obj = {
                                            "RemarksId": 0,
                                            "InvFindingId": Mitem.InvestigationFindingId || 0,
                                            "FindingValue": Mitem.Remarks || '',
                                            "OrganId": Mitem.OrganId || 1,
                                            "FindingId": 0,
                                            "FindingName": '',
                                            "DiagnosisRiskLevel": "",
                                            "ActiveInd": "Y",
                                            "Notes": "",
                                            "IsShowNotesTextBox": false,
                                            "SubFindingList": Mitem.Subfindingslist || []
                                        }
                                        object.RemarksArray.push(obj);
                                    });


                                    $scope.PoteriorSegmentArrayNew.push(object);
                                });

                                //}, function () {
                                //    return;
                                //});
                            } else {
                                $scope.PoteriorSegmentArrayNew = $scope.PoteriorSegmentArrayNew || [];
                                if ($scope.PoteriorSegmentArrayNew.length > 0) {
                                    angular.forEach($scope.PoteriorSegmentArrayNew, function (Citem) {
                                        if (Citem.RemarksArray.length > 0) {
                                            angular.forEach(Citem.RemarksArray, function (hitem, index) {
                                                if (hitem.RemarksId === 0) {
                                                    Citem.RemarksArray.splice(index, 2);
                                                }
                                                else {
                                                    hitem.ActiveInd = 'N';
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    };

                    //$scope.$watch("AnteriorSegmentArrayNew", function () {

                    //    $scope.AnteriorSegmentArrayNew = $scope.AnteriorSegmentArrayNew || [];
                    //}, true);

                }
            });
        };

        $scope.examinationshistorypopup = {
            "templateUrl": "templates/UIBPopovers/examinationshistorypopup.html",
        };

        $scope.examinationshistoryposteriorpopup = {
            "templateUrl": "templates/UIBPopovers/examinationshistoryposteriorpopup.html",
        };

        $scope.gonioscopyhistorypopup = {
            "templateUrl": "templates/UIBPopovers/gonioscopyhistorypopup.html",
        };


        $scope.GetPreviousExaminationsPatientData = function () {

            var obj = {

                "TypeID": 3,

                "TypeName": "Examinations",

                "PatientId": $scope.cacheStorageItem.patientid,

                "HospitalId": $scope.HospitalId,

                "UserId": $scope.UserId,

            };

            eHnotePatientDataService.GetPreviousROSHistoryData(obj).then(function (resp) {

                $scope.PreviousEcaminationDetails = [];

                if (resp.data.rows != undefined) {



                    $scope.PreviousExaminationDetails = resp.data.rows;


                }


            });

        };

        $scope.CopyGioScopyOsPrevious = function (inv, remarks) {
            if ($scope.GonioscopyDetailsList.length > 0) {
                angular.forEach($scope.GonioscopyDetailsList, function (pitem) {
                    pitem.LeftEye.BottomValue = inv.BottomValue;
                    /*       pitem.LeftEye.BottomValueObj = inv.BottomValueObj;*/
                    if (pitem.LeftEye.BottomValue != '') {
                        pitem.LeftEye.BottomValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": pitem.LeftEye.BottomValue }, true)[0] || [];
                    }
                    pitem.LeftEye.DepthBottomValue = inv.DepthBottomValue
                    /*  pitem.LeftEye.DepthBottomValueObj = inv.DepthBottomValueObj;*/
                    if (pitem.LeftEye.DepthBottomValue != '') {
                        pitem.LeftEye.DepthBottomValueObj = $filter("filter")($scope.DepthArrayList, { "Name": pitem.LeftEye.DepthBottomValue }, true)[0] || [];
                    }
                    pitem.LeftEye.RightValue = inv.RightValue
                    /*   pitem.LeftEye.RightValueObj = inv.RightValueObj;*/
                    if (pitem.LeftEye.RightValue != '') {
                        pitem.LeftEye.RightValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": pitem.LeftEye.RightValue }, true)[0] || [];
                    }
                    pitem.LeftEye.DepthRightValue = inv.DepthRightValue
                    /*  pitem.LeftEye.DepthRightValueObj = inv.DepthRightValueObj;*/
                    if (pitem.LeftEye.DepthRightValue != '') {
                        pitem.LeftEye.DepthRightValueObj = $filter("filter")($scope.DepthArrayList, { "Name": pitem.LeftEye.DepthRightValue }, true)[0] || [];
                    }
                    pitem.LeftEye.DepthTopValue = inv.DepthTopValue
                    /*     pitem.LeftEye.DepthTopValueObj = inv.DepthTopValueObj;*/
                    if (pitem.LeftEye.DepthTopValue != '') {
                        pitem.LeftEye.DepthTopValueObj = $filter("filter")($scope.DepthArrayList, { "Name": pitem.LeftEye.DepthTopValue }, true)[0] || [];
                    }
                    pitem.LeftEye.TopValue = inv.TopValue
                    /*    pitem.LeftEye.TopValueObj = inv.TopValueObj;*/
                    if (pitem.LeftEye.TopValue != '') {
                        pitem.LeftEye.TopValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": pitem.LeftEye.TopValue }, true)[0] || [];
                    }
                    pitem.LeftEye.DepthLeftValue = inv.DepthLeftValue
                    /* pitem.LeftEye.DepthLeftValueObj = inv.DepthLeftValueObj;*/
                    if (pitem.LeftEye.DepthLeftValue != '') {
                        pitem.LeftEye.DepthLeftValueObj = $filter("filter")($scope.DepthArrayList, { "Name": pitem.LeftEye.DepthLeftValue }, true)[0] || [];
                    }
                    pitem.LeftEye.LeftValue = inv.LeftValue
                    /*    pitem.LeftEye.LeftValueObj = inv.LeftValueObj;*/
                    if (pitem.LeftEye.LeftValue != '') {
                        pitem.LeftEye.LeftValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": pitem.LeftEye.LeftValue }, true)[0] || [];
                    }
                    pitem.LeftEye.PigmentValue = inv.PigmentValue
                    pitem.LeftEye.PossibleDiagnosisName = inv.PossibleDiagnosisName
                    /*    pitem.LeftEye.PigmentValueObj = inv.PigmentValueObj;*/
                    if (pitem.LeftEye.PigmentValue != '') {
                        pitem.LeftEye.PigmentValueObj = $filter("filter")($scope.PigmentArrayList, { "Name": pitem.LeftEye.PigmentValue }, true)[0] || [];
                    }
                    pitem.LeftEye.PossibleDiagnosisId = inv.PossibleDiagnosisId;
                    if (pitem.LeftEye.PossibleDiagnosisName != '') {


                        var filterpossiable = $filter("filter")($scope.PossibleDiagnosisArray, { "DiagnosisName": pitem.LeftEye.PossibleDiagnosisName }, true) || [];
                        if (filterpossiable.length > 0) {
                            pitem.LeftEye.PossibleDiagnosisObject = filterpossiable[0];

                            pitem.LeftEye.PossibleDiagnosisId = filterpossiable[0].DiagnosisId;
                        }
                    }
                    pitem.LeftEye.ICD10CODE = inv.ICD10CODE;
                    pitem.LeftEyeRemarks = remarks;
                    inv.iscopied = true;
                });
            }
        };
        $scope.CopyGioScopyODPrevious = function (inv, remarks) {
            if ($scope.GonioscopyDetailsList.length > 0) {
                angular.forEach($scope.GonioscopyDetailsList, function (pitem) {
                    pitem.RightEye.BottomValue = inv.BottomValue;
                    /*   pitem.RightEye.BottomValueObj = inv.BottomValueObj;*/
                    if (pitem.RightEye.BottomValue != '') {
                        pitem.RightEye.BottomValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": pitem.RightEye.BottomValue }, true)[0] || [];
                    }
                    pitem.RightEye.DepthBottomValue = inv.DepthBottomValue
                    /*    pitem.RightEye.DepthBottomValueObj = inv.DepthBottomValueObj;*/
                    if (pitem.RightEye.DepthBottomValue != '') {
                        pitem.RightEye.DepthBottomValueObj = $filter("filter")($scope.DepthArrayList, { "Name": pitem.RightEye.DepthBottomValue }, true)[0] || [];
                    }
                    pitem.RightEye.RightValue = inv.RightValue
                    /*     pitem.RightEye.RightValueObj = inv.RightValueObj;*/
                    if (pitem.RightEye.RightValue != '') {
                        pitem.RightEye.RightValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": pitem.RightEye.RightValue }, true)[0] || [];
                    }
                    pitem.RightEye.DepthRightValue = inv.DepthRightValue
                    /*   pitem.RightEye.DepthRightValueObj = inv.DepthRightValueObj;*/
                    if (pitem.RightEye.DepthRightValue != '') {
                        pitem.RightEye.DepthRightValueObj = $filter("filter")($scope.DepthArrayList, { "Name": pitem.RightEye.DepthRightValue }, true)[0] || [];
                    }
                    pitem.RightEye.DepthTopValue = inv.DepthTopValue
                    /*   pitem.RightEye.DepthTopValueObj = inv.DepthTopValueObj;*/
                    if (pitem.RightEye.DepthTopValue != '') {
                        pitem.RightEye.DepthTopValueObj = $filter("filter")($scope.DepthArrayList, { "Name": pitem.RightEye.DepthTopValue }, true)[0] || [];
                    }
                    pitem.RightEye.TopValue = inv.TopValue
                    /*    pitem.RightEye.TopValueObj = inv.TopValueObj;*/
                    if (pitem.RightEye.TopValue != '') {
                        pitem.RightEye.TopValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": pitem.RightEye.TopValue }, true)[0] || [];
                    }
                    pitem.RightEye.DepthLeftValue = inv.DepthLeftValue
                    /*    pitem.RightEye.DepthLeftValueObj = inv.DepthLeftValueObj;*/
                    if (pitem.RightEye.DepthLeftValue != '') {
                        pitem.RightEye.DepthLeftValueObj = $filter("filter")($scope.DepthArrayList, { "Name": pitem.RightEye.DepthLeftValue }, true)[0] || [];
                    }
                    pitem.RightEye.LeftValue = inv.LeftValue
                    /*  pitem.RightEye.LeftValueObj = inv.LeftValueObj;*/
                    if (pitem.RightEye.LeftValue != '') {
                        pitem.RightEye.LeftValueObj = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Name": pitem.RightEye.LeftValue }, true)[0] || [];
                    }
                    pitem.RightEye.PigmentValue = inv.PigmentValue
                    if (pitem.RightEye.PigmentValue != '') {
                        pitem.RightEye.PigmentValueObj = $filter("filter")($scope.PigmentArrayList, { "Name": pitem.RightEye.PigmentValue }, true)[0] || [];
                    }
                    pitem.RightEye.PossibleDiagnosisName = inv.PossibleDiagnosisName
                    /*        pitem.RightEye.PigmentValueObj = inv.PigmentValueObj;*/
                    pitem.RightEye.PossibleDiagnosisId = inv.PossibleDiagnosisId;
                    if (pitem.RightEye.PossibleDiagnosisName != '') {
                        // pitem.RightEye.PossibleDiagnosisObject = $filter("filter")($scope.PossibleDiagnosisArray, { "DiagnosisName": pitem.RightEye.PossibleDiagnosisName }, true)[0] || [];
                        var filterpossiable = $filter("filter")($scope.PossibleDiagnosisArray, { "DiagnosisId": pitem.RightEye.PossibleDiagnosisId }, true) || [];
                        if (filterpossiable.length > 0) {
                            pitem.RightEye.PossibleDiagnosisObject = filterpossiable[0];
                            pitem.RightEye.PossibleDiagnosisName = filterpossiable[0].DiagnosisName;
                        }

                    }
                    pitem.RightEye.ICD10CODE = inv.ICD10CODE;
                    pitem.RightEyeRemarks = remarks;
                    inv.iscopied = true;
                });
            }
        };



        $scope.CopytoODData = function (item, Aitem) {

            var filetrarray = $filter("filter")($scope.AnteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.InvestigationId }) || [];
            if (filetrarray.length == 0) {

                var object = {
                    "PatientFindingAnteriorId": item.PatientFindingAnteriorId,
                    "IsNormal": false,
                    "CategoryId": 5,
                    "CategoryDesc": "Anterior Segment",
                    "InvestigationId": item.InvestigationId || 0,
                    "InvestigationDesc": item.InvestigationDesc || "",
                    "ActiveInd": "Y",
                    "SelectedGlobalSearch": "",
                    "SelectedRightEye": 1,
                    "SelectedLeftEye": 0,
                    "RemarksArray": [],

                };

                var filterArray = $filter("filter")(item.RemarksArray, { "OrganId": 1 }, true);

                if (filterArray.length > 0) {


                    angular.forEach(filterArray, function (Aitem) {
                        if (Aitem.OrganId == 1) {
                            var obj = {
                                "RemarksId": Aitem.RemarksId,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": Aitem.OrganId || 1,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        } else if (Aitem.OrganId == 2) {
                            var obj = {
                                "RemarksId": Aitem.RemarksId,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": Aitem.OrganId || 2,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        }

                        object.RemarksArray.push(obj);
                    });

                }


                $scope.AnteriorSegmentArrayNew.push(object);


            } else {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.InvestigationId == item.InvestigationId) {
                        var filterArray = $filter("filter")(item.RemarksArray, { "OrganId": 1 }, true);

                        if (filterArray.length > 0) {


                            angular.forEach(filterArray, function (Aitem) {
                                if (Aitem.OrganId == 1) {
                                    var obj = {
                                        "RemarksId": Aitem.RemarksId,
                                        "InvFindingId": Aitem.InvFindingId || 0,
                                        "FindingValue": Aitem.FindingValue || '',
                                        "OrganId": Aitem.OrganId || 1,
                                        "FindingId": Aitem.FindingId || 0,
                                        "FindingName": Aitem.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": []
                                    }
                                } else if (Aitem.OrganId == 2) {
                                    var obj = {
                                        "RemarksId": Aitem.RemarksId,
                                        "InvFindingId": Aitem.InvFindingId || 0,
                                        "FindingValue": Aitem.FindingValue || '',
                                        "OrganId": Aitem.OrganId || 2,
                                        "FindingId": Aitem.FindingId || 0,
                                        "FindingName": Aitem.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": []
                                    }
                                }

                                Mitem.RemarksArray.push(obj);
                            });

                        }
                    }
                });
            }
            $scope.newAnteriorObj.AnteriorSearchObj = '';
            $scope.newAnteriorObj.OSAnteriorSearchObj = '';

            item.IsCopied = true;
        }
        $scope.CopytoOSData = function (item, Aitem) {


            var filetrarray = $filter("filter")($scope.AnteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.InvestigationId }) || [];
            if (filetrarray.length == 0) {

                var object = {
                    "PatientFindingAnteriorId": item.PatientFindingAnteriorId,
                    "IsNormal": false,
                    "CategoryId": 5,
                    "CategoryDesc": "Anterior Segment",
                    "InvestigationId": item.InvestigationId || 0,
                    "InvestigationDesc": item.InvestigationDesc || "",
                    "ActiveInd": "Y",
                    "SelectedGlobalSearch": "",
                    "SelectedRightEye": 1,
                    "SelectedLeftEye": 0,
                    "RemarksArray": [],

                };

                var filterArray = $filter("filter")(item.RemarksArray, { "OrganId": 2 }, true);

                if (filterArray.length > 0) {
                    angular.forEach(filterArray, function (Aitem) {
                        if (Aitem.OrganId == 1) {
                            var obj = {
                                "RemarksId": Aitem.RemarksId,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": Aitem.OrganId || 1,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        } else if (Aitem.OrganId == 2) {
                            var obj = {
                                "RemarksId": Aitem.RemarksId,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": Aitem.OrganId || 2,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        }

                        object.RemarksArray.push(obj);
                    });

                }


                $scope.AnteriorSegmentArrayNew.push(object);


            } else {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.InvestigationId == item.InvestigationId) {


                        var filterArray = $filter("filter")(item.RemarksArray, { "OrganId": 2 }, true);

                        if (filterArray.length > 0) {


                            angular.forEach(filterArray, function (Aitem) {
                                if (Aitem.OrganId == 1) {
                                    var obj = {
                                        "RemarksId": Aitem.RemarksId,
                                        "InvFindingId": Aitem.InvFindingId || 0,
                                        "FindingValue": Aitem.FindingValue || '',
                                        "OrganId": Aitem.OrganId || 1,
                                        "FindingId": Aitem.FindingId || 0,
                                        "FindingName": Aitem.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": []
                                    }
                                } else if (Aitem.OrganId == 2) {
                                    var obj = {
                                        "RemarksId": Aitem.RemarksId,
                                        "InvFindingId": Aitem.InvFindingId || 0,
                                        "FindingValue": Aitem.FindingValue || '',
                                        "OrganId": Aitem.OrganId || 2,
                                        "FindingId": Aitem.FindingId || 0,
                                        "FindingName": Aitem.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": []
                                    }
                                }

                                Mitem.RemarksArray.push(obj);
                            });

                        }

                    }
                });
            }
            $scope.newAnteriorObj.AnteriorSearchObj = '';
            $scope.newAnteriorObj.OSAnteriorSearchObj = '';

            item.Copied = true;
        }



        $scope.CopytoPosteriorOD = function (item, Aitem) {
            var filetrarray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.InvestigationId }) || [];
            if (filetrarray.length == 0) {

                var object = {
                    "PatientFindingAnteriorId": item.PatientFindingAnteriorId,
                    "IsNormal": false,
                    "CategoryId": 5,
                    "CategoryDesc": "Anterior Segment",
                    "InvestigationId": item.InvestigationId || 0,
                    "InvestigationDesc": item.InvestigationDesc || "",
                    "ActiveInd": "Y",
                    "SelectedGlobalSearch": "",
                    "SelectedRightEye": 1,
                    "SelectedLeftEye": 0,
                    "RemarksArray": [],

                };


                var filterArray = $filter("filter")(item.RemarksArray, { "OrganId": 1 }, true);

                if (filterArray.length > 0) {


                    angular.forEach(filterArray, function (Aitem) {
                        if (Aitem.OrganId == 1) {
                            var obj = {
                                "RemarksId": Aitem.RemarksId,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": Aitem.OrganId || 1,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        } else if (Aitem.OrganId == 2) {
                            var obj = {
                                "RemarksId": Aitem.RemarksId,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": Aitem.OrganId || 2,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        }

                        object.RemarksArray.push(obj);
                    });

                }


                $scope.PoteriorSegmentArrayNew.push(object);


            } else {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.InvestigationId == item.InvestigationId) {
                        var filterArray = $filter("filter")(item.RemarksArray, { "OrganId": 1 }, true);

                        if (filterArray.length > 0) {


                            angular.forEach(filterArray, function (Aitem) {
                                if (Aitem.OrganId == 1) {
                                    var obj = {
                                        "RemarksId": Aitem.RemarksId,
                                        "InvFindingId": Aitem.InvFindingId || 0,
                                        "FindingValue": Aitem.FindingValue || '',
                                        "OrganId": Aitem.OrganId || 1,
                                        "FindingId": Aitem.FindingId || 0,
                                        "FindingName": Aitem.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": []
                                    }
                                } else if (Aitem.OrganId == 2) {
                                    var obj = {
                                        "RemarksId": Aitem.RemarksId,
                                        "InvFindingId": Aitem.InvFindingId || 0,
                                        "FindingValue": Aitem.FindingValue || '',
                                        "OrganId": Aitem.OrganId || 2,
                                        "FindingId": Aitem.FindingId || 0,
                                        "FindingName": Aitem.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": []
                                    }
                                }
                                Mitem.RemarksArray.push(obj);
                            });
                        }

                    }
                });
            }
            item.IsCopied = true;
        }

        $scope.CopytoPosteriorOS = function (item, Aitem) {
            var filetrarray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.InvestigationId }) || [];
            if (filetrarray.length == 0) {

                var object = {
                    "PatientFindingPosteriorId": item.PatientFindingPosteriorId,
                    "IsNormal": false,
                    "CategoryId": 5,
                    "CategoryDesc": " Posterior Segment",
                    "InvestigationId": item.InvestigationId || 0,
                    "InvestigationDesc": item.InvestigationDesc || "",
                    "ActiveInd": "Y",
                    "SelectedGlobalSearch": "",
                    "SelectedRightEye": 1,
                    "SelectedLeftEye": 0,
                    "RemarksArray": [],

                };
                var filterArray = $filter("filter")(item.RemarksArray, { "OrganId": 2 }, true);
                if (filterArray.length > 0) {


                    angular.forEach(filterArray, function (Aitem) {
                        if (Aitem.OrganId == 1) {
                            var obj = {
                                "RemarksId": Aitem.RemarksId,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": Aitem.OrganId || 1,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        } else if (Aitem.OrganId == 2) {
                            var obj = {
                                "RemarksId": Aitem.RemarksId,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": Aitem.OrganId || 2,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        }

                        object.RemarksArray.push(obj);
                    });

                }


                $scope.PoteriorSegmentArrayNew.push(object);


            } else {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.InvestigationId == item.InvestigationId) {
                        var filterArray = $filter("filter")(item.RemarksArray, { "OrganId": 2 }, true);

                        if (filterArray.length > 0) {


                            angular.forEach(filterArray, function (Aitem) {
                                if (Aitem.OrganId == 1) {
                                    var obj = {
                                        "RemarksId": Aitem.RemarksId,
                                        "InvFindingId": Aitem.InvFindingId || 0,
                                        "FindingValue": Aitem.FindingValue || '',
                                        "OrganId": Aitem.OrganId || 1,
                                        "FindingId": Aitem.FindingId || 0,
                                        "FindingName": Aitem.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": []
                                    }
                                } else if (Aitem.OrganId == 2) {
                                    var obj = {
                                        "RemarksId": Aitem.RemarksId,
                                        "InvFindingId": Aitem.InvFindingId || 0,
                                        "FindingValue": Aitem.FindingValue || '',
                                        "OrganId": Aitem.OrganId || 2,
                                        "FindingId": Aitem.FindingId || 0,
                                        "FindingName": Aitem.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": []
                                    }
                                }
                                Mitem.RemarksArray.push(obj);
                            });
                        }

                    }
                });
            }
            item.Copied = true;
        }



        //Santhosh 27-OCT-2023

        $scope.anteriorGridshow = false;
        $scope.anteriorGridclick = function () {
            $scope.anteriorGridshow = !$scope.anteriorGridshow;
            /* $scope.SelectAnteriorInvestigation1($scope.cacheStorageItem.AnteriorDetails[0]);*/
        }
        $scope.posteriorGridshow = false;
        $scope.posteriorGridclick = function () {
            $scope.posteriorGridshow = !$scope.posteriorGridshow;
            /* $scope.SelectPosteriorInvestigation1($scope.cacheStorageItem.PosteriorDetails[0]);*/
        }



        //$scope.DrawingexaminationsStateObj = {
        //    "ExamAnteriorObject": false,
        //    "ExamPosteriorObject": false,
        //    "ExamTemplatesAutoplansObject": false,
        //    "ExamDrawingPadObject": true,
        //}
        //$scope.AutoPlansexaminationsStateObj = {
        //    "ExamAnteriorObject": true,
        //    "ExamPosteriorObject": false,
        //    "ExamTemplatesAutoplansObject": true,
        //    "ExamDrawingPadObject": false,
        //}

        //$scope.DrawingexaminationsStateObj.ExamAnteriorObject = true;
        //$scope.DrawingexaminationsStateObj.ExamPosteriorObject = true;
        //$scope.AutoPlansexaminationsStateObj.ExamAnteriorObject = true;
        //$scope.AutoPlansexaminationsStateObj.ExamPosteriorObject = true;

        //$scope.anteriorPosteriorDrawingTab = function () {
        //    $scope.AutoPlansexaminationsStateObj.ExamAnteriorObject = !$scope.AutoPlansexaminationsStateObj.ExamAnteriorObject;
        //    $scope.AutoPlansexaminationsStateObj.ExamPosteriorObject = !$scope.AutoPlansexaminationsStateObj.ExamPosteriorObject;
        //    $scope.AutoPlansexaminationsStateObj.ExamTemplatesAutoplansObject = !$scope.AutoPlansexaminationsStateObj.ExamTemplatesAutoplansObject;
        //    $scope.AutoPlansexaminationsStateObj.ExamDrawingPadObject = !$scope.AutoPlansexaminationsStateObj.ExamDrawingPadObject;
        //};

        //$scope.anteriorPosteriorTemplatesTabs = function () {
        //    $scope.DrawingexaminationsStateObj.ExamAnteriorObject = !$scope.DrawingexaminationsStateObj.ExamAnteriorObject;
        //    $scope.DrawingexaminationsStateObj.ExamPosteriorObject = !$scope.DrawingexaminationsStateObj.ExamPosteriorObject;
        //    $scope.DrawingexaminationsStateObj.ExamTemplatesAutoplansObject = !$scope.DrawingexaminationsStateObj.ExamTemplatesAutoplansObject;
        //    $scope.DrawingexaminationsStateObj.ExamDrawingPadObject = !$scope.DrawingexaminationsStateObj.ExamDrawingPadObject;
        //};

        $scope.ExamAnteriorPosteriorObject = {
            "ShowExamAnteriorPosteriorView": true,
            "ShowExamDrawingPadView": false,
            "ShowExamTemplareAutoPlansView": false,
            "showExamNewDrawingTab":false,
            "ViewAnteriorPosteriorTemplateDtls": false,
            "ViewAutoPlansDtls": false,
            "IsAnteriorTemplatePopover": false,
        }

        $scope.newFabricDrawingTab = function () {

            
            $scope.ExamAnteriorPosteriorObject.showExamNewDrawingTab = true;
            $scope.ExamAnteriorPosteriorObject.ShowExamAnteriorPosteriorView = false;
            $scope.ExamAnteriorPosteriorObject.ShowExamTemplareAutoPlansView = false;
            $scope.ExamAnteriorPosteriorObject.ShowExamDrawingPadView = false;
            $scope.ExamAnteriorPosteriorObject.ViewAnteriorPosteriorTemplateDtls = false;
            $scope.ExamAnteriorPosteriorObject.ViewAutoPlansDtls = false;
        }
        $scope.anteriorPosteriorDrawingTab = function () {

            $scope.TempInvestigactionslist = [];
            $scope.TempInvestigactionslist = $scope.cacheStorageItem.AnteriorDetails.concat($scope.cacheStorageItem.PosteriorDetails);

            $scope.ExamAnteriorPosteriorObject.ShowExamAnteriorPosteriorView = false;
            $scope.ExamAnteriorPosteriorObject.ShowExamDrawingPadView = true;
            $scope.ExamAnteriorPosteriorObject.ShowExamTemplareAutoPlansView = false;
            $scope.ExamAnteriorPosteriorObject.ViewAnteriorPosteriorTemplateDtls = false;
            $scope.ExamAnteriorPosteriorObject.ViewAutoPlansDtls = false;
            $scope.ExamAnteriorPosteriorObject.showExamNewDrawingTab = false;
        };
        $scope.status = { open: false };
        $scope.anteriorPosteriorTemplatesTabs = function () {
            $scope.ExamAnteriorPosteriorObject.ShowExamAnteriorPosteriorView = false;
            $scope.ExamAnteriorPosteriorObject.ShowExamTemplareAutoPlansView = true;
            $scope.ExamAnteriorPosteriorObject.ShowExamDrawingPadView = false;
            $scope.ExamAnteriorPosteriorObject.ViewAnteriorPosteriorTemplateDtls = false;
            $scope.ExamAnteriorPosteriorObject.ViewAutoPlansDtls = false;
            $scope.ExamAnteriorPosteriorObject.showExamNewDrawingTab = false;
          
            $scope.status.open = true;
            if ($scope.AnteriorTemplatesArray.length > 0) {
                angular.forEach($scope.AnteriorTemplatesArray, function (mitem) {
                    mitem.IsEdit = false;
                    //item.IsDescriptionEdit = false;
                });
            }
            $scope.AnteriorTemplatesArray[0].IsEdit = true;
           $scope.ViewTemplateDetails($scope.AnteriorTemplatesArray[0],1);
        };

        $scope.anteriorPosteriorNotes = {
            templateUrl: 'anteriorPosteriorNotes.html',
        };

        $scope.antpostgrid = {
            templateUrl: 'antpostgridscript.html',
        };
        $scope.IsExamedwithTorchused = function () {
            $scope.cacheStorageItem.IsExamedwithTorchused = !$scope.cacheStorageItem.IsExamedwithTorchused;
        };
        $scope.IsPosteriorExtendedOpthalmology = function () {
            $scope.cacheStorageItem.IsPosteriorExtendedOpthalmology = !$scope.cacheStorageItem.IsPosteriorExtendedOpthalmology;
        };

        $scope.ClearGonioscopyDetails = function (item, eye) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Gonioscopy data?  </h4>", function () {
                if (eye == 'OD') {
                    item.RightEye.DepthTopValueObj = '';
                    item.RightEye.TopValueObj = '';
                    item.RightEye.DepthLeftValueObj = '';
                    item.RightEye.LeftValueObj = '';
                    item.RightEye.DepthRightValueObj = '';
                    item.RightEye.RightValueObj = '';
                    item.RightEye.DepthBottomValueObj = '';
                    item.RightEye.BottomValueObj = '';
                    item.RightEye.PigmentValueObj = '';
                    item.RightEye.PossibleDiagnosisId = 0;
                    item.RightEyeRemarks = '';
                    item.RightEye.DepthTopValue = '';
                    item.RightEye.TopValue = '';
                    item.RightEye.DepthLeftValue = '';
                    item.RightEye.LeftValue = '';
                    item.RightEye.DepthRightValue = '';
                    item.RightEye.RightValue = '';
                    item.RightEye.DepthBottomValue = '';
                    item.RightEye.BottomValue = '';
                    item.RightEye.PigmentValue = '';
                    item.RightEye.PossibleDiagnosisName = '';
                }
                if (eye == 'OS') {
                    item.LeftEye.DepthTopValueObj = '';
                    item.LeftEye.TopValueObj = '';
                    item.LeftEye.DepthLeftValueObj = '';
                    item.LeftEye.LeftValueObj = '';
                    item.LeftEye.DepthRightValueObj = '';
                    item.LeftEye.RightValueObj = '';
                    item.LeftEye.DepthBottomValueObj = '';
                    item.LeftEye.BottomValueObj = '';
                    item.LeftEye.PigmentValueObj = '';
                    item.LeftEye.PossibleDiagnosisId = 0;
                    item.LeftEyeRemarks = '';
                    item.LeftEye.DepthTopValue = '';
                    item.LeftEye.TopValue = '';
                    item.LeftEye.DepthLeftValue = '';
                    item.LeftEye.LeftValue = '';
                    item.LeftEye.DepthRightValue = '';
                    item.LeftEye.RightValue = '';
                    item.LeftEye.DepthBottomValue = '';
                    item.LeftEye.BottomValue = '';
                    item.LeftEye.PigmentValue = '';
                    item.LeftEye.PossibleDiagnosisName = '';
                }
                if (item.RightEye.RightValue == '' && item.RightEye.LeftValue == '' && item.RightEye.TopValue == '' && item.RightEye.BottomValue == '' && item.RightEye.PigmentValue == '' && item.RightEyeRemarks == '' && item.RightEye.DepthRightValue == '' && item.RightEye.DepthLeftValue == '' && item.RightEye.DepthTopValue == '' && item.RightEye.DepthBottomValue == '' &&
                    item.LeftEye.RightValue == '' && item.LeftEye.LeftValue == '' && item.LeftEye.TopValue == '' && item.LeftEye.BottomValue == '' && item.LeftEye.PigmentValue == '' && item.LeftEyeRemarks == '' && item.LeftEye.DepthRightValue == '' && item.LeftEye.DepthLeftValue == '' && item.LeftEye.DepthTopValue == '' && item.LeftEye.DepthBottomValue == '') {
                    item.ActiveInd = 'N';
                } else {
                    item.ActiveInd = 'Y';
                }
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }
        //$scope.ExamAnteriorObject = true;
        //$scope.ExamPosteriorObject = true;

        //$scope.anteriorPosteriorDrawingTab = function () {
        //    $scope.ExamAnteriorObject = false;
        //    $scope.ExamPosteriorObject = false;
        //    $scope.ExamTemplatesAutoplansObject = false;
        //    $scope.ExamDrawingPadObject = true;
        //}
        //$scope.anteriorPosteriorTemplatesTabs = function () {
        //    $scope.ExamAnteriorObject = true;
        //    $scope.ExamPosteriorObject = false;
        //    $scope.ExamTemplatesAutoplansObject = true;
        //    $scope.ExamDrawingPadObject = false;
        //}

        //$scope.anteriorPosteriorDrawingTab = function () {
        //    $scope.ExamAnteriorObject = !$scope.ExamAnteriorObject;
        //    $scope.ExamPosteriorObject = !$scope.ExamPosteriorObject;
        //    $scope.ExamTemplatesAutoplansObject = !$scope.ExamTemplatesAutoplansObject;
        //    $scope.ExamDrawingPadObject = !$scope.ExamDrawingPadObject;
        //}
        //$scope.anteriorPosteriorTemplatesTabs = function () {
        //    $scope.ExamAnteriorObject = !$scope.ExamAnteriorObject;
        //    $scope.ExamPosteriorObject = !$scope.ExamPosteriorObject;
        //    $scope.ExamTemplatesAutoplansObject = !$scope.ExamTemplatesAutoplansObject;
        //    $scope.ExamDrawingPadObject = !$scope.ExamDrawingPadObject;
        //}



        //$scope.anteriorGridclick = function () {

        //};


        //$scope.posteriorGridclick = function () {

        //};

        $scope.ChangeRightDropdownValue = function (ditem) {
            $scope.AmslerGridNormal.AmslerODNormal = false;
            if (ditem.RightEyeId == null) {
                ditem.RightEyeId = ditem.RightEyeId || "";
                ditem.RightEyeRemarks = "";
            } else {
                var List = $filter("filter")($scope.AmslerGridDropdowmList, { "Id": ditem.RightEyeId }, true) || [];
                if (List.length > 0) {
                    ditem.RightEyeRemarks = List[0].Values || "";
                    if (ditem.RightEyeId == 69) {
                        $scope.AmslerGridNormal.AmslerODNormal = true;
                        angular.forEach($scope.AmslerGridODDrawList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                    } else {
                        $scope.AmslerGridNormal.AmslerODNormal = false;
                    }
                } else {
                    ditem.RightEyeRemarks = "";
                }
            }
        };


        $scope.ChangeLeftDropdownValue = function (ditem) {
            $scope.AmslerGridNormal.AmslerOSNormal = false;
            if (ditem.LeftEyeId == null) {
                ditem.LeftEyeId = ditem.LeftEyeId || "";
                ditem.LeftEyeRemarks = ditem.LeftEyeRemarks || "";
            } else {
                var List = $filter("filter")($scope.AmslerGridDropdowmList, { "Id": ditem.LeftEyeId }, true) || [];
                if (List.length > 0) {
                    ditem.LeftEyeRemarks = List[0].Values || "";
                    if (ditem.LeftEyeId == 69) {
                        $scope.AmslerGridNormal.AmslerOSNormal = true;
                        angular.forEach($scope.AmslerGridOSDrawList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                    } else {
                        $scope.AmslerGridNormal.AmslerOSNormal = false;
                    }
                } else {
                    ditem.LeftEyeRemarks = "";
                }
            }
        };


        $scope.ChangeAmsleGridNormal = function (item, ditem, type, zitem) {
            ditem = ditem || '';
            var List = $filter("filter")($scope.AmslerGridDropdowmList, { "Id": 69 }, true) || []

            if (ditem != '') {
                if (type == 'OD') {
                    if (item == true) {
                        if (List.length > 0) {
                            ditem.RightEyeRemarks = List[0].Values || "";
                            ditem.RightEyeId = List[0].Id || 0;
                            angular.forEach(zitem, function (pitem) {
                                pitem.IsChecked = false;
                            });


                        }
                    }
                    else {
                        ditem.RightEyeRemarks = "";
                        ditem.RightEyeId = 0;
                    }
                } else {
                    if (item == true) {
                        if (List.length > 0) {
                            ditem.LeftEyeRemarks = List[0].Values || "";
                            ditem.LeftEyeId = List[0].Id || 0;
                            angular.forEach(zitem, function (pitem) {
                                pitem.IsChecked = false;
                            });
                        }
                    }
                    else {
                        ditem.LeftEyeRemarks = "";
                        ditem.LeftEyeId = 0;
                    }
                }
            }

        }

        $scope.SaveExamNotesPopup = function (Item, Note) {
            Item.Notes = Note || "";
            Item.IsShowNotesTextBox = false;
        };

        $scope.OpenFindingPopover = function (Item) {
            $scope.ExamFinfingNotes = Item.Notes || "";
            Item.IsShowNotesTextBox = true;
        };

        $scope.ViewTemplateDetails = function (item, SubTab) {
            /*$scope.ExamAnteriorPosteriorObject.ViewAnteriorPosteriorTemplateDtls = !$scope.ExamAnteriorPosteriorObject.ViewAnteriorPosteriorTemplateDtls;*/
            $scope.ExamAnteriorPosteriorObject.ViewAnteriorPosteriorTemplateDtls = true;
            $scope.ViewPirticularTemplateDetails = item || '';
            $scope.subexaminationtab = SubTab || 1;
            $scope.ExamAnteriorPosteriorObject.ViewAutoPlansDtls = false;
        };

        $scope.ViewAutoPlans = function (item) {
            $scope.ExamAnteriorPosteriorObject.ViewAutoPlansDtls = true;
            $scope.ViewPirticularAutoPlansDetails = item || '';
            $scope.ExamAnteriorPosteriorObject.ViewAnteriorPosteriorTemplateDtls = false;
        };

        $scope.closeTemplateView = function () {
            $scope.ExamAnteriorPosteriorObject.ViewAnteriorPosteriorTemplateDtls = false;
            $scope.ExamAnteriorPosteriorObject.ViewAutoPlansDtls = false;
            $scope.ExamAnteriorPosteriorObject.ShowExamTemplareAutoPlansView = false;
            $scope.ExamAnteriorPosteriorObject.ShowExamDrawingPadView = false;
            $scope.ExamAnteriorPosteriorObject.showExamNewDrawingTab = false;
            $scope.ExamAnteriorPosteriorObject.ShowExamAnteriorPosteriorView = true;
        };

        $scope.SelectTemplate = function (item) {

            if (item != null) {
                
                item.AnteriorArray = item.AnteriorArray || [];
                if ($scope.AnteriorSegmentArrayNew.length > 0) {
                    angular.forEach($scope.AnteriorSegmentArrayNew, function (Citem) {
                        if (Citem.RemarksArray.length > 0) {
                            angular.forEach(Citem.RemarksArray, function (hitem, index) {
                                if (hitem.RemarksId === 0) {
                                    Citem.RemarksArray.splice(index, 2);
                                }
                                else {
                                    hitem.ActiveInd = 'N';
                                }
                            });
                        }
                    });
                }

                if (item.AnteriorArray.length > 0 || item.PosteriorArray.length > 0) {
                    alertify.success("Template is selected");
                }
                angular.forEach(item.AnteriorArray, function (Aitem) {
                    var object = {
                        "PatientFindingAnteriorId": 0,
                        "IsNormal": false,
                        "CategoryId": Aitem.CategoryId || 5,
                        "CategoryDesc": Aitem.CategoryName || "Anterior Segment",
                        "InvestigationId": Aitem.InvestigationId || 0,
                        "InvestigationDesc": Aitem.InvestigationDesc || "",
                        "ActiveInd": "Y",
                        "SelectedGlobalSearch": "",
                        "SelectedRightEye": 1,
                        "SelectedLeftEye": 0,
                        "RemarksArray": [],
                    };
                    angular.forEach(Aitem.AnteriorRemarks, function (Mitem) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": Mitem.InvestigationFindingId || 0,
                            "FindingValue": Mitem.Remarks || '',
                            "OrganId": Mitem.OrganId || 1,
                            "FindingId": 0,
                            "FindingName": '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": Mitem.Notes||"",
                            "IsShowNotesTextBox": false,
                            "SubFindingList": Mitem.Subfindingslist || []
                        }
                        object.RemarksArray.push(obj);
                    });


                    $scope.AnteriorSegmentArrayNew.push(object);
                });


                item.PosteriorArray = item.PosteriorArray || [];
                if ($scope.PoteriorSegmentArrayNew.length > 0) {
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (Citem) {
                        if (Citem.RemarksArray.length > 0) {
                            angular.forEach(Citem.RemarksArray, function (hitem, index) {
                                if (hitem.RemarksId === 0) {
                                    Citem.RemarksArray.splice(index, 2);
                                }
                                else {
                                    hitem.ActiveInd = 'N';
                                }
                            });
                        }
                    });
                }

                angular.forEach(item.PosteriorArray, function (Aitem) {
                    var object = {
                        "PatientFindingPosteriorId": 0,
                        "IsNormal": false,
                        "CategoryId": Aitem.CategoryId || 6,
                        "CategoryDesc": Aitem.CategoryName || "Posterior Segment",
                        "InvestigationId": Aitem.InvestigationId || 0,
                        "InvestigationDesc": Aitem.InvestigationDesc || "",
                        "ActiveInd": "Y",
                        "SelectedGlobalSearch": "",
                        "SelectedRightEye": 1,
                        "SelectedLeftEye": 0,
                        "RemarksArray": [],
                    };
                    angular.forEach(Aitem.PosteriorRemarks, function (Mitem) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": Mitem.InvestigationFindingId || 0,
                            "FindingValue": Mitem.Remarks || '',
                            "OrganId": Mitem.OrganId || 1,
                            "FindingId": 0,
                            "FindingName": '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": Mitem.Notes || "",
                            "IsShowNotesTextBox": false,
                            "SubFindingList": Mitem.Subfindingslist || []
                        }
                        object.RemarksArray.push(obj);
                    });


                    $scope.PoteriorSegmentArrayNew.push(object);
                });


            }

            $scope.ExamAnteriorPosteriorObject.ShowExamAnteriorPosteriorView = true;
            $scope.ExamAnteriorPosteriorObject.ShowExamTemplareAutoPlansView = false;
            $scope.ExamAnteriorPosteriorObject.ShowExamDrawingPadView = false;
            $scope.ExamAnteriorPosteriorObject.showExamNewDrawingTab = false;
            
            $scope.ExamAnteriorPosteriorObject.ViewAnteriorPosteriorTemplateDtls = false;
            $scope.ExamAnteriorPosteriorObject.ViewAutoPlansDtls = false;
        };

        $scope.SelectAnterirSubvalues1 = function (item, AntObj, OrganType, catid) {
            if (catid == 5) {
                item = item || '';
                if (OrganType == "OD") {
                    AntObj.SelectedINVEye = 1;
                } else if (OrganType == "OS") {
                    AntObj.SelectedINVEye = 2;
                } else if (OrganType == "OU") {
                    AntObj.SelectedINVEye = 3;
                }
                if (item.FindingsValues.length == 0) {
                    $scope.SelectedFindingAnteriorSegmentValue1(AntObj, item, 5);
                } else {
                    $scope.obj = {
                        "FindingId": null,
                        "FindingName": '',
                        "FindingValue": '',
                        "InvFindingId": null,
                        "Organ": AntObj.SelectedINVEye || 1,
                        "AntorpostrId": AntObj.CatId || null,
                        "SubFindingArrayInLevel1": [],
                        "SubFindingArrayInLevel2": [],
                        "SubFindingArrayInLevel3": [],
                        "SubFindingArrayInLevel4": [],
                    }


                    if (item.FindingsValues.length > 0) {
                        $scope.obj.FindingId = item.FindingId;
                        $scope.obj.FindingName = item.FindingName;
                        $scope.obj.FindingValue = item.FindingValue;
                        $scope.obj.InvFindingId = item.InvFindingId;
                        angular.forEach(item.FindingsValues, function (ritem) {
                            if (ritem.LevelType == "Level1") {
                                var obj = {
                                    "DeleteInd": ritem.DeleteInd || "N",
                                    "InvFindingId": ritem.InvFindingId || 0,
                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                    "LevelType": ritem.LevelType || 'Level1',
                                    "FindingValue": ritem.FindingValue || '',
                                    "IsCheckFindingValue": false,
                                }
                                $scope.obj.SubFindingArrayInLevel1.push(obj);
                            } else if (ritem.LevelType == "Level2") {
                                var obj1 = {
                                    "DeleteInd": ritem.DeleteInd || "N",
                                    "InvFindingId": ritem.InvFindingId || 0,
                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                    "LevelType": ritem.LevelType || 'Level2',
                                    "FindingValue": ritem.FindingValue || '',
                                    "IsCheckFindingValue": false,
                                }
                                $scope.obj.SubFindingArrayInLevel2.push(obj1);
                            } else if (ritem.LevelType == "Level3") {
                                var obj1 = {
                                    "DeleteInd": ritem.DeleteInd || "N",
                                    "InvFindingId": ritem.InvFindingId || 0,
                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                    "LevelType": ritem.LevelType || "Level3",
                                    "FindingValue": ritem.FindingValue || '',
                                    "IsCheckFindingValue": false,
                                }
                                $scope.obj.SubFindingArrayInLevel3.push(obj1);
                            } else if (ritem.LevelType == "Level4") {
                                var obj1 = {
                                    "DeleteInd": ritem.DeleteInd || "N",
                                    "InvFindingId": ritem.InvFindingId || 0,
                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                    "LevelType": ritem.LevelType || "Level4",
                                    "FindingValue": ritem.FindingValue || '',
                                    "IsCheckFindingValue": false,
                                }
                                $scope.obj.SubFindingArrayInLevel4.push(obj1);
                            }
                        });
                    }
                    if ($scope.AnteriorSegmentArrayNew.length > 0) {
                        angular.forEach($scope.AnteriorSegmentArrayNew, function (Aitem) {
                            if (Aitem.RemarksArray.length > 0) {
                                angular.forEach(Aitem.RemarksArray, function (Bitem) {
                                    if (Bitem.SubFindingList.length > 0) {
                                        angular.forEach(Bitem.SubFindingList, function (Citem) {
                                            if (AntObj.SelectedINVEye == 3) {

                                                var filterODRemarkslist = $filter("filter")(Aitem.RemarksArray, function (iterator, ind) { return iterator.OrganId == 1 }) || [];
                                                var filterOSRemarkslist = $filter("filter")(Aitem.RemarksArray, function (iterator, ind) { return iterator.OrganId == 2 }) || [];
                                                if (filterODRemarkslist.length > 0 && filterOSRemarkslist.length > 0) {
                                                    angular.forEach(filterODRemarkslist, function (pitem) {
                                                        angular.forEach(pitem.SubFindingList, function (qitem) {
                                                            angular.forEach(filterOSRemarkslist, function (ritem) {
                                                                var filterBothFindingList = $filter("filter")(ritem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == qitem.InvFindingLevelId }) || [];
                                                                if (filterBothFindingList.length > 0) {
                                                                    angular.forEach(filterBothFindingList, function (Citem) {
                                                                        if (Citem.LevelType == 'Level1') {
                                                                            angular.forEach($scope.obj.SubFindingArrayInLevel1, function (Ditem) {
                                                                                if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                                    Ditem.IsCheckFindingValue = true;
                                                                                }
                                                                            });
                                                                        }
                                                                        else if (Citem.LevelType == 'Level2') {
                                                                            angular.forEach($scope.obj.SubFindingArrayInLevel2, function (Ditem) {
                                                                                if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                                    Ditem.IsCheckFindingValue = true;
                                                                                }
                                                                            });
                                                                        } else if (Citem.LevelType == 'Level3') {
                                                                            angular.forEach($scope.obj.SubFindingArrayInLevel3, function (Ditem) {
                                                                                if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                                    Ditem.IsCheckFindingValue = true;
                                                                                }
                                                                            });
                                                                        } else if (Citem.LevelType == 'Level4') {
                                                                            angular.forEach($scope.obj.SubFindingArrayInLevel4, function (Ditem) {
                                                                                if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                                    Ditem.IsCheckFindingValue = true;
                                                                                }
                                                                            });
                                                                        }
                                                                        else {

                                                                        }
                                                                    });
                                                                }

                                                            });
                                                        });
                                                    });

                                                }


                                            } else {
                                                if (AntObj.SelectedINVEye == Bitem.OrganId) {
                                                    if (Citem.LevelType == 'Level1') {
                                                        angular.forEach($scope.obj.SubFindingArrayInLevel1, function (Ditem) {
                                                            if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                Ditem.IsCheckFindingValue = true;
                                                            }
                                                        });
                                                    } else if (Citem.LevelType == 'Level2') {
                                                        angular.forEach($scope.obj.SubFindingArrayInLevel2, function (Ditem) {
                                                            if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                Ditem.IsCheckFindingValue = true;
                                                            }
                                                        });
                                                    } else if (Citem.LevelType == 'Level3') {
                                                        angular.forEach($scope.obj.SubFindingArrayInLevel3, function (Ditem) {
                                                            if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                Ditem.IsCheckFindingValue = true;
                                                            }
                                                        });
                                                    } else if (Citem.LevelType == 'Level4') {
                                                        angular.forEach($scope.obj.SubFindingArrayInLevel4, function (Ditem) {
                                                            if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                Ditem.IsCheckFindingValue = true;
                                                            }
                                                        });
                                                    } else {

                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }

                    angular.forEach($scope.chunkedAnteriorINVDropdownList, function (chunk) {
                        angular.forEach(chunk, function (subinv) {
                            subinv.IsSubFindingsPopOverOD = false;
                            subinv.IsSubFindingsPopOverOS = false;
                            subinv.IsSubFindingsPopOverOU = false;
                        });
                    });

                    if (OrganType == "OD") {
                        if (item.FindingsValues.length > 0) {
                            angular.forEach($scope.chunkedAnteriorINVDropdownList, function (chunk) {
                                angular.forEach(chunk, function (subinv) {
                                    if (subinv.InvFindingId === item.InvFindingId) {
                                        subinv.IsSubFindingsPopOverOD = true;
                                    }
                                });
                            });
                        }
                    } else if (OrganType == "OS") {
                        if (item.FindingsValues.length > 0) {
                            angular.forEach($scope.chunkedAnteriorINVDropdownList, function (chunk) {
                                angular.forEach(chunk, function (subinv) {
                                    if (subinv.InvFindingId === item.InvFindingId) {
                                        subinv.IsSubFindingsPopOverOS = true;
                                    }
                                });
                            });
                        }
                    }
                    else if (OrganType == "OU") {
                        if (item.FindingsValues.length > 0) {
                            angular.forEach($scope.chunkedAnteriorINVDropdownList, function (chunk) {
                                angular.forEach(chunk, function (subinv) {
                                    if (subinv.InvFindingId === item.InvFindingId) {
                                        subinv.IsSubFindingsPopOverOU = true;
                                    }
                                });
                            });
                        }
                    }
                }
            }
            else if (catid == 6) {
               
                item = item || '';
               var posterObj = AntObj || '';

            if (OrganType == "OD") {
                posterObj.SelectedINVEye = 1;
            } else if (OrganType == "OS") {
                posterObj.SelectedINVEye = 2;
            } else if (OrganType == "OU") {
                posterObj.SelectedINVEye = 3;
            }
            if (item.FindingsValues.length == 0) {
                $scope.SelectedFindingPosteriorSegmentValue1(posterObj, item, 6);
            } else {
                $scope.obj = {
                    "FindingId": null,
                    "FindingName": '',
                    "FindingValue": '',
                    "InvFindingId": null,
                    "Organ": posterObj.SelectedINVEye || 1,
                    "AntorpostrId": posterObj.CatId || null,
                    "SubFindingArrayInLevel1": [],
                    "SubFindingArrayInLevel2": [],
                    "SubFindingArrayInLevel3": [],
                    "SubFindingArrayInLevel4": [],
                }


                if (item.FindingsValues.length > 0) {
                    $scope.obj.FindingId = item.FindingId;
                    $scope.obj.FindingName = item.FindingName;
                    $scope.obj.FindingValue = item.FindingValue;
                    $scope.obj.InvFindingId = item.InvFindingId;
                    angular.forEach(item.FindingsValues, function (ritem) {
                        if (ritem.LevelType == "Level1") {
                            var obj = {
                                "DeleteInd": ritem.DeleteInd || "N",
                                "InvFindingId": ritem.InvFindingId || 0,
                                "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                "LevelType": ritem.LevelType || 'Level1',
                                "FindingValue": ritem.FindingValue || '',
                                "IsCheckFindingValue": false,
                            }
                            $scope.obj.SubFindingArrayInLevel1.push(obj);
                        } else if (ritem.LevelType == "Level2") {
                            var obj1 = {
                                "DeleteInd": ritem.DeleteInd || "N",
                                "InvFindingId": ritem.InvFindingId || 0,
                                "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                "LevelType": ritem.LevelType || 'Level2',
                                "FindingValue": ritem.FindingValue || '',
                                "IsCheckFindingValue": false,
                            }
                            $scope.obj.SubFindingArrayInLevel2.push(obj1);
                        } else if (ritem.LevelType == "Level3") {
                            var obj1 = {
                                "DeleteInd": ritem.DeleteInd || "N",
                                "InvFindingId": ritem.InvFindingId || 0,
                                "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                "LevelType": ritem.LevelType || "Level3",
                                "FindingValue": ritem.FindingValue || '',
                                "IsCheckFindingValue": false,
                            }
                            $scope.obj.SubFindingArrayInLevel3.push(obj1);
                        } else if (ritem.LevelType == "Level4") {
                            var obj1 = {
                                "DeleteInd": ritem.DeleteInd || "N",
                                "InvFindingId": ritem.InvFindingId || 0,
                                "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                "LevelType": ritem.LevelType || "Level4",
                                "FindingValue": ritem.FindingValue || '',
                                "IsCheckFindingValue": false,
                            }
                            $scope.obj.SubFindingArrayInLevel4.push(obj1);
                        }
                    });
                }
                if ($scope.PoteriorSegmentArrayNew.length > 0) {
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (Aitem) {
                        if (Aitem.RemarksArray.length > 0) {
                            angular.forEach(Aitem.RemarksArray, function (Bitem) {
                                if (Bitem.SubFindingList.length > 0) {
                                    angular.forEach(Bitem.SubFindingList, function (Citem) {
                                        if (posterObj.SelectedINVEye == 3) {

                                            var filterODRemarkslist = $filter("filter")(Aitem.RemarksArray, function (iterator, ind) { return iterator.OrganId == 1 }) || [];
                                            var filterOSRemarkslist = $filter("filter")(Aitem.RemarksArray, function (iterator, ind) { return iterator.OrganId == 2 }) || [];
                                            if (filterODRemarkslist.length > 0) {
                                                angular.forEach(filterODRemarkslist, function (pitem) {
                                                    angular.forEach(pitem.SubFindingList, function (qitem) {
                                                        angular.forEach(filterOSRemarkslist, function (ritem) {
                                                            var filterBothFindingList = $filter("filter")(ritem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == qitem.InvFindingLevelId }) || [];
                                                            if (filterBothFindingList.length > 0) {
                                                                angular.forEach(filterBothFindingList, function (Citem) {
                                                                    if (Citem.LevelType == 'Level1') {
                                                                        angular.forEach($scope.obj.SubFindingArrayInLevel1, function (Ditem) {
                                                                            if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                                Ditem.IsCheckFindingValue = true;
                                                                            }
                                                                        });
                                                                    }
                                                                    else if (Citem.LevelType == 'Level2') {
                                                                        angular.forEach($scope.obj.SubFindingArrayInLevel2, function (Ditem) {
                                                                            if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                                Ditem.IsCheckFindingValue = true;
                                                                            }
                                                                        });
                                                                    } else if (Citem.LevelType == 'Level3') {
                                                                        angular.forEach($scope.obj.SubFindingArrayInLevel3, function (Ditem) {
                                                                            if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                                Ditem.IsCheckFindingValue = true;
                                                                            }
                                                                        });
                                                                    } else if (Citem.LevelType == 'Level4') {
                                                                        angular.forEach($scope.obj.SubFindingArrayInLevel4, function (Ditem) {
                                                                            if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                                                Ditem.IsCheckFindingValue = true;
                                                                            }
                                                                        });
                                                                    }
                                                                    else {

                                                                    }
                                                                });
                                                            }

                                                        });
                                                    });
                                                });

                                            }


                                        } else {
                                            if (posterObj.SelectedINVEye == Bitem.OrganId) {
                                                if (Citem.LevelType == 'Level1') {
                                                    angular.forEach($scope.obj.SubFindingArrayInLevel1, function (Ditem) {
                                                        if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                            Ditem.IsCheckFindingValue = true;
                                                        }
                                                    });
                                                } else if (Citem.LevelType == 'Level2') {
                                                    angular.forEach($scope.obj.SubFindingArrayInLevel2, function (Ditem) {
                                                        if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                            Ditem.IsCheckFindingValue = true;
                                                        }
                                                    });
                                                } else if (Citem.LevelType == 'Level3') {
                                                    angular.forEach($scope.obj.SubFindingArrayInLevel3, function (Ditem) {
                                                        if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                            Ditem.IsCheckFindingValue = true;
                                                        }
                                                    });
                                                } else if (Citem.LevelType == 'Level4') {
                                                    angular.forEach($scope.obj.SubFindingArrayInLevel4, function (Ditem) {
                                                        if (Ditem.InvFindingLevelId == Citem.InvFindingLevelId) {
                                                            Ditem.IsCheckFindingValue = true;
                                                        }
                                                    });
                                                } else {

                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }

                angular.forEach($scope.chunkedPosteriorINVDropdownList, function (chunk) {
                    angular.forEach(chunk, function (subinv) {
                        subinv.IsSubFindingsPopOverOD = false;
                        subinv.IsSubFindingsPopOverOS = false;
                        subinv.IsSubFindingsPopOverOU = false;
                    });
                });

                if (OrganType == "OD") {
                    if (item.FindingsValues.length > 0) {
                        angular.forEach($scope.chunkedPosteriorINVDropdownList, function (chunk) {
                            angular.forEach(chunk, function (subinv) {
                                if (subinv.InvFindingId === item.InvFindingId) {
                                    subinv.IsSubFindingsPopOverOD = true;
                                }
                            });
                        });
                    }
                } else if (OrganType == "OS") {
                    if (item.FindingsValues.length > 0) {
                        angular.forEach($scope.chunkedPosteriorINVDropdownList, function (chunk) {
                            angular.forEach(chunk, function (subinv) {
                                if (subinv.InvFindingId === item.InvFindingId) {
                                    subinv.IsSubFindingsPopOverOS = true;
                                }
                            });
                        });
                    }
                }
                else if (OrganType == "OU") {
                    if (item.FindingsValues.length > 0) {
                        angular.forEach($scope.chunkedPosteriorINVDropdownList, function (chunk) {
                            angular.forEach(chunk, function (subinv) {
                                if (subinv.InvFindingId === item.InvFindingId) {
                                    subinv.IsSubFindingsPopOverOU = true;
                                }
                            });
                        });
                    }
                }
           
        };
            } else {}
        };

        

        $scope.closeSubFindingPopup = function (item) {
            if (item.AntorpostrId == 5) {
                angular.forEach($scope.chunkedAnteriorINVDropdownList, function (chunk) {
                    angular.forEach(chunk, function (subinv) {
                        subinv.IsSubFindingsPopOverOD = false;
                        subinv.IsSubFindingsPopOverOS = false;
                        subinv.IsSubFindingsPopOverOU = false;
                    });
                });
            } else if (item.AntorpostrId == 6) {
                angular.forEach($scope.chunkedPosteriorINVDropdownList, function (chunk) {
                    angular.forEach(chunk, function (subinv) {
                        subinv.IsSubFindingsPopOverOD = false;
                        subinv.IsSubFindingsPopOverOS = false;
                        subinv.IsSubFindingsPopOverOU = false;
                    });
                });
            } else {}
        }

        $scope.SelectedFindingAnteriorSegmentValue1 = function (selectedinv, item, CategoryId) {
            var i = 0;
            var count = [];
            var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
            if ($scope.AnteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (Ritem) {
                            Ritem.IsShowNotesTextBox = false;
                        });
                    }
                });
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        count = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.OrganId === selectedinv.SelectedINVEye && fitem.ActiveInd == "Y" });
                        if (count.length !== 0) {
                            i++;
                        }
                    }
                });
            }

            if (i !== 0) {
                $scope.newAnteriorObj.AnteriorSearchObj = '';
                $scope.newAnteriorObj.OSAnteriorSearchObj = '';
                alertify.error("This Item is Already Added");
                return false;
            }

            var filetrarray = $filter("filter")($scope.AnteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.FindingId }) || [];
            if (filetrarray.length == 0) {

                if (selectedinv.SelectedINVEye == 3) {
                    var object = {
                        "PatientFindingAnteriorId": 0,
                        "IsNormal": false,
                        "CategoryId": 5,
                        "CategoryDesc": "Anterior Segment",
                        "InvestigationId": item.FindingId || 0,
                        "InvestigationDesc": item.FindingName || "",
                        "OrderBY": item.OrderBY||0,
                        "ActiveInd": "Y",
                        "SelectedGlobalSearch": "",
                        "SelectedRightEye": 1,
                        "SelectedLeftEye": 0,
                        "RemarksArray": [
                            {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": 1,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            },
                            {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": 2,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        ],

                    };

                    $scope.AnteriorSegmentArrayNew.push(object);
                } else {
                    var object = {
                        "PatientFindingAnteriorId": 0,
                        "IsNormal": false,
                        "CategoryId": 5,
                        "CategoryDesc": "Anterior Segment",
                        "InvestigationId": item.FindingId || 0,
                        "InvestigationDesc": item.FindingName || "",
                        "ActiveInd": "Y",
                        "SelectedGlobalSearch": "",
                        "SelectedRightEye": 1,
                        "SelectedLeftEye": 0,
                        "RemarksArray": [],
                        "OrderBY": item.OrderBY || 0,

                    };

                    if (selectedinv.SelectedINVEye == 1) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": item.InvFindingId || 0,
                            "FindingValue": item.FindingValue || '',
                            "OrganId": selectedinv.SelectedINVEye || 1,
                            "FindingId": item.FindingId || 0,
                            "FindingName": item.FindingName || '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": "",
                            "IsShowNotesTextBox": true,
                            "SubFindingList": []
                        }
                    } else if (selectedinv.SelectedINVEye == 2) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": item.InvFindingId || 0,
                            "FindingValue": item.FindingValue || '',
                            "OrganId": selectedinv.SelectedINVEye || 2,
                            "FindingId": item.FindingId || 0,
                            "FindingName": item.FindingName || '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": "",
                            "IsShowNotesTextBox": true,
                            "SubFindingList": []
                        }
                    }
                    object.RemarksArray.push(obj);

                    $scope.AnteriorSegmentArrayNew.push(object);
                }

               
            }
            else {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.InvestigationId == item.FindingId) {
                        if (selectedinv.SelectedINVEye == 3) {
                            var objOrgId1 = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": 1,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                            var objOrgId2 = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": 2,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }

                            var RemarksOrgId1 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == item.InvFindingId && repeat.OrganId == 1}) || [];
                            if (RemarksOrgId1.length == 0) {
                                Mitem.RemarksArray.push(objOrgId1);
                            }

                            var RemarksOrgId2 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == item.InvFindingId && repeat.OrganId == 2 }) || [];
                            if (RemarksOrgId2.length == 0) {
                                Mitem.RemarksArray.push(objOrgId2);
                            }

                        } else {
                            if (selectedinv.SelectedINVEye == 1) {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || '',
                                    "OrganId": selectedinv.SelectedINVEye || 1,
                                    "FindingId": item.FindingId || 0,
                                    "FindingName": item.FindingName || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": true,
                                    "SubFindingList": []
                                }
                            } else if (selectedinv.SelectedINVEye == 2) {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || '',
                                    "OrganId": selectedinv.SelectedINVEye || 2,
                                    "FindingId": item.FindingId || 0,
                                    "FindingName": item.FindingName || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": true,
                                    "SubFindingList": []
                                }
                            } else { }

                            if (Mitem.RemarksArray.length > 0) {
                                angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                    angular.forEach(temparray, function (tempitem, index1) {
                                        if (hitem.OrganId == selectedinv.SelectedINVEye && hitem.InvFindingId === tempitem.InvFindingId) {
                                            if (hitem.RemarksId === 0) {
                                                Mitem.RemarksArray.splice(index, 1);
                                            }
                                            else {
                                                hitem.ActiveInd = 'N';
                                            }
                                        }
                                    });

                                });
                            }
                            Mitem.RemarksArray.push(obj);
                        }
                    }
                });
            }
        };

        $scope.SelectedFindingPosteriorSegmentValue1 = function (selectedinv, item, CategoryId) {


            var i = 0;
            var count = [];
            var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
            if ($scope.PoteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (Ritem) {
                            Ritem.IsShowNotesTextBox = false;
                        });
                    }
                });
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        count = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.OrganId === selectedinv.SelectedINVEye && fitem.ActiveInd == "Y" });
                        if (count.length !== 0) {
                            i++;
                        }
                    }
                });
            }

            if (i !== 0) {
                $scope.newAnteriorObj.AnteriorSearchObj = '';
                $scope.newAnteriorObj.OSAnteriorSearchObj = '';
                alertify.error("This Item is Already Added");
                return false;
            }

            var filetrarray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.FindingId }) || [];
            if (filetrarray.length == 0) {

                if (selectedinv.SelectedINVEye == 3) {
                    var object = {
                        "PatientFindingAnteriorId": 0,
                        "IsNormal": false,
                        "CategoryId": 5,
                        "CategoryDesc": "Anterior Segment",
                        "InvestigationId": item.FindingId || 0,
                        "InvestigationDesc": item.FindingName || "",
                        "ActiveInd": "Y",
                        "SelectedGlobalSearch": "",
                        "SelectedRightEye": 1,
                        "SelectedLeftEye": 0,
                        "RemarksArray": [
                            {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": 1,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            },
                            {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": 2,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        ],

                    };

                    $scope.PoteriorSegmentArrayNew.push(object);
                } else {
                    var object = {
                        "PatientFindingAnteriorId": 0,
                        "IsNormal": false,
                        "CategoryId": 5,
                        "CategoryDesc": "Anterior Segment",
                        "InvestigationId": item.FindingId || 0,
                        "InvestigationDesc": item.FindingName || "",
                        "ActiveInd": "Y",
                        "SelectedGlobalSearch": "",
                        "SelectedRightEye": 1,
                        "SelectedLeftEye": 0,
                        "RemarksArray": [],

                    };

                    if (selectedinv.SelectedINVEye == 1) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": item.InvFindingId || 0,
                            "FindingValue": item.FindingValue || '',
                            "OrganId": selectedinv.SelectedINVEye || 1,
                            "FindingId": item.FindingId || 0,
                            "FindingName": item.FindingName || '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": "",
                            "IsShowNotesTextBox": true,
                            "SubFindingList": []
                        }
                    } else if (selectedinv.SelectedINVEye == 2) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": item.InvFindingId || 0,
                            "FindingValue": item.FindingValue || '',
                            "OrganId": selectedinv.SelectedINVEye || 2,
                            "FindingId": item.FindingId || 0,
                            "FindingName": item.FindingName || '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": "",
                            "IsShowNotesTextBox": true,
                            "SubFindingList": []
                        }
                    }
                    object.RemarksArray.push(obj);

                    $scope.PoteriorSegmentArrayNew.push(object);
                }


            }
            else {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.InvestigationId == item.FindingId) {
                        if (selectedinv.SelectedINVEye == 3) {
                            var objOrgId1 = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": 1,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                            var objOrgId2 = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": 2,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }

                            var RemarksOrgId1 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == item.InvFindingId && repeat.OrganId == 1 }) || [];
                            if (RemarksOrgId1.length == 0) {
                                Mitem.RemarksArray.push(objOrgId1);
                            }

                            var RemarksOrgId2 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == item.InvFindingId && repeat.OrganId == 2 }) || [];
                            if (RemarksOrgId2.length == 0) {
                                Mitem.RemarksArray.push(objOrgId2);
                            }

                        } else {
                            if (selectedinv.SelectedINVEye == 1) {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || '',
                                    "OrganId": selectedinv.SelectedINVEye || 1,
                                    "FindingId": item.FindingId || 0,
                                    "FindingName": item.FindingName || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": true,
                                    "SubFindingList": []
                                }
                            } else if (selectedinv.SelectedINVEye == 2) {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || '',
                                    "OrganId": selectedinv.SelectedINVEye || 2,
                                    "FindingId": item.FindingId || 0,
                                    "FindingName": item.FindingName || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": true,
                                    "SubFindingList": []
                                }
                            } else { }

                            if (Mitem.RemarksArray.length > 0) {
                                angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                    angular.forEach(temparray, function (tempitem, index1) {
                                        if (hitem.OrganId == selectedinv.SelectedINVEye && hitem.InvFindingId === tempitem.InvFindingId) {
                                            if (hitem.RemarksId === 0) {
                                                Mitem.RemarksArray.splice(index, 1);
                                            }
                                            else {
                                                hitem.ActiveInd = 'N';
                                            }
                                        }
                                    });

                                });
                            }
                            Mitem.RemarksArray.push(obj);
                        }
                    }
                });
            }

        };

        $scope.ChangeFindingASValue1 = function (selectedinv, item, CategoryId, Organ) {
            if (Organ == 'OD') {
                selectedinv.SelectedEye = 1;
            } else if ('OS') {
                selectedinv.SelectedEye = 2;
            }
            var count = [];
            var i = 0;
            var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);

            if ($scope.AnteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (Ritem) {
                            Ritem.IsShowNotesTextBox = false;
                        });
                    }
                });
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        count = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.OrganId === selectedinv.SelectedEye });
                        if (count.length !== 0) {
                            i++;
                        }
                    }
                });
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem, index) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                            angular.forEach(temparray, function (tempitem, index1) {
                                if (hitem.OrganId == selectedinv.SelectedEye && hitem.InvFindingId === tempitem.InvFindingId && item.FindingId == Mitem.InvestigationId) {
                                    if (hitem.RemarksId === 0) {
                                        Mitem.RemarksArray.splice(index, 1);
                                    }
                                    else {
                                        hitem.ActiveInd = 'N';
                                    }
                                }
                            });

                        });
                    }
                });
            }

            if (i !== 0) {
                $scope.newAnteriorObj.AnteriorSearchObj = '';
                $scope.newAnteriorObj.OSAnteriorSearchObj = '';
                alertify.error("This Item is Already Added");
                return false;
            }

            var filetrarray = $filter("filter")($scope.AnteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.FindingId }) || [];
            if (filetrarray.length == 0) {

                var object = {
                    "PatientFindingAnteriorId": 0,
                    "IsNormal": false,
                    "CategoryId": 5,
                    "CategoryDesc": "Anterior Segment",
                    "InvestigationId": item.FindingId || 0,
                    "InvestigationDesc": item.FindingName || "",
                    "ActiveInd": "Y",
                    "SelectedGlobalSearch": "",
                    "SelectedRightEye": 1,
                    "SelectedLeftEye": 0,
                    "RemarksArray": [],

                };

                if (selectedinv.SelectedEye == 1) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": item.InvFindingId || 0,
                        "FindingValue": item.FindingValue || '',
                        "OrganId": selectedinv.SelectedEye || 1,
                        "FindingId": item.FindingId || 0,
                        "FindingName": item.FindingName || '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": false,
                        "SubFindingList": []
                    }
                    $scope.cacheStorageItem.AnteriorODIsNormal = false;
                } else if (selectedinv.SelectedEye == 2) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": item.InvFindingId || 0,
                        "FindingValue": item.FindingValue || '',
                        "OrganId": selectedinv.SelectedEye || 2,
                        "FindingId": item.FindingId || 0,
                        "FindingName": item.FindingName || '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": false,
                        "SubFindingList": []
                    }
                    $scope.cacheStorageItem.AnteriorOSIsNormal = false;
                }
                object.RemarksArray.push(obj);

                $scope.AnteriorSegmentArrayNew.push(object);


            } else {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.InvestigationId == item.FindingId) {
                        if (selectedinv.SelectedEye == 1) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": selectedinv.SelectedEye || 1,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": false,
                                "SubFindingList": []
                            }
                            $scope.cacheStorageItem.AnteriorODIsNormal = false;
                        } else if (selectedinv.SelectedEye == 2) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || '',
                                "OrganId": selectedinv.SelectedEye || 2,
                                "FindingId": item.FindingId || 0,
                                "FindingName": item.FindingName || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": false,
                                "SubFindingList": []
                            }
                            $scope.cacheStorageItem.AnteriorOSIsNormal = false;
                        }
                        Mitem.RemarksArray.push(obj);
                    }
                });
            }
            $scope.newAnteriorObj.AnteriorSearchObj = '';
            $scope.newAnteriorObj.OSAnteriorSearchObj = '';
        };

        $scope.SelectSubFindingValue1 = function (ritem, Selectedobj) {
            if (Selectedobj.AntorpostrId == 5) {
                var FilteredAntArray = $filter("filter")($scope.AnteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == Selectedobj.FindingId }) || [];
                if (FilteredAntArray.length !== 0) {
                    angular.forEach(FilteredAntArray, function (Mitem) {
                        if (Mitem.RemarksArray.length > 0) {
                            var FilteredRemarksArray = $filter("filter")(Mitem.RemarksArray, function (iterator, ind) { return iterator.InvFindingId == ritem.InvFindingId }) || [];

                            if (FilteredRemarksArray.length == 0) {
                                if (Selectedobj.Organ == 3) {

                                    var objOrgId1 = {
                                        "RemarksId": 0,
                                        "InvFindingId": Selectedobj.InvFindingId || 0,
                                        "FindingValue": Selectedobj.FindingValue || '',
                                        "OrganId": 1,
                                        "FindingId": Selectedobj.FindingId || 0,
                                        "FindingName": Selectedobj.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": [
                                            {
                                                "AnteriorSegmentRemarksLevelId": 0,
                                                "DeleteInd": ritem.DeleteInd || "N",
                                                "InvFindingId": ritem.InvFindingId || 0,
                                                "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                "LevelType": ritem.LevelType || '',
                                                "FindingValue": ritem.FindingValue || '',
                                                "IsCheckFindingValue": true,
                                            }
                                        ]
                                    }
                                    var objOrgId2 = {
                                        "RemarksId": 0,
                                        "InvFindingId": Selectedobj.InvFindingId || 0,
                                        "FindingValue": Selectedobj.FindingValue || '',
                                        "OrganId": 2,
                                        "FindingId": Selectedobj.FindingId || 0,
                                        "FindingName": Selectedobj.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": [
                                            {
                                                "AnteriorSegmentRemarksLevelId": 0,
                                                "DeleteInd": ritem.DeleteInd || "N",
                                                "InvFindingId": ritem.InvFindingId || 0,
                                                "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                "LevelType": ritem.LevelType || '',
                                                "FindingValue": ritem.FindingValue || '',
                                                "IsCheckFindingValue": true,
                                            }
                                        ]
                                    }

                                    var RemarksOrgId1 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 1 }) || [];
                                    if (RemarksOrgId1.length == 0) {
                                        Mitem.RemarksArray.push(objOrgId1);
                                    }

                                    var RemarksOrgId2 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 2 }) || [];
                                    if (RemarksOrgId2.length == 0) {
                                        Mitem.RemarksArray.push(objOrgId2);
                                    }

                                } else {
                                    var obj = {
                                        "RemarksId": 0,
                                        "InvFindingId": Selectedobj.InvFindingId || 0,
                                        "FindingValue": Selectedobj.FindingValue || '',
                                        "OrganId": Selectedobj.Organ || 1,
                                        "FindingId": Selectedobj.FindingId || 0,
                                        "FindingName": Selectedobj.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": []
                                    }
                                    var obj1 = {
                                        "AnteriorSegmentRemarksLevelId": 0,
                                        "DeleteInd": ritem.DeleteInd || "N",
                                        "InvFindingId": ritem.InvFindingId || 0,
                                        "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                        "LevelType": ritem.LevelType || '',
                                        "FindingValue": ritem.FindingValue || '',
                                        "IsCheckFindingValue": true,
                                    }
                                    obj.SubFindingList.push(obj1);
                                    Mitem.RemarksArray.push(obj);
                                }
                            } else {

                                angular.forEach(Mitem.RemarksArray, function (Nitem) {
                                    if (Selectedobj.Organ == 3) {
                                        var filetrarray1 = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == ritem.InvFindingLevelId }) || [];
                                        if (filetrarray1.length == 0) {
                                            var obj1 = {
                                                "AnteriorSegmentRemarksLevelId": 0,
                                                "DeleteInd": ritem.DeleteInd || "N",
                                                "InvFindingId": ritem.InvFindingId || 0,
                                                "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                "LevelType": ritem.LevelType || '',
                                                "FindingValue": ritem.FindingValue || '',
                                                "IsCheckFindingValue": true,
                                            }
                                            if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                Nitem.SubFindingList.push(obj1);
                                            }
                                        } else {
                                             angular.forEach(Nitem.SubFindingList, function (Mitem, index) {
                                                if (Mitem.InvFindingLevelId == ritem.InvFindingLevelId) {
                                                    Nitem.SubFindingList.splice(index, 1);
                                                }
                                            });
                                        }

                                        var objOrgId1 = {
                                            "RemarksId": 0,
                                            "InvFindingId": Selectedobj.InvFindingId || 0,
                                            "FindingValue": Selectedobj.FindingValue || '',
                                            "OrganId": 1,
                                            "FindingId": Selectedobj.FindingId || 0,
                                            "FindingName": Selectedobj.FindingName || '',
                                            "DiagnosisRiskLevel": "",
                                            "ActiveInd": "Y",
                                            "Notes": "",
                                            "IsShowNotesTextBox": true,
                                            "SubFindingList": [
                                                {
                                                    "AnteriorSegmentRemarksLevelId": 0,
                                                    "DeleteInd": ritem.DeleteInd || "N",
                                                    "InvFindingId": ritem.InvFindingId || 0,
                                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                    "LevelType": ritem.LevelType || '',
                                                    "FindingValue": ritem.FindingValue || '',
                                                    "IsCheckFindingValue": true,
                                                }
                                            ]
                                        }

                                        var objOrgId2 = {
                                            "RemarksId": 0,
                                            "InvFindingId": Selectedobj.InvFindingId || 0,
                                            "FindingValue": Selectedobj.FindingValue || '',
                                            "OrganId": 2,
                                            "FindingId": Selectedobj.FindingId || 0,
                                            "FindingName": Selectedobj.FindingName || '',
                                            "DiagnosisRiskLevel": "",
                                            "ActiveInd": "Y",
                                            "Notes": "",
                                            "IsShowNotesTextBox": true,
                                            "SubFindingList": [
                                                {
                                                    "AnteriorSegmentRemarksLevelId": 0,
                                                    "DeleteInd": ritem.DeleteInd || "N",
                                                    "InvFindingId": ritem.InvFindingId || 0,
                                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                    "LevelType": ritem.LevelType || '',
                                                    "FindingValue": ritem.FindingValue || '',
                                                    "IsCheckFindingValue": true,
                                                }
                                            ]
                                        }

                                        var RemarksOrgId1 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 1 }) || [];
                                        if (RemarksOrgId1.length == 0) {
                                            Mitem.RemarksArray.push(objOrgId1);
                                        }
                                        var RemarksOrgId2 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 2 }) || [];
                                        if (RemarksOrgId2.length == 0) {
                                            Mitem.RemarksArray.push(objOrgId2);
                                        }
                                    } else {
                                        var FilterRemarksArray = $filter("filter")(Mitem.RemarksArray, function (iterator, ind) { return iterator.InvFindingId == ritem.InvFindingId && iterator.OrganId == Selectedobj.Organ }) || [];
                                        if (FilterRemarksArray.length == 0) {
                                            var objOrgId1 = {
                                                "RemarksId": 0,
                                                "InvFindingId": Selectedobj.InvFindingId || 0,
                                                "FindingValue": Selectedobj.FindingValue || '',
                                                "OrganId": 1,
                                                "FindingId": Selectedobj.FindingId || 0,
                                                "FindingName": Selectedobj.FindingName || '',
                                                "DiagnosisRiskLevel": "",
                                                "ActiveInd": "Y",
                                                "Notes": "",
                                                "IsShowNotesTextBox": true,
                                                "SubFindingList": [
                                                    {
                                                        "AnteriorSegmentRemarksLevelId": 0,
                                                        "DeleteInd": ritem.DeleteInd || "N",
                                                        "InvFindingId": ritem.InvFindingId || 0,
                                                        "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                        "LevelType": ritem.LevelType || '',
                                                        "FindingValue": ritem.FindingValue || '',
                                                        "IsCheckFindingValue": true,
                                                    }
                                                ]
                                            }

                                            var objOrgId2 = {
                                                "RemarksId": 0,
                                                "InvFindingId": Selectedobj.InvFindingId || 0,
                                                "FindingValue": Selectedobj.FindingValue || '',
                                                "OrganId": 2,
                                                "FindingId": Selectedobj.FindingId || 0,
                                                "FindingName": Selectedobj.FindingName || '',
                                                "DiagnosisRiskLevel": "",
                                                "ActiveInd": "Y",
                                                "Notes": "",
                                                "IsShowNotesTextBox": true,
                                                "SubFindingList": [
                                                    {
                                                        "AnteriorSegmentRemarksLevelId": 0,
                                                        "DeleteInd": ritem.DeleteInd || "N",
                                                        "InvFindingId": ritem.InvFindingId || 0,
                                                        "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                        "LevelType": ritem.LevelType || '',
                                                        "FindingValue": ritem.FindingValue || '',
                                                        "IsCheckFindingValue": true,
                                                    }
                                                ]
                                            }

                                            var RemarksOrgId1 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 1 }) || [];
                                            if (RemarksOrgId1.length == 0) {
                                                Mitem.RemarksArray.push(objOrgId1);
                                            } else if (Nitem.OrganId == 1) {
                                                var filetrarray1 = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == ritem.InvFindingLevelId }) || [];
                                                if (filetrarray1.length == 0 && Selectedobj.Organ == 1) {
                                                    var obj1 = {
                                                        "AnteriorSegmentRemarksLevelId": 0,
                                                        "DeleteInd": ritem.DeleteInd || "N",
                                                        "InvFindingId": ritem.InvFindingId || 0,
                                                        "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                        "LevelType": ritem.LevelType || '',
                                                        "FindingValue": ritem.FindingValue || '',
                                                        "IsCheckFindingValue": true,
                                                    }

                                                    if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                        Nitem.SubFindingList.push(obj1);
                                                    }
                                                } else {
                                                    angular.forEach(Nitem.SubFindingList, function (Mitem, index) {
                                                        if (Mitem.InvFindingLevelId == ritem.InvFindingLevelId) {
                                                            Nitem.SubFindingList.splice(index, 1);
                                                        }
                                                    });
                                                }
                                            }
                                            else { }
                                            var RemarksOrgId2 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 2 }) || [];
                                            if (RemarksOrgId2.length == 0) {
                                                Mitem.RemarksArray.push(objOrgId2);
                                            } else if (Nitem.OrganId == 2) {
                                                {
                                                    var filetrarray1 = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == ritem.InvFindingLevelId }) || [];
                                                    if (filetrarray1.length == 0 && Selectedobj.Organ == 2) {
                                                        var obj1 = {
                                                            "AnteriorSegmentRemarksLevelId": 0,
                                                            "DeleteInd": ritem.DeleteInd || "N",
                                                            "InvFindingId": ritem.InvFindingId || 0,
                                                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                            "LevelType": ritem.LevelType || '',
                                                            "FindingValue": ritem.FindingValue || '',
                                                            "IsCheckFindingValue": true,
                                                        }

                                                        if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                            Nitem.SubFindingList.push(obj1);
                                                        }
                                                    } else {
                                                        angular.forEach(Nitem.SubFindingList, function (Mitem, index) {
                                                            if (Mitem.InvFindingLevelId == ritem.InvFindingLevelId) {
                                                                Nitem.SubFindingList.splice(index, 1);
                                                            }
                                                        });
                                                    }
                                                }
                                            } else { }
                                        } else {
                                            if (Selectedobj.Organ == Nitem.OrganId) {

                                                var filetrarray = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.LevelType == ritem.LevelType }) || [];
                                                if (filetrarray.length == 0) {
                                                    if (Nitem.InvFindingId == ritem.InvFindingId) {
                                                        var obj1 = {
                                                            "AnteriorSegmentRemarksLevelId": 0,
                                                            "DeleteInd": ritem.DeleteInd || "N",
                                                            "InvFindingId": ritem.InvFindingId || 0,
                                                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                            "LevelType": ritem.LevelType || '',
                                                            "FindingValue": ritem.FindingValue || '',
                                                            "IsCheckFindingValue": true,
                                                        }
                                                        if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                            Nitem.SubFindingList.push(obj1);
                                                        }
                                                    }
                                                } else {
                                                    var filetrarray1 = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == ritem.InvFindingLevelId }) || [];
                                                    if (filetrarray1.length == 0) {
                                                        var obj1 = {
                                                            "AnteriorSegmentRemarksLevelId": 0,
                                                            "DeleteInd": ritem.DeleteInd || "N",
                                                            "InvFindingId": ritem.InvFindingId || 0,
                                                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                            "LevelType": ritem.LevelType || '',
                                                            "FindingValue": ritem.FindingValue || '',
                                                            "IsCheckFindingValue": true,
                                                        }
                                                        if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                            Nitem.SubFindingList.push(obj1);
                                                        }
                                                    } else {
                                                        angular.forEach(Nitem.SubFindingList, function (Mitem, index) {
                                                            if (Mitem.InvFindingLevelId == ritem.InvFindingLevelId) {
                                                                Nitem.SubFindingList.splice(index, 1);
                                                            }
                                                        });
                                                    }
                                                    //angular.forEach(Nitem.SubFindingList, function (oitem) {
                                                    //    if (oitem.LevelType == ritem.LevelType && oitem.InvFindingId == ritem.InvFindingId) {
                                                    //        oitem.DeleteInd = ritem.DeleteInd || "N",
                                                    //            oitem.AnteriorSegmentRemarksLevelId = ritem.AnteriorSegmentRemarksLevelId || 0,
                                                    //            oitem.InvFindingId = ritem.InvFindingId || 0,
                                                    //            oitem.InvFindingLevelId = ritem.InvFindingLevelId || 0,
                                                    //            oitem.LevelType = ritem.LevelType || '',
                                                    //            oitem.FindingValue = ritem.FindingValue || '',
                                                    //            oitem.IsCheckFindingValue = true
                                                    //    }
                                                    //});
                                                }
                                            }
                                        }
                                    }
                                });



                            }
                        }
                    });
                } else {
                    if (Selectedobj.Organ == 3) {
                        var object = {
                            "PatientFindingAnteriorId": 0,
                            "IsNormal": false,
                            "CategoryId": 5,
                            "CategoryDesc": "Anterior Segment",
                            "InvestigationId": Selectedobj.FindingId || 0,
                            "InvestigationDesc": Selectedobj.FindingName || "",
                            "ActiveInd": "Y",
                            "SelectedGlobalSearch": "",
                            "SelectedRightEye": 1,
                            "SelectedLeftEye": 0,
                            "RemarksArray": [
                                {
                                    "RemarksId": 0,
                                    "InvFindingId": Selectedobj.InvFindingId || 0,
                                    "FindingValue": Selectedobj.FindingValue || '',
                                    /*"OrganId": Selectedobj.Organ || 1,*/
                                    "OrganId": 1,
                                    "FindingId": Selectedobj.FindingId || 0,
                                    "FindingName": Selectedobj.FindingName || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": true,
                                    "SubFindingList": []
                                },
                                {
                                    "RemarksId": 0,
                                    "InvFindingId": Selectedobj.InvFindingId || 0,
                                    "FindingValue": Selectedobj.FindingValue || '',
                                    "OrganId": 2,
                                    "FindingId": Selectedobj.FindingId || 0,
                                    "FindingName": Selectedobj.FindingName || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": true,
                                    "SubFindingList": []
                                }
                            ],

                        };
                        var obj1 = {
                            "AnteriorSegmentRemarksLevelId": 0,
                            "DeleteInd": ritem.DeleteInd || "N",
                            "InvFindingId": ritem.InvFindingId || 0,
                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                            "LevelType": ritem.LevelType || '',
                            "FindingValue": ritem.FindingValue || '',
                            "IsCheckFindingValue": true,
                        }
                        //obj.SubFindingList.push(obj1);
                        //object.RemarksArray.push(obj);
                        angular.forEach(object.RemarksArray, function (Mitem) {
                            Mitem.SubFindingList.push(obj1);
                        });
                        $scope.AnteriorSegmentArrayNew.push(object);
                    } else {
                        var object = {
                            "PatientFindingAnteriorId": 0,
                            "IsNormal": false,
                            "CategoryId": 5,
                            "CategoryDesc": "Anterior Segment",
                            "InvestigationId": Selectedobj.FindingId || 0,
                            "InvestigationDesc": Selectedobj.FindingName || "",
                            "ActiveInd": "Y",
                            "SelectedGlobalSearch": "",
                            "SelectedRightEye": 1,
                            "SelectedLeftEye": 0,
                            "RemarksArray": [],

                        };
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": Selectedobj.InvFindingId || 0,
                            "FindingValue": Selectedobj.FindingValue || '',
                            "OrganId": Selectedobj.Organ || 1,
                            "FindingId": Selectedobj.FindingId || 0,
                            "FindingName": Selectedobj.FindingName || '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": "",
                            "IsShowNotesTextBox": true,
                            "SubFindingList": []
                        }
                        var obj1 = {
                            "AnteriorSegmentRemarksLevelId": 0,
                            "DeleteInd": ritem.DeleteInd || "N",
                            "InvFindingId": ritem.InvFindingId || 0,
                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                            "LevelType": ritem.LevelType || '',
                            "FindingValue": ritem.FindingValue || '',
                            "IsCheckFindingValue": true,
                        }
                        obj.SubFindingList.push(obj1);
                        object.RemarksArray.push(obj);
                        $scope.AnteriorSegmentArrayNew.push(object);
                    }
                }
            }
            else if (Selectedobj.AntorpostrId == 6) {
                var FilteredAntArray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == Selectedobj.FindingId }) || [];
                if (FilteredAntArray.length !== 0) {
                    angular.forEach(FilteredAntArray, function (Mitem) {
                        if (Mitem.RemarksArray.length > 0) {
                            var FilteredRemarksArray = $filter("filter")(Mitem.RemarksArray, function (iterator, ind) { return iterator.InvFindingId == ritem.InvFindingId }) || [];

                            if (FilteredRemarksArray.length == 0) {
                                if (Selectedobj.Organ == 3) {

                                    var objOrgId1 = {
                                        "RemarksId": 0,
                                        "InvFindingId": Selectedobj.InvFindingId || 0,
                                        "FindingValue": Selectedobj.FindingValue || '',
                                        "OrganId": 1,
                                        "FindingId": Selectedobj.FindingId || 0,
                                        "FindingName": Selectedobj.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": [
                                            {
                                                "AnteriorSegmentRemarksLevelId": 0,
                                                "DeleteInd": ritem.DeleteInd || "N",
                                                "InvFindingId": ritem.InvFindingId || 0,
                                                "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                "LevelType": ritem.LevelType || '',
                                                "FindingValue": ritem.FindingValue || '',
                                                "IsCheckFindingValue": true,
                                            }
                                        ]
                                    }
                                    var objOrgId2 = {
                                        "RemarksId": 0,
                                        "InvFindingId": Selectedobj.InvFindingId || 0,
                                        "FindingValue": Selectedobj.FindingValue || '',
                                        "OrganId": 2,
                                        "FindingId": Selectedobj.FindingId || 0,
                                        "FindingName": Selectedobj.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": [
                                            {
                                                "AnteriorSegmentRemarksLevelId": 0,
                                                "DeleteInd": ritem.DeleteInd || "N",
                                                "InvFindingId": ritem.InvFindingId || 0,
                                                "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                "LevelType": ritem.LevelType || '',
                                                "FindingValue": ritem.FindingValue || '',
                                                "IsCheckFindingValue": true,
                                            }
                                        ]
                                    }

                                    var RemarksOrgId1 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 1 }) || [];
                                    if (RemarksOrgId1.length == 0) {
                                        Mitem.RemarksArray.push(objOrgId1);
                                    }

                                    var RemarksOrgId2 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 2 }) || [];
                                    if (RemarksOrgId2.length == 0) {
                                        Mitem.RemarksArray.push(objOrgId2);
                                    }

                                } else {
                                    var obj = {
                                        "RemarksId": 0,
                                        "InvFindingId": Selectedobj.InvFindingId || 0,
                                        "FindingValue": Selectedobj.FindingValue || '',
                                        "OrganId": Selectedobj.Organ || 1,
                                        "FindingId": Selectedobj.FindingId || 0,
                                        "FindingName": Selectedobj.FindingName || '',
                                        "DiagnosisRiskLevel": "",
                                        "ActiveInd": "Y",
                                        "Notes": "",
                                        "IsShowNotesTextBox": true,
                                        "SubFindingList": []
                                    }
                                    var obj1 = {
                                        "AnteriorSegmentRemarksLevelId": 0,
                                        "DeleteInd": ritem.DeleteInd || "N",
                                        "InvFindingId": ritem.InvFindingId || 0,
                                        "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                        "LevelType": ritem.LevelType || '',
                                        "FindingValue": ritem.FindingValue || '',
                                        "IsCheckFindingValue": true,
                                    }
                                    obj.SubFindingList.push(obj1);
                                    Mitem.RemarksArray.push(obj);
                                }
                            } else {

                                angular.forEach(Mitem.RemarksArray, function (Nitem) {
                                    if (Selectedobj.Organ == 3) {
                                        var filetrarray1 = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == ritem.InvFindingLevelId }) || [];
                                        if (filetrarray1.length == 0) {
                                            var obj1 = {
                                                "AnteriorSegmentRemarksLevelId": 0,
                                                "DeleteInd": ritem.DeleteInd || "N",
                                                "InvFindingId": ritem.InvFindingId || 0,
                                                "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                "LevelType": ritem.LevelType || '',
                                                "FindingValue": ritem.FindingValue || '',
                                                "IsCheckFindingValue": true,
                                            }
                                            if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                Nitem.SubFindingList.push(obj1);
                                            }
                                        } else {
                                            angular.forEach(Nitem.SubFindingList, function (Mitem, index) {
                                                if (Mitem.InvFindingLevelId == ritem.InvFindingLevelId) {
                                                    Nitem.SubFindingList.splice(index, 1);
                                                }
                                            });
                                        }

                                        var objOrgId1 = {
                                            "RemarksId": 0,
                                            "InvFindingId": Selectedobj.InvFindingId || 0,
                                            "FindingValue": Selectedobj.FindingValue || '',
                                            "OrganId": 1,
                                            "FindingId": Selectedobj.FindingId || 0,
                                            "FindingName": Selectedobj.FindingName || '',
                                            "DiagnosisRiskLevel": "",
                                            "ActiveInd": "Y",
                                            "Notes": "",
                                            "IsShowNotesTextBox": true,
                                            "SubFindingList": [
                                                {
                                                    "AnteriorSegmentRemarksLevelId": 0,
                                                    "DeleteInd": ritem.DeleteInd || "N",
                                                    "InvFindingId": ritem.InvFindingId || 0,
                                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                    "LevelType": ritem.LevelType || '',
                                                    "FindingValue": ritem.FindingValue || '',
                                                    "IsCheckFindingValue": true,
                                                }
                                            ]
                                        }

                                        var objOrgId2 = {
                                            "RemarksId": 0,
                                            "InvFindingId": Selectedobj.InvFindingId || 0,
                                            "FindingValue": Selectedobj.FindingValue || '',
                                            "OrganId": 2,
                                            "FindingId": Selectedobj.FindingId || 0,
                                            "FindingName": Selectedobj.FindingName || '',
                                            "DiagnosisRiskLevel": "",
                                            "ActiveInd": "Y",
                                            "Notes": "",
                                            "IsShowNotesTextBox": true,
                                            "SubFindingList": [
                                                {
                                                    "AnteriorSegmentRemarksLevelId": 0,
                                                    "DeleteInd": ritem.DeleteInd || "N",
                                                    "InvFindingId": ritem.InvFindingId || 0,
                                                    "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                    "LevelType": ritem.LevelType || '',
                                                    "FindingValue": ritem.FindingValue || '',
                                                    "IsCheckFindingValue": true,
                                                }
                                            ]
                                        }

                                        var RemarksOrgId1 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 1 }) || [];
                                        if (RemarksOrgId1.length == 0) {
                                            Mitem.RemarksArray.push(objOrgId1);
                                        }
                                        var RemarksOrgId2 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 2 }) || [];
                                        if (RemarksOrgId2.length == 0) {
                                            Mitem.RemarksArray.push(objOrgId2);
                                        }
                                    } else {
                                        var FilterRemarksArray = $filter("filter")(Mitem.RemarksArray, function (iterator, ind) { return iterator.InvFindingId == ritem.InvFindingId && iterator.OrganId == Selectedobj.Organ }) || [];
                                        if (FilterRemarksArray.length == 0) {
                                            var objOrgId1 = {
                                                "RemarksId": 0,
                                                "InvFindingId": Selectedobj.InvFindingId || 0,
                                                "FindingValue": Selectedobj.FindingValue || '',
                                                "OrganId": 1,
                                                "FindingId": Selectedobj.FindingId || 0,
                                                "FindingName": Selectedobj.FindingName || '',
                                                "DiagnosisRiskLevel": "",
                                                "ActiveInd": "Y",
                                                "Notes": "",
                                                "IsShowNotesTextBox": true,
                                                "SubFindingList": [
                                                    {
                                                        "AnteriorSegmentRemarksLevelId": 0,
                                                        "DeleteInd": ritem.DeleteInd || "N",
                                                        "InvFindingId": ritem.InvFindingId || 0,
                                                        "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                        "LevelType": ritem.LevelType || '',
                                                        "FindingValue": ritem.FindingValue || '',
                                                        "IsCheckFindingValue": true,
                                                    }
                                                ]
                                            }

                                            var objOrgId2 = {
                                                "RemarksId": 0,
                                                "InvFindingId": Selectedobj.InvFindingId || 0,
                                                "FindingValue": Selectedobj.FindingValue || '',
                                                "OrganId": 2,
                                                "FindingId": Selectedobj.FindingId || 0,
                                                "FindingName": Selectedobj.FindingName || '',
                                                "DiagnosisRiskLevel": "",
                                                "ActiveInd": "Y",
                                                "Notes": "",
                                                "IsShowNotesTextBox": true,
                                                "SubFindingList": [
                                                    {
                                                        "AnteriorSegmentRemarksLevelId": 0,
                                                        "DeleteInd": ritem.DeleteInd || "N",
                                                        "InvFindingId": ritem.InvFindingId || 0,
                                                        "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                        "LevelType": ritem.LevelType || '',
                                                        "FindingValue": ritem.FindingValue || '',
                                                        "IsCheckFindingValue": true,
                                                    }
                                                ]
                                            }

                                            var RemarksOrgId1 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 1 }) || [];
                                            if (RemarksOrgId1.length == 0) {
                                                Mitem.RemarksArray.push(objOrgId1);
                                            } else if (Nitem.OrganId == 1) {
                                                var filetrarray1 = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == ritem.InvFindingLevelId }) || [];
                                                if (filetrarray1.length == 0 && Selectedobj.Organ == 1) {
                                                    var obj1 = {
                                                        "AnteriorSegmentRemarksLevelId": 0,
                                                        "DeleteInd": ritem.DeleteInd || "N",
                                                        "InvFindingId": ritem.InvFindingId || 0,
                                                        "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                        "LevelType": ritem.LevelType || '',
                                                        "FindingValue": ritem.FindingValue || '',
                                                        "IsCheckFindingValue": true,
                                                    }

                                                    if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                        Nitem.SubFindingList.push(obj1);
                                                    }
                                                } else {
                                                    angular.forEach(Nitem.SubFindingList, function (Mitem, index) {
                                                        if (Mitem.InvFindingLevelId == ritem.InvFindingLevelId) {
                                                            Nitem.SubFindingList.splice(index, 1);
                                                        }
                                                    });
                                                }
                                            }
                                            else { }
                                            var RemarksOrgId2 = $filter("filter")(Mitem.RemarksArray, function (repeat, ind) { return repeat.InvFindingId == ritem.InvFindingId && repeat.OrganId == 2 }) || [];
                                            if (RemarksOrgId2.length == 0) {
                                                Mitem.RemarksArray.push(objOrgId2);
                                            } else if (Nitem.OrganId == 2) {
                                                {
                                                    var filetrarray1 = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == ritem.InvFindingLevelId }) || [];
                                                    if (filetrarray1.length == 0 && Selectedobj.Organ == 2) {
                                                        var obj1 = {
                                                            "AnteriorSegmentRemarksLevelId": 0,
                                                            "DeleteInd": ritem.DeleteInd || "N",
                                                            "InvFindingId": ritem.InvFindingId || 0,
                                                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                            "LevelType": ritem.LevelType || '',
                                                            "FindingValue": ritem.FindingValue || '',
                                                            "IsCheckFindingValue": true,
                                                        }

                                                        if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                            Nitem.SubFindingList.push(obj1);
                                                        }
                                                    } else {
                                                        angular.forEach(Nitem.SubFindingList, function (Mitem, index) {
                                                            if (Mitem.InvFindingLevelId == ritem.InvFindingLevelId) {
                                                                Nitem.SubFindingList.splice(index, 1);
                                                            }
                                                        });
                                                    }
                                                }
                                            } else { }
                                        } else {
                                            if (Selectedobj.Organ == Nitem.OrganId) {

                                                var filetrarray = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.LevelType == ritem.LevelType }) || [];
                                                if (filetrarray.length == 0) {
                                                    if (Nitem.InvFindingId == ritem.InvFindingId) {
                                                        var obj1 = {
                                                            "AnteriorSegmentRemarksLevelId": 0,
                                                            "DeleteInd": ritem.DeleteInd || "N",
                                                            "InvFindingId": ritem.InvFindingId || 0,
                                                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                            "LevelType": ritem.LevelType || '',
                                                            "FindingValue": ritem.FindingValue || '',
                                                            "IsCheckFindingValue": true,
                                                        }
                                                        if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                            Nitem.SubFindingList.push(obj1);
                                                        }
                                                    }
                                                } else {
                                                    var filetrarray1 = $filter("filter")(Nitem.SubFindingList, function (iterator, ind) { return iterator.InvFindingLevelId == ritem.InvFindingLevelId }) || [];
                                                    if (filetrarray1.length == 0) {
                                                        var obj1 = {
                                                            "AnteriorSegmentRemarksLevelId": 0,
                                                            "DeleteInd": ritem.DeleteInd || "N",
                                                            "InvFindingId": ritem.InvFindingId || 0,
                                                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                                                            "LevelType": ritem.LevelType || '',
                                                            "FindingValue": ritem.FindingValue || '',
                                                            "IsCheckFindingValue": true,
                                                        }
                                                        if (Nitem.InvFindingId == obj1.InvFindingId) {
                                                            Nitem.SubFindingList.push(obj1);
                                                        }
                                                    } else {
                                                        angular.forEach(Nitem.SubFindingList, function (Mitem, index) {
                                                            if (Mitem.InvFindingLevelId == ritem.InvFindingLevelId) {
                                                                Nitem.SubFindingList.splice(index, 1);
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });



                            }
                        }
                    });
                } else {
                    if (Selectedobj.Organ == 3) {
                        var object = {
                            "PatientFindingAnteriorId": 0,
                            "IsNormal": false,
                            "CategoryId": 5,
                            "CategoryDesc": "Anterior Segment",
                            "InvestigationId": Selectedobj.FindingId || 0,
                            "InvestigationDesc": Selectedobj.FindingName || "",
                            "ActiveInd": "Y",
                            "SelectedGlobalSearch": "",
                            "SelectedRightEye": 1,
                            "SelectedLeftEye": 0,
                            "RemarksArray": [
                                {
                                    "RemarksId": 0,
                                    "InvFindingId": Selectedobj.InvFindingId || 0,
                                    "FindingValue": Selectedobj.FindingValue || '',
                                    "OrganId": 1,
                                    "FindingId": Selectedobj.FindingId || 0,
                                    "FindingName": Selectedobj.FindingName || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": true,
                                    "SubFindingList": []
                                },
                                {
                                    "RemarksId": 0,
                                    "InvFindingId": Selectedobj.InvFindingId || 0,
                                    "FindingValue": Selectedobj.FindingValue || '',
                                    "OrganId": 2,
                                    "FindingId": Selectedobj.FindingId || 0,
                                    "FindingName": Selectedobj.FindingName || '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": true,
                                    "SubFindingList": []
                                }
                            ],

                        };
                        var obj1 = {
                            "AnteriorSegmentRemarksLevelId": 0,
                            "DeleteInd": ritem.DeleteInd || "N",
                            "InvFindingId": ritem.InvFindingId || 0,
                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                            "LevelType": ritem.LevelType || '',
                            "FindingValue": ritem.FindingValue || '',
                            "IsCheckFindingValue": true,
                        }
                        angular.forEach(object.RemarksArray, function (Mitem) {
                            Mitem.SubFindingList.push(obj1);
                        });
                        $scope.PoteriorSegmentArrayNew.push(object);
                    } else {
                        var object = {
                            "PatientFindingAnteriorId": 0,
                            "IsNormal": false,
                            "CategoryId": 5,
                            "CategoryDesc": "Anterior Segment",
                            "InvestigationId": Selectedobj.FindingId || 0,
                            "InvestigationDesc": Selectedobj.FindingName || "",
                            "ActiveInd": "Y",
                            "SelectedGlobalSearch": "",
                            "SelectedRightEye": 1,
                            "SelectedLeftEye": 0,
                            "RemarksArray": [],

                        };
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": Selectedobj.InvFindingId || 0,
                            "FindingValue": Selectedobj.FindingValue || '',
                            "OrganId": Selectedobj.Organ || 1,
                            "FindingId": Selectedobj.FindingId || 0,
                            "FindingName": Selectedobj.FindingName || '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": "",
                            "IsShowNotesTextBox": true,
                            "SubFindingList": []
                        }
                        var obj1 = {
                            "AnteriorSegmentRemarksLevelId": 0,
                            "DeleteInd": ritem.DeleteInd || "N",
                            "InvFindingId": ritem.InvFindingId || 0,
                            "InvFindingLevelId": ritem.InvFindingLevelId || 0,
                            "LevelType": ritem.LevelType || '',
                            "FindingValue": ritem.FindingValue || '',
                            "IsCheckFindingValue": true,
                        }
                        obj.SubFindingList.push(obj1);
                        object.RemarksArray.push(obj);
                        $scope.PoteriorSegmentArrayNew.push(object);
                    }
                }
            }
            else { }

        };

        
        $scope.ClearSchirmersTest = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Schirmers Test data?  </h4>", function () {
                item.ODValue2 = '';
                item.ODValue21 = '';
                item.ODvalue3 = '';
                item.ODvalue31 = '';
                item.OSValue2 = '';
                item.OSValue21 = '';
                item.OSvalue3 = '';
                item.OSvalue31 = '';
                item.Remarks = '';
                item.ActiveInd = 'N';
                $scope.$digest();
            },
                function () {
                    r = "You pressed Cancel!";
                });
        }


        $scope.ClearTVT = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear TVT data?  </h4>", function () {
                item.ODValue1 = '';
                item.OSValue1 = '';
                item.Remarks = '';
                item.ActiveInd = 'N';
                $scope.$digest();
            },
                function () {
                    r = "You pressed Cancel!";
                });
        }

        $scope.ClearTO = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear TO data?  </h4>", function () {
                item.ODValue2 = '';
                item.OSValue2 = '';
                item.Remarks = '';
                item.ActiveInd = 'N';
                $scope.$digest();
            },
                function () {
                    r = "You pressed Cancel!";
                });
        }

        $scope.ClearTBUT = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear TBUT data?  </h4>", function () {
                item.ODValue1 = '';
                item.OSValue1 = '';
                item.Remarks = '';
                item.ActiveInd = 'N';
                $scope.$digest();
            },
                function () {
                    r = "You pressed Cancel!";
                });
        }

        $scope.ClearHertelExamination = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Hertel's Examination data?  </h4>", function () {
                item.BaseValue = '';
                item.LeftEyeRemarks = '';
                item.RightEyeRemarks = '';
                item.ActiveInd = 'N';
                $scope.$digest();
            },
                function () {
                    r = "You pressed Cancel!";
                });
        }

        $scope.ClearLacrimalPatency = function (type) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Lacrimal Patency data?  </h4>", function () {
                if (type == 'Lacrimal') {
                    if ($scope.cacheStorageItem.LacrimalPatiencyDetails.length > 0) {
                        angular.forEach($scope.cacheStorageItem.LacrimalPatiencyDetails, function (litem) {
                            if (litem.InvestigationId === 2091 || litem.InvestigationId === 2092 || litem.InvestigationId === 2093 || litem.InvestigationId === 2094) {
                                litem.Remarks = "";
                                litem.LeftEyeRemarks = "";
                                litem.ActiveInd = 'N';
                                $scope.cacheStorageItem.LacrimalPatencyRemarks = "";
                            }
                        });
                    }
                }
                $scope.$digest();
            },
                function () {
                    r = "You pressed Cancel!";
                });
        }


        $scope.ClearColorVisionTest = function (item, type) {
            if (type === 'Ishihara') {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Ishihara color Vision data?  </h4>", function () {
                    item.RightEyeRemarks = '';
                    item.LeftEyeRemarks = '';
                    item.LS3Url = '';
                    item.RS3Url = '';
                    item.IsLS3Url = false;
                    item.IsRS3Url = false;
                    item.ActiveInd = 'N';
                    $scope.$digest();
                }, function () {
                    r = "You pressed Cancel!";
                });
            }

            if (type === 'HRR') {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear HRR color vision data?  </h4>", function () {
                    item.RightEyeRemarks = '';
                    item.LeftEyeRemarks = '';
                    item.LS3Url = '';
                    item.RS3Url = '';
                    item.IsLS3Url = false;
                    item.IsRS3Url = false;
                    item.ActiveInd = 'N';
                    $scope.$digest();
                }, function () {
                    r = "You pressed Cancel!";
                });
            }

            if (type === 'FransworthD15') {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Fransworth D15 Test  data?  </h4>", function () {
                    item.RightEyeRemarks = '';
                    item.LeftEyeRemarks = '';
                    item.LS3Url = '';
                    item.RS3Url = '';
                    item.IsLS3Url = false;
                    item.IsRS3Url = false;
                    item.ActiveInd = 'N';
                    $scope.$digest();
                }, function () {
                    r = "You pressed Cancel!";
                });
            }

            if (type === 'FransworthD100') {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Fransworth D100 Test data?  </h4>", function () {
                    item.RightEyeRemarks = '';
                    item.LeftEyeRemarks = '';
                    item.LS3Url = '';
                    item.RS3Url = '';
                    item.IsLS3Url = false;
                    item.IsRS3Url = false;
                    item.ActiveInd = 'N';
                    $scope.$digest();
                }, function () {
                    r = "You pressed Cancel!";
                });
            }
           
        }

        function GetEyeName(SelectedEye) {
            if (SelectedEye === 1 || SelectedEye === "1") {
                return "OD";
            }
            if (SelectedEye === 2 || SelectedEye === "2") {
                return "OS";
            }
            if (SelectedEye === 3 || SelectedEye === "3") {
                return "OU";
            }
            if (SelectedEye === 4 || SelectedEye === "4") {
                return "General";
            }

            if (SelectedEye === 5 || SelectedEye === "5") {
                return "Hair";
            }
            if (SelectedEye === 6 || SelectedEye === "6") {
                return "Skin";
            }
            if (SelectedEye === 7 || SelectedEye === "7") {
                return "Laser";
            }
        }

        $scope.ChangesForDiagnosistemplateInConsultation = function (DiagnosisTemplatedeatils) {
            if (DiagnosisTemplatedeatils.DiagnosisArray != undefined && DiagnosisTemplatedeatils.DiagnosisArray.length > 0) {
                var i = 0;
                if ($scope.cacheStorageItem.AssessmentPlan.length > 0) {
                    angular.forEach(DiagnosisTemplatedeatils.DiagnosisArray, function (nitem) {
                        angular.forEach($scope.cacheStorageItem.AssessmentPlan, function (mitem) {
                            if (nitem.DiagnosisId === mitem.DiagnosisId) {
                                i++;
                            }
                        });
                    });
                }
                if (i !== 0) {
                    alertify.error("Diagnosis Already Added");
                    return false;
                }

                angular.forEach(DiagnosisTemplatedeatils.DiagnosisArray, function (Ditem) {
                    //if (Ditem.RDiagnosisStatusId != null || Ditem.RDiagnosisStatusId != '') {
                    //    var RDiagnosisststusList = $filter("filter")($scope.AssesmentPlanStatusList, function (iterator) { return iterator.AssesmentPlanStatusID === Ditem.RDiagnosisStatusId; });


                    //    if (RDiagnosisststusList.length > 0) {
                    //        $scope.RDiagnosisStatus = RDiagnosisststusList[0].AssesmentPlanStatus || '';
                    //    }

                    //}
                    //if (Ditem.LDiagnosisStatusId != null || Ditem.LDiagnosisStatusId != '') {
                    //    var LDiagnosisststusList = $filter("filter")($scope.AssesmentPlanStatusList, function (iterator) { return iterator.AssesmentPlanStatusID === Ditem.LDiagnosisStatusId; });


                    //    if (LDiagnosisststusList.length > 0) {
                    //        $scope.LDiagnosisStatus = LDiagnosisststusList[0].AssesmentPlanStatus || '';
                    //    }
                    //}
                    //if (Ditem.RDiagnosisStatusId == 2 || Ditem.RDiagnosisStatusId == 2) {
                    //    $scope.IsCheckedDiagnosis = true;
                    //}


                    var obj = {
                        "SnomedCodeId": Ditem.SnomedCodeId,
                        "SnomedCode": Ditem.SnomedCode,
                        "SnomedDescription": Ditem.SnomedDescription,
                        "CreatedDateTime": $filter('date')(new Date(), "dd-MMM-yyyy h:mm a"),
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
                        "SpecializationId": $scope.SpecializationId,
                        "OrganId": Ditem.OrganId || null,
                        "OrganName": GetEyeName(Ditem.OrganId),
                        "DiagnosisId": Ditem.DiagnosisId,
                        "DiagnosisName": Ditem.DiagnosisName,
                        "DiagnosisObject": {
                            "DiagnosisCode": Ditem.DiagnosisCode,
                            "DiagnosisId": Ditem.DiagnosisId,
                            "DiagnosisName": Ditem.DiagnosisName,
                            "DiagnosisNotes": Ditem.DiagnosisNotes,
                            "FullName": Ditem.FullName,
                            "HospitalId": Ditem.HospitalId,
                            "ICD10CODE": Ditem.ICD10CODE,
                            "UserId": Ditem.UserId
                        },
                        "DiagnosisRiskLevel": Ditem.DiagnosisRiskLevel,
                        "FindingDiagnosisId": 0,
                        "DiagnosisHistoryId": 0,
                        "ICD10CODE": Ditem.ICD10CODE,
                        "ICD10DIAGDESCRIPTION": Ditem.FullName,
                        "ICD10DIAGNAME": Ditem.DiagnosisName,
                        "DiagnosisStatus": Ditem.DiagnosisStatus,
                        "PlanOfcareNotesArray": Ditem.PlanOfCareNotesArray || [],
                        "PlanofDiscussionsNotes": Ditem.PlanofDiscussionsNotes || "",
                        "PatientInstructions": Ditem.PatientInstructions || "",
                        "DoctorNotes": Ditem.DoctorNotes || "",
                        "ActionsTaken": Ditem.ActionsTaken || "",
                        "ReferralArray": Ditem.ReferralArray || [],
                        "ProceduresArray": Ditem.ProceduresArray || [],
                        "PrescriptionArray": [],
                        "SurgeryArray": Ditem.SurgeriesArray || [],
                        "InvestigationsArray": Ditem.InvestigationsArray || [],
                        "InvestigationFindingId": 0,
                        "FindingId": 0,
                        "ActiveInd": "Y",
                        "DeleteInd": "N",
                        "IsSummaryViewInd": true,
                        "ProceduresAddedTime": "",
                        "PrescriptionAddedTime": "",
                        "PlanOfCareAddedTime": "",
                        "SurgeryAddedTime": "",
                        "Type": 'Optha',
                        "StatusList": [
                            {
                                "OrganStatusId": null,
                                "OrganId": "1",
                                "SeverityId": null,
                                "Verificationstatusid": null,
                                "DiagnosisStatus": '',
                                "DiagnosisStatusId": 6,
                                "EndDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                "StartDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                "DeleteInd": 'N',

                            },
                            {
                                "OrganStatusId": null,
                                "OrganId": "2",
                                "SeverityId": null,
                                "Verificationstatusid": null,
                                "DiagnosisStatus": '',
                                "DiagnosisStatusId": 6,
                                "EndDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                "StartDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                "DeleteInd": 'N',

                            }
                        ],
                        //"LDiagnosisStatusId": Ditem.LDiagnosisStatusId ,
                        //"RDiagnosisStatusId": Ditem.LDiagnosisStatusId,
                        //"ODSeverityId": Ditem.ODSeverityId ,
                        //"OSSeverityId": Ditem.OSSeverityId,
                        "RDiagnosisStatus": $scope.RDiagnosisStatus,
                        "LDiagnosisStatus": $scope.LDiagnosisStatus,
                        "AssessmentsNotes": Ditem.AssessmentPlan.AssessmentsNotes,
                        "IsCheckedDiagnosis": $scope.IsCheckedDiagnosis

                    }
                    obj.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");

                    if (obj.PlanOfcareNotesArray.length > 0) {
                        angular.forEach(obj.PlanOfcareNotesArray, function (item) {
                            item.CreatedDateTime = $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "";
                        });
                        obj.PlanOfCareAddedTime = $filter('date')(new Date(), "dd-MMM-yyyy h:mm a");
                    } else {
                        obj.PlanOfCareAddedTime = "";
                    }

                    if (obj.ProceduresArray.length > 0) {
                        angular.forEach(obj.ProceduresArray, function (item) {
                            item.CreatedDateTime = $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "";
                            var Procedureobj = {
                                "PatientOrderId": 0,
                                "SpecializationId": $scope.SpecializationId,
                                "OrderTypeId": 2,
                                "OrderType": "Procedure",
                                "Description": item.ProcedureName,
                                "DescriptionId": item.ProcedureId,
                                "OrgDescriptionId": item.OrgProcedureId,
                                "Remarks": item.ProcedureNotes || "",
                                "OrganId": null,   /* Ditem.OrganId*/
                                "OrganName": '', //GetEyeName(Ditem.OrganId)
                                "BookingStatusId": "2",
                                "CPTCode": "",
                                "ProcedureCode": item.ProcedureCode || "",
                                "StatusId": "1",
                                /*"ActiveInd": "Y",*/
                                "DeleteInd": "N",
                                "PatientSurgeryId": 0,
                                "SurgeryListId": 0,
                                "InvSpecialityId": "",
                                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",

                                "DiagnosisList": [],


                            }



                            var list = {
                                "DiagnosisDetailId": 0,
                                "DiagnosisId": Ditem.DiagnosisId,
                                "OrganizationDiagnosisId": 0,
                                "DiagnosisName": Ditem.DiagnosisName,
                                "ICDCode": Ditem.ICD10CODE,
                                "ActiveInd": "Y"
                            };
                            Procedureobj.DiagnosisList.push(list);

                            /* $scope.cacheStorageItem.OrderDetails.push(Procedureobj);*/
                            $scope.cacheStorageItem.ProceduresDetails = $scope.cacheStorageItem.ProceduresDetails || [];
                            $scope.cacheStorageItem.ProceduresDetails.push(Procedureobj);
                        });
                        obj.ProceduresAddedTime = $filter('date')(new Date(), "dd-MMM-yyyy h:mm a");
                    } else {
                        obj.ProceduresAddedTime = "";
                    }
                    if (obj.InvestigationsArray.length > 0) {
                        angular.forEach(obj.InvestigationsArray, function (item) {
                            item.CreatedDateTime = $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "";
                            var investigationobj = {
                                "PatientOrderId": 0,
                                "SpecializationId": $scope.SpecializationId,
                                "OrderTypeId": 1,
                                "OrderType": "Investigation",
                                "Description": item.InvestigationName,
                                "DescriptionId": item.InvestigationId,
                                "OrgDescriptionId": item.OrgInvestigationId,
                                "Remarks": item.InvestigationNotes || "",
                                "OrganId": null, //Ditem.OrganId
                                "OrganName": '', //GetEyeName(Ditem.OrganId)
                                "ProcedureCode": item.ProcedureCode || "",
                                //"OrganId": $scope.SelectedEyeoptha,
                                //"OrganName": GetEyeName($scope.SelectedEyeoptha),
                                "BillingCode": item.CPTCode || "",
                                "BookingStatusId": "2",
                                "CPTCode": item.CPTCode || "",
                                "StatusId": item.StatusId ? item.StatusId : "1",
                                //"ActiveInd": "Y",
                                "DeleteInd": "N",
                                "PatientSurgeryId": 0,
                                "SurgeryListId": 0,
                                "InvSpecialityId": item.InvSpecialityId,
                                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                "DiagnosisList": []
                            }

                            var list = {
                                "DiagnosisDetailId": 0,
                                "DiagnosisId": Ditem.DiagnosisId,
                                "OrganizationDiagnosisId": 0,
                                "DiagnosisName": Ditem.DiagnosisName,
                                "ICDCode": Ditem.ICD10CODE,
                                "ActiveInd": "Y"
                            };
                            investigationobj.DiagnosisList.push(list);
                            //$scope.cacheStorageItem.OrderDetails.push(investigationobj);
                            $scope.cacheStorageItem.InvestigationsDetails = $scope.cacheStorageItem.InvestigationsDetails || [];
                            $scope.cacheStorageItem.InvestigationsDetails.push(investigationobj);
                        });
                        //obj.PrescriptionAddedTime = $filter('date')(new Date(), "dd-MMM-yyyy h:mm a");
                    } else {
                        obj.PrescriptionAddedTime = "";
                    }
                    if (obj.SurgeryArray.length > 0) {
                        angular.forEach(obj.SurgeryArray, function (item) {
                            item.CreatedDateTime = $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "";
                            var surgeryobject = {
                                "PatientOrderId": 0,
                                "SpecializationId": $scope.SpecializationId,
                                "OrderTypeId": 3,
                                "OrderType": "Surgery",
                                "Description": item.SurgeryName,
                                "DescriptionId": item.SurgeryId,
                                "OrgDescriptionId": item.OrgSurgeryId,
                                "Remarks": item.PatientInstructions || "",
                                "OrganId": null, //Ditem.OrganId
                                "OrganName": '', //GetEyeName(Ditem.OrganId)
                                //"OrganId": $scope.SelectedEyeoptha,
                                //"OrganName": GetEyeName($scope.SelectedEyeoptha),
                                "BillingCode": item.CPTCode || "", //item.BillingCode,
                                "BookingStatusId": "2",
                                "CPTCode": item.CPTCode || "",
                                "ProcedureCode": item.ProcedureCode || "",
                                "StatusId": item.StatusId || 1,
                                //"ActiveInd": "Y",
                                "DeleteInd": "N",
                                "PatientSurgeryId": 0,
                                "SurgeryListId": 0,
                                "InvSpecialityId": "",
                                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                "DiagnosisList": []
                            }
                            var list = {
                                "DiagnosisDetailId": 0,
                                "DiagnosisId": Ditem.DiagnosisId,
                                "OrganizationDiagnosisId": 0,
                                "DiagnosisName": Ditem.DiagnosisName,
                                "ICDCode": Ditem.ICD10CODE,
                                "ActiveInd": "Y"
                            };

                            surgeryobject.DiagnosisList.push(list);
                            $scope.cacheStorageItem.SurgeriesDetails = $scope.cacheStorageItem.SurgeriesDetails || [];
                            //$scope.cacheStorageItem.OrderDetails.push(surgeryobject);
                            $scope.cacheStorageItem.SurgeriesDetails.push(surgeryobject);
                        });
                        obj.SurgeryAddedTime = $filter('date')(new Date(), "dd-MMM-yyyy h:mm a");
                    } else {
                        obj.SurgeryAddedTime = "";
                    }

                    if (obj.SurgeryArray.length > 0) {
                        angular.forEach(obj.SurgeryArray, function (item) {
                            item.OrganId = null,
                                item.OrganName = ''
                        });
                    }

                    if (obj.InvestigationsArray.length > 0) {
                        angular.forEach(obj.InvestigationsArray, function (item) {
                            item.OrganId = null,
                                item.OrganName = ''
                        });
                    }
                    if (obj.ProceduresArray.length > 0) {
                        angular.forEach(obj.ProceduresArray, function (item) {
                            item.OrganId = null,
                                item.OrganName = ''
                        });
                    }

                    $scope.cacheStorageItem.AssessmentPlan.push(obj);
                });
            }

            if (DiagnosisTemplatedeatils.Medications != undefined && DiagnosisTemplatedeatils.Medications.length > 0) {
                angular.forEach(DiagnosisTemplatedeatils.Medications, function (Ditem) {
                    Ditem.ShowPrescriptiondiv = true;
                    if (Ditem.PrescriptionType === "GenericMedicine") {
                        if (Ditem.PrescriptionData.Duration == "1" || Ditem.PrescriptionData.Duration == "2" || Ditem.PrescriptionData.Duration == "3") {
                            Ditem.PrescriptionData.DurationValueInd = Ditem.PrescriptionData.Duration;
                        } else {
                            Ditem.PrescriptionData.DurationValueInd = "4";
                        }
                        Ditem.PrescriptionData.FrequencyValueInd = 3;
                        Ditem.PrescriptionData.DosageValueInd = 4;
                    }
                    $scope.cacheStorageItem.Prescriptions.push(Ditem);
                });
            }

            DiagnosisTemplatedeatils.AnteriorValuesArray = DiagnosisTemplatedeatils.AnteriorValuesArray || [];
            DiagnosisTemplatedeatils.PosteriorValuesArray = DiagnosisTemplatedeatils.PosteriorValuesArray || [];
            $scope.cacheStorageItem.AnteriorSegmentArrayNew = DiagnosisTemplatedeatils.AnteriorValuesArray || [];
            $scope.cacheStorageItem.PoteriorSegmentArrayNew = DiagnosisTemplatedeatils.PosteriorValuesArray || [];


            var data = DiagnosisTemplatedeatils.AnteriorValuesArray || [];
            var data1 = DiagnosisTemplatedeatils.PosteriorValuesArray || [];
            $rootScope.$broadcast('myEvent', data);
            $rootScope.$broadcast('Event', data1);
            DiagnosisTemplatedeatils.ExternalExaminationsValuesArray = DiagnosisTemplatedeatils.ExternalExaminationsValuesArray || [];
            if (DiagnosisTemplatedeatils.AnteriorValuesArray.length > 0 || DiagnosisTemplatedeatils.ExternalExaminationsValuesArray.length > 0 || DiagnosisTemplatedeatils.PosteriorValuesArray.length > 0) {
                angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (aItem) {
                    console.log(aItem);
                    if (aItem.CategoryId === 4) {
                        aItem.IsCategoryChecked = true;
                        aItem.IsActive = true;
                        if (DiagnosisTemplatedeatils.AnteriorValuesArray.length > 0) {
                            angular.forEach(aItem.CategoryDetails, function (mitem) {
                                if (mitem.SubCategoryId === 24) {
                                    mitem.IsSubCategoryChecked = true;
                                    mitem.Active = 'Y';
                                    angular.forEach(mitem.SubCategoryDetails, function (csitem) {

                                        var filteredSubCatArray = $filter("filter")(DiagnosisTemplatedeatils.AnteriorValuesArray, { "SubCategoryChildId": csitem.SubCategoryChildId }, true);

                                        if (filteredSubCatArray.length > 0) {
                                            csitem.IsSubChildCategoryChecked = true;
                                            csitem.isActive = true;
                                            angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (casitem) {
                                                if (casitem.InvestigationId === filteredSubCatArray[0].InvestigationId) {
                                                    casitem.IsSelected = true;
                                                    casitem.RightEye.RemarksArray = filteredSubCatArray[0].RightEyeRemarks || [];
                                                    casitem.LeftEye.RemarksArray = filteredSubCatArray[0].LeftEyeRemarks || [];
                                                    casitem.BothEye.RemarksArray = filteredSubCatArray[0].BothEyeRemarks || [];
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }


                        if (DiagnosisTemplatedeatils.PosteriorValuesArray.length > 0) {
                            angular.forEach(aItem.CategoryDetails, function (mitem) {
                                if (mitem.SubCategoryId === 25) {
                                    mitem.IsSubCategoryChecked = true;
                                    mitem.Active = 'Y';

                                    angular.forEach(mitem.SubCategoryDetails, function (csitem) {
                                        console.log(csitem.SubCategoryChildId);

                                        var filteredSubCatArray = $filter("filter")(DiagnosisTemplatedeatils.PosteriorValuesArray, { "SubCategoryChildId": csitem.SubCategoryChildId }, true);

                                        console.log(filteredSubCatArray);
                                        if (filteredSubCatArray.length > 0) {
                                            csitem.IsSubChildCategoryChecked = true;
                                            csitem.isActive = true;
                                            angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (casitem) {
                                                if (casitem.InvestigationId === filteredSubCatArray[0].InvestigationId) {
                                                    casitem.IsSelected = true;
                                                    casitem.RightEye.RemarksArray = filteredSubCatArray[0].RightEyeRemarks || [];
                                                    casitem.LeftEye.RemarksArray = filteredSubCatArray[0].LeftEyeRemarks || [];
                                                    casitem.BothEye.RemarksArray = filteredSubCatArray[0].BothEyeRemarks || [];
                                                }
                                            });

                                        }
                                    });
                                }
                            });
                        }
                        if (DiagnosisTemplatedeatils.ExternalExaminationsValuesArray.length > 0) {
                            angular.forEach(aItem.CategoryDetails, function (mitem) {
                                if (mitem.SubCategoryId === 35) {
                                    mitem.IsSubCategoryChecked = true;
                                    mitem.Active = 'Y';

                                    angular.forEach(mitem.SubCategoryDetails, function (csitem) {
                                        console.log(csitem.SubCategoryChildId);
                                        var filteredSubCatArray = $filter("filter")(DiagnosisTemplatedeatils.ExternalExaminationsValuesArray, { "SubCategoryChildId": csitem.SubCategoryChildId }, true);

                                        console.log(filteredSubCatArray);
                                        if (filteredSubCatArray.length > 0) {
                                            csitem.IsSubChildCategoryChecked = true;
                                            csitem.isActive = true;
                                            angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (casitem) {
                                                if (casitem.InvestigationId === filteredSubCatArray[0].InvestigationId) {
                                                    casitem.IsSelected = true;
                                                    casitem.RightEye.RemarksArray = filteredSubCatArray[0].RightEyeRemarks || [];
                                                    casitem.LeftEye.RemarksArray = filteredSubCatArray[0].LeftEyeRemarks || [];
                                                    casitem.BothEye.RemarksArray = filteredSubCatArray[0].BothEyeRemarks || [];
                                                }
                                            });
                                        }

                                    });
                                }
                            });
                        }


                    }


                });
            }

            $scope.closeTemplateView();

            $scope.AddToCache();
        };

        $scope.GetUserConsultationTemplateDetails = function () {
            var params = {
                /*"UserId": doctorinfo.doctorid,*/
                "UserId": $scope.UserId,
                "SearchText": "",
                "PageSize": 10,
                "PageNumber": 1,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "IsFavoriteInd": 0
            }
            eHnotePatientDataService.GetUserConsultationTemplateDetails(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.DiagnosisTemplatesArray = resp.data.AssessmentsPlanArray || [];
                    $scope.AnteriorTemplatesArray = resp.data.ExaminationTemplatesArray || [];
                } else {
                    $scope.DiagnosisTemplatesArray = [];
                    $scope.AnteriorTemplatesArray = [];
                }
                if ($scope.AnteriorTemplatesArray.length > 0) {
                    angular.forEach($scope.AnteriorTemplatesArray, function (mitem) {
                        mitem.IsEdit = false;
                        //item.IsDescriptionEdit = false;
                    });
                    $scope.AnteriorTemplatesArray[0].IsEdit = true;
                }
                $scope.ViewTemplateDetails($scope.AnteriorTemplatesArray[0], 1);
            }, function (err) {

            });
        }
        //$scope.ChangeDiagnosisTemplate = function (item) {
        //    if ($scope.DiagnosisTemplatesArray.length > 0) {
        //        angular.forEach($scope.DiagnosisTemplatesArray, function (mitem) {
        //            mitem.IsEdit = false;
        //            //item.IsDescriptionEdit = false;
        //        });
        //    }
        //    item.IsEdit = true;
        //}
            
        $scope.ChangeAnteriorPosteriorTemplate = function (item) {
            if ($scope.AnteriorTemplatesArray.length > 0) {
                angular.forEach($scope.AnteriorTemplatesArray, function (mitem) {
                    mitem.IsEdit = false;
                    //item.IsDescriptionEdit = false;
                });
            }
            item.IsEdit = true;
        }
        $scope.DeleteDiagnosisTemplate = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete this template  ?", function () {
                var params = {
                    "UserId": $scope.UserId,
                    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "TemplateId": item.TemplateId,
                    "TemplateName": item.TemplateName,
                    "DiagnosisArray": item.DiagnosisArray,
                    "Medications": item.Medications,
                    "DeleteInd": 1,
                    "IsTemplateFavorites": false,
                    "IsDiagnosisMultiple": false
                }

                eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
                    $scope.GetUserConsultationTemplateDetails();
                    if (resp.data != undefined && resp.data != "") {
                        alertify.success("Delete successfully");
                    };
                    $scope.ExamAnteriorPosteriorObject.ViewAutoPlansDtls = false;
                }, function (err) {

                });
            }, function () {
                r = "You pressed Cancel!";
            });

        };

        $scope.DeleteAnteriorPosteriorTemplate = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete this Template ?", function () {
                var params = {
                    "UserId": $scope.UserId,
                    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "TemplateId": item.TemplateId || 0,
                    "TemplateName": item.TemplateName || "",
                    "AnteriorArray": [],
                    "PosteriorArray": [],
                    "ExternalExaminationsArray": [],
                    "DeleteInd": 'Y',
                    "IsTemplateFavorites": false
                }

                eHnotePatientDataService.AddUpdateExaminationTemplates(params).then(function (resp) {
                    if (resp.data.Status === "Success") {
                        $scope.ExamAnteriorPosteriorObject.ViewAnteriorPosteriorTemplateDtls = false;
                        alertify.success("Template Deleted Sucessfully");
                        $scope.GetUserConsultationTemplateDetails();
                    }
                }, function (err) {

                });
            }, function () {
                r = "You pressed Cancel!";
            });
            
        };

        $scope.NewAddFaviroteDiagnosistemplate = function (item) {
            item.IsTemplateFavorites = !item.IsTemplateFavorites || false;
            var params = {
                "UserId": $scope.UserId,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "TemplateId": item.TemplateId,
                "TemplateName": item.TemplateName,
                "AnteriorSegmentArrayNew": item.AnteriorValuesArray || [],
                "PoteriorSegmentArrayNew": item.PosteriorValuesArray || [],
                "DiagnosisArray": item.DiagnosisArray,
                "Medications": item.Medications,
                "DeleteInd": 0,
                "IsTemplateFavorites": item.IsTemplateFavorites,
                "IsDiagnosisMultiple": false
            }

            eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
                $scope.GetUserConsultationTemplateDetails();
                if (resp.data != undefined && resp.data != "") {
                    if (item.IsTemplateFavorites) {
                        alertify.success('Add Favorite Template Successfully');
                    } else {
                        alertify.success('Remove Favorite Template Successfully');
                    }
                };
            }, function (err) {

            });
        };
        $scope.AddFaviroteTemplate = function (item, type) {
            item.IsTemplateFavorites = !item.IsTemplateFavorites || false;
            var params = {
                "UserId": $scope.UserId,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "TemplateId": item.TemplateId || 0,
                "TemplateName": item.TemplateName || "",
                "AnteriorArray": [],
                "PosteriorArray": [],
                "ExternalExaminationsArray": [],
                "DeleteInd": 'N',
                "IsTemplateFavorites": item.IsTemplateFavorites || false
            }
            
            eHnotePatientDataService.AddUpdateExaminationTemplates(params).then(function (resp) {
                if (resp.data.Status === "Success") {
                    if (item.IsTemplateFavorites) {
                        alertify.success('Add Favorite Template Successfully');
                    } else {
                        alertify.success('Remove Favorite Template Successfully');
                    }

                    //if (type == 1) {
                    //    $scope.GetUserAnteriorTemplateDetails();
                    //} else {
                    //    $scope.GetUserPosteriorTemplateDetails();
                    //}
                    $scope.GetUserConsultationTemplateDetails();
                };
            }, function (err) {

            });
        };

        $scope.ClearExtraOcularMotility = function () {
            var data = $filter("filter")($scope.MotorExaminationObj.NineGazeExtraOcularDetails, function (iterator, ind) { return iterator.InvestigationId === 18 }) || [];
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Extra Ocular Motility data?  </h4>", function () {
                angular.forEach(data, function (item) {
                    item.RIoValue = '';
                    item.RIrValue = '';
                    item.RLrValue = '';
                    item.RMrValue = '';
                    item.RRemarks = '';
                    item.RSoValue = '';
                    item.RsrValue = '';
                    item.LIoValue = '';
                    item.LIrValue = '';
                    item.LLrValue = '';
                    item.LMrValue = '';
                    item.LRemarks = '';
                    item.LSoValue = '';
                    item.LSrValue = '';
                    item.ActiveInd = 'N';
                    $scope.$digest();
                },
                    function () {
                        r = "You pressed Cancel!";
                    });
            })
        }

        $scope.ClearDuctions = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Ductions data?  </h4>", function () {
                if ($scope.DuctionsArrayListOS.length > 0) {
                    angular.forEach($scope.DuctionsArrayListOS, function (value) {
                        value.IsChecked = false;
                    });
                }
                if ($scope.DuctionsArrayListOD.length > 0) {
                    angular.forEach($scope.DuctionsArrayListOD, function (value1) {
                        value1.IsChecked = false;
                    });
                }
                item.InvestigationOrgans = [];
                item.ActiveInd = 'N';
                $scope.$digest();
            },
                function () {
                    r = "You pressed Cancel!";
                });
         }
       
        $scope.Clear9GazeEvaluation = function () {
            var data = $filter("filter")($scope.MotorExaminationObj.NineGazeExtraOcularDetails, function (iterator, ind) { return iterator.InvestigationId === 695 }) || [];
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear 9Gaze Evaluation data?  </h4>", function () {
                angular.forEach(data, function (item) {
                    item.RsrValue = "";
                    item.RsrIoValue = "";
                    item.RIoValue = "";
                    item.RLrValue = "";
                    item.RPgValue = "";
                    item.RMrValue = "";
                    item.RIrValue = "";
                    item.RIrSoValue = "";
                    item.RSoValue = "";
                    item.RRemarks = "";
                    item.LIoValue = "";
                    item.LIoSrValue = "";
                    item.LSrValue = "";
                    item.LMrValue = "";
                    item.LPgValue = "";
                    item.LLrValue = "";
                    item.LSoValue = "";
                    item.LSoIrValue = "";
                    item.LIrValue = "";
                    item.LRemarks = "";
                    item.ActiveInd = 'N';
                    $scope.$digest();
                },
                    function () {
                        r = "You pressed Cancel!";
                    });
            })
        }

        $scope.ClearAlphabetPattern = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Alphabet Pattern data?  </h4>", function () {
                item.AlphabetPattern = "";
                item.AlphaPatternInd = false;
                item.ActiveInd = 'N';
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.ClearCoverTest = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Cover/Alternate Cover Test data?  </h4>", function () {
                item.DistanceValue = "";
                item.DistanceFixationPreference = "";
                item.DistanceTypeOfSquintObj = "";
                item.NearTypeOfSquintObj = "";
                item.NearValue = "";
                item.NearFixationPreference = "";
                item.DistanceTypeOfSquintValue = "";
                item.NearTypeOfSquintValue = "";
                item.DistanceTypeOfSquintId = 0;
                item.NearTypeOfSquintId = 0;
                item.ActiveInd = 'N';
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.ClearHCRT = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Corneal Reflex /HCRT data?  </h4>", function () {
                item.RightEye.Name = "";
                item.RightEye.DegreeValue = "";
                item.RightEye.SelectReflexType = 0;
                item.LeftEye.Name = "";
                item.LeftEye.DegreeValue = "";
                item.LeftEye.SelectReflexType = 0;
                item.ActiveInd = 'N';
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.ClearHeadPosture = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Head Posture data?  </h4>", function () {
                item.ChinDepressionValue = "";
                item.ChinElevationValue = "";
                item.FaceTurnValue = "";
                item.HeadTiltValue = "";
                item.Remarks = "";
                item.ActiveInd = 'N';
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.ClearNystagmus = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Nystagmus data?  </h4>", function () {
                item.Nystagmus = "";
                item.ActiveInd = 'N';
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.ClearPrismCover = function (pitem, type) {

            if (type == 'Distance') {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Distance data?  </h4>", function () {
                    pitem.DistanceRPrismValue = "";
                    pitem.DistanceLPrismValue = "";
                    pitem.DistanceRTypeOfSquintObj = "";
                    pitem.DistanceLTypeOfSquintObj = "";
                    pitem.DistanceRFixationPreference = "";
                    pitem.DistanceLFixationPreference = "";
                    pitem.DistanceRTypeOfSquintValue = "";
                    pitem.DistanceLTypeOfSquintValue = "";
                    pitem.DistanceLTypeOfSquintId = 0;
                    pitem.DistanceRTypeOfSquintId = 0;
                    $scope.$digest();
                }, function () {
                    r = "You pressed Cancel!";
                });
            }
            if (type == 'Near') {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Near data?  </h4>", function () {
                    pitem.NearLFixationPreference = "";
                    pitem.NearLPrismValue = "";
                    pitem.NearLTypeOfSquintId = 0;
                    pitem.NearLTypeOfSquintValue = "";
                    pitem.NearRFixationPreference = "";
                    pitem.NearRPrismValue = "";
                    pitem.NearRTypeOfSquintId = 0;
                    pitem.NearRTypeOfSquintValue = "";
                    pitem.NearRTypeOfSquintObj = "";
                    pitem.NearLTypeOfSquintObj = "";
                    $scope.$digest();
                }, function () {
                    r = "You pressed Cancel!";
                });
            }

        }

        $scope.ClearWorthFourDotTest = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Worth Four Dot Test data?  </h4>", function () {
                item.DistanceValue = "";
                item.NearValue = "";
                item.DistanceValueId = 0;
                item.NearValueId = 0;
                item.ActiveInd = 'N';
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.ClearNearPointAccommodation = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Near Point Accommodation data?  </h4>", function () {
                item.BlurODValue = "";
                item.BlurOSValue = "";
                item.BlurOUValue = "";
                item.BreakODValue = "";
                item.BreakOSValue = "";
                item.BreakOUValue = "";
                item.RecoveryODValue = "";
                item.RecoveryOSValue = "";
                item.RecoveryOUValue = "";
                item.Remarks = "";
                item.ActiveInd = 'N';
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.ClearRelativeAccomodation = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear RelativeAccomodation data?  </h4>", function () {
                item.ODNegativeDistaceValue = "";
                item.OSNegativeDistaceValue = "";
                item.ODNegativeNearValue = "";
                item.OSNegativeNearValue = "";
                item.ODPositiveDistaceValue = "";
                item.OSPositiveDistaceValue = "";
                item.ODPositiveNearValue = "";
                item.OSPositiveNearValue = "";
                //item.ODNegitiveValue = "";
                //item.ODPositiveValue = "";
                //item.OSNegitiveValue = "";
                //item.OSPositiveValue = "";
                item.Remarks = "";
                item.ActiveInd = 'N';
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.ClearNearPointConvergence = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Near Point Convergence data?  </h4>", function () {
                item.BlurOUValue = "";
                item.BreakOUValue = "";
                item.RecoveryOUValue = "";
                item.Remarks = "";
                item.ActiveInd = 'N';
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.ClearFusionalVergence = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear FusionalVergence data?  </h4>", function () {
                item.ODNegativeDistaceValue = "";
                item.OSNegativeDistaceValue = "";
                item.ODNegativeNearValue = "";
                item.OSNegativeNearValue = "";
                item.ODPositiveDistaceValue = "";
                item.OSPositiveDistaceValue = "";
                item.ODPositiveNearValue = "";
                item.OSPositiveNearValue = "";
                //item.ODNegitiveValue = "";
                //item.ODPositiveValue = "";
                //item.OSNegitiveValue = "";
                //item.OSPositiveValue = "";
                item.Remarks = "";
                item.ActiveInd = 'N';
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.ClearStereopsis = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Stereopsis data?  </h4>", function () {
                item.Fly = "";
                item.FlyId = 0;
                item.Animals = "";
                item.AnimalsId = 0;
                item.Circles = "";
                item.CirclesId = 0;
                item.RandotCircles = "";
                item.RandotCirclesId = 0;
                item.DistVectograph = "";
                item.DistVectographId = 0;
                item.DistStereo = "";
                item.DistStereoId = 0;
                item.Frisby = "";
                item.FrisbyId = 0;
                item.Lang = "";
                item.LangId = 0;
                item.ActiveInd = 'N';
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.SaveExamAnteriorPosteriorTemplate = function () {

            $scope.TempAnteriorArray = [];
            $scope.TempPosteriorArray = [];
            $scope.AnteriorSegmentArrayNew = $scope.AnteriorSegmentArrayNew || [];
            $scope.PoteriorSegmentArrayNew = $scope.PoteriorSegmentArrayNew || [];
                if ($scope.Examinationobj.EnterAnteriorTemplateName == "") {
                    alertify.error("Please Enter Template Name");
                    return false;
                }
                if ($scope.AnteriorSegmentArrayNew.length === 0 && $scope.PoteriorSegmentArrayNew.length === 0) {
                    alertify.error("Please Select Anterior Are Posterior Details");
                    return false;
                }
                if ($scope.AnteriorSegmentArrayNew.length > 0) {
                    angular.forEach($scope.AnteriorSegmentArrayNew, function (item) {
                        $scope.temparray = [];
                        angular.forEach(item.RemarksArray, function (Sitem) {

                            if (Sitem.ActiveInd == 'Y') {
                                var obj = {
                                    "OrganId": Sitem.OrganId || 1,
                                    "OrganName": Sitem.OrganId == 1 ? 'OD' : 'OS',
                                    "RemarksId": Sitem.InvFindingId || 0,
                                    "ActiveInd": "Y",
                                    "Remarks": Sitem.FindingValue || '',
                                    "InvFindingId": Sitem.InvFindingId,
                                    "SubFindingList": Sitem.SubFindingList || [],
                                    "Notes": Sitem.Notes || '',
                                }
                                $scope.temparray.push(obj);
                            }
                        });

                        if ($scope.temparray.length > 0) {
                            var obj1 = {
                                "CategoryId": 5,
                                "CategoryName": "Anterior Segment",
                                "InvestigationId": item.InvestigationId,
                                "InvestigationDesc": item.InvestigationDesc,
                                "RemarksList": $scope.temparray || [],
                            }
                            $scope.TempAnteriorArray.push(obj1);
                        }

                    });
                    
            }

            if ($scope.PoteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (item) {
                    $scope.temparray = [];
                    angular.forEach(item.RemarksArray, function (Sitem) {
                        if (Sitem.ActiveInd == 'Y') {
                            var obj = {
                                "OrganId": Sitem.OrganId || 1,
                                "OrganName": Sitem.OrganId == 1 ? 'OD' : 'OS',
                                "RemarksId": 0,
                                "ActiveInd": "Y",
                                "Remarks": Sitem.FindingValue || '',
                                "InvFindingId": Sitem.InvFindingId,
                                "SubFindingList": Sitem.SubFindingList || [],
                                "Notes": Sitem.Notes || '',
                            }
                            $scope.temparray.push(obj);
                        }

                    });
                    if ($scope.temparray.length > 0) {
                        var obj1 = {
                            "CategoryId": 6,
                            "CategoryName": "Posterior Segment",
                            "InvestigationId": item.InvestigationId,
                            "InvestigationDesc": item.InvestigationDesc,
                            "RemarksList": $scope.temparray || [],

                        }
                        $scope.TempPosteriorArray.push(obj1);
                    }
                });
            }

            var params = {
                "UserId": $scope.UserId,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                //"TypeName": "Anterior",
                //"TypeId": 1,
                "TemplateId": 0,
                "TemplateName": $scope.Examinationobj.EnterAnteriorTemplateName || "",
                "AnteriorArray": $scope.TempAnteriorArray || [],
                "PosteriorArray": $scope.TempPosteriorArray || [],
                "ExternalExaminationsArray": [],
                "DeleteInd": 'N',
                "IsTemplateFavorites": false
            }
            eHnotePatientDataService.AddUpdateExaminationTemplates(params).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.Examinationobj.EnterAnteriorTemplateName = '';
                    if (params.TemplateId === 0) {
                        alertify.success("Save successfully");
                    } else {
                        alertify.success("Update successfully");
                    }
                    /*$scope.GetUserAnteriorTemplateDetails();*/
                    $scope.GetUserConsultationTemplateDetails();
                    $scope.ExamAnteriorPosteriorObject.IsAnteriorTemplatePopover = false;
                }
                else if (resp.data.Status == "Failure") {
                    alertify.error("TemplateName Already Exists");
                }
            }, function (err) {

            });
           
        }
      
        $scope.ChangeGonioscopyNormal = function (ditem, item, eyetype) {
            if (ditem) {

                var List = $filter("filter")($scope.DepthArrayList, { "Id": 4 }, true) || [];
                var List1 = $filter("filter")($scope.GonioscopyStructuresdropdown, { "Id": 7 }, true) || [];
                var PigmentList = $filter("filter")($scope.PigmentArrayList, { "Id": 9 }, true) || [];

                if (eyetype == 'OD') {

                    if (List.length > 0) {

                        item.RightEye.DepthBottomValue = List[0].Name;
                        item.RightEye.DepthBottomValueObj = List[0];
                        item.RightEye.DepthRightValue = List[0].Name
                        item.RightEye.DepthRightValueObj = List[0];
                        item.RightEye.DepthTopValue = List[0].Name
                        item.RightEye.DepthTopValueObj = List[0];
                        item.RightEye.DepthLeftValue = List[0].Name
                        item.RightEye.DepthLeftValueObj = List[0];
                        item.RightEye.PigmentValue = PigmentList[0].Name
                        item.RightEye.PigmentValueObj = PigmentList[0];
                    }
                    if (List1.length > 0) {
                        item.RightEye.BottomValue = List1[0].Name;
                        item.RightEye.BottomValueObj = List1[0];
                        item.RightEye.RightValue = List1[0].Name
                        item.RightEye.RightValueObj = List1[0];
                        item.RightEye.TopValue = List1[0].Name
                        item.RightEye.TopValueObj = List1[0];
                        item.RightEye.LeftValue = List1[0].Name
                        item.RightEye.LeftValueObj = List1[0];
                    }

                } else {

                    if (List.length > 0) {

                        item.LeftEye.DepthBottomValue = List[0].Name
                        item.LeftEye.DepthBottomValueObj = List[0];
                        item.LeftEye.DepthRightValue = List[0].Name
                        item.LeftEye.DepthRightValueObj = List[0];
                        item.LeftEye.DepthTopValue = List[0].Name
                        item.LeftEye.DepthTopValueObj = List[0];
                        item.LeftEye.DepthLeftValue = List[0].Name
                        item.LeftEye.DepthLeftValueObj = List[0];
                        item.LeftEye.PigmentValue = PigmentList[0].Name
                        item.LeftEye.PigmentValueObj = PigmentList[0];
                    }
                    if (List1.length > 0) {
                        item.LeftEye.BottomValue = List1[0].Name;
                        item.LeftEye.BottomValueObj = List1[0];
                        item.LeftEye.RightValue = List1[0].Name
                        item.LeftEye.RightValueObj = List1[0];
                        item.LeftEye.TopValue = List1[0].Name
                        item.LeftEye.TopValueObj = List1[0];
                        item.LeftEye.LeftValue = List1[0].Name
                        item.LeftEye.LeftValueObj = List1[0];
                    }

                }
            } else {
                $scope.ClearGonioscopyDetails(item, eyetype);
                //if (eyetype == 'OD') {
                //    item.RightEye.DepthBottomValue = '';
                //    item.RightEye.DepthBottomValueObj = '';
                //    item.RightEye.DepthRightValue = '';
                //    item.RightEye.DepthRightValueObj = '';
                //    item.RightEye.DepthTopValue = '';
                //    item.RightEye.DepthTopValueObj = '';
                //    item.RightEye.DepthLeftValue = '';
                //    item.RightEye.DepthLeftValueObj = '';
                //    item.RightEye.PigmentValue = '';
                //    item.RightEye.PigmentValueObj = '';
                //    item.RightEye.BottomValue = '';
                //    item.RightEye.BottomValueObj = '';
                //    item.RightEye.RightValue = '';
                //    item.RightEye.RightValueObj = '';
                //    item.RightEye.TopValue = '';
                //    item.RightEye.TopValueObj = '';
                //    item.RightEye.LeftValue = '';
                //    item.RightEye.LeftValueObj = '';
                //} else {
                //    item.LeftEye.DepthBottomValue = '';
                //    item.LeftEye.DepthBottomValueObj = '';
                //    item.LeftEye.DepthRightValue = '';
                //    item.LeftEye.DepthRightValueObj = '';
                //    item.LeftEye.DepthTopValue = '';
                //    item.LeftEye.DepthTopValueObj = '';
                //    item.LeftEye.DepthLeftValue = '';
                //    item.LeftEye.DepthLeftValueObj = '';
                //    item.LeftEye.PigmentValue = '';
                //    item.LeftEye.PigmentValueObj = '';
                //    item.LeftEye.BottomValue = '';
                //    item.LeftEye.BottomValueObj = '';
                //    item.LeftEye.RightValue = '';
                //    item.LeftEye.RightValueObj = '';
                //    item.LeftEye.TopValue = '';
                //    item.LeftEye.TopValueObj = '';
                //    item.LeftEye.LeftValue = '';
                //    item.LeftEye.LeftValueObj = '';
                //}
            }

        };

        function GetCDRGraphObj() {
            return {
                "IsShowCDRgraph": false,
                "IsCDRArrayEmpty": false
            }
        };
        $scope.CDRGraphObj = GetCDRGraphObj();

        $scope.ShowCDRGraph = function () {
            $scope.CDRGraphObj.IsShowCDRgraph = !$scope.CDRGraphObj.IsShowCDRgraph;
            if ($scope.CDRGraphObj.IsShowCDRgraph) {
                var obj = {
                    "PatientId": $scope.cacheStorageItem.patientid
                };
                eHnotePatientDataService.GetGraphRelatedPatientData(obj).then(function (resp) {
                    $scope.PatientGraphData = [];
                    if (resp.data.Status == "Success") {
                        $scope.PatientGraphData = resp.data.rows || [];

                        const labels1 = [];
                        angular.forEach($scope.PatientGraphData, function (item, index) {
                            item.AppointmentDate = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                            labels1.unshift(item.AppointmentDate);
                        });

                        let CDRODArray = [];
                        angular.forEach($scope.PatientGraphData, function (item) {
                            if (item.PosteriorSegmentDetails.length > 0) {
                                item.PosteriorSegmentDetails[0].RVertical = item.PosteriorSegmentDetails[0].RVertical || '';
                                if (item.PosteriorSegmentDetails[0].RVertical != '') {
                                    let Date = item.AppointmentDate;
                                    let obj = {
                                        x: Date,
                                        y: (item.PosteriorSegmentDetails[0].RVertical != '') ? item.PosteriorSegmentDetails[0].RVertical : null
                                    };
                                    CDRODArray.push(obj);
                                }
                            }
                        });

                        let CDROSArray = [];
                        angular.forEach($scope.PatientGraphData, function (item) {
                            if (item.PosteriorSegmentDetails.length > 0) {
                                item.PosteriorSegmentDetails[0].LVertical = item.PosteriorSegmentDetails[0].LVertical || '';
                                if (item.PosteriorSegmentDetails[0].LVertical != '') {
                                    let Date = item.AppointmentDate;
                                    let obj = {
                                        x: Date,
                                        y: (item.PosteriorSegmentDetails[0].LVertical != '') ? item.PosteriorSegmentDetails[0].LVertical : null
                                    };
                                    CDROSArray.push(obj);
                                }
                            }
                        });

                        if (CDRODArray.length == 0 && CDROSArray.length == 0) {
                            $scope.CDRGraphObj.IsCDRArrayEmpty = true;
                            return false;
                        }

                        const data1 = {
                            labels: labels1,
                            datasets: [
                                {
                                    type: 'scatter',
                                    label: 'OD',
                                    backgroundColor: 'rgb(255, 0, 0)',
                                    borderColor: 'rgb(255, 0, 0)',
                                    showLine: true,
                                    data: CDRODArray
                                },
                                {
                                    type: 'scatter',
                                    label: 'OS',
                                    backgroundColor: 'rgb(17, 66, 245)',
                                    borderColor: 'rgb(17, 66, 245)',
                                    showLine: true,
                                    data: CDROSArray,
                                }
                            ]
                        }

                        let len = $("canvas#myChart").length;
                        if (len > 0) {
                            $("canvas#myChart").remove();
                            $("div.CDRGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                        } else if (len === 0) {
                            $("div.CDRGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                        }

                        const myChart = new Chart('myChart', {
                            type: 'scatter',
                            data: data1,
                            options: {
                                scales: {
                                    x: {
                                        position: 'bottom',
                                        type: 'category'
                                    },
                                    y: {
                                        type: 'linear',
                                        position: 'left'
                                    },
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            title: function () { return ''; }
                                        }
                                    }
                                }
                            }

                        });
                    }
                });
            } else {
                $scope.CDRGraphObj.IsShowCDRgraph = false;
                $scope.CDRGraphObj.IsCDRArrayEmpty = false;
            }
        };
        
    }]);
"use strict";
eHnoteWebApp.controller("EhnoteDrawingpadDetailsCtrl", ["$scope", "eHnotePatientDataService", "$timeout", "alertify", "eHnoteMasterDataService", "eHnoteCacheStorageService", "$filter", "datapersistanceFactory", "eHnoteDbStaticDataService", "$location", "$uibModalInstance", "eHnoteMainAppointmentService", "$rootScope", "SurgeryStaticDataService", "localStorageFactory", "eHnotePrintService", "eHnoteDiagnosisDataServices", "cache", function ($scope, eHnotePatientDataService, $timeout, alertify, eHnoteMasterDataService, eHnoteCacheStorageService, $filter, datapersistanceFactory, eHnoteDbStaticDataService, $location, $uibModalInstance, eHnoteMainAppointmentService, $rootScope, SurgeryStaticDataService, localStorageFactory, eHnotePrintService, eHnoteDiagnosisDataServices, cache) {

    //$scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.cacheStorageItem = cache;
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.fileReaderSupported = window.FileReader !== null;
    $scope.Tab = 'Anterior';
    $scope.Investigation = {};
    $scope.RightEyefileName = "";
    $scope.LeftEyefileName = "";
    $scope.Investigation.SelectedEye = "1";
    $rootScope.ShowDrawingpadata = false;
    $scope.viewconsultationsummarydiv = false;



    $scope.cache = $scope.cacheStorageItem;


    $scope.Main = {};
    $scope.Main.DisplayID = $scope.cacheStorageItem.PatientDisplayId;
    $scope.Main.IsTimeChanged = false;
    $scope.Main.Hours = SurgeryStaticDataService.GetHours();
    $scope.Main.Minutes = SurgeryStaticDataService.GetAllMinutes();


    $scope.Main.CurrentAppointmentBillingDue = appointmentinfo.CurrentAppointmentDue ? appointmentinfo.CurrentAppointmentDue : 0;
    $scope.Main.AllAppointmentBillingDue = appointmentinfo.CurrentAppointmentDue ? appointmentinfo.TotalPatientDue : 0;
    if (!$scope.cache.IsAnteriorLeftEyeCheckAll) {
        $scope.Investigation.SelectedEye = "2";
    }
    if ($scope.cache.IsPosteriorLeftEyeCheckedAll) {
        $scope.Investigation.SelectedEye = "1";
    }
    $scope.switchTab = function (type) {
        $scope.Tab = type;
        if (type === 'Posterior') {
            if ($scope.cacheStorageItem.PosteriorDetails.length !== 0) {
                $scope.Investigation = $scope.cacheStorageItem.PosteriorDetails[0];

                $scope.DefaultlyGetTemplate('Right', $scope.Investigation);
            }
        }
        if (type === 'Anterior') {
            if ($scope.cacheStorageItem.AnteriorDetails.length !== 0) {
                $scope.Investigation = $scope.cacheStorageItem.AnteriorDetails[0];

                $scope.DefaultlyGetTemplate('Right', $scope.Investigation);
            }
        }
        $scope.Investigation.SelectedEye = "1";
    }
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.PatientData = eHnoteMasterDataService.getpatientData();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.Investigation.RightEyefileName = "";
    $scope.Investigation.LeftEyefileName = "";

    $scope.curDate = {
        "ConsultationDate": ""
    };
    $scope.Investigation.thumbnailRightEye = "";
    $scope.Investigation.thumbnailLeftEye = "";

    $scope.Investigation.RightEyediv = false;
    $scope.Investigation.LeftEyediv = false;

    $scope.tagObj = {
        "IsVIPInd": false,
        "IsResearchInd": false,
        "IsHighRiskInd": false,
        "IsVIPRemarks": "",
        "IsResearchRemarks": "",
        "IsHighRiskRemarks": "",
        "IsVIPTagActive": 'N'
    };

    $scope.tagObj.IsVIPInd = $scope.cacheStorageItem.IsVIPInd || false;
    $scope.tagObj.IsResearchInd = $scope.cacheStorageItem.IsResearchInd || false;
    $scope.tagObj.IsVIPRemarks = $scope.cacheStorageItem.IsVIPRemarks || "";
    $scope.tagObj.IsResearchRemarks = $scope.cacheStorageItem.IsResearchRemarks || "";
    $scope.tagObj.IsHighRiskInd = $scope.cacheStorageItem.IsHighRiskInd || false;
    $scope.tagObj.IsHighRiskRemarks = $scope.cacheStorageItem.IsHighRiskRemarks || "";
    $scope.OptometristName = appointmentinfo.OptometristName || "";
    $scope.languagedetails = [];
    $scope.GetLanguages = function () {
        var param = {
            "PatientID": $scope.cacheStorageItem.patientid,

            "USRType": "DOCTOR",
            "hospitalInfo": {
                "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "HospitalCD": "",
                "DoctorID": $scope.cacheStorageItem.doctorid
            }
        };
        eHnoteMainAppointmentService.Getpatienteditid(param, editSuccess, editError);
        function editSuccess(data) {
            $scope.languagedetails = data.PatientLanguage;

        };
        function editError(err) {
            console.log(err);
        }
    };
    $scope.GetLanguages();

    var object = {};
    $scope.toDataURL = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.send();
    };
    //$scope.GOTOConsultation = function () {

    //    angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (gitem) {
    //        if (gitem.SelectedRightEyeRemarksObj !== "") {

    //            var isObject = angular.isObject(gitem.SelectedRightEyeRemarksObj);
    //            var findingVal = "", findingid = 0;
    //            if (isObject) {
    //                findingVal = gitem.SelectedRightEyeRemarksObj.FindingValue || "";
    //                findingid = gitem.SelectedRightEyeRemarksObj.InvFindingId;
    //            } else {
    //                findingVal = gitem.SelectedRightEyeRemarksObj || "";
    //            }
    //            var obj = {
    //                "RemarksId": 0,
    //                "ActiveInd": 'Y',
    //                "Remarks": findingVal || "",
    //                "InvFindingId": findingid || 0
    //            };

    //            if (obj.Remarks === "") {

    //            } else {
    //                gitem.RightEye.RemarksArray.push(obj);
    //            }

    //            gitem.SelectedRightEyeRemarksObj = "";
    //        }

    //        if (gitem.SelectedLeftEyeRemarksObj !== "") {


    //            var isObject = angular.isObject(gitem.SelectedLeftEyeRemarksObj);
    //            var findingVal = "", findingid = 0;
    //            if (isObject) {
    //                findingVal = gitem.SelectedLeftEyeRemarksObj.FindingValue || "";
    //                findingid = gitem.SelectedLeftEyeRemarksObj.InvFindingId;
    //            } else {
    //                findingVal = gitem.SelectedLeftEyeRemarksObj || "";
    //            }
    //            var obj = {
    //                "RemarksId": 0,
    //                "ActiveInd": 'Y',
    //                "Remarks": findingVal || "",
    //                "InvFindingId": findingid || 0
    //            };


    //            if (obj.Remarks === "") {

    //            } else {
    //                gitem.LeftEye.RemarksArray.push(obj);
    //            }

    //            gitem.SelectedLeftEyeRemarksObj = "";
    //        }
    //    });

    //    angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (gitem) {
    //        if (gitem.SelectedRightEyeRemarksObj !== "") {

    //            var isObject = angular.isObject(gitem.SelectedRightEyeRemarksObj);
    //            var findingVal = "", findingid = 0;
    //            if (isObject) {
    //                findingVal = gitem.SelectedRightEyeRemarksObj.FindingValue || "";
    //                findingid = gitem.SelectedRightEyeRemarksObj.InvFindingId;
    //            } else {
    //                findingVal = gitem.SelectedRightEyeRemarksObj || "";
    //            }
    //            var obj = {
    //                "RemarksId": 0,
    //                "ActiveInd": 'Y',
    //                "Remarks": findingVal || "",
    //                "InvFindingId": findingid || 0
    //            };

    //            if (obj.Remarks === "") {

    //            } else {
    //                gitem.RightEye.RemarksArray.push(obj);
    //            }

    //            gitem.SelectedRightEyeRemarksObj = "";
    //        }

    //        if (gitem.SelectedLeftEyeRemarksObj !== "") {


    //            var isObject = angular.isObject(gitem.SelectedLeftEyeRemarksObj);
    //            var findingVal = "", findingid = 0;
    //            if (isObject) {
    //                findingVal = gitem.SelectedLeftEyeRemarksObj.FindingValue || "";
    //                findingid = gitem.SelectedLeftEyeRemarksObj.InvFindingId;
    //            } else {
    //                findingVal = gitem.SelectedLeftEyeRemarksObj || "";
    //            }
    //            var obj = {
    //                "RemarksId": 0,
    //                "ActiveInd": 'Y',
    //                "Remarks": findingVal || "",
    //                "InvFindingId": findingid || 0
    //            };


    //            if (obj.Remarks === "") {

    //            } else {
    //                gitem.LeftEye.RemarksArray.push(obj);
    //            }

    //            gitem.SelectedLeftEyeRemarksObj = "";
    //        }
    //    });
    //    $scope.AddToCache();
    //    $rootScope.ShowDrawingpadata = true;
    //    $rootScope.$emit("ReloadDrawingpadata" );
    //   // $location.url("/NewOpthaConsultation");

    //    if ($scope.cacheStorageItem.ShowNewConsultation) {
    //        $location.url("/NewOpthaconsultation");
    //    } else {
    //        $location.url("/NewOpthaConsultation");
    //    }

    //    console.log($scope.cacheStorageItem.AnteriorDetails[0], "Divya1");
    //}

    $scope.GOTOConsultation = function () {
        if ($scope.cacheStorageItem.AnteriorDetails.length > 0) {
            angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (item) {
                if (item.RightEye.RemarksArray.length > 0 || item.LeftEye.RemarksArray.length > 0 || item.RightEye.ImagesArray.length > 0 || item.LeftEye.ImagesArray.length > 0 || item.RightEye.CdRatio != "" || item.LeftEye.CdRatio != "" || item.RightEye.Frequency != "" || item.LeftEye.Frequency != "" || item.SelectedRightEyeRemarksObj !== "" || item.SelectedLeftEyeRemarksObj !== "" ||
                    item.BothEye.RemarksArray.length > 0 || item.BothEye.ImagesArray.length > 0 || item.BothEye.CdRatio != "" || item.BothEye.Frequency != "" || item.SelectedBothEyeRemarksObj !== "") {
                    item.IsSelected = true;
                }
            });
        }
        if ($scope.cacheStorageItem.PosteriorDetails.length > 0) {
            angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (item) {
                if (item.RightEye.RemarksArray.length > 0 || item.LeftEye.RemarksArray.length > 0 || item.RightEye.ImagesArray.length > 0 || item.LeftEye.ImagesArray.length > 0 || item.RightEye.CdRatio != "" || item.LeftEye.CdRatio != "" || item.RightEye.Frequency != "" || item.LeftEye.Frequency != "" || item.SelectedRightEyeRemarksObj !== "" || item.SelectedLeftEyeRemarksObj !== "" ||
                    item.BothEye.RemarksArray.length > 0 || item.BothEye.ImagesArray.length > 0 || item.BothEye.CdRatio != "" || item.BothEye.Frequency != "" || item.SelectedBothEyeRemarksObj !== "") {
                    item.IsSelected = true;
                }
            });
        }

        $uibModalInstance.close($scope.cacheStorageItem);
    }

    function formInvestigations() {

        $scope.sampleAnterior = [];
        $scope.samplePosterior = [];

        $scope.cacheStorageItem.AllInvestigationData = [];
        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        $scope.AllInvestigationData = angular.copy(mObj.masterFindings);
        /* $scope.cacheStorageItem.AllInvestigationData = $scope.AllInvestigationData;*/

        $scope.sampleAnterior = $filter("filter")($scope.AllInvestigationData, { "CategoryId": 5 }, true);
        $scope.samplePosterior = $filter("filter")($scope.AllInvestigationData, { "CategoryId": 6 }, true);

        formAnteriorDetails($scope.sampleAnterior);
        formPosteriorDetails($scope.samplePosterior);

        // $scope.AddToCache();
    }
    formInvestigations();


    $scope.SelectInvestigation = function (item) {
        console.log(item);
        $scope.Investigation = {};
        item.SelectedEye = "1";
        item.RightPwCanvas = item.RightPwCanvas;
        $scope.Investigation = angular.copy(item);
        //  $scope.Investigation.SelectedEye = "1";

        $scope.DefaultlyGetTemplate('Right', $scope.Investigation);
    };

    function formAnteriorDetails(data) {
        $scope.tempAnteriorDetails = [];
        if (data !== undefined) {
            if (data.length > 0) {
                angular.forEach(data, function (item, index) {
                    var object = {
                        "PatientFindingAnteriorId": 0,
                        "InvestigationId": item.InvestigationId,
                        "CategoryId": item.CategoryId,
                        "CategoryDesc": "Anterior Segment",
                        "InvestigationDesc": item.Investigation,
                        "SubCategoryChildId": item.SubCategoryChildId,
                        "ActiveInd": "Y",
                        "RightEye": {
                            "RemarksArray": [],
                            "ImagesArray": [],
                            "CdRatio": "",
                            "Frequency": ""
                        },
                        "LeftEye": {
                            "RemarksArray": [],
                            "ImagesArray": [],
                            "CdRatio": "",
                            "Frequency": ""
                        },
                        "BothEye": {
                            "RemarksArray": [],
                            "ImagesArray": [],
                            "CdRatio": "",
                            "Frequency": ""
                        },
                        "RightTemplateUrl": item.RightTemplateUrl || "",
                        "LeftTemplateUrl": item.LeftTemplateUrl || "",
                        "RightPwCanvas": "RightPwCanvas" + item.InvestigationId,
                        "LeftPwCanvas": "LeftPwCanvas" + item.InvestigationId,
                        "RightEyeUndoCount": 0,
                        "LeftEyeUndoCount": 0,
                        "FrequencyValuesInd": item.FrequencyValuesInd,
                        "CdRatioValuesInd": item.CdRatioValuesInd,
                        "RemarksInd": item.RemarksInd,
                        "LeftEyeEdit": item.LeftEyeEdit,
                        "IsSubChildCategoryChecked": false,
                        "SelectedRightEyeRemarksObj": "",
                        "SelectedLeftEyeRemarksObj": "",
                        "SelectedBothEyeRemarksObj": "",
                        "SelectedEye": "1",
                        "IsSelected": false
                    };
                    $scope.tempAnteriorDetails.push(object);
                });
            }
        }
        console.log($scope.tempAnteriorDetails);
        $scope.tempAnteriorDetails = $filter("filter")($scope.tempAnteriorDetails, function (item) {
            return item.SubCategoryChildId !== undefined;
        });

        //$scope.cacheStorageItem.AnteriorDetails = $scope.tempAnteriorDetails;

        //angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (item) {
        //    if (item.IsInvDataAdded ==true) {

        //    }
        //});
        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (Aitem) {
            angular.forEach($scope.tempAnteriorDetails, function (TAitem) {
                if (TAitem.InvestigationId == Aitem.InvestigationId) {
                    TAitem.IsSubChildCategoryChecked = Aitem.IsSubChildCategoryChecked;

                    TAitem.SelectedRightEyeRemarksObj = Aitem.SelectedRightEyeRemarksObj || "";
                    TAitem.SelectedLeftEyeRemarksObj = Aitem.SelectedLeftEyeRemarksObj || "";
                }
            });
        });


    }
    function formPosteriorDetails(data) {
        $scope.tempPosteriorDetails = [];
        if (data !== undefined) {
            if (data.length > 0) {
                angular.forEach(data, function (item, index) {
                    var object = {
                        "PatientFindingAnteriorId": 0,
                        "InvestigationId": item.InvestigationId,
                        "CategoryId": item.CategoryId,
                        "CategoryDesc": "Posterior Segment",
                        "InvestigationDesc": item.Investigation,
                        "SubCategoryChildId": item.SubCategoryChildId,
                        "ActiveInd": "Y",
                        "RightEye": {
                            "RemarksArray": [],
                            "ImagesArray": [],
                            "CdRatio": "",
                            "Frequency": ""
                        },
                        "LeftEye": {
                            "RemarksArray": [],
                            "ImagesArray": [],
                            "CdRatio": "",
                            "Frequency": ""
                        },
                        "BothEye": {
                            "RemarksArray": [],
                            "DiagnosisArray": [],
                            "ImagesArray": [],
                            "CdRatio": "",
                            "Frequency": ""
                        },
                        "RightTemplateUrl": item.RightTemplateUrl || "",
                        "LeftTemplateUrl": item.LeftTemplateUrl || "",
                        "RightPwCanvas": "RightPwCanvas" + item.InvestigationId,
                        "LeftPwCanvas": "LeftPwCanvas" + item.InvestigationId,
                        "RightEyeUndoCount": 0,
                        "LeftEyeUndoCount": 0,
                        "FrequencyValuesInd": item.FrequencyValuesInd,
                        "CdRatioValuesInd": item.CdRatioValuesInd,
                        "RemarksInd": item.RemarksInd,
                        "LeftEyeEdit": item.LeftEyeEdit,
                        "IsSubChildCategoryChecked": false,
                        "SelectedRightEyeRemarksObj": "",
                        "SelectedLeftEyeRemarksObj": "",
                        "SelectedBothEyeRemarksObj": "",
                        "SelectedEye": "1",
                        "IsSelected": false
                    };
                    $scope.tempPosteriorDetails.push(object);
                });
            }
        }

        $scope.tempPosteriorDetails = $filter("filter")($scope.tempPosteriorDetails, function (item) {
            return item.SubCategoryChildId !== undefined;
        });

        angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (Pitem) {
            angular.forEach($scope.tempPosteriorDetails, function (TPitem) {
                if (TPitem.InvestigationId == Pitem.InvestigationId) {
                    TPitem.IsSubChildCategoryChecked = Pitem.IsSubChildCategoryChecked;

                    TPitem.SelectedRightEyeRemarksObj = Pitem.SelectedRightEyeRemarksObj || "";
                    TPitem.SelectedLeftEyeRemarksObj = Pitem.SelectedLeftEyeRemarksObj || "";
                }
            });
        });

        //  $scope.cacheStorageItem.PosteriorDetails = $scope.tempPosteriorDetails;
        getCachetoFindings();
    }

    function getCachetoFindings() {
        if ($scope.tempAnteriorDetails.length > 0) {
            for (var i = 0; i < $scope.cacheStorageItem.AnteriorDetails.length; i++) {
                for (var j = 0; j < $scope.tempAnteriorDetails.length; j++) {
                    if ($scope.cacheStorageItem.AnteriorDetails[i].InvestigationId === $scope.tempAnteriorDetails[j].InvestigationId) {
                        $scope.tempAnteriorDetails[j].PatientFindingAnteriorId = $scope.cacheStorageItem.AnteriorDetails[i].PatientFindingAnteriorId;

                        $scope.tempAnteriorDetails[j].InvestigationId = $scope.cacheStorageItem.AnteriorDetails[i].InvestigationId;
                        $scope.tempAnteriorDetails[j].CategoryId = $scope.cacheStorageItem.AnteriorDetails[i].CategoryId;
                        $scope.cacheStorageItem.AnteriorDetails[i].CategoryDesc = "Anterior Segment";
                        $scope.tempAnteriorDetails[j].InvestigationDesc = $scope.cacheStorageItem.AnteriorDetails[i].InvestigationDesc;
                        $scope.cacheStorageItem.AnteriorDetails[i].ActiveInd = "Y";
                        $scope.tempAnteriorDetails[j].RightEye.RemarksArray = $scope.cacheStorageItem.AnteriorDetails[i].RightEye.RemarksArray;
                        $scope.tempAnteriorDetails[j].LeftEye.RemarksArray = $scope.cacheStorageItem.AnteriorDetails[i].LeftEye.RemarksArray;
                        $scope.tempAnteriorDetails[j].RightEye.ImagesArray = $scope.cacheStorageItem.AnteriorDetails[i].RightEye.ImagesArray;
                        $scope.tempAnteriorDetails[j].LeftEye.ImagesArray = $scope.cacheStorageItem.AnteriorDetails[i].LeftEye.ImagesArray;
                        $scope.tempAnteriorDetails[j].RightEye.CdRatio = $scope.cacheStorageItem.AnteriorDetails[i].RightEye.CdRatio;
                        $scope.tempAnteriorDetails[j].LeftEye.CdRatio = $scope.cacheStorageItem.AnteriorDetails[i].LeftEye.CdRatio;
                        $scope.tempAnteriorDetails[j].RightEye.Frequency = $scope.cacheStorageItem.AnteriorDetails[i].RightEye.Frequency;
                        $scope.tempAnteriorDetails[j].LeftEye.Frequency = $scope.cacheStorageItem.AnteriorDetails[i].LeftEye.Frequency;
                        $scope.tempAnteriorDetails[j].SubCategoryChildId = $scope.cacheStorageItem.AnteriorDetails[i].SubCategoryChildId;

                        $scope.tempAnteriorDetails[j].BothEye.RemarksArray = $scope.cacheStorageItem.AnteriorDetails[i].BothEye.RemarksArray;
                        $scope.tempAnteriorDetails[j].BothEye.ImagesArray = $scope.cacheStorageItem.AnteriorDetails[i].BothEye.ImagesArray;
                        $scope.tempAnteriorDetails[j].BothEye.CdRatio = $scope.cacheStorageItem.AnteriorDetails[i].BothEye.CdRatio;
                        $scope.tempAnteriorDetails[j].BothEye.Frequency = $scope.cacheStorageItem.AnteriorDetails[i].BothEye.Frequency;

                        $scope.tempAnteriorDetails[j].IsSelected = $scope.cacheStorageItem.AnteriorDetails[i].IsSelected;

                        if ($scope.cacheStorageItem.AnteriorDetails[i].RightEye.ImagesArray.length > 0) {
                            angular.forEach($scope.cacheStorageItem.AnteriorDetails[i].RightEye.ImagesArray, function (mitem) {
                                mitem.url = mitem.DocURL;
                            });
                        }
                        if ($scope.cacheStorageItem.AnteriorDetails[i].LeftEye.ImagesArray.length > 0) {
                            angular.forEach($scope.cacheStorageItem.AnteriorDetails[i].LeftEye.ImagesArray, function (kitem) {
                                kitem.url = kitem.DocURL;
                            });
                        }
                        if ($scope.cacheStorageItem.AnteriorDetails[i].BothEye.ImagesArray.length > 0) {
                            angular.forEach($scope.cacheStorageItem.AnteriorDetails[i].BothEye.ImagesArray, function (kitem) {
                                kitem.url = kitem.DocURL;
                            });
                        }
                    }
                }
            }
            $scope.cacheStorageItem.AnteriorDetails = $scope.tempAnteriorDetails;
            $scope.cacheStorageItem.AnteriorDetails = $filter("filter")($scope.cacheStorageItem.AnteriorDetails, function (item) {
                return item.SubCategoryChildId !== undefined;
            });
        }
        if ($scope.cacheStorageItem.AnteriorDetails.length !== 0) {
            $scope.Investigation = $scope.cacheStorageItem.AnteriorDetails[0];
            $scope.Investigation.SelectedEye = "1";
            // $scope.SelectInvestigation($scope.cacheStorageItem.AnteriorDetails[0]);
        }



        if ($scope.tempPosteriorDetails.length > 0) {
            for (var i = 0; i < $scope.cacheStorageItem.PosteriorDetails.length; i++) {
                for (var j = 0; j < $scope.tempPosteriorDetails.length; j++) {
                    if ($scope.cacheStorageItem.PosteriorDetails[i].InvestigationId === $scope.tempPosteriorDetails[j].InvestigationId) {
                        $scope.tempPosteriorDetails[j].PatientFindingAnteriorId = $scope.cacheStorageItem.PosteriorDetails[i].PatientFindingAnteriorId;

                        $scope.tempPosteriorDetails[j].InvestigationId = $scope.cacheStorageItem.PosteriorDetails[i].InvestigationId;
                        $scope.tempPosteriorDetails[j].CategoryId = $scope.cacheStorageItem.PosteriorDetails[i].CategoryId;
                        $scope.cacheStorageItem.PosteriorDetails[i].CategoryDesc = "Posterior Segment";
                        $scope.tempPosteriorDetails[j].InvestigationDesc = $scope.cacheStorageItem.PosteriorDetails[i].InvestigationDesc;
                        $scope.cacheStorageItem.PosteriorDetails[i].ActiveInd = "Y";

                        $scope.tempPosteriorDetails[j].RightEye.RemarksArray = $scope.cacheStorageItem.PosteriorDetails[i].RightEye.RemarksArray;
                        $scope.tempPosteriorDetails[j].LeftEye.RemarksArray = $scope.cacheStorageItem.PosteriorDetails[i].LeftEye.RemarksArray;
                        $scope.tempPosteriorDetails[j].RightEye.ImagesArray = $scope.cacheStorageItem.PosteriorDetails[i].RightEye.ImagesArray;
                        $scope.tempPosteriorDetails[j].LeftEye.ImagesArray = $scope.cacheStorageItem.PosteriorDetails[i].LeftEye.ImagesArray;
                        $scope.tempPosteriorDetails[j].RightEye.CdRatio = $scope.cacheStorageItem.PosteriorDetails[i].RightEye.CdRatio;
                        $scope.tempPosteriorDetails[j].LeftEye.CdRatio = $scope.cacheStorageItem.PosteriorDetails[i].LeftEye.CdRatio;
                        $scope.tempPosteriorDetails[j].RightEye.Frequency = $scope.cacheStorageItem.PosteriorDetails[i].RightEye.Frequency;
                        $scope.tempPosteriorDetails[j].LeftEye.Frequency = $scope.cacheStorageItem.PosteriorDetails[i].LeftEye.Frequency;
                        $scope.tempPosteriorDetails[j].SubCategoryChildId = $scope.cacheStorageItem.PosteriorDetails[i].SubCategoryChildId;

                        $scope.tempPosteriorDetails[j].BothEye.RemarksArray = $scope.cacheStorageItem.PosteriorDetails[i].BothEye.RemarksArray;
                        $scope.tempPosteriorDetails[j].BothEye.ImagesArray = $scope.cacheStorageItem.PosteriorDetails[i].BothEye.ImagesArray;
                        $scope.tempPosteriorDetails[j].BothEye.CdRatio = $scope.cacheStorageItem.PosteriorDetails[i].BothEye.CdRatio;
                        $scope.tempPosteriorDetails[j].BothEye.Frequency = $scope.cacheStorageItem.PosteriorDetails[i].BothEye.Frequency;

                        $scope.tempPosteriorDetails[j].IsSelected = $scope.cacheStorageItem.PosteriorDetails[i].IsSelected;

                        if ($scope.cacheStorageItem.PosteriorDetails[i].RightEye.ImagesArray.length > 0) {
                            angular.forEach($scope.cacheStorageItem.PosteriorDetails[i].RightEye.ImagesArray, function (mitem) {
                                mitem.url = mitem.DocURL;
                            });
                        }
                        if ($scope.cacheStorageItem.PosteriorDetails[i].LeftEye.ImagesArray.length > 0) {
                            angular.forEach($scope.cacheStorageItem.PosteriorDetails[i].LeftEye.ImagesArray, function (kitem) {
                                kitem.url = kitem.DocURL;
                            });
                        }
                        if ($scope.cacheStorageItem.PosteriorDetails[i].BothEye.ImagesArray.length > 0) {
                            angular.forEach($scope.cacheStorageItem.PosteriorDetails[i].BothEye.ImagesArray, function (kitem) {
                                kitem.url = kitem.DocURL;
                            });
                        }

                    }
                }
            }

            $scope.cacheStorageItem.PosteriorDetails = $scope.tempPosteriorDetails;
            $scope.cacheStorageItem.PosteriorDetails = $filter("filter")($scope.cacheStorageItem.PosteriorDetails, function (item) {
                return item.SubCategoryChildId !== undefined;
            });
        }

    }


    getCachetoFindings();


    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    };
    $scope.ChangeCheckAll = function (CategoryId, status, type) {
        var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
        if (status) {
            if (type === "ant") {
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                        if (item.InvestigationId === subitem.InvestigationId) {
                            subitem.RightEyeRemarks = item.FindingValue;
                            subitem.RightEyeRemarksId = item.InvFindingId;

                            var obj = {
                                "RemarksId": 0,
                                "ActiveInd": 'Y',
                                "Remarks": item.FindingValue || "",
                                "InvFindingId": item.InvFindingId || 0
                            };
                            if (subitem.RightEye.RemarksArray.length > 0) {
                                var List = $filter("filter")(subitem.RightEye.RemarksArray, { "InvFindingId": obj.InvFindingId }, true);
                                if (List.length > 0) {
                                    alertify.error('Its already added');
                                    return;
                                }
                            }


                            subitem.SelectedRightEyeRemarksObj = item.FindingValue;
                            subitem.LeftEyeRemarksId = item.InvFindingId;
                            subitem.LeftEyeRemarks = item.FindingValue;
                            subitem.RightEyeArray = [];
                            subitem.LeftEyeArray = [];

                            var obj = {
                                "RemarksId": 0,
                                "ActiveInd": 'Y',
                                "Remarks": item.FindingValue || "",
                                "InvFindingId": item.InvFindingId || 0
                            };
                            if (subitem.LeftEye.RemarksArray.length > 0) {
                                var List = $filter("filter")(subitem.LeftEye.RemarksArray, { "InvFindingId": obj.InvFindingId }, true);
                                if (List.length > 0) {
                                    alertify.error('Its already added');
                                    return;
                                }
                            }

                            subitem.SelectedLeftEyeRemarksObj = item.FindingValue;
                        }
                    });
                });
                $scope.cacheStorageItem.IsAnteriorRightEyeCheckAll = true;
                $scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll = true;
                $scope.cacheStorageItem.AnteriorSegmentArray = [];
            }
            if (type === "post") {
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {
                        if (item.InvestigationId === subitem.InvestigationId) {
                            subitem.SelectedRightEyeRemarksObj = item.FindingValue;
                            subitem.RightEyeRemarks = item.FindingValue;
                            subitem.RightEyeRemarksId = item.InvFindingId;

                            var obj = {
                                "RemarksId": 0,
                                "ActiveInd": 'Y',
                                "Remarks": item.FindingValue || "",
                                "InvFindingId": item.InvFindingId || 0
                            };
                            if (subitem.RightEye.RemarksArray.length > 0) {
                                var List = $filter("filter")(subitem.RightEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                if (List.length > 0) {
                                    alertify.error('Its already added');
                                    return;
                                }
                            }

                            subitem.SelectedLeftEyeRemarksObj = item.FindingValue;
                            subitem.LeftEyeRemarksId = item.InvFindingId;
                            subitem.LeftEyeRemarks = item.FindingValue;
                            subitem.RightEyeArray = [];
                            subitem.LeftEyeArray = [];


                            var obj = {
                                "RemarksId": 0,
                                "ActiveInd": 'Y',
                                "Remarks": item.FindingValue || "",
                                "InvFindingId": item.InvFindingId || 0
                            };
                            if (subitem.LeftEye.RemarksArray.length > 0) {
                                var List = $filter("filter")(subitem.LeftEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                if (List.length > 0) {
                                    alertify.error('Its already added');
                                    return;
                                }
                            }

                        }
                    });
                });
                $scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll = true;
                $scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll = true;
                $scope.cacheStorageItem.PosteriorSegmentArray = [];
            }
            if (type === "RightEyeAnt") {
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                        // if (item.InvestigationId === subitem.InvestigationId && subitem.IsSubChildCategoryChecked) {
                        if (item.InvestigationId === subitem.InvestigationId) {
                            subitem.SelectedRightEyeRemarksObj = item.FindingValue;
                            subitem.RightEyeRemarks = item.FindingValue;
                            subitem.RightEyeRemarksId = item.InvFindingId;
                            subitem.RightEyeArray = [];

                            var obj = {
                                "RemarksId": 0,
                                "ActiveInd": 'Y',
                                "Remarks": item.FindingValue || "",
                                "InvFindingId": item.InvFindingId || 0
                            };
                            if (subitem.RightEye.RemarksArray.length > 0) {
                                var List = $filter("filter")(subitem.RightEye.RemarksArray, { "InvFindingId": obj.InvFindingId }, true);
                                if (List.length > 0) {
                                    alertify.error('Its already added');
                                    return;
                                }
                            }

                        }
                    });
                });
                $scope.cacheStorageItem.IsAnteriorRightEyeCheckAll = true;
            }
            if (type === "LeftEyeAnt") {
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                        if (item.InvestigationId === subitem.InvestigationId) {
                            subitem.SelectedLeftEyeRemarksObj = item.FindingValue;
                            subitem.LeftEyeRemarksId = item.InvFindingId;
                            subitem.LeftEyeRemarks = item.FindingValue;

                            var obj = {
                                "RemarksId": 0,
                                "ActiveInd": 'Y',
                                "Remarks": item.FindingValue || "",
                                "InvFindingId": item.InvFindingId || 0
                            };
                            if (subitem.LeftEye.RemarksArray.length > 0) {
                                var List = $filter("filter")(subitem.LeftEye.RemarksArray, { "InvFindingId": obj.InvFindingId }, true);
                                if (List.length > 0) {
                                    alertify.error('Its already added');
                                    return;
                                }
                            }

                            subitem.LeftEyeArray = [];
                        }
                    });
                });
                $scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll = true;
            }
            if (type === "RightEyePost") {
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {
                        if (item.InvestigationId === subitem.InvestigationId) {
                            subitem.SelectedRightEyeRemarksObj = item.FindingValue;
                            subitem.RightEyeRemarks = item.FindingValue;
                            subitem.RightEyeRemarksId = item.InvFindingId;
                            subitem.RightEyeArray = [];
                            var obj = {
                                "RemarksId": 0,
                                "ActiveInd": 'Y',
                                "Remarks": item.FindingValue || "",
                                "InvFindingId": item.InvFindingId || 0
                            };
                            if (subitem.RightEye.RemarksArray.length > 0) {
                                var List = $filter("filter")(subitem.RightEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                if (List.length > 0) {
                                    alertify.error('Its already added');
                                    return;
                                }
                            }

                        }
                    });
                });
                $scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll = true;
            }
            if (type === "LeftEyePost") {
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {
                        if (item.InvestigationId === subitem.InvestigationId) {
                            subitem.SelectedLeftEyeRemarksObj = item.FindingValue;
                            subitem.LeftEyeRemarksId = item.InvFindingId;
                            subitem.LeftEyeRemarks = item.FindingValue;
                            subitem.LeftEyeArray = [];
                            var obj = {
                                "RemarksId": 0,
                                "ActiveInd": 'Y',
                                "Remarks": item.FindingValue || "",
                                "InvFindingId": item.InvFindingId || 0
                            };
                            if (subitem.LeftEye.RemarksArray.length > 0) {
                                var List = $filter("filter")(subitem.LeftEye.RemarksArray, { "Id": obj.InvFindingId }, true);
                                if (List.length > 0) {
                                    alertify.error('Its already added');
                                    return;
                                }
                            }

                        }
                    });
                });
                $scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll = true;
            }
            if ($scope.cacheStorageItem.IsAnteriorRightEyeCheckAll && $scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll) {
                $scope.cacheStorageItem.IsAnteriorCheckedAll = true;
            }
            else {
                $scope.cacheStorageItem.IsAnteriorCheckedAll = false;
            }

            if ($scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll && $scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll) {
                $scope.cacheStorageItem.IsPosteriorCheckedAll = true;
            }
            else {
                $scope.cacheStorageItem.IsPosteriorCheckedAll = false;
            }


        } else {
            if (type === "ant") {
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                        if (item.InvestigationId === subitem.InvestigationId) {
                            subitem.LeftEyeRemarks = "";
                            subitem.RightEyeRemarks = "";
                            subitem.LeftEyeRemarksId = "";
                            subitem.RightEyeRemarksId = "";
                            subitem.SelectedRightEyeRemarksObj = "";
                            subitem.SelectedLeftEyeRemarksObj = "";

                            angular.forEach(subitem.RightEye.RemarksArray, function (hitem, index) {
                                if (hitem.InvFindingId === item.InvFindingId) {
                                    subitem.RightEye.RemarksArray.splice(index, 1);
                                }
                            });
                            angular.forEach(subitem.LeftEye.RemarksArray, function (hitem, index) {
                                if (hitem.InvFindingId === item.InvFindingId) {
                                    subitem.LeftEye.RemarksArray.splice(index, 1);
                                }
                            });
                        }
                    });
                });
                $scope.cacheStorageItem.IsAnteriorCheckedAll = false;
                $scope.cacheStorageItem.IsAnteriorRightEyeCheckAll = false;
                $scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll = false;
                $scope.cacheStorageItem.AnteriorSegmentArray = [];
            }
            if (type === "post") {
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {
                        if (item.InvestigationId === subitem.InvestigationId) {
                            subitem.LeftEyeRemarks = "";
                            subitem.RightEyeRemarks = "";
                            subitem.LeftEyeRemarksId = "";
                            subitem.RightEyeRemarksId = "";
                            subitem.SelectedRightEyeRemarksObj = "";
                            subitem.SelectedLeftEyeRemarksObj = "";

                            angular.forEach(subitem.RightEye.RemarksArray, function (hitem, index) {
                                if (hitem.Id === item.InvFindingId) {
                                    subitem.RightEye.RemarksArray.splice(index, 1);
                                }
                            });
                            angular.forEach(subitem.LeftEye.RemarksArray, function (hitem, index) {
                                if (hitem.Id === item.InvFindingId) {
                                    subitem.LeftEye.RemarksArray.splice(index, 1);
                                }
                            });
                        }
                    });
                });
                $scope.cacheStorageItem.IsPosteriorCheckedAll = false;
                $scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll = false;
                $scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll = false;
                $scope.cacheStorageItem.PosteriorSegmentArray = [];
            }
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
                $scope.cacheStorageItem.IsAnteriorRightEyeCheckAll = false;
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
                $scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll = false;
            }
            if (type === "RightEyePost") {
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {
                        if (item.InvestigationId === subitem.InvestigationId) {
                            subitem.RightEyeRemarks = "";
                            subitem.RightEyeRemarksId = "";
                            subitem.SelectedRightEyeRemarksObj = "";
                            angular.forEach(subitem.RightEye.RemarksArray, function (hitem, index) {
                                if (hitem.Id === item.InvFindingId) {
                                    subitem.RightEye.RemarksArray.splice(index, 1);
                                }
                            });
                        }
                    });
                });
                $scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll = false;
            }
            if (type === "LeftEyePost") {
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {
                        if (item.InvestigationId === subitem.InvestigationId) {
                            subitem.LeftEyeRemarks = "";
                            subitem.LeftEyeRemarksId = "";
                            subitem.SelectedLeftEyeRemarksObj = "";
                            angular.forEach(subitem.LeftEye.RemarksArray, function (hitem, index) {
                                if (hitem.Id === item.InvFindingId) {
                                    subitem.LeftEye.RemarksArray.splice(index, 1);
                                }
                            });
                        }
                    });
                });
                $scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll = false;
            }
            if ($scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll == false && $scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll) {
                $scope.cacheStorageItem.IsPosteriorCheckedAll = false;
            }
            if ($scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll == false && $scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll) {
                $scope.cacheStorageItem.IsPosteriorCheckedAll = false;
            }

            if ($scope.cacheStorageItem.IsAnteriorRightEyeCheckAll == false && $scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll) {
                $scope.cacheStorageItem.IsAnteriorCheckedAll = false;
            }
            if ($scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll == false && $scope.cacheStorageItem.IsAnteriorRightEyeCheckAll) {
                $scope.cacheStorageItem.IsAnteriorCheckedAll = false;
            }
        }
        $scope.AddToCache();
    };

    $scope.ChangeEYe = function (type) {
        $scope.Investigation.SelectedEye = type.toString();
    }

    $scope.FileChange = function (files, type, item) {
        var file = "";
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


    $scope.getFindingValues = function (val, invId) {
        var phospid = "";
        phospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

        $scope.SearchText = val || "";
        return eHnoteDbStaticDataService.GetAllInvestigationFindingValuesForNewTemplate(phospid, invId, 10, 1, $scope.SearchText).then(function (resp) {
            if (resp.data.Count !== 0) {
                if (resp.data.Rows !== undefined) {
                    return resp.data.Rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };
    $scope.BlurInvestigationSelect = function (inv, type) {
        if (type === "Right") {
            inv.SelectedRightEyeRemarksObj = inv.SelectedRightEyeRemarksObj || null;
            if (inv.SelectedRightEyeRemarksObj === null) {
                inv.RightEyeRemarks = "";
                inv.RightEyeRemarksId = 0;
            }
            if (!angular.isObject(inv.SelectedRightEyeRemarksObj)) {
                inv.RightEyeRemarks = inv.SelectedRightEyeRemarksObj || "";
                var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": inv.CategoryId }, true);
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                        if (subitem.InvestigationId === inv.InvestigationId) {
                            subitem.RightEyeRemarks = inv.SelectedRightEyeRemarksObj || "";
                        }
                        $scope.cacheStorageItem.IsAnteriorCheckedAll = false;
                        $scope.cacheStorageItem.IsAnteriorRightEyeCheckAll = false;

                        $scope.cacheStorageItem.IsPosteriorCheckedAll = false;
                        $scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll = false;
                    });


                    angular.forEach($scope.cacheStorageItem.GonioscopyDetails, function (subitem, subindex) {
                        if (subitem.InvestigationId === inv.InvestigationId) {
                            subitem.RightEye.Remarks = inv.SelectedRightEyeRemarksObj || "";
                        }
                    });
                });
                if (inv.CategoryId === 256) {
                    angular.forEach($scope.cacheStorageItem.GonioscopyDetails, function (subitem, subindex) {
                        if (subitem.InvestigationId === inv.InvestigationId) {
                            subitem.RightEye.Remarks = inv.SelectedRightEyeRemarksObj || "";
                        }
                    });
                }
            }
        }
        if (type === "Left") {
            inv.SelectedLeftEyeRemarksObj = inv.SelectedLeftEyeRemarksObj || null;
            if (inv.SelectedLeftEyeRemarksObj === null) {
                inv.LeftEyeRemarks = "";
                inv.LeftEyeRemarksId = 0;
            }
            if (!angular.isObject(inv.SelectedLeftEyeRemarksObj)) {
                inv.LeftEyeRemarks = inv.SelectedLeftEyeRemarksObj || "";
                var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": inv.CategoryId }, true);
                angular.forEach(temparray, function (item, index) {
                    angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                        if (subitem.InvestigationId === inv.InvestigationId) {
                            subitem.LeftEyeRemarks = inv.SelectedLeftEyeRemarksObj || "";
                        }
                        $scope.cacheStorageItem.IsAnteriorCheckedAll = false;
                        $scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll = false;

                        $scope.cacheStorageItem.IsPosteriorCheckedAll = false;
                        $scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll = false;
                    });

                    angular.forEach($scope.cacheStorageItem.GonioscopyDetails, function (subitem, subindex) {
                        if (subitem.InvestigationId === inv.InvestigationId) {
                            subitem.LeftEye.Remarks = inv.SelectedLeftEyeRemarksObj || "";
                        }
                    });
                });
                if (inv.CategoryId === 256) {
                    angular.forEach($scope.cacheStorageItem.GonioscopyDetails, function (subitem, subindex) {
                        if (subitem.InvestigationId === inv.InvestigationId) {
                            subitem.LeftEye.Remarks = inv.SelectedLeftEyeRemarksObj || "";
                        }
                    });
                }
            }
        }
    };


    $scope.onInvestigationSelect = function (inv, type) {
        if (type === "Right") {
            inv.RightEyeRemarks = inv.SelectedRightEyeRemarksObj.FindingValue;
            inv.RightEyeRemarksId = inv.SelectedRightEyeRemarksObj.InvFindingId;

            var obj = {
                "RemarksId": 0,
                "ActiveInd": 'Y',
                "Remarks": inv.SelectedRightEyeRemarksObj.FindingValue || "",
                "InvFindingId": inv.SelectedRightEyeRemarksObj.InvFindingId || 0
            };
            inv.RightEye.RemarksArray = inv.RightEye.RemarksArray || [];
            inv.SelectedRightEyeRemarksObj = inv.LeftEyeRemarks;
            if (inv.RightEye.RemarksArray.length !== 0) {
                var List = $filter("filter")(inv.RightEye.RemarksArray, { "Remarks": obj.Remarks }, true);
                if (List.length > 0) {
                    inv.SelectedRightEyeRemarksObj = "";
                    alertify.error('Its already added');
                    return;
                }
            }
            inv.RightEye.RemarksArray.push(obj);
            inv.SelectedRightEyeRemarksObj = "";
        }
        if (type === "Left") {
            inv.LeftEyeRemarks = inv.SelectedLeftEyeRemarksObj.FindingValue;
            inv.LeftEyeRemarksId = inv.SelectedLeftEyeRemarksObj.InvFindingId;


            obj = {
                "RemarksId": 0,
                "ActiveInd": 'Y',
                "Remarks": inv.SelectedLeftEyeRemarksObj.FindingValue || "",
                "InvFindingId": inv.SelectedLeftEyeRemarksObj.InvFindingId || 0
            };
            inv.LeftEye.RemarksArray = inv.LeftEye.RemarksArray || [];
            inv.SelectedLeftEyeRemarksObj = inv.LeftEyeRemarks;
            if (inv.LeftEye.RemarksArray.length > 0) {
                var List = $filter("filter")(inv.LeftEye.RemarksArray, { "Remarks": obj.Remarks }, true);
                if (List.length > 0) {
                    inv.SelectedLeftEyeRemarksObj = "";
                    alertify.error('Its already added');
                    return;
                }
            }
            inv.LeftEye.RemarksArray.push(obj);
            inv.SelectedLeftEyeRemarksObj = "";
        }
        if (type === "Both") {
            inv.BothEyeRemarks = inv.SelectedBothEyeRemarksObj.FindingValue;
            inv.BothEyeRemarksId = inv.SelectedBothEyeRemarksObj.InvFindingId;


            obj = {
                "RemarksId": 0,
                "ActiveInd": 'Y',
                "Remarks": inv.SelectedBothEyeRemarksObj.FindingValue || "",
                "InvFindingId": inv.SelectedBothEyeRemarksObj.InvFindingId || 0
            };
            inv.BothEye.RemarksArray = inv.BothEye.RemarksArray || [];
            inv.SelectedBothEyeRemarksObj = inv.LeftEyeRemarks;
            if (inv.BothEye.RemarksArray.length > 0) {
                var List = $filter("filter")(inv.BothEye.RemarksArray, { "Remarks": obj.Remarks }, true);
                if (List.length > 0) {
                    inv.SelectedBothEyeRemarksObj = "";
                    alertify.error('Its already added');
                    return;
                }
            }
            inv.BothEye.RemarksArray.push(obj);
            inv.SelectedBothEyeRemarksObj = "";
        }
        $scope.AddToCache();
    };

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
                //  inv.LeftEye.RemarksArray.splice(index, 1);
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
      $scope.removeBothAnterior = function (item, inv) {
          angular.forEach(inv.BothEye.RemarksArray, function (hitem, index) {
            if (hitem.InvFindingId === item.InvFindingId && hitem.Remarks === item.Remarks) {
                if (hitem.RemarksId === 0) {
                    inv.BothEye.RemarksArray.splice(index, 1);
                }
                else {
                    hitem.ActiveInd = 'N';
                }
                inv.LeftEyeRemarks = "";
            }
        });
    };

    $scope.removeRightPosterior = function (item, inv) {

        angular.forEach(inv.RightEye.RemarksArray, function (hitem, index) {
            if (hitem.InvFindingId === item.InvFindingId && hitem.Remarks === item.Remarks) {
                //inv.RightEye.RemarksArray.splice(index, 1);
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
                // inv.LeftEye.RemarksArray.splice(index, 1);
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

    $scope.removeBothPosterior = function (item, inv) {

        angular.forEach(inv.BothEye.RemarksArray, function (hitem, index) {
            if (hitem.InvFindingId === item.InvFindingId && hitem.Remarks === item.Remarks) {
                if (hitem.RemarksId === 0) {
                    inv.BothEye.RemarksArray.splice(index, 1);
                }
                else {
                    hitem.ActiveInd = 'N';
                }
                inv.LeftEyeRemarks = "";
            }
        });
    };

    $scope.addMoreInvValues = function (item, organ) {

        if (organ === 'Right') {

            var obj = {
                "ActiveInd": 'Y',
                "Remarks": item.SelectedRightEyeRemarksObj || "",
                "Id": 0
            };
            if (item.RightEye.RemarksArray.length > 0) {
                var List = $filter("filter")(item.RightEye.RemarksArray, { "Remarks": item.SelectedRightEyeRemarksObj }, true);
                if (List.length > 0) {
                    alertify.error('Its already added');
                    return;
                } else {
                    item.RightEye.RemarksArray.push(obj);
                    item.SelectedRightEyeRemarksObj = "";
                }
            } else {
                item.RightEye.RemarksArray.push(obj);
                item.SelectedRightEyeRemarksObj = "";
            }
        } else {
            var obj = {
                "ActiveInd": 'Y',
                "Remarks": item.SelectedLeftEyeRemarksObj || "",
                "Id": 0
            };
            if (item.LeftEye.RemarksArray.length > 0) {
                var List = $filter("filter")(item.LeftEye.RemarksArray, { "Remarks": item.SelectedLeftEyeRemarksObj }, true);
                if (List.length > 0) {
                    alertify.error('Its already added');
                    return;
                } else {
                    item.LeftEye.RemarksArray.push(obj);
                    item.SelectedLeftEyeRemarksObj = "";
                }
            } else {
                item.LeftEye.RemarksArray.push(obj);
                item.SelectedLeftEyeRemarksObj = "";
            }
        }

    }

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

    $scope.GetTemplate = function (type, item) {
        if (type === "Right") {
            if (item.RightTemplateUrl === "") {
                alertify.log("No Images Found");
            } else {
                item.RightOrganDocUrl = item.RightTemplateUrl;
                item.RightEyefileName = item.RightTemplateUrl.substring(item.LeftTemplateUrl.lastIndexOf("/") + 1);
                $("#maineHnoteLoader").show();
                $scope.toDataURL(item.RightTemplateUrl, function (dataURL) {
                    item.RightEyediv = true;
                    item.thumbnailRightEye = dataURL;
                    $("#maineHnoteLoader").hide();
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
                    $("#maineHnoteLoader").hide();
                });
            }
        }
    };

    //$scope.savecanvas = function (type, item, isTemplate, whichCat) {
    //    var RightId = item.RightPwCanvas;
    //    var LeftId = item.LeftPwCanvas;

    //    if (type === "Right") {
    //        item.RightEyediv = false;
    //        var canvas = null;
    //        canvas = document.getElementById(RightId);
    //        var dataURL = canvas.toDataURL();
    //        //var dataURL = item.thumbnailRightEye;
    //        object = {
    //            "USRId": $scope.UserId,
    //            "HospitalID": $scope.doctorinfo.hospitalID,
    //            "PatientID": $scope.cache.patientid,
    //            "PatientName": $scope.PatientData.Patient[0].FullName,
    //            "AppointmentID": $scope.cache.appointmentid,
    //            "CategoryID": item.CategoryId,
    //            "InvestigationID": item.InvestigationId,
    //            "OrganID": 1,
    //            "Base64": dataURL,
    //            "FileName": item.RightEyefileName,
    //            "DocumentID": 0,
    //            "ContentType": item.ContentType
    //        };

    //        eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
    //            var result = resp.data[0];
    //            result.DocumentId = 0;
    //            item.RightEye.ImagesArray.push(result);
    //            alertify.success("Image Uploaded Successfully");
    //            item.thumbnailRightEye = "";
    //            item.RightEyeUndoCount = 0;
    //            $scope.RightEyefileName = "";

    //            if ($scope.Tab == 'Anterior') {
    //                $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
    //            } else {
    //                $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
    //            }

    //        }, function (err) {
    //            alertify.error(err.Messege);
    //        });
    //    }
    //    if (type === "Left") {
    //        item.LeftEyediv = false;
    //        var canvas = null;
    //        canvas = document.getElementById(LeftId);
    //        var dataURL = canvas.toDataURL();
    //        object = {
    //            "USRId": $scope.UserId,
    //            "HospitalID": $scope.doctorinfo.hospitalID,
    //            "PatientID": $scope.cache.patientid,
    //            "PatientName": $scope.PatientData.Patient[0].FullName,
    //            "AppointmentID": $scope.cache.appointmentid,
    //            "CategoryID": item.CategoryId,
    //            "InvestigationID": item.InvestigationId,
    //            "OrganID": 2,
    //            "Base64": dataURL,
    //            "FileName": item.LeftEyefileName,
    //            "DocumentID": 0,
    //            "ContentType": item.ContentType
    //        };
    //        eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
    //            var result = resp.data[0];
    //            result.DocumentId = 0;
    //            item.LeftEye.ImagesArray.push(result);
    //            alertify.success("Image Uploaded Successfully");
    //            item.thumbnailLeftEye = "";
    //            item.LeftEyeUndoCount = 0;
    //            $scope.LeftEyefileName = "";

    //            if ($scope.Tab == 'Anterior') {
    //                $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
    //            } else {
    //                $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
    //            }

    //        }, function (err) {
    //            alertify.error(err.Messege);
    //        });
    //    }

    //    //if ($scope.Tab == 'Anterior') {
    //    //    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
    //    //} else {
    //    //    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
    //    //}
    //};



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

            object = {
                "UserID": $scope.UserId,
                "HospitalID": $scope.doctorinfo.hospitalID,
                "PatientID": $scope.cache.patientid,
                "PatientName": $scope.PatientData.Patient[0].FullName,
                "AppointmentID": $scope.cache.appointmentid,
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
                item.RightEye.ImagesArray.push(result);
                alertify.success("Image Uploaded Successfully");
                item.thumbnailRightEye = "";
                item.RightEyeUndoCount = 0;
                $scope.RightEyefileName = "";

                if ($scope.Tab == 'Anterior') {
                    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
                } else {
                    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
                }

            }, function (err) {
                alertify.error(err.Messege);
            });
        }
        if (type === "Left") {
            item.LeftEyediv = false;
            var canvas = null;
            canvas = document.getElementById(LeftId);
            var dataURL = canvas.toDataURL();
           

            object = {
                "UserID": $scope.UserId,
                "HospitalID": $scope.doctorinfo.hospitalID,
                "PatientID": $scope.cache.patientid,
                "PatientName": $scope.PatientData.Patient[0].FullName,
                "AppointmentID": $scope.cache.appointmentid,
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
                item.LeftEye.ImagesArray.push(result);
                alertify.success("Image Uploaded Successfully");
                item.thumbnailLeftEye = "";
                item.LeftEyeUndoCount = 0;
                $scope.LeftEyefileName = "";

                if ($scope.Tab == 'Anterior') {
                    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
                } else {
                    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
                }

            }, function (err) {
                alertify.error(err.Messege);
            });
        }

       
    };

    //$scope.updatecanvas = function (type, item, isTemplate, whichCat) {
    //    var RightId = item.RightPwCanvas;
    //    var LeftId = item.LeftPwCanvas;

    //    if (type === "Right") {
    //        item.RightEyeEdit = false;
    //        item.RightEyediv = false;
    //        var canvas = document.getElementById(RightId);
    //        var dataURL = canvas.toDataURL();
    //        var S3URL = item.RightOrganDocUrl || "";
    //        object = {
    //            "USRId": $scope.UserId,
    //            "HospitalID": $scope.doctorinfo.hospitalID,
    //            "PatientID": $scope.cache.patientid,
    //            "PatientName": $scope.PatientData.Patient[0].FullName,
    //            "AppointmentID": $scope.cache.appointmentid,
    //            "CategoryID": item.CategoryId,
    //            "InvestigationID": item.InvestigationId,
    //            "OrganID": 1,
    //            "Base64": dataURL,
    //            "FileName": item.RightOrganDocUrl.substring(item.RightOrganDocUrl.lastIndexOf("/") + 1),
    //            "DocumentID": item.RightOrganDocId,
    //            "ContentType": item.ContentType,
    //            "S3URL": S3URL
    //        };
    //        eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
    //            var ind = -1;
    //            item.RightEye.ImagesArray.some(function (obj, i) {
    //                return obj.DocumentId === item.RightOrganDocId ? ind = i : false;
    //            });
    //            var result = resp.data[0];
    //            item.RightEye.ImagesArray[ind] = result;
    //            item.RightOrganDocId = 0;
    //            item.thumbnailRightEye = "";
    //            item.RightEyeUndoCount = 0;
    //            $scope.RightEyefileName = "";
    //            alertify.success("Image Updated Successfully");

    //            if ($scope.Tab == 'Anterior') {
    //                $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
    //            } else {
    //                $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
    //            }

    //        }, function (err) {
    //            alertify.error(err.Messege);
    //        });
    //    }
    //    if (type === "Left") {
    //        item.LeftEyeEdit = false;
    //        item.LeftEyediv = false;
    //        var canvas = document.getElementById(LeftId);
    //        var dataURL = canvas.toDataURL();
    //        var S3URL = item.LeftOrganDocUrl || "";
    //        object = {
    //            "USRId": $scope.UserId,
    //            "HospitalID": $scope.doctorinfo.hospitalID,
    //            "PatientID": $scope.cache.patientid,
    //            "PatientName": $scope.PatientData.Patient[0].FullName,
    //            "AppointmentID": $scope.cache.appointmentid,
    //            "CategoryID": item.CategoryId,
    //            "InvestigationID": item.InvestigationId,
    //            "OrganID": 2,
    //            "Base64": dataURL,
    //            "FileName": item.LeftOrganDocUrl.substring(item.LeftOrganDocUrl.lastIndexOf("/") + 1),
    //            "DocumentID": item.LeftOrganDocId,
    //            "ContentType": item.ContentType,
    //            "S3URL": S3URL
    //        };
    //        eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
    //            var ind = -1;
    //            item.LeftEye.ImagesArray.some(function (obj, i) {
    //                return obj.DocumentId === item.LeftOrganDocId ? ind = i : false;
    //            });
    //            var result = resp.data[0];
    //            item.LeftEye.ImagesArray[ind] = result;
    //            item.LeftOrganDocId = 0;
    //            item.thumbnailLeftEye = "";
    //            item.LeftEyeUndoCount = 0;
    //            $scope.LeftEyefileName = "";
    //            alertify.success("Image Updated Successfully");

    //            if ($scope.Tab == 'Anterior') {
    //                $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
    //            } else {
    //                $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
    //            }

    //        }, function (err) {
    //            alertify.error(err.Messege);
    //        });
    //    }

    //    //if ($scope.Tab == 'Anterior') {
    //    //    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
    //    //} else {
    //    //    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
    //    //}
    //};



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
            object = {
                "UserID": $scope.UserId,
                "HospitalID": $scope.doctorinfo.hospitalID,
                "PatientID": $scope.cache.patientid,
                "PatientName": $scope.PatientData.Patient[0].FullName,
                "AppointmentID": $scope.cache.appointmentid,
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
                var ind = -1;
                item.RightEye.ImagesArray.some(function (obj, i) {
                    return obj.DocumentId === item.RightOrganDocId ? ind = i : false;
                });
                var result = resp.data;
                item.RightEye.ImagesArray[ind] = result;
                item.RightOrganDocId = 0;
                item.thumbnailRightEye = "";
                item.RightEyeUndoCount = 0;
                $scope.RightEyefileName = "";
                alertify.success("Image Updated Successfully");

                if ($scope.Tab == 'Anterior') {
                    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
                } else {
                    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
                }

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
            object = {
                "UserID": $scope.UserId,
                "HospitalID": $scope.doctorinfo.hospitalID,
                "PatientID": $scope.cache.patientid,
                "PatientName": $scope.PatientData.Patient[0].FullName,
                "AppointmentID": $scope.cache.appointmentid,
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
                var ind = -1;
                item.LeftEye.ImagesArray.some(function (obj, i) {
                    return obj.DocumentId === item.LeftOrganDocId ? ind = i : false;
                });
                var result = resp.data[0];
                item.LeftEye.ImagesArray[ind] = result;
                item.LeftOrganDocId = 0;
                item.thumbnailLeftEye = "";
                item.LeftEyeUndoCount = 0;
                $scope.LeftEyefileName = "";
                alertify.success("Image Updated Successfully");

                if ($scope.Tab == 'Anterior') {
                    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.AnteriorDetails);
                } else {
                    $scope.ReSaveInevstiagtion(item, $scope.cacheStorageItem.PosteriorDetails);
                }

            }, function (err) {
                alertify.error(err.Messege);
            });
        }

     
    };

    $scope.EditImage = function (parentItem, childItem, type) {
        if (type === "Right") {
            $scope.RightEyefileName = childItem.DocURL.substring(childItem.DocURL.lastIndexOf("/") + 1);
            parentItem.RightOrganDocId = childItem.DocumentId;
            parentItem.RightOrganDocUrl = childItem.DocURL;
            $("#maineHnoteLoader").show();
            $scope.toDataURL(childItem.DocURL, function (dataURL) {
                parentItem.RightEyediv = true;
                parentItem.RightEyeEdit = true;
                parentItem.thumbnailRightEye = dataURL;
                $timeout(function () {
                    $("#maineHnoteLoader").hide();
                }, 200);
            });
            parentItem.RightEyeUndoCount = 0;

            $scope.fixImage(parentItem.RightPwCanvas);
        }
        if (type === "Left") {
            $scope.LeftEyefileName = childItem.DocURL.substring(childItem.DocURL.lastIndexOf("/") + 1);
            parentItem.LeftOrganDocId = childItem.DocumentId;
            parentItem.LeftOrganDocUrl = childItem.DocURL;
            $("#maineHnoteLoader").show();
            $scope.toDataURL(childItem.DocURL, function (dataURL) {
                parentItem.LeftEyediv = true;
                parentItem.LeftEyeEdit = true;
                parentItem.thumbnailLeftEye = dataURL;
                $timeout(function () {
                    $("#maineHnoteLoader").hide();
                }, 200);
            });
            parentItem.LeftEyeUndoCount = 0;

            $scope.fixImage(parentItem.LeftPwCanvas);
        }
    };
    $scope.removeImage = function (subitem, type, DeleteIndicator, ParentItem) {
        object = {
            "AppointmentID": $scope.cache.appointmentid,
            "DeleteIndicator": DeleteIndicator,
            "HospitalID": $scope.doctorinfo.hospitalID,
            "ImagesArray": []
        };
        if (DeleteIndicator === 0) {//Single Image Deletion
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                object.ImagesArray.push({ "DocumentID": subitem.DocumentId, "FileName": subitem.DocURL.substring(subitem.DocURL.lastIndexOf("/") + 1) });
                removeImage(subitem.DocumentId, type, object, ParentItem);
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

    $scope.syncImages = function (type, item) {
        if (type === "Right") {
            object = {
                "AppointmentId": $scope.cache.appointmentid,
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
            object = {
                "AppointmentId": $scope.cache.appointmentid,
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

    //$scope.ViewanteriorsegmentPopup = function (type) {
    //    $scope.mInstanceAdd = $uibModal.open({
    //        "templateUrl": "templates/uibpopups/anteriorsegmentPopup.html",
    //        "backdrop": "static",
    //        "scope": $scope,
    //        "keyboard": false,
    //        "size": "lg",
    //        "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
    //            $scope.type = type;
    //            $scope.closeanteriorsegmentPopup = function () {
    //                $uibModalInstance.dismiss("cancel");
    //            };

    //            $scope.GetPreviousInvestigationData = function () {
    //                var obj = {
    //                    "CategoryId": type,
    //                    "PatientId": $scope.cacheStorageItem.patientid,
    //                    "AppointmentId": $scope.cacheStorageItem.appointmentid
    //                };
    //                eHnotePatientDataService.GetPatientFindingsHistoryByCategory(obj).then(function (resp) {
    //                    $scope.PreviousAnteriorInvestigations = [];
    //                    $scope.PreviousPosteriorInvestigations = [];
    //                    if (type === 5) {
    //                        $scope.PreviousAnteriorInvestigations = resp.data.rows;
    //                    }
    //                    if (type === 6) {
    //                        $scope.PreviousPosteriorInvestigations = resp.data.rows;
    //                    }
    //                });
    //            };
    //            $scope.GetPreviousInvestigationData();
    //        }
    //    });
    //}
    $scope.AddToOptomCache = function (type) {
        if (type) {
            $scope.cacheStorageItem.DoctorComments = $scope.cacheStorageItem.OptomComments;
        } else {
            $scope.cacheStorageItem.DoctorComments = "";
        }
    };

    $scope.DeleteOptomComments = function () {
        $scope.cacheStorageItem.OptomComments = "";
        $scope.AddToCache();
    };
    $scope.DeleteClinicalNotesComments = function () {
        $scope.cacheStorageItem.ClinicalNotesComments = "";
        $scope.AddToCache();
    };

    $scope.DeletePatientInstructionsComments = function () {
        $scope.cacheStorageItem.PatientInstructionComments = "";
        $scope.AddToCache();
    };

    $scope.DeleteDoctorComments = function () {
        $scope.cacheStorageItem.DoctorComments = "";
        $scope.cacheStorageItem.chkOptoComments = false;
        $scope.AddToCache();
    };
    $scope.PrintObj = {};
    var printsettingObj = eHnoteMasterDataService.getPrintSettingInfo() || null;
    $scope.PrintObj.PrintLanguageId = printsettingObj.Language;
    function checkPrintType(type, pArray, individualPrintName, displayName, printtype) {
        printtype = printtype || false;
        var isArray = angular.isArray(pArray);
        if (type === 'printByModule') {
            if (pArray && ((isArray && pArray.length > 0) || !isArray)) {
                if (individualPrintName === 'vision') {
                    if (pArray[0].length === 0) {
                        return pArray = pArray || [];
                    }
                }
            }
            if (type === "followupObj" && individualPrintName === "FollowupDetails") {
                var isArray = angular.isObject(pArray);
                if (isArray) {
                    var obj = {
                        "type": individualPrintName,
                        "flag": false,
                        "isActive": printtype,
                        "printArray": pArray,
                        "Name": displayName
                    };
                    $scope.printBymoduleArray.push(obj);
                    return pArray = pArray || [];
                }
            }
            if (pArray && ((isArray && pArray.length > 0) || !isArray)) {
                var obj = {
                    "type": individualPrintName,
                    "flag": true,
                    "isActive": printtype,
                    "printArray": pArray,
                    "Name": displayName
                };

                if (individualPrintName === "vitals") {
                    obj.flag = $scope.cacheStorageItem.HideVitals;
                    //  obj.isActive = $scope.cacheStorageItem.HideVitals;
                    obj.isActive = printtype;
                }
                if (individualPrintName === "FollowupDetails") {
                    obj.flag = false;
                }
                if (individualPrintName === "PlanOfCare") {
                    obj.flag = false;
                }
                if (individualPrintName === "clinicalNotes") {
                    obj.flag = false;
                }
                if (individualPrintName === "PatientInstructions") {
                    obj.flag = false;
                }

                $scope.printBymoduleArray.push(obj);

                return type === "all" || type === "printByModule" ? pArray : (type === individualPrintName ? pArray : []);
            } else {
                return [];
            }
        }

        else {
            if (pArray && ((isArray && pArray.length > 0) || !isArray) && printtype) {
                if (individualPrintName === 'vision') {
                    if (pArray[0].length === 0) {
                        return pArray = pArray || [];
                    }
                }
            }
            if (type === "followupObj" && individualPrintName === "FollowupDetails") {
                var isArray = angular.isObject(pArray);
                if (isArray) {
                    var obj = {
                        "type": individualPrintName,
                        "flag": false,
                        "isActive": printtype,
                        "printArray": pArray,
                        "Name": displayName
                    };
                    $scope.printBymoduleArray.push(obj);
                    return pArray = pArray || [];
                }
            }
            if (pArray && ((isArray && pArray.length > 0) || !isArray) && printtype) {
                var obj = {
                    "type": individualPrintName,
                    "flag": true,
                    "isActive": printtype,
                    "printArray": pArray,
                    "Name": displayName
                };

                if (individualPrintName === "vitals") {
                    obj.flag = $scope.cacheStorageItem.HideVitals;
                    //  obj.isActive = $scope.cacheStorageItem.HideVitals;
                    obj.isActive = printtype;
                }
                if (individualPrintName === "FollowupDetails") {
                    obj.flag = false;
                }
                if (individualPrintName === "PlanOfCare") {
                    obj.flag = false;
                }
                if (individualPrintName === "clinicalNotes") {
                    obj.flag = false;
                }
                if (individualPrintName === "PatientInstructions") {
                    obj.flag = false;
                }

                $scope.printBymoduleArray.push(obj);

                return type === "all" || type === "printByModule" ? pArray : (type === individualPrintName ? pArray : []);
            } else {
                return [];
            }
        }
    }
    $scope.PrintNewConsultation = function (type, subvalue, PrintType) {

        //if (type === 'printByModule') {
        //    var modelIntance = $uibModal.open({
        //        "size": 'md',
        //        "templateUrl": 'PrintNewpopup.html',
        //        "scope": $scope,
        //        "backdrop": "static",
        //        "keyboard": false
        //    });
        //}


        $scope.cancel = function () {
            modelIntance.dismiss('cancel');
        };
        angular.forEach($scope.cacheStorageItem.PatientInvestigations, function (item) {
            item.OrganId = item.OrganId.toString();
        });
        $scope.AddToCache();
        var printObj = {}, provisonalDiagnosis = [], finalDiagnosis = [];

        $scope.printBymoduleArray = [];
        if (type === 'printByModule') {
            $scope.printAll = "1";
        }
        if (type === 'PrintSubModule') {
            $scope.printAll = "3";
        }
        if (type !== 'PrintSubModule' && 'printByModule') {
            $scope.printAll = "1";
        }


        $scope.SubModuleType = subvalue || '';

        if ($scope.cacheStorageItem.Diagnosis.length > 0) {
            angular.forEach($scope.cacheStorageItem.Diagnosis, function (item) {

                if (parseInt(item.DiagnosisData.DiagnosisTypeId) === 1) {

                    provisonalDiagnosis.push(item);
                } else if (parseInt(item.DiagnosisData.DiagnosisTypeId) === 3) {
                    finalDiagnosis.push(item);
                }
            });
        }

        $scope.printPrecriptionArray = [];
        if ($scope.cacheStorageItem.Prescriptions.length > 0) {
            angular.forEach($scope.cacheStorageItem.Prescriptions, function (item) {
                if (item.PrescriptionType === "GenericMedicine") {
                    if (item.PrescriptionData.ActiveInd === 'Y') {
                        if (item.PrescriptionData.TypeOfDosage === "Default") {
                            var dosage = item.PrescriptionData.Dosage;
                            var frequency = item.PrescriptionData.FrequencyObj.Name;
                            var fre1 = frequency.split('-')[0];
                            var fre2 = frequency.split('-')[1];
                            var fre3 = frequency.split('-')[2];
                            var preDos1 = '0';
                            if (fre1 === '1') {
                                preDos1 = dosage;
                            }
                            var preDos2 = '0';
                            if (fre2 === '1') {
                                preDos2 = dosage;
                            }
                            var preDos3 = '0';
                            if (fre3 === '1') {
                                preDos3 = dosage;
                            }
                            if (preDos1 === "0" && preDos2 === "0" && preDos3 === "0") {
                                item.PrescriptionData.Dosage1 = "";
                                item.PrescriptionData.Dosage2 = "";
                                item.PrescriptionData.Dosage3 = "";
                            } else {
                                item.PrescriptionData.Dosage1 = preDos1;
                                item.PrescriptionData.Dosage2 = preDos2;
                                item.PrescriptionData.Dosage3 = preDos3;
                            }
                        } else {
                            item.PrescriptionData.Frequency = item.PrescriptionData.Frequency || "";
                            var frequency = item.PrescriptionData.Frequency;
                            var fre1 = frequency.split('-')[0];
                            var fre2 = frequency.split('-')[1];
                            var fre3 = frequency.split('-')[2];
                            var dosage = item.PrescriptionData.Dosage;
                            var preDos1 = '0';
                            if (fre1 === '1') {
                                preDos1 = dosage;
                            }
                            var preDos2 = '0';
                            if (fre2 === '1') {
                                preDos2 = dosage;
                            }
                            var preDos3 = '0';
                            if (fre3 === '1') {
                                preDos3 = dosage;
                            }
                            if (preDos1 === "0" && preDos2 === "0" && preDos3 === "0") {
                                item.PrescriptionData.Dosage1 = "";
                                item.PrescriptionData.Dosage2 = "";
                                item.PrescriptionData.Dosage3 = "";
                            } else {
                                item.PrescriptionData.Dosage1 = preDos1;
                                item.PrescriptionData.Dosage2 = preDos2;
                                item.PrescriptionData.Dosage3 = preDos3;
                            }
                        }
                    }
                }
            });
        }

        var prescriptionArray = [
            $scope.cacheStorageItem.Prescriptions && $scope.cacheStorageItem.Prescriptions.length > 0 ? $scope.cacheStorageItem.Prescriptions : [],
            $scope.cacheStorageItem.PrescriptionMedNotes ? $scope.cacheStorageItem.PrescriptionMedNotes : []
        ];

        var prescriptionFlag = prescriptionArray[0].length > 0 ? true : false;

        var TreatmentArray = [
            $scope.cacheStorageItem.Treatments && $scope.cacheStorageItem.Treatments.length > 0 ? $scope.cacheStorageItem.Treatments : [],
            $scope.cacheStorageItem.TotalTreatNetAmount ? $scope.cacheStorageItem.TotalTreatNetAmount : [],
            $scope.cacheStorageItem.TotalTreatcost ? $scope.cacheStorageItem.TotalTreatcost : [],
            $scope.cacheStorageItem.TotalDisocuntAmount ? $scope.cacheStorageItem.TotalDisocuntAmount : []
        ];
        var TreatmentFlag = $scope.cacheStorageItem.Treatments && $scope.cacheStorageItem.Treatments.length > 0 ? true : false;

        var ConsultationTreatmentFlag = $scope.cacheStorageItem.ConsultationTreatments && $scope.cacheStorageItem.ConsultationTreatments.length > 0 ? true : false;

        var visionPrintArray = [$scope.cacheStorageItem.mainVisionPrintArray, $scope.cacheStorageItem.Findings];
        var newVisionArrayFlag = false;

        var newAnteriorArrayFlag = false;
        var newPosteriorArrayFlag = false;
        var newTonometryArrayFlag = false;

        var newGlassArrayFlag = false;
        var newColorVisionArrayFlag = false;
        var newLacrimalFlag = false;
        var newSquintFlag = false;
        var newGonioscopyFlag = false;

        //changes by bindu
        var ArFlag = false;
        var DilatedArFlag = false;
        var cycloFlag = false;
        var visualFlag = false;
        var retinoFlag = false;
        var pmtFlag = false;
        var subjectiveFlag = false;
        var keretometerFlag = false;
        var LcvaFlag = false;
        var ArList = [];
        var cycloList = [];
        var visualList = [];
        var retinoList = [];
        var pmtList = [];
        var subjectiveList = [];
        var keretometerList = [];
        var LcvaList = [];
        var DilatedArList = [];

        if ($scope.cacheStorageItem.VisionDetails.length > 0) {
            $scope.cacheStorageItem.FinalVisionDetails = $filter("filter")($scope.cacheStorageItem.VisionDetails, { "IsInvDataAdded": true }, true);
        }
        if ($scope.cacheStorageItem.FinalVisionDetails.length > 0) {
            var List = $filter("filter")($scope.cacheStorageItem.FinalVisionDetails, { "ActiveInd": 'Y' }, true);
            console.log(JSON.stringify(List));
            if (List.length > 0) {
                newVisionArrayFlag = true;
            }
            //changes by bindu

            ArList = $filter("filter")($scope.cacheStorageItem.FinalVisionDetails, { "ActiveInd": 'Y', 'InvestigationId': 1 }, true);
            if (ArList.length > 0) {
                ArFlag = true;
            }
            DilatedArList = $filter("filter")($scope.cacheStorageItem.FinalVisionDetails, { "ActiveInd": 'Y', 'InvestigationId': 2102 }, true);
            if (DilatedArList.length > 0) {
                DilatedArFlag = true;
            }

            subjectiveList = $filter("filter")($scope.cacheStorageItem.FinalVisionDetails, { "ActiveInd": 'Y', 'InvestigationId': 2 }, true);
            if (subjectiveList.length > 0) {
                subjectiveFlag = true;
            }
            cycloList = $filter("filter")($scope.cacheStorageItem.FinalVisionDetails, { "ActiveInd": 'Y', 'InvestigationId': 3 }, true);
            if (cycloList.length > 0) {
                cycloFlag = true;
            }
            keretometerList = $filter("filter")($scope.cacheStorageItem.FinalVisionDetails, { "ActiveInd": 'Y', 'InvestigationId': 11 }, true);
            if (keretometerList.length > 0) {
                keretometerFlag = true;
            }

            LcvaList = $filter("filter")($scope.cacheStorageItem.FinalVisionDetails, { "ActiveInd": 'Y', 'InvestigationId': 8 }, true);
            if (LcvaList.length > 0) {
                LcvaFlag = true;
            }
            retinoList = $filter("filter")($scope.cacheStorageItem.FinalVisionDetails, { "ActiveInd": 'Y', 'InvestigationId': 2074 }, true);
            if (retinoList.length > 0) {
                retinoFlag = true;
            }
            pmtList = $filter("filter")($scope.cacheStorageItem.FinalVisionDetails, { "ActiveInd": 'Y', 'InvestigationId': 2088 }, true);
            if (pmtList.length > 0) {
                pmtFlag = true;
            }

            angular.forEach($scope.cacheStorageItem.FinalVisionDetails, function (kitem) {
                if ((kitem.InvestigationId === 4 || kitem.InvestigationId === 5 || kitem.InvestigationId === 12 || kitem.InvestigationId === 13 || kitem.InvestigationId === 2071 || kitem.InvestigationId === 2072 || kitem.InvestigationId === 2073 || kitem.InvestigationId === 2076 || kitem.InvestigationId === 2077) && kitem.ActiveInd === 'Y') {
                    visualList.push(kitem);
                }
            });
            if (visualList.length > 0) {
                visualFlag = true;
            }
        }



        if ($scope.cacheStorageItem.AnteriorDetails.length > 0) {
            $scope.cacheStorageItem.FinalAnteriorDetails = $filter("filter")($scope.cacheStorageItem.AnteriorDetails, { "IsInvDataAdded": true }, true);
        }
        if ($scope.cacheStorageItem.FinalAnteriorDetails.length > 0) {
            var List = $filter("filter")($scope.cacheStorageItem.FinalAnteriorDetails, { "ActiveInd": 'Y' }, true);
            if (List.length > 0) {
                newAnteriorArrayFlag = true;
            }
        }

        if ($scope.cacheStorageItem.PosteriorDetails.length > 0) {
            $scope.cacheStorageItem.FinalPosteriorDetails = $filter("filter")($scope.cacheStorageItem.PosteriorDetails, { "IsInvDataAdded": true }, true);
        }
        if ($scope.cacheStorageItem.FinalPosteriorDetails.length > 0) {
            var List = $filter("filter")($scope.cacheStorageItem.FinalPosteriorDetails, { "ActiveInd": 'Y' }, true);
            if (List.length > 0) {
                newPosteriorArrayFlag = true;
            }
        }

        if ($scope.cacheStorageItem.TonoMetryDetails.length > 0) {
            $scope.cacheStorageItem.FinalTonoMetryDetails = $filter("filter")($scope.cacheStorageItem.TonoMetryDetails, { "IsInvDataAdded": true }, true);
        }
        if ($scope.cacheStorageItem.FinalTonoMetryDetails.length > 0) {
            var List = $filter("filter")($scope.cacheStorageItem.FinalTonoMetryDetails, { "ActiveInd": 'Y' }, true);
            if (List.length > 0) {
                newTonometryArrayFlag = true;
            }
        }

        if ($scope.cacheStorageItem.ColorVisionDetails.length > 0) {
            $scope.cacheStorageItem.FinalColorVisionDetails = $filter("filter")($scope.cacheStorageItem.ColorVisionDetails, { "IsInvDataAdded": true }, true);
        }
        if ($scope.cacheStorageItem.FinalColorVisionDetails.length > 0) {
            var List = $filter("filter")($scope.cacheStorageItem.FinalColorVisionDetails, { "ActiveInd": 'Y' }, true);
            if (List.length > 0) {
                newColorVisionArrayFlag = true;
            }
        }

        if ($scope.cacheStorageItem.GlassDetails.length > 0) {
            $scope.cacheStorageItem.FinalGlassDetails = $filter("filter")($scope.cacheStorageItem.GlassDetails, { "IsInvDataAdded": true, "InvestigationId": 43 }, true);

        }
        if ($scope.cacheStorageItem.FinalGlassDetails.length > 0) {
            var List = $filter("filter")($scope.cacheStorageItem.FinalGlassDetails, { "ActiveInd": 'Y' }, true);
            if (List.length > 0) {
                newGlassArrayFlag = true;
            }

        }
        if ($scope.cacheStorageItem.LacrimalPatiencyDetails.length > 0) {
            $scope.cacheStorageItem.FinalLacrimalPatiencyDetails = $filter("filter")($scope.cacheStorageItem.LacrimalPatiencyDetails, { "IsInvDataAdded": true }, true);
        }
        if ($scope.cacheStorageItem.FinalLacrimalPatiencyDetails.length > 0) {
            var List = $filter("filter")($scope.cacheStorageItem.FinalLacrimalPatiencyDetails, { "ActiveInd": 'Y' }, true);
            if (List.length > 0) {
                newLacrimalFlag = true;
            }
        }
        if ($scope.cacheStorageItem.FinalGlassDetails.length > 0) {
            angular.forEach($scope.cacheStorageItem.FinalGlassDetails, function (ritem) {
                if (ritem.InvestigationId === 43) {
                    if (ritem.LensTypeArray.length > 0) {
                        ritem.LensType = [];
                        angular.forEach(ritem.LensTypeArray, function (kitem) {
                            if (kitem.IsActive === false && kitem.GlassLensId != 0) {
                                ritem.LensType.push(kitem);
                            }
                            if (kitem.IsActive === true) {
                                ritem.LensType.push(kitem);
                            }


                        });
                    }
                    if (ritem.LensCoatingArray.length > 0) {
                        ritem.LensCoating = [];
                        angular.forEach(ritem.LensCoatingArray, function (mitem) {
                            if (mitem.IsActive === false && mitem.GlassLensId != 0) {
                                ritem.LensCoating.push(mitem);
                            }
                            if (mitem.IsActive === true) {
                                ritem.LensCoating.push(mitem);
                            }
                        });
                    }
                }
            });
        }

        if ($scope.cacheStorageItem.GonioscopyDetails.length > 0) {
            $scope.cacheStorageItem.FinalGonioscopyDetails = $filter("filter")($scope.cacheStorageItem.GonioscopyDetails, { "IsInvDataAdded": true }, true);
        }
        if ($scope.cacheStorageItem.FinalGonioscopyDetails.length > 0) {
            var List = $filter("filter")($scope.cacheStorageItem.FinalGonioscopyDetails, { "ActiveInd": 'Y' }, true);
            if (List.length > 0) {
                newGonioscopyFlag = true;
            }
        }

        var followupNotes;
        if ($scope.cacheStorageItem.FollowUpDuration !== "" || $scope.cacheStorageItem.FollowUpNotes != "") {
            followupNotes = {
                "FollowUpDuration": $scope.cacheStorageItem.FollowUpDuration,
                "FollowUpDurationTypeName": $scope.cacheStorageItem.FollowUpDurationTypeName,
                "FollowUpNotes": $scope.cacheStorageItem.FollowUpNotes,
                "FollowUpDate": $scope.cacheStorageItem.FollowUpDate
            };
        }

        $scope.VitalsParametersArray1 = [{
            "VitalID": 1,
            "VitalDesc": "Weight",
            "Value": ""
        },
        {
            "VitalID": 2,
            "VitalDesc": "Height",
            "Value": ""
        },
        {
            "VitalID": 3,
            "VitalDesc": "Blood Group",
            "Value": ""
        },
        {
            "VitalID": 4,
            "VitalDesc": "Bp (Mm/Hg)",
            "Value": ""
        },
        {
            "VitalID": 6,
            "VitalDesc": "Lipid Profile",
            "Value": ""
        },
        {
            "VitalID": 7,
            "VitalDesc": "Sugar Fast / PP",
            "Value": ""
        },
        {
            "VitalID": 9,
            "VitalDesc": "Sugar Random",
            "Value": ""
        },
        {
            "VitalID": 10,
            "VitalDesc": "Serum Creatinine",
            "Value": ""
        },
        {
            "VitalID": 11,
            "VitalDesc": "Temperature",
            "Value": ""
        },
        {
            "VitalID": 12,
            "VitalDesc": "Pulse",
            "Value": ""
        },
        {
            "VitalID": 13,
            "VitalDesc": "Head Circumference",
            "Value": ""
        },
        {
            "VitalID": 14,
            "VitalDesc": "Respiratory Rate",
            "Value": ""
        },
        {
            "VitalID": 15,
            "VitalDesc": "SpO2",
            "Value": ""
        },
        {
            "VitalID": 16,
            "VitalDesc": "PEFR",
            "Value": ""
        },
        {
            "VitalID": 17,
            "VitalDesc": "BMI",
            "Value": ""
        },
        {
            "VitalID": 27,
            "VitalDesc": "Duct",
            "Value": ""
        },
        {
            "VitalID": 28,
            "VitalDesc": "Tension",
            "Value": ""
        }
        ];
        var bphigh = "", bplow = "", sfast = "", spp = "";

        angular.forEach($scope.cacheStorageItem.Vitals, function (item) {
            if (item.VitalID === 4) {
                if (item.Value !== "") {
                    bplow = item.Value;
                }
            }
            if (item.VitalID === 5) {
                if (item.Value !== "") {
                    bphigh = item.Value;
                }
            }
            if (item.VitalID === 7) {
                if (item.Value !== "") {
                    sfast = item.Value;
                }
            }
            if (item.VitalID === 8) {
                if (item.Value !== "") {
                    spp = item.Value;
                }
            }
        });

        angular.forEach($scope.VitalsParametersArray1, function (item) {
            if ($scope.cacheStorageItem.Vitals.length > 0) {
                if ($scope.cacheStorageItem.Vitals[1].Value !== "" && $scope.cacheStorageItem.Vitals[0].Value !== "" && $scope.cacheStorageItem.Vitals[1].Value !== undefined && $scope.cacheStorageItem.Vitals[0].Value !== undefined) {
                    $scope.bmiValueCal($scope.cacheStorageItem.Vitals[1].Value, $scope.cacheStorageItem.Vitals[0].Value);
                }
            }
            angular.forEach($scope.cacheStorageItem.Vitals, function (item2) {
                if (item.VitalID === item2.VitalID) {
                    if (item.VitalID === 4) {
                        if (bphigh === "" && bplow === "") {
                            item.Value = "";
                        } else {
                            item.Value = bphigh + " / " + bplow;
                        }
                    } else if (item.VitalID === 7) {
                        if (sfast === "" && spp === "") {
                            item.Value = "";
                        } else {
                            item.Value = sfast + " / " + spp;
                        }

                    } else {
                        if (item2.VitalID !== "") {
                            item.Value = item2.Value;
                        }
                    }
                }
            });
        });
        var i;

        i = $scope.VitalsParametersArray1.length;
        while (i--) {
            if ($scope.VitalsParametersArray1[i].Value === "") {
                $scope.VitalsParametersArray1.splice(i, 1);
            }
        }

        $scope.VitalsList = $scope.VitalsParametersArray1;


        var glassPrintArray = $scope.cacheStorageItem.GlassDetails;

        if ($scope.cacheStorageItem.SquintDetails.length > 0) {
            $scope.cacheStorageItem.FinalSquintDetails = $filter("filter")($scope.cacheStorageItem.SquintDetails, { "IsInvDataAdded": true }, true);
        }
        if ($scope.cacheStorageItem.FinalSquintDetails.length > 0) {
            var List = $filter("filter")($scope.cacheStorageItem.FinalSquintDetails, { "ActiveInd": 'Y' }, true);
            if (List.length > 0) {
                newSquintFlag = true;
            }
        }

        if ($scope.printAll === "3") {
            var printObj = {
                "ChiefComplaint": $filter("filter")($scope.cacheStorageItem.ChiefComplaints, { "ActiveInd": 'Y' }, true),
                "observations": $filter("filter")($scope.cacheStorageItem.Observations, { "ActiveInd": 'Y' }, true),
                "provisionalDiagnosis": $filter("filter")(provisonalDiagnosis, { "DiagnosisData": { "ActiveInd": 'Y' } }, true),
                "finalDiagnosis": $filter("filter")(finalDiagnosis, { "DiagnosisData": { "ActiveInd": 'Y' } }, true),

                "LabTest": $filter("filter")($scope.cacheStorageItem.LabTest, { "ActiveInd": 'Y' }, true),
                "treatment": TreatmentFlag ? $filter("filter")(TreatmentArray, { "TreatmentData": { "ActiveInd": 'Y' } }, true) : [],
                "prescription": prescriptionFlag ? $filter("filter")(prescriptionArray, { "PrescriptionData": { "ActiveInd": "Y" } }, true) : [],
                "allergies": $scope.cacheStorageItem.AllergyItems,
                "medicalHistory": $filter("filter")($scope.cacheStorageItem.MedicalHistory, { "ActiveInd": true }, true),
                "medicalConditions": $filter("filter")($scope.cacheStorageItem.MedicalConditions, { "ActiveIND": 'Y' }, true),
                "vitals": $scope.VitalsList,
                "vision": visionPrintArray,
                "surgery": $filter("filter")($scope.cacheStorageItem.SurgeryArray, { "ActiveInd": 'Y' }, true),
                "followupObj": followupNotes,
                "PlanOfCare": $filter("filter")($scope.cacheStorageItem.PlanOfCareComments, { "ActiveInd": 'Y' }, true),
                "Glasses": glassPrintArray,
                "OccularHistory": $filter("filter")($scope.cacheStorageItem.OccularHistory, { "ActiveInd": true }, true),
                "BirthHistory": $filter("filter")($scope.cacheStorageItem.BirthHistory, { "ActiveInd": true }, true),
                "FamilyHistory": $filter("filter")($scope.cacheStorageItem.FamilyHistory, { "ActiveInd": true }, true),
                "NutritionalHistory": $filter("filter")($scope.cacheStorageItem.NutritionalHistory, { "ActiveInd": true }, true),
                "ImmunisationHistory": $filter("filter")($scope.cacheStorageItem.ImmunisationHistory, { "ActiveInd": true }, true),
                "SurgicalHistory": $filter("filter")($scope.cacheStorageItem.SurgicalHistory, { "ActiveInd": true }, true),
                "MenstrualHistory": $filter("filter")($scope.cacheStorageItem.MenstrualHistory, { "ActiveInd": true }, true),
                "LifestyleHistory": $filter("filter")($scope.cacheStorageItem.LifestyleHistory, { "ActiveInd": true }, true),
                "SkinProblem": $filter("filter")($scope.cacheStorageItem.Checklist.MainArray.SkinArray, { "IsActive": true }, true),
                "HairProblem": $filter("filter")($scope.cacheStorageItem.Checklist.MainArray.HairArray, { "IsActive": true }, true),
                "PatientSuggestInvestigation": $filter("filter")($scope.cacheStorageItem.PatientSuggestInvestigation, { "ActiveInd": 'Y' }, true),
                "PatientInvestigations": $filter("filter")($scope.cacheStorageItem.PatientInvestigations, { "ActiveInd": 'Y' }, true),
                "NewLabTestList": $filter("filter")($scope.cacheStorageItem.LabtestList, { "ActiveInd": 'Y' }, true),
                "Gonioscopy": $scope.cacheStorageItem.FinalGonioscopy,
                "clinicalNotes": $scope.cacheStorageItem.ClinicalNotesComments,
                "PatientInstructions": $scope.cacheStorageItem.PatientInstructionComments,
                "PatientInvestigationresultview": [],
                "ContactLens": $filter("filter")($scope.cacheStorageItem.ContactLens, { "ActiveInd": 'Y' }, true),
                "ConsultationTreatments": ConsultationTreatmentFlag ? $filter("filter")($scope.cacheStorageItem.ConsultationTreatments, { "ActiveInd": 'Y' }, true) : [],
                "visionDetails": $filter("filter")($scope.cacheStorageItem.VisionDetails, { "IsInvDataAdded": true }, true) || [],
                "anteriorDetails": $filter("filter")($scope.cacheStorageItem.AnteriorDetails, { "IsInvDataAdded": true }, true) || [],
                "posteriorDetails": $filter("filter")($scope.cacheStorageItem.PosteriorDetails, { "IsInvDataAdded": true }, true) || [],
                "tonometryDetails": $filter("filter")($scope.cacheStorageItem.TonoMetryDetails, { "IsInvDataAdded": true }, true) || [],
                "glassDetails": $filter("filter")($scope.cacheStorageItem.GlassDetails, { "IsInvDataAdded": true }, true) || [],
                "colorVisionDetails": $filter("filter")($scope.cacheStorageItem.ColorVisionDetails, { "IsInvDataAdded": true }, true) || [],
                "lacrimalPatiencyDetails": $filter("filter")($scope.cacheStorageItem.LacrimalPatiencyDetails, { "IsInvDataAdded": true }, true) || [],
                "squintDetails": $filter("filter")($scope.cacheStorageItem.SquintDetails, { "IsInvDataAdded": true }, true) || [],
                "gonioscopyDetails": $filter("filter")($scope.cacheStorageItem.GonioscopyDetails, { "IsInvDataAdded": true }, true) || []
            };

            printObj.date = $scope.curDate.ConsultationDate;
            $scope.PatientInvestigationresult = [];
            if (printObj.PatientInvestigations.length !== 0) {
                if ($scope.cacheStorageItem.listofPatientInvestigation.length !== 0) {
                    angular.forEach($scope.cacheStorageItem.listofPatientInvestigation, function (hitem) {
                        var temarray = $filter("filter")(printObj.PatientInvestigations, function (item, index) { return item.PatientInvestigationId === hitem.PatientInvestigationId }, true);

                        if (temarray.length !== 0) {
                            $scope.PatientInvestigationresult.push(hitem);
                        }


                    });
                }
            }
            printObj.PatientInvestigationresultview = $scope.PatientInvestigationresult || [];
            var cdate = $scope.cacheStorageItem.ConsultationDate || $scope.cacheStorageItem.ApptDate || $scope.cacheStorageItem.AppointmentDt;
            printObj.consultationDate = $filter("date")(new Date(cdate), "dd-MMM-yyyy");
            printObj.displayID = $scope.Main.DisplayID;
            printObj.pageType = "consultation";
            printObj.appointmentinfo = appointmentinfo || "";
            printObj.AnteriorRemarks = $scope.cacheStorageItem.AnteriorRemarks || "";
            printObj.PosteriorRemarks = $scope.cacheStorageItem.PosteriorRemarks || "";
            var starttime = $filter("date")(new Date($scope.cacheStorageItem.ConsultationStartTime), "HH:mm");
            printObj.ConsultationTime = starttime;

            printObj.cache = $scope.cacheStorageItem;
            if (type === 'Glasses') {
                printObj.pageType = "Glass Prescription";
            }
            else if (type === 'prescription') {
                printObj.pageType = "prescription";
            }
            if (type === "PrintSubModule") {
                eHnotePrintService.NewSubModulePrintForConsultation(printObj, $scope.PrintObj.PrintLanguageId, $scope.SubModuleType);
            }
            angular.forEach($scope.cacheStorageItem.PatientInvestigations, function (item) {
                item.OrganId = item.OrganId.toString();
            });
            $scope.AddToCache();
        }


        else {
            var printObj = {
                //"ChiefComplaint": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.ChiefComplaints, { "ActiveInd": 'Y' }, true), 'ChiefComplaint', 'Chief Complaint', $scope.UserPrintAccess.ChiefComplaints),
                //"vitals": checkPrintType(type, $scope.VitalsList, 'vitals', 'Vitals', $scope.UserPrintAccess.VItals),
                //"allergies": checkPrintType(type, $scope.cacheStorageItem.AllergyItems, 'allergies', 'Allergies', $scope.UserPrintAccess.Allergies),
                //"medicalHistory": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.MedicalHistory, { "ActiveInd": true }, true), 'medicalHistory', 'Medical History', $scope.UserPrintAccess.MedicalHistory),
                //"medicalConditions": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.MedicalConditions, { "ActiveIND": 'Y' }, true), 'medicalConditions', 'Current Treatment', $scope.UserPrintAccess.CurrentTreatment),
                //"OccularHistory": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.OccularHistory, { "ActiveInd": true }, true), 'OccularHistory', 'OccularHistory', $scope.UserPrintAccess.OcularHistory),
                //"BirthHistory": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.BirthHistory, { "ActiveInd": true }, true), 'BirthHistory', 'BirthHistory', $scope.UserPrintAccess.BirthHistory),
                //"FamilyHistory": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.FamilyHistory, { "ActiveInd": true }, true), 'FamilyHistory', 'FamilyHistory', $scope.UserPrintAccess.FamilyHistory),
                //"NutritionalHistory": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.NutritionalHistory, { "ActiveInd": true }, true), 'NutritionalHistory', 'NutritionalHistory', $scope.UserPrintAccess.NutritionalHistory),
                //"ImmunisationHistory": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.ImmunisationHistory, { "ActiveInd": true }, true), 'ImmunisationHistory', 'ImmunisationHistory', $scope.UserPrintAccess.ImmunisationHistory),
                //"SurgicalHistory": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.SurgicalHistory, { "ActiveInd": true }, true), 'SurgicalHistory', "SurgicalHistory", $scope.UserPrintAccess.SurgicalHistory),
                //"MenstrualHistory": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.MenstrualHistory, { "ActiveInd": true }, true), 'MenstrualHistory', "MenstrualHistory", $scope.UserPrintAccess.MenstrualHistory),
                //"LifestyleHistory": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.LifestyleHistory, { "ActiveInd": true }, true), 'LifestyleHistory', "LifestyleHistory", $scope.UserPrintAccess.LifestyleHistory),
                //"SkinProblem": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.Checklist.MainArray.SkinArray, { "IsActive": true }, true), 'SkinProblem', "SkinProblem", true),
                //"HairProblem": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.Checklist.MainArray.HairArray, { "IsActive": true }, true), 'HairProblem', "HairProblem", true),
                //"AR": checkPrintType(type, ArFlag ? ArList : [], "AR", "AR", $scope.UserPrintAccess.AR),
                //"DilatedAR": checkPrintType(type, DilatedArFlag ? DilatedArList : [], "DilatedAR", "DilatedAR", $scope.UserPrintAccess.DilatedAR),
                //"SubjectiveRefraction": checkPrintType(type, subjectiveFlag ? subjectiveList : [], "SubjectiveRefraction", "SubjectiveRefraction", $scope.UserPrintAccess.SubjectiveRefraction),
                //"CycloRefraction": checkPrintType(type, cycloFlag ? cycloList : [], "CycloRefraction", "CycloRefraction", $scope.UserPrintAccess.CycloplegicRefraction),
                //"Keretometer": checkPrintType(type, keretometerFlag ? keretometerList : [], "Keretometer", "Keretometer", $scope.UserPrintAccess.Keratometer),
                //"LCVA": checkPrintType(type, LcvaFlag ? LcvaList : [], "LCVA", "LCVA", $scope.UserPrintAccess.LCVA),
                //"Retinoscopy": checkPrintType(type, retinoFlag ? retinoList : [], "Retinoscopy", "Retinoscopy", $scope.UserPrintAccess.Retinoscopy),
                //"PostMydriaticTest": checkPrintType(type, pmtFlag ? pmtList : [], "PostMydriaticTest", "PostMydriaticTest", $scope.UserPrintAccess.PostMydriaticTest),
                //"VisualAcuity": checkPrintType(type, visualFlag ? visualList : [], "VisualAcuity", "VisualAcuity", $scope.UserPrintAccess.VisualAcuity),
                //"anteriorDetails": checkPrintType(type, newAnteriorArrayFlag ? $scope.cacheStorageItem.FinalAnteriorDetails : [], "anteriorDetails", "AnteriorSegment", $scope.UserPrintAccess.AnteriorSegment),
                //"posteriorDetails": checkPrintType(type, newPosteriorArrayFlag ? $scope.cacheStorageItem.FinalPosteriorDetails : [], "posteriorDetails", "PosteriorSegment", $scope.UserPrintAccess.PosteriorSegment),
                //"tonometryDetails": checkPrintType(type, newTonometryArrayFlag ? $scope.cacheStorageItem.FinalTonoMetryDetails : [], "tonometryDetails", "Tonometry Test", $scope.UserPrintAccess.Tonometrytest),
                //"colorVisionDetails": checkPrintType(type, newColorVisionArrayFlag ? $scope.cacheStorageItem.FinalColorVisionDetails : [], "colorVisionDetails", "ColorVision test", $scope.UserPrintAccess.ColorVisiontest),
                //"lacrimalPatiencyDetails": checkPrintType(type, newLacrimalFlag ? $scope.cacheStorageItem.FinalLacrimalPatiencyDetails : [], "lacrimalPatiencyDetails", "Lacrimal Patency", $scope.UserPrintAccess.LacrimalPatency),
                //"squintDetails": checkPrintType(type, newSquintFlag ? $scope.cacheStorageItem.FinalSquintDetails : [], "squintDetails", "Squint", $scope.UserPrintAccess.Squint),
                //"gonioscopyDetails": checkPrintType(type, newGonioscopyFlag ? $scope.cacheStorageItem.FinalGonioscopyDetails : [], "gonioscopyDetails", "Gonioscopy", $scope.UserPrintAccess.Gonioscopy),
                //"vision": checkPrintType(type, visionPrintArray, 'vision', 'DryEyeEvaluation', $scope.UserPrintAccess.DryEyeEvaluation),
                //"PatientSuggestInvestigation": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.PatientSuggestInvestigation, { "ActiveInd": 'Y' }, true), 'PatientSuggestInvestigation', 'PatientSuggestInvestigation', true),
                //"PatientInvestigations": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.PatientInvestigations, { "ActiveInd": 'Y' }, true), 'PatientInvestigations', 'PatientInvestigations', $scope.UserPrintAccess.Investigations),
                //"provisionalDiagnosis": checkPrintType(type, $filter("filter")(provisonalDiagnosis, { "DiagnosisData": { "ActiveInd": 'Y' } }, true), 'finalDiagnosis', 'Provisional Diagnosis', $scope.UserPrintAccess.Diagnosis),
                //"finalDiagnosis": checkPrintType(type, $filter("filter")(finalDiagnosis, { "DiagnosisData": { "ActiveInd": 'Y' } }, true), 'finalDiagnosis', 'ActualDiagnosis', $scope.UserPrintAccess.Diagnosis),
                //"treatment": checkPrintType(type, TreatmentFlag ? $filter("filter")(TreatmentArray, { "TreatmentData": { "ActiveInd": 'Y' } }, true) : [], 'treatment', 'Procedure', $scope.UserPrintAccess.Procedures),
                //"prescription": checkPrintType(type, prescriptionFlag ? $filter("filter")(prescriptionArray, { "PrescriptionData": { "ActiveInd": "Y" } }, true) : [], "prescription", "Prescription", $scope.UserPrintAccess.Prescription),
                //"surgery": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.SurgeryArray, { "ActiveInd": 'Y' }, true), 'surgery', 'Surgery', $scope.UserPrintAccess.Surgery),
                //"Glasses": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.FinalGlassDetails, { "ActiveInd": 'Y' }, true), "Glasses", "Glasses", $scope.UserPrintAccess.GlassPrescription),
                //"ContactLens": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.ContactLens, { "ActiveInd": 'Y' }, true), 'ContactLens', 'ContactLens', $scope.UserPrintAccess.ContactLens),
                //"ConsultationTreatments": checkPrintType(type, ConsultationTreatmentFlag ? $filter("filter")($scope.cacheStorageItem.ConsultationTreatments, { "ActiveInd": 'Y' }, true) : [], 'ConsultationTreatments', 'Treatment', $scope.UserPrintAccess.Treatments),
                //"followupObj": checkPrintType(type, followupNotes, 'FollowupDetails', 'Follow-upNotes', true),
                //"PlanOfCare": checkPrintType(type, $filter("filter")($scope.cacheStorageItem.PlanOfCareComments, { "ActiveInd": 'Y' }, true), 'PlanOfCare', 'Plan Of Care', true),
                "clinicalNotes": checkPrintType(type, $scope.cacheStorageItem.ClinicalNotesComments, 'clinicalNotes', 'Clinical Notes', true),
                "PatientInstructions": checkPrintType(type, $scope.cacheStorageItem.PatientInstructionComments, 'PatientInstructions', 'PatientInstructions', true),
                "PatientInvestigationresultview": []
            };
            $scope.PatientInvestigationresult = [];

            $scope.TempVisionDetails = [];
            printObj.AR = printObj.AR || [];
            printObj.SubjectiveRefraction = printObj.SubjectiveRefraction || [];
            printObj.CycloRefraction = printObj.CycloRefraction || [];
            printObj.Keretometer = printObj.Keretometer || [];
            printObj.LCVA = printObj.LCVA || [];
            printObj.Retinoscopy = printObj.Retinoscopy || [];
            printObj.PostMydriaticTest = printObj.PostMydriaticTest || [];
            printObj.DilatedAR = printObj.DilatedAR || [];
            printObj.VisualAcuity = printObj.VisualAcuity || [];

            if (printObj.AR.length > 0) {
                $scope.TempVisionDetails.push(printObj.AR[0]);
            }
            if (printObj.SubjectiveRefraction.length > 0) {
                $scope.TempVisionDetails.push(printObj.SubjectiveRefraction[0]);
            }
            if (printObj.CycloRefraction.length > 0) {
                $scope.TempVisionDetails.push(printObj.CycloRefraction[0]);
            }
            if (printObj.Keretometer.length > 0) {
                $scope.TempVisionDetails.push(printObj.Keretometer[0]);
            }
            if (printObj.LCVA.length > 0) {
                $scope.TempVisionDetails.push(printObj.LCVA[0]);
            }
            if (printObj.Retinoscopy.length > 0) {
                $scope.TempVisionDetails.push(printObj.Retinoscopy[0]);
            }
            if (printObj.PostMydriaticTest.length > 0) {
                $scope.TempVisionDetails.push(printObj.PostMydriaticTest[0]);
            }
            if (printObj.DilatedAR.length > 0) {
                $scope.TempVisionDetails.push(printObj.DilatedAR[0]);
            }
            if (printObj.VisualAcuity.length > 0) {
                // $scope.TempVisionDetails.push(printObj.VisualAcuity[0]);
                $scope.TempVisionDetails = $scope.TempVisionDetails.concat(printObj.VisualAcuity);
            }

            printObj.visionDetails = $scope.TempVisionDetails || [];
            printObj.PatientInvestigationresultview = $scope.PatientInvestigationresult || [];

            var cdate = $scope.cacheStorageItem.ConsultationDate || $scope.cacheStorageItem.ApptDate || $scope.cacheStorageItem.AppointmentDt;
            printObj.consultationDate = $filter("date")(new Date(cdate), "dd-MMM-yyyy");
            // printObj.date = $scope.curDate.ConsultationDate;
            var cdate = $scope.cacheStorageItem.ConsultationDate || $scope.cacheStorageItem.ApptDate || $scope.cacheStorageItem.AppointmentDt;
            printObj.consultationDate = $filter("date")(new Date(cdate), "dd-MMM-yyyy");
            printObj.displayID = $scope.Main.DisplayID;
            printObj.pageType = "consultation";
            printObj.appointmentinfo = appointmentinfo || "";
            printObj.anteriorDetails = printObj.anteriorDetails || [];
            printObj.posteriorDetails = printObj.posteriorDetails || [];
            if (printObj.anteriorDetails != undefined || printObj.anteriorDetails.length > 0) {
                printObj.AnteriorRemarks = $scope.cacheStorageItem.AnteriorRemarks || "";
            }
            if ($scope.cacheStorageItem.AnteriorRemarks != '') {
                printObj.AnteriorRemarks = $scope.cacheStorageItem.AnteriorRemarks || "";
            }
            if (printObj.posteriorDetails != undefined || printObj.posteriorDetails.length > 0) {
                printObj.PosteriorRemarks = $scope.cacheStorageItem.PosteriorRemarks || "";
            }

            if ($scope.cacheStorageItem.PosteriorRemarks != '') {
                printObj.PosteriorRemarks = $scope.cacheStorageItem.PosteriorRemarks || "";
            }

            var starttime = $filter("date")(new Date($scope.cacheStorageItem.ConsultationStartTime), "HH:mm");
            printObj.ConsultationTime = starttime;

            //printObj.DoctorSignature = $scope.cacheStorageItem.DoctorSignature;
            var signatureString = localStorageFactory.getItem("DoctorSignatureString");
            printObj.DoctorSignature = signatureString;


            printObj.cache = $scope.cacheStorageItem;
            if (type === 'Glasses') {
                printObj.pageType = "Glass Prescription";
                if ($scope.UserPrintAccess.GlassPrescription === false) {
                    if (printObj.Glasses.length === 0) {
                        var glassDeatils = $filter("filter")($scope.cacheStorageItem.FinalGlassDetails, { "ActiveInd": 'Y' }, true);
                        if (glassDeatils.length != 0) {
                            printObj.Glasses = glassDeatils;
                        }
                    }
                }
            }
            else if (type === 'prescription') {
                printObj.pageType = "prescription";
            }
            if (type !== "printByModule") {
                if (PrintType === "A5") {
                    var printDate = $filter("date")(new Date(), "dd-MMM-yyyy");
                    var printTime = moment(new Date()).format("HH:mm");
                    var printDatemTime = printDate + '  ' + printTime;
                    printObj.printDatemTime = printDatemTime;
                    printObj.image = $scope.Sign;

                    eHnotePrintService.generatePrescriptionDetails(printObj, $scope.PrintObj.PrintLanguageId);
                } else {
                    eHnotePrintService.NewPrintForConsultation(printObj, $scope.PrintObj.PrintLanguageId);
                }
            }
            angular.forEach($scope.cacheStorageItem.PatientInvestigations, function (item) {
                item.OrganId = item.OrganId.toString();
            });
            $scope.AddToCache();
        }
    };




    $scope.viewconsultationsummary = function () {
        $scope.viewconsultationsummarydiv = true;
        $scope.SummaryDrawingpad = true;

        angular.forEach($scope.cacheStorageItem.Findings, function (qitem) {
            if (qitem.CategoryConditions.length > 0) {
                angular.forEach(qitem.CategoryConditions, function (gitem) {
                    gitem.RightEyeRemarksArray = gitem.RightEyeRemarksArray || [];
                    gitem.LeftEyeRemarksArray = gitem.LeftEyeRemarksArray || [];

                    if (qitem.CategoryID === 256) {
                        gitem.RightEyeRemarksArray = [];
                        gitem.LeftEyeRemarksArray = [];
                    } else {
                        if (gitem.SelectedRightEyeRemarksObj !== "") {

                            var isObject = angular.isObject(gitem.SelectedRightEyeRemarksObj);
                            var findingVal = "", findingid = 0;
                            if (isObject) {
                                findingVal = gitem.SelectedRightEyeRemarksObj.FindingValue || "";
                                findingid = gitem.SelectedRightEyeRemarksObj.InvFindingId;
                            } else {
                                findingVal = gitem.SelectedRightEyeRemarksObj || "";
                            }
                            var obj = {
                                "ActiveInd": true,
                                "Remarks": findingVal,
                                "Id": findingid
                            };

                            if (obj.Remarks === "") {

                            } else {
                                gitem.RightEyeRemarksArray.push(obj);
                            }

                            gitem.SelectedRightEyeRemarksObj = "";
                        }

                        if (gitem.SelectedLeftEyeRemarksObj !== "") {


                            var isObject = angular.isObject(gitem.SelectedLeftEyeRemarksObj);
                            var findingVal = "", findingid = 0;
                            if (isObject) {
                                findingVal = gitem.SelectedLeftEyeRemarksObj.FindingValue || "";
                                findingid = gitem.SelectedLeftEyeRemarksObj.InvFindingId;
                            } else {
                                findingVal = gitem.SelectedLeftEyeRemarksObj || "";
                            }
                            var obj = {
                                "ActiveInd": true,
                                "Remarks": findingVal,
                                "Id": findingid
                            };



                            if (obj.Remarks === "") {

                            } else {
                                gitem.LeftEyeRemarksArray.push(obj);
                            }

                            gitem.SelectedLeftEyeRemarksObj = "";
                        }

                    }
                });
            }
        });

        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (gitem) {
            if (gitem.SelectedRightEyeRemarksObj !== "") {

                var isObject = angular.isObject(gitem.SelectedRightEyeRemarksObj);
                var findingVal = "", findingid = 0;
                if (isObject) {
                    findingVal = gitem.SelectedRightEyeRemarksObj.FindingValue || "";
                    findingid = gitem.SelectedRightEyeRemarksObj.InvFindingId;
                } else {
                    findingVal = gitem.SelectedRightEyeRemarksObj || "";
                }
                var obj = {
                    "RemarksId": 0,
                    "ActiveInd": 'Y',
                    "Remarks": findingVal || "",
                    "InvFindingId": findingid || 0
                };

                if (obj.Remarks === "") {

                } else {
                    gitem.RightEye.RemarksArray.push(obj);
                }

                gitem.SelectedRightEyeRemarksObj = "";
            } else {
                if (gitem.RightEye.RemarksArray.length != 0) {
                    gitem.IsInvDataAdded = true;
                    gitem.RightEye.RemarksArray = gitem.RightEye.RemarksArray;
                }
            }

            if (gitem.SelectedLeftEyeRemarksObj !== "") {


                var isObject = angular.isObject(gitem.SelectedLeftEyeRemarksObj);
                var findingVal = "", findingid = 0;
                if (isObject) {
                    findingVal = gitem.SelectedLeftEyeRemarksObj.FindingValue || "";
                    findingid = gitem.SelectedLeftEyeRemarksObj.InvFindingId;
                } else {
                    findingVal = gitem.SelectedLeftEyeRemarksObj || "";
                }
                var obj = {
                    "RemarksId": 0,
                    "ActiveInd": 'Y',
                    "Remarks": findingVal || "",
                    "InvFindingId": findingid || 0
                };


                if (obj.Remarks === "") {

                } else {
                    gitem.LeftEye.RemarksArray.push(obj);
                }

                gitem.SelectedLeftEyeRemarksObj = "";
            } else {
                if (gitem.LeftEye.RemarksArray.length != 0) {
                    gitem.IsInvDataAdded = true;
                    gitem.LeftEye.RemarksArray = gitem.RightEye.RemarksArray;
                }
            }
        });

        angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (gitem) {
            if (gitem.SelectedRightEyeRemarksObj !== "") {

                var isObject = angular.isObject(gitem.SelectedRightEyeRemarksObj);
                var findingVal = "", findingid = 0;
                if (isObject) {
                    findingVal = gitem.SelectedRightEyeRemarksObj.FindingValue || "";
                    findingid = gitem.SelectedRightEyeRemarksObj.InvFindingId;
                } else {
                    findingVal = gitem.SelectedRightEyeRemarksObj || "";
                }
                var obj = {
                    "RemarksId": 0,
                    "ActiveInd": 'Y',
                    "Remarks": findingVal || "",
                    "InvFindingId": findingid || 0
                };

                if (obj.Remarks === "") {

                } else {
                    gitem.RightEye.RemarksArray.push(obj);
                }

                gitem.SelectedRightEyeRemarksObj = "";
            } else {
                if (gitem.RightEye.RemarksArray.length != 0) {
                    gitem.IsInvDataAdded = true;
                    gitem.RightEye.RemarksArray = gitem.RightEye.RemarksArray;
                }
            }

            if (gitem.SelectedLeftEyeRemarksObj !== "") {


                var isObject = angular.isObject(gitem.SelectedLeftEyeRemarksObj);
                var findingVal = "", findingid = 0;
                if (isObject) {
                    findingVal = gitem.SelectedLeftEyeRemarksObj.FindingValue || "";
                    findingid = gitem.SelectedLeftEyeRemarksObj.InvFindingId;
                } else {
                    findingVal = gitem.SelectedLeftEyeRemarksObj || "";
                }
                var obj = {
                    "RemarksId": 0,
                    "ActiveInd": 'Y',
                    "Remarks": findingVal || "",
                    "InvFindingId": findingid || 0
                };


                if (obj.Remarks === "") {

                } else {
                    gitem.LeftEye.RemarksArray.push(obj);
                }

                gitem.SelectedLeftEyeRemarksObj = "";
            } else {
                if (gitem.LeftEye.RemarksArray.length != 0) {
                    gitem.IsInvDataAdded = true;
                    gitem.LeftEye.RemarksArray = gitem.RightEye.RemarksArray;
                }
            }
        });
        $scope.AddToCache();

        //$scope.UpdateInvestigationToCache();
        //$scope.loadVisionFromCache();
        if ($scope.cacheStorageItem.Vitals.length > 0) {
            if ($scope.cacheStorageItem.Vitals[1].Value !== "" && $scope.cacheStorageItem.Vitals[0].Value !== "" && $scope.cacheStorageItem.Vitals[1].Value !== undefined && $scope.cacheStorageItem.Vitals[0].Value !== undefined) {
                $scope.bmiValueCal($scope.cacheStorageItem.Vitals[1].Value, $scope.cacheStorageItem.Vitals[0].Value);
            }
        }

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
        var object = { "Name": text, "UserId": $scope.UserId, "FindingId": inv.InvestigationId };
        eHnoteDiagnosisDataServices.AddFindingValues(object).then(function (resp) {
            if (resp.data.Status !== 1) {
                alertify.error(resp.data.Message);
                return;
            }
            if (type === "Right") {
                inv.RightEyeRemarks = resp.data.data.Rows[0].FindingValue;
                inv.RightEyeRemarksId = resp.data.data.Rows[0].InvFindingId;

                var obj = {
                    "RemarksId": 0,
                    "ActiveInd": 'Y',
                    "Remarks": resp.data.data.Rows[0].FindingValue || "",
                    "InvFindingId": resp.data.data.Rows[0].InvFindingId || 0
                };
                inv.RightEye.RemarksArray = inv.RightEye.RemarksArray || [];
                inv.SelectedRightEyeRemarksObj = inv.LeftEyeRemarks;
                if (inv.RightEye.RemarksArray.length !== 0) {
                    var List = $filter("filter")(inv.RightEye.RemarksArray, { "Remarks": obj.Remarks }, true);
                    if (List.length > 0) {
                        inv.SelectedRightEyeRemarksObj = "";
                        alertify.error('Its already added');
                        return;
                    }
                }
                inv.RightEye.RemarksArray.push(obj);
                inv.SelectedRightEyeRemarksObj = "";
            }
            if (type === "Left") {

                inv.LeftEyeRemarks = resp.data.data.Rows[0].FindingValue;
                inv.LeftEyeRemarksId = resp.data.data.Rows[0].InvFindingId;


                obj = {
                    "RemarksId": 0,
                    "ActiveInd": 'Y',
                    "Remarks": resp.data.data.Rows[0].FindingValue || "",
                    "InvFindingId": resp.data.data.Rows[0].InvFindingId || 0
                };
                inv.LeftEye.RemarksArray = inv.LeftEye.RemarksArray || [];
                inv.SelectedLeftEyeRemarksObj = inv.LeftEyeRemarks;
                if (inv.LeftEye.RemarksArray.length > 0) {
                    var List = $filter("filter")(inv.LeftEye.RemarksArray, { "Remarks": obj.Remarks }, true);
                    if (List.length > 0) {
                        inv.SelectedLeftEyeRemarksObj = "";
                        alertify.error('Its already added');
                        return;
                    }
                }
                inv.LeftEye.RemarksArray.push(obj);
                inv.SelectedLeftEyeRemarksObj = "";
            }
            if (type === "Both") {

                inv.BothEyeRemarks = resp.data.data.Rows[0].FindingValue;
                inv.BothEyeRemarksId = resp.data.data.Rows[0].InvFindingId;


                obj = {
                    "RemarksId": 0,
                    "ActiveInd": 'Y',
                    "Remarks": resp.data.data.Rows[0].FindingValue || "",
                    "InvFindingId": resp.data.data.Rows[0].InvFindingId || 0
                };
                inv.BothEye.RemarksArray = inv.BothEye.RemarksArray || [];
                inv.SelectedBothEyeRemarksObj = inv.LeftEyeRemarks;
                if (inv.BothEye.RemarksArray.length > 0) {
                    var List = $filter("filter")(inv.BothEye.RemarksArray, { "Remarks": obj.Remarks }, true);
                    if (List.length > 0) {
                        inv.SelectedBothEyeRemarksObj = "";
                        alertify.error('Its already added');
                        return;
                    }
                }
                inv.BothEye.RemarksArray.push(obj);
                inv.SelectedBothEyeRemarksObj = "";
            }
            $scope.cacheStorageItem.InvestigationAutocompleteList = resp.data.data;
            $scope.getFindingValues(text, inv.InvestigationId);
            alertify.success("New Finding Value Added");
        }, function (err) {
            console.log(err);
            alertify.error("Adding New Finding Value Failed");
        });
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

    $scope.GOTODrawingPad = function () {
        $scope.viewconsultationsummarydiv = false;
        $scope.SummaryDrawingpad = false;
    }


    $scope.DefaultlyGetTemplate = function (type, item) {
        if (type === "Right") {
            if (item.RightTemplateUrl === "") {
            } else {
                item.RightOrganDocUrl = item.RightTemplateUrl;
                item.RightEyefileName = item.RightTemplateUrl.substring(item.LeftTemplateUrl.lastIndexOf("/") + 1);
                $("#maineHnoteLoader").show();
                $scope.toDataURL(item.RightTemplateUrl, function (dataURL) {
                    item.RightEyediv = true;
                    item.thumbnailRightEye = dataURL;
                    $("#maineHnoteLoader").hide();
                });
            }
        }
        if (type === "Left") {
            if (item.LeftTemplateUrl === "") {
            } else {
                item.LeftOrganDocUrl = item.LeftTemplateUrl;
                item.LeftEyefileName = item.LeftTemplateUrl.substring(item.LeftTemplateUrl.lastIndexOf("/") + 1);
                $("#maineHnoteLoader").show();
                $scope.toDataURL(item.LeftTemplateUrl, function (dataURL) {
                    item.LeftEyediv = true;
                    item.thumbnailLeftEye = dataURL;
                    $("#maineHnoteLoader").hide();
                });
            }
        }
    };
    $scope.DefaultlyGetTemplate('Right', $scope.Investigation);
    $scope.ReSaveInevstiagtion = function (Investigation, array) {
        var Index = -1;
        Index = array.findIndex(record => record.InvestigationId === Investigation.InvestigationId);
        if (Index > -1) {
            array[Index] = Investigation;
        }
        $scope.AddToCache();
    };

}]);
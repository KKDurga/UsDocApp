
eHnoteWebApp.controller("EhnoteOpthalmologyCtrl", ["$scope", "$rootScope", "eHnoteConditionsDataService", "datacookieFactory", 'eHnoteMainAppointmentService', "datapersistanceFactory", "eHnoteCacheStorageService", "eHnotePatientDataService", "$timeout", "$filter", 'eHnoteMasterDataService', 'alertify', '$http', "eHnoteSettingsDataService", "$location", 'eHnotePrintService', 'Lightbox', function ($scope, $rootScope, eHnoteConditionsDataService, datacookieFactory, eHnoteMainAppointmentService, datapersistanceFactory, eHnoteCacheStorageService, eHnotePatientDataService, $timeout, $filter, eHnoteMasterDataService, alertify, $http, eHnoteSettingsDataService, $location, eHnotePrintService, Lightbox) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.rightarray = [];
    $scope.show = false;
    $scope.InvestigationDetails = {
        "ocularExamRightOrgan": [],
        "ocularExamLeftOrgan": [],
        "TangentRightOrgan": [],
        "TangentLeftOrgan": [],
        "AutoRightOrgan": [],
        "AutoLeftOrgan": [],
        "LidRightOrgan": [],
        "LidLeftOrgan": [],
        "LashRightOrgan": [],
        "LashLeftOrgan": [],
        "ConjRightOrgan": [],
        "ConjLeftOrgan": [],
        "AntRightOrgan": [],
        "AntLeftOrgan": [],
        "CorRightOrgan": [],
        "CorLeftOrgan": [],
        "LensRightOrgan": [],
        "LensLeftOrgan": [],
        "SlitLamps": [],
        "FundusExams": [],
        "RightEyeRemarks": "",
        "LeftEyeRemarks": "",
        "TonoLeftOrgan": [],
        "TonoRightOrgan": [],
        "AllInvestigations": [],
        "selectedSlitLamp": "",
        "OcularRightRemarks": "",
        "OcularLeftRemarks": "",
        "TangentRightRemarks": "",
        "TangentLeftRemarks": "",
        "PerimetryRightEyeRemarks": "",
        "PerimetryLeftEyeRemarks": "",
        "LidRightRemarks": "",
        "LidLeftRemarks": "",
        "LashRightRemarks": "",
        "LashLeftRemarks": "",
        "ConjRightRemarks": "",
        "ConjLeftRemarks": "",
        "AntRightRemarks": "",
        "AntLeftRemarks": "",
        "CorRightRemarks": "",
        "CorLeftRemarks": "",
        "LensRightRemarks": "",
        "LensLeftRemarks": "",
        "FundLeftRemarks": "",
        "FundRightRemarks": ""
    };
    $scope.AnteriorSegmentArray = [];
    $scope.PosteriorSegmentArray = [];
    $scope.AdditionalInvestgationArray = [];
    $scope.noVitaldisplay = false;
    $scope.mainVisionPrintArray = [];
    $scope.mainColorVisionPrintArray = [];
    $scope.PrintFlagArray = [];
    var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.cacheStorageItem = cacheStorageItem;

    $scope.Consulttype = eHnoteMasterDataService.getconsultType();
    //console.log($scope.Consulttype + "Consulttype");


    $scope.Bmivalue = "";
    $scope.fileReaderSupported = window.FileReader !== null;
    $scope.medicalsForDoctor = [];
    $scope.doctorID = $scope.cacheStorageItem.doctorid;
    $scope.hospitalcd = undefined;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.hospitalcd = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.hospitalid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    }
    $scope.InvestigationDetails.AllInvestigationCategory = [];
    $scope.InvestigationDetails.TempAllInvestigationCategory = [];



    $scope.glassArray = [{
        type: 'Distance',
        RSphere: '',
        RCylinder: '',
        RAxis: '',
        RPrism: '',
        RBase: '',
        RVa: '',
        RAdd: '',
        LSphere: '',
        LCylinder: '',
        LAxis: '',
        LPrism: '',
        LBase: '',
        LVa: '',
        LAdd: ''
    },
    {
        type: 'Near',
        RSphere: '',
        RCylinder: '',
        RAxis: '',
        RPrism: '',
        RBase: '',
        RVa: '',
        LSphere: '',
        LCylinder: '',
        LAxis: '',
        LPrism: '',
        LBase: '',
        LVa: ''
    }
    ];


    $scope.OldglassArray = [{
        type: 'Distance',
        RSphere: '',
        RCylinder: '',
        RAxis: '',
        RPrism: '',
        RBase: '',
        RVa: '',
        RAdd: '',
        LSphere: '',
        LCylinder: '',
        LAxis: '',
        LPrism: '',
        LBase: '',
        LVa: '',
        LAdd: ''
    },
    {
        type: 'Near',
        RSphere: '',
        RCylinder: '',
        RAxis: '',
        RPrism: '',
        RBase: '',
        RVa: '',
        LSphere: '',
        LCylinder: '',
        LAxis: '',
        LPrism: '',
        LBase: '',
        LVa: ''
    }
    ];



    init();

    function init() {
        
    }




    function GetAllInvestigationCategory() {
        var params = {
            "HospitalID": doctorinfo.hospitalID,
            "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserID": doctorinfo.doctorid,
            "ActiveInd": "Y",
            "ShowResultInd": "N",
            "GetAllIndicator": 1,
            "PageSize": 1000,
            "PageNumber": 1
        };
        var count = 5;
        eHnoteSettingsDataService.getInvestigationCategoriesById(params).success(function (data) {
            if (data[0].Categories.length === 0 || data[0].Categories === undefined || data === undefined) {
                $scope.InvestigationDetails.AllInvestigationCategory = [];
            } else {
                angular.forEach(data[0].Categories, function (item, index) {
                    if (item.CategoryId === 1 || item.CategoryId === 2 || item.CategoryId === 3 || item.CategoryId === 4 || item.CategoryId === 5 || item.CategoryId === 6) {
                        item.ActiveIND = "N";
                    } else {
                        item.Opthalmologypageno = count++;
                        item.ShowStamp = "N";
                        item.ShowDiv = "N";
                    }
                });
                $scope.InvestigationDetails.AllInvestigationCategory = [];
                $scope.InvestigationDetails.AllInvestigationCategory = data[0].Categories;
                if ($scope.cacheStorageItem.AllInvestigationCategory !== undefined) {
                    if ($scope.cacheStorageItem.AllInvestigationCategory.length !== 0) {
                        angular.forEach($scope.InvestigationDetails.AllInvestigationCategory, function (item1, index1) {
                            angular.forEach($scope.cacheStorageItem.AllInvestigationCategory, function (item2, index2) {
                                if (item2.CategoryId === item1.CategoryId) {
                                    item1 = item2;
                                }
                            });
                        });
                    }
                }
            }
        }).error(function (error) {
            $scope.InvestigationDetails.AllInvestigationCategory = [];
        });
    }
    function GetAllInvestigations() {
        var params = {
            "HospitalID": doctorinfo.hospitalID,
            "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserID": doctorinfo.doctorid,
            "GetAllIndicator": "1",
            "ActiveInd": "Y",
            "ShowResultInd": "N",
            "SearchText": "",
            "PageNumber": 1,
            "PageSize": 1000
        };
        eHnoteSettingsDataService.getAllInvestigationsbyId(params).success(function (data) {
            if (data.Investigations.length === 0 || data.Investigations === undefined || data === undefined) {
                $scope.InvestigationDetails.AllInvestigations = [];
            } else {
                $scope.InvestigationDetails.AllInvestigations = data.Investigations;
                angular.forEach($scope.InvestigationDetails.AllInvestigations, function (item, index) {
                    item.RightEyeArray = [];
                    item.LeftEyeArray = [];
                    item.RightEyeUndoCount = 0;
                    item.LeftEyeUndoCount = 0;
                    item.LeftEyeCdRatio = "";
                    item.RightEyeCdRatio = "";
                    item.RightEyeFreq = "";
                    item.LeftEyeFreq = "";
                    item.RightEyeEdit = false;
                    item.LeftEyeEdit = false;
                    item.RightPwCanvas = "RightPwCanvas" + item.InvestigationId;
                    item.LeftPwCanvas = "LeftPwCanvas" + item.InvestigationId;
                    item.RightEyeRemarks = "";
                    item.LeftEyeRemarks = "";
                    item.IsSelected = "N";
                    item.IsUndoClicked = false;
                });
                if (cacheStorageItem.AllInvestigations !== undefined) {
                    if (cacheStorageItem.AllInvestigations.length !== 0) {
                        angular.forEach($scope.InvestigationDetails.AllInvestigations, function (item1, index1) {
                            angular.forEach(cacheStorageItem.AllInvestigations, function (item2, index2) {
                                if (item2.InvestigationId === item1.InvestigationId) {
                                    item1 = item2;
                                }
                            });
                        });
                    }
                }
                $scope.$broadcast('callAnteriorAndPosteriorCtrls', $scope.InvestigationDetails.AllInvestigations);
                //$scope.InvestigationDetails.SlitLamps = $filter('filter')($scope.InvestigationDetails.AllInvestigations, { 'CategoryId': 5 }, true);
                //$scope.InvestigationDetails.FundusExams = $filter('filter')($scope.InvestigationDetails.AllInvestigations, { 'CategoryId': 6 }, true);
                $scope.InvestigationDetails.selectedFundInevstigation = "";
                $scope.InvestigationDetails.selectedSlitInevstigation = "";
            }
        }).error(function (error) {
            $scope.InvestigationDetails.AllInvestigations = [];
        });
    }
    function FormArray(array) {
        angular.forEach(array, function (item, index) {
            $scope.InvestigationDetails.AllInvestigations.push(item);
        });
    }
    function GetAllInvestigationsSuccess(resp) {
        $scope.InvestigationDetails.AllInvestigations = resp;
        angular.forEach($scope.InvestigationDetails.SlitLamps, function (item, index) {
            if (index === 0) {
                item.Active = "Y";
            } else {
                item.Active = "N";
            }
        });
    }
    function GetAllInvestigationsError(err) { $scope.InvestigationDetails.AllInvestigations = []; }
    $scope.IsHidden = {};
    $scope.$watch('Opthalmologypageno', function (newValue, oldValue) {
        if (newValue === 3) {
            if ($filter("filter")($scope.InvestigationDetails.AllInvestigations, { "ParentId": $scope.Opthalmologypageno })[0] !== undefined) {
                $scope.ocualrExamInvestigationId = $filter("filter")($scope.InvestigationDetails.AllInvestigations, { "ParentId": $scope.Opthalmologypageno })[0].Id;
            }
        }
        //if (newValue === 6) {
        //    $scope.InvestigationDetails.SlitLamps = $filter("filter")($scope.InvestigationDetails.AllInvestigations, { "ParentId": $scope.Opthalmologypageno });
        //    $scope.InvestigationDetails.SlitLamps[0].Active = "Y";
        //    $scope.InvestigationDetails.selectedSlitLamp = $scope.InvestigationDetails.SlitLamps[0];
        //}
    });
    if (cacheStorageItem.MedicalConditionsArray) {
        $scope.medicalsForDoctor = cacheStorageItem.MedicalConditionsArray;
    }
    function getVitalsHistoryForDoctor() {

        eHnoteConditionsDataService.getPatientVitalsByDoctorId(OnSuccess, OnError);

        function OnSuccess(data) {
            $scope.flglow = false;
            $scope.bpvisible = false;
            $scope.highval = false;
            $scope.lowval = false;
            $scope.spp = false;
            $scope.sft = false;
            $scope.bmiwgtshow = false;
            $scope.bmihgtshow = false;
            $scope.showHcf = false;
            $scope.vitalsForDoctor = data;
            var exitLoop = false;
            $scope.bplowvalue = false;
            if ($scope.lowval || $scope.highval) {
                $scope.bplowvalue = true;
            } else { }
            $scope.sftval = false;
            if ($scope.spp || $scope.sft) {
                $scope.sftval = true;
            } else { }
            $scope.bmihgtwgtshow = false;
            if ($scope.bmihgtshow && $scope.bmiwgtshow) {
                $scope.bmihgtwgtshow = true;
            }
        }

        function OnError(data) {
            alertify.log('Check internet connectivity');
        }
    }
    $scope.Opthalmologypageno = 1;
    $scope.OpthalmologyActiveMenu = function (pageno) {
        return (pageno === $scope.Opthalmologypageno) ? "active" : "";
    };
    $scope.SwitchOpthalmologylPage = function (pageno) {
        $scope.Opthalmologypageno = pageno;
        UpdateInvestigationToCache();
    };
    $scope.MedicalChecked = {};
    $scope.MedicalsActive = function (index) {
        if ($scope.MedicalChecked[index]) {
            $scope.medicalsForDoctor[index].ActiveIND = "Y";
            $scope.medicalsForDoctor[index].risk = "N";
            $scope.MedicalCheckedRisk[index] = false;
        } else {
            $scope.medicalsForDoctor[index].ActiveIND = "N";
        }
        cacheStorageItem.MedicalConditionsArray = [];
        cacheStorageItem.MedicalConditionsArray = $scope.medicalsForDoctor;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    };
    $scope.ClearMedicalNotes = function (index) {
        $scope.medicalsForDoctor[index].notes = "";
        cacheStorageItem.MedicalConditionsArray = [];
        cacheStorageItem.MedicalConditionsArray = $scope.medicalsForDoctor;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    };
    $scope.UpdateMedicalNotes = function (index) {
        cacheStorageItem.MedicalConditionsArray = [];
        cacheStorageItem.MedicalConditionsArray = $scope.medicalsForDoctor;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    };
    $scope.NextClickFromOpthalmology = function () {
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        if ($scope.Opthalmologypageno === 1) {
            $scope.Opthalmologypageno = 2;
            UpdateInvestigationToCache();
            angular.element("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        }
        if ($scope.Opthalmologypageno === 2) {
            $scope.Opthalmologypageno = 3;
            UpdateInvestigationToCache();
            angular.element("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        }
        if ($scope.Opthalmologypageno === 3) {
            $scope.Opthalmologypageno = 4;
            UpdateInvestigationToCache();
            angular.element("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        }
        if ($scope.Opthalmologypageno === 4) {
            $scope.Opthalmologypageno = 5;
            UpdateInvestigationToCache();
            angular.element("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        }


        if ($scope.Opthalmologypageno === 5) {
            $scope.Opthalmologypageno = 6;
            UpdateInvestigationToCache();
            angular.element("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        }
        if ($scope.Opthalmologypageno === 6) {
            $scope.Opthalmologypageno = 7;
            UpdateInvestigationToCache();
            angular.element("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        }

        if ($scope.Opthalmologypageno === 7) {
            if (cacheStorageItem.IsInvestigationMode) {
                $scope.Opthalmologypageno = 1;
            } else {
                UpdateInvestigationToCache();

                if ($scope.cacheStorageItem.IsEasyMode || cacheStorageItem.IsEasyMode) {
                    $scope.ChangeTab(15, 15);
                } else {
                    $scope.ChangeTab(4, 4);
                }

                angular.element("html, body").animate({ scrollTop: 0 }, "slow");
                return false;
            }
        }
    };

    $scope.$on('ClearAllInvImages', function (ev, args) {
        $scope.removeImage("", "", 1, "");
    });
    $scope.$on('investigationToCache', function (ev, args) {
        UpdateInvestigationToCache();
    });
    function checkval(val) {
        return val && val !== "" ? true : false;
    }
    function UpdateInvestigationToCache() {
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        cacheStorageItem.InvestigationDetails = [];
        cacheStorageItem.InvestigationImageUploads = [];
        cacheStorageItem.AllInvestigations = [];
        cacheStorageItem.AllInvestigationCategory = [];
        $scope.cacheStorageItem.InvestigationDetails = [];
        $scope.cacheStorageItem.InvestigationImageUploads = [];
        $scope.cacheStorageItem.AllInvestigationCategory = [];
        $scope.cacheStorageItem.AllInvestigations = [];


        //Vision Data
        var count = 0;
        if ($scope.InvestigationDetails.Htmlvisions.length !== 0) {
            $scope.tempvisions = [];
            angular.forEach($scope.InvestigationDetails.Htmlvisions, function (item1, ind1) {
                if (item1.InvestigationID === 1) {
                    if (checkval(item1.Attributes.NearVision.LeftEye) || checkval(item1.Attributes.NearVision.RightEye) || checkval(item1.Attributes.NearVision.Both) || checkval(item1.Attributes.distanceVision.LeftEye) || checkval(item1.Attributes.distanceVision.RightEye) || checkval(item1.Attributes.distanceVision.Both)) {
                        $scope.tempvisions.push(item1);
                    }
                }

                //if (item1.InvestigationID === 30) {
                //    if (item1.Attributes.RightEye !== "" || item1.Attributes.LeftEye !== "" || item1.Attributes.Both !== "" || item1.Attributes.NearVision !== "") {
                //        $scope.tempvisions.push(item1);
                //    }
                //}


                if (item1.InvestigationID === 30) {

                    if (item1.Attributes) {
                        if (item1.Attributes.NearVision.LeftEye !== "" || item1.Attributes.NearVision.RightEye !== "" || item1.Attributes.NearVision.Both !== "" || item1.Attributes.distanceVision.LeftEye !== "" || item1.Attributes.distanceVision.RightEye !== "" || item1.Attributes.distanceVision.Both !== "") {
                            $scope.tempvisions.push(item1);
                        }
                    }
                }
                if (item1.InvestigationID === 2) {
                    if (item1.Attributes.RightEye !== "" || item1.Attributes.LeftEye !== "") {
                        $scope.tempvisions.push(item1);
                    }
                }
                if (item1.InvestigationID === 3 || item1.InvestigationID === 4) {
                    $scope.tempInvestigationOrgans = [];
                    angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
                        if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "") {
                            $scope.tempInvestigationOrgans.push(item2);
                        }
                    });
                    if ($scope.tempInvestigationOrgans.length !== 0) {
                        $scope.tempvisions.push(item1);
                    }
                }
                if (item1.InvestigationID === 11) {
                    $scope.tempInvestigationOrgans = [];
                    angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
                        if (item2.InvestigationAttributes.HorizontalAxis !== "" || item2.InvestigationAttributes.VerticalAxis !== "" || item2.InvestigationAttributes.HorizontalNewAxis !== "" || item2.InvestigationAttributes.VerticalNewAxis !== "") {
                            $scope.tempInvestigationOrgans.push(item2);
                        }
                    });
                    if ($scope.tempInvestigationOrgans.length !== 0) {
                        $scope.tempvisions.push(item1);
                    }
                }
                if (item1.InvestigationID === 5 || item1.InvestigationID === 6 || item1.InvestigationID === 10) {
                    $scope.tempInvestigationOrgans = [];
                    angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
                        if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "") {
                            $scope.tempInvestigationOrgans.push(item2);
                        }
                    });
                    if ($scope.tempInvestigationOrgans.length !== 0) {
                        $scope.tempvisions.push(item1);
                    }
                }
                if (item1.InvestigationID === 7) {
                    if (checkval(item1.Attributes.NearVision.LeftEye) || checkval(item1.Attributes.NearVision.RightEye) || checkval(item1.Attributes.NearVision.Both) || checkval(item1.Attributes.distanceVision.LeftEye) || checkval(item1.Attributes.distanceVision.RightEye) || checkval(item1.Attributes.distanceVision.Both)) {
                        $scope.tempvisions.push(item1);
                    }
                }
                if (item1.InvestigationID === 8) {
                    $scope.tempInvestigationOrgans = [];
                    angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
                        if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "") {
                            $scope.tempInvestigationOrgans.push(item2);
                        }
                    });
                    if ($scope.tempInvestigationOrgans.length !== 0) {
                        $scope.tempvisions.push(item1);
                    }
                }
                if (item1.InvestigationID === 9) {
                    //if (item1.Attributes.RightEye !== "" || item1.Attributes.LeftEye !== "" || item1.Attributes.NotesLeftEye !== "" || item1.Attributes.NotesRightEye !== "") {
                    //    $scope.tempvisions.push(item1);
                    //}
                    if (item1.Value !== "") {
                        $scope.tempvisions.push(item1);
                    }
                }
            });
            if ($scope.tempvisions.length !== 0) {
                $scope.cacheStorageItem.visions = $scope.tempvisions;
                object = {
                    "RowID": count++,
                    "CategoryID": 1,
                    "CategoryDesc": "Vision",
                    "CategoryConditions": $scope.tempvisions
                };
                $scope.cacheStorageItem.InvestigationDetails.push(object);
            }
        }
        //ColorVision Data 
        if ($scope.InvestigationDetails.colorvisions.length !== 0) {
            $scope.Tempcolorvisions = [];
            angular.forEach($scope.InvestigationDetails.colorvisions, function (item2, ind2) {
                if (item2.InvestigationNote !== "") {
                    $scope.Tempcolorvisions.push(item2);
                }
            });
            if ($scope.Tempcolorvisions.length !== 0) {
                object = {
                    "RowID": count++,
                    "CategoryID": 2,
                    "CategoryDesc": "Colour Vision Test",
                    "CategoryConditions": $scope.Tempcolorvisions
                };
                $scope.cacheStorageItem.colorvisions = $scope.InvestigationDetails.colorvisions;
                $scope.cacheStorageItem.InvestigationDetails.push(object);
            }
        }
        //OcularMotility Data
        if ($scope.InvestigationDetails.ocularmotility && $scope.InvestigationDetails.ocularmotility.length !== 0) {
            $scope.cacheStorageItem.ocularmotility = $scope.InvestigationDetails.ocularmotility;
            object = {
                "RowID": count++,
                "CategoryID": 3,
                "CategoryDesc": "Ocular Motility",
                "CategoryConditions": []
            };
            $scope.TempRighteyePositionValues = [];
            var rightvaluecount = 0;
            if ($scope.InvestigationDetails.ocularmotility[0] !== undefined) {
                angular.forEach($scope.InvestigationDetails.ocularmotility[0].OcularPositionValues, function (item2, ind2) {
                    if (item2.Value !== "") {
                        rightvaluecount++;
                        //$scope.TempRighteyePositionValues.push(item2);
                    }
                    if (rightvaluecount > 0) {
                        $scope.TempRighteyePositionValues.push(item2);
                    }



                });
                if ($scope.TempRighteyePositionValues.length !== 0 || $scope.InvestigationDetails.ocularmotility[0].Notes !== "") {
                    var RightEyeObject = {
                        "RowID": 1,
                        "InvestigationAttributeID": 1,
                        "InvestigationAttributeDesc": "RightEye",
                        "Notes": $scope.InvestigationDetails.ocularmotility[0].Notes,
                        "OcularPositionValues": $scope.TempRighteyePositionValues
                    };
                    object.CategoryConditions.push(RightEyeObject);
                }
            }

            $scope.TempLefteyePositionValues = [];
            var leftvaluecount = 0;

            if ($scope.InvestigationDetails.ocularmotility[1] !== undefined) {
                angular.forEach($scope.InvestigationDetails.ocularmotility[1].OcularPositionValues, function (item2, ind2) {
                    if (item2.Value !== "") {
                        leftvaluecount++;
                        //$scope.TempLefteyePositionValues.push(item2);
                    }

                    if (leftvaluecount > 0) {
                        $scope.TempLefteyePositionValues.push(item2);
                    }


                });
                if ($scope.TempLefteyePositionValues.length !== 0 || $scope.InvestigationDetails.ocularmotility[1].Notes !== "") {
                    var LeftEyeObject = {
                        "RowID": 2,
                        "InvestigationAttributeID": 2,
                        "InvestigationAttributeDesc": "LeftEye",
                        "Notes": $scope.InvestigationDetails.ocularmotility[1].Notes,
                        "OcularPositionValues": $scope.TempLefteyePositionValues
                    };
                    object.CategoryConditions.push(LeftEyeObject);
                }
            }

            if (object.CategoryConditions.length !== 0) {
                $scope.cacheStorageItem.InvestigationDetails.push(object);
            }
        }
        //Tonometry Data
        if ($scope.InvestigationDetails.TonoMetry.length !== 0) {
            $scope.cacheStorageItem.TonoMetry = $scope.InvestigationDetails.TonoMetry;
            $scope.TempTonoMetry = [];
            angular.forEach($scope.InvestigationDetails.TonoMetry, function (item2, ind2) {
                if (ind2 === 0 || ind2 === 1 || ind2 === 2) {
                    if (item2.InvestigationAttributeValues.RightEye !== "" || item2.InvestigationAttributeValues.LeftEye !== "" || item2.InvestigationAttributeValues.Time !== "") {
                        $scope.TempTonoMetry.push(item2);
                    }
                } else {
                    if (item2.Value !== "") {
                        $scope.TempTonoMetry.push(item2);
                    }
                }
            });
            if ($scope.TempTonoMetry.length !== 0) {
                object = {
                    "RowID": count++,
                    "CategoryID": 4,
                    "CategoryDesc": "Tonometry Test",
                    "CategoryConditions": $scope.TempTonoMetry
                };
                $scope.cacheStorageItem.InvestigationDetails.push(object);
            }
        }

        //Anterior Segment Data
        var object = {};
        if ($scope.InvestigationDetails.SlitLamps.length !== 0) {
            object = {
                "RowID": count++,
                "CategoryID": 5,
                "CategoryDesc": "Anterior Segment",
                "CategoryConditions": []
            };
            angular.forEach($scope.InvestigationDetails.SlitLamps, function (item1, index1) {
                //if (item1.RightEyeArray.length !== 0 || item1.LeftEyeArray.length !== 0 || item1.RightEyeRemarks !== "" || item1.LeftEyeRemarks !== "" || item1.RightEyeCdRatio !== "" || item1.LeftEyeCdRatio !== "" || item1.RightEyeFreq !== '' || item1.LeftEyeFreq !== '' || item1.IsNormalR || item1.IsNormalL) {
                //    object.CategoryConditions.push(item1);
                //}

                if ((item1.RightEyeArray && item1.RightEyeArray.length !== 0) || (item1.LeftEyeArray && item1.LeftEyeArray.length !== 0) || item1.RightEyeRemarks !== "" || item1.LeftEyeRemarks !== "" || item1.RightEyeCdRatio !== "" || item1.LeftEyeCdRatio !== "" || item1.RightEyeFreq !== '' || item1.LeftEyeFreq !== '' || item1.IsNormalR || item1.IsNormalL) {
                    object.CategoryConditions.push(item1);
                }
            });
            if (object.CategoryConditions.length !== 0) {
                $scope.cacheStorageItem.InvestigationDetails.push(object);
            }
            var Count = $filter("filter")(object.CategoryConditions, { "IsSelected": "Y" }).length;
            if (Count === 0) {
                $scope.InvestigationDetails.selectedSlitInevstigation = "";
            }
        }

        // Posterior Segment Segment Data
        if ($scope.InvestigationDetails.FundusExams.length !== 0) {
            object = {
                "RowID": count++,
                "CategoryID": 6,
                "CategoryDesc": "Posterior Segment",
                "CategoryConditions": []
            };
            angular.forEach($scope.InvestigationDetails.FundusExams, function (item1, index1) {
                if (item1.RightEyeArray.length !== 0 || item1.LeftEyeArray.length !== 0 || item1.RightEyeRemarks !== "" || item1.LeftEyeRemarks !== "" || item1.RightEyeCdRatio !== "" || item1.LeftEyeCdRatio !== "" || item1.RightEyeFreq !== '' || item1.LeftEyeFreq !== '' || item1.IsNormalR || item1.IsNormalL) {
                    object.CategoryConditions.push(item1);
                }
            });
            if (object.CategoryConditions.length !== 0) {
                $scope.cacheStorageItem.InvestigationDetails.push(object);
            }
            var Count = $filter("filter")(object.CategoryConditions, { "IsSelected": "Y" }).length;
            if (Count === 0) {
                $scope.InvestigationDetails.selectedFundInevstigation = "";
            }
        }
        //Additional Investigation Data        
        if ($scope.InvestigationDetails.AllInvestigations.length !== 0) {
            $scope.cacheStorageItem.AllInvestigationCategory = $scope.InvestigationDetails.AllInvestigationCategory;
            $scope.cacheStorageItem.AllInvestigations = $scope.InvestigationDetails.AllInvestigations;
            angular.forEach($scope.InvestigationDetails.AllInvestigationCategory, function (item, index) {
                if (item.CategoryId === 1 || item.CategoryId === 2 || item.CategoryId === 3 || item.CategoryId === 4 || item.CategoryId === 5 || item.CategoryId === 6) {
                } else {
                    var InvestigationsArray = $filter("filter")($scope.InvestigationDetails.AllInvestigations, { 'CategoryId': item.CategoryId }, true);
                    object = {
                        "RowID": count++,
                        "CategoryID": item.CategoryId,
                        "CategoryDesc": item.CategoryName,
                        "CategoryConditions": []
                    };
                    angular.forEach(InvestigationsArray, function (item1, index1) {
                        if (item1.RightEyeArray.length !== 0 || item1.LeftEyeArray.length !== 0 || item1.RightEyeRemarks !== "" || item1.LeftEyeRemarks !== "" || item1.RightEyeCdRatio !== "" || item1.LeftEyeCdRatio !== "" || item1.RightEyeFreq !== '' || item1.LeftEyeFreq !== '' || item1.IsNormalR || item1.IsNormalL) {
                            object.CategoryConditions.push(item1);
                        }
                    });
                    if (object.CategoryConditions.length !== 0) {
                        $scope.cacheStorageItem.InvestigationDetails.push(object);
                    }
                }

            });
        }

        $scope.glassFlag = false;

        console.log(JSON.stringify(cacheStorageItem.PatientEyeGlassItems));
        if (cacheStorageItem.PatientEyeGlassItems != "") {
            if (cacheStorageItem.PatientEyeGlassItems.length != 0) {
                angular.forEach(cacheStorageItem.PatientEyeGlassItems, function (item, index) {
                    if (item.RSphere == "" && item.RCylinder == "" && item.RAxis == "" && item.RPrism == "" && item.RBase == "" && item.RVa == "" && item.RAdd == "" && item.LSphere == "" && item.LCylinder == "" && item.LAxis == "" && item.LCylinder == "" && item.LPrism == ""
                        && item.LBase == "" && item.LVa == "" && item.LAdd == "") {
                        $scope.glassFlag = true;
                    }

                });
            }


        }



        cacheStorageItem.InvestigationDetails = $scope.cacheStorageItem.InvestigationDetails;
        cacheStorageItem.InvestigationImageUploads = $scope.cacheStorageItem.InvestigationImageUploads;
        cacheStorageItem.AllInvestigations = $scope.cacheStorageItem.AllInvestigationCategory;
        cacheStorageItem.AllInvestigationCategory = $scope.cacheStorageItem.AllInvestigations;




        cacheStorageItem.visions = $scope.cacheStorageItem.visions;
        cacheStorageItem.colorvisions = $scope.cacheStorageItem.colorvisions;
        cacheStorageItem.ocularmotility = $scope.cacheStorageItem.ocularmotility;
        cacheStorageItem.TonoMetry = $scope.cacheStorageItem.TonoMetry;
        //   cacheStorageItem.PatientEyeGlassItems = $scope.cacheStorageItem.PatientEyeGlassItems;
        $scope.glassArray = cacheStorageItem.PatientEyeGlassItems;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);


    }
    $scope.showloading = true;
    $scope.focusNext = function (val) {
        var value = /^\d{3}$/;
        if (value.test(val)) {
            angular.element(event.target).next().focus().select();
        }
    };
    $scope.VitalClick = function (key) {
        $scope.hidethis = false;
    };
    if ($scope.cacheStorageItem.appObjectCollection) {
        $scope.Notes.appObjectCollection = $scope.cacheStorageItem.appObjectCollection;
    }
    $scope.addEmptyRecord = function () {
        var str = "";
    };
    if ($scope.Notes.appObjectCollection !== undefined) {
        if ($scope.Notes.appObjectCollection.VisitReason.length === 0) {
            $scope.addEmptyRecord();
        }
    }
    var listParams = {
        "DoctorID": $scope.doctorID,
        "HospitalCD": $scope.hospitalcd,
        "USRType": "DOCTOR",
        "PageSize": 10,
        "PageNumber": 1,
        "PageType": "TRTMNT",
        "USRId": $scope.doctorID
    };
    $(document).on('click', '.browse', function () {
        var file = $(this).parent().parent().parent().find('.file');
        file.trigger('click');
    });
    $(document).on('change', '.file', function () {
        $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
    });
    $scope.toDataURL = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    };
    $scope.changeInvestigation = function (selectedInevstigation) {
        if (selectedInevstigation === null) {
            return;
        }
        var index = -1;
        $scope.InvestigationDetails.AllInvestigations.some(function (obj, i) {
            return obj.InvestigationId === selectedInevstigation.InvestigationId ? index = i : false;
        });
        if (selectedInevstigation.IsSelected === "Y") {
            alertify.error("Already " + selectedInevstigation.Investigation + " Selected");
        } else {
            $scope.InvestigationDetails.AllInvestigations[index].IsSelected = "Y";
            $scope.InvestigationDetails.AllInvestigations[index].IsNormalR = false;
            $scope.InvestigationDetails.AllInvestigations[index].IsNormalL = false;
        }
    };
    $scope.removeInvestigation = function (item, type) {
        r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this Investigation ? ", function () {


            //Reset All Item Data

            item.RightEyeRemarks = "";
            item.LeftEyeRemarks = "";
            item.IsNormalR = false;
            item.IsNormalL = false;
            item.RightEyefileName = "";
            item.LeftEyefileName = "";
            item.RightEyeCdRatio = "";
            item.LeftEyeCdRatio = "";
            item.RightEyeFreq = "";
            item.LeftEyeFreq = "";
            item.RightEyeUndoCount = 0;
            item.LeftEyeUndoCount = 0;


            if (item.RightEyeArray.length > 0) {
                angular.forEach(item.RightEyeArray, function (item1, index) {
                    var req = {
                        "DocumentID": item1.DocumentId,
                        "AppointmentID": $scope.cacheStorageItem.appointmentid,
                        "DeleteIndicator": 0
                    };
                    eHnotePatientDataService.DeletePatientInvImg(req).then(function (resp) { console.log(resp); }, function (err) { console.log(err); });
                });
            }
            if (item.LeftEyeArray.length > 0) {
                angular.forEach(item.RightEyeArray, function (item1, index) {
                    var req = {
                        "DocumentID": item1.DocumentId,
                        "AppointmentID": $scope.cacheStorageItem.appointmentid,
                        "DeleteIndicator": 0
                    };
                    eHnotePatientDataService.DeletePatientInvImg(req).then(function (resp) { console.log(resp); }, function (err) { console.log(err); });
                });
            }
            item.RightEyeArray = [];
            item.LeftEyeArray = [];
            item.IsSelected = "N";



            if (type === "Anterior") {
                var AnteriorCount = $filter("filter")($scope.InvestigationDetails.SlitLamps, { 'IsSelected': 'Y' });
                if (AnteriorCount.length === 0) {
                    $scope.InvestigationDetails.selectedSlitInevstigation = "";
                }
            }


            if (type === "Posterior") {
                var PosteriorCount = $filter("filter")($scope.InvestigationDetails.FundusExams, { 'IsSelected': 'Y' });
                if (PosteriorCount.length === 0) {
                    $scope.InvestigationDetails.selectedFundInevstigation = "";
                }
            }
            //var index = -1;
            //$scope.InvestigationDetails.AllInvestigations.some(function (obj, i) {
            //    return obj.InvestigationId === item.InvestigationId ? index = i : false;
            //});
            //$scope.InvestigationDetails.AllInvestigations[index].IsSelected = "N";
            //  $scope.selectedInevstigation = $scope.InvestigationDetails.AllInvestigations[0];
            //$scope.selectedInevstigation = "";
        });
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.cacheStorageItem.AllInvestigations = $scope.InvestigationDetails.AllInvestigations;
        cacheStorageItem.AllInvestigations = $scope.cacheStorageItem.AllInvestigationCategory;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    };
    $scope.removeImage = function (subitem, type, DeleteIndicator, ParentItem) {
        var req = {
            //"DocumentID": subitem.DocumentId,
            "AppointmentID": $scope.cacheStorageItem.appointmentid,
            "DeleteIndicator": DeleteIndicator,
            //"FileName": subitem.DocURL.substring(subitem.DocURL.lastIndexOf('/') + 1),
            //"ImagesArray": [{ "DocumentID": 123, "FileName": "abc" }, { "DocumentID": 123, "FileName": "abc" }]
            "ImagesArray": []
        };
        if (DeleteIndicator === 0) {//Single Image Deletion
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                req.ImagesArray.push({ "DocumentID": subitem.DocumentId, "FileName": subitem.DocURL.substring(subitem.DocURL.lastIndexOf('/') + 1) });
                removeImage(subitem.DocumentId, type, req, ParentItem);
            }, function () {
                return;
            });
        } else { //Multiple Image Deletion
            if ($scope.InvestigationDetails.AllInvestigations.length !== 0) {
                angular.forEach($scope.InvestigationDetails.AllInvestigations, function (item, index) {
                    if (item.RightEyeArray.length !== 0) {
                        angular.forEach(item.RightEyeArray, function (item1, index1) {
                            req.ImagesArray.push({
                                "DocumentID": item1.DocumentId,
                                "FileName": item1.DocURL.substring(item1.DocURL.lastIndexOf('/') + 1)
                            });
                        });
                    }
                    if (item.LeftEyeArray.length !== 0) {
                        angular.forEach(item.LeftEyeArray, function (item1, index1) {
                            req.ImagesArray.push({
                                "DocumentID": item1.DocumentId,
                                "FileName": item1.DocURL.substring(item1.DocURL.lastIndexOf('/') + 1)
                            });
                        });
                    }
                });
            }
            if ($scope.InvestigationDetails.SlitLamps.length !== 0) {
                angular.forEach($scope.InvestigationDetails.SlitLamps, function (item, index) {
                    if (item.RightEyeArray.length !== 0) {
                        angular.forEach(item.RightEyeArray, function (item1, index1) {
                            req.ImagesArray.push({
                                "DocumentID": item1.DocumentId,
                                "FileName": item1.DocURL.substring(item1.DocURL.lastIndexOf('/') + 1)
                            });
                        });
                    }
                    if (item.LeftEyeArray.length !== 0) {
                        angular.forEach(item.LeftEyeArray, function (item1, index1) {
                            req.ImagesArray.push({
                                "DocumentID": item1.DocumentId,
                                "FileName": item1.DocURL.substring(item1.DocURL.lastIndexOf('/') + 1)
                            });
                        });
                    }
                });
            }
            if ($scope.InvestigationDetails.FundusExams.length !== 0) {
                angular.forEach($scope.InvestigationDetails.FundusExams, function (item, index) {
                    if (item.RightEyeArray.length !== 0) {
                        angular.forEach(item.RightEyeArray, function (item1, index1) {
                            req.ImagesArray.push({
                                "DocumentID": item1.DocumentId,
                                "FileName": item1.DocURL.substring(item1.DocURL.lastIndexOf('/') + 1)
                            });
                        });
                    }
                    if (item.LeftEyeArray.length !== 0) {
                        angular.forEach(item.LeftEyeArray, function (item1, index1) {
                            req.ImagesArray.push({
                                "DocumentID": item1.DocumentId,
                                "FileName": item1.DocURL.substring(item1.DocURL.lastIndexOf('/') + 1)
                            });
                        });
                    }
                });
            }

            if (req.ImagesArray.length !== 0) {
                removeImage(subitem.DocumentId, type, req, ParentItem);
            }



        }
    };

    function removeImage(docid, type, req, ParentItem) {
        eHnotePatientDataService.DeletePatientInvImg(req).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (type !== "") {
                    var ind = -1;
                    if (type === "Right") {
                        ParentItem.RightEyeArray.some(function (obj, i) {
                            return obj.DocumentId === docid ? ind = i : false;
                        });
                        ParentItem.RightEyeArray.splice(ind, 1);
                        ParentItem.RightEyefileName = "";
                        alertify.success("Image Deleted Successfully");
                    }
                    if (type === "Left") {
                        ParentItem.LeftEyeArray.some(function (obj, i) {
                            return obj.DocumentId === docid ? ind = i : false;
                        });
                        ParentItem.LeftEyeArray.splice(ind, 1);
                        ParentItem.LeftEyefileName = "";
                        alertify.success("Image Deleted Successfully");
                    }
                }
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    }
    $scope.FileChange = function (files, type, item) {
        if (type === "Right") {
            if (files !== null) {
                file = files[0];
                item.RightEyefileName = file.name;
                item.ContentType = file.type;
                $scope.RightEyefileName = file.name;
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function () {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function (e) {
                            item.thumbnailRightEye = '';
                            item.RightEyediv = true;
                            $timeout(function () {
                                item.thumbnailRightEye = e.target.result;
                            });
                        };
                    });
                }
            }
        }
        if (type === "Left") {
            if (files !== null) {
                file = files[0];
                item.LeftEyefileName = file.name;
                item.ContentType = file.type;
                $scope.LeftEyefileName = file.name;
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function () {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function (e) {
                            item.thumbnailLeftEye = '';
                            item.LeftEyediv = true;
                            $timeout(function () {
                                item.thumbnailLeftEye = e.target.result;
                            });
                        };
                    });
                }
            }
        }
    };



    $scope.savecanvas = function (type, item) {
        if (type === "Right") {
            item.RightEyediv = false;
            var canvas = document.getElementById(item.RightPwCanvas);
            var dataURL = canvas.toDataURL();
            var object = {
                "USRId": $scope.cacheStorageItem.USRId,
                "HospitalID": doctorinfo.hospitalID,
                "PatientID": $scope.cacheStorageItem.patientid,
                //"ConsultationID": eHnoteMasterDataService.getConsultAndPatientVisitId().CosultaionId,
                "AppointmentID": $scope.cacheStorageItem.appointmentid,
                "CategoryID": item.CategoryId,
                "InvestigationID": item.InvestigationId,
                "OrganID": 1,
                "Base64": dataURL,
                "FileName": item.RightEyefileName,
                "DocumentID": 0,
                "ContentType": item.ContentType
            };
            eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
                var result = resp.data[0];
                //result.Base64 = dataURL;
                item.RightEyeArray.push(result);
                alertify.success("Image Uploaded Successfully");
                item.thumbnailRightEye = "";
                item.RightEyeUndoCount = 0;
                $scope.RightEyefileName = "";
            }, function (err) {
                alertify.error(err.Messege);
            });
        }
        if (type === "Left") {
            item.LeftEyediv = false;
            var canvas = document.getElementById(item.LeftPwCanvas);
            var dataURL = canvas.toDataURL();
            var object = {
                "USRId": $scope.cacheStorageItem.USRId,
                "HospitalID": doctorinfo.hospitalID,
                "PatientID": $scope.cacheStorageItem.patientid,
                //"ConsultationID": eHnoteMasterDataService.getConsultAndPatientVisitId().CosultaionId,
                "AppointmentID": $scope.cacheStorageItem.appointmentid,
                "CategoryID": item.CategoryId,
                "InvestigationID": item.InvestigationId,
                "OrganID": 2,
                "Base64": dataURL,
                "FileName": item.LeftEyefileName,
                "DocumentID": 0,
                "ContentType": item.ContentType
            };
            eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
                var result = resp.data[0];
                //result.Base64 = dataURL;
                item.LeftEyeArray.push(result);
                alertify.success("Image Uploaded Successfully");
                item.thumbnailLeftEye = "";
                item.LeftEyeUndoCount = 0;
                $scope.LeftEyefileName = "";
            }, function (err) {
                alertify.error(err.Messege);
            });
        }
    };
    $scope.updatecanvas = function (type, item) {
        if (type === "Right") {
            item.RightEyeEdit = false;
            item.RightEyediv = false;
            var canvas = document.getElementById(item.RightPwCanvas);
            var dataURL = canvas.toDataURL();
            var object = {
                "USRId": $scope.cacheStorageItem.USRId,
                "HospitalID": doctorinfo.hospitalID,
                "PatientID": $scope.cacheStorageItem.patientid,
                //"ConsultationID": eHnoteMasterDataService.getConsultAndPatientVisitId().CosultaionId,
                "AppointmentID": $scope.cacheStorageItem.appointmentid,
                "CategoryID": item.CategoryId,
                "InvestigationID": item.InvestigationId,
                "OrganID": 1,
                "Base64": dataURL,
                "FileName": item.RightOrganDocUrl.substring(item.RightOrganDocUrl.lastIndexOf('/') + 1),
                "DocumentID": item.RightOrganDocId,
                "ContentType": item.ContentType
            };
            eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
                var ind = -1;
                item.RightEyeArray.some(function (obj, i) {
                    return obj.DocumentId === item.RightOrganDocId ? ind = i : false;
                });
                var result = resp.data[0];
                //result.Base64 = dataURL;
                item.RightEyeArray[ind] = result;
                item.RightOrganDocId = 0;
                item.thumbnailRightEye = "";
                item.RightEyeUndoCount = 0;
                $scope.RightEyefileName = "";
                alertify.success("Image Updated Successfully");
            }, function (err) {
                alertify.error(err.Messege);
            });
        }
        if (type === "Left") {
            item.LeftEyeEdit = false;
            item.LeftEyediv = false;
            var canvas = document.getElementById(item.LeftPwCanvas);
            var dataURL = canvas.toDataURL();
            var object = {
                "USRId": $scope.cacheStorageItem.USRId,
                "HospitalID": doctorinfo.hospitalID,
                "PatientID": $scope.cacheStorageItem.patientid,
                //"ConsultationID": eHnoteMasterDataService.getConsultAndPatientVisitId().CosultaionId,
                "AppointmentID": $scope.cacheStorageItem.appointmentid,
                "CategoryID": item.CategoryId,
                "InvestigationID": item.InvestigationId,
                "OrganID": 2,
                "Base64": dataURL,
                "FileName": item.LeftOrganDocUrl.substring(item.LeftOrganDocUrl.lastIndexOf('/') + 1),
                "DocumentID": item.LeftOrganDocId,
                "ContentType": item.ContentType
            };
            eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
                var ind = -1;
                item.LeftEyeArray.some(function (obj, i) {
                    return obj.DocumentId === item.LeftOrganDocId ? ind = i : false;
                });
                var result = resp.data[0];
                //result.Base64 = dataURL;
                item.LeftEyeArray[ind] = result;
                item.LeftOrganDocId = 0;
                item.thumbnailLeftEye = "";
                item.LeftEyeUndoCount = 0;
                $scope.LeftEyefileName = "";
                alertify.success("Image Updated Successfully");
            }, function (err) {
                alertify.error(err.Messege);
            });
        }
    };
    $scope.undoEyeCount = function (item, type) {

        item.IsUndoClicked = true;

        if (type === "Right") {
            item.RightEyeUndoCount--;
        }
        if (type === "Left") {
            item.LeftEyeUndoCount--;
        }
    };
    $scope.syncImages = function (type, item) {
        if (type === "Right") {
            var req = {
                //"ConsultationId": $scope.cacheStorageItem.ConsultationID,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "CategoryId": item.CategoryId,
                //"InvestigationId": item.InvestigationId,
                "InvestigationID": item.InvestigationId,
                "OrganId": 1
            };
            eHnotePatientDataService.GetPatientInvestigationImages(req).then(function (resp) {
                if (resp.data.length === 0) {
                    alertify.log("No Images Found");
                } else {
                    item.RightEyeArray = resp.data;
                }
            }, function (err) {
                alertify.error(err.Messege);
            });
        }
        if (type === "Left") {
            var req = {
                //"ConsultationId": $scope.cacheStorageItem.ConsultationID,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "CategoryId": item.CategoryId,
                // "InvestigationId": item.InvestigationId,
                "InvestigationID": item.InvestigationId,
                "OrganId": 2
            };
            eHnotePatientDataService.GetPatientInvestigationImages(req).then(function (resp) {
                if (resp.data.length === 0) {
                    alertify.log("No Images Found");
                } else {
                    item.LeftEyeArray = resp.data;
                }
            }, function (err) {
                alertify.error(err.Messege);
            });
        }
    };
    $scope.GetTemplate = function (type, item) {
        if (type === "Right") {
            if (item.RightTemplateUrl !== "") {
                item.RightOrganDocUrl = item.RightTemplateUrl;
                item.RightEyefileName = item.RightTemplateUrl.substring(item.LeftTemplateUrl.lastIndexOf('/') + 1);
                $('#maineHnoteLoader').show();
                $scope.toDataURL(item.RightTemplateUrl, function (dataURL) {
                    item.RightEyediv = true;
                    item.thumbnailRightEye = dataURL;
                    $('#maineHnoteLoader').hide();
                });
            }
            //var req = {
            //    "USRType": "DOCTOR",
            //    "USRId": $scope.cacheStorageItem.USRId,
            //    "HospitalId": doctorinfo.hospitalID,
            //    "PatientID": $scope.cacheStorageItem.patientid,
            //    "ConsultationId": $scope.cacheStorageItem.ConsultationID,
            //    //"InvestigationId": item.InvestigationId,
            //    //"CategoryId": item.CategoryId,
            //    "CategoryID": item.CategoryId,
            //    "InvestigationID": item.InvestigationId,
            //    "OrganId": 1
            //};
            //eHnotePatientDataService.GetAllInvestigationTemplates(req).then(function (resp) {
            //    var response = resp.data[0];
            //    item.RightOrganDocUrl = response.S3URL;
            //    item.RightEyefileName = response.S3URL.substring(response.S3URL.lastIndexOf('/') + 1);
            //    $('#maineHnoteLoader').show();
            //    $scope.toDataURL(response.S3URL, function (dataURL) {
            //        item.RightEyediv = true;
            //        item.thumbnailRightEye = dataURL;
            //        $('#maineHnoteLoader').hide();
            //    });
            //}, function (err) {
            //    alertify.error(err.data.Message);
            //});
        }
        if (type === "Left") {
            if (item.LeftTemplateUrl !== "") {
                item.LeftOrganDocUrl = item.LeftTemplateUrl;
                item.LeftEyefileName = item.LeftTemplateUrl.substring(item.LeftTemplateUrl.lastIndexOf('/') + 1);
                $('#maineHnoteLoader').show();
                $scope.toDataURL(item.LeftTemplateUrl, function (dataURL) {
                    item.LeftEyediv = true;
                    item.thumbnailLeftEye = dataURL;
                    $('#maineHnoteLoader').hide();
                });
            }
            //var req = {
            //    "USRType": "DOCTOR",
            //    "USRId": $scope.cacheStorageItem.USRId,
            //    "HospitalId": doctorinfo.hospitalID,
            //    "PatientID": $scope.cacheStorageItem.patientid,
            //    "ConsultationId": $scope.cacheStorageItem.ConsultationID,
            //    //"InvestigationId": item.InvestigationId,
            //    //"CategoryId": item.CategoryId,
            //    "CategoryID": item.CategoryId,
            //    "InvestigationID": item.InvestigationId,
            //    "OrganId": 2
            //};
            //eHnotePatientDataService.GetAllInvestigationTemplates(req).then(function (resp) {
            //    var response = resp.data[0];
            //    item.LeftOrganDocUrl = response.S3URL;
            //    item.LeftEyefileName = response.S3URL.substring(response.S3URL.lastIndexOf('/') + 1);
            //    $('#maineHnoteLoader').show();
            //    $scope.toDataURL(response.S3URL, function (dataURL) {
            //        item.LeftEyediv = true;
            //        item.thumbnailLeftEye = dataURL;
            //        $('#maineHnoteLoader').hide();
            //    });
            //}, function (err) {
            //    alertify.error(err.data.Message);
            //});
        }
    };
    $scope.EditImage = function (parentItem, childItem, type) {
        if (type === "Right") {
            $scope.RightEyefileName = childItem.DocURL.substring(childItem.DocURL.lastIndexOf('/') + 1);
            parentItem.RightOrganDocId = childItem.DocumentId;
            parentItem.RightOrganDocUrl = childItem.DocURL;
            $('#maineHnoteLoader').show();
            $scope.toDataURL(childItem.DocURL, function (dataURL) {
                parentItem.RightEyediv = true;
                parentItem.RightEyeEdit = true;
                parentItem.thumbnailRightEye = dataURL;
                $timeout(function () {
                    $('#maineHnoteLoader').hide();
                }, 200);
            });
            parentItem.RightEyeUndoCount = 0;
        }
        if (type === "Left") {
            $scope.LeftEyefileName = childItem.DocURL.substring(childItem.DocURL.lastIndexOf('/') + 1);
            parentItem.LeftOrganDocId = childItem.DocumentId;
            parentItem.LeftOrganDocUrl = childItem.DocURL;
            $('#maineHnoteLoader').show();
            $scope.toDataURL(childItem.DocURL, function (dataURL) {
                parentItem.LeftEyediv = true;
                parentItem.LeftEyeEdit = true;
                parentItem.thumbnailLeftEye = dataURL;
                $timeout(function () {
                    $('#maineHnoteLoader').hide();
                }, 200);
            });
            parentItem.LeftEyeUndoCount = 0;
        }
    };

    $scope.FilteredInvestigations = [];

    $scope.addCategory = function (item) {
        angular.forEach($scope.InvestigationDetails.AllInvestigationCategory, function (item, index) {
            item.ShowDiv = "N";
        });
        item.ShowStamp = "Y";
        item.ShowDiv = "Y";
        $scope.FilteredInvestigations = $filter("filter")($scope.InvestigationDetails.AllInvestigations, { "CategoryId": item.CategoryId }, true);
    };
    $scope.removeCategory = function (item) {
        r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this Investigation ? ", function () {
            var showedarray = $filter("filter")($scope.InvestigationDetails.AllInvestigationCategory, { 'ShowStamp': 'Y' });
            var currentindex = -1;
            showedarray.some(function (obj, i) {
                return obj.CategoryId === item.CategoryId ? currentindex = i : false;
            });
            var previousobject = showedarray[(currentindex - 1)];
            var nextobject = showedarray[(currentindex + 1)];
            if (previousobject !== undefined) {
                angular.forEach(showedarray, function (item2, index2) { item2.ShowDiv = "N"; });
                previousobject.ShowDiv = "Y";
                $scope.FilteredInvestigations = $filter("filter")($scope.InvestigationDetails.AllInvestigations, { "CategoryId": previousobject.CategoryId }, true);
            } else {
                if (nextobject !== undefined) {
                    angular.forEach(showedarray, function (item2, index2) { item2.ShowDiv = "N"; });
                    nextobject.ShowDiv = "Y";
                    $scope.FilteredInvestigations = $filter("filter")($scope.InvestigationDetails.AllInvestigations, { "CategoryId": nextobject.CategoryId }, true);
                }
            }
            item.ShowStamp = "N";
            item.ShowDiv = "N";
            angular.forEach($scope.InvestigationDetails.AllInvestigations, function (item1, index1) {
                if (item1.CategoryId === item.CategoryId) {
                    item1.RightEyeArray = [];
                    item1.LeftEyeArray = [];
                    item1.RightEyeUndoCount = 0;
                    item1.LeftEyeUndoCount = 0;
                    item1.LeftEyeCdRatio = "";
                    item1.RightEyeCdRatio = "";
                    item1.RightEyeFreq = "positive";
                    item1.LeftEyeFreq = "positive";
                    item1.RightEyeEdit = false;
                    item1.LeftEyeEdit = false;
                    item1.RightEyeRemarks = "";
                    item1.LeftEyeRemarks = "";
                }
            });
        });
    };
    $scope.showCategoryDiv = function (item) {
        angular.forEach($scope.InvestigationDetails.AllInvestigationCategory, function (item, index) {
            item.ShowDiv = "N";
        });
        item.ShowDiv = "Y";
        $scope.FilteredInvestigations = $filter("filter")($scope.InvestigationDetails.AllInvestigations, { "CategoryId": item.CategoryId }, true);
    };






    $scope.GetTemplateImgSrc = function (type, item) {
        if (type === "Right") {
            if (item.RightTemplateUrl === "") {
                alertify.error("You Have Not Uploaded Template For this Investigation in Settings,Kindly Upload to Get Template");
            } else {
                item.RightOrganDocUrl = item.RightTemplateUrl;
                item.RightEyefileName = item.RightTemplateUrl.substring(item.RightTemplateUrl.lastIndexOf('/') + 1);
                $('#maineHnoteLoader').show();
                $scope.toDataURL(item.RightTemplateUrl, function (dataURL) {
                    item.RightEyediv = true;
                    item.thumbnailRightEye = dataURL;
                    $('#maineHnoteLoader').hide();
                });
            }
        }
        if (type === "Left") {
            if (item.LeftTemplateUrl === "") {
                alertify.error("You Have Not Uploaded Template For this Investigation in Settings,Kindly Upload to Get Template");
            } else {
                item.LeftOrganDocUrl = item.LeftTemplateUrl;
                item.LeftEyefileName = item.LeftTemplateUrl.substring(item.LeftTemplateUrl.lastIndexOf('/') + 1);
                $('#maineHnoteLoader').show();
                $scope.toDataURL(item.LeftTemplateUrl, function (dataURL) {
                    item.LeftEyediv = true;
                    item.thumbnailLeftEye = dataURL;
                    $('#maineHnoteLoader').hide();
                });
            }
        }
    };

    $scope.loadVisionFromCache = function () {
        $scope.UnaidedArray = [];
        $scope.RefractionArray = [];
        $scope.AcceptenceArray = [];
        $scope.AnteriorSegmentArray = [];
        $scope.PosteriorSegmentArray = [];
        $scope.PinholeArray = [];
        $scope.KeretometerArray = [];
        $scope.OcularDominanceArray = [];
        $scope.LCVArray = [];
        $scope.BinocularArray = [];
        $scope.AdditionalInvestgationArray = [];

        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        if (cacheStorageItem.mainVisionPrintArray) {
            cacheStorageItem.mainVisionPrintArray.forEach(function (item) {
                if (item.type === 'eyeGlass')
                    $scope.eyeGlassArray = item.bindArray;
            });
        }

        if (cacheStorageItem.InvestigationDetails && cacheStorageItem.InvestigationDetails.length > 0) {
            if (cacheStorageItem.InvestigationDetails[0].CategoryID === 1) {
                cacheStorageItem.InvestigationDetails[0].CategoryConditions.forEach(function (item) {
                    switch (item.InvestigationID) {
                        case 2:
                            var object = {
                                "InvestigationID": item.InvestigationID,
                                "InvestigationDesc": item.InvestigationDesc,
                                "RightEye": {
                                    "REye": item.Attributes.RightEye
                                },
                                "LeftEye": {
                                    "LEye": item.Attributes.LeftEye
                                }
                            };
                            $scope.PinholeArray.push(object);
                            break;

                        case 11:

                            //var object = {
                            //    //  "InvestigationId": item.InvestigationID,
                            //    "InvestigationID": item.InvestigationID,
                            //    "InvestigationDesc": item.InvestigationDesc,
                            //    "RightEye": {
                            //        "RHorizontalAxis": item.InvestigationOrgans[0].InvestigationAttributes.HorizontalAxis +
                            //            ' @ ' + item.InvestigationOrgans[0].InvestigationAttributes.HorizontalNewAxis,
                            //        "RVerticalAxis": item.InvestigationOrgans[0].InvestigationAttributes.VerticalAxis +
                            //            ' @ ' + item.InvestigationOrgans[0].InvestigationAttributes.VerticalNewAxis
                            //    },
                            //    "LeftEye": {
                            //        "LHorizontalAxis": item.InvestigationOrgans[1].InvestigationAttributes.HorizontalAxis +
                            //            ' @ ' + item.InvestigationOrgans[1].InvestigationAttributes.HorizontalNewAxis,
                            //        "LVerticalAxis": item.InvestigationOrgans[1].InvestigationAttributes.VerticalAxis +
                            //            ' @ ' + item.InvestigationOrgans[1].InvestigationAttributes.VerticalNewAxis
                            //    }
                            //};

                            var object = {
                                //  "InvestigationId": item.InvestigationID,
                                "InvestigationID": item.InvestigationID,
                                "InvestigationDesc": item.InvestigationDesc,
                                "RightEye": {
                                    "RHorizontalAxis": item.InvestigationOrgans[0].InvestigationAttributes.HorizontalAxis,
                                    "RHorizontalNewAxis": item.InvestigationOrgans[0].InvestigationAttributes.HorizontalNewAxis,
                                    "RVerticalAxis": item.InvestigationOrgans[0].InvestigationAttributes.VerticalAxis,
                                    "RVerticalNewAxis": item.InvestigationOrgans[0].InvestigationAttributes.VerticalNewAxis
                                },
                                "LeftEye": {
                                    "LHorizontalAxis": item.InvestigationOrgans[1].InvestigationAttributes.HorizontalAxis,
                                    "LHorizontalNewAxis": item.InvestigationOrgans[1].InvestigationAttributes.HorizontalNewAxis,
                                    "LVerticalAxis": item.InvestigationOrgans[1].InvestigationAttributes.VerticalAxis,
                                    "LVerticalNewAxis": item.InvestigationOrgans[1].InvestigationAttributes.VerticalNewAxis
                                }
                            };


                            $scope.KeretometerArray.push(object);

                            break;

                        case 9:
                            $scope.OcularDominanceArray = [];
                            var object = {
                                //   "InvestigationId": item.InvestigationID,
                                "InvestigationID": item.InvestigationID,
                                "InvestigationDesc": item.InvestigationDesc,
                                "RightEye": {
                                    "REye": item.Attributes.RightEye ? "Yes" : (!item.Attributes.RightEye ? "No" : ""),
                                    "RRemarks": item.Attributes.NotesRightEye
                                },
                                "LeftEye": {
                                    "LEye": item.Attributes.LeftEye ? "Yes" : (!item.Attributes.LeftEye ? "No" : ""),
                                    "LRemarks": item.Attributes.NotesLeftEye

                                },
                                "Value": item.Value,
                                "Remarks": item.Remarks
                            };
                            $scope.OcularDominanceArray.push(object);

                            break;


                        case 8:
                            var object = {
                                //  "InvestigationId": item.InvestigationID,
                                "InvestigationID": item.InvestigationID,
                                "InvestigationDesc": item.InvestigationDesc,
                                "RightEye": {
                                    "RSph": item.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                    "RCyl": item.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                    "RAxis": item.InvestigationOrgans[0].InvestigationAttributes.Axis
                                },
                                "LeftEye": {
                                    "LSph": item.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                    "LCyl": item.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                    "LAxis": item.InvestigationOrgans[1].InvestigationAttributes.Axis
                                }
                            };
                            $scope.LCVArray.push(object);
                            break;

                        case 10:
                            var object = {
                                // "InvestigationId": item.InvestigationID,
                                "InvestigationID": item.InvestigationID,
                                "InvestigationDesc": item.InvestigationDesc,
                                "RightEye": {
                                    "RSph": item.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                    "RCyl": item.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                    "RAxis": item.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                    "RAdition": item.InvestigationOrgans[0].InvestigationAttributes.Adition
                                },
                                "LeftEye": {
                                    "LSph": item.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                    "LCyl": item.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                    "LAxis": item.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                    "LAdition": item.InvestigationOrgans[1].InvestigationAttributes.Adition
                                }
                            };
                            $scope.BinocularArray.push(object);

                            break;

                        case 1:
                        case 7:
                        case 30:

                            var object = {
                                "InvestigationID": item.InvestigationID,
                                "InvestigationIDesc": item.InvestigationDesc,
                                "InvestigationDetails": {
                                    "DVrightEye": item.Attributes.distanceVision.RightEye,
                                    "DVleftEye": item.Attributes.distanceVision.LeftEye,
                                    "DVBoth": item.Attributes.distanceVision.Both,
                                    "NVrightEye": item.Attributes.NearVision.RightEye,
                                    "NVleftEye": item.Attributes.NearVision.LeftEye,
                                    "NVBoth": item.Attributes.NearVision.Both
                                }
                            };
                            $scope.UnaidedArray.push(object);

                            break;
                        case 3:
                        case 4:

                            if (item.InvestigationID === 3) {
                                var refracobject = {
                                    "RightEye": {
                                        "RSpherical": item.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                        "RCylindrical": item.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                        "RAxis": item.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                        "RAdition": item.InvestigationOrgans[0].InvestigationAttributes.Adition,
                                        "CRSpherical": "",
                                        "CRCylindrical": "",
                                        "CRAxis": "",
                                        "CRAdition": ""
                                    },
                                    "LeftEye": {
                                        "RSpherical": item.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                        "RCylindrical": item.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                        "RAxis": item.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                        "RAdition": item.InvestigationOrgans[1].InvestigationAttributes.Adition,
                                        "CRSpherical": "",
                                        "CRCylindrical": "",
                                        "CRAxis": "",
                                        "CRAdition": ""
                                    }
                                };
                                $scope.RefractionArray.push(refracobject);
                            } else if (item.InvestigationID === 4) {

                                if ($scope.RefractionArray.length === 0) {
                                    var refracobject = {
                                        "RightEye": {
                                            "CRSpherical": "",
                                            "CRCylindrical": "",
                                            "CRAxis": "",
                                            "CRAdition": ""
                                        },
                                        "LeftEye": {
                                            "CRSpherical": "",
                                            "CRCylindrical": "",
                                            "CRAxis": "",
                                            "CRAdition": ""
                                        }
                                    };
                                    $scope.RefractionArray.push(refracobject);
                                }
                                $scope.RefractionArray[0].RightEye.CRSpherical = item.InvestigationOrgans[0].InvestigationAttributes.Spherical;
                                $scope.RefractionArray[0].RightEye.CRCylindrical = item.InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                                $scope.RefractionArray[0].RightEye.CRAxis = item.InvestigationOrgans[0].InvestigationAttributes.Axis;
                                $scope.RefractionArray[0].RightEye.CRAdition = item.InvestigationOrgans[0].InvestigationAttributes.Adition;
                                $scope.RefractionArray[0].LeftEye.CRSpherical = item.InvestigationOrgans[1].InvestigationAttributes.Spherical;
                                $scope.RefractionArray[0].LeftEye.CRCylindrical = item.InvestigationOrgans[1].InvestigationAttributes.Cylindrical;
                                $scope.RefractionArray[0].LeftEye.CRAxis = item.InvestigationOrgans[1].InvestigationAttributes.Axis;
                                $scope.RefractionArray[0].LeftEye.CRAdition = item.InvestigationOrgans[1].InvestigationAttributes.Adition;

                            }
                            break;

                        case 5:
                        case 6:
                            if (item.InvestigationID === 5) {
                                var refracobject = {
                                    "RightEye": {
                                        "ASpherical": item.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                        "ACylindrical": item.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                        "AAxis": item.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                        "AAdition": item.InvestigationOrgans[0].InvestigationAttributes.Adition,
                                        "ACSpherical": "",
                                        "ACCylindrical": "",
                                        "ACAxis": "",
                                        "ACAdition": ""
                                    },
                                    "LeftEye": {
                                        "ASpherical": item.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                        "ACylindrical": item.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                        "AAxis": item.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                        "AAdition": item.InvestigationOrgans[1].InvestigationAttributes.Adition,
                                        "ACSpherical": "",
                                        "ACCylindrical": "",
                                        "ACAxis": "",
                                        "ACAdition": ""
                                    }
                                };
                                $scope.AcceptenceArray.push(refracobject);
                            } else if (item.InvestigationID === 6) {
                                if ($scope.AcceptenceArray.length === 0) {
                                    var refracobject = {
                                        "RightEye": {
                                            "ACSpherical": "",
                                            "ACCylindrical": "",
                                            "ACAxis": "",
                                            "ACAdition": ""
                                        },
                                        "LeftEye": {
                                            "ACSpherical": "",
                                            "ACCylindrical": "",
                                            "ACAxis": "",
                                            "ACAdition": ""
                                        }
                                    };
                                    $scope.AcceptenceArray.push(refracobject);
                                }

                                $scope.AcceptenceArray[0].RightEye.ACSpherical = item.InvestigationOrgans[0].InvestigationAttributes.Spherical;
                                $scope.AcceptenceArray[0].RightEye.ACCylindrical = item.InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                                $scope.AcceptenceArray[0].RightEye.ACAxis = item.InvestigationOrgans[0].InvestigationAttributes.Axis;
                                $scope.AcceptenceArray[0].RightEye.ACAdition = item.InvestigationOrgans[0].InvestigationAttributes.Adition;
                                $scope.AcceptenceArray[0].LeftEye.ACSpherical = item.InvestigationOrgans[1].InvestigationAttributes.Spherical;
                                $scope.AcceptenceArray[0].LeftEye.ACCylindrical = item.InvestigationOrgans[1].InvestigationAttributes.Cylindrical;
                                $scope.AcceptenceArray[0].LeftEye.ACAxis = item.InvestigationOrgans[1].InvestigationAttributes.Axis;
                                $scope.AcceptenceArray[0].LeftEye.ACAdition = item.InvestigationOrgans[1].InvestigationAttributes.Adition;
                            }


                            break;


                    }
                });
            }

            //if (cacheStorageItem.InvestigationDetails && cacheStorageItem.InvestigationDetails.length > 0) {
            //    cacheStorageItem.InvestigationDetails.forEach(function(mitem) {
            //        if (mitem.CategoryID !== 1 && mitem.CategoryID !== 2 && mitem.CategoryID !== 3 && mitem.CategoryID !== 4) {
            //            var objname = mitem.CategoryID === 5 ? 'AnteriorSegmentArray' : (mitem.CategoryID === 6 ? 'PosteriorSegmentArray' : 'AdditionalInvestgationArray');
            //            mitem.CategoryConditions.forEach(function(item) {
            //                if (item.IsNormalR) {
            //                    var RRemarks = 'Normal ' + ' ' + item.RightEyeRemarks;
            //                } else {
            //                    var RRemarks = item.RightEyeRemarks;
            //                }
            //                if (item.IsNormalL) {
            //                    var LRemarks = 'Normal ' + ' ' + item.LeftEyeRemarks;
            //                } else {
            //                    var LRemarks = item.LeftEyeRemarks;
            //                }
            //                var RightImage = "";
            //                if (item.RightEyeArray.length > 0) {
            //                    if (item.RightEyeArray[0].DocURL !== undefined) {
            //                        RightImage = item.RightEyeArray[0].DocURL;
            //                    }
            //                }
            //                var LeftImage = "";
            //                if (item.LeftEyeArray.length > 0) {
            //                    if (item.LeftEyeArray[0].DocURL !== undefined) {
            //                        LeftImage = item.LeftEyeArray[0].DocURL;
            //                    }
            //                }
            //                if (item.RightEyeRemarks !== '' || item.LeftEyeRemarks !== '' || item.RightEyeArray.length > 0 || item.LeftEyeArray.length > 0) {
            //                    var object = {
            //                        "InvestigationID": item.InvestigationId,
            //                        "InvestigationDesc": item.Investigation,
            //                        "InvestigationDetails": {
            //                            "RightEye": RRemarks,
            //                            "LeftEye": LRemarks,
            //                            "RightEyeImage": RightImage,
            //                            "LeftEyeImage": LeftImage
            //                        }
            //                    };
            //                    $scope[objname].push(object);
            //                }
            //            });
            //        }
            //    });
            //}
        }


        var oculoMetryFlag = false;



        if (cacheStorageItem.InvestigationDetails && cacheStorageItem.InvestigationDetails.length > 0) {

            cacheStorageItem.InvestigationDetails.forEach(function (mitem) {

                if (mitem.CategoryID !== 1 && mitem.CategoryID !== 2 && mitem.CategoryID !== 3 && mitem.CategoryID !== 4) {

                    var objname = "";
                    if (mitem.CategoryID === 5) {
                        objname = "AnteriorSegmentArray";
                    }
                    else if (mitem.CategoryID === 6) {
                        objname = "PosteriorSegmentArray";
                    } else {
                        objname = "AdditionalInvestgationArray";
                    }


                    //var objname = mitem.CategoryID === 21 ? 'AnteriorSegmentArray' : (mitem.CategoryID === 23 ? 'PosteriorSegmentArray' : 'AdditionalInvestgationArray');

                    mitem.CategoryConditions.forEach(function (item) {

                        if (item.IsNormalR) {
                            var RRemarks = 'Normal ' + ' ' + item.RightEyeRemarks;
                        } else {
                            var RRemarks = item.RightEyeRemarks;
                        }

                        if (item.IsNormalL) {
                            var LRemarks = 'Normal ' + ' ' + item.LeftEyeRemarks;
                        } else {
                            var LRemarks = item.LeftEyeRemarks;
                        }
                        var RECdRatio = item.RightEyeCdRatio;
                        var LECdRatio = item.LeftEyeCdRatio;
                        var LEFreq = item.LeftEyeFreq;
                        var REFreq = item.RightEyeFreq;
                        var RightImageArray = [];

                        if (item.RightEyeArray.length > 0) {
                            //if (item.RightEyeArray[0].DocURL !== undefined) {
                            //    RightImage = item.RightEyeArray[0].DocURL;
                            //}
                            angular.forEach(item.RightEyeArray, function (initem) {
                                if (initem.DocURL) {
                                    if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                        RightImageArray.push({
                                            "url": initem.DocURL,
                                            "thumbUrl": initem.DocURL
                                        });
                                    }
                                }
                                //RightImageArray.push(initem.);
                            });

                        }
                        var LeftImageArray = [];
                        if (item.LeftEyeArray.length > 0) {
                            //if (item.LeftEyeArray[0].DocURL !== undefined) {
                            //    LeftImage = item.LeftEyeArray[0].DocURL;
                            //}

                            angular.forEach(item.LeftEyeArray, function (initem) {
                                if (initem.DocURL) {
                                    if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                        LeftImageArray.push({
                                            "url": initem.DocURL,
                                            "thumbUrl": initem.DocURL
                                        });
                                    }
                                }
                                //RightImageArray.push(initem.);
                            });
                        }

                        if (item.RightEyeRemarks !== '' || item.LeftEyeRemarks !== '' || item.RightEyeArray.length > 0 || item.LeftEyeArray.length > 0 || item.RightEyeCdRatio !== '' || item.LeftEyeCdRatio !== '' || item.LeftEyeFreq !== '' || item.RightEyeFreq !== '' || item.IsNormalR || item.IsNormalL) {
                            var object = {
                                //"InvestigationId": item.InvestigationId,
                                "InvestigationID": item.InvestigationId,
                                "InvestigationDesc": item.Investigation,
                                "InvestigationDetails": {
                                    "RightEye": RRemarks,
                                    "LeftEye": LRemarks,
                                    "RightEyeCdRatio": RECdRatio,
                                    "LeftEyeCdRatio": LECdRatio,
                                    "LeftEyeFreq": LEFreq,
                                    "RightEyeFreq": REFreq,
                                    "RightEyeImage": RightImageArray,
                                    "LeftEyeImage": LeftImageArray
                                }
                            };
                            $scope[objname].push(object);
                        }
                    });
                }
                if (mitem.CategoryID === 3) {
                    oculoMetryFlag = true;
                }
            });

        }
        $scope.mainColorVisionPrintArray = [];

        //if (cacheStorageItem.InvestigationDetails[0].CategoryID === 2) {
        //    cacheStorageItem.InvestigationDetails[0].CategoryConditions.forEach(function (item) {
        //        if (item.Active === "Y") {
        //            var obj = {
        //                "InvestigationName": "",
        //                "InvestigationNotes": ""
        //            };
        //            obj.InvestigationName = item.InvestigationDesc;
        //            obj.InvestigationNotes = item.InvestigationNote;
        //            $scope.mainColorVisionPrintArray.push(obj);
        //        }
        //    });
        //}


        if (cacheStorageItem.InvestigationDetails) {
            cacheStorageItem.InvestigationDetails.forEach(function (itm) {

                if (itm.CategoryID === 2) {

                    itm.CategoryConditions.forEach(function (itm2) {
                        if (itm2.Active === "Y") {
                            var obj = {
                                "InvestigationName": "",
                                "InvestigationNotes": ""
                            };
                            obj.InvestigationName = itm2.InvestigationDesc;
                            obj.InvestigationNotes = itm2.InvestigationNote;
                            $scope.mainColorVisionPrintArray.push(obj);
                        }
                    });
                }
            });
        }



        $scope.showGlassArrayDiv = false;
        //$scope.glassArray = cacheStorageItem.PatientEyeGlassItems;

        //for (var i = 0; i < $scope.glassArray.length; i++) {
        //    if (i === 0) {
        //        if ($scope.glassArray[i].RSphere !== "" || $scope.glassArray[i].RCylinder !== "" || $scope.glassArray[i].RAxis !== "" || $scope.glassArray[i].RPrism !== "" || $scope.glassArray[i].LSphere !== "" || $scope.glassArray[i].LCylinder !== "" || $scope.glassArray[i].LAxis !== "" || $scope.glassArray[i].LPrism !== "") {
        //            $scope.showGlassArrayDiv = true;
        //        }
        //    }


        //}


        $scope.eyeGlassArray = cacheStorageItem.PatientEyeGlassItems;

        for (var i = 0; i < $scope.eyeGlassArray.length; i++) {
            if (i === 0) {
                if ($scope.eyeGlassArray[i].RSphere !== "" || $scope.eyeGlassArray[i].RCylinder !== "" || $scope.eyeGlassArray[i].RAxis !== "" || $scope.eyeGlassArray[i].RPrism !== "" || $scope.eyeGlassArray[i].LSphere !== "" || $scope.eyeGlassArray[i].LCylinder !== "" || $scope.eyeGlassArray[i].LAxis !== "" || $scope.eyeGlassArray[i].LPrism !== "") {
                    $scope.showGlassArrayDiv = true;
                }
            }


        }


        if ($scope.showGlassArrayDiv) {
            if ($scope.eyeGlassArray.length > 0) {
                if ($scope.eyeGlassArray.length === 1) {
                    $scope.eyeGlassArray[0].type = 'Distance';
                    var obj = {
                        type: 'Near',
                        RSphere: '',
                        RCylinder: '',
                        RAxis: '',
                        RPrism: '',
                        RBase: '',
                        RVa: '',
                        RAdd: '',
                        LSphere: '',
                        LCylinder: '',
                        LAxis: '',
                        LPrism: '',
                        LBase: '',
                        LVa: '',
                        LAdd: ''
                    };
                    $scope.eyeGlassArray.push(obj);
                }
                $scope.eyeGlassArray[0].type = 'Distance';
                var rVal = $scope.eyeGlassArray[0].RAdd ? parseFloat($scope.eyeGlassArray[0].RAdd) : 0;
                var lVal = $scope.eyeGlassArray[0].LAdd ? parseFloat($scope.eyeGlassArray[0].LAdd) : 0;

                $scope.eyeGlassArray[1].RSphere = $scope.eyeGlassArray[0].RSphere ? parseFloat($scope.eyeGlassArray[0].RSphere) + rVal : '';
                $scope.eyeGlassArray[1].RCylinder = $scope.eyeGlassArray[0].RCylinder ? parseFloat($scope.eyeGlassArray[0].RCylinder) + rVal : '';
                $scope.eyeGlassArray[1].RAxis = $scope.eyeGlassArray[0].RAxis ? parseFloat($scope.eyeGlassArray[0].RAxis) : '';
                $scope.eyeGlassArray[1].RPrism = $scope.eyeGlassArray[0].RPrism ? parseFloat($scope.eyeGlassArray[0].RPrism) : '';
                $scope.eyeGlassArray[1].RBase = $scope.eyeGlassArray[0].RBase ? parseFloat($scope.eyeGlassArray[0].RBase) : '';
                $scope.eyeGlassArray[1].RVa = $scope.eyeGlassArray[0].RVa ? parseFloat($scope.eyeGlassArray[0].RVa) : '';
                $scope.eyeGlassArray[1].LSphere = $scope.eyeGlassArray[0].LSphere ? parseFloat($scope.eyeGlassArray[0].LSphere) + lVal : '';
                $scope.eyeGlassArray[1].LCylinder = $scope.eyeGlassArray[0].LCylinder ? parseFloat($scope.eyeGlassArray[0].LCylinder) + lVal : '';
                $scope.eyeGlassArray[1].LAxis = $scope.eyeGlassArray[0].LAxis ? parseFloat($scope.eyeGlassArray[0].LAxis) : '';
                $scope.eyeGlassArray[1].LPrism = $scope.eyeGlassArray[0].LPrism ? parseFloat($scope.eyeGlassArray[0].LPrism) : '';
                $scope.eyeGlassArray[1].LBase = $scope.eyeGlassArray[0].LBase ? parseFloat($scope.eyeGlassArray[0].LBase) : '';
                $scope.eyeGlassArray[1].LVa = $scope.eyeGlassArray[0].LVa ? parseFloat($scope.eyeGlassArray[0].LVa) : '';

            }
        }










        var tonoFlag = false;
        if (cacheStorageItem.InvestigationDetails !== undefined) {
            for (var i = 0; i < cacheStorageItem.InvestigationDetails.length; i++) {
                if (cacheStorageItem.InvestigationDetails[i].CategoryID === 4) {
                    for (var j = 0; j < cacheStorageItem.InvestigationDetails[i].CategoryConditions.length; j++) {
                        if (cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues) {
                            if (cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues.RightEye || cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues.LeftEye) {
                                tonoFlag = true;
                            }
                        }
                    }
                }
            }
        }

        $scope.mainVisionPrintArray = [
            { type: 'unaided', bindArray: $scope.UnaidedArray },
            { type: 'Refraction', bindArray: $scope.RefractionArray },
            { type: 'Acceptence', bindArray: $scope.AcceptenceArray },
            { type: 'AnteriorSegment', bindArray: $scope.AnteriorSegmentArray },
            { type: 'PosteriorSegment', bindArray: $scope.PosteriorSegmentArray },
            { type: 'Pinhole', bindArray: $scope.PinholeArray },
            { type: 'Keretometer', bindArray: $scope.KeretometerArray },
            { type: 'OcularDominance', bindArray: $scope.OcularDominanceArray },
            { type: 'LCVA', bindArray: $scope.LCVArray },
            { type: 'Binocular', bindArray: $scope.BinocularArray },
            { type: 'AdditionalInvestgation', bindArray: $scope.AdditionalInvestgationArray },
            { type: 'eyeGlass', bindArray: $scope.showGlassArrayDiv ? $scope.glassArray : [] }
        ];

        if ($scope.mainVisionPrintArray.length > 0) {
            var i = 0;
            $scope.mainVisionPrintArray.forEach(function (item) {
                if (item.bindArray.length === 0)
                    i++;
            });

        }

        $scope.PrintFlagArray = [
            { type: 'Vision', flag: $scope.mainVisionPrintArray.length > 0 && $scope.mainVisionPrintArray.length !== i ? true : false, isActive: $scope.mainVisionPrintArray.length > 0 && $scope.mainVisionPrintArray.length !== i ? true : false },
            { type: 'Color Vision', flag: $scope.mainColorVisionPrintArray && $scope.mainColorVisionPrintArray.length > 0 ? true : false, isActive: cacheStorageItem.mainColorVisionPrintArray && cacheStorageItem.mainColorVisionPrintArray.length > 0 ? true : false },
            { type: 'Tonometry Test', flag: tonoFlag, isActive: tonoFlag },
            { type: 'Ocular Motility', flag: oculoMetryFlag, isActive: oculoMetryFlag },
            { type: 'Anterior', flag: $scope.AnteriorSegmentArray.length > 0 ? true : false, isActive: $scope.AnteriorSegmentArray.length > 0 ? true : false },
            { type: 'Posterior', flag: $scope.PosteriorSegmentArray.length > 0 ? true : false, isActive: $scope.PosteriorSegmentArray.length > 0 ? true : false },
            { type: 'Additional Investigations', flag: $scope.AdditionalInvestgationArray.length > 0 ? true : false, isActive: $scope.AdditionalInvestgationArray.length > 0 ? true : false }
        ];


        $scope.showHidepopupDiv = false;

        angular.forEach($scope.PrintFlagArray, function (item) {
            if (item.flag === true)
                $scope.showHidepopupDiv = true;
        });

        cacheStorageItem.mainVisionPrintArray = $scope.mainVisionPrintArray;
        cacheStorageItem.mainColorVisionPrintArray = $scope.mainColorVisionPrintArray;
        cacheStorageItem.PrintFlagArray = $scope.PrintFlagArray;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    };

    $scope.showConfirmPopup = function () {
        UpdateInvestigationToCache();
        $scope.loadVisionFromCache();
        $("#invSubmitforOptho").modal("show");
    };
    $scope.invSubmitforOptho = function (type, printid) {
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        cacheStorageItem.PrintFlagArray = $scope.PrintFlagArray;

        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);


        if (printid !== 0) {
            $scope.printType = type;
            if (type === 'print') {
                var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                if ($scope.printAll === '2') {
                    $scope.PrintSelected();
                } else if ($scope.printAll === '1') {
                    PrintInvestigationReport();
                }
            }

        }

        //$scope.cacheStorageItem.InvestigationDetails = [];
        //$scope.cacheStorageItem.InvestigationImageUploads = [];
        //$scope.cacheStorageItem.AllInvestigationCategory = [];
        //$scope.cacheStorageItem.AllInvestigations = [];
        //var count = 0;
        //if ($scope.InvestigationDetails.Htmlvisions.length !== 0) {
        //    $scope.tempvisions = [];
        //    angular.forEach($scope.InvestigationDetails.Htmlvisions, function (item1, ind1) {
        //        if (item1.InvestigationID === 1) {
        //            if (item1.Attributes.RightEye !== "" || item1.Attributes.LeftEye !== "" || item1.Attributes.Both !== "" || item1.Attributes.NearVision !== "") {
        //                $scope.tempvisions.push(item1);
        //            }
        //        }
        //        if (item1.InvestigationID === 30) {
        //            if (item1.Attributes.RightEye !== "" || item1.Attributes.LeftEye !== "" || item1.Attributes.Both !== "" || item1.Attributes.NearVision !== "") {
        //                $scope.tempvisions.push(item1);
        //            }
        //        }
        //        if (item1.InvestigationID === 2) {
        //            if (item1.Attributes.RightEye !== "" || item1.Attributes.LeftEye !== "") {
        //                $scope.tempvisions.push(item1);
        //            }
        //        }
        //        if (item1.InvestigationID === 3 || item1.InvestigationID === 4) {
        //            $scope.tempInvestigationOrgans = [];
        //            angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
        //                if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "") {
        //                    $scope.tempInvestigationOrgans.push(item2);
        //                }
        //            });
        //            if ($scope.tempInvestigationOrgans.length !== 0) {
        //                $scope.tempvisions.push(item1);
        //            }
        //        }
        //        if (item1.InvestigationID === 11) {
        //            $scope.tempInvestigationOrgans = [];
        //            angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
        //                if (item2.InvestigationAttributes.HorizontalAxis !== "" || item2.InvestigationAttributes.VerticalAxis !== "" ||
        //                    item2.InvestigationAttributes.HorizontalNewAxis !== "" || item2.InvestigationAttributes.VerticalNewAxis !== "") {
        //                    $scope.tempInvestigationOrgans.push(item2);
        //                }
        //            });
        //            if ($scope.tempInvestigationOrgans.length !== 0) {
        //                $scope.tempvisions.push(item1);
        //            }
        //        }
        //        if (item1.InvestigationID === 5 || item1.InvestigationID === 6 || item1.InvestigationID === 10) {
        //            $scope.tempInvestigationOrgans = [];
        //            angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
        //                if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "") {
        //                    $scope.tempInvestigationOrgans.push(item2);
        //                }
        //            });
        //            if ($scope.tempInvestigationOrgans.length !== 0) {
        //                $scope.tempvisions.push(item1);
        //            }
        //        }
        //        if (item1.InvestigationID === 7) {
        //            if (item1.Attributes.RightEye !== "" || item1.Attributes.LeftEye !== "" || item1.Attributes.Both !== "" || item1.Attributes.NearVision !== "") {
        //                $scope.tempvisions.push(item1);
        //            }
        //        }
        //        if (item1.InvestigationID === 8) {
        //            $scope.tempInvestigationOrgans = [];
        //            angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
        //                if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "") {
        //                    $scope.tempInvestigationOrgans.push(item2);
        //                }
        //            });
        //            if ($scope.tempInvestigationOrgans.length !== 0) {
        //                $scope.tempvisions.push(item1);
        //            }
        //        }
        //        if (item1.InvestigationID === 9) {
        //            //if (item1.Attributes.RightEye !== "" || item1.Attributes.LeftEye !== "" || item1.Attributes.NotesLeftEye !== "" || item1.Attributes.NotesRightEye !== "") {
        //            //    $scope.tempvisions.push(item1);
        //            //}

        //            if (item1.Value !== "") {
        //                $scope.tempvisions.push(item1);
        //            }
        //        }
        //    });
        //    if ($scope.tempvisions.length !== 0) {
        //        $scope.cacheStorageItem.visions = $scope.tempvisions;
        //        object = {
        //            "RowID": count++,
        //            "CategoryID": 1,
        //            "CategoryDesc": "Vision",
        //            "CategoryConditions": $scope.tempvisions
        //        };
        //        $scope.cacheStorageItem.InvestigationDetails.push(object);
        //    }
        //}
        //if ($scope.InvestigationDetails.colorvisions.length !== 0) {
        //    $scope.Tempcolorvisions = [];
        //    angular.forEach($scope.InvestigationDetails.colorvisions, function (item2, ind2) {
        //        if (item2.InvestigationNote !== "") {
        //            $scope.Tempcolorvisions.push(item2);
        //        }
        //    });
        //    if ($scope.Tempcolorvisions.length !== 0) {
        //        object = {
        //            "RowID": count++,
        //            "CategoryID": 2,
        //            "CategoryDesc": "Colour Vision Test",
        //            "CategoryConditions": $scope.Tempcolorvisions
        //        };
        //        $scope.cacheStorageItem.colorvisions = $scope.InvestigationDetails.colorvisions;
        //        $scope.cacheStorageItem.InvestigationDetails.push(object);
        //    }
        //}
        //if ($scope.InvestigationDetails.ocularmotility.length !== 0) {
        //    $scope.cacheStorageItem.ocularmotility = $scope.InvestigationDetails.ocularmotility;
        //    object = {
        //        "RowID": count++,
        //        "CategoryID": 3,
        //        "CategoryDesc": "Ocular Motility",
        //        "CategoryConditions": []
        //    };
        //    $scope.TempRighteyePositionValues = [];
        //    var rightvaluecount = 0;
        //    angular.forEach($scope.InvestigationDetails.ocularmotility[0].OcularPositionValues, function (item2, ind2) {
        //        rightvaluecount++;
        //        $scope.TempRighteyePositionValues.push(item2);
        //    });
        //    if ($scope.TempRighteyePositionValues.length !== 0 || $scope.InvestigationDetails.ocularmotility[0].Notes !== "") {
        //        var RightEyeObject = {
        //            "RowID": 1,
        //            "InvestigationAttributeID": 1,
        //            "InvestigationAttributeDesc": "RightEye",
        //            "Notes": $scope.InvestigationDetails.ocularmotility[0].Notes,
        //            "OcularPositionValues": $scope.TempRighteyePositionValues
        //        };
        //        object.CategoryConditions.push(RightEyeObject);
        //    }
        //    $scope.TempLefteyePositionValues = [];
        //    var leftvaluecount = 0;
        //    angular.forEach($scope.InvestigationDetails.ocularmotility[1].OcularPositionValues, function (item2, ind2) {
        //        leftvaluecount++;
        //        $scope.TempLefteyePositionValues.push(item2);
        //    });
        //    if ($scope.TempLefteyePositionValues.length !== 0 || $scope.InvestigationDetails.ocularmotility[1].Notes !== "") {
        //        var LeftEyeObject = {
        //            "RowID": 2,
        //            "InvestigationAttributeID": 2,
        //            "InvestigationAttributeDesc": "LeftEye",
        //            "Notes": $scope.InvestigationDetails.ocularmotility[1].Notes,
        //            "OcularPositionValues": $scope.TempLefteyePositionValues
        //        };
        //        object.CategoryConditions.push(LeftEyeObject);
        //    }
        //    if (object.CategoryConditions.length !== 0) {
        //        $scope.cacheStorageItem.InvestigationDetails.push(object);
        //    }
        //}
        //if ($scope.InvestigationDetails.TonoMetry.length !== 0) {
        //    $scope.cacheStorageItem.TonoMetry = $scope.InvestigationDetails.TonoMetry;
        //    $scope.TempTonoMetry = [];
        //    angular.forEach($scope.InvestigationDetails.TonoMetry, function (item2, ind2) {
        //        if (ind2 === 0 || ind2 === 1 || ind2 === 2) {
        //            if (item2.InvestigationAttributeValues.RightEye !== "" || item2.InvestigationAttributeValues.LeftEye !== "" || item2.InvestigationAttributeValues.Time !== "") {
        //                $scope.TempTonoMetry.push(item2);
        //            }
        //        } else {
        //            if (item2.Value !== "") {
        //                $scope.TempTonoMetry.push(item2);
        //            }
        //        }
        //    });
        //    if ($scope.TempTonoMetry.length !== 0) {
        //        object = {
        //            "RowID": count++,
        //            "CategoryID": 4,
        //            "CategoryDesc": "Tonometry Test",
        //            "CategoryConditions": $scope.TempTonoMetry
        //        };
        //        $scope.cacheStorageItem.InvestigationDetails.push(object);
        //    }
        //}
        var object = {};


        //if ($scope.InvestigationDetails.AllInvestigations.length !== 0) {
        //    $scope.cacheStorageItem.AllInvestigationCategory = $scope.InvestigationDetails.AllInvestigationCategory;
        //    $scope.cacheStorageItem.AllInvestigations = $scope.InvestigationDetails.AllInvestigations;
        //    angular.forEach($scope.InvestigationDetails.AllInvestigationCategory, function (item, index) {
        //        var InvestigationsArray = $filter("filter")($scope.InvestigationDetails.AllInvestigations, { 'CategoryId': item.CategoryId },true);
        //        object = {
        //            "RowID": count++,
        //            "CategoryID": item.CategoryId,
        //            "CategoryDesc": item.CategoryName,
        //            "CategoryConditions": []
        //        };
        //        angular.forEach(InvestigationsArray, function (item1, index1) {
        //            if (item1.RightEyeArray.length !== 0 || item1.LeftEyeArray.length !== 0 || item1.RightEyeRemarks !== "" || item1.LeftEyeRemarks !== "" || item1.RightEyeCdRatio !== "" || item1.LeftEyeCdRatio !== "" || item1.RightEyeFreq !== "" || item1.LeftEyeFreq !== "") {
        //                object.CategoryConditions.push(item1);
        //            }
        //        });
        //        if (object.CategoryConditions.length !== 0) {
        //            $scope.cacheStorageItem.InvestigationDetails.push(object);
        //        }
        //    });
        //}
        //cacheStorageItem.InvestigationDetails.forEach(function (item) {
        //    if (item.CategoryID===5 || item.CategoryID ===6) {
        //        $scope.cacheStorageItem.InvestigationDetails.push(item);
        //    }
        //});
        //  eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
        object = {
            "AppointmentID": cacheStorageItem.appointmentid,
            "USRId": eHnoteMasterDataService.getLoginId(),
            "InvestigationDetails": cacheStorageItem.InvestigationDetails,
            "PatientId": cacheStorageItem.patientid,
            //"GlassPrescription":cacheStorageItem.PatientEyeGlassItems
            "GlassPrescription": {
                //oldGlasses: cacheStorageItem.PatientEyeGlassItems,
                //newGlasses: cacheStorageItem.PatientOldEyeGlassItems
                oldGlasses: cacheStorageItem.PatientOldEyeGlassItems,
                newGlasses: cacheStorageItem.PatientEyeGlassItems
            }
        };


        eHnotePatientDataService.AddUpdatePatientInvestigationParameters(object).then(function (resp) {
            //    if (resp.data.status === "Success") {
            //        $scope.MovePage.status = true;
            //        alertify.success("Parameters Added Successfully");
            //        setTimeout(function () {
            //            var url = "/appointment";
            //            $location.url(url);
            //        }, 200);
            //    } else {
            //        alertify.error(resp.data.Message);
            //    }
            //}, function (err) {
            //    console.log(err.Messege);
            //});


            if (resp.data.status === "Success") {
                //$scope.$broadcast("InvestigationPrintCache");
                //PrintInvestigationReport();
                $scope.MovePage.status = true;
                alertify.success("Parameters Added Successfully");
                setTimeout(function () {
                    //var url = "/appointment";
                    var url = "/OP";
                    $location.url(url);
                }, 200);
            } else {
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            console.log(err.Messege);
        });

    };
    if (cacheStorageItem.IsInvestigationMode) {
        var info = eHnoteCacheStorageService.getCacheStorage();
        if (info.patienthistcaseid !== undefined) {
            var PatientVisitID = info.patienthistcaseid;
        } else {
            var PatientVisitID = 0;
        }
    }

    function getVisionInvestigations() {
        eHnotePatientDataService.GetAllInvestigations(GetAllInvestigationsvisionSuccess1, GetAllInvestigationsvisionError1);
    }
    $scope.InvestigationDetails.Htmlvisions1 = [];
    $scope.tempVisions1 = [];

    function GetAllInvestigationsvisionSuccess1(resp) {
        var object = {};
        $scope.InvestigationDetails.Htmlvisions1 = $filter("filter")(resp, { "ParentId": 1 });
        angular.forEach($scope.InvestigationDetails.Htmlvisions1, function (item, index) {
            if (index === 0 || index === 1) {
                item.Active = "Y";
            } else {
                item.Active = "N";
            }
            if (item.Id === 1) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "Attributes": {
                        "distanceVision": {
                            "RightEye": "",
                            "LeftEye": "",
                            "Both": ""
                        },
                        "NearVision": {
                            "RightEye": "",
                            "LeftEye": "",
                            "Both": ""
                        }
                    }
                };
                $scope.tempVisions1.push(object);
            }
            if (item.Id === 2) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "Attributes": {
                        "RightEye": "",
                        "LeftEye": ""
                        //"Both": "",
                        //"NearVision": ""
                    }
                };
                $scope.tempVisions1.push(object);
            }
            if (item.Id === 3) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "InvestigationOrgans": [{
                        "InvestigationOrganID": 1,
                        "InvestigationOrganDesc": "RightEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    },
                    {
                        "InvestigationOrganID": 2,
                        "InvestigationOrganDesc": "LeftEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    }
                    ]
                };
                $scope.tempVisions1.push(object);
            }
            if (item.Id === 4) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "InvestigationOrgans": [{
                        "InvestigationOrganID": 1,
                        "InvestigationOrganDesc": "RightEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    },
                    {
                        "InvestigationOrganID": 2,
                        "InvestigationOrganDesc": "LeftEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    }
                    ]
                };
                $scope.tempVisions1.push(object);
            }
            if (item.Id === 5) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "InvestigationOrgans": [{
                        "InvestigationOrganID": 1,
                        "InvestigationOrganDesc": "RightEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    },
                    {
                        "InvestigationOrganID": 2,
                        "InvestigationOrganDesc": "LeftEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    }
                    ]
                };
                $scope.tempVisions1.push(object);
            }
            if (item.Id === 6) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "InvestigationOrgans": [{
                        "InvestigationOrganID": 1,
                        "InvestigationOrganDesc": "RightEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    },
                    {
                        "InvestigationOrganID": 2,
                        "InvestigationOrganDesc": "LeftEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    }
                    ]
                };
                $scope.tempVisions1.push(object);
            }
            if (item.Id === 7) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "Attributes": {
                        "distanceVision": {
                            "RightEye": "",
                            "LeftEye": "",
                            "Both": ""
                        },
                        "NearVision": {
                            "RightEye": "",
                            "LeftEye": "",
                            "Both": ""
                        }
                    }
                };
                $scope.tempVisions1.push(object);
            }
            if (item.Id === 8) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "InvestigationOrgans": [{
                        "InvestigationOrganID": 1,
                        "InvestigationOrganDesc": "RightEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    },
                    {
                        "InvestigationOrganID": 2,
                        "InvestigationOrganDesc": "LeftEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    }
                    ]
                };
                $scope.tempVisions1.push(object);
            }
            if (item.Id === 9) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "Attributes": {
                        "RightEye": "",
                        "LeftEye": "",
                        "NotesRightEye": "",
                        "NotesLeftEye": ""
                    },
                    "Value": "",
                    "Remarks": ""
                };
                $scope.tempVisions1.push(object);
            }
            if (item.Id === 10) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "InvestigationOrgans": [{
                        "InvestigationOrganID": 1,
                        "InvestigationOrganDesc": "RightEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    },
                    {
                        "InvestigationOrganID": 2,
                        "InvestigationOrganDesc": "LeftEye",
                        "InvestigationAttributes": {
                            "Cylindrical": "",
                            "Spherical": "",
                            "Axis": "",
                            "Adition": ""
                        }
                    }
                    ]
                };
                $scope.tempVisions1.push(object);
            }
            if (item.Id === 11) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "InvestigationOrgans": [{
                        "InvestigationOrganID": 1,
                        "InvestigationOrganDesc": "RightEye",
                        "InvestigationAttributes": {
                            "HorizontalAxis": "",
                            "VerticalAxis": "",
                            "HorizontalNewAxis": "",
                            "VerticalNewAxis": ""
                        }
                    },
                    {
                        "InvestigationOrganID": 2,
                        "InvestigationOrganDesc": "LeftEye",
                        "InvestigationAttributes": {
                            "HorizontalAxis": "",
                            "VerticalAxis": "",
                            "HorizontalNewAxis": "",
                            "VerticalNewAxis": ""
                        }
                    }
                    ]
                };
                $scope.tempVisions1.push(object);
            }
            if (item.Id === 30) {
                object = {
                    "RowID": item.Id,
                    "InvestigationID": item.Id,
                    "InvestigationDesc": item.Name,
                    "Active": item.Active,
                    "Attributes": {
                        "distanceVision": {
                            "RightEye": "",
                            "LeftEye": "",
                            "Both": ""
                        },
                        "NearVision": {
                            "RightEye": "",
                            "LeftEye": "",
                            "Both": ""
                        }
                    }
                };
                $scope.tempVisions1.push(object);
            }


        });

        $scope.InvestigationDetails.Htmlvisions1 = angular.copy($scope.tempVisions1);



        if (cacheStorageItem.pauseFlag !== 'P') {

            if ($scope.Consulttype == 'CONTINUE') {
                getPatientInvestigationParams($scope.tempVisions1, $scope.cacheStorageItem.followupAppointmentId);
            } else {
                getPatientInvestigationParams($scope.tempVisions1, $scope.cacheStorageItem.appointmentid);
            }
        }
    }

    function GetAllInvestigationsvisionError1(err) {
        console.log(err);
    }

    function getPatientInvestigationParams(visionInvArray, appid) {
        var params = {
            "AppointmentID": appid
        };
        eHnotePatientDataService.CheckInvestigationParams(params).then(function (resp) {
            if (resp.data.InvestigationDetailsObj !== undefined) {
                if (resp.data.InvestigationDetailsObj.length > 0) {
                    var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                    var object = {};
                    $scope.cacheStorageItem.AllInvestigationCategory = [];
                    $scope.cacheStorageItem.AllInvestigations = [];
                    var count = 4;
                    angular.forEach(resp.data.InvestigationDetailsObj, function (item, ind) {
                        if (item.CategoryID === 1) {
                            $scope.cacheStorageItem.visions = [];
                            angular.forEach(item.CategoryConditions, function (item2, ind2) {
                                if (item2.InvestigationID === 1) {
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        "Attributes": item2.Attributes
                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                                if (item2.InvestigationID === 2) {
                                    var attrobj = {
                                        "RightEye": item2.Attributes.RightEye,
                                        "LeftEye": item2.Attributes.LeftEye
                                    };
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        // "Attributes": item2.Attributes
                                        "Attributes": attrobj
                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                                if (item2.InvestigationID === 3) {
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        "InvestigationOrgans": item2.InvestigationOrgans
                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                                if (item2.InvestigationID === 4) {
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        "InvestigationOrgans": item2.InvestigationOrgans
                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                                if (item2.InvestigationID === 5) {
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        "InvestigationOrgans": item2.InvestigationOrgans
                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                                if (item2.InvestigationID === 6) {
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        "InvestigationOrgans": item2.InvestigationOrgans
                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                                if (item2.InvestigationID === 7) {
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        "Attributes": item2.Attributes
                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                                if (item2.InvestigationID === 8) {
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        "InvestigationOrgans": item2.InvestigationOrgans
                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                                if (item2.InvestigationID === 9) {
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        "Attributes": item2.Attributes,
                                        "Value": item2.Value,
                                        "Remarks": item2.Remarks
                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                                if (item2.InvestigationID === 10) {
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        "InvestigationOrgans": item2.InvestigationOrgans

                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                                if (item2.InvestigationID === 11) {
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        "InvestigationOrgans": item2.InvestigationOrgans
                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                                if (item2.InvestigationID === 30) {
                                    object = {
                                        "RowID": item2.RowID,
                                        "InvestigationID": item2.InvestigationID,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "Active": item2.Active,
                                        //"InvestigationOrgans": item2.InvestigationOrgans
                                        "Attributes": item2.Attributes
                                    };
                                    $scope.cacheStorageItem.visions.push(object);
                                }
                            });
                        }
                        if (item.CategoryID === 2) {
                            $scope.cacheStorageItem.colorvisions = [];
                            angular.forEach(item.CategoryConditions, function (item2, ind2) {
                                object = {
                                    "RowID": item2.RowID,
                                    "InvestigationID": item2.InvestigationID,
                                    "InvestigationDesc": item2.InvestigationDesc,
                                    "InvestigationNote": item2.InvestigationNote
                                };
                                $scope.cacheStorageItem.colorvisions.push(object);
                            });
                        }
                        if (item.CategoryID === 3) {
                            $scope.cacheStorageItem.ocularmotility = [];
                            angular.forEach(item.CategoryConditions, function (item2, ind2) {
                                if (item2.InvestigationAttributeID === 1) {
                                    object = {
                                        "RowID": 1,
                                        "InvestigationAttributeID": 1,
                                        "InvestigationAttributeDesc": "RightEye",
                                        "Notes": item2.Notes,
                                        "OcularPositionValues": item2.OcularPositionValues
                                    };
                                    $scope.cacheStorageItem.ocularmotility.push(object);
                                }
                                if (item2.InvestigationAttributeID === 2) {
                                    object = {
                                        "RowID": 2,
                                        "InvestigationAttributeID": 2,
                                        "InvestigationAttributeDesc": "LeftEye",
                                        "Notes": item2.Notes,
                                        "OcularPositionValues": item2.OcularPositionValues
                                    };
                                    $scope.cacheStorageItem.ocularmotility.push(object);
                                }
                            });
                        }
                        if (item.CategoryID === 4) {
                            $scope.cacheStorageItem.TonoMetry = item.CategoryConditions;
                        }

                        if (item.CategoryID !== 1 && item.CategoryID !== 2 && item.CategoryID !== 3 && item.CategoryID !== 4) {
                            var obj = {
                                "CategoryId": item.CategoryID,
                                "CategoryName": item.CategoryDesc,
                                "Opthalmologypageno": ++count,
                                "ShowStamp": "Y",
                                "ShowDiv": "N"
                            };
                            if (count === 5) {
                                obj.ShowDiv = "Y";
                            }
                            $scope.cacheStorageItem.AllInvestigationCategory.push(obj);
                            angular.forEach(item.CategoryConditions, function (item2, index2) {
                                item2.IsSelected = "Y";
                                $scope.cacheStorageItem.AllInvestigations.push(item2);
                            });
                        }
                    });
                    for (var i = 0; i < visionInvArray.length; i++) {
                        if ($scope.cacheStorageItem.visions && $scope.cacheStorageItem.visions.length > 0) {
                            for (var j = 0; j < $scope.cacheStorageItem.visions.length; j++) {
                                if (visionInvArray[i].InvestigationID === $scope.cacheStorageItem.visions[j].InvestigationID) {
                                    visionInvArray[i] = $scope.cacheStorageItem.visions[j];
                                }
                            }
                        }
                    }
                    $scope.cacheStorageItem.visions = visionInvArray;
                    cacheStorageItem.visions = $scope.cacheStorageItem.visions;
                    cacheStorageItem.colorvisions = $scope.cacheStorageItem.colorvisions;
                    cacheStorageItem.ocularmotility = $scope.cacheStorageItem.ocularmotility;
                    cacheStorageItem.TonoMetry = $scope.cacheStorageItem.TonoMetry;
                    cacheStorageItem.AllInvestigationCategory = $scope.cacheStorageItem.AllInvestigationCategory;
                    cacheStorageItem.AllInvestigations = $scope.cacheStorageItem.AllInvestigations;
                    eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
                    var selectedinvitem = 0;
                    for (var i = 0; i < $scope.cacheStorageItem.AllInvestigations.length; i++) {
                        for (var j = 0; j < $scope.InvestigationDetails.AllInvestigations.length; j++) {
                            if ($scope.cacheStorageItem.AllInvestigations[i].InvestigationId === $scope.InvestigationDetails.AllInvestigations[j].InvestigationId) {
                                $scope.InvestigationDetails.AllInvestigations[j] = $scope.cacheStorageItem.AllInvestigations[i];
                                $scope.InvestigationDetails.AllInvestigations[j].IsSelected = "Y";
                                selectedinvitem = j;
                            }
                        }
                    }
                    $scope.selectedInevstigation = $scope.InvestigationDetails.AllInvestigations[selectedinvitem];
                    var selectedcatitem = 0;
                    for (var i = 0; i < $scope.InvestigationDetails.AllInvestigationCategory.length; i++) {
                        for (var j = 0; j < $scope.InvestigationDetails.AllInvestigations.length; j++) {
                            if ($scope.InvestigationDetails.AllInvestigations[j].CategoryId !== 1 && $scope.InvestigationDetails.AllInvestigations[j].CategoryId !== 2 && $scope.InvestigationDetails.AllInvestigations[j].CategoryId !== 3 && $scope.InvestigationDetails.AllInvestigations[j].CategoryId !== 4 && $scope.InvestigationDetails.AllInvestigations[j].CategoryId !== 5 && $scope.InvestigationDetails.AllInvestigations[j].CategoryId !== 6) {
                                if ($scope.InvestigationDetails.AllInvestigations[j].CategoryId === $scope.InvestigationDetails.AllInvestigationCategory[i].CategoryId) {
                                    //  $scope.InvestigationDetails.AllInvestigationCategory[i].ShowStamp = 'Y';
                                    //$scope.InvestigationDetails.AllInvestigationCategory[i].ShowDiv = 'Y';
                                    selectedcatitem = j;
                                }
                            }
                        }
                    }
                    //   $scope.InvestigationDetails.AllInvestigationCategory[selectedcatitem].ShowDiv = 'Y';
                    $rootScope.$broadcast('InitiateSubInvestigationParameters', {});
                }
            }
            if (resp.data.GlassPrescriptionObj !== undefined) {
                var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                // var object = {};
                angular.forEach(resp.data.GlassPrescriptionObj.newGlasses, function (item, ind) {
                    $scope.cacheStorageItem.PatientEyeGlassItems = [];
                    object = {

                        type: item.type,
                        RSphere: item.RSphere,
                        RCylinder: item.RCylinder,
                        RAxis: item.RAxis,
                        RPrism: item.RPrism,
                        RBase: item.RBase,
                        RVa: item.RVa,
                        RAdd: item.RAdd,
                        LSphere: item.LSphere,
                        LCylinder: item.LCylinder,
                        LAxis: item.LAxis,
                        LPrism: item.LPrism,
                        LBase: item.LBase,
                        LVa: item.LVa,
                        LAdd: item.LAdd
                    };
                    $scope.cacheStorageItem.PatientEyeGlassItems.push(object);

                });
                cacheStorageItem.PatientEyeGlassItems = $scope.cacheStorageItem.PatientEyeGlassItems;
                eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
                angular.forEach(resp.data.GlassPrescriptionObj.oldGlasses, function (item, ind) {
                    $scope.cacheStorageItem.PatientOldEyeGlassItems = [];
                    object = {

                        type: item.type,
                        RSphere: item.RSphere,
                        RCylinder: item.RCylinder,
                        RAxis: item.RAxis,
                        RPrism: item.RPrism,
                        RBase: item.RBase,
                        RVa: item.RVa,
                        RAdd: item.RAdd,
                        LSphere: item.LSphere,
                        LCylinder: item.LCylinder,
                        LAxis: item.LAxis,
                        LPrism: item.LPrism,
                        LBase: item.LBase,
                        LVa: item.LVa,
                        LAdd: item.LAdd
                    };
                    $scope.cacheStorageItem.PatientOldEyeGlassItems.push(object);
                });
                cacheStorageItem.PatientOldEyeGlassItems = $scope.cacheStorageItem.PatientOldEyeGlassItems;
                eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    }



    $scope.unaidPinholeFilter = function (item) {
        return item.InvestigationID === 1 || item.InvestigationID === 2;
    };
    $scope.refractionCycloplegicLcvaFilter = function (item) {
        return item.InvestigationID === 8 || item.InvestigationID === 3 || item.InvestigationID === 4;
    };
    $scope.Keretometer = function (item) {
        return item.InvestigationID === 11;
    };
    $scope.acceptenceCycloplegicAcceptence = function (item) {
        return item.InvestigationID === 5 || item.InvestigationID === 6 || item.InvestigationID === 10;
    };
    $scope.ocularDominanceFilter = function (item) {
        return item.InvestigationID === 9;
    };
    $scope.getCopyOfRefractionAcceptance = function (type) {
        if (type === 'Refraction') {
            //InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Cylindrical
        } else {
            var rightAddition = parseFloat($scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Adition);
            var leftAddition = parseFloat($scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Adition);
            $scope.glassArray = [{
                type: 'Distance',
                RSphere: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Spherical,
                RCylinder: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                RAxis: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Axis,
                RPrism: '',
                RBase: '',
                RVa: '',
                RAdd: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Adition,
                LSphere: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Spherical,
                LCylinder: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                LAxis: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Axis,
                LPrism: '',
                LBase: '',
                LVa: '',
                LAdd: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Adition
            },
            {
                type: 'Near',
                //RSphere: parseFloat($scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Spherical) + rightAddition,
                //RCylinder: parseFloat($scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Cylindrical) + rightAddition,

                RSphere: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Spherical ?
                    parseFloat($scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Spherical) + rightAddition : '',

                RCylinder: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Cylindrical ?
                    parseFloat($scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Cylindrical) + rightAddition : '',

                RAxis: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[0].InvestigationAttributes.Axis,
                RPrism: '',
                RBase: '',
                RVa: '',
                //LSphere: parseFloat($scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Spherical) + leftAddition,
                //LCylinder: parseFloat($scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Cylindrical) + leftAddition,
                LSphere: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Spherical ?
                    parseFloat($scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Spherical) + leftAddition : '',
                LCylinder: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Cylindrical ?
                    parseFloat($scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Cylindrical) + leftAddition : '',
                LAxis: $scope.InvestigationDetails.Htmlvisions[4].InvestigationOrgans[1].InvestigationAttributes.Axis,
                LPrism: '',
                LBase: '',
                LVa: ''
            }
            ];
        }
    };
    //$scope.changeNearValue = function (type, val) {
    //    if (val) {
    //        var value = parseFloat(val);
    //        if ($scope.glassArray.length === 1) {
    //            var obj = {
    //                type: 'Near',
    //                RSphere: '',
    //                RCylinder: '',
    //                RAxis: '',
    //                RPrism: '',
    //                RBase: '',
    //                RVa: '',
    //                LSphere: '',
    //                LCylinder: '',
    //                LAxis: '',
    //                LPrism: '',
    //                LBase: '',
    //                LVa: ''
    //            };
    //            $scope.glassArray.push(obj);
    //            if (type === 'Right') {
    //                $scope.glassArray[1].RSphere = parseFloat($scope.glassArray[0].RSphere) + value;
    //                $scope.glassArray[1].RCylinder = parseFloat($scope.glassArray[0].RCylinder) + value;
    //                $scope.glassArray[1].RAxis = parseFloat($scope.glassArray[0].RAxis) + value;
    //                $scope.glassArray[1].RPrism = parseFloat($scope.glassArray[0].RPrism) + value;
    //                $scope.glassArray[1].RBase = parseFloat($scope.glassArray[0].RBase) + value;
    //                $scope.glassArray[1].RVa = parseFloat($scope.glassArray[0].RVa) + value;
    //            }
    //            if (type === 'Left') {
    //                $scope.glassArray[1].LSphere = parseFloat($scope.glassArray[0].LSphere) + value;
    //                $scope.glassArray[1].LCylinder = parseFloat($scope.glassArray[0].LCylinder) + value;
    //                $scope.glassArray[1].LAxis = parseFloat($scope.glassArray[0].LAxis) + value;
    //                $scope.glassArray[1].LPrism = parseFloat($scope.glassArray[0].LPrism) + value;
    //                $scope.glassArray[1].LBase = parseFloat($scope.glassArray[0].LBase) + value;
    //                $scope.glassArray[1].LVa = parseFloat($scope.glassArray[0].LVa) + value;
    //            }
    //            cacheStorageItem.PatientEyeGlassItems = $scope.glassArray;
    //            $scope.cacheStorageItem.PatientEyeGlassItems = $scope.glassArray;
    //            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    //        }
    //    }
    //};
    $scope.SaveGlasses = function () {
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        cacheStorageItem.mainVisionPrintArray.push({ type: 'eyeGlass', bindArray: $scope.glassArray });
        var obj = {
            RowID: '',
            CategoryID: '',
            CategoryDesc: 'patientGlasses',
            CategoryConditions: $scope.glassArray
        };

        cacheStorageItem.InvestigationDetails.push(obj);
        cacheStorageItem.PatientEyeGlassItems = $scope.glassArray;


        if ($scope.OldglassArray !== undefined) {
            var item = $scope.OldglassArray[0];
            if (item.RSphere === "" && item.RCylinder === "" && item.RAxis === "" && item.RPrism === "" && item.RBase === "" && item.RVa === "" && item.RAdd === "" && item.LSphere === "" && item.LCylinder === "" && item.LAxis === "" && item.LPrism === "" && item.LBase === "" && item.LVa === "" && item.LAdd === "") {
                $scope.chkOldglass = false;

            }
            else {
                $scope.chkOldglass = true;

            }
        }
        cacheStorageItem.PatientOldEyeGlassItems = $scope.OldglassArray;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    };
    $scope.$on("EasyModeToInvestigation", function (event) {
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.glassArray = cacheStorageItem.PatientEyeGlassItems;
        if (cacheStorageItem.PatientOldEyeGlassItems[0]) {
            var item = cacheStorageItem.PatientOldEyeGlassItems[0];
            if (item.RSphere === "" && item.RCylinder === "" && item.RAxis === "" && item.RPrism === "" && item.RBase === "" && item.RVa === "" && item.RAdd === "" && item.LSphere === "" && item.LCylinder === "" && item.LAxis === "" && item.LPrism === "" && item.LBase === "" && item.LVa === "" && item.LAdd === "") {
                $scope.chkOldglass = false;
                // $scope.OldglassArray = cacheStorageItem.PatientOldEyeGlassItems;
            }
            else {
                $scope.chkOldglass = true;
                $scope.OldglassArray = cacheStorageItem.PatientOldEyeGlassItems;
            }
        }

        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);

    });
    function PrintInvestigationReport() {
        var docinfo = eHnoteMasterDataService.getUserInfo();
        printInfo = eHnoteMasterDataService.getAppointmentInfo();
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();


        $scope.TonometryPrintArray = [];

        if (cacheStorageItem.InvestigationDetails !== undefined) {
            for (var i = 0; i < cacheStorageItem.InvestigationDetails.length; i++) {
                if (cacheStorageItem.InvestigationDetails[i].CategoryID === 4) {
                    for (var j = 0; j < cacheStorageItem.InvestigationDetails[i].CategoryConditions.length; j++) {
                        var object = {
                            "Id": "",
                            "Name": "",
                            "RightEye": "",
                            "LeftEye": "",
                            "Time": "",
                            "Value": ""
                        };
                        if (cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationID === 4) {
                            object.Id = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationID;
                            object.Name = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationDesc;
                            object.Value = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].Value;
                            $scope.TonometryPrintArray.push(object);
                        } else {
                            object.Id = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationID;
                            object.Name = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationDesc;
                            object.RightEye = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues.RightEye;
                            object.LeftEye = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues.LeftEye;
                            object.Time = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues.Time;
                            $scope.TonometryPrintArray.push(object);
                        }
                    }
                }
            }
        }


        $scope.ocularmotilityRightEye = {};
        if (cacheStorageItem.ocularmotility !== undefined) {
            for (var i = 0; i < cacheStorageItem.ocularmotility.length; i++) {
                if (cacheStorageItem.ocularmotility[i].InvestigationAttributeDesc === "RightEye") {
                    var countd = 0;
                    if (cacheStorageItem.ocularmotility[i].OcularPositionValues !== undefined) {
                        for (var j = 0; j < cacheStorageItem.ocularmotility[i].OcularPositionValues.length; j++) {
                            if (cacheStorageItem.ocularmotility[i].OcularPositionValues[j].Value !== "") {
                                countd++;
                            }
                        }
                    }
                    if (countd > 0) {
                        $scope.ocularmotilityRightEye = cacheStorageItem.ocularmotility[i];
                    }
                }
            }
        }
        $scope.ocularmotilityLeftEye = {};
        if (cacheStorageItem.ocularmotility !== undefined) {
            for (var i = 0; i < cacheStorageItem.ocularmotility.length; i++) {
                if (cacheStorageItem.ocularmotility[i].InvestigationAttributeDesc === "LeftEye") {
                    var countD = 0;
                    if (cacheStorageItem.ocularmotility[i].OcularPositionValues !== undefined) {
                        for (var j = 0; j < cacheStorageItem.ocularmotility[i].OcularPositionValues.length; j++) {
                            if (cacheStorageItem.ocularmotility[i].OcularPositionValues[j].Value !== "") {
                                countD++;
                            }
                        }
                    }
                    if (countD > 0) {
                        $scope.ocularmotilityLeftEye = cacheStorageItem.ocularmotility[i];
                    }
                }
            }
        }
        var printObj = {
            "cacheStorageItem": cacheStorageItem,
            "followupNotes": cacheStorageItem.patientFollowupNotes,
            "patientinfo": eHnoteMasterDataService.getAppointmentInfo(),
            "doctorinfo": docinfo,
            "appointmentinfo": appointmentinfo,
            "clinicName": printInfo.ClinicName,
            "doctorFullName": printInfo.DoctorFullName,
            "doctorSpeciality": printInfo.DoctorSpeciality,
            "date": $scope.curDate.ConsultationDate,
            "OcularmotilityRightEye": $scope.ocularmotilityRightEye,
            "OcularmotilityLeftEye": $scope.ocularmotilityLeftEye,
            //"mainVisionPrintArray": cacheStorageItem.mainVisionPrintArray,

            "mainVisionPrintArray": $scope.mainVisionPrintArray,

            "mainColorVisionPrintArray": cacheStorageItem.mainColorVisionPrintArray,
            "TonometryPrintArray": $scope.TonometryPrintArray,
            "anteriorArray": $scope.AnteriorSegmentArray.length > 0 ? $scope.AnteriorSegmentArray : [],
            "PosteriorArray": $scope.PosteriorSegmentArray.length > 0 ? $scope.PosteriorSegmentArray : [],
            "AdditionalArray": $scope.AdditionalInvestgationArray.length > 0 ? $scope.AdditionalInvestgationArray : []
        };

        if ($scope.Main.printEamil) {
            printObj.patientinfo.EmailID = $scope.Main.printEamil;
        } else {
            printObj.patientinfo.EmailID = '';
        }
        if ($scope.Main.printAddress1 || $scope.Main.printAddress2) {
            printObj.patientinfo.Address1 = $scope.Main.printAddress1 || '';
            printObj.patientinfo.Address2 = $scope.Main.printAddress2 || '';
        } else {
            printObj.patientinfo.Address1 = '';
            printObj.patientinfo.Address2 = '';
        }
        eHnotePrintService.generateOpthaInvestigationPrint(printObj);
    }
    $scope.PrintInvestigation = function () {
        $("#invSubmitforOptho").modal("hide");
        $("#completeInv").modal("show");
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        $scope.printAll = '0';
        UpdateInvestigationToCache();
        $scope.loadVisionFromCache();
        $scope.PrintFlagArray = cacheStorageItem.PrintFlagArray;
        $scope.PrintFlagArray.forEach(function (item) {
            if (item.flag)
                item.isActive = true;
            else
                item.isActive = false;
        });
        // $scope.invSubmitforOptho();
    };
    $scope.PrintSelected = function () {
        var docinfo = eHnoteMasterDataService.getUserInfo();
        printInfo = eHnoteMasterDataService.getAppointmentInfo();
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        $scope.ocularmotilityRightEye = {};
        $scope.ocularmotilityLeftEye = {};
        $scope.visionselectedprintItem = false;

        if (cacheStorageItem.PrintFlagArray.length > 0) {
            cacheStorageItem.PrintFlagArray.forEach(function (item) {

                switch (item.type) {
                    case 'Vision':
                        $scope.visionselectedprintItem = item.isActive;
                        break;
                    case 'Color Vision':
                        $scope.colorvisionselectedprintItem = item.isActive;
                        break;
                    case 'Tonometry Test':
                        $scope.tonometryselectedprintItem = item.isActive;
                        break;

                    case 'Ocular Motility':
                        $scope.ocularmotilitySelectedprintItem = item.isActive;
                        break;


                    case 'Anterior':
                        $scope.AnteriorSelectedprintItem = item.isActive;
                        break;

                    case 'Posterior':
                        $scope.posteriorselectedprintItem = item.isActive;
                        break;

                    case 'Additional Investigations':
                        $scope.additionalselectedprintItem = item.isActive;
                        break;


                }

            });
        }


        if ($scope.ocularmotilitySelectedprintItem) {

            if (cacheStorageItem.ocularmotility !== undefined) {
                for (var i = 0; i < cacheStorageItem.ocularmotility.length; i++) {
                    if (cacheStorageItem.ocularmotility[i].InvestigationAttributeDesc === "RightEye") {
                        var countd = 0;
                        if (cacheStorageItem.ocularmotility[i].OcularPositionValues !== undefined) {
                            for (var j = 0; j < cacheStorageItem.ocularmotility[i].OcularPositionValues.length; j++) {
                                if (cacheStorageItem.ocularmotility[i].OcularPositionValues[j].Value !== "") {
                                    countd++;
                                }
                            }
                        }
                        if (countd > 0) {
                            $scope.ocularmotilityRightEye = cacheStorageItem.ocularmotility[i];
                        }
                    }
                }
            }
            if (cacheStorageItem.ocularmotility !== undefined) {
                for (var i = 0; i < cacheStorageItem.ocularmotility.length; i++) {
                    if (cacheStorageItem.ocularmotility[i].InvestigationAttributeDesc === "LeftEye") {
                        var countD = 0;
                        if (cacheStorageItem.ocularmotility[i].OcularPositionValues !== undefined) {
                            for (var j = 0; j < cacheStorageItem.ocularmotility[i].OcularPositionValues.length; j++) {
                                if (cacheStorageItem.ocularmotility[i].OcularPositionValues[j].Value !== "") {
                                    countD++;
                                }
                            }
                        }
                        if (countD > 0) {
                            $scope.ocularmotilityLeftEye = cacheStorageItem.ocularmotility[i];
                        }
                    }
                }
            }
        }

        if ($scope.colorvisionselectedprintItem) {
            $scope.mainColorVisionArray = cacheStorageItem.mainColorVisionPrintArray;
        }

        if ($scope.tonometryselectedprintItem) {
            $scope.TonometryPrintArray = [];

            if (cacheStorageItem.InvestigationDetails !== undefined) {
                for (var i = 0; i < cacheStorageItem.InvestigationDetails.length; i++) {
                    if (cacheStorageItem.InvestigationDetails[i].CategoryID === 4) {
                        for (var j = 0; j < cacheStorageItem.InvestigationDetails[i].CategoryConditions.length; j++) {
                            var object = {
                                "Id": "",
                                "Name": "",
                                "RightEye": "",
                                "LeftEye": "",
                                "Time": "",
                                "Value": ""
                            };
                            if (cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationID === 4) {
                                object.Id = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationID;
                                object.Name = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationDesc;
                                object.Value = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].Value;
                                $scope.TonometryPrintArray.push(object);
                            } else {
                                object.Id = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationID;
                                object.Name = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationDesc;
                                object.RightEye = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues.RightEye;
                                object.LeftEye = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues.LeftEye;
                                object.Time = cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues.Time;
                                $scope.TonometryPrintArray.push(object);
                            }
                        }
                    }
                }
            }

        }

        var printObj = {
            "cacheStorageItem": cacheStorageItem,
            "followupNotes": cacheStorageItem.patientFollowupNotes,
            "patientinfo": eHnoteMasterDataService.getAppointmentInfo(),
            "doctorinfo": docinfo,
            "appointmentinfo": appointmentinfo,
            "clinicName": printInfo.ClinicName,
            "doctorFullName": printInfo.DoctorFullName,
            "doctorSpeciality": printInfo.DoctorSpeciality,
            "date": $scope.curDate.ConsultationDate,
            "VisitReason": cacheStorageItem.VisitReason,
            "printType": "SUMMARY",
            "displayID": $scope.Main.DisplayID,
            "OcularmotilityRightEye": $scope.ocularmotilitySelectedprintItem ? $scope.ocularmotilityRightEye : [],
            "OcularmotilityLeftEye": $scope.ocularmotilitySelectedprintItem ? $scope.ocularmotilityLeftEye : [],
            "mainVisionPrintArray": $scope.visionselectedprintItem ? cacheStorageItem.mainVisionPrintArray : [],
            "mainColorVisionPrintArray": $scope.colorvisionselectedprintItem ? $scope.mainColorVisionArray : [],
            "TonometryPrintArray": $scope.tonometryselectedprintItem ? $scope.TonometryPrintArray : [],
            "anteriorArray": $scope.AnteriorSelectedprintItem ? $scope.AnteriorSegmentArray : [],
            "PosteriorArray": $scope.posteriorselectedprintItem ? $scope.PosteriorSegmentArray : [],
            "AdditionalArray": $scope.additionalselectedprintItem ? $scope.AdditionalInvestgationArray : []

        };
        if ($scope.Main.printEamil) {
            printObj.patientinfo.EmailID = $scope.Main.printEamil;
        } else {
            printObj.patientinfo.EmailID = '';
        }
        if ($scope.Main.printAddress1 || $scope.Main.printAddress2) {
            printObj.patientinfo.Address1 = $scope.Main.printAddress1 || '';
            printObj.patientinfo.Address2 = $scope.Main.printAddress2 || '';
        } else {
            printObj.patientinfo.Address1 = '';
            printObj.patientinfo.Address2 = '';
        }
        //eHnotePrintService.generateSummaryPrint(printObj);
        eHnotePrintService.generateOpthaInvestigationPrint(printObj);
    };
    $scope.GetDoctorInvestigationImg = function (urlArrary) {
        //var downloadDoc = url;
        //if (downloadDoc !== undefined) {
        //    if (downloadDoc.indexOf("http:") > -1 || downloadDoc.indexOf("https:") > -1) {
        //        $scope.arrayImgdoc = [];
        //        $scope.arrayImgdoc.push({
        //            "url": downloadDoc,
        //            "thumbUrl": downloadDoc
        //        });

        //        Lightbox.openModal($scope.arrayImgdoc, 0);
        //    }
        //    else if (downloadDoc.indexOf("data:application/pdf;base64,") > -1) {
        //        window.open(downloadDoc);
        //    }
        //}

        if (urlArrary.length > 0)
            Lightbox.openModal(urlArrary, 0);
    };




    if ($scope.OldglassArray.length > 0) {
        $scope.OldglassArray = cacheStorageItem.PatientOldEyeGlassItems;
        //eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    }


    function PastGlasses() {

        if ($scope.cacheStorageItem.ConsultationType === "ContinueConsultaion") {
            angular.forEach($scope.cacheStorageItem.PastConsultationData.caseHistroy, function (item) {
                $scope.OldglassArray = item.GlassPrescrptionDetails.GlassDetails;
            });
        }
        else if ($scope.cacheStorageItem.ConsultationType === "startConsultaion") {
            angular.forEach($scope.cacheStorageItem.PastConsultationData, function (item1) {
                angular.forEach(item1.caseHistroy, function (item) {
                    $scope.OldglassArray = item.GlassPrescrptionDetails.GlassDetails;
                });
            });
        }

        if ($scope.OldglassArray.length > 0) {
            cacheStorageItem.PatientOldEyeGlassItems = $scope.OldglassArray;
            eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
        }

    }

    //$scope.invglasses = function () {
    //    cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    //    if (cacheStorageItem.PatientEyeGlassItems !== undefined) {
    //        $scope.glassArray = cacheStorageItem.PatientEyeGlassItems;
    //    } else {
    //        $scope.glassArray = [{
    //            type: 'Distance',
    //            RSphere: '',
    //            RCylinder: '',
    //            RAxis: '',
    //            RPrism: '',
    //            RBase: '',
    //            RVa: '',
    //            RAdd: '',
    //            LSphere: '',
    //            LCylinder: '',
    //            LAxis: '',
    //            LPrism: '',
    //            LBase: '',
    //            LVa: '',
    //            LAdd: ''
    //        },
    //  {
    //      type: 'Near',
    //      RSphere: '',
    //      RCylinder: '',
    //      RAxis: '',
    //      RPrism: '',
    //      RBase: '',
    //      RVa: '',
    //      LSphere: '',
    //      LCylinder: '',
    //      LAxis: '',
    //      LPrism: '',
    //      LBase: '',
    //      LVa: ''
    //  }
    //        ];
    //    }
    //    if (cacheStorageItem.PatientOldEyeGlassItems !== undefined) {
    //        $scope.OldglassArray = cacheStorageItem.PatientOldEyeGlassItems;
    //    } else {
    //        $scope.OldglassArray = [{
    //            type: 'Distance',
    //            RSphere: '',
    //            RCylinder: '',
    //            RAxis: '',
    //            RPrism: '',
    //            RBase: '',
    //            RVa: '',
    //            RAdd: '',
    //            LSphere: '',
    //            LCylinder: '',
    //            LAxis: '',
    //            LPrism: '',
    //            LBase: '',
    //            LVa: '',
    //            LAdd: ''
    //        },
    //      {
    //       type: 'Near',
    //       RSphere: '',
    //       RCylinder: '',
    //       RAxis: '',
    //       RPrism: '',
    //       RBase: '',
    //       RVa: '',
    //       LSphere: '',
    //       LCylinder: '',
    //       LAxis: '',
    //       LPrism: '',
    //       LBase: '',
    //       LVa: ''
    //      }
    //        ];
    //    }
    //};



    $scope.invglasses = function () {
        cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        if (cacheStorageItem.PatientEyeGlassItems !== undefined) {
            $scope.glassArray = cacheStorageItem.PatientEyeGlassItems;
        }
        if (cacheStorageItem.PatientOldEyeGlassItems !== undefined) {
            $scope.OldglassArray = cacheStorageItem.PatientOldEyeGlassItems;
        }
    };

    function loadAdditionalInvestigation() {
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        if (cacheStorageItem.AllInvestigationCategory && cacheStorageItem.AllInvestigationCategory.length > 0)
            $scope.InvestigationDetails.AllInvestigations = cacheStorageItem.AllInvestigationCategory;

        cacheStorageItem.AllInvestigationCategory.forEach(function (item, index) {
            if (item.CategoryId !== 1 && item.CategoryId !== 2 && item.CategoryId !== 3 && item.CategoryId !== 4 && item.CategoryId !== 5 && item.CategoryId !== 6) {
                if (item.IsSelected === 'Y') {

                    $scope.InvestigationDetails.AllInvestigations.forEach(function (initem, innerIndex) {

                        if (initem.CategoryId === item.CategoryId) {
                            $scope.InvestigationDetails.AllInvestigations[innerIndex] = item;

                        }
                    });
                }
            }

        });

    }



}]);
"use strict";

eHnoteWebApp.controller("EhnotePastVisitsCtrl", ["$scope", "$rootScope", "alertify", "$filter", "$timeout", "$uibModal", "eHnoteCacheStorageService", "eHnoteSettingsDataService", 'eHnotePatientDataService', "eHnoteMasterDataService", "eHnoteDiagnosisDataServices", function ($scope, $rootScope, alertify, $filter, $timeout, $uibModal, eHnoteCacheStorageService, eHnoteSettingsDataService, eHnotePatientDataService, eHnoteMasterDataService, eHnoteDiagnosisDataServices) {
    
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.MainTabTab = 2;
    $scope.SummaryTab = 1;
    $scope.Patientid = $scope.cacheStorageItem.PatientID;
    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.SubTab = 1;
    function GetIOPGraphObj() {
        return {
            "IsShowgraph": false,
            "ShowCCIOP": false,
            "IsIOPGraphArrayEmpty": false
        }
    };
    $scope.IOPGraphObj = GetIOPGraphObj();

    function GetMRGraphObj() {
        return {
            "IsShowMRgraph": false,
            "IsMRArrayEmpty": false
        }
    };
    $scope.MRGraphObj = GetMRGraphObj();

    function GetVAGraphObj() {
        return {
            "IsShowVAgraph": false,
            "IsVisualAcuityArrayEmpty": false
        }
    };
    $scope.VisualAcuityGraphObj = GetVAGraphObj();

    function GetRetinaGraphObj() {
        return {
            "IsShowRetinagraph": false,
            "IsRetinaArrayEmpty": false,
        }
    };
    $scope.RetinaGraphObj = GetRetinaGraphObj();

    function GetRetinaFilterObj() {
        return {
            "RetinaPopoverOpen": false,
            "IsSelectedFilterOrgan": null,
            "IsSelectedInjectionProceduresOnly": false,
            "IsSelectedLaserProceduresOnly": false,
            "IsSelectedSurgeryProceduresOnly": false,
        }
    };
    $scope.RetinaFilterObj = GetRetinaFilterObj();

    $scope.loadPreviousData = function (subtabid) {

        $scope.SummaryTab = subtabid || 1;
        $scope.PreviousTonometryArray = [];
        $scope.PreviousVisionDetails = [];
        $scope.PreviousRetinoscopyrefraction = [];
        $scope.PreviousAutoRefraction = [];
        $scope.PreviousCycloplegicRefractionDetails = [];
        $scope.PreviousPGPRefractionDetails = [];
        $scope.PreviousOverRefraction = [];
        $scope.PreviousFinalGlassRx = [];
        $scope.PreviousManifestRefraction = [];
        $scope.PreviousKeratometry = [];
        $scope.PreviousPachymetry = [];

        if ($scope.PreviousInvestigations.length > 0) {
            angular.forEach($scope.PreviousInvestigations, function (item, index) {
                if (item.Tonometry != undefined) {
                    if (item.Tonometry.length > 0) {
                        //$scope.SummaryTab = 4;
                        $scope.PreviousTonometryArray.push(item);
                        if ($scope.PreviousTonometryArray.length > 0) {
                            /*$scope.IsPreviousTonoData = true;*/
                            $scope.IOPGraphObj.IsShowgraph = false;
                            $scope.IOPGraphObj.IsIOPGraphArrayEmpty = false;


                            //$scope.IsPreviousVisionDetailsData = false;
                            //$scope.IsSummary = false;
                        }
                    }
                }
                if (item.VisionDetails != undefined) {
                    if (item.VisionDetails.length > 0) {
                        //$scope.SummaryTab = 2;
                        $scope.PreviousVisionDetails.push(item);
                        if ($scope.PreviousVisionDetails.length > 0) {

                            $scope.IsSummary = false;
                            angular.forEach($scope.PreviousVisionDetails, function (i) {
                                angular.forEach(i.VisionDetails, function (item) {
                                    item.IsInvDataAdded = false;
                                    if (item.ActiveInd === 'N') {
                                        item.IsInvDataAdded = false;
                                    }
                                    if (item.ActiveInd === 'Y') {
                                        if (item.InvestigationId === 4 || item.InvestigationId === 5 || item.InvestigationId === 12 || item.InvestigationId === 13 ||
                                            item.InvestigationId === 2071 || item.InvestigationId === 2073 || item.InvestigationId === 2154 || item.InvestigationId === 2076) {
                                            if (item.RightEyeValues.Distance !== "" || item.RightEyeValues.Near !== "" || item.RightEyeValues.Remarks !== "" ||
                                                item.LeftEyeValues.Distance !== "" || item.LeftEyeValues.Near !== "" || item.LeftEyeValues.Remarks !== "" ||
                                                (item.BothEyeValues.BDistance !== "") || item.BothEyeValues.BNear !== "" || (item.BothEyeValues.Remarks !== "" && item.BothEyeValues.Remarks !== undefined) ||
                                                item.Value !== "" || item.Remarks !== "") {
                                                item.IsInvDataAdded = true;

                                            }

                                        }

                                    }
                                });
                            });
                        }
                    }
                }
                if (item.AutoRefraction != undefined) {
                    if (item.AutoRefraction.length > 0) {
                        //$scope.SummaryTab = 3;
                        angular.forEach(item.AutoRefraction, function (kitem) {
                            kitem.IsDataAdded = false;
                            if (kitem.ActiveInd === 'Y') {
                                if (kitem.RSpherical !== "" || kitem.RCylindrical !== "" || kitem.RAxis !== "" ||
                                    kitem.LSpherical !== "" || kitem.LCylindrical !== "" || kitem.LAxis !== "") {
                                    kitem.IsDataAdded = true;
                                }
                                $scope.PreviousAutoRefraction.push(item);
                                if ($scope.PreviousAutoRefraction.length > 0) {
                                    //$scope.Refractionsobj.IsPreviousAutoRefraction = true;
                                    $scope.MRGraphObj.IsShowMRgraph = false;
                                    $scope.MRGraphObj.IsMRArrayEmpty = false;
                                }
                            }
                        })


                    }
                }
                if (item.Retinoscopyrefraction != undefined) {
                    if (item.Retinoscopyrefraction.length > 0) {
                        //$scope.SummaryTab = 3;
                        angular.forEach(item.Retinoscopyrefraction, function (kitem) {
                            kitem.IsDataAdded = false;
                            if (kitem.ActiveInd === 'Y') {
                                if (kitem.RSpherical !== "" || kitem.RCylindrical !== "" || kitem.RAxis !== "" ||
                                    kitem.LSpherical !== "" || kitem.LCylindrical !== "" || kitem.LAxis !== "") {
                                    kitem.IsDataAdded = true;
                                }
                                $scope.PreviousRetinoscopyrefraction.push(item);
                                if ($scope.PreviousRetinoscopyrefraction.length > 0) {
                                    //$scope.Refractionsobj.IsPreviousRT = true;
                                    //$scope.IsSummary = false;
                                    $scope.MRGraphObj.IsShowMRgraph = false;
                                    $scope.MRGraphObj.IsMRArrayEmpty = false;
                                }
                            }
                        })
                    }
                }
                if (item.ManifestRefraction != undefined) {
                    if (item.ManifestRefraction.length > 0) {
                        //$scope.SummaryTab = 3;
                        angular.forEach(item.ManifestRefraction, function (kitem) {
                            kitem.IsDataAdded = false;
                            if (kitem.ActiveInd === 'Y') {
                                if (kitem.RSpherical !== '' || kitem.RCylindrical !== '' || kitem.RAxis !== '' || kitem.RAdition !== '' || kitem.RBCVA !== '' || kitem.RBCNVA !== '' || kitem.RVAI !== '' || kitem.RDuo !== '' || kitem.RCs !== '' ||
                                    kitem.RPrismVt !== '' || kitem.RBaseVt !== '' || kitem.RPrismHz !== '' || kitem.RBaseHz !== '' || kitem.RType !== '' || kitem.LSpherical !== '' || kitem.LCylindrical !== '' || kitem.LCylindrical !== '' || kitem.LAdition !== '' || kitem.LBCVA !== '' ||
                                    kitem.LBCNVA !== '' || kitem.LVAI !== '' || kitem.LDuo !== '' || kitem.LCs !== '' || kitem.LPrismVt !== '' || kitem.LPrismVt !== '' ||
                                    kitem.LPrismHz !== '' || kitem.LBaseHz !== '' || kitem.LType !== '' || kitem.BBCVA !== '' || kitem.BBCNVA !== '' || kitem.BVAI !== '' || kitem.BDuo !== '' || kitem.BCs !== '') {
                                    kitem.IsDataAdded = true;
                                }
                                $scope.PreviousManifestRefraction.push(item);
                                if ($scope.PreviousManifestRefraction.length > 0) {
                                    //$scope.Refractionsobj.IsPreviousMR = true;
                                    //$scope.IsSummary = false;
                                    $scope.MRGraphObj.IsShowMRgraph = false;
                                    $scope.MRGraphObj.IsMRArrayEmpty = false;
                                }
                            }
                        })
                    }
                }
                if (item.CycloplegicRefractionArray != undefined) {
                    if (item.CycloplegicRefractionArray.length > 0) {
                        //$scope.SummaryTab = 3;
                        angular.forEach(item.CycloplegicRefractionArray, function (kitem) {
                            kitem.IsDataAdded = false;
                            if (kitem.ActiveInd === 'Y') {
                                if (kitem.RCylindrical !== "" || kitem.RSpherical !== "" || kitem.RAxis !== "" || kitem.RAdition !== "" || kitem.RBCNVA !== "" || kitem.RVAI !== "" ||
                                    kitem.LCylindrical !== "" || kitem.LSpherical !== "" || kitem.LAxis !== "" || kitem.LAdition !== "" || kitem.LBCVA !== "" || kitem.LBCNVA !== "" || kitem.LVAI !== "" ||
                                    kitem.BBCVA !== "" || kitem.BBCNVA !== "" || kitem.BVAI !== "") {
                                    kitem.IsDataAdded = true;
                                }
                                $scope.PreviousCycloplegicRefractionDetails.push(item);
                                if ($scope.PreviousCycloplegicRefractionDetails.length > 0) {
                                    //$scope.Refractionsobj.PreviousCR = true;
                                    //$scope.IsSummary = false;
                                    $scope.MRGraphObj.IsShowMRgraph = false;
                                    $scope.MRGraphObj.IsMRArrayEmpty = false;
                                }
                            }
                        })
                    }
                }
                if (item.PGPrefractionArray != undefined) {
                    if (item.PGPrefractionArray.length > 0) {
                        //$scope.SummaryTab = 3;
                        angular.forEach(item.PGPrefractionArray, function (kitem) {
                            kitem.IsDataAdded = false;
                            if (kitem.ActiveInd === 'Y') {
                                if (kitem.RSpherical !== "" || kitem.RCylindrical !== "" || kitem.RAxis !== "" || kitem.RAdition !== "" || kitem.RPrismVt !== "" || kitem.RBaseVt !== "" || kitem.RPrismHz !== "" || kitem.RBaseHz !== "" ||
                                    kitem.LSpherical !== "" || kitem.LCylindrical !== "" || kitem.LAxis !== "" || kitem.LAdition !== "" || kitem.LPrismVt !== "" || kitem.LBaseVt !== "" || kitem.LPrismHz !== "" || kitem.LBaseHz !== "") {
                                    kitem.IsDataAdded = true;
                                }
                                $scope.PreviousPGPRefractionDetails.push(item);
                                if ($scope.PreviousPGPRefractionDetails.length > 0) {
                                    //$scope.Refractionsobj.IsPreviousPGP = true;
                                    //$scope.IsSummary = false;
                                    $scope.MRGraphObj.IsShowMRgraph = false;
                                    $scope.MRGraphObj.IsMRArrayEmpty = false;
                                }
                            }
                        })
                    }
                }
                if (item.OverRefractionArray != undefined) {
                    if (item.OverRefractionArray.length > 0) {
                        //$scope.SummaryTab = 3;
                        angular.forEach(item.OverRefractionArray, function (kitem) {
                            kitem.IsDataAdded = false;
                            if (kitem.ActiveInd === 'Y') {
                                if (kitem.RCylindrical !== '' || kitem.RSpherical !== '' || kitem.RAxis !== '' || kitem.RAdition !== '' || kitem.RBCVA !== '' || kitem.RBCNVA !== '' || kitem.RVAI !== '' ||
                                    kitem.LCylindrical !== '' || kitem.LSpherical !== '' || kitem.LAxis !== '' || kitem.LAdition !== '' || kitem.LBCVA !== '' || kitem.LBCNVA !== '' || kitem.LVAI !== '' ||
                                    kitem.BBCVA !== '' || kitem.BBCNVA !== '' || kitem.BVAI !== '') {
                                    kitem.IsDataAdded = true;
                                }
                                $scope.PreviousOverRefraction.push(item);
                                if ($scope.PreviousOverRefraction.length > 0) {
                                    //$scope.Refractionsobj.PreviousOR = true;
                                    //$scope.IsSummary = false;
                                    $scope.MRGraphObj.IsShowMRgraph = false;
                                    $scope.MRGraphObj.IsMRArrayEmpty = false;
                                }
                            }
                        })
                    }
                }
                if (item.FinalGlassRxArray != undefined) {
                    if (item.FinalGlassRxArray.length > 0) {
                        //$scope.SummaryTab = 3;
                        angular.forEach(item.FinalGlassRxArray, function (kitem) {
                            kitem.IsDataAdded = false;
                            if (kitem.DeleteInd === 'N') {
                                if (kitem.RSpherical !== '' || kitem.RCylindrical !== '' || kitem.RAxis !== '' || kitem.RAdition !== '' || kitem.RBCVA !== '' || kitem.RBCVA !== '' || kitem.RVAI !== '' || kitem.RPrismVt !== '' ||
                                    kitem.RBaseVt !== '' || kitem.RPrismHz !== '' || kitem.RBaseHz !== '' || kitem.RType !== '' || kitem.LSpherical !== '' || kitem.LCylindrical !== '' || kitem.LAxis !== '' || kitem.LAdition !== '' ||
                                    kitem.LBCVA !== '' || kitem.LBCNVA !== '' || kitem.LVAI !== '' || kitem.LPrismVt !== '' || kitem.LBaseVt !== '' || kitem.LPrismHz !== '' || kitem.LBaseHz !== '' || kitem.LType !== '') {
                                    kitem.IsDataAdded = true;
                                }
                                $scope.PreviousFinalGlassRx.push(item);
                                if ($scope.PreviousFinalGlassRx.length > 0) {
                                    //$scope.Refractionsobj.PreviousFGR = true;
                                    //$scope.IsSummary = false;
                                    $scope.MRGraphObj.IsShowMRgraph = false;
                                    $scope.MRGraphObj.IsMRArrayEmpty = false;
                                }
                            }
                        })
                    }
                }
                if (item.Keratometry != undefined) {
                    if (item.Keratometry.length > 0) {
                        $scope.PreviousKeratometry.push(item);
                        if ($scope.PreviousKeratometry.length > 0) {
                            //$scope.IsKErotometryprevious = true;
                            //$scope.IsPreviousVisionDetailsData = false;
                        }
                    }
                }
                if (item.Pachymetry != undefined) {
                    if (item.Pachymetry.length > 0) {
                        $scope.PreviousPachymetry.push(item);
                        if ($scope.PreviousPachymetry.length > 0) {
                            //$scope.IsPachymetryprevious = true;
                            //$scope.IsKErotometryprevious = false;
                            //$scope.IsPreviousVisionDetailsData = false;
                        }
                    }
                }

            });
        }

        $scope.IsRefractionHistoryPopupArrayEmpty = false;
        if ($scope.PreviousAutoRefraction.length == 0 && $scope.PreviousRetinoscopyrefraction.length == 0 && $scope.PreviousManifestRefraction.length == 0 && $scope.PreviousCycloplegicRefractionDetails.length == 0 && $scope.PreviousPGPRefractionDetails.length == 0 && $scope.PreviousOverRefraction.length == 0 && $scope.PreviousFinalGlassRx.length == 0) {
            $scope.IsRefractionHistoryPopupArrayEmpty = true;
        }

        $scope.IsTonometryHistoryPopupArrayEmpty = false;
        if ($scope.PreviousTonometryArray.length == 0) {
            $scope.IsTonometryHistoryPopupArrayEmpty = true;
        }
    };

    $scope.GetPreviousInvestigationData = function (item, subtabid) {
        let InvestigationId = "";
        item = item||[];
        if (subtabid == 2) {
            $scope.VisualAcuityGraphObj.IsShowVAgraph = false;
            $scope.VisualAcuityGraphObj.IsVisualAcuityArrayEmpty = false;
        }
        //var count = 0;
        //if (item.length >= 0) {
        //    for (let i in item) {
        //        count = count + 1;
        //        if (count !== (item.length + 1)) {
        //            InvestigationId += "," + item[i].InvestigationId;
        //        }

        //    }
        //    if (InvestigationId.charAt(0) === ",") {
        //        InvestigationId = InvestigationId.slice(1);
        //    }

        //} else {
        //    InvestigationId = item.InvestigationId.toString() || "";
        //}

        if (item.length == 0) {
            var CategoryId = 1;

            if (subtabid == 2) {
                InvestigationId = '2071,4,5,13,2154,12,2076';
            } else if (subtabid == 3) {
                InvestigationId = '2074,2112,2113,2114,2116,2118,2121';
            } else if (subtabid == 4) {
                InvestigationId = '21,19,814,20,22,771';
            } else { }
        }

        var obj = {
            "CategoryId": CategoryId || 1,
            "InvestigationId": InvestigationId,
            "PatientId": $scope.Patientid
        };
        eHnotePatientDataService.GetVisionPreviousHistoryData(obj).then(function (resp) {
            $scope.PreviousInvestigations = [];
            $scope.FiteredInvestigationsArray = [];
            if (resp.data.rows != undefined) {
                $scope.PreviousInvestigations = resp.data.rows;
                $scope.FiteredInvestigationsArray = resp.data.rows;
            }
            if ($scope.PreviousInvestigations.length > 0) {
                angular.forEach($scope.PreviousInvestigations, function (item, index) {
                    item.VAScrollIndex = "ConsultationScrollAtive" + index;
                });
                $scope.PreviousInvestigations[0].IsActive = true;
                $scope.loadPreviousData(subtabid);
            }

            var FilteredArray = [];

            var checklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true }, true) || [];
            var Archecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 1 }, true) || [];
            var Retinochecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 2 }, true) || [];
            var PGPchecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 3 }, true) || [];
            var MFchecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 4 }, true) || [];
            var CRchecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 5 }, true) || [];
            var ORchecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 6 }, true) || [];
            var FGRchecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 7 }, true) || [];

            if (checklist.length > 0) {
                angular.forEach($scope.PreviousInvestigations, function (citem) {
                    var newobj = {
                        "AppointmentDate": citem.AppointmentDate,
                        "VisionDetails": [],
                        "Tonometry": [],
                        "AutoRefraction": [],
                        "Retinoscopyrefraction": [],
                        "ManifestRefraction": [],
                        "CycloplegicRefractionArray": [],
                        "PGPrefractionArray": [],
                        "FinalGlassRxArray": [],
                        "OverRefractionArray": [],
                        "GlassDetails": [],
                        "Keratometry": [],
                        "Pachymetry": []
                    };

                    //Checking if RefractionData Available


                    if (Archecklist.length > 0) {
                        newobj.AutoRefraction = citem.AutoRefraction;
                    }
                    if (Retinochecklist.length > 0) {
                        newobj.Retinoscopyrefraction = citem.Retinoscopyrefraction;
                    }

                    if (MFchecklist.length > 0) {
                        newobj.ManifestRefraction = citem.ManifestRefraction;
                    }
                    if (CRchecklist.length > 0) {
                        newobj.CycloplegicRefractionArray = citem.CycloplegicRefractionArray;
                    }

                    if (PGPchecklist.length > 0) {
                        newobj.PGPrefractionArray = citem.PGPrefractionArray;
                    }
                    if (FGRchecklist.length > 0) {
                        newobj.FinalGlassRxArray = citem.FinalGlassRxArray;
                    }
                    if (ORchecklist.length > 0) {
                        newobj.OverRefractionArray = citem.OverRefractionArray;
                    }


                    //Checking if OD and OS values available
                    angular.forEach(newobj.AutoRefraction, function (aitem) {
                        aitem.IsOdValuesAvailable = false;
                        aitem.IsOsValuesAvailable = false;

                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "") {
                            aitem.IsOdValuesAvailable = true;
                        }
                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "") {
                            aitem.IsOsValuesAvailable = true;
                        }
                    });

                    angular.forEach(newobj.Retinoscopyrefraction, function (aitem) {
                        aitem.IsOdValuesAvailable = false;
                        aitem.IsOsValuesAvailable = false;

                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "") {
                            aitem.IsOdValuesAvailable = true;
                        }
                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "") {
                            aitem.IsOsValuesAvailable = true;
                        }
                    })

                    angular.forEach(newobj.ManifestRefraction, function (aitem) {
                        aitem.IsOdValuesAvailable = false;
                        aitem.IsOsValuesAvailable = false;
                        aitem.IsOuValuesAvailable = false;

                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "" || aitem.RAdition != "" || aitem.RPrismVt != "" || aitem.RPrismHz != "" || aitem.RBaseVt != "" || aitem.RBaseHz != "" || aitem.RBCVA != "" || aitem.RBCNVA != "" || aitem.RVAI != "" || aitem.RDuo != "" || aitem.RCs != "" || aitem.RType != "") {
                            aitem.IsOdValuesAvailable = true;
                        }
                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "" || aitem.LAdition != '' || aitem.LPrismVt != '' || aitem.LPrismHz != '' || aitem.LBaseVt != '' || aitem.LBaseHz != '' || aitem.LBCVA != '' || aitem.LBCNVA != '' || aitem.LVAI != '' || aitem.LDuo != '' || aitem.LCs != '' || aitem.LType != '') {
                            aitem.IsOsValuesAvailable = true;
                        }
                        if (aitem.BBCVA != '' || aitem.BBCNVA != '' || aitem.BVAI != '' || aitem.BDuo != '' || aitem.BCs != '') {
                            aitem.IsOuValuesAvailable = true;
                        }

                    });

                    angular.forEach(newobj.PGPrefractionArray, function (aitem) {
                        aitem.IsOdValuesAvailable = false;
                        aitem.IsOsValuesAvailable = false;

                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "" || aitem.RAdition != "" || aitem.RPrismVt != "" || aitem.RBaseVt != "" || aitem.RBaseHz != "" || aitem.RPrismHz != "") {
                            aitem.IsOdValuesAvailable = true;
                        }

                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "" || aitem.LAdition != "" || aitem.LPrismVt != "" || aitem.LBaseVt != "" || aitem.LBaseHz != "" || aitem.LPrismHz != "") {
                            aitem.IsOsValuesAvailable = true;
                        }
                    })

                    angular.forEach(newobj.CycloplegicRefractionArray, function (aitem) {
                        aitem.IsOdValuesAvailable = false;
                        aitem.IsOsValuesAvailable = false;
                        aitem.IsOuValuesAvailable = false;

                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "" || aitem.RAdition != "" || aitem.RBCVA != "" || aitem.RBCNVA != "" || aitem.RVAI != "") {
                            aitem.IsOdValuesAvailable = true;
                        }

                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "" || aitem.LAdition != "" || aitem.LBCVA != "" || aitem.LBCNVA != "" || aitem.LVAI != "") {
                            aitem.IsOsValuesAvailable = true;
                        }

                        if (aitem.BBCVA != "" || aitem.BBCNVA != "" || aitem.BVAI != "") {
                            aitem.IsOuValuesAvailable = true;
                        }
                    });
                    angular.forEach(newobj.OverRefractionArray, function (aitem) {
                        aitem.IsOdValuesAvailable = false;
                        aitem.IsOsValuesAvailable = false;
                        aitem.IsOuValuesAvailable = false;

                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "" || aitem.RAdition != "" || aitem.RBCVA != "" || aitem.RBCNVA != "" || aitem.RVAI != "") {
                            aitem.IsOdValuesAvailable = true;
                        }

                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "" || aitem.LAdition != "" || aitem.LBCVA != "" || aitem.LBCNVA != "" || aitem.LVAI != "") {
                            aitem.IsOsValuesAvailable = true;
                        }

                        if (aitem.BBCVA != "" || aitem.BBCNVA != "" || aitem.BVAI != "") {
                            aitem.IsOuValuesAvailable = true;
                        }
                    })

                    angular.forEach(newobj.FinalGlassRxArray, function (aitem) {
                        aitem.IsOdValuesAvailable = false;
                        aitem.IsOsValuesAvailable = false;

                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "" || aitem.RAdition != "" || aitem.RPrismVt != "" || aitem.RPrismHz != "" || aitem.RBaseVt != "" || aitem.RBaseHz != "" || aitem.RBCVA != "" || aitem.RBCNVA != "" || aitem.RVAI != "" || aitem.RType != "") {
                            aitem.IsOdValuesAvailable = true;
                        }
                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "" || aitem.LAdition != '' || aitem.LPrismVt != '' || aitem.LPrismHz != '' || aitem.LBaseVt != '' || aitem.LBaseHz != '' || aitem.LBCVA != '' || aitem.LBCNVA != '' || aitem.LVAI != '' || aitem.LType != '') {
                            aitem.IsOsValuesAvailable = true;
                        }
                    });

                    FilteredArray.push(newobj);
                });
            }
            $scope.FiteredInvestigationsArray = FilteredArray || [];
        });
    };

    $scope.GetPastVisitsDatesObj = function () {
        return {
            "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "DateType": "",
            "DefaultAll": true
        }
    };
    $scope.PastVisitsDatesObj = $scope.GetPastVisitsDatesObj();

    $scope.GetLatestDefaultSummaryDetails = function (type) {
        let params = {
            "PatientId": $scope.Patientid || 0,
            "OrganizationId": $scope.HospitalId,
            "PageNumber": 1,
            "PageSize": 5,
            "FromDate": $filter('date')(new Date($scope.PastVisitsDatesObj.FromDate), "yyyy-MM-dd"),
            "Todate": $filter('date')(new Date($scope.PastVisitsDatesObj.ToDate), "yyyy-MM-dd"),
            "DefaultAll": $scope.PastVisitsDatesObj.DefaultAll || false
        };
        eHnoteSettingsDataService.GetLatestDefaultSummaryDetails(params).then(function (response) {
            $scope.FilteredSummaryDetails = [];
            if (response.data.status === "Success") {
                $scope.FilteredSummaryDetails = angular.copy(response.data.rows);
                angular.forEach($scope.FilteredSummaryDetails, function (mitem) {
                    mitem.ScoreObject = angular.copy($scope.GetScoreObject());
                    if (mitem.PsychologicalObservationsArray.length !== 0) {
                        angular.forEach(mitem.PsychologicalObservationsArray, function (Aitem) {
                            if (Aitem.TypeId == 1) {
                                if (Aitem.QuestionId == 4) {
                                    angular.forEach(Aitem.SubQuestions, function (item) {
                                        mitem.ScoreObject.PHQScore += item.Score;
                                    });
                                }

                                if (Aitem.QuestionId == 7) {
                                    angular.forEach(Aitem.SubQuestions, function (item) {
                                        mitem.ScoreObject.AUDITScore += item.Score;
                                    });
                                }
                            }
                            if (Aitem.TypeId == 2) {
                                mitem.ScoreObject.NHANESscore += Aitem.Score;
                            }
                            if (Aitem.TypeId == 3) {
                                mitem.ScoreObject.HARKscore += Aitem.Score;
                            }
                        })
                    }
                    if (mitem.Pachymetry.length !== 0) {
                       
                            var countNo = 0;
                            var pachyODAvgValue = 0;
                            var pachyOSAvgValue = 0;
                            angular.forEach(mitem.Pachymetry, function (subitem) {
                                $scope.PastVisitsPachyAvgODValue = 0;
                                $scope.PastVisitsPachyAvgOSValue = 0;
                                pachyODAvgValue += parseInt(subitem.RightEye) || 0;
                                pachyOSAvgValue += parseInt(subitem.LeftEye) || 0;
                                countNo++;
                            });
                            $scope.PastVisitsPachyAvgODValue = parseFloat(pachyODAvgValue / countNo).toFixed(2) || 0;
                            $scope.PastVisitsPachyAvgOSValue = parseFloat(pachyOSAvgValue / countNo).toFixed(2) || 0;
                        
                    }
                  
                    if (mitem.AnteriorSegmentDetails.length > 0) {
                        mitem.IsAnyAnteriorRemarksIsActive = false;
                        angular.forEach(mitem.AnteriorSegmentDetails, function (item) {
                            if (item.ActiveInd == "Y") {
                                if (item.RemarksArray.length != 0) {
                                    mitem.IsAnyAnteriorRemarksIsActive = true;
                                }
                            }
                        });
                    }
                    else {
                        mitem.IsAnyAnteriorRemarksIsActive = false;
                    }

                    if (mitem.PosteriorSegmentDetails.length !== 0) {
                        mitem.IsHorizontal = false;
                        mitem.IsVertical = false;
                        mitem.IsDPS = false;
                        angular.forEach(mitem.PosteriorSegmentDetails, function (Aitem) {
                            if (Aitem.InvestigationId == 32) {

                                Aitem.IsDPS = false;
                                if (Aitem.LHorizontal !== '' || Aitem.RHorizontal !== '' ) {
                                    mitem.IsHorizontal = true;
                                }
                                else {
                                    mitem.IsHorizontal = false;
                                }
                                if (Aitem.LVertical !== '' || Aitem.RVertical !== '' ) {
                                    mitem.IsVertical = true;
                                }
                                else {
                                    mitem.IsVertical = false;
                                }
                                if (Aitem.LDPS !== '' || Aitem.RDPS !== '') {
                                    mitem.IsDPS = true;
                                }
                                else {
                                    mitem.IsDPS = false;
                                }
                            }
                        });
                    }

                   
                    if (mitem.PosteriorSegmentDetails.length > 0) {
                        mitem.IsAnyPosteriorRemarksIsActive = false;
                        angular.forEach(mitem.PosteriorSegmentDetails, function (item) {
                            if (item.ActiveInd == "Y" && item.InvestigationId !== 32) {
                                    if (item.RemarksArray.length !== 0) {
                                        mitem.IsAnyPosteriorRemarksIsActive = true;
                                    }
                              
                            }
                            else if (item.ActiveInd == "Y" && item.InvestigationId == 32) {
                                item.RHorizontal = item.RHorizontal || '';
                                item.RVertical = item.RVertical || '';
                                item.RDPS = item.RDPS || '';
                                item.LHorizontal = item.LHorizontal || '';
                                item.LVertical = item.LVertical || '';
                                item.LDPS = item.LDPS || '';
                                if (item.RHorizontal !== '' || item.RVertical !== '' || item.RDPS !== '' || item.LHorizontal !== '' || item.LVertical !== '' || item.LDPS !== '') {
                                    mitem.IsAnyPosteriorRemarksIsActive = true;
                                }
                            }
                        });
                    }
                    else {
                        mitem.IsAnyPosteriorRemarksIsActive = false;
                    }
                });
                $scope.SummaryTab = type || 1;
            }
        });
    };

    $scope.GetCCPastVisitsDatesObj = {
        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "DateType": "",
        "DefaultAll": true
    };

    $scope.GetOrdersPastVisitsDatesObj = {
        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "DateType": "",
        "DefaultAll": true
    };

    if ($scope.SummaryTab == 1) {
        $scope.GetLatestDefaultSummaryDetails(1);
    } else if ($scope.SummaryTab == 2) {
        $scope.VisualAcuityGraphObj.IsShowVAgraph = false;
        $scope.VisualAcuityGraphObj.IsVisualAcuityArrayEmpty = false;
        $scope.GetPreviousInvestigationData($scope.VisionObj.VisionDetails, $scope.SummaryTab)
    } else if ($scope.SummaryTab == 3) {
        $scope.GetPreviousInvestigationData($scope.PreviousInvestigationIdArray, $scope.SummaryTab)
    } else if ($scope.SummaryTab == 4) {
        $scope.GetPreviousInvestigationData($scope.TonometrySubList, $scope.SummaryTab)
    } else { }

    $scope.Uibclose = function () {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.SummaryTabclick = function (value) {
        $scope.SummaryTab = value || 1;
    }

    $scope.ShowVisualAcuityHistoryGraph = function () {
        $scope.VisualAcuityGraphObj.IsShowVAgraph = !$scope.VisualAcuityGraphObj.IsShowVAgraph;
        if ($scope.VisualAcuityGraphObj.IsShowVAgraph) {
            var obj = {
                "PatientId": $scope.Patientid
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

                    let VisualAcuityODArray = [];
                    angular.forEach($scope.PatientGraphData, function (item) {
                        if (item.VisionDetails.length > 0) {
                            angular.forEach(item.VisionDetails, function (Vitem) {
                                if (Vitem.RightEyeValues.Distance !== '' && Vitem.InvestigationId == 4) {
                                    var fractionParts = Vitem.RightEyeValues.Distance.split('/');
                                    var numerator = fractionParts[0];
                                    var FinalODDenominator = fractionParts[1];

                                    if (fractionParts[1] !== undefined) {
                                        var denominator1 = fractionParts[1].split('+');
                                        if (denominator1[1] !== undefined) {
                                            var denominatorA = denominator1[0];
                                            var denominatorB = denominator1[1];
                                            denominatorA = parseInt(denominatorA) || 0;
                                            denominatorB = parseInt(denominatorB) || 0;
                                            FinalODDenominator = denominatorA + denominatorB;
                                        }

                                        var denominator2 = fractionParts[1].split('-');
                                        if (denominator2[1] !== undefined) {
                                            var denominatorA = denominator2[0];
                                            var denominatorB = denominator2[1];
                                            denominatorA = parseInt(denominatorA) || 0;
                                            denominatorB = parseInt(denominatorB) || 0;
                                            FinalODDenominator = denominatorA - denominatorB;
                                        }
                                    }

                                    let Date = item.AppointmentDate;
                                    let obj = {
                                        x: Date,
                                        y: (FinalODDenominator != '') ? FinalODDenominator : null
                                    };
                                    VisualAcuityODArray.push(obj);
                                }
                            });
                        }
                    });

                    let VisualAcuityOSArray = [];
                    angular.forEach($scope.PatientGraphData, function (item) {
                        if (item.VisionDetails.length > 0) {
                            angular.forEach(item.VisionDetails, function (Vitem) {
                                if (Vitem.LeftEyeValues.Distance !== '' && Vitem.InvestigationId == 4) {
                                    var fractionParts = Vitem.LeftEyeValues.Distance.split('/');
                                    var numerator = fractionParts[0];
                                    var FinalOSDenominator = fractionParts[1];

                                    if (fractionParts[1] !== undefined) {
                                        var denominator1 = fractionParts[1].split('+');
                                        if (denominator1[1] !== undefined) {
                                            var denominatorA = denominator1[0];
                                            var denominatorB = denominator1[1];
                                            denominatorA = parseInt(denominatorA) || 0;
                                            denominatorB = parseInt(denominatorB) || 0;
                                            FinalOSDenominator = denominatorA + denominatorB;
                                        }

                                        var denominator2 = fractionParts[1].split('-');
                                        if (denominator2[1] !== undefined) {
                                            var denominatorA = denominator2[0];
                                            var denominatorB = denominator2[1];
                                            denominatorA = parseInt(denominatorA) || 0;
                                            denominatorB = parseInt(denominatorB) || 0;
                                            FinalOSDenominator = denominatorA - denominatorB;
                                        }
                                    }

                                    let Date = item.AppointmentDate;
                                    let obj = {
                                        x: Date,
                                        y: (FinalOSDenominator != '') ? FinalOSDenominator : null
                                    };
                                    VisualAcuityOSArray.push(obj);
                                }
                            });
                        }
                    });

                    let VisualAcuityCCODArray = [];
                    angular.forEach($scope.PatientGraphData, function (item) {
                        if (item.VisionDetails.length > 0) {
                            angular.forEach(item.VisionDetails, function (Vitem) {
                                if (Vitem.RightEyeValues.Distance !== '' && Vitem.InvestigationId == 5) {
                                    var fractionParts = Vitem.RightEyeValues.Distance.split('/');
                                    var numerator = fractionParts[0];
                                    var FinalCCODdenominator = fractionParts[1];

                                    if (fractionParts[1] !== undefined) {
                                        var denominator1 = fractionParts[1].split('+');
                                        if (denominator1[1] !== undefined) {
                                            var denominatorA = denominator1[0];
                                            var denominatorB = denominator1[1];
                                            denominatorA = parseInt(denominatorA) || 0;
                                            denominatorB = parseInt(denominatorB) || 0;
                                            FinalCCODdenominator = denominatorA + denominatorB;
                                        }

                                        var denominator2 = fractionParts[1].split('-');
                                        if (denominator2[1] !== undefined) {
                                            var denominatorA = denominator2[0];
                                            var denominatorB = denominator2[1];
                                            denominatorA = parseInt(denominatorA) || 0;
                                            denominatorB = parseInt(denominatorB) || 0;
                                            FinalCCODdenominator = denominatorA - denominatorB;
                                        }
                                    }

                                    let Date = item.AppointmentDate;
                                    let obj = {
                                        x: Date,
                                        y: (FinalCCODdenominator != '') ? FinalCCODdenominator : null
                                    };
                                    VisualAcuityCCODArray.push(obj);
                                }
                            });
                        }
                    });

                    let VisualAcuityCCOSArray = [];
                    angular.forEach($scope.PatientGraphData, function (item) {
                        if (item.VisionDetails.length > 0) {
                            angular.forEach(item.VisionDetails, function (Vitem) {
                                if (Vitem.LeftEyeValues.Distance !== '' && Vitem.InvestigationId == 5) {
                                    var fractionParts = Vitem.LeftEyeValues.Distance.split('/');
                                    var numerator = fractionParts[0];
                                    var FinalCCOSdenominator = fractionParts[1];

                                    if (fractionParts[1] !== undefined) {
                                        var denominator1 = fractionParts[1].split('+');
                                        if (denominator1[1] !== undefined) {
                                            var denominatorA = denominator1[0];
                                            var denominatorB = denominator1[1];
                                            denominatorA = parseInt(denominatorA) || 0;
                                            denominatorB = parseInt(denominatorB) || 0;
                                            FinalCCOSdenominator = denominatorA + denominatorB;
                                        }

                                        var denominator2 = fractionParts[1].split('-');
                                        if (denominator2[1] !== undefined) {
                                            var denominatorA = denominator2[0];
                                            var denominatorB = denominator2[1];
                                            denominatorA = parseInt(denominatorA) || 0;
                                            denominatorB = parseInt(denominatorB) || 0;
                                            FinalCCOSdenominator = denominatorA - denominatorB;
                                        }
                                    }

                                    let Date = item.AppointmentDate;
                                    let obj = {
                                        x: Date,
                                        y: (FinalCCOSdenominator != '') ? FinalCCOSdenominator : null
                                    };
                                    VisualAcuityCCOSArray.push(obj);
                                }
                            });
                        }

                    });

                    if (VisualAcuityODArray.length == 0 && VisualAcuityOSArray.length == 0 && VisualAcuityCCODArray.length == 0 && VisualAcuityCCOSArray.length == 0) {
                        $scope.VisualAcuityGraphObj.IsVisualAcuityArrayEmpty = true;
                        return false;
                    }

                    const data1 = {
                        labels: labels1,
                        datasets: [
                            {
                                type: 'scatter',
                                label: 'SC OD',
                                backgroundColor: 'rgb(255, 0, 0)',
                                borderColor: 'rgb(255, 0, 0)',
                                showLine: true,
                                data: VisualAcuityODArray,
                                spanGaps: true,
                            },
                            {
                                type: 'scatter',
                                label: 'CC OD',
                                backgroundColor: 'rgb(245, 66, 120)',
                                borderColor: 'rgb(245, 66, 120)',
                                showLine: true,
                                data: VisualAcuityCCODArray,
                                spanGaps: true,
                            },
                            {
                                type: 'scatter',
                                label: 'SC OS',
                                backgroundColor: '#5742f5',
                                borderColor: '#5742f5',
                                showLine: true,
                                data: VisualAcuityOSArray,
                                spanGaps: true,
                            },
                            {
                                type: 'scatter',
                                label: 'CC OS',
                                backgroundColor: '#42e3f5',
                                borderColor: '#42e3f5',
                                showLine: true,
                                data: VisualAcuityCCOSArray,
                                spanGaps: true,
                            }
                        ]
                    }

                    let len = $("canvas#myChart").length;
                    if (len > 0) {
                        $("canvas#myChart").remove();
                        $("div.VisualAcuityGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                    } else if (len === 0) {
                        $("div.VisualAcuityGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
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
            $scope.VisualAcuityGraphObj.IsShowVAgraph = false;
            $scope.VisualAcuityGraphObj.IsVisualAcuityArrayEmpty = false;
        }
    };

    $scope.ShowManifestHistoryGraph = function () {
        $scope.MRGraphObj.IsShowMRgraph = !$scope.MRGraphObj.IsShowMRgraph;
        if ($scope.MRGraphObj.IsShowMRgraph) {
            var obj = {
                "PatientId": $scope.Patientid
            };
            eHnotePatientDataService.GetGraphRelatedPatientData(obj).then(function (resp) {
                $scope.PatientGraphData = [];
                if (resp.data.Status == "Success") {
                    $scope.PatientGraphData = resp.data.rows || [];

                    const labels1 = [];

                    let ManiFestRefractionODArray = [];
                    angular.forEach($scope.PatientGraphData, function (item) {
                        var Date = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                        if (item.ManifestRefractionArray.length > 0) {
                            angular.forEach(item.ManifestRefractionArray, function (MRitem) {
                                MRitem.RSpherical = MRitem.RSpherical || '';
                                MRitem.RCylindrical = MRitem.RCylindrical || '';

                                var RtCylindrical = 0;
                                if (MRitem.RCylindrical !== '') {
                                    RtCylindrical = parseFloat(MRitem.RCylindrical) || 0;
                                    RtCylindrical = RtCylindrical / 2;
                                }

                                var RtSpherical = 0;
                                if (MRitem.RSpherical !== '') {
                                    RtSpherical = parseFloat(MRitem.RSpherical) || 0;
                                }

                                MRitem.FinalODMRValue = MRitem.FinalODMRValue || null;
                                MRitem.FinalODMRValue = RtSpherical + RtCylindrical || null;

                                let obj = {
                                    x: Date,
                                    y: (MRitem.FinalODMRValue != '') ? MRitem.FinalODMRValue : null
                                };
                                ManiFestRefractionODArray.unshift(obj);
                                labels1.unshift(Date);
                            });
                        } else {
                            let obj = {
                                x: Date,
                                y: null
                            };
                            ManiFestRefractionODArray.unshift(obj);
                            labels1.unshift(Date);
                        }
                    });

                    let ManiFestRefractionOSArray = [];
                    angular.forEach($scope.PatientGraphData, function (item) {
                        var Date = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                        if (item.ManifestRefractionArray.length > 0) {
                            angular.forEach(item.ManifestRefractionArray, function (MRitem) {
                                MRitem.LSpherical = MRitem.LSpherical || '';
                                MRitem.LCylindrical = MRitem.LCylindrical || '';

                                var LtCylindrical = 0;
                                if (MRitem.LCylindrical !== '') {
                                    LtCylindrical = parseFloat(MRitem.LCylindrical) || 0;
                                    LtCylindrical = LtCylindrical / 2;
                                }

                                var LtSpherical = 0;
                                if (MRitem.LSpherical !== '') {
                                    LtSpherical = parseFloat(MRitem.LSpherical) || 0;
                                }

                                MRitem.FinalOSMRValue = MRitem.FinalOSMRValue || null;
                                MRitem.FinalOSMRValue = LtSpherical + LtCylindrical || null;

                                let obj = {
                                    x: Date,
                                    y: (MRitem.FinalOSMRValue != '') ? MRitem.FinalOSMRValue : null
                                };
                                ManiFestRefractionOSArray.unshift(obj);
                            });
                        } else {
                            let obj = {
                                x: Date,
                                y: null
                            };
                            ManiFestRefractionOSArray.unshift(obj);
                        }
                    });

                    if (ManiFestRefractionODArray.length > 0) {
                        var MRODTempArray = [];
                        angular.forEach(ManiFestRefractionODArray, function (ODitem) {
                            if (ODitem.y !== null) {
                                MRODTempArray.push(ODitem);
                            }
                        });
                    }
                    if (ManiFestRefractionOSArray.length > 0) {
                        var MROSTempArray = [];
                        angular.forEach(ManiFestRefractionOSArray, function (ODitem) {
                            if (ODitem.y !== null) {
                                MROSTempArray.push(ODitem);
                            }
                        });
                    }

                    if (MRODTempArray.length == 0 && MROSTempArray.length == 0) {
                        $scope.MRGraphObj.IsMRArrayEmpty = true;
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
                                spanGaps: true,
                                data: ManiFestRefractionODArray
                            },
                            {
                                type: 'scatter',
                                label: 'OS',
                                backgroundColor: '#5742f5',
                                borderColor: '#5742f5',
                                showLine: true,
                                spanGaps: true,
                                data: ManiFestRefractionOSArray
                            }
                        ]
                    }

                    let len = $("canvas#myChart").length;
                    if (len > 0) {
                        $("canvas#myChart").remove();
                        $("div.ManifestRefractionGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                    } else if (len === 0) {
                        $("div.ManifestRefractionGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
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
            $scope.MRGraphObj.IsShowMRgraph = false;
            $scope.MRGraphObj.IsMRArrayEmpty = false;
        }
    };

    $scope.ShowIOPGraphInHistory = function (tab) {
        $scope.SummaryTab = tab || 4;
        $scope.IOPGraphObj.IsShowgraph = true;
        var obj = {
            "PatientId": $scope.Patientid
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

                let IOPODValuesArray = [];
                angular.forEach($scope.PatientGraphData, function (item) {
                    if (item.Tonometry.length > 0) {
                        let lastObject = item.Tonometry[item.Tonometry.length - 1];
                        if (lastObject.BeforeDilationRightEye != '') {
                            var IOPODValuesYaxisvalue = lastObject.BeforeDilationRightEye;
                        } else {
                            var IOPODValuesYaxisvalue = lastObject.AfterDilationRightEye;
                        }

                        let Date = item.AppointmentDate;
                        let obj = {
                            x: Date,
                            y: (IOPODValuesYaxisvalue != '') ? IOPODValuesYaxisvalue : null
                        };
                        IOPODValuesArray.push(obj);
                    }
                });

                let IOPOSValuesArray = [];
                angular.forEach($scope.PatientGraphData, function (item) {

                    if (item.Tonometry.length > 0) {
                        let lastObject = item.Tonometry[item.Tonometry.length - 1];

                        if (lastObject.BeforeDilationLeftEye != '') {
                            var IOPOSValuesYaxisvalue = lastObject.BeforeDilationLeftEye;
                        } else {
                            var IOPOSValuesYaxisvalue = lastObject.AfterDilationLeftEye;
                        }

                        let Date = item.AppointmentDate;
                        let obj = {
                            x: Date,
                            y: (IOPOSValuesYaxisvalue != '') ? IOPOSValuesYaxisvalue : null
                        };
                        IOPOSValuesArray.push(obj);
                    }
                });

                let IOPCCODValuesArray = [];
                angular.forEach($scope.PatientGraphData, function (item) {
                    if (item.Tonometry.length > 0) {
                        let lastObject = item.Tonometry[item.Tonometry.length - 1];

                        let Date = item.AppointmentDate;
                        let obj = {
                            x: Date,
                            y: (lastObject.BeforeDilationODCC != '') ? lastObject.BeforeDilationODCC : null
                        };
                        IOPCCODValuesArray.push(obj);
                    }
                });

                let IOPCCOSValuesArray = [];
                angular.forEach($scope.PatientGraphData, function (item) {
                    if (item.Tonometry.length > 0) {
                        let lastObject = item.Tonometry[item.Tonometry.length - 1];

                        let Date = item.AppointmentDate;
                        let obj = {
                            x: Date,
                            y: (lastObject.BeforeDilationOSCC != '') ? lastObject.BeforeDilationOSCC : null
                        };
                        IOPCCOSValuesArray.push(obj);
                    }
                });

                let TargetIOPODArray = [];
                angular.forEach($scope.PatientGraphData, function (item) {
                    if (item.IOPValues.length > 0) {
                        item.IOPValues[0].TargetIOPODValue = item.IOPValues[0].TargetIOPODValue || null;
                        if (item.IOPValues[0].TargetIOPODValue !== null) {
                            let Date = item.AppointmentDate;
                            let obj = {
                                x: Date,
                                y: (item.IOPValues[0].TargetIOPODValue != '') ? item.IOPValues[0].TargetIOPODValue : null
                            };
                            TargetIOPODArray.push(obj);
                        }
                    }
                });

                let TargetIOPOSArray = [];
                angular.forEach($scope.PatientGraphData, function (item) {
                    if (item.IOPValues.length > 0) {
                        item.IOPValues[0].TargetIOPOSValue = item.IOPValues[0].TargetIOPOSValue || null;
                        if (item.IOPValues[0].TargetIOPOSValue !== null) {
                            let Date = item.AppointmentDate;
                            let obj = {
                                x: Date,
                                y: (item.IOPValues[0].TargetIOPOSValue != '') ? item.IOPValues[0].TargetIOPOSValue : null
                            };
                            TargetIOPOSArray.push(obj);
                        }
                    }
                });

                let MedicationImg = new Image();
                MedicationImg.src = 'img/diastolic.svg';

                let ProcedureImg = new Image();
                ProcedureImg.src = 'img/Pulse.svg';

                let MedicationArray = [];
                angular.forEach($scope.PatientGraphData, function (item) {
                    if (item.PrescriptionDetails.length > 0) {
                        let Date = item.AppointmentDate;
                        let obj = {
                            x: Date,
                            y: 2,
                        };
                        MedicationArray.push(obj);
                    }
                });

                let OPProceduresArray = [];
                angular.forEach($scope.PatientGraphData, function (item) {
                    if (item.OPProceduresArray.length > 0) {
                        let Date = item.AppointmentDate;
                        let obj = {
                            x: Date,
                            y: 5,
                        };
                        OPProceduresArray.push(obj);
                    }
                });

                if (IOPODValuesArray.length == 0 && IOPOSValuesArray.length == 0 && IOPCCODValuesArray.length == 0 && IOPCCOSValuesArray.length == 0 && TargetIOPODArray.length == 0 && TargetIOPOSArray.length == 0 && MedicationArray.length == 0 && OPProceduresArray.length == 0) {
                    $scope.IOPGraphObj.IsIOPGraphArrayEmpty = true;
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
                            data: IOPODValuesArray,
                            spanGaps: true,
                        },
                        {
                            type: 'scatter',
                            label: 'CC OD',
                            backgroundColor: 'rgb(245, 66, 120)',
                            borderColor: 'rgb(245, 66, 120)',
                            showLine: true,
                            data: IOPCCODValuesArray,
                            spanGaps: true,
                        },
                        {
                            type: 'scatter',
                            label: 'OS',
                            backgroundColor: 'rgb(17, 66, 245)',
                            borderColor: 'rgb(17, 66, 245)',
                            showLine: true,
                            data: IOPOSValuesArray,
                            spanGaps: true,
                        },
                        {
                            type: 'scatter',
                            label: 'CC OS',
                            backgroundColor: 'rgb(66, 179, 245)',
                            borderColor: 'rgb(66, 179, 245)',
                            showLine: true,
                            data: IOPCCOSValuesArray,
                            spanGaps: true,
                        },
                        {
                            type: 'scatter',
                            label: 'Medication Order',
                            borderColor: '#34eb5e',
                            backgroundColor: '#34eb5e',
                            data: MedicationArray,
                            pointStyle: MedicationImg,
                            showLine: false,
                        },
                        {
                            type: 'scatter',
                            label: 'Procedures',
                            borderColor: '#d934eb',
                            backgroundColor: '#d934eb',
                            data: OPProceduresArray,
                            pointStyle: ProcedureImg,
                            showLine: false,
                        },
                        {
                            type: 'scatter',
                            label: 'Target OD',
                            backgroundColor: '#eb3434',
                            borderColor: '#eb3434',
                            data: TargetIOPODArray,
                            borderDash: [5, 5],
                            stepped: true,
                            showLine: true,
                        },
                        {
                            type: 'scatter',
                            label: 'Target OS',
                            backgroundColor: '#42aaf5',
                            borderColor: '#42aaf5',
                            data: TargetIOPOSArray,
                            borderDash: [5, 5],
                            stepped: true,
                            showLine: true,
                        }
                    ],
                }
                $scope.GraphOBJ = data1 || {};

                if ($scope.IOPGraphObj.ShowCCIOP == false) {

                    var Data3 = {
                        'datasets': [],
                        'labels': $scope.GraphOBJ.labels || []
                    };

                    Data3.datasets = $filter("filter")($scope.GraphOBJ.datasets, function (item) {
                        return item.label === "OD" || item.label === "OS" || item.label === "Medication Order" || item.label === "Procedures" || item.label === "Target OD" || item.label === "Target OS";
                    });

                    let len = $("canvas#myChart").length;
                    if (len > 0) {
                        $("canvas#myChart").remove();
                        $("div.scatterLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                    } else if (len === 0) {
                        $("div.scatterLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                    }

                    const myChart = new Chart('myChart', {
                        type: 'scatter',
                        data: Data3,
                        options: {
                            scales: {
                                x: { // add extra axes
                                    position: 'bottom',
                                    type: 'category'
                                },
                                y: {
                                    type: 'linear', // Use linear scale for the y-axis
                                    position: 'left'
                                },
                            },
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        title: function () { return ''; },

                                        beforeFooter: (tooltipItems) => {
                                            var MedicationStr = [];
                                            $scope.PatientGraphData = $scope.PatientGraphData || [];
                                            tooltipItems.forEach(function (tooltipItem) {
                                                /*Medication = tooltipItem.parsed.y;*/
                                                angular.forEach($scope.PatientGraphData, function (item) {
                                                    if (item.PrescriptionDetails.length > 0) {
                                                        var i = 0;
                                                        var List = 0;
                                                        angular.forEach(item.PrescriptionDetails, function (mitem) {
                                                            mitem.MedicationName = '';
                                                            if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                //if (mitem.DrugBrandName !== MedicationStr) {
                                                                //MedicationStr += mitem.DrugBrandName + '\n';
                                                                //}

                                                                mitem.MedicationName += mitem.DrugBrandName + mitem.Dose + mitem.DoseUnit + mitem.Route;
                                                                mitem.StopDate = mitem.StopDate || null;
                                                                if (mitem.StopDate !== null) {
                                                                    mitem.StopDate = $filter('date')(mitem.StopDate, "MM-dd-yyyy");
                                                                    mitem.MedicationName += '-' + 'DisContinue';
                                                                }
                                                                List = $filter("filter")(MedicationStr, function (FAitem) { return FAitem == mitem.MedicationName },);
                                                                if (List.length > 0) {
                                                                    i++;
                                                                }
                                                                if (i == 0) {
                                                                    MedicationStr.push(mitem.MedicationName);
                                                                }
                                                            }
                                                        });
                                                    }

                                                });
                                            });
                                            if (MedicationStr.length > 0) {
                                                return 'MEDICATION ORDER: ' + MedicationStr;
                                            }
                                        },

                                        footer: (tooltipItems) => {
                                            var OPProceduresStr = [];
                                            $scope.PatientGraphData = $scope.PatientGraphData || [];
                                            tooltipItems.forEach(function (tooltipItem) {
                                                angular.forEach($scope.PatientGraphData, function (item) {
                                                    if (item.OPProceduresArray.length > 0) {
                                                        angular.forEach(item.OPProceduresArray, function (mitem) {
                                                            var i = 0;
                                                            var List = 0;
                                                            mitem.OPProcedure = '';
                                                            if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                //if (mitem.ProcedureName !== OPProceduresStr) {
                                                                //    var Organ = mitem.OrganId == 1 ? 'OD' : mitem.OrganId == 2 ? 'OS' : mitem.OrganId == 3 ? 'OU' : '';
                                                                //    OPProceduresStr += mitem.ProcedureName + "-" + Organ + '\n';
                                                                //}
                                                                var Organ = mitem.OrganId == 1 ? 'OD' : mitem.OrganId == 2 ? 'OS' : mitem.OrganId == 3 ? 'OU' : '';
                                                                mitem.OPProcedure += mitem.ProcedureName + "-" + Organ + '\n';
                                                                List = $filter("filter")(OPProceduresStr, function (FAitem) { return FAitem == mitem.ProcedureName },);
                                                                if (List.length > 0) {
                                                                    i++;
                                                                }
                                                                if (i == 0) {
                                                                    OPProceduresStr.push(mitem.OPProcedure);
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            });
                                            if (OPProceduresStr.length > 0) {
                                                return 'PROCEDURES: ' + OPProceduresStr;
                                            }
                                        },

                                    }
                                },
                            }
                        }

                    });
                }

            }
        });
    };

    $scope.ShowIOPCCGraph = function (Dataset) {
        Dataset = Dataset || false;
        $scope.GraphOBJ = $scope.GraphOBJ || {};
        if (Dataset == true) {
            var Data2 = {
                'datasets': [],
                'labels': $scope.GraphOBJ.labels || []
            };

            Data2.datasets = $filter("filter")($scope.GraphOBJ.datasets, function (item) {
                return item.label === "CC OD" || item.label === "CC OS" || item.label === "Medication Order" || item.label === "Procedures" || item.label === "Target OD" || item.label === "Target OS";
            });

            let len = $("canvas#myChart").length;
            if (len > 0) {
                $("canvas#myChart").remove();
                $("div.scatterLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
            } else if (len === 0) {
                $("div.scatterLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
            }

            const myChart = new Chart('myChart', {
                type: 'scatter',
                data: Data2,
                options: {
                    scales: {
                        x: { // add extra axes
                            position: 'bottom',
                            type: 'category'
                        },
                        y: {
                            type: 'linear', // Use linear scale for the y-axis
                            position: 'left'
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                beforeFooter: (tooltipItems) => {
                                    var MedicationStr = [];
                                    $scope.PatientGraphData = $scope.PatientGraphData || [];
                                    tooltipItems.forEach(function (tooltipItem) {
                                        /*Medication = tooltipItem.parsed.y;*/
                                        angular.forEach($scope.PatientGraphData, function (item) {
                                            if (item.PrescriptionDetails.length > 0) {
                                                var i = 0;
                                                var List = 0;
                                                angular.forEach(item.PrescriptionDetails, function (mitem) {
                                                    mitem.MedicationName = '';
                                                    if (item.AppointmentDate == tooltipItem.raw.x) {
                                                        mitem.MedicationName += mitem.DrugBrandName + mitem.Dose + mitem.DoseUnit + mitem.Route;
                                                        mitem.StopDate = mitem.StopDate || null;
                                                        if (mitem.StopDate !== null) {
                                                            mitem.StopDate = $filter('date')(mitem.StopDate, "MM-dd-yyyy");
                                                            mitem.MedicationName += '-' + 'DisContinue';
                                                        }
                                                        List = $filter("filter")(MedicationStr, function (FAitem) { return FAitem == mitem.MedicationName },);
                                                        if (List.length > 0) {
                                                            i++;
                                                        }
                                                        if (i == 0) {
                                                            MedicationStr.push(mitem.MedicationName);
                                                        }
                                                    }
                                                });
                                            }

                                        });
                                    });
                                    if (MedicationStr.length > 0) {
                                        return 'MEDICATION ORDER: ' + MedicationStr;
                                    }
                                },

                                footer: (tooltipItems) => {
                                    var OPProceduresStr = [];
                                    $scope.PatientGraphData = $scope.PatientGraphData || [];
                                    tooltipItems.forEach(function (tooltipItem) {
                                        angular.forEach($scope.PatientGraphData, function (item) {
                                            if (item.OPProceduresArray.length > 0) {
                                                angular.forEach(item.OPProceduresArray, function (mitem) {
                                                    var i = 0;
                                                    var List = 0;
                                                    mitem.OPProcedure = '';
                                                    if (item.AppointmentDate == tooltipItem.raw.x) {
                                                        var Organ = mitem.OrganId == 1 ? 'OD' : mitem.OrganId == 2 ? 'OS' : mitem.OrganId == 3 ? 'OU' : '';
                                                        mitem.OPProcedure += mitem.ProcedureName + "-" + Organ + '\n';
                                                        List = $filter("filter")(OPProceduresStr, function (FAitem) { return FAitem == mitem.ProcedureName },);
                                                        if (List.length > 0) {
                                                            i++;
                                                        }
                                                        if (i == 0) {
                                                            OPProceduresStr.push(mitem.OPProcedure);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    });
                                    if (OPProceduresStr.length > 0) {
                                        return 'PROCEDURES: ' + OPProceduresStr;
                                    }
                                }

                            }
                        },
                    }
                }

            });

        } else {
            var Data2 = {
                'datasets': [],
                'labels': $scope.GraphOBJ.labels || []
            };

            Data2.datasets = $filter("filter")($scope.GraphOBJ.datasets, function (item) {
                return item.label === "OD" || item.label === "OS" || item.label === "Medication Order" || item.label === "Procedures" || item.label === "Target OD" || item.label === "Target OS";
            });

            let len = $("canvas#myChart").length;
            if (len > 0) {
                $("canvas#myChart").remove();
                $("div.scatterLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
            } else if (len === 0) {
                $("div.scatterLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
            }

            const myChart = new Chart('myChart', {
                type: 'scatter',
                data: Data2,
                options: {
                    scales: {
                        x: { // add extra axes
                            position: 'bottom',
                            type: 'category'
                        },
                        y: {
                            type: 'linear', // Use linear scale for the y-axis
                            position: 'left'
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                beforeFooter: (tooltipItems) => {
                                    var MedicationStr = [];
                                    $scope.PatientGraphData = $scope.PatientGraphData || [];
                                    tooltipItems.forEach(function (tooltipItem) {
                                        angular.forEach($scope.PatientGraphData, function (item) {
                                            if (item.PrescriptionDetails.length > 0) {
                                                var i = 0;
                                                var List = 0;
                                                angular.forEach(item.PrescriptionDetails, function (mitem) {
                                                    mitem.MedicationName = '';
                                                    if (item.AppointmentDate == tooltipItem.raw.x) {
                                                        mitem.MedicationName += mitem.DrugBrandName + mitem.Dose + mitem.DoseUnit + mitem.Route;
                                                        mitem.StopDate = mitem.StopDate || null;
                                                        if (mitem.StopDate !== null) {
                                                            mitem.StopDate = $filter('date')(mitem.StopDate, "MM-dd-yyyy");
                                                            mitem.MedicationName += '-' + 'DisContinue';
                                                        }
                                                        List = $filter("filter")(MedicationStr, function (FAitem) { return FAitem == mitem.MedicationName },);
                                                        if (List.length > 0) {
                                                            i++;
                                                        }
                                                        if (i == 0) {
                                                            MedicationStr.push(mitem.MedicationName);
                                                        }
                                                    }
                                                });
                                            }

                                        });
                                    });
                                    if (MedicationStr.length > 0) {
                                        return 'MEDICATION ORDER: ' + MedicationStr;
                                    }
                                },

                                footer: (tooltipItems) => {
                                    var OPProceduresStr = [];
                                    $scope.PatientGraphData = $scope.PatientGraphData || [];
                                    tooltipItems.forEach(function (tooltipItem) {
                                        angular.forEach($scope.PatientGraphData, function (item) {
                                            if (item.OPProceduresArray.length > 0) {
                                                angular.forEach(item.OPProceduresArray, function (mitem) {
                                                    var i = 0;
                                                    var List = 0;
                                                    mitem.OPProcedure = '';
                                                    if (item.AppointmentDate == tooltipItem.raw.x) {
                                                        var Organ = mitem.OrganId == 1 ? 'OD' : mitem.OrganId == 2 ? 'OS' : mitem.OrganId == 3 ? 'OU' : '';
                                                        mitem.OPProcedure += mitem.ProcedureName + "-" + Organ + '\n';
                                                        List = $filter("filter")(OPProceduresStr, function (FAitem) { return FAitem == mitem.ProcedureName },);
                                                        if (List.length > 0) {
                                                            i++;
                                                        }
                                                        if (i == 0) {
                                                            OPProceduresStr.push(mitem.OPProcedure);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    });
                                    if (OPProceduresStr.length > 0) {
                                        return 'PROCEDURES: ' + OPProceduresStr;
                                    }
                                }

                            }
                        },
                    }
                }

            });
        }
        $scope.IOPGraphObj.IsShowgraph = true;
    };

    $scope.caseObj = {
        "PatientPastVisitPopUp": false
    }

    $scope.OnClickPatientPatVisits = function () {
        $scope.caseObj.PatientPastVisitPopUp = !$scope.caseObj.PatientPastVisitPopUp;
        $scope.GridPastVisitSummaryObj = angular.copy($scope.PastVisitSummaryObj);
    };

    $scope.Summarydatepickerpopover = {
        templateUrl: 'datepickerpopover.html',
    };

    $scope.GetPastVisitSummaryObj = function () {
        return {
            "ChiefcomplantsArray": [
                {
                    "Name": "Chief Complaints",
                    "IsCheck": true
                }
            ],
            "ROSArray": [
                {
                    "Name": "Allergies",
                    "IsCheck": true
                },
                {
                    "Name": "Ocular History",
                    "IsCheck": false
                },
                {
                    "Name": "Ocular Surgical History",
                    "IsCheck": false
                },
                {
                    "Name": "Current Eye Medication",
                    "IsCheck": false
                },
                {
                    "Name": "Systemic History",
                    "IsCheck": false
                },
                {
                    "Name": "Surgical History",
                    "IsCheck": false
                },
                {
                    "Name": "Current Systemic Medications",
                    "IsCheck": false
                },
                {
                    "Name": "Family History",
                    "IsCheck": false
                },
                {
                    "Name": "FunctionalStatus History",
                    "IsCheck": false
                },
                {
                    "Name": "Life Style History",
                    "IsCheck": false
                },
                {
                    "Name": "Vaccination History",
                    "IsCheck": false
                },
                {
                    "Name": "Birth History",
                    "IsCheck": false
                },
                {
                    "Name": "Nutritional History",
                    "IsCheck": false
                },
                {
                    "Name": "Menstrual History",
                    "IsCheck": false
                },
                {
                    "Name": "Psychiatry",
                    "IsCheck": false
                },
                {
                    "Name": "Lab & Investigation",
                    "IsCheck": false
                },
                {
                    "Name": "Implants",
                    "IsCheck": false
                },
                {
                    "Name": "PsychologicalObservations",
                    "IsCheck": false
                },
                {
                    "Name": "Health Concerns & Goals",
                    "IsCheck": false
                },
                {
                    "Name": "Vitals",
                    "IsCheck": false
                }
            ],
            "VisionAndPerceptionArray": [
                {
                    /*"Name": "Visuial Activity",*/
                    "Name": "Vision",
                    "IsCheck": true
                },
                {
                    "Name": "Refraction",
                    "RefractionArr": [
                        {
                            "Name": "Auto Refraction",
                            "IsCheck": false
                        },
                        {
                            "Name": "Retinoscopy",
                            "IsCheck": false
                        },
                        {
                            "Name": "Present Glass Rx",
                            "IsCheck": false
                        },
                        {
                            "Name": "Manifest Refraction",
                            "IsCheck": false
                        },
                        {
                            "Name": "Cycloplegic Refraction",
                            "IsCheck": false
                        },
                        {
                            "Name": " Over Refraction",
                            "IsCheck": false
                        },
                        {
                            "Name": "Final Glass Rx",
                            "IsCheck": true
                        }
                    ]
                },
                {
                    "Name": "Keratometry",
                    "IsCheck": false
                },
                {
                    "Name": "IOP",
                    "IsCheck": false
                },
                {
                    "Name": "Pupil size",
                    "IsCheck": false
                },
                {
                    "Name": "Pachymetry",
                    "IsCheck": false
                },
                {
                    "Name": "PAM",
                    "IsCheck": false
                },
                {
                    "Name": "Glare",
                    "IsCheck": false
                }
            ],
            "ExaminactionArray": [
                {
                    "Name": "Anterior Segment",
                    "IsCheck": false
                },
                {
                    "Name": "Posterior Segments",
                    "IsCheck": false
                },
                {
                    "Name": "External Examination",
                    "IsCheck": false
                },
                {
                    "Name": "Amsler Grid",
                    "IsCheck": false
                },
                {
                    "Name": "Color Vision",
                    "ColorVisionArr": [
                        {
                            "Name": "Ishihara",
                            "IsCheck": false
                        },
                        {
                            "Name": "HRR",
                            "IsCheck": false
                        },
                        {
                            "Name": "Fransworth D15",
                            "IsCheck": false
                        },
                        {
                            "Name": "Fransworth D100",
                            "IsCheck": false
                        }
                    ]
                },
                {
                    "Name": "Gonioscopy",
                    "IsCheck": false
                },
                {
                    "Name": "Dry Eye Evaluation",
                    "IsCheck": false
                },
                {
                    "Name": "Hertel's Examination",
                    "IsCheck": false
                },
                {
                    "Name": "Lacrimal Patency",
                    "IsCheck": false
                },
                {
                    "Name": "Motor examination",
                    "MotorExaminationArr": [
                        {
                            "Name": "Squint Evaluation",
                            "SquintEvaluationArr": [
                                {
                                    "Name": "HCRT",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Cover/Alternate Cover test",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Cover/Alternate Prism Cover test",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Head Posture",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Nystagmus",
                                    "IsCheck": false
                                },
                            ]
                        },
                        {
                            "Name": "Binocular Vision Test",
                            "BinocularVisionArr": [
                                {
                                    "Name": "Worth Four Dot Test",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Stereopsis",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Near Point Convergence",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Neat Point Accommodation",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Fusional Vergence",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Relative Accommodation",
                                    "IsCheck": false
                                }
                            ]
                        }
                    ]
                }
            ],
            "AssesmentPlanArray": [
                {
                    "Name": "Diagnosis",
                    "IsCheck": true
                },
                {
                    "Name": "Plan Of Discussions",
                    "IsCheck": false
                },
                //{
                //    "Name": "Order's",
                //    "IsCheck": true
                //},
                //{
                //    "Name": "Referral",
                //    "IsCheck": false
                //},
                {
                    "Name": "Instructions",
                    "IsCheck": false
                }
            ],
            "Orders": [
                {
                    "Name": "Orders",
                    "IsCheck": false
                }
            ],
            "MedicalRx": [
                {
                    "Name": "Medical Rx",
                    "IsCheck": false
                }
            ],
            "Procedures": [
                {
                    "Name": "Procedures",
                    "IsCheck": false
                }
            ]
        }
    };
    $scope.PastVisitSummaryObj = $scope.GetPastVisitSummaryObj();

    $scope.GetPastVisitsDatesObj = function () {
        return {
            "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "DateType": "",
            "DefaultAll": true
        }
    };
    $scope.PastVisitsDatesObj = $scope.GetPastVisitsDatesObj();

    $scope.GetTodayDates = function (type) {
        $scope.PastVisitsDatesObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.PastVisitsDatesObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.PastVisitsDatesObj.DateType = type;
        $scope.PastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetYesterdayDates = function (type) {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        $scope.PastVisitsDatesObj.FromDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.PastVisitsDatesObj.ToDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.PastVisitsDatesObj.DateType = type;
        $scope.PastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetThisMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.PastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.PastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.PastVisitsDatesObj.DateType = type;
        $scope.PastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetPastMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 1;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.PastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.PastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.PastVisitsDatesObj.DateType = type;
        $scope.PastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetPastThreeMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 3;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 3, 0);
        $scope.PastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.PastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.PastVisitsDatesObj.DateType = type;
        $scope.PastVisitsDatesObj.DefaultAll = false;
    };

    $scope.PastVisitSummaryGrid = {
        "IsChiefcomplantsArray": true,
        "IsROSArray": true,
        "IsVisionAndPerceptionArray": true,
        "IsExaminactionArray": true,
        "IsAssesmentPlanArray": true,
        "IsSubRefraction": false,
        "IsSubColorVision": false,
        "IsSubMotorExamination": false,
        "IsSubSquintEvaluationArr": false,
        "IsSubBinocularVisionArr": false,

        "IsOrdersArray": true,
        "IsMedicalRxArray": true,
        "IsProceduresArray": true,
    };

    $scope.HideShowChiefComplaints = function () {
        $scope.PastVisitSummaryGrid.IsChiefcomplantsArray = !$scope.PastVisitSummaryGrid.IsChiefcomplantsArray;
    };
    $scope.HideShoworderscheck = function () {
        $scope.PastVisitSummaryGrid.IsOrdersArray = !$scope.PastVisitSummaryGrid.IsOrdersArray;
    };
    $scope.HideShowMedcheck = function () {
        $scope.PastVisitSummaryGrid.IsMedicalRxArray = !$scope.PastVisitSummaryGrid.IsMedicalRxArray;
    };
    $scope.HideShowprocedurescheck = function () {
        $scope.PastVisitSummaryGrid.IsProceduresArray = !$scope.PastVisitSummaryGrid.IsProceduresArray;
    };
    $scope.HideShowROSDetails = function () {
        $scope.PastVisitSummaryGrid.IsROSArray = !$scope.PastVisitSummaryGrid.IsROSArray;
    };
    $scope.HideShowVisionAndPerceptionDetails = function () {
        $scope.PastVisitSummaryGrid.IsVisionAndPerceptionArray = !$scope.PastVisitSummaryGrid.IsVisionAndPerceptionArray;
    };
    $scope.HideShowExaminationsDetails = function () {
        $scope.PastVisitSummaryGrid.IsExaminactionArray = !$scope.PastVisitSummaryGrid.IsExaminactionArray;
    };
    $scope.HideShowAssesmentPlanDetails = function () {
        $scope.PastVisitSummaryGrid.IsAssesmentPlanArray = !$scope.PastVisitSummaryGrid.IsAssesmentPlanArray;
    };

    $scope.ChangeCheckitem = function (item, array, ind) {

        $scope.TempIsCheckArray = [];
        $scope.TempIsCheckArray = $filter("filter")($scope.GridPastVisitSummaryObj.ChiefcomplantsArray, function (iterator, ind) { return iterator.IsCheck === true; }) || [];

        $scope.TempIsCheckROSArray = $filter("filter")($scope.GridPastVisitSummaryObj.ROSArray, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckROSArray.length > 0) {
            angular.forEach($scope.TempIsCheckROSArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckVandPArray = $filter("filter")($scope.GridPastVisitSummaryObj.VisionAndPerceptionArray, function (iterator, ind) { return iterator.IsCheck === true && iterator.Name !== "Refraction" }) || [];
        if ($scope.TempIsCheckVandPArray.length > 0) {
            angular.forEach($scope.TempIsCheckVandPArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckRefractionArray = $filter("filter")($scope.GridPastVisitSummaryObj.VisionAndPerceptionArray[1].RefractionArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckRefractionArray.length > 0) {
            angular.forEach($scope.TempIsCheckRefractionArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckExaminactionArray = $filter("filter")($scope.GridPastVisitSummaryObj.ExaminactionArray, function (iterator, ind) { return iterator.IsCheck === true && iterator.Name !== "Color Vision" && iterator.Name !== "Motor examination" }) || [];
        if ($scope.TempIsCheckExaminactionArray.length > 0) {
            angular.forEach($scope.TempIsCheckExaminactionArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckColorVisionArr = $filter("filter")($scope.GridPastVisitSummaryObj.ExaminactionArray[4].ColorVisionArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckColorVisionArr.length > 0) {
            angular.forEach($scope.TempIsCheckColorVisionArr, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckSquintEvaluationArr = $filter("filter")($scope.GridPastVisitSummaryObj.ExaminactionArray[9].MotorExaminationArr[0].SquintEvaluationArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckSquintEvaluationArr.length > 0) {
            angular.forEach($scope.TempIsCheckSquintEvaluationArr, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckBinocularVisionArr = $filter("filter")($scope.GridPastVisitSummaryObj.ExaminactionArray[9].MotorExaminationArr[1].BinocularVisionArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckBinocularVisionArr.length > 0) {
            angular.forEach($scope.TempIsCheckBinocularVisionArr, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckAssesmentPlanArray = $filter("filter")($scope.GridPastVisitSummaryObj.AssesmentPlanArray, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckAssesmentPlanArray.length > 0) {
            angular.forEach($scope.TempIsCheckAssesmentPlanArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

        $scope.TempOrderIsCheckArray = $filter("filter")($scope.GridPastVisitSummaryObj.Orders, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempOrderIsCheckArray.length > 0) {
            angular.forEach($scope.TempOrderIsCheckArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

        $scope.TempMedicalRxIsCheckArray = $filter("filter")($scope.GridPastVisitSummaryObj.MedicalRx, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempMedicalRxIsCheckArray.length > 0) {
            angular.forEach($scope.TempMedicalRxIsCheckArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

        $scope.TempProceduresIsCheckArray = $filter("filter")($scope.GridPastVisitSummaryObj.Procedures, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempProceduresIsCheckArray.length > 0) {
            angular.forEach($scope.TempProceduresIsCheckArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

        if ($scope.TempIsCheckArray.length > 7) {
            array[ind].IsCheck = false;
            alertify.error("Only 7 Summery History's Is Checked....!");
            return false;
        }

        if (item.Name == "Refraction" && item.IsCheck) {
            $scope.PastVisitSummaryGrid.IsSubRefraction = true;
        } else if (item.Name == "Refraction") {
            $scope.PastVisitSummaryGrid.IsSubRefraction = false;
        } else if (item.Name == "Color Vision" && item.IsCheck) {
            $scope.PastVisitSummaryGrid.IsSubColorVision = true;
        } else if (item.Name == "Color Vision") {
            $scope.PastVisitSummaryGrid.IsSubColorVision = false;
        } else if (item.Name == "Motor examination" && item.IsCheck) {
            $scope.PastVisitSummaryGrid.IsSubMotorExamination = true;
        } else if (item.Name == "Motor examination") {
            $scope.PastVisitSummaryGrid.IsSubMotorExamination = false;
        } else if (item.Name == "Squint Evaluation" && item.IsCheck) {
            $scope.PastVisitSummaryGrid.IsSubSquintEvaluationArr = true;
        } else if (item.Name == "Squint Evaluation") {
            $scope.PastVisitSummaryGrid.IsSubSquintEvaluationArr = false;
        } else if (item.Name == "Binocular Vision Test" && item.IsCheck) {
            $scope.PastVisitSummaryGrid.IsSubBinocularVisionArr = true;
        } else if (item.Name == "Binocular Vision Test") {
            $scope.PastVisitSummaryGrid.IsSubBinocularVisionArr = false;
        }
    };

    $scope.CloseGridView = function () {
        $scope.caseObj.PatientPastVisitPopUp = false;
    };

    $scope.GetFilteredContactLensDetails = function (type) {

        let params = {
            "PatientId": $scope.Patientid || 0,
            "FromDate": $filter('date')(new Date($scope.GetContactLensPastVisitsDatesObj.FromDate), "yyyy-MM-dd"),
            "Todate": $filter('date')(new Date($scope.GetContactLensPastVisitsDatesObj.ToDate), "yyyy-MM-dd"),
            "OrganizationId": $scope.HospitalId,
            "DefaultAll": $scope.GetContactLensPastVisitsDatesObj.DefaultAll || false
        };
        eHnoteSettingsDataService.GetFilteredContactLensDetails(params).then(function (response) {
            if (response.data.status === "Success") {
                var responsecopy = angular.copy(response.data);
                var uniqApptsList = _.uniq(responsecopy.ContactLensDetails, function (x) {
                    return x.AppointmentId;
                });
                var Appts = [];
                angular.forEach(uniqApptsList, function (item) {
                    Appts.push(item.AppointmentId);
                });
                $scope.GetContactLensObj = function () {
                    return {
                        "AppointmentId": 0,
                        "ApptDate": "",
                        "RDesignType": "",
                        "LDesignType": "",
                        "RSpherical": "",
                        "LSpherical": "",
                        "RCylindrical": "",
                        "LCylindrical": "",
                        "RAxis": "",
                        "LAxis": "",
                        "RDia": "",
                        "LDia": "",
                        "Rk": "",
                        "LK": "",
                        "RCLR": "",
                        "LCLR": "",
                        "RProduct": "",
                        "LProduct": "",
                        "RBCVA": "",
                        "LBCVA": "",
                        "RBCNVA": "",
                        "LBCNVA": "",
                        "RVAI": "",
                        "LVAI": "",
                        "RowSpan": 1,
                        "IsShowDate": true
                    };
                };
                $scope.FilteredContactLensDetails = [];
                angular.forEach(response.data.ContactLensDetails, function (item) {
                    if (item.InvestigationId == 2084) {
                        angular.forEach(item.InvestigationDetails, function (kitem) {
                            kitem.RowSpan = 1;
                            kitem.IsShowDate = true;
                        });
                    }
                });
                angular.forEach(Appts, function (kitem) {
                    let tempArray = $filter('filter')(response.data.ContactLensDetails, { "AppointmentId": kitem, "InvestigationId": 2084 }, true);
                    let ContactLensObj = $scope.GetContactLensObj();
                    if (tempArray[0].InvestigationDetails.length > 1) {
                        for (let i = 0; i < tempArray[0].InvestigationDetails.length; i++) {
                            if (i == 0) {
                                tempArray[0].InvestigationDetails[i].RowSpan = tempArray[0].InvestigationDetails.length;
                                tempArray[0].InvestigationDetails[i].IsShowDate = true;
                            } else {
                                tempArray[0].InvestigationDetails[i].RowSpan = 1;
                                tempArray[0].InvestigationDetails[i].IsShowDate = false;
                            }
                        }
                    }

                    angular.forEach(tempArray, function (item) {
                        if (item.InvestigationId == 2084) {
                            angular.forEach(item.InvestigationDetails, function (litem) {
                                let ContactLensObj = $scope.GetContactLensObj();
                                ContactLensObj.AppointmentId = item.AppointmentId;
                                ContactLensObj.ApptDate = item.AppointmentDate;
                                ContactLensObj.RDesignType = litem.BasicODDesignType;
                                ContactLensObj.LDesignType = litem.BasicOSDesignType;
                                ContactLensObj.RSpherical = litem.BasicODSph;
                                ContactLensObj.LSpherical = litem.BasicOSSph;
                                ContactLensObj.RCylindrical = litem.BasicODCyl;
                                ContactLensObj.LCylindrical = litem.BasicOSCyl;
                                ContactLensObj.RAxis = litem.BasicODAxis;
                                ContactLensObj.LAxis = litem.BasicOSAxis;
                                ContactLensObj.RDia = litem.BasicODDia;
                                ContactLensObj.LDia = litem.BasicOSDia;
                                ContactLensObj.RK = litem.BasicODKeratometry;
                                ContactLensObj.LK = litem.BasicOSKeratometry;
                                ContactLensObj.RCLR = litem.BasicODColor;
                                ContactLensObj.LCLR = litem.BasicOSColor;
                                ContactLensObj.RProduct = litem.BasicODProduct;
                                ContactLensObj.LProduct = litem.BasicOSProduct;
                                ContactLensObj.RBCVA = litem.BasicODVaDistance;
                                ContactLensObj.LBCVA = litem.BasicOSVaDistance;
                                ContactLensObj.RBCNVA = litem.BasicODVaNear;
                                ContactLensObj.LBCNVA = litem.BasicOSVaNear;
                                ContactLensObj.RVAI = litem.BasicODVaIntermediate;
                                ContactLensObj.LVAI = litem.BasicOSVaIntermediate;
                                ContactLensObj.RowSpan = litem.RowSpan;
                                ContactLensObj.IsShowDate = litem.IsShowDate;

                                $scope.FilteredContactLensDetails.push(ContactLensObj);
                            });
                        }

                    });
                });
                $scope.SummaryTab = type || 5;
            }

        });
    };

    $scope.GetContactLensPastVisitsDatesObj = {
        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "DateType": "",
        "DefaultAll": true
    };

    /*<----- ContactLens date ----->*/
    $scope.GetContactLensTodayDates = function (type) {
        $scope.GetContactLensPastVisitsDatesObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetContactLensPastVisitsDatesObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetContactLensPastVisitsDatesObj.DateType = type;
        $scope.GetContactLensPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetContactLensYesterdayDates = function (type) {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        $scope.GetContactLensPastVisitsDatesObj.FromDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetContactLensPastVisitsDatesObj.ToDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetContactLensPastVisitsDatesObj.DateType = type;
        $scope.GetContactLensPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetContactLensThisMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetContactLensPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetContactLensPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetContactLensPastVisitsDatesObj.DateType = type;
        $scope.GetContactLensPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetContactLensPastMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 1;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetContactLensPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetContactLensPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetContactLensPastVisitsDatesObj.DateType = type;
        $scope.GetContactLensPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetContactLensPastThreeMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 3;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 3, 0);
        $scope.GetContactLensPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetContactLensPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetContactLensPastVisitsDatesObj.DateType = type;
        $scope.GetContactLensPastVisitsDatesObj.DefaultAll = false;
    };
    /*<----- ContactLens date ----->*/

    $scope.datepickerpopover3 = {
        templateUrl: 'datepickerpopoverCL.html',
    };

    $scope.GetFilteredDiagnosisHxDetails = function (type) {

        if (type == 6) {
            var params = {
                "PatientId": $scope.Patientid || 0,
                "FromDate": $filter('date')(new Date($scope.GetDiagnosisPastVisitsDatesObj.FromDate), "yyyy-MM-dd"),
                "Todate": $filter('date')(new Date($scope.GetDiagnosisPastVisitsDatesObj.ToDate), "yyyy-MM-dd"),
                "OrganizationId": $scope.HospitalId,
                "DefaultAll": $scope.GetDiagnosisPastVisitsDatesObj.DefaultAll || false
            };
        }
        if (type == 13) {
            var params = {
                "PatientId": $scope.Patientid || 0,
                "FromDate": $filter('date')(new Date($scope.GetCCPastVisitsDatesObj.FromDate), "yyyy-MM-dd"),
                "Todate": $filter('date')(new Date($scope.GetCCPastVisitsDatesObj.ToDate), "yyyy-MM-dd"),
                "OrganizationId": $scope.HospitalId,
                "DefaultAll": $scope.GetCCPastVisitsDatesObj.DefaultAll || false
            };
        }
        eHnoteSettingsDataService.GetFilteredDiagnosisHxDetails(params).then(function (response) {

            $scope.FilteredDiagnosisHxDetails = [];
            if (response.data.status === "Success") {
                $scope.FilteredDiagnosisHxDetails = response.data.rows || [];
                if ($scope.FilteredDiagnosisHxDetails.length > 0) {
                    angular.forEach($scope.FilteredDiagnosisHxDetails, function (item, index) {
                        item.IsSelecteddig = false;
                        item.CcScrollIndex = "ConsultationScrollAtive" + index;
                    });                   
                    $scope.FilteredDiagnosisHxDetails[0].IsSelecteddig = true;
                    $scope.FilteredDiagnosisHxDetails[0].IsActive = true;
                }

                $scope.SummaryTab = type || 6;
            }
        }, function (err) {
            alertify.error("Fetching Data Failed!");
        });

    };

    $scope.datepickerpopover4 = {
        templateUrl: 'datepickerpopoverdig.html',
    };

    $scope.GetDiagnosisPastVisitsDatesObj = {
        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "DateType": "",
        "DefaultAll": true
    };

    /*<----- Diagnosis date ----->*/
    $scope.GetDiagnosisTodayDates = function (type) {
        $scope.GetDiagnosisPastVisitsDatesObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetDiagnosisPastVisitsDatesObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetDiagnosisPastVisitsDatesObj.DateType = type;
        $scope.GetDiagnosisPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetDiagnosisYesterdayDates = function (type) {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        $scope.GetDiagnosisPastVisitsDatesObj.FromDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetDiagnosisPastVisitsDatesObj.ToDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetDiagnosisPastVisitsDatesObj.DateType = type;
        $scope.GetDiagnosisPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetDiagnosisThisMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetDiagnosisPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetDiagnosisPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetDiagnosisPastVisitsDatesObj.DateType = type;
        $scope.GetDiagnosisPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetDiagnosisPastMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 1;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetDiagnosisPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetDiagnosisPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetDiagnosisPastVisitsDatesObj.DateType = type;
        $scope.GetDiagnosisPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetDiagnosisPastThreeMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 3;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 3, 0);
        $scope.GetDiagnosisPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetDiagnosisPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetDiagnosisPastVisitsDatesObj.DateType = type;
        $scope.GetDiagnosisPastVisitsDatesObj.DefaultAll = false;
    };
    /*<----- Diagnosis date ----->*/

    $scope.GetFilteredIOPHxDetails = function (type) {

        let params = {
            "PatientId": $scope.Patientid || 0,
            "FromDate": $filter('date')(new Date($scope.GetIOPPastVisitsDatesObj.FromDate), "yyyy-MM-dd"),
            "Todate": $filter('date')(new Date($scope.GetIOPPastVisitsDatesObj.ToDate), "yyyy-MM-dd"),
            "OrganizationId": $scope.HospitalId,
            "DefaultAll": $scope.GetIOPPastVisitsDatesObj.DefaultAll || false
        };
        eHnoteSettingsDataService.GetFilteredIOPHxDetails(params).then(function (response) {

            $scope.FilteredIOPHxDetails = [];
            $scope.IOPHxPachymetryArray = [];
            $scope.IOPHxLastDilationDate = '';
            $scope.IOPHxLastGonioscopyDate = '';
            $scope.IsIOPHxDetailsINDEmpty = false;

            if (response.data.status === "Success") {

                $scope.FilteredIOPHxDetails = response.data.rows || [];

                $scope.SummaryTab = type || 7;
                $scope.IOPHxLastDilationDate = response.data.LastDilationDate || '';
                $scope.IOPHxLastGonioscopyDate = response.data.LastGonioscopyDate || '';
                $scope.IOPHxPachymetryArray = response.data.Pachymetry || [];

                if ($scope.FilteredIOPHxDetails.length > 0) {
                    var i = 0;
                    angular.forEach($scope.FilteredIOPHxDetails, function (item, index) {

                        item.GlaucomaScrollIndex = "ConsultationScrollAtive" + index;

                        //if (item.SurgeriesDetails.length !== 0 || item.GonioscopyDetails.length !== 0 || item.PosteriorSegmentDetails.length !== 0 || item.PrescriptionDetails.length !== 0 || item.AssessmentPlan.length !== 0) {
                        //    i++;
                        //}
                    });
                    //if (i == 0) {
                    //    $scope.IsIOPHxDetailsINDEmpty = true;
                    //}
                }

                if ($scope.IOPHxPachymetryArray.length > 0) {
                    var countNo = 0;
                    var pachyODAvgValue = 0;
                    var pachyOSAvgValue = 0;
                    angular.forEach($scope.IOPHxPachymetryArray, function (subitem) {
                        $scope.PastVisitsPachyAvgODValue = 0;
                        $scope.PastVisitsPachyAvgOSValue = 0;
                        pachyODAvgValue += parseInt(subitem.RightEye) || 0;
                        pachyOSAvgValue += parseInt(subitem.LeftEye) || 0;
                        countNo++;
                    });
                    $scope.PastVisitsPachyAvgODValue = parseFloat(pachyODAvgValue / countNo).toFixed(2) || 0;
                    $scope.PastVisitsPachyAvgOSValue = parseFloat(pachyOSAvgValue / countNo).toFixed(2) || 0;
                }
            }

        }, function (err) {
            alertify.error("Fetching Data Failed!");
        });
    };


    $scope.ProceduresArrayObj = {
        "MainArray": [],
        "FilteredArray": [],
        "ODArray": [],
        "OSArray":[]
    }
    /*<----- Retina date ----->*/
    $scope.GetProceduresPastVisitsDatesObj = {
        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "DateType": "",
        "DefaultAll": true
    };
    $scope.GetRetinaDetails = function (type) {
        $scope.RetinaGraphObj.IsShowRetinagraph = false;
        $scope.RetinaGraphObj.IsRetinaArrayEmpty = false;
        var params = {
            "PatientId": $scope.Patientid || 0,
            "FromDate": $scope.GetProceduresPastVisitsDatesObj.FromDate || null,
            "Todate": $scope.GetProceduresPastVisitsDatesObj.ToDate || null,
            "OrganizationId": $scope.HospitalId,
            "DefaultAll": $scope.GetProceduresPastVisitsDatesObj.DefaultAll || false
        };
        eHnoteSettingsDataService.GetPatientRetinaDetails(params).then(function (response) {
            if (response.data.status === "Success") {
                
                $scope.ProceduresArrayObj.MainArray = response.data.rows || [];
                $scope.ProceduresArrayObj.FilteredArray = response.data.rows || [];
                $scope.ProceduresArrayObj.ODArray = $filter("filter")($scope.ProceduresArrayObj.FilteredArray, { "OrganId": 1 }, true);
                $scope.ProceduresArrayObj.OSArray = $filter("filter")($scope.ProceduresArrayObj.FilteredArray, { "OrganId": 2 }, true);

                if ($scope.ProceduresArrayObj.FilteredArray.length > 0) {
                    
                    function calculateMonthDayDifference(date1, date2) {
                        var year1 = date1.getFullYear();
                        var year2 = date2.getFullYear();
                        var month1 = date1.getMonth();
                        var month2 = date2.getMonth();
                        var day1 = date1.getDate();
                        var day2 = date2.getDate();

                        var months = (year1 - year2) * 12 + (month1 - month2);
                        var days = day1 - day2;

                        if (days < 0) {
                            months -= 1;
                            var daysInPreviousMonth = new Date(year1, month1, 0).getDate();
                            days += daysInPreviousMonth;
                        }

                        var monthString = months === 1 ? "1 month" : months + " months";
                        var dayString = days === 1 ? "1 day" : days + " days";

                        return (months ? monthString + " " : "") + (days ? dayString : "");
                    }

                    function updatePreviousProcedureDuration(procedures) {
                        for (var i = 0; i < procedures.length; i++) {
                            if (i === 0) {
                                procedures[i].PreviousProcedureDuration = calculateMonthDayDifference(new Date(procedures[i].AppointmentDate), new Date(procedures[1].AppointmentDate));
                            } else {
                                var currentProcedure = procedures[i - 1];
                                var previousProcedure = procedures[i];

                                var currentDate = new Date(currentProcedure.AppointmentDate);
                                var previousDate = new Date(previousProcedure.AppointmentDate);

                                currentProcedure.PreviousProcedureDuration = calculateMonthDayDifference(currentDate, previousDate);
                            }
                        }
                    }

                    if ($scope.ProceduresArrayObj.ODArray.length > 1) {
                        updatePreviousProcedureDuration($scope.ProceduresArrayObj.ODArray);
                    }
                    if ($scope.ProceduresArrayObj.OSArray.length > 1) {
                        updatePreviousProcedureDuration($scope.ProceduresArrayObj.OSArray);
                    }

                 

                    angular.forEach($scope.ProceduresArrayObj.FilteredArray, function (pitem){

                        if (pitem.OrganId==1) {
                            var List = $filter("filter")($scope.ProceduresArrayObj.ODArray, { "PatientRetinaId": pitem.PatientRetinaId }, true);
                            if (List.length > 0) {
                                pitem.PreviousProcedureDurationOD = List[0].PreviousProcedureDuration || "";
                            }
                        }
                        else if (pitem.OrganId == 2) {
                            var List = $filter("filter")($scope.ProceduresArrayObj.OSArray, { "PatientRetinaId": pitem.PatientRetinaId }, true);
                            if (List.length > 0) {
                                pitem.PreviousProcedureDurationOS = List[0].PreviousProcedureDuration || "";
                            }
                        }
                    });


                }

                $scope.SummaryTab = type || 17;
                if ($scope.ProceduresArrayObj.FilteredArray.length == 0) {
                    $scope.RetinaGraphObj.IsRetinaArrayEmpty = true;
                }
            }
        }, function (err) {
            alertify.error("Fetching Data Failed!");
        });
    };

    /*<----- IOP date ----->*/
    $scope.GetIOPPastVisitsDatesObj = {
        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "DateType": "",
        "DefaultAll": true
    };

    $scope.GetIOPTodayDates = function (type) {
        $scope.GetIOPPastVisitsDatesObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.DateType = type;
        $scope.GetIOPPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetIOPYesterdayDates = function (type) {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        $scope.GetIOPPastVisitsDatesObj.FromDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.ToDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.DateType = type;
        $scope.GetIOPPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetIOPThisMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetIOPPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.DateType = type;
        $scope.GetIOPPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetIOPPastMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 1;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetIOPPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.DateType = type;
        $scope.GetIOPPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetIOPPastThreeMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 3;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 3, 0);
        $scope.GetIOPPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.DateType = type;
        $scope.GetIOPPastVisitsDatesObj.DefaultAll = false;
    };
    /*<----- IOP date ----->*/

    $scope.datepickerpopover5 = {
        templateUrl: 'datepickerpopover5.html',
    };

    $scope.FilteredRxHistoryDetails = function (type) {

        let params = {
            "PatientId": $scope.Patientid || 0,
            "FromDate": $filter('date')(new Date($scope.GetMedicationPastVisitsDatesObj.FromDate), "yyyy-MM-dd"),
            "Todate": $filter('date')(new Date($scope.GetMedicationPastVisitsDatesObj.ToDate), "yyyy-MM-dd"),
            "OrganizationId": $scope.HospitalId,
            "DefaultAll": $scope.GetMedicationPastVisitsDatesObj.DefaultAll || false
        };
        eHnoteSettingsDataService.GetFilteredRxHistoryDetails(params).then(function (response) {
            if (response.data.status === "Success") {
                response.data.rows = response.data.rows || [];
                if (response.data.rows.length > 0) {
                    $scope.AppointmentPrescriptionsList = response.data.rows || [];
                } else {
                    $scope.AppointmentPrescriptionsList = [];
                }
                $scope.SummaryTab = type || 8;

                if ($scope.AppointmentPrescriptionsList.length > 0) {
                    angular.forEach($scope.AppointmentPrescriptionsList, function (item, index) {
                        item.RXScrollIndex = "ConsultationScrollAtive" + index;
                    });
                }
            }
        }, function (err) {
            alertify.error("Fetching Data Failed!");
        });
    };

    /*<-----  Rx History Date ----->*/

    $scope.GetMedicationPastVisitsDatesObj = {

        "FromDate": '',
        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "DateType": "",
        "DefaultAll": false
    };
    let currentdate = new Date();
    let last3months = new Date(currentdate.setMonth(currentdate.getMonth() - 3));
    $scope.GetMedicationPastVisitsDatesObj.FromDate = $filter('date')(last3months, "yyyy-MM-dd");

    $scope.GetMedicationRxTodayDates = function (type) {
        $scope.GetMedicationPastVisitsDatesObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetMedicationPastVisitsDatesObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetMedicationPastVisitsDatesObj.DateType = type;
        $scope.GetMedicationPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetMedicationRxYesterdayDates = function (type) {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        $scope.GetMedicationPastVisitsDatesObj.FromDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetMedicationPastVisitsDatesObj.ToDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetMedicationPastVisitsDatesObj.DateType = type;
        $scope.GetMedicationPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetMedicationRxThisMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetMedicationPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetMedicationPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetMedicationPastVisitsDatesObj.DateType = type;
        $scope.GetMedicationPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetMedicationRxPastMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 1;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetMedicationPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetMedicationPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetMedicationPastVisitsDatesObj.DateType = type;
        $scope.GetMedicationPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetMedicationRxPastThreeMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 3;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 3, 0);
        $scope.GetMedicationPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetMedicationPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetMedicationPastVisitsDatesObj.DateType = type;
        $scope.GetMedicationPastVisitsDatesObj.DefaultAll = false;
    };
    /*<----- Rx History Date ----->*/

    $scope.datepickerpopover7 = {
        templateUrl: 'datepickerpopover7.html',
    };

    $scope.GetFilteredPlanHxDetails = function (type) {
        if (type == 9) {
            var params = {
                "PatientId": $scope.Patientid || 0,
                "FromDate": $filter('date')(new Date($scope.GetIOPPastVisitsDatesObj.FromDate), "yyyy-MM-dd"),
                "Todate": $filter('date')(new Date($scope.GetIOPPastVisitsDatesObj.ToDate), "yyyy-MM-dd"),
                "OrganizationId": $scope.HospitalId,
                "DefaultAll": $scope.GetIOPPastVisitsDatesObj.DefaultAll || false
            };
        }
        if (type == 16) {
            var params = {
                "PatientId": $scope.Patientid || 0,
                "FromDate": $filter('date')(new Date($scope.GetOrdersPastVisitsDatesObj.FromDate), "yyyy-MM-dd"),
                "Todate": $filter('date')(new Date($scope.GetOrdersPastVisitsDatesObj.ToDate), "yyyy-MM-dd"),
                "OrganizationId": $scope.HospitalId,
                "DefaultAll": $scope.GetOrdersPastVisitsDatesObj.DefaultAll || false
            };
        }
        eHnoteSettingsDataService.GetFilteredPlanHxDetails(params).then(function (response) {

            $scope.FilteredPlanHxDetails = [];
            if (response.data.status === "Success") {
                $scope.FilteredPlanHxDetails = response.data.rows || [];
                $scope.SummaryTab = type || 9;
            }

            var i = 0;
            if ($scope.FilteredPlanHxDetails.length > 0) {
                angular.forEach($scope.FilteredPlanHxDetails, function (item, index) {
                    item.IsSelectedItem = false;
                    item.IsActive = false;
                    item.PlanScrollIndex = "ConsultationScrollAtive" + index;
                });
                $scope.FilteredPlanHxDetails[0].IsSelectedItem = true;
                $scope.FilteredPlanHxDetails[0].IsActive = true;
            }
            
        }, function (err) {
            alertify.error("Fetching Data Failed!");
        });
    };

    /*<----- Plan Hx date ----->*/
    $scope.GetPlanHxTodayDates = function (type) {
        $scope.GetIOPPastVisitsDatesObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.DateType = type;
        $scope.GetIOPPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetPlanHxYesterdayDates = function (type) {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        $scope.GetIOPPastVisitsDatesObj.FromDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.ToDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.DateType = type;
        $scope.GetIOPPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetPlanHxThisMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetIOPPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.DateType = type;
        $scope.GetIOPPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetPlanHxPastMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 1;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetIOPPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.DateType = type;
        $scope.GetIOPPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetPlanHxPastThreeMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 3;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 3, 0);
        $scope.GetIOPPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetIOPPastVisitsDatesObj.DateType = type;
        $scope.GetIOPPastVisitsDatesObj.DefaultAll = false;
    };
    /*<----- Plan Hx date ----->*/

    $scope.datepickerpopover6 = {
        templateUrl: 'datepickerpopover6.html',
    };

    $scope.ChangeMainTab = function (id) {
        $scope.MainTabTab = id || 2;
        if ($scope.MainTabTab == 1) {
            $scope.GetOpthaPatientCaseHistory1();
        }
    };

    $scope.ChartObj = {
        "SubMainTab": 1,
        "AppointmentId": null,
        "AppointmentDate": null,
        "IsComingFromChart": false,
        "DoctorId": null,
    }

    $scope.ProcedureNotesObj = {
        "Notes": ""
    };

    $scope.GetScoreObject = function () {
        return {
            "PHQScore": 0,
            "AUDITScore": 0,
            "NHANESscore": 0,
            "HARKscore": 0
        }
    };
    $scope.ScoreObject = angular.copy($scope.GetScoreObject());

    $scope.GetMasterTestUsed = function () {
        $scope.MasterTestUsedlist = [];
        eHnoteSettingsDataService.GetMasterTestUsed().then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.MasterTestUsedlist = resp.data.rows || [];
            }

        });
    };
    $scope.GetMasterTestUsed();
    //$scope.GetMasterTestUsed = function () {
    //    return [
    //        {
    //            "TestUserId": 1,
    //            "TestName": "Snellen"
    //        },
    //        {
    //            "TestUserId": 2,
    //            "TestName": "HOTV"
    //        },
    //        {
    //            "TestUserId": 3,
    //            "TestName": "ATS"
    //        },
    //        {
    //            "TestUserId": 4,
    //            "TestName": "LEA"
    //        },
    //        {
    //            "TestUserId": 5,
    //            "TestName": "AC"
    //        },
    //        {
    //            "TestUserId": 6,
    //            "TestName": "PLT"
    //        },
    //        {
    //            "TestUserId": 7,
    //            "TestName": "Numbers"
    //        }
    //    ]
    //};
    //$scope.MasterTestUsedlist = angular.copy($scope.GetMasterTestUsed());
    $scope.GetPatientAppointmenthistroy = function (consultationid, AppointmentID) {
        var type = 0;
        if (consultationid === 0) {
            type = 1;
        }
        var object = {
            "AppointmentId": AppointmentID,
            "Type": type
        };
        eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
            if (resp.data !== undefined) {
                $scope.treatmentData = resp.data;
                $scope.treatmentArray = [];

                angular.forEach(resp.data, function (item) {
                    if (AppointmentID === item.AppointmentId) {

                        let ApptTime = item.AppointmentDt + ' ' + item.AppointmentTime;
                        ApptTime = $filter('date')(new Date(ApptTime), "hh:mm a");
                        item.AppointmentTime = ApptTime;

                        $scope.treatmentArray.push(item);
                    }
                });

                if (resp.data.length > 0) {
                    $scope.referalMailBind = resp.data[0].ReferralDocemail || "";
                    $scope.referalDoctorID = resp.data[0].ReferalDoctorId;
                    $scope.PsychologicalObservationsArray = resp.data[0].PsychologicalObservationsArray || [];
                    $scope.AnteriorSegmentDetails = resp.data[0].AnteriorSegmentDetails || [];
                    $scope.PosteriorSegmentDetails = resp.data[0].PosteriorSegmentDetails || [];
                    $scope.cacheStorageItem.ReferalDoctorName = resp.data[0].ReferalDoctorName || "";
                    $scope.cacheStorageItem.RefeRalDoctorNotes = resp.data[0].RefeRalDoctorNotes || "";
                    $scope.cacheStorageItem.DilationArray = resp.data[0].DilationArray || [];
                }

                $scope.SelectedPlanArray = $filter("filter")($scope.treatmentData, { "AppointmentId": AppointmentID }, true);
                $scope.cacheStorageItem.appointmentid = AppointmentID;
                $scope.cacheStorageItem.ConsultationID = consultationid;
                if ($scope.SelectedPlanArray.length > 0) {
                    /*$scope.RestructureToconsultation($scope.SelectedPlanArray[0], consultationid);*/
                    $scope.ProcedureNotesObj.Notes = $scope.SelectedPlanArray[0].OverallProcedureNotes || "";
                }
                $scope.cacheStorageItem.OPProceduresArray = $scope.cacheStorageItem.OPProceduresArray || [];

                if ($scope.cacheStorageItem.OPProceduresArray.length > 0) {
                    angular.forEach($scope.cacheStorageItem.OPProceduresArray, function (item) {
                        item.PostOPEndDate = item.PostOPEndDate || "";
                        item.PostOPStartDate = item.PostOPStartDate || "";
                        item.PostOPEndDate = item.PostOPEndDate == "" ? item.PostOPEndDate : $filter("date")(new Date(item.PostOPEndDate), "MM-dd-yyyy");
                        item.PostOPStartDate = item.PostOPStartDate == "" ? item.PostOPStartDate : $filter("date")(new Date(item.PostOPStartDate), "MM-dd-yyyy");
                        item.SurgeryDate = $filter("date")(new Date(item.SurgeryDate), "MM-dd-yyyy");
                    });
                }
                if ($scope.PsychologicalObservationsArray !== undefined) {
                    if ($scope.PsychologicalObservationsArray.length !== 0) {
                        $scope.ScoreObject = angular.copy($scope.GetScoreObject());
                        angular.forEach($scope.PsychologicalObservationsArray, function (Aitem) {
                            if (Aitem.TypeId == 1) {
                                if (Aitem.QuestionId == 4) {
                                    angular.forEach(Aitem.SubQuestions, function (item) {
                                        $scope.ScoreObject.PHQScore += item.Score;
                                    });
                                }

                                if (Aitem.QuestionId == 7) {
                                    angular.forEach(Aitem.SubQuestions, function (item) {
                                        $scope.ScoreObject.AUDITScore += item.Score;
                                    });
                                }
                            }
                            if (Aitem.TypeId == 2) {
                                $scope.ScoreObject.NHANESscore += Aitem.Score;
                            }
                            if (Aitem.TypeId == 3) {
                                $scope.ScoreObject.HARKscore += Aitem.Score;
                            }
                        });

                        $scope.cacheStorageItem.PsychologicalObservationsArray = angular.copy($scope.PsychologicalObservationsArray);
                    } else {
                        $scope.ScoreObject = angular.copy($scope.GetScoreObject());
                    }
                }
                $scope.cacheStorageItem.FamilyHistory = $scope.cacheStorageItem.FamilyHistory || [];
                if ($scope.cacheStorageItem.FamilyHistory.length > 0) {
                    angular.forEach($scope.cacheStorageItem.FamilyHistory, function (Fitem) {
                        Fitem.RelationShipId = Fitem.RelationId || 0;
                        Fitem.RelationShipName = Fitem.RelationName || '';
                    });
                }

                var count1 = 0;
                var pachyODAvgValue = 0;
                var pachyOSAvgValue = 0;
                angular.forEach($scope.treatmentData, function (supitem) {
                    if (supitem.Pachymetry.length > 0) {
                        angular.forEach(supitem.Pachymetry, function (pitem) {
                            pachyODAvgValue += parseInt(pitem.RightEye) || 0;
                            pachyOSAvgValue += parseInt(pitem.LeftEye) || 0;
                            count1++;
                        });
                    }
                });
                $scope.PastVisitsPachyAvgODValue = parseFloat(pachyODAvgValue / count1).toFixed(2) || 0;
                $scope.PastVisitsPachyAvgOSValue = parseFloat(pachyOSAvgValue / count1).toFixed(2) || 0;

                $scope.AnteriorSegmentDetails = $scope.AnteriorSegmentDetails || [];
                if ($scope.AnteriorSegmentDetails.length > 0) {
                    $scope.IsAnyAnteriorRemarksIsActive = false;
                    angular.forEach($scope.AnteriorSegmentDetails, function (item) {
                        if (item.ActiveInd == "Y") {
                            if (item.RemarksArray.length !== 0) {
                                $scope.IsAnyAnteriorRemarksIsActive = true;
                            }
                        }
                    });
                } else {
                    $scope.IsAnyAnteriorRemarksIsActive = false;
                }
                $scope.PosteriorSegmentDetails = $scope.PosteriorSegmentDetails || [];
                if ($scope.PosteriorSegmentDetails.length > 0) {
                    $scope.IsAnyPosteriorRemarksIsActive = false;
                    angular.forEach($scope.PosteriorSegmentDetails, function (item) {
                        if (item.ActiveInd == "Y" && item.InvestigationId !== 32) {
                            if (item.RemarksArray.length !== 0) {
                                $scope.IsAnyPosteriorRemarksIsActive = true;
                            }
                        }
                        else if (item.ActiveInd == "Y" && item.InvestigationId == 32) {
                            item.RHorizontal = item.RHorizontal || '';
                            item.RVertical = item.RVertical || '';
                            item.RDPS = item.RDPS || '';
                            item.LHorizontal = item.LHorizontal || '';
                            item.LVertical = item.LVertical || '';
                            item.LDPS = item.LDPS || '';
                            if (item.RHorizontal !== '' || item.RVertical !== '' || item.RDPS !== '' || item.LHorizontal !== '' || item.LVertical !== '' || item.LDPS !== '') {
                                $scope.IsAnyPosteriorRemarksIsActive = true;
                            }
                        }
                    });
                }
                else {
                    $scope.IsAnyPosteriorRemarksIsActive = false;
                }

            }
        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
        });
    };

    $scope.GetOpthaPatientCaseHistory1 = function () {
        $scope.CaseHistory = [];
        var AppointmentTypeIds = null;
        AppointmentTypeIds = "1,2,3,4,5,6,7,8,9,10,14";


        var object = {
            "PatientID": $scope.Patientid,
            "HospitalID": $scope.HospitalId,
            "AppointmentTypeIds": AppointmentTypeIds
        };
        eHnotePatientDataService.GetAppointmentsForCaseHistory(object).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.length > 0) {
                    $scope.CaseHistory = resp.data;
                    var ConsultationId = resp.data[0].ConsultationId || 0;
                    var AppointmentId = resp.data[0].AppointmentId || 0;
                    $scope.AppointmentTypeId = resp.data[0].AppointmentTypeId || 0;
                    $scope.SelectedAppointmentId = resp.data[0].AppointmentId || 0;
                    $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId);

                    var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
                    if (currentdate === $scope.ChartObj.AppointmentDate) {
                        $scope.IsAppointmentToday = true;
                    } else {
                        $scope.IsAppointmentToday = false;
                    }
                }
            }
            if (resp.data.status === "Failure") {
                alertify.error("Getting Casehistory Failed");
                return;
            }
        }, function (err) {
            alertify.error("Getting Casehistory Failed");
            $scope.CaseHistory = [];
        });
    };

    $scope.ChangesConsultation = function (item) {
        var ConsultationId = item.ConsultationId || 0;
        var AppointmentId = item.AppointmentId || 0;
        $scope.SelectedAppointmentId = item.AppointmentId || 0;
        $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId);
        $scope.AppointmentTypeId = item.AppointmentTypeId || 0;

    }

    $scope.SelectPirticularAppt = function (item) {
        if ($scope.FilteredPlanHxDetails.length > 0) {
            angular.forEach($scope.FilteredPlanHxDetails, function (sitem) {
                sitem.IsSelectedItem = false;
            });
        }
        item.IsSelectedItem = true;
    };

    $scope.Overalgraphsummary = function () {

        var obj = {
            "PatientId": $scope.cacheStorageItem.patientid
        };
        eHnotePatientDataService.GetGraphRelatedPatientData(obj).then(function (resp) {
            $scope.PatientVAGraphData = [];
            if (resp.data.Status == "Success") {
                $scope.PatientGraphsData = resp.data.rows || [];

                $scope.mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/uibpopups/Overalgraphsummary.html",
                    "backdrop": "static",
                    "keyboard": false,
                    // "windowClass": "modal__popup--1 bottom-to-top-modal in",
                    "windowClass": "offcanves-right",
                    "scope": $scope,
                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                        $scope.SubTab = 1;
                        function GetPVGraphObj() {
                            return {
                                "ShowCCIOP": false,
                                "ALLShowCCIOP": false,

                                "IsIOPGraphArrayEmpty": false,
                                "IsVAGraphArrayEmpty": false,
                                "IsRefractionGraphArrayEmpty": false,
                                "IsCDRGraphArrayEmpty": false
                            }
                        };
                        $scope.PastVisitGraphObj = GetPVGraphObj();

                        $scope.GraphVAsubTabclick = function (type) {
                            if (type == 'VisualAcuity' && $scope.PatientGraphsData.length > 0) {
                                $scope.PatientVAGraphData = $scope.PatientGraphsData || [];
                                const labels1 = [];
                                angular.forEach($scope.PatientVAGraphData, function (item, index) {
                                    item.AppointmentDate = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                                    labels1.unshift(item.AppointmentDate);
                                });

                                let VisualAcuityODArray = [];
                                angular.forEach($scope.PatientVAGraphData, function (item) {

                                    if (item.VisionDetails.length > 0) {
                                        angular.forEach(item.VisionDetails, function (Vitem) {
                                            if (Vitem.RightEyeValues.Distance !== '' && Vitem.InvestigationId == 4) {
                                                var fractionParts = Vitem.RightEyeValues.Distance.split('/');
                                                var numerator = fractionParts[0];
                                                var FinalODDenominator = fractionParts[1];

                                                if (fractionParts[1] !== undefined) {
                                                    var denominator1 = fractionParts[1].split('+');
                                                    if (denominator1[1] !== undefined) {
                                                        var denominatorA = denominator1[0];
                                                        var denominatorB = denominator1[1];
                                                        denominatorA = parseInt(denominatorA) || 0;
                                                        denominatorB = parseInt(denominatorB) || 0;
                                                        FinalODDenominator = denominatorA + denominatorB;
                                                    }

                                                    var denominator2 = fractionParts[1].split('-');
                                                    if (denominator2[1] !== undefined) {
                                                        var denominatorA = denominator2[0];
                                                        var denominatorB = denominator2[1];
                                                        denominatorA = parseInt(denominatorA) || 0;
                                                        denominatorB = parseInt(denominatorB) || 0;
                                                        FinalODDenominator = denominatorA - denominatorB;
                                                    }
                                                }

                                                let Date = item.AppointmentDate;
                                                let obj = {
                                                    x: Date,
                                                    y: (FinalODDenominator != '') ? FinalODDenominator : null
                                                };
                                                VisualAcuityODArray.push(obj);
                                            }
                                        });

                                    }
                                });

                                let VisualAcuityOSArray = [];
                                angular.forEach($scope.PatientVAGraphData, function (item) {
                                    if (item.VisionDetails.length > 0) {
                                        angular.forEach(item.VisionDetails, function (Vitem) {
                                            if (Vitem.LeftEyeValues.Distance !== '' && Vitem.InvestigationId == 4) {
                                                var fractionParts = Vitem.LeftEyeValues.Distance.split('/');
                                                var numerator = fractionParts[0];
                                                var FinalOSDenominator = fractionParts[1];

                                                if (fractionParts[1] !== undefined) {
                                                    var denominator1 = fractionParts[1].split('+');
                                                    if (denominator1[1] !== undefined) {
                                                        var denominatorA = denominator1[0];
                                                        var denominatorB = denominator1[1];
                                                        denominatorA = parseInt(denominatorA) || 0;
                                                        denominatorB = parseInt(denominatorB) || 0;
                                                        FinalOSDenominator = denominatorA + denominatorB;
                                                    }

                                                    var denominator2 = fractionParts[1].split('-');
                                                    if (denominator2[1] !== undefined) {
                                                        var denominatorA = denominator2[0];
                                                        var denominatorB = denominator2[1];
                                                        denominatorA = parseInt(denominatorA) || 0;
                                                        denominatorB = parseInt(denominatorB) || 0;
                                                        FinalOSDenominator = denominatorA - denominatorB;
                                                    }
                                                }

                                                let Date = item.AppointmentDate;
                                                let obj = {
                                                    x: Date,
                                                    y: (FinalOSDenominator != '') ? FinalOSDenominator : null
                                                };
                                                VisualAcuityOSArray.push(obj);
                                            }
                                        });

                                    }
                                });

                                let VisualAcuityCCODArray = [];
                                angular.forEach($scope.PatientVAGraphData, function (item) {
                                    if (item.VisionDetails.length > 0) {
                                        angular.forEach(item.VisionDetails, function (Vitem) {
                                            if (Vitem.RightEyeValues.Distance !== '' && Vitem.InvestigationId == 5) {
                                                var fractionParts = Vitem.RightEyeValues.Distance.split('/');
                                                var numerator = fractionParts[0];
                                                var FinalCCODdenominator = fractionParts[1];

                                                if (fractionParts[1] !== undefined) {
                                                    var denominator1 = fractionParts[1].split('+');
                                                    if (denominator1[1] !== undefined) {
                                                        var denominatorA = denominator1[0];
                                                        var denominatorB = denominator1[1];
                                                        denominatorA = parseInt(denominatorA) || 0;
                                                        denominatorB = parseInt(denominatorB) || 0;
                                                        FinalCCODdenominator = denominatorA + denominatorB;
                                                    }

                                                    var denominator2 = fractionParts[1].split('-');
                                                    if (denominator2[1] !== undefined) {
                                                        var denominatorA = denominator2[0];
                                                        var denominatorB = denominator2[1];
                                                        denominatorA = parseInt(denominatorA) || 0;
                                                        denominatorB = parseInt(denominatorB) || 0;
                                                        FinalCCODdenominator = denominatorA - denominatorB;
                                                    }
                                                }

                                                let Date = item.AppointmentDate;
                                                let obj = {
                                                    x: Date,
                                                    y: (FinalCCODdenominator != '') ? FinalCCODdenominator : null
                                                };
                                                VisualAcuityCCODArray.push(obj);
                                            }
                                        });
                                    }
                                });

                                let VisualAcuityCCOSArray = [];
                                angular.forEach($scope.PatientVAGraphData, function (item) {
                                    if (item.VisionDetails.length > 0) {
                                        angular.forEach(item.VisionDetails, function (Vitem) {
                                            if (Vitem.LeftEyeValues.Distance !== '' && Vitem.InvestigationId == 5) {
                                                var fractionParts = Vitem.LeftEyeValues.Distance.split('/');
                                                var numerator = fractionParts[0];
                                                var FinalCCOSdenominator = fractionParts[1];

                                                if (fractionParts[1] !== undefined) {
                                                    var denominator1 = fractionParts[1].split('+');
                                                    if (denominator1[1] !== undefined) {
                                                        var denominatorA = denominator1[0];
                                                        var denominatorB = denominator1[1];
                                                        denominatorA = parseInt(denominatorA) || 0;
                                                        denominatorB = parseInt(denominatorB) || 0;
                                                        FinalCCOSdenominator = denominatorA + denominatorB;
                                                    }

                                                    var denominator2 = fractionParts[1].split('-');
                                                    if (denominator2[1] !== undefined) {
                                                        var denominatorA = denominator2[0];
                                                        var denominatorB = denominator2[1];
                                                        denominatorA = parseInt(denominatorA) || 0;
                                                        denominatorB = parseInt(denominatorB) || 0;
                                                        FinalCCOSdenominator = denominatorA - denominatorB;
                                                    }
                                                }

                                                let Date = item.AppointmentDate;
                                                let obj = {
                                                    x: Date,
                                                    y: (FinalCCOSdenominator != '') ? FinalCCOSdenominator : null
                                                };
                                                VisualAcuityCCOSArray.push(obj);
                                            }
                                        });
                                    }

                                });

                                if (VisualAcuityODArray.length == 0 && VisualAcuityOSArray.length == 0 && VisualAcuityCCODArray.length == 0 && VisualAcuityCCOSArray.length == 0) {
                                    $scope.PastVisitGraphObj.IsVAGraphArrayEmpty = true;
                                    $scope.SubTab = 2;
                                    return false;
                                }

                                const data1 = {
                                    labels: labels1,
                                    datasets: [
                                        {
                                            type: 'scatter',
                                            label: 'SC OD',
                                            backgroundColor: 'rgb(255, 0, 0)',
                                            borderColor: 'rgb(255, 0, 0)',
                                            showLine: true,
                                            data: VisualAcuityODArray,
                                            spanGaps: true,
                                        },
                                        {
                                            type: 'scatter',
                                            label: 'CC OD',
                                            backgroundColor: 'rgb(245, 66, 120)',
                                            borderColor: 'rgb(245, 66, 120)',
                                            showLine: true,
                                            data: VisualAcuityCCODArray,
                                            spanGaps: true,
                                        },
                                        {
                                            type: 'scatter',
                                            label: 'SC OS',
                                            backgroundColor: '#5742f5',
                                            borderColor: '#5742f5',
                                            showLine: true,
                                            data: VisualAcuityOSArray,
                                            spanGaps: true,
                                        },
                                        {
                                            type: 'scatter',
                                            label: 'CC OS',
                                            backgroundColor: '#42e3f5',
                                            borderColor: '#42e3f5',
                                            showLine: true,
                                            data: VisualAcuityCCOSArray,
                                            spanGaps: true,
                                        }
                                    ]
                                }

                                let len = $("canvas#myChart").length;
                                if (len > 0) {
                                    $("canvas#myChart").remove();
                                    $("div.PastVisitVAGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                                } else if (len === 0) {
                                    $("div.PastVisitVAGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
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

                                $scope.SubTab = 2;
                            }
                        };

                        $scope.GraphIOPsubTabclick = function (type) {
                            if (type == 'IOP' && $scope.PatientGraphsData.length > 0) {
                                $scope.PatientIOPGraphData = $scope.PatientGraphsData || [];

                                const labels1 = [];
                                angular.forEach($scope.PatientIOPGraphData, function (item, index) {
                                    item.AppointmentDate = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                                    labels1.unshift(item.AppointmentDate);
                                });

                                let IOPODValuesArray = [];
                                angular.forEach($scope.PatientIOPGraphData, function (item) {
                                    if (item.Tonometry.length > 0) {
                                        let lastObject = item.Tonometry[item.Tonometry.length - 1];
                                        if (lastObject.BeforeDilationRightEye != '') {
                                            var IOPODValuesYaxisvalue = lastObject.BeforeDilationRightEye;
                                        } else {
                                            var IOPODValuesYaxisvalue = lastObject.AfterDilationRightEye;
                                        }

                                        let Date = item.AppointmentDate;
                                        let obj = {
                                            x: Date,
                                            y: (IOPODValuesYaxisvalue != '') ? IOPODValuesYaxisvalue : null
                                        };
                                        IOPODValuesArray.push(obj);
                                    }
                                });

                                let IOPOSValuesArray = [];
                                angular.forEach($scope.PatientIOPGraphData, function (item) {
                                    var todaydate = $filter('date')(new Date(), "MM-dd-yyyy") || "";
                                    if (item.Tonometry.length > 0) {
                                        let lastObject = item.Tonometry[item.Tonometry.length - 1];

                                        if (lastObject.BeforeDilationLeftEye != '') {
                                            var IOPOSValuesYaxisvalue = lastObject.BeforeDilationLeftEye;
                                        } else {
                                            var IOPOSValuesYaxisvalue = lastObject.AfterDilationLeftEye;
                                        }

                                        let Date = item.AppointmentDate;
                                        let obj = {
                                            x: Date,
                                            y: (IOPOSValuesYaxisvalue != '') ? IOPOSValuesYaxisvalue : null
                                        };
                                        IOPOSValuesArray.push(obj);
                                    }
                                });

                                let IOPCCODValuesArray = [];
                                angular.forEach($scope.PatientIOPGraphData, function (item) {
                                    var todaydate = $filter('date')(new Date(), "MM-dd-yyyy") || "";
                                    if (item.Tonometry.length > 0) {
                                        let lastObject = item.Tonometry[item.Tonometry.length - 1];

                                        let Date = item.AppointmentDate;
                                        let obj = {
                                            x: Date,
                                            y: (lastObject.BeforeDilationODCC != '') ? lastObject.BeforeDilationODCC : null
                                        };
                                        IOPCCODValuesArray.push(obj);
                                    }
                                });

                                let IOPCCOSValuesArray = [];
                                angular.forEach($scope.PatientIOPGraphData, function (item) {
                                    var todaydate = $filter('date')(new Date(), "MM-dd-yyyy") || "";
                                    if (item.Tonometry.length > 0) {
                                        let lastObject = item.Tonometry[item.Tonometry.length - 1];

                                        let Date = item.AppointmentDate;
                                        let obj = {
                                            x: Date,
                                            y: (lastObject.BeforeDilationOSCC != '') ? lastObject.BeforeDilationOSCC : null
                                        };
                                        IOPCCOSValuesArray.push(obj);
                                    }
                                });

                                let TargetIOPODArray = [];
                                angular.forEach($scope.PatientIOPGraphData, function (item) {
                                    if (item.IOPValues.length > 0) {
                                        item.IOPValues[0].TargetIOPODValue = item.IOPValues[0].TargetIOPODValue || null;
                                        if (item.IOPValues[0].TargetIOPODValue !== null) {
                                            let Date = item.AppointmentDate;
                                            let obj = {
                                                x: Date,
                                                y: (item.IOPValues[0].TargetIOPODValue != '') ? item.IOPValues[0].TargetIOPODValue : null
                                            };
                                            TargetIOPODArray.push(obj);
                                        }
                                    }
                                });

                                let TargetIOPOSArray = [];
                                angular.forEach($scope.PatientIOPGraphData, function (item) {
                                    if (item.IOPValues.length > 0) {
                                        item.IOPValues[0].TargetIOPOSValue = item.IOPValues[0].TargetIOPOSValue || null;
                                        if (item.IOPValues[0].TargetIOPOSValue !== null) {
                                            let Date = item.AppointmentDate;
                                            let obj = {
                                                x: Date,
                                                y: (item.IOPValues[0].TargetIOPOSValue != '') ? item.IOPValues[0].TargetIOPOSValue : null
                                            };
                                            TargetIOPOSArray.push(obj);
                                        }
                                    }
                                });

                                let MedicationImg = new Image();
                                MedicationImg.src = 'img/diastolic.svg';

                                let ProcedureImg = new Image();
                                ProcedureImg.src = 'img/Pulse.svg';

                                let MedicationArray = [];
                                angular.forEach($scope.PatientIOPGraphData, function (item) {
                                    if (item.PrescriptionDetails.length > 0) {
                                        let Date = item.AppointmentDate;
                                        let obj = {
                                            x: Date,
                                            y: 2,
                                        };
                                        MedicationArray.push(obj);
                                    }
                                });

                                let OPProceduresArray = [];
                                angular.forEach($scope.PatientIOPGraphData, function (item) {
                                    if (item.OPProceduresArray.length > 0) {
                                        let Date = item.AppointmentDate;
                                        let obj = {
                                            x: Date,
                                            y: 5,
                                        };
                                        OPProceduresArray.push(obj);
                                    }
                                });

                                if (IOPODValuesArray.length == 0 && IOPOSValuesArray.length == 0 && IOPCCODValuesArray.length == 0 && IOPCCOSValuesArray.length == 0 && TargetIOPODArray.length == 0 && TargetIOPOSArray.length == 0 && MedicationArray.length == 0 && OPProceduresArray.length == 0) {
                                    $scope.PastVisitGraphObj.IsIOPGraphArrayEmpty = true;
                                    $scope.SubTab = 3;
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
                                            data: IOPODValuesArray,
                                            spanGaps: true,
                                        },
                                        {
                                            type: 'scatter',
                                            label: 'CC OD',
                                            backgroundColor: 'rgb(245, 66, 120)',
                                            borderColor: 'rgb(245, 66, 120)',
                                            showLine: true,
                                            data: IOPCCODValuesArray,
                                            spanGaps: true,
                                        },
                                        {
                                            type: 'scatter',
                                            label: 'OS',
                                            backgroundColor: 'rgb(17, 66, 245)',
                                            borderColor: 'rgb(17, 66, 245)',
                                            showLine: true,
                                            data: IOPOSValuesArray,
                                            spanGaps: true,
                                        },
                                        {
                                            type: 'scatter',
                                            label: 'CC OS',
                                            backgroundColor: 'rgb(66, 179, 245)',
                                            borderColor: 'rgb(66, 179, 245)',
                                            showLine: true,
                                            data: IOPCCOSValuesArray,
                                            spanGaps: true,
                                        },
                                        {
                                            type: 'scatter',
                                            label: 'Medication Order',
                                            borderColor: '#34eb5e',
                                            backgroundColor: '#34eb5e',
                                            data: MedicationArray,
                                            pointStyle: MedicationImg,
                                            showLine: false,
                                        },
                                        {
                                            type: 'scatter',
                                            label: 'Procedures',
                                            borderColor: '#d934eb',
                                            backgroundColor: '#d934eb',
                                            data: OPProceduresArray,
                                            pointStyle: ProcedureImg,
                                            showLine: false,
                                        },
                                        {
                                            type: 'scatter',
                                            label: 'Target OD',
                                            backgroundColor: '#eb3434',
                                            borderColor: '#eb3434',
                                            data: TargetIOPODArray,
                                            borderDash: [5, 5],
                                            stepped: true,
                                            showLine: true,
                                        },
                                        {
                                            type: 'scatter',
                                            label: 'Target OS',
                                            backgroundColor: '#42aaf5',
                                            borderColor: '#42aaf5',
                                            data: TargetIOPOSArray,
                                            borderDash: [5, 5],
                                            stepped: true,
                                            showLine: true,
                                        }
                                    ],
                                }
                                $scope.GraphOBJ = data1 || {};

                                if ($scope.PastVisitGraphObj.ShowCCIOP == false) {

                                    var Data3 = {
                                        'datasets': [],
                                        'labels': $scope.GraphOBJ.labels || []
                                    };

                                    Data3.datasets = $filter("filter")($scope.GraphOBJ.datasets, function (item) {
                                        return item.label === "OD" || item.label === "OS" || item.label === "Medication Order" || item.label === "Procedures" || item.label === "Target OD" || item.label === "Target OS";
                                    });

                                    let len = $("canvas#myChart").length;
                                    if (len > 0) {
                                        $("canvas#myChart").remove();
                                        $("div.IOPGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                                    } else if (len === 0) {
                                        $("div.IOPGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                                    }

                                    const myChart = new Chart('myChart', {
                                        type: 'scatter',
                                        data: Data3,
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
                                                        title: function () { return ''; },

                                                        beforeFooter: (tooltipItems) => {
                                                            var MedicationStr = [];
                                                            $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                            tooltipItems.forEach(function (tooltipItem) {
                                                                angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                    if (item.PrescriptionDetails.length > 0) {
                                                                        var i = 0;
                                                                        var List = 0;
                                                                        angular.forEach(item.PrescriptionDetails, function (mitem) {
                                                                            mitem.MedicationName = '';
                                                                            if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                                mitem.MedicationName += mitem.DrugBrandName + mitem.Dose + mitem.DoseUnit + mitem.Route;
                                                                                mitem.StopDate = mitem.StopDate || null;
                                                                                if (mitem.StopDate !== null) {
                                                                                    mitem.StopDate = $filter('date')(mitem.StopDate, "MM-dd-yyyy");
                                                                                    mitem.MedicationName += '-' + 'DisContinue';
                                                                                }
                                                                                List = $filter("filter")(MedicationStr, function (FAitem) { return FAitem == mitem.MedicationName },);
                                                                                if (List.length > 0) {
                                                                                    i++;
                                                                                }
                                                                                if (i == 0) {
                                                                                    MedicationStr.push(mitem.MedicationName);
                                                                                }
                                                                            }
                                                                        });
                                                                    }

                                                                });
                                                            });
                                                            if (MedicationStr.length > 0) {
                                                                return 'MEDICATION ORDER: ' + MedicationStr;
                                                            }
                                                        },

                                                        footer: (tooltipItems) => {
                                                            var OPProceduresStr = [];
                                                            $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                            tooltipItems.forEach(function (tooltipItem) {
                                                                angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                    if (item.OPProceduresArray.length > 0) {
                                                                        angular.forEach(item.OPProceduresArray, function (mitem) {
                                                                            var i = 0;
                                                                            var List = 0;
                                                                            mitem.OPProcedure = '';
                                                                            if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                                var Organ = mitem.OrganId == 1 ? 'OD' : mitem.OrganId == 2 ? 'OS' : mitem.OrganId == 3 ? 'OU' : '';
                                                                                mitem.OPProcedure += mitem.ProcedureName + "-" + Organ + '\n';
                                                                                List = $filter("filter")(OPProceduresStr, function (FAitem) { return FAitem == mitem.ProcedureName },);
                                                                                if (List.length > 0) {
                                                                                    i++;
                                                                                }
                                                                                if (i == 0) {
                                                                                    OPProceduresStr.push(mitem.OPProcedure);
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            });
                                                            if (OPProceduresStr.length > 0) {
                                                                return 'PROCEDURES: ' + OPProceduresStr;
                                                            }
                                                        },

                                                    }
                                                },
                                            }
                                        }

                                    });
                                }

                                $scope.SubTab = 3;
                            }
                        };

                        $scope.ChangeIOPValues = function (Dataset) {
                            Dataset = Dataset || false;
                            $scope.GraphOBJ = $scope.GraphOBJ || {};
                            if (Dataset == true) {
                                var Data2 = {
                                    'datasets': [],
                                    'labels': $scope.GraphOBJ.labels || []
                                };

                                Data2.datasets = $filter("filter")($scope.GraphOBJ.datasets, function (item) {
                                    return item.label === "CC OD" || item.label === "CC OS" || item.label === "Medication Order" || item.label === "Procedures" || item.label === "Target OD" || item.label === "Target OS";
                                });

                                let len = $("canvas#myChart").length;
                                if (len > 0) {
                                    $("canvas#myChart").remove();
                                    $("div.IOPGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                                } else if (len === 0) {
                                    $("div.IOPGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                                }

                                const myChart = new Chart('myChart', {
                                    type: 'scatter',
                                    data: Data2,
                                    options: {
                                        scales: {
                                            x: { // add extra axes
                                                position: 'bottom',
                                                type: 'category'
                                            },
                                            y: {
                                                type: 'linear', // Use linear scale for the y-axis
                                                position: 'left'
                                            },
                                        },
                                        plugins: {
                                            tooltip: {
                                                callbacks: {
                                                    beforeFooter: (tooltipItems) => {
                                                        var MedicationStr = [];
                                                        $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                        tooltipItems.forEach(function (tooltipItem) {
                                                            /*Medication = tooltipItem.parsed.y;*/
                                                            angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                if (item.PrescriptionDetails.length > 0) {
                                                                    var i = 0;
                                                                    var List = 0;
                                                                    angular.forEach(item.PrescriptionDetails, function (mitem) {
                                                                        mitem.MedicationName = '';
                                                                        if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                            mitem.MedicationName += mitem.DrugBrandName + mitem.Dose + mitem.DoseUnit + mitem.Route;
                                                                            mitem.StopDate = mitem.StopDate || null;
                                                                            if (mitem.StopDate !== null) {
                                                                                mitem.StopDate = $filter('date')(mitem.StopDate, "MM-dd-yyyy");
                                                                                mitem.MedicationName += '-' + 'DisContinue';
                                                                            }
                                                                            List = $filter("filter")(MedicationStr, function (FAitem) { return FAitem == mitem.MedicationName },);
                                                                            if (List.length > 0) {
                                                                                i++;
                                                                            }
                                                                            if (i == 0) {
                                                                                MedicationStr.push(mitem.MedicationName);
                                                                            }
                                                                        }
                                                                    });
                                                                }

                                                            });
                                                        });
                                                        if (MedicationStr.length > 0) {
                                                            return 'MEDICATION ORDER: ' + MedicationStr;
                                                        }
                                                    },

                                                    footer: (tooltipItems) => {
                                                        var OPProceduresStr = [];
                                                        $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                        tooltipItems.forEach(function (tooltipItem) {
                                                            angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                if (item.OPProceduresArray.length > 0) {
                                                                    angular.forEach(item.OPProceduresArray, function (mitem) {
                                                                        var i = 0;
                                                                        var List = 0;
                                                                        mitem.OPProcedure = '';
                                                                        if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                            var Organ = mitem.OrganId == 1 ? 'OD' : mitem.OrganId == 2 ? 'OS' : mitem.OrganId == 3 ? 'OU' : '';
                                                                            mitem.OPProcedure += mitem.ProcedureName + "-" + Organ + '\n';
                                                                            List = $filter("filter")(OPProceduresStr, function (FAitem) { return FAitem == mitem.ProcedureName },);
                                                                            if (List.length > 0) {
                                                                                i++;
                                                                            }
                                                                            if (i == 0) {
                                                                                OPProceduresStr.push(mitem.OPProcedure);
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        });
                                                        if (OPProceduresStr.length > 0) {
                                                            return 'PROCEDURES: ' + OPProceduresStr;
                                                        }
                                                    }

                                                }
                                            },
                                        }
                                    }

                                });

                            } else {
                                var Data2 = {
                                    'datasets': [],
                                    'labels': $scope.GraphOBJ.labels || []
                                };

                                Data2.datasets = $filter("filter")($scope.GraphOBJ.datasets, function (item) {
                                    return item.label === "OD" || item.label === "OS" || item.label === "Medication Order" || item.label === "Procedures" || item.label === "Target OD" || item.label === "Target OS";
                                });

                                let len = $("canvas#myChart").length;
                                if (len > 0) {
                                    $("canvas#myChart").remove();
                                    $("div.IOPGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                                } else if (len === 0) {
                                    $("div.IOPGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                                }

                                const myChart = new Chart('myChart', {
                                    type: 'scatter',
                                    data: Data2,
                                    options: {
                                        scales: {
                                            x: { // add extra axes
                                                position: 'bottom',
                                                type: 'category'
                                            },
                                            y: {
                                                type: 'linear', // Use linear scale for the y-axis
                                                position: 'left'
                                            },
                                        },
                                        plugins: {
                                            tooltip: {
                                                callbacks: {
                                                    beforeFooter: (tooltipItems) => {
                                                        var MedicationStr = [];
                                                        $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                        tooltipItems.forEach(function (tooltipItem) {
                                                            angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                if (item.PrescriptionDetails.length > 0) {
                                                                    var i = 0;
                                                                    var List = 0;
                                                                    angular.forEach(item.PrescriptionDetails, function (mitem) {
                                                                        mitem.MedicationName = '';
                                                                        if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                            mitem.MedicationName += mitem.DrugBrandName + mitem.Dose + mitem.DoseUnit + mitem.Route;
                                                                            mitem.StopDate = mitem.StopDate || null;
                                                                            if (mitem.StopDate !== null) {
                                                                                mitem.StopDate = $filter('date')(mitem.StopDate, "MM-dd-yyyy");
                                                                                mitem.MedicationName += '-' + 'DisContinue';
                                                                            }
                                                                            List = $filter("filter")(MedicationStr, function (FAitem) { return FAitem == mitem.MedicationName },);
                                                                            if (List.length > 0) {
                                                                                i++;
                                                                            }
                                                                            if (i == 0) {
                                                                                MedicationStr.push(mitem.MedicationName);
                                                                            }
                                                                        }
                                                                    });
                                                                }

                                                            });
                                                        });
                                                        if (MedicationStr.length > 0) {
                                                            return 'MEDICATION ORDER: ' + MedicationStr;
                                                        }
                                                    },

                                                    footer: (tooltipItems) => {
                                                        var OPProceduresStr = [];
                                                        $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                        tooltipItems.forEach(function (tooltipItem) {
                                                            angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                if (item.OPProceduresArray.length > 0) {
                                                                    angular.forEach(item.OPProceduresArray, function (mitem) {
                                                                        var i = 0;
                                                                        var List = 0;
                                                                        mitem.OPProcedure = '';
                                                                        if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                            var Organ = mitem.OrganId == 1 ? 'OD' : mitem.OrganId == 2 ? 'OS' : mitem.OrganId == 3 ? 'OU' : '';
                                                                            mitem.OPProcedure += mitem.ProcedureName + "-" + Organ + '\n';
                                                                            List = $filter("filter")(OPProceduresStr, function (FAitem) { return FAitem == mitem.ProcedureName },);
                                                                            if (List.length > 0) {
                                                                                i++;
                                                                            }
                                                                            if (i == 0) {
                                                                                OPProceduresStr.push(mitem.OPProcedure);
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        });
                                                        if (OPProceduresStr.length > 0) {
                                                            return 'PROCEDURES: ' + OPProceduresStr;
                                                        }
                                                    }

                                                }
                                            },
                                        }
                                    }

                                });
                            }

                        };

                        $scope.GraphRefractionsubTabclick = function (type) {
                            if (type == 'Refraction' && $scope.PatientGraphsData.length > 0) {
                                $scope.PatientRefractionGraphData = $scope.PatientGraphsData || [];

                                const labels1 = [];

                                let ManiFestRefractionODArray = [];
                                angular.forEach($scope.PatientRefractionGraphData, function (item) {
                                    var Date = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                                    if (item.ManifestRefractionArray.length > 0) {
                                        angular.forEach(item.ManifestRefractionArray, function (MRitem) {
                                            MRitem.RSpherical = MRitem.RSpherical || '';
                                            MRitem.RCylindrical = MRitem.RCylindrical || '';

                                            var RtCylindrical = 0;
                                            if (MRitem.RCylindrical !== '') {
                                                RtCylindrical = parseFloat(MRitem.RCylindrical) || 0;
                                                RtCylindrical = RtCylindrical / 2;
                                            }

                                            var RtSpherical = 0;
                                            if (MRitem.RSpherical !== '') {
                                                RtSpherical = parseFloat(MRitem.RSpherical) || 0;
                                            }

                                            MRitem.FinalODMRValue = MRitem.FinalODMRValue || null;
                                            MRitem.FinalODMRValue = RtSpherical + RtCylindrical || null;

                                            let obj = {
                                                x: Date,
                                                y: (MRitem.FinalODMRValue != '') ? MRitem.FinalODMRValue : null
                                            };
                                            ManiFestRefractionODArray.unshift(obj);
                                            labels1.unshift(Date);
                                        });
                                    }
                                    else {
                                        let obj = {
                                            x: Date,
                                            y: null
                                        };
                                        ManiFestRefractionODArray.unshift(obj);
                                        labels1.unshift(Date);
                                    }
                                });

                                let ManiFestRefractionOSArray = [];
                                angular.forEach($scope.PatientRefractionGraphData, function (item) {
                                    var Date = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                                    if (item.ManifestRefractionArray.length > 0) {
                                        angular.forEach(item.ManifestRefractionArray, function (MRitem) {
                                            MRitem.LSpherical = MRitem.LSpherical || '';
                                            MRitem.LCylindrical = MRitem.LCylindrical || '';

                                            var LtCylindrical = 0;
                                            if (MRitem.LCylindrical !== '') {
                                                LtCylindrical = parseFloat(MRitem.LCylindrical) || 0;
                                                LtCylindrical = LtCylindrical / 2;
                                            }

                                            var LtSpherical = 0;
                                            if (MRitem.LSpherical !== '') {
                                                LtSpherical = parseFloat(MRitem.LSpherical) || 0;
                                            }

                                            MRitem.FinalOSMRValue = MRitem.FinalOSMRValue || null;
                                            MRitem.FinalOSMRValue = LtSpherical + LtCylindrical || null;

                                            let obj = {
                                                x: Date,
                                                y: (MRitem.FinalOSMRValue != '') ? MRitem.FinalOSMRValue : null
                                            };
                                            ManiFestRefractionOSArray.unshift(obj);
                                        });
                                    }
                                    else {
                                        let obj = {
                                            x: Date,
                                            y: null
                                        };
                                        ManiFestRefractionOSArray.unshift(obj);
                                    }
                                });

                                if (ManiFestRefractionODArray.length > 0) {
                                    var MRODTempArray = [];
                                    angular.forEach(ManiFestRefractionODArray, function (ODitem) {
                                        if (ODitem.y !== null) {
                                            MRODTempArray.push(ODitem);
                                        }
                                    });
                                }
                                if (ManiFestRefractionOSArray.length > 0) {
                                    var MROSTempArray = [];
                                    angular.forEach(ManiFestRefractionOSArray, function (ODitem) {
                                        if (ODitem.y !== null) {
                                            MROSTempArray.push(ODitem);
                                        }
                                    });
                                }

                                if (MRODTempArray.length == 0 && MROSTempArray.length == 0) {
                                    $scope.PastVisitGraphObj.IsRefractionGraphArrayEmpty = true;
                                    $scope.SubTab = 4;
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
                                            spanGaps: true,
                                            data: ManiFestRefractionODArray
                                        },
                                        {
                                            type: 'scatter',
                                            label: 'OS',
                                            backgroundColor: '#5742f5',
                                            borderColor: '#5742f5',
                                            showLine: true,
                                            spanGaps: true,
                                            data: ManiFestRefractionOSArray
                                        }
                                    ]
                                }

                                let len = $("canvas#myChart").length;
                                if (len > 0) {
                                    $("canvas#myChart").remove();
                                    $("div.PastVisitsMRGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                                } else if (len === 0) {
                                    $("div.PastVisitsMRGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
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

                                $scope.SubTab = 4;
                            }
                        };

                        $scope.GraphCDRsubTabclick = function (type) {
                            if (type == 'CDR' && $scope.PatientGraphsData.length > 0) {
                                $scope.PatientCDRGraphData = $scope.PatientGraphsData || [];

                                const labels1 = [];
                                angular.forEach($scope.PatientCDRGraphData, function (item, index) {

                                    item.PosteriorSegmentDetails = $filter("filter")(item.PosteriorSegmentDetails, function (sitem, index) { return sitem.RVertical !== "" || sitem.LVertical !== "" }) || [];

                                    item.AppointmentDate = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                                    labels1.unshift(item.AppointmentDate);
                                });

                                let CDRODArray = [];
                                angular.forEach($scope.PatientCDRGraphData, function (item) {
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
                                angular.forEach($scope.PatientCDRGraphData, function (item) {
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
                                    $scope.PastVisitGraphObj.IsCDRGraphArrayEmpty = true;
                                    $scope.SubTab = 5;
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
                                    $("div.PastVisitCDRGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
                                } else if (len === 0) {
                                    $("div.PastVisitCDRGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
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

                                $scope.SubTab = 5;
                            }
                        };

                        $scope.ShowAllGraphs = function (type) {

                            if (type == 'All') {

                                $scope.PatientVAGraphData = $scope.PatientGraphsData || [];
                                if ($scope.PatientVAGraphData.length > 0) {
                                    const labels1 = [];
                                    angular.forEach($scope.PatientVAGraphData, function (item, index) {
                                        item.AppointmentDate = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                                        labels1.unshift(item.AppointmentDate);
                                    });

                                    let VisualAcuityODArray = [];
                                    angular.forEach($scope.PatientVAGraphData, function (item) {

                                        if (item.VisionDetails.length > 0) {
                                            angular.forEach(item.VisionDetails, function (Vitem) {
                                                if (Vitem.RightEyeValues.Distance !== '' && Vitem.InvestigationId == 4) {
                                                    var fractionParts = Vitem.RightEyeValues.Distance.split('/');
                                                    var numerator = fractionParts[0];
                                                    var FinalODDenominator = fractionParts[1];

                                                    if (fractionParts[1] !== undefined) {
                                                        var denominator1 = fractionParts[1].split('+');
                                                        if (denominator1[1] !== undefined) {
                                                            var denominatorA = denominator1[0];
                                                            var denominatorB = denominator1[1];
                                                            denominatorA = parseInt(denominatorA) || 0;
                                                            denominatorB = parseInt(denominatorB) || 0;
                                                            FinalODDenominator = denominatorA + denominatorB;
                                                        }

                                                        var denominator2 = fractionParts[1].split('-');
                                                        if (denominator2[1] !== undefined) {
                                                            var denominatorA = denominator2[0];
                                                            var denominatorB = denominator2[1];
                                                            denominatorA = parseInt(denominatorA) || 0;
                                                            denominatorB = parseInt(denominatorB) || 0;
                                                            FinalODDenominator = denominatorA - denominatorB;
                                                        }
                                                    }

                                                    let Date = item.AppointmentDate;
                                                    let obj = {
                                                        x: Date,
                                                        y: (FinalODDenominator != '') ? FinalODDenominator : null
                                                    };
                                                    VisualAcuityODArray.push(obj);
                                                }
                                            });

                                        }
                                    });

                                    let VisualAcuityOSArray = [];
                                    angular.forEach($scope.PatientVAGraphData, function (item) {
                                        if (item.VisionDetails.length > 0) {
                                            angular.forEach(item.VisionDetails, function (Vitem) {
                                                if (Vitem.LeftEyeValues.Distance !== '' && Vitem.InvestigationId == 4) {
                                                    var fractionParts = Vitem.LeftEyeValues.Distance.split('/');
                                                    var numerator = fractionParts[0];
                                                    var FinalOSDenominator = fractionParts[1];

                                                    if (fractionParts[1] !== undefined) {
                                                        var denominator1 = fractionParts[1].split('+');
                                                        if (denominator1[1] !== undefined) {
                                                            var denominatorA = denominator1[0];
                                                            var denominatorB = denominator1[1];
                                                            denominatorA = parseInt(denominatorA) || 0;
                                                            denominatorB = parseInt(denominatorB) || 0;
                                                            FinalOSDenominator = denominatorA + denominatorB;
                                                        }

                                                        var denominator2 = fractionParts[1].split('-');
                                                        if (denominator2[1] !== undefined) {
                                                            var denominatorA = denominator2[0];
                                                            var denominatorB = denominator2[1];
                                                            denominatorA = parseInt(denominatorA) || 0;
                                                            denominatorB = parseInt(denominatorB) || 0;
                                                            FinalOSDenominator = denominatorA - denominatorB;
                                                        }
                                                    }

                                                    let Date = item.AppointmentDate;
                                                    let obj = {
                                                        x: Date,
                                                        y: (FinalOSDenominator != '') ? FinalOSDenominator : null
                                                    };
                                                    VisualAcuityOSArray.push(obj);
                                                }
                                            });

                                        }
                                    });

                                    let VisualAcuityCCODArray = [];
                                    angular.forEach($scope.PatientVAGraphData, function (item) {
                                        if (item.VisionDetails.length > 0) {
                                            angular.forEach(item.VisionDetails, function (Vitem) {
                                                if (Vitem.RightEyeValues.Distance !== '' && Vitem.InvestigationId == 5) {
                                                    var fractionParts = Vitem.RightEyeValues.Distance.split('/');
                                                    var numerator = fractionParts[0];
                                                    var FinalCCODdenominator = fractionParts[1];

                                                    if (fractionParts[1] !== undefined) {
                                                        var denominator1 = fractionParts[1].split('+');
                                                        if (denominator1[1] !== undefined) {
                                                            var denominatorA = denominator1[0];
                                                            var denominatorB = denominator1[1];
                                                            denominatorA = parseInt(denominatorA) || 0;
                                                            denominatorB = parseInt(denominatorB) || 0;
                                                            FinalCCODdenominator = denominatorA + denominatorB;
                                                        }

                                                        var denominator2 = fractionParts[1].split('-');
                                                        if (denominator2[1] !== undefined) {
                                                            var denominatorA = denominator2[0];
                                                            var denominatorB = denominator2[1];
                                                            denominatorA = parseInt(denominatorA) || 0;
                                                            denominatorB = parseInt(denominatorB) || 0;
                                                            FinalCCODdenominator = denominatorA - denominatorB;
                                                        }
                                                    }

                                                    let Date = item.AppointmentDate;
                                                    let obj = {
                                                        x: Date,
                                                        y: (FinalCCODdenominator != '') ? FinalCCODdenominator : null
                                                    };
                                                    VisualAcuityCCODArray.push(obj);
                                                }
                                            });
                                        }
                                    });

                                    let VisualAcuityCCOSArray = [];
                                    angular.forEach($scope.PatientVAGraphData, function (item) {
                                        if (item.VisionDetails.length > 0) {
                                            angular.forEach(item.VisionDetails, function (Vitem) {
                                                if (Vitem.LeftEyeValues.Distance !== '' && Vitem.InvestigationId == 5) {
                                                    var fractionParts = Vitem.LeftEyeValues.Distance.split('/');
                                                    var numerator = fractionParts[0];
                                                    var FinalCCOSdenominator = fractionParts[1];

                                                    if (fractionParts[1] !== undefined) {
                                                        var denominator1 = fractionParts[1].split('+');
                                                        if (denominator1[1] !== undefined) {
                                                            var denominatorA = denominator1[0];
                                                            var denominatorB = denominator1[1];
                                                            denominatorA = parseInt(denominatorA) || 0;
                                                            denominatorB = parseInt(denominatorB) || 0;
                                                            FinalCCOSdenominator = denominatorA + denominatorB;
                                                        }

                                                        var denominator2 = fractionParts[1].split('-');
                                                        if (denominator2[1] !== undefined) {
                                                            var denominatorA = denominator2[0];
                                                            var denominatorB = denominator2[1];
                                                            denominatorA = parseInt(denominatorA) || 0;
                                                            denominatorB = parseInt(denominatorB) || 0;
                                                            FinalCCOSdenominator = denominatorA - denominatorB;
                                                        }
                                                    }

                                                    let Date = item.AppointmentDate;
                                                    let obj = {
                                                        x: Date,
                                                        y: (FinalCCOSdenominator != '') ? FinalCCOSdenominator : null
                                                    };
                                                    VisualAcuityCCOSArray.push(obj);
                                                }
                                            });
                                        }

                                    });

                                    if (VisualAcuityODArray.length == 0 && VisualAcuityOSArray.length == 0 && VisualAcuityCCODArray.length == 0 && VisualAcuityCCOSArray.length == 0) {
                                        $scope.PastVisitGraphObj.IsVAGraphArrayEmpty = true;
                                    }

                                    const data1 = {
                                        labels: labels1,
                                        datasets: [
                                            {
                                                type: 'scatter',
                                                label: 'SC OD',
                                                backgroundColor: 'rgb(255, 0, 0)',
                                                borderColor: 'rgb(255, 0, 0)',
                                                showLine: true,
                                                data: VisualAcuityODArray,
                                                spanGaps: true,
                                            },
                                            {
                                                type: 'scatter',
                                                label: 'CC OD',
                                                backgroundColor: 'rgb(245, 66, 120)',
                                                borderColor: 'rgb(245, 66, 120)',
                                                showLine: true,
                                                data: VisualAcuityCCODArray,
                                                spanGaps: true,
                                            },
                                            {
                                                type: 'scatter',
                                                label: 'SC OS',
                                                backgroundColor: '#5742f5',
                                                borderColor: '#5742f5',
                                                showLine: true,
                                                data: VisualAcuityOSArray,
                                                spanGaps: true,
                                            },
                                            {
                                                type: 'scatter',
                                                label: 'CC OS',
                                                backgroundColor: '#42e3f5',
                                                borderColor: '#42e3f5',
                                                showLine: true,
                                                data: VisualAcuityCCOSArray,
                                                spanGaps: true,
                                            }
                                        ]
                                    }

                                    let len = $("canvas#PastVisitVA").length;
                                    if (len > 0) {
                                        $("canvas#PastVisitVA").remove();
                                        $("div.AllPastVisitVAGraphLines").append('<canvas id="PastVisitVA" width="1860" height="800"></canvas>');
                                    } else if (len === 0) {
                                        $("div.AllPastVisitVAGraphLines").append('<canvas id="PastVisitVA" width="1860" height="800"></canvas>');
                                    }

                                    const PastVisitVA = new Chart('PastVisitVA', {
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

                                $scope.PatientIOPGraphData = $scope.PatientGraphsData || [];
                                if ($scope.PatientIOPGraphData.length > 0) {
                                    const labels1 = [];
                                    angular.forEach($scope.PatientIOPGraphData, function (item, index) {
                                        item.AppointmentDate = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                                        labels1.unshift(item.AppointmentDate);
                                    });

                                    let IOPODValuesArray = [];
                                    angular.forEach($scope.PatientIOPGraphData, function (item) {
                                        if (item.Tonometry.length > 0) {
                                            let lastObject = item.Tonometry[item.Tonometry.length - 1];
                                            if (lastObject.BeforeDilationRightEye != '') {
                                                var IOPODValuesYaxisvalue = lastObject.BeforeDilationRightEye;
                                            } else {
                                                var IOPODValuesYaxisvalue = lastObject.AfterDilationRightEye;
                                            }

                                            let Date = item.AppointmentDate;
                                            let obj = {
                                                x: Date,
                                                y: (IOPODValuesYaxisvalue != '') ? IOPODValuesYaxisvalue : null
                                            };
                                            IOPODValuesArray.push(obj);
                                        }
                                    });

                                    let IOPOSValuesArray = [];
                                    angular.forEach($scope.PatientIOPGraphData, function (item) {
                                        var todaydate = $filter('date')(new Date(), "MM-dd-yyyy") || "";
                                        if (item.Tonometry.length > 0) {
                                            let lastObject = item.Tonometry[item.Tonometry.length - 1];

                                            if (lastObject.BeforeDilationLeftEye != '') {
                                                var IOPOSValuesYaxisvalue = lastObject.BeforeDilationLeftEye;
                                            } else {
                                                var IOPOSValuesYaxisvalue = lastObject.AfterDilationLeftEye;
                                            }

                                            let Date = item.AppointmentDate;
                                            let obj = {
                                                x: Date,
                                                y: (IOPOSValuesYaxisvalue != '') ? IOPOSValuesYaxisvalue : null
                                            };
                                            IOPOSValuesArray.push(obj);
                                        }
                                    });

                                    let IOPCCODValuesArray = [];
                                    angular.forEach($scope.PatientIOPGraphData, function (item) {
                                        var todaydate = $filter('date')(new Date(), "MM-dd-yyyy") || "";
                                        if (item.Tonometry.length > 0) {
                                            let lastObject = item.Tonometry[item.Tonometry.length - 1];

                                            let Date = item.AppointmentDate;
                                            let obj = {
                                                x: Date,
                                                y: (lastObject.BeforeDilationODCC != '') ? lastObject.BeforeDilationODCC : null
                                            };
                                            IOPCCODValuesArray.push(obj);
                                        }
                                    });

                                    let IOPCCOSValuesArray = [];
                                    angular.forEach($scope.PatientIOPGraphData, function (item) {
                                        var todaydate = $filter('date')(new Date(), "MM-dd-yyyy") || "";
                                        if (item.Tonometry.length > 0) {
                                            let lastObject = item.Tonometry[item.Tonometry.length - 1];

                                            let Date = item.AppointmentDate;
                                            let obj = {
                                                x: Date,
                                                y: (lastObject.BeforeDilationOSCC != '') ? lastObject.BeforeDilationOSCC : null
                                            };
                                            IOPCCOSValuesArray.push(obj);
                                        }
                                    });

                                    let TargetIOPODArray = [];
                                    angular.forEach($scope.PatientIOPGraphData, function (item) {
                                        if (item.IOPValues.length > 0) {
                                            item.IOPValues[0].TargetIOPODValue = item.IOPValues[0].TargetIOPODValue || null;
                                            if (item.IOPValues[0].TargetIOPODValue !== null) {
                                                let Date = item.AppointmentDate;
                                                let obj = {
                                                    x: Date,
                                                    y: (item.IOPValues[0].TargetIOPODValue != '') ? item.IOPValues[0].TargetIOPODValue : null
                                                };
                                                TargetIOPODArray.push(obj);
                                            }
                                        }
                                    });

                                    let TargetIOPOSArray = [];
                                    angular.forEach($scope.PatientIOPGraphData, function (item) {
                                        if (item.IOPValues.length > 0) {
                                            item.IOPValues[0].TargetIOPOSValue = item.IOPValues[0].TargetIOPOSValue || null;
                                            if (item.IOPValues[0].TargetIOPOSValue !== null) {
                                                let Date = item.AppointmentDate;
                                                let obj = {
                                                    x: Date,
                                                    y: (item.IOPValues[0].TargetIOPOSValue != '') ? item.IOPValues[0].TargetIOPOSValue : null
                                                };
                                                TargetIOPOSArray.push(obj);
                                            }
                                        }
                                    });

                                    let MedicationImg = new Image();
                                    MedicationImg.src = 'img/diastolic.svg';

                                    let ProcedureImg = new Image();
                                    ProcedureImg.src = 'img/Pulse.svg';

                                    let MedicationArray = [];
                                    angular.forEach($scope.PatientIOPGraphData, function (item) {
                                        if (item.PrescriptionDetails.length > 0) {
                                            let Date = item.AppointmentDate;
                                            let obj = {
                                                x: Date,
                                                y: 2,
                                            };
                                            MedicationArray.push(obj);
                                        }
                                    });

                                    let OPProceduresArray = [];
                                    angular.forEach($scope.PatientIOPGraphData, function (item) {
                                        if (item.OPProceduresArray.length > 0) {
                                            let Date = item.AppointmentDate;
                                            let obj = {
                                                x: Date,
                                                y: 5,
                                            };
                                            OPProceduresArray.push(obj);
                                        }
                                    });

                                    if (IOPODValuesArray.length == 0 && IOPOSValuesArray.length == 0 && IOPCCODValuesArray.length == 0 && IOPCCOSValuesArray.length == 0 && TargetIOPODArray.length == 0 && TargetIOPOSArray.length == 0 && MedicationArray.length == 0 && OPProceduresArray.length == 0) {
                                        $scope.PastVisitGraphObj.IsIOPGraphArrayEmpty = true;
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
                                                data: IOPODValuesArray,
                                                spanGaps: true,
                                            },
                                            {
                                                type: 'scatter',
                                                label: 'CC OD',
                                                backgroundColor: 'rgb(245, 66, 120)',
                                                borderColor: 'rgb(245, 66, 120)',
                                                showLine: true,
                                                data: IOPCCODValuesArray,
                                                spanGaps: true,
                                            },
                                            {
                                                type: 'scatter',
                                                label: 'OS',
                                                backgroundColor: 'rgb(17, 66, 245)',
                                                borderColor: 'rgb(17, 66, 245)',
                                                showLine: true,
                                                data: IOPOSValuesArray,
                                                spanGaps: true,
                                            },
                                            {
                                                type: 'scatter',
                                                label: 'CC OS',
                                                backgroundColor: 'rgb(66, 179, 245)',
                                                borderColor: 'rgb(66, 179, 245)',
                                                showLine: true,
                                                data: IOPCCOSValuesArray,
                                                spanGaps: true,
                                            },
                                            {
                                                type: 'scatter',
                                                label: 'Medication Order',
                                                borderColor: '#34eb5e',
                                                backgroundColor: '#34eb5e',
                                                data: MedicationArray,
                                                pointStyle: MedicationImg,
                                                showLine: false,
                                            },
                                            {
                                                type: 'scatter',
                                                label: 'Procedures',
                                                borderColor: '#d934eb',
                                                backgroundColor: '#d934eb',
                                                data: OPProceduresArray,
                                                pointStyle: ProcedureImg,
                                                showLine: false,
                                            },
                                            {
                                                type: 'scatter',
                                                label: 'Target OD',
                                                backgroundColor: '#eb3434',
                                                borderColor: '#eb3434',
                                                data: TargetIOPODArray,
                                                borderDash: [5, 5],
                                                stepped: true,
                                                showLine: true,
                                            },
                                            {
                                                type: 'scatter',
                                                label: 'Target OS',
                                                backgroundColor: '#42aaf5',
                                                borderColor: '#42aaf5',
                                                data: TargetIOPOSArray,
                                                borderDash: [5, 5],
                                                stepped: true,
                                                showLine: true,
                                            }
                                        ],
                                    }
                                    $scope.ALLGraphOBJ = data1 || {};

                                    if (!$scope.PastVisitGraphObj.ALLShowCCIOP) {

                                        var Data3 = {
                                            'datasets': [],
                                            'labels': $scope.ALLGraphOBJ.labels || []
                                        };

                                        Data3.datasets = $filter("filter")($scope.ALLGraphOBJ.datasets, function (item) {
                                            return item.label === "OD" || item.label === "OS" || item.label === "Medication Order" || item.label === "Procedures" || item.label === "Target OD" || item.label === "Target OS";
                                        });

                                        let len = $("canvas#ALLIOPGraphs").length;
                                        if (len > 0) {
                                            $("canvas#ALLIOPGraphs").remove();
                                            $("div.ALLIOPGraphLines").append('<canvas id="ALLIOPGraphs" width="1860" height="800"></canvas>');
                                        } else if (len === 0) {
                                            $("div.ALLIOPGraphLines").append('<canvas id="ALLIOPGraphs" width="1860" height="800"></canvas>');
                                        }

                                        const ALLIOPGraphs = new Chart('ALLIOPGraphs', {
                                            type: 'scatter',
                                            data: Data3,
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
                                                            title: function () { return ''; },

                                                            beforeFooter: (tooltipItems) => {
                                                                var MedicationStr = [];
                                                                $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                                tooltipItems.forEach(function (tooltipItem) {
                                                                    angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                        if (item.PrescriptionDetails.length > 0) {
                                                                            var i = 0;
                                                                            var List = 0;
                                                                            angular.forEach(item.PrescriptionDetails, function (mitem) {
                                                                                mitem.MedicationName = '';
                                                                                if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                                    mitem.MedicationName += mitem.DrugBrandName + mitem.Dose + mitem.DoseUnit + mitem.Route;
                                                                                    mitem.StopDate = mitem.StopDate || null;
                                                                                    if (mitem.StopDate !== null) {
                                                                                        mitem.StopDate = $filter('date')(mitem.StopDate, "MM-dd-yyyy");
                                                                                        mitem.MedicationName += '-' + 'DisContinue';
                                                                                    }
                                                                                    List = $filter("filter")(MedicationStr, function (FAitem) { return FAitem == mitem.MedicationName },);
                                                                                    if (List.length > 0) {
                                                                                        i++;
                                                                                    }
                                                                                    if (i == 0) {
                                                                                        MedicationStr.push(mitem.MedicationName);
                                                                                    }
                                                                                }
                                                                            });
                                                                        }

                                                                    });
                                                                });
                                                                if (MedicationStr.length > 0) {
                                                                    return 'MEDICATION ORDER: ' + MedicationStr;
                                                                }
                                                            },

                                                            footer: (tooltipItems) => {
                                                                var OPProceduresStr = [];
                                                                $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                                tooltipItems.forEach(function (tooltipItem) {
                                                                    angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                        if (item.OPProceduresArray.length > 0) {
                                                                            angular.forEach(item.OPProceduresArray, function (mitem) {
                                                                                var i = 0;
                                                                                var List = 0;
                                                                                mitem.OPProcedure = '';
                                                                                if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                                    var Organ = mitem.OrganId == 1 ? 'OD' : mitem.OrganId == 2 ? 'OS' : mitem.OrganId == 3 ? 'OU' : '';
                                                                                    mitem.OPProcedure += mitem.ProcedureName + "-" + Organ + '\n';
                                                                                    List = $filter("filter")(OPProceduresStr, function (FAitem) { return FAitem == mitem.ProcedureName },);
                                                                                    if (List.length > 0) {
                                                                                        i++;
                                                                                    }
                                                                                    if (i == 0) {
                                                                                        OPProceduresStr.push(mitem.OPProcedure);
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                });
                                                                if (OPProceduresStr.length > 0) {
                                                                    return 'PROCEDURES: ' + OPProceduresStr;
                                                                }
                                                            },

                                                        }
                                                    },
                                                }
                                            }

                                        });
                                    }
                                }

                                $scope.PatientRefractionGraphData = $scope.PatientGraphsData || [];
                                if ($scope.PatientRefractionGraphData.length > 0) {

                                    const labels1 = [];

                                    let ManiFestRefractionODArray = [];
                                    angular.forEach($scope.PatientRefractionGraphData, function (item) {
                                        var Date = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                                        if (item.ManifestRefractionArray.length > 0) {
                                            angular.forEach(item.ManifestRefractionArray, function (MRitem) {
                                                MRitem.RSpherical = MRitem.RSpherical || '';
                                                MRitem.RCylindrical = MRitem.RCylindrical || '';

                                                var RtCylindrical = 0;
                                                if (MRitem.RCylindrical !== '') {
                                                    RtCylindrical = parseFloat(MRitem.RCylindrical) || 0;
                                                    RtCylindrical = RtCylindrical / 2;
                                                }

                                                var RtSpherical = 0;
                                                if (MRitem.RSpherical !== '') {
                                                    RtSpherical = parseFloat(MRitem.RSpherical) || 0;
                                                }

                                                MRitem.FinalODMRValue = MRitem.FinalODMRValue || null;
                                                MRitem.FinalODMRValue = RtSpherical + RtCylindrical || null;

                                                let obj = {
                                                    x: Date,
                                                    y: (MRitem.FinalODMRValue != '') ? MRitem.FinalODMRValue : null
                                                };
                                                ManiFestRefractionODArray.unshift(obj);
                                                labels1.unshift(Date);
                                            });
                                        }
                                        else {
                                            let obj = {
                                                x: Date,
                                                y: null
                                            };
                                            ManiFestRefractionODArray.unshift(obj);
                                            labels1.unshift(Date);
                                        }
                                    });

                                    let ManiFestRefractionOSArray = [];
                                    angular.forEach($scope.PatientRefractionGraphData, function (item) {
                                        var Date = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                                        if (item.ManifestRefractionArray.length > 0) {
                                            angular.forEach(item.ManifestRefractionArray, function (MRitem) {
                                                MRitem.LSpherical = MRitem.LSpherical || '';
                                                MRitem.LCylindrical = MRitem.LCylindrical || '';

                                                var LtCylindrical = 0;
                                                if (MRitem.LCylindrical !== '') {
                                                    LtCylindrical = parseFloat(MRitem.LCylindrical) || 0;
                                                    LtCylindrical = LtCylindrical / 2;
                                                }

                                                var LtSpherical = 0;
                                                if (MRitem.LSpherical !== '') {
                                                    LtSpherical = parseFloat(MRitem.LSpherical) || 0;
                                                }

                                                MRitem.FinalOSMRValue = MRitem.FinalOSMRValue || null;
                                                MRitem.FinalOSMRValue = LtSpherical + LtCylindrical || null;

                                                let obj = {
                                                    x: Date,
                                                    y: (MRitem.FinalOSMRValue != '') ? MRitem.FinalOSMRValue : null
                                                };
                                                ManiFestRefractionOSArray.unshift(obj);
                                            });
                                        }
                                        else {
                                            let obj = {
                                                x: Date,
                                                y: null
                                            };
                                            ManiFestRefractionOSArray.unshift(obj);
                                        }
                                    });

                                    if (ManiFestRefractionODArray.length > 0) {
                                        var MRODTempArray = [];
                                        angular.forEach(ManiFestRefractionODArray, function (ODitem) {
                                            if (ODitem.y !== null) {
                                                MRODTempArray.push(ODitem);
                                            }
                                        });
                                    }
                                    if (ManiFestRefractionOSArray.length > 0) {
                                        var MROSTempArray = [];
                                        angular.forEach(ManiFestRefractionOSArray, function (ODitem) {
                                            if (ODitem.y !== null) {
                                                MROSTempArray.push(ODitem);
                                            }
                                        });
                                    }

                                    if (MRODTempArray.length == 0 && MROSTempArray.length == 0) {
                                        $scope.PastVisitGraphObj.IsRefractionGraphArrayEmpty = true;
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
                                                spanGaps: true,
                                                data: ManiFestRefractionODArray
                                            },
                                            {
                                                type: 'scatter',
                                                label: 'OS',
                                                backgroundColor: '#5742f5',
                                                borderColor: '#5742f5',
                                                showLine: true,
                                                spanGaps: true,
                                                data: ManiFestRefractionOSArray
                                            }
                                        ]
                                    }

                                    let len = $("canvas#ALLPastVisitsMRGraph").length;
                                    if (len > 0) {
                                        $("canvas#ALLPastVisitsMRGraph").remove();
                                        $("div.ALLPastVisitsMRGraphLines").append('<canvas id="ALLPastVisitsMRGraph" width="1860" height="800"></canvas>');
                                    } else if (len === 0) {
                                        $("div.ALLPastVisitsMRGraphLines").append('<canvas id="ALLPastVisitsMRGraph" width="1860" height="800"></canvas>');
                                    }

                                    const ALLPastVisitsMRGraph = new Chart('ALLPastVisitsMRGraph', {
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

                                $scope.PatientCDRGraphData = $scope.PatientGraphsData || [];
                                if ($scope.PatientCDRGraphData.length > 0) {
                                    const labels1 = [];
                                    angular.forEach($scope.PatientCDRGraphData, function (item, index) {
                                        item.AppointmentDate = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                                        labels1.unshift(item.AppointmentDate);
                                    });

                                    let CDRODArray = [];
                                    angular.forEach($scope.PatientCDRGraphData, function (item) {
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
                                    angular.forEach($scope.PatientCDRGraphData, function (item) {
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
                                        $scope.PastVisitGraphObj.IsCDRGraphArrayEmpty = true;
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

                                    let len = $("canvas#ALLPastVisitCDRGraph").length;
                                    if (len > 0) {
                                        $("canvas#ALLPastVisitCDRGraph").remove();
                                        $("div.ALLPastVisitCDRGraphLines").append('<canvas id="ALLPastVisitCDRGraph" width="1860" height="800"></canvas>');
                                    } else if (len === 0) {
                                        $("div.ALLPastVisitCDRGraphLines").append('<canvas id="ALLPastVisitCDRGraph" width="1860" height="800"></canvas>');
                                    }

                                    const ALLPastVisitCDRGraph = new Chart('ALLPastVisitCDRGraph', {
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

                                $scope.SubTab = 1;
                            }
                        };

                        $scope.closeuib = function () {
                            $uibModalInstance.dismiss("cancel");
                        };

                        $scope.ChangeALLIOPValues = function (Dataset) {
                            Dataset = Dataset || false;
                            $scope.ALLGraphOBJ = $scope.ALLGraphOBJ || {};
                            if (Dataset == true) {
                                var Data2 = {
                                    'datasets': [],
                                    'labels': $scope.ALLGraphOBJ.labels || []
                                };

                                Data2.datasets = $filter("filter")($scope.ALLGraphOBJ.datasets, function (item) {
                                    return item.label === "CC OD" || item.label === "CC OS" || item.label === "Medication Order" || item.label === "Procedures" || item.label === "Target OD" || item.label === "Target OS";
                                });

                                let len = $("canvas#ALLIOPGraphs").length;
                                if (len > 0) {
                                    $("canvas#ALLIOPGraphs").remove();
                                    $("div.ALLIOPGraphLines").append('<canvas id="ALLIOPGraphs" width="1860" height="800"></canvas>');
                                } else if (len === 0) {
                                    $("div.ALLIOPGraphLines").append('<canvas id="ALLIOPGraphs" width="1860" height="800"></canvas>');
                                }

                                const ALLIOPGraphs = new Chart('ALLIOPGraphs', {
                                    type: 'scatter',
                                    data: Data2,
                                    options: {
                                        scales: {
                                            x: { // add extra axes
                                                position: 'bottom',
                                                type: 'category'
                                            },
                                            y: {
                                                type: 'linear', // Use linear scale for the y-axis
                                                position: 'left'
                                            },
                                        },
                                        plugins: {
                                            tooltip: {
                                                callbacks: {
                                                    beforeFooter: (tooltipItems) => {
                                                        var MedicationStr = [];
                                                        $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                        tooltipItems.forEach(function (tooltipItem) {
                                                            /*Medication = tooltipItem.parsed.y;*/
                                                            angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                if (item.PrescriptionDetails.length > 0) {
                                                                    var i = 0;
                                                                    var List = 0;
                                                                    angular.forEach(item.PrescriptionDetails, function (mitem) {
                                                                        mitem.MedicationName = '';
                                                                        if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                            mitem.MedicationName += mitem.DrugBrandName + mitem.Dose + mitem.DoseUnit + mitem.Route;
                                                                            mitem.StopDate = mitem.StopDate || null;
                                                                            if (mitem.StopDate !== null) {
                                                                                mitem.StopDate = $filter('date')(mitem.StopDate, "MM-dd-yyyy");
                                                                                mitem.MedicationName += '-' + 'DisContinue';
                                                                            }
                                                                            List = $filter("filter")(MedicationStr, function (FAitem) { return FAitem == mitem.MedicationName },);
                                                                            if (List.length > 0) {
                                                                                i++;
                                                                            }
                                                                            if (i == 0) {
                                                                                MedicationStr.push(mitem.MedicationName);
                                                                            }
                                                                        }
                                                                    });
                                                                }

                                                            });
                                                        });
                                                        if (MedicationStr.length > 0) {
                                                            return 'MEDICATION ORDER: ' + MedicationStr;
                                                        }
                                                    },

                                                    footer: (tooltipItems) => {
                                                        var OPProceduresStr = [];
                                                        $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                        tooltipItems.forEach(function (tooltipItem) {
                                                            angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                if (item.OPProceduresArray.length > 0) {
                                                                    angular.forEach(item.OPProceduresArray, function (mitem) {
                                                                        var i = 0;
                                                                        var List = 0;
                                                                        mitem.OPProcedure = '';
                                                                        if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                            var Organ = mitem.OrganId == 1 ? 'OD' : mitem.OrganId == 2 ? 'OS' : mitem.OrganId == 3 ? 'OU' : '';
                                                                            mitem.OPProcedure += mitem.ProcedureName + "-" + Organ + '\n';
                                                                            List = $filter("filter")(OPProceduresStr, function (FAitem) { return FAitem == mitem.ProcedureName },);
                                                                            if (List.length > 0) {
                                                                                i++;
                                                                            }
                                                                            if (i == 0) {
                                                                                OPProceduresStr.push(mitem.OPProcedure);
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        });
                                                        if (OPProceduresStr.length > 0) {
                                                            return 'PROCEDURES: ' + OPProceduresStr;
                                                        }
                                                    }

                                                }
                                            },
                                        }
                                    }

                                });

                            } else {
                                var Data2 = {
                                    'datasets': [],
                                    'labels': $scope.ALLGraphOBJ.labels || []
                                };

                                Data2.datasets = $filter("filter")($scope.ALLGraphOBJ.datasets, function (item) {
                                    return item.label === "OD" || item.label === "OS" || item.label === "Medication Order" || item.label === "Procedures" || item.label === "Target OD" || item.label === "Target OS";
                                });

                                let len = $("canvas#ALLIOPGraphs").length;
                                if (len > 0) {
                                    $("canvas#ALLIOPGraphs").remove();
                                    $("div.ALLIOPGraphLines").append('<canvas id="ALLIOPGraphs" width="1860" height="800"></canvas>');
                                } else if (len === 0) {
                                    $("div.ALLIOPGraphLines").append('<canvas id="ALLIOPGraphs" width="1860" height="800"></canvas>');
                                }

                                const ALLIOPGraphs = new Chart('ALLIOPGraphs', {
                                    type: 'scatter',
                                    data: Data2,
                                    options: {
                                        scales: {
                                            x: { // add extra axes
                                                position: 'bottom',
                                                type: 'category'
                                            },
                                            y: {
                                                type: 'linear', // Use linear scale for the y-axis
                                                position: 'left'
                                            },
                                        },
                                        plugins: {
                                            tooltip: {
                                                callbacks: {
                                                    beforeFooter: (tooltipItems) => {
                                                        var MedicationStr = [];
                                                        $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                        tooltipItems.forEach(function (tooltipItem) {
                                                            angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                if (item.PrescriptionDetails.length > 0) {
                                                                    var i = 0;
                                                                    var List = 0;
                                                                    angular.forEach(item.PrescriptionDetails, function (mitem) {
                                                                        mitem.MedicationName = '';
                                                                        if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                            mitem.MedicationName += mitem.DrugBrandName + mitem.Dose + mitem.DoseUnit + mitem.Route;
                                                                            mitem.StopDate = mitem.StopDate || null;
                                                                            if (mitem.StopDate !== null) {
                                                                                mitem.StopDate = $filter('date')(mitem.StopDate, "MM-dd-yyyy");
                                                                                mitem.MedicationName += '-' + 'DisContinue';
                                                                            }
                                                                            List = $filter("filter")(MedicationStr, function (FAitem) { return FAitem == mitem.MedicationName },);
                                                                            if (List.length > 0) {
                                                                                i++;
                                                                            }
                                                                            if (i == 0) {
                                                                                MedicationStr.push(mitem.MedicationName);
                                                                            }
                                                                        }
                                                                    });
                                                                }

                                                            });
                                                        });
                                                        if (MedicationStr.length > 0) {
                                                            return 'MEDICATION ORDER: ' + MedicationStr;
                                                        }
                                                    },

                                                    footer: (tooltipItems) => {
                                                        var OPProceduresStr = [];
                                                        $scope.PatientIOPGraphData = $scope.PatientIOPGraphData || [];
                                                        tooltipItems.forEach(function (tooltipItem) {
                                                            angular.forEach($scope.PatientIOPGraphData, function (item) {
                                                                if (item.OPProceduresArray.length > 0) {
                                                                    angular.forEach(item.OPProceduresArray, function (mitem) {
                                                                        var i = 0;
                                                                        var List = 0;
                                                                        mitem.OPProcedure = '';
                                                                        if (item.AppointmentDate == tooltipItem.raw.x) {
                                                                            var Organ = mitem.OrganId == 1 ? 'OD' : mitem.OrganId == 2 ? 'OS' : mitem.OrganId == 3 ? 'OU' : '';
                                                                            mitem.OPProcedure += mitem.ProcedureName + "-" + Organ + '\n';
                                                                            List = $filter("filter")(OPProceduresStr, function (FAitem) { return FAitem == mitem.ProcedureName },);
                                                                            if (List.length > 0) {
                                                                                i++;
                                                                            }
                                                                            if (i == 0) {
                                                                                OPProceduresStr.push(mitem.OPProcedure);
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        });
                                                        if (OPProceduresStr.length > 0) {
                                                            return 'PROCEDURES: ' + OPProceduresStr;
                                                        }
                                                    }

                                                }
                                            },
                                        }
                                    }

                                });
                            }

                        };

                        if ($scope.SubTab === 1) {
                            $timeout(function () {
                                $scope.ShowAllGraphs('All')
                            }, 500);
                        }
                    }
                });
            }
        });
    };

    $scope.SelectPirticulardigAppt = function (item) {
        if ($scope.FilteredDiagnosisHxDetails.length > 0) {
            angular.forEach($scope.FilteredDiagnosisHxDetails, function (sitem) {
                sitem.IsSelecteddig = false;
            });
        }
        item.IsSelecteddig = true;
    };

    $scope.Gridviewpopup = function () {
        /*$scope.caseObj.PatientPastVisitPopUp = !$scope.caseObj.PatientPastVisitPopUp;*/
        $scope.caseObj.PatientPastVisitPopUp = true;
        $scope.GridPastVisitSummaryObj = angular.copy($scope.PastVisitSummaryObj);

        $scope.mInstanceShow = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/Gridviewpopup.html",
            "backdrop": "static",
            "scope": $scope,
            //"size": "lg",
            "windowClass": "offcanves-right-grid",
            "keyboard": false,
            
            "controller": function ($scope, $uibModal, $uibModalInstance) {

                $scope.Uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                }

                $scope.ApplyCheckedItems = function () {
                    /*$scope.PastVisitSummaryObj = angular.copy($scope.GridPastVisitSummaryObj);*/
                    /*$scope.caseObj.PatientPastVisitPopUp = false;*/

                    $scope.mInstanceShow.close();
                };
                
            }
        });
        $scope.mInstanceShow.result.then(function () {
            $scope.PastVisitSummaryObj = angular.copy($scope.GridPastVisitSummaryObj);
        }, function () { });
    }

    $scope.GetROSPastVisitsDatesObj = {
        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "DateType": "",
        "DefaultAll": true
    };

    /*<----- ROS date ----->*/

    $scope.GetROSTodayDates = function (type) {
        $scope.GetROSPastVisitsDatesObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetROSPastVisitsDatesObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetROSPastVisitsDatesObj.DateType = type;
        $scope.GetROSPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetROSYesterdayDates = function (type) {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        $scope.GetROSPastVisitsDatesObj.FromDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetROSPastVisitsDatesObj.ToDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetROSPastVisitsDatesObj.DateType = type;
        $scope.GetROSPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetROSThisMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetROSPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetROSPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetROSPastVisitsDatesObj.DateType = type;
        $scope.GetROSPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetROSMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 1;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetROSPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetROSPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetROSPastVisitsDatesObj.DateType = type;
        $scope.GetROSPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetROSThreeMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 3;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 3, 0);
        $scope.GetROSPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetROSPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetROSPastVisitsDatesObj.DateType = type;
        $scope.GetROSPastVisitsDatesObj.DefaultAll = false;
    };
    /*<----- ROS date ----->*/

    $scope.GetFilteredROSDetails = function (type) {

        var params = {
            "PatientId": $scope.Patientid || 0,
            "FromDate": $filter('date')(new Date($scope.GetROSPastVisitsDatesObj.FromDate), "yyyy-MM-dd"),
            "Todate": $filter('date')(new Date($scope.GetROSPastVisitsDatesObj.ToDate), "yyyy-MM-dd"),
            "OrganizationId": $scope.HospitalId,
            "DefaultAll": $scope.GetROSPastVisitsDatesObj.DefaultAll || false
        };
        eHnoteSettingsDataService.GetFilteredROSDetails(params).then(function (response) {
            $scope.FilteredROSHxDetails = [];
            if (response.data.status === "Success") {
                $scope.FilteredROSHxDetails = response.data.rows || [];
                if ($scope.FilteredROSHxDetails.length > 0) {
                    angular.forEach($scope.FilteredROSHxDetails, function (item, index) {
                        item.IsSelectedApt = false;
                        item.IsActive = false;
                        item.RosScrollIndex = "ConsultationScrollAtiveinRos" + index;

                        item.PsychologicalScoreArray = [];
                        if (item.PsychologicalObservationsArray.length > 0) {
                            var ScoreObject = angular.copy($scope.GetScoreObject());
                            angular.forEach(item.PsychologicalObservationsArray, function (Aitem) {
                                if (Aitem.TypeId == 1) {
                                    if (Aitem.QuestionId == 4) {
                                        angular.forEach(Aitem.SubQuestions, function (item) {
                                            ScoreObject.PHQScore += item.Score;
                                        });
                                    }

                                    if (Aitem.QuestionId == 7) {
                                        angular.forEach(Aitem.SubQuestions, function (item) {
                                            ScoreObject.AUDITScore += item.Score;
                                        });
                                    }
                                }
                                if (Aitem.TypeId == 2) {
                                    ScoreObject.NHANESscore += Aitem.Score;
                                }
                                if (Aitem.TypeId == 3) {
                                    ScoreObject.HARKscore += Aitem.Score;
                                }
                            });
                            item.PsychologicalScoreArray.push(ScoreObject);
                        }
                    });
                    $scope.FilteredROSHxDetails[0].IsSelectedApt = true;
                    $scope.FilteredROSHxDetails[0].IsActive = true;
                }

                $scope.SummaryTab = type || 14;

            }
        }, function (err) {
            alertify.error("Fetching Data Failed!");
        });

    };

    $scope.datepickerpopoverCC = {
        templateUrl: 'datepickerpopoverCC.html',
    };

    $scope.datepickerpopoverros = {
        templateUrl: 'datepickerpopoverros.html',
    };

    /*<----- CC date ----->*/

    $scope.GetCCTodayDates = function (type) {
        $scope.GetCCPastVisitsDatesObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetCCPastVisitsDatesObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetCCPastVisitsDatesObj.DateType = type;
        $scope.GetCCPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetCCYesterdayDates = function (type) {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        $scope.GetCCPastVisitsDatesObj.FromDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetCCPastVisitsDatesObj.ToDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetCCPastVisitsDatesObj.DateType = type;
        $scope.GetCCPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetCCThisMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetCCPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetCCPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetCCPastVisitsDatesObj.DateType = type;
        $scope.GetCCPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetCCMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 1;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetCCPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetCCPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetCCPastVisitsDatesObj.DateType = type;
        $scope.GetCCPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetCCThreeMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 3;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 3, 0);
        $scope.GetCCPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetCCPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetCCPastVisitsDatesObj.DateType = type;
        $scope.GetCCPastVisitsDatesObj.DefaultAll = false;
    };
        /*<----- CC date ----->*/

    $scope.SelectPirticularROSAppt = function (item) {
        if ($scope.FilteredROSHxDetails.length > 0) {
            angular.forEach($scope.FilteredROSHxDetails, function (sitem) {
                sitem.IsSelectedApt = false;
            });
        }
        item.IsSelectedApt = true;
    };

    $scope.datepickerpopoverOrders = {
        templateUrl: 'datepickerpopoverOrders.html',
    };

    function GetCDRGraphObj() {
        return {
            "IsShowCDRgraph": false,
            "IsCDRArrayEmpty": false
        }
    };
    $scope.CDRGraphObj = GetCDRGraphObj();

    $scope.ShowCDRGraph = function (tab) {
        $scope.CDRGraphObj.IsShowCDRgraph = true;
        var obj = {
            "PatientId": $scope.cacheStorageItem.patientid
        };
        eHnotePatientDataService.GetGraphRelatedPatientData(obj).then(function (resp) {
            $scope.PatientGraphData = [];
            if (resp.data.Status == "Success") {
                $scope.SummaryTab = tab || 15;
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

                let len = $("canvas#myChartCDRGraphLines").length;
                if (len > 0) {
                    $("canvas#myChartCDRGraphLines").remove();
                    $("div.CDRGraphLines").append('<canvas id="myChartCDRGraphLines" width="1860" height="800"></canvas>');
                } else if (len === 0) {
                    $("div.CDRGraphLines").append('<canvas id="myChartCDRGraphLines" width="1860" height="800"></canvas>');
                }

                const myChartCDRGraphLines = new Chart('myChartCDRGraphLines', {
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
    };

    /*<----- Orders date ----->*/
    $scope.GetOrderdsTodayDates = function (type) {
        $scope.GetOrdersPastVisitsDatesObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetOrdersPastVisitsDatesObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.GetOrdersPastVisitsDatesObj.DateType = type;
        $scope.GetOrdersPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetOrderdsYesterdayDates = function (type) {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        $scope.GetOrdersPastVisitsDatesObj.FromDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetOrdersPastVisitsDatesObj.ToDate = $filter('date')(date, "MM-dd-yyyy");
        $scope.GetOrdersPastVisitsDatesObj.DateType = type;
        $scope.GetOrdersPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetOrderdsThisMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetOrdersPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetOrdersPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetOrdersPastVisitsDatesObj.DateType = type;
        $scope.GetOrdersPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetOrderdsPastMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 1;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 1, 0);
        $scope.GetOrdersPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetOrdersPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetOrdersPastVisitsDatesObj.DateType = type;
        $scope.GetOrdersPastVisitsDatesObj.DefaultAll = false;
    };

    $scope.GetOrderdsPastThreeMonthDates = function (type) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 3;
        let FromDate = new Date(year, month, 1);
        let ToDate = new Date(year, month + 3, 0);
        $scope.GetOrdersPastVisitsDatesObj.FromDate = $filter('date')(FromDate, "MM-dd-yyyy");
        $scope.GetOrdersPastVisitsDatesObj.ToDate = $filter('date')(ToDate, "MM-dd-yyyy");
        $scope.GetOrdersPastVisitsDatesObj.DateType = type;
        $scope.GetOrdersPastVisitsDatesObj.DefaultAll = false;
    };
    /*<----- Orders date ----->*/

    
    $scope.ActiveConsultaionSideBarClick = function (item, type) {
        if (type == 'CC') {
            angular.forEach($scope.FilteredDiagnosisHxDetails, function (sitem, index) {
                sitem.IsActive = false;
                if (sitem.CcScrollIndex === item.CcScrollIndex) {
                    item.IsActive = true;
                }
            });
        }

        if (type == 'Ros') {
            angular.forEach($scope.FilteredROSHxDetails, function (sitem) {
                sitem.IsActive = false;
                if (sitem.RosScrollIndex === item.RosScrollIndex) {
                    item.IsActive = true;
                }
            });
        }

        if (type == 'VA') {
            angular.forEach($scope.PreviousVisionDetails, function (sitem) {
                sitem.IsActive = false;
                if (sitem.VAScrollIndex === item.VAScrollIndex) {
                    item.IsActive = true;
                }
            });
        }

        if (type == 'Plan') {
            angular.forEach($scope.FilteredPlanHxDetails, function (sitem) {
                sitem.IsActive = false;
                if (sitem.PlanScrollIndex === item.PlanScrollIndex) {
                    item.IsActive = true;
                }
            });
        }
    }

    //$scope.activepastvisitclassFunction = function (item, ind) {
    //    var objbit = false;
    //    angular.forEach($scope.FilteredDiagnosisHxDetails, function (sitem, index) {
    //        sitem.CcScrollIndex = "ConsultationScrollAtive" + index;
            
    //    });
        
    //    return !objbit;
    //};
    $scope.RetinaFilterpopover = {
        templateUrl: 'RetinaFilterpopover.html',
    };

    $scope.ShowRetinaScatterGraph = function () {
        $scope.RetinaGraphObj.IsShowRetinagraph = !$scope.RetinaGraphObj.IsShowRetinagraph;
        if ($scope.RetinaGraphObj.IsShowRetinagraph && $scope.ProceduresArrayObj.FilteredArray.length > 0) {
            $scope.PatientRetinaGraphDetails = angular.copy($scope.ProceduresArrayObj.FilteredArray);
            const labels1 = [];
            //$scope.PatientRetinaGraphDetails = $filter("filter")($scope.PatientRetinaGraphDetails, function (item) {
            //    item.ODBCVA = item.ODBCVA || '';
            //    item.OSBCVA = item.OSBCVA || '';
            //    item.ODIOP = item.ODIOP || '';
            //    item.OSIOP = item.OSIOP || '';
            //    return item.ODBCVA !== "" || item.OSBCVA !== "" || item.ODIOP !== "" || item.OSIOP !== "";
            //});
            angular.forEach($scope.PatientRetinaGraphDetails, function (item, index) {
                item.AppointmentDate = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                labels1.unshift(item.AppointmentDate);
            });

            let BCVAODArray = [];
            angular.forEach($scope.PatientRetinaGraphDetails, function (Vitem) {
                Vitem.ODBCVA = Vitem.ODBCVA || '';
                if (Vitem.ODBCVA !== '') {
                    var fractionParts = Vitem.ODBCVA.split('/');
                    var numerator = fractionParts[0];
                    var FinalODDenominator = fractionParts[1];

                    if (fractionParts[1] !== undefined) {
                        var denominator1 = fractionParts[1].split('+');
                        if (denominator1[1] !== undefined) {
                            var denominatorA = denominator1[0];
                            var denominatorB = denominator1[1];
                            denominatorA = parseInt(denominatorA) || 0;
                            denominatorB = parseInt(denominatorB) || 0;
                            FinalODDenominator = denominatorA + denominatorB;
                        }

                        var denominator2 = fractionParts[1].split('-');
                        if (denominator2[1] !== undefined) {
                            var denominatorA = denominator2[0];
                            var denominatorB = denominator2[1];
                            denominatorA = parseInt(denominatorA) || 0;
                            denominatorB = parseInt(denominatorB) || 0;
                            FinalODDenominator = denominatorA - denominatorB;
                        }
                    }

                    let Date = Vitem.AppointmentDate;
                    let obj = {
                        x: Date,
                        y: (FinalODDenominator != '') ? FinalODDenominator : null
                    };
                    BCVAODArray.unshift(obj);
                } else {
                    let Date = Vitem.AppointmentDate;
                    let obj = {
                        x: Date,
                        y: null
                    };
                    BCVAODArray.unshift(obj);
                }

            });

            let BCVAOSArray = [];
            angular.forEach($scope.PatientRetinaGraphDetails, function (Vitem) {
                Vitem.OSBCVA = Vitem.OSBCVA || '';
                if (Vitem.OSBCVA !== '') {
                    var fractionParts = Vitem.OSBCVA.split('/');
                    var numerator = fractionParts[0];
                    var FinalOSDenominator = fractionParts[1];

                    if (fractionParts[1] !== undefined) {
                        var denominator1 = fractionParts[1].split('+');
                        if (denominator1[1] !== undefined) {
                            var denominatorA = denominator1[0];
                            var denominatorB = denominator1[1];
                            denominatorA = parseInt(denominatorA) || 0;
                            denominatorB = parseInt(denominatorB) || 0;
                            FinalOSDenominator = denominatorA + denominatorB;
                        }

                        var denominator2 = fractionParts[1].split('-');
                        if (denominator2[1] !== undefined) {
                            var denominatorA = denominator2[0];
                            var denominatorB = denominator2[1];
                            denominatorA = parseInt(denominatorA) || 0;
                            denominatorB = parseInt(denominatorB) || 0;
                            FinalOSDenominator = denominatorA - denominatorB;
                        }
                    }

                    let Date = Vitem.AppointmentDate;
                    let obj = {
                        x: Date,
                        y: (FinalOSDenominator != '') ? FinalOSDenominator : null
                    };
                    BCVAOSArray.unshift(obj);
                } else {
                    let Date = Vitem.AppointmentDate;
                    let obj = {
                        x: Date,
                        y: null
                    };
                    BCVAOSArray.unshift(obj);
                }
            });

            let IOPODArray = [];
            angular.forEach($scope.PatientRetinaGraphDetails, function (item) {
                item.ODIOP = item.ODIOP || '';
                if (item.ODIOP !== '') {
                    var FinalODIOP = item.ODIOP;

                    let Date = item.AppointmentDate;
                    let obj = {
                        x: Date,
                        y: (FinalODIOP != '') ? FinalODIOP : null
                    };
                    IOPODArray.unshift(obj);
                } else {
                    let Date = item.AppointmentDate;
                    let obj = {
                        x: Date,
                        y: null
                    };
                    IOPODArray.unshift(obj);
                }
            });

            let IOPOSArray = [];
            angular.forEach($scope.PatientRetinaGraphDetails, function (item) {
                item.OSIOP = item.OSIOP || '';
                if (item.OSIOP !== '') {
                    var FinalOSIOP = item.OSIOP;

                    let Date = item.AppointmentDate;
                    let obj = {
                        x: Date,
                        y: (FinalOSIOP != '') ? FinalOSIOP : null
                    };
                    IOPOSArray.unshift(obj);
                } else {
                    let Date = item.AppointmentDate;
                    let obj = {
                        x: Date,
                        y: null
                    };
                    IOPOSArray.unshift(obj);
                }
            });

            if (BCVAODArray.length == 0 && BCVAOSArray.length == 0 && IOPODArray.length == 0 && IOPOSArray.length == 0) {
                $scope.RetinaGraphObj.IsRetinaArrayEmpty = true;
                return false;
            }

            const data1 = {
                labels: labels1,
                datasets: [
                    {
                        type: 'scatter',
                        label: 'BCVA OD',
                        backgroundColor: 'rgb(255, 0, 0)',
                        borderColor: 'rgb(255, 0, 0)',
                        showLine: true,
                        data: BCVAODArray,
                        spanGaps: true,
                    },
                    {
                        type: 'scatter',
                        label: 'BCVA OS',
                        backgroundColor: 'rgb(245, 66, 120)',
                        borderColor: 'rgb(245, 66, 120)',
                        showLine: true,
                        data: BCVAOSArray,
                        spanGaps: true,
                    },
                    {
                        type: 'scatter',
                        label: 'IOP OD',
                        backgroundColor: '#5742f5',
                        borderColor: '#5742f5',
                        showLine: true,
                        data: IOPODArray,
                        spanGaps: true,
                    },
                    {
                        type: 'scatter',
                        label: 'IOP OS',
                        backgroundColor: '#42e3f5',
                        borderColor: '#42e3f5',
                        showLine: true,
                        data: IOPOSArray,
                        spanGaps: true,
                    }
                ]
            }

            let len = $("canvas#myChart").length;
            if (len > 0) {
                $("canvas#myChart").remove();
                $("div.RetinaScatterGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
            } else if (len === 0) {
                $("div.RetinaScatterGraphLines").append('<canvas id="myChart" width="1860" height="800"></canvas>');
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
        } else {

        }
    };
    $scope.CLFilter = {
        templateUrl: 'CLFilter.html',
    };
    $scope.NavtoNewimagemanagementPopup = function (item) {
        var object = {
            "From": 'PastVisits'
        }
        eHnoteDiagnosisDataServices.GetAllMasterConsultationData().then(function (resp) {
            $scope.Modalities = [];
            if (resp.data.status = "Success") {
                $scope.Modalities = resp.data.Modalities || [];
                
                var mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/uibpopups/NewimagemanagementV2.html",
                    "backdrop": "static",
                    "keyboard": false,
                    "windowClass": "modal__popup--1 bottom-to-top-modal",
                    "controller": "EhnoteImageManagementPopupCtrl",
                    "resolve": {
                        "ModalitiesArray": function () { return angular.copy($scope.Modalities) },
                        "AllDoctorList": function () { return angular.copy($scope.AllDoctorList) },
                        "PatientOrderId": function () { return angular.copy(item.PatientOrderId) },
                        "IsComingFrom": function () { return angular.copy(object.From) }
                    },
                });
                mInstanceAdd.result.then(function () {
                    $scope.GetRetinaDetails(17);
                }, function (Investigation) {

                });
            }
        }, function (err) {
            alertify.error("Getting Data Failed");
            $scope.Modalities = [];
        });

    }

    $scope.SaveRetinaFilterPOPover = function () {
        var filteredEye = 0;
        if ($scope.RetinaFilterObj.IsSelectedFilterOrgan == '1') {
            filteredEye = 1;
        } else if ($scope.RetinaFilterObj.IsSelectedFilterOrgan == '2') {
            filteredEye = 2;
        } else if ($scope.RetinaFilterObj.IsSelectedFilterOrgan == '3') {
            filteredEye = 3;
        } else if ($scope.RetinaFilterObj.IsSelectedFilterOrgan == '4') {
            $scope.ProceduresArrayObj.FilteredArray = $scope.ProceduresArrayObj.MainArray || [];
        }
        else { }

        $scope.ProceduresArrayObj.FilteredArray = $scope.ProceduresArrayObj.FilteredArray || [];
        if (filteredEye != 0 ) {
            $scope.ProceduresArrayObj.FilteredArray = $filter("filter")($scope.ProceduresArrayObj.MainArray, function (item) {
                return item.OrganId == filteredEye;
            });
        }

        $scope.TempProceduresArray = $scope.ProceduresArrayObj.FilteredArray || [];
        if ($scope.TempProceduresArray.length > 0 && ($scope.RetinaFilterObj.IsSelectedInjectionProceduresOnly || $scope.RetinaFilterObj.IsSelectedLaserProceduresOnly || $scope.RetinaFilterObj.IsSelectedSurgeryProceduresOnly)) {
            $scope.ProceduresArrayObj.FilteredArray = [];
            if ($scope.RetinaFilterObj.IsSelectedInjectionProceduresOnly) {
                angular.forEach($scope.TempProceduresArray, function (item) {
                    if (item.SubProcedureTypeId == 2) {
                        $scope.ProceduresArrayObj.FilteredArray.push(item);
                    }
                });
            }

            if ($scope.RetinaFilterObj.IsSelectedLaserProceduresOnly) {
                angular.forEach($scope.TempProceduresArray, function (item) {
                    if (item.SubProcedureTypeId == 1) {
                        $scope.ProceduresArrayObj.FilteredArray.push(item);
                    }
                });
            }

            if ($scope.RetinaFilterObj.IsSelectedSurgeryProceduresOnly) {
                angular.forEach($scope.TempProceduresArray, function (item) {
                    if (item.SubProcedureTypeId == 3) {
                        $scope.ProceduresArrayObj.FilteredArray.push(item);
                    }
                });
            }

        }

        $scope.RetinaFilterObj.RetinaPopoverOpen = false;
        $scope.RetinaGraphObj.IsRetinaArrayEmpty = false;
        if ($scope.ProceduresArrayObj.FilteredArray.length == 0) {
            $scope.RetinaGraphObj.IsRetinaArrayEmpty = true;
        }
    }

    $scope.CloseRetinaFilterPOPover = function () {
        $scope.RetinaFilterObj.RetinaPopoverOpen = false;
    }

    $scope.RetinaPopoverClick = function () {
        $scope.RetinaFilterObj.RetinaPopoverOpen = true;
    }

    $scope.RefractionFilterpopover = {
        templateUrl: 'RefractionFilterpopover.html',
    };

    $scope.RefractionPopoverClick = function () {
        $scope.filteredRefractionObj.RefractionPopoverOpen = true;
    }

    $scope.CloseRefractionFilterPOPover = function () {
        $scope.filteredRefractionObj.RefractionPopoverOpen = false;
    }


    $scope.filteredRefractionObj = {
        "OrganId": "3",
        "RefractionPopoverOpen":false,
        "Items": [
            {
                "Id": 1,
                "Name": "Auto Refraction",
                "IsActive": false
            },
            {
                "Id": 2,
                "Name": "Retinoscopy",
                "IsActive": false
            },
            {
                "Id": 3,
                "Name": "Present Glass Rx",
                "IsActive": false
            },
            {
                "Id": 4,
                "Name": "Manifest Refraction",
                "IsActive": false
            },
            {
                "Id": 5,
                "Name": "Cycloplegic Refraction",
                "IsActive": false
            },
            {
                "Id": 6,
                "Name": "Over Refraction",
                "IsActive": false
            },
            {
                "Id": 7,
                "Name": "Final Glass Rx",
                "IsActive": true
            }
        ]
    }

    $scope.SaveRefractionFilterPOPover = function () {

        var FilteredArray = [];

        //var checklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true }, true) || [];

        var Archecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 1 }, true) || [];
        var Retinochecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 2 }, true) || [];
        var PGPchecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 3 }, true) || [];
        var MFchecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 4 }, true) || [];
        var CRchecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 5 }, true) || [];
        var ORchecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 6 }, true) || [];
        var FGchecklist = $filter("filter")($scope.filteredRefractionObj.Items, { "IsActive": true, "Id": 7 }, true) || [];

        if ($scope.PreviousInvestigations.length > 0) {
            angular.forEach($scope.PreviousInvestigations, function (citem) {
                var newobj = {
                    "AppointmentDate": citem.AppointmentDate,
                    "VisionDetails": [],
                    "Tonometry": [],
                    "AutoRefraction": [],
                    "Retinoscopyrefraction": [],
                    "ManifestRefraction": [],
                    "CycloplegicRefractionArray": [],
                    "PGPrefractionArray": [],
                    "FinalGlassRxArray": [],
                    "OverRefractionArray": [],
                    "GlassDetails": [],
                    "Keratometry": [],
                    "Pachymetry": []
                };

                //Checking if RefractionData Available

                if (Archecklist.length > 0) {
                    newobj.AutoRefraction = citem.AutoRefraction;
                }
                if (Retinochecklist.length > 0) {
                    newobj.Retinoscopyrefraction = citem.Retinoscopyrefraction;
                }
                if (PGPchecklist.length > 0) {
                    newobj.PGPrefractionArray = citem.PGPrefractionArray;
                }
                if (MFchecklist.length > 0) {
                    newobj.ManifestRefraction = citem.ManifestRefraction;
                }
                if (CRchecklist.length > 0) {
                    newobj.CycloplegicRefractionArray = citem.CycloplegicRefractionArray;
                }
                if (ORchecklist.length > 0) {
                    newobj.OverRefractionArray = citem.OverRefractionArray;
                }
                if (FGchecklist.length > 0) {
                    newobj.FinalGlassRxArray = citem.FinalGlassRxArray;
                }




                //Checking if OD and OS values available
                angular.forEach(newobj.AutoRefraction, function (aitem) {
                    aitem.IsOdValuesAvailable = false;
                    aitem.IsOsValuesAvailable = false;

                    if ($scope.filteredRefractionObj.OrganId === "1" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "") {
                            aitem.IsOdValuesAvailable = true;
                        }
                    }

                    if ($scope.filteredRefractionObj.OrganId === "2" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "") {
                            aitem.IsOsValuesAvailable = true;
                        }
                    }


                });

                angular.forEach(newobj.Retinoscopyrefraction, function (aitem) {
                    aitem.IsOdValuesAvailable = false;
                    aitem.IsOsValuesAvailable = false;
                    if ($scope.filteredRefractionObj.OrganId === "1" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "") {
                            aitem.IsOdValuesAvailable = true;
                        }
                    }
                    if ($scope.filteredRefractionObj.OrganId === "2" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "") {
                            aitem.IsOsValuesAvailable = true;
                        }
                    }
                })

                angular.forEach(newobj.ManifestRefraction, function (aitem) {
                    aitem.IsOdValuesAvailable = false;
                    aitem.IsOsValuesAvailable = false;
                    aitem.IsOuValuesAvailable = false;

                    if ($scope.filteredRefractionObj.OrganId === "1" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "" || aitem.RAdition != "" || aitem.RPrismVt != "" || aitem.RPrismHz != "" || aitem.RBaseVt != "" || aitem.RBaseHz != "" || aitem.RBCVA != "" || aitem.RBCNVA != "" || aitem.RVAI != "" || aitem.RDuo != "" || aitem.RCs != "" || aitem.RType != "") {
                            aitem.IsOdValuesAvailable = true;
                        }
                    }
                    if ($scope.filteredRefractionObj.OrganId === "2" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "" || aitem.LAdition != '' || aitem.LPrismVt != '' || aitem.LPrismHz != '' || aitem.LBaseVt != '' || aitem.LBaseHz != '' || aitem.LBCVA != '' || aitem.LBCNVA != '' || aitem.LVAI != '' || aitem.LDuo != '' || aitem.LCs != '' || aitem.LType != '') {
                            aitem.IsOsValuesAvailable = true;
                        }
                    }
                    if ($scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.BBCVA != '' || aitem.BBCNVA != '' || aitem.BVAI != '' || aitem.BDuo != '' || aitem.BCs != '') {
                            aitem.IsOuValuesAvailable = true;
                        }
                    }

                });

                angular.forEach(newobj.PGPrefractionArray, function (aitem) {
                    aitem.IsOdValuesAvailable = false;
                    aitem.IsOsValuesAvailable = false;

                    if ($scope.filteredRefractionObj.OrganId === "1" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "" || aitem.RAdition != "" || aitem.RPrismVt != "" || aitem.RBaseVt != "" || aitem.RBaseHz != "" || aitem.RPrismHz != "") {
                            aitem.IsOdValuesAvailable = true;
                        }
                    }
                    if ($scope.filteredRefractionObj.OrganId === "2" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "" || aitem.LAdition != "" || aitem.LPrismVt != "" || aitem.LBaseVt != "" || aitem.LBaseHz != "" || aitem.LPrismHz != "") {
                            aitem.IsOsValuesAvailable = true;
                        }
                    }
                })

                angular.forEach(newobj.CycloplegicRefractionArray, function (aitem) {
                    aitem.IsOdValuesAvailable = false;
                    aitem.IsOsValuesAvailable = false;
                    aitem.IsOuValuesAvailable = false;

                    if ($scope.filteredRefractionObj.OrganId === "1" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "" || aitem.RAdition != "" || aitem.RBCVA != "" || aitem.RBCNVA != "" || aitem.RVAI != "") {
                            aitem.IsOdValuesAvailable = true;
                        }
                    }

                    if ($scope.filteredRefractionObj.OrganId === "2" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "" || aitem.LAdition != "" || aitem.LBCVA != "" || aitem.LBCNVA != "" || aitem.LVAI != "") {
                            aitem.IsOsValuesAvailable = true;
                        }
                    }

                    if ($scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.BBCVA != "" || aitem.BBCNVA != "" || aitem.BVAI != "") {
                            aitem.IsOuValuesAvailable = true;
                        }
                    }
                });
                angular.forEach(newobj.OverRefractionArray, function (aitem) {
                    aitem.IsOdValuesAvailable = false;
                    aitem.IsOsValuesAvailable = false;
                    aitem.IsOuValuesAvailable = false;

                    if ($scope.filteredRefractionObj.OrganId === "1" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "" || aitem.RAdition != "" || aitem.RBCVA != "" || aitem.RBCNVA != "" || aitem.RVAI != "") {
                            aitem.IsOdValuesAvailable = true;
                        }
                    }

                    if ($scope.filteredRefractionObj.OrganId === "2" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "" || aitem.LAdition != "" || aitem.LBCVA != "" || aitem.LBCNVA != "" || aitem.LVAI != "") {
                            aitem.IsOsValuesAvailable = true;
                        }
                    }

                    if ($scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.BBCVA != "" || aitem.BBCNVA != "" || aitem.BVAI != "") {
                            aitem.IsOuValuesAvailable = true;
                        }
                    }
                })

                angular.forEach(newobj.FinalGlassRxArray, function (aitem) {
                    aitem.IsOdValuesAvailable = false;
                    aitem.IsOsValuesAvailable = false;

                    if ($scope.filteredRefractionObj.OrganId === "1" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.RCylindrical != "" || aitem.RSpherical != "" || aitem.RAxis != "" || aitem.RAdition != "" || aitem.RPrismVt != "" || aitem.RPrismHz != "" || aitem.RBaseVt != "" || aitem.RBaseHz != "" || aitem.RBCVA != "" || aitem.RBCNVA != "" || aitem.RVAI != "" || aitem.RType != "") {
                            aitem.IsOdValuesAvailable = true;
                        }
                    }
                    if ($scope.filteredRefractionObj.OrganId === "2" || $scope.filteredRefractionObj.OrganId === "3") {
                        if (aitem.LCylindrical != "" || aitem.LSpherical != "" || aitem.LAxis != "" || aitem.LAdition != '' || aitem.LPrismVt != '' || aitem.LPrismHz != '' || aitem.LBaseVt != '' || aitem.LBaseHz != '' || aitem.LBCVA != '' || aitem.LBCNVA != '' || aitem.LVAI != '' || aitem.LType != '') {
                            aitem.IsOsValuesAvailable = true;
                        }
                    }
                });

                FilteredArray.push(newobj);
            });
        }
        if (FilteredArray.length > 0) {
            $scope.FiteredInvestigationsArray = FilteredArray || [];
        } else {
            $scope.FiteredInvestigationsArray.push(newobj);
        }
        $scope.filteredRefractionObj.RefractionPopoverOpen = false;
    }
    $scope.GetAllMasterConsultationData = function () {
        eHnoteDiagnosisDataServices.GetAllMasterConsultationData().then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.GetAssSeverityList = resp.data.CheifComplaintSeverity || [];
            }

        });
    }
    $scope.GetAllMasterConsultationData();
    $scope.GetContactLensDetails = function (type) {

        var params = {
            "PatientId": $scope.Patientid || 0,
            "FromDate": $scope.GetProceduresPastVisitsDatesObj.FromDate || null,
            "Todate": $scope.GetProceduresPastVisitsDatesObj.ToDate || null,
            "OrganizationId": $scope.HospitalId,
            "DefaultAll": $scope.GetProceduresPastVisitsDatesObj.DefaultAll || false
        };
        eHnoteSettingsDataService.GetPatientContactLensDetails(params).then(function (response) {
            if (response.data.status === "Success") {
                $scope.ContactLensDetails = [];
                $scope.FiteredContactLensArray = [];
                $scope.ContactLensDetails = response.data.rows || [];
                $scope.FiteredContactLensArray = angular.copy($scope.ContactLensDetails) || [];
                $scope.FiteredCL = [];
                angular.forEach($scope.FiteredContactLensArray, function (fitem) {
                    fitem.RGP = '';
                    fitem.SLP = '';
                    angular.forEach(fitem.ContactLensDetails, function (fcitem) {
                        if (fcitem.InvestigationId == 2084) {
                            fitem.SLP = fcitem;
                            if (fcitem.InvestigationDetails.length > 0) {
                                fitem.SLP.Wearing = [];
                                fitem.SLP.Trail = [];
                                fitem.SLP.Final = [];
                                fitem.SLP.DisFinal = [];
                                fitem.SLP.AWearing = [];
                                fitem.SLP.ATrail = [];
                                fitem.SLP.AFinal = [];
                                fitem.SLP.ADisFinal = [];
                                angular.forEach(fcitem.InvestigationDetails, function (citem) {
                                    if (citem.SubInvestigationId == 1) {
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != ''
                                            || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != ''
                                            || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            fitem.SLP.Wearing.push(citem);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != ''
                                            || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != '' || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != ''
                                            || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '' || citem.AdvancedRefractionRemarks != '') {
                                            fitem.SLP.AWearing.push(citem);
                                        }
                                    }
                                    else if (citem.SubInvestigationId == 2) {
                                        /*fitem.SLP.Trail.push(citem);*/
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != ''
                                            || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != ''
                                            || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            fitem.SLP.Trail.push(citem);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != ''
                                            || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != '' || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != ''
                                            || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '' || citem.AdvancedRefractionRemarks != '') {
                                            fitem.SLP.ATrail.push(citem);
                                        }
                                    }
                                    else if (citem.SubInvestigationId == 3) {
                                        //    fitem.SLP.Final.push(citem)
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != ''
                                            || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != ''
                                            || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            fitem.SLP.Final.push(citem);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != ''
                                            || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != '' || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != ''
                                            || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '' || citem.AdvancedRefractionRemarks != '') {
                                            fitem.SLP.AFinal.push(citem);
                                        }
                                    }
                                    else if (citem.SubInvestigationId == 4) {
                                        //    fitem.SLP.DisFinal.push(citem);
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != ''
                                            || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != ''
                                            || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            fitem.SLP.DisFinal.push(citem);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != ''
                                            || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != '' || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != ''
                                            || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '' || citem.AdvancedRefractionRemarks != '') {
                                            fitem.SLP.ADisFinal.push(citem);
                                        }
                                    }
                                });
                            }
                        }
                        if (fcitem.InvestigationId == 2078) {
                            fitem.RGP = fcitem;
                            if (fcitem.InvestigationDetails.length > 0) {
                                fitem.RGP.Wearing = [];
                                fitem.RGP.Trail = [];
                                fitem.RGP.Final = [];
                                fitem.RGP.DisFinal = [];
                                fitem.RGP.AWearing = [];
                                fitem.RGP.ATrail = [];
                                fitem.RGP.AFinal = [];
                                fitem.RGP.ADisFinal = [];
                                angular.forEach(fcitem.InvestigationDetails, function (citem) {
                                    if (citem.SubInvestigationId == 1) {
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != ''
                                            || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != ''
                                            || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            fitem.RGP.Wearing.push(citem);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != ''
                                            || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != '' || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != ''
                                            || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '' || citem.AdvancedRefractionRemarks != '') {
                                            fitem.RGP.AWearing.push(citem);
                                        }
                                    }
                                    else if (citem.SubInvestigationId == 2) {
                                        /*fitem.SLP.Trail.push(citem);*/
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != ''
                                            || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != ''
                                            || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            fitem.RGP.Trail.push(citem);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != ''
                                            || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != '' || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != ''
                                            || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '' || citem.AdvancedRefractionRemarks != '') {
                                            fitem.RGP.ATrail.push(citem);
                                        }
                                    }
                                    else if (citem.SubInvestigationId == 3) {
                                        //    fitem.SLP.Final.push(citem)
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != ''
                                            || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != ''
                                            || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            fitem.RGP.Final.push(citem);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != ''
                                            || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != '' || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != ''
                                            || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '' || citem.AdvancedRefractionRemarks != '') {
                                            fitem.RGP.AFinal.push(citem);
                                        }
                                    }
                                    else if (citem.SubInvestigationId == 4) {
                                        //    fitem.SLP.DisFinal.push(citem);
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != ''
                                            || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != ''
                                            || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            fitem.RGP.DisFinal.push(citem);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != ''
                                            || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != '' || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != ''
                                            || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '' || citem.AdvancedRefractionRemarks != '') {
                                            fitem.RGP.ADisFinal.push(citem);
                                        }
                                    }
                                });
                            }
                        }
                    });
                });
                if ($scope.FiteredContactLensArray.length > 0) {
                    $scope.FiteredCL = angular.copy($scope.FiteredContactLensArray) || [];
                    $scope.ClfilterResults();
                }
                $scope.SummaryTab = type || 19;

            }
        }, function (err) {
            alertify.error("Fetching Data Failed!");
        });
    };


    $scope.Isshowbasic = true;
    $scope.Isshowadvance = false;
    $scope.Show = function (type) {
        if (type == 1) {
            $scope.Isshowbasic = true;
            $scope.Isshowadvance = false;
        }
        else {
            $scope.Isshowbasic = false;
            $scope.Isshowadvance = true;
        }
        $scope.SubTab = type || 1;
        //$scope.ClearClfilterResults();
    }
    $scope.CL = {
        selectedEye: 'OU',
        selectedType: 'SCL',
        popoveropen: false
    }
    $scope.ClFilterPopOpen = function () {
        $scope.CL.popoveropen = true;
    }
    $scope.ClselectedEye = '';
    $scope.CLselectedType = '';
    $scope.CLsubTypes = {
        wearing: false,
        trial: false,
        final: true,
        dispTrail: false,
    };
    $scope.ClfilterResults = function () {
        let tempcl = angular.copy($scope.FiteredCL) || [];
        if ($scope.CL.selectedType == '') {
            alertify.error('Please Select Type');
            return;
        }
        if ($scope.CL.selectedEye == '') {
            alertify.error('Please Select Organ');
            return;
        }
        if (!$scope.CLsubTypes.wearing && !$scope.CLsubTypes.trial && !$scope.CLsubTypes.final && !$scope.CLsubTypes.dispTrail) {
            alertify.error('Please Select Sub-Type');
            return;
        }
        angular.forEach(tempcl, function (fitem) {
            fitem.RGP = '';
            fitem.SLP = '';
            angular.forEach(fitem.ContactLensDetails, function (fcitem) {
                if ($scope.CL.selectedType == 'SCL') {
                    if (fcitem.InvestigationId == 2084) {
                        fitem.SLP = {};
                        if (fcitem.InvestigationDetails.length > 0) {
                            fitem.SLP.Wearing = [];
                            fitem.SLP.Trail = [];
                            fitem.SLP.Final = [];
                            fitem.SLP.DisFinal = [];
                            fitem.SLP.AWearing = [];
                            fitem.SLP.ATrail = [];
                            fitem.SLP.AFinal = [];
                            fitem.SLP.ADisFinal = [];


                            angular.forEach(fcitem.InvestigationDetails, function (citem) {
                                if (citem.SubInvestigationId == 1 && $scope.CLsubTypes.wearing) {
                                    if ($scope.CL.selectedEye == 'OD') {
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: '',
                                                BasicOSSph: '',
                                                BasicOSCyl: '',
                                                BasicOSAxis: '',
                                                BasicOSBC: '',
                                                BasicOSDia: '',
                                                BasicOSKeratometry: '',
                                                BasicOSColor: '',
                                                BasicOSProduct: '',
                                                BasicOSVaDistance: '',
                                                BasicOSVaNear: '',
                                                BasicOSVaIntermediate: '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.SLP.Wearing.push(emptyContactLensData);
                                        }

                                    }
                                    if ($scope.CL.selectedEye == 'OS') {

                                        if (citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: '',
                                                BasicODSph: '',
                                                BasicODCyl: '',
                                                BasicODAxis: '',
                                                BasicODBC: '',
                                                BasicODDia: '',
                                                BasicODKeratometry: '',
                                                BasicODColor: '',
                                                BasicODProduct: '',
                                                BasicODVaDistance: '',
                                                BasicODVaNear: '',
                                                BasicODVaIntermediate: '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.SLP.Wearing.push(emptyContactLensData);
                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OU') {

                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '' || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '' || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: citem.BasicOUVaDistance || '',
                                                BasicOUVaNear: citem.BasicOUVaDistance || '',
                                                BasicOUVaIntermediate: citem.BasicOUVaDistance || ''
                                            };
                                            fitem.SLP.Wearing.push(emptyContactLensData);
                                        }
                                    }
                                }
                                if (citem.SubInvestigationId == 2 && $scope.CLsubTypes.trial) {
                                    if ($scope.CL.selectedEye == 'OD') {
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: '',
                                                BasicOSSph: '',
                                                BasicOSCyl: '',
                                                BasicOSAxis: '',
                                                BasicOSBC: '',
                                                BasicOSDia: '',
                                                BasicOSKeratometry: '',
                                                BasicOSColor: '',
                                                BasicOSProduct: '',
                                                BasicOSVaDistance: '',
                                                BasicOSVaNear: '',
                                                BasicOSVaIntermediate: '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.SLP.Trail.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": "",
                                                "AdvancedFitOSCentration": "",
                                                "AdvancedFitOSCoverage": "",
                                                "AdvancedFitOSMovement": "",
                                                "AdvancedFitOSDegrees": "",
                                                "AdvancedFitOSDirection": "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOSSph": "",
                                                "AdvancedRefractionOSCyl": "",
                                                "AdvancedRefractionOSAxis": "",
                                                "AdvancedRefractionOSVaDistance": "",
                                                "AdvancedRefractionOSVaNear": "",
                                                "AdvancedRefractionOSVaIntermediate": "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": citem.ODSpecialInstructions || "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.SLP.ATrail.push(advanceeditobj);
                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OS') {

                                        if (citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: '',
                                                BasicODSph: '',
                                                BasicODCyl: '',
                                                BasicODAxis: '',
                                                BasicODBC: '',
                                                BasicODDia: '',
                                                BasicODKeratometry: '',
                                                BasicODColor: '',
                                                BasicODProduct: '',
                                                BasicODVaDistance: '',
                                                BasicODVaNear: '',
                                                BasicODVaIntermediate: '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.SLP.Trail.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": "",
                                                "AdvancedFitODCentration": "",
                                                "AdvancedFitODCoverage": "",
                                                "AdvancedFitODMovement": "",
                                                "AdvancedFitODDegrees": "",
                                                "AdvancedFitODDirection": "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionODSph": "",
                                                "AdvancedRefractionODCyl": "",
                                                "AdvancedRefractionODAxis": "",
                                                "AdvancedRefractionODVaDistance": "",
                                                "AdvancedRefractionODVaNear": "",
                                                "AdvancedRefractionODVaIntermediate": "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.SLP.ATrail.push(advanceeditobj);

                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OU') {

                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '' || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '' || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: citem.BasicOUVaDistance || '',
                                                BasicOUVaNear: citem.BasicOUVaDistance || '',
                                                BasicOUVaIntermediate: citem.BasicOUVaDistance || ''
                                            };
                                            fitem.SLP.Trail.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '' || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '' || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaNear": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaIntermediate": citem.AdvancedRefractionOUVaDistance || "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.SLP.ATrail.push(advanceeditobj);
                                        }
                                    }
                                }
                                if (citem.SubInvestigationId == 3 && $scope.CLsubTypes.final) {
                                    if ($scope.CL.selectedEye == 'OD') {
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: '',
                                                BasicOSSph: '',
                                                BasicOSCyl: '',
                                                BasicOSAxis: '',
                                                BasicOSBC: '',
                                                BasicOSDia: '',
                                                BasicOSKeratometry: '',
                                                BasicOSColor: '',
                                                BasicOSProduct: '',
                                                BasicOSVaDistance: '',
                                                BasicOSVaNear: '',
                                                BasicOSVaIntermediate: '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.SLP.Final.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": "",
                                                "AdvancedFitOSCentration": "",
                                                "AdvancedFitOSCoverage": "",
                                                "AdvancedFitOSMovement": "",
                                                "AdvancedFitOSDegrees": "",
                                                "AdvancedFitOSDirection": "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOSSph": "",
                                                "AdvancedRefractionOSCyl": "",
                                                "AdvancedRefractionOSAxis": "",
                                                "AdvancedRefractionOSVaDistance": "",
                                                "AdvancedRefractionOSVaNear": "",
                                                "AdvancedRefractionOSVaIntermediate": "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": citem.ODSpecialInstructions || "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.SLP.AFinal.push(advanceeditobj);
                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OS') {

                                        if (citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: '',
                                                BasicODSph: '',
                                                BasicODCyl: '',
                                                BasicODAxis: '',
                                                BasicODBC: '',
                                                BasicODDia: '',
                                                BasicODKeratometry: '',
                                                BasicODColor: '',
                                                BasicODProduct: '',
                                                BasicODVaDistance: '',
                                                BasicODVaNear: '',
                                                BasicODVaIntermediate: '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.SLP.Final.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": "",
                                                "AdvancedFitODCentration": "",
                                                "AdvancedFitODCoverage": "",
                                                "AdvancedFitODMovement": "",
                                                "AdvancedFitODDegrees": "",
                                                "AdvancedFitODDirection": "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionODSph": "",
                                                "AdvancedRefractionODCyl": "",
                                                "AdvancedRefractionODAxis": "",
                                                "AdvancedRefractionODVaDistance": "",
                                                "AdvancedRefractionODVaNear": "",
                                                "AdvancedRefractionODVaIntermediate": "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.SLP.AFinal.push(advanceeditobj);

                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OU') {

                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '' || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '' || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: citem.BasicOUVaDistance || '',
                                                BasicOUVaNear: citem.BasicOUVaDistance || '',
                                                BasicOUVaIntermediate: citem.BasicOUVaDistance || ''
                                            };
                                            fitem.SLP.Final.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '' || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '' || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaNear": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaIntermediate": citem.AdvancedRefractionOUVaDistance || "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.SLP.AFinal.push(advanceeditobj);
                                        }
                                    }
                                }
                                if (citem.SubInvestigationId == 4 && $scope.CLsubTypes.dispTrail) {
                                    if ($scope.CL.selectedEye == 'OD') {
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: '',
                                                BasicOSSph: '',
                                                BasicOSCyl: '',
                                                BasicOSAxis: '',
                                                BasicOSBC: '',
                                                BasicOSDia: '',
                                                BasicOSKeratometry: '',
                                                BasicOSColor: '',
                                                BasicOSProduct: '',
                                                BasicOSVaDistance: '',
                                                BasicOSVaNear: '',
                                                BasicOSVaIntermediate: '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.SLP.DisFinal.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": "",
                                                "AdvancedFitOSCentration": "",
                                                "AdvancedFitOSCoverage": "",
                                                "AdvancedFitOSMovement": "",
                                                "AdvancedFitOSDegrees": "",
                                                "AdvancedFitOSDirection": "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOSSph": "",
                                                "AdvancedRefractionOSCyl": "",
                                                "AdvancedRefractionOSAxis": "",
                                                "AdvancedRefractionOSVaDistance": "",
                                                "AdvancedRefractionOSVaNear": "",
                                                "AdvancedRefractionOSVaIntermediate": "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": citem.ODSpecialInstructions || "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.SLP.ADisFinal.push(advanceeditobj);
                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OS') {

                                        if (citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: '',
                                                BasicODSph: '',
                                                BasicODCyl: '',
                                                BasicODAxis: '',
                                                BasicODBC: '',
                                                BasicODDia: '',
                                                BasicODKeratometry: '',
                                                BasicODColor: '',
                                                BasicODProduct: '',
                                                BasicODVaDistance: '',
                                                BasicODVaNear: '',
                                                BasicODVaIntermediate: '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.SLP.DisFinal.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": "",
                                                "AdvancedFitODCentration": "",
                                                "AdvancedFitODCoverage": "",
                                                "AdvancedFitODMovement": "",
                                                "AdvancedFitODDegrees": "",
                                                "AdvancedFitODDirection": "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionODSph": "",
                                                "AdvancedRefractionODCyl": "",
                                                "AdvancedRefractionODAxis": "",
                                                "AdvancedRefractionODVaDistance": "",
                                                "AdvancedRefractionODVaNear": "",
                                                "AdvancedRefractionODVaIntermediate": "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.SLP.ADisFinal.push(advanceeditobj);

                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OU') {

                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '' || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '' || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: citem.BasicOUVaDistance || '',
                                                BasicOUVaNear: citem.BasicOUVaDistance || '',
                                                BasicOUVaIntermediate: citem.BasicOUVaDistance || ''
                                            };
                                            fitem.SLP.DisFinal.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '' || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '' || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaNear": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaIntermediate": citem.AdvancedRefractionOUVaDistance || "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.SLP.ADisFinal.push(advanceeditobj);
                                        }
                                    }
                                }

                            });
                        }
                    }
                }
                else if ($scope.CL.selectedType == 'RGP') {

                    if (fcitem.InvestigationId == 2078) {
                        fitem.RGP = {};
                        if (fcitem.InvestigationDetails.length > 0) {
                            fitem.RGP.Wearing = [];
                            fitem.RGP.Trail = [];
                            fitem.RGP.Final = [];
                            fitem.RGP.DisFinal = [];
                            fitem.RGP.AWearing = [];
                            fitem.RGP.ATrail = [];
                            fitem.RGP.AFinal = [];
                            fitem.RGP.ADisFinal = [];
                            angular.forEach(fcitem.InvestigationDetails, function (citem) {
                                if (citem.SubInvestigationId == 1 && $scope.CLsubTypes.wearing) {
                                    if ($scope.CL.selectedEye == 'OD') {
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: '',
                                                BasicOSSph: '',
                                                BasicOSCyl: '',
                                                BasicOSAxis: '',
                                                BasicOSBC: '',
                                                BasicOSDia: '',
                                                BasicOSKeratometry: '',
                                                BasicOSColor: '',
                                                BasicOSProduct: '',
                                                BasicOSVaDistance: '',
                                                BasicOSVaNear: '',
                                                BasicOSVaIntermediate: '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.RGP.Wearing.push(emptyContactLensData);
                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OS') {

                                        if (citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: '',
                                                BasicODSph: '',
                                                BasicODCyl: '',
                                                BasicODAxis: '',
                                                BasicODBC: '',
                                                BasicODDia: '',
                                                BasicODKeratometry: '',
                                                BasicODColor: '',
                                                BasicODProduct: '',
                                                BasicODVaDistance: '',
                                                BasicODVaNear: '',
                                                BasicODVaIntermediate: '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };

                                            fitem.RGP.Wearing.push(emptyContactLensData);
                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OU') {


                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '' || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '' || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: citem.BasicOUVaDistance || '',
                                                BasicOUVaNear: citem.BasicOUVaDistance || '',
                                                BasicOUVaIntermediate: citem.BasicOUVaDistance || ''
                                            };
                                            fitem.RGP.Wearing.push(emptyContactLensData);
                                        }
                                    }
                                }
                                if (citem.SubInvestigationId == 2 && $scope.CLsubTypes.trial) {
                                    if ($scope.CL.selectedEye == 'OD') {
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: '',
                                                BasicOSSph: '',
                                                BasicOSCyl: '',
                                                BasicOSAxis: '',
                                                BasicOSBC: '',
                                                BasicOSDia: '',
                                                BasicOSKeratometry: '',
                                                BasicOSColor: '',
                                                BasicOSProduct: '',
                                                BasicOSVaDistance: '',
                                                BasicOSVaNear: '',
                                                BasicOSVaIntermediate: '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.RGP.Trail.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": "",
                                                "AdvancedFitOSCentration": "",
                                                "AdvancedFitOSCoverage": "",
                                                "AdvancedFitOSMovement": "",
                                                "AdvancedFitOSDegrees": "",
                                                "AdvancedFitOSDirection": "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOSSph": "",
                                                "AdvancedRefractionOSCyl": "",
                                                "AdvancedRefractionOSAxis": "",
                                                "AdvancedRefractionOSVaDistance": "",
                                                "AdvancedRefractionOSVaNear": "",
                                                "AdvancedRefractionOSVaIntermediate": "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": citem.ODSpecialInstructions || "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.RGP.Trail.push(advanceeditobj);
                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OS') {

                                        if (citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: '',
                                                BasicODSph: '',
                                                BasicODCyl: '',
                                                BasicODAxis: '',
                                                BasicODBC: '',
                                                BasicODDia: '',
                                                BasicODKeratometry: '',
                                                BasicODColor: '',
                                                BasicODProduct: '',
                                                BasicODVaDistance: '',
                                                BasicODVaNear: '',
                                                BasicODVaIntermediate: '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.RGP.Trail.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": "",
                                                "AdvancedFitODCentration": "",
                                                "AdvancedFitODCoverage": "",
                                                "AdvancedFitODMovement": "",
                                                "AdvancedFitODDegrees": "",
                                                "AdvancedFitODDirection": "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionODSph": "",
                                                "AdvancedRefractionODCyl": "",
                                                "AdvancedRefractionODAxis": "",
                                                "AdvancedRefractionODVaDistance": "",
                                                "AdvancedRefractionODVaNear": "",
                                                "AdvancedRefractionODVaIntermediate": "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.RGP.ATrail.push(advanceeditobj);

                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OU') {

                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '' || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '' || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: citem.BasicOUVaDistance || '',
                                                BasicOUVaNear: citem.BasicOUVaDistance || '',
                                                BasicOUVaIntermediate: citem.BasicOUVaDistance || ''
                                            };
                                            fitem.RGP.Trail.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '' || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '' || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaNear": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaIntermediate": citem.AdvancedRefractionOUVaDistance || "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.RGP.ATrail.push(advanceeditobj);
                                        }
                                    }
                                }
                                if (citem.SubInvestigationId == 3 && $scope.CLsubTypes.final) {
                                    if ($scope.CL.selectedEye == 'OD') {
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: '',
                                                BasicOSSph: '',
                                                BasicOSCyl: '',
                                                BasicOSAxis: '',
                                                BasicOSBC: '',
                                                BasicOSDia: '',
                                                BasicOSKeratometry: '',
                                                BasicOSColor: '',
                                                BasicOSProduct: '',
                                                BasicOSVaDistance: '',
                                                BasicOSVaNear: '',
                                                BasicOSVaIntermediate: '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.RGP.Final.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": "",
                                                "AdvancedFitOSCentration": "",
                                                "AdvancedFitOSCoverage": "",
                                                "AdvancedFitOSMovement": "",
                                                "AdvancedFitOSDegrees": "",
                                                "AdvancedFitOSDirection": "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOSSph": "",
                                                "AdvancedRefractionOSCyl": "",
                                                "AdvancedRefractionOSAxis": "",
                                                "AdvancedRefractionOSVaDistance": "",
                                                "AdvancedRefractionOSVaNear": "",
                                                "AdvancedRefractionOSVaIntermediate": "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": citem.ODSpecialInstructions || "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.RGP.AFinal.push(advanceeditobj);
                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OS') {

                                        if (citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: '',
                                                BasicODSph: '',
                                                BasicODCyl: '',
                                                BasicODAxis: '',
                                                BasicODBC: '',
                                                BasicODDia: '',
                                                BasicODKeratometry: '',
                                                BasicODColor: '',
                                                BasicODProduct: '',
                                                BasicODVaDistance: '',
                                                BasicODVaNear: '',
                                                BasicODVaIntermediate: '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.RGP.Final.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": "",
                                                "AdvancedFitODCentration": "",
                                                "AdvancedFitODCoverage": "",
                                                "AdvancedFitODMovement": "",
                                                "AdvancedFitODDegrees": "",
                                                "AdvancedFitODDirection": "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionODSph": "",
                                                "AdvancedRefractionODCyl": "",
                                                "AdvancedRefractionODAxis": "",
                                                "AdvancedRefractionODVaDistance": "",
                                                "AdvancedRefractionODVaNear": "",
                                                "AdvancedRefractionODVaIntermediate": "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.RGP.AFinal.push(advanceeditobj);

                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OU') {

                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '' || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '' || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: citem.BasicOUVaDistance || '',
                                                BasicOUVaNear: citem.BasicOUVaDistance || '',
                                                BasicOUVaIntermediate: citem.BasicOUVaDistance || ''
                                            };
                                            fitem.RGP.Final.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '' || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '' || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaNear": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaIntermediate": citem.AdvancedRefractionOUVaDistance || "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.RGP.AFinal.push(advanceeditobj);
                                        }
                                    }
                                }
                                if (citem.SubInvestigationId == 4 && $scope.CLsubTypes.dispTrail) {
                                    if ($scope.CL.selectedEye == 'OD') {
                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: '',
                                                BasicOSSph: '',
                                                BasicOSCyl: '',
                                                BasicOSAxis: '',
                                                BasicOSBC: '',
                                                BasicOSDia: '',
                                                BasicOSKeratometry: '',
                                                BasicOSColor: '',
                                                BasicOSProduct: '',
                                                BasicOSVaDistance: '',
                                                BasicOSVaNear: '',
                                                BasicOSVaIntermediate: '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.RGP.DisFinal.push(emptyContactLensData);

                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": "",
                                                "AdvancedFitOSCentration": "",
                                                "AdvancedFitOSCoverage": "",
                                                "AdvancedFitOSMovement": "",
                                                "AdvancedFitOSDegrees": "",
                                                "AdvancedFitOSDirection": "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOSSph": "",
                                                "AdvancedRefractionOSCyl": "",
                                                "AdvancedRefractionOSAxis": "",
                                                "AdvancedRefractionOSVaDistance": "",
                                                "AdvancedRefractionOSVaNear": "",
                                                "AdvancedRefractionOSVaIntermediate": "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": citem.ODSpecialInstructions || "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.RGP.ADisFinal.push(advanceeditobj);
                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OS') {

                                        if (citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: '',
                                                BasicODSph: '',
                                                BasicODCyl: '',
                                                BasicODAxis: '',
                                                BasicODBC: '',
                                                BasicODDia: '',
                                                BasicODKeratometry: '',
                                                BasicODColor: '',
                                                BasicODProduct: '',
                                                BasicODVaDistance: '',
                                                BasicODVaNear: '',
                                                BasicODVaIntermediate: '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: '',
                                                BasicOUVaNear: '',
                                                BasicOUVaIntermediate: ''
                                            };
                                            fitem.RGP.DisFinal.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": "",
                                                "AdvancedFitODCentration": "",
                                                "AdvancedFitODCoverage": "",
                                                "AdvancedFitODMovement": "",
                                                "AdvancedFitODDegrees": "",
                                                "AdvancedFitODDirection": "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionODSph": "",
                                                "AdvancedRefractionODCyl": "",
                                                "AdvancedRefractionODAxis": "",
                                                "AdvancedRefractionODVaDistance": "",
                                                "AdvancedRefractionODVaNear": "",
                                                "AdvancedRefractionODVaIntermediate": "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": "",
                                                "AdvancedRefractionOUVaNear": "",
                                                "AdvancedRefractionOUVaIntermediate": "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.RGP.ADisFinal.push(advanceeditobj);

                                        }
                                    }
                                    if ($scope.CL.selectedEye == 'OU') {

                                        if (citem.BasicODDesignType != '' || citem.BasicODSph != '' || citem.BasicODCyl != '' || citem.BasicODAxis != '' || citem.BasicODBC != ''
                                            || citem.BasicODDia != '' || citem.BasicODKeratometry != '' || citem.BasicODColor != '' || citem.BasicODProduct != ''
                                            || citem.BasicODVaDistance != '' || citem.BasicODVaNear != '' || citem.BasicODVaIntermediate != '' || citem.BasicOSDesignType != '' || citem.BasicOSSph != '' || citem.BasicOSCyl != '' || citem.BasicOSAxis != '' || citem.BasicOSBC != ''
                                            || citem.BasicOSDia != '' || citem.BasicOSKeratometry != '' || citem.BasicOSColor != '' || citem.BasicOSProduct != ''
                                            || citem.BasicOSVaDistance != '' || citem.BasicOSVaNear != '' || citem.BasicOSVaIntermediate != '' || citem.BasicOUVaDistance != '' || citem.BasicOUVaNear != '' || citem.BasicOUVaIntermediate != '') {
                                            let emptyContactLensData = {
                                                BasicODDesignType: citem.BasicODDesignType || '',
                                                BasicODSph: citem.BasicODSph || '',
                                                BasicODCyl: citem.BasicODCyl || '',
                                                BasicODAxis: citem.BasicODAxis || '',
                                                BasicODBC: citem.BasicODBC || '',
                                                BasicODDia: citem.BasicODDia || '',
                                                BasicODKeratometry: citem.BasicODKeratometry || '',
                                                BasicODColor: citem.BasicODColor || '',
                                                BasicODProduct: citem.BasicODProduct || '',
                                                BasicODVaDistance: citem.BasicODVaDistance || '',
                                                BasicODVaNear: citem.BasicODVaNear || '',
                                                BasicODVaIntermediate: citem.BasicODVaIntermediate || '',
                                                BasicOSDesignType: citem.BasicOSDesignType || '',
                                                BasicOSSph: citem.BasicOSSph || '',
                                                BasicOSCyl: citem.BasicOSCyl || '',
                                                BasicOSAxis: citem.BasicOSAxis || '',
                                                BasicOSBC: citem.BasicOSBC || '',
                                                BasicOSDia: citem.BasicOSDia || '',
                                                BasicOSKeratometry: citem.BasicOSKeratometry || '',
                                                BasicOSColor: citem.BasicOSColor || '',
                                                BasicOSProduct: citem.BasicOSProduct || '',
                                                BasicOSVaDistance: citem.BasicOSVaDistance || '',
                                                BasicOSVaNear: citem.BasicOSVaNear || '',
                                                BasicOSVaIntermediate: citem.BasicOSVaIntermediate || '',
                                                BasicOUVaDistance: citem.BasicOUVaDistance || '',
                                                BasicOUVaNear: citem.BasicOUVaDistance || '',
                                                BasicOUVaIntermediate: citem.BasicOUVaDistance || ''
                                            };
                                            fitem.RGP.DisFinal.push(emptyContactLensData);
                                        }
                                        if (citem.AdvancedFitODCentration != '' || citem.AdvancedFitODComfort != '' || citem.AdvancedFitODCoverage != '' || citem.AdvancedFitODDegrees != '' || citem.AdvancedFitODDirection != ''
                                            || citem.AdvancedFitODMovement != '' || citem.AdvancedRefractionODAxis != '' || citem.AdvancedRefractionODCyl != '' || citem.AdvancedRefractionODSph != '' || citem.AdvancedRefractionODVaDistance != ''
                                            || citem.AdvancedRefractionODVaIntermediate != '' || citem.AdvancedRefractionODVaNear != '' || citem.AdvancedRefractionOSAxis != '' || citem.AdvancedRefractionOSCyl != '' || citem.AdvancedRefractionOSSph != ''
                                            || citem.AdvancedRefractionOSVaDistance != '' || citem.AdvancedRefractionOSVaIntermediate != '' || citem.AdvancedRefractionOSVaNear != ''
                                            || citem.AdvancedFitOSDegrees != '' || citem.AdvancedFitOSDirection != '' || citem.AdvancedFitOSMovement != '' ||
                                            citem.AdvancedFitOSCentration != '' || citem.AdvancedFitOSComfort != '' || citem.AdvancedFitOSCoverage != '' || citem.AdvancedRefractionOUVaDistance != '' || citem.AdvancedRefractionOUVaIntermediate != '' || citem.AdvancedRefractionOUVaNear != '') {
                                            let advanceeditobj = {
                                                "AdvancedFitODComfort": citem.AdvancedFitODComfort || "",
                                                "AdvancedFitODCentration": citem.AdvancedFitODCentration || "",
                                                "AdvancedFitODCoverage": citem.AdvancedFitODCoverage || "",
                                                "AdvancedFitODMovement": citem.AdvancedFitODMovement || "",
                                                "AdvancedFitODDegrees": citem.AdvancedFitODDegrees || "",
                                                "AdvancedFitODDirection": citem.AdvancedFitODDirection || "",
                                                "AdvancedFitOSComfort": citem.AdvancedFitOSComfort || "",
                                                "AdvancedFitOSCentration": citem.AdvancedFitOSCentration || "",
                                                "AdvancedFitOSCoverage": citem.AdvancedFitOSCoverage || "",
                                                "AdvancedFitOSMovement": citem.AdvancedFitOSMovement || "",
                                                "AdvancedFitOSDegrees": citem.AdvancedFitOSDegrees || "",
                                                "AdvancedFitOSDirection": citem.AdvancedFitOSDirection || "",
                                                "AdvancedRefractionODSph": citem.AdvancedRefractionODSph || "",
                                                "AdvancedRefractionODCyl": citem.AdvancedRefractionODCyl || "",
                                                "AdvancedRefractionODAxis": citem.AdvancedRefractionODAxis || "",
                                                "AdvancedRefractionODVaDistance": citem.AdvancedRefractionODVaDistance || "",
                                                "AdvancedRefractionODVaNear": citem.AdvancedRefractionODVaNear || "",
                                                "AdvancedRefractionODVaIntermediate": citem.AdvancedRefractionODVaIntermediate || "",
                                                "AdvancedRefractionOSSph": citem.AdvancedRefractionOSSph || "",
                                                "AdvancedRefractionOSCyl": citem.AdvancedRefractionOSCyl || "",
                                                "AdvancedRefractionOSAxis": citem.AdvancedRefractionOSAxis || "",
                                                "AdvancedRefractionOSVaDistance": citem.AdvancedRefractionOSVaDistance || "",
                                                "AdvancedRefractionOSVaNear": citem.AdvancedRefractionOSVaNear || "",
                                                "AdvancedRefractionOSVaIntermediate": citem.AdvancedRefractionOSVaIntermediate || "",
                                                "AdvancedRefractionOUVaDistance": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaNear": citem.AdvancedRefractionOUVaDistance || "",
                                                "AdvancedRefractionOUVaIntermediate": citem.AdvancedRefractionOUVaDistance || "",
                                                "ODSpecialInstructions": "",
                                                "OSSpecialInstructions": "",
                                                "AdvancedRefractionRemarks": "",
                                            }
                                            fitem.RGP.ADisFinal.push(advanceeditobj);
                                        }
                                    }
                                }


                            });
                        }
                    }
                }

            });
        });

        $scope.FiteredContactLensArray = angular.copy(tempcl) || [];
        $scope.CL.popoveropen = false;
    };
    $scope.ClearClfilterResults = function () {
        $scope.FiteredContactLensArray = angular.copy($scope.FiteredCL) || [];
        $scope.CL = {
            selectedEye: '',
            selectedType: '',
            "popoveropen": false,
        }
        $scope.CLsubTypes = {
            wearing: false,
            trial: false,
            final: false,
            dispTrail: false,
        };

    }
    $scope.ChangesstatusSoftLens = function (item, statusid) {
        if (statusid == 1) {
            item.showstatus = !item.showstatus;
        } else {
            item.showAdvancestatus = !item.showAdvancestatus;
        }
    }

}]).value('duScrollBottomSpy', true).value('duScrollActiveClass', 'active').value('duScrollOffset', 10);
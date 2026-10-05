eHnoteWebApp.controller("EhnoteVisionHistoryPopUpCtrl", ["$scope", "eHnotePatientDataService", "$timeout", "alertify", "Investigation", "$uibModalInstance", "cache", "eHnoteMasterDataService", "eHnoteCacheStorageService", "$filter", "unaidedInvestigation", "aidedInvestigation", "pinholeInvestigation", "CategoryId", "InvestigationId", "Type", "aidedClInvestigation", function ($scope, eHnotePatientDataService, $timeout, alertify, Investigation, $uibModalInstance, cache, eHnoteMasterDataService, eHnoteCacheStorageService, $filter, unaidedInvestigation, aidedInvestigation, pinholeInvestigation, CategoryId, InvestigationId, Type,aidedClInvestigation) {


    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.SelectedList = cache.visions;
    $scope.SelectedInvestigation = Investigation;
    console.log(JSON.stringify($scope.SelectedInvestigation));
    $scope.SelectedunaidedInvestigation = unaidedInvestigation;
    $scope.SelectedaidedInvestigation = aidedInvestigation;
    $scope.SelectedaidedCLInvestigation = aidedClInvestigation;
    $scope.SelectedpinholeInvestigation = pinholeInvestigation;
    $scope.InvestigationDetails = $scope.SelectedInvestigation;
    $scope.CategoryId = CategoryId;
    $scope.InvestigationId = InvestigationId;
    $scope.Type = Type;
    $scope.InvestigationDetails.Htmlvisions = [];
    $scope.tempVisions = [];
    //$scope.InvestigationDetails.Htmltonometry = [];
   // $scope.tempTonometry = [];
   
    $scope.PreviousInvestigations = [];

    function checkval(val) {
        return val && val !== "" ? true : false;
    }

    function GetAllInvestigationsvision(resp) {
        var object = {};
        $scope.InvestigationDetails.Htmlvisions = [];
        $scope.InvestigationDetails.Htmlvisions.push(resp);
        angular.forEach($scope.InvestigationDetails.Htmlvisions, function (item, index) {
            if (index === 0 || index === 1 || index === 11) {
                item.Active = "Y";
            } else {
                item.Active = "N";
            }

            if (item.InvestigationId === 1) { //Ar
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "InvestigationOrgans": [
                        {
                            "InvestigationOrganID": 1,
                            "InvestigationOrganDesc": "RightEye",
                            "InvestigationAttributes": {
                                "Cylindrical": item.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                "Spherical": item.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                "Axis": item.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                "Adition": ""
                            }
                        },
                        {
                            "InvestigationOrganID": 2,
                            "InvestigationOrganDesc": "LeftEye",
                            "InvestigationAttributes": {
                                "Cylindrical": item.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                "Spherical": item.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                "Axis": item.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                "Adition": ""
                            }
                        }
                    ]
                };
                $scope.tempInvestigationOrgans = [];
                angular.forEach(item.InvestigationOrgans, function (item2, ind2) {
                    if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "") {
                        $scope.tempInvestigationOrgans.push(item2);
                    }
                });
                if ($scope.tempInvestigationOrgans.length !== 0) {
                    $scope.tempVisions.push(object);
                }
            }

            if (item.InvestigationId === 2) { //refraction
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "InvestigationOrgans": [
                        {
                            "InvestigationOrganID": 1,
                            "InvestigationOrganDesc": "RightEye",
                            "ISbinaclurDone": item.InvestigationOrgans[0].ISbinaclurDone || false,
                            "InvestigationAttributes": {
                                "Spherical": item.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                "Cylindrical": item.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                "Axis": item.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                "Adition": item.InvestigationOrgans[0].InvestigationAttributes.Adition,
                                "BCVA": item.InvestigationOrgans[0].InvestigationAttributes.BCVA,
                                "BCNVA": item.InvestigationOrgans[0].InvestigationAttributes.BCNVA
                            }
                        },
                        {
                            "InvestigationOrganID": 2,
                            "InvestigationOrganDesc": "LeftEye",
                            "ISbinaclurDone": item.InvestigationOrgans[0].ISbinaclurDone || false,
                            "InvestigationAttributes": {
                                "Spherical": item.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                "Cylindrical": item.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                "Axis": item.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                "Adition": item.InvestigationOrgans[1].InvestigationAttributes.Adition,
                                "BCVA": item.InvestigationOrgans[1].InvestigationAttributes.BCVA,
                                "BCNVA": item.InvestigationOrgans[1].InvestigationAttributes.BCNVA
                            }
                        }
                    ]
                };
                $scope.tempInvestigationOrgans = [];
                angular.forEach(item.InvestigationOrgans, function (item2, ind2) {
                    if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "" || item2.InvestigationAttributes.BCVA !== "" || item2.InvestigationAttributes.BCNVA !== "" || (item2.ISbinaclurDone && item2.InvestigationOrganID == 1)) {
                        $scope.tempInvestigationOrgans.push(item2);
                    }
                });
                if ($scope.tempInvestigationOrgans.length !== 0) {
                    $scope.tempVisions.push(object);
                }
              
            }
            if (item.InvestigationId === 3) { //Cycloplegic Refraction
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "InvestigationOrgans": [
                        {
                            "InvestigationOrganID": 1,
                            "InvestigationOrganDesc": "RightEye",
                            "SolutionUsed": item.InvestigationOrgans[0].SolutionUsed,
                            "InvestigationAttributes": {
                                "Spherical": item.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                "Cylindrical": item.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                "Axis": item.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                "Adition": "",
                                "BCVA": item.InvestigationOrgans[0].InvestigationAttributes.BCVA,
                            }
                        },
                        {
                            "InvestigationOrganID": 2,
                            "InvestigationOrganDesc": "LeftEye",
                            "SolutionUsed": item.InvestigationOrgans[1].SolutionUsed,
                            "InvestigationAttributes": {
                                "Spherical": item.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                "Cylindrical": item.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                "Axis": item.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                "Adition": "",
                                "BCVA": item.InvestigationOrgans[1].InvestigationAttributes.BCVA,
                            }
                        }
                    ]
                };
                $scope.tempInvestigationOrgans = [];
                angular.forEach(item.InvestigationOrgans, function (item2, ind2) {
                    if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "" || item2.InvestigationAttributes.BCVA !== "" || (item2.SolutionUsed !== "" && item2.InvestigationOrganID == 1)) {
                        $scope.tempInvestigationOrgans.push(item2);
                    }
                });
                if ($scope.tempInvestigationOrgans.length !== 0) {
                    $scope.tempVisions.push(object);
                }
              
            }
            if (item.InvestigationId === 4) {//Unaided
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "Attributes": {
                        "distanceVision": {
                            "RightEye": item.Attributes.distanceVision.RightEye,
                            "LeftEye": item.Attributes.distanceVision.LeftEye
                        },
                        "NearVision": {
                            "RightEye": item.Attributes.NearVision.RightEye,
                            "LeftEye": item.Attributes.NearVision.LeftEye
                        }
                    }
                };
                if (checkval(item.Attributes.NearVision.LeftEye) || checkval(item.Attributes.NearVision.RightEye)  || checkval(item.Attributes.distanceVision.LeftEye) || checkval(item.Attributes.distanceVision.RightEye)) {
                    $scope.tempVisions.push(object);
                }
                
            }
            if (item.InvestigationId === 5) {//Aided
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "Attributes": {
                        "distanceVision": {
                            "RightEye": item.Attributes.distanceVision.RightEye,
                            "LeftEye": item.Attributes.distanceVision.LeftEye
                        },
                        "NearVision": {
                            "RightEye": item.Attributes.NearVision.RightEye,
                            "LeftEye": item.Attributes.NearVision.LeftEye
                        }
                    }
                };

                if (checkval(item.Attributes.NearVision.LeftEye) || checkval(item.Attributes.NearVision.RightEye) || checkval(item.Attributes.distanceVision.LeftEye) || checkval(item.Attributes.distanceVision.RightEye)) {
                    $scope.tempVisions.push(object);
                }
                
            }
            if (item.InvestigationId === 2071) {//AidedCL
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "Attributes": {
                        "distanceVision": {
                            "RightEye": item.Attributes.distanceVision.RightEye,
                            "LeftEye": item.Attributes.distanceVision.LeftEye
                        },
                        "NearVision": {
                            "RightEye": item.Attributes.NearVision.RightEye,
                            "LeftEye": item.Attributes.NearVision.LeftEye
                        }
                    }
                };

                if (checkval(item.Attributes.NearVision.LeftEye) || checkval(item.Attributes.NearVision.RightEye) || checkval(item.Attributes.distanceVision.LeftEye) || checkval(item.Attributes.distanceVision.RightEye)) {
                    $scope.tempVisions.push(object);
                }
                
            }
            if (item.InvestigationId === 6) {//cyclo Acceptance
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationID": item.InvestigationId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "InvestigationOrgans": [
                          {
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
                $scope.tempVisions.push(object);
            }
            if (item.InvestigationId === 7) { //acceptance
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationID": item.InvestigationId,
                    "InvestigationDesc": item.InvestigationDesc,
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
                $scope.tempVisions.push(object);
            }
            if (item.InvestigationId === 8) { //LCVA
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "InvestigationOrgans": [
                         {
                             "InvestigationOrganID": 1,
                             "InvestigationOrganDesc": "RightEye",
                             "InvestigationAttributes": {
                                 "Cylindrical": item.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                 "Spherical": item.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                 "Axis": item.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                 "Adition": ""
                             }
                         },
                         {
                             "InvestigationOrganID": 2,
                             "InvestigationOrganDesc": "LeftEye",
                             "InvestigationAttributes": {
                                 "Cylindrical": item.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                 "Spherical": item.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                 "Axis": item.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                 "Adition": ""
                             }
                         }
                    ]
                };
                $scope.tempInvestigationOrgans = [];
                angular.forEach(item.InvestigationOrgans, function (item2, ind2) {
                    if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "") {
                        $scope.tempInvestigationOrgans.push(item2);
                    }
                });
                if ($scope.tempInvestigationOrgans.length !== 0) {
                    $scope.tempVisions.push(object);
                }
                
            }
            if (item.InvestigationId === 9) { //BCVA
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationID": item.InvestigationId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "Value": "",
                    "Remarks": "",
                    "Attributes": {
                        "RightEye": "",
                        "LeftEye": "",
                        "NotesRightEye": "",
                        "NotesLeftEye": ""
                    }
                };
                $scope.tempVisions.push(object);
            }
            if (item.InvestigationId === 10) { //BINOCULAR
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": "N",
                    "InvestigationOrgans": [
                        {
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
                $scope.tempVisions.push(object);
            }
            if (item.InvestigationId === 11) { //KERETOMETER
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "InvestigationOrgans": [
                        {
                            "InvestigationOrganID": 1,
                            "InvestigationOrganDesc": "RightEye",
                            "InvestigationAttributes": {
                                "RHorizontalAxis": item.InvestigationOrgans[0].InvestigationAttributes.HorizontalAxis,
                                "RHorizontalNewAxis": item.InvestigationOrgans[0].InvestigationAttributes.HorizontalNewAxis,
                                "RVerticalAxis": item.InvestigationOrgans[0].InvestigationAttributes.VerticalAxis,
                                "RVerticalNewAxis": item.InvestigationOrgans[0].InvestigationAttributes.VerticalNewAxis,
                                "RAverageKeretometerValue": item.InvestigationOrgans[0].InvestigationAttributes.AverageKeretometerValue,
                                "RCylindricalValue": item.InvestigationOrgans[0].InvestigationAttributes.CylindricalValue
                            }
                        },
                        {
                            "InvestigationOrganID": 2,
                            "InvestigationOrganDesc": "LeftEye",
                            "InvestigationAttributes": {
                                "LHorizontalAxis": item.InvestigationOrgans[1].InvestigationAttributes.HorizontalAxis,
                                "LHorizontalNewAxis": item.InvestigationOrgans[1].InvestigationAttributes.HorizontalNewAxis,
                                "LVerticalAxis": item.InvestigationOrgans[1].InvestigationAttributes.VerticalAxis,
                                "LVerticalNewAxis": item.InvestigationOrgans[1].InvestigationAttributes.VerticalNewAxis,
                                "LAverageKeretometerValue": item.InvestigationOrgans[1].InvestigationAttributes.AverageKeretometerValue,
                                "LCylindricalValue": item.InvestigationOrgans[1].InvestigationAttributes.CylindricalValue
                            }
                        }
                    ]
                };
                $scope.tempInvestigationOrgans = [];
                angular.forEach(item.InvestigationOrgans, function (item2, ind2) {
                    if (item2.InvestigationAttributes.HorizontalAxis !== "" || item2.InvestigationAttributes.VerticalAxis !== "" || item2.InvestigationAttributes.HorizontalNewAxis !== "" || item2.InvestigationAttributes.VerticalNewAxis !== "") {
                        $scope.tempInvestigationOrgans.push(item2);
                    }
                });
                if ($scope.tempInvestigationOrgans.length !== 0) {
                    $scope.tempVisions.push(object);
                }
               
            }

            if (item.InvestigationId === 12) {//ocular
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "Value": item.Value,
                    "Remarks": item.Remarks,
                    "Attributes": {
                        "RightEye": "",
                        "LeftEye": "",
                        "NotesRightEye": "",
                        "NotesLeftEye": ""
                    }
                };
                if (item.Value !== "" && item.Value !== undefined) {
                    $scope.tempVisions.push(object);
                }
               
            }

            if (item.InvestigationId === 13) {//pinhole
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "Attributes": {
                        "RightEye": item.Attributes.RightEye,
                        "LeftEye": item.Attributes.LeftEye
                    }
                };
                if (object.Attributes.RightEye != "" || object.Attributes.LeftEye != "")
                {
                    $scope.tempVisions.push(object);
                }
               
            }

            if (item.InvestigationId === 19) {
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "BeforeDilation": {
                        "RightEye": item.BeforeDilation.RightEye,
                        "LeftEye": item.BeforeDilation.LeftEye,
                        "Time": item.BeforeDilation.Time
                    },
                    "AfterDilation": {
                        "RightEye": item.AfterDilation.RightEye,
                        "LeftEye": item.AfterDilation.LeftEye,
                        "Time": item.AfterDilation.Time
                    },
                    "Active": item.Active
                };
                if (item.BeforeDilation !== "" || item.AfterDilation !== "") {
                    if (item.BeforeDilation.RightEye !== "" || item.BeforeDilation.LeftEye !== "" || item.BeforeDilation.Time !== "" || item.AfterDilation.RightEye !== "" || item.AfterDilation.LeftEye !== "" || item.AfterDilation.Time !== "") {
                        $scope.tempVisions.push(object);
                    }
                }
            }
            if (item.InvestigationId === 20) {
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "BeforeDilation": {
                        "RightEye": item.BeforeDilation.RightEye,
                        "LeftEye": item.BeforeDilation.LeftEye,
                        "Time": item.BeforeDilation.Time
                    },
                    "AfterDilation": {
                        "RightEye": item.AfterDilation.RightEye,
                        "LeftEye": item.AfterDilation.LeftEye,
                        "Time": item.AfterDilation.Time
                    },
                    "Active": item.Active
                };
                if (item.BeforeDilation !== "" || item.AfterDilation !== "") {
                    if (item.BeforeDilation.RightEye !== "" || item.BeforeDilation.LeftEye !== "" || item.BeforeDilation.Time !== "" || item.AfterDilation.RightEye !== "" || item.AfterDilation.LeftEye !== "" || item.AfterDilation.Time !== "") {
                        $scope.tempVisions.push(object);
                    }
                }
            }
            if (item.InvestigationId === 21) {
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "BeforeDilation": {
                        "RightEye": item.BeforeDilation.RightEye,
                        "LeftEye": item.BeforeDilation.LeftEye,
                        "Time": item.BeforeDilation.Time
                    },
                    "AfterDilation": {
                        "RightEye": item.AfterDilation.RightEye,
                        "LeftEye": item.AfterDilation.LeftEye,
                        "Time": item.AfterDilation.Time
                    },
                    "Active": item.Active
                };
                if (item.BeforeDilation !== "" || item.AfterDilation !== "") {
                    if (item.BeforeDilation.RightEye !== "" || item.BeforeDilation.LeftEye !== "" || item.BeforeDilation.Time !== "" || item.AfterDilation.RightEye !== "" || item.AfterDilation.LeftEye !== "" || item.AfterDilation.Time !== "") {
                        $scope.tempVisions.push(object);
                    }
                }
            }
            if (item.InvestigationId === 22) {
                item.BeforeDilationValue = item.BeforeDilationValue || "";
                item.AfterDilationValue = item.AfterDilationValue || "";
                if (item.BeforeDilationValue !== "" || item.AfterDilationValue !== "") {
                    if (item.BeforeDilationValue !== "") {
                        var obj =
                        {
                            "RightEye": item.BeforeDilationValue,
                            "LeftEye": item.BeforeDilationValue
                        }
                        item.BeforeDilation = obj;
                    }
                    if (item.AfterDilationValue !== "") {
                        var obj =
                        {
                            "RightEye": item.AfterDilationValue,
                            "LeftEye": item.AfterDilationValue
                        }
                        item.AfterDilation = obj;
                    }

                }
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    //"BeforeDilationValue": item.BeforeDilationValue,
                    //"AfterDilationValue": item.AfterDilationValue,
                    "BeforeDilation": {
                        "RightEye": item.BeforeDilation.RightEye,
                        "LeftEye": item.BeforeDilation.LeftEye
                    },
                    "AfterDilation": {
                        "RightEye": item.AfterDilation.RightEye,
                        "LeftEye": item.AfterDilation.LeftEye
                    },
                    "Active": item.Active
                };
               
                if (item.BeforeDilation !== "" || item.AfterDilation !== "") {
                    if (item.BeforeDilation.RightEye !== "" || item.BeforeDilation.LeftEye !== ""  || item.AfterDilation.RightEye !== "" || item.AfterDilation.LeftEye !== "") {
                        $scope.tempVisions.push(object);
                    }
                }
            }
            if (item.InvestigationId === 2088) { //Post Mydriatic Test
                object = {
                    "RowID": item.InvestigationId,
                    "InvestigationId": item.InvestigationId,
                    "CategoryId": item.CategoryId,
                    "InvestigationDesc": item.InvestigationDesc,
                    "Active": item.Active,
                    "InvestigationOrgans": [
                        {
                            "InvestigationOrganID": 1,
                            "InvestigationOrganDesc": "RightEye",
                            "InvestigationAttributes": {
                                "Spherical": item.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                "Cylindrical": item.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                "Axis": item.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                "Adition": item.InvestigationOrgans[0].InvestigationAttributes.Adition,
                                "BCVA": item.InvestigationOrgans[0].InvestigationAttributes.BCVA,
                                "BCNVA": item.InvestigationOrgans[0].InvestigationAttributes.BCNVA
                            }
                        },
                        {
                            "InvestigationOrganID": 2,
                            "InvestigationOrganDesc": "LeftEye",
                            "InvestigationAttributes": {
                                "Spherical": item.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                "Cylindrical": item.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                "Axis": item.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                "Adition": item.InvestigationOrgans[1].InvestigationAttributes.Adition,
                                "BCVA": item.InvestigationOrgans[1].InvestigationAttributes.BCVA,
                                "BCNVA": item.InvestigationOrgans[1].InvestigationAttributes.BCNVA
                            }
                        }
                    ]
                };
                $scope.tempInvestigationOrgans = [];
                angular.forEach(item.InvestigationOrgans, function (item2, ind2) {
                    if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "" || item2.InvestigationAttributes.BCVA !== "" || item2.InvestigationAttributes.BCNVA !== "" || (item2.ISbinaclurDone && item2.InvestigationOrganID == 1)) {
                        $scope.tempInvestigationOrgans.push(item2);
                    }
                });
                if ($scope.tempInvestigationOrgans.length !== 0) {
                    $scope.tempVisions.push(object);
                }

            }
        });
        $scope.InvestigationDetails.Htmlvisions = angular.copy($scope.tempVisions);
    }

    

    $scope.GetPreviousInvestigationData=function(item)
    {
        var obj = {
            "CategoryId": item.CategoryId || $scope.CategoryId,
            "InvestigationId": item.InvestigationId,
            "PatientId": $scope.cacheStorageItem.patientid
        }
        eHnotePatientDataService.GetPreviousInvestigationData(obj).then(function (resp) {
        //    if (resp.data.Status === 2) {
        //        alertify.error(resp.data.Message);
        //        return;
            //    }
            $scope.PreviousInvestigations = [];
            $scope.PreviousInvestigations = resp.data;
            if($scope.PreviousInvestigations.length > 0)
            {
                $scope.loadPreviousData();
            }
        //}, function (err) {
        //    alertify.error("Getting WorkShopList Failed");
        //    console.log(err);
        });
    }

    $scope.init = function () {
        GetAllInvestigationsvision($scope.InvestigationDetails);
        //GetAllTonometryInvestigation($scope.InvestigationDetails);
        $scope.GetPreviousInvestigationData($scope.InvestigationDetails);
    };
    $scope.init();

    $scope.loadPreviousData = function () {

        $scope.PreviousARArray = [];

        $scope.PreviousUnaidedArray = [];
        $scope.PreviousAidedArray = [];
        $scope.PreviousAidedClArray = [];
        $scope.PreviousPinholeArray = [];
        $scope.PreviousRefractionArray = [];
        $scope.PreviousCycloRefractionArray = [];
        $scope.PreviousLcvaArray = [];
        $scope.PreviousKeretometerArray = [];
        $scope.PreviousOcularDArray = [];
        $scope.PreviousNonContactTonometryArray = [];
        $scope.PreviousApplanationTonometryArray = [];
        $scope.PreviousContactTonometryArray = [];
        $scope.PreviousTonometryDigitalDArray = [];
        $scope.PreviousPostMydriaticTestArray = [];


        if ($scope.PreviousInvestigations.length > 0) {
            angular.forEach($scope.PreviousInvestigations, function (item, index) {
                if (item.CategoryID === 1) {
                    if (item.InvestigationId === 1) {
                                    object = {
                                        "RowID": 1,
                                        "InvestigationId": item.InvestigationId,
                                        "InvestigationDesc": item.InvestigationDesc,
                                        "Active": "Y",
                                        "InvestigationOrgans": item.InvestigationOrgans,
                                        "AppointmentDate": item.AppointmentDate,
                                        "CategoryId": item.CategoryID
                                    };
                                    $scope.PreviousARArray.push(object);
                                }
                    if (item.InvestigationId === 2) {
                                    object = {
                                        "RowID": 2,
                                        "InvestigationId": item.InvestigationId,
                                        "InvestigationDesc": item.InvestigationDesc,
                                        "Active": "Y",
                                        "InvestigationOrgans": item.InvestigationOrgans,
                                        "AppointmentDate": item.AppointmentDate
                                    };

                                    $scope.PreviousRefractionArray.push(object);
                                }
                    if (item.InvestigationId === 3) {
                                    object = {
                                        "RowID": 3,
                                        "InvestigationId": item.InvestigationId,
                                        "InvestigationDesc": item.InvestigationDesc,
                                        "Active": "Y",
                                        "InvestigationOrgans": item.InvestigationOrgans,
                                        "AppointmentDate": item.AppointmentDate
                                    };
                                    $scope.PreviousCycloRefractionArray.push(object);
                                }
                    if (item.InvestigationId === 4) {
                                    object = {
                                        "RowID": 4,
                                        "InvestigationId": item.InvestigationId,
                                        "InvestigationDesc": item.InvestigationDesc,
                                        "Active": "Y",
                                        "Attributes": item.Attributes,
                                        "AppointmentDate": item.AppointmentDate
                                    };
                                    $scope.PreviousUnaidedArray.push(object);
                                }
                    if (item.InvestigationId === 5) {
                                    object = {
                                        "RowID": 5,
                                        "InvestigationId": item.InvestigationId,
                                        "InvestigationDesc": item.InvestigationDesc,
                                        "Active": "Y",
                                        "Attributes": item.Attributes,
                                        "AppointmentDate": item.AppointmentDate
                                    };
                                    $scope.PreviousAidedArray.push(object);
                    }
                    if (item.InvestigationId === 2071) {
                                    object = {
                                        "RowID": 2071,
                                        "InvestigationId": item.InvestigationId,
                                        "InvestigationDesc": item.InvestigationDesc,
                                        "Active": "Y",
                                        "Attributes": item.Attributes,
                                        "AppointmentDate": item.AppointmentDate
                                    };
                        $scope.PreviousAidedClArray.push(object);
                                }
                                
                    if (item.InvestigationId === 8) {
                                    object = {
                                        "RowID": 8,
                                        "InvestigationId": item.InvestigationId,
                                        "InvestigationDesc": item.InvestigationDesc,
                                        "Active": "Y",
                                        "InvestigationOrgans": item.InvestigationOrgans,
                                        "AppointmentDate": item.AppointmentDate
                                    };

                                    $scope.tempInvestigationOrgans = [];
                                    angular.forEach(item.InvestigationOrgans, function (item2, ind2) {
                                        if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "") {
                                            $scope.tempInvestigationOrgans.push(item2);
                                        }
                                    });
                                    if ($scope.tempInvestigationOrgans.length !== 0) {
                                        $scope.PreviousLcvaArray.push(object);
                                    }
                                    
                                }
                                
                               
                    if (item.InvestigationId === 11) {
                                    object = {
                                        "RowID": 11,
                                        "InvestigationId": item.InvestigationId,
                                        "InvestigationDesc": item.InvestigationDesc,
                                        "Active": "Y",
                                        "InvestigationOrgans": item.InvestigationOrgans,
                                        "AppointmentDate": item.AppointmentDate
                                    };
                                    $scope.PreviousKeretometerArray.push(object);
                                }

                    if (item.InvestigationId === 12) {
                                    object = {
                                        "RowID": 12,
                                        "InvestigationId": item.InvestigationId,
                                        "InvestigationDesc": item.InvestigationDesc,
                                        "Active": "Y",
                                        "Value": item.Value,
                                        "Remarks": item.Remarks,
                                        "AppointmentDate": item.AppointmentDate
                                    };
                                    if (item.Value != "" && item.Value !=undefined) {
                                        $scope.PreviousOcularDArray.push(object);
                                    }
                                   
                                }
                    if (item.InvestigationId === 13) {
                                    object = {
                                        "RowID": 13,
                                        "InvestigationId": item.InvestigationId,
                                        "InvestigationDesc": item.InvestigationDesc,
                                        "Active": "Y",
                                        "Attributes": item.Attributes,
                                        "AppointmentDate": item.AppointmentDate
                                    };
                                    $scope.PreviousPinholeArray.push(object);
                    }

                    if (item.InvestigationId === 2088) {
                        object = {
                            "RowID": 2088,
                            "InvestigationId": item.InvestigationId,
                            "InvestigationDesc": item.InvestigationDesc,
                            "Active": "Y",
                            "InvestigationOrgans": item.InvestigationOrgans,
                            "AppointmentDate": item.AppointmentDate
                        };

                        $scope.PreviousPostMydriaticTestArray.push(object);
                    }
                }
                if (item.CategoryID === 4) {
                    if (item.InvestigationId === 19) {
                        object = {
                            "RowID": 1,
                            "InvestigationId": item.InvestigationId,
                            "InvestigationDesc": item.InvestigationDesc,
                            "Active": "Y",
                            "BeforeDilation": item.BeforeDilation,
                            "AfterDilation": item.AfterDilation,
                            "AppointmentDate": item.AppointmentDate
                        };

                        $scope.PreviousNonContactTonometryArray.push(object);
                    }
                    if (item.InvestigationId === 20) {
                        object = {
                            "RowID": 1,
                            "InvestigationId": item.InvestigationId,
                            "InvestigationDesc": item.InvestigationDesc,
                            "Active": "Y",
                            "BeforeDilation": item.BeforeDilation,
                            "AfterDilation": item.AfterDilation,
                            "AppointmentDate": item.AppointmentDate
                        };
                        $scope.PreviousApplanationTonometryArray.push(object);
                    }
                    if (item.InvestigationId === 21) {
                        object = {
                            "RowID": 1,
                            "InvestigationId": item.InvestigationId,
                            "InvestigationDesc": item.InvestigationDesc,
                            "Active": "Y",
                            "BeforeDilation": item.BeforeDilation,
                            "AfterDilation": item.AfterDilation,
                            "AppointmentDate": item.AppointmentDate
                        };
                        $scope.PreviousContactTonometryArray.push(object);
                    }
                    if (item.InvestigationId === 22) {
                        item.BeforeDilationValue = item.BeforeDilationValue || "";
                        item.AfterDilationValue = item.AfterDilationValue || "";
                        if (item.BeforeDilationValue !== "") {
                            var obj =
                            {
                                "RightEye": item.BeforeDilationValue,
                                "LeftEye": item.BeforeDilationValue
                            }
                            item.BeforeDilation = obj;
                        }
                        if (item.AfterDilationValue !== "") {
                            var obj =
                            {
                                "RightEye": item.AfterDilationValue,
                                "LeftEye": item.AfterDilationValue
                            }
                            item.AfterDilation = obj;
                        }

                        object = {
                            "RowID": 1,
                            "InvestigationId": item.InvestigationId,
                            "InvestigationDesc": item.InvestigationDesc,
                            "Active": "Y",
                            //"BeforeDilationValue": item.BeforeDilationValue,
                            //"AfterDilationValue": item.AfterDilationValue,
                            "BeforeDilation": item.BeforeDilation,
                            "AfterDilation": item.AfterDilation,
                            "AppointmentDate": item.AppointmentDate
                        };
                        $scope.PreviousTonometryDigitalDArray.push(object);
                    }
                }
            });
        }
    }



    $scope.showUnaidedModel = false;
    $scope.showAidedModel = false;
    $scope.showBCVAModel = false;
    $scope.showPinholeModel = false;
    $scope.showRefractionModel = false;
    $scope.showCycloRefractionModel = false;
    $scope.showLCVAModel = false;
    $scope.showAcceptenceModel = false;
    $scope.showCycloAcceptenceModel = false;
    $scope.showBinocularModel = false;
    $scope.showKeretometerModel = false;

    $scope.selectedComapreInvID = "";
    $scope.compareVisionInvestigation = function (invobj) {
        if (invobj.InvestigationId == 1) {


            if (invobj.Attributes.distanceVision.RightEye == "" && invobj.Attributes.distanceVision.LeftEye == "" && invobj.Attributes.distanceVision.Both == ""
                && invobj.Attributes.NearVision.RightEye == "" && invobj.Attributes.NearVision.LeftEye == "" && invobj.Attributes.NearVision.Both == ""
                ) {
                alertify.error("Please Enter Values To Compare");
                return false;

            } else {

                $scope.showUnaidedModel = true;
                $scope.selectedComapreInvID = invobj.InvestigationId;



                if ($scope.PreviousUnaidedArray.length > 0) {

                    var appdate = new Date();
                    var formattedappdate = $filter('date')(new Date(appdate), "yyyy-MM-dd");
                    invobj.AppointmentDate = formattedappdate;
                    $scope.CompareDummyUnaidedArray = [];
                    $scope.CompareDummyUnaidedArray = angular.copy($scope.PreviousUnaidedArray);

                    $scope.CompareDummyUnaidedArray.unshift(invobj);
                    $scope.selectedFirstUnaidedItem = $scope.CompareDummyUnaidedArray[0];
                    $scope.selectedSecondUnaidedItem = $scope.CompareDummyUnaidedArray[1];


                    $scope.comapareUnaidedArray = [];
                    $scope.comapareUnaidedDistanceObject = {
                        "ObjectName": "Distance",
                        "FirstR": "",
                        "FirstL": "",
                        "FirstB": "",
                        "SecondR": "",
                        "SecondL": "",
                        "SecondB": ""
                    }

                    $scope.comapareUnaidedDistanceObject.FirstR = invobj.Attributes.distanceVision.RightEye;
                    $scope.comapareUnaidedDistanceObject.FirstL = invobj.Attributes.distanceVision.LeftEye;
                    $scope.comapareUnaidedDistanceObject.FirstB = invobj.Attributes.distanceVision.Both;
                    $scope.comapareUnaidedDistanceObject.SecondR = $scope.CompareDummyUnaidedArray[1].Attributes.distanceVision.RightEye;
                    $scope.comapareUnaidedDistanceObject.SecondL = $scope.CompareDummyUnaidedArray[1].Attributes.distanceVision.LeftEye;
                    $scope.comapareUnaidedDistanceObject.SecondB = $scope.CompareDummyUnaidedArray[1].Attributes.distanceVision.Both;

                    $scope.comapareUnaidedNearObject = {
                        "ObjectName": "Near",
                        "FirstR": "",
                        "FirstL": "",
                        "FirstB": "",
                        "SecondR": "",
                        "SecondL": "",
                        "SecondB": ""
                    }

                    $scope.comapareUnaidedNearObject.FirstR = invobj.Attributes.NearVision.RightEye;
                    $scope.comapareUnaidedNearObject.FirstL = invobj.Attributes.NearVision.LeftEye;
                    $scope.comapareUnaidedNearObject.FirstB = invobj.Attributes.NearVision.Both;
                    $scope.comapareUnaidedNearObject.SecondR = $scope.CompareDummyUnaidedArray[1].Attributes.NearVision.RightEye;
                    $scope.comapareUnaidedNearObject.SecondL = $scope.CompareDummyUnaidedArray[1].Attributes.NearVision.LeftEye;
                    $scope.comapareUnaidedNearObject.SecondB = $scope.CompareDummyUnaidedArray[1].Attributes.NearVision.Both;
                    $scope.comapareUnaidedArray.push($scope.comapareUnaidedNearObject)
                    $scope.comapareUnaidedArray.push($scope.comapareUnaidedDistanceObject);


                }

            }



        }
        if (invobj.InvestigationId == 2) {

            if (invobj.Attributes.RightEye == "" && invobj.Attributes.LeftEye == "") {
                alertify.error("Please Enter Values To Compare");
                return false;

            }
            else {


                $scope.showPinholeModel = true;
                $scope.selectedComapreInvID = invobj.InvestigationID;


                if ($scope.PreviousPinholeArray.length > 0) {

                    var appdate = new Date();
                    var formattedappdate = $filter('date')(new Date(appdate), "yyyy-MM-dd");
                    invobj.AppointmentDate = formattedappdate;
                    $scope.CompareDummyPinholeArray = [];
                    $scope.CompareDummyPinholeArray = angular.copy($scope.PreviousPinholeArray);

                    $scope.CompareDummyPinholeArray.unshift(invobj);
                    $scope.selectedFirstPinholeItem = $scope.CompareDummyPinholeArray[0];
                    $scope.selectedSecondPinholeItem = $scope.CompareDummyPinholeArray[1];


                    $scope.comaparePinholeObject = "";
                    $scope.comaparePinholeObject = {
                        "ObjectName": "Pinhole",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": "",
                    }

                    $scope.comaparePinholeObject.FirstR = invobj.Attributes.RightEye;
                    $scope.comaparePinholeObject.FirstL = invobj.Attributes.LeftEye;
                    $scope.comaparePinholeObject.SecondR = $scope.CompareDummyPinholeArray[1].Attributes.RightEye;
                    $scope.comaparePinholeObject.SecondL = $scope.CompareDummyPinholeArray[1].Attributes.LeftEye;

                }

            }
        }
        if (invobj.InvestigationId == 3) {

            if (invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical == "" &&
             invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical == ""
              && invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical == ""
             && invobj.InvestigationOrgans[0].InvestigationAttributes.Axis == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Axis == ""

                  && invobj.InvestigationOrgans[0].InvestigationAttributes.Adition == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Adition == ""

                ) {
                alertify.error("Please Enter Values To Compare");
                return false;

            }
            else {


                $scope.showRefractionModel = true;
                $scope.selectedComapreInvID = invobj.InvestigationID;

                if ($scope.PreviousRefractionArray.length > 0) {

                    var appdate = new Date();
                    var formattedappdate = $filter('date')(new Date(appdate), "yyyy-MM-dd");
                    invobj.AppointmentDate = formattedappdate;


                    $scope.CompareDummyRefArray = [];
                    $scope.CompareDummyRefArray = angular.copy($scope.PreviousRefractionArray);
                    $scope.CompareDummyRefArray.unshift(invobj);
                    $scope.selectedFirstRefItem = $scope.CompareDummyRefArray[0];
                    $scope.selectedSecondRefItem = $scope.CompareDummyRefArray[1];

                    $scope.comapareRefArray = [];
                    $scope.comapareRefSphericalObject = {
                        "ObjectName": "Spherical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareRefSphericalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical;
                    $scope.comapareRefSphericalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical;
                    $scope.comapareRefSphericalObject.SecondR = $scope.CompareDummyRefArray[1].InvestigationOrgans[0].InvestigationAttributes.Spherical;
                    $scope.comapareRefSphericalObject.SecondL = $scope.CompareDummyRefArray[1].InvestigationOrgans[1].InvestigationAttributes.Spherical;


                    $scope.comapareRefCylindricalObject = {
                        "ObjectName": "Cylindrical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareRefCylindricalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareRefCylindricalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical;
                    $scope.comapareRefCylindricalObject.SecondR = $scope.CompareDummyRefArray[1].InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareRefCylindricalObject.SecondL = $scope.CompareDummyRefArray[1].InvestigationOrgans[1].InvestigationAttributes.Cylindrical;


                    $scope.comapareRefAxisObject = {
                        "ObjectName": "Axis",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareRefAxisObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareRefAxisObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Axis;
                    $scope.comapareRefAxisObject.SecondR = $scope.CompareDummyRefArray[1].InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareRefAxisObject.SecondL = $scope.CompareDummyRefArray[1].InvestigationOrgans[1].InvestigationAttributes.Axis;


                    $scope.comapareRefAditionObject = {
                        "ObjectName": "Adition",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareRefAditionObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Adition;
                    $scope.comapareRefAditionObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Adition;
                    $scope.comapareRefAditionObject.SecondR = $scope.CompareDummyRefArray[1].InvestigationOrgans[0].InvestigationAttributes.Adition;
                    $scope.comapareRefAditionObject.SecondL = $scope.CompareDummyRefArray[1].InvestigationOrgans[1].InvestigationAttributes.Adition;

                    $scope.comapareRefArray.push($scope.comapareRefSphericalObject)
                    $scope.comapareRefArray.push($scope.comapareRefCylindricalObject);
                    $scope.comapareRefArray.push($scope.comapareRefAxisObject);
                    $scope.comapareRefArray.push($scope.comapareRefAditionObject);


                }

            }
        }
        if (invobj.InvestigationId == 4) {


            if (invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical == "" &&
             invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical == ""
              && invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical == ""
             && invobj.InvestigationOrgans[0].InvestigationAttributes.Axis == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Axis == ""
                   && invobj.InvestigationOrgans[0].InvestigationAttributes.Adition == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Adition == ""

                ) {
                alertify.error("Please Enter Values To Compare");
                return false;

            }
            else {
                $scope.showCycloRefractionModel = true;
                $scope.selectedComapreInvID = invobj.InvestigationId;

                if ($scope.PreviousCycloRefractionArray.length > 0) {

                    var appdate = new Date();
                    var formattedappdate = $filter('date')(new Date(appdate), "yyyy-MM-dd");
                    invobj.AppointmentDate = formattedappdate;


                    $scope.CompareDummyCycloRefArray = [];
                    $scope.CompareDummyCycloRefArray = angular.copy($scope.PreviousCycloRefractionArray);
                    $scope.CompareDummyCycloRefArray.unshift(invobj);
                    $scope.selectedFirstCycloRefItem = $scope.CompareDummyCycloRefArray[0];
                    $scope.selectedSecondCycloRefItem = $scope.CompareDummyCycloRefArray[1];




                    $scope.comapareCycloRefArray = [];
                    $scope.comapareCycloRefSphericalObject = {
                        "ObjectName": "Spherical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareCycloRefSphericalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical;
                    $scope.comapareCycloRefSphericalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical;
                    $scope.comapareCycloRefSphericalObject.SecondR = $scope.CompareDummyCycloRefArray[1].InvestigationOrgans[0].InvestigationAttributes.Spherical;
                    $scope.comapareCycloRefSphericalObject.SecondL = $scope.CompareDummyCycloRefArray[1].InvestigationOrgans[1].InvestigationAttributes.Spherical;


                    $scope.comapareCycloRefCylindricalObject = {
                        "ObjectName": "Cylindrical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareCycloRefCylindricalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareCycloRefCylindricalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical;
                    $scope.comapareCycloRefCylindricalObject.SecondR = $scope.CompareDummyCycloRefArray[1].InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareCycloRefCylindricalObject.SecondL = $scope.CompareDummyCycloRefArray[1].InvestigationOrgans[1].InvestigationAttributes.Cylindrical;


                    $scope.comapareCycloRefAxisObject = {
                        "ObjectName": "Axis",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareCycloRefAxisObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareCycloRefAxisObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Axis;
                    $scope.comapareCycloRefAxisObject.SecondR = $scope.CompareDummyCycloRefArray[1].InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareCycloRefAxisObject.SecondL = $scope.CompareDummyCycloRefArray[1].InvestigationOrgans[1].InvestigationAttributes.Axis;




                    $scope.comapareCycloRefAditionObject = {
                        "ObjectName": "Adition",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareCycloRefAditionObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Adition;
                    $scope.comapareCycloRefAditionObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Adition;
                    $scope.comapareCycloRefAditionObject.SecondR = $scope.CompareDummyCycloRefArray[1].InvestigationOrgans[0].InvestigationAttributes.Adition;
                    $scope.comapareCycloRefAditionObject.SecondL = $scope.CompareDummyCycloRefArray[1].InvestigationOrgans[1].InvestigationAttributes.Adition;





                    $scope.comapareCycloRefArray.push($scope.comapareCycloRefSphericalObject)
                    $scope.comapareCycloRefArray.push($scope.comapareCycloRefCylindricalObject);
                    $scope.comapareCycloRefArray.push($scope.comapareCycloRefAxisObject);
                    $scope.comapareCycloRefArray.push($scope.comapareCycloRefAditionObject);

                }
            }
        }
        if (invobj.InvestigationId == 5) {

            if (invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical == "" &&
            invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical == ""
             && invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical == ""
            && invobj.InvestigationOrgans[0].InvestigationAttributes.Axis == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Axis == "" && invobj.InvestigationOrgans[0].InvestigationAttributes.Adition == ""
                && invobj.InvestigationOrgans[1].InvestigationAttributes.Adition == ""

               ) {
                alertify.error("Please Enter Values To Compare");
                return false;

            }
            else {

                $scope.showAcceptenceModel = true;
                $scope.selectedComapreInvID = invobj.InvestigationId;


                if ($scope.PreviousAcceptanceArray.length > 0) {

                    var appdate = new Date();
                    var formattedappdate = $filter('date')(new Date(appdate), "yyyy-MM-dd");
                    invobj.AppointmentDate = formattedappdate;


                    $scope.CompareDummyAcceptArray = [];
                    $scope.CompareDummyAcceptArray = angular.copy($scope.PreviousAcceptanceArray);
                    $scope.CompareDummyAcceptArray.unshift(invobj);
                    $scope.selectedFirstAcceptItem = $scope.CompareDummyAcceptArray[0];
                    $scope.selectedSecondAcceptItem = $scope.CompareDummyAcceptArray[1];




                    $scope.comapareAcceptArray = [];
                    $scope.comapareAcceptSphericalObject = {
                        "ObjectName": "Spherical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareAcceptSphericalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                    $scope.comapareAcceptSphericalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical;
                    $scope.comapareAcceptSphericalObject.SecondR = $scope.CompareDummyAcceptArray[1].InvestigationOrgans[0].InvestigationAttributes.Spherical;
                    $scope.comapareAcceptSphericalObject.SecondL = $scope.CompareDummyAcceptArray[1].InvestigationOrgans[1].InvestigationAttributes.Spherical;


                    $scope.comapareAcceptCylindricalObject = {
                        "ObjectName": "Cylindrical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareAcceptCylindricalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareAcceptCylindricalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical;
                    $scope.comapareAcceptCylindricalObject.SecondR = $scope.CompareDummyAcceptArray[1].InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareAcceptCylindricalObject.SecondL = $scope.CompareDummyAcceptArray[1].InvestigationOrgans[1].InvestigationAttributes.Cylindrical;


                    $scope.comapareAcceptAxisObject = {
                        "ObjectName": "Axis",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareAcceptAxisObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareAcceptAxisObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Axis;
                    $scope.comapareAcceptAxisObject.SecondR = $scope.CompareDummyAcceptArray[1].InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareAcceptAxisObject.SecondL = $scope.CompareDummyAcceptArray[1].InvestigationOrgans[1].InvestigationAttributes.Axis;

                    $scope.comapareAcceptAditionObject = {
                        "ObjectName": "Adition",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareAcceptAditionObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Adition;
                    $scope.comapareAcceptAditionObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Adition;
                    $scope.comapareAcceptAditionObject.SecondR = $scope.CompareDummyAcceptArray[1].InvestigationOrgans[0].InvestigationAttributes.Adition;
                    $scope.comapareAcceptAditionObject.SecondL = $scope.CompareDummyAcceptArray[1].InvestigationOrgans[1].InvestigationAttributes.Adition;

                    $scope.comapareAcceptArray.push($scope.comapareAcceptSphericalObject)
                    $scope.comapareAcceptArray.push($scope.comapareAcceptCylindricalObject);
                    $scope.comapareAcceptArray.push($scope.comapareAcceptAxisObject);
                    $scope.comapareAcceptArray.push($scope.comapareAcceptAditionObject);



                }
            }
        }

        if (invobj.InvestigationId == 6) {


            if (invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical == "" &&
           invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical == ""
            && invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical == ""
           && invobj.InvestigationOrgans[0].InvestigationAttributes.Axis == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Axis == "" && invobj.InvestigationOrgans[0].InvestigationAttributes.Adition == "" &&
                invobj.InvestigationOrgans[1].InvestigationAttributes.Adition == ""

              ) {
                alertify.error("Please Enter Values To Compare");
                return false;

            }
            else {


                $scope.showCycloAcceptenceModel = true;
                $scope.selectedComapreInvID = invobj.InvestigationId;

                if ($scope.PreviousCycloAcceptanceArray.length > 0) {

                    var appdate = new Date();
                    var formattedappdate = $filter('date')(new Date(appdate), "yyyy-MM-dd");
                    invobj.AppointmentDate = formattedappdate;


                    $scope.CompareDummyCycloAcceptArray = [];
                    $scope.CompareDummyCycloAcceptArray = angular.copy($scope.PreviousCycloAcceptanceArray);
                    $scope.CompareDummyCycloAcceptArray.unshift(invobj);
                    $scope.selectedFirstCycloAcceptItem = $scope.CompareDummyCycloAcceptArray[0];
                    $scope.selectedSecondCycloAcceptItem = $scope.CompareDummyCycloAcceptArray[1];




                    $scope.comapareCycloAcceptArray = [];
                    $scope.comapareCycloAcceptSphericalObject = {
                        "ObjectName": "Spherical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareCycloAcceptSphericalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical;
                    $scope.comapareCycloAcceptSphericalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical;
                    $scope.comapareCycloAcceptSphericalObject.SecondR = $scope.CompareDummyCycloAcceptArray[1].InvestigationOrgans[0].InvestigationAttributes.Spherical;
                    $scope.comapareCycloAcceptSphericalObject.SecondL = $scope.CompareDummyCycloAcceptArray[1].InvestigationOrgans[1].InvestigationAttributes.Spherical;


                    $scope.comapareCycloAcceptCylindricalObject = {
                        "ObjectName": "Cylindrical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareCycloAcceptCylindricalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareCycloAcceptCylindricalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical;
                    $scope.comapareCycloAcceptCylindricalObject.SecondR = $scope.CompareDummyCycloAcceptArray[1].InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareCycloAcceptCylindricalObject.SecondL = $scope.CompareDummyCycloAcceptArray[1].InvestigationOrgans[1].InvestigationAttributes.Cylindrical;


                    $scope.comapareCycloAcceptAxisObject = {
                        "ObjectName": "Axis",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareCycloAcceptAxisObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareCycloAcceptAxisObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Axis;
                    $scope.comapareCycloAcceptAxisObject.SecondR = $scope.CompareDummyCycloAcceptArray[1].InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareCycloAcceptAxisObject.SecondL = $scope.CompareDummyCycloAcceptArray[1].InvestigationOrgans[1].InvestigationAttributes.Axis;

                    $scope.comapareCycloAcceptAditionObject = {
                        "ObjectName": "Adition",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareCycloAcceptAditionObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Adition;
                    $scope.comapareAcceptAditionObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Adition;
                    $scope.comapareAcceptAditionObject.SecondR = $scope.CompareDummyCycloAcceptArray[1].InvestigationOrgans[0].InvestigationAttributes.Adition;
                    $scope.comapareAcceptAditionObject.SecondL = $scope.CompareDummyCycloAcceptArray[1].InvestigationOrgans[1].InvestigationAttributes.Adition;

                    $scope.comapareCycloAcceptArray.push($scope.comapareCycloAcceptSphericalObject)
                    $scope.comapareCycloAcceptArray.push($scope.comapareCycloAcceptCylindricalObject);
                    $scope.comapareCycloAcceptArray.push($scope.comapareCycloAcceptAxisObject);
                    $scope.comapareCycloAcceptArray.push($scope.comapareCycloAcceptAditionObject);



                }
            }
        }
        if (invobj.InvestigationId == 7) {

            if (invobj.Attributes.distanceVision.RightEye == "" && invobj.Attributes.distanceVision.LeftEye == "" && invobj.Attributes.distanceVision.Both == ""
               && invobj.Attributes.NearVision.RightEye == "" && invobj.Attributes.NearVision.LeftEye == "" && invobj.Attributes.NearVision.Both == ""
               ) {
                alertify.error("Please Enter Values To Compare");
                return false;
            }
            else {

                $scope.showBCVAModel = true;
                $scope.selectedComapreInvID = invobj.InvestigationId;


                if ($scope.PreviousBcvaArray.length > 0) {

                    var appdate = new Date();
                    var formattedappdate = $filter('date')(new Date(appdate), "yyyy-MM-dd");
                    invobj.AppointmentDate = formattedappdate;


                    $scope.CompareDummyBCVAArray = [];
                    $scope.CompareDummyBCVAArray = angular.copy($scope.PreviousBcvaArray);

                    $scope.CompareDummyBCVAArray.unshift(invobj);
                    $scope.selectedFirstBCVAItem = $scope.CompareDummyBCVAArray[0];
                    $scope.selectedSecondBCVAItem = $scope.CompareDummyBCVAArray[1];




                    $scope.comapareBCVAArray = [];
                    $scope.comapareBCVADistanceObject = {
                        "ObjectName": "Distance",
                        "FirstR": "",
                        "FirstL": "",
                        "FirstB": "",
                        "SecondR": "",
                        "SecondL": "",
                        "SecondB": ""
                    }

                    $scope.comapareBCVADistanceObject.FirstR = invobj.Attributes.distanceVision.RightEye;
                    $scope.comapareBCVADistanceObject.FirstL = invobj.Attributes.distanceVision.LeftEye;
                    $scope.comapareBCVADistanceObject.FirstB = invobj.Attributes.distanceVision.Both;
                    $scope.comapareBCVADistanceObject.SecondR = $scope.CompareDummyBCVAArray[1].Attributes.distanceVision.RightEye;
                    $scope.comapareBCVADistanceObject.SecondL = $scope.CompareDummyBCVAArray[1].Attributes.distanceVision.LeftEye;
                    $scope.comapareBCVADistanceObject.SecondB = $scope.CompareDummyBCVAArray[1].Attributes.distanceVision.Both;

                    $scope.comapareBCVANearObject = {
                        "ObjectName": "Near",
                        "FirstR": "",
                        "FirstL": "",
                        "FirstB": "",
                        "SecondR": "",
                        "SecondL": "",
                        "SecondB": ""
                    }

                    $scope.comapareBCVANearObject.FirstR = invobj.Attributes.NearVision.RightEye;
                    $scope.comapareBCVANearObject.FirstL = invobj.Attributes.NearVision.LeftEye;
                    $scope.comapareBCVANearObject.FirstB = invobj.Attributes.NearVision.Both;
                    $scope.comapareBCVANearObject.SecondR = $scope.CompareDummyBCVAArray[1].Attributes.NearVision.RightEye;
                    $scope.comapareBCVANearObject.SecondL = $scope.CompareDummyBCVAArray[1].Attributes.NearVision.LeftEye;
                    $scope.comapareBCVANearObject.SecondB = $scope.CompareDummyBCVAArray[1].Attributes.NearVision.Both;
                    $scope.comapareBCVAArray.push($scope.comapareBCVANearObject)
                    $scope.comapareBCVAArray.push($scope.comapareBCVADistanceObject);


                }
            }
        }

        if (invobj.InvestigationId == 8) {

            if (invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical == "" &&
         invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical == ""
          && invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical == ""
         && invobj.InvestigationOrgans[0].InvestigationAttributes.Axis == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Axis == ""

            ) {
                alertify.error("Please Enter Values To Compare");
                return false;

            }
            else {
                $scope.showLCVAModel = true;
                $scope.selectedComapreInvID = invobj.InvestigationId;

                if ($scope.PreviousLcvaArray.length > 0) {

                    var appdate = new Date();
                    var formattedappdate = $filter('date')(new Date(appdate), "yyyy-MM-dd");
                    invobj.AppointmentDate = formattedappdate;


                    $scope.CompareDummyLCVAArray = [];
                    $scope.CompareDummyLCVAArray = angular.copy($scope.PreviousLcvaArray);
                    $scope.CompareDummyLCVAArray.unshift(invobj);
                    $scope.selectedFirstLCVAItem = $scope.CompareDummyLCVAArray[0];
                    $scope.selectedSecondLCVAItem = $scope.CompareDummyLCVAArray[1];




                    $scope.comapareLCVAArray = [];
                    $scope.comapareLcvaSphericalObject = {
                        "ObjectName": "Spherical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareLcvaSphericalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical;
                    $scope.comapareLcvaSphericalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical;
                    $scope.comapareLcvaSphericalObject.SecondR = $scope.CompareDummyLCVAArray[1].InvestigationOrgans[0].InvestigationAttributes.Spherical;
                    $scope.comapareLcvaSphericalObject.SecondL = $scope.CompareDummyLCVAArray[1].InvestigationOrgans[1].InvestigationAttributes.Spherical;


                    $scope.comapareLcvaCylindricalObject = {
                        "ObjectName": "Cylindrical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareLcvaCylindricalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareLcvaCylindricalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical;
                    $scope.comapareLcvaCylindricalObject.SecondR = $scope.CompareDummyLCVAArray[1].InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareLcvaCylindricalObject.SecondL = $scope.CompareDummyLCVAArray[1].InvestigationOrgans[1].InvestigationAttributes.Cylindrical;


                    $scope.comapareLcvaAxisObject = {
                        "ObjectName": "Axis",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareLcvaAxisObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareLcvaAxisObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Axis;
                    $scope.comapareLcvaAxisObject.SecondR = $scope.CompareDummyLCVAArray[1].InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareLcvaAxisObject.SecondL = $scope.CompareDummyLCVAArray[1].InvestigationOrgans[1].InvestigationAttributes.Axis;

                    $scope.comapareLCVAArray.push($scope.comapareLcvaSphericalObject)
                    $scope.comapareLCVAArray.push($scope.comapareLcvaCylindricalObject);
                    $scope.comapareLCVAArray.push($scope.comapareLcvafAxisObject);


                }
            }
        }

        if (invobj.InvestigationId == 10) {
            if (invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical == "" &&
         invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical == ""
          && invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical == ""
         && invobj.InvestigationOrgans[0].InvestigationAttributes.Axis == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.Axis == "" && invobj.InvestigationOrg[0].InvestigationAttributes.Adition == "" &&
              invobj.InvestigationOrg[1].InvestigationAttributes.Adition == ""

            ) {
                alertify.error("Please Enter Values To Compare");
                return false;

            }
            else {

                $scope.showBinocularModel = true;
                $scope.selectedComapreInvID = invobj.InvestigationId;

                if ($scope.PreviousBinocularArray.length > 0) {

                    var appdate = new Date();
                    var formattedappdate = $filter('date')(new Date(appdate), "yyyy-MM-dd");
                    invobj.AppointmentDate = formattedappdate;


                    $scope.CompareDummyBinocArray = [];
                    $scope.CompareDummyBinocArray = angular.copy($scope.PreviousBinocularArray);
                    $scope.CompareDummyBinocArray.unshift(invobj);
                    $scope.selectedFirstBinocItem = $scope.CompareDummyBinocArray[0];
                    $scope.selectedSecondBinocItem = $scope.CompareDummyBinocArray[1];




                    $scope.comapareBinocArray = [];
                    $scope.comapareBinocSphericalObject = {
                        "ObjectName": "Spherical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareBinocSphericalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Spherical;
                    $scope.comapareBinocSphericalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Spherical;
                    $scope.comapareBinocSphericalObject.SecondR = $scope.CompareDummyBinocArray[1].InvestigationOrgans[0].InvestigationAttributes.Spherical;
                    $scope.comapareBinocSphericalObject.SecondL = $scope.CompareDummyBinocArray[1].InvestigationOrgans[1].InvestigationAttributes.Spherical;


                    $scope.comapareBinocCylindricalObject = {
                        "ObjectName": "Cylindrical",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareBinocCylindricalObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareBinocCylindricalObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Cylindrical;
                    $scope.comapareBinocCylindricalObject.SecondR = $scope.CompareDummyBinocArray[1].InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                    $scope.comapareBinocCylindricalObject.SecondL = $scope.CompareDummyBinocArray[1].InvestigationOrgans[1].InvestigationAttributes.Cylindrical;


                    $scope.comapareBinocAxisObject = {
                        "ObjectName": "Axis",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareBinocAxisObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareBinocAxisObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Axis;
                    $scope.comapareBinocAxisObject.SecondR = $scope.CompareDummyBinocArray[1].InvestigationOrgans[0].InvestigationAttributes.Axis;
                    $scope.comapareBinocAxisObject.SecondL = $scope.CompareDummyBinocArray[1].InvestigationOrgans[1].InvestigationAttributes.Axis;

                    $scope.comapareBinocAditionObject = {
                        "ObjectName": "Adition",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareBinocAditionObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.Adition;
                    $scope.comapareBinocAditionObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.Adition;
                    $scope.comapareBinocAditionObject.SecondR = $scope.CompareDummyBinocArray[1].InvestigationOrgans[0].InvestigationAttributes.Adition;
                    $scope.comapareBinocAditionObject.SecondL = $scope.CompareDummyBinocArray[1].InvestigationOrgans[1].InvestigationAttributes.Adition;

                    $scope.comapareBinocArray.push($scope.comapareBinocSphericalObject)
                    $scope.comapareBinocArray.push($scope.comapareBinocCylindricalObject);
                    $scope.comapareBinocArray.push($scope.comapareBinocAxisObject);
                    $scope.comapareBinocArray.push($scope.comapareBinocAditionObject);



                }
            }
        }

        if (invobj.InvestigationId == 11) {
            if (invobj.InvestigationOrgans[0].InvestigationAttributes.HorizontalAxis == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.HorizontalAxis == "" && invobj.InvestigationOrgans[0].InvestigationAttributes.VerticalAxis == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.VerticalAxis == "" &&
                invobj.InvestigationOrgans[0].InvestigationAttributes.HorizontalNewAxis == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.HorizontalNewAxis == "" &&
                invobj.InvestigationOrgans[0].InvestigationAttributes.VerticalNewAxis == "" && invobj.InvestigationOrgans[1].InvestigationAttributes.VerticalNewAxis == ""
            ) {
                alertify.error("Please Enter Values To Compare");
                return false;

            }
            else {

                $scope.showKeretometerModel = true;
                $scope.selectedComapreInvID = invobj.InvestigationId;

                if ($scope.PreviousKeretometerArray.length > 0) {

                    var appdate = new Date();
                    var formattedappdate = $filter('date')(new Date(appdate), "yyyy-MM-dd");
                    invobj.AppointmentDate = formattedappdate;


                    $scope.CompareDummyKeretoArray = [];
                    $scope.CompareDummyKeretoArray = angular.copy($scope.PreviousKeretometerArray);
                    $scope.CompareDummyKeretoArray.unshift(invobj);
                    $scope.selectedFirstKeretoItem = $scope.CompareDummyKeretoArray[0];
                    $scope.selectedSecondKeretoItem = $scope.CompareDummyKeretoArray[1];




                    $scope.comapareKeretoArray = [];
                    $scope.comapareKeretoHAObject = {
                        "ObjectName": "Horizontal Axis",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareKeretoHAObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.HorizontalAxis;
                    $scope.comapareKeretoHAObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.HorizontalAxis;
                    $scope.comapareKeretoHAObject.SecondR = $scope.CompareDummyKeretoArray[1].InvestigationOrgans[0].InvestigationAttributes.HorizontalAxis;
                    $scope.comapareKeretoHAObject.SecondL = $scope.CompareDummyKeretoArray[1].InvestigationOrgans[1].InvestigationAttributes.HorizontalAxis;


                    $scope.comapareKeretoVAObject = {
                        "ObjectName": "Vertical Axis",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareKeretoVAObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.VerticalAxis;
                    $scope.comapareKeretoVAObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.VerticalAxis;
                    $scope.comapareKeretoVAObject.SecondR = $scope.CompareDummyKeretoArray[1].InvestigationOrgans[0].InvestigationAttributes.VerticalAxis;
                    $scope.comapareKeretoVAObject.SecondL = $scope.CompareDummyKeretoArray[1].InvestigationOrgans[1].InvestigationAttributes.VerticalAxis;


                    //changes

                    $scope.comapareKeretoHNewAObject = {
                        "ObjectName": "Horizontal New Axis",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareKeretoHNewAObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.HorizontalNewAxis;
                    $scope.comapareKeretoHNewAObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.HorizontalNewAxis;
                    $scope.comapareKeretoHNewAObject.SecondR = $scope.CompareDummyKeretoArray[1].InvestigationOrgans[0].InvestigationAttributes.HorizontalNewAxis;
                    $scope.comapareKeretoHNewAObject.SecondL = $scope.CompareDummyKeretoArray[1].InvestigationOrgans[1].InvestigationAttributes.HorizontalNewAxis;


                    $scope.comapareKeretoVNewAObject = {
                        "ObjectName": "Vertical New Axis",
                        "FirstR": "",
                        "FirstL": "",
                        "SecondR": "",
                        "SecondL": ""
                    }

                    $scope.comapareKeretoVNewAObject.FirstR = invobj.InvestigationOrgans[0].InvestigationAttributes.VerticalNewAxis;
                    $scope.comapareKeretoVNewAObject.FirstL = invobj.InvestigationOrgans[1].InvestigationAttributes.VerticalNewAxis;
                    $scope.comapareKeretoVNewAObject.SecondR = $scope.CompareDummyKeretoArray[1].InvestigationOrgans[0].InvestigationAttributes.VerticalNewAxis;
                    $scope.comapareKeretoVNewAObject.SecondL = $scope.CompareDummyKeretoArray[1].InvestigationOrgans[1].InvestigationAttributes.VerticalNewAxis;






                    $scope.comapareKeretoArray.push($scope.comapareKeretoHAObject);
                    $scope.comapareKeretoArray.push($scope.comapareKeretoVAObject);

                    $scope.comapareKeretoArray.push($scope.comapareKeretoHNewAObject);
                    $scope.comapareKeretoArray.push($scope.comapareKeretoVNewAObject);



                }
            }
        }

        if (invobj.InvestigationId == 30) {

            if (invobj.Attributes.distanceVision.RightEye == "" && invobj.Attributes.distanceVision.LeftEye == "" && invobj.Attributes.distanceVision.Both == ""
              && invobj.Attributes.NearVision.RightEye == "" && invobj.Attributes.NearVision.LeftEye == "" && invobj.Attributes.NearVision.Both == ""
              ) {
                alertify.error("Please Enter Values To Compare");
                return false;

            } else {
                $scope.showAidedModel = true;
                $scope.selectedComapreInvID = invobj.InvestigationId;
                if ($scope.PreviousAidedArray.length > 0) {

                    var appdate = new Date();
                    var formattedappdate = $filter('date')(new Date(appdate), "yyyy-MM-dd");
                    invobj.AppointmentDate = formattedappdate;


                    $scope.CompareDummyAidedArray = [];
                    $scope.CompareDummyAidedArray = angular.copy($scope.PreviousAidedArray);
                    $scope.CompareDummyAidedArray.unshift(invobj);
                    $scope.selectedFirstAidedItem = $scope.CompareDummyAidedArray[0];
                    $scope.selectedSecondAidedItem = $scope.CompareDummyAidedArray[1];




                    $scope.comapareAidedArray = [];
                    $scope.comapareAidedDistanceObject = {
                        "ObjectName": "Distance",
                        "FirstR": "",
                        "FirstL": "",
                        "FirstB": "",
                        "SecondR": "",
                        "SecondL": "",
                        "SecondB": ""
                    }

                    $scope.comapareAidedDistanceObject.FirstR = invobj.Attributes.distanceVision.RightEye;
                    $scope.comapareAidedDistanceObject.FirstL = invobj.Attributes.distanceVision.LeftEye;
                    $scope.comapareAidedDistanceObject.FirstB = invobj.Attributes.distanceVision.Both;
                    $scope.comapareAidedDistanceObject.SecondR = $scope.CompareDummyAidedArray[1].Attributes.distanceVision.RightEye;
                    $scope.comapareAidedDistanceObject.SecondL = $scope.CompareDummyAidedArray[1].Attributes.distanceVision.LeftEye;
                    $scope.comapareAidedDistanceObject.SecondB = $scope.CompareDummyAidedArray[1].Attributes.distanceVision.Both;

                    $scope.comapareAidedNearObject = {
                        "ObjectName": "Near",
                        "FirstR": "",
                        "FirstL": "",
                        "FirstB": "",
                        "SecondR": "",
                        "SecondL": "",
                        "SecondB": ""
                    }

                    $scope.comapareAidedNearObject.FirstR = invobj.Attributes.NearVision.RightEye;
                    $scope.comapareAidedNearObject.FirstL = invobj.Attributes.NearVision.LeftEye;
                    $scope.comapareAidedNearObject.FirstB = invobj.Attributes.NearVision.Both;
                    $scope.comapareAidedNearObject.SecondR = $scope.CompareDummyAidedArray[1].Attributes.NearVision.RightEye;
                    $scope.comapareAidedNearObject.SecondL = $scope.CompareDummyAidedArray[1].Attributes.NearVision.LeftEye;
                    $scope.comapareAidedNearObject.SecondB = $scope.CompareDummyAidedArray[1].Attributes.NearVision.Both;
                    $scope.comapareAidedArray.push($scope.comapareAidedNearObject)
                    $scope.comapareAidedArray.push($scope.comapareAidedDistanceObject);


                }
            }
        }
    }

    $scope.CloseComparePopup = function (invId) {
        $scope.selectedComapreInvID = "";
        if (invId == 1) {
            $scope.showUnaidedModel = false;
        }
        if (invId == 2) {
            $scope.showPinholeModel = false;
        }
        if (invId == 3) {
            $scope.showRefractionModel = false;
        }
        if (invId == 4) {
            $scope.showCycloRefractionModel = false;
        }
        if (invId == 5) {
            $scope.showAcceptenceModel = false;
        }
        if (invId == 6) {
            $scope.showCycloAcceptenceModel = false;
        }
        if (invId == 7) {
            $scope.showBCVAModel = false;
        }
        if (invId == 8) {
            $scope.showLCVAModel = false;
        }
        if (invId == 10) {
            $scope.showBinocularModel = false;
        }
        if (invId == 11) {
            $scope.showKeretometerModel = false;
        }
        if (invId == 30) {
            $scope.showAidedModel = false;
        }
    }


    $scope.cancel = function (type) {
        if (type === "cancel") {
            $uibModalInstance.dismiss(type);
        } else {
            $uibModalInstance.close($scope.SelectedInvestigationIdArray);
        }
    };

    $scope.CloseHistoryPopUp=function()
    {
        $scope.cancel("Ok");
    }

    $scope.CopyArOldValues = function (item)
    {
        angular.forEach($scope.cacheStorageItem.visions, function (mitem) {
            if(mitem.InvestigationId===item.InvestigationId)
            {
                mitem.InvestigationOrgans = angular.copy(item.InvestigationOrgans);
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }
        });
        $scope.CloseHistoryPopUp();
    }


    $scope.CopyAidedOldValues=function(item)
    {
        angular.forEach($scope.cacheStorageItem.visions, function (mitem) {
            if (mitem.InvestigationId === item.InvestigationId) {
                mitem.Attributes = angular.copy(item.Attributes);
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }
        });
        $scope.CloseHistoryPopUp();
    }

    $scope.CopyOcularOldValues = function (item) {
        angular.forEach($scope.cacheStorageItem.visions, function (mitem) {
            if (mitem.InvestigationId === item.InvestigationId) {
                mitem.Remarks = angular.copy(item.Remarks);
                mitem.Value = angular.copy(item.Value);
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }
        });
        $scope.CloseHistoryPopUp();
    }

    $scope.CopyTonometryOldValues = function (item) {
        angular.forEach($scope.cacheStorageItem.TonoMetry, function (mitem) {
            if (mitem.InvestigationId === item.InvestigationId) {
                mitem.BeforeDilation = angular.copy(item.BeforeDilation);
                mitem.AfterDilation = angular.copy(item.AfterDilation);
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }
        });
        $scope.CloseHistoryPopUp();
    }
    $scope.CopyTonometryDegreeOldValues = function (item) {
        angular.forEach($scope.cacheStorageItem.TonoMetry, function (mitem) {
            if (mitem.InvestigationId === item.InvestigationId) {
                mitem.BeforeDilationValue = angular.copy(item.BeforeDilationValue);
                mitem.AfterDilationValue = angular.copy(item.AfterDilationValue);
                mitem.BeforeDilationValue = mitem.BeforeDilationValue || "";
                mitem.AfterDilationValue = mitem.AfterDilationValue || "";
                if (mitem.BeforeDilationValue != "") {
                    var obj = {
                        "RightEye": mitem.BeforeDilationValue,
                        "LeftEye": mitem.BeforeDilationValue
                    }
                    mitem.BeforeDilation = obj;
                }
                if (mitem.AfterDilationValue != "") {
                    var obj = {
                        "RightEye": mitem.AfterDilationValue,
                        "LeftEye": mitem.AfterDilationValue
                    }
                    mitem.AfterDilation = obj;
                }
                mitem.BeforeDilation = angular.copy(item.BeforeDilation);
                mitem.AfterDilation = angular.copy(item.AfterDilation);
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }
        });
        $scope.CloseHistoryPopUp();
    }
}]);
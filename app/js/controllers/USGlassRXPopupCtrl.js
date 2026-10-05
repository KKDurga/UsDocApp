"use strict";
eHnoteWebApp.controller("USGlassRXPopupCtrl", ["$scope", "eHnotePatientDataService", "alertify", "$uibModalInstance", "cache", "eHnoteMasterDataService", "$filter", "$uibModal", "eHnoteDiagnosisDataServices","allUserListForPopUps",
    function ($scope, eHnotePatientDataService, alertify, $uibModalInstance, cache, eHnoteMasterDataService, $filter, $uibModal, eHnoteDiagnosisDataServices, allUserListForPopUps) {

        $scope.cacheStorageItem = cache;
        var doctorInfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.cacheStorageItem = cache;
        $scope.RoleID = doctorInfo.RoleID || 0;
        $scope.cacheStorageItem.PGPRefractionDetails = $scope.cacheStorageItem.PGPRefractionDetails || [];
        $scope.allUserList = [];
        $scope.allUserListForPopUps = allUserListForPopUps || [];
        if ($scope.allUserListForPopUps.length > 0) {
            $scope.allUserList = $scope.allUserListForPopUps || [];
            if ($scope.allUserList.length !== 0) {
                $scope.AllDoctorList = angular.copy($scope.allUserList);
                $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });

                $scope.AllTechnicianList = angular.copy($scope.allUserList);
                $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
                $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                    return item.RoleId === 10;
                });

            }


        }
        $scope.EnteredbyName = "";
        $scope.EnteredbyId = 0;
        $scope.PrescribedbyId = 0;
        $scope.PrescribedbyIdName = "";
        if ($scope.RoleID == 10) {
            angular.forEach($scope.AllTechnicianList, function (sitem) {
                if (sitem.DoctorID == doctorInfo.doctorid) {
                    $scope.EnteredbyName = sitem.FullName || "";
                    $scope.EnteredbyId = sitem.DoctorID || 0;
                }
            });
        }
        if ($scope.cacheStorageItem.AppointmentDoctorID != 0) {
            angular.forEach($scope.AllDoctorList, function (sitem) {
                if (sitem.DoctorID == $scope.cacheStorageItem.AppointmentDoctorID) {
                    $scope.PrescribedbyIdName = sitem.FullName;
                    $scope.PrescribedbyId = sitem.DoctorID;
                }
            });

        }
        $scope.GlassType = {
            "SubTab": "TypeofLens",
            "RemarksEdit": true,
            "AdditionalInformation": "",
            "AdditionalEdit": true,

        }
        $scope.FinalGlassObj =
        {
            "FinalGlassID": ""
        }
     

        $scope.SeletedRefractionIndicesObj = {
            "SelectedFGIndex": 0
        }




        function GetGlassDetailsObj() {

            return {
                "PatientFindingGlassId": 0,
                "InvestigationId": 43,
                "CategoryId": 7,
                "CategoryDesc": "Glass Prescription",
                "InvestigationDesc": "NewGlass",
                "ActiveInd": "Y",
                "RightEyeValues": {
                    "UVa": "",
                    "Cylindrical": "",
                    "Spherical": "",
                    "Axis": "",
                    "Adition": "",
                    "BCVA": "",
                    "BCNVA": "",
                    "IPD": "",
                    "Prism": "",
                    "Base": "",
                    "RPrismVt": "",
                    "RBaseVt": "",
                    "RPrismHz": "",
                    "RBaseHz": "",
                    "RType": "",
                    "RVAI": "",
                },
                "LeftEyeValues": {
                    "UVa": "",
                    "Cylindrical": "",
                    "Spherical": "",
                    "Axis": "",
                    "Adition": "",
                    "BCVA": "",
                    "BCNVA": "",
                    "IPD": "",
                    "Prism": "",
                    "Base": "",
                    "LPrismVt": "",
                    "LBaseVt": "",
                    "LPrismHz": "",
                    "LBaseHz": "",
                    "LType": "",
                    "LVAI": "",
                },
                "Remarks": "",
                "LensTypeArray": [],
                "LensCoatingArray": [],
                "ModeofwearArray": [],
                "LensMaterialArray": [],
                "FrameMaterialArray": [],
                "LensTintArray": [],
                "SpecialityLensArray": [],
                "SpecialInstructionArray": [],
                "TypeOfLensArray": [],
                "LensType": [],
                "LensCoating": [],
                /*"LensCoating": "",*/
                "Modeofwear": "",
                "LensMaterial": "",
                "FrameMaterial": "",
                "LensTint": "",
                "SpecialityLens": "",
                "SpecialInstruction": "",
                "TypeOfLens": "",
                "IsInvDataAdded": false,
                "PDDistanceOU": "",
                "PDNearOU": "",
                "ExpirationYearId": 0,
                "ExpirationYearName": "",
                "PurposeId": 0,
                "Purpose": "",
                "EnteredbyId": $scope.EnteredbyId||0,
                "EnteredbyName": $scope.EnteredbyName||"",
                "PrescribedbyId": $scope.PrescribedbyId||0,
                "PrescribedbyIdName": $scope.PrescribedbyIdName||"",
            }

        }

        function GetFGlassRxObj() {
            return {
                "PatientFindingFinalGlassRxId": 0,
                "InvestigationId": 2121,
                "CategoryId": 1,
                "CategoryDesc": "Vision",
                "InvestigationDesc": "",
                "RSpherical": "",
                "RCylindrical": "",
                "RAxis": "",
                "RAdition": "",
                "RBCVA": "",
                "RBCNVA": "",
                "RVAI": "",
                "RPrismVt": "",
                "RBaseVt": "",
                "RPrismHz": "",
                "RBaseHz": "",
                "RType": "",
                "LSpherical": "",
                "LCylindrical": "",
                "LAxis": "",
                "LAdition": "",
                "LBCVA": "",
                "LBCNVA": "",
                "LVAI": "",
                "LPrismVt": "",
                "LBaseVt": "",
                "LPrismHz": "",
                "LBaseHz": "",
                "LType": "",
                "Remarks": "",
                "Purpose": "",
                "PurposeId": 0,
                "ActiveInd": "Y",
                "PDDistanceOU": "",
                "PDNearOU": "",
                "EnteredbyId": 0,
                "EnteredbyName": "",
                "PrescribedbyId": 0,
                "PrescribedbyIdName": "",
                "ExpirationYearId": 0,
                "ExpirationYearName": ""
            }
        }

        $scope.Glassdetails = [];

        $scope.TotalGlassDetailsValuesAllowed = 4;
        $scope.TotalGlassDetailsValues = [];
        for (let i = 1; i <= $scope.TotalGlassDetailsValuesAllowed; i++) {
            $scope.TotalGlassDetailsValues.push(i);

            let glassrxobj = GetGlassDetailsObj();
           /* if (i != 4) {*/
                $scope.Glassdetails.push(glassrxobj);
            /*}*/
        }
    
 

        if ($scope.cacheStorageItem.GlassDetails.length > 0) {
            angular.forEach($scope.cacheStorageItem.GlassDetails, function (item) {
                // if (item.ActiveInd === 'Y') {
                //var selectedarray = $filter("filter")(item.LensType, { "IsActive": true }, true);
                //var selectedCoatarray = $filter("filter")(item.LensCoating, { "IsActive": true }, true);
                if (item.InvestigationId === 43) {
                    item.IsInvDataAdded = false;
                    if (item.RightEyeValues.UVa !== "" || item.RightEyeValues.Cylindrical !== "" || item.RightEyeValues.Spherical !== "" || item.RightEyeValues.Axis !== "" || item.RightEyeValues.Adition !== "" || item.RightEyeValues.BCVA !== "" || item.RightEyeValues.BCNVA !== "" || item.RightEyeValues.IPD !== "" || item.RightEyeValues.Prism !== "" || item.RightEyeValues.Base !== "" || item.LeftEyeValues.UVa !== "" || item.LeftEyeValues.Cylindrical !== "" || item.LeftEyeValues.Spherical !== "" || item.LeftEyeValues.Axis !== "" || item.LeftEyeValues.Adition !== "" || item.LeftEyeValues.BCVA !== "" || item.LeftEyeValues.BCNVA !== "" || item.LeftEyeValues.IPD !== "" || item.LeftEyeValues.Prism !== "" || item.LeftEyeValues.Base !== "" || item.Remarks != "" || item.FrameMaterial != "" || item.LensMaterial != "" || item.LensTint != "" || item.Modeofwear != "" || item.SpecialityLens != "" || item.SpecialInstruction != "" || item.RightEyeValues.RPrismVt !== "" || item.RightEyeValues.RBaseVt !== "" || item.RightEyeValues.RPrismHz !== "" || item.RightEyeValues.RBaseHz !== "" || item.LeftEyeValues.LPrismVt !== "" || item.LeftEyeValues.LBaseVt !== "" || item.LeftEyeValues.LPrismHz !== "" || item.LeftEyeValues.LBaseHz !== "") {
                        item.IsInvDataAdded = true;
                    }
                    if (item.ActiveInd === 'N') {
                        item.IsInvDataAdded = true;
                    }
                }
                //  }
            });
        }
        var eGRX = $filter("filter")($scope.cacheStorageItem.GlassDetails, function (Nitem) {
            return Nitem.InvestigationId == 43 && Nitem.ActiveInd == "Y" && Nitem.PatientFindingGlassId != 0 && Nitem.IsInvDataAdded;
        }) || [];

        if (eGRX.length > 0) {
            if ($scope.Glassdetails.length > 0) {

                for (let i = 0; i < $scope.Glassdetails.length; i++) {
                    if (eGRX[i] !== undefined) {
                        $scope.Glassdetails[i] = eGRX[i];
                    }
                }
             
            }
        }
        $scope.GlassActivestatus = function () {
            angular.forEach($scope.LensMaterialarray, function (litem) {
                litem.IsActive = false;
            });
            angular.forEach($scope.ModeOfWeararray, function (mitem) {
                mitem.IsActive = false;
            });
            angular.forEach($scope.FrameMaterialarray, function (fitem) {
                fitem.IsActive = false;
            });
            angular.forEach($scope.LensType, function (ltitem) {
                ltitem.IsActive = false;
            });
            angular.forEach($scope.LensCoating, function (lcitem) {
                lcitem.IsActive = false;
            });
        };
        $scope.GetMasterGlassRXData = function () {
            eHnoteDiagnosisDataServices.GetMasterGlassRXData().then(function (resp) {
                if (resp.data != undefined) {
                    $scope.glassRxAdditionalDetails = resp.data;
                    $scope.LensMaterialarray = [];
                    $scope.ModeOfWeararray = [];
                    $scope.FrameMaterialarray = [];
                    /* $scope.LensTypearray = [];*/
                    /*$scope.LensTypearray = [];*/
                    $scope.LensCoating = [];
                    $scope.LensType = [];

                    $scope.LensMaterialarray = angular.copy($scope.glassRxAdditionalDetails.LensMaterials);
                    $scope.ModeOfWeararray = angular.copy($scope.glassRxAdditionalDetails.ModeOfWear);
                    $scope.FrameMaterialarray = angular.copy($scope.glassRxAdditionalDetails.FrameMaterial);
                    $scope.LensCoating = angular.copy($scope.glassRxAdditionalDetails.LensCoating);
                    $scope.LensType = angular.copy($scope.glassRxAdditionalDetails.LensType);
                    $scope.GlassActivestatus();
                }
                angular.forEach($scope.Glassdetails, function (gitem) {
                    if (gitem.InvestigationId === 43) {
                        if (gitem.LensType == undefined ||gitem.LensType.length == 0 ) {
                            gitem.LensType = [];
                            gitem.LensType = angular.copy($scope.LensType)|| [];
                        } else {
                            angular.forEach(gitem.LensType, function (lgitem) {
                                angular.forEach($scope.LensType, function (sitem) {
                                    if (lgitem.Id === sitem.Id) {
                                        sitem.IsActive = true;
                                    }
                                });
                            });
                            gitem.LensType = [];
                            gitem.LensType = angular.copy($scope.LensType) || [];
                        }

                        //gitem.LensType=[];
                        //gitem.LensType = $scope.LensType||[];
                        if (gitem.LensCoating == undefined ||gitem.LensCoating.length == 0 ) {
                            gitem.LensCoating = [];
                            gitem.LensCoating = angular.copy($scope.LensCoating) || []; 
                        } else {
                            angular.forEach(gitem.LensCoating, function (lgitem) {
                                angular.forEach($scope.LensCoating, function (sitem) {
                                    if (lgitem.Id === sitem.Id) {
                                        sitem.IsActive = true;
                                    }
                                });
                            });
                            gitem.LensCoating = [];
                            gitem.LensCoating = angular.copy($scope.LensCoating) || [];
                        }
                        if (gitem.LensMaterial == undefined ||gitem.LensMaterial.length == 0 ) {
                            gitem.LensMaterialarray = [];
                            gitem.LensMaterialarray = angular.copy($scope.LensMaterialarray) || []; 
                        } else {
                            angular.forEach(gitem.LensMaterial, function (lgitem) {
                                angular.forEach($scope.LensMaterialarray, function (sitem) {
                                    if (lgitem.Id === sitem.Id) {
                                        sitem.IsActive = true;
                                        //gitem.LensMaterialarray = [];
                                        //gitem.LensMaterialarray = push(sitem);

                                    }

                                });
                            });
                            gitem.LensMaterialarray = [];
                            gitem.LensMaterialarray = angular.copy($scope.LensMaterialarray) || []; 
                        }
                        if (gitem.Modeofwear == undefined ||gitem.Modeofwear.length == 0 ) {
                            gitem.ModeOfWeararray = [];
                            gitem.ModeOfWeararray = angular.copy($scope.ModeOfWeararray) || []; 
                        } else {
                            angular.forEach(gitem.Modeofwear, function (lgitem) {
                                angular.forEach($scope.ModeOfWeararray, function (sitem) {
                                    if (lgitem.Id === sitem.Id) {
                                        sitem.IsActive = true;
                                    }
                                });
                            });
                            gitem.ModeOfWeararray = [];
                            gitem.ModeOfWeararray = angular.copy($scope.ModeOfWeararray) || [];
                        }
                        if (gitem.FrameMaterial == undefined ||gitem.FrameMaterial.length == 0 ) {
                            gitem.FrameMaterialarray = [];
                            gitem.FrameMaterialarray = angular.copy($scope.FrameMaterialarray) || [];  
                        }
                        else {
                            angular.forEach(gitem.FrameMaterial, function (lgitem) {
                                angular.forEach($scope.FrameMaterialarray, function (sitem) {
                                    if (lgitem.Id === sitem.Id) {
                                        sitem.IsActive = true;
                                    }
                                });
                            });
                            gitem.FrameMaterialarray = [];
                            gitem.FrameMaterialarray = angular.copy($scope.FrameMaterialarray) || [];
                        }

                    }
                });

            }, function (err) {
                console.log(err);
                alertify.error("Getting Categories Failed");
            });

        };
        $scope.GetMasterGlassRXData();

        $scope.changeFinalGlass = function (id, item) {

            $scope.cacheStorageItem.GlassRxRefractionDetails = $scope.cacheStorageItem.GlassRxRefractionDetails || [];

            if (id == 1) {
                var ddArray = $filter("filter")($scope.cacheStorageItem.GlassRxRefractionDetails, function (item, index) { return item.InvestigationId });
                if (ddArray.length > 0) {
                    $scope.listArray = ddArray[0];

                    item.RightEyeValues.Spherical = $scope.listArray.RSpherical;
                    item.RightEyeValues.Cylindrical = $scope.listArray.RCylindrical;
                    item.RightEyeValues.Axis = $scope.listArray.RAxis;
                    item.RightEyeValues.Adition = $scope.listArray.RAdition;
                    item.RightEyeValues.BCVA = $scope.listArray.RBCVA;
                    item.RightEyeValues.BCNVA = $scope.listArray.RBCNVA;
                    item.RightEyeValues.RPrismVt = $scope.listArray.RPrismVt;
                    item.RightEyeValues.RBaseVt = $scope.listArray.RBaseVt;
                    item.RightEyeValues.RPrismHz = $scope.listArray.RPrismHz;
                    item.RightEyeValues.RBaseHz = $scope.listArray.RBaseHz;

                    item.LeftEyeValues.Spherical = $scope.listArray.LSpherical;
                    item.LeftEyeValues.Cylindrical = $scope.listArray.LCylindrical;
                    item.LeftEyeValues.Axis = $scope.listArray.LAxis;
                    item.LeftEyeValues.Adition = $scope.listArray.LAdition;
                    item.LeftEyeValues.BCVA = $scope.listArray.LBCVA;
                    item.LeftEyeValues.BCNVA = $scope.listArray.LBCNVA;
                    item.LeftEyeValues.LPrismVt = $scope.listArray.LPrismVt;
                    item.LeftEyeValues.LBaseVt = $scope.listArray.LBaseVt;
                    item.LeftEyeValues.LPrismHz = $scope.listArray.LPrismHz;
                    item.LeftEyeValues.LBaseHz = $scope.listArray.LBaseHz;
                }

            }
            if (id == 2) {
                var ddArray = $filter("filter")($scope.cacheStorageItem.GlassRxRefractionDetails, function (item, index) { return item.InvestigationId });
                $scope.listArray = ddArray[1];

                item.RightEyeValues.Spherical = $scope.listArray.RSpherical;
                item.RightEyeValues.Cylindrical = $scope.listArray.RCylindrical;
                item.RightEyeValues.Axis = $scope.listArray.RAxis;
                item.RightEyeValues.Adition = $scope.listArray.RAdition;
                item.RightEyeValues.BCVA = $scope.listArray.RBCVA;
                item.RightEyeValues.BCNVA = $scope.listArray.RBCNVA;
                item.RightEyeValues.RPrismVt = $scope.listArray.RPrismVt;
                item.RightEyeValues.RBaseVt = $scope.listArray.RBaseVt;
                item.RightEyeValues.RPrismHz = $scope.listArray.RPrismHz;
                item.RightEyeValues.RBaseHz = $scope.listArray.RBaseHz;

                item.LeftEyeValues.Spherical = $scope.listArray.LSpherical;
                item.LeftEyeValues.Cylindrical = $scope.listArray.LCylindrical;
                item.LeftEyeValues.Axis = $scope.listArray.LAxis;
                item.LeftEyeValues.Adition = $scope.listArray.LAdition;
                item.LeftEyeValues.BCVA = $scope.listArray.LBCVA;
                item.LeftEyeValues.BCNVA = $scope.listArray.LBCNVA;
                item.LeftEyeValues.LPrismVt = $scope.listArray.LPrismVt;
                item.LeftEyeValues.LBaseVt = $scope.listArray.LBaseVt;
                item.LeftEyeValues.LPrismHz = $scope.listArray.LPrismHz;
                item.LeftEyeValues.LBaseHz = $scope.listArray.LBaseHz;
            }
            if (id == 3) {
                var ddArray = $filter("filter")($scope.cacheStorageItem.GlassRxRefractionDetails, function (item, index) { return item.InvestigationId });
                $scope.listArray = ddArray[2];

                item.RightEyeValues.Spherical = $scope.listArray.RSpherical;
                item.RightEyeValues.Cylindrical = $scope.listArray.RCylindrical;
                item.RightEyeValues.Axis = $scope.listArray.RAxis;
                item.RightEyeValues.Adition = $scope.listArray.RAdition;
                item.RightEyeValues.BCVA = $scope.listArray.RBCVA;
                item.RightEyeValues.BCNVA = $scope.listArray.RBCNVA;
                item.RightEyeValues.RPrismVt = $scope.listArray.RPrismVt;
                item.RightEyeValues.RBaseVt = $scope.listArray.RBaseVt;
                item.RightEyeValues.RPrismHz = $scope.listArray.RPrismHz;
                item.RightEyeValues.RBaseHz = $scope.listArray.RBaseHz;

                item.LeftEyeValues.Spherical = $scope.listArray.LSpherical;
                item.LeftEyeValues.Cylindrical = $scope.listArray.LCylindrical;
                item.LeftEyeValues.Axis = $scope.listArray.LAxis;
                item.LeftEyeValues.Adition = $scope.listArray.LAdition;
                item.LeftEyeValues.BCVA = $scope.listArray.LBCVA;
                item.LeftEyeValues.BCNVA = $scope.listArray.LBCNVA;
                item.LeftEyeValues.LPrismVt = $scope.listArray.LPrismVt;
                item.LeftEyeValues.LBaseVt = $scope.listArray.LBaseVt;
                item.LeftEyeValues.LPrismHz = $scope.listArray.LPrismHz;
                item.LeftEyeValues.LBaseHz = $scope.listArray.LBaseHz;
            }
            if (id == 4) {
                var ddArray = $filter("filter")($scope.cacheStorageItem.GlassRxRefractionDetails, function (item, index) { return item.InvestigationId });
                $scope.listArray = ddArray[3];

                item.RightEyeValues.Spherical = $scope.listArray.RSpherical;
                item.RightEyeValues.Cylindrical = $scope.listArray.RCylindrical;
                item.RightEyeValues.Axis = $scope.listArray.RAxis;
                item.RightEyeValues.Adition = $scope.listArray.RAdition;
                item.RightEyeValues.BCVA = $scope.listArray.RBCVA;
                item.RightEyeValues.BCNVA = $scope.listArray.RBCNVA;
                item.RightEyeValues.RPrismVt = $scope.listArray.RPrismVt;
                item.RightEyeValues.RBaseVt = $scope.listArray.RBaseVt;
                item.RightEyeValues.RPrismHz = $scope.listArray.RPrismHz;
                item.RightEyeValues.RBaseHz = $scope.listArray.RBaseHz;
                item.LeftEyeValues.Spherical = $scope.listArray.LSpherical;
                item.LeftEyeValues.Cylindrical = $scope.listArray.LCylindrical;
                item.LeftEyeValues.Axis = $scope.listArray.LAxis;
                item.LeftEyeValues.Adition = $scope.listArray.LAdition;
                item.LeftEyeValues.BCVA = $scope.listArray.LBCVA;
                item.LeftEyeValues.BCNVA = $scope.listArray.LBCNVA;
                item.LeftEyeValues.LPrismVt = $scope.listArray.LPrismVt;
                item.LeftEyeValues.LBaseVt = $scope.listArray.LBaseVt;
                item.LeftEyeValues.LPrismHz = $scope.listArray.LPrismHz;
                item.LeftEyeValues.LBaseHz = $scope.listArray.LBaseHz;
            }
        }
        $scope.SwichGalssSubTab = function (type) {
            $scope.GlassType.SubTab = type;
        };
        $scope.glassdetailObj =
        {
            "GlassdetailID": ""
        }
        $scope.GetGlassDeatilsCPY = [
            {
                "Id": 1,
                "Name": "GRx1"
            },
            {
                "Id": 2,
                "Name": "GRx2"
            },
            {
                "Id": 3,
                "Name": "GRx3"
            },

        ]
        $scope.GlassDeatilsCPYArray = $scope.GetGlassDeatilsCPY;
        $scope.GetPurposeList = [
            { "PurposeId": 1, "PurposeName": "Distance" }, { "PurposeId": 2, "PurposeName": "Near" }, { "PurposeId": 3, "PurposeName": "Intermediate" },
            { "PurposeId": 4, "PurposeName": "Computer" }, { "PurposeId": 5, "PurposeName": "Sports wear" }, { "PurposeId": 6, "PurposeName": "Reading" },
            { "PurposeId": 7, "PurposeName": "Driving" }, { "PurposeId": 8, "PurposeName": "Outdoor" }, { "PurposeId": 9, "PurposeName": "Progressive" },
            { "PurposeId": 10, "PurposeName": "Old in use" }
        ];
        $scope.GetAgeList = [
            { "SinceId": 1, "Name": "< 1 year" }, { "SinceId": 2, "Name": "1 - 2 years" }, { "SinceId": 3, "Name": "2 - 3 years" },
            { "SinceId": 4, "Name": "3 - 4 years" }, { "SinceId": 5, "Name": "4 - 5 years" }, { "SinceId": 6, "Name": " > 5 years" }
        ];
        $scope.GetExpirationyearList = [
            { "Id": 1, "Name": "6 months" }, { "Id": 2, "Name": "1 years" }, { "Id": 3, "Name": "2 years" },
            { "Id": 4, "Name": "3 years" }, { "Id": 5, "Name": "4 years" }, { "Id": 6, "Name": "5 years" }
        ];
        $scope.GlassRxuibclose = function (item) {
            $uibModalInstance.dismiss("cancel");
            /*$scope.GetAllDropdownValues();*/
        };
    
        //$scope.Glassdetails = [];
        //$scope.Glassdetails = $filter('filter')($scope.cacheStorageItem.GlassDetails, { "InvestigationId": 43, "ActiveInd": "Y" }, true);
    

       

        $scope.ChangePurpose = function (item) {
            item.PurposeId = item.PurposeId || "";
            if (item.PurposeId == "") {
                item.PurposeId = "";
                item.Purpose = "";
            } else {
                if (item.PurposeId != 0) {
                    var filter = $filter("filter")($scope.GetPurposeList, { "PurposeId": item.PurposeId }, true) || [];
                    if (filter.length > 0) {
                        item.Purpose = filter[0].PurposeName;
                    }
                }
            }
        };

        $scope.ChangeExpirationYear = function (item) {
            item.ExpirationYearId = item.ExpirationYearId || "";
            if (item.ExpirationYearId == "") {
                item.ExpirationYearId = "";
                item.ExpirationYearName = "";
            } else {
                if (item.ExpirationYearId != 0) {
                    var filter = $filter("filter")($scope.GetExpirationyearList, { "Id": item.ExpirationYearId }, true) || [];
                    if (filter.length > 0) {
                        item.ExpirationYearName = filter[0].Name;
                    }
                }
            }
        };

        $scope.ChangeTechnician = function (item) {
            item.EnteredbyId = item.EnteredbyId || "";
            if (item.EnteredbyId == "") {
                item.EnteredbyId = "";
                item.EnteredbyName = "";
            } else {
                if (item.EnteredbyId != 0) {
                    var filter = $filter("filter")($scope.AllTechnicianList, { "DoctorID": item.EnteredbyId }, true) || [];
                    if (filter.length > 0) {
                        item.EnteredbyName = filter[0].FullName;
                    }
                }
            }
        };
        $scope.ChangeDoctor = function (item) {
            item.PrescribedbyId = item.PrescribedbyId || "";
            if (item.PrescribedbyId == "") {
                item.PrescribedbyId = "";
                item.PrescribedbyName = "";
            } else {
                if (item.PrescribedbyId != 0) {
                    var filter = $filter("filter")($scope.AllDoctorList, { "DoctorID": item.PrescribedbyId }, true) || [];
                    if (filter.length > 0) {
                        item.PrescribedbyName = filter[0].FullName;
                    }
                }
            }
        };
        $scope.isSelectDisabled = true;

        $scope.SelectFinalGlassObject = function (val) {
            $scope.SwichGalssSubTab('TypeofLens');
            /*  $scope.GlassActivestatus();*/
            let index = val;
            let tempActiveArray = $filter('filter')($scope.Glassdetails, { "InvestigationId": 43, "ActiveInd": "Y" }, true);
            //if (tempActiveArray.length > 0) {
            //    $scope.Glassdetails = angular.copy(tempActiveArray);
            //}
            let tempActiveObj = tempActiveArray[index];
            index = $scope.Glassdetails.indexOf(tempActiveObj);
            if ($scope.Glassdetails[0] === $scope.Glassdetails[1] || $scope.Glassdetails[0] === $scope.Glassdetails[2] || $scope.Glassdetails[0] === $scope.Glassdetails[3]) {
                alertify.error("Same Values");
                return false;

            }
            if (val !== 0 && $scope.Glassdetails[index - 1].RightEyeValues.Spherical == '' && $scope.Glassdetails[index - 1].RightEyeValues.Cylindrical == '' && $scope.Glassdetails[index - 1].RightEyeValues.Axis == '' && $scope.Glassdetails[index - 1].RightEyeValues.Adition == '' && $scope.Glassdetails[index - 1].RightEyeValues.BCVA == '' && $scope.Glassdetails[index - 1].RightEyeValues.BCNVA == '' && $scope.Glassdetails[index - 1].RightEyeValues.RPrismVt == '' &&
                $scope.Glassdetails[index - 1].RightEyeValues.RBaseVt == '' && $scope.Glassdetails[index - 1].RightEyeValues.RPrismHz == '' && $scope.Glassdetails[index - 1].RightEyeValues.RBaseHz == '' && $scope.Glassdetails[index - 1].LeftEyeValues.Spherical == '' && $scope.Glassdetails[index - 1].LeftEyeValues.Cylindrical == '' && $scope.Glassdetails[index - 1].LeftEyeValues.Axis == '' &&
                $scope.Glassdetails[index - 1].LeftEyeValues.BCVA == '' && $scope.Glassdetails[index - 1].LeftEyeValues.BCNVA == '' && $scope.Glassdetails[index - 1].LeftEyeValues.Adition == '' && $scope.Glassdetails[index - 1].LeftEyeValues.LPrismVt == '' && $scope.Glassdetails[index - 1].LeftEyeValues.LBaseVt == '' && $scope.Glassdetails[index - 1].LeftEyeValues.LPrismHz == '' && $scope.Glassdetails[index - 1].LeftEyeValues.LBaseHz == '') {

                alertify.error("Please Enter Any One Value");
                return false;
            }
            if ($scope.GetGlassDeatilsCPY != undefined) {
                $scope.GlassDeatilsCPYArray = $scope.GetGlassDeatilsCPY.slice(0, val + 0);
            }

            $scope.isSelectDisabled = val <= 0;


            $scope.SeletedRefractionIndicesObj.SelectedFGIndex = val;
        }
        $scope.SelectFinalGlassObject(0);

        $scope.summaryandhistorypopover = {
            templateUrl: 'templates/uibpopups/GlassDetailsHistoryPopover.html',
        };
        $scope.GetPreviousInvestigationData = function (item, CategoryId, type) {
            let InvestigationId = "";

            InvestigationId = item.toString() || "";
            var obj = {
                "CategoryId": item.CategoryId || 7,
                "InvestigationId": InvestigationId || "43",
                "PatientId": $scope.cacheStorageItem.patientid
            };
            eHnotePatientDataService.GetVisionPreviousHistoryData(obj).then(function (resp) {
                $scope.PreviousInvestigations = [];
                if (resp.data.rows != undefined) {
                    $scope.PreviousInvestigations = resp.data.rows;
                }
                if ($scope.PreviousInvestigations.length > 0) {
                    $scope.loadPreviousData();
                }
            });
        };
        $scope.IsPreviousGLASSDETAILS = false;
        $scope.loadPreviousData = function () {
            if ($scope.PreviousInvestigations.length > 0) {
                $scope.PGlassDetails = [];
                angular.forEach($scope.PreviousInvestigations, function (item, index) {
                    if (item.GlassDetails != undefined) {
                        if (item.GlassDetails.length > 0) {
                            $scope.PGlassDetails.push(item);
                            if ($scope.PGlassDetails.length > 0) {
                                $scope.IsPreviousGLASSDETAILS = true;
                                $scope.IsSummary = false;
                            }
                        }
                    }


                });
            }
        }
        $scope.CopyFinalGlasshistory = function (ITEM) {
            var fgxindex = $scope.SeletedRefractionIndicesObj.SelectedFGIndex
            if (fgxindex > -1) {
                $scope.Glassdetails[fgxindex].RightEyeValues.Spherical = ITEM.RightEyeValues.Spherical || "";
                $scope.Glassdetails[fgxindex].RightEyeValues.Cylindrical = ITEM.RightEyeValues.Cylindrical || "";
                $scope.Glassdetails[fgxindex].RightEyeValues.Axis = ITEM.RightEyeValues.Axis || "";
                $scope.Glassdetails[fgxindex].RightEyeValues.Adition = ITEM.RightEyeValues.Adition || "";
                $scope.Glassdetails[fgxindex].RightEyeValues.BCVA = ITEM.RightEyeValues.BCVA || "";
                $scope.Glassdetails[fgxindex].RightEyeValues.BCNVA = ITEM.RightEyeValues.BCNVA || "";
                $scope.Glassdetails[fgxindex].RightEyeValues.RPrismVt = ITEM.RightEyeValues.RPrismVt || "";
                $scope.Glassdetails[fgxindex].RightEyeValues.RBaseVt = ITEM.RightEyeValues.RBaseVt || "";
                $scope.Glassdetails[fgxindex].RightEyeValues.RPrismHz = ITEM.RightEyeValues.RPrismHz || "";
                $scope.Glassdetails[fgxindex].RightEyeValues.RBaseHz = ITEM.RightEyeValues.RBaseHz || "";
                $scope.Glassdetails[fgxindex].RightEyeValues.RType = ITEM.RightEyeValues.RType || "";
                $scope.Glassdetails[fgxindex].RightEyeValues.RVAI = ITEM.RightEyeValues.RVAI || "";

                $scope.Glassdetails[fgxindex].LeftEyeValues.Spherical = ITEM.LeftEyeValues.Spherical || "";
                $scope.Glassdetails[fgxindex].LeftEyeValues.Cylindrical = ITEM.LeftEyeValues.Cylindrical || "";
                $scope.Glassdetails[fgxindex].LeftEyeValues.Axis = ITEM.LeftEyeValues.Axis || "";
                $scope.Glassdetails[fgxindex].LeftEyeValues.Adition = ITEM.LeftEyeValues.Adition || "";
                $scope.Glassdetails[fgxindex].LeftEyeValues.BCVA = ITEM.LeftEyeValues.BCVA || "";
                $scope.Glassdetails[fgxindex].LeftEyeValues.BCNVA = ITEM.LeftEyeValues.BCNVA;
                $scope.Glassdetails[fgxindex].LeftEyeValues.LPrismVt = ITEM.LeftEyeValues.LPrismVt || "";
                $scope.Glassdetails[fgxindex].LeftEyeValues.LBaseVt = ITEM.LeftEyeValues.LBaseVt || "";
                $scope.Glassdetails[fgxindex].LeftEyeValues.LPrismHz = ITEM.LeftEyeValues.LPrismHz || "";
                $scope.Glassdetails[fgxindex].LeftEyeValues.LBaseHz = ITEM.LeftEyeValues.LBaseHz || "";
                $scope.Glassdetails[fgxindex].LeftEyeValues.LType = ITEM.LeftEyeValues.LType || "";
                $scope.Glassdetails[fgxindex].LeftEyeValues.LVAI = ITEM.LeftEyeValues.LVAI || "";
                $scope.Glassdetails[fgxindex].Remarks = angular.copy(ITEM.Remarks) || "";
                $scope.Glassdetails[fgxindex].Purpose = angular.copy(ITEM.Purpose) || "";
                $scope.Glassdetails[fgxindex].PurposeId = angular.copy(ITEM.PurposeId) || 0;
                $scope.Glassdetails[fgxindex].ExpirationYearName = angular.copy(ITEM.ExpirationYearName) || "";;
                $scope.Glassdetails[fgxindex].EnteredbyName = angular.copy(ITEM.EnteredbyName) || "";
                $scope.Glassdetails[fgxindex].EnteredbyId = angular.copy(ITEM.EnteredbyId) || 0;
                $scope.Glassdetails[fgxindex].PrescribedbyId = angular.copy(ITEM.PrescribedbyId) || 0;
                $scope.Glassdetails[fgxindex].ExpirationYearId = angular.copy(ITEM.ExpirationYearId) || 0;
                $scope.Glassdetails[fgxindex].PDDistanceOU = angular.copy(ITEM.PDDistanceOU) || "";
                $scope.Glassdetails[fgxindex].PDNearOU = angular.copy(ITEM.PDNearOU) || "";
                ITEM.iscopied = true;
            }
        }

        $scope.ChnageGlassDetailsForCopy = function (id, ARIndex) {
            if (id == 1) {
                //  $scope.VisionObj.AutoRefractionDetails[0].AutoRefraction[ARIndex] = angular.copy($scope.VisionObj.AutoRefractionDetails[0].AutoRefraction[0]);
                $scope.Glassdetails[ARIndex].RightEyeValues.Spherical = angular.copy($scope.Glassdetails[0].RightEyeValues.Spherical);
                $scope.Glassdetails[ARIndex].RightEyeValues.Cylindrical = angular.copy($scope.Glassdetails[0].RightEyeValues.Cylindrical);
                $scope.Glassdetails[ARIndex].RightEyeValues.Axis = angular.copy($scope.Glassdetails[0].RightEyeValues.Axis);
                $scope.Glassdetails[ARIndex].RightEyeValues.Adition = angular.copy($scope.Glassdetails[0].RightEyeValues.Adition);
                $scope.Glassdetails[ARIndex].RightEyeValues.BCVA = angular.copy($scope.Glassdetails[0].RightEyeValues.BCVA);
                $scope.Glassdetails[ARIndex].RightEyeValues.BCNVA = angular.copy($scope.Glassdetails[0].RightEyeValues.BCNVA);
                $scope.Glassdetails[ARIndex].RightEyeValues.RPrismVt = angular.copy($scope.Glassdetails[0].RightEyeValues.RPrismVt);
                $scope.Glassdetails[ARIndex].RightEyeValues.RBaseVt = angular.copy($scope.Glassdetails[0].RightEyeValues.RPrismVt);
                $scope.Glassdetails[ARIndex].RightEyeValues.RPrismHz = angular.copy($scope.Glassdetails[0].RightEyeValues.RPrismHz);
                $scope.Glassdetails[ARIndex].RightEyeValues.RBaseHz = angular.copy($scope.Glassdetails[0].RightEyeValues.RBaseHz);
                $scope.Glassdetails[ARIndex].RightEyeValues.RType = angular.copy($scope.Glassdetails[0].RightEyeValues.RType) || "";
                $scope.Glassdetails[ARIndex].RightEyeValues.RVAI = angular.copy($scope.Glassdetails[0].RightEyeValues.RVAI) || "";

                $scope.Glassdetails[ARIndex].LeftEyeValues.Spherical = angular.copy($scope.Glassdetails[0].LeftEyeValues.Spherical);
                $scope.Glassdetails[ARIndex].LeftEyeValues.Cylindrical = angular.copy($scope.Glassdetails[0].LeftEyeValues.Cylindrical);
                $scope.Glassdetails[ARIndex].LeftEyeValues.Axis = angular.copy($scope.Glassdetails[0].LeftEyeValues.Axis);
                $scope.Glassdetails[ARIndex].LeftEyeValues.Adition = angular.copy($scope.Glassdetails[0].LeftEyeValues.Adition);
                $scope.Glassdetails[ARIndex].LeftEyeValues.BCVA = angular.copy($scope.Glassdetails[0].LeftEyeValues.BCVA);
                $scope.Glassdetails[ARIndex].LeftEyeValues.BCNVA = angular.copy($scope.Glassdetails[0].LeftEyeValues.BCNVA);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LPrismVt = angular.copy($scope.Glassdetails[0].LeftEyeValues.LPrismVt);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LBaseVt = angular.copy($scope.Glassdetails[0].LeftEyeValues.LBaseVt);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LPrismHz = angular.copy($scope.Glassdetails[0].LeftEyeValues.LPrismHz);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LBaseHz = angular.copy($scope.Glassdetails[0].LeftEyeValues.LBaseHz);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LType = angular.copy($scope.Glassdetails[0].LeftEyeValues.LType) || "";
                $scope.Glassdetails[ARIndex].LeftEyeValues.LVAI = angular.copy($scope.Glassdetails[0].LeftEyeValues.LVAI) || "";

                $scope.Glassdetails[ARIndex].Remarks = angular.copy($scope.Glassdetails[0].Remarks) || "";
                $scope.Glassdetails[ARIndex].Purpose = angular.copy($scope.Glassdetails[0].Purpose) || "";
                $scope.Glassdetails[ARIndex].PurposeId = angular.copy($scope.Glassdetails[0].PurposeId) || 0;
                $scope.Glassdetails[ARIndex].ExpirationYearName = angular.copy($scope.Glassdetails[0].ExpirationYearName) || "";;
                $scope.Glassdetails[ARIndex].EnteredbyName = angular.copy($scope.Glassdetails[0].EnteredbyName) || "";
                $scope.Glassdetails[ARIndex].EnteredbyId = angular.copy($scope.Glassdetails[0].EnteredbyId) || 0;
                $scope.Glassdetails[ARIndex].PrescribedbyId = angular.copy($scope.Glassdetails[0].PrescribedbyId) || 0;
                $scope.Glassdetails[ARIndex].ExpirationYearId = angular.copy($scope.Glassdetails[0].ExpirationYearId) || 0;
                $scope.Glassdetails[ARIndex].Remarks = angular.copy($scope.Glassdetails[0].Remarks) || "";
                $scope.Glassdetails[ARIndex].Purpose = angular.copy($scope.Glassdetails[0].Purpose) || "";
                $scope.Glassdetails[ARIndex].PDDistanceOU = angular.copy($scope.Glassdetails[0].PDDistanceOU) || "";
                $scope.Glassdetails[ARIndex].PDNearOU = angular.copy($scope.Glassdetails[0].PDNearOU) || "";

            }
            if (id == 2) {
                $scope.Glassdetails[ARIndex].RightEyeValues.Spherical = angular.copy($scope.Glassdetails[1].RightEyeValues.Spherical);
                $scope.Glassdetails[ARIndex].RightEyeValues.Cylindrical = angular.copy($scope.Glassdetails[1].RightEyeValues.Cylindrical);
                $scope.Glassdetails[ARIndex].RightEyeValues.Axis = angular.copy($scope.Glassdetails[1].RightEyeValues.Axis);
                $scope.Glassdetails[ARIndex].RightEyeValues.Adition = angular.copy($scope.Glassdetails[1].RightEyeValues.Adition);
                $scope.Glassdetails[ARIndex].RightEyeValues.BCVA = angular.copy($scope.Glassdetails[1].RightEyeValues.BCVA);
                $scope.Glassdetails[ARIndex].RightEyeValues.BCNVA = angular.copy($scope.Glassdetails[1].RightEyeValues.BCNVA);
                $scope.Glassdetails[ARIndex].RightEyeValues.RPrismVt = angular.copy($scope.Glassdetails[1].RightEyeValues.RPrismVt);
                $scope.Glassdetails[ARIndex].RightEyeValues.RBaseVt = angular.copy($scope.Glassdetails[1].RightEyeValues.RPrismVt);
                $scope.Glassdetails[ARIndex].RightEyeValues.RPrismHz = angular.copy($scope.Glassdetails[1].RightEyeValues.RPrismHz);
                $scope.Glassdetails[ARIndex].RightEyeValues.RBaseHz = angular.copy($scope.Glassdetails[1].RightEyeValues.RBaseHz);
                $scope.Glassdetails[ARIndex].RightEyeValues.RType = angular.copy($scope.Glassdetails[1].RightEyeValues.RType) || "";
                $scope.Glassdetails[ARIndex].RightEyeValues.RVAI = angular.copy($scope.Glassdetails[1].RightEyeValues.RVAI) || "";

                $scope.Glassdetails[ARIndex].LeftEyeValues.Spherical = angular.copy($scope.Glassdetails[1].LeftEyeValues.Spherical);
                $scope.Glassdetails[ARIndex].LeftEyeValues.Cylindrical = angular.copy($scope.Glassdetails[1].LeftEyeValues.Cylindrical);
                $scope.Glassdetails[ARIndex].LeftEyeValues.Axis = angular.copy($scope.Glassdetails[1].LeftEyeValues.Axis);
                $scope.Glassdetails[ARIndex].LeftEyeValues.Adition = angular.copy($scope.Glassdetails[1].LeftEyeValues.Adition);
                $scope.Glassdetails[ARIndex].LeftEyeValues.BCVA = angular.copy($scope.Glassdetails[1].LeftEyeValues.BCVA);
                $scope.Glassdetails[ARIndex].LeftEyeValues.BCNVA = angular.copy($scope.Glassdetails[1].LeftEyeValues.BCNVA);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LPrismVt = angular.copy($scope.Glassdetails[1].LeftEyeValues.LPrismVt);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LBaseVt = angular.copy($scope.Glassdetails[1].LeftEyeValues.LBaseVt);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LPrismHz = angular.copy($scope.Glassdetails[1].LeftEyeValues.LPrismHz);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LBaseHz = angular.copy($scope.Glassdetails[1].LeftEyeValues.LBaseHz);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LType = angular.copy($scope.Glassdetails[1].LeftEyeValues.LType) || "";
                $scope.Glassdetails[ARIndex].LeftEyeValues.LVAI = angular.copy($scope.Glassdetails[1].LeftEyeValues.LVAI) || "";

                $scope.Glassdetails[ARIndex].Remarks = angular.copy($scope.Glassdetails[1].Remarks) || "";
                $scope.Glassdetails[ARIndex].Purpose = angular.copy($scope.Glassdetails[1].Purpose) || "";
                $scope.Glassdetails[ARIndex].PurposeId = angular.copy($scope.Glassdetails[1].PurposeId) || 0;
                $scope.Glassdetails[ARIndex].ExpirationYearName = angular.copy($scope.Glassdetails[1].ExpirationYearName) || "";;
                $scope.Glassdetails[ARIndex].EnteredbyName = angular.copy($scope.Glassdetails[1].EnteredbyName) || "";
                $scope.Glassdetails[ARIndex].EnteredbyId = angular.copy($scope.Glassdetails[1].EnteredbyId) || 0;
                $scope.Glassdetails[ARIndex].PrescribedbyId = angular.copy($scope.Glassdetails[1].PrescribedbyId) || 0;
                $scope.Glassdetails[ARIndex].ExpirationYearId = angular.copy($scope.Glassdetails[1].ExpirationYearId) || 0;
                $scope.Glassdetails[ARIndex].Remarks = angular.copy($scope.Glassdetails[1].Remarks) || "";
                $scope.Glassdetails[ARIndex].Purpose = angular.copy($scope.Glassdetails[1].Purpose) || "";
                $scope.Glassdetails[ARIndex].PDDistanceOU = angular.copy($scope.Glassdetails[1].PDDistanceOU) || "";
                $scope.Glassdetails[ARIndex].PDNearOU = angular.copy($scope.Glassdetails[1].PDNearOU) || "";

            }

            if (id == 3) {
                // $scope.VisionObj.AutoRefractionDetails[0].AutoRefraction[ARIndex] = angular.copy($scope.VisionObj.AutoRefractionDetails[0].AutoRefraction[2]);
                $scope.Glassdetails[ARIndex].RightEyeValues.Spherical = angular.copy($scope.Glassdetails[2].RightEyeValues.Spherical);
                $scope.Glassdetails[ARIndex].RightEyeValues.Cylindrical = angular.copy($scope.Glassdetails[2].RightEyeValues.Cylindrical);
                $scope.Glassdetails[ARIndex].RightEyeValues.Axis = angular.copy($scope.Glassdetails[2].RightEyeValues.Axis);
                $scope.Glassdetails[ARIndex].RightEyeValues.Adition = angular.copy($scope.Glassdetails[2].RightEyeValues.Adition);
                $scope.Glassdetails[ARIndex].RightEyeValues.BCVA = angular.copy($scope.Glassdetails[2].RightEyeValues.BCVA);
                $scope.Glassdetails[ARIndex].RightEyeValues.BCNVA = angular.copy($scope.Glassdetails[2].RightEyeValues.BCNVA);
                $scope.Glassdetails[ARIndex].RightEyeValues.RPrismVt = angular.copy($scope.Glassdetails[2].RightEyeValues.RPrismVt);
                $scope.Glassdetails[ARIndex].RightEyeValues.RBaseVt = angular.copy($scope.Glassdetails[2].RightEyeValues.RPrismVt);
                $scope.Glassdetails[ARIndex].RightEyeValues.RPrismHz = angular.copy($scope.Glassdetails[2].RightEyeValues.RPrismHz);
                $scope.Glassdetails[ARIndex].RightEyeValues.RBaseHz = angular.copy($scope.Glassdetails[2].RightEyeValues.RBaseHz);
                $scope.Glassdetails[ARIndex].RightEyeValues.RType = angular.copy($scope.Glassdetails[2].RightEyeValues.RType) || "";
                $scope.Glassdetails[ARIndex].RightEyeValues.RVAI = angular.copy($scope.Glassdetails[2].RightEyeValues.RVAI) || "";

                $scope.Glassdetails[ARIndex].LeftEyeValues.Spherical = angular.copy($scope.Glassdetails[2].LeftEyeValues.Spherical);
                $scope.Glassdetails[ARIndex].LeftEyeValues.Cylindrical = angular.copy($scope.Glassdetails[2].LeftEyeValues.Cylindrical);
                $scope.Glassdetails[ARIndex].LeftEyeValues.Axis = angular.copy($scope.Glassdetails[2].LeftEyeValues.Axis);
                $scope.Glassdetails[ARIndex].LeftEyeValues.Adition = angular.copy($scope.Glassdetails[2].LeftEyeValues.Adition);
                $scope.Glassdetails[ARIndex].LeftEyeValues.BCVA = angular.copy($scope.Glassdetails[2].LeftEyeValues.BCVA);
                $scope.Glassdetails[ARIndex].LeftEyeValues.BCNVA = angular.copy($scope.Glassdetails[2].LeftEyeValues.BCNVA);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LPrismVt = angular.copy($scope.Glassdetails[2].LeftEyeValues.LPrismVt);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LBaseVt = angular.copy($scope.Glassdetails[2].LeftEyeValues.LBaseVt);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LPrismHz = angular.copy($scope.Glassdetails[2].LeftEyeValues.LPrismHz);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LBaseHz = angular.copy($scope.Glassdetails[2].LeftEyeValues.LBaseHz);
                $scope.Glassdetails[ARIndex].LeftEyeValues.LType = angular.copy($scope.Glassdetails[2].LeftEyeValues.LType) || "";
                $scope.Glassdetails[ARIndex].LeftEyeValues.LVAI = angular.copy($scope.Glassdetails[2].LeftEyeValues.LVAI) || "";

                $scope.Glassdetails[ARIndex].Remarks = angular.copy($scope.Glassdetails[2].Remarks) || "";
                $scope.Glassdetails[ARIndex].Purpose = angular.copy($scope.Glassdetails[2].Purpose) || "";
                $scope.Glassdetails[ARIndex].PurposeId = angular.copy($scope.Glassdetails[2].PurposeId) || 0;
                $scope.Glassdetails[ARIndex].ExpirationYearName = angular.copy($scope.Glassdetails[2].ExpirationYearName) || "";;
                $scope.Glassdetails[ARIndex].EnteredbyName = angular.copy($scope.Glassdetails[2].EnteredbyName) || "";
                $scope.Glassdetails[ARIndex].EnteredbyId = angular.copy($scope.Glassdetails[2].EnteredbyId) || 0;
                $scope.Glassdetails[ARIndex].PrescribedbyId = angular.copy($scope.Glassdetails[2].PrescribedbyId) || 0;
                $scope.Glassdetails[ARIndex].ExpirationYearId = angular.copy($scope.Glassdetails[2].ExpirationYearId) || 0;
                $scope.Glassdetails[ARIndex].PDDistanceOU = angular.copy($scope.Glassdetails[2].PDDistanceOU) || "";
                $scope.Glassdetails[ARIndex].PDNearOU = angular.copy($scope.Glassdetails[2].PDNearOU) || "";
            }

            $scope.glassdetailObj.GlassdetailID = '';
        }
        $scope.ClearGlassRX = function () {
            var index = $scope.SeletedRefractionIndicesObj.SelectedFGIndex
            let tempArray = $filter('filter')($scope.Glassdetails, { 'ActiveInd': 'Y' }, true);
            var item = tempArray[index];
            if (item !== undefined) {
                var confirmationMessage = "Are you sure you want to permanently delete Grx" + (index + 1) + " values?";
                var nextIndexItem = tempArray[index + 1];
                if (nextIndexItem && nextIndexItem.IsInvDataAdded) {
                    confirmationMessage += " and forward Grx" + (index + 2) + " values to Grx" + (index + 1) + "?";
                }
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + confirmationMessage + "</h4>", function () {
                    if (item.PatientFindingGlassId === 0) {
                        if (index > -1) {
                            $scope.Glassdetails.splice(index, 1);
                            var GRX = $filter("filter")($scope.Glassdetails, { "ActiveInd": 'Y' }, true) || [];
                            if (GRX.length < 4) {
                                let GRXOBJ = GetGlassDetailsObj();

                                GRXOBJ.LensType = [];
                                GRXOBJ.LensCoating = [];
                                GRXOBJ.LensMaterialarray = [];
                                GRXOBJ.ModeOfWeararray = [];
                                GRXOBJ.FrameMaterialarray = [];

                                GRXOBJ.LensType = angular.copy($scope.LensType) || [];
                                GRXOBJ.LensCoating = angular.copy($scope.LensCoating) || [];
                                GRXOBJ.LensMaterialarray = angular.copy($scope.LensMaterialarray) || []; 
                                GRXOBJ.ModeOfWeararray = angular.copy($scope.ModeOfWeararray) || [];  
                                GRXOBJ.FrameMaterialarray = angular.copy($scope.FrameMaterialarray) || [];   
                                $scope.Glassdetails.push(GRXOBJ);
                            }
                        }
                    } else {

                        item.ActiveInd = 'N';
                        var GRX = $filter("filter")($scope.Glassdetails, function (Nitem) {
                            return Nitem.ActiveInd == "Y" && Nitem.PatientFindingGlassId != 0;
                        }) || [];
                        if (GRX.length < 4) {
                            let GRXOBJ = GetGlassDetailsObj();
                            GRXOBJ.LensType = [];
                            GRXOBJ.LensCoating = [];
                            GRXOBJ.LensMaterialarray = [];
                            GRXOBJ.ModeOfWeararray = [];
                            GRXOBJ.FrameMaterialarray = [];
                            GRXOBJ.LensType = angular.copy($scope.LensType) || [];
                            GRXOBJ.LensCoating = angular.copy($scope.LensCoating) || []; 
                            GRXOBJ.LensMaterialarray = angular.copy($scope.LensMaterialarray) || []; 
                            GRXOBJ.ModeOfWeararray = angular.copy($scope.ModeOfWeararray) || []; 
                            GRXOBJ.FrameMaterialarray = angular.copy($scope.FrameMaterialarray) || []; 
                            $scope.Glassdetails.push(GRXOBJ);
                        }
                 
                    }

                    $scope.$digest();

                }, function () {
                    r = "You pressed Cancel!";
                });

            }


        };

        $scope.$watch("Glassdetails", function (newVal, oldVal) {

            if ($scope.Glassdetails === undefined) { return; }
            angular.forEach($scope.Glassdetails, function (item) {
                item.IsInvDataAdded = false;
                if (item.ActiveInd === 'N') {
                    item.IsInvDataAdded = true;
                }
                if (item.ActiveInd === 'Y') {
                    var selectedarray = $filter("filter")(item.LensTypeArray, { "IsActive": true }, true);
                    var selectedCoatarray = $filter("filter")(item.LensCoatingArray, { "IsActive": true }, true);
                    if (item.InvestigationId === 43) {
                        if (item.RightEyeValues.UVa !== "" || item.RightEyeValues.Cylindrical !== "" || item.RightEyeValues.Spherical !== "" || item.RightEyeValues.Axis !== "" || item.RightEyeValues.Adition !== "" || item.RightEyeValues.BCVA !== "" || item.RightEyeValues.BCNVA !== "" || item.RightEyeValues.IPD !== "" || item.RightEyeValues.Prism !== "" || item.RightEyeValues.Base !== "" || item.LeftEyeValues.UVa !== "" || item.LeftEyeValues.Cylindrical !== "" || item.LeftEyeValues.Spherical !== "" || item.LeftEyeValues.Axis !== "" || item.LeftEyeValues.Adition !== "" || item.LeftEyeValues.BCVA !== "" || item.LeftEyeValues.BCNVA !== "" || item.LeftEyeValues.IPD !== "" || item.LeftEyeValues.Prism !== "" || item.LeftEyeValues.Base !== "" || item.Remarks != "" || selectedarray.length > 0 || selectedCoatarray.length > 0 || item.FrameMaterial != "" || item.LensMaterial != "" || item.LensTint != "" || item.Modeofwear != "" || item.SpecialityLens != "" || item.SpecialInstruction != "" || item.RightEyeValues.RPrismVt !== "" || item.RightEyeValues.RBaseVt !== "" || item.RightEyeValues.RPrismHz !== "" || item.RightEyeValues.RBaseHz !== "" || item.LeftEyeValues.LPrismVt !== "" || item.LeftEyeValues.LBaseVt !== "" || item.LeftEyeValues.LPrismHz !== "" || item.LeftEyeValues.LBaseHz !== "") {
                            item.IsInvDataAdded = true;
                        }
           
                    }

                }
            });
        }, true);

        $scope.SaveGlassRxValues = function () {


            var GlassRXDetailsArray = $filter("filter")($scope.Glassdetails, { "InvestigationId": 43, "IsInvDataAdded": true }, true);

            angular.forEach(GlassRXDetailsArray, function (ritem) {
                if (ritem.InvestigationId === 43) {
                    if (ritem.LensType.length > 0) {
                        var selectedarray = $filter("filter")(ritem.LensType, { "IsActive": true }, true);
                        if (selectedarray.length > 0) {
                            ritem.LensType = [];
                            ritem.LensType = selectedarray || [];
                        }
                    }
                    if (ritem.LensCoating.length > 0) {
                        var selectedCoatarray = $filter("filter")(ritem.LensCoating, { "IsActive": true }, true);
                        if (selectedCoatarray.length > 0) {
                            ritem.LensCoating = [];
                            ritem.LensCoating = selectedarray || [];
                        }
                    }

                    if (ritem.LensMaterialarray.length > 0) {
                        ritem.LensMaterial = [];
                        angular.forEach(ritem.LensMaterialarray, function (mitem) {
                            //if (mitem.IsActive === false && mitem.LensMaterialId != 0) {
                            //    ritem.LensMaterial.push(mitem);
                            //}
                            if (mitem.IsActive === true) {
                                ritem.LensMaterial.push(mitem);
                            }
                        });
                    }
                    if (ritem.FrameMaterialarray.length > 0) {
                        ritem.FrameMaterial = [];
                        angular.forEach(ritem.FrameMaterialarray, function (mitem) {
                            //if (mitem.IsActive === false && mitem.FrameMaterialId != 0) {
                            //    ritem.FrameMaterial.push(mitem);
                            //}
                            if (mitem.IsActive === true) {
                                ritem.FrameMaterial.push(mitem);
                            }
                        });
                    }
                    if (ritem.ModeOfWeararray.length > 0) {
                        ritem.Modeofwear = [];
                        angular.forEach(ritem.ModeOfWeararray, function (mitem) {
                            //if (mitem.IsActive === false && mitem.ModeOfWearId != 0) {
                            //    ritem.Modeofwear.push(mitem);
                            //}
                            if (mitem.IsActive === true) {
                                ritem.Modeofwear.push(mitem);
                            }
                        });
                    }
                }


            });
            if (GlassRXDetailsArray.length > 0) {
                angular.forEach(GlassRXDetailsArray, function (gitem, gindex) {
                    /* if ($scope.cacheStorageItem.GlassRxRefractionDetails.length > 0 || $scope.cacheStorageItem.GlassRxRefractionDetails.length == 0) {*/
                    var indexind = $scope.cacheStorageItem.GlassRxRefractionDetails[gindex];
                    if (indexind != undefined) {
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RSpherical = gitem.RightEyeValues.Spherical || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RCylindrical = gitem.RightEyeValues.Cylindrical || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RAxis = gitem.RightEyeValues.Axis || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RAdition = gitem.RightEyeValues.Adition || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RBCVA = gitem.RightEyeValues.BCVA || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RBCNVA = gitem.RightEyeValues.BCNVA || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RPrismVt = gitem.RightEyeValues.RPrismVt || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RBaseVt = gitem.RightEyeValues.RBaseVt || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RPrismHz = gitem.RightEyeValues.RPrismHz || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RBaseHz = gitem.RightEyeValues.RBaseHz || "";
                        /*  $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RPrismHz = gitem.RightEyeValues.*/
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RType = gitem.RightEyeValues.RType || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RVAI = gitem.RightEyeValues.RVAI || "";

                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LSpherical = gitem.LeftEyeValues.Spherical || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LCylindrical = gitem.LeftEyeValues.Cylindrical || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LAxis = gitem.LeftEyeValues.Axis || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LAdition = gitem.LeftEyeValues.Adition || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LBCVA = gitem.LeftEyeValues.BCVA || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LBCNVA = gitem.LeftEyeValues.BCNVA;

                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LPrismVt = gitem.LeftEyeValues.LPrismVt || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LBaseVt = gitem.LeftEyeValues.LBaseVt || "";

                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LPrismHz = gitem.LeftEyeValues.LPrismHz || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LBaseHz = gitem.LeftEyeValues.LBaseHz || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LType = gitem.LeftEyeValues.LType || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LVAI = gitem.LeftEyeValues.LVAI || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].Remarks = gitem.Remarks || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].Purpose = gitem.Purpose || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].PurposeId = gitem.PurposeId || 0;
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].ExpirationYearName = gitem.ExpirationYearName || "";;
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].EnteredbyName = gitem.EnteredbyName || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].EnteredbyId = gitem.EnteredbyId || 0;
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].PrescribedbyId = gitem.PrescribedbyId || 0;
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].ExpirationYearId = gitem.ExpirationYearId || 0;
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].ActiveInd = gitem.ActiveInd || "Y";
                    } else {
                        let obj = GetFGlassRxObj();
                        $scope.cacheStorageItem.GlassRxRefractionDetails.push(obj);
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RSpherical = gitem.RightEyeValues.Spherical || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RCylindrical = gitem.RightEyeValues.Cylindrical || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RAxis = gitem.RightEyeValues.Axis || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RAdition = gitem.RightEyeValues.Adition || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RBCVA = gitem.RightEyeValues.BCVA || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RBCNVA = gitem.RightEyeValues.BCNVA || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RPrismVt = gitem.RightEyeValues.RPrismVt || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RBaseVt = gitem.RightEyeValues.RBaseVt || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RPrismHz = gitem.RightEyeValues.RPrismHz || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RBaseHz = gitem.RightEyeValues.RBaseHz || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RType = gitem.RightEyeValues.RType || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RVAI = gitem.RightEyeValues.RVAI || "";
                        /*  $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].RPrismHz = gitem.RightEyeValues.*/

                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LSpherical = gitem.LeftEyeValues.Spherical || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LCylindrical = gitem.LeftEyeValues.Cylindrical || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LAxis = gitem.LeftEyeValues.Axis || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LAdition = gitem.LeftEyeValues.Adition || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LBCVA = gitem.LeftEyeValues.BCVA || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LBCNVA = gitem.LeftEyeValues.BCNVA;

                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LPrismVt = gitem.LeftEyeValues.LPrismVt || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LBaseVt = gitem.LeftEyeValues.LBaseVt || "";

                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LPrismHz = gitem.LeftEyeValues.LPrismHz || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LBaseHz = gitem.LeftEyeValues.LBaseHz || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LType = gitem.LeftEyeValues.LType || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].LVAI = gitem.LeftEyeValues.LVAI || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].Remarks = gitem.Remarks || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].Purpose = gitem.Purpose || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].PurposeId = gitem.PurposeId || 0;
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].ExpirationYearName = gitem.ExpirationYearName || "";;
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].EnteredbyName = gitem.EnteredbyName || "";
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].EnteredbyId = gitem.EnteredbyId || 0;
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].PrescribedbyId = gitem.PrescribedbyId || 0;
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].ExpirationYearId = gitem.ExpirationYearId || 0;
                        $scope.cacheStorageItem.GlassRxRefractionDetails[gindex].ActiveInd = gitem.ActiveInd || "Y";
                    }
                    /* }*/
                });
            }




            var GlassRXDetailsobject = {
                "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                "AppointmentID": $scope.cacheStorageItem.appointmentid,
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "StatusFlag": 'D',
                "ConsultationDate": $scope.cacheStorageItem.ConsultationDate || "",
                "GlassRXDetails": GlassRXDetailsArray || [],
                "FinalGlassRxDetails": $scope.cacheStorageItem.GlassRxRefractionDetails || [],
            }

            eHnotePatientDataService.AddUpdateVisionPerceptionDetails(GlassRXDetailsobject).then(function (resp) {
                if (resp.data.Message === 'Success') {
                    $uibModalInstance.close($scope.cacheStorageItem);

                    //var consultationid = $scope.cacheStorageItem.ConsultationID;
                    //var AppointmentID = $scope.cacheStorageItem.appointmentid;
                    //var type = 0;
                    //if (consultationid === 0) {
                    //    type = 1;
                    //}
                    //var object = {
                    //    "AppointmentId": AppointmentID,
                    //    "Type": type
                    //};
                    //eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
                    //    if (resp.data !== undefined) {
                    //        $scope.treatmentData = resp.data;
                    //        $scope.SelectedPlanArray = [];
                    //        $scope.SelectedPlanArray = $filter("filter")($scope.treatmentData, { "AppointmentId": AppointmentID }, true);
                    //        if ($scope.SelectedPlanArray[0].GlassDetails !== undefined) {
                    //            if ($scope.SelectedPlanArray[0].GlassDetails.length !== 0) {
                    //                //angular.forEach($scope.SelectedPlanArray[0].GlassDetails, function (mitem) {
                    //                //    angular.forEach($scope.cacheStorageItem.GlassDetails, function (gitem) {
                    //                //if (mitem.InvestigationId == gitem.InvestigationId) {
                    //                //    gitem.PatientFindingGlassId = mitem.PatientFindingGlassId;

                    //                //}
                    //                $scope.cacheStorageItem.GlassDetails = [];
                    //                $scope.cacheStorageItem.GlassDetails = $scope.SelectedPlanArray[0].GlassDetails;
                    //                //    });
                    //                //});

                    //            }

                    //        }
                    //        if ($scope.SelectedPlanArray[0].FinalGlassRxArray !== undefined) {
                    //            if ($scope.SelectedPlanArray[0].FinalGlassRxArray.length > 0) {
                    //                $scope.cacheStorageItem.GlassRxRefractionDetails = $scope.SelectedPlanArray[0].FinalGlassRxArray || [];
                    //            }
                    //        }
                    //        //angular.forEach($scope.Glassdetails, function (mitem) {
                    //        //    angular.forEach($scope.cacheStorageItem.GlassDetails, function (cgitem) {
                    //        //        if (mitem.InvestigationId == cgitem.InvestigationId) {
                    //        //            cgitem.PatientFindingGlassId = mitem.PatientFindingGlassId;
                    //        //        }

                    //        //    });

                    //        //});
                    //        /*   $scope.cacheStorageItem.GlassDetails = angular.copy($scope.Glassdetails);*/
                    //        $uibModalInstance.close($scope.cacheStorageItem);
                    //    }
                    //}, function (err) {
                    //    alertify.error(err.data.ExceptionMessage);
                    //});

                }

            });
            //$uibModalInstance.close($scope.cacheStorageItem);
            //$uibModalInstance.dismiss();
        };


    }]);
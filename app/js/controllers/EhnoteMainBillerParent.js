eHnoteWebApp.controller("EhnoteMainBillerParent", ["$scope", "$rootScope", "eHnoteMasterDataService", "eHnotePatientAddressDataServices", "$filter", "alertify", "eHnoteLoginStatusService", "$uibModal", "eHnoteAuditServices", "eHnotePatientDataService", "eHnoteCacheStorageService", "datapersistanceFactory", "$location", "eHnoteDiagnosisDataServices", "$timeout", "eHnoteInsuranceService", "datacookieFactory", "localStorageFactory", "eHnoteReferalDataService", "eHnoteUserAppointmentDataService", "eHnoteMainAppointmentService", "eHnoteDbStaticDataService", "$q", "eHnoteSettingsDataService", "eHnoteOrgReferralDataServices", "loginCookieFactory", "DeCodeFilter", "Lightbox", "eHnoteProcedureDataService", "USPrintService", "eHnotePatientVisitReasonServices", "InventoryService", "$routeParams", "$window", function ($scope, $rootScope, eHnoteMasterDataService, eHnotePatientAddressDataServices, $filter, alertify, eHnoteLoginStatusService, $uibModal, eHnoteAuditServices, eHnotePatientDataService, eHnoteCacheStorageService, datapersistanceFactory, $location, eHnoteDiagnosisDataServices, $timeout, eHnoteInsuranceService, datacookieFactory, localStorageFactory, eHnoteReferalDataService, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnoteDbStaticDataService, $q, eHnoteSettingsDataService, eHnoteOrgReferralDataServices, loginCookieFactory, DeCodeFilter, Lightbox, eHnoteProcedureDataService, USPrintService, eHnotePatientVisitReasonServices, InventoryService, $routeParams, $window) {


    var tab = parseInt($routeParams.tabId) || 1;

    console.log(tab + "__tab");

    if (tab) {
        $scope.ClaimBillerSubTab = parseInt(tab);
        $rootScope.ClaimBillerSubTab = tab;
    } else {
        $scope.ClaimBillerSubTab = 1; // default
    }


    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.PatientDetailsArray = {};
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.RoleId = $scope.userLoginDetails.RoleID;
   
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.SelectedPatientDetails = eHnoteMasterDataService.getPatientDetailsforBarcode();
    $scope.MainTab = 1;

  
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    }
    
    
    //var allbranches = localStorageFactory.getItem("allBranchesData") || [];
    //var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches(true, allbranches, doctorinfo) || [];
    //$scope.HospitalList = clinicAddress || [];
    //$scope.SelectedPayorHospital = $filter("filter")($scope.HospitalList, { "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0];

     

    

    $scope.billerActiveMain = 1;
    $scope.switchMainBiller = function (pageno) {
        $scope.billerActiveMain = pageno;
    };

    


    


    $scope.mainBillerDataObj = {
        "AllBranchesList": [],
        "AllSubSpecializationsArray": [],
        "AllUsersList": [],
        "AllFacilitiesList": [],
        "AllDoctorsList": [],
        "BillingProviderList": [],
        "OrganizationLogoUrl": "",
        "Masterrefundreasons":[],
    }
  
    $scope.getDoctorsbySubSpecializations = function (branchId) {

      
        var branchesList = [];
        $scope.BranchDoctorsList = [];
        $scope.allUserList = [];
        $scope.DoctorObj = "";
        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {


            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId === branchId; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        }

        var locationIds = $scope.BranchesListArray
            .filter(pitem => pitem.BranchId !== 0) // Exclude BranchId === 0
            .map(pitem => pitem.BranchId)
            .join(",");        


        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            /* "BranchId": hospitalID,*/
            "BranchId": locationIds,
            "SubSpecializationIdArray": subSplArray
        }

        //console.log(JSON.stringify(reqObj));
        //return false;
        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;
                
               
                if ($scope.allUserList.length !== 0) {

                    $scope.BranchDoctorsList = angular.copy($scope.allUserList);
                }


                $scope.mainBillerDataObj.AllUsersList = angular.copy($scope.allUserList);
                $scope.mainBillerDataObj.AllUsersList = _.uniq($scope.mainBillerDataObj.AllUsersList, false, function (p) { return p.DoctorID; });

                if ($scope.BranchDoctorsList.length > 0) {
                    $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) { return p.DoctorID; });
                    $scope.AllCounselorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 18;
                    });
                    $scope.AllDoctorAnesthesiologist = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 30;
                    });
                    $scope.AllDoctorAssistant = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 29;
                    });
                    $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                   /*     return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 55;*/
                        return item.RoleId === 1 || item.RoleId === 43;
                    });
                }

                $scope.mainBillerDataObj.AllDoctorsList = angular.copy($scope.BranchDoctorsList);
                //var doctorAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                //$scope.mainBillerDataObj.AllDoctorsList.unshift(doctorAll);
                angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (ditem) {
                    ditem.isChecked = true;
                });
                $scope.selectedDoctor = 'All Doctors';

                var DoctorID = doctorinfo.doctordata.User[0].DoctorID;

                var DoctorObj = $filter("filter")($scope.BranchDoctorsList, function (item, index) { return item.DoctorID == DoctorID })[0];

              

            } else {
                alertify.error("No Doctors Found in Selected Hospital");

            }


        }

        function onGetUsersFailure(data) {
        }
    }
    //function GetBranchSubSpecializations(SubOrganizationId, BranchId) {
    //    eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
    //        if (resp.data.row.length > 0) {
    //            $scope.allSubSpecializationsArray = resp.data.row;
               
    //            angular.forEach($scope.allSubSpecializationsArray, function (item) {
    //                item.isChecked = true;
    //            });
    //            $scope.mainBillerDataObj.AllSubSpecializationsArray = $scope.allSubSpecializationsArray||[];
    //            console.log($scope.allSubSpecializationsArray);
    //            $scope.getDoctorsbySubSpecializations(BranchId);
    //        } else {
    //            $scope.allSubSpecializationsArray = [];
    //            $scope.clinicDoctorList = [];
    //            $scope.allUserList = [];
    //            $scope.selectedDoctor = "";
    //            alertify.error("No Departments are been added");
    //        }


    //    });
    //};
    function InitializeNewBranches(data) {
        $scope.AllUserBranchesList = [];
        if (data.length !== 0) {
            var EmptyClinicObj = {
                "ClinicName": "All Locations",
                "ClinicId": 0,
                "BranchName": "All Locations",
                "BranchId": 0,
                "SubOrganizationId": 0,
                "DefaultBillingProviderId": 0,
                "Address1": "",
                "Address2": "",
                "Location": "",
                "StateId": "",
                "PinCode": "",
                "CountryId": "",
                "CityId": "",
                "DistrictRegion": "",
                "Latitude": "",
                "Longitude": "",
                "BranchEmail": "",
                "CountryCode": "",
                "mobilenum": "",
                "Active": "Y",
                "Doctors": [],
                "CommunicationCountryCode": "",
                "CommunicationMobileNo": ""
            };
            var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];

            BrachesList.unshift(EmptyClinicObj);

            $scope.mainBillerDataObj.AllBranchesList =angular.copy(BrachesList) || [];
            $scope.AllUserBranchesList = BrachesList;
            $scope.BranchesListArray = BrachesList;
            $scope.selectedBranch = $scope.BranchesListArray[0];
           

            $scope.clinicDoctorList = [];

            $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList, function (item) {
                return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
            });

            $scope.selectedBranch = $scope.defaultbranch[0];
            $scope.HospitalObj = $scope.defaultbranch[0];


            if ($scope.RoleId === 2 || $scope.RoleId === 10 || $scope.RoleId === 11 || $scope.RoleId === 58) {
                angular.forEach($scope.BranchesListArray, function (item, index) {
                    if (item.ClinicName !== "All Locations") {
                        if (item.ExtDetails.HospitalID === $scope.hospid) {
                            $scope.selectedBranch = item;
                            $scope.HospitalObj = item;
                        }
                    }
                });
            }
        }

     
        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                 
            }
        }

        /* GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);*/
        $scope.getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);

    }


    $scope.getAllOrgBillingProvider = function () {

        let params = {
            "OrganizationId": $scope.HospitalId || 0,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "FacilityCode": "",
            "PageNumber": 1,
            "PageSize": 200
        }

        eHnoteSettingsDataService.GetOrganizationBillingProviders(params).then(function (resp) {
            if (resp.data.Status == "Success") {
                resp.data.rows = resp.data.rows || [];
                resp.data.Masterrefundreasons = resp.data.Masterrefundreasons || [];
                if (resp.data.rows.length > 0) {
                    $scope.mainBillerDataObj.BillingProviderList = angular.copy(resp.data.rows);

                    console.log($scope.mainBillerDataObj.BillingProviderList);
                }
                if (resp.data.Masterrefundreasons.length > 0) {
                    $scope.mainBillerDataObj.Masterrefundreasons = angular.copy(resp.data.Masterrefundreasons);

                    console.log($scope.mainBillerDataObj.Masterrefundreasons);
                }
            } else {
                alertify.error(resp.data.Message);
            }

        }, function (err) {


        })
    }
 
    $scope.init = function () {

 

        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeNewBranches(NewBranchList);

        $scope.getAllOrgBillingProvider();

        //$scope.ClaimBillerSubTab = 1;
        //if ($scope.UserAccessRights.SubAccessCategories.BillerEncounters) {
        //    $scope.ClaimBillerSubTab = 1;
        //} else if ($scope.UserAccessRights.SubAccessCategories.BillerClaims) {
        //    $scope.ClaimBillerSubTab = 2;
        //} else if ($scope.UserAccessRights.SubAccessCategories.BillerPostings) {
        //    $scope.ClaimBillerSubTab = 3;
        //} else if ($scope.UserAccessRights.SubAccessCategories.BillerERA) {
        //    $scope.ClaimBillerSubTab = 4;
        //} else if ($scope.UserAccessRights.SubAccessCategories.BillerPatientStatements) {
        //    $scope.ClaimBillerSubTab = 8;
        //} else {

        //}

    };
    $scope.init();

    $scope.switchClaimBillerSubTab = function (pageno, EraId, Denialind, Approvedind, ERAStatusId) {
        $scope.ClaimBillerSubTab = pageno;
        $rootScope.ClaimBillerSubTab = pageno;
        EraId = EraId || 0;
        if (EraId != 0) {
            $scope.ReconcileEraId = EraId;
            $scope.isAllPaidDenial = Denialind;
            $scope.isApprovedInd = Approvedind;
          /*  $scope.ReconcileERAStatusId = ERAStatusId;*/
        } else {
            $scope.ReconcileEraId = 0;
            $scope.isAllPaidDenial = false;
            $scope.isApprovedInd = false;
          /*  $scope.ReconcileERAStatusId = ERAStatusId;*/
        }
    };

    $scope.navtoOpentheTabinNewTab = function (tabno) {
        $window.open("#/Biller/" + tabno, "_blank");
    }
    $scope.$on('billerTabSwitch', function (event, pageno) {
        $scope.switchClaimBillerSubTab(pageno);
    });
}]);
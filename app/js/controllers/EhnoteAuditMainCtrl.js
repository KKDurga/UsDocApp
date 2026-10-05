"use strict";
eHnoteWebApp.controller("EhnoteAuditMainCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "eHnoteAuditServices", "Lightbox", "$timeout", "$uibModal", "localStorageFactory", "eHnoteMainAppointmentService", "eHnoteUserDataService", "eHnoteSurgeryService", "$q", "eHnotePatientVisitReasonServices", "datapersistanceFactory", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, eHnoteAuditServices, Lightbox, $timeout, $uibModal, localStorageFactory, eHnoteMainAppointmentService, eHnoteUserDataService, eHnoteSurgeryService, $q, eHnotePatientVisitReasonServices, datapersistanceFactory) {
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.ParentObj.IsIOJParentOrganization;
    
    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path("/login");
        return;
    }

    var bLazy = new Blazy({});

    $scope.RoleId = userLoginDetails.RoleID;
    $scope.HospitalID = 0;
    $scope.ParentHospitalID = 0;
    $scope.AllUserBranchesList = [];
    $scope.BranchDoctorsList = [];
    $scope.patientsList = [];
    $scope.patientListIndex = 0;
    $scope.patientAuditDataArray = [];
    $scope.selectedpatientId = 0;
    $scope.selectedpatientName = "";
    //$scope.Tab = "AuditListing";
    $scope.ShowRecordSaving = false;

    $scope.PreAdmissionDetails = [];

    $scope.Tab = "AuditListing";
    if ($scope.UserAccessRights.SubAccessCategories.AuditList) {
        $scope.Tab = "AuditListing";
    } else if ($scope.UserAccessRights.SubAccessCategories.AuditNotifications) {
        $scope.Tab = "AuditNotifications";
    }


    $scope.switchTab = function (type) {
        $scope.Tab = type;
        if (type === "AuditNotifications") {
            if ($scope.SpecializationId === 2) {
                $scope.getDentalAuditnotificationDetails();
            } else {
                $scope.getAuditnotificationDetails();
            }
        }
    };
    $scope.DoctorID = doctorInfo.doctordata.User[0].DoctorID;
    var BrachesList = [];
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
    if (doctorInfo.doctordata.UserAddress !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
        $scope.HospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParentHospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;    
    }
    var d = new Date();
    $scope.patientPagesize = 20;
    //  $scope.patientPageno = 1;
    $scope.Patientmaxsize = 4;
    // $scope.SearchPatientText = "";

    $scope.currentPage = 1;
    $scope.itemsperpage = 250;

    $scope.generalImgUploads = [];
    $scope.generalPdfUploads = [];
    $scope.SearchPatientObject = {

        "AllHospitalsIndicator": 1,
        "HospitalId": $scope.ParentHospitalID,
        "HospitalObj": "",
        "AllDoctorsIndicator": 1,
        "DoctorId": 0,
        "DoctorObj": "",
        "SearchText": $scope.SearchPatientText ? $scope.SearchPatientText : "",
        "Mobile": $scope.SearchPatientText ? $scope.SearchPatientText : "",
        "FromDate": $filter("date")(new Date(d), "dd-MMMM-yyyy"),
        "ToDate": $filter("date")(new Date(d), "dd-MMMM-yyyy"),
        "PageSize": $scope.patientPagesize,
        "PageNumber": $scope.patientPageno ? $scope.patientPageno : 1
    };


    let BranchSettingsData = datapersistanceFactory.getItem("BranchSettingsData");
    $scope.IsShowEmptyASCChecklist = BranchSettingsData?.IsShowEmptyASCChecklist || false;

    $scope.auditAccess = {
        "auditNotificationAccess": false,
        "auditListAccess": false,
        "auditAllHospitalsData": false,
        "auditAllDoctorsData": false,
        "reviewConsultationAccess": false,
        "incentiveEligibleAccess": false
    };
    $scope.selectVisitType = "All";
    $scope.AllDoctorsObj = {
        "AllDoctorCheck": true,
        "AllVisitReasonsCheck": true,
        "AllAppointmentTypeStatusCheck": true,
        "AllAuthstatusCheck": false
    }
    $scope.LocationTypeObj = {
        "SelectLocationString": "All Locations",
        "Name": "",
        "AllLocationCheck": true
    };
    $scope.searchHospital = { "visitRsnName": "", "apptTypename": "" };
    $scope.GetStatus = function () {
        return [
            //    {
            //    "Id": 0,
            //    "Name": "All",
            //    "isChecked": true
            //},
            {
                "Id": 0,
                "Name": "Not Audited",
                "isChecked": false
            },
            {
                "Id": 1,
                "Name": "Failed",
                "isChecked": false
            },
            {
                "Id": 2,
                "Name": "Completed",
                "isChecked": false
            }
        ];
    };
    $scope.GetStatusList = angular.copy($scope.GetStatus());
    $scope.selectedAuditStatus = "Select";
    if ($scope.GetStatusList.length > 0) {
        var checkedArray = _.where($scope.GetStatusList, { isChecked: true });
        $scope.AllDoctorsObj.AllAuditstatusCheck = checkedArray.length > 0 && $scope.GetStatusList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedAuditStatus = "Select Status";
        } else {
            if (checkedArray.length === 1) {
                $scope.selectedAuditStatus = checkedArray[0].Name;
            } else {
                $scope.selectedAuditStatus = "Selected Status";
            }
        }
    }
    $scope.searchtxtb = { "txt12": "", "txt1": "" };
    $scope.PreauthStatusToggle = function (item) {
        var checkedArray = _.where($scope.GetStatusList, { isChecked: true });
        $scope.AllDoctorsObj.AllAuthstatusCheck = checkedArray.length > 0 && $scope.GetStatusList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedSuthStatus = "Select Status";
        } else {
            if (checkedArray.length === 1) {
                $scope.selectedSuthStatus = checkedArray[0].Name;
            } else {
                $scope.selectedSuthStatus = "Selected Status";
            }
        }
    };
    $scope.checkAllPreAuthStatus = function (val) {
        if (val) {
            angular.forEach($scope.GetStatusList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedSuthStatus = 'All Status';
        } else {
            angular.forEach($scope.GetStatusList, function (item) {
                item.isChecked = false;
            });

            $scope.selectedSuthStatus = 'Select Status';
        }
        var checkedArray = _.where($scope.GetStatusList, { isChecked: true });
        $scope.AllDoctorsObj.AllAuthstatusCheck = checkedArray.length > 0 && $scope.GetStatusList.length === checkedArray.length ? true : false;

    };
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }

    $scope.pageChangedEvent = function (pageNo) {
        $scope.currentPage = pageNo;
        $scope.GetAllAuditAscAppointmentsList();
    };

    $scope.checkAllAppointmenTypeStatus = function (val) {
        if (val) {
            angular.forEach($scope.appointmentTypes, function (item) {
                item.isChecked = true;
            });

            $scope.selectVisitType = 'All';
        }
        else {
            angular.forEach($scope.appointmentTypes, function (item) {
                item.isChecked = false;
            });

            $scope.selectVisitType = 'All Visit Types';
        }
        var checkedArray = _.where($scope.appointmentTypes, { isChecked: true });
        $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = checkedArray.length > 0 && $scope.appointmentTypes.length === checkedArray.length ? true : false;

        if ($scope.mainAppointmentView.isCalendarorList == "list") {
            if (!$scope.IsDynamicCheckInMandatory) {
                $scope.loadAppointments($scope.selectedDoctor, '');
            }
        } 
    };

    function getDoctorsbySubSpecializations(branchId) {

        console.log(branchId);
        var branchesList = [];
        $scope.clinicDoctorList = [];
        $scope.allUserList = [];
        $scope.selectedDoctor = "";
        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")(BrachesList, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {


            var TempAppListdoctoraddress = $filter("filter")(BrachesList, function (iterator, ind) { return iterator.ClinicId === branchId; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        }




        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": hospitalID,
            "SubSpecializationIdArray": subSplArray
        }

        console.log(JSON.stringify(reqObj));
        //return false;
        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
     
    }
    function onGetUsersSuccess(resp) {
        console.log(resp);
        if (resp.rows.length > 0) {
            $scope.allUserList = resp.rows;
            var RoleID = userLoginDetails.RoleID;


            $scope.AllUserBranchesList = BrachesList;
            $scope.BranchDoctorsList = $scope.allUserList;


            $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43;
            });
            var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
            $scope.BranchDoctorsList.unshift(docAll);
            $scope.BranchDoctorsList.unshift(docAll);

            var currentClinic = doctorInfo.doctordata.UserAddress[0];
            if ($scope.AllUserBranchesList.length > 0) {
                angular.forEach($scope.AllUserBranchesList, function (value, key) {
                    if ($scope.BranchDoctorsList.length > 0) {
                        $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) {
                            return p.DoctorID;
                        });
                    }
                });
            }
            $scope.SearchPatientObject.HospitalObj = $scope.AllUserBranchesList[0];
            $scope.SearchPatientObject.HospitalId = $scope.AllUserBranchesList[0].ClinicId;
            $scope.SearchPatientObject.AllHospitalsIndicator = 1;
            $scope.SearchPatientObject.DoctorObj = $scope.BranchDoctorsList[0];
            $scope.SearchPatientObject.DoctorId = $scope.BranchDoctorsList[0].DoctorID;
            if ($scope.RoleId === 1) {
                $scope.SearchPatientObject.AllDoctorsIndicator = 0;
            } else {
                $scope.SearchPatientObject.AllDoctorsIndicator = 1;
            }
            //getpatients();
            $scope.MultiselectDoctorlist = [];
            if ($scope.allUserList.length > 0) {

                angular.forEach($scope.allUserList, function (kitem) {
                    if (kitem.RoleId === 1 || kitem.RoleId === 43) {
                        kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.SecondUserFullName;
                        $scope.MultiselectDoctorlist.push(kitem);
                    }
                });

                let tempArray = $filter('filter')($scope.MultiselectDoctorlist, { 'DoctorID': $scope.UserId }, true);
                tempArray = tempArray || [];
                if ($scope.RoleId === 1 || $scope.RoleId === 43) {
                    //if (tempArray.length > 0) {
                    //    angular.forEach($scope.MultiselectDoctorlist, function (item) {
                    //        if (item.DoctorID == $scope.UserId) {
                    //            item.isChecked = true;
                    //        } else {
                    //            item.isChecked = false;
                    //        }
                    //    });
                    //    $scope.AllDoctorsObj.AllDoctorCheck = false;
                    //} else {
                        angular.forEach($scope.MultiselectDoctorlist, function (item) {
                            item.isChecked = true;
                        });
                    /*}*/
                    $scope.selectedDoctors = 'Selected';
                    
                } else {
                    angular.forEach($scope.MultiselectDoctorlist, function (item) {
                        item.isChecked = true;
                    });

                    $scope.AllDoctorsObj.AllDoctorCheck = true;
                    $scope.selectedDoctors = 'Selected';
                }

                $scope.selectedAuditlist = eHnoteMasterDataService.getSelectedAscAuditPopUp() || '';
                if ($scope.selectedAuditlist != '') {
                    $scope.selectedAuditlist.FromDate = $scope.selectedAuditlist.FromDate || '';
                    $scope.selectedAuditlist.ToDate = $scope.selectedAuditlist.ToDate || '';
                    if ($scope.selectedAuditlist.ToDate != '') {
                        $scope.SearchObj.ToDate = $scope.selectedAuditlist.ToDate || '';
                    }
                    if ($scope.selectedAuditlist.FromDate != '') {
                        $scope.SearchObj.FromDate = $scope.selectedAuditlist.FromDate || '';
                    }



                    $scope.selectedAuditlist.ApptBranchLocations = $scope.selectedAuditlist.ApptBranchLocations || '';
                    if ($scope.selectedAuditlist.ApptBranchLocations != '') {
                        $scope.AppListselectedclinic.ClinicId = $scope.selectedAuditlist.ApptBranchLocations || '';
                    }

                    $scope.selectedAuditlist.SelectedDoctorsList = $scope.selectedAuditlist.SelectedDoctorsList || '';
                    if ($scope.selectedAuditlist.SelectedDoctorsList.length > 0) {
                        angular.forEach($scope.MultiselectDoctorlist, function (item) {
                            item.isChecked = false;
                        });

                        angular.forEach($scope.selectedAuditlist.SelectedDoctorsList, function (sditem) {
                            let tempArray = $filter('filter')($scope.MultiselectDoctorlist, { 'DoctorID': sditem.DoctorID }, true) || [];
                            //    item.isChecked = false;
                            if (tempArray.length > 0) {
                                tempArray[0].isChecked = sditem.isChecked||true;
                            }
                        });
                        let checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
                        $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray.length ? true : false;

                    }

                    $scope.selectedAuditlist.Visitreasons = $scope.selectedAuditlist.Visitreasons || '';
                    if ($scope.selectedAuditlist.Visitreasons.length > 0) {
                        angular.forEach($scope.Visitreasons, function (item) {
                            item.isChecked = false;
                        });

                        angular.forEach($scope.selectedAuditlist.Visitreasons, function (sditem) {
                            let tempArray = $filter('filter')($scope.Visitreasons, { 'ParentAppointmentVisitReasonId': sditem.ParentAppointmentVisitReasonId }, true) || [];
                            //    item.isChecked = false;
                            if (tempArray.length > 0) {
                                tempArray[0].isChecked = sditem.isChecked ||true;
                            }
                        });
                        let checkedArray = _.where($scope.Visitreasons, { isChecked: true });
                        $scope.AllDoctorsObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.Visitreasons.length === checkedArray.length ? true : false;

                    }

                    $scope.selectedAuditlist.AuditStatusFilterArray = $scope.selectedAuditlist.AuditStatusFilterArray || '';
                    if ($scope.selectedAuditlist.AuditStatusFilterArray.length > 0) {
                        angular.forEach($scope.GetStatusList, function (item) {
                            item.isChecked = false;
                        });

                        angular.forEach($scope.selectedAuditlist.AuditStatusFilterArray, function (sditem) {
                            let tempArray = $filter('filter')($scope.GetStatusList, { 'Id': sditem.Id }, true) || [];
                            //    item.isChecked = false;
                            if (tempArray.length > 0) {
                                tempArray[0].isChecked = sditem.isChecked ||true;
                            }
                        });


                    }

                }
                $scope.GetAllAuditAscAppointmentsList();
            }
        } else {
            alertify.error("No Users Found in Selected Departments");
            $scope.mainBookedAppointmentList = [];
        }


    }

    function onGetUsersFailure(data) {
    }    
    $scope.GetParentOrgVisitReasons = function () {

        var params = {
            "ParentOrganizationId": $scope.ParentHospitalID || 0
        }
        eHnotePatientVisitReasonServices.GetParentOrgApptVisitReasons(params).then(function (resp) {

            if (resp.data.rows.length > 0) {
                $scope.Visitreasons = resp.data.rows || [];
                $scope.Visitreasons = $filter('filter')($scope.Visitreasons, { 'AppointmentTypeId': 4 }, true);

                if ($scope.Visitreasons.length > 0) {
                    angular.forEach($scope.Visitreasons, function (item) {
                        item.isChecked = true;
                        item.ReasonId = item.ParentAppointmentVisitReasonId || 0;
                        item.Reason = item.AppointmentVisitReason || '';
                    });
                }

                $scope.AllDoctorsObj.AllVisitReasonsCheck = true;
                $scope.selectedVisitReason = 'All Visit Reasons';
            }
        })
    }
    //$scope.GetParentOrgVisitReasons();
    function GetBranchSubSpecializations(SubOrganizationId, BranchId) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                console.log($scope.allSubSpecializationsArray);
                getDoctorsbySubSpecializations(BranchId);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                $scope.MultiselectDoctorlist = [];
                $scope.AscAppointmentsList = [];
                alertify.error("No Departments are been added");
            }


        });
    };
    $scope.mainAscParentObj = {
        "AllBranchesList": [],
        "IsAscBranchAvailable": false
    }
    function initializeNewBranches(data) {

        BrachesList = []

        BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];



        var EmptyClinicObj = {
            "ClinicName": "All Locations",
            "ClinicId": 0,
            "BranchName": "All Locations",
            "BranchId": 0,
            "SubOrganizationId": 0,
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
        BrachesList.unshift(EmptyClinicObj);

        $scope.BranchesListArray = BrachesList;
        $scope.selectedBranch = $scope.BranchesListArray[0];
        
   
        $scope.ApptBranchLocations = BrachesList;

        $scope.AppListdoctoraddress = BrachesList;
        let AscBranchArray = $filter('filter')($scope.AppListdoctoraddress, { 'IsASCBranch': true }, true) || [];
        if (AscBranchArray.length > 0) {
            $scope.mainAscParentObj.IsAscBranchAvailable = true;
            $scope.AppListdoctoraddress = AscBranchArray;
            $scope.ApptBranchLocations = AscBranchArray;
            if ($scope.AppListdoctoraddress.length > 0) {
            $scope.AppListselectedclinic = $scope.AppListdoctoraddress[0] || {};
                $scope.LocationTypeObj.SelectLocationString = $scope.AppListdoctoraddress[0].BranchName || '';
            }
        }
        else {
            $scope.AppListselectedclinic = doctorInfo.doctordata.UserAddress[0] || {};
        }

        var RoleID = userLoginDetails.RoleID;

        if (RoleID !== 1 && RoleID !== 56) {

            $scope.clinicDoctorList = [];
            //$scope.AppListdoctoraddress = BrachesList;

            $scope.defaultbranch = $filter("filter")($scope.BranchesListArray, function (item) {
                console.log($scope.HospitalID);
                return item.BranchId === $scope.HospitalID;
            });

            $scope.selectedBranch = $scope.defaultbranch[0];
        //    $scope.AppListselectedclinic = $scope.defaultbranch[0];
        }

        if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
            angular.forEach($scope.BranchesListArray, function (item, index) {
                if (item.ClinicName !== "All Locations") {
                    if (item.ExtDetails.HospitalID === $scope.hospid) {
                        $scope.selectedBranch = item;
                        $scope.AppListselectedclinic = item;
                    }
                }
            });
        }

        $scope.selectedBranch.BranchId = $scope.selectedBranch.BranchId || 0;
        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                $scope.AppListselectedclinic.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);

    }

    
    $scope.init = function () {
        $scope.ApptBranchLocations = [];
        $scope.Visitreasons = [];
        var params = {
            "ParentOrganizationId": $scope.ParentHospitalID || 0
        }
        $q.all([
            eHnotePatientVisitReasonServices.GetParentOrgApptVisitReasons(params),

        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                $scope.Visitreasons = resp[0].data.rows || [];
                $scope.Visitreasons = $filter('filter')($scope.Visitreasons, { 'AppointmentTypeId': 4 }, true);

                if ($scope.Visitreasons.length > 0) {
                    angular.forEach($scope.Visitreasons, function (item) {
                        item.isChecked = true;
                        item.ReasonId = item.ParentAppointmentVisitReasonId || 0;
                        item.Reason = item.AppointmentVisitReason || '';
                    });
                    $scope.AllDoctorsObj.AllVisitReasonsCheck = true;
                    $scope.selectedVisitReason = 'All Visit Reasons';
                }
                if (userLoginDetails.RoleID === 1) {
                    if (doctorInfo !== null && doctorInfo.doctordata !== null) {
                        if (doctorInfo.doctordata.UserAddress !== null) {
                            var AllUserBranchesList = doctorInfo.doctordata.UserAddress;
                            for (var i = 0; i < AllUserBranchesList.length; i++) {
                                if (AllUserBranchesList[i].Active === "Y") {
                                    BrachesList.push(AllUserBranchesList[i]);
                                }
                            }
                        }
                    }
                    $scope.BranchDoctorsList = [];
                    var countryCode = "";
                    if (doctorInfo.doctordata.UserPhone !== undefined) {
                        countryCode = doctorInfo.doctordata.UserPhone[0].PhCntryCD;
                    }
                    var clinicObj = {
                        "FullName": doctorInfo.doctordata.User[0].FullName,
                        "DoctorID": doctorInfo.doctordata.User[0].DoctorID,
                        "EmailId": doctorInfo.doctordata.UserEmail[0].EmailID,
                        "MobileNo": doctorInfo.doctordata.UserAddress[0].MobileNo,
                        "CountryCode": countryCode,
                        "Gender": doctorInfo.doctordata.User[0].Gender,
                        "UserBranchId": doctorInfo.doctordata.UserAddress[0].UserBranchId,
                        "Active": "Y",
                        "SpecializationId": doctorInfo.doctordata.User[0].SpecializationId,
                        "MinPerCase": doctorInfo.doctordata.UserAddress[0].ExtDetails.MinPerCase,
                        "RoleId": doctorInfo.doctordata.UserAddress[0].ExtDetails.RoleID,
                        "ClinicName": doctorInfo.doctordata.UserAddress[0].ClinicName,
                        "BranchEmail": doctorInfo.doctordata.UserAddress[0].BranchEmail
                    };
                    $scope.BranchDoctorsList.push(clinicObj);

                    //var brancList = localStorageFactory.getItem('allHospitalsDoctorsData');

                    //OnGetDoctorSuccess(brancList);

                    var data = localStorageFactory.getItem("allBranchesData") || [];
                    initializeNewBranches(data);

                }
                else {
                    //var brancList = localStorageFactory.getItem('allHospitalsDoctorsData');

                    //OnGetDoctorSuccess(brancList);
                    var data = localStorageFactory.getItem("allBranchesData") || [];
                    initializeNewBranches(data);
                }
            }
        })
    };
    $scope.init();
    function OnGetDoctorSuccess(data) {
        InitializeBranches(data);
    }
    function OnGetDoctorError(msg) {
        alertify.error("Error in Getting Doctors");
    }
    function InitializeBranches(data) {
        BrachesList = [];
        if (data.length !== 0) {
            angular.forEach(data, function (item, index) {
                if (item.DoctorDetails !== undefined) {
                    if (item.HospitalInfo.HospitalDetails.ActiveIND === "Y" && item.DoctorDetails.length > 0) {
                        item = {
                            "ClinicName": item.HospitalInfo.HospitalDetails.HospitalName,
                            "OrgGSTNO": item.HospitalInfo.HospitalDetails.OrgGSTNO || "",
                            "ClinicId": item.HospitalInfo.HospitalDetails.HospitalID,
                            "Address1": item.HospitalInfo.HospitalAddress.Address1 || "",
                            "Address2": item.HospitalInfo.HospitalAddress.Address2 || "",
                            "Area": item.HospitalInfo.HospitalAddress.Location || "",
                            "Location": item.HospitalInfo.HospitalAddress.Location,
                            "CityTown": item.HospitalInfo.HospitalAddress.CityTown,
                            "State": item.HospitalInfo.HospitalAddress.State,
                            "PinCode": item.HospitalInfo.HospitalAddress.PinCode,
                            "Country": item.HospitalInfo.HospitalAddress.Country,
                            "CountryCode": item.DoctorDetails[0].CountryCode,
                            "mobilenum": item.DoctorDetails[0].MobileNo,
                            "Active": item.HospitalInfo.HospitalDetails.ActiveIND,
                            "Doctors": item.DoctorDetails,
                            "ExtDetails": {
                                "HospitalID": item.HospitalInfo.HospitalDetails.HospitalID,
                                "PrimaryIND": "Y",
                                "AddressCommunication": [],
                                "HospitalInfo": {
                                    "HospitalID": item.HospitalInfo.HospitalDetails.HospitalID,
                                    "ParentHospitalID": item.HospitalInfo.HospitalDetails.ParentHospitalID,
                                    "HospitalCode": "",
                                    "BranchCode": "",
                                    "Preference": {}
                                }
                            }
                        };
                        BrachesList.push(item);
                    }
                }
            });
            var EmptyClinicObj = {
                "ClinicName": "All Locations",
                "ClinicId": 0,
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
                "Doctors": []
            };
            BrachesList.unshift(EmptyClinicObj);
        }
        InitialiseBranchDoctor();
    }
    function InitialiseBranchDoctor() {
        $scope.AllUserBranchesList = [];
        var item = doctorInfo.doctordata.UserAddress[0];
        if ($scope.RoleId === 1) {
            BrachesList = [];
            var EmptyClinicObj = {
                "ClinicName": "All Locations",
                "ClinicId": 0,
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
                "Doctors": []
            };
            BrachesList.unshift(EmptyClinicObj);
            if (doctorInfo !== null && doctorInfo.doctordata !== null) {
                if (doctorInfo.doctordata.UserAddress !== null) {
                    var appListdoctoraddress = doctorInfo.doctordata.UserAddress;
                    for (var i = 0; i < appListdoctoraddress.length; i++) {
                        if (appListdoctoraddress[i].Active === "Y") {
                            BrachesList.push(appListdoctoraddress[i]);
                        }
                    }
                }
            }
            $scope.AllUserBranchesList = BrachesList;
            $scope.clinicDoctorList = [];
            var countryCode = "";
            if (doctorInfo.doctordata.UserPhone !== undefined) {
                countryCode = doctorInfo.doctordata.UserPhone[0].PhCntryCD;
            }
            var docObj = {
                "FullName": doctorInfo.doctordata.User[0].FullName,
                "DoctorID": doctorInfo.doctordata.User[0].DoctorID,
                "EmailId": doctorInfo.doctordata.UserEmail[0].EmailID,
                "MobileNo": doctorInfo.doctordata.UserAddress[0].MobileNo,
                "CountryCode": countryCode,
                "Gender": doctorInfo.doctordata.User[0].Gender,
                "UserBranchId": doctorInfo.doctordata.UserAddress[0].UserBranchId,
                "Active": "Y",
                "SpecializationId": doctorInfo.doctordata.User[0].SpecializationId,
                "MinPerCase": doctorInfo.doctordata.UserAddress[0].ExtDetails.MinPerCase,
                "RoleId": doctorInfo.doctordata.UserAddress[0].ExtDetails.RoleID,
                "ClinicName": doctorInfo.doctordata.UserAddress[0].ClinicName,
                "BranchEmail": doctorInfo.doctordata.UserAddress[0].BranchEmail
            };
            $scope.BranchDoctorsList.push(docObj);
        } else {
            $scope.AllUserBranchesList = BrachesList;
            for (var i = 0; i < $scope.AllUserBranchesList.length; i++) {
                if ($scope.AllUserBranchesList[i].Doctors !== undefined && $scope.AllUserBranchesList[i].Doctors.length > 0) {
                    for (var j = 0; j < $scope.AllUserBranchesList[i].Doctors.length; j++) {
                        $scope.BranchDoctorsList.push($scope.AllUserBranchesList[i].Doctors[j]);
                    }
                }
            }
            $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43;
            });
            var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
            $scope.BranchDoctorsList.unshift(docAll);
            $scope.BranchDoctorsList.unshift(docAll);
        }
        var currentClinic = doctorInfo.doctordata.UserAddress[0];
        if ($scope.AllUserBranchesList.length > 0) {
            angular.forEach($scope.AllUserBranchesList, function (value, key) {
                if (currentClinic.ExtDetails !== undefined && currentClinic.ExtDetails.HospitalID !== undefined && value.ExtDetails !== undefined && value.ExtDetails.HospitalID !== undefined && currentClinic.ExtDetails.HospitalID === value.ExtDetails.HospitalID) {
                    if ($scope.BranchDoctorsList.length > 0) {
                        $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) {
                            return p.DoctorID;
                        });
                    }
                }
            });
        }
        $scope.SearchPatientObject.HospitalObj = $scope.AllUserBranchesList[0];
        $scope.SearchPatientObject.HospitalId = $scope.AllUserBranchesList[0].ClinicId;
        $scope.SearchPatientObject.AllHospitalsIndicator = 1;
        $scope.SearchPatientObject.DoctorObj = $scope.BranchDoctorsList[0];
        $scope.SearchPatientObject.DoctorId = $scope.BranchDoctorsList[0].DoctorID;
        if ($scope.RoleId === 1) {
            $scope.SearchPatientObject.AllDoctorsIndicator = 0;
        } else {
            $scope.SearchPatientObject.AllDoctorsIndicator = 1;
        }
        getpatients();
    }
    Array.prototype.unique = function () {
        var a = this.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i].$$hashKey) {
                    delete a[i].$$hashKey;
                }
                if (a[j].$$hashKey) {
                    delete a[j].$$hashKey;
                }
                if (a[i] === a[j]) {
                    a.splice(j--, 1);
                }
            }
        }
        return a;
    };
    $scope.ReloadDoctors = function (doctorslist) {
        var docAll = {};
        $scope.BranchDoctorsList = angular.copy(doctorslist);
        $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
            return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43;
        });
        if ($scope.BranchDoctorsList.length > 0) {
            docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
            $scope.BranchDoctorsList.unshift(angular.copy(docAll));
        } else {
            if ($scope.RoleId !== 1) {
                docAll = { "DoctorID": 0, "FullName": "No Docotors", "AddressID": 0, "MinPerCase": 15 };
                $scope.BranchDoctorsList.push(angular.copy(docAll));
            }
        }
        $scope.SearchPatientObject.DoctorObj = $scope.BranchDoctorsList[0];
        $scope.SearchPatientObject.DoctorId = $scope.BranchDoctorsList[0].DoctorID;
    };
    $scope.ChangeHospital = function (item) {
        var doctorslist = [];
        $scope.SearchPatientObject.HospitalObj = item;
        $scope.SearchPatientObject.HospitalId = item.ClinicId;
        if (item.ClinicId === 0) {
            angular.forEach($scope.AllUserBranchesList, function (item, index) {
                var tempdoctors = item.Doctors || [];
                doctorslist = doctorslist.concat(tempdoctors);
            });
            $scope.SearchPatientObject.AllHospitalsIndicator = 1;
        } else {
            doctorslist = item.Doctors || [];
            $scope.SearchPatientObject.AllHospitalsIndicator = 0;
        }
        if ($scope.RoleId !== 1) {
            $scope.ReloadDoctors(doctorslist);
        }
    };
    $scope.ChangeDoctor = function (doctorobj) {
        $scope.SearchPatientObject.DoctorObj = doctorobj;
        $scope.SearchPatientObject.DoctorId = doctorobj.DoctorID;
        $scope.SearchPatientObject.AllDoctorsIndicator = 0;
        if (doctorobj.DoctorID === 0) {
            $scope.SearchPatientObject.AllDoctorsIndicator = 1;
        }
    };
    $scope.getPatientAuditData = function (item, index) {
        $scope.patientListIndex = index;
        $scope.selectedpatientId = item.PatientId;
        $scope.selectedpatientName = item.PatientName;
        var params = {
            "PatientId": item.PatientId,
            "AllHospitalsIndicator": $scope.SearchPatientObject.AllHospitalsIndicator,
            "HospitalId": $scope.SearchPatientObject.HospitalId,
            "AllDoctorsIndicator": $scope.SearchPatientObject.AllDoctorsIndicator,
            "DoctorId": $scope.SearchPatientObject.DoctorId,
            "PageSize": 10,
            "PageNumber": 1,
            "SpecializationId": $scope.SpecializationId
        };
        eHnoteAuditServices.getpatientAuditdata(params, ongetpatientAuditdataSuccess, ongetpatientAuditdataError);
        eHnoteAuditServices.getPatientDetailsById(item.PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
    };
    function ongetpatientAuditdataSuccess(data) {
        $scope.patientAuditDataArray = [];
        if (data !== undefined) {
            if (data.count > 0) {
                if ($scope.RoleId === 1) {
                    if (data.rows.length > 0) {
                        angular.forEach(data.rows, function (item) {
                            if (item.OverallAuditRemarks !== "" || item.AuditorVoiceRecords.length > 0) {
                                $scope.patientAuditDataArray.push(item);
                            }
                        });
                    }
                } else {
                    $scope.patientAuditDataArray = data.rows;
                }
                angular.forEach($scope.patientAuditDataArray, function (mainitem, index) {
                    mainitem.generalImgUploads = [];
                    mainitem.generalPdfUploads = [];
                    mainitem.showAuditorTextNoteDiv = false;
                    mainitem.showAuditorVoiceNoteDiv = false;
                    mainitem.showDoctorTextNoteDiv = false;
                    mainitem.showDoctorVoiceNoteDiv = false;
                    mainitem.seconds = 0;
                    mainitem.minutes = 0;
                    mainitem.RecordingStarted = false;
                    mainitem.RecorderPaused = true;
                    mainitem.RecorderReset = true;
                    mainitem.RecorderPauseClicked = false;
                    if (mainitem.DoctorIncentiveEligibleInd) {
                        var checkBox = "chkIncEligible" + index;
                        $("input[name=checkBox]").attr("checked", true);
                    } else {
                        var checkBox = "chkIncEligible" + index;
                        $("input[name=checkBox]").attr("checked", false);
                    }
                    mainitem.OverallAuditRemarks = mainitem.OverallAuditRemarks || "";
                    mainitem.AuditModifiedTime = mainitem.AuditModifiedTime || "";
                    mainitem.showAuditNotesEditIcon = false;
                    mainitem.showDoctorReplyEditIcon = false;
                    mainitem.isAuditTextRemarksAvail = false;
                    mainitem.IsAuditEditMode = false;
                    mainitem.IsDoctorReplyEditMode = false;
                    mainitem.isDoctorRemarksAvail = false;
                    mainitem.showDelAuditorVocie = false;
                    if ($scope.RoleId !== 1) {
                        if (mainitem.OverallAuditRemarks === "") {
                            mainitem.IsAuditEditMode = true;
                        } else {
                            mainitem.showAuditorTextNoteDiv = true;
                            mainitem.isAuditTextRemarksAvail = true;
                        }
                        if (mainitem.DoctorReplyMessage === "") {
                            mainitem.isDoctorRemarksAvail = false;
                        } else {
                            mainitem.showDoctorTextNoteDiv = true;
                            mainitem.isDoctorRemarksAvail = true;
                        }
                        if (mainitem.AuditorVoiceRecords.length > 0) {
                            mainitem.showAuditorVoiceNoteDiv = true;
                            mainitem.showDelAuditorVocie = true;
                        }
                        if (mainitem.DoctorVoiceRecords.length > 0) {
                            mainitem.showDoctorVoiceNoteDiv = true;
                        }
                    } else {
                        if (mainitem.OverallAuditRemarks === "") {
                        } else {
                            mainitem.showAuditorTextNoteDiv = true;
                            mainitem.isAuditTextRemarksAvail = true;
                        }
                        if (mainitem.DoctorReplyMessage === "") {
                            mainitem.isDoctorRemarksAvail = false;
                        } else {
                            mainitem.showDoctorTextNoteDiv = true;
                            mainitem.isDoctorRemarksAvail = true;
                        }
                        if (mainitem.AuditorVoiceRecords.length > 0) {
                            mainitem.showAuditorVoiceNoteDiv = true;
                        }
                        if (mainitem.DoctorVoiceRecords.length > 0) {
                            mainitem.showDoctorVoiceNoteDiv = true;
                        }
                    }
                    if (mainitem.AuditorId === $scope.UserId) {
                        mainitem.showAuditNotesEditIcon = true;
                    }
                    if (mainitem.AppointmentDoctorId === $scope.UserId) {
                        mainitem.showDoctorReplyEditIcon = true;
                    }
                    //mainitem.showDoctorReply = false;
                    //if (mainitem.DoctorReplyMessage=="") {
                    //    mainitem.showDoctorReply = false;
                    //    if($scope.RoleId==1){
                    //        mainitem.isAddDotorReply = true;
                    //    } else {
                    //        mainitem.isAddDotorReply = false;
                    //    }
                    //} else {
                    //    mainitem.showDoctorReply = true;
                    //    mainitem.isAddDotorReply = true;
                    //}
                    if (mainitem.FileUploads !== undefined && mainitem.FileUploads.length > 0) {

                        if (mainitem.FileUploads.length > 0) {
                            var filteredArray = mainitem.FileUploads;
                            for (var i = 0; i < filteredArray.length; i++) {
                                $scope.docname = "";
                                filteredArray[i].docNameDisplay = '';
                                var extension = ".jpg";
                                if (filteredArray[i].FileName) {
                                    extension = filteredArray[i].FileName.split(".")[1];
                                }
                                var pName = filteredArray[i].FileName.split("_")[0];
                                if (pName.length > 9) {
                                    name = pName.substring(0, 9) + "..." + "." + extension;
                                }
                                else {
                                    name = angular.copy(pName) + "." + extension;
                                }
                                filteredArray[i].docNameDisplay = name;

                                if (filteredArray[i].S3URL.indexOf(".pdf") > -1) {
                                    mainitem.generalPdfUploads.push(filteredArray[i]);

                                } else {

                                    mainitem.generalImgUploads.push(filteredArray[i]);


                                }
                            }
                        }

                        angular.forEach(mainitem.FileUploads, function (item) {
                            item.isEditRemarks = false;
                            item.isAddRemarks = false;
                            item.isAuditRemarksAvail = false;
                            item.showSaveCancel = false;
                            if (item.AuditRemarks === "" || item.AuditRemarks === undefined || item.AuditRemarks === null) {
                                item.isAddRemarks = true;
                            } else {
                                item.isAuditRemarksAvail = true;
                            }
                        });
                    }
                });
            }
        }
    }
    function ongetpatientAuditdataError(error) {
        console.log(error);
    }
    $scope.dentalPatientAuditDataArray = [];
    $scope.getDentalPatientAuditData = function (item, index) {
        $scope.dentalPatientAuditDataArray = [];
        $scope.patientListIndex = index;
        $scope.selectedpatientId = item.PatientId;
        $scope.selectedpatientName = item.PatientName;
        var params = {
            "PatientId": item.PatientId,
            "PageSize": 5,
            "PageNumber": 1
        };
        eHnoteAuditServices.getpatientAuditdataForDental(params, ongetdentalpatientAuditdataSuccess, ongetdentalpatientAuditdataError);
        eHnoteAuditServices.getPatientDetailsById(item.PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
    };

    function ongetdentalpatientAuditdataSuccess(data) {
        $scope.dentalPatientAuditDataArray = [];

        if (data !== undefined) {
            if (data.length > 0) {
                $scope.dentalPatientAuditDataArray = angular.copy(data);
                if ($scope.RoleId === 1) {
                    if (data.length > 0) {
                        angular.forEach(data, function (item) {
                            if (item.OverallAuditRemarks !== "" || item.AuditorVoiceRecords.length > 0) {
                                $scope.dentalPatientAuditDataArray.push(item);
                            }
                        });
                    }
                } else {
                    $scope.dentalPatientAuditDataArray = angular.copy(data);
                }
                angular.forEach($scope.dentalPatientAuditDataArray, function (mainitem, index) {
                    mainitem.generalImgUploads = [];
                    mainitem.generalPdfUploads = [];
                    mainitem.showAuditorTextNoteDiv = false;
                    mainitem.showAuditorVoiceNoteDiv = false;
                    mainitem.showDoctorTextNoteDiv = false;
                    mainitem.showDoctorVoiceNoteDiv = false;
                    mainitem.seconds = 0;
                    mainitem.minutes = 0;
                    mainitem.RecordingStarted = false;
                    mainitem.RecorderPaused = true;
                    mainitem.RecorderReset = true;
                    mainitem.RecorderPauseClicked = false;
                    if (mainitem.ConversionDoctorEligibleInd) {
                        var checkBox = "chkIncEligibleConv" + index;
                        $("input[name=checkBox]").attr("checked", true);
                    } else {
                        var checkBox = "chkIncEligibleConv" + index;
                        $("input[name=checkBox]").attr("checked", false);
                    }
                    if (mainitem.TreatmentDoctorIncentiveEligibleInd) {
                        var checkBox = "chkIncEligibleTreat" + index;
                        $("input[name=checkBox]").attr("checked", true);
                    } else {
                        var checkBox = "chkIncEligibleTreat" + index;
                        $("input[name=checkBox]").attr("checked", false);
                    }
                    mainitem.OverallAuditRemarks = mainitem.OverallAuditRemarks || "";
                    mainitem.AuditModifiedTime = mainitem.AuditModifiedTime || "";
                    mainitem.showAuditNotesEditIcon = false;
                    mainitem.showDoctorReplyEditIcon = false;
                    mainitem.isAuditTextRemarksAvail = false;
                    mainitem.IsAuditEditMode = false;
                    mainitem.IsDoctorReplyEditMode = false;
                    mainitem.isDoctorRemarksAvail = false;
                    mainitem.showDelAuditorVocie = false;
                    if ($scope.RoleId !== 1) {
                        if (mainitem.OverallAuditRemarks === "") {
                            mainitem.IsAuditEditMode = true;
                        } else {
                            mainitem.showAuditorTextNoteDiv = true;
                            mainitem.isAuditTextRemarksAvail = true;
                        }
                        if (mainitem.DoctorReplyMessage === "") {
                            mainitem.isDoctorRemarksAvail = false;
                        } else {
                            mainitem.showDoctorTextNoteDiv = true;
                            mainitem.isDoctorRemarksAvail = true;
                        }
                        if (mainitem.AuditorVoiceRecords.length > 0) {
                            mainitem.showAuditorVoiceNoteDiv = true;
                            mainitem.showDelAuditorVocie = true;
                        }
                        if (mainitem.DoctorVoiceRecords.length > 0) {
                            mainitem.showDoctorVoiceNoteDiv = true;
                        }
                    } else {
                        if (mainitem.OverallAuditRemarks === "") {
                        } else {
                            mainitem.showAuditorTextNoteDiv = true;
                            mainitem.isAuditTextRemarksAvail = true;
                        }
                        if (mainitem.DoctorReplyMessage === "") {
                            mainitem.isDoctorRemarksAvail = false;
                        } else {
                            mainitem.showDoctorTextNoteDiv = true;
                            mainitem.isDoctorRemarksAvail = true;
                        }
                        if (mainitem.AuditorVoiceRecords.length > 0) {
                            mainitem.showAuditorVoiceNoteDiv = true;
                        }
                        if (mainitem.DoctorVoiceRecords.length > 0) {
                            mainitem.showDoctorVoiceNoteDiv = true;
                        }
                    }
                    if (mainitem.AuditorId === $scope.UserId) {
                        mainitem.showAuditNotesEditIcon = true;
                    }
                    if (mainitem.AppointmentDoctorId === $scope.UserId) {
                        mainitem.showDoctorReplyEditIcon = true;
                    }
                    if (mainitem.FileUploads !== undefined && mainitem.FileUploads.length > 0) {

                        if (mainitem.FileUploads.length > 0) {
                            var filteredArray = mainitem.FileUploads;
                            for (var i = 0; i < filteredArray.length; i++) {
                                $scope.docname = "";
                                filteredArray[i].docNameDisplay = '';
                                var extension = ".jpg";
                                if (filteredArray[i].FileName) {
                                    extension = filteredArray[i].FileName.split(".")[1];
                                }
                                var pName = filteredArray[i].FileName.split("_")[0];
                                if (pName.length > 9) {
                                    name = pName.substring(0, 9) + "..." + "." + extension;
                                }
                                else {
                                    name = angular.copy(pName) + "." + extension;
                                }
                                filteredArray[i].docNameDisplay = name;

                                if (filteredArray[i].S3URL.indexOf(".pdf") > -1) {
                                    mainitem.generalPdfUploads.push(filteredArray[i]);

                                } else {

                                    mainitem.generalImgUploads.push(filteredArray[i]);


                                }
                            }
                        }
                        angular.forEach(mainitem.FileUploads, function (item) {
                            item.isEditRemarks = false;
                            item.isAddRemarks = false;
                            item.isAuditRemarksAvail = false;
                            item.showSaveCancel = false;
                            if (item.AuditRemarks === "" || item.AuditRemarks === undefined || item.AuditRemarks === null) {
                                item.isAddRemarks = true;
                            } else {
                                item.isAuditRemarksAvail = true;
                            }
                        });
                    }
                });
            }
        }
    }

    $scope.openPdfFileUploads = function (url) {
        window.open(url);
    };
    function ongetdentalpatientAuditdataError(error) {
        console.log(error);
    }
    function ongetPatientDetailsSuccess(data) {


        if (data !== undefined) {
            if (data.Patient !== undefined) {
                if (data.Patient.length > 0) {
                    appointmentinfo.PatientDetails = "";
                    appointmentinfo.PatientDetails = data.Patient[0];
                    $scope.selectedpatientNameinDocpopUp = appointmentinfo.PatientDetails.FirstName;
                }
            }
        }
    }
    function ongetPatientDetailsError(error) {
        console.log(error);
    }
    function getpatients() {
        var params = $scope.SearchPatientObject;
        if (params.HospitalId === 0) {
            params.HospitalId = $scope.ParentHospitalID;
        }
        eHnoteAuditServices.getpatients(params, ongetpatientSuccess, ongetpatientError);
    }
    function ongetpatientSuccess(data) {
        $scope.patientsList = [];
        $scope.patientAuditDataArray = [];
        $scope.dentalPatientAuditDataArray = [];
        if (data !== undefined) {
            if (data.length > 0) {
                $scope.patientsList = data;
                angular.forEach($scope.patientsList, function (item) {
                    var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                    var val = array_list[Math.floor(Math.random() * array_list.length)];


                    item.colors = val;
                });
                $scope.TotalPatients = data[0].TotalCount;
                if ($scope.SpecializationId === 2) {
                    $scope.getDentalPatientAuditData(data[0], 0);
                } else {
                //    $scope.getPatientAuditData(data[0], 0);
                }
            }
        }
        $scope.SearchPatientObject.PageNumber = 1;
        $scope.SearchPatientObject.SearchPatientText = "";
    }
    function ongetpatientError(error) {
        console.log(error);
    }
    $scope.isConsultationEligible = function (mainitem, ind) {
        var checkbox = document.getElementById("chkIncEligible" + ind);
        if (mainitem.DoctorIncentiveEligibleInd) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to confirm this consultation as Incentive Eligible</h4>", function () {
                alertify.success("Done");
                checkbox.checked = true;
                //mainitem.DoctorIncentiveEligibleInd = true;
                $scope.ModifyAuditData(mainitem);
            }, function () {
                checkbox.checked = false;
                //mainitem.DoctorIncentiveEligibleInd = false;
                return;
            });
        } else {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to roll back Incentive Eligible</h4>", function () {
                alertify.success("Done");
                //mainitem.DoctorIncentiveEligibleInd = false;
                $scope.ModifyAuditData(mainitem);
                checkbox.checked = false;
            }, function () {
                checkbox.checked = true;
                //mainitem.DoctorIncentiveEligibleInd = true;
                return;
            });
        }
    };
    $scope.isIncentiveEligibleDental = function (mainitem, ind, id) {
        var checkbox = document.getElementById(id + ind);
        if (id === "chkIncEligibleConv") {
            if (mainitem.ConversionDoctorEligibleInd) {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to confirm this consultation as Incentive Eligible</h4>", function () {
                    alertify.success("Done");
                    checkbox.checked = true;
                    //mainitem.DoctorIncentiveEligibleInd = true;
                    $scope.ModifyDentalAuditData(mainitem);
                }, function () {
                    checkbox.checked = false;
                    //mainitem.DoctorIncentiveEligibleInd = false;
                    return;
                });
            } else {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to roll back Incentive Eligible </h4>", function () {
                    alertify.success("Done");
                    //mainitem.DoctorIncentiveEligibleInd = false;
                    $scope.ModifyDentalAuditData(mainitem);
                    checkbox.checked = false;
                }, function () {
                    checkbox.checked = true;
                    //mainitem.DoctorIncentiveEligibleInd = true;
                    return;
                });
            }
        } else {
            if (mainitem.TreatmentDoctorIncentiveEligibleInd) {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to confirm this consultation as Incentive Eligible</h4>", function () {
                    alertify.success("Done");
                    checkbox.checked = true;
                    //mainitem.DoctorIncentiveEligibleInd = true;
                    $scope.ModifyDentalAuditData(mainitem);
                }, function () {
                    checkbox.checked = false;
                    //mainitem.DoctorIncentiveEligibleInd = false;
                    return;
                });
            } else {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to roll back Incentive Eligible </h4>", function () {
                    alertify.success("Done");
                    //mainitem.DoctorIncentiveEligibleInd = false;
                    $scope.ModifyDentalAuditData(mainitem);
                    checkbox.checked = false;
                }, function () {
                    checkbox.checked = true;
                    //mainitem.DoctorIncentiveEligibleInd = true;
                    return;
                });
            }
        }
    };
    $scope.ModifyDentalAuditData = function (item, preitem) {
        var preitem = preitem || "";
        if (preitem !== "") {
            if (preitem.AuditRemarks === "") {
                preitem.isAuditRemarksAvail = false;
            } else {
                preitem.isAuditRemarksAvail = true;
                preitem.isAddRemarks = false;
            }
        }
        var params = {
            "PatientId": $scope.selectedpatientId,
            //"AppointmentId": item.AppointmentId,
            "TreatmentPlanId": item.TreatmentPlanId,
            "FileUploads": item.FileUploads,
            "OverallAuditRemarks": item.OverallAuditRemarks,
            "Rating": 0,
            "UserId": $scope.UserId,
            "RoleId": $scope.RoleId,
            "DoctorReplyMessage": item.DoctorReplyMessage,
            "IsDoctorChecked": item.IsDoctorChecked,
            "IsAuditorOrUser": "Auditor",
            "UploadType": "Delete",
            "DoctorVoiceRecords": item.DoctorVoiceRecords,
            "AuditorVoiceRecords": item.AuditorVoiceRecords,
            "ConversionDoctorEligibleInd": item.ConversionDoctorEligibleInd,
            "TreatmentDoctorIncentiveEligibleInd": item.TreatmentDoctorIncentiveEligibleInd
        };
        eHnoteAuditServices.modifyDentalPatientAuditData(params, onModifyDentalSuccess, onModifyDentalError);
    };
    function onModifyDentalSuccess(data) {
        if (data.status === "Success") {
            alertify.success("Insentives updated Successfully ");
            var params = {
                "PatientId": $scope.selectedpatientId,
                "PageSize": 5,
                "PageNumber": 1,
                "SpecializationId": $scope.SpecializationId
            };
            // $scope.test1 = true;
            eHnoteAuditServices.getpatientAuditdataForDental(params, ongetdentalpatientAuditdataSuccess, ongetdentalpatientAuditdataError);
        } else {
            alertify.success("Error Occured");
            return false;
        }
    }
    function onModifyDentalError(error) {
        console.log(error);
    }
    $scope.ModifyAuditData = function (item, preitem) {


        if (!$scope.UserAccessRights.AllAccessRights.AuditPatientData) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }

        var preitem = preitem || "";
        if (preitem !== "") {
            if (preitem.AuditRemarks === "") {
                preitem.isAuditRemarksAvail = false;
            } else {
                preitem.isAuditRemarksAvail = true;
                preitem.isAddRemarks = false;
            }
        }
        var params = {
            "PatientId": $scope.selectedpatientId,
            "AppointmentId": item.Consultation[0].AppointmentId,
            "FileUploads": item.FileUploads,
            "OverallAuditRemarks": item.OverallAuditRemarks,
            "Rating": 0,
            "UserId": $scope.UserId,
            "RoleId": $scope.RoleId,
            "DoctorReplyMessage": item.DoctorReplyMessage,
            "IsDoctorChecked": item.IsDoctorChecked,
            "IsAuditorOrUser": "Auditor",
            "UploadType": "Delete",
            "DoctorVoiceRecords": item.DoctorVoiceRecords,
            "AuditorVoiceRecords": item.AuditorVoiceRecords,
            "DoctorIncentiveEligibleInd": item.DoctorIncentiveEligibleInd
        };
        eHnoteAuditServices.modifypatientAuditDatabyId(params, onModifySuccess, onModifyError);
    };
    function onModifySuccess(data) {
        if (data.status === "Success") {
            alertify.success("Updated Successfully");
            var params = {
                "PatientId": $scope.selectedpatientId,
                "AllHospitalsIndicator": $scope.SearchPatientObject.AllHospitalsIndicator,
                "HospitalId": $scope.SearchPatientObject.HospitalId,
                "AllDoctorsIndicator": $scope.SearchPatientObject.AllDoctorsIndicator,
                "DoctorId": $scope.SearchPatientObject.DoctorId,
                "PageSize": 10,
                "PageNumber": 1,
                "SpecializationId": $scope.SpecializationId
            };
            eHnoteAuditServices.getpatientAuditdata(params, ongetpatientAuditdataSuccess, ongetpatientAuditdataError);
        } else {
            alertify.success("Error Occured");
            return false;
        }
    }
    function onModifyError(error) {
        console.log(error);
    }
    $scope.resetAuditorVoiceItem = function (mainitem) {
        if (mainitem.showAuditorTextNoteDiv === true) {
        }
    };
    $scope.SearchPatients = function () {
        getpatients();
    };
    $scope.clearSearchForm = function () {
        $scope.SearchPatientObject = {
            "AllHospitalsIndicator": 1,
            "HospitalId": $scope.ParentHospitalID,
            "HospitalObj": $scope.all,
            "AllDoctorsIndicator": 1,
            "DoctorId": 0,
            "DoctorObj": "",
            "SearchText": "",
            "Mobile": "",
            "FromDate": $filter("date")(new Date(d), "dd-MMMM-yyyy"),
            "ToDate": $filter("date")(new Date(d), "dd-MMMM-yyyy"),
            "PageSize": $scope.patientPagesize,
            "PageNumber": 1
        };
        $scope.SearchPatientObject.HospitalObj = $scope.AllUserBranchesList[0];
        $scope.SearchPatientObject.HospitalId = $scope.AllUserBranchesList[0].ClinicId;
        $scope.SearchPatientObject.AllHospitalsIndicator = 1;
        $scope.SearchPatientObject.DoctorObj = $scope.BranchDoctorsList[0];
        $scope.SearchPatientObject.DoctorId = $scope.BranchDoctorsList[0].DoctorID;
        $scope.SearchPatientObject.AllDoctorsIndicator = 1;
        getpatients();
    };
    $scope.PreImgOrGenImg = function (item) {
        return item.NoteFileTypeId === 1 || item.NoteFileTypeId === 2;
    };
    $scope.PostImgOrConsentImg = function (item) {
        return item.NoteFileTypeId === 3 || item.NoteFileTypeId === 4;
    };
    $scope.showImagePreview = function (index, url) {
        $scope.ImageArray = [];
        $scope.ImageArray.push({ "thumbUrl": url, "url": url });
        Lightbox.openModal($scope.ImageArray, 0);
    };
    $scope.changeAuditPatientPage = function (page) {
        $scope.patientPageno = page;
        $scope.SearchPatientObject.PageNumber = $scope.patientPageno;
        getpatients();
    };


    $scope.changeAuditNotificationPage = function (auditNotificationPageNumber) {
        $scope.auditNotificationPageNumber = auditNotificationPageNumber;
        //$scope.getDentalAuditnotificationDetails();
        if ($scope.SpecializationId === 2) {
            $scope.getDentalAuditnotificationDetails();
        } else {
            $scope.getAuditnotificationDetails();
        }
    };
    $scope.patientSearch = function (searchPat) {
        searchPat = searchPat || "";
        $scope.SearchPatientText = searchPat;
        //  $scope.SearchPatientObject.SearchText = $scope.SearchPatientText;
        // getpatients();

        if (isNaN(searchPat)) {
            $scope.SearchPatientObject.SearchText = searchPat;
            $scope.SearchPatientObject.Mobile = null;
            getpatients();

        } else if (searchPat.length >= 10) {

            $scope.SearchPatientObject.SearchText = null;
            $scope.SearchPatientObject.Mobile = searchPat;
            getpatients();
        }

        else if (searchPat == "") {
            $scope.SearchPatientObject.SearchText = "";
            $scope.SearchPatientObject.Mobile = "";
            getpatients();
        }

    };
    $scope.navtoUploads = function (item) {
        //eHnoteMasterDataService.addpatientData(item.PatientDetails.Patient[0]);
        //item.Patient = item.PatientDetails.Patient;
        //item.PatientAddress = item.PatientDetails.PatientAddress;
        //item.PatientPhone = item.PatientDetails.PatientPhone;
        //item.PatientEmail = item.PatientDetails.PatientEmail;
        //if (item.DisplayID === undefined && item.DisplayID === "") {
        //    eHnoteMasterDataService.addDisplayID(item.DisplayID);
        //} else {
        //    eHnoteMasterDataService.addDisplayID(item.DisplayID);
        //}
        //eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        //eHnoteMasterDataService.addAppointmentInfo(item);
        //$scope.cacheStorageItem.PatientTypeId = item.PatientDetails.Patient[0].PatientTypeId;
        //"PatientId": item.PatientId,
        //   "AllHospitalsIndicator": $scope.SearchPatientObject.AllHospitalsIndicator,
        //   "HospitalId": $scope.SearchPatientObject.HospitalId,
        //   "AllDoctorsIndicator": $scope.SearchPatientObject.AllDoctorsIndicator,
        //   "DoctorId": $scope.SearchPatientObject.DoctorId,

        $scope.appointmentId = 0;
        $scope.AppointmentDate = "";
        $scope.TreatmentPlanId = 0;
        if (item.Consultation.length > 0) {
            angular.forEach(item.Consultation, function (mitem) {
                if (mitem.AppointmentDoctorId == $scope.UserId) {
                    $scope.appointmentId = mitem.AppointmentId;
                    $scope.AppointmentDate = mitem.AppointmentDate;
                }
            });
        }



        appointmentinfo.HospitalId = $scope.SearchPatientObject.HospitalId;
        appointmentinfo.DoctorId = $scope.SearchPatientObject.DoctorId;
        // appointmentinfo.AppointmentID = item.AppointmentId;
        appointmentinfo.AppointmentID = $scope.appointmentId;
        // appointmentinfo.ConsultationDt = item.AppointmentDate;
        appointmentinfo.ConsultationDt = $scope.AppointmentDate;
        appointmentinfo.PatientID = appointmentinfo.PatientDetails.PatientID;
        appointmentinfo.TreatmentPlanId = item.TreatmentPlanId;
        eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
        var url = "/appointmentFileUploads";
        $location.url(url);
    };
    $scope.navtoEditConsultation = function (item) {
        var url;
        $scope.appointmentId = 0;
        $scope.AppointmentDate = "";
        $scope.TreatmentPlanId = 0;
        if (item.Consultation.length > 0) {
            angular.forEach(item.Consultation, function (mitem) {
                if (mitem.AppointmentDoctorId == $scope.UserId) {
                    $scope.appointmentId = mitem.AppointmentId;
                    $scope.AppointmentDate = mitem.AppointmentDate;
                }
            });
        }
        appointmentinfo.HospitalId = $scope.SearchPatientObject.HospitalId;
        appointmentinfo.DoctorId = $scope.SearchPatientObject.DoctorId;

        appointmentinfo.AppointmentID = $scope.appointmentId;
        appointmentinfo.ConsultationDt = $scope.AppointmentDate;

        appointmentinfo.PatientID = appointmentinfo.PatientDetails.PatientID;

        appointmentinfo.TreatmentPlanId = item.TreatmentPlanId;
        $scope.cacheStorageItem.appointmentid = $scope.appointmentId;
        $scope.cacheStorageItem.AppointmentDoctorID = $scope.SearchPatientObject.DoctorId;
        $scope.cacheStorageItem.ApptDate = $scope.AppointmentDate;
        $scope.cacheStorageItem.patientid = appointmentinfo.PatientDetails.PatientID;
        $scope.cacheStorageItem.VisitReason = "";
        $scope.cacheStorageItem.doctorid = $scope.SearchPatientObject.DoctorId;
        $scope.cacheStorageItem.PatientDisplayId = appointmentinfo.PatientDetails.PatientDisplayId;
        $scope.cacheStorageItem.EmailID = appointmentinfo.PatientDetails.EmailId;
        $scope.cacheStorageItem.CountryCode = "91";
        $scope.cacheStorageItem.PhoneNumber = appointmentinfo.PatientDetails.MobileNo;
        $scope.cacheStorageItem.PatientID = appointmentinfo.PatientDetails.PatientID;
        $scope.cacheStorageItem.PatientName = appointmentinfo.PatientDetails.FullName;
        $scope.cacheStorageItem.PatientTypeId = appointmentinfo.PatientDetails.PatientTypeId;
        eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        if ($scope.SpecializationId === 2) {//Dentist
            url = "/DentalPast";
        } else {
            url = "/Pastvisit";
        }
        $location.url(url);
    };
    $scope.auditNotificationPageNumber = 1;
    $scope.auditNotificationPageSize = 20;
    $scope.auditNotificationPageMaxSize = 4;
    $scope.AuditNotificationDetails = [];
    $scope.TotalAuditNotifications = 0;
    $scope.getAuditnotificationDetails = function () {
        var params = {
            "UserId": $scope.UserId,
            "PageSize": $scope.auditNotificationPageSize,
            "PageNumber": $scope.auditNotificationPageNumber
        };
        eHnoteAuditServices.getAuditNotifications(params, ongetAuditNotificationSuccess, ongetAuditNotificationError);
    };
    $scope.getDentalAuditnotificationDetails = function () {
        var params = {
            "UserId": $scope.UserId,
            "PageSize": $scope.auditNotificationPageSize,
            "PageNumber": $scope.auditNotificationPageNumber
        };
        eHnoteAuditServices.getDentalAuditNotifications(params, ongetAuditNotificationSuccess, ongetAuditNotificationError);
    };
    function ongetAuditNotificationSuccess(data) {
        $scope.AuditNotificationDetails = [];
        $scope.TotalAuditNotifications = 0;
        if (data !== undefined) {
            if (data.count > 0) {
                if (data.rows.length > 0) {
                    $scope.AuditNotificationDetails = data.rows;

                    if ($scope.SpecializationId === 2) {
                        angular.forEach($scope.AuditNotificationDetails, function (item) {
                            angular.forEach(item.AppointmentDetails, function (subitem, ind) {
                                if (ind === 0) {
                                    item.PatientName = subitem.PatientName;
                                    item.AppointmentDate = subitem.AppointmentDate;
                                }
                            });
                        });
                    }


                    $scope.TotalAuditNotifications = data.count;
                }
            }
        }
    }
    function ongetAuditNotificationError(error) {
        console.log(error);
    }
    $scope.ShowAuditPatientPopupNotify = false;
    $scope.NotificationClose = function () {
        $scope.ShowAuditPatientPopupNotify = false;
        if ($scope.SpecializationId === 2) {
            $scope.getDentalAuditnotificationDetails();
        } else {
            $scope.getAuditnotificationDetails();
        }
    };
    $scope.selectedAuditedDataArray = [];
    $scope.selectedAuditPatient = [];
    $scope.viewPatientAuditData = function (item) {

        if (!$scope.UserAccessRights.AllAccessRights.AuditNotifications) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }

        $scope.ShowAuditPatientPopupNotify = true;
        $scope.selectedAuditPatient = [];
        $scope.selectedpatientNameinDocpopUp = "";
        var params = {
            "PatientId": item.PatientId,
            "AllHospitalsIndicator": 1,
            //"HospitalId": item.AppointmentHospitalId,
            "HospitalId": $scope.ParentHospitalID,
            "AllDoctorsIndicator": 1,
            "DoctorId": item.AppointmentDoctorId,
            "PageSize": 10,
            "PageNumber": 1,
            "SpecializationId": $scope.SpecializationId
            //"AppointmentId": item.AppointmentId
        };
        $scope.selectedAuditPatient = item;
        eHnoteAuditServices.getpatientAuditdata(params, ongetpatientAuditdataByIdSuccess, ongetpatientAuditdataByIdError);
        eHnoteAuditServices.getPatientDetailsById(item.PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetpatientAuditdataByIdSuccess(data) {
            $scope.selectedAuditedDataArray = [];
            if (data !== undefined) {
                if (data.count > 0) {
                    $scope.selectedAuditedDataArray = data.rows;
                    angular.forEach($scope.selectedAuditedDataArray, function (mainitem) {
                        mainitem.generalImgUploads = [];
                        mainitem.generalPdfUploads = [];
                        mainitem.showAuditorTextNoteDiv = false;
                        mainitem.showAuditorVoiceNoteDiv = false;
                        mainitem.showDoctorTextNoteDiv = false;
                        mainitem.showDoctorVoiceNoteDiv = false;
                        mainitem.seconds = 0;
                        mainitem.minutes = 0;
                        mainitem.RecordingStarted = false;
                        mainitem.RecorderPaused = true;
                        mainitem.RecorderReset = true;
                        mainitem.RecorderPauseClicked = false;
                        mainitem.isDoctorTextRemarksAvail = false;
                        mainitem.OverallAuditRemarks = mainitem.OverallAuditRemarks || "";
                        mainitem.AuditModifiedTime = mainitem.AuditModifiedTime || "";
                        mainitem.IsDoctorReplyEditMode = false;
                        if (mainitem.DoctorReplyMessage === "") {
                            mainitem.showDoctorReplyEditIcon = false;
                        } else {
                            mainitem.showDoctorReplyEditIcon = true;
                            mainitem.showDoctorTextNoteDiv = true;
                            mainitem.isDoctorTextRemarksAvail = true;
                        }
                        if (mainitem.OverallAuditRemarks === "") {
                        } else {
                            mainitem.showAuditorTextNoteDiv = true;
                            mainitem.isAuditRemarksAvail = true;
                        }
                        if (mainitem.AuditorVoiceRecords.length > 0) {
                            mainitem.showAuditorVoiceNoteDiv = true;
                        }
                        if (mainitem.DoctorVoiceRecords.length > 0) {
                            mainitem.showDoctorVoiceNoteDiv = true;
                        }
                        if (mainitem.FileUploads !== undefined && mainitem.FileUploads.length > 0) {

                            if (mainitem.FileUploads.length > 0) {
                                var filteredArray = mainitem.FileUploads;
                                for (var i = 0; i < filteredArray.length; i++) {
                                    $scope.docname = "";
                                    filteredArray[i].docNameDisplay = '';
                                    var extension = ".jpg";
                                    if (filteredArray[i].FileName) {
                                        extension = filteredArray[i].FileName.split(".")[1];
                                    }
                                    var pName = filteredArray[i].FileName.split("_")[0];
                                    if (pName.length > 9) {
                                        name = pName.substring(0, 9) + "..." + "." + extension;
                                    }
                                    else {
                                        name = angular.copy(pName) + "." + extension;
                                    }
                                    filteredArray[i].docNameDisplay = name;

                                    if (filteredArray[i].S3URL.indexOf(".pdf") > -1) {
                                        mainitem.generalPdfUploads.push(filteredArray[i]);

                                    } else {

                                        mainitem.generalImgUploads.push(filteredArray[i]);


                                    }
                                }
                            }
                            angular.forEach(mainitem.FileUploads, function (item) {
                                item.isEditRemarks = false;
                                item.isAddRemarks = false;
                                item.isAuditRemarksAvail = false;
                                item.showSaveCancel = false;
                                if (item.AuditRemarks === "" || item.AuditRemarks === undefined || item.AuditRemarks === null) {
                                    item.isAddRemarks = true;
                                } else {
                                    item.isAuditRemarksAvail = true;
                                }
                            });
                        }
                    });
                    if (item.IsDoctorChecked === 0) {
                        $scope.updateAsDoctorViewed($scope.selectedAuditedDataArray[0], item, "1");
                    }
                }
            }
        }
        function ongetpatientAuditdataByIdError(error) {
            console.log(error);
        }
    };
    $scope.viewPatientAuditDataTemp = function (item) {
        $scope.selectedAuditPatient = item;
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "AuditPatientPopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteAuditServices) {
                $scope.selectedpatientNameinDocpopUp = "";
                var params = {
                    "PatientId": $scope.selectedAuditPatient.PatientId,
                    "AllHospitalsIndicator": 1,
                    "HospitalId": $scope.selectedAuditPatient.AppointmentHospitalId,
                    "AllDoctorsIndicator": 1,
                    "DoctorId": $scope.selectedAuditPatient.AppointmentDoctorId,
                    "PageSize": 10,
                    "PageNumber": 1,
                    "SpecializationId": $scope.SpecializationId,
                    "AppointmentId": $scope.selectedAuditPatient.AppointmentId
                };
                eHnoteAuditServices.getpatientAuditdata(params, ongetpatientAuditdataByIdSuccess, ongetpatientAuditdataByIdError);
                eHnoteAuditServices.getPatientDetailsById($scope.selectedAuditPatient.PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
                function ongetpatientAuditdataByIdSuccess(data) {
                    $scope.selectedAuditedDataArray = [];
                    if (data !== undefined) {
                        if (data.count > 0) {
                            $scope.selectedAuditedDataArray = data.rows;
                            angular.forEach($scope.selectedAuditedDataArray, function (mainitem) {
                                mainitem.showAuditorTextNoteDiv = false;
                                mainitem.showAuditorVoiceNoteDiv = false;
                                mainitem.showDoctorTextNoteDiv = false;
                                mainitem.showDoctorVoiceNoteDiv = false;
                                mainitem.seconds = 0;
                                mainitem.minutes = 0;
                                mainitem.RecordingStarted = false;
                                mainitem.RecorderPaused = true;
                                mainitem.RecorderReset = true;
                                mainitem.RecorderPauseClicked = false;
                                mainitem.isDoctorTextRemarksAvail = false;
                                mainitem.OverallAuditRemarks = mainitem.OverallAuditRemarks || "";
                                mainitem.AuditModifiedTime = mainitem.AuditModifiedTime || "";
                                mainitem.IsDoctorReplyEditMode = false;
                                if (mainitem.DoctorReplyMessage === "") {
                                    mainitem.showDoctorReplyEditIcon = false;
                                } else {
                                    mainitem.showDoctorReplyEditIcon = true;
                                    mainitem.showDoctorTextNoteDiv = true;
                                    mainitem.isDoctorTextRemarksAvail = true;
                                }
                                if (mainitem.OverallAuditRemarks === "") {
                                } else {
                                    mainitem.showAuditorTextNoteDiv = true;
                                    mainitem.isAuditRemarksAvail = true;
                                }
                                if (mainitem.AuditorVoiceRecords.length > 0) {
                                    mainitem.showAuditorVoiceNoteDiv = true;
                                }
                                if (mainitem.DoctorVoiceRecords.length > 0) {
                                    mainitem.showDoctorVoiceNoteDiv = true;
                                }
                                if (mainitem.FileUploads !== undefined && mainitem.FileUploads.length > 0) {

                                    angular.forEach(mainitem.FileUploads, function (item) {
                                        item.isEditRemarks = false;
                                        item.isAddRemarks = false;
                                        item.isAuditRemarksAvail = false;
                                        item.showSaveCancel = false;
                                        if (item.AuditRemarks === "" || item.AuditRemarks === undefined || item.AuditRemarks === null) {
                                            item.isAddRemarks = true;
                                        } else {
                                            item.isAuditRemarksAvail = true;
                                        }
                                    });
                                }
                            });
                            if ($scope.selectedAuditPatient.IsDoctorChecked === 0) {
                                $scope.updateAsDoctorViewed($scope.selectedAuditedDataArray[0], $scope.selectedAuditPatient, "1");
                            }
                        }
                    }
                }
                function ongetpatientAuditdataByIdError(error) {
                    console.log(error);
                }
                function ongetPatientDetailsSuccess(data) {
                    if (data !== undefined) {
                        if (data.Patient !== undefined) {
                            if (data.Patient.length > 0) {
                                appointmentinfo.PatientDetails = "";
                                appointmentinfo.PatientDetails = data.Patient[0];
                                $scope.selectedpatientNameinDocpopUp = appointmentinfo.PatientDetails.FirstName;
                            }
                        }
                    }
                }
                function ongetPatientDetailsError(error) {
                    console.log(error);
                }
                $scope.CloseAuditPatientPopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };


    $scope.updateAsDoctorViewed = function (mainitem, item, type) {
        var params = {
            "PatientId": item.PatientId,
            "AppointmentId": mainitem.AppointmentId,
            "FileUploads": mainitem.FileUploads,
            "OverallAuditRemarks": mainitem.OverallAuditRemarks,
            "Rating": 0,
            "UserId": $scope.UserId,
            "RoleId": $scope.RoleId,
            "DoctorReplyMessage": mainitem.DoctorReplyMessage,
            "IsDoctorChecked": 1,
            "IsAuditorOrUser": "Doctor",
            "UploadType": "DoctorCheck",
            "DoctorVoiceRecords": mainitem.DoctorVoiceRecords,
            "AuditorVoiceRecords": mainitem.AuditorVoiceRecords
        };
        eHnoteAuditServices.modifypatientAuditDatabyId(params, UpdateNotificationSuccess, UpdateNotificationError);
        function UpdateNotificationSuccess(data) {
            if (data.status === "Success") {
                if (type === "2") {
                    alertify.success("Sent Successfully");
                    $scope.NotificationClose();
                }
            }
        }
        function UpdateNotificationError(error) {
            console.log(error);
        }
    };
    $scope.viewDentalPatientAuditData = function (item) {

        $scope.selectedAuditPatient = [];
        $scope.selectedpatientNameinDocpopUp = "";
        var params = {
            "PatientId": item.AppointmentDetails[0].PatientId,
            "PageSize": 10,
            "PageNumber": 1,
            "TreatmentPlanId": item.TreatmentPlanId
        };
        $scope.selectedAuditPatient = item;
        $scope.selectedpatientId = item.AppointmentDetails[0].PatientId;
        eHnoteAuditServices.getPatientDetailsById(item.AppointmentDetails[0].PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        eHnoteAuditServices.getpatientAuditdataForDental(params, ongetpatientDataPopUpSuccess, ongetpatientDataPopUpError);






        //$scope.mInstanceAdd = $uibModal.open({
        //    "templateUrl": "AuditPatientPopup.html",
        //    "backdrop": "static",
        //    "scope": $scope,
        //    "keyboard": false,
        //    "size": "lg",
        //    "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteAuditServices) {

        //        function ongetdentalpatientAuditdataSuccess(data) {
        //            $scope.dentalPatientAuditDataArray = [];       
        //            if (data !== undefined) {
        //                if (data.length > 0) {
        //                    $scope.dentalPatientAuditDataArray = angular.copy(data);
        //                    if ($scope.RoleId === 1) {
        //                        if (data.rows.length > 0) {
        //                            angular.forEach(data.rows, function (item) {
        //                                if (item.OverallAuditRemarks !== "" || item.AuditorVoiceRecords.length > 0) {
        //                                    $scope.patientAuditDataArray.push(item);
        //                                }
        //                            });
        //                        }
        //                    } else {
        //                        $scope.patientAuditDataArray = data.rows;
        //                    }
        //                    angular.forEach($scope.dentalPatientAuditDataArray, function (mainitem, index) {
        //                        mainitem.showAuditorTextNoteDiv = false;
        //                        mainitem.showAuditorVoiceNoteDiv = false;
        //                        mainitem.showDoctorTextNoteDiv = false;
        //                        mainitem.showDoctorVoiceNoteDiv = false;
        //                        mainitem.seconds = 0;
        //                        mainitem.minutes = 0;
        //                        mainitem.RecordingStarted = false;
        //                        mainitem.RecorderPaused = true;
        //                        mainitem.RecorderReset = true;
        //                        mainitem.RecorderPauseClicked = false;
        //                        if (mainitem.ConversionDoctorEligibleInd) {
        //                            var checkBox = "chkIncEligibleConv" + index;
        //                            $("input[name=checkBox]").attr("checked", true);
        //                        } else {
        //                            var checkBox = "chkIncEligibleConv" + index;
        //                            $("input[name=checkBox]").attr("checked", false);
        //                        }
        //                        if (mainitem.TreatmentDoctorIncentiveEligibleInd) {
        //                            var checkBox = "chkIncEligibleTreat" + index;
        //                            $("input[name=checkBox]").attr("checked", true);
        //                        } else {
        //                            var checkBox = "chkIncEligibleTreat" + index;
        //                            $("input[name=checkBox]").attr("checked", false);
        //                        }
        //                        mainitem.OverallAuditRemarks = mainitem.OverallAuditRemarks || "";
        //                        mainitem.AuditModifiedTime = mainitem.AuditModifiedTime || "";
        //                        mainitem.showAuditNotesEditIcon = false;
        //                        mainitem.showDoctorReplyEditIcon = false;
        //                        mainitem.isAuditTextRemarksAvail = false;
        //                        mainitem.IsAuditEditMode = false;
        //                        mainitem.IsDoctorReplyEditMode = false;
        //                        mainitem.isDoctorRemarksAvail = false;
        //                        mainitem.showDelAuditorVocie = false;
        //                        if ($scope.RoleId !== 1) {
        //                            if (mainitem.OverallAuditRemarks === "") {
        //                                mainitem.IsAuditEditMode = true;
        //                            } else {
        //                                mainitem.showAuditorTextNoteDiv = true;
        //                                mainitem.isAuditTextRemarksAvail = true;
        //                            }
        //                            if (mainitem.DoctorReplyMessage === "") {
        //                                mainitem.isDoctorRemarksAvail = false;
        //                            } else {
        //                                mainitem.showDoctorTextNoteDiv = true;
        //                                mainitem.isDoctorRemarksAvail = true;
        //                            }
        //                            if (mainitem.AuditorVoiceRecords.length > 0) {
        //                                mainitem.showAuditorVoiceNoteDiv = true;
        //                                mainitem.showDelAuditorVocie = true;
        //                            }
        //                            if (mainitem.DoctorVoiceRecords.length > 0) {
        //                                mainitem.showDoctorVoiceNoteDiv = true;
        //                            }
        //                        } else {
        //                            if (mainitem.OverallAuditRemarks === "") {
        //                            } else {
        //                                mainitem.showAuditorTextNoteDiv = true;
        //                                mainitem.isAuditTextRemarksAvail = true;
        //                            }
        //                            if (mainitem.DoctorReplyMessage === "") {
        //                                mainitem.isDoctorRemarksAvail = false;
        //                            } else {
        //                                mainitem.showDoctorTextNoteDiv = true;
        //                                mainitem.isDoctorRemarksAvail = true;
        //                            }
        //                            if (mainitem.AuditorVoiceRecords.length > 0) {
        //                                mainitem.showAuditorVoiceNoteDiv = true;
        //                            }
        //                            if (mainitem.DoctorVoiceRecords.length > 0) {
        //                                mainitem.showDoctorVoiceNoteDiv = true;
        //                            }
        //                        }
        //                        if (mainitem.AuditorId === $scope.UserId) {
        //                            mainitem.showAuditNotesEditIcon = true;
        //                        }
        //                        if (mainitem.AppointmentDoctorId === $scope.UserId) {
        //                            mainitem.showDoctorReplyEditIcon = true;
        //                        }
        //                        if (mainitem.FileUploads !== undefined && mainitem.FileUploads.length > 0) {
        //                            angular.forEach(mainitem.FileUploads, function (item) {
        //                                item.isEditRemarks = false;
        //                                item.isAddRemarks = false;
        //                                item.isAuditRemarksAvail = false;
        //                                item.showSaveCancel = false;
        //                                if (item.AuditRemarks === "" || item.AuditRemarks === undefined || item.AuditRemarks === null) {
        //                                    item.isAddRemarks = true;
        //                                } else {
        //                                    item.isAuditRemarksAvail = true;
        //                                }
        //                            });
        //                        }
        //                    });
        //                }
        //            }
        //        }
        //        function ongetdentalpatientAuditdataError(error) {
        //            console.log(error);
        //        }

        //        $scope.saveDentalAudioRecordDoctor = function (item) {
        //            function upload(blob) {
        //                $scope.DoctorVoiceArray = [];
        //                var fd = new FormData();
        //                fd.append("file", blob);
        //                fd.append("UserId", eHnoteMasterDataService.getLoginId());
        //                fd.append("HospitalId", $scope.SearchPatientObject.HospitalId);
        //                fd.append("PatientId", $scope.selectedpatientId);
        //                fd.append("TreatmentPlanId", item.TreatmentPlanId);
        //                fd.append("OverallAuditRemarks", item.OverallAuditRemarks);
        //                fd.append("Rating", item.Rating);
        //                fd.append("DoctorReplyMessage", item.DoctorReplyMessage);
        //                fd.append("IsDoctorChecked", 0);
        //                fd.append("IsAuditorOrUser", "Doctor");
        //                fd.append("UploadType", "Add");
        //                fd.append("DoctorVoiceRecords", item.DoctorVoiceRecords);
        //                fd.append("AuditorVoiceRecords", item.AuditorVoiceRecords);
        //                eHnoteAuditServices.addDentalAuditVoiceRecord(fd, callbackAudiofileuploadSuccess, callbackAudiofileuploadError);
        //                function callbackAudiofileuploadSuccess(data) {
        //                    if (data.status === "Success") {
        //                        // $scope.ShowRecordSaving = false;
        //                        // $scope.ShowAuditPatientPopupNotify = true;
        //                        var params = {
        //                            "PatientId": item.AppointmentDetails[0].PatientId,
        //                            "PageSize": 10,
        //                            "PageNumber": 1
        //                        };
        //                        eHnoteAuditServices.getpatientAuditdataForDental(params, ongetdentalpatientAuditdataSuccess, ongetdentalpatientAuditdataError);
        //                        alertify.success("Uploaded Successfully");

        //                    } else {
        //                        //  $scope.ShowRecordSaving = false;
        //                        // $scope.ShowAuditPatientPopupNotify = true;
        //                        alertify.success("Error Occured");
        //                        return false;
        //                    }
        //                }
        //                function callbackAudiofileuploadError(err) {
        //                    console.log(error);
        //                }
        //            }
        //            Fr.voice.export(upload, "blob");
        //            Fr.voice.stop();
        //            $timeout.cancel(timeoutId);

        //        };
        //        $scope.deleteDentalDoctorVoiceRecord = function (item) {
        //            var params = {
        //                "PatientId": $scope.selectedpatientId,
        //                "TreatmentPlanId": item.TreatmentPlanId,
        //                "HospitalId": $scope.SearchPatientObject.HospitalId,
        //                "OverallAuditRemarks": item.OverallAuditRemarks,
        //                "Rating": 0,
        //                "UserId": $scope.UserId,
        //                "RoleId": $scope.RoleId,
        //                "DoctorReplyMessage": item.DoctorReplyMessage,
        //                "IsDoctorChecked": item.IsDoctorChecked,
        //                "IsAuditorOrUser": "Doctor",
        //                "UploadType": "Delete",
        //                "DoctorVoiceRecords": item.DoctorVoiceRecords,
        //                "AuditorVoiceRecords": item.AuditorVoiceRecords
        //            };
        //            eHnoteAuditServices.deleteDentalAuditVoiceRecord(params, callbackAudiofileuploadSuccess, callbackAudiofileuploadError);
        //            function callbackAudiofileuploadSuccess(data) {
        //                if (data.status === "Success") {
        //                    alertify.success("deleted Successfully");
        //                    $scope.viewDentalPatientAuditData($scope.selectedAuditPatient);
        //                } else {
        //                    alertify.success("Error Occured");
        //                    return false;
        //                }
        //            }
        //            function callbackAudiofileuploadError(err) {
        //                console.log(error);
        //            }
        //        };

        //        $scope.CloseAuditPatientPopup = function () {
        //            $uibModalInstance.dismiss("cancel");
        //        };
        //    }
        //});

    };

    function ongetpatientDataPopUpSuccess(data) {
        $scope.selectedAuditedDataArray = [];

        if (data !== undefined) {
            if (data.length > 0) {
                //  $scope.selectedAuditedDataArray = angular.copy(data);
                if ($scope.RoleId === 1) {
                    if (data.length > 0) {


                        // commented by sabarish and we need to discusss  requirement


                        //angular.forEach(data, function (item) {
                        //    if (item.OverallAuditRemarks !== "" || item.AuditorVoiceRecords.length > 0) {
                        //        $scope.selectedAuditedDataArray.push(item);
                        //    }
                        //});
                        $scope.selectedAuditedDataArray = data;

                    }
                } else {
                    $scope.selectedAuditedDataArray = angular.copy(data);
                }
                angular.forEach($scope.selectedAuditedDataArray, function (mainitem, index) {
                    mainitem.generalImgUploads = [];
                    mainitem.generalPdfUploads = [];
                    mainitem.showAuditorTextNoteDiv = false;
                    mainitem.showAuditorVoiceNoteDiv = false;
                    mainitem.showDoctorTextNoteDiv = false;
                    mainitem.showDoctorVoiceNoteDiv = false;
                    mainitem.seconds = 0;
                    mainitem.minutes = 0;
                    mainitem.RecordingStarted = false;
                    mainitem.RecorderPaused = true;
                    mainitem.RecorderReset = true;
                    mainitem.RecorderPauseClicked = false;
                    if (mainitem.ConversionDoctorEligibleInd) {
                        var checkBox = "chkIncEligibleConv" + index;
                        $("input[name=checkBox]").attr("checked", true);
                    } else {
                        var checkBox = "chkIncEligibleConv" + index;
                        $("input[name=checkBox]").attr("checked", false);
                    }
                    if (mainitem.TreatmentDoctorIncentiveEligibleInd) {
                        var checkBox = "chkIncEligibleTreat" + index;
                        $("input[name=checkBox]").attr("checked", true);
                    } else {
                        var checkBox = "chkIncEligibleTreat" + index;
                        $("input[name=checkBox]").attr("checked", false);
                    }
                    mainitem.OverallAuditRemarks = mainitem.OverallAuditRemarks || "";
                    mainitem.AuditModifiedTime = mainitem.AuditModifiedTime || "";
                    mainitem.showAuditNotesEditIcon = false;
                    mainitem.showDoctorReplyEditIcon = false;
                    mainitem.isAuditTextRemarksAvail = false;
                    mainitem.IsAuditEditMode = false;
                    mainitem.IsDoctorReplyEditMode = false;
                    mainitem.isDoctorRemarksAvail = false;
                    mainitem.showDelAuditorVocie = false;
                    if ($scope.RoleId !== 1) {
                        if (mainitem.OverallAuditRemarks === "") {
                            mainitem.IsAuditEditMode = true;
                        } else {
                            mainitem.showAuditorTextNoteDiv = true;
                            mainitem.isAuditTextRemarksAvail = true;
                        }
                        if (mainitem.DoctorReplyMessage === "") {
                            mainitem.isDoctorRemarksAvail = false;
                        } else {
                            mainitem.showDoctorTextNoteDiv = true;
                            mainitem.isDoctorRemarksAvail = true;
                        }
                        if (mainitem.AuditorVoiceRecords.length > 0) {
                            mainitem.showAuditorVoiceNoteDiv = true;
                            mainitem.showDelAuditorVocie = true;
                        }
                        if (mainitem.DoctorVoiceRecords.length > 0) {
                            mainitem.showDoctorVoiceNoteDiv = true;
                        }
                    } else {
                        if (mainitem.OverallAuditRemarks === "") {
                        } else {
                            mainitem.showAuditorTextNoteDiv = true;
                            mainitem.isAuditTextRemarksAvail = true;
                        }
                        if (mainitem.DoctorReplyMessage === "") {
                            mainitem.isDoctorRemarksAvail = false;
                        } else {
                            mainitem.showDoctorTextNoteDiv = true;
                            mainitem.isDoctorRemarksAvail = true;
                        }
                        if (mainitem.AuditorVoiceRecords.length > 0) {
                            mainitem.showAuditorVoiceNoteDiv = true;
                        }
                        if (mainitem.DoctorVoiceRecords.length > 0) {
                            mainitem.showDoctorVoiceNoteDiv = true;
                        }
                    }
                    if (mainitem.AuditorId === $scope.UserId) {
                        mainitem.showAuditNotesEditIcon = true;
                    }
                    if (mainitem.AppointmentDoctorId === $scope.UserId) {
                        mainitem.showDoctorReplyEditIcon = true;
                    }
                    if (mainitem.FileUploads !== undefined && mainitem.FileUploads.length > 0) {

                        if (mainitem.FileUploads.length > 0) {
                            var filteredArray = mainitem.FileUploads;
                            for (var i = 0; i < filteredArray.length; i++) {
                                $scope.docname = "";
                                filteredArray[i].docNameDisplay = '';
                                var extension = ".jpg";
                                if (filteredArray[i].FileName) {
                                    extension = filteredArray[i].FileName.split(".")[1];
                                }
                                var pName = filteredArray[i].FileName.split("_")[0];
                                if (pName.length > 9) {
                                    name = pName.substring(0, 9) + "..." + "." + extension;
                                }
                                else {
                                    name = angular.copy(pName) + "." + extension;
                                }
                                filteredArray[i].docNameDisplay = name;
                                if (filteredArray[i].S3URL.indexOf(".pdf") > -1) {

                                    mainitem.generalPdfUploads.push(filteredArray[i]);

                                } else {
                                    mainitem.generalImgUploads.push(filteredArray[i]);

                                }
                            }
                        }

                        angular.forEach(mainitem.FileUploads, function (item) {
                            item.isEditRemarks = false;
                            item.isAddRemarks = false;
                            item.isAuditRemarksAvail = false;
                            item.showSaveCancel = false;
                            if (item.AuditRemarks === "" || item.AuditRemarks === undefined || item.AuditRemarks === null) {
                                item.isAddRemarks = true;
                            } else {
                                item.isAuditRemarksAvail = true;
                            }
                        });
                    }
                });
                $scope.ShowAuditPatientPopupNotify = true;
            }
        }
    }
    function ongetpatientDataPopUpError(error) {
        console.log(error);
    }


    function ongetpatientDentalAuditdataByIdSuccess(data) {
        $scope.selectedAuditedDataArray = [];
        if (data !== undefined) {
            if (data.length > 0) {
                $scope.selectedAuditedDataArray = data;
                angular.forEach($scope.selectedAuditedDataArray, function (mainitem) {
                    mainitem.showAuditorTextNoteDiv = false;
                    mainitem.showAuditorVoiceNoteDiv = false;
                    mainitem.showDoctorTextNoteDiv = false;
                    mainitem.showDoctorVoiceNoteDiv = false;
                    mainitem.seconds = 0;
                    mainitem.minutes = 0;
                    mainitem.RecordingStarted = false;
                    mainitem.RecorderPaused = true;
                    mainitem.RecorderReset = true;
                    mainitem.RecorderPauseClicked = false;
                    mainitem.isDoctorTextRemarksAvail = false;
                    mainitem.OverallAuditRemarks = mainitem.OverallAuditRemarks || "";
                    mainitem.AuditModifiedTime = mainitem.AuditModifiedTime || "";
                    mainitem.IsDoctorReplyEditMode = false;
                    if (mainitem.DoctorReplyMessage === "") {
                        mainitem.showDoctorReplyEditIcon = false;
                    } else {
                        mainitem.showDoctorReplyEditIcon = true;
                        mainitem.showDoctorTextNoteDiv = true;
                        mainitem.isDoctorTextRemarksAvail = true;
                    }
                    if (mainitem.OverallAuditRemarks === "") {
                    } else {
                        mainitem.showAuditorTextNoteDiv = true;
                        mainitem.isAuditRemarksAvail = true;
                    }
                    if (mainitem.AuditorVoiceRecords.length > 0) {
                        mainitem.showAuditorVoiceNoteDiv = true;
                    }
                    if (mainitem.DoctorVoiceRecords.length > 0) {
                        mainitem.showDoctorVoiceNoteDiv = true;
                    }
                    if (mainitem.FileUploads !== undefined && mainitem.FileUploads.length > 0) {
                        angular.forEach(mainitem.FileUploads, function (item) {
                            item.isEditRemarks = false;
                            item.isAddRemarks = false;
                            item.isAuditRemarksAvail = false;
                            item.showSaveCancel = false;
                            if (item.AuditRemarks === "" || item.AuditRemarks === undefined || item.AuditRemarks === null) {
                                item.isAddRemarks = true;
                            } else {
                                item.isAuditRemarksAvail = true;
                            }
                        });
                    }
                });
                if (item.IsDoctorChecked === 0) {
                    $scope.updateAsDoctorViewedDental($scope.selectedAuditedDataArray[0], item, "1");
                }
            }
        }
    }
    function ongetpatientDentalAuditdataByIdError(error) {
        console.log(error);
    }
    $scope.CloseAuditPatientPopup = function () {
        $scope.ShowAuditPatientPopupNotify = false;
    };

    $scope.updateAsDoctorViewed = function (mainitem, item, type) {
        var params = {
            "PatientId": item.PatientId,
            "AppointmentId": mainitem.Consultation[0].AppointmentId,
            "FileUploads": mainitem.FileUploads,
            "OverallAuditRemarks": mainitem.OverallAuditRemarks,
            "Rating": 0,
            "UserId": $scope.UserId,
            "RoleId": $scope.RoleId,
            "DoctorReplyMessage": mainitem.DoctorReplyMessage,
            "IsDoctorChecked": 1,
            "IsAuditorOrUser": "Doctor",
            "UploadType": "DoctorCheck",
            "DoctorVoiceRecords": mainitem.DoctorVoiceRecords,
            "AuditorVoiceRecords": mainitem.AuditorVoiceRecords
        };
        eHnoteAuditServices.modifypatientAuditDatabyId(params, UpdateNotificationSuccess, UpdateNotificationError);
        function UpdateNotificationSuccess(data) {
            if (data.status === "Success") {
                if (type === "2") {
                    alertify.success("Sent Successfully");
                    $scope.NotificationClose();
                }
            }
        }
        function UpdateNotificationError(error) {
            console.log(error);
        }
    };
    $scope.updateAsDoctorViewedDental = function (mainitem, item, type) {
        var params = {
            "PatientId": item.AppointmentDetails[0].PatientId,
            "TreatmentPlanId": mainitem.TreatmentPlanId,
            "FileUploads": mainitem.FileUploads,
            "OverallAuditRemarks": mainitem.OverallAuditRemarks,
            "Rating": 0,
            "UserId": $scope.UserId,
            "RoleId": $scope.RoleId,
            "DoctorReplyMessage": mainitem.DoctorReplyMessage,
            "IsDoctorChecked": 1,
            "IsAuditorOrUser": "Doctor",
            "UploadType": "DoctorCheck",
            "DoctorVoiceRecords": mainitem.DoctorVoiceRecords,
            "AuditorVoiceRecords": mainitem.AuditorVoiceRecords
        };
        eHnoteAuditServices.modifyDentalPatientAuditData(params, UpdateNotificationSuccess, UpdateNotificationError);
        function UpdateNotificationSuccess(data) {
            if (data.status === "Success") {
                if (type === "2") {
                    alertify.success("Sent Successfully");
                    $scope.NotificationClose();
                }
            }
        }
        function UpdateNotificationError(error) {
            console.log(error);
        }
    };
    function restore() {
        Fr.voice.stop();
    }
    //function makeWaveform(ind) {
    //    var analyser = Fr.voice.recorder.analyser;
    //    var bufferLength = analyser.frequencyBinCount;
    //    var dataArray = new Uint8Array(bufferLength);
    //    /**
    //     * The Waveform canvas
    //     */
    //    var WIDTH = 200,
    //        HEIGHT = 40;
    //    var canvasCtx = $("#level" + ind)[0].getContext("2d");
    //    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    //    function draw() {
    //        var drawVisual = requestAnimationFrame(draw);
    //        analyser.getByteTimeDomainData(dataArray);
    //        canvasCtx.fillStyle = "rgb(200, 200, 200)";
    //        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    //        canvasCtx.lineWidth = 2;
    //        canvasCtx.strokeStyle = "rgb(0, 0, 0)";
    //        canvasCtx.beginPath();
    //        var sliceWidth = WIDTH * 1.0 / bufferLength;
    //        var x = 0;
    //        for (var i = 0; i < bufferLength; i++) {
    //            var v = dataArray[i] / 128.0;
    //            var y = v * HEIGHT / 2;
    //            if (i === 0) {
    //                canvasCtx.moveTo(x, y);
    //            } else {
    //                canvasCtx.lineTo(x, y);
    //            }
    //            x += sliceWidth;
    //        }
    //        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
    //        canvasCtx.stroke();
    //    };
    //    draw();
    //}
    $scope.pauseOrResume = "Pause";
    var timeoutId;
    $scope.recordVoiceAudit = function (mainitem) {
        mainitem.RecordingStarted = true;
        mainitem.RecorderPaused = false;
        mainitem.RecorderReset = false;
        if (mainitem.RecorderPauseClicked) {
            Fr.voice.resume();
        } else {
            Fr.voice.record();
        }
        timerStart();
        mainitem.RecorderPauseClicked = false;
        function timerStart() {
            timeoutId = $timeout(function () {
                updateTimer(); // update Model
                if (mainitem.minutes === 2) {
                    alert("Time Exceeds Max Size Reached");
                    Fr.voice.pause();
                    mainitem.RecordingStarted = true;
                    mainitem.RecorderPaused = true;
                    mainitem.RecorderReset = false;
                    mainitem.RecorderPauseClicked = true;
                    $timeout.cancel(timeoutId);
                } else {
                    timerStart();
                }
            }, 1000);
        }
        function updateTimer() {
            mainitem.seconds++;
            if (mainitem.seconds === 60) {
                mainitem.seconds = 0;
                mainitem.minutes++;
            }
        }
    };
    $scope.pauseVoiceAuditRecord = function (mainitem) {
        //if (angular.element("pause").hasClass("resume")) {
        //   
        //    $scope.pauseOrResume = "Resume";
        //} else {
        //    Fr.voice.pause();
        //    $scope.pauseOrResume = "Pause";
        //}
        Fr.voice.pause();
        mainitem.RecordingStarted = false;
        mainitem.RecorderPaused = true;
        mainitem.RecorderReset = false;
        mainitem.RecorderPauseClicked = true;
        $timeout.cancel(timeoutId);
    };
    $scope.clearVoiceAuditRecord = function (mainitem) {
        //restore();
        Fr.voice.stop();
        $timeout.cancel(timeoutId);
        mainitem.RecordingStarted = false;
        mainitem.RecorderPaused = true;
        mainitem.RecorderReset = true;
        mainitem.seconds = 0;
        mainitem.minutes = 0;
    };
    $scope.saveAudioRecordAuditor = function (item) {
        function upload(blob) {
            $scope.AuditorVoiceArray = [];
            var fd = new FormData();
            fd.append("file", blob);
            fd.append("UserId", eHnoteMasterDataService.getLoginId());
            fd.append("HospitalId", $scope.SearchPatientObject.HospitalId);
            fd.append("PatientId", $scope.selectedpatientId);
            fd.append("AppointmentId", item.Consultation[0].AppointmentId);
            fd.append("OverallAuditRemarks", item.OverallAuditRemarks);
            fd.append("Rating", item.Rating);
            fd.append("DoctorReplyMessage", item.DoctorReplyMessage);
            fd.append("IsDoctorChecked", item.IsDoctorChecked);
            fd.append("IsAuditorOrUser", "Auditor");
            fd.append("UploadType", "Add");
            fd.append("DoctorVoiceRecords", item.DoctorVoiceRecords);
            fd.append("AuditorVoiceRecords", item.AuditorVoiceRecords);
            eHnoteAuditServices.addAuditVoiceRecord(fd, callbackAudiofileuploadSuccess, callbackAudiofileuploadError);
            function callbackAudiofileuploadSuccess(data) {
                if (data.status === "Success") {
                    //$scope.ShowRecordSaving = false;
                    alertify.success("Uploaded Successfully");
                    var params = {
                        "PatientId": $scope.selectedpatientId,
                        "AllHospitalsIndicator": $scope.SearchPatientObject.AllHospitalsIndicator,
                        "HospitalId": $scope.SearchPatientObject.HospitalId,
                        "AllDoctorsIndicator": $scope.SearchPatientObject.AllDoctorsIndicator,
                        "DoctorId": $scope.SearchPatientObject.DoctorId,
                        "PageSize": 10,
                        "PageNumber": 1,
                        "SpecializationId": $scope.SpecializationId
                    };
                    eHnoteAuditServices.getpatientAuditdata(params, ongetpatientAuditdataSuccess, ongetpatientAuditdataError);
                } else {
                    //$scope.ShowRecordSaving = false;
                    alertify.success("Error Occured");
                    return false;
                }
            }
            function callbackAudiofileuploadError(err) {
                console.log(error);
            }
        }
        Fr.voice.export(upload, "blob");
        Fr.voice.stop();
        $timeout.cancel(timeoutId);
        //$scope.ShowRecordSaving = true;
    };
    $scope.saveAudioRecordDoctor = function (item) {
        function upload(blob) {
            $scope.DoctorVoiceArray = [];
            var fd = new FormData();
            fd.append("file", blob);
            fd.append("UserId", eHnoteMasterDataService.getLoginId());
            fd.append("HospitalId", $scope.SearchPatientObject.HospitalId);
            fd.append("PatientId", $scope.selectedpatientId);
            fd.append("AppointmentId", item.Consultation[0].AppointmentId);
            fd.append("OverallAuditRemarks", item.OverallAuditRemarks);
            fd.append("Rating", item.Rating);
            fd.append("DoctorReplyMessage", item.DoctorReplyMessage);
            fd.append("IsDoctorChecked", 0);
            fd.append("IsAuditorOrUser", "Doctor");
            fd.append("UploadType", "Add");
            fd.append("DoctorVoiceRecords", item.DoctorVoiceRecords);
            fd.append("AuditorVoiceRecords", item.AuditorVoiceRecords);
            eHnoteAuditServices.addAuditVoiceRecord(fd, callbackAudiofileuploadSuccess, callbackAudiofileuploadError);
            function callbackAudiofileuploadSuccess(data) {
                if (data.status === "Success") {
                    // $scope.ShowRecordSaving = false;
                    // $scope.ShowAuditPatientPopupNotify = true;
                    alertify.success("Uploaded Successfully");
                    $scope.viewPatientAuditData($scope.selectedAuditPatient);
                } else {
                    //  $scope.ShowRecordSaving = false;
                    // $scope.ShowAuditPatientPopupNotify = true;
                    alertify.success("Error Occured");
                    return false;
                }
            }
            function callbackAudiofileuploadError(err) {
                console.log(error);
            }
        }
        Fr.voice.export(upload, "blob");
        Fr.voice.stop();
        $timeout.cancel(timeoutId);
        //$scope.ShowRecordSaving = true;
        // $scope.ShowAuditPatientPopupNotify = false;
    };
    $scope.deleteDoctorVoiceRecord = function (item) {
        var params = {
            "PatientId": $scope.selectedpatientId,
            "AppointmentId": item.Consultation[0].AppointmentId,
            "HospitalId": $scope.SearchPatientObject.HospitalId,
            "OverallAuditRemarks": item.OverallAuditRemarks,
            "Rating": 0,
            "UserId": $scope.UserId,
            "RoleId": $scope.RoleId,
            "DoctorReplyMessage": item.DoctorReplyMessage,
            "IsDoctorChecked": item.IsDoctorChecked,
            "IsAuditorOrUser": "Doctor",
            "UploadType": "Delete",
            "DoctorVoiceRecords": item.DoctorVoiceRecords,
            "AuditorVoiceRecords": item.AuditorVoiceRecords
        };
        eHnoteAuditServices.deleteAuditVoiceRecord(params, callbackAudiofileuploadSuccess, callbackAudiofileuploadError);
        function callbackAudiofileuploadSuccess(data) {
            if (data.status === "Success") {
                alertify.success("deleted Successfully");
                $scope.viewPatientAuditData($scope.selectedAuditPatient);
            } else {
                alertify.success("Error Occured");
                return false;
            }
        }
        function callbackAudiofileuploadError(err) {
            console.log(error);
        }
    };
    $scope.deleteAuditorVoiceRecord = function (item) {
        var params = {
            "PatientId": $scope.selectedpatientId,
            "AppointmentId": item.Consultation[0].AppointmentId,
            "HospitalId": $scope.SearchPatientObject.HospitalId,
            "OverallAuditRemarks": item.OverallAuditRemarks,
            "Rating": 0,
            "UserId": $scope.UserId,
            "RoleId": $scope.RoleId,
            "DoctorReplyMessage": item.DoctorReplyMessage,
            "IsDoctorChecked": item.IsDoctorChecked,
            "IsAuditorOrUser": "Auditor",
            "UploadType": "Delete",
            "DoctorVoiceRecords": item.DoctorVoiceRecords,
            "AuditorVoiceRecords": item.AuditorVoiceRecords
        };
        eHnoteAuditServices.deleteAuditVoiceRecord(params, callbackAudiofileuploadSuccess, callbackAudiofileuploadError);
        function callbackAudiofileuploadSuccess(data) {
            if (data.status === "Success") {
                alertify.success("deleted Successfully");
                var params = {
                    "PatientId": $scope.selectedpatientId,
                    "AllHospitalsIndicator": $scope.SearchPatientObject.AllHospitalsIndicator,
                    "HospitalId": $scope.SearchPatientObject.HospitalId,
                    "AllDoctorsIndicator": $scope.SearchPatientObject.AllDoctorsIndicator,
                    "DoctorId": $scope.SearchPatientObject.DoctorId,
                    "PageSize": 10,
                    "PageNumber": 1,
                    "SpecializationId": $scope.SpecializationId
                };
                eHnoteAuditServices.getpatientAuditdata(params, ongetpatientAuditdataSuccess, ongetpatientAuditdataError);
            } else {
                alertify.success("Error Occured");
                return false;
            }
        }
        function callbackAudiofileuploadError(err) {
            console.log(error);
        }
    };
    $scope.saveDentalAudioRecordAuditor = function (item) {
        function upload(blob) {
            $scope.AuditorVoiceArray = [];
            var fd = new FormData();
            fd.append("file", blob);
            fd.append("UserId", eHnoteMasterDataService.getLoginId());
            fd.append("HospitalId", $scope.SearchPatientObject.HospitalId);
            fd.append("PatientId", $scope.selectedpatientId);
            fd.append("TreatmentPlanId", item.TreatmentPlanId);
            fd.append("OverallAuditRemarks", item.OverallAuditRemarks);
            fd.append("Rating", item.Rating);
            fd.append("DoctorReplyMessage", item.DoctorReplyMessage);
            fd.append("IsDoctorChecked", item.IsDoctorChecked);
            fd.append("IsAuditorOrUser", "Auditor");
            fd.append("UploadType", "Add");
            fd.append("DoctorVoiceRecords", item.DoctorVoiceRecords);
            fd.append("AuditorVoiceRecords", item.AuditorVoiceRecords);
            eHnoteAuditServices.addDentalAuditVoiceRecord(fd, callbackAudiofileuploadSuccess, callbackAudiofileuploadError);
            function callbackAudiofileuploadSuccess(data) {
                if (data.status === "Success") {
                    //$scope.ShowRecordSaving = false;
                    alertify.success("Uploaded Successfully");
                    var params = {
                        "PatientId": $scope.selectedpatientId,
                        "PageSize": 5,
                        "PageNumber": 1,
                        "SpecializationId": $scope.SpecializationId
                    };
                    eHnoteAuditServices.getpatientAuditdataForDental(params, ongetdentalpatientAuditdataSuccess, ongetdentalpatientAuditdataError);
                } else {
                    //$scope.ShowRecordSaving = false;
                    alertify.success("Error Occured");
                    return false;
                }
            }
            function callbackAudiofileuploadError(err) {
                console.log(error);
            }
        }
        Fr.voice.export(upload, "blob");
        Fr.voice.stop();
        $timeout.cancel(timeoutId);
        //$scope.ShowRecordSaving = true;
    };

    $scope.deleteDentalAuditorVoiceRecord = function (item) {
        var params = {
            "PatientId": $scope.selectedpatientId,
            "TreatmentPlanId": item.TreatmentPlanId,
            "HospitalId": $scope.SearchPatientObject.HospitalId,
            "OverallAuditRemarks": item.OverallAuditRemarks,
            "Rating": 0,
            "UserId": $scope.UserId,
            "RoleId": $scope.RoleId,
            "DoctorReplyMessage": item.DoctorReplyMessage,
            "IsDoctorChecked": item.IsDoctorChecked,
            "IsAuditorOrUser": "Auditor",
            "UploadType": "Delete",
            "DoctorVoiceRecords": item.DoctorVoiceRecords,
            "AuditorVoiceRecords": item.AuditorVoiceRecords
        };
        eHnoteAuditServices.deleteDentalAuditVoiceRecord(params, callbackAudiofileuploadSuccess, callbackAudiofileuploadError);
        function callbackAudiofileuploadSuccess(data) {
            if (data.status === "Success") {
                alertify.success("deleted Successfully");
                var params = {
                    "PatientId": $scope.selectedpatientId,
                    "PageSize": 10,
                    "PageNumber": 1

                };
                eHnoteAuditServices.getpatientAuditdataForDental(params, ongetdentalpatientAuditdataSuccess, ongetdentalpatientAuditdataError);
            } else {
                alertify.success("Error Occured");
                return false;
            }
        }
        function callbackAudiofileuploadError(err) {
            console.log(error);
        }

    };

    //$scope.LostDiagMedicalcondition = function () {
    //    $scope.DiaFocusMedicalcondition = true;
    //};

    $scope.saveDentalAudioRecordDoctor = function (item) {
        function upload(blob) {
            $scope.DoctorVoiceArray = [];
            var fd = new FormData();
            fd.append("file", blob);
            fd.append("UserId", eHnoteMasterDataService.getLoginId());
            fd.append("HospitalId", $scope.SearchPatientObject.HospitalId);
            fd.append("PatientId", $scope.selectedpatientId);
            fd.append("TreatmentPlanId", item.TreatmentPlanId);
            fd.append("OverallAuditRemarks", item.OverallAuditRemarks);
            fd.append("Rating", item.Rating);
            fd.append("DoctorReplyMessage", item.DoctorReplyMessage);
            fd.append("IsDoctorChecked", 0);
            fd.append("IsAuditorOrUser", "Doctor");
            fd.append("UploadType", "Add");
            fd.append("DoctorVoiceRecords", item.DoctorVoiceRecords);
            fd.append("AuditorVoiceRecords", item.AuditorVoiceRecords);
            eHnoteAuditServices.addDentalAuditVoiceRecord(fd, callbackAudiofileuploadSuccess, callbackAudiofileuploadError);
            function callbackAudiofileuploadSuccess(data) {
                if (data.status === "Success") {
                    // $scope.ShowRecordSaving = false;
                    // $scope.ShowAuditPatientPopupNotify = true;
                    var params = {
                        "PatientId": $scope.selectedpatientId,
                        "PageSize": 10,
                        "PageNumber": 1,
                        "TreatmentPlanId": item.TreatmentPlanId
                    };
                    eHnoteAuditServices.getpatientAuditdataForDental(params, ongetpatientDataPopUpSuccess, ongetpatientDataPopUpError);
                    alertify.success("Uploaded Successfully");

                } else {
                    //  $scope.ShowRecordSaving = false;
                    // $scope.ShowAuditPatientPopupNotify = true;
                    alertify.success("Error Occured");
                    return false;
                }
            }
            function callbackAudiofileuploadError(err) {
                console.log(error);
            }
        }
        Fr.voice.export(upload, "blob");
        Fr.voice.stop();
        $timeout.cancel(timeoutId);

    };
    $scope.deleteDentalDoctorVoiceRecord = function (item) {
        var params = {
            "PatientId": $scope.selectedpatientId,
            "TreatmentPlanId": item.TreatmentPlanId,
            "HospitalId": $scope.SearchPatientObject.HospitalId,
            "OverallAuditRemarks": item.OverallAuditRemarks,
            "Rating": 0,
            "UserId": $scope.UserId,
            "RoleId": $scope.RoleId,
            "DoctorReplyMessage": item.DoctorReplyMessage,
            "IsDoctorChecked": item.IsDoctorChecked,
            "IsAuditorOrUser": "Doctor",
            "UploadType": "Delete",
            "DoctorVoiceRecords": item.DoctorVoiceRecords,
            "AuditorVoiceRecords": item.AuditorVoiceRecords
        };
        eHnoteAuditServices.deleteDentalAuditVoiceRecord(params, callbackAudiofileuploadSuccess, callbackAudiofileuploadError);
        function callbackAudiofileuploadSuccess(data) {
            if (data.status === "Success") {
                alertify.success("deleted Successfully");
                var params = {
                    "PatientId": $scope.selectedpatientId,
                    "PageSize": 10,
                    "PageNumber": 1,
                    "TreatmentPlanId": item.TreatmentPlanId
                };
                eHnoteAuditServices.getpatientAuditdataForDental(params, ongetpatientDataPopUpSuccess, ongetpatientDataPopUpError);
            } else {
                alertify.success("Error Occured");
                return false;
            }
        }
        function callbackAudiofileuploadError(err) {
            console.log(error);
        }
    };


    var ImageContainer = null;
    var viewerinstance = null;

    $scope.ShowViewerImages = function () {
        //ImageContainer = $(Ele);
        //var obj = angular.element('#bharath1').scope();
        //ImageContainer = $(obj);
        //ImageContainer.viewer({ "loop": false, "interval": 2500 });
        //ImageContainer  new Viewer(document.getElementById('#bharath1'));

        //ImageContainer = new Viewer(
        //    document.getElementById('#bharath1')
        //    ,{ "loop": false, "interval": 2500 }
        //);
        //viewerinstance = ImageContainer.data("viewer");

        //ImageContainer = angular.element('#bharath1').scope();

        var documentResult = document.getElementById("bharath1");
        console.log('document.getElementsByClassName: ', documentResult);

        ImageContainer = angular.element(documentResult);
        ImageContainer.viewer({ "loop": false, "interval": 2500 });
        viewerinstance = ImageContainer.data("viewer");

    }

    $(document).ready(function () {

        //$(document).on("click", "#record:not(.disabled)", function () {
        //    Fr.voice.record($("#live").is(":checked"), function () {
        //        $(".recordButton").addClass("disabled");
        //        $("#live").addClass("disabled");
        //        $(".one").removeClass("disabled");
        //        makeWaveform();
        //    });
        //});
        //$(document).on("click", "#pause:not(.disabled)", function () {
        //    if ($(this).hasClass("resume")) {
        //        Fr.voice.resume();
        //        $(this).replaceWith("<a class="button one" id="pause">Pause</a>");
        //    } else {
        //        Fr.voice.pause();
        //        $(this).replaceWith("<a class="button one resume" id="pause">Resume</a>");
        //    }
        //});
        //$(document).on("click", "#stop:not(.disabled)", function () {
        //    restore();
        //});
        $(document).on("click", "#play:not(.disabled)", function () {
            if ($(this).parent().data("type") === "mp3") {
                Fr.voice.exportMP3(function (url) {
                    //$("#audio").attr("src", url);
                    //$("#audio")[0].play();
                }, "URL");
            } else {
                Fr.voice.export(function (url) {
                    //$("#audio").attr("src", url);
                    //$("#audio")[0].play();
                }, "URL");
            }
            restore();
        });
        $(document).on("click", "#download:not(.disabled)", function () {
            if ($(this).parent().data("type") === "mp3") {
                Fr.voice.exportMP3(function (url) {
                    $("<a href='" + url + "' download='MyRecording.mp3'></a>")[0].click();
                }, "URL");
            } else {
                Fr.voice.export(function (url) {
                    $("<a href='" + url + "' download='MyRecording.wav'></a>")[0].click();
                }, "URL");
            }
            restore();
        });
        $(document).on("click", "#base64:not(.disabled)", function () {
            if ($(this).parent().data("type") === "mp3") {
                Fr.voice.exportMP3(function (url) {
                    alert("Check the web console for the URL");
                    $("<a href='" + url + "' target='_blank'></a>")[0].click();
                }, "base64");
            } else {
                Fr.voice.export(function (url) {
                    alert("Check the web console for the URL");
                    $("<a href='" + url + "' target='_blank'></a>")[0].click();
                }, "base64");
            }
            restore();
        });
        //$(document).on("click", "#save:not(.disabled)", function () {
        //    function upload(blob) {
        //        var formData = new FormData();
        //        formData.append("file", blob);
        //        $.ajax({
        //            url: "upload.php",
        //            type: "POST",
        //            data: formData,
        //            contentType: false,
        //            processData: false,
        //            success: function (url) {
        //                $("#audio").attr("src", url);
        //                $("#audio")[0].play();
        //                alert("Saved In Server. See audio element"s src for URL");
        //            }
        //        });
        //    }
        //    if ($(this).parent().data("type") === "mp3") {
        //        Fr.voice.exportMP3(upload, "blob");
        //    } else {
        //        Fr.voice.export(upload, "blob");
        //    }
        //    restore();
        //});
    });



   
    $scope.ASCAuditLogArray = [];
    $scope.SelectedAppointmentData = function (item) {
        $scope.ASCAuditLogArray = item.AuditLogArray || [];
    }

    $scope.openAuditVisitSummary = function (item) {
        let selectedApptObj = item || '';
        $scope.cacheStorageItem.SurgeryList = item.SurgeryList || [];
        $scope.cacheStorageItem.PreAdmSurgeryList = item.PreAdmSurgeryList || [];

        $scope.allUserList = $scope.allUserList||[]
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/auditVisitSummary.html",
            "backdrop": "static",
            "keyboard": false,
            //"scope": $scope,
            "windowClass": "modal__popup--1 bottom-to-top-modal",
            "resolve": {
                "selectedApptObj": function () { return selectedApptObj; },
                "allUserList": function () { return $scope.allUserList; },
                "ParentObj": function () { return $scope.ParentObj; },
                "cacheStorageItem": function () { return $scope.cacheStorageItem; },
                "UserAccessRights": function () { return $scope.UserAccessRights; },
                "IsShowEmptyASCChecklist": function () { return $scope.IsShowEmptyASCChecklist; },
                
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteSurgeryService, eHnoteMasterDataService, $q, eHnoteLoginStatusService, allUserList, ParentObj, cacheStorageItem, UserAccessRights, IsShowEmptyASCChecklist) {
                var doctorInfo = eHnoteMasterDataService.getUserInfo();
                $scope.UserId = eHnoteMasterDataService.getLoginId();
                $scope.allUserList = allUserList || [];
                $scope.UserAccessRights = UserAccessRights;
                $scope.IsShowEmptyASCChecklist = IsShowEmptyASCChecklist || false;
                $scope.CheckinChecklistArray = [];
                $scope.OnlyNusrseAnesthetistRoles = [];
                if ($scope.allUserList.length > 0) {
                
                $scope.OnlyNusrseAnesthetistRoles = $scope.allUserList.filter((x) => x.RoleId == 8 || x.RoleId == 25);

                
                    $scope.CheckinChecklistArray = $scope.OnlyNusrseAnesthetistRoles;
                }
                $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
                if (doctorInfo.doctordata.UserAddress !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
                    $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    $scope.ParenthospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                }

                $scope.ParentObj = ParentObj;
                selectedApptObj = selectedApptObj || {};
                $scope.Patient = selectedApptObj.Patient || {};
                $scope.cacheStorageItem = cacheStorageItem || {};
                $scope.SubTab = 3;

                $scope.PreOpStatusID = selectedApptObj.PreOpStatusID || 0;
                $scope.IntraOpStatusID = selectedApptObj.IntraOpStatusID || 0;
                $scope.PostOpStatusID = selectedApptObj.PostOpStatusID || 0;

                $scope.show = {
                    "IsAnesthesiaMedications": false,
                    "IsAnesthesiaGenOrders": false,
                    "IsNurseGenOrders": false,
                    "IsNurseMedications": false,
                };
                $scope.AscPreopObj = {
                    "OrgASCChecklist": []
                }
                $scope.PreOpQuickSummaryObj = {
                    "PreOpNurseChartStatus": '',
                    "PreOpAnesthesiaChartStatus ": '',
                    "IVSiteBlocked": false,
                    "IVSiteFluidsArray": [],
                    "IVSiteFlushArray": [],
                    "IVSiteLRArray": [],
                    "IVBlockedArray": [],
                    "Vitals": [],
                    "SystemicHistory": [],
                    "SurgicalHistory": [],
                    "Ascpatientpopupsavearray": [],
                    "AllergyItems": [],
                    "CurrentSystemicMedicationsHistory": [],
                    "CurrentEyeMedications": [],
                    "AlderetScoreDetails": [],
                    "TotalAlderetScore": null,
                    "HealthArray": [],
                    "DocumentDetails": [],
                    "IsCardiacWNL": false,
                    "IsPulmonaryWNL": false,
                    "IsHepaticWNL": false,
                    "IsEndocrineWNL": false,
                    "IsNeurologicWNL": false,
                    "IsHemeOncWNL": false,
                    "IsNervousSystemWNL": false,
                    "IsKidneyDiseaseWNL": false,
                    "IsMusculoSkeletalSystemWNL": false,
                    "IsAutoImmuneDisordersWNL": false,
                    "IsPsychosisWNL": false,
                    "IsOthersWNL": false,
                    "IsHeentWNL": false,
                    "IsLungsWNL": false,
                    "ReviewedbyInd": false,
                    "SelectedCardiacIssues": "",
                    "SelectedPulmonaryIssues": "",
                    "SelectedHepaticIssues": "",
                    "SelectedEndocrineIssues": "",
                    "SelectedNeurologicIssues": "",
                    "SelectedHemeOncIssues": "",
                    "SelectedNervousSystemIssues": "",
                    "SelectedKidneyDiseaseIssues": "",
                    "SelectedMusculoSkeletalSystemIssues": "",
                    "SelectedAutoImmuneDisordersIssues": "",
                    "SelectedPsychosisIssues": "",
                    "SelectedOthersIssues": "",
                    "SelectedHeentIssues": "",
                    "SelectedLungsIssues": "",
                    "PreOpCallDetails": [],
                    "PreOpMedications": [],
                    "OrderDetails": [],
                    "DilationMedications": [],
                    "PreOpMedicationRemarks": "",
                    "OrgASCChecklist": [],
                    "GeneralChecklistRemarks": "",
                    "NewGeneralChecklistName": "",
                    "IsAllMedicineCheckListChecked": null,
                    "NurseChecklistTemplates": [],
                    "NurseChecklistValueType": "1",
                    "GeneralChecklistValueType": "1",
                    "MedicineChecklistValueType": "1",
                    "IsAddNewNurseCheckList": false,
                    "IsAddNewGeneralCheckList": false,
                    "IsAddNewMedicineCheckList": false,
                    "IsShowPreOpCheckListHealthPhysicalInd": false,
                    "IsAllHealthWNL": false,
                    "ReviewedBy": null,
                    "ReviewedByName": "",
                    "ReviewedDate": "",
                    "ReviewedTime": "",
                    "PreOpNotes": "",
                    "PreOpChartStatus": "",
                    "StatusFlag": "",
                    "PreOpNurseNotes": "",
                    "OthersNotes": "",
                    "HeentNotes": "",
                    "LungsNotes": "",
                    "PsychosisNotes": "",
                    "AutoImmuneDisordersNotes": "",
                    "KidneyDiseaseNotes": "",
                    "CardiacNotes": "",
                    "PulmonaryNotes": "",
                    "HepaticNotes": "",
                    "EndocrineNotes": "",
                    "NeurologicNotes": "",
                    "HemeOncNotes": "",
                    "NervousSystemNotes": "",
                    "MusculoSkeletalSystemNotes": "",
                    "ROSOverAllRemarks": "",
                    "MedicationReviewId": null,
                    "DilationReviewId": null,
                    "DilationMedicationsNotes": "",
                    "MedicationReviewName": "",
                    "MedicationRemarks": "",
                    "DilationReviewName": "",
                    "IsVeinOpened": null,
                    "IsDiabetes": null,
                    "IsNasalcanula": null,
                    "IsHypoglycemiaCheck": null,
                    "DiabetesResult": "",
                    "DiabetesTime": "",
                    "ODPupilSize": "",
                    "OSPupilSize": "",
                    "MedicineChecklistRemarks": "",
                    "NurseChecklistRemarks": "",
                    "Ascpatientpopupsavearray": [],
                    "DiabetesTimings": [],
                    "SurgicalSiteVerifiedBy": null,
                    "SurgicalSiteVerifiedByName": "",
                    "PreOpSurgicalSiteRemarks": "",
                    "IVSite": null,
                    "IVBlockedArray": [],
                    "IVNeedleSize": null,
                    "PatencyStatus": "",
                    "IVArm": "",
                    "IdentifierName": "",
                    "IdentifierDurationDate": "",
                    "PreOpHandOffReviewedName": '',
                    "PreOpHandOffReviewedBy": null,
                    "PreOpHandOffTime": "",
                    "PreOpHandoffRemarks": "",
                    "PreOpOverallNotes": "",

                    "NurseFallRiskID": 0,
                    "NurseFallRiskName": '',
                    "FallRiskLevel": '',
                    "ImplementedFallRiskProtocol": false,
                    "ImplementedFallRiskProtocoltype": '',
                    "FallRiskAssessmentTotalScore": '',
                    "PreOpAnesthesiaNotes": null,
                    "OxygenType": "",
                    "OxygenQuantity": "",
                    "EndotrachealTubeNotes": "",
                    "LMANotes": "",
                    "IsPreOpMedicationInd": true,

                    "IVSiteFluids": null,
                    "IVSiteFlush": null,
                    "IVSiteLactatedRingers": null,
                    "IVSiteFluidsName": '',
                    "IVSiteFlushName": '',
                    "IVSiteLactatedRingersName": '',
                    "PreOpHandOffFromName": '',
                    "IVFluidsId": null,
                    "IVFluidsName": '',

                    "NursingCarePlanData": [],
                    "PreOpInRoomTime": '',
                    "PreOpDiabetesRemarks": '',
                    "NoOfAttempts": null,
                    "IvAccessGivenBy": null,
                    "IvAccessGivenByName": '',
                    "IvAccessGivenByTime": '',
                    "FemtoArcuateIncisions1": '',
                    "IsFemtoArcuateIncisions1NA": false,
                    "FemtoArcuateIncisions2": '',
                    "IsFemtoArcuateIncisions2NA": false,
                    "FemtoArcuateIncisionsNotes": '',
                    "FemtoTimeOut": '',
                    "FemtoStartTime": '',
                    "FemtoEndTime": '',
                    "FemtoReferenceNo": '',
                    "FemtoLotNo": '',
                    "FemtoExpiryDate": null,
                    "FemtoOverAllNotes": '',
                    "FemtNurseReviewedById": null,
                    "FemtNurseReviewedByName": '',
                    "FemtDoctorReviewedById": null,
                    "FemtDoctorReviewedByName": '',
                    "FemtDoctorReviewedByDate": null,
                    "FemtDoctorReviewedByTime": '',
                    "IfFemtoTemplateDataAdded": false,
                    "PainLevel": null,
                    "FallriskBraceletprovided": '',
                    "AssistiveWalkingDevice": '',
                    "AllOrgAscChecklistData": [],
                    "IsBeforeAnesthesiaNormal": false,
                    "BeforeAnesthesiaReviewedBy": null,
                    "BeforeAnesthesiaReviewedByName": "",
                    "BeforeAnesthesiaReviewedDateTime": null,
                    "PreOpAccompainedBy": "",
                    "PreOpAccompainedByNotes": "",
                    "PreOpAccompainedName": "",
                    "PreOpAccompaniedSign": "",
                    "PreOpAccompaniedSignedDateTime": null,
                    "IsAccompaniedSignDone": false,
                    "AllergyRemarks": "",
                    "SurgicalRemarks": "",
                    "CurrentEyeRemarks": "",
                    "CurrentSystemicRemarks": "",
                    "SystemicHistoryRemarks": "",
                    "LifestyleHistoryRemarks": "",
                    "VitalsArray": [],
                    "VitalsDisplay": [],
                    "SystemicHistory": [],
                    "AllergyItems": [],
                    "SurgicalHistory": [],
                    "CurrentSystemicMedicationList": [],
                    "LifestyleHistoryArray": [],
                    "IsSurgeonOrdersTimeChecked": false,
                    "IsAnesthesiaOrdersTimeChecked":false,
                    "ChunkedGeneralChecklist": [],
                    "ChunkedClinicalChecklist": [],
                    "FamilyRelationId": null,
                    "FamilyRelationName": "",
                    "IsIVAccessdata": false,
                    "MentalStatus": "",
                    "Height": "",
                    "HeightUnit": "",
                    "Weight": "",
                    "WeightUnit": "",
                    "BMI": "",
                };
                $scope.IntraOpQuickSummaryObj = {
                    "Vitals": [],
                    "AllergyItems": [],
                    "PreOpMedications": [],
                    "SystemicHistory": [],
                    "SurgicalHistory": [],
                    "CurrentEyeMedications": [],
                    "CurrentSystemicMedicationsHistory": [],
                    "InvestigationsList": [],
                    "DocumentDetails": [],
                    "LastSignOffUserDetails": [],
                    "PatientASCIntraOPId": null,
                    "Pathology": "",
                    "PatientAlert": "",
                    "VitalsType": "",
                    "PatientTransferType": "",
                    "PatientTransferNotes": "",
                    "SurgeonOperativeNotes": "",
                    "BeforeAnesthesiaTime": "",
                    "SurgeonComplicationNotes": "",
                    "Findings": "",
                    "IntraOpNurseChartStatus": '',
                    "IntraOpAnesthesiaChartStatus": '',
                    "Complications": "",
                    "OrdersReviewedBy": 0,
                    "NurseActionobj": {
                        "NurseChecklistValueType": "1",
                        "NewNurseChecklistName": "",
                        "SubOrganLidsList": [],
                        "SubOrganConjunctivaList": [],
                        "OrgASCChecklist": [],
                        "Cauteraisation": [],
                        "NurseReviewedById": null,
                        "NurseActionOrganId": null,
                        "Type": "Medications",
                        "Levelofconsciousness": "",
                        "LevelofconsciousnessNotes": "",
                        "ChecklistRemarks": "",
                        "PatientPosition": "",
                        "PatientPositionNotes": "",
                        "SafetyDevicePosition": {
                            "ArmsToTheBody": "",
                            "Strap": "",
                            "AnotherRailing": "",
                            "Others": ""
                        },
                        "SafetyDevicePositionNotes": "",
                        "SkinPreparation": "",
                        "SkinPreparationNotes": "",
                        "Sterilewater": "",
                        "Alcohol": "",
                        "AreaNotes": "",
                        "EspecimenLab": "",
                        "EspecimenLabNotes": "",
                        "CropHour": "",
                        "SurgeonId": null,
                        "CoSurgeonId": null,
                        "TechnicianId": null,
                        "NurseId": null,
                        "AnesthesistId": null,
                        "ReliefId": null,
                        "SupportingStaffId": null,
                        "SurgeryRoomNo": "",
                        "HallEntranceStartTime": "",
                        "HallEntranceEndTime": "",
                        "SurgeryStartTime": "",
                        "SurgeryEndTime": "",
                        "AnesthesiaStartTime": "",
                        "AnesthesiaEndTime": "",
                        "SurgicalFirstNeedles": "",
                        "SurgicalFirstBlades": "",
                        "SurgicalFirstOthers": "",
                        "SurgicalFirstVerifiedBy": "",
                        "SurgicalFirstVerifiedByName": "",
                        "SurgicalFirstTime": "",
                        "SurgicalSecondNeedles": "",
                        "SurgicalSecondBlades": "",
                        "SurgicalSecondOthers": "",
                        "SurgicalSecondVerifiedBy": "",
                        "SurgicalSecondVerifiedByName": "",
                        "SurgicalSecondTime": "",
                        "SurgicalFinalNeedles": "",
                        "SurgicalFinalBlades": "",
                        "SurgicalFinalOthers": "",
                        "CauteraisationOthers": "",
                        "SurgicalFinalVerifiedBy": "",
                        "SurgicalFinalVerifiedByName": "",
                        "SurgicalFinalTime": "",
                        "HydrationIV": false,
                        "DrainageOthers": "",
                        "Cleansed": false,
                        "CleanContaminated": false,
                        "Contaminated": false,
                        "Dirty": false,
                        "Disposition": false,
                        "Recoveryroom": false,
                        "CarePostoperative": false,
                        "OthersIntraData": false,
                        "PatientTolerated": false,
                        "NurseFireRiskID": 0,
                        "AnesthetistFireRiskID": 0,
                        "DoctorFireRiskID": 0,
                        "RiskLevel": '',
                        "IsShowAnesthetistReviewByinFireRisk": false,
                        "IsShowDoctorReviewByinFireRisk": false,
                        "NurseFallRiskID": 0,
                        "FallRiskLevel": '',
                        "ImplementedFallRiskProtocol": false,
                        "ImplementedFallRiskProtocoltype": '',
                        "FallRiskAssessmentTotalScore": '',
                        "CauteraisationOthers": "",
                        "PatientReceivedByName": "",
                        "HallEntranceStartTime": "",
                        "DoctorFireRiskName": "",
                        "AnesthetistFireRiskName": "",
                        "NurseFireRiskName": "",
                        "NursingCarePlanData": [],
                        "AdditionalStaffId": null,
                        "NurseFireRiskReviewdDate": null,
                        "AnesthetistReviewdDate": null,
                        "DoctorReviewdDate": null,
                        "SurgeryStaffAnesthesistId": null,
                        "SurgeryStaffAnesthesistName": "",
                    },
                    "Ordersobj": {
                        "PatientAscEyeDrops": [],
                        "PatientAscInjections": [],
                    },
                    "Diagnosis": [],
                    "IntraOpDiagnosis": [],
                    "ROSOverAllRemarks": "",
                    "PrescriptionDetails": [],
                    "ReviewDoctorId": null,
                    "ReviewNurseId": null,
                    "ReviewAnesthetistId": null,
                    "ReviewTechnicianId": null,
                    "ImplantsDetailsArray": [],
                    "OthersDetailsArray": [],
                    "EquipmentList": [],
                    "MedicineOrdersInstructions": "",
                    "DoctorNotes": "",
                    "DoctorName": "",
                    "NurseName": "",
                    "AnesthesiaName": "",
                    "ReviewedbyInd": false,
                    "AnesthesiaTypelist": [],
                    //  "AnesthesiaMedications": [],
                    "EBLValue": "",
                    "IntakeValue": "",
                    "OutputValue": "",
                    "InTime": "",
                    "OutTime": "",
                    "AnesthesiaMedicationsReviewId": null,
                    "MedicationsReviewId": null,
                    "AnesthesiaMedicationsNotes": "",
                    "MedicationsNotes": "",
                    "S3URL": "",
                    "AnesthesiaMedicationsReviewName": "",
                    "MedicationsReviewName": "",
                    "CDEOD": "",
                    "CDEOS": "",
                    "CDERemarks": "",
                    "IsCDEInd": false,
                    "BeforeAnesthesiaReviewedByName": "",
                    "BeforeORReviewedByName": "",
                    "PatientStableSurgery": false,
                    "AdequatePreoperativeWorkup": false,
                    "DoctorLicense": '',
                    "NurseLicense": '',
                    "AnesthesiaLicense": '',
                    "AnesthesiologistName": '',
                    "AnesthesiologistLicense": '',
                    "TechnicianName": '',
                    "TechnicianLicense": '',
                    "IsIntraOPAnesthesiaActionVitalsArrayEmpty": false,
                    //"IntraOpMedications":'',
                    "handOffNotesInd": false,
                    "OxygenType": "",
                    "OxygenQuantity": "",
                    "EndotrachealTubeNotes": "",
                    "LMANotes": "",
                    "IntraOpAnesthesiaNotes": null,
                    "IntraOpNotes": null,
                    "HandoffRemarks": '',
                    "HandOffReviewedByName": '',
                    "HandOffTime": '',
                    "HandOffReviewedBy": null,
                    "PhacoMachines": [],
                    "SurgicalSuplyName": '',
                    "LotNumber": null,
                    "ExpirationDate": null,
                    "SurgicalSuplyId": null,
                    "AllIntraOpChecklistsArray": [],
                    "OrderDetails": [],
                    "HandOffFromReviewedByName": '',
                    "SurgicalSupplyName": '',
                    "IntraOpNurseNotes": "",
                    "BeforeAnesthesiaReviewedDateTime": null,
                    "BeforeIncisionReviewedDateTime": null,
                    "BeforeORReviewedDateTime": null,
                    "NurseReviewedDate": null,
                    "AnesthesiologistReviewedDate": null,
                    "TechnicianReviewedDate":null,
                };

                $scope.PostOpQuickSummaryObj = {
                    "IsShow": false,
                    "IsEdit": false,
                    "IsShowPostOpSummaryViewInd": false,
                    "ProgressRemarksInd": false,
                    "IsPostOpHighCriteria": false,
                    "IsPostProceduresNotes": false,
                    "PostOpAnesthesiaChartStatus": '',
                    "PostOpNurseChartStatus": '',
                    "ShowGraph": false,
                    "Vitals": [],
                    "AllergyItems": [],
                    "SystemicHistory": [],
                    "SurgicalHistory": [],
                    "OrgASCChecklist": [],
                    "SelectedMedicineTemplateList": [],
                    "NurseChart": {
                        "Checklists": {
                            "PostOPNurseCheckListId": 0,
                            "PatientReceived": "",
                            "AccompaniedBy": "",
                            "PainLevel": null,
                            "NourishmentProvider": "",
                            "BloodSugar": "",
                            "PostOpInstruction": "",
                            "ReceivedRoom": "",
                            "Patientallowed": "",
                            "Personalbelonging": "",
                            "Patientadvised": "",
                            "PatientClinic": "",
                            "Physicianexamine": "",
                            "Removedintact": "",
                            "Orientedtimes": "",
                            "OtherMental": "",
                            "Notes": "",
                            "DeleteInd": "N"
                        },
                        "Actions": {
                            "PostOPNurseActionId": 0,
                            "Speech": "",
                            "Vision": "",
                            "Pain": "",
                            "ConsciousLevel": "",
                            "Fur": "",
                            "IncisionlaDrainage": "",
                            "Nausea": "",
                            "IngestedFood": "",
                            "Referred": "",
                            "Relationship": "",
                            "Exit": "",
                            "Instruction": "",
                            "Prescription": "",
                            "LensCard": "",
                            "Surveillance": "",
                            "Bandage": "",
                            "Advancediet": "",
                            "Discharge": "",
                            "Administer": "",
                            "Tylenol": "",
                            "Review": "",
                            "Notes": "",
                            "DeleteInd": "N",
                            "SignoffBy": null
                        },
                        "ReviewedBy": null
                    },
                    "ContactStartTime": "",
                    "PostOpInstruction": "",
                    "PostOpInstructionTemplateId": 0,
                    "SurgeonObj": {
                        "DoctorNotes": "",
                        "IsDoctorNotes": false,
                        "PostOpInstruction": "",
                        "MedicationsList": [],
                        "InvestigationsList": [],
                        "ReviewedBy": null
                    },
                    "DischargeObj": {
                        "OperativeNotes": "",
                        "SurgeonOperativeNotes": "",
                        "ComplicationsNotes": "",
                        "DischargeCriteriaList": [],
                        "DischargeCriteriaNotes": "",
                        "TransferList": [],
                        "Time": "",
                        "Meridian": "AM",
                        "TransferReason": "",
                        "FollowUpDate1": {
                            "Date": "",
                            "Time": "",
                            "Meridian": "AM"
                        },
                        "FollowUpDate2": {
                            "Date": "",
                            "Time": "",
                            "Meridian": "AM"
                        },
                        "FollowUpDate3": {
                            "Date": "",
                            "Time": "",
                            "Meridian": "AM"
                        },
                        "Others": "",
                        "ReviewedBy": null
                    },
                    "IsAllNurseCheckListChecked": null,
                    "IsAllActionCheckListChecked": null,
                    "graphImg": "",
                    "S3URL": "",
                    "TotalAlderetScore": 0,
                    "AlderetScoreDetails": [],
                    "DischargeMedicationInstructionTemplates": [],
                    "DischargeSummaryDetails": "",
                    "DiagnosisObject": "",
                    "PostOpDiagnosis": [],
                    "ROSOverAllRemarks": "",
                    "AnesthesiaTypelist": [{
                        "AnesthesiaTypeId": 1,
                        "AnesthesiaType": "TopicalAnesthesia",
                        "IsSelected": false,
                        "PatientAnesthesiaPlanId": 0,

                    },
                    {
                        "AnesthesiaTypeId": 2,
                        "AnesthesiaType": "LocalAnesthesia",
                        "IsSelected": false,
                        "PatientAnesthesiaPlanId": 0
                    },
                    {
                        "AnesthesiaTypeId": 3,
                        "AnesthesiaType": "GeneralAnesthesia",
                        "IsSelected": false,
                        "PatientAnesthesiaPlanId": 0
                    },
                    {
                        "AnesthesiaTypeId": 4,
                        "AnesthesiaType": "PeribulbarAnesthesia",
                        "IsSelected": false,
                        "PatientAnesthesiaPlanId": 0
                    },
                    {
                        "AnesthesiaTypeId": 5,
                        "AnesthesiaType": "Sub-TenonAnesthesia",
                        "IsSelected": false,
                        "PatientAnesthesiaPlanId": 0
                    },
                    {
                        "AnesthesiaTypeId": 6,
                        "AnesthesiaType": "RegionalAnesthesia",
                        "IsSelected": false,
                        "PatientAnesthesiaPlanId": 0
                    }],
                    "Intake": "",
                    "Output": "",
                    "EBL": "",
                    "InTime": "",
                    "OutTime": "",
                    "PrescriptionDetails": [],
                    "ReviewDoctorId": null,
                    "ReviewNurseId": null,
                    "ReviewAnesthetistId": null,
                    "ReviewTechnicianId": null,
                    "CurrentEyeMedications": [],
                    "CurrentSystemicMedicationsHistory": [],
                    "MedicineOrdersInstructions": "",
                    "DoctorName": "",
                    "NurseName": "",
                    "TechnicianName": "",
                    "AnesthesiaName": "",
                    "ReviewedbyInd": false,
                    "IsPostOpProgressNotesInd": false,
                    "RecoveryStartTime": "",
                    "RecoveryStopTime": "",
                    "PostOpMedications": [],
                    "OrderDetails": [],
                    "IntrOpHandOffTime": "",
                    "IntraOpHandOffReviewedByname": "",
                    "IsCheckinCheckListEmpty": false,
                    "PostOpAnesthesiaNotes": null,
                    "PostOpNotes": null,
                    "IsPatientDischarge": false,
                    "OxygenType": '',
                    "OxygenType": '',
                    "OxygenQuantity": '',
                    "NursingCarePlanData": [],
                    "ProgressNotesPainScore": null,
                    "IntraOpAnesthesiaStartTime": '',
                    "IntraOpAnesthesiaEndTime": '',
                    "DiscontinueIVTime": '',
                    "PatientDischargeTime": '',
                    "ProgressOverAllNotes": "",
                    "AnesthetistReviewedDate": null,
                    "NurseReviewedDate": null,
                    "DischargeSignOffStartTime": '',
                    "DischargeSignOffEndTime": '',
                    "DischargeStartTimeUser": null,
                    "DischargeEndTimeUser": null,
                    "DischargeStopTimerRemarks": null,
                    "Recovery1Intime": null,
                    "Recovery1Outtime": null,
                    "Recovery2Intime": null,
                    "Recovery2Outtime": null,
                    "R2ReviewAnesthetistId": null,
                    "R2ReviewNurseId": null,
                    "Recovery2AnesthesiaReviewedDate": null,
                    "Recovery2NurseReviewedDate": null,
                    "R2PostOpAnesthesiaChartStatus": "",
                    "R2PostOpNurseChartStatus":""
                }

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

                $scope.subVitallist = function () {
                    return [
                        {
                            "AppointmentVitalDataId": 0,
                            "VitalId": 11,
                            "VitalDesc": "Temperature",
                            "Value": "",
                            "UnitTypeId": 1,
                            "UnitTypeName": "°F",
                            "OrderType": 1
                        },
                        {
                            "AppointmentVitalDataId": 0,
                            "VitalId": 12,
                            "VitalDesc": "Pulse",
                            "Value": "",
                            "UnitTypeId": 3,
                            "UnitTypeName": "BPM",
                            "OrderType": 2
                        },
                        {
                            "AppointmentVitalDataId": 0,
                            "VitalId": 4,
                            "VitalDesc": "BP-Systolic",
                            "Value": "",
                            "UnitTypeId": 5,
                            "UnitTypeName": "mmHg",
                            "OrderType": 3
                        },
                        {
                            "AppointmentVitalDataId": 0,
                            "VitalId": 5,
                            "VitalDesc": "BP-Diastolic",
                            "Value": "",
                            "UnitTypeId": 5,
                            "UnitTypeName": "mmHg",
                            "OrderType": 4
                        },
                        {
                            "AppointmentVitalDataId": 0,
                            "VitalId": 14,
                            "VitalDesc": "Respiratory Rate",
                            "Value": "",
                            "UnitTypeId": 4,
                            "UnitTypeName": "BPM",
                            "OrderType": 5
                        },
                        {
                            "AppointmentVitalDataId": 0,
                            "VitalId": 15,
                            "VitalDesc": "SpO2",
                            "Value": "",
                            "UnitTypeId": 6,
                            "UnitTypeName": "%",
                            "OrderType": 6
                        },
                        {
                            "AppointmentVitalDataId": 0,
                            "VitalId": 8,
                            "VitalDesc": "Blood Glucose Level",
                            "Value": "",
                            "UnitTypeId": 11,
                            "UnitTypeName": "mg/dL",
                            "OrderType": 8
                        },
                        {
                            "AppointmentVitalDataId": 0,
                            "VitalId": 36,
                            "VitalDesc": "ECG",
                            "Value": "",
                            "UnitTypeId": 17,
                            "UnitTypeName": "BPM",
                            "OrderType": 9
                        },
                    ]

                }

                $scope.AnesthVitals = {
                    "isSystolic": false,
                    "isDiastolic": false,
                    "isPulse": false,
                    "isRespRate": false,
                    "isO2Saturation": false,
                    "isEKGLead": false,
                    "isETCO2": false,
                    "isAllVitals": false,
                    "OverallNurseAction": false
                }


                $scope.PostAnesthVitals = {
                    "isSystolic": false,
                    "isDiastolic": false,
                    "isPulse": false,
                    "isRespRate": false,
                    "isO2Saturation": false,
                    "isEKGLead": false,
                    "isETCO2": false,
                    "isAllVitals": false,
                    "OverallNurseAction": false
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
                    "ProcedureId": 2254,
                    "ProcedureName": 'Blood platelets',
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

                $scope.GetPreAdmAnesthetistQuickSummary = function () {
                    return {
                        "PreAdmissionApptDate": "",
                        "Vitals": [],
                        "SystemicHistory": [],
                        "AllergyItems": [],
                        "SurgicalHistory": [],
                        "LabArray": [],
                        "LabInvestigation": [],
                        "LabList": angular.copy($scope.GetLabInvestigations) || [],
                        "Airway": "",
                        "CardioVascular": "",
                        "HealthArray": [],
                        "RespiratoryHealthArray": [],
                        "PrevAnesthesia": "",
                        "AssessmentsASA": "",
                        "AnesthesiaPlan": "",
                        "PreAdmissionStatusId": null,
                        "PreAdmissionStatus": '',
                        "AnesthesiaPlan": "",
                        "LabObj": "",
                        "CardioVascularObj": {
                            "Systolic": "",
                            "Diastolic": "",
                            "PR": "",
                            "ECG": "",
                            "ECGUnits": "",
                            "Notes": ""
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
                            "ChemistryNotes": '',
                            "MouthOpening": "",
                            "TMDistance": "",
                            "UnableToAssess": false,
                            "Tracheostomy": false,
                        },
                        "MedicationsList": [],
                        "CurrentMedicationList": [],
                        "CurrentEyeMedications": [],
                        "InvestigationsList": [],
                        "IsRespiratoryNormal": false,
                        "RespiratoryNotes": "",
                        "CNSNotes": "",
                        "SocialNotes": "",
                        "SelectedCardiacIssues": "",
                        "SelectedPulmonaryIssues": "",
                        "PulmonaryNotes": "",
                        "SelectedHepaticIssues": "",
                        "HepaticNotes": "",
                        "SelectedEndocrineIssues": "",
                        "SelectedNeurologicIssues": "",
                        "SelectedHemeOncIssues": "",
                        "EndocrineNotes": "",
                        "NeurologicNotes": "",
                        "HemeOncNotes": "",
                        "SelectedNervousSystemIssues": "",
                        "NervousSystemNotes": "",
                        "SelectedMusculoSkeletalSystemIssues": "",
                        "MusculoSkeletalSystemNotes": "",
                        "SelectedKidneyDiseaseIssues": "",
                        "KidneyDiseaseNotes": "",
                        "SelectedAutoImmuneDisordersIssues": "",
                        "AutoImmuneDisordersNotes": "",
                        "SelectedPsychosisIssues": "",
                        "SelectedOthersIssues": "",
                        "SelectedHeentIssues": "",
                        "SelectedLungsIssues": "",
                        "OthersNotes": "",
                        "PsychosisNotes": "",
                        "HeentNotes": "",
                        "LungsNotes": "",
                        "IsCNSHistory": null,
                        "IsCardiovascularHistory": null,
                        "IsCardiacWNL": false,
                        "CardiacNotes": "",
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
                        "APAnesthesiaOptionsObj": {
                            "AnesPlanAnesthetistId": null,
                            "AnesthesiologistId": null,
                            "AnesthetistNotes": "",
                            "Dosage": "",
                            "ReviewedDate": "",
                            "AnesthetistName": "",
                            "AnesthesiologistName": "",
                            "IsRisksbenefitsAnesthesia": false,
                            "IsAnestheticplan": false,
                        },
                        "ASAObj": {
                            "Value": "",
                            "Notes": "",
                            "EValue": "",
                            "ENotes": "",
                            "IsEmergency": false,
                        },
                        "PrevAnestheticsObj": "",
                        "PreviousAnesthetics": [],
                        "ReviewedBy": null,
                        "ShowAdvanceHealthEdit": false,
                        "AscAppointmentId": null,
                        "AscAppointmentDate": "",
                        "FirstFollowupDate": "",
                        "FirstFollowupApptId": null,
                        "SecondFollowupDate": "",
                        "SecondFollowupApptId": null,
                        "ThirdFollowupDate": "",
                        "ThirdFollowupApptId": null,
                        "ROSOverAllRemarks": "",
                        "AnesthesiaTypelist": [],
                        "ReviewedDate": "",
                        "ReviewedTime": "",
                        "IsCXR": "",
                        "PrescriptionDetails": [],
                        "CurrentSystemicMedicationsHistory": [],
                        "LabNotes": '',
                        "LifestyleDetail": [],
                        "MedicineOrdersInstructions": '',
                        "ASAClassificationNotes": '',
                        "AnesthesiaTypelist": [],
                        "AnesthetistReviewedBy": null,
                        "AnesthetistReviewedName": '',
                        "AnesthesiologistReviewedBy": null,
                        "AnesthesiologistReviewedName": '',
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


                        "DocumentDetails": [],
                        "AllergyRemarks": "",
                        "SurgicalRemarks": "",
                        "CurrentSystemicRemarks": "",
                        "CurrentEyeRemarks": "",
                        "SystemicHistoryRemarks": "",
                        "LifestyleHistoryRemarks": "",
                        "AnesthetistOrderDetails": [],
                        "RespiratoryRemarks": "",
                        "IsAirwayData": true,
                        "PhysicalNeurologicNotes": '',
                        "PhysicalGeneralNotes": '',
                        "PhysicalCardiocNotes": '',
                        "PhysicalHepaticNotes": '',
                        "PhysicalPulmonaryNotes": '',
                        "PhysicalEvaluationArray": [],
                        "LastDialysisDate": null,
                        "Indicator": false,
                        "IsAnesthesiaType":false,
                    };
                };

                $scope.PreAdmAnesthetistQuickSummary = angular.copy($scope.GetPreAdmAnesthetistQuickSummary());
                $scope.GetAldreteDetails = function () {
                    return [
                        {
                            "PostOPAldreteDetailId": 0,
                            "AldreteVitalId": 1,
                            "AldreteVitalName": "Physical Activity",
                            "TotalValue": "",
                            "DeleteInd": "N",
                            "AldreteValues": []
                        },
                        {
                            "PostOPAldreteDetailId": 0,
                            "AldreteVitalId": 2,
                            "AldreteVitalName": "Respiration",
                            "TotalValue": "",
                            "DeleteInd": "N",
                            "AldreteValues": []
                        },
                        {
                            "PostOPAldreteDetailId": 0,
                            "AldreteVitalId": 3,
                            "AldreteVitalName": "Circulations",
                            "TotalValue": "",
                            "DeleteInd": "N",
                            "AldreteValues": []
                        },
                        {
                            "PostOPAldreteDetailId": 0,
                            "AldreteVitalId": 4,
                            "AldreteVitalName": "Consciousness",
                            "TotalValue": "",
                            "DeleteInd": "N",
                            "AldreteValues": []
                        },
                        {
                            "PostOPAldreteDetailId": 0,
                            "AldreteVitalId": 5,
                            "AldreteVitalName": "Spo2",
                            "TotalValue": "",
                            "DeleteInd": "N",
                            "AldreteValues": []
                        },
                        {
                            "PostOPAldreteDetailId": 0,
                            "AldreteVitalId": 6,
                            "AldreteVitalName": "Color",
                            "TotalValue": "",
                            "DeleteInd": "N",
                            "AldreteValues": []
                        }
                    ];
                };

                $scope.GetPostopAnesthetistVitals = function () {
                    return [
                        {
                            "PatientAnesthesiaVitalId": 0,
                            "PatientAnesthesiaPostOpDetailId": null,
                            "VitalId": 1,
                            "VitalName": "Systolic Pressure",
                            "VitalValues": [],
                            "DeleteInd": "N"
                        },
                        {
                            "PatientAnesthesiaVitalId": 0,
                            "PatientAnesthesiaPostOpDetailId": null,
                            "VitalId": 2,
                            "VitalName": "Diastolic Pressure",
                            "VitalValues": [],
                            "DeleteInd": "N"
                        },
                        {
                            "PatientAnesthesiaVitalId": 0,
                            "PatientAnesthesiaPostOpDetailId": null,
                            "VitalId": 3,
                            "VitalName": "Pulse",
                            "VitalValues": [],
                            "DeleteInd": "N"
                        },
                        {
                            "PatientAnesthesiaVitalId": 0,
                            "PatientAnesthesiaPostOpDetailId": null,
                            "VitalId": 4,
                            "VitalName": "Resp.Rate",
                            "VitalValues": [],
                            "DeleteInd": "N"
                        },
                   
                        {
                            "PatientAnesthesiaVitalId": 0,
                            "PatientAnesthesiaPostOpDetailId": null,
                            "VitalId": 6,
                            "VitalName": "O2 Saturation",
                            "VitalValues": [],
                            "DeleteInd": "N"
                        },
                     
                        {
                            "PatientAnesthesiaVitalId": 0,
                            "PatientAnesthesiaPostOpDetailId": null,
                            "VitalId": 9,
                            "VitalName": "Notes",
                            "VitalValues": [],
                            "DeleteInd": "N"
                        }

                    ];
                };
                $scope.PostopAnesthetistVitals = angular.copy($scope.GetPostopAnesthetistVitals());

                $scope.GetAnesthetistVitals = function () {
                    return [
                        {
                            "Id": 1,
                            "VitalName": "Systolic Pressure",
                            "VitalReadingList": [],
                        },
                        {
                            "Id": 2,
                            "VitalName": "Diastolic Pressure",
                            "VitalReadingList": [],
                        },
                        {
                            "Id": 3,
                            "VitalName": "Pulse",
                            "VitalReadingList": [],
                        },
                        {
                            "Id": 4,
                            "VitalName": "Resp.Rate",
                            "VitalReadingList": [],
                        },
                        //{
                        //    "Id": 5,
                        //    "VitalName": "Spo 2",
                        //    "VitalReadingList": [],
                        //},
                        {
                            "Id": 6,
                            "VitalName": "O2 Saturation",
                            "VitalReadingList": [],
                        },
                        {
                            "Id": 7,
                            "VitalName": "EKG Lead 2",
                            "VitalReadingList": [],
                        },
                        {
                            "Id": 8,
                            "VitalName": "ETCO2",
                            "VitalReadingList": [],
                        },
                        {
                            "Id": 9,
                            "VitalName": "Note",
                            "VitalReadingList": [],
                        }

                    ];
                };
                $scope.AnesthetistVitals = angular.copy($scope.GetAnesthetistVitals());
                $scope.GetFaceSheetSummaryObj = function () {
                    return {

                        "OrganizationId": $scope.HospitalId || 0,
                        "UserId": $scope.UserId,
                        "PatientId": $scope.cacheStorageItem.PatientID || 0,
                        "AppointmentId": $scope.FaceSheetAppointmentId,
                        "FaceSheetChartStatus": 'D',
                        "PatientData": [],
                        "SurgeryList": [],
                        "FaceSheetCheckList": [{
                            "OrganId": null,
                            "ReviewedBy": null,
                            "PatientFaceSheetId": 0,
                            "PreOpVerification": [],
                            "SurgeonVerification": [],

                        }],
                        "Anesthetist": "",
                        "SurgeonName": "",
                        "ExternalCoManagerName": "",
                        "InternalCoManagerName": "",
                        "Cardiologist": "",
                        "PreAdmissionStatus": '',
                        "CardiologyStatus": '',
                        "PreviousCDAValue": "",
                        "PreviousCDAValueGivenDate": null,
                        "SurgeonVerifiedUserId": null
                    };

                };

                $scope.FaceSheetSummaryObj = $scope.GetFaceSheetSummaryObj;
                $scope.GetLabObj = function () {
                    return {
                        "HGB": "",
                        "HCT": "",
                        "WBC": "",
                        "RBC": "",
                        "A1C": "",
                        "Creatinine": "",
                        "RBS": "",
                        "FBS": "",
                        "PBBS": "",
                        "PBLS": "",
                        "LabTestArray": [
                            {
                                "Name": "Prothrombin Time",
                                "IsNormalLimitsChecked": false,
                                "IsAbnormalChecked": false,
                                "Notes": ""
                            },
                            {
                                "Name": "Partial Thromboplastin time",
                                "IsNormalLimitsChecked": false,
                                "IsAbnormalChecked": false,
                                "Notes": ""
                            },
                            {
                                "Name": "Li-Fraumeni Syndrome",
                                "IsNormalLimitsChecked": false,
                                "IsAbnormalChecked": false,
                                "Notes": ""
                            },
                            {
                                "Name": "",
                                "IsNormalLimitsChecked": false,
                                "IsAbnormalChecked": false,
                                "Notes": ""
                            },
                        ],
                        "Notes": "",
                        "UrineAnalysis": "",
                        "IsBloodAvailable": "",
                        "IsPretransfusion": "",
                        "Others": ""
                    };
                };
                $scope.PreviousValuesObj = {
                    "PreviousODIOLPower": '',
                    "PreviousOSIOLPower": '',
                    "ODLensUsed": '',
                    "OSLensUsed": '',
                    "PupilSizeODValue": '',
                    "PupilSizeOSValue": '',
                    "VisualODValue": '',
                    "VisualOSValue": '',
                    "ODCylARValue": '',
                    "OSCylARValue": '',
                    "ODSphARValue": '',
                    "OSSphARValue": '',
                    "ODAixARValue": '',
                    "OSAixARValue": '',
                    "ODRefractionValue": '',
                    "OSRefractionValue": '',
                };
                $scope.mastercheckListData = {
                    "PreOp": [],
                    "SurgeryDate": "",
                    "OrganId": null,
                    "SurgeryOperations": [],
                    "ApptFaceSheetData": [],
                    "LastSignOffUserDetails": []
                }
                $scope.PreopNurseAnestiatab = 1;
                $scope.NurseanestiaTabchnage = function (value) {
                    $scope.PreopNurseAnestiatab = value;
                }

                $scope.PostopNurseAnestiatab = 1;
                $scope.PostopnurseTabchange = function (value) {
                    $scope.PostopNurseAnestiatab = value;
                }

                var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
                $scope.RoleId = userLoginDetails.RoleID;
                if ($scope.RoleId === 25 || $scope.RoleId === 30) {
                    $scope.IntropNurseAnestiatab = 2;
                }
                else {
                    $scope.IntropNurseAnestiatab = 1;
                }

                $scope.IntraopnurseTabchange = function (value) {
                    $scope.IntropNurseAnestiatab = value;
                }
            
                $scope.DoctorNotesClick = function () {
                    $scope.PreopNurseAnestiatab = 3;
                    $scope.GetFaceSheetDetails();
                    $scope.GetPentacomImageDetails();
                };


                $scope.GetMasterAldreteScoreDetails = function () {
                    eHnoteSurgeryService.GetMasterAldreteScoreDetails().then(function (resp) {

                        if (resp.data.status === "Success") {
                            angular.forEach(resp.data.rows, function (item) {
                                item.Value = null;
                                item.IsChecked = false;
                                angular.forEach(item.AldreteScoreDetailTypes, function (kitem) {
                                    kitem.IsChecked = false;
                                });
                            });
                            $scope.PreOpQuickSummaryObj.AlderetScoreDetails = angular.copy(resp.data.rows);
                        }

                    }, function (err) {
                        console.log(err);
                    });
                };
                //$scope.GetMasterAldreteScoreDetails();
                $scope.SelectedAppointmentTypeId = selectedApptObj.AppointmentTypeId || 0;
                $scope.SelectedAppointmentId = selectedApptObj.AppointmentID || 0;
                $scope.cacheStorageItem.PatientID = selectedApptObj.PatientID || 0;
                $scope.cacheStorageItem.AscAppointmentId = selectedApptObj.AscAppointmentId || 0;
                $scope.cacheStorageItem.CopiedPreviousAppointmentId = selectedApptObj.CopiedPreviousAppointmentId || 0;
                $scope.cacheStorageItem.PreAdmAppointmentId = selectedApptObj.PreAdmAppointmentId || 0;
                $scope.cacheStorageItem.AppointmentId = selectedApptObj.AppointmentID || 0;
                let Visitid = selectedApptObj.Visitid || 0;

                var surgeryList = selectedApptObj.SurgeryList || [];
                var lasikTab = false;

                if (surgeryList.length > 0 &&
                    (surgeryList[0].SurgeryCategoryId == 4 ||
                        surgeryList[0].SurgeryCategoryId == 3)) {
                    lasikTab = true;
                }
                let obj = {
                    "SubTab": lasikTab ? 16 : 3,
                    "AppointmentTypeId": $scope.SelectedAppointmentTypeId || 0,
                    "AppointmentId": $scope.SelectedAppointmentId || 0,
                    "AscAppointmentId": $scope.SelectedAppointmentId || 0,
                    "VisitId": selectedApptObj.Visitid || 0,
                    "IscomingFromInd": true,
                    "PatientID": selectedApptObj.PatientID || 0,
                    "SurgeryList": surgeryList || [],
                    "IsComingFrom": 'Audit',

                }

                datapersistanceFactory.set('ASCPastvisits', obj);
                $scope.showQuickSummary = true;

                $scope.selectedpatientobj = {
                    "HospitalId": selectedApptObj.HospitalId ||0,
                    "Visitid": selectedApptObj.Visitid||0,
                    "AppointmentID": selectedApptObj.AppointmentID ||0,
                    "PatientID": selectedApptObj.PatientID||0,
                }
                $scope.GetFaceSheetDetails = function () {
                    $scope.FaceSheetSummaryObj = $scope.GetFaceSheetSummaryObj;
                    $scope.cacheStorageItem.AscAppointmentId = $scope.cacheStorageItem.AscAppointmentId || 0;
                    let AppointmentId;

                    AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                    let req = {
                        "OrganizationId": $scope.HospitalId,
                        "AppointmentId": AppointmentId || 0,
                        "PatientId": $scope.cacheStorageItem.PatientID || 0,
                        "AppointmentTypeId": $scope.FaceSheetAppointmentTypeId,
                    };
                    eHnoteSurgeryService.GetAppointmentFaceSheetData(req).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $scope.FaceSheetSummaryObj.PatientData = resp.data.PatientData || [];
                            $scope.FaceSheetSummaryObj.CurrentAppointmentVital = resp.data.CurrentAppointmentVital || '';
                            $scope.FaceSheetSummaryObj.LatestAppointmentVital = resp.data.LatestAppointmentVital || '';
                            $scope.FaceSheetSummaryObj.LastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];


                            $scope.IntraOpCDE = resp.data.IntraOpCDE || [];
                            $scope.PreOpPupliSize = resp.data.PreOpPupliSize || [];
                            //$scope.AllergyItems = resp.data.AllergyItemsArray || [];
                            $scope.AllergyItems = [];
                            resp.data.AllergyItemsArray = resp.data.AllergyItemsArray || [];
                            if (resp.data.AllergyItemsArray.length > 0) {
                                angular.forEach(resp.data.AllergyItemsArray, function (item) {
                                    if (item.StatusId == 1 || item.AllergyId == 1 || item.AllergyId == 2) {
                                        $scope.AllergyItems.push(item);
                                    }
                                });
                            }

                            $scope.FaceSheetSummaryObj.ImplantsDetailsArray = resp.data.ImplantsDetailsArray || [];

                            var TempArray1 = $filter("filter")($scope.FaceSheetSummaryObj.ImplantsDetailsArray, function (kitem) { return kitem.AppointmentId == $scope.FaceSheetAppointmentId }, true);
                            var TempArray2 = $filter("filter")($scope.FaceSheetSummaryObj.ImplantsDetailsArray, function (kitem) { return kitem.AppointmentId !== $scope.FaceSheetAppointmentId }, true);

                            if (TempArray1.length > 0) {
                                angular.forEach(TempArray1, function (item) {
                                    if (item.OrganId == 1) {
                                        $scope.PreviousValuesObj.ODLensUsed = item.Power || '';
                                    } else if (item.OrganId == 2) {
                                        $scope.PreviousValuesObj.OSLensUsed = item.Power || '';
                                    }
                                });
                            }
                            if (TempArray2.length > 0) {
                                angular.forEach(TempArray2, function (sitem) {
                                    if (sitem.OrganId == 1) {
                                        $scope.PreviousValuesObj.PreviousODIOLPower = sitem.Power || '';
                                    } else if (sitem.OrganId == 2) {
                                        $scope.PreviousValuesObj.PreviousOSIOLPower = sitem.Power || '';
                                    }
                                });
                            }

                            resp.data.PreviousAppointmentFaceSheetData = resp.data.PreviousAppointmentFaceSheetData || [];
                            if (resp.data.PreviousAppointmentFaceSheetData.length > 0) {
                                angular.forEach(resp.data.PreviousAppointmentFaceSheetData, function (item) {
                                    if (item.FindingId == 4) {
                                        $scope.PreviousValuesObj.VisualODValue = item.ODSCValue || '';
                                        $scope.PreviousValuesObj.VisualOSValue = item.OSSCValue || '';
                                    }
                                    if (item.FindingId == 2134) {
                                        $scope.PreviousValuesObj.PupilSizeODValue = item.ODValue || '';
                                        $scope.PreviousValuesObj.PupilSizeOSValue = item.OSValue || '';
                                    }
                                    if (item.FindingId == 1) {
                                        $scope.PreviousValuesObj.ODSphARValue = item.ODSphValue || '';
                                        $scope.PreviousValuesObj.OSSphARValue = item.OSSphValue || '';
                                        $scope.PreviousValuesObj.ODCylARValue = item.ODCylValue || '';
                                        $scope.PreviousValuesObj.OSCylARValue = item.OSCylValue || '';
                                        $scope.PreviousValuesObj.ODAixARValue = item.ODAixValue || '';
                                        $scope.PreviousValuesObj.OSAixARValue = item.OSAixValue || '';
                                    }

                                    if ($scope.PreviousValuesObj.ODSphARValue !== '' || $scope.PreviousValuesObj.ODCylARValue !== '' || $scope.PreviousValuesObj.ODAixARValue !== '') {
                                        $scope.PreviousValuesObj.ODRefractionValue = $scope.PreviousValuesObj.ODSphARValue + '  /  ' + $scope.PreviousValuesObj.ODCylARValue + ' @ ' + $scope.PreviousValuesObj.ODAixARValue;
                                    }
                                    if ($scope.PreviousValuesObj.OSSphARValue !== '' || $scope.PreviousValuesObj.OSCylARValue !== '' || $scope.PreviousValuesObj.OSAixARValue !== '') {
                                        $scope.PreviousValuesObj.OSRefractionValue = $scope.PreviousValuesObj.OSSphARValue + '  /  ' + $scope.PreviousValuesObj.OSCylARValue + '  @  ' + $scope.PreviousValuesObj.OSAixARValue;
                                    }
                                });
                            };

                            if ($scope.FaceSheetSummaryObj.PatientData.length > 0) {
                                var mobilenumber = $scope.FaceSheetSummaryObj.PatientData[0].MobileNo || ''
                                if (mobilenumber != '') {
                                    var obj = eHnoteUserDataService.UsMobileFormatChange(mobilenumber);
                                    $scope.FaceSheetSummaryObj.PatientData[0].MobileNo = obj.UsFormatMobileNumber;
                                }
                                var PatientMonth = ''
                                if ($scope.FaceSheetSummaryObj.PatientData[0].AgeInMonths != 0) {
                                    var PatientMonth = $scope.FaceSheetSummaryObj.PatientData[0].AgeInMonths + 'M';
                                }
                                $scope.FaceSheetSummaryObj.PatientData[0].Age = $scope.FaceSheetSummaryObj.PatientData[0].Age + 'Y' + ' ' + PatientMonth || '';

                                $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Height = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Height || '';
                                $scope.FaceSheetSummaryObj.CurrentAppointmentVital.HeightUnit = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.HeightUnit || '';
                                $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Weight = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Weight || '';
                                $scope.FaceSheetSummaryObj.CurrentAppointmentVital.WeightUnit = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.WeightUnit || '';

                                if (($scope.cacheStorageItem.AppointmentId == $scope.FaceSheetSummaryObj.CurrentAppointmentVital.AppointmentId) && ($scope.FaceSheetSummaryObj.CurrentAppointmentVital.Height !== '' || $scope.FaceSheetSummaryObj.CurrentAppointmentVital.HeightUnit !== '' || $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Weight !== '' || $scope.FaceSheetSummaryObj.CurrentAppointmentVital.WeightUnit !== '')) {
                                    $scope.FaceSheetSummaryObj.PatientData[0].Height = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Height || '';
                                    $scope.FaceSheetSummaryObj.PatientData[0].HeightUnit = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.HeightUnit || '';
                                    $scope.FaceSheetSummaryObj.PatientData[0].Weight = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Weight || '';
                                    $scope.FaceSheetSummaryObj.PatientData[0].WeightUnit = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.WeightUnit || '';
                                } else {
                                    $scope.FaceSheetSummaryObj.PatientData[0].Height = $scope.FaceSheetSummaryObj.LatestAppointmentVital.Height || '';
                                    $scope.FaceSheetSummaryObj.PatientData[0].HeightUnit = $scope.FaceSheetSummaryObj.LatestAppointmentVital.HeightUnit || '';
                                    $scope.FaceSheetSummaryObj.PatientData[0].Weight = $scope.FaceSheetSummaryObj.LatestAppointmentVital.Weight || '';
                                    $scope.FaceSheetSummaryObj.PatientData[0].WeightUnit = $scope.FaceSheetSummaryObj.LatestAppointmentVital.WeightUnit || '';
                                }
                            }
                            if (resp.data.SurgeryList.length > 0) {
                                $scope.FaceSheetSummaryObj.SurgeryList = resp.data.SurgeryList || [];
                                $scope.SelectedOrganId = resp.data.SurgeryList.OrganId || null;
                                $scope.SurgeryDate = resp.data.SurgeryList[0].AscAppointmentDate || null;
                                if ($scope.FaceSheetSummaryObj.SurgeryList.length > 0) {
                                    $scope.FaceSheetSummaryObj.SurgeryList[0].CardiologyStatus = $scope.FaceSheetSummaryObj.SurgeryList[0].CardiologyStatus || ''
                                    $scope.FaceSheetSummaryObj.SurgeryList[0].PreAdmissionStatus = $scope.FaceSheetSummaryObj.SurgeryList[0].PreAdmissionStatus || ''
                                    if ($scope.FaceSheetSummaryObj.SurgeryList[0].CardiologyStatus != '') {
                                        $scope.FaceSheetSummaryObj.CardiologyStatus = $scope.FaceSheetSummaryObj.SurgeryList[0].CardiologyStatus || '';
                                    }
                                    if ($scope.FaceSheetSummaryObj.SurgeryList[0].PreAdmissionStatus != '') {
                                        $scope.FaceSheetSummaryObj.PreAdmissionStatus = $scope.FaceSheetSummaryObj.SurgeryList[0].PreAdmissionStatus || '';
                                    }
                                    $scope.FaceSheetSummaryObj.SurgeryList[0].InternalCoManagerId = $scope.FaceSheetSummaryObj.SurgeryList[0].InternalCoManagerId || 0;
                                    $scope.FaceSheetSummaryObj.SurgeryList[0].ExternalCoManagerId = $scope.FaceSheetSummaryObj.SurgeryList[0].ExternalCoManagerId || 0
                                    if ($scope.FaceSheetSummaryObj.SurgeryList[0].InternalCoManagerId != 0) {
                                        let Internallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.FaceSheetSummaryObj.SurgeryList[0].InternalCoManagerId }, true);
                                        if (Internallist.length > 0) {
                                            $scope.FaceSheetSummaryObj.InternalCoManagerName = Internallist[0].FullName || '';
                                            Internallist[0].SuffixName = Internallist[0].SuffixName || '';
                                            if (Internallist[0].SuffixName !== '') {
                                                $scope.FaceSheetSummaryObj.InternalCoManagerName = $scope.FaceSheetSummaryObj.InternalCoManagerName + ' ' + Internallist[0].SuffixName;
                                            }
                                            /*$scope.SurgeryDiagnosisObj.InternalCoManagerName = Internallist[0].FullName;*/
                                        } else {
                                            $scope.FaceSheetSummaryObj.InternalCoManagerName = '';
                                        }
                                    }
                                    if ($scope.FaceSheetSummaryObj.SurgeryList[0].ExternalCoManagerId != 0) {
                                        let Internallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.FaceSheetSummaryObj.SurgeryList[0].ExternalCoManagerId }, true);
                                        if (Internallist.length > 0) {
                                            $scope.FaceSheetSummaryObj.ExternalCoManagerName = Internallist[0].FullName || '';
                                            /*$scope.SurgeryDiagnosisObj.InternalCoManagerName = Internallist[0].FullName;*/
                                        } else {
                                            $scope.FaceSheetSummaryObj.ExternalCoManagerName = $scope.FaceSheetSummaryObj.SurgeryList[0].ExternalCoManagerName || '';
                                        }
                                    }
                                    $scope.FaceSheetSummaryObj.SurgeryList[0].SurgeonId = $scope.FaceSheetSummaryObj.SurgeryList[0].SurgeonId || 0;
                                    if ($scope.FaceSheetSummaryObj.SurgeryList[0].SurgeonId != 0) {
                                        let Internallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.FaceSheetSummaryObj.SurgeryList[0].SurgeonId }, true);
                                        if (Internallist.length > 0) {
                                            $scope.FaceSheetSummaryObj.SurgeonName = Internallist[0].UserFullName || '';
                                            //if (Internallist[0].SuffixId == 10) {
                                            //    $scope.FaceSheetSummaryObj.SurgeonName = ' Dr. ' + $scope.FaceSheetSummaryObj.SurgeonName;
                                            //}
                                            //if (Internallist[0].SuffixName !== '') {
                                            //    $scope.FaceSheetSummaryObj.SurgeonName = $scope.FaceSheetSummaryObj.SurgeonName + ' ' + Internallist[0].SuffixName;
                                            //}
                                            /*$scope.SurgeryDiagnosisObj.InternalCoManagerName = Internallist[0].FullName;*/
                                        } else {
                                            $scope.FaceSheetSummaryObj.SurgeonName = '';
                                        }
                                    }
                                    $scope.FaceSheetSummaryObj.SurgeryList[0].AnesthetistId = $scope.FaceSheetSummaryObj.SurgeryList[0].AnesthetistId || 0;
                                    if ($scope.FaceSheetSummaryObj.SurgeryList[0].AnesthetistId != 0) {
                                        let Internallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.FaceSheetSummaryObj.SurgeryList[0].AnesthetistId }, true);
                                        if (Internallist.length > 0) {
                                            $scope.FaceSheetSummaryObj.Anesthetist = Internallist[0].FullName || '';
                                            /*$scope.SurgeryDiagnosisObj.InternalCoManagerName = Internallist[0].FullName;*/
                                        } else {
                                            $scope.FaceSheetSummaryObj.Anesthetist = '';
                                        }
                                    }
                                }
                            }
                            if (resp.data.AppointmentFaceSheetData.length > 0) {
                                $scope.mastercheckListData.ApptFaceSheetData = resp.data.AppointmentFaceSheetData || [];
                                $scope.mastercheckListData.LastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
                                $scope.FaceSheetSummaryObj.SurgeonVerifiedUserId = resp.data.AppointmentFaceSheetData[0].SurgeonVerifiedUserId || null;

                         

                                if (resp.data.LatestAppointmentCDE.length > 0) {
                                 


                                    $scope.FaceSheetSummaryObj.PreviousCDAODValue = resp.data.LatestAppointmentCDE[0].ODValue || "";
                                    $scope.FaceSheetSummaryObj.PreviousCDAOSValue = resp.data.LatestAppointmentCDE[0].OSValue || "";
                                    $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate = resp.data.LatestAppointmentCDE[0].ModifiedDt || null;

                                    if ($scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate != '' && $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate != null) {
                                        /*  $scope.FaceSheetObj.PreviousCDAValueGivenDate = $filter('date')($scope.FaceSheetObj.PreviousCDAValueGivenDate, "MM-dd-yyyy");*/
                                        $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate = moment($scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate).format("MM-DD-YYYY");

                                    }
                                }

                          
                                $scope.FaceSheetSummaryObj.FaceSheetCheckList = [];
                                angular.forEach(resp.data.AppointmentFaceSheetData, function (item) {
                                    item.SurgeryDate = $scope.SurgeryDate || null;
                                    item.PreOpVerification = item.PreOpVerification || [];
                                    item.SurgeonVerification = item.SurgeonVerification || [];
                                    item.EditSurgeonVerification = angular.copy($scope.TempSurgeonCheckList) || [];
                                    item.EditPreOpVerification = angular.copy($scope.TempFaceSheetCheckList) || [];
                                    if (item.PreOpVerification.length > 0) {
                                        angular.forEach(item.EditPreOpVerification, function (Aitem) {
                                            var temparray = $filter("filter")(item.PreOpVerification, function (kitem, index) { return kitem.FaceSheetId == Aitem.FaceSheetId });
                                            if (temparray.length > 0) {
                                                Aitem.FaceSheetVerificationId = temparray[0].FaceSheetVerificationId;
                                                Aitem.Value = temparray[0].Value;
                                                Aitem.Remarks = temparray[0].Remarks || '';
                                                Aitem.VerifiedUserId = temparray[0].VerifiedUserId || null;
                                                Aitem.IsShowNotes = false;
                                                if (Aitem.Remarks != '') {
                                                    Aitem.IsShowNotes = true;
                                                }
                                            }
                                        });
                                    }
                                    if (item.SurgeonVerification.length > 0) {
                                        angular.forEach(item.EditSurgeonVerification, function (Aitem) {
                                            let temparray1 = $filter("filter")(item.SurgeonVerification, function (kitem, index) { return kitem.MasterFaceSheetId == Aitem.MasterFaceSheetId });
                                            if (temparray1.length > 0) {
                                                Aitem.DeleteInd = temparray1[0].DeleteInd || 'N';
                                                Aitem.FaceSheetVerificationId = temparray1[0].FaceSheetVerificationId;
                                                Aitem.IsChecked = temparray1[0].IsChecked || false;
                                                Aitem.TonometryId = temparray1[0].TonometryId || null;
                                                Aitem.MasterFaceSheetId = temparray1[0].MasterFaceSheetId;
                                                Aitem.MasterFaceSheetName = temparray1[0].MasterFaceSheetName || '';
                                                Aitem.ODAixValue = temparray1[0].ODAixValue || '';
                                                Aitem.ODAvgKvalues = temparray1[0].ODAvgKvalues || '';
                                                Aitem.ODAxialLength = temparray1[0].ODAxialLength || '';
                                                Aitem.ODCylValue = temparray1[0].ODCylValue || '';
                                                Aitem.ODFormulaId = temparray1[0].ODFormulaId || null;
                                                Aitem.ODFormula = temparray1[0].ODFormula || '';
                                                Aitem.ODIOLManufacturer = temparray1[0].ODIOLManufacturer || '';
                                                Aitem.ODIOLModel = temparray1[0].ODIOLModel || '';
                                                Aitem.ODIOLpower = temparray1[0].ODIOLpower || '';
                                                Aitem.ODK1AxisValue = temparray1[0].ODK1AxisValue || '';
                                                Aitem.ODK1Value = temparray1[0].ODK1Value || '';
                                                Aitem.ODK2AxisValue = temparray1[0].ODK2AxisValue || '';
                                                Aitem.ODK2Value = temparray1[0].ODK2Value || '';
                                                Aitem.ODOpticalACD = temparray1[0].ODOpticalACD || '';
                                                Aitem.ODRemarks = temparray1[0].ODRemarks || '';
                                                Aitem.ODSCValue = temparray1[0].ODSCValue || '';
                                                Aitem.ODSphValue = temparray1[0].ODSphValue || '';
                                                Aitem.ODTargetRefraction = temparray1[0].ODTargetRefraction || '';
                                                Aitem.ODValue = temparray1[0].ODValue || '';
                                                Aitem.ODWhitetoWhite = temparray1[0].ODWhitetoWhite || '';
                                                Aitem.OSAixValue = temparray1[0].OSAixValue || '';
                                                Aitem.OSAvgKvalues = temparray1[0].OSAvgKvalues || '';
                                                Aitem.OSAxialLength = temparray1[0].OSAxialLength || '';
                                                Aitem.OSCylValue = temparray1[0].OSCylValue || '';
                                                Aitem.OSFormulaId = temparray1[0].OSFormulaId || null;
                                                Aitem.OSFormula = temparray1[0].OSFormula || '';
                                                Aitem.OSIOLManufacturer = temparray1[0].OSIOLManufacturer || '';
                                                Aitem.OSIOLModel = temparray1[0].OSIOLModel || '';
                                                Aitem.OSIOLpower = temparray1[0].OSIOLpower || '';
                                                Aitem.OSK1AxisValue = temparray1[0].OSK1AxisValue || '';
                                                Aitem.OSK1Value = temparray1[0].OSK1Value || '';
                                                Aitem.OSK2AxisValue = temparray1[0].OSK2AxisValue || '';
                                                Aitem.OSK2Value = temparray1[0].OSK2Value || '';
                                                Aitem.OSOpticalACD = temparray1[0].OSOpticalACD || '';
                                                Aitem.OSRemarks = temparray1[0].OSRemarks || '';
                                                Aitem.OSSCValue = temparray1[0].OSSCValue || '';
                                                Aitem.OSSphValue = temparray1[0].OSSphValue || '';
                                                Aitem.OSTargetRefraction = temparray1[0].OSTargetRefraction || '';
                                                Aitem.OSValue = temparray1[0].OSValue || '';
                                                Aitem.OSWhitetoWhite = temparray1[0].OSWhitetoWhite || '';
                                                Aitem.PupilOPValue = temparray1[0].PupilOPValue || '';
                                                Aitem.PupilPREValue = temparray1[0].PupilPREValue || '';
                                                Aitem.Remarks = temparray1[0].Remarks || '';
                                                Aitem.TypeValue = temparray1[0].TypeValue || '';
                                                Aitem.Value = temparray1[0].Value || '';
                                                Aitem.VerifiedUserId = temparray1[0].VerifiedUserId || '';
                                                Aitem.VerifiedUserName = temparray1[0].VerifiedUserName || '';
                                                Aitem.VisionPHValue = temparray1[0].VisionPHValue || '';
                                                Aitem.IsTopcon = temparray1[0].IsTopcon || false;
                                                Aitem.GivenbyId = temparray1[0].GivenbyId || null;
                                                Aitem.Givenby = temparray1[0].Givenby || '';
                                                Aitem.ODIOLPrevious = temparray1[0].ODIOLPrevious || '';
                                                Aitem.OSIOLPrevious = temparray1[0].OSIOLPrevious || '';
                                                Aitem.ODIOLTypeId = temparray1[0].ODIOLTypeId || null;
                                                Aitem.ODIOLType = temparray1[0].ODIOLType || '';
                                                Aitem.OSIOLTypeId = temparray1[0].OSIOLTypeId || null;
                                                Aitem.OSIOLType = temparray1[0].OSIOLType || '';
                                                Aitem.ODLasikTypeId = temparray1[0].ODLasikTypeId || null;
                                                Aitem.ODLasikType = temparray1[0].ODLasikType || '';
                                                Aitem.OSLasikTypeId = temparray1[0].OSLasikTypeId || null;
                                                Aitem.OSLasikType = temparray1[0].OSLasikType || '';

                                                Aitem.IsShowNotes = false;
                                                if (Aitem.Remarks != '' || Aitem.ODRemarks != '' || Aitem.OSRemarks != '') {
                                                    Aitem.IsShowNotes = true;
                                                }

                                                if (Aitem.ODIOLTypeId == 16 || Aitem.ODIOLTypeId == 17) {
                                                    $scope.IsODLasikType = true;
                                                };
                                                if (Aitem.OSIOLTypeId == 16 || Aitem.OSIOLTypeId == 17) {
                                                    $scope.IsOSLasikType = true;
                                                };
                                            }
                                        });
                                    }

                                    var obj = {
                                        "OrganId": item.OrganId,
                                        "ReviewedBy": item.ReviewedBy,
                                        "PatientFaceSheetId": item.PatientFaceSheetId,
                                        "PreOpVerification": item.EditPreOpVerification || [],
                                        "SurgeonVerification": item.EditSurgeonVerification || [],
                                        "SurgeryDate": $scope.SurgeryDate || null,
                                    }
                                    $scope.FaceSheetSummaryObj.FaceSheetCheckList.push(obj);
                                });
                            }


                            if ($scope.IntraOpCDE.length > 0) {
                                $scope.FaceSheetSummaryObj.FaceSheetCheckList = $scope.FaceSheetSummaryObj.FaceSheetCheckList || '';
                                if ($scope.FaceSheetSummaryObj.FaceSheetCheckList.length > 0) {
                                    angular.forEach($scope.FaceSheetSummaryObj.FaceSheetCheckList, function (item) {
                                        if (item.SurgeonVerification.length > 0) {
                                            angular.forEach(item.SurgeonVerification, function (sitem) {
                                                if (sitem.MasterFaceSheetId == 6) {
                                                    var temparray1 = $filter("filter")(item.SurgeonVerification, function (kitem, index) { return (kitem.MasterFaceSheetId == 6) && (kitem.Value != '' || kitem.VerifiedUserId != null) }) || [];

                                                    if (temparray1.length == 0) {


                                                        if (item.OrganId == 1) {
                                                            sitem.Value = $scope.IntraOpCDE[0].CDEOD || '';
                                                        } else {
                                                            sitem.Value = $scope.IntraOpCDE[0].CDEOS || '';
                                                        }
                                                        sitem.Remarks = $scope.IntraOpCDE[0].CDERemarks || '';


                                                        sitem.IsShowNotes = false;
                                                        if (sitem.Remarks != '') {
                                                            sitem.IsShowNotes = true;
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            if ($scope.PreOpPupliSize.length > 0) {
                                $scope.FaceSheetSummaryObj.FaceSheetCheckList = $scope.FaceSheetSummaryObj.FaceSheetCheckList || '';
                                if ($scope.FaceSheetSummaryObj.FaceSheetCheckList.length > 0) {
                                    angular.forEach($scope.FaceSheetSummaryObj.FaceSheetCheckList, function (item) {
                                        if (item.SurgeonVerification.length > 0) {
                                            angular.forEach(item.SurgeonVerification, function (sitem) {
                                                if (sitem.MasterFaceSheetId == 2) {
                                                    var temparray1 = $filter("filter")(item.SurgeonVerification, function (kitem, index) { return (kitem.MasterFaceSheetId == 2) && (kitem.ODValue != '' || kitem.OSValue != '') }) || [];
                                                    if (temparray1.length == 0) {
                                                        sitem.ODValue = $scope.PreOpPupliSize[0].ODPupilSize || '';
                                                        sitem.OSValue = $scope.PreOpPupliSize[0].OSPupilSize || '';
                                                        sitem.VerifiedUserId = $scope.PreOpPupliSize[0].DilationReviewId || null;
                                                        sitem.Remarks = $scope.PreOpPupliSize[0].DilationMedicationsNotes || '';

                                                        sitem.IsShowNotes = false;
                                                        if (sitem.Remarks != '') {
                                                            sitem.IsShowNotes = true;
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }

                        }
                    });
                }

                $scope.GetPentacomImageDetails = function () {

                    //$scope.cacheStorageItem.AscAppointmentId = $scope.cacheStorageItem.AscAppointmentId || 0;
                    let AppointmentId = $scope.cacheStorageItem.AscAppointmentId || 0;


                    AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                    var pentacamgetReq = {
                        "PatientId": $scope.cacheStorageItem.PatientID,
                        "AppointmentId": AppointmentId,
                    //    "InvestigationId": 1155
                    }
                    eHnoteSurgeryService.getPatientApptPentacamfiles(pentacamgetReq).then(function (resp) {
                        if (resp.data.Status == "Success") {

                            $scope.pentaCamFilesArray = [];
                            if (resp.data.rows.length > 0) {
                                $scope.pentaCamFilesArray = resp.data.rows || [];
                            }
                            $scope.pentaCamReportImages = [];
                            if (resp.data.PentaCamReportDocuments.length > 0) {

                                angular.forEach(resp.data.PentaCamReportDocuments, function (pitem) {
                                    var obj = {
                                        "DocumentId": pitem.FileId,
                                        "DocumentExt": pitem.FileExt,
                                        "FileExt": pitem.FileExt,
                                        "DocumentName": pitem.FileName,
                                        "FileName": pitem.FileName,
                                        "S3URL": pitem.S3URL,
                                        "OrganId": pitem.OrganId,
                                        "DeleteInd": "N",
                                        "FileTypeId": 36,
                                        "DisplayName": pitem.FileName || "",
                                    }
                                    $scope.pentaCamReportImages.push(obj);
                                });

                            }
                            $scope.cacheStorageItem.CopiedPreviousAppointmentId = $scope.cacheStorageItem.CopiedPreviousAppointmentId || 0;
                            $scope.cacheStorageItem.PreAdmAppointmentId = $scope.cacheStorageItem.PreAdmAppointmentId || 0;

                            if ($scope.cacheStorageItem.CopiedPreviousAppointmentId !== 0) {
                                $scope.GetAppointmentImages($scope.cacheStorageItem.CopiedPreviousAppointmentId);
                            };
                            if ($scope.cacheStorageItem.PreAdmAppointmentId !== 0) {
                                $scope.GetAppointmentImages($scope.cacheStorageItem.PreAdmAppointmentId);
                            };

                        }
                    });
                }
                $scope.GetPreOpChartData = function () {


                    let appointmentId = null;
                    if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
                        appointmentId = $scope.SelectedAppointmentId;
                    }

                    if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
                        appointmentId = $scope.cacheStorageItem.AscAppointmentId;
                    }

                    let req1 = {
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "CheckListModuleId": 1
                    };

                    let req = {
                        "OrganizationId": $scope.HospitalId,
                        "AppointmentId": appointmentId || null,
                        "PatientId": $scope.cacheStorageItem.PatientID || null
                    };

                    $q.all([
                        eHnoteSurgeryService.GetOrganizationASCCheckListData(req1),
                        eHnoteSurgeryService.GetPreOpChartData(req),
                        eHnoteSurgeryService.GetMasterAldreteScoreDetails(),
                    ]).then(function (resp) {

                        let OrgASCChecklists = angular.copy(resp[0].data.rows);
                        if (resp[2].data.status === "Success") {
                            angular.forEach(resp[0].data.rows, function (item) {
                                item.Value = null;
                                item.IsChecked = false;
                                angular.forEach(item.AldreteScoreDetailTypes, function (kitem) {
                                    kitem.IsChecked = false;
                                });
                            });
                            $scope.PreOpQuickSummaryObj.AlderetScoreDetails = angular.copy(resp[2].data.rows);
                        }
                        if (resp[0].data.status === "Success") {
                            $scope.IVSiteMarkingList = resp[0].data.IVSiteMarkingList || [];
                            $scope.PreOpQuickSummaryObj.OrgASCChecklist = angular.copy(resp[0].data.rows);
                            $scope.PreOpQuickSummaryObj.NursingCarePlanData = angular.copy(resp[0].data.rows);
                            angular.forEach($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (item) {
                                angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                                    kitem.IsChecked = false;
                                });
                            });

                            $scope.IVSiteMarkingList = resp[0].data.IVSiteMarkingList || [];

                            if (!$scope.ParentObj.IsIOJParentOrganization) {
                                $scope.PreOpQuickSummaryObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 7 }, true) || [];
                            } else {
                                $scope.PreOpQuickSummaryObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 2 }, true) || [];
                            };

                            if ($scope.PreOpQuickSummaryObj.IVBlockedArray.length > 0) {
                                angular.forEach($scope.PreOpQuickSummaryObj.IVBlockedArray, function (item) {
                                    item.IsSelected = false;
                                    item.DeleteInd = 'N';
                                })
                            }
                            //$scope.PreOpQuickSummaryObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 2 }, true);
                            if (!$scope.ParentObj.IsIOJParentOrganization) {
                                $scope.PreOpQuickSummaryObj.IVSiteFluidsArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 6 }, true);
                                $scope.PreOpQuickSummaryObj.IVSiteFlushArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 4 }, true);
                                $scope.PreOpQuickSummaryObj.IVSiteLRArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 5 }, true);
                            };

                        }

                        if (resp[1].data.Status === "Success") {
                            $scope.PreOpQuickSummaryObj.AllergyItems = resp[1].data.AllergyItems || [];
                            $scope.PreOpQuickSummaryObj.SurgicalHistory = resp[1].data.SurgicalHistory || [];
                            $scope.PreOpQuickSummaryObj.SystemicHistory = resp[1].data.SystemicHistory || [];
                            $scope.PreOpQuickSummaryObj.SurgeryList = resp[1].data.SurgeryList || [];
                            $scope.PreOpQuickSummaryObj.CurrentEyeMedications = angular.copy(resp[1].data.CurrentEyeMedicationList);
                            $scope.PreOpQuickSummaryObj.CurrentSystemicMedicationsHistory = angular.copy(resp[1].data.CurrentSystemicMedicationList);
                            $scope.PreOpQuickSummaryObj.LifestyleHistory = angular.copy(resp[1].data.LifestyleHistory) || [];
                            $scope.PreOpQuickSummaryObj.LastSignOffUserDetails = angular.copy(resp[1].data.LastSignOffUserDetails) || [];
                            $scope.ReviewedByLicenseNo = "";
                            $scope.ReviewedBySuffixName = "";

                            resp[1].data.CurrentAppointmentVital = resp[1].data.CurrentAppointmentVital || '';
                            resp[1].data.LatestAppointmentVital = resp[1].data.LatestAppointmentVital || '';

                            resp[1].data.CurrentAppointmentVital.Height = resp[1].data.CurrentAppointmentVital.Height || '';
                            resp[1].data.CurrentAppointmentVital.HeightUnit = resp[1].data.CurrentAppointmentVital.HeightUnit || '';
                            resp[1].data.CurrentAppointmentVital.Weight = resp[1].data.CurrentAppointmentVital.Weight || '';
                            resp[1].data.CurrentAppointmentVital.WeightUnit = resp[1].data.CurrentAppointmentVital.WeightUnit || '';
                            resp[1].data.CurrentAppointmentVital.BMI = resp[1].data.CurrentAppointmentVital.BMI || '';

                            resp[1].data.LatestAppointmentVital.Height = resp[1].data.LatestAppointmentVital.Height || '';
                            resp[1].data.LatestAppointmentVital.HeightUnit = resp[1].data.LatestAppointmentVital.HeightUnit || '';
                            resp[1].data.LatestAppointmentVital.Weight = resp[1].data.LatestAppointmentVital.Weight || '';
                            resp[1].data.LatestAppointmentVital.WeightUnit = resp[1].data.LatestAppointmentVital.WeightUnit || '';
                            resp[1].data.LatestAppointmentVital.BMI = resp[1].data.LatestAppointmentVital.BMI || '';

                            if (resp[1].data.CurrentAppointmentVital.Height != "" || resp[1].data.CurrentAppointmentVital.Weight !== '' || resp[1].data.CurrentAppointmentVital.BMI !== '') {
                                $scope.PreOpQuickSummaryObj.Height = resp[1].data.CurrentAppointmentVital.Height || '';
                                $scope.PreOpQuickSummaryObj.HeightUnit = resp[1].data.CurrentAppointmentVital.HeightUnit || '';
                                $scope.PreOpQuickSummaryObj.Weight = resp[1].data.CurrentAppointmentVital.Weight || '';
                                $scope.PreOpQuickSummaryObj.WeightUnit = resp[1].data.CurrentAppointmentVital.WeightUnit || '';
                                $scope.PreOpQuickSummaryObj.BMI = resp[1].data.CurrentAppointmentVital.BMI || '';
                            } else {
                                $scope.PreOpQuickSummaryObj.Height = resp[1].data.LatestAppointmentVital.Height || '';
                                $scope.PreOpQuickSummaryObj.HeightUnit = resp[1].data.LatestAppointmentVital.HeightUnit || '';
                                $scope.PreOpQuickSummaryObj.Weight = resp[1].data.LatestAppointmentVital.Weight || '';
                                $scope.PreOpQuickSummaryObj.WeightUnit = resp[1].data.LatestAppointmentVital.WeightUnit || '';
                                $scope.PreOpQuickSummaryObj.BMI = resp[1].data.LatestAppointmentVital.BMI || '';
                            }

                            $scope.PatientChekListArray = [];
                            if (resp[1].data.rows.length > 0) {
                                var preopdata = resp[1].data.rows[0];
                                if (preopdata.VitalsArray.length > 0) {
                                    angular.forEach(preopdata.VitalsArray, function (item) {
                                        var vitalslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
                                        if (vitalslist.length > 0) {
                                            item.UserName = angular.copy(vitalslist[0].FullName);
                                        }
                                        let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                                        let edate = ndate + " " + item.VitalAddTime;

                                        item.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                                    });
                                }

                                if (resp[1].data.rows[0].OrgASCChecklist.length > 0) {
                                    angular.forEach(resp[1].data.rows[0].OrgASCChecklist, function (item) {
                                        angular.forEach($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (kitem) {
                                            /*if (item.CheckListCategoryId == 11) {*/
                                            if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                                if (kitem.CheckListId === item.CheckListId) {
                                                    kitem.IsChecked = true;
                                                    kitem.Score = item.Score || 0;
                                                    kitem.Value = item.Value || '';
                                                    kitem.Remarks = item.Remarks || '';
                                                    kitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";
                                                    kitem.ChecklistTime = item.ChecklistTime || "";
                                                    kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                                    //if (item.SubCheckList.length > 0) {
                                                    //    angular.forEach(item.SubCheckList, function (jitem) {
                                                    //        angular.forEach(kitem.SubCheckList, function (hitem) {
                                                    //            if (hitem.SubCheckListId == jitem.SubCheckListId) {
                                                    //                hitem.IsChecked = true;
                                                    //                kitem.IsChecked = true;
                                                    //                hitem.PatientAscSubCheckListId = jitem.PatientAscSubCheckListId || null;
                                                    //            }
                                                    //        });
                                                    //    });
                                                    //}

                                                    angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                                                        if (hitem.Value == item.Value && hitem.CheckListId === item.CheckListId) {
                                                            kitem.IsChecked = true;
                                                            hitem.IsChecked = true;
                                                            hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                                                            hitem.Value = item.Value || '';
                                                        }
                                                    });

                                                    if (kitem.CheckListId == 212 || kitem.CheckListId == 170 || kitem.CheckListId == 171) {
                                                        if (item.AscMultiCheckValueArray.length > 0) {
                                                            angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                                angular.forEach(kitem.OrganizationCheckListDetails, function (Litem) {
                                                                    if (Litem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                                        Litem.IsChecked = true;
                                                                        Litem.PatientMultiCheckListId = jitem.PatientMultiCheckListId || null;
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    }
                                                }
                                                /* }*/
                                            }
                                        });
                                    });
                                }

                                //if ($scope.PreAdmissionDetails.OrgAscChecklistDetails.length > 0) {
                                //    angular.forEach($scope.PreAdmissionDetails.OrgAscChecklistDetails, function (item) {
                                //        angular.forEach($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (kitem) {
                                //            if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                //                if (kitem.CheckListId === item.CheckListId) {
                                //                    kitem.IsChecked = true;
                                //                    kitem.Score = item.Score || 0;
                                //                    kitem.Value = item.Value || '';
                                //                    kitem.Remarks = item.Remarks || '';
                                //                    kitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";
                                //                    kitem.ChecklistTime = item.ChecklistTime || "";

                                //                    kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                //                    if (item.SubCheckList.length > 0) {
                                //                        angular.forEach(item.SubCheckList, function (jitem) {
                                //                            angular.forEach(kitem.SubCheckList, function (hitem) {
                                //                                if (hitem.SubCheckListId == jitem.SubCheckListId) {
                                //                                    hitem.IsChecked = true;
                                //                                    hitem.PatientAscSubCheckListId = jitem.PatientAscSubCheckListId || null;
                                //                                }
                                //                            });
                                //                        });
                                //                    }
                                //                }
                                //            }
                                //        });
                                //    });

                                //    $scope.PreOpQuickSummaryObj.AllOrgAscChecklistData = $filter("filter")($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (kitem) { return kitem.CheckListCategoryId == 7 }, true);

                                //}
                                var TempChecklistArray = [];
                                if (resp[1].data.rows[0].OrgASCChecklist.length > 0) {
                                    var TempArray = $filter("filter")(resp[1].data.rows[0].OrgASCChecklist, function (kitem) { return kitem.CheckListCategoryId == 11 });
                                    if (TempArray.length > 0) {
                                        TempChecklistArray = TempArray || [];
                                    }
                                }

                                $scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore = 0;
                                if ($scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore == 0 && TempChecklistArray.length > 0) {
                                    angular.forEach(TempChecklistArray, function (item) {
                                        item.Score = item.Score || 0;
                                        if ($scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore == 0) {
                                            $scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore = item.Score;
                                        } else {
                                            $scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore = $scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore + item.Score;
                                        }
                                    });
                                }

                                //$scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore = resp[1].data.rows[0].FallRiskAssessmentTotalScore || '';
                                $scope.PreOpQuickSummaryObj.FallriskBraceletprovided = resp[1].data.rows[0].FallriskBraceletprovided || '';
                                $scope.PreOpQuickSummaryObj.AssistiveWalkingDevice = resp[1].data.rows[0].AssistiveWalkingDevice || '';
                                $scope.PreOpQuickSummaryObj.ImplementedFallRiskProtocol = resp[1].data.rows[0].ImplementedFallRiskProtocol || false;
                                $scope.PreOpQuickSummaryObj.ImplementedFallRiskProtocoltype = resp[1].data.rows[0].ImplementedFallRiskProtocoltype || '';

                                $scope.PreOpQuickSummaryObj.FallRiskLevel = resp[1].data.rows[0].FallRiskLevel || '';

                                if ($scope.PreOpQuickSummaryObj.FallRiskLevel == '' && $scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore !== 0) {

                                    if ($scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore <= 24) {
                                        $scope.PreOpQuickSummaryObj.FallRiskLevel = 'low Risk';
                                        $scope.PreOpQuickSummaryObj.ImplementedFallRiskProtocoltype = 'Good basic nursing care taken';
                                    } else if ($scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore >= 25 && $scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore <= 44) {
                                        $scope.PreOpQuickSummaryObj.FallRiskLevel = 'Moderate Risk';
                                        $scope.PreOpQuickSummaryObj.ImplementedFallRiskProtocoltype = 'Implemented standard fall prevention interventions';
                                    } else if ($scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore >= 45) {
                                        $scope.PreOpQuickSummaryObj.FallRiskLevel = 'High Risk';
                                        $scope.PreOpQuickSummaryObj.ImplementedFallRiskProtocoltype = 'Implemeted high risk fall prevention interventions';
                                    }
                                }

                                $scope.PreOpQuickSummaryObj.PreOpAccompainedBy = resp[1].data.rows[0].PreOpAccompainedBy || '';
                                $scope.PreOpQuickSummaryObj.PreOpAccompainedByNotes = resp[1].data.rows[0].PreOpAccompainedByNotes || '';
                                $scope.PreOpQuickSummaryObj.FamilyRelationId = resp[1].data.rows[0].FamilyRelationId || null;
                                $scope.PreOpQuickSummaryObj.FamilyRelationName = resp[1].data.rows[0].FamilyRelationName || '';
                                $scope.PreOpQuickSummaryObj.PreOpAccompainedName = resp[1].data.rows[0].AccompainedName || '';
                                $scope.PreOpQuickSummaryObj.PreOpAccompaniedSign = resp[1].data.rows[0].PreOpAccompaniedSign || '';
                                $scope.PreOpQuickSummaryObj.PreOpAccompaniedSignedDateTime = resp[1].data.rows[0].PreOpAccompaniedSignedDateTime || null;

                                if ($scope.PreOpQuickSummaryObj.PreOpAccompaniedSign !== '') {
                                    $scope.PreOpQuickSummaryObj.IsAccompaniedSignDone = true;
                                    //var canvasP1 = document.getElementById("S_AccompaniedBySign");
                                    //var ctxP1 = canvasP1.getContext("2d");
                                    //ctxP1.clearRect(0, 0, canvasP1.width, canvasP1.height);
                                    //var imageP1 = new Image();
                                    //imageP1.onload = function () {
                                    //    ctxP1.drawImage(imageP1, 0, 0, canvasP1.width, canvasP1.height);
                                    //};
                                    //imageP1.src = $scope.PreOpQuickSummaryObj.PreOpAccompaniedSign;
                                }

                                $scope.PreOpQuickSummaryObj.AllergyRemarks = resp[1].data.rows[0].AllergyRemarks || '';
                                $scope.PreOpQuickSummaryObj.SurgicalRemarks = resp[1].data.rows[0].SurgicalRemarks || '';
                                $scope.PreOpQuickSummaryObj.CurrentEyeRemarks = resp[1].data.rows[0].CurrentEyeRemarks || '';
                                $scope.PreOpQuickSummaryObj.CurrentSystemicRemarks = resp[1].data.rows[0].CurrentSystemicRemarks || '';
                                $scope.PreOpQuickSummaryObj.SystemicHistoryRemarks = resp[1].data.rows[0].SystemicHistoryRemarks || '';
                                $scope.PreOpQuickSummaryObj.LifestyleHistoryRemarks = resp[1].data.rows[0].LifestyleHistoryRemarks || '';

                                $scope.PreOpQuickSummaryObj.IsSurgeonOrdersTimeChecked = resp[1].data.rows[0].IsSurgeonOrdersTimeChecked || false;
                                $scope.PreOpQuickSummaryObj.IsAnesthesiaOrdersTimeChecked = resp[1].data.rows[0].IsAnesthesiaOrdersTimeChecked || false;


                                $scope.PreOpQuickSummaryObj.VitalsArray = resp[1].data.rows[0].VitalsArray || [];

                                if ($scope.PreOpQuickSummaryObj.VitalsArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.VitalsDisplay = $scope.GetDisplayVitalsArray();
                                    angular.forEach($scope.PreOpQuickSummaryObj.VitalsArray, function (mainitem, $index) {
                                        let TempFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 11 }, true) || [];
                                        if (TempFilter.length > 0) {
                                            var tempobj = {
                                                "value": TempFilter[0].Value,
                                                "UnitTypeName": TempFilter[0].UnitTypeName
                                            }
                                        }
                                        $scope.PreOpQuickSummaryObj.VitalsDisplay[0].Values.push(tempobj);
                                        let pulseFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 12 }, true) || [];
                                        if (pulseFilter.length > 0) {
                                            var pulseobj = {
                                                "value": pulseFilter[0].Value,
                                                "UnitTypeName": pulseFilter[0].UnitTypeName
                                            }
                                        }
                                        $scope.PreOpQuickSummaryObj.VitalsDisplay[1].Values.push(pulseobj);
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
                                        $scope.PreOpQuickSummaryObj.VitalsDisplay[2].Values.push(Bpobj);
                                        let RespFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 14 }, true) || [];
                                        if (RespFilter.length > 0) {
                                            var Respobj = {
                                                "value": RespFilter[0].Value,
                                                "UnitTypeName": RespFilter[0].UnitTypeName
                                            }
                                        }
                                        $scope.PreOpQuickSummaryObj.VitalsDisplay[3].Values.push(Respobj);
                                        let Spo2Filter = $filter('filter')(mainitem.Vitals, { "VitalId": 15 }, true) || [];
                                        if (Spo2Filter.length > 0) {
                                            var Spo2obj = {
                                                "value": Spo2Filter[0].Value,
                                                "UnitTypeName": Spo2Filter[0].UnitTypeName
                                            }
                                        }
                                        $scope.PreOpQuickSummaryObj.VitalsDisplay[4].Values.push(Spo2obj);
                                        let BGLFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 8 }, true) || [];
                                        if (BGLFilter.length > 0) {
                                            var BGLobj = {
                                                "value": BGLFilter[0].Value,
                                                "UnitTypeName": BGLFilter[0].UnitTypeName
                                            }
                                        }
                                        $scope.PreOpQuickSummaryObj.VitalsDisplay[5].Values.push(BGLobj);

                                        var Time = {
                                            "value": $scope.PreOpQuickSummaryObj.VitalsArray[$index].VitalAddTime || "",
                                            "UnitTypeName": "",
                                        }
                                        $scope.PreOpQuickSummaryObj.VitalsDisplay[6].Values.push(Time);
                                        var performedBy = {
                                            "value": $scope.PreOpQuickSummaryObj.VitalsArray[$index].UserName || "",
                                            "UnitTypeName": "",
                                        }
                                        $scope.PreOpQuickSummaryObj.VitalsDisplay[7].Values.push(performedBy);

                                        var NotesObj = {
                                            "value": $scope.PreOpQuickSummaryObj.VitalsArray[$index].VitalRemarks || "",
                                            "UnitTypeName": "",
                                        }
                                        $scope.PreOpQuickSummaryObj.VitalsDisplay[8].Values.push(NotesObj);
                                    });
                                }




                                $scope.PreOpQuickSummaryObj.NurseFallRiskID = resp[1].data.rows[0].NurseFallRiskID || 0;
                                $scope.PreOpQuickSummaryObj.NurseFallRiskName = resp[1].data.rows[0].NurseFallRiskName || '';
                                $scope.PreOpQuickSummaryObj.NurseFallRiskLicenseNo = resp[1].data.rows[0].NurseFallRiskLicenseNo || '';
                                $scope.PreOpQuickSummaryObj.OxygenType = resp[1].data.rows[0].OxygenType || "";
                                $scope.PreOpQuickSummaryObj.OxygenQuantity = resp[1].data.rows[0].OxygenQuantity || "";
                                $scope.PreOpQuickSummaryObj.EndotrachealTubeNotes = resp[1].data.rows[0].EndotrachealTubeNotes || "";
                                $scope.PreOpQuickSummaryObj.LMANotes = resp[1].data.rows[0].LMANotes || "";
                                $scope.PreOpQuickSummaryObj.PreOpInRoomTime = resp[1].data.rows[0].PreOpInRoomTime || '';
                                $scope.PreOpQuickSummaryObj.PreOpDiabetesRemarks = resp[1].data.rows[0].PreOpDiabetesRemarks || '';
                                $scope.PreOpQuickSummaryObj.IvAccessGivenBy = resp[1].data.rows[0].IvAccessGivenBy || null;
                                $scope.PreOpQuickSummaryObj.NoOfAttempts = resp[1].data.rows[0].NoOfAttempts || null;
                                $scope.PreOpQuickSummaryObj.IvAccessGivenByTime = resp[1].data.rows[0].IvAccessGivenByTime || '';
                                $scope.PreOpQuickSummaryObj.IvAccessGivenByName = $scope.PreOpQuickSummaryObj.IvAccessGivenByName || '';
                                $scope.PreOpQuickSummaryObj.PreOpNurseChartStatus = resp[1].data.rows[0].PreOpNurseChartStatus || '';
                                $scope.PreOpQuickSummaryObj.PreOpAnesthesiaChartStatus = resp[1].data.rows[0].PreOpAnesthesiaChartStatus || '';

                                $scope.PreOpQuickSummaryObj.MentalStatus = resp[1].data.rows[0].MentalStatus || '';

                                //if ($scope.PreOpQuickSummaryObj.IvAccessGivenBy !== null) {
                                //    let IvGivenBy = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreOpQuickSummaryObj.IvAccessGivenBy }, true) || [];
                                //    if (IvGivenBy.length > 0) {
                                //        $scope.PreOpQuickSummaryObj.IvAccessGivenByName = IvGivenBy[0].FullName || '';
                                //    }
                                //} else {
                                //    if ($scope.RoleId == 8) {
                                //        $scope.PreOpQuickSummaryObj.IvAccessGivenBy = $scope.UserId || null;
                                //    };
                                //}

                                if (resp[1].data.rows[0].NurseFallRiskReviewdDate != "") {
                                    var NurseFallRiskReviewdDate = resp[1].data.rows[0].NurseFallRiskReviewdDate || "";
                                    $scope.PreOpQuickSummaryObj.NurseFallRiskReviewdDate = $filter('date')(NurseFallRiskReviewdDate, 'MM-dd-yyyy hh:mm a') || '';
                                }

                                $scope.PreOpQuickSummaryObj.ODPupilSize = preopdata.ODPupilSize || "";

                                // Femto Template

                                $scope.PreOpQuickSummaryObj.FemtoArcuateIncisions1 = preopdata.FemtoArcuateIncisions1 || '';
                                $scope.PreOpQuickSummaryObj.IsFemtoArcuateIncisions1NA = preopdata.IsFemtoArcuateIncisions1NA || false;
                                $scope.PreOpQuickSummaryObj.FemtoArcuateIncisions2 = preopdata.FemtoArcuateIncisions2 || '';
                                $scope.PreOpQuickSummaryObj.IsFemtoArcuateIncisions2NA = preopdata.IsFemtoArcuateIncisions2NA || false;
                                $scope.PreOpQuickSummaryObj.FemtoArcuateIncisionsNotes = preopdata.FemtoArcuateIncisionsNotes || '';
                                $scope.PreOpQuickSummaryObj.FemtoTimeOut = preopdata.FemtoTimeOut || '';
                                $scope.PreOpQuickSummaryObj.FemtoStartTime = preopdata.FemtoStartTime || '';
                                $scope.PreOpQuickSummaryObj.FemtoEndTime = preopdata.FemtoEndTime || '';
                                $scope.PreOpQuickSummaryObj.FemtoReferenceNo = preopdata.FemtoReferenceNo || '';
                                $scope.PreOpQuickSummaryObj.FemtoLotNo = preopdata.FemtoLotNo || '';
                                $scope.PreOpQuickSummaryObj.FemtoExpiryDate = preopdata.FemtoExpiryDate || null;
                                $scope.PreOpQuickSummaryObj.FemtoOverAllNotes = preopdata.FemtoOverAllNotes || '';
                                $scope.PreOpQuickSummaryObj.FemtNurseReviewedById = preopdata.FemtNurseReviewedById || null;
                                $scope.PreOpQuickSummaryObj.FemtNurseReviewedByName = preopdata.FemtNurseReviewedByName || '';
                                $scope.PreOpQuickSummaryObj.FemtDoctorReviewedById = preopdata.FemtDoctorReviewedById || null;
                                $scope.PreOpQuickSummaryObj.FemtDoctorReviewedByName = preopdata.FemtDoctorReviewedByName || '';

                                if ($scope.PreOpQuickSummaryObj.FemtoArcuateIncisionsNotes !== '') {
                                    $scope.PreOpQuickSummaryObj.FemtoArcuateNotesInd = true;
                                } else {
                                    $scope.PreOpQuickSummaryObj.FemtoArcuateNotesInd = false;
                                }

                                if ($scope.PreOpQuickSummaryObj.FemtoExpiryDate !== null) {
                                    $scope.PreOpQuickSummaryObj.FemtoExpiryDate = $filter("date")($scope.PreOpQuickSummaryObj.FemtoExpiryDate, "MM-dd-yyyy") || null;
                                }

                                if ($scope.PreOpQuickSummaryObj.FemtoArcuateIncisions1 !== '' || $scope.PreOpQuickSummaryObj.IsFemtoArcuateIncisions1NA || $scope.PreOpQuickSummaryObj.FemtoArcuateIncisions2 !== '' || $scope.PreOpQuickSummaryObj.IsFemtoArcuateIncisions2NA || $scope.PreOpQuickSummaryObj.FemtoTimeOut !== '' || $scope.PreOpQuickSummaryObj.FemtoStartTime !== '' || $scope.PreOpQuickSummaryObj.FemtoEndTime !== '' || $scope.PreOpQuickSummaryObj.FemtoReferenceNo !== ''
                                    || $scope.PreOpQuickSummaryObj.FemtoLotNo !== '' || $scope.PreOpQuickSummaryObj.FemtoExpiryDate !== null || $scope.PreOpQuickSummaryObj.FemtoOverAllNotes !== '' || $scope.PreOpQuickSummaryObj.FemtNurseReviewedById !== null || $scope.PreOpQuickSummaryObj.FemtDoctorReviewedById !== null) {
                                    $scope.PreOpQuickSummaryObj.IfFemtoTemplateDataAdded = true;
                                } else {
                                    $scope.PreOpQuickSummaryObj.IfFemtoTemplateDataAdded = false;
                                }

                                $scope.PreOpQuickSummaryObj.PainLevel = preopdata.PainLevel;
                                $scope.PreOpQuickSummaryObj.IVSiteName = preopdata.IVSiteName || "";
                                $scope.PreOpQuickSummaryObj.IVNeedleSizeName = preopdata.IVNeedleSizeName || "";
                                $scope.PreOpQuickSummaryObj.PatencyStatus = preopdata.PatencyStatus || "";
                                $scope.PreOpQuickSummaryObj.IVArm = preopdata.IVArm || "";
                                $scope.PreOpQuickSummaryObj.IdentifierName = preopdata.IdentifierName || "";
                                $scope.PreOpQuickSummaryObj.IdentifierDurationDate = preopdata.IdentifierDurationDate || "";
                                $scope.PreOpQuickSummaryObj.PreOpOverallNotes = preopdata.PatientCheckIn.PreOpOverallNotes || '';
                                $scope.PreOpQuickSummaryObj.IVSiteFluids = preopdata.IVSiteFluids || null;
                                $scope.PreOpQuickSummaryObj.IVSiteFlush = preopdata.IVSiteFlush || null;
                                $scope.PreOpQuickSummaryObj.IVFluidsId = preopdata.IVFluidsId || null;
                                $scope.PreOpQuickSummaryObj.IVSiteLactatedRingers = preopdata.IVSiteLactatedRingers || null;
                                //if (preopdata.IVBlockedArray.length > 0) {

                                //    $scope.PreOpQuickSummaryObj.IVSiteBlocked = true;
                                //    angular.forEach($scope.PreOpQuickSummaryObj.IVBlockedArray, function (hitem) {
                                //        angular.forEach(preopdata.IVBlockedArray, function (kitem) {
                                //            if (kitem.IVSiteMarkingId === hitem.IVSiteMarkingId) {
                                //                kitem.IsSelected = true;
                                //                hitem.IsSelected = true;
                                //                hitem.DeleteInd = 'N';
                                //                hitem.IVSiteMarkingName = kitem.IVSiteMarkingName;
                                //                hitem.PatientIVBlockedId = kitem.PatientIVBlockedId || 0;

                                //            }
                                //        });
                                //    });
                                //}
                                //if ($scope.PreOpQuickSummaryObj.IVSiteFluids !== null) {
                                //    let FluidsArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteFluidsArray, { 'IVSiteMarkingId': $scope.PreOpQuickSummaryObj.IVSiteFluids }, true) || [];
                                //    if (FluidsArray.length > 0) {
                                //        $scope.PreOpQuickSummaryObj.IVSiteFluidsName = FluidsArray[0].IVSiteMarkingName || '';
                                //    };
                                //};
                                //if ($scope.PreOpQuickSummaryObj.IVSiteFlush !== null) {
                                //    let FlushArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteFlushArray, { 'IVSiteMarkingId': $scope.PreOpQuickSummaryObj.IVSiteFlush }, true) || [];
                                //    if (FlushArray.length > 0) {
                                //        $scope.PreOpQuickSummaryObj.IVSiteFlushName = FlushArray[0].IVSiteMarkingName || '';
                                //    };
                                //};
                                //if ($scope.PreOpQuickSummaryObj.IVSiteLactatedRingers !== null) {
                                //    let LactatedArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteLRArray, { 'IVSiteMarkingId': $scope.PreOpQuickSummaryObj.IVSiteLactatedRingers }, true) || [];
                                //    if (LactatedArray.length > 0) {
                                //        $scope.PreOpQuickSummaryObj.IVSiteLactatedRingersName = LactatedArray[0].IVSiteMarkingName || '';
                                //    };
                                //};
                                //if ($scope.PreOpQuickSummaryObj.IVFluidsId !== null) {
                                //    let Array = $filter('filter')($scope.PreOpQuickSummaryObj.IVFluidsArray, { 'IVSiteMarkingId': $scope.PreOpQuickSummaryObj.IVFluidsId }, true) || [];
                                //    if (Array.length > 0) {
                                //        $scope.PreOpQuickSummaryObj.IVFluidsName = Array[0].IVSiteMarkingName || '';
                                //    };
                                //};

                                //if ($scope.PreOpQuickSummaryObj.PatencyStatus == 'Blocked') {
                                //    $scope.PreOpQuickSummaryObj.IVSiteBlocked = true;
                                //} else {
                                //    $scope.PreOpQuickSummaryObj.IVSiteBlocked = false;
                                //}

                                $scope.PreOpQuickSummaryObj.IsIVAccessdata = false;
                                $scope.PreOpQuickSummaryObj.IVAccessDetailsList = preopdata.IVAccessDetailsList || [];
                                if ($scope.PreOpQuickSummaryObj.IVAccessDetailsList.length > 0) {
                                    angular.forEach($scope.PreOpQuickSummaryObj.IVAccessDetailsList, function (item) {
                                        item.IVSiteFluidsName = item.IVSiteFluidsName || '';
                                        if (item.IVSiteFluids !== null) {
                                            let FluidsArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteFluidsArray, { 'IVSiteMarkingId': item.IVSiteFluids }, true) || [];
                                            if (FluidsArray.length > 0) {
                                                item.IVSiteFluidsName = FluidsArray[0].IVSiteMarkingName || '';
                                            }
                                        };
                                        item.IVSiteFlushName = item.IVSiteFlushName || '';
                                        if (item.IVSiteFlush !== null) {
                                            let FlushArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteFlushArray, { 'IVSiteMarkingId': item.IVSiteFlush }, true) || [];
                                            if (FlushArray.length > 0) {
                                                item.IVSiteFlushName = FlushArray[0].IVSiteMarkingName || '';
                                            }
                                        };
                                        item.IVSiteLactatedRingersName = item.IVSiteLactatedRingersName || '';
                                        if (item.IVSiteLactatedRingers !== null) {
                                            let LactatedArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteLRArray, { 'IVSiteMarkingId': item.IVSiteLactatedRingers }, true) || [];
                                            if (LactatedArray.length > 0) {
                                                item.IVSiteLactatedRingersName = LactatedArray[0].IVSiteMarkingName || '';
                                            }
                                        };
                                        item.IVFluidsName = item.IVFluidsName || "";
                                        if (item.IVFluidsId !== null) {
                                            let Array = $filter('filter')($scope.PreOpQuickSummaryObj.IVFluidsArray, { 'IVSiteMarkingId': item.IVFluidsId }, true) || [];
                                            if (Array.length > 0) {
                                                item.IVFluidsName = Array[0].IVSiteMarkingName || '';
                                            }
                                        };

                                        if (item.PatencyStatus == 'Not Patent') {
                                            item.IVSiteBlocked = true;
                                        } else {
                                            item.IVSiteBlocked = false;
                                        }

                                        if (item.IvAccessGivenBy !== null) {
                                            let IvGivenBy = $filter('filter')($scope.allUserList, { 'DoctorID': item.IvAccessGivenBy }, true) || [];
                                            if (IvGivenBy.length > 0) {
                                                item.IvAccessGivenByName = IvGivenBy[0].FullName || '';
                                            } else {
                                                item.IvAccessGivenByName = '';
                                            }
                                        } else {
                                            if ($scope.RoleId == 8) {
                                                item.IvAccessGivenBy = $scope.UserId || null;
                                            };
                                            item.IvAccessGivenByName = '';
                                        }
                                        item.IVNeedleSizeName = item.IVNeedleSizeName || "";
                                        item.IVSiteName = item.IVSiteName || "";
                                        item.IVArm = item.IVArm || "";
                                        item.IvAccessGivenByDate = item.IvAccessGivenByDate || null;
                                        if (item.IvAccessGivenByDate != null) {
                                            item.IvAccessGivenByDate = $filter('date')(item.IvAccessGivenByDate, "MM-dd-yyyy");
                                        }

                                        if (item.PatencyStatus !== '' || item.IvAccessGivenBy !== null || item.IVNeedleSizeName !== '' || item.IVSiteName !== '' || item.IvAccessGivenByTime !== '' || item.IVArm !== '') {
                                            $scope.PreOpQuickSummaryObj.IsIVAccessdata = true;
                                        }
                                    });
                                }

                                preopdata.SurgicalSiteVerifiedBy = preopdata.SurgicalSiteVerifiedBy || null;
                                $scope.PreOpQuickSummaryObj.PreOpSurgicalSiteRemarks = preopdata.PreOpSurgicalSiteRemarks || "";
                                if (preopdata.SurgicalSiteVerifiedBy != null) {
                                    let SurgicalUser = $filter('filter')($scope.allUserList, { 'DoctorID': preopdata.SurgicalSiteVerifiedBy }, true) || [];
                                    var LicenseNo = '';
                                    if (SurgicalUser.length > 0) {
                                        if (SurgicalUser[0].LicenseNumber != '') {
                                            var LicenseNo = SurgicalUser[0].LicenseNumber || '';
                                        }

                                        $scope.PreOpQuickSummaryObj.SurgicalSiteVerifiedByName = SurgicalUser[0].SecondUserFullName + ' ' + LicenseNo;
                                    }
                                }

                                if (preopdata.IVBlockedArray.length > 0) {
                                    angular.forEach($scope.PreOpQuickSummaryObj.IVBlockedArray, function (hitem) {
                                        angular.forEach(preopdata.IVBlockedArray, function (kitem) {
                                            if (kitem.IVSiteMarkingId === hitem.IVSiteMarkingId) {
                                                kitem.IsSelected = true;
                                                hitem.IsSelected = true;
                                                hitem.IVSiteMarkingName = kitem.IVSiteMarkingName;
                                                hitem.PatientIVBlockedId = kitem.PatientIVBlockedId || 0;


                                            }
                                        });
                                    });
                                }

                                $scope.PreOpQuickSummaryObj.PreOpHandOffFrom = preopdata.PreOpHandOffFrom || null;
                                $scope.PreOpQuickSummaryObj.PreOpHandOffReviewedBy = preopdata.PreOpHandOffReviewedBy || null;
                                $scope.PreOpQuickSummaryObj.PreOpHandOffTime = preopdata.PreOpHandOffTime || "";
                                $scope.PreOpQuickSummaryObj.PreOpHandoffRemarks = preopdata.PreOpHandoffRemarks || "";
                                $scope.PreOpQuickSummaryObj.PreOpAnesthesiaNotes = preopdata.PreOpAnesthesiaNotes || null;


                                if ($scope.PreOpQuickSummaryObj.PreOpHandOffReviewedBy != null) {
                                    let HandUser = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreOpQuickSummaryObj.PreOpHandOffReviewedBy }, true) || [];
                                    var License = '';
                                    if (HandUser.length > 0) {
                                        if (HandUser[0].LicenseNumber != '') {
                                            var License = HandUser[0].LicenseNumber || '';
                                        }

                                        $scope.PreOpQuickSummaryObj.PreOpHandOffReviewedName = HandUser[0].SecondUserFullName + ' ' + License;
                                    }
                                }
                                if ($scope.PreOpQuickSummaryObj.PreOpHandOffFrom != null) {
                                    let HandUser = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreOpQuickSummaryObj.PreOpHandOffFrom }, true) || [];
                                    var License = '';
                                    if (HandUser.length > 0) {
                                        if (HandUser[0].LicenseNumber != '') {
                                            var License = HandUser[0].LicenseNumber || '';
                                        }

                                        $scope.PreOpQuickSummaryObj.PreOpHandOffFromName = HandUser[0].SecondUserFullName + ' ' + License;
                                    }
                                } else {
                                    $scope.PreOpQuickSummaryObj.PreOpHandOffFromName = '';
                                }
                                $scope.PreOpQuickSummaryObj.Vitals = preopdata.VitalsArray || [];
                                $scope.PreOpQuickSummaryObj.TotalAlderetScore = preopdata.TotalAlderetScore;
                                $scope.PreOpQuickSummaryObj.DocumentDetails = angular.copy(preopdata.DocumentDetails);

                                if (preopdata.AlderetScoreDetails.length > 0) {
                                    angular.forEach(preopdata.AlderetScoreDetails, function (item) {
                                        angular.forEach($scope.PreOpQuickSummaryObj.AlderetScoreDetails, function (hitem) {
                                            angular.forEach(hitem.AldreteScoreDetailTypes, function (kitem) {
                                                if (kitem.AldreteScoreDetailTypeId === item.AldreteScoreDetailTypeId) {
                                                    if (item.DeleteInd == "N") {
                                                        kitem.IsChecked = true;
                                                        hitem.IsChecked = true;
                                                        hitem.Value = kitem.AldreteScore;
                                                        hitem.AldreteScoreDetailTypeName = kitem.AldreteScoreDetailTypeName;
                                                        hitem.PreOpAlderetScoreDetailId = item.PreOpAlderetScoreDetailId || 0;
                                                    }
                                                }
                                            });
                                        });
                                    });
                                }

                                if ($scope.PreOpQuickSummaryObj.TotalAlderetScore == null) {
                                    let sum = 0;
                                    angular.forEach($scope.PreOpQuickSummaryObj.AlderetScoreDetails, function (sitem) {
                                        if (sitem.DeleteInd == "N" && sitem.IsChecked == true) {
                                            sum += sitem.Value;
                                        }
                                    });
                                    $scope.PreOpQuickSummaryObj.TotalAlderetScore = sum;
                                }

                                $scope.PreOpQuickSummaryObj.ReviewedDate = preopdata.ReviewedDate || '';
                                $scope.PreOpQuickSummaryObj.ReviewedTime = preopdata.ReviewedTime || '';
                                $scope.PreOpQuickSummaryObj.DilationReviewId = preopdata.DilationReviewId || '';
                                $scope.PreOpQuickSummaryObj.MedicationReviewId = preopdata.MedicationReviewId || '';
                                if (preopdata.ReviewedBy != null) {
                                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == preopdata.ReviewedBy }) || [];
                                    if (ReviewedByArraylist.length > 0) {
                                        $scope.PreOpQuickSummaryObj.ReviewedByName = angular.copy(ReviewedByArraylist[0].FullName);
                                        $scope.ReviewedBySuffixName = angular.copy(ReviewedByArraylist[0].SuffixName + ',') || '';
                                        $scope.ReviewedByLicenseNo = angular.copy(ReviewedByArraylist[0].LicenseNumber) || '';
                                        if (ReviewedByArraylist[0].SuffixId == 10) {
                                            $scope.PreOpQuickSummaryObj.ReviewedByName = ' Dr. ' + $scope.PreOpQuickSummaryObj.ReviewedByName;
                                        }
                                    }
                                }

                                if ($scope.PreOpQuickSummaryObj.DilationReviewId != null) {
                                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpQuickSummaryObj.DilationReviewId });

                                    ReviewedByArraylist = ReviewedByArraylist || [];
                                    if (ReviewedByArraylist.length > 0) {

                                        var SuffixName = '';
                                        ReviewedByArraylist[0].SuffixName = ReviewedByArraylist[0].SuffixName || "";
                                        if (ReviewedByArraylist[0].SuffixName != "") {
                                            SuffixName = ReviewedByArraylist[0].SuffixName + ',';
                                        }

                                        var LicenseNumber = "";
                                        ReviewedByArraylist[0].LicenseNumber = ReviewedByArraylist[0].LicenseNumber || "";
                                        if (ReviewedByArraylist[0].LicenseNumber != "") {
                                            LicenseNumber = 'Lic:' + ' ' + ReviewedByArraylist[0].LicenseNumber + ',';
                                        }

                                        $scope.PreOpQuickSummaryObj.DilationReviewName = angular.copy(ReviewedByArraylist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                    }
                                    else {
                                        $scope.PreOpQuickSummaryObj.DilationReviewName = ""
                                    }
                                }

                                $scope.PreOpQuickSummaryObj.ODPupilSize = preopdata.ODPupilSize || "";
                                $scope.PreOpQuickSummaryObj.OSPupilSize = preopdata.OSPupilSize || "";

                                if ($scope.PreOpQuickSummaryObj.MedicationReviewId != null) {
                                    var MedicationArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpQuickSummaryObj.MedicationReviewId });
                                    MedicationArraylist = MedicationArraylist || [];
                                    if (MedicationArraylist.length > 0) {

                                        var SuffixName = '';
                                        MedicationArraylist[0].SuffixName = MedicationArraylist[0].SuffixName || "";
                                        if (MedicationArraylist[0].SuffixName != "") {
                                            SuffixName = MedicationArraylist[0].SuffixName + ',';
                                        }
                                        var LicenseNumber = "";
                                        MedicationArraylist[0].LicenseNumber = MedicationArraylist[0].LicenseNumber || "";
                                        if (MedicationArraylist[0].LicenseNumber != "") {
                                            LicenseNumber = 'Lic:' + ' ' + MedicationArraylist[0].LicenseNumber + ',';
                                        }
                                        $scope.PreOpQuickSummaryObj.MedicationReviewName = angular.copy(MedicationArraylist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                    }
                                    else {
                                        $scope.PreOpQuickSummaryObj.MedicationReviewName = ""
                                    }
                                    //if (MedicationArraylist.length > 0) {
                                    //    $scope.PreOpQuickSummaryObj.MedicationReviewName = angular.copy(MedicationArraylist[0].FullName);
                                    //}
                                }

                                $scope.ModifiedPreopMedicationDate = "";
                                $scope.ModifiedDilationDate = "";

                                //if (preopdata.PreOpMedications.length > 0) {
                                //    angular.forEach(preopdata.PreOpMedications, function (hitem) {
                                //        var dateTimeString = hitem.ModifiedDt;
                                //        $scope.ModifiedPreopMedicationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                //    });
                                //}

                                //if (preopdata.DilationMedications.length > 0) {
                                //    angular.forEach(preopdata.DilationMedications, function (hitem) {
                                //        var dateTimeString = hitem.ModifiedDt;
                                //        $scope.ModifiedDilationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                //    });
                                //}

                                if (preopdata.OrderDetails.length > 0) {

                                    angular.forEach(preopdata.OrderDetails, function (Mitem) {
                                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                        Mitem.UserOrderId = Mitem.UserOrderId || null;
                                        Mitem.UserType = Mitem.UserType || null;
                                        Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                        Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                        Mitem.ModifiedDt = Mitem.ModifiedDt || '';
                                        if (Mitem.DilationMedications.length > 0) {
                                            if (Mitem.DilationMedications.length > 0) {
                                                angular.forEach(Mitem.DilationMedications, function (item) {
                                                    var dateTimeString = item.ModifiedDt;
                                                    $scope.ModifiedDilationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                                });
                                            }

                                        }

                                        if (Mitem.PreOpMedications.length > 0) {
                                            if (Mitem.PreOpMedications.length > 0) {
                                                angular.forEach(Mitem.PreOpMedications, function (item) {
                                                    var dateTimeString = item.ModifiedDt;
                                                    $scope.ModifiedPreopMedicationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                                });
                                            }

                                        }
                                    });
                                }

                                $scope.PreOpQuickSummaryObj.DilationMedicationsNotes = preopdata.DilationMedicationsNotes || '';
                                $scope.PreOpQuickSummaryObj.MedicationRemarks = preopdata.MedicationRemarks || '';

                                if ($scope.PreOpQuickSummaryObj.ReviewedDate != '' || $scope.PreOpQuickSummaryObj.ReviewedTime != '' || $scope.PreOpQuickSummaryObj.ReviewedByName != '') {
                                    $scope.PreOpQuickSummaryObj.ReviewedbyInd = true;
                                } else {
                                    $scope.PreOpQuickSummaryObj.ReviewedbyInd = false;
                                }

                                //$scope.PreOpQuickSummaryObj.PreOpMedications = angular.copy(preopdata.PreOpMedications);
                                //$scope.PreOpQuickSummaryObj.DilationMedications = angular.copy(preopdata.DilationMedications);
                                $scope.PreOpQuickSummaryObj.OrderDetails = angular.copy(preopdata.OrderDetails);
                                if ($scope.PreOpQuickSummaryObj.OrderDetails.length > 0) {
                                    var NurseMedCount = 0;
                                    var NurseGenCount = 0;
                                    var AnesthesiaGenCount = 0;
                                    var AnesthesiaMedCount = 0;

                                    angular.forEach($scope.PreOpQuickSummaryObj.OrderDetails, function (item) {
                                        if (item.MedTypeId == 1) {
                                            if (item.PreOpMedications.length > 0) {
                                                AnesthesiaMedCount++;
                                            };
                                            if (item.GeneralOrders.length > 0) {
                                                AnesthesiaGenCount++;
                                            };
                                        }
                                        else if (item.MedTypeId == 2) {
                                            if (item.DilationMedications.length > 0) {
                                                NurseMedCount++;
                                            };
                                            if (item.GeneralOrders.length > 0) {
                                                NurseGenCount++;
                                            };
                                        }
                                    });

                                    if (NurseMedCount !== 0) {
                                        $scope.show.IsNurseMedications = true;
                                    } else {
                                        $scope.show.IsNurseMedications = false;
                                    };

                                    if (NurseGenCount !== 0) {
                                        $scope.show.IsNurseGenOrders = true;
                                    } else {
                                        $scope.show.IsNurseGenOrders = false;
                                    };
                                    if (AnesthesiaMedCount !== 0) {
                                        $scope.show.IsAnesthesiaMedications = true;
                                    } else {
                                        $scope.show.IsAnesthesiaMedications = false;
                                    };

                                    if (AnesthesiaGenCount !== 0) {
                                        $scope.show.IsAnesthesiaGenOrders = true;
                                    } else {
                                        $scope.show.IsAnesthesiaGenOrders = false;
                                    };
                                } else {
                                    $scope.PreOpQuickSummaryObj.OrderDetails = [];

                                    $scope.show.IsAnesthesiaMedications = false;
                                    $scope.show.IsAnesthesiaGenOrders = false;
                                    $scope.show.IsNurseGenOrders = false;
                                    $scope.show.IsNurseMedications = false;
                                }

                                $scope.PreOpQuickSummaryObj.DocumentDetails = angular.copy(preopdata.DocumentDetails);
                                $scope.PreOpQuickSummaryObj.PreOpCallDetails = angular.copy(preopdata.PreOpCallDetails);
                                //$scope.PreOpQuickSummaryObj.OrgASCChecklist = angular.copy(preopdata.OrgASCChecklist);
                                $scope.PreOpQuickSummaryObj.HealthArray = angular.copy(preopdata.HealthArray);

                                if ($scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray.length != 0) {
                                    $scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray[0] = angular.copy(preopdata.PatientCheckIn);
                                } else {
                                    $scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray.push(preopdata.PatientCheckIn);
                                }
                                //$scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray.push(preopdata.PatientCheckIn);
                                $scope.IsAscPreoppatientChecklistarrayEmpty = false;
                                if ($scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray.length > 0) {
                                    angular.forEach($scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray, function (item) {
                                        if (item.RecievedForSurgery == '' && item.AccompainedBy == '' && item.PreOperativeOrientationOffered == '' && item.ObservedBehavior == '' && item.LevelOfConsciousness == '' && item.PatientTransfferedIn == '' && item.PatientDestination == '' && item.PTERefers == '' && item.PreOpOverallNotes == '') {
                                            $scope.IsAscPreoppatientChecklistarrayEmpty = true;
                                        }
                                    });
                                }

                                $scope.AscPreopObj.OrgASCChecklist = angular.copy(OrgASCChecklists);
                                if (preopdata.OrgASCChecklist.length > 0) {
                                    angular.forEach(preopdata.OrgASCChecklist, function (item) {
                                        angular.forEach($scope.AscPreopObj.OrgASCChecklist, function (kitem) {
                                            if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                                if (kitem.CheckListId === item.CheckListId) {
                                                    kitem.IsChecked = true;
                                                    kitem.Score = item.Score || 0;
                                                    kitem.Value = item.Value || '';
                                                    kitem.Remarks = item.Remarks || '';
                                                    if (kitem.Remarks !== '') {
                                                        kitem.intranotes1 = true;
                                                    }
                                                    kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;

                                                    if (item.CheckListId == 212 || item.CheckListId == 170) {
                                                        if (item.AscMultiCheckValueArray.length > 0) {
                                                            angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                                angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                                                                    if (hitem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                                        hitem.IsChecked = true;
                                                                        hitem.PatientMultiCheckListId = jitem.PatientMultiCheckListId || null;
                                                                    }
                                                                });
                                                            });
                                                        }

                                                    }
                                                    else {
                                                        if (kitem.OrganizationCheckListDetails.length > 0) {
                                                            angular.forEach(kitem.OrganizationCheckListDetails, function (Gitem) {
                                                                Gitem.IsChecked = false;
                                                                if (item.Value == Gitem.Value) {
                                                                    Gitem.IsChecked = true;
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    });
                                }

                                $scope.PreOpQuickSummaryObj.ChunkedGeneralChecklist = [];

                                let tempArrayGeneral = $scope.AscPreopObj.OrgASCChecklist
                                    .filter(item =>
                                        item.CheckListCategoryId === 6
                                    )
                                    .sort((a, b) => a.OrgOrderBy - b.OrgOrderBy);

                                let filteredClinicalChecklist1 = angular.copy(tempArrayGeneral);
                                if (filteredClinicalChecklist1.length > 0) {
                                    let chunkSize = Math.ceil((filteredClinicalChecklist1.length) / 2);
                                    for (let i = 0; i < filteredClinicalChecklist1.length; i += chunkSize) {
                                        $scope.PreOpQuickSummaryObj.ChunkedGeneralChecklist.push(filteredClinicalChecklist1.slice(i, i + chunkSize));
                                    }
                                }



                                $scope.PreOpQuickSummaryObj.ChunkedClinicalChecklist = [];

                                let tempArray = $scope.AscPreopObj.OrgASCChecklist
                                    .filter(item =>
                                        item.CheckListCategoryId === 1 &&
                                        item.CheckListSubTypeId === 1
                                    )
                                    .sort((a, b) => a.OrgOrderBy - b.OrgOrderBy);

                                let filteredClinicalChecklist = angular.copy(tempArray);
                                if (filteredClinicalChecklist.length > 0) {
                                    let chunkSize = Math.ceil((filteredClinicalChecklist.length) / 2);
                                    for (let i = 0; i < filteredClinicalChecklist.length; i += chunkSize) {
                                        $scope.PreOpQuickSummaryObj.ChunkedClinicalChecklist.push(filteredClinicalChecklist.slice(i, i + chunkSize));
                                    }
                                }

                                $scope.PreOpQuickSummaryObj.ChunkedPatientChecklist = [];
                                let tempPatientArray = $filter('filter')($scope.AscPreopObj.OrgASCChecklist, { 'CheckListCategoryId': 12, 'CheckListSubTypeId': 1 }, true) || [];
                                let filteredPatientChecklist = angular.copy(tempPatientArray);
                                if (filteredPatientChecklist.length > 0) {
                                    let chunkSize = Math.ceil((filteredPatientChecklist.length) / 2);
                                    for (let i = 0; i < filteredPatientChecklist.length; i += chunkSize) {
                                        $scope.PreOpQuickSummaryObj.ChunkedPatientChecklist.push(filteredPatientChecklist.slice(i, i + chunkSize));
                                    }
                                }

                                $scope.PatientChekListArray = (tempPatientArray || []).filter(item =>
                                    (item.OrganizationCheckListDetails || []).some(sub => sub.IsChecked === true)
                                );


                                let tempHealthArray = angular.copy(preopdata.HealthArray);
                                let tempCardiacArray = [];
                                let tempPulmonaryArray = [];
                                let tempHepaticArray = [];
                                let tempEndocrineArray = [];
                                let tempNeurologicArray = [];
                                let tempHemeOneArray = [];
                                let tempNervousSystemArray = [];
                                let tempKidneyDiseaseArray = [];
                                let tempMusculoSkeletalArray = [];
                                let tempAutoImmuneArray = [];
                                let tempPsychosisArray = [];
                                let tempOthersArray = [];
                                let tempHeentArray = [];
                                let tempLungsArray = [];
                                angular.forEach(tempHealthArray, function (item) {
                                    if (item.CategoryId === 1) {
                                        tempCardiacArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 2) {
                                        tempPulmonaryArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 3) {
                                        tempHepaticArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 4) {
                                        tempEndocrineArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 5) {
                                        tempNeurologicArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 6) {
                                        tempHemeOneArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 7) {
                                        tempNervousSystemArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 8) {
                                        tempKidneyDiseaseArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 9) {
                                        tempMusculoSkeletalArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 10) {
                                        tempAutoImmuneArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 11) {
                                        tempPsychosisArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 12) {
                                        tempOthersArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 16) {
                                        tempHeentArray.push(item.Description);
                                    }
                                    if (item.CategoryId === 17) {
                                        tempLungsArray.push(item.Description);
                                    }
                                });

                                if (tempCardiacArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedCardiacIssues = "";
                                }
                                if (tempPulmonaryArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedPulmonaryIssues = "";
                                }
                                if (tempHepaticArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedHepaticIssues = "";
                                }
                                if (tempEndocrineArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedEndocrineIssues = "";
                                }
                                if (tempNeurologicArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedNeurologicIssues = "";
                                }
                                if (tempHemeOneArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedHemeOncIssues = "";
                                }
                                if (tempNervousSystemArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedNervousSystemIssues = "";
                                }
                                if (tempKidneyDiseaseArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedKidneyDiseaseIssues = "";
                                }
                                if (tempMusculoSkeletalArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedMusculoSkeletalSystemIssues = "";
                                }
                                if (tempAutoImmuneArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedAutoImmuneDisordersIssues = "";
                                }
                                if (tempPsychosisArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedPsychosisIssues = "";
                                }
                                if (tempOthersArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedOthersIssues = tempOthersArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedOthersIssues = "";
                                }
                                if (tempHeentArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedHeentIssues = tempHeentArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedHeentIssues = "";
                                }
                                if (tempLungsArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.SelectedLungsIssues = tempLungsArray.join(", ");
                                } else {
                                    $scope.PreOpQuickSummaryObj.SelectedLungsIssues = "";
                                }

                                $scope.PreOpQuickSummaryObj.IsCardiacWNL = preopdata.IsCardiacWNL;
                                $scope.PreOpQuickSummaryObj.IsPulmonaryWNL = preopdata.IsPulmonaryWNL;
                                $scope.PreOpQuickSummaryObj.IsHepaticWNL = preopdata.IsHepaticWNL;
                                $scope.PreOpQuickSummaryObj.IsEndocrineWNL = preopdata.IsEndocrineWNL;
                                $scope.PreOpQuickSummaryObj.IsNeurologicWNL = preopdata.IsNeurologicWNL;
                                $scope.PreOpQuickSummaryObj.IsHemeOncWNL = preopdata.IsHemeOncWNL;
                                $scope.PreOpQuickSummaryObj.IsNervousSystemWNL = preopdata.IsNervousSystemWNL;
                                $scope.PreOpQuickSummaryObj.IsKidneyDiseaseWNL = preopdata.IsKidneyDiseaseWNL;
                                $scope.PreOpQuickSummaryObj.IsMusculoSkeletalSystemWNL = preopdata.IsMusculoSkeletalSystemWNL;
                                $scope.PreOpQuickSummaryObj.IsAutoImmuneDisordersWNL = preopdata.IsAutoImmuneDisordersWNL;
                                $scope.PreOpQuickSummaryObj.IsPsychosisWNL = preopdata.IsPsychosisWNL;
                                $scope.PreOpQuickSummaryObj.IsOthersWNL = preopdata.IsOthersWNL;
                                $scope.PreOpQuickSummaryObj.IsHeentWNL = preopdata.IsHeentWNL;
                                $scope.PreOpQuickSummaryObj.IsLungsWNL = preopdata.IsLungsWNL;
                                $scope.PreOpQuickSummaryObj.IsAllHealthWNL = preopdata.IsAllHealthWNL;

                                $scope.PreOpQuickSummaryObj.CardiacNotes = preopdata.CardiacNotes || '';
                                $scope.PreOpQuickSummaryObj.PulmonaryNotes = preopdata.PulmonaryNotes || '';
                                $scope.PreOpQuickSummaryObj.HepaticNotes = preopdata.HepaticNotes || '';
                                $scope.PreOpQuickSummaryObj.EndocrineNotes = preopdata.EndocrineNotes || '';
                                $scope.PreOpQuickSummaryObj.NeurologicNotes = preopdata.NeurologicNotes || '';
                                $scope.PreOpQuickSummaryObj.HemeOncNotes = preopdata.HemeOncNotes || '';
                                $scope.PreOpQuickSummaryObj.NervousSystemNotes = preopdata.NervousSystemNotes || '';
                                $scope.PreOpQuickSummaryObj.KidneyDiseaseNotes = preopdata.KidneyDiseaseNotes || '';
                                $scope.PreOpQuickSummaryObj.MusculoSkeletalSystemNotes = preopdata.MusculoSkeletalSystemNotes || '';
                                $scope.PreOpQuickSummaryObj.AutoImmuneDisordersNotes = preopdata.AutoImmuneDisordersNotes || '';
                                $scope.PreOpQuickSummaryObj.PsychosisNotes = preopdata.PsychosisNotes || '';
                                $scope.PreOpQuickSummaryObj.OthersNotes = preopdata.OthersNotes || '';
                                $scope.PreOpQuickSummaryObj.HeentNotes = preopdata.HeentNotes || '';
                                $scope.PreOpQuickSummaryObj.LungsNotes = preopdata.LungsNotes || '';
                                $scope.PreOpQuickSummaryObj.IsVeinOpened = preopdata.IsVeinOpened;
                                $scope.PreOpQuickSummaryObj.IsDiabetes = preopdata.IsDiabetes;
                                $scope.PreOpQuickSummaryObj.IsHypoglycemiaCheck = preopdata.IsHypoglycemiaCheck;
                                $scope.PreOpQuickSummaryObj.DiabetesResult = preopdata.DiabetesResult || '';
                                $scope.PreOpQuickSummaryObj.DiabetesTime = preopdata.DiabetesTime || '';

                                $scope.PreOpQuickSummaryObj.DiabetesTimings = preopdata.DiabetesTimings || [];
                                if (preopdata.HealthArray.length > 0) {
                                    $scope.PreOpQuickSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = true;
                                }
                                else if (!$scope.PreOpQuickSummaryObj.IsCardiacWNL && !$scope.PreOpQuickSummaryObj.IsPulmonaryWNL && !$scope.PreOpQuickSummaryObj.IsHepaticWNL && !$scope.PreOpQuickSummaryObj.IsAutoImmuneDisordersWNL && !$scope.PreOpQuickSummaryObj.IsEndocrineWNL && !$scope.PreOpQuickSummaryObj.IsHemeOncWNL &&
                                    !$scope.PreOpQuickSummaryObj.IsKidneyDiseaseWNL && !$scope.PreOpQuickSummaryObj.IsMusculoSkeletalSystemWNL && !$scope.PreOpQuickSummaryObj.IsNervousSystemWNL && !$scope.PreOpQuickSummaryObj.IsNeurologicWNL && !$scope.PreOpQuickSummaryObj.IsOthersWNL && !$scope.PreOpQuickSummaryObj.IsPsychosisWNL) {

                                    $scope.PreOpQuickSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = false;
                                } else {
                                    $scope.PreOpQuickSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = true;
                                }

                                if ($scope.PreOpQuickSummaryObj.IsVeinOpened == null && $scope.PreOpQuickSummaryObj.IsDiabetes == null && $scope.PreOpQuickSummaryObj.IsHypoglycemiaCheck == null && $scope.PreOpQuickSummaryObj.DiabetesResult == '' && $scope.PreOpQuickSummaryObj.DiabetesTime == '') {
                                    $scope.PreOpQuickSummaryObj.IsPreOpMedicationInd = true;
                                } else {
                                    $scope.PreOpQuickSummaryObj.IsPreOpMedicationInd = false;
                                }

                                // notes
                                $scope.PreOpQuickSummaryObj.MedicineChecklistRemarks = preopdata.MedicineChecklistRemarks || "";
                                $scope.PreOpQuickSummaryObj.NurseChecklistRemarks = preopdata.NurseChecklistRemarks || "";
                                $scope.PreOpQuickSummaryObj.GeneralChecklistRemarks = preopdata.GeneralChecklistRemarks || "";
                                $scope.PreOpQuickSummaryObj.PreOpMedicationRemarks = preopdata.PreOpMedicationRemarks || "";
                                $scope.PreOpQuickSummaryObj.PreOpNotes = preopdata.PreOpNotes || "";

                            }

                        }
                        else {
                            $scope.PreOpQuickSummaryObj.Vitals = [];
                            $scope.PreOpQuickSummaryObj.MedicationsList = [];
                            $scope.PreOpQuickSummaryObj.InvestigationsList = [];
                            $scope.PreOpQuickSummaryObj.CurrentMedicationList = [];
                            $scope.PreOpQuickSummaryObj.TotalAlderetScore = null;

                            // files
                            $scope.PreOpQuickSummaryObj.DocumentDetails = [];
                            $scope.FilesObj.TempImagesArray = [];

                            // notes
                            $scope.PreOpQuickSummaryObj.MedicineChecklistRemarks = "";
                            $scope.PreOpQuickSummaryObj.NurseChecklistRemarks = "";
                            $scope.PreOpQuickSummaryObj.GeneralChecklistRemarks = "";
                            $scope.PreOpQuickSummaryObj.PreOpMedicationRemarks = "";
                            $scope.PreOpQuickSummaryObj.PreOpNotes = "";

                            // health and physical
                            $scope.PreOpQuickSummaryObj.HealthArray = [];
                            $scope.PreOpQuickSummaryObj.SelectedCardiacIssues = "";
                            $scope.PreOpQuickSummaryObj.SelectedPulmonaryIssues = "";
                            $scope.PreOpQuickSummaryObj.SelectedHepaticIssues = "";
                            $scope.PreOpQuickSummaryObj.SelectedEndocrineIssues = "";
                            $scope.PreOpQuickSummaryObj.SelectedNeurologicIssues = "";
                            $scope.PreOpQuickSummaryObj.SelectedHemeOncIssues = "";
                            $scope.PreOpQuickSummaryObj.SelectedNervousSystemIssues = "";
                            $scope.PreOpQuickSummaryObj.SelectedKidneyDiseaseIssues = "";
                            $scope.PreOpQuickSummaryObj.SelectedMusculoSkeletalSystemIssues = "";
                            $scope.PreOpQuickSummaryObj.SelectedAutoImmuneDisordersIssues = "";
                            $scope.PreOpQuickSummaryObj.SelectedPsychosisIssues = "";
                            $scope.PreOpQuickSummaryObj.SelectedOthersIssues = "";

                            $scope.PreOpQuickSummaryObj.IsCardiacWNL = false;
                            $scope.PreOpQuickSummaryObj.IsPulmonaryWNL = false;
                            $scope.PreOpQuickSummaryObj.IsHepaticWNL = false;
                            $scope.PreOpQuickSummaryObj.IsEndocrineWNL = false;
                            $scope.PreOpQuickSummaryObj.IsNeurologicWNL = false;
                            $scope.PreOpQuickSummaryObj.IsHemeOncWNL = false;
                            $scope.PreOpQuickSummaryObj.IsNervousSystemWNL = false;
                            $scope.PreOpQuickSummaryObj.IsKidneyDiseaseWNL = false;
                            $scope.PreOpQuickSummaryObj.IsMusculoSkeletalSystemWNL = false;
                            $scope.PreOpQuickSummaryObj.IsAutoImmuneDisordersWNL = false;
                            $scope.PreOpQuickSummaryObj.IsPsychosisWNL = false;
                            $scope.PreOpQuickSummaryObj.IsOthersWNL = false;
                            $scope.PreOpQuickSummaryObj.IsHeentWNL = false;
                            $scope.PreOpQuickSummaryObj.IsLungsWNL = false;
                            $scope.PreOpQuickSummaryObj.IsAllHealthWNL = false;
                            $scope.PreOpQuickSummaryObj.ReviewedbyInd = false;
                        }
                    });
                }
                //$scope.GetPreOpChartData();
                $scope.GetASCIntraOpDetails = function () {


                    let appointmentId = null;
                    if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
                        appointmentId = $scope.SelectedAppointmentId;
                    }

                    if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
                        appointmentId = $scope.cacheStorageItem.AscAppointmentId;
                    }

                    let req1 = {
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "CheckListModuleId": 2
                    };

                    var param = {
                        "AppointmentId": $scope.SelectedAppointmentId || null,
                    }

                    $q.all([
                        eHnoteSurgeryService.GetOrganizationASCCheckListData(req1),
                        eHnoteSurgeryService.GetASCIntraOpChartData(param),

                    ]).then(function (resp) {

                        if (resp[0].data.rows.length > 0) {
                            if (resp[0].data.status === "Success") {
                                $scope.IntraOpQuickSummaryObj.AllIntraOpChecklistsArray = [];

                                angular.forEach(resp[0].data.rows, function (item) {
                                    item.IsChecked = false;
                                    if (item.SubCheckList.length > 0) {
                                        angular.forEach(item.SubCheckList, function (kitem) {
                                            kitem.IsChecked = false;
                                        });
                                    }
                                });

                                let tempIntraopChecklistsArray = $filter('filter')(resp[0].data.rows, { 'CheckListModuleId': 2 }, true);
                                if (tempIntraopChecklistsArray.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.AllIntraOpChecklistsArray = angular.copy(tempIntraopChecklistsArray);
                                }

                                if (resp[0].data.AnaesthesiaTypes.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.AnesthesiaTypelist = resp[0].data.AnaesthesiaTypes || [];
                                }

                                $scope.IntraOpQuickSummaryObj.NursingCarePlanData = [];
                                angular.forEach($scope.IntraOpQuickSummaryObj.AllIntraOpChecklistsArray, function (item) {
                                    if (item.CheckListCategoryId == 14 || item.CheckListCategoryId == 15 || item.CheckListCategoryId == 16) {
                                        $scope.IntraOpQuickSummaryObj.NursingCarePlanData.push(item);
                                    };
                                });

                            }
                        }

                        if (resp[1].data.status === "Success") {

                            // ROS
                            $scope.IntraOpQuickSummaryObj.SurgicalHistory = angular.copy(resp[1].data.SurgicalHistory);
                            $scope.IntraOpQuickSummaryObj.SystemicHistory = angular.copy(resp[1].data.SystemicHistory);
                            $scope.IntraOpQuickSummaryObj.AllergyItems = angular.copy(resp[1].data.AllergyItems);
                            $scope.IntraOpQuickSummaryObj.PreOpMedications = angular.copy(resp[1].data.PreOpMedications) || [];

                            $scope.IntraOpQuickSummaryObj.PatientStableSurgery = resp[1].data.PatientStableSurgery || false;
                            $scope.IntraOpQuickSummaryObj.AdequatePreoperativeWorkup = resp[1].data.AdequatePreoperativeWorkup || false;
                            $scope.IntraOpQuickSummaryObj.Pathology = resp[1].data.Pathology || "";

                            if ($scope.IntraOpQuickSummaryObj.PreOpMedications.length > 0) {
                                angular.forEach($scope.IntraOpQuickSummaryObj.PreOpMedications, function (item) {
                                    angular.forEach(item.DropTimings, function (kitem) {
                                        if (kitem.GivenBy != null) {
                                            let GivenByname = '';
                                            var Arraylist = $filter("filter")($scope.allUserList, function (pitem) { return pitem.DoctorID == kitem.GivenBy }, true) || [];
                                            if (Arraylist.length > 0) {
                                                GivenByname = Arraylist[0].FirstName + ' ' + Arraylist[0].LastName + ' ' + Arraylist[0].SuffixName
                                                kitem.GivenByname = GivenByname;
                                            }
                                        }
                                    });
                                });
                            }

                            if (resp[1].data.CurrentEyeMedicationList.length > 0) {
                                $scope.IntraOpQuickSummaryObj.CurrentEyeMedications = angular.copy(resp[1].data.CurrentEyeMedicationList);
                            }

                            if (resp[1].data.CurrentSystemicMedicationList.length > 0) {
                                $scope.IntraOpQuickSummaryObj.CurrentSystemicMedicationsHistory = angular.copy(resp[1].data.CurrentSystemicMedicationList);
                            }


                            $scope.IntraOpQuickSummaryObj.SurgeryList = angular.copy(resp[1].data.SurgeryList);


                            resp[1].data.Diagnosis = resp[1].data.Diagnosis || [];
                            if (resp[1].data.Diagnosis.length > 0) {
                                $scope.IntraOpQuickSummaryObj.Diagnosis = angular.copy(resp[1].data.Diagnosis);
                                $scope.IntraOpQuickSummaryObj.IsIntraOpDiagnosisInd = true;
                            } else {
                                $scope.IntraOpQuickSummaryObj.Diagnosis = [];
                                $scope.IntraOpQuickSummaryObj.IsIntraOpDiagnosisInd = false;
                            }

                            $scope.PostOpQuickSummaryObj.Diagnosis = angular.copy(resp[1].data.Diagnosis);

                            if (resp[1].data.Prescription.length > 0) {
                                $scope.IntraOpQuickSummaryObj.PrescriptionDetails = angular.copy(resp[1].data.Prescription);
                            } else {
                                $scope.IntraOpQuickSummaryObj.PrescriptionDetails = [];
                            }

                            $scope.IntraOpQuickSummaryObj.MedicineOrdersInstructions = resp[1].data.MedicineOrdersInstructions || '';
                            if (resp[1].data.InvestigationsList.length > 0) {
                                $scope.IntraOpQuickSummaryObj.InvestigationsList = angular.copy(resp[1].data.InvestigationsList);
                            } else {
                                $scope.IntraOpQuickSummaryObj.InvestigationsList = [];
                            }

                            if (resp[1].data.rows.length > 0) {
                                $scope.IntraOpQuickSummaryObj.PhacoMachines = resp[1].data.rows[0].PhacoMachines || [];
                                if ($scope.IntraOpQuickSummaryObj.PhacoMachines.length > 0) {
                                    angular.forEach($scope.IntraOpQuickSummaryObj.PhacoMachines, function (item) {
                                        item.EquipmentName = item.EquipmentName || '';
                                    });
                                }
                                $scope.IntraOpQuickSummaryObj.SurgicalSuplyId = resp[1].data.rows[0].SurgicalSuplyId || null;
                                $scope.IntraOpQuickSummaryObj.SurgicalSupplyName = resp[1].data.rows[0].SurgicalSupplyName || null;

                                $scope.IntraOpQuickSummaryObj.PatientTransferNotes = resp[1].data.rows[0].PatientTransferNotes || "";
                                $scope.IntraOpQuickSummaryObj.PatientTransferType = resp[1].data.rows[0].PatientTransferType || "";

                                $scope.IntraOpQuickSummaryObj.LotNumber = resp[1].data.rows[0].LotNumber || null;
                                $scope.IntraOpQuickSummaryObj.ExpirationDate = resp[1].data.rows[0].ExpirationDate || null;
                                if ($scope.IntraOpQuickSummaryObj.ExpirationDate != null) {
                                    $scope.IntraOpQuickSummaryObj.ExpirationDate = $filter('date')($scope.IntraOpQuickSummaryObj.ExpirationDate, "MM-dd-yyyy");
                                }
                            }

                            $scope.IntraOpQuickSummaryObj.PatientAlert = resp[1].data.PatientAlert || false;
                            $scope.IntraOpQuickSummaryObj.VitalsType = resp[1].data.VitalsType || "";
                            $scope.IntraOpQuickSummaryObj.VitalsStatus = resp[1].data.VitalsStatus || null;
                            $scope.IntraOpQuickSummaryObj.LastSignOffUserDetails = angular.copy(resp[1].data.LastSignOffUserDetails) || [];

                            $scope.IntraOpQuickSummaryObj.PreOpHandOffTime = resp[1].data.PreOpHandOffTime || "";
                            $scope.IntraOpQuickSummaryObj.PreOpHandoffRemarks = resp[1].data.PreOpHandoffRemarks || "";
                            $scope.IntraOpQuickSummaryObj.PatientStableSurgery = resp[1].data.PatientStableSurgery || false;
                            $scope.IntraOpQuickSummaryObj.AdequatePreoperativeWorkup = resp[1].data.AdequatePreoperativeWorkup || false;

                            $scope.ImplantsDetailsArray = [];
                            $scope.IntraOpQuickSummaryObj.EquipmentList = [];
                            if (resp[1].data.rows.length > 0) {

                                $scope.IntraOpQuickSummaryObj.BeforeORReviewedDateTime = $filter('date')(resp[1].data.rows[0].BeforeORReviewedDateTime, 'MM-dd-yyyy hh:mm a') || null;
                                $scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedDateTime = $filter('date')(resp[1].data.rows[0].BeforeIncisionReviewedDateTime, 'MM-dd-yyyy hh:mm a') || null;
                                $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedDateTime = $filter('date')(resp[1].data.rows[0].BeforeAnesthesiaReviewedDateTime, 'MM-dd-yyyy hh:mm a') || null;

                                $scope.IntraOpQuickSummaryObj.NurseReviewedDate = $filter('date')(resp[1].data.rows[0].NurseReviewedDate, 'MM-dd-yyyy hh:mm a') || null;
                                $scope.IntraOpQuickSummaryObj.AnesthesiologistReviewedDate = $filter('date')(resp[1].data.rows[0].AnesthesiologistReviewedDate, 'MM-dd-yyyy hh:mm a') || null;

                                $scope.IntraOpQuickSummaryObj.TechnicianReviewedDate = $filter('date')(resp[1].data.rows[0].TechnicianReviewedDate, 'MM-dd-yyyy hh:mm a') || null;

                                $scope.IntraOpQuickSummaryObj.Ordersobj.PatientAscInjections = angular.copy(resp[1].data.rows[0].PatientAscInjections) || [];
                                $scope.IntraOpQuickSummaryObj.Ordersobj.PatientAscEyeDrops = angular.copy(resp[1].data.rows[0].PatientAscEyeDrops) || [];
                                $scope.ImplantsDetailsArray = angular.copy(resp[1].data.rows[0].ImplantsDetailsArray) || [];
                                $scope.IntraOpQuickSummaryObj.OthersDetailsArray = angular.copy(resp[1].data.rows[0].OthersDetailsArray) || [];
                                $scope.IntraOpQuickSummaryObj.EquipmentList = angular.copy(resp[1].data.rows[0].EquipmentList) || [];

                                if (resp[1].data.rows[0].VitalsArray.length > 0) {
                                    angular.forEach(resp[1].data.rows[0].VitalsArray, function (item) {
                                        var vitalslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
                                        if (vitalslist.length > 0) {
                                            item.UserName = angular.copy(vitalslist[0].FullName);
                                        }
                                        let ndate = moment().format("YYYY-MM-DD");
                                        let edate = ndate + " " + item.VitalAddTime;
                                        item.VitalAddTime = moment(edate, "YYYY-MM-DD hh:mm:ss").format("hh:mm a");
                                    });

                                    $scope.IntraOpQuickSummaryObj.Vitals = angular.copy(resp[1].data.rows[0].VitalsArray);
                                }

                                if (resp[1].data.rows[0].PatientAscChecklist.length > 0) {
                                    //$scope.AllIntraOpChecklistsArray = angular.copy(resp[4].data.rows[0].PatientAscChecklist)||[];
                                    angular.forEach(resp[1].data.rows[0].PatientAscChecklist, function (item) {
                                        angular.forEach($scope.IntraOpQuickSummaryObj.AllIntraOpChecklistsArray, function (kitem) {
                                            if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                                if (kitem.CheckListId === item.CheckListId) {
                                                    kitem.IsChecked = true;
                                                    kitem.Score = item.Score || 0;
                                                    kitem.Value = item.Value || '';
                                                    kitem.Remarks = item.Remarks || '';
                                                    if (kitem.Remarks !== '') {
                                                        kitem.intranotes1 = true;
                                                    }
                                                    if (item.AscMultiCheckValueArray.length == 0 && kitem.CheckListId == 180) {
                                                        kitem.IsChecked = false;
                                                        kitem.Value = '';
                                                    }
                                                    kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                                    if (item.SubCheckList.length > 0) {
                                                        angular.forEach(item.SubCheckList, function (jitem) {
                                                            angular.forEach(kitem.SubCheckList, function (hitem) {
                                                                if (hitem.SubCheckListId == jitem.SubCheckListId) {
                                                                    hitem.IsChecked = true;
                                                                    hitem.PatientAscSubCheckListId = jitem.PatientAscSubCheckListId || null;
                                                                }
                                                            });
                                                        });
                                                    }
                                                    if (item.CheckListId == 180 || item.CheckListId == 178 || item.CheckListId == 179 || item.CheckListCode == 336) {
                                                        if (item.AscMultiCheckValueArray.length > 0) {
                                                            angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                                angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                                                                    if (hitem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                                        hitem.IsChecked = true;
                                                                        hitem.PatientMultiCheckListId = jitem.PatientMultiCheckListId || null;
                                                                    }
                                                                });
                                                            });
                                                        } else {
                                                            kitem.IsChecked = false;
                                                        }

                                                    } else {
                                                        if (kitem.OrganizationCheckListDetails.length > 0) {
                                                            angular.forEach(kitem.OrganizationCheckListDetails, function (Gitem) {
                                                                Gitem.IsChecked = false;
                                                                if (item.Value == Gitem.Value) {
                                                                    Gitem.IsChecked = true;
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    });
                                }

                                $scope.IntraOpQuickSummaryObj.IntraOpNurseChartStatus = resp[1].data.rows[0].IntraOpNurseChartStatus || '';
                                $scope.IntraOpQuickSummaryObj.IntraOpAnesthesiaChartStatus = resp[1].data.rows[0].IntraOpAnesthesiaChartStatus || '';
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.RiskLevel = resp[1].data.rows[0].NurseActions.RiskLevel || '';

                                $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFireRiskID = resp[1].data.rows[0].NurseActions.NurseFireRiskID || 0;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFireRiskName = resp[1].data.rows[0].NurseActions.NurseFireRiskName || '';
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFireRiskLicenseNo = resp[1].data.rows[0].NurseActions.NurseFireRiskLicenseNo || '';
                                if (resp[1].data.rows[0].NurseActions.NurseFireRiskReviewdDate != "") {
                                    var NurseFireRiskReviewdDate = resp[1].data.rows[0].NurseActions.NurseFireRiskReviewdDate || "";
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFireRiskReviewdDate = $filter('date')(NurseFireRiskReviewdDate, 'MM-dd-yyyy hh:mm a') || '';
                                }
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFallRiskID = resp[1].data.rows[0].NurseActions.NurseFallRiskID || 0;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFallRiskName = resp[1].data.rows[0].NurseActions.NurseFallRiskName || '';
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFallRiskLicenseNo = resp[1].data.rows[0].NurseActions.NurseFallRiskLicenseNo || '';
                                if (resp[1].data.rows[0].NurseActions.NurseFallRiskReviewdDate != "") {
                                    var NurseFallRiskReviewdDate = resp[1].data.rows[0].NurseActions.NurseFallRiskReviewdDate || "";
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFallRiskReviewdDate = $filter('date')(NurseFallRiskReviewdDate, 'MM-dd-yyyy hh:mm a') || '';
                                }
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.DoctorFireRiskID = resp[1].data.rows[0].NurseActions.DoctorFireRiskID || 0;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.DoctorFireRiskName = resp[1].data.rows[0].NurseActions.DoctorFireRiskName || '';
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.DoctorFireRiskLicenseNo = resp[1].data.rows[0].NurseActions.DoctorFireRiskLicenseNo || '';
                                if (resp[1].data.rows[0].NurseActions.DoctorReviewdDate != "") {
                                    var DoctorReviewdDate = resp[1].data.rows[0].NurseActions.DoctorReviewdDate || "";
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.DoctorReviewdDate = $filter('date')(DoctorReviewdDate, 'MM-dd-yyyy hh:mm a') || '';
                                }
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthetistFireRiskID = resp[1].data.rows[0].NurseActions.AnesthetistFireRiskID || 0;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthetistFireRiskName = resp[1].data.rows[0].NurseActions.AnesthetistFireRiskName || '';
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthetistFireRiskLicenseNo = resp[1].data.rows[0].NurseActions.AnesthetistFireRiskLicenseNo || '';
                                if (resp[1].data.rows[0].NurseActions.AnesthetistReviewdDate != "") {
                                    var AnesthetistReviewdDate = resp[1].data.rows[0].NurseActions.AnesthetistReviewdDate || "";
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthetistReviewdDate = $filter('date')(AnesthetistReviewdDate, 'MM-dd-yyyy hh:mm a') || '';
                                }

                                $scope.IntraOpQuickSummaryObj.NurseActionobj.FallRiskAssessmentTotalScore = resp[1].data.rows[0].NurseActions.FallRiskAssessmentTotalScore || '';
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.FallRiskLevel = resp[1].data.rows[0].NurseActions.FallRiskLevel || '';
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.ImplementedFallRiskProtocoltype = resp[1].data.rows[0].NurseActions.ImplementedFallRiskProtocoltype || '';
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.ImplementedFallRiskProtocol = resp[1].data.rows[0].NurseActions.ImplementedFallRiskProtocol || false;

                                $scope.IntraOpQuickSummaryObj.PatientAscChecklist = resp[1].data.rows[0].PatientAscChecklist || [];

                                $scope.IntraOpQuickSummaryObj.NurseActionobj.ChecklistRemarks = resp[1].data.rows[0].NurseActions.ChecklistRemarks || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.Levelofconsciousness = resp[1].data.rows[0].NurseActions.Levelofconsciousness || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.LevelofconsciousnessNotes = resp[1].data.rows[0].NurseActions.LevelofconsciousnessNotes || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientPosition = resp[1].data.rows[0].NurseActions.PatientPosition || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientPositionNotes = resp[1].data.rows[0].NurseActions.PatientPositionNotes || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SkinPreparation = resp[1].data.rows[0].NurseActions.SkinPreparation || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SkinPreparationNotes = resp[1].data.rows[0].NurseActions.SkinPreparationNotes || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.Sterilewater = resp[1].data.rows[0].NurseActions.Sterilewater || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.Alcohol = resp[1].data.rows[0].NurseActions.Alcohol || "";


                                $scope.IntraOpQuickSummaryObj.NurseActionobj.EspecimenLabNotes = resp[1].data.rows[0].NurseActions.EspecimenLabNotes || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.AreaNotes = resp[1].data.rows[0].NurseActions.AreaNotes || "";

                                $scope.IntraOpQuickSummaryObj.NurseActionobj.AdditionalStaffId = resp[1].data.rows[0].NurseActions.AdditionalStaffId || null;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.EspecimenLab = resp[1].data.rows[0].NurseActions.EspecimenLab || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionOrganId = resp[1].data.rows[0].NurseActions.NurseActionOrganId || null;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionArea = resp[1].data.rows[0].NurseActions.NurseActionArea || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonId = resp[1].data.rows[0].NurseActions.SurgeonId || null;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.TechnicianId = resp[1].data.rows[0].NurseActions.TechnicianId || null;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistId = resp[1].data.rows[0].NurseActions.AnesthesistId || null;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStaffAnesthesistId = resp[1].data.rows[0].NurseActions.SurgeryStaffAnesthesistId || null;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.ReliefId = resp[1].data.rows[0].NurseActions.ReliefId || null;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseId = resp[1].data.rows[0].NurseActions.NurseId || null;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonId = resp[1].data.rows[0].NurseActions.CoSurgeonId || null;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SupportingStaffId = resp[1].data.rows[0].NurseActions.SupportingStaffId || null;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.CropHour = resp[1].data.rows[0].NurseActions.CropHour || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryRoomNo = resp[1].data.rows[0].NurseActions.SurgeryRoomNo || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime = resp[1].data.rows[0].NurseActions.HallEntranceStartTime || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime = resp[1].data.rows[0].NurseActions.HallEntranceEndTime || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime = resp[1].data.rows[0].NurseActions.AnesthesiaStartTime || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime = resp[1].data.rows[0].NurseActions.AnesthesiaEndTime || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime = resp[1].data.rows[0].NurseActions.SurgeryStartTime || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime = resp[1].data.rows[0].NurseActions.SurgeryEndTime || "";

                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstNeedles = resp[1].data.rows[0].NurseActions.SurgicalFirstNeedles || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstBlades = resp[1].data.rows[0].NurseActions.SurgicalFirstBlades || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstOthers = resp[1].data.rows[0].NurseActions.SurgicalFirstOthers || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime = resp[1].data.rows[0].NurseActions.SurgicalFirstTime || "";

                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondNeedles = resp[1].data.rows[0].NurseActions.SurgicalSecondNeedles || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondBlades = resp[1].data.rows[0].NurseActions.SurgicalSecondBlades || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondOthers = resp[1].data.rows[0].NurseActions.SurgicalSecondOthers || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime = resp[1].data.rows[0].NurseActions.SurgicalSecondTime || "";

                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalNeedles = resp[1].data.rows[0].NurseActions.SurgicalFinalNeedles || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalBlades = resp[1].data.rows[0].NurseActions.SurgicalFinalBlades || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalOthers = resp[1].data.rows[0].NurseActions.SurgicalFinalOthers || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime = resp[1].data.rows[0].NurseActions.SurgicalFinalTime || "";


                                resp[1].data.rows[0].NurseActions.SafetyDevicePosition = resp[1].data.rows[0].NurseActions.SafetyDevicePosition || "";
                                if (resp[1].data.rows[0].NurseActions.SafetyDevicePosition != "") {
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.ArmsToTheBody = resp[1].data.rows[0].NurseActions.SafetyDevicePosition.ArmsToTheBody || "";
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.Strap = resp[1].data.rows[0].NurseActions.SafetyDevicePosition.Strap || "";
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.AnotherRailing = resp[1].data.rows[0].NurseActions.SafetyDevicePosition.AnotherRailing || "";
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePositionNotes = resp[1].data.rows[0].NurseActions.SafetyDevicePositionNotes || "";
                                }

                                $scope.IntraOpQuickSummaryObj.NurseActionobj.HydrationIV = resp[1].data.rows[0].NurseActions.HydrationIV || false;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.Cleansed = resp[1].data.rows[0].NurseActions.Cleansed || false;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.CleanContaminated = resp[1].data.rows[0].NurseActions.CleanContaminated || false;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.Dirty = resp[1].data.rows[0].NurseActions.Dirty || false;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.Contaminated = resp[1].data.rows[0].NurseActions.Contaminated || false;

                                $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientTolerated = resp[1].data.rows[0].NurseActions.PatientTolerated || false;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.Disposition = resp[1].data.rows[0].NurseActions.Disposition || false;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.CarePostoperative = resp[1].data.rows[0].NurseActions.CarePostoperative || false;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.Recoveryroom = resp[1].data.rows[0].NurseActions.Recoveryroom || false;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.OthersIntraData = resp[1].data.rows[0].NurseActions.OthersIntraData || '';

                                $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime = resp[1].data.rows[0].NurseActions.HallEntranceStartTime || "";
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientReceivedById = resp[1].data.rows[0].NurseActions.PatientReceivedById || null;
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientReceivedByName = resp[1].data.rows[0].NurseActions.PatientReceivedByName || "";
                                $scope.IntraOpQuickSummaryObj.HandoffRemarks = resp[1].data.rows[0].HandoffRemarks || "";
                                $scope.IntraOpQuickSummaryObj.HandOffTime = resp[1].data.rows[0].HandOffTime || "";
                                $scope.IntraOpQuickSummaryObj.HandOffReviewedBy = resp[1].data.rows[0].HandOffReviewedBy || null;
                                $scope.IntraOpQuickSummaryObj.HandOffReviewedByName = resp[1].data.rows[0].HandOffReviewedByName || '';
                                $scope.IntraOpQuickSummaryObj.HandOffFromReviewedByName = resp[1].data.rows[0].HandOffFromReviewedByName || '';

                                $scope.IntraOpQuickSummaryObj.AnesthesiaTypelist = resp[1].data.rows[0].AnesthesiaTypelist || [];
                                $scope.IntraOpQuickSummaryObj.EBLValue = resp[1].data.rows[0].AnesthetistActions.EBLValue || "";
                                $scope.IntraOpQuickSummaryObj.IntakeValue = resp[1].data.rows[0].AnesthetistActions.IntakeValue || "";
                                $scope.IntraOpQuickSummaryObj.OutputValue = resp[1].data.rows[0].AnesthetistActions.OutputValue || "";
                                $scope.IntraOpQuickSummaryObj.InTime = resp[1].data.rows[0].AnesthetistActions.InTime || "";
                                $scope.IntraOpQuickSummaryObj.OutTime = resp[1].data.rows[0].AnesthetistActions.OutTime || "";
                                $scope.IntraOpQuickSummaryObj.AnesthesiaMedications = resp[1].data.rows[0].AnesthesiaMedications || [];
                                $scope.IntraOpQuickSummaryObj.IntraOpNotes = resp[1].data.rows[0].IntraOpNotes || null;
                                $scope.IntraOpQuickSummaryObj.IntraOpNurseNotes = resp[1].data.rows[0].IntraOpNurseNotes || "";


                                if ($scope.IntraOpQuickSummaryObj.AnesthesiaMedications.length > 0) {
                                    angular.forEach($scope.IntraOpQuickSummaryObj.AnesthesiaMedications, function (item) {
                                        angular.forEach(item.DropTimings, function (kitem) {
                                            if (kitem.GivenBy != null) {
                                                let GivenByname = '';
                                                var Arraylist = $filter("filter")($scope.allUserList, function (pitem) { return pitem.DoctorID == kitem.GivenBy }, true) || [];
                                                if (Arraylist.length > 0) {
                                                    GivenByname = Arraylist[0].FirstName + ' ' + Arraylist[0].LastName + ' ' + Arraylist[0].SuffixName
                                                    kitem.GivenByname = GivenByname;
                                                }
                                            }
                                        });
                                    });
                                }


                                $scope.IntraOpQuickSummaryObj.NurseActionobj.CauteraisationOthers = resp[1].data.rows[0].NurseActions.CauteraisationOthers || "";
                                //$scope.IntraOpQuickSummaryObj.Pathology = resp[1].data.rows[0].Pathology || "";

                                if ($scope.IntraOpQuickSummaryObj.IntraOpNotes == null && $scope.IntraOpQuickSummaryObj.VitalsType == "" && $scope.IntraOpQuickSummaryObj.PatientTransferType == "") {
                                    $scope.IntraOpQuickSummaryObj.handOffNotesInd = false;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.handOffNotesInd = true;
                                }

                                // CDE //
                                $scope.IntraOpQuickSummaryObj.CDEOD = resp[1].data.rows[0].CDEOD || "";
                                $scope.IntraOpQuickSummaryObj.CDEOS = resp[1].data.rows[0].CDEOS || "";
                                $scope.IntraOpQuickSummaryObj.CDERemarks = resp[1].data.rows[0].CDERemarks || "";

                                if ($scope.IntraOpQuickSummaryObj.CDEOD != '' || $scope.IntraOpQuickSummaryObj.CDEOS != '' || $scope.IntraOpQuickSummaryObj.CDERemarks != '') {
                                    $scope.IntraOpQuickSummaryObj.IsCDEInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsCDEInd = false;
                                }
                                //CDE//




                                if (resp[1].data.rows[0].SubOrganList.length > 0) {
                                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionArea == 'Lids') {
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SubOrganLidsList = resp[1].data.rows[0].SubOrganList;
                                    }
                                    else if ($scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionArea == 'Conjunctiva') {
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SubOrganConjunctivaList = resp[1].data.rows[0].SubOrganList;
                                    }
                                }
                                let ndate = moment().format("YYYY-MM-DD");

                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime != '') {
                                    let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime;
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                                }

                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime != '') {
                                    let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime;
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                                }

                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime != '') {

                                    let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime;
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                                }
                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime != '') {

                                    let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime;
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                                }
                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime != '') {

                                    let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime;
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                                }
                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime != '') {

                                    let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime;
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                                }


                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime != '') {

                                    let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime;
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                                }
                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime != '') {

                                    let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime;
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                                }
                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime != '') {

                                    let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime;
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                                }
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.DrainageOthers = resp[1].data.rows[0].NurseActions.DrainageOthers || "";

                                if (resp[1].data.rows[0].Cauteraisation.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Cauteraisation = resp[1].data.rows[0].Cauteraisation;
                                }
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.Cauteraisation = $filter("filter")($scope.IntraOpQuickSummaryObj.NurseActionobj.Cauteraisation, { "IsChecked": true }, true) || [];

                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.Cauteraisation.length > 0 || $scope.IntraOpQuickSummaryObj.NurseActionobj.CauteraisationOthers != '') {
                                    $scope.IntraOpQuickSummaryObj.IsIntraCauteraisationInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraCauteraisationInd = false;
                                }

                                var Nurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == resp[1].data.rows[0].NurseActions.SurgicalFirstVerifiedBy }, true);
                                Nurselist = Nurselist || [];
                                if (Nurselist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstVerifiedByName = angular.copy(Nurselist[0].FullName);
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalFirstVerifiedBy;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstVerifiedByName = '';
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalFirstVerifiedBy || '';
                                }

                                var SNurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == resp[1].data.rows[0].NurseActions.SurgicalSecondVerifiedBy }, true);
                                SNurselist = SNurselist || [];
                                if (SNurselist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondVerifiedByName = angular.copy(SNurselist[0].FullName);
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalSecondVerifiedBy;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondVerifiedByName = '';
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalSecondVerifiedBy || '';
                                }

                                var FNurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == resp[1].data.rows[0].NurseActions.SurgicalFinalVerifiedBy }, true);
                                FNurselist = FNurselist || [];
                                if (FNurselist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalVerifiedByName = angular.copy(FNurselist[0].FullName);
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalFinalVerifiedBy;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalVerifiedByName = '';
                                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalFinalVerifiedBy || '';
                                }


                                $scope.IntraOpQuickSummaryObj.AnesthesiaReviewedBy = resp[1].data.rows[0].AnesthesiaReviewedBy || null;
                                if ($scope.IntraOpQuickSummaryObj.AnesthesiaReviewedBy != null) {
                                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.IntraOpQuickSummaryObj.AnesthesiaReviewedBy });
                                    if (ReviewedByArraylist.length > 0) {
                                        $scope.IntraOpQuickSummaryObj.AnesthesiaReviewedByName = angular.copy(ReviewedByArraylist[0].FullName);
                                    }
                                }

                                $scope.IntraOpQuickSummaryObj.CheckinCheckReviewedBy = resp[1].data.rows[0].CheckinCheckReviewedBy || null;
                                if ($scope.IntraOpQuickSummaryObj.CheckinCheckReviewedBy != null) {
                                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.IntraOpQuickSummaryObj.CheckinCheckReviewedBy });
                                    if (ReviewedByArraylist.length > 0) {
                                        $scope.IntraOpQuickSummaryObj.CheckinCheckReviewedByName = angular.copy(ReviewedByArraylist[0].FullName);
                                    }

                                }

                                //$scope.IntraOpQuickSummaryObj.IntraOpMedications = resp[1].data.rows[0].IntraOpMedications || [];

                                if (resp[1].data.rows[0].OrderDetails.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.OrderDetails = resp[1].data.rows[0].OrderDetails || [];
                                    angular.forEach($scope.IntraOpQuickSummaryObj.OrderDetails, function (Mitem) {
                                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                        Mitem.UserOrderId = Mitem.UserOrderId || null;
                                        Mitem.UserType = Mitem.UserType || null;
                                        Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                        Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                        Mitem.LicenseNumber = Mitem.LicenseNumber || '';
                                        Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                                        if (Mitem.IntraOpMedications.length > 0) {
                                            if (Mitem.IntraOpMedications.length > 0) {
                                                angular.forEach(Mitem.IntraOpMedications, function (item) {
                                                    if (Mitem.MedTypeId == 4) {
                                                        var dateTimeString = Mitem.ModifiedDt;
                                                        $scope.ModifiedIntraopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                                    } else {
                                                        var dateTimeString = Mitem.ModifiedDt;
                                                        $scope.ModifiedAnesthesiaDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                                    }
                                                });
                                            }

                                            $scope.IntraOpQuickSummaryObj.IntraOpMedications = resp[1].data.rows[0].IntraOpMedications || [];
                                            if ($scope.IntraOpQuickSummaryObj.IntraOpMedications.length > 0) {
                                                angular.forEach($scope.IntraOpQuickSummaryObj.IntraOpMedications, function (item) {
                                                    angular.forEach(item.DropTimings, function (kitem) {
                                                        if (kitem.GivenBy != null) {
                                                            let GivenByname = '';
                                                            var Arraylist = $filter("filter")($scope.allUserList, function (pitem) { return pitem.DoctorID == kitem.GivenBy }, true) || [];
                                                            if (Arraylist.length > 0) {
                                                                GivenByname = Arraylist[0].FirstName + ' ' + Arraylist[0].LastName + ' ' + Arraylist[0].SuffixName
                                                                kitem.GivenByname = GivenByname;
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                        }
                                    });

                                }


                                angular.forEach($scope.allUserList, function (item) {

                                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonId == item.DoctorID) {
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName = item.UserFullName;

                                        var License = '';
                                        //var Suffix = '';
                                        //if (item.SuffixName !== '') {
                                        //    Suffix = item.SuffixName + ',';
                                        //}
                                        if (item.LicenseNumber !== '') {
                                            License = 'Lic: ' + item.LicenseNumber;
                                        }

                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName = $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName + ' ' + License;
                                        //if (item.SuffixId == 10) {
                                        //    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName + ' ' + Suffix + ' ' + License;
                                        //} else {
                                        //    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName = $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName + ' ' + Suffix + ' ' + License;
                                        //}
                                    }
                                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.TechnicianId == item.DoctorID) {
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.TechnicianName = item.UserFullName;
                                    }
                                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistId == item.DoctorID) {
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName = item.UserFullName;

                                        var License = '';
                                        //var Suffix = '';
                                        //if (item.SuffixName !== '') {
                                        //    Suffix = item.SuffixName + ',';
                                        //}
                                        if (item.LicenseNumber !== '') {
                                            License = 'Lic: ' + item.LicenseNumber;
                                        }

                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName = $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName + ' ' + License;
                                        //if (item.SuffixId == 10) {
                                        //    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName + ' ' + Suffix + ' ' + License;
                                        //} else {
                                        //    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName = $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName + ' ' + Suffix + ' ' + License;
                                        //}
                                    }
                                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.NurseId == item.DoctorID) {
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseName = item.UserFullName;
                                    }
                                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AdditionalStaffId == item.DoctorID) {
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.AdditionalStaffName = item.FullName;
                                    }

                                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStaffAnesthesistId == item.DoctorID) {
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStaffAnesthesistName = item.UserFullName;
                                        var License = '';

                                        if (item.LicenseNumber !== '') {
                                            License = 'Lic: ' + item.LicenseNumber;
                                        }
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStaffAnesthesistName = $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStaffAnesthesistName + ' ' + License;

                                    }


                                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonId == item.DoctorID) {
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName = item.UserFullName;
                                        var License = '';
                                        //var Suffix = '';
                                        //if (item.SuffixName !== '') {
                                        //    Suffix = item.SuffixName + ',';
                                        //}
                                        if (item.LicenseNumber !== '') {
                                            License = 'Lic: ' + item.LicenseNumber;
                                        }

                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName = $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName + ' ' + License;
                                        //if (item.SuffixId == 10) {
                                        //    $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName + ' ' + Suffix + ' ' + License;
                                        //} else {
                                        //    $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName = $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName + ' ' + Suffix + ' ' + License;
                                        //}
                                    }
                                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.ReliefId == item.DoctorID) {
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.ReliefName = item.FullName;
                                    }
                                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SupportingStaffId == item.DoctorID) {
                                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SupportingStaffName = item.FullName;
                                    }
                                });

                                $scope.ModifiedAnesthesiaDate = "";
                                $scope.ModifiedIntraopDate = "";

                                //if ($scope.IntraOpQuickSummaryObj.AnesthesiaMedications.length > 0) {
                                //    angular.forEach($scope.IntraOpQuickSummaryObj.AnesthesiaMedications, function (hitem) {
                                //        var dateTimeString = hitem.ModifiedDt;
                                //        $scope.ModifiedAnesthesiaDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                //    });
                                //}
                                //if ($scope.IntraOpQuickSummaryObj.IntraOpMedications.length > 0) {
                                //    angular.forEach($scope.IntraOpQuickSummaryObj.IntraOpMedications, function (hitem) {
                                //        var dateTimeString = hitem.ModifiedDt;
                                //        $scope.ModifiedIntraopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                //    });
                                //}

                                let nurselist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 5 }, true);
                                if (nurselist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraProcedureInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraProcedureInd = false;
                                }

                                let anticipationlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 6 }, true);
                                if (anticipationlist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAnticipationOfCriticalInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAnticipationOfCriticalInd = false;
                                }

                                let timeoutlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 7 }, true);
                                if (timeoutlist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseTimeOutStopBeforeInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseTimeOutStopBeforeInd = false;
                                }

                                let antibioticlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 8 }, true);
                                if (antibioticlist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAntibioticProphylaxisInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAntibioticProphylaxisInd = false;
                                }

                                let otherslist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 9 }, true);
                                if (otherslist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraOthersInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraOthersInd = false;
                                }

                                let identificationlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 10 }, true);
                                if (identificationlist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistIdentificationOfPatientsInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistIdentificationOfPatientsInd = false;
                                }

                                let insertionlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 11 }, true);
                                if (insertionlist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMarkOfPreviouslyInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMarkOfPreviouslyInd = false;
                                }

                                let preprocedurelist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 12 }, true);
                                if (preprocedurelist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPreprocedurereqInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPreprocedurereqInd = false;
                                }

                                let patienthaslist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 13 }, true);
                                if (patienthaslist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPatientHasInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPatientHasInd = false;
                                }

                                let implantlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 14 }, true);
                                if (implantlist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistImplantInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistImplantInd = false;
                                }

                                let monitorslist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 15 }, true);
                                if (monitorslist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMonitorsInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMonitorsInd = false;
                                }

                                let Anesthesiacheck = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 16 }, true);
                                if (Anesthesiacheck.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthesiacheckInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthesiacheckInd = false;
                                }

                                let pulseOximeter = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 17 }, true);
                                if (pulseOximeter.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpPulseOximeterInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpPulseOximeterInd = false;
                                }

                                if ($scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraProcedureInd || $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAnticipationOfCriticalInd || $scope.IntraOpQuickSummaryObj.IsIntraOpNurseTimeOutStopBeforeInd || $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAntibioticProphylaxisInd || $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraOthersInd || $scope.IntraOpQuickSummaryObj.NurseActionobj.ChecklistRemarks != '') {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseMainInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseMainInd = false;
                                }

                                if ($scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistIdentificationOfPatientsInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMarkOfPreviouslyInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPreprocedurereqInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPatientHasInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistImplantInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMonitorsInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthesiacheckInd || $scope.IntraOpQuickSummaryObj.IsIntraOpPulseOximeterInd) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPreAnesthesiaInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPreAnesthesiaInd = false;
                                }

                                // Anesthetist Actions Graph

                                if (resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray.length > 0) {
                                    $scope.AnesthetistVitals = angular.copy($scope.GetAnesthetistVitals());
                                    angular.forEach(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, function (item) {
                                        angular.forEach($scope.AnesthetistVitals, function (kitem) {
                                            if (kitem.Id === 1 && kitem.Id === item.VitalId) {
                                                let obj = {
                                                    "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                                    "VitalName": "Systolic Pressure",
                                                    "MainId": 1,
                                                    "Value": item.Value,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                };
                                                kitem.VitalReadingList.push(obj);
                                            }

                                            if (kitem.Id === 2 && kitem.Id === item.VitalId) {
                                                let obj = {
                                                    "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                                    "VitalName": "Diastolic Pressure",
                                                    "MainId": 2,
                                                    "Value": item.Value,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                };
                                                kitem.VitalReadingList.push(obj);
                                            }

                                            if (kitem.Id === 3 && kitem.Id === item.VitalId) {
                                                let obj = {
                                                    "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                                    "VitalName": "Pulse",
                                                    "MainId": 3,
                                                    "Value": item.Value,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                };
                                                kitem.VitalReadingList.push(obj);
                                            }

                                            if (kitem.Id === 4 && kitem.Id === item.VitalId) {
                                                let obj = {
                                                    "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                                    "VitalName": "Resp.Rate",
                                                    "MainId": 4,
                                                    "Value": item.Value,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                };
                                                kitem.VitalReadingList.push(obj);
                                            }

                                            if (kitem.Id === 6 && kitem.Id === item.VitalId) {
                                                let obj = {
                                                    "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                                    "VitalName": "O2 Saturation",
                                                    "MainId": 6,
                                                    "Value": item.Value,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                };
                                                kitem.VitalReadingList.push(obj);
                                            }

                                            if (kitem.Id === 7 && kitem.Id === item.VitalId) {
                                                let obj = {
                                                    "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                                    "VitalName": "EKG Lead 2",
                                                    "MainId": 7,
                                                    "Value": item.Value,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                };
                                                kitem.VitalReadingList.push(obj);
                                            }

                                            if (kitem.Id === 8 && kitem.Id === item.VitalId) {
                                                let obj = {
                                                    "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                                    "VitalName": "ETCO2",
                                                    "MainId": 8,
                                                    "Value": item.Value,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                };
                                                kitem.VitalReadingList.push(obj);
                                            }
                                            if (kitem.Id === 9 && kitem.Id === item.VitalId) {
                                                let obj = {
                                                    "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                                    "VitalName": "Notes",
                                                    "MainId": 9,
                                                    "Value": item.Value,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                };
                                                kitem.VitalReadingList.push(obj);
                                            }
                                        });
                                    });

                                    $scope.NewTimeSlots = [];

                                    let tempArray = $filter('filter')($scope.AnesthetistVitals, { 'VitalName': 'Systolic Pressure' }, true);
                                    if (tempArray.length > 0) {
                                        if (tempArray[0].VitalReadingList.length > 0) {
                                            angular.forEach(tempArray[0].VitalReadingList, function (kitem) {
                                                //$scope.NewTimeSlots.push({ 'time': kitem.VitalSlotTime });
                                                kitem.DeleteInd = kitem.DeleteInd || 'N';
                                                if (kitem.DeleteInd == 'N') {
                                                    let dummydate = "2024-01-01";
                                                    let dummydatetime = dummydate + " " + kitem.VitalSlotTime;
                                                    let newtime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                                                    let tempArray = kitem.VitalSlotTime.split(":");
                                                    let stringCounter = tempArray.join("");
                                                    let counter = parseInt(stringCounter);
                                                    $scope.NewTimeSlots.push({ 'time': kitem.VitalSlotTime, 'NewTime': newtime, 'counter': counter });
                                                }
                                            });
                                        }
                                    }
                                }

                                $scope.AnesthetistVitals = $scope.AnesthetistVitals || [];
                                if ($scope.AnesthetistVitals.length > 0) {
                                    var count = 0;
                                    angular.forEach($scope.AnesthetistVitals, function (kitem) {
                                        if (kitem.VitalReadingList.length > 0) {
                                            count++;
                                        }
                                    });
                                    if (count == 0) {
                                        $scope.IntraOpQuickSummaryObj.IsIntraOPAnesthesiaActionVitalsArrayEmpty = true;
                                    }
                                }
                                // Anesthesia Medicines


                                var TempVitals1 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 1 }, true);
                                if (TempVitals1.length > 0) {
                                    if (TempVitals1[0].Value != "") {
                                        $scope.AnesthVitals.isSystolic = true;
                                    }


                                }
                                var TempVitals2 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 2 }, true);
                                if (TempVitals2.length > 0) {

                                    if (TempVitals2[0].Value != "") {
                                        $scope.AnesthVitals.isDiastolic = true;
                                    }

                                }
                                var TempVitals3 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 3 }, true);
                                if (TempVitals3.length > 0) {

                                    if (TempVitals3[0].Value != "") {
                                        $scope.AnesthVitals.isPulse = true;
                                    }
                                }
                                var TempVitals4 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 4 }, true);
                                if (TempVitals4.length > 0) {


                                    if (TempVitals4[0].Value != "") {
                                        $scope.AnesthVitals.isRespRate = true;
                                    }
                                }

                                var TempVitals5 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 6 }, true);
                                if (TempVitals5.length > 0) {


                                    if (TempVitals5[0].Value != "") {
                                        $scope.AnesthVitals.isO2Saturation = true;
                                    }
                                }

                                var TempVitals6 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 7 }, true);
                                if (TempVitals6.length > 0) {

                                    if (TempVitals6[0].Value != "") {
                                        $scope.AnesthVitals.isEKGLead = true;
                                    }
                                }

                                var TempVitals7 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 8 }, true);
                                if (TempVitals7.length > 0) {

                                    if (TempVitals7[0].Value != "") {
                                        $scope.AnesthVitals.isETCO2 = true;
                                    }
                                }

                                if ($scope.AnesthVitals.isSystolic == false && $scope.AnesthVitals.isETCO2 == false && $scope.AnesthVitals.isEKGLead == false && $scope.AnesthVitals.isO2Saturation == false && $scope.AnesthVitals.isDiastolic == false && $scope.AnesthVitals.isPulse == false && $scope.AnesthVitals.isRespRate == false) {
                                    $scope.AnesthVitals.isAllVitals = false;
                                } else {
                                    $scope.AnesthVitals.isAllVitals = true;
                                }

                                $scope.NewTimeSlots = $scope.NewTimeSlots || [];

                                if ($scope.IntraOpQuickSummaryObj.EBLValue == "" && $scope.IntraOpQuickSummaryObj.IntakeValue == "" && $scope.IntraOpQuickSummaryObj.OutputValue == "" && $scope.IntraOpQuickSummaryObj.OxygenQuantity == "" && $scope.IntraOpQuickSummaryObj.OxygenType == "" && $scope.IntraOpQuickSummaryObj.EndotrachealTubeNotes == "" && $scope.IntraOpQuickSummaryObj.LMANotes == "" &&
                                    $scope.NewTimeSlots.length == 0 && $scope.AnesthVitals.isAllVitals == false) {
                                    $scope.AnesthVitals.OverallNurseAction = false;
                                } else {
                                    $scope.AnesthVitals.OverallNurseAction = true;
                                }


                                if (resp[1].data.rows[0].AnesthetistActions.AnesthesiaMedicines.length > 0) {
                                    $scope.AnesthesiaMedicines = angular.copy(resp[1].data.rows[0].AnesthetistActions.AnesthesiaMedicines);
                                }

                                $scope.IntraOpQuickSummaryObj.OrdersReviewedDate = resp[1].data.rows[0].OrdersReviewedDate;
                                $scope.IntraOpQuickSummaryObj.OrdersReviewedTime = resp[1].data.rows[0].OrdersReviewedtime;
                                $scope.IntraOpQuickSummaryObj.DocumentDetails = angular.copy(resp[1].data.rows[0].DocumentDetails);

                                $scope.IntraOpQuickSummaryObj.SurgeonOperativeNotes = resp[1].data.rows[0].SurgeonOperativeNotes;
                                $scope.IntraOpQuickSummaryObj.Complications = resp[1].data.Complications || "";
                                $scope.IntraOpQuickSummaryObj.Findings = resp[1].data.rows[0].Findings;
                                //$scope.IntraOpQuickSummaryObj.MedicineOrdersInstructions = resp[1].data.rows[0].MedicineOrdersInstructions || "";
                                $scope.IntraOpQuickSummaryObj.S3URL = resp[1].data.rows[0].S3URL || "";

                                $scope.IntraOpQuickSummaryObj.ReviewDoctorId = resp[1].data.rows[0].ReviewDoctorId != null ? resp[1].data.rows[0].ReviewDoctorId : "";
                                $scope.IntraOpQuickSummaryObj.ReviewNurseId = resp[1].data.rows[0].ReviewNurseId != null ? resp[1].data.rows[0].ReviewNurseId : "";
                                $scope.IntraOpQuickSummaryObj.ReviewAnesthetistId = resp[1].data.rows[0].ReviewAnesthetistId != null ? resp[1].data.rows[0].ReviewAnesthetistId : "";
                                $scope.IntraOpQuickSummaryObj.ReviewTechnicianId = resp[1].data.rows[0].ReviewTechnicianId != null ? resp[1].data.rows[0].ReviewTechnicianId : "";
                                $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewId = resp[1].data.rows[0].AnesthesiaMedicationsReviewId != null ? resp[1].data.rows[0].AnesthesiaMedicationsReviewId : "";
                                $scope.IntraOpQuickSummaryObj.MedicationsReviewId = resp[1].data.rows[0].MedicationsReviewId != null ? resp[1].data.rows[0].MedicationsReviewId : "";

                                if ($scope.IntraOpQuickSummaryObj.ReviewDoctorId != 0 || $scope.IntraOpQuickSummaryObj.ReviewDoctorId != null) {
                                    var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.ReviewDoctorId });
                                }
                                doctorlist = doctorlist || [];
                                if (doctorlist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.DoctorName = angular.copy(doctorlist[0].FullName);
                                    $scope.IntraOpQuickSummaryObj.DoctorSuffix = angular.copy(doctorlist[0].SuffixName);
                                    $scope.IntraOpQuickSummaryObj.DoctorLicense = angular.copy(doctorlist[0].LicenseNumber)
                                    if (doctorlist[0].SuffixId == 10) {
                                        $scope.IntraOpQuickSummaryObj.DoctorName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.DoctorName;
                                    }
                                } else {
                                    $scope.IntraOpQuickSummaryObj.DoctorName = '';
                                    $scope.IntraOpQuickSummaryObj.DoctorSuffix = '';
                                    $scope.IntraOpQuickSummaryObj.DoctorLicense = '';
                                }

                                if ($scope.IntraOpQuickSummaryObj.ReviewAnesthetistId != 0 || $scope.IntraOpQuickSummaryObj.ReviewAnesthetistId != null) {
                                    var anesthlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.ReviewAnesthetistId });
                                }
                                anesthlist = anesthlist || [];
                                if (anesthlist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.AnesthesiaName = angular.copy(anesthlist[0].FullName);
                                    $scope.IntraOpQuickSummaryObj.AnesthesiaSuffix = angular.copy(anesthlist[0].SuffixName);
                                    $scope.IntraOpQuickSummaryObj.AnesthesiaLicense = angular.copy(anesthlist[0].LicenseNumber);
                                    if (anesthlist[0].SuffixId == 10) {
                                        $scope.IntraOpQuickSummaryObj.AnesthesiaName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.AnesthesiaName;
                                    }
                                } else {
                                    $scope.IntraOpQuickSummaryObj.AnesthesiaName = '';
                                    $scope.IntraOpQuickSummaryObj.AnesthesiaSuffix = '';
                                    $scope.IntraOpQuickSummaryObj.AnesthesiaLicense = '';
                                }

                                if ($scope.IntraOpQuickSummaryObj.ReviewNurseId != 0 || $scope.IntraOpQuickSummaryObj.ReviewNurseId != null) {
                                    var Nurslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.ReviewNurseId });
                                }
                                Nurslist = Nurslist || [];
                                if (Nurslist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.NurseName = angular.copy(Nurslist[0].FullName);
                                    $scope.IntraOpQuickSummaryObj.NurseSuffix = angular.copy(Nurslist[0].SuffixName);
                                    $scope.IntraOpQuickSummaryObj.NurseLicense = angular.copy(Nurslist[0].LicenseNumber);
                                } else {
                                    $scope.IntraOpQuickSummaryObj.NurseName = '';
                                    $scope.IntraOpQuickSummaryObj.NurseSuffix = '';
                                    $scope.IntraOpQuickSummaryObj.NurseLicense = '';
                                }

                                if ($scope.IntraOpQuickSummaryObj.ReviewTechnicianId != 0 || $scope.IntraOpQuickSummaryObj.ReviewTechnicianId != null) {
                                    var techlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.ReviewTechnicianId });
                                }
                                techlist = techlist || [];
                                if (techlist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.TechnicianName = angular.copy(techlist[0].FullName);
                                    $scope.IntraOpQuickSummaryObj.TechnicianSuffix = angular.copy(techlist[0].SuffixName);
                                    $scope.IntraOpQuickSummaryObj.TechnicianLicense = angular.copy(techlist[0].LicenseNumber);
                                } else {
                                    $scope.IntraOpQuickSummaryObj.TechnicianName = '';
                                    $scope.IntraOpQuickSummaryObj.TechnicianSuffix = '';
                                    $scope.IntraOpQuickSummaryObj.TechnicianLicense = '';
                                }

                                if ($scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewId != 0 || $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewId != null) {
                                    var techlist1 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewId });
                                }

                                techlist1 = techlist1 || [];
                                if (techlist1.length > 0) {
                                    //var SuffixName = '';
                                    //techlist1[0].SuffixName = techlist1[0].SuffixName || '';
                                    //if (techlist1[0].SuffixName != "") {
                                    //    SuffixName = techlist1[0].SuffixName + ',';
                                    //}

                                    var LicenseNumber = "";

                                    techlist1[0].LicenseNumber = techlist1[0].LicenseNumber || "";
                                    if (techlist1[0].LicenseNumber != "") {
                                        LicenseNumber = 'Lic:' + ' ' + techlist1[0].LicenseNumber + ',';
                                    }
                                    $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewName = angular.copy(techlist1[0].UserFullName + ' ' + LicenseNumber);

                                    //if (techlist1[0].SuffixId == 10) {
                                    //    $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewName = angular.copy('Dr. ' + techlist1[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                    //} else {
                                    //    $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewName = angular.copy(techlist1[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                    //}

                                } else {
                                    $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewName = "";
                                }

                                if ($scope.IntraOpQuickSummaryObj.MedicationsReviewId != 0 || $scope.IntraOpQuickSummaryObj.MedicationsReviewId != null) {
                                    var techlist2 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.MedicationsReviewId });
                                }
                                techlist2 = techlist2 || [];
                                if (techlist2.length > 0) {

                                    var SuffixName = '';

                                    techlist2[0].SuffixName = techlist2[0].SuffixName || "";
                                    if (techlist2[0].SuffixName != "") {
                                        SuffixName = techlist2[0].SuffixName + ',';
                                    }

                                    var LicenseNumber = "";
                                    techlist2[0].LicenseNumber = techlist2[0].LicenseNumber || "";
                                    if (techlist2[0].LicenseNumber != "") {
                                        LicenseNumber = 'Lic:' + ' ' + techlist2[0].LicenseNumber + ',';
                                    }

                                    if (techlist2[0].SuffixId == 10) {
                                        $scope.IntraOpQuickSummaryObj.MedicationsReviewName = angular.copy('Dr. ' + techlist2[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                    } else {
                                        $scope.IntraOpQuickSummaryObj.MedicationsReviewName = angular.copy(techlist2[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                    }
                                }
                                else {
                                    $scope.IntraOpQuickSummaryObj.MedicationsReviewName = "";
                                }

                                $scope.IntraOpQuickSummaryObj.ReviewAnesthesiologistId = resp[1].data.rows[0].ReviewAnesthesiologistId || null;

                                $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaTime = resp[1].data.rows[0].BeforeAnesthesiaTime || "";

                                if ($scope.IntraOpQuickSummaryObj.ReviewAnesthesiologistId != null) {
                                    var anesthesiologist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.ReviewAnesthesiologistId });
                                }
                                anesthesiologist = anesthesiologist || [];

                                if (anesthesiologist.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.AnesthesiologistName = angular.copy(anesthesiologist[0].UserFullName);
                                    //$scope.IntraOpQuickSummaryObj.AnesthesiologistSuffix = angular.copy(anesthesiologist[0].SuffixName);
                                    $scope.IntraOpQuickSummaryObj.AnesthesiologistLicense = angular.copy(anesthesiologist[0].LicenseNumber);
                                    //if (anesthesiologist[0].SuffixId == 10) {
                                    //    $scope.IntraOpQuickSummaryObj.AnesthesiologistName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.AnesthesiologistName;
                                    //}
                                    //else {
                                    //    $scope.IntraOpQuickSummaryObj.AnesthesiologistName = $scope.IntraOpQuickSummaryObj.AnesthesiologistName || "";
                                    //}
                                } else {
                                    $scope.IntraOpQuickSummaryObj.AnesthesiologistName = '';
                                    //$scope.IntraOpQuickSummaryObj.AnesthesiologistSuffix = '';
                                    $scope.IntraOpQuickSummaryObj.AnesthesiologistLicense = '';
                                }

                                $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsNotes = resp[1].data.rows[0].AnesthesiaMedicationsNotes || "";
                                $scope.IntraOpQuickSummaryObj.MedicationsNotes = resp[1].data.rows[0].MedicationsNotes || "";

                                if ($scope.IntraOpQuickSummaryObj.DoctorName != '' || $scope.IntraOpQuickSummaryObj.AnesthesiaName != '' || $scope.IntraOpQuickSummaryObj.NurseName != '') {
                                    $scope.IntraOpQuickSummaryObj.ReviewedbyInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.ReviewedbyInd = false;
                                }

                                var temparray1 = [];
                                var temparray1 = $filter("filter")($scope.IntraOpQuickSummaryObj.DocumentDetails, { "FileTypeId": 20 }, true);

                                if (temparray1.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IntraAnesthesiaUploadfileInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IntraAnesthesiaUploadfileInd = false;
                                }

                                var temparray2 = [];
                                var temparray2 = $filter("filter")($scope.IntraOpQuickSummaryObj.DocumentDetails, { "FileTypeId": 19 }, true);

                                if (temparray2.length > 0) {
                                    $scope.IntraOpQuickSummaryObj.IntraNurseUploadfileInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IntraNurseUploadfileInd = false;
                                }

                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.Sterilewater == '' && $scope.IntraOpQuickSummaryObj.NurseActionobj.Alcohol == '' && $scope.IntraOpQuickSummaryObj.NurseActionobj.Levelofconsciousness == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientPosition == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.AnotherRailing == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.ArmsToTheBody == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.Others == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.Strap == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SkinPreparation == "" && $scope.IntraOpQuickSummaryObj.PatientStableSurgery == false && $scope.IntraOpQuickSummaryObj.AdequatePreoperativeWorkup == false) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraPreOpCallInd = false;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraPreOpCallInd = true;
                                }

                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AreaNotes == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.EspecimenLab == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionOrganId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.CropHour == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionArea == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.EspecimenLabNotes == "") {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpEspecimenLab = false;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpEspecimenLab = true;
                                }

                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.TechnicianId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.ReliefId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.SupportingStaffId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.AdditionalStaffId == null) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryStaffInd = false;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryStaffInd = true;
                                }


                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstNeedles != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstBlades != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstOthers != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstVerifiedBy != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime != "") {
                                    $scope.IntraOpQuickSummaryObj.IsSurgicalCountFirstInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsSurgicalCountFirstInd = false;
                                }

                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondNeedles != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondBlades != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondOthers != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondVerifiedBy != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime != "") {
                                    $scope.IntraOpQuickSummaryObj.IsSurgicalCountSecondInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsSurgicalCountSecondInd = false;
                                }

                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalNeedles != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalBlades != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalOthers != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalVerifiedBy != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime != "") {
                                    $scope.IntraOpQuickSummaryObj.IsSurgicalCountFinalInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsSurgicalCountFinalInd = false;
                                }

                                if ($scope.IntraOpQuickSummaryObj.IsSurgicalCountFirstInd || $scope.IntraOpQuickSummaryObj.IsSurgicalCountSecondInd || $scope.IntraOpQuickSummaryObj.IsSurgicalCountFinalInd) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgicalCountInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgicalCountInd = false;
                                }




                                if (!$scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime && !$scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime && !$scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime && !$scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime && !$scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime && !$scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime && !$scope.IntraOpQuickSummaryObj.BeforeAnesthesiaTime) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryTimesInd = false;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryTimesInd = true;
                                }

                                if ($scope.IntraOpQuickSummaryObj.NurseActionobj.Cleansed || $scope.IntraOpQuickSummaryObj.NurseActionobj.CleanContaminated || $scope.IntraOpQuickSummaryObj.NurseActionobj.Contaminated || $scope.IntraOpQuickSummaryObj.NurseActionobj.Dirty) {
                                    $scope.IntraOpQuickSummaryObj.IsIntraClasificationInd = true;
                                } else {
                                    $scope.IntraOpQuickSummaryObj.IsIntraClasificationInd = false;
                                }

                                $scope.ModifiedDate = "";
                                resp[1].data.rows[0].PatientAscChecklist = resp[1].data.rows[0].PatientAscChecklist || [];
                                if (resp[1].data.rows[0].PatientAscChecklist.length > 0) {
                                    var dateTimeString = resp[1].data.rows[0].PatientAscChecklist[0].ModifiedDt || "";
                                    $scope.ModifiedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                }

                                $scope.OverallModifiedDate = "";
                                resp[1].data.rows[0].ModifiedDt = resp[1].data.rows[0].ModifiedDt || [];
                                if (resp[1].data.rows[0].ModifiedDt != "") {
                                    var dateTimeString = resp[1].data.rows[0].ModifiedDt || "";
                                    $scope.OverallModifiedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                }

                                $scope.IntraOpQuickSummaryObj.IsBeforeAnesthesiaNormal = resp[1].data.rows[0].IsBeforeAnesthesiaNormal;
                                $scope.IntraOpQuickSummaryObj.IsBeforeIncisionNormal = resp[1].data.rows[0].IsBeforeIncisionNormal;
                                $scope.IntraOpQuickSummaryObj.IsBeforeORNormal = resp[1].data.rows[0].IsBeforeORNormal;

                                $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedBy = resp[1].data.rows[0].BeforeAnesthesiaReviewedBy || null;
                                $scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedBy = resp[1].data.rows[0].BeforeIncisionReviewedBy || null;
                                $scope.IntraOpQuickSummaryObj.BeforeORReviewedBy = resp[1].data.rows[0].BeforeORReviewedBy || null;

                                $scope.IntraOpQuickSummaryObj.OxygenType = resp[1].data.rows[0].OxygenType || "";
                                $scope.IntraOpQuickSummaryObj.OxygenQuantity = resp[1].data.rows[0].OxygenQuantity || "";
                                $scope.IntraOpQuickSummaryObj.EndotrachealTubeNotes = resp[1].data.rows[0].EndotrachealTubeNotes || "";
                                $scope.IntraOpQuickSummaryObj.LMANotes = resp[1].data.rows[0].LMANotes || "";
                                $scope.IntraOpQuickSummaryObj.IntraOpAnesthesiaNotes = resp[1].data.rows[0].IntraOpAnesthesiaNotes || null;

                                if ($scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedBy != null) {
                                    let beforeanesthesiareviewedArray = $filter('filter')($scope.CheckinChecklistArray, { 'DoctorID': $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedBy }, true) || [];
                                    if (beforeanesthesiareviewedArray.length > 0) {

                                        var SuffixName = '';
                                        if (beforeanesthesiareviewedArray[0].SuffixName != "" && beforeanesthesiareviewedArray[0].SuffixName != null) {
                                            SuffixName = beforeanesthesiareviewedArray[0].SuffixName + ',';
                                        }

                                        var LicenseNumber = "";
                                        if (beforeanesthesiareviewedArray[0].LicenseNumber != "" && beforeanesthesiareviewedArray[0].LicenseNumber != null) {
                                            LicenseNumber = 'Lic:' + ' ' + beforeanesthesiareviewedArray[0].LicenseNumber + ',';
                                        }

                                        if (beforeanesthesiareviewedArray[0].SuffixId == 10) {
                                            $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedByName = angular.copy('Dr. ' + beforeanesthesiareviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                        } else {
                                            $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedByName = angular.copy(beforeanesthesiareviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                        }
                                    }
                                }

                                if ($scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedBy != null) {
                                    let beforeIncisionreviewedArray = $filter('filter')($scope.CheckinChecklistArray, { 'DoctorID': $scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedBy }, true) || [];
                                    if (beforeIncisionreviewedArray.length > 0) {

                                        var SuffixName = '';
                                        if (beforeIncisionreviewedArray[0].SuffixName != "" && beforeIncisionreviewedArray[0].SuffixName != null) {
                                            SuffixName = beforeIncisionreviewedArray[0].SuffixName + ',';
                                        }

                                        var LicenseNumber = "";
                                        if (beforeIncisionreviewedArray[0].LicenseNumber != "" && beforeIncisionreviewedArray[0].LicenseNumber != null) {
                                            LicenseNumber = 'Lic:' + ' ' + beforeIncisionreviewedArray[0].LicenseNumber + ',';
                                        }

                                        if (beforeIncisionreviewedArray[0].SuffixId == 10) {
                                            $scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedByName = angular.copy('Dr. ' + beforeIncisionreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                        } else {
                                            $scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedByName = angular.copy(beforeIncisionreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                        }
                                    }
                                }

                                if ($scope.IntraOpQuickSummaryObj.BeforeORReviewedBy != null) {
                                    let beforeORreviewedArray = $filter('filter')($scope.CheckinChecklistArray, { 'DoctorID': $scope.IntraOpQuickSummaryObj.BeforeORReviewedBy }, true);
                                    if (beforeORreviewedArray.length > 0) {

                                        var SuffixName = '';
                                        if (beforeORreviewedArray[0].SuffixName != "" && beforeORreviewedArray[0].SuffixName != null) {
                                            SuffixName = beforeORreviewedArray[0].SuffixName + ',';
                                        }

                                        var LicenseNumber = "";
                                        if (beforeORreviewedArray[0].LicenseNumber != "" && beforeORreviewedArray[0].LicenseNumber != null) {
                                            LicenseNumber = 'Lic:' + ' ' + beforeORreviewedArray[0].LicenseNumber + ',';
                                        }

                                        if (beforeORreviewedArray[0].SuffixId == 10) {
                                            $scope.IntraOpQuickSummaryObj.BeforeORReviewedByName = angular.copy('Dr. ' + beforeORreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                        } else {
                                            $scope.IntraOpQuickSummaryObj.BeforeORReviewedByName = angular.copy(beforeORreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                        }
                                    }
                                }

                            }

                            if ($scope.IntraOpQuickSummaryObj.OrderDetails.length > 0) {
                                var MedCount = 0;
                                var GenCount = 0;

                                angular.forEach($scope.IntraOpQuickSummaryObj.OrderDetails, function (item) {
                                    if (item.IntraOpMedications.length > 0) {
                                        MedCount++;
                                    };
                                    if (item.GeneralOrders.length > 0) {
                                        GenCount++;
                                    };
                                });

                                if (MedCount !== 0) {
                                    $scope.IsIntraopMedications = true;
                                } else {
                                    $scope.IsIntraopMedications = false;
                                };

                                if (GenCount !== 0) {
                                    $scope.IsIntraopGenOrders = true;
                                } else {
                                    $scope.IsIntraopGenOrders = false;
                                };
                            } else {
                                $scope.PostOpQuickSummaryObj.OrderDetails = [];

                                $scope.IsIntraopMedications = false;
                                $scope.IsIntraopGenOrders = false;
                            }

                        } else {
                            $scope.IntraOpQuickSummaryObj.PatientASCIntraOPId = 0;
                            $scope.IntraOpQuickSummaryObj.Vitals = [];

                            $scope.IntraOpSummaryObj.IsIntraOpVitalsInd = false;
                            $scope.IntraOpSummaryObj.ReviewedbyInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpROSMainInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpROSSystemiInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpROSSurgicalInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpROSAllergiesInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpROSPhysicalInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpNurseIntraProcedureInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpNurseAnticipationOfCriticalInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpNurseTimeOutStopBeforeInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpNurseAntibioticProphylaxisInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpNurseIntraRemarksInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpNurseMainInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpNurseIntraOthersInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpNurseSurgeryTimesInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpNurseIntraPreOpCallInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpNurseSurgicalCountInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpAnesthetistActionInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpSurgeonMainInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpSurgeonDoctorNotesInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpSurgeonSurgeonOperativeNotesInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpOrdersMedicationInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpOrdersEyeDropsInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpOrdersInjectionsInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpOrdersLabsInvestigationsInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpOrdersMainInd = false;
                            $scope.IntraOpSummaryObj.IsSurgeonInd = false;
                            $scope.IntraOpSummaryObj.IsAnesthetistNotesInd = false;
                            $scope.IntraOpSummaryObj.IsIntraSurgeonComplicationNotes = false;
                            $scope.IntraOpSummaryObj.IsIntraDrainageInd = false;
                            $scope.IntraOpSummaryObj.IsIntraClasificationInd = false;
                            $scope.IntraOpSummaryObj.IsIntraCauteraisationInd = false;
                            $scope.IntraOpSummaryObj.IsIntraNurseActionInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpDiagnosisInd = false;
                            $scope.IntraOpSummaryObj.IsSurgicalCountFirstInd = false;
                            $scope.IntraOpSummaryObj.IsSurgicalCountSecondInd = false;
                            $scope.IntraOpSummaryObj.IsSurgicalCountFinalInd = false;
                            $scope.IntraOpSummaryObj.IsIntraOpEspecimenLab = false;
                            $scope.IntraOpQuickSummaryObj.IsCDEInd = false;

                        }
                    });
                }

                $scope.GetPostOpChartData = function () {

                    let appointmentId = null;
                    if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
                        appointmentId = $scope.SelectedAppointmentId;
                    }

                    if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
                        appointmentId = $scope.cacheStorageItem.AscAppointmentId;
                    }

                    let req = {
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "CheckListModuleId": 3
                    };

                    //let reqObj = {
                    //    "ParentOrganizationId": $scope.ParenthospitalId
                    //};

                    let params = {
                        "OrganizationId": $scope.HospitalId,
                        "AppointmentId": appointmentId || null,
                        "PatientId": $scope.cacheStorageItem.PatientID || null
                    };

                    $q.all([
                        eHnoteSurgeryService.GetOrganizationASCCheckListData(req),
                        eHnoteSurgeryService.GetOrganizationPreOpMedications($scope.ParenthospitalId),
                        eHnoteSurgeryService.GetPostOpChartData(params)

                    ]).then(function (resp) {

                        // patient goals
                        resp[0].data.goalsList = resp[0].data.goalsList || [];
                        if (resp[0].data.goalsList.length > 0) {
                            $scope.PostOpQuickSummaryObj.MasterAscPatientGoal = angular.copy(resp[0].data.goalsList);
                        }

                        if ($scope.PostOpQuickSummaryObj.MasterAscPatientGoal.length > 0) {
                            angular.forEach($scope.PostOpQuickSummaryObj.MasterAscPatientGoal, function (Gitem) {
                                Gitem.Value = "";
                                Gitem.DeleteInd = "N";
                            });
                        }

                        if (resp[0].data.status === "Success") {
                            $scope.PostOpQuickSummaryObj.OrgASCChecklist = angular.copy(resp[0].data.rows);
                            angular.forEach($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (item) {
                                item.IsChecked = false;
                            });

                            var list1 = $filter("filter")($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (kitem, index) { return kitem.CheckListCategoryId == 4 && kitem.CheckListSubTypeId == 3 });
                            var list2 = $filter("filter")($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (kitem, index) { return kitem.CheckListCategoryId == 4 && kitem.CheckListSubTypeId == 4 });

                            $scope.PostOpQuickSummaryObj.DischargeObj.DischargeCriteriaList = angular.copy(list1);
                            $scope.PostOpQuickSummaryObj.DischargeObj.TransferList = angular.copy(list2);

                            if (resp[0].data.AnaesthesiaTypes.length > 0) {
                                $scope.PostOpQuickSummaryObj.AnesthesiaTypelist = resp[0].data.AnaesthesiaTypes || [];
                            }
                        }

                        if (resp[1].data.status === "Success") {
                            angular.forEach(resp[1].data.rows, function (item) {
                                item.AscMedicationId = 0;
                                item.IsChecked = false;
                                item.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                            });

                            let temppostopMedications = $filter('filter')(resp[1].data.rows, { 'IsPostOpMed': true }, true);
                            //$scope.PostOpQuickSummaryObj.PostOpMedications = angular.copy(temppostopMedications);
                            $scope.MasterPostOpMedications = angular.copy(temppostopMedications);
                        }

                        if (resp[2].data.Status === "Success") {
                            $scope.PostOpQuickSummaryObj.SurgeryList = angular.copy(resp[2].data.SurgeryList);
                            $scope.PostOpQuickSummaryObj.AlderetScoreDetails = angular.copy(resp[2].data.PreOpAlderetScoreDetails);
                            $scope.PostOpQuickSummaryObj.TotalAlderetScore = resp[2].data.TotalAlderetScore;
                            $scope.PostOpQuickSummaryObj.ROSOverAllRemarks = resp[2].data.ROSOverAllRemarks;
                            $scope.PostOpQuickSummaryObj.SurgicalHistory = angular.copy(resp[2].data.SurgicalHistory);
                            $scope.PostOpQuickSummaryObj.SystemicHistory = angular.copy(resp[2].data.SystemicHistory);
                            $scope.PostOpQuickSummaryObj.AllergyItems = angular.copy(resp[2].data.AllergyItems);
                            $scope.PostOpQuickSummaryObj.LastSignOffUserDetails = resp[2].data.LastSignOffUserDetails || [];
                            $scope.PostOpQuickSummaryObj.IntraOpHandOffReviewedByname = resp[2].data.IntraOpHandOffReviewedByname || '';
                            $scope.PostOpQuickSummaryObj.OxygenType = resp[2].data.OxygenType || '';
                            $scope.PostOpQuickSummaryObj.OxygenQuantity = resp[2].data.OxygenQuantity || '';

                            $scope.PostOpQuickSummaryObj.IntraOpAnesthesiaStartTime = resp[2].data.IntraOpAnesthesiaStartTime || '';
                            $scope.PostOpQuickSummaryObj.IntraOpAnesthesiaEndTime = resp[2].data.IntraOpAnesthesiaEndTime || '';

                            $scope.PostOpQuickSummaryObj.DischargeSignOffStartTime = resp[2].data.DischargeSignOffStartTime || '';
                            $scope.PostOpQuickSummaryObj.DischargeSignOffEndTime = resp[2].data.DischargeSignOffEndTime || '';
                            $scope.PostOpQuickSummaryObj.DischargeStartTimeUser = resp[2].data.DischargeStartTimeUser || null;
                            $scope.PostOpQuickSummaryObj.DischargeEndTimeUser = resp[2].data.DischargeEndTimeUser || null;
                            $scope.PostOpQuickSummaryObj.DischargeStopTimerRemarks = resp[2].data.DischargeStopTimerRemarks || null;

                            resp[2].data.IntrOpHandOffTime = resp[2].data.IntrOpHandOffTime || '';
                            if (resp[2].data.IntrOpHandOffTime != "" && resp[2].data.IntrOpHandOffTime != "00:00:00") {
                                let dummydatetime = "2024-01-01" + " " + resp[2].data.IntrOpHandOffTime;
                                let time = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                                $scope.PostOpQuickSummaryObj.IntrOpHandOffTime = angular.copy(time);
                            }

                            if (resp[2].data.CurrentEyeMedicationList.length > 0) {
                                $scope.PostOpQuickSummaryObj.CurrentEyeMedications = angular.copy(resp[2].data.CurrentEyeMedicationList);
                            }

                            if (resp[2].data.CurrentSystemicMedicationList.length > 0) {
                                $scope.PostOpQuickSummaryObj.CurrentSystemicMedicationsHistory = angular.copy(resp[2].data.CurrentSystemicMedicationList);
                            }

                            resp[2].data.PreAdmAnesthesiaTypelist = resp[2].data.PreAdmAnesthesiaTypelist || [];
                            if (resp[2].data.PreAdmAnesthesiaTypelist.length > 0) {
                                $scope.PostOpQuickSummaryObj.AnesthesiaTypelist = angular.copy(resp[2].data.PreAdmAnesthesiaTypelist);
                            }
                            resp[2].data.IntraOPAnesthesiaTypelist = resp[2].data.IntraOPAnesthesiaTypelist || [];
                            if (resp[2].data.IntraOPAnesthesiaTypelist.length > 0) {
                                $scope.PostOpQuickSummaryObj.AnesthesiaTypelist = angular.copy(resp[2].data.IntraOPAnesthesiaTypelist);
                            }

                            resp[2].data.IntraOpInvestigationsList = resp[2].data.IntraOpInvestigationsList || [];
                            if (resp[2].data.IntraOpInvestigationsList.length > 0) {
                                $scope.PostOpQuickSummaryObj.SurgeonObj.InvestigationsList = angular.copy(resp[2].data.IntraOpInvestigationsList);
                            }

                            resp[2].data.IntraOpPrescription = resp[2].data.IntraOpPrescription || [];
                            if (resp[2].data.IntraOpPrescription.length > 0) {
                                $scope.PostOpQuickSummaryObj.PrescriptionDetails = angular.copy(resp[2].data.IntraOpPrescription);
                            }

                            $scope.PostOpQuickSummaryObj.MedicineOrdersInstructions = resp[2].data.MedicineOrdersInstructions || "";
                            resp[2].data.IntraOpHallEndTime = resp[2].data.IntraOpHallEndTime || "";
                            if (resp[2].data.IntraOpHallEndTime != "") {
                                let dummydatetime = "2024-01-01" + " " + resp[2].data.IntraOpHallEndTime;
                                let time = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                                $scope.PostOpQuickSummaryObj.RecoveryStartTime = angular.copy(time);
                            }
                            $scope.PatientGoalsArray = [];
                            if (resp[2].data.rows.length > 0) {

                                resp[2].data.rows[0].VitalsArray = resp[2].data.rows[0].VitalsArray || [];
                                if (resp[2].data.rows[0].VitalsArray.length > 0) {
                                    angular.forEach(resp[2].data.rows[0].VitalsArray, function (item) {
                                        var vitalslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
                                        if (vitalslist.length > 0) {
                                            item.UserName = angular.copy(vitalslist[0].FullName);
                                        }
                                        let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                                        let edate = ndate + " " + item.VitalAddTime;

                                        item.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                                    });
                                }
                                //$scope.PostOpQuickSummaryObj.MedicineOrdersInstructions = resp[2].data.rows[0].MedicineOrdersInstructions || "";

                                $scope.PostOpQuickSummaryObj.Vitals = resp[2].data.rows[0].VitalsArray;
                                if ($scope.PostOpQuickSummaryObj.Vitals.length > 0) {
                                    $scope.PostOpQuickSummaryObj.IsPostOpVitalsInd = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.IsPostOpVitalsInd = false;
                                }

                                //resp[2].data.rows[0].AnesthesiaTypelist = resp[2].data.rows[0].AnesthesiaTypelist || [];
                                //if (resp[2].data.rows[0].AnesthesiaTypelist.length > 0) {
                                //    $scope.PostOpQuickSummaryObj.AnesthesiaTypelist = angular.copy(resp[2].data.rows[0].AnesthesiaTypelist);
                                //}

                                $scope.PostOpQuickSummaryObj.Intake = resp[2].data.rows[0].Intake || "";
                                $scope.PostOpQuickSummaryObj.Output = resp[2].data.rows[0].Output || "";
                                $scope.PostOpQuickSummaryObj.EBL = resp[2].data.rows[0].EBL || "";
                                $scope.PostOpQuickSummaryObj.InTime = resp[2].data.rows[0].InTime || "";
                                $scope.PostOpQuickSummaryObj.OutTime = resp[2].data.rows[0].OutTime || "";

                                $scope.PostOpQuickSummaryObj.PostOpAnesthesiaChartStatus = resp[2].data.rows[0].PostOpAnesthesiaChartStatus || '';
                                $scope.PostOpQuickSummaryObj.PostOpNurseChartStatus = resp[2].data.rows[0].PostOpNurseChartStatus || '';

                                $scope.PostOpQuickSummaryObj.R2PostOpNurseChartStatus = resp[2].data.rows[0].R2PostOpNurseChartStatus || "";
                                $scope.PostOpQuickSummaryObj.R2PostOpAnesthesiaChartStatus = resp[2].data.rows[0].R2PostOpAnesthesiaChartStatus || "";

                                let ndate = moment().format("YYYY-MM-DD");
                                if ($scope.PostOpQuickSummaryObj.InTime != "") {
                                    let edate = ndate + " " + $scope.PostOpQuickSummaryObj.InTime;
                                    $scope.PostOpQuickSummaryObj.InTime = moment(edate).format("hh:mm A");
                                }

                                if ($scope.PostOpQuickSummaryObj.OutTime != "") {
                                    let edate = ndate + " " + $scope.PostOpQuickSummaryObj.OutTime;
                                    $scope.PostOpQuickSummaryObj.OutTime = moment(edate).format("hh:mm A");
                                }

                                $scope.PostOpQuickSummaryObj.ProgressNotesPainScore = resp[2].data.rows[0].ProgressNotesPainScore;

                                $scope.PostOpQuickSummaryObj.DiscontinueIVTime = resp[2].data.rows[0].DiscontinueIVTime || '';
                                $scope.PostOpQuickSummaryObj.PatientDischargeTime = resp[2].data.rows[0].PatientDischargeTime || '';

                                resp[2].data.rows[0].OrgAscChecklist = resp[2].data.rows[0].OrgAscChecklist || [];
                                if (resp[2].data.rows[0].OrgAscChecklist.length > 0) {
                                    angular.forEach(resp[2].data.rows[0].OrgAscChecklist, function (item) {
                                        angular.forEach($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (hitem) {
                                            if (hitem.CheckListCategoryId === item.CheckListCategoryId && item.CheckListId === hitem.CheckListId) {
                                                hitem.IsChecked = true;
                                            }
                                        });
                                    });
                                }

                                if (resp[2].data.rows[0].OrgAscChecklist.length > 0) {
                                    angular.forEach(resp[2].data.rows[0].OrgAscChecklist, function (item) {
                                        angular.forEach($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (hitem) {
                                            if (hitem.CheckListId == 139 && !$scope.ParentObj.IsIOJParentOrganization && $scope.PostOpQuickSummaryObj.ProgressNotesPainScore !== null) {
                                                hitem.IsChecked = true;
                                            }
                                            if (hitem.CheckListCategoryId === item.CheckListCategoryId && item.CheckListId === hitem.CheckListId) {
                                                if (item.CheckListId == 132 || item.CheckListId == 136 || item.CheckListId == 152) {
                                                    if (item.AscMultiCheckValueArray.length > 0) {
                                                        angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                            angular.forEach(hitem.OrganizationCheckListDetails, function (Oitem) {
                                                                if (Oitem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                                    Oitem.IsChecked = true;
                                                                    Oitem.PatientMultiCheckListId = jitem.PatientMultiCheckListId || null;
                                                                }
                                                            });
                                                        });
                                                    }

                                                } else {
                                                    angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                                                        if (kitem.Value == item.Value && kitem.CheckListId === item.CheckListId) {
                                                            kitem.IsChecked = true;
                                                            hitem.IsChecked = true;
                                                            hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                                                            hitem.Value = item.Value || '';
                                                        } else {
                                                            kitem.IsChecked = false;
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    });
                                }

                                let tempInterventionsCheckList = $filter('filter')($scope.PostOpQuickSummaryObj.OrgASCChecklist, { 'CheckListCategoryId': 16 }, true);
                                if (tempInterventionsCheckList.length > 0) {
                                    $scope.PostOpQuickSummaryObj.NursingCarePlanData = angular.copy(tempInterventionsCheckList);
                                };

                                $scope.PostOpQuickSummaryObj.CheckinCheckList = [];

                                let tempCheckinCheckList = $filter('filter')($scope.PostOpQuickSummaryObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 1 }, true);
                                let filteredCheckinCheckList = angular.copy(tempCheckinCheckList);
                                if (filteredCheckinCheckList.length > 0) {
                                    filteredCheckinCheckList.sort(function (a, b) {
                                        return a.OrgOrderBy - b.OrgOrderBy;
                                    });
                                    let chunkSize = Math.ceil((filteredCheckinCheckList.length) / 2);
                                    for (let i = 0; i < filteredCheckinCheckList.length; i += chunkSize) {
                                        $scope.PostOpQuickSummaryObj.CheckinCheckList.push(filteredCheckinCheckList.slice(i, i + chunkSize));
                                    }
                                }

                                resp[2].data.rows[0].NurseCheckLists = resp[2].data.rows[0].NurseCheckLists || [];
                                if (resp[2].data.rows[0].NurseCheckLists.length > 0) {
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Notes = resp[2].data.rows[0].NurseCheckLists[0].Notes || "";
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks = resp[2].data.rows[0].NurseCheckLists[0].PainLevelRemarks || "";
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedTime = resp[2].data.rows[0].NurseCheckLists[0].PatientReceivedTime || "";
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Saturation = resp[2].data.rows[0].NurseCheckLists[0].Saturation || "";
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedby = resp[2].data.rows[0].NurseCheckLists[0].PatientReceivedby || "";

                                }

                                if ($scope.PostOpQuickSummaryObj.CheckinCheckList.length > 0 || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Notes || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel && $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedTime && $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Saturation && $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedby) {
                                    var CheckinCheckListcaunt = 0;
                                    $scope.PostOpQuickSummaryObj.IsCheckinCheckListEmpty = false;
                                    angular.forEach($scope.PostOpQuickSummaryObj.CheckinCheckList, function (item) {
                                        angular.forEach(item, function (Aitem) {
                                            if (Aitem.IsChecked) {
                                                CheckinCheckListcaunt++;
                                            }
                                        });
                                    });
                                    if (CheckinCheckListcaunt == 0 && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.Notes && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedTime && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.Saturation && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedby) {
                                        $scope.PostOpQuickSummaryObj.IsCheckinCheckListEmpty = true;
                                    }
                                } else {
                                    $scope.PostOpQuickSummaryObj.IsCheckinCheckListEmpty = false;
                                }

                                $scope.PostOpQuickSummaryObj.OxygenType = resp[2].data.rows[0].OxygenType || "";
                                $scope.PostOpQuickSummaryObj.OxygenQuantity = resp[2].data.rows[0].OxygenQuantity || "";

                                if ($scope.PostOpQuickSummaryObj.IsPostOpROSAllergiesInd || $scope.PostOpQuickSummaryObj.IsPostOpROSSystemiInd || $scope.PostOpQuickSummaryObj.IsPostOpROSSurgicalInd) {
                                    $scope.PostOpQuickSummaryObj.IsPostOpROSMainInd = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.IsPostOpROSMainInd = false;
                                }

                                $scope.PostOpQuickSummaryObj.DocumentDetails = angular.copy(resp[2].data.rows[0].DocumentDetails);

                                $scope.IsNurseFileUploads = false;

                                if ($scope.PostOpQuickSummaryObj.DocumentDetails.length > 0) {

                                    var TempArray1 = $filter('filter')($scope.PostOpQuickSummaryObj.DocumentDetails, { 'NoteFileTypeId': 22 }, true);
                                    if (TempArray1.length > 0) {
                                        $scope.IsNurseFileUploads = true;
                                    } else {
                                        $scope.IsNurseFileUploads = false;
                                    }
                                }

                                $scope.PostOpQuickSummaryObj.ReviewedBy = resp[2].data.rows[0].NurseReviewedBy || 0;
                                $scope.PostOpQuickSummaryObj.NurseReviewedBy = resp[2].data.rows[0].NurseReviewedBy || 0;
                                $scope.PostOpQuickSummaryObj.NurseReviewedDate = $filter('date')(resp[2].data.rows[0].NurseReviewedDate, 'MM-dd-yyyy hh:mm a') || null;
                                $scope.PostOpQuickSummaryObj.AnesthetistReviewedDate = $filter('date')(resp[2].data.rows[0].AnesthetistReviewedDate, 'MM-dd-yyyy hh:mm a') || null;
                                $scope.PostOpQuickSummaryObj.NurseReviewedTime = resp[2].data.rows[0].NurseReviewedtime;
                                $scope.PostOpQuickSummaryObj.PostOpNotes = resp[2].data.rows[0].PostOpNotes;
                                $scope.PostOpQuickSummaryObj.Recovery2PostOpNotes = resp[2].data.rows[0].Recovery2PostOpNotes || null;
                                $scope.PostOpQuickSummaryObj.Recovery2PostOpAnesthesiaNotes = resp[2].data.rows[0].Recovery2PostOpAnesthesiaNotes || null;

                                $scope.PostOpQuickSummaryObj.Recovery2AnesthesiaReviewedDate = $filter('date')(resp[2].data.rows[0].Recovery2AnesthesiaReviewedDate, 'MM-dd-yyyy hh:mm a') || null;
                                $scope.PostOpQuickSummaryObj.Recovery2NurseReviewedDate = $filter('date')(resp[2].data.rows[0].Recovery2NurseReviewedDate, 'MM-dd-yyyy hh:mm a') || null;

                                $scope.PostOpQuickSummaryObj.Recovery2Intime = resp[2].data.rows[0].Recovery2Intime;
                                $scope.PostOpQuickSummaryObj.Recovery2Outtime = resp[2].data.rows[0].Recovery2Outtime;
                                $scope.PostOpQuickSummaryObj.Recovery1Intime = resp[2].data.rows[0].Recovery1Intime;
                                $scope.PostOpQuickSummaryObj.Recovery1Outtime = resp[2].data.rows[0].Recovery1Outtime;

                                resp[2].data.rows[0].PostOpDiagnosis = resp[2].data.rows[0].PostOpDiagnosis || [];
                                if (resp[2].data.rows[0].PostOpDiagnosis.length > 0) {
                                    $scope.PostOpQuickSummaryObj.PostOpDiagnosis = angular.copy(resp[2].data.rows[0].PostOpDiagnosis) || [];
                                    $scope.PostOpQuickSummaryObj.IsPostOpDiagnosisInd = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.IsPostOpDiagnosisInd = false;
                                }

                                if ($scope.PostOpQuickSummaryObj.NurseReviewedBy != 0 || $scope.PostOpQuickSummaryObj.NurseReviewedBy != null) {
                                    var list1 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.NurseReviewedBy })||[];
                                    if (list1.length > 0) {
                                        $scope.PostOpQuickSummaryObj.NurseReviewedByName = angular.copy(list1[0].FullName);
                                        $scope.PostOpQuickSummaryObj.IsNurseInd = true;
                                    }
                                    else {
                                        $scope.PostOpQuickSummaryObj.IsNurseInd = false;
                                    }
                                }
                                $scope.PostOpQuickSummaryObj.S3URL = resp[2].data.rows[0].S3URL || "";

                                $scope.PostOpQuickSummaryObj.DischargeObj.Complications = resp[2].data.rows[0].Complications || "";
                                $scope.PostOpQuickSummaryObj.DischargeObj.SurgeonOperativeNotes = resp[2].data.rows[0].SurgeonOperativeNotes || "";

                                // nurse checklists and actions
                                if (resp[2].data.rows[0].NurseCheckLists.length > 0) {
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PostOPNurseCheckListId = resp[2].data.rows[0].NurseCheckLists[0].PostOPNurseCheckListId;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceived = resp[2].data.rows[0].NurseCheckLists[0].PatientReceived;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.AccompaniedBy = resp[2].data.rows[0].NurseCheckLists[0].AccompaniedBy;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel = resp[2].data.rows[0].NurseCheckLists[0].PainLevel;
                                    //$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks = resp[2].data.rows[0].NurseCheckLists[0].PainLevelRemarks;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.NourishmentProvider = resp[2].data.rows[0].NurseCheckLists[0].NourishmentProvider;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.BloodSugar = resp[2].data.rows[0].NurseCheckLists[0].BloodSugar;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PostOpInstruction = resp[2].data.rows[0].NurseCheckLists[0].PostOpInstruction;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ReceivedRoom = resp[2].data.rows[0].NurseCheckLists[0].ReceivedRoom;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientallowed = resp[2].data.rows[0].NurseCheckLists[0].Patientallowed;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Personalbelonging = resp[2].data.rows[0].NurseCheckLists[0].Personalbelonging;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientadvised = resp[2].data.rows[0].NurseCheckLists[0].Patientadvised;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientClinic = resp[2].data.rows[0].NurseCheckLists[0].PatientClinic;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Physicianexamine = resp[2].data.rows[0].NurseCheckLists[0].Physicianexamine;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Removedintact = resp[2].data.rows[0].NurseCheckLists[0].Removedintact;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Orientedtimes = resp[2].data.rows[0].NurseCheckLists[0].Orientedtimes;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.OtherMental = resp[2].data.rows[0].NurseCheckLists[0].OtherMental;
                                    // $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Notes = resp[2].data.rows[0].NurseCheckLists[0].Notes ||'';
                                    $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ProgressBloodSugarNotes = resp[2].data.rows[0].NurseCheckLists[0].ProgressBloodSugarNotes || "";
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOpInstructionNotes = resp[2].data.rows[0].NurseCheckLists[0].PostOpInstructionNotes || '';
                                    if ($scope.PostOpQuickSummaryObj.NurseChart.Checklists.ProgressBloodSugarNotes != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOpInstructionNotes != '') {
                                        if ($scope.PostOpQuickSummaryObj.OrgASCChecklist.length > 0) {
                                            angular.forEach($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (item) {
                                                if (item.CheckListId == 134 && $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ProgressBloodSugarNotes != '') {
                                                    item.IsChecked = true;
                                                    item.Value = $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ProgressBloodSugarNotes || '';
                                                }
                                                if (item.CheckListId == 135 && $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOpInstructionNotes != '') {
                                                    item.IsChecked = true;
                                                    item.Value = $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOpInstructionNotes || '';
                                                }
                                            });
                                        }
                                    }

                                    //$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel = resp[2].data.rows[0].NurseCheckLists[0].PainLevel || "";
                                    //$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks = resp[2].data.rows[0].NurseCheckLists[0].PainLevelRemarks || "";
                                }
                                if ($scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceived != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.AccompaniedBy != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.NourishmentProvider != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.BloodSugar != ''
                                    || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PostOpInstruction != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ReceivedRoom != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientallowed != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Personalbelonging != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientadvised != ''
                                    || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientClinic != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Physicianexamine != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Removedintact != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Orientedtimes != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.OtherMental != ''
                                    || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Notes != '') {

                                    $scope.PostOpQuickSummaryObj.IsPostOpChecklistInd = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.IsPostOpChecklistInd = false;
                                }

                                if (resp[2].data.rows[0].NurseActions.length > 0) {
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOPNurseActionId = resp[2].data.rows[0].NurseActions[0].PostOPNurseActionId;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech = resp[2].data.rows[0].NurseActions[0].Speech;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Vision = resp[2].data.rows[0].NurseActions[0].Vision;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Pain = resp[2].data.rows[0].NurseActions[0].Pain;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.ConsciousLevel = resp[2].data.rows[0].NurseActions[0].ConsciousLevel;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Fur = resp[2].data.rows[0].NurseActions[0].Fur;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.IncisionlaDrainage = resp[2].data.rows[0].NurseActions[0].IncisionlaDrainage;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Nausea = resp[2].data.rows[0].NurseActions[0].Nausea;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.IngestedFood = resp[2].data.rows[0].NurseActions[0].IngestedFood;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Referred = resp[2].data.rows[0].NurseActions[0].Referred;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Relationship = resp[2].data.rows[0].NurseActions[0].Relationship;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Exit = resp[2].data.rows[0].NurseActions[0].Exit;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Instruction = resp[2].data.rows[0].NurseActions[0].Instruction;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Prescription = resp[2].data.rows[0].NurseActions[0].Prescription;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.LensCard = resp[2].data.rows[0].NurseActions[0].LensCard;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Surveillance = resp[2].data.rows[0].NurseActions[0].Surveillance;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Bandage = resp[2].data.rows[0].NurseActions[0].Bandage;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Advancediet = resp[2].data.rows[0].NurseActions[0].Advancediet;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Discharge = resp[2].data.rows[0].NurseActions[0].Discharge;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Administer = resp[2].data.rows[0].NurseActions[0].Administer;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Tylenol = resp[2].data.rows[0].NurseActions[0].Tylenol;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Review = resp[2].data.rows[0].NurseActions[0].Review;
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Notes = resp[2].data.rows[0].NurseActions[0].Notes || '';

                                }
                                if ($scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Vision != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Pain != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.ConsciousLevel != '' ||
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Fur != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.IncisionlaDrainage != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Nausea != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.IngestedFood != '' ||
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Referred != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Relationship != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Exit != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Instruction != '' ||
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Prescription != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Discharge != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Administer != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Tylenol != '' ||
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Advancediet != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech != '' ||
                                    $scope.PostOpQuickSummaryObj.NurseChart.Actions.Review != '') {

                                    $scope.PostOpQuickSummaryObj.IsPostOpActionInd = true;

                                } else {
                                    $scope.PostOpQuickSummaryObj.IsPostOpActionInd = false;
                                }

                                resp[2].data.rows[0].SurgeonInvestigations = resp[2].data.rows[0].SurgeonInvestigations || [];
                                if (resp[2].data.rows[0].SurgeonInvestigations.length > 0) {
                                    $scope.PostOpQuickSummaryObj.SurgeonObj.InvestigationsList = angular.copy(resp[2].data.rows[0].SurgeonInvestigations);
                                    $scope.PostOpQuickSummaryObj.IsLabInvestigationInd = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.IsLabInvestigationInd = false;
                                }

                                $scope.PostOpQuickSummaryObj.SurgeonObj.DoctorNotes = resp[2].data.rows[0].DoctorNotes;
                                if ($scope.PostOpQuickSummaryObj.SurgeonObj.DoctorNotes != "") {
                                    $scope.PostOpQuickSummaryObj.IsPostDoctorNotesInd = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.IsPostDoctorNotesInd = false;
                                }

                                $scope.PostOpQuickSummaryObj.SurgeonObj.PostOpInstruction = resp[2].data.rows[0].PostOpInstruction || "";
                                if ($scope.PostOpQuickSummaryObj.SurgeonObj.PostOpInstruction != "") {
                                    $scope.PostOpQuickSummaryObj.IsPostOpInstructionsInd = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.IsPostOpInstructionsInd = false;
                                }
                                if ($scope.PostOpQuickSummaryObj.IsLabInvestigationInd || $scope.PostOpQuickSummaryObj.IsPostOpInstructionsInd || $scope.PostOpQuickSummaryObj.IsPostDoctorNotesInd || $scope.PostOpQuickSummaryObj.IsPostOpDiagnosisInd) {
                                    $scope.PostOpQuickSummaryObj.IsPostOpSurgeonMainInd = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.IsPostOpSurgeonMainInd = false;
                                }

                                // anesthesia tab

                                if (resp[2].data.rows[0].AnesthetistVitals.length > 0) {
                                    /* $scope.AnesthetistVitals = angular.copy($scope.GetAnesthetistVitals());*/
                                    $scope.PostopAnesthetistVitals = angular.copy($scope.GetPostopAnesthetistVitals());
                                    angular.forEach(resp[2].data.rows[0].AnesthetistVitals, function (item) {
                                        angular.forEach($scope.PostopAnesthetistVitals, function (kitem) {
                                            if (kitem.VitalId === 1 && kitem.VitalId === item.VitalsId) {
                                                let obj = {
                                                    "VitalValueId": 0,
                                                    "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                                    "VitalName": "Systolic Pressure",
                                                    "MainId": 1,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                    "Value": item.Value,
                                                    "DeleteInd": "N"
                                                };
                                                kitem.VitalValues.push(obj);
                                            }

                                            if (kitem.VitalId === 2 && kitem.VitalId === item.VitalsId) {
                                                let obj = {
                                                    "VitalValueId": 0,
                                                    "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                                    "VitalName": "Diastolic Pressure",
                                                    "MainId": 2,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                    "Value": item.Value,
                                                    "DeleteInd": "N"
                                                };
                                                kitem.VitalValues.push(obj);
                                            }

                                            if (kitem.VitalId === 3 && kitem.VitalId === item.VitalsId) {
                                                let obj = {
                                                    "VitalValueId": 0,
                                                    "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                                    "VitalName": "Pulse",
                                                    "MainId": 3,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                    "Value": item.Value,
                                                    "DeleteInd": "N"
                                                };
                                                kitem.VitalValues.push(obj);
                                            }

                                            if (kitem.VitalId === 4 && kitem.VitalId === item.VitalsId) {
                                                let obj = {
                                                    "VitalValueId": 0,
                                                    "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                                    "VitalName": "Resp.Rate",
                                                    "MainId": 4,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                    "Value": item.Value,
                                                    "DeleteInd": "N"
                                                };
                                                kitem.VitalValues.push(obj);
                                            }

                                            if (kitem.VitalId === 6 && kitem.VitalId === item.VitalsId) {
                                                let obj = {
                                                    "VitalValueId": 0,
                                                    "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                                    "VitalName": "O2 Saturation",
                                                    "MainId": 6,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                    "Value": item.Value,
                                                    "DeleteInd": "N"
                                                };
                                                kitem.VitalValues.push(obj);
                                            }
                                            if (kitem.VitalId === 9 && kitem.VitalId === item.VitalsId) {
                                                let obj = {
                                                    "VitalValueId": 0,
                                                    "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                                    "VitalName": "Notes",
                                                    "MainId": 9,
                                                    "VitalSlotTime": item.VitalSlotTime,
                                                    "Value": item.Value,
                                                    "DeleteInd": "N"
                                                };
                                                kitem.VitalValues.push(obj);
                                            }
                                        });
                                    });
                                    if ($scope.PostopAnesthetistVitals.length > 0) {
                                        angular.forEach($scope.PostopAnesthetistVitals, function (item) {
                                            item.VitalValues = _.uniq(item.VitalValues, false, function (p) { return p.PostOPAnesthesiaVitalsId; });
                                        });
                                    }
                                    $scope.NewTimeSlots = [];

                                    let tempArray = $filter('filter')($scope.PostopAnesthetistVitals, { 'VitalName': 'Systolic Pressure' }, true);
                                    if (tempArray.length > 0) {
                                        tempArray[0].VitalValues = tempArray[0].VitalValues || [];
                                        if (tempArray[0].VitalValues.length > 0) {
                                            angular.forEach(tempArray[0].VitalValues, function (kitem) {
                                                //$scope.NewTimeSlots.push({ 'Time': kitem.VitalSlotTime });
                                                let dummydate = "2024-01-01";
                                                let dummydatetime = dummydate + " " + kitem.VitalSlotTime;
                                                let newtime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");

                                                let tempArray = kitem.VitalSlotTime.split(":");
                                                let stringCounter = tempArray.join("");
                                                let counter = parseInt(stringCounter);

                                                $scope.NewTimeSlots.push({ 'time': kitem.VitalSlotTime, 'NewTime': newtime, 'counter': counter });
                                            });
                                        }
                                    }
                                }

                                $scope.AldreteDetails = angular.copy($scope.GetAldreteDetails());

                                if (resp[2].data.rows[0].AldreteDetails.length > 0) {
                                    angular.forEach(resp[2].data.rows[0].AldreteDetails, function (item) {
                                        angular.forEach($scope.AldreteDetails, function (kitem) {
                                            if (item.AldreteVitalId === kitem.AldreteVitalId) {
                                                let obj = {
                                                    "PatientPostOpAldreteValueId": null,
                                                    "PostOPAldreteDetailId": item.PostOPAldreteDetailId || 0,
                                                    "AldreteVitalSlotTime": item.AldreteVitalSlotTime || "",
                                                    "ValueId": item.ValueId,
                                                    "Score": item.Score,
                                                    "DeleteInd": "N"
                                                };
                                                kitem.AldreteValues.push(obj);
                                            }
                                        });
                                    });
                                }
                                $scope.AldreteTotalScoreDetails = [];
                                if (resp[2].data.rows[0].AldreteTotalScoreDetails.length > 0) {
                                    angular.forEach(resp[2].data.rows[0].AldreteTotalScoreDetails, function (item) {
                                        let obj = {
                                            "PostOPAnesthesiaTotalScoreId": item.PostOPAnesthesiaTotalScoreId || null,
                                            "AldreteSlotTime": item.AldreteSlotTime,
                                            "TotalScore": item.TotalScore,
                                            "DeleteInd": "N"
                                        }
                                        $scope.AldreteTotalScoreDetails.push(obj);
                                    });
                                }

                                var TempVitals1 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 1 }, true);
                                if (TempVitals1.length > 0) {
                                    if (TempVitals1[0].Value != "") {
                                        $scope.PostAnesthVitals.isSystolic = true;
                                    }


                                }
                                var TempVitals2 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 2 }, true);
                                if (TempVitals2.length > 0) {

                                    if (TempVitals2[0].Value != "") {
                                        $scope.PostAnesthVitals.isDiastolic = true;
                                    }

                                }
                                var TempVitals3 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 3 }, true);
                                if (TempVitals3.length > 0) {

                                    if (TempVitals3[0].Value != "") {
                                        $scope.PostAnesthVitals.isPulse = true;
                                    }
                                }
                                var TempVitals4 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 4 }, true);
                                if (TempVitals4.length > 0) {


                                    if (TempVitals4[0].Value != "") {
                                        $scope.PostAnesthVitals.isRespRate = true;
                                    }
                                }

                                var TempVitals5 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 6 }, true);
                                if (TempVitals5.length > 0) {


                                    if (TempVitals5[0].Value != "") {
                                        $scope.PostAnesthVitals.isO2Saturation = true;
                                    }
                                }

                                var TempVitals6 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 7 }, true);
                                if (TempVitals6.length > 0) {

                                    if (TempVitals6[0].Value != "") {
                                        $scope.PostAnesthVitals.isEKGLead = true;
                                    }
                                }

                                var TempVitals7 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 8 }, true);
                                if (TempVitals7.length > 0) {

                                    if (TempVitals7[0].Value != "") {
                                        $scope.PostAnesthVitals.isETCO2 = true;
                                    }
                                }

                                if ($scope.PostAnesthVitals.isSystolic == false && $scope.PostAnesthVitals.isETCO2 == false && $scope.PostAnesthVitals.isEKGLead == false && $scope.PostAnesthVitals.isO2Saturation == false && $scope.PostAnesthVitals.isDiastolic == false && $scope.PostAnesthVitals.isPulse == false && $scope.PostAnesthVitals.isRespRate == false) {
                                    $scope.PostAnesthVitals.isAllVitals = false;
                                } else {
                                    $scope.PostAnesthVitals.isAllVitals = true;
                                }

                                $scope.NewTimeSlots = $scope.NewTimeSlots || [];
                                if ($scope.PostAnesthVitals.isAllVitals == false && $scope.NewTimeSlots.length == 0) {
                                    $scope.PostAnesthVitals.OverallNurseAction = false;
                                } else {
                                    $scope.PostAnesthVitals.OverallNurseAction = true;
                                }

                                resp[2].data.rows[0].InvestigationsList = resp[2].data.rows[0].InvestigationsList || [];
                                if (resp[2].data.rows[0].InvestigationsList.length > 0) {
                                    $scope.PostOpQuickSummaryObj.SurgeonObj.InvestigationsList = angular.copy(resp[2].data.rows[0].InvestigationsList);
                                } else {
                                    $scope.PostOpQuickSummaryObj.SurgeonObj.InvestigationsList = [];
                                }
                                resp[2].data.rows[0].Prescription = resp[2].data.rows[0].Prescription || [];
                                if (resp[2].data.rows[0].Prescription.length > 0) {
                                    $scope.PostOpQuickSummaryObj.PrescriptionDetails = angular.copy(resp[2].data.rows[0].Prescription);
                                } else {
                                    $scope.PostOpQuickSummaryObj.PrescriptionDetails = [];
                                }

                                $scope.PostOpQuickSummaryObj.ReviewDoctorId = resp[2].data.rows[0].ReviewDoctorId != null ? resp[2].data.rows[0].ReviewDoctorId : "";
                                $scope.PostOpQuickSummaryObj.ReviewNurseId = resp[2].data.rows[0].ReviewNurseId != null ? resp[2].data.rows[0].ReviewNurseId : "";
                                $scope.PostOpQuickSummaryObj.ReviewAnesthetistId = resp[2].data.rows[0].ReviewAnesthetistId != null ? resp[2].data.rows[0].ReviewAnesthetistId : "";
                                $scope.PostOpQuickSummaryObj.ReviewTechnicianId = resp[2].data.rows[0].ReviewTechnicianId != null ? resp[2].data.rows[0].ReviewTechnicianId : "";

                                $scope.PostOpQuickSummaryObj.R2ReviewNurseId = resp[2].data.rows[0].R2ReviewNurseId != null ? resp[2].data.rows[0].R2ReviewNurseId : "";
                                $scope.PostOpQuickSummaryObj.R2ReviewAnesthetistId = resp[2].data.rows[0].R2ReviewAnesthetistId != null ? resp[2].data.rows[0].R2ReviewAnesthetistId : "";


                                if ($scope.PostOpQuickSummaryObj.ReviewDoctorId != 0 || $scope.PostOpQuickSummaryObj.ReviewDoctorId != null) {
                                    var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.ReviewDoctorId });
                                }
                                doctorlist = doctorlist || [];
                                if (doctorlist.length > 0) {
                                    $scope.PostOpQuickSummaryObj.DoctorName = angular.copy(doctorlist[0].UserFullName);
                                    //$scope.PostOpQuickSummaryObj.DoctorSuffix = angular.copy(doctorlist[0].SuffixName);
                                    $scope.PostOpQuickSummaryObj.DoctorLicense = angular.copy(doctorlist[0].LicenseNumber);
                                    //if (doctorlist[0].SuffixId == 10) {
                                    //    $scope.PostOpQuickSummaryObj.DoctorName = ' Dr. ' + $scope.PostOpQuickSummaryObj.DoctorName;
                                    //}
                                } else {
                                    $scope.PostOpQuickSummaryObj.DoctorName = "";
                                    // $scope.PostOpQuickSummaryObj.DoctorSuffix = '';
                                    $scope.PostOpQuickSummaryObj.DoctorLicense = '';
                                }

                                if ($scope.PostOpQuickSummaryObj.ReviewAnesthetistId != 0 || $scope.PostOpQuickSummaryObj.ReviewAnesthetistId != null) {
                                    var anesthlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.ReviewAnesthetistId });
                                }
                                anesthlist = anesthlist || [];
                                if (anesthlist.length > 0) {
                                    $scope.PostOpQuickSummaryObj.AnesthesiaName = angular.copy(anesthlist[0].UserFullName);
                                    //$scope.PostOpQuickSummaryObj.AnesthesiaSuffix = angular.copy(anesthlist[0].SuffixName);
                                    $scope.PostOpQuickSummaryObj.AnesthesiaLicense = angular.copy(anesthlist[0].LicenseNumber);
                                    //if (anesthlist[0].SuffixId == 10) {
                                    //    $scope.PostOpQuickSummaryObj.AnesthesiaName = ' Dr. ' + $scope.PostOpQuickSummaryObj.AnesthesiaName;
                                    //}
                                } else {
                                    $scope.PostOpQuickSummaryObj.AnesthesiaName = "";
                                    //$scope.PostOpQuickSummaryObj.AnesthesiaSuffix = '';
                                    $scope.PostOpQuickSummaryObj.AnesthesiaLicense = '';
                                }

                                if ($scope.PostOpQuickSummaryObj.ReviewNurseId != 0 || $scope.PostOpQuickSummaryObj.ReviewNurseId != null) {
                                    var Nurslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.ReviewNurseId });
                                }
                                Nurslist = Nurslist || [];
                                if (Nurslist.length > 0) {
                                    $scope.PostOpQuickSummaryObj.NurseName = angular.copy(Nurslist[0].FullName);
                                    $scope.PostOpQuickSummaryObj.NurseSuffix = angular.copy(Nurslist[0].SuffixName);
                                    $scope.PostOpQuickSummaryObj.NurseLicense = angular.copy(Nurslist[0].LicenseNumber);
                                } else {
                                    $scope.PostOpQuickSummaryObj.NurseName = "";
                                    $scope.PostOpQuickSummaryObj.NurseSuffix = '';
                                    $scope.PostOpQuickSummaryObj.NurseLicense = '';
                                }

                                let R2Nurslist = []
                                if ($scope.PostOpQuickSummaryObj.R2ReviewNurseId) {
                                    R2Nurslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.R2ReviewNurseId });
                                }
                                R2Nurslist = R2Nurslist || [];
                                if (R2Nurslist.length > 0) {
                                    $scope.PostOpQuickSummaryObj.R2NurseName = angular.copy(R2Nurslist[0].FullName);
                                    $scope.PostOpQuickSummaryObj.R2NurseSuffix = angular.copy(R2Nurslist[0].SuffixName);
                                    $scope.PostOpQuickSummaryObj.R2NurseLicense = angular.copy(R2Nurslist[0].LicenseNumber);
                                } else {
                                    $scope.PostOpQuickSummaryObj.R2NurseName = "";
                                    $scope.PostOpQuickSummaryObj.R2NurseSuffix = '';
                                    $scope.PostOpQuickSummaryObj.R2NurseLicense = '';
                                }
                                let R2anesthlist = [];
                                if ($scope.PostOpQuickSummaryObj.R2ReviewAnesthetistId) {
                                    R2anesthlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.R2ReviewAnesthetistId });
                                }
                                R2anesthlist = R2anesthlist || [];
                                if (R2anesthlist.length > 0) {
                                    $scope.PostOpQuickSummaryObj.R2AnesthesiaName = angular.copy(R2anesthlist[0].UserFullName);
                                    $scope.PostOpQuickSummaryObj.R2AnesthesiaLicense = angular.copy(R2anesthlist[0].LicenseNumber);
                                    
                                } else {
                                    $scope.PostOpQuickSummaryObj.R2AnesthesiaName = "";
                                    $scope.PostOpQuickSummaryObj.R2AnesthesiaLicense = '';
                                }



                                if ($scope.PostOpQuickSummaryObj.ReviewTechnicianId != 0 || $scope.PostOpQuickSummaryObj.ReviewTechnicianId != null) {
                                    var Technicianlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.ReviewTechnicianId });
                                }
                                Technicianlist = Technicianlist || [];
                                if (Technicianlist.length > 0) {
                                    $scope.PostOpQuickSummaryObj.TechnicianName = angular.copy(Technicianlist[0].FullName);
                                    $scope.PostOpQuickSummaryObj.TechnicianSuffix = angular.copy(Technicianlist[0].SuffixName);
                                    $scope.PostOpQuickSummaryObj.TechnicianLicense = angular.copy(Technicianlist[0].LicenseNumber);
                                } else {
                                    $scope.PostOpQuickSummaryObj.TechnicianName = "";
                                    $scope.PostOpQuickSummaryObj.TechnicianSuffix = '';
                                    $scope.PostOpQuickSummaryObj.TechnicianLicense = '';
                                }

                                if ($scope.PostOpQuickSummaryObj.DoctorName != '' || $scope.PostOpQuickSummaryObj.AnesthesiaName != '' || $scope.PostOpQuickSummaryObj.NurseName != '' || $scope.PostOpQuickSummaryObj.TechnicianName != '') {
                                    $scope.PostOpQuickSummaryObj.ReviewedbyInd = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.ReviewedbyInd = false;
                                }


                                if (resp[2].data.rows[0].OrderDetails.length > 0) {
                                    $scope.PostOpQuickSummaryObj.OrderDetails = resp[2].data.rows[0].OrderDetails || [];
                                    angular.forEach($scope.PostOpQuickSummaryObj.OrderDetails, function (Mitem) {
                                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                        if (Mitem.ReviewedBy != null) {
                                            var Arraylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == Mitem.ReviewedBy }, true);
                                            if (Arraylist.length > 0) {
                                                Mitem.ReviewedByName = Arraylist[0].FullName + ' ' + Arraylist[0].SuffixName;
                                            }
                                        }

                                        Mitem.UserOrderId = Mitem.UserOrderId || null;
                                        Mitem.UserType = Mitem.UserType || null;
                                        Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                        Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                        Mitem.LicenseNumber = Mitem.LicenseNumber || '';
                                        Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                                        if (Mitem.PostOpMedications.length > 0) {
                                            if (Mitem.PostOpMedications.length > 0) {
                                                angular.forEach(Mitem.PostOpMedications, function (item) {
                                                    var dateTimeString = item.ModifiedDt;
                                                    $scope.ModifiedPostopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');

                                                });
                                            }

                                        }


                                    });
                                    if ($scope.PostOpQuickSummaryObj.OrderDetails.length > 0) {
                                        var MedCount = 0;
                                        var GenCount = 0;

                                        angular.forEach($scope.PostOpQuickSummaryObj.OrderDetails, function (item) {
                                            if (item.PostOpMedications.length > 0) {
                                                MedCount++;
                                            };
                                            if (item.GeneralOrders.length > 0) {
                                                GenCount++;
                                            };
                                        });

                                        if (MedCount !== 0) {
                                            $scope.IspostopMedications = true;
                                        } else {
                                            $scope.IspostopMedications = false;
                                        };

                                        if (GenCount !== 0) {
                                            $scope.IsPostopGenOrders = true;
                                        } else {
                                            $scope.IsPostopGenOrders = false;
                                        };
                                    } else {
                                        $scope.PostOpQuickSummaryObj.OrderDetails = [];

                                        $scope.IspostopMedications = false;
                                        $scope.IsPostopGenOrders = false;
                                    }


                                }




                        

                                $scope.PostOpQuickSummaryObj.MedicationsReviewId = resp[2].data.rows[0].MedicationsReviewId != null ? resp[2].data.rows[0].MedicationsReviewId : null;
                                if ($scope.PostOpQuickSummaryObj.MedicationsReviewId != 0 || $scope.PostOpQuickSummaryObj.MedicationsReviewId != null) {
                                    var reviewlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.MedicationsReviewId }) || [];
                                }
                                reviewlist = reviewlist || [];
                                if (reviewlist.length > 0) {


                                    var LicenseNumber = "";
                                    reviewlist[0].LicenseNumber = reviewlist[0].LicenseNumber || "";
                                    if (reviewlist[0].LicenseNumber != "") {
                                        LicenseNumber = 'Lic:' + ' ' + reviewlist[0].LicenseNumber + ',';
                                    }
                                    $scope.PostOpQuickSummaryObj.MedicationsReviewName = angular.copy(reviewlist[0].UserFullName + ' ' + LicenseNumber);


                                } else {
                                    $scope.PostOpQuickSummaryObj.MedicationsReviewName = "";
                                }

                                $scope.ModifiedPostopDate = "";


                                //if (resp[2].data.rows[0].PostOpMedications.length > 0) {
                                //    angular.forEach(resp[2].data.rows[0].PostOpMedications, function (hitem) {
                                //        var dateTimeString = hitem.ModifiedDt;

                                //        $scope.ModifiedPostopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');

                                //    });
                                //}

                                $scope.PostOpQuickSummaryObj.MedicationsNotes = resp[2].data.rows[0].MedicationsNotes || "";

                                // Progress Note

                                $scope.PostOpQuickSummaryObj.ProgressPatientStable = resp[2].data.rows[0].ProgressPatientStable || "";
                                $scope.PostOpQuickSummaryObj.ProgressPatientwheelchairNotes = resp[2].data.rows[0].ProgressPatientwheelchairNotes || "";
                                $scope.PostOpQuickSummaryObj.ProgressPatienttransferred = resp[2].data.rows[0].ProgressPatienttransferred || "";
                                $scope.PostOpQuickSummaryObj.IsPostProceduresNotes = resp[2].data.IsPostProceduresNotes || false;
                                $scope.PostOpQuickSummaryObj.ProgressOverAllNotes = resp[2].data.rows[0].ProgressOverAllNotes || "";

                                resp[2].data.rows[0].RecoveryStartTime = resp[2].data.rows[0].RecoveryStartTime || '';
                                if (resp[2].data.rows[0].RecoveryStartTime != '') {
                                    $scope.PostOpQuickSummaryObj.RecoveryStartTime = resp[2].data.rows[0].RecoveryStartTime || "";
                                }

                                resp[2].data.rows[0].RecoveryStopTime = resp[2].data.rows[0].RecoveryStopTime || "";
                                if (resp[2].data.rows[0].RecoveryStopTime != "") {
                                    $scope.PostOpQuickSummaryObj.RecoveryStopTime = resp[2].data.rows[0].RecoveryStopTime || "";
                                }

                                var ProgressarrayList = $filter('filter')($scope.PostOpQuickSummaryObj.OrgASCChecklist, { 'CheckListSubTypeId': 18, 'IsChecked': true }, true) || [];

                                if ($scope.PostOpQuickSummaryObj.ProgressPatientStable != '' || $scope.PostOpQuickSummaryObj.ProgressPatienttransferred != '' || $scope.PostOpQuickSummaryObj.ProgressPatientwheelchairNotes != '' || $scope.PostOpQuickSummaryObj.IsPostProceduresNotes == true || ProgressarrayList.length > 0) {
                                    $scope.PostOpQuickSummaryObj.IsPostOpProgressNotesInd = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.IsPostOpProgressNotesInd = false;
                                }

                                // patient goals functionality
                                $scope.PatientGoalsArray = resp[2].data.rows[0].PatientAscPatientGoal || [];
                                if (resp[2].data.rows[0].PatientAscPatientGoal.length > 0) {
                                    angular.forEach(resp[2].data.rows[0].PatientAscPatientGoal, function (item) {
                                        angular.forEach($scope.PostOpQuickSummaryObj.MasterAscPatientGoal, function (kitem) {
                                            if (kitem.MasterPatientGoalId === item.MasterPatientGoalId) {
                                                kitem.Value = item.Value || "";
                                                kitem.ASCPatientGoalId = item.ASCPatientGoalId || null;
                                            }
                                        });
                                    });
                                }

                                // Modified Date 

                                $scope.ModifiedDate = "";
                                resp[2].data.rows[0].ModifiedDt = resp[2].data.rows[0].ModifiedDt || "";
                                if (resp[2].data.rows[0].ModifiedDt != "") {
                                    var dateTimeString = resp[2].data.rows[0].ModifiedDt || "";
                                    $scope.ModifiedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                }

                                // High criteria 

                                $scope.PostOpQuickSummaryObj.HighCriteria = resp[2].data.rows[0].HighCriteria || "";
                                $scope.PostOpQuickSummaryObj.HighCriteriaRemarks = resp[2].data.rows[0].HighCriteriaRemarks || "";

                                if ($scope.PostOpQuickSummaryObj.HighCriteriaRemarks != '') {
                                    $scope.PostOpQuickSummaryObj.ProgressRemarksInd = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.ProgressRemarksInd = false;
                                }

                                $scope.PostOpQuickSummaryObj.CheckInReviewDoctorId = resp[2].data.rows[0].CheckInReviewDoctorId || null;
                                $scope.PostOpQuickSummaryObj.CheckInReviewNurseId = resp[2].data.rows[0].CheckInReviewNurseId || null;
                                $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistId = resp[2].data.rows[0].CheckInReviewAnesthetistId || null;

                                $scope.PostOpQuickSummaryObj.PostOpAnesthesiaNotes = resp[2].data.rows[0].PostOpAnesthesiaNotes || null;
                                $scope.PostOpQuickSummaryObj.IsPatientDischarge = resp[2].data.rows[0].IsPatientDischarge || false;


                                $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = "";
                                $scope.PostOpQuickSummaryObj.CheckInReviewNurseName = "";
                                $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = "";


                                if ($scope.PostOpQuickSummaryObj.CheckInReviewDoctorId != null) {
                                    var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.CheckInReviewDoctorId });

                                    if (doctorlist.length > 0) {
                                        var License = '';
                                        //var Suffix = '';

                                        //if (doctorlist[0].SuffixName !== '') {
                                        //    Suffix = doctorlist[0].SuffixName + ',';
                                        //}
                                        if (doctorlist[0].LicenseNumber !== '') {
                                            License = 'Lic: ' + doctorlist[0].LicenseNumber;
                                        }
                                        $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = doctorlist[0].UserFullName + ' ' + License
                                        //if (doctorlist[0].SuffixId == 10) {
                                        //    $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = ' Dr. ' + doctorlist[0].FullName + ' ' + Suffix + ' ' + License;
                                        //} else {
                                        //    $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = doctorlist[0].FullName + ' ' + Suffix + ' ' + License;
                                        //}
                                    }
                                } else {
                                    $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = "";
                                }

                                if ($scope.PostOpQuickSummaryObj.CheckInReviewNurseId != null) {
                                    var Nurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.CheckInReviewNurseId });

                                    if (Nurselist.length > 0) {
                                        var License = '';
                                        var Suffix = '';

                                        if (Nurselist[0].SuffixName !== '') {
                                            Suffix = Nurselist[0].SuffixName + ',';
                                        }
                                        if (Nurselist[0].LicenseNumber !== '') {
                                            License = 'Lic: ' + Nurselist[0].LicenseNumber;
                                        }

                                        if (Nurselist[0].SuffixId == 10) {
                                            $scope.PostOpQuickSummaryObj.CheckInReviewNurseName = ' Dr. ' + Nurselist[0].FullName + ' ' + Suffix + ' ' + License;
                                        } else {
                                            $scope.PostOpQuickSummaryObj.CheckInReviewNurseName = Nurselist[0].FullName + ' ' + Suffix + ' ' + License;
                                        }
                                    }
                                } else {
                                    $scope.PostOpQuickSummaryObj.CheckInReviewNurseName = "";
                                }


                                if ($scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistId != null) {
                                    var Anesthetist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistId });

                                    if (Anesthetist.length > 0) {
                                        var License = '';
                                        //var Suffix = '';

                                        //if (Anesthetist[0].SuffixName !== '') {
                                        //    Suffix = Anesthetist[0].SuffixName + ',';
                                        //}
                                        if (Anesthetist[0].LicenseNumber !== '') {
                                            License = 'Lic: ' + Anesthetist[0].LicenseNumber;
                                        }
                                        $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = Anesthetist[0].UserFullName + ' ' + License;

                                        //if (Anesthetist[0].SuffixId == 10) {
                                        //    $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = ' Dr. ' + Anesthetist[0].FullName + ' ' + Suffix + ' ' + License;
                                        //} else {
                                        //    $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = Anesthetist[0].FullName + ' ' + Suffix + ' ' + License;
                                        //}
                                    }
                                } else {
                                    $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = "";
                                }
                                var ASCChecklist = '';
                                ASCChecklist = $filter('filter')($scope.PostOpQuickSummaryObj.OrgASCChecklist, { IsChecked: true }, true) || [];

                                if (ASCChecklist.length > 0 || $scope.PostOpQuickSummaryObj.HighCriteriaRemarks != '' || $scope.PostOpQuickSummaryObj.CheckInReviewDoctorId != null || $scope.PostOpQuickSummaryObj.CheckInReviewNurseId != null || $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistId != null) {
                                    $scope.PostOpQuickSummaryObj.IsPostOpHighCriteria = true;
                                } else {
                                    $scope.PostOpQuickSummaryObj.IsPostOpHighCriteria = false;
                                }
                                // Hight Criteria End
                            }
                        } else {
                            $scope.PostOpQuickSummaryObj.Vitals = [];
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PostOPNurseCheckListId = 0;
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceived = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.AccompaniedBy = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.NourishmentProvider = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.BloodSugar = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PostOpInstruction = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ReceivedRoom = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientallowed = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Personalbelonging = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientadvised = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientClinic = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Physicianexamine = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Removedintact = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Orientedtimes = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Checklists.OtherMental = "";

                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOPNurseActionId = 0;
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Vision = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Pain = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.ConsciousLevel = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Fur = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.IncisionlaDrainage = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Nausea = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.IngestedFood = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Referred = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Relationship = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Exit = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Instruction = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Prescription = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.LensCard = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Surveillance = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Bandage = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Advancediet = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Discharge = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Administer = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Tylenol = "";
                            $scope.PostOpQuickSummaryObj.NurseChart.Actions.Review = "";
                            $scope.PostOpQuickSummaryObj.SurgeonObj.InvestigationsList = [];
                            $scope.PostOpQuickSummaryObj.PrescriptionDetails = [];
                            $scope.PostOpQuickSummaryObj.ReviewedbyInd = false;
                        }
                    });
                }
                $scope.IsSocialHealthArrayShowInd = false;

                $scope.GetPreAdmissionDetails = function () {

                    let appointmentId = null;
                    if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
                        appointmentId = $scope.SelectedAppointmentId;
                    }

                    if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
                        appointmentId = $scope.SelectedAppointmentId;
                    }

                    let PatientSurgeryId = null;
                    if ($scope.SelectedAppointmentTypeId == 7) {
                        //if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
                        //    PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
                        //}
                    } else if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
                        if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                            PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
                        }
                    }

                    let ReqObj = {
                        "UserId": $scope.UserId,
                        "OrganizationId": $scope.HospitalId,
                        "AppointmentId": appointmentId || 0,
                        "PatientId": $scope.cacheStorageItem.PatientID || 0,
                        "AppointmentTypeId": $scope.SelectedAppointmentTypeId || 0,
                        "PatientSurgeryId": PatientSurgeryId || null,
                    };

                    $q.all([
                        eHnoteSurgeryService.GetPatientPreAdmissionDetails(ReqObj),
                    ]).then(function (resp) {

                        if (resp[0].data.status === "Success") {
                            if (resp[0].data.LastSignOffUserDetails.length > 0) {
                                $scope.PreAdmAnesthetistQuickSummary.LastSignOffUserDetails = resp[0].data.LastSignOffUserDetails || [];
                            } else {
                                $scope.PreAdmAnesthetistQuickSummary.LastSignOffUserDetails = [];
                            }

                            if (resp[0].data.AllergyItems.length > 0) {
                                $scope.PreAdmAnesthetistQuickSummary.AllergyItems = resp[0].data.AllergyItems || [];
                            } else {
                                $scope.PreAdmAnesthetistQuickSummary.AllergyItems = [];
                            }
                            if (resp[0].data.CurrentEyeMedicationList.length > 0) {
                                $scope.PreAdmAnesthetistQuickSummary.CurrentEyeMedications = resp[0].data.CurrentEyeMedicationList || [];
                            } else {
                                $scope.PreAdmAnesthetistQuickSummary.CurrentEyeMedications = [];
                            }
                            if (resp[0].data.CurrentSystemicMedicationList.length > 0) {
                                $scope.PreAdmAnesthetistQuickSummary.CurrentSystemicMedicationsHistory = resp[0].data.CurrentSystemicMedicationList || [];
                            } else {
                                $scope.PreAdmAnesthetistQuickSummary.CurrentSystemicMedicationsHistory = [];
                            }
                            if (resp[0].data.SurgicalHistory.length > 0) {
                                $scope.PreAdmAnesthetistQuickSummary.SurgicalHistory = resp[0].data.SurgicalHistory || [];
                            } else {
                                $scope.PreAdmAnesthetistQuickSummary.SurgicalHistory = [];
                            }

                            if (resp[0].data.ROSOverAllRemarks != '') {
                                $scope.PreAdmAnesthetistQuickSummary.ROSOverAllRemarks = resp[0].data.ROSOverAllRemarks || [];
                            } else {
                                $scope.PreAdmAnesthetistQuickSummary.ROSOverAllRemarks = '';
                            }

                            $scope.PreAdmAnesthetistQuickSummary.ROSOverAllRemarks = resp[0].data.ROSOverAllRemarks || '';

                            if (resp[0].data.SystemicOtherData != undefined) {
                                let respObjSys = resp[0].data.SystemicOtherData;
                                $scope.PreAdmAnesthetistQuickSummary.IsCardiacWNL = respObjSys.IsCardiacWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsCNSHistory = respObjSys.IsCNSHistory || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsCardiacWNL = respObjSys.IsCardiacWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsCardiovascularHistory = respObjSys.IsCardiovascularHistory || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsAutoImmuneDisordersWNL = respObjSys.IsAutoImmuneDisordersWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsEndocrineWNL = respObjSys.IsEndocrineWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsHemeOncWNL = respObjSys.IsHemeOncWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsHepaticWNL = respObjSys.IsHepaticWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsKidneyDiseaseWNL = respObjSys.IsKidneyDiseaseWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsMusculoSkeletalSystemWNL = respObjSys.IsMusculoSkeletalSystemWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsNervousSystemWNL = respObjSys.IsNervousSystemWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsNeurologicWNL = respObjSys.IsNeurologicWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsOthersWNL = respObjSys.IsOthersWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsPsychosisWNL = respObjSys.IsPsychosisWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsPulmonaryWNL = respObjSys.IsPulmonaryWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsRespiratoryNormal = respObjSys.IsRespiratoryNormal || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsHeentWNL = respObjSys.IsHeentWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsLungsWNL = respObjSys.IsLungsWNL || false;
                                $scope.PreAdmAnesthetistQuickSummary.IsGeneralappearanceWNL = respObjSys.IsGeneralappearanceWNL || false;

                                $scope.PreAdmAnesthetistQuickSummary.GeneralAppearenceNotes = respObjSys.GeneralAppearenceNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.GeneralAppearenceNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showGeneralAppearenceNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showGeneralAppearenceNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.HeentNotes = respObjSys.HeentNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.HeentNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showHeentNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showHeentNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.LungsNotes = respObjSys.LungsNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.LungsNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showLungsNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showLungsNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.CardiacNotes = respObjSys.CardiacNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.CardiacNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showCardiacNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showCardiacNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.NeurologicNotes = respObjSys.NeurologicNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.NeurologicNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showNeurologicNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showNeurologicNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.PulmonaryNotes = respObjSys.PulmonaryNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.PulmonaryNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showPulmonaryNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showPulmonaryNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.HepaticNotes = respObjSys.HepaticNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.HepaticNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showHepaticNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showHepaticNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.HemeOncNotes = respObjSys.HemeOncNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.HemeOncNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showHemeOncNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showHemeOncNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.NervousSystemNotes = respObjSys.NervousSystemNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.NervousSystemNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showNervousSystemNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showNervousSystemNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.KidneyDiseaseNotes = respObjSys.KidneyDiseaseNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.KidneyDiseaseNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showKidneyDiseaseNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showKidneyDiseaseNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.MusculoSkeletalSystemNotes = respObjSys.MusculoSkeletalSystemNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.MusculoSkeletalSystemNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showMusculoSkeletalSystemNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showMusculoSkeletalSystemNotes = false;
                                }
                                $scope.PreAdmAnesthetistQuickSummary.PsychosisNotes = respObjSys.PsychosisNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.PsychosisNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showPsychosisNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showPsychosisNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.OthersNotes = respObjSys.OthersNotes || '';
                                if ($scope.PreAdmAnesthetistQuickSummary.OthersNotes !== '') {
                                    $scope.PreAdmAnesthetistQuickSummary.showOthersNotes = true;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.showOthersNotes = false;
                                }

                                $scope.PreAdmAnesthetistQuickSummary.EndocrineNotes = respObjSys.EndocrineNotes || '';

                            }



                            $scope.PreAdmAnesthetistQuickSummary.AllergyRemarks = resp[0].data.AllergyRemarks || '';
                            $scope.PreAdmAnesthetistQuickSummary.SurgicalRemarks = resp[0].data.SurgicalRemarks || '';
                            $scope.PreAdmAnesthetistQuickSummary.CurrentSystemicRemarks = resp[0].data.CurrentSystemicRemarks || '';
                            $scope.PreAdmAnesthetistQuickSummary.CurrentEyeRemarks = resp[0].data.CurrentEyeRemarks || '';
                            $scope.PreAdmAnesthetistQuickSummary.SystemicHistoryRemarks = resp[0].data.SystemicHistoryRemarks || '';
                            $scope.PreAdmAnesthetistQuickSummary.LifestyleHistoryRemarks = resp[0].data.LifestyleHistoryRemarks || '';
                            $scope.PreAdmAnesthetistQuickSummary.RespiratoryRemarks = resp[0].data.RespiratoryRemarks || '';

                            $scope.PreAdmAnesthetistQuickSummary.InvestigationsList = angular.copy(resp[0].data.InvestigationsList) || [];
                            $scope.PreAdmAnesthetistQuickSummary.MedicineOrdersList = angular.copy(resp[0].data.Prescription) || [];
                            $scope.PreAdmAnesthetistQuickSummary.DocumentDetails = angular.copy(resp[0].data.DocumentDetails) || [];
                            $scope.PreAdmAnesthetistQuickSummary.InvestigationsList = angular.copy(resp[0].data.InvestigationsList) || [];
                            $scope.PreAdmAnesthetistQuickSummary.LifestyleDetail = angular.copy(resp[0].data.LifestyleDetail) || [];

                            $scope.PreAdmAnesthetistQuickSummary.PhysicalEvaluationArray = angular.copy(resp[0].data.PhysicalEvaluationDetails) || [];
                            //$scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails = angular.copy(resp[0].data.PreAdmissionDetails[0].OrderDetails) || [];



                            if (resp[0].data.PreAdmissionDetails.length > 0) {
                                $scope.AnesthesiaPreAdmissionDetails = angular.copy(resp[0].data.PreAdmissionDetails);
                                $scope.PreAdmissionDetails = angular.copy(resp[0].data.PreAdmissionDetails[0]);

                                $scope.PreAdmAnesthetistQuickSummary.PhysicalNeurologicNotes = $scope.PreAdmissionDetails.PhysicalNeurologicNotes || '';
                                $scope.PreAdmAnesthetistQuickSummary.PhysicalGeneralNotes = $scope.PreAdmissionDetails.PhysicalGeneralNotes || '';
                                $scope.PreAdmAnesthetistQuickSummary.PhysicalCardiocNotes = $scope.PreAdmissionDetails.PhysicalCardiocNotes || '';
                                $scope.PreAdmAnesthetistQuickSummary.PhysicalHepaticNotes = $scope.PreAdmissionDetails.PhysicalHepaticNotes || '';
                                $scope.PreAdmAnesthetistQuickSummary.PhysicalPulmonaryNotes = $scope.PreAdmissionDetails.PhysicalPulmonaryNotes || '';

                                $scope.PreAdmAnesthetistQuickSummary.LastDialysisDate = $scope.PreAdmissionDetails.LastDialysisDate || null;
                                if ($scope.PreAdmAnesthetistQuickSummary.LastDialysisDate !== null) {
                                    $scope.PreAdmAnesthetistQuickSummary.LastDialysisDate = moment($scope.PreAdmAnesthetistQuickSummary.LastDialysisDate).format("MM-DD-YYYY");
                                };

                                if ($scope.PreAdmissionDetails.OrderDetails.length > 0) {
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails = [];

                                    $scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails = $scope.PreAdmissionDetails.OrderDetails || [];
                                    angular.forEach($scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails, function (Mitem) {
                                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                        Mitem.UserOrderId = Mitem.UserOrderId || null;
                                        Mitem.UserType = Mitem.UserType || null;
                                        Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                        Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                        Mitem.ModifiedDt = Mitem.ModifiedDt || '';
                                        Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                                        Mitem.PreAdmAnesthetistObj = angular.copy(Mitem.PrescriptionArray) || [];
                                        Mitem.PrescriptionMainAddObj = {
                                            "PatientPrescriptionId": 0,
                                            "PrescriptionDetails": [],
                                        };
                                        if (Mitem.PreAdmAnesthetistObj.length > 0) {
                                            Mitem.PrescriptionMainAddObj.PatientPrescriptionId = Mitem.PreAdmAnesthetistObj[0].PatientPrescriptionId;
                                            Mitem.PrescriptionMainAddObj.PrescriptionDetails = angular.copy(Mitem.PreAdmAnesthetistObj[0].PrescriptionDetails) || [];

                                            angular.forEach(Mitem.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                                item.StartDate = item.StartDate || null;
                                                item.StopDate = item.StopDate || null;
                                                if (item.StartDate != null) {
                                                    item.StartDate = moment(item.StartDate).format("MM-DD-YYYY");
                                                }
                                                if (item.StopDate != null) {
                                                    item.StopDate = moment(item.StopDate).format("MM-DD-YYYY");
                                                }
                                                item.SigObj = item.Sig;
                                            });
                                        }

                                        if (Mitem.Investigationslist.length > 0) {
                                            angular.forEach(Mitem.Investigationslist, function (item) {
                                                item.DurationDate = item.DurationDate || '';
                                                if (item.DurationDate !== '') {
                                                    item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                                    item.ShowDateFormat = true;
                                                } else {
                                                    item.ShowDateFormat = false;
                                                }
                                                item.InvestigationNotes = item.InvestigationNotes || '';
                                                if (item.InvestigationNotes !== '') {
                                                    item.IsNoteEdit = true;
                                                }
                                            });
                                        }
                                    });

                                    if ($scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails.length > 0) {
                                        var AnesPresCount = 0;
                                        var AnesInvesCount = 0;
                                        var AnesGeneralCount = 0;

                                        angular.forEach($scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails, function (item) {

                                            if (item.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                                                AnesPresCount++;
                                            };
                                            if (item.Investigationslist.length > 0) {
                                                AnesInvesCount++;
                                            };
                                            if (item.GeneralOrders.length > 0) {
                                                AnesGeneralCount++;
                                            };

                                        });
                                        if (AnesPresCount !== 0) {
                                            $scope.IsAnesMedications = true;
                                        } else {
                                            $scope.IsAnesMedications = false;
                                        };

                                        if (AnesGeneralCount !== 0) {
                                            $scope.IsAnesGenOrders = true;
                                        } else {
                                            $scope.IsAnesGenOrders = false;
                                        };
                                        if (AnesInvesCount !== 0) {
                                            $scope.IsAnesInvestigation = true;
                                        } else {
                                            $scope.IsAnesInvestigation = false;
                                        };

                                    } else {
                                        $scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails = [];
                                        $scope.IsAnesMedications = false;
                                        $scope.IsAnesGenOrders = false;
                                        $scope.IsAnesInvesCount = false;


                                    }

                                }

                                $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy = $scope.PreAdmissionDetails.ReviwedBy || null;
                                $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = $scope.PreAdmissionDetails.ReviwedByName || '';
                                $scope.PreAdmAnesthetistQuickSummary.AnesthetistLicNo = $scope.PreAdmissionDetails.ReviwedByLICNumber || '';


                                if ($scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy !== null) {
                                    var AnesthetistReviewedlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy }) || [];
                                    if (AnesthetistReviewedlist.length > 0) {
                                        var SuffixName = '';
                                        AnesthetistReviewedlist[0].SuffixName = AnesthetistReviewedlist[0].SuffixName || '';
                                        if (AnesthetistReviewedlist[0].SuffixName != "") {
                                            SuffixName = AnesthetistReviewedlist[0].SuffixName;
                                        }

                                        var LicenseNumber = "";

                                        AnesthetistReviewedlist[0].LicenseNumber = AnesthetistReviewedlist[0].LicenseNumber || "";
                                        if (AnesthetistReviewedlist[0].LicenseNumber != "") {
                                            LicenseNumber = 'LIC :' + ' ' + AnesthetistReviewedlist[0].LicenseNumber;
                                        }

                                        if (AnesthetistReviewedlist[0].SuffixId == 10) {
                                            $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = angular.copy(AnesthetistReviewedlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                        } else {
                                            $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = angular.copy(AnesthetistReviewedlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                        }
                                        //$scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = AnesthetistReviewedlist[0].FullName || '';
                                    }
                                }

                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy = $scope.PreAdmissionDetails.AnesthesiologistReviewedBy || null;
                                if ($scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy !== null) {
                                    var AnesthesiologistReviewedlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy }) || [];
                                    if (AnesthesiologistReviewedlist.length > 0) {
                                     

                                        var LicenseNumber = "";

                                        AnesthesiologistReviewedlist[0].LicenseNumber = AnesthesiologistReviewedlist[0].LicenseNumber || "";
                                        if (AnesthesiologistReviewedlist[0].LicenseNumber != "") {
                                            LicenseNumber = 'LIC :' + ' ' + AnesthesiologistReviewedlist[0].LicenseNumber;
                                        }
                                        $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedName = angular.copy(AnesthesiologistReviewedlist[0].UserFullName + ' ' + LicenseNumber);

                                    }
                                }

                                $scope.PreAdmAnesthetistQuickSummary.ReviewedDate = $scope.PreAdmissionDetails.AnesthesiaReviewedDate || "";
                                $scope.PreAdmAnesthetistQuickSummary.ReviewedTime = $scope.PreAdmissionDetails.AnesthesiaReviewedTime || "";

                                if ($scope.PreAdmissionDetails !== undefined) {
                                    if ($scope.PreAdmissionDetails.Vitals.length > 0) {
                                        let vitallist = $filter("filter")($scope.PreAdmissionDetails.Vitals, function (kitem) { return kitem.TypeId == 2 });
                                        if (vitallist.length > 0) {
                                            angular.forEach($scope.PreAdmissionDetails.Vitals, function (item) {
                                                if (item.TypeId == 2) {
                                                    item.Vitals = item.Vitals || [];
                                                    let subvitals = angular.copy($scope.subVitallist()) || [];
                                                    angular.forEach(item.Vitals, function (Aitem) {
                                                        angular.forEach(subvitals, function (Bitem) {
                                                            if (Aitem.VitalId == Bitem.VitalId) {
                                                                Bitem.Value = Aitem.Value;
                                                                Bitem.AppointmentVitalDataId = Aitem.AppointmentVitalDataId;
                                                                Bitem.UnitTypeId = Aitem.UnitTypeId;
                                                                Bitem.UnitTypeName = Aitem.UnitTypeName;
                                                            }
                                                        });
                                                    });

                                                    let ndate = moment().format("YYYY-MM-DD");
                                                    let edate = ndate + " " + item.VitalAddTime;
                                                    item.VitalAddTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm A");

                                                    let obj = {
                                                        "VitalSummaryId": item.VitalSummaryId,
                                                        "AppointmentId": $scope.cacheStorageItem.AppointmentTypeId,
                                                        "VitalAddDate": moment(item.VitalAddDate).format("MM-DD-YYYY"),
                                                        "VitalAddTime": item.VitalAddTime,
                                                        "DoctorId": item.DoctorId,
                                                        "UserName": item.UserName || "",
                                                        "VitalRemarks": item.VitalRemarks || "",
                                                        "DeleteInd": "N",
                                                        "IsEditVitalInd": false,
                                                        "Vitals": angular.copy(subvitals) || [],
                                                        "VitalshowNotesInd": false,
                                                        "TypeId": item.TypeId,
                                                    }

                                                    $scope.PreAdmAnesthetistQuickSummary.Vitals.push(obj);
                                                };
                                            });
                                        };

                                        if ($scope.PreAdmAnesthetistQuickSummary.Vitals.length > 0) {
                                            $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay = $scope.GetDisplayVitalsArray();
                                            angular.forEach($scope.PreAdmAnesthetistQuickSummary.Vitals, function (mainitem, $index) {
                                                let TempFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 11 }, true) || [];
                                                if (TempFilter.length > 0) {
                                                    var tempobj = {
                                                        "value": TempFilter[0].Value,
                                                        "UnitTypeName": TempFilter[0].UnitTypeName
                                                    }
                                                }
                                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[0].Values.push(tempobj);
                                                let pulseFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 12 }, true) || [];
                                                if (pulseFilter.length > 0) {
                                                    var pulseobj = {
                                                        "value": pulseFilter[0].Value,
                                                        "UnitTypeName": pulseFilter[0].UnitTypeName
                                                    }
                                                }
                                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[1].Values.push(pulseobj);
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
                                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[2].Values.push(Bpobj);
                                                let RespFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 14 }, true) || [];
                                                if (RespFilter.length > 0) {
                                                    var Respobj = {
                                                        "value": RespFilter[0].Value,
                                                        "UnitTypeName": RespFilter[0].UnitTypeName
                                                    }
                                                }
                                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[3].Values.push(Respobj);
                                                let Spo2Filter = $filter('filter')(mainitem.Vitals, { "VitalId": 15 }, true) || [];
                                                if (Spo2Filter.length > 0) {
                                                    var Spo2obj = {
                                                        "value": Spo2Filter[0].Value,
                                                        "UnitTypeName": Spo2Filter[0].UnitTypeName
                                                    }
                                                }
                                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[4].Values.push(Spo2obj);
                                                let BGLFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 8 }, true) || [];
                                                if (BGLFilter.length > 0) {
                                                    var BGLobj = {
                                                        "value": BGLFilter[0].Value,
                                                        "UnitTypeName": BGLFilter[0].UnitTypeName
                                                    }
                                                }
                                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[5].Values.push(BGLobj);

                                                var Time = {
                                                    "value": $scope.PreAdmAnesthetistQuickSummary.Vitals[$index].VitalAddTime || "",
                                                    "UnitTypeName": "",
                                                }
                                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[6].Values.push(Time);
                                                var performedBy = {
                                                    "value": $scope.PreAdmAnesthetistQuickSummary.Vitals[$index].UserName || "",
                                                    "UnitTypeName": "",
                                                }
                                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[7].Values.push(performedBy);

                                                var NotesObj = {
                                                    "value": $scope.PreAdmAnesthetistQuickSummary.Vitals[$index].VitalRemarks || "",
                                                    "UnitTypeName": "",
                                                }
                                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[8].Values.push(NotesObj);
                                            });
                                        }

                                    } else {
                                        $scope.PreAdmAnesthetistQuickSummary.Vitals = [];
                                    }

                                    $scope.PreAdmAnesthetistQuickSummary.SystemicHistory = $scope.PreAdmissionDetails.SystemicHistory || [];
                                    $scope.PreAdmAnesthetistQuickSummary.LabInvestigation = $scope.PreAdmissionDetails.LabInvestigation || [];
                                    if ($scope.PreAdmissionDetails.LabInvestigation.length > 0) {
                                        angular.forEach($scope.PreAdmissionDetails.LabInvestigation, function (Aitem) {
                                            angular.forEach($scope.PreAdmAnesthetistQuickSummary.LabList, function (Bitem) {
                                                if (Bitem.ProcedureId == Aitem.ProcedureId) {
                                                    Bitem.InvestigationResultDate = Aitem.InvestigationResultDate;
                                                    Bitem.ResultId = Aitem.ResultId || null;
                                                    Bitem.ResultValue = Aitem.ResultValue;
                                                    Bitem.AbNormal = Aitem.AbNormal || false;
                                                    Bitem.Normal = Aitem.Normal || false;
                                                    Bitem.Remarks = Aitem.Remarks || '';
                                                    if (Bitem.Remarks != '') {
                                                        Bitem.ShowNotes = true;
                                                    }
                                                }
                                            });
                                        });
                                    }
                                    $scope.PreAdmAnesthetistQuickSummary.LabNotes = $scope.PreAdmissionDetails.LabNotes || "";
                                    $scope.PreAdmAnesthetistQuickSummary.MedicineOrdersInstructions = $scope.PreAdmissionDetails.MedicineOrdersInstructions || '';
                                    $scope.PreAdmAnesthetistQuickSummary.PreAdmissionStatus = $scope.PreAdmissionDetails.PreAdmissionStatus || '';

                                    var count = 0;
                                    if ($scope.PreAdmAnesthetistQuickSummary.SystemicHistory.length > 0) {
                                        angular.forEach($scope.PreAdmAnesthetistQuickSummary.SystemicHistory, function (item) {
                                            if ((item.HistoryId == 116 || item.HistoryId == 118 || item.HistoryId == 119 || item.HistoryId == 120 || item.HistoryId == 121 || item.HistoryId == 122) && (item.IsChecked == true || item.Remarks !== '')) {
                                                count++
                                            }
                                        });
                                        if (count !== 0) {
                                            $scope.IsRespiratoty = true;
                                        } else {
                                            $scope.IsRespiratoty = false;
                                        }
                                    } else {
                                        $scope.IsRespiratoty = false;
                                    }


                                    $scope.PreAdmissionDetails.CardioVascular = $scope.PreAdmissionDetails.CardioVascular || "";
                                    if ($scope.PreAdmissionDetails.CardioVascular != "") {
                                        //$scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.Systolic = $scope.PreAdmissionDetails.CardioVascular.Systolic;
                                        //$scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.Diastolic = $scope.PreAdmissionDetails.CardioVascular.Diastolic;
                                        //$scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.PR = $scope.PreAdmissionDetails.CardioVascular.PR;
                                        /*$scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.BPlevel = $scope.PreAdmissionDetails.CardioVascular.BPlevel || "";*/
                                        $scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.ECG = $scope.PreAdmissionDetails.CardioVascular.CardioECG || '';
                                        $scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.ECGUnits = $scope.PreAdmissionDetails.CardioVascular.CardioECGUnits;
                                        $scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.Notes = $scope.PreAdmissionDetails.CardioVascular.CardioNotes || "";
                                    }

                                    $scope.PreAdmissionDetails.Airway = $scope.PreAdmissionDetails.Airway || '';
                                    if ($scope.PreAdmissionDetails.Airway != '') {
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMTMS = $scope.PreAdmissionDetails.Airway.ROMTMS || '';
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMNECKLAT = $scope.PreAdmissionDetails.Airway.ROMNECKLAT || '';
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMNECKAP = $scope.PreAdmissionDetails.Airway.ROMNECKAP || '';
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Notes = $scope.PreAdmissionDetails.Airway.Notes || "";
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.IsNormal = $scope.PreAdmissionDetails.Airway.IsNormal;
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Class = $scope.PreAdmissionDetails.Airway.Class || '';
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.MouthOpening = $scope.PreAdmissionDetails.Airway.MouthOpening || '';
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.TMDistance = $scope.PreAdmissionDetails.Airway.TMDistance || '';
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.UnableToAssess = $scope.PreAdmissionDetails.Airway.UnableToAssess || false;
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Tracheostomy = $scope.PreAdmissionDetails.Airway.Tracheostomy || false;
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Dentition = $scope.PreAdmissionDetails.Airway.Dentition || "";
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.DentitionList = $scope.PreAdmissionDetails.Airway.DentitionList || [];
                                        $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ChemistryNotes = $scope.PreAdmissionDetails.Airway.ChemistryNotes || '';

                                        if ($scope.PreAdmAnesthetistQuickSummary.AirwayObj.DentitionList.length > 0) {
                                            angular.forEach($scope.PreAdmAnesthetistQuickSummary.AirwayObj.DentitionList, function (Aitem) {
                                                Aitem.IsChecked = true;
                                            });
                                        }
                                    }

                                    if ($scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMTMS == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMNECKAP == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMNECKLAT == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Class == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.DentitionList.length == 0 && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Dentition == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Notes == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.MouthOpening == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.TMDistance == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.UnableToAssess && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Tracheostomy) {
                                        $scope.PreAdmAnesthetistQuickSummary.IsAirwayData = true;
                                    } else {
                                        $scope.PreAdmAnesthetistQuickSummary.IsAirwayData = false;
                                    }

                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiaTypelist = $scope.PreAdmissionDetails.AnesthesiaTypelist || [];
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiaTypelist = _.uniq($scope.PreAdmAnesthetistQuickSummary.AnesthesiaTypelist, false, function (p) { return p.AnesthesiaTypeId; });
                                    $scope.PreAdmissionDetails.AnesthesiaPlan = $scope.PreAdmissionDetails.AnesthesiaPlan || "";

                                    if ($scope.PreAdmAnesthetistQuickSummary.AnesthesiaTypelist.length > 0) {
                                        $scope.PreAdmAnesthetistQuickSummary.IsAnesthesiaType = true;
                                    }

                                    if ($scope.PreAdmissionDetails.AnesthesiaPlan != "") {
                                        //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());
                                        //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsTopicalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsTopicalAnesthesia;
                                        //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsGeneralAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsGeneralAnesthesia;
                                        //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsLocalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsLocalAnesthesia;
                                        //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsPeriBulbarAnesthesia;
                                        //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsRegionalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsRegionalAnesthesia;
                                        //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsSubtenonAnesthesia;
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.Dosage = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesPlanDosage || '';
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistNotes = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesthetistNotes || '';
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesPlanAnesthetistId = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesPlanAnesthetistId || null;
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistId = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesthesiologistId || null;
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.ReviewedDate = $scope.PreAdmissionDetails.AnesthesiaReviewedDate || '';
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = '';
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = '';
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsRisksbenefitsAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsRisksbenefitsAnesthesia;
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsAnestheticplan = $scope.PreAdmissionDetails.AnesthesiaPlan.IsAnestheticplan;
                                        if ($scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesPlanAnesthetistId !== null) {
                                            let Anesthetistlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesPlanAnesthetistId });
                                            Anesthetistlist = Anesthetistlist || [];
                                            if (Anesthetistlist.length > 0) {
                                                var SuffixName = '';
                                                Anesthetistlist[0].SuffixName = Anesthetistlist[0].SuffixName || '';
                                                if (Anesthetistlist[0].SuffixName != "") {
                                                    SuffixName = Anesthetistlist[0].SuffixName;
                                                }

                                                var LicenseNumber = "";

                                                Anesthetistlist[0].LicenseNumber = Anesthetistlist[0].LicenseNumber || "";
                                                if (Anesthetistlist[0].LicenseNumber != "") {
                                                    LicenseNumber = 'LIC :' + ' ' + Anesthetistlist[0].LicenseNumber;
                                                }

                                                if (Anesthetistlist[0].SuffixId == 10) {
                                                    $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                                } else {
                                                    $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                                }
                                            }
                                        }

                                        if ($scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistId !== null) {
                                            let AnesthesiologistList = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistId });
                                            AnesthesiologistList = AnesthesiologistList || [];
                                            if (AnesthesiologistList.length > 0) {
                                           

                                                var LicenseNumber = "";

                                                AnesthesiologistList[0].LicenseNumber = AnesthesiologistList[0].LicenseNumber || "";
                                                if (AnesthesiologistList[0].LicenseNumber != "") {
                                                    LicenseNumber = 'LIC :' + ' ' + AnesthesiologistList[0].LicenseNumber;
                                                }
                                                $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = AnesthesiologistList[0].UserFullName + ' ' + LicenseNumber;

                                             
                                            }
                                        }
                                    }

                                    $scope.PreAdmissionDetails.AssessmentsASA = $scope.PreAdmissionDetails.AssessmentsASA || "";
                                    if ($scope.PreAdmissionDetails.AssessmentsASA != "") {
                                        $scope.PreAdmAnesthetistQuickSummary.ASAObj.Notes = $scope.PreAdmissionDetails.AssessmentsASA.Notes || "";
                                        $scope.PreAdmAnesthetistQuickSummary.ASAObj.Value = $scope.PreAdmissionDetails.AssessmentsASA.Value || '';
                                        $scope.PreAdmAnesthetistQuickSummary.ASAObj.ENotes = $scope.PreAdmissionDetails.AssessmentsASA.ENotes || '';
                                        $scope.PreAdmAnesthetistQuickSummary.ASAObj.EValue = $scope.PreAdmissionDetails.AssessmentsASA.EValue || '';
                                        $scope.PreAdmAnesthetistQuickSummary.ASAObj.IsEmergency = $scope.PreAdmissionDetails.AssessmentsASA.IsEmergency || false;
                                    }

                                    $scope.PreAdmAnesthetistQuickSummary.PreviousAnesthetics = $scope.PreAdmissionDetails.PreviousAnesthetics || [];
                                    $scope.PreAdmAnesthetistQuickSummary.ASAClassificationNotes = $scope.PreAdmissionDetails.ASAClassificationNotes || '';

                                    $scope.PreOpQuickSummaryObj.BeforeAnesthesiaReviewedBy = $scope.PreAdmissionDetails.BeforeAnesthesiaReviewedBy || null;
                                    $scope.PreOpQuickSummaryObj.BeforeAnesthesiaReviewedByName = $scope.PreAdmissionDetails.BeforeAnesthesiaReviewedByName || "";

                                    $scope.PreOpQuickSummaryObj.IsBeforeAnesthesiaNormal = $scope.PreAdmissionDetails.IsBeforeAnesthesiaNormal || false;


                                    if ($scope.PreAdmissionDetails.OrgAscChecklistDetails.length > 0) {
                                        angular.forEach($scope.PreAdmissionDetails.OrgAscChecklistDetails, function (item) {
                                            angular.forEach($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (kitem) {
                                                if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                                    if (kitem.CheckListId === item.CheckListId) {
                                                        kitem.IsChecked = true;
                                                        kitem.Score = item.Score || 0;
                                                        kitem.Value = item.Value || '';
                                                        kitem.Remarks = item.Remarks || '';
                                                        kitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";
                                                        kitem.ChecklistTime = item.ChecklistTime || "";

                                                        kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                                        if (item.SubCheckList.length > 0) {
                                                            angular.forEach(item.SubCheckList, function (jitem) {
                                                                angular.forEach(kitem.SubCheckList, function (hitem) {
                                                                    if (hitem.SubCheckListId == jitem.SubCheckListId) {
                                                                        hitem.IsChecked = true;
                                                                        hitem.PatientAscSubCheckListId = jitem.PatientAscSubCheckListId || null;
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        });

                                        $scope.PreOpQuickSummaryObj.AllOrgAscChecklistData = $filter("filter")($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (kitem) { return kitem.CheckListCategoryId == 7 }, true);

                                    }

                                }

                                if ($scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy == null && $scope.PreAdmAnesthetistQuickSummary.PreAdmissionStatus == '' && $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy == null) {
                                    $scope.PreAdmAnesthetistQuickSummary.IndicatorStatus = false;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.IndicatorStatus = true;
                                }

                                if ($scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesPlanAnesthetistId == null && $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.Dosage == "" && $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistNotes == "" && $scope.PreAdmAnesthetistQuickSummary.IsAnesthesiaType == false && $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistId == null) {
                                    $scope.PreAdmAnesthetistQuickSummary.Indicator = false;
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.Indicator = true;
                                }

                            

                            } else {
                                $scope.AnesthesiaPreAdmissionDetails = [];

                                $scope.PreAdmAnesthetistQuickSummary = angular.copy($scope.GetPreAdmAnesthetistQuickSummary());
                                $scope.PreAdmAnesthetistQuickSummary.LabObj = angular.copy($scope.GetLabObj());
                                $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                                $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());

                                //// ROS

                                if (resp[0].data.CurrentSystemicMedicationList.length > 0) {
                                    $scope.PreAdmAnesthetistQuickSummary.CurrentSystemicMedicationsHistory = angular.copy(resp[0].data.CurrentSystemicMedicationList);
                                }

                                if (resp[0].data.CurrentEyeMedicationList.length > 0) {
                                    $scope.PreAdmAnesthetistQuickSummary.CurrentEyeMedications = angular.copy(resp[0].data.CurrentEyeMedicationList);
                                }

                                if (resp[0].data.AllergyItems.length > 0) {
                                    $scope.PreAdmAnesthetistQuickSummary.AllergyItems = angular.copy(resp[0].data.AllergyItems);
                                }
                                //if (resp[0].data.SystemicHistory.length > 0) {
                                //    $scope.PreAdmAnesthetistQuickSummary.SystemicHistory = angular.copy(resp[0].data.SystemicHistory);
                                //}
                                if (resp[0].data.SurgicalHistory.length > 0) {
                                    $scope.PreAdmAnesthetistQuickSummary.SurgicalHistory = angular.copy(resp[0].data.SurgicalHistory);
                                }

                                $scope.PreAdmAnesthetistQuickSummary.AllergyRemarks = resp[0].data.AllergyRemarks || '';
                                $scope.PreAdmAnesthetistQuickSummary.SurgicalRemarks = resp[0].data.SurgicalRemarks || '';
                                $scope.PreAdmAnesthetistQuickSummary.CurrentSystemicRemarks = resp[0].data.CurrentSystemicRemarks || '';
                                $scope.PreAdmAnesthetistQuickSummary.CurrentEyeRemarks = resp[0].data.CurrentEyeRemarks || '';
                                $scope.PreAdmAnesthetistQuickSummary.SystemicHistoryRemarks = resp[0].data.SystemicHistoryRemarks || '';
                                $scope.PreAdmAnesthetistQuickSummary.LifestyleHistoryRemarks = resp[0].data.LifestyleHistoryRemarks || '';
                            }
                        }

                        $scope.cacheStorageItem.CopiedPreviousAppointmentId = $scope.cacheStorageItem.CopiedPreviousAppointmentId || 0;
                        $scope.cacheStorageItem.PreAdmAppointmentId = $scope.cacheStorageItem.PreAdmAppointmentId || 0;

                        if ($scope.cacheStorageItem.CopiedPreviousAppointmentId !== 0) {
                            $scope.GetAppointmentImages($scope.cacheStorageItem.CopiedPreviousAppointmentId);
                        };
                        if ($scope.cacheStorageItem.PreAdmAppointmentId !== 0) {
                            $scope.GetAppointmentImages($scope.cacheStorageItem.PreAdmAppointmentId);
                        };

                        //$scope.AllAnesthetistList = [];
                        //if ($scope.allUserList.length > 0) {
                        //    angular.forEach($scope.allUserList, function (item) {
                        //        if (item.RoleId == 30 || item.RoleId == 8 || item.DoctorID == $scope.UserId || item.RoleId == 1 || item.RoleId == 43) {
                        //            $scope.AllAnesthetistList.push(item);
                        //        }
                        //    })
                        //};
                    });
                }
                //$scope.GetPreAdmissionDetails();
                $scope.GetAppointmentImages = function (Id) {
                    var AppointmentId = Id || 0;
                    var req = {
                        "AppointmentId": AppointmentId
                    };
                    eHnoteSurgeryService.GetAppointmentImagesData(req).then(function (resp) {
                        if (resp.data.status === "Success") {
                            $scope.PreAdmAnesthetistQuickSummary.DocumentDetails = [];
                            if (resp.data.rows.length > 0) {
                                angular.forEach(resp.data.rows, function (item) {
                                    if (item.FileTypeId == 32 || item.FileTypeId == 30) {
                                        $scope.AdmissionCheckinObj.PreOPAdmitFiles.push(item);
                                    };
                                    if (item.FileTypeId == 33 || item.FileTypeId == 17) {
                                        $scope.PreAdmAnesthetistQuickSummary.DocumentDetails.push(item);
                                    };
                                    if (item.FileTypeId == 36) {
                                        $scope.pentaCamReportImages.push(item);
                                    };
                                });
                            }

                        }
                    });
                };
                $scope.onClickSummaryTab = function (value) {
                    value = value || 0;
                  if (value == 3) {



                        $scope.GetMasterAldreteScoreDetails();
                        $scope.GetPreOpChartData();
                        $scope.GetPreAdmissionDetails();
                        $scope.SubTab = 3;
                  }
                  else if (value == 4) {


                        $scope.GetASCIntraOpDetails();
                        $scope.SubTab = 4;
                    }
                    else if (value == 5) {



                        $scope.GetPostOpChartData();
                        $scope.SubTab = 5;
                    }
                    else {
                        $scope.SubTab = value;
                    }
                };

                $scope.VitalNotesObj = {
                    "VitalNotesArray": []
                }

                $scope.OpenVitalNotespopover = {
                    templateUrl: 'VitalNotesPopover.html',
                };

                $scope.ShowVitalsRemarks = function (item) {
                    item.IsShowVitalRemarks = true;
                    $scope.VitalNotesObj.VitalNotesArray = angular.copy(item);
                };

                $scope.uibclose = function () {
                    $uibModalInstance.close("cancel");
                };
                $scope.AuditReportsObj = {
                    "AddReportStatusId": 0,

                    "AddReportRemarks": '',

                    "AddReportId": 0
                }
                let AddReportId = selectedApptObj.AuditDataId || 0;
                $scope.AuditReportsObj.AddReportStatusId = selectedApptObj.AddReportStatusId || 0;
                $scope.AuditReportsObj.AddReportRemarks = selectedApptObj.AddReportRemarks || '';
                if (AddReportId != 0) {
                    $scope.AuditReportsObj.AddReportId = AddReportId || 0;
                }
               
                $scope.Aduitreportnew = function () {
                    let mInstanceAdd = $uibModal.open({
                        "templateUrl": "templates/uibpopups/Aduitreportnew.html",
                        //"size": "lg",
                        "backdrop": "static",
                        "keyboard": false,
                        "scope": $scope,
                        "windowClass": "modal__ninetyfive--",
                        "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteSurgeryService) {
                            $scope.AddUpdateAuditReports = function (selectedItem) {

                                let Preop = $scope.Preop || [];
                                let IntraOP = $scope.IntraOP || [];
                                let PostOP = $scope.PostOP || [];
                                let PreopFilter = 0;
                                let PostOPAnesthesiaStatusId = 0;
                                let PostOPNurseStatusId = 0;
                                let PreOPAnesthesiaStatusId = 0;
                                let PreOPNurseStatusId = 0;
                                let IntraOPAnesthesiaStatusId = 0;
                                let IntraOPNurseStatusId = 0;

                                if (Preop.length > 0) {

                                    let OrgASCChecklist = Preop[0].OrgASCChecklist || [];

                                    let GeneralChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                        return item.CheckListCategoryId == 6 && item.IsMandatory;
                                    }) || [];
                                    let ClinicalChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                        return (item.CheckListCategoryId == 1 && item.CheckListId !== 170 && item.CheckListId !== 168 && item.CheckListId !== 169) && (item.IsMandatory);
                                    }) || [];

                                    let PatientChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                        return (item.CheckListCategoryId == 12) && (item.IsMandatory);
                                    }) || [];
                                    let MedicationChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                        return (item.CheckListCategoryId == 5) && (item.IsMandatory);
                                    }) || [];
                                    let FallRiskChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                        return (item.CheckListCategoryId == 11) && (item.IsMandatory);
                                    }) || [];
                                    let SavedSurgicalSite = $filter("filter")(OrgASCChecklist, function (item) {
                                        return (item.CheckListId === 168 || item.CheckListId === 169 || item.CheckListId === 191) && (item.IsMandatory);
                                    }) || [];
                                    let BeforeAnesthesia = $filter("filter")(OrgASCChecklist, function (item) {
                                        return item.CheckListCategoryId == 7 && item.IsMandatory;
                                    }) || [];
                                    let DietOrmedication = $filter("filter")(OrgASCChecklist, function (item) {
                                        return item.CheckListCategoryId == 25 && item.IsMandatory;
                                    }) || [];
                                    if (DietOrmedication.length > 0 ||BeforeAnesthesia.length > 0 ||GeneralChecklist.length > 0 || ClinicalChecklist.length > 0 || PatientChecklist.length > 0 || MedicationChecklist.length > 0 || FallRiskChecklist.length > 0 || SavedSurgicalSite.length > 0) {
                                        PreopFilter++;
                                    }
                                    let MandatoryData = Preop[0].MandatoryData || [];
                                    MandatoryData = $filter("filter")(MandatoryData, function (item) {
                                        return item.IsMandatory && item.IsDataNotFilled;
                                    }) || [];
                                    if (MandatoryData.length > 0) {
                                        PreopFilter++;
                                    }

                                    let PreviousAnesthetics = Preop[0].PreviousAnesthetics || [];
                                    let LabInvestigation = Preop[0].LabInvestigation || [];


                                    let Respiratory = Preop[0].Respiratory || [];
                                    let AnesthesiaTypelist = Preop[0].AnesthesiaTypelist || [];
                                    PreviousAnesthetics = $filter("filter")(PreviousAnesthetics, function (item) {
                                        return item.IsMandatory;
                                    }) || [];
                                    LabInvestigation = $filter("filter")(LabInvestigation, function (item) {
                                        return item.IsMandatory;
                                    }) || [];
                                    Respiratory = $filter("filter")(Respiratory, function (item) {
                                        return item.IsMandatory;
                                    }) || [];
                                    AnesthesiaTypelist = $filter("filter")(AnesthesiaTypelist, function (item) {
                                        return item.IsMandatory;
                                    }) || [];
                                    /*nurse*/
                                    let mandatoryIds = [
                                        35, // AlderetScore
                                        21, // DilationMedications
                                        //4,  // IsDiabetes
                                        5,  // IsHypoglycemiaCheck
                                        //3,  // IsVeinOpened
                                        20, // PreOpMedications
                                        7,  // OxygenQuantity
                                        6,  // OxygenType
                                        8,  // SurgicalSiteVerifiedBy
                                        9,  // PreOpSurgicalSiteRemarks
                                        10, // IVSite
                                        11, // PatencyStatus
                                        12, // IVNeedleSize
                                        170,// Condition
                                        13, // PreOpHandOffReviewedBy
                                        14, // PreOpHandOffTime
                                        15, // PreOpHandoffRemarks
                                        16, // PreOpNotes
                                        19, // PreopNurseFiles
                                        17  // PreopNurseReviewedBy
                                    ];

                                    // Appointment Surgery Organ logic
                                    if ($scope.AppointmentSugeryOrganId == "1") {
                                        mandatoryIds.push(1); // ODPupilSize
                                    }
                                    else if ($scope.AppointmentSugeryOrganId == "2") {
                                        mandatoryIds.push(2); // OSPupilSize
                                    }
                                    else if ($scope.AppointmentSugeryOrganId == "3") {
                                        mandatoryIds.push(1); // ODPupilSize
                                        mandatoryIds.push(2); // OSPupilSize
                                    }

                                    // Safety for null / ''
                                    let safeMandatoryData = Array.isArray(MandatoryData) ? MandatoryData : [];

                                    let nurseMandatoryData = $filter("filter")(safeMandatoryData, function (item) {
                                        return mandatoryIds.includes(item.MandatoryDataId);
                                    });

                                     
                                    //let nurseMandatoryData = $filter("filter")(MandatoryData, function (item) {
                                    //    return [
                                    //        35, // AlderetScore
                                    //        puplisizeOD,  // ODPupilSize
                                    //        puplisizeOS,  // OSPupilSize
                                    //        21, // DilationMedications
                                    //        4,  // IsDiabetes
                                    //        5,  // IsHypoglycemiaCheck
                                    //        3,  // IsVeinOpened
                                    //        20, // PreOpMedications
                                    //        7,  // OxygenQuantity
                                    //        6,  // OxygenType
                                    //        8,  // SurgicalSiteVerifiedBy
                                    //        9,  // PreOpSurgicalSiteRemarks
                                    //        10, // IVSite
                                    //        11, // PatencyStatus
                                    //        12, // IVNeedleSize
                                    //        170,// Condition
                                    //        13, // PreOpHandOffReviewedBy
                                    //        14, // PreOpHandOffTime
                                    //        15, // PreOpHandoffRemarks
                                    //        16, // PreOpNotes
                                    //        19, // PreopNurseFiles
                                    //        17  // PreopNurseReviewedBy
                                    //    ].includes(item.MandatoryDataId);
                                    //}) || [];
                                    if (nurseMandatoryData.length > 0 || GeneralChecklist.length > 0 || ClinicalChecklist.length > 0 || PatientChecklist.length > 0 || MedicationChecklist.length > 0 || FallRiskChecklist.length > 0 || SavedSurgicalSite.length > 0) {
                                        PreOPNurseStatusId = 1;
                                    } else if (nurseMandatoryData.length == 0 && GeneralChecklist.length == 0 && ClinicalChecklist.length == 0 && PatientChecklist.length == 0 && MedicationChecklist.length == 0 && FallRiskChecklist.length == 0 && SavedSurgicalSite.length == 0) {
                                        PreOPNurseStatusId = 2;
                                    }

                                    /*Anesthesia*/
                                    let AnesthesiaMandatoryData = $filter("filter")(MandatoryData, function (item) {
                                        return item.MandatoryDataId == 3 || item.MandatoryDataId == 4 ||item.MandatoryDataId == 22 || item.MandatoryDataId == 23 || item.MandatoryDataId == 24 || item.MandatoryDataId == 25 || item.MandatoryDataId == 26 || item.MandatoryDataId == 27 || item.MandatoryDataId == 28 || item.MandatoryDataId == 29 || item.MandatoryDataId == 30
                                            || item.MandatoryDataId == 31 || item.MandatoryDataId == 32 || item.MandatoryDataId == 33 || item.MandatoryDataId == 34 || item.MandatoryDataId == 36 || item.MandatoryDataId == 37 || item.MandatoryDataId == 39|| item.MandatoryDataId == 40
                                            || item.MandatoryDataId == 41|| item.MandatoryDataId == 42 || item.MandatoryDataId == 43|| item.MandatoryDataId == 44|| item.MandatoryDataId == 45 || item.MandatoryDataId == 51|| item.MandatoryDataId == 52
                                            || item.MandatoryDataId == 53|| item.MandatoryDataId == 54|| item.MandatoryDataId == 55|| item.MandatoryDataId == 56|| item.MandatoryDataId == 57|| item.MandatoryDataId == 62|| item.MandatoryDataId == 59|| item.MandatoryDataId == 63|| item.MandatoryDataId == 64|| item.MandatoryDataId == 65|| item.MandatoryDataId == 66;
                                    }) || [];

                                    if (AnesthesiaMandatoryData.length > 0 || PreviousAnesthetics.length > 0 || LabInvestigation.length > 0 || Respiratory.length > 0 ) {
                                        PreopFilter++;
                                        PreOPAnesthesiaStatusId = 1;
                                    } else if (AnesthesiaMandatoryData.length == 0 && PreviousAnesthetics.length == 0 && LabInvestigation.length == 0 && Respiratory.length == 0 ) {
                                        PreOPAnesthesiaStatusId = 2;
                                    }



                                }
                                else if (Preop.length == 0) {
                                    PreopFilter = 0;
                                     PreOPAnesthesiaStatusId = 1;
                                     PreOPNurseStatusId = 1;
                                }
                                let IntraOPFilter = 0;
                                if (IntraOP.length > 0) {
                                    let PatientAscChecklist = IntraOP[0].PatientAscChecklist || [];
                                    let IntraOpCheckInChecklist = $filter("filter")(PatientAscChecklist, function (item) {
                                        return item.CheckListCategoryId == 13 && item.IsMandatory;
                                    }) || [];

                                    let FireRiskAssessment = $filter("filter")(PatientAscChecklist, function (item) {
                                        return item.CheckListCategoryId == 10 && item.IsMandatory;
                                    }) || [];
                               
                                    let BeforeIncision = $filter("filter")(PatientAscChecklist, function (item) {
                                        return item.CheckListCategoryId == 8 && item.IsMandatory;
                                    }) || [];
                                    let BeforeleavingOR = $filter("filter")(PatientAscChecklist, function (item) {
                                        return item.CheckListCategoryId == 9 && item.IsMandatory;
                                    }) || [];
                                    let AnesthesiaCheckinchecklist = $filter("filter")(PatientAscChecklist, function (item) {
                                        return item.CheckListCategoryId == 26 && item.IsMandatory;
                                    }) || [];
                                    let AnesthesiaCheckout = $filter("filter")(PatientAscChecklist, function (item) {
                                        return item.CheckListCategoryId == 27 && item.IsMandatory;
                                    }) || [];

                                    if (IntraOpCheckInChecklist.length > 0 || BeforeIncision.length > 0 || BeforeleavingOR.length > 0 || AnesthesiaCheckinchecklist.length > 0 || AnesthesiaCheckout.length > 0) {
                                        IntraOPFilter++;
                                    }
                                    let MandatoryData = IntraOP[0].MandatoryData || [];
                                    MandatoryData = $filter("filter")(MandatoryData, function (item) {
                                        return item.IsMandatory && item.IsDataNotFilled;
                                    }) || [];
                                    if (MandatoryData.length > 0) {
                                        IntraOPFilter++;
                                    }
                                    let AnesthesiaTypelist = angular.copy(IntraOP[0].AnesthesiaTypelist) || [];
                                    AnesthesiaTypelist = $filter("filter")(AnesthesiaTypelist, function (item) {
                                        return item.IsMandatory;
                                    }) || [];
                                    if (AnesthesiaTypelist.length > 0) {
                                        IntraOPFilter++;
                                    }

                                    /*nurse*/
                                    let NurseMandatoryData = $filter("filter")(MandatoryData, function (item) {
                                        return item.MandatoryIntraOpDataId !== 62 && item.MandatoryIntraOpDataId !== 63 && item.MandatoryIntraOpDataId !== 64 && item.MandatoryIntraOpDataId !== 65 && item.MandatoryIntraOpDataId !== 66 && item.MandatoryIntraOpDataId !== 76 && item.MandatoryIntraOpDataId !== 68 && item.MandatoryIntraOpDataId !== 69;
                                    }) || [];
                                    NurseMandatoryData = $filter("filter")(NurseMandatoryData, function (item) {
                                        return item.IsMandatory && item.IsDataNotFilled;
                                    }) || [];
                                    // ---- CDE OD / OS organ-based logic (ADD THIS BLOCK) ----
                                    NurseMandatoryData = NurseMandatoryData.filter(function (item) {

                                        // CDE OD
                                        if (item.MandatoryIntraOpDataId == 57) {
                                            return (
                                                $scope.AppointmentSugeryOrganId == "1" ||
                                                $scope.AppointmentSugeryOrganId == "3"
                                            );
                                        }

                                        // CDE OS
                                        if (item.MandatoryIntraOpDataId == 58) {
                                            return (
                                                $scope.AppointmentSugeryOrganId == "2" ||
                                                $scope.AppointmentSugeryOrganId == "3"
                                            );
                                        }

                                        // all other mandatory items – DO NOT TOUCH
                                        return true;
                                    });
                                    if (NurseMandatoryData.length > 0 || IntraOpCheckInChecklist.length > 0 || FireRiskAssessment.length > 0  || BeforeIncision.length > 0 || BeforeleavingOR.length > 0) {
                                        IntraOPNurseStatusId = 1;
                                    } else if (NurseMandatoryData.length == 0 && IntraOpCheckInChecklist.length == 0 && FireRiskAssessment.length == 0  && BeforeIncision.length == 0 && BeforeleavingOR.length == 0) {
                                        IntraOPNurseStatusId = 2;
                                    }


                                    /*Anesthesia*/
                                    let  AnesthesiaMandatoryData = $filter("filter")(MandatoryData, function (item) {
                                        return item.MandatoryIntraOpDataId == 62 || item.MandatoryIntraOpDataId == 63 || item.MandatoryIntraOpDataId == 64 || item.MandatoryIntraOpDataId == 65 || item.MandatoryIntraOpDataId == 66 || item.MandatoryIntraOpDataId == 76 || item.MandatoryIntraOpDataId == 68 || item.MandatoryIntraOpDataId == 69;
                                    }) || [];

                                    if ( AnesthesiaMandatoryData.length > 0) {
                                        IntraOPAnesthesiaStatusId = 1;
                                    } else if ( AnesthesiaMandatoryData.length == 0) {
                                        IntraOPAnesthesiaStatusId = 2;
                                    }


                                }
                                else if (IntraOP.length == 0) {
                                    IntraOPFilter = 0;
                                    IntraOPAnesthesiaStatusId = 1;
                                    IntraOPNurseStatusId = 1;
                                }
                                let PostOPFilter = 0;
                                //let OperativenotesCheck = 0,DischargeSummuryCheck=0;
                                if (PostOP.length > 0) {
                                    let OrgAscChecklist = PostOP[0].OrgAscChecklist || [];
                                    let CheckinCheckList = $filter("filter")(OrgAscChecklist, function (item) {
                                        return (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 1) && (item.IsMandatory);
                                    }) || [];

                                    let CheckoutActionList = $filter("filter")(OrgAscChecklist, function (item) {
                                        return (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 2) && (item.IsMandatory);
                                    }) || [];
                                    let GeneralOrdersList = $filter("filter")(OrgAscChecklist, function (item) {
                                        return (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 19) && (item.IsMandatory);
                                    }) || [];
                                    let ProgressNotesList = $filter("filter")(OrgAscChecklist, function (item) {
                                        return (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 18) && (item.IsMandatory);
                                    }) || [];
                                    let PatientAscPatientGoal = angular.copy(PostOP[0].PatientAscPatientGoal) || [];
                                    PatientAscPatientGoal = $filter("filter")(PatientAscPatientGoal, function (item) {
                                        return item.IsMandatory;
                                    }) || [];
                                    let MandatoryData = angular.copy(PostOP[0].MandatoryData) || [];
                                    MandatoryData = $filter("filter")(MandatoryData, function (item) {
                                        return item.IsMandatory && item.IsDataNotFilled;
                                    }) || [];
                                    let nurseMandatoryData = $filter("filter")(MandatoryData, function (item) {
                                        return (item.MandatoryPostOpDataId == 1 || item.MandatoryPostOpDataId == 2 || item.MandatoryPostOpDataId == 3 || item.MandatoryPostOpDataId == 4 || item.MandatoryPostOpDataId == 5 || item.MandatoryPostOpDataId == 6 || item.MandatoryPostOpDataId == 7 || item.MandatoryPostOpDataId == 8
                                            || item.MandatoryPostOpDataId == 9 || item.MandatoryPostOpDataId == 10 || item.MandatoryPostOpDataId == 11 || item.MandatoryPostOpDataId == 47 || item.MandatoryPostOpDataId == 48 || item.MandatoryPostOpDataId == 14) && item.IsMandatory && item.IsDataNotFilled;
                                    }) || [];

                                    //nurse
                                    if (CheckinCheckList.length > 0 || ProgressNotesList.length > 0  || nurseMandatoryData.length > 0) {
                                        PostOPNurseStatusId = 1;
                                    } else if (CheckinCheckList.length == 0  && ProgressNotesList.length == 0  && nurseMandatoryData.length == 0) {
                                        PostOPNurseStatusId = 2;
                                    }

                                    /*anesstia*/
                                    let AnestesiaMandatoryData = $filter("filter")(MandatoryData, function (item) {
                                        return (item.MandatoryPostOpDataId == 3 || item.MandatoryPostOpDataId == 45 || item.MandatoryPostOpDataId == 46 || item.MandatoryPostOpDataId == 49 || item.MandatoryPostOpDataId == 50
                                            || item.MandatoryPostOpDataId == 12 )&& item.IsMandatory && item.IsDataNotFilled;
                                    }) || [];

                                    if (AnestesiaMandatoryData.length > 0 || CheckoutActionList.length > 0 || GeneralOrdersList.length > 0 || PatientAscPatientGoal.length > 0 ) {
                                        PostOPAnesthesiaStatusId = 1;
                                    } else if (AnestesiaMandatoryData.length == 0 && CheckoutActionList.length == 0 && GeneralOrdersList.length == 0 && PatientAscPatientGoal.length == 0) {
                                        PostOPAnesthesiaStatusId = 2;
                                    }



                                    if (CheckinCheckList.length > 0 || CheckoutActionList.length > 0 || GeneralOrdersList.length > 0 || ProgressNotesList.length > 0 || PatientAscPatientGoal.length > 0 || MandatoryData.length > 0) {
                                        PostOPFilter++;
                                    }

                                    ////operativenote
                                    //let operativenoteMandatoryData = $filter("filter")(MandatoryData, function (item) {
                                    //    return (item.MandatoryPostOpDataId == 18 || item.MandatoryPostOpDataId == 19 || item.MandatoryPostOpDataId == 20 || item.MandatoryPostOpDataId == 21 || item.MandatoryPostOpDataId == 22 || item.MandatoryPostOpDataId == 23 || item.MandatoryPostOpDataId == 24 || item.MandatoryPostOpDataId == 25) && item.IsMandatory && item.IsDataNotFilled;
                                    //}) || [];
                                    //console.log("operativenoteMandatoryData", operativenoteMandatoryData.length);

                                    //if (operativenoteMandatoryData.length > 0) {
                                    //    OperativenotesCheck++;
                                    //}
                                    ////dischargesummury
                                    //let dischargesummuryMandatoryData = $filter("filter")(MandatoryData, function (item) {
                                    //    return (item.MandatoryPostOpDataId == 26 || item.MandatoryPostOpDataId == 27 || item.MandatoryPostOpDataId == 28 || item.MandatoryPostOpDataId == 32 || item.MandatoryPostOpDataId == 33 || item.MandatoryPostOpDataId == 34 || item.MandatoryPostOpDataId == 35) && item.IsMandatory && item.IsDataNotFilled;
                                    //}) || [];
                                    //console.log("dischargesummuryMandatoryData", operativenoteMandatoryData.length);
                                    //if (dischargesummuryMandatoryData.length > 0) {
                                    //    DischargeSummuryCheck++;
                                    //}
                                } else if (PostOP.length == 0) {
                                    PostOPNurseStatusId = 1;
                                    PostOPAnesthesiaStatusId = 1;
                                }


                                //if (PostOPFilter != 0 || IntraOPFilter != 0 || PreopFilter != 0) {
                                //    $scope.AuditReportsObj.AddReportStatusId = 1;
                                //}
                                $scope.AuditReportsObj.AddReportStatusId = 1;
                                if (PostOPAnesthesiaStatusId == 2 && PostOPNurseStatusId == 2 && PreOPAnesthesiaStatusId == 2 && PreOPNurseStatusId == 2 && IntraOPAnesthesiaStatusId == 2 && IntraOPNurseStatusId == 2) {
                                    $scope.AuditReportsObj.AddReportStatusId = 2;
                                }
                                let obj = {

                                    "UserId": $scope.UserId,

                                    "AppointmentID": $scope.SelectedAppointmentId || 0,

                                    "HospitalId": $scope.HospitalId || 0,

                                    "Visitid": Visitid || 0,

                                    "PatientId": $scope.cacheStorageItem.PatientID || 0,

                                    "AddReportStatusId": $scope.AuditReportsObj.AddReportStatusId || 1,

                                    "AddReportRemarks": $scope.AuditReportsObj.AddReportRemarks || '',

                                    "AuditDataId": $scope.AuditReportsObj.AddReportId || 0,

                                    "PostOPAnesthesiaStatusId": PostOPAnesthesiaStatusId || 0,
                                    "PostOPNurseStatusId": PostOPNurseStatusId || 0,
                                    "PreOPAnesthesiaStatusId": PreOPAnesthesiaStatusId || 0,
                                    "PreOPNurseStatusId": PreOPNurseStatusId || 0,
                                    "IntraOPAnesthesiaStatusId": IntraOPAnesthesiaStatusId || 0,
                                    "IntraOPNurseStatusId": IntraOPNurseStatusId || 0,

                                    //"PostOPStatusId": PostOPFilter || 0,
                                    //"IntraOPStatusId": IntraOPFilter || 0,
                                    //"PreopStatusId": PreopFilter || 0

                                }

                                eHnoteSurgeryService.AddUpdateAuditReports(obj).then(function (resp) {
                                    if (resp.data.Status == "Success") {
                                        alertify.success("Saved Successfully!");
                                        $scope.AuditReportsObj.AddReportId = resp.data.AuditDataId || 0;
                                        //$uibModalInstance.dismiss("cancel");


                                    }
                                });
                            }
                            $scope.GetAuditobj = function () {

                                return {
                                    "Tab": 1,
                                    "SubtabTab": 0,
                                    "SurgeonOrders": [],
                                    "AnesthesiaOrders": [],
                                    "IsODPupilSize": false,
                                    "IsOSPupilSize": false,
                                    "IsDiabetes": false,
                                    "IsHypoglycemiaCheck": false,
                                    "IsVeinOpened": false,
                                    "OxygenSupplement": false,

                                    "IntraOpCheckInChecklist": [],
                                    "IntraOpFireRiskAssessment": [],
                                    "BeforeAnesthesia": [],
                                    "BeforeIncision": [],
                                    "BeforeleavingOR": [],
                                    "PostOpCheckinCheckList": [],
                                    "postOpCheckoutActionList": [],
                                    "postOpGeneralOrdersList": [],
                                    "PostOpProgressNotesList": [],


                                    "PreOpMedications": false,
                                    "DilationMedications": false,

                                    "SurgicalSite": false,
                                    "IVSite": false,
                                    "PatencyStatus": false,
                                    "IVNeedleSize": false,
                                    "Condition": false,
                                    "PreOpHandOffReviewedBy": false,
                                    "PreOpHandOffTime": false,
                                    "PreOpHandoffRemarks": false,
                                    "PreOpNotes": false,
                                    "PreopNurseFiles": false,
                                    "PreopNurseReviewedBy": false,
                                    "AllergyItems": false,
                                    "SurgicalHistory": false,
                                    "SystemicHistory": false,
                                    "CurrentEyeMedicationList": false,
                                    "CurrentSystemicMedicationList": false,
                                    "LifestyleDetail": false,
                                    "AlderetScore": false,
                                    "Labs": false,

                                    "CardioECG": false,
                                    "CardioNotes": false,

                                    "AirwayDentition": false,
                                    "AirIsNormal": false,
                                    "AirROMTMS": false,
                                    "AirROMNECKAP": false,
                                    "AirROMNECKLAT": false,
                                    "AirClass": false,
                                    "AirNotes": false,
                                    "Dentition": false,

                                    "AnesthesticPlan": false,
                                    "AnesPlanDosage": false,
                                    "AnesthetistId": false,
                                    "AnesthetistNotes": false,
                                    "AnesthesiologistId": false,
                                    "IsRisksbenefitsAnesthesia": false,
                                    "IsAnestheticplan": false,

                                    "ASAClassification": false,
                                    "ASAValue": false,
                                    "ASAClassificationNotes": false,
                                    "EValue": false,

                                    "PreviousAnesthetics": [],
                                    "Respiratory": [],
                                    "AnesthesiaTypelist": [],

                                    "PreadmStatusReviewedBy": false,
                                    "PreAdmissionStatusId": false,
                                    "AnesthetistReviewedBy": false,
                                    "AnesthesiologistReviewedBy": false,
                                    IntraAnesthesiaTypelist: [],
                                    CheckinChecklist: false,
                                    AdequatePreoperativeWorkup: false,
                                    PatientStableSurgery: false,
                                    HallEntranceStartTime: false,
                                    PatientReceivedById: false,
                                    BeforeORReviewedBy: false,
                                    BeforeIncisionReviewedBy: false,
                                    BeforeAnesthesiaReviewedBy: false,
                                    BeforeAnesthesiaTime: false,
                                    IsBeforeAnesthesia: false,
                                    IsBeforeIncision: false,
                                    IsBeforeleavingOR: false,
                                    SurgeryTimes: false,
                                    SurgeryRoomNo: false,
                                    HallEntranceEndTime: false,
                                    SurgeryStartTime: false,
                                    SurgeryEndTime: false,
                                    SurgicalCount: false,
                                    SurgicalFirstNeedles: false,
                                    SurgicalFirstBlades: false,
                                    SurgicalFirstOthers: false,
                                    SurgicalFirstVerifiedBy: false,
                                    SurgicalFirstTime: false,
                                    SurgicalSecondNeedles: false,
                                    SurgicalSecondBlades: false,
                                    SurgicalSecondOthers: false,
                                    SurgicalSecondTime: false,
                                    SurgicalFinalNeedles: false,
                                    SurgicalFinalBlades: false,
                                    SurgicalFinalOthers: false,
                                    SurgicalFinalTime: false,
                                    Consumables: false,
                                    ImplantsDetails: false,
                                    CDEOD: false,
                                    CDEOS: false,
                                    CDERemarks: false,
                                    CDE: false,
                                    IntraOpMedications: false,
                                    EquipmentList: false,
                                    PhacoMachines: false,
                                    SurgicalEquipment: false,
                                    SurgicalSuply: false,
                                    SurgicalSuplyId: false,
                                    LotNumber: false,
                                    ExpirationDate: false,
                                    NurseCheckout: false,
                                    SurgeonId: false,
                                    CoSurgeonId: false,
                                    AnesthesistId: false,
                                    NurseId: false,
                                    TechnicianId: false,
                                    Drain: false,
                                    HydrationIV: false,
                                    DrainageOthers: false,
                                    WoundClassification: false,
                                    Cleansed: false,
                                    CleanContaminated: false,
                                    Contaminated: false,
                                    Dirty: false,
                                    Cauteraisation: false,
                                    SpecimenLab: false,
                                    EspecimenLab: false,
                                    Pathology: false,
                                    PatientDisposition: false,
                                    PatientAlert: false,
                                    VitalsStatus: false,
                                    PatientTolerated: false,
                                    Disposition: false,
                                    CarePostoperative: false,
                                    Recoveryroom: false,
                                    OthersIntraData: false,
                                    ReviewNurseId: false,
                                    ReviewTechnicianId: false,
                                    ReviewedBy: false,
                                    IsAnesthesiaMedications: false,
                                    AnesthesiaMedications: false,
                                    AnesthesiaVitalsArray: false,
                                    HandOffReviewedBy: false,
                                    HandOffTime: false,
                                    HandoffRemarks: false,
                                    HandOffNotes: false,
                                    IntraOpAnesthesiaNotes: false,
                                    ReviewAnesthesiologistId: false,
                                    ReviewAnesthetistId: false,
                                    IsReviewAnesthesia: false,
                                    IsAnesthesiaVitalsArray: false,

                                    PatientAscPatientGoal: [],
                                    PostOpAnesthetistVitals: false,
                                    PostOpMedications: false,
                                    PostOAnesthesiaMedications: false,
                                    PostopRecovery2Times: false,
                                    PostopRecovery1Times: false,
                                    OxygenType: false,
                                    OxygenQuantity: false,
                                    PostOpNotes: false,
                                    ReviewDoctorId: false,
                                    ReviewNurseId: false,
                                    InTime: false,
                                    OutTime: false,
                                    ProgressOverAllNotes: false,
                                    NurseNotes: false,
                                    //PatientAscPatientGoal: false,
                                    PostOpReviewAnesthetistId: false,
                                    IsPatientDischarge: false,
                                    PostOpAnesthesiaNotes: false,
                                }
                            }
                            $scope.Auditobj = angular.copy($scope.GetAuditobj());

                            $scope.getAuditEditObj = function () {
                                return {
                                    "Proc_AddUpdateMandatoryData": false,
                                    "AddUpdateMandatoryData": false,
                                    "GeneralChecklist": false,
                                    "AllGeneralChecklist": false,
                                    "ClinicalChecklist": false,
                                    "AllClinicalChecklist": false,
                                    "MedicationChecklist": false,
                                    "AllMedicationChecklist": false,
                                    "FallRiskChecklist": false,
                                    "AllFallRiskChecklist": false,
                                    "NurseInterventions": false,
                                    "AllNurseInterventions": false,
                                    "AllSSV": false,
                                    "PatientChecklist": false,
                                    "AllPatientChecklist": false,
                                    "PreopNurseFiles": false,
                                    "PreopNurseReviewedBy": false,
                                    "PreopRos": false,
                                    "AllPreopRos": false,
                                    "HnP": false,
                                    "AllHnP": false,
                                    "AnesthesiaAssessment": false,
                                    "AllAnesthesiaAssessment": false,
                                    "IgnorePreopTimeOutchecklist": false,
                                    "AllIgnorePreopTimeOutchecklist": false,


                                    "IgnoreIntraopCheckinChecklist": false,
                                    "AllIgnoreIntraopCheckinChecklist": false,
                                    "IgnoreIntraopAnesthesiaCheckinChecklist": false,
                                    "AllIgnoreIntraopAnesthesiaCheckinChecklist": false,
                                    "IgnoreIntraopTimeOutchecklist": false,
                                    "AllIgnoreIntraopTimeOutchecklist": false,
                                    "IgnoreIntraopConsumables": false,
                                    "AllIgnoreIntraopConsumables": false,
                                    "IgnoreIntraopNurseCheckout": false,
                                    "AllIgnoreIntraopNurseCheckout": false,
                                    "AllIgnoreIntraopPatientDisposition": false,
                                    "AllIgnoreIntraopSurgeryTimes": false,
                                    "AllIgnoreIntraopSurgeryStaff": false,
                                    "IgnoreIntraopAnesthesiaOrders": false,
                                    "AllIgnoreIntraopAnesthesiaOrders": false,
                                    "IgnoreIntraopVitals": false,
                                    "AllIgnoreIntraopVitals": false,
                                    "IgnorePostOpCheckinChecklist": false,
                                    "AllIgnorePostOpCheckinChecklist": false,
                                    "IgnoreProgressNotesList": false,
                                    "AllIgnoreProgressNotesList": false,
                                    "IgnorePostVitals": false,
                                    "AllIgnorePostVitals": false,
                                    "IgnorepostOpGeneralOrdersList": false,
                                    "AllIgnorepostOpGeneralOrdersList": false,
                                    "IgnorepostOpGeneralChecklist": false,
                                    "AllIgnorepostOpGeneralChecklist": false,
                                    "IgnorepostOpCheckoutActionList": false,
                                    "AllIgnorepostOpCheckoutActionList": false,
                                    "IgnorepostOpAscPatientGoal": false,
                                    "AllIgnorepostOpAscPatientGoal": false,
                                    "IgnorePostOpNotes": false,
                                    "IgnorePostopReviewedby": false,
                                    "AllIgnorePostopReviewedby": false,
                                    "IgnorePostopAnesthesiaOrders": false,
                                    "IgnorePostopRecovery2Times": false,
                                    "IgnorePostopRecovery1Times": false,
                                    "IgnoreReviewAnesthetistId": false,
                                    "DietOrMedicationsTaken": false
                                };
                            };

                            $scope.AuditEditobj = angular.copy($scope.getAuditEditObj());

                            $scope.AppointmentMandatoryDataId = 0;
                            $scope.AppointmentMandatoryIntraDataId = 0;
                            $scope.IntraOP = [];
                            $scope.Preop = [];
                            $scope.PostOP = [];
                            $scope.DoctorNotes = [];
                            $scope.LastSignOffDctrNotesUserDetails = [];

                            $scope.RestructurePreopAudit = function (AppointmentPreop) {

                                let Preop = AppointmentPreop || [];
                                let AuditSurgeonOrders = Preop[0].OrderDetails || [];
                                $scope.Auditobj.SurgeonOrders = $filter("filter")(AuditSurgeonOrders, function (item) {
                                    return item.MedTypeId === 2 && item.IsMandatory;
                                }) || [];
                                $scope.Auditobj.AnesthesiaOrders = $filter("filter")(AuditSurgeonOrders, function (item) {
                                    return item.MedTypeId === 1 && item.IsMandatory;
                                }) || [];

                                let MandatoryData = Preop[0].MandatoryData || [];
                                MandatoryData = $filter("filter")(MandatoryData, function (item) {
                                    return item.IsMandatory;
                                }) || [];
                                //appointmentMandatoryData = $filter("filter")(MandatoryData, function (item) {
                                //    return item.IsMandatory;
                                //}) || [];
                                /*angular.copy(MandatoryData) || [];*/
                                let OrgASCChecklist = Preop[0].OrgASCChecklist || [];
                                //appointmentpreopOrgASCChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                //    return item.IsMandatory;
                                //}) || [];
                                let GeneralChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                    return item.CheckListCategoryId == 6 && item.IsMandatory;
                                }) || [];
                                let ClinicalChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                    return (item.CheckListCategoryId == 1 && item.CheckListId !== 170 && item.CheckListId !== 168 && item.CheckListId !== 169) && (item.IsMandatory);
                                }) || [];

                                let PatientChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                    return (item.CheckListCategoryId == 12 && item.CheckListSubTypeId == 1) && (item.IsMandatory);
                                }) || [];
                                let MedicationChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                    return (item.CheckListCategoryId == 5) && (item.IsMandatory);
                                }) || [];
                                let FallRiskChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                    return (item.CheckListCategoryId == 11) && (item.IsMandatory);
                                }) || [];
                                let BeforeAnesthesia = $filter("filter")(OrgASCChecklist, function (item) {
                                    return item.CheckListCategoryId == 7 && item.IsMandatory;
                                }) || [];
                                $scope.Auditobj.BeforeAnesthesia = BeforeAnesthesia || [];

                                $scope.Auditobj.IsBeforeAnesthesia = false;
                                if ( $scope.Auditobj.BeforeAnesthesia.length > 0) {
                                    $scope.Auditobj.IsBeforeAnesthesia = true;
                                }

                                $scope.AuditGeneralChecklist = GeneralChecklist || [];
                                $scope.AuditClinicalChecklist = ClinicalChecklist || [];
                                $scope.AuditPatientChecklist = PatientChecklist || [];
                                $scope.AuditMedicationChecklist = MedicationChecklist || [];
                                $scope.AuditFallRiskChecklist = FallRiskChecklist || [];

                                let PreviousAnesthetics = Preop[0].PreviousAnesthetics || [];
                                let LabInvestigation = Preop[0].LabInvestigation || [];
                              

                                let Respiratory = Preop[0].Respiratory || [];
                                let AnesthesiaTypelist = Preop[0].AnesthesiaTypelist || [];
                                let SavedSurgicalSite = $filter("filter")(OrgASCChecklist, function (item) {
                                    return (item.CheckListId === 168 || item.CheckListId === 169 || item.CheckListId === 191) && (item.IsMandatory);
                                }) || [];

                                if (MandatoryData.length > 0) {
                                    $scope.Auditobj.IsODPupilSize = MandatoryData.some(item => item.Name == 'ODPupilSize' && item.IsDataNotFilled && item.IsMandatory && (item.AppointmentSugeryOrganId == "1" || item.AppointmentSugeryOrganId == "3"));
                                    $scope.Auditobj.IsOSPupilSize = MandatoryData.some(item => item.Name == 'OSPupilSize' && item.IsDataNotFilled && item.IsMandatory && (item.AppointmentSugeryOrganId == "2" || item.AppointmentSugeryOrganId == "3"));

                                    $scope.Auditobj.PreOpMedications = MandatoryData.some(item => item.MandatoryDataId == 20 && item.IsDataNotFilled && item.IsMandatory);

                                    $scope.Auditobj.DilationMedications = MandatoryData.some(item => item.MandatoryDataId == 21 && item.IsDataNotFilled && item.IsMandatory);

                                    $scope.Auditobj.IsDiabetes = MandatoryData.some(item => item.Name == 'IsDiabetes' && item.IsDataNotFilled && item.IsMandatory);
                                    $scope.Auditobj.IsHypoglycemiaCheck = MandatoryData.some(item => item.Name == 'IsHypoglycemiaCheck' && item.IsDataNotFilled && item.IsMandatory);
                                    $scope.Auditobj.IsVeinOpened = MandatoryData.some(item => item.Name == 'IsVeinOpened' && item.IsDataNotFilled && item.IsMandatory);


                                    let OxygenQuantityIsMandatory = MandatoryData.some(item => item.Name == 'OxygenQuantity' && item.IsDataNotFilled && item.IsMandatory) || false;
                                    let OxygenTypeIsMandatory = MandatoryData.some(item => item.Name == 'OxygenType' && item.IsDataNotFilled && item.IsMandatory) || false;
                                    if (OxygenQuantityIsMandatory || OxygenTypeIsMandatory) {
                                        $scope.Auditobj.OxygenSupplement = true;
                                    }

                                    $scope.Auditobj.SurgicalSiteVerifiedBy = MandatoryData.some(item => item.MandatoryDataId == 8 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    let PreOpSurgicalSiteRemarks = MandatoryData.some(item => item.MandatoryDataId == 9 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.SavedSurgicalSite = false;
                                    $scope.Auditobj.PatientParticipatedinmarkingoftheSite = false;
                                    $scope.Auditobj.ProcedureVerification = false;

                                    if (SavedSurgicalSite.length > 0) {
                                        //    $scope.Auditobj.SurgicalSite = true;
                                        let IsSavedSurgicalSite = $filter("filter")(OrgASCChecklist, function (item) {
                                            return (item.CheckListId === 168) && (item.IsMandatory);
                                        }) || [];
                                        if (IsSavedSurgicalSite.length > 0) {
                                            $scope.Auditobj.SavedSurgicalSite = true;

                                        }
                                        let PatientParticipatedinmarkingoftheSite = $filter("filter")(OrgASCChecklist, function (item) {
                                            return (item.CheckListId === 168) && (item.IsMandatory);
                                        }) || [];
                                        if (PatientParticipatedinmarkingoftheSite.length > 0) {
                                            $scope.Auditobj.PatientParticipatedinmarkingoftheSite = true;

                                        }
                                        let ProcedureVerification = $filter("filter")(OrgASCChecklist, function (item) {
                                            return (item.CheckListId === 191) && (item.IsMandatory);
                                        }) || [];
                                        if (ProcedureVerification.length > 0) {
                                            $scope.Auditobj.ProcedureVerification = true;

                                        }

                                    }
                                    if ($scope.Auditobj.SurgicalSiteVerifiedBy ||$scope.Auditobj.SavedSurgicalSite || $scope.Auditobj.PatientParticipatedinmarkingoftheSite || $scope.Auditobj.ProcedureVerification) {
                                        $scope.Auditobj.SurgicalSite = true;
                                    }

                                    $scope.Auditobj.IVSite = MandatoryData.some(item => item.MandatoryDataId == 10 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PatencyStatus = MandatoryData.some(item => item.MandatoryDataId == 11 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.IVNeedleSize = MandatoryData.some(item => item.MandatoryDataId == 12 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    //$scope.Auditobj.Condition = OrgASCChecklist.some(item => item.CheckListId == 170 && item.IsMandatory) || false;
                                    $scope.Auditobj.IVArm = MandatoryData.some(item => item.MandatoryDataId == 73 && item.IsMandatory && item.IsDataNotFilled) || false;
                                    $scope.Auditobj.Condition = MandatoryData.some(item => item.MandatoryDataId == 74 && item.IsMandatory && item.IsDataNotFilled) || false;

                                    if ($scope.Auditobj.IVArm||$scope.Auditobj.IVSite || $scope.Auditobj.PatencyStatus || $scope.Auditobj.IVNeedleSize || $scope.Auditobj.Condition) {
                                        $scope.Auditobj.IVAccess = true;

                                    }
                                    $scope.Auditobj.PreOpHandOffReviewedBy = MandatoryData.some(item => item.MandatoryDataId == 13 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PreOpHandOffTime = MandatoryData.some(item => item.MandatoryDataId == 14 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PreOpHandoffRemarks = MandatoryData.some(item => item.MandatoryDataId == 15 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.PreOpNotes = MandatoryData.some(item => item.MandatoryDataId == 16 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.PreopNurseFiles = MandatoryData.some(item => item.MandatoryDataId == 19 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.PreopNurseReviewedBy = MandatoryData.some(item => item.MandatoryDataId == 17 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.AlderetScore = MandatoryData.some(item => item.MandatoryDataId == 35 && item.IsDataNotFilled && item.IsMandatory) || false;


                                    //preopanestia

                                    let AllergyItems = MandatoryData.some(item => item.MandatoryDataId == 22 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    let AllergyRemarks = MandatoryData.some(item => item.MandatoryDataId == 23 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if (AllergyItems || AllergyRemarks) {
                                        $scope.Auditobj.AllergyItems = true;
                                    }

                                    let SurgicalHistory = MandatoryData.some(item => item.MandatoryDataId == 24 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    let SurgicalRemarks = MandatoryData.some(item => item.MandatoryDataId == 25 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if (SurgicalHistory || SurgicalRemarks) {
                                        $scope.Auditobj.SurgicalHistory = true;
                                    }

                                    let SystemicHistory = MandatoryData.some(item => item.MandatoryDataId == 26 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    let SystemicHistoryRemarks = MandatoryData.some(item => item.MandatoryDataId == 27 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    let SystemicOtherData = MandatoryData.some(item => item.MandatoryDataId == 28 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if (SystemicHistory || SystemicHistoryRemarks || SystemicOtherData) {
                                        $scope.Auditobj.SystemicHistory = true;
                                    }
                                    let CurrentEyeMedicationList = MandatoryData.some(item => item.MandatoryDataId == 29 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    let CurrentEyeRemarks = MandatoryData.some(item => item.MandatoryDataId == 30 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if (CurrentEyeMedicationList || CurrentEyeRemarks) {
                                        $scope.Auditobj.CurrentEyeMedicationList = true;
                                    }

                                    let CurrentSystemicMedicationList = MandatoryData.some(item => item.MandatoryDataId == 31 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    let CurrentSystemicRemarks = MandatoryData.some(item => item.MandatoryDataId == 32 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if (CurrentSystemicMedicationList || CurrentSystemicRemarks) {
                                        $scope.Auditobj.CurrentSystemicMedicationList = true;
                                    }
                                    $scope.Auditobj.LifestyleDetail = false;
                                    let LifestyleDetail = MandatoryData.some(item => item.MandatoryDataId == 33 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    let LifestyleHistoryRemarks = MandatoryData.some(item => item.MandatoryDataId == 34 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AlcoholType = MandatoryData.some(item => item.MandatoryDataId == 69 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.DrugType = MandatoryData.some(item => item.MandatoryDataId == 70 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PsychisType = MandatoryData.some(item => item.MandatoryDataId == 71 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SmokingType = MandatoryData.some(item => item.MandatoryDataId == 72 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if ($scope.Auditobj.SmokingType || $scope.Auditobj.DrugType || $scope.Auditobj.PsychisType ||$scope.Auditobj.AlcoholType||LifestyleDetail || LifestyleHistoryRemarks) {
                                        $scope.Auditobj.LifestyleDetail = true;
                                    }
                                    $scope.Auditobj.Labs = false;
                                    $scope.Auditobj.CardioECG = MandatoryData.some(item => item.MandatoryDataId == 36 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.CardioNotes = MandatoryData.some(item => item.MandatoryDataId == 37 && item.IsDataNotFilled && item.IsMandatory) || false;

                                 


                                    $scope.Auditobj.AirwayDentition = false;
                                    $scope.Auditobj.AirIsNormal = MandatoryData.some(item => item.MandatoryDataId == 39 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AirROMTMS = MandatoryData.some(item => item.MandatoryDataId == 40 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AirROMNECKAP = MandatoryData.some(item => item.MandatoryDataId == 41 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AirROMNECKLAT = MandatoryData.some(item => item.MandatoryDataId == 42 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AirClass = MandatoryData.some(item => item.MandatoryDataId == 43 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AirNotes = MandatoryData.some(item => item.MandatoryDataId == 44 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Dentition = MandatoryData.some(item => item.MandatoryDataId == 45 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ChemistryNotes = MandatoryData.some(item => item.MandatoryDataId == 46 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.MouthOpening = MandatoryData.some(item => item.MandatoryDataId == 47 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.TMDistance = MandatoryData.some(item => item.MandatoryDataId == 48 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.UnableToAssess = MandatoryData.some(item => item.MandatoryDataId == 49 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Tracheostomy = MandatoryData.some(item => item.MandatoryDataId == 50 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PropCXR = LabInvestigation.some(item => item.ProcedureId == 867 && item.IsMandatory) || false;
                                    $scope.Auditobj.PreOpAnesthesiaNotes = MandatoryData.some(item => item.MandatoryDataId == 76 && item.IsDataNotFilled && item.IsMandatory) || false;


                                    if ($scope.Auditobj.AirIsNormal || $scope.Auditobj.AirROMTMS || $scope.Auditobj.AirROMNECKAP || $scope.Auditobj.AirROMNECKLAT || $scope.Auditobj.AirClass || $scope.Auditobj.AirNotes || $scope.Auditobj.Dentition) {
                                        $scope.Auditobj.AirwayDentition = true;
                                    }


                                    $scope.Auditobj.AnesPlanDosage = MandatoryData.some(item => item.MandatoryDataId == 51 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AnesthetistId = MandatoryData.some(item => item.MandatoryDataId == 52 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AnesthetistNotes = MandatoryData.some(item => item.MandatoryDataId == 53 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AnesthesiologistId = MandatoryData.some(item => item.MandatoryDataId == 54 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.IsRisksbenefitsAnesthesia = MandatoryData.some(item => item.MandatoryDataId == 55 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.IsAnestheticplan = MandatoryData.some(item => item.MandatoryDataId == 56 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AnesthesiaTypelist = MandatoryData.some(item => item.MandatoryDataId == 68 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    //$scope.Auditobj.AnesthesiaTypelist = $filter("filter")(AnesthesiaTypelist, function (item) {
                                    //    return item.IsMandatory;
                                    //}) || [];
                                    if ($scope.Auditobj.AnesthesiaTypelist|| $scope.Auditobj.AnesPlanDosage || $scope.Auditobj.AnesthetistId || $scope.Auditobj.AnesthetistNotes || $scope.Auditobj.AnesthesiologistId || $scope.Auditobj.IsRisksbenefitsAnesthesia || $scope.Auditobj.IsAnestheticplan) {
                                        $scope.Auditobj.AnesthesticPlan = true;
                                    }


                                    $scope.Auditobj.ASAValue = MandatoryData.some(item => item.MandatoryDataId == 57 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ASAClassificationNotes = MandatoryData.some(item => item.MandatoryDataId == 62 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.EValue = MandatoryData.some(item => item.MandatoryDataId == 59 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ENotes = MandatoryData.some(item => item.MandatoryDataId == 60 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ASANotes = MandatoryData.some(item => item.MandatoryDataId == 58 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.IsEmergency = MandatoryData.some(item => item.MandatoryDataId == 61 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if ($scope.Auditobj.ASAValue || $scope.Auditobj.ASANotes || $scope.Auditobj.EValue) {
                                        $scope.Auditobj.ASAClassification = true;
                                    }

                                    $scope.Auditobj.PreviousAnesthetics = $filter("filter")(PreviousAnesthetics, function (item) {
                                        return item.IsMandatory;
                                    }) || [];


                                    $scope.Auditobj.Respiratory = $filter("filter")(Respiratory, function (item) {
                                        return item.IsMandatory;
                                    }) || [];


                                    $scope.Auditobj.PreAdmissionStatusId = MandatoryData.some(item => item.MandatoryDataId == 63 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AnesthetistReviewedBy = MandatoryData.some(item => item.MandatoryDataId == 64 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AnesthesiologistReviewedBy = MandatoryData.some(item => item.MandatoryDataId == 65 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PreadmStatusReviewedBy = false;
                                    if ($scope.Auditobj.PreAdmissionStatusId || $scope.Auditobj.PreAdmissionReviewedBy || $scope.Auditobj.AnesthesiologistReviewedBy) {
                                        $scope.Auditobj.PreadmStatusReviewedBy = true;
                                    }
                                    $scope.Auditobj.AnesthesiaPreAdmissionOrders = MandatoryData.some(item => item.MandatoryDataId == 66 && item.IsDataNotFilled && item.IsMandatory) || false;




                                 
                                  

                                }

                                if (LabInvestigation.length > 0) {
                                    $scope.Auditobj.PropHCT = LabInvestigation.some(item => item.ProcedureId == 840 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropWBC = LabInvestigation.some(item => item.ProcedureId == 841 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropRBC = LabInvestigation.some(item => item.ProcedureId == 842 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropA1C = LabInvestigation.some(item => item.ProcedureId == 843 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropCreatinine = LabInvestigation.some(item => item.ProcedureId == 866 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropRBS = LabInvestigation.some(item => item.ProcedureId == 845 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropFBS = LabInvestigation.some(item => item.ProcedureId == 846 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropPBBS = LabInvestigation.some(item => item.ProcedureId == 847 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropPLBS = LabInvestigation.some(item => item.ProcedureId == 848 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropProthrombinTime = LabInvestigation.some(item => item.ProcedureId == 849 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropPartialThromboplastintime = LabInvestigation.some(item => item.ProcedureId == 850 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropLiFraumeniSyndrome = LabInvestigation.some(item => item.ProcedureId == 78 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropSodium = LabInvestigation.some(item => item.ProcedureId == 852 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropPotassium = LabInvestigation.some(item => item.ProcedureId == 853 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropChloride = LabInvestigation.some(item => item.ProcedureId == 854 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropCarbondioxide = LabInvestigation.some(item => item.ProcedureId == 855 && item.IsMandatory) || false;
                                    $scope.Auditobj.Propglucose = LabInvestigation.some(item => item.ProcedureId == 856 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropUrea = LabInvestigation.some(item => item.ProcedureId == 857 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropLDL = LabInvestigation.some(item => item.ProcedureId == 858 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropHDL = LabInvestigation.some(item => item.ProcedureId == 859 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropTriglyceride = LabInvestigation.some(item => item.ProcedureId == 860 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropAlbumin = LabInvestigation.some(item => item.ProcedureId == 861 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropTotalProtein = LabInvestigation.some(item => item.ProcedureId == 862 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropUA = LabInvestigation.some(item => item.ProcedureId == 863 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropBloodAvailable = LabInvestigation.some(item => item.ProcedureId == 864 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropPreTransfusion = LabInvestigation.some(item => item.ProcedureId == 865 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropCreatine = LabInvestigation.some(item => item.ProcedureId == 866 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropHGB = LabInvestigation.some(item => item.ProcedureId == 506 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropBloodplatelets = LabInvestigation.some(item => item.ProcedureId == 2254 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropPreOpMedications = LabInvestigation.some(item => item.ProcedureId == 96 && item.IsMandatory) || false;
                                    $scope.Auditobj.PropLabInvestigation = LabInvestigation.some(item => item.ProcedureId == 97 && item.IsMandatory) || false;
                                }
                                if ($scope.Auditobj.CardioECG || $scope.Auditobj.CardioNotes || $scope.Auditobj.PropHGB || $scope.Auditobj.PropHCT || $scope.Auditobj.PropWBC || $scope.Auditobj.PropRBS || $scope.Auditobj.PropA1C || $scope.Auditobj.PropBloodplatelets || $scope.Auditobj.PropFBS || $scope.Auditobj.PropPBBS || $scope.Auditobj.PropRBC || $scope.Auditobj.PropPLBS || $scope.Auditobj.PropProthrombinTime || $scope.Auditobj.PropPartialThromboplastintime || $scope.Auditobj.PropUA || $scope.Auditobj.PropBloodAvailable || $scope.Auditobj.PropPreTransfusion) {
                                    $scope.Auditobj.Labs = true;
                                }
                            }
                            $scope.RestructureIntraOpAudit = function (AppointmentIntraOP) {
                                let IntraOP = AppointmentIntraOP || [];
                                let PatientAscChecklist = IntraOP[0].PatientAscChecklist || [];
                           
                                //    angular.copy(PatientAscChecklist);
                                //$scope.Auditobj.IntraAnesthesiaTypelist = angular.copy(IntraOP[0].AnesthesiaTypelist) || [];

                                let IntraOpCheckInChecklist = $filter("filter")(PatientAscChecklist, function (item) {
                                    return item.CheckListCategoryId == 13 && item.IsMandatory;
                                }) || [];

                                let FireRiskAssessment = $filter("filter")(PatientAscChecklist, function (item) {
                                    return item.CheckListCategoryId == 10 && item.IsMandatory;
                                }) || [];
                          
                                let BeforeIncision = $filter("filter")(PatientAscChecklist, function (item) {
                                    return item.CheckListCategoryId == 8 && item.IsMandatory;
                                }) || [];
                                let BeforeleavingOR = $filter("filter")(PatientAscChecklist, function (item) {
                                    return item.CheckListCategoryId == 9 && item.IsMandatory;
                                }) || [];

                                $scope.Auditobj.IntraOpCheckInChecklist = IntraOpCheckInChecklist || [];
                                //$scope.Auditobj.IntraOpFireRiskAssessment = FireRiskAssessment || [];
                                $scope.Auditobj.BeforeIncision = BeforeIncision || [];
                                $scope.Auditobj.BeforeleavingOR = BeforeleavingOR || [];
                                
                                //angular.copy(IntraOP[0].MandatoryData);
                                let MandatoryData = IntraOP[0].MandatoryData || [];
                                MandatoryData = $filter("filter")(MandatoryData, function (item) {
                                    return item.IsMandatory;
                                }) || [];
                                $scope.Auditobj.CheckinChecklist = false;
                                if (MandatoryData.length > 0) {
                                    $scope.Auditobj.AdequatePreoperativeWorkup = MandatoryData.some(item => item.MandatoryIntraOpDataId == 1 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PatientStableSurgery = MandatoryData.some(item => item.MandatoryIntraOpDataId == 2 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.HallEntranceStartTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 3 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PatientReceivedById = MandatoryData.some(item => item.MandatoryIntraOpDataId == 4 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if ($scope.Auditobj.IntraOpCheckInChecklist.length > 0 || $scope.Auditobj.AdequatePreoperativeWorkup || $scope.Auditobj.PatientStableSurgery || $scope.Auditobj.HallEntranceStartTime || $scope.Auditobj.PatientReceivedById) {
                                        $scope.Auditobj.CheckinChecklist = true;
                                    }


                                    $scope.Auditobj.BeforeORReviewedBy = MandatoryData.some(item => item.MandatoryIntraOpDataId == 22 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.BeforeIncisionReviewedBy = MandatoryData.some(item => item.MandatoryIntraOpDataId == 23 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.BeforeAnesthesiaReviewedBy = MandatoryData.some(item => item.MandatoryIntraOpDataId == 24 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.BeforeAnesthesiaTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 25 && item.IsDataNotFilled && item.IsMandatory) || false;


                                 


                                    $scope.Auditobj.IsBeforeIncision = false;
                                    if ( $scope.Auditobj.BeforeIncision.length > 0) {
                                        $scope.Auditobj.IsBeforeIncision = true;
                                    }
                                    $scope.Auditobj.IsBeforeleavingOR = false;
                                    if ( $scope.Auditobj.BeforeleavingOR.length > 0) {
                                        $scope.Auditobj.IsBeforeleavingOR = true;
                                    }


                                    $scope.Auditobj.SurgeryTimes = false;

                                    $scope.Auditobj.SurgeryRoomNo = MandatoryData.some(item => item.MandatoryIntraOpDataId == 5 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.HallEntranceEndTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 6 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgeryStartTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 7 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgeryEndTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 8 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AnesthesiaStartTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 71 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AnesthesiaEndTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 72 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    if ($scope.Auditobj.AnesthesiaStartTime || $scope.Auditobj.AnesthesiaEndTime || $scope.Auditobj.SurgeryRoomNo || $scope.Auditobj.HallEntranceEndTime || $scope.Auditobj.SurgeryStartTime || $scope.Auditobj.SurgeryEndTime) {
                                        $scope.Auditobj.SurgeryTimes = true;
                                    }

                                    $scope.Auditobj.SurgicalCount = false;

                                    $scope.Auditobj.SurgicalFirstNeedles = MandatoryData.some(item => item.MandatoryIntraOpDataId == 9 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalFirstBlades = MandatoryData.some(item => item.MandatoryIntraOpDataId == 10 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalFirstOthers = MandatoryData.some(item => item.MandatoryIntraOpDataId == 11 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalFirstVerifiedBy = MandatoryData.some(item => item.MandatoryIntraOpDataId == 12 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalFirstTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 13 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalSecondNeedles = MandatoryData.some(item => item.MandatoryIntraOpDataId == 14 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalSecondBlades = MandatoryData.some(item => item.MandatoryIntraOpDataId == 15 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalSecondOthers = MandatoryData.some(item => item.MandatoryIntraOpDataId == 16 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalSecondTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 17 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalFinalNeedles = MandatoryData.some(item => item.MandatoryIntraOpDataId == 18 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalFinalBlades = MandatoryData.some(item => item.MandatoryIntraOpDataId == 19 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalFinalOthers = MandatoryData.some(item => item.MandatoryIntraOpDataId == 20 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalFinalTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 21 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    if ($scope.Auditobj.SurgicalFinalTime || $scope.Auditobj.SurgicalFinalOthers || $scope.Auditobj.SurgicalFinalBlades || $scope.Auditobj.SurgicalFinalNeedles || $scope.Auditobj.SurgicalSecondTime || $scope.Auditobj.SurgicalSecondOthers || $scope.Auditobj.SurgicalSecondBlades || $scope.Auditobj.SurgicalSecondNeedles || $scope.Auditobj.SurgicalFirstTime || $scope.Auditobj.SurgicalFirstVerifiedBy || $scope.Auditobj.SurgicalFirstOthers || $scope.Auditobj.SurgicalFirstBlades || $scope.Auditobj.SurgicalFirstNeedles) {
                                        $scope.Auditobj.SurgicalCount = true;
                                    }
                                    $scope.Auditobj.Consumables = false;
                                    $scope.Auditobj.ImplantsDetails = MandatoryData.some(item => item.MandatoryIntraOpDataId == 26 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.OtherImplants = MandatoryData.some(item => item.MandatoryIntraOpDataId == 74 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    //$scope.Auditobj.CDEOD = MandatoryData.some(item => item.MandatoryIntraOpDataId == 57 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    //$scope.Auditobj.CDEOS = MandatoryData.some(item => item.MandatoryIntraOpDataId == 58 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.CDEOD = MandatoryData.some(item => item.MandatoryIntraOpDataId == 57 && item.IsDataNotFilled && item.IsMandatory && (item.AppointmentSugeryOrganId == "1" || item.AppointmentSugeryOrganId == "3")) || false;
                                    $scope.Auditobj.CDEOS = MandatoryData.some(item => item.MandatoryIntraOpDataId == 58 && item.IsDataNotFilled && item.IsMandatory && (item.AppointmentSugeryOrganId == "2" || item.AppointmentSugeryOrganId == "3")) || false;

                                    $scope.Auditobj.CDERemarks = MandatoryData.some(item => item.MandatoryIntraOpDataId == 59 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.CDE = false;
                                    if ($scope.Auditobj.CDERemarks || $scope.Auditobj.CDEOS || $scope.Auditobj.CDEOD ) {
                                        $scope.Auditobj.CDE = true;
                                    }
                                    $scope.Auditobj.IntraOpMedications = MandatoryData.some(item => item.MandatoryIntraOpDataId == 60 && item.IsDataNotFilled && item.IsMandatory) || false;


                                    $scope.Auditobj.EquipmentList = MandatoryData.some(item => item.MandatoryIntraOpDataId == 27 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PhacoMachines = MandatoryData.some(item => item.MandatoryIntraOpDataId == 28 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgicalEquipment = false;

                                    if ($scope.Auditobj.EquipmentList || $scope.Auditobj.PhacoMachines) {
                                        $scope.Auditobj.SurgicalEquipment = true;
                                    }

                                    $scope.Auditobj.SurgicalSuply = false;

                                    $scope.Auditobj.SurgicalSuplyId = MandatoryData.some(item => item.MandatoryIntraOpDataId == 29 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.LotNumber = MandatoryData.some(item => item.MandatoryIntraOpDataId == 30 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ExpirationDate = MandatoryData.some(item => item.MandatoryIntraOpDataId == 31 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    if ($scope.Auditobj.ExpirationDate || $scope.Auditobj.LotNumber || $scope.Auditobj.SurgicalSuplyId) {
                                        $scope.Auditobj.SurgicalSuply = true;
                                    }

                                    if ($scope.Auditobj.IntraOpMedications || $scope.Auditobj.CDERemarks || $scope.Auditobj.CDEOS || $scope.Auditobj.CDEOD || $scope.Auditobj.SurgicalSuply || $scope.Auditobj.SurgicalEquipment || $scope.Auditobj.ImplantsDetails || $scope.Auditobj.OtherImplants) {
                                        $scope.Auditobj.Consumables = true;
                                    }

                                    $scope.Auditobj.NurseCheckout = false;

                                    $scope.Auditobj.SurgeonId = MandatoryData.some(item => item.MandatoryIntraOpDataId == 32 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.CoSurgeonId = MandatoryData.some(item => item.MandatoryIntraOpDataId == 33 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.AnesthesistId = MandatoryData.some(item => item.MandatoryIntraOpDataId == 34 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.NurseId = MandatoryData.some(item => item.MandatoryIntraOpDataId == 35 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.TechnicianId = MandatoryData.some(item => item.MandatoryIntraOpDataId == 36 && item.IsDataNotFilled && item.IsMandatory) || false; 
                                    $scope.Auditobj.SurgeryStaffAnesthesistId = MandatoryData.some(item => item.MandatoryIntraOpDataId == 73 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if ($scope.Auditobj.TechnicianId || $scope.Auditobj.NurseId || $scope.Auditobj.SurgeonId || $scope.Auditobj.CoSurgeonId || $scope.Auditobj.AnesthesistId || $scope.Auditobj.SurgeryStaffAnesthesistId) {
                                        $scope.Auditobj.SurgeryStaff = true;
                                    }
                                    $scope.Auditobj.Drain = false;
                                    $scope.Auditobj.HydrationIV = MandatoryData.some(item => item.MandatoryIntraOpDataId == 37 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.DrainageOthers = MandatoryData.some(item => item.MandatoryIntraOpDataId == 38 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if ($scope.Auditobj.HydrationIV || $scope.Auditobj.DrainageOthers) {
                                        $scope.Auditobj.Drain = true;
                                    }

                                    $scope.Auditobj.WoundClassification = false;
                                    $scope.Auditobj.Cleansed = MandatoryData.some(item => item.MandatoryIntraOpDataId == 39 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.CleanContaminated = MandatoryData.some(item => item.MandatoryIntraOpDataId == 40 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    //$scope.Auditobj.Contaminated = MandatoryData.some(item => item.MandatoryIntraOpDataId == 41 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    //$scope.Auditobj.Dirty = MandatoryData.some(item => item.MandatoryIntraOpDataId == 42 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if ( $scope.Auditobj.Cleansed || $scope.Auditobj.CleanContaminated) {
                                        $scope.Auditobj.WoundClassification = true;
                                    }

                                    $scope.Auditobj.Cauteraisation = MandatoryData.some(item => item.MandatoryIntraOpDataId == 43 && item.IsDataNotFilled && item.IsMandatory) || false;


                                    $scope.Auditobj.SpecimenLab = false;
                                    $scope.Auditobj.EspecimenLab = MandatoryData.some(item => item.MandatoryIntraOpDataId == 44 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Pathology = MandatoryData.some(item => item.MandatoryIntraOpDataId == 45 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    if ($scope.Auditobj.EspecimenLab || $scope.Auditobj.Pathology) {
                                        $scope.Auditobj.SpecimenLab = true;
                                    }

                                    $scope.Auditobj.BeforeAnesthesiaTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 46 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.PatientDisposition = false;
                                    $scope.Auditobj.IntraOpNotes = MandatoryData.some(item => item.MandatoryIntraOpDataId == 47 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.PatientAlert = MandatoryData.some(item => item.MandatoryIntraOpDataId == 48 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.VitalsStatus = MandatoryData.some(item => item.MandatoryIntraOpDataId == 49 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PatientTolerated = MandatoryData.some(item => item.MandatoryIntraOpDataId == 50 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Disposition = MandatoryData.some(item => item.MandatoryIntraOpDataId == 51 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.CarePostoperative = MandatoryData.some(item => item.MandatoryIntraOpDataId == 52 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Recoveryroom = MandatoryData.some(item => item.MandatoryIntraOpDataId == 53 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.OthersIntraData = MandatoryData.some(item => item.MandatoryIntraOpDataId == 54 && item.IsDataNotFilled && item.IsMandatory) || false;


                                    if ($scope.Auditobj.IntraOpNotes||$scope.Auditobj.OthersIntraData || $scope.Auditobj.Recoveryroom || $scope.Auditobj.CarePostoperative || $scope.Auditobj.Disposition || $scope.Auditobj.PatientTolerated || $scope.Auditobj.VitalsStatus || $scope.Auditobj.PatientAlert) {
                                        $scope.Auditobj.PatientDisposition = true;
                                    }


                                    $scope.Auditobj.ReviewNurseId = MandatoryData.some(item => item.MandatoryIntraOpDataId == 55 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ReviewTechnicianId = MandatoryData.some(item => item.MandatoryIntraOpDataId == 56 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ReviewedBy = false;
                                    if ($scope.Auditobj.ReviewNurseId || $scope.Auditobj.ReviewTechnicianId) {
                                        $scope.Auditobj.ReviewedBy = true;
                                    }
                                    if ($scope.Auditobj.ReviewedBy || $scope.Auditobj.PatientDisposition || $scope.Auditobj.SpecimenLab || $scope.Auditobj.Cauteraisation || $scope.Auditobj.WoundClassification || $scope.Auditobj.Drain || $scope.Auditobj.SurgeryStaff) {
                                        $scope.Auditobj.NurseCheckout = true;
                                    }

                                    $scope.Auditobj.IsAnesthesiaMedications = false;
                                    $scope.Auditobj.IntraAnesthesiaTypelist = MandatoryData.some(item => item.MandatoryIntraOpDataId == 70 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.AnesthesiaMedications = MandatoryData.some(item => item.MandatoryIntraOpDataId == 62 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    if ($scope.Auditobj.AnesthesiaMedications || $scope.Auditobj.IntraAnesthesiaTypelist) {
                                        $scope.Auditobj.IsAnesthesiaMedications = true;
                                    }
                                    $scope.Auditobj.AnesthesiaVitalsArray = MandatoryData.some(item => item.MandatoryIntraOpDataId == 63 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.HandOffReviewedBy = MandatoryData.some(item => item.MandatoryIntraOpDataId == 64 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.HandOffTime = MandatoryData.some(item => item.MandatoryIntraOpDataId == 65 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.HandoffRemarks = MandatoryData.some(item => item.MandatoryIntraOpDataId == 66 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.HandOffNotes = false;
                                    if ($scope.Auditobj.HandOffReviewedBy || $scope.Auditobj.HandOffTime || $scope.Auditobj.HandoffRemarks) {
                                        $scope.Auditobj.HandOffNotes = true;
                                    }

                                    $scope.Auditobj.IntraOpAnesthesiaNotes = MandatoryData.some(item => item.MandatoryIntraOpDataId == 76 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.IntraOxygenType = MandatoryData.some(item => item.MandatoryIntraOpDataId == 75 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ReviewAnesthesiologistId = MandatoryData.some(item => item.MandatoryIntraOpDataId == 68 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ReviewAnesthetistId = MandatoryData.some(item => item.MandatoryIntraOpDataId == 69 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.IsReviewAnesthesia = false;
                                    if ($scope.Auditobj.ReviewAnesthetistId || $scope.Auditobj.ReviewAnesthesiologistId) {
                                        $scope.Auditobj.IsReviewAnesthesia = true;
                                    }
                                    $scope.Auditobj.IsAnesthesiaVitalsArray = false;
                                    if ($scope.Auditobj.AnesthesiaVitalsArray || $scope.Auditobj.IsReviewAnesthesia || $scope.Auditobj.IntraOpAnesthesiaNotes || $scope.Auditobj.HandOffNotes || $scope.Auditobj.IntraOxygenType) {
                                        $scope.Auditobj.IsAnesthesiaVitalsArray = true;
                                    }
                                }
                            }
                            $scope.RestructurePostOpAudit = function (AppointmentPostOP) {
                                let PostOP = AppointmentPostOP || [];
                                let OrgAscChecklist = PostOP[0].OrgAscChecklist || [];
                                let CheckinCheckList = $filter("filter")(OrgAscChecklist, function (item) {
                                    return (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 1) && (item.IsMandatory);
                                }) || [];

                                let CheckoutActionList = $filter("filter")(OrgAscChecklist, function (item) {
                                    return (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 2) && (item.IsMandatory);
                                }) || [];
                                let GeneralOrdersList = $filter("filter")(OrgAscChecklist, function (item) {
                                    return (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 19) && (item.IsMandatory);
                                }) || [];
                                let ProgressNotesList = $filter("filter")(OrgAscChecklist, function (item) {
                                    return (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 18) && (item.IsMandatory);
                                }) || [];



                                $scope.Auditobj.PostOpCheckinCheckList = CheckinCheckList || [];
                                $scope.Auditobj.postOpCheckoutActionList = CheckoutActionList || [];
                                $scope.Auditobj.postOpGeneralOrdersList = GeneralOrdersList || [];
                                $scope.Auditobj.PostOpProgressNotesList = ProgressNotesList || [];


                                let PatientAscPatientGoal = angular.copy(PostOP[0].PatientAscPatientGoal) || [];
                                $scope.Auditobj.PatientAscPatientGoal = $filter("filter")(PatientAscPatientGoal, function (item) {
                                    return item.IsMandatory;
                                }) || [];

                                let MandatoryData = angular.copy(PostOP[0].MandatoryData) || [];

                                MandatoryData = $filter("filter")(MandatoryData, function (item) {
                                    return item.IsMandatory;
                                }) || [];
                                if (MandatoryData.length > 0) {

                                    $scope.Auditobj.PostOpAnesthetistVitals = MandatoryData.some(item => item.MandatoryPostOpDataId == 1 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.PostOpMedications = MandatoryData.some(item => item.MandatoryPostOpDataId == 2 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PostOAnesthesiaMedications = MandatoryData.some(item => item.MandatoryPostOpDataId == 3 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.OxygenType = MandatoryData.some(item => item.MandatoryPostOpDataId == 4 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.OxygenQuantity = MandatoryData.some(item => item.MandatoryPostOpDataId == 5 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PostOpNotes = MandatoryData.some(item => item.MandatoryPostOpDataId == 6 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ReviewDoctorId = MandatoryData.some(item => item.MandatoryPostOpDataId == 7 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PostOpReviewNurseId = MandatoryData.some(item => item.MandatoryPostOpDataId == 8 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.InTime = MandatoryData.some(item => item.MandatoryPostOpDataId == 9 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.OutTime = MandatoryData.some(item => item.MandatoryPostOpDataId == 10 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ProgressOverAllNotes = MandatoryData.some(item => item.MandatoryPostOpDataId == 11 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.NurseNotes = MandatoryData.some(item => item.MandatoryPostOpDataId == 12 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    //$scope.Auditobj.PatientAscPatientGoal = MandatoryData.some(item => item.MandatoryPostOpDataId == 13 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PostOpReviewAnesthetistId = MandatoryData.some(item => item.MandatoryPostOpDataId == 14 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.IsPatientDischarge = MandatoryData.some(item => item.MandatoryPostOpDataId == 15 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PostOpAnesthesiaNotes = MandatoryData.some(item => item.MandatoryPostOpDataId == 16 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.SurgeonOperativeNotes = MandatoryData.some(item => item.MandatoryPostOpDataId == 18 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.IsComplications = MandatoryData.some(item => item.MandatoryPostOpDataId == 19 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Complications = MandatoryData.some(item => item.MandatoryPostOpDataId == 20 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Findings = MandatoryData.some(item => item.MandatoryPostOpDataId == 21 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ProcedureDetails = MandatoryData.some(item => item.MandatoryPostOpDataId == 22 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ReasonForVisit = MandatoryData.some(item => item.MandatoryPostOpDataId == 23 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PatientsInstructions = MandatoryData.some(item => item.MandatoryPostOpDataId == 24 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.OperativeNotesReviewedBy = MandatoryData.some(item => item.MandatoryPostOpDataId == 25 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.FinalDisposition = MandatoryData.some(item => item.MandatoryPostOpDataId == 26 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PatientConditionInstruction = MandatoryData.some(item => item.MandatoryPostOpDataId == 27 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.CoManagementInstruction = MandatoryData.some(item => item.MandatoryPostOpDataId == 28 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PrescriptionDetails = MandatoryData.some(item => item.MandatoryPostOpDataId == 32 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.InvestigationsList = MandatoryData.some(item => item.MandatoryPostOpDataId == 33 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Diagnosis = MandatoryData.some(item => item.MandatoryPostOpDataId == 34 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.DischargeReviewedBy = MandatoryData.some(item => item.MandatoryPostOpDataId == 35 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PostOpPainLevel = MandatoryData.some(item => item.MandatoryPostOpDataId == 37 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PreOpDx = MandatoryData.some(item => item.MandatoryPostOpDataId == 38 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PatientinstructionsInd = MandatoryData.some(item => item.MandatoryPostOpDataId == 36 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.PreProcedureNotes = MandatoryData.some(item => item.MandatoryPostOpDataId == 55 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PhysicalExam = MandatoryData.some(item => item.MandatoryPostOpDataId == 56 && item.IsDataNotFilled && item.IsMandatory) || false;

                                    $scope.Auditobj.Recovery2Intime = MandatoryData.some(item => item.MandatoryPostOpDataId == 49 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Recovery2PostOpAnesthesiaNotes = MandatoryData.some(item => item.MandatoryPostOpDataId == 51 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PatientReceivedTime = MandatoryData.some(item => item.MandatoryPostOpDataId == 52 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Saturation = MandatoryData.some(item => item.MandatoryPostOpDataId == 53 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PatientReceivedby = MandatoryData.some(item => item.MandatoryPostOpDataId == 54 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Recovery2Outtime = MandatoryData.some(item => item.MandatoryPostOpDataId == 50 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    if ($scope.Auditobj.Recovery2Intime || $scope.Auditobj.Recovery2Outtime) {
                                        $scope.Auditobj.PostopRecovery2Times = true;
                                    }

                                    $scope.Auditobj.R2ReviewNurseId = MandatoryData.some(item => item.MandatoryPostOpDataId == 45 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.R2ReviewAnesthetistId = MandatoryData.some(item => item.MandatoryPostOpDataId == 46 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    if ($scope.Auditobj.R2ReviewNurseId || $scope.Auditobj.R2ReviewAnesthetistId) {
                                        $scope.Auditobj.PostopRecovery2Reviewedby = true;
                                    }
                                    $scope.Auditobj.Recovery1Intime = MandatoryData.some(item => item.MandatoryPostOpDataId == 47 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.Recovery1Outtime = MandatoryData.some(item => item.MandatoryPostOpDataId == 48 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    if ($scope.Auditobj.Recovery1Intime || $scope.Auditobj.Recovery1Outtime) {
                                        $scope.Auditobj.PostopRecovery1Times = true;
                                    }

                                    
                                    $scope.Auditobj.AccompaniedBySign = MandatoryData.some(item => item.MandatoryPostOpDataId == 39	 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.PatientSign = MandatoryData.some(item => item.MandatoryPostOpDataId == 40	 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.NurseSign = MandatoryData.some(item => item.MandatoryPostOpDataId == 41	 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.OperativeOverAllRemarks = MandatoryData.some(item => item.MandatoryPostOpDataId == 42	 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.ExaminationNotes = MandatoryData.some(item => item.MandatoryPostOpDataId == 43	 && item.IsDataNotFilled && item.IsMandatory) || false;
                                    $scope.Auditobj.FollowUpInstructions = MandatoryData.some(item => item.MandatoryPostOpDataId == 44		 && item.IsDataNotFilled && item.IsMandatory) || false;
                                }

                            }

                            $scope.GetASCAuditReportData = function () {
                                
                                let ReqObj = {
                                    "UserId": $scope.UserId,
                                    "ParentOrganizationId": $scope.ParenthospitalId,
                                    "OrganizationId": $scope.selectedpatientobj.HospitalId || 0,
                                    "AppointmentId": $scope.selectedpatientobj.AppointmentID || 0,
                                    "PatientId": $scope.selectedpatientobj.PatientID || 0,
                                    "VisitId": $scope.selectedpatientobj.Visitid || 0,

                                };

                                eHnoteSurgeryService.GetASCAuditReportData(ReqObj).then(function (resp) {
                                    if (resp.data.status === "Success") {
                                        //console.log(resp)
                                        $scope.AppointmentMandatoryDataId = resp.data.AppointmentMandatoryDataId || 0;
                                        $scope.AppointmentSugeryOrganId = resp.data.AppointmentSugeryOrganId || 0;
                                        //$scope.AppointmentMandatoryIntraDataId = resp.data.AppointmentMandatoryIntraDataId || 0;
                                        //$scope.AppointmentMandatoryPostDataId = resp.data.AppointmentMandatoryPostDataId || 0;
                                        let Preop = resp.data.Preop || [];
                                        $scope.Preop = resp.data.Preop || [];
                                        let AppointmentPreop =  [];
                                        let appointmentMandatoryData = [];
                                        let appointmentpreopOrgASCChecklist = [];
                                        if (Preop.length > 0) {
                                            $scope.MandatoryData = $filter("filter")(Preop[0].MandatoryData, function (item) {
                                                return item.IsDataNotFilled;
                                            }) || [];
                                            console.log("preop", $scope.MandatoryData);
                                                /*Preop[0].MandatoryData || [];*/
                                            let OrgASCChecklist = Preop[0].OrgASCChecklist || [];
                                            $scope.AuditPreopOrgASCChecklist = angular.copy(OrgASCChecklist);
                                            $scope.AuditobjPreviousAnesthetics = angular.copy(Preop[0].PreviousAnesthetics) || [];
                                            $scope.AuditobjRespiratory = angular.copy(Preop[0].Respiratory) || [];
                                            $scope.AuditobjPreopAnesthesiaTypelist = angular.copy(Preop[0].AnesthesiaTypelist) || [];
                                            $scope.PreopLabInvestigation = angular.copy(Preop[0].LabInvestigation) || [];
                                        }


                                        if (AppointmentPreop.length > 0) {
                                            let appcount = 0;
                                            let appAnesthesiaTypelistcheck = AppointmentPreop[0].AnesthesiaTypelist || [];
                                            let appMandatoryData = AppointmentPreop[0].MandatoryData || [];
                                            let appOrgASCChecklist = AppointmentPreop[0].OrgASCChecklist || [];
                                            let appPreviousAnesthetics = AppointmentPreop[0].PreviousAnesthetics || [];
                                            let appRespiratory = AppointmentPreop[0].Respiratory || [];
                                            if (appAnesthesiaTypelistcheck.length > 0 || appMandatoryData.length > 0 || appOrgASCChecklist.length > 0 || appPreviousAnesthetics.length > 0 || appRespiratory.length > 0) {
                                                appcount++;
                                            }
                                            if (appcount > 0) {
                                                $scope.RestructurePreopAudit(AppointmentPreop);

                                                let MandatoryData = AppointmentPreop[0].MandatoryData || [];
                                                angular.forEach(MandatoryData, function (apitem) {
                                                    angular.forEach($scope.MandatoryData, function (msitem) {
                                                        //msitem.AppointmentMandatoryDetailId = null;
                                                        if (msitem.MandatoryDataId == apitem.MandatoryDataId) {
                                                            msitem.AppointmentMandatoryDetailId = angular.copy(apitem.AppointmentMandatoryDetailId) || null;
                                                        }
                                                    });
                                                });

                                                MandatoryData = $filter("filter")(MandatoryData, function (item) {
                                                    return item.IsMandatory;
                                                }) || [];
                                                appointmentMandatoryData = $filter("filter")(MandatoryData, function (item) {
                                                    return item.IsMandatory;
                                                }) || [];
                                                let OrgASCChecklist = AppointmentPreop[0].OrgASCChecklist || [];
                                                angular.forEach(OrgASCChecklist, function (apitem) {
                                                    angular.forEach($scope.AuditPreopOrgASCChecklist, function (msitem) {
                                                        //msitem.PatientAscCheckListDetailId = null;
                                                        if ((msitem.CheckListCategoryId == apitem.CheckListCategoryId) && (msitem.CheckListId == apitem.CheckListId)) {
                                                            msitem.PatientAscCheckListDetailId = angular.copy(apitem.PatientAscCheckListDetailId) || null;
                                                        }
                                                    });
                                                });




                                                appointmentpreopOrgASCChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                                                    return item.IsMandatory;
                                                }) || [];
                                                if (appointmentMandatoryData.length > 0) {
                                                    angular.forEach($scope.MandatoryData, function (apitem) {
                                                        apitem.IsMandatory = false;

                                                    });
                                                    angular.forEach(appointmentMandatoryData, function (apitem) {

                                                        let AuditPreopOrgASCChecklist = $filter("filter")($scope.MandatoryData, function (item) {
                                                            return item.MandatoryDataId == apitem.MandatoryDataId;
                                                        }) || [];
                                                        if (AuditPreopOrgASCChecklist.length > 0) {
                                                            AuditPreopOrgASCChecklist[0].IsMandatory = true;
                                                        }
                                                    });
                                                }

                                                if (appointmentpreopOrgASCChecklist.length > 0) {
                                                    angular.forEach($scope.AuditPreopOrgASCChecklist, function (apitem) {
                                                        apitem.IsMandatory = false;
                                                    });


                                                    angular.forEach(appointmentpreopOrgASCChecklist, function (apitem) {
                                                        //&& (item.CheckListId == apitem.CheckListId)
                                                        let AuditPreopOrgASCChecklist = $filter("filter")($scope.AuditPreopOrgASCChecklist, function (item) {
                                                            return (item.CheckListCategoryId == apitem.CheckListCategoryId) && (item.CheckListId == apitem.CheckListId);
                                                        }) || [];
                                                        if (AuditPreopOrgASCChecklist.length > 0) {
                                                            AuditPreopOrgASCChecklist[0].IsMandatory = true;
                                                        }
                                                    });
                                                }
                                                let AnesthesiaTypelist = AppointmentPreop[0].AnesthesiaTypelist || [];
                                                angular.forEach(AnesthesiaTypelist, function (apitem) {
                                                    angular.forEach($scope.AuditobjPreopAnesthesiaTypelist, function (msitem) {
                                                        //msitem.PatientAnesthesiaPlanId = null;
                                                        if (msitem.AnesthesiaTypeId == apitem.AnesthesiaTypeId) {
                                                            msitem.PatientAnesthesiaPlanId = angular.copy(apitem.PatientAnesthesiaPlanId) || null;
                                                        }
                                                    });
                                                });

                                                let PreviousAnesthetics = AppointmentPreop[0].PreviousAnesthetics || [];
                                                angular.forEach(PreviousAnesthetics, function (apitem) {
                                                    angular.forEach($scope.AuditobjPreviousAnesthetics, function (msitem) {
                                                        //msitem.PatientAnesthesiaPlanId = null;
                                                        if (msitem.PreviousAnestheticId == apitem.PreviousAnestheticId) {
                                                            msitem.PatientPreviousAnestheticId = angular.copy(apitem.PatientPreviousAnestheticId) || null;
                                                        }
                                                    });
                                                });

                                                let Respiratory = AppointmentPreop[0].Respiratory || [];
                                                angular.forEach(Respiratory, function (apitem) {
                                                    angular.forEach($scope.AuditobjRespiratory, function (msitem) {
                                                        //msitem.PatientAnesthesiaPlanId = null;
                                                        if (msitem.HistoryId == apitem.HistoryId) {
                                                            msitem.PatientDetailId = angular.copy(apitem.PatientDetailId) || null;
                                                        }
                                                    });
                                                });

                                            } else {
                                                if (Preop.length > 0) {
                                                    $scope.RestructurePreopAudit(Preop);
                                                }
                                            }

                                        } else {
                                            $scope.Preop = resp.data.Preop || [];
                                            if (Preop.length > 0) {
                                                $scope.RestructurePreopAudit(Preop);
                                                //$scope.MandatoryData = Preop[0].MandatoryData || [];
                                                $scope.MandatoryData = $filter("filter")(Preop[0].MandatoryData, function (item) {
                                                    return item.IsDataNotFilled;
                                                }) || [];
                                                console.log("preop", $scope.MandatoryData);

                                                let OrgASCChecklist = Preop[0].OrgASCChecklist || [];
                                                $scope.AuditPreopOrgASCChecklist = angular.copy(OrgASCChecklist);




                                                $scope.AuditobjPreviousAnesthetics = angular.copy(Preop[0].PreviousAnesthetics) || [];

                                                $scope.AuditobjRespiratory = angular.copy(Preop[0].Respiratory) || [];


                                                $scope.AuditobjPreopAnesthesiaTypelist = angular.copy(Preop[0].AnesthesiaTypelist) || [];
                                            }
                                        }
                                        
                                        //if (Preop.length > 0) {
                                           


                                          

                                           

                                            //$scope.Auditobj.IsODPupilSize = !!$filter("filter")(MandatoryData, function (item) {
                                            //    return item.Name == 'ODPupilSize' && item.IsDataNotFilled;
                                            //}).length;
                                           

                                            //$scope.Auditobj.IsODPupilSize = Preop[0].ODPupilSizeIsMandatory || false;
                                            //$scope.Auditobj.IsOSPupilSize = Preop[0].OSPupilSizeIsMandatory || false;

                                            //$scope.Auditobj.IsDiabetes = Preop[0].IsDiabetesIsMandatory || false;
                                            //$scope.Auditobj.IsHypoglycemiaCheck = Preop[0].IsHypoglycemiaCheckIsMandatory || false;
                                            //$scope.Auditobj.IsVeinOpened = Preop[0].IsVeinOpenedIsMandatory || false;
                                            




                                            

                                          
                                        /*}*/
                                   
                                        let AppointmentIntraOP = resp.data.AppointmentIntraOP || [];
                                        let AppointmentIntraOPPatientAscChecklist = [], AppointmentIntraOPMandatoryData = [];

                                        let IntraOP = resp.data.IntraOP || [];
                                        $scope.IntraOP = resp.data.IntraOP || [];
                                        if (IntraOP.length > 0) {
                                            //$scope.RestructureIntraOpAudit(IntraOP);
                                            let PatientAscChecklist = IntraOP[0].PatientAscChecklist || [];

                                            $scope.AuditobjIgnoreIntraopAscChecklists = angular.copy(PatientAscChecklist) || [];
                                           

                                            $scope.AuditobjIgnoreIntraopMandatoryData = $filter("filter")(IntraOP[0].MandatoryData, function (item) {
                                                return item.IsDataNotFilled;
                                            }) || [];
                                            console.log("intraop", $scope.AuditobjIgnoreIntraopMandatoryData);
                                            //$scope.AuditobjIgnoreIntraopMandatoryData = angular.copy(IntraOP[0].MandatoryData) || [];
                                           
                                            $scope.AuditobjIntraAnesthesiaTypelist = angular.copy(IntraOP[0].AnesthesiaTypelist) || [];

                                        }

                                        if (AppointmentIntraOP.length > 0) {
                                            let appcount = 0;
                                            let appAnesthesiaTypelistcheck = AppointmentIntraOP[0].AnesthesiaTypelist || [];
                                            let appMandatoryData = AppointmentIntraOP[0].MandatoryData || [];
                                            let appOrgASCChecklist = AppointmentIntraOP[0].PatientAscChecklist || [];

                                            if (appAnesthesiaTypelistcheck.length > 0 || appMandatoryData.length > 0 || appOrgASCChecklist.length > 0) {
                                                appcount++;
                                            }
                                            if (appcount > 0) {
                                                $scope.RestructureIntraOpAudit(AppointmentIntraOP);

                                                angular.forEach(AppointmentIntraOP[0].PatientAscChecklist, function (apitem) {
                                                    angular.forEach($scope.AuditobjIgnoreIntraopAscChecklists, function (msitem) {
                                                        //msitem.PatientAscCheckListDetailId = null;
                                                        if ((msitem.CheckListCategoryId == apitem.CheckListCategoryId) && (msitem.CheckListId == apitem.CheckListId)) {
                                                            msitem.PatientAscCheckListDetailId = angular.copy(apitem.PatientAscCheckListDetailId) || null;
                                                        }
                                                    });
                                                });
                                                AppointmentIntraOPPatientAscChecklist = $filter("filter")(AppointmentIntraOP[0].PatientAscChecklist, function (item) {
                                                    return item.IsMandatory;
                                                }) || [];


                                                if (AppointmentIntraOPPatientAscChecklist.length > 0) {
                                                    angular.forEach($scope.AuditobjIgnoreIntraopAscChecklists, function (apitem) {
                                                        apitem.IsMandatory = false;
                                                    });
                                                    angular.forEach(AppointmentIntraOPPatientAscChecklist, function (apitem) {
                                                        //&& (item.CheckListId == apitem.CheckListId)
                                                        let AuditPreopOrgASCChecklist = $filter("filter")($scope.AuditobjIgnoreIntraopAscChecklists, function (item) {
                                                            return (item.CheckListCategoryId == apitem.CheckListCategoryId) && (item.CheckListId == apitem.CheckListId);
                                                        }) || [];
                                                        if (AuditPreopOrgASCChecklist.length > 0) {
                                                            AuditPreopOrgASCChecklist[0].IsMandatory = true;
                                                        }
                                                    });
                                                }
                                                angular.forEach(AppointmentIntraOP[0].MandatoryData, function (apitem) {
                                                    angular.forEach($scope.AuditobjIgnoreIntraopMandatoryData, function (msitem) {
                                                        //msitem.AppointmentMandatoryDetailId = null;
                                                        if (msitem.MandatoryIntraOpDataId == apitem.MandatoryIntraOpDataId) {
                                                            msitem.AppointmentMandatoryDetailId = angular.copy(apitem.AppointmentMandatoryDetailId) || null;
                                                        }
                                                    });
                                                });
                                                let AnesthesiaTypelist = AppointmentIntraOP[0].AnesthesiaTypelist || [];
                                                angular.forEach(AnesthesiaTypelist, function (apitem) {
                                                    angular.forEach($scope.AuditobjIntraAnesthesiaTypelist, function (msitem) {
                                                        //msitem.PatientAnesthesiaPlanId = null;
                                                        if (msitem.AnesthesiaTypeId == apitem.AnesthesiaTypeId) {
                                                            msitem.PatientAnesthesiaPlanId = angular.copy(apitem.PatientAnesthesiaPlanId) || null;
                                                        }
                                                    });
                                                });

                                                AppointmentIntraOPMandatoryData = $filter("filter")(AppointmentIntraOP[0].MandatoryData, function (item) {
                                                    return item.IsMandatory;
                                                }) || [];
                                                if (AppointmentIntraOPMandatoryData.length > 0) {
                                                    angular.forEach($scope.AuditobjIgnoreIntraopMandatoryData, function (apitem) {
                                                        apitem.IsMandatory = false;
                                                    });
                                                    angular.forEach(AppointmentIntraOPMandatoryData, function (apitem) {

                                                        let AuditPreopOrgASCChecklist = $filter("filter")($scope.AuditobjIgnoreIntraopMandatoryData, function (item) {
                                                            return item.MandatoryIntraOpDataId == apitem.MandatoryIntraOpDataId;
                                                        }) || [];
                                                        if (AuditPreopOrgASCChecklist.length > 0) {
                                                            AuditPreopOrgASCChecklist[0].IsMandatory = true;
                                                        }
                                                    });
                                                }
                                            } else {
                                                if (IntraOP.length > 0) {
                                                    $scope.RestructureIntraOpAudit(IntraOP);
                                                }
                                            }
                                        }
                                      else  if (IntraOP.length > 0) {
                                            $scope.RestructureIntraOpAudit(IntraOP);
                                        }
                                     
                               
                                        let AppointmentPostOP = resp.data.AppointmentPostOP || [];
                                        let AppointmentPostOPPatientAscChecklist = [], AppointmentPostOPMandatoryData = [], AppointmentPatientAscPatientGoal = [];
                                        let PostOP = resp.data.PostOP || [];
                                        $scope.PostOP = resp.data.PostOP || [];
                                        $scope.DoctorNotes = resp.data.DoctorNotes || [];

                                        if ($scope.DoctorNotes.length > 0) {
                                        let Dcmandatoryitems = angular.copy($scope.DoctorNotes[0].MandatoryData) || [];
                                            Dcmandatoryitems = $filter("filter")(Dcmandatoryitems, function (item) {
                                                return item.IsDataNotFilled;
                                            }) || [];

                                            console.log("dCOTORNOTES", Dcmandatoryitems);
                                            //$scope.PostOPMandatoryData = angular.copy(PostOP[0].MandatoryData) || [];
                                        }
                                        if (PostOP.length > 0) {
                                            $scope.PostOPOrgAscChecklist = angular.copy(PostOP[0].OrgAscChecklist) || [];
                                            $scope.PostOPMandatoryData = $filter("filter")(PostOP[0].MandatoryData, function (item) {
                                                return item.IsDataNotFilled;
                                            }) || [];
                                            
                                            console.log("Postop", $scope.PostOPMandatoryData);
                                            //$scope.PostOPMandatoryData = angular.copy(PostOP[0].MandatoryData) || [];

                                            $scope.PostOPPatientAscPatientGoal = angular.copy(PostOP[0].PatientAscPatientGoal) || [];

                                       
                                      
                                           
                                        }
                                        if (AppointmentPostOP.length > 0) {

                                            let appcount = 0;
                                            let appPatientAscPatientGoal = AppointmentPostOP[0].PatientAscPatientGoal || [];
                                            let appMandatoryData = AppointmentPostOP[0].MandatoryData || [];
                                            let appOrgASCChecklist = AppointmentPostOP[0].OrgAscChecklist || [];

                                            if (appPatientAscPatientGoal.length > 0 || appMandatoryData.length > 0 || appOrgASCChecklist.length > 0) {
                                                appcount++;
                                            }
                                            if (appcount > 0) {
                                                $scope.RestructurePostOpAudit(AppointmentPostOP);

                                                let appPostOP = AppointmentPostOP || [];
                                                let OrgAscChecklist = appPostOP[0].OrgAscChecklist || [];
                                                angular.forEach(OrgAscChecklist, function (apitem) {
                                                    angular.forEach($scope.PostOPOrgAscChecklist, function (msitem) {
                                                        //msitem.PatientAscCheckListDetailId = null;
                                                        if ((msitem.CheckListCategoryId == apitem.CheckListCategoryId) && (msitem.CheckListId == apitem.CheckListId)) {
                                                            msitem.PatientAscCheckListDetailId = angular.copy(apitem.PatientAscCheckListDetailId) || null;
                                                        }
                                                    });
                                                });
                                                AppointmentPostOPPatientAscChecklist = $filter("filter")(appPostOP[0].OrgAscChecklist, function (item) {
                                                    return item.IsMandatory;
                                                }) || [];
                                                if (AppointmentPostOPPatientAscChecklist.length > 0) {
                                                    angular.forEach($scope.PostOPOrgAscChecklist, function (apitem) {
                                                        apitem.IsMandatory = false;
                                                    });

                                                    angular.forEach(AppointmentPostOPPatientAscChecklist, function (apitem) {
                                                        //&& (item.CheckListId == apitem.CheckListId)
                                                        let AuditPreopOrgASCChecklist = $filter("filter")($scope.PostOPOrgAscChecklist, function (item) {
                                                            return (item.CheckListCategoryId == apitem.CheckListCategoryId) && (item.CheckListId == apitem.CheckListId);
                                                        }) || [];
                                                        if (AuditPreopOrgASCChecklist.length > 0) {
                                                            AuditPreopOrgASCChecklist[0].IsMandatory = true;
                                                        }
                                                    });
                                                }

                                                //    angular.copy(PostOP[0].OrgAscChecklist) || [];



                                                AppointmentPatientAscPatientGoal = angular.copy(appPostOP[0].PatientAscPatientGoal) || [];
                                                angular.forEach(AppointmentPatientAscPatientGoal, function (apitem) {
                                                    angular.forEach($scope.PostOPPatientAscPatientGoal, function (msitem) {
                                                        //msitem.PatientAscCheckListDetailId = null;
                                                        if ((msitem.MasterPatientGoalId == apitem.MasterPatientGoalId)) {
                                                            msitem.ASCPatientGoalId = angular.copy(apitem.ASCPatientGoalId) || null;
                                                        }
                                                    });
                                                });
                                                if (AppointmentPatientAscPatientGoal.length > 0) {
                                                    angular.forEach($scope.PostOPPatientAscPatientGoal, function (apitem) {
                                                        apitem.IsMandatory = false;
                                                    });
                                                    angular.forEach(AppointmentPatientAscPatientGoal, function (apitem) {

                                                        let AuditPreopOrgASCChecklist = $filter("filter")($scope.PostOPPatientAscPatientGoal, function (item) {
                                                            return item.MasterPatientGoalId == apitem.MasterPatientGoalId;
                                                        }) || [];
                                                        if (AuditPreopOrgASCChecklist.length > 0) {
                                                            AuditPreopOrgASCChecklist[0].IsMandatory = true;
                                                        }
                                                    });
                                                }

                                                let MandatoryData = angular.copy(appPostOP[0].MandatoryData) || [];
                                                angular.forEach(MandatoryData, function (apitem) {
                                                    angular.forEach($scope.PostOPMandatoryData, function (msitem) {
                                                        //msitem.AppointmentMandatoryDetailId = null;
                                                        if (msitem.MandatoryPostOpDataId == apitem.MandatoryPostOpDataId) {
                                                            msitem.AppointmentMandatoryDetailId = angular.copy(apitem.AppointmentMandatoryDetailId) || null;
                                                        }
                                                    });
                                                });
                                                AppointmentPostOPMandatoryData = $filter("filter")(appPostOP[0].MandatoryData, function (item) {
                                                    return item.IsMandatory;
                                                }) || [];
                                                if (AppointmentPostOPMandatoryData.length > 0) {
                                                    angular.forEach($scope.PostOPMandatoryData, function (apitem) {
                                                        apitem.IsMandatory = false;
                                                    });
                                                    angular.forEach(AppointmentPostOPMandatoryData, function (apitem) {

                                                        let AuditPreopOrgASCChecklist = $filter("filter")($scope.PostOPMandatoryData, function (item) {
                                                            return item.MandatoryPostOpDataId == apitem.MandatoryPostOpDataId;
                                                        }) || [];
                                                        if (AuditPreopOrgASCChecklist.length > 0) {
                                                            AuditPreopOrgASCChecklist[0].IsMandatory = true;
                                                        }
                                                    });
                                                }
                                                //angular.copy(PostOP[0].MandatoryData) || [];

                                            } else {
                                                if (PostOP.length > 0) {
                                                    $scope.RestructurePostOpAudit(PostOP);

                                                }
                                            }

                                        } else if (PostOP.length > 0)  {
                                            $scope.RestructurePostOpAudit(PostOP);

                                        }



                                
                                        let DoctorNotes = resp.data.DoctorNotes || [];
                                        if (DoctorNotes.length > 0) {
                                            $scope.PatientFaceSheetId = DoctorNotes[0].PatientFaceSheetId || 0;

                                            $scope.LastSignOffDctrNotesUserDetails = DoctorNotes[0].DoctorNotesSignOffDetails || [];
                                            $scope.DischargeSignOffDetails = DoctorNotes[0].DischargeSignOffDetails || [];
                                            $scope.OperativeNotesSignOffDetails = DoctorNotes[0].OperativeNotesSignOffDetails || [];
                                            let MandatoryData = DoctorNotes[0].MandatoryData || [];
                                            $scope.AuditobjDoctorNotes = $filter("filter")(MandatoryData, function (item) {
                                                return item.IsDataNotFilled;
                                            }) || [];
                                            //$scope.AuditobjDoctorNotes = angular.copy(MandatoryData) || [];
                                            MandatoryData = $filter("filter")(MandatoryData, function (item) {
                                                return item.IsMandatory;
                                            }) || [];
                                         
                                            $scope.Auditobj.TypeofCatractODFormulaId = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 1 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.TypeofCatractOSFormulaId = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 2 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            $scope.Auditobj.PupilODValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 3 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PupilOSValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 4 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            $scope.Auditobj.CDEODValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 5 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.CDEOSValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 6 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            $scope.Auditobj.TonometryODValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 36 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.TonometryOSValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 37 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            $scope.Auditobj.ConfoscanODValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 8 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.ConfoscanOSValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 9 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            $scope.Auditobj.SVRemarks = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 11 && item.IsDataNotFilled && item.IsMandatory) || false;


                                           

                                            $scope.Auditobj.VisualAcuityODSCValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 23 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.VisualAcuityOSSCValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 24 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.VisionPHValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 25 && item.IsDataNotFilled && item.IsMandatory) || false;

                                           /* $scope.Auditobj.PupilPREValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 26 && item.IsDataNotFilled && item.IsMandatory) || false*/;
                                           /* $scope.Auditobj.PupilOPValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 27 && item.IsDataNotFilled && item.IsMandatory) || false;*/

                                            $scope.Auditobj.RefractionODSphValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 28 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.RefractionODCylValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 29 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.RefractionODAixValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 30 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.RefractionTypeValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 31 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.RefractionOSSphValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 51 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.RefractionOSCylValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 52 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.RefractionOSAixValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 53 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.RefractionGivenbyId = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 69 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.RefractionIsTopcon = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 70 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            $scope.Auditobj.TypeOfCataractOSFormula = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 66 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.TypeOfCataractODFormula = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 50 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.IsKeratometry = false;

                                            $scope.Auditobj.KeratometryODK1Value = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 38 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryODK1AxisValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 39 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryODK2Value = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 40 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryODK2AxisValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 41 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryOSK1Value = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 54 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryOSK1AxisValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 55 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryOSK2Value = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 56 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryOSK2AxisValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 57 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            $scope.Auditobj.KeratometryODAvgKvalues = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 42 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryOSAvgKvalues = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 58 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryODAxialLength = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 43 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryOSAxialLength = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 59 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryODOpticalACD = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 44 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryOSOpticalACD = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 60 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratoODCylValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 21 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratoOSCylValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 22 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryODWhitetoWhite = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 45 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryOSWhitetoWhite = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 61 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryODTargetRefraction = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 46 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.KeratometryOSTargetRefraction = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 62 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            if ($scope.Auditobj.KeratometryODK1Value || $scope.Auditobj.KeratometryODK1AxisValue || $scope.Auditobj.KeratometryODK2Value || $scope.Auditobj.KeratometryODK2AxisValue || $scope.Auditobj.KeratometryODAvgKvalues || $scope.Auditobj.KeratometryOSAvgKvalues || $scope.Auditobj.KeratoODCylValue || $scope.Auditobj.KeratoOSCylValue || $scope.Auditobj.KeratometryODAxialLength || $scope.Auditobj.KeratometryOSAxialLength || $scope.Auditobj.KeratometryODOpticalACD || $scope.Auditobj.KeratometryOSOpticalACD || $scope.Auditobj.KeratometryODWhitetoWhite || $scope.Auditobj.KeratometryOSWhitetoWhite || $scope.Auditobj.KeratometryODTargetRefraction || $scope.Auditobj.KeratometryOSTargetRefraction) {
                                                $scope.Auditobj.IsKeratometry = true;
                                            }
                                            
                                            
                                            

                                            //$scope.Auditobj.KeratometryCylValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 12 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.KeratometryK1AxisValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 13 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.KeratometryK2Value = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 14 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.KeratometryK2AxisValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 15 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.KeratometryAvgKvalues = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 16 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.KeratometryAxialLength = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 17 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.KeratometryOpticalACD = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 18 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.KeratometryWhitetoWhite = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 19 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.KeratometryK1Value = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 20 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.KeratometryVerifiedUserId = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 21 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.KeratometryValue = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 22 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            $scope.Auditobj.IsIOL = false;
                                            $scope.Auditobj.ODIOLManufacturer = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 1 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.OSIOLManufacturer = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 2 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.IOLODTargetRefraction = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 49 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.IOLOSTargetRefraction = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 65 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            $scope.Auditobj.ODIOLModel = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 47 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.OSIOLModel = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 63 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            $scope.Auditobj.ODIOLpower = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 48 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.OSIOLpower = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 64 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            if ($scope.Auditobj.ODIOLManufacturer || $scope.Auditobj.OSIOLManufacturer || $scope.Auditobj.IOLODTargetRefraction || $scope.Auditobj.ODIOLModel || $scope.Auditobj.OSIOLModel || $scope.Auditobj.ODIOLpower || $scope.Auditobj.OSIOLpower) {
                                                $scope.Auditobj.IsIOL = true;
                                            }


                                            //$scope.Auditobj.IOLODFormula = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 50 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.OSIOLManufacturer = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 62 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.IOLOSFormula = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 66 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.ODIOLPrevious = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 71 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.OSIOLPrevious = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 72 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.IOLOSFormulaId = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 73 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.IOLODIOLTypeId = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 74 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.IOLODIOLType = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 75 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.IOLOSIOLTypeId = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 76 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.IOLOSIOLType = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 77 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.IOLODFormulaId = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 82 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            


                                           






                                            $scope.Auditobj.PreOPVerificationSurgeryconsent = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 86 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationAnesthesiaconsent = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 87 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationInternalMedicineclearance = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 88 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationORAdataentry = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 89 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationBiometry = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 90 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationPentacamOPD = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 91 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationConfoscan70 = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 92 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationBilling = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 93 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationPatientPostopInstructions = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 94 && item.IsDataNotFilled && item.IsMandatory) || false;

                                            $scope.Auditobj.PreOPVerificationPatienteducationpreopgiven = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 95 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationEHRHxPEORReport = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 96 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            //$scope.Auditobj.PreOPVerificationQuestionnaireVisualFunction = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 97 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationQuestionnaireVisualFunction = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 97 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationOphthalmoscopyMethod = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 98 && item.IsDataNotFilled && item.IsMandatory) || false;
                                            $scope.Auditobj.PreOPVerificationAnesthesiaClearance = MandatoryData.some(item => item.DoctorNotesMandatoryDataDataId == 99 && item.IsDataNotFilled && item.IsMandatory) || false;




                                        }
                                    }
                                });
                            }
                            $scope.GetASCAuditReportData();
                            $scope.AuditTabChange = function (tab) {
                                if ($scope.Auditobj.Tab == 1) {
                                    if ($scope.AuditEditobj.PreopNurse) {
                                        $scope.UpdateIgnoreFields(1);
                                    }
                                } else if ($scope.Auditobj.Tab == 2) {
                                    if ($scope.AuditEditobj.IntraNurse) {
                                        $scope.UpdateIgnoreFields(2);
                                    }

                                } else if ($scope.Auditobj.Tab == 3) {
                                    if ($scope.AuditEditobj.PostOpNurse) {
                                        $scope.UpdateIgnoreFields(3);
                                    }

                                } else if ($scope.Auditobj.Tab == 4) {
                                    if ($scope.AuditEditobj.Preopanestisia) {
                                        $scope.UpdateIgnoreFields(1);
                                    }

                                } else if ($scope.Auditobj.Tab == 5) {
                                    if ($scope.AuditEditobj.IntrOpaanestisia) {
                                        $scope.UpdateIgnoreFields(2);
                                    }

                                } else if ($scope.Auditobj.Tab == 6) {
                                    if ($scope.AuditEditobj.PostOpanestisia) {
                                        $scope.UpdateIgnoreFields(3);
                                    }
                                }
                                //else if ($scope.Auditobj.Tab == 7) {
                                //    if ($scope.Auditobj.SubtabTab == 1) {
                                //        $scope.UpdateIgnoreFields(4);
                                //    } else if ($scope.Auditobj.SubtabTab == 2) {
                                //        $scope.UpdateIgnoreFields(3);
                                //    }
                                //}

                                $scope.Auditobj.Tab = tab || 1;
                                $scope.Auditobj.SubtabTab = 0;
                                if ($scope.Auditobj.Tab == 7) {
                                    $scope.Auditobj.SubtabTab = 1;
                                }

                            }
                            $scope.AuditAccordianStatusObj = {
                                DischargeChecklist: false,
                                NursingCarePlan: false,
                            }
                            $scope.AuditSubtabTabChange = function (tab) {
                              
                                $scope.Auditobj.SubtabTab = tab|| 1;
                                

                            }
                            $scope.uibclose = function () {
                                $uibModalInstance.dismiss("cancel");
                            };

                            $scope.ChangeIGnoreFields = function (item) {
                                if (item == 1) {
                                    $scope.AuditEditobj.PreopNurse = true;
                                    $scope.AuditEditobj.GeneralChecklist = true;
                                    $scope.AuditEditobj.ClinicalChecklist = true;
                                    $scope.AuditEditobj.MedicationChecklist = true;
                                    $scope.AuditEditobj.DietOrMedicationsTaken = true;
                                    $scope.AuditEditobj.FallRiskChecklist = true;
                                    $scope.AuditEditobj.NurseInterventions = true;
                                    $scope.AuditEditobj.PatientChecklist = true;
                                    $scope.AuditEditobj.PreopNurseFiles = true;
                                    $scope.AuditEditobj.PreopNurseReviewedBy = true;
                                    $scope.AuditEditobj.AlderetScore = true;
                                    $scope.AuditEditobj.HandOfNotes= true;
                                    $scope.AuditEditobj.PatientArrival= true;
                                   
                                }
                                else if (item == 2) {
                                    $scope.AuditEditobj.IntraNurse = true;
                                    $scope.AuditEditobj.IgnoreIntraopCheckinChecklist = true;
                                    $scope.AuditEditobj.IgnoreIntraopTimeOutchecklist = true;
                                    $scope.AuditEditobj.IgnoreIntraopConsumables = true;
                                    $scope.AuditEditobj.IgnoreIntraopNurseCheckout = true;
                                }
                                else if (item == 3) {
                                    $scope.AuditEditobj.PostOpNurse = true;
                                    $scope.AuditEditobj.IgnorePostOpCheckinChecklist = true;
                                    $scope.AuditEditobj.IgnoreProgressNotesList = true;
                                    $scope.AuditEditobj.IgnorePostVitals = true;
                                    $scope.AuditEditobj.IgnorepostOpGeneralOrdersList = true;
                                    $scope.AuditEditobj.IgnorePostOpAnesthesiaNotes = true;

                                    //$scope.AuditEditobj.IgnorepostOpCheckoutActionList = true;
                                    
                                    $scope.AuditEditobj.IgnorePostOpNotes = true;
                                    $scope.AuditEditobj.IgnorePostopReviewedby = true;
                                    $scope.AuditEditobj.IgnorePostopRecovery1Times = true;
                                }
                                else if (item == 4) {
                                    $scope.AuditEditobj.Preopanestisia = true;
                                    $scope.AuditEditobj.PreopRos = true;
                                    $scope.AuditEditobj.HnP = true;
                                    $scope.AuditEditobj.AnesthesiaAssessment = true;
                                    $scope.AuditEditobj.IgnorePreopTimeOutchecklist = true;
                                    $scope.AuditEditobj.PreopAnsMedications = true;
                                    $scope.AuditEditobj.IgnorePreOpAnesthesiaNotes = true;
                                }
                                else if (item == 5) {
                                    $scope.AuditEditobj.IntrOpaanestisia = true;
                                    $scope.AuditEditobj.IgnoreIntraopAnesthesiaOrders = true;
                                    $scope.AuditEditobj.IgnoreIntraopVitals = true;
                                    $scope.AuditEditobj.IgnoreIntraopAnesthesiaCheckinChecklist = true;
                                }
                                else if (item == 6) {
                                    $scope.AuditEditobj.PostOpanestisia = true;
                                    $scope.AuditEditobj.IgnorePostopAnesthesiaOrders = true;
                                    $scope.AuditEditobj.IgnorePostVitals = true;
                                    $scope.AuditEditobj.IgnoreReviewAnesthetistId = true;
                                    $scope.AuditEditobj.IgnorepostOpGeneralChecklist = true;
                                    $scope.AuditEditobj.IgnorepostOpAscPatientGoal = true;
                                    $scope.AuditEditobj.IgnorepostOpCheckoutActionList = true;
                                    $scope.AuditEditobj.IgnorePostopRecovery2Times = true;
                                    $scope.AuditEditobj.IgnoreRecovery2PostOpAnesthesiaNotes = true;
                                    $scope.AuditEditobj.IgnorePostopRecovery2Reviewdby = true;

                                }
                                else if (item == 7) {
                                    $scope.AuditEditobj.IgnorePreOPSurgeonVerification = true;
                                    $scope.AuditEditobj.IgnorePreOPVerificationRequirements = true;
                                    $scope.AuditAccordianStatusObj.DischargeChecklist = true;
                                    $scope.AuditAccordianStatusObj.NursingCarePlan = true;
                                    $scope.AuditEditobj.IgnoreOperativeNotes = true;
                                     $scope.AuditEditobj.IgnoreDischargeSummary = true;
                                }

                            }
                            $scope.stopClosingDropDown = function (event) {
                                event.stopPropagation();
                            }
                            $scope.FalseIGnoreFields = function (item) {
                                if (item == 1) {
                                    $scope.AuditEditobj.PreopNurse = false;
                                    $scope.AuditEditobj.GeneralChecklist = false;
                                    $scope.AuditEditobj.ClinicalChecklist = false;
                                    $scope.AuditEditobj.MedicationChecklist = false;
                                    $scope.AuditEditobj.DietOrMedicationsTaken = false;
                                    $scope.AuditEditobj.FallRiskChecklist = false;
                                    $scope.AuditEditobj.NurseInterventions = false;
                                    $scope.AuditEditobj.PatientChecklist = false;
                                    $scope.AuditEditobj.PreopNurseFiles = false;
                                    $scope.AuditEditobj.PreopNurseReviewedBy = false;
                                    $scope.AuditEditobj.AlderetScore = false;
                                    $scope.AuditEditobj.HandOfNotes = false;
                                    $scope.AuditEditobj.PatientArrival = false;
                                   
                                }
                                else if (item == 2) {
                                    $scope.AuditEditobj.IntraNurse = false;
                                    $scope.AuditEditobj.IgnoreIntraopCheckinChecklist = false;
                                    $scope.AuditEditobj.IgnoreIntraopTimeOutchecklist = false;
                                    $scope.AuditEditobj.IgnoreIntraopConsumables = false;
                                    $scope.AuditEditobj.IgnoreIntraopNurseCheckout = false;
                                }
                                else if (item == 3) {
                                    $scope.AuditEditobj.PostOpNurse = false;
                                    $scope.AuditEditobj.IgnorePostOpCheckinChecklist = false;
                                    $scope.AuditEditobj.IgnoreProgressNotesList = false;
                                    $scope.AuditEditobj.IgnorePostVitals = false;
                                    $scope.AuditEditobj.IgnorepostOpGeneralOrdersList = false;
                                    $scope.AuditEditobj.IgnorePostOpAnesthesiaNotes = false;
                                    //$scope.AuditEditobj.IgnorepostOpCheckoutActionList = false;
                                    //$scope.AuditEditobj.IgnorepostOpAscPatientGoal = false;
                                    $scope.AuditEditobj.IgnorePostOpNotes = false;
                                    $scope.AuditEditobj.IgnorePostopReviewedby = false;
                                    $scope.AuditEditobj.IgnorePostopRecovery1Times = false;
                                }
                                else if (item == 4) {
                                    $scope.AuditEditobj.Preopanestisia = false;
                                    $scope.AuditEditobj.PreopRos = false;
                                    $scope.AuditEditobj.HnP = false;
                                    $scope.AuditEditobj.AnesthesiaAssessment = false;
                                    $scope.AuditEditobj.IgnorePreopTimeOutchecklist = false;
                                    $scope.AuditEditobj.PreopAnsMedications = false;
                                    $scope.AuditEditobj.IgnorePreOpAnesthesiaNotes = false;
                                }
                                else if (item == 5) {
                                    $scope.AuditEditobj.IntrOpaanestisia = false;
                                    $scope.AuditEditobj.IgnoreIntraopAnesthesiaOrders = false;
                                    $scope.AuditEditobj.IgnoreIntraopVitals = false;
                                    $scope.AuditEditobj.IgnoreIntraopAnesthesiaCheckinChecklist = false;
                                }
                                else if (item == 6) {
                                    $scope.AuditEditobj.PostOpanestisia = false;
                                    $scope.AuditEditobj.IgnorePostopAnesthesiaOrders = false;
                                    $scope.AuditEditobj.IgnorePostVitals = false;
                                    $scope.AuditEditobj.IgnoreReviewAnesthetistId = false;
                                    $scope.AuditEditobj.IgnorepostOpGeneralChecklist = false;
                                    $scope.AuditEditobj.IgnorepostOpAscPatientGoal = false;
                                    $scope.AuditEditobj.IgnorepostOpCheckoutActionList = false;
                                    $scope.AuditEditobj.IgnorePostopRecovery2Times = false;
                                    $scope.AuditEditobj.IgnoreRecovery2PostOpAnesthesiaNotes = false;
                                    $scope.AuditEditobj.IgnorePostopRecovery2Reviewdby = false;

                                } else if (item == 7) {
                                    $scope.AuditEditobj.IgnorePreOPSurgeonVerification = false;
                                    $scope.AuditEditobj.IgnorePreOPVerificationRequirements = false;
                                    $scope.AuditEditobj.IgnoreOperativeNotes = false;
                                    $scope.AuditEditobj.IgnoreDischargeSummary = false;
                                    
                                }

                            }


                            $scope.AuditEditobj = {
                                GeneralChecklist: false,
                                PreopNurse: false,
                                IntraNurse: false,
                                PostOpNurse: false,
                                Preopanestisia: false,
                                IntrOpaanestisia: false,
                                PostOpanestisia: false,
                                ALDoctorNotes: false,

                            }
                            $scope.customNurseInterventionsFilter = function (item) {
                                const allowedIds = [1, 2, 21, 3, 4, 5, 20, 6, 7, 8, 9, 10, 11, 12, 15, 13, 73];
                                return allowedIds.includes(item.MandatoryDataId) && item.IsMandatory === false;;
                            };
                            $scope.ChangeSurgicalSiteverificatio = function (Id) {
                                angular.forEach($scope.AuditPreopOrgASCChecklist, function (AuditItem) {
                                    if (AuditItem.CheckListId === 168 || AuditItem.CheckListId === 169 || AuditItem.CheckListId === 191) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AllSSV || false;
                                    }

                                });
                                angular.forEach($scope.MandatoryData, function (item) {
                                    if (item.MandatoryDataId == 8 || item.MandatoryDataId == 9 ) {
                                        item.IsMandatory = $scope.AuditEditobj.AllSSV || false;
                                    }

                                });
                            }
                            $scope.ChangeNurseInterventions = function (Id) {
                                angular.forEach($scope.AuditPreopOrgASCChecklist, function (AuditItem) {
                                    if (AuditItem.CheckListId === 168 || AuditItem.CheckListId === 169 || AuditItem.CheckListId === 191) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AllNurseInterventions || false;
                                    }

                                });
                                angular.forEach($scope.MandatoryData, function (item) {
                                    if (item.MandatoryDataId == 1 || item.MandatoryDataId == 2 || item.MandatoryDataId == 21 || item.MandatoryDataId == 3 || item.MandatoryDataId == 4 || item.MandatoryDataId == 5 || item.MandatoryDataId == 20 || item.MandatoryDataId == 6 || item.MandatoryDataId == 7
                                        || item.MandatoryDataId == 8 || item.MandatoryDataId == 9 || item.MandatoryDataId == 10 || item.MandatoryDataId == 11 || item.MandatoryDataId == 12 || item.MandatoryDataId == 15 || item.MandatoryDataId == 13 || item.MandatoryDataId == 73) {
                                        item.IsMandatory = $scope.AuditEditobj.AllNurseInterventions || false;
                                    }

                                });
                                //     else if(Id == 25) {
                                //angular.forEach($scope.AuditPreopOrgASCChecklist, function (item) {
                                //    if (item.CheckListCategoryId == 25) {
                                //        item.IsMandatory = $scope.AuditEditobj.DietOrMedicationsTaken || false;
                                //    }

                                //});
                                /*}*/

                            }
                            $scope.ChangeAnesthesiaAssessmentIsMandatory = function (Id) {
                                //AuditEditobj.AllAnesthesiaAssessment
                                
                                
                                //angular.forEach($scope.AuditobjPreopAnesthesiaTypelist, function (item) {

                                //    item.IsMandatory = $scope.AuditEditobj.AllAnesthesiaAssessment || false;


                                //});
                                angular.forEach($scope.AuditobjPreviousAnesthetics, function (item) {
                                    
                                        item.IsMandatory = $scope.AuditEditobj.AllAnesthesiaAssessment || false;
                                    

                                });
                                angular.forEach($scope.MandatoryData, function (AuditItem) {
                                    if (AuditItem.MandatoryDataId == 51 || AuditItem.MandatoryDataId == 52 || AuditItem.MandatoryDataId == 53 || AuditItem.MandatoryDataId == 54 || AuditItem.MandatoryDataId == 55 || AuditItem.MandatoryDataId == 56 || AuditItem.MandatoryDataId == 57 || AuditItem.MandatoryDataId == 62 || AuditItem.MandatoryDataId == 59 || AuditItem.MandatoryDataId == 66 || AuditItem.MandatoryDataId == 63 || AuditItem.MandatoryDataId == 64 || AuditItem.MandatoryDataId == 65 || AuditItem.MandatoryDataId == 68) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AllAnesthesiaAssessment || false;
                                    }

                                });
                                
                            }

                            $scope.ChangeIgnoreIntraopCheckinChecklists = function (Id) {
                                //AuditEditobj.AllAnesthesiaAssessment

                                angular.forEach($scope.AuditobjIgnoreIntraopAscChecklists, function (item) {
                                    if (item.CheckListCategoryId == 13) {
                                        item.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopCheckinChecklist || false;
                                    }

                                });

                                angular.forEach($scope.AuditobjIgnoreIntraopMandatoryData, function (AuditItem) {
                                    if (AuditItem.MandatoryIntraOpDataId == 1 || AuditItem.MandatoryIntraOpDataId == 2 || AuditItem.MandatoryIntraOpDataId == 3 || AuditItem.MandatoryIntraOpDataId == 4 || AuditItem.MandatoryIntraOpDataId == 5) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopCheckinChecklist || false;
                                    }

                                });

                            }
                            $scope.ChangeIgnoreIntraopAnesthesiaCheckinChecklists = function (Id) {
                                //AuditEditobj.AllAnesthesiaAssessment
                                angular.forEach($scope.AuditobjIgnoreIntraopAscChecklists, function (item) {
                                    if (item.CheckListCategoryId == 26) {
                                        item.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopAnesthesiaCheckinChecklist || false;
                                    }
                                });
                            }
                            $scope.ChangeIgnoreIntraopAnesthesiaCheckOut = function (Id) {
                                //AuditEditobj.AllAnesthesiaAssessment
                                angular.forEach($scope.AuditobjIgnoreIntraopAscChecklists, function (item) {
                                    if (item.CheckListCategoryId == 27) {
                                        item.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopAnesthesiaCheckOut || false;
                                    }
                                });
                            }
                            $scope.ChangeIgnoreIntraopAnesthesiaCheckoutChecklists = function (Id) {
                                //AuditEditobj.AllAnesthesiaAssessment
                                angular.forEach($scope.AuditobjIgnoreIntraopAscChecklists, function (item) {
                                    if (item.CheckListCategoryId == 27) {
                                        item.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopAnesthesiaCheckoutChecklist || false;
                                    }
                                });
                            }
                            $scope.ChangeIgnorePreopTimeOutchecklist = function (Id) {
                                //AuditEditobj.AllAnesthesiaAssessment

                                angular.forEach($scope.AuditPreopOrgASCChecklist, function (item) {
                                    if (item.CheckListCategoryId == 7) {
                                        item.IsMandatory = $scope.AuditEditobj.AllIgnorePreopTimeOutchecklist || false;
                                    }
                                });
                            }
                            $scope.ChangePreopAnesthesiaNotesIsMandatory = function (Id) {
                          
                             
                                angular.forEach($scope.MandatoryData, function (AuditItem) {
                                    if (AuditItem.MandatoryDataId == 76) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AllIgnorePreOpAnesthesiaNotes || false;
                                    }

                                });

                            }

                            $scope.ChangeIgnoreIntraopTimeOutchecklist = function (Id) {
                                //AuditEditobj.AllAnesthesiaAssessment

                                angular.forEach($scope.AuditobjIgnoreIntraopAscChecklists, function (item) {
                                    if ( item.CheckListCategoryId == 8 || item.CheckListCategoryId == 9 ) {
                                        item.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopTimeOutchecklist || false;
                                    }
                                });

                                //angular.forEach($scope.AuditobjIgnoreIntraopMandatoryData, function (AuditItem) {
                                //    if (AuditItem.MandatoryIntraOpDataId == 24 || AuditItem.MandatoryIntraOpDataId == 25  ) {
                                //        AuditItem.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopTimeOutchecklist || false;
                                //    }
                                //});

                            }
                            $scope.ChekindctrnotescustomFilter = function (item) {
                                return [
                                    38, 39, 54, 55,
                                    40, 41, 56, 57,
                                    42, 58, 21, 22,
                                    44, 60,
                                    45, 61
                                    
                                ].includes(item.DoctorNotesMandatoryDataDataId) ;
                            };
                            $scope.ChekindctrnotesIOLcustomFilter = function (item) {
                                return [
                                    1, 2, 46, 62, 47, 63, 48, 64
                                ].includes(item.DoctorNotesMandatoryDataDataId);
                            };
                            $scope.CheckDCtrIgnoreItemscustomFilter = function (item) {
                                const ignoreIds = [
                                    38, 39, 54, 55,
                                    40, 41, 56, 57,
                                    42, 58, 21, 22,
                                    44, 60,
                                    45, 61, 1, 2, 46, 62, 47, 63, 48, 64, 23, 24, 28, 29, 30, 51, 52, 53, 3, 4, 5, 6, 8, 9, 36, 37, 11
                                ];

                                return ignoreIds.includes(item.DoctorNotesMandatoryDataDataId) && item.IsMandatory === false;
                            };
                            $scope.CheckDCtrIgnoreItemscustomFilterForPreopVervication = function (item) {
                                return [
                                    86,87,88,89,90,91,92,93,94,95,96,97,98,99
                                ].includes(item.DoctorNotesMandatoryDataDataId) && item.IsMandatory === false;
                            };
                            $scope.ChekindctrnoteOpeartiveNotescustomFilter = function (item) {
                                return [
                                    18, 19,20, 21, 22, 23, 24, 34, 32, 33, 25,38,42
                                ].includes(item.MandatoryPostOpDataId);
                            };
                            $scope.ChekindctrnoteDischatgecustomFilter = function (item) {
                                return [
                                    34, 26, 27, 28, 32, 33, 35, 36, 38, 39, 40, 41,44
                                ].includes(item.MandatoryPostOpDataId);
                            };
                            $scope.ChekindctrnotepreopverficationscustomFilter = function (item) {
                                return [
                                    86, 87, 88, 89, 90, 91, 92, 93, 94,
                                    95, 96, 97, 98, 99
                                ].includes(item.DoctorNotesMandatoryDataDataId) ;
                            };
                            $scope.ChekinintracustomFilter = function (item) {
                                return [1, 2, 3, 4].includes(item.MandatoryIntraOpDataId) && item.IsMandatory === false;
                            };
                            $scope.customIgnoreIntraopNurseCheckoutFilter = function (item) {
                                const allowedIds = [32, 33, 34, 36, 35, 3, 5, 6, 7, 8, 9, 10,
                                    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                                    37, 38, 39, 40, 43, 44, 45, 49, 50,
                                    51, 52, 53, 54, 55, 56,71,72];
                                return allowedIds.includes(item.MandatoryIntraOpDataId) && item.IsMandatory === false;;
                            };
                            $scope.ChangeIgnoreIntraopNurseCheckout = function (Id) {
                                angular.forEach($scope.AuditobjIgnoreIntraopMandatoryData, function (AuditItem) {
                                    if (AuditItem.MandatoryIntraOpDataId == 9 || AuditItem.MandatoryIntraOpDataId == 10 || AuditItem.MandatoryIntraOpDataId == 11 || AuditItem.MandatoryIntraOpDataId == 12 || AuditItem.MandatoryIntraOpDataId == 13 || AuditItem.MandatoryIntraOpDataId == 14 || AuditItem.MandatoryIntraOpDataId == 15 || AuditItem.MandatoryIntraOpDataId == 16 || AuditItem.MandatoryIntraOpDataId == 17 || AuditItem.MandatoryIntraOpDataId == 18 || AuditItem.MandatoryIntraOpDataId == 19 || AuditItem.MandatoryIntraOpDataId == 20 || AuditItem.MandatoryIntraOpDataId == 21 || AuditItem.MandatoryIntraOpDataId == 37 || AuditItem.MandatoryIntraOpDataId == 38 || AuditItem.MandatoryIntraOpDataId == 39 || AuditItem.MandatoryIntraOpDataId == 40||AuditItem.MandatoryIntraOpDataId == 44 || AuditItem.MandatoryIntraOpDataId == 45) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopNurseCheckout || false;
                                    }
                                });

                            }
                            $scope.ChangeIgnoreIntraopSurgeryStaff = function (Id) {
                                angular.forEach($scope.AuditobjIgnoreIntraopMandatoryData, function (AuditItem) {
                                    if (AuditItem.MandatoryIntraOpDataId == 32 || AuditItem.MandatoryIntraOpDataId == 33 || AuditItem.MandatoryIntraOpDataId == 34 || AuditItem.MandatoryIntraOpDataId == 36 || AuditItem.MandatoryIntraOpDataId == 35 || AuditItem.MandatoryIntraOpDataId == 73) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopSurgeryStaff || false;
                                    }
                                });

                            }
                            $scope.ChangeIgnoreIntraopSurgeryTimes= function (Id) {
                                angular.forEach($scope.AuditobjIgnoreIntraopMandatoryData, function (AuditItem) {
                                    if (AuditItem.MandatoryIntraOpDataId == 3 || AuditItem.MandatoryIntraOpDataId == 6 || AuditItem.MandatoryIntraOpDataId == 7 || AuditItem.MandatoryIntraOpDataId == 8 || AuditItem.MandatoryIntraOpDataId == 71 || AuditItem.MandatoryIntraOpDataId == 72) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopSurgeryTimes || false;
                                    }
                                });

                            }
                            $scope.ChangeIgnoreIntraopPatientDisposition = function (Id) {
                                angular.forEach($scope.AuditobjIgnoreIntraopMandatoryData, function (AuditItem) {
                                    if (AuditItem.MandatoryIntraOpDataId == 49 || AuditItem.MandatoryIntraOpDataId == 47 || AuditItem.MandatoryIntraOpDataId == 50 || AuditItem.MandatoryIntraOpDataId == 55 || AuditItem.MandatoryIntraOpDataId == 56) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopPatientDisposition || false;
                                    }
                                });

                            }
                            $scope.customIgnoreIntraopConsumablesFilter = function (item) {
                                const allowedIds = [60, 26, 57, 58, 59, 27, 28, 29, 30, 31,74];
                                return allowedIds.includes(item.MandatoryIntraOpDataId) && item.IsMandatory === false;
                            };
                            $scope.customIgnorePreopRosFilter = function (item) {
                                const allowedIds = [
                                    22, 23, 24, 25, 26, 27, 28, 29, 30,
                                    31, 32, 33, 34, 69, 70, 71, 72
                                ];

                                return allowedIds.includes(item.MandatoryDataId) && item.IsMandatory === false;
                            };
                            $scope.ChangeIgnoreIntraopConsumables = function (Id) {
                                angular.forEach($scope.AuditobjIgnoreIntraopMandatoryData, function (AuditItem) {
                                    if (AuditItem.MandatoryIntraOpDataId == 60 || AuditItem.MandatoryIntraOpDataId == 26 || AuditItem.MandatoryIntraOpDataId == 57 || AuditItem.MandatoryIntraOpDataId == 58 || AuditItem.MandatoryIntraOpDataId == 59 || AuditItem.MandatoryIntraOpDataId == 27 || AuditItem.MandatoryIntraOpDataId == 28 || AuditItem.MandatoryIntraOpDataId == 29 || AuditItem.MandatoryIntraOpDataId == 30 || AuditItem.MandatoryIntraOpDataId == 31 || AuditItem.MandatoryIntraOpDataId == 74) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AllIgnoreIntraopConsumables || false;
                                    }
                                });

                            }
                            $scope.ChangeIgnoreIntraopAnesthesiaOrders = function (Id) {
                                angular.forEach($scope.AuditobjIgnoreIntraopMandatoryData, function (AuditItem) {
                                    if (AuditItem.MandatoryIntraOpDataId == 62||AuditItem.MandatoryIntraOpDataId == 70) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AlIgnoreIntraopAnesthesiaOrders || false;
                                    }
                                });
                                angular.forEach($scope.AuditobjIntraAnesthesiaTypelist, function (AuditItem) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AlIgnoreIntraopAnesthesiaOrders || false;
                                    
                                });

                            }
                            $scope.ChangeIgnoreIntraopVitals = function (Id) {
                                angular.forEach($scope.AuditobjIgnoreIntraopMandatoryData, function (AuditItem) {
                                    if (AuditItem.MandatoryIntraOpDataId == 63 || AuditItem.MandatoryIntraOpDataId == 64 || AuditItem.MandatoryIntraOpDataId == 65 || AuditItem.MandatoryIntraOpDataId == 66 || AuditItem.MandatoryIntraOpDataId == 76 || AuditItem.MandatoryIntraOpDataId == 68 || AuditItem.MandatoryIntraOpDataId == 69 || AuditItem.MandatoryIntraOpDataId == 75) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AlIgnoreIntraopVitals || false;
                                    }
                                });
                              

                            }
                            $scope.ChangeIgnoreIgnorePostVitals = function (Id) {
                                angular.forEach($scope.PostOPMandatoryData, function (AuditItem) {
                                    if (AuditItem.MandatoryPostOpDataId == 1 || AuditItem.MandatoryPostOpDataId == 8 || AuditItem.MandatoryPostOpDataId == 10 || AuditItem.MandatoryPostOpDataId == 15 || AuditItem.MandatoryPostOpDataId == 16 || AuditItem.MandatoryPostOpDataId == 9) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.AlIgnorePostVitals || false;
                                    }
                                });
                               

                            }

                            $scope.ChangeIgnorePostOpCheckinChecklist = function (Id) {

                                angular.forEach($scope.PostOPOrgAscChecklist, function (item) {
                                    if (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 1) {
                                        item.IsMandatory = $scope.AuditEditobj.AllIgnorePostOpCheckinChecklist || false;
                                    }

                                });
                                angular.forEach($scope.PostOPMandatoryData, function (item) {
                                    if (item.MandatoryPostOpDataId == 37 || item.MandatoryPostOpDataId == 51 || item.MandatoryPostOpDataId == 52 || item.MandatoryPostOpDataId == 53) {

                                        item.IsMandatory = $scope.AuditEditobj.AllIgnorePostOpCheckinChecklist || false;
                                    }
                                });

                            }
                      
                            $scope.ChangeProgressNotesList = function (Id) {

                                angular.forEach($scope.PostOPOrgAscChecklist, function (item) {
                                    if (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 18) {
                                        item.IsMandatory = $scope.AuditEditobj.AllIgnoreProgressNotesList || false;
                                    }

                                });
                                angular.forEach($scope.PostOPMandatoryData, function (item) {
                                    if (item.MandatoryPostOpDataId == 11 ) {

                                        item.IsMandatory = $scope.AuditEditobj.AllIgnoreProgressNotesList || false;
                                    }
                                });

                            }

                            $scope.ChangeIgnorepostOpGeneralOrdersList = function (Id) {
                                  angular.forEach($scope.PostOPMandatoryData, function (item) {
                                      if (item.MandatoryPostOpDataId == 2 || item.MandatoryPostOpDataId == 3 || item.MandatoryPostOpDataId == 4) {

                                          item.IsMandatory = $scope.AuditEditobj.AllIgnorepostOpGeneralOrdersList || false;
                                    }
                                });
                                //angular.forEach($scope.PostOPOrgAscChecklist, function (item) {
                                //    if (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 19) {
                                //        item.IsMandatory = $scope.AuditEditobj.AllIgnorepostOpGeneralOrdersList || false;
                                //    }

                                //});

                            }
                            $scope.ChangeIgnorepostOpGeneralChecklist = function (Id) {
                               
                                angular.forEach($scope.PostOPOrgAscChecklist, function (item) {
                                    if (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 19) {
                                        item.IsMandatory = $scope.AuditEditobj.AllIgnorepostOpGeneralChecklist || false;
                                    }

                                });

                            }

                            $scope.ChangeIgnorepostOpCheckoutActionList = function (Id) {

                                angular.forEach($scope.PostOPOrgAscChecklist, function (item) {
                                    if (item.CheckListModuleId == 3 && item.CheckListSubTypeId == 2) {
                                        item.IsMandatory = $scope.AuditEditobj.AllIgnorepostOpCheckoutActionList || false;
                                    }

                                });
                                angular.forEach($scope.PostOPMandatoryData, function (item) {
                                    if (item.MandatoryPostOpDataId == 12 ) {

                                        item.IsMandatory = $scope.AuditEditobj.AllIgnorepostOpCheckoutActionList || false;
                                    }
                                });

                            }

                            $scope.ChangeIgnorepostOpAscPatientGoal = function (Id) {

                                angular.forEach($scope.PostOPPatientAscPatientGoal, function (item) {
                                    item.IsMandatory = $scope.AuditEditobj.AllIgnorepostOpAscPatientGoal || false;
                                });

                            }

                            $scope.ChangeIgnorePostopReviewedby = function (Id) {

                                angular.forEach($scope.PostOPMandatoryData, function (item) {
                                    if (item.MandatoryPostOpDataId == 14 || item.MandatoryPostOpDataId == 8) {

                                        item.IsMandatory = $scope.AuditEditobj.AllIgnorePostopReviewedby || false;
                                    }
                                });

                            }


                            $scope.ChangeHnpIsMandatory = function (Id) {
                                //angular.forEach($scope.AuditPreopOrgASCChecklist, function (AuditItem) {
                                //    if (AuditItem.CheckListId === 168 || AuditItem.CheckListId === 169 || AuditItem.CheckListId === 191) {
                                //        AuditItem.IsMandatory = $scope.AuditEditobj.AllNurseInterventions || false;
                                //    }

                                //});
                                angular.forEach($scope.MandatoryData, function (item) {
                                    if (item.MandatoryDataId == 36 || item.MandatoryDataId == 37 || item.MandatoryDataId == 39 || item.MandatoryDataId == 40 || item.MandatoryDataId == 41 || item.MandatoryDataId == 42 || item.MandatoryDataId == 43 || item.MandatoryDataId == 44 || item.MandatoryDataId == 45 || item.MandatoryDataId == 46) {
                                        item.IsMandatory = $scope.AuditEditobj.AllHnP || false;
                                    }

                                });
                                angular.forEach($scope.PreopLabInvestigation, function (item) {
                                        item.IsMandatory = $scope.AuditEditobj.AllHnP || false;
                                });

                                angular.forEach($scope.AuditobjRespiratory, function (msitem) {
                                    //msitem.PatientAnesthesiaPlanId = null;
                                    msitem.IsMandatory = $scope.AuditEditobj.AllHnP || false;
                                    
                                });

                            }
                            $scope.ChangePreopRosIsMandatoryData = function (Id) {
                                
                                angular.forEach($scope.MandatoryData, function (item) {
                                    if (item.MandatoryDataId == 22 || item.MandatoryDataId == 23 || item.MandatoryDataId == 24 || item.MandatoryDataId == 25 || item.MandatoryDataId == 26 || item.MandatoryDataId == 27 || item.MandatoryDataId == 28 || item.MandatoryDataId == 29 || item.MandatoryDataId == 30
                                        || item.MandatoryDataId == 31 || item.MandatoryDataId == 32 || item.MandatoryDataId == 33 || item.MandatoryDataId == 34 || item.MandatoryDataId == 69 || item.MandatoryDataId == 70 || item.MandatoryDataId == 71 || item.MandatoryDataId == 72) {
                                        item.IsMandatory = $scope.AuditEditobj.AllPreopRos || false;
                                    }

                                });

                            }
                            $scope.ChangePreopAnsMedicationsIsMandatoryData = function (Id) {

                                angular.forEach($scope.MandatoryData, function (item) {
                                    if (item.MandatoryDataId == 3 || item.MandatoryDataId == 4 || item.MandatoryDataId == 20 || item.MandatoryDataId == 5) {
                                        item.IsMandatory = $scope.AuditEditobj.AllPreopAnsMedications || false;
                                    }

                                });

                            }
                            $scope.ChangePreopPatientArrival = function (Id) {

                                angular.forEach($scope.MandatoryData, function (item) {
                                    if (item.MandatoryDataId == 75) {
                                        item.IsMandatory = $scope.AuditEditobj.AllPatientArrival || false;
                                    }

                                });
                                angular.forEach($scope.AuditPreopOrgASCChecklist, function (item) {
                                    if (item.CheckListCode == 298) {
                                        item.IsMandatory = $scope.AuditEditobj.AllPatientArrival || false;
                                    }

                                });

                            }
                            $scope.ChangeChecklistIsMandatory = function (Id) {
                                Id = Id || 0;
                                if (Id == 6) {
                                    angular.forEach($scope.AuditPreopOrgASCChecklist, function (item) {
                                        if (item.CheckListCategoryId == Id) {
                                            item.IsMandatory = $scope.AuditEditobj.AllGeneralChecklist || false;
                                        }

                                    });
                                } else if (Id == 1) {
                                    angular.forEach($scope.AuditPreopOrgASCChecklist, function (item) {
                                        if (item.CheckListCategoryId == Id) {
                                            if (item.CheckListId !== 170 && item.CheckListId !== 168 && item.CheckListId !== 169) {
                                                item.IsMandatory = $scope.AuditEditobj.AllClinicalChecklist || false;
                                            }
                                        }

                                    });
                                } else if (Id == 11) {
                                    angular.forEach($scope.AuditPreopOrgASCChecklist, function (item) {
                                        if (item.CheckListCategoryId == Id) {
                                            item.IsMandatory = $scope.AuditEditobj.AllFallRiskChecklist || false;
                                        }

                                    });
                                } else if (Id == 5) {
                                    angular.forEach($scope.AuditPreopOrgASCChecklist, function (item) {
                                        if (item.CheckListCategoryId == Id) {
                                            item.IsMandatory = $scope.AuditEditobj.AllMedicationChecklist || false;
                                        }

                                    });
                                } else if (Id == 12) {
                                    angular.forEach($scope.AuditPreopOrgASCChecklist, function (item) {
                                        if (item.CheckListCategoryId == Id) {
                                            item.IsMandatory = $scope.AuditEditobj.AllPatientChecklist || false;
                                        }

                                    });
                                    angular.forEach($scope.MandatoryData, function (item) {
                                        if (item.MandatoryDataId == 16 || item.MandatoryDataId == 1 || item.MandatoryDataId == 2 || item.MandatoryDataId == 10 || item.MandatoryDataId == 12 || item.MandatoryDataId == 11 || item.MandatoryDataId == 73 ) {
                                            item.IsMandatory = $scope.AuditEditobj.AllPatientChecklist || false;
                                        }
                                    });
                                    //angular.forEach($scope.MandatoryData, function (item) {
                                    //    if (item.MandatoryDataId == 8 || item.MandatoryDataId == 9) {
                                    //        item.IsMandatory = $scope.AuditEditobj.AllSSV || false;
                                    //    }

                                    //});
                                } else if (Id == 25) {
                                    angular.forEach($scope.AuditPreopOrgASCChecklist, function (item) {
                                        if (item.CheckListCategoryId == Id) {
                                            item.IsMandatory = $scope.AuditEditobj.AllDietOrMedicationsTaken || false;
                                        }

                                    });
                                }

                            }

                            $scope.ChnagesIgnoreDcotorNotes = function (Id) {
                           
                             
                                angular.forEach($scope.AuditobjDoctorNotes, function (AuditItem) {
                                    const allowedIds = new Set([1, 2, 3, 4, 5, 6, 8, 9, 11, 21, 22, 23, 24, 28, 29, 30,
                                        36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
                                        50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
                                        64, 65, 66, 86, 87, 88, 90, 91, 92, 93, 94, 95, 96, 97, 98,99]);

                                    if (allowedIds.has(AuditItem.DoctorNotesMandatoryDataDataId)) {
                                        AuditItem.IsMandatory = $scope.AuditEditobj.ALDoctorNotes || false;
                                    }
                                   

                                });

                            }

                            $scope.UpdateIgnoreFields = function (type) {
                                let obj = '';
                                if (type == 1) {
                                    obj = {

                                        "UserId": $scope.UserId,
                                        "ParentOrganizationId": $scope.ParenthospitalId || 0,
                                        "AppointmentID": $scope.SelectedAppointmentId || 0,
                                        "HospitalId": $scope.HospitalId || 0,
                                        //"Visitid": Visitid || 0,
                                        "TypeId":type||1,
                                        "PatientId": $scope.cacheStorageItem.PatientID || 0,
                                        "OrgASCChecklist": $scope.AuditPreopOrgASCChecklist || [],
                                        "MandatoryData": $scope.MandatoryData||[],
                                        "Respiratory": $scope.AuditobjRespiratory||[],
                                        "PreviousAnesthetics": $scope.AuditobjPreviousAnesthetics||[],
                                        "AnesthesiaTypelist": $scope.AuditobjPreopAnesthesiaTypelist ||[],
                                        "PatientAscPatientGoal": [],
                                        "AppointmentMandatoryDataId": $scope.AppointmentMandatoryDataId || 0,
                                        "LabInvestigation": $scope.PreopLabInvestigation||[],



                                    }
                                } else if (type == 2) {
                                    obj = {

                                        "UserId": $scope.UserId,
                                        "ParentOrganizationId": $scope.ParenthospitalId || 0,
                                        "AppointmentID": $scope.SelectedAppointmentId || 0,
                                        "HospitalId": $scope.HospitalId || 0,
                                        //"Visitid": Visitid || 0,
                                        "PatientId": $scope.cacheStorageItem.PatientID || 0,
                                        "OrgASCChecklist": $scope.AuditobjIgnoreIntraopAscChecklists || [],
                                        "MandatoryData": $scope.AuditobjIgnoreIntraopMandatoryData||[],
                                        "Respiratory": [],
                                        "PreviousAnesthetics": [],
                                        "AnesthesiaTypelist": $scope.AuditobjIntraAnesthesiaTypelist|| [],
                                        "PatientAscPatientGoal": [],
                                        "TypeId": type || 1,
                                        //"AppointmentMandatoryIntraDataId": $scope.AppointmentMandatoryIntraDataId || 0,
                                        "AppointmentMandatoryDataId": $scope.AppointmentMandatoryDataId || 0,
                                        "LabInvestigation": [],


                                    }
                                } else if(type == 3) {
                                    obj = {

                                        "UserId": $scope.UserId,
                                        "ParentOrganizationId": $scope.ParenthospitalId || 0,
                                        "AppointmentID": $scope.SelectedAppointmentId || 0,
                                        "HospitalId": $scope.HospitalId || 0,
                                        //"Visitid": Visitid || 0,
                                        "PatientId": $scope.cacheStorageItem.PatientID || 0,
                                        "OrgASCChecklist": $scope.PostOPOrgAscChecklist || [],
                                        "MandatoryData": $scope.PostOPMandatoryData||[],
                                        "Respiratory": [],
                                        "PreviousAnesthetics": [],
                                        "AnesthesiaTypelist": [],
                                        "PatientAscPatientGoal": $scope.PostOPPatientAscPatientGoal || [],
                                        "TypeId": type || 1,
                                        //"AppointmentMandatoryPostDataId": $scope.AppointmentMandatoryPostDataId||0,
                                        "AppointmentMandatoryDataId": $scope.AppointmentMandatoryDataId || 0,
                                        "LabInvestigation":  [],

                                    }
                                }
                                else if (type == 4) {
                                    obj = {

                                        "UserId": $scope.UserId,
                                        "ParentOrganizationId": $scope.ParenthospitalId || 0,
                                        "AppointmentID": $scope.SelectedAppointmentId || 0,
                                        "HospitalId": $scope.HospitalId || 0,
                                        //"Visitid": Visitid || 0,
                                        "PatientId": $scope.cacheStorageItem.PatientID || 0,
                                        "OrgASCChecklist":  [],
                                        "MandatoryData": $scope.AuditobjDoctorNotes || [],
                                        "Respiratory": [],
                                        "PreviousAnesthetics": [],
                                        "AnesthesiaTypelist":  [],
                                        "PatientAscPatientGoal": [],
                                        "TypeId": type || 1,
                                        "PatientFaceSheetId": $scope.PatientFaceSheetId || null,

                                        //"AppointmentMandatoryIntraDataId": $scope.AppointmentMandatoryIntraDataId || 0,
                                        "AppointmentMandatoryDataId": $scope.AppointmentMandatoryDataId || 0,
                                        "LabInvestigation": [],


                                    }
                                }
                                if (obj == '') {
                                    return false;
                                }

                                eHnoteSurgeryService.UpdateAuditReportsIgnoreFields(obj).then(function (resp) {
                                    if (resp.data.Status == "Success") {
                                    //    console.log("Added");
                                        let Tab = 0, SubtabTab = 0;
                                        Tab = angular.copy($scope.Auditobj.Tab) || 0
                                        SubtabTab = angular.copy($scope.Auditobj.SubtabTab) || 0
                                        $scope.GetASCAuditReportData();
                                        $scope.AuditEditobj = angular.copy($scope.getAuditEditObj());
                                        $scope.Auditobj = angular.copy($scope.GetAuditobj());
                                        $scope.Auditobj.Tab = Tab || 0;
                                        $scope.Auditobj.SubtabTab = SubtabTab || 0;
                                    }
                                });
                            }

                        }
                    });
                };
             
             
                

            }
        });
        mInstanceAdd.result.then(function (data) {
            $scope.GetAllAuditAscAppointmentsList();
        }, function (cancel) {

        });
    };
    $scope.ASCAuditManagementInfo = {
        templateUrl: 'templates/uibpopups/ASCAuditManagementInfoPopover.html',
    };
    $scope.SearchObj = {
        "DoctorID": 0,
    
        "ConsultationDt": moment().format("MM-DD-YYYY"),
        "SearchText": "",
        "searchPatientTxt": "",
        "searchPatientIdTxt": "",
        "searchPatientOldMR": "",
        "FromDate": moment().subtract(7, 'days').format("MM-DD-YYYY")||null,
        "ToDate": moment().format("MM-DD-YYYY"),

    }
    $scope.GetAllIndicatorForFacility = 0;
    $scope.ChangeApptBranch = function (item) {
        $scope.GetAllIndicatorForFacility = 0;
        if (item.ClinicId == 0) {
            $scope.GetAllIndicatorForFacility = 1;
            $scope.GetParentOrgVisitReasons();
        } else {
            $scope.GetVisitReasonsNew(item.ClinicId);
        }
        $scope.AppListselectedclinic = item || {};
        //$scope.GetOrganizationFacilityData(item.ClinicId);
        //$scope.GetAllUsers(item.ClinicId);
        getDoctorsbySubSpecializations(item.ClinicId)

    }

    $scope.GetVisitReasonsNew = function (id) {
        id = id || 0;
        var Org_id = 0;
        if (id == 0) {
            Org_id = $scope.HospitalId;
        } else {
            Org_id = id;
        }
        var obj = {
            "OrganizationId": Org_id,
            "UserId": doctorinfo.doctorid,
            "VisitTypeId": 0,
            "visitReasonSearch": "",
            "PageNumber": 1,
            "PageSize": 1000,
            "IsFrequent": "N"
        };
        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(obj).then(function (resp) {
            if (resp.data !== undefined) {
                $scope.AllDoctorsObj.AllVisitReasonsCheck = false;
                if (resp.data.rows.length > 0) {
                    $scope.Visitreasons = resp.data.rows;
                    $scope.Visitreasons = $filter('filter')($scope.Visitreasons, { 'VisitTypeId': 4 }, true);
                    //angular.forEach($scope.Visitreasons, function (item) {
                    //    item.isChecked = true;
                    //});
                }

            }
        });
    };
    $scope.navtoAscTodayDate = function () {
        var refDate = moment(new Date(), 'MM-DD-YYYY').format('YYYY-MM-DD');// Format to ISO 8601
        $scope.SearchObj.ConsultationDt = refDate;
        $scope.GetAllAuditAscAppointmentsList();
    };
    //$scope.$watch("SearchObj.ConsultationDt", function (newVal, oldVal) {
    //    $scope.showifnotCurrentDate = true;
    //    $scope.currentDate = new Date();
    //    if (moment(newVal, 'MM-DD-YYYY').isValid()) {
    //        $scope.selectedDate = moment(newVal, "MM-DD-YYYY").format("YYYY-MM-DD");
    //        console.log($scope.currentDate + "__" + $scope.selectedDate);
    //        var refDate = moment().format('YYYY-MM-DD');
    //        if (moment(refDate).isSame($scope.selectedDate)) {
    //            console.log("The target date is equal to the current date");
    //            $scope.showifnotCurrentDate = false;
    //        }
    //        $scope.SearchObj.ConsultationDt = $scope.selectedDate;
    //    } else {
    //        console.log("Invalid date format: " + newVal);
    //        var TodayDate = moment().format('YYYY-MM-DD');  // today date
    //        var refDate = $filter('date')(newVal, "yyyy-MM-dd");
    //        if (moment(refDate).isSame(TodayDate)) {
    //            console.log("The target date is equal to the current date");
    //            $scope.showifnotCurrentDate = false;
    //        }
    //        // Handle invalid date format here if necessary
    //        var TodayDate = moment().format('YYYY-MM-DD');  // today date
    //        var refDate = $filter('date')(newVal, "yyyy-MM-dd");
    //        if (moment(refDate).isSame(TodayDate)) {
    //            console.log("The target date is equal to the current date");
    //            $scope.showifnotCurrentDate = false;
    //        }
    //    }
    //}, true);
    //$scope.$watch('SearchObj.ToDate', function (newValue) {
    //    if (newValue) {
    //        // Subtract 30 days from ToDate
    //        let fromDate = new Date(newValue);
    //        fromDate.setDate(fromDate.getDate() - 30);
    //        let formattedFromDate = ('0' + (fromDate.getMonth() + 1)).slice(-2) + '-' +
    //            ('0' + fromDate.getDate()).slice(-2) + '-' +
    //            fromDate.getFullYear();
    //        $scope.SearchObj.FromDate = formattedFromDate;
    //    }
    //});
    $scope.getAscListingDetailsonDateChange = function (date) {
        $scope.SearchObj.ConsultationDt = moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD');
    };
    $scope.changeradiobtn = function (item, type) {

        $scope.SearchObj.PatientId = 0;

        // dont clear text in input fields // new enhancement
        if (type == "1") {
            if ($scope.SearchObj.searchPatientIdTxt !== "") {
                $scope.SearchObj.searchPatientTxt = $scope.SearchObj.searchPatientIdTxt;
            }
            if ($scope.SearchObj.searchPatientOldMR !== "") {
                $scope.SearchObj.searchPatientTxt = $scope.SearchObj.searchPatientOldMR;
            }
        }
        if (type == "2") {
            if ($scope.SearchObj.searchPatientTxt !== "") {
                $scope.SearchObj.searchPatientIdTxt = $scope.SearchObj.searchPatientTxt;
            }
            if ($scope.SearchObj.searchPatientOldMR !== "") {
                $scope.SearchObj.searchPatientIdTxt = $scope.SearchObj.searchPatientOldMR;
            }
        }
        if (type == "3") {
            if ($scope.SearchObj.searchPatientTxt !== "") {
                $scope.SearchObj.searchPatientOldMR = $scope.SearchObj.searchPatientTxt;
            }
            if ($scope.SearchObj.searchPatientIdTxt !== "") {
                $scope.SearchObj.searchPatientOldMR = $scope.SearchObj.searchPatientIdTxt;
            }
        }
        if (type == "4") {
            if ($scope.SearchObj.searchPatientIdTxt !== "") {
                $scope.SearchObj.searchPatientIdTxt = $scope.SearchObj.searchPatientIdTxt;
            }
            if ($scope.SearchObj.searchPatientIdTxt !== "") {
                $scope.SearchObj.searchPatientIdTxt = $scope.SearchObj.searchPatientIdTxt;
            }
        }

    }
    $scope.patSearchType = 2;
    $scope.changePatientApptSearchText = function (text, type) {
        //$timeout(function () {
            if (type == 1) {
                if (text === "" || text === undefined) {
                    $scope.AscAppointmentsList = angular.copy($scope.MainAscAppointmentsList);
                } else {
                    $scope.AscAppointmentsList = $filter("filter")($scope.MainAscAppointmentsList, { "PatientName": text }) || [];
                }
            }
            if (type == 2) {
                if (text === "" || text === undefined) {
                    $scope.AscAppointmentsList = angular.copy($scope.MainAscAppointmentsList);
                } else {
                    $scope.AscAppointmentsList = $filter("filter")($scope.MainAscAppointmentsList, { "PatientMrNo": text }) || [];
                }
            }
            if (type == 3) {
                if (text === "" || text === undefined) {
                    $scope.AscAppointmentsList = angular.copy($scope.MainAscAppointmentsList);
                } else {
                    $scope.AscAppointmentsList = $filter("filter")($scope.MainAscAppointmentsList, { "PatientOldMrNo": text }) || [];
                }
            }
            if (type == 4) {
                text = text + " 00:00:00";
                /*  text = $filter('date')(new Date(text), "yyyy-MM-dd");*/
                var parsedDate = new Date(text);
                if (!isNaN(parsedDate.getTime())) {
                    text = $filter('date')(parsedDate, "yyyy-MM-dd");
                } else {
                    // Log an error or handle the invalid date case
                    alertify.error("Invalid date format:", text);
                    // Return false or handle the error in another way
                    text = "";
                    return false;
                }
                if (text === "" || text === undefined) {
                    $scope.AscAppointmentsList = angular.copy($scope.MainAscAppointmentsList);
                } else {
                    $scope.AscAppointmentsList = $filter("filter")($scope.MainAscAppointmentsList, function (event) {
                        // Check if the DOB in the patientInfo section matches the provided DOB
                        if (event.Patient && event.Patient.DOB) {
                            return event.Patient.DOB === text;
                        }
                    }) || [];
                }
            }
    //    }, 50);
    };
    $scope.onChangeSearchAppt = function (text, type) {

        //if ($scope.ASCDynamicStatusTabs.Subtab !== 1) {
        //    $scope.SearchSurgeryList(0);
        //} else {
            text = text || "";
            if (text === "") {
                $scope.AscAppointmentsList = angular.copy($scope.MainAscAppointmentsList);
            }
        /*}*/
    }
    $scope.newclearPatientApptSearch = function () {
        $scope.SearchObj.searchPatientTxt = "";
        $scope.SearchObj.searchPatientOldMR = "";
        $scope.SearchObj.searchPatientIdTxt = "";

        $scope.AscAppointmentsList = angular.copy($scope.MainAscAppointmentsList);
    };
  

    $scope.GetAllAuditAscAppointmentsList = function (val) {
        let newlist1 = "";
      

        let newlist2 = "";
        for (var i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                /*newlist2 += "," + $scope.Visitreasons[i].ReasonId;*/
                newlist2 += "," + $scope.Visitreasons[i].ParentAppointmentVisitReasonId;
            }
        }
        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let newlist3 = "";


        let newlist4 = "";
 

        let newlist5 = "";
  
        let newlist6 = "";


        let newlist7 = "";
 

        let newlist8 = "";
        for (var i in $scope.MultiselectDoctorlist) {
            if ($scope.MultiselectDoctorlist[i].isChecked) {
                newlist8 += "," + $scope.MultiselectDoctorlist[i].DoctorID;
            }
        }
        if (newlist8.charAt(0) === ",") {
            newlist8 = newlist8.slice(1);
        }

        let consultationDt = $filter('date')($scope.SearchObj.ConsultationDt, "yyyy-MM-dd");
        //var newlist12 = "";
        //for (var i in $scope.FacilityList) {
        //    if ($scope.FacilityList[i].IsChecked) {
        //        newlist12 += "," + $scope.FacilityList[i].OrganizationFacilityId;
        //    }
        //}
        //if (newlist12.charAt(0) === ",") {
        //    newlist12 = newlist12.slice(1);
        //}

        //if ($scope.AppListselectedclinic.ClinicId == 0) {
        //    var hospitalid = $scope.HospitalId;
        //} else {
        //    var hospitalid = $scope.AppListselectedclinic.ClinicId;
        //}
        var Locationids = '';
        if ($scope.GetAllIndicatorForFacility == 1 || $scope.AppListselectedclinic.ClinicId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId !== 0; });
            Locationids = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
        } else {
            Locationids = $scope.AppListselectedclinic.ClinicId;
        }

        let internallist2 = "";
        for (var i in $scope.GetStatusList) {
            if ($scope.GetStatusList[i].isChecked) {
                internallist2 += "," + $scope.GetStatusList[i].Id;
            }
        }
        if (internallist2.charAt(0) === ",") {
            internallist2 = internallist2.slice(1);
        }
        //if ($scope.AllDoctorsObj.AllDoctorCheck == true) {
        //    internallist2 += "," + '0';
        //}
        var SelectedDoctorsList = [];
        if ($scope.MultiselectDoctorlist.length > 0) {
            SelectedDoctorsList = _.where($scope.MultiselectDoctorlist, { isChecked: true });
        }
        var selectedStatusList = [];
        if ($scope.GetStatusList.length > 0) {
            selectedStatusList = _.where($scope.GetStatusList, { isChecked: true });
        }

        var selectedVisitreasons = [];
        if ($scope.Visitreasons.length > 0) {
            selectedVisitreasons = _.where($scope.Visitreasons, { isChecked: true });
        }
        let FromDate = $filter('date')($scope.SearchObj.FromDate, "yyyy-MM-dd");
        let ToDate = $filter('date')($scope.SearchObj.ToDate, "yyyy-MM-dd");


        var selectedAuditList = {
            "SelectedDoctorsList": SelectedDoctorsList || [],
            "FromDate": FromDate || "",
            "ToDate": ToDate || "",

            "ApptBranchLocations": Locationids || '',
            "Visitreasons": selectedVisitreasons || [],
            "AuditStatusFilterArray": selectedStatusList || [],
        };
        eHnoteMasterDataService.addSelectedAscAuditPopUp(selectedAuditList);

        let params = {
            "DoctorIds": newlist8,
            //"ConsultationDt": consultationDt,
            "FromDate": FromDate,
            "ToDate": ToDate,
            "HospitalID": $scope.HospitalID,
            "PageSize": $scope.itemsperpage,
            "PageNumber": $scope.currentPage,
            "UserId": $scope.UserId,
            //"AppointmentStatusIDLst": newlist1,
            //"VisitStatusIDLst": "1,2,3",
            "AppointmentTypeStatusIDList": "4",
            "VisitReasonIdList": newlist2,
            "BookingTypeIds": newlist3,
            "AppointmentStatusIds": newlist4,
            "BookingStatusIds": newlist5,
            "ProfileStatusIds": newlist6,
            "PatientTagListIds": newlist7,
            "FacilityListIds": "",
            "Locationids": Locationids,
            "AddReportStatusId": internallist2 || "",
        }
        eHnotePatientDataService.GetAllAuditAscAppointmentsList(params, OnGetSurgeriesListSuccess1, OnGetSurgeriesListError1);
        function OnGetSurgeriesListSuccess1(data) {
            if (data.status == "Success") {
                $scope.Count=data.Count || 0;
                $scope.mainobj = {
                    "AppointmentId": '',
                    "PatientId": '',
                    "Patientlist": [],

                }
                $scope.MainAscAppointmentsList = angular.copy(data.rows);
                $scope.AscAppointmentsList = angular.copy(data.rows);

                if ($scope.MainAscAppointmentsList.length > 0) {

                    angular.forEach($scope.MainAscAppointmentsList, function (item) {
                        var ConvertWalkInTime = $filter('date')(item.WalkInTime, "hh:mm a") || "";  /*moment(item.WalkInTime).format("hh:mm a")*/
                        item.CheckInTime = "";
                        item.CheckInTime = ConvertWalkInTime;
                        var datetime = moment(item.ConsultationDt + "T" + item.StartTime);
                        item.ConvertDateStartTime = datetime.format("hh:mm A");
                        item.ConsultationDate = moment(item.ConsultationDt).format("MM-DD-YYYY");

                        // for past date validations
                        let today = moment().startOf('day');
                        let date1 = moment(item.ConsultationDt);

                        let t1 = today.valueOf(); // Returns milliseconds since Unix epoch
                        let t2 = date1.valueOf(); // Returns milliseconds since Unix epoch


                        // do not remove past appointment parameter; based on this parameter we are enabling/disabling dynamic status by storing in cache
                        if (t1 > t2) {
                            item.IsPastAppointment = true;
                            item.IsFutureAppointment = false;
                            item.IsCurrentAppointment = false;
                        } else if (t1 < t2) {
                            item.IsPastAppointment = false;
                            item.IsFutureAppointment = true;
                            item.IsCurrentAppointment = false;
                        } else if (t1 == t2) {
                            item.IsPastAppointment = false;
                            item.IsFutureAppointment = false;
                            item.IsCurrentAppointment = true;
                        }
                        if (item.Patient.MobileNo.length > 0) {
                            var obj = eHnoteUserDataService.UsMobileFormatChange(item.Patient.MobileNo);
                            item.Patient.MobileNo = obj.UsFormatMobileNumber;
                        }

                        // for client-side filtering purpose

                        item.PatientName = item.Patient.FullName;
                        item.PatientOldMrNo = item.Patient.OldMrno;
                        item.PatientMrNo = item.Patient.PatientDisplayId;

                        item.PreOpNurseChartStatus = item.PreOpNurseChartStatus || '';
                        item.PreOpAnesthesiaChartStatus = item.PreOpAnesthesiaChartStatus || '';

                        item.PostOpNurseChartStatus = item.PostOpNurseChartStatus || '';
                        item.PostOpAnesthesiaChartStatus = item.PostOpAnesthesiaChartStatus || '';
                        item.R2PostOpNurseChartStatus = item.R2PostOpNurseChartStatus || '';
                        item.R2PostOpAnesthesiaChartStatus = item.R2PostOpAnesthesiaChartStatus || '';

                        item.IntraOpNurseChartStatus = item.IntraOpNurseChartStatus || '';
                        item.IntraOpAnesthesiaChartStatus = item.IntraOpAnesthesiaChartStatus || '';
                        item.IsDoctorDoctroNotesSignOff = item.FaceSheetLastSignOffUserDetails.some(ditem => ditem.UserType != "Nurse");
                        item.IsDoctorOperativeNotesSignOff = item.OperativeLastSignOffUserDetails.some(ditem => ditem.UserType != "Nurse");
                        item.IsDoctorDisChargeSignOff = item.DischargeLastSignOffUserDetails.some(ditem => ditem.UserType != "Nurse");

                        item.PreOpStatusClass = calculatePreOpStatus(item);
                        item.IntraOpStatusClass = calculateIntraOpStatus(item);
                        item.PostOpStatusClass = calculatePostOpStatus(item);
                    });
                    $scope.AscAppointmentsList = angular.copy($scope.MainAscAppointmentsList);
                    $scope.AscAppointmentsListCount = data.Count;
                    //var indexofAppt = 0;
                    //val = $scope.cacheStorageItem.AppointmentId || "";
                    //if ($scope.AscAppointmentsList.length > 0 && val != "") {
                    //    let ApptInfo = $filter('filter')($scope.AscAppointmentsList, { 'AppointmentID': val }, true)[0] || 0;
                    //    var indexofAppt = $scope.AscAppointmentsList.indexOf(ApptInfo) || 0;
                    //    if (indexofAppt > -1) {
                    //        $scope.SelectAppointment1($scope.AscAppointmentsList[indexofAppt]);
                    //    } else {
                    //        $scope.NavObj.IsApptSelectedInfoInd = false;
                    //    }
                    //}


                    //else {
                    //    $scope.SelectAppointment1($scope.AscAppointmentsList[0]);
                    //}
                }
            }
        }
        function OnGetSurgeriesListError1(err) {
            alertify.error("Error in Getting AscAppointments List");
        }

    };
    function calculatePreOpStatus(item) {
        const preOpNurseSignedOrEntered = item.PreOpNurseChartStatus === 'E';
        const preOpAnesthesiaSignedOrEntered = item.PreOpAnesthesiaChartStatus === 'E';
        const faceSheetSignedOrEntered = item.FaceSheetChartStatus === 'E';
        const isDoctorSignedOff = item.IsDoctorDoctroNotesSignOff;

        if (preOpNurseSignedOrEntered && preOpAnesthesiaSignedOrEntered && faceSheetSignedOrEntered && isDoctorSignedOff) {
            return 'status__green--dot status__green--';
        } else if (preOpNurseSignedOrEntered || preOpAnesthesiaSignedOrEntered || faceSheetSignedOrEntered || isDoctorSignedOff) {
            return 'status__yellow--dot status__yellow--';
        } else {
            return 'status__red--dot status__red--';
        }
    }

    function calculateIntraOpStatus(item) {
        const intraOpNurseSignedOrEntered = item.IntraOpNurseChartStatus === 'E';
        const intraOpAnesthesiaSignedOrEntered = item.IntraOpAnesthesiaChartStatus === 'E';
        const operativeChartSignedOrEntered = item.OperativeChartStatus === 'E';
        const isDoctorSignedOff = item.IsDoctorOperativeNotesSignOff;

        if (intraOpNurseSignedOrEntered && intraOpAnesthesiaSignedOrEntered && operativeChartSignedOrEntered && isDoctorSignedOff) {
            return 'status__green--dot status__green--';
        } else if (intraOpNurseSignedOrEntered || intraOpAnesthesiaSignedOrEntered || operativeChartSignedOrEntered || isDoctorSignedOff) {
            return 'status__yellow--dot status__yellow--';
        } else {
            return 'status__red--dot status__red--';
        }
    }

    function calculatePostOpStatus(item) {
        const postOpNurseSignedOrEntered = item.PostOpNurseChartStatus === 'E';
        const postOpAnesthesiaSignedOrEntered = item.PostOpAnesthesiaChartStatus === 'E';
        const r2PostOpNurseSignedOrEntered = item.R2PostOpNurseChartStatus === 'E';
        const r2PostOpAnesthesiaSignedOrEntered = item.R2PostOpAnesthesiaChartStatus === 'E';
        const dischargeChartSignedOrEntered = item.DischargeChartStatus === 'E';
        const isDoctorSignedOff = item.IsDoctorDisChargeSignOff;

        if (postOpNurseSignedOrEntered && postOpAnesthesiaSignedOrEntered && r2PostOpNurseSignedOrEntered &&
            r2PostOpAnesthesiaSignedOrEntered && dischargeChartSignedOrEntered && isDoctorSignedOff) {
            return 'status__green--dot status__green--';
        } else if (postOpNurseSignedOrEntered || postOpAnesthesiaSignedOrEntered || r2PostOpNurseSignedOrEntered ||
            r2PostOpAnesthesiaSignedOrEntered || dischargeChartSignedOrEntered || isDoctorSignedOff) {
            return 'status__yellow--dot status__yellow--';
        } else {
            return 'status__red--dot status__red--';
        }
    }
    $scope.selectedDoctors = 'Select Doctors';
    $scope.checkAllDoctor = function (val) {
        if (val) {
            angular.forEach($scope.MultiselectDoctorlist, function (item) {
                item.isChecked = true;
            });

            $scope.selectedDoctors = 'All';
        } else {
            angular.forEach($scope.MultiselectDoctorlist, function (item) {
                item.isChecked = false;
            });

            $scope.selectedDoctors = 'Select Doctors';
        }
        var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
        $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray.length ? true : false;

    };

    $scope.DoctorToggle = function (item) {
        var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
        $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedDoctors = "Select Doctor";
        } else {
            if (checkedArray.length === 1) {
                $scope.selectedDoctors = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.selectedDoctors = "Selected Doctors";
            }
        }
    };
    $scope.changeAppointmentBranch = function (obj, type, screen) {

        screen = screen || 'screen';


        if (obj.IsChecked) {
            $scope.LocationTypeObj.SelectLocationString = "Selected";
            if (obj.ClinicId === 0) {
                angular.forEach($scope.ApptBranchLocations, function (mitem) {
                    mitem.IsChecked = true;
                });

                $scope.LocationTypeObj.SelectLocationString = obj.BranchName||"All Locations";
            }
            else {


                if ($scope.ApptBranchLocations.every(mitem => mitem.ClinicId === 0 || mitem.IsChecked)) {
                    $scope.ApptBranchLocations.forEach(mitem => {
                        if (mitem.ClinicId === 0) {
                            mitem.IsChecked = true;

                            $scope.LocationTypeObj.SelectLocationString = obj.BranchName ||"Select";
                        }
                    });
                }

            }

        }
        else {
            if (obj.ClinicId === 0) {
                angular.forEach($scope.ApptBranchLocations, function (mitem) {
                    mitem.IsChecked = false;
                });
            }
            else {


                angular.forEach($scope.ApptBranchLocations, function (mitem) {
                    if (mitem.ClinicId === 0) {
                        mitem.IsChecked = false;
                    }
                });

            }

            $scope.LocationTypeObj.SelectLocationString = "Selected";

            var nofalsecount = 0;
            angular.forEach($scope.ApptBranchLocations, function (mitem) {
                if (mitem.IsChecked) {
                    nofalsecount++;
                }
            });
            if (nofalsecount === 0) {
                $scope.LocationTypeObj.SelectLocationString = "Select Location";
            }
        }


        $scope.selectedBranch = obj;
        $scope.AppListselectedclinic = angular.copy(obj);

        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorInfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                $scope.AppListselectedclinic.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }
        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);




   

    };


    $scope.getdoctorsandvisitreasonsdata = function (pagetype) {
        $scope.Visitreasons = [];
        $scope.AscAppointmentsList = [];
        var pagetype = pagetype || "";
        var locationIds = $scope.ApptBranchLocations
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0) // Exclude ClinicId === 0
            .map(pitem => pitem.ClinicId)
            .join(",");
        var usersReqParams = {
            "BranchId": locationIds,
        }
        var visitreasonParams = {
            "OrganizationId": locationIds,
            "VisitTypeId": 0,
            "SearchText": "",
        };

        $q.all([
            eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(visitreasonParams),
            eHnoteMainAppointmentService.getAllUsersByDepartmentIdNew(usersReqParams),
        ]).then(function (resp) {
            console.log(resp);
            resp[0].data.rows = resp[0].data.rows || [];
            resp[1].data.rows = resp[1].data.rows || [];
            $scope.MultiselectDoctorlist = [];
            $scope.selectedDoctors = "Select Doctor";
            $scope.AllDoctorsObj.AllDoctorCheck = false;

            if (resp[0].data.rows.length > 0) {
                if (resp[0].data.rows.length > 0) {
                    $scope.Visitreasons = resp[0].data.rows||[];
                    $scope.Visitreasons = $filter('filter')($scope.Visitreasons, { 'VisitTypeId': 4 }, true);

                    angular.forEach($scope.Visitreasons, function (item) {
                        item.isChecked = true;
                    });
                }
            }

            if (resp[1].data.rows.length > 0) {
                //$scope.getDoctorsbySubSpecializations(resp[1].data.rows, pagetype);
                onGetUsersSuccess(resp[1].data);
            }
        }, function (err) {
            console.log(err);
        });
    }


    $scope.checkAllVisitReasons = function (val) {
        if (val) {
            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = true;
            });

            $scope.selectedVisitReason = 'All Visit Reasons';
        } else {
            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = false;
            });

            $scope.selectedVisitReason = 'Select Visit Reasons';
        }
        var checkedArray = _.where($scope.Visitreasons, { isChecked: true });
        $scope.AllDoctorsObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.Visitreasons.length === checkedArray.length ? true : false;



    };



    $scope.VisitRsnToggle = function (item) {
        var checkedArray = _.where($scope.Visitreasons, { isChecked: true });
        $scope.AllDoctorsObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.Visitreasons.length === checkedArray.length ? true : false;

    };
    $scope.Aduitreportnew = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/Aduitreportnew.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "modal__ninetyfive--",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };

}]);
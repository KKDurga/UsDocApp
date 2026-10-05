"use strict";
eHnoteWebApp.controller("UsAuditAppointmentListCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "eHnoteAuditServices", "Lightbox", "$timeout", "$uibModal", "localStorageFactory", "eHnoteMainAppointmentService", "eHnoteUserDataService", "eHnoteSurgeryService", "$q", "eHnotePatientVisitReasonServices", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, eHnoteAuditServices, Lightbox, $timeout, $uibModal, localStorageFactory, eHnoteMainAppointmentService, eHnoteUserDataService, eHnoteSurgeryService, $q, eHnotePatientVisitReasonServices) {
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

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
    $scope.DoctorID = doctorInfo.doctordata.User[0].DoctorID;

    var BrachesList = [];
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
    if (doctorInfo.doctordata.UserAddress !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
        $scope.HospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParentHospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }

    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    };

    $scope.cacheStorageItem.AppointmentType = 'audit';

    var d = new Date();
   
    $scope.currentPage = 1;
    $scope.itemsperpage = 250;

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
        "FromDate": moment().subtract(7, 'days').format("MM-DD-YYYY") ||null,
        "ToDate": moment().format("MM-DD-YYYY"),
    }
    $scope.mainAscParentObj = {
        "AllBranchesList": [],
        "IsAscBranchAvailable": false
    }
   
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
        "PageSize": $scope.itemsperpage,
        "PageNumber": $scope.currentPage ? $scope.currentPage : 1
    };
    
    $scope.AllDoctorsObj = {
        "AllDoctorCheck": true,
        "AllVisitReasonsCheck": true,
        "AllAppointmentTypeStatusCheck": true,
        "AllAuditstatusCheck": false
    }
    $scope.LocationTypeObj = {
        "SelectLocationString": "All Locations",
        "Name": "",
        "AllLocationCheck": true
    };

    $scope.searchHospital = { "visitRsnName": "", "apptTypename": "" };
    $scope.searchtxtb = { "txt12": "", "txt1": "" };

    $scope.GetStatus = function () {
        return [
            {
                "Id": 0,
                "Name": "Not Audited",
                "isChecked": false
            },
            {
                "Id": 1,
                "Name": "Failed",
                "isChecked": true
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
    $scope.AuditStatusToggle = function (item) {
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
    };
    
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }

    
    $scope.pageChangedEvent = function (pageNo) {
        $scope.currentPage = pageNo;
        $scope.GetAuditAscAppointmentsList();
    };


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
                $scope.selectedAuditlist = eHnoteMasterDataService.getSelectedAscAuditList() || '';
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
                    if ($scope.selectedAuditlist.SelectedDoctorsList.length>0) {
                        angular.forEach($scope.MultiselectDoctorlist, function (item) {
                            item.isChecked = false;
                        });

                        angular.forEach($scope.selectedAuditlist.SelectedDoctorsList, function (sditem) {
                            let tempArray = $filter('filter')($scope.MultiselectDoctorlist, { 'DoctorID': sditem.DoctorID }, true) || [];
                            //    item.isChecked = false;
                            if (tempArray.length > 0) {
                                tempArray[0].isChecked = sditem.isChecked ||true;
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

                $scope.GetAuditAscAppointmentsList();
            }
        } else {
            alertify.error("No Users Found in Selected Departments");
            $scope.mainBookedAppointmentList = [];
        }


    }
    function onGetUsersFailure(data) {
    }
    
    $scope.init = function () {
        $scope.ApptBranchLocations = [];
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
                }

                $scope.AllDoctorsObj.AllVisitReasonsCheck = true;
                $scope.selectedVisitReason = 'All Visit Reasons';

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
                    var data = localStorageFactory.getItem("allBranchesData") || [];
                    initializeNewBranches(data);
                }
            }

        })
        
        

    };
    $scope.init();


    $scope.GetAuditAscAppointmentsList = function (val) {
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

        //let consultationDt = $filter('date')($scope.SearchObj.ConsultationDt, "yyyy-MM-dd");
        
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
        let FromDate = $filter('date')($scope.SearchObj.FromDate, "yyyy-MM-dd");
        let ToDate = $filter('date')($scope.SearchObj.ToDate, "yyyy-MM-dd");



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

        var Locationids = '';
        if ($scope.GetAllIndicatorForFacility == 1 || $scope.AppListselectedclinic.ClinicId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId !== 0; });
            Locationids = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
        } else {
            Locationids = $scope.AppListselectedclinic.ClinicId;
        }

        var selectedAuditList = {
            "SelectedDoctorsList": SelectedDoctorsList || [],
            "FromDate": FromDate ||"",
            "ToDate": ToDate||"",

            "ApptBranchLocations": Locationids || '',
            "Visitreasons": selectedVisitreasons || [],
            "AuditStatusFilterArray": selectedStatusList || [],
        };
        eHnoteMasterDataService.addSelectedAscAuditList(selectedAuditList);

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
            "AddReportStatusId": internallist2 || ""
        }
        eHnotePatientDataService.GetAuditAscAppointmentsList(params, OnGetSurgeriesListSuccess1, OnGetSurgeriesListError1);
        function OnGetSurgeriesListSuccess1(data) {
            if (data.status == "Success") {
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

                        item.IntraOpNurseChartStatus = item.IntraOpNurseChartStatus || '';
                        item.IntraOpAnesthesiaChartStatus = item.IntraOpAnesthesiaChartStatus || '';
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
        getDoctorsbySubSpecializations(item.ClinicId)

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
    $scope.AddPatietnDetailsLog = function (PatientId) {

        let obj = {
            "UserHistoryId": 0,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": PatientId || 0,

        };
        eHnoteMainAppointmentService.AddPatientDetailsLog(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                console.log("Added");
            }
        });
    }
    $scope.navtoPreOpAscCharting = function (item) {
        //let pitem = {
        //    "PatientDetails": {}
        //};
        //pitem.PatientDetails.PatientID = item.PatientID;
        if (!$scope.cacheStorageItem) {
            $scope.cacheStorageItem = {};
        }
        $scope.cacheStorageItem.PatientID = item.PatientID || 0;
        $scope.cacheStorageItem.AppointmentId = item.AppointmentID || 0;
        $scope.cacheStorageItem.AppointmentTypeId = item.AppointmentTypeId || 0;
        $scope.cacheStorageItem.SurgeryList = item.SurgeryList || [];
        $scope.cacheStorageItem.PatientVisitId = item.Visitid || 0;
        $scope.cacheStorageItem.IsfromScreen = 'AscAudit';
        $scope.cacheStorageItem.selectedApptObj = angular.copy(item);
        $scope.AddToCache();
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        let screen = 'ASC'
        var obj = {
            "Screen": screen,
        };
        eHnoteMasterDataService.addSelectedCrmApptDates(obj);
        appointmentinfo.PatientID = item.PatientID || 0;
        appointmentinfo.AppointmentTypeId = item.AppointmentTypeId || 0;
        eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
        $scope.AddPatietnDetailsLog(item.PatientID);
        //eHnoteMasterDataService.addPatientDetailsforBarcode(pitem);
        $location.url("/profile");
        
       

    }

    $scope.navtoAscTodayDate = function () {
        var refDate = moment(new Date(), 'MM-DD-YYYY').format('YYYY-MM-DD');// Format to ISO 8601
        $scope.SearchObj.ConsultationDt = refDate;
        $scope.GetAuditAscAppointmentsList();
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
    //        $scope.SearchObj.FromDate = formattedFromDate ; 
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

    $scope.ASCAuditLogArray = [];
    $scope.SelectedAppointmentLogData = function (item) {
        $scope.ASCAuditLogArray = item.AuditLogArray || [];
    }
    $scope.newclearPatientApptSearch = function () {
        $scope.SearchObj.searchPatientTxt = "";
        $scope.SearchObj.searchPatientOldMR = "";
        $scope.SearchObj.searchPatientIdTxt = "";

        $scope.AscAppointmentsList = angular.copy($scope.MainAscAppointmentsList);
    };
   
}]);


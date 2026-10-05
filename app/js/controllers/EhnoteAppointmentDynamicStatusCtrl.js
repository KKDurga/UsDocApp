"use strict";
eHnoteWebApp.controller("EhnoteAppointmentDynamicStatusCtrl", ["$scope", "$log", "$rootScope", "$location", "$uibModal", "$filter", "$timeout", "eHnoteMainAppointmentService", "eHnoteMasterDataService", "eHnoteValidateUsersDataService", "eHnoteLoginStatusService", "datacookieFactory", "$window", "eHnoteCacheStorageService", "datapersistanceFactory", "eHnotePatientDataService", "eHnoteUserAppointmentDataService", "alertify", "uiCalendarConfig", "eHnotePatientPVService", "eHnotePatientVisitReasonServices", "eHnoteDiagnosisDataServices", "DeCodeFilter", "$q", "$interval", "localStorageFactory", "eHnoteProcedureDataService", "SyncService", "eHnoteSettingsDataService", "eHnoteMainAdminServices", function ($scope, $log, $rootScope, $location, $uibModal, $filter, $timeout, eHnoteMainAppointmentService, eHnoteMasterDataService, eHnoteValidateUsersDataService, eHnoteLoginStatusService, datacookieFactory, $window, eHnoteCacheStorageService, datapersistanceFactory, eHnotePatientDataService, eHnoteUserAppointmentDataService, alertify, uiCalendarConfig, eHnotePatientPVService, eHnotePatientVisitReasonServices, eHnoteDiagnosisDataServices, DeCodeFilter, $q, $interval, localStorageFactory, eHnoteProcedureDataService, SyncService, eHnoteSettingsDataService, eHnoteMainAdminServices) {

    $scope.AppointmentsHistoryList = [];
    $scope.AppointmentsHistoryListCount = 0;
    $scope.RoleDetails = [];
    $scope.Search = {
        "AppListselectedclinic": null,
        "referredappointmentdate": $filter('date')(new Date(), "dd-MMM-yyyy"),
        "patSearchType": 1,
        "searchPatientIdTxt": null,
        "searchOldPatientMRNO": null,
        "searchPatientTxt": null
    };

    $scope.exportMaxSize = 10000;
    var doctorInfo = eHnoteMasterDataService.getUserInfo();


    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    console.log($scope.UserAccessRights);
    $scope.hospid = "";

    if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.hospitalcd = "";
        $scope.hospid = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.parenthospId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

    }
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    var clinicAddress = [], object = null;
    $scope.Pagination = { "currentPagePatient": 1, "Patientitemsperpage": 20, "Patientmaxsize": 10 };
    

    $scope.loadDoctor = function (val) {
        $scope.Search.AppListselectedclinic = val;

        if ($scope.Search.AppListselectedclinic.BranchId === 0) {
            if (doctorInfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                $scope.Search.AppListselectedclinic.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }

        GetBranchSubSpecializations($scope.Search.AppListselectedclinic.SubOrganizationId, $scope.Search.AppListselectedclinic.BranchId);
    }

    $scope.initialiseClinicDoctor = function () {
        //$scope.AppListdoctoraddress = [];

        $scope.AppListdoctoraddress = clinicAddress || [];


        var RoleID = $scope.userLoginDetails.RoleID;
        if (RoleID !== 1) {
            $scope.clinicDoctorList = [];
            //$scope.AppListdoctoraddress = clinicAddress;
            $scope.defaultbranch = $filter("filter")(clinicAddress, function (item) { return item.ClinicId === doctorInfo.doctordata.UserAddress[0].ClinicId; });
            $scope.Search.AppListselectedclinic = $scope.defaultbranch[0];


            angular.forEach($scope.defaultbranch, function (iterator, ind) {
                iterator.Doctors = iterator.Doctors || [];
                $scope.clinicDoctorList = $scope.clinicDoctorList.concat(iterator.Doctors);
            });



            $scope.clinicOptometristsList = $filter("filter")($scope.clinicDoctorList, function (item) { return item.RoleId === 10; });
            $scope.clinicOptometristsList = _.uniq($scope.clinicOptometristsList, false, function (p) { return p.DoctorID; });


            $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16;
            });
            var docAll = { "DoctorID": 0, "FullName": 'All Doctors', "AddressID": 0, "MinPerCase": 15 };
            $scope.clinicDoctorList.unshift(docAll);
            var opthoall = { "DoctorID": 0, "FullName": 'All Optometrists', "AddressID": 0, "MinPerCase": 15 };
            $scope.clinicOptometristsList.unshift(opthoall);



            var DocArray = $filter("filter")($scope.clinicDoctorList, function (item) { return item.DoctorID === eHnoteMasterDataService.getLoginId(); }) || [];
            $scope.selectedDoctor = DocArray.length > 0 ? DocArray[0] : $scope.clinicDoctorList[0];
        }

        if (RoleID === 2 || RoleID === 10 || RoleID === 11) {
            var allcount = 0;
            for (var i = 0; i < $scope.clinicDoctorList.length; i++) {
                if ($scope.clinicDoctorList[i].FullName === "All Doctors") {
                    allcount++;
                    if (allcount > 1) {
                        $scope.clinicDoctorList.splice(i, 1);
                    }
                }
            }

            var AppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (item, index) { return item.ClinicName !== "All Locations" && item.ExtDetails.HospitalID === $scope.hospid; }) || [];

            if (AppListdoctoraddress.length > 0) {
                $scope.Search.AppListselectedclinic = AppListdoctoraddress[0];
                $scope.loadDoctor(AppListdoctoraddress[0], true, 'list');

            }
        }
        var currentClinic = doctorInfo.doctordata.UserAddress[0];
        if ($scope.AppListdoctoraddress.length > 0) {
            angular.forEach($scope.AppListdoctoraddress, function (value, key) {
                if (currentClinic.ExtDetails !== undefined && currentClinic.ExtDetails.HospitalID !== undefined && value.ExtDetails !== undefined && value.ExtDetails.HospitalID !== undefined && currentClinic.ExtDetails.HospitalID === value.ExtDetails.HospitalID) {
                    if ($scope.clinicDoctorList.length > 0) {
                        $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });

                    } else {
                        $scope.Search.AppListselectedclinic = value;
                    }
                }
            });
        }

        if (RoleID === 1) {
            loadAppointmentforDoc($scope.selectedDoctor);
        } else {
            $scope.loadAppointments($scope.selectedDoctor);
        }

    };

    //$scope.toggleSubSpecialization = function (item) {
    //    var checkedArray = _.where($scope.allSubSpecializationsArray, { isChecked: true });
    //    $scope.AllSubSpecializationsCheck = checkedArray.length > 0 && $scope.allSubSpecializationsArray.length === checkedArray.length ? true : false;

    //    $scope.getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);
    //};

    //$scope.checkAllSubSpecializations = function (val) {
    //    if (val) {
    //        angular.forEach($scope.allSubSpecializationsArray, function (item) {
    //            item.isChecked = true;
    //        });
    //        $scope.selectedDepartmentName = 'All Departments';
    //    } else {
    //        angular.forEach($scope.allSubSpecializationsArray, function (item) {
    //            item.isChecked = false;
    //        });
    //        $scope.selectedDepartmentName = 'Select Department';
    //    }

    //    $scope.getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);
    //};


    //$scope.getDoctorsbySubSpecializations = function (branchId) {


    //    var branchesList = [];
    //    $scope.clinicDoctorList = [];
    //    $scope.allUserList = [];
    //    $scope.selectedDoctor = "";
    //    if (branchId === 0) {
    //        var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
    //        var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

    //        angular.forEach(TempAppListdoctoraddress, function (items) {
    //            branchesList.push(items.BranchId);
    //        });
    //    } else {


    //        var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId === branchId; });
    //        var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
    //        angular.forEach(TempAppListdoctoraddress, function (items) {
    //            branchesList.push(items.BranchId);
    //        });
    //    }




    //    var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
    //    var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

    //    var reqObj = {
    //        "BranchId": hospitalID,
    //        "SubSpecializationIdArray": subSplArray
    //    }


    //    eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
    //    function onGetUsersSuccess(resp) {

    //        if (resp.rows.length > 0) {
    //            $scope.allUserList = resp.rows;
    //            var RoleID = $scope.userLoginDetails.RoleID;

    //            $scope.clinicDoctorList = $scope.allUserList;



    //            $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
    //                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
    //            });
    //            var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
    //            $scope.clinicDoctorList.unshift(docAll);





    //            var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
    //            if (Index > -1) {
    //                $scope.selectedDoctor = $scope.clinicDoctorList[Index];
    //            } else {
    //                $scope.selectedDoctor = $scope.clinicDoctorList[0];
    //            }


    //            if (RoleID === 1 || RoleID === 56) {

    //                $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
    //                    return item.RoleId === 1 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
    //                });
    //            }



    //            if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {

    //                Index = $scope.clinicDoctorList.findIndex(record => record.FullName === "All Doctors");
    //                if (Index > -1) {
    //                    $scope.clinicDoctorList.splice(Index, 1);
    //                }



    //            }



    //            if (RoleID === 1) {
    //                loadAppointmentforDoc($scope.selectedDoctor);
    //            } else {
    //                $scope.loadAppointments($scope.selectedDoctor);
    //            }

    //        } else {
    //            alertify.error("No Users Found in Selected Departments");
    //        }


    //    }

    //    function onGetUsersFailure(data) {
    //    }
    //}

    //$scope.init = function () {
    //    //var BranchList = localStorageFactory.getItem("allHospitalsDoctorsData") || [];
    //    //InitializeAppointments(BranchList);

    //    var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
    //    InitializeBranches(NewBranchList);
    //};
    //$scope.init();


    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }


    function InitializeAppointments(data) {


        clinicAddress = eHnoteUserAppointmentDataService.RestructureBranches($scope.OpAccess.showAllHospitalsinAppList, data, doctorInfo) || [];

        if (!$scope.OpAccess.showAllHospitalsinAppList) {


            $scope.clinicDoctorList = [];
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
            $scope.clinicDoctorList.push(clinicObj);
            $scope.selectedDoctor = $scope.clinicDoctorList[0];
            $scope.AppListdoctoraddress = clinicAddress;
            $scope.Search.AppListselectedclinic = $scope.AppListdoctoraddress[0];
        }
        

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
        clinicAddress.unshift(EmptyClinicObj);

        $scope.initialiseClinicDoctor();
    }

    function InitializeBranches(data) {



        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.PatientDynamicAllHospitalAppointments, data, doctorInfo) || [];



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
        clinicAddress.unshift(EmptyClinicObj);

        $scope.BranchesListArray = clinicAddress;


        $scope.AppListdoctoraddress = clinicAddress;
        $scope.Search.AppListselectedclinic = $scope.AppListdoctoraddress[0];


        var RoleID = $scope.userLoginDetails.RoleID;

        //if (RoleID !== 1 && RoleID !== 56) {

        //    $scope.clinicDoctorList = [];
        //    $scope.AppListdoctoraddress = clinicAddress;

        //    $scope.defaultbranch = $filter("filter")($scope.BranchesListArray, function (item) {
        //        return item.BranchId === doctorInfo.doctordata.UserAddress[0].ClinicId;
        //    });

        //    $scope.selectedBranch = $scope.defaultbranch[0];
        //    $scope.AppListselectedclinic = $scope.defaultbranch[0];
        //}

        $scope.clinicDoctorList = [];

        $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) {
            return item.BranchId === doctorInfo.doctordata.UserAddress[0].ClinicId;
        });

        $scope.selectedBranch = $scope.defaultbranch[0];
        //  $scope.AppListselectedclinic = $scope.defaultbranch[0];
        $scope.Search.AppListselectedclinic = $scope.defaultbranch[0];

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
        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorInfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                $scope.AppListselectedclinic.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);

    }
    function GetBranchSubSpecializations(SubOrganizationId, BranchId) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });

                // $scope.getDoctorsbySubSpecializations(BranchId);
                $scope.getdoctorlist();
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }


        });
    };


    function loadAppointmentforDoc(selectedDr) {
        $scope.selectedDoctor = selectedDr;
        var docid = $scope.selectedDoctor.DoctorID;

        var UserBranchId = 0;
        if (selectedDr && selectedDr.DoctorID !== null) {
            $scope.selectedDoctor = selectedDr;

        }
        var consultdate = $filter('date')(new Date($scope.Search.referredappointmentdate), "yyyy-MM-dd");

        var hospitalID = "";
        if ($scope.Search.AppListselectedclinic !== undefined && $scope.Search.AppListselectedclinic.ClinicName !== "All Locations") {
            hospitalID = $scope.Search.AppListselectedclinic.ExtDetails.HospitalID;

            if ($scope.selectedDoctor !== undefined && $scope.selectedDoctor.UserBranchId !== undefined) {
                UserBranchId = $scope.selectedDoctor.UserBranchId;
                //$scope.GetAllIndicator = 0;
            }

        } else {

            //hospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            //$scope.GetAllIndicator = 1;


            //Get all Hospital Ids
            var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId !== 0; });
            hospitalID = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");

        }

        var subList = [];
        angular.forEach($scope.allSubSpecializationsArray, function (mitems) {
            if (mitems.isChecked) {
                subList.push(mitems.SubSpecializationId);
            }
        });
        if (UserBranchId === 0) {
            var params = {
                "UserBranchId": UserBranchId,
                "HospitalID": hospitalID,
                "DoctorID": docid,
                "ConsultationDt": consultdate,
                "ShowDueAmount": "Y",
                //"GetAllIndicator": $scope.GetAllIndicator,
                "PageSize": $scope.Pagination.Patientitemsperpage,
                "PageNumber": $scope.Pagination.currentPagePatient,
                "SearchText": $scope.Search.searchPatientTxt ? $scope.Search.searchPatientTxt : null,
                "SearchPatientId": $scope.Search.searchPatientIdTxt ? $scope.Search.searchPatientIdTxt : null,
                "OldPatientMRNO": $scope.Search.searchOldPatientMRNO ? $scope.Search.searchOldPatientMRNO : null,
                "RoleId": $scope.userLoginDetails.RoleID,
                "SubSpecializationIds": subList
            };
            params.SubSpecializationIds = params.SubSpecializationIds ? JSON.stringify(params.SubSpecializationIds) : "";
            eHnoteMainAppointmentService.GetListofAppointmentsHistory(params, OnGetListofAppointmentSuccess, OnGetListofAppointmentError);
        } else {
            $scope.referredshowloading = true;
            var param = {
                "UserBranchId": (UserBranchId || $scope.Search.AppListselectedclinic.UserBranchId),
                "DoctorID": docid,
                "ConsultationDt": consultdate,
                "ShowDueAmount": "Y",
                //"GetAllIndicator": $scope.GetAllIndicator,
                "HospitalID": hospitalID,
                "PageSize": $scope.Pagination.Patientitemsperpage,
                "PageNumber": $scope.Pagination.currentPagePatient,
                "SearchText": $scope.Search.searchPatientTxt ? $scope.Search.searchPatientTxt : null,
                "SearchPatientId": $scope.Search.searchPatientIdTxt ? $scope.Search.searchPatientIdTxt : null,
                "OldPatientMRNO": $scope.Search.searchOldPatientMRNO ? $scope.Search.searchOldPatientMRNO : null,
                "RoleId": $scope.userLoginDetails.RoleID,
                "SubSpecializationIds": subList
            };
            param.SubSpecializationIds = param.SubSpecializationIds ? JSON.stringify(param.SubSpecializationIds) : "";
            eHnoteMainAppointmentService.GetListofAppointmentsHistory(param, OnGetListofAppointmentSuccess, OnGetListofAppointmentError);
        }
    }
    $scope.searchPatientAppointmentList = function (txt, type) {



        txt = txt || "";
        if (type === 2) {//MR number search
            if (txt === "") {
                $scope.Search.searchPatientTxt = null;
                $scope.Search.searchPatientIdTxt = null;
                $scope.Search.searchOldPatientMRNO = null;
                $scope.loadAppointments($scope.selectedDoctor);
            } else {
                if ((txt.length > 9 && isNaN(txt)) || (txt.length > 3 && !isNaN(txt))) {
                    $scope.Search.searchPatientIdTxt = txt;
                    $scope.Search.searchOldPatientMRNO = null;
                    $scope.Search.searchPatientTxt = null;
                    $scope.loadAppointments($scope.selectedDoctor);
                }
            }

        }
        else if (type === 3) {//old MR number search
            if (txt === "") {
                $scope.Search.searchPatientTxt = null;
                $scope.Search.searchPatientIdTxt = null;
                $scope.Search.searchOldPatientMRNO = null;
                $scope.loadAppointments($scope.selectedDoctor);
            } else {
                if ((txt.length > 9 && isNaN(txt)) || (txt.length > 3 && !isNaN(txt))) {
                    $scope.Search.searchPatientIdTxt = null;
                    $scope.Search.searchOldPatientMRNO = txt;
                    $scope.Search.searchPatientTxt = null;
                    $scope.loadAppointments($scope.selectedDoctor);
                }
            }

        }
        else {//Name Search
            if (txt.length > 2) {
                $scope.Search.searchPatientTxt = txt;
                $scope.Search.searchPatientIdTxt = null;
                $scope.Search.searchOldPatientMRNO = null;
                $scope.loadAppointments($scope.selectedDoctor);
            } else {
                if (txt === "") {
                    $scope.Search.searchPatientTxt = null;
                    $scope.Search.searchPatientIdTxt = null;
                    $scope.Search.searchOldPatientMRNO = null;
                    $scope.loadAppointments($scope.selectedDoctor);
                }
            }
        }
    };
    $scope.ChangePatientSearchType = function () {
        $scope.Search.searchPatientTxt = null;
        $scope.Search.searchPatientIdTxt = null;
        $scope.Search.searchOldPatientMRNO = null;
    };
    $scope.changePatientPage = function () {
        $scope.loadAppointments($scope.selectedDoctor);
    };
    function OnGetListofAppointmentSuccess(resp) {
        $scope.AppointmentsHistoryList = resp.AppointmentList || [];
        $scope.AppointmentsHistoryListCount = resp.count;
        $scope.RoleDetails = resp.RoleDetails || [];
    }
    function OnGetListofAppointmentError(error) {
        alertify.error("Getting Failed");
        $scope.AppointmentsHistoryList = [];
        $scope.RoleDetails = [];
        $scope.AppointmentsHistoryListCount = 0;
    }



    $scope.RollBackCheckedInStatus = function (hist, i) {
        object = {
            "AppointmentId": i.AppointmentId,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentHistoryId": hist.Id
        };
        eHnotePatientDataService.RollBackDynamicAppointmentCheckedInStatus(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                alertify.success("Rollbakced Successfully");
                hist.CheckInTime = null;
                hist.CheckOutTime = null;
            }
        });
    };

    $scope.AllSubSpecializationsCheck = true;


    //$scope.exportTable = function (jsonData, typeValue) {
    //    var reports_exportData = [];


    //    angular.forEach(jsonData, function (itemExports) {
    //        reports_exportData.push({

    //            'Patient Name': itemExports.Source,



    //        });
    //    });
    //    jsonData = reports_exportData;



    //    var col = [];
    //    for (var i = 0; i < jsonData.length; i++) {
    //        for (var key in jsonData[i]) {
    //            if (col.indexOf(key) === -1) {
    //                col.push(key);
    //            }
    //        }
    //    }

    //    var table = document.createElement("table");
    //    table.style = "border: 1px solid #000;";
    //    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    //    var tr = table.insertRow(-1);               // TABLE ROW.
    //    for (var i = 0; i < col.length; i++) {
    //        var th = document.createElement("th");      // TABLE HEADER.
    //        th.innerHTML = col[i];
    //        tr.appendChild(th);
    //        tr.style = "background:#1e977c;color:#fff;width:100px";
    //    }
    //    // ADD JSON DATA TO THE TABLE AS ROWS.
    //    for (var i = 0; i < jsonData.length; i++) {
    //        tr = table.insertRow(-1);
    //        tr.style = "border: 1px solid #000;";
    //        for (var j = 0; j < col.length; j++) {
    //            var tabCell = tr.insertCell(-1);
    //            tabCell.innerHTML = jsonData[i][col[j]];
    //        }
    //    }
    //    download(table);
    //};
    //function download(table) {
    //    tableToExcel(table, 'Sheet 1', 'dataDownload.xls');
    //}
    //var tableToExcel = (function () {
    //    var uri = 'data:application/vnd.ms-excel;base64,',
    //        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
    //        base64 = function (s) {
    //            return window.btoa(unescape(encodeURIComponent(s)));
    //        }, format = function (s, c) {
    //            return s.replace(/{(\w+)}/g, function (m, p) {
    //                return c[p];
    //            });
    //        };
    //    return function (table, name, filename) {
    //        if (!table.nodeType) table = document.getElementById(table);
    //        var ctx = {
    //            "worksheet": name || 'Worksheet',
    //            "table": table.innerHTML
    //        };
    //        var link = document.createElement("a");
    //        link.href = uri + base64(format(template, ctx));
    //        //set the visibility hidden so it will not effect on your web-layout
    //        link.style = "visibility:hidden";
    //        link.download = "dataDownload.xls";
    //        //this part will append the anchor tag and remove it after automatic click
    //        document.body.appendChild(link);
    //        link.click();
    //        document.body.removeChild(link);
    //    };
    //})();




    //------------------------------------------------------------------------------------------------------------------------------------------------ UI Grid


    //$scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    //if ($scope.userLoginDetails.RoleID === 4 || $scope.userLoginDetails.RoleID === 43 || $scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 56 || $scope.userLoginDetails.RoleID === 57) {
    //    if (object.AppointmentStatus === "B" || object.AppointmentStatus === "O") {
    //        if (object.IsTeleMedicineSlot) {
    //            object.startConsultationEntryAccess = false;
    //        } else {
    //            if ($scope.OrganizationSettingsData.ConsultationSettings !== undefined) {
    //                if ($scope.OrganizationSettingsData.ConsultationSettings.IsConsultationRestricted === 1) {
    //                    object.startConsultationEntryAccess = false;
    //                } else {
    //                    object.startConsultationEntryAccess = true;
    //                }
    //            }
    //        }

    //    }
    //}



    $scope.SendToPatientRoomType = function (item) {
        $scope.patientData = item;
        $scope.patientData.PatientID = item.PatientId;

        $scope.Parent.EditPatientComingFrom = "PatientDynamicAppointmentList";
        $scope.Parent.EditPatientPopUp = $uibModal.open({
            "templateUrl": 'editpatientDirectivePopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg",
            "windowClass": "inventory-full-popup"
        });
    };
    $scope.$on("ReloadPatientDynamicAppointmentList", function (event, data) {
        $scope.Patientlistdata = data;
        if (data.PatientDetails !== undefined) {
            $scope.Patientlistdata.PatientDisplayId = data.PatientDetails.PatientDisplayId;
            $scope.Patientlistdata.Title = data.PatientDetails.Title;
            $scope.Patientlistdata.fullName = data.PatientDetails.FullName;
            $scope.Patientlistdata.AgeInDays = data.PatientDetails.AgeInDays;
            $scope.Patientlistdata.AgeInMonths = data.PatientDetails.AgeInMonths;
            $scope.Patientlistdata.AgeInYears = data.PatientDetails.AgeInYears;
            $scope.Patientlistdata.Gender = data.PatientDetails.Gender;

        }
        $scope.Patientlistdata.OptometristId = $scope.patientData.OptometristId || null;
        $scope.Patientlistdata.ARassistantId = $scope.patientData.ARassistantId || null;
        $scope.Patientlistdata.AppointmentDoctorId = $scope.patientData.AppointmentDoctorId || null;
        $scope.RoomTypeList = [];
        eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
            //  $scope.RoomTypeList = resp.data;
            if ($scope.Patientlistdata.AppointmentTypeId !== 10) {
                $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 5 && item.Id !== 6 });
            } else {
                $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 6 });
                // $scope.RoomTypeList = resp.data;                        
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "ViewAvaliableSlots.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "md",
            //   "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteSettingsDataService) {        


            // }
        });
    });



    $scope.AddToWaitingRoom = function () {
        if ($scope.RoomSearchObj.RoomTypeId === 0) {
            alertify.error("Select Room Type");
            return false;
        }
        if ($scope.RoomSearchObj.RoomTypeId !== 7) {
            if ($scope.RoomSearchObj.RoomId === 0) {
                alertify.error("Select Room Type");
                return false;
            }
        }
        if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicRoomAllocation) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }


        if ($scope.RoomSearchObj.RoomTypeId === 1) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoDoctor) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 4) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoCounselor) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 3) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoDilation) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 7) {
            if (!$scope.UserAccessRights.AllAccessRights.OPCheckOutAccess) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 2) {

            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoOptom) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }

            if ($scope.RoomSearchObj.OptomId === null) {
                alertify.error("Select Optometrist");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 8) {
            if ($scope.RoomSearchObj.ARId === null) {
                alertify.error("Select AR");
                return false;
            }
        }

        if ($scope.RoomSearchObj.RoomTypeId === 5) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoTechnician) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.RoomSearchObj.TechnicianId === null) {
                alertify.error("Select Technician");
                return false;
            }
        }
        //if ($scope.RoomSearchObj.RoomCapacity !== 0) {
        //    if ($scope.RoomSearchObj.RoomAvailability === $scope.RoomSearchObj.RoomCapacity) {
        //        alertify.error("Room Capacity is overload");
        //        return false;
        //    }
        //}

        if ($scope.RoomSearchObj.RoomCapacity !== 0) {
            if ($scope.RoomSearchObj.RoomAvailability === $scope.RoomSearchObj.RoomCapacity) {
                alertify.error("Patient limit for this room has been exceeded! Please select other Room");
                return false;
            }
        }
        $scope.Time = $filter("date")(new Date(), "HH:mm");
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": $scope.Patientlistdata.PatientID,
            "AppointmentId": $scope.Patientlistdata.AppointmentId,
            "RoomId": $scope.RoomSearchObj.RoomId,
            "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
            "NextCounterId": $scope.RoomSearchObj.RoomTypeId,
            "PreviousCounterId": null,
            "StartTime": $scope.Time,
            "PatientDynamicStatusId": 0,
            "Status": "Waiting",
            "DoctorId": null,
            "TechnicianId": $scope.RoomSearchObj.TechnicianId,
            "OptomId": $scope.RoomSearchObj.OptomId,
            "ARId": $scope.RoomSearchObj.ARId,
            "DilationAssistantId": $scope.RoomSearchObj.DilationAssistantId,
            "CounsellorId": $scope.RoomSearchObj.CounsellorId,
            "IsCheckedOut": false,
            "RoleId": $scope.userLoginDetails.RoleID
        }
        if (params.RoomTypeId === 7) {
            params.RoomId = null;
            params.IsCheckedOut = true;
            params.Status = 'Completed';
        }

        eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {
            if (resp.data.Status === "Success") {
                alertify.success('Added Successfully');

                 
                $scope.mInstanceAdd.dismiss("cancel");
                $scope.GetAppointmentslist();
                $scope.GetPatientDynamicStatusCount();
                $scope.PatientDoctorActiveRoomList();
                $scope.CheckedOutPatientsList();
                $scope.PatientDoctorWaitingRoomList();


                $scope.RoomSearchObj = {
                    "RoomTypeId": 0,
                    "RoomAvailability": 0,
                    "RoomCapacity": 0,
                    "RoomId": 0,
                    "RoomTypeobj": "",
                    "Roomobj": "",
                    "Opthamobj": "",
                    "ARobj": "",
                    "OptomId": null,
                    "ARId": null,
                    "Technicianobj": "",
                    "TechnicianId": null,
                    "Counsellorobj": "",
                    "CounsellorId": null,
                    "DilationAssistantobj": "",
                    "DilationAssistantId": null,
                    "Doctorobj": "",
                    "DoctorId": null,
                    "NewApptStartTime": ""
                };
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };



    $scope.closeAvaliableSlots = function () {
        $scope.RoomSearchObj = {
            "RoomTypeId": 0,
            "RoomAvailability": 0,
            "RoomCapacity": 0,
            "RoomId": 0,
            "RoomTypeobj": "",
            "Roomobj": "",
            "Opthamobj": "",
            "ARobj": "",
            "OptomId": null,
            "ARId": null,
            "Technicianobj": "",
            "TechnicianId": null,
            "Counsellorobj": "",
            "CounsellorId": null,
            "DilationAssistantobj": "",
            "DilationAssistantId": null,
            "Doctorobj": "",
            "DoctorId": null,
            "NewApptStartTime": ""
        };

        $scope.mInstanceAdd.dismiss("cancel");
    };

    $scope.ChangesRoomType = function (item) {
        $scope.Patientlistdata.OptometristId = $scope.Patientlistdata.OptometristId || null;
        $scope.RoomSearchObj.RoomTypeId = item.Id;
        if ($scope.RoomSearchObj.RoomTypeId === 1) {
            if ($scope.Patientlistdata.AppointmentDoctorId !== null) {
                $scope.RoomSearchObj.Doctorobj = _.where($scope.AllDoctorList, { "DoctorID": $scope.Patientlistdata.AppointmentDoctorId })[0];
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 2) {
            if ($scope.Patientlistdata.OptometristId !== null) {
                $scope.RoomSearchObj.Opthamobj = _.where($scope.AllOpthaList, { "DoctorID": $scope.Patientlistdata.OptometristId })[0];
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 8) {
            if ($scope.Patientlistdata.ARassistantId !== null) {
                $scope.RoomSearchObj.ARobj = _.where($scope.AllARList, { "DoctorID": $scope.Patientlistdata.ARassistantId })[0];
            }
        }

        var params = {
            "HospitalId": $scope.Patientlistdata.HospitalId,
            "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
            "SearchText": "",
            "PageNumber": 1,
            "PageSize": 100
        }
        eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
            if (data.Status === "Success") {
                $scope.RoomListarray = data.rows || [];
            } else {
                $scope.RoomListarray = [];
            }


        }).error(function (error) {

        });
    };

    $scope.ChangesRoom = function (item) {
        //$scope.RoomSearchObj.RoomId = item.RoomId || 0;
        item = item || null;
        if (item !== null) {
            $scope.RoomSearchObj.RoomId = item.RoomId || 0;
        } else {
            $scope.RoomSearchObj.RoomId = 0;
        }
    };

    $scope.ChangesDilation = function (item) {
        $scope.RoomSearchObj.DilationAssistantId = item.DoctorID || 0;
        $scope.RoomSearchObj.OptomId = null;
        $scope.RoomSearchObj.CounsellorId = null;
        $scope.RoomSearchObj.TechnicianId = null;
        $scope.RoomSearchObj.ARId = null;
    };
    $scope.ChangesOptham = function (item) {
        $scope.RoomSearchObj.OptomId = item.DoctorID;
        $scope.RoomSearchObj.CounsellorId = null;
        $scope.RoomSearchObj.TechnicianId = null;
        $scope.RoomSearchObj.DilationAssistantId = null;
        $scope.RoomSearchObj.ARId = null;
    };
    $scope.ChangesAR = function (item) {
        $scope.RoomSearchObj.ARId = item.DoctorID;
        $scope.RoomSearchObj.OptomId = null;
        $scope.RoomSearchObj.CounsellorId = null;
        $scope.RoomSearchObj.TechnicianId = null;
        $scope.RoomSearchObj.DilationAssistantId = null;
    };
    $scope.ChangesCounsellor = function (item) {
        $scope.RoomSearchObj.CounsellorId = item.DoctorID;
        $scope.RoomSearchObj.OptomId = null;
        $scope.RoomSearchObj.TechnicianId = null;
        $scope.RoomSearchObj.DilationAssistantId = null;
        $scope.RoomSearchObj.ARId = null;
    };
    $scope.ChangesTechnician = function (item) {
        $scope.RoomSearchObj.TechnicianId = item.DoctorID;
        $scope.RoomSearchObj.OptomId = null;
        $scope.RoomSearchObj.CounsellorId = null;
        $scope.RoomSearchObj.DilationAssistantId = null;
        $scope.RoomSearchObj.ARId = null;
    };



    $scope.ToDate = $filter("date")(new Date(), "dd-MM-yyyy");
    $scope.time = $filter("date")(new Date(), "HH:mm");
    $scope.startConsultationEntryAccess = false;

    $scope.obj = {
        "HospitalId": "",
        "Date": $scope.ToDate,
        "DoctorID": 0,
        "HospitalObj": "",

    };
    $scope.RoomSearchObj = {
        "RoomTypeId": 0,
        "RoomAvailability": 0,
        "RoomCapacity": 0,
        "RoomId": 0,
        "RoomTypeobj": "",
        "Roomobj": "",
        "Opthamobj": "",
        "ARobj": "",
        "OptomId": null,
        "ARId": null,
        "Technicianobj": "",
        "TechnicianId": null,
        "Counsellorobj": "",
        "CounsellorId": null,
        "DilationAssistantobj": "",
        "DilationAssistantId": null,
        "Doctorobj": "",
        "DoctorId": null,
        "NewApptStartTime": ""
    };
    $scope.selectedDepartmentName = 'All Departments';
    $scope.searchHospital = {
        "txt1": "",
        "txt2": ""
    };
    $scope.selectedSpecialization = {
        "SpecializationName": "All Specialities",
        "SpecializationId": 0
    };
    $scope.PatientListarray = [];

    function InitializeNewBranches1(data) {
        $scope.AllUserBranchesList1 = [];
        var branchesList = [];
        if (data.length !== 0) {
            var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.PatientDynamicAllHospitalAppointments, data, $scope.doctorinfo) || [];
            $scope.AllUserBranchesList1 = BrachesList;
            $scope.BranchesListArray = BrachesList;
            $scope.selectedBranch = $scope.BranchesListArray[0];

            $scope.clinicDoctorList = [];

            $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList1, function (item) {
                return item.BranchId === $scope.doctorinfo.doctordata.UserAddress[0].ClinicId;
            });

            $scope.selectedBranch = $scope.defaultbranch[0];
            $scope.obj.HospitalObj = $scope.defaultbranch[0];
            $scope.obj.HospitalId = $scope.defaultbranch[0].BranchId;

            getBranchSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);

            GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);
        }
    }

    $scope.OrgSpecialitiesArray = [];
    function getBranchSpecializations(SubOrganizationId, BranchId) {
        $scope.OrgSpecialitiesArray = [];
        if (BranchId === 0) {
            eHnoteMainAdminServices.getAllBranchSpecialitiesById(SubOrganizationId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                }
            });
        } else {
            eHnoteMainAdminServices.getBranchSpecialitiesById(BranchId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                }

            });
        }
        console.log($scope.OrgSpecialitiesArray);
    }

    function GetBranchSubSpecializations(SubOrganizationId, BranchId) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                $scope.subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");
                console.log($scope.allSubSpecializationsArray);
                $scope.getdoctorlist();
                $scope.GetAppointmentslist();
                // $scope.getDoctorsbySubSpecializations(BranchId);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }


        });
    };
    function OnGetDoctorSuccess1(data) {
        InitializeNewBranches1(data);
    }

    $scope.DynamiccheckAllSubSpecializations = function (val) {
        if (val) {
            angular.forEach($scope.allSubSpecializationsArray, function (item) {
                item.isChecked = true;
            });
            $scope.selectedDepartmentName = 'All Departments';
        } else {
            angular.forEach($scope.allSubSpecializationsArray, function (item) {
                item.isChecked = false;
            });
            $scope.selectedDepartmentName = 'Select Department';
        }

        //$scope.getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);
        //$scope.getdoctorlist();
    };

    $scope.DynamictoggleSubSpecialization = function (item) {
        var checkedArray = _.where($scope.allSubSpecializationsArray, { isChecked: true });
        $scope.AllSubSpecializationsCheck = checkedArray.length > 0 && $scope.allSubSpecializationsArray.length === checkedArray.length ? true : false;

        //$scope.getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);
       //$scope.getdoctorlist();
    };
    $scope.selectedSpecializationId = 0;
    $scope.changeHospitalSpecialization = function (item) {
        $scope.selectedSpecialization = item;
        $scope.selectedSpecializationId = item.SpecializationId || 0;
        $scope.allSubSpecializationsArray = [];
        eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                if (item.SpecializationId !== 0) {
                    $scope.allSubSpecializationsArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.SpecializationId === item.SpecializationId; });
                }
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                console.log($scope.allSubSpecializationsArray);
                //$scope.getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);
                $scope.getdoctorlist();

            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }


        });
    }

    $scope.getdoctorlist = function () {
        var reqObj = {
            "BranchId": $scope.obj.HospitalId,
            "SubSpecializationIdArray": $scope.subSplArray
        }


        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {

            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;
                var RoleID = $scope.userLoginDetails.RoleID;

                $scope.clinicDoctorList = $scope.allUserList;
                $scope.AllOpthaList = angular.copy($scope.allUserList);
                $scope.AllARList = angular.copy($scope.allUserList);
                $scope.AllDilationList = angular.copy($scope.allUserList);
                $scope.AllCounsollerList = angular.copy($scope.allUserList);
                $scope.AllTechnicianList = angular.copy($scope.allUserList);
                $scope.AllDoctorList = angular.copy($scope.allUserList);

                $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                });
                var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                $scope.clinicDoctorList.unshift(docAll);

                $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                });

                $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                    return item.RoleId === 10;
                });
                $scope.AllARList = _.uniq($scope.AllARList, false, function (p) { return p.DoctorID; });
                $scope.AllARList = $filter("filter")($scope.AllARList, function (item) {
                    return item.RoleId === 61;
                });

                $scope.AllDilationList = _.uniq($scope.AllDilationList, false, function (p) { return p.DoctorID; });
                $scope.AllDilationList = $filter("filter")($scope.AllDilationList, function (item) {
                    return item.RoleId === 54 || item.RoleId === 2 || item.RoleId === 10;
                });

                $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
                $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                    return item.RoleId === 18;
                });
                $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 55;
                });


                var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                if (Index > -1) {
                    $scope.selectedDoctor = $scope.clinicDoctorList[Index];
                } else {
                    $scope.selectedDoctor = $scope.clinicDoctorList[0];
                }


                if (RoleID === 1 || RoleID === 56) {

                    $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                        return item.RoleId === 1 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
                    });
                }



                if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {

                    Index = $scope.clinicDoctorList.findIndex(record => record.FullName === "All Doctors");
                    if (Index > -1) {
                        $scope.clinicDoctorList.splice(Index, 1);
                    }



                }



                //if (RoleID === 1) {
                //    loadAppointmentforDoc($scope.selectedDoctor);
                //} else {
                //    $scope.loadAppointments($scope.selectedDoctor);
                //}

            } else {
                alertify.error("No Users Found in Selected Departments");
            }


        }

        function onGetUsersFailure(data) {
        }
    }



    $scope.initroom = function () {
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
            $scope.hospitalcd = "";
            $scope.hospid = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.parenthospId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            var brancList = localStorageFactory.getItem("allBranchesData") || [];
            OnGetDoctorSuccess1(brancList);
        }

        $scope.RoomTypeList = [];
        eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
            $scope.RoomTypeList = resp.data;
            //if ($scope.Patientlistdata.AppointmentTypeId !== 10) {
            //    $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 5 && item.Id !== 6 });
            //} else {
            //    $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 6 });
            //    // $scope.RoomTypeList = resp.data;                        
            //}
        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });

        $scope.DoctorWaitingRoomList = [];
        $scope.OptomWaitingRoomList = [];
        $scope.ARWaitingRoomList = [];
        $scope.ARActiveRoomList = [];
        $scope.DilationWaitingRoomList = [];
        $scope.CounsellorWaitingRoomList = [];
        $scope.InvestigationWaitingRoomList = [];
        $scope.DoctorActiveRoomList = [];
        $scope.OptomActiveRoomList = [];
        $scope.DilationActiveRoomList = [];
        $scope.CounsellorActiveRoomList = [];
        $scope.InvestigationActiveRoomList = [];
        $scope.PatientListarray = [];
        $scope.INPatientsList = [];
        $scope.INPatientsList = [];
        $scope.OutPatientsList = [];


    };
    $scope.initroom();
    $scope.PatientCount = {
        "ReceptionCount": 0
    }
    $scope.GetAppointmentslist = function () {
        var subList = [];
        angular.forEach($scope.allSubSpecializationsArray, function (mitems) {
            if (mitems.isChecked) {
                subList.push(mitems.SubSpecializationId);
            }
        });
        var params = {
            "HospitalId": $scope.obj.HospitalId,
            "Date": $scope.ToDate,
            "SpecializationId": $scope.selectedSpecializationId || 0,
            "SubSpecializationIds": subList,
            "DoctorID": 0,
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetAllAppointmentList(params).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === 'Success') {

                if (resp.data.rows.length !== 0) {
                    $scope.PatientListarray = resp.data.rows || [];
                    $scope.PatientCount.ReceptionCount = resp.data.count || 0;
                } else {
                    $scope.PatientListarray = [];
                }
            }
        });
    };
    //$scope.GetAppointmentslist();


    $scope.ChangeHospitalDetails = function (item) {
        $scope.obj.HospitalObj = item;
        $scope.selectedBranch1 = item;
        $scope.obj.HospitalId = $scope.selectedBranch1.BranchId;
        $scope.GetAppointmentslist();
        //  $scope.PatientWaitingRoomList();
        $scope.PatientDoctorWaitingRoomList();
        // $scope.PatientOptomWaitingRoomList();
        //  $scope.PatientCounsellorWaitingRoomList();
        $scope.CheckedOutPatientsList();
        $scope.GetPatientDynamicStatusCount();
        $scope.getdoctorlist();
    };






    $scope.MoveToDoctorRoom = function (item) {



        if (item.RoomTypeId === 4) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoCounselor) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if (item.RoomTypeId === 3) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoDilation) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if (item.RoomTypeId === 1) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoDoctor) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if (item.RoomTypeId === 2) {

            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoOptom) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }

        $scope.Time = $filter("date")(new Date(), "HH:mm");
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": item.PatientId,
            "AppointmentId": item.AppointmentId,
            "RoomId": item.RoomId,
            "RoomTypeId": item.RoomTypeId,
            "NextCounterId": item.RoomTypeId,
            "PreviousCounterId": null,
            "StartTime": $scope.Time,
            "PatientDynamicStatusId": 0,
            "Status": "Active",
            "DoctorId": item.AppointmentDoctorID,
            "OptomId": null,
            "ARId": null,
            "DilationAssistantId": null,
            "CounsellorId": null,
            "IsCheckedOut": false,
            "RoleId": $scope.userLoginDetails.RoleID

        }
        if (params.RoomTypeId === 7) {
            params.RoomId = null;
            params.IsCheckedOut = true;
            params.Status = 'Completed';
        }
        eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.PreStartDirectConsultation(item);
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });
    }
    $scope.MoveToOptomRoom = function (item) {


        //if ($scope.RoomSearchObj.RoomTypeId === 4) {
        //    if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoCounselor) {
        //        alertify.error("Sorry You Dont have Access,Please Contact Administrator");
        //        return false;
        //    }
        //}
        //if ($scope.RoomSearchObj.RoomTypeId === 3) {
        //    if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoDilation) {
        //        alertify.error("Sorry You Dont have Access,Please Contact Administrator");
        //        return false;
        //    }
        //}
        //if ($scope.RoomSearchObj.RoomTypeId === 7) {
        //    if (!$scope.UserAccessRights.AllAccessRights.OPCheckOutAccess) {
        //        alertify.error("Sorry You Dont have Access,Please Contact Administrator");
        //        return false;
        //    }
        //}
        //if ($scope.RoomSearchObj.RoomTypeId === 2) {

        //    if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoOptom) {
        //        alertify.error("Sorry You Dont have Access,Please Contact Administrator");
        //        return false;
        //    }         
        //}
        //if ($scope.RoomSearchObj.RoomTypeId === 5) {
        //    if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoTechnician) {
        //        alertify.error("Sorry You Dont have Access,Please Contact Administrator");
        //        return false;
        //    }
        //    if ($scope.RoomSearchObj.TechnicianId === null) {
        //        alertify.error("Select Technician");
        //        return false;
        //    }
        //}
        $scope.Time = $filter("date")(new Date(), "HH:mm");
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": item.PatientId,
            "AppointmentId": item.AppointmentId,
            "RoomId": item.RoomId,
            "RoomTypeId": item.RoomTypeId,
            "NextCounterId": item.RoomTypeId,
            "PreviousCounterId": null,
            "StartTime": $scope.Time,
            "PatientDynamicStatusId": 0,
            "Status": "Active",
            "DoctorId": null,
            "OptomId": item.AppOptometristId || $scope.RoomSearchObj.OptomId || 0,
            "ARId": null,
            "DilationAssistantId": null,
            "CounsellorId": null,
            "IsCheckedOut": false,
            "RoleId": $scope.userLoginDetails.RoleID
        }
        if (params.RoomTypeId === 7) {
            params.RoomId = null;
            params.IsCheckedOut = true;
            params.Status = 'Completed';
        }
        // $scope.PreStartDirectConsultation(item);
        eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.PreStartDirectConsultation(item);
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });
    }

    $scope.MoveToARRoom = function (item) {

 
        $scope.Time = $filter("date")(new Date(), "HH:mm");
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": item.PatientId,
            "AppointmentId": item.AppointmentId,
            "RoomId": item.RoomId,
            "RoomTypeId": item.RoomTypeId,
            "NextCounterId": item.RoomTypeId,
            "PreviousCounterId": null,
            "StartTime": $scope.Time,
            "PatientDynamicStatusId": 0,
            "Status": "Active",
            "DoctorId": null,
            "OptomId": null,
            "ARId": item.AppARId || $scope.RoomSearchObj.ARId || 0,
            "DilationAssistantId": null,
            "CounsellorId": null,
            "IsCheckedOut": false,
            "RoleId": $scope.userLoginDetails.RoleID
        }
        if (params.RoomTypeId === 7) {
            params.RoomId = null;
            params.IsCheckedOut = true;
            params.Status = 'Completed';
        }
        // $scope.PreStartDirectConsultation(item);
        eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.PreStartDirectConsultation(item);
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });
    }

    $scope.PreStartDirectConsultation = function (item, type) {




        $rootScope.ShowPreConsultationTab = false;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.cacheStorageItem.RoomTypeId = item.RoomTypeId || 0;
        $scope.cacheStorageItem.RoomId = item.RoomId || 0;
        eHnoteProcedureDataService.GetParentAndChildAppointmentDetails(item.AppointmentId).then(function (resp) {
            if (resp.data.length > 0) {
                $scope.cacheStorageItem.ChildAppointmentId = resp.data[0].ChildAppointmentId || 0;
                $scope.cacheStorageItem.ChildAppointmentDoctorName = resp.data[0].ChildAppointmentDoctorName || "";
                $scope.cacheStorageItem.ChildAppointmentBookedStatus = resp.data[0].ChildAppointmentBookedStatus || "";
                $scope.cacheStorageItem.ParentAppointmentId = resp.data[0].ParentAppointmentId || 0;
                $scope.cacheStorageItem.RootAppointmentId = resp.data[0].RootAppointmentId || 0;
                $scope.cacheStorageItem.ParentAppointmentDoctorName = resp.data[0].ParentAppointmentDoctorName || "";
            }
            $scope.cacheStorageItem.DoctorVisitRsnID = item.AppointmentTypeId;
            $scope.startDirectConsultation(item, type);
        }, function (err) {
            console.log(err);
        });

    };

    $scope.startDirectConsultation = function (item, type) {
        if (type === "Receptionist" || $scope.userLoginDetails.RoleID === 2 || $scope.userLoginDetails.RoleID === 11 || $scope.userLoginDetails.RoleID === 58) {
            $scope.cacheStorageItem.UserLoginType = "Receptionist";
            $scope.cacheStorageItem.IsLoginInd = true;
        } else {
            $scope.cacheStorageItem.UserLoginType = "";
            $scope.cacheStorageItem.IsLoginInd = false;
        }
        generatePatientNotes(item.PatientId, item);
    };



    function loadConsultationData(item) {

        $scope.cacheStorageItem.Diagnosis = [];
        $scope.cacheStorageItem.Treatments = [];
        $scope.cacheStorageItem.Investigations = [];
        $scope.cacheStorageItem.ChiefComplaints = [];
        $scope.cacheStorageItem.ClinicalNotes = [];
        $scope.cacheStorageItem.Prescriptions = [];
        $scope.cacheStorageItem.Observations = [];
        $scope.cacheStorageItem.PlanOfCareComments = [];
        $scope.cacheStorageItem.LabTest = [];
        $scope.cacheStorageItem.MedicalConditions = [];
        //$scope.cacheStorageItem.AllergyItems = [];
        // $scope.cacheStorageItem.MedicalHistory = [];
        $scope.cacheStorageItem.UnaidedArray = [];
        $scope.cacheStorageItem.RefractionArray = [];
        $scope.cacheStorageItem.AcceptenceArray = [];
        $scope.cacheStorageItem.KeretometerArray = [];
        $scope.cacheStorageItem.OcularDominanceArray = [];
        $scope.cacheStorageItem.PinholeArray = [];
        $scope.cacheStorageItem.LCVArray = [];
        $scope.cacheStorageItem.BinocularArray = [];
        $scope.cacheStorageItem.AnteriorSegmentArray = [];
        $scope.cacheStorageItem.PosteriorSegmentArray = [];
        $scope.cacheStorageItem.AdditionalInvestgationArray = [];
        $scope.cacheStorageItem.RestructuredDocInvTemplates = [];
        $scope.cacheStorageItem.ColourVisionArray = [];
        $scope.cacheStorageItem.OcularMotilityArray = [];
        $scope.cacheStorageItem.TonometryTestArray = [];
        $scope.cacheStorageItem.Findings = [];
        $scope.cacheStorageItem.InvestigationDetails = [];
        $scope.cacheStorageItem.chkOldglass = false;
        $scope.cacheStorageItem.IsfindingsDataInitialized = false;
        $scope.cacheStorageItem.FollowUpDuration = '';
        $scope.cacheStorageItem.FollowUpDurationType = 'D';
        $scope.cacheStorageItem.FollowUpDurationTypeName = 'Day(s)';
        $scope.cacheStorageItem.FollowUpNotes = '';
        $scope.cacheStorageItem.SurgeryArray = [];
        $scope.cacheStorageItem.FileUploadImageArray = [];
        $scope.cacheStorageItem.appointmentid = 0;
        $scope.cacheStorageItem.FileUploadPDfArray = [];
        $scope.cacheStorageItem.appointmentStatus = "";
        $scope.cacheStorageItem.TreatmentPlanId = 0;
        $scope.cacheStorageItem.PatientPreRequisiteId = 0;
        $scope.cacheStorageItem.SelectedConsultationType = "";

        $scope.cacheStorageItem.OptomComments = '';
        $scope.cacheStorageItem.DoctorComments = '';
        $scope.cacheStorageItem.GlassPrescriptionArray = [];
        $scope.cacheStorageItem.ArRefractionArray = [];
        $scope.cacheStorageItem.LoadedTemplates = [];


        //    $scope.cacheStorageItem.Checklist.MainArray.SkinArray = [];
        //    $scope.cacheStorageItem.Checklist.MainArray.HairArray = [];
        $scope.cacheStorageItem.InvGlasses = [];
        $scope.cacheStorageItem.GonioscopyArray = [];
        $scope.cacheStorageItem.ClinicalNotesComments = '';
        $scope.cacheStorageItem.PatientInstructionComments = '';
        eHnoteMasterDataService.addpatientData(item.PatientDetails);
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        var patientinfo = item.PatientDetails;
        $scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;
        $scope.cacheStorageItem.AppointmentStatus = item.AppointmentStatus;
        $scope.cacheStorageItem.ChiefComplaints = [];
        $scope.cacheStorageItem.PostMydriaticTestArray = [];
        if (item.VisitReason) {

            var obj = {
                "ChiefComplaintName": "",
                "IsEdit": false,
                "ActiveInd": 'Y',
                "ChiefComplaintId": 0,
                "Duration": 0,
                "DurationType": 'D',
                "PatientChiefComplaintId": 0,
                "Remarks": "",
                "OrganId": 4,
                "OrganName": "General"
            };
            $scope.cacheStorageItem.ChiefComplaints.push(obj);
        }

        if (item.AppointmentStatus === "C") {
            $scope.cacheStorageItem.appointmentid = 0;
            $scope.cacheStorageItem.AppointmentDoctorID = 0;
        } else {
            $scope.cacheStorageItem.appointmentid = item.AppointmentId;
            $scope.cacheStorageItem.AppointmentDoctorID = item.AppointmentDoctorID;
        }
        $scope.cacheStorageItem.ApptDate = item.AppointmentDate;
        $scope.cacheStorageItem.ApptStartTime = item.StartTime;
        $scope.cacheStorageItem.patientid = item.PatientId;
        $scope.cacheStorageItem.VisitReason = "";
        $scope.cacheStorageItem.doctorid = item.AppointmentDoctorID;
        $scope.cacheStorageItem.PatientDisplayId = item.MRNO;
        $scope.cacheStorageItem.EmailID = item.EmailId ? item.EmailId : "";
        //$scope.cacheStorageItem.CountryCode = item.PatientDetails.PhCntryCD;
        $scope.cacheStorageItem.PhoneNumber = item.MobileNo;

        item.PatientID = item.PatientId;
        item.MasterPatientId = item.MasterPatientId;
        $scope.cacheStorageItem.PatientID = item.PatientId;
        item.Gender = item.Gender || "";
        item.PatientGSTNO = "";
        item.BranchArea = "";
        $scope.cacheStorageItem.PatientName = item.PatientName;
        $scope.cacheStorageItem.PatientTypeId = 1;
        var DocFreqItems = datapersistanceFactory.getItem("DoctorFrequenctItems");
        $scope.cacheStorageItem.UserFreqData = DocFreqItems;

        $scope.cacheStorageItem.SelectedConsultationType = "New";
        $scope.cacheStorageItem.masterChiefComplaintsArray = [];
        $scope.cacheStorageItem.masterClinicalNotesArray = [];
        $scope.cacheStorageItem.masterObservationsArray = [];
        $scope.cacheStorageItem.masterDiagnosisArray = [];
        $scope.cacheStorageItem.masterProceduresArray = [];
        $scope.cacheStorageItem.masterMedicinesArray = [];
        $scope.cacheStorageItem.masterLabTestArray = [];
        $scope.cacheStorageItem.masterInvestigationsArray = [];
        $scope.cacheStorageItem.masterInvCategoriesArray = [];
        $scope.cacheStorageItem.masterMedicineTemplatesArray = [];
        $scope.cacheStorageItem.masterPrescriptionFrequencies = [];
        $scope.cacheStorageItem.PatientSuggestInvestigation = [];
        $scope.cacheStorageItem.PatientInvestigations = [];
        $scope.cacheStorageItem.LabtestList = [];



        $scope.cacheStorageItem.TreatmentAssignedDoctor = item.TreatmentAssignedDoctor;

        item.PatientDetails = item.Patient;
        eHnoteMasterDataService.addAppointmentInfo(item);


        $scope.cacheStorageItem.ConsultationID = item.ConsultationId || 0;
        $scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;
        //  $scope.cacheStorageItem.PatientPreRequisiteId = item.PatientPreRequisiteId;


        //generatePatientNotes(item.PatientID);

        $scope.cacheStorageItem.IsVIPInd = item.IsVIPInd || false;
        $scope.cacheStorageItem.IsResearchInd = item.IsResearchInd || false;
        $scope.cacheStorageItem.IsVIPRemarks = item.IsVIPRemarks || "";
        $scope.cacheStorageItem.IsResearchRemarks = item.IsResearchRemarks || "";
        $scope.cacheStorageItem.IsHighRiskInd = item.IsHighRiskInd || false;
        $scope.cacheStorageItem.IsHighRiskRemarks = item.IsHighRiskRemarks || "";

        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        //commented by durga on 24-09-2025
        //var object = {
        //    "AppointmentId": $scope.cacheStorageItem.appointmentid,
        //    "ConsultationId": $scope.cacheStorageItem.ConsultationID,
        //    "UserId": $scope.UserId,
        //    "ScreenType":"ApptDynamicStatus"
        //};
        //eHnotePatientDataService.CheckConsultationStatus(object).then(function (resp) {

        //    if (item.ParentAppointmentId === 0) {
        //        if (resp.data.ConsultationId !== undefined) {
        //            item.AppointmentStatus = resp.data.AppointmentStatus;
        //            item.ConsultationId = resp.data.ConsultationId;
        //            item.TreatmentPlanId = resp.data.TreatmentPlanId;
        //            $scope.cacheStorageItem.AppointmentType = resp.data.AppointmentType;
        //        }
        //    }
        //    else {
        //        if (resp.data.ConsultationId !== undefined) {
        //            item.AppointmentStatus = resp.data.AppointmentStatus;
        //            item.ConsultationId = resp.data.ConsultationId;
        //            $scope.cacheStorageItem.AppointmentType = resp.data.AppointmentType;
        //        }
        //    }
        //    if ($scope.VideoConsultation || ($scope.Tab === 'teleappointments' && $scope.SpecializationId === 3)) {
        //        continuetoVideoappointment(item);

        //    }
        //    else {
        //        continuetoappointment(item);
        //    }


        //}, function (err) {
        //    if ($scope.VideoConsultation || $scope.Tab === 'teleappointments') {
        //        continuetoVideoappointment(item);
        //    }
        //    else {
        //        continuetoappointment(item);
        //    }

        //});
    }

    function generatePatientNotes(patientId, item) {

        $scope.cacheStorageItem.MedicalHistory = [];
        $scope.cacheStorageItem.BirthHistory = [];
        $scope.cacheStorageItem.FamilyHistory = [];
        $scope.cacheStorageItem.NutritionalHistory = [];
        $scope.cacheStorageItem.ImmunisationHistory = [];
        $scope.cacheStorageItem.SurgicalHistory = [];
        $scope.cacheStorageItem.MenstrualHistory = [];
        $scope.cacheStorageItem.LifestyleHistory = [];
        $scope.cacheStorageItem.AllergyItems = [];
        // $scope.cacheStorageItem.MedicalConditions = [];

        $scope.cacheStorageItem.OccularHistory = [];
        //eHnotePatientDataService.GetGeneralPatientHistory(patientId).then(function (resp) {
        eHnotePatientDataService.GetMedicalConditonHistoriesByPatientId(patientId).then(function (resp) {

            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    $scope.PatientPastMedicalHistory = resp.data.rows[0].PastMedicalHistory;
                    $scope.PatientBirthHistory = resp.data.rows[0].BirthHistory;
                    $scope.PatientOccularHistory = resp.data.rows[0].OccularHistory;
                    $scope.PatientFamilyHistory = resp.data.rows[0].FamilyHistory;
                    $scope.PatientImmunisationHistory = resp.data.rows[0].ImmunisationHistory;
                    $scope.PatientNutritionalHistory = resp.data.rows[0].NutritionalHistory;
                    $scope.PatientSurgicalHistory = resp.data.rows[0].SurgicalHistory;
                    $scope.PatientMenstrualHistory = resp.data.rows[0].MenstrualHistory;
                    $scope.PatientLifestyleHistory = resp.data.rows[0].LifestyleHistory;
                    $scope.PatientAllergyHistory = resp.data.rows[0].Allergy;
                    //  $scope.PatientMedicalConditionHistory = resp.data.CurrentTreatment;
                    $scope.PatientOccularHistory = resp.data.rows[0].OccularHistory;

                    if ($scope.PatientPastMedicalHistory !== undefined) {
                        if ($scope.PatientPastMedicalHistory.length !== 0) {
                            $scope.cacheStorageItem.MedicalHistory = $scope.PatientPastMedicalHistory;
                        }
                    }

                    if ($scope.PatientBirthHistory !== undefined) {
                        if ($scope.PatientBirthHistory.length !== 0) {
                            $scope.cacheStorageItem.BirthHistory = $scope.PatientBirthHistory;
                        }
                    }
                    if ($scope.PatientFamilyHistory !== undefined) {
                        if ($scope.PatientFamilyHistory.length !== 0) {
                            $scope.cacheStorageItem.FamilyHistory = $scope.PatientFamilyHistory;
                        }
                    }
                    if ($scope.PatientNutritionalHistory !== undefined) {
                        if ($scope.PatientNutritionalHistory.length !== 0) {
                            $scope.cacheStorageItem.NutritionalHistory = $scope.PatientNutritionalHistory;
                        }
                    }
                    if ($scope.PatientImmunisationHistory !== undefined) {
                        if ($scope.PatientImmunisationHistory.length !== 0) {
                            $scope.cacheStorageItem.ImmunisationHistory = $scope.PatientImmunisationHistory;
                        }
                    }
                    if ($scope.PatientSurgicalHistory !== undefined) {
                        if ($scope.PatientSurgicalHistory.length !== 0) {
                            $scope.cacheStorageItem.SurgicalHistory = $scope.PatientSurgicalHistory;
                        }
                    }
                    if ($scope.PatientMenstrualHistory !== undefined) {
                        if ($scope.PatientMenstrualHistory.length !== 0) {
                            $scope.cacheStorageItem.MenstrualHistory = $scope.PatientMenstrualHistory;
                        }
                    }

                    if ($scope.PatientLifestyleHistory !== undefined) {
                        if ($scope.PatientLifestyleHistory.length !== 0) {
                            $scope.cacheStorageItem.LifestyleHistory = $scope.PatientLifestyleHistory;
                        }
                    }

                    if ($scope.PatientAllergyHistory !== undefined) {
                        if ($scope.PatientAllergyHistory.length !== 0) {
                            $scope.cacheStorageItem.AllergyItems = $scope.PatientAllergyHistory;
                        }
                    }
                    if ($scope.PatientOccularHistory !== undefined) {
                        if ($scope.PatientOccularHistory.length !== 0) {
                            $scope.cacheStorageItem.OccularHistory = $scope.PatientOccularHistory;
                        }
                    }
                    $scope.cacheStorageItem.MedicalHistory.forEach(function (pitem, index) {
                        pitem.ActiveInd = true;
                        pitem.IsEdit = false;
                        pitem.Duration = pitem.Duration || "";
                        pitem.DurationType = pitem.DurationType || "D";
                        pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                        pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                        pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    });
                    //$scope.cacheStorageItem.MedicalConditions.forEach(function (pitem, index) {
                    //    pitem.ActiveInd = true;
                    //    pitem.IsEdit = false;
                    //    pitem.Duration = pitem.Duration || "";
                    //    pitem.DurationType = pitem.DurationType || "D";
                    //    pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                    //    pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                    //    pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    //});
                    $scope.cacheStorageItem.BirthHistory.forEach(function (pitem, index) {
                        pitem.ActiveInd = true;
                        pitem.IsEdit = false;
                        pitem.Duration = pitem.Duration || "";
                        pitem.DurationType = pitem.DurationType || "D";
                        pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                        pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                        pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    });
                    $scope.cacheStorageItem.SurgicalHistory.forEach(function (pitem, index) {
                        pitem.ActiveInd = true;
                        pitem.IsEdit = false;
                        pitem.Duration = pitem.Duration || "";
                        pitem.DurationType = pitem.DurationType || "D";
                        pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                        pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                        pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    });
                    //if ($scope.PatientMedicalConditionHistory !== undefined) {
                    //    if ($scope.PatientMedicalConditionHistory.length !== 0) {
                    //        $scope.PatientMedicalConditionHistory.forEach(function (pitem, index) {
                    //            pitem.ActiveInd = true;
                    //        });
                    //        $scope.cacheStorageItem.MedicalConditions = $scope.PatientMedicalConditionHistory;
                    //    }
                    //}


                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                    loadConsultationData(item);
                }

            }


        }, function (err) {
            loadConsultationData(item);
        });


    }


    function continuetoappointment(item) {
        $scope.DoctorSpecializationId = item.DoctorSpecializationId || 0;
        if ($scope.SpecializationId === 2 || item.DoctorSpecializationId === 2) {//Get Dental Case History
            if (item.ParentAppointmentId === 0) {
                if (item.AppointmentStatus === "E" || item.AppointmentStatus === "O") {
                    $scope.GetPatientDentalCaseHistorybyId(item);
                } else {
                    $q.all([
                        eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentId),
                        eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentId })
                    ]).then(function (res) {
                        if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                            $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                        }
                        if (res[1].data.PatientFiles.length > 0) {
                            $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                        }
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                        continuetoStartConsultation();
                    }, function (err) {
                        console.log(err);
                    });

                }
            } else {
                if (item.AppointmentStatus === 'B') {
                    $scope.GetPatientDentalCaseHistorybyId(item);
                } else {
                    if (item.AppointmentStatus === "O" || item.AppointmentStatus === "E") {
                        $scope.GetPatientDentalCaseHistorybyId(item);
                    } else {
                        $q.all([
                            eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentId),
                            eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentId })
                        ]).then(function (res) {
                            if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                                $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                            }
                            if (res[1].data.PatientFiles.length > 0) {
                                $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                            }
                            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                            continuetoStartConsultation();
                        }, function (err) {
                            console.log(err);
                        });
                    }
                }
            }
        } else {//Get Opthalmology Case History
            if (item.ParentAppointmentId === 0) {
                if ((item.AppointmentStatus === "O" && item.TreatmentPlanId !== 0) || (item.AppointmentStatus === "E") || (item.AppointmentStatus === "D")) {

                    $scope.GetPatientCaseHistoryById(item.TreatmentPlanId, item.ConsultationId, item.AppointmentId);


                } else {
                    $q.all([
                        eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentId),
                        eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentId })
                    ]).then(function (res) {
                        if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                            $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                        }
                        if (res[1].data.PatientFiles.length > 0) {
                            $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                        }
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        continuetoStartConsultation();
                    }, function (err) {
                        console.log(err);
                    });
                }
            } else {
                //if (item.AppointmentStatus === "B") {


                //    if (item.TreatmentPlanId === 0) {
                //        continuetoStartConsultation();
                //    } else {
                //        $scope.GetPatientCaseHistoryById(item.TreatmentPlanId, item.ConsultationId, item.ParentAppointmentId);
                //    }


                //}
                // else {
                if ((item.AppointmentStatus === "O" && item.TreatmentPlanId !== 0) || item.AppointmentStatus === "E" || item.AppointmentStatus === "D") {
                    $scope.GetPatientCaseHistoryById(item.TreatmentPlanId, item.ConsultationId, item.AppointmentId);
                } else {
                    $q.all([
                        eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentId),
                        eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentId })
                    ]).then(function (res) {
                        if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                            $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                        }
                        if (res[1].data.PatientFiles.length > 0) {
                            $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                        }
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        continuetoStartConsultation();
                    }, function (err) {
                        console.log(err);
                    });
                }
                //}
            }
        }
    }

    function continuetoStartConsultation() {
       
            if ($scope.SpecializationId === 2 || $scope.DoctorSpecializationId === 2) {
                $location.url("/dentalConsultation");
            } else {
                $location.url("/NewOpthaConsultation");
            }
        
    }

    $scope.GetPatientCaseHistoryById = function (planind, consultationid, AppointmentID) {
        var type = 0;
        if (consultationid === 0) {
            type = 1;
        }

        //object = {
        //    "TreatmentPlanId": planind,
        //    "Type": type
        //};

        var object = {
            "AppointmentId": AppointmentID,
            "Type": type
        };

       // eHnotePatientDataService.GetPatientTreatPlanDtls(object).then(function (resp) {
        eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
            if (resp.data !== undefined) {
                $scope.treatmentData = resp.data;
                if (resp.data.length > 0) {
                    $scope.referalMailBind = resp.data[0].ReferralDocemail || "";
                    $scope.referalDoctorID = resp.data[0].ReferalDoctorId;
                    $scope.cacheStorageItem.ReferalDoctorName = resp.data[0].ReferalDoctorName || "";
                    $scope.cacheStorageItem.RefeRalDoctorNotes = resp.data[0].RefeRalDoctorNotes || "";
                }
                $scope.cacheStorageItem.TreatmentPlanId = planind;
                $scope.SelectedPlanArray = $filter("filter")($scope.treatmentData, { "AppointmentId": AppointmentID }, true);
                if ($scope.SelectedPlanArray.length > 0) {
                    $scope.RestructureToCacheStorage($scope.SelectedPlanArray[0], consultationid);
                }
            } else {
                $scope.TreatMentPlans = [];
                if ($scope.VideoConsultation || ($scope.Tab === 'teleappointments' && $scope.SpecializationId === 3)) {
                    continuetoStartVideoConsultation();

                }
                else {
                    continuetoStartConsultation();
                }

            }
        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
            $scope.TreatMentPlans = [];
        });

    };
    $scope.GetPatientDentalCaseHistorybyId = function (item) {
        $scope.isParentAppointmentExists = false;
        var appointmentId = 0;
        var type = 0;

        if (item.ParentAppointmentId === 0) {
            appointmentId = item.AppointmentID;
            type = 0;
        } else {
            if (item.AppointmentStatus === "B") {
                $scope.isParentAppointmentExists = true;
                appointmentId = item.ParentAppointmentId;
                type = 1;
            } else {
                appointmentId = item.AppointmentID;
                type = 0;
            }
        }

        $scope.ConsultationData = [];

        object = {
            "UserId": item.DoctorID,
            "PatientId": item.PatientID,
            "AppointmentId": appointmentId,
            "Type": type
        };

        $scope.TreatmentPlanId = item.TreatmentPlanId;

        $scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;


        eHnotePatientDataService.GetPatientDentalCaseHistorybyId(object).then(function (resp) {


            var plan = "";
            $scope.SelectedPlan = "";


            if (resp.data.length > 0) {
                if (resp.data.status === "Failure") {
                    alertify.error(resp.data.Message);
                    return;
                }
                $scope.AppointmentsData = resp.data;
                getPatientNoteFiles(item.AppointmentID);
                getvitalparamertersbyId(item.AppointmentID);
                if ($scope.AppointmentsData.length === 0) {
                    return;
                }

                $scope.ConsultationData.push(resp.data[0]);
                $scope.cacheStorageItem.TotalTreatMentFinalCost = 0;
                angular.forEach($scope.ConsultationData, function (mainitem) {
                    mainitem.ToothProblems = mainitem.ToothProblems || [];
                    angular.forEach(mainitem.ToothProblems, function (subitem) {
                        subitem.Treatments = subitem.Treatments || [];
                        angular.forEach(subitem.Treatments, function (treatItem) {
                            if (treatItem.TreatmentData.Status !== undefined) {
                                treatItem.TreatmentData.Status = treatItem.TreatmentData.Status.toString();
                            } else {
                                treatItem.TreatmentData.Status = "1";
                            }
                            treatItem.TreatmentData.TreatmentFinalCost = treatItem.TreatmentData.TreatmentCost - treatItem.TreatmentData.DiscountAmount;
                            $scope.cacheStorageItem.TotalTreatMentFinalCost += treatItem.TreatmentData.TreatmentFinalCost;
                        });
                    });
                });





                //var plan = $scope.ConsultationData[0];
                //$scope.SelectedPlan = plan;




                $scope.SelectedPlanArray = $filter("filter")($scope.ConsultationData, { "AppointmentId": appointmentId }, true);
                if ($scope.SelectedPlanArray.length > 0) {
                    plan = $scope.SelectedPlanArray[0];
                    $scope.SelectedPlan = plan;
                }




                if (plan.Appointmentwith !== undefined && plan.Appointmentwith !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.DoctorName = plan.Appointmentwith;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }

                if (plan.BranchName !== undefined && plan.BranchName !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.BranchName = plan.BranchName;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }

                if (plan.BranchEmail !== undefined && plan.BranchEmail !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.BranchEmail = plan.BranchEmail;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }
                if (plan.BranchMobile !== undefined && plan.BranchMobile !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.BranchMobile = plan.BranchMobile;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }
                if (plan.Address1 !== undefined && plan.Address1 !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.BranchAddress1 = plan.Address1;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }
                if (plan.Address2 !== undefined && plan.Address2 !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.BranchAddress2 = plan.Address2;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }

            }

            $scope.RestructureToCacheStorage($scope.SelectedPlan, item.ConsultationId);

        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
            $scope.TreatMentPlans = [];
        });
    };
    function GetEyeName(OrganId) {
        if (OrganId === 1) {
            return "Right Eye";
        }
        if (OrganId === 2) {
            return "Left Eye";
        }
        if (OrganId === 3) {
            return "Both Eyes";
        }
        if (OrganId === 4) {
            return "General";
        }
    }

    $scope.RestructureToCacheStorage = function (plan, consultationid) {

        plan = plan || "";

        $scope.cacheStorageItem.IsNewConsultation = false;
        $scope.cacheStorageItem.IsEditConsultation = true;
        $scope.cacheStorageItem.IsFollowupConsultation = false;




        if (consultationid === 0) {
            $scope.cacheStorageItem.ConsultationID = 0;
        } else {
            $scope.cacheStorageItem.ConsultationID = consultationid;
        }
        if (plan != "") {
            if ($scope.SpecializationId === 2) {
                $scope.cacheStorageItem.MedicalHistory = plan.MedicalHistory;
                $scope.cacheStorageItem.MedicalHistory.forEach(function (pitem, index) {
                    pitem.ActiveInd = true;
                    pitem.IsEdit = false;
                    pitem.Duration = pitem.Duration || "";
                    pitem.DurationType = pitem.DurationType || "D";
                    pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                    pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                    pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                });
            }

            else {
                if ($scope.PatientPastMedicalHistory !== undefined) {
                    if ($scope.PatientPastMedicalHistory.length !== 0) {
                        $scope.cacheStorageItem.MedicalHistory = $scope.PatientPastMedicalHistory;
                    }
                }
            }
        }


        if ($scope.PatientBirthHistory !== undefined) {
            if ($scope.PatientBirthHistory.length !== 0) {
                $scope.cacheStorageItem.BirthHistory = $scope.PatientBirthHistory;
            }
        }
        if ($scope.PatientOccularHistory !== undefined) {
            if ($scope.PatientOccularHistory.length !== 0) {
                $scope.cacheStorageItem.OccularHistory = $scope.PatientOccularHistory;
            }
        }
        if ($scope.PatientFamilyHistory !== undefined) {
            if ($scope.PatientFamilyHistory.length !== 0) {
                $scope.cacheStorageItem.FamilyHistory = $scope.PatientFamilyHistory;
            }
        }
        if ($scope.PatientNutritionalHistory !== undefined) {
            if ($scope.PatientNutritionalHistory.length !== 0) {
                $scope.cacheStorageItem.NutritionalHistory = $scope.PatientNutritionalHistory;
            }
        }
        if ($scope.PatientImmunisationHistory !== undefined) {
            if ($scope.PatientImmunisationHistory.length !== 0) {
                $scope.cacheStorageItem.ImmunisationHistory = $scope.PatientImmunisationHistory;
            }
        }
        if ($scope.PatientSurgicalHistory !== undefined) {
            if ($scope.PatientSurgicalHistory.length !== 0) {
                $scope.cacheStorageItem.SurgicalHistory = $scope.PatientSurgicalHistory;
            }
        }

        if ($scope.PatientMenstrualHistory !== undefined) {
            if ($scope.PatientMenstrualHistory.length !== 0) {
                $scope.cacheStorageItem.MenstrualHistory = $scope.PatientMenstrualHistory;
            }
        }
        if ($scope.PatientLifestyleHistory !== undefined) {
            if ($scope.PatientLifestyleHistory.length !== 0) {
                $scope.cacheStorageItem.LifestyleHistory = $scope.PatientLifestyleHistory;
            }
        }

        if ($scope.PatientAllergyHistory !== undefined) {
            if ($scope.PatientAllergyHistory.length !== 0) {
                $scope.cacheStorageItem.AllergyItems = $scope.PatientAllergyHistory;
            }
        }

        //if ($scope.PatientMedicalConditionHistory !== undefined) {
        //    if ($scope.PatientMedicalConditionHistory.length !== 0) {
        //        $scope.PatientMedicalConditionHistory.forEach(function (pitem, index) {
        //            pitem.ActiveInd = true;
        //        });
        //        $scope.cacheStorageItem.MedicalConditions = $scope.PatientMedicalConditionHistory;
        //    }
        //}


        if (plan !== "") {
            if (plan.ReferalDoctorId) {



                $scope.cacheStorageItem.ReferalDoctorId = plan.ReferalDoctorId || "";
                $scope.cacheStorageItem.RefeRalDoctorNotes = plan.RefeRalDoctorNotes || "";
                $scope.cacheStorageItem.ReferalDoctorName = plan.ReferalDoctorName || "";
                $scope.cacheStorageItem.ReferalDoctorType = plan.referraldoctype || "";
                $scope.cacheStorageItem.ReferalOrgId = plan.ReferalOrgId || "";
                $scope.cacheStorageItem.ReferalId = plan.ConsulRefId;





            }

            //MedicalConditions
            if (plan.MedicalConditions !== undefined) {
                if (plan.MedicalConditions.length !== 0) {
                    $scope.cacheStorageItem.MedicalConditions = plan.MedicalConditions;
                }
            }
            //AllergyItems
            //if (plan.AllergyItems !== undefined) {
            //    if (plan.AllergyItems.length !== 0) {
            //        $scope.cacheStorageItem.AllergyItems = plan.AllergyItems;
            //    }
            //}
            //PastMedicalHistory
            //if (plan.PastMedicalHistory !== undefined) {
            //    if (plan.PastMedicalHistory.length !== 0) {
            //        $scope.cacheStorageItem.MedicalHistory = plan.PastMedicalHistory;
            //    }
            //}
            //ChiefComplaints
            if (plan.ChiefComplaints !== undefined) {
                if (plan.ChiefComplaints.length !== 0) {
                    $scope.cacheStorageItem.ChiefComplaints = plan.ChiefComplaints;
                }
            }
            //Observations
            if (plan.Observations !== undefined) {
                if (plan.Observations.length !== 0) {
                    $scope.cacheStorageItem.Observations = plan.Observations;
                }
            }
            if (plan.PlanOfCareComments !== undefined) {
                if (plan.PlanOfCareComments.length !== 0) {
                    $scope.cacheStorageItem.PlanOfCareComments = plan.PlanOfCareComments;
                }
            }
            //if (plan.BirthHistory !== undefined) {
            //    if (plan.BirthHistory.length !== 0) {
            //        $scope.cacheStorageItem.BirthHistory = plan.BirthHistory;
            //    }
            //}
            //if (plan.FamilyHistory !== undefined) {
            //    if (plan.FamilyHistory.length !== 0) {
            //        $scope.cacheStorageItem.FamilyHistory = plan.FamilyHistory;
            //    }
            //}
            //if (plan.NutritionalHistory !== undefined) {
            //    if (plan.NutritionalHistory.length !== 0) {
            //        $scope.cacheStorageItem.NutritionalHistory = plan.NutritionalHistory;
            //    }
            //}
            //if (plan.ImmunisationHistory !== undefined) {
            //    if (plan.ImmunisationHistory.length !== 0) {
            //        $scope.cacheStorageItem.ImmunisationHistory = plan.ImmunisationHistory;
            //    }
            //}
            //if (plan.SurgicalHistory !== undefined) {
            //    if (plan.SurgicalHistory.length !== 0) {
            //        $scope.cacheStorageItem.SurgicalHistory = plan.SurgicalHistory;
            //    }
            //}


            //if (plan.PatientInstructions !== undefined) {
            //    if (plan.PatientInstructions.length !== 0) {
            //        $scope.cacheStorageItem.PatientInstructions = plan.PatientInstructions;
            //    }
            //}



            //PatientDiagnosis
            if (plan.Diagnosis !== undefined) {
                if (plan.Diagnosis.length !== 0) {
                    $scope.cacheStorageItem.Diagnosis = [];
                    plan.Diagnosis.forEach(function (diag, index) {
                        diag.Notes = diag.Notes || "";
                        $scope.cacheStorageItem.Diagnosis.push({
                            "PatientDiagnosisId": diag.PatientDiagnosisId,
                            "SpecializationId": diag.SpecializationId,
                            "OrganId": diag.OrganId,
                            "OrganName": GetEyeName(diag.OrganId),
                            "DiagnosisData": {
                                "DiagnosisId": diag.DiagnosisId,
                                "DiagnosisHistoryId": diag.DiagnosisHistoryId,
                                "DiagnosisTypeId": diag.DiagnosisTypeId.toString(),
                                "DiagnosisType": diag.DiagnosisType,
                                "DiagnosisName": diag.DiagnosisName,
                                "Notes": diag.Notes,
                                "ShowNote": diag.Notes === "" ? false : true,
                                "ActiveInd": "Y",
                                "DiagnosisNotes": diag.Notes,
                                "ModifiedBy": diag.ModifiedBy,
                                "ModifiedDt": diag.ModifiedDt
                            }
                        });
                    });
                }
            }
            //ClinicalNotes
            //if (plan.ClinicalNotes !== undefined) {
            //    if (plan.ClinicalNotes.length !== 0) {
            //        $scope.cacheStorageItem.ClinicalNotes = plan.ClinicalNotes;
            //    }
            //}


            if (plan.FollowUpDetails !== undefined) {
                if (plan.FollowUpDetails.length !== 0) {
                    $scope.cacheStorageItem.FollowUpArray = plan.FollowUpDetails;
                }
            }
            //LabTest
            if (plan.LabTest !== undefined) {
                if (plan.LabTest.length !== 0) {
                    plan.LabTest.forEach(function (lab, index) {
                        lab.ActiveInd = 'Y';
                    });
                    $scope.cacheStorageItem.LabTest = plan.LabTest;
                }
            }

            if (plan.PatientInvestigations !== undefined) {
                if (plan.PatientInvestigations.length !== 0) {
                    plan.PatientInvestigations.forEach(function (inv, index) {
                        inv.ActiveInd = 'Y';
                        inv.OrganId = inv.OrganId.toString();
                    });
                    $scope.cacheStorageItem.PatientInvestigations = plan.PatientInvestigations;
                }
            }

            //if (plan.NewLabTestList !== undefined) {
            //    if (plan.NewLabTestList.length !== 0) {
            //        plan.NewLabTestList.forEach(function (inv, index) {
            //            inv.ActiveInd = 'Y';
            //        });
            //        $scope.cacheStorageItem.LabtestList = plan.NewLabTestList;
            //    }
            //}
            if (plan.masterQuestions !== undefined) {
                if (plan.masterQuestions.length !== 0) {
                    $scope.cacheStorageItem.masterQuestions = plan.masterQuestions;
                }
            }
            $scope.cacheStorageItem.ContactLens = plan.ContactLens || [];
            $scope.cacheStorageItem.ConsultationTreatments = plan.ConsultationTreatments || [];
            $scope.cacheStorageItem.FollowUpDuration = plan.FollowUpDuration ? plan.FollowUpDuration : "";
            $scope.cacheStorageItem.FollowUpDurationType = plan.FollowUpDurationType ? plan.FollowUpDurationType : "D";
            $scope.cacheStorageItem.FollowUpNotes = plan.FollowUpNotes ? plan.FollowUpNotes : "";
            $scope.cacheStorageItem.ConsultationDate = plan.AppointmentDt;
            $scope.cacheStorageItem.OptomComments = plan.OptomComments ? plan.OptomComments : "";
            $scope.cacheStorageItem.DoctorComments = plan.DoctorComments ? plan.DoctorComments : "";
            $scope.cacheStorageItem.ClinicalNotesComments = plan.ClinicalNotes ? plan.ClinicalNotes : "";
            $scope.cacheStorageItem.PatientInstructionComments = plan.PatientInstructions ? plan.PatientInstructions : "";
            // $scope.cacheStorageItem.PlanOfCareComments = plan.PlanOfCareComments || [];
            //Treatment 
            if (plan.Treatment !== undefined) {
                if (plan.Treatment.length !== 0) {
                    $scope.cacheStorageItem.Treatments = [];
                    plan.Treatment.forEach(function (treat, index) {
                        treat.DiscountCost = treat.DiscountCost || 0;
                        treat.TreatmentNotes = treat.TreatmentNotes || "";
                        treat.ShowNote = treat.TreatmentNotes === "" ? false : true;
                        var TreatmentFinalCost = ((treat.ProcedureMaxCost * treat.MultiplyFactor) - parseFloat(treat.TreatmentDiscountAmt) || 0);
                        $scope.cacheStorageItem.Treatments.push({
                            "PatientTreatmentId": treat.PatientTreatmentId,
                            "SpecializationId": treat.SpecializationId,
                            "OrganId": treat.OrganId,
                            "OrganName": GetEyeName(treat.OrganId),
                            "TreatmentData": {
                                "TreatmentHistoryId": treat.TreatmentHistoryId,
                                "ProcedureId": treat.ProcedureId,
                                "TreatmentName": treat.TreatmentName,
                                "TreatmentNotes": treat.TreatmentNotes,
                                "ProcedureMaxCost": treat.ProcedureMaxCost,
                                "TreatmentCost": treat.ProcedureMaxCost,
                                "Multiplyfactor": treat.MultiplyFactor,
                                "DiscountCost": treat.DiscountCost,
                                "TreatmentStatus": treat.StatusId === undefined ? "1" : treat.StatusId.toString(),
                                "discountValue": treat.DiscountValue,
                                "discountType": treat.DiscountType,
                                "TreatmentDiscountAmt": treat.TreatmentDiscountAmt,
                                "ShowNote": treat.ShowNote,
                                "TreatmentFinalCost": TreatmentFinalCost,
                                "TotalSittings": treat.TotalSittings,
                                "ActiveInd": treat.ActiveInd,
                                "IsTreatmentInvoiced": treat.IsTreatmentInvoiced,
                                "ModifiedBy": treat.ModifiedBy,
                                "ModifiedDt": treat.ModifiedDt
                            }
                        });
                    });
                }
            }





            $scope.cacheStorageItem.TotalTreatcost = plan.TotalTreatcost;
            $scope.cacheStorageItem.TotalDisocuntAmount = plan.TotalDisocuntAmount;
            $scope.cacheStorageItem.TotalTreatNetAmount = plan.TotalTreatNetAmount;
            //Surgery
            if (plan.SurgeryData !== undefined) {
                if (plan.SurgeryData.length !== 0) {
                    $scope.cacheStorageItem.SurgeryArray = [];
                    plan.SurgeryData.forEach(function (surgeryItem, index) {
                        var EyeName = "";
                        EyeName = GetEyeName(surgeryItem.OrganId);
                        if (EyeName === "General") {
                            EyeName = "";
                        } else {
                            EyeName = " for " + EyeName;
                        }
                        var FullSurgeryName = "";
                        FullSurgeryName = surgeryItem.SurgeryName + "" + EyeName + " (" + $filter('date')(new Date(surgeryItem.SurgerySuggestedDate), "dd-MMM-yyyy") + ") ";
                        if (surgeryItem.AnesthesiaTypeId === 1) {
                            surgeryItem.AnesthesiaType = 'Local';
                        } else if (surgeryItem.AnesthesiaTypeId === 2) {
                            surgeryItem.AnesthesiaType = 'General';
                        } else {
                            surgeryItem.AnesthesiaType = 'Topical';
                        }
                        if (surgeryItem.SurgeryDoctorId === 0) { surgeryItem.SurgeryDoctorId = ""; }
                        if (surgeryItem.SurgeryAssistantDoctorId === 0) { surgeryItem.SurgeryAssistantDoctorId = ""; }
                        if (surgeryItem.SurgeryAnesthesiaDoctorId === 0) { surgeryItem.SurgeryAnesthesiaDoctorId = ""; }
                        if (surgeryItem.SurgeryDoctorId === 0) { surgeryItem.SurgeryDoctorId = ""; }
                        if (surgeryItem.SurgeryAssistantDoctorId === 0) { surgeryItem.SurgeryAssistantDoctorId = ""; }
                        if (surgeryItem.SurgeryAnesthesiaDoctorId === 0) { surgeryItem.SurgeryAnesthesiaDoctorId = ""; }
                        surgeryItem.ProcedureMaxCost = surgeryItem.SurgeryCost;
                        surgeryItem.SurgeryFinalCost = parseInt(surgeryItem.SurgeryCost) - parseInt(surgeryItem.SurgeryDiscountAmt);
                        var object = {
                            "PatientSurgeryId": surgeryItem.PatientSurgeryId,
                            "ParentPatientSurgeryId": surgeryItem.ParentPatientSurgeryId,
                            "SpecializationId": surgeryItem.SpecializationId,
                            "OrganId": surgeryItem.OrganId ? surgeryItem.OrganId.toString() : "",
                            "OrganName": GetEyeName(surgeryItem.OrganId),
                            "OrgSurgeryId": surgeryItem.OrgSurgeryId,
                            "FullSurgeryName": FullSurgeryName,
                            "SurgeryCategoryName": surgeryItem.SurgeryCategoryName,
                            "SurgeryCategoryId": surgeryItem.SurgeryCategoryId,
                            "SurgeryObject": {
                                "OrgSurgeryId": surgeryItem.OrgSurgeryId,
                                "SurgeryName": surgeryItem.SurgeryName
                            },
                            //"SurgeryData": surgeryItem,
                            "SurgeryBillingObject": {
                                "OrgSurgeryBillingId": surgeryItem.OrgSurgeryBillingId,
                                "SurgeryBillingName": surgeryItem.SurgeryBillingName,
                                "SurgeryCost": surgeryItem.SurgerBillingCost,
                                "OrganizationSurgeryId": surgeryItem.SurgeryId,
                                "SurgeryName": surgeryItem.SurgeryName
                            },
                            "OrgSurgeryBillingId": surgeryItem.OrgSurgeryBillingId,
                            "SurgeryName": surgeryItem.SurgeryName,
                            "SurgeryDoctorId": surgeryItem.SurgeryDoctorId,
                            "SurgeryDoctorName": surgeryItem.SurgeryDoctorName,
                            "SurgeryAnesthesiaDoctorId": surgeryItem.SurgeryAnesthesiaDoctorId,
                            "SurgeryAnesthesiaDoctorName": surgeryItem.SurgeryAnesthesiaDoctorName || "",
                            "SurgeryCounselorId": surgeryItem.SurgeryCounselorId,
                            "SurgeryCounselorName": surgeryItem.SurgeryCounselorName || surgeryItem.SurgeryCounselor || "",
                            "SurgeryInstructions": surgeryItem.SurgeryInstructions,
                            "SurgerySuggestedDate": surgeryItem.SurgerySuggestedDate,
                            "SurgeryStatusId": parseInt(surgeryItem.SurgeryStatusId),
                            "SurgeryStatus": surgeryItem.SurgeryStatusId,
                            "ProcedureMaxCost": surgeryItem.ProcedureMaxCost,
                            "SurgeryFinalCost": surgeryItem.SurgeryFinalCost,
                            "AnesthesiaType": surgeryItem.AnesthesiaType,
                            "AnesthesiaTypeId": surgeryItem.AnesthesiaTypeId,
                            "SurgeryAssistantDoctorId": surgeryItem.SurgeryAssistantDoctorId,
                            "IolPower": surgeryItem.IolPower || "",
                            "ActiveInd": "Y",
                            "SurgeryOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
                        };
                        $scope.cacheStorageItem.SurgeryArray.push(object);
                    });
                }
            }
            //Prescription
            if (plan.Prescription !== undefined) {
                if (plan.Prescription.length !== 0) {
                    plan.Prescription.forEach(function (pre, index) {
                        if (pre.PrescriptionType === "" || pre.PrescriptionType === undefined) {
                            pre.PrescriptionType = "GenericMedicine";
                        }
                        pre.PrescriptionType = pre.PrescriptionType || "GenericMedicine";
                        if (pre.PrescriptionType === "GenericMedicine") {
                            pre.Dosage = pre.Dosage || "";
                            var DurationType = pre.DurationType || "D";
                            var DurationTypeName = pre.DurationType === "D" ? "Day(s)" : (pre.DurationType === "M" ? "Month(s)" : (pre.DurationType === "W" ? "Week(s)" : (pre.DurationType === "C" ? "To Be continued" : (pre.DurationType === "L" ? "Life Time" : "Year(s)"))));
                            var TypeOfDosage = pre.Frequency === "" ? "Default" : "Custom";
                            //var TypeOfDosage = pre.TypeOfDosage;
                            var Dosage1 = "";
                            var Dosage2 = "";
                            var Dosage3 = "";
                            var FrequencyObj;
                            if (TypeOfDosage === "Custom") {
                                if (pre.FrequencyId === 0) {
                                    FrequencyObj = pre.Frequency || "";
                                } else {
                                    FrequencyObj = {
                                        "FrequencyId": pre.FrequencyId || 0,
                                        "Name": pre.Frequency || "",
                                        "Code": pre.PrintNote,
                                        "FrequencyType": 'C'
                                    };
                                }
                            }
                            if (TypeOfDosage === "Default") {
                                Dosage1 = pre.Dosage1;
                                Dosage2 = pre.Dosage2;
                                Dosage3 = pre.Dosage3;
                                FrequencyObj = {
                                    "FrequencyId": pre.FrequencyId,
                                    "Name": pre.Frequency,
                                    "Code": pre.PrintNote,
                                    "FrequencyType": 'D'
                                };
                            }
                            if (pre.Intake === undefined) {
                                pre.Intake = 0;
                            }
                            if (!isString(FrequencyObj)) {
                                FrequencyObj.languages = pre ? pre.languages || [] : [];
                            }

                            var object = {
                                "PrescriptionId": pre.PrescriptionId,
                                "PrescriptionType": "GenericMedicine",
                                "PrescriptionData": {
                                    "PrescriptionHistoryId": pre.PrescriptionHistoryId,
                                    "Id": pre.Id,
                                    "Name": pre.Name,
                                    "Dosage": pre.Dosage,
                                    "TypeOfDosage": TypeOfDosage,
                                    "Dosage1": Dosage1,
                                    "Dosage2": Dosage2,
                                    "Dosage3": Dosage3,
                                    "FrequencyObj": FrequencyObj,
                                    "FrequencyId": pre.FrequencyId,
                                    "Frequency": pre.Frequency,
                                    "FrequencyHindhi": "",
                                    "FrequencyTelugu": "",
                                    "FrequencyMarathi": "",
                                    "FrequencyKannada": "",
                                    "Frequencypanjab": "",
                                    "PrintNote": pre.PrintNote,
                                    "Intake": pre.Intake.toString(),
                                    "Duration": pre.Duration === 0 ? '' : pre.Duration,
                                    "DurationType": DurationType,
                                    "DurationTypeName": DurationTypeName,
                                    "MedicineType": pre.MedicineType,
                                    "OrganId": pre.OrganId,
                                    "OrganName": GetEyeName(pre.OrganId),
                                    "ActiveInd": "Y",
                                    "Instructions": pre.Instructions,
                                    "InstructionsLanguage": pre.InstructionsLanguage || [],
                                    "ShowInstruction": false,
                                    "ModifiedBy": pre.ModifiedBy,
                                    "ModifiedDt": pre.ModifiedDt,
                                    "TaperingArray": pre.TaperingArray || []
                                }


                            };

                            if (!isString(FrequencyObj)) {
                                var hindhiobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'hi' })[0];
                                object.PrescriptionData.FrequencyHindhi = hindhiobj ? hindhiobj.translateName : '';
                                var englishobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'en' })[0];
                                object.PrescriptionData.FrequencyEnglish = englishobj ? englishobj.translateName : '';
                                englishobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'te' })[0];
                                object.PrescriptionData.FrequencyTelugu = englishobj ? englishobj.translateName : '';

                                var martiobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'mr' })[0];
                                object.PrescriptionData.FrequencyMarathi = martiobj ? martiobj.translateName : '';

                                var kannadaobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'kn' })[0];
                                object.PrescriptionData.FrequencyKannada = kannadaobj ? kannadaobj.translateName : '';

                                var panjabobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'pa' })[0];
                                object.PrescriptionData.Frequencypanjab = panjabobj ? panjabobj.translateName : '';
                                var tamilobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'ta' })[0];
                                object.PrescriptionData.FrequencyTamil = tamilobj ? tamilobj.translateName : '';
                            }


                            $scope.cacheStorageItem.Prescriptions.push(object);
                        }
                        else {
                            if (pre.TaperingArray.length > 0) {
                                angular.forEach(pre.TaperingArray, function (mitem) {
                                    mitem.ActiveInd = "Y";
                                    mitem.DurationTypeName = mitem.DurationType === "D" ? "Day(s)" : (mitem.DurationType === "M" ? "Month(s)" : (mitem.DurationType === "W" ? "Week(s)" : (pre.DurationType === "C" ? "To Be continued" : (mitem.DurationType === "L" ? "Life Time" : "Year(s)"))));
                                });
                            }
                            var object = {
                                "PrescriptionId": pre.PrescriptionId,
                                "PrescriptionType": pre.PrescriptionType,
                                "PrescriptionData": {
                                    "PrescriptionHistoryId": pre.PrescriptionHistoryId,
                                    "Id": pre.Id,
                                    "Name": pre.Name,
                                    "OrganId": pre.OrganId,
                                    "OrganName": GetEyeName(pre.OrganId),
                                    "TaperingArray": pre.TaperingArray || [],
                                    "ActiveInd": "Y"
                                }
                            }
                            $scope.cacheStorageItem.Prescriptions.push(object);
                        }
                    });
                    $scope.cacheStorageItem.TempPrescriptions = $scope.cacheStorageItem.Prescriptions;
                }
            }
            //PrescriptionMedNotes
            if (plan.PrescriptionNotes !== undefined) {
                if (plan.PrescriptionNotes.length !== 0) {
                    $scope.cacheStorageItem.PrescriptionMedNotes = plan.PrescriptionNotes[0].Notes;
                }
            }
            //GlassPrescription
            if (plan.GlassPrescription !== undefined) {
                if (plan.GlassPrescription.length !== 0) {
                    $scope.cacheStorageItem.GlassPrescription = [{
                        "GlassPrescriptionId": plan.GlassPrescription[0].GlassPrescriptionId,
                        "GlassDetailsData": {
                            "GlassPrescriptionHistoryId": plan.GlassPrescription[0].GlassPrescriptionHistoryId,
                            "GlassPrescriptionId": plan.GlassPrescription[0].GlassPrescriptionId,
                            "GlassDetails": {
                                "NewGlassArray": plan.GlassPrescription[0].GlassDetails.NewGlassArray,
                                "OldGlassArray": plan.GlassPrescription[0].GlassDetails.OldGlassArray
                            },
                            "ActiveInd": "Y"
                        }
                    }];
                    var count = 0;
                    angular.forEach(plan.GlassPrescription[0].GlassDetails.OldGlassArray[0], function (value, key) {
                        if (value !== "") {
                            count++;
                        }
                    });
                    if (count > 1) {
                        $scope.cacheStorageItem.chkOldglass = true;
                    }
                }
            }
            if (plan.InvestigationDetails && angular.isArray(plan.InvestigationDetails.Findings)) {
                if (plan.InvestigationDetails.Findings.length > 0) {
                    $scope.cacheStorageItem.InvestigationDetails = [];
                    plan.InvestigationDetails.Findings.forEach(function (item, index) {
                        if (item.CategoryID === 1) {//Visions
                            $scope.tempvisions = [];
                            item.CategoryConditions.forEach(function (item1, index1) {
                                if (item1.InvestigationId === 1) {
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


                                if (item1.InvestigationId === 4) {
                                    if (checkval(item1.Attributes.NearVision.LeftEye) || checkval(item1.Attributes.NearVision.RightEye) || checkval(item1.Attributes.NearVision.Both) || checkval(item1.Attributes.distanceVision.LeftEye) || checkval(item1.Attributes.distanceVision.RightEye) || checkval(item1.Attributes.distanceVision.Both)) {
                                        for (var key in item1) {
                                            if (item1[key] === null) {
                                                delete item1[key];
                                            }
                                        }
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 5) {
                                    if (item1.Attributes) {
                                        if (item1.Attributes.NearVision.LeftEye !== "" || item1.Attributes.NearVision.RightEye !== "" || item1.Attributes.NearVision.Both !== "" || item1.Attributes.distanceVision.LeftEye !== "" || item1.Attributes.distanceVision.RightEye !== "" || item1.Attributes.distanceVision.Both !== "") {
                                            $scope.tempvisions.push(item1);
                                        }
                                    }
                                }
                                if (item1.InvestigationId === 2071) {//Aided(CL)
                                    if (item1.Attributes) {
                                        if (item1.Attributes.NearVision.LeftEye !== "" || item1.Attributes.NearVision.RightEye !== "" || item1.Attributes.NearVision.Both !== "" || item1.Attributes.distanceVision.LeftEye !== "" || item1.Attributes.distanceVision.RightEye !== "" || item1.Attributes.distanceVision.Both !== "") {
                                            $scope.tempvisions.push(item1);
                                        }
                                    }
                                }
                                if (item1.InvestigationId === 2072) {    //Stereopsis                              
                                    if (item1.Value !== "") {
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 2073) {         //miscellaneaous                         
                                    if (item1.Value !== "") {
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 2074) {
                                    $scope.tempInvestigationOrgans = [];
                                    angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
                                        if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Angle1 !== "" || item2.InvestigationAttributes.Angle2 !== "" || item2.InvestigationAttributes.Angle3 !== "" || item2.InvestigationAttributes.Angle4 !== "" || item2.InvestigationAttributes.NotedBy !== "" || item2.InvestigationAttributes.SelectDrops !== "" || item2.InvestigationAttributes.SelectDropsId !== "" || item2.InvestigationAttributes.RefractionType !== "" || item2.InvestigationAttributes.RefractionTypeId !== "") {
                                            $scope.tempInvestigationOrgans.push(item2);

                                        }
                                    });
                                    if ($scope.tempInvestigationOrgans.length !== 0) {
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 13) {
                                    if (item1.Attributes.RightEye !== "" || item1.Attributes.LeftEye !== "") {
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 2076) {
                                    if (item1.Attributes.RightEye !== "" || item1.Attributes.LeftEye !== "") {
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 2077) {
                                    if (item1.Attributes.RightEye !== "" || item1.Attributes.LeftEye !== "") {
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                                //if (item1.InvestigationId === 2 || item1.InvestigationId === 3) {
                                //    $scope.tempInvestigationOrgans = [];
                                //    angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
                                //        if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "" || item2.InvestigationAttributes.IPD !== "" || item2.InvestigationAttributes.PH !== "" || item2.InvestigationAttributes.UCVA !== "" || item2.InvestigationAttributes.BCVA !== "") {
                                //            $scope.tempInvestigationOrgans.push(item2);
                                //        }
                                //    });
                                //    if ($scope.tempInvestigationOrgans.length !== 0) {
                                //        $scope.tempvisions.push(item1);
                                //    }
                                //}
                                if (item1.InvestigationId === 2) {//refraction & cyclorefraction
                                    $scope.tempInvestigationOrgans = [];
                                    angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
                                        if (item2.InvestigationAttributes.UCVA !== "" || item2.InvestigationAttributes.BCVA !== "" || item2.InvestigationAttributes.BCNVA !== "" || item2.InvestigationAttributes.PH !== "" || item2.InvestigationAttributes.IPD !== "" || item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "") {
                                            if (item2.ISbinaclurDone === undefined) {
                                                item2.ISbinaclurDone = false;
                                            }
                                            $scope.tempInvestigationOrgans.push(item2);

                                        }
                                    });
                                    if ($scope.tempInvestigationOrgans.length !== 0 || item1.Remarks !== "") {
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 3) {//refraction & cyclorefraction
                                    $scope.tempInvestigationOrgans = [];
                                    angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
                                        if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "" || item2.InvestigationAttributes.BCVA !== "") {
                                            if (item2.SolutionUsed === undefined) {
                                                item2.SolutionUsed = "";
                                            }
                                            $scope.tempInvestigationOrgans.push(item2);
                                        }
                                    });
                                    if ($scope.tempInvestigationOrgans.length !== 0 || item1.CRemarks !== "") {
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 11) {
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
                                if (item1.InvestigationId === 7 || item1.InvestigationId === 6 || item1.InvestigationId === 10) {
                                    $scope.tempInvestigationOrgans = [];
                                    angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
                                        if (item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "") {
                                            $scope.tempInvestigationOrgans.push(item2);
                                            if (item1.InvestigationId === 5) {
                                                if ($scope.cacheStorageItem.chkAcceptance) {
                                                    if (item2.InvestigationOrganID === 1) {
                                                        $scope.cacheStorageItem.GlassPrescription[0].GlassDetailsData.GlassDetails.NewGlassArray[0].RSphere = item2.InvestigationAttributes.Spherical;
                                                        $scope.cacheStorageItem.GlassPrescription[0].GlassDetailsData.GlassDetails.NewGlassArray[0].RCylinder = item2.InvestigationAttributes.Cylindrical;
                                                        $scope.cacheStorageItem.GlassPrescription[0].GlassDetailsData.GlassDetails.NewGlassArray[0].RAxis = item2.InvestigationAttributes.Axis;
                                                        $scope.cacheStorageItem.GlassPrescription[0].GlassDetailsData.GlassDetails.NewGlassArray[0].RAdd = item2.InvestigationAttributes.Adition;
                                                    }
                                                    if (item2.InvestigationOrganID === 2) {
                                                        $scope.cacheStorageItem.GlassPrescription[0].GlassDetailsData.GlassDetails.NewGlassArray[0].LSphere = item2.InvestigationAttributes.Spherical;
                                                        $scope.cacheStorageItem.GlassPrescription[0].GlassDetailsData.GlassDetails.NewGlassArray[0].LCylinder = item2.InvestigationAttributes.Cylindrical;
                                                        $scope.cacheStorageItem.GlassPrescription[0].GlassDetailsData.GlassDetails.NewGlassArray[0].LAxis = item2.InvestigationAttributes.Axis;
                                                        $scope.cacheStorageItem.GlassPrescription[0].GlassDetailsData.GlassDetails.NewGlassArray[0].LAdd = item2.InvestigationAttributes.Adition;
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    if ($scope.tempInvestigationOrgans.length !== 0) {
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                                //if (item1.InvestigationId === 2071) {
                                //    if (item1.Attributes) {
                                //        if (checkval(item1.Attributes.NearVision.LeftEye) || checkval(item1.Attributes.NearVision.RightEye) || checkval(item1.Attributes.NearVision.Both) || checkval(item1.Attributes.distanceVision.LeftEye) || checkval(item1.Attributes.distanceVision.RightEye) || checkval(item1.Attributes.distanceVision.Both)) {
                                //            $scope.tempvisions.push(item1);
                                //        }
                                //    }
                                //}
                                //if (item1.InvestigationId === 2072) {
                                //    if (item1.Value !== "") {
                                //        $scope.tempvisions.push(item1);
                                //    }
                                //}
                                //if (item1.InvestigationId === 2073) {
                                //    if (item1.Value !== "") {
                                //        $scope.tempvisions.push(item1);
                                //    }
                                //}

                                if (item1.InvestigationId === 9) {
                                    if (checkval(item1.Attributes.NearVision.LeftEye) || checkval(item1.Attributes.NearVision.RightEye) || checkval(item1.Attributes.NearVision.Both) || checkval(item1.Attributes.distanceVision.LeftEye) || checkval(item1.Attributes.distanceVision.RightEye) || checkval(item1.Attributes.distanceVision.Both)) {
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 8) {
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
                                if (item1.InvestigationId === 12) {
                                    if (item1.Remarks !== undefined && item1.Remarks !== "") {
                                        item1.Remarks = DeCodeFilter(item1.Remarks);
                                    }
                                    if (item1.Value !== "") {
                                        $scope.tempvisions.push(item1);
                                    }
                                }

                                if (item1.InvestigationId === 2088) {//Post Mydriatic Test
                                    $scope.tempInvestigationOrgans = [];
                                    angular.forEach(item1.InvestigationOrgans, function (item2, ind2) {
                                        if (item2.InvestigationAttributes.BCVA !== "" || item2.InvestigationAttributes.BCNVA !== "" || item2.InvestigationAttributes.Cylindrical !== "" || item2.InvestigationAttributes.Spherical !== "" || item2.InvestigationAttributes.Axis !== "" || item2.InvestigationAttributes.Adition !== "") {
                                            $scope.tempInvestigationOrgans.push(item2);

                                        }
                                    });
                                    if ($scope.tempInvestigationOrgans.length !== 0 || item1.Remarks !== "") {
                                        $scope.tempvisions.push(item1);
                                    }
                                }
                            });
                            if ($scope.tempvisions.length !== 0) {
                                object = {
                                    "RowID": count++,
                                    "CategoryID": 1,
                                    "CategoryDesc": "Vision",
                                    "CategoryConditions": $scope.tempvisions
                                };
                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }
                        }
                        if (item.CategoryID === 2) {
                            $scope.Tempcolorvisions = [];
                            item.CategoryConditions.forEach(function (item1, index1) {
                                if (item1.InvestigationNote !== undefined && item1.InvestigationNote !== "") {
                                    item1.InvestigationNote = DeCodeFilter(item1.InvestigationNote);
                                }
                                if (item1.LeftEyeInvestigationNote !== undefined && item1.LeftEyeInvestigationNote !== "") {
                                    item1.LeftEyeInvestigationNote = DeCodeFilter(item1.LeftEyeInvestigationNote);
                                }
                                if (item1.InvestigationNote !== "" || (item1.LeftEyeInvestigationNote !== "" && item1.InvestigationId === 14)) {
                                    $scope.Tempcolorvisions.push(item1);
                                }
                            });
                            if ($scope.Tempcolorvisions.length !== 0) {
                                object = {
                                    "RowID": count++,
                                    "CategoryID": 2,
                                    "CategoryDesc": "Colour Vision Test",
                                    "CategoryConditions": $scope.Tempcolorvisions
                                };
                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }
                        }
                        //if (item.CategoryID === 3) {
                        //    object = {
                        //        "RowID": count++,
                        //        "CategoryID": 3,
                        //        "CategoryDesc": "Ocular Motility",
                        //        "CategoryConditions": []
                        //    };
                        //    $scope.TempRighteyePositionValues = [];
                        //    $scope.TempLefteyePositionValues = [];
                        //    item.CategoryConditions.forEach(function (item1, index1) {
                        //        if (item1.Notes !== undefined && item1.Notes !== "") {
                        //            item1.Notes = DeCodeFilter(item1.Notes);
                        //        }
                        //        $scope.TempRighteyePositionValues = [];
                        //        if (item1.InvestigationAttributeID === 1) {
                        //            angular.forEach(item1.OcularPositionValues, function (item2, ind2) {
                        //                $scope.TempRighteyePositionValues.push(item2);
                        //            });
                        //            if ($scope.TempRighteyePositionValues.length !== 0 || item1.Notes !== "") {
                        //                var RightEyeObject = {
                        //                    "RowID": 1,
                        //                    "InvestigationAttributeID": 1,
                        //                    "InvestigationAttributeDesc": "RightEye",
                        //                    "Notes": item1.Notes,
                        //                    "OcularPositionValues": $scope.TempRighteyePositionValues
                        //                };
                        //                object.CategoryConditions.push(RightEyeObject);
                        //            }
                        //        }
                        //        $scope.TempLefteyePositionValues = [];
                        //        if (item1.InvestigationAttributeID === 2) {
                        //            angular.forEach(item1.OcularPositionValues, function (item2, ind2) {
                        //                $scope.TempLefteyePositionValues.push(item2);
                        //            });
                        //            if ($scope.TempLefteyePositionValues.length !== 0 || item1.Notes !== "") {
                        //                var LeftEyeObject = {
                        //                    "RowID": 2,
                        //                    "InvestigationAttributeID": 2,
                        //                    "InvestigationAttributeDesc": "LeftEye",
                        //                    "Notes": item1.Notes,
                        //                    "OcularPositionValues": $scope.TempLefteyePositionValues
                        //                };
                        //                object.CategoryConditions.push(LeftEyeObject);
                        //            }
                        //        }
                        //    });
                        //    if (object.CategoryConditions.length !== 0) {
                        //        $scope.cacheStorageItem.InvestigationDetails.push(object);
                        //    }
                        //}


                        if (item.CategoryID === 3) {

                            $scope.tempOcularMotility = [];
                            angular.forEach(item.CategoryConditions, function (item1, ind1) {
                                if (item1.InvestigationId === 18) {
                                    if (checkval(item1.InvestigationOrgans)) {
                                        $scope.tempOcularMotility.push(item1);
                                    }
                                }

                                if (item1.InvestigationId === 696) {
                                    if (item1.InvestigationNote !== "") {
                                        $scope.tempOcularMotility.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 697) {
                                    if (!($scope.isObjectEmpty(item1.InvestigationOrgans[0].CornealReflexType))) {
                                        if (item1.InvestigationOrgans[0].CornealReflexType.Id === null && item1.InvestigationOrgans[0].CornealReflexType.Id === 0) {
                                            item1.InvestigationOrgans[0].CornealReflexType = {};
                                        }
                                    }
                                    if (!($scope.isObjectEmpty(item1.InvestigationOrgans[1].CornealReflexType))) {
                                        if (item1.InvestigationOrgans[1].CornealReflexType.Id === null && item1.InvestigationOrgans[1].CornealReflexType.Id === 0) {
                                            item1.InvestigationOrgans[1].CornealReflexType = {};
                                        }
                                    }

                                    if (item1.InvestigationOrgans[0].CornealReflexDegreeValue === "" && item1.InvestigationOrgans[0].CornealReflexDegreeValue === undefined) {
                                        item1.InvestigationOrgans[0].CornealReflexDegreeValue = "";
                                    }

                                    if (item1.InvestigationOrgans[1].CornealReflexDegreeValue === "" && item1.InvestigationOrgans[1].CornealReflexDegreeValue === undefined) {
                                        item1.InvestigationOrgans[1].CornealReflexDegreeValuee = "";
                                    }


                                    if (!($scope.isObjectEmpty(item1.InvestigationOrgans[0].CornealReflexType))) {
                                        if (item1.InvestigationOrgans[0].CornealReflexType.Id === 6) {
                                            item1.InvestigationOrgans[0].CornealReflexDegreeValue = item1.InvestigationOrgans[0].CornealReflexType.Value;
                                            item1.InvestigationOrgans[0].CornealReflexType = {};
                                        }
                                    }
                                    if (!($scope.isObjectEmpty(item1.InvestigationOrgans[1].CornealReflexType))) {
                                        if (item1.InvestigationOrgans[1].CornealReflexType.Id === 6) {
                                            item1.InvestigationOrgans[1].CornealReflexDegreeValue = item1.InvestigationOrgans[1].CornealReflexType.Value;
                                            item1.InvestigationOrgans[1].CornealReflexType = {};
                                        }
                                    }

                                    if (!($scope.isObjectEmpty(item1.InvestigationOrgans[0].CornealReflexType)) || !($scope.isObjectEmpty(item1.InvestigationOrgans[1].CornealReflexType)) || item1.InvestigationOrgans[0].CornealReflexDegreeValue != "" || item1.InvestigationOrgans[1].CornealReflexDegreeValue != "") {
                                        $scope.tempOcularMotility.push(item1);
                                    }

                                }
                                if (item1.InvestigationId === 698) {
                                    if (item1.InvestigationNote !== "") {
                                        $scope.tempOcularMotility.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 695) {
                                    if (checkval(item1.InvestigationOrgans)) {
                                        $scope.tempOcularMotility.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 699) {
                                    if (item1.InvestigationNote !== "") {
                                        $scope.tempOcularMotility.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 700) {
                                    if (item1.InvestigationNote !== "") {
                                        $scope.tempOcularMotility.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 701) {
                                    if (item1.InvestigationNote !== "") {
                                        $scope.tempOcularMotility.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 2095) {
                                    if (item1.FacialSymmetryNote !== "" || item1.ExternalFaceNote !== "" || item1.OcularPositionNote !== "" || item1.OcularAlignmentNote !== "") {
                                        $scope.tempOcularMotility.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 2096) {
                                    if (item1.FixationPreferenceValue !== "" || item1.AlphabetPatternValue !== "" || item1.OtherFindingsNotes !== "" || item1.AlternateCovertestDistanceArray.length !== 0 || item1.AlternateCovertestNearArray.length !== 0 || item1.HCRTLeftValueArray.length !== 0 || item1.HCRTRightValueArray.length !== 0 || item1.TypeOfSquintRightEyeArray.length !== 0 || item1.TypeOfSquintLeftEyeArray.length !== 0 || item1.OcularMovementsobj.RightEyeValue1 !== "" || item1.OcularMovementsobj.RightEyeValue2 !== "" || item1.OcularMovementsobj.RightEyeValue3 !== "" || item1.OcularMovementsobj.RightEyeValue4 !== "" || item1.OcularMovementsobj.RightEyeValue5 !== "" || item1.OcularMovementsobj.RightEyeValue6 !== "" || item1.OcularMovementsobj.RightEyeValue7 !== "" || item1.OcularMovementsobj.RightEyeValue8 !== "" || item1.OcularMovementsobj.LeftEyeValue1 !== "" || item1.OcularMovementsobj.LeftEyeValue2 !== "" || item1.OcularMovementsobj.LeftEyeValue3 !== "" || item1.OcularMovementsobj.LeftEyeValue4 !== "" || item1.OcularMovementsobj.LeftEyeValue5 !== "" || item1.OcularMovementsobj.LeftEyeValue6 !== "" || item1.OcularMovementsobj.LeftEyeValue7 !== "" || item1.OcularMovementsobj.LeftEyeValue8 !== "" || item1.HeadPostureobj.LeftFaceTurn !== "" || item1.HeadPostureobj.LeftFaceTurnvalue !== "" || item1.HeadPostureobj.LeftHeadTilt !== "" || item1.HeadPostureobj.LeftHeadTiltvalue !== "" || item1.HeadPostureobj.RightChinDepression !== "" || item1.HeadPostureobj.RightChinDepressionvalue !== "" || item1.HeadPostureobj.RightChinElevation !== "" || item1.HeadPostureobj.RightChinElevationvalue !== "" || item1.HeadPostureobj.RightFaceTurn !== "" || item1.HeadPostureobj.RightFaceTurnvalue !== "" || item1.HeadPostureobj.RightHeadTilt !== "" || item1.HeadPostureobj.RightHeadTiltvalue !== "" || item1.Ductionsobj.LimitationRightEye.length !== 0 || item1.Ductionsobj.LimitationLeftEye.length !== 0) {
                                        $scope.tempOcularMotility.push(item1);
                                    }
                                }
                            });
                            if ($scope.tempOcularMotility.length !== 0) {
                                object = {
                                    "RowID": count++,
                                    "CategoryID": 3,
                                    "CategoryDesc": "Squint",
                                    "CategoryConditions": $scope.tempOcularMotility
                                };
                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }

                        }

                        if (item.CategoryID === 4) {
                            $scope.TempTonoMetry = [];
                            item.CategoryConditions.forEach(function (item1, index1) {
                                if (item1.BeforeDilation || item1.AfterDilation) {
                                    if (item1.BeforeDilation === null) {
                                        var obj =
                                        {
                                            "RightEye": "",
                                            "LeftEye": "",
                                            "Time": ""
                                        }
                                        item1.BeforeDilation = obj;
                                    }
                                    if (item1.AfterDilation === null) {
                                        var obj =
                                        {
                                            "RightEye": "",
                                            "LeftEye": "",
                                            "Time": ""
                                        }
                                        item1.AfterDilation = obj;
                                    }
                                    if (item1.BeforeDilation.RightEye !== "" || item1.BeforeDilation.LeftEye !== "" || item1.AfterDilation.RightEye !== "" || item1.AfterDilation.LeftEye !== "") {
                                        $scope.TempTonoMetry.push(item1);
                                    }

                                } else {
                                    if (item1.BeforeDilationValue !== "" || item1.AfterDilationValue !== "") {
                                        $scope.TempTonoMetry.push(item1);
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
                        if (item.CategoryID === 5) {
                            $scope.cacheStorageItem.IsAnteriorCheckedAll = item.IsCheckAll;
                            $scope.cacheStorageItem.IsAnteriorRightEyeCheckAll = item.IsRightEyeCheckAll;
                            $scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll = item.IsLeftEyeCheckAll;
                            object = {
                                "RowID": count++,
                                "CategoryID": 5,
                                "CategoryDesc": "Anterior Segment",
                                "CategoryConditions": [],
                                "Remarks": item.Remarks,
                                "IsCheckAll": item.IsCheckAll,
                                "IsRightEyeCheckAll": item.IsRightEyeCheckAll,
                                "IsLeftEyeCheckAll": item.IsLeftEyeCheckAll
                            };
                            // $scope.cacheStorageItem.InvestigationDetails.push(object);
                            item.CategoryConditions.forEach(function (item1, index1) {

                                item1.RightEyeRemarks = item1.RightEyeRemarks || "";
                                item1.LeftEyeRemarks = item1.LeftEyeRemarks || "";


                                if (item1.RightEyeRemarks !== "") {
                                    item1.RightEyeRemarks = DeCodeFilter(item1.RightEyeRemarks);
                                }
                                if (item1.LeftEyeRemarks !== "") {
                                    item1.LeftEyeRemarks = DeCodeFilter(item1.LeftEyeRemarks);
                                }


                                item1.RightEyeArray = item1.RightEyeArray || [];
                                item1.LeftEyeArray = item1.LeftEyeArray || [];
                                item1.LeftEyeRemarksArray = item1.LeftEyeRemarksArray || [];
                                item1.RightEyeRemarksArray = item1.RightEyeRemarksArray || [];

                                item1.SelectedRightEyeRemarksObj = { "FindingValue": item1.RightEyeRemarks, "InvFindingId": 0 };
                                item1.SelectedLeftEyeRemarksObj = { "FindingValue": item1.LeftEyeRemarks, "InvFindingId": 0 };

                                if ((item1.RightEyeArray && item1.RightEyeArray.length !== 0)
                                    || (item1.RightEyeRemarksArray && item1.RightEyeRemarksArray.length !== 0) ||
                                    (item1.LeftEyeRemarksArray && item1.LeftEyeRemarksArray.length !== 0) || (item1.LeftEyeArray && item1.LeftEyeArray.length !== 0) || item1.RightEyeRemarks !== "" || item1.RightEyeRemarks !== "0" || item1.LeftEyeRemarks !== "" || item1.LeftEyeRemarks !== "0" || item1.RightEyeCdRatio !== "" || item1.LeftEyeCdRatio !== "" || item1.RightEyeFreq !== "" || item1.LeftEyeFreq !== "" || item1.IsNormalR || item1.IsNormalL) {
                                    item1.IsSelected = 'Y';
                                    object.CategoryConditions.push(item1);
                                }
                            });
                            if (object.CategoryConditions.length !== 0 || item.Remarks !== "") {
                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }
                        }
                        if (item.CategoryID === 6) {
                            $scope.cacheStorageItem.IsPosteriorCheckedAll = item.IsCheckAll;
                            $scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll = item.IsRightEyeCheckAll;
                            $scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll = item.IsLeftEyeCheckAll;
                            object = {
                                "RowID": count++,
                                "CategoryID": 6,
                                "CategoryDesc": "Posterior Segment",
                                "CategoryConditions": [],
                                "Remarks": item.Remarks,
                                "IsCheckAll": item.IsCheckAll,
                                "IsRightEyeCheckAll": item.IsRightEyeCheckAll,
                                "IsLeftEyeCheckAll": item.IsLeftEyeCheckAll
                            };
                            // $scope.cacheStorageItem.InvestigationDetails.push(object);

                            item.CategoryConditions.forEach(function (item1, index1) {

                                item1.RightEyeRemarks = item1.RightEyeRemarks || "";
                                item1.LeftEyeRemarks = item1.LeftEyeRemarks || "";


                                if (item1.RightEyeRemarks !== "") {
                                    item1.RightEyeRemarks = DeCodeFilter(item1.RightEyeRemarks);
                                }
                                if (item1.LeftEyeRemarks !== "") {
                                    item1.LeftEyeRemarks = DeCodeFilter(item1.LeftEyeRemarks);
                                }


                                item1.RightEyeArray = item1.RightEyeArray || [];
                                item1.LeftEyeArray = item1.LeftEyeArray || [];
                                item1.LeftEyeRemarksArray = item1.LeftEyeRemarksArray || [];
                                item1.RightEyeRemarksArray = item1.RightEyeRemarksArray || [];


                                item1.SelectedRightEyeRemarksObj = { "FindingValue": item1.RightEyeRemarks, "InvFindingId": 0 };
                                item1.SelectedLeftEyeRemarksObj = { "FindingValue": item1.LeftEyeRemarks, "InvFindingId": 0 };

                                if (item1.RightEyeArray.length !== 0 || item1.RightEyeRemarksArray.length !== 0 || item1.LeftEyeRemarksArray.length !== 0 || item1.LeftEyeArray.length !== 0 || item1.RightEyeRemarks !== "" || item1.RightEyeRemarks !== "0" || item1.LeftEyeRemarks !== "" || item1.LeftEyeRemarks !== "0" || item1.RightEyeCdRatio !== "" || item1.LeftEyeCdRatio !== "" || item1.RightEyeFreq !== "" || item1.LeftEyeFreq !== "" || item1.IsNormalR || item1.IsNormalL) {
                                    item1.IsSelected = 'Y';
                                    object.CategoryConditions.push(item1);
                                }
                            });
                            if (object.CategoryConditions.length !== 0 || item.Remarks !== "") {
                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }
                        }
                        if (item.CategoryID !== 1 && item.CategoryID !== 2 && item.CategoryID !== 3 && item.CategoryID !== 4 && item.CategoryID !== 5 && item.CategoryID !== 6 && item.CategoryID !== 7 && item.CategoryID !== 256 && item.CategoryID !== 298 && item.CategoryID !== 299) {

                            object = {
                                "RowID": count++,
                                "CategoryID": item.CategoryID,
                                "CategoryDesc": item.CategoryDesc,
                                "CategoryConditions": []
                            };

                            item.CategoryConditions.forEach(function (item1, index1) {

                                item1.RightEyeRemarks = item1.RightEyeRemarks || "";
                                item1.LeftEyeRemarks = item1.LeftEyeRemarks || "";



                                if (item1.RightEyeRemarks !== "") {
                                    item1.RightEyeRemarks = DeCodeFilter(item1.RightEyeRemarks);
                                }
                                if (item1.LeftEyeRemarks !== "") {
                                    item1.LeftEyeRemarks = DeCodeFilter(item1.LeftEyeRemarks);
                                }

                                item1.RightEyeArray = item1.RightEyeArray || [];
                                item1.LeftEyeArray = item1.LeftEyeArray || [];

                                item1.SelectedRightEyeRemarksObj = { "FindingValue": item1.RightEyeRemarks, "InvFindingId": 0 };
                                item1.SelectedLeftEyeRemarksObj = { "FindingValue": item1.LeftEyeRemarks, "InvFindingId": 0 };


                                if (item1.RightEyeArray.length !== 0 || item1.LeftEyeArray.length !== 0 || item1.RightEyeRemarks !== "" || item1.LeftEyeRemarks !== "" || item1.RightEyeCdRatio !== "" || item1.LeftEyeCdRatio !== "" || item1.RightEyeFreq !== "" || item1.LeftEyeFreq !== "" || item1.IsNormalR || item1.IsNormalL) {
                                    item1.IsSelected = "Y";
                                    object.CategoryConditions.push(item1);
                                }
                            });
                            if (object.CategoryConditions.length !== 0) {
                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }

                        }
                        if (item.CategoryID === 7) {
                            $scope.tempInvGlasses = [];
                            item.CategoryConditions.forEach(function (item1) {

                                if (item1.InvestigationId === 43) {
                                    var selectedarray = $filter("filter")(item1.LensType, { "IsActive": true }, true) || [];
                                    var selectedCoatarray = $filter("filter")(item1.LensCoating, { "IsActive": true }, true) || [];
                                    if (checkval(item1.Attributes.RSphere) || checkval(item1.Attributes.RCylinder) || checkval(item1.Attributes.RAxis) || checkval(item1.Attributes.RPrism) || checkval(item1.Attributes.RVa) || checkval(item1.Attributes.RAdd || checkval(item1.Attributes.RUVa))
                                        || checkval(item1.Attributes.RBcva) || checkval(item1.Attributes.RIPD) || checkval(item1.Attributes.RBase) || checkval(item1.Attributes.LSphere) || checkval(item1.Attributes.LCylinder) || checkval(item1.Attributes.LAxis)
                                        || checkval(item1.Attributes.LPrism) || checkval(item1.Attributes.LVa) || checkval(item1.Attributes.LAdd) || checkval(item1.Attributes.LBcva) || checkval(item1.Attributes.LIPD) || checkval(item1.Attributes.LBase) || checkval(item1.Attributes.LUVa || selectedarray.length > 0 || selectedCoatarray.length > 0 || item1.Remarks !== "" || item1.IPD != "")) {
                                        $scope.tempInvGlasses.push(item1);
                                    }



                                    // $scope.tempInvGlasses.push(item1);
                                }
                                if (item1.InvestigationId === 44) {
                                    var selectedarray = $filter("filter")(item1.LensType, { "IsActive": true }, true) || [];
                                    var selectedCoatarray = $filter("filter")(item1.LensCoating, { "IsActive": true }, true) || [];

                                    if (checkval(item1.Attributes.RSphere) || checkval(item1.Attributes.RCylinder) || checkval(item1.Attributes.RAxis) || checkval(item1.Attributes.RPrism) || checkval(item1.Attributes.RVa) || checkval(item1.Attributes.RAdd) || checkval(item1.Attributes.RUVa)
                                        || checkval(item1.Attributes.RBcva) || checkval(item1.Attributes.RBase) || checkval(item1.Attributes.LSphere) || checkval(item1.Attributes.LCylinder) || checkval(item1.Attributes.LAxis)
                                        || checkval(item1.Attributes.LPrism) || checkval(item1.Attributes.LVa) || checkval(item1.Attributes.LAdd) || checkval(item1.Attributes.LBcva) || checkval(item1.Attributes.LBase)
                                        || checkval(item1.Attributes.LUVa || selectedarray.length > 0 || selectedCoatarray.length > 0 || item1.Remarks !== "")) {
                                        $scope.tempInvGlasses.push(item1);
                                    }
                                    // $scope.tempInvGlasses.push(item1);
                                }

                            });
                            if ($scope.tempInvGlasses.length !== 0) {
                                object = {
                                    "RowID": count++,
                                    "CategoryID": 7,
                                    "CategoryDesc": "GlassPrescription",
                                    "CategoryConditions": $scope.tempInvGlasses
                                };
                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }
                        }

                        if (item.CategoryID === 256) {
                            $scope.TempGonioscopy = [];
                            item.CategoryConditions.forEach(function (item1, index1) {
                                if (item1.InvestigationId === 1902) {

                                    if (item1.RightEyeRemarks !== undefined && item1.RightEyeRemarks !== "") {
                                        item1.RightEyeRemarks = DeCodeFilter(item1.RightEyeRemarks);
                                    }
                                    if (item1.LeftEyeRemarks !== undefined && item1.LeftEyeRemarks !== "") {
                                        item1.LeftEyeRemarks = DeCodeFilter(item1.LeftEyeRemarks);
                                    }
                                    if (item1.RightEyeRemarks !== "" || item1.LeftEyeInvestigationNote !== ""
                                        || item1.RightEye.RightValue !== "" || item1.RightEye.LeftValue !== "" || item1.RightEye.TopValue !== "" || item1.RightEye.BottomValue !== ""
                                        || item1.LeftEye.RightValue !== "" || item1.LeftEye.LeftValue !== "" || item1.LeftEye.TopValue !== "" || item1.LeftEye.BottomValue !== ""
                                        //&& item1.InvestigationId === 1902)
                                    ) {
                                        $scope.TempGonioscopy.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 1978 || item1.InvestigationId === 1979 || item1.InvestigationId === 1980 || item1.InvestigationId === 1981 || item1.InvestigationId === 1982 || item1.InvestigationId === 1983 || item1.InvestigationId === 1984) {
                                    item1.RightEyeRemarks = item1.RightEyeRemarks || "";
                                    item1.LeftEyeRemarks = item1.LeftEyeRemarks || "";



                                    if (item1.RightEyeRemarks !== "") {
                                        item1.RightEyeRemarks = DeCodeFilter(item1.RightEyeRemarks);
                                    }
                                    if (item1.LeftEyeRemarks !== "") {
                                        item1.LeftEyeRemarks = DeCodeFilter(item1.LeftEyeRemarks);
                                    }

                                    item1.RightEyeArray = item1.RightEyeArray || [];
                                    item1.LeftEyeArray = item1.LeftEyeArray || [];

                                    item1.SelectedRightEyeRemarksObj = { "FindingValue": item1.RightEyeRemarks, "InvFindingId": 0 };
                                    item1.SelectedLeftEyeRemarksObj = { "FindingValue": item1.LeftEyeRemarks, "InvFindingId": 0 };


                                    if (item1.RightEyeArray.length !== 0 || item1.LeftEyeArray.length !== 0 || item1.RightEyeRemarks !== "" || item1.LeftEyeRemarks !== "" || item1.RightEyeCdRatio !== "" || item1.LeftEyeCdRatio !== "" || item1.RightEyeFreq !== "" || item1.LeftEyeFreq !== "") {
                                        item1.IsSelected = "Y";
                                        $scope.TempGonioscopy.push(item1);
                                    }
                                }
                            });
                            if ($scope.TempGonioscopy.length !== 0) {
                                object = {
                                    "RowID": count++,
                                    "CategoryID": 256,
                                    "CategoryDesc": "Gonioscopy New",
                                    "CategoryConditions": $scope.TempGonioscopy
                                };
                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }
                        }

                        if (item.CategoryID === 296) {
                            $scope.TempDryEye = [];
                            item.CategoryConditions.forEach(function (item1, index1) {
                                if (item1.InvestigationId === 2079) {

                                    if (item1.Remarks !== ""
                                        || item1.RightEye.RightEyeType != "" || item1.RightEye.RightEyemm != "" || item1.RightEye.RightEyemin != "" || item1.RightEye.RightK1Value != "" ||
                                        item1.RightEye.RightK2Value != "" || item1.RightEye.Angle1 != "" || item1.RightEye.Angle2 != "" || item1.LeftEye.LeftEyeType != "" || item1.LeftEye.LeftEyemm != "" || item1.LeftEye.LeftEyemin != "" || item1.LeftEye.LeftK1Value != "" ||
                                        item1.LeftEye.LeftK2Value != "" || item1.LeftEye.Angle1 != "" || item1.LeftEye.Angle2 != ""
                                    ) {
                                        $scope.TempDryEye.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 2080 || item1.InvestigationId === 2081 || item1.InvestigationId === 2082) {
                                    if ((item1.RightEyeArray && item1.RightEyeArray.length !== 0) || (item1.LeftEyeArray && item1.LeftEyeArray.length !== 0) || item1.RightEyemm !== "" || item1.LeftEyemm !== "") {
                                        $scope.TempDryEye.push(item1);
                                    }

                                }
                                if (item1.InvestigationId === 2083) {
                                    if ((item1.RightEyeArray && item1.RightEyeArray.length !== 0) || (item1.LeftEyeArray && item1.LeftEyeArray.length !== 0) || item1.RightEyeLissamineGreenmm !== "" || item1.RightEyeRoseBengalmm !== "" || item1.RightEyeFlouresceinmm !== "" || item1.LeftEyeLissamineGreenmm !== "" || item1.LeftEyeRoseBengalmm !== "" || item1.LeftEyeFlouresceinmm !== "") {
                                        $scope.TempDryEye.push(item1);
                                    }

                                }
                            });

                            if ($scope.TempDryEye.length !== 0) {
                                var object = {
                                    "RowID": count++,
                                    "CategoryID": 296,
                                    "CategoryDesc": "Dry Eye Evaluation",
                                    "CategoryConditions": $scope.TempDryEye
                                };

                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }
                        }
                        if (item.CategoryID === 298) {
                            $scope.TempLacrimalPatiency = [];
                            item.CategoryConditions.forEach(function (item1, index1) {
                                if (item1.RightEyeInvestigationNote !== undefined && item1.RightEyeInvestigationNote !== "") {
                                    item1.RightEyeInvestigationNote = DeCodeFilter(item1.RightEyeInvestigationNote);
                                }
                                if (item1.LeftEyeInvestigationNote !== undefined && item1.LeftEyeInvestigationNote !== "") {
                                    item1.LeftEyeInvestigationNote = DeCodeFilter(item1.LeftEyeInvestigationNote);
                                }
                                if (item1.RightEyeInvestigationNote !== "" || item1.LeftEyeInvestigationNote !== "") {
                                    $scope.TempLacrimalPatiency.push(item1);
                                }
                            });
                            if ($scope.TempLacrimalPatiency.length !== 0) {
                                object = {
                                    "RowID": count++,
                                    "CategoryID": 298,
                                    "CategoryDesc": "Lacrimal Patency",
                                    "CategoryConditions": $scope.TempLacrimalPatiency
                                };
                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }
                        }

                        if (item.CategoryID === 299) {
                            $scope.TempPostDilatedExamination = [];
                            item.CategoryConditions.forEach(function (item1, index1) {
                                if (item1.InvestigationId === 2097) {
                                    item1.PupilRightEye = item1.PupilRightEye || "";
                                    item1.PupilLeftEye = item1.PupilLeftEye || "";
                                    if (item1.PupilRightEye !== "" || item1.PupilLeftEye !== "") {
                                        if (item1.PupilRightEye.Type1 !== "" || item1.PupilRightEye.Type2 !== "" || item1.PupilLeftEye.Type1 !== "" || item1.PupilLeftEye.Type2 !== "") {
                                            $scope.TempPostDilatedExamination.push(item1);
                                        }
                                    }
                                }
                                if (item1.InvestigationId === 2098) {
                                    item1.LensRightEye = item1.LensRightEye || "";
                                    item1.LensLeftEye = item1.LensLeftEye || "";
                                    if (item1.LensRightEye != "" || item1.LensLeftEye != "") {
                                        if (item1.LensRightEye.NuclearCataract !== "" || item1.LensRightEye.CorticalCataract !== "" || item1.LensRightEye.PSC !== "" || item1.LensRightEye.TotalCatract !== "" || item1.LensLeftEye.NuclearCataract !== "" || item1.LensLeftEye.CorticalCataract != "" || item1.LensLeftEye.PSC != "" || item1.LensLeftEye.TotalCatract != "") {
                                            $scope.TempPostDilatedExamination.push(item1);
                                        }
                                    }
                                }
                                if (item1.InvestigationId === 2099) {
                                    item1.CapsuleRightEye = item1.CapsuleRightEye || "";
                                    item1.CapsuleLeftEye = item1.CapsuleLeftEye || "";
                                    if (item1.CapsuleRightEye != "" || item1.CapsuleLeftEye != "") {
                                        if (item1.CapsuleRightEye.Intact.IsSelected !== "" || item1.CapsuleLeftEye.Intact.IsSelected !== "") {
                                            $scope.TempPostDilatedExamination.push(item1);
                                        }
                                    }
                                }
                                if (item1.InvestigationId === 2100) {
                                    item1.SpecialsituationsRightEye = item1.SpecialsituationsRightEye || "";
                                    item1.SpecialsituationsLeftEye = item1.SpecialsituationsLeftEye || "";
                                    if (item1.SpecialsituationsRightEye != "" || item1.SpecialsituationsLeftEye != "") {
                                        if (item1.SpecialsituationsRightEye.Traumaticcataract.IsChecked === true || item1.SpecialsituationsRightEye.Subluxatedcataract.IsSelected !== "" || item1.SpecialsituationsRightEye.Phacodonesis.IsSelected !== "" || item1.SpecialsituationsLeftEye.Traumaticcataract.IsChecked === true || item1.SpecialsituationsLeftEye.Subluxatedcataract.IsSelected !== "" || item1.SpecialsituationsLeftEye.Phacodonesis.IsSelected !== "") {
                                            $scope.TempPostDilatedExamination.push(item1);
                                        }
                                    }
                                }
                                if (item1.InvestigationId === 2101) {
                                    if (item1.AnteriorVitreousRightEye !== "" || item1.AnteriorVitreousLeftEye !== "") {
                                        $scope.TempPostDilatedExamination.push(item1);
                                    }
                                }
                            });
                            if ($scope.TempPostDilatedExamination.length !== 0 || item.PostDilatedLeftEyeRemarks !== "" || item.PostDilatedRightEyeRemarks !== "") {
                                object = {
                                    "RowID": count++,
                                    "CategoryID": 299,
                                    "CategoryDesc": "Post Dilated Examination",
                                    "CategoryConditions": $scope.TempPostDilatedExamination,
                                    "PostDilatedRightEyeRemarks": item.PostDilatedRightEyeRemarks || "",
                                    "PostDilatedLeftEyeRemarks": item.PostDilatedLeftEyeRemarks || ""
                                };
                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }
                        }
                    });
                    $scope.cacheStorageItem.Findings = $scope.cacheStorageItem.InvestigationDetails;
                    $scope.loadVisionFromCache();
                }
            }
            if (plan.ConsentUploads !== undefined) {
                if (plan.ConsentUploads.length !== 0) {
                    $scope.cacheStorageItem.PatientPdfConsertArray = [];
                    $scope.cacheStorageItem.PatientConsertArray = [];
                    angular.forEach(plan.ConsentUploads, function (item) {
                        if (item.DocURL.indexOf(".pdf") > -1) {
                            $scope.cacheStorageItem.PatientPdfConsertArray.push(item);
                        } else {
                            $scope.cacheStorageItem.PatientConsertArray.push(item);
                        }
                    });
                }
            }
            $scope.cacheStorageItem.finalToothPrblmArray = [];
            $scope.cacheStorageItem.patientToothPrblmArray = [];
            $scope.cacheStorageItem.TotalTreatMentFinalCost = 0;









            if (plan.ToothProblems !== undefined) {




                if ($scope.isParentAppointmentExists) {
                    $scope.ToothProblemArray = angular.copy(plan.ToothProblems);
                    angular.forEach($scope.ToothProblemArray, function (pitem) {
                        angular.forEach(pitem.Treatments, function (subpitem) {
                            subpitem.TreatmentData.treatmentAccess = false;

                            if (subpitem.IsNewTreatment) {
                                subpitem.TreatmentData.TreatmentDoctorAppointmentId = $scope.cacheStorageItem.appointmentid;
                                subpitem.IsNewTreatment = false;
                                if (subpitem.TreatmentData.TreatmentDoctorId === $scope.UserId || subpitem.TreatmentData.TreatmentAddedDoctorId === $scope.UserId) {
                                    subpitem.TreatmentData.treatmentAccess = true;
                                    subpitem.IsNewTreatment = true;
                                }
                            } else {
                                if (subpitem.TreatmentData.TreatmentDoctorId === $scope.UserId) {
                                    subpitem.TreatmentData.treatmentAccess = true;
                                    subpitem.IsNewTreatment = true;
                                }
                            }
                        });
                    });
                    $scope.cacheStorageItem.finalToothPrblmArray = angular.copy($scope.ToothProblemArray);
                    $scope.cacheStorageItem.IsEditConsultation = true;
                    $scope.cacheStorageItem.IsFollowupConsultation = false;
                } else {
                    $scope.ToothProblemArray = angular.copy(plan.ToothProblems);
                    angular.forEach($scope.ToothProblemArray, function (pitem) {
                        angular.forEach(pitem.Treatments, function (subpitem) {
                            subpitem.TreatmentData.treatmentAccess = false;
                            if (subpitem.IsNewTreatment) {
                                subpitem.TreatmentData.TreatmentDoctorAppointmentId = $scope.cacheStorageItem.appointmentid;
                                subpitem.IsNewTreatment = false;
                                if (subpitem.TreatmentData.TreatmentDoctorId === $scope.UserId || subpitem.TreatmentData.TreatmentAddedDoctorId === $scope.UserId) {
                                    subpitem.TreatmentData.treatmentAccess = true;
                                    subpitem.IsNewTreatment = true;
                                }
                            } else {
                                if (subpitem.TreatmentData.TreatmentDoctorId === $scope.UserId) {
                                    subpitem.TreatmentData.treatmentAccess = true;
                                    subpitem.IsNewTreatment = true;
                                }
                            }
                        });
                    });
                    $scope.cacheStorageItem.finalToothPrblmArray = angular.copy($scope.ToothProblemArray);
                }
                if ($scope.cacheStorageItem.finalToothPrblmArray.length > 0) {
                    angular.forEach($scope.cacheStorageItem.finalToothPrblmArray, function (item, index) {
                        angular.forEach(item.Treatments, function (item1, index1) {
                            item1.TreatmentData.showTreatInstructionPopup = false;
                            item1.TreatmentData.Instructions = item1.TreatmentData.Instructions ? item1.TreatmentData.Instructions : "";
                            item1.TreatmentData.TreatmentFinalCost = item1.TreatmentData.TreatmentCost - item1.TreatmentData.DiscountAmount;
                            $scope.cacheStorageItem.TotalTreatMentFinalCost += item1.TreatmentData.TreatmentFinalCost;
                            item1.TreatmentData.TreatmentNotesArray = [];

                            if (item1.TreatmentNotesArray !== undefined && item1.TreatmentNotesArray.length > 0) {
                                item1.TreatmentData.TreatmentNotesArray = angular.copy(item1.TreatmentNotesArray);
                            }
                            item1.TreatmentNotesArray = [];
                        });
                    });
                }
            }








            $scope.cacheStorageItem.PatientVitals = [];
            $scope.cacheStorageItem.AppointmentPatientUploads = [];
            $scope.cacheStorageItem.PatientVitals = plan.Vitals;
            $scope.cacheStorageItem.AppointmentPatientUploads = plan.FileUploads;

            if (plan.CheckList !== undefined) {
                if (!_.isEmpty(plan.CheckList)) {
                    $scope.cacheStorageItem.Checklist = plan.CheckList;
                }
            }

            if (plan.VisionDetails !== undefined) {
                $scope.cacheStorageItem.FinalVisionDetails = plan.VisionDetails || [];
            }

            if (plan.AnteriorSegmentDetails !== undefined) {
                $scope.cacheStorageItem.FinalAnteriorDetails = plan.AnteriorSegmentDetails || [];
            }
            if (plan.PosteriorSegmentDetails !== undefined) {
                $scope.cacheStorageItem.FinalPosteriorDetails = plan.PosteriorSegmentDetails || [];
            }
            if (plan.TonoMetryDetails !== undefined) {
                $scope.cacheStorageItem.FinalTonoMetryDetails = plan.TonoMetryDetails || [];
            }
            if (plan.GlassDetails !== undefined) {
                $scope.cacheStorageItem.FinalGlassDetails = plan.GlassDetails || [];
            }

            if (plan.ColorVisionDetails !== undefined) {
                $scope.cacheStorageItem.FinalColorVisionDetails = plan.ColorVisionDetails || [];
            }
            if (plan.LacrimalPatiencyDetails !== undefined) {
                $scope.cacheStorageItem.FinalLacrimalPatiencyDetails = plan.LacrimalPatiencyDetails || [];
            }
            if (plan.SquintDetails !== undefined) {
                $scope.cacheStorageItem.FinalSquintDetails = plan.SquintDetails || [];
            }
            if (plan.GonioscopyDetails !== undefined) {
                $scope.cacheStorageItem.FinalGonioscopyDetails = plan.GonioscopyDetails || [];
            }

            $scope.cacheStorageItem.AnteriorRemarks = plan.AnteriorRemarks || "";
            $scope.cacheStorageItem.PosteriorRemarks = plan.PosteriorRemarks || "";
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        }
        if ($scope.VideoConsultation || ($scope.Tab === 'teleappointments' && $scope.SpecializationId === 3)) {
            continuetoStartVideoConsultation();

        } else {
            continuetoStartConsultation();
        }

    };

    $scope.loadVisionFromCache = function () {
        $scope.cacheStorageItem.UnaidedArray = [];
        $scope.cacheStorageItem.RefractionArray = [];
        $scope.cacheStorageItem.AcceptenceArray = [];
        $scope.cacheStorageItem.AnteriorSegmentArray = [];
        $scope.cacheStorageItem.PosteriorSegmentArray = [];
        $scope.cacheStorageItem.PinholeArray = [];
        $scope.cacheStorageItem.KeretometerArray = [];
        $scope.cacheStorageItem.OcularDominanceArray = [];
        $scope.cacheStorageItem.LCVArray = [];
        $scope.cacheStorageItem.BinocularArray = [];
        $scope.cacheStorageItem.AdditionalInvestgationArray = [];
        $scope.cacheStorageItem.InvColorVisionArray = [];
        $scope.cacheStorageItem.OcularDominanceArray = [];
        $scope.cacheStorageItem.ColourVisionArray = [];
        $scope.cacheStorageItem.OcularMotilityArray = [];
        $scope.cacheStorageItem.TonometryTestArray = [];
        $scope.cacheStorageItem.GlassPrescriptionArray = [];
        $scope.cacheStorageItem.ArRefractionArray = [];
        $scope.cacheStorageItem.GonioscopyArray = [];
        $scope.cacheStorageItem.PostMydriaticTestArray = [];
        $scope.cacheStorageItem.DryEyeEvaluationArray = [];
        $scope.cacheStorageItem.LacrimalPatiency = [];
        $scope.cacheStorageItem.PostDilatedExaminationArray = [];

        if ($scope.cacheStorageItem.InvestigationDetails.length > 0) {
            var oculoMetryFlag = false;
            $scope.cacheStorageItem.InvestigationDetails.forEach(function (mitem) {
                if (mitem.CategoryID === 1) {
                    if (mitem.CategoryConditions !== undefined) {
                        mitem.CategoryConditions.forEach(function (item2, index2) {
                            switch (item2.InvestigationId) {
                                case 13:
                                    object = {
                                        "InvestigationId": item2.InvestigationId,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "RightEye": {
                                            "REye": item2.Attributes.RightEye
                                        },
                                        "LeftEye": {
                                            "LEye": item2.Attributes.LeftEye
                                        }
                                    };
                                    $scope.cacheStorageItem.PinholeArray.push(object);
                                    break;
                                case 2076:
                                case 2077:
                                    object = {
                                        "InvestigationId": item2.InvestigationId,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "RightEye": {
                                            "REye": item2.Attributes.RightEye
                                        },
                                        "LeftEye": {
                                            "LEye": item2.Attributes.LeftEye
                                        }
                                    };
                                    $scope.cacheStorageItem.PinholeArray.push(object);
                                    break;
                                case 11:
                                    object = {
                                        "InvestigationId": item2.InvestigationId,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "RightEye": {
                                            "RHorizontalAxis": item2.InvestigationOrgans[0].InvestigationAttributes.HorizontalAxis,
                                            "RHorizontalNewAxis": item2.InvestigationOrgans[0].InvestigationAttributes.HorizontalNewAxis,
                                            "RVerticalAxis": item2.InvestigationOrgans[0].InvestigationAttributes.VerticalAxis,
                                            "RVerticalNewAxis": item2.InvestigationOrgans[0].InvestigationAttributes.VerticalNewAxis,
                                            "RAverageKeretometerValue": item2.InvestigationOrgans[0].InvestigationAttributes.AverageKeretometerValue,
                                            "RCylindricalValue": item2.InvestigationOrgans[0].InvestigationAttributes.CylindricalValue
                                        },
                                        "LeftEye": {
                                            "LHorizontalAxis": item2.InvestigationOrgans[1].InvestigationAttributes.HorizontalAxis,
                                            "LHorizontalNewAxis": item2.InvestigationOrgans[1].InvestigationAttributes.HorizontalNewAxis,
                                            "LVerticalAxis": item2.InvestigationOrgans[1].InvestigationAttributes.VerticalAxis,
                                            "LVerticalNewAxis": item2.InvestigationOrgans[1].InvestigationAttributes.VerticalNewAxis,
                                            "LAverageKeretometerValue": item2.InvestigationOrgans[1].InvestigationAttributes.AverageKeretometerValue,
                                            "LCylindricalValue": item2.InvestigationOrgans[1].InvestigationAttributes.CylindricalValue
                                        }
                                    };
                                    $scope.cacheStorageItem.KeretometerArray.push(object);
                                    break;
                                case 12:
                                    $scope.cacheStorageItem.OcularDominanceArray = [];
                                    object = {
                                        "InvestigationId": item2.InvestigationId,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "RightEye": {
                                            "REye": item2.Attributes ? (item2.Attributes.RightEye ? "Yes" : (!item2.Attributes.RightEye ? "No" : "")) : "",
                                            "RRemarks": item2.Attributes ? (item2.Attributes.NotesRightEye) : ""
                                        },
                                        "LeftEye": {
                                            "LEye": item2.Attributes ? (item2.Attributes.LeftEye ? "Yes" : (!item2.Attributes.LeftEye ? "No" : "")) : "",
                                            "LRemarks": item2.Attributes ? (item2.Attributes.NotesLeftEye) : ""
                                        },
                                        "Value": item2.Value,
                                        "Remarks": item2.Remarks
                                    };
                                    $scope.cacheStorageItem.OcularDominanceArray.push(object);
                                    break;
                                case 8:
                                    object = {
                                        "InvestigationId": item2.InvestigationId,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "RightEye": {
                                            "RSph": item2.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                            "RCyl": item2.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                            "RAxis": item2.InvestigationOrgans[0].InvestigationAttributes.Axis
                                        },
                                        "LeftEye": {
                                            "LSph": item2.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                            "LCyl": item2.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                            "LAxis": item2.InvestigationOrgans[1].InvestigationAttributes.Axis
                                        }
                                    };
                                    $scope.cacheStorageItem.LCVArray.push(object);
                                    break;
                                case 10:
                                    object = {
                                        "InvestigationId": item2.InvestigationId,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "RightEye": {
                                            "RSph": item2.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                            "RCyl": item2.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                            "RAxis": item2.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                            "RAdition": item2.InvestigationOrgans[0].InvestigationAttributes.Adition
                                        },
                                        "LeftEye": {
                                            "LSph": item2.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                            "LCyl": item2.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                            "LAxis": item2.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                            "LAdition": item2.InvestigationOrgans[1].InvestigationAttributes.Adition
                                        }
                                    };
                                    $scope.cacheStorageItem.BinocularArray.push(object);
                                    break;
                                case 4:
                                case 9:
                                case 5:
                                    // if (item2.Active === "Y") {
                                    object = {
                                        "InvestigationId": item2.InvestigationId,
                                        "InvestigationIDesc": item2.InvestigationDesc,
                                        "InvestigationDetails": {
                                            "DVrightEye": item2.Attributes.distanceVision.RightEye,
                                            "DVleftEye": item2.Attributes.distanceVision.LeftEye,
                                            "DVBoth": item2.Attributes.distanceVision.Both,
                                            "NVrightEye": item2.Attributes.NearVision.RightEye,
                                            "NVleftEye": item2.Attributes.NearVision.LeftEye,
                                            "NVBoth": item2.Attributes.NearVision.Both
                                        }
                                    };
                                    $scope.cacheStorageItem.UnaidedArray.push(object);
                                    //}
                                    break;
                                case 2:
                                case 3:
                                    if (item2.InvestigationId === 2) {
                                        var refracobject = {
                                            "Remarks": item2.Remarks,
                                            "RightEye": {
                                                "ISbinaclurDone": item2.InvestigationOrgans[0].ISbinaclurDone,
                                                "RSpherical": item2.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                                "RCylindrical": item2.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                                "RAxis": item2.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                                "RAdition": item2.InvestigationOrgans[0].InvestigationAttributes.Adition,
                                                "RUCVA": item2.InvestigationOrgans[0].InvestigationAttributes.UCVA,
                                                "RBCDVA": item2.InvestigationOrgans[0].InvestigationAttributes.BCDVA,
                                                "RBCNVA": item2.InvestigationOrgans[0].InvestigationAttributes.BCNVA,
                                                "RBCVA": item2.InvestigationOrgans[0].InvestigationAttributes.BCVA,
                                                "RIPD": item2.InvestigationOrgans[0].InvestigationAttributes.IPD,
                                                "RPH": item2.InvestigationOrgans[0].InvestigationAttributes.PH,
                                                "CRSpherical": "",
                                                "CRCylindrical": "",
                                                "CRAxis": "",
                                                "CRAdition": "",
                                                "SolutionUsed": ""
                                            },
                                            "LeftEye": {
                                                "ISbinaclurDone": item2.InvestigationOrgans[1].ISbinaclurDone,
                                                "RSpherical": item2.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                                "RCylindrical": item2.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                                "RAxis": item2.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                                "RAdition": item2.InvestigationOrgans[1].InvestigationAttributes.Adition,
                                                "RUCVA": item2.InvestigationOrgans[1].InvestigationAttributes.UCVA,
                                                "RBCDVA": item2.InvestigationOrgans[1].InvestigationAttributes.BCDVA,
                                                "RBCNVA": item2.InvestigationOrgans[1].InvestigationAttributes.BCNVA,
                                                "RBCVA": item2.InvestigationOrgans[1].InvestigationAttributes.BCVA,
                                                "RIPD": item2.InvestigationOrgans[1].InvestigationAttributes.IPD,
                                                "RPH": item2.InvestigationOrgans[1].InvestigationAttributes.PH,
                                                "CRSpherical": "",
                                                "CRCylindrical": "",
                                                "CRAxis": "",
                                                "CRAdition": "",
                                                "SolutionUsed": ""
                                            }
                                        };
                                        $scope.cacheStorageItem.RefractionArray.push(refracobject);
                                    } else if (item2.InvestigationId === 3) {
                                        if ($scope.cacheStorageItem.RefractionArray.length === 0) {
                                            var refracobject = {
                                                "CRemarks": "",
                                                "RightEye": {
                                                    "CRSpherical": "",
                                                    "CRCylindrical": "",
                                                    "CRAxis": "",
                                                    "CRAdition": "",
                                                    "CRBCVA": "",
                                                    "CRPH": "",
                                                    "CRUCVA": "",
                                                    "SolutionUsed": ""

                                                },
                                                "LeftEye": {
                                                    "CRSpherical": "",
                                                    "CRCylindrical": "",
                                                    "CRAxis": "",
                                                    "CRAdition": "",
                                                    "CRBCVA": "",
                                                    "CRPH": "",
                                                    "CRUCVA": "",
                                                    "SolutionUsed": ""
                                                }
                                            };
                                            $scope.cacheStorageItem.RefractionArray.push(refracobject);
                                        }
                                        $scope.cacheStorageItem.RefractionArray[0].RightEye.CRSpherical = item2.InvestigationOrgans[0].InvestigationAttributes.Spherical;
                                        $scope.cacheStorageItem.RefractionArray[0].RightEye.CRCylindrical = item2.InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                                        $scope.cacheStorageItem.RefractionArray[0].RightEye.CRAxis = item2.InvestigationOrgans[0].InvestigationAttributes.Axis;
                                        $scope.cacheStorageItem.RefractionArray[0].RightEye.CRAdition = item2.InvestigationOrgans[0].InvestigationAttributes.Adition;
                                        $scope.cacheStorageItem.RefractionArray[0].RightEye.CRBCVA = item2.InvestigationOrgans[0].InvestigationAttributes.BCVA;
                                        $scope.cacheStorageItem.RefractionArray[0].RightEye.CRPH = item2.InvestigationOrgans[0].InvestigationAttributes.PH;
                                        $scope.cacheStorageItem.RefractionArray[0].RightEye.CRUCVA = item2.InvestigationOrgans[0].InvestigationAttributes.UCVA;
                                        $scope.cacheStorageItem.RefractionArray[0].RightEye.SolutionUsed = item2.InvestigationOrgans[0].SolutionUsed;

                                        $scope.cacheStorageItem.RefractionArray[0].LeftEye.CRSpherical = item2.InvestigationOrgans[1].InvestigationAttributes.Spherical;
                                        $scope.cacheStorageItem.RefractionArray[0].LeftEye.CRCylindrical = item2.InvestigationOrgans[1].InvestigationAttributes.Cylindrical;
                                        $scope.cacheStorageItem.RefractionArray[0].LeftEye.CRAxis = item2.InvestigationOrgans[1].InvestigationAttributes.Axis;
                                        $scope.cacheStorageItem.RefractionArray[0].LeftEye.CRAdition = item2.InvestigationOrgans[1].InvestigationAttributes.Adition;
                                        $scope.cacheStorageItem.RefractionArray[0].LeftEye.CRBCVA = item2.InvestigationOrgans[1].InvestigationAttributes.BCVA;
                                        $scope.cacheStorageItem.RefractionArray[0].LeftEye.CRPH = item2.InvestigationOrgans[1].InvestigationAttributes.PH;
                                        $scope.cacheStorageItem.RefractionArray[0].LeftEye.CRUCVA = item2.InvestigationOrgans[1].InvestigationAttributes.UCVA;
                                        $scope.cacheStorageItem.RefractionArray[0].LeftEye.SolutionUsed = item2.InvestigationOrgans[1].SolutionUsed;
                                        $scope.cacheStorageItem.RefractionArray[0].CRemarks = item2.CRemarks;
                                    }
                                    break;
                                case 7:
                                case 6:
                                    if (item2.InvestigationId === 7) {
                                        if ($scope.cacheStorageItem.AcceptenceArray.length === 0) {
                                            var refracobject = {
                                                "RightEye": {
                                                    "ASpherical": "",
                                                    "ACylindrical": "",
                                                    "AAxis": "",
                                                    "AAdition": ""
                                                },
                                                "LeftEye": {
                                                    "ASpherical": "",
                                                    "ACylindrical": "",
                                                    "AAxis": "",
                                                    "AAdition": ""
                                                }
                                            };
                                            $scope.cacheStorageItem.AcceptenceArray.push(refracobject);
                                        }
                                        $scope.cacheStorageItem.AcceptenceArray[0].RightEye.ASpherical = item2.InvestigationOrgans[0].InvestigationAttributes.Spherical;
                                        $scope.cacheStorageItem.AcceptenceArray[0].RightEye.ACylindrical = item2.InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                                        $scope.cacheStorageItem.AcceptenceArray[0].RightEye.AAxis = item2.InvestigationOrgans[0].InvestigationAttributes.Axis;
                                        $scope.cacheStorageItem.AcceptenceArray[0].RightEye.AAdition = item2.InvestigationOrgans[0].InvestigationAttributes.Adition;
                                        $scope.cacheStorageItem.AcceptenceArray[0].LeftEye.ASpherical = item2.InvestigationOrgans[1].InvestigationAttributes.Spherical;
                                        $scope.cacheStorageItem.AcceptenceArray[0].LeftEye.ACylindrical = item2.InvestigationOrgans[1].InvestigationAttributes.Cylindrical;
                                        $scope.cacheStorageItem.AcceptenceArray[0].LeftEye.AAxis = item2.InvestigationOrgans[1].InvestigationAttributes.Axis;
                                        $scope.cacheStorageItem.AcceptenceArray[0].LeftEye.AAdition = item2.InvestigationOrgans[1].InvestigationAttributes.Adition;

                                    } else if (item2.InvestigationId === 6) {

                                        var refracobject = {
                                            "RightEye": {
                                                "ASpherical": "",
                                                "ACylindrical": "",
                                                "AAxis": "",
                                                "AAdition": "",
                                                "ACSpherical": item2.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                                "ACCylindrical": item2.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                                "ACAxis": item2.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                                "ACAdition": item2.InvestigationOrgans[0].InvestigationAttributes.Adition
                                            },
                                            "LeftEye": {
                                                "ASpherical": "",
                                                "ACylindrical": "",
                                                "AAxis": "",
                                                "AAdition": "",
                                                "ACSpherical": item2.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                                "ACCylindrical": item2.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                                "ACAxis": item2.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                                "ACAdition": item2.InvestigationOrgans[1].InvestigationAttributes.Adition
                                            }
                                        };
                                        $scope.cacheStorageItem.AcceptenceArray.push(refracobject);

                                        //$scope.cacheStorageItem.AcceptenceArray[0].RightEye.ACSpherical = item2.InvestigationOrgans[0].InvestigationAttributes.Spherical;
                                        //$scope.cacheStorageItem.AcceptenceArray[0].RightEye.ACCylindrical = item2.InvestigationOrgans[0].InvestigationAttributes.Cylindrical;
                                        //$scope.cacheStorageItem.AcceptenceArray[0].RightEye.ACAxis = item2.InvestigationOrgans[0].InvestigationAttributes.Axis;
                                        //$scope.cacheStorageItem.AcceptenceArray[0].RightEye.ACAdition = item2.InvestigationOrgans[0].InvestigationAttributes.Adition;
                                        //$scope.cacheStorageItem.AcceptenceArray[0].LeftEye.ACSpherical = item2.InvestigationOrgans[1].InvestigationAttributes.Spherical;
                                        //$scope.cacheStorageItem.AcceptenceArray[0].LeftEye.ACCylindrical = item2.InvestigationOrgans[1].InvestigationAttributes.Cylindrical;
                                        //$scope.cacheStorageItem.AcceptenceArray[0].LeftEye.ACAxis = item2.InvestigationOrgans[1].InvestigationAttributes.Axis;
                                        //$scope.cacheStorageItem.AcceptenceArray[0].LeftEye.ACAdition = item2.InvestigationOrgans[1].InvestigationAttributes.Adition;
                                    }
                                    break;
                                case 1:
                                    var refracobject = {
                                        "InvestigationId": item2.InvestigationId,
                                        "InvestigationDesc": item2.InvestigationDesc,
                                        "RightEye": {
                                            "RSpherical": item2.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                            "RCylindrical": item2.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                            "RAxis": item2.InvestigationOrgans[0].InvestigationAttributes.Axis
                                            //"RAdition": item2.InvestigationOrgans[0].InvestigationAttributes.Adition,
                                        },
                                        "LeftEye": {
                                            "RSpherical": item2.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                            "RCylindrical": item2.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                            "RAxis": item2.InvestigationOrgans[1].InvestigationAttributes.Axis
                                            //"RAdition": item2.InvestigationOrgans[1].InvestigationAttributes.Adition,
                                        }
                                    };
                                    $scope.cacheStorageItem.ArRefractionArray.push(refracobject);
                                    break;
                                case 2088:

                                    var refracobject = {
                                        "Remarks": item2.Remarks,
                                        "RightEye": {
                                            "Spherical": item2.InvestigationOrgans[0].InvestigationAttributes.Spherical,
                                            "Cylindrical": item2.InvestigationOrgans[0].InvestigationAttributes.Cylindrical,
                                            "Axis": item2.InvestigationOrgans[0].InvestigationAttributes.Axis,
                                            "Adition": item2.InvestigationOrgans[0].InvestigationAttributes.Adition,
                                            "BCNVA": item2.InvestigationOrgans[0].InvestigationAttributes.BCNVA,
                                            "BCVA": item2.InvestigationOrgans[0].InvestigationAttributes.BCVA
                                        },
                                        "LeftEye": {
                                            "Spherical": item2.InvestigationOrgans[1].InvestigationAttributes.Spherical,
                                            "Cylindrical": item2.InvestigationOrgans[1].InvestigationAttributes.Cylindrical,
                                            "Axis": item2.InvestigationOrgans[1].InvestigationAttributes.Axis,
                                            "Adition": item2.InvestigationOrgans[1].InvestigationAttributes.Adition,
                                            "BCNVA": item2.InvestigationOrgans[1].InvestigationAttributes.BCNVA,
                                            "BCVA": item2.InvestigationOrgans[1].InvestigationAttributes.BCVA
                                        }
                                    };
                                    $scope.cacheStorageItem.PostMydriaticTestArray.push(refracobject);
                            }

                        });
                    }
                }
                if (mitem.CategoryID !== 1 && mitem.CategoryID !== 2 && mitem.CategoryID !== 3 && mitem.CategoryID !== 4 && mitem.CategoryID !== 7 && mitem.CategoryID !== 256 && mitem.CategoryID !== 298 && mitem.CategoryID !== 299) {
                    var objname = mitem.CategoryID === 5 ? "AnteriorSegmentArray" : (mitem.CategoryID === 6 ? "PosteriorSegmentArray" : "AdditionalInvestgationArray");
                    var Remarks = mitem.Remarks;

                    //var object = {
                    //    "CategoryId": mitem.CategoryID,                    
                    //    "Remarks": Remarks,              
                    //    "InvestigationDetails": {}
                    //};
                    //$scope.cacheStorageItem[objname].push(object);
                    mitem.CategoryConditions.forEach(function (item) {
                        if (item.IsNormalR) {
                            var RRemarks = item.RightEyeRemarks + " - " + "Normal";
                        } else {
                            var RRemarks = item.RightEyeRemarks;
                        }
                        if (item.IsNormalL) {
                            var LRemarks = item.LeftEyeRemarks + " - " + "Normal";
                        } else {
                            var LRemarks = item.LeftEyeRemarks;
                        }


                        if (item.RightEyeArray === undefined) {
                            item.RightEyeArray = [];
                        }
                        if (item.LeftEyeArray === undefined) {
                            item.LeftEyeArray = [];
                        }
                        var RECdRatio = item.RightEyeCdRatio;
                        var LECdRatio = item.LeftEyeCdRatio;
                        var LEFreq = item.LeftEyeFreq;
                        var REFreq = item.RightEyeFreq;
                        var RightImageArray = [];
                        if (item.RightEyeArray.length > 0) {
                            angular.forEach(item.RightEyeArray, function (initem) {
                                if (initem.DocURL) {
                                    if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                        RightImageArray.push({
                                            "url": initem.DocURL,
                                            "thumbUrl": initem.DocURL
                                        });
                                    }
                                }
                            });
                        }
                        var LeftImageArray = [];
                        if (item.LeftEyeArray && item.LeftEyeArray.length > 0) {
                            angular.forEach(item.LeftEyeArray, function (initem) {
                                if (initem.DocURL) {
                                    if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                        LeftImageArray.push({
                                            "url": initem.DocURL,
                                            "thumbUrl": initem.DocURL
                                        });
                                    }
                                }
                            });
                        }
                        if (item.RightEyeRemarks !== "" || item.LeftEyeRemarks !== "" || item.LeftEyeRemarksArray.length > 0 || item.RightEyeRemarksArray.length > 0 || item.RightEyeArray.length > 0 || item.LeftEyeArray.length > 0 || item.RightEyeCdRatio !== "" || item.LeftEyeCdRatio !== "" || item.LeftEyeFreq !== "" || item.RightEyeFreq !== "" || item.IsNormalR || item.IsNormalL) {
                            var object = {
                                "CategoryId": mitem.CategoryID,
                                "Category": mitem.CategoryDesc,
                                "Remarks": Remarks,
                                "InvestigationId": item.InvestigationId,
                                "InvestigationDesc": item.Investigation,
                                "InvestigationDetails": {
                                    "RightEye": RRemarks,
                                    "LeftEye": LRemarks,
                                    "RightEyeCdRatio": RECdRatio,
                                    "LeftEyeCdRatio": LECdRatio,
                                    "LeftEyeFreq": LEFreq,
                                    "RightEyeFreq": REFreq,
                                    "LeftEyeRemarksArray": item.LeftEyeRemarksArray || [],
                                    "RightEyeRemarksArray": item.RightEyeRemarksArray || [],
                                    "RightEyeImage": RightImageArray,
                                    "LeftEyeImage": LeftImageArray
                                }
                            };
                            $scope.cacheStorageItem[objname].push(object);
                        }
                    });
                    if (mitem.CategoryConditions.length === 0 && mitem.Remarks !== "") {
                        object = {
                            "CategoryId": mitem.CategoryID,
                            "Category": mitem.CategoryDesc || '',
                            "Remarks": Remarks || "",
                            "InvestigationDetails": {
                                "RightEye": "",
                                "LeftEye": "",
                                "RightEyeCdRatio": "",
                                "LeftEyeCdRatio": "",
                                "LeftEyeFreq": 0,
                                "RightEyeFreq": 0,
                                "RightEyeRemarksArray": [],
                                "LeftEyeRemarksArray": [],
                                "RightEyeImage": [],
                                "LeftEyeImage": []
                            }
                        };
                        $scope.cacheStorageItem[objname].push(object);
                    }
                }
                if (mitem.CategoryID === 2) {
                    mitem.CategoryConditions.forEach(function (item, index) {
                        if (item.InvestigationNote !== "" || (item.LeftEyeInvestigationNote !== "" && item.InvestigationId === 14)) {
                            $scope.cacheStorageItem.ColourVisionArray.push(item);
                        }
                    });
                }
                //if (mitem.CategoryID === 3) {
                //    oculoMetryFlag = true;
                //    $scope.cacheStorageItem.OcularMotilityArray = [];
                //    mitem.CategoryConditions.forEach(function (item, index) {
                //        var count = _.reject(item.OcularPositionValues, function (obj) {
                //            return obj.Value === "";
                //        }).length;
                //        item.showHideRightEye = true;
                //        item.showHideLeftEye = true;
                //        if (count === 0 && item.InvestigationAttributeDesc === 'RightEye') {
                //            item.showHideRightEye = false;
                //        }
                //        if (count === 0 && item.InvestigationAttributeDesc === 'LeftEye') {
                //            item.showHideLeftEye = false;
                //        }
                //        if (count !== 0 || item.Notes !== "") {
                //            $scope.cacheStorageItem.OcularMotilityArray.push(item);
                //        }
                //    });
                //}

                if (mitem.CategoryID === 3) {
                    $scope.cacheStorageItem.OcularMotilityArray = [];
                    var count = 0;
                    mitem.CategoryConditions.forEach(function (item) {
                        switch (item.InvestigationId) {
                            case 18:
                                object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "Notes": item.Notes,
                                    "InvestigationOrgans": item.InvestigationOrgans
                                };

                                count = _.reject(item.InvestigationOrgans, function (obj) {
                                    return obj.Value === "";
                                }).length;

                                if (count !== 0 || (item.Notes !== "" && item.Notes !== undefined)) {
                                    $scope.cacheStorageItem.OcularMotilityArray.push(object);
                                }

                                break;

                            case 696:
                                object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "InvestigationNote": item.InvestigationNote
                                };
                                if (item.InvestigationNote !== "") {
                                    $scope.cacheStorageItem.OcularMotilityArray.push(object);
                                }
                                break;
                            //case 697:
                            //    object = {
                            //        "InvestigationId": item.InvestigationId,
                            //        "InvestigationDesc": item.InvestigationDesc,
                            //        "CornealReflexType": item.CornealReflexType
                            //    };
                            //    if (object.CornealReflexType !== "" && object.CornealReflexType !== undefined) {
                            //        $scope.cacheStorageItem.OcularMotilityArray.push(object);
                            //    }
                            //    break;

                            case 697:
                                object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestiagtionDesc": item.InvestigationDesc,
                                    "InvestigationOrgans": item.InvestigationOrgans
                                };

                                if (angular.isArray(item.InvestigationOrgans[0].CornealReflexType)) {
                                    var list = [];
                                    angular.forEach(item.InvestigationOrgans[0].CornealReflexType, function (mitem) {
                                        if (mitem.Value !== "") {
                                            list.push(mitem);
                                        }
                                    });
                                    object.InvestigationOrgans[0].CornealReflexType = list;
                                } else {
                                    if (!($scope.isObjectEmpty(item.InvestigationOrgans[0].CornealReflexType))) {
                                        if (item.InvestigationOrgans[0].CornealReflexType.Id !== null && item.InvestigationOrgans[0].CornealReflexType.Id !== 0) {
                                            object.InvestigationOrgans[0].CornealReflexType = item.InvestigationOrgans[0].CornealReflexType;
                                        } else {
                                            object.InvestigationOrgans[0].CornealReflexType = {};
                                        }
                                    }
                                }

                                if (angular.isArray(item.InvestigationOrgans[1].CornealReflexType)) {
                                    var mlist = {};
                                    angular.forEach(item.InvestigationOrgans[1].CornealReflexType, function (nitem) {
                                        if (nitem.Value !== "") {
                                            mlist.push(nitem);
                                        }
                                    });
                                    object.InvestigationOrgans[1].CornealReflexType = mlist;
                                } else {
                                    if (!($scope.isObjectEmpty(item.InvestigationOrgans[1].CornealReflexType))) {
                                        if (item.InvestigationOrgans[1].CornealReflexType.Id !== null && item.InvestigationOrgans[1].CornealReflexType.Id !== 0) {
                                            object.InvestigationOrgans[1].CornealReflexType = item.InvestigationOrgans[1].CornealReflexType;
                                        } else {
                                            object.InvestigationOrgans[1].CornealReflexType = {};
                                        }
                                    }
                                }

                                if (item.InvestigationOrgans[0].CornealReflexDegreeValue != "" && item.InvestigationOrgans[0].CornealReflexDegreeValue != undefined) {
                                    object.InvestigationOrgans[0].CornealReflexDegreeValue = item.InvestigationOrgans[0].CornealReflexDegreeValue;
                                }
                                else {
                                    object.InvestigationOrgans[0].CornealReflexDegreeValue = "";
                                }
                                if (item.InvestigationOrgans[1].CornealReflexDegreeValue != "" && item.InvestigationOrgans[1].CornealReflexDegreeValue != undefined) {
                                    object.InvestigationOrgans[1].CornealReflexDegreeValue = item.InvestigationOrgans[1].CornealReflexDegreeValue;
                                }
                                else {
                                    object.InvestigationOrgans[1].CornealReflexDegreeValue = "";
                                }
                                if (!($scope.isObjectEmpty(object.InvestigationOrgans[0].CornealReflexType)) || !($scope.isObjectEmpty(object.InvestigationOrgans[1].CornealReflexType)) || object.InvestigationOrgans[0].CornealReflexDegreeValue != "" || object.InvestigationOrgans[1].CornealReflexDegreeValue != "") {
                                    $scope.cacheStorageItem.OcularMotilityArray.push(object);
                                }

                                break;
                            case 698:
                                object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "InvestigationNote": item.InvestigationNote
                                };
                                if (item.InvestigationNote !== "") {
                                    $scope.cacheStorageItem.OcularMotilityArray.push(object);
                                }

                                break;
                            case 695:
                                object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "Notes": item.Notes,
                                    "InvestigationOrgans": item.InvestigationOrgans
                                };
                                count = _.reject(item.InvestigationOrgans, function (obj) {
                                    return obj.Value === "";
                                }).length;

                                if (count !== 0 || (item.Notes !== "" && item.Notes !== undefined)) {
                                    $scope.cacheStorageItem.OcularMotilityArray.push(object);
                                }
                                break;
                            case 699:
                                object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "InvestigationNote": item.InvestigationNote
                                };

                                if (item.InvestigationNote !== "") {
                                    $scope.cacheStorageItem.OcularMotilityArray.push(object);
                                }
                                break;
                            case 700:
                                object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "InvestigationNote": item.InvestigationNote
                                };
                                if (item.InvestigationNote !== "") {
                                    $scope.cacheStorageItem.OcularMotilityArray.push(object);
                                }

                                break;

                            case 701:
                                object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "InvestigationNote": item.InvestigationNote
                                };
                                if (item.InvestigationNote !== "") {
                                    $scope.cacheStorageItem.OcularMotilityArray.push(object);
                                }
                                break;
                            case 2095:
                                object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "FacialSymmetryNote": item.FacialSymmetryNote || "",
                                    "ExternalFaceNote": item.ExternalFaceNote || "",
                                    "OcularPositionNote": item.OcularPositionNote || "",
                                    "OcularAlignmentNote": item.OcularAlignmentNote || "",
                                    "SubCategoryChildId": item.SubCategoryChildId
                                };
                                if (item.FacialSymmetryNote !== "" || item.ExternalFaceNote !== "" || item.OcularPositionNote !== "" || item.OcularAlignmentNote !== "") {
                                    $scope.cacheStorageItem.OcularMotilityArray.push(object);
                                }
                                break;
                            case 2096:
                                object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "FixationPreferenceValue": item.FixationPreferenceValue || "",
                                    "OtherFindingsNotes": item.OtherFindingsNotes || "",
                                    "AlphabetPatternValue": item.AlphabetPatternValue || "",
                                    "HeadPostureobj": item.HeadPostureobj || {},
                                    "OcularMovementsobj": item.OcularMovementsobj || {},
                                    "HCRTRightValueArray": item.HCRTRightValueArray || [],
                                    "HCRTLeftValueArray": item.HCRTLeftValueArray || [],
                                    "TypeOfSquintRightEyeArray": item.TypeOfSquintRightEyeArray || [],
                                    "TypeOfSquintLeftEyeArray": item.TypeOfSquintLeftEyeArray || [],
                                    "AlternateCovertestDistanceArray": item.AlternateCovertestDistanceArray || [],
                                    "AlternateCovertestNearArray": item.AlternateCovertestNearArray || [],
                                    "Ductionsobj": item.Ductionsobj,
                                    "SubCategoryChildId": item.SubCategoryChildId
                                };

                                if (item.FixationPreferenceValue !== "" || item.AlphabetPatternValue !== "" || item.OtherFindingsNotes !== "" || item.AlternateCovertestDistanceArray.length !== 0 || item.AlternateCovertestNearArray.length !== 0 || item.HCRTRightValueArray.length !== 0 || item.HCRTLeftValueArray.length !== 0 || item.TypeOfSquintRightEyeArray.length !== 0 || item.TypeOfSquintLeftEyeArray.length !== 0 || item.OcularMovementsobj.RightEyeValue1 !== "" || item.OcularMovementsobj.RightEyeValue2 !== "" || item.OcularMovementsobj.RightEyeValue3 !== "" || item.OcularMovementsobj.RightEyeValue4 !== "" || item.OcularMovementsobj.RightEyeValue5 !== "" || item.OcularMovementsobj.RightEyeValue6 !== "" || item.OcularMovementsobj.RightEyeValue7 !== "" || item.OcularMovementsobj.RightEyeValue8 !== "" || item.OcularMovementsobj.LeftEyeValue1 !== "" || item.OcularMovementsobj.LeftEyeValue2 !== "" || item.OcularMovementsobj.LeftEyeValue3 !== "" || item.OcularMovementsobj.LeftEyeValue4 !== "" || item.OcularMovementsobj.LeftEyeValue5 !== "" || item.OcularMovementsobj.LeftEyeValue6 !== "" || item.OcularMovementsobj.LeftEyeValue7 !== "" || item.OcularMovementsobj.LeftEyeValue8 !== "" || item.HeadPostureobj.LeftFaceTurn !== "" || item.HeadPostureobj.LeftFaceTurnvalue !== "" || item.HeadPostureobj.LeftHeadTilt !== "" || item.HeadPostureobj.LeftHeadTiltvalue !== "" || item.HeadPostureobj.RightChinDepression !== "" || item.HeadPostureobj.RightChinDepressionvalue !== "" || item.HeadPostureobj.RightChinElevation !== "" || item.HeadPostureobj.RightChinElevationvalue !== "" || item.HeadPostureobj.RightFaceTurn !== "" || item.HeadPostureobj.RightFaceTurnvalue !== "" || item.HeadPostureobj.RightHeadTilt !== "" || item.HeadPostureobj.RightHeadTiltvalue !== "" || item.Ductionsobj.LimitationRightEye.length !== 0 || item.Ductionsobj.LimitationLeftEye.length !== 0) {
                                    $scope.cacheStorageItem.OcularMotilityArray.push(object);
                                }
                                break;
                        }
                    });
                }
                if (mitem.CategoryID === 4) {
                    $scope.cacheStorageItem.TonometryTestArray = [];
                    mitem.CategoryConditions.forEach(function (item, index) {
                        if (item.InvestigationAttributeValues !== undefined && item.InvestigationAttributeValues !== null) {
                            item.BeforeDilation = item.InvestigationAttributeValues;
                            var object = {
                                "RightEye": "",
                                "LeftEye": "",
                                "Time": ""
                            };
                            item.AfterDilation = object;
                        }
                        if (item.InvestigationId === 22 && item.Value !== "" && item.Value !== null) {
                            item.BeforeDilationValue = item.Value;
                            item.AfterDilationValue = "";
                        }
                        var count = CheckExist(item.BeforeDilation);
                        var aftercount = AfterCheckExist(item.AfterDilation);
                        if ((count > 0 || (item.InvestigationDesc === 'Digital' && item.BeforeDilationValue !== "")) || (aftercount > 0 || (item.InvestigationDesc === 'Digital' && item.AfterDilationValue !== ""))) {
                            $scope.cacheStorageItem.TonometryTestArray.push(item);
                        }
                    });
                }
                if (mitem.CategoryID === 7) {
                    mitem.CategoryConditions.forEach(function (item) {

                        if (item.InvestigationId === 43) {
                            object = {
                                "InvestigationId": item.InvestigationId,
                                "InvestigationDesc": item.InvestigationDesc,
                                "Remarks": item.Remarks,
                                "Attributes": {
                                    "type": 'Distance',
                                    "RSphere": item.Attributes.RSphere,
                                    "RCylinder": item.Attributes.RCylinder,
                                    "RAxis": item.Attributes.RAxis,
                                    "RPrism": item.Attributes.RPrism,
                                    "RBase": item.Attributes.RBase,
                                    "RVa": item.Attributes.RVa,
                                    "RUVa": item.Attributes.RUVa,
                                    "RAdd": item.Attributes.RAdd,
                                    "RBcva": item.Attributes.RBcva,
                                    "RIPD": item.Attributes.RIPD,
                                    "LSphere": item.Attributes.LSphere,
                                    "LCylinder": item.Attributes.LCylinder,
                                    "LAxis": item.Attributes.LAxis,
                                    "LPrism": item.Attributes.LPrism,
                                    "LBase": item.Attributes.LBase,
                                    "LVa": item.Attributes.LVa,
                                    "LAdd": item.Attributes.LAdd,
                                    "LBcva": item.Attributes.LBcva,
                                    "LIPD": item.Attributes.LIPD,
                                    "LUVa": item.Attributes.LUVa
                                },
                                "LensType": item.LensType,
                                "LensCoating": item.LensCoating,
                                "IPD": item.IPD || ""
                            };
                        }

                        if (item.InvestigationId === 44) {
                            object = {
                                "InvestigationId": item.InvestigationId,
                                "InvestigationDesc": item.InvestigationDesc,
                                "Remarks": item.Remarks,
                                "Attributes": {
                                    "type": 'Distance',
                                    "RSphere": item.Attributes.RSphere,
                                    "RCylinder": item.Attributes.RCylinder,
                                    "RAxis": item.Attributes.RAxis,
                                    "RPrism": item.Attributes.RPrism,
                                    "RBase": item.Attributes.RBase,
                                    "RVa": item.Attributes.RVa,
                                    "RUVa": item.Attributes.RUVa,
                                    "RAdd": item.Attributes.RAdd,
                                    "RBcva": item.Attributes.RBcva,
                                    "LSphere": item.Attributes.LSphere,
                                    "LCylinder": item.Attributes.LCylinder,
                                    "LAxis": item.Attributes.LAxis,
                                    "LPrism": item.Attributes.LPrism,
                                    "LBase": item.Attributes.LBase,
                                    "LVa": item.Attributes.LVa,
                                    "LAdd": item.Attributes.LAdd,
                                    "LBcva": item.Attributes.LBcva,
                                    "LUVa": item.Attributes.LUVa
                                },
                                "LensType": item.LensType,
                                "LensCoating": item.LensCoating,
                                "TypeOfLens": item.TypeOfLens || []
                            };
                        }
                        $scope.cacheStorageItem.GlassPrescriptionArray.push(object);
                    });
                }
                if (mitem.CategoryID === 256) {
                    mitem.CategoryConditions.forEach(function (item, index) {
                        if (item.InvestigationId === 1902) {
                            if (item.RightEyeRemarks !== "" || item.LeftEyeRemarks !== ""
                                || item.RightEye.RightValue !== "" || item.RightEye.LeftValue !== "" || item.RightEye.TopValue !== "" || item.RightEye.BottomValue !== ""
                                || item.LeftEye.RightValue !== "" || item.LeftEye.LeftValue !== "" || item.LeftEye.TopValue !== "" || item.LeftEye.BottomValue !== "") {
                                $scope.cacheStorageItem.GonioscopyArray.push(item);
                            }
                        }
                        if (item.InvestigationId === 1978 || item.InvestigationId === 1979 || item.InvestigationId === 1980 || item.InvestigationId === 1981 || item.InvestigationId === 1982 || item.InvestigationId === 1983 || item.InvestigationId === 1984) {
                            var RRemarks = item.RightEyeRemarks;
                            var LRemarks = item.LeftEyeRemarks;

                            if (item.RightEyeArray === undefined) {
                                item.RightEyeArray = [];
                            }
                            if (item.LeftEyeArray === undefined) {
                                item.LeftEyeArray = [];
                            }
                            var RECdRatio = item.RightEyeCdRatio;
                            var LECdRatio = item.LeftEyeCdRatio;
                            var LEFreq = item.LeftEyeFreq;
                            var REFreq = item.RightEyeFreq;
                            var RightImageArray = [];
                            if (item.RightEyeArray.length > 0) {
                                angular.forEach(item.RightEyeArray, function (initem) {
                                    if (initem.DocURL) {
                                        if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                            RightImageArray.push({
                                                "url": initem.DocURL,
                                                "thumbUrl": initem.DocURL
                                            });
                                        }
                                    }
                                });
                            }
                            var LeftImageArray = [];
                            if (item.LeftEyeArray && item.LeftEyeArray.length > 0) {
                                angular.forEach(item.LeftEyeArray, function (initem) {
                                    if (initem.DocURL) {
                                        if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                            LeftImageArray.push({
                                                "url": initem.DocURL,
                                                "thumbUrl": initem.DocURL
                                            });
                                        }
                                    }
                                });
                            }
                            if (item.RightEyeRemarks !== "" || item.LeftEyeRemarks !== "" || item.RightEyeArray.length > 0 || item.LeftEyeArray.length > 0 || item.RightEyeCdRatio !== "" || item.LeftEyeCdRatio !== "" || item.LeftEyeFreq !== "" || item.RightEyeFreq !== "") {
                                var object = {
                                    "CategoryId": mitem.CategoryID,
                                    "Category": mitem.CategoryDesc,
                                    "Remarks": Remarks,
                                    "InvestigationId": item.InvestigationId,
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
                                $scope.cacheStorageItem.GonioscopyArray.push(object);
                            }
                        }
                    });
                }


                if (mitem.CategoryID === 296) {
                    $scope.mainDryEyePrintArray = [];
                    mitem.CategoryConditions.forEach(function (item, index) {

                        if (item.InvestigationId === 2079) {

                            if (item.Remarks !== ""
                                || item.RightEye.RightEyeType !== "" || item.RightEye.RightEyemm !== "" || item.RightEye.RightEyemin !== "" || item.RightEye.RightK1Value !== "" || item.RightEye.RightK2Value !== "" || item.RightEye.Angle1 !== "" || item.RightEye.Angle2 !== "" || item.LeftEye.LeftEyeType !== "" || item.LeftEye.LeftEyemm !== "" || item.LeftEye.LeftEyemin !== "" || item.LeftEye.LeftK1Value !== "" ||
                                item.LeftEye.LeftK2Value !== "" || item.LeftEye.Angle1 !== "" || item.LeftEye.Angle2 !== ""
                            ) {
                                $scope.cacheStorageItem.DryEyeEvaluationArray.push(item);
                            }

                            $scope.mainDryEyePrintArray.push({
                                "InvestigationName": item.InvestigationDesc || "",
                                "RightEye": item.RightEye,
                                "LeftEye": item.LeftEye,
                                "Remarks": item.Remarks,

                            });

                        }
                        if (item.InvestigationId === 2080 || item.InvestigationId === 2081 || item.InvestigationId === 2082) {
                            var RRemarks = item.RightEyemm;
                            var LRemarks = item.LeftEyemm;


                            var RightImageArray = [];
                            if (item.RightEyeArray.length > 0) {
                                angular.forEach(item.RightEyeArray, function (initem) {
                                    if (initem.DocURL) {
                                        if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                            RightImageArray.push({
                                                "url": initem.DocURL,
                                                "thumbUrl": initem.DocURL
                                            });
                                        }
                                    }
                                });
                            }
                            var LeftImageArray = [];
                            if (item.LeftEyeArray && item.LeftEyeArray.length > 0) {
                                angular.forEach(item.LeftEyeArray, function (initem) {
                                    if (initem.DocURL) {
                                        if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                            LeftImageArray.push({
                                                "url": initem.DocURL,
                                                "thumbUrl": initem.DocURL
                                            });
                                        }
                                    }
                                });
                            }
                            if (item.RightEyemm !== "" || item.LeftEyemm !== "" || item.RightEyeArray.length > 0 || item.LeftEyeArray.length > 0) {
                                var object = {
                                    "CategoryId": item.CategoryId,
                                    "Category": item.Category,
                                    "Remarks": Remarks || "",
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "InvestigationDetails": {
                                        "RightEyemm": RRemarks,
                                        "LeftEyemm": LRemarks,
                                        "RightEyeImage": RightImageArray,
                                        "LeftEyeImage": LeftImageArray
                                    }
                                };

                                $scope.cacheStorageItem.DryEyeEvaluationArray.push(object);
                            }


                        }

                        if (item.InvestigationId === 2083) {

                            var RightImageArray = [];
                            if (item.RightEyeArray.length > 0) {
                                angular.forEach(item.RightEyeArray, function (initem) {
                                    if (initem.DocURL) {
                                        if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                            RightImageArray.push({
                                                "url": initem.DocURL,
                                                "DocURL": initem.DocURL,
                                                "thumbUrl": initem.DocURL,
                                                "Type": initem.Type || ""
                                            });
                                        }
                                    }
                                });
                            }
                            var LeftImageArray = [];
                            if (item.LeftEyeArray && item.LeftEyeArray.length > 0) {
                                angular.forEach(item.LeftEyeArray, function (initem) {
                                    if (initem.DocURL) {
                                        if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                            LeftImageArray.push({
                                                "url": initem.DocURL,
                                                "DocURL": initem.DocURL,
                                                "thumbUrl": initem.DocURL,
                                                "Type": initem.Type || ""
                                            });
                                        }
                                    }
                                });
                            }
                            if (item.RightEyeLissamineGreenmm !== "" || item.RightEyeRoseBengalmm !== "" || item.RightEyeFlouresceinmm !== "" || item.LeftEyeLissamineGreenmm !== "" || item.LeftEyeRoseBengalmm !== "" || item.LeftEyeFlouresceinmm !== "" || item.RightEyeArray.length > 0 || item.LeftEyeArray.length > 0) {
                                var object = {
                                    "CategoryId": item.CategoryId,
                                    "Category": item.Category,
                                    "Remarks": Remarks || "",
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "LeftEyeFlouresceinmm": item.LeftEyeFlouresceinmm,
                                    "LeftEyeRoseBengalmm": item.LeftEyeRoseBengalmm,
                                    "LeftEyeLissamineGreenmm": item.LeftEyeLissamineGreenmm,
                                    "RightEyeLissamineGreenmm": item.RightEyeLissamineGreenmm,
                                    "RightEyeRoseBengalmm": item.RightEyeRoseBengalmm,
                                    "RightEyeFlouresceinmm": item.RightEyeFlouresceinmm,
                                    "RightEyeArray": RightImageArray,
                                    "LeftEyeArray": LeftImageArray,

                                };
                                $scope.cacheStorageItem.DryEyeEvaluationArray.push(object);
                                //$scope.cacheStorageItem.DryEyeEvaluationArray.push(object);
                            }

                        }

                    });
                }

                if (mitem.CategoryID === 298) {
                    $scope.cacheStorageItem.LacrimalPatiency = [];
                    mitem.CategoryConditions.forEach(function (item, index) {
                        if (item.RightEyeInvestigationNote !== "" || item.LeftEyeInvestigationNote !== "") {
                            $scope.cacheStorageItem.LacrimalPatiency.push(item);
                        }
                    });
                }

                if (mitem.CategoryID === 299) {
                    $scope.cacheStorageItem.PostDilatedExaminationArray = [];
                    mitem.CategoryConditions.forEach(function (item, index) {
                        switch (item.InvestigationId) {

                            case 2097:
                                var object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "SubCategoryChildId": item.SubCategoryChildId,
                                    "RightEyeRemarks": item.RightEyeRemarks,
                                    "LeftEyeRemarks": item.LeftEyeRemarks,
                                    "PupilRightEye": item.PupilRightEye,
                                    "PupilLeftEye": item.PupilLeftEye
                                };

                                if (item.PupilRightEye.Type1 !== "" || item.PupilRightEye.Type2 !== "" || item.PupilLeftEye.Type1 !== "" || item.PupilLeftEye.Type2 !== "") {
                                    $scope.cacheStorageItem.PostDilatedExaminationArray.push(object);
                                }
                                break;

                            case 2098:
                                var object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "SubCategoryChildId": item.SubCategoryChildId,
                                    "LensRightEye": item.LensRightEye,
                                    "LensLeftEye": item.LensLeftEye
                                };
                                if (item.LensRightEye.NuclearCataract !== "" || item.LensRightEye.CorticalCataract !== "" || item.LensRightEye.PSC !== "" || item.LensRightEye.TotalCatract !== "" || item.LensLeftEye.NuclearCataract !== "" || item.LensLeftEye.CorticalCataract !== "" || item.LensLeftEye.PSC !== "" || item.LensLeftEye.TotalCatract !== "") {
                                    $scope.cacheStorageItem.PostDilatedExaminationArray.push(object);
                                }
                                break;
                            case 2099:
                                var object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "SubCategoryChildId": item.SubCategoryChildId,
                                    "CapsuleRightEye": item.CapsuleRightEye,
                                    "CapsuleLeftEye": item.CapsuleLeftEye
                                };
                                if (item.CapsuleRightEye.Intact.IsSelected !== "" || item.CapsuleLeftEye.Intact.IsSelected !== "") {
                                    $scope.cacheStorageItem.PostDilatedExaminationArray.push(object);
                                }
                                break;
                            case 2100:
                                var object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "SubCategoryChildId": item.SubCategoryChildId,
                                    "SpecialsituationsRightEye": item.SpecialsituationsRightEye,
                                    "SpecialsituationsLeftEye": item.SpecialsituationsLeftEye
                                };

                                if (item.SpecialsituationsRightEye.Traumaticcataract.IsChecked !== "" || item.SpecialsituationsRightEye.Subluxatedcataract.IsSelected !== "" || item.SpecialsituationsRightEye.Phacodonesis.IsSelected !== "" || item.SpecialsituationsLeftEye.Traumaticcataract.IsChecked !== "" || item.SpecialsituationsLeftEye.Subluxatedcataract.IsSelected !== "" || item.SpecialsituationsLeftEye.Phacodonesis.IsSelected !== "") {
                                    $scope.cacheStorageItem.PostDilatedExaminationArray.push(object);
                                }
                                break;
                            case 2101:
                                var object = {
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "SubCategoryChildId": item.SubCategoryChildId,
                                    "AnteriorVitreousRightEye": item.AnteriorVitreousRightEye,
                                    "AnteriorVitreousLeftEye": item.AnteriorVitreousLeftEye
                                };

                                if (item.AnteriorVitreousRightEye !== "" || item.AnteriorVitreousLeftEye != "") {
                                    $scope.cacheStorageItem.PostDilatedExaminationArray.push(object);
                                }
                                break;
                        }

                    });
                }
            });
            $scope.mainColorVisionPrintArray = [];
            if ($scope.cacheStorageItem.InvestigationDetails) {
                $scope.cacheStorageItem.InvestigationDetails.forEach(function (itm) {
                    if (itm.CategoryID === 2) {
                        itm.CategoryConditions.forEach(function (itm2) {
                            if (itm2.Active === "Y") {
                                var obj = {
                                    "InvestigationName": "",
                                    "InvestigationNotes": "",
                                    "LeftEyeInvestigationNote": ""
                                };
                                obj.InvestigationName = itm2.InvestigationDesc;
                                obj.InvestigationNotes = itm2.InvestigationNote;
                                obj.LeftEyeInvestigationNote = itm2.LeftEyeInvestigationNote || "";
                                $scope.mainColorVisionPrintArray.push(obj);
                            }
                        });
                    }
                });
            }
            var tonoFlag = false;
            if ($scope.cacheStorageItem.InvestigationDetails !== undefined) {
                for (var i = 0; i < $scope.cacheStorageItem.InvestigationDetails.length; i++) {
                    if ($scope.cacheStorageItem.InvestigationDetails[i].CategoryID === 4) {
                        for (var j = 0; j < $scope.cacheStorageItem.InvestigationDetails[i].CategoryConditions.length; j++) {
                            if (($scope.cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues && $scope.cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues.RightEye) || ($scope.cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues && $scope.cacheStorageItem.InvestigationDetails[i].CategoryConditions[j].InvestigationAttributeValues.LeftEye)) {
                                tonoFlag = true;
                            }
                        }
                    }
                }
            }
        }

        $scope.mainVisionPrintArray = [
            { type: "unaided", bindArray: $scope.cacheStorageItem.UnaidedArray },
            { type: "Refraction", bindArray: $scope.cacheStorageItem.RefractionArray },
            { type: "Acceptence", bindArray: $scope.cacheStorageItem.AcceptenceArray },
            { type: "AnteriorSegment", bindArray: $scope.cacheStorageItem.AnteriorSegmentArray },
            { type: "PosteriorSegment", bindArray: $scope.cacheStorageItem.PosteriorSegmentArray },
            { type: "Pinhole", bindArray: $scope.cacheStorageItem.PinholeArray },
            { type: "Keretometer", bindArray: $scope.cacheStorageItem.KeretometerArray },
            { type: "OcularDominance", bindArray: $scope.cacheStorageItem.OcularDominanceArray },
            { type: "LCVA", bindArray: $scope.cacheStorageItem.LCVArray },
            { type: "Binocular", bindArray: $scope.cacheStorageItem.BinocularArray },
            { type: "AdditionalInvestgation", bindArray: $scope.cacheStorageItem.AdditionalInvestgationArray },
            { type: "AR", bindArray: $scope.cacheStorageItem.ArRefractionArray },
            { type: "Gonioscopy", bindArray: $scope.cacheStorageItem.GonioscopyArray },
            { type: "PostMydriaticTest", bindArray: $scope.cacheStorageItem.PostMydriaticTestArray },
        ];
        if ($scope.mainVisionPrintArray.length > 0) {
            var i = 0;
            $scope.mainVisionPrintArray.forEach(function (item) {
                if (item.bindArray.length === 0) {
                    i++;
                }
            });
            $scope.visionDivShowHide = $scope.mainVisionPrintArray.length > 0 && $scope.mainVisionPrintArray.length !== i ? true : false;
        }
        $scope.cacheStorageItem.mainVisionPrintArray = $scope.mainVisionPrintArray;
        //$scope.cacheStorageItem.mainColorVisionPrintArray = $scope.mainColorVisionPrintArray;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    };

    $scope.CheckedOutPatientsList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "Date": $scope.ToDate,
            "IsCheckedOut": 1
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetCheckedOutPatientsList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.OutPatientsList = resp.data.rows || [];
            }
            else {
                $scope.OutPatientsList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });
    };

    $scope.CheckedINPatientsList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "Date": $scope.ToDate,
            "IsCheckedOut": 0
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetCheckedOutPatientsList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.INPatientsList = resp.data.rows || [];
            }
            else {
                $scope.OutPatientsList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });
    };
    $scope.CheckedOutPatientsList();



    $scope.selectedDoctor = {
        "Doctorobj": "",
        "DoctorId": 0
    }
    $scope.ChangesDoctor = function (item, type) {
        $scope.selectedDoctor.DoctorId = item.DoctorID || 0;
        var params = {
            "HospitalId": $scope.obj.HospitalId,
            "RoomTypeId": type,
            "Date": $scope.ToDate,
            "UserId": $scope.selectedDoctor.DoctorId
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                if (type === 1) {
                    $scope.DoctorWaitingRoomList = resp.data.rows || [];
                }
                else if (type === 2) {
                    $scope.OptomWaitingRoomList = resp.data.rows || [];
                }
                else if (type === 3) {
                    $scope.DilationWaitingRoomList = resp.data.rows || [];
                }
                else if (type === 4) {
                    $scope.CounsellorWaitingRoomList = resp.data.rows || [];
                }
                else if (type === 5) {
                    $scope.InvestigationWaitingRoomList = resp.data.rows || [];
                }

            }
            else {
                $scope.DoctorWaitingRoomList = [];
                $scope.OptomWaitingRoomList = [];
                $scope.DilationWaitingRoomList = [];
                $scope.CounsellorWaitingRoomList = [];
                $scope.InvestigationWaitingRoomList = [];

            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });
    }

    $scope.ChangesActiveDoctor = function (item, type) {
        $scope.selectedDoctor.DoctorId = item.DoctorID || 0;
        var params = {
            "HospitalId": $scope.obj.HospitalId,
            "RoomTypeId": type,
            "Date": $scope.ToDate,
            "UserId": $scope.selectedDoctor.DoctorId
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusActiveList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                if (resp.data.rows.length > 0) {
                    //angular.forEach(data, function (item) {
                    //    var obj = {
                    //        "PatientId": item.PatientId,
                    //        "AppointmentId": item.AppointmentId
                    //    }
                    //    eHnotePatientDataService.GetDilationHistory(obj).then(function (resp) {
                    //        $scope.DilationHistoryArray = resp.data.rows || [];
                    //        if ($scope.DilationHistoryArray.length > 0) {
                    //            item.IsDilationDone = true;
                    //            angular.forEach($scope.DilationHistoryArray, function (kitem) {
                    //                kitem.Duration = "";
                    //                if (kitem.DilationEndTime != null && kitem.DilationStartTime != null) {
                    //                    var ms = moment(kitem.DilationEndTime, "YYYY-MM-DD HH:mm:ss").diff(moment(kitem.DilationStartTime, "YYYY-MM-DD HH:mm:ss"));
                    //                    var d = moment.duration(ms);
                    //                    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
                    //                    kitem.Duration = s;
                    //                }
                    //            });
                    //        }
                    //    });
                    //});
                }
                $scope.DoctorActiveRoomListcount = resp.data || [];
                if (type === 1) {
                    $scope.DoctorWaitingRoomList = resp.data.rows || [];
                }
                else if (type === 2) {
                    $scope.OptomWaitingRoomList = resp.data.rows || [];
                }
                else if (type === 3) {
                    $scope.DilationWaitingRoomList = resp.data.rows || [];
                }
                else if (type === 4) {
                    $scope.CounsellorWaitingRoomList = resp.data.rows || [];
                }
                else if (type === 5) {
                    $scope.InvestigationWaitingRoomList = resp.data.rows || [];
                }
               
            }
            else {
                $scope.DoctorWaitingRoomList = [];
                $scope.OptomWaitingRoomList = [];
                $scope.DilationWaitingRoomList = [];
                $scope.CounsellorWaitingRoomList = [];
                $scope.InvestigationWaitingRoomList = [];

            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });
    }


    $scope.GetOrgDilationMedication = function (HospitalID) {

        eHnoteSettingsDataService.GetOrgDilationMedication("", HospitalID)
            .success(function (data) {
                $scope.DilationList = data;
                var medobj = $filter("filter")($scope.DilationList, { "IsDefault": true }, true) || [];
                $scope.MedicationObj = medobj.length !== 0 ? medobj[0] : '';

            })
            .error(function (error) {
                alertify.error("Check internet connectivity");
            });

    };
    $scope.GetPatientDynamicStatusCount = function () {

        var subList = [];
        angular.forEach($scope.allSubSpecializationsArray, function (mitems) {
            if (mitems.isChecked) {
                subList.push(mitems.SubSpecializationId);
            }
        });
        var params = {
            "HospitalId": $scope.obj.HospitalId || $scope.hospid,
            "Date": $scope.ToDate,
            "SpecializationId": $scope.selectedSpecializationId || 0,
            "SubSpecializationIds": subList,
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusForMobile(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.PatientStatusCount = resp.data || [];

                $scope.PatientStatusCount.ARRoomCount = $scope.PatientStatusCount.ARRoomCount || 0;
                $scope.PatientStatusCount.ARRoomActiveCount = $scope.PatientStatusCount.ARRoomActiveCount || 0;

            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });
    }
    $scope.GetPatientDynamicStatusCount();


    $scope.PatientDoctorWaitingRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 1,
            "Date": $scope.ToDate,
            "UserId": $scope.selectedDoctor.DoctorId || 0

        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.DoctorWaitingRoomList = resp.data.rows || [];
                angular.forEach($scope.DoctorWaitingRoomList, function (item) {
                    if (item.AppointmentDoctorID === $scope.selectedDoctor.DoctorID || $scope.OrganizationSettingsData.ConsultationSettings.IsConsultationRestricted === 0) {
                        item.startConsultationEntryAccess = true;
                    }
                    else {
                        item.startConsultationEntryAccess = false;
                    }
                    //if ($scope.OrganizationSettingsData.ConsultationSettings !== undefined) {
                    //    if ($scope.OrganizationSettingsData.ConsultationSettings.IsConsultationRestricted === 1) {
                    //        item.startConsultationEntryAccess = true;
                    //    } else {
                    //        item.startConsultationEntryAccess = false;
                    //    }
                    //}

                    //else {
                    //    item.startConsultationEntryAccess = false;
                    //}
                    //}
                });
            }
            else {
                $scope.DoctorWaitingRoomList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });
    }
    // $scope.PatientDoctorWaitingRoomList();

    $scope.PatientOptomWaitingRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 2,
            "Date": $scope.ToDate
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.OptomWaitingRoomList = resp.data.rows || [];

            }
            else {
                $scope.DoctorWaitingRoomList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };


    $scope.PatientARWaitingRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 8,
            "Date": $scope.ToDate
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.ARWaitingRoomList = resp.data.rows || [];

            }
            else {
                $scope.DoctorWaitingRoomList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };


    $scope.PatientDilationWaitingRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 3,
            "Date": $scope.ToDate
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.DilationWaitingRoomList = resp.data.rows || [];
            }
            else {
                $scope.DilationWaitingRoomList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }
    //  $scope.PatientDilationWaitingRoomList();

    $scope.PatientInvestigationWaitingRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 5,
            "Date": $scope.ToDate
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.InvestigationWaitingRoomList = resp.data.rows || [];
            }
            else {
                $scope.InvestigationWaitingRoomList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }
    $scope.PatientInvestigationWaitingRoomList();

    $scope.PatientCounsellorWaitingRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 4,
            "Date": $scope.ToDate
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.CounsellorWaitingRoomList = resp.data.rows || [];

            }
            else {
                $scope.CounsellorWaitingRoomList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }
    //   $scope.PatientCounsellorWaitingRoomList();

    $scope.PatientDoctorActiveRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 1,
            "UserId": 0,
            "Date": $scope.ToDate
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusActiveList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.DoctorActiveRoomList = resp.data.rows || [];
                $scope.DoctorActiveRoomListcount = resp.data || [];

            }
            else {
                $scope.DoctorActiveRoomList = [];

            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };
    $scope.PatientDoctorActiveRoomList();

    $scope.PatientOptomActiveRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 2,
            "UserId": 0,
            "Date": $scope.ToDate
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusActiveList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.OptomActiveRoomList = resp.data.rows || [];
                $scope.DoctorActiveRoomListcount = resp.data || [];
            }
            else {
                $scope.OptomActiveRoomList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };

    $scope.PatientARActiveRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 8,
            "UserId": 0,
            "Date": $scope.ToDate
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusActiveList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.ARActiveRoomList = resp.data.rows || [];
                $scope.DoctorActiveRoomListcount = resp.data || [];
            }
            else {
                $scope.OptomActiveRoomList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };




    $scope.PatientCounsellorActiveRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 4,
            "UserId": 0,
            "Date": $scope.ToDate
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusActiveList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.CounsellorActiveRoomList = resp.data.rows || [];
                $scope.DoctorActiveRoomListcount = resp.data || [];
                //$scope.OptomActiveRoomListcount = resp.data || [];              
            }
            else {
                $scope.CounsellorActiveRoomList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };

    $scope.PatientInvestigationActiveRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 5,
            "UserId": 0,
            "Date": $scope.ToDate
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusActiveList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.InvestigationActiveRoomList = resp.data.rows || [];
                $scope.DoctorActiveRoomListcount = resp.data || [];
                //$scope.OptomActiveRoomListcount = resp.data || [];              
            }
            else {
                $scope.InvestigationActiveRoomList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };
    //$scope.PatientDoctorActiveRoomList();



    //   --------------------------------------------------------------------------------------------   Dilation
    var mInstanceAdd;
    $scope.SaveDilation = function (MedicationObj, DilationSelectedEye) {
        MedicationObj.OrganId = DilationSelectedEye;
        mInstanceAdd.close(MedicationObj);
    };
    $scope.ActiveStratDilation = function (item) {


        $scope.Time = $filter("date")(new Date(), "HH:mm");
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": item.PatientId,
            "AppointmentId": item.AppointmentId,
            "RoomId": item.RoomId,
            "RoomTypeId": item.RoomTypeId,
            "NextCounterId": item.RoomTypeId,
            "PreviousCounterId": item.NextCounterId || null,
            "StartTime": $scope.Time,
            "PatientDynamicStatusId": 0,
            "Status": "Active",
            "DoctorId": null,
            "OptomId": null,
            "ARId":null,
            "DilationAssistantId": item.DilationAssistantId,
            "CounsellorId": null,
            "IsCheckedOut": false,
            "RoleId": $scope.userLoginDetails.RoleID
        }
        if (params.RoomTypeId === 7) {
            params.RoomId = null;
            params.IsCheckedOut = true;
            params.Status = 'Completed';
        }
        eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.PatientDilationActiveRoomList();
                $scope.PatientDilationWaitingRoomList();
                $scope.GetPatientDynamicStatusCount();

            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });





    };

    $scope.StratDilation = function (item) {

        if ($scope.DilationList.length !== 0) {
            mInstanceAdd = $uibModal.open({
                templateUrl: "DilationMedicationpopup.html",
                backdrop: "static",
                scope: $scope,
                size: "sm"

            });
            mInstanceAdd.result.then(function (MedicationObj) {

                ContinueDilation(item, MedicationObj);
            }, function () {
            });
        } else {
            ContinueDilation(item, "");
        }

    }

    function ContinueDilation(item, MedicationObj) {
        item.isDilationstarted = true;
        item.DilationMedicationName = MedicationObj ? MedicationObj.MedicationName : "";
        item.DilationMedicationId = MedicationObj ? MedicationObj.MedicationId : "";
        item.DilationStartTime = $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss");
        item.OrganId = MedicationObj.OrganId;
        // $scope.ModifyPatientDilation(item)
        var parms = {
            "DilationStartTime": item.DilationStartTime,
            "DilationEndTime": null,
            "AppointmentId": item.AppointmentId,
            "DilationMedicationId": MedicationObj ? MedicationObj.MedicationId : "",
            "OrganId": MedicationObj.OrganId,
            "UserId": eHnoteMasterDataService.getLoginId()
        };
        eHnotePatientDataService.ModifyPatientDilation(parms, onsuccess, onerror);
        function onsuccess(resp) {
            if (resp.data[0].Status === "Success") {

                item.ItemScope = $interval(function () { $scope.callAtInterval(item); }, 1000);
                if ($scope.Tab === 'dilation') {
                    $scope.loadDilationAppointments($scope.selectedDoctor);
                }
            }
        }
        function onerror(error) {
            console.log(error);
        }
    }
    $scope.Closemed = function () {
        mInstanceAdd.dismiss('Cancel');
    };
    $scope.callAtInterval = function (item) {

        if (item.DilationStartTime !== undefined) {
            var now = $filter("date")(new Date(), "dd/MM/yyyy HH:mm:ss");
            var then = $filter("date")(new Date(item.DilationStartTime), "dd/MM/yyyy HH:mm:ss");
            var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"));
            var d = moment.duration(ms);
            var h = d.hours();
            var m = d.minutes();
            var sec = d.seconds();
            item.Conunter = m + ":" + sec;
            if (h > 0) {
                item.isDilationstarted = true;

                $interval.cancel(item.ItemScope);
                item.Conunter = "59:00";
            }
        }


    };
    $scope.StopDilation = function (item) {
     

        mInstanceAdd = $uibModal.open({
            templateUrl: "DilationRemarkspopup.html",
            backdrop: "static",
            scope: $scope,
            size: "sm"
        });

        $scope.SaveRemarks = function (remarks) {
            item.isDilationstarted = false;
            $interval.cancel(item.ItemScope);
            item.Conunter = "00:00";
            var parms = {
                "DilationStartTime": item.DilationStartTime,
                "DilationEndTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                "AppointmentId": item.AppointmentId,
                "DilationMedicationId": item.DilationMedicationId,
                "OrganId": item.OrganId,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "Remarks": remarks || ""
            };
            eHnotePatientDataService.ModifyPatientDilation(parms, onsuccess, onerror);
            function onsuccess(resp) {
                $scope.DilationRemarks = "";
                mInstanceAdd.dismiss('Cancel');
                item.Conunter = "Done";
                //$scope.PatientDilationActiveRoomList();
            }
            function onerror(error) {
                console.log(error);
            }
        }
        //var parms = {
        //    "DilationStartTime": item.DilationStartTime,
        //    "DilationEndTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //    "AppointmentId": item.AppointmentId,
        //    "DilationMedicationId": item.DilationMedicationId,
        //    "OrganId": item.OrganId,
        //    "UserId": eHnoteMasterDataService.getLoginId()
        //};
        //eHnotePatientDataService.ModifyPatientDilation(parms, onsuccess, onerror);
        //function onsuccess(resp) {
        //    if (resp.data[0].Status === "Success") {
        //        $scope.PatientDilationActiveRoomList();
        //    }
        //}
        //function onerror(error) {
        //    console.log(error);
        //}
    };

    $scope.PatientDilationActiveRoomList = function () {
        var params = {
            "HospitalId": $scope.hospid,
            "RoomTypeId": 3,
            "UserId": 0,
            "Date": $scope.ToDate
        }
        params.Date = $filter("dateFormatter")(params.Date, "-");
        eHnoteMainAppointmentService.GetPatientDynamicStatusActiveList(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                $scope.DilationActiveRoomList = resp.data.rows || [];
                $scope.DoctorActiveRoomListcount = resp.data || [];
                if ($scope.DilationActiveRoomList.length !== 0) {
                  
                    angular.forEach($scope.DilationActiveRoomList, function (item) {
                        //var obj = {
                        //    "PatientId": item.PatientId,
                        //    "AppointmentId": item.AppointmentId
                        //}
                        //eHnotePatientDataService.GetDilationHistory(obj).then(function (resp) {
                        //    $scope.DilationHistoryArray = resp.data.rows || [];
                        //    if ($scope.DilationHistoryArray.length > 0) {
                        //        item.IsDilationDone = true;
                        //        angular.forEach($scope.DilationHistoryArray, function (kitem) {
                        //            kitem.Duration = "";
                        //            if (kitem.DilationEndTime != null && kitem.DilationStartTime != null) {
                        //                var ms = moment(kitem.DilationEndTime, "YYYY-MM-DD HH:mm:ss").diff(moment(kitem.DilationStartTime, "YYYY-MM-DD HH:mm:ss"));
                        //                var d = moment.duration(ms);
                        //                var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
                        //                kitem.Duration = s;
                        //            }
                        //        });
                        //    }
                        //});
                        item.DilationStartTime = item.DilationStartTime || undefined;
                        item.DilationEndTime = item.DilationEndTime || undefined;
                        if (item.DilationStartTime !== undefined) {
                            if (item.DilationEndTime === undefined) {
                                item.isDilationstarted = true;
                                item.ItemScope = $interval(function () { $scope.callAtInterval(item); }, 1000);
                            } else {
                                item.Conunter = "Done";
                            }

                        } else {
                            item.isDilationstarted = false;
                            item.Conunter = "00:00";
                        }

                    });
                }
            }
            else {
                $scope.DilationActiveRoomList = [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }
    $scope.PatientDilationActiveRoomList();

    $scope.SendToRoom = function (item) {
        if ($scope.RoomSearchObj.RoomCapacity !== 0) {
            if ($scope.RoomSearchObj.RoomAvailability === $scope.RoomSearchObj.RoomCapacity) {
                alertify.error("Patient limit for this room has been exceeded! Please select other Room");
                return false;
            }
        }
        $scope.Time = $filter("date")(new Date(), "HH:mm");
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": item.PatientId,
            "AppointmentId": item.AppointmentId,
            "RoomId": $scope.RoomSearchObj.RoomId,
            "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
            "NextCounterId": $scope.RoomSearchObj.RoomTypeId,
            "PreviousCounterId": item.NextCounterId || null,
            "StartTime": $scope.Time,
            "PatientDynamicStatusId": 0,
            "Status": "Waiting",
            "DoctorId": item.AppointmentDoctorID,
            "OptomId": $scope.RoomSearchObj.OptomId,
            "ARId": $scope.RoomSearchObj.ARId,
            "TechnicianId": $scope.RoomSearchObj.TechnicianId,
            "DilationAssistantId": $scope.RoomSearchObj.DilationAssistantId,
            "CounsellorId": $scope.RoomSearchObj.CounsellorId,
            "IsCheckedOut": false,
            "RoleId": $scope.userLoginDetails.RoleID

        }
        if (params.RoomTypeId === 7) {
            params.RoomId = null;
            params.IsCheckedOut = true;
            params.Status = 'Completed';
        }
        eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.mInstanceAdd.dismiss("cancel");
                $scope.PatientDilationActiveRoomList();
                $scope.PatientDilationWaitingRoomList();
                $scope.GetPatientDynamicStatusCount();

            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }

    $scope.SendToOtherRoom = function (item) {
        $scope.Patientlistdata = item;
        $scope.Patientlistdata.fullName = item.PatientName;
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "ViewAvaliableSlots1.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "md",
        });
    };
    $scope.closeRoom = function () {
        $scope.mInstanceAdd.dismiss("cancel");
    };
    $scope.ChangesRoomType = function (item) {
        $scope.Patientlistdata.OptometristId = $scope.Patientlistdata.OptometristId || null;
        $scope.RoomSearchObj.RoomTypeId = item.Id;
        if ($scope.RoomSearchObj.RoomTypeId === 1) {
            if ($scope.Patientlistdata.AppointmentDoctorId !== null) {
                $scope.RoomSearchObj.Doctorobj = _.where($scope.AllDoctorList, { "DoctorID": $scope.Patientlistdata.AppointmentDoctorId })[0];
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 2) {
            if ($scope.Patientlistdata.OptometristId !== null) {
                $scope.RoomSearchObj.Opthamobj = _.where($scope.AllOpthaList, { "DoctorID": $scope.Patientlistdata.OptometristId })[0];
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 8) {
            if ($scope.Patientlistdata.ARassistantId !== null) {
                $scope.RoomSearchObj.ARobj = _.where($scope.AllARList, { "DoctorID": $scope.Patientlistdata.ARassistantId })[0];
            }
        }
        var params = {
            "HospitalId": $scope.Patientlistdata.HospitalId,
            "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
            "SearchText": "",
            "PageNumber": 1,
            "PageSize": 100
        }
        eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
            if (data.Status === "Success") {
                $scope.RoomListarray = data.rows || [];
            } else {
                $scope.RoomListarray = [];
            }


        }).error(function (error) {

        });
    };

    $scope.ChangesRoom = function (item) {
        item = item || null;
        if (item !== null) {
            $scope.RoomSearchObj.RoomId = item.RoomId || 0;
            $scope.RoomSearchObj.RoomAvailability = item.RoomAvailability || 0;
            $scope.RoomSearchObj.RoomCapacity = item.RoomCapacity || 0;
        } else {
            $scope.RoomSearchObj.RoomId = 0;
            $scope.RoomSearchObj.RoomAvailability = 0;
            $scope.RoomSearchObj.RoomCapacity = 0;
        }

    };

    $scope.viewTracking = function (item) {
        console.log(item);
        $scope.mInstanceTracking = $uibModal.open({
            "templateUrl": "viewpatienttracking.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            //windowClass: 'eh-patientmap',
            //"controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {

            //}
        });
        var params = {
            "AppointmentId": item.AppointmentId
        }
        eHnoteMainAppointmentService.GetPatientDynamicStatusById(params).success(function (data) {
            if (data.Status === "Success") {
                $scope.PatientTrackingList = data.rows || [];
            } else {
                $scope.PatientTrackingList = [];
            }


        }).error(function (error) {

        });

    }
    $scope.closeTrackingPopup = function () {
        $scope.mInstanceTracking.dismiss("cancel");
    };

    $scope.SendToInvestigation = function (item) {
        $scope.SelectedInvestiagtionPatient = item;
        $scope.allUserList = $scope.allUserList;

        $scope.Time = $filter("date")(new Date(), "HH:mm");
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": item.PatientId,
            "AppointmentId": item.AppointmentId,
            "RoomId": item.RoomId,
            "RoomTypeId": item.RoomTypeId,
            "NextCounterId": item.RoomTypeId,
            "PreviousCounterId": item.NextCounterId || null,
            "StartTime": $scope.Time,
            "PatientDynamicStatusId": 0,
            "Status": "Active",
            "DoctorId": item.AppointmentDoctorID,
            "OptomId": null,
            "ARId":null,
            "DilationAssistantId": null,
            "CounsellorId": null,
            "IsCheckedOut": false,
             "RoleId": $scope.userLoginDetails.RoleID
        }
        if (params.RoomTypeId === 7) {
            params.RoomId = null;
            params.IsCheckedOut = true;
            params.Status = 'Completed';
        }
        eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {
            if (resp.data.Status === "Success") {
                eHnoteMasterDataService.addInvestigationPatientId($scope.SelectedInvestiagtionPatient, $scope.allUserList);
                $location.path("/Investigation");
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });


        //var object = {
        //    "tabno": 'investigations',
        //    "Patientdata": item
        //};
        //$scope.$emit('investigationsPageEvent', { "object": object });
        //$rootScope.Tab ='investigations'
        //$location.path("/investigations");  
        //$location.path("/op");
        //$rootScope.Comingfrom = "investigations";
    };
    $scope.ChangeInvDate = function (item) {
        $scope.ToDate = item;
        $scope.GetAppointmentslist();
        $scope.GetPatientDynamicStatusCount();
        $scope.PatientDoctorActiveRoomList();
        $scope.CheckedOutPatientsList();
        $scope.PatientDoctorWaitingRoomList();
    }

    $scope.SearchDynamicStatus = function () {

        $scope.GetAppointmentslist();
        $scope.GetPatientDynamicStatusCount();
        $scope.PatientDoctorActiveRoomList();
        $scope.CheckedOutPatientsList();
        $scope.PatientDoctorWaitingRoomList();
    }



    $scope.SendToCounsellor = function (item) {
        $scope.SelectedCounsellorPatient = item;
        eHnoteMasterDataService.addCounsellorPatientId($scope.SelectedCounsellorPatient);
        $location.url("/Counsellor");
    }



    ////////////////////////////////////////////--start--/////////////////////////////

    $scope.SubTab = 11;
   
    $scope.changeSubTab = function (val) {
        $scope.SubTab = val;
        if ($scope.SubTab === 1) {
            $scope.PatientDoctorWaitingRoomList();

        }
        if ($scope.SubTab === 2) {
            $scope.PatientOptomWaitingRoomList();
        }
        if ($scope.SubTab === 14) {
            $scope.PatientARWaitingRoomList();
        }
        if ($scope.SubTab === 15) {
            $scope.PatientARActiveRoomList();
        }
        if ($scope.SubTab === 3) {
            $scope.PatientDilationWaitingRoomList();
        }
        if ($scope.SubTab === 4) {
            $scope.PatientCounsellorWaitingRoomList();
        }
        if ($scope.SubTab === 5) {
            $scope.PatientInvestigationWaitingRoomList();
        }

        if ($scope.SubTab === 6) {
            $scope.PatientDoctorActiveRoomList();
        }
        if ($scope.SubTab === 7) {
            $scope.PatientOptomActiveRoomList();
        }
        if ($scope.SubTab === 8) {
            $scope.GetOrgDilationMedication($scope.hospid);
            $scope.PatientDilationActiveRoomList();
        }
        if ($scope.SubTab === 9) {
            $scope.PatientCounsellorActiveRoomList();
        }
        if ($scope.SubTab === 10) {
            $scope.PatientInvestigationActiveRoomList();
        }
        if ($scope.SubTab === 11) {
            $scope.GetAppointmentslist();
        }
        if ($scope.SubTab === 12) {
            $scope.CheckedINPatientsList();
        }
        if ($scope.SubTab === 13) {
            $scope.CheckedOutPatientsList();
        }
    };
    //$scope.changeActiveSubTab = function (val) {
    //    $scope.ActiveSubtab = val;
    //    if ($scope.SubTab === 1) {
    //        $scope.PatientDoctorActiveRoomList();
    //    }
    //    if ($scope.ActiveSubtab === 2) {
    //        $scope.PatientOptomActiveRoomList();
    //    }
    //    if ($scope.ActiveSubtab === 3) {
    //        $scope.GetOrgDilationMedication($scope.hospid);
    //        $scope.PatientDilationActiveRoomList();
    //    }
    //    if ($scope.ActiveSubtab === 4) {
    //        $scope.PatientCounsellorActiveRoomList();
    //    }
    //    if ($scope.ActiveSubtab === 5) {
    //        $scope.PatientInvestigationActiveRoomList();
    //    }
    //};

    $scope.ViewDilationHistory = function (item) {
        console.log(item);
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/Op/DilationHistoryPopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, eHnotePatientDataService) {

                var obj = {
                    "PatientId": item.PatientId,
                    "AppointmentId": item.AppointmentId
                }
                eHnotePatientDataService.GetDilationHistory(obj).then(function (resp) {
                    $scope.DilationHistoryArray = resp.data.rows || [];
                    if ($scope.DilationHistoryArray.length > 0) {
                        angular.forEach($scope.DilationHistoryArray, function (kitem) {
                            kitem.Duration = "";
                            if (kitem.DilationEndTime != null && kitem.DilationStartTime != null) {
                                var ms = moment(kitem.DilationEndTime, "YYYY-MM-DD HH:mm:ss").diff(moment(kitem.DilationStartTime, "YYYY-MM-DD HH:mm:ss"));
                                var d = moment.duration(ms);
                                var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
                                kitem.Duration = s;
                            }
                        });
                    }
                });
                $scope.closeDilationHistory = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }
}]);
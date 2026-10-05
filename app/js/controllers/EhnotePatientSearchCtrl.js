"use strict";


eHnoteWebApp.controller("EhnotePatientSearchCtrl", ["$scope", "$rootScope", "$filter", "$location", "datapersistanceFactory", "eHnotePatientDataService", "eHnoteCacheStorageService", "eHnoteMasterDataService", "datacookieFactory", "eHnoteLoginStatusService", "eHnoteValidateUsersDataService", "alertify", "$window", "eHnoteMainAppointmentService", "eHnoteOrgReferralDataServices", "eHnoteUserAppointmentDataService", "eHnotePatientAddressDataServices", "$uibModal", "localStorageFactory", "eHnoteAuditServices", function ($scope, $rootScope, $filter, $location, datapersistanceFactory, eHnotePatientDataService, eHnoteCacheStorageService, eHnoteMasterDataService, datacookieFactory, eHnoteLoginStatusService, eHnoteValidateUsersDataService, alertify, $window, eHnoteMainAppointmentService, eHnoteOrgReferralDataServices, eHnoteUserAppointmentDataService, eHnotePatientAddressDataServices, $uibModal, localStorageFactory, eHnoteAuditServices) {


    if ($rootScope.CurrentUrl === "/OT") {
        $scope.IsOt = true;
    } else {
        $scope.IsOt = false;
    }


    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path('/login');
        return;
    }

    $scope.searchtype = {
        "searchPatientDisplayId": "",
        "SearchBy": "",
        "searchPatientMobile": "",
        "searchOldPatientMRNO": ""
    };
    $scope.RoleId = userLoginDetails.RoleID;
    $scope.FilterAppointments = function (mainpatientScreen) {
        if (mainpatientScreen) {
            $scope.mainpatientScreen = false;
        } else {
            $scope.mainpatientScreen = true;
        }
    };
    $scope.mainpatientScreen = true;
    $scope.AllSpecializationCheck = true;
    $scope.SpecilaizationFilterArray = [
        {
            "Id": 3,
            "Name": "Optha",
            "isChecked": true
        },
        {
            "Id": 2,
            "Name": "Dental",
            "isChecked": true
        }
    ];
    $scope.AllPatientCheck = true;
    $scope.PatientFilterArray = [
        {
            "Id": 1,
            "Name": "VIP",
            "isChecked": true
        },
        {
            "Id": 2,
            "Name": "Research",
            "isChecked": true
        },
        {
            "Id": 3,
            "Name": "High Risk",
            "isChecked": true
        }
    ];

    $scope.ageSlider = { "max": 150, "min": 0 };
    $scope.Patientbook = datacookieFactory.getItem('patientData');
    $scope.Allbranchcheck = true;
    $scope.sendhospcode = false;
    $scope.consultationStatuspopUp = false;
    $scope.HospitalArray = [];
    $scope.appointmentIdfromDB = 0;
    $scope.selectedItemInStrtConsultation = "";
    $scope.ScreenFrom = "";
    var ParentHospitalID;
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    if (doctorinfo.doctordata.UserAddress !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined &&
        doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        ParentHospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }
    $scope.RoleDoctor = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.countries = [];

    var Appointmenttypes = [];
    Appointmenttypes = datapersistanceFactory.getItem('masteAppointmentTypes');
    $scope.appointmentTypes = Appointmenttypes;
    $scope.showicon = false;
    setpatientedit();
    $scope.editPatientinfo = false;
    $scope.addAppointmentInfo = false;
    $scope.ReferralList = "";
    $scope.clinicDoctorList = [];
    $scope.disableStartConsultation = false;
    checkAccessForUser();



    $scope.patientAccess = {
        "showAllHospitalPatients": false,
        "caseHistoryAccess": false,
        "patientBillingAccess": false,
        "bookAppointmentAccess": false,
        "registerPatientAccess": false,
        "updatePatientAccess": false
    };



    $scope.UserAccessList = [];
    if (doctorinfo !== "") {
        if (doctorinfo.doctordata.User !== undefined) {
            $scope.UserAccessList = doctorinfo.doctordata.User[0].UseAccessDetails;
            checkUserAccessPermissions();
        }
    }

    var patientsearchparam = {
        "PageSize": 21,
        "Sort": "asc",
        "hasparam": false,
        "SearchDetails": { "listdocpatients": "Y" },
        "StartDate": "",
        "EndDate": ""
    };
    patientsearchparam.DoctorID = eHnoteMasterDataService.getLoginId();
    patientsearchparam.PageNumber = 1;
    var PastHealthHistoryRecord = [];
    eHnoteMasterDataService.addPreMedicalHistory(PastHealthHistoryRecord);
    eHnoteMasterDataService.addPatientSearchInfo(patientsearchparam);
    var PatientID = '';
    function setpatientedit() {
        $scope.dYear = '';
        $scope.mYear = '';
        $scope.patientedit = {
            "fullName": '',
            "DOB": '',
            "Gender": 'M',
            "PhNumber": '',
            "EmailID": '',
            "BloodGroup": '',
            "Address1": '',
            "Address2": '',
            "Country": '',
            "State": '',
            "CityTown": '',
            "Location": '',
            "LandMark": '',
            "PinCode": '',
            "Title": '',
            "AdharNo": '',
            "PanNo": '',
            "Nationality": '',
            "PassportNo": '',
            "Visastatus": '',
            "PatientTypeId": ''
        };
    }
    $scope.ageSplits = { year: 0, months: '0' };
    $scope.getPatientsVisibleStatus = datapersistanceFactory.set("myPatientsSet", "yes");

    $scope.Fromdate = "";
    $scope.Todate = "";
    $scope.Fromdob = "";
    $scope.Todob = "";
    $scope.Gender = "All";
    $scope.searchPatientDisplayId = "";

    //Newly Added By Durga 05-02-2019
    $scope.newPatSearchType = "3";   // '1' for Mr.No /mobile ,'2' for Name search

    var appointmentinfo = {
        "AppointmentID": 0,
        "caseid": 0,
        "PatientID": 0,
        "StartStatus": "New",
        "PatientDetails": {
            "Patient": [],
            "PatientPhone": []
        }
    };
    $scope.Frmage = "";
    $scope.Toage = "";
    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
    eHnoteMasterDataService.addBillingInfo('');
    $scope.SearchBy = "";
    $scope.showBranchDropdown = false;
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.hospitalLevelDoc = false;
    $scope.admin_blocks = true;
    //admin_status = true;
    $scope.hospitalLevelDoc = true;
    $scope.apptypeval = "";
    //var docParams = {
    //    "PageSize": 1000,
    //    "PageNumber": 1,
    //    "HospitalID": ParentHospitalID,
    //    "ActiveDoctors": "Y"
    //};
    //function onListSuccess(data) {
    //    $scope.hospitalDetails = data;
    //    $scope.HospitalArray.length = 0;
    //    angular.forEach($scope.hospitalDetails, function (item) {
    //        $scope.HospitalArray.push(item.HospitalInfo.HospitalDetails);
    //        $scope.toggleAll();
    //    });
    //    $scope.checkval = $scope.HospitalArray;
    //}
    //function OnListFailed(data) {
    //}
    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
        $scope.showBranchDropdown = true;
    }
    if ($scope.doctorinfo !== null && $scope.doctorinfo.doctordata !== null) {
        if ($scope.doctorinfo.doctordata.UserAddress !== null) {
            $scope.AppListdoctoraddress = $scope.doctorinfo.doctordata.UserAddress;
            $scope.AppListselectedclinic = $scope.doctorinfo.doctordata.UserAddress[0];
            $scope.doctorDataList = [{
                'DoctorID': doctorinfo.doctorid,
                'FullName': doctorinfo.doctordata.User[0].FullName,
                "RoleName": "DOCTOR",
                "RoleDesc": "DOCTOR"
            }];
        }
    }


    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalArray = [];
        $scope.CheckHospitalId = {};
        if ($scope.RoleId === 1 || $scope.RoleId === 56) {
            angular.forEach($scope.doctorinfo.doctordata.UserAddress, function (item) {
                if (item.ExtDetails !== undefined) {
                    if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        var Obj = {
                           // "HospitalName": item.ClinicName,
                            "BranchName": item.ClinicName,
                            "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                            "ActiveIND": "Y",
                            "isChecked": true
                        };
                        $scope.HospitalArray.push(Obj);
                    }
                }
            });
        }
    }
    //if ($scope.doctorinfo.doctordata.UserParentBranch !== undefined && $scope.doctorinfo.doctordata.UserParentBranch.length>0) {
    //    $scope.HospitalArray = [];
    //    $scope.CheckHospitalId = {};

    //    if ($scope.RoleId === 1 || $scope.RoleId === 56) {
    //        angular.forEach($scope.doctorinfo.doctordata.UserParentBranch, function (item) {
              
    //            var Obj = {
    //                //"HospitalName": item.OrganizationName,
    //                "BranchName": item.OrganizationName,
    //                "HospitalID": item.OrganizationId,
    //                "ActiveIND": "Y",
    //                "isChecked": true
    //            };
    //            $scope.HospitalArray.push(Obj);
    //        });
    //    }
    //}

    //$scope.CheckAll = function () {
    //    $scope.HospitalArray.length = 0;
    //    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.BranchCode !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalIDLst !== undefined) {
    //        angular.forEach($scope.doctorinfo.doctordata.UserAddress, function (item) {
    //            var Obj = {
    //                "HospitalName": item.ClinicName,
    //                "HospitalID": item.ExtDetails.HospitalInfo.HospitalIDLst,
    //                "ActiveIND": $scope.checkall
    //            };
    //            $scope.HospitalArray.push(Obj);
    //        });
    //    }
    //};
    $scope.popup_value = 1;
    $scope.switchtonexttab = function (val) {
        $scope.popup_value = val;
    };
    $scope.datecheck = false;
    $scope.checkErr = function (startDate, endDate) {
        $scope.errMessage = '';
        var curDate = new Date();
        if (new Date(startDate) > new Date(endDate)) {
            $scope.errMessage = 'End Date should be greater than start date';
            return false;
        } else if (new Date(startDate) < curDate) {
            $scope.errMessage = 'Start date should not be before today.';
            return false;
        } else {
            return true;
        }
    };
    $scope.Toagevalue = false;
    $scope.frmagevalue = false;
    $scope.frmageChange = function (Frmage) {
        $scope.frmagevalue = true;
        $scope.Frmage = Frmage;
    };
    $scope.toageChange = function (Toage) {
        if (Toage !== '') {
            $scope.Toagevalue = true;
        }
        $scope.Toage = Toage;
    };
    $scope.HospitalCode = [];
    $scope.hospcalsubmit = [];
    $scope.listval = [];
    $scope.submit = function () {

        $scope.searchtype.searchPatientDisplayId = "";
        $scope.searchtype.searchOldPatientMRNO = "";
        $scope.searchtype.SearchBy = "";
        $scope.searchtype.searchPatientMobile = "";

        $scope.SearchBy = "";
        $scope.currentPage = 1;
        //if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
        //    for (var j = 0; j < $scope.HospitalArray.length; j++) {
        //        if ($scope.HospitalArray[j].ActiveIND === "Y") {
        //            $scope.HospitalCode.push($scope.HospitalArray[j].HospitalID);
        //        }
        //    }
        //}
        if ($scope.doctorinfo.doctordata.UserParentBranch !== undefined && $scope.doctorinfo.doctordata.UserParentBranch.length>0) {
            for (var j = 0; j < $scope.HospitalArray.length; j++) {
                if ($scope.HospitalArray[j].ActiveIND === "Y") {
                    $scope.HospitalCode.push($scope.HospitalArray[j].HospitalID);
                }
            }
        }
        var param = eHnoteMasterDataService.getPatientSearchInfo();
        param.UserId = eHnoteMasterDataService.getLoginId();
        param.PageSize = 21;
        param.PageNumber = 1;
        param.SearchText = "";
        param.Count = 0;
        param.PhoneNumber = "";
        param.SearchDetails = {};
        param.StartAge = parseInt($scope.Frmage) || 0;
        param.EndAge = parseInt($scope.Toage) || 0;
        param.GenderIndicator = $scope.Gender;
        if (param.StartAge > param.EndAge) {
            alertify.error("End Age Should Be Greater Than Start Age");
            return;
        }
        if ($scope.Fromdate !== '' && $scope.Todate !== '') {
            param.SearchDetails.StartDate = $filter('date')(new Date($scope.Fromdate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")), "yyyy-MM-dd");
            param.SearchDetails.EndDate = $filter('date')(new Date($scope.Todate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")), "yyyy-MM-dd");
        }
        if ($scope.Fromdate !== '' && $scope.Todate === '') {
            alertify.error('Select To Date');
            return;
        }
        if ($scope.Todate !== '' && $scope.Fromdate === '') {
            alertify.error('Select From Date');
            return;
        }
        if ($scope.Fromdob !== '' && $scope.Todob === '') {
            alertify.error('Select Till Date');
            return;
        }
        if ($scope.Todob !== '' && $scope.Fromdob === '') {
            alertify.error('Select From Date');
            return;
        }
        if ($scope.Fromdob !== '' && $scope.Todob !== '') {
            param.SearchDetails.startDOB = $filter('date')(new Date($scope.Fromdob.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")), "yyyy-MM-dd");
            param.SearchDetails.endDOB = $filter('date')(new Date($scope.Todob.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")), "yyyy-MM-dd");
        }
        param.HospitalID = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

        var list = [];
        angular.forEach($scope.HospitalArray, function (items) {
            if (items.isChecked) {
               // list.push(items.BranchId);
                list.push(items.HospitalID);
            }
        });
       
        param.HospitalIDLst = list;

        var list1 = [];
        angular.forEach($scope.SpecilaizationFilterArray, function (items) {
            if (items.isChecked) {
                list1.push(items.Id);
            }
        });
        param.SpecilaizationIDLst = list1;
        param.GetAllSpecializationInd = $scope.AllSpecializationCheck;

      
        var obj = {
            "ISVIPInd": $filter("filter")($scope.PatientFilterArray, { "Id": 1 })[0].isChecked,
            "IsResearchInd": $filter("filter")($scope.PatientFilterArray, { "Id": 2 })[0].isChecked,
            "IsHighRiskInd": $filter("filter")($scope.PatientFilterArray, { "Id": 3 })[0].isChecked
        }
        param.PatientIDLst = obj;
        param.GetAllPatientInd = $scope.AllPatientCheck;
        if (param.StartDate !== "" && param.EndDate !== "") {
            if (!$scope.chkLapsedTime(param.StartDate, param.EndDate)) {
                alertify.error('To date should not be greater than From date');
                return;
            }
        }




        if ($scope.Fromdob !== "" && $scope.Todob !== "") {
            if (!$scope.chkLapsedTime(param.SearchDetails.startDOB, param.SearchDetails.endDOB)) {
                alertify.error('Till date should not be greater than From date');
                return;
            }
        }
        //var dates = $scope.chkLapsedTime(param.StartDate, param.EndDate);
        delete param.DoctorID;
        param.PatientDisplayId = "";
        param.SearchMobile = 0;
        eHnotePatientDataService.SearchPatient1(param, OnGetSubmitPatientSuccess, OnGetSubmitPatientError, $scope.sendhospcode);
    };
    function OnGetSubmitPatientSuccess(data) {
        if (data.count > 0) {
            $scope.ShowAllPatientsValue = false;
            $scope.ShowAllfilterPatientsValue = false;

            $scope.count = data.count;
            $scope.totalItems = data.count;

             
            $scope.patients = eHnotePatientDataService.RestructureSearchPatientData(data.rows);
            $scope.noresult = false;
            $scope.showloading = false;
            
            $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
            $scope.ShowAllfilterPatientsValue = true;
            $scope.ShowAllPatientsValue = false;
            $scope.count = 0;
            $scope.totalItems = 0;
            $scope.patients = [];
        }
    }
    function OnGetSubmitPatientError(data) {
        $scope.patients = [];
        $scope.totalItems = 0;
    }
    var prevpagno, pageno;
    var param = eHnoteMasterDataService.getPatientSearchInfo();
    $scope.hospcal = [];
    //$scope.onload = function () {

    //    $scope.hospcalsubmit = [];
    //    if ($scope.SearchBy === "") {
    //        $scope.showicon = false;
    //    }
    //    var param = eHnoteMasterDataService.getPatientSearchInfo();
    //    param.UserId = eHnoteMasterDataService.getLoginId();
    //    param.PageSize = 21;
    //    param.PageNumber = 1;
    //    param.SearchText = "";
    //    param.SearchDetails = { "PatientType": "" };
    //    param.PhoneNumber = "";
    //    param.EndAge = 0;
    //    param.StartAge = 0;
    //    param.Count = 0;
    //    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
    //        param.HospitalID = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    //        param.HospitalIDLst;
    //    }
       
    //    $scope.AllBranchesResponse = [];

    //    var brancList = localStorageFactory.getItem('allHospitalsDoctorsData');

    //    if (brancList.length === 0 || brancList === undefined) {
    //        alertify.error("Something Went Wrong");
    //        datapersistanceFactory.clearAll();
    //        localStorageFactory.clearAll();
    //        $rootScope.showMainPageHeader = false;
    //        $location.path("/login");
    //        return false;
    //    }
    //    $scope.AllBranchesResponse = angular.copy(brancList);
    //    var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
    //    $scope.hospitalDetails = angular.copy($scope.AllBranchesResponse);
    //    $scope.HospitalArray = [];
    //    angular.forEach($scope.hospitalDetails, function (item, index) {


    //        $scope.HospitalArray.push(item.HospitalInfo.HospitalDetails);
    //        $scope.HospitalArray[index].isChecked = true;
    //    });
    //    $scope.Allbranchcheck = true;

    //    $scope.checkval = angular.copy($scope.AllBranchesResponse);
    //    angular.forEach($scope.checkval, function (item) {
    //        $scope.listval.push(item.HospitalInfo.HospitalDetails.HospitalID);
    //    });
    //    if ($scope.listval.length > 0) {
    //        param.HospitalIDLst = $scope.listval;
    //    } else {
    //        $scope.listval.push($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
    //    }
    //    param.HospitalIDLst = $scope.listval;
    //    delete param.DoctorID;
        
       
    //    $scope.Curdate = $filter("date")(new Date(), "dd-MM-yyyy");
    //    var Selectdatefrmappmnt = eHnoteMasterDataService.addSelectedPastAppDate($scope.Curdate);
    //    var list1 = [];
    //    angular.forEach($scope.SpecilaizationFilterArray, function (items) {
    //        if (items.isChecked) {
    //            list1.push(items.Id);
    //        }
    //    });
    //    param.SpecilaizationIDLst = list1;
    //    param.GetAllSpecializationInd = $scope.AllSpecializationCheck;

    //    var obj = {
    //        "ISVIPInd": $filter("filter")($scope.PatientFilterArray, { "Id": 1 })[0].isChecked,
    //        "IsResearchInd": $filter("filter")($scope.PatientFilterArray, { "Id": 2 })[0].isChecked,
    //        "IsHighRiskInd": $filter("filter")($scope.PatientFilterArray, { "Id": 3 })[0].isChecked
    //    }
    //    param.PatientIDLst = obj;
    //    param.GetAllPatientInd = $scope.AllPatientCheck;
    //    eHnotePatientDataService.SearchPatient1(param, PatientSuccess, OnGetSubmitPatientError, $scope.sendhospcode);
    //};

    $scope.onload = function () {

        $scope.hospcalsubmit = [];
        if ($scope.SearchBy === "") {
            $scope.showicon = false;
        }
        var param = eHnoteMasterDataService.getPatientSearchInfo();
        param.UserId = eHnoteMasterDataService.getLoginId();
        param.PageSize = 21;
        param.PageNumber = 1;
        param.SearchText = "";
        param.SearchDetails = { "PatientType": "" };
        param.PhoneNumber = "";
        param.EndAge = 0;
        param.StartAge = 0;
        param.Count = 0;
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            param.HospitalID = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            param.HospitalIDLst;
        }
        $scope.HospitalID = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.AllBranchesResponse = [];

        //var brancList = localStorageFactory.getItem('allHospitalsDoctorsData');

        var brancList = localStorageFactory.getItem("allBranchesData") || [];

        if (brancList.length === 0 || brancList === undefined) {
            alertify.error("Something Went Wrong");
            datapersistanceFactory.clearAll();
            localStorageFactory.clearAll();
            $rootScope.showMainPageHeader = false;
            $location.path("/login");
            return false;
        }
        $scope.AllBranchesResponse = angular.copy(brancList);
        var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
      //  $scope.hospitalDetails = angular.copy($scope.AllBranchesResponse);
        $scope.hospitalDetails = angular.copy($scope.doctorinfo.doctordata.UserParentBranch);
        $scope.HospitalArray = [];
        angular.forEach($scope.hospitalDetails, function (item, index) {

            // $scope.HospitalArray.push(item.HospitalInfo.HospitalDetails);
            var Obj = {
                "BranchName": item.OrganizationName,
                "HospitalName": item.OrganizationName,
                "HospitalID": item.OrganizationId,
                "ActiveIND": "Y",
                "isChecked": true
            };
            $scope.HospitalArray.push(Obj);
            $scope.HospitalArray[index].isChecked = true;
        });
        $scope.Allbranchcheck = true;

        //$scope.checkval = angular.copy($scope.AllBranchesResponse);
        //angular.forEach($scope.checkval, function (item) {
        //    $scope.listval.push(item.HospitalInfo.HospitalDetails.BranchId);
        //});
        $scope.checkval = angular.copy($scope.doctorinfo.doctordata.UserParentBranch);
        angular.forEach($scope.checkval, function (item) {
            $scope.listval.push(item.OrganizationId);
        });
        if ($scope.listval.length > 0) {
            param.HospitalIDLst = $scope.listval;
        } else {
            //$scope.listval.push($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
            $scope.listval.push($scope.doctorinfo.doctordata.UserParentBranch[0].OrganizationId);
        }
        param.HospitalIDLst = $scope.listval;
        delete param.DoctorID;


        $scope.Curdate = $filter("date")(new Date(), "dd-MM-yyyy");
        var Selectdatefrmappmnt = eHnoteMasterDataService.addSelectedPastAppDate($scope.Curdate);
        var list1 = [];
        angular.forEach($scope.SpecilaizationFilterArray, function (items) {
            if (items.isChecked) {
                list1.push(items.Id);
            }
        });
        param.SpecilaizationIDLst = list1;
        param.GetAllSpecializationInd = $scope.AllSpecializationCheck;

        var obj = {
            "ISVIPInd": $filter("filter")($scope.PatientFilterArray, { "Id": 1 })[0].isChecked,
            "IsResearchInd": $filter("filter")($scope.PatientFilterArray, { "Id": 2 })[0].isChecked,
            "IsHighRiskInd": $filter("filter")($scope.PatientFilterArray, { "Id": 3 })[0].isChecked
        }
        param.PatientIDLst = obj;
        param.GetAllPatientInd = $scope.AllPatientCheck;
       // eHnotePatientDataService.SearchPatient1(param, PatientSuccess, OnGetSubmitPatientError, $scope.sendhospcode);
        var obj = {
            "HospitalID": $scope.HospitalID
        }
        eHnotePatientDataService.GetMainSearchPatient(obj, PatientSuccess, OnGetSubmitPatientError);
    };


    if ($scope.RoleId === 1 || $scope.RoleId === 56) {
        $scope.submit();
    } else {
        $scope.onload();
    }



    $scope.Sethospcode = function () {
        if ($scope.selected !== undefined) {
            if ($scope.selected.length === 0 || $scope.selected.length === $scope.HospitalArray.length) {
                $scope.sendhospcode = true;
            } else {
                $scope.sendhospcode = false;
            }
        }
    };

    InitialiseSearchParam();
    $scope.patientinitval = {};
    $scope.patientinitval.patientCaseBillingAmtInfo = [];
    $scope.patientpushval = [];
    function PatientSuccess(data) {




        $scope.ShowAllPatientsValue = false;
        $scope.ShowAllfilterPatientsValue = false;

        $scope.count = data.count;
        $scope.totalItems = data.count;




        $scope.patients = eHnotePatientDataService.RestructureSearchPatientData(data.rows);
        if ($scope.patients.length !=0) {
            angular.forEach($scope.patients, function (item) {
                var PhoneNumber = item.PhoneNumber;
                var SSN = item.SSN;
                SSN = SSN || "";
                SSN = item.SSN.toString();
                 PhoneNumber = item.PhoneNumber.toString();
                if (PhoneNumber.length > 0) {
                    var number = PhoneNumber;
                    number = number.slice(0, 3) + '-' + number.slice(3, 6) + '-' + number.substring(6, 10);;
                    item.TempPhNumber = number;
                } else {
                    item.TempPhNumber = "";
                }
                if (SSN.length > 0) {
                    var SSNnumber = SSN;
                    SSNnumber = SSNnumber.slice(0, 3) + '-' + SSNnumber.slice(3,5) + '-' + SSNnumber.substring(5, 10);;
                    item.TempSSNnumber = SSNnumber;
                } else {
                    item.TempSSNnumber = "";
                }
            });

           
        }
       

        $scope.noresult = false;
        $scope.showloading = false;
        //angular.forEach(data.rows, function (item) {
        //    if (item.CurrentAge !== undefined) {
        //        $scope.ageSplits.year = item.CurrentAge.year;
        //        $scope.ageSplits.months = item.CurrentAge.month.toString();
        //        if ($scope.ageSplits.months < 10) {
        //            $scope.ageSplits.months = "0" + $scope.ageSplits.months;
        //            item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
        //        } else {
        //            item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
        //        }
        //    } else {
        //        if (item.Age !== undefined) {
        //            if (item.Age.toString().indexOf('.') !== -1) {
        //                var ageSplitArray = item.Age.toString().split('.');
        //                $scope.ageSplits.year = ageSplitArray[0].toString();
        //                $scope.ageSplits.months = ageSplitArray[1].toString();
        //                item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
        //            } else {
        //                $scope.ageSplits.year = item.Age.toString();
        //                $scope.ageSplits.months = '0';
        //                item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
        //            }
        //        } else {
        //            $scope.ageSplits = { year: 1, months: '0' };
        //        }
        //    }
        //});
        $scope.$broadcast("scroll.infiniteScrollComplete");
    }
    $scope.DisplayAge = function (birthday) {
        return GetAge(birthday);
    };
    $scope.SearchPatients = function (data) {

        var clinic = {};

        param['SearchText'] = "";
        $scope.hospcal = [];
        if (prevpagno !== $scope.pageno) {
            pageno = $scope.pageno;
            prevpagno = $scope.pageno;
        }
        clinic = $scope.AppListselectedclinic;
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            param['HospitalCD'] = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.hospcal.push($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
        }
        var list = [];
        angular.forEach($scope.HospitalArray, function (items) {
            if (items.isChecked) {
                list.push(items.HospitalID);
            }
        });
        param['HospitalIDLst'] = list;
        if (clinic && clinic.ExtDetails && clinic.ExtDetails.HospitalIDLst && clinic.ExtDetails.HospitalIDLst !== null) {
            param['HospitalIDLst'] = clinic.ExtDetails.HospitalIDLst;
        }
        var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();



        //Added by sabarish
        param.UserId = doctorinfo.doctorid;
        param.HospitalID = ParentHospitalID;
        param.EndAge = param.EndAge || 0;
        param.StartAge = param.StartAge || 0;
        param.Count = param.Count || 0;
        var list1 = [];
        angular.forEach($scope.SpecilaizationFilterArray, function (items) {
            if (items.isChecked) {
                list1.push(items.Id);
            }
        });
        param.SpecilaizationIDLst = list1;
        param.GetAllSpecializationInd = $scope.AllSpecializationCheck;

        var obj = {
            "ISVIPInd": $filter("filter")($scope.PatientFilterArray, { "Id": 1 })[0].isChecked,
            "IsResearchInd": $filter("filter")($scope.PatientFilterArray, { "Id": 2 })[0].isChecked,
            "IsHighRiskInd": $filter("filter")($scope.PatientFilterArray, { "Id": 3 })[0].isChecked
        }
        param.PatientIDLst = obj;
        param.GetAllPatientInd = $scope.AllPatientCheck;




        eHnotePatientDataService.SearchPatient1(param, PatientSuccess, OnGetPatientError, $scope.sendhospcode);
        $scope.Reset();
    };

    $scope.refreshSearch = function () {
        $scope.searchtype = {
            "searchPatientDisplayId": "",
            "SearchBy": "",
            "searchPatientMobile": "",
            "searchOldPatientMRNO": ""
        };
        //$scope.LoadPatient();
    };

    $scope.searchAllPatient = function () {
        var clinic = {};
        var name = "";
        name = $scope.searchtype.SearchBy;

        var patDispId = "";
        patDispId = $scope.searchtype.searchPatientDisplayId ? $scope.searchtype.searchPatientDisplayId : "";
        var patOldMrNo = "";
        patOldMrNo = $scope.searchtype.searchOldPatientMRNO ? $scope.searchtype.searchOldPatientMRNO : "";

        var patMobile = "";
        patMobile = $scope.searchtype.searchPatientMobile ? $scope.searchtype.searchPatientMobile : "";

        $scope.Emailid = "";
        $scope.showicon = true;
        //if (name === "" && patDispId === "" && patMobile === "" && patOldMrNo === "") {
        //    $scope.LoadPatient();
        //    $scope.showicon = false;
        //    return;
        //}
        //if ((name && name.length >= 3) || (patDispId && patDispId.length >= 10) || (patOldMrNo && patOldMrNo.length >= 2) || (patMobile && patMobile.length >= 10)) {
        //    var param = {
        //        "PageSize": 21,
        //        "UserId": "",
        //        "PageNumber": 1,
        //        "SearchText": "",
        //        "PatientDisplayId": "",
        //        "OldPatientMRNO": "",
        //        "Count": 0,
        //        "SearchDetails": { "listdocpatients": "Y" },
        //        "EndAge": 0,
        //        "StartAge": 0,
        //        "StartDate": "",
        //        "EndDate": "",
        //        "SearchMobile": 0
        //    };
        //    if (name !== "") {
        //        if (!isNaN(name)) {


        //            if (name.length < 10) {
        //                return;
        //            }


        //            param.PhoneNumber = name;
        //            param.hasparam = true;
        //            param.SearchText = "";
        //        } else {
        //            param.SearchText = name;
        //            param.hasparam = true;
        //            param.PhoneNumber = "";
        //        }
        //    }
        //    if (patDispId !== "") {
        //        param.PatientDisplayId = patDispId;
        //        param.PhoneNumber = "";
        //        param.SearchText = "";
        //        param.OldPatientMRNO = "";
        //    }
        //    if (patOldMrNo !== "") {
        //        param.PatientDisplayId = "";
        //        param.PhoneNumber = "";
        //        param.SearchText = "";
        //        param.OldPatientMRNO = patOldMrNo;
        //    }
        //    if (patMobile !== "") {
        //        param.SearchMobile = parseInt(patMobile);
        //        param.PhoneNumber = "";
        //        param.SearchText = "";
        //        param.PatientDisplayId = "";
        //        param.OldPatientMRNO = "";
        //    }

        //    param.UserId = eHnoteMasterDataService.getLoginId();



        //    clinic = $scope.AppListselectedclinic;
        //    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        //        param['HospitalID'] = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        //    }
        //    var list = [];
        //    angular.forEach($scope.HospitalArray, function (items) {
        //        if (items.isChecked) {
        //            list.push(items.HospitalID);
        //            //list.push(items.BranchId);
        //        }
        //    });

        //    param['HospitalIDLst'] = list;


        //    if (clinic && clinic.ExtDetails && clinic.ExtDetails.HospitalIDLst && clinic.ExtDetails.HospitalIDLst !== null) {
        //        param['HospitalIDLst'] = clinic.ExtDetails.HospitalIDLst;
        //    }
        //    var list1 = [];
        //    angular.forEach($scope.SpecilaizationFilterArray, function (items) {
        //        if (items.isChecked) {
        //            list1.push(items.Id);
        //        }
        //    });
        //    param.SpecilaizationIDLst = list1;
        //    param.GetAllSpecializationInd = $scope.AllSpecializationCheck;

        //    var obj = {
        //        "ISVIPInd": $filter("filter")($scope.PatientFilterArray, { "Id": 1 })[0].isChecked,
        //        "IsResearchInd": $filter("filter")($scope.PatientFilterArray, { "Id": 2 })[0].isChecked,
        //        "IsHighRiskInd": $filter("filter")($scope.PatientFilterArray, { "Id": 3 })[0].isChecked
        //    }
        //    param.PatientIDLst = obj;
        //    param.GetAllPatientInd = $scope.AllPatientCheck;
        //    var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
        //    eHnoteMasterDataService.addPatientSearchInfo(param);
        //    InitialiseSearchParam();
        //    $scope.morepatientdata = false;

        //    //return false;
        //    //eHnotePatientDataService.SearchPatient1(param, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);
        //    
        //}

        if ($scope.searchtype.SearchBy !== "") {
            if (!isNaN($scope.searchtype.SearchBy)) {
                if ($scope.searchtype.SearchBy.length < 10) {
                        return;
                    }

                    $scope.searchtype.PhoneNumber = $scope.searchtype.SearchBy;
                    $scope.searchtype.SearchBy = "";
                } else {
                $scope.searchtype.SearchBy = $scope.searchtype.SearchBy;
                $scope.searchtype.PhoneNumber = "";
            }
        }


        if ($scope.searchtype.SearchBy !== "") {
        var param1 = {
                "PageSize": 20,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "PageNumber": 1,
                "SearchText": $scope.searchtype.SearchBy,
                "PatientDisplayId": "",
                "OldPatientMRNO": "",
                "PhoneNumber": "",
                "ParentHospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "HospitalId": $scope.HospitalID
            };
        }
        if ($scope.searchtype.PhoneNumber !== "") {
            var param1 = {
                "PageSize": 20,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "PageNumber": 1,
                "SearchText": "",
                "PatientDisplayId": "",
                "OldPatientMRNO": "",
                "PhoneNumber": $scope.searchtype.PhoneNumber,
                "ParentHospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "HospitalId": $scope.HospitalID
            };
        }
        if ($scope.searchtype.searchPatientDisplayId !== "") {
            var param1 = {
                "PageSize": 20,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "PageNumber": 1,
                "SearchText": "",
                "PatientDisplayId": $scope.searchtype.searchPatientDisplayId,
                "OldPatientMRNO": "",
                "PhoneNumber": "",
                "ParentHospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "HospitalId": $scope.HospitalID
            };
        }
        if ($scope.searchtype.searchOldPatientMRNO !== "") {
            var param1 = {
                "PageSize": 20,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "PageNumber": 1,
                "SearchText": "",
                "PatientDisplayId": "",
                "OldPatientMRNO": $scope.searchtype.searchOldPatientMRNO,
                "PhoneNumber": "",
                "ParentHospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "HospitalId": $scope.HospitalID
            };
        }


        eHnotePatientDataService.GetAllPatientSearchByParentOrganization(param1, OnGetSearchPatientSuccess, OnGetPatientSearchError);
        function OnGetSearchPatientSuccess(resp) {
            $scope.patients = resp.rows;
        }
        function OnGetPatientSearchError(error) {
            console.log(error);
        }
    }
    
    

    $scope.SearchByText = function () {
        //var searchcontent = "";
        //searchcontent = $scope.SearchBy;

        var clinic = {};
        var name = "";
        name = $scope.searchtype.SearchBy;

        var patDispId = "";
        patDispId = $scope.searchtype.searchPatientDisplayId ? $scope.searchtype.searchPatientDisplayId : "";
        var patOldMrNo = "";
        patOldMrNo = $scope.searchtype.searchOldPatientMRNO ? $scope.searchtype.searchOldPatientMRNO : "";

        var patMobile = "";
        patMobile = $scope.searchtype.searchPatientMobile ? $scope.searchtype.searchPatientMobile : "";

        $scope.Emailid = "";
        $scope.showicon = true;
        if (name === "" && patDispId === "" && patMobile === "" && patOldMrNo==="") {
            $scope.LoadPatient();
            $scope.showicon = false;
            return;
        }
        if ((name && name.length >= 3) || (patDispId && patDispId.length >= 10) || (patOldMrNo && patOldMrNo.length >= 2) || (patMobile && patMobile.length >= 10)) {
            var param = {
                "PageSize": 21,
                "UserId": "",
                "PageNumber": 1,
                "SearchText": "",
                "PatientDisplayId": "",
                "OldPatientMRNO": "",
                "Count": 0,
                "SearchDetails": { "listdocpatients": "Y" },
                "EndAge": 0,
                "StartAge": 0,
                "StartDate": "",
                "EndDate": "",
                "SearchMobile": 0
            };
            if (name !== "") {
                if (!isNaN(name)) {


                    if (name.length < 10) {
                        return;
                    }


                    param.PhoneNumber = name;
                    param.hasparam = true;
                    param.SearchText = "";
                } else {
                    param.SearchText = name;
                    param.hasparam = true;
                    param.PhoneNumber = "";
                }
            }
            if (patDispId !== "") {
                param.PatientDisplayId = patDispId;
                param.PhoneNumber = "";
                param.SearchText = "";
                param.OldPatientMRNO = "";
            }
            if (patOldMrNo !== "") {
                param.PatientDisplayId = "";
                param.PhoneNumber = "";
                param.SearchText = "";
                param.OldPatientMRNO = patOldMrNo;
            }
            if (patMobile !== "") {
                param.SearchMobile = parseInt(patMobile);
                param.PhoneNumber = "";
                param.SearchText = "";
                param.PatientDisplayId = "";
                param.OldPatientMRNO = "";
            }

            param.UserId = eHnoteMasterDataService.getLoginId();



            clinic = $scope.AppListselectedclinic;
            if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                param['HospitalID'] = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            }
            var list = [];
            angular.forEach($scope.HospitalArray, function (items) {
                if (items.isChecked) {
                    list.push(items.HospitalID);
                    //list.push(items.BranchId);
                }
            });

            param['HospitalIDLst'] = list;


            if (clinic && clinic.ExtDetails && clinic.ExtDetails.HospitalIDLst && clinic.ExtDetails.HospitalIDLst !== null) {
                param['HospitalIDLst'] = clinic.ExtDetails.HospitalIDLst;
            }
            var list1 = [];
            angular.forEach($scope.SpecilaizationFilterArray, function (items) {
                if (items.isChecked) {
                    list1.push(items.Id);
                }
            });
            param.SpecilaizationIDLst = list1;
            param.GetAllSpecializationInd = $scope.AllSpecializationCheck;

            var obj = {
                "ISVIPInd": $filter("filter")($scope.PatientFilterArray, { "Id": 1 })[0].isChecked,
                "IsResearchInd": $filter("filter")($scope.PatientFilterArray, { "Id": 2 })[0].isChecked,
                "IsHighRiskInd": $filter("filter")($scope.PatientFilterArray, { "Id": 3 })[0].isChecked
            }
            param.PatientIDLst = obj;
            param.GetAllPatientInd = $scope.AllPatientCheck;
            var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
            eHnoteMasterDataService.addPatientSearchInfo(param);
            InitialiseSearchParam();
            $scope.morepatientdata = false;

            //return false;
            eHnotePatientDataService.SearchPatient1(param, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);

        }
    };
    $scope.$on("$locationChangeSuccess", function () {
        if (!$scope.morepatientdata) {
            $scope.SearchPatients();
        }
    });
    $scope.patientinitval = {};
    $scope.patientinitval.patientCaseBillingAmtInfo = [];
    $scope.patientpushval = [];
    function OnGetSearchPatientSuccess(data) {
        var patients = $scope.patients;
        if (data.count > 0) {
            $scope.count = data.count;
            $scope.ShowAllPatientsValue = false;
            $scope.ShowAllfilterPatientsValue = false;
            $scope.currentPage = 1;

            $scope.totalItems = data.count;




            $scope.patients = eHnotePatientDataService.RestructureSearchPatientData(data.rows);

            if ($scope.patients.length != 0) {
                angular.forEach($scope.patients, function (item) {
                    var PhoneNumber = item.PhoneNumber;
                    var SSN = item.SSN;
                    SSN = SSN||"";
                    SSN = item.SSN.toString();
                    PhoneNumber = item.PhoneNumber.toString();
                    if (PhoneNumber.length > 0) {
                        var number = PhoneNumber;
                        number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.substring(5, 10);;
                        item.TempPhNumber = number;
                    } else {
                        item.TempPhNumber = "";
                    }
                    if (SSN.length > 0) {
                        var SSNnumber = SSN;
                        SSNnumber = SSNnumber.slice(0, 3) + '-' + SSNnumber.slice(3, 5) + '-' + SSNnumber.substring(5, 10);;
                        item.TempSSNnumber = SSNnumber;
                    } else {
                        item.TempSSNnumber = "";
                    }
                });
            }

            $scope.noresult = false;
            $scope.showloading = false;
            //angular.forEach(data.rows, function (item) {
            //    $scope.EmailID = item.EmailID;
            //    if (item.CurrentAge !== undefined) {
            //        $scope.ageSplits.year = item.CurrentAge.year;
            //        $scope.ageSplits.months = item.CurrentAge.month.toString();
            //        if ($scope.ageSplits.months < 10) {
            //            $scope.ageSplits.months = "0" + $scope.ageSplits.months;
            //            item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
            //        } else {
            //            item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
            //        }
            //    } else {
            //        if (item.Age !== undefined) {
            //            if (item.Age.toString().indexOf('.') !== -1) {
            //                var ageSplitArray = item.Age.toString().split('.');
            //                $scope.ageSplits.year = ageSplitArray[0].toString();
            //                $scope.ageSplits.months = ageSplitArray[1].toString();
            //                item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
            //            } else {
            //                $scope.ageSplits.year = item.Age.toString();
            //                $scope.ageSplits.months = '0';
            //                item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
            //            }
            //        } else {
            //            $scope.ageSplits = {
            //                "year": 0,
            //                "months": '0'
            //            };
            //        }
            //    }
            //});

            $scope.$broadcast("scroll.infiniteScrollComplete");
        } else {
            $scope.ShowAllPatientsValue = true;
            $scope.ShowAllfilterPatientsValue = false;
            $scope.count = 0;
            $scope.patients = [];
            $scope.totalItems = 0;
        }
    }
    function OnGetPatientSearchError() {
        $scope.ShowAllPatientsValue = true;
        $scope.ShowAllfilterPatientsValue = false;
        $scope.count = 0;
        $scope.patients = [];
        $scope.totalItems = 0;
    }
    $scope.toggleGroup = function (item) {
        if ($scope.isGroupShown(item)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = item;
        }
    };
    $scope.isGroupShown = function (item) {
        return $scope.shownGroup === item;
    };
    $scope.hover = function (fruit) {
        return fruit.showDelete = !fruit.showDelete;
    };
    $scope.appointmentconsultationstatus = false;
    $scope.consultationEntry = function (item) {

        var object = {
            "PatientId": item.PatientID,
            "AppointmentDate": $filter('date')(new Date(), "dd-MMM-yyyy"),
            "HospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "DoctorId": doctorinfo.doctorid
        };

        eHnotePatientDataService.CheckAppointmentStatus(object).then(function (resp) {
            if (resp.data.Status) {

                continueToStartConsultation(resp.data.AppointmentID, item);

            } else {
                //continueToStartConsultation(0, item);
                $scope.appointmentconsultationstatus = true;
                $scope.referredappointmentdate = $filter('date')(new Date(), "dd-MMM-yyyy");
                $scope.SelectedDoctor = doctorinfo.doctordata.User[0];
                //$scope.patinet_appStarttime = $filter('date')(new Date(), "HH:mm");
                $scope.Current_patinet_appStarttime = $filter('date')(new Date(), "HH:mm");
                $scope.Current_patinet_appEndtime = $filter('date')(new Date(), "HH:mm");
                $scope.SelectedPatientDetails = item;

                bindStartTime();
            }
        }, function (err) {
            console.log(err);
            //continueToStartConsultation(0, item);
        });

        //bindStartTime();
    };
    $scope.AddAppointmentToContinue = function () {
        var appointdate = $filter('date')(new Date($scope.referredappointmentdate), "yyyy-MM-dd");
        var daycd = $filter('date')(new Date($scope.referredappointmentdate), "EEE");
        // var starttime = $scope.patinet_appStarttime.startTime;
        var starttime = $scope.Current_patinet_appStarttime;
        var endtime = $scope.Current_patinet_appEndtime;
        //var exitLoop = false;
        daycd = daycd.toUpperCase();
        var hospcode = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        var hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        var parenthospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        eHnotePatientDataService.AddPatientAppointmentImmediate(starttime, endtime, doctorinfo.doctorid, daycd, appointdate, $scope.SelectedPatientDetails.PatientID, OnAddApointmentSuccess, OnAddApointmentError);

        function OnAddApointmentSuccess(data) {
            //var endConsultationData = eHnoteMasterDataService.getAfterConsultationData();
            if (data.response !== null && data.response.AppointmentID !== null) {
                continueToStartConsultation(data.response.AppointmentID, $scope.SelectedPatientDetails);
                $scope.appointmentconsultationstatus = false;
                $scope.SelectedPatientDetails = {};
            }
        }
        function OnAddApointmentError(err) {
            console.log(err);
            $scope.SelectedPatientDetails = {};
        }

    };

    $scope.appointmentconsultationstatuspopup = function () {
        $scope.appointmentconsultationstatus = false;
    };
    $scope.closeConsultationStatuspopUp = function () {
        $scope.consultationStatuspopUp = false;
    };
    $scope.continuetoConsultationAs = function (from) {
        $scope.consultationStatuspopUp = false;
        if (from === "Existing") {
            continueToStartConsultation($scope.appointmentIdfromDB, $scope.selectedItemInStrtConsultation);
        } else {
            continueToStartConsultation(0, $scope.selectedItemInStrtConsultation);
        }
    };
    function continueToStartConsultation(appId, item) {
        eHnoteMasterDataService.IsClickFromStartConsultation(true);
        if (item.CurrentAge !== undefined) {
            $scope.ageSplits.year = item.CurrentAge.year;
            $scope.ageSplits.months = item.CurrentAge.month.toString();
            item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
        } else {
            if (item.Age !== undefined) {
                if (item.Age.toString().indexOf('.') !== -1) {
                    var ageSplitArray = item.Age.toString().split('.');
                    $scope.ageSplits.year = ageSplitArray[0].toString();
                    $scope.ageSplits.months = ageSplitArray[1].toString();
                    item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                } else {
                    $scope.ageSplits.year = item.Age.toString();
                    $scope.ageSplits.months = '0';
                    item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                }
            } else {
                $scope.ageSplits = { year: 0, months: '0' };
            }
        }
        item.Patient = [];
        item.PatientAddress = [];
        item.PatientPhone = [];
        item.Patient.push({
            "PatientID": item.PatientID,
            "Title": item.Title,
            "FullName": item.FullName,
            "Age": item.Age,
            "Gender": item.Gender,
            "EmailID": item.EmailID
        });
        item.PatientPhone.push({
            "PhNumber": item.PhoneNumber
        });
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalIDLst !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalIDLst !== 0) {
            eHnoteMasterDataService.addDisplayID(item.DisplayID);
        } else {
            item.DisplayID = "";
            eHnoteMasterDataService.addDisplayID(item.DisplayID);
        }
        eHnotePatientDataService.getPatientAllBillingInfo(item.PatientID, eHnoteMasterDataService.getLoginId(), 0, 0, 'E', callbackSuccessonBilling, ErrorononBilling);
        //setCacheStorage(item, datapersistanceFactory, eHnoteCacheStorageService, eHnoteMasterDataService);
        //eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        //if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        //    var hospcode = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        //    eHnotePatientDataService.GetAppointmentCaseHistory(doctorinfo.doctorid, item.PatientID, 1, hospcode, OnGetCaseHistorySuccess, OnGetCaseHistoryError);
        //} else {
        //    var hospcode = undefined;
        //    eHnotePatientDataService.GetAppointmentCaseHistory(doctorinfo.doctorid, item.PatientID, 1, hospcode, OnGetCaseHistorySuccess, OnGetCaseHistoryError);
        //}
        //$scope.tmpcasehistory = [];
        //function OnGetCaseHistorySuccess(data) {
        //    $scope.pasthistory = data;
        //    $scope.tmpcasehistory = data.rows;
        //    var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        //    if ($scope.tmpcasehistory !== undefined && $scope.tmpcasehistory.length === 0) {
        //        eHnoteMasterDataService.IsClickFromStartConsultation(false);
        //        eHnoteValidateUsersDataService.RemoveProcessingCookies();
        //        eHnoteMasterDataService.addconsultType("NEW");
        //        eHnoteMasterDataService.addpastpatienthistory($scope.pasthistory);
        //        cacheStorageItem.IsEasyMode = true;
        //        cacheStorageItem.IsNormalMode = false;
        //        cacheStorageItem.IsInvestigationMode = false;
        //        cacheStorageItem.appointmentid = appId;
        //        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
        //         
        //    } else {
        //        cacheStorageItem.appObjectCollection.VisitReason = '';
        //        cacheStorageItem.appointmentid = appId;
        //        cacheStorageItem.patientSignedConsentList = data.rows[0].consentForms;
        //        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
        //        //var url = "/casehistory";
        //        var url = "/Pastvisit";
        //        $location.url(url);
        //    }
        //}
        //function OnGetCaseHistoryError(err) {
        //    console.log(err);
        //    alertify.log("Check Internet connectivity");
        //}




        var url = "/Pastvisit";
        $location.url(url);
    }
    function callbackSuccessonBilling(data) {
        eHnoteMasterDataService.addBillingInfo('');
        eHnoteMasterDataService.addBillingInfo(data);
    }
    function ErrorononBilling(data) {
    }
    $scope.StartAppointment = function (item) {
        item.Patient = [];
        item.PatientAddress = [];
        item.PatientPhone = [];
        item.Patient.push({
            "PatientID": item.PatientID,
            "Title": item.Title,
            "FullName": item.FullName,
            "DOB": item.DOB,
            "Gender": item.Gender
        });
        item.PatientPhone.push({ PhNumber: item.PhoneNumber });
        //setCacheStorage(item, datapersistanceFactory, eHnoteCacheStorageService, eHnoteMasterDataService);
        eHnoteValidateUsersDataService.RemoveProcessingCookies();
        var url = "/main";
        $location.url(url);
    };

 


    $scope.GetReferredAppointmentByConsultIds = function (clinic) {
        var param = eHnoteMasterDataService.getPatientSearchInfo();
        $scope.SearchBy = "";
        param.DoctorID = eHnoteMasterDataService.getLoginId();
        param.PageSize = 21;
        param.PageNumber = 1;
        param.SearchText = "";
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            param['HospitalCD'] = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            param['HospitalIDLst'] = 0;
        }
        if (clinic && clinic.ExtDetails && clinic.ExtDetails.HospitalIDLst && clinic.ExtDetails.HospitalIDLst !== null) {
            param['HospitalIDLst'] = clinic.ExtDetails.HospitalIDLst;
        }
        var list1 = [];
        angular.forEach($scope.SpecilaizationFilterArray, function (items) {
            if (items.isChecked) {
                list1.push(items.Id);
            }
        });
        param.SpecilaizationIDLst = list1;
        param.GetAllSpecializationInd = $scope.AllSpecializationCheck;

        var obj = {
            "ISVIPInd": $filter("filter")($scope.PatientFilterArray, { "Id": 1 })[0].isChecked,
            "IsResearchInd": $filter("filter")($scope.PatientFilterArray, { "Id": 2 })[0].isChecked,
            "IsHighRiskInd": $filter("filter")($scope.PatientFilterArray, { "Id": 3 })[0].isChecked
        }
        param.PatientIDLst = obj;
        param.GetAllPatientInd = $scope.AllPatientCheck;
        eHnoteMasterDataService.addPatientSearchInfo(param);
        InitialiseSearchParam();

        eHnotePatientDataService.SearchPatient1(param, OnGetSearchPatientSuccess, OnGetPatientError, $scope.sendhospcode);
    };
    $scope.ScheduleFollowup = function (item) {
    };
    $scope.NavToViewCaseHistory = function (item) {


        eHnoteAuditServices.getParticularPatientDetailsById(item.PatientID, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(response) {
            console.log(response);
            if (response.count > 0) {

                $scope.patients = eHnotePatientDataService.RestructureSearchPatientData(response.rows);

                var patientitem = $scope.patients[0];

                eHnoteMasterDataService.addpatientData(patientitem);


                patientitem.PatientDetails = {
                    "PatientID": patientitem.PatientID,
                    "Title": patientitem.Title,
                    "FullName": patientitem.FullName,
                    "DOB": patientitem.DOB,
                    "Gender": patientitem.Gender,
                    "Age": patientitem.Age,
                    "AgeInYears": patientitem.AgeInYears,
                    "AgeInMonths": patientitem.AgeInMonths,
                    "AgeInDays": patientitem.AgeInDays,
                    "CurrentAge": patientitem.CurrentAge,
                    "PatientDisplayId": patientitem.patientdisplayid || "",
                    "MobileNo": patientitem.PhoneNumber,
                    "ContactNo": patientitem.ContactNo || "",
                    "EmailId": patientitem.EmailID,
                    "PatientGSTNO": patientitem.PatientGSTNO || ""
                };

                eHnoteMasterDataService.addAppointmentInfo(patientitem);

                $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                $scope.cacheStorageItem.PatientName = patientitem.FullName;
                $scope.cacheStorageItem.patientid = patientitem.PatientID;
                $scope.cacheStorageItem.PatientID = patientitem.PatientID;
                $scope.cacheStorageItem.appointmentid = 0;
                $scope.cacheStorageItem.AppointmentStatus = "";
                $scope.cacheStorageItem.PatientTypeId = patientitem.PatientTypeId;
                $scope.cacheStorageItem.PatientDisplayId = patientitem.DisplayID || "";
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);



                var url = "";

                console.log($scope.IsOt);
                if (doctorinfo.RoleID === 18) {
                    $scope.IsOt = true;
                }
                if (!$scope.IsOt) {
                    if ($scope.SpecializationId === 2) {//Dentist
                        url = "/DentalPast";
                    } else {
                        //url = "/Pastvisit";
                        url = "/PastVisitList";
                    }
                } else {
                    if ($scope.SpecializationId === 2) {//Dentist
                        url = "/OtDentalPast";
                    } else {
                        url = "/OtPastvisit";
                    }
                }


                datapersistanceFactory.set("PreviousState", $location.url());


                $location.url(url);
            }

        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }


       
    };
    $scope.CustomMessage = function (item) { };
    function InitialiseSearchParam() {
        $scope.patients = [];
        $scope.morepatientdata = true;
        prevpagno = 0;
        pageno = 0;
        $scope.pageno = 1;
    }
    function OnGetPatientError(err) {
        console.log(err);
    }
    $scope.getLastVistedDate = function (Visitedate) {
        if (Visitedate !== undefined) {
            var thedate = $filter('date')(new Date(Visitedate), "yyyy-MM-dd");
            var currdate = $filter('date')(new Date(), "yyyy-MM-dd");
            var date1 = new Date(thedate);
            var date2 = new Date(currdate);
            var m = moment(date2);
            var years = m.diff(date1, 'years');
            m.add(-years, 'years');
            var months = m.diff(date1, 'months');
            m.add(-months, 'months');
            var days = m.diff(date1, 'days');
            var daysago;
            if (months <= 0) {
                daysago = days.toString() + " Day(s) Ago ";
            } else {
                if (months > 1) {
                    daysago = months.toString() + " Months " + days.toString() + " Day(s) " + " Ago ";
                } else {
                    daysago = months.toString() + " Month " + days.toString() + " Day(s)" + " Ago ";
                }
            }
            return daysago;
        }
    };
    $scope.Agecheck = "Y";
    $scope.Dobcheck = "N";
    $scope.Lastvisited = "N";
    $scope.Frmage = 0;
    $scope.Toage = 0;
    $scope.agevalues = "Y";
    $scope.daycheck = "Y";
    $scope.dates = "Y";
    $scope.ageCheckChange = function (Agecheck1) {
        if (Agecheck1 === "Y") {
            $scope.Agecheck = 'Y';
        } else {
            $scope.Agecheck = "N";
            $scope.agevalues = "N";
        }
        $scope.agevalues = Agecheck1;
    };
    $scope.DOBCheckChange = function (DobcheckValue) {
        if (DobcheckValue === "YES") {
            $scope.dates = "Y";
        } else {
            $scope.dates = "N";
            $scope.Fromdob = "";
            $scope.Todob = "";
        }
        $scope.dates = DobcheckValue;
    };
    $scope.lastVisitedChange = function (LastVisited) {
        if (LastVisited === "YES") {
        } else {
            $scope.Lastvisited = "N";
            $scope.Fromdate = "";
            $scope.Todate = "";
        }
        $scope.Lastvisited = LastVisited;
    };
    $scope.chkLapsedTime = function (startDate, endDate) {
        var check_todaydate = moment(startDate).format("YYYY-MM-DD");
        var momentObj = moment(new Date()).format("YYYY-MM-DD");
        var momment_currentdate = moment(endDate).format("YYYY-MM-DD");
        var blnLapsed = true;
        if (check_todaydate > momment_currentdate) {
            blnLapsed = false;
        }
        return blnLapsed;
    };
    $scope.LoadPatient = function () {
        $scope.showicon = false;
        var clinic = $scope.AppListselectedclinic;
        var param = eHnoteMasterDataService.getPatientSearchInfo();
        param.DoctorID = eHnoteMasterDataService.getLoginId();
        param.PageSize = 21;
        param.PageNumber = 1;
        param.SearchText = "";
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            param['HospitalCD'] = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        }
        param.EndAge = ($scope.Toage === "") ? 0 : 0;
        param.StartAge = ($scope.Frmage === "") ? 0 : 0;
        param.Count = 0;
        $scope.checkall = 'Y';


        eHnoteMasterDataService.addPatientSearchInfo(param);
        $scope.SearchPatients();
    };
    $scope.clearRegPatientDetails = function () {
        $scope.showicon = false;
        var tmppatientinfo = eHnoteMasterDataService.getNewPatientInfo();
        tmppatientinfo.phonenumber = "";
        tmppatientinfo.hasphone = true;
        eHnoteMasterDataService.addNewPatientInfo(tmppatientinfo);
    };
    $scope.Regpatient = function (item) {
        $scope.clearRegPatientDetails();
        var url = "/registerPatient";
        $location.url(url);
        var tmpEmpty = [];
        eHnoteMasterDataService.addAppointmentInfoFrmPatient(tmpEmpty);
        if (item) {
            $scope.frmregpatient = "Save Patient";
            eHnoteMasterDataService.Addpatientvalconsult($scope.frmregpatient);
        } else {
            $scope.frmregpatient = "Start Consultation";
            eHnoteMasterDataService.Addpatientvalconsult($scope.frmregpatient);
        }
    };
    $scope.hosploadallcal = [];
    $scope.loadAllPatients = function () {
        $scope.showicon = false;
        if ($scope.selected !== undefined) {
            if ($scope.selected.length === $scope.HospitalArray.length) {
            } else {
                //$scope.toggleAll();
            }
        }
        $scope.SearchBy = "";
        var param = eHnoteMasterDataService.getPatientSearchInfo();
        param.DoctorID = eHnoteMasterDataService.getLoginId();
        param.PageSize = 21;
        param.PageNumber = 1;
        param.SearchText = "";

        param.loaderStatus = true;
        eHnoteMasterDataService.addPatientSearchInfo(param);
        var list1 = [];
        angular.forEach($scope.SpecilaizationFilterArray, function (items) {
            if (items.isChecked) {
                list1.push(items.Id);
            }
        });
        param.SpecilaizationIDLst = list1;
        param.GetAllSpecializationInd = $scope.AllSpecializationCheck;

        var obj = {
            "ISVIPInd": $filter("filter")($scope.PatientFilterArray, { "Id": 1 })[0].isChecked,
            "IsResearchInd": $filter("filter")($scope.PatientFilterArray, { "Id": 2 })[0].isChecked,
            "IsHighRiskInd": $filter("filter")($scope.PatientFilterArray, { "Id": 3 })[0].isChecked
        }
        param.PatientIDLst = obj;
        param.GetAllPatientInd = $scope.AllPatientCheck;
        eHnotePatientDataService.SearchPatient1(param, onLoadSuccess, onLoadError, $scope.sendhospcode);
        $scope.Reset();
    };
    function onLoadSuccess(data) {
        $scope.ShowAllPatientsValue = false;
        $scope.ShowAllfilterPatientsValue = false;

        $scope.totalItems = data.count;
        $scope.totalItemsCount = data.count / 2;
        var check_val = isInteger($scope.totalItems);
        if (check_val) {
            $scope.totalItems = $scope.totalItemsCount;
        } else {
            $scope.totalItems = $scope.totalItemsCount + 1;
        }



        $scope.patients = eHnotePatientDataService.RestructureSearchPatientData(data.rows);
        $scope.noresult = false;
        $scope.showloading = false;
        angular.forEach(data.rows, function (item) {
            if (item.CurrentAge !== undefined) {
                $scope.ageSplits.year = item.CurrentAge.year;
                $scope.ageSplits.months = item.CurrentAge.month.toString();
                if ($scope.ageSplits.months < 10) {
                    $scope.ageSplits.months = "0" + $scope.ageSplits.months;
                    item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                } else {
                    item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                }
            } else {
                if (item.Age !== undefined) {
                    if (item.Age.toString().indexOf('.') !== -1) {
                        var ageSplitArray = item.Age.toString().split('.');
                        $scope.ageSplits.year = ageSplitArray[0].toString();
                        $scope.ageSplits.months = ageSplitArray[1].toString();
                        item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                    } else {
                        $scope.ageSplits.year = item.Age.toString();
                        $scope.ageSplits.months = '0';
                        item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                    }
                } else {
                    $scope.ageSplits = { year: 1, months: '0' };
                }
            }
        });
        $scope.$broadcast("scroll.infiniteScrollComplete");
    }
    function onLoadError(data) {
    }
    $scope.currentPage = 1;
    $scope.itemsperpage = 21;
    $scope.maxsize = 10;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.changePatientPage = function (pageno) {







        var getParams = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "USRType": "DOCTOR",
            "PageSize": 21,
            "PageNumber": pageno,
            "SearchText": ($scope.searchtype.SearchBy === "" || $scope.searchtype.SearchBy === undefined) ? "" : $scope.searchtype.SearchBy,
            "Count": $scope.count,
            "PhoneNumber": ($scope.searchtype.SearchBy === "" || $scope.searchtype.SearchBy === undefined) ? "" : $scope.searchtype.SearchBy,
            "GenderIndicator": $scope.Gender
        };
        getParams.SearchDetails = {};
        if ($scope.Toagevalue && $scope.frmagevalue) {
            getParams.StartAge = parseInt($scope.Frmage);
            getParams.EndAge = parseInt($scope.Toage);
        } else {
            getParams.StartAge = 0;
            getParams.EndAge = 0;
        }
        if ($scope.Fromdate !== '' && $scope.Todate !== '') {
            getParams.SearchDetails.StartDate = $filter('date')(new Date($scope.Fromdate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")), "yyyy-MM-dd");
            getParams.SearchDetails.EndDate = $filter('date')(new Date($scope.Todate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")), "yyyy-MM-dd");
        }
        if ($scope.Fromdob !== '' && $scope.Todob !== '') {
            getParams.SearchDetails.startDOB = $filter('date')(new Date($scope.Fromdob.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")), "yyyy-MM-dd");
            getParams.SearchDetails.endDOB = $filter('date')(new Date($scope.Todob.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")), "yyyy-MM-dd");
        }
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
            $scope.listval = [];
            angular.forEach($scope.selected, function (item) {
                $scope.listval.push(item.HospitalID);
            });
            //if ($scope.listval.length > 0) {
            //    getParams.HospitalIDLst = $scope.listval;
            //} else {
            //    $scope.listval.push($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
            //    getParams.HospitalIDLst = $scope.listval;
            //}

            var list = [];
            angular.forEach($scope.HospitalArray, function (items) {
                if (items.isChecked) {
                    list.push(items.HospitalID);
                }
            });
            if (list.length > 0) {
                getParams.HospitalIDLst = list;
            } else {
                list.push($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
                getParams.HospitalIDLst = list;
            }

        }
        var list1 = [];
        angular.forEach($scope.SpecilaizationFilterArray, function (items) {
            if (items.isChecked) {
                list1.push(items.Id);
            }
        });
        getParams.SpecilaizationIDLst = list1;
        getParams.GetAllSpecializationInd = $scope.AllSpecializationCheck;

        var obj = {
            "ISVIPInd": $filter("filter")($scope.PatientFilterArray, { "Id": 1 })[0].isChecked,
            "IsResearchInd": $filter("filter")($scope.PatientFilterArray, { "Id": 2 })[0].isChecked,
            "IsHighRiskInd": $filter("filter")($scope.PatientFilterArray, { "Id": 3 })[0].isChecked
        }
        getParams.PatientIDLst = obj;
        getParams.GetAllPatientInd = $scope.AllPatientCheck;
        getParams.HospitalID = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

        eHnotePatientDataService.SearchPatient1(getParams, OnGetPageSuccess, OnGetPageError, $scope.sendhospcode);
    };
    $scope.patientinitval = {};
    $scope.patientinitval.patientCaseBillingAmtInfo = [];
    $scope.patientpushval = [];
    function OnGetPageSuccess(data) {
        if (data.count > 0) {
            $scope.totalItems = data.count;
            $scope.ShowAllPatientsValue = false;
            $scope.ShowAllfilterPatientsValue = false;
            var patientsdata = data.rows;
            $scope.patientpushval.length = 0;

            $scope.patients = eHnotePatientDataService.RestructureSearchPatientData(data.rows);





            $scope.noresult = false;
            $scope.showloading = false;
            angular.forEach(data.rows, function (item) {
                if (item.CurrentAge !== undefined) {
                    $scope.ageSplits.year = item.CurrentAge.year;
                    $scope.ageSplits.months = item.CurrentAge.month.toString();
                    if ($scope.ageSplits.months < 10) {
                        $scope.ageSplits.months = "0" + $scope.ageSplits.months;
                        item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                    } else {
                        item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                    }
                } else {
                    if (item.Age !== undefined) {
                        if (item.Age.toString().indexOf('.') !== -1) {
                            var ageSplitArray = item.Age.toString().split('.');
                            $scope.ageSplits.year = ageSplitArray[0].toString();
                            $scope.ageSplits.months = ageSplitArray[1].toString();
                            item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                        } else {
                            $scope.ageSplits.year = item.Age.toString();
                            $scope.ageSplits.months = '0';
                            item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                        }
                    } else {
                        $scope.ageSplits = {
                            "year": 1,
                            "months": '0'
                        };
                    }
                }
            });
            $scope.$broadcast("scroll.infiniteScrollComplete");
        } else {
            $scope.ShowAllPatientsValue = true;
        }
    }
    function OnGetPageError(data) {
        alertify.error(data.Message);
        $scope.patients = [];
        $scope.totalItems = 0;
    }
    $scope.clearModelValue = function () {
        $scope.SearchBy = "";
        $scope.LoadPatient();
    };
    function isInteger(x) {
        return x % 1 === 0;
    }
    $scope.chbcheckval = [];
    $scope.selected = [];
    $scope.toggle = function (item) {
        var checkedArray = _.where($scope.HospitalArray, { isChecked: true });
        $scope.Allbranchcheck = checkedArray.length > 0 && $scope.HospitalArray.length === checkedArray.length ? true : false;

    };
    $scope.toggleSpecialization = function (item) {
        var checkedArray2 = _.where($scope.SpecilaizationFilterArray, { isChecked: true });
        $scope.AllSpecializationCheck = checkedArray2.length > 0 && $scope.SpecilaizationFilterArray.length === checkedArray2.length ? true : false;

    };
    $scope.togglePatient = function (item) {
        var checkedArray1 = _.where($scope.PatientFilterArray, { isChecked: true });
        $scope.AllPatientCheck = checkedArray1.length > 0 && $scope.PatientFilterArray.length === checkedArray1.length ? true : false;

    };
    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
    $scope.isChecked = function () {
        return $scope.selected.length === $scope.HospitalArray.length;
    };
    //$scope.toggleAll = function () {
    //if ($scope.selected !== undefined) {
    //if ($scope.selected.length === $scope.HospitalArray.length) {
    //    $scope.selected = [];
    //} else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
    //    $scope.selected = $scope.HospitalArray.slice(0);
    //}
    //}
    //};
    $scope.Reset = function () {
        $scope.Frmage = "";
        $scope.Toage = "";
        $scope.Fromdate = "";
        $scope.Todate = "";
        $scope.Fromdob = "";
        $scope.Todob = "";
        $scope.Dobcheck = "NO";
        $scope.Lastvisited = "NO;";
        $scope.SearchBy = "";

        //$scope.onload(); // commented  by sabarish


        //if ($scope.selected !== undefined) {
        //    if ($scope.selected.length === $scope.HospitalArray.length) {
        //    } else {
        //        $scope.toggleAll();
        //    }
        //}
    };
    $scope.SearchByReferralSource = function () {
        $scope.Refferalserachname = $scope.patientedit.othDetailreferralsourceName;
        if ($scope.Refferalserachname === "" || $scope.Refferalserachname.length < 2) {
            $scope.ShowRefferallist = false;
            $scope.patientedit.othDetailreferralsource = 0;
            return false;
        } else {
            $scope.ShowRefferallist = true;
            getSourceListing($scope.Refferalserachname);
        }
    };

    $scope.changeReferral = function (selectedReferral) {
         $scope.ShowRefferallist = false;
        if (selectedReferral === null) {
            $scope.patientedit.othDetailreferralsource = "";
            $scope.patientedit.othDetailreferralsourceName = "";
        } else {
            $scope.patientedit.othDetailreferralsource = selectedReferral.ReferralID;
            $scope.patientedit.othDetailreferralsourceName = selectedReferral.ReferralTitle;
        }
    };

    $scope.editAppointmentPopup = function (item) {
        $scope.patientData = item;

        //$scope.patientData = {
        //    "PatientId": $scope.patientData.PatientID,
        //    "firstname": $scope.patientData.PatientName,
        //    "EmailId": ""
        //};

        $scope.Parent.EditPatientComingFrom = "PatientList";

        $scope.Parent.EditPatientPopUp = $uibModal.open({
            "templateUrl": 'editpatientDirectivePopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "inventory-full-popup"
        });
    };
   // $scope.Showeditpatient = false;
    $scope.navtoEditPatient = function (item) {

        //$scope.patientData = item;
        //$scope.Parent.EditPatientComingFrom = "PatientList";

        //var data = {
        //    "PatientData": item,
        //    "AppointmentData": "",
        //    "IsFromApptScreen": true
        //}
        //eHnoteMasterDataService.addPatientApptDataApptList(data);
        item.PatientDetails = item.PatientDetails || "";
        if (item.PatientID == undefined) {
            item.PatientID = item.PatientId || null;
        }

        item.PatientDetails = {
            "PatientID": item.PatientID
        }
        eHnoteMasterDataService.addPatientDetailsforBarcode(item);
        eHnoteMasterDataService.addpatientData(item);
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        eHnoteMasterDataService.addAppointmentInfo(item);
        $scope.cacheStorageItem.PatientTypeId = item.PatientTypeId;




        $scope.cacheStorageItem.patientid = item.PatientID;
        item.PatientID = item.PatientID;
        item.MasterPatientId = item.MasterPatientId;
        $scope.cacheStorageItem.PatientID = item.PatientID;
        item.Gender = item.Gender || "";
        item.PatientGSTNO = item.PatientGSTNO || "";
      
        $scope.cacheStorageItem.PatientName = item.FullName;
        $scope.cacheStorageItem.PatientTypeId = item.PatientTypeId;
        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;
        $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        $scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        //if ($scope.AllDoctorList != undefined) {
        //    $scope.cacheStorageItem.AllDoctorsList = $scope.AllDoctorList || [];
        //}
        $scope.Showeditpatient = true;
        $location.url("/profile");
       // $location.url("/registerPatient");
    }



    $scope.$on("editpatientclosePopup", function (event) {
        $scope.LoadPatient();
        $scope.SearchBy = "";
        setpatientedit();
        //SetupPopUp.dismiss('cancel');
        //$scope.shownewAppointmentPopUp = false;
    });





    $scope.placeChanged = function () {
        $scope.patientedit.Country = '';
        $scope.patientedit.State = '';
        $scope.patientedit.CityTown = '';
        $scope.patientedit.Location = '';
        $scope.state = false;
        $scope.latlngStatus = true;
        $scope.patientedit.CityTown = '';
        $scope.place = this.getPlace();
        var lat_val = $scope.place.geometry.location.lat();
        var lng_val = $scope.place.geometry.location.lng();
        $scope.patientedit.Longitude = lng_val.toString();
        $scope.patientedit.Latitude = lat_val.toString();
        angular.forEach($scope.place.address_components, function (place) {
            angular.forEach(place.types, function (item) {
                var exitLoop = false;
                if (item === "country") {
                    $scope.patientedit.Country = place.long_name;
                    $scope.countryval = place.short_name;
                }
                setTimeout(function () {
                    if (item === "administrative_area_level_1") {
                        angular.forEach($scope.stateValues, function (item) {
                            if (!exitLoop) {
                                if (item.StateID === place.short_name) {
                                    $scope.patientedit.State = place.long_name;
                                    $scope.stateval = place.short_name;
                                    $scope.state = false;
                                    exitLoop = true;
                                } else {
                                    $scope.state = true;
                                }
                            }
                        });
                    }
                    $scope.changeState();
                }, 50);
                setTimeout(function () {
                    if (item === "administrative_area_level_2") {
                        angular.forEach($scope.cityValues, function (item) {
                            if (item.CityIDDesc === place.short_name) {
                                window.dispatchEvent(new Event('resize'));
                                $scope.patientedit.CityTown = item.CityIDDesc;
                            }
                        });
                    }
                    $scope.changecitytown();
                }, 100);
                setTimeout(function () {
                    if (item === "sublocality_level_1") {
                        angular.forEach($scope.locationValues, function (locationitem) {
                            if (locationitem.LocationIDDesc === place.short_name) {
                                window.dispatchEvent(new Event('resize'));
                                $scope.patientedit.Location = locationitem.LocationIDDesc;
                                document.getElementById('Location').value = locationitem.LocationID;
                            }
                        });
                    }
                }, 50);
            });
        });
    };
    $scope.onCountryChange = function (item) {
        $scope.patientedit.Country = item.Name;
        $scope.patientedit.CountryId = item.Id;
    };
    $scope.onCityChange = function (item) {
        $scope.patientedit.CityTown = item.Name;
        $scope.patientedit.CityId = item.Id;
    };
    $scope.onStateChange = function (item) {
        $scope.patientedit.State = item.Name;
        $scope.patientedit.StateId = item.StateId;
    };
    $scope.onReferralChange = function (refid) {
    };
    $scope.onEducationChange = function (eduid) {
    };
    var getplacesParams = { "DoctorID": doctorinfo.doctordata.User[0].DoctorID, "ActiveIND": "Y" };
    $scope.getDate = function (Tmpfromdate) {
        var todate = new Date();
        var age = [];
        var fromdate = new Date(Tmpfromdate);
        var y = [todate.getFullYear(), fromdate.getFullYear()];
        var ydiff = y[0] - y[1];
        var m = [todate.getMonth(), fromdate.getMonth()];
        var mdiff = m[0] - m[1];
        var d = [todate.getDate(), fromdate.getDate()];
        var ddiff = d[0] - d[1];
        if (mdiff < 0 || (mdiff === 0 && ddiff < 0))--ydiff;
        if (mdiff < 0) mdiff += 12;
        if (ddiff < 0) {
            fromdate.setMonth(m[1] + 1, 0);
            ddiff = fromdate.getDate() - d[1] + d[0];
            --mdiff;
        }
        if (ydiff > 0) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
        if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
        if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));
        if (age.length > 1) age.splice(age.length - 1, 0, ' and ');
        $scope.dYear = ydiff;
        $scope.mYear = mdiff.toString();
        if ($scope.mYear === "-1") {
            $scope.mYear = "0";
        }
        var curAge = $scope.dYear + '.' + $scope.mYear;
        $scope.CurrentAge = curAge;
    };
    $scope.setAge = function (item) {
        // $scope.patientedit.DOB = "";
        //var curAge = $scope.ageinYears + '.' + $scope.ageinMonths;
        //$scope.patientinfo.CurrentAge = curAge;
        $scope.patientedit.DOB = $scope.getDateOfBirth($scope.dYear, $scope.mYear);
    };
    $scope.setMonth = function (item) {
        //$scope.patientedit.DOB = "";
        $scope.patientedit.DOB = $scope.getDateOfBirth($scope.dYear, $scope.mYear);
    };
   
    $scope.getDoctorInfoByHospitalId = function (val) {
        if (val.HospitalInfo === undefined) {
        } else {
            $scope.HospitalID = val.HospitalInfo.HospitalDetails.HospitalID;
            $scope.changedHospitalID = val.HospitalInfo.HospitalDetails.HospitalID;
            $scope.changehos = val.HospitalInfo.HospitalDetails;
            //$scope.clinicDoctorList = val.DoctorDetails;

            $scope.clinicDoctorList = $filter("filter")(val.DoctorDetails, function (item) {
                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 16 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
            });
            $scope.patinet_appStarttime = "";
            $scope.EndtimeVAlue = "";

            $scope.BranchEmail = val.HospitalInfo.HospitalDetails.EmailAddress;
            $scope.BranchPhone = val.HospitalInfo.HospitalDetails.MobileNumber;
            $scope.BranchName = val.HospitalInfo.HospitalDetails.BranchName;
        }
    };
    $scope.closeAppointment = function () {
        $scope.addAppointmentInfo = false;
        $scope.clinicDoctorList = [];
        $scope.hospitalid = "";
        $scope.chgDate();
        $scope.patinet_appStarttime = "";
        $scope.othervisitrsn = "";
        $rootScope.appointment_type = "";
    };
    function getSourceListing() {
        var getParams = {
            "DoctorID": doctorinfo.doctorid,
            "USRType": "DOCTOR",
            "PageSize": 1000,
            "PageNumber": 1,
            "USRId": doctorinfo.doctorid,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        };
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            var hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            eHnoteOrgReferralDataServices.getReferralServicesList(getParams, hospid, onreadSuccess, onreadFailed);
        } else {
            var hospid = undefined;
            eHnoteOrgReferralDataServices.getReferralServicesList(getParams, hospid, onreadSuccess, onreadFailed);
        }
        function onreadSuccess(data) {
            $scope.ReferralList = data[0].rows;
        }
        function onreadFailed(data) {
        }
    }
    $scope.SourceChange = function (sourceid) {
        if (sourceid === '' || sourceid === undefined) {
            $scope.SubSource = "";
            $scope.subSourceList = "";
            return;
        }
        var params = {
            "DoctorID": doctorinfo.doctorid,
            "HospitalCD": $scope.HospitalCD,
            "USRType": "DOCTOR",
            "CatagoryID": parseInt(sourceid),
            "PageSize": 100,
            "PageNumber": 1,
            "UserId": doctorinfo.doctorid
        };
        eHnoteOrgReferralDataServices.listSubVisitReferral(params, listSubSourceSuccess, listSubSourceError);
        function listSubSourceSuccess(data) {
            if (data.status !== "failure") {
                $scope.subSourceList = data.response.rows;
                $scope.SubSource = "";
            } else {
                $scope.SubSource = "";
                $scope.subSourceList = "";
                alertify.error("No SubSource Available");
            }
        }
        function listSubSourceError(data) {
        }
    };
    $scope.apptypechange = function (appointment_type) {
        $scope.apptypeval = appointment_type;
    };
    $scope.BookAppointment = function () {
        var doctorId = 0;
        var UserBranchId = 0;
        var slots = eHnoteMasterDataService.getDocAvailConsultTimeInfo();
        var available = true;
        if ($scope.apptypeval === "" || $scope.apptypeval === undefined) {
            alertify.error('Please select appointment type');
            return false;
        } else {
            $rootScope.appointment_type = $scope.apptypeval;
            var VisitRsnType = $rootScope.appointment_type;
        }
        if ($scope.hospitalid === undefined || $scope.hospitalid === "") {
            alertify.error("Please Select Branch");
            return;
        }
        if ($scope.SelectedDoctor !== undefined && $scope.SelectedDoctor !== "" && $scope.hospitalLevelDoc && $scope.SelectedDoctor !== null) {
            doctorId = $scope.SelectedDoctor.DoctorID;
            UserBranchId = $scope.SelectedDoctor.UserBranchId;
        } else if (($scope.SelectedDoctor === undefined || $scope.SelectedDoctor === "") && $scope.hospitalLevelDoc) {
            alertify.error("Select Doctor");
            return;
        } else {
            doctorId = doctorinfo.doctordata.User[0].DoctorID;
            UserBranchId = doctorinfo.doctordata.UserAddress[0].UserBranchId;
        }
        if (($scope.singleDoctorList === undefined || $scope.singleDoctorList === "") && !$scope.hospitalLevelDoc) {
            alertify.error("Select Doctor");
            return;
        }
        if ($scope.patinet_appStarttime === undefined || $scope.patinet_appStarttime === "") {
            alertify.error("Select  Start Time");
            return;
        }
        if ($scope.EndtimeVAlue === undefined || $scope.EndtimeVAlue === "") {
            alertify.error("Select End  Time");
            return;
        }
        angular.forEach(slots, function (items) {
            if (available) {
                if ((items.seqStart <= $scope.patinet_appStarttime.seq) && ($scope.patinet_appStarttime.seq < items.seqend)) {
                    if (items.Available === "N") {
                        alertify.error("Selected time solt is already booked");
                        $scope.patinet_appStarttime = "";
                        $scope.EndtimeVAlue = "";
                        available = false;
                        return;
                    }
                }
            }
        });
        if (!available) {
            return false;
        }
        var time = $filter('date')(new Date(), 'HH:mm');
        var daycd = $filter('date')(new Date($scope.referredappointmentdate), "EEE").toUpperCase();
        var patient_appStartTime = $scope.patinet_appStarttime.startTime.toString();
        var patient_appEndTime = $scope.EndtimeVAlue === undefined ? "" : $scope.EndtimeVAlue.startTime.toString();
        if (parseInt(patient_appEndTime.replace(":", "")) < parseInt(patient_appStartTime.replace(":", ""))) {
            alertify.error("End time cannot be less than start time!");
            return;
        }
        var visitrsn = ($scope.othervisitrsn !== undefined) ? $scope.othervisitrsn : "";
        $rootScope.appointment_type = $scope.apptypeval;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined
            && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.BranchCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.BranchCode;
            $scope.ParentHospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
        if ($scope.changedHospitalID === 0) {
            $scope.changedHospitalID = $scope.HospitalID;
        } else {
            $scope.HospitalCD = $scope.changehos.HospitalCode;
            $scope.ParentHospitalID = $scope.changehos.ParentOrganizationId;
        }


        if ($scope.MobileNo === undefined) {
            $scope.MobileNo = "";
        }
        if ($scope.CommunicationMobileNo === undefined) {
            $scope.CommunicationMobileNo = "";
        }

        $scope.DocPHnumber = $scope.MobileNo === "" ? $scope.MobileNo : $scope.CountryCode + "" + $scope.MobileNo;
        $scope.DocCommunicationPhnumber = $scope.CommunicationMobileNo === "" ? $scope.CommunicationMobileNo : $scope.CommunicationCountryCode + "" + $scope.CommunicationMobileNo;

        if ($scope.PhoneNumber === undefined) {
            $scope.PhoneNumber = "";
        }

        $scope.PhoneNumber = $scope.PhoneNumber === "" ? $scope.PhoneNumber : $scope.CountryCode + "" + $scope.PhoneNumber;


        var Appparams = {
            "AppointmentID": 0,
            "AppointmentStatus": "B",
            "IsFollowUp": false,
            "StartTime": patient_appStartTime,
            "EndTime": patient_appEndTime,
            "DoctorID": parseInt(doctorId),
            "DayCD": daycd,
            "VisitUserTypeID": $("#appointment_type option:selected").text(),
            "OtherVisitRsn": visitrsn,
            "ConsultationDt": $filter('date')(new Date($scope.referredappointmentdate), "yyyy-MM-dd"),
            "UserBranchId": UserBranchId,
            "PatientID": $scope.PatientID,
            "UserId": parseInt(doctorId),
            "USRType": "DOCTOR",
            "DoctorVisitRsnID": parseInt($rootScope.appointment_type),
            "HospitalDetails": {
                "HospitalID": $scope.changedHospitalID,
                "HospitalCD": $scope.HospitalCD,
                "ParentHospitalID": $scope.ParentHospitalID,
                "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
            },
            "ReferralSourceDtls": {
                "ReferralID": parseInt($scope.Source),
                "SubReferralID": 2
            },
            "CommunicationDetails": {
                "PatientName": $scope.FullName,
                "PatientMobile": $scope.PhoneNumber,
                "DoctorMobile": $scope.DocPHnumber,
                "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "DoctorName": $scope.SelectedDoctor.FullName,
                "AppDate": $scope.referredappointmentdate,
                "AppTime": $scope.TIME,
                "AppClinic": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "AppToken": 0,
                "PatientEmail": $scope.EmailID,
                "BranchEmail": $scope.BranchEmail,
                "DoctorEmail": $scope.DoctorEmailId,
                "HospitalContact": $scope.BranchPhone,
                "CommunicationEmailId": $scope.CommunicationEmailId || "",
                "CommunicationMobileNo": $scope.DocCommunicationPhnumber || ""
            },
            "PaidFollowup": false,
            "PatientSmsLanguageId": 152
        };
        if ($scope.Source === '' || $scope.SubSource === undefined) {
            delete Appparams.ReferralSourceDtls;
        }
        if (!$scope.hospitalLevelDoc) {
            delete Appparams.HospitalDetails;
        }
        if (patient_appStartTime === "Select Slot") {
            alertify.error('Select Starttime');
            return;
        }
        var object = {
            "PatientId": $scope.PatientID,
            "AppointmentDate": $scope.referredappointmentdate,
            "HospitalId": $scope.changedHospitalID,
            "DoctorId": parseInt(doctorId)
        };
        eHnotePatientDataService.CheckAppointmentStatus(object).then(function (resp) {
            if (resp.data.Status) {
                alertify.error("This patient has an existing appointment scheduled for the same date");
                return false;
            } else {
                continuetobookAppointment();
            }
        }, function (err) {
        });
        function continuetobookAppointment() {
            var date = $filter('date')(new Date(), "yyyy-MM-dd");
            var chkblnLapsed = chkLapsedTime(patient_appEndTime);
            if (Appparams.ConsultationDt > date) {
                eHnoteUserAppointmentDataService.AddUpdateAppointmentService(Appparams, OnAddApointmentSuccess, OnAddApointmentError);
            } else if (patient_appStartTime > time) {
                eHnoteUserAppointmentDataService.AddUpdateAppointmentService(Appparams, OnAddApointmentSuccess, OnAddApointmentError);
            } else {
                alertify.error("You have selected a lapsed appointment time slot. Please select future time slots");
                return false;
            }
        }
    };
    function OnAddApointmentSuccess(data) {
        if (data.status === "success") {
            alertify.success("Appointment added successfully");

            $scope.TIME = $scope.patinet_appStarttime.startTime;
            $scope.Token = data.response.TokenNumber;
            //if (data.response.TokenNumber === "0") {
            //    $scope.Token = "";
            //}
            //else {
            //    $scope.Token = data.response.TokenNumber;
            //}
            //eHnoteUserAppointmentDataService.SendEmail($scope.FullName, doctorinfo.doctordata.UserAddress[0].ClinicName, $scope.DoctorEmailId, $scope.EmailID, $scope.SelectedDoctor.FullName, $scope.BranchName, $scope.Token, $scope.referredappointmentdate, $scope.TIME, $scope.BranchEmail, $scope.BranchPhone, $scope.PhoneNumber, EmailcallbackSuccess, EmailcallbackError);


            //function EmailcallbackSuccess() {
            //}
            //function EmailcallbackError() {
            //}
            $scope.DocPHnumber = $scope.CountryCode + "" + $scope.MobileNo;
            $scope.PhoneNumber = $scope.CountryCode + "" + $scope.PhoneNumber;

            $scope.DocCommunicationPhnumber = $scope.CommunicationCountryCode + "" + $scope.CommunicationMobileNo;
            //if ($scope.PhoneNumber != undefined && $scope.PhoneNumber != "" && $scope.PhoneNumber != null) {
            //  //  $scope.date = new Date();
            //    $scope.date = $filter("date")(new Date(), "dd-MM-yyyy");
            //    eHnoteUserAppointmentDataService.SendSms($scope.FullName, doctorinfo.doctordata.UserAddress[0].ClinicName, $scope.EmailID, $scope.SelectedDoctor.FullName, $scope.BranchName, $scope.Token, $scope.referredappointmentdate, $scope.TIME, doctorinfo.doctordata.UserAddress[0].BranchEmail, $scope.PhoneNumber, $scope.DocPHnumber, $scope.date, SMScallbackSuccess, SMScallbackError);
            //}
            //function SMScallbackSuccess() {
            //}
            //function SMScallbackError() {
            //}
        }
        $scope.addAppointmentInfo = false;
        $scope.chgDate();
        $scope.patinet_appStarttime = "";
        $scope.othervisitrsn = "";
        $rootScope.appointment_type = "";
    }
    function OnAddApointmentError(err) {
        console.log(err);
    }
    $scope.chgDate = function () {
        var tmpdt = $filter('date')(new Date($scope.referredappointmentdate), "yyyy-MM-dd");
        $scope.EndtimeVAlue = {};
        $scope.patinet_appStarttime = {};
        $scope.DocChange($scope.SelectedDoctor);
    };
    $scope.DocChange = function (SelectedDoctor) {
        if (SelectedDoctor === undefined) {
            return;
        }
        $scope.DoctorEmailId = SelectedDoctor.EmailId;
        $scope.CountryCode = SelectedDoctor.CountryCode;
        $scope.MobileNo = SelectedDoctor.MobileNo;
        $scope.CommunicationEmailId = SelectedDoctor.CommunicationEmailId || "";
        $scope.CommunicationCountryCode = SelectedDoctor.CommunicationCountryCode || "";
        $scope.CommunicationMobileNo = SelectedDoctor.CommunicationMobileNo || "";

        $scope.noData = "";
        if (JSON.stringify($scope.showDayID) === "true") {
            $scope.dayConfig.visible = true;
        }
        $scope.SelectedDoctor = SelectedDoctor;
        if ($scope.SelectedDoctor !== undefined && $scope.SelectedDoctor !== null) {
            var data_param = {
                'UserBranchId': $scope.SelectedDoctor.UserBranchId,
                'HospitalID': $scope.SelectedDoctor.HospitalID,
                'startDate': $filter('date')(new Date($scope.referredappointmentdate), "yyyy-MM-dd"),
                'endDate': $filter('date')(new Date($scope.referredappointmentdate), "yyyy-MM-dd")
            };
            eHnoteMainAppointmentService.getDoctorAppoitmentInfo(OnGetAppointmentSuccess, OnGetAppointmentError, data_param);
            function OnGetAppointmentSuccess(data) {
                var booked = data;
                var jsonAvailConsultTime = [];
                $scope.minPerCase = 15;
                if (booked.calendarList.length > 0) {
                    for (var j = 0; j < booked.calendarList.length; j++) {
                        if (booked.calendarList[j].SlotLst !== undefined) {
                            for (var k = 0; k < booked.calendarList[j].SlotLst.length; k++) {
                                $scope.minPerCase = booked.calendarList[j].SlotLst[k].MinPerCase;
                                for (var l = 0; l < booked.calendarList[j].SlotLst[k].SlotLst.length; l++) {
                                    var sTime = booked.calendarList[j].SlotLst[k].SlotLst[l];
                                    var strStartHour = sTime.StartTime;
                                    var strEndHour = sTime.Endtime;
                                    var seq = strStartHour.slice(0, 2) + strStartHour.slice(3, 5);
                                    var endseq = strEndHour.slice(0, 2) + strEndHour.slice(3, 5);
                                    if (sTime.PatientInfo !== undefined) {
                                        for (var m = 0; m < sTime.PatientInfo.length; m++) {
                                            var strStart = sTime.PatientInfo[m].AppointmentStartTime;
                                            var strEnd = sTime.PatientInfo[m].AppointmentEndTime;
                                            var pseq = strStart.slice(0, 2) + strStart.slice(3, 5);
                                            var pendseq = strEnd.slice(0, 2) + strEnd.slice(3, 5);
                                            jsonAvailConsultTime.push({ consultID: booked.calendarList[j].SlotLst[k].MinPerCase, startTime: strStart.substring(0, 5), Available: "N", endTime: strEnd.substring(0, 5), seqStart: pseq, seqend: pendseq });
                                        }
                                    } else {
                                        jsonAvailConsultTime.push({ consultID: booked.calendarList[j].SlotLst[k].MinPerCase, startTime: strStartHour.substring(0, 5), Available: sTime.Available, endTime: strEndHour.substring(0, 5), seqStart: seq, seqend: endseq });
                                    }
                                }
                            }
                        } else {
                            alertify.error("Doctor is not available.Please choose another doctor");
                            $scope.setValue = [];
                            $scope.patinet_appStarttime = {};
                            $scope.EndtimeVAlue = {};
                            return;
                        }
                    }
                    eHnoteMasterDataService.addDocAvailConsultTimeInfo(jsonAvailConsultTime);
                    var json = eHnoteMasterDataService.getDocAvailConsultTimeInfo();
                    $scope.setValue = json;
                    $scope.timings = [{ "seq": "0000", "startTime": "00:00" }];
                    var min = 0;
                    var hr = 0;
                    for (i = 0; i <= 23; i++) {
                        min = min + $scope.minPerCase;
                        if (min >= 60) {
                            hr = i + 1;
                            min = 0;
                        } else {
                            i--;
                        }
                        var hours = hr.toString();
                        var miniutes = min.toString();
                        if (hours.length < 2) {
                            hours = "0" + hr;
                        }
                        if (miniutes.length < 2) {
                            miniutes = "0" + min;
                        }
                        var time = hours + ":" + miniutes;
                        if (hr !== 24) {
                            $scope.timings.push({ "seq": hours + "" + miniutes, "startTime": time });
                        }
                    }

                    var curdate = $filter('date')(new Date(), "dd-MMMM-yyyy");
                    var referredappointmentdate = $filter('date')(new Date($scope.referredappointmentdate), "dd-MMMM-yyyy");
                    if (referredappointmentdate === curdate) {
                        var curtime = $filter('date')(new Date(), 'HH:mm');
                        var curSplitTime = curtime.slice(0, 2) + curtime.slice(3, 5);
                        $scope.setValue = $scope.timings;
                        $scope.setFirsrValue = [];
                        for (var i = 0; i < $scope.setValue.length; i++) {
                            if (curSplitTime < $scope.setValue[i].seq) {
                                $scope.setFirsrValue.push($scope.setValue[i]);
                            }
                        }
                        $scope.setValue = $scope.setFirsrValue;
                        var doc = {};

                    } else {

                        $scope.setValue = $scope.timings;
                        var doc = {};
                    }
                } else {
                    $scope.setValue = [];
                }
                eHnoteMasterDataService.addavgConsultationTimeInfo($scope.minPerCase);
            }
            function OnGetAppointmentError(data) {
                eHnoteMasterDataService.addDocAvailConsultTimeInfo("");
            }
        }
    };
    $scope.getDcotorAppointmentDetails = function (dateValue) {
        var formatteddateValue = moment(dateValue).format('YYYY-MM-DD');
        $scope.noData = "";
        if (JSON.stringify($scope.showDayID) === "true") {
            $scope.dayConfig.visible = true;
        }
        var dateChangeAddressId;
        if ($scope.SelectedDoctor !== undefined) {
            if ($scope.SelectedDoctor.UserBranchId === undefined) {
                dateChangeAddressId = $scope.AppListselectedclinic.UserBranchId;
            } else {
                dateChangeAddressId = $scope.SelectedDoctor.UserBranchId;
            }
        }
        var DoctorID = eHnoteMasterDataService.getLoginId();
        if ($scope.SelectedDoctor !== undefined) {
            var data_param = {
                'DoctorID': $scope.SelectedDoctor.DoctorID,
                'filterByDate': formatteddateValue,
                'AddressID': dateChangeAddressId
            };
            eHnoteMainAppointmentService.getDoctorAppoitmentInfo(OnGetAppointmentSuccess, OnGetAppointmentError, data_param);
            function OnGetAppointmentSuccess(data) {
                var booked = data;
                var jsonAvailConsultTime = [];
                $scope.minPerCase = 0;
                if (booked.count > 0) {
                    $scope.minPerCase = (booked.rows[0].MinPerCase !== undefined) ? booked.rows[0].MinPerCase : 0;
                    for (var j = 0; j < booked.count; j++) {
                        for (var k = 0; k < booked.rows[j].SlotList.length; k++) {
                            var sTime = booked.rows[j].SlotList[k];
                            var strStartHour = sTime.StartTime;
                            var strEndHour = sTime.Endtime;
                            jsonAvailConsultTime.push({ startTime: strStartHour.substring(0, 5), endTime: strEndHour.substring(0, 5), Available: sTime.Available });
                        }
                    }
                    eHnoteMasterDataService.addDocAvailConsultTimeInfo(jsonAvailConsultTime);
                    var json = eHnoteMasterDataService.getDocAvailConsultTimeInfo();
                    $scope.setValue = json;
                    var docAll = { startTime: 'Select Starttime' };
                    $scope.patinet_appStarttime = "";
                    $scope.timings = [{ "seq": "0000", "startTime": "00:00" }];
                    var min = 0;
                    var hr = 0;
                    for (i = 0; i <= 23; i++) {
                        min = min + $scope.minPerCase;
                        if (min >= 60) {
                            hr = i + 1;
                            min = 0;
                        } else {
                            i--;
                        }
                        var hours = hr.toString();
                        var miniutes = min.toString();
                        if (hours.length < 2) {
                            hours = "0" + hr;
                        }
                        if (miniutes.length < 2) {
                            miniutes = "0" + min;
                        }
                        var time = hours + ":" + miniutes;
                        if (hr !== 24) {
                            $scope.timings.push({ "seq": hours + "" + miniutes, "startTime": time });
                        }
                    }
                    $scope.setValue = $scope.timings;
                    //$scope.Endtimechange($scope.minPerCase);
                    var doc = {};
                } else {
                    $scope.setValue = [];
                }
                eHnoteMasterDataService.addavgConsultationTimeInfo($scope.minPerCase);
            }
            function OnGetAppointmentError(data) {
                eHnoteMasterDataService.addDocAvailConsultTimeInfo("");
            }
        }
    };
    $scope.Endtimechange = function () {
        if ($scope.patinet_appStarttime !== null) {
            var app_startingTime = $scope.patinet_appStarttime.startTime;
            $scope.dffTime = eHnoteMasterDataService.getavgConsultationTimeInfo();
            var eee = new Date(1980, 1, 1, 0, 0, 0);
            eee.setHours(app_startingTime.substring(0, 2), app_startingTime.substring(3, 5), 0);
            eee.setMinutes(eee.getMinutes() + $scope.dffTime);
            var lowm = eee.getMinutes();
            if (lowm < 10) lowm = "0" + lowm;
            sdate = eee.getHours() + ":" + lowm;
            $scope.setEndValue = [];
            for (var i = 0; i < $scope.setValue.length; i++) {
                if ($scope.patinet_appStarttime.seq < $scope.setValue[i].seq) {
                    $scope.setEndValue.push($scope.setValue[i]);
                }
            }
            $scope.EndtimeVAlue = $scope.setEndValue[0];
        }
    };
    function chkLapsedTime(chkTime) {
        minPerCase = eHnoteMasterDataService.getavgConsultationTimeInfo();
        var check_todaydate = chkTime.substring(0, 10);
        var momentObj = moment(new Date());
        var momment_currentdate = momentObj.format("YYYY-MM-DD");
        var timeNow_Splits = momentObj.format("HH:mm").split(":");
        var timenow_Hour = parseInt(timeNow_Splits[0]);
        var timenow_Minute = parseInt(timeNow_Splits[1]);
        var selectedmomentObj = moment(chkTime);
        var selected_Splits = selectedmomentObj.format("HH:mm").split(":");
        var selected_Hour = parseInt(selected_Splits[0]);
        var selected_Minute = parseInt(selected_Splits[1]);
        var blnLapsed = false;
        if (check_todaydate === momment_currentdate) {
            if (selected_Hour < timenow_Hour) {
                blnLapsed = true;
            } else if (selected_Hour === timenow_Hour) {
                if (selected_Minute < timenow_Minute || (minPerCase + selected_Minute - 1) < timenow_Minute) {
                    blnLapsed = true;
                }
            }
        } else if (check_todaydate < momment_currentdate) {
            blnLapsed = true;
        }
        return blnLapsed;
    }
    $scope.onItemSelected = function (visit) {
        if (visit) {
            $scope.othervisitrsn = visit.VisitRsnTitle;
        }
    };
    $scope.addPatientBilling = function (item) {
        var param = {
            "AppointmentID": 0,
            "PatientID": item.PatientID,
            "DoctorID": eHnoteMasterDataService.getLoginId(),
            "DoctorFullName": $scope.doctorinfo.doctordata.User[0].FullName,
            "PatientDetails": {
                "Patient": [
                    {
                        "Title": item.Title,
                        "FullName": item.FullName,
                        "PatientID": item.PatientID,
                        "Gender": item.Gender,
                        "CurrentAge": item.CurrentAge
                    }
                ],
                "PatientPhone": [
                    {
                        "PhNumber": item.PhoneNumber
                    }
                ]
            }
        };
        if (!item.PhoneNumber) {
            param.PatientDetails.PatientPhone = [];
        }
        param.CaptureBillingFrom = "Patient";
        eHnoteMasterDataService.addAppointmentInfo(param);
        var url = "/appointmentbilling";
        $location.url(url);
    };

    //function checkAccessForUser() {
    //    var loginInfo = eHnoteLoginStatusService.getUserLoginDetails();
    //    $scope.disableStartConsultation = false;
    //    if (loginInfo.RoleID === "2" || loginInfo.RoleID === "10") {
    //        $scope.disableStartConsultation = true;
    //    }
    //}

    function checkAccessForUser() {
        var loginInfo = eHnoteLoginStatusService.getUserLoginDetails();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
       
        $scope.UserAccessList = [];
        if (doctorinfo !== undefined) {
            if (doctorinfo.doctordata.UserAddress[0].ExtDetails.UserAccessID !== undefined) {
                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.UserAccessID.length > 0) {
                    $scope.UserAccessList = doctorinfo.doctordata.UserAddress[0].ExtDetails.UserAccessID;
                }
            }
        }

        $scope.showPatientListBilling = true;  
       
        if (loginInfo.RoleID === 15) {
            if ($scope.UserAccessList.length > 0) {
                for (var i = 0; i < $scope.UserAccessList.length; i++) {
                    if ($scope.UserAccessList[i].AccessCategoryId === 2) {
                        for (var j = 0; j < $scope.UserAccessList[i].AccessList.length; j++) {
                            if ($scope.UserAccessList[i].AccessList[j].AccessRightId === 11) {
                                if ($scope.UserAccessList[i].AccessList[j].ActiveInd === "N") {
                                    $scope.showPatientListBilling = false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    $scope.searchWalkinNavigate = function () {
        $location.url("/registerPatient");
    };
    var SetupPopUp;


    $scope.$on('openNewbookAppointment', function (e) {
        console.log("Appointment Called2");
        $scope.searchopenAppointmentPopup();
    });
    $scope.searchopenAppointmentPopup = function () {
        $scope.PageName = "book";
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var clinicAddress = { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
        var doctorID = {
            "DoctorID": doctorinfo.doctorid
        };

        if (doctorinfo.RoleID === 43 || doctorinfo.RoleID === 57) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        }
        else if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
        } else {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
        }

        $rootScope.IsTeleMedicineSlot = false;
        $rootScope.Consulatation_type = false;

        if ($scope.SpecializationId === 2) {
            $scope.PageName = "directFollowup";
        }
        SetupPopUp = $uibModal.open({
            "templateUrl": 'appointMentPopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "appointment-full-popup",
           // "windowClass": "inventory-full-popup"

        });
    };
    $scope.$on('closePopup', function (event) {
        SetupPopUp.dismiss('cancel');
    });

    $scope.$on("registerclosePopup", function (event) {
        SetupPopUp.dismiss('cancel');


        $scope.PageName = "book";
        $rootScope.appointment_type = "12";
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.AppDate = "";
        $scope.ispatientExistsval = false;
        $scope.calenderDate = undefined;
        var clinicAddressId = { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
        var doctorID = {
            "DoctorID": doctorinfo.doctorid
        };

        if (doctorinfo.RoleID === 3 || doctorinfo.RoleID === 43 || doctorinfo.RoleID === 11 || doctorinfo.RoleID === 57) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        } else if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        } else {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        }


        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentInfo.AppointmentStatus = "B";
        appointmentInfo.showAllHospitalsinAppList = $scope.OpTeleAccess.showAllHospitalsinAppList;
        eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);


        if ($scope.SpecializationId === 2) {
            $scope.PageName = "directFollowup";
        }
        if ($scope.Tab === 'teleappointments') {
            $rootScope.Consulatation_type = true;
        }
        if ($scope.Tab === 'appointments') {
            $rootScope.Consulatation_type = false;
        }
        if ($scope.RoleId === 56 || $scope.RoleId === 57 || $scope.RoleId === 58) {
            $rootScope.Consulatation_type = true;
        }
        $scope.ScreenFrom = "allpatients";

        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        cacheStorageItem.ScreenFrom = $scope.ScreenFrom;

        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);


        SetupPopUp = $uibModal.open({
            "templateUrl": 'registerappointMentPopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "inventory-full-popup"
            //"size": "lg"
        });

    });


    function bindStartTime() {

        var data_param = {
            'UserBranchId': doctorinfo.doctordata.UserAddress[0].UserBranchId,
            'HospitalID': doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            'startDate': $filter('date')(new Date(), "yyyy-MM-dd"),
            'endDate': $filter('date')(new Date(), "yyyy-MM-dd")
        };
        eHnoteMainAppointmentService.getDoctorAppoitmentInfo(OnGetAppointmentSuccess, OnGetAppointmentError, data_param);
        function OnGetAppointmentSuccess(data) {
            var booked = data;
            var jsonAvailConsultTime = [];
            $scope.minPerCase = 15;
            if (booked.calendarList.length > 0) {
                for (var j = 0; j < booked.calendarList.length; j++) {
                    if (booked.calendarList[j].SlotLst !== undefined) {
                        for (var k = 0; k < booked.calendarList[j].SlotLst.length; k++) {
                            $scope.minPerCase = booked.calendarList[j].SlotLst[k].MinPerCase;
                            for (var l = 0; l < booked.calendarList[j].SlotLst[k].SlotLst.length; l++) {
                                var sTime = booked.calendarList[j].SlotLst[k].SlotLst[l];
                                var strStartHour = sTime.StartTime;
                                var strEndHour = sTime.Endtime;
                                var seq = strStartHour.slice(0, 2) + strStartHour.slice(3, 5);
                                var endseq = strEndHour.slice(0, 2) + strEndHour.slice(3, 5);
                                if (sTime.PatientInfo !== undefined) {
                                    for (var m = 0; m < sTime.PatientInfo.length; m++) {
                                        var strStart = sTime.PatientInfo[m].AppointmentStartTime;
                                        var strEnd = sTime.PatientInfo[m].AppointmentEndTime;
                                        var pseq = strStart.slice(0, 2) + strStart.slice(3, 5);
                                        var pendseq = strEnd.slice(0, 2) + strEnd.slice(3, 5);
                                        jsonAvailConsultTime.push({ consultID: booked.calendarList[j].SlotLst[k].MinPerCase, startTime: strStart.substring(0, 5), Available: "N", endTime: strEnd.substring(0, 5), seqStart: pseq, seqend: pendseq });
                                    }
                                } else {
                                    jsonAvailConsultTime.push({ consultID: booked.calendarList[j].SlotLst[k].MinPerCase, startTime: strStartHour.substring(0, 5), Available: sTime.Available, endTime: strEndHour.substring(0, 5), seqStart: seq, seqend: endseq });
                                }
                            }
                        }
                    }
                }
                eHnoteMasterDataService.addDocAvailConsultTimeInfo(jsonAvailConsultTime);
                $scope.setValue = eHnoteMasterDataService.getDocAvailConsultTimeInfo();
                if ($scope.setValue.length > 0) {
                    //$scope.timings = [{ "seq": "0000", "startTime": "00:00" }];
                    var min = 0;
                    var hr = 0;
                    for (i = 0; i <= 23; i++) {
                        min = min + $scope.minPerCase;
                        if (min >= 60) {
                            hr = i + 1;
                            min = 0;
                        } else {
                            i--;
                        }
                        var hours = hr.toString();
                        var miniutes = min.toString();
                        if (hours.length < 2) {
                            hours = "0" + hr;
                        }
                        if (miniutes.length < 2) {
                            miniutes = "0" + min;
                        }
                        var time = hours + ":" + miniutes;
                        //if (hr !== 24) {
                        //    $scope.timings.push({ "seq": hours + "" + miniutes, "startTime": time });
                        //}
                    }

                    var curdate = $filter('date')(new Date(), "dd-MMMM-yyyy");

                    var localVal = angular.copy($scope.setValue);
                    var curTime = moment().format('HH:mm');
                    $scope.setValue = [];
                    for (var i = 0; i < localVal.length; i++) {
                        if (localVal[i].startTime >= curTime) {
                            $scope.setValue.push(localVal[i]);
                        }
                    }

                } else {
                    $scope.setValue = [];
                }
                var doc = {};
            } else {
                $scope.setValue = [];
            }
            $scope.patinet_appStarttime = $scope.setValue[0];
            if ($scope.patinet_appStarttime === undefined) { } else {
                $scope.Current_patinet_appStarttime = $scope.patinet_appStarttime.startTime;
                $scope.Current_patinet_appEndtime = $scope.patinet_appStarttime.endTime;
            }
            eHnoteMasterDataService.addavgConsultationTimeInfo($scope.minPerCase);
        }
        function OnGetAppointmentError(data) {
            eHnoteMasterDataService.addDocAvailConsultTimeInfo("");
            alertify.error(data.Message);
        }
    }
    $scope.checkAll = function (val) {
        if (val) {
            angular.forEach($scope.HospitalArray, function (item) {
                item.isChecked = true;
            });
        } else {
            angular.forEach($scope.HospitalArray, function (item) {
                item.isChecked = false;
            });
        }
    };
    $scope.checkAllPatient = function (val) {
        if (val) {
            angular.forEach($scope.PatientFilterArray, function (item) {
                item.isChecked = true;
            });
        } else {
            angular.forEach($scope.PatientFilterArray, function (item) {
                item.isChecked = false;
            });
        }
    };
    $scope.checkAllSpecialization = function (val) {
        if (val) {
            angular.forEach($scope.SpecilaizationFilterArray, function (item) {
                item.isChecked = true;
            });
        } else {
            angular.forEach($scope.SpecilaizationFilterArray, function (item) {
                item.isChecked = false;
            });
        }
    };
    $scope.$on('successMethod', function (event) {
        SetupPopUp.dismiss('cancel');
        $scope.$emit('redirectAppList', 'appointments');
    });



    //Access Code Added by Durga on 01-10-2019

    $scope.showAllHospitalPatients = true;
    $scope.caseHistoryAccess = true;
    $scope.patientBillingAccess = true;
    $scope.bookAppointmentAccess = true;
    $scope.registerPatientAccess = true;
    $scope.updatePatientAccess = true;




    function checkUserAccessPermissions() {

        angular.forEach($scope.UserAccessList, function (item) {
            if (item.AccessCategoryId === 4 && item.ActiveInd === "Y") {
                angular.forEach(item.AccessList, function (citem) {
                    if (citem.AccessRightId === 20 && citem.ActiveInd === "Y") {
                        $scope.patientAccess.showAllHospitalPatients = true;
                    }
                    if (citem.AccessRightId === 21 && citem.ActiveInd === "Y") {
                        $scope.patientAccess.caseHistoryAccess = true;
                    }
                    if (citem.AccessRightId === 22 && citem.ActiveInd === "Y") {
                        $scope.patientAccess.patientBillingAccess = true;
                    }
                    if (citem.AccessRightId === 70 && citem.ActiveInd === "Y") {
                        $scope.patientAccess.bookAppointmentAccess = true;
                    }
                    if (citem.AccessRightId === 71 && citem.ActiveInd === "Y") {
                        $scope.patientAccess.registerPatientAccess = true;
                    }
                    if (citem.AccessRightId === 72 && citem.ActiveInd === "Y") {
                        $scope.patientAccess.updatePatientAccess = true;
                    }
                });
            }

        });
    }
    $scope.$on("telesuccessMethod", function (event) {
        SetupPopUp.dismiss('cancel');
        if ($scope.RoleId === 1 || $scope.RoleId === 56) {
            $scope.submit();
        } else {
            $scope.onload();
        }

    });
    $scope.$on("telereshedulesuccessMethod", function (event, data) {
        SetupPopUp.dismiss('cancel');
        if ($scope.RoleId === 1 || $scope.RoleId === 56) {
            $scope.submit();
        } else {
            $scope.onload();
        }

    });    

}]);
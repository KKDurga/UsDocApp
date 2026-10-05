"use strict";
eHnoteWebApp.controller("EhnoteOpCtrl", ["$scope", "$http", "$log", "$rootScope", "$compile", "$q", "$location", "$ocLazyLoad", "$uibModal", "$routeParams", "$filter", "$timeout", "eHnoteMainAppointmentService", "eHnoteLoginStatusService", "eHnoteDiagnosisDataServices", "datapersistanceFactory", "eHnoteMasterDataService", "eHnotePatientDataService", "eHnoteProcedureDataService", "alertify", "eHnoteCacheStorageService", "eHnoteAuditServices", "eHnoteDbStaticDataService", "eHnoteUserDataService", "eHnoteInsuranceService", function ($scope, $http, $log, $rootScope, $compile, $q, $location, $ocLazyLoad, $uibModal, $routeParams, $filter, $timeout, eHnoteMainAppointmentService, eHnoteLoginStatusService, eHnoteDiagnosisDataServices, datapersistanceFactory, eHnoteMasterDataService, eHnotePatientDataService, eHnoteProcedureDataService, alertify, eHnoteCacheStorageService, eHnoteAuditServices, eHnoteDbStaticDataService, eHnoteUserDataService, eHnoteInsuranceService) {


    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
 

    $scope.UserId = eHnoteMasterDataService.getLoginId();



    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

    console.log(userLoginDetails);


    console.log(userLoginDetails.loggedinStatus + "__");

    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    }
    else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path('/login');
    }


    //$scope.$on('investigationsPageEvent', function (event, tabName) {
    //    $scope.Tab = tabName.object.tabno;
    //});
    $scope.showRegPatBtninPatients = true;

    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");

    $scope.AppointmentCheckInDynamicStatus = 0;
    if ($scope.OrganizationSettingsData !== undefined) {
        if ($scope.OrganizationSettingsData.AppointmentSettings !== undefined) {
            $scope.AppointmentCheckInDynamicStatus = $scope.OrganizationSettingsData.AppointmentSettings.AppointmentCheckInDynamicStatus;
        }
    }



    $scope.dummyJsonObject = {
        "PatientInvestigationId": 0,
        "PatientName": "",
        "PatientDisplayId": "",
        "AppointmentDate": "",
        "DoctorName": "",
        "HospitalName": "",
        "oldJsonArray": [],
        "newJsonArray": []
    };
    $scope.roomActiveObj = {
        "RoomId": 0,
        "RoomName": "",
        "IsMultipleRooms": false,
        "IsEnabled": false
    };
    $scope.disableBookApptbtn = false;
    $scope.switchTab = function (type) {
        $scope.Tab = type;
        $scope.disableBookApptbtn = false;
        if (type === 'investigations' || type === 'dilation' || type === 'InsEligibility' || type === 'PreAuthorization' || type === 'followup' || type === 'Rx') {
            $scope.disableBookApptbtn = true;
        }
        $scope.PatientSearch.SearchText = '';
        $scope.PatientsArray = [];
        $scope.ShowPatientListDrop = false;
        //if ($scope.Tab == 'advancesearch') {
        //    $scope.patSearchType = data.Patient.patSearchType || 0;
        //    $scope.PatientSearch.SearchText = data.Patient.SearchText || '';
        //    $scope.Advance.SerachType = $scope.patSearchType;
        //    $scope.Advance.SearchText = $scope.PatientSearch.SearchText;
        //}
    };


    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
    $scope.UserAccessList = [];
    $scope.UserAccessRights = [];
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    var Advacnesearchfreez = eHnoteMasterDataService.getaddAdvanceSearch() || '';

    if ($scope.SpecializationId === 2) {
        $scope.UserAccessRights.SubAccessCategories.OPDilationList = false;
    }

    if ($scope.UserAccessRights.SubAccessCategories.OPAppointmentsList) {
        $scope.Tab = "appointments";
    } else if ($scope.UserAccessRights.SubAccessCategories.OPTeleAppointmentsList) {
        $scope.Tab = "teleappointments";
    } else if ($scope.UserAccessRights.SubAccessCategories.OPInvestigationsList) {
        $scope.Tab = "investigations";
    } else if ($scope.UserAccessRights.SubAccessCategories.OPAllPatientsList) {
        $scope.Tab = "patients";
    } else if ($scope.UserAccessRights.SubAccessCategories.OPDilationList) {
        $scope.Tab = "dilation";
    } else if ($scope.UserAccessRights.SubAccessCategories.OPPatientDynamicStatus) {
        $scope.Tab = "DynamicStatus";
    }
    Advacnesearchfreez.IsfromAdvanceSearch = Advacnesearchfreez.IsfromAdvanceSearch || false;
    if (Advacnesearchfreez.IsfromAdvanceSearch) {
        $scope.Tab = 'advancesearch';
    }
    if ($scope.cacheStorageItem.subtype === 'AUDIT') {
        $scope.Tab = "AUDIT";
    }

    /* $scope.AdvanceSerachType = 1;*/
    $scope.Advance = {
        'SearchText': '',
        'SerachType': 1,
        'LSearchText': '',
        'IsAdvanceSearch': false,
    }

    $scope.$on('OptTabActive', function (event, data) {
        console.log(data);
        data.response = data.response || '';
        if (data.response == 'advancesearch') {
            data.Patient = data.Patient || '';
            $scope.filters = {
                firstName: '',
                lastName: '',
                birthYear: '',
                birthMonth: '',
                gender: '',
                insurance: '',
                PayOrID: 0
            };
            if (data.Patient != '') {
                $scope.patSearchType = data.Patient.patSearchType || 0;
                $scope.PatientSearch.SearchText = data.Patient.SearchText || '';
            }
            $scope.Advance.SerachType = $scope.patSearchType;
            $scope.Advance.SearchText = $scope.PatientSearch.SearchText;
            /*$scope.SearchByTextHeader();*/
            $scope.AdvanceSearchByText();
        }
        $scope.switchTab(data.response);
    });

    $scope.ShowAppointmentList = false;
    $scope.ShowTeleAppointmentList = false;

    $scope.OpAccess = {
        "showDynamicAppointmentStatusTab": false,
        "showConsultationFollowupTab": false,


        "showAllHospitalsinAppList": false,
        "showAllDoctorsinAppList": false,
        "bookAppointmentAccessFromAppList": false,
        "billingAccessFromAppList": false,
        "registerPatientAccessFromAppList": false,
        "updatePatientAccessFromAppList": false,
        "updateVitalsAccessFromAppList": false,
        "updateAppointmentAccessFromAppList": false,
        "inputCaseSheetAccess": false,
        "showStartconsultationBtnAccessFromAppList": false,
        "showEditConsultationBtnAccessFromAppList": false,
        "showTeleBookingAccessInAppointment": false
    };


    $scope.OpTeleAccess = {
        "showTeleAppointmentBooking": false,
        "showEditTeleAppointment": false,
        "showCancelTeleAppointment": false,
        "showStartTeleConsultation": false,
        "showPreConsultationAccess": false,
        "showTeleRegisterPatientAccess": false,
        "showTeleEditPatientAccess": false,
        "showTeleBillingAccess": false,
        "showAllHospitalsinAppList": false,
        "showNormalAppointmentBooking": false
    };



    $scope.subOrganizationCode = "";
    $scope.HospitalId = "";
    $scope.showApptPlugin = false;
    if (doctorInfo !== "") {
        if (doctorInfo.doctordata.User !== undefined) {
            $scope.UserAccessList = doctorInfo.doctordata.User[0].UseAccessDetails;
            checkUserAccessPermissions();
        }

        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.subOrganizationCode = doctorInfo.doctordata.UserAddress[0].SubOrganizationCode;
            $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.showApptPlugin = doctorInfo.doctordata.UserAddress[0].IsshowApptPlugin;

            $scope.orgUsersData = doctorInfo.doctordata.UserAddress;
            if ($scope.orgUsersData[0].IsEnableQueueManagement) {
                $scope.roomActiveObj.RoomId = $scope.orgUsersData[0].ActiveRoomId || 0;
                $scope.roomActiveObj.RoomName = $scope.orgUsersData[0].ActiveRoomName || "";
                $scope.roomActiveObj.IsEnabled = true;
                $scope.orgUsersData[0].UserBranchRoomsArray = $scope.orgUsersData[0].UserBranchRoomsArray || [];
                if ($scope.orgUsersData[0].UserBranchRoomsArray.length > 1) {
                    $scope.roomActiveObj.IsMultipleRooms = true;
                }
            }
        }
    }





    function checkUserAccessPermissions() {
        angular.forEach($scope.UserAccessList, function (item) {
            if (item.AccessCategoryId === 2 && item.ActiveInd === "Y") {
                $scope.ShowAppointmentList = true;
                angular.forEach(item.AccessList, function (citem) {
                    if (citem.AccessRightId === 69 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.showDynamicAppointmentStatusTab = true;
                    }
                    if (citem.AccessRightId === 122 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.showConsultationFollowupTab = true;
                    }




                    if (citem.AccessRightId === 7 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.showAllHospitalsinAppList = true;
                    }
                    if (citem.AccessRightId === 8 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.showAllDoctorsinAppList = true;
                    }
                    if (citem.AccessRightId === 9 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.bookAppointmentAccessFromAppList = true;
                    }
                    if (citem.AccessRightId === 11 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.billingAccessFromAppList = true;
                    }
                    if (citem.AccessRightId === 12 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.registerPatientAccessFromAppList = true;
                    }
                    if (citem.AccessRightId === 13 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.updatePatientAccessFromAppList = true;
                    }
                    if (citem.AccessRightId === 14 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.updateVitalsAccessFromAppList = true;
                    }
                    if (citem.AccessRightId === 67 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.updateAppointmentAccessFromAppList = true;
                    }
                    if (citem.AccessRightId === 68 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.inputCaseSheetAccess = true;
                    }
                    if (citem.AccessRightId === 153 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.showTeleBookingAccessInAppointment = true;
                    }


                });
            }
            if (item.AccessCategoryId === 3 && item.ActiveInd === 'Y') {
                angular.forEach(item.AccessList, function (citem) {
                    if (citem.AccessRightId === 16 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.showStartconsultationBtnAccessFromAppList = true;
                    }
                    if (citem.AccessRightId === 120 && citem.ActiveInd === "Y") {
                        $scope.OpAccess.showEditConsultationBtnAccessFromAppList = true;
                    }
                });
            }
            if (item.AccessCategoryId === 18 && item.ActiveInd === 'Y') {
                $scope.ShowTeleAppointmentList = true;
                angular.forEach(item.AccessList, function (citem) {
                    if (citem.AccessRightId === 144 && citem.ActiveInd === "Y") {
                        $scope.OpTeleAccess.showTeleAppointmentBooking = true;
                    }
                    if (citem.AccessRightId === 145 && citem.ActiveInd === "Y") {
                        $scope.OpTeleAccess.showEditTeleAppointment = true;
                    }
                    if (citem.AccessRightId === 146 && citem.ActiveInd === "Y") {
                        $scope.OpTeleAccess.showCancelTeleAppointment = true;
                    }
                    if (citem.AccessRightId === 147 && citem.ActiveInd === "Y") {
                        $scope.OpTeleAccess.showStartTeleConsultation = true;
                    }
                    if (citem.AccessRightId === 148 && citem.ActiveInd === "Y") {
                        $scope.OpTeleAccess.showPreConsultationAccess = true;
                    }
                    if (citem.AccessRightId === 149 && citem.ActiveInd === "Y") {
                        $scope.OpTeleAccess.showTeleBillingAccess = true;
                    }
                    if (citem.AccessRightId === 150 && citem.ActiveInd === "Y") {
                        $scope.OpTeleAccess.showTeleRegisterPatientAccess = true;
                    }
                    if (citem.AccessRightId === 151 && citem.ActiveInd === "Y") {
                        $scope.OpTeleAccess.showTeleEditPatientAccess = true;
                    }
                    if (citem.AccessRightId === 154 && citem.ActiveInd === "Y") {
                        $scope.OpTeleAccess.showAllHospitalsinAppList = true;
                    }
                    if (citem.AccessRightId === 155 && citem.ActiveInd === "Y") {
                        $scope.OpTeleAccess.showNormalAppointmentBooking = true;
                    }

                });
            }
        });
    }


    $scope.viewAddNewInvestigationPatient = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "AddNewInvestigationPatient.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.closeAnesthesiaConfirmPopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }



    $scope.navtoRegisterPatient = function () {
        $location.url("/registerPatient");
    };


    $scope.navtoNewPatientBilling = function () {
        var object = { "CaptureBillingFrom": "AppointmentNewBilling" };
        $rootScope.patientdetailesConsultation = false;
        eHnoteMasterDataService.addAppointmentInfo(object);
        $location.url("/appointmentbilling");
    };


    $scope.navtoBookAppointment = function () {
        var obj = {
            'IsComingFrom': '',
        }
        datapersistanceFactory.set("SingleDoctorcalendar", obj);
        $scope.$broadcast('openNewbookAppointment');
    };

    $scope.navtoBookAppointmentv2 = function () {
        var obj = {
            'IsComingFrom': '',
        }
        datapersistanceFactory.set("SingleDoctorcalendar", obj);
        $scope.$broadcast('openNewbookAppointmentv2');
    };


    $scope.navtoOldBookAppointment = function () {
        var obj = {
            'IsComingFrom': '',
        }
        datapersistanceFactory.set("SingleDoctorcalendar", obj);
        $scope.$broadcast('openoldNewbookAppointment');
    };












    $scope.TreatmentPlanIndex = 0;

    $scope.dummyCasehistory = [{
        "Id": 1,
        "showContent": false
    },
    {
        "Id": 2,
        "showContent": false
    },
    {
        "Id": 3,
        "showContent": false
    },
    {
        "Id": 4,
        "showContent": false
    },
    {
        "Id": 5,
        "showContent": false
    }]

    $rootScope.showNewAppList = false;

    $scope.showNewApListscreen = function () {
        $rootScope.showNewAppList = !$rootScope.showNewAppList;
    };

    $scope.checkPatientCaseHistory = function (item, index) {
        $scope.TreatmentPlanIndex = index;
    };

    /*Patient Seach bar*/
    $scope.PatientSearch = {
        "SearchText": ""
    };
    $scope.PatientsArray = [];
    $scope.ShowPatientListDrop = false;
    $scope.count = 0;
    $scope.PatientsearchTextClick = function (type) {
        $scope.SearchByTextOPHeader(type);
        //$scope.SearchBy = '';
    }
    $scope.SearchByTextOPHeader = function (type) {
        /* $scope.ShowPatientListDrop = true;*/
        $scope.PatientsArray = [];
        var name = $scope.PatientSearch.SearchText;
        if (name === undefined || name === '') {
            type = 'click';
        }
        /*if ((name && name.length >= 3) || type === 'click') {*/
        if (name && name.length >= 3) {
            $scope.Emailid = "";

            var param = {
                "PageSize": 21,
                "UserId": "",
                "PageNumber": 1,
                "SearchText": "",
                "Count": 0,
                "SearchDetails": { "listdocpatients": "Y" },
                "EndAge": 0,
                "StartAge": 0,
                "StartDate": "",
                "EndDate": ""
            };
            if (!isNaN(name)) {
                param.PhoneNumber = name;
                param.hasparam = true;
                param.SearchText = "";
            } else {
                param.SearchText = name;
                param.hasparam = true;
                param.PhoneNumber = "";
            }
            param.UserId = eHnoteMasterDataService.getLoginId();
            if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                param['HospitalID'] = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                $scope.CheckHospitalId = {};
                if ($scope.UserRoleId === 1 || $scope.UserRoleId === 56) {
                    $scope.HospitalArray = [];
                    angular.forEach(doctorinfo.doctordata.UserAddress, function (item) {
                        if (item.ExtDetails !== undefined) {
                            if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                                var Obj = {
                                    "HospitalName": item.ClinicName,
                                    "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                                    "ActiveIND": "Y",
                                    "isChecked": true,
                                    "BranchId": item.ExtDetails.HospitalInfo.HospitalID
                                };
                                $scope.HospitalArray.push(Obj);
                            }
                        }
                    });
                }
            }
            var list = [];
            angular.forEach($scope.HospitalArray, function (items) {
                if (items.isChecked) {
                    list.push(items.BranchId);
                }
            });
            param["HospitalIDLst"] = list;
            var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
            eHnoteMasterDataService.addPatientSearchInfo(param);
            //InitialiseSearchParam();
            //$scope.morepatientdata = false;
            //param.GetAllSpecializationInd = true;
            //param.GetAllPatientInd = true;
            if (param.PhoneNumber !== "") {
                var object = {
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "HospitalIDLst": param.HospitalIDLst.toString(),
                    "SearchText": param.PhoneNumber || '',
                    "SearchTypeID": 0,
                }
                eHnotePatientDataService.SearchAllPatientData(object, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);
            } else {
                var object = {
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "HospitalIDLst": param.HospitalIDLst.toString(),
                    "SearchText": param.SearchText || "",
                    "SearchTypeID": 0,
                }
                eHnotePatientDataService.SearchAllPatientData(object, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);
            }
        }
    };
    function OnGetSearchPatientSuccess(data) {
        if (data.count > 0) {
            $scope.count = data.count;
            $scope.PatientsArray = [];
            $scope.patientpushval = [];
            $scope.patientinitval = {};
            angular.forEach(data.rows, function (item) {
                $scope.patientinitval = {};
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var val = array_list[Math.floor(Math.random() * array_list.length)];
                if (item.EmailID !== undefined) {
                    $scope.patientinitval.EmailID = item.EmailID;
                }

                $scope.patientinitval.PatientID = item.PatientId;
                $scope.patientinitval.Title = item.Title;
                $scope.patientinitval.S3URL = item.S3URL || "";
                $scope.patientinitval.FullName = item.FullName;
                $scope.patientinitval.DOB = item.DOB;
                $scope.patientinitval.AgeInYears = item.AgeInYears;
                $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                $scope.patientinitval.AgeInDays = item.AgeInDays;
                $scope.patientinitval.AltCountryCode = item.AltCountryCode || '';
                $scope.patientinitval.Altareacode = item.Altareacode || '';
                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || '';

                $scope.patientinitval.Gender = item.Gender;
                $scope.patientinitval.LastVisited = item.LastVisited;
                $scope.patientinitval.CountryCode = item.CountryCode;
                $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                $scope.patientinitval.CurrentAge = item.CurrentAge;
                $scope.patientinitval.colors = val;
                $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                $scope.patientinitval.patientdisplayid = item.DisplayID;
                $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                $scope.patientinitval.familydisplayid = item.FamilyDisplayID;

                $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                $scope.patientinitval.Due = item.Due;
                $scope.patientinitval.PatientTypeId = item.PatientTypeId;
                $scope.patientinitval.IsVIPInd = item.IsVIPInd || false;
                $scope.patientinitval.IsResearchInd = item.IsResearchInd || false;
                $scope.patientinitval.IsHighRiskInd = item.IsHighRiskInd || false;
                $scope.patientinitval.DisplayID = item.DisplayID || "";
                var previouspatval = angular.copy($scope.patientinitval);
                $scope.patientpushval.push(previouspatval);
            });
            $scope.PatientsArray = $scope.patientpushval;
            //if (data.count === 1) {
            //    var patientitem = $scope.PatientsArray[0];
            //    patientitem.PatientID = patientitem.PatientId;
            //    var item = {};
            //    item.PatientDetails = {
            //        "PatientID": patientitem.PatientID,
            //        "Title": patientitem.Title,
            //        "FullName": patientitem.FullName,
            //        "DOB": patientitem.DOB,
            //        "Gender": patientitem.Gender,
            //        "AgeInYears": patientitem.AgeInYears,
            //        "AgeInDays": patientitem.AgeInDays,
            //        "AgeInMonths": patientitem.AgeInMonths,
            //        "CurrentAge": patientitem.CurrentAge,
            //        "PatientDisplayId": patientitem.DisplayID ? patientitem.DisplayID : "",
            //        "MobileNo": patientitem.PhoneNumber,
            //        "ContactNo": patientitem.ContactNo || "",
            //        "EmailId": patientitem.EmailID || "",
            //        "PatientTypeId": patientitem.PatientTypeId || "",
            //        "Age": patientitem.Age,
            //        "PatientGSTNO": patientitem.PatientGSTNO,
            //        "PhCntryCD": patientitem.CountryCode || ""
            //    };
            //    eHnoteMasterDataService.addPatientDetailsforBarcode(item);
            //    eHnoteMasterDataService.addAppointmentInfo(item);
            //    $scope.PatientsArray = [];
            //    $scope.PatientSearch.SearchText = "";
            //    $location.url("/PatientProfile");
            //    $scope.$broadcast("formPatientSearch", '');
            //}
            $scope.noresult = false;
            $scope.showloading = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
            $scope.count = 0;
            $scope.PatientsArray = [];
        }
        $scope.ShowPatientListDrop = true;
    }
    function OnGetPatientSearchError() {
        $scope.count = 0;
        $scope.PatientsArray = [];
        $scope.PatientSearch.SearchText = "";
    }

    $scope.CheckPatientAppointmentStatus = function () {
        if ($scope.cacheStorageItem.appointmentid === 0) {
            var object = {
                "PatientId": $scope.cacheStorageItem.patientid,
                "AppointmentDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "DoctorId": eHnoteMasterDataService.getLoginId()
            };
        } else {
            var object = { "AppointmentID": $scope.cacheStorageItem.appointmentid };
        }
        eHnotePatientDataService.CheckAppointmentStatus(object).then(function (resp) {
            if (resp.data.Status) {
                if (resp.data.AppointmentStatus === "D" || resp.data.AppointmentStatus === "E" || resp.data.AppointmentStatus === "O") {
                    $scope.cacheStorageItem.TreatmentPlanId = resp.data.TreatmentPlanId;
                    $scope.cacheStorageItem.ConsultationID = resp.data.ConsultationId;
                    $scope.cacheStorageItem.appointmentid = resp.data.AppointmentID;
                    $scope.cacheStorageItem.AppointmentDt = resp.data.ConsultationDt;
                    $scope.cacheStorageItem.IsFollowupConsultation = false;
                    //  $scope.cacheStorageItem.IsNewConsultation = false;
                    $scope.cacheStorageItem.IsEditConsultation = true;
                    $scope.cacheStorageItem.IsfindingsDataInitialized = false;
                    $scope.cacheStorageItem.AppointmentDoctorID = resp.data.DoctorId;
                    $scope.cacheStorageItem.appointmentStatus = resp.data.AppointmentStatus;

                } else if (resp.data.AppointmentStatus === "B") {
                    $scope.cacheStorageItem.appointmentid = resp.data.AppointmentID;
                    $scope.cacheStorageItem.AppointmentDt = resp.data.ConsultationDt;
                    $scope.cacheStorageItem.TreatmentPlanId = 0;
                    $scope.cacheStorageItem.ConsultationID = 0;
                    // $scope.cacheStorageItem.IsNewConsultation = true;
                    $scope.cacheStorageItem.IsEditConsultation = false;
                    $scope.cacheStorageItem.IsFollowupConsultation = false;
                    $scope.cacheStorageItem.IsfindingsDataInitialized = false;
                    $scope.cacheStorageItem.AppointmentDoctorID = resp.data.DoctorId;
                    $scope.cacheStorageItem.ConsultationDate = $scope.cacheStorageItem.AppointmentDt;
                    $scope.cacheStorageItem.appointmentStatus = resp.data.AppointmentStatus;
                }
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                appointmentinfo.AppointmentStatus = resp.data.AppointmentStatus || "";
                appointmentinfo.AppointmentID = resp.data.AppointmentID || 0;
                appointmentinfo.AppointmentId = resp.data.AppointmentID || 0;
                appointmentinfo.DoctorID = resp.data.DoctorId || 0;
                appointmentinfo.DoctorFullName = resp.data.DoctorName || "";
                appointmentinfo.TreatmentPlanId = resp.data.TreatmentPlanId || 0;
                appointmentinfo.BranchId = resp.data.BranchId || 0;
                appointmentinfo.BranchName = resp.data.BranchName || "";
                appointmentinfo.ConsultationDt = resp.data.ConsultationDt || "";
                appointmentinfo.ConsultationId = resp.data.ConsultationId || 0;
                appointmentinfo.StartTime = resp.data.AppointmentStartTime || "";
                appointmentinfo.EndTime = resp.data.EndTime || "";
                appointmentinfo.BillingId = resp.data.BillingId || 0;
                eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);

                $location.url("/profile");
            } else {
                var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                appointmentinfo.AppointmentStatus = "";
                appointmentinfo.AppointmentID = 0;
                appointmentinfo.AppointmentId = 0;
                appointmentinfo.DoctorID = 0;
                appointmentinfo.DoctorFullName = "";
                appointmentinfo.TreatmentPlanId = 0;
                appointmentinfo.BranchId = 0;
                appointmentinfo.BranchName = "";
                appointmentinfo.ConsultationDt = "";
                appointmentinfo.ConsultationId = 0;
                appointmentinfo.StartTime = "";
                appointmentinfo.BillingId = 0;
                eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                $location.url("/profile");
            }
        }, function (err) {
            console.log(err);
        });
    }

    $scope.AddPatietnDetailsLog = function (selectedItem) {
        let obj = {
            "UserHistoryId": 0,
            "UserId": $scope.UserId || null,
            "PatientId": selectedItem.PatientId || 0,
        };
        eHnoteMainAppointmentService.AddPatientDetailsLog(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                console.log("Added");
            }
        });
    }

    $scope.getPatientCaseHistoryItem = function (patientitem) {
        patientitem.PatientID = patientitem.PatientID || 0;
        if (patientitem.PatientID == 0) {
            return false;
        }

        let obj = {
            "PatientId": patientitem.PatientID,
        }
        $scope.AddPatietnDetailsLog(obj);

        if ($scope.Tab == 'advancesearch') {
            var AdvanceSearch = {
                "IsfromAdvanceSearch": true,
                "Searchtext": $scope.Advance.SearchText || '',
                "Type": $scope.Advance.SerachType || 0,
            }
            eHnoteMasterDataService.addAdvanceSearch(AdvanceSearch);
        }
        eHnoteAuditServices.getParticularPatientDetailsById(patientitem.PatientID, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(response) {
            console.log(response);
            if (response.count > 0) {
                patientitem = response.rows[0];
                patientitem.PatientID = patientitem.PatientId;
                var item = {};
                item.PatientDetails = {
                    "PatientID": patientitem.PatientID,
                    "Title": patientitem.Title,
                    "FullName": patientitem.FullName,
                    "DOB": patientitem.DOB,
                    "Gender": patientitem.Gender,
                    "AgeInYears": patientitem.AgeInYears,
                    "AgeInDays": patientitem.AgeInDays,
                    "AgeInMonths": patientitem.AgeInMonths,
                    "CurrentAge": patientitem.CurrentAge,
                    "PatientDisplayId": patientitem.DisplayID ? patientitem.DisplayID : "",
                    "MobileNo": patientitem.PhoneNumber,
                    "ContactNo": patientitem.ContactNo || "",
                    "EmailId": patientitem.EmailID || "",
                    "PatientTypeId": patientitem.PatientTypeId || "",
                    "Age": patientitem.Age,
                    "PatientGSTNO": patientitem.PatientGSTNO,
                    "PhCntryCD": patientitem.CountryCode || ""
                };
                item.PatientID = patientitem.PatientID;
                item.S3URL = patientitem.S3URL || "";
                $scope.S3URL = patientitem.S3URL || "";


                eHnoteMasterDataService.addAppointmentInfo(item);

                $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
                $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                $scope.cacheStorageItem.PatientID = patientitem.PatientID;
                $scope.cacheStorageItem.patientid = patientitem.PatientID;
                $scope.cacheStorageItem.PatientName = patientitem.FullName;
                $scope.cacheStorageItem.EmailID = patientitem.EmailID ? patientitem.EmailID : '';
                $scope.cacheStorageItem.CountryCode = patientitem.CountryCode ? patientitem.CountryCode : '';
                $scope.cacheStorageItem.PhoneNumber = patientitem.PhoneNumber ? patientitem.PhoneNumber : '';
                $scope.cacheStorageItem.appointmentid = 0;
                $scope.cacheStorageItem.appointmentStatus = "";
                $scope.cacheStorageItem.AppointmentPatientUploads = [];
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                // var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                $scope.PatientsArray = [];
                $scope.PatientSearch.SearchText = "";

                eHnoteMasterDataService.addPatientDetailsforBarcode(item);

                //if ($rootScope.CurrentUrl === "/profile") {
                //    $scope.$broadcast("formPatientSearch", appointmentinfo);
                //} else {
                //    $location.url("/profile");
                //    $scope.$broadcast("formPatientSearch", appointmentinfo);
                //}
                //$location.url("/profile");
                $scope.CheckPatientAppointmentStatus();
            }
        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }
    };
    $scope.ShowNewPatientAdd = false;
    $scope.NewPatientRegister = false;

    $scope.NewRegisterPatient = function () {
        $scope.ShowPatientListDrop = false;
        $scope.ShowNewPatientAdd = true;

        $scope.NewPatientRegister = true;
        $scope.Headers = { "PatientHeader": true };
    }
    $scope.ClosePatientPopUp = function () {
        $scope.ShowNewPatientAdd = false;
        $scope.PatientSearch.SearchText = "";
    }
    /*Patient Seach bar End*/


    $scope.mainIframeSrcUrl = "";

    $scope.openPluginApp = function () {


        console.log($scope.subOrganizationCode);
        var surl = "https://ehnotedevpatient.azurewebsites.net/#!/AppointmentPlugin/" + $scope.subOrganizationCode + "/0";
        console.log(surl);
        $scope.mainIframeSrcUrl = surl;

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/AppointmentPluginSub.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "resolve": {
                "mainIframeSrcUrl": function () { return $scope.mainIframeSrcUrl; },
            },
            "windowClass": "pluginehnotepopup",
            "controller": function ($scope, $uibModal, $uibModalInstance, $sce, eHnotePatientPVService, mainIframeSrcUrl) {


                console.log(mainIframeSrcUrl);

                $scope.mainIframeSrcUrl = $sce.trustAsResourceUrl(mainIframeSrcUrl);

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.medicalrxsuibclose = function () {

                    $uibModalInstance.dismiss("cancel");
                };

                $scope.savePrescription = function () {
                    var responsedata = "";
                    $uibModalInstance.close(responsedata);
                };

            }
        });

        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);
        }, function (cancel) {
        });

    };


    //var SetupPopUp = "";
    //$scope.BookApptfromRequest = function () {
    //    $scope.PageName = "book";
    //    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    //    var clinicAddress = { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
    //    var doctorID = {
    //        "DoctorID": doctorinfo.doctorid
    //    };

    //    if (doctorinfo.RoleID === 43 || doctorinfo.RoleID === 57) {
    //        eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
    //        eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
    //    }
    //    else if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
    //        eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
    //    } else {
    //        eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
    //    }

    //    var obj = {
    //        'IsComingFrom': 'AppointmentRequestScreen',
    //        "PluginAppoitmentRequestId": 0
    //    }
    //    datapersistanceFactory.set("AppointmentRequestScreen", obj);

    //    $scope.cacheStorageItem.patientid = 443660;
    //    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    //    SetupPopUp = $uibModal.open({
    //        "templateUrl": 'appointMentPopupId.html',
    //        "scope": $scope,
    //        "keyboard": false,
    //        "backdrop": "static",
    //        "windowClass": "appointment-full-popup",

    //    });
    //};
    //$scope.$on("closePopup", function (event) {
    //    SetupPopUp.dismiss('cancel');
    //});

    //$scope.navtoPrintAllAppointments = function () {

    //    $scope.$broadcast("printAllApptswithVsDetails", doctorInfo);
    //}

    //$scope.printAllConsultationentryForms = function (type) {

    //    $scope.$broadcast("PrintAllConsultationEntryForms", type);
    //}



    //$scope.mainAppointmentView = {
    //    "isCalendarorList": ""  // "calendar"
    //};
    //if ($scope.userLoginDetails.RoleID === 2) {
    //    $scope.mainAppointmentView.isCalendarorList = 'list';
    //} else if ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 43) {
    //    $scope.mainAppointmentView.isCalendarorList = 'list';


    //} else if ($scope.userLoginDetails.RoleID === 20) {
    //    $scope.mainAppointmentView.isCalendarorList = 'calendar';
    //}

    //else {
    //    $scope.mainAppointmentView.isCalendarorList = 'list';
    //}


    //$scope.switchNewAptOpListCal = function (newtab) {
    //    $scope.mainAppointmentView.isCalendarorList = newtab;
    //    $scope.$broadcast('NewOpListTabActive', { "response": $scope.mainAppointmentView.isCalendarorList });
    //}
    $scope.filteredPatients = [];
    $scope.BirthYearsforfilter = [];
    $scope.BirthMonthsforfilter = [];
    $scope.Insurencedetailsforfilter = [];
    var currentYear = new Date().getFullYear();
    for (var year = currentYear; year >= 1900; year--) {
        $scope.BirthYearsforfilter.push(year);
    }
    let monthNamesOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.BirthMonthsforfilter = monthNamesOrder || [];
    $scope.filters = {
        firstName: '',
        lastName: '',
        birthYear: '',
        birthMonth: '',
        gender: '',
        insurance: '',
        PayOrID: 0
    };
    $scope.AdvanceSearchByText = function (type, fil) {
        $scope.filteredPatients = [];
        //$scope.BirthYearsforfilter = [];
        //$scope.BirthMonthsforfilter = [];
        $scope.Insurencedetailsforfilter = [];

        if (type == 2) {

            $scope.PatientSearch.SearchText = $scope.Advance.SearchText || '';

            //$scope.PatientSearch.SearchText = $scope.Advance.SearchText || '';
            $scope.patSearchType = $scope.Advance.SerachType || 0;
        }
        let searchtext = '';
        if (!$scope.Advance.IsAdvanceSearch) {

            if ($scope.patSearchType == 1 && $scope.PatientSearch.SearchText.length > 3) {
                searchtext = $scope.PatientSearch.SearchText || '';
            }
            if ($scope.patSearchType == 2 && $scope.PatientSearch.SearchText.length > 5) {
                searchtext = $scope.PatientSearch.SearchText || '';
            }
            if ($scope.patSearchType == 3 && $scope.PatientSearch.SearchText.length > 9) {
                searchtext = $scope.PatientSearch.SearchText || '';
            }
        }
        else if ($scope.Advance.IsAdvanceSearch) {
            $scope.patSearchType = 1;
            $scope.PatientSearch.SearchText = "";
            $scope.Advance.SearchText = '';
            $scope.Advance.SerachType = 1;
            if ($scope.filters.firstName != '') {
                searchtext = $scope.filters.firstName || '';
            }
            if ($scope.filters.lastName != '') {
                searchtext = $scope.filters.lastName || '';
            }
        }

        if (searchtext != '' || $scope.Advance.IsAdvanceSearch) {
            var AdvanceSearch = {
                "IsfromAdvanceSearch": true,
                "Searchtext": $scope.PatientSearch.SearchText || '',
                "Type": $scope.patSearchType || 1,
            }
            eHnoteMasterDataService.addAdvanceSearch(AdvanceSearch);
            $scope.PatientsArray = [];
            var name = searchtext;
            if ($scope.Advance.IsAdvanceSearch) {
                if ($scope.filters.firstName != '') {
                    name = $scope.filters.firstName || '';
                }
                if ($scope.filters.lastName != '') {
                    name = $scope.filters.lastName || '';
                }
            }
            //if ($scope.patSearchType == 3) {
            //    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientSearch.SearchText);
            //    $scope.PatientSearch.SearchText= obj.UsFormatMobileNumber;
            //}
            //var FirstName = $scope.PatientSearch.SearchText;
            if (name === undefined || name === '') {
                type = 'click';
            }
            //if (/^\d{8}$/.test(name)) {

            //    var month = name.substring(0, 2);
            //    var day = name.substring(2, 4);
            //    var year = name.substring(4, 8);

            //    var formattedDate = year + "-" + month + "-" + day;
            //    var parsedDate = new Date(formattedDate);

            //    if (!isNaN(parsedDate.getTime())) {
            //        name = formattedDate;
            //        var param = {
            //            "PageSize": 21,
            //            "UserId": "",
            //            "PageNumber": 1,
            //            "SearchText": "",
            //            "Count": 0,
            //            "SearchDetails": { "listdocpatients": "Y" },
            //            "EndAge": 0,
            //            "StartAge": 0,
            //            "StartDate": "",
            //            "EndDate": ""
            //        };

            //        param.StartDate = name;
            //        param.hasparam = true;
            //        param.SearchText = "";
            //        param.PhoneNumber = "";
            //    } else {
            //        param = {
            //            "PageSize": 21,
            //            "UserId": "",
            //            "PageNumber": 1,
            //            "SearchText": "",
            //            "Count": 0,
            //            "SearchDetails": { "listdocpatients": "Y" },
            //            "EndAge": 0,
            //            "StartAge": 0,
            //            "StartDate": "",
            //            "EndDate": ""
            //        };
            //        param.PhoneNumber = name;
            //        param.hasparam = true;
            //        param.SearchText = "";
            //    }
            //}
            //if (name.includes("/") || name.includes("-")) {
            //    // Replace '/' with '-' to maintain consistency
            //    name = name.replace(/\//g, "-");
            //    // Parse the date
            //    var parsedDate = new Date(name + " 00:00:00");

            //    if (!isNaN(parsedDate.getTime())) {
            //        // If it's a valid date, format it correctly
            //        name = $filter('date')(parsedDate, "yyyy-MM-dd");
            //    } else {
            //        // Handle invalid date input
            //        if ($scope.patSearchType === 5) {
            //            alertify.error("Invalid date format: " + name);
            //            name = "";
            //            return false;
            //        }
            //    }
            //}
            if ($scope.patSearchType === 5) {
                name = name + " 00:00:00";
                /* name = $filter('date')(new Date(name), "yyyy-MM-dd");*/
                var parsedDate = new Date(name);
                if (!isNaN(parsedDate.getTime())) {
                    name = $filter('date')(parsedDate, "yyyy-MM-dd");
                } else {
                    // Log an error or handle the invalid date case
                    alertify.error("Invalid date format:", name);
                    name = "";
                    // Return false or handle the error in another way
                    return false;
                }
            }
            /*if ((name && name.length >= 3) || type === 'click') {*/
            if (name && name.length >= 4 || $scope.patSearchType !== 1 || $scope.Advance.IsAdvanceSearch) {
                if ($scope.patSearchType == 1 && $scope.Advance.SearchText != '' && !$scope.Advance.IsAdvanceSearch) {
                    $scope.filters.firstName = $scope.Advance.SearchText || '';

                }
                $scope.Emailid = "";

                var param = {
                    "PageSize": 21,
                    "UserId": "",
                    "PageNumber": 1,
                    "SearchText": "",
                    "Count": 0,
                    "SearchDetails": { "listdocpatients": "Y" },
                    "EndAge": 0,
                    "StartAge": 0,
                    "StartDate": "",
                    "EndDate": ""
                };

                if (!isNaN(name) && $scope.patSearchType == 3) {
                    if (name.length < 10) {
                        param.hasparam = false;
                        return;
                    }
                }
                if (!isNaN(name)) {
                    param.PhoneNumber = name;
                    param.hasparam = true;
                    param.SearchText = "";
                } else {
                    param.SearchText = name;
                    param.hasparam = true;
                    param.PhoneNumber = "";
                }
                param.UserId = eHnoteMasterDataService.getLoginId();
                let doctorInfo = eHnoteMasterDataService.getUserInfo();
                if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                    param['HospitalID'] = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    $scope.CheckHospitalId = {};
                    if ($scope.UserRoleId === 1 || $scope.UserRoleId === 56) {
                        $scope.HospitalArray = [];
                        angular.forEach(doctorInfo.doctordata.UserAddress, function (item) {
                            if (item.ExtDetails !== undefined) {
                                if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                                    var Obj = {
                                        "HospitalName": item.ClinicName,
                                        "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                                        "ActiveIND": "Y",
                                        "isChecked": true,
                                        "BranchId": item.ExtDetails.HospitalInfo.HospitalID
                                    };
                                    $scope.HospitalArray.push(Obj);
                                }
                            }
                        });
                    }
                }
                var list = [];
                angular.forEach($scope.HospitalArray, function (items) {
                    if (items.isChecked) {
                        list.push(items.BranchId);
                    }
                });
                param["HospitalIDLst"] = list;
                var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
                eHnoteMasterDataService.addPatientSearchInfo(param);
                //InitialiseSearchParam();
                //$scope.morepatientdata = false;
                //param.GetAllSpecializationInd = true;
                //param.GetAllPatientInd = true;

                if (param.PhoneNumber !== "") {
                    var object = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalID": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": param.PhoneNumber || '',
                        "SearchTypeID": $scope.patSearchType || 0,
                        //"PageSize": 50,
                        //"PageNumber": $scope.AdvcurrentPage||1,
                    }
                    eHnotePatientDataService.GetPatientsAdvanceSearch(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, $scope.sendhospcode);
                } else {
                    if (!$scope.Advance.IsAdvanceSearch) {
                        var object = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "HospitalIDLst": param.HospitalIDLst.toString(),
                            "SearchText": param.SearchText || "",
                            "SearchTypeID": $scope.patSearchType || 0,
                            //"PageSize": 50,
                            //"PageNumber": $scope.AdvcurrentPage ||1,
                            "FirstName": '',
                            "LastName": '',
                            "DOBYear": '',
                            "DOBMonth": '',
                            "OrganizationPayorId": 0,
                            "IsAdvanceSearch": false,
                            "Gender": '',

                        }
                    } else {
                        var object = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "HospitalIDLst": param.HospitalIDLst.toString(),
                            "SearchText": "",
                            "SearchTypeID": 1,
                            //"PageSize": 50,
                            //"PageNumber": $scope.AdvcurrentPage ||1,
                            "FirstName": $scope.filters.firstName || '',
                            "LastName": $scope.filters.lastName || '',
                            "DOBYear": $scope.filters.birthYear || '',
                            "DOBMonth": $scope.filters.birthMonth || '',
                            "OrganizationPayorId": $scope.filters.PayOrID || 0,
                            "IsAdvanceSearch": $scope.Advance.IsAdvanceSearch || false,
                            "Gender": $scope.filters.gender || '',

                        }
                    }
                    eHnotePatientDataService.GetPatientsAdvanceSearch(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, $scope.sendhospcode);
                }
            }
        }
        else {
            $scope.patientpushval = [];
            $scope.PatientsArray = [];
            $scope.filteredPatients = [];
            //$scope.BirthYearsforfilter = [];
            //$scope.BirthMonthsforfilter = [];
            $scope.Insurencedetailsforfilter = [];
            $scope.Advance.IsAdvanceSearch = false;
            return;
        }
    };
    function OnGetopSearchPatientSuccess(data) {
        if (data.count > 0) {
            $scope.totalItems = data.Count;
            $scope.count = data.count;
            $scope.PatientsArray = [];
            $scope.patientpushval = [];
            $scope.patientinitval = {};
            $scope.filteredPatients = [];
            //$scope.BirthYearsforfilter = [];
            //$scope.BirthMonthsforfilter = [];
            $scope.Insurencedetailsforfilter = [];
            $scope.Advance.IsAdvanceSearch = false;
            angular.forEach(data.rows, function (item) {
                $scope.patientinitval = {};
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var val = array_list[Math.floor(Math.random() * array_list.length)];
                if (item.EmailID !== undefined) {
                    $scope.patientinitval.EmailID = item.EmailID;
                }

                $scope.patientinitval.PatientID = item.PatientId;
                $scope.patientinitval.Title = item.Title;
                $scope.patientinitval.S3URL = item.S3URL || "";
                $scope.patientinitval.FullName = item.FullName;
                $scope.patientinitval.DOB = item.DOB;
                $scope.patientinitval.AgeInYears = item.AgeInYears;
                $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                $scope.patientinitval.AgeInDays = item.AgeInDays;
                $scope.patientinitval.AltCountryCode = item.AltCountryCode || '';
                $scope.patientinitval.Altareacode = item.Altareacode || '';
                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || '';

                $scope.patientinitval.Gender = item.Gender;
                $scope.patientinitval.LastVisited = item.LastVisited;
                $scope.patientinitval.CountryCode = item.CountryCode;
                $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                $scope.patientinitval.CurrentAge = item.CurrentAge;
                $scope.patientinitval.colors = val;
                $scope.patientinitval.OldMrno = item.OldMrno || "";
                $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                $scope.patientinitval.patientdisplayid = item.DisplayID;
                $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                $scope.patientinitval.familydisplayid = item.FamilyDisplayID;

                $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                $scope.patientinitval.Due = item.Due;
                $scope.patientinitval.PatientTypeId = item.PatientTypeId;
                $scope.patientinitval.IsVIPInd = item.IsVIPInd || false;
                $scope.patientinitval.IsResearchInd = item.IsResearchInd || false;
                $scope.patientinitval.IsHighRiskInd = item.IsHighRiskInd || false;
                $scope.patientinitval.DisplayID = item.DisplayID || "";
                $scope.patientinitval.Altareacode = item.Altareacode || "";
                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || "";
                $scope.patientinitval.LastName = item.LastName || "";
                $scope.patientinitval.FirstName = item.FirstName || "";
                $scope.patientinitval.InsuranceDetails = item.InsuranceDetails || [];
                var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                //var PhoneNumber = item.PhoneNumber || 0;
                //if (PhoneNumber.length > 0) {
                //    var obj = eHnoteUserDataService.UsMobileFormatChange(PhoneNumber);
                //    $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                //}
                $scope.patientinitval.Year = item.Year || "";
                $scope.patientinitval.Monthname = item.Monthname || "";

                var previouspatval = angular.copy($scope.patientinitval);
                $scope.patientpushval.push(previouspatval);
                //if ($scope.patientinitval.Year!=''&&!$scope.BirthYearsforfilter.includes($scope.patientinitval.Year)) {
                //    $scope.BirthYearsforfilter.push($scope.patientinitval.Year);
                //}
                //if ($scope.patientinitval.Monthname != '' &&!$scope.BirthMonthsforfilter.includes($scope.patientinitval.Monthname)) {
                //    $scope.BirthMonthsforfilter.push($scope.patientinitval.Monthname);
                //}
            });
            /*console.log($scope.patientpushval);*/
            angular.forEach($scope.patientpushval, function (item) {
                item.InsuranceDetails1 = '';
                item.InsuranceDetails2 = '';
                if (item.InsuranceDetails.length > 0) {
                    let count = 0;
                    angular.forEach(item.InsuranceDetails, function (initem) {
                        if (count == 0) {
                            item.InsuranceDetails1 = initem.OrganizationPayorName || '';
                            count++;
                        } else if (count == 1) {
                            item.InsuranceDetails2 = initem.OrganizationPayorName || '';
                            count++;
                        }
                        if (!$scope.Insurencedetailsforfilter.includes(initem.PlanName)) {
                            $scope.Insurencedetailsforfilter.push(initem.PlanName);
                        }
                    });

                }

            });
            //if ($scope.BirthYearsforfilter.length > 0) {
            //    $scope.BirthYearsforfilter.sort((a, b) => b - a);
            //}
            //if ($scope.BirthMonthsforfilter.length > 0) {
            //var monthNamesOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            //    $scope.BirthMonthsforfilter.sort((a, b) => monthNamesOrder.indexOf(a) - monthNamesOrder.indexOf(b));
            //}
            $scope.PatientsArray = $scope.patientpushval;
            $scope.filteredPatients = $scope.patientpushval || [];
            $scope.noresult = false;
            $scope.showloading = false;
            /* $scope.$broadcast('scroll.infiniteScrollComplete');*/
        } else {
            $scope.count = 0;
            $scope.PatientsArray = [];
            $scope.filteredPatients = [];
            $scope.totalItems = 0;
            $scope.Advance.IsAdvanceSearch = false;
        }
        if ($scope.PatientSearch.SearchText != "") {
            $scope.ShowPatientListDrop = true;
        }
    }
    function OnGetopPatientSearchError() {
        $scope.count = 0;
        $scope.PatientsArray = [];
        $scope.PatientSearch.SearchText = "";
        $scope.Advance.IsAdvanceSearch = false;
    }
    $scope.ClearSearchtext = function () {
        $scope.Advance.SearchText = '';
        $scope.Advance.LSearchText = '';
        $scope.Showlastnamefilter = false;
        $scope.filteredPatients = [];
        $scope.patientpushval = [];
        $scope.Advance.IsAdvanceSearch = false;
    }


    $scope.customFilter = function () {
        if (!$scope.Advance.SearchText || !$scope.Advance.SerachType) {
            $scope.filteredPatients = $scope.patientpushval; // No filter applied, show all items
            $scope.applySort();
            return;
        }

        var searchValue = $scope.Advance.SearchText.toLowerCase();
        $scope.patientpushval = $scope.patientpushval || [];
        $scope.filteredPatients = $scope.patientpushval.filter(function (patientitem) {
            if ($scope.Advance.SerachType == 1) {
                // FullName wise search
                if (!$scope.Showlastnamefilter) {
                    return patientitem.FullName.toLowerCase().includes(searchValue);
                } else {
                    /*    return patientitem.LastName.toLowerCase().includes($scope.Advance.LSearchText);*/
                    return patientitem.FirstName.toLowerCase().includes(searchValue) &&
                        patientitem.LastName.toLowerCase().includes($scope.Advance.LSearchText);
                }
            } else if ($scope.Advance.SerachType == 2) {
                // DisplayID wise search
                return patientitem.DisplayID.toLowerCase().includes(searchValue);
            } else if ($scope.Advance.SerachType == 3) {
                // PhoneNumber wise search
                /*var phoneNumber = patientitem.PhoneNumber.replace(/[^0-9]/g, '');*/
                return patientitem.PhoneNumber.toLowerCase().includes(searchValue);
            }

            return false; // Default case
        });
        $scope.applySort();
    };

    $scope.sortProperty = '';
    $scope.sortReverse = false;
    $scope.applySort = function () {
        $scope.filteredPatients = $filter('orderBy')($scope.filteredPatients, $scope.sortProperty, $scope.sortReverse);
    };

    $scope.toggleSort = function (property) {
        if ($scope.sortProperty === property) {
            $scope.sortReverse = !$scope.sortReverse;
        } else {
            $scope.sortProperty = property;
            $scope.sortReverse = false;
        }
        $scope.applySort();
    };

    $scope.Showlastnamefilter = false;
    $scope.Filterwithlastname = function (patientitem, planIndex) {
        $scope.Showlastnamefilter = !$scope.Showlastnamefilter || false;
        //$scope.Advance.LSearchText = $scope.Advance.SearchText || '';
        //$scope.Advance.SearchText = '';
        if ($scope.Showlastnamefilter) {
            $scope.Advance.LSearchText = $scope.Advance.SearchText || '';
            $scope.Advance.SearchText = '';
        } else {
            $scope.Advance.SearchText = $scope.Advance.LSearchText || '';
            $scope.Advance.LSearchText = '';
        }
        $scope.customFilter()
    }
    Advacnesearchfreez.IsfromAdvanceSearch = Advacnesearchfreez.IsfromAdvanceSearch || false;
    if (Advacnesearchfreez.IsfromAdvanceSearch) {
        $scope.Advance.SearchText = Advacnesearchfreez.Searchtext || '';
        $scope.Advance.SerachType = Advacnesearchfreez.Type || 1;
        $scope.AdvanceSearchByText(2);
    }


    $scope.applyFilters = function () {
        $scope.filteredPatients = $scope.filteredPatients.filter(function (patientitem) {
            var matchesFirstName = !$scope.filters.firstName || patientitem.FirstName.toLowerCase().includes($scope.filters.firstName.toLowerCase());
            var matchesLastName = !$scope.filters.lastName || patientitem.LastName.toLowerCase().includes($scope.filters.lastName.toLowerCase());
            var matchesBirthYear = !$scope.filters.birthYear || patientitem.Year === $scope.filters.birthYear;
            var matchesBirthMonth = !$scope.filters.birthMonth || patientitem.Monthname === $scope.filters.birthMonth;
            var matchesGender = !$scope.filters.gender || patientitem.Gender === $scope.filters.gender;
            var matchesInsurance = !$scope.filters.insurance ||
                patientitem.InsuranceDetails.some(insurance => insurance.OrganizationPayorId === $scope.filters.insurance.OrganizationPayorId);

            return matchesFirstName && matchesLastName && matchesBirthYear && matchesBirthMonth && matchesGender && matchesInsurance;
        });


        if ($scope.filteredPatients.length == 0) {
            if (($scope.filters.firstName && $scope.filters.firstName.length >= 4) || ($scope.filters.lastName && $scope.filters.lastName.length >= 4) || ($scope.filters.birthYear && $scope.filters.birthYear.toString().length >= 4)) {

                $scope.Advance.IsAdvanceSearch = true;
                $scope.AdvanceSearchByText(2);
            }
        }
        $scope.applySort(); // Apply sorting
    };

    $scope.Clearfilter = function () {
        $scope.filteredPatients = angular.copy($scope.patientpushval);
        $scope.filters = {
            firstName: '',
            lastName: '',
            birthYear: '',
            birthMonth: '',
            gender: '',
            insurance: '',
            PayOrID: 0
        };




    }
    $scope.maxSize = 50;
    $scope.AdvcurrentPage = 1;
    $scope.AssespageChanged = function (AdvcurrentPage) {
        $scope.AdvcurrentPage = AdvcurrentPage;
        $scope.AdvanceSearchByText(2);
    }
    $scope.SearchPayorListByText = function (SearchText) {
        var param = {
            "SearchText": SearchText || "",
            "Status": "Active",
            "PageSize": 20,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": 0,
            "PayorId": 0,
            "PayorTypeId": 0
        };
        return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
            if (resp.data.Status == "Success") {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            }
        });
    };
    $scope.onSelectOrganizationPayor = function (planobj, mainplanobj) {
        if (planobj != undefined) {
            $scope.filters.PayOrID = planobj.OrganizationPayorId;
        }
    };
    $scope.ChangeOrganizationPayorList = function (mainplanobj) {
        $scope.filters.PayOrID = 0;

    };
    $scope.onselectBirth = function (mainplanobj) {
        $scope.filters.birthYear = mainplanobj;
    }
    $scope.changefocusOption = function () {
        $scope.filters.birthYear = '';
    }
    $scope.clearPatientSearchData = function () {
        $scope.Advance.SearchText = '';
    }
    $scope.filterPopover = {
        templateUrl: 'filterCalenderPopover2.html',
    };

    $scope.closeFilterPopover = function () {
        angular.element(document.querySelector('.popover')).remove();
    };
    $scope.filterPopover = {
        templateUrl: 'filterPopoverTemplate.html',
    };
}]);
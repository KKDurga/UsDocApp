"use strict";
eHnoteWebApp.controller("EhnoteOpthaDentalParentCtrl", ["$rootScope", "$scope", "$q", "$route", "$location", "eHnoteMasterDataService", "eHnoteLoginStatusService", "datacookieFactory", "eHnoteValidateUsersDataService", "datapersistanceFactory", "alertify", "eHnotePatientDataService", "eHnoteCacheStorageService", "$filter", "eHnoteSettingsDataService", "loginCookieFactory", "localStorageFactory", "eHnoteDbStaticDataService", "$uibModal", "$interval", "eHnoteMainAppointmentService", "eHnoteAuditServices", "OpticalUtilites", "$translate", "$window", "eHnoteUserDataService", "$timeout", "eHnoteDiagnosisDataServices", "$templateCache", "eHnoteUserAppointmentDataService", "eHnotePatientAddressDataServices", "eHnoteMainAdminServices", function ($rootScope, $scope, $q, $route, $location, eHnoteMasterDataService, eHnoteLoginStatusService, datacookieFactory, eHnoteValidateUsersDataService, datapersistanceFactory, alertify, eHnotePatientDataService, eHnoteCacheStorageService, $filter, eHnoteSettingsDataService, loginCookieFactory, localStorageFactory, eHnoteDbStaticDataService, $uibModal, $interval, eHnoteMainAppointmentService, eHnoteAuditServices, OpticalUtilites, $translate, $window, eHnoteUserDataService, $timeout, eHnoteDiagnosisDataServices, $templateCache, eHnoteUserAppointmentDataService, eHnotePatientAddressDataServices, eHnoteMainAdminServices) {

    const fontSizes = {
        lg: {
            '--font-size-xs': '0.688rem',
            '--font-size-sm': '0.756rem',
            '--font-size-md': '0.825rem',
            '--font-size-lg': '0.894rem',
            '--font-size-xl': '0.962rem',
            '--font-size-2l': '1.025rem',
            '--font-size-3l': '1.087rem',
            '--font-size-4l': '1.15rem',
            '--font-size-5l': '1.212rem',
            '--font-size-6l': '1.275rem'
        },
        default: {
            '--font-size-xs': '0.625rem',
            '--font-size-sm': '0.6875rem',
            '--font-size-md': '0.75rem',
            '--font-size-lg': '0.8125rem',
            '--font-size-xl': '0.875rem',
            '--font-size-2l': '0.9375rem',
            '--font-size-3l': '1rem',
            '--font-size-4l': '1.0625rem',
            '--font-size-5l': '1.125rem',
            '--font-size-6l': '1.1875rem'
        },
        md: {
            '--font-size-xs': '0.563rem',
            '--font-size-sm': '0.619rem',
            '--font-size-md': '0.675rem',
            '--font-size-lg': '0.731rem',
            '--font-size-xl': '0.788rem',
            '--font-size-2l': '0.85rem',
            '--font-size-3l': '0.912rem',
            '--font-size-4l': '0.975rem',
            '--font-size-5l': '1.037rem',
            '--font-size-6l': '1.1rem'
        },
        sm: {
            '--font-size-xs': '0.5rem',
            '--font-size-sm': '0.55rem',
            '--font-size-md': '0.6rem',
            '--font-size-lg': '0.65rem',
            '--font-size-xl': '0.7rem',
            '--font-size-2l': '0.762rem',
            '--font-size-3l': '0.825rem',
            '--font-size-4l': '0.887rem',
            '--font-size-5l': '0.95rem',
            '--font-size-6l': '1.012rem'
        },
        xs: {
            '--font-size-xs': '0.437rem',
            '--font-size-sm': '0.481rem',
            '--font-size-md': '0.525rem',
            '--font-size-lg': '0.569rem',
            '--font-size-xl': '0.612rem',
            '--font-size-2l': '0.675rem',
            '--font-size-3l': '0.737rem',
            '--font-size-4l': '0.8rem',
            '--font-size-5l': '0.862rem',
            '--font-size-6l': '0.925rem'
        }
    };


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




    //added by sandya 11-09-2025
    //var token = datapersistanceFactory.getItemString('JWTToken');
    //if (!token || token === '[]' || token === '0' || token === '""' || token === "\"\"" || token.length === 0) {
    //    token = '';
    //    datapersistanceFactory.remove("JWTToken");
    //    localStorage.removeItem("JWTToken");
    //}
    //if (!token) {
    //    if (next && next.$$route && next.$$route.originalPath !== "/login") {
    //        event.preventDefault();
    //        $location.path("/login");
    //        return;
    //    }
    //}
    $scope.ParentObj = {
        'IsIOJParentOrganization': false
    };

    var currenturl = $location.absUrl().split('?')[0];

    var CurrentEnvironment = currenturl.split('/#')[0];

    if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
        $scope.ParentObj.IsIOJParentOrganization = true;
    } else {
        $scope.ParentObj.IsIOJParentOrganization = false;
    }

    $scope.updateFontSize = function (size) {
        const root = document.documentElement;
        if (fontSizes[size]) {
            Object.entries(fontSizes[size]).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
        }
    };
    $scope.viewBarcodeScanner = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/barcodescanner.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "windowClass": "BarcodeScanner",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.CloseBarcodeScanner = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }

    $scope.emailView = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/email.html",
            "controller": "USEmailCtrl",
            "backdrop": "static",
            // "scope": $scope,
            "keyboard": false,
            "windowClass": "modal__popup--1 bottom-to-top-modal in",
        });
    }


    $scope.NavToOpenEmailsPopupView = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/EmailNotifications.html",
            "controller": "USEmailNotificationCtrl",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__popup--1 bottom-to-top-modal in",
        });
    }
    $scope.emailReferal = function () {
        var pobject = {
            /*"From": "Patient"*/
            "From": ""
        }
        $scope.ChartObj = $scope.cacheStorageItem;
        $scope.ChartObj.EmailID = "";
        $scope.ChartObj.FaxNotificationObj = $scope.FaxNotificationObj;
        $scope.BranchesListArray = $scope.BranchesListArray || [];
        let mInstanceAdd = $uibModal.open({
            /*"templateUrl": "templates/uibpopups/emailReferalpopup.html",*/
            "templateUrl": "templates/uibpopups/emailReferalpopupNew.html",
            "controller": "USEmailReferalpopupCtrl",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "ChartObj": function () { return angular.copy($scope.ChartObj) },
                "BranchList": function () { return $scope.BranchesListArray || []; },
                "ScreenType": function () { return angular.copy(pobject.From) }

            },
            "windowClass": "modal__popup--1 bottom-to-top-modal",

        });
        mInstanceAdd.result.then(function (resp) {
            console.log(resp);
            if (resp.status === "Success") {

                $scope.FetchUnreadRowsAndMarkAsRead();
            } else {
                $scope.FetchUnreadRowsAndMarkAsRead();
            }

        }, function (cancel) {
            $scope.FetchUnreadRowsAndMarkAsRead();
        });
    }

    $rootScope.mainDisplayName = "";
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }
    $scope.focusPatientSearchInput = function () {
        $timeout(function () {
            const inputElement = document.getElementById('single-button');
            if (inputElement) {
                inputElement.focus();
            }
        }, 0);
        $scope.PatientsArray = [];
        $scope.PatientSearch.SearchText = '';
        $scope.GetPatientVisitHistory();
    };

    $scope.callAvailabilityPopover = {
        templateUrl: 'callAvailability.html',
    };

    $scope.isFullScreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    $scope.toggleFullScreen = function () {
        var elem = document.documentElement;
        var isCurrentlyFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        if (!isCurrentlyFullScreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };
    function onFullScreenChange() {
        $scope.isFullScreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
        $scope.$applyAsync();
    }
    document.addEventListener('fullscreenchange', onFullScreenChange);
    document.addEventListener('webkitfullscreenchange', onFullScreenChange);
    document.addEventListener('msfullscreenchange', onFullScreenChange);
    $scope.$on('$destroy', function () {
        document.removeEventListener('fullscreenchange', onFullScreenChange);
        document.removeEventListener('webkitfullscreenchange', onFullScreenChange);
        document.removeEventListener('msfullscreenchange', onFullScreenChange);
    });
    $scope.listval = [];
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.checkval = doctorinfo.doctordata.UserParentBranch;



    /* ---------------- Telnyx calling credential (single source of truth) ----------------
       This shell controller loads on every screen and on every browser reload, so one
       call here settles everything Telnyx-related for the session:
         - telnyxCredentialActive : drives the header call bar and the Communication Logs tab
         - telnyxloggedInfo       : the cookie the calling controller needs to start at all
       Because it re-runs on each reload, a credential created, activated or deactivated
       by an admin in another browser is picked up the next time that user reloads,
       without them having to log out and back in.
       Requires Proc_GetTelnyxUserCredentialInfo to return IsActive (DB handoff 5(b));
       until then the API defaults it to true and nothing is ever hidden.              */
    function refreshTelnyxCredential() {
        var login = eHnoteLoginStatusService.getUserLoginDetails();
        if (!login || !login.loggedinStatus) { return; }

        var address = doctorinfo && doctorinfo.doctordata && doctorinfo.doctordata.UserAddress
            ? doctorinfo.doctordata.UserAddress[0] : null;
        if (!address || !address.IsTelnyxCallingEnabled) { return; }
        if (!address.ExtDetails || !address.ExtDetails.HospitalInfo) { return; }

        var userId = eHnoteMasterDataService.getLoginId();
        var hospitalId = address.ExtDetails.HospitalInfo.HospitalID;
        if (!userId || !hospitalId) { return; }

        // Every route change re-creates this shell controller, so without a guard this
        // fires on each screen the user opens. Once the credential is resolved, the
        // calling controller's heartbeat keeps it current - there is nothing to do here
        // until the next page reload, which clears $rootScope and starts over.
        if ($rootScope.telnyxCredentialResolved) { return; }
        $rootScope.telnyxCredentialResolved = true;   // set before the call, so two
                                                      // quick route changes cannot both fire

        eHnoteMainAppointmentService.GetTelnyxUserCredentialsByBranchId(userId, hospitalId).then(function (resp) {
            if (!resp.data || resp.data.Status !== "Success" || !resp.data.UserCredentialId) {
                // no credential on this branch - no calling for this user
                $rootScope.telnyxCredentialActive = true;
                return;
            }

            $rootScope.telnyxCredentialActive = (resp.data.IsActive !== false);

            eHnoteLoginStatusService.addTelynxUserLoginDetails({
                "JToken": login.JToken,
                "UserId": login.UserId,
                "loggedinStatus": login.UserId,
                "LoginTab": login.LoginTab,
                "LoginBranchId": login.LoginBranchId,
                "UserCredentialId": resp.data.UserCredentialId,
                "FromNumber": resp.data.TelePhoneNumber,
                "RoleId": login.RoleID
            });
            $rootScope.telnyxUserAuthAvailable = true;
        });
    }
    refreshTelnyxCredential();

    $scope.rcopiaNotificationObj = {
        "IsRcopiaEnabled": false,
        "RefillCount": 0,
        "RxPendingCount": 0,
        "RxChangeCount": 0,
        "RxOrderPendingCount": 0,
        "RxNeedSignCount": 0,
        "TotalCount": 0
    };
    $scope.FaxNotificationObj = {
        "TotalCount": 0
    };

    angular.forEach($scope.checkval, function (item) {
        $scope.listval.push(item.OrganizationId);
    });
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var brancList = localStorageFactory.getItem("allBranchesData") || [];
    $scope.appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.cacheStorageItem.SelectedAppointmentTypeId = $scope.appointmentinfo.AppointmentTypeId;
    $scope.mainPatientProfileObj = {
        "MainTab": 0,
        "PatientId": $scope.cacheStorageItem.PatientID || 0,
        "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
        "PatientDetailsSummaryMode": false,
        "VisitId": 0,
        "AllBranchesList": [],
        "AllUsersList": [],
        "AllDoctorsList": [],
        "AllFacilities": [],
        "OrganizationFacilityList": [],
        "DepositTypes": [],
        "WriteOffReasons": [],
        "PatientDetailSummary": {},
        "patientInsuranceTpasArray": [],
        "HospitalReferenceMaster": [],
        "AllMasterData": {},
        "FamilySummary": [],
        "TitlesList": [],
        "isAscChartShowInd": false,
        "StatusFlag": '',
        "AppointmentDate": ''
    };
    function GetselectedPatientObj() {
        return {
            "PatientName": "",
            "PatientDisplayId": "",
            "OldPatientDisplayId": "",
            "NewpatSearchType": "1",
            "FollwuppatSearchType": "1",
            "PatientId": 0,
            "PatientDOB": "",
            "PatientAge": "",
            "PatientAgeInYears": "",
            "PatientAgeInMonths": "",
            "PatientAgeInDays": "",
            "PatientMobile": "",
            "AgeInYears": "",
            "AgeInMonths": "",
            "AgeInDays": "",
            "PatientEmail": "",
            "DOB": "",
            "OldMrno": "",
            "AlternateMobileNo": "",
            "DOBSearch": "",
            "SmsLanguageId": ""
        }
    }
    $scope.selectedPatientObj = GetselectedPatientObj();
    function GetApptMaintainfields() {
        return {
            "IsPatientSelected": false,
            "IsAddNewPatientBtn": false,
            "IsAppointmentScreen": false,
            "ShowAddNewInsurance": false,
            "EditAppointmetDate": "",
            "EditAppointmentTime": "",
            "AppointmentTypeDisplay": "",
            "IsFormScreen": ""
        }
    }
    $scope.ApptMaintainfields = GetApptMaintainfields();
    $scope.SearchByText = function (text, type) {

        $scope.patients = [];
        if (type === 'Name') {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = text;
            $scope.selectedPatientObj.PatientDisplayId = "";
            $scope.selectedPatientObj.OldPatientDisplayId = "";
            $scope.selectedPatientObj.PatientMobile = "";
            $scope.selectedPatientObj.DOBSearch = "";
        }
        else if (type === 'OldDisplayId') {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = "";
            $scope.selectedPatientObj.OldPatientDisplayId = text;
            $scope.selectedPatientObj.PatientDisplayId = "";
            $scope.selectedPatientObj.PatientMobile = "";
            $scope.selectedPatientObj.DOBSearch = "";
        }
        else if (type === 'DOBSearch') {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = "";
            $scope.selectedPatientObj.OldPatientDisplayId = "";
            $scope.selectedPatientObj.PatientDisplayId = "";
            $scope.selectedPatientObj.PatientMobile = "";
            $scope.selectedPatientObj.DOBSearch = text || "";
        }
        else {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = "";
            $scope.selectedPatientObj.OldPatientDisplayId = "";
            $scope.selectedPatientObj.PatientDisplayId = text;
            $scope.selectedPatientObj.PatientMobile = "";
            $scope.selectedPatientObj.DOBSearch = "";
        }
        var name = $scope.selectedPatientObj.PatientName;
        var patDispId = "";
        patDispId = $scope.selectedPatientObj.PatientDisplayId ? $scope.selectedPatientObj.PatientDisplayId : "";
        var patOldDispId = "";
        patOldDispId = $scope.selectedPatientObj.OldPatientDisplayId ? $scope.selectedPatientObj.OldPatientDisplayId : "";
        var patMobile = "";
        patMobile = $scope.selectedPatientObj.PatientMobile ? $scope.selectedPatientObj.PatientMobile : "";
        var patDOB = "";
        //if ($scope.selectedPatientObj.DOBSearch.length > 9) {
        //    text = text + " 00:00:00";
        //    /*  patDOB = $filter('date')(new Date(text), "yyyy-MM-dd");*/
        //    /*patDOB = $scope.selectedPatientObj.DOBSearch || "";*/
        //    var parsedDate = new Date(text);
        //    if (!isNaN(parsedDate.getTime())) {
        //        patDOB = $filter('date')(parsedDate, "yyyy-MM-dd");
        //    } else {
        //        // Log an error or handle the invalid date case
        //        alertify.error("Invalid date format:", text);
        //        // Return false or handle the error in another way
        //        return false;
        //    }
        //}

        if (name.includes("/") || name.includes("-")) {
            // Replace '/' with '-' for consistency
            text = text.replace(/\//g, "-");

            // Parse the date
            var parsedDate = new Date(text + " 00:00:00");

            // Check if the parsed date is valid
            if (!isNaN(parsedDate.getTime())) {
                // If valid, format it as "yyyy-MM-dd"
                patDOB = $filter('date')(parsedDate, "yyyy-MM-dd");
            } else {
                // Handle invalid date input
                if ($scope.selectedPatientObj.DOBSearch.length > 9) {
                    alertify.error("Invalid date format: " + text);
                    name = "";
                    return false;
                }
            }
        }


        if ((name === "" || name.length < 3) && (patDispId === "") && (patOldDispId === "") && (patMobile === "") && (patDOB === "")) {
            $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
            return;
        } else {
            if ($scope.selectedPatientObj.PatientName.length >= 3 || $scope.selectedPatientObj.PatientDisplayId.length >= 3 || $scope.selectedPatientObj.OldPatientDisplayId.length >= 2 || $scope.selectedPatientObj.PatientMobile.length >= 5 || $scope.selectedPatientObj.DOBSearch.length >= 10) {
                var param = {
                    "PageSize": 30,
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "SearchText": $scope.selectedPatientObj.PatientName,
                    "PatientDisplayId": $scope.selectedPatientObj.PatientDisplayId,
                    "OldPatientMRNO": $scope.selectedPatientObj.OldPatientDisplayId,
                    "DOBSearch": patDOB || "",
                    "PageNumber": 1,
                    "StartAge": 0,
                    "PhoneNumber": "",
                    "EndAge": 0,
                    "IncludeCommDetails": "Y",
                    "SearchDetails": {
                        "listdocpatients": "Y"
                    },
                    "SearchMobile": 0
                };
                if (name !== "") {
                    if (!isNaN(name)) {
                        if (name.length < 5) {
                            $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
                            return;
                        }
                        param.PhoneNumber = name;
                        param.hasparam = true;
                        if (name.length === 5) {
                            $scope.ApptMaintainfields.IsAddNewPatientBtn = true;
                        } else {
                            $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
                        }
                    } else {
                        param.SearchText = name;
                        param.hasparam = true;
                        $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
                    }
                }
                if (patMobile !== "") {
                    param.SearchText = parseInt(patMobile);
                    param.PhoneNumber = "";
                }
                if ($scope.RoleId === 1) {
                    param.HospitalIDLst = [doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID];

                    param.DoctorID = eHnoteMasterDataService.getLoginId();
                    param.GetAllSpecializationInd = true;
                    param.GetAllPatientInd = true;
                    var object = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": param.SearchText || "",
                    }
                    if (object.SearchText === '') {
                        if (param.PatientDisplayId !== '') {
                            object.SearchText = param.PatientDisplayId;
                        } else {
                            object.SearchText = param.OldPatientMRNO;
                        }

                    }
                    eHnotePatientDataService.SearchAllPatientNew(param, OnGetSearchPatientSuccess, OnGetPatientError);
                } else {

                    if ($scope.listval.length > 0) {
                        param.HospitalIDLst = $scope.listval;
                    } else {
                        $scope.listval.push(doctorinfo.doctordata.UserParentBranch[0].OrganizationId);
                    }
                    param.HospitalIDLst = $scope.listval;
                    param.DoctorID = eHnoteMasterDataService.getLoginId();
                    param.GetAllSpecializationInd = true;
                    param.GetAllPatientInd = true;
                    var object = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": param.SearchText,
                    }
                    if (object.SearchText === '') {
                        if (param.PatientDisplayId !== '') {
                            object.SearchText = param.PatientDisplayId;
                        } else {
                            object.SearchText = param.OldPatientMRNO;
                        }

                    }
                    eHnotePatientDataService.SearchAllPatientNew(param, OnGetSearchPatientSuccess, OnGetPatientError);
                }
            } else {
                $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
            }
        }
    };
    function OnGetSearchPatientSuccess(data) {
        //debugger
        if (data.rows !== undefined) {

            $scope.patients = angular.copy(data.rows);

            angular.forEach($scope.patients, function (item) {
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var value = array_list[Math.floor(Math.random() * array_list.length)];
                item.colors = value;

                var PhoneNumber = item.PhoneNumber || 0;
                if (PhoneNumber.length > 0) {
                    var obj = eHnoteUserDataService.UsMobileFormatChange(PhoneNumber);
                    item.UsMobileNoFormate = obj.UsFormatMobileNumber;
                }
                PhoneNumber = PhoneNumber.toString();
                if (PhoneNumber.length > 0) {
                    var number = PhoneNumber;
                    item.HomeNumber = item.HomeNumber || "";
                    if (item.HomeNumber != '') {
                        number = item.AltCountryCode + '-' + item.HomeAreaCode + '-' + item.HomeNumber;
                    } else {
                        number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.substring(5, 10);
                    }
                    item.TempPhNumber = number;
                } else {
                    item.TempPhNumber = "";
                }
            });

            $scope.ApptMaintainfields.IsAddNewPatientBtn = false;

            if ($scope.selectedPatientObj.FollwuppatSearchType == 2 || $scope.selectedPatientObj.FollwuppatSearchType == "2") {
                $scope.ApptMaintainfields.IsAddNewPatientBtn = true;
            }

        } else {
            $scope.patients = [];
            if ($scope.selectedPatientObj.FollwuppatSearchType == 2 || $scope.selectedPatientObj.FollwuppatSearchType == "2") {
                $scope.ApptMaintainfields.IsAddNewPatientBtn = true;
                if (!isNaN($scope.selectedPatientObj.PatientName)) {
                    if ($scope.selectedPatientObj.PatientName.length > 10) {
                        $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
                    }
                }
            } else {
                $scope.ApptMaintainfields.IsAddNewPatientBtn = true;
            }
        }
    }
    function OnGetPatientError(err) {
        console.log(err);
    }
    $scope.closeDropdown = function () {
        document.querySelector('#header__Search--').classList.remove('open');
    };


    $scope.GetPatientRelatedMasterData = function () {
        eHnoteSettingsDataService.GetPatientRelatedMasterData().then(function (resp) {
            if (resp.data.status === "Success") {
                // $scope.PatientMasterDataArray = resp.data.rows;
                $scope.mainPatientProfileObj.AllMasterData = resp.data || {};
                //$scope.PatientSuffixList = resp.data.PatientSuffix;
                //$scope.PatientEthnicityList = resp.data.PatientEthnicity;
                //if ($scope.PatientEthnicityList.length > 0) {
                //    angular.forEach($scope.PatientEthnicityList, function (kitem) {
                //        kitem.IsSelected = false;
                //        kitem.Id = 0;
                //    });
                //}
                //$scope.PatientRaceList = resp.data.PatientRace;
                //if ($scope.PatientRaceList.length > 0) {
                //    angular.forEach($scope.PatientRaceList, function (kitem) {
                //        kitem.IsSelected = false;
                //        kitem.Id = 0;
                //    });
                //}

                //$scope.PatientSexualOrientationList = resp.data.PatientSexualOrientation;
                //$scope.PatientGenderIdentityList = resp.data.PatientGenderIdentity;
                //$scope.PatientNationalityList = resp.data.PatientNationality;
                //$scope.PatientLanguageList = resp.data.PatientLanguage;
                //$scope.InsuranceRelationShipList = resp.data.InsuranceRelationShip;
                //$scope.InsurancePlanTypeList = resp.data.InsurancePlanType;
                //$scope.PatientPrefixList = resp.data.PatientTitle;
                //$scope.PatientLanguageProficiencyList = resp.data.LanguageProficiency;
                //$scope.PatientLanguageExpressionList = resp.data.LanguageExpression;
                //$scope.PatientClassArray = resp.data.PatientClass;
                //$scope.InsuranceCoverageList = resp.data.CoverageArray;
                //$scope.InsuranceStatusList = resp.data.InsuranceStatus;
                //if ($scope.InsuranceStatusList.length > 0) {
                //    //  $scope.InsuranceStatusList = $filter("filter")($scope.InsuranceStatusList, function (item, index) { return item.StatusId !== 2 && item.StatusId !== 4 });
                //}
                if (resp.data.TitleArray.length != 0) {
                    $scope.TitlesList = resp.data.TitleArray;
                    $scope.mainPatientProfileObj.TitlesList = $scope.TitlesList || [];
                    //$scope.PatientDetailsInfo.TitleId = $scope.TitlesList[0].Id;
                    //$scope.PatientDetailsInfo.Title = $scope.TitlesList[0].Name;

                    //$scope.FamilyInfo.FamilyArray[0].TitleId = $scope.TitlesList[0].Id || 1;
                    //$scope.FamilyInfo.FamilyArray[0].Title = $scope.TitlesList[0].Name;
                }
                // $scope.InsuranceStatusList1 = resp.data.InsuranceStatus;


                //$scope.CoverageList = resp.data.InsuranceIdentifierList || [];
                //if ($scope.CoverageList.length > 0) {
                //    $scope.CoverageList = $filter("filter")($scope.CoverageList, function (item, index) { return item.IdentifierId !== 6 && item.IdentifierId !== 7 });
                //}

                //if (resp.data.HospitalEquipmentList.length > 0) {

                //    angular.forEach(resp.data.HospitalEquipmentList, function (item) {
                //        item.IsChecked = false;
                //    });
                //    $scope.HospitalEquipmentList = resp.data.HospitalEquipmentList;
                //}
                //if (resp.data.AppointmentTypes.length > 0) {
                //    $scope.AppointmentTypes = resp.data.AppointmentTypes || [];
                //}

            }
        })
    };
    $scope.GetPatientRelatedMasterData();
    $scope.navtoAddPatientProfilePopup = function (Type) {

        $scope.ShowInsuranceAddnew = true;

        var obj = {
            "Tab": Type,
            "PatientDetails": $scope.PatientSearch.SearchText,
            "HospitalEquipmentList": $scope.mainPatientProfileObj.AllMasterData.HospitalEquipmentList,
            "PatientAddress": null,
            "PatientInsuranceSummary": [],
            "ShowInsuranceAddnew": false,
            "InsuranceStatusList": [],
            "InsuranceEditItem": null,
            "AllMasterData": $scope.mainPatientProfileObj.AllMasterData || {},
            "FamilySummary": $scope.mainPatientProfileObj.FamilySummary || [],
            "TitlesList": $scope.mainPatientProfileObj.TitlesList || [],
            "AddEdit": "Add"
        };

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/UsEditPatientProfilev2.html",
            "backdrop": "static",
            "windowClass": "modal__ninety--",
            "keyboard": false,
            "resolve": {
                "mainObject": function () { return obj; }
            },
            "controller": "UsEditPatientProfileCtrlv2",
        });
        $scope.mInstanceAdd.result.then(function (result) {

        }, function (cancel) {
        });

    }


    $scope.$route = $route;
    $rootScope.patientdetailesConsultation = false;
    $rootScope.patientAllSearchHeader = true;
    $rootScope.patientConsultationScreen = false;
    $rootScope.RegisterPatientScreen = false;

    $scope.patSearchType = 1;

    //if (userLoginDetails.loggedinStatus === "true") {
    //    userLoginDetails.loggedinStatus = true;
    //}

    //var token = datapersistanceFactory.getItemString('JWTToken') || '';

    //console.log(token +"__JWTToken");
    ///*token = token || '';*/
    //if (typeof token === 'string') {
    ////    console.log('Valid');
    //} else {
    //    $location.path("/login");
    ////    $scope.$destroy();
    //    return false; 9875216
    //}

    var Advacnesearchfreez = eHnoteMasterDataService.getaddAdvanceSearch() || '';
    Advacnesearchfreez.IsfromAdvanceSearch = Advacnesearchfreez.IsfromAdvanceSearch || false;
    $scope.cacheStorageItem.subtype = $scope.cacheStorageItem.subtype || ''
    if ($route.current.activetab == "ot") {
        let Advacnesearchfreez = eHnoteMasterDataService.getaddAdvanceSearchAsc() || '';
        Advacnesearchfreez.IsfromAdvanceSearch = Advacnesearchfreez.IsfromAdvanceSearch || false;
        $scope.OPTab = "preadmission";
        if (Advacnesearchfreez.IsfromAdvanceSearch) {
            $scope.OPTab = 'advancesearch';
        }
    } else {
        $scope.OPTab = "appointments";
        if ($scope.cacheStorageItem.subtype === 'AUDIT') {
            $scope.OPTab = "AUDIT";
        }
        if (Advacnesearchfreez.IsfromAdvanceSearch) {
            $scope.OPTab = 'advancesearch';
        }
    }

    $scope.switchOPMaintabs = function (tabno) {
        $scope.OPTab = tabno;
        $scope.$broadcast('OptTabActive', { "response": $scope.OPTab });
        if ($scope.OPTab == 'advancesearch') {
            $scope.PatientSearch.SearchText = '';
            var AdvanceSearch = {
                "IsfromAdvanceSearch": true,
                "Searchtext": $scope.PatientSearch.SearchText || '',
                "Type": $scope.patSearchType || 0,
            }
            eHnoteMasterDataService.addAdvanceSearch(AdvanceSearch);
        } else {
            $scope.PatientSearch.SearchText = '';
            var AdvanceSearch = {
                "IsfromAdvanceSearch": false,
                "Searchtext": '',
                "Type": 0,
            }
            eHnoteMasterDataService.addAdvanceSearch(AdvanceSearch);
            eHnoteMasterDataService.addAdvanceSearchAsc(AdvanceSearch);
        }
    };

    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

    if ($scope.UserAccessRights.SubAccessCategories.CrmReminders) {
        $scope.CRMTab = "Recall";
    }
    if ($scope.UserAccessRights.SubAccessCategories.CRMTodaysWorkUp) {
        $scope.CRMTab = "WorkUp";
    }
    if ($scope.UserAccessRights.SubAccessCategories.CrmNoShow) {
        $scope.CRMTab = "NoShowAppointments";
    }
    if ($scope.UserAccessRights.SubAccessCategories.CrmAppointments) {
        $scope.CRMTab = "Appointments";
    }
    /*   $scope.CRMTab = "Dashboard";*/
    var Advacnesearchfreezcrm = eHnoteMasterDataService.getaddAdvanceSearchCrm() || '';
    Advacnesearchfreezcrm.IsfromAdvanceSearch = Advacnesearchfreezcrm.IsfromAdvanceSearch || false;
    if (Advacnesearchfreezcrm.IsfromAdvanceSearch) {
        $scope.CRMTab = 'advancesearch';
    }

    //$scope.selectedCrmTabs = eHnoteMasterDataService.getselectedCrmTab($scope.CRMTab);
    //console.log($scope.selectedCrmTabs);

    /*   $scope.CRMTab = "";*/

    //if ($scope.selectedCrmTabs.TabName === "" || $scope.selectedCrmTabs.TabName === undefined) {
    //    var obj = {
    //        "TabName": "Appointments"
    //    };
    //    eHnoteMasterDataService.addselectedCrmTab(obj);
    //    $scope.CRMTab = "Appointments";
    //} else {
    //    $scope.CRMTab = $scope.selectedCrmTabs.TabName;
    //}

    $scope.switchCRMMaintabs = function (tabno) {
        $scope.CRMTab = tabno;
        $scope.$broadcast('CrmTabActive', { "response": $scope.CRMTab });
    };


    $scope.HospitalArray = [];

    $scope.Parent = {
        "PatientTitlesArray": [],
        "EditPatientPopUp": "",
        "EditPatientComingFrom": ""
    };
    $scope.Parent.PatientTitlesArray = eHnoteDbStaticDataService.GetPatientTitlesArray();


    $scope.UserAccessList = [];

    $scope.isregisterBtnShowHide = false;
    $scope.isPaientShowHide = false;


    $scope.showDashboardTab = true;
    $scope.showSettingsTab = true;
    $scope.showOutPatientTab = true;
    $scope.showOTTab = true;
    $scope.showIPTab = true;
    $scope.showCrmTab = true;
    $scope.showCommunicationTab = true;
    $scope.showReferalTab = true;
    $scope.showAuditTab = true;
    $scope.showPharmacyTab = true;
    $scope.showInventoryTab = true;
    $scope.showOpticalTab = true;
    $scope.showAccountTab = true;
    $scope.showAdminTab = true;

    //Newly Added By Durga on 26-09-2019

    $scope.showDashboardTabNew = false;
    $scope.showSettingsTabNew = false;
    $scope.showOutPatientTabNew = false;
    $scope.showConsultationTabNew = false;
    $scope.showPatientTabNew = false;
    $scope.showOTTabNew = false;
    $scope.showCounsellorTabNew = false;
    //$scope.showPatientsTabNew = true;
    $scope.showIPTabNew = false;
    $scope.showCrmTabNew = false;
    $scope.showCommunicationTabNew = false;
    $scope.showReferalTabNew = false;
    $scope.showAuditTabNew = false;
    $scope.showPharmacyTabNew = false;
    $scope.showInventoryTabNew = false;
    $scope.showOpticalTabNew = false;
    $scope.showAccountTabNew = false;
    $scope.showAdminTabNew = false;
    // $scope.showInsuranceTabNew = true;
    $scope.showInsuranceTabNew = false;

    $scope.disableDashboardTabNew = true;
    $scope.disableSettingsTabNew = true;
    $scope.disableOutPatientTabNew = true;
    $scope.disableConsultationTabNew = true;
    $scope.disablePatientTabNew = true;
    $scope.disableOTTabNew = true;
    $scope.disableCounsellorTabNew = true;
    // $scope.disablePatientsTabNew = true;
    $scope.disableIPTabNew = true;
    $scope.disableCrmTabNew = true;
    $scope.disableCommunicationTabNew = true;
    $scope.disableReferalTabNew = true;
    $scope.disableAuditTabNew = true;
    $scope.disablePharmacyTabNew = true;
    $scope.disableInventoryTabNew = true;
    $scope.disableOpticalTabNew = true;
    $scope.disableAccountTabNew = true;
    $scope.disableAdminTabNew = true;
    $scope.disableInsuranceTabNew = false;
    $scope.disableDsipTabNew = false;

    $scope.UserRoleId = 0;

    $scope.navToip = function () {
        $location.url("/IP");
    };

    $scope.DisplayId = "";

    $scope.userProfilePic = "";
    $scope.HospitalIDSList = "";
    $scope.roomActiveObj = {
        "RoomId": 0,
        "RoomName": "",
        "IsMultipleRooms": false,
        "IsEnabled": false
    };





    $scope.getOrganizationRcopiaNotificationsDetails = function () {


        var params = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        }
        eHnoteDiagnosisDataServices.getOrganizationRcopiaNotificationDetails(params).then(function (response) {

            console.log(JSON.stringify(response));

            if (response.data.status == 'Success') {
                $scope.rcopiaNotificationObj.RefillCount = response.data.RefillCount || 0;
                $scope.rcopiaNotificationObj.RxPendingCount = response.data.RxPendingCount || 0;
                $scope.rcopiaNotificationObj.RxChangeCount = response.data.RxChangeCount || 0;
                $scope.rcopiaNotificationObj.RxOrderPendingCount = response.data.RxOrderPendingCount || 0;
                $scope.rcopiaNotificationObj.RxNeedSignCount = response.data.RxNeedSigningCount || 0;
                $scope.rcopiaNotificationObj.TotalCount = response.data.TotalCount || 0;
            }
        });
    };




    $scope.InitializeUser = function () {
        userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        var doctorimage = datacookieFactory.getItem('ProfileImage');
        if (doctorinfo !== undefined) {





            $scope.orgUsersData = doctorinfo.doctordata.UserAddress;
            console.log($scope.orgUsersData);


            if ($scope.orgUsersData !== undefined) {
                if ($scope.orgUsersData[0] !== undefined) {
                    $scope.lRName = $scope.orgUsersData[0].ExtDetails.RoleName;

                    $scope.rcopiaNotificationObj.IsRcopiaEnabled = $scope.orgUsersData[0].IsRcopiaEnabled || false;
                    if ($scope.orgUsersData[0].IsEnableQueueManagement) {
                        $scope.roomActiveObj.RoomId = $scope.orgUsersData[0].ActiveRoomId || 0;
                        $scope.roomActiveObj.RoomName = $scope.orgUsersData[0].ActiveRoomName || "";
                        $scope.roomActiveObj.IsEnabled = true;
                        $scope.orgUsersData[0].UserBranchRoomsArray = $scope.orgUsersData[0].UserBranchRoomsArray || [];
                        if ($scope.orgUsersData[0].UserBranchRoomsArray.length > 1) {
                            $scope.roomActiveObj.IsMultipleRooms = true;
                        }
                    }


                    $scope.Name = userLoginDetails.displayName;
                    $rootScope.mainDisplayName = userLoginDetails.displayName;
                    $scope.SpecialityName = userLoginDetails.specialisation;
                    $scope.Speciality = userLoginDetails.specialisation;
                    //$scope.groupID = userLoginDetails.GroupID;
                    //$scope.RoleName = userLoginDetails.RoleName;
                    //$scope.accessRights = doctorinfo.UserAccessID;

                    $scope.groupID = doctorinfo.doctordata.User[0].GroupId;
                    $scope.accessRights = doctorinfo.doctordata.User[0].AccessDetails;
                    $scope.RoleName = doctorinfo.doctordata.User[0].RoleName;
                    $scope.Speciality = userLoginDetails.specialisation;
                    userLoginDetails.RoleID = doctorinfo.doctordata.User[0].RoleId;


                    if (userLoginDetails.RoleID === 4 || userLoginDetails.RoleID === 43 || userLoginDetails.RoleID === 16 || userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 3 || userLoginDetails.RoleID === 14 || userLoginDetails.RoleID === 56 || userLoginDetails.RoleID === 57) {
                        //$scope.profileName = 'Dr. ' + $rootScope.mainDisplayName + ' (' + $scope.lRName + ')';
                        $scope.profileName = $rootScope.mainDisplayName + ' (' + $scope.lRName + ')';
                    } else {
                        $scope.profileName = $rootScope.mainDisplayName + ' (' + $scope.lRName + ')';
                    }


                    //$scope.userProfilePic = datapersistanceFactory.getItem('userProfileimg') || "";
                    $scope.userProfilePic = "";

                    var speciality = datacookieFactory.set('specialisation');
                    if (datapersistanceFactory.getItem('userProfileimg') !== "") {
                        $scope.ProfileImage = "data:image/png;base64," + GetImage(datapersistanceFactory.getItem('userProfileimg'));
                    } else {
                        $scope.ProfileImage = "data:image/png;base64," + (datapersistanceFactory.getItem('userProfileimg') === "") ? "" : GetImage(datapersistanceFactory.getItem('userProfileimg'));
                    }

                    checkAccessForUser(doctorinfo);
                }
            }

            if ($scope.rcopiaNotificationObj.IsRcopiaEnabled) {
                $scope.getOrganizationRcopiaNotificationsDetails();
            }

        }
    };


    $scope.UserAccessRights = [];

    $scope.onload = function () {
        var data = localStorageFactory.getItem("allBranchesData") || [];
        if (data.length === 0 || data.length === undefined) {
            alertify.error("Something Went Wrong");
            datapersistanceFactory.clearAll();
            localStorageFactory.clearAll();
            $rootScope.showMainPageHeader = false;
            $location.path("/login");
            return false;
        } else {
            onListDocSuccess(data);
        }
    };


    if (!userLoginDetails.loggedinStatus) {
        datapersistanceFactory.clearAll();
        localStorageFactory.clearAll();
        $rootScope.showMainPageHeader = false;
        $location.path("/login");
        return false;
    }
    else {
        doctorinfo = eHnoteMasterDataService.getUserInfo();

        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

        console.log(doctorinfo);


        $rootScope.ParentSpecializationId = "";
        $scope.onload();
        $scope.InitializeUser();
        if (doctorinfo !== "") {
            $scope.UserRoleId = doctorinfo.RoleID || 0;



            //if ($scope.UserRoleId===18) {
            //    $scope.UserAccessRights.MainAccessCategories.OP = false;
            //}
            if (doctorinfo.doctordata.User !== undefined) {
                $scope.UserAccessList = doctorinfo.doctordata.User[0].UseAccessDetails;
                $rootScope.ParentSpecializationId = doctorinfo.doctordata.User[0].SpecializationId;


                $scope.UserSpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                if ($scope.UserSpecializationId === 3) {
                    if (userLoginDetails.RoleID !== 26) {
                        $scope.showOTTab = true;
                    }
                }

                checkforUserPermissionsNew($scope.UserAccessList);
            }
        }
    }


    function InitializeNewBranches(data) {
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
            $scope.BranchesListArray = BrachesList;
        }

        var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
        $scope.HospitalIDSList = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
        console.log($scope.HospitalIDSList);
    }

    function checkforUserPermissionsNew() {

        $scope.showDashboardTabNew = false;
        $scope.showSettingsTabNew = false;
        $scope.showOutPatientTabNew = false;
        $scope.showConsultationTabNew = false;
        $scope.showPatientTabNew = false;
        $scope.showOTTabNew = false;
        $scope.showCounsellorTabNew = false;
        //$scope.showPatientsTabNew = false;
        $scope.showIPTabNew = false;
        $scope.showCrmTabNew = false;
        $scope.showCommunicationTabNew = false;
        $scope.showReferalTabNew = false;
        $scope.showAuditTabNew = false;
        $scope.showPharmacyTabNew = false;
        $scope.showInventoryTabNew = false;
        $scope.showOpticalTabNew = false;
        $scope.showAccountTabNew = false;
        $scope.showAdminTabNew = false;
        $scope.disableDashboardTabNew = true;
        $scope.disableSettingsTabNew = true;
        $scope.disableOutPatientTabNew = true;
        $scope.disableConsultationTabNew = true;
        $scope.disablePatientTabNew = true;
        $scope.disableOTTabNew = true;
        $scope.disableCounsellorTabNew = true;
        // $scope.disablePatientsTabNew = true;
        $scope.disableIPTabNew = true;
        $scope.disableCrmTabNew = true;
        $scope.disableCommunicationTabNew = true;
        $scope.disableReferalTabNew = true;
        $scope.disableAuditTabNew = true;
        $scope.disablePharmacyTabNew = true;
        $scope.disableInventoryTabNew = true;
        $scope.disableOpticalTabNew = true;
        $scope.disableAccountTabNew = true;
        $scope.disableAdminTabNew = true;
        $scope.disableDsipTabNew = false;



        // checkAccessForAdminRole();


    }




    $scope.popup_value = 1;
    $scope.editPatientinfo = false;
    setpatientedit();
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
    $scope.$on("patientInfoDetails", function (event, item) {

        console.log(item.PatientDetails);
        $scope.PatientTypeId = item.PatientTypeId || "";
        $scope.patientDetails = item.PatientDetails;
        $scope.S3URL = item.S3URL || "";




        if ($scope.patientDetails !== undefined) {

            if ($scope.PatientTypeId === "") {
                $scope.PatientTypeId = $scope.patientDetails.PatientTypeId || "";
            }

            console.log($scope.patientDetails.Title + "__" + $scope.patientDetails.FullName);
            $scope.Patientviewname = $scope.patientDetails.Title + '. ' + $scope.patientDetails.FullName;
            $scope.PatientDisplayId = $scope.patientDetails.PatientDisplayId || "";
            if ($scope.PatientDisplayId != '') {
                $scope.DisplayId = '(' + $scope.PatientDisplayId + ')';
            }


            if ($scope.patientDetails.AgeInYears === 0 && $scope.patientDetails.AgeInMonths === 0) {
                $scope.PatientAge = $scope.patientDetails.AgeInDays + 'Days';
            } else {
                $scope.PatientAge = $scope.patientDetails.AgeInYears + 'Y' + ' ' + $scope.patientDetails.AgeInMonths + 'M';

            }
            $scope.PatientPhoneno = $scope.patientDetails.MobileNo ? $scope.patientDetails.MobileNo : "";
            $scope.PatientGender = $scope.patientDetails.Gender;

        }
        $scope.popup_value = 1;
        $scope.switchtonexttab = function (val) {
            $scope.popup_value = val;
        };



    });



    var SetupPopUp;

    $scope.EditPatientPopUp;

    $scope.editAppointmentPopup = function (item) {

        if (item.PatientID === undefined) {
            $scope.patientData = item.Patient[0];
        } else {
            $scope.patientData = item;
        }





        //SetupPopUp = $uibModal.open({
        //    "templateUrl": 'editpatientDirectivePopupId.html',
        //    "scope": $scope,
        //    "keyboard": false,
        //    "backdrop": "static",
        //    "size": "lg",
        //});


        $scope.Parent.EditPatientComingFrom = "ParentPage";

        var pageurl = $location.url();
        if (pageurl === '/NewOpthaConsultation') {
            $scope.Parent.EditPatientComingFrom = "ParentPageFromConsultation";
        }
        if (pageurl === '/Pastvisit') {
            $scope.Parent.EditPatientComingFrom = "ParentPageFromCaseHistory";
        }
        if (pageurl === '/appointmentbilling') {
            $scope.Parent.EditPatientComingFrom = "ParentPageFromAppointmentbilling";
        }

        $scope.Parent.EditPatientPopUp = $uibModal.open({
            "templateUrl": 'editpatientDirectivePopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"

        });

    };

    //$scope.$on('editpatientclosePopup', function (event) {
    //    setpatientedit();
    //    //SetupPopUp.dismiss('cancel');
    //    //$scope.shownewAppointmentPopUp = false;
    //});
    // var SetupPopUp;


    $scope.$on("patientInfoDetailsFromOt", function (event, item) {



        //$scope.Patientviewname = item.PatientDetails.FirstName;
        //$scope.PatientAge = "";
        //$scope.PatientPhoneno = "";
        //if (item.PatientDetails.Age !== undefined) {
        //    $scope.PatientAge = item.PatientDetails.Age + "Y";
        //}
        //if (item.PatientDetails.MobileNumber !== 0) {
        //    $scope.PatientPhoneno = item.PatientDetails.MobileNumber;
        //}

        if (item.PatientDetails === undefined) {
            item.PatientDetails = item;
        }





        $scope.Patientviewname = item.PatientDetails.Patient[0].FullName;
        $scope.PatientDisplayId = item.PatientDetails.Patient[0].PatientDisplayId;
        $scope.S3URL = item.PatientDetails.Patient[0].S3URL || "";
        if ($scope.PatientDisplayId != '') {
            $scope.DisplayId = '(' + $scope.PatientDisplayId + ')';
        }
        $scope.PatientAge = "";
        $scope.PatientPhoneno = "";
        if (item.PatientDetails.Patient[0].AgeInYears !== undefined) {
            $scope.PatientAge = item.PatientDetails.Patient[0].AgeInYears + "Y";
        }
        if (item.PatientDetails.Patient[0].MobileNo !== undefined) {
            $scope.PatientPhoneno = item.PatientDetails.Patient[0].MobileNo;
        }
    });
    $scope.changeUserBranch = function (usersi) {
        var index = doctorinfo.doctordata.UserAddress.indexOf(usersi);
        doctorinfo.doctordata.UserAddress.splice(index, 1);
        doctorinfo.doctordata.UserAddress.unshift(usersi);
        eHnoteMasterDataService.addUserInfo(doctorinfo);
        doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.InitializeUser();

        $scope.GetOrganizationSettings(usersi.ExtDetails.HospitalInfo.ParentHospitalID);
        $scope.GetClinicDoctors(usersi.ExtDetails.HospitalInfo.ParentHospitalID);

        $scope.getUserConsultationdata(doctorinfo);
        $scope.$broadcast("changeBranchAppointments", doctorinfo);
        //$location.url("/OP");
    };
    $scope.GetClinicDoctors = function (ParentHospitalID) {
        var docParams = {
            "PageSize": 1000,
            "PageNumber": 1,
            "HospitalID": ParentHospitalID,
            "ActiveDoctors": "Y"
        };
        var allhospitaldocdata = [];
        eHnoteMainAppointmentService.getClinicDoctors(docParams, onclinicalListDocSuccess, OnListDocFailed);
        function onclinicalListDocSuccess(data) {
            allhospitaldocdata = angular.copy(data);
            localStorageFactory.set("allHospitalsDoctorsData", allhospitaldocdata);
        }
        function OnListDocFailed(error) {
            console.log(error);
        }
    };

    //$scope.SurgeryStatusCount = {};
    //$scope.GetSurgeryStatusCount = function () {
    //    $scope.ToDate = $filter("date")(new Date(), "yyyy-MM-dd");
    //    var Params = {
    //        "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
    //        "DoctorId": 0,
    //        "Date": $scope.ToDate
    //    };

    //    eHnoteMainAppointmentService.GetSurgeryStatusCountbyBranch(Params, onListDocSuccess, OnListDocFailed);
    //    function onListDocSuccess(data) {
    //        $scope.SurgeryStatusCount = angular.copy(data);

    //    }
    //    function OnListDocFailed(error) {
    //        console.log(error);
    //    }
    //};
    //$scope.GetSurgeryStatusCount();

    $scope.AppointmentStatusCount = {};
    $scope.SelectDoctorId = 0;

    //if (doctorinfo.doctordata.User[0].RoleId == 43 || doctorinfo.doctordata.User[0].RoleId == 1) {
    //    $scope.SelectDoctorId = doctorinfo.doctordata.User[0].DoctorID;
    //}
    if ($scope.UserRoleId === 1 || $scope.UserRoleId === 43) {
        $scope.SelectDoctorId = doctorinfo.doctordata.User[0].DoctorID;
    }

    $scope.GetAppointmentDoctorsCount = function () {
        $scope.ToDate = $filter("date")(new Date(), "yyyy-MM-dd");

        var HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress.length > 0) {
            HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        } else {
            HospitalId = userLoginDetails.HospitalID;
        }
        var Params = {
            "HospitalID": HospitalId,
            "DoctorId": $scope.SelectDoctorId || 0,
            //"DoctorId": doctorinfo.doctordata.User[0].DoctorID || 0,
            "Date": $scope.ToDate
        };

        //if ($scope.UserRoleId === 4 || $scope.UserRoleId === 43 || $scope.UserRoleId === 2 || $scope.UserRoleId === 10) {
        //}  
        //if ($scope.UserRoleId === 1) {
        //    Params.DoctorId = eHnoteMasterDataService.getLoginId()
        //};

        eHnoteMainAppointmentService.GetAppointmentDoctorsCountbyBranch(Params, onSuccess, OnFailed);
        function onSuccess(data) {
            $scope.AppointmentStatusCount = angular.copy(data);

        }
        function OnFailed(error) {
            console.log(error);
        }
    };
    //$scope.GetAppointmentDoctorsCount();

    $rootScope.$on("AppointmentTypefilter", function (event, data) {
        $scope.SelectDoctorId = data.selectedDoctor.DoctorID
        $scope.GetAppointmentDoctorsCount();
    });

    $scope.GetOrganizationSettings = function (ParentHospitalID) {
        //eHnoteSettingsDataService.GetOrganizationSettings({ "ParentOrganizationId": ParentHospitalID }).then(function (resp) {
        eHnoteSettingsDataService.GetOrganizationSettings(ParentHospitalID).then(function (resp) {
            eHnoteSettingsDataService.RestructureOrganizationSettings(resp.data.SettingDetails, resp.data);
        }, function (err) {
            console.log(err);
            alertify.error("Getting oganization settings failed");
        });
    };



    $scope.getUserConsultationdata = function (doctorinfo) {


        eHnoteSettingsDataService.GetUserConsultationitems(doctorinfo.doctorid, doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID).success(function (response) {
            if (response.status === "Success") {
                loginCookieFactory.set("masterDataArrays", []);
                var masterdataObj = {
                    "masterChiefComplaintsArray": [],
                    "masterClinicalNotesArray": [],
                    "masterObservationsArray": [],
                    "masterDiagnosisArray": [],
                    "masterProceduresArray": [],
                    "masterMedicinesArray": [],
                    "masterLabTestArray": [],
                    "masterInvestigations": [],
                    "masterInvCategories": [],
                    "masterMedicineTemplatesArray": [],
                    "PrescriptionFrequencies": [],
                    "PaymentModes": [],
                    "LeadProblems": [],
                    "masterNewLabTestArray": [],
                    "masterCurrentTreatmentArray": [],
                    "masterAllergyArray": [],
                    "masterSurgeryArray": [],
                    "masterMedicalHistoryArray": [],
                    "masterBirthHistoryArray": [],
                    "masterFamilyHistoryArray": [],
                    "masterNutritionalHistoryArray": [],
                    "masterImmunisationHistoryArray": [],
                    "masterSurgicalHistoryArray": [],
                    "masterMenstrualHistoryArray": [],
                    "masterLifestyleHistoryArray": [],
                    "masterPatientInstructionsArray": [],
                    "masterAppointmentStatus": [],
                    "masterBookingTypes": [],
                    "masterOperativeNoteAddendumReasons": [],
                };

                if (response.ChiefComplaints && response.ChiefComplaints.length > 0) {
                    masterdataObj.masterChiefComplaintsArray = response.ChiefComplaints;
                }
                if (response.ClinicalNotes && response.ClinicalNotes.length > 0) {
                    masterdataObj.masterClinicalNotesArray = response.ClinicalNotes;
                }
                if (response.Observations && response.Observations.length > 0) {
                    masterdataObj.masterObservationsArray = response.Observations;
                }
                if (response.Diagnosis && response.Diagnosis.length > 0) {
                    masterdataObj.masterDiagnosisArray = response.Diagnosis;
                }
                if (response.Procedures && response.Procedures.length > 0) {
                    masterdataObj.masterProceduresArray = response.Procedures;
                }
                if (response.Medicines && response.Medicines.length > 0) {
                    masterdataObj.masterMedicinesArray = response.Medicines;
                }
                if (response.LabTest && response.LabTest.length > 0) {
                    masterdataObj.masterLabTestArray = response.LabTest;
                }
                if (response.Investigations && response.Investigations.length > 0) {
                    masterdataObj.masterInvestigations = response.Investigations;

                    angular.forEach(masterdataObj.masterInvestigations, function (item, index) {
                        item.IsInvestigationChecked = false;
                    });
                }
                if (response.InvCategories && response.InvCategories.length > 0) {

                    masterdataObj.masterInvCategories = response.InvCategories;

                    angular.forEach(masterdataObj.masterInvCategories, function (item, index) {
                        item.TempIsCategoryChecked = false;
                        item.IsCategoryChecked = false;
                    });
                }
                if (response.MedicineTemplates && response.MedicineTemplates.length > 0) {
                    masterdataObj.masterMedicineTemplatesArray = response.MedicineTemplates;
                }
                if (response.PrescriptionFrequencies && response.PrescriptionFrequencies.length > 0) {
                    masterdataObj.PrescriptionFrequencies = response.PrescriptionFrequencies;
                }

                if (response.PaymentModes && response.PaymentModes.length > 0) {
                    masterdataObj.PaymentModes = response.PaymentModes;
                }
                if (response.LeadProblems && response.LeadProblems.length > 0) {
                    masterdataObj.LeadProblems = response.LeadProblems;
                }

                if (response.NewLabTestList && response.NewLabTestList.length > 0) {
                    masterdataObj.masterNewLabTestArray = response.NewLabTestList;
                }

                if (response.CurrentTreatmentList && response.CurrentTreatmentList.length > 0) {
                    masterdataObj.masterCurrentTreatmentArray = response.CurrentTreatmentList;
                }

                if (response.AllergiesList && response.AllergiesList.length > 0) {
                    masterdataObj.masterAllergyArray = response.AllergiesList;
                }
                if (response.SurgeryList && response.SurgeryList.length > 0) {
                    masterdataObj.masterSurgeryArray = response.SurgeryList;
                }
                if (response.BirthHistoryList && response.BirthHistoryList.length > 0) {
                    masterdataObj.masterBirthHistoryArray = response.BirthHistoryList;
                }

                if (response.MedicalHistoryList && response.MedicalHistoryList.length > 0) {
                    masterdataObj.masterMedicalHistoryArray = response.MedicalHistoryList;
                }
                if (response.FamilyHistoryList && response.FamilyHistoryList.length > 0) {
                    masterdataObj.masterFamilyHistoryArray = response.FamilyHistoryList;
                }
                if (response.NutritionalHistoryList && response.NutritionalHistoryList.length > 0) {
                    masterdataObj.masterNutritionalHistoryArray = response.NutritionalHistoryList;
                }
                if (response.ImmunisationHistoryList && response.ImmunisationHistoryList.length > 0) {
                    masterdataObj.masterImmunisationHistoryArray = response.ImmunisationHistoryList;
                }
                if (response.SurgicalHistoryList && response.SurgicalHistoryList.length > 0) {
                    masterdataObj.masterSurgicalHistoryArray = response.SurgicalHistoryList;
                }

                if (response.MenstrualHistoryList && response.MenstrualHistoryList.length > 0) {
                    masterdataObj.masterMenstrualHistoryArray = response.MenstrualHistoryList;
                }
                if (response.LifestyleHistoryList && response.LifestyleHistoryList.length > 0) {
                    masterdataObj.masterLifestyleHistoryArray = response.LifestyleHistoryList;
                }
                if (response.PatientGeneralInstructionList && response.PatientGeneralInstructionList.length > 0) {
                    masterdataObj.masterPatientInstructionsArray = response.PatientGeneralInstructionList;
                }
                if (response.Findings && response.Findings.length > 0) {
                    masterdataObj.masterFindings = response.Findings;

                    angular.forEach(masterdataObj.masterFindings, function (item, index) {
                        item.IsInvestigationChecked = false;
                    });
                }

                if (response.AppointmentStatus.length > 0) {
                    masterdataObj.masterAppointmentStatus = response.AppointmentStatus;
                    angular.forEach(masterdataObj.masterAppointmentStatus, function (item, index) {
                        item.IsChecked = true;
                    });
                }
                if (response.BookingTypes.length > 0) {
                    masterdataObj.masterBookingTypes = response.BookingTypes;
                    angular.forEach(masterdataObj.masterBookingTypes, function (item, index) {
                        item.IsChecked = true;
                    });
                }

                if (response.OperativeNoteAddendumReasons && response.OperativeNoteAddendumReasons.length > 0) {
                    masterdataObj.masterOperativeNoteAddendumReasons = response.OperativeNoteAddendumReasons;
                }

                loginCookieFactory.set("masterDataArrays", masterdataObj);
                $scope.$broadcast("changeBranchAppointments", doctorinfo);

                var Location = eHnoteSettingsDataService.GetLandingScreen(userLoginDetails.RoleID);
                $location.url(Location);

                //$location.url("/OP");
            }
        }).error(function (err) {
            console.log(err);
            alertify.error("Getting Consultation Data Failed");
        });
    };


    $scope.registerLink = function (name) {
        var patientinfo = eHnoteMasterDataService.getNewPatientInfo();
        patientinfo.hasphone = false;
        patientinfo.patType = true;
        patientinfo.firstname = name;
        patientinfo.doctorid = eHnoteMasterDataService.getLoginId();
        eHnoteMasterDataService.Addpatientvalconsult('Start Consultation');
        eHnoteMasterDataService.addNewPatientInfo(patientinfo);
        eHnoteMasterDataService.addAddPatientwithoutConsult(false);
        $scope.SearchBy = '';
        var pageurl = $location.url();
        if (pageurl === '/registerPatient') {
            $scope.patientinfo = eHnoteMasterDataService.getNewPatientInfo();
            $scope.$broadcast('reloadRegister');
        } else {

            $location.url("/registerPatient");
        }
    };





    $scope.showeAdministratorinAppt = false;

    $scope.showDentalTab = false;
    function checkAccessForUser(loginInfo) {

        if (loginInfo.doctordata.User[0].SpecializationId === 2 || loginInfo.doctordata.User[0].SpecializationId === 16) {
            $scope.showOpticalTab = false;
            $scope.showOTTab = false;
        } else {
            //if (loginInfo.doctordata.User[0].SpecializationId === 9) {
            //    $scope.showOTTab = false;

            //} else {
            if (loginInfo.RoleID !== 26) {
                $scope.showOpticalTab = true;
                $scope.showOTTab = true;
            }

            // }

        }








        if (loginInfo.RoleID === 11) {
            $scope.showeOpParamsinAppt = true;
        }
        if (loginInfo.RoleID === 10) {
            $scope.hideAdminTab = true;
            $scope.showstartCnOpparamsinAppt = false;
            $scope.showeOpParamsinAppt = true;

        }
        if (loginInfo.RoleID === 1) {
            $scope.hideAdminTab = true;
            $scope.showstartCnOpparamsinAppt = true;
            $scope.showeOpParamsinAppt = true;
            $scope.showAccounttab = false;


        }
        if (loginInfo.RoleID === 4 || loginInfo.RoleID === 43) {
            $scope.showstartCnOpparamsinAppt = true;
            $scope.showeOpParamsinAppt = true;
            $scope.showPharmacyTab = true;
            $scope.showInventoryTab = true;







        }
        if (loginInfo.RoleID === 2) {
            $scope.hideAdminTab = true;
            $scope.showeOpParamsinAppt = false;
            $scope.showstartCnOpparamsinAppt = false;




        }
        if (loginInfo.RoleID === 14) {
            $scope.hideAdminTab = true;
            $scope.showeOpParamsinAppt = true;
            $scope.showstartCnOpparamsinAppt = true;
        }
        if (loginInfo.RoleID === 15) {
            $scope.showAdminTab = false;
        }
        if (loginInfo.RoleID === 17) {
            $scope.showstartCnOpparamsinAppt = false;
            $scope.showCrmTabNew = true;
        }

        if (loginInfo.RoleID === 22 || loginInfo.RoleID === 23) { //written by  bharath
            $scope.showOTTab = true;
            $scope.showInventoryTab = true;
        }
        if (loginInfo.RoleID === 26) { //written by  bharath
            $scope.showAuditTab = true;
            $scope.showDashboardTab = false;
            $scope.showSettingsTab = false;
            $scope.showOutPatientTab = false;
            $scope.showOTTab = false;
            $scope.showCrmTab = false;
            $scope.showCommunicationTab = false;
            $scope.showReferalTab = false;
            $scope.showAdminTab = false;
            $scope.showAccounttab = false;
            $scope.showPharmacyTab = false;
            $scope.showInventoryTab = false;
            $scope.showOpticalTab = false;
        }

        if (loginInfo.RoleID === 55) {//written by bindu
            $scope.showAuditTab = false;
            $scope.showDashboardTab = false;
            $scope.showSettingsTab = false;
            $scope.showOutPatientTab = true;
            $scope.showOTTab = false;
            $scope.showCrmTabNew = false;
            $scope.showCommunicationTab = false;
            // $scope.showReferalTab = false;
            // $scope.showAdminTab = false;
            $scope.showAccounttab = false;
            $scope.showPharmacyTab = false;
            $scope.showInventoryTab = false;
            $scope.showOpticalTab = false;
            $scope.hideAdminTab = true;
            $scope.showInsuranceTabNew = false;
            $scope.showReferalTabNew = false;
            $scope.showAdminTabNew = false;
        }
        if (loginInfo.RoleID === 20) {
            $scope.showCrmTabNew = true;
            $scope.disableCrmTabNew = false;
            $location.url("/crm");
        }
    }
























    $scope.navToSwitchAnother = function () {

        $rootScope.$broadcast("changeSwitchAnother", doctorinfo);
        $rootScope.showSwitchAnother = true;
        //$rootScope.newAllBranchesData1 = $rootScope.newAllBranchesData;
        $location.url("/login");

    };
    $scope.navToLogout = function () {
        // Going offline has to happen before the session is torn down: it is an
        // authenticated call, and the token lives in the storage cleared below.
        $rootScope.$broadcast('telnyxForceOffline');
        $scope.openPopupCheck = "";

        localStorage.clear();
        sessionStorage.clear();
        datapersistanceFactory.clearAll();
        datapersistanceFactory.set("USerLoginTime", "");
        datapersistanceFactory.set('RefreshToken', "");
        loginCookieFactory.remove('loginData');
        loginCookieFactory.remove('loggedInfo');
        loginCookieFactory.remove('telnyxloggedInfo');
        datapersistanceFactory.set('doctorinfo', {});
        loginCookieFactory.clearAll();
        $rootScope.showMainPageHeader = false;
        $rootScope.patientdetailesConsultation = false;
        $rootScope.patientConsultationScreen = false;
        $rootScope.showSwitchAnother = false;


        angular.element('.modal-dialog').hide();

        angular.element('.inmodal').hide();
        angular.element('.alertify').hide();

        //eHnoteMasterDataService.addSelectedCrmApptDates('');
        //eHnoteMasterDataService.addSelectedOPUsers('');
        //eHnoteMasterDataService.addSelectedCRMApptTabFreeze('');
        //eHnoteMasterDataService.addSelectedCRMWorkDoctors('');
        //eHnoteDiagnosisDataServices.ClearMasterConsultationCache();
        //eHnoteSettingsDataService.ClearMasterClaimCache();
        //localStorage.setItem('forceLogout', Date.now());
        // $location.path("/login");
        $timeout(function () {
            if ($window.location.host == "ioj.ehnote.com") {
                $window.location.href = "https://portal.ehnote.com/#/login";
            } else if ($window.location.host == 'insts.ehnote.com') {
                $window.location.href = "https://stage.ehnote.com/#/login";
            } else {
                $location.path("/login");
            }
        }, 1000);

        eHnoteDiagnosisDataServices.ClearMasteralldropdownvaluesCache();
        eHnoteDiagnosisDataServices.ClearmasterCategorycache();
        eHnoteDiagnosisDataServices.ClearMasterConsultationCache();
        eHnotePatientDataService.clearuserconsultationmastertemplatedtlscache();
        eHnoteDiagnosisDataServices.clearMasterExaminationPossibleDiagnosiscache();
        eHnotePatientAddressDataServices.cleargetCountriescache();
        eHnotePatientAddressDataServices.cleargetStatescache();
        eHnotePatientAddressDataServices.clearMasterHospitalReferenceDatacache();
        eHnotePatientAddressDataServices.clearAllHospitalEquipmentscache();
        eHnoteMainAdminServices.ClearAllWaitingRoomTypecacheCache();
        eHnotePatientAddressDataServices.ClearAllAppointmentTypescacheCache();
        eHnotePatientAddressDataServices.clearAppointmentTypescache();
        eHnoteSettingsDataService.ClearMasterClaimCache();
    };





    $scope.profile = function () {
        $rootScope.showMainPageHeader = true;
        $rootScope.patientdetailesConsultation = false;
        $rootScope.patientConsultationScreen = false;
        //$rootScope.patientAllSearchHeader = false;

        $location.url("/doctorprofile");
    };

    var PatientAppUrl = "https://ehndevpatient.azurewebsites.net";
    $scope.openPatientApp = function (route) {
        var userInfo = eHnoteMasterDataService.getUserInfo();
        var userAddress = (userInfo && userInfo.doctordata && userInfo.doctordata.UserAddress && userInfo.doctordata.UserAddress[0]) || {};
        var subOrgCode = userAddress.SubOrganizationCode || "";
        var hospitalId = (userAddress.ExtDetails && userAddress.ExtDetails.HospitalInfo && userAddress.ExtDetails.HospitalInfo.HospitalID) || 0;
        if (!subOrgCode || !hospitalId) {
            alertify.error("Unable to open patient application");
            return;
        }

        var patientAppWindow = $window.open("", "_blank");

        eHnoteMainAdminServices.GetEncryptedPatientPortalLoginToken(subOrgCode, hospitalId, hospitalId).then(function (response) {
            var token = response.data;
            if (!token || typeof token !== "string") {
                if (patientAppWindow) { patientAppWindow.close(); }
                alertify.error("Unable to open patient application");
                return;
            }
            var targetUrl = PatientAppUrl + "/#!/" + route + "?eh=" + encodeURIComponent(token);
            if (patientAppWindow) {
                patientAppWindow.location.href = targetUrl;
            } else {
                $window.open(targetUrl, "_blank");
            }
        }, function (error) {
            console.error("GetEncryptedPatientPortalLoginToken failed", error);
            if (patientAppWindow) { patientAppWindow.close(); }
            alertify.error("Unable to open patient application");
        });
    };
    $scope.ErrorPermission = false;




    $scope.backToMain = function () {
        $scope.ErrorPermission = false;
    };
    //$scope.appointment = function () {
    //    var loginInfo = eHnoteLoginStatusService.getUserLoginDetails();
    //    // if (loginInfo.RoleID === 12 || loginInfo.RoleID === 13) {
    //    if (loginInfo.RoleID === 12 || loginInfo.RoleID === 13 || loginInfo.RoleID === 14 || loginInfo.RoleID === 7 || loginInfo.RoleID === 20 || loginInfo.RoleID === 21 || loginInfo.RoleID === 22 || loginInfo.RoleID === 23) {
    //        alertify.error("You Dont Have Permission to Access, Please Contact Your  Administrator");
    //        //$scope.ErrorPermission = true;
    //        return false;
    //    }
    //    $rootScope.showMainPageHeader = true;
    //    $rootScope.patientdetailesConsultation = false;
    //    $rootScope.patientConsultationScreen = false;
    //    //$rootScope.patientAllSearchHeader = false;
    //    //var url = "/appointment";

    //    $location.url("/op");
    //};


    $scope.navtoOtherMainTab = function (DefaultTabId) {
        var AdvanceSearch = {
            "IsfromAdvanceSearch": false,
            "Searchtext": '',
            "Type": 1,
        }
        eHnoteMasterDataService.addAdvanceSearch(AdvanceSearch);
        eHnoteMasterDataService.addAdvanceSearchAsc(AdvanceSearch);
        eHnoteMasterDataService.addAdvanceSearchCrm(AdvanceSearch);
        $scope.PatientSearch.SearchText = '';

        if ($rootScope.CurrentUrl === "/dentalConsultation" || $rootScope.CurrentUrl === "/NewOpthaConsultation" || $rootScope.CurrentUrl === "/ApptTeleConsultation") {

            var r = alertify.confirm(
                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Are you sure you want to cancel the consultation , all your unsaved data will be deleted ? </h4>",
                function () {

                    $rootScope.patientdetailesConsultation = false;
                    $rootScope.patientConsultationScreen = false;
                    $rootScope.patientAllSearchHeader = true;
                    var Location = null;
                    if (DefaultTabId === 2) {
                        //$scope.GetSurgeryStatusCount();
                        Location = "/op";
                        $scope.OPTab = "appointments";
                        var Advacnesearchfreez = eHnoteMasterDataService.getaddAdvanceSearch() || '';
                        Advacnesearchfreez.IsfromAdvanceSearch = Advacnesearchfreez.IsfromAdvanceSearch || false;
                        if (Advacnesearchfreez.IsfromAdvanceSearch) {
                            $scope.OPTab = 'advancesearch';
                        }
                    } else if (DefaultTabId === 3) {
                        Location = "/OT";
                        //$scope.OPTab = "preadmission";
                    } else if (DefaultTabId === 4) {
                        //$scope.GetSurgeryStatusCount();
                        eHnoteMasterDataService.addCounsellorPatientId('');
                        //  Location = "/Counsellor";
                        // Location = "/CounsellorList";
                        Location = "/Coordinator";
                    } else if (DefaultTabId === 5) {
                        Location = "/Biller";
                    } else if (DefaultTabId === 6) {
                        eHnoteMasterDataService.AddTypeOfVendor("I");
                        Location = "/Pharmacy";
                    } else if (DefaultTabId === 7) {
                        eHnoteMasterDataService.AddTypeOfVendor("H");
                        Location = "/Inventory";
                    } else if (DefaultTabId === 8) {
                        OpticalUtilites.setOpticalData('');
                        eHnoteMasterDataService.AddTypeOfVendor("O");
                        Location = "/Optical";
                    } else if (DefaultTabId === 9) {
                        Location = "/settings";
                    } else if (DefaultTabId === 10) {
                        Location = "/Communication";
                    } else if (DefaultTabId === 11) {
                        Location = "/Pettycash";
                    } else if (DefaultTabId === 12) {
                        Location = "/audit";
                    } else if (DefaultTabId === 13) {
                        Location = "/admin";
                    } else if (DefaultTabId === 14) {
                        Location = "/crm";
                    } else if (DefaultTabId === 15) {
                        Location = "/Referal";
                    }
                    else if (DefaultTabId === 16) {
                        Location = "/Consent";
                    }
                    else if (DefaultTabId === 17) {
                        Location = "/Biller";
                        //Location = "/newbiller";
                    }
                    else if (DefaultTabId === 18) {
                        Location = "/Logs";
                        //Location = "/newbiller";
                    }
                    else if (DefaultTabId === 19) {
                        Location = "/mips";
                        //Location = "/newbiller";
                    }
                    else if (DefaultTabId === 20) {
                        Location = "/NewBiller";
                        //Location = "/newbiller";
                    }
                    else {
                        Location = "/dashboard";
                    }
                    $location.url(Location);
                }, function () {
                    return false;
                });

        } else {
            $rootScope.patientdetailesConsultation = false;
            $rootScope.patientConsultationScreen = false;
            $rootScope.patientAllSearchHeader = true;
            $rootScope.RegisterPatientScreen = false;
            var Location = null;
            if (DefaultTabId === 2) {
                //$scope.GetSurgeryStatusCount();
                Location = "/op";
                $scope.OPTab = "appointments";
                $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                $scope.cacheStorageItem.subtype = "appointments";
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                //var Advacnesearchfreez = eHnoteMasterDataService.getaddAdvanceSearch() || '';
                //Advacnesearchfreez.IsfromAdvanceSearch = Advacnesearchfreez.IsfromAdvanceSearch || false;
                //if (Advacnesearchfreez.IsfromAdvanceSearch) {
                //    $scope.OPTab = 'advancesearch';
                //}
            } else if (DefaultTabId === 3) {
                Location = "/OT";
                $scope.cacheStorageItem.AppointmentType = '';
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                //$scope.OPTab = "preadmission";
                //var Advacnesearchfreez = eHnoteMasterDataService.getaddAdvanceSearch() || '';
                //Advacnesearchfreez.IsfromAdvanceSearch = Advacnesearchfreez.IsfromAdvanceSearch || false;
                //if (Advacnesearchfreez.IsfromAdvanceSearch) {
                //    $scope.OPTab = 'advancesearch';
                //}
            } else if (DefaultTabId === 4) {
                //$scope.GetSurgeryStatusCount();
                eHnoteMasterDataService.addCounsellorPatientId('');
                //  Location = "/Counsellor";
                // Location = "/CounsellorList";
                Location = "/Coordinator";
            }
            //else if (DefaultTabId === 5) {
            //    Location = "/insurance";
            //}
            else if (DefaultTabId === 5) {
                Location = "/Biller";
            } else if (DefaultTabId === 6) {
                eHnoteMasterDataService.AddTypeOfVendor("I");
                Location = "/Pharmacy";
            } else if (DefaultTabId === 7) {
                eHnoteMasterDataService.AddTypeOfVendor("H");
                Location = "/Inventory";
            } else if (DefaultTabId === 8) {
                OpticalUtilites.setOpticalData('');
                eHnoteMasterDataService.AddTypeOfVendor("O");
                Location = "/Optical";
            } else if (DefaultTabId === 9) {
                Location = "/settings";
            } else if (DefaultTabId === 10) {
                Location = "/Communication";
            } else if (DefaultTabId === 11) {
                Location = "/Pettycash";
            } else if (DefaultTabId === 12) {
                Location = "/audit";
            } else if (DefaultTabId === 13) {
                Location = "/admin";
            } else if (DefaultTabId === 14) {
                Location = "/crm";
            } else if (DefaultTabId === 15) {
                Location = "/Referal";
            }
            else if (DefaultTabId === 16) {
                Location = "/Consent";
            }
            else if (DefaultTabId === 17) {
                Location = "/Biller";
            }
            else if (DefaultTabId === 18) {
                Location = "/Logs";
            }
            else if (DefaultTabId === 19) {
                Location = "/mips";
            }
            else if (DefaultTabId === 20) {
                Location = "/NewBiller";
            }
            else {
                Location = "/dashboard";
            }
            $location.url(Location);
        }
    };




    $rootScope.$on("reloadMainController", function () {
        doctorinfo = eHnoteMasterDataService.getUserInfo();
        userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        if (doctorinfo !== undefined) {
            if (doctorinfo.doctordata.UserAddress !== undefined) {
                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.UserAccessID !== undefined) {
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.UserAccessID.length > 0) {
                        $scope.UserAccessList = doctorinfo.doctordata.UserAddress[0].ExtDetails.UserAccessID;
                        $scope.UserSpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                        $rootScope.ParentSpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                        if ($scope.UserSpecializationId === 3) {
                            $scope.showOTTab = true;
                        }
                    } else {
                        $scope.UserAccessList.push(doctorinfo.doctordata.UserAddress[0].ExtDetails.UserAccessID);
                        $scope.UserSpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                        $rootScope.ParentSpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                        if ($scope.UserSpecializationId === 3) {
                            $scope.showOTTab = true;
                        }
                    }
                }
            }
        }
        $scope.onload();
        $scope.InitializeUser();
    });
    $scope.$on("$locationChangeStart", function (event, newUrl, oldUrl, newState, oldState) {
        oldUrl = oldUrl.split("#")[1];
        newUrl = newUrl.split("#")[1];
        $rootScope.CurrentUrl = newUrl;
        if (newUrl !== "/login") {
            if (oldUrl === "/Pastvisit") {
                $scope.$broadcast("ClearPastVisitCache", {});
            }
            if (oldUrl === "/NewOpthaConsultation") {
                $scope.$broadcast("ClearMainConsultationCache", {});
            }
            if (oldUrl === "/dentalConsultation") {
                $scope.$broadcast("ClearMainConsultationCache", {});
            }
        }

    });


    function onListDocSuccess(data) {
        $scope.hospitalDetails = data;

        $scope.HospitalArray = [];
        angular.forEach($scope.hospitalDetails, function (item, index) {
            $scope.HospitalArray.push(item.HospitalInfo.HospitalDetails);
            $scope.HospitalArray[index].isChecked = true;
        });
        InitializeNewBranches(data);
    }
    function OnListDocFailed(err) {
        console.log(err);
    }
    $scope.$on('LoadHospitalArry', function (event) {


    });

    //Search patient
    function InitialiseSearchParam() {
        $scope.patients = [];
        $scope.morepatientdata = true;
        //prevpagno = 0;
        //pageno = 0;
        $scope.pageno = 1;
    }
    $scope.PatientsearchClick = function (type) {
        $scope.SearchByTextHeader(type);
        $scope.SearchBy = '';
    };
    $scope.SearchByTextHeader = function (type) {
        var name = $scope.SearchBy;
        if (name === undefined || name === '') {
            type = 'click';
        }
        if ((name && name.length >= 3) || type === 'click') {
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
            //clinic = $scope.AppListselectedclinic;
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

                    //list.push(items.HospitalID);
                    list.push(items.BranchId);
                }
            });

            param["HospitalIDLst"] = list;

            var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
            eHnoteMasterDataService.addPatientSearchInfo(param);
            InitialiseSearchParam();
            $scope.morepatientdata = false;
            param.GetAllSpecializationInd = true;
            param.GetAllPatientInd = true;
            if (param.PhoneNumber !== "") {
                var object = {
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "HospitalIDLst": param.HospitalIDLst.toString(),
                    "SearchText": param.SearchText || '',
                    "SearchTypeID": $scope.patSearchType || 0,
                }

                // eHnotePatientDataService.SearchAllPatientNew(param, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);

                eHnotePatientDataService.SearchAllPatientDataNew(object, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);
            } else {
                var object = {
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "HospitalIDLst": param.HospitalIDLst.toString(),
                    "SearchText": param.SearchText || "",
                    "SearchTypeID": $scope.patSearchType || 0,
                }

                // eHnotePatientDataService.SearchAllPatientNew(param, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);

                eHnotePatientDataService.SearchAllPatientDataNew(object, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);
                //eHnotePatientDataService.SearchAllPatientNew(param, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);
            }
        } else {
            $scope.isregisterBtnShowHide = true;
        }
    };
    function OnGetSearchPatientSuccess(data) {
        //var patients = $scope.patients;
        if (data.count > 0) {
            $scope.count = data.count;
            //$scope.ShowAllPatientsValue = false;
            //$scope.ShowAllfilterPatientsValue = false;
            //$scope.currentPage = 1;
            //var patientsdata = data.rows;
            //$scope.totalItems = data.count;
            $scope.patientinitval = {};
            $scope.patientpushval = [];
            $scope.isregisterBtnShowHide = false;
            $scope.isPaientShowHide = true;
            //$scope.patientpushval.length = 0;
            angular.forEach(data.rows, function (item) {
                // $scope.patientinitval.ProfileImg = "";
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var val = array_list[Math.floor(Math.random() * array_list.length)];
                if (item.EmailID !== undefined) {
                    $scope.patientinitval.EmailID = item.EmailID;
                }

                $scope.patientinitval.PatientID = item.PatientId;
                $scope.patientinitval.Title = item.Title;
                /*   $scope.patientinitval.S3URL = item.S3URL || "";*/
                $scope.patientinitval.S3URL = "";
                $scope.patientinitval.FullName = item.FullName;
                $scope.patientinitval.DOB = item.DOB;
                $scope.patientinitval.AgeInYears = item.AgeInYears;
                $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                $scope.patientinitval.AgeInDays = item.AgeInDays;

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
                $scope.patientinitval.OldMrno = item.OldMrno || "";
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
            $scope.patients = $scope.patientpushval;
            if (data.count === 1) {
                var patientitem = $scope.patients[0];
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
                    "OldMrno": patientitem.OldMrno || "",
                    "PatientDisplayId": patientitem.DisplayID ? patientitem.DisplayID : "",
                    "MobileNo": patientitem.PhoneNumber,
                    "ContactNo": patientitem.ContactNo || "",
                    "EmailId": patientitem.EmailID || "",
                    "PatientTypeId": patientitem.PatientTypeId || "",
                    "Age": patientitem.Age,
                    "PatientGSTNO": patientitem.PatientGSTNO,
                    "PhCntryCD": patientitem.CountryCode || ""
                };
                eHnoteMasterDataService.addPatientDetailsforBarcode(item);

                $scope.isregisterBtnShowHide = false;
                $scope.isPaientShowHide = false;

                $location.url("/PatientProfile");
                $scope.$broadcast("formPatientSearch", '');
                $scope.SearchBy = '';
            }
            $scope.noresult = false;
            $scope.showloading = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
            $scope.ShowAllPatientsValue = true;
            $scope.ShowAllfilterPatientsValue = false;
            $scope.isPaientShowHide = false;
            $scope.count = 0;
            $scope.patients = [];
            $scope.totalItems = 0;
            $scope.isregisterBtnShowHide = true;
        }
    }
    function OnGetPatientSearchError() {
        $scope.ShowAllPatientsValue = true;
        $scope.isPaientShowHide = false;
        $scope.ShowAllfilterPatientsValue = false;
        $scope.isPaientShowHide = false;
        $scope.count = 0;
        $scope.patients = [];
        $scope.totalItems = 0;
    }

    /*Patient Seach bar*/


    $scope.PatientSearch = {
        "SearchText": ""
    };
    $scope.PatientsArray = [];
    $scope.ShowPatientListDrop = false;
    $scope.count = 0;
    $scope.FrequentlyAccessedPatientsArray = [];
    $scope.GetPatientVisitHistory = function () {

        let obj = {
            "UserId": eHnoteMasterDataService.getLoginId(),
        }

        eHnoteMainAppointmentService.GetPatientVisitHistory(obj).then(function (response) {

            if (response.data.status === 'Success') {
                $scope.FrequentlyAccessedPatientsArray = [];
                let patientpushval = {};
                if (response.data.rows.length > 0) {
                    angular.forEach(response.data.rows, function (item) {
                        let patientinitval = {};
                        patientinitval.PatientID = item.PatientID;
                        patientinitval.PatientId = item.PatientID;
                        patientinitval.AltCountryCode = item.AltCountryCode || '';
                        patientinitval.DOB = item.DOB;
                        patientinitval.DisplayID = item.DisplayID;
                        patientinitval.EmailID = item.EmailId;
                        patientinitval.FirstName = item.FirstName;
                        patientinitval.FullName = item.FullName;
                        patientinitval.LastName = item.LastName;
                        patientinitval.MiddleName = item.MiddleName;
                        patientinitval.MobileNo = item.MobileNo;
                        patientinitval.OldMrno = item.OldMrno || "";
                        patientinitval.S3URL = item.S3URL || "";
                        patientinitval.SecondLastName = item.SecondLastName;
                        var PhoneNumber = item.MobileNo || 0;
                        if (PhoneNumber.length > 0) {
                            var obj = eHnoteUserDataService.UsMobileFormatChange(PhoneNumber);
                            patientinitval.MobileNo = obj.UsFormatMobileNumber;
                        }
                        //var previouspatval = angular.copy($scope.patientinitval);
                        //$scope.patientpushval.push(previouspatval);
                        $scope.FrequentlyAccessedPatientsArray.push(patientinitval);

                    });
                }
            }
        });
    }
    $scope.PatientsearchTextClick = function (type) {
        $scope.activeIndex = 0;
        $scope.SearchByTextOPHeader(type);
        //$scope.SearchBy = '';
    }
    $scope.ChangePatientSearch = function (type) {
        //if (type == 2) {
        //    var phnnumber = eHnoteUserDataService.UsMobileFormatChange(PatientSearch.SearchText);

        //}
        /*$scope.patSearchType = type || 0;*/
    }
    $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    $scope.SearchByTextOPHeader = function (type) {
        if ($scope.PatientSearch.SearchText != '') {
            $scope.PatientsArray = [];
            var name = $scope.PatientSearch.SearchText;
            //if ($scope.patSearchType == 3) {
            //    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientSearch.SearchText);
            //    $scope.PatientSearch.SearchText= obj.UsFormatMobileNumber;
            //}
            //var FirstName = $scope.PatientSearch.SearchText;
            if (name === undefined || name === '') {
                type = 'click';
            }

            //if ($scope.patSearchType === 5) {
            //    name = name + " 00:00:00";
            //    /* name = $filter('date')(new Date(name), "yyyy-MM-dd");*/
            //    var parsedDate = new Date(name);
            //    if (!isNaN(parsedDate.getTime())) {
            //        name = $filter('date')(parsedDate, "yyyy-MM-dd");
            //    } else {
            //        // Log an error or handle the invalid date case
            //        alertify.error("Invalid date format:", name);
            //        name = "";
            //        // Return false or handle the error in another way
            //        return false;
            //    }
            //}

            if (/^\d{8}$/.test(name)) {

                var month = name.substring(0, 2);
                var day = name.substring(2, 4);
                var year = name.substring(4, 8);

                var formattedDate = year + "-" + month + "-" + day;
                var parsedDate = new Date(formattedDate);

                if (!isNaN(parsedDate.getTime())) {
                    name = formattedDate;
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

                    param.StartDate = name;
                    param.hasparam = true;
                    param.SearchText = "";
                    param.PhoneNumber = "";
                } else {
                    param = {
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
                    param.PhoneNumber = name;
                    param.hasparam = true;
                    param.SearchText = "";
                }
            }



            if (name.includes("/") || name.includes("-")) {
                // Replace '/' with '-' to maintain consistency
                name = name.replace(/\//g, "-");
                // Parse the date
                var parsedDate = new Date(name + " 00:00:00");

                if (!isNaN(parsedDate.getTime())) {
                    // If it's a valid date, format it correctly
                    name = $filter('date')(parsedDate, "yyyy-MM-dd");
                } else {
                    // Handle invalid date input
                    if ($scope.patSearchType === 5) {
                        alertify.error("Invalid date format: " + name);
                        name = "";
                        return false;
                    }
                }
            }


            /*if ((name && name.length >= 3) || type === 'click') {*/
            if (name && name.length >= 1 || $scope.patSearchType !== 1) {
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
                let doctorinfo = eHnoteMasterDataService.getUserInfo();
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
                        "SearchTypeID": $scope.patSearchType || 0,
                        "ParentOrganizationId": $scope.ParenthospitalId
                    }
                    //debugger
                    eHnotePatientDataService.SearchAllPatientDataNew(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, $scope.sendhospcode);
                } else {
                    var object = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": param.SearchText || "",
                        "SearchTypeID": $scope.patSearchType || 0,
                        "ParentOrganizationId": $scope.ParenthospitalId
                    }
                    eHnotePatientDataService.SearchAllPatientDataNew(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, $scope.sendhospcode);
                }
            }
        }

    };
    function OnGetopSearchPatientSuccess(data) {
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
                /*  $scope.patientinitval.S3URL = item.S3URL || "";*/
                $scope.patientinitval.S3URL = "";
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
                $scope.patientinitval.InsuranceDetails = item.InsuranceDetails || [];
                //var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                //$scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                var PhoneNumber = item.PhoneNumber || 0;
                if (PhoneNumber.length > 0) {
                    var obj = eHnoteUserDataService.UsMobileFormatChange(PhoneNumber);
                    $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                }
                var previouspatval = angular.copy($scope.patientinitval);
                $scope.patientpushval.push(previouspatval);
            });
            $scope.PatientsArray = $scope.patientpushval;
            $scope.noresult = false;
            $scope.showloading = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
            $scope.count = 0;
            $scope.PatientsArray = [];
        }
        if ($scope.PatientSearch.SearchText != "") {
            $scope.ShowPatientListDrop = true;
        }
    }
    function OnGetopPatientSearchError() {
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
                    $scope.cacheStorageItem.AppointmentId = resp.data.AppointmentID;
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
                /*eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);*/

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
                $scope.cacheStorageItem.IsfromScreen = '';
                console.log($scope.$route.current.activetab + "__activetab");
                if ($scope.$route.current.activetab == "ot") {
                    $scope.cacheStorageItem.IsfromScreen = "ascprofile";
                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    let screen = 'ASC'
                    var obj = {
                        "Screen": screen,
                    };
                    eHnoteMasterDataService.addSelectedCrmApptDates(obj);
                    var Algobj = {};
                    eHnoteMasterDataService.addAllergiesShownQuickAccess(Algobj);
                    //    $location.url("/ascprofile");
                    $location.url("/profile");
                }
                else if ($scope.$route.current.activetab == 'Biller') {

                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    let screen = 'Biller'
                    var obj = {
                        "Screen": screen,
                    };
                    eHnoteMasterDataService.addSelectedCrmApptDates(obj);
                    $location.url("/profile");
                }
                else if ($scope.$route.current.activetab == 'NewBiller') {

                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    let screen = 'NewBiller'
                    var obj = {
                        "Screen": screen,
                    };
                    eHnoteMasterDataService.addSelectedCrmApptDates(obj);
                    $location.url("/profile");
                }
                else {
                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    $location.url("/profile");
                }
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
                $scope.cacheStorageItem.IsfromScreen = "";

                console.log($scope.$route.current.activetab + "__activetab");
                if ($scope.$route.current.activetab == "ot") {
                    resp.data.AppointmentTypeId = resp.data.AppointmentTypeId || 0;
                    $scope.cacheStorageItem.AppointmentTypeId = resp.data.AppointmentTypeId || 0;
                    $scope.cacheStorageItem.IsfromScreen = "ascprofile";
                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    let screen = 'ASC'
                    var obj = {
                        "Screen": screen,
                    };
                    eHnoteMasterDataService.addSelectedCrmApptDates(obj);
                    //    $location.url("/ascprofile");
                    $location.url("/profile");
                }
                else if ($scope.$route.current.activetab == 'Biller') {

                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    let screen = 'Biller'
                    var obj = {
                        "Screen": screen,
                    };
                    eHnoteMasterDataService.addSelectedCrmApptDates(obj);
                    $location.url("/profile");
                }
                else if ($scope.$route.current.activetab == 'NewBiller') {

                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    let screen = 'NewBiller'
                    var obj = {
                        "Screen": screen,
                    };
                    eHnoteMasterDataService.addSelectedCrmApptDates(obj);
                    $location.url("/profile");
                }
                else {
                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    $location.url("/profile");
                }
            }
        }, function (err) {
            console.log(err);
        });
    }
    $scope.patientsearchlist = {
        templateUrl: 'templates/uibpopups/patientsearchlist.html',
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
    $scope.getPatientCaseHistoryItem = function (patientitem, type) {

        console.log("getPatientCaseHistoryItem called");
        type = type || 0;

        patientitem.PatientID = patientitem.PatientID || 0;
        if (patientitem.PatientID == 0) {
            return false;
        }
        datapersistanceFactory.set('CCDASeletedPatient', "");

        console.log(patientitem);
        console.log("getPatientCaseHistoryItem called");
        eHnoteAuditServices.getParticularPatientDetailsById(patientitem.PatientID, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(response) {
            console.log(response);
            if (type == 1 || type == 2) {
                $scope.AddPatietnDetailsLog(patientitem.PatientID);
            }
            if (response.count > 0) {
                patientitem = response.rows[0];
                patientitem.PatientID = patientitem.PatientId;
                patientitem.OldMrno = response.rows[0].OldMrno;
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
                    "OldMrno": patientitem.OldMrno ? patientitem.OldMrno : "",
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
                let cacheStorageItem1 = eHnoteCacheStorageService.getCacheStorage();
                $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();

                $scope.cacheStorageItem.PatientID = patientitem.PatientID;
                $scope.cacheStorageItem.patientid = patientitem.PatientID;
                $scope.cacheStorageItem.PatientName = patientitem.FullName;
                $scope.cacheStorageItem.EmailID = patientitem.EmailID ? patientitem.EmailID : '';
                $scope.cacheStorageItem.CountryCode = patientitem.CountryCode ? patientitem.CountryCode : '';
                $scope.cacheStorageItem.PhoneNumber = patientitem.PhoneNumber ? patientitem.PhoneNumber : '';
                $scope.cacheStorageItem.appointmentid = 0;
                $scope.cacheStorageItem.AppointmentId = 0;
                $scope.cacheStorageItem.appointmentStatus = "";
                $scope.cacheStorageItem.AppointmentPatientUploads = [];
                $scope.cacheStorageItem.AppointmentType = cacheStorageItem1.AppointmentType || '';
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                $scope.PatientsArray = [];
                $scope.PatientSearch.SearchText = "";

                eHnoteMasterDataService.addPatientDetailsforBarcode(item);


                $scope.CheckPatientAppointmentStatus();
                $scope.GetMedicalHistoriesByPatientId();
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
        /*$scope.editPatientInfoPopup();*/
    }
    $scope.ClosePatientPopUp = function () {
        $scope.ShowNewPatientAdd = false;
        $scope.PatientSearch.SearchText = "";
    }

    /*Patient Seach bar End*/



    $scope.editPatientInfoPopup = function () {
        var Patobj = {
            "Appointmentid": 0,
            "patientid": 0,
            "PatientDisplayID": 0,
            "UserId": 0,
            "Allcountries": [],
            "PatientEthnicityList": [],
            "PatientRaceList": [],
            "PatientLanguageList": [],
            "PatientLanguageExpressionList": [],
            "PatientLanguageProficiencyList": [],
            "PatientSexualOrientationList": [],
            "PatientGenderIdentityList": [],
            "InsuranceStatusList": [],
            "TitlesList": [],
            "IsCoomingFrom": 'AddPatient'
        }
        $scope.EditPopoverInstance = $uibModal.open({
            "templateUrl": "templates/uibpopups/editPatientInfoPopup.html",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "offcanves-right",
            "controller": "EditPatientInfoPopupCtrl",
            "resolve": {
                "Headers": function () { return $scope.Headers; },
                "PatientDetailsInfo": function () { return angular.copy({}); },
                "PatientInsuranceObj": function () { return angular.copy({}); },
                "SaveTypeObj": function () { return angular.copy({}); },
                "Patobj": function () { return angular.copy(Patobj); },
                "DemographicInfo": function () { return angular.copy({}); },
                "FamilyInfo": function () { return angular.copy({}); },
            },
        });
        $scope.EditPopoverInstance.result.then(function (tab) {
            $scope.PatientSearch.SearchText = "";
            $scope.EditPopoverInstance.dismiss("cancel");
        }, function (cancel) {

        });
    };



    $scope.getPatientCaseHistoryItem1 = function (patientitem) {
        $scope.isregisterBtnShowHide = false;




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
                var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                $scope.patients = [];
                $scope.SearchBy = '';

                eHnoteMasterDataService.addPatientDetailsforBarcode(item);

                if ($rootScope.CurrentUrl === "/PatientProfile") {
                    $scope.$broadcast("formPatientSearch", appointmentinfo);
                } else {
                    $location.url("/PatientProfile");
                    $scope.$broadcast("formPatientSearch", appointmentinfo);
                }
                //if ($scope.UserSpecializationId === 2) {

                //    $location.url("/DentalPast");
                //    $scope.$broadcast("formcaseSearch", appointmentinfo);
                //    $scope.$emit("patientInfoDetails", appointmentinfo);
                //}
                //else {
                //    if ($rootScope.CurrentUrl === "/Pastvisit") {
                //        $scope.$broadcast("formcaseSearch", appointmentinfo);
                //        $scope.$emit("patientInfoDetails", appointmentinfo);
                //    } else {

                //        $location.url("/Pastvisit");
                //    }
                //}
            }

        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }


    };

    $scope.checkPercentage = function (e, value) {
        var char = e.key;
        if (parseFloat(value + char) > 100 && e.keyCode !== 8) {
            e.preventDefault();
            return false;
        }
        return true;
    };







    $scope.openReleaseversionPopUp = function () {
        var modalInstance = $uibModal.open({
            "templateUrl": "templates/Releaseversion.html",
            "controller": "EhnoteReleaseversionPopUpCtrl",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false
        });
        modalInstance.result.then(function (selectedItem) {
            /// $rootScope.$broadcast("GetSurgeryData", selectedItem);
        }, function (cancel) {
        });
    };

    var RefreshJWTTimerCall;
    var tick2 = function () {
        $scope.LogintIme = datapersistanceFactory.getItem('USerLoginTime');
        if ($scope.LogintIme.length !== 0) {
            $scope.LogintIme = $scope.LogintIme.replace(/"/g, '');
            $scope.RCurrentDate = $filter("date")(new Date(), "dd/MM/yyyy HH:mm:ss");
            var now = $scope.RCurrentDate;
            var then = $filter("date")(new Date($scope.LogintIme), "dd/MM/yyyy HH:mm:ss");
            var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"));
            var d = moment.duration(ms);
            var h = d.hours();
            //var days = moment(then, "DD/MM/YYYY HH:mm:ss").diff(moment(now, "DD/MM/YYYY HH:mm:ss"), "days");
            var m = d.minutes();
            //var sec = d.seconds();
            //$scope.RegsStartDays = days;
            //$scope.RegsStartHrs = h;
            //$scope.RegsStartMinutes = m;
            //$scope.RegsStartSecs = sec;

            if (m >= SessionTimeOut) {
                // This ends the session inline rather than through navToLogout, so it
                // needs its own word to the calling client - otherwise an expired
                // session keeps ringing until the tab is reloaded.
                $rootScope.$broadcast('telnyxForceOffline');
                $scope.openPopupCheck = "";

                //eHnoteValidateUsersDataService.deleteAllCookies();
                /*   datapersistanceFactory.set("JWTToken", "");*/
                datapersistanceFactory.set("USerLoginTime", "");
                //eHnoteValidateUsersDataService.deleteAllCookies();
                /*  datapersistanceFactory.clearAll();*/
                $rootScope.showMainPageHeader = false;
                $rootScope.patientdetailesConsultation = false;
                $rootScope.patientConsultationScreen = false;
                angular.element('.modal-dialog').hide();
                angular.element('.modal').hide();
                angular.element('.modal-backdrop').hide();
                angular.element('.viewer-backdrop').hide();
                //hide any open bootstrap modals
                angular.element('.inmodal').hide();
                angular.element('.alertify-logs').hide();
                $rootScope.IsValidOAuth = true;
                $rootScope.IsDuplicateLogin = false;
                $location.path("/login");
                window.timeout = setTimeout(function () {
                    angular.element('.alertify-logs').hide();
                }, 100);
                $location.path("/login");
                $interval.cancel(RefreshJWTTimerCall);
                return false;
            }
        } else {
            $scope.navToLogout();   // broadcasts telnyxForceOffline itself
            $interval.cancel(RefreshJWTTimerCall);
        }
    };
    $scope.StartTimmer = function () {
        $interval.cancel(RefreshJWTTimerCall);
        //RefreshJWTTimerCall = $interval(function () {


        //}, 1000);

        tick2();
        RefreshJWTTimerCall = $interval(tick2, 1000);
    };
    $scope.StartTimmer();


    function checkAccessForAdminRole() {

        console.log($scope.UserAccessList);
        angular.forEach($scope.UserAccessList, function (item) {
            if (item.AccessCategoryId === 1 && item.ActiveInd === "Y") {
                $scope.showAdminTabNew = true;
                $scope.disableAdminTabNew = false;
            }
            if (item.AccessCategoryId === 2 && item.ActiveInd === "Y") {
                $scope.showOutPatientTabNew = true;
                $scope.disableOutPatientTabNew = false;
                if ($scope.UserRoleId === 54) {
                    $scope.showInsuranceTabNew = false;
                }
            } else if (item.AccessCategoryId === 2 && item.ActiveInd === "N") {
                if ($scope.UserRoleId === 2 || $scope.UserRoleId === 4 || $scope.UserRoleId === 43 || $scope.UserRoleId === 1 || $scope.UserRoleId === 10 || $scope.UserRoleId === 11) {
                    $scope.showOutPatientTabNew = true;
                    $scope.disableOutPatientTabNew = false;
                }
            }
            if (item.AccessCategoryId === 3 && item.ActiveInd === "Y") {
                $scope.showConsultationTabNew = true;
                $scope.disableConsultationTabNew = false;
            }
            if (item.AccessCategoryId === 4 && item.ActiveInd === "Y") {
                $scope.showPatientTabNew = true;
                $scope.disablePatientTabNew = false;
            }
            if (item.AccessCategoryId === 5 && item.ActiveInd === "Y") {
                $scope.showCommunicationTabNew = true;
                $scope.disableCommunicationTabNew = false;
            }
            if (item.AccessCategoryId === 6 && item.ActiveInd === "Y") {
                $scope.showSettingsTabNew = true;
                $scope.disableSettingsTabNew = false;
            }
            if (item.AccessCategoryId === 7 && item.ActiveInd === "Y") {
                $scope.showDashboardTabNew = true;
                $scope.disableDashboardTabNew = false;
            }
            // if (item.AccessCategoryId === 8 && item.ActiveInd === "Y" && $scope.UserSpecializationId === 2) {
            if (item.AccessCategoryId === 8 && item.ActiveInd === "Y") {
                $scope.showCrmTabNew = true;
                $scope.disableCrmTabNew = false;
            }


            if (item.AccessCategoryId === 9 && item.ActiveInd === "Y" && ($scope.UserSpecializationId === 3 || $scope.UserSpecializationId === 20)) {
                $scope.showOTTabNew = true;
                $scope.disableOTTabNew = false;
            } else if (item.AccessCategoryId === 9 && item.ActiveInd === "N" && $scope.UserSpecializationId === 3 && $scope.UserRoleId === 18) {
                $scope.showOTTabNew = true;
                $scope.disableOTTabNew = true;
            }

            if (item.AccessCategoryId === 9 && item.ActiveInd === "Y" && ($scope.UserSpecializationId === 3 || $scope.UserSpecializationId === 20)) {
                $scope.showCounsellorTabNew = true;
                $scope.disableCounsellorTabNew = false;
            } else if (item.AccessCategoryId === 9 && item.ActiveInd === "N" && $scope.UserSpecializationId === 3 && $scope.UserRoleId === 18) {
                $scope.showCounsellorTabNew = true;
                $scope.disableCounsellorTabNew = true;
            }



            if (item.AccessCategoryId === 10 && item.ActiveInd === "Y") {
                $scope.showPharmacyTabNew = true;
                $scope.disablePharmacyTabNew = false;
            } else if (item.AccessCategoryId === 10 && item.ActiveInd === "N" && ($scope.UserRoleId === 35 || $scope.UserRoleId === 34)) {
                $scope.showPharmacyTabNew = true;
                $scope.disablePharmacyTabNew = true;
            }



            if (item.AccessCategoryId === 11 && item.ActiveInd === "Y" && $scope.UserSpecializationId === 3) {
                $scope.showOpticalTabNew = true;
                $scope.disableOpticalTabNew = false;
            } else if (item.AccessCategoryId === 11 && item.ActiveInd === "N" && ($scope.UserRoleId === 36 || $scope.UserRoleId === 37) && $scope.UserSpecializationId === 3) {
                $scope.showOpticalTabNew = true;
                $scope.disableOpticalTabNew = true;
            }


            if (item.AccessCategoryId === 12 && item.ActiveInd === "Y") {
                $scope.showInventoryTabNew = true;
                $scope.disableInventoryTabNew = false;
            } else if (item.AccessCategoryId === 12 && item.ActiveInd === "N" && ($scope.UserRoleId === 32 || $scope.UserRoleId === 33)) {
                $scope.showInventoryTabNew = true;
                $scope.disableInventoryTabNew = true;
            } else if ($scope.UserRoleId === 2 && $scope.UserSpecializationId === 3) {
                $scope.showInventoryTabNew = true;
                $scope.disableInventoryTabNew = false;
            }




            if (item.AccessCategoryId === 13 && item.ActiveInd === "Y") {
                $scope.showAuditTabNew = true;
                $scope.disableAuditTabNew = false;
            } else if (item.AccessCategoryId === 13 && item.ActiveInd === "N" && $scope.UserRoleId === 26) {
                $scope.showAuditTabNew = true;
                $scope.disableAuditTabNew = true;
            }



            if (item.AccessCategoryId === 14 && item.ActiveInd === "Y") {
                $scope.showReferalTabNew = true;
                $scope.disableReferalTabNew = false;
            }
            if (item.AccessCategoryId === 15 && item.ActiveInd === "Y") {
                $scope.showAccountTabNew = true;
                $scope.disableAccountTabNew = false;
            }

            if (item.AccessCategoryId === 16 && item.ActiveInd === "Y") {
                $scope.showInventoryTabNew = true;
                $scope.disableInventoryTabNew = false;
                //$scope.showInsuranceTabNew = false;
            }

            //if (item.AccessCategoryId === 17 && item.ActiveInd === "Y") {
            //    $scope.showDsipTabNew = true;
            //    $scope.disableDsipTabNew = false;
            //}
            if (item.AccessCategoryId === 18 && item.ActiveInd === "Y") {
                $scope.showOutPatientTabNew = true;
                $scope.disableOutPatientTabNew = false;
                // $scope.showInsuranceTabNew = false;
            }

            if (item.AccessCategoryId === 17 && item.ActiveInd === "Y") {
                $scope.showInsuranceTabNew = true;
            }

        });
    }

    function openFullscreen(elem) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }



    function closeFullscreen(document) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }

    $scope.queueObj = {
        "showSingleDoctorQueueList": false,
        "showMultipleDoctorQueueList": false
    }
    $scope.showfullScreenMode = function () {

        $scope.queueObj.showSingleDoctorQueueList = true;
        $scope.queueObj.showMultipleDoctorQueueList = false;
        var elem = document.getElementById("elementSingleDoctor");
        openFullscreen(elem)


    };

    $scope.closeSingleDoctorQueue = function () {

        var elem = document.getElementById("elementSingleDoctor");

        closeFullscreen(elem);
        $scope.queueObj.showSingleDoctorQueueList = false;
    };

    $scope.showfullScreenModeMulti = function () {
        $scope.queueObj.showSingleDoctorQueueList = false;
        $scope.queueObj.showMultipleDoctorQueueList = true;
        var elem = document.getElementById("elementMultipleDoctor");
        openFullscreen(elem)
    };

    $scope.closeMultipleDoctorQueue = function () {

        var elem = document.getElementById("elementMultipleDoctor");

        closeFullscreen(elem);
        $scope.queueObj.showMultipleDoctorQueueList = false;
    };

    //$scope.loadJsexternal = function (FILE_URL, async) {
    //        let scriptEle = document.createElement("script");
    //    scriptEle.setAttribute("src", "https://ehnotehrstage.azurewebsites.net/js/controllers/UsDayDoctorTimeLineFullCalendarCtl.acff50d9e9b432eb2f340247c1fb076b.js");
    //        scriptEle.setAttribute("type", "text/javascript");
    //        scriptEle.setAttribute("async", true);
    //        document.body.appendChild(scriptEle);
    //        // success event 
    //        scriptEle.addEventListener("load", () => {
    //            console.log("File loaded")
    //        });
    //        // error event
    //        scriptEle.addEventListener("error", (ev) => {
    //            console.log("Error on loading file", ev);
    //        });
    //};
    $scope.languageObj = {
        "selectedLang": "en"
    };

    $scope.languageObj.selectedLang = datapersistanceFactory.getItem("SelectedLanguageKey");

    $scope.activeLanguageChange = function (langKey) {
        console.log(langKey);

        $scope.languageObj.selectedLang = langKey;
        $translate.use(langKey);
        datapersistanceFactory.set("SelectedLanguageKey", langKey);
    };

    /* $scope.activeLanguageChange('en');*/

    $scope.clearPatientSearchData = function () {
        $scope.ShowPatientListDrop = false;
        $scope.PatientSearch.SearchText = "";
    };

    $scope.$watch("PatientSearch.SearchText", function (newVal, oldVal) {
        if ($scope.PatientSearch.SearchText == "") {
            $scope.ShowPatientListDrop = false;
        }
    });

    $scope.ClickOPPatientSearchIcon = function (type) {

        //if ($scope.PatientSearch.SearchText != '') {
        //    var specialcharaters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.`~<>\/?]/;
        //    if (specialcharaters.test($scope.PatientSearch.SearchText)) {
        //        $scope.PatientSearch.SearchText = $scope.PatientSearch.SearchText.replace(/[^\w\s]/gi, '');
        //        $scope.PatientSearch.SearchText = $scope.PatientSearch.SearchText.replace(/_/g, '');
        //        alertify.error("Special Characters are not allowed. Please check");
        //        return false;
        //    }
        //}

        $scope.SearchByTextOPHeader(type);


    }
    var EmergencyAccessSetObj = datapersistanceFactory.getItem("EmergencyAccessSetObj") || [];
    //console.log(EmergencyAccessSetObj);
    var TodayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    if (TodayDate == EmergencyAccessSetObj.EmergencyAccessRightsDate) {

        $timeout(function () {
            $scope.AlertFiveminBeforeLose();
        }, EmergencyAccessSetObj.AlertForExpiredEmergencyAccessRightsTime);

        $timeout(function () {
            $scope.ExpiredEmergencyAccessRights();
        }, EmergencyAccessSetObj.AlertforEmergencyAccessRightsLogOutTime);

        $timeout(function () {
            $scope.navToLogout();
        }, EmergencyAccessSetObj.ExpiredEmergencyAccessRightsTime);
    }

    $scope.AlertFiveminBeforeLose = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "EmergencyAccessRightsPopUp.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": 'md',
            "windowClass": "",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };
    $scope.ExpiredEmergencyAccessRights = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "EmergencyAccessRightsLogOutPopUp.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": 'md',
            "windowClass": "",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }




    $scope.totalnotificationCount = 0;
    $scope.showDropdown = false;
    $scope.notifications = [];

    //$scope.updateNotificationCount = function (count) {
    //    $scope.notificationCount = count;
    //};

    $scope.toggleDropdown = function () {
        $scope.showDropdown = !$scope.showDropdown;
    };



    $scope.notificationArray = [];


    //$scope.RcopiaLocalPrescribeObj = {
    //    "PortalSystemName": "avendor29058",
    //    "PracticeUserName": "fo1650",
    //    "RcopiaUserId": "ksuggs",
    //    "UserExternalId": "provider1_fo1650",
    //    "Service": "rcopia",
    //    "Action": "login",
    //    "StartUpScreen": "message",
    //    "RcopiaPatientId": "",
    //    "RcopiaPatientName": "",
    //    "RcopiaPatientExternalId": "",
    //    "Time": "",
    //    "SecretKey": "ugwj2iaz",
    //    "MAC": "",
    //    "limpmode": "n"
    //};

    $scope.RcopiaLocalPrescribeObj = {
        "PortalSystemName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
        "PracticeUserName": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
        "RcopiaUserId": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
        "UserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
        "Service": "rcopia",
        "Action": "login",
        "StartUpScreen": "message",
        "RcopiaPatientId": "",
        "RcopiaPatientName": "",
        "RcopiaPatientExternalId": "",
        "Time": "",
        "SecretKey": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
        "MAC": "",
        "limpmode": "n"
    };

    var hex_chr = "0123456789abcdef";
    function rhex(num) {
        var str = "";
        for (var j = 0; j <= 3; j++)
            str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
                hex_chr.charAt((num >> (j * 8)) & 0x0F);
        return str;
    }

    function str2blks_MD5(str) {
        var nblk = ((str.length + 8) >> 6) + 1;
        var blks = new Array(nblk * 16);
        for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
        for (i = 0; i < str.length; i++)
            blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
        blks[i >> 2] |= 0x80 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = str.length * 8;
        return blks;
    }
    function add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function cmn(q, a, b, x, s, t) {
        return add(rol(add(add(a, q), add(x, t)), s), b);
    }
    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    function gmtTime() {

        var GMTTime = new Date();
        var month = GMTTime.getUTCMonth() + 1;
        var day = GMTTime.getUTCDate();
        var year = GMTTime.getUTCFullYear() - 2000;
        var hour = GMTTime.getUTCHours();
        var min = GMTTime.getUTCMinutes();
        var sec = GMTTime.getUTCSeconds();

        if (month < 10) { month = "0" + month; }
        if (day < 10) { day = "0" + day; }
        if (hour < 10) { hour = "0" + hour; }
        if (hour < 1) { hour = "00"; }
        if (min < 10) { min = "0" + min; }
        if (min < 1) { min = "00"; }
        if (sec < 10) { sec = "0" + sec; }
        if (sec < 1) { sec = "00"; }

        var GMTime = month.toString() + day.toString() + year.toString() + hour.toString() + min.toString() + sec.toString();
        return GMTime;
    }
    function calcMD5(str) {
        var x = str2blks_MD5(str);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = ff(c, d, a, b, x[i + 10], 17, -42063);
            b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = hh(a, b, c, d, x[i + 5], 4, -378558);
            d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = add(a, olda);
            b = add(b, oldb);
            c = add(c, oldc);
            d = add(d, oldd);
        }

        var finalstring = rhex(a) + rhex(b) + rhex(c) + rhex(d);
        var capitalFinalString = angular.uppercase(finalstring);
        return capitalFinalString;
    }

    $scope.navToRcopiaSSO = function (obj) {

        console.log(obj);

        //if (obj.NotificationName == 'refill') {
        //    $scope.RcopiaLocalPrescribeObj.StartUpScreen = "message";
        //} else {
        //    $scope.RcopiaLocalPrescribeObj.StartUpScreen = "report";

        //}

        if (obj == 'Refill') {
            $scope.RcopiaLocalPrescribeObj.StartUpScreen = "message";
        } else {
            $scope.RcopiaLocalPrescribeObj.StartUpScreen = "report";

        }

        var serviceUrl = "https://web.staging.drfirst.com/sso/portalServices?";

        if (CurrentEnvironment == 'https://portal.ehnote.com') {
            var serviceUrl = "https://web3.drfirst.com/sso/portalServices?";
        }

        //$scope.RcopiaLocalPrescribeObj.RcopiaPatientId = "27160537858";
        $scope.RcopiaLocalPrescribeObj.limpmode = "y";

        $scope.RcopiaLocalPrescribeObj.Time = gmtTime();

        var subUrl = "rcopia_portal_system_name=" + $scope.RcopiaLocalPrescribeObj.PortalSystemName + "&rcopia_practice_user_name=" + $scope.RcopiaLocalPrescribeObj.PracticeUserName + "&rcopia_user_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaUserId + "&rcopia_user_external_id=" + $scope.RcopiaLocalPrescribeObj.UserExternalId + "&service=" + $scope.RcopiaLocalPrescribeObj.Service + "&action=" + $scope.RcopiaLocalPrescribeObj.Action + "&startup_screen=" + $scope.RcopiaLocalPrescribeObj.StartUpScreen + "&rcopia_patient_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientId + "&rcopia_patient_external_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientExternalId + "&limp_mode=" + $scope.RcopiaLocalPrescribeObj.limpmode + "&time=" + $scope.RcopiaLocalPrescribeObj.Time + $scope.RcopiaLocalPrescribeObj.SecretKey;




        $scope.RcopiaLocalPrescribeObj.MAC = "";
        $scope.RcopiaLocalPrescribeObj.MAC = calcMD5(subUrl);



        var MainUrl = serviceUrl + "rcopia_portal_system_name=" + $scope.RcopiaLocalPrescribeObj.PortalSystemName + "&rcopia_practice_user_name=" + $scope.RcopiaLocalPrescribeObj.PracticeUserName + "&rcopia_user_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaUserId + "&rcopia_user_external_id=" + $scope.RcopiaLocalPrescribeObj.UserExternalId + "&service=" + $scope.RcopiaLocalPrescribeObj.Service + "&action=" + $scope.RcopiaLocalPrescribeObj.Action + "&startup_screen=" + $scope.RcopiaLocalPrescribeObj.StartUpScreen + "&rcopia_patient_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientId + "&rcopia_patient_external_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientExternalId + "&limp_mode=" + $scope.RcopiaLocalPrescribeObj.limpmode + "&time=" + $scope.RcopiaLocalPrescribeObj.Time + "&MAC=" + $scope.RcopiaLocalPrescribeObj.MAC;


        console.log(JSON.stringify(MainUrl));


        $scope.mainIframeSrcUrl = MainUrl;




        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/medicalrxRcopia.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "resolve": {
                "mainIframeSrcUrl": function () { return $scope.mainIframeSrcUrl; },
            },
            "windowClass": "modal__sixty--",
            "controller": function ($scope, $uibModal, $uibModalInstance, $sce, eHnotePatientPVService, mainIframeSrcUrl) {


                console.log(mainIframeSrcUrl);

                $scope.mainIframeSrcUrl = $sce.trustAsResourceUrl(mainIframeSrcUrl);

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.medicalrxrcopiasuibclose = function () {
                    var responsedata = {
                        "status": ""
                    };
                    $uibModalInstance.close(responsedata);
                    //  $uibModalInstance.dismiss("cancel");

                };

                $scope.medicalrxsuibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                $scope.savePrescription = function () {
                    var responsedata = {
                        "status": "Success"
                    };
                    $uibModalInstance.close(responsedata);
                };

            }
        });

        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);
            if (resp.status === "Success") {

                //$scope.getMedicationsFromRcopia();
                $scope.getOrganizationRcopiaNotificationsDetails
            } else {
                $scope.getOrganizationRcopiaNotificationsDetails
            }

        }, function (cancel) {
        });


        $scope.showDropdown = !$scope.showDropdown;
    }

    $scope.ClickOverallAdvancePatientSearchIcon = function (tabno) {
        $scope.OPTab = tabno;
        if (tabno == 'advancesearch') {
            $scope.PatientSearch.patSearchType = $scope.patSearchType || 0;
            var AdvanceSearch = {
                "IsfromAdvanceSearch": true,
                "Searchtext": $scope.PatientSearch.SearchText || '',
                "Type": $scope.patSearchType || 1,
            }
            //    eHnoteMasterDataService.addAdvanceSearch(AdvanceSearch);
        } else {
            var AdvanceSearch = {
                "IsfromAdvanceSearch": false,
                "Searchtext": '',
                "Type": 1,
            }
            if ($rootScope.CurrentUrl == '/op') {
                eHnoteMasterDataService.addAdvanceSearch(AdvanceSearch);
            } else if ($rootScope.CurrentUrl == '/OT') {
                eHnoteMasterDataService.addAdvanceSearchAsc(AdvanceSearch);
            } else if ($rootScope.CurrentUrl == "/crm") {
                eHnoteMasterDataService.addAdvanceSearchCrm(AdvanceSearch);
            }
        }
        $scope.$broadcast('OptTabActive', { "response": $scope.OPTab, "Patient": $scope.PatientSearch });
        $scope.$broadcast('CrmTabActive', { "response": $scope.OPTab, "Patient": $scope.PatientSearch });
        $scope.ShowPatientListDrop = false;
        $scope.PatientSearch.SearchText = '';
    }

    $scope.GetMedicalHistoriesByPatientId = function () {
        eHnotePatientDataService.GetMedicalHistoriesByPatientId($scope.cacheStorageItem.PatientID).then(function (resp) {
            if (resp.data != undefined) {
                $scope.AllergyArray = resp.data.rows[0].Allergy || [];
                if ($scope.AllergyArray.length > 0) {
                    let allergies = $scope.AllergyArray || [];
                    eHnoteMasterDataService.addAllergiesShownQuickAccess(allergies);
                } else {
                    var Algobj = {};
                    eHnoteMasterDataService.addAllergiesShownQuickAccess(Algobj);
                }
            }
        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
        });
    }
    $scope.getPatienNotificationDetails = function () {


        var DoctoriID = eHnoteMasterDataService.getLoginId();

        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(), /*3*/
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID, /* 3*/
            "PatientId": "",
            "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
            "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
            "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
            "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
            "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
            "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
            "RequestType": "all",
            "ReturnPrescriptionIDs": "y",
            "ReturnRefillIDs": "y",
            "ReturnRxChangeIDs": "n",
            "NotificationLevel": "practice"
        };

        /*params.NotificationLevel = "provider";*/ //if we need to call notification at provider level use this
        /* params.RequestType = "rx_pending,refill,rxchange,rx_need_signing";*/
        /* params.RequestType = "rx_pending,refill,rxchange";*/
        params.RequestType = "rx_pending,rx_orders_pending,refill";

        if (DoctoriID === 1604) {

        } else {
            return false;
        }

        eHnoteDiagnosisDataServices.getPatientRcopiaNotificationsCount(params).then(function (response) {

            console.log(JSON.stringify(response));
            response = response || "";
            if (response != "") {
                response.NotificationsList = response.NotificationsList || [];
                if (response.NotificationsList.length > 0) {
                    $scope.notificationArray = [];
                    $scope.totalnotificationCount = 0;
                    var obj = {
                        "NotificationCount": 0,
                        "NotificationName": 0
                    }
                    angular.forEach(response.NotificationsList, function (nitem) {
                        if (nitem.Count > 0) {


                            $scope.totalnotificationCount += parseFloat(nitem.Count) || 0;
                            var obj = {
                                "NotificationCount": nitem.Count,
                                "NotificationName": nitem.Type
                            }
                            $scope.notificationArray.push(obj)
                        }
                    });
                }
            }
        });
    }
    $scope.$on("Crmmaintab", function (event, data) {
        data = data || '';
        if (data != '') {

            $scope.CRMTab = data;
        } else {
            $scope.CRMTab = '';
        }

    });

    //Hard Reload

    $scope.clearCacheAndReload = function () {
        try {
            // Clear AngularJS template cache
            $templateCache.removeAll();

            // Clear Local Storage
            localStorage.clear();
            sessionStorage.clear();

            // Hard reload (forcing browser to load fresh resources)
            $window.location.reload(true);
        } catch (e) {
            console.error("Error clearing cache:", e);
        }
    };



    $scope.$on("OnClickEhnoteInASC", function (event, data) {
        var Advacnesearchfreez = eHnoteMasterDataService.getaddAdvanceSearchAsc() || '';
        Advacnesearchfreez.IsfromAdvanceSearch = Advacnesearchfreez.IsfromAdvanceSearch || false;
        if (data == 4) {
            /* "ASC List" and "Laser" are the same asclist screen, the persisted ASC module
               says which of the two is the active top navigation item. */
            $scope.OPTab = (eHnoteMasterDataService.getAscModuleType() === "Laser") ? "laser" : "asclist";

            if (Advacnesearchfreez.IsfromAdvanceSearch) {
                $scope.OPTab = 'advancesearch';
            }
        } else if (data == 8) {
            $scope.OPTab = "preauth";
        } else if (data == 9) {
            $scope.OPTab = "audit";
        } else if (data == 10) {
            $scope.OPTab = "dashboard";
        }
        else {
            $scope.OPTab = "preadmission";
            if (Advacnesearchfreez.IsfromAdvanceSearch) {
                $scope.OPTab = 'advancesearch';
            }
        }
    });



    //$scope.getPatienNotificationDetails();

    $scope.ASCChartingPopup = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/ASCChartingPopup.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "modal__popup--1 bottom-to-top-modal",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };

    $scope.FetchUnreadRowsAndMarkAsRead = function () {
        var params = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": eHnoteMasterDataService.getLoginId()
        }
        eHnoteDiagnosisDataServices.FetchUnreadRowsAndMarkAsRead(params).then(function (response) {
            console.log(response.data)
            if (response.data.Status == "Success") {
                $scope.FaxNotificationObj.TotalCount = response.data.Count;
            }
        });
    };
    $scope.FetchUnreadRowsAndMarkAsRead();


    $scope.activeIndex = 0;
    $scope.PatientsArray = [];

    $scope.scrollToActiveItem = function () {
        var container = document.querySelector('.overflow-y-auto.slim-scroll');
        if (!container) return;

        var items = container.querySelectorAll('ul.list__unstyled-- li');
        if ($scope.activeIndex >= items.length) return;

        var activeItem = items[$scope.activeIndex];
        if (!activeItem) return;

        container.scrollTop = activeItem.offsetTop;
    };


    $scope.onInputKeydown = function (event) {
        const len = $scope.PatientsArray.length;
        switch (event.key) {
            case 'ArrowDown':
                if ($scope.activeIndex < len - 1) {
                    $scope.activeIndex++;
                    $scope.scrollToActiveItem();
                }
                event.preventDefault();
                break;
            case 'ArrowUp':
                if ($scope.activeIndex > 0) {
                    $scope.activeIndex--;
                    $scope.scrollToActiveItem();
                }
                event.preventDefault();
                break;
            case 'Enter':
                const item = $scope.PatientsArray[$scope.activeIndex];
                if (item) $scope.getPatientCaseHistoryItem(item, 1);
                event.preventDefault();
                break;
        }
    };


    $scope.$on("telnyxOpenPatient", function (evt, patient) {

        console.log("call initiated from telynx service");
        console.log(patient);
        $scope.getPatientCaseHistoryItem(patient, 1);   // your existing fn, navigates to /profile
    });


    var telnyxClient = null;
    $scope.activeCall = null;
    $scope.incomingCall = null;
    $scope.telynxincomingcallPatients = [];
    $scope.getWebEtcCredentialsById = function () {


        var params = { "UserId": eHnoteMasterDataService.getLoginId(), "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID, "RoleId": $scope.UserRoleId };


        if (params.OrganizationId != 3) {
            return;
        }
        if (params.UserId != 3) {
            return;
        }
        eHnoteMainAppointmentService.getWebRtcCredentialsdetails(params).then(function (response) {
            var res = response.data;
            console.log(JSON.stringify(res));

            if (res.Status !== "Success") {
                console.error("WebRTC creds failed:", res.Message);
                return;
            }

            // connect the WebRTC client with the connection credential
            telnyxClient = new TelnyxWebRTC.TelnyxRTC({
                login: res.SipUsername,
                password: res.SipPassword
            });

            // incoming call + state events (wrapped in $timeout for Angular digest)
            telnyxClient.on('telnyx.notification', function (notification) {
                $timeout(function () {
                    if (notification.type === 'callUpdate' && notification.call) {
                        handleCallUpdate(notification.call);
                    }
                });
            });

            telnyxClient.on('telnyx.ready', function () {
                console.log('Telnyx WebRTC ready & registered');
            });

            telnyxClient.on('telnyx.error', function (e) {
                console.error('Telnyx error', e);
            });

            telnyxClient.connect();
        });
    };





    var callTimerInterval = null;
    var callStartTime = null;

    function startCallTimer() {
        callStartTime = Date.now();
        $scope.callDuration = '00:00';
        callTimerInterval = setInterval(function () {
            var elapsed = Math.floor((Date.now() - callStartTime) / 1000);
            var mins = Math.floor(elapsed / 60);
            var secs = elapsed % 60;
            $scope.$applyAsync(function () {
                $scope.callDuration = ('0' + mins).slice(-2) + ':' + ('0' + secs).slice(-2);
            });
        }, 1000);
    }

    function stopCallTimer() {
        if (callTimerInterval) { clearInterval(callTimerInterval); callTimerInterval = null; }
        $scope.callDuration = '00:00';
    }

    function handleCallUpdate(call) {
        $scope.activeCall = call;
        console.log(call);




        switch (call.state) {
            case 'ringing':
                var raw = call.options.remoteCallerNumber;
                var normalized = normalizePhone(raw);   // "2143260713"

                $scope.incomingCall = {
                    "call": null,
                    "number": null,
                    "rawNumber": null,
                    "patients": [],
                    "loading": true,
                    "matchType": ""
                };

                $scope.incomingCall.call = call;
                $scope.incomingCall.number = formatPhoneDisplay(raw);
                $scope.incomingCall.rawNumber = raw;
                $scope.incomingCall.patients = [];
                $scope.incomingCall.loading = true;
                $scope.incomingCall.matchType = "";


                console.log('Incoming call from', $scope.incomingCall.number);

                var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
                $scope.listval = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
                console.log($scope.listval);
                var requestparams = {
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "HospitalIDLst": $scope.HospitalIDSList,
                    "ParentOrganizationId": $scope.ParenthospitalId,
                    "MobileNumber": normalized,
                    "PageSize": 5,
                    "PageNumber": 1
                };


                eHnoteMainAppointmentService.GetPatientsDataByPhoneNumber(requestparams).then(function (resp) {

                    console.log(resp.data);
                    var patients = resp.data.rows || [];
                    $scope.telynxincomingcallPatients = resp.data.rows || [];
                    angular.forEach($scope.telynxincomingcallPatients, function (pitem) {
                        pitem.PatientID = pitem.PatientId;
                    });
                    $timeout(function () {
                        if (!$scope.incomingCall) return;   // call may have ended
                        $scope.incomingCall.loading = false;
                        $scope.incomingCall.patients = patients || [];
                        $scope.incomingCall.matchType = "";
                        if (patients.length === 0) {
                            $scope.incomingCall.matchType = "unknown";
                        } else if (patients.length === 1) {
                            $scope.incomingCall.matchType = "single";
                        }
                        else {
                            $scope.incomingCall.matchType = "multiple";
                        }

                    });
                });
                break;

            case 'active':
                var callData = $scope.incomingCall;
                $scope.activeCallNumber = formatPhoneDisplay(call.options.remoteCallerNumber);

                console.log(callData);
                if (callData) {
                    console.log($scope.telynxincomingcallPatients);
                    if ($scope.telynxincomingcallPatients.length === 1) {
                        $scope.onCallPatient = $scope.telynxincomingcallPatients[0];

                        console.log($scope.onCallPatient);
                        $scope.getPatientCaseHistoryItem($scope.onCallPatient, 1);
                    } else if ($scope.telynxincomingcallPatients.length > 1 && callData.selectedPatient) {
                        console.log(callData.selectedPatient);
                        $scope.onCallPatient = callData.selectedPatient;
                        console.log($scope.onCallPatient);
                        $scope.getPatientCaseHistoryItem($scope.onCallPatient, 1);
                    } else {
                        $scope.onCallPatient = null;
                    }
                }


                if (!callData || ($scope.telynxincomingcallPatients && $scope.telynxincomingcallPatients.length <= 1) || $scope.telynxincomingcallPatients) {
                    $scope.incomingCall = null;
                }

                startCallTimer();
                console.log('Call answered');
                break;

            case 'hangup':
            case 'destroy':
                $scope.incomingCall = null;
                $scope.activeCall = null;
                $scope.onCallPatient = null;

                $scope.telynxincomingcallPatients = [];
                stopCallTimer();    // stop + reset the timer
                console.log('Call ended');
                break;
        }
    }
    function normalizePhone(num) {
        if (!num) return '';
        var digits = num.replace(/\D/g, '');      // remove +, (, ), -, spaces
        return digits.slice(-10);                  // last 10 digits
    }
    function formatPhoneDisplay(num) {
        var d = normalizePhone(num);
        if (d.length === 10) return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
        return num;
    }

    $scope.answerCall = function () {
        if ($scope.activeCall) $scope.activeCall.answer();
    };

    $scope.hangupCall = function () {
        if ($scope.activeCall) $scope.activeCall.hangup();
    };
    $scope.selectcallingPatient = function (p) {
        $scope.incomingCall.selectedPatientId = p.PatientID;
        $scope.incomingCall.selectedPatient = p;
    };


    // $scope.getWebEtcCredentialsById();

}]);

function Capitalize(string) {
    var word = "";
    for (var z = 0; z < string.length; z++) {
        if (z === 0) {
            word += string[z].toUpperCase();
        } else {
            word += string[z];
        }
    }
    return word;
}
function GetHours(time) {
    var hh = "00";
    if (time.indexOf(":") !== -1) {
        var hrmm = time.split(":");
        hh = hrmm[0];
    } else {
        hh = time.substring(0, 2);
    }
    return hh;
}
function GetMins(time) {
    var mm = "00";
    if (time.indexOf(":") !== -1) {
        var hrmm = time.split(":");
        mm = hrmm[1];
    } else {
        mm = time.substring(2, 4);
    }
    return mm;
}
function GetDay(daycd) {
    switch (daycd) {
        case "MON":
            return "Monday";
        case "TUE":
            return "Tuesday";
        case "WED":
            return "Wednesday";
        case "THU":
            return "Thursday";
        case "FRI":
            return "Friday";
        case "SAT":
            return "Saturday";
        case "SUN":
            return "Sunday";
    }
}
function GetAge(dob) {
    var ageDifMs = Date.now() - new Date(dob).getTime();
    var ageDate = new Date(ageDifMs);
    var age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (isNaN(age))
        age = 0;
    return age;
}
function InitializeCacheStorage(eHnoteCacheStorageService, datapersistanceFactory) {

    var cacheStorageItem = angular.copy(eHnoteCacheStorageService.getCacheStorageStructure());
    eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    eHnoteCacheStorageService.getCacheStorage();
}
function setCacheStorage(patientinfo, datapersistanceFactory, eHnoteCacheStorageService, eHnoteMasterDataService) {


    InitializeCacheStorage(eHnoteCacheStorageService, datapersistanceFactory);
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    appointmentinfo.Patient = patientinfo.Patient;
    appointmentinfo.PatientEmail = patientinfo.PatientEmail;
    appointmentinfo.PatientPhone = patientinfo.PatientPhone;
    appointmentinfo.PatientAddress = patientinfo.PatientAddress;
    //appointmentinfo.PatientID = patientinfo.Patient[0].PatientID;
    // appointmentinfo.PatientDetails.Patient = patientinfo.Patient;
    // appointmentinfo.PatientDetails.PatientAddress = patientinfo.PatientAddress;
    // appointmentinfo.PatientDetails.PatientPhone = patientinfo.PatientPhone;
    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
    var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    cacheStorageItem.patientid = patientinfo.Patient[0].PatientID;
    cacheStorageItem.PatientID = patientinfo.Patient[0].PatientID;
    cacheStorageItem.PatientName = patientinfo.Patient[0].FullName;
    cacheStorageItem.Patient = patientinfo.Patient;
    cacheStorageItem.PatientEmail = patientinfo.PatientEmail;
    cacheStorageItem.PatientPhone = patientinfo.PatientPhone;
    cacheStorageItem.doctorid = eHnoteMasterDataService.getDoctorId();
    eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
}
function GetImage(serverImage) {
    if (serverImage.length !== 0) {
        if (serverImage !== null && serverImage.substring(0, 5).toLowerCase() === "some(") {
            serverImage = serverImage.substring(5);
            serverImage = serverImage.substring(0, serverImage.length - 1);
            return serverImage;
        }
    }
    //if (serverImage !== null && serverImage.substring(0, 5).toLowerCase() === "some(") {
    //    serverImage = serverImage.substring(5);
    //    serverImage = serverImage.substring(0, serverImage.length - 1);
    //    return serverImage;
    //}
    return "";
}
function validate(key) {
    var keycode = (key.which) ? key.which : key.keyCode;
    if (!(keycode === 8 || keycode === 46) && (keycode < 48 || keycode > 57)) {
        return false;
    }
}
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}



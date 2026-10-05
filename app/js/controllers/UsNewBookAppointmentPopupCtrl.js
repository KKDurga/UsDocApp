"use strict";
eHnoteWebApp.controller("UsNewBookAppointmentPopupCtrl", ["$scope", "$log", "$timeout", 'eHnoteMasterDataService', 'eHnoteLoginStatusService', 'eHnotePatientDataService', 'eHnoteOrgReferralDataServices', 'eHnotePatientAddressDataServices', '$filter', 'eHnoteUserAppointmentDataService', 'alertify', 'eHnoteCacheStorageService', 'eHnotePatientVisitReasonServices', '$location', "$rootScope", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "eHnoteAuditServices", "localStorageFactory", "eHnoteDbStaticDataService", "eHnoteMainAppointmentService", "eHnoteInsuranceService", "eHnotePrintService", "eHnoteUserDataService", "eHnoteSettingsDataService", "$uibModal", "eHnoteLabService", "eHnoteMainAdminServices", "eHnoteSurgeryService", "$uibModalInstance", "allUserList", "openBookAppt", "$q", "eHnoteReferalDataService", function ($scope, $log, $timeout, eHnoteMasterDataService, eHnoteLoginStatusService, eHnotePatientDataService, eHnoteOrgReferralDataServices, eHnotePatientAddressDataServices, $filter, eHnoteUserAppointmentDataService, alertify, eHnoteCacheStorageService, eHnotePatientVisitReasonServices, $location, $rootScope, datapersistanceFactory, eHnoteDiagnosisDataServices, eHnoteAuditServices, localStorageFactory, eHnoteDbStaticDataService, eHnoteMainAppointmentService, eHnoteInsuranceService, eHnotePrintService, eHnoteUserDataService, eHnoteSettingsDataService, $uibModal, eHnoteLabService, eHnoteMainAdminServices, eHnoteSurgeryService, $uibModalInstance, allUserList, openBookAppt, $q, eHnoteReferalDataService) {

    var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var AppointmentDetailsCache = datapersistanceFactory.getItem("AppointmentDetailsCache");
    $scope.Doctorcalendarobj = datapersistanceFactory.getItem("SingleDoctorcalendar");
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();



    $scope.PreviousUrl = "/op";
    $scope.selectedApptDates = eHnoteMasterDataService.getSelectedCrmApptDates();

    console.log($scope.selectedApptDates);
    if ($scope.selectedApptDates.Screen != "") {
        $scope.PreviousUrl = $scope.selectedApptDates.Screen;
    }

    console.log($scope.PreviousUrl);
    $scope.currentUrl = openBookAppt || ''; // $location.url();

    $scope.type = AppointmentDetailsCache.type;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.isPatientExist = AppointmentDetailsCache.ispatientExistsval || false;
    $scope.dateVal = AppointmentDetailsCache.calenderDate;
    $scope.pagename = AppointmentDetailsCache.PageName;
    $scope.appCondate = AppointmentDetailsCache.AppDate;
    $scope.BookApptShowArray = [];
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    $scope.SubOrganizationId = 0;
    $scope.SpecializationId = 0;
    $scope.selectedBranchobj = {
        "ClinicId": 0,
        "ClinicName": ""
    }

    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.selectedBranchobj.ClinicId = doctorinfo.doctordata.UserAddress[0].ClinicId;
        $scope.selectedBranchobj.ClinicName = doctorinfo.doctordata.UserAddress[0].ClinicName;
        $scope.selectedBranchobj.SMSVendorId = doctorinfo.doctordata.UserAddress[0].SMSVendorId;

    }
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.RoleId = userLoginDetails.RoleID;
    var $calendar = "";

    $scope.mainCalendar = "";
    $scope.ApptDurationObj = {
        "patinet_consultationTime": "",
        "CalendarYear": "",
        "consultationTime_for_restructure": ""
    };
    $scope.calendarYearsarray = [];
    var yearsdf = new Date().getFullYear();
    let startYear = 1990;
    for (var i = startYear; i <= yearsdf + 10; i++) {
        var obj = {
            "Year": i
        }
        $scope.calendarYearsarray.push(obj);
    };

    var currentTime = new Date();
    var month = currentTime.getMonth() + 1
    var day = currentTime.getDate()
    var year = currentTime.getFullYear();
    $scope.calendarObject = {
        "Year": year,
        "Month": month,
        "Day": day,
        "Date": currentTime
    };

    console.log($scope.calendarObject);


    var selectedDoctorinAppList = eHnoteMasterDataService.getSelectedDoctorinAppList();



    /*Incase maintain*/
    $scope.IsDoctorcalendarDate = false;
    $scope.IsPatientRegistrationShow = false;
    $scope.AppointmentPatientTypeId = '';
    $scope.isregisterBtn = true;
    $scope.isSearchedPatientNotAvailable = true;
    /*Incase maintain*/
    $scope.SearchTxtObj = {
        "DoctorName": ""
    };

    $scope.GetOrganName = function () {
        return [{
            "OrganId": 1,
            "OrganName": "OD"
        },
        {
            "OrganId": 2,
            "OrganName": "OS"
        },
        {
            "OrganId": 3,
            "OrganName": "OU"
        }];
    };
    $scope.GetOrganNameList = angular.copy($scope.GetOrganName()) || [];


    $scope.isAppValiddities = {
        "PaidFollowup": false,
        "ISFastTrackAppointment": false,
        "isENableVisitType": false,
        "isEnableAlertType": false,
        "isValidOptionSelected": true,
        "UserScheduleId": 0,
        "VisitTypes": [],
        "UnblockSlots": false,
        "IsfocusinNotes": false,
        "BlockedSlotObj": "",
        "IsEnabledAfterCheckHere": false,
        "MaxApptError": false,
        "MaxApptErrorMsgShow": false,
        "MaxApptUnblock": true
    }
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

    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    $scope.IsSecondLastNameMandatory = false;
    $scope.AppointmentCheckInDynamicStatus = 0;
    $scope.IsPreviousNameMandatory = false;
    if ($scope.OrganizationSettingsData.length>0) {
        if ($scope.OrganizationSettingsData.PatientRegistration.IsSecondLastNameMandatory === 1) {
            $scope.IsSecondLastNameMandatory = true;
        }
        else {
            $scope.IsSecondLastNameMandatory = false;
        }
        if ($scope.OrganizationSettingsData.PatientRegistration.IsPreviousNameMandatory === 1) {
            $scope.IsPreviousNameMandatory = true;
        }
        else {
            $scope.IsPreviousNameMandatory = false;
        }
    }

    

   
    if ($scope.OrganizationSettingsData !== undefined) {
        if ($scope.OrganizationSettingsData.AppointmentSettings !== undefined) {
            $scope.AppointmentCheckInDynamicStatus = $scope.OrganizationSettingsData.AppointmentSettings.AppointmentCheckInDynamicStatus;
        }
    }

    function GetselectedPatientObj() {
        return {
            "PatientName": "",
            "PatientDisplayId": "",
            "OldPatientDisplayId": "",
            "NewpatSearchType": "1",
            "FollwuppatSearchType": "2",
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
            "SmsLanguageId":""
        }
    }
    $scope.selectedPatientObj = GetselectedPatientObj();

    $scope.connectedUserObj = {
        "Available": false,
        "Users": []
    };

    if (doctorinfo.doctordata.User != undefined && doctorinfo.doctordata.User.length > 0) {
        $scope.connectedUserObj.Available = doctorinfo.doctordata.User[0].IsConnectedUsersAvailable || false;
        if ($scope.connectedUserObj.Available) {
            if (doctorinfo.doctordata.UserAddress.length > 0) {
                $scope.connectedUserObj.Users = doctorinfo.doctordata.UserAddress[0].ConnectedUsers || [];
            }
        }
    }

    $scope.ChangePatientSearch = function (type) {
        $scope.selectedPatientObj = GetselectedPatientObj();
        $scope.selectedPatientObj.NewpatSearchType = type;
        $scope.selectedPatientObj.FollwuppatSearchType = type;
        $scope.patients = [];

        $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
        //$scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
        $scope.PatientInsuranceObj = GetInsuranceObj();
    };
    $scope.SearchByText = function (text, type) {

        //if (text != "") {
        //    var specialcharaters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.`~<>\/?]/;
        //    if (specialcharaters.test(text)) {
        //        if (type == "DisplayId") {
        //            $scope.selectedPatientObj.PatientDisplayId = $scope.selectedPatientObj.PatientDisplayId.replace(/[^\w\s]/gi, '');
        //            $scope.selectedPatientObj.PatientDisplayId = $scope.selectedPatientObj.PatientDisplayId.replace(/_/g, '');
        //        }
        //        if (type == "Name") {
        //            $scope.selectedPatientObj.PatientName = $scope.selectedPatientObj.PatientName.replace(/[^\w\s]/gi, '');
        //            $scope.selectedPatientObj.PatientName = $scope.selectedPatientObj.PatientName.replace(/_/g, '');
        //        }
        //        if (type == "OldDisplayId") {
        //            $scope.selectedPatientObj.OldPatientDisplayId = $scope.selectedPatientObj.OldPatientDisplayId.replace(/[^\w\s]/gi, '');
        //            $scope.selectedPatientObj.OldPatientDisplayId = $scope.selectedPatientObj.OldPatientDisplayId.replace(/_/g, '');
        //        }
        //        alertify.error("Special Characters are not allowed. Please check");
        //        return false;
        //    }
        //}

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
        $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
        $scope.PatientInsuranceObj = GetInsuranceObj();
        $scope.paymentTypeObj = getnewPaymentObj();

        var name = $scope.selectedPatientObj.PatientName;
        var patDispId = "";
        patDispId = $scope.selectedPatientObj.PatientDisplayId ? $scope.selectedPatientObj.PatientDisplayId : "";
        var patOldDispId = "";
        patOldDispId = $scope.selectedPatientObj.OldPatientDisplayId ? $scope.selectedPatientObj.OldPatientDisplayId : "";
        var patMobile = "";
        patMobile = $scope.selectedPatientObj.PatientMobile ? $scope.selectedPatientObj.PatientMobile : "";
        var patDOB = "";
        if ($scope.selectedPatientObj.DOBSearch.length > 9) {
            text = text + " 00:00:00";
            /*  patDOB = $filter('date')(new Date(text), "yyyy-MM-dd");*/
            /*patDOB = $scope.selectedPatientObj.DOBSearch || "";*/
            var parsedDate = new Date(text);
            if (!isNaN(parsedDate.getTime())) {
                patDOB = $filter('date')(parsedDate, "yyyy-MM-dd");
            } else {
                // Log an error or handle the invalid date case
                alertify.error("Invalid date format:", text);
                // Return false or handle the error in another way
                return false;
            }
        }



        if ((name === "" || name.length < 3) && (patDispId === "") && (patOldDispId === "") && (patMobile === "") && (patDOB === "")) {
            $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
            return;
        } else {
            if ($scope.selectedPatientObj.PatientName.length >= 3 || $scope.selectedPatientObj.PatientDisplayId.length >= 3 || $scope.selectedPatientObj.OldPatientDisplayId.length >= 2 || $scope.selectedPatientObj.PatientMobile.length >= 10 || $scope.selectedPatientObj.DOBSearch.length >= 10) {
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
                        if (name.length < 10) {
                            $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
                            return;
                        }
                        param.PhoneNumber = name;
                        param.hasparam = true;
                        if (name.length === 10) {
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
                //if (patDOB !== "") {
                //    param.SearchText = patDOB || "";
                //}

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



    $scope.addNewPatientRegister = function (patientnumber) {

        //   $scope.IsNumberaddPatient = false;
        $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
        $scope.PatientInsuranceObj = GetInsuranceObj();

        if ($scope.selectedPatientObj.FollwuppatSearchType == 2 || $scope.selectedPatientObj.FollwuppatSearchType == "2") {
            if (!isNaN($scope.selectedPatientObj.PatientName)) {
                var MobileNumber = patientnumber.toString() || "";
                if (MobileNumber != '') {
                    var number = MobileNumber;
                    var Area = number.slice(0, 3);
                    $scope.PatientDetailsForRegisterObj.HomeAreaCode = Area;
                    var contact = number.substring(3, (MobileNumber.toString()).length);
                    $scope.PatientDetailsForRegisterObj.HomeNumber = contact;

                    var phoneNumberString = $scope.PatientDetailsForRegisterObj.HomeAreaCode + $scope.PatientDetailsForRegisterObj.HomeNumber;
                    $scope.formatUSNumber(phoneNumberString);
                }
            } else {
                $scope.PatientDetailsForRegisterObj.FirstName = $scope.selectedPatientObj.PatientName;
            }
        }

        $scope.selectedPatientObj.PatientName = "";
        $scope.IsNoPatienthere = true;
        $scope.ShowAddNewInsurance = true;
        $scope.patientInsuranceTpasArray = [];
        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
        $scope.paymentTypeObj.PaymentTypeId = "2";
        $scope.paymentTypeObj.IsPaymentTypeInd = false;




        $scope.PatientInsuranceObj.IdentifierId = 1;
        //  $scope.PatientInsuranceObj.setprimary = true;
        $scope.ApptMaintainfields.IsPatientSelected = true;
        $scope.ApptMaintainfields.IsAppointmentScreen = false;

        $scope.ApptMaintainfields.IsAddNewPatientBtn = false;



    };

    $scope.getDate = function (Tmpfromdate) {
        if (Tmpfromdate !== "") {
            $scope.selectedPatientObj.BSMSind = true;
        }
        var todate = new Date();
        var age = [];
        var fromdate = new Date(Tmpfromdate);
        var y = [todate.getFullYear(), fromdate.getFullYear()];
        var ydiff = y[0] - y[1];
        var m = [todate.getMonth(), fromdate.getMonth()];
        var mdiff = m[0] - m[1];
        var d = [todate.getDate(), fromdate.getDate()];
        var ddiff = d[0] - d[1];
        if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
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


        $scope.PatientDetailsForRegisterObj.ageinYears = ydiff.toString();
        $scope.PatientDetailsForRegisterObj.ageinMonths = mdiff.toString();
        if ($scope.PatientDetailsForRegisterObj.ageinMonths === "-1") {
            $scope.PatientDetailsForRegisterObj.ageinMonths = "";
        }
        $scope.PatientDetailsForRegisterObj.ageinDays = ddiff.toString();
        var curAge = $scope.PatientDetailsForRegisterObj.ageinYears + '.' + $scope.PatientDetailsForRegisterObj.ageinMonths;
        $scope.PatientDetailsForRegisterObj.Age = curAge;
    };

    $scope.chnagespayor = function (item, mainitem) {
        item = item || "";

        mainitem.PlanObj = '';
        mainitem.PlanTypeId = '';
        mainitem.PlanId = '';
        mainitem.PayorId = '';
        mainitem.OrganizationPayorId = 0;
    };
    $scope.setAgeandMonth = function (ageinYears, ageinMonths, ageinDays) {
        var curAge = $scope.PatientDetailsForRegisterObj.ageinYears + '.' + $scope.PatientDetailsForRegisterObj.ageinMonths;
        $scope.PatientDetailsForRegisterObj.PatientAge = curAge;
        var dob = $scope.getDateOfBirth($scope.PatientDetailsForRegisterObj.ageinYears, $scope.PatientDetailsForRegisterObj.ageinMonths, $scope.PatientDetailsForRegisterObj.ageinDays);
        $scope.PatientDetailsForRegisterObj.DOB = moment(dob).format("MM-DD-YYYY");
        daysInMonth(ageinMonths, ageinYears);
    };
    $scope.getDateOfBirth = function (year, month, day) {
        year = parseInt(year) || 0;
        month = parseInt(month) || 0;
        day = parseInt(day) || 0;
        var today = new Date();
        var todayYear = today.getFullYear();
        var todaymonth = today.getMonth() + 1;
        var dateNow = today.getDate();
        var dobyear = todayYear - year;
        if (todaymonth > month) {
            var dobmonth = todaymonth - month;
        }
        if (todaymonth <= month) {
            dobyear = dobyear - 1;
            dobmonth = todaymonth - month;
            dobmonth = 12 + dobmonth;
        }

        if (dateNow >= day)
            var dateAge = dateNow - day;
        else {
            dobmonth--;
            dateAge = 30 + dateNow - day;

            if (dobmonth < 0) {
                dobmonth = 11;
                dobyear--;
            }
        }
        dobmonth = dobmonth < 10 ? "0" + dobmonth : dobmonth;
        dateAge = dateAge < 10 ? "0" + dateAge : dateAge;
        if (dateAge === "00") {
            dateAge = dateNow.toString();

        }

        return dobmonth + "/" + dateAge + "/" + dobyear;
    };
    /*Patient search End*/


    $scope.selectBookingType = {
        "selectedBookAppo": "",
        "IsWalkInSlot": false,
        "IsAppointmentConfirmed": false,
        "IsPatientMissedAppointment": false,
        "IsInsuranceEligibilityVerify": false
    };

    $scope.selectBookingType.IsAppointmentConfirmed = cacheStorageItem.IsAppointmentConfirmed || false;

    var AppointmentDetailsById = datapersistanceFactory.getItem("OpAppointmentDetailsById");

    $scope.BookingType = 1;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }
    if ($scope.pagename === "reschedule") {
        $scope.selectBookingType.IsInsuranceEligibilityVerify = AppointmentDetailsById.IsInsuranceEligibilityVerify || false;
        $scope.selectBookingType.IsPatientMissedAppointment = AppointmentDetailsById.IsPatientMissedAppointment || false;
        $scope.visitremarks = cacheStorageItem.VisitRemarks;
    }


    function GetPatientDetailsForRegister() {
        var obj = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PatientID": 0,
            "PatientTagId": 0,
            "Title": "Mr",
            "TitleId": 1,
            "FirstName": "",
            "MiddleName": "",
            "LastName": "",
            "SecondLastName": "",
            "PreviousName": "",
            "SecondLastNameInd": true,
            "DOB": "",
            "SocialSecurityNo": "",
            "Gender": "Male",
            "MaritalStatusID": "",
            "BloodGroupId": 0,
            "EmailID": "",
            "HomeCountryCode": "+1",
            "HomeAreaCode": "",
            "HomeNumber": "",
            "DisplayNumber": "",
            "PatientDisplayId": "",
            "OfficeCountryCode": "+1",
            "OfficeAreaCode": "",
            "OfficeNumber": "",
            "DisplayOfficeNumber": "",
            "S3URL": "",
            "LeadSourceInd": "N",
            "PatientDisplayID": "",
            "Age": "",
            "ageinYears": "",
            "ageinMonths": "",
            "ageinDays": "",
            "AuthorizationId": "",
            "IsPatientSmsInd": false,
            "IsPatientEmailInd": false,
            "OccupationId": "",
            "OccupationDescription": "",
            "EmployerPhoneNo": "",
            "Emergency": "",
            "EmergencyMobile": "",
            "HospitalEquipmentId": "",
            "FatherName": "",
            "MotherName": "",
            "Guardian": "",
            "Employer": "",
            "FaxNumber": "",
            "Faxcountrycode": "",
            "FaxAreacode": "",
            "FaxHomeNumber": "",
        };

        if (doctorinfo.doctordata.User.length > 0) {
            obj.HomeCountryCode = doctorinfo.doctordata.User[0].CommunicationCountryCode;
            obj.OfficeCountryCode = doctorinfo.doctordata.User[0].CommunicationCountryCode;
        }
        return obj;
    };

    $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();

    function GetInsuranceObj() {
        var obj = {
            "CoverageId": 0,
            "PatientInsuranceDetailId": 0,
            "PatientAppointmentInsuranceDetailId": 0,
            "PlanId": 0,
            "PlanObj": "",
            "Payor": "",
            "PayorId": 0,
            "OrganizationPayorId": 0,
            "PayorObj": "",
            "PlanTypeId": 0,
            "PolicyId": "",
            "GroupId": "",
            "GroupName": "",
            "RelationShipId": 1,
            "InsuranceRelationShipObj": "",
            "PolicyHolder": "",
            "PolicyHolderName": "",
            "Employer": "",
            "Coinsurance": "",
            "VisitCopay": "",
            "EffectiveDate": "",
            "ExpiryDate": "",
            "ScanDate": "",
            "VerifiedDate": "",
            "DeleteInd": false,
            "AcceptAssign": "",
            "AssignBenifits": "",
            "ReleaseInfo": "",
            "LaboratoryId": 0,
            "StatusId": 1,
            "IsVerified": false,
            "Comments": "",
            "MSPTrailerTypeId": 0,
            "Staff": "",
            "PatientDocumentDetails": [],
            "MsnTyp": "",
            "IsAcceptAssign": 0,
            "IsAcceptAssignBenifits": 0,
            "IsReleaseInfo": 0,
            "PatientBillingTypeId": 0,
            "TempInsuranceImagesArray": [],
            "InsuredPersonFirstName": "",
            "InsuredPersonDOB": "",
            "InsuredPersonGenderID": "",
            "InsuredPersonSSN": "",
            "IdentifierId": 1,
            "setprimary": false,
            "InsuredPersonMiddleName": "",
            "InsuredPersonLastName": "",
            "PatientFirstName": "",
            "PatientLastName": "",
            "PatientDOB": "",
            "PatientSSN": "",
            "VerifiedBy": 0,
            "EligibilityStatusId": 1,
            "IsInsuranceConnectedAppointment": false,
            "IsGroupIdDiasibleInd": false,
            "IsPolicyIdDiasibleInd": false,
            "IsPayorPlanDiasibleInd": false,
        }
        return obj;
    }
    $scope.PatientInsuranceObj = GetInsuranceObj();


    function getnewPaymentObj() {
        var obj = {
            "PaymentTypeId": "1",
            "OrgInsuranceTpaId": 0,
            "SelectPatientInsuranceObj": "",
            "AppointmentNote": "",
            "SelectPatientPrimaryInsuranceObj": "",
            "SelectPatientSecondaryInsuranceObj": "",
            "BillingCategoryType": "Bill Patient",
            "AppointmentNotesList": [],
            "PatientInsuranceList": [],
            "GETPatientInsuranceList": [],
            "IsPaymentTypeInd": true
        }
        return obj
    }
    $scope.paymentTypeObj = getnewPaymentObj();

    $scope.patientInsuranceTpasArray = [];
    $scope.InsuranceStatusList = [];

    $scope.Patientauthorized = [
        { "Id": 1, "Name": "SMS" },
        { "Id": 2, "Name": "Email" },
        { "Id": 3, "Name": "SMS & Email" },
        { "Id": 4, "Name": "Not Authorized " }
    ];

    /* $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();*/
    $scope.GetPatientRelatedMasterData = function () {
        eHnoteSettingsDataService.GetPatientRelatedMasterData().then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.TitleArray.length != 0) {
                    $scope.TitlesList = resp.data.TitleArray;
                }
                $scope.InsuranceCoverageList = resp.data.CoverageArray;
                $scope.InsuranceStatusList = resp.data.InsuranceStatus || [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Data Failed");
        });

    };
    $scope.getBranchAppointmentTypes = function (hospitalId) {

        eHnoteMainAppointmentService.getBranchAppointmentTypes(hospitalId).then(function (resp) {
            console.log(resp);
            $scope.appointmentTypes = [];
            if (resp.data.rows != undefined) {
                $scope.appointmentTypes = resp.data.rows;
                $scope.appointmentTypes = $scope.appointmentTypes.filter(x => x.AppointmentTypeId !== 9);
                angular.forEach($scope.appointmentTypes, function (item) {
                    item.AppointmentTypeId = item.AppointmentTypeId.toString();
                });


            }
        });

    };

    $scope.HospitalEquipmentList = [];
    $scope.GetAllHospitalEquipments = function () {
        //var obj = {
        //    "ParentOrganizationId": $scope.ParenthospitalId
        //}
        $scope.ParenthospitalId = $scope.ParenthospitalId || 0;
        eHnotePatientAddressDataServices.GetAllHospitalEquipments($scope.ParenthospitalId).then(function (resp) {
            if (resp.data.rows.length > 0) {
                $scope.HospitalEquipmentList = resp.data.rows || [];

                cacheStorageItem.HospitalEquipmentId = cacheStorageItem.HospitalEquipmentId || "";
                if (cacheStorageItem.HospitalEquipmentId !== "") {
                    $scope.HospitalEquipmentId = cacheStorageItem.HospitalEquipmentId || "";
                }
            }
        });
    };

    $scope.Init = function () {
        $scope.listval = [];
        $scope.checkval = doctorinfo.doctordata.UserParentBranch;
        angular.forEach($scope.checkval, function (item) {
            $scope.listval.push(item.OrganizationId);
        });

        $scope.GetPatientRelatedMasterData();
        $scope.getBranchAppointmentTypes(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
        $scope.GetAllHospitalEquipments();
    }


    $scope.Init();


    function getnewAppoitnmentDoctorObj() {
        var obj = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "Tab": 1,
            "IsEdit": true,
            "AppointmentID": 0,
            "ParentAppointmentId": 0,
            "RootAppointmentId": 0,
            "OrganId": null,
            "NurseId": null,
            "AnesthesistId": null,
            "AppointmentStatus": "B",
            "CurrentTime": "",
            "StartTime": "",
            "EndTime": "",
            "Duration": "",
            "AppointmentTypeId": "",
            "VisitRemarks": "",
            "selectedBookAppo": "",
            "IsWalkInSlot": false,
            "IsAppointmentConfirmed": false,
            "IsWaitingListAppointment": false,
            "NoShowCheckDiv": false,
            "IsPatientMissedAppointment": false,
            "IsInsuranceEligibilityVerify": false,
            "IsNoShowAppointment": false,
            "SelectedNotesobj": {
                "IsEdit": false,
                "index": null,
                "AppointmentNoteId": null,
                "AppointmentNote": "",
            },
            "SelectedBranchDocId": 0,
            "DocObj": "",
            "patient_appEndTime": "",
            "patinet_appStarttime": "",
            "searchvisitreasontxt": "",
            "AppointmentDate": $filter("date")(new Date(), "MM-dd-yyyy"),
            "DoctorID": null,
            "RoomId": null,
            "RoomTypeId": null,
            "DayCD": "",
            "VisitReasonName": "",
            "ConsultationDt": "",
            "UserBranchId": null,
            "PatientID": null,
            "USRType": "DOCTOR",
            "PreviousAppointmentDate": "",
            "SendDocSms": false,
            "SendDocEmail": false,
            "SendPatientEmail": false,
            "SendPatientSms": false,
            "PatientEmail": "",
            "PatientTypeId": null,
            "IsCheckedIn": null,
            "PatientInsuranceList": [],
            "AppointmentNotesList": [],
            "AppointmentNotes": [],
            "HospitalEquipmentId": null,
            "PaymentTypeId": null,
            "IsConfirmedAppointment": false,
            "IsNoShowAppointment": false,
            "VisitTypeId": null,
            "VisitReasonId": null,
            "IsInsuranceEligibilityVerify": false,
            "IsPatientSmsInd": false,
            "IsPatientEmailInd": false,
            "AppointmentTypeName": "",
            "DisplayNumber": "",
            "VisitRemarks": "",
            "TimeSlotsStartArray": [],
            "TimeSlotsEndArray": [],
            "AppointmentNotes": [],
            "VisitReasonObj": "",
            "IsShowNoApptInd": false,
            "RescheduledAppointmentId": 0,
            "RescheduledAppointmentDate": "",
            "RescheduledAppointmentStartTime": "",
            "RescheduledAppointmentEndTime": "",
            "RescheduledDoctorId": "",
            "RescheduledAppointmentTypeId": "",
            "RescheduledVisitReasonId": "",
            "IsDoctorLeave": false,
            "EncounterDiagnosisId": null,
            "EncounterDiagnosisType": "ICD-10",
            "DiagnosisObject": "",
            "OtherNotes": "",
            "NotesTab": 1,
            /* "Routeslipnotes": "",*/
            "OtherNotesCreatedBy": "",
            "OtherNotesCreatedDt": "",
            "IsOtherNotesEdit": false,
            "BookingTypeId": null,
            "SourceTypeId": 3,
            "BookingStatusId": 2,
            "AppointmentStatusId": 1,
            "ReasonTypeId": null,
            "PatientSeenOtherProvider": "",
            "OtherProviderVisitDate": "",
            "OtherProviderVisitReason": "",
            "OtherProviderDoctorName": "",
            "TransferToCall": false,
            "UnblockVisitreason": false,
            "SurgeryReferralDoctorObj": '',
            "SurgeryReferralDoctorId": 0,
            
            "PCPDoctor": '',
            "IsReferral": false,
            "OtherProviderDoctorID": 0,
            "IsReferralDoctornotes": false,
            "IsSmsLanguageIdInd": false
        }


        return obj;
    }
    $scope.selectedAppointmentObject = getnewAppoitnmentDoctorObj();



    function GetAppointmentDetailsInfo() {
        var obj = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "Tab": 1,
            "IsEdit": true,
            "AppointmentID": 0,
            "ParentAppointmentId": 0,
            "RootAppointmentId": 0,
            "OrganId": null,
            "NurseId": null,
            "AnesthesistId": null,
            "AppointmentStatus": "B",
            "CurrentTime": "",
            "StartTime": "",
            "EndTime": "",
            "AppointmentTypeId": "",
            "VisitRemarks": "",

            "selectedBookAppo": "",
            "IsWalkInSlot": false,
            "IsAppointmentConfirmed": false,
            "IsWaitingListAppointment": false,
            "IsPatientMissedAppointment": false,
            "IsInsuranceEligibilityVerify": false,
            "SelectedNotesobj": {
                "IsEdit": false,
                "index": null,
                "AppointmentNoteId": null,
                "AppointmentNote": "",
            },
            "SelectedBranchDocId": 0,
            "DocObj": "",
            "patient_appEndTime": "",
            "patinet_appStarttime": "",
            "searchvisitreasontxt": "",
            "AppointmentDate": $filter("date")(new Date(), "MM-dd-yyyy"),
            "DoctorID": null,
            "RoomId": null,
            "RoomTypeId": null,
            "DayCD": "",
            "VisitReasonName": "",
            "ConsultationDt": "",
            "UserBranchId": null,
            "PatientID": null,
            "USRType": "DOCTOR",
            "PreviousAppointmentDate": "",
            "SendDocSms": false,
            "SendDocEmail": false,
            "SendPatientEmail": false,
            "SendPatientSms": false,
            "PatientEmail": "",
            "PatientTypeId": null,
            "IsCheckedIn": null,
            "PatientInsuranceList": [],
            "AppointmentNotes": [],
            "HospitalEquipmentId": null,
            "PaymentTypeId": null,
            "IsConfirmedAppointment": false,
            "IsNoShowAppointment": false,
            "VisitTypeId": null,
            "IsInsuranceEligibilityVerify": false,
            "IsPatientSmsInd": false,
            "IsPatientEmailInd": false,
            "AppointmentTypeName": "",
            "DisplayNumber": "",
            "BookingTypeId": null,
            "SourceTypeId": 3,
            "BookingStatusId": 2,
            "AppointmentStatusId": 1,

        }
        return obj;
    }
    $scope.AppointmentDetailsInfo = GetAppointmentDetailsInfo();

    $scope.allUserList = allUserList || [];

  

    $scope.ClosePopup = function () {
        $uibModalInstance.dismiss("cancel");
        $scope.$emit("BookapptclosePopup");
    };


    $scope.ExpiredPatientInsuranceList = [];
    $scope.getPatientInsuranceDetailsOfPatient = function (patientitem) {

        eHnoteInsuranceService.getPatientInsuranceDtls(patientitem.PatientId).then(function (response) {
            console.log(response);
            $scope.ExpiredPatientInsuranceList = response.data.ExpiredPatientInsuranceList || [];
            if (response.data !== undefined) {
                if (response.data.rows.length > 0) {
                    $scope.patientInsuranceTpasArray = response.data.rows;
                    angular.forEach($scope.patientInsuranceTpasArray, function (bitem) {
                        bitem.isCorporateType = false;
                        if (bitem.BillingCategoryTypeId === 15) {
                            bitem.isCorporateType = true;
                        }
                    });
                    $scope.PatientInsuranceObj = GetInsuranceObj();
                    //if ($scope.pagename == 'book') {
                    //    if ($scope.type === 'op') {
                    //        $scope.PatientInsuranceObj = GetInsuranceObj();
                    //        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
                    //    } else {
                    //        $scope.paymentTypeObj.PaymentTypeId = "2";
                    //        $scope.paymentTypeObj.IsPaymentTypeInd = false;
                    //    }
                    //}
                    if ($scope.patientInsuranceTpasArray.length > 0) {
                        let TempEdit = [];
                        let ExpredTemp = [];
                        if ($scope.pagename == 'reschedule') {
                            TempEdit = $filter("filter")($scope.patientInsuranceTpasArray, function (item) {
                                item.PatientAppointmentInsuranceDetailId = $scope.BookApptShowArray[0].PatientAppointmentInsuranceDetailId;
                                return item.PatientInsuranceDetailId == $scope.BookApptShowArray[0].PatientInsuranceDetailId;
                            }) || [];
                            ExpredTemp = $filter("filter")($scope.ExpiredPatientInsuranceList, function (item) {
                                item.PatientAppointmentInsuranceDetailId = $scope.BookApptShowArray[0].PatientAppointmentInsuranceDetailId;
                                return item.PatientInsuranceDetailId == $scope.BookApptShowArray[0].PatientInsuranceDetailId;
                            }) || [];
                        }
                        $scope.BookApptShowArray = [];
                        let Temp = angular.copy($filter("filter")($scope.patientInsuranceTpasArray, { "IsConnectToFutureAppointment": true }, true) || []);
                        if (TempEdit.length > 0) {
                            $scope.BookApptShowArray = angular.copy(TempEdit);
                        }
                         else if (Temp.length > 0) {
                            $scope.BookApptShowArray = angular.copy(Temp);
                        }
                        else if (ExpredTemp.length > 0) {
                            $scope.BookApptShowArray = angular.copy(ExpredTemp);
                        }
                        else {
                            $scope.BookApptShowArray.push($scope.patientInsuranceTpasArray[0]);
                        }
                        if (ExpredTemp.length > 0) {
                            let myindex = $scope.ExpiredPatientInsuranceList.findIndex(x => x.PatientInsuranceDetailId === $scope.BookApptShowArray[0].PatientInsuranceDetailId);
                            $scope.PatientInsuranceObj = angular.copy($scope.ExpiredPatientInsuranceList[myindex]);
                            $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                            $scope.PatientInsuranceObj.setprimary = true;
                            $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.ExpiredPatientInsuranceList[myindex];
                            $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId || 0;
                            $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                            $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment = $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment || false;
                        } else {
                            let index = $scope.patientInsuranceTpasArray.findIndex(x => x.PatientInsuranceDetailId === $scope.BookApptShowArray[0].PatientInsuranceDetailId);
                            $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[index]);
                            $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                            $scope.PatientInsuranceObj.setprimary = true;
                            $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[index];
                            $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId || 0;
                            $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                            $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment = $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment || false;
                        }
                    
                        $scope.paymentTypeObj.PaymentTypeId = "2";
                        $scope.paymentTypeObj.IsPaymentTypeInd = false;
                        //if ($scope.pagename == 'reschedule') {
                        //    var filter2 = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 2 }, true) || [];
                        //    if (filter2.length > 0) {
                        //        $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj = filter2[0];
                        //    }
                        //}
                    } else {
                        $scope.paymentTypeObj.PaymentTypeId = "1";
                        $scope.paymentTypeObj.IsPaymentTypeInd = true;
                        $scope.PatientInsuranceObj.IdentifierId = 1;
                        $scope.PatientInsuranceObj.setprimary = true;
                        $scope.BookApptShowArray = [];
                    }

                    //if ($scope.patientInsuranceTpasArray.length > 0) {
                    //    if ($scope.patientInsuranceTpasArray.length === 1) {
                    //        if ($scope.type == 'op') {
                    //            let Temp = angular.copy($filter("filter")($scope.patientInsuranceTpasArray, { "IsConnectToFutureAppointment": true }, true) || []);
                    //            $scope.BookApptShowArray = angular.copy(Temp);
                    //            if (Temp.length > 0) {
                    //             var filter12 = angular.copy($scope.BookApptShowArray);
                    //            }
                    //            if (filter12.length > 0) {
                    //                let index = $scope.patientInsuranceTpasArray.findIndex(x => x.PatientInsuranceDetailId === filter12[0].PatientInsuranceDetailId);
                    //                $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[index]);
                    //                $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                    //                $scope.PatientInsuranceObj.setprimary = true;
                    //                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[index];
                    //                $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId || 0;
                    //                $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorId;
                    //                $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment = $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment || false;
                    //                $scope.paymentTypeObj.PaymentTypeId = "2";
                    //                $scope.paymentTypeObj.IsPaymentTypeInd = false;
                    //            } else {
                    //                $scope.paymentTypeObj.PaymentTypeId = "1";
                    //                $scope.paymentTypeObj.IsPaymentTypeInd = true;
                    //            }
                    //        } else {
                    //            $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                    //            $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                    //            $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                    //            $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                    //            $scope.PatientInsuranceObj.VerificationDate = $scope.PatientInsuranceObj.VerificationDate;

                    //            if ($scope.PatientInsuranceObj.VerificationDate != "" && $scope.PatientInsuranceObj.VerificationDate != null) {
                    //                $scope.PatientInsuranceObj.VerificationDate = $filter("date")($scope.PatientInsuranceObj.VerificationDate, "MM-dd-yyyy HH:mm:ss");
                    //            }
                    //            $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.AppointmentInsuranceDetailId;
                    //            $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment = $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment || false;
                    //            $scope.paymentTypeObj.PaymentTypeId = "2";
                    //            $scope.paymentTypeObj.IsPaymentTypeInd = false;
                    //        }
                    //    }
                    //    else if ($scope.patientInsuranceTpasArray.length > 1) {
                    //        var filter1 = [];
                    //        if ($scope.pagename == 'book' && $scope.rescheduleobj.IsReschedule == false) {
                    //            if ($scope.type == 'op') {
                    //                let Temp = angular.copy($filter("filter")($scope.patientInsuranceTpasArray, { "IsConnectToFutureAppointment": true }, true) || []);
                    //                $scope.BookApptShowArray = angular.copy(Temp);
                    //                if (Temp.length > 0) {
                    //                    filter1 = angular.copy($scope.BookApptShowArray);
                    //                }
                    //            } else {
                    //                let crmtemp = angular.copy($filter("filter")($scope.patientInsuranceTpasArray, { "IsConnectToFutureAppointment": true }, true) || []);
                    //                if (crmtemp.length > 0) {
                    //                    let index = $scope.patientInsuranceTpasArray.findIndex(x => x.PatientInsuranceDetailId === crmtemp[0].PatientInsuranceDetailId);
                    //                    $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[index]);
                    //                    $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                    //                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[index]);
                    //                    $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId || 0;
                    //                    $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                    //                    $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment = $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment || false;
                    //                } else {
                    //                    $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                    //                    $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                    //                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                    //                    $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId || 0;
                    //                    $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                    //                    $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment = $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment || false;
                    //                }
                    //                $scope.paymentTypeObj.PaymentTypeId = "2";
                    //                $scope.paymentTypeObj.IsPaymentTypeInd = false;
                    //            }
                    //        }
                    //        else if ($scope.pagename == 'reschedule') {
                    //            if ($scope.BookApptShowArray.length > 0) {
                    //                filter1 = $filter("filter")($scope.patientInsuranceTpasArray, function (item) {
                    //                    item.PatientAppointmentInsuranceDetailId = $scope.BookApptShowArray[0].PatientAppointmentInsuranceDetailId;
                    //                    return item.PatientInsuranceDetailId == $scope.BookApptShowArray[0].PatientInsuranceDetailId;
                    //                }) || [];

                    //            } else {
                    //                filter1 = [];
                    //            }
                    //        } else {
                    //            let tempArray = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 1 }, true) || [];
                    //            filter1 = angular.copy(tempArray);
                    //        }
                    //        var filter2 = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 2 }, true) || [];
                    //        if (filter2.length > 0) {
                    //            $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj = filter2[0];
                    //        }
                    //        if (filter1.length > 0) {
                    //            let index = $scope.patientInsuranceTpasArray.findIndex(x => x.PatientInsuranceDetailId === filter1[0].PatientInsuranceDetailId);
                    //            $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[index]);
                    //            $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                    //            $scope.PatientInsuranceObj.setprimary = true;
                    //            $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[index];
                    //            $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId||0;
                    //            $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorId;
                    //            $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment = $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment || false;
                    //            $scope.paymentTypeObj.PaymentTypeId = "2";
                    //            $scope.paymentTypeObj.IsPaymentTypeInd = false;
                    //        } else {
                    //            if (filter1.length == 0 && $scope.type == 'op') {
                    //                $scope.paymentTypeObj.IsPaymentTypeInd = true;
                    //                $scope.paymentTypeObj.PaymentTypeId = 1;
                    //            }
                    //        }
                    //    }

                   

                        if ($scope.PatientInsuranceObj.IdentifierId === 1) {
                            $scope.PatientInsuranceObj.setprimary = true;
                        } else {
                            $scope.PatientInsuranceObj.setprimary = false;
                        }
                        $scope.PatientInsuranceObj.IsGroupIdDiasibleInd = false;
                        $scope.PatientInsuranceObj.IsPolicyIdDiasibleInd = false;
                        $scope.PatientInsuranceObj.IsPayorPlanDiasibleInd = false;
                        if ($scope.patientInsuranceTpasArray.length > 0) {
                            angular.forEach($scope.patientInsuranceTpasArray, function (item) {
                                if (item.GroupId == '') {
                                    $scope.PatientInsuranceObj.IsGroupIdDiasibleInd = false;
                                } else {
                                    $scope.PatientInsuranceObj.IsGroupIdDiasibleInd = true;
                                }
                                if (item.PolicyId == '') {
                                    $scope.PatientInsuranceObj.IsPolicyIdDiasibleInd = false;
                                } else {
                                    $scope.PatientInsuranceObj.IsPolicyIdDiasibleInd = true;
                                }
                                if (item.PlanName == '') {
                                    $scope.PatientInsuranceObj.IsPayorPlanDiasibleInd = false;
                                } else {
                                    $scope.PatientInsuranceObj.IsPayorPlanDiasibleInd = true;
                                }
                            });
                        }
             /*       }*/
                    //else {
                    //    $scope.PatientInsuranceObj.IdentifierId = 1;
                    //    $scope.PatientInsuranceObj.setprimary = true;
                    //    $scope.BookApptShowArray = [];
                    //}


                }
            }
        });
    }
    $scope.onSelectPatientFromSuggestion = function (patientitem, type) {
        $scope.selectedPatientObj.PatientName = "";
        console.log(patientitem.PatientId);

        eHnoteAuditServices.getParticularPatientDetailsById(patientitem.PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(response) {
            console.log(response);
            if (response.count > 0) {
                patientitem = response.rows[0];
                patientitem.PatientID = patientitem.PatientId;


                $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
                $scope.ApptMaintainfields.IsPatientSelected = true;
                $scope.ApptMaintainfields.ShowAddNewInsurance = false;

                //remove if not using
                $scope.selectedPatInfo = patientitem;
                //remove if not using


                //Prepopulate
                $scope.AppointmentPatientTypeId = patientitem.AppointmentPatientTypeId;
                $scope.selectedPatientObj.PatientId = patientitem.PatientId;
                $scope.selectedPatientObj.S3URL = patientitem.S3URL || "";
                $scope.selectedPatientObj.SSN = patientitem.SSN || "";
                $scope.selectedPatientObj.DisplayID = patientitem.DisplayID;
                $scope.selectedPatientObj.OldMrno = patientitem.OldMrno;
                $scope.selectedPatientObj.PatientName = patientitem.FullName;
                $scope.selectedPatientObj.FullName = patientitem.FullName;
                $scope.selectedPatientObj.PatientMobile = patientitem.PhoneNumber || 0;
                $scope.selectedPatientObj.PatientGender = patientitem.Gender;
                $scope.selectedPatientObj.PatientAge = patientitem.Age;
                $scope.selectedPatientObj.CountryCode = patientitem.CountryCode;
                $scope.selectedPatientObj.AgeInYears = patientitem.AgeInYears;
                $scope.selectedPatientObj.AgeInDays = patientitem.AgeInDays;
                $scope.selectedPatientObj.AgeInMonths = patientitem.AgeInMonths;
                $scope.selectedPatientObj.AgeInDays = patientitem.AgeInDays;
                $scope.selectedPatientObj.DOB = patientitem.DOB;
                $scope.selectedPatientObj.PatientEmail = patientitem.EmailId;

                $scope.selectedPatientObj.ReferralSourceId = patientitem.ReferralSourceId;
                $scope.selectedPatientObj.PatientTitle = patientitem.Title;
                $scope.selectedPatientObj.CreatedDt = patientitem.CreatedDt;
                $scope.selectedPatientObj.LastPaid = patientitem.LastPaid || "";
                $scope.selectedPatientObj.FirstName = patientitem.FirstName;
                $scope.selectedPatientObj.LastName = patientitem.LastName;
                $scope.selectedPatientObj.ReferralSourceName = patientitem.ReferalSource || "";
                $scope.selectedPatientObj.ReferalSource = patientitem.ReferalSource || "";
                $scope.selectedPatientObj.MasterReferralSourceId = patientitem.MasterReferralSourceId || "";
                $scope.selectedPatientObj.MasterReferralSourceName = patientitem.MasterReferralSourceName || "";
                $scope.selectedPatientObj.HomeCountryCode = patientitem.HomeCountryCode;
                $scope.selectedPatientObj.HomeAreaCode = patientitem.HomeAreaCode;
                $scope.selectedPatientObj.HomeNumber = patientitem.HomeNumber;
                $scope.selectedPatientObj.LanguageID = patientitem.LanguageID;
                $scope.selectedPatientObj.IsConnectToFutureAppointment = patientitem.IsConnectToFutureAppointment||false;
                $scope.patients = [];

                if ($scope.pagename == 'book') {
                    if ($scope.type === 'op') {
                        $scope.PatientInsuranceObj = GetInsuranceObj();
                        $scope.paymentTypeObj.PaymentTypeId = "1";
                        $scope.paymentTypeObj.IsPaymentTypeInd = true;
                        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
                    } else {
                        $scope.paymentTypeObj.PaymentTypeId = "2"; //"1";
                        $scope.paymentTypeObj.IsPaymentTypeInd = false;  // true;
                    }
                    if ($scope.selectedPatientObj.IsConnectToFutureAppointment) {
                        $scope.paymentTypeObj.PaymentTypeId = "2"; //"1";
                        $scope.paymentTypeObj.IsPaymentTypeInd = false;  // true;
                    }
                    else {
                        $scope.paymentTypeObj.PaymentTypeId = "1";
                        $scope.paymentTypeObj.IsPaymentTypeInd = true;
                    }
                } 
              
                var SSN = $scope.selectedPatientObj.SSN;
                var PhoneNumber = $scope.selectedPatientObj.PatientMobile;
                PhoneNumber = $scope.selectedPatientObj.PatientMobile.toString();
                if (PhoneNumber.length > 0) {
                    var number = PhoneNumber || "";
                    if (patientitem.HomeNumber != '') {
                        number = patientitem.HomeCountryCode + '-' + patientitem.HomeAreaCode + '-' + patientitem.HomeNumber;
                    } else {
                        number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.substring(5, 10);
                    }
                    $scope.selectedPatientObj.TempPhNumber = number;
                } else {
                    $scope.selectedPatientObj.TempPhNumber = "";
                }
                SSN = SSN || "";
                SSN = $scope.selectedPatientObj.SSN.toString();
                if (SSN.length > 0) {
                    var SSNnumber = SSN;
                    SSNnumber = SSNnumber.slice(0, 3) + '-' + SSNnumber.slice(3, 5) + '-' + SSNnumber.substring(5, 10);;
                    $scope.selectedPatientObj.TempSSNnumber = SSNnumber;
                } else {
                    $scope.selectedPatientObj.TempSSNnumber = "";
                }

                $scope.selectedPatientObj.PatientType = patientitem.PatientType || "";
                $scope.selectedPatientObj.CityName = patientitem.CityName || "";
                $scope.selectedPatientObj.Occupation = patientitem.Occupation || "";
                $scope.selectedPatientObj.Location = patientitem.Area || "";//Location
                $scope.selectedPatientObj.Title = patientitem.Title || "";
                $scope.selectedPatientObj.StateName = patientitem.StateName || "";

                $scope.selectedPatientObj.IsVIPInd = patientitem.IsVIPInd || false;
                $scope.selectedPatientObj.IsResearchInd = patientitem.IsResearchInd || false;
                $scope.selectedPatientObj.IsHighRiskInd = patientitem.IsHighRiskInd || false;

                $scope.selectedPatientTitle = patientitem.Title;
                $scope.selectedPatientAge = "";
                if (patientitem.CurrentAge !== undefined) {
                    $scope.selectedPatientAge = patientitem.CurrentAge.year + "y " + (patientitem.CurrentAge.month !== "0" ? (patientitem.CurrentAge.month + "m") : "");
                }
                $scope.selectedPatientGender = patientitem.Gender;
                $scope.selectedPatientNumber = patientitem.PhoneNumber !== 0 ? patientitem.PhoneNumber : "";
                $scope.selectedPatientImage = "";
                $scope.SelectedCountryCode = patientitem.CountryCode;
                $scope.selectedPatientObj.OccupationNotes = patientitem.OccupationNotes || "";
                $scope.selectedPatientObj.AlternatePhoneNo = patientitem.AlternatePhoneNo;
                $scope.selectedPatientObj.AlternateLandLine = patientitem.AlternateLandLine;
                $scope.selectedPatientObj.AltCountrycode = patientitem.AltCountryCode;
                $scope.selectedPatientObj.AltareaCode = patientitem.Altareacode;






                // $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
                $scope.PatientDetailsForRegisterObj.PatientID = patientitem.PatientId;
                $scope.PatientDetailsForRegisterObj.PatientId = patientitem.PatientId;
                $scope.PatientDetailsForRegisterObj.PatientTagId = patientitem.PatientTypeId || 0;
                $scope.PatientDetailsForRegisterObj.Title = patientitem.Title;
                $scope.PatientDetailsForRegisterObj.TitleId = patientitem.TitleId;
                $scope.PatientDetailsForRegisterObj.FirstName = patientitem.FirstName;
                $scope.PatientDetailsForRegisterObj.MiddleName = patientitem.MiddleName || '';
                $scope.PatientDetailsForRegisterObj.LastName = patientitem.LastName;
                $scope.PatientDetailsForRegisterObj.SecondLastName = patientitem.SecondLastName;
                $scope.PatientDetailsForRegisterObj.DOB = $filter("date")(patientitem.DOB, "MM-dd-yyyy");
                $scope.PatientDetailsForRegisterObj.ageinYears = patientitem.AgeInYears;
                $scope.PatientDetailsForRegisterObj.ageinMonths = patientitem.AgeInMonths.toString() || "";
                $scope.PatientDetailsForRegisterObj.ageinDays = patientitem.AgeInDays.toString() || "";
                $scope.PatientDetailsForRegisterObj.Age = $scope.PatientDetailsForRegisterObj.ageinYear + '.' + $scope.PatientDetailsForRegisterObj.ageinMonths;
                $scope.PatientDetailsForRegisterObj.Gender = patientitem.Gender;
                $scope.PatientDetailsForRegisterObj.SocialSecurityNo = patientitem.SocialSecurityNo || "";
                $scope.PatientDetailsForRegisterObj.MaritalStatusID = patientitem.MaritalStatusId || "";
                $scope.PatientDetailsForRegisterObj.BloodGroupId = patientitem.BloodGroupId || 0;
                $scope.PatientDetailsForRegisterObj.EmailID = patientitem.EmailID || "";
                $scope.PatientDetailsForRegisterObj.PatientDisplayID = patientitem.DisplayID;
                $scope.PatientDetailsForRegisterObj.HomeCountryCode = patientitem.HomeCountryCode || "";
                $scope.PatientDetailsForRegisterObj.HomeAreaCode = patientitem.HomeAreaCode || "";
                $scope.PatientDetailsForRegisterObj.HomeNumber = patientitem.HomeNumber || "";
                $scope.PatientDetailsForRegisterObj.OfficeCountryCode = patientitem.OfficeCountryCode || "";
                $scope.PatientDetailsForRegisterObj.OfficeAreaCode = patientitem.OfficeAreaCode || "";
                $scope.PatientDetailsForRegisterObj.OfficeNumber = patientitem.OfficeNumber || "";
                $scope.PatientDetailsForRegisterObj.Fullname = patientitem.Fullname || "";
                $scope.PatientDetailsForRegisterObj.S3URL = patientitem.S3URL || "";
                $scope.PatientDetailsForRegisterObj.PatientTagId = patientitem.PatientTagId || "";
                $scope.PatientDetailsForRegisterObj.PatientTagName = patientitem.PatientTagName || "";
                $scope.PatientDetailsForRegisterObj.HospitalEquipmentId = patientitem.PatientTagId || null;

                // multile tag patient cases
                $scope.HospitalEquipmentList = $scope.HospitalEquipmentList || [];
                let selectedPatientTags = [];
                selectedPatientTags = angular.copy($scope.HospitalEquipmentList);
                if (patientitem.PatientTagList.length > 0) {
                    angular.forEach(patientitem.PatientTagList, function (item) {
                        angular.forEach(selectedPatientTags, function (kitem) {
                            if (kitem.HospitalEquipmentId === item.HospitalEquipmentId) {
                                kitem.IsChecked = true;
                            }
                        });
                    });
                }

                $scope.HospitalEquipmentList = angular.copy(selectedPatientTags);

                $scope.PatientDetailsForRegisterObj.EmeregecyContactNo = patientitem.EmeregecyContactNo || "";
                $scope.PatientDetailsForRegisterObj.EmergencyContactName = patientitem.EmergencyContactName || "";
                $scope.PatientDetailsForRegisterObj.EmployerPhoneNo = patientitem.EmployerPhoneNo || "";
                $scope.PatientDetailsForRegisterObj.OccupationId = patientitem.OccupationId || "";
                $scope.PatientDetailsForRegisterObj.OccupationDescription = patientitem.OccupationDescription || "";

                $scope.PatientDetailsForRegisterObj.FatherName = patientitem.FatherName || "";
                $scope.PatientDetailsForRegisterObj.MotherName = patientitem.MotherName || "";
                $scope.PatientDetailsForRegisterObj.Guardian = patientitem.Guardian || "";
                $scope.PatientDetailsForRegisterObj.Employer = patientitem.Employer || "";

                $scope.PatientDetailsForRegisterObj.IsPatientSmsInd = patientitem.IsPatientSmsInd || false;
                $scope.PatientDetailsForRegisterObj.IsPatientEmailInd = patientitem.IsPatientEmailInd || false;
                $scope.selectedAppointmentObject.SendPatientSms = patientitem.IsPatientSmsInd || false;
                $scope.selectedAppointmentObject.SendPatientEmail = patientitem.IsPatientEmailInd || false;
                $scope.PatientDetailsForRegisterObj.AuthorizationId = "";
                $scope.sendPatientSms = patientitem.IsPatientSmsInd || false;
                $scope.sendPatientEmail = patientitem.IsPatientEmailInd || false;

                if ($scope.PatientDetailsForRegisterObj.IsPatientSmsInd && !$scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                    $scope.PatientDetailsForRegisterObj.AuthorizationId = 1;
                }
                else if (!$scope.PatientDetailsForRegisterObj.IsPatientSmsInd && $scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                    $scope.PatientDetailsForRegisterObj.AuthorizationId = 2;
                }
                else if ($scope.PatientDetailsForRegisterObj.IsPatientSmsInd && $scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                    $scope.PatientDetailsForRegisterObj.AuthorizationId = 3;
                }
                else if (!$scope.PatientDetailsForRegisterObj.IsPatientSmsInd && $scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                    $scope.PatientDetailsForRegisterObj.AuthorizationId = 4;
                }


                var phoneNumberString = $scope.PatientDetailsForRegisterObj.HomeAreaCode + $scope.PatientDetailsForRegisterObj.HomeNumber;
                $scope.formatUSNumber(phoneNumberString);

                if ($scope.PatientDetailsForRegisterObj.OfficeAreaCode != "" && $scope.PatientDetailsForRegisterObj.OfficeNumber != "") {
                    var officeNumberString = $scope.PatientDetailsForRegisterObj.OfficeAreaCode + $scope.PatientDetailsForRegisterObj.OfficeNumber;
                    $scope.changeOfficeNumber(officeNumberString);
                }


                $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
                $scope.selectedPatientObj.PatientName = '';
                $scope.selectedPatientObj.PatientDisplayId = '';
                $scope.selectedPatientObj.OldPatientDisplayId = '';

                $scope.getPatientInsuranceDetailsOfPatient(patientitem);

                patientitem.PhoneNumber = patientitem.PhoneNumber || "";
                if (patientitem.PhoneNumber != "") {
                    var phnnumber = eHnoteUserDataService.UsMobileFormatChange(patientitem.PhoneNumber);
                    $scope.selectedPatientObj.TempPhNumber = phnnumber.UsFormatMobileNumber;
                } else {
                    $scope.selectedPatientObj.TempPhNumber = "";
                }

                if (patientitem.OfficeNumber != '') {
                    var AlternateMobile = patientitem.OfficeAreaCode + patientitem.OfficeNumber;
                    var AlternateObj = eHnoteUserDataService.UsMobileFormatChange(AlternateMobile) || {};
                    $scope.selectedPatientObj.AlternateMobileNo = AlternateObj.UsFormatMobileNumber || "";
                } else {
                    $scope.selectedPatientObj.AlternateMobileNo = "";
                }

                $scope.type = $scope.type || '';
                if ($scope.type === 'op' || $scope.type === 'ASC') {
                    $scope.navtoContinuetoBookAppointmentScreen();
                }
            }

        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }
    }

    $scope.formatUSNumber = function (phoneNumberString) {
        $scope.USnumberString = phoneNumberString || "";
        if ($scope.USnumberString != "") {
            console.log($scope.USnumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            $scope.PatientDetailsForRegisterObj.DisplayNumber = part1 + part2 + part3;

            if ($scope.USnumberString.length > 9) {
                var Area = $scope.USnumberString.slice(0, 3);
                $scope.PatientDetailsForRegisterObj.HomeAreaCode = Area;
                var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                $scope.PatientDetailsForRegisterObj.HomeNumber = contact;
            }
        } else {
            $scope.PatientDetailsForRegisterObj.DisplayNumber = "";
            $scope.PatientDetailsForRegisterObj.HomeAreaCode = "";
            $scope.PatientDetailsForRegisterObj.HomeNumber = "";
        }
    }

    $scope.changeOfficeNumber = function (item) {
        item = item.toString() || "";
        if (item != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            if (obj != undefined) {
                if (obj.MobileNumber.length > 9) {
                    var Area = obj.MobileNumber.slice(0, 3);
                    $scope.PatientDetailsForRegisterObj.OfficeAreaCode = Area;
                    var contact = obj.MobileNumber.substring(3, (obj.MobileNumber.toString()).length);
                    $scope.PatientDetailsForRegisterObj.OfficeNumber = contact;
                }
                else if (obj.MobileNumber.length <= 9) {
                    var Area = obj.MobileNumber.slice(0, 3);
                    $scope.PatientDetailsForRegisterObj.OfficeAreaCode = Area;
                    var contact = obj.MobileNumber.substring(3, (obj.MobileNumber.toString()).length);
                    $scope.PatientDetailsForRegisterObj.OfficeNumber = contact;
                }
                $scope.PatientDetailsForRegisterObj.DisplayOfficeNumber = obj.UsFormatMobileNumber || "";
            }
        } else {
            $scope.PatientDetailsForRegisterObj.DisplayOfficeNumber = "";
            $scope.PatientDetailsForRegisterObj.OfficeAreaCode = "";
            $scope.PatientDetailsForRegisterObj.OfficeNumber = "";
        }
    };

    $scope.SearchPayorListByText = function (SearchText) {
        var param = {
            "SearchText": SearchText || "",
            "Status": "Active",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "GetAllIndicator": 0,
            "PayorId": 0,
            "PayorTypeId": 0
        };
        return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
            if (resp.data.count !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };


    $scope.onSelectInsurancePayor = function (obj, mainitem) {
        $scope.PatientInsuranceObj.payorPlansListArray = [];
        $scope.PatientInsuranceObj.PayorId = obj.PayorId;
        $scope.PatientInsuranceObj.PayorName = obj.PayorName;
        $scope.PatientInsuranceObj.PayorCode = obj.PayorCode;
        $scope.PatientInsuranceObj.OrganizationPayorId = obj.OrganizationPayorId;
        $scope.PatientInsuranceObj.PayorObj = mainitem.PayorCode;
        $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = obj.AppointmentInsuranceDetailId;
    };

    $scope.chnageInsurancespayor = function (mainitem) {
        mainitem.PlanObj = '';
        mainitem.PlanTypeId = '';
        mainitem.PlanId = '';
        mainitem.PayorId = '';
    };

    $scope.GetOrganizationPayorPlansList = function (obj, mainitem) {
        mainitem.PayorId = mainitem.PayorId || 0;

        mainitem.payorPlansListArray = [];
        // mainitem.PayorId = mainitem.PayorObj.PayorId || 0;
        var param = {
            "SearchText": obj || "",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "OrganizationPayorId": mainitem.OrganizationPayorId,
            "GetAllIndicator": 0,
            "Status": 1
        }
        return eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (response) {
            if (response.data.rows !== undefined) {
                return response.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };

    $scope.ChangePayorPlan = function (mainitem) {
        if (mainitem.PlanObj == null || mainitem.PlanObj == "") {
            mainitem.PlanId = 0;
            return false;
        }
        //mainitem.PayorId = mainitem.PlanObj.PayorId;
        //mainitem.PayorName = mainitem.PlanObj.PayorName;
        mainitem.PlanId = mainitem.PlanObj.PlanId;
        mainitem.PlanCode = mainitem.PlanObj.PlanCode;
        mainitem.PlanTypeId = mainitem.PlanObj.PlanTypeId;
        mainitem.CoverageId = mainitem.PlanObj.PayorTypeId;
        mainitem.PlanCode = mainitem.PlanCode;
        mainitem.OrganizationPayorId = mainitem.PlanObj.OrganizationPayorId;
        //var obj = {
        //    "PayorId": mainitem.PlanObj.PayorId,
        //    "PayorName": mainitem.PlanObj.PayorName,
        //    "PayorCode": mainitem.PlanObj.PayorCode,
        //    "OrganizationPayorId": mainitem.PlanObj.OrganizationPayorId,
        //    "OrganizationPayorName": mainitem.PlanObj.OrganizationPayorName,
        //}

        //mainitem.PayorObj = obj;


    };

    $scope.changeplan = function (item) {
        item = item || "";
        if (item == "") {
            $scope.PatientInsuranceObj.PolicyId = "";
            $scope.PatientInsuranceObj.GroupId = "";
        }
        $scope.PatientInsuranceObj.CoverageId = 0;
        // $scope.PatientInsuranceObj.PayorId = 0;
        $scope.PatientInsuranceObj.PlanId = 0;
        $scope.PatientInsuranceObj.PlanTypeId = 0;
    };
    $scope.ChangeInsurancePayor = function (obj, mainitem) {
        $scope.PatientInsuranceObj.payorPlansListArray = [];
        $scope.PatientInsuranceObj.PayorId = obj.PayorId;
        $scope.PatientInsuranceObj.PayorName = obj.PayorName;
        $scope.PatientInsuranceObj.PayorCode = obj.PayorCode;
        $scope.PatientInsuranceObj.OrganizationPayorId = obj.OrganizationPayorId;
        $scope.PatientInsuranceObj.PayorObj = mainitem.PayorCode;
        $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = obj.AppointmentInsuranceDetailId;
        $scope.PatientInsuranceObj.PlanObj = '';
        $scope.PatientInsuranceObj.PlanTypeId = '';
        $scope.PatientInsuranceObj.PlanId = '';
    };
    $scope.changePatientInsurance = function (item, type, Ind) {

        if (Ind == 'PrimaryCheck') {
            if ($scope.patientInsuranceTpasArray.length > 1) {
                var filter1 = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 1 }, true) || [];
                if (filter1.length > 0) {
                    $scope.PatientInsuranceObj = angular.copy(filter1[0]);
                    $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                    $scope.PatientInsuranceObj.PayorObj = angular.copy($scope.PatientInsuranceObj.PayorCode);
                    $scope.PatientInsuranceObj.setprimary = true;
                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = filter1[0];
                    $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                } else {
                    $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                    $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                    $scope.PatientInsuranceObj.PayorObj = angular.copy($scope.PatientInsuranceObj.PayorCode);
                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                    $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                }
            }
        }

        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj || "";
        $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj = $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj || "";
        if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj == "") {
            $scope.paymentTypeObj.PaymentTypeId = "1";
            $scope.paymentTypeObj.IsPaymentTypeInd = true;

            $scope.PatientInsuranceObj = GetInsuranceObj();
            return false;
        } else {
            $scope.paymentTypeObj.PaymentTypeId = "2";
            $scope.paymentTypeObj.IsPaymentTypeInd = false;
            if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj != '') {
                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.IdentifierId = 1;
            }
        }

        var IdentifierId = 1;
        if (type == "Primary") {
            if ($scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj != "") {
                if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.PatientInsuranceDetailId === $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj.PatientInsuranceDetailId) {

                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
                    alertify.error('You have already Selected this Insurance');
                }
            }
            $scope.PatientInsuranceObj = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj;
            $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
            $scope.PatientInsuranceObj.PayorObj = angular.copy($scope.PatientInsuranceObj.PayorCode);
            $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.PatientAppointmentInsuranceDetailId;
              
            if ($scope.PatientInsuranceObj.IdentifierId === 1) {
                $scope.PatientInsuranceObj.setprimary = true;
            } else {
                $scope.PatientInsuranceObj.setprimary = false;
            }
            $scope.PatientInsuranceObj.IsGroupIdDiasibleInd = false;
            $scope.PatientInsuranceObj.IsPolicyIdDiasibleInd = false;
            $scope.PatientInsuranceObj.IsPayorPlanDiasibleInd = false;
            if ($scope.patientInsuranceTpasArray.length > 0) {
                angular.forEach($scope.patientInsuranceTpasArray, function (item) {
                    if (item.GroupId == '') {
                        $scope.PatientInsuranceObj.IsGroupIdDiasibleInd = false;
                    } else {
                        $scope.PatientInsuranceObj.IsGroupIdDiasibleInd = true;
                    }
                    if (item.PolicyId == '') {
                        $scope.PatientInsuranceObj.IsPolicyIdDiasibleInd = false;
                    } else {
                        $scope.PatientInsuranceObj.IsPolicyIdDiasibleInd = true;
                    }
                    if (item.PlanName == '') {
                        $scope.PatientInsuranceObj.IsPayorPlanDiasibleInd = false;
                    } else {
                        $scope.PatientInsuranceObj.IsPayorPlanDiasibleInd = true;
                    }
                });
            }
        }
    }
    $scope.changePaymentTypeNew = function (checked) {
        if (checked == true) {
            $scope.paymentTypeObj.PaymentTypeId = "1";
            $scope.paymentTypeObj.IsPaymentTypeInd = true;

            $scope.ShowAddNewInsurance = true;
            $scope.PatientInsuranceObj = GetInsuranceObj();
            //$scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";

        } else {
            //$scope.paymentTypeObj.PaymentTypeId = "2";
            //$scope.paymentTypeObj.IsPaymentTypeInd = false;
            $scope.ShowAddNewInsurance = true;
            $scope.PatientInsuranceObj = GetInsuranceObj();
         /*   $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";*/
            if ($scope.patientInsuranceTpasArray.length > 0) {
                if ($scope.patientInsuranceTpasArray.length === 1) {
                    $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                    $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                    $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;

                    $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.AppointmentInsuranceDetailId;
                }
                else if ($scope.patientInsuranceTpasArray.length > 1) {
                    var filter1 = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 1 }, true) || [];
                    if (filter1.length > 0) {
                        $scope.PatientInsuranceObj = angular.copy(filter1[0]);
                        $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                        $scope.PatientInsuranceObj.setprimary = true;
                        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = filter1[0];
                        $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.AppointmentInsuranceDetailId;
                        $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                    } else {
                        $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                        $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                        $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.AppointmentInsuranceDetailId;
                        $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                    }
                }
                $scope.paymentTypeObj.PaymentTypeId = "2";
                $scope.paymentTypeObj.IsPaymentTypeInd = false;
            }
            else {
                $scope.paymentTypeObj.PaymentTypeId = "2";
                $scope.paymentTypeObj.IsPaymentTypeInd = false;
            }
            $scope.PatientInsuranceObj.PatientFirstName = angular.copy($scope.PatientDetailsForRegisterObj.FirstName) || "";
            $scope.PatientInsuranceObj.PatientLastName = angular.copy($scope.PatientDetailsForRegisterObj.LastName) || "";
            $scope.PatientInsuranceObj.PatientSecondLastName = angular.copy($scope.PatientDetailsForRegisterObj.SecondLastName) || "";
            $scope.PatientInsuranceObj.PatientMiddleName = angular.copy($scope.PatientDetailsForRegisterObj.MiddleName) || "";
        }
    }

    $scope.ChangeSetprimary = function (checked) {
        if (checked == true) {
            $scope.PatientInsuranceObj.IdentifierId = 1;
        } else {
            $scope.PatientInsuranceObj.IdentifierId = 2;
        }
    };
    $scope.Addinsurance = function () {
        $scope.ShowAddNewInsurance = true;
        $scope.PatientInsuranceObj = GetInsuranceObj();
        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
        $scope.paymentTypeObj.PaymentTypeId = "2";
        $scope.paymentTypeObj.IsPaymentTypeInd = false;
    }


    $scope.changePatientAuthorization = function (AuthorizationId) {
        if (AuthorizationId === null) {
            $scope.PatientDetailsForRegisterObj.AuthorizationId = "";
            return false;
        }

        $scope.PatientDetailsForRegisterObj.AuthorizationId = AuthorizationId || "";
        if ($scope.PatientDetailsForRegisterObj.AuthorizationId == 1) {
            $scope.PatientDetailsForRegisterObj.IsPatientSmsInd = true;
            $scope.PatientDetailsForRegisterObj.IsPatientEmailInd = false;
            $scope.sendPatientSms = true;
            $scope.sendPatientEmail = false;
            //new implementation
            $scope.selectedAppointmentObject.SendPatientSms = true;
            $scope.selectedAppointmentObject.SendPatientEmail = false;
            //$scope.selectedAppointmentObject.SendDocSms = true;
            //$scope.selectedAppointmentObject.SendDocEmail = false;
            
        }
        else if ($scope.PatientDetailsForRegisterObj.AuthorizationId == 2) {
            $scope.PatientDetailsForRegisterObj.IsPatientSmsInd = false;
            $scope.PatientDetailsForRegisterObj.IsPatientEmailInd = true;

            $scope.sendPatientEmail = true;
            $scope.sendPatientSms = false;
             //new implementation
            $scope.selectedAppointmentObject.SendPatientSms = false;
            $scope.selectedAppointmentObject.SendPatientEmail = true;
            //$scope.selectedAppointmentObject.SendDocSms = false;
            //$scope.selectedAppointmentObject.SendDocEmail = true;
          
        }
        else if ($scope.PatientDetailsForRegisterObj.AuthorizationId == 3) {
            $scope.PatientDetailsForRegisterObj.IsPatientSmsInd = true;
            $scope.PatientDetailsForRegisterObj.IsPatientEmailInd = true;

            $scope.sendPatientSms = true;
            $scope.sendPatientEmail = true;
            //new implementation
            $scope.selectedAppointmentObject.SendPatientSms = true;
            $scope.selectedAppointmentObject.SendPatientEmail = true;
            //$scope.selectedAppointmentObject.SendDocSms = true;
            //$scope.selectedAppointmentObject.SendDocEmail = true;
           
        }
        else if ($scope.PatientDetailsForRegisterObj.AuthorizationId == 4) {
            $scope.PatientDetailsForRegisterObj.IsPatientSmsInd = false;
            $scope.PatientDetailsForRegisterObj.IsPatientEmailInd = false;

            $scope.sendPatientEmail = false;
            $scope.sendPatientSms = false;
            //new implementation
            $scope.selectedAppointmentObject.SendPatientSms = false;
            $scope.selectedAppointmentObject.SendPatientEmail = false;
            //$scope.selectedAppointmentObject.SendDocSms = false;
            //$scope.selectedAppointmentObject.SendDocEmail = false;
           
        }

    };



    $scope.BlurPatientFirstName = function () {
        $scope.PatientInsuranceObj.PatientFirstName = angular.copy($scope.PatientDetailsForRegisterObj.FirstName) || "";
    }
    $scope.BlurPatientLastName = function () {
        $scope.PatientInsuranceObj.PatientLastName = angular.copy($scope.PatientDetailsForRegisterObj.LastName) || "";
    }
    $scope.BlurPatientSecondLastName = function () {
        $scope.PatientInsuranceObj.PatientSecondLastName = angular.copy($scope.PatientDetailsForRegisterObj.SecondLastName) || "";
    }
    $scope.BlurPatientMiddleName = function () {
        $scope.PatientInsuranceObj.PatientMiddleName = angular.copy($scope.PatientDetailsForRegisterObj.MiddleName) || "";
    }
    //$scope.BlurPatientPreviousName = function () {
    //    $scope.PatientInsuranceObj.PreviousName = angular.copy($scope.PatientDetailsForRegisterObj.PreviousName) || "";
    //} 



    $scope.AddupdatePatientDetailsToContinue = function () {

        if ($scope.PatientDetailsForRegisterObj.FirstName === "") {
            alertify.error("Please Enter Patient First Name");
            return false;
        }
        if ($scope.PatientDetailsForRegisterObj.FirstName.length < 3) {
            alertify.error("Please Enter Patient First Name");
            return false;
        }
        $scope.PatientDetailsForRegisterObj.LastName = $scope.PatientDetailsForRegisterObj.LastName || "";
        if ($scope.PatientDetailsForRegisterObj.LastName === "") {
            alertify.error("Please Enter Patient Last Name");
            return false;
        }
        $scope.PatientDetailsForRegisterObj.SecondLastName = $scope.PatientDetailsForRegisterObj.SecondLastName || "";
        if ($scope.IsSecondLastNameMandatory) {
            if ($scope.PatientDetailsForRegisterObj.SecondLastName === "") {
                alertify.error("Please Enter Patient Second Last Name");
                return false;
            }
        }

        if ($scope.PatientDetailsForRegisterObj.DOB === "") {
            alertify.error("Please Enter Patient DOB");
            return false;
        }
        if ($scope.PatientDetailsForRegisterObj.Gender === "") {
            alertify.error("Please Enter Patient Gender");
            return false;
        }
        if ($scope.PatientDetailsForRegisterObj.EmailID === undefined) {
            alertify.error("Please Enter Valid Email ID");
            return false;
        }
        $scope.PatientDetailsForRegisterObj.HomeAreaCode = $scope.PatientDetailsForRegisterObj.HomeAreaCode || '';
        if ($scope.PatientDetailsForRegisterObj.HomeAreaCode == '' || ($scope.PatientDetailsForRegisterObj.HomeAreaCode.toString()).length < 2) {
            alertify.error("Please Enter Your Mobile Number");
            return false;
        }
        var HomeAreaCode = angular.copy($scope.PatientDetailsForRegisterObj.HomeAreaCode) || "";
        if ((HomeAreaCode.toString()).length < 3) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }
        var MobileNumber = angular.copy($scope.PatientDetailsForRegisterObj.HomeNumber) || "";
        if ((MobileNumber.toString()).length != 7) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }

        $scope.PatientDetailsForRegisterObj.OfficeAreaCode = $scope.PatientDetailsForRegisterObj.OfficeAreaCode || '';
        if ($scope.PatientDetailsForRegisterObj.OfficeAreaCode != '' || $scope.PatientDetailsForRegisterObj.OfficeNumber != '') {
            if (($scope.PatientDetailsForRegisterObj.OfficeAreaCode.toString()).length < 2) {
                alertify.error("Please Enter Valid Alternate Number");
                return false;
            }
        }
        var Contactnumber = angular.copy($scope.PatientDetailsForRegisterObj.OfficeNumber) || "";
        if ($scope.PatientDetailsForRegisterObj.OfficeAreaCode != '' || $scope.PatientDetailsForRegisterObj.OfficeNumber != '') {
            if ((Contactnumber.toString()).length != 7) {
                alertify.error("Please Enter Valid Alternate Number");
                return false;
            }
        }
        var SSNno = angular.copy($scope.PatientDetailsForRegisterObj.SocialSecurityNo) || "";
        SSNno = SSNno.toString();
        if (SSNno != "" && SSNno.length !== "" && SSNno.length < 4) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter Valid SSN Number");
            return false;
        }

        $scope.PatientTagList = [];
        let selectedpatientTagsList = $filter('filter')($scope.HospitalEquipmentList, { 'IsChecked': true }, true);
        $scope.PatientTagList = angular.copy(selectedpatientTagsList);

        var PatientandInsuranceDetails = {};
        var patientRegister = {
            "UserId": $scope.PatientDetailsForRegisterObj.UserId,
            "HospitalId": $scope.PatientDetailsForRegisterObj.HospitalId,
            "PatientId": $scope.PatientDetailsForRegisterObj.PatientID || 0,
            "TitleId": $scope.PatientDetailsForRegisterObj.TitleId,
            "FirstName": $scope.PatientDetailsForRegisterObj.FirstName,
            "MiddleName": $scope.PatientDetailsForRegisterObj.MiddleName || '',
            "LastName": $scope.PatientDetailsForRegisterObj.LastName,
            "SecondLastName": $scope.PatientDetailsForRegisterObj.SecondLastName,
            "PreviousName": $scope.PatientDetailsForRegisterObj.PreviousName,
            "DOB": $filter("date")(new Date($scope.PatientDetailsForRegisterObj.DOB), "yyyy-MM-dd") || "",
            "Age": $scope.PatientDetailsForRegisterObj.ageinYears,
            "SSN": $scope.PatientDetailsForRegisterObj.SocialSecurityNo,
            "Gender": $scope.PatientDetailsForRegisterObj.Gender,
            //"PatientTagId": $scope.HospitalEquipmentId || null,
            "PatientTagId": $scope.PatientDetailsForRegisterObj.HospitalEquipmentId || null,
            "MaritalStatusId": $scope.PatientDetailsForRegisterObj.MaritalStatusID || null,
            "BloodGroupId": $scope.PatientDetailsForRegisterObj.BloodGroupId || null,
            "LeadSourceInd": "N",
            "PatientS3Url": $scope.PatientDetailsForRegisterObj.S3URL || "",
            "EmailID": $scope.PatientDetailsForRegisterObj.EmailID,
            "FullName": $scope.PatientDetailsForRegisterObj.FirstName + $scope.PatientDetailsForRegisterObj.LastName || "",
            "DeviceEntityTypeId": 2,
            "HomeCountryCode": $scope.PatientDetailsForRegisterObj.HomeCountryCode || "",
            "HomeAreaCode": $scope.PatientDetailsForRegisterObj.HomeAreaCode || "",
            "HomeNumber": $scope.PatientDetailsForRegisterObj.HomeNumber || "",
            "OfficeCountryCode": $scope.PatientDetailsForRegisterObj.OfficeCountryCode || "",
            "OfficeAreaCode": $scope.PatientDetailsForRegisterObj.OfficeAreaCode || "",
            "OfficeNumber": $scope.PatientDetailsForRegisterObj.OfficeNumber || "",
            "FaxNumber": $scope.PatientDetailsForRegisterObj.FaxNumber || "",
            "Faxcountrycode": $scope.PatientDetailsForRegisterObj.Faxcountrycode || "",
            "FaxAreacode": $scope.PatientDetailsForRegisterObj.FaxAreacode || "",
            "FaxHomeNumber": $scope.PatientDetailsForRegisterObj.FaxHomeNumber || "",
            "IsPatientSmsInd": $scope.PatientDetailsForRegisterObj.IsPatientSmsInd,
            "IsPatientEmailInd": $scope.PatientDetailsForRegisterObj.IsPatientEmailInd,
            "IsNoMR": false,
            "OccupationId": cacheStorageItem.OccupationId || null,
            "OccupationDescription": $scope.PatientDetailsForRegisterObj.OccupationDescription || "",
            "EmployerPhoneNo": $scope.PatientDetailsForRegisterObj.EmployerPhoneNo,
            "EmergencyContactName": $scope.PatientDetailsForRegisterObj.EmergencyContactName,
            "EmeregecyContactNo": $scope.PatientDetailsForRegisterObj.EmeregecyContactNo,
            "FatherName": $scope.PatientDetailsForRegisterObj.FatherName || "",
            "MotherName": $scope.PatientDetailsForRegisterObj.MotherName || "",
            "Guardian": $scope.PatientDetailsForRegisterObj.Guardian || "",
            "Employer": $scope.PatientDetailsForRegisterObj.Employer || "",
            "PatientTagList": $scope.PatientTagList
        };
        if (patientRegister.PatientId == 0) {
            patientRegister.IsNoMR = true;
        }
        PatientandInsuranceDetails.PatientDeatils = patientRegister;


        var insuranceObj = {
            "PatientId": $scope.PatientDetailsForRegisterObj.PatientID || 0,
            "FullName": $scope.PatientDetailsForRegisterObj.Fullname || "",
            "UserId": eHnoteMasterDataService.getLoginId(),
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PatientInsuranceDetails": []
        }

        $scope.PatientInsuranceObj.PayorId = $scope.PatientInsuranceObj.PayorId || 0;
        $scope.PatientInsuranceObj.CoverageId = $scope.PatientInsuranceObj.CoverageId || 0;
        $scope.PatientInsuranceObj.PlanId = $scope.PatientInsuranceObj.PlanId || 0;
        $scope.PatientInsuranceObj.PolicyId = $scope.PatientInsuranceObj.PolicyId || "";
        $scope.PatientInsuranceObj.PlanCode = $scope.PatientInsuranceObj.PlanCode || "";
        $scope.IsCheckOldInsurance = false;
        if ($scope.PatientInsuranceObj.PayorId != 0 || $scope.PatientInsuranceObj.CoverageId != 0 || $scope.PatientInsuranceObj.PlanId != 0 || $scope.PatientInsuranceObj.PolicyId != "" || $scope.PatientInsuranceObj.PlanCode != "" || $scope.PatientInsuranceObj.PolicyId != "" || $scope.PatientInsuranceObj.GroupId != "") {

            $scope.PatientInsuranceObj.PatientFirstName = $scope.PatientInsuranceObj.PatientFirstName || "";
            if ($scope.PatientInsuranceObj.PatientFirstName === "") {
                $scope.PatientInsuranceObj.PatientFirstName = $scope.PatientDetailsForRegisterObj.FirstName || "";
            }
            if ($scope.PatientInsuranceObj.PatientFirstName === "") {
                alertify.error("Please Patient First Name");
                return false;
            }

            $scope.PatientInsuranceObj.PatientLastName = $scope.PatientInsuranceObj.PatientLastName || "";

            if ($scope.PatientInsuranceObj.PatientLastName === "") {
                $scope.PatientInsuranceObj.PatientLastName = $scope.PatientDetailsForRegisterObj.LastName || "";
            }
            if ($scope.PatientDetailsForRegisterObj.PatientLastName === "") {
                alertify.error("Please Patient Last Name");
                return false;
            }
            $scope.PatientInsuranceObj.PatientSecondLastName = $scope.PatientInsuranceObj.PatientSecondLastName || "";
            if ($scope.IsSecondLastNameMandatory) {
                if ($scope.PatientDetailsForRegisterObj.PatientSecondLastName === "") {
                    alertify.error("Please Patient Second Last Name");
                    return false;
                }
            }

            $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorObj || '';
            $scope.PatientInsuranceObj.PlanObj = $scope.PatientInsuranceObj.PlanObj || '';
            $scope.PatientInsuranceObj.PolicyId = $scope.PatientInsuranceObj.PolicyId || '';
            $scope.PatientInsuranceObj.GroupId = $scope.PatientInsuranceObj.GroupId || '';
            if ($scope.PatientInsuranceObj.PayorObj == '' && $scope.PatientInsuranceObj.PlanObj !== '') {
                $scope.ValidateIndictor = true;
                alertify.error("Please Select Patient Payor");
                return false;
            }
            else if ($scope.PatientInsuranceObj.PayorObj == '' && $scope.PatientInsuranceObj.PolicyId !== '') {
                $scope.ValidateIndictor = true;
                alertify.error("Please Select Patient Payor");
                return false;
            }
            else if ($scope.PatientInsuranceObj.PayorObj == '' && $scope.PatientInsuranceObj.GroupId !== '') {
                $scope.ValidateIndictor = true;
                alertify.error("Please Select Patient Payor");
                return false;
            }


            var TempInsuarance = $scope.PatientInsuranceObj;

            TempInsuarance.CoverageId = TempInsuarance.CoverageId || null;

            TempInsuarance.PayorId = TempInsuarance.PayorId || null;
            TempInsuarance.PlanId = TempInsuarance.PlanId || null;
            TempInsuarance.OrganizationPayorId = TempInsuarance.OrganizationPayorId || null;

            if (TempInsuarance.ExpiryDate != "") {
                TempInsuarance.ExpiryDate = $filter('date')(TempInsuarance.ExpiryDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.EffectiveDate != "") {
                TempInsuarance.EffectiveDate = $filter('date')(TempInsuarance.EffectiveDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.ScanDate != "") {
                TempInsuarance.ScanDate = $filter('date')(TempInsuarance.ScanDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.VerifiedDate != "") {
                TempInsuarance.VerifiedDate = $filter('date')(TempInsuarance.VerifiedDate, 'yyyy-MM-dd');
            }

            if (TempInsuarance.RelationShipId == 1 && TempInsuarance.PatientInsuranceDetailId == 0) {
                TempInsuarance.InsuredPersonFirstName = patientRegister.FirstName;
                TempInsuarance.InsuredPersonGenderID = patientRegister.Gender == "Male" ? 'M' : 'F';
                TempInsuarance.InsuredPersonDOB = patientRegister.DOB;
                TempInsuarance.InsuredPersonSSN = "";
                TempInsuarance.InsuredPersonMiddleName = patientRegister.MiddleName;
                TempInsuarance.InsuredPersonLastName = patientRegister.LastName;
            }
            if (TempInsuarance.PatientInsuranceDetailId == 0) {
                TempInsuarance.PatientFirstName = patientRegister.FirstName;
                TempInsuarance.PatientLastName = patientRegister.LastName;
                TempInsuarance.PatientDOB = patientRegister.DOB;
                TempInsuarance.PatientSSN = patientRegister.SSN;
            }

            insuranceObj.PatientInsuranceDetails.push(TempInsuarance);
            $scope.paymentTypeObj.PaymentTypeId = "2";
            $scope.paymentTypeObj.IsPaymentTypeInd = false;


        } else {
            $scope.paymentTypeObj.PaymentTypeId = "1";
            $scope.paymentTypeObj.IsPaymentTypeInd = true;
        }
        PatientandInsuranceDetails.PatientInsuranceList = angular.copy(insuranceObj);
        if ($scope.paymentTypeObj.IsPaymentTypeInd == false) {
            $scope.CarryPatientInsurancetoBookApt = angular.copy(insuranceObj.PatientInsuranceDetails) || [];
        }
        else {
            $scope.CarryPatientInsurancetoBookApt = [];
        }


        eHnoteUserAppointmentDataService.AddUpdatePatientRegisterandInsuarnceDeatils(PatientandInsuranceDetails).then(function (response) {
            if (response != undefined) {
                if (response.data != undefined) {
                    if (response.data.PatientDeatils.status == "success") {
                        var PatientDetails1 = response.data.PatientDeatils || "";
                        var insuranceDetails1 = response.data.InsuranceDetails || "";
                        $scope.BookApptShowArray = [];
                        if (PatientDetails1 != "") {
                            $scope.PatientDetailsForRegisterObj.PatientID = PatientDetails1.PatientId;
                            $scope.selectedPatientObj.PatientId = PatientDetails1.PatientId;
                            $scope.selectedPatientObj.FullName = PatientDetails1.FullName || "";
                            $scope.selectedPatientObj.AgeInYears = PatientDetails1.AgeInYears || "";
                            $scope.selectedPatientObj.AgeInMonths = PatientDetails1.AgeInMonths || "";
                            $scope.selectedPatientObj.AgeInDays = PatientDetails1.AgeInDays || "";
                            $scope.selectedPatientObj.PatientGender = PatientDetails1.Gender || "";

                            PatientDetails1.HomeNumber = PatientDetails1.HomeNumber || "";
                            if (PatientDetails1.HomeNumber != "") {
                                var phonenumber = PatientDetails1.HomeAreaCode + PatientDetails1.HomeNumber;
                                var mobileobj = eHnoteUserDataService.UsMobileFormatChange(phonenumber);
                                $scope.selectedPatientObj.TempPhNumber = mobileobj.UsFormatMobileNumber;
                            } else {
                                $scope.selectedPatientObj.TempPhNumber = "";
                            }

                            if (PatientDetails1.OfficeNumber != '') {
                                var AlternateMobile = PatientDetails1.OfficeAreaCode + PatientDetails1.OfficeNumber;
                                var AlternateObj = eHnoteUserDataService.UsMobileFormatChange(AlternateMobile) || {};
                                $scope.selectedPatientObj.AlternateMobileNo = AlternateObj.UsFormatMobileNumber || "";
                            } else {
                                $scope.selectedPatientObj.AlternateMobileNo = "";
                            }

                            if ($scope.selectedPatInfo == undefined) {
                                $scope.selectedPatInfo = {
                                    "EmailID": PatientDetails1.EmailId || ""
                                };
                            } else {
                                $scope.selectedPatInfo.EmailID = PatientDetails1.EmailId || "";
                            }

                        }
                        if (insuranceDetails1 != "" && insuranceDetails1 != undefined) {


                            if (insuranceDetails1.PatientInsuranceDetails.length > 0) {
                                $scope.patientInsuranceTpasArray = angular.copy(insuranceDetails1.PatientInsuranceDetails);
                                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";

                                if ($scope.paymentTypeObj.PaymentTypeId == 2 || $scope.paymentTypeObj.PaymentTypeId == "2") {
                                    if ($scope.PatientInsuranceObj != undefined) {
                                        if ($scope.PatientInsuranceObj.PatientInsuranceDetailId != 0) {
                                            var filterapptinsurance = $filter("filter")($scope.patientInsuranceTpasArray,function(item)
                                            {
                                                item.PatientAppointmentInsuranceDetailId = $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId || 0;
                                                item.PayorName = $scope.PatientInsuranceObj.OrganizationPayorName || "";
                                                return item.PatientInsuranceDetailId == $scope.PatientInsuranceObj.PatientInsuranceDetailId
                                            }) || [];
                                            if (filterapptinsurance.length > 0) {
                                                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = filterapptinsurance[0];
                                            }
                                        } else {
                                            var filterapptinsurance = $filter("filter")($scope.patientInsuranceTpasArray, { "OrganizationPayorId": $scope.PatientInsuranceObj.OrganizationPayorId, "PlanId": $scope.PatientInsuranceObj.PlanId, }, true) || [];
                                            if (filterapptinsurance.length > 0) {
                                                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = filterapptinsurance[0];
                                                $scope.PatientInsuranceObj.PatientInsuranceDetailId = filterapptinsurance[0].PatientInsuranceDetailId;
                                            }
                                        }
                                    }
                                    let InsuranceDetailId = $scope.CarryPatientInsurancetoBookApt[0].PatientInsuranceDetailId;
                                    if (InsuranceDetailId != 0) {
                                        $scope.BookApptShowArray = $filter('filter')($scope.patientInsuranceTpasArray, function (item) {
                                            return item.PatientInsuranceDetailId == InsuranceDetailId;
                                        });
                                    } else {
                                        let PayorId = $scope.CarryPatientInsurancetoBookApt[0].PayorId;
                                        $scope.BookApptShowArray = $filter('filter')($scope.patientInsuranceTpasArray, function (item) {
                                            return item.PayorId == PayorId;
                                        });
                                    }
                                }

                            } else {
                               /* $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";*/
                                $scope.BookApptShowArray = [];
                            }

                            
                        }
                        $scope.navtoContinuetoBookAppointmentScreen();

                    }
                }
            }
        }, function (error) {
            console.log(error);
        });
    };



    var calendarContainers = "";

    $scope.GetNewActiveDates = function (start_date, end_date, type) {


        var params = {
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "DoctorId": $scope.selectedAppointmentObject.DoctorID,
            "UserBranchId": $scope.selectedAppointmentObject.UserBranchId,
            "StartDate": $filter('date')(start_date, "yyyy-MM-dd"),
            "EndDate": $filter('date')(end_date, "yyyy-MM-dd"),
            "VisitReasonId": $scope.selectedAppointmentObject.VisitReasonId || null,
            "VisitTypeId": $scope.selectedAppointmentObject.VisitTypeId || null,
        };
        eHnoteMainAppointmentService.GetDoctorSlotsByVisitReasons(params, OnGetSuccess, OnGetError);

        function OnGetSuccess(resp) {
            if (resp.Status === "Success") {
                $scope.DocAvailableDates = [];
                if (resp.rows.length > 0 || resp.DoctorLeaveArray.length > 0 || resp.BranchHolidaysArray.length > 0) {
                    angular.forEach(resp.rows, function (kitem) {
                        kitem.IsDoctorMaxSlotsReached = kitem.IsDoctorMaxSlotsReached || false;
                        if (kitem.IsDoctorMaxSlotsReached == false) {
                            var obj = {
                                startDate: new Date(kitem.SlotDate + ' ' + "00:00:00"),
                                endDate: new Date(kitem.SlotDate + ' ' + "23:59:59"),
                                summary: 'Slot Available'
                            };
                            $scope.DocAvailableDates.push(obj);
                        }
                    });
                    $calendar.setEvents($scope.DocAvailableDates);

                    if (resp.DoctorLeaveArray.length > 0) {
                        $timeout(function () {
                            FocusDoctoronLeave(resp.DoctorLeaveArray);
                        }, 300);
                    }
                    if (resp.BranchHolidaysArray.length > 0) {
                        $timeout(function () {
                            FocusBranchHoliday(resp.BranchHolidaysArray);
                        }, 300);
                    }
                    if (type !== "FormMonth") {
                        FocusDateinCalendar();
                    }
                } else {
                    $scope.DocAvailableDates = [];
                    $calendar.setEvents($scope.DocAvailableDates);
                }
            }

        }
        function OnGetError(response) {

        }
    };

    $scope.GetActiveDates = function (start_date, end_date, type) {
        var t = "";
        console.log($scope.selectedAppointmentObject.AppointmentDate + "__$scope.selectedAppointmentObject.AppointmentDate");
        if ($scope.selectedAppointmentObject.AppointmentDate == '') {
            t = new Date();
        } else {
            t = start_date;
        }
        var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);

        if (t != undefined) {
            var StartDate = new Date(t);
            var t = new Date(StartDate.getFullYear(), StartDate.getMonth(), 1);
        }

        var params = {
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "DoctorId": $scope.selectedAppointmentObject.DoctorID,
            "UserBranchId": $scope.selectedAppointmentObject.UserBranchId,
            "StartDate": $filter('date')(t, "yyyy-MM-dd"),
            "EndDate": $filter('date')(endDate, "yyyy-MM-dd"),
            "VisitReasonId": $scope.selectedAppointmentObject.VisitReasonId || null,
            "VisitTypeId": $scope.selectedAppointmentObject.VisitTypeId || null,
        };
        eHnoteMainAppointmentService.GetDoctorSlotsByVisitReasons(params, OnGetSuccess, OnGetError);

        function OnGetSuccess(resp) {
            if (resp.Status === "Success") {
                $scope.DocAvailableDates = [];
                if (resp.rows.length > 0 || resp.DoctorLeaveArray.length > 0 || resp.BranchHolidaysArray.length > 0) {

                    angular.forEach(resp.rows, function (kitem) {
                        kitem.IsDoctorMaxSlotsReached = kitem.IsDoctorMaxSlotsReached || false;
                        if (kitem.IsDoctorMaxSlotsReached == false) {
                            var obj = {
                                startDate: new Date(kitem.SlotDate + ' ' + "00:00:00"),
                                endDate: new Date(kitem.SlotDate + ' ' + "23:59:59"),
                                summary: 'Slot Available'
                            };
                            $scope.DocAvailableDates.push(obj);
                        }
                    });
                    $calendar.setEvents($scope.DocAvailableDates);

                    if (resp.DoctorLeaveArray.length > 0) {
                        $timeout(function () {
                            FocusDoctoronLeave(resp.DoctorLeaveArray);
                        }, 300);
                    }
                    if (resp.BranchHolidaysArray.length > 0) {
                        $timeout(function () {
                            FocusBranchHoliday(resp.BranchHolidaysArray);
                        }, 300);
                    }

                    if (type !== "FormMonth") {
                        FocusDateinCalendar();
                    }
                } else {
                    $scope.DocAvailableDates = [];
                    $calendar.setEvents($scope.DocAvailableDates);
                    FocusDateinCalendar();
                }


            }

        }
        function OnGetError(response) {

        }
    };


    $scope.changeAppointmentDate = function (dt) {


        $scope.appStartDate = $filter("date")(new Date(dt), "MMM d, yyyy");
        if (new Date(dt).valueOf() < new Date().setHours(0, 0, 0, 0)) {
            $scope.showAppNotification = false;
            $scope.notifySMS = false;
            $scope.notifyMAIL = false;
        } else {
            $scope.showAppNotification = true;
            $scope.notifySMS = true;
            $scope.notifyMAIL = false;
        }


        if ($scope.IsComingFrom == 'Doctorcalendar') {
            $scope.Doctorcalendarobj.GetDate = $scope.selectedAppointmentObject.AppointmentDate;
        }

        $scope.getUserBranchslots($scope.selectedAppointmentObject.DoctorID);


        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");


        var appointmentDate = $filter('date')(new Date($scope.selectedAppointmentObject.AppointmentDate), "yyyy-MM-dd");

        if (appointmentDate > currentdate) {

            $scope.IsCheckIn = 1;
            $scope.BookingTypeId = 3;   //02-09-2022
            $scope.selectedAppointmentObject.IsAppointmentConfirmed = false;
            $scope.IsFutureDateInd = true;

        }
        else {
            $scope.IsCheckIn = 1; //2;
            $scope.BookingTypeId = 3; //1;
            if ($scope.BookingTypeId === 1) {
                $scope.selectedAppointmentObject.IsAppointmentConfirmed = true;
            }
            $scope.IsFutureDateInd = false;
            if (appointmentDate == currentdate && $scope.selectedAppointmentObject.IsWalkInSlot) {
                $scope.selectedAppointmentObject.IsAppointmentConfirmed = true;
                $scope.selectedAppointmentObject.IsShowNoApptInd = true;
            }

        }
        $scope.selectedAppointmentObject.IsNoShowAppointment = false;
        $scope.selectedAppointmentObject.IsWaitingListAppointment = false;


        $scope.IsDoctorcalendarDate = true;
        $scope.IsReschduleSlotIND = true;
        $scope.AppointmentRescheduleObj.StartTime = "";
    };



    $scope.AppointmentRescheduleObj = {
        "StartTime": "",
        "IsCalendarBookAppt": false,
        "StartDateforActivecalendar": ""
    };

    $scope.changeAppointmentCalendrYear = function (mainobject) {
        console.log(mainobject);

        var currentYear = parseInt(mainobject.Year);
        console.log(currentYear);


        var firstDay = new Date(currentYear, mainobject.Date.getMonth(), 1);
        var endDate = new Date(currentYear, mainobject.Date.getMonth() + 1, 0);

        console.log(firstDay + "__" + endDate);
        var tdate = new Date();
        var tmonth = tdate.getMonth();
        var tYear = tdate.getFullYear();
        var month = firstDay.getMonth();
        var year = firstDay.getFullYear();

        if (tmonth == month && tYear === year) {
            $scope.selectedAppointmentObject.AppointmentDate = tdate;
        } else {
            $scope.selectedAppointmentObject.AppointmentDate = $filter('date')(firstDay, 'MM-dd-yyyy');
        }
        /*  $scope.GetActiveDates(startDate, endDate);*/

        var appointmentDate = $filter('date')(firstDay, "yyyy-MM-dd");
        console.log(appointmentDate);
        var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
        var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        if (utcDate != undefined) {
            $calendar.customchangeMonth(utcDate);
        }
        //FocusDateinCalendar();

        $timeout(function () {
            $scope.loadCalendar();
            $scope.GetNewActiveDates(firstDay, endDate);

            $scope.selectedAppointmentObject.DoctorID = $scope.selectedAppointmentObject.DoctorID || 0;
            if ($scope.selectedAppointmentObject.DoctorID != 0) {
                $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                $scope.selectedAppointmentObject.StartTime = "";
                $scope.selectedAppointmentObject.patinet_appStarttime = "";
                $scope.selectedAppointmentObject.patient_appEndTime = "";
                $scope.getUserBranchslots($scope.selectedAppointmentObject.DoctorID);
            } else {
                $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                $scope.selectedAppointmentObject.StartTime = "";
                $scope.selectedAppointmentObject.patinet_appStarttime = "";
                $scope.selectedAppointmentObject.patient_appEndTime = "";
            }

            var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
            var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            console.log(utcDate);
            var dateElement = $('.calendar-container').find('[data-date="' + utcDate + '"]');
            dateElement.addClass('event'); // add the event class
            dateElement.addClass('selected'); // add the selected class
        }, 500);
    }


    $scope.loadCalendar = function (type) {
        var Type = type || "";

        calendarContainers = $("#calendar").simpleCalendar({
            displayEvent: true,
            fixedStartDay: true,
            selectable: true,
            displayYear: false,
            disableDaysBefore: new Date(),
            disablePrev: true,
            months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
            days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            disableEventDetails: false,
            disableEmptyDetails: true,
            events: [],
            onMonthChange: function (month, year) {

                let tdate = new Date();
                let tmonth = tdate.getMonth();
                let tYear = tdate.getFullYear();
                var calendarmonth = month + 1;
                $scope.calendarObject.Year = year;

                if (tmonth < calendarmonth || tYear < year) {
                    //var t = new Date($scope.selectedAppointmentObject.AppointmentDate);
                    //var startDate = new Date(t.getFullYear(), month, 1);
                    //var endDate = new Date(t.getFullYear(), month + 1, 0);
                    var t = new Date();
                    var startDate = new Date(year, month, 1);
                    var endDate = new Date(year, month + 1, 0);

                    $scope.DocAvailableDates = [];
                    if (startDate.getMonth() === t.getMonth() && tYear == year) {
                        startDate = new Date();
                    }
                    $scope.AppointmentRescheduleObj.StartDateforActivecalendar = startDate;
                    $scope.selectedAppointmentObject.AppointmentDate = startDate;
                    $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                    $scope.selectedAppointmentObject.StartTime = "";
                    $scope.selectedAppointmentObject.patinet_appStarttime = "";
                    $scope.selectedAppointmentObject.patient_appEndTime = "";
                    if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar' && $scope.pagename == 'book') {
                        $scope.Doctorcalendarobj.Starttime = "";
                        $scope.Doctorcalendarobj.GetDate = startDate;
                    }

                    if (tmonth == month && tYear == year) {
                        $scope.selectedAppointmentObject.AppointmentDate = tdate;
                    }
                    $scope.selectedAppointmentObject.VisitReasonId = $scope.selectedAppointmentObject.VisitReasonId || 0;
                    if ($scope.selectedAppointmentObject.VisitReasonId == 0) {
                        $scope.GetUserActiveDatesandSlotsInCalendar("FormMonth");
                    } else {
                        $scope.GetActiveDates(startDate, endDate, "FormMonth");
                    }

                } else {
                    return false;
                }
            },
            onDateSelect: function (date, events, month) {


                var availcount = 0;
                if ($scope.DocAvailableDates.length > 0) {
                    console.log(date);
                    console.log($scope.DocAvailableDates);
                    angular.forEach($scope.DocAvailableDates, function (mitem) {
                        var result = dateCompare(mitem.startDate, date);
                        console.log(result);
                        if (result) {
                            availcount++;
                        }
                    });
                }

                //if (availcount === 0 && $scope.DocAvailableDates.length > 0) {
                //    alertify.error("No Slots Available on the Selected Date");
                //    $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                //    return;
                //}

                var selecteddate = moment(date).format("YYYY-MM-DD");
                var currentdt = moment().format("YYYY-MM-DD");
                // commented for CCDA temporarily
                if (selecteddate < currentdt) {
                    // alertify.error("No Slots Available on the Selected Date");
                    $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                    return;
                }

                $scope.selectedAppointmentObject.AppointmentDate = date;
                $scope.selectedAppointmentObject.VisitReasonId = $scope.selectedAppointmentObject.VisitReasonId || null;

                //if ($scope.selectedAppointmentObject.VisitReasonId == 0) {
                //    alertify.error("Please select Visit reason");
                //    return;
                //}

                $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                $scope.selectedAppointmentObject.StartTime = "";
                $scope.selectedAppointmentObject.patinet_appStarttime = "";
                $scope.selectedAppointmentObject.patient_appEndTime = "";
                if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar' && $scope.pagename == 'book') {
                    $scope.Doctorcalendarobj.Starttime = "";
                }

                $scope.changeAppointmentDate($scope.selectedAppointmentObject.AppointmentDate);

            }
        });
        $calendar = calendarContainers.data('plugin_simpleCalendar');
        $scope.DocAvailableDates = [];
        $calendar.setEvents($scope.DocAvailableDates);
        $timeout(function () {
            var appointmentDate = moment($scope.selectedAppointmentObject.AppointmentDate, "MM-DD-YYYY").format("YYYY-MM-DD");
            console.log(appointmentDate);
            var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
            var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            console.log(utcDate);
            var dateElement = $('.calendar-container').find('[data-date="' + utcDate + '"]');
            dateElement.addClass('event'); // add the event class
            dateElement.addClass('selected'); // add the selected class
        }, 1000);

    };



    function dateCompare(d1, d2) {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        var result = false;
        if (date1 > date2) {
            result = false;
        } else if (date1 < date2) {
            result = false;
        } else {
            result = true;
        }

        return result;
    }


    $scope.CRMReasonTypefilters = function () {
        let ReasonTypeobj = {
            "SearchText": "",
            "PageSize": 10,
            "PageNo": 1,
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,

        }
        let PatientObj =
        {
            "OrganizationId": $scope.HospitalId,
            "PatientId": $scope.selectedPatientObj.PatientId
        }
        $scope.AllReasonTypes = [];
        $scope.ApptLastVisitDuration = [];
        $scope.MasterReasonTypes = [];
        $q.all([
            eHnotePatientVisitReasonServices.GetOrganizationCrmReasonTypes(ReasonTypeobj),
            eHnotePatientVisitReasonServices.GetCompletedPastVisitDuration(PatientObj),
            eHnotePatientVisitReasonServices.GetParentOrgReasonTypes($scope.ParenthospitalId),
        ]).then(function (resp) {
            if (resp[0].data.rows.length !== 0) {
                $scope.AllReasonTypes = resp[0].data.rows || [];
                $scope.AllReasonTypesList = angular.copy($scope.AllReasonTypes) || [];
                // $scope.AllReasonTypesList = _.uniq($scope.AllReasonTypesList, false, function (p) { return p.ReasonTypeId; });
            }
            if (resp[1].data.rows.length !== 0) {
                $scope.ApptLastVisitDuration = resp[1].data.rows || [];

                if ($scope.ApptLastVisitDuration.length > 0) {
                    angular.forEach($scope.ApptLastVisitDuration, function (item) {
                        item.ApptDurationinYears = item.YearsDifference||0;
                        item.ApptDurationinMonths = item.MonthsDifference||0;
                        item.ApptDurationinDays = item.DaysDifference|| 0;
                        //let Tmpfromdate = item.ConsultationDt;
                        //var todate = new Date();
                        //var age = [];
                        //var fromdate = new Date(Tmpfromdate);
                        //var y = [todate.getFullYear(), fromdate.getFullYear()];
                        //var ydiff = y[0] - y[1];
                        //var m = [todate.getMonth(), fromdate.getMonth()];
                        //var mdiff = m[0] - m[1];
                        //var d = [todate.getDate(), fromdate.getDate()];
                        //var ddiff = d[0] - d[1];
                        //if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
                        //if (mdiff < 0) mdiff += 12;
                        //if (ddiff < 0) {
                        //    fromdate.setMonth(m[1] + 1, 0);
                        //    ddiff = fromdate.getDate() - d[1] + d[0];
                        //    --mdiff;
                        //}
                        //if (ydiff > 0) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
                        //if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
                        //if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));
                        //if (age.length > 1) age.splice(age.length - 1, 0, ' and ');


                        //item.ApptDurationinYears = ydiff.toString();
                        //item.ApptDurationinMonths = mdiff.toString();
                        //if (item.ApptDurationinMonths === "-1") {
                        //    item.ApptDurationinMonths = "";
                        //}
                        //item.ApptDurationinDays = ddiff.toString();
                        let today = $filter('date')(new Date(), "yyyy-MM-dd");
                        let datetime = today + " " + item.StartTime;
                        item.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                    });
                }
            }
            if (resp[2].data.rows.length !== 0) {
                $scope.MasterReasonTypes = resp[2].data.rows;
            }

        });
    }

    $scope.navtoContinuetoBookAppointmentScreen = function () {
        $scope.ApptMaintainfields.IsAppointmentScreen = true;


        if ($scope.currentUrl == 'CRMReasonType') {
            $scope.CRMReasonTypefilters();
        }


        if ($scope.pagename !== 'reschedule') {

            $scope.clinicDoctorList = [];
            $scope.AllCounsollerList = angular.copy($scope.allUserList);
            $scope.AllDilationList = angular.copy($scope.allUserList);
            $scope.AllTechnicianList = angular.copy($scope.allUserList);
            $scope.AllOpthaList = angular.copy($scope.allUserList);
            $scope.AllArList = angular.copy($scope.allUserList);
            $scope.AllBillingList = angular.copy($scope.allUserList);
            $scope.clinicOptometristsList = [];
            $scope.clinicARAssistantList = [];
            $scope.AllAnesthesistsList = [];
            $scope.AllNursesList = [];




            $scope.AllNursesList = angular.copy($scope.allUserList);
            $scope.AllNursesList = _.uniq($scope.AllNursesList, false, function (p) { return p.DoctorID; });
            $scope.AllNursesList = $filter("filter")($scope.AllNursesList, function (item) {
                return item.RoleId === 8;
            });

            $scope.AllAnesthesistsList = angular.copy($scope.allUserList);
            $scope.AllAnesthesistsList = _.uniq($scope.AllAnesthesistsList, false, function (p) { return p.DoctorID; });
            $scope.AllAnesthesistsList = $filter("filter")($scope.AllAnesthesistsList, function (item) {
                return item.RoleId === 30;
            });
            $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
            $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                return item.RoleId === 10;
            });
            $scope.AllArList = _.uniq($scope.AllArList, false, function (p) { return p.DoctorID; });
            $scope.AllArList = $filter("filter")($scope.AllArList, function (item) {
                return item.RoleId === 61;
            });

            $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
            $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                return item.RoleId === 18;
            });
            $scope.AllDilationList = _.uniq($scope.AllDilationList, false, function (p) { return p.DoctorID; });
            $scope.AllDilationList = $filter("filter")($scope.AllDilationList, function (item) {
                return item.RoleId === 54 || item.RoleId === 2 || item.RoleId === 10;
            });
            $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
            $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
            });
            $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
            $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                return item.RoleId === 2 || item.RoleId === 10;
            });

            $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
            angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                if (Aitem.RoleId === 10) {
                    $scope.clinicOptometristsList.push(Aitem);
                }
            });
            $scope.clinicOptometristsList = _.uniq($scope.clinicOptometristsList, false, function (p) { return p.DoctorID; });


            angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                if (Aitem.RoleId === 61) {
                    $scope.clinicARAssistantList.push(Aitem);
                }

            });
            $scope.clinicARAssistantList = _.uniq($scope.clinicARAssistantList, false, function (p) { return p.DoctorID; });


            angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                    $scope.clinicDoctorList.push(Aitem);

                }
            });
            $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });


            if ($scope.RoleId !== 1 && $scope.RoleId !== 56) {
                $scope.clinicDoctorList = [];
                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                        $scope.clinicDoctorList.push(Aitem);
                    }
                });

            }

            var filteredSIngleDoctorArray = [];
            if ($scope.RoleId === 1 || $scope.RoleId === 56) {


                $scope.RestrictMultiAppointments = false;
                if (doctorinfo.doctordata.UserAddress[0].UserSlotInfo !== undefined) {
                    if (doctorinfo.doctordata.UserAddress[0].UserSlotInfo.MultiSlotEnable) {
                        $scope.RestrictMultiAppointments = true;
                    }
                }
                var CommunicationCountryCode = ""; var CommunicationMobileNo = "";
                if (doctorinfo.doctordata.UserCommunicationPhone !== undefined) {
                    CommunicationCountryCode = doctorinfo.doctordata.UserCommunicationPhone[0].PhCntryCD;
                    CommunicationMobileNo = doctorinfo.doctordata.UserCommunicationPhone[0].PhNumber;
                }

                $scope.clinicDoctorList = [];

                angular.forEach($scope.allUserList, function (Aitem) {
                    if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                        $scope.clinicDoctorList.push(Aitem);
                    }
                });

                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });

                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                filteredSIngleDoctorArray = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorinfo.doctordata.User[0].DoctorID, "IsUserDisabled": false }, true);


            };

            if ($scope.clinicDoctorList.length > 0) {
                $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (kitem, index) { return kitem.IsUserDisabled !== true }) || [];

                var obj = {
                    "DoctorID": 0,
                    "SecondUserFullName": "Select Doctor",
                    "Active": 'Y',
                };
                $scope.clinicDoctorList.unshift(obj);
            }



            $scope.MultipleAppointmentList = [];
            $scope.AppointmentDetailsInfo = GetAppointmentDetailsInfo();

            $scope.MultipleAppointmentList.push($scope.AppointmentDetailsInfo);

            let SendPatientSms = angular.copy($scope.selectedAppointmentObject.SendPatientSms) || false;
            let SendDocSms = angular.copy($scope.selectedAppointmentObject.SendDocSms) || false;
            let SendPatientEmail = angular.copy($scope.selectedAppointmentObject.SendPatientEmail) || false;
            let SendDocEmail = angular.copy($scope.selectedAppointmentObject.SendDocEmail)||false;

            $scope.selectedAppointmentObject = getnewAppoitnmentDoctorObj();

            $scope.selectedAppointmentObject.SendPatientSms = SendPatientSms;
            $scope.selectedAppointmentObject.SendPatientEmail = SendPatientEmail;
            $scope.selectedAppointmentObject.SendDocSms = SendDocSms;
            $scope.selectedAppointmentObject.SendDocEmail = SendDocEmail;
            

            if (selectedDoctorinAppList != "") {
                selectedDoctorinAppList.DoctorID = selectedDoctorinAppList.DoctorID || 0;
            }
            if (selectedDoctorinAppList.DoctorID != 0) {
                var clinicdoctorfilter = $filter("filter")($scope.clinicDoctorList, { "DoctorID": selectedDoctorinAppList.DoctorID }, true);
                if (clinicdoctorfilter.length > 0) {
                    $scope.selectedAppointmentObject.DoctorID = selectedDoctorinAppList.DoctorID;
                    $scope.selectedAppointmentObject.DocObj = clinicdoctorfilter[0];
                    $scope.selectedAppointmentObject.UserBranchId = clinicdoctorfilter[0].UserBranchId;
                } else {
                    alertify.error("Doctor is disabled, please select another doctor");
                }
            };


            if (filteredSIngleDoctorArray.length > 0) {
                $scope.selectedAppointmentObject.DoctorID = filteredSIngleDoctorArray[0].DoctorID;
                $scope.selectedAppointmentObject.DocObj = filteredSIngleDoctorArray[0];
                $scope.selectedAppointmentObject.UserBranchId = filteredSIngleDoctorArray[0].UserBranchId;
            }

            //$scope.GetVisitReasonNew();

            let getParams = {
                "OrganizationId": $scope.HospitalId,
                "ReasonTypeId": 1,
                "SearchText": "",
                "VisitTypeId": null
            };


            $q.all([
                eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams)
            ]).then(function (resp) {
                if (resp[0].data.status === "Success") {
                    var obj = {
                        "ActiveIND": "Y",
                        "Reason": "All Visit Reason",
                        "ReasonId": 0,
                        "ReasonTypeId": 1,
                        "Remarks": "",
                        "VisitReasonColorCode": "",
                        "VisitTypeId": 0,
                        "VisitTypeName": "",
                        "VisitiTypeCode": ""
                    };
                    $scope.AllVisitReasons = angular.copy(resp[0].data.rows) || [];
                    if ($scope.AllVisitReasons.length > 0) {
                        $scope.AllVisitReasons = $filter("filter")($scope.AllVisitReasons, function (item) {
                            return item.ActiveIND === 'Y';
                        });

                        $scope.AllVisitReasons.unshift(obj);
                    }

                    if ($scope.selectedAppointmentObject.AppointmentTypeId == 7 || $scope.selectedAppointmentObject.AppointmentTypeId == 6 || $scope.selectedAppointmentObject.AppointmentTypeId == 4 || $scope.selectedAppointmentObject.AppointmentTypeId == 14) {
                        $scope.onSelectVisitReason($scope.selectedAppointmentObject.VisitReasonObj);
                    }
                }


                if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar') {
                    $scope.selectedAppointmentObject.AppointmentTypeId = 0;
                    $scope.selectedAppointmentObject.StartTime = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm');
                    $scope.selectedAppointmentObject.AppointmentDate = $filter('date')($scope.Doctorcalendarobj.GetDate, "yyyy-MM-dd");
                    $scope.selectedAppointmentObject.patinet_appStarttime = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm');
                    $scope.selectedAppointmentObject.patient_appEndTime = $filter('date')(new Date($scope.Doctorcalendarobj.Endtime), 'HH:mm');
                }

                $scope.loadCalendar("pageload");
                AppointmentDetailsCache.VisitTypeId = AppointmentDetailsCache.VisitTypeId || null;
                if (AppointmentDetailsCache.VisitTypeId != null) {
                    $scope.selectedAppointmentObject.VisitReasonId = AppointmentDetailsCache.VisitTypeId || null;

                    let visitfilter = $filter("filter")($scope.AllVisitReasons, { "ReasonId": $scope.selectedAppointmentObject.VisitReasonId }, true);
                    if (visitfilter.length > 0) {
                        $scope.selectedAppointmentObject.VisitReasonObj = visitfilter[0];
                    } else {
                        $scope.selectedAppointmentObject.VisitReasonObj = "";
                    }

                    $scope.onSelectVisitReason($scope.selectedAppointmentObject.VisitReasonObj, $scope.selectedAppointmentObject);
                }
                //AppointmentDetailsCache.calenderDate = AppointmentDetailsCache.calenderDate || null;
                //if (AppointmentDetailsCache.calenderDate != null) {
                //    $scope.selectedAppointmentObject.AppointmentDate = AppointmentDetailsCache.calenderDate;
                //}

                if (AppointmentDetailsCache.IsMultipleAppts) {
                    if (AppointmentDetailsCache.ASCDatesArray.length > 0) {
                        $scope.MultipleAppointmentList = [];
                        angular.forEach(AppointmentDetailsCache.ASCDatesArray, function (item) {
                            $scope.AppointmentDetailsInfo.IsEdit = false;
                            let obj = angular.copy($scope.AppointmentDetailsInfo);
                            obj.DoctorID = $scope.selectedAppointmentObject.DoctorID;
                            obj.DocObj = $scope.selectedAppointmentObject.DocObj;
                            obj.UserBranchId = $scope.selectedAppointmentObject.UserBranchId;
                            obj.TabName = item.TabName;
                            obj.TabId = item.TabId;

                            if (item.TabId === 1) {
                                let tempArray = $filter('filter')($scope.AllVisitReasons, { 'VisitTypeId': 7 }, true);
                                if (tempArray.length > 0) {
                                    obj.VisitReasons = angular.copy(tempArray);
                                } else {
                                    obj.VisitReasons = [];
                                }
                            }

                            if (item.TabId === 2) {
                                let tempArray = $filter('filter')($scope.AllVisitReasons, { 'VisitTypeId': 4 }, true);
                                if (tempArray.length > 0) {
                                    obj.VisitReasons = angular.copy(tempArray);
                                } else {
                                    obj.VisitReasons = [];
                                }
                            }

                            if (item.TabId === 3 || item.TabId === 4 || item.TabId === 5) {
                                let tempArray = $filter('filter')($scope.AllVisitReasons, { 'VisitTypeId': 3 }, true);
                                if (tempArray.length > 0) {
                                    obj.VisitReasons = angular.copy(tempArray);
                                } else {
                                    obj.VisitReasons = [];
                                }
                            }

                            $scope.MultipleAppointmentList.push(obj);
                        });
                        //$scope.selectedAppointmentObject.AppointmentDate = AppointmentDetailsCache.ASCDatesArray[0].Date;
                        $scope.MultipleAppointmentList[0].IsEdit = true;
                        //$scope.MultipleAppointmentList[0].AppointmentDate = AppointmentDetailsCache.ASCDatesArray[0].Date;
                    }
                }

                if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar') {
                    var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
                    var ttoday = new Date();
                    var tyear = ttoday.getFullYear();
                    var date = $filter("date")($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
                    var pat_Date = new Date(date + ' ' + "00:00:00");
                    var selectyear = pat_Date.getFullYear();
                    $scope.calendarObject.Year = selectyear;

                    if (tyear !== selectyear) {
                        var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
                        var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                        if (utcDate != undefined) {
                            $calendar.customchangeMonth(utcDate);
                        }
                    }
                }

                if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar' || $scope.RoleId == 1 || $scope.RoleId == 43 || $scope.RoleId == 18) {
                    /* $scope.GetUserActiveDatesandSlotsInCalendar();*/
                }

            });



            //if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar') {
            //    $scope.selectedAppointmentObject.AppointmentTypeId = 0;
            //    $scope.selectedAppointmentObject.StartTime = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm');
            //    $scope.selectedAppointmentObject.AppointmentDate = $filter('date')($scope.Doctorcalendarobj.GetDate, "yyyy-MM-dd");
            //    $scope.selectedAppointmentObject.patinet_appStarttime = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm');
            //    $scope.selectedAppointmentObject.patient_appEndTime = $filter('date')(new Date($scope.Doctorcalendarobj.Endtime), 'HH:mm');
            //}

            //$timeout(function () {
            //    $scope.loadCalendar("pageload");

            //    if (AppointmentDetailsCache.VisitTypeId != null) {
            //        $scope.selectedAppointmentObject.VisitReasonId = AppointmentDetailsCache.VisitTypeId || null;

            //        let visitfilter = $filter("filter")($scope.AllVisitReasons, { "ReasonId": $scope.selectedAppointmentObject.VisitReasonId }, true);
            //        if (visitfilter.length > 0) {
            //            $scope.selectedAppointmentObject.VisitReasonObj = visitfilter[0];
            //        } else {
            //            $scope.selectedAppointmentObject.VisitReasonObj = "";
            //        }

            //        $scope.onSelectVisitReason($scope.selectedAppointmentObject.VisitReasonObj, $scope.selectedAppointmentObject);
            //    }

            //    if (AppointmentDetailsCache.IsMultipleAppts) {
            //        if (AppointmentDetailsCache.ASCDatesArray.length > 0) {
            //            $scope.MultipleAppointmentList = [];
            //            angular.forEach(AppointmentDetailsCache.ASCDatesArray, function (item) {
            //                // $scope.AppointmentDetailsInfo.AppointmentDate = item.Date;
            //                $scope.AppointmentDetailsInfo.IsEdit = false;
            //                let obj = angular.copy($scope.AppointmentDetailsInfo);
            //                obj.DoctorID = $scope.selectedAppointmentObject.DoctorID;
            //                obj.DocObj = $scope.selectedAppointmentObject.DocObj;
            //                obj.UserBranchId = $scope.selectedAppointmentObject.UserBranchId;
            //                obj.TabName = item.TabName;
            //                obj.TabId = item.TabId;

            //                if (item.TabId === 1) {
            //                    let tempArray = $filter('filter')($scope.AllVisitReasons, { 'VisitTypeId': 7 }, true);
            //                    if (tempArray.length > 0) {
            //                        obj.VisitReasons = angular.copy(tempArray);
            //                    } else {
            //                        obj.VisitReasons = [];
            //                    }
            //                }

            //                if (item.TabId === 2) {
            //                    let tempArray = $filter('filter')($scope.AllVisitReasons, { 'VisitTypeId': 4 }, true);
            //                    if (tempArray.length > 0) {
            //                        obj.VisitReasons = angular.copy(tempArray);
            //                    } else {
            //                        obj.VisitReasons = [];
            //                    }
            //                }

            //                if (item.TabId === 3 || item.TabId === 4 || item.TabId === 5) {
            //                    let tempArray = $filter('filter')($scope.AllVisitReasons, { 'VisitTypeId': 3 }, true);
            //                    if (tempArray.length > 0) {
            //                        obj.VisitReasons = angular.copy(tempArray);
            //                    } else {
            //                        obj.VisitReasons = [];
            //                    }
            //                }

            //                $scope.MultipleAppointmentList.push(obj);
            //            });
            //            //$scope.selectedAppointmentObject.AppointmentDate = AppointmentDetailsCache.ASCDatesArray[0].Date;
            //            $scope.MultipleAppointmentList[0].IsEdit = true;
            //            //$scope.MultipleAppointmentList[0].AppointmentDate = AppointmentDetailsCache.ASCDatesArray[0].Date;
            //        }
            //    }

            //    if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar') {
            //        var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
            //        var ttoday = new Date();
            //        var tyear = ttoday.getFullYear();
            //        var date = $filter("date")($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
            //        var pat_Date = new Date(date + ' ' + "00:00:00");
            //        var selectyear = pat_Date.getFullYear();
            //        $scope.calendarObject.Year = selectyear;

            //        if (tyear !== selectyear) {
            //            var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
            //            var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            //            if (utcDate != undefined) {
            //                $calendar.customchangeMonth(utcDate);
            //            }
            //        }
            //    }

            //    if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar' || $scope.RoleId == 1 || $scope.RoleId == 43 || $scope.RoleId == 18) {
            //        $scope.GetUserActiveDatesandSlotsInCalendar();
            //    }
            //}, 1000);
        }
    };

    $scope.OnChangetype = function (val) {
        $scope.selectedAppointmentObject.PatientSeenOtherProvider = val;
        $scope.selectedAppointmentObject.ReasonTypeId = null;
        $scope.selectedAppointmentObject.OtherProviderVisitDate = null;
        $scope.selectedAppointmentObject.OtherProviderDoctorName = null;
        $scope.selectedAppointmentObject.OtherProviderVisitReason = null;
        $scope.selectedAppointmentObject.IsReferral = false;
        $scope.selectedAppointmentObject.VisitReasonObj = "";
        $scope.selectedAppointmentObject.VisitReasonId = 0;
    }
    $scope.OnSelectedAppointmentDoctor = function (item, Mainitem) {
        $scope.selectedAppointmentObject.DocObj = angular.copy(item);
        $scope.changeAppointmentDoctor($scope.selectedAppointmentObject.DocObj.DoctorID, $scope.selectedAppointmentObject.DocObj, Mainitem);
        $scope.SearchTxtObj.DoctorName = "";
    }

    $scope.changeAppointmentDoctor = function (SelectedDoctorId, item, Mainitem) {


        $scope.selectedAppointmentObject.DoctorID = item.DoctorID;
        $scope.selectedAppointmentObject.UserBranchId = item.UserBranchId;
        $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
        $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
        $scope.selectedAppointmentObject.VisitReasonName = '';
        $scope.selectedAppointmentObject.VisitReasonId = null;
        $scope.selectedAppointmentObject.VisitReasonObj = "";
        $scope.selectedAppointmentObject.patinet_appStarttime = '';
        $scope.selectedAppointmentObject.patient_appEndTime = '';
        $scope.selectedAppointmentObject.AppointmentTypeId = '';
        $scope.selectedAppointmentObject.DocObj = item || '';
        $scope.AppointmentRescheduleObj.StartTime = "";
        $scope.AppointmentRescheduleObj.IsDoctorLeave = false;
        $scope.isAppValiddities.isEnableAlertType = false;
        $scope.selectedAppointmentObject.StartTime = "";
        //$scope.loadCalendar();

        //$scope.GetUserActiveDatesandSlotsInCalendar();
        if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar' && $scope.pagename == 'book') {
            $scope.Doctorcalendarobj.Starttime = "";
            $scope.selectedAppointmentObject.StartTime = "";
            $scope.selectedAppointmentObject.patinet_appStarttime = "";
            $scope.selectedAppointmentObject.patient_appEndTime = "";
        }

        // if ($scope.pagename == 'book' && $scope.Doctorcalendarobj.IsComingFrom !== 'Doctorcalendar') {
        if (AppointmentDetailsCache.IsMultipleAppts) {
            AppointmentDetailsCache.ASCDatesArray = AppointmentDetailsCache.ASCDatesArray || [];
            if (AppointmentDetailsCache.ASCDatesArray.length > 0) {
                // do not change dates
            } else {
                let tdate = $filter('date')(new Date(), "yyyy-MM-dd");
                $scope.selectedAppointmentObject.AppointmentDate = tdate;

                var appointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");
            }
        }

        //console.log(appointmentDate);
        //var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
        //var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        //if (utcDate != undefined) {
        //    $calendar.customchangeMonth(utcDate);
        //}
        appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
        var t = new Date(appointmentDate + ' ' + "00:00:00");
        $scope.calendarObject.Year = t.getFullYear();
        // }

    }


    $scope.getUserBranchslots = function (SelectedDoctorId, type) {
        type = type || '';
        SelectedDoctorId = parseInt(SelectedDoctorId);

        //$scope.selectedAppointmentObject.TimeSlotsStartArray = [];
        //$scope.selectedAppointmentObject.TimeSlotsEndArray = [];
        $scope.selectedAppointmentObject.IsDoctorLeave = false;

        var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");

        var params = {
            "DoctorId": $scope.selectedAppointmentObject.DoctorID,
            "UserBranchId": $scope.selectedAppointmentObject.UserBranchId,
            "Date": appointmentDate
        }


        eHnoteMainAppointmentService.GetDoctorAvaiableSlotByDate(params, OnGetSuccess, OnGetError);

        function OnGetSuccess(response) {
            $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
            $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
            if (response.status === 'Success') {
                response.IsBranchHoliday = response.IsBranchHoliday || false;
                if (response.IsBranchHoliday) {
                    alertify.error("Selected Date is Holiday, please choose another date.");

                    $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                    $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
                    return;
                }
                if (response.IsLeave) {
                    alertify.error("Doctor is on leave on the selected date!");

                    $scope.selectedAppointmentObject.IsDoctorLeave = true;
                    $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                    $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
                    return;
                }


                angular.forEach(response.NormalSlots, function (item) {
                    item.StartTime = item.StartTime.substring(0, 5);
                    item.EndTime = item.EndTime.substring(0, 5);

                    item.seqStartTime = item.StartTime.replace(":", "");
                    item.seqEndTime = item.EndTime.replace(":", "");
                });
                angular.forEach(response.TeleSlots, function (item) {
                    item.StartTime = item.StartTime.substring(0, 5);
                    item.EndTime = item.EndTime.substring(0, 5);
                });
                $scope.IsMaximumAppointmentsPerDay = false;
                $scope.isAppValiddities.MaxApptError = false;
                if (response.UserConsultationNew.length > 0) {
                    if (response.UserConsultationNew[0].IsMaximumAppointmentsPerDay == true) {
                        if (response.DoctorAppointmentCount > response.UserConsultationNew[0].MaximumAppointmentsPerDay || response.DoctorAppointmentCount == response.UserConsultationNew[0].MaximumAppointmentsPerDay) {
                            $scope.isAppValiddities.MaxApptError = true;
                            $scope.isAppValiddities.MaxApptUnblock = false;

                            $scope.IsMaximumAppointmentsPerDay = true;
                            alertify.error("Maximum Appointments Reached for is Doctor. Please choose another doctor");
                            // return false;

                        }
                    }
                }

                let ecount = 0, overaalCount = 0;

                $scope.isAppValiddities.MaxApptError = false;
                if (response.UserScheduleSlots.length > 0) {
                    response.UserScheduleSlots[0].MaximumOverAllSlots = response.UserScheduleSlots[0].MaximumOverAllSlots || 0;
                    if (response.UserScheduleSlots[0].MaximumOverAllSlots > 0) {
                        if (response.UserScheduleSlots[0].MaximumOverAllSlots <= response.DoctorAppointmentCount) {
                            overaalCount++;
                        }
                    }
                    //if (response.UserScheduleSlots[0].IsAdvancedSchedule) {
                    //    angular.forEach(response.UserScheduleSlots[0].ScheduleVisitTypeDetails, function (kitem) {
                    //        if (kitem.IsAllVisitReasons && kitem.VisitTypeId === $scope.selectedAppointmentObject.VisitTypeId) {
                    //            angular.forEach(kitem.VisitReasons, function (hitem) {
                    //                if (hitem.MaxNumberOfSlots == hitem.AppointmentCount) {
                    //                    ecount++;
                    //                }
                    //            });
                    //        } else {
                    //            angular.forEach(kitem.VisitReasons, function (hitem) {
                    //                if ($scope.selectedAppointmentObject.VisitReasonId == hitem.VisitReasonId && hitem.MaxNumberOfSlots !== null) {
                    //                    if (hitem.MaxNumberOfSlots == hitem.AppointmentCount) {
                    //                        ecount++;
                    //                    }
                    //                }
                    //            });
                    //        }
                    //    });
                    //}
                }

                console.log(response.DoctorAppointmentCount + "__" + overaalCount);
                if (overaalCount > 0) {
                    $scope.IsMaximumAppointmentsPerDay = true;

                    if ($scope.selectedAppointmentObject.AppointmentID === 0) {
                        $scope.isAppValiddities.MaxApptError = true;
                        $scope.isAppValiddities.MaxApptUnblock = false;
                    }

                    // alertify.error("Maximum Appointments Reached for Today. Please choose another Date/Doctor");
                    // return false;
                }
                //if (ecount > 0) {
                //    $scope.IsMaximumAppointmentsPerDay = true;
                //    alertify.error("Maximum Appointments Reached for Visit Reason. Please choose another Visit Reason");
                //   // return false;
                //}
                console.log("restructure called");
                //newreStructureDoctorSelectedSlots(response);

                $scope.ApptDurationObj.patinet_consultationTime = $scope.ApptDurationObj.patinet_consultationTime || "";
                $scope.ApptDurationObj.consultationTime_for_restructure = "";
                if (type !== "fromreschedule") {
                    if (response.UserScheduleSlots.length > 0) {
                        $scope.ApptDurationObj.patinet_consultationTime = response.UserScheduleSlots[0].MinPerCase || "";
                    }

                }
                if ($scope.ApptDurationObj.patinet_consultationTime == "") {
                    $scope.ApptDurationObj.patinet_consultationTime = $scope.selectedAppointmentObject.DocObj.MinPerCase.toString() || "15";
                }

                // paramter to be used in checkSlotsandSplice() to remove booked slots
                if (response.UserScheduleSlots.length > 0) {
                    $scope.ApptDurationObj.consultationTime_for_restructure = response.UserScheduleSlots[0].MinPerCase || "";
                }
                if ($scope.ApptDurationObj.consultationTime_for_restructure == "") {
                    $scope.ApptDurationObj.consultationTime_for_restructure = $scope.selectedAppointmentObject.DocObj.MinPerCase.toString() || "15";
                }
                restructureAvailabiliyandDoctorSlots(response);
            }

        }
        function OnGetError(error) {
            console.log(error);
        }









    };

    function GetAppoitmentTypebyStartTime(starttime) {

        if ($scope.isAppValiddities.UserScheduleId == 0) {
            $scope.ApptMaintainfields.AppointmentTypeDisplay = "";
            return false;
        }
        var appointmentDate = $filter('date')(new Date($scope.selectedAppointmentObject.AppointmentDate), "yyyy-MM-dd");
        var inputParams = {
            "Date": appointmentDate,
            "SlotTime": starttime.StartTime,
            "UserScheduleId": $scope.isAppValiddities.UserScheduleId || 0,
            "DoctorId": $scope.selectedAppointmentObject.DoctorID,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        }
        console.log(inputParams);

        //eHnoteDiagnosisDataServices.getParticualrTimeSlotDetailsById(inputParams).then(function (resp) {
        //    console.log(resp);
        //    if (resp.data.Status === "Success") {

        //    }
        //});
    }

    function FocusDateinCalendar() {
        var appointmentDate = moment($scope.selectedAppointmentObject.AppointmentDate).format("YYYY-MM-DD");
        console.log(appointmentDate + "__appointmentDate");
        // var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
        var momentObj = moment(appointmentDate).hour(0).minute(0).second(0).millisecond(0);
        // var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        var utcDate = momentObj.toISOString();

        console.log(utcDate);
        var dateElement = $('.calendar-container').find('[data-date="' + utcDate + '"]');
        dateElement.addClass('event'); // add the event class
        dateElement.addClass('selected'); // add the selected class
    }
    function FocusDoctoronLeave(Leavearray) {
        Leavearray = Leavearray || [];
        angular.forEach(Leavearray, function (item) {
            //var momentObj = moment.utc(item.LeaveDate).hour(4).minute(0).second(0).millisecond(0);
            var momentObj = moment(item.LeaveDate).hour(0).minute(0).second(0).millisecond(0);
            //var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            var utcDate = momentObj.toISOString();

            console.log(utcDate);
            var dateElement = $('.calendar-container').find('[data-date="' + utcDate + '"]');
            dateElement.addClass('event'); // add the event class
            dateElement.addClass('onleave'); // add the onleave class
        });
    }
    function FocusBranchHoliday(BranchHolidaysArray) {
        BranchHolidaysArray = BranchHolidaysArray || [];
        if (BranchHolidaysArray.length > 0) {
            angular.forEach(BranchHolidaysArray, function (item) {
                var momentObj = moment(item.EventDate).hour(0).minute(0).second(0).millisecond(0);
                var utcDate = momentObj.toISOString();
                console.log(utcDate);
                var dateElement = $('.calendar-container').find('[data-date="' + utcDate + '"]');
                dateElement.addClass('event'); // add the event class
                dateElement.addClass('onleave'); // add the onleave class
            });
        }

    }

    $scope.GetUserActiveDatesandSlotsInCalendar = function (type) {
        $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
        $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
        $scope.selectedAppointmentObject.IsDoctorLeave = false;

        var appointmentDate = moment($scope.selectedAppointmentObject.AppointmentDate, "MM-DD-YYYY").format("YYYY-MM-DD");

        var startDate = moment($scope.selectedAppointmentObject.AppointmentDate);
        var endDate = moment(startDate).endOf('month');

        var params = {
            "BranchId": $scope.HospitalId,
            "DoctorId": $scope.selectedAppointmentObject.DoctorID,
            "UserBranchId": $scope.selectedAppointmentObject.UserBranchId,
            "StartDate": startDate.format("YYYY-MM-DD"),
            "EndDate": endDate.format("YYYY-MM-DD"),
            "SelectedDate": appointmentDate
        }

        if (type !== "FormMonth") {
            var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
            console.log(appointmentDate);
            var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
            var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            if (utcDate != undefined) {
                $calendar.customchangeMonth(utcDate);

                var StartDate = new Date($scope.selectedAppointmentObject.AppointmentDate);
                //var t = new Date(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate() + 1);
                var t = new Date(StartDate.getFullYear(), StartDate.getMonth(), 1);
                params.StartDate = $filter('date')(t, "yyyy-MM-dd");
                var StartDate = moment($scope.selectedAppointmentObject.AppointmentDate);
                var t = moment(StartDate).startOf('month');
                params.StartDate = t.format('YYYY-MM-DD');
            }
        }

        eHnoteMainAppointmentService.GetDoctorAvaiableDatesandSlots(params, OnGetDateandSlotSuccess, OnGetDateandSlotError);
        function OnGetDateandSlotSuccess(resp) {

            if (resp.status === 'Success') {
                if (resp.DoctorSlots.length > 0) {
                  //  $scope.selectedAppointmentObject.SendDocSms = true;
                    $scope.DocAvailableDates = [];
                    angular.forEach(resp.DoctorSlots, function (kitem) {
                        var obj = {
                            startDate: moment(kitem.SlotDate + ' ' + "00:00:00", 'YYYY-MM-DD HH:mm:ss').toDate(),
                            endDate: moment(kitem.SlotDate + ' ' + "23:59:59", 'YYYY-MM-DD HH:mm:ss').toDate(),
                            summary: 'Slot Available'
                        };

                        $scope.DocAvailableDates.push(obj);
                    });
                    $calendar.setEvents($scope.DocAvailableDates);

                    // FocusDateinCalendar();
                } else {
                    $scope.DocAvailableDates = [];
                    $calendar.setEvents($scope.DocAvailableDates);
                }
                if (type == "FormMonth") {
                    return false;
                }
                $scope.ApptDurationObj.patinet_consultationTime = "";
                if (resp.DoctorScheduleSlotsByDate != undefined) {
                    if (resp.DoctorScheduleSlotsByDate.status === "Success") {

                        var response = angular.copy(resp.DoctorScheduleSlotsByDate);
                        response.IsBranchHoliday = response.IsBranchHoliday || false;
                        if (response.IsBranchHoliday) {
                            alertify.error("It's a holiday, please choose another date.");

                            $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                            $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
                            return;
                        }
                        if (response.IsLeave) {
                            alertify.error("Doctor is on leave on the selected date!");

                            $scope.selectedAppointmentObject.IsDoctorLeave = true;
                            $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                            $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
                            return;
                        }


                        angular.forEach(response.NormalSlots, function (item) {
                            item.StartTime = item.StartTime.substring(0, 5);
                            item.EndTime = item.EndTime.substring(0, 5);

                            item.seqStartTime = item.StartTime.replace(":", "");
                            item.seqEndTime = item.EndTime.replace(":", "");
                        });
                        angular.forEach(response.TeleSlots, function (item) {
                            item.StartTime = item.StartTime.substring(0, 5);
                            item.EndTime = item.EndTime.substring(0, 5);
                        });
                        $scope.IsMaximumAppointmentsPerDay = false;

                        let ecount = 0, overaalCount = 0;

                        $scope.isAppValiddities.MaxApptError = false;
                        if (response.UserScheduleSlots.length > 0) {
                            response.UserScheduleSlots[0].MaximumOverAllSlots = response.UserScheduleSlots[0].MaximumOverAllSlots || 0;
                            if (response.UserScheduleSlots[0].MaximumOverAllSlots > 0) {
                                if (response.UserScheduleSlots[0].MaximumOverAllSlots <= response.DoctorAppointmentCount) {
                                    overaalCount++;
                                }
                            }

                        }

                        console.log(response.DoctorAppointmentCount + "__" + overaalCount);
                        if (overaalCount > 0) {
                            $scope.IsMaximumAppointmentsPerDay = true;

                            if ($scope.selectedAppointmentObject.AppointmentID === 0) {
                                $scope.isAppValiddities.MaxApptError = true;
                                $scope.isAppValiddities.MaxApptUnblock = false;
                            }

                        }
                        if (ecount > 0) {
                            $scope.IsMaximumAppointmentsPerDay = true;
                            console.log("max1");
                            alertify.error("Maximum Appointments Reached for Visit Reason. Please choose another Visit Reason");
                            return false;
                        }

                        //newreStructureDoctorSelectedSlots(response);
                        if (response.UserScheduleSlots.length > 0) {
                            $scope.ApptDurationObj.patinet_consultationTime = response.UserScheduleSlots[0].MinPerCase || "";
                        }


                        if ($scope.ApptDurationObj.patinet_consultationTime == "") {
                            $scope.ApptDurationObj.patinet_consultationTime = $scope.selectedAppointmentObject.DocObj.MinPerCase.toString() || "15";
                        }
                        // paramter to be used in checkSlotsandSplice() to remove booked slots
                        if (response.UserScheduleSlots.length > 0) {
                            $scope.ApptDurationObj.consultationTime_for_restructure = response.UserScheduleSlots[0].MinPerCase || "";
                        }
                        if ($scope.ApptDurationObj.consultationTime_for_restructure == "") {
                            $scope.ApptDurationObj.consultationTime_for_restructure = $scope.selectedAppointmentObject.DocObj.MinPerCase.toString() || "15";
                        }

                        restructureAvailabiliyandDoctorSlots(response);
                    }
                }
            }

        }
        function OnGetDateandSlotError(error) {
            console.log(error);
        }
    };

    $scope.changetoWaitinglist = function (mainobj) {

        if (mainobj.IsWaitingListAppointment) {
            var filteredArray = $filter('filter')($scope.selectedAppointmentObject.TimeSlotsStartArray, { "StartTime": $scope.selectedAppointmentObject.patinet_appStarttime }, true) || [];
            if (filteredArray.length > 0) {
                filteredArray[0].IsBooked = false;
            }
            $scope.selectedAppointmentObject.StartTime = "";
        }

        if ($scope.pagename == 'reschedule') {
            if (!mainobj.IsWaitingListAppointment) {
                var filteredArray = $filter('filter')($scope.selectedAppointmentObject.TimeSlotsStartArray, { "StartTime": $scope.selectedAppointmentObject.patinet_appStarttime }, true) || [];
                if (filteredArray.length > 0) {
                    filteredArray[0].IsBooked = false;
                }
                $scope.selectedAppointmentObject.StartTime = "";
                $scope.selectedAppointmentObject.patinet_appStarttime = "";
                $scope.selectedAppointmentObject.patient_appEndTime = "";
            }
        }


        //if (mainobj.IsWaitingListAppointment) {
        //    if ($scope.IsMaximumAppointmentsPerDay) {
        //        $scope.selectedAppointmentObject.StartTime = "19:00";
        //        $scope.selectedAppointmentObject.EndTime = "19:15";
        //        $scope.selectedAppointmentObject.patinet_appStarttime = "19:00";
        //        $scope.selectedAppointmentObject.patient_appEndTime = "19:15";
        //    }
        //    $scope.selectedAppointmentObject.IsAppointmentConfirmed = false;
        //    $scope.selectedAppointmentObject.IsConfirmedAppointment = false;
        //    $scope.selectedAppointmentObject.IsNoShowAppointment = false;

        //} else {
        //    if ($scope.IsMaximumAppointmentsPerDay) {
        //        $scope.selectedAppointmentObject.StartTime = "";
        //        $scope.selectedAppointmentObject.EndTime = "";
        //        $scope.selectedAppointmentObject.patinet_appStarttime = "";
        //        $scope.selectedAppointmentObject.patient_appEndTime = "";
        //    }
        //}


    };


    $scope.rescheduleobj = {
        "IsReschedule": false
    }
    $scope.Endtimechange1 = function (starttime, Mainitem) {

        if ($scope.selectedAppointmentObject.IsWaitingListAppointment) {
            alertify.error("Appointment is in waiting status! Please make sure to uncheck waiting checkbox to select time slot");
            return false;
        }

        $scope.rescheduleobj.IsReschedule = false;
        if ($scope.selectedAppointmentObject.AppointmentID !== 0) {
            console.log(AppointmentDetailsCache);
            console.log($scope.selectedAppointmentObject);


            var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
            console.log(appointmentDate);


            var result = dateCompare(AppointmentDetailsCache.AppointmentDate, appointmentDate);
            console.log(result);
            if (result) {

                //var tresult = compareTime(AppointmentDetailsCache.StartTime, starttime.StartTime);
                //console.log(tresult)
                //    if (!tresult) {
                //        $scope.rescheduleobj.IsReschedule = true;
                //    }

                $scope.rescheduleobj.IsReschedule = false;
            } else {
                $scope.rescheduleobj.IsReschedule = true;
            }
        }

        $scope.selectedAppointmentObject.VisitReasonId = $scope.selectedAppointmentObject.VisitReasonId || null
        if ($scope.selectedAppointmentObject.VisitReasonId === null) {
            // alertify.error("Please select visit reason!");
            return;
        }
        starttime.MaxNumberOfSlots = starttime.MaxNumberOfSlots || 0;
        starttime.MaximumOverAllSlots = starttime.MaximumOverAllSlots || 0;

        if (starttime.MaximumOverAllSlots > 0) {
            if (starttime.OverallCount === starttime.MaximumOverAllSlots || starttime.OverallCount > starttime.MaximumOverAllSlots) {
                /*alertify.error("Max slot limit reached for this time slot!");*/
                $scope.isAppValiddities.MaxApptError = true;
                $scope.isAppValiddities.MaxApptUnblock = false;
                $scope.isAppValiddities.IsfocusinNotes = false;
                $scope.isAppValiddities.MaxApptErrorMsgShow = false;
                $scope.isAppValiddities.BlockedSlotObj = starttime;

                $scope.isAppValiddities.isEnableAlertType = false;
                $scope.isAppValiddities.UnblockSlots = false;
                $scope.isAppValiddities.IsEnabledAfterCheckHere = false;

                return;
            } else {
                if (starttime.MaxNumberOfSlots !== 0) {
                    if (starttime.Count === starttime.MaxNumberOfSlots || starttime.Count > starttime.MaxNumberOfSlots) {
                        alertify.error("Max slot limit reached for this time slot!");
                        $scope.isAppValiddities.MaxApptError = true;
                        $scope.isAppValiddities.MaxApptUnblock = false;
                        $scope.isAppValiddities.IsfocusinNotes = false;
                        $scope.isAppValiddities.MaxApptErrorMsgShow = false;
                        $scope.isAppValiddities.BlockedSlotObj = starttime;

                        $scope.isAppValiddities.isEnableAlertType = false;
                        $scope.isAppValiddities.UnblockSlots = false;
                        $scope.isAppValiddities.IsEnabledAfterCheckHere = false;

                        return;
                    }
                }
            }
        }
        if (starttime.MaxNumberOfSlots !== 0) {
            if (starttime.Count === starttime.MaxNumberOfSlots || starttime.Count > starttime.MaxNumberOfSlots) {
                alertify.error("Max slot limit reached for this time slot!");
                $scope.isAppValiddities.MaxApptError = true;
                $scope.isAppValiddities.MaxApptUnblock = false;
                $scope.isAppValiddities.IsfocusinNotes = false;
                $scope.isAppValiddities.MaxApptErrorMsgShow = false;
                $scope.isAppValiddities.BlockedSlotObj = starttime;

                $scope.isAppValiddities.isEnableAlertType = false;
                $scope.isAppValiddities.UnblockSlots = false;
                $scope.isAppValiddities.IsEnabledAfterCheckHere = false;

                return;
            }
        }


        console.log(starttime.Available + "__Available");

        if (starttime.Available == "N") {
            alertify.error("Slot not available ,unblock slot and continue");
            $scope.isAppValiddities.isEnableAlertType = true;
            $scope.isAppValiddities.isValidOptionSelected = false;
            $scope.isAppValiddities.UnblockSlots = true;
            $scope.isAppValiddities.IsEnabledAfterCheckHere = false;
            $scope.isAppValiddities.BlockedSlotObj = starttime;

            $scope.isAppValiddities.MaxApptError = false;
            $scope.isAppValiddities.IsfocusinNotes = false;
            $scope.isAppValiddities.MaxApptErrorMsgShow = false;
            return false;
        }


        if (starttime.Available == "N" && ($scope.RoleId == 63 || $scope.RoleId === 65 || $scope.RoleId === 67 || $scope.RoleId === 69)) {
            $scope.isAppValiddities.isEnableAlertType = true;
            $scope.isAppValiddities.isValidOptionSelected = false;
            $scope.isAppValiddities.UnblockSlots = false;
            $scope.isAppValiddities.IsEnabledAfterCheckHere = false;
            GetAppoitmentTypebyStartTime(starttime);
        } else if (starttime.Available == "Y") {
            $scope.isAppValiddities.isEnableAlertType = false;
            $scope.isAppValiddities.isValidOptionSelected = true;
            $scope.isAppValiddities.UnblockSlots = false;
            $scope.isAppValiddities.IsEnabledAfterCheckHere = false;
            starttime.Available = 'Y';
            $scope.ApptMaintainfields.AppointmentTypeDisplay = "";

            $scope.isAppValiddities.MaxApptError = false;
            $scope.isAppValiddities.IsfocusinNotes = false;
            $scope.isAppValiddities.MaxApptErrorMsgShow = false;
        }


        Mainitem.patinet_appStarttime = starttime.StartTime;

        $scope.selectedAppointmentObject.StartTime = starttime.StartTime || "";


        $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
        var Index = $scope.selectedAppointmentObject.TimeSlotsStartArray.findIndex(record => record.StartTime === Mainitem.patinet_appStarttime);
        if (Index > -1) {
            angular.forEach($scope.selectedAppointmentObject.TimeSlotsStartArray, function (sitem, index1) {
                if (index1 >= Index) {
                    $scope.selectedAppointmentObject.TimeSlotsEndArray.push(sitem);
                }
            });
        }

        Mainitem.patient_appEndTime = $scope.selectedAppointmentObject.TimeSlotsEndArray[0].EndTime.toString();
        console.log(Mainitem.patient_appEndTime);
        GetAppoitmentTypebyStartTime(starttime);
        console.log($scope.selectedAppointmentObject.TimeSlotsEndArray[0]);
    }


    function compareTime(str1, str2) {
        var time1 = str1;
        var time2 = str2;

        function getTimeAsNumberOfMinutes(time) {
            var timeParts = time.split(":");

            var timeInMinutes = (timeParts[0] * 60) + timeParts[1];

            return timeInMinutes;
        }
        var time1InMinutesForTime1 = getTimeAsNumberOfMinutes(time1);
        var time1InMinutesForTime2 = getTimeAsNumberOfMinutes(time2);



        var result = false;
        if (time1InMinutesForTime1 === time1InMinutesForTime2) {
            result = true;
        }
        return result;
    }


    function GetCalenarScreenslotsrestriction() {
        var starttime = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm') || "";
        if (starttime != "") {
            if ($scope.selectedAppointmentObject.TimeSlotsStartArray.length > 0) {
                var filteredArray = $filter('filter')($scope.selectedAppointmentObject.TimeSlotsStartArray, { "StartTime": starttime }, true) || [];
                if (filteredArray.length > 0) {
                    $scope.Endtimechange1(filteredArray[0], $scope.selectedAppointmentObject);
                }
            }
        }

    }


    function restructureAvailabiliyandDoctorSlots(resp) {

        //$scope.dateObject = new Date($scope.selectedAppointmentObject.AppointmentDate);
        //var appointmentDate = $filter('date')($scope.dateObject, "yyyy-MM-dd");
        var appointmentDate = moment($scope.selectedAppointmentObject.AppointmentDate).format("YYYY-MM-DD");
        console.log(appointmentDate);


        console.log($scope.selectedAppointmentObject.DocObj.MinPerCase);

        var MinperCase = $scope.selectedAppointmentObject.DocObj.MinPerCase || 15;
        $scope.allUserAvailabilitySlots = {
            "SlotDate": appointmentDate,
            //"StartTime": "06:00",
            //"EndTime": "19:00",
            "StartTime": "00:00",
            "EndTime": "23:59",
            "MinPerCase": MinperCase
        };

        if (resp.UserScheduleSlots.length > 0) {
            if (resp.UserScheduleSlots[0].MinPerCase != undefined) {
                $scope.allUserAvailabilitySlots.MinPerCase = parseInt(resp.UserScheduleSlots[0].MinPerCase);
                $scope.allUserAvailabilitySlots.StartTime = angular.copy(resp.UserScheduleSlots[0].StartTime);
                $scope.allUserAvailabilitySlots.EndTime = angular.copy(resp.UserScheduleSlots[0].EndTime);
            }
        }

        $scope.timeslots = [];
        $scope.availableSlots = [];
        var GivenDate = moment($scope.allUserAvailabilitySlots.SlotDate);
        var CurrentDate = moment();

        GivenDate = GivenDate.format('MM-DD-YYYY');
        $scope.iscurrentDate = false;

        let x = moment(GivenDate, 'MM-DD-YYYY');
        let Y = moment(CurrentDate);

        // Compare dates
        if (x.isAfter(Y, 'day')) {
            $scope.iscurrentDate = false;
        } else {
            $scope.iscurrentDate = true;
        }

     $scope.time = moment().format('HH:mm');

        var arr = $scope.allUserAvailabilitySlots.StartTime.split(':');
        var shour = $.trim(arr[0]);
        var smin = $.trim(arr[1]);
        var arr2 = $scope.allUserAvailabilitySlots.EndTime.split(':')
        var ehour = $.trim(arr2[0]);
        var emin = $.trim(arr2[1]);
        var startingTime = moment().hours(shour).minutes(smin);
        var endingTime = moment().hours(ehour).minutes(emin);

        var currentStartTime = angular.copy(startingTime);
        var token = 1;
        while (currentStartTime < endingTime) {

            var slotObj = {
                "StartTime": currentStartTime.format("HH:mm"),
                "EndTime": currentStartTime.add($scope.allUserAvailabilitySlots.MinPerCase, "minute").format("HH:mm"),
                "TokenNumber": token,
                "Available": "N",
                "IsBooked": false,
                "Count": 0,
                "MaxNumberOfSlots": 0,
                "OverallCount": resp.DoctorAppointmentCount || 0,
                "MaximumOverAllSlots": (resp.UserScheduleSlots.length > 0) ? resp.UserScheduleSlots[0].MaximumOverAllSlots : 0
            }
            token++;
            slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
            slotObj.seqEndTime = slotObj.EndTime.replace(":", "");
            var datetime = $scope.allUserAvailabilitySlots.SlotDate + "T"+ slotObj.StartTime;
            slotObj.NewStartTime = "";
            slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
            //console.log(slotObj.NewStartTime + "" + datetime);
            $scope.timeslots.push(slotObj);
        }


        if ($scope.iscurrentDate === true) {
            $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
        }

        if (resp.UserScheduleSlots.length > 0) {
            $scope.availableSlots = [];
            $scope.isAppValiddities.UserScheduleId = resp.UserScheduleSlots[0].UserScheduleId;
            angular.forEach(resp.UserScheduleSlots, function (item) {
                item.ScheduleVisitTypeDetails = item.ScheduleVisitTypeDetails || [];
                item.MinPerCase = parseInt(item.MinPerCase);
                $scope.Breaktimeslots = [];

                item.UserDayBlockedSlots = item.UserDayBlockedSlots || [];
                item.UserDayBreakSlots = $filter('filter')(item.UserDayBreakSlots, { "UserBranchId": item.UserBranchId }, true);

                // remove scheduled break slot which is of type unblock
                angular.forEach(item.UserDayBlockedSlots, function (jitem) {
                    jitem.IsDelete = false;
                });
                angular.forEach(item.UserDayBreakSlots, function (hitem) {
                    hitem.IsDelete = false;
                });
                angular.forEach(item.UserDayBlockedSlots, function (jitem, index1) {
                    let arr = jitem.StartTime.split(":");
                    let s1 = arr[0] + ":" + arr[1];
                    jitem.StartTime = s1;

                    angular.forEach(item.UserDayBreakSlots, function (hitem, index2) {
                        if (jitem.Status === "Unblocked" && jitem.StartTime === hitem.StartTime) {
                            jitem.IsDelete = true;
                            hitem.IsDelete = true;
                        }
                    });
                });

                item.UserDayBreakSlots = $filter('filter')(item.UserDayBreakSlots, { "IsDelete": false }, true);
                item.UserDayBlockedSlots = $filter('filter')(item.UserDayBlockedSlots, { "IsDelete": false }, true);

                if (item.UserDayBlockedSlots.length > 0) {
                    angular.forEach(item.UserDayBlockedSlots, function (jitem) {
                        if (item.UserBranchId === jitem.UserBranchId) {
                            item.UserDayBreakSlots = item.UserDayBreakSlots || [];
                            item.UserDayBreakSlots.push(jitem);
                        }

                    });
                }

                if (item.UserDayBreakSlots.length > 0) {
                    angular.forEach(item.UserDayBreakSlots, function (Bitem) {
                        var arr = Bitem.StartTime.split(':');
                        var shour = $.trim(arr[0]);
                        var smin = $.trim(arr[1]);
                        var arr2 = Bitem.EndTime.split(':')
                        var ehour = $.trim(arr2[0]);
                        var emin = $.trim(arr2[1]);
                        var startingTime = moment().hours(shour).minutes(smin);
                        var endingTime = moment().hours(ehour).minutes(emin);



                        var currentStartTime = angular.copy(startingTime);
                        var token = 1;
                        // REVERTED: must stay the day's grid step (item.MinPerCase), not this break's own
                        // DurationMinutes — see comment on the same revert in
                        // UsBookAppointmentPopupv2.js's restructureAvailabiliyandDoctorSlots.
                        var breakStep = parseInt(item.MinPerCase, 10) || 15;
                        while (currentStartTime < endingTime) {

                            var slotObj = {
                                "StartTime": currentStartTime.format("HH:mm"),
                                "EndTime": currentStartTime.add(breakStep, "minute").format("HH:mm"),
                                "TokenNumber": token,
                                "IsBooked": false,
                                "Available": "Y"
                            }
                            token++;
                            slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                            slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                            var datetime = item.SlotDate + "T" + slotObj.StartTime;
                            slotObj.NewStartTime = "";
                            slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
                            console.log(slotObj.NewStartTime + "" + datetime);
                            $scope.Breaktimeslots.push(slotObj);


                        }
                    });
                }


                //// display free slots as enabled slots
                //Commented By Durga on 02-06-2023 to disable the slots when slots not available for particular visit reason
                //let stt; let edt;
                //stt = item.StartTime.replace(":", "");
                //edt = item.EndTime.replace(":", "");
                //angular.forEach($scope.timeslots, function (iterator) {
                //    if (parseInt(iterator.seqStartTime) >= parseInt(stt) && parseInt(iterator.seqStartTime) <= parseInt(edt)) {
                //        iterator.Available = "Y";
                //    }
                //});

                // disable break slots
                angular.forEach($scope.timeslots, function (iterator) {
                    angular.forEach($scope.Breaktimeslots, function (iterator1) {
                        if (iterator.StartTime === iterator1.StartTime) {
                            iterator.Available = "N";
                        }
                    });
                });

                // end 

                if (item.SlotsList.length > 0) {

                    if (item.IsAdvancedSchedule) {

                        angular.forEach(item.SlotsList, function (Aitem) {
                            var currentStartTime = angular.copy(Aitem.StartTime);
                            var currentEndTime = angular.copy(Aitem.EndTime);
                            var token = 1;

                            // to enable only selected visit reason related slot
                            let ct = 0;
                            angular.forEach(Aitem.VisitReasons, function (item) {
                                if (item.ReasonId === $scope.selectedAppointmentObject.VisitReasonId) {
                                    ct++;
                                }
                            });

                            var slotObj = {
                                "StartTime": currentStartTime,
                                "EndTime": currentEndTime,
                                "TokenNumber": token,
                                "Available": (ct > 0) ? "Y" : "N",
                                "IsBooked": false,
                                "MaxNumberOfSlots": Aitem.MaxNumberOfSlots || 0,
                                "Count": 0,
                                "OverallCount": resp.DoctorAppointmentCount || 0,
                                "MaximumOverAllSlots": item.MaximumOverAllSlots || 0
                            }
                            token++;
                            slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                            slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                            var datetime = item.SlotDate + "T" + slotObj.StartTime;
                            slotObj.NewStartTime = "";
                            slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                            $scope.availableSlots.push(slotObj);

                        });

                        // assigning booked count for slot
                        angular.forEach($scope.availableSlots, function (hitem) {
                            angular.forEach(resp.NormalSlots, function (kitem) {
                                let res = kitem.StartTime.split(":");
                                kitem.StartTime = res[0] + ":" + res[1];
                                if (kitem.StartTime === hitem.StartTime) {
                                    hitem.Count = hitem.Count || 0;
                                    hitem.Count = hitem.Count + (kitem.Count || 0);
                                }
                            });
                        });

                        if ($scope.iscurrentDate === true) {
                            $scope.availableSlots = $filter("filter")($scope.availableSlots, function (kitem, index) { return kitem.StartTime > $scope.time });
                        }

                    }
                    else {

                        angular.forEach(item.SlotsList, function (Aitem) {
                            let Count;
                            if (Aitem.VisitReasons[0].VisitTypeId === 1) {
                                Count = resp.DoctorNewAppointmentCount || 0;
                                //var start1 = Aitem.StartTime.replace(':', '');
                                //var starttime = parseInt(start1);
                                //var end1 = Aitem.EndTime.replace(':', '');
                                //var endtime = parseInt(end1);
                                var count1 = 0;
                                //if (resp.NormalSlots.length > 0) {
                                //    angular.forEach(resp.NormalSlots, function (nitem) {

                                //    });
                                //}
                            }
                            if (Aitem.VisitReasons[0].VisitTypeId === 2) {
                                Count = resp.DoctorClinicFollowUpAppointmentCount || 0;
                            }
                            if (Aitem.VisitReasons[0].VisitTypeId === 3) {
                                Count = resp.DoctorPostOpFollowUpAppointmentCount || 0;
                            }
                            if (Aitem.VisitReasons[0].VisitTypeId === 4 || Aitem.VisitReasons[0].VisitTypeId === 14) {
                                Count = resp.DoctorAscAppointmentCount || 0;
                            }
                            if (Aitem.VisitReasons[0].VisitTypeId === 5) {
                                Count = resp.DoctorInvestigationAppointmentCount || 0;
                            }

                            var arr = Aitem.StartTime.split(':');
                            var shour = $.trim(arr[0]);
                            var smin = $.trim(arr[1]);


                            var arr2 = Aitem.EndTime.split(':')
                            var ehour = $.trim(arr2[0]);
                            var emin = $.trim(arr2[1]);
                            var startingTime = moment().hours(shour).minutes(smin);
                            var endingTime = moment().hours(ehour).minutes(emin);

                            var currentStartTime = angular.copy(startingTime);
                            var token = 1;

                            // to enable only selected visit reason related slot
                            let ct = 0;
                            angular.forEach(Aitem.VisitReasons, function (item) {
                                if (item.VisitTypeId === $scope.selectedAppointmentObject.VisitTypeId) {
                                    ct++;
                                }
                            });
                            while (currentStartTime < endingTime) {

                                var slotObj = {
                                    "StartTime": currentStartTime.format("HH:mm"),
                                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                    "TokenNumber": token,
                                    "Available": (ct > 0) ? "Y" : "N",
                                    "IsBooked": false,
                                    "MaxNumberOfSlots": Aitem.MaxNumberOfSlots || 0,
                                    "Count": Count,
                                    "OverallCount": resp.DoctorAppointmentCount || 0,
                                    "MaximumOverAllSlots": item.MaximumOverAllSlots || 0
                                }
                                token++;
                                slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                slotObj.NewStartTime = "";
                                slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                $scope.availableSlots.push(slotObj);

                            }

                            if ($scope.iscurrentDate === true) {
                                $scope.availableSlots = $filter("filter")($scope.availableSlots, function (kitem, index) { return kitem.StartTime > $scope.time });
                            }
                        });
                    }

                    // onlineslots
                    if (item.OnlineSlots.length > 0) {
                        angular.forEach(item.OnlineSlots, function (Aitem) {
                            var arr = Aitem.StartTime.split(':');
                            var shour = $.trim(arr[0]);
                            var smin = $.trim(arr[1]);
                            var arr2 = Aitem.EndTime.split(':')
                            var ehour = $.trim(arr2[0]);
                            var emin = $.trim(arr2[1]);
                            var startingTime = moment().hours(shour).minutes(smin).seconds('00');
                            var endingTime = moment().hours(ehour).minutes(emin).seconds('00');
                            var currentStartTime = angular.copy(startingTime);
                            var token = 1;
                            while (currentStartTime < endingTime) {

                                var slotObj = {
                                    "StartTime": currentStartTime.format("HH:mm"),
                                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                    "TokenNumber": token,
                                    "IsBooked": false,
                                    "Available": "Y",
                                    "MaxNumberOfSlots": 0,
                                    "Count": 0,
                                    "OverallCount": resp.DoctorAppointmentCount || 0,
                                    "MaximumOverAllSlots": item.MaximumOverAllSlots || 0
                                }
                                token++;
                                slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                slotObj.NewStartTime = "";
                                slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
                                $scope.availableSlots.push(slotObj);
                            }
                            if ($scope.iscurrentDate === true) {
                                $scope.availableSlots = $filter("filter")($scope.availableSlots, function (kitem, index) { return kitem.StartTime > $scope.time });
                            }
                        });
                    }
                }
                else {
                    var arr = item.StartTime.split(':');
                    var shour = $.trim(arr[0]);
                    var smin = $.trim(arr[1]);
                    var arr2 = item.EndTime.split(':')
                    var ehour = $.trim(arr2[0]);
                    var emin = $.trim(arr2[1]);
                    var startingTime = moment().hours(shour).minutes(smin);
                    var endingTime = moment().hours(ehour).minutes(emin);

                    var currentStartTime = angular.copy(startingTime);
                    var token = 1;

                    let Count;
                    if ($scope.pagename !== 'reschedule') {
                        Count = resp.DoctorAppointmentCount || 0;
                    } else {
                        Count = 0;
                    }

                    while (currentStartTime < endingTime) {

                        var slotObj = {
                            "StartTime": currentStartTime.format("HH:mm"),
                            "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                            "TokenNumber": token,
                            "Available": "Y",
                            "IsBooked": false,
                            "MaxNumberOfSlots": item.MaximumOverAllSlots || 0,
                            "Count": Count,
                            "OverallCount": resp.DoctorAppointmentCount || 0,
                            "MaximumOverAllSlots": item.MaximumOverAllSlots || 0
                        }
                        token++;
                        slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                        slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                        var datetime = item.SlotDate + "T" + slotObj.StartTime;
                        slotObj.NewStartTime = "";
                        slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
                        //console.log(slotObj.NewStartTime + "" + datetime);
                        $scope.availableSlots.push(slotObj);


                    }

                    if ($scope.availableSlots.length > 0 && $scope.Breaktimeslots.length > 0) {
                        angular.forEach($scope.Breaktimeslots, function (titem) {
                            angular.forEach($scope.availableSlots, function (bitem, index) {
                                if (titem.StartTime == bitem.StartTime) {
                                    $scope.availableSlots.splice(index, 1);
                                }
                            });
                        });
                    }
                    if ($scope.iscurrentDate === true) {
                        $scope.availableSlots = $filter("filter")($scope.availableSlots, function (kitem, index) { return kitem.StartTime > $scope.time });
                    }
                }
            });
        }


        //If we want to remove booked slots we can enable this 
        console.log($scope.selectedAppointmentObject.DocObj.RestrictMultipleSlots);

        if ($scope.selectedAppointmentObject.DocObj.RestrictMultipleSlots) {
            if (resp.NormalSlots.length > 0) {
                var Array = checkSlotsAlreadyBooked($scope.availableSlots, resp.NormalSlots);
                $scope.availableSlots = angular.copy(Array);
            }
        } else {

            if (resp.NormalSlots.length > 0) {
                var Array = checkSlotsAlreadyBookedWithYellow($scope.availableSlots, resp.NormalSlots);
                $scope.availableSlots = angular.copy(Array);
            }
        }




        // commented because for already booked slots and slot not restricted, we should allow booking: Sumanth
        //else {
        //    if (resp.NormalSlots.length > 0) {
        //        var Array = checkSlotsAlreadyBooked($scope.availableSlots, resp.NormalSlots);
        //        $scope.availableSlots = angular.copy(Array);
        //    }
        //}


        if ($scope.timeslots.length > 0) {
            angular.forEach($scope.timeslots, function (item1) {

                var filteredArray = $scope.availableSlots.filter(function (slot) {
                    return moment(slot.StartTime, "HH:mm").isSame(moment(item1.StartTime, "HH:mm"));
                });

                if (filteredArray.length > 0) {
                    if (filteredArray[0].Available == "Y") {
                        item1.Available = "Y";
                        item1.IsBooked = filteredArray[0].IsBooked || false;
                        item1.Count = filteredArray[0].Count || 0;
                        item1.MaxNumberOfSlots = filteredArray[0].MaxNumberOfSlots || 0;
                        item1.OverallCount = filteredArray[0].OverallCount || 0;
                        item1.MaximumOverAllSlots = filteredArray[0].MaximumOverAllSlots || 0;

                        item1.IsCompletedMaxNumberofSlots = false;
                        // Slotlist completed max slots 
                        if (item1.MaxNumberOfSlots !== 0) {
                            if (item1.Count === item1.MaxNumberOfSlots || item1.Count > item1.MaxNumberOfSlots) {
                                item1.IsCompletedMaxNumberofSlots = true;
                            }
                        }

                    } else {
                        item1.Available = "N";
                        item1.Count = filteredArray[0].Count || 0;
                        item1.MaxNumberOfSlots = filteredArray[0].MaxNumberOfSlots || 0;
                        item1.OverallCount = filteredArray[0].OverallCount || 0;
                        item1.MaximumOverAllSlots = filteredArray[0].MaximumOverAllSlots || 0;
                        item1.IsBooked = false;

                        item1.IsCompletedMaxNumberofSlots = false;

                    }
                } else {
                    item1.IsBooked = false;
                }
                var res = item1.StartTime.split(":");
                item1.StartTime = res[0] + ":" + res[1];
                $scope.selectedAppointmentObject.TimeSlotsStartArray.push(item1);
                $scope.selectedAppointmentObject.TimeSlotsEndArray.push(item1);

            });

        }

        $scope.Breaktimeslots = $scope.Breaktimeslots || [];
        if ($scope.selectedAppointmentObject.TimeSlotsStartArray.length > 0 && $scope.Breaktimeslots.length > 0) {
            angular.forEach($scope.selectedAppointmentObject.TimeSlotsStartArray, function (iterator) {
                angular.forEach($scope.Breaktimeslots, function (iterator1) {
                    if (iterator.StartTime === iterator1.StartTime) {
                        iterator.Available = "N";
                    }
                });
            });
        }


        if ($scope.pagename == 'reschedule') {
            $scope.selectedAppointmentObject.TimeSlotsStartArray = $scope.selectedAppointmentObject.TimeSlotsStartArray || [];
            var token = $scope.selectedAppointmentObject.TimeSlotsStartArray.length + 1;
            var date_T = $filter("date")(new Date(), "yyyy-MM-dd");
            var datetime = date_T + "T" + $scope.selectedAppointmentObject.StartTime;
            var NewStartTime = "";
            NewStartTime = $filter('date')(datetime, "hh:mm a");

            var filteredArray = $filter('filter')($scope.selectedAppointmentObject.TimeSlotsStartArray, { "StartTime": $scope.selectedAppointmentObject.StartTime }, true);
            if (filteredArray.length == 0 && $scope.selectedAppointmentObject.StartTime != "") {
                var slotObj = {
                    "StartTime": $scope.selectedAppointmentObject.StartTime,
                    "EndTime": $scope.selectedAppointmentObject.EndTime,
                    "NewStartTime": NewStartTime,
                    "TokenNumber": token,
                    "Available": "Y"
                }
                slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                slotObj.seqEndTime = slotObj.EndTime.replace(":", "");
                $scope.selectedAppointmentObject.TimeSlotsStartArray.push(slotObj);
            }
        }

        if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar' && $scope.pagename == 'book') {
            $scope.Doctorcalendarobj.OutOfBusinessTime = $scope.Doctorcalendarobj.OutOfBusinessTime || false;

            $scope.selectedAppointmentObject.TimeSlotsStartArray = $scope.selectedAppointmentObject.TimeSlotsStartArray || [];
            var token = $scope.selectedAppointmentObject.TimeSlotsStartArray.length + 1;

            var date_T = $filter("date")(new Date(), "yyyy-MM-dd");
            var datetime = date_T + "T" + $scope.selectedAppointmentObject.StartTime;
            var NewStartTime = "";
            NewStartTime = $filter('date')(datetime, "hh:mm a");
            $scope.selectedAppointmentObject.EndTime = $filter('date')(new Date($scope.Doctorcalendarobj.Endtime), 'HH:mm');

            if ($scope.selectedAppointmentObject.StartTime != "") {
                var filteredArray = $filter('filter')($scope.selectedAppointmentObject.TimeSlotsStartArray, { "StartTime": $scope.selectedAppointmentObject.StartTime }, true);
                if (filteredArray.length == 0) {
                    var slotObj = {
                        "StartTime": $scope.selectedAppointmentObject.StartTime,
                        "EndTime": $scope.selectedAppointmentObject.EndTime,
                        "NewStartTime": NewStartTime,
                        "TokenNumber": token,
                        "Available": "Y"
                    }

                    if ($scope.Doctorcalendarobj.OutOfBusinessTime) {
                        $scope.isAppValiddities.isEnableAlertType = true;
                        $scope.isAppValiddities.isValidOptionSelected = false;
                        $scope.isAppValiddities.UnblockSlots = true;
                        // $scope.isAppValiddities.isValidOptionSelected = true;
                        $scope.isAppValiddities.IsfocusinNotes = true;
                        slotObj.Available = "N";
                    }
                    slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                    slotObj.seqEndTime = slotObj.EndTime.replace(":", "");
                    $scope.selectedAppointmentObject.TimeSlotsStartArray.push(slotObj);
                }

            }


            GetCalenarScreenslotsrestriction();
        }






    };

    function checkSlotsandSplice(array, bookedarray) {


        angular.forEach(bookedarray, function (item) {

            // new code for restrict slots that are already booke, slots with diff duration: sumanth
            let diff = parseInt(item.seqEndTime) - parseInt(item.seqStartTime);
            let tempSlotsArray = [];
            let patientConsultationTime = parseInt($scope.ApptDurationObj.consultationTime_for_restructure);
            if (item.seqEndTime !== "0000" && patientConsultationTime !== diff) {
                let arr = item.StartTime.split(':');
                let shour = $.trim(arr[0]);
                let smin = $.trim(arr[1]);
                let arr2 = item.EndTime.split(':');
                let ehour = $.trim(arr2[0]);
                let emin = $.trim(arr2[1]);
                let startingTime = moment().hours(shour).minutes(smin);
                let endingTime = moment().hours(ehour).minutes(emin);

                let currentStartTime = angular.copy(startingTime);

                while (currentStartTime < endingTime) {

                    let slotObj = {
                        "StartTime": currentStartTime.format("HH:mm"),
                        "EndTime": currentStartTime.add(patientConsultationTime, "minute").format("HH:mm"),
                    }

                    slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                    slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                    tempSlotsArray.push(slotObj);

                }
            }
            if (tempSlotsArray.length > 0) {
                angular.forEach(tempSlotsArray, function (kitem) {
                    for (var i = array.length - 1; i >= 0; i--) {
                        if (kitem.StartTime === array[i].StartTime) {
                            array.splice(i, 1);
                            //array[i].Available = 'N';
                        }
                    }
                });
            } else {
                for (var i = array.length - 1; i >= 0; i--) {
                    if (item.StartTime === array[i].StartTime) {
                        array.splice(i, 1);
                        //array[i].Available = 'N';
                    }
                }
            }

        });



        return array;
    }

    function checkSlotsAlreadyBooked(array, bookedarray) {

        angular.forEach(bookedarray, function (item) {

            // new code for restrict slots that are already booked, slots with diff duration: sumanth
            let diff = parseInt(item.seqEndTime) - parseInt(item.seqStartTime);
            let tempSlotsArray = [];
            let patientConsultationTime = parseInt($scope.ApptDurationObj.consultationTime_for_restructure);
            if (item.seqEndTime !== "0000" && patientConsultationTime !== diff) {
                let arr = item.StartTime.split(':');
                let shour = $.trim(arr[0]);
                let smin = $.trim(arr[1]);
                let arr2 = item.EndTime.split(':');
                let ehour = $.trim(arr2[0]);
                let emin = $.trim(arr2[1]);
                let startingTime = moment().hours(shour).minutes(smin);
                let endingTime = moment().hours(ehour).minutes(emin);

                let currentStartTime = angular.copy(startingTime);

                while (currentStartTime < endingTime) {

                    let slotObj = {
                        "StartTime": currentStartTime.format("HH:mm"),
                        "EndTime": currentStartTime.add(patientConsultationTime, "minute").format("HH:mm")
                    }

                    slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                    slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                    tempSlotsArray.push(slotObj);

                }
            }
            if (tempSlotsArray.length > 0) {
                angular.forEach(tempSlotsArray, function (kitem) {
                    for (var i = array.length - 1; i >= 0; i--) {
                        if (kitem.StartTime === array[i].StartTime) {
                            array[i].Available = 'N';
                        }
                    }
                });
            } else {
                for (var i = array.length - 1; i >= 0; i--) {
                    if (item.StartTime === array[i].StartTime) {
                        array[i].Available = 'N';
                    }
                }
            }

        });

        //angular.forEach(bookedarray, function (item) {
        //    for (var i = array.length - 1; i >= 0; i--) {
        //        if (item.StartTime === array[i].StartTime) {
        //            array[i].Available = "N";
        //        }
        //    };
        //});



        return array;
    }

    function checkSlotsAlreadyBookedWithYellow(array, bookedarray) {

        angular.forEach(bookedarray, function (item) {


            let diff = parseInt(item.seqEndTime) - parseInt(item.seqStartTime);
            let tempSlotsArray = [];
            let patientConsultationTime = parseInt($scope.ApptDurationObj.consultationTime_for_restructure);
            if (item.seqEndTime !== "0000" && patientConsultationTime !== diff) {
                let arr = item.StartTime.split(':');
                let shour = $.trim(arr[0]);
                let smin = $.trim(arr[1]);
                let arr2 = item.EndTime.split(':');
                let ehour = $.trim(arr2[0]);
                let emin = $.trim(arr2[1]);
                let startingTime = moment().hours(shour).minutes(smin);
                let endingTime = moment().hours(ehour).minutes(emin);

                let currentStartTime = angular.copy(startingTime);

                while (currentStartTime < endingTime) {

                    let slotObj = {
                        "StartTime": currentStartTime.format("HH:mm"),
                        "EndTime": currentStartTime.add(patientConsultationTime, "minute").format("HH:mm")
                    }

                    slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                    slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                    tempSlotsArray.push(slotObj);

                }
            }
            if (tempSlotsArray.length > 0) {
                angular.forEach(tempSlotsArray, function (kitem) {
                    for (var i = array.length - 1; i >= 0; i--) {
                        if (kitem.StartTime === array[i].StartTime) {
                            //array[i].Available = 'Y';
                            array[i].IsBooked = true;
                        }
                    }
                });
            } else {
                for (var i = array.length - 1; i >= 0; i--) {
                    if (item.StartTime === array[i].StartTime) {
                        //array[i].Available = 'Y';
                        array[i].IsBooked = true;
                    }
                }
            }

        });

        //angular.forEach(bookedarray, function (item) {
        //    for (var i = array.length - 1; i >= 0; i--) {
        //        if (item.StartTime === array[i].StartTime) {
        //            array[i].Available = "N";
        //        }
        //    };
        //});



        return array;
    }

    $scope.BackToPreviousScreen = function () {
        $scope.ApptMaintainfields.IsAppointmentScreen = false;
    }

    $scope.changeEligibilityVerificationManual = function (mainobj) {
        if (mainobj.IsVerified) {
            $scope.PatientInsuranceObj.VerifiedBy = eHnoteMasterDataService.getLoginId();
        } else {

            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to Uncheck the Verified Status?</h4>", function () {
                $scope.PatientInsuranceObj.EligibilityStatusId = 0;
                $scope.PatientInsuranceObj.VerifiedBy = 0;
            }, function () {
                $scope.PatientInsuranceObj.IsVerified = !$scope.PatientInsuranceObj.IsVerified;
            });
        }
    };
    $scope.AllAppointmentsArray = [];
    $scope.GetUpcomingAppointments = function (patientId) {


        var PHospitID = null;
        var HospitID = null;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            PHospitID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            HospitID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        }
        eHnoteUserAppointmentDataService.GetPatientUpcomingAppointments(patientId, PHospitID).then(function (response) {
            console.log(response);
            $scope.AllAppointmentsArray = [];
            if (response.data.Status == "Success") {
                $scope.AllAppointmentsArray = response.data.AllAppointments || [];
                if ($scope.AllAppointmentsArray.length > 0) {
                    angular.forEach($scope.AllAppointmentsArray, function (item) {
                        item.ShowAppointmentNotes = false;
                        item.ShortStartTime = $filter('date')(new Date(item.AppointmentDate + " " + item.StartTime), "hh:mm a");
                    });
                }
            } else {
                alertify.error(Message);
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.switchTabinAppt = function (Mainitem, tabno) {
        Mainitem.Tab = tabno;
        if (Mainitem.Tab === 3) {
            $scope.GetUpcomingAppointments($scope.selectedPatientObj.PatientId);
        }
        if (Mainitem.Tab === 4) {
            $scope.GetRemindersHistory($scope.selectedPatientObj.PatientId);
        }

    }
    $scope.onSelectVisitReason = function (item, Mainitem) {


        item = item || "";
        if (item.ReasonId !== "") {
            $scope.selectedAppointmentObject.VisitReasonName = item.Reason;
            $scope.selectedAppointmentObject.VisitReasonId = item.ReasonId || 0;
            $scope.selectedAppointmentObject.VisitTypeId = item.VisitTypeId;


            $scope.selectedAppointmentObject.VisitReasonId = item.ReasonId;
            $scope.selectedAppointmentObject.VisitRemarks = item.Remarks || '';

            if (item.VisitTypeId !== undefined) {
                if ($scope.selectedAppointmentObject.AppointmentTypeId !== item.VisitTypeId.toString()) {
                    $scope.paymentTypeObj.AppointmentNote = "";
                    $scope.Showaddnotes = false;
                }
            }
            $scope.selectedAppointmentObject.AppointmentTypeId = item.VisitTypeId.toString();


            if ($scope.selectedAppointmentObject.AppointmentID !== 0) {
                if ($scope.Doctorcalendarobj == '') {
                    $scope.Doctorcalendarobj = {
                        "AppointmentTypeId": $scope.selectedAppointmentObject.AppointmentTypeId.toString()
                    }
                } else {
                    $scope.selectedAppointmentObject.AppointmentTypeId = $scope.selectedAppointmentObject.AppointmentTypeId.toString();
                }

            }


            if (item.VisitTypeId === 7 || item.VisitTypeId === 4 || item.VisitTypeId === 14 || item.VisitTypeId === 3) {
                var StatusId = '';
                if ($scope.selectedAppointmentObject.AppointmentTypeId == '4' || $scope.selectedAppointmentObject.AppointmentTypeId == '14') {
                    StatusId = 1;
                }
                if ($scope.selectedAppointmentObject.AppointmentTypeId == '7') {
                    StatusId = 2;
                }
               
                let req = {
                    "PatientId": $scope.selectedPatientObj.PatientId || 0,
                    "SpecializationId": $scope.SpecializationId,
                    "DoctorId": $scope.selectedAppointmentObject.DoctorID,
                    "OrganizationId": $scope.HospitalId,
                    "AppointmentTypeId": $scope.selectedAppointmentObject.AppointmentTypeId || null,
                    "StatusId": StatusId || ''
                };
                $scope.ApprovedSurgeryAppointments = [];
                $scope.SelectedApprovedParentAppt = "";  

                eHnoteDiagnosisDataServices.GetApprovedSurgeryAppointments(req).then(function (resp) {
                    if (resp.data !== undefined) {
                        if (resp.data.rows.length > 0) {
                            $scope.SelectedParentAppt = "";
                            $scope.ApprovedSurgeryAppointments = [];
                            angular.forEach(resp.data.rows, function (item) {
                                item.PreAdmissionStatusId = item.PreAdmissionStatusId || 0;
                                let obj = {
                                    //"OrganizationSurgeryId": item.OrganizationSurgeryId || 0,
                                    //"SurgeryName": item.SurgeryName || 0,
                                    "SurgeryListId": item.SurgeryListId || 0,
                                    "OrgSurgeryId": item.OrganizationSurgeryId,
                                    "SurgeryId": item.SurgeryId,
                                    "PatientSurgeryId": item.PatientSurgeryId,
                                    "AppointmentId": item.AppointmentId,
                                    "OrganizationSurgeryName": item.OrganizationSurgeryName,
                                    "OrganName": item.OrganName,
                                    "OrganId": item.OrganId || null,
                                    "DeleteInd": 'N',
                                    "IsChecked": false,
                                    "IsPreAdmissionApptBooked": item.IsPreAdmissionApptBooked,
                                    "IsASCApptBooked": item.IsASCApptBooked,
                                    "SurgerySuggestedDate": $filter('date')(item.SurgerySuggestedDate, "MM-dd-yyyy"),
                                    "AdditionalSurgery": item.AdditionalSurgery||[],
                                    //"CPTCode": item.CPTCode || ""
                                };
                              
                                if (item.StatusId === 3) {
                                    if (item.PreAdmissionStatusId == 2) {
                                        $scope.ApprovedSurgeryAppointments.push(obj);
                                    }
                                } else {
                                    $scope.ApprovedSurgeryAppointments.push(obj);
                                }
                            });

                            // to check only those surgeries related to appointment being rescheduled
                            AppointmentDetailsCache.SurgeryList = AppointmentDetailsCache.SurgeryList || [];
                            $scope.adviseObj.SeletedProcedureObj = '';
                            $scope.adviseObj.IsAdditionalSurgery = false;
                            //if (AppointmentDetailsCache.SurgeryList.length > 0) {
                            //    $scope.adviseObj.SeletedProcedureObj = AppointmentDetailsCache.SurgeryList[0];
                            //    $scope.adviseObj.SeletedProcedureObj.OrganizationSurgeryName = $scope.adviseObj.SeletedProcedureObj.SurgeryName || '';
                            //    /*$scope.SelectedNewSurgeries = [];*/

                            //    if ($scope.ApprovedSurgeryAppointments.length > 0) {
                            //        let filterProcedure = $filter("filter")($scope.ApprovedSurgeryAppointments, function (Aitem, index) { return Aitem.PatientSurgeryId == $scope.adviseObj.SeletedProcedureObj.PatientSurgeryId },);
                            //        if (filterProcedure.length > 0) {
                            //            let IsDisiableAdvisedSurgeryInd = false;
                            //            let IsDisiableButtonInd = false;
                            //            let TodayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                            //            let apptDate = angular.copy(AppointmentDetailsCache.AppointmentDate) || "";
                            //            if ( apptDate < TodayDate && $scope.selectedAppointmentObject.IsCheckedIn==2 ) {
                            //                IsDisiableAdvisedSurgeryInd = true;
                            //                 IsDisiableButtonInd = true;
                            //            }
                            //            let param = {
                            //                "SurgeryListId": filterProcedure[0].SurgeryListId || 0,
                            //                "OrgSurgeryId": filterProcedure[0].OrgSurgeryId,
                            //                "OrgDescriptionId": filterProcedure[0].OrgSurgeryId || 0,
                            //                "SurgeryId": filterProcedure[0].SurgeryId,
                            //                "PatientSurgeryId": filterProcedure[0].PatientSurgeryId || 0,
                            //                "DescriptionId": filterProcedure[0].SurgeryId || "",
                            //                "Description": filterProcedure[0].OrganizationSurgeryName || "",
                            //                "OrganId": filterProcedure[0].OrganId || null,
                            //                "Remarks": "",
                            //                "DeleteInd": "N",
                            //                "IsDisiableButtonInd": IsDisiableButtonInd,
                            //                "AdditionalSurgery": filterProcedure[0].AdditionalSurgery || [],
                            //                "IsDisiableAdvisedSurgeryInd": IsDisiableAdvisedSurgeryInd
                            //            }
                            //            $scope.SelectedNewSurgeries.push(param);
                            //        }
                            //    }

                            //} else {
                            //    $scope.AdditionalSurgery = [];
                            //    $scope.SelectedNewSurgeries = [];
                            //}
                            //let i = 0;                           
                            //if (AppointmentDetailsCache.SurgeryList.length > 0) {
                            //    angular.forEach($scope.ApprovedSurgeryAppointments, function (item) {
                            //        angular.forEach(AppointmentDetailsCache.SurgeryList, function (hitem) {
                            //            if (item.PatientSurgeryId === hitem.PatientSurgeryId) {
                            //                item.IsChecked = true;
                            //                i++;
                            //            }
                            //        });
                            //    });
                            //}
                            //if (i > 0) {
                            //    $scope.PreAdmSurgeryType = 'Selected';
                            //} else {
                            //    $scope.PreAdmSurgeryType = 'Select Surgery';
                            //}

                        } else {
                            if ($scope.ApprovedSurgeryAppointments.length == 0) {
                                /*alertify.error("This patient doesn't have any advised surgeries!");*/
                                $scope.IsSubmitDisabled = true;
                                return false;
                            }

                        }
                    } else {
                        $scope.IsSubmitDisabled = true;
                        return false;
                    }
                }, function (err) {
                    console.log(err);
                    alertify.error("Fetching Data Failed!");
                });

                // get previous preadmission appointments
                //if (item.VisitTypeId === 4) {

                //    $scope.PreviousPreAdmissionAppts = [];

                //    let req1 = {
                //        "PatientId": $scope.selectedPatientObj.PatientId || 0,
                //    };
                //    eHnoteDiagnosisDataServices.GetPreviousPreAdmissionApptsOfPatient(req1).then(function (resp) {
                //        if (resp.data.Status === "Success") {
                //            $scope.PreviousPreAdmissionAppts = angular.copy(resp.data.rows);
                //        }
                //    }, function (data) {

                //    });
                //}


            }






            if ($scope.Doctorcalendarobj != '') {
                if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar' && $scope.pagename == 'book') {
                    $scope.Doctorcalendarobj.Starttime = $scope.Doctorcalendarobj.Starttime || "";
                    if ($scope.Doctorcalendarobj.Starttime != "") {
                        $scope.selectedAppointmentObject.StartTime = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm');
                        $scope.selectedAppointmentObject.patinet_appStarttime = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm');
                    } else {
                        $scope.selectedAppointmentObject.StartTime = "";
                        $scope.selectedAppointmentObject.patinet_appStarttime = "";
                    }
                    $scope.selectedAppointmentObject.AppointmentDate = $filter('date')($scope.Doctorcalendarobj.GetDate, "yyyy-MM-dd");

                    $scope.selectedAppointmentObject.patient_appEndTime = $filter('date')(new Date($scope.Doctorcalendarobj.Endtime), 'HH:mm');

                    var AppointmentTypeId = parseInt($scope.Doctorcalendarobj.AppointmentTypeId);
                    if (AppointmentTypeId !== item.VisitTypeId && !$scope.selectedAppointmentObject.IsDoctorLeave) {
                        $scope.isAppValiddities.isEnableAlertType = true;
                        $scope.isAppValiddities.isValidOptionSelected = false;
                        $scope.isAppValiddities.UnblockSlots = false;
                    }
                }
            }

            if ($scope.selectedAppointmentObject.VisitReasonId == 0) {
                $scope.GetUserActiveDatesandSlotsInCalendar();
            } else {
                $scope.getUserBranchslots($scope.selectedAppointmentObject.DoctorID);
                // $scope.loadCalendar();

                //if ($scope.Doctorcalendarobj.IsComingFrom === 'Doctorcalendar') {
                //    $scope.getUserBranchslots($scope.selectedAppointmentObject.DoctorID);
                //} else {
                //    $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                //}

                //var t = new Date($scope.selectedAppointmentObject.AppointmentDate + ' ' + "00:00:00");
                let check1 = typeof $scope.selectedAppointmentObject.AppointmentDate;
                if (check1 !== "string") {
                    var t = $scope.selectedAppointmentObject.AppointmentDate;
                    var startDate = t;
                    var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);
                } else {
                    var t = new Date($scope.selectedAppointmentObject.AppointmentDate + ' ' + "00:00:00");
                    var startDate = t;
                    var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);
                }

                $scope.GetActiveDates(startDate, endDate);
            }

        }
        $scope.selectedAppointmentObject.searchvisitreasontxt = "";
        $scope.AppointmentRescheduleObj.StartTime = "";
    };
    $scope.reloadCalendarStartTime = function () {

        if ($scope.RoleId == 16) {
            if ($scope.connectedUserObj.Available) {
                if ($scope.connectedUserObj.Users.length > 0) {
                    var filter1 = $filter("filter")($scope.connectedUserObj.Users, function (Nitem) {
                        return Nitem.ChildUserId === $scope.selectedAppointmentObject.DoctorID;
                    }) || [];

                    if (filter1.length == 0) {
                        alertify.error("You don't have access to unblock");
                        return false;
                    }
                }
            }
        }

        var pageName = $location.url();


        if (pageName === '/op' || pageName === '/OT') {
            if ($scope.UserAccessRights.AllAccessRights.OPUnblockSlotAccess) {
                $scope.isAppValiddities.isValidOptionSelected = true;
                $scope.isAppValiddities.IsfocusinNotes = true;
                $scope.isAppValiddities.isEnableAlertType = false;
                $scope.isAppValiddities.IsEnabledAfterCheckHere = true;
                $scope.selectedAppointmentObject.NotesTab = 1;
            } else {
                alertify.error("You don't have access,please contact your administrator");
                return false;
            }

        }

        if (pageName === '/crm') {
            if ($scope.UserAccessRights.AllAccessRights.CRMUnblockSlotAccess) {
                $scope.isAppValiddities.isValidOptionSelected = true;
                $scope.isAppValiddities.IsfocusinNotes = true;
                $scope.isAppValiddities.isEnableAlertType = false;
                $scope.isAppValiddities.IsEnabledAfterCheckHere = true;
                $scope.selectedAppointmentObject.NotesTab = 1;
            } else {
                alertify.error("You don't have access,please contact your administrator");
                return false;
            }

        }
        console.log(pageName + "__" + $scope.PreviousUrl);

        if (pageName === '/profile') {
            if ($scope.PreviousUrl === '/crm') {
                if ($scope.UserAccessRights.AllAccessRights.CRMUnblockSlotAccess) {
                    $scope.isAppValiddities.isValidOptionSelected = true;
                    $scope.isAppValiddities.IsfocusinNotes = true;
                    $scope.isAppValiddities.isEnableAlertType = false;
                    $scope.isAppValiddities.IsEnabledAfterCheckHere = true;
                    $scope.selectedAppointmentObject.NotesTab = 1;
                } else {
                    alertify.error("You don't have access,please contact your administrator");
                    return false;
                }
            } else {
                if ($scope.UserAccessRights.AllAccessRights.OPUnblockSlotAccess) {
                    $scope.isAppValiddities.isValidOptionSelected = true;
                    $scope.isAppValiddities.IsfocusinNotes = true;
                    $scope.isAppValiddities.isEnableAlertType = false;
                    $scope.isAppValiddities.IsEnabledAfterCheckHere = true;
                    $scope.selectedAppointmentObject.NotesTab = 1;
                } else {
                    alertify.error("You don't have access,please contact your administrator");
                    return false;
                }
            }
        }
    }
    $scope.reloadCalendarTimeSlots = function (Mainitem) {
        $scope.isAppValiddities.isEnableAlertType = false;
        $scope.isAppValiddities.isValidOptionSelected = true;
        $scope.isAppValiddities.UnblockSlots = false;

        Mainitem.patinet_appStarttime = "";
        $scope.selectedAppointmentObject.StartTime = "";
    }

    $scope.unblockMaximumNoOfSlotstime = function () {

        if ($scope.RoleId == 16) {
            if ($scope.connectedUserObj.Available) {
                if ($scope.connectedUserObj.Users.length > 0) {
                    var filter1 = $filter("filter")($scope.connectedUserObj.Users, function (Nitem) {
                        return Nitem.ChildUserId === $scope.selectedAppointmentObject.DoctorID;
                    }) || [];

                    if (filter1.length == 0) {
                        alertify.error("You don't have access to unblock");
                        return false;
                    }
                }
            }
        }

        var pageName = $location.url();
        console.log(pageName);

        if (pageName === '/op') {
            if ($scope.UserAccessRights.AllAccessRights.OPUnblockSlotAccess) {
                $scope.isAppValiddities.MaxApptError = false;
                $scope.isAppValiddities.MaxApptUnblock = true;
                $scope.isAppValiddities.IsfocusinNotes = true;
                $scope.isAppValiddities.MaxApptErrorMsgShow = true;
                $scope.isAppValiddities.isValidOptionSelected = true;
            } else {
                alertify.error("You don't have access,please contact your administrator");
                return false;
            }

        }

        if (pageName === '/crm') {
            if ($scope.UserAccessRights.AllAccessRights.CRMUnblockSlotAccess) {
                $scope.isAppValiddities.MaxApptError = false;
                $scope.isAppValiddities.MaxApptUnblock = true;
                $scope.isAppValiddities.IsfocusinNotes = true;
                $scope.isAppValiddities.MaxApptErrorMsgShow = true;
                $scope.isAppValiddities.isValidOptionSelected = true;
            } else {
                alertify.error("You don't have access,please contact your administrator");
                return false;
            }

        }
        if (pageName === '/profile') {
            if ($scope.PreviousUrl === '/op') {
                if ($scope.UserAccessRights.AllAccessRights.OPUnblockSlotAccess) {
                    $scope.isAppValiddities.MaxApptError = false;
                    $scope.isAppValiddities.MaxApptUnblock = true;
                    $scope.isAppValiddities.IsfocusinNotes = true;
                    $scope.isAppValiddities.MaxApptErrorMsgShow = true;
                    $scope.isAppValiddities.isValidOptionSelected = true;
                } else {
                    alertify.error("You don't have access,please contact your administrator");
                    return false;
                }

            }

            if ($scope.PreviousUrl === '/crm') {
                if ($scope.UserAccessRights.AllAccessRights.CRMUnblockSlotAccess) {
                    $scope.isAppValiddities.MaxApptError = false;
                    $scope.isAppValiddities.MaxApptUnblock = true;
                    $scope.isAppValiddities.IsfocusinNotes = true;
                    $scope.isAppValiddities.MaxApptErrorMsgShow = true;
                    $scope.isAppValiddities.isValidOptionSelected = true;
                } else {
                    alertify.error("You don't have access,please contact your administrator");
                    return false;
                }

            }
        }

        $scope.isAppValiddities.MaxApptError = false;
        $scope.isAppValiddities.MaxApptUnblock = true;
        $scope.isAppValiddities.IsfocusinNotes = true;
        $scope.isAppValiddities.MaxApptErrorMsgShow = true;

    };

    $scope.AddupdateAppointment = function (Mainitem, Subtype) {
        $scope.Subtype = Subtype;


        Mainitem.BookingTypeId = Mainitem.BookingTypeId || null;

        if (Mainitem.BookingTypeId === null) {
            Mainitem.BookingTypeId = 3;
        }
        if ($scope.currentUrl == 'CRMReasonType') {
            if ($scope.selectedAppointmentObject.ReasonTypeId == null) {
                alertify.error("Please Select a ReasonType");
                return false;
            }
        }
        if (Mainitem.IsDoctorLeave) {
            alertify.error("Doctor is on leave!");
            return;
        }

        Mainitem.patinet_appStarttime = Mainitem.patinet_appStarttime || "";
        Mainitem.DoctorID = Mainitem.DoctorID || "";
        if (Mainitem.DoctorID === "") {
            alertify.error("Please Select a Doctor");
            return false;
        }
        Mainitem.VisitReasonName = Mainitem.VisitReasonName || "";
        Mainitem.AppointmentTypeId = Mainitem.AppointmentTypeId || "";
        Mainitem.VisitReasonId = Mainitem.VisitReasonId || 0;
        if (Mainitem.VisitReasonId == 0) {
            alertify.error("Please Enter Visit Reason");
            return false;
        }

        if (!Mainitem.IsWaitingListAppointment) {
            if (Mainitem.patinet_appStarttime === "") {
                alertify.error(" Please Select Proper Start Time");
                return false;
            } else {
                //Mainitem.AppointmentDate = $filter('date')(Mainitem.AppointmentDate, "yyyy-MM-dd");
                //let apptstartdate = Mainitem.AppointmentDate + " " + Mainitem.patinet_appStarttime;
                //let apptdate = new Date(apptstartdate);
                //apptdate.setMinutes(apptdate.getMinutes() + parseInt($scope.ApptDurationObj.patinet_consultationTime));

                //Mainitem.patient_appEndTime = $filter('date')(apptdate, "HH:mm");

                Mainitem.AppointmentDate = moment(Mainitem.AppointmentDate).format("YYYY-MM-DD");
                let apptstartdate = Mainitem.AppointmentDate + " " + Mainitem.patinet_appStarttime;
                let apptdate = moment(apptstartdate, "YYYY-MM-DD HH:mm");
                apptdate.add(parseInt($scope.ApptDurationObj.patinet_consultationTime), 'minutes');
                Mainitem.patient_appEndTime = apptdate.format("HH:mm");
            }
        }


        if ($scope.IsMaxSlotsAppointmentRestrictionForDoctorInd == true) {
            var apptTypeId = parseInt(Mainitem.AppointmentTypeId);
            if (apptTypeId == 1) {
                alertify.error("Maximum New Appointments Reached for is Doctor. Please choose another doctor");
                return false;
            } else if (apptTypeId == 2) {
                alertify.error("Maximum Clinic followup appointments are reached for this doctor. Please choose another doctor");
                return false;
            } else if (apptTypeId == 3) {
                alertify.error("Maximum  Post-Op followup appointments are reached for this doctor. Please choose another doctor");
                return false;
            }
            else if (apptTypeId == 4 || apptTypeId == 14) {
                alertify.error("Maximum ASC appointments are reached for this doctor. Please choose another doctor");
                return false;
            }
        }

        if (!$scope.isAppValiddities.isValidOptionSelected) {
            alertify.error("Please Unblock or Choose Another Available Slot to continue");
            return false;
        }

        if (Mainitem.SelectedNotesobj.AppointmentNote !== '') {
            var obj = {
                "AppointmentNoteId": 0,
                "Notes": Mainitem.SelectedNotesobj.AppointmentNote || "",
                "DeleteInd": "N",
                "CreatedBy": userLoginDetails.displayName || "",
                "UserId": eHnoteMasterDataService.getLoginId() || "",
                "CreatedDt": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a')
            }
            Mainitem.AppointmentNotesList.push(obj);
        }
        if ($scope.isAppValiddities.UnblockSlots) {
            if (Mainitem.AppointmentNotesList.length == 0 && Mainitem.SelectedNotesobj.AppointmentNote == '') {
                alertify.error("Please Enter Notes");
                return false;
            }
        }

        if ($scope.isAppValiddities.MaxApptError) {
            if (!$scope.isAppValiddities.MaxApptUnblock) {
                alertify.error("Please Unblock Slot to continue");
                return false;
            } else if ($scope.isAppValiddities.MaxApptErrorMsgShow) {
                if (Mainitem.AppointmentNotesList.length == 0 && Mainitem.SelectedNotesobj.AppointmentNote == '') {
                    alertify.error("Please Enter Notes to continue");
                    return false;
                }
            }
        }
        var patient_id = $scope.selectedPatientObj.PatientId;
        //let AppointmentDate = $scope.selectedAppointmentObject.AppointmentDate;
        //AppointmentDate = moment(AppointmentDate).format("YYYY-MM-DD");
        var object = {
            "PatientId": patient_id,
            "AppointmentDate": $scope.selectedAppointmentObject.AppointmentDate,
            "AppointmentID": $scope.selectedAppointmentObject.AppointmentID||null,
            "HospitalId": $scope.HospitalId,
            "DoctorId": Mainitem.DoctorID,
            "VisitTypeId": parseInt(Mainitem.AppointmentTypeId),
        };
        eHnotePatientDataService.CheckAppointmentStatus(object).then(function (resp) {
            if (resp.data.Status) {
                if ($scope.selectedAppointmentObject.AppointmentID === resp.data.AppointmentID) {
                    continuetonewbookAppointment(Mainitem, Subtype);

                } else {
                    alertify.error("This patient has an existing appointment scheduled for the same date");
                    return false;
                }
            }
            else {
                continuetonewbookAppointment(Mainitem, Subtype);
            }

        }, function (err) {
            console.log(err);
        });
    }

    function continuetonewbookAppointment(Mainitem, Subtype) {

        $scope.selectedDeptObj = {
            "SubSpecializationId": 1,
            "BranchSubSpecializationId": 1
        };
        if (Mainitem.DocObj.DoctorID !== "") {
            if ($scope.clinicDoctorList.length > 0) {
                angular.forEach($scope.clinicDoctorList, function (kitem) {
                    if (kitem.DoctorID === Mainitem.DocObj.DoctorID) {
                        if (kitem.UserSubSpecialization.length > 0) {
                            angular.forEach(kitem.UserSubSpecialization, function (mitem) {
                                if (mitem.IsPrimarySubSpecialization === true) {
                                    $scope.selectedDeptObj.SubSpecializationId = mitem.SubSpecializationId;
                                    $scope.selectedDeptObj.BranchSubSpecializationId = mitem.BranchSubSpecializationId;
                                }
                            });
                        }
                    }
                });
            }
        }
        Mainitem.AppointmentNotesList = Mainitem.AppointmentNotesList || [];
        if (Mainitem.AppointmentNotesList.length == 0) {
            if (Mainitem.SelectedNotesobj.AppointmentNote != '') {
                var obj = {
                    "AppointmentNoteId": 0,
                    "Notes": Mainitem.SelectedNotesobj.AppointmentNote || "",
                    "DeleteInd": "N",
                }
                Mainitem.AppointmentNotesList.push(obj);
            }
        }

        if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj != "") {
            var bitem = {};
            bitem = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj;
            var objectins = {
                "PatientAppointmentInsuranceDetailId": bitem.PatientAppointmentInsuranceDetailId||0,
                "PatientInsuranceDetailId": bitem.PatientInsuranceDetailId,
                "PayorId": bitem.PayorId,
                "OrganizationPayorId": bitem.OrganizationPayorId,
                "PlanId": bitem.PlanId,
                "CoverageId": bitem.CoverageId,
                "IdentifierId": bitem.IdentifierId || 1,
                "PayorName": bitem.PayorName,
                "StatusId": bitem.StatusId,
                "DeleteInd": "N"
            }
            if ($scope.paymentTypeObj.PatientInsuranceList.length > 0) {
                var filter1 = $filter("filter")($scope.paymentTypeObj.PatientInsuranceList, function (Nitem) {
                    return Nitem.PatientInsuranceDetailId === objectins.PatientInsuranceDetailId;
                }) || [];
                if (filter1.length == 0) {
                    angular.forEach($scope.paymentTypeObj.PatientInsuranceList, function (item) {
                        item.DeleteInd = "Y";
                    });
                    $scope.paymentTypeObj.PatientInsuranceList.push(objectins);
                }
            } else {
                $scope.paymentTypeObj.PatientInsuranceList.push(objectins);
            }
        }
        if ($scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj != "") {
            var bitem = {};
            bitem = $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj;
            var objectins = {
                "PatientAppointmentInsuranceDetailId": bitem.PatientAppointmentInsuranceDetailId || 0,
                "PatientInsuranceDetailId": bitem.PatientInsuranceDetailId,
                "PayorId": bitem.PayorId,
                "PlanId": bitem.PlanId,
                "CoverageId": bitem.CoverageId,
                "IdentifierId": bitem.IdentifierId || 2,
                "PayorName": bitem.PayorName,
                "StatusId": bitem.StatusId,
                "DeleteInd": "N"
            }
            $scope.paymentTypeObj.PatientInsuranceList.push(objectins);
        }


        //var patient_appDate = $filter("date")(Mainitem.AppointmentDate, "yyyy-MM-dd");
        var patient_Date = $filter("date")(Mainitem.AppointmentDate, "yyyy-MM-dd");
        var patient_appDate = $filter("date")(new Date(patient_Date + ' ' + "00:00:00"), "yyyy-MM-dd");

        var todaydate = $filter('date')(new Date(), "yyyy-MM-dd");
        if (patient_appDate > todaydate) {
            console.log("future appointment");
            $scope.IsCheckIn = 1;
        } else {
            console.log("Current date appointment");
            if ($scope.pagename === 'book') {
                if (Mainitem.BookingTypeId == 1) {
                    // $scope.IsCheckIn = 2;
                } else if (Mainitem.BookingTypeId == 3) {
                    $scope.IsCheckIn = 1;
                }
            } else {
                if ($scope.selectedAppointmentObject.IsCheckedIn == 2) {
                    $scope.IsCheckIn = $scope.selectedAppointmentObject.IsCheckedIn;
                } else if ($scope.selectedAppointmentObject.IsCheckedIn == 3) {
                    //  $scope.IsCheckIn = 2;
                } else {
                    $scope.IsCheckIn = 1;
                }
                //$scope.IsCheckIn = $scope.selectedAppointmentObject.IsCheckedIn == 2 ? $scope.selectedAppointmentObject.IsCheckedIn : 1;
            }
        }

        var appointmenttypename = "";
        if ($scope.appointmentTypes.length > 0) {
            var appointmentTypeId = Mainitem.AppointmentTypeId.toString();
            var ApptName = $filter("filter")($scope.appointmentTypes, function (item, index) { return item.AppointmentTypeId === appointmentTypeId }, true);
            if (ApptName.length > 0) {
                var appointmenttypename = ApptName[0].AppointmentTypeName;
            }
        }

        var daycd = $filter("date")(new Date(Mainitem.AppointmentDate), "EEE").toUpperCase();
        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");

        if ($scope.SelectedNewSurgeries.length>0) {
            $scope.SurgeryList = $filter("filter")($scope.SelectedNewSurgeries, function (item, index) { return item.PatientSurgeryId !=0 }, true)|| [];
            $scope.newSurgeryList = $filter("filter")($scope.SelectedNewSurgeries, function (item, index) { return item.PatientSurgeryId ==0 }, true)|| [];
        }


        //$scope.SurgeryList = $filter('filter')($scope.ApprovedSurgeryAppointments, { 'IsChecked': true }, true) || [];

        //let tempsurgerylist = $filter('filter')($scope.ApprovedSurgeryAppointments, { 'IsChecked': true }, true) || [];

        //if (tempsurgerylist.length > 0) {
        //    angular.forEach(AppointmentDetailsCache.SurgeryList, function (surgery) {
        //        let matched = false;
        //        angular.forEach(tempsurgerylist, function (item) {
        //            if (surgery.PatientSurgeryId === item.PatientSurgeryId) {
        //                item.IsChecked = true;
        //                item.DeleteInd = "N";
        //                matched = true;
        //            }
        //        });
        //        if (!matched) {
        //            surgery.DeleteInd = "Y";
        //            tempsurgerylist.push(surgery);
        //        }

        //        $scope.SurgeryList = tempsurgerylist || [];
        //    });
        //}


        //AppointmentDetailsCache.SurgeryList = AppointmentDetailsCache.SurgeryList || [];
        //if ($scope.SurgeryList.length === 0) {
        //    if (AppointmentDetailsCache.SurgeryList.length > 0) {
        //        angular.forEach(AppointmentDetailsCache.SurgeryList, function (item) {
        //            let SurgeryArrayList = $filter('filter')($scope.ApprovedSurgeryAppointments, { 'PatientSurgeryId': item.PatientSurgeryId }, true) || [];
        //            if (SurgeryArrayList.length > 0) {
        //                if (!SurgeryArrayList[0].IsChecked) {
        //                    SurgeryArrayList[0].DeleteInd = "Y";
        //                    $scope.SurgeryList.push(SurgeryArrayList[0]);
        //                } else {
        //                    SurgeryArrayList[0].DeleteInd = "N";
        //                    $scope.SurgeryList.push(SurgeryArrayList[0]);
        //                }
        //            }
        //            if ($scope.SurgeryList.length === 1) {
        //                let CheckSurgeryList = $filter('filter')($scope.SurgeryList, { 'DeleteInd': "Y" }, true) || [];
        //                if (CheckSurgeryList.length > 0) {
        //                    $scope.SurgeryList = [];
        //                }
        //            }
        //        });
        //    }
        //}

        $scope.SurgeryList = $scope.SurgeryList || [];
        $scope.newSurgeryList = $scope.newSurgeryList || [];
        if (Mainitem.VisitTypeId === 7 || Mainitem.VisitTypeId === 4 || Mainitem.VisitTypeId === 14 ) {
            if ($scope.SurgeryList.length === 0 && $scope.newSurgeryList.length === 0) {
                alertify.error('Please Select Surgery');
                return false;
            }
        }

       
        if (Mainitem.VisitTypeId === 7 || Mainitem.VisitTypeId === 4 || Mainitem.VisitTypeId === 14 ) {
            let Organcounter = 0;
            if ($scope.newSurgeryList.length > 0) {
                angular.forEach($scope.newSurgeryList, function (item) {
                    item.OrganId = item.OrganId || null;
                    if (item.OrganId ==null) {
                        Organcounter++;
                    }
                });
            }
            if ($scope.SurgeryList.length > 0) {
                angular.forEach($scope.SurgeryList, function (item) {
                    item.OrganId = item.OrganId || null;
                    if (item.OrganId ==null) {
                        Organcounter++;
                    }
                });
            }
      

            if (Organcounter > 0) {
                alertify.error("Please Select Organ!");
                return;
            }
        }
      
        var VisitRsnType = Mainitem.AppointmentTypeId;

        ////Added By durga on 12-05-2023
        //if (Mainitem.IsWaitingListAppointment) {
        //    Mainitem.ConfirmationStatusId = 3;
        //} else if (Mainitem.IsAppointmentConfirmed) {
        //    Mainitem.ConfirmationStatusId = 1;
        //} else if (Mainitem.AppointmentStatus === "C") {
        //    Mainitem.ConfirmationStatusId = 2;
        //} else {
        //    Mainitem.ConfirmationStatusId = 2;
        //    $scope.selectedAppointmentObject.IsNoShowAppointment = $scope.selectedAppointmentObject.IsNoShowAppointment || false;
        //}
        //Added By durga on 12-05-2023


        if (Mainitem.IsWalkInSlot) {
            Mainitem.BookingTypeId = 1;
            Mainitem.SourceTypeId = 1;
        }
        else if (Mainitem.IsWaitingListAppointment) {
            Mainitem.BookingTypeId = 2;
        } else {
            Mainitem.BookingTypeId = 3;
        }

        if (Mainitem.IsAppointmentConfirmed) {
            Mainitem.BookingStatusId = 1;
        }
        else {
            Mainitem.BookingStatusId = 2;
        }






        if (Mainitem.IsWaitingListAppointment) {
            Mainitem.patinet_appStarttime = "21:00"
            Mainitem.AppointmentDate = $filter('date')(Mainitem.AppointmentDate, "yyyy-MM-dd");
            let apptstartdate = Mainitem.AppointmentDate + " " + Mainitem.patinet_appStarttime;
            let apptdate = new Date(apptstartdate);
            apptdate.setMinutes(apptdate.getMinutes() + parseInt($scope.ApptDurationObj.patinet_consultationTime));

            Mainitem.patient_appEndTime = $filter('date')(apptdate, "HH:mm");
        }
        Mainitem.ConsultationDt = $filter('date')(Mainitem.ConsultationDt, "yyyy-MM-dd")||"";
        console.log($scope.rescheduleobj.IsReschedule);

        if ($scope.rescheduleobj.IsReschedule) {
            Mainitem.RescheduledAppointmentId = $scope.selectedAppointmentObject.AppointmentID;
            Mainitem.RescheduledAppointmentDate = patient_appDate;
            Mainitem.RescheduledAppointmentStartTime = Mainitem.patinet_appStarttime;
            Mainitem.RescheduledAppointmentEndTime = Mainitem.patient_appEndTime;
            Mainitem.RescheduledDoctorId = parseInt(Mainitem.DocObj.DoctorID);
            Mainitem.RescheduledAppointmentTypeId = parseInt(VisitRsnType);
            Mainitem.RescheduledVisitReasonId = $scope.selectedAppointmentObject.VisitReasonId;
            Mainitem.AppointmentStatus = "R";
            // Mainitem.AppointmentStatusId = 8;
            $scope.selectedAppointmentObject.AppointmentID = 0;

            if (AppointmentDetailsCache.IsComingFrom == 'NoShow') {
                //Mainitem.AppointmentStatus = "N";
                Mainitem.AppointmentStatusId = 11;
            } else {
                var CurrentDate = $filter("date")(new Date(), "yyyy-MM-dd");
                if (Mainitem.ConsultationDt === CurrentDate) {
                    if (Mainitem.AppointmentStatusId == 1) {
                        Mainitem.AppointmentStatusId = 9;   //last min Reschedule
                    } else if (Mainitem.AppointmentStatusId == 2) {
                        Mainitem.AppointmentStatusId = 10; //Check-In Reschedule
                    }
                } else {
                    Mainitem.AppointmentStatusId = 8;  //planed Reschedule
                }
            }




            Mainitem.AppointmentNotesList = Mainitem.AppointmentNotesList || [];
            var noteTxt = "";

            var capptdate = $filter("date")(AppointmentDetailsCache.AppointmentDate, "MM-dd-yyyy");
            // Extract hours and minutes from StartTime string
            var timeParts = AppointmentDetailsCache.StartTime.split(":");
            var hours = parseInt(timeParts[0]);
            var minutes = parseInt(timeParts[1]);

            // Convert hours to 12-hour format and add AM/PM
            var amPm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours || 12; // Convert 0 to 12

            // Format the time in 12-hour format with AM/PM
            var capptTIME = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + amPm;

            //$scope.RescheduleIsNoShowAppointment = $scope.RescheduleIsNoShowAppointment || false;
            console.log(capptdate);
            console.log(capptTIME);
            if (Mainitem.AppointmentStatusId == 11) {
                noteTxt = "This appointment is rescheduled from appointment (No show) " + capptdate + " : " + capptTIME;
            } else {
                noteTxt = "This appointment is rescheduled appointment from " + capptdate + " : " + capptTIME;

            }

            console.log(noteTxt);

            var obj = {
                "AppointmentNoteId": 0,
                "Notes": noteTxt || "",
                "DeleteInd": "N",
            }
            Mainitem.AppointmentNotesList.push(obj);
        } else {
            Mainitem.AppointmentStatus = "B"
            //  Mainitem.AppointmentStatusId = 1;
            if (Mainitem.AppointmentStatusId == 6) {
                Mainitem.AppointmentStatusId = 2;
            }
            else if (Mainitem.AppointmentStatusId == 7 || Mainitem.AppointmentStatusId == 5) {
                Mainitem.AppointmentStatusId = 1;
            } else {

            }
        }
        //if (Mainitem.AppointmentStatus === "C") {
        //    Mainitem.AppointmentStatusId = 5;
        //}

        AppointmentDetailsCache.StartTime = AppointmentDetailsCache.StartTime || null;
        Mainitem.patinet_appStarttime = Mainitem.patinet_appStarttime || null;

        if (AppointmentDetailsCache.StartTime != null && Mainitem.patinet_appStarttime != null && !$scope.rescheduleobj.IsReschedule) {

            var tresult = compareTime(AppointmentDetailsCache.StartTime, Mainitem.patinet_appStarttime);
            console.log(tresult)
            if (!tresult) {

                var timeParts = AppointmentDetailsCache.StartTime.split(":");
                var hours = parseInt(timeParts[0]);
                var minutes = parseInt(timeParts[1]);

                var amPm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours || 12;

                var capptTIME = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + amPm;

                console.log(capptTIME);

                var appttimeParts = Mainitem.patinet_appStarttime.split(":");
                var hours = parseInt(appttimeParts[0]);
                var minutes = parseInt(appttimeParts[1]);

                var amPm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours || 12;

                var apptStartTIME = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + amPm;

                console.log(apptStartTIME);
                noteTxt = "This appointment is updated from " + capptTIME + " to " + apptStartTIME;

                console.log(noteTxt);

                var obj = {
                    "AppointmentNoteId": 0,
                    "Notes": noteTxt || "",
                    "DeleteInd": "N",
                }

                Mainitem.AppointmentNotesList.push(obj);
            }
        }
        //if ($scope.selectedAppointmentObject.Routeslipnotes != "") {
        //    $scope.selectedAppointmentObject.OtherNotes = $scope.selectedAppointmentObject.Routeslipnotes || "";
        //}
        //if ($scope.selectedPatientObj.IsConnectToFutureAppointment) {
        //    $scope.paymentTypeObj.PatientInsuranceList = [];
        //} else {
        //    $scope.paymentTypeObj.PatientInsuranceList = $scope.paymentTypeObj.PatientInsuranceList || [];
        //}
        if ($scope.paymentTypeObj.IsPaymentTypeInd==true) {
            $scope.selectedPatientObj.IsConnectToFutureAppointment = false;
            $scope.paymentTypeObj.PatientInsuranceList = $filter('filter')($scope.paymentTypeObj.PatientInsuranceList, function (item) {
                return item.PatientAppointmentInsuranceDetailId != 0;
            });
            if ($scope.paymentTypeObj.PatientInsuranceList.length > 0) {
                angular.forEach($scope.paymentTypeObj.PatientInsuranceList, function (item) {
                    item.DeleteInd = 'Y';
                });
            }
        } else {
            $scope.selectedPatientObj.IsConnectToFutureAppointment = $scope.selectedPatientObj.IsConnectToFutureAppointment || false;
            $scope.paymentTypeObj.PatientInsuranceList = $scope.paymentTypeObj.PatientInsuranceList || [];
        }
        $scope.selectedAppointmentObject.OtherProviderDoctorName = $scope.selectedAppointmentObject.OtherProviderDoctorName || '';
        $scope.selectedAppointmentObject.OtherProviderVisitReason = $scope.selectedAppointmentObject.OtherProviderVisitReason || ''
        

        //if ($scope.selectedAppointmentObject.OtherProviderDoctorName != '') {
        //    let capptdate = $filter("date")(patient_appDate, "MM-dd-yyyy");
        //    let noteTxt = "This Appointment Is Referral Appointment From " + $scope.selectedAppointmentObject.OtherProviderDoctorName + " On " + capptdate ||'' ;
        //    var obj = {
        //        "AppointmentNoteId": 0,
        //        "Notes": noteTxt || "",
        //        "DeleteInd": "N",
        //    }

        //    Mainitem.AppointmentNotesList.push(obj);
        //}
        AppointmentDetailsCache = AppointmentDetailsCache || ''
        if (AppointmentDetailsCache != '' && AppointmentDetailsCache.IsComingFrom == 'AppointmentRequest') {
            AppointmentDetailsCache.ReasonTypeId = AppointmentDetailsCache.ReasonTypeId || null;
            AppointmentDetailsCache.ReasonTypeName = AppointmentDetailsCache.ReasonTypeName || null;
            $scope.selectedAppointmentObject.ReasonTypeId = AppointmentDetailsCache.ReasonTypeId || null;
            $scope.selectedAppointmentObject.ReasonTypeName = AppointmentDetailsCache.ReasonTypeName || null;
        }
        if ($scope.selectedAppointmentObject.IsReferralDoctornotes&&$scope.selectedAppointmentObject.OtherProviderDoctorName != '') {
            var OtherProviderVisitReason = '';
            if ($scope.selectedAppointmentObject.OtherProviderVisitReason != '') {
                OtherProviderVisitReason = $scope.selectedAppointmentObject.OtherProviderVisitReason || '';
            }
            if ($scope.selectedAppointmentObject.IsReferral) {
                let capptdate = $filter("date")($scope.selectedAppointmentObject.OtherProviderVisitDate, "MM-dd-yyyy")||'';
                let noteTxt = "This Is A Referral Appointment With " + $scope.selectedAppointmentObject.OtherProviderDoctorName + " On " + capptdate + ' For ' + OtherProviderVisitReason|| '';
                    var obj = {
                        "AppointmentNoteId": 0,
                        "Notes": noteTxt || "",
                        "DeleteInd": "N",
                        "CreatedBy": userLoginDetails.displayName || "",
                        "UserId": eHnoteMasterDataService.getLoginId() || "",
                        "CreatedDt": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a')
                    }

                    Mainitem.AppointmentNotesList.push(obj);
            } else {
                let capptdate = $filter("date")($scope.selectedAppointmentObject.OtherProviderVisitDate, "MM-dd-yyyy") || '';
                let noteTxt = "This Appointment Is Previously Booked With " + $scope.selectedAppointmentObject.OtherProviderDoctorName + " On " + capptdate + ' For ' + OtherProviderVisitReason || '';
                    var obj = {
                        "AppointmentNoteId": 0,
                        "Notes": noteTxt || "",
                        "DeleteInd": "N",
                        "CreatedBy": userLoginDetails.displayName || "",
                        "UserId": eHnoteMasterDataService.getLoginId() || "",
                        "CreatedDt": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a')
                    }

                    Mainitem.AppointmentNotesList.push(obj);
            }

        }
        var PreviousAppointmentTime = '';
        if ($scope.dateVal != undefined) {
            PreviousAppointmentTime = moment($scope.dateVal, "DD-MMM-YYYY HH:mm").format("HH:mm");
        }
        // language selection 
        $scope.selectedPatientObj.SmsLanguageId = 152;
        if ($scope.selectedAppointmentObject.IsSmsLanguageIdInd == true) {
            $scope.selectedPatientObj.SmsLanguageId = 45; // english
        } else {
            $scope.selectedPatientObj.SmsLanguageId = 152; // spanish
        }
        var Appparams = {
            "PatientID": $scope.selectedPatientObj.PatientId,
            "PatientName": $scope.selectedPatientObj.FullName || ($scope.selectedPatientObj.FirstName + ' ' + $scope.selectedPatientObj.LastName),
            "PatientMobile": parseInt($scope.selectedPatientObj.PatientMobile),
            "PatientGender": $scope.selectedPatientObj.PatientGender,
            "PatientDOB": $scope.selectedPatientObj.DOB,
            "BloodGroup": $scope.selectedPatientObj.BloodGroup,
            "PatientAge": $scope.selectedPatientObj.PatientAge,
            "AppointmentID": $scope.selectedAppointmentObject.AppointmentID ? $scope.selectedAppointmentObject.AppointmentID : 0,
            "ParentAppointmentId": 0,
            "RootAppointmentId": null,
            "OrganId": null,
            "NurseId": null,
            "AnesthesistId": null,
            "AppointmentStatus": Mainitem.AppointmentStatus,
            "CurrentTime": $scope.CurrentTime,
            "StartTime": Mainitem.patinet_appStarttime,
            "EndTime": Mainitem.patient_appEndTime,
            "DoctorID": parseInt(Mainitem.DocObj.DoctorID),
            "RoomId": null,
            "RoomTypeId": null,
            "AssignedUserId": null,
            "AdmissionId": null,
            "DayCD": daycd,
            "VisitUserTypeID": '',
            "OrganizationSurgeryId": null,
            "PatientInsuranceList": $scope.paymentTypeObj.PatientInsuranceList || [],
            "AppointmentNotes": Mainitem.AppointmentNotesList || [],
            "OtherVisitRsn": Mainitem.VisitReasonName,
            "VisitRemarks": Mainitem.VisitRemarks,
            "IsConfirmedAppointment": Mainitem.IsAppointmentConfirmed || false,
            "IsWaitingListAppointment": Mainitem.IsWaitingListAppointment || false,
            "IsNoShowAppointment": Mainitem.IsNoShowAppointment || false,
            "ConsultationDt": patient_appDate,
            "UserBranchId": Mainitem.DocObj.UserBranchId,
            "UserId": doctorinfo.doctorid,
            "USRType": "DOCTOR",
            "DoctorVisitRsnID": parseInt(VisitRsnType),
            "AppointmentPatientTypeId": parseInt($scope.AppointmentPatientTypeId) || 1,
            "ISFastTrackAppointment": false,
            "IsTeleMedicineSlot": false,
            "SubSpecializationId": $scope.selectedDeptObj.SubSpecializationId,
            "BranchSubSpecializationId": $scope.selectedDeptObj.BranchSubSpecializationId,
            "HospitalDetails": {
                "HospitalID": parseInt($scope.HospitalId),
                "LoginHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,//For sms Purpose added by sabarish
                "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
            },
            "ReferralSourceDtls": {
                "ReferralID": 0,
                "SubReferralID": 2
            },
            "CommunicationDetails": {
                "PatientName": $scope.selectedPatientObj.PatientName || ($scope.selectedPatientObj.FullName),
                "PatientMobile": $scope.selectedPatientObj.PatientMobile || "",
                "DoctorMobile": Mainitem.DocObj.Mobile ? Mainitem.DocObj.Mobile : "",
                "HospitalName": Mainitem.DocObj.ClinicName,
                "DoctorName": Mainitem.DocObj.FullName,
                "AppDate": Mainitem.AppointmentDate,
                "AppTime": Mainitem.patinet_appStarttime,
                "AppClinic": Mainitem.DocObj.ClinicName,
                "AppToken": 0,
                // "PatientEmail": $scope.EmailId,
                //"PatientEmail": $scope.selectedPatientObj.PatientEmail,
                "PatientEmail": $scope.PatientDetailsForRegisterObj.EmailID,
                "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail,
                "DoctorEmail": $scope.DoctorEmailId,
                "HospitalContact": Mainitem.DocObj.MobileNo,
                "BrnachAddress": {
                    "Address1": doctorinfo.doctordata.UserAddress[0].Address1,
                    "Address2": doctorinfo.doctordata.UserAddress[0].Address2,
                    "Location": doctorinfo.doctordata.UserAddress[0].Location,
                    "StateId": doctorinfo.doctordata.UserAddress[0].StateId,
                    "PinCode": doctorinfo.doctordata.UserAddress[0].PinCode,
                    "CountryId": doctorinfo.doctordata.UserAddress[0].CountryId,
                    "CityId": doctorinfo.doctordata.UserAddress[0].CityId,
                    "DistrictRegion": doctorinfo.doctordata.UserAddress[0].DistrictRegion,
                    "Latitude": doctorinfo.doctordata.UserAddress[0].Latitude,
                    "Longitude": doctorinfo.doctordata.UserAddress[0].Longitude
                },
                "CommunicationEmailId": Mainitem.DocObj.CommunicationEmailId,
                "CommunicationMobileNo": Mainitem.DocObj.CommunicationMobileNo || "",
                "DisplayNumber": $scope.PatientDetailsForRegisterObj.DisplayNumber
            },
            "PreviousAppointmentDate": Mainitem.ConsultationDt||"" ,
           // "PreviousAppointmentTime": PreviousAppointmentTime|| "",
            "PreviousAppointmentTime":"",
            "IsFollowUp": false,
            "SendDocSms": Mainitem.SendDocSms,
            "SendDocEmail": Mainitem.SendDocEmail,
            "SendPatientEmail": Mainitem.SendPatientEmail,
            "SendPatientSms": Mainitem.SendPatientSms,
            "IsPatientSmsInd": Mainitem.SendPatientSms || false,
            "IsPatientEmailInd": Mainitem.SendPatientEmail || false,
            //"PatientEmail": $scope.selectedPatientObj.PatientEmail,
            "PatientEmail": $scope.PatientDetailsForRegisterObj.EmailID,
            //"PatientTypeId": $scope.PatientTypeId ? $scope.PatientTypeId : 1,
            "PatientTypeId": $scope.selectedPatientObj.PatientType ? $scope.selectedPatientObj.PatientType : 1,
            "PatientTitle": $scope.selectedPatientObj.PatientTitle,
            "PaidFollowup": false,
            "FirstName": $scope.selectedPatientObj.FirstName,
            "LastName": $scope.selectedPatientObj.LastName,
            "BSMSind": $scope.selectedPatientObj.BSMSind,
            "ContactNo": $scope.selectedPatientObj.ContactNo,
            "EmgyMobileNumber": $scope.selectedPatientObj.emgymobilenumber,
            "EmgyName": $scope.selectedPatientObj.emgyname,
            "EmgyRelationshipId": $scope.selectedPatientObj.emgyrelationship,
            "IsConsultationFollowUp": false,
            "IsCheckedIn": $scope.IsCheckIn || 1,
            "masterQuestions": [],
            "InvestigationList": [],
           
            "AttenderName": $scope.selectedPatientObj.AttenderName || "",
            "IsPaymentLinkInd": false,
            "IsPaymentPending": false,
            "HospitalEquipmentId": null,
            "PaymentTypeId": parseFloat($scope.paymentTypeObj.PaymentTypeId) || 0,
            "OrgInsuranceTpaId": 0,
            "DeviceEntityTypeId": 2,
            "VisitTypeId": $scope.selectedAppointmentObject.VisitReasonId || null,
            "IsInsuranceEligibilityVerify": Mainitem.IsInsuranceEligibilityVerify || false,
            "AppointmentTypeName": appointmenttypename,
            "DisplayNumber": $scope.PatientDetailsForRegisterObj.DisplayNumber,
            "PatientSmsLanguageId": $scope.selectedPatientObj.LanguageID,
            "RescheduledAppointmentId": Mainitem.RescheduledAppointmentId || 0,
            "RescheduledAppointmentDate": Mainitem.RescheduledAppointmentDate || null,
            "RescheduledAppointmentStartTime": Mainitem.RescheduledAppointmentStartTime || null,
            "RescheduledAppointmentEndTime": Mainitem.RescheduledAppointmentEndTime || null,
            "RescheduledDoctorId": Mainitem.RescheduledDoctorId || 0,
            "RescheduledAppointmentTypeId": Mainitem.RescheduledAppointmentTypeId || 0,
            "RescheduledVisitReasonId": Mainitem.RescheduledVisitReasonId || 0,
            "EncounterDiagnosisId": $scope.selectedAppointmentObject.EncounterDiagnosisId || null,
            "EncounterDiagnosisType": $scope.selectedAppointmentObject.EncounterDiagnosisType || "",
            "OtherNotes": $scope.selectedAppointmentObject.OtherNotes || "",
            "SMSVendorId": $scope.selectedBranchobj.SMSVendorId || 0,
            "BookingTypeId": Mainitem.BookingTypeId,
            "BookingStatusId": Mainitem.BookingStatusId,
            "SourceTypeId": Mainitem.SourceTypeId,
            "AppointmentStatusId": Mainitem.AppointmentStatusId,
            "PatientSeenOtherProvider": Mainitem.PatientSeenOtherProvider || '',
            "OtherProviderVisitDate": Mainitem.OtherProviderVisitDate ||null,
            "OtherProviderVisitReason": Mainitem.OtherProviderVisitReason || "",
            "OtherProviderDoctorName": Mainitem.OtherProviderDoctorName || "",
            "ReasonTypeId": Mainitem.ReasonTypeId || '',
            "NoShowStatusId": 3,
            "SurgeryList": $scope.SurgeryList || [],
            "NewSurgeryList": $scope.newSurgeryList || [],
            "AdditionalSurgery": $scope.AdditionalSurgery || [],
            "OtherNotesCreatedBy": $scope.selectedAppointmentObject.OtherNotesCreatedBy ||"",
            "OtherNotesCreatedDt": $scope.selectedAppointmentObject.OtherNotesCreatedDt ||null,
            "SurgeryReferralDoctorId": Mainitem.SurgeryReferralDoctorObj.DoctorID || 0,
            "IsConnectToFutureAppointment": $scope.selectedPatientObj.IsConnectToFutureAppointment || false,
            "IsReferral": Mainitem.IsReferral || false,
            "OtherProviderDoctorID": Mainitem.OtherProviderDoctorID || 0,
            "SmsLanguageId": $scope.selectedPatientObj.SmsLanguageId||""
        };
        

        if ((parseInt(Appparams.BookingTypeId) === 1 || parseInt(Appparams.BookingTypeId) == 3) && $scope.AppointmentCheckInDynamicStatus === 1 && $scope.IsCheckIn == 2) {
            Appparams.RoomId = $scope.RoomSearchObj.RoomId;
            Appparams.RoomTypeId = $scope.RoomSearchObj.RoomTypeId;
            Appparams.AssignedUserId = $scope.RoomSearchObj.AssignedUserId || Appparams.DoctorID;
        }

        console.log(Appparams);


        eHnoteUserAppointmentDataService.AddUpdateAppointmentService(Appparams, OnAddApointmentSuccess, OnCaseSaveError);
        function OnAddApointmentSuccess(data) {

            $scope.ApointmentAdded = false;
            $scope.patients = [];
            $scope.SelectedNewSurgeries = [];
            $scope.AdditionalSurgery = [];
            $scope.notifySMS = false;
            $scope.notifyMAIL = false;
            $scope.showHide = true;
            $scope.sendDocSms = false;
            $scope.sendDocEmail = false;
            $scope.sendPatientSms = false;
            $scope.sendPatientEmail = false;

            $rootScope.appointmentRootId = 0;
            $rootScope.appointmentParentId = 0;
            $rootScope.appointment_type = "";
            $rootScope.AppointmentPatient_type = "";
            $rootScope.FastTrackAppointment = false;
            $scope.SearchTxtObj.DoctorName = "";

            if (data.status === "success") {

                // commented by Sumanth (02-02-2024) because this logic is already being executed in modifyappointment proc
                //if (parseInt(VisitRsnType) == 7 || parseInt(VisitRsnType) == 4) {
                //    let SurgeryStatusUpdateObj = {
                //        "AppointmentId": data.response.AppointmentID || 0,
                //        "AppointmentTypeId": parseInt(VisitRsnType),
                //        "SurgeriesList": $scope.SurgeryList || [],
                //        "IsPreAdmissionApptBooked": (parseInt(VisitRsnType) == 7) ? true : false,
                //        "IsASCApptBooked": (parseInt(VisitRsnType) == 4) ? true : false,
                //    };

                //    console.log(JSON.stringify(SurgeryStatusUpdateObj));

                //    eHnoteSurgeryService.UpdateSurgeryStatusForPreAdmBooking(SurgeryStatusUpdateObj).then(function (resp) {

                //    }, function (err) {
                //        console.log(err);
                //    });
                //}

                let ScreenObj = datapersistanceFactory.getItem("AppointmentRequestScreen");
                var AppReqScreen = '';
                if (ScreenObj.IsComingFrom === "AppointmentRequestScreen") {
                    AppReqScreen = ScreenObj.IsComingFrom || '';
                    let StatusId = null;
                    let Status = '';
                    if (ScreenObj.StatusId == 4) {
                        StatusId = 4;
                        Status = "TransferToHospital";
                    } else {
                        StatusId = 3;
                    }
                    let params = {
                        "PluginAppoitmentRequestId": ScreenObj.PluginAppoitmentRequestId || 0,
                        "PatientId": data.response.PatientID,
                        "MasterPatientId": ScreenObj.MasterPatientId,
                        "AppointmentId": data.response.AppointmentID,
                        "BranchId": data.response.BranchId,
                        "PreferredDate": $filter('date')(new Date(ScreenObj.PreferredDate), "yyyy-MM-dd"),
                        "RequestedDate": ScreenObj.RequestedDate,
                        "AppointmentRequestReasonId": ScreenObj.AppointmentRequestReasonId,
                        "Remarks": ScreenObj.Remarks,
                        "RequestStatusId": 2,
                        "RequestStatus": "Booked",
                        "StatusId": StatusId,
                        "Status": Status,
                        "DeleteInd": "N",
                        "ReasonTypeId": ScreenObj.ReasonTypeId || null
                    }
                    eHnoteUserAppointmentDataService.AddUpdatePluginAppointmentRequest(params).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $uibModalInstance.close(data);
                        }
                    }, function (err) {
                        console.log(err);
                    });
                }
               
                if ($scope.IsAutoEligibiltyCheckEnabled) {
                    $scope.ConsultationEntry.IsCheckInsuranceEligibility = true;
                }
                $scope.IsCheckInsuranceEligibility = false;
                if ($scope.IsCheckInsuranceEligibility) {


                    var AppointmentInsuranceDetailId = data.response.AppointmentInsuranceDetailId;
                    console.log(AppointmentInsuranceDetailId);

                    var sobj = {
                        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "HospitalId": data.response.HospitalID,
                        "DoctorId": data.response.DoctorID,
                        "PageSize": 10,
                        "PageNumber": 1,
                        "PatientId": 0,
                        "AppointmentInsuranceDetailId": data.response.AppointmentInsuranceDetailId
                    }


                    eHnoteInsuranceService.GetAppointmentInsuranceListDetails(sobj).then(function (resp) {

                        console.log(resp);


                        if (resp.data.status === "Success") {


                            var sitem = resp.data.rows[0];


                            eHnoteInsuranceService.checkPatientInsuranceEligibilityById(sitem, onSuccess, onError);
                            function onSuccess(resp) {
                                console.log(resp);

                                resp.errors = resp.errors || [];
                                if (resp.errors.length > 0) {
                                    var eparams = {
                                        "UserId": doctorinfo.doctorid,
                                        "AppointmentInsuranceDetailId": data.response.AppointmentInsuranceDetailId,
                                        "InsuranceEligibilityErrorStatusId": 0,
                                        "ErrorDetails": [],
                                        "VerifiedDate": $filter("date")(new Date(), "yyyy-MM-dd")
                                    }
                                    angular.forEach(resp.errors, function (eitem) {
                                        var eobj = {
                                            "Field": eitem.field,
                                            "Description": eitem.description
                                        }
                                        eparams.ErrorDetails.push(eobj);
                                    });



                                    eHnoteInsuranceService.UpdateInsuranceEligibilityErrorDetails(eparams).then(function (response) {
                                        if (response.data.status === 'Success') {

                                        }

                                    });
                                }
                                else {

                                    var PlanStatusCode = 0, PlanStatus = "", ResponseJson = "", insStatusId = 1;

                                    if (resp.planStatus.length > 0) {
                                        PlanStatusCode = parseFloat(resp.planStatus[0].statusCode) || 0;
                                        PlanStatus = resp.planStatus[0].status;
                                        ResponseJson = JSON.stringify(resp);
                                    }
                                    if (PlanStatusCode == 1) {
                                        insStatusId = 1;
                                    } else {
                                        insStatusId = 2;
                                    }

                                    var obj = {
                                        "UserId": doctorinfo.doctorid,
                                        "PatientId": patient_id,
                                        "VerificationDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                        "AppointmentInsuranceDetailId": data.response.AppointmentInsuranceDetailId,
                                        "PatientInsuranceDetailId": $scope.PatientInsuranceObj.PatientInsuranceDetailId,
                                        "PlanStatusCode": PlanStatusCode,
                                        "PlanStatus": PlanStatus,
                                        "StatusId": insStatusId,
                                        "PatientCoPayAmount": 0,
                                        "PatientCoPayPercentage": 0,
                                        "BenifitCoveragesList": [],
                                        "BenifitCoverageDetailsList": []
                                    }
                                    resp.benefitsInformation = resp.benefitsInformation || [];
                                    resp.planStatus = resp.planStatus || [];


                                    if (resp.planStatus.length > 0) {
                                        angular.forEach(resp.planStatus, function (psitem) {
                                            angular.forEach(psitem.serviceTypeCodes, function (subitem) {
                                                var sobj = {
                                                    "PatientEligibilityBenifitId": 0,
                                                    "ServiceTypeCode": subitem || 0,
                                                    "Status": psitem.status,
                                                    "IsCopayIdentified": false,
                                                    "DeleteInd": false,
                                                }

                                                obj.BenifitCoveragesList.push(sobj);
                                            });

                                        });
                                    }

                                    if (resp.benefitsInformation.length > 0) {
                                        angular.forEach(resp.benefitsInformation, function (bitem) {
                                            angular.forEach(bitem.serviceTypeCodes, function (subitem) {
                                                bitem.benefitsDateInformation = bitem.benefitsDateInformation || '';
                                                var BenifitDateInformation = '';
                                                if (bitem.benefitsDateInformation != '') {
                                                    bitem.benefitsDateInformation.plan = bitem.benefitsDateInformation.plan || '';
                                                    bitem.benefitsDateInformation.benefit = bitem.benefitsDateInformation.benefit || '';
                                                    BenifitDateInformation = bitem.benefitsDateInformation.plan == '' ? bitem.benefitsDateInformation.benefit : bitem.benefitsDateInformation.plan;
                                                }

                                                var sobj = {
                                                    "PatientEligibilityBenifitDetailId": 0,
                                                    "ServiceTypeCode": subitem || 0,
                                                    "BenifitTypeName": bitem.name,
                                                    "BenifitAmount": bitem.benefitAmount || 0,
                                                    "BenifitPercentage": bitem.benefitPercent || 0,
                                                    "BenifitDateInformation": BenifitDateInformation || "",
                                                    "TimeQualifier": bitem.timeQualifier || '',
                                                    "CoverageLevel": bitem.coverageLevel || '',
                                                    "inPlanNetworkIndicator": bitem.inPlanNetworkIndicator || "No",
                                                    "DeleteInd": false,
                                                }

                                                obj.BenifitCoverageDetailsList.push(sobj);
                                            });

                                        });
                                    }



                                    eHnoteInsuranceService.UpdatePatientInsuranceEligibilityResponse(obj).then(function (response) {
                                        console.log(response);
                                        if (response.data.status === 'Success') {

                                        }

                                    });
                                }

                            }
                            function onError(reponse) {
                            }

                        } else {
                            alertify.error(resp.data.Message);
                        }
                    });

                }






                if ($scope.pagename === "surgery") {
                    alertify.success('Surgery Appointment Created Successfully');
                    $scope.$emit('surgeryAppointmentsuccess', data);
                }
                else if ($scope.pagename === "surgeryFileUpload") {
                    alertify.success('Surgery Appointment Created Successfully');
                    $scope.$emit('surgeryFileUploadAppointmentsuccess', data);
                }
                else {
                    if ($scope.selectedAppointmentObject.AppointmentID && !$filter("isObject")($scope.SelectedDummyAppointment)) {
                        alertify.success('Appointment has been Re-Scheduled Successfully');
                        $uibModalInstance.close(data);
                        // $scope.$emit("bookapptreshedulesuccessMethod", data);
                    } else {
                        alertify.success('Appointment Created Successfully');

                        if ($scope.Subtype == 'multipleAppt') {

                            if (!AppointmentDetailsCache.IsMultipleAppts) {
                                AppointmentDetailsCache.ASCDatesArray = AppointmentDetailsCache.ASCDatesArray || [];
                                if (AppointmentDetailsCache.ASCDatesArray.length === 0) {
                                    $scope.selectedAppointmentObject.EndTime = data.response.EndTime;
                                    $scope.restructureandpushnewupdatedobj(data.response.AppointmentID);
                                }
                            } else {
                                AppointmentDetailsCache.ASCDatesArray = AppointmentDetailsCache.ASCDatesArray || [];
                                if (AppointmentDetailsCache.ASCDatesArray.length > 0) {
                                    let ActiveIndex = 0;
                                    let TabIndex = 0;
                                    angular.forEach($scope.MultipleAppointmentList, function (item, index) {
                                        if (item.IsEdit) {
                                            $scope.AssignApptDetailsToListTab(data.response.AppointmentID);
                                            ActiveIndex = index;
                                            TabIndex = item.TabId;
                                        }
                                    });

                                    let multipleApptObj = {
                                        "AppointmentId": data.response.AppointmentID,
                                        "AppointmentTypeId": data.response.AppointmentTypeId,
                                        "AppointmentDate": $filter('date')(data.response.ConsultationDt, "yyyy-MM-dd"),
                                        "TabIndex": TabIndex
                                    };
                                    $rootScope.$emit("BookMultipleAppt", multipleApptObj);

                                    if (ActiveIndex === ($scope.MultipleAppointmentList.length - 1)) {
                                        $uibModalInstance.close(data);
                                    } else {
                                        let tabIndex = ActiveIndex + 1;
                                        $scope.navtoParticularAppointmentTab($scope.MultipleAppointmentList[tabIndex], AppointmentDetailsCache.ASCDatesArray, AppointmentDetailsCache.SurgeryList,2);
                                    }
                                }
                            }

                        } else {
                            if (!AppointmentDetailsCache.IsMultipleAppts) {
                                AppointmentDetailsCache.ASCDatesArray = AppointmentDetailsCache.ASCDatesArray || [];
                                if (AppointmentDetailsCache.ASCDatesArray.length === 0) {
                                    if (AppReqScreen != 'AppointmentRequestScreen') {
                                        $uibModalInstance.close(data);
                                    }
                                    //   $scope.$emit('BookApptsuccessMethod', data);
                                }
                            } else {
                                AppointmentDetailsCache.ASCDatesArray = AppointmentDetailsCache.ASCDatesArray || [];
                                if (AppointmentDetailsCache.ASCDatesArray.length > 0) {
                                    let ActiveIndex = 0;
                                    let TabIndex = 0;
                                    angular.forEach($scope.MultipleAppointmentList, function (item, index) {
                                        if (item.IsEdit) {
                                            $scope.AssignApptDetailsToListTab(data.response.AppointmentID);
                                            ActiveIndex = index;
                                            TabIndex = item.TabId;
                                        }
                                    });
                                    let multipleApptObj = {
                                        "AppointmentId": data.response.AppointmentID,
                                        "AppointmentTypeId": data.response.AppointmentTypeId,
                                        "AppointmentDate": $filter('date')(data.response.ConsultationDt, "yyyy-MM-dd"),
                                        "TabIndex": TabIndex
                                    };
                                    $rootScope.$emit("BookMultipleAppt", multipleApptObj);

                                    if (ActiveIndex === ($scope.MultipleAppointmentList.length - 1)) {
                                        $uibModalInstance.close(data);
                                    } else {
                                        let tabIndex = ActiveIndex + 1;
                                        $scope.navtoParticularAppointmentTab($scope.MultipleAppointmentList[tabIndex], AppointmentDetailsCache.ASCDatesArray, AppointmentDetailsCache.SurgeryList);
                                    }
                                } else {
                                    $uibModalInstance.close(data);
                                }
                            }
                        }

                    }
                }

            } else {
                alertify.error("Appointment creation failed");
                $scope.$emit("BookApptsuccessMethod", data);
            }
            $scope.IsSubmitDisabled = false;

            if (data.response.TokenNumber === "0") {
                $scope.Token = "";
            } else {
                $scope.Token = data.response.TokenNumber;
            }
            //$scope.TIME = $scope.slot.patinet_appStarttime.StartTime;
            //$scope.date = $filter("date")(new Date(), "dd-MM-yyyy");

        }
        function OnCaseSaveError(err) {
            alertify.error("Error in Creating Appointment");
            $scope.IsSubmitDisabled = false;
        }

    }

    function GetRoomSearchObj() {
        return {
            "RoomTypeId": 0,
            "RoomId": 0,
            "RoomTypeobj": "",
            "Opthamobj": "",
            "AssignedUserId": null,
            "ARobj": "",
            "OptomId": null,
            "ARId": null,
            "Technicianobj": "",
            "TechnicianId": null,
            "Counsellorobj": "",
            "CounsellorId": null,
            "DilationAssistantobj": "",
            "DilationAssistantId": null,
            "DoctorId": null,
            "Roomobj": "",
            "Billingobj": "",
            "NewApptStartTime": ""
        }
    };
    $scope.RoomSearchObj = GetRoomSearchObj();

    $scope.ChangeBookingType = function (type, Mainitem) {

        Mainitem.IsWalkInSlot = type;
        //Mainitem.IsShowNoApptInd = true;
        Mainitem.IsNoShowAppointment = false;

        if (Mainitem.IsWalkInSlot == true) {
            Mainitem.IsAppointmentConfirmed = true;
            Mainitem.IsWaitingListAppointment = false;
        }
        else {
            Mainitem.IsAppointmentConfirmed = false;
        }
        Mainitem.BookingTypeId = (Mainitem.IsWalkInSlot == true) ? "1" : "3";
        Mainitem.SourceTypeId = (Mainitem.IsWalkInSlot == true) ? "1" : "3";


        $scope.RoomSearchObj = GetRoomSearchObj();

        if (Mainitem.BookingTypeId === 1 || Mainitem.BookingTypeId === "1" || Mainitem.BookingTypeId == "3") {
            //Mainitem.IsCheckedIn = 2;
            $scope.RoomSearchObj.RoomTypeId = Mainitem.RoomTypeId || 10;
        }

        if ((Mainitem.BookingTypeId === 3 || Mainitem.BookingTypeId === "3") && Mainitem.AppointmentID == 0) {
            Mainitem.IsCheckedIn = 1;
        }
        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
        var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
        if (Mainitem.BookingTypeId === 1 || Mainitem.BookingTypeId === "1") {
            if (appointmentDate > currentdate) {
                Mainitem.IsAppointmentConfirmed = false;
                Mainitem.IsShowNoApptInd = false;
            }
            else {
                Mainitem.IsAppointmentConfirmed = true;
                Mainitem.IsShowNoApptInd = true;
                Mainitem.IsCheckedIn = 2;
            }
        } else {
            Mainitem.IsAppointmentConfirmed = false;
            Mainitem.IsShowNoApptInd = false;
        }
    }

    $scope.ChangeAppointmentConfirmed = function (type, Mainitem) {
        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
        var appointmentDate = $filter('date')(Mainitem.AppointmentDate, "yyyy-MM-dd");
        appointmentDate = $filter('date')(new Date(appointmentDate + ' ' + '00:00:00'), "yyyy-MM-dd");

        Mainitem.IsAppointmentConfirmed = type;
        Mainitem.IsWaitingListAppointment = false;
        Mainitem.IsShowNoApptInd = false;

        if ((appointmentDate == currentdate) && Mainitem.IsWalkInSlot) {
            Mainitem.IsWaitingListAppointment = false;
            Mainitem.IsShowNoApptInd = true;
        }
        else if ((appointmentDate == currentdate) && !Mainitem.IsWalkInSlot) {
            //Mainitem.IsNoShowAppointment = false;
            Mainitem.IsShowNoApptInd = false;
        }
        else if ((appointmentDate > currentdate) || Mainitem.IsWalkInSlot) {
            //Mainitem.IsNoShowAppointment = false;
            Mainitem.IsShowNoApptInd = false;
        }
        else {
            console.log('checking');
        }


    }


    $scope.ApptSubmiteText = 'Save';
    $scope.Changeaddnotes1 = function (item) {
        if (item.SelectedNotesobj.AppointmentNote == '') {
            alertify.error("Please Enter Notes");
            return false;
        }
        item.AppointmentNotesList = item.AppointmentNotesList || [];
        var obj = {
            "AppointmentNoteId": item.SelectedNotesobj.AppointmentNoteId || 0,
            "Notes": item.SelectedNotesobj.AppointmentNote || "",
            "DeleteInd": "N",
            "CreatedBy": userLoginDetails.displayName || "",
            "UserId": eHnoteMasterDataService.getLoginId() || "",
            "CreatedDt": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a')
        }
        //if ($scope.index !== "") {
        //    item.AppointmentNotesList.splice($scope.index, 1);
        //}

        item.AppointmentNotesList.push(obj);
        item.SelectedNotesobj.AppointmentNote = "";
        $scope.Showaddnotes = false;
        $scope.UnblockSlots = false;

        console.log($scope.isAppValiddities.BlockedSlotObj);

        //$scope.isAppValiddities.isValidOptionSelected = true;
        $scope.isAppValiddities.UnblockSlots = false;
        // $scope.isAppValiddities.isEnableAlertType = false;
        $scope.isAppValiddities.IsEnabledAfterCheckHere = false;
        $scope.isAppValiddities.MaxApptErrorMsgShow = false;
        angular.forEach($scope.selectedAppointmentObject.TimeSlotsStartArray, function (sitem) {
            if (sitem.StartTime === $scope.isAppValiddities.BlockedSlotObj.StartTime) {
                sitem.Available = "Y";
                //$scope.selectedAppointmentObject.StartTime = $scope.isAppValiddities.BlockedSlotObj.StartTime;

                $scope.selectedAppointmentObject.patinet_appStarttime = sitem.StartTime;

                $scope.selectedAppointmentObject.StartTime = sitem.StartTime || "";


                $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
                var Index = $scope.selectedAppointmentObject.TimeSlotsStartArray.findIndex(record => record.StartTime === $scope.selectedAppointmentObject.patinet_appStarttime);
                if (Index > -1) {
                    angular.forEach($scope.selectedAppointmentObject.TimeSlotsStartArray, function (sitem, index1) {
                        if (index1 >= Index) {
                            $scope.selectedAppointmentObject.TimeSlotsEndArray.push(sitem);
                        }
                    });
                }

                $scope.selectedAppointmentObject.patient_appEndTime = $scope.selectedAppointmentObject.TimeSlotsEndArray[0].EndTime.toString();
            }
        });

        $scope.index = "";
        $scope.ApptSubmiteText = 'Save';
    }

    $scope.EditNodes = function (Nitem, index) {
        $scope.UserId = eHnoteMasterDataService.getLoginId()
        if ($scope.UserId == Nitem.UserId) {
            if ($scope.paymentTypeObj.AppointmentNotesList.length != 0) {
                $scope.paymentTypeObj.AppointmentNote = Nitem.Notes;
            }
            $scope.Showaddnotes = true;
            $scope.SelectedNotesobj.IsEdit = true;
            $scope.SelectedNotesobj.index = index;
            $scope.SelectedNotesobj.AppointmentNoteId = Nitem.AppointmentNoteId || 0;
        }
    }

    $scope.ChangeUpdateNotes = function (item) {
        if (item.SelectedNotesobj.AppointmentNote == '') {
            alertify.error("Please Enter Notes");
            return false;
        }

        item.AppointmentNotesList = item.AppointmentNotesList || [];
        if (item.SelectedNotesobj.AppointmentNoteId != 0) {
            angular.forEach(item.AppointmentNotesList, function (sitem) {
                if (sitem.AppointmentNoteId === item.SelectedNotesobj.AppointmentNoteId) {
                    sitem.Notes = item.SelectedNotesobj.AppointmentNote;
                    sitem.Date = $filter("date")(new Date(), "MM-dd-yyyy");
                    sitem.Time = $filter('date')(new Date(), 'HH:mm') || "";
                }
            });

            item.SelectedNotesobj.IsEdit = false;
            item.SelectedNotesobj.index = null;
            item.SelectedNotesobj.AppointmentNoteId = null;
            item.SelectedNotesobj.AppointmentNote = "";
            $scope.Showaddnotes = false;
        } else {
            var index = item.SelectedNotesobj.index;
            item.AppointmentNotesList[index].Notes = item.SelectedNotesobj.AppointmentNote;
            item.AppointmentNotesList[index].Date = $filter("date")(new Date(), "MM-dd-yyyy");
            item.AppointmentNotesList[index].Time = $filter('date')(new Date(), 'HH:mm') || "";

            item.SelectedNotesobj.IsEdit = false;
            item.SelectedNotesobj.index = null;
            item.SelectedNotesobj.AppointmentNoteId = null;
            item.SelectedNotesobj.AppointmentNote = "";
            $scope.Showaddnotes = false;
        }
        $scope.index = "";
    }

    $scope.DeleteApptNote = function (item, index, Mainitem) {
        $scope.UserId = eHnoteMasterDataService.getLoginId()
        if ($scope.UserId == item.UserId) {
            if (item.AppointmentNoteId == 0 || item.AppointmentNoteId == undefined) {
                Mainitem.AppointmentNotesList.splice(index, 1);
            } else {
                angular.forEach(Mainitem.AppointmentNotesList, function (Aitem) {
                    if (Aitem.AppointmentNoteId == item.AppointmentNoteId) {
                        Aitem.DeleteInd = "Y";
                    }
                });
            }
        }
    }

    $scope.EditApptNote = function (item, index, Mainitem) {
        $scope.selectedAppointmentObject.SelectedNotesobj.AppointmentNote = item.Notes;
        $scope.selectedAppointmentObject.SelectedNotesobj.AppointmentNoteId = item.AppointmentNoteId;
        $scope.ApptSubmiteText = 'Update';
        Mainitem.AppointmentNotesList.splice(index, 1);
    }

    $scope.AllVisitReasons = [];

    $scope.GetVisitReasonNew = function (type) {
        var getParams = {
            "OrganizationId": $scope.HospitalId,
            "ReasonTypeId": 1,
            "SearchText": "",
            "VisitTypeId": null
        };
        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.status == "Success") {
                    var obj = {
                        "ActiveIND": "Y",
                        "Reason": "All Visit Reason",
                        "ReasonId": 0,
                        "ReasonTypeId": 1,
                        "Remarks": "",
                        "VisitReasonColorCode": "",
                        "VisitTypeId": 0,
                        "VisitTypeName": "",
                        "VisitiTypeCode": ""
                    };
                    $scope.AllVisitReasons = angular.copy(resp.data.rows) || [];
                    if ($scope.AllVisitReasons.length > 0) {
                        $scope.AllVisitReasons = $filter("filter")($scope.AllVisitReasons, function (item) {
                            return item.ActiveIND === 'Y';
                        });

                        $scope.AllVisitReasons.unshift(obj);
                    }

                    if (type == "Get") {
                        var visitfilter = $filter("filter")($scope.AllVisitReasons, { "ReasonId": $scope.selectedAppointmentObject.VisitReasonId }, true);
                        if (visitfilter.length > 0) {
                            $scope.selectedAppointmentObject.VisitReasonObj = visitfilter[0];
                        } else {
                            $scope.selectedAppointmentObject.VisitReasonObj = "";
                        }
                    }

                    if ($scope.selectedAppointmentObject.AppointmentTypeId == 7 || $scope.selectedAppointmentObject.AppointmentTypeId == 6 || $scope.selectedAppointmentObject.AppointmentTypeId == 4 || $scope.selectedAppointmentObject.AppointmentTypeId == 14) {
                        $scope.onSelectVisitReason($scope.selectedAppointmentObject.VisitReasonObj);
                    }
                }
            }
        }, function (error) {
            console.log(error);
        });
    };


    //$scope.SelectedPatient = function (PatientId) {
    //    eHnoteAuditServices.getParticularPatientDetailsById(PatientId).then(function (resp) {
    //        resp.data = resp.data || [];

    //    });
    //}




    $scope.navtoParticularAppointmentTab = function (maintiem, datesarray, surgeryarray, type) {
       
        if (type == 1 && maintiem.AppointmentID != 0) {
            angular.forEach($scope.MultipleAppointmentList, function (item) {
                item.IsEdit = false;
            });
            eHnoteMainAppointmentService.getAdditionalApptDetailsById(maintiem.AppointmentID).then(function (resp) {
                resp.data = resp.data || [];
                if (resp.data.length > 0) {
                    if (resp.data[0].AppointmentDetails.length > 0) {
                        /* $scope.MultipleAppointmentList = [];*/
                        $scope.AdditionalSurgery = [];
                        $scope.SelectedNewSurgeries = [];
                        var index = $scope.MultipleAppointmentList.indexOf(maintiem);
                        $scope.AppointmentDetailsInfo = GetAppointmentDetailsInfo();
                        $scope.MultipleAppointmentList[index].IsEdit = true;
                        //$scope.MultipleAppointmentList.push($scope.AppointmentDetailsInfo);
                        $scope.selectedAppointmentObject = getnewAppoitnmentDoctorObj();




                        $scope.selectedAppointmentObject.IsEdit = true;
                        $scope.selectedAppointmentObject.AppointmentID = resp.data[0].AppointmentDetails[0].AppointmentId;
                        $scope.selectedAppointmentObject.ParentAppointmentId = resp.data[0].AppointmentDetails[0].ParentAppointmentId;
                        $scope.selectedAppointmentObject.RootAppointmentId = resp.data[0].AppointmentDetails[0].RootAppointmentId;
                        $scope.selectedAppointmentObject.OrganId = resp.data[0].AppointmentDetails[0].OrganId;
                        $scope.selectedAppointmentObject.NurseId = resp.data[0].AppointmentDetails[0].NurseId;
                        $scope.selectedAppointmentObject.AnesthesistId = resp.data[0].AppointmentDetails[0].AnesthesistId;
                        $scope.selectedAppointmentObject.AppointmentStatus = resp.data[0].AppointmentDetails[0].AppointmentStatus;


                        $scope.selectedAppointmentObject.ReasonTypeId = resp.data[0].AppointmentDetails[0].ReasonTypeId || null;
                        $scope.selectedAppointmentObject.PatientSeenOtherProvider = resp.data[0].AppointmentDetails[0].PatientSeenOtherProvider || '';
                        $scope.selectedAppointmentObject.OtherProviderDoctorName = resp.data[0].AppointmentDetails[0].OtherProviderDoctorName || '';
                        $scope.selectedAppointmentObject.IsReferral = resp.data[0].AppointmentDetails[0].IsReferral || false;
                        if ($scope.selectedAppointmentObject.OtherProviderDoctorName != '' && $scope.selectedAppointmentObject.IsReferral) {
                            $scope.selectedAppointmentObject.PCPDoctor = $scope.selectedAppointmentObject.OtherProviderDoctorName || '';
                        }
                        $scope.selectedAppointmentObject.OtherProviderVisitDate = resp.data[0].AppointmentDetails[0].OtherProviderVisitDate || null;
                        if ($scope.selectedAppointmentObject.OtherProviderVisitDate != null) {
                            var todate = new Date();
                            var age = [];
                            var fromdate = new Date($scope.selectedAppointmentObject.OtherProviderVisitDate);
                            var y = [todate.getFullYear(), fromdate.getFullYear()];
                            var ydiff = y[0] - y[1];
                            var m = [todate.getMonth(), fromdate.getMonth()];
                            var mdiff = m[0] - m[1];
                            var d = [todate.getDate(), fromdate.getDate()];
                            var ddiff = d[0] - d[1];
                            if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
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


                            $scope.OtherVisitobj.ageinYears = ydiff.toString();
                            $scope.OtherVisitobj.ageinMonths = mdiff.toString();
                            if ($scope.OtherVisitobj.ageinMonths === "-1") {
                                $scope.OtherVisitobj.ageinMonths = "";
                            }
                            $scope.OtherVisitobj.ageinDays = ddiff.toString();
                            $scope.selectedAppointmentObject.OtherProviderVisitDate=$filter("date")($scope.selectedAppointmentObject.OtherProviderVisitDate, "MM-dd-yyyy")
                        }
                        $scope.selectedAppointmentObject.OtherProviderVisitReason = resp.data[0].AppointmentDetails[0].OtherProviderVisitReason || '';
                        $scope.selectedAppointmentObject.OtherProviderDoctorID = resp.data[0].AppointmentDetails[0].OtherProviderDoctorID || 0;

                        if ($scope.selectedAppointmentObject.ReasonTypeId != null) {
                            $scope.CRMReasonTypefilters();
                        }

                        // $scope.selectedAppointmentObject.CurrentTime = maintiem.CurrentTime;
                        var dayViewStart = moment(resp.data[0].AppointmentDetails[0].StartTime, 'HH:mm:');
                        var newStartTime1 = $filter('date')(new Date(dayViewStart), 'HH:mm');
                        $scope.selectedAppointmentObject.StartTime = newStartTime1;

                        var dayViewend = moment(resp.data[0].AppointmentDetails[0].EndTime, 'HH:mm:');
                        var newendTime1 = $filter('date')(new Date(dayViewend), 'HH:mm');
                        $scope.selectedAppointmentObject.EndTime = newendTime1;

                        $scope.selectedAppointmentObject.patinet_appStarttime = newStartTime1;
                        $scope.selectedAppointmentObject.patient_appEndTime = newendTime1;
                        //  $scope.selectedAppointmentObject.EndTime = resp.data[0].AppointmentDetails[0].EndTime;

                        // calculating duration in reschedule
                        let starttime1 = $filter('date')(new Date(), "yyyy-MM-dd") + " " + resp.data[0].AppointmentDetails[0].StartTime;
                        starttime1 = new Date(starttime1);
                        let endtime1 = $filter('date')(new Date(), "yyyy-MM-dd") + " " + resp.data[0].AppointmentDetails[0].EndTime;
                        endtime1 = new Date(endtime1);
                        function getMinutesBetweenDates(startDate, endDate) {
                            var diff = endDate.getTime() - startDate.getTime();
                            return (diff / 60000);
                        }
                        let minutes = getMinutesBetweenDates(starttime1, endtime1);
                        $scope.ApptDurationObj.patinet_consultationTime = minutes.toString();

                        $scope.selectedAppointmentObject.AppointmentTypeId = resp.data[0].AppointmentDetails[0].AppointmentTypeId;
                        $scope.selectedAppointmentObject.VisitRemarks = resp.data[0].AppointmentDetails[0].VisitRemarks;
                        $scope.selectedAppointmentObject.BookingTypeId = resp.data[0].AppointmentDetails[0].BookingTypeId;
                        $scope.selectedAppointmentObject.BookingStatusId = resp.data[0].AppointmentDetails[0].BookingStatusId;
                        $scope.selectedAppointmentObject.AppointmentStatusId = resp.data[0].AppointmentDetails[0].AppointmentStatusId;
                        $scope.selectedAppointmentObject.IsConfirmedAppointment = resp.data[0].AppointmentDetails[0].IsConfirmedAppointment;

                        if (resp.data[0].AppointmentDetails[0].BookingTypeId == 2) {
                            $scope.selectedAppointmentObject.IsWaitingListAppointment = true;
                        } else {
                            $scope.selectedAppointmentObject.IsWaitingListAppointment = false;

                        }

                        if ($scope.selectedAppointmentObject.BookingTypeId == 1) {
                            $scope.selectedAppointmentObject.IsWalkInSlot = true;
                        } else {
                            $scope.selectedAppointmentObject.IsWalkInSlot = false;
                        }

                        //$scope.selectedAppointmentObject.selectedBookAppo = maintiem.selectedBookAppo;
                        //if ($scope.selectedAppointmentObject.BookingTypeId == 1) {
                        //    $scope.selectedAppointmentObject.IsWalkInSlot = true;
                        //} else {
                        //    $scope.selectedAppointmentObject.IsWalkInSlot = false;
                        //}
                        //$scope.selectedAppointmentObject.IsAppointmentConfirmed = resp.data[0].AppointmentDetails[0].IsConfirmedAppointment;
                        if (resp.data[0].AppointmentDetails[0].BookingStatusId == 1) {
                            $scope.selectedAppointmentObject.IsAppointmentConfirmed = true;
                        } else {
                            $scope.selectedAppointmentObject.IsAppointmentConfirmed = false;
                        }

                        $scope.selectedAppointmentObject.IsWaitingListAppointment = resp.data[0].AppointmentDetails[0].IsWaitingListAppointment || false;
                        $scope.selectedAppointmentObject.IsNoShowAppointment = resp.data[0].AppointmentDetails[0].IsNoShowAppointment || false;
                        // $scope.RescheduleIsNoShowAppointment = resp.data[0].AppointmentDetails[0].IsNoShowAppointment || false;
                        //$scope.selectedAppointmentObject.IsPatientMissedAppointment = maintiem.IsPatientMissedAppointment;
                        //$scope.selectedAppointmentObject.IsInsuranceEligibilityVerify = maintiem.IsInsuranceEligibilityVerify;

                        //     $scope.selectedAppointmentObject.searchvisitreasontxt = maintiem.searchvisitreasontxt;
                        $scope.selectedAppointmentObject.AppointmentDate = resp.data[0].AppointmentDetails[0].AppointmentDate;
                        $scope.ApptMaintainfields.EditAppointmetDate = resp.data[0].AppointmentDetails[0].AppointmentDate;
                        $scope.ApptMaintainfields.EditAppointmentTime = resp.data[0].AppointmentDetails[0].ShortStartTime || "";
                        $scope.selectedAppointmentObject.DoctorID = resp.data[0].AppointmentDetails[0].DoctorID;
                        $scope.selectedAppointmentObject.UserBranchId = resp.data[0].AppointmentDetails[0].UserBranchId;

                        $scope.selectedAppointmentObject.RoomId = resp.data[0].AppointmentDetails[0].RoomId || null;
                        $scope.selectedAppointmentObject.RoomTypeId = resp.data[0].AppointmentDetails[0].RoomTypeId || null;
                        // $scope.selectedAppointmentObject.DayCD = maintiem.DayCD;
                        $scope.selectedAppointmentObject.VisitReasonName = resp.data[0].AppointmentDetails[0].VisitReasonName;
                        $scope.selectedAppointmentObject.ConsultationDt = resp.data[0].AppointmentDetails[0].AppointmentDate;
                        $scope.selectedAppointmentObject.PatientID = resp.data[0].Patient.PatientID;
                        $scope.selectedPatientObj.PatientId = resp.data[0].Patient.PatientID;
                        console.log($scope.selectedPatientObj.PatientId + "__PatientId");
                        //$scope.selectedAppointmentObject.PreviousAppointmentDate = maintiem.PreviousAppointmentDate;
                        //$scope.selectedAppointmentObject.SendDocSms = false;
                        //$scope.selectedAppointmentObject.SendDocEmail = maintiem.SendDocEmail;
                        //$scope.selectedAppointmentObject.SendPatientEmail = maintiem.SendPatientEmail;
                        //$scope.selectedAppointmentObject.SendPatientSms = maintiem.SendPatientSms;
                        //$scope.selectedAppointmentObject.PatientEmail = maintiem.PatientEmail;

                        $scope.selectedAppointmentObject.PatientTypeId = resp.data[0].AppointmentDetails[0].PatientTypeId;

                        $scope.selectedAppointmentObject.IsCheckedIn = resp.data[0].AppointmentDetails[0].CheckinStatusId;
                        $scope.selectedAppointmentObject.PatientInsuranceList = resp.data[0].PatientInsuranceList || [];
                        $scope.selectedAppointmentObject.AppointmentNotesList = resp.data[0].AppointmentNotes;
                        $scope.selectedAppointmentObject.AppointmentNotes = resp.data[0].AppointmentNotes;
                        // $scope.selectedAppointmentObject.HospitalEquipmentId = maintiem.HospitalEquipmentId;
                        $scope.selectedAppointmentObject.PaymentTypeId = resp.data[0].PaymentTypeId;

                        // for insurance 
                        if ($scope.selectedAppointmentObject.PatientInsuranceList.length > 0) {
                            if ($scope.selectedAppointmentObject.PatientInsuranceList.length == 1) {
                                $scope.BookApptShowArray = $scope.selectedAppointmentObject.PatientInsuranceList;
                            } else {
                                let temp = $filter('filter')($scope.selectedAppointmentObject.PatientInsuranceList, { 'IdentifierId': 1 }, true) || [];
                                if (temp.length > 0) {
                                    $scope.BookApptShowArray = temp;
                                }
                                else {
                                    $scope.BookApptShowArray = $scope.selectedAppointmentObject.PatientInsuranceList;
                                }
                            }
                        }

                        /* $scope.selectedAppointmentObject.OtherNotes = resp.data[0].Patient.OtherNotes || "";*/
                        if (resp.data[0].AppointmentDetails.length > 0) {
                            $scope.selectedAppointmentObject.OtherNotes = resp.data[0].AppointmentDetails[0].OtherNotes || "";
                            $scope.selectedAppointmentObject.OtherNotesCreatedBy = resp.data[0].AppointmentDetails[0].ModifiedBy || "";
                            $scope.selectedAppointmentObject.OtherNotesCreatedDt = resp.data[0].AppointmentDetails[0].ModifiedDt || "";
                        }
                        if ($scope.selectedAppointmentObject.OtherNotes != '') {
                            $scope.selectedAppointmentObject.IsOtherNotesEdit = true;
                        }

                        $scope.selectedAppointmentObject.EncounterDiagnosisType = resp.data[0].AppointmentDetails[0].EncounterDiagnosisType;
                        $scope.selectedAppointmentObject.EncounterDiagnosisId = resp.data[0].AppointmentDetails[0].EncounterDiagnosisId;
                        $scope.selectedAppointmentObject.DiagnosisObject = resp.data[0].AppointmentDetails[0].EncounterDiagnosisName;

                        /*$scope.selectedAppointmentObject.IsWaitingListAppointment = resp.data[0].AppointmentDetails[0].IsWaitingListAppointment;*/

                        //if ($scope.selectedAppointmentObject.AppointmentStatus == 'C') {
                        //    $scope.selectedAppointmentObject.AppointmentStatusId = 5;
                        //}
                        $scope.selectedAppointmentObject.IsNoShowAppointment = resp.data[0].AppointmentDetails[0].IsNoShowAppointment;
                        $scope.selectedAppointmentObject.VisitTypeId = resp.data[0].AppointmentDetails[0].AppointmentTypeId;
                        $scope.selectedAppointmentObject.VisitReasonId = resp.data[0].AppointmentDetails[0].VisitReasonId;
                        //     $scope.selectedAppointmentObject.IsInsuranceEligibilityVerify = maintiem.IsInsuranceEligibilityVerify;

                        //   $scope.selectedAppointmentObject.AppointmentTypeName = maintiem.AppointmentTypeName;

                        $scope.selectedAppointmentObject.VisitRemarks = resp.data[0].AppointmentDetails[0].VisitRemarks;
                        $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                        $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
                        $scope.RoomSearchObj.RoomTypeId = resp.data[0].AppointmentDetails[0].RoomTypeId || 0;
                        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
                        if (AppointmentDetailsCache.IsComingFrom == 'NoShow') {
                            $scope.selectedAppointmentObject.AppointmentDate = currentdate;
                            $scope.selectedAppointmentObject.IsAppointmentConfirmed = false;
                            $scope.selectedAppointmentObject.IsWalkInSlot = false;
                            $scope.selectedAppointmentObject.StartTime = "";
                            $scope.selectedAppointmentObject.patinet_appStarttime = "";
                            $scope.selectedAppointmentObject.IsWaitingListAppointment = false;

                        }


                        $scope.getUserBranchslots($scope.selectedAppointmentObject.DoctorID, "fromreschedule");
                        //$scope.restructureandpushnewupdatedobj($scope.selectedAppointmentObject.AppointmentID);


                        if ($scope.selectedAppointmentObject !== "" && $scope.selectedAppointmentObject !== undefined) {

                            if ($scope.clinicDoctorList.length > 0) {
                                $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (kitem, index) { return kitem.IsUserDisabled !== true }) || [];
                            }

                            var clinicdoctorfilter = $filter("filter")($scope.clinicDoctorList, { "DoctorID": $scope.selectedAppointmentObject.DoctorID }, true);
                            if (clinicdoctorfilter.length > 0) {
                                $scope.selectedAppointmentObject.DoctorID = $scope.selectedAppointmentObject.DoctorID;
                                $scope.selectedAppointmentObject.DocObj = clinicdoctorfilter[0];
                                $scope.selectedAppointmentObject.UserBranchId = clinicdoctorfilter[0].UserBranchId;

                                $scope.MultipleAppointmentList[index].DoctorID = $scope.selectedAppointmentObject.DoctorID;
                                $scope.MultipleAppointmentList[index].DocObj = clinicdoctorfilter[0];
                                $scope.MultipleAppointmentList[index].UserBranchId = clinicdoctorfilter[0].UserBranchId;
                            } else {
                                alertify.error("Doctor is disabled, please select another doctor");

                            }

                        };

                        var filteredSIngleDoctorArray = [];
                        if ($scope.RoleId === 1 || $scope.RoleId === 56) {
                            filteredSIngleDoctorArray = $filter("filter")($scope.clinicDoctorList, { "DoctorID": $scope.selectedAppointmentObject.DoctorID }, true);
                            if (filteredSIngleDoctorArray.length > 0) {
                                $scope.selectedAppointmentObject.DoctorID = filteredSIngleDoctorArray[0].DoctorID;
                                $scope.selectedAppointmentObject.DocObj = filteredSIngleDoctorArray[0];
                                $scope.selectedAppointmentObject.UserBranchId = filteredSIngleDoctorArray[0].UserBranchId;

                                $scope.MultipleAppointmentList[index].DoctorID = filteredSIngleDoctorArray[0].DoctorID;
                                $scope.MultipleAppointmentList[index].DocObj = filteredSIngleDoctorArray[0];
                                $scope.MultipleAppointmentList[index].UserBranchId = filteredSIngleDoctorArray[0].UserBranchId;
                            }
                        };

                     /*   $scope.MultipleAppointmentList.push($scope.AppointmentDetailsInfo);*/

                        $scope.GetVisitReasonNew("Get");

                        // var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
                        var appointmentDate = $scope.selectedAppointmentObject.AppointmentDate;
                        if ((appointmentDate == currentdate) && $scope.selectedAppointmentObject.IsWalkInSlot) {
                            $scope.selectedAppointmentObject.IsShowNoApptInd = true;
                        } else {
                            $scope.selectedAppointmentObject.IsShowNoApptInd = false;
                        }

                        if ($scope.selectedAppointmentObject.PaymentTypeId == 2) {
                            $scope.paymentTypeObj.PaymentTypeId = "2";
                            $scope.paymentTypeObj.IsPaymentTypeInd = false;
                        } else {
                            $scope.paymentTypeObj.PaymentTypeId = "1";
                            $scope.paymentTypeObj.IsPaymentTypeInd = true;
                        }

                        $scope.selectedAppointmentObject.SurgeryReferralDoctorId = resp.data[0].AppointmentDetails[0].SurgeryReferralDoctorId || 0;
                        if ($scope.selectedAppointmentObject.SurgeryReferralDoctorId !== 0) {
                            var filteredSurgeryDoctorArray = $filter("filter")($scope.clinicDoctorList, { "DoctorID": $scope.selectedAppointmentObject.SurgeryReferralDoctorId }, true);

                            $scope.selectedAppointmentObject.SurgeryReferralDoctorObj = filteredSurgeryDoctorArray[0];
                        }

                        //Get Visitreason based Docotrs
                        if ($scope.currentUrl === 'crm') {
                            $scope.GetVisitReasonbasedDoctors();
                        }

                        $timeout(function () {
                            $scope.selectedAppointmentObject.IsPatientSmsInd = $scope.PatientDetailsForRegisterObj.IsPatientSmsInd || false;
                            $scope.selectedAppointmentObject.SendPatientSms = $scope.PatientDetailsForRegisterObj.IsPatientSmsInd || false;
                            $scope.selectedAppointmentObject.IsPatientEmailInd = $scope.PatientDetailsForRegisterObj.IsPatientEmailInd || false;
                            $scope.selectedAppointmentObject.SendPatientEmail = $scope.PatientDetailsForRegisterObj.IsPatientEmailInd || false;
                            $scope.loadCalendar("pageload");

                            var t = new Date($scope.selectedAppointmentObject.AppointmentDate + ' ' + "00:00:00");
                            var startDate = t;
                            var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);
                            $scope.GetActiveDates(startDate, endDate);
                            //$scope.GetUserActiveDatesandSlotsInCalendar();

                            $scope.selectedAppointmentObject.VisitRemarks = resp.data[0].AppointmentDetails[0].VisitRemarks;
                            var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
                            console.log(appointmentDate);
                            var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
                            var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                            if (utcDate != undefined) {
                                $calendar.customchangeMonth(utcDate);
                            }

                            $scope.calendarObject.Year = t.getFullYear();

                        }, 500);

                    }

                    if (resp.data[0].AppointmentDetails[0].AppointmentTypeId == 4 || resp.data[0].AppointmentDetails[0].AppointmentTypeId == 14) {
                        AppointmentDetailsCache.SurgeryList = resp.data[0].AppointmentDetails[0].SurgeryList || [];
                        if (resp.data[0].AppointmentDetails[0].SurgeryList.length > 0) {
                            $scope.AdditionalSurgery = resp.data[0].AppointmentDetails[0].SurgeryList[0].AdditionalSurgery || [];
                        }
                    } else if (resp.data[0].AppointmentDetails[0].AppointmentTypeId == 7) {
                        AppointmentDetailsCache.SurgeryList = resp.data[0].AppointmentDetails[0].PreAdmSurgeryList || [];
                        if (resp.data[0].AppointmentDetails[0].PreAdmSurgeryList.length > 0) {
                            $scope.AdditionalSurgery = resp.data[0].AppointmentDetails[0].PreAdmSurgeryList[0].AdditionalSurgery || [];
                        }
                    }
                    if ($scope.AdditionalSurgery.length > 0) {
                        let IsDisiableButtonInd = false;
                        let TodayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                        let apptDate = angular.copy(AppointmentDetailsCache.AppointmentDate) || "";
                        if (apptDate < TodayDate && $scope.selectedAppointmentObject.IsCheckedIn == 2) {
                            IsDisiableButtonInd = true;
                        }
                        angular.forEach($scope.AdditionalSurgery, function (aitem) {
                            aitem.IsDisiableButtonInd = IsDisiableButtonInd || false;

                        });
                    }
                }
            });
        } else {
            $scope.SelectedNewSurgeries = [];
            $scope.AdditionalSurgery = [];
            angular.forEach($scope.MultipleAppointmentList, function (item) {
                item.IsEdit = false;
            });
            maintiem.IsEdit = true;
            if (maintiem.AppointmentID != 0) {
                var Sarray = maintiem.StartTime.split(":");
                var stime = Sarray[0] + ":" + Sarray[1];
                var date = moment(maintiem.AppointmentDate).format("YYYY-MM-DD");
                var earray = maintiem.EndTime.split(":");
                var etime = earray[0] + ":" + earray[1];
                var apptime = maintiem.AppointmentID;
                var VisitTypeId = maintiem.VisitTypeId || "";
                VisitTypeId = VisitTypeId != '' ? VisitTypeId : 0;
                var VisitRemarks = maintiem.VisitRemarks || "";

                let year = moment(date).format("YYYY");
                $scope.calendarObject.Year = parseInt(year);

                $scope.AppDate = [stime, etime, apptime, maintiem.VisitReasonName ? maintiem.VisitReasonName : "", maintiem.ReferralSourceId ? maintiem.ReferralSourceId : "", VisitTypeId, VisitRemarks];

                $scope.calenderDate = moment(date).format("DD-MMM-YYYY" + " " + stime);

                $scope.PageName = "reschedule";

                let surgeryList = [];
                if (maintiem.AppointmentTypeId == 7 || maintiem.AppointmentTypeId == 6) {
                    surgeryList = angular.copy(maintiem.PreAdmSurgeryList);

                } else if (maintiem.AppointmentTypeId == 4 || maintiem.AppointmentTypeId == 14) {
                    surgeryList = angular.copy(maintiem.SurgeryList);
                }

                AppointmentDetailsCache = {
                    "PageName": "reschedule",
                    "AppDate": $scope.AppDate,
                    "ispatientExistsval": true,
                    "calenderDate": $scope.calenderDate,
                    "AppointmentDate": maintiem.AppointmentDate,
                    "AppointmentId": maintiem.AppointmentID || null,
                    "PatientId": maintiem.PatientID || null,
                    'IsComingFrom': '',
                    "DoctorId": maintiem.DoctorID,
                    "StartTime": stime || "",
                    "EndTime": etime,
                    'type': 'op',
                    "SurgeryList": surgeryList || [],
                    "ASCDatesArray": [],
                };
            } else {
                AppointmentDetailsCache = {
                    "PageName": "book",
                    "AppDate": null,
                    "ispatientExistsval": true,
                    "calenderDate": null,
                    "AppointmentDate": null,
                    "AppointmentId": null,
                    "PatientId": null,
                    'IsComingFrom': '',
                    "DoctorId": null,
                    "StartTime": null,
                    "EndTime": null,
                    'type': 'op',
                    "SurgeryList": [],
                    "IsMultipleAppts": true,
                    "ASCDatesArray": datesarray || [],
                };

                let year = moment().format("YYYY");
                $scope.calendarObject.Year = parseInt(year);

                AppointmentDetailsCache.SurgeryList = surgeryarray || [];
            }

            $scope.selectedAppointmentObject = getnewAppoitnmentDoctorObj();
            $scope.selectedAppointmentObject.IsEdit = true;
            $scope.selectedAppointmentObject.AppointmentDate = maintiem.AppointmentDate;
            $scope.selectedAppointmentObject.AppointmentID = maintiem.AppointmentID;
            $scope.selectedAppointmentObject.ParentAppointmentId = maintiem.ParentAppointmentId;
            $scope.selectedAppointmentObject.RootAppointmentId = maintiem.RootAppointmentId;
            $scope.selectedAppointmentObject.OrganId = maintiem.OrganId;
            $scope.selectedAppointmentObject.NurseId = maintiem.NurseId;
            $scope.selectedAppointmentObject.AnesthesistId = maintiem.AnesthesistId;
            $scope.selectedAppointmentObject.AppointmentStatus = maintiem.AppointmentStatus;
            $scope.selectedAppointmentObject.CurrentTime = maintiem.CurrentTime;
            $scope.selectedAppointmentObject.StartTime = maintiem.StartTime || "";
            $scope.selectedAppointmentObject.EndTime = maintiem.EndTime || "";
            $scope.selectedAppointmentObject.AppointmentTypeId = maintiem.AppointmentTypeId;
            $scope.selectedAppointmentObject.VisitRemarks = maintiem.VisitRemarks;
            $scope.selectedAppointmentObject.BookingTypeId = maintiem.BookingTypeId;
            $scope.selectedAppointmentObject.selectedBookAppo = maintiem.selectedBookAppo;
            $scope.selectedAppointmentObject.IsWalkInSlot = maintiem.IsWalkInSlot;
            $scope.selectedAppointmentObject.IsAppointmentConfirmed = maintiem.IsAppointmentConfirmed;
            $scope.selectedAppointmentObject.IsWaitingListAppointment = maintiem.IsWaitingListAppointment;
            $scope.selectedAppointmentObject.IsNoShowAppointment = maintiem.IsNoShowAppointment;
            $scope.selectedAppointmentObject.IsPatientMissedAppointment = maintiem.IsPatientMissedAppointment;
            $scope.selectedAppointmentObject.IsInsuranceEligibilityVerify = maintiem.IsInsuranceEligibilityVerify;
            $scope.selectedAppointmentObject.patient_appEndTime = maintiem.patient_appEndTime;
            $scope.selectedAppointmentObject.patinet_appStarttime = maintiem.patinet_appStarttime;
            $scope.selectedAppointmentObject.searchvisitreasontxt = maintiem.searchvisitreasontxt;
            $scope.selectedAppointmentObject.AppointmentDate = maintiem.AppointmentDate;
            $scope.selectedAppointmentObject.DoctorID = maintiem.DoctorID;
            $scope.selectedAppointmentObject.RoomId = maintiem.RoomId;
            $scope.selectedAppointmentObject.RoomTypeId = maintiem.RoomTypeId;
            $scope.selectedAppointmentObject.DayCD = maintiem.DayCD;
            $scope.selectedAppointmentObject.VisitReasonName = maintiem.VisitReasonName;
            $scope.selectedAppointmentObject.ConsultationDt = maintiem.ConsultationDt;
            $scope.selectedAppointmentObject.PatientID = maintiem.PatientID;
            $scope.selectedAppointmentObject.PreviousAppointmentDate = maintiem.PreviousAppointmentDate;
            $scope.selectedAppointmentObject.SendDocSms = maintiem.SendDocSms;
            $scope.selectedAppointmentObject.SendDocEmail = maintiem.SendDocEmail;
            $scope.selectedAppointmentObject.SendPatientEmail = maintiem.SendPatientEmail;
            $scope.selectedAppointmentObject.SendPatientSms = maintiem.SendPatientSms;
            $scope.selectedAppointmentObject.PatientEmail = maintiem.PatientEmail;
            $scope.selectedAppointmentObject.PatientTypeId = maintiem.PatientTypeId;
            $scope.selectedAppointmentObject.IsCheckedIn = maintiem.IsCheckedIn;
            $scope.selectedAppointmentObject.PatientInsuranceList = maintiem.PatientInsuranceList;
            $scope.selectedAppointmentObject.AppointmentNotesList = maintiem.AppointmentNotesList;
            $scope.selectedAppointmentObject.AppointmentNotes = maintiem.AppointmentNotes;
            $scope.selectedAppointmentObject.HospitalEquipmentId = maintiem.HospitalEquipmentId;
            $scope.selectedAppointmentObject.PaymentTypeId = maintiem.PaymentTypeId;
            $scope.selectedAppointmentObject.IsConfirmedAppointment = maintiem.IsConfirmedAppointment;
            // $scope.selectedAppointmentObject.ConfirmationStatusId = maintiem.ConfirmationStatusId;
            $scope.selectedAppointmentObject.BookingTypeId = maintiem.BookingTypeId;
            $scope.selectedAppointmentObject.BookingStatusId = maintiem.BookingStatusId;
            $scope.selectedAppointmentObject.AppointmentStatusId = maintiem.AppointmentStatusId;
            $scope.selectedAppointmentObject.IsWaitingListAppointment = maintiem.IsWaitingListAppointment || false;
            $scope.selectedAppointmentObject.IsNoShowAppointment = maintiem.IsNoShowAppointment || false;
            $scope.selectedAppointmentObject.VisitTypeId = maintiem.VisitTypeId || null;
            $scope.selectedAppointmentObject.VisitReasonId = maintiem.VisitReasonId || null;
            $scope.selectedAppointmentObject.IsInsuranceEligibilityVerify = maintiem.IsInsuranceEligibilityVerify;
            $scope.selectedAppointmentObject.IsPatientSmsInd = maintiem.IsPatientSmsInd;
            $scope.selectedAppointmentObject.IsPatientEmailInd = maintiem.IsPatientEmailInd;
            $scope.selectedAppointmentObject.AppointmentTypeName = maintiem.AppointmentTypeName;
            $scope.selectedAppointmentObject.DisplayNumber = maintiem.DisplayNumber;
            $scope.selectedAppointmentObject.VisitRemarks = maintiem.VisitRemarks;
            $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
            $scope.selectedAppointmentObject.TimeSlotsEndArray = [];

            maintiem.DoctorID = maintiem.DoctorID || 0;
            if (maintiem.DoctorID != 0) {
                var clinicdoctorfilter = $filter("filter")($scope.clinicDoctorList, { "DoctorID": maintiem.DoctorID }, true);

                $scope.selectedAppointmentObject.DocObj = clinicdoctorfilter[0];

                $scope.selectedAppointmentObject.UserBranchId = clinicdoctorfilter[0].UserBranchId;
            } else {

                $scope.selectedAppointmentObject.DoctorID = maintiem.DocObj.DoctorID;
                $scope.selectedAppointmentObject.DocObj = maintiem.DocObj;
                $scope.selectedAppointmentObject.UserBranchId = maintiem.UserBranchId;
            }

            $scope.GetVisitReasonNew("Get");
            $scope.getUserBranchslots($scope.selectedAppointmentObject.DoctorID, "fromreschedule");

            // calculating duration in reschedule
            if ($scope.selectedAppointmentObject.StartTime != '') {
                let starttime1 = $filter('date')(new Date(), "yyyy-MM-dd") + " " + $scope.selectedAppointmentObject.StartTime;
                starttime1 = new Date(starttime1);
                let endtime1 = $filter('date')(new Date(), "yyyy-MM-dd") + " " + $scope.selectedAppointmentObject.EndTime;
                endtime1 = new Date(endtime1);
                function getMinutesBetweenDates(startDate, endDate) {
                    var diff = endDate.getTime() - startDate.getTime();
                    return (diff / 60000);
                }
                let minutes = getMinutesBetweenDates(starttime1, endtime1);
                $scope.ApptDurationObj.patinet_consultationTime = minutes.toString();
            }

            $timeout(function () {
                $scope.loadCalendar();
                var t = new Date($scope.selectedAppointmentObject.AppointmentDate);
                var startDate = t;
                var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);
                $scope.GetActiveDates(startDate, endDate);

                var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
                var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
                var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                if (utcDate != undefined) {
                    $calendar.customchangeMonth(utcDate);
                }
                FocusDateinCalendar();

            }, 500);
        }
    };







    $scope.restructureandpushnewupdatedobj = function (apptid) {



        angular.forEach($scope.MultipleAppointmentList, function (maintiem) {
            if (maintiem.IsEdit) {
                maintiem.IsEdit = false;
                maintiem.AppointmentID = apptid;
                maintiem.ParentAppointmentId = $scope.selectedAppointmentObject.ParentAppointmentId;
                maintiem.RootAppointmentId = $scope.selectedAppointmentObject.RootAppointmentId;
                maintiem.OrganId = $scope.selectedAppointmentObject.OrganId;
                maintiem.NurseId = $scope.selectedAppointmentObject.NurseId;
                maintiem.AnesthesistId = $scope.selectedAppointmentObject.AnesthesistId;
                maintiem.AppointmentStatus = $scope.selectedAppointmentObject.AppointmentStatus;
                maintiem.CurrentTime = $scope.selectedAppointmentObject.CurrentTime;
                maintiem.StartTime = $scope.selectedAppointmentObject.StartTime;
                maintiem.EndTime = $scope.selectedAppointmentObject.EndTime;
                maintiem.AppointmentTypeId = $scope.selectedAppointmentObject.AppointmentTypeId;
                maintiem.VisitRemarks = $scope.selectedAppointmentObject.VisitRemarks;
                //maintiem.BookingType = $scope.selectedAppointmentObject.BookingType;
                maintiem.selectedBookAppo = $scope.selectedAppointmentObject.selectedBookAppo;
                maintiem.IsWalkInSlot = $scope.selectedAppointmentObject.IsWalkInSlot;
                maintiem.IsAppointmentConfirmed = $scope.selectedAppointmentObject.IsAppointmentConfirmed;
                maintiem.IsWaitingListAppointment = $scope.selectedAppointmentObject.IsWaitingListAppointment;
                maintiem.IsNoShowAppointment = $scope.selectedAppointmentObject.IsNoShowAppointment;
                maintiem.IsPatientMissedAppointment = $scope.selectedAppointmentObject.IsPatientMissedAppointment;
                maintiem.patient_appEndTime = $scope.selectedAppointmentObject.patient_appEndTime;
                maintiem.patinet_appStarttime = $scope.selectedAppointmentObject.patinet_appStarttime;
                maintiem.searchvisitreasontxt = $scope.selectedAppointmentObject.searchvisitreasontxt;
                maintiem.AppointmentDate = $scope.selectedAppointmentObject.AppointmentDate;
                maintiem.DoctorID = $scope.selectedAppointmentObject.DoctorID;
                maintiem.RoomId = $scope.selectedAppointmentObject.RoomId;
                maintiem.RoomTypeId = $scope.selectedAppointmentObject.RoomTypeId;
                maintiem.DayCD = $scope.selectedAppointmentObject.DayCD;
                maintiem.VisitReasonName = $scope.selectedAppointmentObject.VisitReasonName;
                maintiem.ConsultationDt = $scope.selectedAppointmentObject.ConsultationDt;
                maintiem.PatientID = $scope.selectedAppointmentObject.PatientID;
                maintiem.PreviousAppointmentDate = $scope.selectedAppointmentObject.PreviousAppointmentDate;
                maintiem.SendDocSms = $scope.selectedAppointmentObject.SendDocSms;
                maintiem.SendDocEmail = $scope.selectedAppointmentObject.SendDocEmail;
                maintiem.SendPatientEmail = $scope.selectedAppointmentObject.SendPatientEmail;
                maintiem.SendPatientSms = $scope.selectedAppointmentObject.SendPatientSms;
                maintiem.PatientEmail = $scope.selectedAppointmentObject.PatientEmail;
                maintiem.PatientTypeId = $scope.selectedAppointmentObject.PatientTypeId;
                maintiem.BookingTypeId = $scope.selectedAppointmentObject.BookingTypeId;
                maintiem.IsCheckedIn = $scope.selectedAppointmentObject.IsCheckedIn;
                maintiem.PatientInsuranceList = $scope.selectedAppointmentObject.PatientInsuranceList;
                maintiem.AppointmentNotesList = $scope.selectedAppointmentObject.AppointmentNotesList;
                maintiem.AppointmentNotes = $scope.selectedAppointmentObject.AppointmentNotes;
                maintiem.HospitalEquipmentId = $scope.selectedAppointmentObject.HospitalEquipmentId;
                maintiem.PaymentTypeId = $scope.selectedAppointmentObject.PaymentTypeId;
                maintiem.IsConfirmedAppointment = $scope.selectedAppointmentObject.IsConfirmedAppointment;
                maintiem.BookingTypeId = $scope.selectedAppointmentObject.BookingTypeId;
                maintiem.BookingStatusId = $scope.selectedAppointmentObject.BookingStatusId;
                maintiem.AppointmentStatusId = $scope.selectedAppointmentObject.AppointmentStatusId;
                maintiem.IsWaitingListAppointment = $scope.selectedAppointmentObject.IsWaitingListAppointment || false;
                maintiem.IsNoShowAppointment = $scope.selectedAppointmentObject.IsNoShowAppointment || false;
                maintiem.VisitTypeId = $scope.selectedAppointmentObject.VisitTypeId;
                maintiem.VisitReasonId = $scope.selectedAppointmentObject.VisitReasonId;
                maintiem.IsPatientSmsInd = $scope.selectedAppointmentObject.IsPatientSmsInd;
                maintiem.IsPatientEmailInd = $scope.selectedAppointmentObject.IsPatientEmailInd;
                maintiem.AppointmentTypeName = $scope.selectedAppointmentObject.AppointmentTypeName;
                maintiem.DisplayNumber = $scope.selectedAppointmentObject.DisplayNumber;
                maintiem.VisitRemarks = $scope.selectedAppointmentObject.VisitRemarks;
                maintiem.TimeSlotsStartArray = [];
                maintiem.TimeSlotsEndArray = [];
                maintiem.DocObj = $scope.selectedAppointmentObject.DocObj
                maintiem.UserBranchId = $scope.selectedAppointmentObject.UserBranchId;

                if (maintiem.BookingTypeId == 2) {
                    maintiem.IsWaitingListAppointment = true;
                }
                else if (maintiem.BookingStatusId == 2) {
                    maintiem.IsAppointmentConfirmed = false;
                }
                else if (maintiem.BookingStatusId == 1) {
                    maintiem.IsAppointmentConfirmed = true;
                }
                else {

                }
                maintiem.TabName = "Appointment" + ($scope.MultipleAppointmentList.length);
            } else {
                maintiem.IsEdit = false;
            }
            maintiem.VisitReasons = angular.copy($scope.AllVisitReasons);
        });

        $scope.AppointmentDetailsInfo = GetAppointmentDetailsInfo();
        $scope.AppointmentDetailsInfo.VisitReasons = angular.copy($scope.AllVisitReasons);

        $scope.AppointmentRescheduleObj.StartTime = "";

        $scope.selectedAppointmentObject = getnewAppoitnmentDoctorObj();
        $scope.ApptDurationObj.patinet_consultationTime = "";


        if (selectedDoctorinAppList !== "" && selectedDoctorinAppList !== undefined) {
            var clinicdoctorfilter = $filter("filter")($scope.clinicDoctorList, { "DoctorID": selectedDoctorinAppList.DoctorID }, true);
            if (clinicdoctorfilter.length > 0) {
                $scope.selectedAppointmentObject.DoctorID = selectedDoctorinAppList.DoctorID;
                $scope.selectedAppointmentObject.DocObj = clinicdoctorfilter[0];
                $scope.selectedAppointmentObject.UserBranchId = clinicdoctorfilter[0].UserBranchId;

                $scope.AppointmentDetailsInfo.DoctorID = selectedDoctorinAppList.DoctorID;
                $scope.AppointmentDetailsInfo.DocObj = clinicdoctorfilter[0];
                $scope.AppointmentDetailsInfo.UserBranchId = clinicdoctorfilter[0].UserBranchId;
            }


        };

        var filteredSIngleDoctorArray = [];
        if ($scope.RoleId === 1 || $scope.RoleId === 56) {
            filteredSIngleDoctorArray = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorinfo.doctordata.User[0].DoctorID }, true);
            if (filteredSIngleDoctorArray.length > 0) {
                $scope.selectedAppointmentObject.DoctorID = filteredSIngleDoctorArray[0].DoctorID;
                $scope.selectedAppointmentObject.DocObj = filteredSIngleDoctorArray[0];
                $scope.selectedAppointmentObject.UserBranchId = filteredSIngleDoctorArray[0].UserBranchId;

                $scope.AppointmentDetailsInfo.DoctorID = filteredSIngleDoctorArray[0].DoctorID;
                $scope.AppointmentDetailsInfo.DocObj = filteredSIngleDoctorArray[0];
                $scope.AppointmentDetailsInfo.UserBranchId = filteredSIngleDoctorArray[0].UserBranchId;
            }
        };

        $scope.AppointmentDetailsInfo.TabName = "Appointment" + ($scope.MultipleAppointmentList.length + 1);

        $scope.MultipleAppointmentList.push($scope.AppointmentDetailsInfo);

        let d = new Date();
        $scope.calendarObject.Year = d.getFullYear();
        $scope.selectedAppointmentObject.AppointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");

        //$scope.GetVisitReasonNew();
        $timeout(function () {
            $scope.loadCalendar("pageload");
            if ($scope.selectedAppointmentObject != undefined) {
                $scope.selectedAppointmentObject.DoctorID = $scope.selectedAppointmentObject.DoctorID || 0;
                if ($scope.selectedAppointmentObject.DoctorID != 0) {
                    $scope.GetUserActiveDatesandSlotsInCalendar();
                }
            }
        }, 500);
    };

    if ($scope.pagename == 'book' && (AppointmentDetailsCache.IsComingFrom == 'PatientProfile' || AppointmentDetailsCache.IsComingFrom == 'AppointmentRequest')) {
        AppointmentDetailsCache.PatientId = AppointmentDetailsCache.PatientId || null;
        $scope.clinicDoctorList = [];
        $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
        angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
            if (Aitem.RoleId === 1 || Aitem.RoleId === 43 || Aitem.RoleId === 18) {
                $scope.clinicDoctorList.push(Aitem);

            }
        });
        $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });


        if (AppointmentDetailsCache.PatientId != null) {
            var obj = {
                "PatientId": AppointmentDetailsCache.PatientId
            }
            $scope.onSelectPatientFromSuggestion(obj);
        }
        $scope.MultipleAppointmentList = [];
        $scope.AppointmentDetailsInfo = GetAppointmentDetailsInfo();


        selectedDoctorinAppList.DoctorID = selectedDoctorinAppList.DoctorID || 0;
        if (selectedDoctorinAppList.DoctorID != 0) {
            var clinicdoctorfilter = $filter("filter")($scope.clinicDoctorList, { "DoctorID": selectedDoctorinAppList.DoctorID }, true);
            if (clinicdoctorfilter.length > 0) {
                $scope.selectedAppointmentObject.DoctorID = selectedDoctorinAppList.DoctorID;
                $scope.selectedAppointmentObject.DocObj = clinicdoctorfilter[0];
                $scope.selectedAppointmentObject.UserBranchId = clinicdoctorfilter[0].UserBranchId;
            }

        };

        if ($scope.selectedAppointmentObject !== "" && $scope.selectedAppointmentObject !== undefined) {
            var clinicdoctorfilter = $filter("filter")($scope.clinicDoctorList, { "DoctorID": $scope.selectedAppointmentObject.DoctorID }, true);
            if (clinicdoctorfilter.length > 0) {
                $scope.selectedAppointmentObject.DoctorID = $scope.selectedAppointmentObject.DoctorID;
                $scope.selectedAppointmentObject.DocObj = clinicdoctorfilter[0];
                $scope.selectedAppointmentObject.UserBranchId = clinicdoctorfilter[0].UserBranchId;

                $scope.AppointmentDetailsInfo.DoctorID = $scope.selectedAppointmentObject.DoctorID;
                $scope.AppointmentDetailsInfo.DocObj = clinicdoctorfilter[0];
                $scope.AppointmentDetailsInfo.UserBranchId = clinicdoctorfilter[0].UserBranchId;
            }

        };

        var filteredSIngleDoctorArray = [];
        if ($scope.RoleId === 1 || $scope.RoleId === 56) {
            filteredSIngleDoctorArray = $filter("filter")($scope.clinicDoctorList, { "DoctorID": $scope.selectedAppointmentObject.DoctorID }, true);
            if (filteredSIngleDoctorArray.length > 0) {
                $scope.selectedAppointmentObject.DoctorID = filteredSIngleDoctorArray[0].DoctorID;
                $scope.selectedAppointmentObject.DocObj = filteredSIngleDoctorArray[0];
                $scope.selectedAppointmentObject.UserBranchId = filteredSIngleDoctorArray[0].UserBranchId;

                $scope.AppointmentDetailsInfo.DoctorID = filteredSIngleDoctorArray[0].DoctorID;
                $scope.AppointmentDetailsInfo.DocObj = filteredSIngleDoctorArray[0];
                $scope.AppointmentDetailsInfo.UserBranchId = filteredSIngleDoctorArray[0].UserBranchId;
            }
        };


        $scope.MultipleAppointmentList.push($scope.AppointmentDetailsInfo);

        $scope.GetVisitReasonNew();
        $timeout(function () {
            $scope.loadCalendar("pageload");
        }, 500);
        var t = new Date($scope.selectedAppointmentObject.AppointmentDate);
        var startDate = t;
        var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);
        $scope.GetActiveDates(startDate, endDate);
        $scope.ApptMaintainfields.IsAppointmentScreen = false;
        $scope.ApptMaintainfields.IsPatientSelected = true;
        $scope.ApptMaintainfields.IsFormScreen = AppointmentDetailsCache.IsComingFrom || "";
    }

    if ($scope.pagename == 'reschedule') {

        AppointmentDetailsCache.AppointmentId = AppointmentDetailsCache.AppointmentId || null;
        AppointmentDetailsCache.PatientId = AppointmentDetailsCache.PatientId || null;
        $scope.clinicDoctorList = [];
        $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
        angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
            if (Aitem.RoleId === 1 || Aitem.RoleId === 43 || Aitem.RoleId === 18) {
                $scope.clinicDoctorList.push(Aitem);

            }
        });
        $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });

        var obj = {
            "DoctorID": 0,
            "SecondUserFullName": "Select Doctor",
            "Active": 'Y',
        };
        $scope.clinicDoctorList.unshift(obj);

        if (AppointmentDetailsCache.PatientId != null) {
            var obj = {
                "PatientId": AppointmentDetailsCache.PatientId
            }
            $scope.onSelectPatientFromSuggestion(obj);
        }
        if (AppointmentDetailsCache.AppointmentId != null) {
            eHnoteMainAppointmentService.getAdditionalApptDetailsById(AppointmentDetailsCache.AppointmentId).then(function (resp) {
                resp.data = resp.data || [];
                if (resp.data.length > 0) {
                    if (resp.data[0].AppointmentDetails.length > 0) {
                        $scope.MultipleAppointmentList = [];
                        $scope.AppointmentDetailsInfo = GetAppointmentDetailsInfo();
                        $scope.AppointmentDetailsInfo.IsEdit = true;
                        //$scope.MultipleAppointmentList.push($scope.AppointmentDetailsInfo);
                        $scope.selectedAppointmentObject = getnewAppoitnmentDoctorObj();




                        $scope.selectedAppointmentObject.IsEdit = true;
                        $scope.selectedAppointmentObject.AppointmentID = resp.data[0].AppointmentDetails[0].AppointmentId;
                        $scope.selectedAppointmentObject.ParentAppointmentId = resp.data[0].AppointmentDetails[0].ParentAppointmentId;
                        $scope.selectedAppointmentObject.RootAppointmentId = resp.data[0].AppointmentDetails[0].RootAppointmentId;
                        $scope.selectedAppointmentObject.OrganId = resp.data[0].AppointmentDetails[0].OrganId;
                        $scope.selectedAppointmentObject.NurseId = resp.data[0].AppointmentDetails[0].NurseId;
                        $scope.selectedAppointmentObject.AnesthesistId = resp.data[0].AppointmentDetails[0].AnesthesistId;
                        $scope.selectedAppointmentObject.AppointmentStatus = resp.data[0].AppointmentDetails[0].AppointmentStatus;


                        $scope.selectedAppointmentObject.ReasonTypeId = resp.data[0].AppointmentDetails[0].ReasonTypeId||null;
                        $scope.selectedAppointmentObject.PatientSeenOtherProvider = resp.data[0].AppointmentDetails[0].PatientSeenOtherProvider||'';
                        $scope.selectedAppointmentObject.OtherProviderDoctorName = resp.data[0].AppointmentDetails[0].OtherProviderDoctorName || '';
                        $scope.selectedAppointmentObject.IsReferral = resp.data[0].AppointmentDetails[0].IsReferral || false;
                        if ($scope.selectedAppointmentObject.OtherProviderDoctorName != '' && $scope.selectedAppointmentObject.IsReferral) {
                            $scope.selectedAppointmentObject.PCPDoctor = $scope.selectedAppointmentObject.OtherProviderDoctorName || '';
                        }
                        $scope.selectedAppointmentObject.OtherProviderVisitDate = resp.data[0].AppointmentDetails[0].OtherProviderVisitDate || null;
                        $scope.selectedAppointmentObject.OtherProviderVisitReason = resp.data[0].AppointmentDetails[0].OtherProviderVisitReason||'';
                        $scope.selectedAppointmentObject.OtherProviderDoctorID = resp.data[0].AppointmentDetails[0].OtherProviderDoctorID || 0;
                        if ($scope.selectedAppointmentObject.OtherProviderVisitDate != null) {
                            var todate = new Date();
                            var age = [];
                            var fromdate = new Date($scope.selectedAppointmentObject.OtherProviderVisitDate);
                            var y = [todate.getFullYear(), fromdate.getFullYear()];
                            var ydiff = y[0] - y[1];
                            var m = [todate.getMonth(), fromdate.getMonth()];
                            var mdiff = m[0] - m[1];
                            var d = [todate.getDate(), fromdate.getDate()];
                            var ddiff = d[0] - d[1];
                            if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
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


                            $scope.OtherVisitobj.ageinYears = ydiff.toString();
                            $scope.OtherVisitobj.ageinMonths = mdiff.toString();
                            if ($scope.OtherVisitobj.ageinMonths === "-1") {
                                $scope.OtherVisitobj.ageinMonths = "";
                            }
                            $scope.OtherVisitobj.ageinDays = ddiff.toString();
                            $scope.selectedAppointmentObject.OtherProviderVisitDate = $filter("date")($scope.selectedAppointmentObject.OtherProviderVisitDate, "MM-dd-yyyy")
                        }
                        if ($scope.selectedAppointmentObject.ReasonTypeId !=null) {
                            $scope.CRMReasonTypefilters();
                        }

                        // $scope.selectedAppointmentObject.CurrentTime = maintiem.CurrentTime;
                        var dayViewStart = moment(resp.data[0].AppointmentDetails[0].StartTime, 'HH:mm:');
                        var newStartTime1 = $filter('date')(new Date(dayViewStart), 'HH:mm');
                        $scope.selectedAppointmentObject.StartTime = newStartTime1;

                        var dayViewend = moment(resp.data[0].AppointmentDetails[0].EndTime, 'HH:mm:');
                        var newendTime1 = $filter('date')(new Date(dayViewend), 'HH:mm');
                        $scope.selectedAppointmentObject.EndTime = newendTime1;

                        $scope.selectedAppointmentObject.patinet_appStarttime = newStartTime1;
                        $scope.selectedAppointmentObject.patient_appEndTime = newendTime1;
                        //  $scope.selectedAppointmentObject.EndTime = resp.data[0].AppointmentDetails[0].EndTime;

                        // calculating duration in reschedule
                        let starttime1 = $filter('date')(new Date(), "yyyy-MM-dd") + " " + resp.data[0].AppointmentDetails[0].StartTime;
                        starttime1 = new Date(starttime1);
                        let endtime1 = $filter('date')(new Date(), "yyyy-MM-dd") + " " + resp.data[0].AppointmentDetails[0].EndTime;
                        endtime1 = new Date(endtime1);
                        function getMinutesBetweenDates(startDate, endDate) {
                            var diff = endDate.getTime() - startDate.getTime();
                            return (diff / 60000);
                        }
                        let minutes = getMinutesBetweenDates(starttime1, endtime1);
                        $scope.ApptDurationObj.patinet_consultationTime = minutes.toString();

                        $scope.selectedAppointmentObject.AppointmentTypeId = resp.data[0].AppointmentDetails[0].AppointmentTypeId;
                        $scope.selectedAppointmentObject.VisitRemarks = resp.data[0].AppointmentDetails[0].VisitRemarks;
                        $scope.selectedAppointmentObject.BookingTypeId = resp.data[0].AppointmentDetails[0].BookingTypeId;
                        $scope.selectedAppointmentObject.BookingStatusId = resp.data[0].AppointmentDetails[0].BookingStatusId;
                        $scope.selectedAppointmentObject.AppointmentStatusId = resp.data[0].AppointmentDetails[0].AppointmentStatusId;
                        $scope.selectedAppointmentObject.IsConfirmedAppointment = resp.data[0].AppointmentDetails[0].IsConfirmedAppointment;

                        if (resp.data[0].AppointmentDetails[0].BookingTypeId == 2) {
                            $scope.selectedAppointmentObject.IsWaitingListAppointment = true;
                        } else {
                            $scope.selectedAppointmentObject.IsWaitingListAppointment = false;

                        }

                        if ($scope.selectedAppointmentObject.BookingTypeId == 1) {
                            $scope.selectedAppointmentObject.IsWalkInSlot = true;
                        } else {
                            $scope.selectedAppointmentObject.IsWalkInSlot = false;
                        }

                        //$scope.selectedAppointmentObject.selectedBookAppo = maintiem.selectedBookAppo;
                        //if ($scope.selectedAppointmentObject.BookingTypeId == 1) {
                        //    $scope.selectedAppointmentObject.IsWalkInSlot = true;
                        //} else {
                        //    $scope.selectedAppointmentObject.IsWalkInSlot = false;
                        //}
                        //$scope.selectedAppointmentObject.IsAppointmentConfirmed = resp.data[0].AppointmentDetails[0].IsConfirmedAppointment;
                        if (resp.data[0].AppointmentDetails[0].BookingStatusId == 1) {
                            $scope.selectedAppointmentObject.IsAppointmentConfirmed = true;
                        } else {
                            $scope.selectedAppointmentObject.IsAppointmentConfirmed = false;
                        }

                        $scope.selectedAppointmentObject.IsWaitingListAppointment = resp.data[0].AppointmentDetails[0].IsWaitingListAppointment || false;
                        $scope.selectedAppointmentObject.IsNoShowAppointment = resp.data[0].AppointmentDetails[0].IsNoShowAppointment || false;
                        // $scope.RescheduleIsNoShowAppointment = resp.data[0].AppointmentDetails[0].IsNoShowAppointment || false;
                        //$scope.selectedAppointmentObject.IsPatientMissedAppointment = maintiem.IsPatientMissedAppointment;
                        //$scope.selectedAppointmentObject.IsInsuranceEligibilityVerify = maintiem.IsInsuranceEligibilityVerify;

                        //     $scope.selectedAppointmentObject.searchvisitreasontxt = maintiem.searchvisitreasontxt;
                        $scope.selectedAppointmentObject.AppointmentDate = resp.data[0].AppointmentDetails[0].AppointmentDate;
                        $scope.ApptMaintainfields.EditAppointmetDate = resp.data[0].AppointmentDetails[0].AppointmentDate;
                        $scope.ApptMaintainfields.EditAppointmentTime = resp.data[0].AppointmentDetails[0].ShortStartTime || "";
                        $scope.selectedAppointmentObject.DoctorID = resp.data[0].AppointmentDetails[0].DoctorID;
                        $scope.selectedAppointmentObject.UserBranchId = resp.data[0].AppointmentDetails[0].UserBranchId;

                        $scope.selectedAppointmentObject.RoomId = resp.data[0].AppointmentDetails[0].RoomId || null;
                        $scope.selectedAppointmentObject.RoomTypeId = resp.data[0].AppointmentDetails[0].RoomTypeId || null;
                        // $scope.selectedAppointmentObject.DayCD = maintiem.DayCD;
                        $scope.selectedAppointmentObject.VisitReasonName = resp.data[0].AppointmentDetails[0].VisitReasonName;
                        $scope.selectedAppointmentObject.ConsultationDt = resp.data[0].AppointmentDetails[0].AppointmentDate;
                        $scope.selectedAppointmentObject.PatientID = resp.data[0].Patient.PatientID;
                        $scope.selectedPatientObj.PatientId = resp.data[0].Patient.PatientID;
                        console.log($scope.selectedPatientObj.PatientId + "__PatientId");
                        //$scope.selectedAppointmentObject.PreviousAppointmentDate = maintiem.PreviousAppointmentDate;
                        //$scope.selectedAppointmentObject.SendDocSms = false;
                        //$scope.selectedAppointmentObject.SendDocEmail = maintiem.SendDocEmail;
                        //$scope.selectedAppointmentObject.SendPatientEmail = maintiem.SendPatientEmail;
                        //$scope.selectedAppointmentObject.SendPatientSms = maintiem.SendPatientSms;
                        //$scope.selectedAppointmentObject.PatientEmail = maintiem.PatientEmail;

                        $scope.selectedAppointmentObject.PatientTypeId = resp.data[0].AppointmentDetails[0].PatientTypeId;

                        $scope.selectedAppointmentObject.IsCheckedIn = resp.data[0].AppointmentDetails[0].CheckinStatusId;
                        $scope.selectedAppointmentObject.PatientInsuranceList = resp.data[0].PatientInsuranceList||[];
                        $scope.selectedAppointmentObject.AppointmentNotesList = resp.data[0].AppointmentNotes;
                        $scope.selectedAppointmentObject.AppointmentNotes = resp.data[0].AppointmentNotes;
                        // $scope.selectedAppointmentObject.HospitalEquipmentId = maintiem.HospitalEquipmentId;
                        $scope.selectedAppointmentObject.PaymentTypeId = resp.data[0].PaymentTypeId;
                        
                        // for insurance 
                        if ($scope.selectedAppointmentObject.PatientInsuranceList.length>0) {
                            if ($scope.selectedAppointmentObject.PatientInsuranceList.length == 1) {
                                $scope.BookApptShowArray = $scope.selectedAppointmentObject.PatientInsuranceList;
                            } else {
                                let temp = $filter('filter')($scope.selectedAppointmentObject.PatientInsuranceList, { 'IdentifierId': 1 }, true)||[];
                                if (temp.length > 0) {
                                    $scope.BookApptShowArray = temp;
                                }
                                else {
                                    $scope.BookApptShowArray = $scope.selectedAppointmentObject.PatientInsuranceList;
                                }
                            }
                        }
                        
                        /* $scope.selectedAppointmentObject.OtherNotes = resp.data[0].Patient.OtherNotes || "";*/
                        if (resp.data[0].AppointmentDetails.length > 0) {
                            $scope.selectedAppointmentObject.OtherNotes = resp.data[0].AppointmentDetails[0].OtherNotes || "";
                            $scope.selectedAppointmentObject.OtherNotesCreatedBy = resp.data[0].AppointmentDetails[0].ModifiedBy || "";
                            $scope.selectedAppointmentObject.OtherNotesCreatedDt = resp.data[0].AppointmentDetails[0].ModifiedDt || "";
                        }
                        if ($scope.selectedAppointmentObject.OtherNotes != '') {
                            $scope.selectedAppointmentObject.IsOtherNotesEdit = true;
                        }

                        $scope.selectedAppointmentObject.EncounterDiagnosisType = resp.data[0].AppointmentDetails[0].EncounterDiagnosisType;
                        $scope.selectedAppointmentObject.EncounterDiagnosisId = resp.data[0].AppointmentDetails[0].EncounterDiagnosisId;
                        $scope.selectedAppointmentObject.DiagnosisObject = resp.data[0].AppointmentDetails[0].EncounterDiagnosisName;

                        /*$scope.selectedAppointmentObject.IsWaitingListAppointment = resp.data[0].AppointmentDetails[0].IsWaitingListAppointment;*/

                        //if ($scope.selectedAppointmentObject.AppointmentStatus == 'C') {
                        //    $scope.selectedAppointmentObject.AppointmentStatusId = 5;
                        //}
                        $scope.selectedAppointmentObject.IsNoShowAppointment = resp.data[0].AppointmentDetails[0].IsNoShowAppointment;
                        $scope.selectedAppointmentObject.VisitTypeId = resp.data[0].AppointmentDetails[0].AppointmentTypeId;
                        $scope.selectedAppointmentObject.VisitReasonId = resp.data[0].AppointmentDetails[0].VisitReasonId;
                        //     $scope.selectedAppointmentObject.IsInsuranceEligibilityVerify = maintiem.IsInsuranceEligibilityVerify;

                        //   $scope.selectedAppointmentObject.AppointmentTypeName = maintiem.AppointmentTypeName;

                        $scope.selectedAppointmentObject.VisitRemarks = resp.data[0].AppointmentDetails[0].VisitRemarks;
                        $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
                        $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
                        $scope.RoomSearchObj.RoomTypeId = resp.data[0].AppointmentDetails[0].RoomTypeId || 0;
                        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
                        if (AppointmentDetailsCache.IsComingFrom == 'NoShow') {
                            $scope.selectedAppointmentObject.AppointmentDate = currentdate;
                            $scope.selectedAppointmentObject.IsAppointmentConfirmed = false;
                            $scope.selectedAppointmentObject.IsWalkInSlot = false;
                            $scope.selectedAppointmentObject.StartTime = "";
                            $scope.selectedAppointmentObject.patinet_appStarttime = "";
                            $scope.selectedAppointmentObject.IsWaitingListAppointment = false;

                        }


                        $scope.getUserBranchslots($scope.selectedAppointmentObject.DoctorID, "fromreschedule");
                        //$scope.restructureandpushnewupdatedobj($scope.selectedAppointmentObject.AppointmentID);


                        if ($scope.selectedAppointmentObject !== "" && $scope.selectedAppointmentObject !== undefined) {

                            if ($scope.clinicDoctorList.length > 0) {
                                $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (kitem, index) { return kitem.IsUserDisabled !== true }) || [];
                            }

                            var clinicdoctorfilter = $filter("filter")($scope.clinicDoctorList, { "DoctorID": $scope.selectedAppointmentObject.DoctorID }, true);
                            if (clinicdoctorfilter.length > 0) {
                                $scope.selectedAppointmentObject.DoctorID = $scope.selectedAppointmentObject.DoctorID;
                                $scope.selectedAppointmentObject.DocObj = clinicdoctorfilter[0];
                                $scope.selectedAppointmentObject.UserBranchId = clinicdoctorfilter[0].UserBranchId;

                                $scope.AppointmentDetailsInfo.DoctorID = $scope.selectedAppointmentObject.DoctorID;
                                $scope.AppointmentDetailsInfo.DocObj = clinicdoctorfilter[0];
                                $scope.AppointmentDetailsInfo.UserBranchId = clinicdoctorfilter[0].UserBranchId;
                            } else {
                                alertify.error("Doctor is disabled, please select another doctor");

                            }

                        };

                        var filteredSIngleDoctorArray = [];
                        if ($scope.RoleId === 1 || $scope.RoleId === 56) {
                            filteredSIngleDoctorArray = $filter("filter")($scope.clinicDoctorList, { "DoctorID": $scope.selectedAppointmentObject.DoctorID }, true);
                            if (filteredSIngleDoctorArray.length > 0) {
                                $scope.selectedAppointmentObject.DoctorID = filteredSIngleDoctorArray[0].DoctorID;
                                $scope.selectedAppointmentObject.DocObj = filteredSIngleDoctorArray[0];
                                $scope.selectedAppointmentObject.UserBranchId = filteredSIngleDoctorArray[0].UserBranchId;

                                $scope.AppointmentDetailsInfo.DoctorID = filteredSIngleDoctorArray[0].DoctorID;
                                $scope.AppointmentDetailsInfo.DocObj = filteredSIngleDoctorArray[0];
                                $scope.AppointmentDetailsInfo.UserBranchId = filteredSIngleDoctorArray[0].UserBranchId;
                            }
                        };

                        $scope.MultipleAppointmentList.push($scope.AppointmentDetailsInfo);

                        $scope.GetVisitReasonNew("Get");

                        // var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
                        var appointmentDate = $scope.selectedAppointmentObject.AppointmentDate;
                        if ((appointmentDate == currentdate) && $scope.selectedAppointmentObject.IsWalkInSlot) {
                            $scope.selectedAppointmentObject.IsShowNoApptInd = true;
                        } else {
                            $scope.selectedAppointmentObject.IsShowNoApptInd = false;
                        }

                        if ($scope.selectedAppointmentObject.PaymentTypeId == 2) {
                            $scope.paymentTypeObj.PaymentTypeId = "2";
                            $scope.paymentTypeObj.IsPaymentTypeInd = false;
                        } else {
                            $scope.paymentTypeObj.PaymentTypeId = "1";
                            $scope.paymentTypeObj.IsPaymentTypeInd = true;
                        }

                        $scope.selectedAppointmentObject.SurgeryReferralDoctorId = resp.data[0].AppointmentDetails[0].SurgeryReferralDoctorId || 0;
                        if ($scope.selectedAppointmentObject.SurgeryReferralDoctorId !== 0) {
                            var filteredSurgeryDoctorArray = $filter("filter")($scope.clinicDoctorList, { "DoctorID": $scope.selectedAppointmentObject.SurgeryReferralDoctorId }, true);

                            $scope.selectedAppointmentObject.SurgeryReferralDoctorObj = filteredSurgeryDoctorArray[0];
                        }

                        //Get Visitreason based Docotrs
                        if ($scope.currentUrl === 'crm') {
                            $scope.GetVisitReasonbasedDoctors();
                        }

                        $timeout(function () {
                            $scope.selectedAppointmentObject.IsPatientSmsInd = $scope.PatientDetailsForRegisterObj.IsPatientSmsInd || false;
                            $scope.selectedAppointmentObject.SendPatientSms = $scope.PatientDetailsForRegisterObj.IsPatientSmsInd || false;
                            $scope.selectedAppointmentObject.IsPatientEmailInd = $scope.PatientDetailsForRegisterObj.IsPatientEmailInd || false;
                            $scope.selectedAppointmentObject.SendPatientEmail = $scope.PatientDetailsForRegisterObj.IsPatientEmailInd || false;
                            $scope.loadCalendar("pageload");

                            var t = new Date($scope.selectedAppointmentObject.AppointmentDate + ' ' + "00:00:00");
                            var startDate = t;
                            var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);
                            $scope.GetActiveDates(startDate, endDate);
                            //$scope.GetUserActiveDatesandSlotsInCalendar();

                            $scope.selectedAppointmentObject.VisitRemarks = resp.data[0].AppointmentDetails[0].VisitRemarks;
                            var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
                            console.log(appointmentDate);
                            var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
                            var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                            if (utcDate != undefined) {
                                $calendar.customchangeMonth(utcDate);
                            }

                            $scope.calendarObject.Year = t.getFullYear();

                        }, 500);

                    }

                    if (resp.data[0].AppointmentDetails[0].AppointmentTypeId == 4 || resp.data[0].AppointmentDetails[0].AppointmentTypeId == 14) {
                        AppointmentDetailsCache.SurgeryList = resp.data[0].AppointmentDetails[0].SurgeryList || [];
                        AppointmentDetailsCache.StatusId = '';
                        AppointmentDetailsCache.StatusId = resp.data[0].AppointmentDetails[0].SurgeryList[0].StatusId || '';
                        if (resp.data[0].AppointmentDetails[0].SurgeryList.length>0) {
                            $scope.AdditionalSurgery = resp.data[0].AppointmentDetails[0].SurgeryList[0].AdditionalSurgery || [];
                            $scope.SelectedNewSurgeries = [];
                            angular.forEach(resp.data[0].AppointmentDetails[0].SurgeryList, function (Aitem) {
                                let param = {
                                    "SurgeryListId": Aitem.SurgeryListId || 0,
                                    "OrganId": Aitem.OrganId || null,
                                    "OrgSurgeryId": Aitem.OrgSurgeryId || null,
                                    "PatientSurgeryId": Aitem.PatientSurgeryId || 0,
                                    "SurgeryId": Aitem.SurgeryId || "",
                                    "SurgeryListId": Aitem.SurgeryListId || null,
                                    "DescriptionId": Aitem.SurgeryId || "",
                                    "Description": Aitem.SurgeryName || "",
                                    "OrgDescriptionId": Aitem.OrgSurgeryId || 0,
                                    "Remarks": "",
                                    "DeleteInd": "N",
                                    "AdditionalSurgery": Aitem.AdditionalSurgery || [],
                                }
                                $scope.SelectedNewSurgeries.push(param);
                            });
                        }
                    } else if (resp.data[0].AppointmentDetails[0].AppointmentTypeId == 7) {
                        AppointmentDetailsCache.SurgeryList = resp.data[0].AppointmentDetails[0].PreAdmSurgeryList || [];
                        AppointmentDetailsCache.StatusId = '';
                        AppointmentDetailsCache.StatusId = resp.data[0].AppointmentDetails[0].PreAdmSurgeryList[0].StatusId || '';
                        if (resp.data[0].AppointmentDetails[0].PreAdmSurgeryList.length > 0) {
                            $scope.AdditionalSurgery = resp.data[0].AppointmentDetails[0].PreAdmSurgeryList[0].AdditionalSurgery || [];
                            $scope.SelectedNewSurgeries = [];
                            angular.forEach(resp.data[0].AppointmentDetails[0].PreAdmSurgeryList, function (Aitem) {
                                let param = {
                                    "SurgeryListId": Aitem.SurgeryListId || 0,
                                    "OrganId": Aitem.OrganId || null,
                                    "OrgSurgeryId": Aitem.OrgSurgeryId || null,
                                    "PatientSurgeryId": Aitem.PatientSurgeryId || 0,
                                    "SurgeryId": Aitem.SurgeryId || "",
                                    "SurgeryListId": Aitem.SurgeryListId || null,
                                    "DescriptionId": Aitem.SurgeryId || "",
                                    "Description": Aitem.SurgeryName || "",
                                    "OrgDescriptionId": Aitem.OrgSurgeryId || 0,
                                    "Remarks": "",
                                    "DeleteInd": "N",
                                    "AdditionalSurgery": Aitem.AdditionalSurgery || [],
                                }
                                $scope.SelectedNewSurgeries.push(param);
                            });
                        }
                    }
                    if ($scope.AdditionalSurgery.length > 0) {
                        let IsDisiableButtonInd = false;
                        let TodayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                        let apptDate = angular.copy(AppointmentDetailsCache.AppointmentDate) || "";
                        if (apptDate < TodayDate && $scope.selectedAppointmentObject.IsCheckedIn == 2) {
                            IsDisiableButtonInd = true;
                        }
                        angular.forEach($scope.AdditionalSurgery, function (aitem) {
                            aitem.IsDisiableButtonInd = IsDisiableButtonInd || false;

                        });
                    }
                }
            });
        }





        $scope.ApptMaintainfields.IsAppointmentScreen = true;
        $scope.ApptMaintainfields.IsPatientSelected = true;

    };

    $scope.ChangeHospitalEquipment = function (item) {
        item = item || "";
        $scope.PatientDetailsForRegisterObj.HospitalEquipmentId = item || "";
    };

    $scope.Durationchange = function (duration) {
        $scope.ApptDurationObj.patinet_consultationTime = duration;
    };

    $scope.TagPatientObj = {
        "SelectTag": "Select Tag Patient",
        "PatientTag": "",
        "AllPatientTagsCheck": false,
    };

    $scope.checkAllPatientTags = function (val) {
        if (val) {
            angular.forEach($scope.HospitalEquipmentList, function (item) {
                item.IsChecked = true;
            });

            $scope.TagPatientObj.SelectTag = 'All';
        }
        else {
            angular.forEach($scope.HospitalEquipmentList, function (item) {
                item.IsChecked = false;
            });

            $scope.TagPatientObj.SelectTag = 'Select Tag Patient';
        }

    };

    $scope.PatientTagToggle = function (item) {
        var checkedArray = _.where($scope.HospitalEquipmentList, { IsChecked: true });
        $scope.TagPatientObj.AllPatientTagsCheck = checkedArray.length > 0 && $scope.HospitalEquipmentList.length === checkedArray.length ? true : false;
        if ($scope.TagPatientObj.AllPatientTagsCheck) {
            $scope.TagPatientObj.SelectTag = 'All';
        }

        if (!$scope.TagPatientObj.AllPatientTagsCheck && checkedArray.length > 0) {
            $scope.TagPatientObj.SelectTag = 'Selected';
        }
        if (checkedArray.length > 4) {
            item.IsChecked = false;
            alertify.error("Patient Tag Limit is Reached");
            return false;
        }
    };

    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }

    $scope.type = $scope.type || '';
    if ($scope.type === 'op') {
        //$scope.selectedPatientObj.FollwuppatSearchType = 3; // old mr no removed
        $scope.selectedPatientObj.FollwuppatSearchType = 1;
    } else {
        $scope.selectedPatientObj.FollwuppatSearchType = 2;
    }

    $scope.ApptMaintainfields.IsFormScreen = $scope.ApptMaintainfields.IsFormScreen || '';
    if (($scope.type === 'op' || $scope.type === 'ASC') && $scope.ApptMaintainfields.IsFormScreen == "PatientProfile") {
        $scope.ApptMaintainfields.IsPatientSelected = true;
        $scope.ApptMaintainfields.IsAppointmentScreen = true;
        $scope.ApptMaintainfields.IsFormScreen = AppointmentDetailsCache.IsComingFrom || "";
    }

    //Crm Changes for visit reason and doctor list 
    $scope.GetVisitReasonbasedDoctors = function () {
        var params = {
            "HospitalId": $scope.HospitalId,
            "VisitReasonId": $scope.selectedAppointmentObject.VisitReasonId || 0
        };
        eHnoteMainAppointmentService.GetDoctorsListByVisitReasonId(params).then(function (resp) {
            console.log(resp);
            if (resp.data.status == "Success") {
                if (resp.data.rows.length > 0 || resp.data.OnlyScheduledUsers.length > 0) {
                    $scope.clinicDoctorList = [];
                    //  $scope.clinicDoctorList = angular.copy(resp.data.rows);
                    $scope.clinicDoctorList = resp.data.rows.concat(resp.data.OnlyScheduledUsers);
                    if ($scope.clinicDoctorList.length > 0) {
                        $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                    }

                } else {
                    $scope.clinicDoctorList = [];
                }
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Data Failed");
        });
    }

    $scope.continueReasonType = function () {
        var params = {
            "HospitalId": $scope.HospitalId,
            "VisitReasonId": $scope.selectedAppointmentObject.VisitReasonId || 0
        };
        eHnoteMainAppointmentService.GetDoctorsListByVisitReasonId(params).then(function (resp) {
            console.log(resp);
            if (resp.data.status == "Success") {
                if (resp.data.rows.length > 0 || resp.data.OnlyScheduledUsers.length > 0) {
                    $scope.clinicDoctorList = [];
                 /*   $scope.clinicDoctorList = angular.copy(resp.data.rows);*/
                    $scope.clinicDoctorList = resp.data.rows.concat(resp.data.OnlyScheduledUsers);
                    //var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
                    if ($scope.clinicDoctorList.length > 0) {
                        $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });

                        $scope.selectedAppointmentObject.DoctorID = $scope.clinicDoctorList[0].DoctorID;
                        $scope.selectedAppointmentObject.UserBranchId = $scope.clinicDoctorList[0].UserBranchId;
                        $scope.selectedAppointmentObject.DocObj = $scope.clinicDoctorList[0] || '';
                        if ($scope.clinicDoctorList[0].LatestDoctorSlot.length > 0) {
                            $scope.selectedAppointmentObject.AppointmentDate = $scope.clinicDoctorList[0].LatestDoctorSlot[0].SlotDate;
                        } else {
                            $scope.selectedAppointmentObject.AppointmentDate = $filter("date")(new Date(), "MM-dd-yyyy");
                        }

                        if ($scope.ApptLastVisitDuration.length > 0) {
                            var filterDoctorList = $filter('filter')($scope.clinicDoctorList, { 'DoctorID': $scope.ApptLastVisitDuration[0].DoctorID }, true) || [];
                            if (filterDoctorList.length > 0) {

                                $scope.selectedAppointmentObject.DoctorID = filterDoctorList[0].DoctorID;
                                $scope.selectedAppointmentObject.UserBranchId = filterDoctorList[0].UserBranchId;
                                $scope.selectedAppointmentObject.DocObj = filterDoctorList[0] || '';
                                if (filterDoctorList[0].LatestDoctorSlot.length > 0) {
                                    $scope.selectedAppointmentObject.AppointmentDate = filterDoctorList[0].LatestDoctorSlot[0].SlotDate;
                                }

                            } else {
                                $scope.selectedAppointmentObject.DocObj = '';
                            }
                        }

                        $scope.getUserBranchslots($scope.selectedAppointmentObject.DoctorID);

                        let check1 = typeof $scope.selectedAppointmentObject.AppointmentDate;
                        if (check1 !== "string") {
                            var t = $scope.selectedAppointmentObject.AppointmentDate;
                            var startDate = t;
                            var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);
                        } else {
                            var t = new Date($scope.selectedAppointmentObject.AppointmentDate + ' ' + "00:00:00");
                            var startDate = t;
                            var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);
                        }

                        $scope.GetActiveDates(startDate, endDate);

                        var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
                        var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
                        var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                        if (utcDate != undefined) {
                            $calendar.customchangeMonth(utcDate);
                        }
                    }
                    else {
                        $scope.selectedAppointmentObject.DocObj = '';
                        $scope.selectedAppointmentObject.DoctorID = null;
                    }

                } else {
                    $scope.clinicDoctorList = [];
                }
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Data Failed");
        });
    }

    $scope.OtherVisitobj = {
        "ageinYears": 0,
        "ageinMonths": 0,
        "ageinDays": 0,

    }
    $scope.ChangeOtherVisitDate = function (Tmpfromdate) {

        var todate = new Date();
        var age = [];
        var fromdate = new Date(Tmpfromdate);
        var y = [todate.getFullYear(), fromdate.getFullYear()];
        var ydiff = y[0] - y[1];
        var m = [todate.getMonth(), fromdate.getMonth()];
        var mdiff = m[0] - m[1];
        var d = [todate.getDate(), fromdate.getDate()];
        var ddiff = d[0] - d[1];
        if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
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


        $scope.OtherVisitobj.ageinYears = ydiff.toString();
        $scope.OtherVisitobj.ageinMonths = mdiff.toString();
        if ($scope.OtherVisitobj.ageinMonths === "-1") {
            $scope.OtherVisitobj.ageinMonths = "";
        }
        $scope.OtherVisitobj.ageinDays = ddiff.toString();
    };

    $scope.OnchangeReasonType = function (item) {
        let ApptDurationinYears = null;
        let ApptDurationinMonths = null;
        let ApptDurationinDays = null;
        let AppointmentLastVisit = false
        if ($scope.ApptLastVisitDuration.length > 0) {
            AppointmentLastVisit = true;
            ApptDurationinYears = parseInt($scope.ApptLastVisitDuration[0].ApptDurationinYears);
            ApptDurationinMonths = parseInt($scope.ApptLastVisitDuration[0].ApptDurationinMonths);
            ApptDurationinDays = parseInt($scope.ApptLastVisitDuration[0].ApptDurationinDays);
        }
        $scope.selectedAppointmentObject.ReasonTypeId = item.ReasonTypeId;
        $scope.selectedAppointmentObject.TransferToCall = false;
        var obj = {
            "HospitalId": $scope.HospitalId,
            "ReasonTypeId": item.ReasonTypeId,
            "ApptDurationinYears": ApptDurationinYears,
            "ApptDurationinMonths": ApptDurationinMonths,
            "ApptDurationinDays": ApptDurationinDays,
            "PatientAgeInYears": $scope.selectedPatientObj.AgeInYears,
            "PatientId": $scope.selectedPatientObj.PatientId,
            "AppointmentLastVisit": AppointmentLastVisit
        }

        eHnotePatientVisitReasonServices.GetReasonTypesByDuration(obj).then(function (resp) {
            if (resp.data.rows.length > 0) {

                var filterTransferToCall = $filter('filter')(resp.data.rows, { 'TransferToCall': true }, true) || [];
                if (filterTransferToCall.length > 0) {
                    $scope.selectedAppointmentObject.ReasonTypeId = filterTransferToCall[0].ReasonTypeId;
                    $scope.selectedAppointmentObject.TransferToCall = true;
                    return false;
                }

                let selectedreason = resp.data.rows[0];
                $scope.selectedAppointmentObject.TransferToCall = false;
                $scope.selectedAppointmentObject.ReasonTypeId = selectedreason.ReasonTypeId;
                $scope.selectedAppointmentObject.VisitTypeId = selectedreason.AppointmentTypeId;
                $scope.selectedAppointmentObject.VisitReasonId = selectedreason.VisitReasonId;
                $scope.selectedAppointmentObject.VisitReasonName = selectedreason.VisitReasonName;
                $scope.selectedAppointmentObject.AppointmentTypeId = selectedreason.AppointmentTypeId.toString();
                if ($scope.AllVisitReasons.length > 0) {
                    var filtervisit = $filter('filter')($scope.AllVisitReasons, { 'ReasonId': selectedreason.VisitReasonId }, true) || [];
                    if (filtervisit.length > 0) {
                        $scope.selectedAppointmentObject.VisitReasonObj = filtervisit[0];
                    }
                }
                $scope.continueReasonType();
            } else {
                $scope.selectedAppointmentObject.VisitReasonObj = "";
                $scope.selectedAppointmentObject.VisitReasonId = 0;
                alertify.error("No Visit reasons mapped for this reason type. Please unblock and select one! ");
                return false;
            }

        });



        //if (item.ReasonTypeId != null) {
        //    var filterReason = $filter('filter')($scope.AllReasonTypesList, { 'ReasonTypeId': item.ReasonTypeId }, true) || [];
        //    if (filterReason.length > 0) {
        //        $scope.selectedAppointmentObject.ReasonTypeId = filterReason[0].ReasonTypeId;
        //        $scope.selectedAppointmentObject.VisitTypeId = filterReason[0].AppointmentTypeId;
        //        $scope.selectedAppointmentObject.VisitReasonId = filterReason[0].VisitReasonId;
        //        $scope.selectedAppointmentObject.VisitReasonName = filterReason[0].VisitReasonName;
        //        $scope.selectedAppointmentObject.AppointmentTypeId = filterReason[0].AppointmentTypeId.toString();
        //        if ($scope.AllVisitReasons.length > 0) {
        //            var filtervisit = $filter('filter')($scope.AllVisitReasons, { 'ReasonId': filterReason[0].VisitReasonId }, true) || [];
        //            if (filtervisit.length > 0) {
        //                $scope.selectedAppointmentObject.VisitReasonObj = filtervisit[0];
        //            }
        //        }

        //        //let ApptDurationinYears = parseInt($scope.ApptLastVisitDuration[0].ApptDurationinYears);
        //        //angular.forEach(filterReason, function (item) {
        //        //    item.DurationFrom = parseInt(item.DurationFrom);
        //        //    item.DurationTo = parseInt(item.DurationTo);
        //        //    if (item.DurationFrom == 0 && (item.DurationTo < ApptDurationinYears || item.DurationTo == ApptDurationinYears)) {
        //        //        $scope.selectedAppointmentObject.ReasonTypeId = item.ReasonTypeId;
        //        //        $scope.selectedAppointmentObject.VisitTypeId = item.AppointmentTypeId;
        //        //        $scope.selectedAppointmentObject.VisitReasonId = item.VisitReasonId;
        //        //        $scope.selectedAppointmentObject.VisitReasonName = item.VisitReasonName;
        //        //        $scope.selectedAppointmentObject.AppointmentTypeId = item.AppointmentTypeId.toString();
        //        //        if ($scope.AllVisitReasons.length > 0) {
        //        //            var filtervisit = $filter('filter')($scope.AllVisitReasons, { 'ReasonId': item.VisitReasonId }, true) || [];
        //        //            if (filtervisit.length > 0) {
        //        //                $scope.selectedAppointmentObject.VisitReasonObj = filtervisit[0];
        //        //            }
        //        //        }
        //        //    }
        //        //    if ((item.DurationFrom > ApptDurationinYears) && (item.DurationTo < ApptDurationinYears)) {
        //        //        $scope.selectedAppointmentObject.ReasonTypeId = item.ReasonTypeId;
        //        //        $scope.selectedAppointmentObject.VisitTypeId = item.AppointmentTypeId;
        //        //        $scope.selectedAppointmentObject.VisitReasonId = item.VisitReasonId;
        //        //        $scope.selectedAppointmentObject.VisitReasonName = item.VisitReasonName;
        //        //        $scope.selectedAppointmentObject.AppointmentTypeId = item.AppointmentTypeId.toString();
        //        //        if ($scope.AllVisitReasons.length > 0) {
        //        //            var filtervisit = $filter('filter')($scope.AllVisitReasons, { 'ReasonId': item.VisitReasonId }, true) || [];
        //        //            if (filtervisit.length > 0) {
        //        //                $scope.selectedAppointmentObject.VisitReasonObj = filtervisit[0];
        //        //            }
        //        //        }
        //        //    }
        //        //});

        //        if (filterReason[0].TransferToCall) {
        //            return false;
        //        }


        //    } else {
        //        alertify.error("Visit Reason not mapping ");
        //        return false;
        //    }

        //}





    }



    $scope.onSelectVisitReasonforCrm = function (item, Mainitem) {
        item = item || "";
        if (item.ReasonId !== "") {
            $scope.selectedAppointmentObject.VisitReasonName = item.Reason;
            $scope.selectedAppointmentObject.VisitReasonId = item.ReasonId || 0;
            $scope.selectedAppointmentObject.VisitTypeId = item.VisitTypeId;

            $scope.selectedAppointmentObject.VisitReasonId = item.ReasonId;
            $scope.selectedAppointmentObject.VisitRemarks = item.Remarks || '';

            if (item.VisitTypeId !== undefined) {
                if ($scope.selectedAppointmentObject.AppointmentTypeId !== item.VisitTypeId.toString()) {
                    $scope.paymentTypeObj.AppointmentNote = "";
                    $scope.Showaddnotes = false;
                }
            }
            $scope.selectedAppointmentObject.AppointmentTypeId = item.VisitTypeId.toString();


            if ($scope.selectedAppointmentObject.AppointmentID !== 0) {
                if ($scope.Doctorcalendarobj == '') {
                    $scope.Doctorcalendarobj = {
                        "AppointmentTypeId": $scope.selectedAppointmentObject.AppointmentTypeId.toString()
                    }
                } else {
                    $scope.selectedAppointmentObject.AppointmentTypeId = $scope.selectedAppointmentObject.AppointmentTypeId.toString();
                }

            }


            if (item.VisitTypeId === 7 || item.VisitTypeId === 6 || item.VisitTypeId === 4 || item.VisitTypeId === 14) {
                var StatusId = '';
                if ($scope.selectedAppointmentObject.AppointmentTypeId == 4 || $scope.selectedAppointmentObject.AppointmentTypeId == 14) {
                    StatusId = 1;
                }
                if ($scope.selectedAppointmentObject.AppointmentTypeId == 7) {
                    StatusId = 2;
                }
                let req = {
                    "PatientId": $scope.selectedPatientObj.PatientId || 0,
                    "SpecializationId": $scope.SpecializationId,
                    "DoctorId": $scope.selectedAppointmentObject.DoctorID,
                    "OrganizationId": $scope.HospitalId,
                    "AppointmentTypeId": $scope.selectedAppointmentObject.AppointmentTypeId || null,
                    "StatusId": StatusId || '',
                };
                $scope.ApprovedSurgeryAppointments = [];
                $scope.SelectedApprovedParentAppt = "";
                eHnoteDiagnosisDataServices.GetApprovedSurgeryAppointments(req).then(function (resp) {
                    if (resp.data !== undefined) {
                        if (resp.data.rows.length > 0) {
                            $scope.SelectedParentAppt = "";
                            $scope.ApprovedSurgeryAppointments = [];
                            angular.forEach(resp.data.rows, function (item) {
                                let obj = {
                                    "SurgeryListId": 0,
                                    "OrgSurgeryId": item.OrganizationSurgeryId,
                                    "SurgeryId": item.SurgeryId,
                                    "PatientSurgeryId": item.PatientSurgeryId,
                                    "AppointmentId": item.AppointmentId,
                                    "OrganizationSurgeryName": item.OrganizationSurgeryName,
                                    "OrganId": item.OrganId||null,
                                    "DeleteInd": 'N',
                                    "IsChecked": false,
                                    "SurgerySuggestedDate": $filter('date')(item.SurgerySuggestedDate, "MM-dd-yyyy")
                                };
                                $scope.ApprovedSurgeryAppointments.push(obj);
                            });

                        } else {
                            alertify.error("This patient doesn't have any advised surgeries!");
                            $scope.IsSubmitDisabled = true;
                            return false;
                        }
                    } else {
                        $scope.IsSubmitDisabled = true;
                        return false;
                    }
                }, function (err) {
                    console.log(err);
                    alertify.error("Fetching Data Failed!");
                });

            }

            $scope.GetVisitReasonbasedDoctors();

        }
        $scope.selectedAppointmentObject.searchvisitreasontxt = "";
        $scope.AppointmentRescheduleObj.StartTime = "";
        $scope.selectedAppointmentObject.DocObj = '';
        $scope.selectedAppointmentObject.DoctorID = 0;
        $scope.selectedAppointmentObject.UserBranchId = 0;
    };
    $scope.changeAppointmentDoctorforCrm = function (SelectedDoctorId, item, Mainitem) {
        $scope.selectedAppointmentObject.DoctorID = item.DoctorID;
        $scope.selectedAppointmentObject.UserBranchId = item.UserBranchId;
        $scope.selectedAppointmentObject.TimeSlotsStartArray = [];
        $scope.selectedAppointmentObject.TimeSlotsEndArray = [];
        $scope.selectedAppointmentObject.patinet_appStarttime = '';
        $scope.selectedAppointmentObject.patient_appEndTime = '';
        $scope.selectedAppointmentObject.DocObj = item || '';
        $scope.AppointmentRescheduleObj.StartTime = "";
        $scope.isAppValiddities.isEnableAlertType = false;
        $scope.selectedAppointmentObject.StartTime = "";
        $scope.loadCalendar();

        $scope.selectedAppointmentObject.VisitReasonId = $scope.selectedAppointmentObject.VisitReasonId || 0;
        if ($scope.selectedAppointmentObject.VisitReasonId != 0) {
            if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar' && $scope.pagename == 'book') {
                $scope.Doctorcalendarobj.Starttime = $scope.Doctorcalendarobj.Starttime || "";
                if ($scope.Doctorcalendarobj.Starttime != "") {
                    $scope.selectedAppointmentObject.StartTime = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm');
                } else {
                    $scope.selectedAppointmentObject.StartTime = "";
                }
                $scope.selectedAppointmentObject.AppointmentDate = $filter('date')($scope.Doctorcalendarobj.GetDate, "yyyy-MM-dd");
                $scope.selectedAppointmentObject.patinet_appStarttime = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm');
                $scope.selectedAppointmentObject.patient_appEndTime = $filter('date')(new Date($scope.Doctorcalendarobj.Endtime), 'HH:mm');

                var AppointmentTypeId = parseInt($scope.Doctorcalendarobj.AppointmentTypeId);
                if (AppointmentTypeId !== item.VisitTypeId) {
                    $scope.isAppValiddities.isEnableAlertType = true;
                    $scope.isAppValiddities.isValidOptionSelected = false;
                    $scope.isAppValiddities.UnblockSlots = false;
                }
            }
        }

        let tdate = $filter('date')(new Date(), "yyyy-MM-dd");
        $scope.selectedAppointmentObject.AppointmentDate = tdate;

        var appointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");
        console.log(appointmentDate);
        var momentObj = moment.utc(appointmentDate).hour(4).minute(0).second(0).millisecond(0);
        var utcDate = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        if (utcDate != undefined) {
            $calendar.customchangeMonth(utcDate);
        }
        var t = new Date($scope.selectedAppointmentObject.AppointmentDate + ' ' + "00:00:00");
        $scope.calendarObject.Year = t.getFullYear();

        if ($scope.selectedAppointmentObject.VisitReasonId == 0) {
            $scope.GetUserActiveDatesandSlotsInCalendar();
        } else {
            $scope.getUserBranchslots($scope.selectedAppointmentObject.DoctorID);

            let check1 = typeof $scope.selectedAppointmentObject.AppointmentDate;
            if (check1 !== "string") {
                var t = $scope.selectedAppointmentObject.AppointmentDate;
                var startDate = t;
                var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);
            } else {
                var t = new Date($scope.selectedAppointmentObject.AppointmentDate + ' ' + "00:00:00");
                var startDate = t;
                var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);
            }

            $scope.GetActiveDates(startDate, endDate);
        }
        //$scope.GetUserActiveDatesandSlotsInCalendar();
        //if ($scope.Doctorcalendarobj.IsComingFrom == 'Doctorcalendar' && $scope.pagename == 'book') {
        //    $scope.Doctorcalendarobj.Starttime = "";
        //    $scope.selectedAppointmentObject.StartTime = "";
        //    $scope.selectedAppointmentObject.patinet_appStarttime = "";
        //    $scope.selectedAppointmentObject.patient_appEndTime = "";
        //}
    }

    if (AppointmentDetailsCache.IsComingFrom == "Coordinator" && AppointmentDetailsCache.IsApptType == "PreAdmission") {
        var obj = {
            "PatientId": AppointmentDetailsCache.PatientId
        }
        $scope.ApptMaintainfields.IsAppointmentScreen = true;
        $scope.ApptMaintainfields.IsFormScreen = "Coordinator";
        $scope.ApptMaintainfields.IsPatientSelected = true;
        $scope.onSelectPatientFromSuggestion(obj);
    }

    $scope.PreAdmSurgeryType = 'Select Surgery';



    //$scope.PreAdmSurgeryToggle = function (obj) {

    //    console.log($scope.selectedAppointmentObject.VisitReasonObj);
    //    if ($scope.selectedAppointmentObject.VisitReasonObj.VisitTypeId === 4) {
    //        if (obj.IsASCApptBooked) {
    //            obj.IsChecked = false;
    //            alertify.error("ASC appointment has already been booked for the surgery!");
    //            return;
    //        }
    //    } else if ($scope.selectedAppointmentObject.VisitReasonObj.VisitTypeId === 7) {
    //        if (obj.IsPreAdmissionApptBooked && $scope.pagename !== 'reschedule') {
    //            obj.IsChecked = false;
    //            alertify.error("PreAdmission appointment has already been booked for the surgery!");
    //            return;
    //        }
    //    }

    //    var checkedArray = _.where($scope.ApprovedSurgeryAppointments, { IsChecked: true });

    //    if (checkedArray.length > 0) {
    //        $scope.PreAdmSurgeryType = 'Selected';
    //    } else {
    //        $scope.PreAdmSurgeryType = 'Select Surgery';
    //    }
    //};



    //$scope.OnCheckNoShowBox = function (val) {
    //    if (val) {
    //        $scope.selectedAppointmentObject.IsWaitingListAppointment = false;
    //    } 
    //};

    $scope.AssignApptDetailsToListTab = function (apptid) {

        angular.forEach($scope.MultipleAppointmentList, function (maintiem) {
            if (maintiem.IsEdit) {
                maintiem.IsEdit = false;
                maintiem.AppointmentID = apptid;
                maintiem.ParentAppointmentId = $scope.selectedAppointmentObject.ParentAppointmentId;
                maintiem.RootAppointmentId = $scope.selectedAppointmentObject.RootAppointmentId;
                maintiem.OrganId = $scope.selectedAppointmentObject.OrganId;
                maintiem.NurseId = $scope.selectedAppointmentObject.NurseId;
                maintiem.AnesthesistId = $scope.selectedAppointmentObject.AnesthesistId;
                maintiem.AppointmentStatus = $scope.selectedAppointmentObject.AppointmentStatus;
                maintiem.CurrentTime = $scope.selectedAppointmentObject.CurrentTime;
                maintiem.StartTime = $scope.selectedAppointmentObject.StartTime;
                maintiem.EndTime = $scope.selectedAppointmentObject.EndTime;
                maintiem.AppointmentTypeId = $scope.selectedAppointmentObject.AppointmentTypeId;
                maintiem.VisitRemarks = $scope.selectedAppointmentObject.VisitRemarks;
                //maintiem.BookingType = $scope.selectedAppointmentObject.BookingType;
                maintiem.selectedBookAppo = $scope.selectedAppointmentObject.selectedBookAppo;
                maintiem.IsWalkInSlot = $scope.selectedAppointmentObject.IsWalkInSlot;
                maintiem.IsAppointmentConfirmed = $scope.selectedAppointmentObject.IsAppointmentConfirmed;
                maintiem.IsWaitingListAppointment = $scope.selectedAppointmentObject.IsWaitingListAppointment;
                maintiem.IsNoShowAppointment = $scope.selectedAppointmentObject.IsNoShowAppointment;
                maintiem.IsPatientMissedAppointment = $scope.selectedAppointmentObject.IsPatientMissedAppointment;
                maintiem.patient_appEndTime = $scope.selectedAppointmentObject.patient_appEndTime;
                maintiem.patinet_appStarttime = $scope.selectedAppointmentObject.patinet_appStarttime;
                maintiem.searchvisitreasontxt = $scope.selectedAppointmentObject.searchvisitreasontxt;
                maintiem.AppointmentDate = $scope.selectedAppointmentObject.AppointmentDate;
                maintiem.DoctorID = $scope.selectedAppointmentObject.DoctorID;
                maintiem.RoomId = $scope.selectedAppointmentObject.RoomId;
                maintiem.RoomTypeId = $scope.selectedAppointmentObject.RoomTypeId;
                maintiem.DayCD = $scope.selectedAppointmentObject.DayCD;
                maintiem.VisitReasonName = $scope.selectedAppointmentObject.VisitReasonName;
                maintiem.ConsultationDt = $scope.selectedAppointmentObject.ConsultationDt;
                maintiem.PatientID = $scope.selectedAppointmentObject.PatientID;
                maintiem.PreviousAppointmentDate = $scope.selectedAppointmentObject.PreviousAppointmentDate;
                maintiem.SendDocSms = $scope.selectedAppointmentObject.SendDocSms;
                maintiem.SendDocEmail = $scope.selectedAppointmentObject.SendDocEmail;
                maintiem.SendPatientEmail = $scope.selectedAppointmentObject.SendPatientEmail;
                maintiem.SendPatientSms = $scope.selectedAppointmentObject.SendPatientSms;
                maintiem.PatientEmail = $scope.selectedAppointmentObject.PatientEmail;
                maintiem.PatientTypeId = $scope.selectedAppointmentObject.PatientTypeId;
                maintiem.IsCheckedIn = $scope.selectedAppointmentObject.IsCheckedIn;
                maintiem.PatientInsuranceList = $scope.selectedAppointmentObject.PatientInsuranceList;
                maintiem.AppointmentNotesList = $scope.selectedAppointmentObject.AppointmentNotesList;
                maintiem.AppointmentNotes = $scope.selectedAppointmentObject.AppointmentNotes;
                maintiem.HospitalEquipmentId = $scope.selectedAppointmentObject.HospitalEquipmentId;
                maintiem.PaymentTypeId = $scope.selectedAppointmentObject.PaymentTypeId;
                maintiem.IsConfirmedAppointment = $scope.selectedAppointmentObject.IsConfirmedAppointment;
                maintiem.AppointmentStatusId = $scope.selectedAppointmentObject.AppointmentStatusId;
                maintiem.BookingTypeId = $scope.selectedAppointmentObject.BookingTypeId;
                maintiem.BookingStatusId = $scope.selectedAppointmentObject.BookingStatusId;
                maintiem.IsWaitingListAppointment = $scope.selectedAppointmentObject.IsWaitingListAppointment || false;
                maintiem.IsNoShowAppointment = $scope.selectedAppointmentObject.IsNoShowAppointment || false;
                maintiem.VisitTypeId = $scope.selectedAppointmentObject.VisitTypeId;
                maintiem.VisitReasonId = $scope.selectedAppointmentObject.VisitReasonId;
                maintiem.IsPatientSmsInd = $scope.selectedAppointmentObject.IsPatientSmsInd;
                maintiem.IsPatientEmailInd = $scope.selectedAppointmentObject.IsPatientEmailInd;
                maintiem.AppointmentTypeName = $scope.selectedAppointmentObject.AppointmentTypeName;
                maintiem.DisplayNumber = $scope.selectedAppointmentObject.DisplayNumber;
                maintiem.VisitRemarks = $scope.selectedAppointmentObject.VisitRemarks;
                maintiem.TimeSlotsStartArray = [];
                maintiem.TimeSlotsEndArray = [];
                maintiem.DocObj = $scope.selectedAppointmentObject.DocObj
                maintiem.UserBranchId = $scope.selectedAppointmentObject.UserBranchId;

            } else {
                maintiem.IsEdit = false;
            }
        });

    };

    $scope.GetRemindersHistory = function (id) {
        id = id || null;

        if (id != null) {
            let param = {
                "AppointmentId": 0,
                "PatientId": id || 0,
            }

            eHnoteMainAppointmentService.GetSetReminderDetails(param).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.RemindersArray = angular.copy(resp.data.rows);
                }
            }, function (err) {
                alertify.error("Getting Failed");
            });
        }


    };

    $scope.SpecialCharacterAlertMsg = function (Type, firstName) {

        var specialcharaters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.`~<>\/?]/;
        if (specialcharaters.test(firstName)) {
            if (Type == 1) {
                $scope.PatientDetailsForRegisterObj.FirstName = $scope.PatientDetailsForRegisterObj.FirstName.replace(/[^\w\s]/gi, '');
                $scope.PatientDetailsForRegisterObj.FirstName = $scope.PatientDetailsForRegisterObj.FirstName.replace(/_/g, '');
            }
            else if (Type == 2) {
                $scope.PatientDetailsForRegisterObj.MiddleName = $scope.PatientDetailsForRegisterObj.MiddleName.replace(/[^\w\s]/gi, '');
                $scope.PatientDetailsForRegisterObj.MiddleName = $scope.PatientDetailsForRegisterObj.MiddleName.replace(/_/g, '');
            }
            else if (Type == 3) {
                $scope.PatientDetailsForRegisterObj.LastName = $scope.PatientDetailsForRegisterObj.LastName.replace(/[^\w\s]/gi, '');
                $scope.PatientDetailsForRegisterObj.LastName = $scope.PatientDetailsForRegisterObj.LastName.replace(/_/g, '');
            }
            else {
                $scope.PatientDetailsForRegisterObj.SecondLastName = $scope.PatientDetailsForRegisterObj.SecondLastName.replace(/[^\w\s]/gi, '');
                $scope.PatientDetailsForRegisterObj.SecondLastName = $scope.PatientDetailsForRegisterObj.SecondLastName.replace(/_/g, '');
            }
            alertify.error("Special Characters are not allowed. Please check");
            return false;
        }
    }
    $scope.Notestabchanges = function (Type) {
        $scope.selectedAppointmentObject.NotesTab = Type || 1;
    }
    $scope.AddOtherNotes = function () {
        if ($scope.selectedAppointmentObject.OtherNotes == '') {
            alertify.error("Please Enter Notes");
            return false;
        }
        $scope.selectedAppointmentObject.IsOtherNotesEdit = true;
        /* $scope.selectedAppointmentObject.OtherNotes = $scope.selectedAppointmentObject.Routeslipnotes || '';*/
        $scope.selectedAppointmentObject.OtherNotesCreatedDt = $filter('date')(new Date(), "MM-dd-yyyy h:mm a") || "";
        $scope.selectedAppointmentObject.OtherNotesCreatedBy = userLoginDetails.displayName || "";



        /*$scope.selectedAppointmentObject.Routeslipnotes = '';*/
        $scope.IsOtherUpdate = false;
    }
    $scope.IsOtherUpdate = false;
    $scope.Editothernotes = function () {
        /* $scope.selectedAppointmentObject.Routeslipnotes = $scope.selectedAppointmentObject.OtherNotes || '';*/
        //$scope.ApptSubmiteText = 'Update';
        //Mainitem.AppointmentNotesList.splice(index, 1);
        /*$scope.selectedAppointmentObject.OtherNotes = '';*/
        $scope.IsOtherUpdate = true;
        $scope.selectedAppointmentObject.IsOtherNotesEdit = false;
    }
    $scope.DeleteOtherNotes = function () {
        $scope.selectedAppointmentObject.OtherNotes = '';
        /*$scope.selectedAppointmentObject.Routeslipnotes = '';*/
        $scope.IsOtherUpdate = false;
        $scope.selectedAppointmentObject.IsOtherNotesEdit = false;
    }
    $scope.getOtherNotesLog = function (item) {

        var obj = {
            "UserId": $scope.UserId,
            "AppointmentID": $scope.selectedAppointmentObject.AppointmentID || 0,

        }
        eHnoteMainAppointmentService.GetOtherNotesLog(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === 'Success') {
                if (resp.data.rows.length > 0) {
                    $scope.OtherNotesLogArray = [];
                    $scope.OtherNotesLogArray = angular.copy(resp.data.rows);
                }
            }
        }, function (err) {
            console.log(err);
        });

    }
    $scope.OtherNotesLog = {
        templateUrl: 'templates/uibpopups/OtherNotesLog.html',
    };



    $scope.changeOfficeNumber = function (item) {
        item = item.toString() || "";
        if (item != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            if (obj != undefined) {
                if (obj.MobileNumber.length > 9) {
                    var Area = obj.MobileNumber.slice(0, 3);
                    $scope.PatientDetailsForRegisterObj.OfficeAreaCode = Area;
                    var contact = obj.MobileNumber.substring(3, (obj.MobileNumber.toString()).length);
                    $scope.PatientDetailsForRegisterObj.OfficeNumber = contact;
                }
                else if (obj.MobileNumber.length <= 9) {
                    var Area = obj.MobileNumber.slice(0, 3);
                    $scope.PatientDetailsForRegisterObj.OfficeAreaCode = Area;
                    var contact = obj.MobileNumber.substring(3, (obj.MobileNumber.toString()).length);
                    $scope.PatientDetailsForRegisterObj.OfficeNumber = contact;
                }
                $scope.PatientDetailsForRegisterObj.DisplayOfficeNumber = obj.UsFormatMobileNumber || "";
            }
        } else {
            $scope.PatientDetailsForRegisterObj.DisplayOfficeNumber = "";
            $scope.PatientDetailsForRegisterObj.OfficeAreaCode = "";
            $scope.PatientDetailsForRegisterObj.OfficeNumber = "";
        }
    };

    $scope.CheckVerifyEligibity = function () {
        if ($scope.PatientDetailsForRegisterObj.PatientID === 0 || $scope.PatientInsuranceObj.PatientInsuranceDetailId === 0) {
            $scope.addDirectpatientandInsuranceforEligibility();
        } else {
            $scope.continuetoCheckInsuranceEligibility();
        }
    }

    $scope.addDirectpatientandInsuranceforEligibility = function () {

        if ($scope.PatientDetailsForRegisterObj.FirstName === "") {
            alertify.error("Please Enter Patient First Name");
            return false;
        }
        if ($scope.PatientDetailsForRegisterObj.FirstName.length < 3) {
            alertify.error("Please Enter Patient First Name");
            return false;
        }
        $scope.PatientDetailsForRegisterObj.LastName = $scope.PatientDetailsForRegisterObj.LastName || "";
        if ($scope.PatientDetailsForRegisterObj.LastName === "") {
            alertify.error("Please Enter Patient Last Name");
            return false;
        }
        if ($scope.PatientDetailsForRegisterObj.DOB === "") {
            alertify.error("Please Enter Patient DOB");
            return false;
        }

        if ($scope.PatientDetailsForRegisterObj.Gender === "") {
            alertify.error("Please Enter Patient Gender");
            return false;
        }

        $scope.PatientDetailsForRegisterObj.HomeAreaCode = $scope.PatientDetailsForRegisterObj.HomeAreaCode || '';

        if ($scope.PatientDetailsForRegisterObj.HomeAreaCode == '' || ($scope.PatientDetailsForRegisterObj.HomeAreaCode.toString()).length < 2) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }
        var HomeAreaCode = angular.copy($scope.PatientDetailsForRegisterObj.HomeAreaCode) || "";
        if ((HomeAreaCode.toString()).length < 3) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }
        var MobileNumber = angular.copy($scope.PatientDetailsForRegisterObj.HomeNumber) || "";
        if ((MobileNumber.toString()).length != 7) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }

        $scope.PatientDetailsForRegisterObj.OfficeAreaCode = $scope.PatientDetailsForRegisterObj.OfficeAreaCode || '';
        if ($scope.PatientDetailsForRegisterObj.OfficeAreaCode != '' || $scope.PatientDetailsForRegisterObj.OfficeNumber != '') {
            if (($scope.PatientDetailsForRegisterObj.OfficeAreaCode.toString()).length < 2) {
                alertify.error("Please Enter Valid Alternate Number");
                return false;
            }
        }
        var Contactnumber = angular.copy($scope.PatientDetailsForRegisterObj.OfficeNumber) || "";
        if ($scope.PatientDetailsForRegisterObj.OfficeAreaCode != '' || $scope.PatientDetailsForRegisterObj.OfficeNumber != '') {
            if ((Contactnumber.toString()).length != 7) {
                alertify.error("Please Enter Valid Alternate Number");
                return false;
            }
        }


        $scope.PatientDetailsForRegisterObj.SocialSecurityNo = $scope.PatientDetailsForRegisterObj.SocialSecurityNo || null;
        if ($scope.PatientDetailsForRegisterObj.SocialSecurityNo === null) {
            alertify.error("Please Enter SSN Number");
            return;
        }

        var SSNno = angular.copy($scope.PatientDetailsForRegisterObj.SocialSecurityNo) || "";
        SSNno = SSNno.toString();
        if (SSNno != "" && SSNno.length !== "" && SSNno.length < 9) {
            alertify.error("Please Enter Valid SSN Number");
            return false;
        }

        $scope.PatientInsuranceObj.PayorId = $scope.PatientInsuranceObj.PayorId || null;
        if ($scope.PatientInsuranceObj.PayorId === null) {
            alertify.error("Please Select Payor");
            return;
        }
        $scope.PatientInsuranceObj.PlanId = $scope.PatientInsuranceObj.PlanId || null;
        if ($scope.PatientInsuranceObj.PlanId === null) {
            alertify.error("Please Select Plan");
            return;
        }
        $scope.PatientInsuranceObj.PolicyId = $scope.PatientInsuranceObj.PolicyId || null;
        if ($scope.PatientInsuranceObj.PolicyId === null) {
            alertify.error("Please Enter Policy Id");
            return;
        }
        $scope.PatientInsuranceObj.GroupId = $scope.PatientInsuranceObj.GroupId || null;
        if ($scope.PatientInsuranceObj.GroupId === null) {
            alertify.error("Please Enter Group Id");
            return;
        }

        var PatientandInsuranceDetails = {};
        var patientRegister = {
            "UserId": $scope.PatientDetailsForRegisterObj.UserId,
            "HospitalId": $scope.PatientDetailsForRegisterObj.HospitalId,
            "PatientId": $scope.PatientDetailsForRegisterObj.PatientID || 0,
            "TitleId": $scope.PatientDetailsForRegisterObj.TitleId,
            "FirstName": $scope.PatientDetailsForRegisterObj.FirstName,
            "MiddleName": $scope.PatientDetailsForRegisterObj.MiddleName || '',
            "LastName": $scope.PatientDetailsForRegisterObj.LastName,
            "SecondLastName": $scope.PatientDetailsForRegisterObj.SecondLastName,
            "DOB": $filter("date")(new Date($scope.PatientDetailsForRegisterObj.DOB), "yyyy-MM-dd") || "",
            "Age": $scope.PatientDetailsForRegisterObj.ageinYears,
            "SSN": $scope.PatientDetailsForRegisterObj.SocialSecurityNo,
            "Gender": $scope.PatientDetailsForRegisterObj.Gender,
            "PatientTagId": $scope.PatientDetailsForRegisterObj.PatientTagId || null,
            "MaritalStatusId": $scope.PatientDetailsForRegisterObj.MaritalStatusID || null,
            "BloodGroupId": $scope.PatientDetailsForRegisterObj.BloodGroupId || null,
            "LeadSourceInd": "N",
            "PatientS3Url": $scope.PatientDetailsForRegisterObj.S3URL || "",
            "EmailID": $scope.PatientDetailsForRegisterObj.EmailID,
            "FullName": $scope.PatientDetailsForRegisterObj.FirstName + $scope.PatientDetailsForRegisterObj.LastName || "",
            "DeviceEntityTypeId": 2,
            "HomeCountryCode": $scope.PatientDetailsForRegisterObj.HomeCountryCode || "",
            "HomeAreaCode": $scope.PatientDetailsForRegisterObj.HomeAreaCode || "",
            "HomeNumber": $scope.PatientDetailsForRegisterObj.HomeNumber || "",
            "OfficeCountryCode": $scope.PatientDetailsForRegisterObj.OfficeCountryCode || "",
            "OfficeAreaCode": $scope.PatientDetailsForRegisterObj.OfficeAreaCode || "",
            "OfficeNumber": $scope.PatientDetailsForRegisterObj.OfficeNumber || "",
            "IsPatientSmsInd": $scope.PatientDetailsForRegisterObj.IsPatientSmsInd,
            "IsPatientEmailInd": $scope.PatientDetailsForRegisterObj.IsPatientEmailInd,
            "OccupationId": cacheStorageItem.OccupationId || null,
            "OccupationDescription": $scope.PatientDetailsForRegisterObj.OccupationDescription || "",
            "EmployerPhoneNo": cacheStorageItem.EmployerPhoneNo,
            "EmergencyContactName": cacheStorageItem.EmergencyContactName,
            "EmeregecyContactNo": cacheStorageItem.EmeregecyContactNo
        };
        PatientandInsuranceDetails.PatientDeatils = patientRegister;

        var insuranceObj = {
            "PatientId": $scope.PatientDetailsForRegisterObj.PatientID || 0,
            "FullName": $scope.PatientDetailsForRegisterObj.Fullname || "",
            "UserId": eHnoteMasterDataService.getLoginId(),
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PatientInsuranceDetails": []
        }
        $scope.PatientInsuranceObj.PatientInsuranceDetailId = $scope.PatientInsuranceObj.PatientInsuranceDetailId || 0;
        $scope.PatientInsuranceObj.PayorId = $scope.PatientInsuranceObj.PayorId || 0;
        $scope.PatientInsuranceObj.CoverageId = $scope.PatientInsuranceObj.CoverageId || 0;
        $scope.PatientInsuranceObj.PlanId = $scope.PatientInsuranceObj.PlanId || 0;
        $scope.PatientInsuranceObj.PolicyId = $scope.PatientInsuranceObj.PolicyId || "";
        $scope.IsCheckOldInsurance = false;
        if ($scope.PatientInsuranceObj.PayorId != 0 || $scope.PatientInsuranceObj.CoverageId != 0 || $scope.PatientInsuranceObj.PlanId != 0 || $scope.PatientInsuranceObj.PolicyId != "") {
            var TempInsuarance = $scope.PatientInsuranceObj;

            TempInsuarance.CoverageId = TempInsuarance.CoverageId || null;

            TempInsuarance.PayorId = TempInsuarance.PayorId || null;
            TempInsuarance.PlanId = TempInsuarance.PlanId || null;
            TempInsuarance.OrganizationPayorId = TempInsuarance.OrganizationPayorId || null;

            if (TempInsuarance.ExpiryDate != "") {
                TempInsuarance.ExpiryDate = $filter('date')(TempInsuarance.ExpiryDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.EffectiveDate != "") {
                TempInsuarance.EffectiveDate = $filter('date')(TempInsuarance.EffectiveDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.ScanDate != "") {
                TempInsuarance.ScanDate = $filter('date')(TempInsuarance.ScanDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.VerifiedDate != "") {
                TempInsuarance.VerifiedDate = $filter('date')(TempInsuarance.VerifiedDate, 'yyyy-MM-dd');
            }

            if (TempInsuarance.RelationShipId == 1) {
                TempInsuarance.InsuredPersonFirstName = patientRegister.FirstName + patientRegister.MiddleName + patientRegister.LastName;
                TempInsuarance.InsuredPersonGenderID = patientRegister.Gender == "Male" ? 'M' : 'F';
            }

            insuranceObj.PatientInsuranceDetails.push(TempInsuarance);


            $scope.paymentTypeObj.PaymentTypeId = "2";
            $scope.paymentTypeObj.IsPaymentTypeInd = false;

            if ($scope.PatientInsuranceObj.PatientInsuranceDetailId != 0) {
                $scope.IsCheckOldInsurance = true;
            } else {
                $scope.IsCheckOldInsurance = false;
            }
        } else {
            $scope.paymentTypeObj.PaymentTypeId = "1";
            $scope.paymentTypeObj.IsPaymentTypeInd = true;
        }
        PatientandInsuranceDetails.PatientInsuranceList = angular.copy(insuranceObj);




        //if ($scope.SelectedBranchId === "" || $scope.SelectedBranchId === undefined) {
        //    alertify.error("Please Select a Branch");
        //    return false;
        //}

        //if ($scope.SelectedBranchDocId === "" || $scope.SelectedBranchDocId === undefined || $scope.SelectedBranchDocId === 0) {
        //    alertify.error("Please Select a Doctor");
        //    return false;
        //}




        eHnoteUserAppointmentDataService.AddUpdatePatientRegisterandInsuarnceDeatils(PatientandInsuranceDetails).then(function (response) {

            console.log(JSON.stringify(response));

            if (response != undefined) {
                if (response.data != undefined) {
                    if (response.data.PatientDeatils.status == "success") {
                        var PatientDetails1 = response.data.PatientDeatils;
                        var insuranceDetails1 = response.data.InsuranceDetails || "";


                        if (PatientDetails1 != undefined && PatientDetails1 != null) {
                            $scope.PatientDetailsForRegisterObj.PatientID = PatientDetails1.PatientId;
                            $scope.PatientDetailsForRegisterObj.SocialSecurityNo = PatientDetails1.SSN;
                            $scope.PatientDetailsForRegisterObj.PatientDisplayId = PatientDetails1.PatientDisplayId;
                            $scope.selectedPatientObj.PatientId = PatientDetails1.PatientId;
                            $scope.selectedPatientObj.FullName = PatientDetails1.FullName;
                            $scope.selectedPatientObj.PatientName = PatientDetails1.FullName;
                            $scope.selectedPatientObj.FirstName = PatientDetails1.FirstName;
                            $scope.selectedPatientObj.LastName = PatientDetails1.LastName;
                            $scope.selectedPatientObj.PatientMobile = PatientDetails1.MobileNumber || 0;
                            $scope.selectedPatientObj.DOB = PatientDetails1.DOB;
                            $scope.selectedPatientObj.PatientGender = PatientDetails1.Gender;
                            $scope.selectedPatientObj.PatientEmail = PatientDetails1.EmailId;
                            $scope.selectedPatientObj.PatientTitle = PatientDetails1.TitleId;

                            if ($scope.selectedPatInfo == undefined) {
                                $scope.selectedPatInfo = {
                                    "EmailID": PatientDetails1.EmailId || ""
                                };
                            } else {
                                $scope.selectedPatInfo.EmailID = PatientDetails1.EmailId || "";
                            }

                        }
                        if (insuranceDetails1 != "" && insuranceDetails1 != undefined) {
                            if (insuranceDetails1.PatientInsuranceDetails.length > 0 && $scope.IsCheckOldInsurance == false) {

                                $scope.patientInsuranceTpasArray = angular.copy(insuranceDetails1.PatientInsuranceDetails);

                                $scope.PatientInsuranceObj.PatientInsuranceDetailId = insuranceDetails1.PatientInsuranceDetails[0].PatientInsuranceDetailId;

                                $scope.PatientInsuranceObj.PatientInsuranceControlNumber = insuranceDetails1.PatientInsuranceDetails[0].PatientInsuranceControlNumber;

                                console.log(insuranceDetails1.PatientInsuranceDetails[0].PatientInsuranceControlNumber + "__PatientInsuranceControlNumber");


                                if ($scope.paymentTypeObj.PaymentTypeId == 2 || $scope.paymentTypeObj.PaymentTypeId == "2") {
                                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = insuranceDetails1.PatientInsuranceDetails[0];
                                } else {
                                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
                                }

                            } else if (insuranceDetails1.PatientInsuranceDetails.length > 0 && $scope.IsCheckOldInsurance == true) {
                                console.log("Patient already have insurance");
                            } else {
                                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
                            }
                        }

                        $scope.continuetoCheckInsuranceEligibility();

                    }
                }
            }
        }, function (error) {
            console.log(error);
        });

    }


    $scope.continuetoCheckInsuranceEligibility = function () {
        if ($scope.PatientDetailsForRegisterObj.FirstName === "") {
            alertify.error("Please Enter Patient First Name");
            return;
        }
        //if ($scope.PatientDetailsForRegisterObj.FirstName.length < 3) {
        //    alertify.error("Please Enter Patient First Name");
        //    return;
        //}
        $scope.PatientDetailsForRegisterObj.LastName = $scope.PatientDetailsForRegisterObj.LastName || "";
        if ($scope.PatientDetailsForRegisterObj.LastName === "") {
            alertify.error("Please Enter Patient Last Name");
            return;
        }
        if ($scope.PatientDetailsForRegisterObj.DOB === "") {
            alertify.error("Please Enter Patient DOB");
            return;
        }

        if ($scope.PatientDetailsForRegisterObj.Gender === "") {
            alertify.error("Please Enter Patient Gender");
            return;
        }



        $scope.PatientDetailsForRegisterObj.SocialSecurityNo = $scope.PatientDetailsForRegisterObj.SocialSecurityNo || null;
        if ($scope.PatientDetailsForRegisterObj.SocialSecurityNo === null) {
            alertify.error("Please Enter Valid SSN Number");
            return;
        }


        var SSNno = angular.copy($scope.PatientDetailsForRegisterObj.SocialSecurityNo) || "";
        SSNno = SSNno.toString();
        if ((SSNno == "") || (SSNno != "" && SSNno.length !== "" && SSNno.length < 9)) {
            alertify.error("Please Enter Valid SSN Number");
            return;
        }

        $scope.PatientInsuranceObj.PlanId = $scope.PatientInsuranceObj.PlanId || null;
        if ($scope.PatientInsuranceObj.PlanId === null) {
            alertify.error("Please Select Plan");
            return;
        }
        $scope.PatientInsuranceObj.PolicyId = $scope.PatientInsuranceObj.PolicyId || null;
        if ($scope.PatientInsuranceObj.PolicyId === null) {
            alertify.error("Please Enter Policy Id");
            return;
        }
        $scope.PatientInsuranceObj.GroupId = $scope.PatientInsuranceObj.GroupId || null;
        if ($scope.PatientInsuranceObj.GroupId === null) {
            alertify.error("Please Enter Group Id");
            return;
        }





        var params = {
            "SNO": 1,
            "PatientAppointmentInsuranceDetailId": 0,
            "AppointmentId": 0,
            "AppointmentDate": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "AppointmentInsuranceNumber": $scope.PatientInsuranceObj.PatientInsuranceControlNumber,
            "DoctorName": $scope.selectedAppointmentObject.DocObj.FullName,
            "UserProviderId": $scope.selectedAppointmentObject.DocObj.EmployeeId,
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "AppointmentTOSCodes": [],
            "NPI": $scope.selectedAppointmentObject.DocObj.NPI,
            "TaxId": $scope.selectedAppointmentObject.DocObj.TaxId,
            "ProviderCode": "H",
            "serviceProviderNumber": $scope.selectedAppointmentObject.DocObj.serviceProviderNumber,
            "HospitalName": $scope.selectedBranchobj.ClinicName,
            "AppointmentTime": $scope.selectedAppointmentObject.StartTime,
            "AppointmentPatientTypeId": 1,
            "AppointmentPatientType": "New Patient",
            "PatientInsuranceDetailId": $scope.PatientInsuranceObj.PatientInsuranceDetailId,
            "PatientId": $scope.PatientDetailsForRegisterObj.PatientID,
            "PatientMrNo": $scope.PatientDetailsForRegisterObj.PatientDisplayId,
            "Gender": $scope.PatientDetailsForRegisterObj.Gender,
            "DOB": $scope.PatientDetailsForRegisterObj.DOB,
            "FirstName": $scope.PatientDetailsForRegisterObj.FirstName,
            "LastName": $scope.PatientDetailsForRegisterObj.LastName,
            "SecondLastName": $scope.PatientDetailsForRegisterObj.SecondLastName,
            "TitleId": 1,
            "Title": "Mr",
            "PatientName": $scope.PatientDetailsForRegisterObj.FirstName + "" + $scope.PatientDetailsForRegisterObj.LastName,
            "PatientMobile": $scope.PatientDetailsForRegisterObj.DisplayNumber,
            "PatientContact": $scope.PatientDetailsForRegisterObj.HomeCountryCode,
            "HomeNumber": $scope.PatientDetailsForRegisterObj.HomeNumber,
            "HomeAreaCode": $scope.PatientDetailsForRegisterObj.HomeAreaCode,
            "HomeCountryCode": $scope.PatientDetailsForRegisterObj.DisplayOfficeNumber,
            "OfficeNumber": $scope.PatientDetailsForRegisterObj.OfficeNumber,
            "OfficeAreaCode": $scope.PatientDetailsForRegisterObj.OfficeAreaCode,
            "OfficeCountryCode": $scope.PatientDetailsForRegisterObj.OfficeCountryCode,
            "PatientGender": $scope.PatientDetailsForRegisterObj.Gender,
            "PatientSSN": $scope.PatientDetailsForRegisterObj.PatientSSN,
            "PayorId": $scope.PatientInsuranceObj.PayorId,
            "PayorName": $scope.PatientInsuranceObj.PayorName,
            "PlanName": $scope.PatientInsuranceObj.PlanName,
            "PlanTypeId": $scope.PatientInsuranceObj.PlanTypeId,
            "PlanTypeName": $scope.PatientInsuranceObj.PlanTypeName,
            "PlanId": $scope.PatientInsuranceObj.PlanId,
            "InsuranceEffectiveDate": $scope.PatientInsuranceObj.EffectiveDate,
            "InsuranceExpiryDate": $scope.PatientInsuranceObj.ExpiryDate,
            "RelationShipId": $scope.PatientInsuranceObj.RelationShipId,
            "RelationName": $scope.PatientInsuranceObj.RelationShipName,
            "VerifiedDate": "",
            "Coinsurance": null,
            "VisitCopay": null,
            "CoverageId": 1,
            "InsuredPersonSSN": $scope.PatientDetailsForRegisterObj.SocialSecurityNo,
            "PolicyHolder": "",
            "InsuranceStatusId": 1,
            "InsuredPersonFirstName": $scope.PatientDetailsForRegisterObj.InsuredPersonFirstName,
            "InsuredPersonDOB": $scope.PatientDetailsForRegisterObj.InsuredPersonDOB,
            "InsuredPersonGenderID": $scope.PatientDetailsForRegisterObj.InsuredPersonGenderID,
            "InsuranceStatusName": "Active",
            "PolicyHolderName": "",
            "GroupName": "",
            "StatusId": 1,
            "StatusName": "Not Verified",
            "MasterPayorId": $scope.PatientInsuranceObj.GlobalPayorId,
            "OrgEligibilityClaimNumber": $scope.PatientInsuranceObj.PatientInsuranceControlNumber,
            "PatientCoPayAmount": null,
            "PatientCoPayPercentage": null,
            "SocialSecurityNo": $scope.PatientDetailsForRegisterObj.SocialSecurityNo,
            "AddressId": null,
            "CityName": null,
            "StateName": null,
            "Pin": null,
            "PlanBeginDate": null,
            "PlanEndDate": null,
            "PolicyId": $scope.PatientInsuranceObj.PolicyId,
            "GroupId": $scope.PatientInsuranceObj.GroupId,
            "PlanNumber": $scope.PatientInsuranceObj.PlanCode,
            "isSelected": false,
            "isVerified": false,
            "IsShowEligibility": false,
            "ProviderID": $scope.PatientDetailsForRegisterObj.BranchNPI,
            "ServiceTypeobj": "",
            "SerciceFrom": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "ServiceTo": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "MemberId": $scope.PatientInsuranceObj.PolicyId,
            "OrganizationId": $scope.selectedBranchobj.ClinicId,
            "serviceTypeCodes": [

            ]
        };



        eHnoteInsuranceService.checkPatientInsuranceEligibilityById(params, onSuccess, onError);
        function onSuccess(resp) {
            console.log(resp);

            resp.errors = resp.errors || [];
            if (resp.errors.length > 0) {

                var eparams = {
                    "UserId": $scope.UserId,
                    "AppointmentInsuranceDetailId": 0,
                    "InsuranceEligibilityErrorStatusId": 0,
                    "ErrorDetails": [],
                    "VerifiedDate": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                }
                angular.forEach(resp.errors, function (eitem) {
                    var eobj = {
                        "Field": eitem.field,
                        "Description": eitem.description
                    }
                    eparams.ErrorDetails.push(eobj);
                });



                eHnoteInsuranceService.UpdateInsuranceEligibilityErrorDetails(eparams).then(function (response) {
                    if (response.data.status === 'Success') {

                    }
                });

            }
            else {

                var PlanStatusCode = 0, PlanStatus = "", ResponseJson = "", insStatusId = 1;

                if (resp.planStatus.length > 0) {
                    PlanStatusCode = parseFloat(resp.planStatus[0].statusCode) || 0;
                    PlanStatus = resp.planStatus[0].status;
                    ResponseJson = JSON.stringify(resp);
                }
                if (PlanStatusCode == 1) {
                    insStatusId = 1;
                } else {
                    insStatusId = 2;
                }

                var obj = {
                    "UserId": $scope.UserId,
                    "PatientId": $scope.PatientDetailsForRegisterObj.PatientID,
                    "VerificationDate": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    "AppointmentInsuranceDetailId": 0,
                    "PatientInsuranceDetailId": $scope.PatientInsuranceObj.PatientInsuranceDetailId,
                    "StatusId": insStatusId,
                    "OrgEligibilityClaimNumber": $scope.PatientInsuranceObj.PatientInsuranceControlNumber,
                    "PlanStatusCode": PlanStatusCode,
                    "IdentifierId": $scope.PatientInsuranceObj.IdentifierId,
                    "PlanStatus": PlanStatus,
                    "PatientCoPayAmount": 0,
                    "PatientCoPayPercentage": 0,
                    "BenifitCoveragesList": [],
                    "BenifitCoverageDetailsList": []
                }
                resp.benefitsInformation = resp.benefitsInformation || [];
                resp.planStatus = resp.planStatus || [];


                if (resp.planStatus.length > 0) {
                    angular.forEach(resp.planStatus, function (psitem) {
                        angular.forEach(psitem.serviceTypeCodes, function (subitem) {
                            var sobj = {
                                "PatientEligibilityBenifitId": 0,
                                "ServiceTypeCode": subitem || 0,
                                "Status": psitem.status,
                                "IsCopayIdentified": false,
                                "DeleteInd": false,
                            }

                            obj.BenifitCoveragesList.push(sobj);
                        });

                    });
                }

                if (resp.benefitsInformation.length > 0) {
                    angular.forEach(resp.benefitsInformation, function (bitem) {
                        angular.forEach(bitem.serviceTypeCodes, function (subitem) {
                            bitem.benefitsDateInformation = bitem.benefitsDateInformation || '';
                            var BenifitDateInformation = '';
                            if (bitem.benefitsDateInformation != '') {
                                bitem.benefitsDateInformation.plan = bitem.benefitsDateInformation.plan || '';
                                bitem.benefitsDateInformation.benefit = bitem.benefitsDateInformation.benefit || '';
                                BenifitDateInformation = bitem.benefitsDateInformation.plan == '' ? bitem.benefitsDateInformation.benefit : bitem.benefitsDateInformation.plan;
                            }

                            var sobj = {
                                "PatientEligibilityBenifitDetailId": 0,
                                "ServiceTypeCode": subitem || 0,
                                "BenifitTypeName": bitem.name,
                                "BenifitAmount": bitem.benefitAmount || 0,
                                "BenifitPercentage": bitem.benefitPercent || 0,
                                "BenifitDateInformation": BenifitDateInformation || "",
                                "TimeQualifier": bitem.timeQualifier || '',
                                "CoverageLevel": bitem.coverageLevel || '',
                                "inPlanNetworkIndicator": bitem.inPlanNetworkIndicator || "No",
                                "DeleteInd": false,
                            }

                            obj.BenifitCoverageDetailsList.push(sobj);
                        });

                    });
                }

                console.log(JSON.stringify(obj));

                eHnoteInsuranceService.UpdatePatientInsuranceEligibilityResponse(obj).then(function (response) {
                    console.log(response);
                    if (response.data.status === 'Success') {


                    }
                    $scope.PatientInsuranceObj.IsVerified = true;

                    $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = response.data.AppointmentInsuranceDetailId || 0;
                    //$scope.PatientInsuranceObj.VerifiedDate = $filter("date")(new Date(), "MM-dd-yyyy HH:mm:ss");
                    $scope.PatientInsuranceObj.VerificationDate = $filter("date")(new Date(), "MM-dd-yyyy HH:mm:ss");

                    var Userlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.UserId });
                    if (Userlist.length > 0) {
                        $scope.PatientInsuranceObj.VerifiedByUserName = angular.copy(Userlist[0].FullName);
                    }
                    $scope.PatientInsuranceObj.EligibilityStatusId = PlanStatusCode;
                    $scope.PatientInsuranceObj.VerifiedBy = $scope.UserId;
                    console.log($scope.PatientInsuranceObj.EligibilityStatusId + "_EligibilityStatusId");
                    if ($scope.PatientInsuranceObj.EligibilityStatusId == 1) {
                        $scope.PatientInsuranceObj.StatusId = 2;
                    }
                    console.log($scope.PatientInsuranceObj.StatusId + "_StatusId_");

                });
            }

        }
        function onError(reponse) {
        }

    }

    $scope.SaveTransferToCal = function () {
        let Remarks = "";
        if ($scope.selectedAppointmentObject.AppointmentNotesList.length>0) {
            Remarks =$scope.selectedAppointmentObject.AppointmentNotesList[0].Notes || '';
        }


        let params = {
            "PluginAppoitmentRequestId": 0,
            "PatientId": $scope.selectedPatientObj.PatientId,
            "MasterPatientId": $scope.selectedPatientObj.MasterPatientId || 0,
            "AppointmentId": $scope.selectedAppointmentObject.AppointmentID,
            "BranchId": $scope.HospitalId,
            "PreferredDate": "",
            "RequestedDate": $filter("date")(new Date(), "MM-dd-yyyy"),
            "AppointmentRequestReasonId": null,
            "Remarks": Remarks||"",
            "RequestStatusId": 1,
            "RequestStatus": "To be Worked",
            "StatusId": 4,
            "Status": "TransferToHospital",
            "PatientSeenOtherProvider": $scope.selectedAppointmentObject.PatientSeenOtherProvider || '',
            "OtherProviderVisitDate": $scope.selectedAppointmentObject.OtherProviderVisitDate || null,
            "OtherProviderVisitReason": $scope.selectedAppointmentObject.OtherProviderVisitReason || "",
            "OtherProviderDoctorName": $scope.selectedAppointmentObject.OtherProviderDoctorName || "",
            "DeleteInd": "N",
            "DoctorId": $scope.UserId,
            "ReasonTypeId": $scope.selectedAppointmentObject.ReasonTypeId||null,
            "IsReferral": $scope.selectedAppointmentObject.IsReferral || false,
            "ReasonTypeName":$scope.selectedAppointmentObject.ReasonTypeName||null

        }
        eHnoteUserAppointmentDataService.AddUpdatePluginAppointmentRequest(params).then(function (resp) {
            if (resp.data.Status == 'Success') {
                $uibModalInstance.close(resp.data);
            }


        }, function (err) {
            console.log(err);
        });
    }

    $scope.Unblockvisitreason = function () {
        $scope.selectedAppointmentObject.UnblockVisitreason = false;
        $scope.UserAccessRights.AllAccessRights.CRMApptUnblockVisitreason = $scope.UserAccessRights.AllAccessRights.CRMApptUnblockVisitreason || false;
        if ($scope.UserAccessRights.AllAccessRights.CRMApptUnblockVisitreason == true) {
            $scope.selectedAppointmentObject.UnblockVisitreason = true
        } else {
            $scope.selectedAppointmentObject.UnblockVisitreason = false;
            let obj = {
                "Screen": "Book Appt",
                "Type": "VisitReason"
            };

            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/SignOffPasswordRequired.html",
                "controller": "UsPasswordAuthenticationPopupCtrl",
                "size": "md",
                "windowClass": " ",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "obj": function () { return obj; }
                }
            });
            signmodalInstance.result.then(function (resp) {
                $scope.selectedAppointmentObject.UnblockVisitreason = true
            }, function (data) {

            });
        }

    }


    $scope.showEligibilityinPopup = function () {
        $scope.obj = {
            "AppointmentInsuranceDetailId": $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId || 0,
            "PatientInsuranceDetailId": $scope.PatientInsuranceObj.PatientInsuranceDetailId
        }


        $scope.modalpayorInstance = $uibModal.open({
            "templateUrl": "templates/consultation/payor/PatientEligibilityResponseDetails.html",
            "size": "lg",
            "backdrop": "static",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            "keyboard": false,
            "windowClass": "inventory-full-popup",
            "controller": function ($scope, $uibModal, $uibModalInstance, Selectobj) {


                $scope.selectedObj = Selectobj;
                $scope.MainBenifitEligibilityCoverageList = [];
                $scope.BenifitEligibilityCoverageList1 = [];
                $scope.ChangePatientsInsuranceList = function () {
                    $scope.BenifitCoverageDetailListobj = 1;
                    $scope.Id = Selectobj.AppointmentInsuranceDetailId;
                    $scope.InsuranceEligibility = [];
                    $scope.selectedid = Selectobj.PatientInsuranceDetailId;
                    eHnoteInsuranceService.GetCheckInsuranceEligibilityById($scope.selectedid).then(function (resp) {
                        $scope.MainBenifitEligibilityCoverageList = [];
                        $scope.BenifitEligibilityCoverageList1 = [];
                        if (resp.data.status == "Success") {
                            resp.data.rows = resp.data.rows || [];

                            if (resp.data.rows.length > 0) {
                                resp.data.rows[0].BenifitCoverageDetailsList = resp.data.rows[0].BenifitCoverageDetailsList || [];
                                resp.data.rows[0].BenifitCoveragesList = resp.data.rows[0].BenifitCoveragesList || [];
                                if (resp.data.rows[0].BenifitCoverageDetailsList.length > 0) {

                                    angular.forEach(resp.data.rows[0].BenifitCoveragesList, function (hitem) {
                                        var temarray = $filter("filter")(resp.data.rows[0].BenifitCoverageDetailsList, function (item, index) { return item.ServiceTypeCode === hitem.ServiceTypeCode }, true);
                                        if (temarray.length !== 0) {
                                            var obj = {
                                                "ServiceTypeCode": hitem.ServiceTypeCode,
                                                "ServiceTypeName": hitem.ServiceTypeName,
                                                "Status": hitem.Status,
                                                "BenifitCoverageDetailsList": temarray || [],
                                            }
                                            $scope.MainBenifitEligibilityCoverageList.push(obj);

                                        }
                                    });
                                    $scope.BenifitEligibilityCoverageList1 = angular.copy($scope.MainBenifitEligibilityCoverageList);


                                }
                            }
                        } else {
                            alertify.error(resp.data.Message);
                        }
                    }, function (error) {
                    });
                }

                $scope.BenifitCoverageDetailListobj = 1;
                $scope.ChangePatientsInsuranceList();
                $scope.CheckInsEligibility = function (val) {

                    if (val == '1') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.ServiceTypeName == hitem.ServiceTypeName }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }

                    if (val == '2') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Co-Payment' }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }

                    if (val == '3') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Co-Insurance' }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }

                    if (val == '4') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Deductible' }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }

                    if (val == '5') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Out of Pocket (Stop Loss)' }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }

                    if (val == '6') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Limitations' }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }


                }

                $scope.CheckInsuranceEligibility1 = function (item) {
                    item.IsShowEligibility = !item.IsShowEligibility;
                }

                $scope.ClosePopup = function () {
                    if ($scope.IsComingFrom == 'NoShow') {
                        $uibModalInstance.close("NoShow");
                    } else {
                        $uibModalInstance.dismiss("cancel");
                    }
                };
            }
        });
    }


    // new functionality to select surgeries/orders during appointment booking (04-03-2024) (Task: 29666)

    $scope.adviseObj = {
        'SearchProcedureObj': "",
        'SeletedProcedureObj': "",
        'DiagnosisObject': "",
        'IsAdditionalSurgery': false,
        'SearchReferalObj': ""
    };

    $scope.SelectedNewSurgeries = [];
    $scope.AdditionalSurgery = [];

    $scope.GetOrganizationCPTProcedure = function (val) {
        val = val || "";
        let obj = {
            "OrganizationId": $scope.HospitalId,
            "ProcedureId": 0,
            "CPTCODE": "",
            "SearchText": val || "",
            "TypeOfServiceId": 0,
            "PageNumber": 1,
            "PageSize": 10,
            "GetAllIndicator": 0,
            "IsFrequent": "N",
            "Status": 0,
            "Type": "SurgeriesProcedures",
            "ParentOrganizationId": $scope.ParenthospitalId || null
        };
        /* "Type": "Surgery"*/ //commented by durga as BA team asked to bring both surgery and procedures
        if (val == "") {
            obj.IsFrequent = "Y";
        }
        return eHnoteSettingsDataService.GetOrganizationProceduresByType(obj).then(function (response) {
            if (response.data.Status == "Success") {
                if (response.data.rows.length !== 0) {
                    if (response.data.rows.length > 0) {
                        angular.forEach(response.data.rows, function (item) {
                            if (item.CPTCode == "") {
                                if (item.LoincCode != '') {
                                    item.CPTCode = item.LoincCode;
                                }
                            }
                        });
                    }

                    //let allSurgeryItem = {
                    //    ProcedureCode: "",
                    //    ProcedureName: "All Surgeries",
                    //    CPTCode: "",
                    //    LoincCode: ""
                    //};

                    //response.data.rows.unshift(allSurgeryItem);

                    //val = val || "";

                    //let filteredAppointments = $scope.ApprovedSurgeryAppointments.filter(function (item) {
                    //    return item.OrganizationSurgeryName.toLowerCase().includes(val.toLowerCase());
                    //});

                    //if (filteredAppointments.length > 0) {
                    //    let i = 0;
                    //    angular.forEach(filteredAppointments, function (item) {

                    //        var object = {
                    //            "OrganizationProcedureId": item.OrganizationSurgeryId,
                    //            "PatientSurgeryId": item.PatientSurgeryId,
                    //            "ProcedureId": item.SurgeryId,
                    //            "OrganizationId": $scope.HospitalId,
                    //            "TypeOfServiceId": null,
                    //            "ProcedureCode": item.CPTCode,
                    //            "CPTCode": "",
                    //            "ProcedureName": item.OrganizationSurgeryName,
                    //            "ProcedureDescription": "",
                    //            "Notes": "",
                    //            "ModifierId": null,
                    //            "IsFrequent": false,
                    //            "CliaIDRequired": false,
                    //            "MamographyCertificateRequired": false,
                    //            "RefferingProviderRequired": false,
                    //            "PatientRecall": false,
                    //            "PatientRecallDays": 0,
                    //            "SlidingScaleRequired": false,
                    //            "SlidingScaleAmount": 0,
                    //            "ApplyGlobalPeriod": false,
                    //            "ApplyGlobalPeriodDays": 90,
                    //            "NDCCode": "",
                    //            "RevenueCode": "",
                    //            "UnitValue": 0,
                    //            "AnesthesiaValue": 10,
                    //            "GeneralCost": 0,
                    //            "DeleteInd": "N",
                    //            "ActiveInd": "Y",
                    //            "OrganName": item.OrganName || "",
                    //            "OrganId": item.OrganId || null,
                    //            "OrgSurgeryId": item.OrgSurgeryId || null,
                    //            "SurgerySuggestedDate": item.SurgerySuggestedDate || null,
                    //        }

                    //        response.data.rows.unshift(object);

                    //        i++;
                    //    });

                    //    if (i > 0) {
                    //        let allAdvisedItem = {
                    //            ProcedureCode: "",
                    //            ProcedureName: "Advised Surgeries",
                    //            CPTCode: "",
                    //            LoincCode: ""
                    //        };

                    //        response.data.rows.unshift(allAdvisedItem);
                    //    }
                    //}

                    return response.data.rows.map(function (item) {
                        //item.OrganName = item.OrganName || "";
                        return item;
                    });
                }
            }
        });
    };

    /* Advised Surgery list */

    //if (val != "") {

    //    return eHnoteSettingsDataService.GetOrganizationProceduresByType(obj).then(function (response) {
    //        if (response.data.Status == "Success") {
    //            if (response.data.rows.length !== 0) {
    //                if (response.data.rows.length > 0) {
    //                    angular.forEach(response.data.rows, function (item) {
    //                        if (item.CPTCode == "") {
    //                            if (item.LoincCode != '') {
    //                                item.CPTCode = item.LoincCode;
    //                            }
    //                        }
    //                    });
    //                }

    //                return response.data.rows.map(function (item) {
    //                    return item;
    //                });
    //            }
    //        }
    //    });
    //}

    //if (val == "") {

    //    let req = {
    //        "PatientId": $scope.selectedPatientObj.PatientId || 0,
    //        "SpecializationId": $scope.SpecializationId,
    //        "DoctorId": $scope.selectedAppointmentObject.DoctorID,
    //        "OrganizationId": $scope.HospitalId,
    //        "AppointmentTypeId": $scope.selectedAppointmentObject.AppointmentTypeId || null
    //    };

    //    return eHnoteDiagnosisDataServices.GetApprovedSurgeryAppointments(req).then(function (response) {
    //        if (response.data.status == "Success") {
    //            if (response.data.rows.length !== 0) {
    //                if (response.data.rows.length > 0) {
    //                    angular.forEach(response.data.rows, function (item) {
    //                        item.ProcedureName = item.OrganizationSurgeryName;
    //                    });
    //                }

    //                return response.data.rows.map(function (item) {
    //                    return item;
    //                });
    //            }
    //        }
    //    });
    //}

    /* End */

    $scope.PreAdmSurgeryToggle = function (obj) {


        let filterProcedure1 = $filter("filter")($scope.SelectedNewSurgeries, function (Aitem, index) { return Aitem.DeleteInd == 'N' },);
        if (filterProcedure1.length > 0) {
           // $scope.adviseObj.SeletedProcedureObj = "";
            alertify.error("Only one surgery allowed!");
            return false;
        }

        var filterProcedure = $filter("filter")($scope.SelectedNewSurgeries, function (Aitem, index) { return Aitem.OrgDescriptionId == obj.OrgSurgeryId && Aitem.DeleteInd == 'N' },);
        if (filterProcedure.length == 0) {
            $scope.adviseObj.SeletedProcedureObj = obj || '';
            let param = {
                "SurgeryListId": obj.SurgeryListId || 0,               
                "OrganId": obj.OrganId || null,
                "OrgSurgeryId": obj.OrgSurgeryId,
                "PatientSurgeryId": obj.PatientSurgeryId || 0,
                "SurgeryId": obj.SurgeryId || "",
                "SurgeryListId": obj.SurgeryListId || null,
                "DescriptionId": obj.SurgeryId || "",
                "Description": obj.OrganizationSurgeryName || "",
                "OrgDescriptionId": obj.OrgSurgeryId || 0,
                "Remarks": "",
                "DeleteInd": "N",
                "AdditionalSurgery": obj.AdditionalSurgery || [],
            }
            $scope.SelectedNewSurgeries.push(param);
            if ($scope.AdditionalSurgery.length > 0) {
                angular.forEach(param.AdditionalSurgery, function (Subitem) {
                    var filterProcedure = $filter("filter")($scope.AdditionalSurgery, function (Aitem, index) { return Aitem.OrgDescriptionId == Subitem.OrgDescriptionId && Aitem.DeleteInd == 'N' }) || [];
                    if (filterProcedure.length == 0) {
                        var object = {
                            "PatientSurgeryId": Subitem.PatientSurgeryId || 0,
                            "PatientAdditionalSurgeryId": Subitem.PatientAdditionalSurgeryId || 0,
                            "DescriptionId": Subitem.DescriptionId || "",
                            "Description": Subitem.Description || "",
                            "OrgDescriptionId": Subitem.OrgDescriptionId || 0,
                            "OrganId": Subitem.OrganId || null,
                            "Remarks": "",
                            "DeleteInd": "N",
                        }
                        $scope.AdditionalSurgery.push(object);
                    }
                });
                let filterProcedure1 = $filter("filter")($scope.SelectedNewSurgeries, function (Aitem, index) { return Aitem.DeleteInd == 'N' },);
                if (filterProcedure1.length == 0) {
                    $scope.adviseObj.IsAdditionalSurgery = false;
                } else {
                    $scope.adviseObj.IsAdditionalSurgery = true;
                }
            } else if (param.AdditionalSurgery.length > 0) {
/*                console.log(param.AdditionalSurgery);*/
                /*$scope.AdditionalSurgery = param.AdditionalSurgery||[]*/
                angular.forEach(param.AdditionalSurgery, function (Subitem) {
                    var object = {
                        "PatientSurgeryId": Subitem.PatientSurgeryId || 0,
                        "PatientAdditionalSurgeryId": Subitem.PatientAdditionalSurgeryId || 0,
                        "DescriptionId": Subitem.DescriptionId || "",
                        "Description": Subitem.Description || "",
                        "OrgDescriptionId": Subitem.OrgDescriptionId || 0,
                        "OrganId": Subitem.OrganId || null,
                        "Remarks": "",
                        "DeleteInd": "N",
                    }
                    $scope.AdditionalSurgery.push(object);
                });
                let filterProcedure1 = $filter("filter")($scope.SelectedNewSurgeries, function (Aitem, index) { return Aitem.DeleteInd == 'N' },);
                if (filterProcedure1.length == 0) {
                    $scope.adviseObj.IsAdditionalSurgery = false;
                } else {
                    $scope.adviseObj.IsAdditionalSurgery = true;
                }
            }

        }
    }

    $scope.OnClickAdvisedProcedure = function (Subitem, Ind) {

        //if (Subitem.ProcedureName == "All Surgeries" || Subitem.ProcedureName == "Advised Surgeries") {
        //    $scope.adviseObj.IsAdditionalSurgery = false;
        //    $scope.adviseObj.SearchProcedureObj = "";
        //    return false;
        //}

       
        //$scope.SelectedNewSurgeries = $scope.SelectedNewSurgeries || [];

        //var index = 0;
        //if ($scope.SelectedNewSurgeries.length > 0) {
        //    let tempselectedsurgery = $filter("filter")($scope.SelectedNewSurgeries, function (Aitem, index) { return Aitem.DeleteInd == 'N' }) || [];
        //    if (tempselectedsurgery.length > 0) {
        //        index++;
        //    }
        //}

        Ind = Ind || false;

        if (Ind == true) {

            let filterProcedure2 = $filter("filter")($scope.SelectedNewSurgeries, function (Aitem, index) { return Aitem.DeleteInd == 'N' });
            if (filterProcedure2.length == 0) {
                $scope.adviseObj.IsAdditionalSurgery = false;
                $scope.adviseObj.SearchProcedureObj = "";
                alertify.error("Please select the surgery");
                return false;
            }

            let filterProcedure3 = $filter("filter")($scope.SelectedNewSurgeries, function (Aitem, index) { return Aitem.OrgDescriptionId == Subitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' },);
            if (filterProcedure3.length > 0) {
                $scope.adviseObj.SearchProcedureObj = "";
                alertify.error("Surgery Already Selected!");
                return false;
            }

            //if ($scope.SelectedNewSurgeries.length == 0) {
            //    alertify.error('Please Select Surgery');
            //    return false;
            //}
            $scope.AdditionalSurgery = $scope.AdditionalSurgery || [];
         
            if ($scope.AdditionalSurgery.length > 0) {
                var filterProcedure = $filter("filter")($scope.AdditionalSurgery, function (Aitem, index) { return Aitem.OrgDescriptionId == Subitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' });
            
                if (filterProcedure.length > 0) {
                    $scope.adviseObj.SearchProcedureObj = "";
                    alertify.error("Surgery Already Selected!");
                    return false;
                }

                var filterProcedure1 = $filter("filter")($scope.AdditionalSurgery, function (Aitem, index) { return Aitem.DeleteInd == 'N' });
                if (filterProcedure1.length == 4) {
                    $scope.adviseObj.SearchProcedureObj = "";
                    alertify.error("Maximum limit exceeded!");
                    return false;
                }
            }

            var SurgOrganId = null;
            if ($scope.SelectedNewSurgeries.length > 0) {
                let filterProcedure2 = $filter("filter")($scope.SelectedNewSurgeries, function (Aitem, index) { return Aitem.DeleteInd == 'N' })||[];
                if (filterProcedure2.length>0) {
                    SurgOrganId = filterProcedure2[0].OrganId || null;
                }
            }

            var object = {
                "PatientSurgeryId": 0,
                "PatientAdditionalSurgeryId": 0,
                "DescriptionId": Subitem.ProcedureId || "",
                "Description": Subitem.ProcedureName || "",
                "OrgDescriptionId": Subitem.OrganizationProcedureId || 0,
                "OrganId": SurgOrganId || null,
                "Remarks": "",
                "DeleteInd": "N",
            }
            $scope.AdditionalSurgery.push(object);

        } else {


            if ($scope.SelectedNewSurgeries.length > 0) {

                let filterProcedure1 = $filter("filter")($scope.SelectedNewSurgeries, function (Aitem, index) { return Aitem.DeleteInd == 'N' },);
                if (filterProcedure1.length > 0) {
                    $scope.adviseObj.SearchProcedureObj = "";
                    alertify.error("Only one surgery allowed!");
                    return false;
                }

                let filterProcedure = $filter("filter")($scope.SelectedNewSurgeries, function (Aitem, index) { return Aitem.OrgDescriptionId == Subitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' },);
                if (filterProcedure.length > 0) {
                    $scope.adviseObj.SeletedProcedureObj = "";
                    alertify.error("Surgery Already Selected!");
                    return false;
                }
            }

            //if (Subitem.OrderTypeId == 3) {
            var object = {
                "PatientOrderId": 0,
                "SpecializationId": $scope.SpecializationId,
                "OrderTypeId": Subitem.OrderTypeId,
                "DescriptionId": Subitem.ProcedureId || "",
                "Description": Subitem.ProcedureName || "",
                "ProcedureCode": Subitem.ProcedureCode || 0,
                "OrgDescriptionId": Subitem.OrganizationProcedureId || 0,
                "Remarks": "",
                "OrganId": 1,
                "OrganName": "OD",
                "BillingCode": "",
                "BookingStatusId": "2",
                //"CPTCode": Subitem.CPTCode,
                "CPTCode": Subitem.ProcedureCode,
                "DeleteInd": "N",
                "InvSpecialityId": "",
                "PatientSurgeryId": 0,
                "SurgeryListId": 0,
                "IsEditData": false,
                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "DurationType": Subitem.DurationType || "D",
                "CoordinatorId": Subitem.CoordinatorId || 0,
                "ExternalCoManagerId": Subitem.ExternalCoManagerId || 0,
                "InternalCoManagerId": Subitem.InternalCoManagerId || 0,
                "ShowDateFormat": true,
                "Duration": '',
                "DurationType": '',
                "DurationDate": '',
                "DiagnosisList": [],
                "OrderType": Subitem.OrderType,
                "ModalityId": 1,
                "AdvicedInvestigationId": 0,
                "PatientInvestigationId": 0,
                "PatientProcedureId": 0,
                "StatusId": 1,
                "Status": "Active",
                "CoordinatorNotes": "",
                "CoordinatorStatusId": null,
                "PreAdmissionDate": "",
                "AscAppointmentDate": "",
                "FirstFollowupDate": "",
                "SecondFollowupDate": "",
                "ThirdFollowupDate": "",
                "SurgeonId": null,
                "CoSurgeonId": null,
                "NurseId": null,
                "AnesthetistId": null,
            }
            $scope.SelectedNewSurgeries.push(object);
            $scope.adviseObj.SeletedProcedureObj = "";
        //}
        }


        $scope.adviseObj.SearchProcedureObj = "";

        $scope.adviseObj.DiagnosisObject = "";

    };

    $scope.RemoveAdditionalSurgery = function (item) {
        item.PatientAdditionalSurgeryId = item.PatientAdditionalSurgeryId || 0;
       
        if (item.PatientAdditionalSurgeryId != 0) {
            item.DeleteInd = "Y";
        } else {
            var index = $scope.AdditionalSurgery.indexOf(item);
            if (index > -1) {
                $scope.AdditionalSurgery.splice(index, 1);
            }

        }
    }

    $scope.RemoveNewSelectedSurgery = function (item) {
        if ($scope.AdditionalSurgery.length > 0) {
            alertify.confirm(
                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Do you wish to delete this surgery as there are additional surgeries added to this appointment? </h4>",
                function () {
                    item = item || "";
                    $scope.adviseObj.SeletedProcedureObj = '';
                    item.PatientSurgeryId = item.PatientSurgeryId || 0;
                    if (item.PatientSurgeryId != 0) {
                        item.DeleteInd = "Y";
                    } else {
                        let index = $scope.SelectedNewSurgeries.indexOf(item);
                        if (index > -1) {
                            $scope.SelectedNewSurgeries.splice(index, 1);
                        }

                    }
                    if ($scope.AdditionalSurgery.length > 0) {
                        var indexesToRemove = [];
                        angular.forEach($scope.AdditionalSurgery, function (aitem) {
                            if (aitem.PatientAdditionalSurgeryId != 0) {
                                aitem.DeleteInd = "Y";
                            } else {
                                var index = $scope.AdditionalSurgery.indexOf(aitem);
                                if (index > -1) {
                                    /*$scope.AdditionalSurgery.splice(index, 1);*/
                                    indexesToRemove.push(index);
                                }

                            }
                        });
                        indexesToRemove.reverse().forEach(function (index) {
                            $scope.AdditionalSurgery.splice(index, 1);
                        });
                        $scope.adviseObj.IsAdditionalSurgery = false;
                    }
                    $scope.$digest();
                },
                function () {});
        } else {

            item = item || "";
            $scope.adviseObj.SeletedProcedureObj = '';
            item.PatientSurgeryId = item.PatientSurgeryId || 0;
            if (item.PatientSurgeryId != 0) {
                item.DeleteInd = "Y";
            } else {
                let index = $scope.SelectedNewSurgeries.indexOf(item);
                if (index > -1) {
                    $scope.SelectedNewSurgeries.splice(index, 1);
                }
            }
        }
    };

    $scope.changeReferalDoctor = function (item) {
        item = item || '';
        $scope.selectedAppointmentObject.SurgeryReferralDoctorId = item.SurgeryReferralDoctorObj.DoctorID;
    };
    $scope.ChangeAdditionalSurgeryInd = function (item) {
        console.log(item);
        let filterProcedure1 = $filter("filter")($scope.SelectedNewSurgeries, function (Aitem, index) { return Aitem.DeleteInd == 'N' },);
        if (filterProcedure1.length == 0) {
            $scope.adviseObj.IsAdditionalSurgery = false;
            alertify.error("Please select the surgery");
            return false;
        }
    };
    $scope.AddNewInsuranceToPatient = function () {
        $scope.paymentTypeObj.PaymentTypeId = "2"; //"1";
        $scope.paymentTypeObj.IsPaymentTypeInd = false; // true;
        $scope.PatientInsuranceObj.PayorId = 0;
        $scope.PatientInsuranceObj.CoverageId = 0;
        $scope.PatientInsuranceObj.PlanId = 0;
        $scope.PatientInsuranceObj.PolicyId = '';
        $scope.PatientInsuranceObj.PlanCode = '';
        $scope.PatientInsuranceObj.PayorObj = "";
        $scope.PatientInsuranceObj.PlanObj = '';
        $scope.PatientInsuranceObj.GroupId = '';
        $scope.PatientInsuranceObj.OrganizationPayorId = '';
        $scope.PatientInsuranceObj.PatientInsuranceDetailId = 0;
        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
        $scope.PatientInsuranceObj.IsGroupIdDiasibleInd = false;
        $scope.PatientInsuranceObj.IsPolicyIdDiasibleInd = false;
        $scope.PatientInsuranceObj.IsPayorPlanDiasibleInd = false;
    }

    $scope.GetSearchPCPObj = function () {
        return {
            'LocationId': null,
            'PageNumber': 1,
            'PageSize': 10,
            'SearchTaxt': '',
            "SpecializationId": null,
            "DeleteInd": "N",
            "OrganizationId": $scope.HospitalId,
            "RefaralTypeId": "",
            "NewpcpDoctor": false
        }
    };
    $scope.SearchPCPObj = angular.copy($scope.GetSearchPCPObj());

    $scope.SearchPCPDOClist = function (val) {
        var reqObj = {
            'LocationId': $scope.SearchPCPObj.LocationId,
            'PageNumber': $scope.SearchPCPObj.PageNumber,
            'PageSize': $scope.SearchPCPObj.PageSize,
            'SearchTaxt': val||'',
            "SpecializationId": $scope.SearchPCPObj.SpecializationId,
            "DeleteInd": $scope.SearchPCPObj.DeleteInd,
            "OrganizationId": $scope.SearchPCPObj.OrganizationId,
            "RefaralTypeId": 2

        };


        return eHnoteReferalDataService.GetReferalPCPDoctors(reqObj).then(function (resp) {
            if (resp.data.PcpRefdetails.length !== 0) {
                $scope.SearchPCPObj.NewpcpDoctor = false;

                return resp.data.PcpRefdetails.map(function (item) {

                    return item;
                });

            } else {
                $scope.SearchPCPObj.NewpcpDoctor = true;
            }
        });

    };
 /*   $scope.selectedAppointmentObject.IsReferralDoctornotes = false;*/
    $scope.OnclickPcpdoctorBind = function (item,notes) {
        item = item || '';
        if (item != '') {
            $scope.selectedAppointmentObject.OtherProviderDoctorName = item.FullName || '';
            $scope.selectedAppointmentObject.OtherProviderDoctorID = item.DoctorID || 0;
            if ($scope.selectedAppointmentObject.OtherProviderDoctorName != '') {
                $scope.selectedAppointmentObject.IsReferralDoctornotes = true;
            }
        } else {
            $scope.selectedAppointmentObject.OtherProviderDoctorName = '';
            $scope.selectedAppointmentObject.OtherProviderDoctorID = 0;
        }

    }
    $scope.OnclickinternlDoctorBind = function () {
        if ($scope.selectedAppointmentObject.OtherProviderDoctorName.length > 3) {
            $scope.selectedAppointmentObject.IsReferralDoctornotes = true;
        } else {
            $scope.selectedAppointmentObject.IsReferralDoctornotes = false;
        }
    }

    $scope.GetPCPObj = function () {
        return {
            "PcpReferalId": 0,
            "FirstName": "",
            'LastName': '',
            'SuffixId': '',
            'Title': 'Mr',
            'Age': null,
            "MobileNo": null,
            "AlternateMobileNo": null,
            "Gender": "Male",
            "EmailId": "",
            'Address1': '',
            'Address2': '',
            'LocationId': null,
            "StateId": 0,
            'CityId': 0,
            'PinCode': '',
            'NPI': '',
            'SSN': '',
            'EmployeeId': '',
            'ZipCodePlusNo': '',
            "SpecializationId": null,
            //"DeleteInd": false,
            "DeleteInd": "N",
            "countrycode": "",
            "OrganizationId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "ZipCode": '',
            "LocationName": "",
            "CityName": "",
            "CityId": "",
            "StateName": "",
            "StateId": "",
            "ContactNo": null,
            "Slicence": "",
            "TaxonomyId": "",
            "Contactcountrycode": '+1',
            'RefaralDr': '',
            'RefaralTypeId': '',
            'RefaralTypeName': '',
            'CountyName': '',
            'CountyId': 0,
            'CountryName': '',
            'CountryId': 0,
            'CLIAID': '',
            'EmployeeId': '',
            'LIC': '',
            'PCPOrganization': '',
            'WWW': '',
            'PCPNotes': '',
            'SubSpecializationId': '',
            'Fax': '',
            'Alternatecountrycode': '+1',
            'Faxcountrycode': '+1',
            'Contact': "",
            'PCPSubSpecializations': []

        };
    };
    $scope.PCPObj = angular.copy($scope.GetPCPObj());
    $scope.AddReferalPCPDoctor = function () {
        //$scope.PCPObj.RefaralTypeId = $scope.PCPObj.RefaralTypeId || null;
        //if ($scope.PCPObj.RefaralTypeId === null) {
        //    alertify.error("Please Select Referal Doctor");
        //    return;
        //}


/*        $scope.PCPObj.FirstName = $scope.PCPObj.FirstName || ""*/
        //$scope.PCPObj.MobileNo = $scope.PCPObj.MobileNo || "";
        //$scope.PCPObj.AlternateMobileNo = $scope.PCPObj.AlternateMobileNo || "";
        //$scope.PCPObj.Fax = $scope.PCPObj.Fax || "";
        //$scope.PCPObj.NPI = $scope.PCPObj.NPI || '';

        


       
        if ($scope.selectedAppointmentObject.PCPDoctor != '') {

        $scope.PCPObj.FirstName = $scope.selectedAppointmentObject.PCPDoctor || '';

        var reqObj = {
            "PcpReferalId": 0,
            "FirstName": $scope.PCPObj.FirstName,
            'LastName': $scope.PCPObj.LastName,
            'Title': $scope.PCPObj.Title,
            'Age': $scope.PCPObj.Age || null,
            "MobileNo": $scope.PCPObj.MobileNo,
            "AlternateMobileNo": $scope.PCPObj.AlternateMobileNo,
            "Gender": $scope.PCPObj.Gender,
            "EmailId": $scope.PCPObj.EmailId,
            "SuffixId": $scope.PCPObj.SuffixId,
            'Address1': $scope.PCPObj.Address1,
            'Address2': $scope.PCPObj.Address2,
            'LocationId': $scope.PCPObj.LocationId,
            "StateId": $scope.PCPObj.StateId || 0,
            "StateName": $scope.PCPObj.StateName || '',
            'CityId': $scope.PCPObj.CityId || 0,
            'CityName': $scope.PCPObj.CityName || '',
            'CountryId': $scope.PCPObj.CountryId || 0,
            'CountryName': $scope.PCPObj.CountryName || '',
            'PinCode': $scope.PCPObj.ZipCode || '',
            'ZipCodePlusNo': $scope.PCPObj.ZipCodePlusNo,
            "SpecializationId": $scope.PCPObj.SpecializationId,
            "DeleteInd": $scope.PCPObj.DeleteInd,
            "countrycode": $scope.PCPObj.CountryId,
            "OrganizationId": $scope.HospitalId,
            "UserId": $scope.UserId,
            'NPI': $scope.PCPObj.NPI,
            'SSN': $scope.PCPObj.SSN || '',
            'EmployeeId': $scope.PCPObj.EmployeeId || '',
            'Slicence': $scope.PCPObj.Slicence,
            'TaxonomyId': $scope.PCPObj.TaxonomyId,
            'ContactNo': $scope.PCPObj.ContactNo,
            'Contactcountrycode': $scope.PCPObj.Contactcountrycode,
            'RefaralTypeId': 2,
            'RefaralTypeName': "Referral",
          //  'RefaralTypeName': "Referral For BookAppt",
            'ZipCode': $scope.PCPObj.ZipCode,
            'County': $scope.PCPObj.CountyId,
            'CLIAID': $scope.PCPObj.CLIAID,
            'EmployeeId': $scope.PCPObj.EmployeeId,
            'LIC': $scope.PCPObj.LIC,
            'PCPOrganization': $scope.PCPObj.PCPOrganization,
            'WWW': $scope.PCPObj.WWW,
            'PCPNotes': $scope.PCPObj.PCPNotes,
            'SubSpecializationId': $scope.PCPObj.SubSpecializationId,
            'Fax': $scope.PCPObj.Fax,
            'Faxcountrycode': $scope.PCPObj.Faxcountrycode,
            'Alternatecountrycode': $scope.PCPObj.Alternatecountrycode,
            'Contact': $scope.PCPObj.Contact,
            'PCPSubSpecializations': $scope.PCPObj.PCPSubSpecializations

        };





        eHnoteReferalDataService.ModifyReferalPCPDoctor(reqObj).then(function (resp) {

            if (resp.data.Status == "Success") {
                alertify.success("Successfully Added");
                $scope.SearchPCPDOClist();
                $scope.SearchPCPObj.NewpcpDoctor = false;
                /* $scope.selectedAppointmentObject.PCPDoctor = '';*/
                $scope.selectedAppointmentObject.OtherProviderDoctorName = $scope.selectedAppointmentObject.PCPDoctor || '';
                $scope.selectedAppointmentObject.OtherProviderDoctorID = resp.data.PcpReferalId || 0;
                if ($scope.selectedAppointmentObject.OtherProviderDoctorName != '') {
                    $scope.selectedAppointmentObject.IsReferralDoctornotes = true;
                }
            }
            else {
                alertify.error(resp.data.Message);
            }
          

        });
        }
    };
    $scope.OnchangeReferal = function () {
        $scope.selectedAppointmentObject.OtherProviderDoctorName = '';
        $scope.selectedAppointmentObject.PCPDoctor = '';
        $scope.selectedAppointmentObject.OtherProviderDoctorID = null;
        $scope.SearchPCPObj.NewpcpDoctor = false;
    }
}]);
"use strict";
eHnoteWebApp.controller("UsDayDoctorTimeLineFullCalendarCtl", ["$scope", "$http", "$log", "$rootScope", "$uibModal", "$routeParams", "$filter", "$timeout", "alertify", "eHnoteMasterDataService", "eHnoteUserDataService", "eHnoteMainAppointmentService", "eHnotePatientDataService", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnoteMainAdminServices", "datapersistanceFactory", "$window", "eHnotePatientVisitReasonServices", "eHnoteCacheStorageService", "$location", function ($scope, $http, $log, $rootScope, $uibModal, $routeParams, $filter, $timeout, alertify, eHnoteMasterDataService, eHnoteUserDataService, eHnoteMainAppointmentService, eHnotePatientDataService, eHnoteUserAppointmentDataService, localStorageFactory, eHnoteMainAdminServices, datapersistanceFactory, $window, eHnotePatientVisitReasonServices, eHnoteCacheStorageService, $location) {


    // $scope.SearchObj.ConsultationDt is a plain string shared with the parent appointments
    // controller. `new Date(str)` on it is unsafe two different ways: a date-only ISO string
    // ("2026-08-25") is parsed as UTC midnight per spec, so it reads back as the PREVIOUS local day
    // in any negative-UTC-offset timezone, and "MM-DD-YYYY" isn't a format the spec requires any
    // engine to parse at all (WebKit returns Invalid Date for it, which silently blanks the grid).
    // Both showed up on iPad. Route every read of the date through these so parsing is explicit and
    // always in local time.
    function normalizeToYMD(value) {
        if (!value) return '';
        if (value instanceof Date) {
            return moment(value).format('YYYY-MM-DD');
        }
        var m = moment(value, ["YYYY-MM-DD", "MM-DD-YYYY", "D-MMM-YYYY", "DD/MM/YYYY"], true);
        if (m.isValid()) {
            return m.format('YYYY-MM-DD');
        }
        m = moment(value);
        return m.isValid() ? m.format('YYYY-MM-DD') : '';
    }
    function safeNewDate(dateStr, timeStr) {
        if (!dateStr) return new Date();
        if (dateStr instanceof Date) return dateStr;
        // A moment stringifies to "Wed Aug 26 2026 00:00:00 GMT+0530", which none of the formats
        // below match — without this it would fall through and silently return TODAY instead.
        if (moment.isMoment(dateStr)) return dateStr.toDate();
        dateStr = String(dateStr).split('T')[0].split(' ')[0];
        var normalized = normalizeToYMD(dateStr);
        if (!normalized) return new Date();
        if (timeStr) {
            return moment(normalized + 'T' + timeStr).toDate();
        } else {
            return moment(normalized, 'YYYY-MM-DD').toDate();
        }
    }
    // Slot handlers build display strings like "26-Aug-2026 21:30" and hand them straight to
    // `new Date(...)`. Neither "DD-MMM-YYYY" nor a space-separated "YYYY-MM-DD HH:mm" is a format
    // the spec requires an engine to parse: V8 accepts both via its legacy parser, WebKit returns
    // Invalid Date. That is why the today/past-slot comparison silently fell through on iPad — the
    // date it compared was NaN — so past slots were never rejected and the alert never fired.
    // Parse explicitly instead. Mirrors parseCalenderDate() in EhnoteNewAppointmentListCtrl (OP).
    function parseCalenderDate(value) {
        if (!value) return new Date();
        if (value instanceof Date) return value;
        if (moment.isMoment(value)) return value.toDate();
        var m = moment(value, [
            "DD-MMM-YYYY HH:mm:ss", "DD-MMM-YYYY HH:mm", "DD-MMM-YYYY",
            "YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD HH:mm", "YYYY-MM-DD"
        ], true);
        return m.isValid() ? m.toDate() : safeNewDate(value);
    }
    // Local-midnight Date for a consultation date.
    // Call with no argument to use the currently selected date ($scope.SearchObj.ConsultationDt);
    // pass any Date / moment / date string to convert that one instead. Accepts "YYYY-MM-DD",
    // "MM-DD-YYYY", "D-MMM-YYYY" and "DD/MM/YYYY", with or without a trailing time.
    // NOTE: the result is always local MIDNIGHT — any time component is dropped. If you need the
    // time too, use safeNewDate(dateStr, timeStr) directly.
    function apptConsultationDate(value) {
        return safeNewDate(value || $scope.SearchObj.ConsultationDt);
    }
    // Outgoing API date param, always "MM-DD-YYYY" — the exact string a desktop browser sends.
    // Chrome leaves ConsultationDt as "MM-DD-YYYY", but the Safari branch of the watcher in
    // EhnoteNewAppointmentListCtrl rewrites it to "YYYY-MM-DD"; whichever format happens to be in
    // there at request time was being posted verbatim, so iPad and web asked the server for the same
    // day using two different strings. Normalise on the way OUT only — $scope.SearchObj.ConsultationDt
    // is shared with many other screens and is never written to from here.
    // Same optional-argument rule as apptConsultationDate().
    function apptConsultationParam(value) {
        return moment(apptConsultationDate(value)).format('MM-DD-YYYY');
    }

    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    }
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    var qtipDown = false;
    $scope.clinicDoctorList = [];
    $scope.clinicOptometristsList = [];
    $scope.clinicARAssistantList = [];
    $scope.clinicDoctorDepList = [];
    $scope.clinicDoctorCalendar = [];
    $scope.eventsList1 = [];
    $scope.eventsList = [];
    $scope.cancelAppPopup = false;
    $scope.subMaindoc = {
        "DoctorsList": []
    }
    $scope.SetupPopUp = "";
    console.log($scope.SearchObj.ConsultationDt);

    var calendar;

    $scope.AddFilter = function () {
        $scope.ShowFilterView = !$scope.ShowFilterView;
    };

    console.log($scope.calobj);
    console.log($scope.evencalobj);

    $scope.CurrentUrl = "";
    if ($scope.PresentScreenObj != undefined) {
        $scope.CurrentUrl = $scope.PresentScreenObj.url || "";
    }
    $scope.PresentcurrentUrl = $location.url();

    $scope.PopoverBtnObj = {
        "appointmentStatus": "",
        "CheckinStatusId": 0,
    }
    //$scope.ApptFilterObj = {
    //    "IsNoShowAppointment": false,
    //    "IsNoShowAppointment1": false
    //};

    var screenobj = eHnoteMasterDataService.getSelectedCrmApptDates() || {};
    function getfreezingDetails() {

        screenobj.Screen = screenobj.Screen || "";
        var filtergetfreezelist = "";
        var getfreezelist = {
            "SelectedDoctorsList": []
        };

        if (screenobj.Screen == "/crm") {
            filtergetfreezelist = eHnoteMasterDataService.getSelectedCRMWorkDoctors();

            var SelectedApptTabFreeze = eHnoteMasterDataService.getSelectedCRMApptTabFreeze();
            SelectedApptTabFreeze.Date = SelectedApptTabFreeze.Date || "";
            if (SelectedApptTabFreeze.Date != '') {
                $scope.SearchObj.ConsultationDt = SelectedApptTabFreeze.Date;
            } else {
                //$scope.SearchObj.ConsultationDt = $filter("date")(new Date(), "MM-dd-yyyy");
            }

        } else if (screenobj.Screen == "/op") {
            filtergetfreezelist = eHnoteMasterDataService.getSelectedOPUsers();
        } else if (screenobj.Screen == "ASC") {
            filtergetfreezelist = eHnoteMasterDataService.getSelectedPreAdminList();
        }

        if (filtergetfreezelist != '' && filtergetfreezelist != undefined) {
            getfreezelist.SelectedDoctorsList = filtergetfreezelist.SelectedDoctorsList || [];
        }
        if (getfreezelist.SelectedDoctorsList.length > 0) {
            angular.forEach($scope.Calendardoctorlist1, function (Mitem) {
                Mitem.isChecked = false;
            });
            angular.forEach(getfreezelist.SelectedDoctorsList, function (Selecteditem) {
                angular.forEach($scope.Calendardoctorlist1, function (Mainitem) {
                    if (Selecteditem.DoctorID == Mainitem.DoctorID) {
                        Mainitem.isChecked = true;
                    }
                });
            });
            $scope.Calendardoctorlist1 = $filter("filter")($scope.Calendardoctorlist1, function (item) { return item.isChecked === true }, true);
        }

        eHnoteMasterDataService.addCalendarDoctorinAppList($scope.Calendardoctorlist1);
    }

    $scope.init = function () {


        $scope.Calendardoctorlist1 = eHnoteMasterDataService.getCalendarDoctorinAppList();



        console.log($scope.Calendardoctorlist1);

        $scope.Calendardoctorlist1 = $scope.Calendardoctorlist1 || [];

        if ($scope.mainAppointmentView.isCalendarorList === 'calendar') {
            getfreezingDetails();
        }

        $scope.SelectSlotDuration = '00:15';

        $scope.Calendardoctorlist1 = $filter("filter")($scope.Calendardoctorlist1, function (item, index) { return item.DoctorID !== 0; }) || [];

        onclickPageLoad()

        // $scope.loadDayView();
        eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
        function onspecsuccess(data) {
            $scope.specialitylist = data;
            var specAll = { "Id": 0, "Name": "All" };
            $scope.specialitylist.unshift(specAll);
        }
        function onspecfailure(data) {
        }

    };
    $scope.init();



    $scope.getListingDetailsonDateChange = function (refDate) {
        $scope.SearchObj.ConsultationDt = $filter("date")(new Date(refDate), "dd-MMM-yyyy");
        onclickallDoctor();
    };
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

    //angular.element('body').on('mouseenter', '#calControl .fc-agendaDay-view .fc-slats .fc-widget-content', function (event) {
    //    if (!angular.element(this).hasClass('fc-axis')) {
    //        angular.element(this).addClass('fc-time-hover');
    //    }
    //});
    //angular.element('body').on('mouseleave', '#calControl .fc-agendaDay-view .fc-slats .fc-widget-content', function (event) {
    //    angular.element(this).removeClass('fc-time-hover');
    //});
    function getSpecialityDesc(splCode) {
        var spl = "";
        angular.forEach(doctorinfo.specialitylist, function (item) {
            if (item.DoctorSpecialityID === splCode) {
                spl = item.DoctorSpecialityDesc;
                return;
            }
        });
        return spl;
    }
    function getDoctorSpecialities(screen) {
        var value = "";
        var speciality = {};
        speciality = $scope.selectedDoctor.SpecialityCD;
        for (var i in speciality) {
            value += ", " + getSpecialityDesc(speciality[i]);
        }
        if (value.charAt(0) === ",") return angular.copy(value);
    }
    $scope.CancelReason = "";
    $scope.OtherCancelReason = '';
    $scope.UpdateCancel = function (Cancelform, CancelReason, OtherCancelReason) {
        var currentdaycode = $filter("date")($scope.getCurrentDate(), "EEE").toUpperCase();

        var Cancelinfo = CancelReason === "Others" ? OtherCancelReason : CancelReason;
        if (CancelReason === "Others") {
            if (OtherCancelReason === '') {
                alertify.error('Please Enter Reason for Cancel');
                return false;
            }
        }
        if (Cancelinfo === '') {
            alertify.error('Please Select Reason For Cancellation');
            return false;
        }

        $scope.cancelAppPopup = true;
        var CurrentCheckOutTime = $filter("date")(new Date(), "HH:mm:ss");
        var AppmntParams = {
            "AppointmentID": $scope.Cancelappointmentinfo.AppointmentID,
            "AppointmentStatus": "C",
            "StartTime": $scope.CancelStTime,
            "EndTime": $scope.CancelEdTime,
            "IsFollowUp": false,
            "DoctorID": $scope.Canceldoctorid,
            "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
            "DayCD": currentdaycode,
            "VisitUserTypeID": "OPATIENT",
            "OtherVisitRsn": "",
            "ConsultationDt": $scope.CanceltmpConsultationDt,
            "PatientID": $scope.Cancelappointmentinfo.PatientID,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "USRType": "DOCTOR",
            "DoctorVisitRsnID": $scope.CancelVisitRsnType,
            "HospitalDetails": {
                "HospitalID": $scope.HospitalId,
                "LoginHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,//For sms Purpose added by sabarish
                "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,//For sms Purpose added by sabarish
                "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
            },
            "CommunicationDetails": {
                "PatientName": $scope.Patientname,
                "PatientMobile": $scope.MobileNumber,
                "DoctorMobile": $scope.DocPHnumber,
                "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "DoctorName": $scope.DoctorFullName,
                "AppDate": $scope.appDate,
                "AppTime": $scope.TIME,
                "AppClinic": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "AppToken": 0,
                "PatientEmail": $scope.EmailId,
                "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail || "",
                "DoctorEmail": $scope.DoctorEmail,
                "HospitalContact": doctorinfo.doctordata.UserAddress[0].MobileNo,
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
                "CommunicationEmailId": $scope.DoctorEmail || "", // $scope.CommunicationEmailId || "",
                "CommunicationMobileNo": $scope.DocCommunicationPhnumber || ""
            },
            "SendDocSms": $scope.CancelAppointmentobj.sendDocSms,
            "SendDocEmail": $scope.CancelAppointmentobj.sendDocEmail,
            "SendPatientEmail": $scope.CancelAppointmentobj.sendPatientEmail,
            "SendPatientSms": $scope.CancelAppointmentobj.sendPatientSms,
            "StatusDescription": Cancelinfo,
            "PaidFollowup": false,
            "IsTeleMedicineSlot": $scope.IsTeleMedicineSlot,
            "SubSpecializationId": $scope.Cancelappointmentinfo.SubSpecializationId,
            "BranchSubSpecializationId": $scope.Cancelappointmentinfo.BranchSubSpecializationId,
            "CurrentTime": CurrentCheckOutTime || null,
            "IsCheckedIn": $scope.Cancelappointmentinfo.CheckinStatusId || 1,
            "VisitTypeId": $scope.Cancelappointmentinfo.VisitTypeId || null,
            "AppointmentPatientTypeId": $scope.Cancelappointmentinfo.AppointmentPatientTypeId || 1,
            "PatientSmsLanguageId": 152,
            "ParentAppointmentVisitReasonId": $scope.Cancelappointmentinfo.VisitTypeId || null
        };

        eHnoteUserAppointmentDataService.AddUpdateAppointmentService(AppmntParams, OnAddApointmentSuccess, OnCaseSaveError);
        function OnAddApointmentSuccess(data) {
            alertify.success("Appointment Cancelled Successfully");

            // $scope.loadAppointments($scope.selectedDoctor, '');
            $scope.loadDayView();
            $scope.cancelAppPopup = false;
            $scope.showEditAppointmentID = true;
            $scope.sendDocSms = false;
            $scope.sendDocEmail = false;
            $scope.sendPatientSms = false;
            $scope.sendPatientEmail = false;

            $scope.CancelAppointmentobj.sendDocSms = false;
            $scope.CancelAppointmentobj.sendPatientSms = false;
            $scope.CancelAppointmentobj.sendDocEmail = false;
            $scope.CancelAppointmentobj.sendPatientEmail = false;

            if ($scope.CommunicationdetailsArray !== undefined && $scope.CommunicationdetailsArray.length > 0) {
                angular.forEach($scope.CommunicationdetailsArray, function (item, index) {
                    if (item.Mode === 'doctor') {
                        $scope.sendDocSms = item.SmsSettingsObj.Appointment;
                        $scope.sendDocEmail = item.EmailSettingObj.Appointment;
                    }
                    if (item.Mode === 'patient') {
                        $scope.sendPatientSms = item.SmsSettingsObj.Appointment;
                        $scope.sendPatientEmail = item.EmailSettingObj.Appointment;
                    }
                });
            }
            if (data.response.TokenNumber) {
                $scope.Token = data.response.TokenNumber;
            }
        }
        function OnCaseSaveError(data) {
            alertify.error("Error in Cancelling Appointment");
        }
    };
    $scope.closeCancelPopup = function () {
        $scope.cancelAppPopup = false;
        $scope.CancelAppointmentobj.Ispopup = false;
        $scope.mInstanceEdit.dismiss("cancel");
    };

    var phoneNumberString = "";
    $scope.DisplayNumber = "";
    $scope.formatUSNumber = function () {
        if ($scope.MobileNumber != "") {
            var phoneNumberString = $scope.MobileNumber;
            console.log($scope.MobileNumber);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''

            $scope.DisplayNumber = part1 + part2 + part3;

        }
    }

    $scope.UpdatePopup = function (Cancelform, CancelReason, OtherCancelReason) {
        $scope.formatUSNumber();
        var currentdaycode = $filter("date")($scope.getCurrentDate(), "EEE").toUpperCase();

        var Cancelinfo = CancelReason === "Others" ? OtherCancelReason : CancelReason;
        if (CancelReason === "Others") {
            if (OtherCancelReason === '') {
                alertify.error('Please Enter Reason for Cancel');
                return false;
            }
        }
        if (Cancelinfo === '') {
            alertify.error('Please Select Reason For Cancellation');
            return false;
        }

        $scope.cancelAppPopup = true;
        var CurrentCheckOutTime = $filter("date")(new Date(), "HH:mm:ss");
        var AppmntParams = {
            "AppointmentID": $scope.Cancelappointmentinfo.AppointmentID,
            "AppointmentStatus": "C",
            "StartTime": $scope.CancelStTime,
            "EndTime": $scope.CancelEdTime,
            "IsFollowUp": false,
            "DoctorID": $scope.Canceldoctorid,
            "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
            "DayCD": currentdaycode,
            "VisitUserTypeID": "OPATIENT",
            "OtherVisitRsn": "",
            "ConsultationDt": $scope.CanceltmpConsultationDt,
            "PatientID": $scope.Cancelappointmentinfo.PatientID,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "USRType": "DOCTOR",
            "DoctorVisitRsnID": $scope.CancelVisitRsnType,
            "HospitalDetails": {
                "HospitalID": $scope.HospitalId,
                "LoginHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,//For sms Purpose added by sabarish
                "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,//For sms Purpose added by sabarish
                "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
            },
            "CommunicationDetails": {
                "PatientName": $scope.Patientname,
                "PatientMobile": $scope.MobileNumber,
                "DoctorMobile": $scope.DocPHnumber,
                "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "DoctorName": $scope.DoctorFullName,
                "AppDate": $scope.appDate,
                "AppTime": $scope.TIME,
                "AppClinic": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "AppToken": 0,
                "PatientEmail": $scope.EmailId,
                "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail || "",
                "DoctorEmail": $scope.DoctorEmail,
                "HospitalContact": doctorinfo.doctordata.UserAddress[0].MobileNo,
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
                "CommunicationEmailId": $scope.DoctorEmail || "", //  $scope.CommunicationEmailId || "",
                "CommunicationMobileNo": $scope.DocCommunicationPhnumber || "",
                "DisplayNumber": $scope.DisplayNumber,
            },
            "PreviousAppointmentTime": "",
            "SendDocSms": $scope.CancelAppointmentobj.sendDocSms,
            "SendDocEmail": $scope.CancelAppointmentobj.sendDocEmail,
            "SendPatientEmail": $scope.CancelAppointmentobj.sendPatientEmail,
            "SendPatientSms": $scope.CancelAppointmentobj.sendPatientSms,
            "StatusDescription": Cancelinfo.CancelReason,
            "PaidFollowup": false,
            "IsTeleMedicineSlot": $scope.IsTeleMedicineSlot,
            "SubSpecializationId": $scope.Cancelappointmentinfo.SubSpecializationId,
            "BranchSubSpecializationId": $scope.Cancelappointmentinfo.BranchSubSpecializationId,
            "CurrentTime": CurrentCheckOutTime || null,
            "IsCheckedIn": $scope.Cancelappointmentinfo.CheckinStatusId || 1,
            "VisitTypeId": $scope.Cancelappointmentinfo.VisitTypeId || null,
            "AppointmentPatientTypeId": $scope.Cancelappointmentinfo.AppointmentPatientTypeId || 1,
            "CancelReasonId": CancelReason.CancelVisitReasonId,
            "PatientSmsLanguageId": 152,
            "ParentAppointmentVisitReasonId": $scope.Cancelappointmentinfo.VisitTypeId || null
        };
        eHnoteUserAppointmentDataService.AddUpdateAppointmentService(AppmntParams, OnAddApointmentSuccess, OnCaseSaveError);
        function OnAddApointmentSuccess(data) {
            alertify.success("Appointment Cancelled Successfully");

            //$scope.loadAppointments($scope.selectedDoctor, '');
            $scope.cancelAppPopup = false;
            $scope.CancelAppointmentobj.Ispopup = false;
            $scope.showEditAppointmentID = true;
            $scope.mInstanceEdit.dismiss("cancel");
            $scope.sendDocSms = false;
            $scope.sendDocEmail = false;
            $scope.sendPatientSms = false;
            $scope.sendPatientEmail = false;

            $scope.CancelAppointmentobj.sendDocSms = false;
            $scope.CancelAppointmentobj.sendPatientSms = false;
            $scope.CancelAppointmentobj.sendDocEmail = false;
            $scope.CancelAppointmentobj.sendPatientEmail = false;

            if ($scope.CommunicationdetailsArray !== undefined && $scope.CommunicationdetailsArray.length > 0) {
                angular.forEach($scope.CommunicationdetailsArray, function (item, index) {
                    if (item.Mode === 'doctor') {
                        $scope.sendDocSms = item.SmsSettingsObj.Appointment;
                        $scope.sendDocEmail = item.EmailSettingObj.Appointment;
                    }
                    if (item.Mode === 'patient') {
                        $scope.sendPatientSms = item.SmsSettingsObj.Appointment;
                        $scope.sendPatientEmail = item.EmailSettingObj.Appointment;
                    }
                });
            }
            if (data.response.TokenNumber) {
                $scope.Token = data.response.TokenNumber;
            }

            $scope.loadDayView();
            $scope.clearEventSelectedSlots();
        }
        function OnCaseSaveError(data) {
            alertify.error("Error in Cancelling Appointment");
        }
    };
    $scope.CancelnewCalenderViewAppointmentList = function (item) {
        $scope.CancelAppointmentobj.Ispopup = false;
        $scope.cancelAppPopup = false;
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        var NewStartDate = moment(item.start).local();
        var NewStartTime = moment(item.start).local();
        var NewEndTime = item.end === null ? moment(item.endDate).local() : moment(item.end).local();
        if ($scope.isAllDay) {
            NewStartDate = moment(item.start).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).local();
            if (item.end !== null)
                NewEndTime = moment(item.end).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).local();
            NewStartTime = NewStartDate;
        }
        $scope.StartTimeHour = NewStartTime.format('HH');
        $scope.StartTimeMin = NewStartTime.format('mm');
        if (NewEndTime.format('HH:mm') === "23:59") {
            $scope.EndTimeHour = "00";
            $scope.EndTimeMin = "00";
        } else {
            $scope.EndTimeHour = NewEndTime.format('HH');
            $scope.EndTimeMin = NewEndTime.format('mm');
        }
        $scope.Patientname = item.rowData.PatientInfo.fullName;
        $scope.EmailId = item.rowData.PatientInfo.EmailId;
        $scope.DoctorFullName = item.rowData.doctorName;
        $scope.DoctorEmail = item.rowData.doctorEmail;

        $scope.appDate = item.rowData.consultationDate;
        if ($scope.StartTimeHour) {
            $scope.TIME = $scope.StartTimeHour + ":" + $scope.StartTimeMin;
            $scope.CancelStTime = $scope.StartTimeHour + ":" + $scope.StartTimeMin;
        }
        if ($scope.EndTimeHour) {
            $scope.CancelEdTime = $scope.EndTimeHour + ":" + $scope.EndTimeMin;
        }
        $scope.TokenNumber = item.token;
        if (item.rowData.PatientInfo.MobileNo === undefined) {
            $scope.MobileNumber = "";
        } else {
            // $scope.MobileNumber = item.rowData.PatientInfo.CountryCode + "" + item.rowData.PatientInfo.MobileNo;
            $scope.MobileNumber = item.rowData.PatientInfo.MobileNo;
        }
        $scope.DocPHnumber = item.rowData.docCountrycode + "" + item.rowData.docMobile;
        $scope.HospitalId = item.rowData.hospitalId;
        //$scope.CancelAppointmentobj.Ispopup = true;
        //$scope.cancelAppPopup = true;
        $window.scrollTo(0, angular.element(document.getElementById('cancelAppModal1')).offsetTop);
        $scope.Cancelappointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.Cancelappointmentinfo.AppointmentID = item.rowData.PatientInfo.appointmentID;
        $scope.Cancelappointmentinfo.PatientID = item.rowData.PatientInfo.patientID;
        $scope.Canceldoctorid = item.rowData.doctorId;
        $scope.CanceltmpConsultationDt = $filter('date')(new Date(item.rowData.consultationDate), "yyyy-MM-dd");
        $scope.currentshowloading = true;

        $scope.CancelAppointmentobj.sendDocSms = false;
        $scope.CancelAppointmentobj.sendPatientSms = false;
        $scope.CancelAppointmentobj.sendDocEmail = false;
        $scope.CancelAppointmentobj.sendPatientEmail = false;
        $scope.CancelAppointmentobj.sendPatientSms = item.rowData.PatientInfo.IsPatientSmsInd || false;
        $scope.CancelAppointmentobj.sendPatientEmail = item.rowData.PatientInfo.IsPatientEmailInd || false;
        $scope.Cancelappointmentinfo.CheckinStatusId = item.AppointmentDetails.CheckinStatusId || 1;
        $scope.Cancelappointmentinfo.VisitTypeId = item.AppointmentDetails.VisitTypeId || null;
        $scope.Cancelappointmentinfo.BranchSubSpecializationId = item.AppointmentDetails.BranchSubSpecializationId;
        $scope.Cancelappointmentinfo.SubSpecializationId = item.AppointmentDetails.SubSpecializationId;
        $scope.Cancelappointmentinfo.AppointmentPatientTypeId = item.AppointmentDetails.AppointmentPatientTypeId;

        $scope.CancelVisitRsnType = item.rowData.doctorVisitRsnId;
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var getParams = {
            //  "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            //"ReasonTypeId": 2
            "PageSize": 100,
            "PageNumber": 1
        };
        $scope.CancelAppointmentobj.CancelAppReason = [];
        //return eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams).then(function (resp) {
        return eHnotePatientVisitReasonServices.getOrganizationCancelVisitReasons(getParams).then(function (resp) {
            if (resp.data !== undefined) {
                //$scope.CancelAppointmentobj.CancelAppReason = resp.data.rows || [];
                $scope.CancelAppointmentobj.CancelAppReason = $filter("filter")(resp.data.rows, { "ActiveInd": "Y" }, true);
                //var obj = {
                //    "ReasonId": 1,
                //    "CancelReason": "Others"
                //};
                //$scope.CancelAppointmentobj.CancelAppReason.push(obj);
                $scope.mInstanceEdit = $uibModal.open({
                    "templateUrl": "templates/uibpopups/cancelAppModal.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "keyboard": false,
                    "size": "md"
                });
            }
        });


    };

    function EditeventPopUp(event, action) {
        action = action || "";
        $scope.sendItem = event;
        event.source = {
            "action": action
        };
        //cancel
        if (action === 'cancel') {
            $scope.CancelnewCalenderViewAppointmentList(event);
        } else if (action === 'OpenProfile') {
            $scope.CelanderProfileSampleClick(event.AppointmentDetails);
        } else {

            console.log(event);
            console.log("EVENET");
            event.doctorName = event.rowData.doctorName;
            event.EmailId = event.rowData.EmailId;
            event.doctorSpecialities = getDoctorSpecialities('calendar');
            event.doctorImage = "";
            event.clinicDoctorList = $scope.clinicDoctorList;
            if (event.allDay && event.startDate !== event.endDate && event.end !== null) {
                event.endDate = moment(event.endDate).subtract(1, 'days');
                event.end = moment(event.end).subtract(1, 'days');
            }
            eHnoteMasterDataService.addcalenderInfo(event);

            var appoint_info = angular.copy(event.AppointmentDetails);
            appoint_info.PatientID = appoint_info.patientInfo.patientID;
            appoint_info.PatientDetails = angular.copy(appoint_info.patientInfo);
            eHnoteMasterDataService.addAppointmentInfo(appoint_info);

            var getDate = moment(event.patientstartTime).format('DD-MMM-YYYY');
            var startDatetime = moment(event.patientstartTime).format('DD-MMM-YYYY' + ' ' + event.AppointmentDetails.startTime);
            var endDatetime = moment(event.patientstartTime).format('DD-MMM-YYYY' + ' ' + event.AppointmentDetails.endTime);
            var obj = {
                'IsComingFrom': 'Doctorcalendar',
                'MinPerCaseval': 0,
                'Starttime': startDatetime,
                'Endtime': endDatetime,
                'GetDate': getDate
            }
            datapersistanceFactory.set("SingleDoctorcalendar", obj);


            $scope.OpAccess.bookAppointmentAccessFromAppList = true;
            if ($scope.OpAccess.bookAppointmentAccessFromAppList) {
                $scope.mInstanceEdit = $uibModal.open({
                    templateUrl: 'modalEdit.html',
                    controller: function ($scope, $uibModal) {
                        $scope.ok = function () {
                            $scope.mInstanceEdit.dismiss('cancel');
                        };
                        $scope.cancel = function () {
                            $scope.mInstanceEdit.dismiss('cancel');
                        };
                    }
                });
                $scope.mInstanceEdit.result.then(function (selectedItem) {
                }, function () {
                    if ($scope.calendarView === 'day') {
                        $scope.loadDayView($scope.viewDate, $scope.selectedDoctor);
                    } else if ($scope.calendarView === 'week') {
                        loadWeekView();
                    } else if ($scope.calendarView === 'month') {
                        // loadMonthView();
                        $scope.loadDayView();
                    }
                });
            }
        }
    }
    $scope.eventClicked = function (event, action) {
        action = action || "";
        var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
        var tmpEvent = event;
        switch (tmpEvent.rowData.PatientInfo.appointmentStatus) {
            case "B":
                EditeventPopUp(event, action);
                break;
            case "EVENT":
                EditeventPopUp(event, action);
                break;
            case "IMPEVENT":
                EditeventPopUp(event, action);
                break;
            case "O":
                EditeventPopUp(event, action);
                break;
            case "C":
                if (action === "cancel") {
                    EditeventPopUp(event, action);
                } else {
                    rebookEvent(event, {}, {});
                }
                break;
            case "E":
                rebookEvent(event, {}, {}); break;
            default:
                alertify.error("Sorry, this Event cannot be edited"); break;
        }
    };

    $scope.DeleteBreakSlot = function (obj) {
        //if ($scope.userLoginDetails.RoleID !== 63 && $scope.userLoginDetails.RoleID !== 65 && $scope.userLoginDetails.RoleID !== 67 && $scope.userLoginDetails.RoleID !== 69 && $scope.userLoginDetails.RoleID !== 4) {
        //    alertify.error("You don't have access, Please contact reception manager!");
        //    return;
        //}

        if (doctorinfo.RoleID == 16) {
            if ($scope.connectedUserObj.Available) {
                if ($scope.connectedUserObj.Users.length > 0) {
                    var doctorid = "";
                    if (obj != undefined) {
                        doctorid = obj.DoctorId;
                    }

                    var filter1 = $filter("filter")($scope.connectedUserObj.Users, function (Nitem) {
                        return Nitem.ChildUserId === parseInt(doctorid);
                    }) || [];

                    if (filter1.length == 0) {
                        alertify.error("You don't have access to unblock slot");
                        return false;
                    }
                }
            }
        }

        let pageName = $location.url();
        if (pageName == '/op') {
            if (!$scope.UserAccessRights.AllAccessRights.OPUnblockSlotAccess) {
                alertify.error("You don't have access,please contact your administrator");
                return false;
            }
        }

        if (pageName == '/crm') {
            if (!$scope.UserAccessRights.AllAccessRights.CRMUnblockSlotAccess) {
                alertify.error("You don't have access,please contact your administrator");
                return false;
            }
        }
        $scope.IsForAddingBreakSlot = false;
        $scope.Remarks = "";
        let RemarksBoxInstance = $uibModal.open({
            "templateUrl": "BreakSlotsRemarksPopUp.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "sm",
            "controller": function ($scope, $uibModal, $uibModalInstance, obj) {
                $scope.closePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                let d = new Date(obj.infoobj.SlotInfo.ConsultationDate);
                let weekArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                let DayId = d.getDay();
                let Day = weekArray[DayId];

                $scope.SaveRemarksAndUnBlockSlot = function () {
                    if ($scope.Remarks === "") {
                        alertify.error("Please enter the remarks!");
                        return false;
                    }
                    let req;

                    if (obj.infoobj.SlotInfo.BreakType === "BreakSlots") {
                        req = {
                            "UserId": $scope.UserId,
                            "DoctorId": obj.infoobj.SlotInfo.DoctorId,
                            "BranchId": obj.infoobj.SlotInfo.OrganizationId,
                            "UserScheduleId": obj.infoobj.SlotInfo.UserScheduleId,
                            "UserScheduleDetailId": obj.infoobj.SlotInfo.UserScheduleDetailId,
                            "UserDayBreakSlotId": 0,
                            "StartTime": obj.infoobj.SlotInfo.StartTime,
                            "EndTime": obj.infoobj.SlotInfo.EndTime,
                            "Date": obj.infoobj.SlotInfo.ConsultationDate,
                            "DayId": DayId,
                            "Day": Day,
                            "Remarks": $scope.Remarks,
                            "IsAddBreakSlot": true,
                            "Status": "Unblocked",
                            "DeleteInd": "N"
                        };
                    } else {
                        req = {
                            "UserId": $scope.UserId,
                            "DoctorId": obj.infoobj.SlotInfo.DoctorId,
                            "BranchId": obj.infoobj.SlotInfo.OrganizationId,
                            "UserScheduleId": obj.infoobj.SlotInfo.UserScheduleId,
                            "UserDayBreakSlotId": obj.infoobj.SlotInfo.UserDayBreakSlotId,
                            "StartTime": obj.infoobj.SlotInfo.StartTime,
                            "EndTime": obj.infoobj.SlotInfo.EndTime,
                            "Date": obj.infoobj.SlotInfo.ConsultationDate,
                            "DayId": DayId,
                            "Day": Day,
                            "Remarks": $scope.Remarks,
                            "IsAddBreakSlot": false,
                            "Status": "Unblocked",
                            "DeleteInd": "Y"
                        };
                    }

                    eHnoteMainAppointmentService.AddUpdateDoctorBreakSlot(req).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $scope.filterSelectedDoctorsonCalendar();
                            $scope.clearBreakDetails();
                            $uibModalInstance.dismiss();
                        }
                    }, function (err) {
                        console.log(err);
                    });
                };
            },
            "resolve": {
                "obj": function () {
                    return obj;
                }
            }
        });


    };

    function getdtTimes(hours, mins) {
        var h = hours, m = mins;
        var thistime = (h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
        console.log(thistime);
        return thistime;
    }

    $scope.eventRender = function (event, element, view) {

        if (!event.IsBreakEvent) {
            // var patInfo = event.rowData.PatientInfo;
            var patInfo = event.rowData.PatientInfo;

            console.log(patInfo);
            var visitreasontxt = event.rowData.visitReason || "";

            var profileImg = (patInfo.S3URL === undefined || patInfo.S3URL === "") ? "images/default.png" : patInfo.S3URL;
            //var patientName = ((patInfo.title === undefined || patInfo.title === "") ? "" : (patInfo.title + ". ")) + patInfo.fullName;
            var patientName = patInfo.fullName;
            //var patientAge = patInfo.currentAge !== undefined ? (patInfo.currentAge.year + "y " + (patInfo.currentAge.month !== "0" ? (patInfo.currentAge.month + "m") : "")) : "";
            var patientAge = patInfo.AgeInYears + 'Y' + ' ' + patInfo.AgeInMonths + 'M';
            patientAge = patientAge || "";
            // var patientMobile = patInfo.MobileNo === undefined ? "" : patInfo.MobileNo;
            var patientMobile = "";
            patInfo.HomeNumber = patInfo.HomeNumber || "";
            patInfo.HomeAreaCode = patInfo.HomeAreaCode || "";
            if (patInfo.HomeAreaCode != "" && patInfo.HomeNumber != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange(patInfo.HomeAreaCode + patInfo.HomeNumber);
                patientMobile = obj.UsFormatMobileNumber;
            }
            //patInfo.HomeNumber = patInfo.HomeNumber || "";
            //if (patInfo.HomeNumber !== "") {
            //    patientMobile = patInfo.HomeNumber === undefined ? "" : patInfo.HomeCountryCode + "-" + patInfo.HomeAreaCode + "-" + patInfo.HomeNumber;
            //} else if (patInfo.MobileNo === undefined) {
            //    patientMobile = patInfo.MobileNo === undefined ? "" : patInfo.MobileNo;
            //}

            var patientSex = patInfo.Sex;

            patInfo.PatientDisplayId = patInfo.PatientDisplayId || "";
            var patientID = "";

            var OldMrNostring = patInfo.OldMrNo || "";

            if (OldMrNostring !== "") {
                patientID = patInfo.PatientDisplayId + " / " + OldMrNostring;
            } else {
                patientID = patInfo.PatientDisplayId;
            }

            var consultDate = $filter('date')(new Date(event.rowData.consultationDate), "MMM dd yyyy");
            var start = $filter('date')(new Date(event.patientstartTime), "hh:mm a");
            var end = $filter('date')(new Date(event.patientendTime), "hh:mm a");
            var token = event.token;
            var doctorName = "Dr. " + event.rowData.doctorName;
            var isconfirmedappt = event.AppointmentDetails.IsConfirmedAppointment || false;
            //var confirmedText = isconfirmedappt == true ? 'Confirmed' : 'Not confirmed';
            //var confirmedimg = isconfirmedappt == true ? '<img src="img/appt-list/confirmed.svg" />' : '<img src="img/appt-list/Cancelled.svg" />';

            var confirmedText = "";
            var confirmedimg = "";

            //if (patInfo.appointmentStatus == "C") {
            //    confirmedText = 'Cancelled';
            //    confirmedimg = '<img src="img/appt-list/cancelledcal-icon.svg" width="18"/>';
            //} else {
            //    confirmedText = isconfirmedappt == true ? 'Confirmed' : 'Not confirmed';
            //    confirmedimg = isconfirmedappt == true ? '<img width="18" src="img/appt-list/confirmed-cal-icon.svg" />' : '<img src="img/appt-list/notconfirmed-cal-icon.svg" width="18"/>';
            //}

            if (event.AppointmentDetails.BookingStatusId === 1) {
                confirmedText = 'Confirmed';
                confirmedimg = '<img width="18" src="img/appt-list/confirmed-cal-icon.svg" />';
            } else if (event.AppointmentDetails.BookingStatusId === 2) {
                confirmedText = 'Not Confirmed';
                confirmedimg = '<img src="img/appt-list/notconfirmed-cal-icon.svg" width="18"/>';
            } else if (event.AppointmentDetails.BookingTypeId === 2) {
                confirmedText = 'Waiting';
                confirmedimg = '<img src="img/appt-list/waiting-icon.svg" width="18"/>';
            } else {
                confirmedText = 'Cancelled';
                confirmedimg = '<img src="img/appt-list/cancelledcal-icon.svg" width="18"/>';
            }


            var doctorSpecialities = event.rowData.doctorSpecialities || "";
            if (end === "23:59") { end = "24:00"; }
            //  event.source = "";
            var plugVisittype = false;
            event.AppointmentDetails.VisitTypeId = event.AppointmentDetails.VisitTypeId || 0;
            if (event.AppointmentDetails.VisitTypeId == 0) {
                plugVisittype = true;
            }
            var popover = "";

            if (doctorinfo.doctorid == event.DoctorID) {
                var OpenProfileBtn = "Start Charting";
            } else {
                var OpenProfileBtn = "Open Profile";
            }
            /* if (patInfo.appointmentStatus === "EVENT" || patInfo.appointmentStatus === "IMPEVENT") {
                 if (patientName === "Dr. ") { patientName = "All Doctors"; }
                 popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-6"><div class="cal-popover-patient"><label>' + patientName + '</label><button class="btn-cancel-app app-cancel">Cancel Event</button></div></div><div class="col-md-6"><div class="cal-popover-patient"><p>' + consultDate + '</p><p>' + start + ' to ' + end + ' </p><button class="btn-cancel-app app-reschedule">Reschedule Event</button></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div>';
             } else if (patInfo.appointmentStatus === "O") {
                 popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="app-status-started">OnGoing</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
             }
             else if (patInfo.appointmentStatus === "E") {
                 popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="app-status-completed">Completed</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
             }
             else if (patInfo.appointmentStatus === "C") {
                 popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="app-status-checkin">Cancelled</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
             }
             else if (patInfo.appointmentStatus === "D") {
                 popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="app-status-saved">Saved</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
             }
             else if (event.AppointmentDetails.CheckinStatusId === 2 && doctorinfo.RoleID === 20 && patInfo.appointmentStatus === "B") {
                 popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="appointment-booked">Booked</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div><div class="calendar-details-footer"></div></div></div></div>';
             }
             else {
                 popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-6"> <div class="popover-image"><img src="' + profileImg + '"></div><div class="popover-details"><h3>' + patientName + '</h3><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>Patient ID: ' + patientID + '</p><p></p></div></div><div class="col-md-6"> <div class="popover-timming"><p>' + doctorName + '</p><p>' + consultDate + '</p><p>' + start + ' Hrs to ' + end + ' Hrs</p><p class="appointment-booked">Booked</p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div><div class="row popover-button"><div class="col-md-6 padding-right-0"><button class="btn-cancel-app app-cancel">Cancel Appointment</button></div> <div class="col-md-6 reschedule-button"><button class="btn-cancel-app app-reschedule">Reschedule Appointment</button> </div></div></div>';
                 if (plugVisittype == true) {
                     popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="appointment-booked">Booked</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                 } else {
                     popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="appointment-booked">Booked</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                 }
             }*/
        } else {
            var breakDate = $filter('date')(new Date(event.SlotInfo.ConsultationDate), "MM-dd-yyyy");
            var BreakStartTime = $filter('date')(new Date(event.SlotInfo.StartTime), "hh:mm a");
            var BreakEndTime = $filter('date')(new Date(event.SlotInfo.EndTime), "hh:mm a");
            var BlockedRemarks = event.SlotInfo.BlockedRemarks;
            var BlockReason = event.SlotInfo.ReasonforBlockSlot;
            //var popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-5"><div class="cal-popover-patient"><label id="eventData" class="hide">' + JSON.stringify(event.SlotInfo) + '</label><p>' + breakDate + '</p><p>' + BreakStartTime + ' to ' + BreakEndTime + '</p><p>' + BlockedRemarks + '</p></div></div></div></div>';
            // var popover = '<div class="appointment-select m-b-10"><label id="eventData" class="hide">' + JSON.stringify(event.SlotInfo) + '</label><h6><i class="far fa-calendar p-l-10"></i><span> ' + breakDate + '</span></h6><h6><i class="far fa-clock p-l-10"></i> <b>' + BreakStartTime + ' - ' + BreakEndTime + '</b></h6><h5>Reason: </h5><h4>' + BlockReason + '</h4><h5>Remarks: </h5><h4>' + BlockedRemarks + '</h4><h3>Slot Blocked</h3></div >';
        }

        if (event.IsBreakEvent) {
            /* var tooltip = $(element.el).qtip({
                 content: {
                     text: popover
                 },
                 show: {
                     solo: true,
                     event: 'mouseenter'
                 },
                 hide: {
                     fixed: true,
                     delay: 50,
                     event: 'click mousedown mouseleave'
                 },
                 adjust: {
                     scroll: true
                 },
                 position: {
                     target: 'mouse',
                     adjust: {
                         mouse: false
                     }
                 },
                 events: {
                     mousedown: function (event, api) {
                         qtipDown = true;
                     },
                     move: function (event, api) {
                         if (qtipDown)
                             event.preventDefault();
                     },
                     mouseleave: function (event, api) {
                         qtipDown = false;
                     },
                     render: function (event, api) {
                         angular.element(this).on("click", ".app-cancel", function () {
                             var ele = angular.element(this).closest(".appointment-popover-section").find("#eventData");
                             var obj = JSON.parse(ele.html());
                             console.log(obj);
                             if (obj.rowData.IscheckedIn === "Y") {
                                 alertify.error('Patient Already CheckedIn,You can not Cancel');
                                 return false;
                             }
                             if (obj.rowData.PatientInfo.appointmentStatus !== "S" && obj.rowData.PatientInfo.appointmentStatus !== "E") {
                                 $scope.eventClicked(obj, "cancel");
                             } else {
                                 alertify.error("Sorry you cannot CANCEL this appointment");
                             }
                         });
                         angular.element(this).on('click', '.app-reschedule', function () {
                             var ele = angular.element(this).closest('.appointment-popover-section').find('#eventData');
                             var obj = JSON.parse(ele.html());
                             if (obj.rowData.PatientInfo.appointmentStatus !== "E") {
                                 $scope.eventClicked(obj, "reschedule");
                             } else {
                                 $scope.eventClicked(obj, "cancel");
                             }
                         });
                         angular.element(this).on('click', '.app-OpenProfile', function () {
                             var ele = angular.element(this).closest('.appointment-popover-section').find('#eventData');
                             var obj = JSON.parse(ele.html());
                             if (obj.rowData.PatientInfo.appointmentStatus !== "E") {
                                 $scope.eventClicked(obj, "OpenProfile");
                             } else {
                                 $scope.eventClicked(obj, "cancel");
                             }
                         });
                         angular.element(this).on('click', '.unblock-break', function () {
                             var ele = angular.element(this).closest('.appointment-popover-section').find('#eventData');
                             var obj = JSON.parse(ele.html());
                             $scope.DeleteBreakSlot(obj);
                         });
                     }
                 },
                 style: {
                     width: 508,
                     tip: false,
                     classes: 'qtip-light qtip-shadow'
                 }
             });*/
        }
    };
    $scope.ChangePatientDetailsEventClick = function (appointmentID) {
        eHnoteMainAppointmentService.getAdditionalApptDetailsById(appointmentID).then(function (resp) {
            resp.data = resp.data || [];
            if (resp.data.length > 0) {
                var responseObj = resp.data[0];
                $scope.CalendarPatientdeatilsObj.PatientName = responseObj.Patient.FullName;
                $scope.CalendarPatientdeatilsObj.PatientId = responseObj.Patient.PatientID;
                $scope.CalendarPatientdeatilsObj.IsConfirmedappointment = responseObj.AppointmentDetails[0].IsConfirmedAppointment;
                $scope.CalendarPatientdeatilsObj.Gender = responseObj.Patient.Gender;
                $scope.CalendarPatientdeatilsObj.AgeInYear = responseObj.Patient.AgeInYears || 0;
                $scope.CalendarPatientdeatilsObj.AgeInMonth = responseObj.Patient.AgeInMonths || 0;
                $scope.CalendarPatientdeatilsObj.AgeInDays = responseObj.Patient.AgeInDays || 0;
                $scope.CalendarPatientdeatilsObj.Mrno = responseObj.Patient.PatientDisplayId || '';
                $scope.CalendarPatientdeatilsObj.Oldno = responseObj.Patient.OldMrno || '';
                $scope.CalendarPatientdeatilsObj.ProfileStatus = responseObj.Patient.ProfileStatus || '';
                $scope.CalendarPatientdeatilsObj.AppointmentDate = responseObj.AppointmentDetails[0].AppointmentDate;
                var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
                var starttime1 = currentdate + "T" + responseObj.AppointmentDetails[0].StartTime;
                var endtime1 = currentdate + "T" + responseObj.AppointmentDetails[0].EndTime;
                $scope.CalendarPatientdeatilsObj.StartTime = $filter('date')(new Date(starttime1), 'hh:mm a');;
                $scope.CalendarPatientdeatilsObj.EndTime = $filter('date')(new Date(endtime1), 'hh:mm a');;
                $scope.CalendarPatientdeatilsObj.VisitReason = responseObj.AppointmentDetails[0].VisitReasonName;
                $scope.CalendarPatientdeatilsObj.AppointmentNotesArray = responseObj.AppointmentNotes || [];

                $scope.CalendarPatientdeatilsObj.AppointmentStatus = responseObj.AppointmentStatus || "B";
                $scope.CalendarPatientdeatilsObj.BookingTypeId = responseObj.AppointmentDetails[0].BookingTypeId;
                $scope.CalendarPatientdeatilsObj.BookingStatusId = responseObj.AppointmentDetails[0].BookingStatusId;
                $scope.CalendarPatientdeatilsObj.BookingStatus = responseObj.AppointmentDetails[0].BookingStatus;
                $scope.CalendarPatientdeatilsObj.AppointmentStatusId = responseObj.AppointmentDetails[0].AppointmentStatusId;
                $scope.CalendarPatientdeatilsObj.AppointmentStatusName = responseObj.AppointmentDetails[0].AppointmentStatusName;
                $scope.CalendarPatientdeatilsObj.IsNoShowAppointment = responseObj.AppointmentDetails[0].IsNoShowAppointment || false;
                $scope.CalendarPatientdeatilsObj.BookingTypeId = responseObj.AppointmentDetails[0].BookingTypeId;
                $scope.CalendarPatientdeatilsObj.PatientInsuranceList = responseObj.PatientInsuranceList || [];
                $scope.CalendarPatientdeatilsObj.LanguageID = responseObj.Patient.LanguageID;

                $scope.evencalobj.S3URL = responseObj.Patient.S3URL || "";

                responseObj.Patient.MobileNo = responseObj.Patient.MobileNo || '';
                if (responseObj.Patient.MobileNo !== '') {
                    var obj = eHnoteUserDataService.UsMobileFormatChange(responseObj.Patient.MobileNo);
                    $scope.CalendarPatientdeatilsObj.PatientMobile = obj.UsFormatMobileNumber;
                }

                if (responseObj.AppointmentDetails.length > 0) {


                    var obj = responseObj.AppointmentDetails[0];

                    if (obj.RescheduledAppointmentId !== 0) {
                        $scope.CalendarPatientdeatilsObj.RescheduledAppointmentId = obj.RescheduledAppointmentId;
                        $scope.CalendarPatientdeatilsObj.RescheduledAppointmentDate = obj.RescheduledAppointmentDate;
                        $scope.CalendarPatientdeatilsObj.RescheduledAppointmentStartTime = obj.RescheduledAppointmentStartTime;
                        $scope.CalendarPatientdeatilsObj.RescheduledAppointmentEndTime = obj.RescheduledAppointmentEndTime;
                        $scope.CalendarPatientdeatilsObj.RescheduledDoctorId = obj.RescheduledDoctorId;

                        var starray = $scope.CalendarPatientdeatilsObj.RescheduledAppointmentStartTime.split(":");
                        var st1 = starray[0];
                        var st2 = starray[1];

                        console.log(st1, st2);

                        var stime = getdtTimes(st1, st2);

                        $scope.CalendarPatientdeatilsObj.RescheduledAppointmentStartTime = stime;
                    }

                    $scope.evencalobj.OtherProviderDoctorID = obj.OtherProviderDoctorID || 0;
                    $scope.evencalobj.SurgeryReferralDoctorId = obj.SurgeryReferralDoctorId || 0;
                    $scope.evencalobj.ReasonTypeId = obj.ReasonTypeId || 0;
                }

                $scope.evencalobj.PreAdmSurgeryList = [];
                $scope.evencalobj.SurgeryList = [];

                $scope.evencalobj.AppointmentTypeId = obj.AppointmentTypeId || null;
                if (obj.AppointmentTypeId == 7) {
                    $scope.evencalobj.PreAdmSurgeryList = obj.PreAdmSurgeryList || [];
                } else if (obj.AppointmentTypeId == 4 || obj.AppointmentTypeId == 14) {
                    $scope.evencalobj.SurgeryList = obj.SurgeryList || [];
                }

            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting data failed");
        });
    }

    $scope.loadDayView = function () {

        console.log("vs 1");
        var formatteddateValue = $filter('date')(apptConsultationDate(), "yyyy-MM-dd");
        console.log(formatteddateValue);
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "usrType": "DOCTOR",
            "startDate": formatteddateValue,
            "endDate": formatteddateValue,
            "HospitalID": $scope.HospitalId,
            "GetAllIndicator": 0,
            "AppointmentTypeStatusIDList": "",
            "VisitReasonIdList": "",
            "VisitStatusIDLst": "",
            "PatientTagListIds": "",
            //"IsConfirmedAppointment": $scope.CalenderObj.IsConfirmedAppointment || false
        };
        //if ($scope.AppoinmentBookingTypeobj1.AppoinmentBookingTypeID == 1) {
        //    params.VisitStatusIDLst = "1";
        //} else {
        //    params.VisitStatusIDLst = "1,2,3";
        //}

        var newlist10 = "";
        for (var i in $scope.BookedstatusFilterList1) {
            if ($scope.BookedstatusFilterList1[i].IsChecked) {
                newlist10 += "," + $scope.BookedstatusFilterList1[i].Id;
            }
        }
        if (newlist10.charAt(0) === ",") {
            newlist10 = newlist10.slice(1);
        }

        params.VisitStatusIDLst = "1,2,3";

        //if ($scope.AppoinmentBookingTypeobj1.AppoinmentBookingTypeID == 2) {
        //    $scope.ApptFilterObj.IsNoShowAppointment1 = true;
        //} else {
        //    $scope.ApptFilterObj.IsNoShowAppointment1 = false;
        //}

        if ($scope.appointmentTypes != undefined) {
            var listApptTypeArray = $filter("filter")($scope.appointmentTypes, function (iterator, ind) { return iterator.isChecked === true; });
            var apptList = _.pluck(listApptTypeArray, "Id").join(",");
            params.AppointmentTypeStatusIDList = apptList || "";
        }

        if ($scope.Visitreasons != undefined) {
            var listVisitRsnArray = $filter("filter")($scope.Visitreasons, function (iterator, ind) { return iterator.isChecked === true; });
            var visitRsnList = _.pluck(listVisitRsnArray, "ReasonId").join(",");
            params.VisitReasonIdList = visitRsnList || "";
        }



        let statuslist = "";
        for (let i in $scope.confirmationStatusArray1) {
            if ($scope.confirmationStatusArray1[i].IsChecked) {
                statuslist += "," + $scope.confirmationStatusArray1[i].ConfirmationStatusId;
            }
        }
        if (statuslist.charAt(0) === ",") {
            statuslist = statuslist.slice(1);
        }

        let profilestatuslist = "";
        for (let i in $scope.ProfileStatusList1) {
            if ($scope.ProfileStatusList1[i].IsChecked) {
                profilestatuslist += "," + $scope.ProfileStatusList1[i].Id;
            }
        }
        if (profilestatuslist.charAt(0) === ",") {
            profilestatuslist = profilestatuslist.slice(1);
        }
        var PatientTags = "";
        for (var i in $scope.PatientTagList1) {
            if ($scope.PatientTagList1[i].IsChecked) {
                PatientTags += "," + $scope.PatientTagList1[i].HospitalEquipmentId;
            }
        }
        if (PatientTags.charAt(0) === ",") {
            PatientTags = PatientTags.slice(1);
        }


        var newlist7 = "";
        for (var i in $scope.BookingTypesArray1) {
            if ($scope.BookingTypesArray1[i].IsChecked) {
                newlist7 += "," + $scope.BookingTypesArray1[i].BookingTypeId;
            }
        }
        if (newlist7.charAt(0) === ",") {
            newlist7 = newlist7.slice(1);
        }

        var newlist10 = "";
        for (var i in $scope.AppointmentStatusArray1) {
            if ($scope.AppointmentStatusArray1[i].IsChecked) {
                newlist10 += "," + $scope.AppointmentStatusArray1[i].AppointmentStatusId;
            }
        }
        if (newlist10.charAt(0) === ",") {
            newlist10 = newlist10.slice(1);
        }

        var newlist11 = "";
        for (var i in $scope.BookedstatusFilterList1) {
            if ($scope.BookedstatusFilterList1[i].IsChecked) {
                newlist11 += "," + $scope.BookedstatusFilterList1[i].Id;
            }
        }
        if (newlist11.charAt(0) === ",") {
            newlist11 = newlist11.slice(1);
        }

        params.BookingTypeIds = angular.copy(newlist7);
        params.AppointmentStatusIds = angular.copy(newlist10);
        params.BookingStatusIds = angular.copy(newlist11);
        params.ProfileStatusIds = angular.copy(profilestatuslist);
        params.IsNoShowAppointment = $scope.ApptFilterObj.IsNoShowAppointment1 || false;

        params.PatientTagListIds = PatientTags;
        eHnoteUserAppointmentDataService.getWeekwiseMonthwiseAppointments(params, onweekSuccess, onweekError);
        function onweekSuccess(data) {




            data.AvailableSlots = data.AvailableSlots || [];
            $scope.UserAvailableSlots = data.UserAvailableSlots || [];



            if ($scope.UserAvailableSlots.length > 0) {
                angular.forEach($scope.UserAvailableSlots, function (item) {
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
                        angular.forEach(item.UserDayBlockedSlots, function (hitem) {
                            if (item.UserBranchId === hitem.UserBranchId) {
                                item.UserDayBreakSlots.push(hitem);
                            }
                        });
                    }
                });
            }

            $scope.eventsList1 = [];
            var booked = data;

            $scope.minPerCase = 15;
            $scope.eventsList = [];

            // one column per doctor-at-a-branch, each resolving its own schedule
            $scope.CalendarResources = buildBranchResources(
                calendarDoctorList(), data.UserAvailableSlots, data.HospitalID || $scope.HospitalId, selectedBranchIds());

            angular.forEach($scope.CalendarResources, function (citem) {
                citem.ApptsCount = 0;
                citem.VisitCountsArray = [];
                citem.IsLeave = false;
                var filteredDOcObj = $filter("filter")(data.UserAvailableSlots, function (iterator, ind) {
                    return parseInt(iterator.DoctorId, 10) === parseInt(citem.DoctorID, 10)
                        && (!citem.BranchId
                            || parseInt(iterator.OrganizationId, 10) === parseInt(citem.BranchId, 10));
                });
                if (filteredDOcObj.length > 0) {
                    //citem.SlotStartTime = filteredDOcObj[0].SlotStartTime || "00:00";
                    //citem.SlotEndTime = filteredDOcObj[0].SlotEndTime || "00:00";

                    citem.SlotStartTime = filteredDOcObj[0].StartTime || "00:00";
                    citem.SlotEndTime = filteredDOcObj[0].EndTime || "00:00";
                    citem.ApptsCount = filteredDOcObj[0].DoctorTotalAppointmentCount || 0;
                    // Re-sync the resource's slot duration from this month's schedule data on every
                    // month/date change — otherwise citem.MinPerCase keeps whatever value it had when
                    // Calendardoctorlist1 was first loaded (e.g. a 15-min schedule), and clicking a slot
                    // in a later month with a different schedule (20-min, 30-min, etc.) still books using
                    // that stale duration.
                    citem.MinPerCase = parseInt(filteredDOcObj[0].MinPerCase || filteredDOcObj[0].AverageConsultationTime || citem.MinPerCase || 15);
                } else {
                    citem.SlotStartTime = "00:00";
                    citem.SlotEndTime = "00:00";
                    citem.ApptsCount = 0;
                }

                if (citem.SlotStartTime === "00:00") {
                    citem.businessHours = {
                        "startTime": "23:59",
                        "endTime": "24:00"
                    }
                } else {
                    if (filteredDOcObj[0].IsLeave) {
                        citem.IsLeave = true;
                        citem.businessHours = {
                            "startTime": "00:00",
                            "endTime": "00:00"
                        }
                    } else {
                        citem.businessHours = {
                            "startTime": citem.SlotStartTime,
                            "endTime": citem.SlotEndTime
                        }
                    }
                };


            });



            $scope.appCount = data.appointmentCounts;

            if (JSON.stringify(data) !== '{}') {
                loadEvents(booked, data);
            }
        }
        function onweekError(data) {
        }
    };
    var loadEvents = function (booked, data) {
        $scope.eventsList1 = [];
        $scope.eventsList = [];
        for (var j = 0; j < booked.calendarList.length; j++) {
            if (booked.calendarList[j].slotList !== undefined) {
                for (var k = 0; k < booked.calendarList[j].slotList.length; k++) {
                    var sTime = booked.calendarList[j].slotList[k];
                    if (sTime.appointmentStatus === "EVENT" || sTime.appointmentStatus === "IMPEVENT") {
                        sTime.patientInfo = {};
                    }
                    /* && sTime.appointmentStatus !== 'C'*/
                    if (sTime.patientInfo !== undefined) {
                        sTime.patientInfo.appointmentID = sTime.appointmentID;
                        sTime.patientInfo.appointmentStatus = sTime.appointmentStatus;
                        var userbranch = sTime.UserBranchId !== undefined ? sTime.UserBranchId : 0;
                        var OpId = sTime.OptometristId;
                        var datefinalValue = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                        if (sTime.startDate === undefined) {
                            var datefinalValue = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                        } else {
                            var datefinalValue = $filter('date')(sTime.startDate, "yyyy-MM-dd");
                        } if (sTime.endDate === undefined) {
                            var dateendval = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                        } else {
                            var dateendval = $filter('date')(sTime.endDate, "yyyy-MM-dd");
                        }
                        var dayViewStart = moment(sTime.startTime, 'HH:mm:ss');
                        var dayViewEnd = moment(sTime.endTime, 'HH:mm:ss');
                        if (sTime.endTime === "23:59" && sTime.allDayEvents !== undefined && datefinalValue !== dateendval) {
                            dateendval = moment(sTime.endDate).add('days', 1).format('YYYY-MM-DD');
                        }
                        var appBgColor = "",
                            appFontColor = "";
                        var dayCounter = moment(datefinalValue)
                            .clone()
                            .hours(dayViewStart.hours())
                            .minutes(dayViewStart.minutes())
                            .seconds(dayViewStart.seconds());
                        if (sTime.endTime === "24:00") {
                            datefinalValue = $filter('date')(data.calendarList[j].consultationDt + 86400000, "yyyy-MM-dd");
                        }
                        var dayend = moment(dateendval)
                            .clone()
                            .hours(dayViewEnd.hours())
                            .minutes(dayViewEnd.minutes())
                            .seconds(dayViewEnd.seconds());
                        if (sTime.appointmentStatus === "B") {
                            var appStatus = "Booked";
                            appBgColor = "#757ef8";
                            appFontColor = "#FFF";
                        } else if (sTime.appointmentStatus === "O") {
                            var appStatus = "OnGoing";
                            appBgColor = "#77cb52";
                            appFontColor = "#FFF";
                        }
                        else if (sTime.appointmentStatus === "D") {
                            var appStatus = "Saved";
                            appBgColor = "#aa0abb";
                            appFontColor = "#FFF";
                        }
                        else if (sTime.appointmentStatus === "C") {
                            var appStatus = "Cancelled";
                            appFontColor = "#FFF";
                            appBgColor = "#70d7cc";
                        } else if (sTime.appointmentStatus === "EVENT" || sTime.appointmentStatus === "IMPEVENT") {
                            var appStatus = "Events";
                            appBgColor = "#8d67b1";
                            appFontColor = "#FFF";
                        } else {
                            var appStatus = "Completed";
                            appBgColor = "#ff9024";
                            appFontColor = "#FFF";
                        }
                        sTime.VisitReasonColorCode = sTime.VisitReasonColorCode || "";
                        if (sTime.VisitReasonColorCode != '') {
                            appBgColor = sTime.VisitReasonColorCode;
                            /*  appBgColor = 'linear-gradient(to bottom right, white, ' + sTime.VisitReasonColorCode + ')'*/

                        }
                        var doctorSpecialities = "";
                        for (var i in sTime.doctorInfo.specialityCd) {
                            doctorSpecialities += ", " + getSpecialityDesc(sTime.doctorInfo.specialityCd[i]);
                        }
                        if (doctorSpecialities.charAt(0) === ",") {
                            doctorSpecialities = doctorSpecialities.slice(2);
                        }

                        var PatientMRNo = "";
                        sTime.patientInfo.PatientDisplayId = sTime.patientInfo.PatientDisplayId || "";
                        if (sTime.patientInfo.PatientDisplayId != '') {
                            PatientMRNo = sTime.patientInfo.PatientDisplayId;
                        }
                        var patientMobile = "";
                        sTime.patientInfo.HomeNumber = sTime.patientInfo.HomeNumber || "";
                        sTime.patientInfo.HomeAreaCode = sTime.patientInfo.HomeAreaCode || "";
                        sTime.patientInfo.MobileNo = sTime.patientInfo.MobileNo || "";
                        if (sTime.patientInfo.MobileNo != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange(sTime.patientInfo.MobileNo);
                            patientMobile = obj.UsFormatMobileNumber;
                        }

                        var title = null, eventInfo = null;
                        if (sTime.appointmentStatus === "EVENT" || sTime.appointmentStatus === "IMPEVENT") {
                            sTime.patientInfo.title = "Dr";
                            sTime.patientInfo.doctorID = sTime.doctorID;
                            sTime.patientInfo.fullName = sTime.doctorInfo.doctorName;
                            sTime.patientInfo.doctorSpecialities = "";
                            title = sTime.otherVisitRsn || "Events";
                            eventInfo = ((sTime.patientInfo.title === undefined) ? "" : sTime.patientInfo.title + '.') + sTime.patientInfo.fullName + " | Token : 0 | - | /Male | " + sTime.startTime + " - " + sTime.endTime + " | " + appStatus;
                        } else {
                            // title = ((sTime.patientInfo.title === undefined || sTime.patientInfo.title === "") ? "" : sTime.patientInfo.title + '. ') + sTime.patientInfo.fullName;
                            //console.log(sTime);
                            //var formatteddateValue = $filter('date')(apptConsultationDate(), "yyyy-MM-dd");
                            //var datestime = formatteddateValue + "T" + sTime.startTime;
                            //var ConvertDateStartTime = $filter('date')(datestime, "hh:mm");

                            //var dateetime = formatteddateValue + "T" + sTime.endTime;
                            //var ConvertDateEndTime = $filter('date')(dateetime, "hh:mm");
                            //title = ConvertDateStartTime + "-" + ConvertDateEndTime + " | " + sTime.patientInfo.fullName;

                            title = sTime.patientInfo.fullName;
                            eventInfo = ((sTime.patientInfo.title === undefined || sTime.patientInfo.title === "") ? "" : sTime.patientInfo.title + '. ') + sTime.patientInfo.fullName + " | Token : " + (sTime.tokenNumber === '0' ? "Walk-In" : sTime.tokenNumber) + " | " + ((sTime.patientInfo.mobileNumber === undefined || sTime.patientInfo.mobileNumber.toString().length < 6) ? "-" : sTime.patientInfo.mobileNumber) + " | " + ((sTime.patientInfo.currentAge === undefined) ? ((sTime.patientInfo.age === undefined) ? '' : (sTime.patientInfo.age + "y")) : (((sTime.patientInfo.currentAge.year > 0) ? sTime.patientInfo.currentAge.year + "y" : '') + ' ' + ((sTime.patientInfo.currentAge.month > 0) ? sTime.patientInfo.currentAge.month + "m" : ''))) + "/" + ((sTime.patientInfo.Sex === 'M') ? 'Male' : 'Female') + " | " + sTime.startTime + " - " + sTime.endTime + " | " + appStatus;
                        }
                        // { id: '1', resourceId: 23, start: '2022-08-22T02:00:00', end: '2022-08-22T03:00:00', title: 'event 1' },
                        var start = $filter("date")(new Date(dayCounter), "yyyy-MM-ddTHH:mm:ss");
                        var end = $filter("date")(new Date(dayend), "yyyy-MM-ddTHH:mm:ss");

                        if ($scope.ParentObj.IsIOJParentOrganization) {
                            var newtitle = title + '-' + '(' + sTime.VisitReason + ')' + '-' + patientMobile;
                            if (sTime.appointmentStatus == "C") {
                                newtitle = '<img src="img/appt-list/xmark-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + '(' + sTime.VisitReason + ')' + '-' + patientMobile;
                            }
                            else if (sTime.appointmentStatus == "R") {
                                newtitle = '<img src="img/appt-list/rescheduleIcon.jpg" width="12" style="margin-right:5px;"/>' + title + '-' + '(' + sTime.VisitReason + ')' + '-' + patientMobile;
                            }
                            else {
                                var isconfirmedappt = sTime.IsConfirmedAppointment || false;
                                var isnoshowAppt = sTime.AppointmentStatusId;
                                if (isconfirmedappt) {
                                    newtitle = '<img src="img/appt-list/check-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + '(' + sTime.VisitReason + ')' + '-' + patientMobile;
                                }
                                if (sTime.AppointmentStatusId == 11 && sTime.BookingStatusId == 1) {
                                    newtitle = '<img src="img/appt-list/no-show-icon.svg" width="12" style="margin-right:5px;"/>' + '<img src="img/appt-list/check-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + '(' + sTime.VisitReason + ')' + '-' + patientMobile;
                                }
                                if (sTime.AppointmentStatusId == 11 && sTime.BookingStatusId == 2) {
                                    newtitle = '<img src="img/appt-list/no-show-icon.svg" width="12" style="margin-right:5px;"/>' + title + '-' + '(' + sTime.VisitReason + ')' + '-' + patientMobile;
                                }
                            }
                        } else {
                            var newtitle = title + '-' + '(' + sTime.VisitReason + ')' + '-' + PatientMRNo;
                            if (sTime.appointmentStatus == "C") {
                                newtitle = '<img src="img/appt-list/xmark-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + '(' + sTime.VisitReason + ')' + '-' + PatientMRNo;
                            }
                            else if (sTime.appointmentStatus == "R") {
                                newtitle = '<img src="img/appt-list/rescheduleIcon.jpg" width="12" style="margin-right:5px;"/>' + title + '-' + '(' + sTime.VisitReason + ')' + '-' + PatientMRNo;
                            }
                            else {
                                var isconfirmedappt = sTime.IsConfirmedAppointment || false;
                                var isnoshowAppt = sTime.AppointmentStatusId;
                                if (isconfirmedappt) {
                                    newtitle = '<img src="img/appt-list/check-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + '(' + sTime.VisitReason + ')' + '-' + PatientMRNo;
                                }
                                if (sTime.AppointmentStatusId == 11 && sTime.BookingStatusId == 1) {
                                    newtitle = '<img src="img/appt-list/no-show-icon.svg" width="12" style="margin-right:5px;"/>' + '<img src="img/appt-list/check-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + '(' + sTime.VisitReason + ')' + '-' + PatientMRNo;
                                }
                                if (sTime.AppointmentStatusId == 11 && sTime.BookingStatusId == 2) {
                                    newtitle = '<img src="img/appt-list/no-show-icon.svg" width="12" style="margin-right:5px;"/>' + title + '-' + '(' + sTime.VisitReason + ')' + '-' + PatientMRNo;
                                }
                            }
                        }



                        var overallMaxSlotsCount = 0;

                        if (data.UserAvailableSlots.length > 0) {
                            var consultationDate = $filter('date')(new Date(booked.calendarList[j].consultationDt), "yyyy-MM-dd");
                            var UserAvailableSlots = $filter('filter')(data.UserAvailableSlots, { "SlotDate": consultationDate }, true);

                            var filterary1 = $filter("filter")(UserAvailableSlots, { "DoctorId": booked.calendarList[j].slotList[k].doctorID }, true) || [];
                            if (filterary1.length > 0) {
                                overallMaxSlotsCount = filterary1[0].MaximumOverAllSlots || 0;
                            }
                        }


                        var val = k + 1;
                        var newEvent = {
                            "id": val.toString(),
                            "title": newtitle,
                            "resourceId": calendarResourceId(booked.calendarList[j].slotList[k].doctorID, booked.calendarList[j].slotList[k].hospitalID),
                            "end": end,
                            "start": start,
                            "eventInfo": eventInfo,
                            "UserBranchId": userbranch,
                            "OptometristId": OpId,
                            "overallMaxSlotsCount": overallMaxSlotsCount,
                            //  "start": dayCounter.clone(),
                            //"end": dayend.clone(),                          
                            //"startDate": dayCounter.clone(),
                            //"startTime": dayCounter.clone(),
                            "endDate": dayend.clone(),
                            "endTime": dayend.clone(),

                            "color": appBgColor,
                            "textColor": appFontColor,
                            "allDay": sTime.allDayEvents !== undefined,
                            "token": sTime.tokenNumber === "0" ? "Walk-In" : sTime.tokenNumber,
                            "eventTitle": sTime.otherVisitRsn || "Events",
                            "eventDesc": sTime.eventDescription || "",
                            "eventVenue": sTime.eventLocation || "",
                            //  "sliceTime": avgConsultationTime,
                            "showDoctors": true,
                            "rowData": {
                                "addressId": booked.calendarList[j].slotList[k].addressID,
                                "doctorId": booked.calendarList[j].slotList[k].doctorID,
                                "hospitalId": booked.calendarList[j].slotList[k].hospitalID,
                                "doctorName": sTime.doctorInfo.doctorName,
                                "doctorEmail": sTime.doctorInfo.CommunicationEmailId, // sTime.doctorInfo.EmailId,
                                "docMobile": sTime.doctorInfo.MobileNo,
                                "docCountrycode": sTime.doctorInfo.CountryCode,
                                "doctorSpecialities": doctorSpecialities,
                                "doctorImage": sTime.doctorInfo.doctorImage,
                                "consultationDate": booked.calendarList[j].consultationDt,
                                "DayCD": booked.calendarList[j].slotList[k].dayCD,
                                "PatientInfo": sTime.patientInfo,
                                "visitReason": sTime.VisitReason || "",
                                "VisitTypeId": sTime.VisitTypeId || 0,
                                "doctorVisitRsnId": sTime.DoctorVisitRsnID,
                                "IscheckedIn": sTime.IscheckedIn
                            },
                            "AppointmentDetails": booked.calendarList[j].slotList[k]
                        };


                        var val = k + 1;
                        var obj = {
                            "id": val.toString(),
                            "title": newtitle,
                            "overallMaxSlotsCount": overallMaxSlotsCount,
                            "resourceId": calendarResourceId(booked.calendarList[j].slotList[k].doctorID, booked.calendarList[j].slotList[k].hospitalID),
                            "DoctorID": booked.calendarList[j].slotList[k].doctorID,
                            "end": end,
                            "start": start,
                            "color": appBgColor,
                            "STime": start,
                            "ETime": end,
                            "patientstartTime": dayCounter.clone(),
                            "patientendTime": dayend.clone(),
                            "patientID": sTime.patientInfo.patientID,
                            "eventTitle": sTime.otherVisitRsn || "Events",
                            "eventDesc": sTime.eventDescription || "",
                            "eventVenue": sTime.eventLocation || "",
                            "eventInfo": eventInfo,
                            "PatientName": sTime.patientInfo.fullName,
                            "PatientMrNo": sTime.patientInfo.PatientDisplayId,
                            "PatientOldMrNo": sTime.patientInfo.OldMrNo,
                            "rowData": {
                                "addressId": booked.calendarList[j].slotList[k].addressID,
                                "doctorId": booked.calendarList[j].slotList[k].doctorID,
                                "hospitalId": booked.calendarList[j].slotList[k].hospitalID,
                                "doctorName": sTime.doctorInfo.doctorName,
                                "doctorEmail": sTime.doctorInfo.CommunicationEmailId, //sTime.doctorInfo.EmailId,
                                "docMobile": sTime.doctorInfo.MobileNo,
                                "docCountrycode": sTime.doctorInfo.CountryCode,
                                "doctorSpecialities": doctorSpecialities,
                                "doctorImage": sTime.doctorInfo.doctorImage,
                                "consultationDate": booked.calendarList[j].consultationDt,
                                "DayCD": booked.calendarList[j].slotList[k].dayCD,
                                "PatientInfo": sTime.patientInfo,
                                "visitReason": sTime.VisitReason || "",
                                "VisitTypeId": sTime.VisitTypeId || 0,
                                "doctorVisitRsnId": sTime.DoctorVisitRsnID,
                                "IscheckedIn": sTime.IscheckedIn
                            },
                            "AppointmentDetails": booked.calendarList[j].slotList[k],
                            "RestrictMultipleSlots": sTime.RestrictMultipleSlots || false,
                            "background": 'linear-gradient(to bottom right, white, ' + sTime.VisitReasonColorCode + ')',
                            "borderLeft": '5px solid ' + sTime.VisitReasonColorCode + ''

                        }
                        $scope.eventsList1.push(obj);
                        $scope.eventsList.push(newEvent);

                    }
                }
            }
            if (booked.UserAvailableSlots.length > 0) {
                var consultationDate = $filter('date')(new Date(booked.calendarList[j].consultationDt), "yyyy-MM-dd");
                var UserAvailableSlots = $filter('filter')(booked.UserAvailableSlots, { "SlotDate": consultationDate }, true);
                angular.forEach(UserAvailableSlots, function (item) {
                    if (item.UserDayBreakSlots.length > 0) {
                        for (let l = 0; l < item.UserDayBreakSlots.length; l++) {
                            item.UserDayBreakSlots[l].UserScheduleOnlineBreakDetailId = item.UserDayBreakSlots[l].UserScheduleOnlineBreakDetailId || null;

                            var datefinalValue = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                            //  var appBgColor = "#DEFCF9",
                            var appBgColor = "#b0b3b5",
                                appFontColor = "#000";
                            let startTime = consultationDate + ' ' + item.UserDayBreakSlots[l].StartTime;
                            let endTime = consultationDate + ' ' + item.UserDayBreakSlots[l].EndTime;



                            var overallMaxSlotsCount = item.UserDayBreakSlots[l].MaximumOverAllSlots || 0;


                            let object = {
                                "id": l + 1,
                                "title": (item.UserDayBreakSlots[l].UserScheduleOnlineBreakDetailId === null) ? "Blocked" : "Break",
                                "resourceId": calendarResourceId(item.DoctorId, item.OrganizationId),
                                "end": endTime,
                                "start": startTime,
                                "eventInfo": "",
                                "color": appBgColor,
                                "textColor": appFontColor,
                                "allDay": false,
                                "overallMaxSlotsCount": overallMaxSlotsCount,
                                /*"display": "background",*/
                                "SlotInfo": {
                                    "UserBranchId": item.UserBranchId,
                                    "DoctorId": item.DoctorId,
                                    "StartTime": startTime,
                                    "EndTime": endTime,
                                    "ConsultationDate": item.SlotDate,
                                    "UserScheduleId": item.UserDayBreakSlots[l].UserScheduleId,
                                    "UserScheduleDetailId": item.UserScheduleDetailId,
                                    "UserDayBreakSlotId": item.UserDayBreakSlots[l].UserDayBreakSlotId,
                                    "UserScheduleOnlineBreakDetailId": item.UserDayBreakSlots[l].UserScheduleOnlineBreakDetailId || null,
                                    "OrganizationId": item.OrganizationId,
                                    "BlockedRemarks": item.UserDayBreakSlots[l].BlockedRemarks || "",
                                    "UnBlockedRemarks": item.UserDayBreakSlots[l].UnBlockedRemarks || "",
                                    "ReasonforBlockSlot": item.UserDayBreakSlots[l].ReasonforBlockSlot || "",
                                    "BreakType": (item.UserDayBreakSlots[l].UserScheduleOnlineBreakDetailId === null) ? "BlockedSlots" : "BreakSlots"
                                },
                                "IsBreakEvent": true,
                                "editable": false
                            };

                            $scope.eventsList1.push(object);
                        }
                    }
                });
            }
        }



        //if ($scope.Calendardoctorlist1.length  > 0) {
        //    angular.forEach($scope.Calendardoctorlist1, function (citem) {
        //        var filteredDOcObj = $filter("filter")(data.UserAvailableSlots, function (iterator, ind) { return iterator.DoctorId === citem.DoctorID; });
        //        if (filteredDOcObj.length > 0) {
        //            citem.SlotStartTime = filteredDOcObj[0].StartTime || "00:00";
        //            citem.SlotEndTime = filteredDOcObj[0].EndTime || "00:00";
        //            citem.ApptsCount = filteredDOcObj[0].DoctorTotalAppointmentCount || 0;
        //        } else {
        //            citem.SlotStartTime = "00:00";
        //            citem.SlotEndTime = "00:00";
        //            citem.ApptsCount = 0;
        //        }

        //        if (citem.SlotStartTime === "00:00") {
        //            citem.businessHours = {
        //                "startTime": "23:59",
        //                "endTime": "24:00"
        //            }
        //        } else {
        //            citem.businessHours = {
        //                "startTime": citem.SlotStartTime,
        //                "endTime": citem.SlotEndTime
        //            }
        //        }
        //    });
        //}

        onclickallDoctor();
    };




    var cleanCallEditAppointmentCloseMdl = $rootScope.$on('CallEditAppointmentCloseMdl', function (event) {
        $scope.mInstanceEdit.dismiss('cancel');
    });
    $scope.$on('$destroy', function () {
        cleanCallEditAppointmentCloseMdl();
    });

    $scope.ChangeAppointmentDoctor = function (item, subitem, maxRemarks) {

        var StartTime = $filter('date')(new Date(item.event.start), 'HH:mm:ss');
        var EndTime = $filter('date')(new Date(item.event.end), 'HH:mm:ss');
        var droppedOnId = item.event._def.resourceIds[0];
        var DoctorId = resDoctorId(droppedOnId) || null;

        // API needs the doctor-to-branch UserBranchId of the drop column, falling back to the doctor's own
        var droppedOnRes = (calendar && calendar.getResourceById)
            ? calendar.getResourceById(droppedOnId) : null;
        var UserBranchId = resUserBranchId(droppedOnRes) || 0;

        if ($scope.Calendardoctorlist1.length > 0) {
            $scope.filterarray = $filter("filter")($scope.Calendardoctorlist1, function (item) {
                return item.DoctorID === DoctorId;
            }) || [];
            if (!UserBranchId && $scope.filterarray.length > 0) {
                UserBranchId = $scope.filterarray[0].UserBranchId;
            }

        }
        //var StartTime = $filter('date')(new Date(item.start), 'HH:mm:ss');
        //var EndTime = $filter('date')(new Date(item.end), 'HH:mm:ss');     
        //var DoctorId = item.resource._resource.id;

        var maxremrks = maxRemarks || "";

        var obj = {
            "UserId": $scope.UserId,
            "AppointmentId": subitem.AppointmentDetails.appointmentID,
            "StartTime": StartTime,
            "EndTime": EndTime,
            "DoctorId": DoctorId,
            "Remarks": maxremrks,
            "UserBranchId": UserBranchId || null
        }
        // return false;
        eHnotePatientDataService.ChangeAppointmentDoctorById(obj).then(function (resp) {
            if (resp.data.status === 'Success') {
                $scope.Calendardoctorlist1 = eHnoteMasterDataService.getCalendarDoctorinAppList();
                angular.forEach($scope.Calendardoctorlist1, function (citem) {
                    citem.SlotStartTime = citem.SlotStartTime || "00:00";
                    citem.SlotEndTime = citem.SlotEndTime || "00:00";

                    if (citem.SlotStartTime === "00:00") {
                        citem.businessHours = {
                            "startTime": "23:59",
                            "endTime": "24:00"
                        }
                    } else {
                        citem.businessHours = {
                            "startTime": citem.SlotStartTime,
                            "endTime": citem.SlotEndTime
                        }
                    }
                });

                //$scope.loadDayView();
                //onclickallDoctor();
                $('#calendarFull').fullCalendar('destroy');
                calendar.destroy();
                onclickPageLoad();
            }

        }, function (err) {
            console.log(err);
        });
    }


    function selectSlotOnTap(info) {
        if (!info.jsEvent || info.jsEvent.type.indexOf("touch") !== 0) {
            return;
        }
        // Same rule the desktop `select` handler applies, enforced before the selection is made
        // rather than after: a slot on an earlier day is silently rejected, and a slot on today
        // whose start time has already passed reports the same message desktop reports. Without
        // this the tap committed the selection first and relied on the downstream handler to
        // undo it, which it cannot do -- FullCalendar's `select` is a notification callback, so
        // returning false from it leaves the slot selected.
        var tapSlotStart = moment(info.date);
        if (tapSlotStart.isBefore(moment(), 'day')) {
            return;
        }
        if (tapSlotStart.isSame(moment(), 'day') && tapSlotStart.isBefore(moment())) {
            alertify.error('This Time Slot Has Already Ended!');
            return;
        }
        var calendarData = calendar.getCurrentData();
        var slotDuration = calendarData.options.slotDuration;
        var selection = { start: info.date, allDay: info.allDay };
        if (!info.allDay && slotDuration) {
            selection.end = calendarData.dateEnv.add(info.date, slotDuration);
        }
        if (info.resource) {
            selection.resourceId = info.resource.id;
        }
        calendar.select(selection);
    }

    // doctor header row: a <tr> of colspan cells above the branch columns, restored by a MutationObserver when FullCalendar re-renders
    var decoratingHeader = false;
    var doctorHeaderObserver = null;
    var lastHeaderSignature = '';

    function doctorLabelFor(resource) {
        var ext = resource.extendedProps || {};
        return ext.doctorName || ext.SecondUserFullName || ext.FullName || resource.title || '';
    }

    function decorateDoctorHeader() {
        if (decoratingHeader || !calendar) { return; }

        var root = document.getElementById('calendarFull');
        if (!root) { return; }
        var thead = root.querySelector('.fc-col-header thead');
        if (!thead) { return; }
        var resourceRow = thead.querySelector('tr:not(.ehn-doctor-row)');
        if (!resourceRow) { return; }

        var byId = {};
        angular.forEach(calendar.getResources() || [], function (r) { byId[String(r.id)] = r; });

        decoratingHeader = true;
        try {
            var old = thead.querySelector('tr.ehn-doctor-row');
            if (old) { old.parentNode.removeChild(old); }

            var cells = Array.prototype.slice.call(resourceRow.children);

            // group adjacent header cells that belong to the same doctor
            var lead = 0;
            var i = 0;
            while (i < cells.length && !cells[i].hasAttribute('data-resource-id')) { lead++; i++; }

            var groups = [];
            while (i < cells.length) {
                var res = byId[cells[i].getAttribute('data-resource-id')];
                if (!res) { i++; continue; }
                var docId = resDoctorId(res);
                var group = { label: doctorLabelFor(res), span: 0, cells: [] };
                while (i < cells.length) {
                    var next = byId[cells[i].getAttribute('data-resource-id')];
                    if (!next || resDoctorId(next) !== docId) { break; }
                    group.cells.push(cells[i]);
                    group.span++;
                    i++;
                }
                groups.push(group);
            }

            angular.forEach(cells, function (c) {
                c.classList.remove('ehn-branch-cell');
                c.classList.remove('ehn-group-end');
            });

            // draw for any branch-scoped columns, since the column title is the branch and this row names the doctor
            var isBranchScoped = false;
            angular.forEach(groups, function (g) {
                angular.forEach(g.cells, function (c) {
                    var r = byId[c.getAttribute('data-resource-id')];
                    if (r && resBranchId(r)) { isBranchScoped = true; }
                });
            });
            if (!isBranchScoped || !groups.length) { return; }

            var tr = document.createElement('tr');
            tr.className = 'ehn-doctor-row';
            tr.setAttribute('role', 'row');

            if (lead) {
                var axis = document.createElement('th');
                axis.className = 'ehn-axis';
                axis.colSpan = lead;
                tr.appendChild(axis);
            }

            angular.forEach(groups, function (g, gi) {
                var th = document.createElement('th');
                th.className = 'ehn-doctor-cell';
                th.colSpan = g.span;
                th.textContent = g.label;
                angular.forEach(g.cells, function (c) { c.classList.add('ehn-branch-cell'); });
                if (gi < groups.length - 1) {
                    th.classList.add('ehn-group-end');
                    var lastCell = g.cells[g.cells.length - 1];
                    if (lastCell) {
                        lastCell.classList.add('ehn-group-end');
                        var rid = lastCell.getAttribute('data-resource-id');
                        var col = root.querySelector('.fc-timegrid-col[data-resource-id="' + rid + '"]');
                        if (col) { col.classList.add('ehn-group-end'); }
                    }
                }
                tr.appendChild(th);
            });

            thead.insertBefore(tr, resourceRow);

            // re-measure so the first slot row is not clipped; only on a changed header to avoid an observer ping-pong
            var signature = groups.map(function (g) { return g.label + ':' + g.span; }).join('|');
            if (signature !== lastHeaderSignature) {
                lastHeaderSignature = signature;
                $timeout(function () {
                    if (calendar) { calendar.updateSize(); }
                }, 0);
            }
        } finally {
            decoratingHeader = false;
        }
    }

    function watchDoctorHeader() {
        var root = document.getElementById('calendarFull');
        if (!root) { return; }
        var thead = root.querySelector('.fc-col-header thead');
        if (!thead) { return; }
        if (doctorHeaderObserver) { doctorHeaderObserver.disconnect(); }
        doctorHeaderObserver = new MutationObserver(function () {
            if (!decoratingHeader && !thead.querySelector('tr.ehn-doctor-row')) {
                decorateDoctorHeader();
            }
        });
        doctorHeaderObserver.observe(thead, { childList: true });
    }
    // column's doctor-at-a-branch row (as an array), falling back to the plain doctor row before resources exist
    function resourceRowsFor(resourceOrId) {
        var id = (resourceOrId && typeof resourceOrId === 'object') ? resourceOrId.id : resourceOrId;
        var list = $scope.CalendarResources || [];
        for (var i = 0; i < list.length; i++) {
            if (String(list[i].id) === String(id)) { return [list[i]]; }
        }
        var docId = resDoctorId(resourceOrId);
        return $filter("filter")($scope.Calendardoctorlist1 || [], function (d) {
            return parseInt(d.DoctorID, 10) === docId;
        }) || [];
    }

    // composite "<DoctorID>_<BranchId>" id; events must carry it or FullCalendar drops them
    function calendarResourceId(doctorId, branchId) {
        var b = parseInt(branchId, 10);
        if (isNaN(b) || !b) { b = parseInt($scope.HospitalId, 10) || 0; }
        return parseInt(doctorId, 10) + '_' + b;
    }
    // My Appointments (MainTab 1, inherited from the parent scope) is this calendar narrowed to the logged-in doctor
    function calendarDoctorList() {
        var list = $scope.Calendardoctorlist1 || [];
        if (parseInt(($scope.mainCalendarView || {}).MainTab, 10) !== 1) { return list; }

        // Calendardoctorlist1 is emptied on this tab, so rebuild the logged-in doctor from the available lists
        var selected = $scope.selectedLoginDoctor || $scope.selectedDoctor || {};
        var wantId = parseInt(selected.DoctorID, 10)
            || parseInt(eHnoteMasterDataService.getLoginId(), 10);

        var pools = [list, $scope.clinicDoctorList || [], $scope.MultiselectDoctorlist || []];
        for (var i = 0; i < pools.length; i++) {
            var hit = $filter("filter")(pools[i], function (d) {
                return d && parseInt(d.DoctorID, 10) === wantId;
            }) || [];
            if (hit.length > 0) { return [hit[0]]; }
        }

        if (selected && selected.DoctorID) { return [selected]; }

        // never render an empty grid just because the login could not be matched
        return list;
    }
    // branch name for a ClinicId from the location dropdown list
    function branchNameFor(branchId) {
        var list = $scope.ApptBranchLocations || [];
        for (var i = 0; i < list.length; i++) {
            if (parseInt(list[i].ClinicId, 10) === parseInt(branchId, 10)) {
                return list[i].ShortName || list[i].ClinicName || list[i].BranchName || '';
            }
        }
        return '';
    }

    // branches ticked in the dropdown (ClinicId 0 is the synthetic "All Locations")
    function selectedBranchIds() {
        var out = [];
        angular.forEach($scope.ApptBranchLocations || [], function (b) {
            var id = parseInt(b && b.ClinicId, 10);
            if (b && b.IsChecked && id && out.indexOf(id) === -1) { out.push(id); }
        });
        return out;
    }

    // one column per doctor per ticked branch they work at (from UserAvailableSlots.OrganizationId), doctor-major order
    function buildBranchResources(doctorList, userAvailableSlots, fallbackBranchId, branchIds) {
        doctorList = doctorList || [];
        userAvailableSlots = userAvailableSlots || [];

        var allowed = [];
        angular.forEach(branchIds || [], function (b) {
            var n = parseInt(b, 10);
            if (n && allowed.indexOf(n) === -1) { allowed.push(n); }
        });
        var filterByBranch = allowed.length > 0;

        // doctorId -> de-duplicated branches they work at that day, in API order
        var byDoctor = {};
        angular.forEach(userAvailableSlots, function (s) {
            var d = parseInt(s.DoctorId, 10);
            if (isNaN(d)) { return; }
            var b = parseInt(s.OrganizationId, 10) || parseInt(fallbackBranchId, 10) || 0;
            if (!b) { return; }
            if (filterByBranch && allowed.indexOf(b) === -1) { return; }
            if (!byDoctor[d]) { byDoctor[d] = []; }
            var seen = false;
            angular.forEach(byDoctor[d], function (x) { if (x.branchId === b) { seen = true; } });
            if (!seen) { byDoctor[d].push({ branchId: b, userBranchId: s.UserBranchId }); }
        });

        var out = [];
        var skipped = 0;
        angular.forEach(doctorList, function (doc) {
            var docId = parseInt(doc.DoctorID, 10);
            var pairs = byDoctor[docId] || [];

            // works at none of the ticked branches -> not on this grid
            if (!pairs.length) { skipped++; return; }

            angular.forEach(pairs, function (p) {
                var res = angular.extend({}, doc);
                res.id = docId + '_' + p.branchId;
                res.DoctorID = docId;
                res.BranchId = p.branchId;
                res.UserBranchId = p.userBranchId || doc.UserBranchId;
                res.doctorName = doc.SecondUserFullName || doc.FullName || doc.title || '';
                // column header is the branch; the doctor is named in the spanning row above
                res.title = branchNameFor(p.branchId) || res.doctorName;
                out.push(res);
            });
        });

        // placeholder columns when no schedules matched, so the grid is never blank
        if (!out.length && doctorList.length) {
            var fb = parseInt(fallbackBranchId, 10) || (allowed.length ? allowed[0] : 0);
            angular.forEach(doctorList, function (doc) {
                var docId = parseInt(doc.DoctorID, 10);
                var res = angular.extend({}, doc);
                res.id = docId + '_' + fb;
                res.DoctorID = docId;
                res.BranchId = fb;
                res.UserBranchId = doc.UserBranchId;
                res.doctorName = doc.SecondUserFullName || doc.FullName || doc.title || '';
                res.title = branchNameFor(fb) || res.doctorName;
                out.push(res);
            });
            console.log('[calendar] no schedules matched the selection; showing '
                + out.length + ' placeholder column(s)');
            return out;
        }

        console.log('[calendar] columns=' + out.length
            + ' doctors shown=' + (doctorList.length - skipped)
            + ' hidden (not at a selected branch)=' + skipped
            + ' selected branches=[' + allowed.join(',') + ']');

        return out;
    }
    // doctor id from a resource or composite "<DoctorID>_<BranchId>" id; never post resource.id as DoctorId
    function resDoctorId(resourceOrId) {
        if (resourceOrId === null || resourceOrId === undefined) { return null; }
        var ext = resourceOrId.extendedProps;
        if (ext && ext.DoctorID !== undefined && ext.DoctorID !== null) {
            return parseInt(ext.DoctorID, 10);
        }
        var raw = (typeof resourceOrId === 'object') ? resourceOrId.id : resourceOrId;
        if (raw === null || raw === undefined) { return null; }
        var n = parseInt(String(raw).split('_')[0], 10);
        return isNaN(n) ? null : n;
    }

    // the PLACE -- hospitalID / OrganizationId / ClinicId
    function resBranchId(resourceOrId) {
        if (resourceOrId === null || resourceOrId === undefined) { return null; }
        var ext = resourceOrId.extendedProps;
        if (ext && ext.BranchId !== undefined && ext.BranchId !== null) {
            return parseInt(ext.BranchId, 10);
        }
        var raw = (typeof resourceOrId === 'object') ? resourceOrId.id : resourceOrId;
        if (raw === null || raw === undefined) { return null; }
        var parts = String(raw).split('_');
        if (parts.length < 2) { return null; }
        var n = parseInt(parts[1], 10);
        return isNaN(n) ? null : n;
    }

    // the doctor-to-branch ASSOCIATION row -- what the booking APIs post
    function resUserBranchId(resourceOrId) {
        if (resourceOrId === null || resourceOrId === undefined) { return null; }
        var ext = resourceOrId.extendedProps;
        if (ext && ext.UserBranchId !== undefined && ext.UserBranchId !== null) {
            return parseInt(ext.UserBranchId, 10);
        }
        if (typeof resourceOrId === 'object' && resourceOrId.UserBranchId !== undefined
            && resourceOrId.UserBranchId !== null) {
            return parseInt(resourceOrId.UserBranchId, 10);
        }
        return null;
    }
    // shared FullCalendar (Scheduler 5.11.2) options for every entry path; callers pass only their overrides
    function buildCalendarOptions(overrides) {

        var time = $filter("date")(new Date(), "HH:mm");
        var mintime = "06:00";
        var today = $filter("date")(apptConsultationDate(), "yyyy-MM-dd " + time);

        // hide the "now" line when the grid shows a future date
        var nowIndicator = true;
        var tcurrentdate = $filter("date")(new Date(), "yyyy-MM-dd");
        var tApptdate = $filter("date")(apptConsultationDate(), "yyyy-MM-dd");
        if (tApptdate > tcurrentdate) {
            nowIndicator = false;
        }

        return angular.extend({
            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
            selectable: true,
            editable: true,
            height: 'auto',
            now: today,
            nowIndicator: nowIndicator, // true,
            slotMinTime: mintime,
            dayMinWidth: 180,
            allDaySlot: false,
            stickyFooterScrollbar: true,
            slotEventOverlap: false,
            initialView: 'resourceTimeGridDay',
            views: {
                resourceTimeGridDay: {
                    slotDuration: "00:15"
                }
            },
            aspectRatio: 1.8,
            headerToolbar: {
                left: '',
                center: '',
                //right: 'resourceTimeGridDay,timeGridWeek,dayGridMonth'
                right: ''
            },
            dateClick: selectSlotOnTap,
            select: function (info) {

                if ($scope.PresentcurrentUrl === "/crm" && doctorinfo.RoleID == 20) {
                    $scope.clearEventSelectedSlots();
                    return false;
                }

                console.log(info);

                var isdoctoleave = info.resource.extendedProps.IsLeave || false;
                if (isdoctoleave) {
                    alertify.error("Doctor is on LEAVE, Please choose another day/doctor");
                    return false;
                }
                var isdoctordisabled = info.resource.extendedProps.IsUserDisabled || false;
                if (isdoctordisabled) {
                    alertify.error("Doctor is disabled, please select another doctor");
                    return false;
                }

                var startTime = $filter("date")(new Date(info.startStr), "HH:mm");
                var endTime = $filter("date")(new Date(info.endStr), "HH:mm");

                var Sdate = new Date();
                var Edate = new Date();
                var getDate = moment(info.start).format('DD-MMM-YYYY');
                var startDatetime = moment(info.start).format('DD-MMM-YYYY' + ' ' + startTime);
                var endDatetime = moment(info.end).format('DD-MMM-YYYY' + ' ' + endTime);
                var date1 = parseCalenderDate(startDatetime);
                var date2 = parseCalenderDate(endDatetime);
                $scope.cacheStorageItem.bookApptType = "ApptFromCalendar";
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                var GivenDate = moment(info.start).format('DD-MMM-YYYY');
                var CurrentDate = new Date();
                GivenDate = parseCalenderDate(GivenDate);
                if (GivenDate > CurrentDate) {
                    let i = 0;
                    if ($scope.UserAvailableSlots.length > 0) {
                        angular.forEach($scope.UserAvailableSlots, function (item) {
                            if (item.IsBranchHoliday == true) {
                                i++;
                            }
                        });
                    }
                    if (i > 0 || $scope.IsBranchHoliday == true) {
                        alertify.error("it's a Holiday .Please choose another day");
                        return false;
                    }
                }
                else {
                    var given1 = $filter('date')(parseCalenderDate(GivenDate), "MM-dd-yyyy");
                    var current1 = $filter('date')(new Date(CurrentDate), "MM-dd-yyyy");
                    if (given1 === current1) {
                        if (info.intervalUnit !== "month") {
                            var todaystartTime = $filter("date")(new Date(info.startStr), "HH:mm");
                            var todaytime = $filter('date')(new Date(), 'HH:mm');
                            if (todaystartTime < todaytime) {
                                alertify.error('This Time Slot Has Already Ended!');
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }
                }

                var OverAllStartTime1 = "";
                var OverAllEndTime1 = "";
                var filteredDOcObj = resourceRowsFor(info.resource);
                var filteredDOcObj = resourceRowsFor(info.resource);
                if (filteredDOcObj.length > 0) {
                    if (filteredDOcObj[0].businessHours != undefined) {
                        var start1 = startTime.replaceAll(":", "");
                        OverAllStartTime1 = filteredDOcObj[0].businessHours.startTime.replaceAll(":", "");
                        OverAllEndTime1 = filteredDOcObj[0].businessHours.endTime.replaceAll(":", "");
                    }
                }
                $scope.mInstanceAdd2 = '';
                let tempArray = $scope.UserAvailableSlots.filter((x) => x.DoctorId == resDoctorId(info.resource));
                var OrganizationId = 0;
                if (tempArray.length > 0) {
                    $scope.UserScheduleId = tempArray[0].UserScheduleId;
                    $scope.UserScheduleDetailId = tempArray[0].UserScheduleDetailId;
                    OrganizationId = tempArray[0].OrganizationId;
                }

                //info.resource.extendedProps.SlotStartTime;
                //info.resource.extendedProps.SlotEndTime;
                //info.resource.extendedProps.MinPerCase;

                let arr = info.resource.extendedProps.SlotStartTime.split(':');
                let shour = $.trim(arr[0]);
                let smin = $.trim(arr[1]);

                let arr2 = info.resource.extendedProps.SlotEndTime.split(':');
                let ehour = $.trim(arr2[0]);
                let emin = $.trim(arr2[1]);
                let startingTime = moment().hours(shour).minutes(smin);
                let endingTime = moment().hours(ehour).minutes(emin);

                let currentStartTime = angular.copy(startingTime);
                $scope.TempTimeslots = [];
                while (currentStartTime < endingTime) {

                    let slotObj = {
                        "StartTime": currentStartTime.format("HH:mm"),
                        "EndTime": currentStartTime.add(info.resource.extendedProps.MinPerCase, "minute").format("HH:mm"),
                    }
                    slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                    slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                    $scope.TempTimeslots.push(slotObj);
                }
                //console.log($scope.TempTimeslots);


                function GetTime(date) {
                    var currentTime = (new Date(date))
                    var hours = currentTime.getHours()
                    //Note: before converting into 12 hour format
                    var suffix = '';
                    if (hours > 11) {
                        suffix += "PM";
                    } else {
                        suffix += "AM";
                    }
                    var minutes = currentTime.getMinutes()
                    if (minutes < 10) {
                        minutes = "0" + minutes
                    }
                    if (hours > 12) {
                        hours -= 12;
                    } else if (hours === 0) {
                        hours = 12;
                    }
                    var time = hours + ":" + minutes + " " + suffix;
                    return time;
                }
                var newstartTime = GetTime(info.startStr);
                var newendTime = GetTime(info.endStr);

                $scope.selectedAppointmentObject.VisitReasonObj = "";
                $scope.clearEventSelectedSlots();
                $scope.clearBreakDetails();
                if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {
                    $scope.calobj.IsShow = true;
                    $scope.calobj.StartTime = startTime;
                    $scope.calobj.NewStartTime = newstartTime;
                    $scope.calobj.NewEndTime = newendTime;
                    $scope.calobj.EndTime = endTime;
                    $scope.calobj.DoctorId = resDoctorId(info.resource);
                    $scope.calobj.infoobj = info;
                    $scope.calobj.date = new Date(info.startStr);
                    $scope.calobj.DoctorName = filteredDOcObj[0].FullName;
                    $scope.calobj.UserScheduleId = $scope.UserScheduleId || 0;
                    $scope.calobj.UserScheduleDetailId = $scope.UserScheduleDetailId || 0;
                    $scope.calobj.seletedslotdate = getDate;
                    $scope.calobj.OrganizationId = OrganizationId || 0;
                    $scope.selectedAppointmentObject.DocObj = filteredDOcObj[0];
                    $scope.selectedAppointmentObject.EndTime = endTime;
                    $scope.selectedAppointmentObject.StartTime = startTime;
                    $scope.selectedAppointmentObject.Isunblock = false;
                    $scope.SideFilter.mainpatientScreen = false;
                    $scope.getCalendarPatientdeatilsObj();
                    //Ramya 16/01/2025
                    $scope.getUserBranchslotsByDate(resDoctorId(info.resource));
                }
                else {

                    if (doctorinfo.RoleID == 16) {
                        if ($scope.connectedUserObj.Available) {
                            if ($scope.connectedUserObj.Users.length > 0) {
                                var filter1 = $filter("filter")($scope.connectedUserObj.Users, function (Nitem) {
                                    return Nitem.ChildUserId === resDoctorId(info.resource);
                                }) || [];

                                if (filter1.length == 0) {
                                    alertify.error("You dont have access to unblock");
                                    return false;
                                }
                            }
                        }
                    }

                    //var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'> You have chosen non-business hours, do you want to continue? </h4>", function () {


                    //}, function () { });


                    let BusinessHoursInstance = $uibModal.open({
                        "templateUrl": "BusinessHoursPopUp.html",
                        "backdrop": "static",
                        "scope": $scope,
                        "keyboard": false,
                        "size": "sm",
                        "controller": function ($scope, $uibModal, $uibModalInstance) {
                            $scope.CloseBusinessPopup = function () {
                                $uibModalInstance.dismiss("cancel");
                            };

                            $scope.ContinueUnblockSlots = function () {
                                $scope.Non_BusinessRemarks = $scope.Non_BusinessRemarks || '';
                                if ($scope.Non_BusinessRemarks == '') {
                                    alertify.error("Please Enter the reason for unblock the slot & Book Appt");
                                    return false;
                                }

                                if (screenobj.Screen == "/op" && !$scope.UserAccessRights.AllAccessRights.APPCalendarBookAppointment) {
                                    alertify.error("Book appointment calendar access rights are not there");
                                    return false;
                                }
                                if (screenobj.Screen == "/crm" && !$scope.UserAccessRights.AllAccessRights.CRMCalendarBookAppointment) {
                                    alertify.error("Book appointment calendar access rights are not there");
                                    return false;
                                }
                                angular.forEach($scope.UserAvailableSlots, function (item) {
                                    angular.forEach(item.SlotsList, function (kitem) {
                                        let startTime = kitem.StartTime.replace(":", "");
                                        let endTime = kitem.EndTime.replace(":", "");
                                        let startTime1 = $filter('date')(parseCalenderDate(startDatetime), "HH:mm");
                                        let endTime1 = $filter('date')(parseCalenderDate(endDatetime), "HH:mm");
                                        startTime1 = startTime1.replace(":", "");
                                        endTime1 = endTime1.replace(":", "");
                                        //if (startTime1 > startTime && startTime1 < endTime) {
                                        //    $rootScope.appointment_type = kitem.VisitTypeId.toString();
                                        //}
                                    });
                                });
                                function getMinutesBetweenDates(startDate, endDate) {
                                    var diff = endDate.getTime() - startDate.getTime();
                                    return (diff / 60000);
                                }
                                var minutes = getMinutesBetweenDates(date1, date2);
                                var obj = {
                                    'IsComingFrom': 'Doctorcalendar',
                                    'MinPerCaseval': minutes,
                                    'Starttime': startDatetime,
                                    'Endtime': endDatetime,
                                    'GetDate': getDate,
                                    'SlotType': $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3,
                                    'AppointmentTypeId': $rootScope.appointment_type || 1,
                                    'OutOfBusinessTime': true

                                }
                                datapersistanceFactory.set("SingleDoctorcalendar", obj);
                                var docObject = {
                                    "DoctorId": resDoctorId(info.resource),
                                    "StartTime": startTime,
                                    "EndTime": endTime,
                                    "BranchId": resBranchId(info.resource) || $scope.HospitalId
                                }
                                console.log(docObject);
                                $scope.PageName = 'book';
                                var doctorID = {
                                    "DoctorID": parseInt(docObject.DoctorId)
                                };
                                $scope.calenderDate = moment(date).format('DD-MMM-YYYY' + ' ' + startTime);
                                $scope.ispatientExistsval = false;
                                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);

                                var clinicAddress = { "ClinicId": $scope.HospitalId };
                                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
                                $scope.appDate = "";
                                $scope.AppDate = "";
                                var date = apptConsultationDate();

                                datapersistanceFactory.set('appointmentinfo', "");
                                var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
                                appointmentInfo.AppointmentStatus = "B";
                                appointmentInfo.BillingId = 0;
                                appointmentInfo.CaptureBillingFrom = "Appointment";
                                eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);

                                var Obj = {
                                    "PageName": "book",
                                    "AppDate": "",
                                    "ispatientExistsval": $scope.ispatientExistsval || false,
                                    "calenderDate": $scope.calenderDate,
                                    "AppointmentId": null,
                                    "PatientId": null,
                                    'IsComingFrom': '',
                                    "type": $scope.CurrentUrl || "",
                                    "Non_BusinessRemarks": $scope.Non_BusinessRemarks || ""
                                };
                                datapersistanceFactory.set('AppointmentDetailsCache', Obj);
                                $scope.SideFilter.mainpatientScreen = false;
                                $scope.getCalendarPatientdeatilsObj();

                                /*BookApptPopupOpened();*/
                                BookApptPopupOpenedv2();
                                $scope.CloseBusinessPopup();
                            };
                        },
                    });


                }







            },
            datesSet: function () { decorateDoctorHeader(); },
            resourcesSet: function () { decorateDoctorHeader(); },
            viewDidMount: function () { decorateDoctorHeader(); watchDoctorHeader(); },
            resourceAreaHeaderContent: 'Doctors',
            resourceLabelDidMount: function (info) {

                console.log(info.resource.extendedProps)
                var VisitCountsArray = info.resource.extendedProps.VisitCountsArray || [];




                var thumbnailImg = document.createElement('img');
                if (info.resource.extendedProps.UserProfilepic !== "") {
                    thumbnailImg.src = info.resource.extendedProps.UserProfilepic;
                    thumbnailImg.alt = 'Thumbnail';
                    thumbnailImg.width = 25;
                    thumbnailImg.height = 25;

                    // Append the img element and the question mark to the parent element
                    var parentElement = info.el.querySelector('.fc-scrollgrid-sync-inner');
                    parentElement.appendChild(thumbnailImg);
                } else {


                }



                /*  var popover = "Total Appointments : " + info.resource.extendedProps.ApptsCount;*/

                //var popover = "";

                /*   popover = '<div class="appointment-popover-section"><div class="col-lg-12"><label>' + info.resource.extendedProps.FullName + ' Appointments :</label> <span style="color:red;font-size:12px;font-weight:600"> ' + info.resource.extendedProps.ApptsCount + '</span></div></div>';*/
                /*console.log(VisitCountsArray);*/


                var popover = "";

                //popover = '<div class="appointment-popover-section"><div class="col-lg-12">';
                //popover += '<label>Total Appointments :</label> <span style="color:red;font-size:10px;font-weight:500"> ' + info.resource.extendedProps.ApptsCount + '</span>';

                //if (VisitCountsArray.length > 0) {
                //    angular.forEach(VisitCountsArray, function (vitem) {
                //        var txtcolor = '#000000';
                //        if (vitem.ColorCode !== "") { txtcolor = vitem.ColorCode;}
                //        popover += ',<label style="color:' + txtcolor +' !important;" > ' + vitem.VisitReason + ' :</label> <span style="color:red;font-size:10px;font-weight:500"> ' + vitem.Count + '</span>';
                //    });
                //}

                popover = '<div class="appointment-popover-section"><ul class="appointment-list-count">';
                popover += '<li style="border-bottom: 1px solid #d2d2d2;"><label>Total Appointments:</label> <div><span style="color: #fff; font-size: 19px; font-weight: 600;background-color:#068cb0"> ' + info.resource.extendedProps.ApptsCount + '</span></div></li>';

                //if (VisitCountsArray.length > 0) {
                //    angular.forEach(VisitCountsArray, function (vitem) {
                //        popover += '<li style="border-bottom: 1px solid #d2d2d2;"><label>' + vitem.VisitReason + ' :</label><span style="color: #f26223; font-size: 12px; font-weight: 600">' + vitem.Count + '</span></li>';
                //    });
                //}
                // Visit-reason rows are shown in a fixed AppointmentTypeId order, with 4 and
                // 14 sharing a slot. Any other type is intentionally not listed.
                var POPOVER_TYPE_ORDER = [[1], [2], [3], [4, 14], [5], [6], [7], [8], [9], [10], [11], [12]];
                var RearrangeCalenderPopOver = [];
                angular.forEach(POPOVER_TYPE_ORDER, function (ids) {
                    angular.forEach(VisitCountsArray, function (item) {
                        if (ids.indexOf(item.AppointmentTypeId) !== -1) {
                            RearrangeCalenderPopOver.push(item);
                        }
                    });
                });
                if (RearrangeCalenderPopOver.length > 0) {
                    angular.forEach(RearrangeCalenderPopOver, function (vitem) {
                        popover += '<li style="border-bottom: 1px solid #d2d2d2;"><label>' + vitem.VisitReason + ':</label><div><span style="color: #f26223; font-size: 19px; font-weight: 600">' + vitem.Count + '</span></div></li>';
                    });
                }
                popover += '</ul></div>';

                var tooltip = $(info.el).qtip({
                    content: {
                        text: popover
                    },
                    show: {
                        solo: true,
                        event: 'mouseenter'
                    },
                    hide: {
                        fixed: true,
                        delay: 50,
                        //event: 'click mousedown mouseleave'
                        event: 'mouseleave'
                    },
                    adjust: {
                        scroll: true
                    },
                    position: {
                        target: 'mouse',
                        adjust: {
                            mouse: false
                        }
                    },
                    events: {
                        mousedown: function (event, api) {
                            qtipDown = true;
                        },
                        move: function (event, api) {
                            if (qtipDown)
                                event.preventDefault();
                        },
                        mouseleave: function (event, api) {
                            qtipDown = false;
                        }
                    },
                    style: {
                        width: 300,
                        tip: false,
                        classes: 'qtip-light qtip-shadow'
                    }
                });

            },
            // always composite ids, even before CalendarResources loads, so events still match a column
            resources: ($scope.CalendarResources && $scope.CalendarResources.length)
                ? $scope.CalendarResources
                : buildBranchResources(calendarDoctorList(), [], $scope.HospitalId, selectedBranchIds()),
            events: $scope.eventsList1 || [],
            eventDidMount: function (info) {
                $scope.eventRender(info.event.extendedProps, info);
                console.log("bg applying 2");
                if (info.event.extendedProps.background) {
                    info.el.style.background = info.event.extendedProps.background;
                    //info.el.style.background = "#fff";
                    //info.el.style.borderLeft = info.event.extendedProps.borderLeft;

                }
            },
            eventClick: function (info) {


                $scope.evencalobj.IsAppointmentUpdateAvailable = true;

                if (!info.event.extendedProps.IsBreakEvent) {
                    var appointmentMainObj = info.event.extendedProps;

                    console.log(appointmentMainObj);
                    //var startTime = $filter("date")(new Date(appointmentMainObj.STime), "HH:mm a");
                    //var endTime = $filter("date")(new Date(appointmentMainObj.ETime), "HH:mm a");

                    var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(appointmentMainObj.DoctorID); });
                    if (filteredDOcObj.length > 0) {
                        $scope.evencalobj.DoctorName = filteredDOcObj[0].FullName;
                    }
                    $scope.evencalobj.IsShow = true;

                    console.log(appointmentMainObj.startTime + "__" + appointmentMainObj.endTime);

                    function GetTime(date) {
                        var currentTime = (new Date(date))
                        var hours = currentTime.getHours()
                        //Note: before converting into 12 hour format
                        var suffix = '';
                        if (hours > 11) {
                            suffix += "PM";
                        } else {
                            suffix += "AM";
                        }
                        var minutes = currentTime.getMinutes()
                        if (minutes < 10) {
                            minutes = "0" + minutes
                        }
                        if (hours > 12) {
                            hours -= 12;
                        } else if (hours === 0) {
                            hours = 12;
                        }
                        var time = hours + ":" + minutes + " " + suffix;
                        return time;
                    }

                    var newStartTime = GetTime(appointmentMainObj.STime);
                    var newEndTime = GetTime(appointmentMainObj.ETime);
                    $scope.clearSelectedSlots();
                    $scope.clearBreakDetails();
                    $scope.evencalobj.StartTime = newStartTime;
                    $scope.evencalobj.EndTime = newEndTime;
                    $scope.evencalobj.DoctorId = appointmentMainObj.DoctorID;
                    $scope.evencalobj.infoobj = appointmentMainObj;
                    $scope.evencalobj.PatientName = appointmentMainObj.AppointmentDetails.patientInfo.fullName;
                    $scope.evencalobj.appointmentStatus = info.event.extendedProps.AppointmentDetails.appointmentStatus;
                    $scope.evencalobj.VisitTypeId = info.event.extendedProps.AppointmentDetails.VisitTypeId || 0;
                    $scope.evencalobj.date = info.event.extendedProps.AppointmentDetails.startDate;
                    $scope.evencalobj.RestrictMultipleSlots = appointmentMainObj.AppointmentDetails.RestrictMultipleSlots || false;



                    var tmpd1 = $filter('date')($scope.evencalobj.date, "yyyy-MM-dd");
                    var tmpd2 = $filter('date')(new Date(), "yyyy-MM-dd");

                    let isPastDate = false;
                    if (tmpd2 > tmpd1) {
                        isPastDate = true;
                    }

                    appointmentMainObj.AppointmentDetails.NoShowReasonId = appointmentMainObj.AppointmentDetails.NoShowReasonId || null;

                    if (isPastDate && appointmentMainObj.AppointmentDetails.IsNoShowAppointment && appointmentMainObj.AppointmentDetails.NoShowReasonId == null) {
                        $scope.evencalobj.IsNoShowIconInd = true;
                    } else {
                        $scope.evencalobj.IsNoShowIconInd = false;
                    }

                    if ((appointmentMainObj.AppointmentDetails.appointmentStatus !== "C" &&
                        appointmentMainObj.AppointmentDetails.CheckinStatusId == 3) || appointmentMainObj.AppointmentDetails.CheckinStatusId == 4) {
                        $scope.evencalobj.IsAppointmentUpdateAvailable = false;
                    }

                    $scope.PopoverBtnObj.appointmentStatus = info.event.extendedProps.AppointmentDetails.appointmentStatus;
                    $scope.PopoverBtnObj.CheckinStatusId = info.event.extendedProps.AppointmentDetails.CheckinStatusId;

                    var currentTime = $filter('date')(new Date(), 'HH:mm');
                    var newStartTime1 = $filter('date')(new Date(appointmentMainObj.STime), 'HH:mm');
                    var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
                    var currentDate1 = $filter('date')(new Date(appointmentMainObj.AppointmentDetails.startDate), "yyyy-MM-dd");

                    $scope.evencalobj.BookNewAppointmentIND = false;
                    if (currentDate1 == currentdate) {
                        if (newStartTime1 > currentTime) {
                            $scope.evencalobj.BookNewAppointmentIND = true;
                        }
                    }

                    $scope.SideFilter.mainpatientScreen = false;
                    $scope.getCalendarPatientdeatilsObj();
                    var appointmentID = appointmentMainObj.AppointmentDetails.appointmentID || 0;
                    $scope.ChangePatientDetailsEventClick(appointmentID);
                } else {
                    let tempObj = info.event.extendedProps;

                    var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(tempObj.SlotInfo.DoctorId); });
                    if (filteredDOcObj.length > 0) {
                        $scope.BreakEventObj.DoctorName = filteredDOcObj[0].FullName;
                    }
                    $scope.BreakEventObj.IsShow = true;
                    $scope.BreakEventObj.StartTime = new Date(tempObj.SlotInfo.StartTime);
                    $scope.BreakEventObj.EndTime = new Date(tempObj.SlotInfo.EndTime);
                    $scope.BreakEventObj.DoctorId = tempObj.SlotInfo.DoctorId;
                    $scope.BreakEventObj.infoobj = tempObj;
                    $scope.BreakEventObj.date = tempObj.SlotInfo.ConsultationDate;
                    $scope.BreakEventObj.BreakReason = tempObj.SlotInfo.ReasonforBlockSlot || "";
                    $scope.BreakEventObj.BreakRemarks = tempObj.SlotInfo.BlockedRemarks || "";

                    $scope.clearEventSelectedSlots();
                    $scope.clearSelectedSlots();
                }

            },
            eventDrop: function (info, dayDelta, minuteDelta, allDay, revertFunc) {
                console.log(info.event.extendedProps);


                //drag and drop appt into break or block slot case -- start (22-09-2023) - prod issue
                let breakcounter = 0;
                let filteredEvents = $filter('filter')($scope.eventsList1, { "resourceId": String(info.event._def.resourceIds[0]) }, true);
                angular.forEach(filteredEvents, function (item) {
                    if (item.IsBreakEvent) {
                        let st = $filter('date')(new Date(item.SlotInfo.StartTime), "HH:mm");
                        st = st.split(":").join("");
                        let et = $filter('date')(new Date(item.SlotInfo.EndTime), "HH:mm");
                        et = et.split(":").join("");

                        let startTime = $filter("date")(new Date(info.event.start), "HH:mm");
                        startTime = startTime.split(":").join("");
                        let endTime = $filter('date')(new Date(info.event.end), 'HH:mm');
                        endTime = endTime.split(":").join("");

                        if ((startTime >= st && startTime < et) || (endTime > st && endTime <= et)) {
                            breakcounter++
                        }
                    }
                });

                if (breakcounter > 0) {
                    alertify.error("This slot is blocked, please unblock the slot to move the appointment");
                    info.revert();
                    return;
                }

                // drag and drop appt into break or block slot case -- end

                if (info.event.extendedProps.AppointmentDetails.appointmentStatus !== 'C' && info.event.extendedProps.AppointmentDetails.appointmentStatus !== 'R') {

                    var GivenDate = moment(info.event.start).format('DD-MMM-YYYY');
                    var CurrentDate = new Date();
                    GivenDate = parseCalenderDate(GivenDate);
                    if (GivenDate > CurrentDate) {

                    } else {
                        var given1 = $filter('date')(parseCalenderDate(GivenDate), "MM-dd-yyyy");
                        var current1 = $filter('date')(new Date(CurrentDate), "MM-dd-yyyy");
                        if (given1 === current1) {
                            var todaystartTime = $filter("date")(new Date(info.event.start), "HH:mm");
                            var todaytime = $filter('date')(new Date(), 'HH:mm');
                            if (todaystartTime < todaytime) {
                                alertify.error('This Time Slot Has Already Ended!');
                                info.revert();
                                return false;
                            }
                        }
                    }

                    if (parseInt(info.event._def.extendedProps.DoctorID) != resDoctorId(info.event._def.resourceIds[0])) {

                        if (info.newResource._resource.extendedProps.IsLeave == true) {
                            alertify.error("Doctor is on leave, Please choose another day/doctor");
                            info.revert();
                            return;
                        }
                        if (info.newResource._resource.extendedProps.IsUserDisabled == true) {
                            alertify.error("Doctor is disabled, please select another doctor");
                            info.revert();
                            return;
                        }

                        var filteredDOcObj = resourceRowsFor(info.event._def.resourceIds[0]);
                        if (filteredDOcObj.length > 0) {
                            //if (filteredDOcObj[0].SlotStartTime == "00:00" && filteredDOcObj[0].SlotEndTime == "00:00") {
                            //    var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'> Slots Exhausted, Do You Wish to Continue? </h4>", function () {
                            //        $scope.ChangeAppointmentDoctor(info, info.event.extendedProps);
                            //    }, function () {
                            //        info.revert();
                            //    });
                            //} else {

                            // code for when destination doctor already has appt with same patient
                            let apptslistbydoc = $filter('filter')($scope.eventsList1, { "DoctorID": resDoctorId(info.event._def.resourceIds[0]) }, true);
                            let selectedPatientID = info.event.extendedProps.patientID;
                            let patientslist = $filter('filter')(apptslistbydoc, { "patientID": selectedPatientID }, true);
                            if (patientslist.length > 0) {
                                alertify.error("Patient already has an appointment with the doctor!");
                                info.revert();
                                return;
                            }
                            $scope.getUserBranchSlotRestrictionForCalender1(resDoctorId(info.event._def.resourceIds[0]), info.event.start, info, info.event.extendedProps);
                            //}
                        } else {
                            info.revert();
                        }
                    } else {
                        var startTime = $filter("date")(new Date(info.event.start), "HH:mm");
                        var start1 = startTime.replaceAll(":", "");
                        var filteredDOcObj = resourceRowsFor(info.event._def.resourceIds[0]);
                        var OverAllStartTime1 = filteredDOcObj[0].businessHours.startTime.replaceAll(":", "");
                        var OverAllEndTime1 = filteredDOcObj[0].businessHours.endTime.replaceAll(":", "");
                        $scope.UserAvailableSlots = $scope.UserAvailableSlots || [];
                        if (filteredDOcObj.length > 0 && $scope.UserAvailableSlots.length > 0) {
                            let tempArray = $filter('filter')($scope.UserAvailableSlots, { "DoctorId": filteredDOcObj[0].DoctorID }, true);
                            if (tempArray.length > 0) {
                                var CalenderDoctorAvailableSlots = tempArray[0];
                            }
                        }

                        if (CalenderDoctorAvailableSlots.IsAdvancedSchedule) {

                            // number of appointments for this slot
                            let apptsCounter = 0;
                            let filteredEventsArr = $filter('filter')($scope.eventsList1, { "DoctorID": resDoctorId(info.event._def.resourceIds[0]) }, true);
                            angular.forEach(filteredEventsArr, function (item) {
                                if (!item.IsBreakEvent) {
                                    let st = item.AppointmentDetails.startTime.split(":");
                                    st = st[0] + ":" + st[1];
                                    if (st === startTime) {
                                        apptsCounter++;
                                    }
                                }
                            });

                            var maxapptcounter = 0;
                            var visitrsncounter = 0;
                            angular.forEach(CalenderDoctorAvailableSlots.SlotsList, function (item) {
                                if (startTime == item.StartTime) {
                                    if (item.MaxNumberOfSlots == apptsCounter || apptsCounter > item.MaxNumberOfSlots) {
                                        maxapptcounter++;
                                    }
                                    let tempArray = $filter('filter')(item.VisitReasons, { "ReasonId": info.event.extendedProps.AppointmentDetails.VisitTypeId }, true);
                                    if (tempArray.length > 0) {
                                        visitrsncounter = 1;
                                    } else {
                                        visitrsncounter = 2;
                                    }
                                }
                            });

                        } else {
                            // number of appointments for this slot
                            let apptsCounter = 0;
                            let filteredEventsArr = $filter('filter')($scope.eventsList1, { "DoctorID": resDoctorId(info.event._def.resourceIds[0]) }, true);
                            angular.forEach(filteredEventsArr, function (item) {
                                if (!item.IsBreakEvent) {
                                    let st = item.AppointmentDetails.startTime.split(":");
                                    st = st[0] + ":" + st[1];
                                    if (st === startTime) {
                                        apptsCounter++;
                                    }
                                }
                            });

                            var maxapptcounter = 0;
                            var visitrsncounter = 0;
                            angular.forEach(CalenderDoctorAvailableSlots.SlotsList, function (item) {
                                let s1 = item.StartTime.replaceAll(":", "");
                                let e1 = item.EndTime.replaceAll(":", "");
                                if (start1 >= s1 && start1 < e1) {
                                    if (item.MaxNumberOfSlots == apptsCounter || apptsCounter > item.MaxNumberOfSlots) {
                                        maxapptcounter++;
                                    }
                                    let tempArray = $filter('filter')(item.VisitReasons, { "VisitTypeId": info.event.extendedProps.AppointmentDetails.AppointmentTypeId }, true);
                                    if (tempArray.length > 0) {
                                        visitrsncounter = 1;
                                    } else {
                                        visitrsncounter = 2;
                                    }
                                }
                            });

                        }

                        if (maxapptcounter > 0) {

                            $scope.mInstanceAdd = $uibModal.open({
                                "templateUrl": "templates/uibpopups/ConfirmationPopupMaxSlots.html",
                                "backdrop": "static",
                                "scope": $scope,
                                "keyboard": false,
                                "size": "md",
                                "resolve": {
                                    "type": function () { return 1; }
                                },
                                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, type) {
                                    let pageName = $location.url();
                                    $scope.type = type;
                                    $scope.MaxSlotObj = {
                                        "Remarks": "",
                                        "status": ""
                                    };

                                    $scope.continuemaxslotbookappointment = function () {
                                        if (pageName == '/op') {
                                            if (!$scope.UserAccessRights.AllAccessRights.OPUnblockSlotAccess) {
                                                alertify.error("You dont have access,please contact your manager");
                                                return false;
                                            }
                                        }

                                        if (pageName == '/crm') {
                                            if (!$scope.UserAccessRights.AllAccessRights.CRMUnblockSlotAccess) {
                                                alertify.error("You dont have access,please contact your manager");
                                                return false;
                                            }
                                        }
                                        if ($scope.MaxSlotObj.Remarks === "") {
                                            alertify.error("Please Enter Remarks");
                                            return false;
                                        }

                                        $scope.MaxSlotObj.status = "Yes";
                                        $uibModalInstance.close($scope.MaxSlotObj);
                                    };

                                    $scope.cancelmaxslotBookAppointment = function () {
                                        $scope.MaxSlotObj.status = "No";
                                        $uibModalInstance.close($scope.MaxSlotObj);
                                    }
                                }
                            });
                            $scope.mInstanceAdd.result.then(function (resp) {

                                if (resp.status === "Yes") {
                                    $scope.ChangeAppointmentDoctor(info, info.event.extendedProps, resp.Remarks);
                                } else {
                                    info.revert();
                                }
                            }, function (cancel) {
                            });

                            return;
                        }
                        if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1)) && visitrsncounter == 2) {
                            $scope.mInstanceAdd = $uibModal.open({
                                "templateUrl": "templates/uibpopups/ConfirmationPopupMaxSlots.html",
                                "backdrop": "static",
                                "scope": $scope,
                                "keyboard": false,
                                "size": "md",
                                "resolve": {
                                    "type": function () { return 2; }
                                },
                                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, type) {
                                    let pageName = $location.url();
                                    $scope.type = type;
                                    $scope.MaxSlotObj = {
                                        "Remarks": "",
                                        "status": ""
                                    };

                                    $scope.continuemaxslotbookappointment = function () {
                                        if (pageName == '/op') {
                                            if (!$scope.UserAccessRights.AllAccessRights.OPUnblockSlotAccess) {
                                                alertify.error("You dont have access,please contact your manager");
                                                return false;
                                            }
                                        }

                                        if (pageName == '/crm') {
                                            if (!$scope.UserAccessRights.AllAccessRights.CRMUnblockSlotAccess) {
                                                alertify.error("You dont have access,please contact your manager");
                                                return false;
                                            }
                                        }
                                        if ($scope.MaxSlotObj.Remarks === "") {
                                            alertify.error("Please Enter Remarks");
                                            return false;
                                        }

                                        $scope.MaxSlotObj.status = "Yes";
                                        $uibModalInstance.close($scope.MaxSlotObj);
                                    };

                                    $scope.cancelmaxslotBookAppointment = function () {
                                        $scope.MaxSlotObj.status = "No";
                                        $uibModalInstance.close($scope.MaxSlotObj);
                                    }
                                }
                            });
                            $scope.mInstanceAdd.result.then(function (resp) {

                                if (resp.status === "Yes") {
                                    $scope.ChangeAppointmentDoctor(info, info.event.extendedProps, resp.Remarks);
                                } else {
                                    info.revert();
                                }
                            }, function (cancel) {
                            });
                            return;
                        }

                        if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {

                            $scope.ChangeAppointmentDoctor(info, info.event.extendedProps);

                        } else {
                            if (filteredDOcObj[0].SlotStartTime != "00:00" && filteredDOcObj[0].SlotEndTime != "00:00") {
                                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'> You Have Selected Non-business Hours, Do You Wish to Continue?</h4>", function () {
                                    $scope.ChangeAppointmentDoctor(info, info.event.extendedProps);
                                }, function () {
                                    info.revert();
                                });
                            } else {
                                info.revert();
                            }
                        }
                        // $scope.ChangeAppointmentDoctor(info, info.event.extendedProps);
                    }
                    console.log(info.event.start);
                } else {
                    info.revert();
                }
            },
            eventContent: function (info) {
                var icon = '';
                if (info.event.extendedProps.icon) {
                    icon = '<i class="' + info.event.extendedProps.icon + '"></i> ';
                }
                return { html: icon + info.event.title };
            }
        }, overrides || {});
    }

    var calendarDayDataStale = false;
    function currentCalendarView() {
        return parseInt(($scope.mainCalendarView || {}).MainTab, 10) === 1 ? $scope.activeEvent : $scope.calendarView2;
    }
    function applySelectedCalendarView() {
        var selectedView = currentCalendarView();
        if (selectedView === 'week') {
            $scope.$broadcast('CalendarViewChange', 'week');
            return true;
        }
        if (selectedView === 'month') {
            $scope.$broadcast('CalendarMonthViewChange', 'month');
            return true;
        }
        return false;
    }

    function onclickallDoctor() {
        if (applySelectedCalendarView()) { return; }

        console.log("OnClick__Date");

        var calendarEl = document.getElementById('calendarFull');


        calendar = new FullCalendar.Calendar(calendarEl, buildCalendarOptions({
            events: $scope.eventsList1 || []
        }));




        calendar.render();

    }

    $scope.scrolltotimeby = function () {
        console.log("called");
        calendar.scrollToTime('11:00:00');
        calendar.setOption('scrollTime', '11:00:00')
    }

    function onclickPageLoad() {
        var formatteddateValue = apptConsultationParam();
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "usrType": "DOCTOR",
            "startDate": formatteddateValue,
            "endDate": formatteddateValue,
            "HospitalID": $scope.HospitalId,
            "GetAllIndicator": 0,
            "AppointmentTypeStatusIDList": "",
            "VisitReasonIdList": "",
            "VisitStatusIDLst": "",
            "PatientTagListIds": "",
        };

        if ($scope.appointmentTypes != undefined) {
            var listApptTypeArray = $filter("filter")($scope.appointmentTypes, function (iterator, ind) { return iterator.isChecked === true; });
            var apptList = _.pluck(listApptTypeArray, "Id").join(",");
            params.AppointmentTypeStatusIDList = apptList || "";
        }

        if ($scope.Visitreasons != undefined) {
            var listVisitRsnArray = $filter("filter")($scope.Visitreasons, function (iterator, ind) { return iterator.isChecked === true; });
            var visitRsnList = _.pluck(listVisitRsnArray, "ReasonId").join(",");
            params.VisitReasonIdList = visitRsnList || "";
        }

        // multi checkbox status and profile status list

        let statuslist = "";
        for (let i in $scope.confirmationStatusArray1) {
            if ($scope.confirmationStatusArray1[i].IsChecked) {
                statuslist += "," + $scope.confirmationStatusArray1[i].ConfirmationStatusId;
            }
        }
        if (statuslist.charAt(0) === ",") {
            statuslist = statuslist.slice(1);
        }

        var newlist7 = "";
        for (var i in $scope.BookingTypesArray1) {
            if ($scope.BookingTypesArray1[i].IsChecked) {
                newlist7 += "," + $scope.BookingTypesArray1[i].BookingTypeId;
            }
        }
        if (newlist7.charAt(0) === ",") {
            newlist7 = newlist7.slice(1);
        }

        var newlist10 = "";
        for (var i in $scope.AppointmentStatusArray1) {
            if ($scope.AppointmentStatusArray1[i].IsChecked) {
                newlist10 += "," + $scope.AppointmentStatusArray1[i].AppointmentStatusId;
            }
        }
        if (newlist10.charAt(0) === ",") {
            newlist10 = newlist10.slice(1);
        }

        var newlist11 = "";
        for (var i in $scope.BookedstatusFilterList1) {
            if ($scope.BookedstatusFilterList1[i].IsChecked) {
                newlist11 += "," + $scope.BookedstatusFilterList1[i].Id;
            }
        }
        if (newlist11.charAt(0) === ",") {
            newlist11 = newlist11.slice(1);
        }

        let profilestatuslist = "";
        for (let i in $scope.ProfileStatusList1) {
            if ($scope.ProfileStatusList1[i].IsChecked) {
                profilestatuslist += "," + $scope.ProfileStatusList1[i].Id;
            }
        }
        if (profilestatuslist.charAt(0) === ",") {
            profilestatuslist = profilestatuslist.slice(1);
        }
        //if ($scope.AppoinmentBookingTypeobj1.AppoinmentBookingTypeID == 1) {
        //    params.VisitStatusIDLst = "1";
        //} else {
        //    params.VisitStatusIDLst = "1,2,3";
        //}

        params.VisitStatusIDLst = "1,2,3";

        //if ($scope.AppoinmentBookingTypeobj1.AppoinmentBookingTypeID == 2) {
        //    $scope.ApptFilterObj.IsNoShowAppointment1 = true;
        //} else {
        //    $scope.ApptFilterObj.IsNoShowAppointment1 = false;
        //}
        var PatientTags = "";
        for (var i in $scope.PatientTagList1) {
            if ($scope.PatientTagList1[i].IsChecked) {
                PatientTags += "," + $scope.PatientTagList1[i].HospitalEquipmentId;
            }
        }
        if (PatientTags.charAt(0) === ",") {
            PatientTags = PatientTags.slice(1);
        }
        //var newlist12 = "";
        //for (var i in $scope.FacilityList) {
        //    if ($scope.FacilityList[i].IsChecked) {
        //        newlist12 += "," + $scope.FacilityList[i].OrganizationFacilityId;
        //    }
        //}
        //if (newlist12.charAt(0) === ",") {
        //    newlist12 = newlist12.slice(1);
        //}

        var Locationids = '';
        // send every ticked branch; fall back to single/all when nothing is ticked yet (first load)
        var checkedBranches = $filter("filter")($scope.ApptBranchLocations || [], function (b) {
            return b.ClinicId !== 0 && b.IsChecked;
        }) || [];
        if (checkedBranches.length > 0) {
            Locationids = _.pluck(checkedBranches, "ClinicId").join(",");
        } else if ($scope.GetAllIndicator == 1 || $scope.AppListselectedclinic.ClinicId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.ApptBranchLocations, function (iterator, ind) { return iterator.ClinicId !== 0; });
            Locationids = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
        } else {
            Locationids = $scope.AppListselectedclinic.ClinicId;
        }
        console.log('[calendar] requesting Locationids=' + Locationids);

        //params.StatusIds = angular.copy(statuslist);

        params.BookingTypeIds = angular.copy(newlist7);
        params.AppointmentStatusIds = angular.copy(newlist10);
        params.BookingStatusIds = angular.copy(newlist11);

        params.ProfileStatusIds = angular.copy(profilestatuslist);
        // params.IsNoShowAppointment = $scope.ApptFilterObj.IsNoShowAppointment1 || false;
        params.PatientTagListIds = PatientTags;
        params.Locationids = angular.copy(Locationids);
        params.FacilityListIds = "";
        eHnoteUserAppointmentDataService.getWeekwiseMonthwiseAppointments(params, onweekSuccess, onweekError);
        function onweekSuccess(data) {
            $scope.eventsList1 = [];
            var booked = data;

            $scope.minPerCase = 15;
            $scope.eventsList = [];
            $scope.appCount = data.appointmentCounts;
            $scope.UserAvailableSlots = data.UserAvailableSlots || [];
            $scope.IsBranchHoliday = data.IsBranchHoliday || false;

            if ($scope.UserAvailableSlots.length > 0) {
                angular.forEach($scope.UserAvailableSlots, function (item) {
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
                        angular.forEach(item.UserDayBlockedSlots, function (hitem) {
                            if (item.UserBranchId === hitem.UserBranchId) {
                                item.UserDayBreakSlots.push(hitem);
                            }
                        });
                    }
                });
            }


            $scope.slotsMainList = [];


            // one column per doctor-at-a-branch, each resolving its own schedule
            $scope.CalendarResources = buildBranchResources(
                calendarDoctorList(), data.UserAvailableSlots, data.HospitalID || $scope.HospitalId, selectedBranchIds());

            angular.forEach($scope.CalendarResources, function (citem) {
                citem.ApptsCount = 0;
                citem.VisitCountsArray = [];
                citem.IsLeave = false;
                if (data.calendarList.length > 0) {
                    $scope.slotsMainList = data.calendarList[0].slotList || [];
                    if ($scope.slotsMainList.length > 0) {
                        angular.forEach($scope.slotsMainList, function (sitem) {
                            if (sitem.doctorID === citem.DoctorID && (!citem.BranchId || sitem.hospitalID === citem.BranchId)) {
                                citem.ApptsCount = sitem.DoctorTotalAppointmentCount || 0;
                            }
                        });





                        var filteredSlostArray = $filter("filter")($scope.slotsMainList, function (item, index) { return item.doctorID === citem.DoctorID && (!citem.BranchId || item.hospitalID === citem.BranchId); }) || [];

                        if (filteredSlostArray.length > 0) {
                            $scope.visitTypeCount = {};
                            angular.forEach(filteredSlostArray, function (slot) {
                                var visitTypeId = slot.VisitTypeId;
                                if ($scope.visitTypeCount[visitTypeId]) {
                                    $scope.visitTypeCount[visitTypeId].count += 1;
                                } else {
                                    $scope.visitTypeCount[visitTypeId] = {
                                        count: 1,
                                        AppointmentTypeId: slot.AppointmentTypeId,
                                        VisitReason: slot.VisitReason,
                                        VisitReasonColorCode: slot.VisitReasonColorCode
                                    };
                                }
                            });

                            // Iterate over the visitTypeCount object and push VisitTypeId, count, and visitReason as an object to the array
                            angular.forEach($scope.visitTypeCount, function (value, visitTypeId) {
                                citem.VisitCountsArray.push({
                                    'VisitTypeId': visitTypeId,
                                    'Count': value.count,
                                    'VisitReason': value.VisitReason,
                                    'ColorCode': value.VisitReasonColorCode,
                                    "AppointmentTypeId": value.AppointmentTypeId,
                                });
                            });

                            // Log the separate array containing VisitTypeId, count, and visitReason
                            //angular.forEach($scope.visitTypeCountList, function (item) {
                            //    console.log(item);
                            //});

                            console.log(citem.VisitCountsArray);
                        }

                    }
                }

                var filteredDOcObj = $filter("filter")(data.UserAvailableSlots, function (iterator, ind) {
                    return parseInt(iterator.DoctorId, 10) === parseInt(citem.DoctorID, 10)
                        && (!citem.BranchId
                            || parseInt(iterator.OrganizationId, 10) === parseInt(citem.BranchId, 10));
                });
                if (filteredDOcObj.length > 0) {

                    citem.SlotStartTime = filteredDOcObj[0].StartTime || "00:00";
                    citem.SlotEndTime = filteredDOcObj[0].EndTime || "00:00";
                    // Re-sync per month's schedule — see comment on the same fix above.
                    citem.MinPerCase = parseInt(filteredDOcObj[0].MinPerCase || filteredDOcObj[0].AverageConsultationTime || citem.MinPerCase || 15);
                } else {
                    citem.SlotStartTime = "00:00";
                    citem.SlotEndTime = "00:00";
                }

                if (citem.SlotStartTime === "00:00") {
                    citem.businessHours = {
                        "startTime": "23:59",
                        "endTime": "24:00"
                    }
                }
                else {

                    if (filteredDOcObj[0].IsLeave) {
                        citem.IsLeave = true;
                        citem.businessHours = {
                            "startTime": "00:00",
                            "endTime": "00:00"
                        }
                    } else {
                        citem.businessHours = {
                            "startTime": citem.SlotStartTime,
                            "endTime": citem.SlotEndTime
                        }
                    }

                }
            });


            //if (data.UserAvailableSlots.length > 0) {
            //    var consultationDate = $filter('date')(new Date(booked.calendarList[j].consultationDt), "yyyy-MM-dd");
            //    var UserAvailableSlots = $filter('filter')(data.UserAvailableSlots, { "SlotDate": consultationDate }, true);

            //    var filterary1 = $filter("filter")(UserAvailableSlots, { "DoctorId": booked.calendarList[j].slotList[k].doctorID }, true) || [];
            //    if (filterary1.length > 0) {
            //        overallMaxSlotsCount = filterary1[0].MaximumOverAllSlots || 0;
            //    }
            //}



            $timeout(function () {


                if (currentCalendarView() !== 'day') {
                    loadEvents(booked, data);
                    return;
                }
                var calendarEl = document.getElementById('calendarFull');

                calendar = new FullCalendar.Calendar(calendarEl, buildCalendarOptions({
                    events: $scope.eventsList1 || []
                }));

                calendar.render();


                loadEvents(booked, data);

            }, 500);






        }
        function onweekError(data) {

        }
    }




    function BookApptPopupOpened() {
        var openBookAppt = "";
        $scope.bookapptSetupPopUp = $uibModal.open({
            "templateUrl": "templates/appointment/BookAppointmentPopup.html",
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "appointment-full-popup",
            "controller": "UsNewBookAppointmentPopupCtrl",
            "resolve": {
                "allUserList": function () { return angular.copy($scope.allUserList); },
                "openBookAppt": function () { return openBookAppt; }
            }
        });

        $scope.bookapptSetupPopUp.result.then(function (resp) {

            $scope.clearSelectedSlots();
            $scope.filterSelectedDoctorsonCalendar();

        }, function () { });

    }

    function BookApptPopupOpenedv2() {
        var openBookAppt = "";
        $scope.bookapptSetupPopUp = $uibModal.open({
            "templateUrl": "templates/appointment/BookAppointmentPopupv3.html",
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "modal__popup--1 bottom-to-top-modal",
            "controller": "UsBookAppointmentPopupv2",
            "resolve": {
                "allUserList": function () { return angular.copy($scope.allUserList); },
                "openBookAppt": function () { return openBookAppt; },
                "BranchList": function () { return $scope.BranchesListArray || []; }
            }
        });

        $scope.bookapptSetupPopUp.result.then(function (resp) {

            $scope.clearSelectedSlots();
            $scope.filterSelectedDoctorsonCalendar();

        }, function () { });

    }

    function openAppPopup() {
        $scope.SetupPopUp = $uibModal.open({
            "templateUrl": 'appointMentPopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "appointment-full-popup"
        });
        $scope.SetupPopUp.result.then(function (type) {

            $scope.clearSelectedSlots();
        }, function (cancel) {
            $scope.clearSelectedSlots();
        });

    }
    $scope.$on("closePopup", function (event) {
        $scope.SetupPopUp.dismiss('cancel');
        $scope.clearEventSelectedSlots();
        $scope.clearSelectedSlots();
    });


    $scope.$on("successMethod", function (event) {
        $scope.SetupPopUp.dismiss('cancel');
        $scope.loadDayView();

        RefreshTopBarCount();
        $scope.clearSelectedSlots();
        $scope.clearEventSelectedSlots();
    });



    $scope.$on('allCalendarView', function () {



        $scope.Calendardoctorlist1 = eHnoteMasterDataService.getCalendarDoctorinAppList();




        angular.forEach($scope.Calendardoctorlist1, function (citem) {
            citem.ApptsCount = 0;
        });
        console.log($scope.Calendardoctorlist1);

        if (currentCalendarView() === 'month') {
            calendarDayDataStale = true;
            $scope.$broadcast('CalendarMonthViewChange', 'month');
            return;
        }
        if (currentCalendarView() === 'day') {
            $('#calendarFull').fullCalendar('destroy');
            calendar.destroy();
        }
        onclickPageLoad();

        ////angular.forEach($scope.Calendardoctorlist1, function (citem) {
        ////    citem.SlotStartTime = citem.SlotStartTime || "00:00";
        ////    citem.SlotEndTime = citem.SlotEndTime || "00:00";

        ////    if (citem.SlotStartTime === "00:00") {
        ////        citem.businessHours = {
        ////            "startTime": "23:59",
        ////            "endTime": "24:00"
        ////        }
        ////    } else {
        ////        citem.businessHours = {
        ////            "startTime": citem.SlotStartTime,
        ////            "endTime": citem.SlotEndTime
        ////        }
        ////    }
        ////});


        //var formatteddateValue = $filter('date')(apptConsultationDate(), "yyyy-MM-dd");
        //console.log(formatteddateValue);
        //var params = {
        //    "UserId": eHnoteMasterDataService.getLoginId(),
        //    "usrType": "DOCTOR",
        //    "startDate": formatteddateValue,
        //    "endDate": formatteddateValue,
        //    "HospitalID": $scope.HospitalId,
        //    "GetAllIndicator": 0,
        //    "AppointmentTypeStatusIDList": "",
        //    "VisitReasonIdList": "",
        //    //"IsConfirmedAppointment": $scope.CalenderObj.IsConfirmedAppointment || false
        //};

        //if ($scope.appointmentTypes != undefined) {
        //    var listApptTypeArray = $filter("filter")($scope.appointmentTypes, function (iterator, ind) { return iterator.isChecked === true; });
        //    var apptList = _.pluck(listApptTypeArray, "Id").join(",");
        //    params.AppointmentTypeStatusIDList = apptList || "";
        //}

        //if ($scope.Visitreasons != undefined) {
        //    var listVisitRsnArray = $filter("filter")($scope.Visitreasons, function (iterator, ind) { return iterator.isChecked === true; });
        //    var visitRsnList = _.pluck(listVisitRsnArray, "ReasonId").join(",");
        //    params.VisitReasonIdList = visitRsnList || "";
        //}



        //let statuslist = "";
        //for (let i in $scope.confirmationStatusArray1) {
        //    if ($scope.confirmationStatusArray1[i].IsChecked) {
        //        statuslist += "," + $scope.confirmationStatusArray1[i].ConfirmationStatusId;
        //    }
        //}
        //if (statuslist.charAt(0) === ",") {
        //    statuslist = statuslist.slice(1);
        //}

        //let profilestatuslist = "";
        //for (let i in $scope.ProfileStatusList1) {
        //    if ($scope.ProfileStatusList1[i].IsChecked) {
        //        profilestatuslist += "," + $scope.ProfileStatusList1[i].Id;
        //    }
        //}
        //if (profilestatuslist.charAt(0) === ",") {
        //    profilestatuslist = profilestatuslist.slice(1);
        //}


        //params.StatusIds = angular.copy(statuslist);
        //params.ProfileStatusIds = angular.copy(profilestatuslist);
        //params.IsNoShowAppointment = $scope.ApptFilterObj.IsNoShowAppointment1 || false;


        //eHnoteUserAppointmentDataService.getWeekwiseMonthwiseAppointments(params, onweekSuccess, onweekError);
        //function onweekSuccess(data) {
        //    console.log(data.AvailableSlots);
        //    data.AvailableSlots = data.AvailableSlots || [];
        //    $scope.UserAvailableSlots = data.UserAvailableSlots || [];
        //    $scope.eventsList1 = [];
        //    var booked = data;

        //    $scope.minPerCase = 15;
        //    $scope.eventsList = [];

        //    angular.forEach($scope.Calendardoctorlist1, function (citem) {
        //          var filteredDOcObj = $filter("filter")(data.UserAvailableSlots, function (iterator, ind) { return iterator.DoctorId === citem.DoctorID; });
        //        if (filteredDOcObj.length > 0) {

        //            citem.SlotStartTime = filteredDOcObj[0].StartTime || "00:00";
        //            citem.SlotEndTime = filteredDOcObj[0].EndTime || "00:00";
        //            citem.ApptsCount = filteredDOcObj[0].DoctorTotalAppointmentCount || 0;
        //        } else {
        //            citem.SlotStartTime = "00:00";
        //            citem.SlotEndTime = "00:00";
        //            citem.ApptsCount = 0;
        //        }

        //        if (citem.SlotStartTime === "00:00") {
        //            citem.businessHours = {
        //                "startTime": "23:59",
        //                "endTime": "24:00"
        //            }
        //        } else {
        //            citem.businessHours = {
        //                "startTime": citem.SlotStartTime,
        //                "endTime": citem.SlotEndTime
        //            }
        //        };


        //    });

        //    console.log($scope.Calendardoctorlist1);


        //}
        //function onweekError(data) {
        //}



        //$scope.loadDayView();
        //onclickallDoctor();

    });

    $scope.$on('allCalendarViewForVisitReason', function (evt, data) {

        console.log(data);

        $scope.Calendardoctorlist1 = eHnoteMasterDataService.getCalendarDoctorinAppList();



        $scope.AllDoctorsObj.AllVisitReasonsCheck = false;
        angular.forEach($scope.Visitreasons, function (item) {
            item.isChecked = false;
            var filteredArray = $filter("filter")(data, function (titem) { return titem.VisitReasonId === item.ReasonId; });
            filteredArray = filteredArray || [];
            if (filteredArray.length > 0) {
                item.isChecked = true;
            }
        });



        $scope.loadDayView();
        onclickallDoctor();
    });

    $scope.getUserBranchSlotRestrictionForCalender1 = function (DoctorID, date, info, infodeatils) {
        var SelectedDoctorId = parseInt(DoctorID);
        var DoctorObj = $filter("filter")($scope.Calendardoctorlist1, function (item, index) { return item.DoctorID === SelectedDoctorId; }, true) || [];

        var SelectedUserBranchId = null;
        if (DoctorObj.length > 0) {
            SelectedUserBranchId = parseInt(DoctorObj[0].UserBranchId);
        }

        var GivenDate = moment(date).format('YYYY-MM-DD');

        var appointmentDate = GivenDate;
        var params = {
            "DoctorId": SelectedDoctorId,
            "UserBranchId": SelectedUserBranchId,
            "Date": appointmentDate
        }
        eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccesscalender, OnGetErrorcalender);
        function OnGetSuccesscalender(response) {
            console.log(JSON.stringify(response));
            if (response.status === 'Success') {
                //angular.forEach(response.NormalSlots, function (item) {
                //    item.StartTime = item.StartTime.substring(0, 5);
                //});
                //angular.forEach(response.TeleSlots, function (item) {
                //    item.StartTime = item.StartTime.substring(0, 5);
                //});
                // reStructureDoctorSelectedSlotsForCalender1(response, date);
                $scope.RestrictDoctorMaxSlots(response, info, infodeatils);
            } else {
                alertify.error(response.Message);
            }

        }
        function OnGetErrorcalender(error) {
        }
    };

    $scope.RestrictDoctorMaxSlots = function (resp, info, infodeatils) {
        if (resp.IsLeave) {
            // alertify.error("Doctor is on Leave.Please choose another doctor");
            //var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'> Doctor is on leave, Do You Wish to Continue?</h4>", function () {
            //    $scope.ChangeAppointmentDoctor(info, infodeatils);
            //}, function () {
            //    info.revert();
            //});
            alertify.error("Doctor is on leave, Please choose another day/doctor");
            info.revert();
            return false;
        }

        var overaalCount = 0;

        if (resp.UserScheduleSlots.length > 0) {
            console.log(resp);
            resp.UserScheduleSlots[0].MaximumOverAllSlots = resp.UserScheduleSlots[0].MaximumOverAllSlots || 0;
            if (resp.UserScheduleSlots[0].MaximumOverAllSlots > 0) {
                if (resp.UserScheduleSlots[0].MaximumOverAllSlots <= resp.DoctorAppointmentCount) {
                    overaalCount++;
                }
            }

        }

        if (overaalCount > 0) {

            var obj = {
                "info": info,
                "infodeatils": infodeatils
            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/ConfirmationPopupMaxSlots.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "md",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, mainObject) {
                    let pageName = $location.url();
                    $scope.MaxSlotObj = {
                        "Remarks": "",
                        "status": ""
                    };

                    $scope.continuemaxslotbookappointment = function () {
                        if (pageName == '/op') {
                            if (!$scope.UserAccessRights.AllAccessRights.OPUnblockSlotAccess) {
                                alertify.error("You dont have access,please contact your manager");
                                return false;
                            }
                        }

                        if (pageName == '/crm') {
                            if (!$scope.UserAccessRights.AllAccessRights.CRMUnblockSlotAccess) {
                                alertify.error("You dont have access,please contact your manager");
                                return false;
                            }
                        }
                        if ($scope.MaxSlotObj.Remarks === "") {
                            alertify.error("Please Enter Remarks");
                            return false;
                        }

                        $scope.MaxSlotObj.status = "Yes";

                        $uibModalInstance.close($scope.MaxSlotObj);
                    };

                    $scope.cancelmaxslotBookAppointment = function () {
                        $scope.MaxSlotObj.status = "No";
                        $uibModalInstance.close($scope.MaxSlotObj);
                    }




                }
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);

                if (resp.status === "Yes") {


                    $scope.ChangeAppointmentDoctor(info, infodeatils, resp.Remarks);
                } else {
                    info.revert();
                }
            }, function (cancel) {
            });

        } else {

            $scope.IsMaxSlotsRestriction = false;
            //if (resp.UserConsultationNew.length > 0) {

            //    var apptTypeId = parseInt(infodeatils.AppointmentDetails.AppointmentTypeId);
            //    resp.UserConsultationNew[0].NewAppointmentMaxSlots = resp.UserConsultationNew[0].NewAppointmentMaxSlots || 0;
            //    resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots = resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots || 0;
            //    resp.UserConsultationNew[0].OTAppointmentMaxSlots = resp.UserConsultationNew[0].OTAppointmentMaxSlots || 0;
            //    if (apptTypeId == 1) {
            //        if (resp.UserConsultationNew[0].NewAppointmentMaxSlots != 0) {
            //            if (resp.DoctorNewAppointmentCount > resp.UserConsultationNew[0].NewAppointmentMaxSlots || resp.DoctorNewAppointmentCount == resp.UserConsultationNew[0].NewAppointmentMaxSlots) {
            //                $scope.IsMaxSlotsRestriction = true;
            //            }
            //        }
            //    } else if (apptTypeId == 2 || apptTypeId == 3) {
            //        if (resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots != 0) {
            //            if (resp.DoctorFollowUpAppointmentCount > resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots) {
            //                $scope.IsMaxSlotsRestriction = true;
            //            }
            //        }
            //    } else if (apptTypeId == 4) {
            //        if (resp.UserConsultationNew[0].OTAppointmentMaxSlots != 0) {
            //            if (resp.DoctorAscAppointmentCount > resp.UserConsultationNew[0].OTAppointmentMaxSlots || resp.DoctorAscAppointmentCount == resp.UserConsultationNew[0].OTAppointmentMaxSlots) {
            //                $scope.IsMaxSlotsRestriction = true;
            //            }
            //        }
            //    }

            //}

            var startTime = $filter("date")(new Date(info.event.start), "HH:mm");
            var start1 = startTime.replaceAll(":", "");
            var filteredDOcObj = resourceRowsFor(info.event._def.resourceIds[0]);
            var OverAllStartTime1 = filteredDOcObj[0].businessHours.startTime.replaceAll(":", "");
            var OverAllEndTime1 = filteredDOcObj[0].businessHours.endTime.replaceAll(":", "");


            if (resp.UserScheduleSlots[0].SlotsList.length > 0) {

                if (resp.UserScheduleSlots[0].IsAdvancedSchedule) {
                    // number of appointments for this slot
                    let apptsCounter = 0;
                    let filteredEventsArr = $filter('filter')($scope.eventsList1, { "DoctorID": resDoctorId(info.event._def.resourceIds[0]) }, true);
                    angular.forEach(filteredEventsArr, function (item) {
                        if (!item.IsBreakEvent) {
                            let st = item.AppointmentDetails.startTime.split(":");
                            st = st[0] + ":" + st[1];
                            if (st === startTime) {
                                apptsCounter++;
                            }
                        }
                    });

                    var maxapptcounter = 0;
                    var visitrsncounter = 0;
                    angular.forEach(resp.UserScheduleSlots[0].SlotsList, function (item) {
                        if (startTime == item.StartTime) {
                            if (item.MaxNumberOfSlots == apptsCounter || apptsCounter > item.MaxNumberOfSlots) {
                                maxapptcounter++;
                            }
                            let tempArray = $filter('filter')(item.VisitReasons, { "ReasonId": info.event.extendedProps.AppointmentDetails.VisitTypeId }, true);
                            if (tempArray.length > 0) {
                                visitrsncounter = 1;
                            } else {
                                visitrsncounter = 2;
                            }
                        }
                    });
                } else {
                    // number of appointments for this slot
                    let apptsCounter = 0;
                    let filteredEventsArr = $filter('filter')($scope.eventsList1, { "DoctorID": resDoctorId(info.event._def.resourceIds[0]) }, true);
                    angular.forEach(filteredEventsArr, function (item) {
                        if (!item.IsBreakEvent) {
                            let st = item.AppointmentDetails.startTime.split(":");
                            st = st[0] + ":" + st[1];
                            if (st === startTime) {
                                apptsCounter++;
                            }
                        }
                    });

                    var maxapptcounter = 0;
                    var visitrsncounter = 0;
                    angular.forEach(resp.UserScheduleSlots[0].SlotsList, function (item) {
                        let s1 = item.StartTime.replaceAll(":", "");
                        let e1 = item.EndTime.replaceAll(":", "");
                        if (start1 >= s1 && start1 < e1) {
                            if (item.MaxNumberOfSlots == apptsCounter || apptsCounter > item.MaxNumberOfSlots) {
                                maxapptcounter++;
                            }
                            let tempArray = $filter('filter')(item.VisitReasons, { "VisitTypeId": info.event.extendedProps.AppointmentDetails.AppointmentTypeId }, true);
                            if (tempArray.length > 0) {
                                visitrsncounter = 1;
                            } else {
                                visitrsncounter = 2;
                            }
                        }
                    });
                }
            }

            if (maxapptcounter > 0) {

                $scope.mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/uibpopups/ConfirmationPopupMaxSlots.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "keyboard": false,
                    "size": "md",
                    "resolve": {
                        "type": function () { return 1; }
                    },
                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, type) {
                        let pageName = $location.url();
                        $scope.type = type;
                        $scope.MaxSlotObj = {
                            "Remarks": "",
                            "status": ""
                        };

                        $scope.continuemaxslotbookappointment = function () {
                            if (pageName == '/op') {
                                if (!$scope.UserAccessRights.AllAccessRights.OPUnblockSlotAccess) {
                                    alertify.error("You dont have access,please contact your manager");
                                    return false;
                                }
                            }

                            if (pageName == '/crm') {
                                if (!$scope.UserAccessRights.AllAccessRights.CRMUnblockSlotAccess) {
                                    alertify.error("You dont have access,please contact your manager");
                                    return false;
                                }
                            }
                            if ($scope.MaxSlotObj.Remarks === "") {
                                alertify.error("Please Enter Remarks");
                                return false;
                            }

                            $scope.MaxSlotObj.status = "Yes";
                            $uibModalInstance.close($scope.MaxSlotObj);
                        };

                        $scope.cancelmaxslotBookAppointment = function () {
                            $scope.MaxSlotObj.status = "No";
                            $uibModalInstance.close($scope.MaxSlotObj);
                        }
                    }
                });
                $scope.mInstanceAdd.result.then(function (resp) {

                    if (resp.status === "Yes") {
                        $scope.ChangeAppointmentDoctor(info, infodeatils);
                    } else {
                        info.revert();
                    }
                }, function (cancel) {
                });

                return;
            }
            if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1)) && visitrsncounter == 2) {
                $scope.mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/uibpopups/ConfirmationPopupMaxSlots.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "keyboard": false,
                    "size": "md",
                    "resolve": {
                        "type": function () { return 2; }
                    },
                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, type) {
                        let pageName = $location.url();
                        $scope.type = type;
                        $scope.MaxSlotObj = {
                            "Remarks": "",
                            "status": ""
                        };

                        $scope.continuemaxslotbookappointment = function () {
                            if (pageName == '/op') {
                                if (!$scope.UserAccessRights.AllAccessRights.OPUnblockSlotAccess) {
                                    alertify.error("You dont have access,please contact your manager");
                                    return false;
                                }
                            }

                            if (pageName == '/crm') {
                                if (!$scope.UserAccessRights.AllAccessRights.CRMUnblockSlotAccess) {
                                    alertify.error("You dont have access,please contact your manager");
                                    return false;
                                }
                            }
                            if ($scope.MaxSlotObj.Remarks === "") {
                                alertify.error("Please Enter Remarks");
                                return false;
                            }

                            $scope.MaxSlotObj.status = "Yes";
                            $uibModalInstance.close($scope.MaxSlotObj);
                        };

                        $scope.cancelmaxslotBookAppointment = function () {
                            $scope.MaxSlotObj.status = "No";
                            $uibModalInstance.close($scope.MaxSlotObj);
                        }
                    }
                });
                $scope.mInstanceAdd.result.then(function (resp) {

                    if (resp.status === "Yes") {
                        //$scope.ChangeAppointmentDoctor(event, resp.Remarks);
                        $scope.ChangeAppointmentDoctor(info, infodeatils, resp.Remarks);
                    } else {
                        info.revert();
                    }
                }, function (cancel) {
                });
                return;
            }


            if ($scope.IsMaxSlotsRestriction == true) {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'> Slots Exceeded for The Doctor, Do You Wish to Continue? </h4>", function () {
                    $scope.ChangeAppointmentDoctor(info, infodeatils);
                }, function () {
                    info.revert();
                });
            }
            else {

                var startTime = $filter("date")(new Date(info.event.start), "HH:mm");
                var start1 = startTime.replaceAll(":", "");
                var filteredDOcObj = resourceRowsFor(info.event._def.resourceIds[0]);
                var OverAllStartTime1 = filteredDOcObj[0].businessHours.startTime.replaceAll(":", "");
                var OverAllEndTime1 = filteredDOcObj[0].businessHours.endTime.replaceAll(":", "");

                if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {
                    $scope.ChangeAppointmentDoctor(info, infodeatils);
                } else {
                    if (filteredDOcObj[0].SlotStartTime == "00:00" && filteredDOcObj[0].SlotEndTime == "00:00") {
                        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'> Slots Exhausted, Do You Wish to Continue? </h4>", function () {
                            $scope.ChangeAppointmentDoctor(info, infodeatils);
                        }, function () {
                            info.revert();
                        });
                    }
                    else if (filteredDOcObj[0].SlotStartTime != "00:00" && filteredDOcObj[0].SlotEndTime != "00:00") {
                        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'> You Have Selected Non-business Hours, Do You Wish to Continue?</h4>", function () {
                            $scope.ChangeAppointmentDoctor(info, infodeatils);
                        }, function () {
                            info.revert();
                        });
                    }
                    else {
                        info.revert();
                    }
                }


            }
        }


    }

    function reStructureDoctorSelectedSlotsForCalender1(resp, date) {
        if (resp.IsLeave) {
            alertify.error("Doctor is on Leave.Please choose another doctor");
            return true;
        }

        $scope.timeslots = [];
        var GivenDate = resp.Date;
        var CurrentDate = new Date();
        GivenDate = parseCalenderDate(GivenDate);
        $scope.iscurrentDate = false;
        if (GivenDate > CurrentDate) {
            $scope.iscurrentDate = false;
        } else {
            $scope.iscurrentDate = true;
        }
        $scope.time = $filter('date')(new Date(), 'HH:mm');

        var VisitTypeId = $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3;
        $scope.RestrictSlotsUserConsultation = [];

        angular.forEach(resp.UserConsultationNew, function (item) {
            /* if (item.VisitType === VisitTypeId) {*/
            var arr = item.SlotStartTime.split(':');
            var shour = $.trim(arr[0]);
            var smin = $.trim(arr[1]);


            var arr2 = item.SlotEndTime.split(':')
            var ehour = $.trim(arr2[0]);
            var emin = $.trim(arr2[1]);
            var startingTime = moment().hours(shour).minutes(smin);
            var endingTime = moment().hours(ehour).minutes(emin);
            var currentStartTime = angular.copy(startingTime);
            var token = 1;
            while (currentStartTime < endingTime) {
                var slotObj = {
                    "StartTime": currentStartTime.format("HH:mm"),
                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                    "TokenNumber": token,
                    "Available": "Y"
                }
                token++;
                $scope.timeslots.push(slotObj);
            }
            if ($scope.iscurrentDate === true) {
                $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
            }

            $scope.RestrictSlotsUserConsultation.push(item);
            /*}*/
        });

        angular.forEach($scope.timeslots, function (item) {
            angular.forEach(resp.NormalSlots, function (item1) {
                if (item.StartTime == item1.StartTime) {
                    item.Available = 'N';
                }
            });
        });

        $scope.setValue = [];
        if ($scope.timeslots.length > 0) {
            angular.forEach($scope.timeslots, function (item1) {
                if (item1.Available === 'Y') {
                    var res = item1.StartTime.split(":");
                    item1.StartTime = res[0] + ":" + res[1];
                    $scope.setValue.push(item1);
                }
            });
            if ($scope.setValue.length > 0) {
            } else {
                alertify.error("Doctor Slot is not available.Please choose another doctor");
                $scope.PopupRestriction = true;
                return true;
            }

            $scope.OverAllStartTime = "";
            $scope.OverAllEndTime = "";

            angular.forEach($scope.RestrictSlotsUserConsultation, function (ritem, index) {
                if (index === 0) {
                    $scope.OverAllStartTime = ritem.StartTime;
                    $scope.OverAllEndTime = ritem.EndTime;
                } else {
                    $scope.OverAllEndTime = ritem.EndTime;
                }
            });
            var start1 = $filter("date")(new Date(date), "HH:mm:ss");
            var startTime = start1.replaceAll(":", "");
            $scope.OverAllStartTime = $scope.OverAllStartTime.replaceAll(":", "");
            $scope.OverAllEndTime = $scope.OverAllEndTime.replaceAll(":", "");

            if ((parseInt($scope.OverAllStartTime) <= parseInt(startTime)) && (parseInt(startTime) < parseInt($scope.OverAllEndTime))) {

            } else {
                // alertify.error("Slots is not available");
                $scope.PopupRestriction = true;
                return true;
            }

        } else {
            alertify.error("Doctor is not available.Please choose another doctor");
            $scope.PopupRestriction = true;
            return true;
        }


    }

    function RefreshTopBarCount() {
        if (doctorinfo.RoleID == 1 || doctorinfo.RoleID == 43) {
            var obj = {
                "selectedDoctor": {
                    "DoctorID": doctorinfo.doctorid
                }
            }
            $rootScope.$broadcast("AppointmentTypefilter", obj);
        } else {
            var obj = {
                "selectedDoctor": {
                    "DoctorID": 0
                }
            }
            $rootScope.$broadcast("AppointmentTypefilter", obj);
        }
    }



    $scope.continuetoBookAppointment = function (obj) {
        var info = obj.infoobj;
        var startTime = $filter("date")(new Date(info.startStr), "HH:mm");
        var endTime = $filter("date")(new Date(info.endStr), "HH:mm");
        console.log(startTime);
        console.log(endTime);
        var Sdate = new Date();
        var Edate = new Date();
        var getDate = moment(info.start).format('DD-MMM-YYYY');
        var startDatetime = moment(info.start).format('DD-MMM-YYYY' + ' ' + obj.StartTime);
        var endDatetime = moment(info.end).format('DD-MMM-YYYY' + ' ' + obj.EndTime);
        var date1 = parseCalenderDate(startDatetime);
        var date2 = parseCalenderDate(endDatetime);
        var Doctor_id = parseInt(obj.DoctorId);


        var OverAllStartTime1 = "";
        var OverAllEndTime1 = "";
        var filteredDOcObj = resourceRowsFor(info.resource);
        var filteredDOcObj = resourceRowsFor(info.resource);
        if (filteredDOcObj.length > 0) {
            if (filteredDOcObj[0].businessHours != undefined) {
                var start1 = startTime.replaceAll(":", "");
                OverAllStartTime1 = filteredDOcObj[0].businessHours.startTime.replaceAll(":", "");
                OverAllEndTime1 = filteredDOcObj[0].businessHours.endTime.replaceAll(":", "");
            }
        }

        angular.forEach($scope.UserAvailableSlots, function (item) {
            if (item.DoctorId == Doctor_id) {
                angular.forEach(item.SlotsList, function (kitem) {
                    let startTime = kitem.StartTime.replace(":", "");
                    let endTime = kitem.EndTime.replace(":", "");
                    let startTime1 = $filter('date')(parseCalenderDate(startDatetime), "HH:mm");
                    let endTime1 = $filter('date')(parseCalenderDate(endDatetime), "HH:mm");
                    startTime1 = startTime1.replace(":", "");
                    endTime1 = endTime1.replace(":", "");
                    //if (startTime1 >= startTime && startTime1 < endTime) {
                    //    $rootScope.appointment_type = kitem.VisitTypeId.toString();
                    //}
                });
            }
        });

        if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {
            function getMinutesBetweenDates(startDate, endDate) {
                var diff = endDate.getTime() - startDate.getTime();
                return (diff / 60000);
            }
            var minutes = getMinutesBetweenDates(date1, date2);
            var obj = {
                'IsComingFrom': 'Doctorcalendar',
                'MinPerCaseval': minutes || (filteredDOcObj[0] && filteredDOcObj[0].MinPerCase),
                'Starttime': startDatetime,
                'Endtime': endDatetime,
                'GetDate': getDate,
                'SlotType': $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3,
                "AppointmentTypeId": $rootScope.appointment_type,
                'OutOfBusinessTime': false
            }
            datapersistanceFactory.set("SingleDoctorcalendar", obj);
            var docObject = {
                "DoctorId": resDoctorId(info.resource),
                "StartTime": startTime,
                "EndTime": endTime,
                "BranchId": resBranchId(info.resource) || $scope.HospitalId
            }
            console.log(docObject);
            $scope.PageName = 'book';
            var doctorID = {
                "DoctorID": parseInt(docObject.DoctorId)
            };
            $scope.calenderDate = moment(date).format('DD-MMM-YYYY' + ' ' + startTime);
            $scope.ispatientExistsval = false;
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);

            var clinicAddress = { "ClinicId": $scope.HospitalId };
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            $scope.appDate = "";
            $scope.AppDate = "";
            var date = apptConsultationDate();

            datapersistanceFactory.set('appointmentinfo', "");
            var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
            appointmentInfo.AppointmentStatus = "B";
            appointmentInfo.BillingId = 0;
            appointmentInfo.CaptureBillingFrom = "Appointment";
            eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);
            BookApptPopupOpened()
            // openAppPopup();

        }
    };

    $scope.continuetoBookAppointment1 = function (obj, type) {
        var Opentype = type || 1;
        var info = obj.infoobj;
        var startTime = $filter("date")(new Date(info.startStr), "HH:mm");
        var endTime = $filter("date")(new Date(info.endStr), "HH:mm");
        console.log(startTime);
        console.log(endTime);
        var Sdate = new Date();
        var Edate = new Date();
        var getDate = moment(info.start).format('DD-MMM-YYYY');
        var startDatetime = moment(info.start).format('DD-MMM-YYYY' + ' ' + obj.StartTime);
        var endDatetime = moment(info.end).format('DD-MMM-YYYY' + ' ' + obj.EndTime);
        var date1 = parseCalenderDate(startDatetime);
        var date2 = parseCalenderDate(endDatetime);
        var Doctor_id = parseInt(obj.DoctorId);
        var type = obj.type;


        var OverAllStartTime1 = "";
        var OverAllEndTime1 = "";
        var filteredDOcObj = resourceRowsFor(info.resource);
        var filteredDOcObj = resourceRowsFor(info.resource);
        if (filteredDOcObj.length > 0) {
            if (filteredDOcObj[0].businessHours != undefined) {
                var start1 = startTime.replaceAll(":", "");
                OverAllStartTime1 = filteredDOcObj[0].businessHours.startTime.replaceAll(":", "");
                OverAllEndTime1 = filteredDOcObj[0].businessHours.endTime.replaceAll(":", "");
            }
        }
        $scope.appointment_type = '';
        angular.forEach($scope.UserAvailableSlots, function (item) {
            if (item.DoctorId == Doctor_id) {
                angular.forEach(item.SlotsList, function (kitem) {
                    let startTime = kitem.StartTime.replace(":", "");
                    let endTime = kitem.EndTime.replace(":", "");
                    let startTime1 = $filter('date')(parseCalenderDate(startDatetime), "HH:mm");
                    let endTime1 = $filter('date')(parseCalenderDate(endDatetime), "HH:mm");
                    startTime1 = startTime1.replace(":", "");
                    endTime1 = endTime1.replace(":", "");
                    //if (startTime1 >= startTime && startTime1 < endTime) {
                    //    $scope.appointment_type = kitem.VisitTypeId.toString();
                    //}
                });
            }
        });

        if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {
            function getMinutesBetweenDates(startDate, endDate) {
                var diff = endDate.getTime() - startDate.getTime();
                return (diff / 60000);
            }
            var minutes = getMinutesBetweenDates(date1, date2);
            var obj = {
                'IsComingFrom': 'Doctorcalendar',
                'MinPerCaseval': minutes || (filteredDOcObj[0] && filteredDOcObj[0].MinPerCase),
                'Starttime': startDatetime,
                'Endtime': endDatetime,
                'GetDate': getDate,
                'SlotType': $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3,
                "AppointmentTypeId": $scope.appointment_type,
                'OutOfBusinessTime': false
            }
            datapersistanceFactory.set("SingleDoctorcalendar", obj);
            var docObject = {
                "DoctorId": resDoctorId(info.resource),
                "StartTime": startTime,
                "EndTime": endTime,
                "BranchId": resBranchId(info.resource) || $scope.HospitalId
            }
            console.log(docObject);
            $scope.PageName = 'book';
            var doctorID = {
                "DoctorID": parseInt(docObject.DoctorId)
            };

            var date = apptConsultationDate();
            $scope.calenderDate = moment(date).format('DD-MMM-YYYY' + ' ' + startTime);
            $scope.ispatientExistsval = false;
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);

            var clinicAddress = { "ClinicId": $scope.HospitalId };
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            $scope.appDate = "";
            $scope.AppDate = "";


            datapersistanceFactory.set('appointmentinfo', "");
            var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
            appointmentInfo.AppointmentStatus = "B";
            appointmentInfo.BillingId = 0;
            appointmentInfo.CaptureBillingFrom = "Appointment";
            eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);
            var Obj = {
                "PageName": "book",
                "AppDate": "",
                "ispatientExistsval": $scope.ispatientExistsval || false,
                "calenderDate": $scope.calenderDate,
                "AppointmentId": null,
                "PatientId": null,
                'IsComingFrom': '',
                "type": $scope.CurrentUrl || ""
            };
            datapersistanceFactory.set('AppointmentDetailsCache', Obj);

            if (Opentype == 2) {
                BookApptPopupOpenedv2();
            } else {
                BookApptPopupOpened();
            }
        }
    };

    $scope.bookAppointmentForSelectedSlots = function (obj, type) {
        console.log(obj);

        // $scope.continuetoBookAppointment(obj);
        $scope.continuetoBookAppointment1(obj, type);
    };

    $scope.$on('allCalendarBookAppointment', function (evt, data, type) {
        console.log(data);
        $scope.bookAppointmentForSelectedSlots(data, type);
    });

    $scope.$on('allCalendarBlockAppointmentSlot', function (evt, data) {
        console.log(data);
        $scope.blocktheSelectedSlots(data);
    });

    $scope.clearSelectedSlots = function () {

        $scope.calobj.IsShow = false;
        $scope.calobj.StartTime = "";
        $scope.calobj.EndTime = "";
        $scope.calobj.NewStartTime = "";
        $scope.calobj.NewEndTime = "";
        $scope.calobj.DoctorId = "";
        $scope.calobj.DoctorName = "";
        $scope.calobj.infoobj = "";
        $scope.calobj.date = "";
        $scope.calobj.HospitalId = "";
        $scope.calobj.IsMultiSlotSelection = false;
    };



    //$scope.continuetoBreakFromCalendarConfirm = function (obj) {
    //    var info = obj.infoobj;
    //    var startTime = $filter("date")(new Date(info.startStr), "HH:mm");
    //    var endTime = $filter("date")(new Date(info.endStr), "HH:mm");
    //    console.log(startTime);
    //    console.log(endTime);
    //    var Sdate = new Date();
    //    var Edate = new Date();
    //    var getDate = moment(info.start).format('DD-MMM-YYYY');
    //    var startDatetime = moment(info.start).format('DD-MMM-YYYY' + ' ' + obj.StartTime);
    //    var endDatetime = moment(info.end).format('DD-MMM-YYYY' + ' ' + obj.EndTime);
    //    var date1 = parseCalenderDate(startDatetime);
    //    var date2 = parseCalenderDate(endDatetime);


    //    let arr = info.resource.extendedProps.SlotStartTime.split(':');
    //    let shour = $.trim(arr[0]);
    //    let smin = $.trim(arr[1]);

    //    let arr2 = info.resource.extendedProps.SlotEndTime.split(':');
    //    let ehour = $.trim(arr2[0]);
    //    let emin = $.trim(arr2[1]);
    //    let startingTime = moment().hours(shour).minutes(smin);
    //    let endingTime = moment().hours(ehour).minutes(emin);
    //    let currentStartTime = angular.copy(startingTime);
    //    $scope.TempTimeslots = [];
    //    while (currentStartTime < endingTime) {

    //        let slotObj = {
    //            "StartTime": currentStartTime.format("HH:mm"),
    //            "EndTime": currentStartTime.add(info.resource.extendedProps.MinPerCase, "minute").format("HH:mm"),
    //        }
    //        slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
    //        slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

    //        $scope.TempTimeslots.push(slotObj);
    //    }


    //    let st = $filter('date')(parseCalenderDate(startDatetime), "HH:mm");
    //    st = st.replace(":", "");
    //    let et = $filter('date')(parseCalenderDate(endDatetime), "HH:mm");
    //    et = et.replace(":", "");
    //    let tempArray2 = $scope.TempTimeslots.filter((x) => st <= x.seqStartTime && (et >= x.seqEndTime && et > x.seqStartTime));
    //    if (tempArray2.length > 0) {
    //        console.log("example", tempArray2);
    //        var breakstarttime = tempArray2[0].StartTime;
    //        var breakendtime = tempArray2[tempArray2.length - 1].EndTime;
    //    }

    //    let tempArray = $scope.UserAvailableSlots.filter((x) => x.DoctorId == resDoctorId(info.resource));
    //    if (tempArray.length > 0) {
    //        $scope.UserScheduleId = tempArray[0].UserScheduleId;
    //        $scope.UserScheduleDetailId = tempArray[0].UserScheduleDetailId;
    //    }
    //    let req = {
    //        "UserId": $scope.UserId,
    //        "DoctorId": resDoctorId(info.resource),
    //        "BranchId": $scope.HospitalId,
    //        "UserScheduleId": $scope.UserScheduleId,
    //        "UserScheduleDetailId": $scope.UserScheduleDetailId,
    //        "UserScheduleOnlineBreakDetailId": 0,
    //        //"StartTime": $filter('date')(parseCalenderDate(startDatetime), "HH:mm"),
    //        //"EndTime": $filter('date')(parseCalenderDate(endDatetime), "HH:mm"),
    //        "StartTime": breakstarttime,
    //        "EndTime": breakendtime,
    //        "Date": $filter('date')(parseCalenderDate(startDatetime), "yyyy-MM-dd"),
    //        "DeleteInd": "N"
    //    };

    //    eHnoteMainAppointmentService.AddUpdateDoctorBreakSlot(req).then(function (resp) {
    //        if (resp.data.Status === "Success") {
    //            $scope.filterSelectedDoctorsonCalendar();
    //            $scope.clearSelectedSlots();

    //        }
    //    }, function (err) {
    //        console.log(err);
    //    });

    //};

    $scope.blocktheSelectedSlots = function (obj) {
        $scope.IsForAddingBreakSlot = true;
        $scope.SelectedReasonforBlockSlot = "";
        $scope.Remarks = "";

        let stArray = obj.StartTime.split(":");
        let stTime = stArray[0] + stArray[1];
        stTime = parseInt(stTime);

        let etArray = obj.EndTime.split(":");
        let etTime = etArray[0] + etArray[1];
        etTime = parseInt(etTime);

        $scope.eventsList1 = $scope.eventsList1 || [];
        let breakCounter = 0;
        angular.forEach($scope.eventsList1, function (item) {
            if ((item.title === "Break" || item.title === "Blocked") && obj.DoctorId == item.resourceId) {
                let stTime1 = $filter('date')(new Date(item.start), "HH:mm");
                let stArray1 = stTime1.split(":");
                stTime1 = stArray1.join("");
                stTime1 = parseInt(stTime1);

                let etTime1 = $filter('date')(new Date(item.end), "HH:mm");
                let etArray1 = etTime1.split(":");
                etTime1 = etArray1.join("");
                etTime1 = parseInt(etTime1);

                if (stTime <= stTime1 && etTime > etTime1) {
                    breakCounter++;
                }

                if (stTime < stTime1 && etTime >= etTime1) {
                    breakCounter++;
                }

                if (stTime == stTime1 && etTime == etTime1) {
                    breakCounter++;
                }
            } else if (item.title !== "Break" && item.title !== "Blocked" && obj.DoctorId == item.resourceId) {
                let stArray1 = item.AppointmentDetails.startTime.split(":");
                if (stArray1.length > 2) {
                    stArray1 = stArray1.slice(0, 2);
                }
                let stTime1 = stArray1.join("");
                stTime1 = parseInt(stTime1);

                let etArray1 = item.AppointmentDetails.endTime.split(":");
                if (etArray1.length > 2) {
                    etArray1 = etArray1.slice(0, 2);
                }
                let etTime1 = etArray1.join("");
                etTime1 = parseInt(etTime1);

                if (stTime <= stTime1 && etTime > etTime1) {
                    breakCounter++;
                }

                if (stTime < stTime1 && etTime >= etTime1) {
                    breakCounter++;
                }

                if (stTime < stTime1 && etTime < etTime1 && etTime > stTime1) {
                    breakCounter++;
                }

                if (stTime == stTime1 && etTime == etTime1) {
                    breakCounter++;
                }
            }
        });

        if (breakCounter > 0) {
            alertify.error("Slot already occupied!");
            return;
        }

        let RemarksBoxInstance = $uibModal.open({
            "templateUrl": "BreakSlotsRemarksPopUp.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "md",
            "controller": function ($scope, $uibModal, $uibModalInstance, obj) {
                $scope.closePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.continuetoBreakFromCalendarConfirm = function (info) {

                    //var calenderDate = info.date.format('DD-MMM-YYYY') + ' ' + info.StartTime;
                    //var calenderDate1 = info.date.format('DD-MMM-YYYY') + ' ' + info.EndTime;


                    let avgConsultationTime = info.infoobj.resource.extendedProps.MinPerCase;
                    let tempArray = $scope.UserAvailableSlots.filter((x) => x.DoctorId == parseInt(info.DoctorId));
                    if (tempArray.length > 0) {
                        tempArray[0].AverageConsultationTime = tempArray[0].AverageConsultationTime || "";
                        if (tempArray[0].AverageConsultationTime != "") {
                            avgConsultationTime = parseInt(tempArray[0].AverageConsultationTime);
                        }
                        $scope.UserScheduleId = tempArray[0].UserScheduleId;
                        $scope.UserScheduleDetailId = tempArray[0].UserScheduleDetailId;
                    }

                    var calenderDate = $filter('date')(info.date, "yyyy-MM-dd") + ' ' + info.StartTime;
                    var calenderDate1 = $filter('date')(info.date, "yyyy-MM-dd") + ' ' + info.EndTime;

                    // timebased on avg consultation time
                    let arr = info.infoobj.resource.extendedProps.SlotStartTime.split(':');
                    let shour = $.trim(arr[0]);
                    let smin = $.trim(arr[1]);

                    let arr2 = info.infoobj.resource.extendedProps.SlotEndTime.split(':');
                    let ehour = $.trim(arr2[0]);
                    let emin = $.trim(arr2[1]);
                    let startingTime = moment().hours(shour).minutes(smin);
                    let endingTime = moment().hours(ehour).minutes(emin);
                    let currentStartTime = angular.copy(startingTime);
                    $scope.TempTimeslots = [];
                    while (currentStartTime < endingTime) {

                        let slotObj = {
                            "StartTime": currentStartTime.format("HH:mm"),
                            "EndTime": currentStartTime.add(avgConsultationTime, "minute").format("HH:mm"),
                        }
                        slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                        slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                        $scope.TempTimeslots.push(slotObj);
                    }


                    let st = $filter('date')(parseCalenderDate(calenderDate), "HH:mm");
                    st = st.replace(":", "");
                    let et = $filter('date')(parseCalenderDate(calenderDate1), "HH:mm");
                    et = et.replace(":", "");
                    st = parseInt(st);
                    et = parseInt(et);
                    let tempArray2 = $scope.TempTimeslots.filter((x) => st <= x.seqStartTime && (et >= x.seqEndTime && et > x.seqStartTime));

                    if (tempArray2.length === 0) {
                        tempArray2 = $scope.TempTimeslots.filter((x) => st <= x.seqStartTime && (et <= x.seqEndTime && et > x.seqStartTime));
                    }
                    if (tempArray2.length === 0) {
                        tempArray2 = $scope.TempTimeslots.filter((x) => st >= x.seqStartTime && (et <= x.seqEndTime && et > x.seqStartTime));
                    }
                    if (tempArray2.length === 0) {
                        tempArray2 = $scope.TempTimeslots.filter((x) => st >= x.seqStartTime && (et >= x.seqEndTime && et > x.seqStartTime));
                    }
                    //var tempArray2 = $filter("filter")($scope.TempTimeslots, function (item) {
                    //    return st <= parseInt(item.seqStartTime) && et >= parseInt(item.seqEndTime);
                    //}) || [];
                    //let temporaryArray = [];
                    //angular.forEach($scope.TempTimeslots, function (item) {
                    //    if (st >= parseInt(item.seqStartTime)) {
                    //        if (et >= parseInt(item.seqEndTime)) {
                    //            console.log(temporaryArray);
                    //        }
                    //    }
                    //});
                    //return;


                    if (tempArray2.length > 0) {
                        console.log("example", tempArray2);
                        var breakstarttime = tempArray2[0].StartTime;
                        var breakendtime = tempArray2[tempArray2.length - 1].EndTime;
                    }


                    let d = parseCalenderDate(calenderDate);
                    let weekArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    let DayId = d.getDay();
                    let Day = weekArray[DayId];
                    let req = {
                        "UserId": $scope.UserId,
                        "DoctorId": parseInt(info.DoctorId),
                        "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID,
                        "UserScheduleId": $scope.UserScheduleId,
                        "UserScheduleDetailId": $scope.UserScheduleDetailId,
                        "UserDayBreakSlotId": 0,
                        //"StartTime": $filter('date')(parseCalenderDate(calenderDate), "HH:mm"),
                        //"EndTime": $filter('date')(parseCalenderDate(calenderDate1), "HH:mm"),
                        "StartTime": breakstarttime,
                        "EndTime": breakendtime,
                        "Date": $filter('date')(parseCalenderDate(calenderDate), "yyyy-MM-dd"),
                        "DayId": DayId,
                        "Day": Day,
                        "Remarks": $scope.Remarks || "",
                        "IsAddBreakSlot": true,
                        "Status": "Blocked",
                        "ReasonforBlockSlot": $scope.SelectedReasonforBlockSlot,
                        "DeleteInd": "N"
                    };
                    //console.log(req);
                    //return;
                    eHnoteMainAppointmentService.AddUpdateDoctorBreakSlot(req).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $scope.filterSelectedDoctorsonCalendar();
                            $scope.clearSelectedSlots();
                            $uibModalInstance.dismiss();
                        }
                        if (resp.data.Status === "Failure") {
                            alertify.error(resp.data.Message);
                        }
                    }, function (err) {
                        console.log(err);
                    });

                };
                $scope.SaveRemarksAndBlockSlot = function () {
                    if ($scope.SelectedReasonforBlockSlot === "") {
                        alertify.error("Please select the reason!");
                        return false;
                    }
                    $scope.continuetoBreakFromCalendarConfirm(obj);
                };
            },
            "resolve": {
                "obj": function () {
                    return obj;
                }
            }
        });

    };



    $scope.CelanderProfileSampleClick = function (item) {
        item.PatientDetails = angular.copy(item.patientInfo);
        item.AppointmentID = angular.copy(item.appointmentID);
        item.PatientID = angular.copy(item.PatientDetails.patientID);
        item.MasterPatientId = angular.copy(item.PatientDetails.MasterPatientId);
        $scope.ClickPatientProfile(item);
    };

    $scope.ClickPatientProfile = function (item) {
        eHnoteMasterDataService.addPatientDetailsforBarcode(item);
        eHnoteMasterDataService.addpatientData(item.PatientDetails);
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        item.AppointmentId = item.AppointmentID || 0;
        eHnoteMasterDataService.addAppointmentInfo(item);
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;

        var consultdate = $filter("date")(apptConsultationDate(), "yyyy-MM-dd");
        var hospitalID = 0;

        if ($scope.AppListselectedclinic.ClinicId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
            hospitalID = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
        } else {
            hospitalID = $scope.AppListselectedclinic.ClinicId;
        }


        $scope.cacheStorageItem.patientid = item.PatientID;
        item.PatientID = item.PatientID;
        item.MasterPatientId = item.MasterPatientId;
        $scope.cacheStorageItem.PatientID = item.PatientID;
        item.Gender = item.PatientDetails.Gender || "";
        item.PatientGSTNO = item.PatientDetails.PatientGSTNO || "";
        if (item.BranchDetails != undefined) {
            item.BranchArea = item.BranchDetails.Area || "";
        } else {
            item.BranchArea = "";
        }
        $scope.cacheStorageItem.PatientName = item.PatientDetails.FullName;
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;
        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.SelectedAppointmentId = item.AppointmentID;
        $scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;
        $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        $scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;
        if ($scope.AllDoctorList != undefined) {
            $scope.cacheStorageItem.AllDoctorsList = $scope.AllDoctorList || [];
        }

        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        var obj = {
            "FromDate": $scope.SearchObj.ConsultationDt,
            "ToDate": $scope.SearchObj.ConsultationDt,
            "AppointmentDate": $scope.SearchObj.ConsultationDt,
            "Screen": $scope.SearchObj.Screen,
            "BacktoProfile": $scope.mainAppointmentView.isCalendarorList || ""
        };
        eHnoteMasterDataService.addSelectedCrmApptDates(obj);

        $location.url("/profile");

    };


    $scope.openAppointmentForSelectedSlots1 = function (info) {


        console.log(info.infoobj);
        $scope.event = {
            "AppointmentDetails": info.infoobj.AppointmentDetails,
            "DoctorID": info.infoobj.DoctorID,
            "ETime": info.infoobj.ETime,
            "STime": info.infoobj.STime,
            "startDate": info.infoobj.AppointmentDetails.startDate,
            "endDate": info.infoobj.AppointmentDetails.endDate,
            "eventDesc": info.infoobj.eventDesc,
            "eventInfo": info.infoobj.eventInfo,
            "eventTitle": info.infoobj.eventTitle,
            "eventVenue": info.infoobj.eventVenue,
            "patientID": info.infoobj.patientID,
            "patientendTime": info.infoobj.patientendTime,
            "patientstartTime": info.infoobj.patientstartTime,
            "rowData": info.infoobj.rowData,
            "doctorName": info.infoobj.AppointmentDetails.doctorInfo.doctorName,
            "EmailId": info.infoobj.AppointmentDetails.doctorInfo.EmailId,
            "doctorSpecialities": getDoctorSpecialities('calendar'),
            "doctorImage": "",
            "clinicDoctorList": $scope.clinicDoctorList,
            "source": {
                "action": "reschedule"
            }
        }


        //if ($scope.event.allDay && $scope.event.startDate !== $scope.event.endDate && $scope.event.end !== null) {
        //    $scope.event.endDate = moment($scope.event.endDate).subtract(1, 'days');
        //    $scope.event.end = moment($scope.event.end).subtract(1, 'days');
        //}
        eHnoteMasterDataService.addcalenderInfo($scope.event);

        var appoint_info = angular.copy(info.infoobj.AppointmentDetails);
        appoint_info.PatientID = appoint_info.patientInfo.patientID;
        appoint_info.PatientDetails = angular.copy(appoint_info.patientInfo);
        eHnoteMasterDataService.addAppointmentInfo(appoint_info);

        var getDate = moment(event.patientstartTime).format('DD-MMM-YYYY');
        var startDatetime = moment(info.infoobj.patientstartTime).format('DD-MMM-YYYY' + ' ' + info.infoobj.AppointmentDetails.startTime);
        var endDatetime = moment(info.infoobj.patientstartTime).format('DD-MMM-YYYY' + ' ' + info.infoobj.AppointmentDetails.endTime);
        var obj = {
            'IsComingFrom': 'Doctorcalendar',
            'MinPerCaseval': 0,
            'Starttime': startDatetime,
            'Endtime': endDatetime,
            'GetDate': getDate
        }
        datapersistanceFactory.set("SingleDoctorcalendar", obj);


        $scope.OpAccess.bookAppointmentAccessFromAppList = true;
        if ($scope.OpAccess.bookAppointmentAccessFromAppList) {
            $scope.mInstanceEdit = $uibModal.open({
                templateUrl: 'modalEdit.html',
                controller: function ($scope, $uibModal) {
                    $scope.ok = function () {
                        $scope.mInstanceEdit.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $scope.mInstanceEdit.dismiss('cancel');
                    };
                }
            });
            $scope.mInstanceEdit.result.then(function (selectedItem) {
            }, function () {
                if ($scope.calendarView === 'day') {
                    $scope.loadDayView($scope.viewDate, $scope.selectedDoctor);
                } else if ($scope.calendarView === 'week') {
                    loadWeekView();
                } else if ($scope.calendarView === 'month') {
                    // loadMonthView();
                    $scope.loadDayView();
                }
            });
        }

        var PHospitID = null;
        var patientId = "";
        patientId = appoint_info.patientInfo.patientID;
        PHospitID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        eHnoteUserAppointmentDataService.GetPatientUpcomingAppointments(patientId, PHospitID).then(function (response) {
            console.log(response);
            if (response.data.Status == "Success") {
                if (response.data.rows.length > 0) {
                    angular.forEach(response.data.rows, function (item, index) {
                        if (index == 0 || index == 1) {
                            $scope.cacheStorageItem.VisitRemarks = item.VisitRemarks;
                            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        }
                    });
                }
                else if (response.data.rows.length == 0) {
                    $scope.cacheStorageItem.VisitRemarks = "";
                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                }
            }
        });
    };

    $scope.openAppointmentForSelectedSlots = function (info) {

        $scope.event = {
            "AppointmentDetails": info.infoobj.AppointmentDetails,
            "DoctorID": info.infoobj.DoctorID,
            "ETime": info.infoobj.ETime,
            "STime": info.infoobj.STime,
            "startDate": info.infoobj.AppointmentDetails.startDate,
            "endDate": info.infoobj.AppointmentDetails.endDate,
            "eventDesc": info.infoobj.eventDesc,
            "eventInfo": info.infoobj.eventInfo,
            "eventTitle": info.infoobj.eventTitle,
            "eventVenue": info.infoobj.eventVenue,
            "patientID": info.infoobj.patientID,
            "patientendTime": info.infoobj.patientendTime,
            "patientstartTime": info.infoobj.patientstartTime,
            "rowData": info.infoobj.rowData,
            "doctorName": info.infoobj.AppointmentDetails.doctorInfo.doctorName,
            "EmailId": info.infoobj.AppointmentDetails.doctorInfo.EmailId,
            "doctorSpecialities": getDoctorSpecialities('calendar'),
            "doctorImage": "",
            "clinicDoctorList": $scope.clinicDoctorList,
            "source": {
                "action": "reschedule"
            }
        }
        $scope.AppDate = [];

        var Obj = {
            "PageName": "reschedule",
            "AppDate": $scope.AppDate,
            "ispatientExistsval": true,
            "calenderDate": info.date,
            "AppointmentId": info.infoobj.AppointmentDetails.appointmentID || null,
            "PatientId": info.infoobj.patientID || null,
            'IsComingFrom': '',
            "type": $scope.CurrentUrl || ""
        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);
        BookApptPopupOpened();



    };

    $scope.opentheProfileSlots = function (info) {
        $scope.CelanderProfileSampleClick(info.infoobj.AppointmentDetails);
    };

    $scope.CancelnewCalenderViewAllDoctortab = function (item) {
        $scope.CancelAppointmentobj.Ispopup = false;
        $scope.cancelAppPopup = false;
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        item.start = item.AppointmentDetails.startTime;
        item.end = item.AppointmentDetails.endTime;

        $scope.Patientname = item.rowData.PatientInfo.fullName;
        $scope.EmailId = item.rowData.PatientInfo.EmailId;
        $scope.DoctorFullName = item.rowData.doctorName;
        $scope.DoctorEmail = item.rowData.doctorEmail;
        $scope.DocCommunicationPhnumber = item.AppointmentDetails.doctorInfo.CommunicationMobileNo;

        $scope.appDate = $filter('date')(item.rowData.consultationDate, "yyyy-MM-dd");

        var DateTime = $scope.appDate + "T" + $scope.TIME;
        $scope.AppointmentDate_Time = DateTime;

        if (item.start) {
            $scope.TIME = item.start;
            $scope.CancelStTime = item.start;
        }
        if (item.end) {
            $scope.CancelEdTime = item.end;
        }
        $scope.TokenNumber = item.token;
        if (item.rowData.PatientInfo.MobileNo === undefined) {
            $scope.MobileNumber = "";
        } else {
            $scope.MobileNumber = item.rowData.PatientInfo.MobileNo;
        }
        $scope.DocPHnumber = item.rowData.docCountrycode + "" + item.rowData.docMobile;
        $scope.HospitalId = item.rowData.hospitalId;
        $window.scrollTo(0, angular.element(document.getElementById('cancelAppModal1')).offsetTop);
        $scope.Cancelappointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.Cancelappointmentinfo.AppointmentID = item.rowData.PatientInfo.appointmentID;
        $scope.Cancelappointmentinfo.PatientID = item.rowData.PatientInfo.patientID;
        $scope.Canceldoctorid = item.rowData.doctorId;
        $scope.CanceltmpConsultationDt = $filter('date')(new Date(item.rowData.consultationDate), "yyyy-MM-dd");
        $scope.currentshowloading = true;

        $scope.CancelAppointmentobj.sendDocSms = false;
        $scope.CancelAppointmentobj.sendPatientSms = false;
        $scope.CancelAppointmentobj.sendDocEmail = false;
        $scope.CancelAppointmentobj.sendPatientEmail = false;
        $scope.CancelAppointmentobj.sendPatientSms = item.rowData.PatientInfo.IsPatientSmsInd || false;
        $scope.CancelAppointmentobj.sendPatientEmail = item.rowData.PatientInfo.IsPatientEmailInd || false;
        $scope.Cancelappointmentinfo.CheckinStatusId = item.AppointmentDetails.CheckinStatusId || 1;
        $scope.Cancelappointmentinfo.VisitTypeId = item.AppointmentDetails.VisitTypeId || null;
        $scope.Cancelappointmentinfo.BranchSubSpecializationId = item.AppointmentDetails.BranchSubSpecializationId;
        $scope.Cancelappointmentinfo.SubSpecializationId = item.AppointmentDetails.SubSpecializationId;
        $scope.Cancelappointmentinfo.AppointmentPatientTypeId = item.AppointmentDetails.AppointmentPatientTypeId;
        $scope.Cancelappointmentinfo.AppointmentStatusId = item.AppointmentDetails.AppointmentStatusId;
        $scope.CancelAppointmentobj.AppointmentStatusId = item.AppointmentDetails.AppointmentStatusId;
        $scope.Cancelappointmentinfo.BookingStatusId = item.AppointmentDetails.BookingStatusId;
        $scope.CancelAppointmentobj.BookingStatusId = item.AppointmentDetails.BookingStatusId;
        $scope.OtherCancelReason = "";

        $scope.CancelVisitRsnType = item.rowData.doctorVisitRsnId;
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var getParams = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PageSize": 100,
            "PageNumber": 1
        };
        $scope.CancelAppointmentobj.CancelAppReason = [];
        return eHnotePatientVisitReasonServices.getOrganizationCancelVisitReasons(getParams).then(function (resp) {
            if (resp.data !== undefined) {
                //$scope.CancelAppointmentobj.CancelAppReason = resp.data.rows || [];
                $scope.CancelAppointmentobj.CancelAppReason = $filter("filter")(resp.data.rows, { "ActiveInd": "Y" }, true);
                //var obj = {
                //    "ReasonId": 1,
                //    "CancelReason": "Others"
                //};
                //$scope.CancelAppointmentobj.CancelAppReason.push(obj);
                $scope.mInstanceEdit = $uibModal.open({
                    "templateUrl": "templates/uibpopups/cancelAppModal.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "keyboard": false,
                    "size": "md"
                });
            }
        });
    };
    $scope.canceltheSelectedSlots = function (info) {
        console.log(info.infoobj);
        $scope.event = {
            "AppointmentDetails": info.infoobj.AppointmentDetails,
            "DoctorID": info.infoobj.DoctorID,
            "ETime": info.infoobj.ETime,
            "STime": info.infoobj.STime,
            "startDate": info.infoobj.AppointmentDetails.startDate,
            "endDate": info.infoobj.AppointmentDetails.endDate,
            "eventDesc": info.infoobj.eventDesc || "",
            "eventInfo": info.infoobj.eventInfo || "",
            "eventTitle": info.infoobj.eventTitle || "",
            "eventVenue": info.infoobj.eventVenue || "",
            "patientID": info.infoobj.patientID,
            "patientendTime": info.infoobj.patientendTime,
            "patientstartTime": info.infoobj.patientstartTime,
            "rowData": info.infoobj.rowData,
            "doctorName": info.infoobj.AppointmentDetails.doctorInfo.doctorName,
            "EmailId": info.infoobj.AppointmentDetails.doctorInfo.EmailId,
            "doctorSpecialities": getDoctorSpecialities('calendar'),
            "doctorImage": "",
            "clinicDoctorList": $scope.clinicDoctorList,
            "source": {
                "action": "cancel"
            }
        }

        $scope.CancelnewCalenderViewAllDoctortab($scope.event);
    };
    $scope.clearEventSelectedSlots = function () {

        $scope.evencalobj.IsShow = false;
        $scope.evencalobj.StartTime = "";
        $scope.evencalobj.EndTime = "";
        $scope.evencalobj.DoctorId = "";
        $scope.evencalobj.DoctorName = "";
        $scope.evencalobj.infoobj = "";
        $scope.evencalobj.date = "";
        $scope.evencalobj.PatientName = "";
        $scope.evencalobj.HospitalId = "";
    };
    $scope.clearBreakDetails = function () {
        $scope.BreakEventObj.IsShow = false;
        $scope.BreakEventObj.StartTime = "";
        $scope.BreakEventObj.EndTime = "";
        $scope.BreakEventObj.DoctorId = "";
        $scope.BreakEventObj.DoctorName = "";
        $scope.BreakEventObj.infoobj = "";
        $scope.BreakEventObj.date = "";
        $scope.BreakEventObj.HospitalId = "";
        $scope.BreakEventObj.BreakReason = "";
        $scope.BreakEventObj.BreakRemarks = "";
    }

    $scope.$on('AllDocsCalendarFilter', function (evt, obj) {
        $scope.filteredEventsList = [];
        if (obj.type == 1) {
            if (obj.text === "" || obj.text === undefined) {
                $scope.filteredEventsList = angular.copy($scope.eventsList1);
            } else {
                $scope.filteredEventsList = $filter("filter")($scope.eventsList1, { "PatientName": obj.text }) || [];
            }
        }
        if (obj.type == 2) {
            if (obj.text === "" || obj.text === undefined) {
                $scope.filteredEventsList = angular.copy($scope.eventsList1);
            } else {
                $scope.filteredEventsList = $filter("filter")($scope.eventsList1, { "PatientMrNo": obj.text }) || [];
            }
        }
        if (obj.type == 3) {
            if (obj.text === "" || obj.text === undefined) {
                $scope.filteredEventsList = angular.copy($scope.eventsList1);
            } else {
                $scope.filteredEventsList = $filter("filter")($scope.eventsList1, { "PatientOldMrNo": obj.text }) || [];
            }
        }
        if (obj.type == 4) {
            //text = text + " 00:00:00";
            ////text = $filter('date')(new Date(text), "yyyy-MM-dd");
            //var parsedDate = new Date(text);
            //if (!isNaN(parsedDate.getTime())) {
            //    text = $filter('date')(parsedDate, "yyyy-MM-dd");
            //} else {
            //    // Log an error or handle the invalid date case
            //    alertify.error("Invalid date format:", text);
            //    // Return false or handle the error in another way
            //    text = "";
            //    return false;
            //}
            if (obj.text === "" || obj.text === undefined) {
                $scope.filteredEventsList = angular.copy($scope.eventsList1);
            } else {
                $scope.filteredEventsList = $filter("filter")($scope.eventsList1, function (event) {
                    // Check if the DOB in the patientInfo section matches the provided DOB
                    if (event.AppointmentDetails && event.AppointmentDetails.patientInfo) {
                        return event.AppointmentDetails.patientInfo.DOB === obj.text;
                    }
                }) || [];
            }
        }


        var calendarEl = document.getElementById('calendarFull');

        calendar = new FullCalendar.Calendar(calendarEl, buildCalendarOptions({
            events: $scope.filteredEventsList || []
        }));

        calendar.render();

    });

    $scope.$on('AllDocsCalendarFilterClear', function (evt, obj) {
        $scope.filteredEventsList = [];

        if (obj.text === "" || obj.text === undefined) {
            $scope.filteredEventsList = angular.copy($scope.eventsList1);
            var calendarEl = document.getElementById('calendarFull');

            calendar = new FullCalendar.Calendar(calendarEl, buildCalendarOptions({
                timeZone: 'UTC',
                events: $scope.filteredEventsList || []
            }));

            calendar.render();
        }



    });

    // Fills a rebuilt column with the schedule fields the day-view load sets on it. A column that
    // was already on the grid keeps its values (including the appointment counts); a newly shown
    // one is resolved from the loaded schedule rows the same way the day-view load does.
    function restoreResourceSchedule(citem, previousResources, userAvailableSlots) {
        var previous = _.find(previousResources, function (r) { return String(r.id) === String(citem.id); });
        if (previous) {
            angular.forEach(['SlotStartTime', 'SlotEndTime', 'MinPerCase', 'businessHours', 'IsLeave', 'ApptsCount', 'VisitCountsArray'], function (key) {
                if (previous[key] !== undefined) { citem[key] = angular.copy(previous[key]); }
            });
            if (citem.SlotStartTime !== undefined && citem.SlotEndTime !== undefined) { return; }
        }

        citem.ApptsCount = citem.ApptsCount || 0;
        citem.VisitCountsArray = citem.VisitCountsArray || [];
        citem.IsLeave = false;
        var filteredDOcObj = $filter("filter")(userAvailableSlots || [], function (iterator) {
            return parseInt(iterator.DoctorId, 10) === parseInt(citem.DoctorID, 10)
                && (!citem.BranchId
                    || parseInt(iterator.OrganizationId, 10) === parseInt(citem.BranchId, 10));
        });
        if (filteredDOcObj.length > 0) {
            citem.SlotStartTime = filteredDOcObj[0].StartTime || "00:00";
            citem.SlotEndTime = filteredDOcObj[0].EndTime || "00:00";
            citem.MinPerCase = parseInt(filteredDOcObj[0].MinPerCase || filteredDOcObj[0].AverageConsultationTime || citem.MinPerCase || 15);
        } else {
            citem.SlotStartTime = "00:00";
            citem.SlotEndTime = "00:00";
        }

        if (citem.SlotStartTime === "00:00") {
            citem.businessHours = { "startTime": "23:59", "endTime": "24:00" };
        } else if (filteredDOcObj[0].IsLeave) {
            citem.IsLeave = true;
            citem.businessHours = { "startTime": "00:00", "endTime": "00:00" };
        } else {
            citem.businessHours = { "startTime": citem.SlotStartTime, "endTime": citem.SlotEndTime };
        }
    }

    // Locations Apply: rebuild columns for the ticked branches from the schedule rows already loaded
    $scope.$on("CalendarBranchFilterChange", function () {
        var calendarEl = document.getElementById('calendarFull');
        if (!calendarEl || !$scope.UserAvailableSlots) { return; }
        if (currentCalendarView() === 'month') {
            calendarDayDataStale = true;
            $scope.$broadcast('CalendarMonthViewChange', 'month');
            return;
        }

        var loadedBranchIds = _.map($scope.UserAvailableSlots, function (s) { return parseInt(s.OrganizationId, 10); });
        var needsReload = calendarDayDataStale || selectedBranchIds().some(function (id) { return loadedBranchIds.indexOf(id) === -1; });
        if (needsReload) {
            calendarDayDataStale = false;
            if (calendar) { calendar.destroy(); }
            onclickPageLoad();
            return;
        }

        var previousResources = $scope.CalendarResources || [];
        $scope.CalendarResources = buildBranchResources(
            calendarDoctorList(), $scope.UserAvailableSlots, $scope.HospitalId, selectedBranchIds());
        // buildBranchResources only builds the columns; restore each column's schedule fields
        // (the slot click reads SlotStartTime / SlotEndTime / MinPerCase) 
        angular.forEach($scope.CalendarResources, function (citem) {
            restoreResourceSchedule(citem, previousResources, $scope.UserAvailableSlots);
        });

        if (applySelectedCalendarView()) { return; }
        calendar = new FullCalendar.Calendar(calendarEl, buildCalendarOptions({ events: $scope.eventsList1 || [] }));
        calendar.render();
    });

    // for all doctors calendar view change // new enhancement
    $scope.$on("CalendarViewChange", function (evt, data) {
        if (calendarDayDataStale && (data == "day" || data == "week")) {
            calendarDayDataStale = false;
            onclickPageLoad();
            return;
        }
        var calendarEl = document.getElementById('calendarFull');

        $scope.filteredEventsList = angular.copy($scope.eventsList1);

        let calView;

        if (data == "month") {
            calView = "dayGridMonth";

        }
        if (data == "day") {
            calView = "resourceTimeGridDay";
        }
        if (data == "week") {
            calView = "timeGridWeek";
        }

        var viewEventsList = $scope.eventsList1 || [];
        if (parseInt(($scope.mainCalendarView || {}).MainTab, 10) === 1) {
            var columnIds = _.map($scope.CalendarResources || [], function (r) { return String(r.id); });
            viewEventsList = _.filter(viewEventsList, function (e) { return !e.resourceId || columnIds.indexOf(String(e.resourceId)) > -1; });
        }

        calendar = new FullCalendar.Calendar(calendarEl, buildCalendarOptions({
            initialView: calView,
            events: viewEventsList,
            eventTextColor: "black",
            dayMaxEventRows: 4
        }));

        calendar.render();

    });

    // for all doctors calendar month view change
    function LoadCalenderMonthView(evt, data) {
        var calendarEl = document.getElementById('calendarFull');


        let calView;
        if (data == "month") {
            calView = "dayGridMonth";
        }

        calendar = new FullCalendar.Calendar(calendarEl, buildCalendarOptions({
            initialView: calView,
            events: $scope.eventsMonthList || [],
            eventTextColor: "black",
            eventOrderStrict: true,
            eventOrder: "id",
            dayMaxEvents: false,
            dayMaxEventRows: 4,
            // month grid has no time slots or resource lanes, so the day-grid handlers are off
            dateClick: undefined,
            select: undefined,
            eventClick: undefined,
            eventDrop: undefined,
            eventContent: undefined,
            resourceLabelDidMount: undefined,
            eventDidMount: function (info) {
                console.log("bg applying 1");
                if (info.event.extendedProps.background) {
                    info.el.style.background = info.event.extendedProps.background;
                }
            }
        }));

        calendar.render();
    }
    var loadMonthEvents = function (booked, data, evt, loaddata) {
        $scope.eventsMonthList = [];

        for (var j = 0; j < booked.calendarList.length; j++) {
            if (booked.calendarList[j].slotList !== undefined) {
                var end = $filter("date")(new Date(booked.calendarList[j].consultationDt), "yyyy-MM-dd");
                var start = $filter("date")(new Date(booked.calendarList[j].consultationDt), "yyyy-MM-dd");
                var t = $filter("date")(new Date(), "HH:mm");
                //start = start + 'T' + '00:00';
                //end = end + 'T' + '00:00';

                booked.calendarList[j].TotalAppointentCount = booked.calendarList[j].TotalAppointentCount || 0;
                if (booked.calendarList[j].TotalAppointentCount == 0) {
                    continue;
                }
                var appBgColor1 = "";
                var appFontColor1 = "#FFF";
                var val = j;
                if (booked.calendarList[j].TotalAppointentCount > 0) {
                    var newtitle = "Total Appoinmtnet : " + booked.calendarList[j].TotalAppointentCount;
                    appBgColor1 = '#ed9c28';   //#FFFF8A';

                }
                var obj1 = {
                    "id": j + "_000",
                    "title": newtitle,
                    "end": end,
                    "start": start,
                    "color": appBgColor1,
                    "background": 'linear-gradient(to bottom right, white, ' + appBgColor1 + ')',
                    "borderLeft": '5px solid ' + appBgColor1 + ''
                }
                $scope.eventsMonthList.push(obj1);

                booked.calendarList[j].slotList.sort(function (a, b) {
                    return (b.TotalAppointments || 0) - (a.TotalAppointments || 0);
                });

                for (var k = 0; k < booked.calendarList[j].slotList.length; k++) {
                    var sTime = booked.calendarList[j].slotList[k];
                    var t = $filter("date")(new Date(), "HH:mm");
                    var end = $filter("date")(new Date(booked.calendarList[j].consultationDt), "yyyy-MM-dd");
                    var start = $filter("date")(new Date(booked.calendarList[j].consultationDt), "yyyy-MM-dd");
                    //start = start + 'T' + t;
                    //end = end + 'T' + t;

                    var appBgColor = "",
                        appFontColor = "#FFF";
                    sTime.VisitReasonColorCode = sTime.VisitReasonColorCode || "";
                    if (sTime.VisitReasonColorCode != '') {
                        if (sTime.VisitReasonColorCode == '#310c0c') {
                            appBgColor = '#757ef8';

                        } else {
                            appBgColor = sTime.VisitReasonColorCode;
                        }

                        /*  appBgColor = 'linear-gradient(to bottom right, white, ' + sTime.VisitReasonColorCode + ')'*/

                    } else {
                        appBgColor = "#757ef8";
                    }
                    var title = null, eventInfo = null;

                    if (sTime.TotalAppointments > 0) {
                        var newtitleVisitReason = sTime.VisitReasonName + " " + ':' + sTime.TotalAppointments;
                    }
                    else {
                        var newtitleVisitReason = '';
                    }

                    //if (sTime.appointmentStatus == "C") {
                    //    newtitle = '<img src="img/appt-list/xmark-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + patientMobile + '-' + '(' + sTime.VisitReason + ')'
                    //}
                    //else if (sTime.appointmentStatus == "R") {
                    //    newtitle = '<img src="img/appt-list/rescheduleIcon.jpg" width="12" style="margin-right:5px;"/>' + title + '-' + patientMobile + '-' + '(' + sTime.VisitReason + ')'
                    //}
                    //else {
                    //    var isconfirmedappt = sTime.IsConfirmedAppointment || false;
                    //    if (isconfirmedappt) {
                    //        newtitle = '<img src="img/appt-list/check-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + patientMobile + '-' + '(' + sTime.VisitReason + ')';
                    //    }
                    //}
                    console.log(sTime.VisitReasonColorCode + "durga_c5");
                    var val = k + 1;
                    var obj1 = {
                        "id": j + "_" + (k + 1).toString().padStart(3, '0'),
                        "title": newtitleVisitReason,
                        "end": end,
                        "start": start,
                        "color": appBgColor,
                        "background": 'linear-gradient(to bottom right, white, ' + sTime.VisitReasonColorCode + ')',
                        "borderLeftColor": '5px solid ' + appBgColor1 + ''
                    }
                    $scope.eventsMonthList.push(obj1);
                }
            }
        }
        console.log($scope.eventsMonthList);
        LoadCalenderMonthView(evt, loaddata);
    };
    $scope.$on("CalendarMonthViewChange", function (evt, data) {
        var formatteddateValue = apptConsultationDate();
        var monthBeginDate = moment(formatteddateValue).startOf('month').format('YYYY-MM-DD');
        var monthEndDate = moment(formatteddateValue).endOf('month').format('YYYY-MM-DD');
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "usrType": "DOCTOR",
            "StartDate": monthBeginDate,
            "EndDate": monthEndDate,
            "HospitalID": $scope.HospitalId,
            "GetAllIndicator": 0,
            "AppointmentTypeStatusIDList": "",
            "VisitReasonIdList": "",
            "DoctorIds": "",
            "VisitStatusIDLst": "",
            "PatientTagListIds": "",
        };

        //if ($scope.AppoinmentBookingTypeobj1.AppoinmentBookingTypeID == 1) {
        //    params.VisitStatusIDLst = "1";
        //} else {
        //    params.VisitStatusIDLst = "1,2,3";
        //}

        params.VisitStatusIDLst = "1,2,3";

        //if ($scope.AppoinmentBookingTypeobj1.AppoinmentBookingTypeID == 2) {
        //    $scope.ApptFilterObj.IsNoShowAppointment1 = true;
        //} else {
        //    $scope.ApptFilterObj.IsNoShowAppointment1 = false;
        //}

        var newlist10 = "";
        for (var i in $scope.BookedstatusFilterList1) {
            if ($scope.BookedstatusFilterList1[i].IsChecked) {
                newlist10 += "," + $scope.BookedstatusFilterList1[i].Id;
            }
        }
        if (newlist10.charAt(0) === ",") {
            newlist10 = newlist10.slice(1);
        }

        if ($scope.appointmentTypes != undefined) {
            var listApptTypeArray = $filter("filter")($scope.appointmentTypes, function (iterator, ind) { return iterator.isChecked === true; });
            var apptList = _.pluck(listApptTypeArray, "Id").join(",");
            params.AppointmentTypeStatusIDList = apptList || "";
        }

        if ($scope.Visitreasons != undefined) {
            var listVisitRsnArray = $filter("filter")($scope.Visitreasons, function (iterator, ind) { return iterator.isChecked === true; });
            var visitRsnList = _.pluck(listVisitRsnArray, "ReasonId").join(",");
            params.VisitReasonIdList = visitRsnList || "";
        }

        if (parseInt(($scope.mainCalendarView || {}).MainTab, 10) === 1) {
            params.DoctorIds = _.pluck(calendarDoctorList(), "DoctorID").join(",");
        } else if ($scope.Calendardoctorlist1 != undefined && $scope.Calendardoctorlist1.length > 0) {
            var listDoctorArray = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.isChecked === true; });
            var visitDocList = _.pluck(listDoctorArray, "DoctorID").join(",");
            params.DoctorIds = visitDocList || "";
        }

        let statuslist = "";
        for (let i in $scope.confirmationStatusArray1) {
            if ($scope.confirmationStatusArray1[i].IsChecked) {
                statuslist += "," + $scope.confirmationStatusArray1[i].ConfirmationStatusId;
            }
        }
        if (statuslist.charAt(0) === ",") {
            statuslist = statuslist.slice(1);
        }

        let profilestatuslist = "";
        for (let i in $scope.ProfileStatusList1) {
            if ($scope.ProfileStatusList1[i].IsChecked) {
                profilestatuslist += "," + $scope.ProfileStatusList1[i].Id;
            }
        }
        if (profilestatuslist.charAt(0) === ",") {
            profilestatuslist = profilestatuslist.slice(1);
        }
        var PatientTags = "";
        for (var i in $scope.PatientTagList1) {
            if ($scope.PatientTagList1[i].IsChecked) {
                PatientTags += "," + $scope.PatientTagList1[i].HospitalEquipmentId;
            }
        }
        if (PatientTags.charAt(0) === ",") {
            PatientTags = PatientTags.slice(1);
        }

        var newlist7 = "";
        for (var i in $scope.BookingTypesArray1) {
            if ($scope.BookingTypesArray1[i].IsChecked) {
                newlist7 += "," + $scope.BookingTypesArray1[i].BookingTypeId;
            }
        }
        if (newlist7.charAt(0) === ",") {
            newlist7 = newlist7.slice(1);
        }
        var newlist11 = "";
        for (var i in $scope.BookedstatusFilterList1) {
            if ($scope.BookedstatusFilterList1[i].IsChecked) {
                newlist11 += "," + $scope.BookedstatusFilterList1[i].Id;
            }
        }
        if (newlist11.charAt(0) === ",") {
            newlist11 = newlist11.slice(1);

        }

        var newlist10 = "";
        for (var i in $scope.AppointmentStatusArray1) {
            if ($scope.AppointmentStatusArray1[i].IsChecked) {
                newlist10 += "," + $scope.AppointmentStatusArray1[i].AppointmentStatusId;
            }
        }
        if (newlist10.charAt(0) === ",") {
            newlist10 = newlist10.slice(1);
        }

        params.StatusIds = angular.copy(statuslist);
        params.BookingTypeIds = angular.copy(newlist7);
        params.ProfileStatusIds = angular.copy(profilestatuslist);
        params.AppointmentStatusIds = angular.copy(newlist10);
        params.BookingStatusIds = angular.copy(newlist11);

        params.IsNoShowAppointment = $scope.ApptFilterObj.IsNoShowAppointment1 || false;
        params.PatientTagListIds = PatientTags;

        if ($location.url() == '/op' || $location.url() == '/crm') {
            var monthLocationIds = selectedBranchIds();
            if (!monthLocationIds.length && $scope.AppListselectedclinic && parseInt($scope.AppListselectedclinic.ClinicId, 10)) {
                monthLocationIds = [parseInt($scope.AppListselectedclinic.ClinicId, 10)];
            }
            params.startDate = monthBeginDate;
            params.endDate = monthEndDate;
            params.Locationids = monthLocationIds.join(",");
            params.FacilityListIds = "";
            eHnoteUserAppointmentDataService.getWeekwiseMonthwiseAppointments(params, onLocationMonthSuccess, onweekError);
            return;
        }

        eHnoteUserAppointmentDataService.GetVisitReasonAvailableAppointments(params, onweekSuccess, onweekError);
        function onweekSuccess(data1) {
            $scope.eventsMonthList = [];
            var booked = data1;

            loadMonthEvents(booked, data1, evt, data);
        }
        function onLocationMonthSuccess(data1) {
            $scope.eventsMonthList = [];
            var booked = buildLocationMonthSummary(data1, params.DoctorIds, monthLocationIds);

            loadMonthEvents(booked, data1, evt, data);
        }
        function onweekError(data) {

        }

    });

    function buildLocationMonthSummary(data, doctorIds, locationIds) {
        var allowedDoctorIds = _.map(_.filter(String(doctorIds || "").split(","), function (d) { return d !== ""; }), function (d) { return parseInt(d, 10); });
        var allowedLocationIds = locationIds || [];
        var calendarList = [];
        angular.forEach((data && data.calendarList) || [], function (day) {
            var reasonList = [];
            var reasonByName = {};
            var dayTotal = 0;
            angular.forEach(day.slotList || [], function (row) {
                if (row.patientInfo === undefined || row.appointmentStatus === "EVENT" || row.appointmentStatus === "IMPEVENT") { return; }
                if (allowedDoctorIds.length && allowedDoctorIds.indexOf(parseInt(row.doctorID, 10)) === -1) { return; }
                if (allowedLocationIds.length && allowedLocationIds.indexOf(parseInt(row.hospitalID, 10)) === -1) { return; }
                var reasonName = row.VisitReason || "";
                if (!reasonByName[reasonName]) {
                    reasonByName[reasonName] = { "VisitReasonName": reasonName, "VisitReasonColorCode": row.VisitReasonColorCode || "", "TotalAppointments": 0 };
                    reasonList.push(reasonByName[reasonName]);
                }
                reasonByName[reasonName].TotalAppointments++;
                dayTotal++;
            });
            calendarList.push({ "consultationDt": day.consultationDt, "TotalAppointentCount": dayTotal, "slotList": reasonList });
        });
        return { "calendarList": calendarList };
    }

    $scope.NoShowAppointmentList = function (item) {
        var obj = {
            "PatientName": item.PatientName,
            "AppointmentDate": item.date,
            "AppointmentStartTime": item.StartTime,
            "DoctorName": item.DoctorName,
            "IsPatientEmailInd": false,
            "IsPatientSmsInd": false,
            "AppointmentId": item.infoobj.AppointmentDetails.appointmentID,
            "AppointmentDetails": item.infoobj.AppointmentDetails,

        }
        $scope.modalnoshowappt = $uibModal.open({
            "templateUrl": "templates/uibpopups/NoShowAppointmentPopup.html",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "ApptObject": function () { return obj; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, ApptObject, eHnoteMasterDataService, eHnotePatientVisitReasonServices) {

                $scope.UserId = eHnoteMasterDataService.getLoginId();

                var doctorInfo = eHnoteMasterDataService.getUserInfo();

                if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
                    && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {

                    $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    $scope.ParentHospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

                }

                $scope.CloseNoshowapptpopup = function () {
                    $uibModalInstance.dismiss("close");
                }
                $scope.NoShowAppointmentobj = {
                    "Ispopup": false,
                    "CancelAppReason": [],
                    "sendDocSms": false,
                    "sendPatientSms": false,
                    "sendDocEmail": false,
                    "sendPatientEmail": false,
                    "CancelReason": "",
                    "NoShowReasonRemarks": "",
                    "OtherCancelReason": "",
                    "PatientFullName": "",
                    "AppointmentDate": "",
                    "AppointmentStartTime": "",
                    "Doctor_Name": "",
                    "UserId": null,
                    "AppointmentId": null,
                    "HospitalID": null,
                    "IsNoShowAppointment": false,
                    "NoShowReasonRemarks": "",
                    "NoShowReasonId": null,
                    "NoShowReasonName": "",
                };

                var getParams = {
                    //  "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "OrganizationId": $scope.HospitalId,
                    "PageSize": 100,
                    "PageNumber": 1
                    //"ReasonTypeId": 2
                };
                $scope.NoShowAppointmentobj.CancelAppReason = [];
                eHnotePatientVisitReasonServices.getOrganizationCancelVisitReasons(getParams).then(function (resp) {
                    if (resp.data !== undefined) {
                        if (resp.data.rows.length > 0) {
                            $scope.NoShowAppointmentobj.CancelAppReason = $filter("filter")(resp.data.rows, { "ActiveInd": "Y" }, true);
                        }
                        var obj = {
                            "ReasonId": 1,
                            "CancelReason": "Others"
                        };
                        $scope.NoShowAppointmentobj.CancelAppReason.push(obj);

                    }
                });


                //$scope.NoShowAppointmentobj.sendPatientSms = ApptObject.PatientDetails.IsPatientSmsInd || false;
                //$scope.NoShowAppointmentobj.sendPatientEmail = ApptObject.PatientDetails.IsPatientEmailInd || false;
                //$scope.NoShowAppointmentobj.PatientFullName = ApptObject.PatientDetails.FullName;
                //$scope.NoShowAppointmentobj.AppointmentStartTime = ApptObject.StartTime;
                //$scope.NoShowAppointmentobj.AppointmentDate = ApptObject.ConsultationDt;
                //$scope.NoShowAppointmentobj.Doctor_Name = ApptObject.DoctorFullName;
                //$scope.NoShowAppointmentobj.AppointmentId = ApptObject.AppointmentID;


                $scope.NoShowAppointmentobj.sendPatientSms = false;
                $scope.NoShowAppointmentobj.sendPatientEmail = false;
                $scope.NoShowAppointmentobj.PatientFullName = ApptObject.PatientName;
                $scope.NoShowAppointmentobj.AppointmentStartTime = ApptObject.AppointmentStartTime;
                $scope.NoShowAppointmentobj.AppointmentDate = ApptObject.AppointmentDate;
                $scope.NoShowAppointmentobj.Doctor_Name = ApptObject.DoctorName;
                $scope.NoShowAppointmentobj.AppointmentId = ApptObject.AppointmentID;

                $scope.ChangeReason = function (id) {
                    var ReasonList = $filter("filter")($scope.NoShowAppointmentobj.CancelAppReason, function (iterator) { return iterator.CancelVisitReasonId === id; });
                    if (ReasonList.length > 0) {
                        $scope.NoShowAppointmentobj.NoShowReasonName = ReasonList[0].CancelReason || '';
                    }

                }


                $scope.UpdateNoshowappt = function () {
                    $scope.NoShowAppointmentobj.NoShowReasonId = $scope.NoShowAppointmentobj.NoShowReasonId || null;
                    if ($scope.NoShowAppointmentobj.NoShowReasonId == null) {
                        alertify.error('Please Select Reason for Noshow');
                        return false;
                    }
                    if ($scope.NoShowAppointmentobj.NoShowReasonRemarks == "") {
                        alertify.error('Please Enter The Remarks');
                        return false;
                    }

                    var Description = $scope.NoShowAppointmentobj.NoShowReasonName + '/' + $scope.NoShowAppointmentobj.NoShowReasonRemarks;
                    let params = {
                        "UserId": $scope.UserId,
                        "AppointmentId": $scope.NoShowAppointmentobj.AppointmentId,
                        "HospitalID": $scope.HospitalId,
                        // "IsNoShowAppointment": ApptObject.IsNoShowAppointment,
                        "NoShowReasonRemarks": $scope.NoShowAppointmentobj.NoShowReasonRemarks,
                        "NoShowReasonId": $scope.NoShowAppointmentobj.NoShowReasonId,
                        "StatusDescription": Description
                    }
                    eHnoteUserAppointmentDataService.UpdateAppointmentDetails(params).then(function (resp) {
                        $uibModalInstance.close("close");
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });
                }

            },
        });
        $scope.modalnoshowappt.result.then(function () {
            if ($scope.calendarView === 'day') {
                $scope.loadDayView($scope.viewDate, $scope.selectedDoctor);
            } else if ($scope.calendarView === 'week') {
                loadWeekView();
            } else if ($scope.calendarView === 'month') {
                // loadMonthView();
                $scope.loadDayView();
            }

        }, function (cancel) {

        });
    }

    //Ramya 16/01/2025
    $scope.getUserBranchslotsByDate = function (SelectedDoctorId, type) {
        type = type || '';
        SelectedDoctorId = parseInt(SelectedDoctorId);

        //$scope.selectedAppointmentObject.TimeSlotsStartArray = [];
        //$scope.selectedAppointmentObject.TimeSlotsEndArray = [];
        $scope.selectedAppointmentObject.IsDoctorLeave = false;

        //   var appointmentDate = $filter('date')($scope.selectedAppointmentObject.AppointmentDate, "yyyy-MM-dd");
        var appointmentDate = $filter('date')(new Date($scope.calobj.seletedslotdate), "yyyy-MM-dd");

        var params = {
            "DoctorId": $scope.selectedAppointmentObject.DocObj.DoctorID,
            "UserBranchId": $scope.selectedAppointmentObject.DocObj.UserBranchId,
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
                }

                console.log(response.DoctorAppointmentCount + "__" + overaalCount);
                if (overaalCount > 0) {
                    $scope.IsMaximumAppointmentsPerDay = true;

                    if ($scope.selectedAppointmentObject.AppointmentID === 0) {
                        $scope.isAppValiddities.MaxApptError = true;
                        $scope.isAppValiddities.MaxApptUnblock = false;
                    }
                }
                $scope.AllSlotList = [];
                if (response.UserScheduleSlots.length > 0) {
                    $scope.AllSlotList = response.UserScheduleSlots[0].SlotsList || [];
                }

                // Always resync from the just-fetched schedule — see comment on the same fix in
                // EhnoteNewAppointmentListCtrl.js. StartTime/EndTime/SlotDate must be refreshed here too
                // (not just MinPerCase), otherwise they keep whichever doctor was viewed previously —
                // the gridOrigin/gridEnd working-hours check below then compares the new doctor's click
                // against the OLD doctor's hours and wrongly rejects valid in-hours clicks.
                $scope.allUserAvailabilitySlots = $scope.allUserAvailabilitySlots || {};
                if (response.UserScheduleSlots.length > 0) {
                    if (response.UserScheduleSlots[0].MinPerCase != undefined) {
                        $scope.allUserAvailabilitySlots.MinPerCase = parseInt(response.UserScheduleSlots[0].MinPerCase);
                    }
                    if (response.UserScheduleSlots[0].StartTime != undefined) {
                        $scope.allUserAvailabilitySlots.StartTime = angular.copy(response.UserScheduleSlots[0].StartTime);
                    }
                    if (response.UserScheduleSlots[0].EndTime != undefined) {
                        $scope.allUserAvailabilitySlots.EndTime = angular.copy(response.UserScheduleSlots[0].EndTime);
                    }
                    if (response.UserScheduleSlots[0].SlotDate != undefined) {
                        $scope.allUserAvailabilitySlots.SlotDate = angular.copy(response.UserScheduleSlots[0].SlotDate);
                    }
                }

                if ($scope.AllSlotList.length == 0) {
                    $scope.dateObject = new Date($scope.selectedAppointmentObject.AppointmentDate);
                    var appointmentDate = $filter('date')($scope.dateObject, "yyyy-MM-dd");
                    console.log(appointmentDate);




                    var MinperCase = $scope.selectedAppointmentObject.DocObj.MinPerCase || 15;
                    $scope.allUserAvailabilitySlots = {
                        "SlotDate": appointmentDate,
                        //"StartTime": "06:00",
                        //"EndTime": "19:00",
                        "StartTime": "00:00",
                        "EndTime": "23:59",
                        "MinPerCase": MinperCase
                    };


                    console.log(response.UserScheduleSlots);
                    if (response.UserScheduleSlots.length > 0) {
                        if (response.UserScheduleSlots[0].MinPerCase != undefined) {
                            $scope.allUserAvailabilitySlots.MinPerCase = parseInt(response.UserScheduleSlots[0].MinPerCase);
                            $scope.allUserAvailabilitySlots.StartTime = angular.copy(response.UserScheduleSlots[0].StartTime);
                            $scope.allUserAvailabilitySlots.EndTime = angular.copy(response.UserScheduleSlots[0].EndTime);
                            $scope.allUserAvailabilitySlots.SlotDate = angular.copy(response.UserScheduleSlots[0].SlotDate);
                        }
                    }

                    $scope.timeslots = [];
                    $scope.availableSlots = [];

                    var GivenDate = $scope.allUserAvailabilitySlots.SlotDate;
                    var CurrentDate = $filter('date')(new Date(), 'MM-dd-yyyy');

                    GivenDate = $filter('date')(GivenDate, 'MM-dd-yyyy');
                    $scope.iscurrentDate = false;


                    //if (GivenDate > CurrentDate) {
                    //    $scope.iscurrentDate = false;
                    //} else {
                    //    $scope.iscurrentDate = true;
                    //}

                    let x = parseCalenderDate(GivenDate);
                    let Y = new Date(CurrentDate);

                    if (x > Y) {
                        $scope.iscurrentDate = false;
                    } else {
                        $scope.iscurrentDate = true;
                    }
                    $scope.time = $filter('date')(new Date(), 'HH:mm');

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
                            "OverallCount": response.DoctorAppointmentCount || 0,
                            "MaximumOverAllSlots": (response.UserScheduleSlots.length > 0) ? response.UserScheduleSlots[0].MaximumOverAllSlots : 0,
                            "VisitReasons": []
                        }
                        token++;
                        slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                        slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                        var datetime = $scope.allUserAvailabilitySlots.SlotDate + "T" + slotObj.StartTime;
                        slotObj.NewStartTime = "";
                        slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
                        //console.log(slotObj.NewStartTime + "" + datetime);
                        $scope.timeslots.push(slotObj);
                    }


                    if ($scope.iscurrentDate === true) {
                        $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                    }
                    if (response.UserScheduleSlots.length > 0) {
                        $scope.availableSlots = [];
                        $scope.isAppValiddities.UserScheduleId = response.UserScheduleSlots[0].UserScheduleId;
                        angular.forEach(response.UserScheduleSlots, function (item) {
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
                                    // REVERTED: must stay the day's grid step (item.MinPerCase), not this
                                    // break's own DurationMinutes — see comment on the same revert in
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




                            // disable break slots
                            angular.forEach($scope.timeslots, function (iterator) {
                                angular.forEach($scope.Breaktimeslots, function (iterator1) {
                                    if (iterator.StartTime === iterator1.StartTime) {
                                        iterator.Available = "N";
                                    }
                                });
                            });

                            // end 

                            // else {
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
                                Count = response.DoctorAppointmentCount || 0;
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
                                    "OverallCount": response.DoctorAppointmentCount || 0,
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
                            //  }
                        });
                    }
                    console.log($scope.selectedAppointmentObject.DocObj.RestrictMultipleSlots);

                    //if ($scope.selectedAppointmentObject.DocObj.RestrictMultipleSlots) {
                    //    if (response.NormalSlots.length > 0) {
                    //        var Array = checkSlotsAlreadyBooked($scope.availableSlots, response.NormalSlots);
                    //        $scope.availableSlots = angular.copy(Array);
                    //    }
                    //}
                    //else {
                    //    console.log(response.NormalSlots.length);
                    //    console.log($scope.availableSlots)

                    //    if ($scope.availableSlots.length > 0 && response.NormalSlots.length > 0) {
                    //        var Array = checkSlotsAlreadyBookedWithYellow($scope.availableSlots, resp.NormalSlots);
                    //        $scope.availableSlots = angular.copy(Array);
                    //    }

                    //}
                    if ($scope.timeslots.length > 0) {
                        angular.forEach($scope.timeslots, function (item1) {

                            var filteredArray = $filter('filter')($scope.availableSlots, { "StartTime": item1.StartTime }, true);
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
                                    //if (item1.StartTime === filteredArray[0].StartTime) {
                                    //    if (filteredArray[0].Count > 0) {
                                    //        item1.Available = "Y";
                                    //        item1.IsBooked = true;
                                    //    }
                                    //}
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
                    if ($scope.AllSlotList.length == 0) {
                        $scope.AllSlotList = angular.copy($scope.selectedAppointmentObject.TimeSlotsStartArray);
                    }
                }
                //Single slot selected///
                //if ($scope.AllSlotList.length > 0) {
                //    angular.forEach($scope.AllSlotList, function (item) {
                //        let slotStartTime = new Date(`1970-01-01T${item.StartTime}:00`);
                //        let slotEndTime = new Date(`1970-01-01T${item.EndTime}:00`);
                //        let givenStartTime = new Date(`1970-01-01T${$scope.calobj.StartTime}:00`);

                //             if (givenStartTime >= slotStartTime && givenStartTime < slotEndTime) {
                //                    function GetTime(date) {
                //                        var currentTime = (new Date(date))
                //                        var hours = currentTime.getHours()
                //                        //Note: before converting into 12 hour format
                //                        var suffix = '';
                //                        if (hours > 11) {
                //                            suffix += "PM";
                //                        } else {
                //                            suffix += "AM";
                //                        }
                //                        var minutes = currentTime.getMinutes()
                //                        if (minutes < 10) {
                //                            minutes = "0" + minutes
                //                        }
                //                        if (hours > 12) {
                //                            hours -= 12;
                //                        } else if (hours === 0) {
                //                            hours = 12;
                //                        }
                //                        var time = hours + ":" + minutes + " " + suffix;
                //                        return time;
                //                    }
                //                    var newstartTime = GetTime(slotStartTime);
                //                    var newendTime = GetTime(slotEndTime);

                //                    $scope.calobj.NewStartTime = newstartTime;
                //                    $scope.calobj.NewEndTime = newendTime;
                //                    $scope.calobj.StartTime = item.StartTime;
                //                    $scope.calobj.EndTime = item.EndTime;
                //            }

                //    });
                //}


                /*Drag Slots New  --  20 - 03 - 2025*/

                //if ($scope.AllSlotList.length > 0) {
                //    let finalStartTime = null;
                //    let finalEndTime = null;

                //    let formattedDate = $filter('date')(apptConsultationDate(), 'yyyy-MM-dd');

                //    let givenStartTime = new Date(`${formattedDate}T${$scope.calobj.StartTime}:00`);
                //    let givenEndTime = new Date(`${formattedDate}T${$scope.calobj.EndTime}:00`);

                //    angular.forEach($scope.AllSlotList, function (item) {
                //        if (item.Available === "Y") { // Consider only available slots
                //            let slotStartTime = new Date(`${formattedDate}T${item.StartTime}:00`);
                //            let slotEndTime = new Date(`${formattedDate}T${item.EndTime}:00`);

                //            if (givenStartTime >= slotStartTime && givenStartTime < slotEndTime) { // Starts inside a slot
                //                finalStartTime = slotStartTime;
                //            }
                //            if (givenEndTime > slotStartTime && givenEndTime <= slotEndTime) { // Ends inside a slot
                //                finalEndTime = slotEndTime;
                //            }
                //        }
                //    });

                //    if (finalStartTime && finalEndTime) {
                //        function formatAMPM(date) {
                //            let hours = date.getHours();
                //            let minutes = date.getMinutes();
                //            let ampm = hours >= 12 ? "PM" : "AM";
                //            hours = hours % 12 || 12;
                //            minutes = minutes < 10 ? "0" + minutes : minutes;
                //            return hours + ":" + minutes + " " + ampm;
                //        }

                //        $scope.calobj.NewStartTime = formatAMPM(finalStartTime);
                //        $scope.calobj.NewEndTime = formatAMPM(finalEndTime);

                //        $scope.calobj.StartTime = finalStartTime.toTimeString().substring(0, 5);
                //        $scope.calobj.EndTime = finalEndTime.toTimeString().substring(0, 5);
                //    }
                //}
                if ($scope.AllSlotList.length > 0) {
                    let formattedDate = $filter('date')(apptConsultationDate(), 'yyyy-MM-dd');
                    let givenStartTime = new Date(`${formattedDate}T${$scope.calobj.StartTime}:00`);
                    let givenEndTime = new Date(`${formattedDate}T${$scope.calobj.EndTime}:00`);
       if (response.UserScheduleSlots.length > 0) {
                        if (response.UserScheduleSlots[0].MinPerCase != undefined) {
                            $scope.allUserAvailabilitySlots.MinPerCase = parseInt(response.UserScheduleSlots[0].MinPerCase);
                            $scope.allUserAvailabilitySlots.StartTime = angular.copy(response.UserScheduleSlots[0].StartTime);
                            $scope.allUserAvailabilitySlots.EndTime = angular.copy(response.UserScheduleSlots[0].EndTime);
                            $scope.allUserAvailabilitySlots.SlotDate = angular.copy(response.UserScheduleSlots[0].SlotDate);
                        }
                    }
                    var singleSlotMinutes = parseInt($scope.allUserAvailabilitySlots && $scope.allUserAvailabilitySlots.MinPerCase) ||
                        parseInt($scope.selectedAppointmentObject.DocObj && $scope.selectedAppointmentObject.DocObj.MinPerCase) || 15;

                    let finalStartTime = null;
                    let finalEndTime = null;

                    // Find the real slot that contains the click's start — its OWN StartTime/EndTime span
                    // is the authoritative duration for this click, not the raw click width. The calendar's
                    // click/select grid can be coarser than the doctor's configured per-slot duration, so a
                    // plain single click was landing its raw end inside the NEXT slot and grabbing that
                    // slot's end instead of the clicked slot's own end — turning e.g. a 15-min slot into a
                    // bogus 30-min one.
                    let matchedSlotEndTime = null;
                    angular.forEach($scope.AllSlotList, function (item) {
                        if (item.Available === "Y") { // Consider only available slots
                            let slotStartTime = new Date(`${formattedDate}T${item.StartTime}:00`);
                            let slotEndTime = new Date(`${formattedDate}T${item.EndTime}:00`);

                            if (givenStartTime >= slotStartTime && givenStartTime < slotEndTime) { // Starts inside a slot
                                finalStartTime = slotStartTime;
                                matchedSlotEndTime = slotEndTime;
                            }
                        }
                    });

                    // Decide multi-slot vs single-click by rounding the RAW selection width to the nearest
                    // whole number of the MATCHED slot's own real duration (authoritative, from AllSlotList)
                    // instead of the generic MinPerCase scalar — a grid-mismatch-inflated raw click rounds
                    // down to "1 slot" and stays a single click; only a genuine multi-cell drag rounds up.
                    let ownSlotDuration = (matchedSlotEndTime && finalStartTime) ? Math.round((matchedSlotEndTime - finalStartTime) / 60000) : singleSlotMinutes;
                    let draggedMinutesRaw = Math.round((givenEndTime - givenStartTime) / 60000);
                    let roundedSlotCount = ownSlotDuration > 0 ? Math.round(draggedMinutesRaw / ownSlotDuration) : 1;
                    $scope.calobj.IsMultiSlotSelection = roundedSlotCount > 1;

                    if (!$scope.calobj.IsMultiSlotSelection) {
                        // Plain single click — always use the matched slot's own end, never a separately
                        // matched "end lands in this slot" lookup.
                        finalEndTime = matchedSlotEndTime;
                    } else {
                        angular.forEach($scope.AllSlotList, function (item) {
                            if (item.Available === "Y") {
                                let slotStartTime = new Date(`${formattedDate}T${item.StartTime}:00`);
                                let slotEndTime = new Date(`${formattedDate}T${item.EndTime}:00`);
                                if (givenEndTime > slotStartTime && givenEndTime <= slotEndTime) { // Ends inside a slot
                                    finalEndTime = slotEndTime;
                                }
                            }
                        });
                        if (!finalEndTime) {
                            finalEndTime = matchedSlotEndTime;
                        }
                    }

                    // Fallback: no "Available" entry in AllSlotList contained the click (e.g. the slot
                    // it falls in is booked/blocked, or the schedule has no explicit SlotsList) — snap
                    // mathematically to the MinPerCase grid instead of silently keeping the raw,
                    // unsnapped click time. That fallthrough is what produced "6:15 -> 6:15-6:35"
                    // instead of "6:15 -> 6:00-6:20".
                    if (!finalStartTime || !finalEndTime) {
                        let gridStartParts = (($scope.allUserAvailabilitySlots && $scope.allUserAvailabilitySlots.StartTime) || "00:00").split(':');
                        let gridOrigin = new Date(`${formattedDate}T00:00:00`);
                        gridOrigin.setHours(parseInt(gridStartParts[0], 10) || 0, parseInt(gridStartParts[1], 10) || 0, 0, 0);
                        let gridEndParts = (($scope.allUserAvailabilitySlots && $scope.allUserAvailabilitySlots.EndTime) || "23:59").split(':');
                        let gridEnd = new Date(`${formattedDate}T00:00:00`);
                        gridEnd.setHours(parseInt(gridEndParts[0], 10) || 0, parseInt(gridEndParts[1], 10) || 0, 0, 0);
                        let minutesSinceOrigin = Math.round((givenStartTime - gridOrigin) / 60000);

                        // The click landed outside the doctor's working hours for this day (e.g. before
                        // gridOrigin, so minutesSinceOrigin is negative) — flooring a negative offset to
                        // the slot grid wraps around to a bogus earlier time (e.g. clicking 6:00 AM on a
                        // 7:30 AM shift snapped to 5:50 AM). There is no real slot to snap to, so leave
                        // finalStartTime/finalEndTime unset instead of fabricating one.
                        if (minutesSinceOrigin < 0 || givenStartTime >= gridEnd) {
                            alertify.error("Selected time is outside the doctor's working hours.");
                        } else {
                            let snappedOffset = Math.floor(minutesSinceOrigin / singleSlotMinutes) * singleSlotMinutes;
                            finalStartTime = new Date(gridOrigin.getTime() + snappedOffset * 60000);
                            // Preserve the width of a multi-slot drag instead of always collapsing to one
                            // singleSlotMinutes-wide block — round the dragged span up to the nearest whole
                            // number of slots so e.g. a 60-min drag (10:30-11:30) stays a 60-min selection.
                            let draggedMinutes = Math.round((givenEndTime - givenStartTime) / 60000);
                            let snappedDurationMinutes = Math.max(singleSlotMinutes, Math.round(draggedMinutes / singleSlotMinutes) * singleSlotMinutes);
                            finalEndTime = new Date(finalStartTime.getTime() + snappedDurationMinutes * 60000);
                        }
                    }

                    if (finalStartTime && finalEndTime) {
                        function formatAMPM(date) {
                            let hours = date.getHours();
                            let minutes = date.getMinutes();
                            let ampm = hours >= 12 ? "PM" : "AM";
                            hours = hours % 12 || 12;
                            minutes = minutes < 10 ? "0" + minutes : minutes;
                            return hours + ":" + minutes + " " + ampm;
                        }

                        $scope.calobj.NewStartTime = formatAMPM(finalStartTime);
                        $scope.calobj.NewEndTime = formatAMPM(finalEndTime);

                        $scope.calobj.StartTime = finalStartTime.toTimeString().substring(0, 5);
                        $scope.calobj.EndTime = finalEndTime.toTimeString().substring(0, 5);

                        // IMPORTANT: keep the payload object in sync (see below)
                        $scope.selectedAppointmentObject.StartTime = $scope.calobj.StartTime;
                        $scope.selectedAppointmentObject.EndTime = $scope.calobj.EndTime;
                    }
                }

                if ($scope.calobj && $scope.calobj.StartTime && !$scope.calobj.IsMultiSlotSelection) {
                    $scope.updateEndTimeByVisitReasonDuration();
                }
            }

        }
        function OnGetError(error) {
            console.log(error);
        }
    };

    function timeToMinutes(t) {
        if (!t) return 0;
        var parts = t.split(':');
        return (parseInt(parts[0], 10) * 60) + parseInt(parts[1], 10);
    }
    // Own copy of the parent controller's (EhnoteNewAppointmentListCtrl.js) function of the same name.
    // $scope.updateEndTimeByVisitReasonDuration() is called above (from this controller's own slot-fetch
    // success handler) via plain scope-inherited lookup, which without this own copy resolves to the
    // PARENT's version — and that version's closure captures the PARENT's own $scope, not this one. The
    // parent has its own separate allUserAvailabilitySlots/AllSlotList (populated by its own, independent
    // GetDoctorAvaiableSlotByDate call), so it stays stale relative to whatever this calendar view just
    // fetched for the clicked date — e.g. showing a 15-min duration here after this scope already resolved
    // the correct 20/30-min MinPerCase for that month's schedule. Defining it here makes calls from this
    // controller use this controller's own, freshly-fetched data instead.
    $scope.updateEndTimeByVisitReasonDuration = function () {
        var duration = 0;
        var slotDuration = 0;
        var minPerCase = parseInt($scope.allUserAvailabilitySlots && $scope.allUserAvailabilitySlots.MinPerCase) ||
            parseInt($scope.selectedAppointmentObject.DocObj && $scope.selectedAppointmentObject.DocObj.MinPerCase) || 15;

        // Priority 1: Match visit reason in SlotsList → use that slot's DurationMinutes
        if ($scope.AllSlotList && $scope.AllSlotList.length > 0) {
            var startTime = $scope.calobj.StartTime;
            angular.forEach($scope.AllSlotList, function (slot) {
                // Check if this slot covers the selected start time
                var slotStart = timeToMinutes(slot.StartTime);
                // Prefer the slot's actual StartTime/EndTime span (matches how the caller snapped
                // finalStartTime/finalEndTime above) — DurationMinutes can be a stale/generic value
                // that doesn't match the real gap for schedules with a non-default slot duration
                // (e.g. 45 min), which produced a wrong, too-short EndTime here.
                var slotEndFromTimes = slot.EndTime ? timeToMinutes(slot.EndTime) : 0;
                var thisSlotDuration = slotEndFromTimes > slotStart ? (slotEndFromTimes - slotStart) : (parseInt(slot.DurationMinutes) || 0);
                var slotEnd = slotStart + thisSlotDuration;
console.log(slotStart,slotEnd,'dayadocotor')
                var selectedStart = timeToMinutes(startTime);

                if (selectedStart >= slotStart && selectedStart < slotEnd) {
                    // This slot covers our time — save its duration as fallback
                    slotDuration = thisSlotDuration;

                    // Check if visit reason matches
                    if (slot.VisitReasons && $scope.selectedAppointmentObject.VisitReasonId) {
                        angular.forEach(slot.VisitReasons, function (vr) {
                            if (vr.ReasonId === $scope.selectedAppointmentObject.VisitReasonId) {
                                duration = thisSlotDuration;
                            }
                        });
                    }
                }
            });
        }

        // Priority 2: No visit reason match → use the slot's DurationMinutes
        if (duration === 0 && slotDuration > 0) {
            duration = slotDuration;
        }

        // Priority 3: Use visit reason object's own duration
        if (duration === 0 && $scope.selectedAppointmentObject.VisitReasonObj) {
            duration = parseInt($scope.selectedAppointmentObject.VisitReasonObj.DurationMinutes) ||
                parseInt($scope.selectedAppointmentObject.VisitReasonObj.ConsultationTime) || 0;
        }

        // Priority 4: Fallback to MinPerCase
        if (duration === 0) {
            duration = minPerCase;
        }

        // Recalculate end time
        if ($scope.calobj.StartTime) {
            var startMoment = moment($scope.calobj.StartTime, "HH:mm");
            var endMoment = startMoment.clone().add(duration, 'minutes');

            $scope.calobj.EndTime = endMoment.format("HH:mm");
            $scope.calobj.NewEndTime = endMoment.format("hh:mm A");
            $scope.selectedAppointmentObject.EndTime = endMoment.format("HH:mm");

            console.log("DEBUG [EndTime] Start:", $scope.calobj.StartTime,
                "Duration:", duration, "End:", $scope.calobj.NewEndTime,
                "(source:", duration === slotDuration ? "SlotDuration" :
                duration === minPerCase ? "MinPerCase" : "VisitReason", ")");
        }
    };

}]);
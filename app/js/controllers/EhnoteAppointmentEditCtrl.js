

eHnoteWebApp.controller('EhnoteAppointmentEditCtrl', ["$scope", "$http", "$rootScope", "$compile", "$q", "$location", "$ocLazyLoad", "$uibModal", "$routeParams", "$filter", "$timeout", "eHnoteMainAppointmentService", "eHnoteMasterDataService", "eHnoteValidateUsersDataService", "eHnoteLoginStatusService", "datacookieFactory", "$window", "eHnoteCacheStorageService", "datapersistanceFactory", "dateFilter", "eHnoteUserAppointmentDataService", "alertify", "eHnotePatientAddressDataServices", "eHnotePatientVisitReasonServices", function ($scope, $http, $rootScope, $compile, $q, $location, $ocLazyLoad, $uibModal, $routeParams, $filter, $timeout, eHnoteMainAppointmentService, eHnoteMasterDataService, eHnoteValidateUsersDataService, eHnoteLoginStatusService, datacookieFactory, $window, eHnoteCacheStorageService, datapersistanceFactory, dateFilter, eHnoteUserAppointmentDataService, alertify, eHnotePatientAddressDataServices, eHnotePatientVisitReasonServices) {
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.hourList = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
    $scope.minList = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];


    
    if (!userLoginDetails.loggedinStatus) {
        datapersistanceFactory.clearAll();
        $location.path('/login');
        return false;
    }  
    $scope.tmpinputData = eHnoteMasterDataService.getcalenderInfo();
    if ($scope.tmpinputData.rowData.PatientInfo.appointmentStatus && $scope.tmpinputData.rowData.PatientInfo.appointmentStatus == 'O') {
        $rootScope.$broadcast('CallEditAppointmentCloseMdl');
        return false;
    }

    var SetupPopUp;
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.ParentHospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    $scope.HospitalCD = "";
    $scope.PageName = 'reschedule';
    $scope.tmpTodayValue = $filter('date')(new Date(), "yyyy-MM-dd");
    $scope.chkTodayDate = function (d1) {
        var tmpd1 = $filter('date')(new Date(d1), "yyyy-MM-dd");
        if (tmpd1 === $scope.tmpTodayValue) {
            return true;
        } else {
            return false;
        }
    };
    $scope.ResApptype = "OTHERS";
    datapersistanceFactory.set("OpAppointmentDetailsById", "");
    $scope.EnableEdit = function () {

        $scope.disabled = $scope.disabled ? false : true;
        $scope.Canceldisabled = true;
        $scope.Rescheduledisabled = $scope.Rescheduledisabled ? false : true;

        var AppointmentId = $scope.tmpinputData.rowData.PatientInfo.appointmentID;
        eHnoteMainAppointmentService.getAdditionalApptDetailsById(AppointmentId).then(function (resp) {
            resp.data = resp.data || [];
            console.log(resp);

            var VisitRemarks = "";

            if (resp.data.length > 0) {
                if (resp.data[0].AppointmentDetails.length > 0) {

                    resp.data[0].AppointmentDetails[0].AppointmentNotes = resp.data[0].AppointmentNotes;
                    VisitRemarks = resp.data[0].AppointmentDetails[0].VisitRemarks || "";
                    datapersistanceFactory.set("OpAppointmentDetailsById", resp.data[0].AppointmentDetails[0]);
                }
            }

        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        cacheStorageItem.patientid = checkval($scope.tmpinputData.rowData.PatientInfo.patientID);
        cacheStorageItem.PatientName = $scope.tmpinputData.rowData.PatientInfo.fullName;
        cacheStorageItem.EmailID = checkval($scope.tmpinputData.rowData.PatientInfo.EmailId);

        cacheStorageItem.CountryCode = checkval($scope.tmpinputData.rowData.PatientInfo.CountryCode);
        cacheStorageItem.PhoneNumber = checkval($scope.tmpinputData.rowData.PatientInfo.MobileNo);
        cacheStorageItem.PatientTypeId = checkval($scope.tmpinputData.rowData.PatientInfo.PatientTypeId);
        var VisitTypeId = $scope.tmpinputData.rowData.VisitTypeId || 0;
            $scope.AppDate = [$scope.StartTimeHour + ":" + $scope.StartTimeMin, ($scope.EndTimeHour + ":" + $scope.EndTimeMin), $scope.tmpinputData.rowData.PatientInfo.appointmentID, checkval($scope.tmpinputData.rowData.visitReason), $scope.tmpinputData.rowData.PatientInfo.ReferralSourceId ? $scope.tmpinputData.rowData.PatientInfo.ReferralSourceId : '', VisitTypeId, VisitRemarks];
        //cacheStorageItem.PreviousAppointmentDate = $filter('date')(new Date($scope.tmpinputData.startDate), "MMM d, yyyy");
            //cacheStorageItem.PreviousAppointmentTime = item.StartTime;
        cacheStorageItem.IsAppointmentConfirmed = $scope.tmpinputData.AppointmentDetails.IsConfirmedAppointment || false;

        if ($scope.tmpinputData.rowData.hospitalId) {
            var clinicAddress = {
                "ClinicId": $scope.tmpinputData.rowData.hospitalId
            };
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
        }

        if ($scope.tmpinputData.rowData.doctorId) {
            var doctorID = {
                "DoctorID": $scope.tmpinputData.rowData.doctorId
            };
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        }
        $rootScope.appointment_type = $scope.tmpinputData.rowData.doctorVisitRsnId.toString();
        $scope.ispatientExistsval = true;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
        $scope.calenderDate = moment(NewStartDate).format('DD-MMM-YYYY ' + $scope.StartTimeHour + ":" + $scope.StartTimeMin);
        SetupPopUp = $uibModal.open({
            "templateUrl": 'appointMentPopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            //"size": "lg"
            "windowClass": "appointment-full-popup"
        });

        }, function (err) {
            console.log(err);
            alertify.error("Getting data failed");
        });
    };

    function checkval(val) {
        return val !== undefined && val != "" && val !== null ? val : '';
    };

    $scope.$on('reshedulesuccessMethod', function (event) {
        //$('body').removeClass('modal-open');
        //$('.modal-backdrop').remove();
        RefreshTopBarCount();
        $rootScope.$broadcast('CallEditAppointmentCloseMdl');
        SetupPopUp.dismiss('cancel');

    });
    function loadCancelVisitreason() {
        var getParams = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "ReasonTypeId": 2
        };
        $scope.CancelAppReasoncalender = [];
        return eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
            if (resp.data !== undefined) {
                $scope.CancelAppReasoncalender = resp.data.rows;
                var obj = {
                    "ReasonId": 1,
                    "Reason": "Others"
                };
                $scope.CancelAppReasoncalender.push(obj);
            }
        });
    }
    loadCancelVisitreason();
    $scope.closeBookAppPopup = function () {
        $rootScope.$broadcast('CallEditAppointmentCloseMdl');
    };
    eHnotePatientAddressDataServices.getAppointmentTypes(onTypesSuccess, onTypesFailed);
    function onTypesSuccess(data) {
        $scope.appointmentTypes = data;
    }
    function onTypesFailed() {
    }
    $scope.tmpappointmentstatus = "";
    $scope.SummaryEditPatient_id = "";
    $scope.notifySMS = true;
    $scope.notifyMAIL = false;

    $scope.doctorEmailID = $scope.tmpinputData.rowData.doctorEmail;
    $scope.ResVisitrsn = $scope.tmpinputData.rowData.visitReason;
    $scope.doctorVisitReason = $scope.tmpinputData.rowData.doctorVisitRsnId;
    $scope.isEvent = false;
    $scope.doctorName = $scope.tmpinputData.doctorName;
    $scope.showEventDoctors = $scope.tmpinputData.showEventDoctors;
    if ($scope.tmpinputData.rowData.PatientInfo.appointmentStatus == "EVENT") {
        $scope.isEvent = true;
        LoadEventDoctors();
    } else if ($scope.tmpinputData.rowData.PatientInfo.appointmentStatus == "IMPEVENT") {
        $scope.isEvent = true;
        $scope.isImportant = true;
        LoadEventDoctors();
    } else {
        LoadPatientInfo();
    }
    $scope.eventTitle = $scope.tmpinputData.eventTitle || "";
    $scope.eventDesc = $scope.tmpinputData.eventDesc || "";
    $scope.eventVenue = $scope.tmpinputData.eventVenue || "";
    $scope.doctorSpecialities = $scope.tmpinputData.doctorSpecialities;
    $scope.doctorImage = "";
    var tmpsplit = $scope.tmpinputData.eventInfo.split("|");
    var tmpTimesplit = tmpsplit[4].split("-");
    var tmpSHrsplit = tmpTimesplit[0].split(":");
    var tmpEHrsplit = tmpTimesplit[1].split(":");
    $scope.profileImage = $scope.tmpinputData.rowData.PatientInfo.profileImage || "";
    $scope.Title = $scope.tmpinputData.rowData.PatientInfo.title;
    $scope.patName = $scope.tmpinputData.rowData.PatientInfo.fullName;
    $scope.age = $scope.tmpinputData.rowData.PatientInfo.currentAge != undefined ? ($scope.tmpinputData.rowData.PatientInfo.currentAge.year + 'y ' + ($scope.tmpinputData.rowData.PatientInfo.currentAge.month == "0" ? "" : ($scope.tmpinputData.rowData.PatientInfo.currentAge.month + 'm'))) : "";
    $scope.sex = $scope.tmpinputData.rowData.PatientInfo.Sex == 'M' ? 'Male' : 'Female';
    $scope.mobileNumber = $scope.tmpinputData.rowData.PatientInfo.MobileNo != "0" ? $scope.tmpinputData.rowData.PatientInfo.MobileNo : "";
    $scope.isAllDay = $scope.tmpinputData.allDay;
    $scope.doctorVisitReason = $scope.tmpinputData.rowData.doctorVisitRsnId != undefined ? ($scope.tmpinputData.rowData.doctorVisitRsnId).toString() : "";
    $scope.ResVisitrsn = $scope.tmpinputData.rowData.visitReason;
    $scope.Bookeddt = $filter('date')(new Date($scope.tmpinputData.startDate), "MMM d, yyyy");
    $scope.BookedEnddt = $filter('date')(new Date($scope.tmpinputData.endDate), "MMM d, yyyy");
    $scope.StartTime = tmpSHrsplit[0] + ":" + tmpSHrsplit[1];
    $scope.EndTime = tmpEHrsplit[0] + ":" + tmpEHrsplit[1];
    if ($scope.EndTime == "23:59") {
        $scope.EndTime = "24:00";
    }
    $scope.disabledRescheduling = $scope.tmpinputData.rowData.PatientInfo.appointmentStatus;
    var NewStartDate = moment($scope.tmpinputData.start).local();
    var NewStartTime = moment($scope.tmpinputData.start).local();
    var NewEndTime = $scope.tmpinputData.end == null ? moment($scope.tmpinputData.endDate).local() : moment($scope.tmpinputData.end).local();
    if ($scope.isAllDay) {
        NewStartDate = moment($scope.tmpinputData.start).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).local();
        if ($scope.tmpinputData.end != null)
            NewEndTime = moment($scope.tmpinputData.end).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).local();
        NewStartTime = NewStartDate;
    }
    $scope.dtEdit = NewStartDate.format('DD-MMMM-YYYY');
    $scope.dtEnd = NewEndTime.format('DD-MMMM-YYYY');
    $scope.newdt = NewStartDate.format("MMM D, YYYY");
    $scope.enddt = NewEndTime.format("MMM D, YYYY");
    $scope.StartTimeHour = NewStartTime.format('HH');
    $scope.StartTimeMin = NewStartTime.format('mm');
    if (NewEndTime.format('HH:mm') == "23:59") {
        $scope.EndTimeHour = "00";
        $scope.EndTimeMin = "00";
    } else {
        $scope.EndTimeHour = NewEndTime.format('HH');
        $scope.EndTimeMin = NewEndTime.format('mm');
    }
    $scope.patinet_appStarttime = { "seq": $scope.StartTimeHour + "" + $scope.StartTimeMin, "startTime": $scope.StartTimeHour + ":" + $scope.StartTimeMin };
    $scope.EndtimeVAlue = { "seq": $scope.EndTimeHour + "" + $scope.EndTimeMin, "startTime": $scope.EndTimeHour + ":" + $scope.EndTimeMin };
    $scope.showAppNotification = true;
    if (new Date($scope.dtEdit).valueOf() < new Date().setHours(0, 0, 0, 0)) {
        $scope.showAppNotification = false;
    }
    function LoadEventDoctors() {
        $scope.clinicDoctorList = $scope.tmpinputData.clinicDoctorList;
        $scope.tmpinputData.clinicDoctorList.forEach(function (doctor) {
            if (doctor.DoctorID == $scope.tmpinputData.rowData.doctorId) {
                $scope.selectedDoctor = doctor;
                $scope.doctorName = doctor.FullName;
            }
        });
    }
    function LoadPatientInfo() {
        $scope.patients = [];
        $scope.getappointmentid = $scope.tmpinputData.rowData.PatientInfo.appointmentID;
        eHnoteMainAppointmentService.GetAppointmentsbyId($scope.getappointmentid, onSuccessList, onErrorList);
        function onSuccessList(data) {
            var item = data;
            eHnoteMasterDataService.addStartAppointmentInfo(item);
            $scope.startDate = $filter('date')(new Date(item.ConsultationDt), "dd-MMMM-yyyy");
            $scope.EditPatient_id = item.PatientID;
            $scope.SummaryEditPatient_id = item.PatientID;
            $scope.EditHospitalID = item.HospitalID;
            eHnoteMasterDataService.addDocPatientID(item.PatientID);
            $scope.patient_problems = item.OtherVisitRsn;
            $scope.appointment_type = item.DoctorVisitRsnID;
            $scope.tmpappointmentstatus = item.AppointmentStatus;
            if ($scope.tmpappointmentstatus == 'B') {
                $scope.showEditAppointmentID = false;
            }
            var data_param = {
                'UserBranchId': $scope.tmpinputData.UserBranchId,
                'HospitalID': $scope.tmpinputData.rowData.hospitalId,
                'startDate': $filter('date')(new Date($scope.dtEdit), "yyyy-MM-dd"),
                'endDate': $filter('date')(new Date($scope.dtEdit), "yyyy-MM-dd")
            };
            eHnoteMainAppointmentService.getDoctorAppoitmentInfo(OnGetAppointmentSlotSuccess, OnGetAppointmentSlotError, data_param);
        }
        function onErrorList(data) {
        }
    }
    function OnGetAppointmentSlotSuccess(data) {
        var booked = data;
        var jsonAvailConsultTime = [];
        $scope.minPerCase = 15;
        if (booked.calendarList.length > 0) {
            for (var j = 0; j < booked.calendarList.length; j++) {
                if (booked.calendarList[j].SlotLst != undefined) {
                    for (var k = 0; k < booked.calendarList[j].SlotLst.length; k++) {
                        $scope.minPerCase = booked.calendarList[j].SlotLst[k].MinPerCase;
                        for (var l = 0; l < booked.calendarList[j].SlotLst[k].SlotLst.length; l++) {
                            var sTime = booked.calendarList[j].SlotLst[k].SlotLst[l];
                            var strStartHour = sTime.StartTime;
                            var strEndHour = sTime.Endtime;
                            var seq = strStartHour.slice(0, 2) + strStartHour.slice(3, 5);
                            var endseq = strEndHour.slice(0, 2) + strEndHour.slice(3, 5);
                            if (sTime.PatientInfo != undefined) {
                                for (var m = 0; m < sTime.PatientInfo.length; m++) {
                                    var strStart = sTime.PatientInfo[m].AppointmentStartTime;
                                    var strEnd = sTime.PatientInfo[m].AppointmentEndTime;
                                    var pseq = strStart.slice(0, 2) + strStart.slice(3, 5);
                                    var pendseq = strEnd.slice(0, 2) + strEnd.slice(3, 5);
                                    jsonAvailConsultTime.push({ consultID: booked.calendarList[j].SlotLst[k].MinPerCase, startTime: strStart.substring(0, 5), Available: "N", endTime: strEnd.substring(0, 5), seqStart: pseq, seqend: pendseq });
                                }
                            }
                            else {
                                jsonAvailConsultTime.push({ consultID: booked.calendarList[j].SlotLst[k].MinPerCase, startTime: strStartHour.substring(0, 5), Available: sTime.Available, endTime: strEndHour.substring(0, 5), seqStart: seq, seqend: endseq });
                            }
                        }
                    }
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
                }
                else {
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
                if (hr != 24) {
                    $scope.timings.push({ "seq": hours + "" + miniutes, "startTime": time });
                }
            }

            var curdate = $filter('date')(new Date(), "dd-MMMM-yyyy");
            var referredappointmentdate = $filter('date')(new Date($scope.dtEdit), "dd-MMMM-yyyy");
            if (referredappointmentdate == curdate) {
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
                $scope.patinet_appStarttime = $filter('filter')($scope.setValue, { startTime: $scope.patinet_appStarttime.startTime })[0];
                $scope.setEndValue = $scope.setValue;
                $scope.EndtimeVAlue = $filter('filter')($scope.setEndValue, { startTime: $scope.EndtimeVAlue.startTime })[0];
                //$scope.patinet_appStarttime = $scope.setValue[0];
                //var doc = {};
            } else {
                //$scope.setValue = $scope.timings;
                $scope.patinet_appStarttime = $filter('filter')($scope.timings, { startTime: $scope.patinet_appStarttime.startTime })[0];
                $scope.setEndValue = $scope.timings;
                $scope.EndtimeVAlue = $filter('filter')($scope.setEndValue, { startTime: $scope.EndtimeVAlue.startTime })[0];
                $scope.setValue = $scope.timings;
                var doc = {};
            }



        } else {
            $scope.setValue = [];
        }
        eHnoteMasterDataService.addavgConsultationTimeInfo($scope.minPerCase);
    }
    function OnGetAppointmentSlotError(data) {
        eHnoteMasterDataService.addDocAvailConsultTimeInfo("");
    }
    var sdate = "";
    $scope.EditEndtimechange = function () {
        if ($scope.patinet_appStarttime != null) {
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
        }
    };
    $scope.Endtimechange = function () {
        if ($scope.patinet_appStarttime != null) {
            var app_startingTime = $scope.patinet_appStarttime.startTime;
            $scope.dffTime = eHnoteMasterDataService.getavgConsultationTimeInfo();
            var branchid = $scope.tmpinputData.UserBranchId;
            angular.forEach($scope.tmpinputData.clinicDoctorList, function (details) {
                if (details.UserBranchId == branchid) {
                    $scope.dffTime = details.MinPerCase;
                }
            });
            var eee = new Date(1980, 1, 1, 0, 0, 0);
            eee.setHours(app_startingTime.substring(0, 2), app_startingTime.substring(3, 5), 0);
            eee.setMinutes(eee.getMinutes() + $scope.dffTime);
            var lowm = eee.getMinutes();
            if (lowm < 10) lowm = "0" + lowm;
            sdate = eee.getHours() + ":" + lowm;
            $scope.EndtimeVAlue = {};
            $scope.setEndValue = [];
            for (var i = 0; i < $scope.setValue.length; i++) {
                if ($scope.patinet_appStarttime.seq < $scope.setValue[i].seq) {
                    $scope.setEndValue.push($scope.setValue[i]);
                }
            }

            $scope.EndtimeVAlue = $scope.setEndValue[0];
            $scope.isRescheduled = true;
        }
    };
    $scope.addEditedAppointment = function () {
        var slots = eHnoteMasterDataService.getDocAvailConsultTimeInfo();
        if (slots.length == 0) {
            alertify.error("Doctor is not available.Please choose another slot");
            return false;
        }
        var available = true;
        angular.forEach(slots, function (items) {
            if (available) {
                if ((items.seqStart <= $scope.patinet_appStarttime.seq) && ($scope.patinet_appStarttime.seq < items.seqend)) {
                    if (items.Available == "N") {
                        alertify.error("Selected time solt is already booked");
                        $scope.patinet_appStarttime = {};
                        $scope.EndtimeVAlue = {};
                        $scope.available = false;
                        return;
                    }
                }
            }
        });
        if (!available) {
            return false;
        }
        var curSelectedDt = $filter('date')(new Date($scope.dtEdit), "yyyy-MM-dd");
        var DoctorID = $scope.tmpinputData.rowData.doctorId;
        var EmailID = $scope.tmpinputData.rowData.EmailID;
        var daycd = $filter('date')(new Date(curSelectedDt), "EEE").toUpperCase();
        var patient_appStartTime = $scope.patinet_appStarttime.startTime;
        var patient_appEndTime = $scope.EndtimeVAlue.startTime;
        if (patient_appEndTime == "00:00") {
            patient_appEndTime = "24:00";
        }
        if (new Date('1-1-2016 ' + patient_appStartTime).getTime() >= new Date('1-1-2016 ' + patient_appEndTime).getTime()) {
            alertify.error("End Time cannot be equal or lesser than Start Time");
            return false;
        }
        var patient_appDate = curSelectedDt;
        var patient_id = $scope.EditPatient_id;
        var hosid = $scope.EditHospitalID;
        var Final_StartTime = patient_appStartTime;
        // var Final_ConsultId = $scope.tmpinputData.rowData.addressId;
        var Final_ConsultId = $scope.tmpinputData.UserBranchId;
        var visitreason = $scope.ResVisitrsn;
        var VisitRsnType = $scope.doctorVisitReason;
        Final_StartTime = Final_StartTime.trim();
        var sendSms = ($scope.showAppNotification && $scope.notifySMS) ? "Y" : "N";
        var sendMail = ($scope.showAppNotification && $scope.notifyMAIL) ? "Y" : "N";
        var eDate = new Date(curSelectedDt);
        eDate.setHours(Final_StartTime.substring(0, 2), Final_StartTime.substring(3, 5), 0);
        eDate = $filter('date')(new Date(eDate), "yyyy-MM-dd'T'HH:mm:ss");
        $scope.TIME = $scope.patinet_appStarttime.startTime;
        $scope.PhNumber = $scope.tmpinputData.rowData.PatientInfo.CountryCode + "" + $scope.tmpinputData.rowData.PatientInfo.MobileNo;
        $scope.DocPHnumber = $scope.tmpinputData.rowData.docCountrycode + "" + $scope.tmpinputData.rowData.docMobile;
        $scope.date = $filter("date")(new Date(), "dd-MM-yyyy");

       

        var AppmntParams = {
            "AppointmentID": $scope.getappointmentid,
            "AppointmentStatus": "B",
            "StartTime": Final_StartTime,
            "EndTime": patient_appEndTime,
            "IsFollowUp": false,
            "PreviousAppointmentTime": $scope.StartTime,
            "PreviousAppointmentDate": $scope.Bookeddt,
            "DoctorID": parseInt(DoctorID),
            "UserBranchId": Final_ConsultId,
            "DayCD": daycd,
            "VisitUserTypeID": VisitRsnType,
            "OtherVisitRsn": visitreason,
            "ConsultationDt": patient_appDate,
            "PatientID": patient_id,
            "UserId": parseInt(DoctorID),
            "USRType": "DOCTOR",
            "DoctorVisitRsnID": $scope.apptypeval,
            "HospitalDetails": {
                "HospitalID": hosid,
                "HospitalCD": $scope.HospitalCD,
                "ParentHospitalID": $scope.ParentHospitalID,
                "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
            },

            "CommunicationDetails": {
                "PatientName": $scope.tmpinputData.rowData.PatientInfo.fullName,
                "PatientMobile": $scope.PhNumber,
                "DoctorMobile": $scope.DocPHnumber,
                "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "DoctorName": $scope.tmpinputData.doctorName,
                "AppDate": $scope.date,
                "AppTime": $scope.TIME,
                "AppClinic": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "AppToken": 0,
                "PatientEmail": $scope.tmpinputData.rowData.PatientInfo.EmailId,
                "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail,
                "DoctorEmail": $scope.tmpinputData.rowData.doctorEmail,
                "HospitalContact": doctorinfo.doctordata.UserAddress[0].MobileNo
            },
            "PaidFollowup": false
        };

        eHnoteUserAppointmentDataService.AddUpdateAppointmentService(AppmntParams, OnAddApointmentSuccess, OnCaseSaveError);

        function OnAddApointmentSuccess(data) {
            if (data.status == "success") {
                alertify.success('Appointment Rescheduled Successfully');
            }
            eHnoteMasterDataService.addSelectedAppointDt(curSelectedDt);
            eHnoteMasterDataService.adddocSelectedFollowupDay(0);
            $scope.tmpFollowupDay = 0;
            $scope.showEditAppointmentID = true;
            $scope.Token = data.response.TokenNumber;
            //if (data.response.TokenNumber == "0") {
            //    $scope.Token ="";
            //}
            //else {
            //    $scope.Token = data.response.TokenNumber;
            //}
            // $rootScope.$broadcast('AppointmentListCalled');
            // $rootScope.$emit('CallAppointmentList', {});
            $scope.closeBookAppPopup();
            $scope.patient_appEndTime = "";
        }
        function OnCaseSaveError(data) {
            alertify.error("Error in Rescheduling Appointment");
        }

    };

    $scope.$on('AppointmentListCalled', function (ev, args) {
        LoadPatientInfo();
    });


    var minPerCase = 0;
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
        if (check_todaydate == momment_currentdate) {
            if (selected_Hour < timenow_Hour) {
                blnLapsed = true;
            } else if (selected_Hour == timenow_Hour) {
                if (selected_Minute < timenow_Minute || (minPerCase + selected_Minute - 1) < timenow_Minute) {
                    blnLapsed = true;
                }
            }
        } else if (check_todaydate < momment_currentdate) {
            blnLapsed = true;
        }
        return blnLapsed;
    }
    $scope.CancelAppointmentFrmCancel = function () {
        $scope.appointmentsinfo = { AppointmentID: '', DayCD: '', ConsultationDt: '', StartTime: '', EndTime: '', PatientID: '', VisitUserTypeID: '', DoctorID: '', FirstTimeVisit: '', DoctorVisitRsnID: '', OtherVisitRsn: '', ActualFees: '', AppointmentStatus: '', TokenNumber: '', CrtUSR: '', CrtUSRType: '', UpdtUSR: '', UpdtUSRType: '', EmailID: '' };
        eHnoteMainAppointmentService.GetAppointmentsbyId($scope.getappointmentid, onSuccessList, onErrorList);
        function onSuccessList(data) {
            console.log(JSON.stringify(data));
            $scope.appointmentsinfo = data;
            CancelAppointmentinCancel();
        }
        function onErrorList(data) {
        }
    };
    function CancelAppointmentinCancel() {
        var item = $scope.appointmentsinfo;


        var appointmentID = item.AppointmentID;
        var patientID = item.PatientID;
        var hosid = item.HospitalID;
        var doctorid = $scope.tmpinputData.rowData.doctorId;
        var DoctorEmailID = $scope.tmpinputData.rowData.doctorEmail;
        var addressID = $scope.tmpinputData.rowData.addressId;
        var startTime = item.StartTime;
        var endTime = item.EndTime;
        var dayCD = item.DayCD;
        var consultDate = $filter('date')(new Date(item.ConsultationDt), "yyyy-MM-dd");
        $scope.currentshowloading = true;
        var VisitRsnType = item.DoctorVisitRsnID;
        $scope.appDate = item.ConsultationDt;
        var sendSms = "Y";
        var sendMail = "Y";
        if ($scope.CancelReasoncalender == 'Others') {
            var cancelReason = $scope.OtherCancelReasoncalender;
        } else {
            var cancelReason = $scope.CancelReasoncalender;
        }
        //var cancelReason = $scope.appointment_reason;
        var Final_ConsultId = $scope.tmpinputData.UserBranchId;

        $scope.PhNumber = $scope.tmpinputData.rowData.PatientInfo.CountryCode + "" + $scope.tmpinputData.rowData.PatientInfo.MobileNo;
        $scope.DocPHnumber = $scope.tmpinputData.rowData.docCountrycode + "" + $scope.tmpinputData.rowData.docMobile;

        var AppmntParams = {
            "AppointmentID": appointmentID,
            "AppointmentStatus": "C",
            "StartTime": startTime,
            "EndTime": endTime,
            "IsFollowUp": false,
            "DoctorID": parseInt(doctorid),
            "UserBranchId": Final_ConsultId,
            "DayCD": dayCD,
            "VisitUserTypeID": "OPATIENT",
            "OtherVisitRsn": cancelReason,
            "ConsultationDt": $scope.appDate,
            "PatientID": patientID,
            "UserId": parseInt(doctorid),
            "USRType": "DOCTOR",
            "DoctorVisitRsnID": VisitRsnType,
            "HospitalDetails": {
                "HospitalID": hosid,
                "HospitalCD": $scope.HospitalCD,
                "ParentHospitalID": $scope.ParentHospitalID,
                "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
            },

            "CommunicationDetails": {
                "PatientName": $scope.tmpinputData.rowData.PatientInfo.fullName,
                "PatientMobile": $scope.PhNumber,
                "DoctorMobile": $scope.DocPHnumber,
                "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "DoctorName": $scope.tmpinputData.doctorName,
                "AppDate": $scope.appDate,
                "AppTime": $scope.TIME,
                "AppClinic": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "AppToken": 0,
                "PatientEmail": $scope.tmpinputData.rowData.PatientInfo.EmailId,
                "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail,
                "DoctorEmail": $scope.tmpinputData.rowData.doctorEmail,
                "HospitalContact": doctorinfo.doctordata.UserAddress[0].MobileNo
            },
            "PaidFollowup": false
        };




        eHnoteUserAppointmentDataService.AddUpdateAppointmentService(AppmntParams, OnAddApointmentSuccess, OnCaseSaveError);

        function OnAddApointmentSuccess(data) {
            alertify.success("Appointment Cancelled Successfully");
            $scope.Token = data.response.TokenNumber;
            //if (data.response.TokenNumber == "0") {
            //    $scope.Token = "";
            //}
            //else {
            //    $scope.Token = data.response.TokenNumber;
            //}
            $scope.closeBookAppPopup();
            $scope.showEditAppointmentID = true;
        }
        function OnCaseSaveError(data) {
            alertify.error("Error in Cancelling Appointment");
        }



        //eHnoteMainAppointmentService.CancelCalAppointment(hosid, appointmentID, addressID, dayCD, doctorid,eHnoteMasterDataService.getLoginId(), consultDate, "C", startTime, endTime, patientID, VisitRsnType, sendSms, sendMail, cancelReason, callbackSuccess, callbackError);
        //function callbackSuccess(data) {
        //    alertify.success("Appointment Cancelled Successfully");

        //    $scope.TIME = $scope.patinet_appStarttime.startTime;

        //    $scope.PhNumber = $scope.tmpinputData.rowData.PatientInfo.CountryCode + "" +$scope.tmpinputData.rowData.PatientInfo.MobileNo;
        //    $scope.DocPHnumber = $scope.tmpinputData.rowData.docCountrycode + "" + $scope.tmpinputData.rowData.docMobile;

        //    eHnoteMainAppointmentService.SendCancelEmailTemplate($scope.tmpinputData.rowData.PatientInfo.fullName, doctorinfo.doctordata.UserAddress[0].ClinicName, $scope.tmpinputData.doctorName, $scope.appDate, $scope.TIME, data.response.TokenNumber, $scope.tmpinputData.rowData.PatientInfo.EmailId, $scope.tmpinputData.rowData.doctorEmail, doctorinfo.doctordata.UserAddress[0].BranchEmail, $scope.DocPHnumber, $scope.PhNumber, doctorinfo.doctordata.UserAddress[0].ClinicName, EmailCancelcallbackSuccess, EmailCancelcallbackError);



        //    function EmailCancelcallbackSuccess() {
        //    }
        //    function EmailCancelcallbackError() {
        //    }
        //        eHnoteMainAppointmentService.SendCancelSMS($scope.tmpinputData.rowData.PatientInfo.fullName, $scope.tmpinputData.doctorName, $scope.appDate, $scope.TIME, data.response.TokenNumber, $scope.tmpinputData.rowData.PatientInfo.EmailId, DoctorEmailID, doctorinfo.doctordata.UserAddress[0].BranchEmail, $scope.DocPHnumber, $scope.PhNumber, doctorinfo.doctordata.UserAddress[0].ClinicName,$scope.date, SMScallbackSuccess, SMScallbackError);
        //    function SMScallbackSuccess() {
        //    }
        //    function SMScallbackError() {
        //    }
        //    $scope.closeBookAppPopup();
        //    $scope.showEditAppointmentID = true;
        //}
        //function callbackError(data) {
        //    alertify.error("Error in Cancelling Appointment");
        //}
    }
    $scope.StartAppointmentFrmCancel = function () {
        $scope.appointmentsinfo = { AppointmentID: '', DayCD: '', ConsultationDt: '', StartTime: '', EndTime: '', PatientID: '', VisitUserTypeID: '', DoctorID: '', FirstTimeVisit: '', DoctorVisitRsnID: '', OtherVisitRsn: '', ActualFees: '', AppointmentStatus: '', TokenNumber: '', CrtUSR: '', CrtUSRType: '', UpdtUSR: '', UpdtUSRType: '' };
        eHnoteMainAppointmentService.GetAppointmentsbyId($scope.getappointmentid, onSuccessList, onErrorList);
        function onSuccessList(data) {
            $scope.appointmentsinfo = data;
            $scope.Appointmentpatientinfo = eHnoteMainAppointmentService.GetPatientsbyId($scope.appointmentsinfo.PatientID, onSuccessList1, onErrorList1);
            function onSuccessList1(data) {
                $scope.Appointmentpatientinfo = data;
                StartAppointmentinCancel();
            }
            function onErrorList1(data) {
            }
        }
        function onErrorList(data) {
        }
    };
    function StartAppointmentinCancel() {
        var item = $scope.appointmentsinfo;
        var tmpPatInfo = {
            AppointmentID: item.AppointmentID,
            caseid: 0,
            USRType: "DOCTOR",
            PatientID: item.PatientID,
            PatientDetails: {
                Patient: [{
                    FirstName: $scope.Appointmentpatientinfo.Patient[0].FirstName,
                    DOB: $scope.Appointmentpatientinfo.Patient[0].DOB,
                    Age: $scope.Appointmentpatientinfo.Patient[0].Age,
                    TermsAccepted: "Y",
                    FullName: $scope.Appointmentpatientinfo.Patient[0].FullName,
                    PatientID: $scope.Appointmentpatientinfo.Patient[0].PatientID,
                    Gender: $scope.Appointmentpatientinfo.Patient[0].Gender,
                    EmailId: $scope.Appointmentpatientinfo.Patient[0].EmailId,
                    FamilyHeadIndicator: "Y"
                }],
                PatientPhone: [{ PhAreaCD: ($scope.Appointmentpatientinfo.PatientPhone[0] !== undefined) ? $scope.Appointmentpatientinfo.PatientPhone[0].PhAreaCD : '', PhCntryCD: 91, PhNumber: ($scope.Appointmentpatientinfo.PatientPhone[0] !== undefined) ? parseFloat($scope.Appointmentpatientinfo.PatientPhone[0].PhNumber) : '', PhType: "M", PrimaryIND: "Y", PhStateCD: ($scope.Appointmentpatientinfo.PatientPhone[0] !== undefined) ? $scope.Appointmentpatientinfo.PatientPhone[0].PhStateCD : '' }]
            }
        };
        var cacheStorageItem = angular.copy(eHnoteCacheStorageService.getCacheStorageStructure());
        cacheStorageItem.appointmentid = item.AppointmentID;
        cacheStorageItem.patientid = item.PatientID;
        cacheStorageItem.doctorid = item.DoctorID;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
        eHnoteMasterDataService.addAppointmentInfo(tmpPatInfo);
        eHnoteValidateUsersDataService.RemoveProcessingCookies();
        $scope.notifySMS = false;
        $scope.notifyMAIL = false;
        $scope.closeBookAppPopup();
        $scope.showEditAppointmentID = true;
        window.parent.location.href = "#/main";
    }
    $scope.CloseModal = function () {
        $scope.patinet_appStarttime = {};
        $scope.patient_appEndTime = "";
        $scope.EditEndtimeValue = "";
        $scope.Bookeddt = $filter('date')(new Date(), "yyyy-MM-dd");
        $scope.showEditAppointmentID = true;
        $scope.notifySMS = false;
        $scope.notifyMAIL = false;
        $rootScope.$broadcast('CallEditAppointmentCloseMdl');
    };
    $scope.EnableCancel = function () {
        $scope.Rescheduledisabled = true;
        $scope.Canceldisabled = $scope.Canceldisabled ? false : true;
    };
    function buildHours_StartTime() {
        dayViewStart = moment('05:00', 'HH:mm');
        dayViewEnd = moment(vm.dayViewEnd || '23:00', 'HH:mm');
        var tmpdt = $filter('date')(new Date($scope.dtEdit), "yyyy-MM-dd");
        var dayViewSplit = parseInt(eHnoteMasterDataService.getavgConsultationTimeInfo());
        $scope.stTimehours = [];
        var dayCounter = moment(tmpdt)
            .clone()
            .hours(dayViewStart.hours())
            .minutes(dayViewStart.minutes())
            .seconds(dayViewStart.seconds());
        for (var i = 0; i <= dayViewEnd.diff(dayViewStart, 'hours') ; i++) {
            $scope.stTimehours.push({
                label: calendarHelper.formatDate(dayCounter, calendarConfig.dateFormats.hour),
                date: dayCounter.clone(),
                startTime: dayCounter.clone().format('HH:mm:ss')
            });
            dayCounter.add(dayViewSplit, 'minute');
        }
    }
    $scope.Rescheduledisabled = true;
    $scope.Canceldisabled = true;
    var onchageselectappoint = 0;
    onchageselectappoint = eHnoteMasterDataService.getDocHospital;
    $scope.getDcotorAppointmentDetails = function (dateValue) {
        var formatteddateValue = $filter('date')(new Date(dateValue), "yyyy-MM-dd");
        $scope.noData = "";
        if (JSON.stringify($scope.showDayID) === "true") {
            $scope.dayConfig.visible = true;
        }
        var DoctorID = $scope.tmpinputData.rowData.doctorId;
        var data_param = {
            'DoctorID': DoctorID,
            'filterByDate': formatteddateValue,
            'UserBranchId': onchageselectappoint
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
                        if (sTime.Available == 'Y') {
                            var strStartHour = sTime.StartTime;
                            jsonAvailConsultTime.push({ startTime: strStartHour.substring(0, 5) });
                        }
                    }
                }
                eHnoteMasterDataService.addDocAvailConsultTimeInfo(jsonAvailConsultTime);
                var json = eHnoteMasterDataService.getDocAvailConsultTimeInfo();
                $scope.setValue = json;
            } else {
                $scope.setValue = [];
            }
            eHnoteMasterDataService.addavgConsultationTimeInfo($scope.minPerCase);
        }
        function OnGetAppointmentError(data) {
            eHnoteMasterDataService.addDocAvailConsultTimeInfo("");
        }
    };
    $scope.changeDoctor = function () {
        $scope.isRescheduled = true;
        $scope.doctorName = $scope.selectedDoctor.FullName;
    };
    $scope.chgDate = function (dt) {
        $scope.newdt = $filter('date')(new Date($scope.dtEdit), "MMM d, yyyy");
        $scope.isRescheduled = true;
        if (new Date(dt).valueOf() < new Date().setHours(0, 0, 0, 0)) {
            $scope.showAppNotification = false;
            $scope.notifySMS = false;
            $scope.notifyMAIL = false;
        }
        else {
            $scope.showAppNotification = true;
            $scope.notifySMS = true;
            $scope.notifyMAIL = false;
        }
        var data_param = {
            'UserBranchId': $scope.tmpinputData.UserBranchId,
            'HospitalID': $scope.tmpinputData.rowData.hospitalId,
            'startDate': $filter('date')(new Date($scope.dtEdit), "yyyy-MM-dd"),
            'endDate': $filter('date')(new Date($scope.dtEdit), "yyyy-MM-dd")
        };
        eHnoteMainAppointmentService.getDoctorAppoitmentInfo(OnGetAppointmentSlotSuccess, OnGetAppointmentSlotError, data_param);
    };
    $scope.chgStartDate = function () {
        $scope.dtEnd = $filter('date')(new Date($scope.dtEdit), "dd-MMMM-yyyy");
        $scope.newdt = $filter('date')(new Date($scope.dtEdit), "MMM d, yyyy");
        $scope.enddt = $filter('date')(new Date($scope.dtEnd), "MMM d, yyyy");
        $scope.EditEndtimeValue = "";
        $scope.isRescheduled = true;
        $scope.toggleImportant();
    };
    $scope.chgEndDate = function () {
        $scope.newdt = $filter('date')(new Date($scope.dtEdit), "MMM d, yyyy");
        $scope.enddt = $filter('date')(new Date($scope.dtEnd), "MMM d, yyyy");
        $scope.EditEndtimeValue = "";
        $scope.isRescheduled = true;
        $scope.toggleImportant();
    };
    $scope.toggleAllDay = function () {
        $scope.isRescheduled = true;
        $scope.dtEdit = $filter('date')(new Date(NewStartDate), "dd-MMMM-yyyy");
        $scope.dtEnd = $filter('date')(new Date(NewStartDate), "dd-MMMM-yyyy");
        if (!$scope.isAllDay) {
            $scope.StartTimeHour = NewStartTime.format('HH');
            $scope.StartTimeMin = NewStartTime.format('mm');
            $scope.EndTimeHour = NewEndTime.format('HH');
            $scope.EndTimeMin = NewEndTime.format('mm') == "59" ? "55" : NewEndTime.format('mm');
        }
        else {
            $scope.StartTimeHour = "00";
            $scope.StartTimeMin = "00";
            $scope.EndTimeHour = "00";
            $scope.EndTimeMin = "00";
        }
        $scope.toggleImportant();
    };
    $scope.rescheduleAppointment = false;
    $scope.toggleImportant = function () {
        $scope.isRescheduled = true;
        if ($scope.isImportant) {
            $scope.showReschedule = true;
            $scope.rescheduleAppointment = false;
            $scope.showPatNotification = true;
            $scope.doctorSMS = false;
            $scope.UserEmail = false;
            $scope.patientSMS = false;
            $scope.patientEmail = false;
            if (new Date($scope.dtEnd).valueOf() < new Date().setHours(0, 0, 0, 0)) {
                $scope.showPatNotification = false;
            }
            if (new Date($scope.dtEdit).valueOf() != new Date($scope.dtEnd).valueOf()) {
                $scope.showReschedule = false;
            }
        }
    };
    $scope.toggleImportant();
    $scope.timeChange = function () {
        $scope.isRescheduled = true;
    };
    $scope.isRescheduled = false;
    if ((moment($scope.tmpinputData.startDate).valueOf() != moment($scope.tmpinputData.start).valueOf()) || (moment($scope.tmpinputData.endDate).valueOf() != moment($scope.tmpinputData.end).valueOf())) {
        $scope.isRescheduled = true;
    }
    if ($scope.tmpinputData.source.action == "cancel") {
        $scope.EnableCancel();
    } else if ($scope.tmpinputData.source.action == "reschedule") {
        $scope.EnableEdit();
    } else if ($scope.Bookeddt != NewStartDate.format('YYYY-MM-DD') || $scope.StartTime.trim() != NewStartTime.format('HH:mm') || $scope.EndTime.trim() != NewEndTime.format('HH:mm')) {
        $scope.EnableEdit();
    }
    $scope.cancelEvent = function () {
        var params = {
            "AppointmentStatus": "C",
            "AppointmentID": $scope.tmpinputData.rowData.PatientInfo.appointmentID,
            "StartTime": $scope.StartTimeHour + ":" + $scope.StartTimeMin,
            "EndTime": $scope.EndTimeHour + ":" + $scope.EndTimeMin,
            "DoctorID": $scope.tmpinputData.rowData.PatientInfo.doctorID,
            "DayCD": $filter('date')(new Date($scope.tmpinputData.startDate), "EEE").toUpperCase(),
            "EventName": $scope.eventTitle,
            "StartDate": $filter('date')(new Date($scope.tmpinputData.startDate), "yyyy-MM-dd"),
            "EndDate": $filter('date')(new Date($scope.tmpinputData.endDate), "yyyy-MM-dd"),
            "UserBranchId": $scope.tmpinputData.rowData.addressId,
            "HospitalID": $scope.tmpinputData.rowData.hospitalId,
            "USRId": eHnoteMasterDataService.getLoginId(),
            "USRType": "DOCTOR",
            "SendNotification": {
                "sendPatientSMS": "N",
                "sendPatientEmail": "N",
                "sendDoctorSMS": $scope.doctorSMS ? "Y" : "N",
                "sendDoctorEmail": $scope.UserEmail ? "Y" : "N"
            }
        };
        function onSourceSuccess(data) {
            $scope.closeBookAppPopup();
            alertify.success('Event Cancelled Successfully');
        }
        function onSourceFailed(data) {
            $scope.closeBookAppPopup();
            alertify.error('Error in Cancelling Event');
        }
    };
    $scope.rescheduleEvent = function () {
        var params = {
            "AppointmentStatus": "EVENT",
            "AppointmentID": $scope.tmpinputData.rowData.PatientInfo.appointmentID,
            "StartTime": $scope.StartTimeHour + ":" + $scope.StartTimeMin,
            "EndTime": $scope.EndTimeHour + ":" + $scope.EndTimeMin,
            "DoctorID": ($scope.showEventDoctors ? $scope.selectedDoctor.DoctorID : $scope.tmpinputData.rowData.doctorId),
            "DayCD": $filter('date')(new Date($scope.dtEdit), "EEE").toUpperCase(),
            "StartDate": $filter('date')(new Date($scope.dtEdit), "yyyy-MM-dd"),
            "EndDate": $filter('date')(new Date($scope.dtEnd), "yyyy-MM-dd"),
            "UserBranchId": ($scope.showEventDoctors ? $scope.selectedDoctor.UserBranchId : $scope.tmpinputData.rowData.addressId),
            "USRId": eHnoteMasterDataService.getLoginId(),
            "USRType": "DOCTOR",
            "EventName": $scope.eventTitle == "" ? "Events" : $scope.eventTitle,
            "EventDescription": $scope.eventDesc,
            "EventLocation": $scope.eventVenue,
            "HospitalID": $scope.tmpinputData.rowData.hospitalId,
            "Reason": ($scope.isImportant && ($scope.patientSMS || $scope.patientEmail)) ? $scope.cancelReason : "",
            "SendNotification": {
                "sendPatientSMS": "N",
                "sendPatientEmail": "N",
                "sendDoctorSMS": $scope.doctorSMS ? "Y" : "N",
                "sendDoctorEmail": $scope.UserEmail ? "Y" : "N"
            }
        };
        if ($scope.isAllDay) {
            params["StartTime"] = "00:00";
            params["EndTime"] = "23:59";
        }
        if ($scope.isImportant) {
            params["RescheduleAppointment"] = $scope.rescheduleAppointment ? "Y" : "N";
            params["AppointmentStatus"] = "IMPEVENT";
            params["SendNotification"]["sendPatientSMS"] = $scope.patientSMS ? "Y" : "N";
            params["SendNotification"]["sendPatientEmail"] = $scope.patientEmail ? "Y" : "N";
        }
        if (params.EndDate > params.StartDate) {
        }
        else if (params.EndDate == params.StartDate && new Date('1-1-2016 ' + params.StartTime).getTime() < new Date('1-1-2016 ' + params.EndTime).getTime()) {
        } else {
            alertify.error("End Time cannot be equal or lesser than Start Time");
        }
        function onSourceSuccess(data) {
            $scope.closeBookAppPopup();
            if ($scope.isImportant && $scope.rescheduleAppointment) {
                alertify.success('Event Rescheduled Successfully. Appointments are rescheduled at background, kindly refresh after sometime.');
            }
            else if ($scope.isImportant && !$scope.rescheduleAppointment) {
                alertify.success('Event Rescheduled Successfully. Appointments are cancelled at background, kindly refresh after sometime.');
            }
            else {
                alertify.success('Event Rescheduled Successfully');
            }
        }
        function onSourceFailed(data) {
            $scope.closeBookAppPopup();
            alertify.error('Error in Rescheduling Event');
        }
    };

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

}]);
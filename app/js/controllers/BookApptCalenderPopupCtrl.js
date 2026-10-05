"use strict";
eHnoteWebApp.controller("BookApptCalenderPopupCtrl", ["$scope", "$filter", "eHnoteUserAppointmentDataService", 'eHnoteMasterDataService', "eHnotePatientVisitReasonServices", "eHnotePatientDataService", "$timeout", "$q", "eHnoteUserDataService", "Selectedobj", "$uibModalInstance", "alertify", "$uibModal", "eHnoteMainAppointmentService", "$location","eHnoteLoginStatusService",
    function ($scope, $filter, eHnoteUserAppointmentDataService, eHnoteMasterDataService, eHnotePatientVisitReasonServices, eHnotePatientDataService, $timeout, $q, eHnoteUserDataService, Selectedobj, $uibModalInstance, alertify, $uibModal, eHnoteMainAppointmentService, $location, eHnoteLoginStatusService) {

        $scope.ClinicDoctorList = eHnoteMasterDataService.getCalendarDoctorinAppList();

        console.log($scope.ClinicDoctorList);
        $scope.Calendardoctorlist1 = $filter("filter")($scope.ClinicDoctorList, function (item) { return item.DoctorID === Selectedobj.selectedAppt.DocObj.DoctorID}, true);
      
        $scope.selectApptDocObj = Selectedobj.selectedAppt.DocObj || '';
        $scope.IsIOJOrganization = Selectedobj.IsIOJOrganization || false;
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.appointmentTypes = Selectedobj.appointmentTypes || [];
        $scope.PatientTagList1 = Selectedobj.HospitalEquipmentList || [];
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.RoleId = userLoginDetails.RoleID;
        $scope.Visitreasons = $filter("filter")(Selectedobj.AllVisitReasons, function (item) {
            return item.ReasonId != 0;
        });
        if ($scope.Visitreasons.length > 0) {
            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = true;
            });
        }
        let AppointmentVisitReasonOBj = Selectedobj.selectedAppt.VisitReasonObj || '';
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        var screenobj = eHnoteMasterDataService.getSelectedCrmApptDates() || {};
        //$scope.ConsultationDt = $filter("date")(new Date(), "MM-dd-yyyy");
        $scope.ConsultationDt = $filter("date")(Selectedobj.selectedAppt.AppointmentDate, "MM-dd-yyyy");
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.userBranchId = doctorinfo.doctordata.UserAddress[0].UserBranchId 
        var qtipDown = false;
        var calendar;
        // ConsultationDt / calendar display strings are not formats every engine parses: WebKit rejects
        // "MM-DD-YYYY" and "DD-MMM-YYYY" outright where V8's legacy parser accepts them, and a bare
        // "YYYY-MM-DD" is parsed as UTC midnight (previous local day west of UTC). Parse explicitly.
        // Mirrors the helpers in UsDayDoctorTimeLineFullCalendarCtl / EhnoteNewAppointmentListCtrl (OP).
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
        // Local-midnight Date for the popup's selected consultation date.
        function apptConsultationDate(value) {
            return safeNewDate(value || $scope.ConsultationDt);
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


        // FullCalendar only begins a date-selection on touch after a long press
        // (DateSelecting sets `dragging.delay = ev.isTouch ? longPressDelay : null`), so a short
        // tap on a slot never fires `select` the way a mouse click does. A tap is still reported as
        // `dateClick`, so promote it into a real selection and let the existing `select` handler run
        // unchanged. Mouse clicks already selected the slot before `dateClick` fires, so they are
        // ignored here. Mirrors selectSlotOnTap() in UsDayDoctorTimeLineFullCalendarCtl (OP calendar).
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

        $scope.evencalobj = {
            "IsShow": false,
            "StartTime": "",
            "EndTime": "",
            "DoctorId": 0,
            "DoctorName": "",
            "PatientName": "",
            "infoobj": "",
            "date": "",
            "HospitalId": 0,
            "VisitTypeId": 0,
            "IsAppointmentUpdateAvailable": true,
            "IsNoShowIconInd": false
        };

        $scope.calobj = {
            "IsShow": false,
            "StartTime": "",
            "EndTime": "",
            "NewStartTime": "",
            "NewEndTime": "",
            "DoctorId": 0,
            "DoctorName": "",
            "infoobj": "",
            "date": "",
            "HospitalId": 0
        };
        $scope.BreakEventObj = {
            "IsShow": false,
            "StartTime": "",
            "EndTime": "",
            "DoctorId": 0,
            "DoctorName": "",
            "infoobj": "",
            "date": "",
            "HospitalId": 0,
            "BreakReason": "",
            "BreakRemarks": ""
        };
        $scope.BookingTypesArray1 = [
            {
                "BookingTypeId": 1,
                "BookingType": "WalkIn",

            },
            {
                "BookingTypeId": 2,
                "BookingType": "Waiting",

            },
            {
                "BookingTypeId": 3,
                "BookingType": "By Appointment",

            }
        ];
        $scope.AppointmentStatusArray1 = [
            {
                "AppointmentStatusId": 1,
                "StatusName": "Not Checked In",

            },
            {
                "AppointmentStatusId": 2,
                "StatusName": "Check In",

            },
            {
                "AppointmentStatusId": 3,
                "StatusName": "Check  Out",

            },
            {
                "AppointmentStatusId": 4,
                "StatusName": "Express Check Out",

            },
            {
                "AppointmentStatusId": 5,
                "StatusName": "Planned Cancel",

            },
            {
                "AppointmentStatusId": 6,
                "StatusName": "Check-In Cancelled",

            },
            {
                "AppointmentStatusId": 7,
                "StatusName": "Same Day Cancelled",

            },
            {
                "AppointmentStatusId": 8,
                "StatusName": "Planed Reschedule",

            },
            {
                "AppointmentStatusId": 9,
                "StatusName": "Same Day Reschedule",

            },
            {
                "AppointmentStatusId": 10,
                "StatusName": "Check-In Reschedule",

            },
            {
                "AppointmentStatusId": 11,
                "StatusName": "No Show",

            }
        ];
        $scope.BookedstatusFilterList1 = [
            {
                "Id": 1,
                "Name": "Confirmed",
                "IsChecked": true
            },
            {
                "Id": 2,
                "Name": "Not Confirmed",
                "IsChecked": true
            }
        ];
        $scope.ProfileStatusList1 = [
            {
                "Id": 1,
                "Name": "Complete",
                "IsChecked": true
            },
            {
                "Id": 2,
                "Name": "InComplete",
                "IsChecked": true
            },
            {
                "Id": 3,
                "Name": "Not Worked",
                "IsChecked": true
            }
        ];
        $scope.AllDoctorsObj = {
            "AllDoctorCheck": true,
            "AllVisitReasonsCheck": true,
            "AllAppointmentTypeStatusCheck": true
        }
        $scope.CalendarPatientdeatilsObj = {
            "PatientName": "",
            "PatientId": "",
            "IsConfirmedappointment": false,
            "Gender": "",
            "AgeInYear": 0,
            "AgeInMonth": 0,
            "AgeInDays": 0,
            "Mrno": "",
            "Oldno": "",
            "AppointmentDate": "",
            "StartTime": "",
            "EndTime": "",
            "VisitReason": "",
            "AppointmentNotesArray": [],
            "PatientInsuranceList": [],
            "RescheduledAppointmentId": 0,
            "RescheduledAppointmentDate": "",
            "RescheduledAppointmentStartTime": "",
            "RescheduledAppointmentEndTime": "",
            "AppointmentStatus": "B",
            "RescheduledDoctorId": 0,
            "BookingTypeId": 0,
            "PatientTagList": []
        };
        $scope.getCalendarPatientdeatilsObj = function () {
            $scope.CalendarPatientdeatilsObj.PatientName = "";
            $scope.CalendarPatientdeatilsObj.ProfileStatus = "";
            $scope.CalendarPatientdeatilsObj.PatientId = "";
            $scope.CalendarPatientdeatilsObj.IsConfirmedappointment = false;
            $scope.CalendarPatientdeatilsObj.Gender = "";
            $scope.CalendarPatientdeatilsObj.AgeInYear = 0;
            $scope.CalendarPatientdeatilsObj.AgeInMonth = 0;
            $scope.CalendarPatientdeatilsObj.AgeInDays = 0;
            $scope.CalendarPatientdeatilsObj.Mrno = "";
            $scope.CalendarPatientdeatilsObj.Oldno = "";
            $scope.CalendarPatientdeatilsObj.AppointmentDate = "";
            $scope.CalendarPatientdeatilsObj.StartTime = "";
            $scope.CalendarPatientdeatilsObj.EndTime = "";
            $scope.CalendarPatientdeatilsObj.VisitReason = "";
            $scope.CalendarPatientdeatilsObj.AppointmentStatus = "";

            $scope.CalendarPatientdeatilsObj.AppointmentNotesArray = [];
            $scope.CalendarPatientdeatilsObj.PatientInsuranceList = [];

            $scope.CalendarPatientdeatilsObj.RescheduledAppointmentId = 0;
            $scope.CalendarPatientdeatilsObj.RescheduledAppointmentDate = "";
            $scope.CalendarPatientdeatilsObj.RescheduledAppointmentStartTime = "";
            $scope.CalendarPatientdeatilsObj.RescheduledAppointmentEndTime = "";
            $scope.CalendarPatientdeatilsObj.RescheduledDoctorId = 0;
        };
        $scope.SelectedBookingTypeObj = {
            "WalkIn": false
        };
        $scope.eventRender = function (event, element, info) {


            if (!event.IsBreakEvent) {
                var patInfo = event.rowData.PatientInfo;

                var visitreasontxt = event.rowData.visitReason || "";


                var profileImg = (patInfo.S3URL === undefined || patInfo.S3URL === "") ? "images/default.png" : patInfo.S3URL;
                var patientName = patInfo.fullName;
                var patientAge = $filter('date')(new Date(patInfo.DOB), "MM-dd-yyyy")
                var patientMobile = "";
                patInfo.HomeNumber = patInfo.HomeNumber || "";

                var obj = eHnoteUserDataService.UsMobileFormatChange(patInfo.HomeAreaCode + patInfo.HomeNumber);
                patientMobile = obj.UsFormatMobileNumber;
               var patientSex = patInfo.Sex;

                var patientID = "";

                var OldMrNostring = patInfo.OldMrNo || "";

                if (OldMrNostring !== "") {
                    patientID = patInfo.PatientDisplayId + " / " + OldMrNostring;
                } else {
                    patientID = patInfo.PatientDisplayId;
                }

                var consultDate = $filter('date')(new Date(event.rowData.consultationDate), "MMM dd yyyy");
                var start = $filter('date')(new Date(event.patientstartTime), 'hh:mm a');
                var end = $filter('date')(new Date(event.patientendTime), "hh:mm a");
                var token = event.token;
                var doctorName = "Dr. " + event.rowData.doctorName;
                var isconfirmedappt = event.AppointmentDetails.IsConfirmedAppointment || false;
                
                var confirmedText = "";
                var confirmedimg = "";


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
                    confirmedimg = '<img src="img/appt-list/cancelledcal-icon.svg" width="18"/> ';
                }

               

                 
            }


        };
        $scope.Visitreasons1 = [];
        $scope.selectedVisitReasonObj = '';
        $scope.selectedVisitReason = '';
        if (AppointmentVisitReasonOBj != '') {
            $scope.Visitreasons1 = $filter("filter")($scope.Visitreasons, function (item) { return item.ReasonId === AppointmentVisitReasonOBj.ReasonId }, true)||[];
            $scope.selectedVisitReasonObj = AppointmentVisitReasonOBj || "";
            $scope.selectedVisitReason = AppointmentVisitReasonOBj.Reason||'';
        }
        $scope.onclickPageLoad = function () {

            var formatteddateValue = $filter('date')(apptConsultationDate(), "yyyy-MM-dd");
           /* var params = {
                "UserId": $scope.selectApptDocObj.DoctorID,
                "usrType": "DOCTOR",
                "startDate": formatteddateValue,
                "endDate": formatteddateValue,
                "HospitalID": $scope.HospitalId,
                "GetAllIndicator": 0,
                "AppointmentTypeStatusIDList": "",
                "VisitReasonIdList": "",
                "VisitStatusIDLst": "",
                "PatientTagListIds": "",
            };*/

            let hospitalId = Selectedobj?.selectedAppt?.HospitalId ?? 0;

            var params = {
                "UserId": $scope.selectApptDocObj.DoctorID,
                "usrType": "DOCTOR",
                "startDate": formatteddateValue,
                "endDate": formatteddateValue,
                "HospitalID": hospitalId,
                "GetAllIndicator": 0,
                "AppointmentTypeStatusIDList": "",
                "VisitReasonIdList": "",
                "VisitStatusIDLst": "",
                "PatientTagListIds": "",
                "DoctorID": $scope.selectApptDocObj.DoctorID, 
                "UserBranchId": $scope.userBranchId, 
                "FacilityListIds": "",  
                "ProfileStatusIds": "",  
                "IsNoShowAppointment": false,  
                "BookingTypeIds": "",  
                "AppointmentStatusIds": "",  
                "BookingStatusIds": "", 
                "Locationids": hospitalId,
            };
            if ($scope.appointmentTypes != undefined) {
                var apptList = _.pluck($scope.appointmentTypes, "AppointmentTypeId").join(",");
                params.AppointmentTypeStatusIDList = apptList || "";
            }
            if ($scope.Visitreasons.length > 0) {
                //var listVisitRsnArray = $filter("filter")($scope.Visitreasons, function (iterator, ind) { return iterator.isChecked === true; });
                var visitRsnList = _.pluck($scope.Visitreasons, "ReasonId").join(",");
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

            var newlist7 = "";
            $scope.BookingTypesArray1.forEach(function (item) {
                newlist7 += "," + item.BookingTypeId;
            });
            if (newlist7.charAt(0) === ",") {
                newlist7 = newlist7.slice(1);
            }

            var newlist10 = "";
            //for (var i in $scope.AppointmentStatusArray1) {
            //    newlist10 += "," + $scope.AppointmentStatusArray1[i].AppointmentStatusId;
            //}
            $scope.AppointmentStatusArray1.forEach(function (item) {
                newlist10 += "," + item.AppointmentStatusId;
            });
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
            
            var PatientTags = "";
            //$scope.PatientTagList1.forEach(function (item) {
            //    PatientTags += "," + item.HospitalEquipmentId;
            //});
            //if (PatientTags.charAt(0) === ",") {
            //    PatientTags = PatientTags.slice(1);
            //}

            params.VisitStatusIDLst = "1,2,3";
            params.BookingTypeIds = angular.copy(newlist7);
            params.AppointmentStatusIds = angular.copy(newlist10);
            params.BookingStatusIds = angular.copy(newlist11);
            params.ProfileStatusIds = angular.copy(profilestatuslist);
            params.PatientTagListIds = PatientTags;

            eHnoteUserAppointmentDataService.getWeekwiseMonthwiseAppointments(params, onweekSuccess, onweekError);
            function onweekSuccess(data) {
                $scope.eventsList1 = [];
                var booked = data;

                $scope.minPerCase = 15;
                $scope.eventsList = [];
                $scope.appCount = data.appointmentCounts;
                $scope.UserAvailableSlots = data.UserAvailableSlots || [];
                $scope.IsBranchHoliday = data.IsBranchHoliday || false;



          

                angular.forEach($scope.UserAvailableSlots, function (uitem) {
                    uitem.visitReasonNoSlots = [];
                    if (uitem.UserBranchId == $scope.selectApptDocObj.UserBranchId) {
                        angular.forEach(uitem.SlotsList, function (sitem,index) {
                            var filterdate = $filter('filter')(sitem.VisitReasons, { 'ReasonId': $scope.selectedVisitReasonObj.ReasonId }, true) || [];
                            if (filterdate.length === 0) {
                                uitem.visitReasonNoSlots.push(sitem);
                            }  
                        });
                    }
                });

                //angular.forEach($scope.UserAvailableSlots, function (uitem) {
                //    if (uitem.UserBranchId == $scope.selectApptDocObj.UserBranchId) {
                //        for (let i = uitem.SlotsList.length - 1; i >= 0; i--) { // Iterate backward
                //            var filterdate = $filter('filter')(uitem.SlotsList[i].VisitReasons, { 'ReasonId': $scope.selectedVisitReasonObj.ReasonId }, true) || [];
                //            if (filterdate.length === 0) {
                //                uitem.SlotsList.splice(i, 1); // Splice safely without affecting indices
                //            }
                //        }
                //    }
                //});

                if ($scope.UserAvailableSlots.length > 0) {
                    angular.forEach($scope.UserAvailableSlots, function (item) {
                        item.UserDayBlockedSlots = item.UserDayBlockedSlots || [];

                        item.UserDayBreakSlots = $filter('filter')(item.UserDayBreakSlots, { "UserBranchId": item.UserBranchId }, true);

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

                angular.forEach($scope.Calendardoctorlist1, function (citem) {
                    citem.ApptsCount = 0;
                    citem.VisitCountsArray = [];
                    citem.IsLeave = false;
                    if (data.calendarList.length > 0) {
                        $scope.slotsMainList = data.calendarList[0].slotList || [];
                        if ($scope.slotsMainList.length > 0) {
                            angular.forEach($scope.slotsMainList, function (sitem) {
                                if (sitem.doctorID === citem.DoctorID) {
                                    citem.ApptsCount = sitem.DoctorTotalAppointmentCount || 0;
                                }
                            });





                            var filteredSlostArray = $filter("filter")($scope.slotsMainList, function (item, index) { return item.doctorID === citem.DoctorID; }, true) || [];

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

                                angular.forEach($scope.visitTypeCount, function (value, visitTypeId) {
                                    citem.VisitCountsArray.push({
                                        'VisitTypeId': visitTypeId,
                                        'Count': value.count,
                                        'VisitReason': value.VisitReason,
                                        'ColorCode': value.VisitReasonColorCode,
                                        "AppointmentTypeId": value.AppointmentTypeId,
                                    });
                                });

                            }

                        }
                    }

                    var filteredDOcObj = $filter("filter")(data.UserAvailableSlots, function (iterator, ind) { return iterator.DoctorId === citem.DoctorID; });
                    if (filteredDOcObj.length > 0) {

                        citem.SlotStartTime = filteredDOcObj[0].StartTime || "00:00";
                        citem.SlotEndTime = filteredDOcObj[0].EndTime || "00:00";
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



                $timeout(function () {


                    var calendarEl = document.getElementById('calendarFull');
                    var time = $filter("date")(new Date(), "HH:mm");
                    var mintime = "06:00";

                    var today = $filter("date")(apptConsultationDate(), "yyyy-MM-dd " + time);
                    var scrollTime = moment().format("HH") + ":00:00";
                    var firstHour = new Date().getUTCHours() - 5;

                    calendar = new FullCalendar.Calendar(calendarEl, {
                        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                        selectable: true,
                        editable: true,
                        height: 'auto',
                        now: today,
                        nowIndicator: true,
                        slotMinTime: mintime,
                        dayMinWidth: 180,
                        allDaySlot: false,
                        slotEventOverlap: false,
                        stickyFooterScrollbar: true,
                        initialView: 'resourceTimeGridDay',
                        views: {
                            resourceTimeGridDay: {
                                slotDuration: "00:15"
                            }
                        },
                        headerToolbar: {
                            left: '',
                            center: '',
                            right: ''
                        },
                        aspectRatio: 1.8,
                        dateClick: selectSlotOnTap,
                        select: function (info) {
                            if ($scope.PresentcurrentUrl === "/crm" && doctorinfo.RoleID == 20) {
                                $scope.clearEventSelectedSlots();
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
                            var GivenDate = moment(info.start).format('DD-MMM-YYYY');
                            var CurrentDate = new Date();
                            GivenDate = parseCalenderDate(GivenDate);
                            if (GivenDate > CurrentDate) {

                            } else {
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
                            var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(info.resource.id); });
                            if (filteredDOcObj.length > 0) {
                                if (filteredDOcObj[0].businessHours != undefined) {
                                    var start1 = startTime.replaceAll(":", "");
                                    OverAllStartTime1 = filteredDOcObj[0].businessHours.startTime.replaceAll(":", "");
                                    OverAllEndTime1 = filteredDOcObj[0].businessHours.endTime.replaceAll(":", "");
                                }
                            }
                            $scope.mInstanceAdd2 = '';
                            let tempArray = $scope.UserAvailableSlots.filter((x) => x.DoctorId == parseInt(info.resource.id));
                            if (tempArray.length > 0) {
                                $scope.UserScheduleId = tempArray[0].UserScheduleId;
                                $scope.UserScheduleDetailId = tempArray[0].UserScheduleDetailId;
                            }

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
                            function GetTime(date) {
                                var currentTime = (new Date(date))
                                var hours = currentTime.getHours()
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


                            $scope.clearEventSelectedSlots();
                            $scope.clearBreakDetails();
                            if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {
                                $scope.calobj.IsShow = true;
                                $scope.calobj.StartTime = startTime;
                                $scope.calobj.NewStartTime = newstartTime;
                                $scope.calobj.NewEndTime = newendTime;
                                $scope.calobj.EndTime = endTime;
                                $scope.calobj.DoctorId = info.resource.id;
                                $scope.calobj.infoobj = info;
                                $scope.calobj.date = GivenDate;
                                $scope.calobj.DoctorName = filteredDOcObj[0].FullName;
                                $scope.SideFilter.mainpatientScreen = false;
                                $scope.getCalendarPatientdeatilsObj();
                            } else {
                                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'> You have selected Out of business hours, do you want to continue? </h4>", function () {

                                    angular.forEach($scope.UserAvailableSlots, function (item) {
                                        angular.forEach(item.SlotsList, function (kitem) {
                                            let startTime = kitem.StartTime.replace(":", "");
                                            let endTime = kitem.EndTime.replace(":", "");
                                            let startTime1 = $filter('date')(parseCalenderDate(startDatetime), "HH:mm");
                                            let endTime1 = $filter('date')(parseCalenderDate(endDatetime), "HH:mm");
                                            startTime1 = startTime1.replace(":", "");
                                            endTime1 = endTime1.replace(":", "");
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
                                        'OutOfBusinessTime': true

                                    }
                                    datapersistanceFactory.set("SingleDoctorcalendar", obj);
                                    var docObject = {
                                        "DoctorId": info.resource.id,
                                        "StartTime": startTime,
                                        "EndTime": endTime,
                                        "BranchId": $scope.HospitalId
                                    }
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
                                    $scope.SideFilter.mainpatientScreen = false;
                                    $scope.getCalendarPatientdeatilsObj();

                                    //openAppPopup();
                                    //BookApptPopupOpened()
                                }, function () { });
                            }
                        },
                        resourceAreaHeaderContent: 'Doctors',
                        resourceLabelDidMount: function (info) {
                            var VisitCountsArray = info.resource.extendedProps.VisitCountsArray || [];




                            var thumbnailImg = document.createElement('img');
                            if (info.resource.extendedProps.UserProfilepic !== "") {
                                thumbnailImg.src = info.resource.extendedProps.UserProfilepic;
                                thumbnailImg.alt = 'Thumbnail';
                                thumbnailImg.width = 25;
                                thumbnailImg.height = 25;

                                var parentElement = info.el.querySelector('.fc-scrollgrid-sync-inner');
                                parentElement.appendChild(thumbnailImg);
                            } 

                            var popover = "";

                            popover = '<div class="appointment-popover-section"><ul class="appointment-list-count">';
                            popover += '<li style="border-bottom: 1px solid #d2d2d2;"><label>Total Appointments:</label> <div><span style="color: #fff; font-size: 19px; font-weight: 600;background-color:#068cb0"> ' + info.resource.extendedProps.ApptsCount + '</span></div></li>';

                            var RearrangeCalenderPopOver = [];
                            if (VisitCountsArray.length > 0) {
                                var FirstArray = $filter("filter")(VisitCountsArray, function (iterator, ind) { return iterator.AppointmentTypeId === 1; });
                                if (FirstArray.length > 0) {
                                    angular.forEach(FirstArray, function (item) {
                                        RearrangeCalenderPopOver.push(item);
                                    });
                                }
                                var secondArray = $filter("filter")(VisitCountsArray, function (iterator, ind) { return iterator.AppointmentTypeId === 2; });
                                if (secondArray.length > 0) {
                                    angular.forEach(secondArray, function (item) {
                                        RearrangeCalenderPopOver.push(item);
                                    });
                                }
                                var thirdArray = $filter("filter")(VisitCountsArray, function (iterator, ind) { return iterator.AppointmentTypeId === 3; });
                                if (thirdArray.length > 0) {
                                    angular.forEach(thirdArray, function (item) {
                                        RearrangeCalenderPopOver.push(item);
                                    });
                                }
                                var fourthArray = $filter("filter")(VisitCountsArray, function (iterator, ind) { return iterator.AppointmentTypeId === 4 || iterator.AppointmentTypeId === 14; });
                                if (fourthArray.length > 0) {
                                    angular.forEach(fourthArray, function (item) {
                                        RearrangeCalenderPopOver.push(item);
                                    });
                                }
                                var FivethArray = $filter("filter")(VisitCountsArray, function (iterator, ind) { return iterator.AppointmentTypeId === 5; });
                                if (FivethArray.length > 0) {
                                    angular.forEach(FivethArray, function (item) {
                                        RearrangeCalenderPopOver.push(item);
                                    });
                                }
                                var sixArray = $filter("filter")(VisitCountsArray, function (iterator, ind) { return iterator.AppointmentTypeId === 6; });
                                if (sixArray.length > 0) {
                                    angular.forEach(sixArray, function (item) {
                                        RearrangeCalenderPopOver.push(item);
                                    });
                                }
                                var seventArray = $filter("filter")(VisitCountsArray, function (iterator, ind) { return iterator.AppointmentTypeId === 7; });
                                if (seventArray.length > 0) {
                                    angular.forEach(seventArray, function (item) {
                                        RearrangeCalenderPopOver.push(item);
                                    });
                                }
                                var eightArray = $filter("filter")(VisitCountsArray, function (iterator, ind) { return iterator.AppointmentTypeId === 8; });
                                if (eightArray.length > 0) {
                                    angular.forEach(eightArray, function (item) {
                                        RearrangeCalenderPopOver.push(item);
                                    });
                                }
                            }
                            if (RearrangeCalenderPopOver.length > 0) {
                                angular.forEach(RearrangeCalenderPopOver, function (vitem) {
                                    popover += '<li style="border-bottom: 1px solid #d2d2d2;"><label>' + vitem.VisitReason + ' :</label><div><span style="color: #f26223; font-size: 19px; font-weight: 600">' + vitem.Count + '</span></div></li>';
                                });
                            }
                            popover += '</div></div>';

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

                        resources: $scope.Calendardoctorlist1,
                        events: $scope.eventsList1 || [],
                        eventDidMount: function (date) {
                            $scope.eventRender(date.event.extendedProps, date)
                        },
                        
                        eventDrop: function (info, dayDelta, minuteDelta, allDay, revertFunc) {
                            if (info.event.extendedProps.AppointmentDetails.appointmentStatus == 'B') {
                                $scope.ChangeAppointmentDoctor(info, info.event.extendedProps);
                            } else {
                                info.revert();
                            }
                        },
                        eventClick: function (info) {

                            $scope.evencalobj.IsAppointmentUpdateAvailable = true;
                            if (!info.event.extendedProps.IsBreakEvent) {
                                var appointmentMainObj = info.event.extendedProps;


                                var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(appointmentMainObj.DoctorID); });
                                if (filteredDOcObj.length > 0) {
                                    $scope.evencalobj.DoctorName = filteredDOcObj[0].FullName;
                                }
                                $scope.evencalobj.IsShow = true;
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
                                $scope.evencalobj.date = "";

                                if ((appointmentMainObj.AppointmentDetails.appointmentStatus !== "C" &&
                                    appointmentMainObj.AppointmentDetails.CheckinStatusId == 3) || appointmentMainObj.AppointmentDetails.CheckinStatusId == 4) {
                                    $scope.evencalobj.IsAppointmentUpdateAvailable = false;
                                }

                                $scope.PopoverBtnObj.appointmentStatus = info.event.extendedProps.AppointmentDetails.appointmentStatus;
                                $scope.PopoverBtnObj.CheckinStatusId = info.event.extendedProps.AppointmentDetails.CheckinStatusId;
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
                        eventContent: function (info) {
                            var icon = '';
                            if (info.event.extendedProps.icon) {
                                icon = '<i class="' + info.event.extendedProps.icon + '"></i> ';
                            }
                            return { html: icon + info.event.title };
                        }


                    });

                    calendar.render();


                    loadEvents(booked, data);

                }, 500);
            }
            function onweekError(data) {

            }
        }

        $scope.ChangeAppointmentDoctor = function (item, subitem, maxRemarks) {

            var StartTime = $filter('date')(new Date(item.event.start), 'HH:mm:ss');
            var EndTime = $filter('date')(new Date(item.event.end), 'HH:mm:ss');
            var DoctorId = item.event._def.resourceIds[0];
            var UserBranchId = 0;
            DoctorId = parseInt(DoctorId) || null;
            if ($scope.Calendardoctorlist1.length > 0) {
                $scope.filterarray = $filter("filter")($scope.Calendardoctorlist1, function (item) {
                    return item.DoctorID === DoctorId;
                }) || [];
                if ($scope.filterarray.length > 0) {
                    UserBranchId = $scope.filterarray[0].UserBranchId;
                }

            }
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
            eHnotePatientDataService.ChangeAppointmentDoctorById(obj).then(function (resp) {
                if (resp.data.status === 'Success') {
                    $scope.Calendardoctorlist1 = $scope.Calendardoctorlist1 || [];
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

                    $('#calendarFull').fullCalendar('destroy');
                    calendar.destroy();
                    $scope.onclickPageLoad();

                    if (Selectedobj.selectedAppt.AppointmentID === subitem.AppointmentDetails.appointmentID) {
                        Selectedobj.selectedAppt.StartTime = StartTime;
                    }
                }

            }, function (err) {
                console.log(err);
            });
        }

        function onclickallDoctor() {

            var calendarEl = document.getElementById('calendarFull');

            var time = $filter("date")(new Date(), "HH:mm");
            var mintime = "06:00";
            var today = $filter("date")(apptConsultationDate(), "yyyy-MM-dd " + time);

            var nowIndicator = true;
            var tcurrentdate = $filter("date")(new Date(), "yyyy-MM-dd");

            var tApptdate = $filter("date")(apptConsultationDate(), "yyyy-MM-dd");
            if (tApptdate > tcurrentdate) {
                nowIndicator = false;
            }

            var scrollTime = moment().format("HH") + ":00:00";

            var firstHour = new Date().getUTCHours() - 5;

            calendar = new FullCalendar.Calendar(calendarEl, {
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
                    right: ''
                },
                dateClick: selectSlotOnTap,
                select: function (info) {

                    if ($scope.PresentcurrentUrl === "/crm" && doctorinfo.RoleID == 20) {
                        $scope.clearEventSelectedSlots();
                        return false;
                    }

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
                    //$scope.cacheStorageItem.bookApptType = "ApptFromCalendar";
                    //eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
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
                    } else {
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
                    var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(info.resource.id); });
                    if (filteredDOcObj.length > 0) {
                        if (filteredDOcObj[0].businessHours != undefined) {
                            var start1 = startTime.replaceAll(":", "");
                            OverAllStartTime1 = filteredDOcObj[0].businessHours.startTime.replaceAll(":", "");
                            OverAllEndTime1 = filteredDOcObj[0].businessHours.endTime.replaceAll(":", "");
                        }
                    }
                    $scope.mInstanceAdd2 = '';
                    let tempArray = $scope.UserAvailableSlots.filter((x) => x.DoctorId == parseInt(info.resource.id));
                    if (tempArray.length > 0) {
                        $scope.UserScheduleId = tempArray[0].UserScheduleId;
                        $scope.UserScheduleDetailId = tempArray[0].UserScheduleDetailId;
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


                    $scope.clearEventSelectedSlots();
                    $scope.clearBreakDetails();
                    if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {
                        //nskblckslot
                        //$scope.clearSelectedSlots();
                        //$scope.calobj.IsShow = true;
                        $scope.calobj.StartTime = startTime;
                        $scope.calobj.NewStartTime = newstartTime;
                        $scope.calobj.NewEndTime = newendTime;
                        $scope.calobj.EndTime = endTime;
                        $scope.calobj.DoctorId = info.resource.id;
                        $scope.calobj.infoobj = info;
                        $scope.calobj.date = new Date(info.startStr);
                        $scope.calobj.DoctorName = filteredDOcObj[0].FullName;
                        
                        /*$scope.SideFilter.mainpatientScreen = false;*/
                        $scope.getCalendarPatientdeatilsObj();
                    //    $scope.blocktheSelectedSlots($scope.calobj);
                    }
                    else {

                        if (doctorinfo.RoleID == 16) {
                            if ($scope.connectedUserObj.Available) {
                                if ($scope.connectedUserObj.Users.length > 0) {
                                    var filter1 = $filter("filter")($scope.connectedUserObj.Users, function (Nitem) {
                                        return Nitem.ChildUserId === parseInt(info.resource.id);
                                    }) || [];

                                    if (filter1.length == 0) {
                                        alertify.error("You dont have access to unblock");
                                        return false;
                                    }
                                }
                            }
                        }

                    //    var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'> You have chosen non-business hours, do you want to continue? </h4>", function () {
                    //        if (screenobj.Screen == "/op" && !$scope.UserAccessRights.AllAccessRights.APPCalendarBookAppointment) {
                    //            alertify.error("Book appointment calendar access rights are not there");
                    //            return false;
                    //        }
                    //        if (screenobj.Screen == "/crm" && !$scope.UserAccessRights.AllAccessRights.CRMCalendarBookAppointment) {
                    //            alertify.error("Book appointment calendar access rights are not there");
                    //            return false;
                    //        }
                    //        angular.forEach($scope.UserAvailableSlots, function (item) {
                    //            angular.forEach(item.SlotsList, function (kitem) {
                    //                let startTime = kitem.StartTime.replace(":", "");
                    //                let endTime = kitem.EndTime.replace(":", "");
                    //                let startTime1 = $filter('date')(parseCalenderDate(startDatetime), "HH:mm");
                    //                let endTime1 = $filter('date')(parseCalenderDate(endDatetime), "HH:mm");
                    //                startTime1 = startTime1.replace(":", "");
                    //                endTime1 = endTime1.replace(":", "");
                    //                //if (startTime1 > startTime && startTime1 < endTime) {
                    //                //    $rootScope.appointment_type = kitem.VisitTypeId.toString();
                    //                //}
                    //            });
                    //        });
                    //        function getMinutesBetweenDates(startDate, endDate) {
                    //            var diff = endDate.getTime() - startDate.getTime();
                    //            return (diff / 60000);
                    //        }
                    //        var minutes = getMinutesBetweenDates(date1, date2);
                    //        var obj = {
                    //            'IsComingFrom': 'Doctorcalendar',
                    //            'MinPerCaseval': minutes,
                    //            'Starttime': startDatetime,
                    //            'Endtime': endDatetime,
                    //            'GetDate': getDate,
                    //            'SlotType': $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3,
                    //            'AppointmentTypeId': $rootScope.appointment_type || 1,
                    //            'OutOfBusinessTime': true

                    //        }
                    //        datapersistanceFactory.set("SingleDoctorcalendar", obj);
                    //        var docObject = {
                    //            "DoctorId": info.resource.id,
                    //            "StartTime": startTime,
                    //            "EndTime": endTime,
                    //            "BranchId": $scope.HospitalId
                    //        }
                            
                    //        $scope.PageName = 'book';
                    //        var doctorID = {
                    //            "DoctorID": parseInt(docObject.DoctorId)
                    //        };
                    //        $scope.calenderDate = moment(date).format('DD-MMM-YYYY' + ' ' + startTime);
                    //        $scope.ispatientExistsval = false;
                    //        eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);

                    //        var clinicAddress = { "ClinicId": $scope.HospitalId };
                    //        eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
                    //        $scope.appDate = "";
                    //        $scope.AppDate = "";
                    //        var date = apptConsultationDate();

                    //        datapersistanceFactory.set('appointmentinfo', "");
                    //        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
                    //        appointmentInfo.AppointmentStatus = "B";
                    //        appointmentInfo.BillingId = 0;
                    //        appointmentInfo.CaptureBillingFrom = "Appointment";
                    //        eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);

                    //        var Obj = {
                    //            "PageName": "book",
                    //            "AppDate": "",
                    //            "ispatientExistsval": $scope.ispatientExistsval || false,
                    //            "calenderDate": $scope.calenderDate,
                    //            "AppointmentId": null,
                    //            "PatientId": null,
                    //            'IsComingFrom': '',
                    //            "type": $scope.CurrentUrl || ""
                    //        };
                    //        datapersistanceFactory.set('AppointmentDetailsCache', Obj);
                    //        $scope.SideFilter.mainpatientScreen = false;
                    //        $scope.getCalendarPatientdeatilsObj();

                    //        //BookApptPopupOpenedv2();

                           
                    //    }, function () { });
                    }







                },
                slotLabelFormat: {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                },
                resourceAreaHeaderContent: 'Doctors',
                resourceLabelDidMount: function (info) {
                    

                    var popover = "";
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><label>' + info.resource.extendedProps.FullName + ' Appointments :</label> <span style="color:red;font-size:12px;font-weight:600"> ' + info.resource.extendedProps.ApptsCount + '</span></div></div>';
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
                            event: 'click mousedown mouseleave'
                        },
                        adjust: {
                            scroll: true
                        },
                        position: {
                            my: 'bottom center',
                            at: 'left bottom'
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
                            width: 508,
                            tip: false,
                            classes: 'qtip-light qtip-shadow'
                        }
                    });
                },
                resources: $scope.Calendardoctorlist1,
                events: $scope.eventsList1 || [],
                eventDidMount: function (info) {
                    $scope.eventRender(info.event.extendedProps, info);
                    console.log("bg applying 2");
                    if (info.event.extendedProps.background) {
                        info.el.style.background = info.event.extendedProps.background;
                    }
                },
                eventClick: function (info) {


                    $scope.evencalobj.IsAppointmentUpdateAvailable = true;

                    if (!info.event.extendedProps.IsBreakEvent) {
                        var appointmentMainObj = info.event.extendedProps;

                        var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(appointmentMainObj.DoctorID); });
                        if (filteredDOcObj.length > 0) {
                            $scope.evencalobj.DoctorName = filteredDOcObj[0].FullName;
                        }
                        $scope.evencalobj.IsShow = true;

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

                        //$scope.PopoverBtnObj.appointmentStatus = info.event.extendedProps.AppointmentDetails.appointmentStatus;
                        //$scope.PopoverBtnObj.CheckinStatusId = info.event.extendedProps.AppointmentDetails.CheckinStatusId;

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

                        //$scope.SideFilter.mainpatientScreen = false;
                        $scope.getCalendarPatientdeatilsObj();
                        var appointmentID = appointmentMainObj.AppointmentDetails.appointmentID || 0;
                    //    $scope.ChangePatientDetailsEventClick(appointmentID);
                    } else {
                        $scope.clearBreakDetails();
                        let tempObj = info.event.extendedProps;

                        var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(tempObj.SlotInfo.DoctorId); });
                        if (filteredDOcObj.length > 0) {
                            $scope.BreakEventObj.DoctorName = filteredDOcObj[0].FullName;
                        }

                        
                        $scope.BreakEventObj.StartTime = new Date(tempObj.SlotInfo.StartTime);
                        $scope.BreakEventObj.EndTime = new Date(tempObj.SlotInfo.EndTime);
                        $scope.BreakEventObj.DoctorId = tempObj.SlotInfo.DoctorId;
                        $scope.BreakEventObj.infoobj = tempObj;
                        $scope.BreakEventObj.date = tempObj.SlotInfo.ConsultationDate;
                        $scope.BreakEventObj.BreakReason = tempObj.SlotInfo.ReasonforBlockSlot || "";
                        $scope.BreakEventObj.BreakRemarks = tempObj.SlotInfo.BlockedRemarks || "";

                        //$scope.BreakEventObj.IsShow = true;
                        $scope.DeleteBreakSlot($scope.BreakEventObj);
                        //nskbreak

                        $scope.clearEventSelectedSlots();
                        $scope.clearSelectedSlots();
                    }

                },
                eventDrop: function (info, dayDelta, minuteDelta, allDay, revertFunc) {
                    let breakcounter = 0;
                    let filteredEvents = $filter('filter')($scope.eventsList1, { "resourceId": parseInt(info.event._def.resourceIds[0]) }, true);
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

                        if (parseInt(info.event._def.extendedProps.DoctorID) != parseInt(info.event._def.resourceIds[0])) {

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

                            var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(info.event._def.resourceIds[0]); });
                            if (filteredDOcObj.length > 0) {
                                let apptslistbydoc = $filter('filter')($scope.eventsList1, { "DoctorID": parseInt(info.event._def.resourceIds[0]) }, true);
                                let selectedPatientID = info.event.extendedProps.patientID;
                                let patientslist = $filter('filter')(apptslistbydoc, { "patientID": selectedPatientID }, true);
                                if (patientslist.length > 0) {
                                    alertify.error("Patient already has an appointment with the doctor!");
                                    info.revert();
                                    return;
                                }
                                $scope.getUserBranchSlotRestrictionForCalender1(info.event._def.resourceIds[0], info.event.start, info, info.event.extendedProps);
                                //}
                            } else {
                                info.revert();
                            }
                        } else {
                            var startTime = $filter("date")(new Date(info.event.start), "HH:mm");
                            var start1 = startTime.replaceAll(":", "");
                            var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(info.event._def.resourceIds[0]); });
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

                                let apptsCounter = 0;
                                let filteredEventsArr = $filter('filter')($scope.eventsList1, { "DoctorID": parseInt(info.event._def.resourceIds[0]) }, true);
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
                                let filteredEventsArr = $filter('filter')($scope.eventsList1, { "DoctorID": parseInt(info.event._def.resourceIds[0]) }, true);
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
                        }
                        
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


            });

            calendar.render();
            //$scope.value = 'test';
            //$scope.selectApptDocObj.SecondUserFullName = 'test';
            //$scope.$digest();
        }
        
        
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
                            if (sTime.patientInfo.PatientDisplayId !='') {
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
                                title = sTime.patientInfo.fullName;
                                eventInfo = ((sTime.patientInfo.title === undefined || sTime.patientInfo.title === "") ? "" : sTime.patientInfo.title + '. ') + sTime.patientInfo.fullName + " | Token : " + (sTime.tokenNumber === '0' ? "Walk-In" : sTime.tokenNumber) + " | " + ((sTime.patientInfo.mobileNumber === undefined || sTime.patientInfo.mobileNumber.toString().length < 6) ? "-" : sTime.patientInfo.mobileNumber) + " | " + ((sTime.patientInfo.currentAge === undefined) ? ((sTime.patientInfo.age === undefined) ? '' : (sTime.patientInfo.age + "y")) : (((sTime.patientInfo.currentAge.year > 0) ? sTime.patientInfo.currentAge.year + "y" : '') + ' ' + ((sTime.patientInfo.currentAge.month > 0) ? sTime.patientInfo.currentAge.month + "m" : ''))) + "/" + ((sTime.patientInfo.Sex === 'M') ? 'Male' : 'Female') + " | " + sTime.startTime + " - " + sTime.endTime + " | " + appStatus;
                            }
                            // { id: '1', resourceId: 23, start: '2022-08-22T02:00:00', end: '2022-08-22T03:00:00', title: 'event 1' },
                            var start = $filter("date")(new Date(dayCounter), "yyyy-MM-ddTHH:mm:ss");
                            var end = $filter("date")(new Date(dayend), "yyyy-MM-ddTHH:mm:ss");
                            
                            if ($scope.IsIOJOrganization) {
                                var newtitle = title + '-' + patientMobile + '-' + '(' + sTime.VisitReason + ')';
                                if (sTime.appointmentStatus == "C") {
                                    newtitle = '<img src="img/appt-list/xmark-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + patientMobile + '-' + '(' + sTime.VisitReason + ')'
                                }
                                else if (sTime.appointmentStatus == "R") {
                                    newtitle = '<img src="img/appt-list/rescheduleIcon.jpg" width="12" style="margin-right:5px;"/>' + title + '-' + patientMobile + '-' + '(' + sTime.VisitReason + ')'
                                }
                                else {
                                    var isconfirmedappt = sTime.IsConfirmedAppointment || false;
                                    var isnoshowAppt = sTime.AppointmentStatusId;
                                    if (isconfirmedappt) {
                                        newtitle = '<img src="img/appt-list/check-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + patientMobile + '-' + '(' + sTime.VisitReason + ')';
                                    }
                                    if (sTime.AppointmentStatusId == 11 && sTime.BookingStatusId == 1) {
                                        newtitle = '<img src="img/appt-list/no-show-icon.svg" width="12" style="margin-right:5px;"/>' + '<img src="img/appt-list/check-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + patientMobile + '-' + '(' + sTime.VisitReason + ')';
                                    }
                                    if (sTime.AppointmentStatusId == 11 && sTime.BookingStatusId == 2) {
                                        newtitle = '<img src="img/appt-list/no-show-icon.svg" width="12" style="margin-right:5px;"/>' + title + '-' + patientMobile + '-' + '(' + sTime.VisitReason + ')';
                                    }
                                }
                            } else {
                                var newtitle = title + '-' + PatientMRNo + '-' + '(' + sTime.VisitReason + ')';
                                if (sTime.appointmentStatus == "C") {
                                    newtitle = '<img src="img/appt-list/xmark-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + PatientMRNo + '-' + '(' + sTime.VisitReason + ')'
                                }
                                else if (sTime.appointmentStatus == "R") {
                                    newtitle = '<img src="img/appt-list/rescheduleIcon.jpg" width="12" style="margin-right:5px;"/>' + title + '-' + PatientMRNo + '-' + '(' + sTime.VisitReason + ')'
                                }
                                else {
                                    var isconfirmedappt = sTime.IsConfirmedAppointment || false;
                                    var isnoshowAppt = sTime.AppointmentStatusId;
                                    if (isconfirmedappt) {
                                        newtitle = '<img src="img/appt-list/check-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + PatientMRNo + '-' + '(' + sTime.VisitReason + ')';
                                    }
                                    if (sTime.AppointmentStatusId == 11 && sTime.BookingStatusId == 1) {
                                        newtitle = '<img src="img/appt-list/no-show-icon.svg" width="12" style="margin-right:5px;"/>' + '<img src="img/appt-list/check-solid.svg" width="12" style="margin-right:5px;"/>' + title + '-' + PatientMRNo + '-' + '(' + sTime.VisitReason + ')';
                                    }
                                    if (sTime.AppointmentStatusId == 11 && sTime.BookingStatusId == 2) {
                                        newtitle = '<img src="img/appt-list/no-show-icon.svg" width="12" style="margin-right:5px;"/>' + title + '-' + PatientMRNo + '-' + '(' + sTime.VisitReason + ')';
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
                                "resourceId": booked.calendarList[j].slotList[k].doctorID,
                                "end": end,
                                "start": start,
                                "eventInfo": eventInfo,
                                "UserBranchId": userbranch,
                                "OptometristId": OpId,
                                "overallMaxSlotsCount": overallMaxSlotsCount,
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
                                "resourceId": booked.calendarList[j].slotList[k].doctorID,
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

                        console.log(item.visitReasonNoSlots);
                        item.visitReasonNoSlots = item.visitReasonNoSlots || [];

                        if (item.UserDayBreakSlots.length > 0) {
                            for (let l = 0; l < item.UserDayBreakSlots.length; l++) {
                                item.UserDayBreakSlots[l].UserScheduleOnlineBreakDetailId = item.UserDayBreakSlots[l].UserScheduleOnlineBreakDetailId || null;

                                var datefinalValue = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                                var appBgColor = "#b0b3b5",
                                    appFontColor = "#000";
                                let startTime = consultationDate + ' ' + item.UserDayBreakSlots[l].StartTime;
                                let endTime = consultationDate + ' ' + item.UserDayBreakSlots[l].EndTime;



                                var overallMaxSlotsCount = item.UserDayBreakSlots[l].MaximumOverAllSlots || 0;


                                let object = {
                                    "id": l + 1,
                                    "title": (item.UserDayBreakSlots[l].UserScheduleOnlineBreakDetailId === null) ? "Blocked" : "Break",
                                    "resourceId": item.DoctorId,
                                    "end": endTime,
                                    "start": startTime,
                                    "eventInfo": "",
                                    "color": appBgColor,
                                    "textColor": appFontColor,
                                    "allDay": false,
                                    "overallMaxSlotsCount": overallMaxSlotsCount,
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

                        if (item.visitReasonNoSlots.length > 0) {
                            for (let l = 0; l < item.visitReasonNoSlots.length; l++) {
                                item.visitReasonNoSlots[l].UserScheduleOnlineBreakDetailId = item.visitReasonNoSlots[l].UserScheduleOnlineBreakDetailId || null;

                                var datefinalValue = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                                var appBgColor = "#b0b3b5",
                                    appFontColor = "#000";
                                let startTime = consultationDate + ' ' + item.visitReasonNoSlots[l].StartTime;
                                let endTime = consultationDate + ' ' + item.visitReasonNoSlots[l].EndTime;



                                var overallMaxSlotsCount = item.visitReasonNoSlots[l].MaximumOverAllSlots || 0;


                                let object = {
                                    "id": l + 1,
                                    "title":"Blocked",
                                    "resourceId": item.DoctorId,
                                    "end": endTime,
                                    "start": startTime,
                                    "eventInfo": "",
                                    "color": appBgColor,
                                    "textColor": appFontColor,
                                    "allDay": false,
                                    "overallMaxSlotsCount": overallMaxSlotsCount,
                                    "SlotInfo": {
                                        "UserBranchId": item.UserBranchId,
                                        "DoctorId": item.DoctorId,
                                        "StartTime": startTime,
                                        "EndTime": endTime,
                                        "ConsultationDate": item.SlotDate,
                                        "UserScheduleId": item.visitReasonNoSlots[l].UserScheduleId,
                                        "UserScheduleDetailId": item.UserScheduleDetailId,
                                        "UserDayBreakSlotId": item.visitReasonNoSlots[l].UserDayBreakSlotId,
                                        "UserScheduleOnlineBreakDetailId": item.visitReasonNoSlots[l].UserScheduleOnlineBreakDetailId || null,
                                        "OrganizationId": item.OrganizationId,
                                        "BlockedRemarks": item.visitReasonNoSlots[l].BlockedRemarks || "",
                                        "UnBlockedRemarks": item.visitReasonNoSlots[l].UnBlockedRemarks || "",
                                        "ReasonforBlockSlot": item.visitReasonNoSlots[l].ReasonforBlockSlot || "",
                                        "BreakType": "BlockedSlots"
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



            onclickallDoctor();
        };

        $scope.ClosePopup = function () {
            //$uibModalInstance.dismiss("cancel");
            $uibModalInstance.close(Selectedobj.selectedAppt);
        };

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

        $scope.changeApptDoctor = function (obj) {

            $scope.Calendardoctorlist1 = $filter("filter")($scope.ClinicDoctorList, function (item) { return item.DoctorID === obj.DoctorID }, true);

            $scope.selectApptDocObj = angular.copy(obj);

            console.log($scope.Calendardoctorlist1);

        //    $scope.onclickPageLoad();
        }
        
        $scope.onSelectVisitReason = function (obj, Mainitem, Changevisit) {


            obj = obj || "";

            $scope.selectedVisitReasonObj = obj;
            if (obj.ReasonId !== "") {
                $scope.Visitreasons1 = $filter("filter")($scope.Visitreasons, function (item) { return item.ReasonId === obj.ReasonId }, true);

                $scope.selectedVisitReason = obj.Reason;
            }
        }
        $scope.filterSelectedDoctorsonCalendar = function () {
            $scope.evencalobj.IsShow = false;
            var temarray = [];

            temarray = $filter("filter")($scope.Calendardoctorlist1, function (item) { return item.isChecked === true }, true);
            temarray = temarray || [];
            $scope.ShowFilterView = true;

            eHnoteMasterDataService.addCalendarDoctorinAppList(temarray);
            if ($scope.PatientTagList1.length > 0) {
                let selectedpatientTagsList = $filter('filter')($scope.PatientTagList1, { 'IsChecked': true }, true);
                $scope.checkedtaglist = selectedpatientTagsList;
            }
            var obj = {
                "SelectedDoctorsList": temarray || [],
                "OPFromDate": $filter("date")(new Date($scope.SearchObj.ConsultationDt), "MM-dd-yyyy") || '',
                "BookingTypesArray": $scope.BookingTypesArray1 || [],
                "AppointmentStatusArray": $scope.AppointmentStatusArray1 || [],
                "BookedstatusFilterList": $scope.BookedstatusFilterList1 || [],
                "ProfileStatusList": $scope.ProfileStatusList1 || [],
                "selectedPatientTagList": $scope.checkedtaglist || [],

            };
            eHnoteMasterDataService.addSelectedOPUsers(obj);

            $scope.calendarView2 = "day"; // default button select for all doctors calendar
            $scope.$broadcast('allCalendarView');


            var checkedArray = _.where($scope.Calendardoctorlist1, { isChecked: true });
            checkedArray = checkedArray || [];
            if (checkedArray.length === 1) {
                $scope.doctoApptVistObj.IsShowDoctorVisit = true;
                $scope.selectedDoctor = checkedArray[0];

                console.log($scope.selectedDoctor);

                /* $scope.DoctorAppointmentVisitReasons = angular.copy($scope.DoctorAppointmentVisitReasonsFromService);*/

                $scope.GetDoctorAppointmentVisitReasons();
            } else {
                $scope.doctoApptVistObj.IsShowDoctorVisit = false;
                $scope.DoctorAppointmentVisitReasons = [];
            }
            $scope.searchHospital.apptTypename = "";
            $scope.searchHospital.visitRsnName = "";
            $scope.doctorslist.SearchText = "";
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

                $scope.selectedVisitReason = 'All Visit Reasons';
            }
            var checkedArray = _.where($scope.Visitreasons, { isChecked: true });
            $scope.AllDoctorsObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.Visitreasons.length === checkedArray.length ? true : false;



        };
        $scope.VisitRsnToggle = function (item) {
            var checkedArray = _.where($scope.Visitreasons, { isChecked: true });
            $scope.AllDoctorsObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.Visitreasons.length === checkedArray.length ? true : false;

        };
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
        };
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
                                /*$scope.filterSelectedDoctorsonCalendar();*/
                                $scope.onclickPageLoad();
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
                                //$scope.filterSelectedDoctorsonCalendar();
                                $scope.onclickPageLoad();
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
        $scope.DoctorBlockedSlotsLogPopover = {
            templateUrl: 'DoctorBlockedSlotsLogPopover.html',
        };
        $scope.GetBlockedSlotsLog = function (obj) {

            $scope.BlockedSlotsLogArray = [];
            let BlockedSlotStartTime = $filter('date')(new Date(obj.StartTime), "HH:mm");
            let BlockedSlotEndTime = $filter('date')(new Date(obj.EndTime), "HH:mm");
            let SlotDate = $filter('date')(obj.date, "yyyy-MM-dd");
            let req = {
                "DoctorId": obj.DoctorId,
                "SlotDate": SlotDate,
                "StartTime": BlockedSlotStartTime,
                "EndTime": BlockedSlotEndTime,
                "Status": "Blocked"
            };
            eHnoteMainAppointmentService.GetDoctorBlockedSlotsLog(req).then(function (resp) {
                if (resp.data.status === "Success") {

                    $scope.BlockedSlotsLogArray = angular.copy(resp.data.rows);
                    angular.forEach($scope.BlockedSlotsLogArray, function (item) {
                        let startTime = item.SlotDate + " " + item.StartTime;
                        item.StartTime = $filter('date')(new Date(startTime), "hh:mm a");

                        let endTime = item.SlotDate + " " + item.EndTime;
                        item.EndTime = $filter('date')(new Date(endTime), "hh:mm a");

                        item.ModifiedDt = $filter('date')(item.ModifiedDt, "MM-dd-yyyy hh:mm a");
                    });
                }
            }, function () {

            });
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
  

        $scope.onclickPageLoad();


        $scope.ClearFilters = function () {
          
            $scope.Visitreasons1 = [];
            $scope.selectApptDocObj = {};
            $scope.selectApptDocObj.DoctorID = 0;
            $scope.selectedVisitReason = '';
            $scope.selectApptDocObj.SecondUserFullName = '';
            $scope.ConsultationDt = $filter("date")(Selectedobj.selectedAppt.AppointmentDate, "MM-dd-yyyy");
            if ($scope.RoleId === 1 || $scope.RoleId === 43) {
                $scope.ConsultationDt = $filter("date")(Selectedobj.selectedAppt.AppointmentDate, "MM-dd-yyyy");
                //let UserId = eHnoteMasterDataService.getLoginId();
                //$scope.Calendardoctorlist1 = $filter("filter")($scope.ClinicDoctorList, function (item) { return item.DoctorID === UserId }, true);
                //if ($scope.Calendardoctorlist1.length > 0) {
                //    let obj = angular.copy($scope.Calendardoctorlist1[0]);
                //    $scope.selectApptDocObj = obj;
                ////    $scope.$digest();
                //}
                $scope.Calendardoctorlist1 = $filter("filter")($scope.ClinicDoctorList, function (item) { return item.DoctorID === Selectedobj.selectedAppt.DocObj.DoctorID }, true);

                $scope.selectApptDocObj = angular.copy(Selectedobj.selectedAppt.DocObj) || '';
                $scope.onclickPageLoad();
            }
            $('#calendarFull').fullCalendar('destroy');
            calendar.destroy();
        }
        $scope.applyFilters = function () {
            angular.forEach($scope.Calendardoctorlist1, function (citem) {
                citem.ApptsCount = 0;
            });
            console.log($scope.Calendardoctorlist1);
            $scope.selectApptDocObj.DoctorID = $scope.selectApptDocObj.DoctorID || 0;
            if ($scope.selectApptDocObj.DoctorID == 0) {
                alertify.error('Please Select Doctor!');
                return false;
            }
            $('#calendarFull').fullCalendar('destroy');
            calendar.destroy();
            $scope.onclickPageLoad();
        };
}]);
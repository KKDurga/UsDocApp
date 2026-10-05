eHnoteWebApp.controller("UsPatientCommunicationMainCtrl", ["$scope", "$rootScope", "eHnoteMasterDataService", "eHnotePatientAddressDataServices", "$filter", "alertify", "eHnoteLoginStatusService", "$uibModal", "eHnoteAuditServices", "eHnotePatientDataService", "eHnoteCacheStorageService", "datapersistanceFactory", "$location", "eHnoteDiagnosisDataServices", "$timeout", "$interval", "eHnoteInsuranceService", "datacookieFactory", "localStorageFactory", "eHnoteReferalDataService", "eHnoteUserAppointmentDataService", "eHnoteMainAppointmentService", "eHnoteDbStaticDataService", "$q", "eHnoteSettingsDataService", "eHnoteOrgReferralDataServices", "loginCookieFactory", "DeCodeFilter", "Lightbox", "eHnoteProcedureDataService", "USPrintService", "eHnotePatientVisitReasonServices", "eHnoteSurgeryService", "$window", "eHnoteMainAdminServices", "eHnoteUserDataService", "eHnotePrintService", "$translate", function ($scope, $rootScope, eHnoteMasterDataService, eHnotePatientAddressDataServices, $filter, alertify, eHnoteLoginStatusService, $uibModal, eHnoteAuditServices, eHnotePatientDataService, eHnoteCacheStorageService, datapersistanceFactory, $location, eHnoteDiagnosisDataServices, $timeout, $interval, eHnoteInsuranceService, datacookieFactory, localStorageFactory, eHnoteReferalDataService, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnoteDbStaticDataService, $q, eHnoteSettingsDataService, eHnoteOrgReferralDataServices, loginCookieFactory, DeCodeFilter, Lightbox, eHnoteProcedureDataService, USPrintService, eHnotePatientVisitReasonServices, eHnoteSurgeryService, $window, eHnoteMainAdminServices, eHnoteUserDataService, eHnotePrintService, $translate) {

    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.RoleId = $scope.userLoginDetails.RoleID;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
   

    $scope.ParentHospitalId = 0;
    $scope.HospitalId = 0;
    var FollowupArray = [
        {
            "FollowUpIndicatorId": 1,
            "FollowUpIndicator": 'All',
        },
        {
            "FollowUpIndicatorId": 2,
            "FollowUpIndicator": 'Required',
        },
        {
            "FollowUpIndicatorId": 3,
            "FollowUpIndicator": 'NotRequired',
        }
    ];
    $scope.FollowupArraylist = angular.copy(FollowupArray);
    $scope.today = new Date();
    $scope.GetFilterobj = function () {
        return {
            "CommunicationDate": "",
            //"CommunicationTime": "",
            //"PatientCommunicationId": 0,
            "ModeOfInteractionId": 0,
            "FollowUpIndicatorId": 1,
            "FollowUpIndicator": 'All',
            "ModeOfInteraction": "",
            "ReasonId": 0,
            "ReasonName": "",
            "ModifiedByUserId": 0,
            "PageNumber": 1,
            "PageSize": 10,
        //"IsFollowUpRequired":false,
        //"Notes":"",
        }
    };
    $scope.Filterobj = angular.copy($scope.GetFilterobj());

    if (doctorinfo !== undefined) {
        $scope.orgUsersData = doctorinfo.doctordata.UserAddress;
        if ($scope.orgUsersData !== undefined) {
            if ($scope.orgUsersData[0] !== undefined) {
                $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            }
        }
    }

    console.log($scope.mainPatientProfileObj);
    $scope.CommuncationDetailspageChanged = function (page) {
        $scope.Filterobj.PageNumber = page;
        $scope.GetPatientCommunicationDetails();
    }

    $scope.ChangeModeOfInteractions = function (item) {
        angular.forEach($scope.FiltersModeOfInteractionsArray, function (mitem) {
            if (mitem.ModeOfInteractionId == item) {
                $scope.Filterobj.ModeOfInteraction = mitem.ModeOfInteraction;
                $scope.Filterobj.ModeOfInteractionId = mitem.ModeOfInteractionId;
            }
        });
        $scope.Filterobj.CommunicationDate = '';
    }
    $scope.ChangeCommunicationReasons = function (item) {
        angular.forEach($scope.FiltersCommunicationReasonsArray, function (mitem) {
            if (mitem.ReasonId == item) {
                $scope.Filterobj.ReasonName = mitem.ReasonName;
                $scope.Filterobj.ReasonId = mitem.ReasonId;
            }
        });
        $scope.Filterobj.CommunicationDate = '';
    }
    $scope.ChangeModifiedUsers = function (item) {
        angular.forEach($scope.MultiselectDoctorlist, function (mitem) {
            if (mitem.DoctorID == item) {
              //  $scope.Filterobj.ModeOfInteraction = mitem.ModeOfInteraction;
                $scope.Filterobj.ModifiedByUserId = mitem.DoctorID;
            }
        });
        $scope.Filterobj.CommunicationDate = '';
    }
    $scope.Changedate = function () {
        $scope.Filterobj.ReasonId = 0;
        $scope.Filterobj.ModeOfInteractionId = 0;
        $scope.Filterobj.ModifiedByUserId = 0;
        $scope.Filterobj.FollowUpIndicatorId = 1;
    }
    $scope.ChangeFollowup = function (item) {
        angular.forEach($scope.FollowupArraylist, function (mitem) {
            if (mitem.FollowUpIndicatorId == item) {
                $scope.Filterobj.FollowUpIndicator = mitem.FollowUpIndicator;
                $scope.Filterobj.FollowUpIndicatorId = mitem.FollowUpIndicatorId;
            }
        });
        $scope.Filterobj.CommunicationDate = '';
    }
    $scope.Reset = function (type) {
        if (type == 'date') {
            $scope.Filterobj.CommunicationDate = '';
            $scope.Filterobj.ReasonId =0;
            $scope.Filterobj.ModeOfInteractionId =0;
            $scope.Filterobj.ModifiedByUserId =0;
            $scope.Filterobj.FollowUpIndicatorId = 1;
            $scope.Filterobj.FollowUpIndicator = 'All';
        }
        else if (type == 'filter') {
            $scope.Filterobj.ReasonId = 0;
            $scope.Filterobj.ModeOfInteractionId = 0;
            $scope.Filterobj.ModifiedByUserId = 0;
            $scope.Filterobj.FollowUpIndicatorId  = 1;
            $scope.Filterobj.FollowUpIndicator  = 'All';
        }
        $scope.GetPatientCommunicationDetails();
    }
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }
    $scope.init = function () {
        $scope.PatientCommunicationDetailsArray = [];
        $scope.CommunicationReasonsArray = [];
         $scope.ModeOfInteractionsArray = [];
        $scope.FiltersCommunicationReasonsArray = [];
        $scope.FiltersModeOfInteractionsArray = [];
        $scope.MultiselectDoctorlist = [];
        let Communicatiodate = $filter('date')($scope.Filterobj.CommunicationDate, 'yyyy-MM-dd') || null;
        let params = {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "CommunicationDate": "",
            "ModeOfInteractionId": 0,
            "ReasonId": 0,
            "FollowUpIndicator": "All",
            "ModifiedByUserId": 0,
            "PageSize": 10,
            "PageNumber": 1
        };


        if ($scope.allUserList.length > 0) {

            angular.forEach($scope.allUserList, function (kitem) {
                if (kitem.RoleId === 1 || kitem.RoleId === 43) {
                    kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.SecondUserFullName;
                    $scope.MultiselectDoctorlist.push(kitem);
                }
            });
            $scope.MultiselectDoctorlist.push({
                DoctorID: 0,
                SecondUserFullName: "All"
            });
        }
        $q.all([
            eHnoteMainAppointmentService.GetPatientCommunicationDetails(params),
            eHnoteSettingsDataService.GetPatientRelatedMasterData()
        ]).then(function (resp) {
            if (resp[0].data.rows.length > 0) {
                $scope.PatientCommunicationDetailsArray = angular.copy(resp[0].data.rows) || [];
                if ($scope.PatientCommunicationDetailsArray.length > 0) {
                    angular.forEach($scope.PatientCommunicationDetailsArray, function (mitem) {
                        let dummydate = "2024-01-01";
                        let dummydatetime = dummydate + " " + mitem.CommunicationTime;
                        mitem.CommunicationTime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                    });
                }
                $scope.totalItems = resp[0].data.count;
            }
            if (resp[1].data.status === "Success") {
                if (resp[1].data.CommunicationReasons.length != 0) {
                    $scope.CommunicationReasonsArray = angular.copy(resp[1].data.CommunicationReasons) || [];
                    $scope.FiltersCommunicationReasonsArray = angular.copy(resp[1].data.CommunicationReasons) || [];
                    $scope.FiltersCommunicationReasonsArray.push({
                        ReasonId: 0,
                        ReasonName: "All"
                    });
                }
                if (resp[1].data.ModeOfInteractions.length != 0) {
                    $scope.ModeOfInteractionsArray = angular.copy(resp[1].data.ModeOfInteractions) || [];
                    $scope.FiltersModeOfInteractionsArray = angular.copy(resp[1].data.ModeOfInteractions) || [];
                    $scope.FiltersModeOfInteractionsArray.push({
                        ModeOfInteractionId: 0,
                        ModeOfInteraction: "All"
                    });
                }
            }
        });
    }
    $scope.init();


    $scope.mainCommunicationObj = {
        "MainTab":1
    };
    $scope.GetPatientCommunicationDetails = function (type) {
        //$scope.CommunicationReasonsArray = [];
        //$scope.ModeOfInteractionsArray = [];
        type = type || '';
        let Communicatiodate = $filter('date')($scope.Filterobj.CommunicationDate, 'yyyy-MM-dd') || "";
    
        var params = {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "CommunicationDate": Communicatiodate|| "",
            "ModeOfInteractionId": $scope.Filterobj.ModeOfInteractionId|| 0,
            "ReasonId": $scope.Filterobj.ReasonId|| 0,
            "FollowUpIndicator": $scope.Filterobj.FollowUpIndicator || "All",
            "ModifiedByUserId": $scope.Filterobj.ModifiedByUserId|| 0,
            "PageSize": $scope.Filterobj.PageSize||10,
            "PageNumber": (type == 'cal') ? 1: $scope.Filterobj.PageNumber
              
               
        }
        eHnoteMainAppointmentService.GetPatientCommunicationDetails(params).then(function (resp) {
            $scope.PatientCommunicationDetailsArray = [];
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.PatientCommunicationDetailsArray = resp.data.rows || [];
                    if ($scope.PatientCommunicationDetailsArray.length > 0) {
                        angular.forEach($scope.PatientCommunicationDetailsArray, function (mitem) {
                            let dummydate = "2024-01-01";
                            let dummydatetime = dummydate + " " + mitem.CommunicationTime;
                            mitem.CommunicationTime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                        });
                    }
                    $scope.totalItems = resp.data.count;
                }
            }

        }, function (err) {
            alertify.error("Getting Data Failed");
        });

    };

    /* ---------------- Call History tab (Telnyx, this patient only) ---------------- */

    // Call History is Telnyx-only: hide it when this user has no calling credential,
    // or when an admin has deactivated it. Communication stays available either way.
    $scope.showCallHistoryTab = function () {
        return !!$rootScope.telnyxUserAuthAvailable && $rootScope.telnyxCredentialActive !== false;
    };

    // deactivated while the user is sitting on Call History -> fall back to Communication
    $scope.$watch($scope.showCallHistoryTab, function (canShow) {
        if (!canShow && $scope.mainCommunicationObj.MainTab === 2) {
            $scope.mainCommunicationObj.MainTab = 1;
        }
    });

    $scope.switchCommunicationTab = function (tab) {
        if (tab === 2 && !$scope.showCallHistoryTab()) { return; }
        $scope.mainCommunicationObj.MainTab = tab;
        if (tab === 2 && !$scope.callHistoryLoaded) {
            $scope.GetPatientCallHistory();
        }
    };

    $scope.GetCallHistoryFilterobj = function () {
        return {
            "CallStatusId": 0,
            "Direction": "",
            "FilterKey": "all",
            "FromDate": null,
            "ToDate": null,
            "PageNumber": 1,
            "PageSize": 10
        };
    };
    $scope.callHistoryFilterobj = angular.copy($scope.GetCallHistoryFilterobj());
    $scope.PatientCallHistoryArray = [];
    $scope.callHistoryStats = {};
    $scope.callHistoryTotalItems = 0;
    $scope.callHistoryLoaded = false;

    // A refresh nobody asked for must not take the screen over. These three keep it
    // out of the way: one request at a time, no loader overlay, and it gives up after
    // a few failures instead of retrying behind a screen that looks fine.
    var callHistoryInFlight = false;
    var callHistoryPollFailures = 0;
    var CALL_HISTORY_MAX_POLL_FAILURES = 3;

    // The range picker hands back Date objects. The proc parses the dates out of the
    // request JSON, so send an unambiguous yyyy-MM-dd rather than whatever the
    // browser serialises a Date to - an ISO string carries a UTC time with it and
    // would move the day for anyone east or west of UTC.
    function callHistoryDateParam(dt) {
        return dt ? $filter('date')(dt, 'yyyy-MM-dd') : null;
    }

    // True while a row has its recording panel open. The rows are replaced wholesale
    // on every reload, which tears the <audio> element out of the page and stops
    // playback, so a reload waits while someone is listening.
    function hasOpenRecording() {
        var open = false;
        angular.forEach($scope.PatientCallHistoryArray, function (c) {
            if (c.showRec) { open = true; }
        });
        return open;
    }

    // opts.background - a refresh the user did not ask for (after a call, the poll,
    // coming back to the window). It carries loaderStatus, which is what stops the
    // http interceptor throwing the full-screen loader up, and it fails quietly.
    $scope.GetPatientCallHistory = function (opts) {
        opts = opts || {};
        if (opts.background && callHistoryInFlight) { return; }

        // Carry an open panel across the reload, so a refresh triggered by something
        // else does not close it under the user.
        var openRecordings = {};
        angular.forEach($scope.PatientCallHistoryArray, function (old) {
            if (old.showRec) { openRecordings[old.CallLogId] = old; }
        });

        var params = {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "HospitalId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "CallStatusId": $scope.callHistoryFilterobj.CallStatusId || 0,
            "Direction": $scope.callHistoryFilterobj.Direction || "",
            "FromDate": callHistoryDateParam($scope.callHistoryFilterobj.FromDate),
            "ToDate": callHistoryDateParam($scope.callHistoryFilterobj.ToDate),
            "PageNumber": $scope.callHistoryFilterobj.PageNumber || 1,
            "PageSize": $scope.callHistoryFilterobj.PageSize || 10
        };
        // The interceptor shows the loader for any request without this key, whatever
        // its value - so it goes on the background refreshes only.
        if (opts.background) { params.loaderStatus = false; }

        callHistoryInFlight = true;
        eHnoteMainAppointmentService.GetPatientTelnyxCallHistory(params).then(function (resp) {
            callHistoryInFlight = false;
            callHistoryPollFailures = 0;
            $scope.callHistoryLoaded = true;
            $scope.PatientCallHistoryArray = [];
            var d = resp.data || {};
            if (d.Status === "Success" || d.status === "Success") {
                $scope.PatientCallHistoryArray = d.rows || [];
                angular.forEach($scope.PatientCallHistoryArray, function (c) {
                    // the proc returns UTC without the zone marker
                    c.StartTime = c.StartTime ? c.StartTime + 'Z' : c.StartTime;
                    // the number to call back = the patient side of the call
                    c.ContactNumber = c.ContactNumber ||
                        (c.Direction === 'outgoing' ? c.ToNumber : c.FromNumber);

                    var wasOpen = openRecordings[c.CallLogId];
                    if (wasOpen) {
                        c.showRec = true;
                        c.recState = wasOpen.recState;
                        c.recordings = wasOpen.recordings;
                    }
                });
                // TotalCount is the pill-filtered count - it drives the pager, which
                // has to page the rows the list is actually showing.
                $scope.callHistoryTotalItems = parseInt(d.TotalCount, 10) || 0;
                // The cards summarise the whole date range instead, so they keep
                // describing the range while the pills narrow the list underneath.
                // Each card then equals the rows its own pill lists for that range.
                // StatTotal is absent until the proc ships - fall back to the old
                // filtered count rather than showing nothing.
                $scope.callHistoryStats = {
                    Total: parseInt(d.StatTotal, 10) || $scope.callHistoryTotalItems,
                    Answered: parseInt(d.AnsweredCount, 10) || 0,
                    Missed: parseInt(d.MissedCount, 10) || 0,
                    // one pill per status the proc can write, so no call falls
                    // through the gaps between them
                    NoAnswer: parseInt(d.NoAnswerCount, 10) || 0,
                    Busy: parseInt(d.BusyCount, 10) || 0,
                    Cancelled: parseInt(d.CancelledCount, 10) || 0,
                    Failed: parseInt(d.FailedCount, 10) || 0,
                    Incoming: parseInt(d.IncomingCount, 10) || 0,
                    Outgoing: parseInt(d.OutgoingCount, 10) || 0,
                    AvgTalkText: d.AvgTalkText || '0s',
                    TotalTalkText: d.TotalTalkText || '0s'
                };
            }
        }, function (err) {
            callHistoryInFlight = false;
            $scope.callHistoryLoaded = true;
            if (opts.background) {
                // Network dropped, or the API is down. Nobody asked for this request,
                // so nobody gets a toast about it - count it instead, and stop after a
                // few in a row. Anything the user does, or the next call, starts the
                // refreshes again.
                callHistoryPollFailures++;
                return;
            }
            alertify.error("Getting Call History Failed");
        });
    };

    // A call just ended somewhere in the app - reload with the current filters so the
    // new row and the cards show without switching tabs. Not loaded yet means the tab
    // has not been opened; it fetches fresh when it is.
    //
    // Back to the first page as well: the new row sorts to the top, so a user sitting
    // on page 3 would otherwise be shown the same page again and conclude the call was
    // never logged. The pill stays as they set it.
    function refreshCallHistoryAfterCall() {
        if (!$scope.callHistoryLoaded) { return; }
        callHistoryPollFailures = 0;   // a call just happened - worth trying again
        $scope.callHistoryFilterobj.PageNumber = 1;
        $scope.GetPatientCallHistory({ background: true });
    }
    var stopCallEndedListener = $rootScope.$on('telnyxCallEnded', refreshCallHistoryAfterCall);

    // Calls this browser never took part in - answered by another user, placed from a
    // desk phone, or handled by the Voice AI - raise no event here at all, so the tab
    // polls as well. Only while Call History is the tab in front of the user and the
    // window is actually visible, so a backgrounded tab costs nothing.
    // A minute is slow enough that nobody watching the network tab would call it
    // chatty, and quick enough that a call taken elsewhere shows up before the user
    // thinks to refresh. The refreshes right after a call are what make it feel
    // immediate; this only catches what those cannot see.
    var CALL_HISTORY_POLL_MS = 60000;
    var callHistoryPoll = $interval(function () {
        if ($scope.mainCommunicationObj.MainTab !== 2) { return; }
        if (!$scope.callHistoryLoaded) { return; }
        if (document.hidden) { return; }
        if (hasOpenRecording()) { return; }
        // Offline: the interceptor would put up its own "check your internet
        // connectivity" message once a minute, for a request nobody asked for.
        if (!navigator.onLine) { return; }
        if (callHistoryPollFailures >= CALL_HISTORY_MAX_POLL_FAILURES) { return; }
        $scope.GetPatientCallHistory({ background: true });
    }, CALL_HISTORY_POLL_MS);

    // Coming back to the window should not cost a whole poll interval.
    function onCallHistoryWindowFocus() {
        if (document.hidden) { return; }
        if ($scope.mainCommunicationObj.MainTab !== 2 || !$scope.callHistoryLoaded) { return; }
        if (hasOpenRecording()) { return; }
        if (!navigator.onLine) { return; }
        callHistoryPollFailures = 0;   // the user is back - worth trying again
        $scope.$evalAsync(function () { $scope.GetPatientCallHistory({ background: true }); });
    }
    document.addEventListener('visibilitychange', onCallHistoryWindowFocus);
    $window.addEventListener('focus', onCallHistoryWindowFocus);

    $scope.$on('$destroy', function () {
        stopCallEndedListener();
        $interval.cancel(callHistoryPoll);
        document.removeEventListener('visibilitychange', onCallHistoryWindowFocus);
        $window.removeEventListener('focus', onCallHistoryWindowFocus);
    });

    // The pill a user clicks maps to either a direction or a status, never both.
    // Ids are the ones tblMasterCallStatus uses: 1 Ringing, 2 Answered, 3 Missed,
    // 4 No Answer, 5 Busy, 6 Failed, 7 Cancelled.
    var CALL_HISTORY_STATUS_BY_KEY = {
        answered: 2,
        missed: 3,
        noanswer: 4,
        busy: 5,
        failed: 6,
        cancelled: 7
    };

    $scope.setCallHistoryFilter = function (key) {
        $scope.callHistoryFilterobj.FilterKey = key;
        $scope.callHistoryFilterobj.Direction =
            (key === 'incoming') ? 'incoming' :
                (key === 'outgoing') ? 'outgoing' : "";
        $scope.callHistoryFilterobj.CallStatusId = CALL_HISTORY_STATUS_BY_KEY[key] || 0;
        $scope.callHistoryFilterobj.PageNumber = 1;
        $scope.GetPatientCallHistory();
    };

    $scope.applyCallHistoryFilter = function () {
        $scope.callHistoryFilterobj.PageNumber = 1;
        $scope.GetPatientCallHistory();
    };

    $scope.callHistoryPageChanged = function (page) {
        $scope.callHistoryFilterobj.PageNumber = page;
        $scope.GetPatientCallHistory();
    };

    $scope.ResetCallHistory = function () {
        $scope.callHistoryFilterobj = angular.copy($scope.GetCallHistoryFilterobj());
        $scope.GetPatientCallHistory();
    };

    // Call recording: toggle an inline player under the row, the same way the Call
    // Center list does it. The audio is fetched only when a row is opened - a list of
    // 25 rows would otherwise ask Telnyx for 25 links nobody asked to hear.
    // c.recState: undefined -> 'loading' -> 'ready' | 'none' | 'error'
    $scope.togglePatientRecording = function (c) {
        if (c.showRec) { c.showRec = false; return; }
        c.showRec = true;
        if (c.recState === 'ready') { return; }

        c.recState = 'loading';
        var params = { "HospitalId": $scope.HospitalId, "CallLogId": c.CallLogId };
        eHnoteMainAppointmentService.GetTelnyxCallRecordings(params).then(function (resp) {
            var d = resp.data || {};
            c.recordings = d.Recordings || [];
            c.recState = (d.Status !== "Success" && d.status !== "Success") ? 'error'
                : (c.recordings.length ? 'ready' : 'none');
        }, function () {
            c.recState = 'error';
        });
    };

    // same look as the Call Center list. Cancelled and Busy read differently to the
    // user - one is our doing, one is theirs - so they do not share Failed's styling.
    $scope.chDotClass = function (c) {
        if (c.CallStatusId === 2) return c.Direction === 'outgoing' ? 'dot-out' : 'dot-answered';
        if (c.CallStatusId === 3) return 'dot-missed';
        if (c.CallStatusId === 5) return 'dot-busy';
        if (c.CallStatusId === 7) return 'dot-cancelled';
        if (c.CallStatusId >= 4) return 'dot-noanswer';
        return '';
    };
    $scope.chDotIcon = function (c) {
        if (c.CallStatusId === 2) return 'fa-phone';
        if (c.CallStatusId === 7) return 'fa-ban';
        return 'fa-phone-slash';
    };
    $scope.chBadgeClass = function (c) {
        if (c.CallStatusId === 2) return 'badge-answered';
        if (c.CallStatusId === 3) return 'badge-missed';
        if (c.CallStatusId === 5) return 'badge-busy';
        if (c.CallStatusId === 7) return 'badge-cancelled';
        if (c.CallStatusId >= 4) return 'badge-noanswer';
        return '';
    };

    $scope.fmtCallPhone = function (num) {
        if (!num) return '';
        var digits = ('' + num).replace(/\D/g, '');
        if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.substring(1);
        if (digits.length !== 10) return num;
        return '(' + digits.substring(0, 3) + ') ' + digits.substring(3, 6) + '-' + digits.substring(6);
    };

    // Call back - handled by EhnoteTelnyxCallingCtrl, which owns the Telnyx client
    $scope.callBackFromHistory = function (c) {
        var number = c.ContactNumber || (c.Direction === 'outgoing' ? c.ToNumber : c.FromNumber);
        if (!number) { alertify.error('No number available for this call'); return; }
        if (!$scope.showCallHistoryTab()) {
            alertify.error('Your calling access is not active.');
            return;
        }
        if (!$rootScope.telnyxUserAuthAvailable) {
            alertify.error('Please go online in the Call Center to place a call');
            return;
        }
        $rootScope.$broadcast('telnyxDialNumber', {
            Number: number,
            PatientId: c.MatchedPatientId || $scope.cacheStorageItem.PatientID,
            PatientName: c.PatientName || '',
            PatientMRN: c.PatientMRN || '',
            PatientDOB: c.PatientDOB || '',
            CallLogId: c.CallLogId,
            IsMissed: (c.CallStatusId === 3)
        });
    };

    // Add a communication log straight from a call row
    $scope.AddLogFromCall = function (c) {
        $scope.openAddNewLogPopup();
    };

    $scope.DeletePatientCommuncation = function (item) {
        var params = {
            "UserId": doctorinfo.doctorid,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PatientCommunicationId": item.PatientCommunicationId||0,
            "PatientId": $scope.cacheStorageItem.PatientID,
            "CommunicationDate": item.CommunicationDate || '',
            "CommunicationTime": item.CommunicationTime || '',
            "ModeOfInteractionId": item.ModeOfInteractionId||null,
            "ModeOfInteraction": item.ModeOfInteraction || "",
            "ReasonId": item.ReasonId||null,
            "ReasonName": item.ReasonName || "",
            "IsFollowUpRequired": item.IsFollowUpRequired || false,
            "DeleteInd": "Y",
            "Notes": item.Notes
        }
        eHnoteMainAppointmentService.AddUpdatePatientCommunicationDetails(params).then(function (resp) {
            if (resp.data.status === "Success") {
                console.log(resp);
                alertify.success("Deleted Successfully.")
                $scope.Filterobj = angular.copy($scope.GetFilterobj());
                $scope.GetPatientCommunicationDetails();
            }
        }, function (err) {
            console.log(err);
        });

    }
    $scope.openAddNewLogPopup = function (item) {
        item = item || '';
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/addNewLog.html",
            "backdrop": "static",
            //"scope": $scope,
            "size": "lg",
            "windowClass": "zindexpopup",
            "keyboard": false,
            "resolve": {

                "cacheStorageItem": function () { return $scope.cacheStorageItem },
                "appointmentinfo": function () { return $scope.appointmentinfo },
                "editedarray": function () { return item },
                "CommunicationReasonsArray": function () { return $scope.CommunicationReasonsArray },
                "ModeOfInteractionsArray": function () { return $scope.ModeOfInteractionsArray },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMasterDataService, eHnoteSettingsDataService, eHnoteMainAppointmentService, cacheStorageItem, appointmentinfo, editedarray, CommunicationReasonsArray, ModeOfInteractionsArray) {
                var doctorinfo = eHnoteMasterDataService.getUserInfo();
                var cacheStorageItem = cacheStorageItem || "";
                var appointmentinfo = appointmentinfo || "";
                $scope.ModeOfInteractionsArray = ModeOfInteractionsArray || [];
                $scope.CommunicationReasonsArray = CommunicationReasonsArray || [];
                var editedarray = editedarray || "";
                $scope.Newlogobj = {
                    "CommunicationDate": "",
                    "CommunicationTime": "",
                    "PatientCommunicationId": 0,
                    "ModeOfInteractionId": null,
                    "ModeOfInteraction": "",
                    "ReasonId": null,
                    "ReasonName": "",
                    "IsFollowUpRequired": false,
                    "Notes": "",
                };
                if (editedarray != '') {
                    $scope.Newlogobj.CommunicationDate = $filter("date")(editedarray.CommunicationDate, "MM-dd-yyyy") || '';
                    $scope.Newlogobj.CommunicationTime = editedarray.CommunicationTime || '';
                    $scope.Newlogobj.IsFollowUpRequired = editedarray.IsFollowUpRequired || false;
                    $scope.Newlogobj.Notes = editedarray.Notes || '';
                    $scope.Newlogobj.PatientCommunicationId = editedarray.PatientCommunicationId || 0;
                    angular.forEach($scope.ModeOfInteractionsArray, function (mitem) {
                        if (mitem.ModeOfInteractionId == editedarray.ModeOfInteractionId) {
                            $scope.Newlogobj.ModeOfInteraction = mitem.ModeOfInteraction;
                            $scope.Newlogobj.ModeOfInteractionId = mitem.ModeOfInteractionId;
                        }
                    });
                    angular.forEach($scope.CommunicationReasonsArray, function (mitem) {
                        if (mitem.ReasonId == editedarray.ReasonId) {
                            $scope.Newlogobj.ReasonName = mitem.ReasonName;
                            $scope.Newlogobj.ReasonId = mitem.ReasonId;
                        }
                    });
                }
               

           
               // $scope.Newlogobj.CommunicationDate = $filter('date')(new Date(), 'MM-dd-yyyy'); // Default time

                $scope.GetCommunicationTime = function () {
                    $scope.Newlogobj.CommunicationTime = $filter('date')(new Date(), 'HH:mm a');
                   
                };
                $scope.ChangeModeOfInteractions = function (item) {
                    angular.forEach($scope.ModeOfInteractionsArray, function (mitem) {
                        if (mitem.ModeOfInteractionId == item) {
                            $scope.Newlogobj.ModeOfInteraction = mitem.ModeOfInteraction;
                            $scope.Newlogobj.ModeOfInteractionId = mitem.ModeOfInteractionId;
                        }
                    });
                }
                $scope.ChangeCommunicationReasons = function (item) {
                    angular.forEach($scope.CommunicationReasonsArray, function (mitem) {
                        if (mitem.ReasonId == item) {
                            $scope.Newlogobj.ReasonName = mitem.ReasonName;
                            $scope.Newlogobj.ReasonId = mitem.ReasonId;
                        }
                    });
                }
                $scope.SaveNewlog = function () {
                    if ($scope.Newlogobj.CommunicationDate == '') {
                        alertify.error("Please select Date of Interaction");
                        return false;
                    }
                    if ($scope.Newlogobj.CommunicationTime == '') {
                        alertify.error("Please select Time");
                        return false;
                    }

                    var params = {
                        "UserId": doctorinfo.doctorid,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "PatientCommunicationId": $scope.Newlogobj.PatientCommunicationId || 0,
                        "PatientId":cacheStorageItem.PatientID,
                        "CommunicationDate": $scope.Newlogobj.CommunicationDate||'',
                        "CommunicationTime": $scope.Newlogobj.CommunicationTime|| '',
                        "ModeOfInteractionId": $scope.Newlogobj.ModeOfInteractionId||null,
                        "ModeOfInteraction": $scope.Newlogobj.ModeOfInteraction||"",
                        "ReasonId": $scope.Newlogobj.ReasonId||null,
                        "ReasonName": $scope.Newlogobj.ReasonName||"",
                        "IsFollowUpRequired": $scope.Newlogobj.IsFollowUpRequired||false,
                        "DeleteInd": "N",
                        "Notes": $scope.Newlogobj.Notes
                    }
                    eHnoteMainAppointmentService.AddUpdatePatientCommunicationDetails(params).then(function (resp) {
                        if (resp.data.status === "Success") {
                             console.log(resp);
                            //$scope.GetOrganizationPreOpMedications();
                            //item.IsFrequent = Frequentval
                        }
                        $uibModalInstance.close("save");
                    }, function (err) {
                        console.log(err);
                    });

                }




                $scope.ClosePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
        $scope.mInstanceAdd.result.then(function (result) {
            $scope.GetPatientCommunicationDetails();

        }, function (cancel) {
        });

    }
 
}]);



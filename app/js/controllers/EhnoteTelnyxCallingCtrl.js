"use strict";
eHnoteWebApp.controller('EhnoteTelnyxCallingCtrl', function ($scope, $rootScope, $timeout, $location, $filter, $interval, $uibModal, alertify, $q, eHnoteMainAppointmentService, eHnoteLoginStatusService, eHnoteMasterDataService, eHnoteUserAppointmentDataService, eHnoteUserDataService, eHnotePatientDataService, localStorageFactory, eHnoteSettingsDataService) {



    $scope.telnyxUserAuthAvailable = false;
    $scope.telnyxLoginUserInfo = eHnoteLoginStatusService.getTelynxUserLoginDetails();
    var currenturl = $location.absUrl().split('?')[0];
    var currentRoute = currenturl.split('/#')[0];
    console.log(currentRoute + "__currentRoute");
    $scope.telnyxHospitalDid = $scope.telnyxLoginUserInfo.FromNumber;
    if (currentRoute == "/login") {
        return;
    }
    if ($scope.telnyxLoginUserInfo.loggedinStatus) {
        $scope.telnyxUserAuthAvailable = true;
    } else {
        return;
    }



    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.RoleId = $scope.userLoginDetails.RoleID;
    $scope.ParentHospitalId = 0;
    $scope.HospitalId = 0;

    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    };





    var telnyxClient = null;
    var telnyxTimerInterval = null;
    var telnyxStartTime = null;

    $scope.telnyxAvailable = false;
    // false => the admin deactivated this user's credential. The whole call bar
    // (Online/Offline toggle, dialpad, call log) is hidden and the user is forced
    // offline. Kept on $rootScope so the patient profile can hide Call History too.
    // seeded from $rootScope (login already set it) so a route change that re-creates
    // this controller does not flash the call bar back on before the next heartbeat
    $scope.telnyxCredentialActive = ($rootScope.telnyxCredentialActive !== false);
    $rootScope.telnyxCredentialActive = $scope.telnyxCredentialActive;
    $scope.BranchesListArray = [];
    $scope.HospitalIDSList = [];
    $scope.telnyxCallPatients = [];
    $scope.telnyxMissedCount = null;
    $scope.telnyxIsOutbound = false;
    $scope.telnyxPendingOutbound = null;
    $scope.telnyxCallState = null;
    $scope.telnyxDialingNumber = null;
    $scope.telnyxCurrentCallLogId = null;
    $scope.telnyxOutboundPatient = null;
    $scope.telnyxOnCallPatient = null;
    $scope.telnyxLastTornDownCallId = null;
    $scope.telnyxMuted = false;
    $scope.telnyxShowDtmf = false;
    $scope.floatingDialerOpen = false;
    $scope.dialerMinimized = false;


    $scope.ccTab = 'history';
    $scope.dialer = { input: '', searched: false, selectedPatient: null, results: [], searching: false };
    $scope.todaysCalls = [];
    $scope.patientResults = [];
    $scope.selectedDialPatient = null;
    $scope.searchingPatients = false;
    $scope.pendingOutbound = null;
    $scope.logPrompt = {
        show: false,
        patientId: null,
        patientName: null,
        number: null
    };

    $scope.linkModal = {
        show: false,
        callLogId: null,
        number: '',
        searchText: '',
        results: [],
        searching: false,
        selectedPatient: null,
        saveToProfile: false,
        phoneField: 'Primary'
    };

    $scope.keypad = [
        { d: '1', l: '' }, { d: '2', l: 'ABC' }, { d: '3', l: 'DEF' },
        { d: '4', l: 'GHI' }, { d: '5', l: 'JKL' }, { d: '6', l: 'MNO' },
        { d: '7', l: 'PQRS' }, { d: '8', l: 'TUV' }, { d: '9', l: 'WXYZ' },
        { d: '*', l: '' }, { d: '0', l: '+' }, { d: '#', l: '' }
    ];

    $scope.switchCcTab = function (t) {
        $scope.ccTab = t;
        if (t === 'dialer' && !$scope.todaysCalls.length) $scope.loadTodaysCalls();
    };

    // opts.background - refreshed because a call ended, not because the user asked.
    // loaderStatus keeps the http interceptor from throwing up the full-screen loader
    // for a list that is refreshing itself.
    $scope.loadTodaysCalls = function (opts) {
        var params = { "HospitalId": $scope.HospitalId }
        if (opts && opts.background) { params.loaderStatus = false; }
        eHnoteMainAppointmentService.GetTelnyxTodaysCalls(params).then(function (resp) {
            console.log(resp);
            $scope.todaysCalls = resp.data || [];
        });
    };
    $scope.dotClass = function (c) {
        if (c.CallStatusId === 2 && c.Direction === 'outgoing') return 'dot-out';
        if (c.CallStatusId === 2) return 'dot-answered';
        return 'dot-missed';
    };

    $scope.dotIcon = function (c) {
        return (c.CallStatusId === 2) ? 'fa-phone' : 'fa-phone-slash';
    };

    $scope.pressKey = function (k) {
        $scope.dialer.input = ($scope.dialer.input || '') + k;   // ⬅️ clears/appends correctly now
        if ($scope.telnyxActiveCall) { $scope.telnyxActiveCall.dtmf(k); return; }
        $scope.onDialInputChange();
    };
    $scope.isDialable = function () {
        return ($scope.dialer.input || '').replace(/\D/g, '').length >= 10;
    };
    $scope.backspace = function () {
        $scope.dialer.input = ($scope.dialer.input || '').slice(0, -1);
        $scope.onDialInputChange();
    };
    $scope.getInitials = function (name) {
        if (!name) return '?';
        return name.split(' ').map(function (w) { return w[0]; })
            .join('').substring(0, 2).toUpperCase();
    };

    //$scope.patientResults = [];
    //$scope.searchingPatients = false;
    //$scope.selectedDialPatient = null;
    //$scope.dialSearched = false;


    // MMDDYYYY, MM/DD/YYYY or MM-DD-YYYY -> "yyyy-MM-dd"; null when not a real past date
    function parseDialDob(v) {
        var m = /^(\d{2})(\d{2})(\d{4})$/.exec(v) || /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/.exec(v);
        if (!m) return null;
        var month = parseInt(m[1], 10), day = parseInt(m[2], 10), year = parseInt(m[3], 10);
        var d = new Date(year, month - 1, day);
        if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
        if (year < 1900 || d > new Date()) return null;
        return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
    }

    $scope.onDialInputChange = function (text) {
        var v = ($scope.dialer.input || '').trim();      // ⬅️ reads correctly now
        $scope.dialer.selectedPatient = null;

        var digits = v.replace(/\D/g, '');
        var dob = parseDialDob(v);
        var isName = /[a-zA-Z]/.test(v) && v.length >= 3;
        var isPhone = !dob && !/[a-zA-Z]/.test(v) && digits.length >= 5;

        // Do Not Call check, on its own debounce so it also fires for a number that
        // was picked from the patient search rather than typed digit by digit.
        if ($scope.dialDncTimer) $timeout.cancel($scope.dialDncTimer);
        if (digits.length < 10) {
            $scope.dialerDnc = null;
        } else {
            $scope.dialDncTimer = $timeout(function () { $scope.checkDialerDnc(); }, 400);
        }

        if (!isName && !isPhone && !dob) {
            $scope.dialer.results = [];
            $scope.dialer.searching = false;
            $scope.dialer.searched = false;
            return;
        }
        $scope.dialer.searching = true;
        if ($scope.dialSearchTimer) $timeout.cancel($scope.dialSearchTimer);

        $scope.dialSearchTimer = $timeout(function () {
            var param = {
                "PageSize": 30,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "SearchText": isName ? v : "",
                "PatientDisplayId": "",
                "OldPatientMRNO": "",
                "DOBSearch": dob || "",
                "PageNumber": 1,
                "StartAge": 0,
                "PhoneNumber": isPhone ? digits : "",
                "EndAge": 0,
                "IncludeCommDetails": "Y",
                "SearchDetails": { "listdocpatients": "Y" },
                "SearchMobile": 0,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "DoctorID": $scope.UserId,
                "GetAllSpecializationInd": true,
                "GetAllPatientInd": true,
                "hasparam": true
            };

            // same HospitalIDLst logic your SearchByText uses
            if ($scope.RoleId === 1) {
                param.HospitalIDLst = [doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID];
            } else {
                if (!$scope.listval || !$scope.listval.length) {
                    $scope.listval = [doctorinfo.doctordata.UserParentBranch[0].OrganizationId];
                }
                param.HospitalIDLst = $scope.listval;
            }

            var seq = dialSearchSeq;
            eHnotePatientDataService.SearchAllPatientNew(param,
                function (data) { if (seq === dialSearchSeq) onDialPatientSearchSuccess(data); },
                function (err) { if (seq === dialSearchSeq) onDialPatientSearchError(err); });
        }, 400);
    };

    // bumped by resetDialer so a search answered after the dialpad closed is dropped
    var dialSearchSeq = 0;

    function onDialPatientSearchSuccess(data) {
        $scope.$applyAsync(function () {
            $scope.dialer.searching = false;
            $scope.dialer.searched = true;
            var rows = (data && data.rows) ? angular.copy(data.rows) : [];

            $scope.dialer.results = rows.map(function (item) {
                var raw = (item.PhoneNumber || '').toString();
                if (item.HomeNumber) {
                    raw = '' + (item.AltCountryCode || '') + (item.HomeAreaCode || '') + item.HomeNumber;
                }
                var fmt = raw.length >= 10
                    ? raw.slice(0, 3) + '-' + raw.slice(3, 6) + '-' + raw.slice(6, 10) : raw;
                return {
                    PatientId: item.PatientId,
                    PatientID: item.PatientId,
                    DOB: item.DOB,
                    DisplayID: item.DisplayID||'',
                    PatientName: item.FullName,
                    PatientMRN: item.PatientDisplayId || '',
                    MobileNumber: raw,
                    MobileFmt: fmt
                };
            }).filter(function (p) { return p.MobileNumber && p.MobileNumber.length >= 10; });
        });

        console.log($scope.dialer.results);
    }

    function onDialPatientSearchError(err) {
        console.log('dialer search error', err);
        $scope.$applyAsync(function () {
            $scope.dialer.searching = false;
            $scope.dialer.searched = true;
            $scope.dialer.results = [];
        });
    }
    $scope.telnyxToggleMute = function () {
        if (!$scope.telnyxActiveCall) return;
        if ($scope.telnyxMuted) $scope.telnyxActiveCall.unmuteAudio();
        else $scope.telnyxActiveCall.muteAudio();
        $scope.telnyxMuted = !$scope.telnyxMuted;
    };

    $scope.telnyxSendDtmf = function (d) {
        if ($scope.telnyxActiveCall) $scope.telnyxActiveCall.dtmf(d);
    };

    $scope.selectDialPatient = function (p) {
        $scope.dialer.selectedPatient = p;
        $scope.dialer.input = p.MobileNumber;   // ⬅️ prefill WORKS now
        $scope.dialer.results = [];
        $scope.dialer.searched = false;
        // picking a patient fills the number without going through onDialInputChange
        $scope.checkDialerDnc();
    };
    $scope.clearDialPatient = function () {
        $scope.dialer.selectedPatient = null;
        $scope.dialer.input = '';                        // ⬅️ clears WORKS now
        $scope.dialer.searched = false;
        $scope.dialerDnc = null;
    };

    $scope.dialNow = function () {
        console.log('[DIAL] selectedPatient=', $scope.dialer.selectedPatient);
        var number = $scope.dialer.input;
        telnyxGuardDnc(number, function () {
            $scope.telnyxStartOutboundCall(
                number,
                $scope.dialer.selectedPatient,
                null,
                $scope.dialer.selectedPatient ? 3 : 1
            );
        });
    };

    // The other party's number. ContactNumber is not populated on every row, and on an
    // outgoing call the patient is ToNumber - FromNumber is our own hospital DID, so
    // falling back to it would dial the clinic itself.
    $scope.callNumberOf = function (c) {
        if (!c) { return ''; }
        return c.ContactNumber || (c.Direction === 'outgoing' ? c.ToNumber : c.FromNumber) || '';
    };

    $scope.dialFromRecent = function (c) {
        var number = $scope.callNumberOf(c);
        if (!number) {
            alertify.error('No number available for this call');
            return;
        }
        if (!$scope.telnyxAvailable) {
            alertify.error('Please go Online before placing a call');
            return;
        }

        var isMissed = (c.CallStatusId === 3);
        telnyxGuardDnc(number, function () {
            $scope.telnyxStartOutboundCall(
                number,
                c.MatchedPatientId ? { PatientId: c.MatchedPatientId, PatientName: c.PatientName, PatientMRN: c.PatientMRN, PatientDOB: c.PatientDOB } : null,
                isMissed ? c.CallLogId : null,
                isMissed ? 2 : 5
            );
        });
    };

    // Single place that reacts to the credential being activated / deactivated.
    // Deactivating always drops the WebRTC client first, so a user who is sitting
    // Online when the admin flips the switch goes Offline instead of silently
    // staying in the routing pool.
    function applyCredentialActive(raw) {
        // A BIT can reach us as true/false, 1/0 or "true"/"false" depending on how the
        // proc projects it, so decide explicitly. Anything unrecognised - including the
        // field being absent, e.g. Proc_GetTelnyxUserPresence not returning it yet -
        // leaves the state alone rather than guessing in either direction.
        var isActive;
        if (raw === true || raw === 1 || raw === '1' || raw === 'true') {
            isActive = true;
        } else if (raw === false || raw === 0 || raw === '0' || raw === 'false') {
            isActive = false;
        } else {
            return;
        }

        if (isActive === $scope.telnyxCredentialActive) { return; }

        $scope.telnyxCredentialActive = isActive;
        $rootScope.telnyxCredentialActive = isActive;

        if (!isActive) {
            if ($scope.telnyxAvailable) {
                telnyxGoOffline();
            }
            $scope.floatingDialerOpen = false;
            alertify.error('Your calling access has been deactivated by an administrator.');
        }
    }

    $scope.toggleAvailability = function () {
        console.log($scope.telnyxAvailable + "_$scope.telnyxAvailable");

        if (!$scope.telnyxCredentialActive) { return; }

        if ($scope.telnyxAvailable) {
            telnyxGoOffline();
        }
        else {
            telnyxGoAvailable();
        }
    };


    function telnyxGoAvailable() {

        console.log("go available called");


        var params = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "RoleId": $scope.RoleId,
            "IsAvailable": true,
            "StatusId": 1
        }

        eHnoteMainAppointmentService.UpdateTelynxUserAvailability(params).then(function (response) {
            console.log(response);
            var res = response.data;
            if (!res || res.Status !== 'Success') {
                console.error('Telnyx availability failed:', res && res.Message);
                // the API refuses to mint a token for a deactivated credential
                if (res && res.IsActive === false) { applyCredentialActive(false); }
                return;
            }


            var config = res.JwtToken
                ? { login_token: res.JwtToken, remoteElement: 'telnyxRemoteAudio' }
                : { login: res.SipUsername, password: res.SipPassword, remoteElement: 'telnyxRemoteAudio' };

            telnyxClient = new TelnyxWebRTC.TelnyxRTC(config);

            telnyxClient.on('telnyx.notification', function (notification) {
                $timeout(function () {
                    if (notification.type === 'callUpdate' && notification.call) {
                        handleTelnyxCall(notification.call);
                    }
                });
            });
            telnyxClient.on('telnyx.ready', function () {
                console.log('Telnyx ready');
                $timeout(function () { $scope.telnyxAvailable = true; });
            });
            telnyxClient.on('telnyx.error', function (e) { console.error('Telnyx error', e); });

            telnyxClient.connect();
        });
    }


    function telnyxGoOffline() {
        console.log("telynx go offline called");
        var params = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "RoleId": $scope.RoleId,
            "IsAvailable": true,
            "StatusId": 2
        }

        eHnoteMainAppointmentService.UpdateTelynxUserAvailability(params).finally(function () {
            console.log("Telnyx offline response came from api");
            try {
                if (telnyxClient) telnyxClient.disconnect();
            } catch (e) { }
            telnyxClient = null;
            $scope.telnyxAvailable = false;
            $scope.telnyxIncomingCall = null;
            $scope.telnyxActiveCall = null;
        });
    }

    // Call back from the patient profile > Communication Logs > Call History tab
    $scope.$on('telnyxDialNumber', function (evt, data) {
        if (!data || !data.Number) { return; }
        $scope.telnyxStartOutboundCall(
            data.Number,
            data.PatientId ? { PatientId: data.PatientId, PatientName: data.PatientName, PatientMRN: data.PatientMRN, PatientDOB: data.PatientDOB } : null,
            data.IsMissed ? data.CallLogId : null,
            data.IsMissed ? 2 : 5
        );
    });

    // Logging out must always drop the WebRTC client, not only when this scope
    // believes the user is Online. A stale flag - or a controller that outlived the
    // session - used to leave the client connected and the credential still in the
    // routing pool, so the browser kept ringing for a user who had logged out. Only
    // an empty-cache reload cleared it, because that is what finally destroyed the
    // client. The disconnect is therefore unconditional, and telnyxGoOffline is
    // called on top of it to tell the server as well.
    $scope.$on('telnyxForceOffline', function () {
        if ($scope.telnyxAvailable) {
            telnyxGoOffline();          // tells the server, then disconnects
        }
        // belt and braces: whatever the flags said, nothing may stay connected
        try {
            if (telnyxClient) { telnyxClient.disconnect(); }
        } catch (e) {
            console.log('[Telnyx] disconnect on logout failed', e);
        }
        telnyxClient = null;
        $scope.telnyxAvailable = false;
        $scope.telnyxIncomingCall = null;
        $scope.telnyxActiveCall = null;
        $rootScope.telnyxUserAuthAvailable = false;
        $rootScope.telnyxCredentialResolved = false;   // next session looks it up again
        cancelCallRefreshes();
    });

    function handleTelnyxCall(call) {
        console.log('[TELNYX STATE]', call.state, 'id=', call.id);

        if (call.state !== 'hangup' && call.state !== 'destroy') {
            $scope.telnyxActiveCall = call;
        }

        switch (call.state) {

            case 'ringing':

                if ($scope.telnyxActiveCall && $scope.telnyxActiveCall.id !== call.id) {
                    console.log('[BUSY] rejecting incoming call, already on a call');
                    try { call.hangup(); } catch (e) { }
                    return;
                }
                var freshPending = $scope.telnyxPendingOutbound &&
                    (Date.now() - $scope.telnyxPendingOutbound.at) < 15000;
                var alreadyOutbound = $scope.telnyxIsOutbound && $scope.telnyxCallState;

                if (freshPending || alreadyOutbound) {
                    console.log('[AUTO-ANSWER] answering call, id=', call.id, 'state=', call.state);
                    stopRingtone();
                    $scope.telnyxPendingOutbound = null;
                    $scope.telnyxActiveCall = call;
                    try {
                        call.answer();
                        console.log('[AUTO-ANSWER] call.answer() called OK');
                    } catch (e) {
                        console.log('[AUTO-ANSWER] call.answer() THREW:', e);
                    }
                    return;
                }

                var hdrs = (call.options && call.options.customHeaders) || [];
                var isOutboundLeg = hdrs.some(function (h) {
                    return h.name === 'X-EHRUS-Role' && h.value === 'agent-out';
                });


                if (!isOutboundLeg && $scope.telnyxPendingOutbound &&
                    (Date.now() - $scope.telnyxPendingOutbound.at) < 15000) {
                    isOutboundLeg = true;
                }

                if (isOutboundLeg) {
                    $scope.telnyxIsOutbound = true;
                    $scope.telnyxPendingOutbound = null;
                    $scope.telnyxActiveCall = call;
                    call.answer();
                    $scope.$applyAsync(function () {
                        $scope.telnyxCallState = 'ringing-remote';
                    });
                    return;
                }


                var raw = call.options.remoteCallerNumber;
                $scope.telnyxIsOutbound = false;
                $scope.telnyxIncomingCall = {
                    call: call, number: telnyxFormatPhone(raw), rawNumber: raw,
                    patients: [], loading: true, selectedPatientId: null, selectedPatient: null
                };
                $scope.telnyxAwaitingPatientPick = false;
                $scope.telnyxOnCallPatient = null;
                lookupTelnyxPatient(raw);
                startRingtone();
                break;

            case 'active':
                stopRingtone();



                var remoteEl = document.getElementById('telnyxRemoteAudio');
                if (remoteEl && call.remoteStream) {
                    remoteEl.srcObject = call.remoteStream;
                    remoteEl.play().catch(function (e) { console.log('play blocked:', e); });
                    console.log('[AUDIO] attached remoteStream', call.remoteStream);
                } else {
                    console.log('[AUDIO] no remoteStream on call. keys:', Object.keys(call));
                }

                $scope.telnyxActiveCallNumber = telnyxFormatPhone(call.options.remoteCallerNumber);
                telnyxStartTimer();
                notifyCallStarted();
                var list = $scope.telnyxCallPatients || [];
                $scope.telnyxIncomingCall = null;
                if (list.length === 1) {

                    openPatient(list[0]);
                }
                else if (list.length > 1) { $scope.telnyxAwaitingPatientPick = true; }
                else { $scope.telnyxOnCallPatient = null; }
                break;

            case 'hangup':
            case 'destroy':
                // Both hangup and destroy fire for the same call — process only the first
                if ($scope.telnyxLastTornDownCallId === call.id) break;
                $scope.telnyxLastTornDownCallId = call.id;

                stopRingtone();

                // Capture call context BEFORE cleanup wipes it
                var endedPatient = $scope.telnyxOnCallPatient || ($scope.dialer && $scope.dialer.selectedPatient);
                var endedNumber = $scope.telnyxActiveCallNumber;
                var wasInbound = !$scope.telnyxIsOutbound;
                var wasConnected = !!$scope.telnyxCallDuration && $scope.telnyxCallDuration !== '00:00';

                // A stale call from a previous attempt dying — don't tear down our fresh outbound
                var weJustDialed = $scope.telnyxPendingOutbound &&
                    (Date.now() - $scope.telnyxPendingOutbound.at) < 15000;
                if (weJustDialed && call !== $scope.telnyxActiveCall) {
                    // Don't tear down the fresh outbound - but the leg that just died
                    // has a log row of its own, so the lists still need telling.
                    notifyCallEnded();
                    break;
                }

                telnyxStopTelnyxPolling();
                telnyxStopTimer();

                // Clear call state synchronously
                $scope.telnyxActiveCall = null;
                $scope.telnyxIncomingCall = null;
                $scope.telnyxOnCallPatient = null;
                $scope.telnyxActiveCallNumber = null;
                $scope.telnyxAwaitingPatientPick = false;
                $scope.telnyxCallPatients = [];
                $scope.dialerMinimized = false;
                telnyxResetOutbound();

                if ($scope.dialer) {
                    $scope.dialer.selectedPatient = null;
                    $scope.dialer.input = '';
                    $scope.dialer.results = [];
                    $scope.dialer.searched = false;
                }


                try {
                    if (!$scope.$$phase && !$scope.$root.$$phase) $scope.$apply();
                    else $scope.$applyAsync();
                } catch (e) {
                    console.error('[Telnyx] digest error', e);
                }


                $timeout(function () {
                    try {
                        // the Calling Log reloads with every other call list, on the
                        // schedule notifyCallEnded sets up below

                        if (wasInbound && wasConnected && endedPatient) {
                            $scope.logPrompt = {
                                show: true,
                                patientId: endedPatient.PatientId,
                                patientName: endedPatient.FullName || endedPatient.PatientName,
                                number: endedNumber
                            };
                            $timeout(function () {
                                if ($scope.logPrompt && $scope.logPrompt.show) $scope.dismissLogPrompt();
                            }, 15000);
                        }
                    } catch (e) {
                        console.error('[Telnyx] post-teardown error', e);
                    }
                }, 0);

                notifyCallEnded();
                break;
        }
    }

    // Any call that ends here (answered, missed, incoming or outgoing) changes the call
    // log, so tell the open call lists - patient Call History, Calling Log - and the
    // missed badge to reload.
    //
    // The row, and its final status and duration, are written server side from the
    // Telnyx webhook, which arrives some time after the browser leg is already gone -
    // sometimes well after. Two fixed refreshes raced that write and usually lost, so
    // the screen kept showing the call list as it was until the user left the tab and
    // came back. Spreading the refreshes over the next ~20 seconds lets a late webhook
    // land on its own.
    // Four requests per list for one call: enough to cover a slow webhook without
    // looking like a poll to anyone watching the network tab.
    var CALL_REFRESH_DELAYS = [1500, 4000, 9000, 16000];
    var pendingCallRefreshes = [];

    function cancelCallRefreshes() {
        angular.forEach(pendingCallRefreshes, function (p) { $timeout.cancel(p); });
        pendingCallRefreshes = [];
    }

    // One signal for "the call log changed, reload what is on screen" - the patient
    // Call History tab, the Calling Log and the missed badge all listen for it.
    function scheduleCallRefresh(delays) {
        angular.forEach(delays, function (delay) {
            pendingCallRefreshes.push($timeout(function () {
                if (!navigator.onLine) { return; }
                $scope.getTodaysMissedCallsCount({ background: true });
                if (angular.isFunction($scope.loadTodaysCalls)) {
                    $scope.loadTodaysCalls({ background: true });
                }
                $rootScope.$broadcast('telnyxCallEnded');
            }, delay));
        });
    }

    function notifyCallEnded() {
        cancelCallRefreshes();
        scheduleCallRefresh(CALL_REFRESH_DELAYS);
    }

    // A call that has just connected belongs on those lists too, as an in-progress row.
    function notifyCallStarted() {
        cancelCallRefreshes();
        scheduleCallRefresh([1500]);
    }


    function lookupTelnyxPatient(raw) {
        var normalized = normalizePhone(raw);
        var requestparams = {
            // the incoming-call banner has its own "Looking up patient..." line
            "loaderStatus": false,
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "HospitalIDLst": $scope.HospitalIDSList,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "MobileNumber": normalized,
            "PageSize": 5,
            "PageNumber": 1
        };
        eHnoteMainAppointmentService.GetPatientsDataByPhoneNumber(requestparams).then(function (resp) {
            if (!$scope.telnyxIncomingCall) return;   // call may have ended
            var rows = (resp.data && resp.data.rows) || [];
            angular.forEach(rows, function (p) {
                p.PatientID = p.PatientID || p.PatientId;
                p.DOBFmt = formatDob(p.DOB);
                p.MRNo = p.DisplayID || p.PatientDisplayId || p.OldMrno || '';
            });
            $scope.telnyxIncomingCall.loading = false;
            $scope.telnyxIncomingCall.patients = rows;
            $scope.telnyxCallPatients = rows;
        });
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
    // US format (990) 099-0011; blank for empty / 0 numbers
    function formatUsPhone(num) {
        var d = normalizePhone((num || '').toString());
        if (!d || /^0+$/.test(d)) return '';
        return d.length === 10 ? '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6) : d;
    }
    function formatDob(dob) {
        if (!dob) return '';
        var m = moment(dob, ['YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD', 'MM/DD/YYYY', 'MM-DD-YYYY', 'DD-MM-YYYY']);
        return m.isValid() ? m.format('MM-DD-YYYY') : dob;
    }
    function navigateTelnyxPatient() {
        var ic = $scope.telnyxIncomingCall;
        if (ic && ic.patients && ic.patients.length === 1) {
            openPatient(ic.patients[0]);
        } else if (ic && ic.selectedPatient) {
            openPatient(ic.selectedPatient);
        }
        // multiple & unpicked → keep banner so they can still choose
    }


    $scope.answerCall = function () { if ($scope.telnyxActiveCall) $scope.telnyxActiveCall.answer(); };
    $scope.hangupCall = function () { if ($scope.telnyxActiveCall) $scope.telnyxActiveCall.hangup(); };

    $scope.selectcallingPatient = function (p) {
        if (!$scope.telnyxIncomingCall) return;
        $scope.telnyxIncomingCall.selectedPatientId = p.PatientID;
        $scope.telnyxIncomingCall.selectedPatient = p;

        if ($scope.telnyxActiveCall && $scope.telnyxActiveCall.state === 'active') {
            openPatient(p);
        }
    };

    $scope.pickPatientOnCall = function (p) {
        $scope.telnyxAwaitingPatientPick = false;

        openPatient(p);   // now navigate to the right patient
    };

    function openPatient(p) {
        console.log($scope.telnyxActiveCall.options);
        $scope.telnyxOnCallPatient = p;
        $scope.dialer.selectedPatient = p;
        $rootScope.telnyxSelectedPatientForProfile = p;
        var remoteCallerNumber = $scope.telnyxActiveCall.options.remoteCallerNumber;

        var reqParams = {
            "FromNumber": remoteCallerNumber,
            "AnsweredByUserId": $scope.UserId,
            "MatchedPatientId": p.PatientID
        };
        console.log(reqParams);

        eHnoteMainAppointmentService.UpdateTelnyxCallLogPatientAnswered(reqParams).then(function (resp) {
            console.log(resp);
        });

        $scope.telnyxIncomingCall = null;


        $rootScope.$broadcast("telnyxOpenPatient", p);
    }


    function telnyxStartTimer() {
        telnyxStopTimer();
        telnyxStartTime = Date.now();
        telnyxTimerInterval = setInterval(function () {
            var el = Math.floor((Date.now() - telnyxStartTime) / 1000);
            $scope.$applyAsync(function () {
                $scope.telnyxCallDuration = ('0' + Math.floor(el / 60)).slice(-2) + ':' + ('0' + (el % 60)).slice(-2);
            });
        }, 1000);
    }

    function telnyxStopTimer() {
        if (telnyxTimerInterval) { clearInterval(telnyxTimerInterval); telnyxTimerInterval = null; }
        $scope.telnyxCallDuration = '00:00';
    }
    function telnyxFormatPhone(num) {
        if (!num) return '';
        var d = num.replace(/\D/g, '').slice(-10);
        return d.length === 10 ? '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6) : num;
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

    }


    function restoreTelnyxPresence() {
        var requestparams = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId
        };
        // credential state first, then presence - never reconnect a deactivated user
        refreshCredentialActive().finally(function () {
            if (!$scope.telnyxCredentialActive) { return; }

            eHnoteMainAppointmentService.CheckTelnyxUserAvailability(requestparams).then(function (resp) {
                console.log(resp);
                if (!resp.data) { return; }

                if (resp.data.StatusId === 1) {
                    console.log("go avaialable ready to call");
                    telnyxGoAvailable();   // reconnect client, flip toggle back to Available
                }
            });
        });
    }

    // Same endpoint the shell controller uses on load, so there is one source of truth.
    function refreshCredentialActive() {
        return eHnoteMainAppointmentService.GetTelnyxUserCredentialsByBranchId(
            $scope.UserId, $scope.HospitalId
        ).then(function (resp) {
            if (resp.data) { applyCredentialActive(resp.data.IsActive); }
        });
    }

    // There is deliberately NO repeating check here. The credential is read once per
    // page load, and after that only when something actually happens:
    //
    //   admin toggles it in THIS browser -> the admin screen sets
    //       $rootScope.telnyxCredentialActive and the watch below reacts at once
    //   user goes Online                 -> UpdateTelynxUserAvailability refuses to
    //       mint a token for a deactivated credential and returns IsActive false,
    //       which telnyxGoAvailable feeds straight into applyCredentialActive
    //   user places a call               -> the server blocks it the same way
    //
    // The one case left is a user already sitting Online whom an admin deactivates
    // from a different machine: their header keeps saying Online until they reload or
    // try to use it, at which point the server turns them away. That is accepted -
    // polling every user of every branch, for ever, to notice a rare admin action
    // sooner is what the testers raised as excessive background traffic.

    // The admin screen sets this directly when an admin toggles their own credential,
    // so the header reacts at once instead of waiting up to a minute for the heartbeat.
    var stopCredentialActiveWatch = $rootScope.$watch('telnyxCredentialActive', function (isActive) {
        applyCredentialActive(isActive);
    });

    $scope.$on('$destroy', function () {
        if (stopCredentialActiveWatch) { stopCredentialActiveWatch(); }
        cancelCallRefreshes();
    });


    $scope.getTodaysMissedCallsCount = function (opts) {
        var params = {
            HospitalId: $scope.HospitalId,
            CurrentDate: moment().format('YYYY-MM-DD')
        };
        if (opts && opts.background) { params.loaderStatus = false; }
        console.log(params.CurrentDate +"__CurrentDate");
        eHnoteMainAppointmentService.GetTelnyxMissedCallCount(params).then(function (resp) {
            console.log(resp)
            if (resp.data.Status == 'Success') {
                $scope.telnyxMissedCount = resp.data.MissedCount || 0;
            }

        }, function (err) {
            // only the badge depends on this - keep the last count, don't touch call state
            console.log('missed call count failed', err);
        });
    };


    $scope.init = function () {
        var data = localStorageFactory.getItem("allBranchesData") || [];
        if (data.length === 0 || data.length === undefined) {
            alertify.error("Something Went Wrong");
            datapersistanceFactory.clearAll();
            localStorageFactory.clearAll();
            $rootScope.showMainPageHeader = false;
            $location.path("/login");
            return false;
        } else {
            InitializeNewBranches(data);
            restoreTelnyxPresence();
        }
        $scope.getTodaysMissedCallsCount();

    };
    $scope.init();

    $scope.navtoopenCallHistory = function () {

        var mainobject = {
            "UserId": $scope.UserId
        };

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/telnyxCallHistorypopup.html",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "resolve": {
                "mainobject": function () { return angular.copy(mainobject) }
            },
            "windowClass": "modal__popup--1 bottom-to-top-modal",
            "controller": function ($scope, $uibModal, $uibModalInstance, mainobject, eHnoteMainAppointmentService, eHnoteLoginStatusService,eHnoteMasterDataService) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
             $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();


                $scope.filterPopoverOpen = false;
                // One date filter for the whole popup: the stat cards and the call
                // list both read FromDate/ToDate from here, so they always describe
                // the same period. Opens on today.
                $scope.gettelnyxHistoryReqobj = {
                    HospitalId: $scope.HospitalId,
                    CallStatusId: 0,
                    // All means all. It opened filtered to outgoing while the All tab
                    // was lit, so the count above never matched the rows underneath.
                    // null, not "": Proc_GetTelnyxCallHistory compares Direction
                    // straight against the column without turning an empty string into
                    // NULL first, so "" matches no row at all and the list comes back
                    // empty while the cards still count everything.
                    Direction: null,
                    FilterKey: 'all',
                    Search: '',
                    FromDate: new Date(),
                    ToDate: new Date(),
                    PageNumber: 1,
                    PageSize: 25
                };

                // The range picker hands back Date objects. The proc reads the dates out
                // of the request JSON, so send an unambiguous yyyy-MM-dd rather than
                // whatever the browser serialises a Date to - an ISO string carries a UTC
                // time with it and would move the day for anyone east or west of UTC.
                function callDateParam(dt) {
                    return dt ? $filter('date')(dt, "yyyy-MM-dd") : null;
                }
                $scope.callHistory = [];
                $scope.callStats = {};
                $scope.callTotalCount = 0;

                $scope.closeModal = function () { $uibModalInstance.close(); };



                $scope.callPage = function (dir) {
                    $scope.callFilter.PageNumber += dir;
                    if ($scope.callFilter.PageNumber < 1) $scope.callFilter.PageNumber = 1;
                    $scope.loadCallHistory();
                };

                // opts.background - see loadTodaysCalls: no full-screen loader for a
                // list refreshing itself after a call.
                $scope.loadStats =  function(opts) {
                    var params = {
                        "HospitalId": $scope.gettelnyxHistoryReqobj.HospitalId,
                        "FromDate": callDateParam($scope.gettelnyxHistoryReqobj.FromDate),
                        "ToDate": callDateParam($scope.gettelnyxHistoryReqobj.ToDate),
                        // the cards and pills must describe the same set the list
                        // shows, so the search narrows both or neither
                        "Search": $scope.gettelnyxHistoryReqobj.Search || ""
                    };
                    if (opts && opts.background) { params.loaderStatus = false; }
                    eHnoteMainAppointmentService.GetTelnyxCallStats(params).then(function (resp) {
                        console.log(resp);
                        $scope.callStats = resp.data || {};
                    });
                }

                $scope.loadCallHistory = function(opts) {
                    var params = {
                        "HospitalId": $scope.gettelnyxHistoryReqobj.HospitalId,
                        "UserId": $scope.UserId,
                        "CallStatusId": $scope.gettelnyxHistoryReqobj.CallStatusId,
                        // same reason as the default above: empty string filters
                        // everything out, null means "no direction filter"
                        "Direction": $scope.gettelnyxHistoryReqobj.Direction || null,
                        // The Phone Number box was never sent, so typing in it did
                        // nothing. The proc has always read it.
                        "Search": $scope.gettelnyxHistoryReqobj.Search || "",
                        "FromDate": callDateParam($scope.gettelnyxHistoryReqobj.FromDate),
                        "ToDate": callDateParam($scope.gettelnyxHistoryReqobj.ToDate),
                        "PageNumber": $scope.gettelnyxHistoryReqobj.PageNumber,
                        "PageSize": $scope.gettelnyxHistoryReqobj.PageSize
                    };
                    if (opts && opts.background) { params.loaderStatus = false; }
                    eHnoteMainAppointmentService.GetTelnyxCallHistory(params).then(function (resp) {
                        var d = resp.data || {};
                        // what the empty state quotes back: the term these rows were
                        // fetched with, not whatever is in the box by the time they land
                        $scope.callHistoryAppliedSearch = params.Search || '';
                        $scope.callHistory = d.rows || [];
                        $scope.callHistory.forEach(function (c) {
                            c.StartTime = c.StartTime + 'Z';
                        });
                        $scope.callTotalCount = parseInt(d.TotalCount, 10) || 0;
                        $scope.gettelnyxHistoryReqobj.PageSize = parseInt($scope.gettelnyxHistoryReqobj.PageSize, 10) || 25;
                        $scope.callTotalPages = Math.ceil($scope.callTotalCount / $scope.gettelnyxHistoryReqobj.PageSize);
                        console.log('pager:', $scope.callTotalCount, $scope.gettelnyxHistoryReqobj.PageSize, $scope.callTotalPages);

                    });
                }
                


                // ── Call recording: toggle an inline player under the row ──
                // c.recState: undefined → 'loading' → 'ready' | 'none' | 'error'
                $scope.toggleRecording = function (c) {
                    if (c.showRec) { c.showRec = false; return; }
                    c.showRec = true;
                    if (c.recState === 'ready') return;

                    c.recState = 'loading';
                    var params = { "HospitalId": $scope.HospitalId, "CallLogId": c.CallLogId };
                    eHnoteMainAppointmentService.GetTelnyxCallRecordings(params).then(function (resp) {
                        var d = resp.data || {};
                        c.recordings = d.Recordings || [];
                        c.recState = d.Status !== 'Success' ? 'error' : (c.recordings.length ? 'ready' : 'none');
                    }, function () {
                        c.recState = 'error';
                    });
                };

                // Ids as tblMasterCallStatus holds them: 1 Ringing, 2 Answered,
                // 3 Missed, 4 No Answer, 5 Busy, 6 Failed, 7 Cancelled. A pill is
                // either a direction or a status, never both.
                var STATUS_BY_KEY = {
                    answered: 2,
                    missed: 3,
                    noanswer: 4,
                    busy: 5,
                    failed: 6,
                    cancelled: 7
                };

                $scope.setCallFilter = function (key) {
                    $scope.gettelnyxHistoryReqobj.FilterKey = key;

                    $scope.gettelnyxHistoryReqobj.Direction =
                        (key === 'incoming') ? 'incoming' :
                            (key === 'outgoing') ? 'outgoing' : null;

                    $scope.gettelnyxHistoryReqobj.CallStatusId = STATUS_BY_KEY[key] || 0;

                    $scope.gettelnyxHistoryReqobj.PageNumber = 1;
                    $scope.loadCallHistory();
                };

                // ---- date filter (inline row) - reloads the list and the cards together ----
                $scope.applyHistoryFilter = function () {
                    $scope.gettelnyxHistoryReqobj.PageNumber = 1;
                    $scope.loadCallHistory();
                    $scope.loadStats();
                };
                $scope.clearHistoryFilter = function () {
                    $scope.gettelnyxHistoryReqobj.Search = '';
                    // back to the day the popup opens on, not to "every call ever" -
                    // otherwise clearing puts the list and the cards back out of step
                    $scope.gettelnyxHistoryReqobj.FromDate = new Date();
                    $scope.gettelnyxHistoryReqobj.ToDate = new Date();
                    $scope.gettelnyxHistoryReqobj.PageNumber = 1;
                    $scope.loadCallHistory();
                    $scope.loadStats();
                };



                // ---- pagination ----
                $scope.callHistoryPageChanged = function (pageNumber) {
                    $scope.gettelnyxHistoryReqobj.PageNumber = pageNumber;
                    $scope.loadCallHistory();
                };

                $scope.loadStats();
                $scope.loadCallHistory();

                // Link to patient is confirmed on the parent scope; reload here so the
                // linked patient (and any other calls from that number) show without a refresh.
                $scope.$on('telnyxCallEnded', function () {
                    $scope.loadCallHistory({ background: true });
                    $scope.loadStats({ background: true });
                });
                $scope.$on('telnyxCallLinked', function () {
                    $scope.loadCallHistory();
                    $scope.loadStats();
                });

                $scope.openPatientFromCall = function (c) {
                    if (!c.MatchedPatientId) { alertify.error('No patient linked to this call'); return; }
                    $rootScope.$broadcast('telnyxOpenPatient', { PatientId: c.MatchedPatientId, PatientID: c.MatchedPatientId });
                    $scope.uibclose();
                };
            }
        });
        mInstanceAdd.result.then(function (resp) {
            console.log(resp);


        }, function (cancel) {

        });
    }

    // ring control helpers
    var ringtoneEl = null;
    function getRingtone() {
        if (!ringtoneEl) ringtoneEl = document.getElementById('ehnoteRingtone');
        return ringtoneEl;
    }
    function startRingtone() {
        var r = getRingtone();
        if (r) {
            r.currentTime = 0;
            var p = r.play();
            if (p && p.catch) p.catch(function (e) { console.warn('Ringtone blocked:', e); });
        }
    }
    function stopRingtone() {
        var r = getRingtone();
        if (r) { r.pause(); r.currentTime = 0; }
    }

    window.addEventListener('beforeunload', function () {
        if (!$scope.telnyxAvailable) return;

        var payload = JSON.stringify({
            UserId: $scope.UserId,
            HospitalId: $scope.HospitalId,
            RoleId: $scope.RoleId,
            IsAvailable: false,
            StatusId: 2
        });

        console.log(window.url);

        //var beaconUrl = window.url + "/Integration/TelnyxBeaconOffline";   
        //var queued = navigator.sendBeacon(beaconUrl, payload);   
        //console.log("beacon queued?", queued);

    });





    $scope.telnyxStartOutboundCall = function (number, patient, relatedLogId, dialSourceId) {
        console.log('[OUT] startOutboundCall fired');

        if ($scope.telnyxActiveCall) {
            try { $scope.telnyxActiveCall.hangup(); } catch (e) { }
            $scope.telnyxActiveCall = null;
        }

        if ($scope.telnyxCallState) {
            alertify.error('You are already on a call'); return;
        }
        $scope.telnyxPendingOutbound = { at: Date.now() };
        console.log('[OUT] pendingOutbound SET', $scope.telnyxPendingOutbound);


        $scope.telnyxIsOutbound = true;
        $scope.telnyxCallState = 'dialing';
        $scope.telnyxDialingNumber = number;
        $scope.telnyxOutboundPatient = patient || null;

        var params = {
            UserId: $scope.UserId,
            ToNumber: number,
            PatientId: (patient && patient.PatientId) || null,
            RelatedCallLogId: relatedLogId || null,
            DialSourceId: dialSourceId || 1
        };

        eHnoteMainAppointmentService.StartTelnyxOutboundCall(params).then(function (resp) {
            console.log(resp)
            if (resp.data.Status !== 'Success') {
                telnyxResetOutbound();
                alertify.error(resp.data.Message || 'Could not place the call');
                return;
            }
            $scope.telnyxCurrentCallLogId = resp.data.CallLogId;
            telnyxStartPolling();
        }, function () {
            telnyxResetOutbound();
            alertify.error('Call failed');
        });
    };

    function telnyxStartPolling() {
        telnyxStopTelnyxPolling();
        $scope.telnyxPoll = $interval(function () {
            // loaderStatus keeps the http interceptor quiet: this runs every 2s while
            // the call is dialing, and the widget already shows the call's state.
            var params = {
                "CallLogId": $scope.telnyxCurrentCallLogId,
                "loaderStatus": false
            };

            eHnoteMainAppointmentService.GetTelnyxCallStatus(params).then(function (resp) {
                var r = resp.data;
                if (!r) return;
                console.log('[POLL] CallStatusId=', r.CallStatusId, r.CallStatusName);

                if (r.CallStatusId === 1) {

                    if ($scope.telnyxCallState === 'dialing') {
                        $scope.telnyxCallState = 'ringing-remote';
                    }
                }
                else if (r.CallStatusId === 2) {
                    $scope.telnyxCallState = 'connected';
                    telnyxStartTimer();
                    telnyxStopTelnyxPolling();
                }
                else if (r.CallStatusId >= 4) {
                    $scope.telnyxCallState = 'failed';
                    $scope.telnyxCallFailReason = r.CallStatusName;
                    telnyxStopTelnyxPolling();
                    $timeout($scope.telnyxHangup, 2500);
                }
            });
        }, 2000, 40);
    }

    function telnyxStopTelnyxPolling() {
        if ($scope.telnyxPoll) { $interval.cancel($scope.telnyxPoll); $scope.telnyxPoll = null; }
    }

    function telnyxResetOutbound() {
        telnyxStopTelnyxPolling();
        $scope.telnyxIsOutbound = false;
        $scope.telnyxCallState = null;
        $scope.telnyxDialingNumber = null;
        $scope.telnyxOutboundPatient = null;
        $scope.telnyxPendingOutbound = null;
        $scope.telnyxCurrentCallLogId = null;
        $scope.telnyxCallFailReason = null;
        $scope.telnyxMuted = false;
        $scope.telnyxShowDtmf = false;
    }

    $scope.telnyxHangup = function () {
        var callLogId = $scope.telnyxCurrentCallLogId;

        // 1. the browser leg, when one already exists
        if ($scope.telnyxActiveCall) {
            try { $scope.telnyxActiveCall.hangup(); } catch (e) { }
            $scope.telnyxActiveCall = null;
        }

        // 2. while the call is still dialing / ringing there is no browser leg yet,
        //    so the legs have to be hung up server side through Telnyx
        if (callLogId) {
            eHnoteMainAppointmentService.EndTelnyxOutboundCall({
                CallLogId: callLogId,
                UserId: $scope.UserId,
                loaderStatus: false        // the widget is already closing on screen
            }).then(function (resp) {
                if (resp.data && resp.data.Status !== 'Success') {
                    console.log('[HANGUP]', resp.data.Message);
                }
            }, function () {
                console.log('[HANGUP] end call request failed');
            });
        }

        // 3. always clear the widget, otherwise it stays on screen
        telnyxResetOutbound();

        // A call cancelled while it was still dialing has no browser leg, so the SDK
        // never reports a hangup for it - without this the lists never hear about it.
        notifyCallEnded();
    };

    $scope.callBackFromHistory = function (c) {
        var isMissed = (c.CallStatusId === 3);
        var num = (c.Direction === 'incoming') ? c.FromNumber : c.ToNumber;
        if (!num) {
            alertify.error('No number available for this call');
            return;
        }
        telnyxGuardDnc(num, function () {
            $scope.telnyxStartOutboundCall(
                num,
                c.MatchedPatientId ? { PatientId: c.MatchedPatientId, PatientName: c.PatientName, PatientMRN: c.PatientMRN, PatientDOB: c.PatientDOB } : null,
                isMissed ? c.CallLogId : null,
                isMissed ? 2 : 5
            );
        });
    };
    // (939) 397-8532 from +19393978532 / 9393978532; blank for empty or 0
    $scope.fmtPhone = function (n) {
        return formatUsPhone(n);
    };




    /* ──────────────────────────── Do Not Call ────────────────────────────
       A number on the DNC list must not be dialled. The grid carries an IsDnc flag
       per row, but that snapshot can be minutes old - another user may have added
       the number since the page last loaded - so every dial path re-checks against
       the server before the call is placed. Proc_StartTelnyxOutboundCall blocks it
       server side as well; this layer exists to explain the block rather than to be
       the only thing enforcing it.                                                  */

    // True when the call-history row's other party is on the list. Set by
    // Proc_GetTelnyxCallHistory / Proc_GetPatientTelnyxCallHistory.
    $scope.isDnc = function (c) {
        return !!(c && (c.IsDnc === true || c.IsDnc === 1 || c.IsDnc === '1'));
    };

    // Runs onProceed only when the number is clear. Otherwise explains why the call
    // was stopped and offers the audited way out - removing the number from the list.
    // A lookup failure blocks rather than allows: dialling a number we could not
    // clear is the outcome with the consequences.
    function telnyxGuardDnc(number, onProceed) {
        if (!number) { return; }

        eHnoteMainAppointmentService.CheckTelnyxDnc({
            HospitalId: $scope.HospitalId,
            PhoneNumber: number
        }).then(function (resp) {
            var d = (resp && resp.data) || {};
            if (d.Status !== 'Success') {
                alertify.error('Could not verify the Do Not Call list. The call was not placed.');
                return;
            }
            if (d.IsDnc === true || d.IsDnc === 1) {
                $scope.dncBlockModal = {
                    show: true,
                    number: number,
                    reasonName: d.ReasonName || 'Not specified',
                    notes: d.Notes || '',
                    addedByName: d.AddedByName || '',
                    addedOn: d.AddedOn || null
                };
                return;
            }
            onProceed();
        }, function () {
            alertify.error('Could not verify the Do Not Call list. The call was not placed.');
        });
    }

    $scope.closeDncBlockModal = function () { $scope.dncBlockModal = { show: false }; };

    // From the block dialog straight into the audited removal flow.
    $scope.removeFromDncBlock = function () {
        var num = $scope.dncBlockModal.number;
        $scope.closeDncBlockModal();
        $scope.removeFromDnc({ ContactNumber: num });
    };

    $scope.dncReasons = [];

    $scope.loadDncReasons = function () {
        if ($scope.dncReasons.length) return;
        eHnoteMainAppointmentService.GetMasterDncReasons().then(function (resp) {
            console.log(resp);

            $scope.dncReasons = resp.data || [];
        });
    };


    $scope.addToDnc = function (c) {
        // callNumberOf, not FromNumber: on an outgoing row FromNumber is the practice's
        // own DID, so the old expression put the clinic's number on its own DNC list.
        var number = $scope.callNumberOf(c);
        if (!number) {
            alertify.error('No number available for this call');
            return;
        }
        $scope.loadDncReasons();
        $scope.dncModal = {
            show: true,
            number: number,
            callLogId: c.CallLogId,
            // captured now rather than looked up from the number later: the patient may
            // change their number, and then the list would name the wrong person
            patientId: c.MatchedPatientId || null,
            patientName: c.PatientName || '',
            reasonId: null,
            notes: ''
        };
    };

    $scope.closeDncModal = function () { $scope.dncModal = { show: false }; };

    $scope.confirmAddDnc = function () {
        if (!$scope.dncModal.reasonId) {
            alertify.error('Please select a reason');
            return;
        }

        var params = {
            "HospitalId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "ReasonId": $scope.dncModal.reasonId,
            "Reason": $scope.dncModal.notes || null,
            "PhoneNumber": $scope.dncModal.number,
            "PatientId": $scope.dncModal.patientId
        };
        eHnoteMainAppointmentService.AddTelnyxNumbertoDnc(params).then(function (resp) {

            console.log(resp);
            alertify.success('Added to Do Not Call');
            $scope.closeDncModal();
            $scope.loadCallHistory();

        });
    };

    /* ── Undo: take a number back off the list ──
       Soft delete with a reason, so the period the number spent on the list stays
       provable after it is lifted. */

    $scope.removeFromDnc = function (c) {
        var number = $scope.callNumberOf(c);
        if (!number) {
            alertify.error('No number available for this call');
            return;
        }
        $scope.dncRemoveModal = {
            show: true,
            number: number,
            reasonName: c.DncReason || '',
            removalReason: ''
        };
    };

    $scope.closeDncRemoveModal = function () { $scope.dncRemoveModal = { show: false }; };

    $scope.confirmRemoveDnc = function () {
        if (!$scope.dncRemoveModal.removalReason ||
            !$scope.dncRemoveModal.removalReason.trim()) {
            alertify.error('Please enter a reason for removing this number');
            return;
        }

        eHnoteMainAppointmentService.RemoveTelnyxNumberFromDnc({
            "HospitalId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "PhoneNumber": $scope.dncRemoveModal.number,
            "RemovalReason": $scope.dncRemoveModal.removalReason.trim()
        }).then(function (resp) {
            var d = (resp && resp.data) || {};
            if (d.Status !== 'Success') {
                alertify.error(d.Message || 'Could not remove the number');
                return;
            }
            alertify.success('Removed from Do Not Call');
            $scope.closeDncRemoveModal();
            $scope.loadCallHistory();
            // the dialpad may be showing a stale warning for this same number
            $scope.checkDialerDnc();
        }, function () {
            alertify.error('Could not remove the number');
        });
    };

    /* ── Dialpad warning ──
       Surfaces the DNC state while the number is being typed, so the block is not a
       surprise only after the Call button is pressed. */

    $scope.dialerDnc = null;

    $scope.checkDialerDnc = function () {
        var digits = ($scope.dialer.input || '').replace(/\D/g, '');
        if (digits.length < 10) {
            $scope.dialerDnc = null;
            return;
        }
        var seq = dialSearchSeq;
        eHnoteMainAppointmentService.CheckTelnyxDnc({
            HospitalId: $scope.HospitalId,
            PhoneNumber: $scope.dialer.input
        }).then(function (resp) {
            if (seq !== dialSearchSeq) return;   // dialpad was reset meanwhile
            var d = (resp && resp.data) || {};
            $scope.dialerDnc = (d.Status === 'Success' && (d.IsDnc === true || d.IsDnc === 1))
                ? { reasonName: d.ReasonName || 'Not specified', notes: d.Notes || '' }
                : null;
        }, function () {
            $scope.dialerDnc = null;
        });
    };

    $scope.checkDropDirection = function (ev) {
        var btn = ev.currentTarget;
        var rect = btn.getBoundingClientRect();
        var spaceBelow = window.innerHeight - rect.bottom;
        var parent = btn.closest('.ehnote-dl-more');
        if (spaceBelow < 180) parent.classList.add('dropup');
        else parent.classList.remove('dropup');
    };

    // Fresh dialpad: no typed text, results, picked patient or DNC warning, and no
    // search still in flight that could repopulate the results after closing.
    // Skipped during a call - the call-ended handler still reads selectedPatient.
    function resetDialer() {
        if ($scope.telnyxCallState) return;
        if ($scope.dialSearchTimer) $timeout.cancel($scope.dialSearchTimer);
        if ($scope.dialDncTimer) $timeout.cancel($scope.dialDncTimer);
        dialSearchSeq++;
        $scope.dialer.input = '';
        $scope.dialer.results = [];
        $scope.dialer.searching = false;
        $scope.dialer.searched = false;
        $scope.dialer.selectedPatient = null;
        $scope.dialerDnc = null;
    }

    $scope.toggleFloatingDialer = function () {
        $scope.floatingDialerOpen = !$scope.floatingDialerOpen;
        resetDialer();
        if ($scope.floatingDialerOpen && !$scope.telnyxHospitalDid) {
            $scope.loadDialerConfig();   // your existing DID loader
        }
    };
    $scope.closeFloatingDialer = function () {
        $scope.floatingDialerOpen = false;
        resetDialer();
    };


    $scope.openPatientDuringCall = function () {
        if (!$scope.telnyxOutboundPatient) return;
        $rootScope.$broadcast('telnyxOpenPatient', $scope.telnyxOutboundPatient);
        $scope.dialerMinimized = true;
    };

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


    $scope.markHandled = function (c) {
        var params = {
            "CallLogId": c.CallLogId,
            "UserId": $scope.UserId
        }
        eHnoteMainAppointmentService.MarkTelnyxCallHandled(params).then(function (resp) {
            console.log(resp);
            alertify.success('Marked as handled');
            $scope.loadCallHistory();   
            $scope.loadStats();    
        });
    };

    $scope.openAddNewLogPopup = function (item) {
        item = item || '';
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/addNewLog.html",
            "backdrop": "static",
            "size": "lg",
            "scope": $scope,
            "windowClass": "zindexpopup modal__ninety--",
            "keyboard": false,
            "resolve": {
                "mainObject": function () { return item },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMasterDataService, eHnoteSettingsDataService, eHnoteMainAppointmentService, mainObject) {


                $scope.ModeOfInteractionsArray = [];
                $scope.CommunicationReasonsArray = [];

                console.log(mainObject);
                var mobileNo = null;
                if (mainObject.Direction == "outgoing") {
                    mobileNo = mainObject.ToNumber;
                } else {
                    mobileNo = mainObject.FromNumber;
                }

                $scope.Newlogobj = {
                    "UserId": $scope.UserId,
                    "PatientId": mainObject.MatchedPatientId,
                    "PatientMobileNo": mobileNo,
                    "CommunicationDate": moment(mainObject.StartDate).format("YYYY-MM-DD"),
                    "CommunicationTime": moment(mainObject.StartDate).format("hh:mm A"),
                    "PatientCommunicationId": 0,
                    "ModeOfInteractionId": 2,
                    "ModeOfInteraction": "Call",
                    "ReasonId": null,
                    "ReasonName": "",
                    "IsFollowUpRequired": false,
                    "Notes": "",
                };



                $q.all([
                    eHnoteSettingsDataService.GetPatientRelatedMasterData()
                ]).then(function (resp) {

                    if (resp[0].data.status === "Success") {
                        if (resp[0].data.CommunicationReasons.length != 0) {
                            $scope.CommunicationReasonsArray = angular.copy(resp[0].data.CommunicationReasons) || [];
                            $scope.FiltersCommunicationReasonsArray = angular.copy(resp[0].data.CommunicationReasons) || [];
                            $scope.FiltersCommunicationReasonsArray.push({
                                ReasonId: 0,
                                ReasonName: "All"
                            });
                        }
                        if (resp[0].data.ModeOfInteractions.length != 0) {
                            $scope.ModeOfInteractionsArray = angular.copy(resp[0].data.ModeOfInteractions) || [];
                            $scope.FiltersModeOfInteractionsArray = angular.copy(resp[0].data.ModeOfInteractions) || [];
                            $scope.FiltersModeOfInteractionsArray.push({
                                ModeOfInteractionId: 0,
                                ModeOfInteraction: "All"
                            });
                        }
                    }
                });

                $scope.GetCommunicationTime = function () {
                    $scope.Newlogobj.CommunicationTime = moment(mainObject.StartDate).format("hh:mm A");

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
                        "UserId": $scope.UserId,
                        "OrganizationId": $scope.HospitalId,
                        "PatientCommunicationId": $scope.Newlogobj.PatientCommunicationId || 0,
                        "PatientId": $scope.Newlogobj.PatientId,
                        "CommunicationDate": $scope.Newlogobj.CommunicationDate || '',
                        "CommunicationTime": $scope.Newlogobj.CommunicationTime || '',
                        "ModeOfInteractionId": $scope.Newlogobj.ModeOfInteractionId || null,
                        "ModeOfInteraction": $scope.Newlogobj.ModeOfInteraction || "",
                        "ReasonId": $scope.Newlogobj.ReasonId || null,
                        "ReasonName": $scope.Newlogobj.ReasonName || "",
                        "IsFollowUpRequired": $scope.Newlogobj.IsFollowUpRequired || false,
                        "DeleteInd": "N",
                        "Notes": $scope.Newlogobj.Notes
                    }
                    eHnoteMainAppointmentService.AddUpdatePatientCommunicationDetails(params).then(function (resp) {
                        if (resp.data.status === "Success") {
                            console.log(resp);
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
            console.log(result);
        }, function (cancel) {
        });
    };




    $scope.dismissLogPrompt = function () {
        $scope.logPrompt.show = false;
    };
    $scope.openLogFromPrompt = function () {
        var p = $scope.logPrompt;
        $scope.dismissLogPrompt();
        $scope.openAddNewLogPopup({
            MatchedPatientId: p.patientId,
            PatientName: p.patientName,
            ContactNumber: p.number,
            Direction: 'incoming'
        });
    };

    $scope.linkCallToPatient = function (c) {

        $scope.linkModal.show = true;
        $scope.linkModal.call = c;
        $scope.linkModal.callLogId = c.CallLogId;
        $scope.linkModal.number = formatUsPhone(c.ContactNumber || c.FromNumber);
        $scope.linkModal.searchText = '';
        $scope.linkModal.results = [];
        $scope.linkModal.searching = false;
        $scope.linkModal.searched = false;
        $scope.linkModal.selectedPatient = null;
        $scope.linkModal.saveToProfile = false;
        $scope.linkModal.phoneField = 'Primary';
    };

    $scope.confirmLinkPatient = function () {
        if (!$scope.linkModal.selectedPatient) { alertify.error('Select a patient'); return; }
        if ($scope.linkModal.saveToProfile && !$scope.linkModal.phoneField) {
            alertify.error('Choose Primary or Alternate'); return;
        }
        var params = {
            CallLogId: $scope.linkModal.callLogId,
            PatientId: $scope.linkModal.selectedPatient.PatientId,
            UserId: $scope.UserId,
            SaveToProfile: $scope.linkModal.saveToProfile,
            PhoneField: $scope.linkModal.saveToProfile ? $scope.linkModal.phoneField : null
        }
        eHnoteMainAppointmentService.LinkTelnyxCallToPatient(params).then(function (resp) {

            console.log(resp);
            if (resp.data.Status === 'Success') {
                alertify.success('Call linked to patient');
                // Show the patient on the row straight away, then let the Calling Log
                // popup reload on its own scope (its callHistory shadows this one) so
                // the list and the cards keep the tab and dates the user picked.
                var c = $scope.linkModal.call, p = $scope.linkModal.selectedPatient;
                if (c) {
                    c.MatchedPatientId = p.PatientId;
                    c.PatientName = p.PatientName;
                    c.PatientMRN = p.PatientMRN;
                    c.PatientDOB = p.DOBFmt;
                }
                $scope.closeLinkModal();
                $scope.$broadcast('telnyxCallLinked');
            } else {
                alertify.error(resp.data.Message || 'Could not link');
            }
        });
    };


    $scope.closeLinkModal = function () { $scope.linkModal = { show: false }; };

    $scope.onLinkSearchChange = function () {
        var v = ($scope.linkModal.searchText || '').trim();
        $scope.linkModal.searched = false;
        if (v.length < 3) { $scope.linkModal.results = []; return; }
        $scope.linkModal.searching = true;
        if ($scope.linkSearchTimer) $timeout.cancel($scope.linkSearchTimer);
        $scope.linkSearchTimer = $timeout(function () {
            var digits = v.replace(/\D/g, '');
            var isName = /[a-zA-Z]/.test(v) && v.length >= 3;
            var dob = parseDialDob(v);
            var isPhone = !dob && !/[a-zA-Z]/.test(v) && digits.length >= 5;
            var params = {
                "PageSize": 30,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "SearchText": isName ? v : "",
                "PatientDisplayId": "",
                "OldPatientMRNO": "",
                "DOBSearch": dob || "",
                "PageNumber": 1,
                "StartAge": 0,
                "PhoneNumber": isPhone ? digits : "",
                "EndAge": 0,
                "IncludeCommDetails": "Y",
                "SearchDetails": { "listdocpatients": "Y" },
                "SearchMobile": 0,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "DoctorID": $scope.UserId,
                "GetAllSpecializationInd": true,
                "GetAllPatientInd": true,
                "hasparam": true
            };

            // same HospitalIDLst logic your SearchByText uses
            if ($scope.RoleId === 1) {
                params.HospitalIDLst = [doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID];
            } else {
                if (!$scope.listval || !$scope.listval.length) {
                    $scope.listval = [doctorinfo.doctordata.UserParentBranch[0].OrganizationId];
                }
                params.HospitalIDLst = $scope.listval;
            }

            eHnotePatientDataService.SearchAllPatientNew(params, function (data) {
                $scope.$applyAsync(function () {
                    $scope.linkModal.searching = false;
                    $scope.linkModal.searched = true;
                    var rows = (data && data.rows) ? angular.copy(data.rows) : [];
                    $scope.linkModal.results = rows.map(function (item) {
                        return {
                            PatientId: item.PatientId, PatientName: item.FullName,
                            PatientMRN: item.DisplayID || '',
                            MobileFmt: formatUsPhone(item.PhoneNumber),
                            DOBFmt: formatDob(item.DOB)
                        };
                    });
                });
            }, function () { $scope.$applyAsync(function () { $scope.linkModal.searching = false; }); });
        }, 400);
    };

    $scope.selectLinkPatient = function (p) {
        $scope.linkModal.selectedPatient = p;
        $scope.linkModal.results = [];
    };
    $scope.removeLinkPatient = function () {
        $scope.linkModal.selectedPatient = null;
    };
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }
});
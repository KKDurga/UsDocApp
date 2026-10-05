"use strict";
eHnoteWebApp.controller("UsPatientTrackerCtrl", ["$scope", "$http", "$log", "$rootScope", "$uibModal", "$routeParams", "$filter", "$timeout", "alertify", "eHnoteMasterDataService", "eHnoteUserDataService", "eHnoteMainAppointmentService", "eHnotePatientDataService", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnoteMainAdminServices", "datapersistanceFactory", "eHnoteLoginStatusService", "$window", "eHnotePatientVisitReasonServices", "$interval", "InventoryService", function ($scope, $http, $log, $rootScope, $uibModal, $routeParams, $filter, $timeout, alertify, eHnoteMasterDataService, eHnoteUserDataService, eHnoteMainAppointmentService, eHnotePatientDataService, eHnoteUserAppointmentDataService, localStorageFactory, eHnoteMainAdminServices, datapersistanceFactory, eHnoteLoginStatusService, $window, eHnotePatientVisitReasonServices, $interval, InventoryService) {


    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    $scope.SubOrganizationId = 0;
    $scope.connectedUserObj = {
        "Available": false,
        "Users": []
    };
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.connectedUserObj.Available = doctorinfo.doctordata.User[0].IsConnectedUsersAvailable || false;
        $scope.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;

    }

    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

    if ($scope.connectedUserObj.Available) {
        $scope.connectedUserObj.Users = doctorinfo.doctordata.UserAddress[0].ConnectedUsers || [];
    }
    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");

    var Index = -1;
    $scope.mainPatientTrackersArray = [];
    $scope.doctors = "";
    $scope.SubTab = 13;
    $scope.SearchObj = {
        "AppointmentDate": moment().format("MM-DD-YYYY"),
        "DoctorId": 0,
        "PatientId": 0,
        "selectedDoctor": {
            "UserFullName": "All Doctors"
        },
        "HospitalId": $scope.HospitalId,
        "PageSize": 350,
        "PageNumber": 1,
        "TotalCount": 0,
        "RoleId": 0,
        "UserRoomTypeId": 0,
        "RoleDetailsId": "",
        "RoleObj": "",
        "UserId": ""
    };

    $scope.RoomTypeId = 0;
    $scope.Status = 'All';

    $scope.mainCountobj = {
        "All": 0,
        "CheckInCount": 0,
        "CheckOutCount": 0,
        "NotCheckedInCount": 0,
        "ReceptionWaiting": 0,
        "CounselorWaiting": 0,
        "TechnicianWaiting": 0,
        "BillingWaiting": 0,
        "DoctorWaiting": 0,
        "OptomWaiting": 0,
        "OptomActive": 0,
        "TechnicianActive": 0,
        "DoctorActive": 0,
        "BillingActive": 0,
        "ReceptionActive": 0,
        "CounselorActive": 0,
        "AscWaiting": 0

    };

    $scope.getPatientTimingsCount = function () {
        var obj = {
            "AppointmentDate": $filter('date')($scope.SearchObj.AppointmentDate, "yyyy-MM-dd"),
            "DoctorId": $scope.SearchObj.DoctorId,
            "HospitalId": $scope.SearchObj.HospitalId,
            "UserId": $scope.SearchObj.UserId || 0
        };
        eHnotePatientDataService.getAppointmentPatientTrackerCount(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === 'Success') {
                $scope.mainCountobj.All = resp.data.All || 0;
                $scope.mainCountobj.CheckInCount = resp.data.CheckInCount;
                $scope.mainCountobj.NotCheckedInCount = resp.data.NotCheckedInCount || 0;
                $scope.mainCountobj.CheckOutCount = resp.data.CheckOutCount || 0;
                $scope.mainCountobj.ReceptionWaiting = resp.data.ReceptionWaiting;
                $scope.mainCountobj.AscWaiting = resp.data.AscWaiting || 0;
                $scope.mainCountobj.TechnicianWaiting = resp.data.TechnicianWaiting;
                $scope.mainCountobj.TechnicianActive = resp.data.TechnicianActive;
                $scope.mainCountobj.DoctorWaiting = resp.data.DoctorWaiting;
                $scope.mainCountobj.DoctorActive = resp.data.DoctorActive;
                $scope.mainCountobj.BillingWaiting = resp.data.BillingWaiting;
                $scope.mainCountobj.CounselorWaiting = resp.data.CounselorWaiting;
                $scope.mainCountobj.OptomActive = resp.data.OptomActive;
                $scope.mainCountobj.OptomWaiting = resp.data.OptomWaiting;
                $scope.mainCountobj.BillingActive = resp.data.BillingActive;
                $scope.mainCountobj.ReceptionActive = resp.data.ReceptionActive;
                $scope.mainCountobj.CounselorActive = resp.data.CounselorActive;

            }

        }, function (err) {
            console.log(err);
        });
    };


    $scope.getPatientTimingsList = function () {
        $scope.mainPatientTrackersArray = [];


        let currentTime = $filter("date")(new Date(), "HH:mm:ss");

        var obj = {
            "AppointmentDate": $filter('date')($scope.SearchObj.AppointmentDate, "yyyy-MM-dd"),
            "DoctorId": $scope.SearchObj.DoctorId,
            "HospitalId": $scope.SearchObj.HospitalId,
            "PatientId": $scope.SearchObj.PatientId,
            "PageSize": $scope.SearchObj.PageSize,
            "PageNumber": $scope.SearchObj.PageNumber,
            "RoomTypeId": $scope.RoomTypeId || 0,
            "Status": $scope.Status || "All",
            "RoleId": $scope.SearchObj.RoleId || 0,
            "UserRoomTypeId": $scope.SearchObj.UserRoomTypeId || 0,
            "UserId": $scope.SearchObj.UserId || 0,
            "CurrentTime": currentTime
        };
        //  eHnotePatientDataService.GetAppointmentTrackerDetails(obj).then(function (resp) {
        eHnotePatientDataService.SearchAppointmentTrackerDetailsByStatus(obj).then(function (resp) {
            console.log(resp);

            if (resp.data.status === 'Success') {
                $scope.mainPatientTrackersArray = resp.data.rows || [];
                $scope.SearchObj.TotalCount = resp.data.count || 0;

                if ($scope.mainPatientTrackersArray.length > 0) {
                    angular.forEach($scope.mainPatientTrackersArray, function (mainitem) {
                        if (mainitem.TrackerDetails.length > 0) {


                            angular.forEach(mainitem.TrackerDetails, function (item) {

                                item.FirstName = item.FirstName || '';
                                item.isWaitingSlot = false;
                                item.isActiveSlot = false;
                                item.isCompletedSlot = false;
                                item.isWaitNormalSlot = false;
                                item.isWaitGreenSlot = false;
                                item.isWaitYellowSlot = false;
                                item.isWaitRedSlot = false;
                                item.isActiveNormalSlot = false;
                                item.isActiveGreenSlot = false;
                                item.isActiveYellowSlot = false;
                                item.isActiveRedSlot = false;
                                item.isCompletedNormalSlot = false;
                                item.isCompletedGreenSlot = false;
                                item.isCompletedYellowSlot = false;
                                item.isCompletedRedSlot = false;



                                $scope.slotWaitNormalTime = { "Min": 0, "Max": 5 };
                                $scope.slotWaitGreenTime = { "Min": 5, "Max": 10 };
                                $scope.slotWaitYellowTime = { "Min": 10, "Max": 15 };
                                $scope.slotWaitRedTime = { "Min": 15, "Max": 60 };

                                $scope.slotActiveNormalTime = { "Min": 0, "Max": 5 };
                                $scope.slotActiveGreenTime = { "Min": 5, "Max": 10 };
                                $scope.slotActiveYellowTime = { "Min": 10, "Max": 15 };
                                $scope.slotActiveRedTime = { "Min": 15, "Max": 60 };



                                //Durga Code for SLots Base on 04-04-2023

                                //Reception Room
                                if (item.RoomTypeId === 10) {

                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 10;

                                    $scope.slotWaitYellowTime.Min = 10;
                                    $scope.slotWaitYellowTime.Max = 20;

                                    $scope.slotWaitRedTime.Min = 20;
                                    $scope.slotWaitRedTime.Max = 60;


                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 15;

                                    $scope.slotActiveYellowTime.Min = 15;
                                    $scope.slotActiveYellowTime.Max = 30;

                                    $scope.slotActiveRedTime.Min = 30;
                                    $scope.slotActiveRedTime.Max = 60;


                                }

                                //Technician Room
                                if (item.RoomTypeId === 2) {


                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 10;

                                    $scope.slotWaitYellowTime.Min = 10;
                                    $scope.slotWaitYellowTime.Max = 20;

                                    $scope.slotWaitRedTime.Min = 20;
                                    $scope.slotWaitRedTime.Max = 60;


                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 15;

                                    $scope.slotActiveYellowTime.Min = 15;
                                    $scope.slotActiveYellowTime.Max = 30;

                                    $scope.slotActiveRedTime.Min = 30;
                                    $scope.slotActiveRedTime.Max = 60;
                                }

                                //Optom Room
                                if (item.RoomTypeId === 12) {




                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 15;

                                    $scope.slotWaitYellowTime.Min = 15;
                                    $scope.slotWaitYellowTime.Max = 30;

                                    $scope.slotWaitRedTime.Min = 30;
                                    $scope.slotWaitRedTime.Max = 60;


                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 20;

                                    $scope.slotActiveYellowTime.Min = 20;
                                    $scope.slotActiveYellowTime.Max = 40;

                                    $scope.slotActiveRedTime.Min = 40;
                                    $scope.slotActiveRedTime.Max = 120;
                                }


                                //Docotr Room

                                if (item.RoomTypeId === 1) {



                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 15;

                                    $scope.slotWaitYellowTime.Min = 15;
                                    $scope.slotWaitYellowTime.Max = 30;

                                    $scope.slotWaitRedTime.Min = 30;
                                    $scope.slotWaitRedTime.Max = 60;


                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 20;

                                    $scope.slotActiveYellowTime.Min = 20;
                                    $scope.slotActiveYellowTime.Max = 40;

                                    $scope.slotActiveRedTime.Min = 40;
                                    $scope.slotActiveRedTime.Max = 120;
                                }

                                //Coordinator Room
                                if (item.RoomTypeId === 4) {

                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 10;

                                    $scope.slotWaitYellowTime.Min = 10;
                                    $scope.slotWaitYellowTime.Max = 20;

                                    $scope.slotWaitRedTime.Min = 20;
                                    $scope.slotWaitRedTime.Max = 60;


                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 15;

                                    $scope.slotActiveYellowTime.Min = 15;
                                    $scope.slotActiveYellowTime.Max = 30;

                                    $scope.slotActiveRedTime.Min = 30;
                                    $scope.slotActiveRedTime.Max = 60;
                                }

                                //Billing Room/CheckOutRoom

                                if (item.RoomTypeId === 9) {

                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 10;

                                    $scope.slotWaitYellowTime.Min = 10;
                                    $scope.slotWaitYellowTime.Max = 15;

                                    $scope.slotWaitRedTime.Min = 15;
                                    $scope.slotWaitRedTime.Max = 60;

                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 10;

                                    $scope.slotActiveYellowTime.Min = 10;
                                    $scope.slotActiveYellowTime.Max = 20;

                                    $scope.slotActiveRedTime.Min = 20;
                                    $scope.slotActiveRedTime.Max = 60;
                                }

                                item.CurrentStartTime = '';
                                var CStart = moment(item.WaitingStartTime, 'HH:mm:');
                                var newStartTime1 = $filter('date')(new Date(CStart), 'hh:mm a');
                                item.CurrentStartTime = newStartTime1;

                                /* item.UserId === 0 && item.RoomTypeId !== 0*/
                                if (item.Status === "Waiting") {
                                    item.isWaitingSlot = true;

                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                    var dresult = dateCompare(mainitem.AppointmentDate, currentDt);
                                    console.log(dresult + "__dresult");

                                    if (dresult) {
                                        var DiffMinutes = getcurrentTimeDifferenceMinutes(item.WaitingStartTime);
                                        var waittimec = getHrsnMinutesFormatfromMinutes(DiffMinutes);
                                        item.WaitTime = waittimec;

                                        console.log(DiffMinutes + "__DiffMinutes");
                                        console.log(waittimec + "__waittimec");

                                        if (DiffMinutes <= $scope.slotWaitNormalTime.Max) {
                                            item.isWaitNormalSlot = true;
                                        }
                                        else if (DiffMinutes > $scope.slotWaitGreenTime.Min && DiffMinutes <= $scope.slotWaitGreenTime.Max) {
                                            item.isWaitGreenSlot = true;
                                        }
                                        else if (DiffMinutes > $scope.slotWaitYellowTime.Min && DiffMinutes <= $scope.slotWaitYellowTime.Max) {
                                            item.isWaitYellowSlot = true;
                                        }
                                        else if (DiffMinutes > $scope.slotWaitRedTime.Min) {
                                            item.isWaitRedSlot = true;
                                        }
                                    }
                                    else {



                                        var actSt = item.WaitTime.split(':');
                                        var actSthour = parseFloat(actSt[0]) || 0;
                                        var actStmin = parseFloat(actSt[1]) || 0;
                                        var actStsec = parseFloat(actSt[2]) || 0;






                                        if (actSthour > 0) {
                                            item.isWaitRedSlot = true;
                                        } else {

                                            if (DiffMinutes <= $scope.slotActiveNormalTime.Max) {
                                                item.isWaitNormalSlot = true;
                                            }
                                            else if (DiffMinutes > $scope.slotActiveGreenTime.Min && DiffMinutes <= $scope.slotActiveGreenTime.Max) {
                                                item.isWaitGreenSlot = true;
                                            }
                                            else if (DiffMinutes > $scope.slotActiveYellowTime.Min && DiffMinutes <= $scope.slotActiveYellowTime.Max) {
                                                item.isWaitYellowSlot = true;
                                            }
                                            else if (DiffMinutes > $scope.slotActiveYellowTime.Min) {
                                                item.isWaitRedSlot = true;
                                            }

                                            item.WaitTime = actSt[1] + ":" + actSt[2];
                                        }


                                    }


                                }
                                else if (item.Status != "Waiting") {

                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                    var dresult = dateCompare(mainitem.AppointmentDate, currentDt)


                                    if (dresult) {
                                        var actSt = item.ActiveStartTime.split(':');
                                        var actSthour = parseFloat(actSt[0]) || 0;
                                        var actStmin = parseFloat(actSt[1]) || 0;
                                        var actStsec = parseFloat(actSt[2]) || 0;

                                        var actEt = item.ActiveEndTime.split(':');
                                        var actEthour = parseFloat(actEt[0]) || 0;
                                        var actEtmin = parseFloat(actEt[1]) || 0;
                                        var actEtsec = parseFloat(actEt[2]) || 0;

                                        if (actEthour == 0 && actEtmin === 0 && actEtsec == 0) {
                                            if (actSthour !== 0 || actStmin !== 0 || actStsec !== 0) {
                                                item.isActiveSlot = true;

                                                var activet = item.WaitTime.split(':');
                                                var activethour = parseFloat(activet[0]) || 0;
                                                var activetmin = parseFloat(activet[1]) || 0;
                                                var activetsec = parseFloat(activet[2]) || 0;



                                                if (activethour > 0) {
                                                    item.isActiveRedSlot = true;

                                                }
                                                else {

                                                    if (activetmin <= $scope.slotActiveNormalTime.Max) {
                                                        item.isActiveNormalSlot = true;
                                                    }
                                                    else if (activetmin > $scope.slotActiveGreenTime.Min && activetmin <= $scope.slotActiveGreenTime.Max) {
                                                        item.isActiveGreenSlot = true;
                                                    }
                                                    else if (activetmin > $scope.slotActiveYellowTime.Min && activetmin <= $scope.slotActiveYellowTime.Max) {
                                                        item.isActiveYellowSlot = true;
                                                    }
                                                    else if (activetmin > $scope.slotActiveRedTime.Min) {
                                                        item.isActiveRedSlot = true;
                                                    }

                                                    item.WaitTime = activet[1] + ":" + activet[2];

                                                }


                                                var DiffMinutes = getcurrentTimeDifferenceMinutes(item.ActiveStartTime);
                                                var ActiveTimec = getHrsnMinutesFormatfromMinutes(DiffMinutes);
                                                item.ActiveTime = ActiveTimec;
                                                var newactivet = item.ActiveTime.split(':');
                                                var newactivethour = parseFloat(newactivet[0]) || 0;
                                                var newactivetmin = parseFloat(newactivet[1]) || "00";
                                                var newactivetsec = parseFloat(newactivet[2]) || "00";

                                                if (newactivethour > 0) {
                                                    item.ActiveTime = newactivethour + ":" + newactivetmin + ":" + newactivetsec;
                                                } else {
                                                    item.ActiveTime = newactivetmin + ":" + newactivetsec;
                                                }
                                            }
                                        }
                                        else {
                                            item.isCompletedSlot = true;

                                            var activet = item.WaitTime.split(':');
                                            var activethour = parseFloat(activet[0]) || 0;
                                            var activetmin = parseFloat(activet[1]) || 0;
                                            var activetsec = parseFloat(activet[2]) || 0;


                                            if (activethour > 0) {
                                                item.isCompletedRedSlot = true;

                                            }
                                            else {

                                                if (activetmin <= $scope.slotActiveNormalTime.Max) {
                                                    item.isCompletedNormalSlot = true;
                                                }
                                                else if (activetmin > $scope.slotActiveGreenTime.Min && activetmin <= $scope.slotActiveGreenTime.Max) {
                                                    item.isCompletedGreenSlot = true;
                                                }
                                                else if (activetmin > $scope.slotActiveYellowTime.Min && activetmin <= $scope.slotActiveYellowTime.Max) {
                                                    item.isCompletedYellowSlot = true;
                                                }
                                                else if (activetmin > $scope.slotActiveRedTime.Min) {
                                                    item.isCompletedRedSlot = true;
                                                }

                                                item.WaitTime = activet[1] + ":" + activet[2];
                                            }

                                            var newactivet = item.ActiveTime.split(':');
                                            var newactivethour = parseFloat(newactivet[0]) || 0;
                                            var newactivetmin = parseFloat(newactivet[1]) || 0;
                                            var newactivetsec = parseFloat(newactivet[2]) || 0;

                                            if (newactivethour > 0) {

                                            } else {
                                                item.ActiveTime = newactivet[1] + ":" + newactivet[2];
                                            }

                                        }
                                    }
                                    else {



                                        var actSt = item.WaitTime.split(':');
                                        var actSthour = parseFloat(actSt[0]) || 0;
                                        var actStmin = parseFloat(actSt[1]) || 0;
                                        var actStsec = parseFloat(actSt[2]) || 0;


                                        if (actSthour > 0) {
                                            item.isCompletedSlot = true;
                                        } else {

                                            if (actStmin <= $scope.slotActiveNormalTime.Max) {
                                                item.isCompletedNormalSlot = true;
                                            }
                                            else if (actStmin > $scope.slotActiveGreenTime.Min && actStmin <= $scope.slotActiveGreenTime.Max) {
                                                item.isCompletedGreenSlot = true;
                                            }
                                            else if (actStmin > $scope.slotActiveYellowTime.Min && actStmin <= $scope.slotActiveYellowTime.Max) {
                                                item.isCompletedYellowSlot = true;
                                            }
                                            else if (actStmin > $scope.slotActiveRedTime.Min) {
                                                item.isCompletedRedSlot = true;
                                            }

                                            item.WaitTime = actSt[1] + ":" + actSt[2];
                                        }


                                        var newactivet = item.ActiveTime.split(':');
                                        var newactivethour = parseFloat(newactivet[0]) || 0;


                                        if (newactivethour > 0) {

                                        } else {
                                            item.ActiveTime = newactivet[1] + ":" + newactivet[2];
                                        }
                                    }


                                }

                            });
                        }
                        mainitem.AppointmentCheckInDelayTime = mainitem.AppointmentCheckInDelayTime || '';
                        mainitem.IsDelayTimeInd = false;
                        if (mainitem.AppointmentCheckInDelayTime != "") {
                            var delay = mainitem.AppointmentCheckInDelayTime.substring(0, 1);
                            if (delay == '-') {
                                // mainitem.IsDelayTimeInd = true;
                                mainitem.AppointmentCheckInDelayTime = mainitem.AppointmentCheckInDelayTime.replace("-", "");
                            }
                            //else {
                            //    mainitem.IsDelayTimeInd = false;
                            //}
                            var apptTime = new Date(mainitem.AppointmentDate + ' ' + mainitem.AppointmentStartTime);
                            var CheckTime = new Date(mainitem.AppointmentDate + ' ' + mainitem.CheckInTime);
                            var timeOneUnix = apptTime.getTime();
                            var timeTwoUnix = CheckTime.getTime();
                            if (timeTwoUnix - timeOneUnix >= 15 * 60 * 1000) {
                                mainitem.IsDelayTimeInd = true;
                            } else {
                                mainitem.IsDelayTimeInd = false;
                            }

                        }

                        var datetime = mainitem.AppointmentDate + "T" + mainitem.AppointmentStartTime;
                        mainitem.ConvertAppointmentStartTime = $filter('date')(datetime, "hh:mm a");

                        var datetime1 = mainitem.AppointmentDate + "T" + mainitem.CheckInTime;
                        mainitem.ConvertCheckInTime = $filter('date')(datetime1, "hh:mm a");
                    });

                }



            }

        }, function (err) {
            console.log(err);
        });
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

    function getcurrentTimeDifferenceMinutes(time) {
        var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
        var waitingconcat = currentDt + " " + time;
        var startDate = new Date()
        var endDate = new Date(waitingconcat);
        var seconds = Math.round((startDate.getTime() - endDate.getTime()) / 1000);
        var minutss = Math.round(seconds / 60);
        return minutss || 0;
    }

    function getHrsnMinutesFormatfromMinutes(minutes) {
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        var hm = "";
        if (h == 0) {
            hm = m + ':00';
        } else {
            hm = h + ':' + m + ':00';
        }

        return hm;
    }


    //$scope.init = function () {
    //    for (let i = 0; i <= 20; i++) {
    //        var trackerObj = {
    //            "PatientId": "12",
    //            "PatientName": "Durga Reddy",
    //            "PatientMrNo": "MRK10031",
    //            "PatientGender": "M",
    //            "PatientMobile": "9700056151",
    //            "PatientEmail": "kkolla@appdes.com",
    //            "AppointmentDate": "09-15-2022",
    //            "AppointmentStartTime": "16:00",
    //            "AppointmentEndTime": "16:30",
    //            "AppointmentDuration": "30",
    //            "AppointmentDoctorId": "1",
    //            "AppointmentDoctorName": "Dr.Amarnath Reddy",
    //            "VisitReason": "Right Eye Redness and watering",
    //            "CheckInTime": "09-15-2022 16:05",
    //            "ArrivalDelay": "00:05",
    //            "ReceptionStartTime": "00:05",
    //            "ReceptionEndTime": "00:00",
    //            "ReceptionActiveTime": "00:02",
    //            "TechnicianStartTime": "00:00",
    //            "TechnicianEndTime": "00:04",
    //            "TechnicianActiveTime": "00:00",
    //            "DoctorStartTime": "00:10",
    //            "DoctorEndTime": "00:05",
    //            "DoctorActiveTime": "00:05",
    //            "OptometristStartTime": "00:05",
    //            "OptometristEndTime": "00:02",
    //            "OptometristActiveTime": "00:07",
    //            "BillingStartTime": "00:01",
    //            "BillingEndTime": "00:02",
    //            "BillingActiveTime": "00:01",
    //            "TotalPatientWaitTime": "00.13"
    //        }
    //        $scope.mainPatientTrackersArray.push(trackerObj);
    //    }

    //    $scope.getPatientTimingsList();
    //};

    $scope.clinicDoctorList = [];
    $scope.BranchesListArray = [];
    $scope.selectedBranch = "";
    $scope.allSubSpecializationsArray = [];
    $scope.newAllSubSpecializationsArray = [];
    $scope.newAllDoctorsArray = [];
    $scope.selectedSubSpecializationArray = [];
    $scope.clinicOptometristsList = [];
    $scope.clinicARAssistantList = [];
    $scope.clinicDoctorDepList = [];
    $scope.allUserList = [];
    $scope.getDoctorsbySubSpecializations = function (branchId, pagetype) {
        var branchesList = [];
        $scope.clinicDoctorList = [];
        $scope.clinicDoctorAllList = [];
        $scope.allUserList = [];
        $scope.selectedDoctor = "";
        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId === branchId; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        }
        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": hospitalID,
            "SubSpecializationIdArray": subSplArray
        }

        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.clinicDoctorList = [];
                $scope.AllclinicDoctorList = [];
                $scope.Calendardoctorlist1 = [];
                $scope.allUserList = resp.rows;
                var RoleID = $scope.userLoginDetails.RoleID;
                $scope.AllCounsollerList = angular.copy($scope.allUserList);
                $scope.AllDilationList = angular.copy($scope.allUserList);
                $scope.AllTechnicianList = angular.copy($scope.allUserList);
                $scope.AllOpthaList = angular.copy($scope.allUserList);
                $scope.AllDoctorList = angular.copy($scope.allUserList);
                $scope.AllARList = angular.copy($scope.allUserList);
                $scope.AllBillingList = angular.copy($scope.allUserList);

                $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                });
                $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                    return item.RoleId === 10;
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
                $scope.AllARList = _.uniq($scope.AllARList, false, function (p) { return p.DoctorID; });
                $scope.AllARList = $filter("filter")($scope.AllARList, function (item) {
                    return item.RoleId === 61;
                });
                $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                    return item.RoleId === 2 || item.RoleId === 10;
                });

                $scope.AllReceptionList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                $scope.AllReceptionList = $filter("filter")($scope.AllBillingList, function (item) {
                    return item.RoleId === 2;
                });

                $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    if (Aitem.RoleId === 10) {
                        $scope.clinicOptometristsList.push(Aitem);
                    }
                    if (Aitem.RoleId === 61) {
                        $scope.clinicARAssistantList.push(Aitem);
                    }
                });
                $scope.clinicOptometristsList = _.uniq($scope.clinicOptometristsList, false, function (p) { return p.DoctorID; });
                $scope.clinicARAssistantList = _.uniq($scope.clinicARAssistantList, false, function (p) { return p.DoctorID; });


                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    //  angular.forEach(Aitem.UserBranchRoles, function (item) {
                    if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                        $scope.AllclinicDoctorList.push(Aitem);
                    }
                    if (Aitem.RoleId === 4) {
                        $scope.Calendardoctorlist1.push(Aitem);
                    }

                    //  });
                });


                if ($scope.AllclinicDoctorList.length > 0) {
                    if ($scope.connectedUserObj.Available && $scope.connectedUserObj.Users.length > 0) {
                        angular.forEach($scope.AllclinicDoctorList, function (kitem) {
                            if (kitem.DoctorID === doctorinfo.doctordata.User[0].DoctorID) {
                                kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.FullName;
                                $scope.clinicDoctorList.push(kitem);

                            } else {
                                var filteredArray = $filter("filter")($scope.connectedUserObj.Users, { "ChildUserId": kitem.DoctorID }, true);
                                if (filteredArray.length > 0) {
                                    kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.FullName;
                                    $scope.clinicDoctorList.push(kitem);

                                };
                            }
                        });

                    } else {
                        angular.forEach($scope.AllclinicDoctorList, function (kitem) {
                            kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.FullName;
                            $scope.clinicDoctorList.push(kitem);
                        });
                    }

                }


                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15, "UserFullName": "All Doctors" };
                $scope.clinicDoctorList.unshift(docAll);
                var opthoall = { "DoctorID": 0, "FullName": "All Optometrists", "AddressID": 0, "MinPerCase": 15 };
                $scope.clinicOptometristsList.unshift(opthoall);
                var Arall = { "DoctorID": 0, "FullName": "All AR", "AddressID": 0, "MinPerCase": 15 };
                $scope.clinicARAssistantList.unshift(Arall);

                Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                if (Index > -1) {
                    $scope.selectedDoctor = $scope.clinicDoctorList[Index];
                } else {
                    $scope.selectedDoctor = $scope.clinicDoctorList[0];
                }



                if (RoleID === 1 || RoleID === 56) {
                    $scope.clinicDoctorList = [];
                    angular.forEach($scope.allUserList, function (Aitem) {
                        if (Aitem.RoleId === 1 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 56 || Aitem.RoleId === 57 || Aitem.RoleId === 10) {
                            //if ($scope.selectedBranch.ClinicId === 0) {
                            //    $scope.clinicDoctorList.push(Aitem);
                            //} else {
                            //    if (Aitem.BranchId === $scope.selectedBranch.ClinicId) {
                            //        $scope.clinicDoctorList.push(Aitem);
                            //    }
                            //}
                            $scope.clinicDoctorList.push(Aitem);
                        }
                    });
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15, "UserFullName": "All Doctors" };
                    $scope.clinicDoctorList.unshift(docAll);
                    $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                }


                if (!$scope.UserAccessRights.AllAccessRights.APPListAllDoctorAppointments) {
                    $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorinfo.doctordata.User[0].DoctorID }, true);
                    $scope.selectedDoctor = $scope.clinicDoctorList[0];
                }

                if (RoleID === 1 && $scope.OrganizationSettingsData.ConsultationSettings != undefined) {
                    if (RoleID === 1 && $scope.OrganizationSettingsData.ConsultationSettings.IsConsultationRestricted === 1) {
                        $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorinfo.doctordata.User[0].DoctorID }, true);
                        $scope.selectedDoctor = $scope.clinicDoctorList[0];

                        $scope.SearchObj.selectedDoctor = $scope.clinicDoctorList[0];
                        $scope.SearchObj.DoctorId = $scope.clinicDoctorList[0].DoctorID;
                    }
                }


                if (RoleID === 10) {
                    Index = $scope.clinicOptometristsList.findIndex(record => record.DoctorID === $scope.SelectedOptometristId);
                    if (Index > -1) {
                        $scope.selectedOptometrist = $scope.clinicOptometristsList[Index];
                    }
                }
                if (RoleID === 61) {
                    Index = $scope.clinicARAssistantList.findIndex(record => record.DoctorID === $scope.SelectedArId);
                    if (Index > -1) {
                        $scope.selectedArObject = $scope.clinicARAssistantList[Index];
                    }
                }

                console.log($scope.clinicDoctorList);

                $scope.getPatientTimingsList();
                $scope.getPatientTimingsCount();

            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.mainBookedAppointmentList = [];
                $scope.mainDilationAppointmentList = [];
            }
        }

        function onGetUsersFailure(data) {
        }

    }

    function GetBranchSubSpecializations(SubOrganizationId, BranchId, pagetype) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;

                if (pagetype === 'PageLoad') {
                    $scope.newAllSubSpecializationsArray = angular.copy(resp.data.row);
                }


                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                $scope.getDoctorsbySubSpecializations(BranchId, pagetype);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.newAllSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }
        });
    };
    $scope.OrgSpecialitiesArray = [];
    function getBranchSpecializations(SubOrganizationId, BranchId, pagetype) {
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
    }


    function InitializeBranches(data, pagetype) {
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorinfo) || [];
        $scope.BranchesListArray = clinicAddress;
        $scope.AppListdoctoraddress = clinicAddress;
        $scope.AppListselectedclinic = $scope.AppListdoctoraddress[0];

        var RoleID = $scope.userLoginDetails.RoleID;

        $scope.clinicDoctorList = [];

        $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) {
            return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
        });

        $scope.selectedBranch = $scope.defaultbranch[0];
        $scope.AppListselectedclinic = $scope.defaultbranch[0];
        if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
            angular.forEach($scope.AppListdoctoraddress, function (item, index) {
                if (item.ClinicName !== "All Locations") {
                    if (item.ClinicId === $scope.hospid) {
                        $scope.selectedBranch = item;
                        $scope.AppListselectedclinic = item;
                        eHnoteMasterDataService.addSelectedHospitalinAppList(item);
                    }
                }
            });
        }
        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                $scope.AppListselectedclinic.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }
        getBranchSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);
    };

    //$scope.allRolesList = [];

    //$scope.getSubOrgRoles = function (SubOrganizationId) {
    //    eHnoteMainAdminServices.GetSubOrganizationsRolesbyId(SubOrganizationId).then(function (resp) {
    //        console.log(resp.data);
    //        if (resp.data.row.length > 0) {
    //            $scope.allRolesList = resp.data.row;

    //            console.log($scope.allRolesList);
    //            $scope.RolesList = $filter("filter")($scope.allRolesList, function (item) {
    //                return item.RoleId === 64 || item.RoleId === 62 || item.RoleId === 2 || item.RoleId === 10 || item.RoleId === 1 || item.RoleId === 18 || item.RoleId === 19 ;
    //            });

    //        } else {
    //            $scope.allRolesList = [];
    //        }
    //    });

    //};


    $scope.init = function () {


        var emptyARray = [];
        eHnoteMasterDataService.addCalendarDoctorinAppList(emptyARray);
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeBranches(NewBranchList, "PageLoad");
        eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
        function onspecsuccess(data) {
            $scope.specialitylist = data;
            var specAll = { "Id": 0, "Name": "All" };
            $scope.specialitylist.unshift(specAll);
        }

        function onspecfailure(data) {
        }


        $scope.GetSearchPatient = {
            "SearchText": "",
            "TypeId": 2,
            "IsPatientNameInd": false,
            "PaientMRNO": "",
            "PatientOldMrNo": "",
            "DOBSearch": "",
            "DOBSearchf":"",
        };
        //  $scope.getSubOrgRoles($scope.SubOrganizationId);
    };

    $scope.init();

    //$scope.ChangePatientSearch = function (type) {
    //    $scope.GetSearchPatient.TypeId = type;
    //    $scope.GetPatientsList = [];
    //    $scope.GetSearchPatient.SearchText = "";
    //    $scope.GetSearchPatient.PaientMRNO = "";
    //    $scope.GetSearchPatient.PatientOldMrNo = "";
    //    $scope.GetSearchPatient.IsPatientNameInd = false;
    //}

    $scope.ChangePatientSearch = function (type) {
        $scope.GetSearchPatient.TypeId = type;
        $scope.GetPatientsList = [];

        if (type == "1") {
            if ($scope.GetSearchPatient.PaientMRNO !== "") {
                $scope.GetSearchPatient.SearchText = $scope.GetSearchPatient.PaientMRNO;
            }
            if ($scope.GetSearchPatient.PatientOldMrNo !== "") {
                $scope.GetSearchPatient.SearchText = $scope.GetSearchPatient.PatientOldMrNo;
            }
            if ($scope.GetSearchPatient.DOBSearch !== "") {
                $scope.GetSearchPatient.SearchText = $scope.GetSearchPatient.DOBSearch;
            }
        }
        if (type == "2") {
            if ($scope.GetSearchPatient.SearchText !== "") {
                $scope.GetSearchPatient.PaientMRNO = $scope.GetSearchPatient.SearchText;
            }
            if ($scope.GetSearchPatient.PatientOldMrNo !== "") {
                $scope.GetSearchPatient.PaientMRNO = $scope.GetSearchPatient.PatientOldMrNo;
            }
            if ($scope.GetSearchPatient.DOBSearch !== "") {
                $scope.GetSearchPatient.PaientMRNO = $scope.GetSearchPatient.DOBSearch;
            }
        }
        if (type == "3") {
            if ($scope.GetSearchPatient.SearchText !== "") {
                $scope.GetSearchPatient.PatientOldMrNo = $scope.GetSearchPatient.SearchText;
            }
            if ($scope.GetSearchPatient.PaientMRNO !== "") {
                $scope.GetSearchPatient.PatientOldMrNo = $scope.GetSearchPatient.PaientMRNO;
            }
            if ($scope.GetSearchPatient.DOBSearch !== "") {
                $scope.GetSearchPatient.PatientOldMrNo = $scope.GetSearchPatient.DOBSearch;
            }
        }
        if (type == "4") {
            if ($scope.GetSearchPatient.SearchText !== "") {
                $scope.GetSearchPatient.DOBSearch = $scope.GetSearchPatient.SearchText;
            }
            if ($scope.GetSearchPatient.PaientMRNO !== "") {
                $scope.GetSearchPatient.DOBSearch = $scope.GetSearchPatient.PaientMRNO;
            }
            if ($scope.GetSearchPatient.PatientOldMrNo !== "") {
                $scope.GetSearchPatient.DOBSearch = $scope.GetSearchPatient.PatientOldMrNo;
            }
        }


        $scope.GetSearchPatient.IsPatientNameInd = false;
        //$scope.GetSearchPatient.SearchText = "";
        //$scope.GetSearchPatient.PaientMRNO = "";
        //$scope.GetSearchPatient.PatientOldMrNo = "";
    }

    //$interval(function () {
    //    $scope.getPatientTimingsList();
    //    $scope.getPatientTimingsCount();

    //}, 300000);

    //$interval(function () {
    //    $scope.SearchObj = {
    //        "AppointmentDate": moment().format("MM-DD-YYYY"),
    //        "DoctorId": 0,
    //        "PatientId": 0,
    //        "HospitalId": $scope.HospitalId,
    //        "PageSize": 10,
    //        "PageNumber": 1,
    //        "TotalCount": 0
    //    };
    //    $scope.GetSearchPatient = {
    //        "SearchText": "",
    //        "TypeId": 1
    //    };
    //    $scope.getPatientTimingsList();
    //    $scope.getPatientTimingsCount();

    //}, 900000);



    $scope.changeDateForPatientTracker = function (date) {
        $scope.SearchObj.AppointmentDate = $filter('date')($scope.SearchObj.AppointmentDate, "MMM-dd-yyyy");
        var date = $scope.SearchObj.AppointmentDate;
        console.log(date);
        //$scope.getPatientTimingsList();
        //$scope.getPatientTimingsCount();
    };
    $scope.LoadPatientSearch = function (val, type, gettype) {
        $scope.GetPatientsList = [];
        val = val || "";

        if (type === 1) {
            if (val.length < 3) {
                return false;
            }
        } else if (type === 2) {
            if (val.length !== 10) {
                return false;
            }
        }
        else if (type === 4) {
            if (val.length !== 10) {
                return false;
            }
        }

        //if (type === 1) {
        //    var obj = {
        //        "ParentOrganizationId": $scope.ParenthospitalId,
        //        "Name": val,
        //        "Mobile": null,
        //        "PatientId": null,
        //        "PageSize": 10,
        //        "PageNo": 1
        //    };
        //} else if (type === 2) {
        //    var obj = {
        //        "ParentOrganizationId": $scope.ParenthospitalId,
        //        "Name": null,
        //        "Mobile": null,
        //        "PatientId": val,
        //        "PageSize": 10,
        //        "PageNo": 1
        //    };
        //}

        //return InventoryService.SearchInvPatient(obj).then(function (resp) {
        //    //$scope.PatientsList = [];
        //    //$scope.GetPatientsList = [];
        //    if (resp.data.data.length !== 0) {
        //        if (resp.data.data != undefined) {
        //            $scope.GetPatientsList = resp.data.data || [];
        //        }
        //        //return $scope.GetPatientsList.map(function (item) {
        //        //    if (item.MobileNo === 0) {
        //        //        item.MobileNo = "";
        //        //    }
        //        //    return item;
        //        //});

        //    }
        //}, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
        if (type === 1) {
            var obj = {
                "SearchText": val,
                "DoctorId": $scope.SearchObj.DoctorId || 0,
                "BranchId": $scope.HospitalId,
                "AppointmentDate": $filter('date')($scope.SearchObj.AppointmentDate, "yyyy-MM-dd"),
                "AllDoctorInd": 0,
                "MRNumber": ""
            };


        }
        else if (type === 2) {
            var obj = {
                "SearchText": "",
                "DoctorId": $scope.SearchObj.DoctorId || 0,
                "BranchId": $scope.HospitalId,
                "AppointmentDate": $filter('date')($scope.SearchObj.AppointmentDate, "yyyy-MM-dd"),
                "MRNumber": val,
                "AllDoctorInd": 0
            };
        }
        else if (type === 4) {
            var obj = {
                "SearchText": val,
                "DoctorId": $scope.SearchObj.DoctorId || 0,
                "BranchId": $scope.HospitalId,
                "AppointmentDate": $filter('date')($scope.SearchObj.AppointmentDate, "yyyy-MM-dd"),
                "AllDoctorInd": 0,
                "MRNumber": ""
            };


        }

        return eHnotePatientDataService.SearchAppointmentPatients(obj).then(function (resp) {


            resp.data.rows = resp.data.rows || [];

            if (resp.data.rows.length !== 0) {
                $scope.GetPatientsList = resp.data.rows || [];
            }
        }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });

    };

    $scope.changeAppointmentDoctor = function (SelectedDoctorId) {
        SelectedDoctorId = parseInt(SelectedDoctorId);
        $scope.SelectedBranchDocId = SelectedDoctorId;
        $scope.SearchObj.selectedDoctor = "";
        var Index = 0;
        if (SelectedDoctorId != 0) {
            Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === SelectedDoctorId);
            $scope.SearchObj.DoctorId = SelectedDoctorId;
        }
        if (Index > -1) {
            $scope.SearchObj.selectedDoctor = $scope.clinicDoctorList[Index];
            $scope.SearchObj.DoctorId = SelectedDoctorId;
        }
        console.log($scope.SearchObj.selectedDoctor);


        //$scope.getPatientTimingsList();
        //$scope.getPatientTimingsCount();

    };

    $scope.Searchlist = function () {
        $scope.getPatientTimingsList();
        $scope.getPatientTimingsCount();
        $scope.GetSearchPatient.SearchText = "";
        $scope.GetSearchPatient.PaientMRNO = "";
        $scope.GetSearchPatient.PatientOldMrNo = "";
        $scope.GetSearchPatient.IsPatientNameInd = false;
    };
    $scope.Clearlist = function () {
        $scope.SearchObj = {
            "AppointmentDate": moment().format("MM-DD-YYYY"),
            "DoctorId": 0,
            "PatientId": 0,
            "HospitalId": $scope.HospitalId,
            "PageSize": 350,
            "PageNumber": 1,
            "TotalCount": 0,
            "RoleId": 0,
            "UserRoomTypeId": 0,
            "RoleDetailsId": "",
            "UserId": ""
        };
        $scope.GetSearchPatient = {
            "SearchText": "",
            "TypeId": 1,
            "IsPatientNameInd": false,
            "PaientMRNO": "",
            "PatientOldMrNo": ""
        };
        $scope.getPatientTimingsList();
        $scope.getPatientTimingsCount();
    };


    $scope.changePageNoForTracker = function (pageno) {
        $scope.SearchObj.PageNumber = pageno;
        $scope.getPatientTimingsList();
    };

    $scope.getFavClassIcon = function (item) {

        var defaultclass = 'tracker-completed-time';

        if (item.isWaitingSlot) {
            if (item.isWaitNormalSlot) {
                defaultclass = 'tracker-completed-time';
            } else if (item.isWaitGreenSlot) {
                defaultclass = 'bgtracker-extra-time';
            } else if (item.isWaitYellowSlot) {
                defaultclass = 'bgtracker-wait-time';
            } else if (item.isWaitRedSlot) {
                defaultclass = 'bgtracker-over-time';
            }
        }

        if (item.isCompletedSlot) {

            if (item.isCompletedNormalSlot) {
                defaultclass = 'tracker-completed-time';
            } else if (item.isCompletedGreenSlot) {
                defaultclass = 'tracker-doctor-time';
            } else if (item.isCompletedYellowSlot) {
                defaultclass = 'tracker-counsoller-time';
            } else if (item.isCompletedRedSlot) {
                defaultclass = 'tracker-optometrist-time';
            }
        }

        if (item.isActiveSlot) {
            if (item.isActiveNormalSlot) {
                defaultclass = 'tracker-completed-time';
            } else if (item.isActiveGreenSlot) {
                defaultclass = 'tracker-doctor-time';
            } else if (item.isActiveYellowSlot) {
                defaultclass = 'tracker-counsoller-time';
            } else if (item.isActiveRedSlot) {
                defaultclass = 'tracker-optometrist-time';
            }
        }
        return defaultclass;
    };
    $scope.SelectedPatient = function (patientitem) {
        $scope.GetPatientsList = [];
        $scope.GetSearchPatient.SearchText = patientitem.fullname;
        $scope.SearchObj.PatientId = patientitem.PatientId;
    };



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
        $scope.SetupPopUp = $uibModal.open({
            "templateUrl": 'appointMentPopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "appointment-full-popup",
            // "size": "lg"
            //   "windowClass": "inventory-full-popup"

        });
    };
    $scope.$on('closePopup', function (event) {
        $scope.SetupPopUp.dismiss('cancel');
    });

    $scope.changeActiveSubTab = function (RoomTypeId, Status, SubTab) {
        $scope.SubTab = SubTab;
        $scope.Status = Status;
        $scope.RoomTypeId = RoomTypeId;
        $scope.GetSearchPatient.SearchText = "";
        $scope.GetSearchPatient.PaientMRNO = "";
        $scope.GetSearchPatient.PatientOldMrNo = "";
        $scope.GetSearchPatient.IsPatientNameInd = false;

        let currentTime = $filter("date")(new Date(), "HH:mm:ss");
        var obj = {
            "AppointmentDate": $filter('date')($scope.SearchObj.AppointmentDate, "yyyy-MM-dd"),
            "DoctorId": $scope.SearchObj.DoctorId,
            "HospitalId": $scope.SearchObj.HospitalId,
            "PatientId": $scope.SearchObj.PatientId,
            "PageSize": $scope.SearchObj.PageSize,
            "PageNumber": $scope.SearchObj.PageNumber,
            "RoomTypeId": RoomTypeId,
            "Status": Status || "All",
            "RoleId": $scope.SearchObj.RoleId || 0,
            "UserRoomTypeId": $scope.SearchObj.UserRoomTypeId || 0,
            "UserId": $scope.SearchObj.UserId || 0,
            "CurrentTime": currentTime
        };
        eHnotePatientDataService.SearchAppointmentTrackerDetailsByStatus(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.status === 'Success') {
                $scope.mainPatientTrackersArray = resp.data.rows;
                $scope.SearchObj.TotalCount = resp.data.count || 0;
                if ($scope.mainPatientTrackersArray.length > 0) {
                    angular.forEach($scope.mainPatientTrackersArray, function (mainitem) {
                        if (mainitem.TrackerDetails.length > 0) {


                            angular.forEach(mainitem.TrackerDetails, function (item) {
                                item.FirstName = item.FirstName || '';
                                item.isWaitingSlot = false;
                                item.isActiveSlot = false;
                                item.isCompletedSlot = false;
                                item.isWaitNormalSlot = false;
                                item.isWaitGreenSlot = false;
                                item.isWaitYellowSlot = false;
                                item.isWaitRedSlot = false;
                                item.isActiveNormalSlot = false;
                                item.isActiveGreenSlot = false;
                                item.isActiveYellowSlot = false;
                                item.isActiveRedSlot = false;
                                item.isCompletedNormalSlot = false;
                                item.isCompletedGreenSlot = false;
                                item.isCompletedYellowSlot = false;
                                item.isCompletedRedSlot = false;



                                console.log(item.UserId + "__" + item.RoomTypeId);

                                $scope.slotWaitNormalTime = { "Min": 0, "Max": 5 };
                                $scope.slotWaitGreenTime = { "Min": 5, "Max": 10 };
                                $scope.slotWaitYellowTime = { "Min": 10, "Max": 15 };
                                $scope.slotWaitRedTime = { "Min": 15, "Max": 60 };

                                $scope.slotActiveNormalTime = { "Min": 0, "Max": 5 };
                                $scope.slotActiveGreenTime = { "Min": 5, "Max": 10 };
                                $scope.slotActiveYellowTime = { "Min": 10, "Max": 15 };
                                $scope.slotActiveRedTime = { "Min": 15, "Max": 60 };



                                //Durga Code for SLots Base on 04-04-2023

                                //Reception Room
                                if (item.RoomTypeId === 10) {

                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 10;

                                    $scope.slotWaitYellowTime.Min = 10;
                                    $scope.slotWaitYellowTime.Max = 20;

                                    $scope.slotWaitRedTime.Min = 20;
                                    $scope.slotWaitRedTime.Max = 60;


                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 15;

                                    $scope.slotActiveYellowTime.Min = 15;
                                    $scope.slotActiveYellowTime.Max = 30;

                                    $scope.slotActiveRedTime.Min = 30;
                                    $scope.slotActiveRedTime.Max = 60;


                                }

                                //Technician Room
                                if (item.RoomTypeId === 2) {


                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 10;

                                    $scope.slotWaitYellowTime.Min = 10;
                                    $scope.slotWaitYellowTime.Max = 20;

                                    $scope.slotWaitRedTime.Min = 20;
                                    $scope.slotWaitRedTime.Max = 60;


                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 15;

                                    $scope.slotActiveYellowTime.Min = 15;
                                    $scope.slotActiveYellowTime.Max = 30;

                                    $scope.slotActiveRedTime.Min = 30;
                                    $scope.slotActiveRedTime.Max = 60;
                                }

                                //Optom Room
                                if (item.RoomTypeId === 12) {




                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 15;

                                    $scope.slotWaitYellowTime.Min = 15;
                                    $scope.slotWaitYellowTime.Max = 30;

                                    $scope.slotWaitRedTime.Min = 30;
                                    $scope.slotWaitRedTime.Max = 60;


                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 20;

                                    $scope.slotActiveYellowTime.Min = 20;
                                    $scope.slotActiveYellowTime.Max = 40;

                                    $scope.slotActiveRedTime.Min = 40;
                                    $scope.slotActiveRedTime.Max = 120;
                                }


                                //Docotr Room

                                if (item.RoomTypeId === 1) {



                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 15;

                                    $scope.slotWaitYellowTime.Min = 15;
                                    $scope.slotWaitYellowTime.Max = 30;

                                    $scope.slotWaitRedTime.Min = 30;
                                    $scope.slotWaitRedTime.Max = 60;


                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 20;

                                    $scope.slotActiveYellowTime.Min = 20;
                                    $scope.slotActiveYellowTime.Max = 40;

                                    $scope.slotActiveRedTime.Min = 40;
                                    $scope.slotActiveRedTime.Max = 120;
                                }

                                //Coordinator Room
                                if (item.RoomTypeId === 4) {

                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 10;

                                    $scope.slotWaitYellowTime.Min = 10;
                                    $scope.slotWaitYellowTime.Max = 20;

                                    $scope.slotWaitRedTime.Min = 20;
                                    $scope.slotWaitRedTime.Max = 60;


                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 15;

                                    $scope.slotActiveYellowTime.Min = 15;
                                    $scope.slotActiveYellowTime.Max = 30;

                                    $scope.slotActiveRedTime.Min = 30;
                                    $scope.slotActiveRedTime.Max = 60;
                                }

                                //Billing Room/CheckOutRoom

                                if (item.RoomTypeId === 9) {

                                    $scope.slotWaitGreenTime.Min = 0;
                                    $scope.slotWaitGreenTime.Max = 10;

                                    $scope.slotWaitYellowTime.Min = 10;
                                    $scope.slotWaitYellowTime.Max = 15;

                                    $scope.slotWaitRedTime.Min = 15;
                                    $scope.slotWaitRedTime.Max = 60;

                                    $scope.slotActiveGreenTime.Min = 0;
                                    $scope.slotActiveGreenTime.Max = 10;

                                    $scope.slotActiveYellowTime.Min = 10;
                                    $scope.slotActiveYellowTime.Max = 20;

                                    $scope.slotActiveRedTime.Min = 20;
                                    $scope.slotActiveRedTime.Max = 60;
                                }


                                item.CurrentStartTime = '';
                                var CStart = moment(item.WaitingStartTime, 'HH:mm:');
                                var newStartTime1 = $filter('date')(new Date(CStart), 'hh:mm a');
                                item.CurrentStartTime = newStartTime1;

                                if (item.Status === "Waiting") {
                                    item.isWaitingSlot = true;

                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                    var dresult = dateCompare(mainitem.AppointmentDate, currentDt);
                                    console.log(dresult + "__dresult");

                                    if (dresult) {
                                        var DiffMinutes = getcurrentTimeDifferenceMinutes(item.WaitingStartTime);
                                        var waittimec = getHrsnMinutesFormatfromMinutes(DiffMinutes);
                                        item.WaitTime = waittimec;

                                        console.log(DiffMinutes + "__DiffMinutes");
                                        console.log(waittimec + "__waittimec");

                                        if (DiffMinutes <= $scope.slotWaitNormalTime.Max) {
                                            item.isWaitNormalSlot = true;
                                        }
                                        else if (DiffMinutes > $scope.slotWaitGreenTime.Min && DiffMinutes <= $scope.slotWaitGreenTime.Max) {
                                            item.isWaitGreenSlot = true;
                                        }
                                        else if (DiffMinutes > $scope.slotWaitYellowTime.Min && DiffMinutes <= $scope.slotWaitYellowTime.Max) {
                                            item.isWaitYellowSlot = true;
                                        }
                                        else if (DiffMinutes > $scope.slotWaitRedTime.Min) {
                                            item.isWaitRedSlot = true;
                                        }
                                    }
                                    else {



                                        var actSt = item.WaitTime.split(':');
                                        var actSthour = parseFloat(actSt[0]) || 0;
                                        var actStmin = parseFloat(actSt[1]) || 0;
                                        var actStsec = parseFloat(actSt[2]) || 0;






                                        if (actSthour > 0) {
                                            item.isWaitRedSlot = true;
                                        } else {

                                            if (DiffMinutes <= $scope.slotWaitNormalTime.Max) {
                                                item.isWaitNormalSlot = true;
                                            }
                                            else if (DiffMinutes > $scope.slotWaitGreenTime.Min && DiffMinutes <= $scope.slotWaitGreenTime.Max) {
                                                item.isWaitGreenSlot = true;
                                            }
                                            else if (DiffMinutes > $scope.slotWaitYellowTime.Min && DiffMinutes <= $scope.slotWaitYellowTime.Max) {
                                                item.isWaitYellowSlot = true;
                                            }
                                            else if (DiffMinutes > $scope.slotWaitRedTime.Min) {
                                                item.isWaitRedSlot = true;
                                            }

                                            item.WaitTime = actSt[1] + ":" + actSt[2];
                                        }


                                    }


                                }
                                else if (item.Status != "Waiting") {

                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                    var dresult = dateCompare(mainitem.AppointmentDate, currentDt)


                                    if (dresult) {
                                        var actSt = item.ActiveStartTime.split(':');
                                        var actSthour = parseFloat(actSt[0]) || 0;
                                        var actStmin = parseFloat(actSt[1]) || 0;
                                        var actStsec = parseFloat(actSt[2]) || 0;

                                        var actEt = item.ActiveEndTime.split(':');
                                        var actEthour = parseFloat(actEt[0]) || 0;
                                        var actEtmin = parseFloat(actEt[1]) || 0;
                                        var actEtsec = parseFloat(actEt[2]) || 0;

                                        if (actEthour == 0 && actEtmin === 0 && actEtsec == 0) {
                                            if (actSthour !== 0 || actStmin !== 0 || actStsec !== 0) {
                                                item.isActiveSlot = true;

                                                var activet = item.WaitTime.split(':');
                                                var activethour = parseFloat(activet[0]) || 0;
                                                var activetmin = parseFloat(activet[1]) || 0;
                                                var activetsec = parseFloat(activet[2]) || 0;

                                                if (activethour > 0) {
                                                    item.isActiveRedSlot = true;

                                                }
                                                else {

                                                    if (activetmin <= $scope.slotActiveNormalTime.Max) {
                                                        item.isActiveNormalSlot = true;
                                                    }
                                                    else if (activetmin > $scope.slotActiveGreenTime.Min && activetmin <= $scope.slotActiveGreenTime.Max) {
                                                        item.isActiveGreenSlot = true;
                                                    }
                                                    else if (activetmin > $scope.slotActiveYellowTime.Min && activetmin <= $scope.slotActiveYellowTime.Max) {
                                                        item.isActiveYellowSlot = true;
                                                    }
                                                    else if (activetmin > $scope.slotActiveRedTime.Min) {
                                                        item.isActiveRedSlot = true;
                                                    }

                                                    item.WaitTime = activet[1] + ":" + activet[2];

                                                }

                                                var DiffMinutes = getcurrentTimeDifferenceMinutes(item.ActiveStartTime);
                                                var ActiveTimec = getHrsnMinutesFormatfromMinutes(DiffMinutes);
                                                item.ActiveTime = ActiveTimec;

                                                var newactivet = item.ActiveTime.split(':');
                                                var newactivethour = parseFloat(newactivet[0]) || 0;
                                                var newactivetmin = parseFloat(newactivet[1]) || 0;
                                                var newactivetsec = parseFloat(newactivet[2]) || 0;

                                                if (newactivethour > 0) {

                                                } else {
                                                    item.ActiveTime = newactivet[1] + ":" + newactivet[2];
                                                }
                                            }
                                        }
                                        else {
                                            item.isCompletedSlot = true;

                                            var activet = item.WaitTime.split(':');
                                            var activethour = parseFloat(activet[0]) || 0;
                                            var activetmin = parseFloat(activet[1]) || 0;
                                            var activetsec = parseFloat(activet[2]) || 0;

                                            if (activethour > 0) {
                                                item.isCompletedRedSlot = true;

                                            }
                                            else {

                                                if (activetmin <= $scope.slotActiveNormalTime.Max) {
                                                    item.isCompletedNormalSlot = true;
                                                }
                                                else if (activetmin > $scope.slotActiveGreenTime.Min && activetmin <= $scope.slotActiveGreenTime.Max) {
                                                    item.isCompletedGreenSlot = true;
                                                }
                                                else if (activetmin > $scope.slotActiveYellowTime.Min && activetmin <= $scope.slotActiveYellowTime.Max) {
                                                    item.isCompletedYellowSlot = true;
                                                }
                                                else if (activetmin > $scope.slotActiveRedTime.Min) {
                                                    item.isCompletedRedSlot = true;
                                                }

                                                item.WaitTime = activet[1] + ":" + activet[2];
                                            }

                                            var newactivet = item.ActiveTime.split(':');
                                            var newactivethour = parseFloat(newactivet[0]) || 0;
                                            var newactivetmin = parseFloat(newactivet[1]) || 0;
                                            var newactivetsec = parseFloat(newactivet[2]) || 0;

                                            if (newactivethour > 0) {

                                            } else {
                                                item.ActiveTime = newactivet[1] + ":" + newactivet[2];
                                            }

                                        }
                                    }
                                    else {



                                        var actSt = item.WaitTime.split(':');
                                        var actSthour = parseFloat(actSt[0]) || 0;
                                        var actStmin = parseFloat(actSt[1]) || 0;
                                        var actStsec = parseFloat(actSt[2]) || 0;






                                        if (actSthour > 0) {
                                            item.isCompletedSlot = true;
                                        } else {

                                            //if (actStmin <= 5) {
                                            //    item.isCompletedNormalSlot = true;
                                            //}
                                            //else if (actStmin > 5 && actStmin <= 10) {
                                            //    item.isCompletedGreenSlot = true;
                                            //}
                                            //else if (actStmin > 10 && actStmin <= 15) {
                                            //    item.isCompletedYellowSlot = true;
                                            //}
                                            //else if (actStmin > 15) {
                                            //    item.isCompletedRedSlot = true;
                                            //}

                                            if (actStmin <= $scope.slotActiveNormalTime.Max) {
                                                item.isCompletedNormalSlot = true;
                                            }
                                            else if (actStmin > $scope.slotActiveGreenTime.Min && activetmin <= $scope.slotActiveGreenTime.Max) {
                                                item.isCompletedGreenSlot = true;
                                            }
                                            else if (actStmin > $scope.slotActiveYellowTime.Min && activetmin <= $scope.slotActiveYellowTime.Max) {
                                                item.isCompletedYellowSlot = true;
                                            }
                                            else if (actStmin > $scope.slotActiveRedTime.Min) {
                                                item.isCompletedRedSlot = true;
                                            }

                                            item.WaitTime = actSt[1] + ":" + actSt[2];
                                        }


                                        var newactivet = item.ActiveTime.split(':');
                                        var newactivethour = parseFloat(newactivet[0]) || 0;


                                        if (newactivethour > 0) {

                                        } else {
                                            item.ActiveTime = newactivet[1] + ":" + newactivet[2];
                                        }
                                    }


                                }

                            });
                        }
                        mainitem.AppointmentCheckInDelayTime = mainitem.AppointmentCheckInDelayTime || '';
                        mainitem.IsDelayTimeInd = false;
                        if (mainitem.AppointmentCheckInDelayTime != "") {
                            var delay = mainitem.AppointmentCheckInDelayTime.substring(0, 1);
                            if (delay == '-') {
                                //  mainitem.IsDelayTimeInd = true;
                                mainitem.AppointmentCheckInDelayTime = mainitem.AppointmentCheckInDelayTime.replace("-", "");
                            }
                            //else {
                            //    mainitem.IsDelayTimeInd = false;
                            //}
                            var apptTime = new Date(mainitem.AppointmentDate + ' ' + mainitem.AppointmentStartTime);
                            var CheckTime = new Date(mainitem.AppointmentDate + ' ' + mainitem.CheckInTime);
                            var timeOneUnix = apptTime.getTime();
                            var timeTwoUnix = CheckTime.getTime();
                            if (timeTwoUnix - timeOneUnix >= 15 * 60 * 1000) {
                                mainitem.IsDelayTimeInd = true;
                            } else {
                                mainitem.IsDelayTimeInd = false;
                            }
                        }

                        var datetime = mainitem.AppointmentDate + "T" + mainitem.AppointmentStartTime;
                        mainitem.ConvertAppointmentStartTime = $filter('date')(datetime, "hh:mm a");

                        var datetime1 = mainitem.AppointmentDate + "T" + mainitem.CheckInTime;
                        mainitem.ConvertCheckInTime = $filter('date')(datetime1, "hh:mm a");

                    });

                }
                $scope.getPatientTimingsCount();
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };


    $scope.$on("successMethod", function (event) {
        $scope.SetupPopUp.dismiss('cancel');
    });

    $scope.clearPatientApptSearch1 = function () {
        $scope.GetSearchPatient.SearchText = "";
        $scope.GetSearchPatient.PaientMRNO = "";
        $scope.GetSearchPatient.PatientOldMrNo = "";
        $scope.GetSearchPatient.IsPatientNameInd = false;
        $scope.GetSearchPatient.DOBSearchf = '';
        $scope.GetSearchPatient.DOBSearch = '';
    };

    $scope.FilterSelect = {
        templateUrl: 'FilterSelectPopOver.html',
        "scope": $scope
    };

    $scope.RolesList = [
        {
            "Role": "Doctor",
            "RoleId": 1,
            "RoomTypeId": 1,
            "Id": 1
        },
        {
            "Role": "Technician",
            "RoleId": 10,
            "RoomTypeId": 2,
            "Id": 2
        },
        {
            "Role": "Coordinator",
            "RoleId": 18,
            "RoomTypeId": 4,
            "Id": 3
        },
        {
            "Role": "Biller",
            "RoleId": 19,
            "RoomTypeId": 9,
            "Id": 4
        },
        {
            "Role": "Receptionist",
            "RoleId": 2,
            "RoomTypeId": 10,
            "Id": 5
        },
        {
            "Role": "Optometrist",
            "RoleId": 1,
            "RoomTypeId": 12,
            "Id": 6
        },
        //{
        //    "Role": "Check In Receptionist",
        //    "RoleId": 64,
        //    "RoomTypeId": 10,
        //    "Id": 7
        //},
        //{
        //    "Role": "Clinic Receptionist",
        //    "RoleId": 64,
        //    "RoomTypeId": 10,
        //    "Id": 8
        //},
        {
            "Role": "Clinic Receptionist",
            "RoleId": 62,
            "RoomTypeId": 10,
            "Id": 7

        },

        {
            "Role": "Clinic Receptionist Manager",
            "RoleId": 63,
            "RoomTypeId": 10,
            "Id": 8

        },
        {
            "Role": "Check In Receptionist",
            "RoleId": 64,
            "RoomTypeId": 10,
            "Id": 9
        },
        {
            "Role": "Check In Receptionist Manager",
            "RoleId": 65,
            "RoomTypeId": 10,
            "Id": 10
        },
        {
            "Role": "ASC Receptionist",
            "RoleId": 66,
            "RoomTypeId": 10,
            "Id": 11
        },
        {
            "Role": "ASC Receptionist Manager",
            "RoleId": 67,
            "RoomTypeId": 10,
            "Id": 12
        },
        {
            "Role": "Medical Receptionist",
            "RoleId": 68,
            "RoomTypeId": 10,
            "Id": 13
        },
        {
            "Role": "Medical Receptionist Manager",
            "RoleId": 69,
            "RoomTypeId": 10,
            "Id": 14
        },
        {
            "Role": "Doctor Assistant",
            "RoleId": 16,
            "RoomTypeId": 1,
            "Id": 15
        },
    ];

    $scope.ChangeRole = function (searchObj) {

        $scope.SearchObj.RoleId = searchObj.RoleObj.RoleId;
        $scope.SearchObj.RoleDetailsId = searchObj.RoleObj.Id;

        var roleId = $scope.SearchObj.RoleId || "";
        if (roleId != "") {

            var filterrole = $filter("filter")($scope.RolesList, { "Id": $scope.SearchObj.RoleDetailsId }, true) || [];
            if (filterrole.length > 0) {
                //  $scope.SearchObj.RoleId = filterrole[0].RoleId;
                $scope.SearchObj.UserRoomTypeId = filterrole[0].RoomTypeId;
            }
            $scope.FilteredUsersList = [];
            $scope.SearchObj.UserId = "";
            console.log($scope.SearchObj.UserRoomTypeId);



            $scope.FilteredUsersList = _.uniq($scope.allUserList, function (p) { return p.DoctorID; });
            $scope.FilteredUsersList = $filter("filter")($scope.FilteredUsersList, function (item) {
                return item.RoleId === $scope.SearchObj.RoleId;
            });

            //commneted by durga as we need to bring only for that particular slected role users
            //if ($scope.SearchObj.UserRoomTypeId == 1) {
            //    $scope.FilteredUsersList = _.uniq($scope.allUserList, function (p) { return p.DoctorID; });
            //    $scope.FilteredUsersList = $filter("filter")($scope.FilteredUsersList, function (item) {
            //        return item.RoleId === 1 || item.RoleId === 43;
            //    });
            //}
            //else if ($scope.SearchObj.UserRoomTypeId == 2) {
            //    $scope.FilteredUsersList = _.uniq($scope.allUserList, function (p) { return p.DoctorID; });
            //    $scope.FilteredUsersList = $filter("filter")($scope.FilteredUsersList, function (item) {

            //        return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
            //    });
            //}
            //else if ($scope.SearchObj.UserRoomTypeId == 4) {
            //    $scope.FilteredUsersList = _.uniq($scope.allUserList, function (p) { return p.DoctorID; });
            //    $scope.FilteredUsersList = $filter("filter")($scope.FilteredUsersList, function (item) {
            //        return item.RoleId === 18;
            //    });
            //}
            //else if ($scope.SearchObj.UserRoomTypeId == 9) {
            //    $scope.FilteredUsersList = _.uniq($scope.allUserList, function (p) { return p.DoctorID; });
            //    $scope.FilteredUsersList = $filter("filter")($scope.FilteredUsersList, function (item) {
            //        return item.RoleId === 19;
            //    });
            //}
            //else if ($scope.SearchObj.UserRoomTypeId == 10) {
            //    $scope.FilteredUsersList = _.uniq($scope.allUserList, function (p) { return p.DoctorID; });
            //    $scope.FilteredUsersList = $filter("filter")($scope.FilteredUsersList, function (item) {
            //          return item.RoleId === 2 || item.RoleId === 62 || item.RoleId ===64;
            //    });
            //}
            //else if ($scope.SearchObj.UserRoomTypeId == 12) {
            //    $scope.FilteredUsersList = _.uniq($scope.allUserList, function (p) { return p.DoctorID; });
            //    $scope.FilteredUsersList = $filter("filter")($scope.FilteredUsersList, function (item) {
            //        return (item.RoleId === 1 && item.SuffixId === 13) || (item.RoleId === 43 && item.SuffixId === 13);
            //    });
            //}

        } else {
            $scope.SearchObj.UserId = "";
            $scope.SearchObj.RoleId = 0;
            $scope.SearchObj.UserRoomTypeId = 0;

        }
    }

    $scope.LoadPatientTrackerSearch = function (val, type) {

        val = val || "";

        if (type === 1) {
            $scope.GetSearchPatient.SearchText = val;
            $scope.GetSearchPatient.IsPatientNameInd = false;
            var patientfilter = $filter("filter")($scope.mainPatientTrackersArray, { "PatientName": val }) || [];
            if (patientfilter.length == 0) {
                $scope.GetSearchPatient.IsPatientNameInd = true;
            }
        }
        else if (type === 2) {

            $scope.GetSearchPatient.PaientMRNO = val;
            $scope.GetSearchPatient.IsPatientNameInd = false;
            var patientfilter = $filter("filter")($scope.mainPatientTrackersArray, { "PatientMrNo": val }) || [];
            if (patientfilter.length == 0) {
                $scope.GetSearchPatient.IsPatientNameInd = true;
            }
        }
        else if (type === 3) {
            $scope.GetSearchPatient.PatientOldMrNo = val;
            $scope.GetSearchPatient.IsPatientNameInd = false;
            var patientfilter = $filter("filter")($scope.mainPatientTrackersArray, { "PatientOldMrNo": val }) || [];
            if (patientfilter.length == 0) {
                $scope.GetSearchPatient.IsPatientNameInd = true;
            }
        }
        else if (type === 4) {
            if (val.length > 9) {
                val = val + " 00:00:00";
               /* val = $filter('date')(new Date(val), "yyyy-MM-dd");*/
                /*  = val;*/
                var parsedDate = new Date(val);
                if (!isNaN(parsedDate.getTime())) {
                    val = $filter('date')(parsedDate, "yyyy-MM-dd");
                    $scope.GetSearchPatient.DOBSearchf = val;
                } else {
                    // Log an error or handle the invalid date case
                    alertify.error("Invalid date format:", val);
                    // Return false or handle the error in another way
                    val = null;
                    $scope.GetSearchPatient.DOBSearchf = "";
                  /*  $scope.GetSearchPatient.DOBSearch = "";*/
                    return false;
                }
                $scope.GetSearchPatient.IsPatientNameInd = false;
                var patientfilter = $filter("filter")($scope.mainPatientTrackersArray, { "PatientDOB": val }) || [];
                if (patientfilter.length == 0) {
                    $scope.GetSearchPatient.IsPatientNameInd = true;
                }
            }
            else {
                $scope.GetSearchPatient.DOBSearchf = "";
            }
        }
    };
    $scope.$watch("SearchObj.AppointmentDate", function (newVal, oldVal) {
       if (moment(newVal, 'MM-DD-YYYY').isValid()) {
            $scope.selectedDate = moment(newVal, "MM-DD-YYYY").format("YYYY-MM-DD");
           $scope.SearchObj.AppointmentDate = $scope.selectedDate;
        } else {
            console.log("Invalid date format: " + newVal);
        }
    }, true);
}]);
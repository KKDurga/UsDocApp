
"use strict";
eHnoteWebApp.controller("USQManagementCtrl", ["$scope", "alertify", "eHnoteMasterDataService", "eHnoteMainAppointmentService", "$filter", function ($scope, alertify, eHnoteMasterDataService, eHnoteMainAppointmentService, $filter) {


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

    $scope.MainTab = 1;
    $scope.SubTab = 0;



    $scope.queueObj = {
        "showSingleReceptionRoom": false,
        "showSingleDoctorRoom": false,
        "showSingleOptomRoom": false,
        "showSingleTechnicianRoom": false,
        "showSingleBillerRoom": false,
        "showSingleCounselorRoom": false,
        "showMultipleDoctorQueueList": false
    };

    $scope.switchMainTab = function (tab) {
        $scope.MainTab = tab;
    };

    $scope.closeSingleDoctorQueue = function () {
        var elem = document.getElementById("elementSingleDoctor1");
        closeFullscreen(elem);
        $scope.queueObj.showSingleDoctorQueueList = false;
        //location.reload();
    };
    $scope.switchSubTab = function (subtab) {
        $scope.SubTab = subtab;
        $scope.queueObj.showSingleDoctorQueueList = true;
        $scope.queueObj.showMultipleDoctorQueueList = false;
        var elem = document.getElementById("elementSingleDoctor1");
        openFullscreen(elem)
    }
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

    $scope.selectedRoomObj = {
        "RoomObj": "",
        "WaitingRoomPatients": [],
        "TotalTokens":0
    };

    $scope.openDynamicSingleRoom = function (item) {
        $scope.selectedRoomObj.RoomObj = item;
        $scope.selectedRoomObj.RoomObj.CurrentToken = "N/A";
        $scope.queueObj.showSingleReceptionRoom = true;
        $scope.queueObj.showSingleDoctorRoom = false;
        $scope.queueObj.showSingleOptomRoom = false;
        $scope.queueObj.showSingleTechnicianRoom = false;
        $scope.queueObj.showSingleBillerRoom = false;
        $scope.queueObj.showSingleCounselorRoom = false;

        $scope.selectedRoomObj.WaitingRoomPatients = [];
        $scope.selectedRoomObj.TotalTokens = 0;
        var params = {
            "BranchId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "RoomId": item.RoomId,
            "RoomTypeId": item.RoomTypeId
        };

        eHnoteMainAppointmentService.GetActivePatientUserRooms(params, OnGetSuccesscalender, OnGetErrorcalender);
        function OnGetSuccesscalender(response) {
            console.log(JSON.stringify(response));
            if (response.status === 'Success') {
                if (response.CurrentRoom.length > 0) {
                    $scope.selectedRoomObj.RoomObj.CurrentToken = response.CurrentRoom[0].TokenNumber;
                    $scope.selectedRoomObj.WaitingRoomPatients = response.WaitingRoomsList || [];
                    $scope.selectedRoomObj.TotalTokens = response.WaitingTokens || 0;
                    
                }
            }
        }
        function OnGetErrorcalender(response) {
        }


        var elem = document.getElementById("elementSingleReception1");
        openFullscreen(elem)
    };


    $scope.openReceptionRoom = function () {

        $scope.queueObj.showSingleReceptionRoom = true;
        $scope.queueObj.showSingleDoctorRoom = false;
        $scope.queueObj.showSingleOptomRoom = false;
        $scope.queueObj.showSingleTechnicianRoom = false;
        $scope.queueObj.showSingleBillerRoom = false;
        $scope.queueObj.showSingleCounselorRoom = false;



        var params = {
            "BranchId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "RoomId": "",
            "RoomTypeId": 10
        }
        eHnoteMainAppointmentService.GetActivePatientUserRooms(params, OnGetSuccesscalender, OnGetErrorcalender);
        function OnGetSuccesscalender(response) {
            console.log(JSON.stringify(response));
            if (response.status === 'Success') {

                $scope.loadAppointments($scope.selectedDoctor, '');
            }

        }
        function OnGetErrorcalender(response) {
        }


        var elem = document.getElementById("elementSingleReception1");
        openFullscreen(elem)
    };

    $scope.closeSingleReceptionRoom = function () {
        var elem = document.getElementById("elementSingleReception1");
        closeFullscreen(elem);
        $scope.queueObj.showSingleReceptionRoom = false;
    };

    $scope.openDoctorRoom = function () {
        $scope.queueObj.showSingleDoctorRoom = true;

        $scope.queueObj.showSingleReceptionRoom = false;

        $scope.queueObj.showSingleOptomRoom = false;
        $scope.queueObj.showSingleTechnicianRoom = false;
        $scope.queueObj.showSingleBillerRoom = false;
        $scope.queueObj.showSingleCounselorRoom = false;

        var elem = document.getElementById("elementSingleDoctor");
        openFullscreen(elem)
    };

    $scope.closeSingleDoctorRoom = function () {
        var elem = document.getElementById("elementSingleDoctor");
        closeFullscreen(elem);
        $scope.queueObj.showSingleDoctorRoom = false;
    };


    $scope.openOptomRoom = function () {
        $scope.queueObj.showSingleOptomRoom = true;
        $scope.queueObj.showSingleReceptionRoom = false;
        $scope.queueObj.showSingleDoctorRoom = false;

        $scope.queueObj.showSingleTechnicianRoom = false;
        $scope.queueObj.showSingleBillerRoom = false;
        $scope.queueObj.showSingleCounselorRoom = false;
        var elem = document.getElementById("elementSingleOptom");
        openFullscreen(elem)
    };

    $scope.closeSingleOptomRoom = function () {
        var elem = document.getElementById("elementSingleOptom");
        closeFullscreen(elem);
        $scope.queueObj.showSingleOptomRoom = false;
    };



    $scope.openTechnicianRoom = function () {
        $scope.queueObj.showSingleTechnicianRoom = true;
        $scope.queueObj.showSingleReceptionRoom = false;
        $scope.queueObj.showSingleDoctorRoom = false;
        $scope.queueObj.showSingleOptomRoom = false;

        $scope.queueObj.showSingleBillerRoom = false;
        $scope.queueObj.showSingleCounselorRoom = false;
        var elem = document.getElementById("elementSingleTechnician");
        openFullscreen(elem)
    };

    $scope.closeSingleTechnicianRoom = function () {
        var elem = document.getElementById("elementSingleTechnician");
        closeFullscreen(elem);
        $scope.queueObj.showSingleTechnicianRoom = false;
    };



    $scope.openBillerRoom = function () {
        $scope.queueObj.showSingleBillerRoom = true;
        $scope.queueObj.showSingleReceptionRoom = false;
        $scope.queueObj.showSingleDoctorRoom = false;
        $scope.queueObj.showSingleOptomRoom = false;
        $scope.queueObj.showSingleTechnicianRoom = false;

        $scope.queueObj.showSingleCounselorRoom = false;
        var elem = document.getElementById("elementSingleBiller");
        openFullscreen(elem)
    };

    $scope.closeSingleBillerRoom = function () {
        var elem = document.getElementById("elementSingleBiller");
        closeFullscreen(elem);
        $scope.queueObj.showSingleBillerRoom = false;
    };



    $scope.openCounselorRoom = function () {
        $scope.queueObj.showSingleCounselorRoom = true;
        $scope.queueObj.showSingleReceptionRoom = false;
        $scope.queueObj.showSingleDoctorRoom = false;
        $scope.queueObj.showSingleOptomRoom = false;
        $scope.queueObj.showSingleTechnicianRoom = false;
        $scope.queueObj.showSingleBillerRoom = false;

        var elem = document.getElementById("elementSingleCounselor");
        openFullscreen(elem)
    };

    $scope.closeSingleCounselorRoom = function () {
        var elem = document.getElementById("elementSingleCounselor");
        closeFullscreen(elem);
        $scope.queueObj.showSingleCounselorRoom = false;
    };

    $scope.ActivateRoomsList = [];
    $scope.getAllActiveRoomsList = function () {

        $scope.currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
        var params = {
            "BranchId": $scope.HospitalId,
            "CurrentDate": $scope.currentdate
        }
        eHnoteMainAppointmentService.GetAllBranchActiveRoomsListByDate(params, OnGetSuccesscalender, OnGetErrorcalender);
        function OnGetSuccesscalender(response) {
            console.log(JSON.stringify(response));
            if (response.status === 'Success') {
                $scope.ActivateRoomsList = response.rows || [];
            }
        }
        function OnGetErrorcalender(response) {
        }
    };
    $scope.getAllActiveRoomsList();

}]);
"use strict";
eHnoteWebApp.controller("EhnoteSuperAdminCtrl", ["$scope", "$rootScope", "eHnoteMasterDataService", "$location", "eHnoteLoginStatusService", "eHnoteDiagnosisDataServices", "alertify", "datapersistanceFactory", function ($scope, $rootScope, eHnoteMasterDataService, $location, eHnoteLoginStatusService, eHnoteDiagnosisDataServices, alertify, datapersistanceFactory) {
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

    

    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path("/login");
        return;
    }
    var parent = this;
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserAccessList = [];

    $scope.parentScope = { "DepartMentTabno": 1};


    /*$scope.activeMenu = "dashboard";*/
    $scope.activeMenu = "manageBranch";

    console.log(doctorinfo);

    $scope.SuperAdminAccess = {
        "ManageBranchesTabAccess": true,
        "ManageUsersTabAccess": true,
        "ManageRolesTabAccess": true,
        "ManageProfilesTabAccess": true,
        "AdminDashBoardTabAccess": false,
        "UserProfileEditTabAccess": true,
        "ManagePaymentDevices": true,
    };
    $scope.enableTelynxUsersTab = false;


    if (doctorinfo !== "") {
        if (doctorinfo.doctordata.User !== undefined) {
            $scope.UserAccessList = doctorinfo.doctordata.User[0].UseAccessDetails;
            $rootScope.ParentSpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
            $scope.enableTelynxUsersTab = doctorinfo.doctordata.UserAddress[0].IsTelnyxCallingEnabled || false;
            checkUserAccessPermissions();
        }
    }








    function checkUserAccessPermissions() {
        angular.forEach($scope.UserAccessList, function (item) {
            if (item.AccessCategoryId === 1 && item.ActiveInd === "Y") {
                angular.forEach(item.AccessList, function (citem) {
                    if (citem.AccessRightId === 1 && citem.ActiveInd === "N") {
                        $scope.SuperAdminAccess.ManageBranchesTabAccess = false;
                    }
                    if (citem.AccessRightId === 2 && citem.ActiveInd === "N") {
                        $scope.SuperAdminAccess.ManageUsersTabAccess = false;
                    }
                    if (citem.AccessRightId === 3 && citem.ActiveInd === "N") {
                        $scope.SuperAdminAccess.ManageRolesTabAccess = false;
                    }
                    if (citem.AccessRightId === 4 && citem.ActiveInd === "N") {
                        $scope.SuperAdminAccess.ManageProfilesTabAccess = false;
                    }
                    if (citem.AccessRightId === 5 && citem.ActiveInd === "N") {
                        $scope.SuperAdminAccess.AdminDashBoardTabAccess = false;
                    }
                    if (citem.AccessRightId === 6 && citem.ActiveInd === "N") {
                        $scope.SuperAdminAccess.UserProfileEditTabAccess = false;
                    }
                });
            }
        });


        //if ($scope.SuperAdminAccess.AdminDashBoardTabAccess) {
        //    $scope.activeMenu = "dashboard";
        //}
        if ($scope.SuperAdminAccess.ManageBranchesTabAccess) {
            $scope.activeMenu = "manageBranch";
        } else if ($scope.SuperAdminAccess.ManageProfilesTabAccess) {
            $scope.activeMenu = "ProfileSetting";
        } else if ($scope.SuperAdminAccess.ManagePaymentDevices) {
            $scope.activeMenu = "ManagePaymentDevices";
        }


        else {
            $scope.activeMenu = "manageUser";
        }
    }


    parent.showPage = function (val) {

        $scope.activeMenu = val;
    };
    $scope.Init = function () {
        //var place_params = { "DoctorID": doctorinfo.doctordata.User[0].DoctorID, "ActiveIND": "Y" };
    };
    $scope.Init();

    
    $scope.isntp = false;
    $scope.ntpserverpopoverclick = {
        templateUrl: 'ntpserverpopover.html',
    };
    $scope.Isntp = function () {
        $scope.isntp = true;
    };

    $scope.ntpServer = {
        "url": '',
        "LocalServerName": '',
        "LocalIpAddress": '',
        "LocalTime": '',
        "NtpServerName": '',
        "NtpIpAddress": '',
        "NtpTime": '',
        "version": ''
    };

    $scope.configureNtpServer = function () {
        eHnoteDiagnosisDataServices.GetNISTTimeZone($scope.ntpServer.url).then(function (response) {


            console.log(JSON.stringify(response));

            $scope.ntpServer.LocalServerName = response.data.LocalServerName;
            $scope.ntpServer.LocalIpAddress = response.data.LocalServerIP;
            $scope.ntpServer.LocalTime = response.data.LocalServerTime;
            $scope.ntpServer.NtpServerName = response.data.NtpServerName;
            $scope.ntpServer.NtpIpAddress = response.data.NtpServerIp;
            $scope.ntpServer.NtpTime = response.data.NtpServerTime;

        }, function (err) {
            alertify.error("Failed");
            console.log(err);
        });
    };

}]);
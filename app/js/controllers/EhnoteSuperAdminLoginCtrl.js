"use strict";

eHnoteWebApp.controller("EhnoteSuperAdminLoginCtrl", ["$scope", "$filter", "$location", "eHnoteValidateUsersDataService", "eHnoteUserDataService", "eHnoteMasterDataService", "datacookieFactory", "alertify", "$rootScope", "eHnoteSettingsDataService", "loginCookieFactory", "eHnotePatientAddressDataServices", "eHnoteMainAppointmentService", "eHnoteDbStaticDataService", "datapersistanceFactory", "localStorageFactory", function ($scope, $filter, $location, eHnoteValidateUsersDataService, eHnoteUserDataService, eHnoteMasterDataService, datacookieFactory, alertify, $rootScope, eHnoteSettingsDataService, loginCookieFactory, eHnotePatientAddressDataServices, eHnoteMainAppointmentService, eHnoteDbStaticDataService, datapersistanceFactory, localStorageFactory) {

    
    $scope.validateInfo = { "userName": "", "passWord": "", "rememberMe": false };
    var emailfilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    $scope.emailpattern = emailfilter;
    $scope.showloading = true;
    var storedUserName = datacookieFactory.getItem("rememberUser");
    var remembercheck = datacookieFactory.getItem("rememberme");
    if (storedUserName !== undefined) {
        $scope.validateInfo.userName = storedUserName;
    }
    if (remembercheck !== undefined) {
        $scope.validateInfo.rememberMe = remembercheck;
    }
    $scope.ValidateUser = function (validateUserForm, validateInfo) {
        $scope.error = false;
        if (!validateUserForm.$valid) {
            return;
        }
       
        $scope.rememberme = true;
        eHnoteValidateUsersDataService.ValidateUser($scope.validateInfo.userName, $scope.validateInfo.passWord, $scope.validateInfo.rememberMe, $scope.Lat, $scope.Lon,false, OnLoginSuccess, OnLoginError);
    };

    function OnLoginSuccess(data) {
        if (data.status === "Success") {
            if (data.User[0].RoleId == 24) {
                datapersistanceFactory.clearAll();
                localStorageFactory.clearAll();
                $scope.loggedinStatus = true;
                $scope.showloading = false;
                $rootScope.$broadcast("reloadMainController");
                datapersistanceFactory.set("JWTToken", data.Token);
                localStorageFactory.set("USerLoginTime", new Date());
                var url = "/SuperOranization";
                $location.url(url);
            } else {
                alertify.error("You Can't Login Into These Appilication");
            }
           
           
        } else {
            alertify.error("Invalid User Name / Password");
        }
     
    }
    function OnLoginError(data, no) {
        $scope.showloading = false;
        if (no === 0) {
            return;
        } else if (no === 1) {
            $scope.error = true;
            alertify.error("Invalid User Name / Password");
        } else {
            alertify.error("Invalid User Name / Password");
        }
    }
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }
    function showPosition(position) {
        $scope.Lat = position.coords.latitude;
        $scope.Lon = position.coords.longitude;
    }
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                //console.log("User denied the request for Geolocation.");

            case error.POSITION_UNAVAILABLE:
                //console.log("Location information is unavailable.");

            case error.TIMEOUT:
                //console.log("The request to get user location timed out.");

            case error.UNKNOWN_ERROR:
                //console.log("An unknown error occurred.");
        }
    }
    getLocation();
   
}]);
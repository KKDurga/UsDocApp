"use strict";
eHnoteWebApp.controller("EhnoteReferalCtrl", ["$scope", "eHnoteUserDataService", "eHnoteReferalDataService", "eHnoteMasterDataService", "alertify", function ($scope, eHnoteUserDataService, eHnoteReferalDataService, eHnoteMasterDataService, alertify) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();


    $scope.ReferTab = 2;

    $scope.switchReferTab = function (type) {
        $scope.ReferTab = type;
    }

}]);
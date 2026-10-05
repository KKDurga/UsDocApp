"use strict";
eHnoteWebApp.controller("UsClaimERAandEOBHistoryCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", function ($scope, $rootScope, $location, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout) {
    $scope.openPayemtPostingPopup = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/AddPaymentPostingPopup.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "offcanves-right  ",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };
}]);
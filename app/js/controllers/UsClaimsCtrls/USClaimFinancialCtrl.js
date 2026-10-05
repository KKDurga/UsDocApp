"use strict";
eHnoteWebApp.controller("USClaimFinancialCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", function ($scope, $rootScope, $location, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout) {


    $scope.clickInsurancepopup = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/addInsurancepopup.html",
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
    $scope.clickviewcardpopup = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/viewcardpopup.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "appointment-full-popup  ",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };

}]);
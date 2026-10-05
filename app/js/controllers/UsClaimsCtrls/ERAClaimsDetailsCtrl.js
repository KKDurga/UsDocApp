"use strict";
eHnoteWebApp.controller("ERAClaimsDetailsCtrl", ["$scope", "$uibModalInstance", "eHnotePatientDataService", "eHnoteMasterDataService", "$filter", "$q", "eHnoteSettingsDataService", "eHnoteInsuranceService", "alertify", function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, eHnoteMasterDataService, $filter, $q, eHnoteSettingsDataService, eHnoteInsuranceService, alertify) {


    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    };

    $scope.uibclose = function () {
        $uibModalInstance.dismiss("cancel");
    };



}]);
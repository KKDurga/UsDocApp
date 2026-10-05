"use strict";
eHnoteWebApp.controller("UsPatientStatementListCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "eHnoteInsuranceService", "eHnoteSettingsDataService", function ($scope, $rootScope, $location, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, eHnoteInsuranceService, eHnoteSettingsDataService) {

    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    };

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();




}]);
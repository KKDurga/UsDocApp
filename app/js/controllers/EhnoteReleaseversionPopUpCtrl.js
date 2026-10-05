
eHnoteWebApp.controller("EhnoteReleaseversionPopUpCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "eHnoteSettingsDataService", "$uibModalInstance", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, eHnoteSettingsDataService, $uibModalInstance) {



    var doctorInfo = "";

    doctorInfo = eHnoteMasterDataService.getUserInfo();
    
    $scope.VersionDetailsData = [];
    $scope.VersionDetailsData = doctorInfo.doctordata.AppVersionDetails;
    $scope.cancel = function (type, data) {
        if (type === "cancel") {
            $uibModalInstance.dismiss(type);
        }
    };
}]);
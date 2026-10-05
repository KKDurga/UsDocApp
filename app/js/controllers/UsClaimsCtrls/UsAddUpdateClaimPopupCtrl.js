"use strict";
eHnoteWebApp.controller("UsAddUpdateClaimPopupCtrl", ["$scope", "$rootScope", "$uibModal", "$uibModalInstance", "eHnotePatientDataService", "mainBillerDataObj", "$timeout","eHnoteInsuranceService",
    function ($scope, $rootScope, $uibModal, $uibModalInstance, eHnotePatientDataService, mainBillerDataObj, $timeout, eHnoteInsuranceService) {


      
        $scope.mainBillerDataObj = mainBillerDataObj;
        $scope.HospitalId = $scope.mainBillerDataObj.HospitalId || 0;
        $scope.PatientId = $scope.mainBillerDataObj.PatientId || 0;
        let item = '';

        $scope.SubTab = 2;
       
        if ($scope.mainBillerDataObj.Tabid == 1) {
            $scope.SubTab = 1;
        }
        else if ($scope.mainBillerDataObj.Tabid == 3) {
            $scope.SubTab = 3;
        } else {
            $scope.SubTab = 2;
        }

        $scope.navtoOpenClaimAddupdatePopup = function () {
            $scope.SubTab = 1;
            $scope.$broadcast('callClaimAddupdate');
        }

        $scope.BillingPopUpClose = function (data) {
            data = data || "";
            $uibModalInstance.close(data);
        };

        $scope.$on('AddUpdateClaim', function (event, data) {
            data = data || {};

            let actionType = data.action || '';
            let additionalValues = data.values || {};

            if (actionType === 'save') {
                $scope.BillingPopUpClose({ action: actionType, values: additionalValues });
            } else if (actionType === 'saveandcreate') {
                $scope.BillingPopUpClose({ action: actionType, values: additionalValues });
            } else {
                $scope.BillingPopUpClose(data);
            }
        });

        //$scope.GetPatientNotesAlertsById = function () {

        //    $scope.PatientAlertsList = [];
        //    let obj = {
        //        "PatientId": $scope.PatientId,
        //        "OrganizationId": $scope.HospitalId,
        //        "StatusId": 1
        //    }
        //    eHnoteInsuranceService.GetPatientAlertsNew(obj).then(function (resp) {
        //        if (resp.data.Status == "Success") {
        //            if (resp.data.rows.length > 0) {
        //                $scope.PatientAlertsList = resp.data.rows || [];

        //                $scope.PatientAlerts = [];

        //                if ($scope.PatientAlertsList.length > 0) {
        //                    angular.forEach($scope.PatientAlertsList, function (item) {
        //                        var counter = 0;
        //                        if (item.AlertData !== null) {
        //                            if (item.AlertData.AlertTypesList.length > 0) {
        //                                angular.forEach(item.AlertData.AlertTypesList, function (Bitem) {
        //                                    if (Bitem.AlertTypeId == 4) {
        //                                        counter++;
        //                                    }
        //                                })
        //                            }
        //                        }
        //                        if (counter !== 0) {
        //                            $scope.PatientAlerts.push(item);
        //                        }
        //                    });
        //                }
                 
        //            }
        //        } else {
        //            alertify.error(resp.data.Message);
        //        }
        //    });
        //}
        //$scope.GetPatientNotesAlertsById();
}]);
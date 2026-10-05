"use strict";
eHnoteWebApp.controller("UsPaymentGatewayCtrl", ["$scope", "eHnoteMasterDataService", "alertify", "$uibModalInstance","PaymentSessionAndPayin", function ($scope, eHnoteMasterDataService, alertify, $uibModalInstance, PaymentSessionAndPayin,) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.DoctorId = doctorinfo.doctordata.User[0].DoctorID;
    $scope.RoleId = doctorinfo.doctordata.User[0].RoleId;
    $scope.GetAllIndicator = 0;
    //$scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.RoleId = $scope.userLoginDetails.RoleID;

    $uibModalInstance.rendered.then(function () {
        $scope.PaymentSessionAndPayin = PaymentSessionAndPayin;
        console.log($scope.PaymentSessionAndPayin.SessionKey);

        if (doctorinfo !== undefined) {
            $scope.orgUsersData = doctorinfo.doctordata.UserAddress;
            if ($scope.orgUsersData !== undefined) {
                if ($scope.orgUsersData[0] !== undefined) {
                    $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                }
            }
        }

        angular.element(document).ready(function () {
            var component = document.getElementById("payment-component");

            if (!component) {
                console.error("Rainforest payment component not found.");
                return;
            }

            component.addEventListener("approved", function (event) {
                var payinData = event.detail;
                console.log("Payment approved!", payinData);

                // Save payin_id and redirect or show confirmation
                $scope.$apply(function () {
                    $scope.paymentStatus = "Payment approved!";
                    $scope.payin_id = payinData.payin_id;
                    // Example: redirect
                    // $window.location.href = '/payment-success?payin_id=' + $scope.payin_id;
                });
            });

            component.addEventListener("declined", function (event) {
                var payinData = event.detail;
                console.warn("Payment declined", payinData);
                $scope.$apply(function () {
                    $scope.paymentStatus = "Payment declined. Please try again.";
                });
            });

            component.addEventListener("error", function (event) {
                var errorData = event.detail;
                console.error("Payment error", errorData);
                $scope.$apply(function () {
                    $scope.paymentStatus = "Payment failed. Try again later.";
                });
            });

            component.addEventListener("loading", function () {
                $scope.$apply(function () {
                    $scope.paymentStatus = "Loading payment component...";
                });
            });

            component.addEventListener("loaded", function () {
                $scope.$apply(function () {
                    $scope.paymentStatus = "Payment component ready!";
                });
            });
        });

        $scope.closepopup = function () {
            $uibModalInstance.close();
        }
    });

}]);
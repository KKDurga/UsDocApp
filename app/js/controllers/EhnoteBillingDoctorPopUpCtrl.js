eHnoteWebApp.controller("EhnoteBillingDoctorPopUpCtrl", ["$scope", "$uibModalInstance", "BillingDoctorTypes", "alertify", "BillingDetail", function ($scope, $uibModalInstance, BillingDoctorTypes, alertify, BillingDetail) {



    $scope.BillingDoctorTypes = angular.copy(BillingDoctorTypes);
    $scope.BillingDetail = angular.copy(BillingDetail);

    console.log($scope.BillingDoctorTypes);
    console.log($scope.BillingDetail);



    $scope.ClosePayment = function (type) {
        if (type === "cancel") {
            $uibModalInstance.dismiss(type);
        } else {
            $uibModalInstance.close($scope.BillingDetail);
        }
    };

    $scope.PayBalance = function () {

        var Amount = 0;
        Amount += parseFloat($scope.Sale.CashAmount) || 0;
        Amount += parseFloat($scope.Sale.CardAmount) || 0;
        Amount += parseFloat($scope.Sale.ChequeAmount) || 0;
        $scope.Sale.TotalReceived = $scope.Sale.TempReceivedAmt + Amount;
        $scope.Sale.Due = $scope.Sale.TotalAmount - $scope.Sale.TotalReceived;

        if ($scope.Sale.TotalReceived > $scope.Sale.TotalAmount) {
            alertify.error("Enter Proper Amount");
            return;
        }
    };
    $scope.SavePayment = function (type) {
        $scope.ClosePayment(type);
    };
}]);
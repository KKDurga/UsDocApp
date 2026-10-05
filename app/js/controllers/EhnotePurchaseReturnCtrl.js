
eHnoteWebApp.controller("EhnotePurchaseReturnCtrl", ["$scope", "$filter", "eHnoteMasterDataService", "alertify", "InventoryService", function ($scope, $filter, eHnoteMasterDataService, alertify, InventoryService) {
    var object = {};
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.TotalPurchased = 0;
    $scope.TotalReturnedAmount = 0;
    $scope.Reason = "";
    $scope.ReturnData = eHnoteMasterDataService.GetPurchaseData();

    $scope.ReturnData.PurchaseDate = $filter("date")($scope.ReturnData.PurchaseDate, "dd-MM-yyyy");
    $scope.StripErrorArray = [];


    $scope.ReturnData.DiscountValue = parseFloat($scope.ReturnData.DiscountValue) || 0;



    if ($scope.ReturnData.Discounttype === "A") {
        $scope.ReturnData.DiscountValue = $scope.ReturnData.DiscountValue * 100 / InventoryService.GetStockDetailsSum($scope.ReturnData.StockDetails);
    }




    angular.forEach($scope.ReturnData.StockDetails, function (item, index) {


        if (!item.DelInd) {


            item.PurchaseReturnQuantity = parseInt(item.PurchaseReturnQuantity) || 0;
            item.TransferQuantity = parseInt(item.TransferQuantity) || 0;
            item.NoOfUnits = item.NoOfUnits + (parseInt(item.FreeStrips) || 0);
            item.DiscountValue = parseInt(item.DiscountValue) || 0;
            var RemainItems = (item.NoOfItems * item.NoOfUnits) - item.QuantitySold;
            item.AvailableToReturn = parseInt(RemainItems / item.NoOfItems);
            item.AvailableToReturn = item.AvailableToReturn - (item.PurchaseReturnQuantity + item.TransferQuantity);
            item.isopen = false;
            item.ReturnedPrice = 0;



            var TotalDiscount = item.DiscountValue + $scope.ReturnData.DiscountValue;


            item.DiscountAmount = item.ActualCost * (TotalDiscount / 100);


            item.ComputedPrice = item.ActualCost - item.DiscountAmount;
            item.IndividualItemPrice = item.ComputedPrice + (item.ComputedPrice * item.GST / 100);


           
            if (item.FreeStrips !== 0) {
                item.IndividualItemPrice = ((item.NoOfUnits - item.FreeStrips) * item.IndividualItemPrice) / (item.NoOfUnits);
            }

            item.TotalPrice = item.IndividualItemPrice * (item.NoOfUnits);
            $scope.TotalPurchased += item.TotalPrice;


        }
    });
    $scope.checkReturnedPrice = function (item) {
        var TempReturnedUnits = parseInt(item.ReturnedUnits) || 0;
        if (item.AvailableToReturn < TempReturnedUnits) {
            $scope.TotalReturnedAmount = 0;
            item.StripError = true;
        } else {
            item.StripError = false;
        }
        $scope.TotalReturnedAmount = 0;
        angular.forEach($scope.ReturnData.StockDetails, function (item, index) {


            TempReturnedUnits = parseInt(item.ReturnedUnits) || 0;
            item.ReturnedPrice = (item.IndividualItemPrice * TempReturnedUnits);

            $scope.TotalReturnedAmount += item.ReturnedPrice;

        });
        $scope.StripErrorArray = $filter("filter")($scope.ReturnData.StockDetails, { "StripError": true }, true);
    };
    $scope.cancelReturn = function () {
        $scope.Main.purchasesubtab = 2;
    };
    $scope.SaveReturn = function () {      


        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to return the item ?</h4><p class='txt-body-centre m-0'>If so, it will be deducted from the stock.</p>", function () {


            object = {
                "UserId": doctorinfo.doctorid,
                "Reason": $scope.Reason,
                "PurchaseStockReturnDetails": []
            };
            angular.forEach($scope.ReturnData.StockDetails, function (item, index) {
                item.ReturnedUnits = parseInt(item.ReturnedUnits) || 0;
                if (item.ReturnedUnits !== 0) {
                    object.PurchaseStockReturnDetails.push({
                        "StockDetailId": item.StockDetailId,
                        "ReturnQuantity": parseInt(item.ReturnedUnits) || 0
                    });
                }
            });
            InventoryService.ModifyStockPurchaseReturn(object).then(function (resp) {
                if (resp.data.Status !== 1) {
                    alertify.error(resp.data.Message);
                } else {
                    alertify.success("Returned successfull");
                    $scope.Main.purchasesubtab = 3;
                }
            }, function (err) {
                console.log(err);
                alertify.error("Returned Failed");
            });

        }, function () {
            r = "You pressed Cancel!";
        });

    };
}]);
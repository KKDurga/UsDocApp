"use strict";
eHnoteWebApp.controller("EhnotePrescriptionSelectionPopUpCtrl", ["$scope", "$uibModalInstance", "alertify", "datapersistanceFactory", "$filter", "Appointment", "view", "OrganizationId", "InventoryService", "eHnoteMasterDataService", "Sale", function ($scope, $uibModalInstance, alertify, datapersistanceFactory, $filter, Appointment, view, OrganizationId, InventoryService, eHnoteMasterDataService, Sale) {


    var object = {};

    $scope.Appointment = angular.copy(Appointment);
    $scope.Sale = angular.copy(Sale);
    $scope.view = angular.copy(view);

    //$scope.Sale.OrgKitId = $scope.Appointment.OrgKitId || null; 
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.SelectedBatch = null;

    angular.forEach($scope.Appointment.Prescriptions, function (item, index) {
        if (item.BatchNumbers.length > 0) {
            angular.forEach(item.BatchNumbers, function (subitem, index1) {
                subitem.FreeStrips = subitem.FreeStrips || 0;
                var NoOfUnits = subitem.NoOfUnits + parseInt(subitem.FreeStrips) || 0;
                subitem.BatchStock = subitem.NoOfItems * NoOfUnits;
                subitem.BatchStock = subitem.BatchStock - subitem.QuantitySold;
                subitem.BatchStock = subitem.BatchStock - (subitem.TransferQuantity * subitem.NoOfItems);
                subitem.BatchStock = subitem.BatchStock - (subitem.PurchaseReturnQuantity * subitem.NoOfItems);
                item.AllBatchStock += subitem.BatchStock;
            });
            item.BatchNumbers = $filter("filter")(item.BatchNumbers, function (item, index) { return item.BatchStock > 0; });
        }
        item.ConsumeStockDetails = [];
        item.IsAddedToSale = false;
    });

    $scope.ClosePayment = function (type) {
        if (type === "cancel") {
            $uibModalInstance.dismiss(type);
        } else {
            $uibModalInstance.close($scope.Appointment);
        }
    };
    $scope.GetBatchList = function (item,index) {
        //  console.log(item);
        $scope.selectedobj = item;
        $scope.Appointment.Prescriptions[index].StockDetailId = item.StockDetailId;
    };
    $scope.GetBatches = function (item) {
        if (item.ConsumeStockDetails.length === 0) {
            object = { "MedicineId": item.MedicineId, "OrganizationId": OrganizationId };
            InventoryService.GetPrescriptionStockById(object).then(function (resp) {
                resp.data = resp.data || [];
                item.TempReqQuantity = parseInt(angular.copy(item.ReqQuantity));
                item.IsAddedToSale = true;
               

                angular.forEach(resp.data, function (subitem, subindex) {      
                    //subitem = $filter("filter")(resp.data, function (Aitem, index) { return item.StockDetailId === $scope.selectedobj.StockDetailId })[0];
                    subitem = $filter("filter")(resp.data, function (Aitem, index) { return Aitem.StockDetailId === item.StockDetailId })[0];
                    var IsExistCount = $filter("filter")($scope.Sale.ConsumeStockDetails, function (iterator, ind) {
                        return iterator.InventoryItemDetailId === subitem.InventoryItemDetailsId
                            && iterator.StockDetailId === subitem.StockDetailId
                            && iterator.ActiveInd === 0;
                    }).length;


                    if (IsExistCount === 0 && item.TempReqQuantity !== 0) {

                        if (subitem.AvailableStock < item.TempReqQuantity) {
                            subitem.Quantity = subitem.AvailableStock;
                            item.TempReqQuantity -= subitem.AvailableStock;
                        } else {
                            subitem.Quantity = item.TempReqQuantity;
                            subitem.AvailableStock -= subitem.Quantity;
                            item.TempReqQuantity -= item.TempReqQuantity;
                        }



                        var Discount = 0;
                        var IndividualTotal = subitem.Quantity * subitem.MRP;
                        IndividualTotal = IndividualTotal - ((Discount / 100) * IndividualTotal);


                        object = {

                            "BatchNumbers": [],
                            "selectedObj": { "AllBatchStock": subitem.AvailableStock, "InventoryItemDetailsId": subitem.InventoryItemDetailsId, "ItemName": subitem.Name },
                            "ConsumeHistryId": 0,
                            "Name": subitem.Name,
                            "InventoryItemDetailId": subitem.InventoryItemDetailsId,
                            "Quantity": subitem.Quantity,
                            "Price": subitem.ItemMrp,
                            "MRP": subitem.ItemMrp,
                            "GST": subitem.GST,
                            "TotalGSTamount": 0,
                            "TotalAmount": 0,
                            "Discount": 0,

                            "UserId": doctorinfo.doctorid,
                            "BatchNumber": subitem.BatchNumber,
                            "Expiry": subitem.ExpiryDateMonth + "/" + subitem.ExpiryDateYear,
                            "Source": "I",
                            "ActiveInd": 0,
                            "IsEdit": false,
                            "IndividualTotal": IndividualTotal,
                            "StockDetailId": subitem.StockDetailId,
                            "PreviousBill": "N",
                            "AppointmentId": $scope.Appointment.AppointmentId,
                            "HsnCode": item.HSNCode,
                            "IsWaivedOff": false,                           
                            "WaivedOffRemarks": ""
                        };
                        item.ConsumeStockDetails.unshift(angular.copy(object));
                        //temarray = temarray.concat(item.ConsumeStockDetails);
                       // console.log(temarray);
                    }
                });
            }, function (err) {
                console.log(err);
            });
        }
    };
    $scope.RemoveBatches = function (item) {

        item.ConsumeStockDetails = [];
        item.IsAddedToSale = false;

    };

    $scope.Save = function () {

        $scope.ClosePayment("Ok");
    };

}]);
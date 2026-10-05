"use strict";
eHnoteWebApp.controller("USConsentformPopupCtrl", ["$scope", "$rootScope", "eHnoteMasterDataService", "$uibModalInstance", "USPrintService", "$filter", function ($scope, $rootScope, eHnoteMasterDataService, $uibModalInstance, USPrintService, $filter) {
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();


    $scope.patientobj = {
        "PatientSignature": "",
        "ProviderSignature": "",

    }
    $scope.Patientclear = function () {
        var Patientcanvas = document.getElementById('Patientcanvas');
        var context = Patientcanvas.getContext('2d');
        context.clearRect(0, 0, 180, 60);
        // $scope.Sign.SignatureOfUser = "";
    };
    $scope.Providerclear = function () {
        var Providercanvas = document.getElementById('canvas1');
        var context = Providercanvas.getContext('2d');
        context.clearRect(0, 0, 180, 60);
        // $scope.Sign.SignatureOfUser = "";
    };
    $scope.saveProviderDraw = function () {      
        var Providercanvas = document.getElementById('canvas1');

        var sign = Providercanvas.toDataURL();

        if (sign !== "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAA8CAYAAADPLpCHAAABLklEQVR4Xu3SAQ0AAAjDMO7fND6W4uCjO6dAqMBCW0xR4ICGIFUA6NQ7jQGagVQBoFPvNAZoBlIFgE690xigGUgVADr1TmOAZiBVAOjUO40BmoFUAaBT7zQGaAZSBYBOvdMYoBlIFQA69U5jgGYgVQDo1DuNAZqBVAGgU+80BmgGUgWATr3TGKAZSBUAOvVOY4BmIFUA6NQ7jQGagVQBoFPvNAZoBlIFgE690xigGUgVADr1TmOAZiBVAOjUO40BmoFUAaBT7zQGaAZSBYBOvdMYoBlIFQA69U5jgGYgVQDo1DuNAZqBVAGgU+80BmgGUgWATr3TGKAZSBUAOvVOY4BmIFUA6NQ7jQGagVQBoFPvNAZoBlIFgE690xigGUgVADr1TmOAZiBVAOjUO415zC4APTuPaa4AAAAASUVORK5CYII=") {
            $scope.patientobj.ProviderSignature = sign;
        }
        //var context = Providercanvas.getContext('2d');
        //context.clearRect(0, 0, 180, 60);
    };

    $scope.savePatientDraw = function () {
        var Patientcanvas = document.getElementById('Patientcanvas');

        var sign = Patientcanvas.toDataURL();

        if (sign !== "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAA8CAYAAADPLpCHAAABLklEQVR4Xu3SAQ0AAAjDMO7fND6W4uCjO6dAqMBCW0xR4ICGIFUA6NQ7jQGagVQBoFPvNAZoBlIFgE690xigGUgVADr1TmOAZiBVAOjUO40BmoFUAaBT7zQGaAZSBYBOvdMYoBlIFQA69U5jgGYgVQDo1DuNAZqBVAGgU+80BmgGUgWATr3TGKAZSBUAOvVOY4BmIFUA6NQ7jQGagVQBoFPvNAZoBlIFgE690xigGUgVADr1TmOAZiBVAOjUO40BmoFUAaBT7zQGaAZSBYBOvdMYoBlIFQA69U5jgGYgVQDo1DuNAZqBVAGgU+80BmgGUgWATr3TGKAZSBUAOvVOY4BmIFUA6NQ7jQGagVQBoFPvNAZoBlIFgE690xigGUgVADr1TmOAZiBVAOjUO415zC4APTuPaa4AAAAASUVORK5CYII=") {
            $scope.patientobj.PatientSignature = sign;
        }
        //var context = Patientcanvas.getContext('2d');
        //context.clearRect(0, 0, 180, 60);
    };

    $scope.closeadvancedHistory = function () {
        $uibModalInstance.dismiss("cancel");
    }


    $scope.SaveConsent = function () {
        var PrintInfo = {
            //"DepositeDetails": Tempitem,
            //"BillingType": "Deposit RECEIPT",
            "PrintedDatenTime": "",
            "PatientSignature": $scope.patientobj.PatientSignature,
            "ProviderSignature": $scope.patientobj.ProviderSignature,
            //"CostInWords": CostInWords,
            //"DepositDate": $filter("date")($scope.SelectedPatientDetails.DepositsObj.DepositDate, "MM-dd-yyyy") || "",
            //"PaymentType": PaymentMode ? PaymentMode : ""
        };
        var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
        var printTime = moment(new Date()).format("HH:mm");
        var printDatemTime = printDate + '  ' + printTime;
        PrintInfo.PrintedDatenTime = printDatemTime;

        USPrintService.GenerateAddPatientConsentFormPrint(PrintInfo);
    }

    


}]);

eHnoteWebApp.directive("drawing", function () {
    return {
        restrict: "A",
        link: function (scope, element) {
            var ctx = element[0].getContext('2d');
            scope.drawingCanvas = element.find('canvas')[1];

            var drawing = false;

            var lastX;
            var lastY;
            var currentX;
            var currentY;

            element.bind('mousedown', function (event) {
                if (event.offsetX !== undefined) {
                    lastX = event.offsetX;
                    lastY = event.offsetY;
                } else {
                    lastX = event.layerX - event.currentTarget.offsetLeft;
                    lastY = event.layerY - event.currentTarget.offsetTop;
                }

                ctx.beginPath();

                drawing = true;
            });
            element.bind('mousemove', function (event) {
                if (drawing) {

                    if (event.offsetX !== undefined) {
                        currentX = event.offsetX;
                        currentY = event.offsetY;
                    } else {
                        currentX = event.layerX - event.currentTarget.offsetLeft;
                        currentY = event.layerY - event.currentTarget.offsetTop;
                    }

                    draw(lastX, lastY, currentX, currentY);

                    lastX = currentX;
                    lastY = currentY;
                }

            });
            element.bind('mouseup', function (event) {
                drawing = false;
            });

            function draw(lX, lY, cX, cY) {

                ctx.moveTo(lX, lY);
                // to
                ctx.lineTo(cX, cY);
                // color
                ctx.strokeStyle = "#000000"; //"#32f819";//"#4bf";
                // draw it
                ctx.stroke();
            }



        }
    };
});
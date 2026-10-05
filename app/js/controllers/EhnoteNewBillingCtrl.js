
eHnoteWebApp.controller('EhnoteNewBillingCtrl', ['eHnoteProcedureDataService', 'eHnotePatientDataService', 'eHnoteMasterDataService', '$location', 'alertify', 'eHnotePrintService', '$filter', 'eHnoteLoginStatusService', 'eHnoteMainAppointmentService', '$timeout', "$scope", function (eHnoteProcedureDataService, eHnotePatientDataService, eHnoteMasterDataService, $location, alertify, eHnotePrintService, $filter, eHnoteLoginStatusService, eHnoteMainAppointmentService, timeout, $scope) {
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    var patientID = appointmentinfo.PatientID;
    var appointmentID = appointmentinfo.AppointmentID;
    var docid = appointmentinfo.DoctorID;
    $scope.appointmentinfo = appointmentinfo;
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.patientWiseBillHistory = [];
    $scope.showAppointmentBillingContent = false;
    $scope.check_location = $location.url();
    $scope.minusAmount = false;
    $scope.consultationTreatments = [];
    $scope.showHidePreviousTab = true;

    if ($scope.check_location.substring(0, 19) === '/appointmentbilling') {
        $scope.showAppointmentBillingContent = true;
    }
    $scope.Billingpageno = 1;
    $scope.showPatientWiseBillling = false;
    if (appointmentinfo.CaptureBillingFrom === 'Patient') {
        $scope.showPatientWiseBillling = true;
        $scope.Billingpageno = 3;
    }
    else if (appointmentinfo.CaptureBillingFrom === 'PatientcasHistory') {
        $scope.showPatientWiseBillling = true;
        $scope.Billingpageno = 3;
        $scope.showHidePreviousTab = false;
    }


    $scope.BillingActiveMenu = function (pageno) {
        return (pageno === $scope.Billingpageno) ? "active" : "";
    };
    $scope.SwitchBillingPage = function (pageno) {
        $scope.Billingpageno = pageno;
    };



    $scope.paymentInfoObject = {
        "PaymentTypeId": "1",
        "CashDetails": {
            "Amount": ""
        },
        "CardDetails": {
            "Amount": "",
            "CardNumber": "",
            "CardType": "",
            "CardHolderName": "",
            "CardExpDate": ""
        },
        "ChequeDetails": {
            "Amount": "",
            "ChequeNumber": ""
        }
    };
    $scope.mainBillingObject =
          {
              "BillID": 0,
              "BillDate": moment().format('DD-MMM-YYYY'),
              "TotalSubAmount": "",
              "TotalNetAmount": "",
              "TotalBalance": "",
              "TotalReceivedAmount": "",
              "TotalBilledCost": "",
              "TotalDiscountAmount": 0,
              "DiscountValue": "0",
              "DiscountType": "PERCENT",
              "PreviousPaidAmount": 0,
              "PreviousBill": "N",
              "BillingNotes": "",
              "PaymentInfoObject": $scope.paymentInfoObject,
              "BillingDetail": [
                {
                    "RowID": 1,
                    "BillDate": moment().format('DD-MMM-YYYY'),
                    "ProcedureID": '',
                    "ProcedureCost": '',
                    "ProcedureName": "",
                    "Notes": "",
                    "BilledCost": 0,
                    "DiscountCost": 0,
                    "Multiplyfactor": 1,
                    "AdvancePaid": 0,
                    "DiscountAmount": 0,
                    "DiscountType": "PERCENT",
                    "Balance": 0,
                    "PatientCaseID": 0,
                    "PreviousBill": "N",
                    "BillingFrom": "",
                    "AppointmentID": 0,
                    "selectedParticular": ''
                }
              ]
          };

    $scope.init = function () {
        getPatienBillingHistory();
        getPatientBillingInfo();
        getPatientDetails();
        getConsultationTreatments();
    };
    $scope.init();
    $scope.getTreatments = function (val) {
        var req = {
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": val,
            "ProcedureTypeId": 0,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "Active": "Y"
        };

        return eHnoteProcedureDataService.getDoctorProcedureListing1(req).then(function (resp) {
            if (resp.data.count !== 0 && resp.data.rows) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };

    $scope.addNewBillingItem = function (item) {
        if (item !== undefined && item.ProcedureName === "") {
            alertify.error("please enter treatment");
            return false;
        }
        var newObj = {
            "RowID": 1,
            "BillDate": moment().format('DD-MMM-YYYY'),
            "BillID": 0,
            "ProcedureID": 10,
            "ProcedureCost": '',
            "ProcedureName": "",
            "Notes": "",
            "BilledCost": 0,
            "DiscountCost": 0,
            "Multiplyfactor": 1,
            "AdvancePaid": 0,
            "DiscountAmount": 0,
            "DiscountType": "PERCENT",
            "Balance": 0,
            "PatientCaseID": 0,
            "PreviousBill": "N",
            "BillingFrom": "",
            "Total": ""
        };
        $scope.mainBillingObject.BillingDetail.push(newObj);
    };

    $scope.populateParticularCost = function (item, index) {
        if (item.ProcedureMaxCost) {
            $scope.mainBillingObject.BillingDetail[index].ProcedureCost = item.ProcedureMaxCost;
            $scope.mainBillingObject.BillingDetail[index].ProcedureName = item.ProcedureName;
            $scope.mainBillingObject.BillingDetail[index].ProcedureID = item.ProcedureTypeId;
            $scope.mainBillingObject.BillingDetail[index].Total = item.ProcedureMaxCost;
            $scope.mainBillingObject.TotalSubAmount = item.ProcedureMaxCost;
            $scope.mainBillingObject.TotalNetAmount = item.ProcedureMaxCost;
            $scope.mainBillingObject.TotalBalance = item.ProcedureMaxCost;
            $scope.SumAmount($scope.mainBillingObject);
        }
    };
    $scope.deleteBillingItem = function (index) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete ? </h4>", function () {
            $scope.mainBillingObject.BillingDetail.splice(index, 1);
            $scope.SumAmount($scope.mainBillingObject);
            $scope.$apply();
        }, function () {
            x = "You pressed Cancel!";
        });
    };

    $scope.CalculateTotalAmount = function (item, index) {

        var totalAmount = item.ProcedureCost;
        if (item.ProcedureCost && (item.Multiplyfactor && parseInt(item.Multiplyfactor) !== 0)) {
            totalAmount = parseInt(item.ProcedureCost) * parseInt(item.Multiplyfactor);
        }
        if (item.DiscountCost && parseInt(item.DiscountCost) !== 0) {
            if (item.DiscountType === 'PERCENT') {
                if (item.DiscountCost && parseInt(item.DiscountCost) > 100) {
                    alertify.error('Please enter less than 100');
                    $scope.mainBillingObject.BillingDetail[index].DiscountCost = 0;
                }
                else {
                    totalAmount = parseInt(totalAmount) - (parseInt(item.DiscountCost) / 100) * totalAmount;
                }

            }
            else if (item.DiscountType === 'AMOUNT') {
                var totalprice = parseInt(item.ProcedureCost) * parseInt(item.Multiplyfactor);
                if (parseInt(item.DiscountCost) > parseInt(totalprice)) {
                    alertify.error('Please enter less than price');
                    item.DiscountCost = 0;
                    $scope.mainBillingObject.BillingDetail[index].Total = totalAmount;
                    $scope.SumAmount($scope.mainBillingObject);
                    return false;
                }
                else {
                    totalAmount = parseInt(totalAmount) - parseInt(item.DiscountCost);
                }

            }
        }
        $scope.mainBillingObject.BillingDetail[index].Total = totalAmount;
        $scope.SumAmount($scope.mainBillingObject);


    };

    $scope.SumAmount = function (item) {
        var val = 0;

        if (item.BillingDetail && item.BillingDetail.length > 0) {
            item.BillingDetail.forEach(function (element) {
                val = element.Total ? (val + parseInt(element.Total)) : val;
            });
        }

        $scope.mainBillingObject.TotalSubAmount = val;
        $scope.mainBillingObject.TotalNetAmount = val;
        $scope.mainBillingObject.TotalBalance = val;

        if ($scope.mainBillingObject.DiscountValue && parseInt($scope.mainBillingObject.DiscountValue) !== 0) {
            $scope.discountChange($scope.mainBillingObject);
        }

        return val ? val : 0;
    };

    $scope.discountChange = function (item) {
        if (item.DiscountType === 'PERCENT' && item.DiscountValue && parseInt(item.DiscountValue) > 100) {
            if (item.DiscountType === 'PERCENT') {
                $scope.mainBillingObject.DiscountValue = 0;
                $scope.mainBillingObject.TotalDiscountAmount = 0;
                $scope.mainBillingObject.TotalNetAmount = item.TotalSubAmount;
                alertify.error('Please enter discount below hundred');
                return false;
            }
        }
        else {
            if (item.DiscountType === 'AMOUNT' && parseInt(item.DiscountValue) > parseInt($scope.mainBillingObject.TotalNetAmount)) {
                alertify.error('Discount amount should be less than net amount');
                item.DiscountValue = 0;
                return false;
            }
            var amount = item.TotalSubAmount;
            if (item.DiscountValue && parseInt(item.DiscountValue) !== 0) {
                if (item.DiscountType === 'PERCENT') {
                    amount = parseInt(item.TotalSubAmount) - (parseInt(item.DiscountValue) / 100) * item.TotalSubAmount;
                    $scope.mainBillingObject.TotalDiscountAmount = parseInt((parseInt(item.DiscountValue) / 100) * item.TotalSubAmount);

                }
                else if (item.DiscountType === 'AMOUNT') {
                    amount = parseInt(item.TotalSubAmount) - parseInt(item.DiscountValue);
                    $scope.mainBillingObject.TotalDiscountAmount = parseInt(item.DiscountValue);
                }
            }

            if ($scope.mainBillingObject.TotalReceivedAmount > amount) {
                $scope.mainBillingObject.TotalNetAmount = amount;
                $scope.mainBillingObject.TotalReceivedAmount = 0;
                $scope.mainBillingObject.TotalBilledCost = 0;

                alertify.error('Collected amount should be less net amount');
                return false;
            }
            else {
                $scope.mainBillingObject.TotalNetAmount = amount;
            }
        }
        $scope.mainBillingObject.DiscountValue = parseInt($scope.mainBillingObject.DiscountValue);
    };

    $scope.checkCollectedAmount = function (item) {
        $scope.minusAmount = false;
        var billedcost = $scope.mainBillingObject.TotalBilledCost ? parseInt($scope.mainBillingObject.TotalBilledCost) : 0;
        var checkBillAmount = 0;
        if ($scope.mainBillingObject.PreviousPaidAmount) {
            checkBillAmount = parseInt(item.TotalNetAmount) - parseInt($scope.mainBillingObject.PreviousPaidAmount);
        }
        else {
            checkBillAmount = parseInt(item.TotalNetAmount);
        }

        //if (billedcost > parseInt(item.TotalNetAmount)) {
        if (billedcost > checkBillAmount) {
            $scope.mainBillingObject.TotalReceivedAmount = 0 + parseInt($scope.mainBillingObject.PreviousPaidAmount);
            $scope.mainBillingObject.TotalBilledCost = 0;
            $scope.minusAmount = true;
            alertify.error('Please enter less than or equal to Total Balence');
            return false;
        } else {
            var totalReceivedAmt = 0;
            totalReceivedAmt = billedcost + parseInt($scope.mainBillingObject.PreviousPaidAmount);
            $scope.mainBillingObject.TotalReceivedAmount = totalReceivedAmt;
        }


    };

    function getPatientBillingInfo() {


        eHnotePatientDataService.getBillinginfoForAppointmentID(patientID, docid, 0, appointmentID, callbackBillSuccess, callbackBillError);
        $scope.prevbillObject = "";


    }
    function callbackBillSuccess(response) {


        if (response.count && parseInt(response.count) > 0) {

            $scope.prevbillObject = response.patientCaseBillingInfo[0];
            $scope.patientWiseBillHistoryArray = angular.copy(response.patientCaseBillingInfo);

            timeout(function () {
                $scope.patientWiseBillHistoryArray.forEach(function (item) {
                    $scope.NewPatientBillHistoryArray.forEach(function (inItem) {
                        if (item.AppointmentID === inItem.AppointmentId) {
                            item.billingHistryInfo = inItem.BillingHistoryDtls;
                        }

                    });
                });

            }, 2000);

            if ($scope.patientWiseBillHistoryArray.length > 0) {
                angular.forEach($scope.patientWiseBillHistoryArray, function (mitem) {
                    mitem.PreviousPaidAmount = mitem.TotalReceivedAmount;
                    mitem.TotalBilledCost = 0;
                    mitem.PaymentInfoObject = $scope.paymentInfoObject;

                    mitem.isTotalPaid = mitem.TotalNetAmount - mitem.TotalReceivedAmount === 0 ? true : false;
                    if (mitem.BillingDetail && mitem.BillingDetail.length > 0) {

                        var subtotalPatientWise = 0;
                        mitem.BillingDetail.forEach(function (item) {
                            item.PreviousBill = "Y";
                            if (item.selectedParticular) {
                                //item.selectedParticular = { ProcedureMinCost: item.ProcedureCost, ProcedureName: item.ProcedureName, ProcedureTypeId: item.ProcedureID, ActiveIND: 'Y' };
                                item.selectedParticular = { ProcedureMaxCost: item.ProcedureCost, ProcedureName: item.ProcedureName, ProcedureTypeId: item.ProcedureID, ActiveIND: 'Y' };
                            }

                            if (item.Total === undefined || item.Total === "" || item.Total === null) {
                                var itemTotal = 0;
                                if (item.ProcedureCost && item.Multiplyfactor)
                                    itemTotal = parseInt(item.ProcedureCost) * parseInt(item.Multiplyfactor);

                                item.Total = itemTotal;
                            }
                            subtotalPatientWise += item.Total;
                        });

                        mitem.TotalSubAmount = subtotalPatientWise;

                    }
                });
            }
            $scope.prevbillObject.PreviousPaidAmount = $scope.prevbillObject.TotalReceivedAmount;
            $scope.prevbillObject.TotalBilledCost = 0;

            var subtotal = 0;
            angular.forEach($scope.prevbillObject.BillingDetail, function (item) {
                item.PreviousBill = "Y";
                if ($scope.prevbillObject.BillingDetail && $scope.prevbillObject.BillingDetail.length > 0) {
                    $scope.prevbillObject.BillingDetail.forEach(function (item) {
                        if (item.selectedParticular) {
                            //item.selectedParticular = { ProcedureMinCost: item.ProcedureCost, ProcedureName: item.ProcedureName, ProcedureTypeId: item.ProcedureID, ActiveIND: 'Y' };
                            item.selectedParticular = { ProcedureMaxCost: item.ProcedureCost, ProcedureName: item.ProcedureName, ProcedureTypeId: item.ProcedureID, ActiveIND: 'Y' };
                        }
                    });
                }

                if (item.Total === undefined || item.Total === "" || item.Total === null) {
                    var itemTotal = 0;
                    if (item.ProcedureCost && item.Multiplyfactor)
                        itemTotal = parseInt(item.ProcedureCost) * parseInt(item.Multiplyfactor);
                    item.Total = itemTotal;
                }

                subtotal += item.Total;
            });
            $scope.prevbillObject.TotalSubAmount = subtotal;
            $scope.prevbillObject.PaymentInfoObject = $scope.paymentInfoObject;
            var newObj = {
                "RowID": 1,
                "BillDate": moment().format('DD-MMM-YYYY'),
                "BillID": 0,
                "ProcedureID": 10,
                "ProcedureCost": '',
                "ProcedureName": "",
                "Notes": "",
                "BilledCost": 0,
                "DiscountCost": 0,
                "Multiplyfactor": 1,
                "AdvancePaid": 0,
                "DiscountAmount": 0,
                "DiscountType": "PERCENT",
                "Balance": 0,
                "PatientCaseID": 0,
                "PreviousBill": "N",
                "BillingFrom": "",
                "Total": ""
            };
            if ($scope.prevbillObject.BillingDetail) {
                $scope.prevbillObject.BillingDetail.push(newObj);
            }
            else {
                $scope.prevbillObject.BillingDetail = [];
                $scope.prevbillObject.BillingDetail.push(newObj);
            }

            $scope.mainBillingObject.PaymentInfoObject = $scope.paymentInfoObject;
            $scope.mainBillingObject = $scope.prevbillObject;
        }
    }

    function callbackBillError() {

    }


    $scope.NewPatientBillHistoryArray = [];
    function getPatienBillingHistory() {
        var params = {
            "PatientID": patientID,
            "DoctorID": appointmentinfo.DoctorID,
            "PageNumber": 1,
            "PageSize": 100
        };
        eHnoteProcedureDataService.getPatienBillingHistory(params, getPatienBillingHistorySuccess, getPatienBillingHistoryError);
        function getPatienBillingHistorySuccess(data) {

            if (data !== undefined) {
                $scope.ActualPatientBillHistoryArray = [];
                $scope.NewPatientBillHistoryArray = [];
                if (data.length > 0) {
                    $scope.ActualPatientBillHistoryArray = data;
                    angular.forEach($scope.ActualPatientBillHistoryArray, function (item, index) {
                        angular.forEach(item.patientCaseBillingHistoryDetails, function (item2, index2) {
                            item2.DoctorId = item.DoctorId;
                            item2.DoctorName = item.DoctorName;
                            $scope.NewPatientBillHistoryArray.push(item2);

                        });
                    });
                }
            }
        }
        function getPatienBillingHistoryError(err) {
            console.log(err);
        }
    }

    $scope.PrintArrayBill = [];





    $scope.PrintParticularBillId = function (item) {



        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

        var costinwords = convertNumberToWords(item.billingHistryInfo[0].TotalBilledCost);


        var billingobject = {
            "ReceiptNumber": item.billingHistryInfo[0].ReceiptId,
            "BillNumber": item.BillingId,
            "TotalNetAmount": item.billingHistryInfo[0].TotalNetAmount,
            "TotalDiscountAmount": item.billingHistryInfo[0].TotalDiscountAmount,
            "TotalReceivedAmount": item.billingHistryInfo[0].TotalReceivedAmount,
            "TotalBilledCost": item.billingHistryInfo[0].TotalBilledCost,
            "TotalBalance": item.billingHistryInfo[0].TotalBalance,
            "BillingDetail": item.BillingDetail,
            "UserName": userLoginDetails.displayName,
            "DoctorName": appointmentinfo.DoctorFullName,
            "CostInWords": costinwords,
            "Printdate": $filter('date')(new Date(), "dd-MMM-yyyy")
        };




        var printObj = {
            "patientinfo": eHnoteMasterDataService.getAppointmentInfo(),
            "doctorinfo": doctorinfo,
            "appointmentinfo": eHnoteMasterDataService.getAppointmentInfo(),
            "BillingObject": billingobject,
            "date": $filter('date')(new Date(), "dd-MMM-yyyy"),
            "displayID": ($scope.viewDisID === 'N/A') ? '' : $scope.viewDisID
        };


        //eHnotePrintService.generateBillPrintCopy(printObj);
        eHnotePrintService.generateNewBillPrintCopy(printObj);
    };
    function convertNumberToWords(amount) {
        var words = new Array();
        words[0] = '';
        words[1] = 'One';
        words[2] = 'Two';
        words[3] = 'Three';
        words[4] = 'Four';
        words[5] = 'Five';
        words[6] = 'Six';
        words[7] = 'Seven';
        words[8] = 'Eight';
        words[9] = 'Nine';
        words[10] = 'Ten';
        words[11] = 'Eleven';
        words[12] = 'Twelve';
        words[13] = 'Thirteen';
        words[14] = 'Fourteen';
        words[15] = 'Fifteen';
        words[16] = 'Sixteen';
        words[17] = 'Seventeen';
        words[18] = 'Eighteen';
        words[19] = 'Nineteen';
        words[20] = 'Twenty';
        words[30] = 'Thirty';
        words[40] = 'Forty';
        words[50] = 'Fifty';
        words[60] = 'Sixty';
        words[70] = 'Seventy';
        words[80] = 'Eighty';
        words[90] = 'Ninety';
        amount = amount.toString();
        var atemp = amount.split(".");
        var number = atemp[0].split(",").join("");
        var n_length = number.length;
        var words_string = "";
        if (n_length <= 9) {
            var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
            var received_n_array = new Array();
            for (var i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                n_array[i] = received_n_array[j];
            }
            for (var i = 0, j = 1; i < 9; i++, j++) {
                if (i === 0 || i === 2 || i === 4 || i === 7) {
                    if (n_array[i] === 1) {
                        n_array[j] = 10 + parseInt(n_array[j]);
                        n_array[i] = 0;
                    }
                }
            }
            value = "";
            for (var i = 0; i < 9; i++) {
                if (i === 0 || i === 2 || i === 4 || i === 7) {
                    value = n_array[i] * 10;
                } else {
                    value = n_array[i] * 1;
                }
                if (value !== 0) {
                    words_string += words[value] + " ";
                }
                if ((i === 1 && value !== 0) || (i === 0 && value !== 0 && n_array[i + 1] === 0)) {
                    words_string += "Crores ";
                }
                if ((i === 3 && value !== 0) || (i === 2 && value !== 0 && n_array[i + 1] === 0)) {
                    words_string += "Lakh(s) ";
                }
                if ((i === 5 && value !== 0) || (i === 4 && value !== 0 && n_array[i + 1] === 0)) {
                    words_string += "Thousand ";
                }
                if (i === 6 && value !== 0 && (n_array[i + 1] !== 0 && n_array[i + 2] !== 0)) {
                    words_string += "Hundred and ";
                } else if (i === 6 && value !== 0) {
                    words_string += "Hundred ";
                }
            }
            words_string = words_string.split("  ").join(" ");
        }
        return words_string;
    }



    function getPatientDetails() {

        var param = {
            "PatientID": patientID,
            "USRId": docid,
            "USRType": "DOCTOR",
            "hospitalInfo": {
                "DoctorID": docid
            }
        };
        eHnoteMainAppointmentService.Getpatienteditid(param, patientSuccess, patientError);
        function patientSuccess(data) {
            $scope.viewDisID = ((data.Patient[0].ClinicPreference.PatientDisPlayID === "") ? 'N/A' : data.Patient[0].ClinicPreference.PatientDisPlayID);
        }
        function patientError(err) {
            console.log(err);
        }
    }

    $scope.SubmitPrintVal = "";
    $scope.Submit = function (printVal) {
        $scope.SubmitPrintVal = printVal;

        if ($scope.mainBillingObject) {
            if ($scope.mainBillingObject.TotalBilledCost && parseInt($scope.mainBillingObject.TotalBilledCost) !== 0) {
                $scope.mainBillingObject.TotalBilledCost = parseInt($scope.mainBillingObject.TotalBilledCost);
                if ($scope.mainBillingObject.PaymentInfoObject.PaymentTypeId === '1') {
                    $scope.mainBillingObject.PaymentInfoObject.CashDetails.Amount = parseInt($scope.mainBillingObject.TotalBilledCost);
                }
                else if ($scope.mainBillingObject.PaymentInfoObject.PaymentTypeId === '2') {
                    $scope.mainBillingObject.PaymentInfoObject.CardDetails.Amount = parseInt($scope.mainBillingObject.TotalBilledCost);
                }

            }
        }

        $scope.mainBillingObject.BillingDetail.forEach(function (item) {
            if (item.ProcedureCost === '' || item.ProcedureCost === undefined) {
                var index = $scope.mainBillingObject.BillingDetail.indexOf(item);
                $scope.mainBillingObject.BillingDetail.splice(index, 1);
            }
        });

        $scope.mainBillingObject.AppointmentID = appointmentID;

        timeout(function () {
            if (!$scope.minusAmount) {
                eHnotePatientDataService.UpdateBillingProcedure($scope.mainBillingObject, docid, appointmentinfo, appointmentinfo.PatientID, $scope.HospitalID,"","","",onSuccessUpdate, onErrorUpdate);
            }
        }, 400);
    };

    function onSuccessUpdate(data) {

        //$location.path('/appointment');
        $location.path("/OP");
        if (data.status === "Failure") {
            alertify.error("Error");
        } else {
            alertify.success("Billing completed");


            if ($scope.SubmitPrintVal === 'Print') {
                var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
                var costinwords = convertNumberToWords($scope.mainBillingObject.TotalBilledCost);

                var billingobject = {
                    "ReceiptNumber": data.ReceiptId,
                    "BillNumber": data.BillingId,
                    "TotalNetAmount": $scope.mainBillingObject.TotalNetAmount,
                    "TotalDiscountAmount": $scope.mainBillingObject.TotalDiscountAmount,
                    "TotalReceivedAmount": $scope.mainBillingObject.TotalReceivedAmount,
                    "TotalBilledCost": $scope.mainBillingObject.TotalBilledCost,
                    "TotalBalance": $scope.mainBillingObject.TotalBalance,
                    "BillingDetail": $scope.mainBillingObject.BillingDetail,
                    "UserName": userLoginDetails.displayName,
                    "DoctorName": appointmentinfo.DoctorFullName,
                    "CostInWords": costinwords,
                    "Printdate": $filter('date')(new Date(), "dd-MMM-yyyy")
                };



                var printObj = {
                    "patientinfo": eHnoteMasterDataService.getAppointmentInfo(),
                    "doctorinfo": doctorinfo,
                    "appointmentinfo": eHnoteMasterDataService.getAppointmentInfo(),
                    "BillingObject": billingobject,
                    "date": $filter('date')(new Date(), "dd-MMM-yyyy"),
                    "displayID": ($scope.viewDisID === 'N/A') ? '' : $scope.viewDisID
                };

                //  eHnotePrintService.generateBillPrintCopy(printObj);
                eHnotePrintService.generateNewBillPrintCopy(printObj);
            }
        }
    }
    function onErrorUpdate(err) {
        alertify.error(err.Message);
    }

    function clearAll() {

        $scope.paymentInfoObject = {
            "PaymentTypeId": "1",
            "CashDetails": {
                "Amount": ""
            },
            "CardDetails": {
                "Amount": "",
                "CardNumber": "",
                "CardType": "",
                "CardHolderName": "",
                "CardExpDate": ""
            },
            "ChequeDetails": {
                "Amount": "",
                "ChequeNumber": ""
            }
        };
        $scope.mainBillingObject =
              {
                  "BillID": 0,
                  "BillDate": moment().format('DD-MMM-YYYY'),
                  "TotalSubAmount": "",
                  "TotalNetAmount": "",
                  "TotalBalance": "",
                  "TotalReceivedAmount": "",
                  "TotalBilledCost": "",
                  "TotalDiscountAmount": 0,
                  "DiscountValue": "0",
                  "DiscountType": "PERCENT",
                  "PreviousPaidAmount": 0,
                  "PreviousBill": "N",
                  "BillingNotes": "",
                  "PaymentInfoObject": $scope.paymentInfoObject,
                  "BillingDetail": [
                    {
                        "RowID": 1,
                        "BillDate": moment().format('DD-MMM-YYYY'),
                        "ProcedureID": '',
                        "ProcedureCost": '',
                        "ProcedureName": "",
                        "Notes": "",
                        "BilledCost": 0,
                        "DiscountCost": 0,
                        "Multiplyfactor": 1,
                        "AdvancePaid": 0,
                        "DiscountAmount": 0,
                        "DiscountType": "PERCENT",
                        "Balance": 0,
                        "PatientCaseID": 0,
                        "PreviousBill": "N",
                        "BillingFrom": "",
                        "AppointmentID": 0,
                        "selectedParticular": ''
                    }
                  ]
              };
        getPatientBillingInfo();
        $scope.$apply();
    }

    $scope.RestoreAllBillingsItems = function () {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear all current items ? </h4>", function () {
            clearAll();
        }, function () {
            x = "You pressed Cancel!";
        });
    };



    $scope.patientWisediscountChange = function (item, index) {


        //if (item.DiscountType === 'AMOUNT' && item.DiscountValue && parseInt(item.DiscountValue) > parseInt(item.TotalSubAmount)) {
        //    if (item.DiscountType === 'AMOUNT') {
        //        $scope.patientWiseBillHistoryArray[index].DiscountValue = 0;
        //        $scope.patientWiseBillHistoryArray[index].TotalDiscountAmount = 0;
        //        $scope.patientWiseBillHistoryArray[index].TotalNetAmount = item.TotalSubAmount;
        //        alertify.error('Please enter discount below subTotal Amount');
        //        return false;
        //    }
        //}

        var amount = item.TotalSubAmount;
        if (item.DiscountValue && parseInt(item.DiscountValue) !== 0) {
            if (item.DiscountType === 'PERCENT') {
                amount = parseInt(item.TotalSubAmount) - (parseInt(item.DiscountValue) / 100) * item.TotalSubAmount;
                $scope.patientWiseBillHistoryArray[index].TotalDiscountAmount = parseInt((parseInt(item.DiscountValue) / 100) * item.TotalSubAmount);

            }
            else if (item.DiscountType === 'AMOUNT') {
                amount = parseInt(item.TotalSubAmount) - parseInt(item.DiscountValue);
                $scope.patientWiseBillHistoryArray[index].TotalDiscountAmount = parseInt(item.DiscountValue);
            }
        }
        if ($scope.patientWiseBillHistoryArray[index].TotalReceivedAmount > amount) {
            $scope.patientWiseBillHistoryArray[index].TotalNetAmount = amount;
            $scope.patientWiseBillHistoryArray[index].TotalReceivedAmount = 0;
            alertify.error('Collected amount should be less net amount');
            return false;
        }
        else {
            $scope.patientWiseBillHistoryArray[index].TotalNetAmount = amount;
        }

        $scope.patientWiseBillHistoryArray[index].DiscountValue = parseInt($scope.patientWiseBillHistoryArray[index].DiscountValue);
    };


    $scope.patientWisecheckCollectedAmount = function (item, index) {

        var billedcost = $scope.patientWiseBillHistoryArray[index].TotalBilledCost ? parseInt($scope.patientWiseBillHistoryArray[index].TotalBilledCost) : 0;

        if (billedcost > parseInt(item.TotalNetAmount)) {
            $scope.patientWiseBillHistoryArray[index].TotalReceivedAmount = 0 + parseInt($scope.patientWiseBillHistoryArray[index].PreviousPaidAmount);
            $scope.patientWiseBillHistoryArray[index].TotalBilledCost = 0;
            alertify.error('Please enter less than or equal to Total Balence');
            return false;
        } else {
            var totalReceivedAmt = 0;
            totalReceivedAmt = billedcost + parseInt($scope.patientWiseBillHistoryArray[index].PreviousPaidAmount);
            $scope.patientWiseBillHistoryArray[index].TotalReceivedAmount = totalReceivedAmt;
        }

    };


    $scope.SubmitPatientWise = function (item, printVal) {
        $scope.SubmitPrintValPatientWise = printVal;
        $scope.PatientWiseObject = item;

        if ($scope.PatientWiseObject) {
            if ($scope.PatientWiseObject.TotalBilledCost && parseInt($scope.PatientWiseObject.TotalBilledCost) !== 0) {
                if ($scope.PatientWiseObject.PaymentInfoObject.PaymentTypeId === '1') {
                    $scope.PatientWiseObject.PaymentInfoObject.CashDetails.Amount = parseInt($scope.PatientWiseObject.TotalBilledCost);
                }
                else if ($scope.PatientWiseObject.PaymentInfoObject.PaymentTypeId === '2') {
                    $scope.PatientWiseObject.PaymentInfoObject.CardDetails.Amount = parseInt($scope.PatientWiseObject.TotalBilledCost);
                }
            }
        }

        $scope.PatientWiseObject.BillingDetail.forEach(function (item) {
            if (item.ProcedureCost === '' || item.ProcedureCost === undefined) {
                var index = $scope.PatientWiseObject.BillingDetail.indexOf(item);
                $scope.PatientWiseObject.BillingDetail.splice(index, 1);
            }
        });

        eHnotePatientDataService.UpdateBillingProcedure($scope.PatientWiseObject, docid, appointmentinfo, appointmentinfo.PatientID, $scope.HospitalID, "","","",onSuccessUpdatepatientWise, onErrorUpdate);
    };

    function onSuccessUpdatepatientWise(data) {

        // $location.path('/appointment');
        $location.path("/OP");
        if (data.status === "Failure") {
            alertify.error("Error");
        } else {
            alertify.success("Billing completed");



            if ($scope.PatientWiseObject && $scope.SubmitPrintValPatientWise === 'Print') {
                var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
                var costinwords = convertNumberToWords($scope.PatientWiseObject.TotalBilledCost);

                var billingobject = {
                    "ReceiptNumber": data.ReceiptId,
                    "BillNumber": data.BillingId,
                    "TotalNetAmount": $scope.PatientWiseObject.TotalNetAmount,
                    "TotalDiscountAmount": $scope.PatientWiseObject.TotalDiscountAmount,
                    "TotalReceivedAmount": $scope.PatientWiseObject.TotalReceivedAmount,
                    "TotalBilledCost": $scope.PatientWiseObject.TotalBilledCost,
                    "TotalBalance": $scope.PatientWiseObject.TotalBalance,
                    "BillingDetail": $scope.PatientWiseObject.BillingDetail,
                    "UserName": userLoginDetails.displayName,
                    "DoctorName": appointmentinfo.DoctorFullName,
                    "CostInWords": costinwords,
                    "Printdate": $filter('date')(new Date(), "dd-MMM-yyyy")
                };



                var printObj = {
                    "patientinfo": eHnoteMasterDataService.getAppointmentInfo(),
                    "doctorinfo": doctorinfo,
                    "appointmentinfo": eHnoteMasterDataService.getAppointmentInfo(),
                    "BillingObject": billingobject,
                    "date": $filter('date')(new Date(), "dd-MMM-yyyy"),
                    "displayID": ($scope.viewDisID === 'N/A') ? '' : $scope.viewDisID
                };

                // eHnotePrintService.generateBillPrintCopy(printObj);
                eHnotePrintService.generateNewBillPrintCopy(printObj);
            }
        }
    }

    $scope.discountTypeChange = function (item, index) {
        $scope.mainBillingObject.BillingDetail[index].DiscountCost = 0;
        $scope.CalculateTotalAmount(item, index);
    };

    $scope.mainDiscountTypeChange = function () {
        $scope.mainBillingObject.DiscountValue = 0;
        $scope.discountChange($scope.mainBillingObject);
    };

    $scope.convertToInteger = function (val) {
        return val ? parseInt(val) : 0;
    };

    $scope.historyMainDiscountTypeChange = function (item, index) {
        $scope.patientWiseBillHistoryArray[index].DiscountValue = 0;
        $scope.patientWisediscountChange(item, index);
    };

    $scope.showhideddl = false;
    $scope.treatemntChangeEvent = function (val) {


        var localArray = angular.copy($scope.mainBillingObject.BillingDetail);

        angular.forEach(localArray, function (item) {
            if (item.ProcedureName === "") {
                var index = $scope.mainBillingObject.BillingDetail.indexOf(item);
                $scope.mainBillingObject.BillingDetail.splice(index, 1);
            }
            angular.forEach($scope.consultationTreatments, function (initem) {
                if (item.ProcedureID === initem.ProcedureId) {
                    var index = $scope.mainBillingObject.BillingDetail.indexOf(item);
                    $scope.mainBillingObject.BillingDetail.splice(index, 1);
                }
            });
        });

        angular.forEach(val, function (initem, index) {
            var newObj = {
                "RowID": 1,
                "BillDate": moment().format('DD-MMM-YYYY'),
                "BillID": 0,
                "ProcedureID": initem.ProcedureId,
                "ProcedureCost": initem.ProcedureCost,
                "ProcedureName": initem.ProcedureName,
                "Notes": "",
                "BilledCost": 0,
                "DiscountCost": initem.DiscountCost,
                "Multiplyfactor": initem.MultiplyFactor,
                "AdvancePaid": 0,
                "DiscountAmount": 0,
                "DiscountType": "AMOUNT",
                "Balance": 0,
                "PatientCaseID": 0,
                "PreviousBill": "N",
                "BillingFrom": "",
                "Total": "",
                "selectedParticular": { ProcedureID: initem.ProcedureId, ProcedureName: initem.ProcedureName }
            };
            $scope.mainBillingObject.BillingDetail.push(newObj);
            $scope.CalculateTotalAmount(newObj, parseInt($scope.mainBillingObject.BillingDetail.length) - 1);

            if (index === parseInt(val.length) - 1)
                $scope.addNewBillingItem(newObj);
        });

        if ($scope.mainBillingObject.BillingDetail.length === 0) {
            $scope.addNewBillingItem();
        }
    };

    function getConsultationTreatments() {
        var obj = { "AppointmentId": appointmentID };
        //var obj = { "AppointmentId": 7251 };
        eHnoteProcedureDataService.GetTreatmentsTobeInvoiced(obj).then(function (response) {
            if (response.data) {
                $scope.consultationTreatments = response.data;
            }
        });
    }




}]);
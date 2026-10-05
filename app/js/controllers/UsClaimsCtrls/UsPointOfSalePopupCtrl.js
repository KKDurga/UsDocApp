"use strict";
eHnoteWebApp.controller("UsPointOfSalePopupCtrl", ["$scope", "$rootScope", "$filter", "alertify", "$q", "$uibModal", "$timeout", "$uibModalInstance", "eHnotePrintService", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "eHnoteSettingsDataService", "eHnoteInsuranceService", "mainObj", "mainBillerDataObj", "eHnotePatientDataService", "eHnoteUserDataService", "eHnoteMainAdminServices", "datapersistanceFactory","eHnoteAuditServices",
    function ($scope, $rootScope, $filter, alertify, $q, $uibModal, $timeout, $uibModalInstance, eHnotePrintService, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, eHnoteSettingsDataService, eHnoteInsuranceService, mainObj, mainBillerDataObj, eHnotePatientDataService, eHnoteUserDataService, eHnoteMainAdminServices, datapersistanceFactory, eHnoteAuditServices) {




        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
        $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
        $scope.GetAllIndicator = 0;
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
        $scope.Subtab = 1;
        $scope.mainObj = mainObj || '';

        $scope.mainBillerDataObj = mainBillerDataObj;

        if ($scope.mainBillerDataObj.AllBranchesList.length > 0) {
            $scope.mainBillerDataObj.AllBranchesList = $scope.mainBillerDataObj.AllBranchesList.filter(function (item) {
                return item.ClinicId !== 0;
            });

        }

        $scope.BillingProviderList = $scope.mainBillerDataObj.BillingProviderList || [];
        $scope.selectedDeposits = [];
        $scope.DiscountTypeList = [{
            "DiscountReasonId": 1,
            "DiscountReasonCode": "General",
        }]
        $scope.PatientDepositDetails =
        {
            "DepositDate": null,
            "DepositNumber": null,
            "DepositAmount": 0
        };
        $scope.editIndex = null;
        function getSelectedPatientObj() {
            var obj = {
                "SearchText": "",
                "PatientId": 0,
                "SearchTypeId": 2,
                "ScreenType": "",
                "OrganizationFacilityId": "",
                "PatientMRNo": "",
                "PatientFullName": "",
                "FirstName": "",
                "LastName":"",
                "DOB": "",
                "MobileNo": "",
                "AgeInYears": "",
                "AgeInMonths": "",
                "Gender": "",
                "PosCategoryId": "",
                "ServiceObj": "",
                "S3URL": "",
                "EmailId": "",
                "Patientaddress1": "",
                "Patientaddress2": "",
                "Patientcity": "",
                "Patientstate": "",
                "Patientzip": "",
            }
            return obj;
        };

        $scope.PatientSearchObj = getSelectedPatientObj();


        function getMainPosObject() {
            var obj = {
                "UserId": $scope.UserId,
                "InvoiceId": 0,
                "PatientId": $scope.PatientSearchObj.PatientId,
                "OrganizationId": $scope.HospitalId,
                "PatientName": $scope.mainBillerDataObj.PatientDetailSummary != null ? $scope.mainBillerDataObj.PatientDetailSummary.FullName : "",
                "BuyerId": null,
                "BuyerName": "",
                "IsEmployee": false,
                "SoldByUserId": null,
                "SoldBy": "",
                "BillingProviderId": null,
                "BillingProviderName": "",
                "RenderingProviderId": null,
                "RenderingProviderName": "",
                "InvoiceDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                "DiscountReasonId": null,
                "DiscountReasonCode": "",
                "OverallDiscountValue": 0,
                "OverallDiscountType": "A",
                "TotalChargeAmount": 0,
                "TotalDiscountAmount": 0,
                "TotalNetAmount": 0,
                "PatientPaymentAmount": 0,
                "PatientBalanceAmount": 0,
                "WriteOffAmount": 0,
                "TotalBalanceAmount": 0,
                "PaymentStatus": "Pending",
                "PaymentStatusId": 1,
                "DeleteInd": "N",
                "InvoiceItems": [],
                "ReferenceNumber": '',
                "Remarks": "",
                "IsPosPrint": false,
                "PaymentModeId": 1,
                "PaymentMode": "Cash",
                "PaymentAmount": 0,
                "PatientDueAmount": 0,
                "PayableAmount": 0,
                "OrganizationTransactionId": $scope.HospitalId,
                "OrganizationTransactionName": "",
            }


            return obj;
        };
        $scope.mainPosObject = getMainPosObject();


        if ($scope.mainBillerDataObj != null) {
            $scope.mainBillerDataObj.PatientDetailSummary = $scope.mainBillerDataObj.PatientDetailSummary || null;

            if ($scope.mainBillerDataObj.PatientDetailSummary !== null) {
                $scope.PatientSearchObj.PatientId = $scope.mainObj.PatientId || 0;
                $scope.PatientSearchObj.PatientMRNo = $scope.mainBillerDataObj.PatientDetailSummary.PatientDisplayID || "";
                $scope.PatientSearchObj.PatientFullName = $scope.mainBillerDataObj.PatientDetailSummary.FullName || "";
                $scope.PatientSearchObj.FirstName = $scope.mainBillerDataObj.PatientDetailSummary.FirstName || "";
                $scope.PatientSearchObj.LastName = $scope.mainBillerDataObj.PatientDetailSummary.LastName || "";
                $scope.PatientSearchObj.DOB = $scope.mainBillerDataObj.PatientDetailSummary.DOB || "";
                $scope.PatientSearchObj.MobileNo = $scope.mainBillerDataObj.PatientDetailSummary.ContactInfo.MobileNumber || "";
                $scope.PatientSearchObj.AgeInYears = $scope.mainBillerDataObj.PatientDetailSummary.AgeInYears || "";
                $scope.PatientSearchObj.AgeInMonths = $scope.mainBillerDataObj.PatientDetailSummary.AgeInMonths || "";
                $scope.PatientSearchObj.Gender = $scope.mainBillerDataObj.PatientDetailSummary.Gender || "";
                $scope.PatientSearchObj.S3URL = $scope.mainBillerDataObj.PatientDetailSummary.S3URL || "";
                $scope.PatientSearchObj.EmailId = $scope.mainBillerDataObj.PatientDetailSummary.EmailId || "";
            }
        }
        $scope.SelectedPatientFromOtherScreen = function () {

            $scope.mainObj.PatientId = $scope.mainObj.PatientId || 0;
            if ($scope.mainObj.PatientId == 0) {
                return false;
            }
            eHnoteAuditServices.getParticularPatientDetailsById($scope.mainObj.PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(response) {
                console.log(response);

                if (response.count > 0) {
                   var patietnitem = response.rows[0];
                    patietnitem.PatientID = patietnitem.PatientId;
                    $scope.PatientSearchObj.PatientId = patietnitem.PatientID;
                    $scope.PatientSearchObj.SearchText = patietnitem.FullName;
                    $scope.PatientSearchObj.PatientFullName = patietnitem.FullName;
                    $scope.mainPosObject.PatientName = patietnitem.FullName || '';
                    $scope.PatientSearchObj.FirstName = patietnitem.FirstName || '';
                    $scope.PatientSearchObj.LastName = patietnitem.LastName || '';
                    $scope.mainPosObject.BuyerName = patietnitem.FullName || '';
                    $scope.mainPosObject.BuyerId = patietnitem.PatientID || '';
                    $scope.mainPosObject.PatientId = patietnitem.PatientID || '';
                    $scope.PatientSearchObj.DOB = patietnitem.DOB;
                    $scope.PatientSearchObj.S3URL = patietnitem.S3URL;
                    $scope.PatientSearchObj.PatientMRNo = patietnitem.DisplayID;
                   
                    $scope.PatientSearchObj.EmailId = patietnitem.EmailID;
                    $scope.PatientSearchObj.MobileNo = patietnitem.PhoneNumber;
                    $scope.PatientSearchObj.MobileNo = $scope.PatientSearchObj.MobileNo || null;
                    if ($scope.PatientSearchObj.MobileNo != null) {
                        var Number = eHnoteUserDataService.UsMobileFormatChange($scope.PatientSearchObj.MobileNo);
                        $scope.PatientSearchObj.MobileNo = Number.UsFormatMobileNumber;

                    }
                    $scope.PatientSearchObj.Gender = patietnitem.Gender;
                    $scope.PatientSearchObj.AgeInYears = patietnitem.AgeInYears;
                    $scope.PatientSearchObj.AgeInMonths = patietnitem.AgeInMonths;

                    $scope.PatientSearchObj.Patientaddress1 = patietnitem.PostalAddress.AddressLine1;
                    $scope.PatientSearchObj.Patientaddress2 = patietnitem.PostalAddress.AddressLine2;
                    $scope.PatientSearchObj.Patientcity = patietnitem.PostalAddress.CityName;
                    $scope.PatientSearchObj.Patientstate = patietnitem.PostalAddress.StateCode;
                    $scope.PatientSearchObj.Patientzip = patietnitem.PostalAddress.ZipCode;

                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }


            $scope.AllPatientList = [];
            $scope.ShowPatientDetailsDrop = false;
            $scope.Subtab = 1;
        };
        $scope.SelectedPatientFromOtherScreen();
        $scope.GetPatientDepositPaymodeList = [
            {
            "PaymentId": 0,
            "PaymentMethodId": 1,
            "PaymentMethodName": "Cash",
            "DepositAmount": "",
            "ReferenceNumber": "",
            "IsDepositAdded": false,
            "DeleteInd": "N",
            "PatientDepositId": null,
            "CardNumber": "",
            "CardType": "",
            "CardtypeId": 0,
            }
        ];

        function getPaymentsObj() {
            var obj = {
                "PaymentId": 0,
                "InvoiceId": 0,
                "PaymentMethodId": 1,
                "PaymentMethod": "Cash",
                "PaymentAmount": 0,
                "TransactionTypeId": 1,
                "TransactionType": "Payment",
                "DeleteInd": "N",
                "PatientDepositPaymodeList": []
            }
            return obj;
        };
        $scope.PaymentsObj = getPaymentsObj();

        function getPosInvoiceItemsObj() {
            var obj = {
                "InvoiceItemId": 0,
                "InvoiceId": null,
                "ItemMasterId": null,
                "ItemMasterName": "",
                "OrganizationItemId": null,
                "Quantity": 1,
                "UnitPrice": 0,
                "TotalChargeAmount": 0,
                "DiscountValue": null,
                "DiscountType": "",
                "DiscountAmount": 0,
                "TotalNetAmount": 0,
                "PatientPaymentAmount": 0,
                "PatientBalanceAmount": 0,
                "WriteOffAmount": 0,
                "BalanceAmount": 0,
                "DeleteInd": "N",
                "Transactions": []
            }
            return obj;
        };

        $scope.PosInvoiceItemsObj = getPosInvoiceItemsObj();
        $scope.AllCardTypes = [];


        $scope.EditPosMainData = {
            "PatientPaymentAmount": 0,
            "PatientBalanceAmount": 0

        };
        $scope.disableIndividualDiscount = false;
        $scope.disableTotalDiscount = false;
        $scope.EditOverAllBool = false;
        if ($scope.mainObj.ScreenType == 'AddPos') {
            $scope.Subtab = 2;
            $scope.PatientSearchObj = getSelectedPatientObj();
        } else if ($scope.mainObj.ScreenType == 'EditPos') {

            $scope.Subtab = 1;
            if ($scope.mainObj.EditId === 1) {
                $scope.EditOverAllBool = true;
                $scope.disableTotalDiscount = true;
            }
            let editItem = $scope.mainObj.EditItem;


            $scope.PatientSearchObj = {
                PatientId: editItem.PatientId,
                SearchText: editItem.FullName,
                PatientFullName: editItem.FullName,
                DOB: editItem.DOB,
                PatientMRNo: editItem.DisplayID,
                MobileNo: editItem.PhoneNumber,
                Gender: editItem.Gender,
                AgeInYears: editItem.AgeInYears,
                AgeInMonths: editItem.AgeInMonths,
                S3URL: editItem.S3URL
            };

            $scope.UserId = editItem.CreatedByUserId;
            // $scope.PaymentsObj.PaymentAmount = editItem.PatientPaymentAmount;

            $scope.PaymentsObj = getPaymentsObj();
            $scope.mainPosObject = {
                InvoiceId: editItem.InvoiceId,
                PatientId: editItem.PatientId,
                PatientName: editItem.PatientName || '',
                BuyerName: editItem.PatientName || '',
                BuyerId: editItem.PatientId || '',
                IsEmployee: editItem.IsEmployee || false,
                SoldByUserId: editItem.SoldByUserId,
                SoldBy: editItem.SoldBy || '',
                BillingProviderId: editItem.BillingProviderId,
                BillingProviderName: editItem.BillingProviderName || '',
                RenderingProviderId: editItem.RenderingProviderId,
                RenderingProviderName: editItem.RenderingProviderName || '',
                InvoiceDate: $filter('date')(editItem.InvoiceDate, "yyyy-MM-dd"),
                DiscountReasonId: editItem.DiscountReasonId,
                DiscountReasonCode: editItem.DiscountReasonCode || '',
                OverallDiscountValue: editItem.OverallDiscountValue || 0,
                OverallDiscountType: editItem.OverallDiscountType || 'A',
                TotalChargeAmount: editItem.TotalChargeAmount || 0,
                TotalDiscountAmount: editItem.TotalDiscountAmount || 0,
                TotalNetAmount: editItem.TotalNetAmount || 0,
                PatientPaymentAmount: editItem.PatientPaymentAmount || 0,
                PatientBalanceAmount: editItem.PatientBalanceAmount || 0,
                PayableAmount: editItem.PatientBalanceAmount || 0,
                WriteOffAmount: editItem.WriteOffAmount || 0,
                TotalBalanceAmount: editItem.TotalBalanceAmount || 0,
                PaymentStatus: editItem.PaymentStatus || '',
                ReferenceNumber: editItem.ReferenceNumber || '',
                PaymentStatusId: editItem.PaymentStatusId,
                DeleteInd: editItem.DeleteInd || 'N',
                InvoiceItems: [],
                Remarks: editItem.Remarks
            };
            //$scope.EditPosMainData.PatientBalanceAmount = editItem.PatientBalanceAmount;
            $scope.mainPosObject.PatientBalanceAmount = editItem.PatientBalanceAmount;
            $scope.EditPosMainData.PatientPaymentAmount = editItem.PatientPaymentAmount;
            $scope.PaymentsObj.PatientDepositPaymodeList = editItem.PaymentMethods;
            $scope.mainPosObject.PatientDueAmount = $scope.mainPosObject.PatientBalanceAmount ;

            angular.forEach(editItem.InvoiceItems, function (item) {
                let transactions = item.Transactions || [];

                if (item.PatientBalanceAmount != 0) {
                    let PatientBalance = parseFloat(item.PatientBalanceAmount) || 0;
                    let Tranobj = {
                        "InvoiceItemTransactionId": 0,
                        "InvoiceItemId": item.InvoiceItemId,
                        "OrganizationId": $scope.HospitalId,
                        "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                        "TransactionAmount": item.TotalChargeAmount,
                        "PatientAmount": PatientBalance,
                        "PatientDepositId": null,
                        "AdjustmentReasonId": null,
                        "AdjustmentReasonCode": null,
                        "ReferenceNumber": "",
                        "TransactionTypeId": 1,
                        "TransactionType": "Payment",
                        "TransactionSourceId": 10,
                        "TransactionSource": "POS",
                        "SettlementStatusId": 3,
                        "SettlementStatus": "Fully Settled",
                        "TransactionNotes": "Payment received",
                        "DeleteInd": 'N'
                    };
                    transactions.push(Tranobj);
                }

                let subobj = {
                    "InvoiceItemId": item.InvoiceItemId || null,
                    "InvoiceId": item.InvoiceId || null,
                    "ItemMasterId": item.ItemMasterId || null,
                    "ItemMasterName": item.ItemMasterName || "",
                    "ItemMaster": item.ItemMasterName || "",
                    "OrganizationItemId": item.OrganizationItemId || null,
                    "Quantity": item.Quantity || 0,
                    "UnitPrice": item.UnitPrice || 0,
                    "TotalChargeAmount": item.TotalChargeAmount || 0,
                    "DiscountValue": item.DiscountValue || 0,
                    "DiscountType": item.DiscountType || "$",
                    "DiscountAmount": item.DiscountAmount || 0,
                    "TotalNetAmount": item.TotalNetAmount || 0,
                    "PatientPaymentAmount": item.PatientPaymentAmount || 0,
                    "PatientBalanceAmount": item.PatientBalanceAmount || 0,
                    "WriteOffAmount": item.WriteOffAmount || 0,
                    "BalanceAmount": item.BalanceAmount || 0,
                    "DeleteInd": "N",
                    "Transactions": transactions
                };

                $scope.mainPosObject.InvoiceItems.push(subobj);
            });
        }
        else if ($scope.mainObj.ScreenType == 'PatientPos') {

            $scope.Subtab = 1;
            $scope.PatientSearchObj = {
                PatientId: $scope.PatientSearchObj.PatientId,
                SearchText: $scope.PatientSearchObj.PatientFullName,
                PatientFullName: $scope.PatientSearchObj.PatientFullName,
                DOB: $scope.PatientSearchObj.DOB,
                PatientMRNo: $scope.PatientSearchObj.PatientMRNo,
                MobileNo: $scope.PatientSearchObj.MobileNo,
                Gender: $scope.PatientSearchObj.Gender,
                AgeInYears: $scope.PatientSearchObj.AgeInYears,
                AgeInMonths: $scope.PatientSearchObj.AgeInMonths,
                S3URL: $scope.PatientSearchObj.S3URL
            };

        }
        else {

        }

        $scope.ChangePaymentMode = function (id, item, index) {

            $scope.PaymentsObj.PaymentAmount = $scope.PaymentsObj.PaymentAmount - item.DepositAmount || 0;

            item.DepositAmount = '';
            item.PatientDepositAmt = '';
            item.ReferenceNumber = '';
            item.PatientDepositId = null;
            item.CardNumber = '';
            item.CardType = '';
            item.CardtypeId = 0;
            item.PaymentMethodId = 0;

            var List1 = $filter("filter")($scope.masterPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === id; }) || [];
            if (List1.length != 0) {
                item.PaymentMethodId = List1[0].PaymentModeId;
                item.PaymentMethodName = List1[0].PaymentModeName;
            }
            if (id == 14) {

                $scope.id = id;
                $scope.index = index;
                $scope.openDepositsPopup();

            }
        }

        $scope.ChangePatientPaymentMode = function (id, item, index) {


            $scope.selectedDeposits.splice(index, 1);

            item.DepositAmount = '';
            item.PatientDepositAmt = '';
            item.ReferenceNumber = '';
            item.DepositNumber = '';
            item.PatientDepositDate = '';
            item.PatientDepositId = null;
            item.CardNumber = '';
            item.CardType = '';
            item.CardtypeId = 0;
            item.PaymentMethodId = 0;

            let i = 0;
            angular.forEach($scope.PaymentsObj.PatientDepositPaymodeList, function (item) {
                if (item.PaymentMethodId === id) {
                    i++;
                }
            });
            //if (id != 14) {
            //    if (i > 1) {
            //        alertify.error("The selected payment method is already existed!");
            //        $scope.PatientPaymentObj.PatientDepositPaymodeList[index].PaymentMethodId = 0;
            //        return;
            //    }
            //}


            var List1 = $filter("filter")($scope.masterPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === id; }) || [];
            if (List1.length != 0) {
                item.PaymentMethodId = List1[0].PaymentModeId;
                item.PaymentMethodName = List1[0].PaymentModeName;
            }
            //if (id == 12) {
            //    $scope.AddCreditAmount(id,index);
            //}
            if (id == 14) {
                /* $scope.IsDepositButton = true;*/
                $scope.id = id;
                $scope.index = index;
                $scope.openDepositsPopup();

            }
        }
        $scope.formatDiscount = function () {
            let val = $scope.mainPosObject.OverallDiscountValue;
            if (val !== null && val !== '' && !isNaN(val)) {
                $scope.mainPosObject.OverallDiscountValue = parseFloat(val).toFixed(2);
            }
        };
        $scope.EditPaymentMode = function (item, index) {
            item = item || null;

            $scope.editIndex = index; // Store index for updating

            $scope.PaymentMethodObj = {
                PaymentId: item.PaymentId || 0,
                PaymentMethodId: item.PaymentMethodId || 0,
                PaymentMethodName: item.PaymentMethodName || '',
                DepositAmount: item.DepositAmount || 0,
                ReferenceNumber: item.ReferenceNumber || '',
                IsDepositAdded: item.IsDepositAdded || false,
                DeleteInd: item.DeleteInd || 'N',
                PatientDepositId: item.PatientDepositId || null,
                CardNumber: item.CardNumber || '',
                CardType: item.CardType || '',
                CardtypeId: item.CardtypeId || 0
            };
        };
        $scope.AddMultiplePatientDeposits = function (item, typeId) {
            if ($scope.PaymentMethodObj.PatientDepositId) {
                $scope.selectedDeposits.push($scope.PaymentMethodObj.PatientDepositId);
            }
            if (item.PaymentMethodId == 0) {
                alertify.error("Please select payment method");
                return;
            }
            if (item.DepositAmount == "") {
                alertify.error("Please enter deposit amount");
                return;
            }
            //else if (item.DepositAmount === "0") {
            //    alertify.error("Please enter deposit amount Greater than Zero");
            //    return;
            //}
            else {
            }

            if (item.PaymentMethodId == 2 || item.PaymentMethodId == 3) {
                if (item.CardtypeId == 0) {
                    alertify.error("Please select Card Type");
                    return;
                }
                if (item.CardNumber == '') {
                    alertify.error("Please Enter Card Last 4 digits");
                    return;
                }
            }

            var depositToAdd = parseFloat(item.DepositAmount) || 0;

            // Set payment method name
            var List = $filter("filter")($scope.masterPaymentModes, function (Pitem) {
                return Pitem.PaymentModeId === item.PaymentMethodId;
            }) || [];

            if (List.length > 0) {
                item.PaymentMethodName = List[0].PaymentModeName;
            }

            typeId = typeId || 0;

            if (typeId == 1) {
                if ($scope.PaymentsObj.PatientDepositPaymodeList.length > 5) {
                    alertify.error("You can only add up to 5 records.");
                    return;
                }
                $scope.PaymentsObj.PatientDepositPaymodeList.push(angular.copy(item));
            } else {
                // Calculate total before adding
                var currentTotal = 0;
                $scope.PaymentsObj.PatientDepositPaymodeList.forEach(function (paymode) {
                    if (paymode.PaymentId == 0) {
                        currentTotal += parseFloat(paymode.DepositAmount) || 0;
                    }

                });

                var newTotal = currentTotal + depositToAdd;

                //if (currentTotal === $scope.mainPosObject.PatientBalanceAmount) {
                //    alertify.error(`You have already paid $${currentTotal}. No balance left to add another payment mode.`);
                //    $scope.PaymentMethodObj.DepositAmount = 0;
                //    return;
                //}

                //if (newTotal > $scope.mainPosObject.PatientBalanceAmount) {
                //    var exceed = newTotal - $scope.mainPosObject.PatientBalanceAmount;
                //    alertify.error(`Adding $${depositToAdd} exceeds the balance. Please enter a lesser amount.`);
                //    $scope.PaymentMethodObj.DepositAmount = 0;
                //    return;
                //}

                // Editing existing record
                if ($scope.editIndex !== null) {
                    $scope.PaymentsObj.PatientDepositPaymodeList[$scope.editIndex] = angular.copy(item);
                    /* alertify.success(`Payment method updated. Remaining balance: $${$scope.TotalPatientBalanceAmount - newTotal}`);*/
                    $scope.editIndex = null;
                } else {
                    // Adding new entry
                    if (item.PaymentMethodId === 1) {
                        //var existing = $scope.PaymentsObj.PatientDepositPaymodeList.find(function (paymode) {
                        //    return paymode.PaymentMethodId === item.PaymentMethodId;
                        //});

                        //if (existing) {
                        //    existing.DepositAmount = (parseFloat(existing.DepositAmount) || 0) + depositToAdd;
                        //}
                        //else {
                        if ($scope.PaymentsObj.PatientDepositPaymodeList.length < 5) {
                            $scope.PaymentsObj.PatientDepositPaymodeList.push(angular.copy(item));
                        } else {
                            alertify.error("You can only add up to 5 records.");
                            $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                            return;
                        }
                        //}
                    } else {
                        if ($scope.PaymentsObj.PatientDepositPaymodeList.length < 5) {
                            $scope.PaymentsObj.PatientDepositPaymodeList.push(angular.copy(item));
                        } else {
                            alertify.error("You can only add up to 5 records.");
                            $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                            return;
                        }
                    }
                }

                // Update balance after successful add/edit
                var updatedTotal = 0;
                $scope.PaymentsObj.PatientDepositPaymodeList.forEach(function (paymode) {
                    updatedTotal += parseFloat(paymode.DepositAmount) || 0;
                });

            }
            $scope.calculatePaymentsAmount();
            //$timeout(function () {
            //    $scope.calculatePaymentsAmount();
            //});
            $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());

        };
        $scope.init = function () {


            var mObj = datapersistanceFactory.getItem("masterDataArrays");
            $scope.masterPaymentModes = [];
            if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                $scope.masterPaymentModes = mObj.PaymentModes;
                
            };
            $scope.filteredPaymentModes = $scope.masterPaymentModes.filter(function (item) {
                return item.PaymentModeId !== 13 && item.PaymentModeId !== 14;
            });
            $scope.mainPosObject.PaymentModeId = $scope.masterPaymentModes[0].PaymentModeId;
            $scope.mainPosObject.LocationName = $filter('filter')(mainBillerDataObj.AllBranchesList, { 'BranchId': $scope.HospitalId }, true)[0];
           
            $scope.PosMasterCategor = [];
            $scope.POSInvoiceslist = [];
            $scope.POSInvoicesCount = 0;

            $scope.AllHospitalData = [];
            $scope.AllHospitalData = $scope.mainBillerDataObj;
            var params = {
                "OrganizationId": $scope.HospitalId,
                "FacilityName": ""
            };
            let params2 = {
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "ItemMasterId": null,
                "IsFrequent": "Y",
                "SearchText": "",
                "PosCategoryId": $scope.PatientSearchObj.PosCategoryId || 0,
                "PageNumber": 1,
                "PageSize": 100
            }
            $q.all([
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                eHnoteSettingsDataService.GetPosOrganizationItemmasters(params2),
                eHnoteSettingsDataService.GetPosCategory($scope.ParentHospitalId),
                eHnoteMainAdminServices.GetOrganizationFacilityDetails(params),

            ]).then(function (resp) {
                console.log(resp);

                if (resp[0].data.status === "Success") {
                    $scope.CardTypesData = resp[0].data.Cardtype || [];
                    $scope.AllCardTypes = $scope.CardTypesData;
                }

                if (resp[1].data.rows.length > 0) {
                    $scope.MastersPosItemlist = resp[1].data.rows || [];
                    /*$scope.MastersPosItemlist.forEach(item => {
                        item.isActiveSelectedItem = false;
                    })*/
                }
                if (resp[2].data.rows.length > 0) {
                    $scope.PosMasterCategor = resp[2].data.rows || [];
                }

                if (resp[3].data.status == "Success") {
                    resp[3].data.rows = resp[3].data.rows || [];
                    if (resp[3].data.rows.length > 0) {
                        $scope.OrganizationFacilityList = angular.copy(resp[3].data.rows) || [];
                    }
                }


            });

            $scope.allUserList = angular.copy($scope.AllHospitalData.AllUsersList);

            var DoctorObj = $filter("filter")($scope.allUserList, function (item, index) { return item.DoctorID == $scope.UserId })[0];
            $scope.DoctorObj = DoctorObj;
            $scope.mainPosObject.SoldByUserId = $scope.DoctorObj.DoctorID;
            $scope.mainPosObject.SoldBy = $scope.DoctorObj.FullName;

            $scope.AllDoctorList = angular.copy($scope.AllHospitalData.AllUsersList);
            $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
            $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                return item.RoleId === 1 || item.RoleId === 43;
            });

        }

        $scope.init();


        $scope.ChangePatient = function () {
            $scope.Subtab = 2;
            $scope.PatientSearchObj = getSelectedPatientObj();
            $scope.patientDetailsList = [];

        }

        $scope.DeleteInvoice = function (obs) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

                var index = $scope.mainPosObject.InvoiceItems.indexOf(obs);
                if (index > -1) {
                    if (obs.InvoiceItemId != 0) {
                        $scope.mainPosObject.InvoiceItems[index].DeleteInd = "Y";
                    } else {
                        $scope.mainPosObject.InvoiceItems.splice(index, 1);
                    }
                }
                //if ($scope.mainPosObject.OverallDiscountValue > 0) {
                //    $scope.calculateLineItemsAmount2();
                //}
                //else {
                //    $scope.calculateLineItemsAmount1();
                //}
                $scope.mainPosObject.OverallDiscountValue = 0;
                $scope.mainPosObject.OverallDiscountType = "A";
                $scope.PaymentsObj.PatientDepositPaymodeList = [];
                $scope.ResetcalculateLineItemsAmount();
               /* $scope.calculateClaimTotalAmounts();*/
                $scope.EditPosMainData.PatientPaymentAmount = 0;
                $scope.PaymentsObj.PaymentAmount = 0;
            }, function () {

            });

        }

        function getPOSListObj() {
            var obj = {
                "BuyerId": 0,
                "BuyerName": '',
                "InvoiceId": 0,
                "InvoiceDate": '',
                "InvoiceItems": [],
                "InvoiceNumber": '',
                "PatientBalanceAmount": 0,
                "PatientPaymentAmount": 0,
                "RenderingProviderId": 0,
                "RenderingProviderName": '',
                "SoldBy": '',
                "SoldByUserId": 0,
                "TotalBalanceAmount": 0,
                "TotalChargeAmount": 0,
                "TotalDiscountAmount": 0,
                "TotalNetAmount": 0,
                "PaymentMethods": [],
                "ReferenceNumber": '',
                "PatientName": '',
                "PatientId": 0,
                "TotalPaymentAmount": 0,
                "PatientDisplayID": 0,
                "PrintedDatenTime": '',
                "OrganizationName": '',
                "OrganizationCityName": '',
                "OrganizationStateName": '',
                "OrganizationStateCode": '',
                "OrganizationZipCode": '',
                "PosChargeAmount": 0,
                "PosDiscountAmount": 0,
                "PosPatientPaymentAmt": 0,
                "PosTotalNetAmount": 0,
                "PosTotalPatbalance": 0,
                "POSIntegerNumber": 0,
                "POSDecimalNumber": 0,
                "IntegerAmountInWords": "",
                "DecimalAmountInWords": "",

            };
            return obj;
        };

        $scope.POSPrintMainObj = getPOSListObj();

        $scope.ChangeCardType = function (Id, item) {

            var filtredArray = $filter("filter")($scope.AllCardTypes, { "CardtypeId": Id }, true) || [];
            item.CardType = filtredArray[0].CardType || '';
        }
        function getPaymentStatus(totalNetAmount, paidAmount) {
            if (!paidAmount || paidAmount === 0) return "Unpaid";
            if (paidAmount > 0 && paidAmount < totalNetAmount) return "Partially Paid";
            if (paidAmount >= totalNetAmount) return "Fully Paid";
            return "Unknown";
        }
        $scope.SavePOsdata = function (id) {

            $scope.SaveIndicator = id;
            //if ($scope.PaymentsObj.PaymentAmount < $scope.mainPosObject.TotalChargeAmount) {
            //    alertify.error("Payment Amount must be greater than Charge Amount.");
            //    return false;
            //}
            //if ($scope.PaymentsObj.PaymentAmount > $scope.mainPosObject.TotalNetAmount) {
            //    alertify.error("Payment Amount Should not be Greater Than Charge Amount");
            //    return false;
            //}
            $scope.POSPrintMainObj = getPOSListObj();//|| $scope.PaymentsObj.PaymentAmount === 0
            //if ($scope.PaymentsObj.PatientDepositPaymodeList.length === 0) {
            //    alertify.error("Please add a valid payment before proceeding.");
            //    return false;
            //}
            

            if ($scope.EditPosMainData.PatientPaymentAmount == 0) {
                alertify.error("Please Collect the Payment Amount.");
                return false;
            }
            if ($scope.EditPosMainData.PatientPaymentAmount < $scope.mainPosObject.PatientDueAmount) {
                alertify.error("Please Collect the Total Amount.");
                return false;
            }
            if ($scope.mainPosObject.BuyerName == '') {
                alertify.error("Please enter the buyer name.");
                return false;
            }
            if ($scope.mainPosObject.SoldByUserId == "" || $scope.mainPosObject.SoldByUserId == null || $scope.mainPosObject.SoldByUserId == undefined) {
                alertify.error("Please Select a 'Sold By' user ");
                return false;
            }
            if ($scope.mainPosObject.BillingProviderId == null) {
                alertify.error("Please Select a Billing Provider ");
                return false;
            }
            if ($scope.mainPosObject.RenderingProviderId == "" || $scope.mainPosObject.RenderingProviderId == null || $scope.mainPosObject.RenderingProviderId == undefined) {
                alertify.error("Please select a provider ");
                return false;
            }
            if ($scope.mainPosObject.InvoiceItems.length == 0) {
                alertify.error("Please Select a POS item ");
                return false;
            }

            //$scope.savecalculatePaymentsAmount();
          
            $scope.PaymentsObj.PaymentAmount = $scope.PaymentsObj.PaymentAmount == null ? 0 : $scope.PaymentsObj.PaymentAmount;
            var patientDepositAmount = parseFloat($scope.PaymentsObj.PaymentAmount);
            for (let i = 0; i < $scope.mainPosObject.InvoiceItems.length; i++) {

                let balance = $scope.mainPosObject.InvoiceItems[i].PatientBalanceAmount;
                let availableBls = $scope.mainPosObject.InvoiceItems[i].PatientBalanceAmount;
                let originalBls = $scope.mainPosObject.InvoiceItems[i].PatientPaymentAmount;;
                if (patientDepositAmount >= balance) {

                    $scope.mainPosObject.InvoiceItems[i].PatientPaymentAmount += balance;
                    $scope.mainPosObject.InvoiceItems[i].PatientBalanceAmount = (availableBls - balance);
                    patientDepositAmount -= balance;
                    $scope.TotalPatientPaymentBalance += balance;
                } else {

                    $scope.mainPosObject.InvoiceItems[i].PatientPaymentAmount += patientDepositAmount;
                    $scope.mainPosObject.InvoiceItems[i].PatientBalanceAmount = (availableBls - patientDepositAmount);
                    $scope.TotalPatientPaymentBalance += patientDepositAmount;
                    patientDepositAmount = 0;
                    break;
                }


            }

            if ($scope.mainPosObject.OverallDiscountValue > 0) {
                var totalItems = $scope.mainPosObject.InvoiceItems.length;
                var TotalCharge = 0, TotalDiscountAmount = 0, TotalNetAmount = 0, PatientPaymentAmount = 0, PatientBalanceAmount = 0, WriteOffAmount = 0, TotalBalanceAmount = 0;
                angular.forEach($scope.mainPosObject.InvoiceItems, function (citem) {
                    if (citem.DeleteInd == "N") {

                        TotalCharge += citem.TotalChargeAmount;
                        TotalNetAmount += parseFloat(citem.TotalNetAmount);
                        PatientPaymentAmount += parseFloat(citem.PatientPaymentAmount);
                        PatientBalanceAmount += parseFloat(citem.PatientBalanceAmount);
                        TotalBalanceAmount += parseFloat(citem.PatientBalanceAmount);


                        if ($scope.mainPosObject.OverallDiscountType === "A") {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        } else {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        }
                        //if ($scope.mainPosObject.OverallDiscountType === "A") {
                        //    TotalDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;

                        //} else {
                        //    TotalDiscountAmount = (parseFloat($scope.mainPosObject.OverallDiscountValue) / 100) || 0;
                        //}


                    }
                });

                $scope.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
                $scope.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
                $scope.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
                $scope.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
                $scope.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
                $scope.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
                $scope.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));

                if ($scope.mainPosObject.TotalNetAmount < 0) {
                    alertify.error("Over All Discount  should not be Greater Than Total Charge Amount");
                    $scope.mainPosObject.OverallDiscountValue = 0;
                    TotalCharge = 0; TotalDiscountAmount = 0; TotalNetAmount = 0; PatientPaymentAmount = 0; PatientBalanceAmount = 0; WriteOffAmount = 0; TotalBalanceAmount = 0;
                    angular.forEach($scope.mainPosObject.InvoiceItems, function (citem) {
                        citem.TotalChargeAmount = citem.UnitPrice * citem.Quantity;
                        citem.UnitPrice = parseFloat(citem.UnitPrice) || 0;
                        citem.Quantity = parseInt(citem.Quantity) || 1;
                        citem.DiscountAmount = 0;
                        citem.TotalNetAmount = (citem.UnitPrice * citem.Quantity) - citem.DiscountAmount;
                        citem.PatientBalanceAmount = citem.TotalNetAmount - (citem.PatientPaymentAmount || 0);


                        TotalCharge += citem.TotalChargeAmount;
                        TotalNetAmount += citem.TotalNetAmount;
                        PatientPaymentAmount += citem.PatientPaymentAmount;
                        PatientBalanceAmount += citem.PatientBalanceAmount;
                        TotalBalanceAmount += citem.PatientBalanceAmount;

                        if ($scope.mainPosObject.OverallDiscountType === "A") {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        } else {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        }

                    });

                    $scope.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
                    $scope.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
                    $scope.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
                    $scope.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
                    $scope.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
                    $scope.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
                    $scope.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));
                    $scope.mainPosObject.PatientDueAmount = $scope.mainPosObject.PatientBalanceAmount;
                    $scope.disableTotalDiscount = false;
                    $scope.disableIndividualDiscount = false;
                    return false;
                }
            }
            else {
                var totalItems = $scope.mainPosObject.InvoiceItems.length;
                var TotalCharge = 0, TotalDiscountAmount = 0, TotalNetAmount = 0, PatientPaymentAmount = 0, PatientBalanceAmount = 0, WriteOffAmount = 0, TotalBalanceAmount = 0;
                angular.forEach($scope.mainPosObject.InvoiceItems, function (citem) {
                    if (citem.DeleteInd == "N") {

                        TotalCharge += citem.TotalChargeAmount;
                        TotalNetAmount += citem.TotalNetAmount;
                        PatientPaymentAmount += citem.PatientPaymentAmount;
                        PatientBalanceAmount += citem.PatientBalanceAmount;
                        TotalBalanceAmount += citem.PatientBalanceAmount;


                        if (citem.DiscountType === "$") {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        } else {
                            TotalDiscountAmount += (citem.DiscountAmount / 100) * (citem.UnitPrice * citem.Quantity);
                        }
                        //if ($scope.mainPosObject.OverallDiscountType === "A") {
                        //    TotalDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;
                        //} else {
                        //    TotalDiscountAmount = (parseFloat($scope.mainPosObject.OverallDiscountValue) / 100) || 0;
                        //}


                    }
                });

                $scope.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
                $scope.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
                $scope.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
                $scope.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
                $scope.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
                $scope.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
                $scope.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));
                $scope.mainPosObject.PatientDueAmount = $scope.mainPosObject.PatientBalanceAmount;
            }
            //if ($scope.mainPosObject.TotalNetAmount > 0) {
            //    if ($scope.PaymentsObj.PaymentAmount <= 0) {
            //        alertify.error("Payment amount must be greater than 0 when Total Net Amount is greater than 0.");
            //        return false;
            //    }
            //}

            //if ($scope.PaymentsObj.PaymentAmount > $scope.mainPosObject.TotalNetAmount) {
            //    alertify.error("Payment Amount should not be greater than Charge Amount.");
            //    return false;
            //}

            var InvoiceItems = [];

            angular.forEach($scope.mainPosObject.InvoiceItems, function (item) {

                let PosTransaction = [];
                if (item.PatientBalanceAmount != 0) {
                    let PatientBalance = parseFloat(item.PatientBalanceAmount) || 0;
                    let Tranobj = {
                        "InvoiceItemTransactionId": 0,
                        "InvoiceItemId": item.InvoiceItemId,
                        "OrganizationId": $scope.HospitalId,
                        "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                        "TransactionAmount": item.TotalChargeAmount,
                        "PatientAmount": PatientBalance,
                        "PatientDepositId": null,
                        "AdjustmentReasonId": null,
                        "AdjustmentReasonCode": null,
                        "ReferenceNumber": "",
                        "TransactionTypeId": 1,
                        "TransactionType": "Payment",
                        "TransactionSourceId": 10,
                        "TransactionSource": "POS",
                        "SettlementStatusId": 3,
                        "SettlementStatus": "Fully Settled",
                        "TransactionNotes": "Payment received",
                        "DeleteInd": 'N'
                    }
                    PosTransaction.push(Tranobj);
                }

                let subobj = {
                    "InvoiceItemId": item.InvoiceItemId || null,
                    "InvoiceId": item.InvoiceId || null,
                    "ItemMasterId": item.ItemMasterId || null,
                    "ItemMasterName": item.ItemMaster || "",
                    "OrganizationItemId": item.OrganizationItemId || null,
                    "Quantity": item.Quantity || 1,
                    "UnitPrice": item.UnitPrice || 0,
                    "TotalChargeAmount": item.TotalChargeAmount || 0,
                    "DiscountValue": item.DiscountValue || null,
                    "DiscountType": item.DiscountType || "",
                    //"DiscountAmount": item.DiscountAmount || 0,
                    "DiscountAmount": $scope.mainPosObject.OverallDiscountValue == 0 ?
                        item.DiscountType === "%" ? ((item.DiscountAmount / 100) * item.TotalChargeAmount) : item.DiscountAmount : item.DiscountAmount,
                    "TotalNetAmount": item.TotalNetAmount || 0,
                    "PatientPaymentAmount": item.PatientPaymentAmount || 0,
                    "PatientBalanceAmount": item.PatientBalanceAmount || 0,
                    "WriteOffAmount": item.WriteOffAmount || 0,
                    "BalanceAmount": item.BalanceAmount || 0,
                    "DeleteInd": item.DeleteInd,
                    "Transactions": PosTransaction || []
                }
                InvoiceItems.push(subobj);
            })

            var tempPayments = [];

            $scope.PaymentsObj.PaymentAmount = $scope.PaymentsObj.PaymentAmount || null;
            if ($scope.PaymentsObj.PaymentAmount != null) {

                angular.forEach($scope.PaymentsObj.PatientDepositPaymodeList, function (sitem) {

                  /*  if (sitem.PaymentId == 0) {*/
                        let obj = {
                            "PaymentId":0,
                            "InvoiceId": $scope.mainPosObject.InvoiceId || 0,
                            "PaymentMethodId": sitem.PaymentMethodId || null,
                            "PaymentMethod": sitem.PaymentMethodName || "",
                            "PaymentAmount": sitem.DepositAmount || 0,
                            "PatientDepositId": sitem.PatientDepositId || null,
                            "TransactionTypeId": $scope.PaymentsObj.TransactionTypeId,
                            "TransactionType": $scope.PaymentsObj.TransactionType,
                            "DeleteInd": $scope.PaymentsObj.DeleteInd,
                            "CardNumber": sitem.CardNumber || '',
                            "CardType": sitem.CardType || '',
                            "CardtypeId": sitem.CardtypeId || 0,
                            "NMITransactionId": sitem.NMITransactionId || "",
                            "OnlineTransactionNumber": sitem.OnlineTransactionNumber || null,
                            "PaymentProcessTypeId": sitem.PaymentProcessTypeId || null,
                            "PaymentProcessType": sitem.PaymentProcessType || null,
                            "BillPaymentTypeId": sitem.BillPaymentTypeId || null,
                            "BillPaymentType": sitem.BillPaymentType || null,
                        }
                        tempPayments.push(obj);
                    //}

                })
                //$scope.PaymentsObj.PaymentMethodId = $scope.PaymentsObj.PaymentMethodId || null;
                //if ($scope.PaymentsObj.PaymentMethodId == null) {
                //    alertify.error("Please Select PaymentMethod");
                //    return false;
                //}

                //tempPayments.push(obj);
            }
            let paymentStatusIdMap = {
                "Unpaid": 1,
                "Partially Paid": 2,
                "Fully Paid": 3
            };

            let paymentStatusText = getPaymentStatus(
                $scope.mainPosObject.TotalNetAmount,
                $scope.PaymentsObj.PaymentAmount
            );

            let paymentStatusId = paymentStatusIdMap[paymentStatusText];

            if ($scope.HospitalId != null) {
                var filtredArray = $filter("filter")(mainBillerDataObj.AllBranchesList, { "BranchId": $scope.HospitalId }, true) || [];
                if (filtredArray.length > 0) {
                    $scope.mainPosObject.BillingProviderId = filtredArray[0].DefaultBillingProviderId;
                    $scope.mainPosObject.OrganizationTransactionId = filtredArray[0].BranchId;
                    $scope.mainPosObject.OrganizationTransactionName = filtredArray[0].BranchName;
                }
            }

            let param = {
                "UserId": $scope.UserId,
                "InvoiceId": $scope.mainPosObject.InvoiceId,
                "PatientId": $scope.mainPosObject.PatientId,
                "PatientName": $scope.mainPosObject.PatientName,
                "OrganizationId": $scope.HospitalId,
                "BuyerId": $scope.mainPosObject.BuyerId,
                "BuyerName": $scope.mainPosObject.BuyerName,
                "IsEmployee": $scope.mainPosObject.IsEmployee,
                "SoldByUserId": $scope.mainPosObject.SoldByUserId,
                "SoldBy": $scope.mainPosObject.SoldBy,
                "BillingProviderId": $scope.mainPosObject.BillingProviderId,
                "BillingProviderName": $scope.mainPosObject.BillingProviderName,
                "RenderingProviderId": $scope.mainPosObject.RenderingProviderId,
                "RenderingProviderName": $scope.mainPosObject.RenderingProviderName,
                "InvoiceDate": $scope.mainPosObject.InvoiceDate,
                "DiscountReasonId": $scope.mainPosObject.DiscountReasonId,
                "DiscountReasonCode": $scope.mainPosObject.DiscountReasonCode,
                "OverallDiscountValue": $scope.mainPosObject.OverallDiscountValue || 0,
                "OverallDiscountType": $scope.mainPosObject.OverallDiscountType || "",
                "TotalChargeAmount": $scope.mainPosObject.TotalChargeAmount || "",
                "TotalDiscountAmount": $scope.mainPosObject.TotalDiscountAmount || 0,
                "TotalNetAmount": $scope.mainPosObject.TotalNetAmount || 0,
                "PatientPaymentAmount": $scope.mainPosObject.PatientPaymentAmount || 0,
                "PatientBalanceAmount": $scope.mainPosObject.PatientBalanceAmount || 0,
                "WriteOffAmount": $scope.mainPosObject.WriteOffAmount || 0,
                "TotalBalanceAmount": $scope.mainPosObject.TotalBalanceAmount || 0,
                //"PaymentStatus": $scope.mainPosObject.PaymentStatus || 0,
                //"PaymentStatusId": $scope.mainPosObject.PaymentStatusId || "",
                "DeleteInd": $scope.mainPosObject.DeleteInd || "N",
                "InvoiceItems": InvoiceItems || [],
                "Payments": tempPayments || [],
                "ReferenceNumber": $scope.mainPosObject.ReferenceNumber || '',
                "PaymentStatus": paymentStatusText,
                "PaymentStatusId": paymentStatusId,
                "Remarks": "",
                "PaymentTransactionTypeId": 2,
                "PaymentTransactionType": 'Debit',
                "OrganizationTransactionId": $scope.mainPosObject.OrganizationTransactionId,
                "OrganizationTransactionName": $scope.mainPosObject.OrganizationTransactionName,
            }



            eHnoteInsuranceService.AddUpdatePOSSale(param).then(function (resp) {
                if (resp.data.Status === "Success") {
                    if ($scope.SaveIndicator == 2) {
                        /* $scope.mainPosObject = getMainPosObject();*/

                        $scope.POSPrintList(resp.data);
                    }

                    $uibModalInstance.close();
                }
            }, function (err) { console.log(err); });

        }

        $scope.POSPrintList = function (item) {

            $scope.POSPrintMainObj = getPOSListObj();
            item = item || '';


            $scope.POSPrintMainObj.BuyerId = item.BuyerId || 0;
            $scope.POSPrintMainObj.BuyerName = item.BuyerName || '';
            $scope.POSPrintMainObj.InvoiceId = item.InvoiceId || 0;
            $scope.POSPrintMainObj.InvoiceDate = item.InvoiceDate || '';
            $scope.POSPrintMainObj.InvoiceItems = item.InvoiceItems || [];
            $scope.POSPrintMainObj.InvoiceNumber = item.InvoiceNumber || '';
            $scope.POSPrintMainObj.PatientBalanceAmount = item.PatientBalanceAmount || 0;
            $scope.POSPrintMainObj.PaymentMethods = item.PaymentMethods || [];
            $scope.POSPrintMainObj.ReferenceNumber = item.ReferenceNumber || '';
            $scope.POSPrintMainObj.RenderingProviderId = item.RenderingProviderId || 0;
            $scope.POSPrintMainObj.RenderingProviderName = item.RenderingProviderName || '';
            $scope.POSPrintMainObj.SoldBy = item.SoldBy || '';
            $scope.POSPrintMainObj.SoldByUserId = item.SoldByUserId || 0;
            $scope.POSPrintMainObj.TotalBalanceAmount = item.TotalBalanceAmount || 0;
            $scope.POSPrintMainObj.TotalChargeAmount = item.TotalChargeAmount || 0;
            $scope.POSPrintMainObj.TotalDiscountAmount = item.TotalDiscountAmount || 0;
            $scope.POSPrintMainObj.TotalNetAmount = item.TotalNetAmount || 0;
            $scope.POSPrintMainObj.PatientName = item.PatientName || 0;
            $scope.POSPrintMainObj.PatientId = item.PatientId || 0;
            $scope.POSPrintMainObj.PatientDisplayID = item.DisplayID || 0;

            $scope.POSPrintMainObj.OrganizationName = item.OrganizationName || '';
            $scope.POSPrintMainObj.OrganizationCityName = item.OrganizationCityName || '';
            $scope.POSPrintMainObj.OrganizationStateName = item.OrganizationStateName || '';
            $scope.POSPrintMainObj.OrganizationStateCode = item.OrganizationStateCode || '';
            $scope.POSPrintMainObj.OrganizationZipCode = item.OrganizationZipCode || '';
            $scope.POSPrintMainObj.OrganizationFaxNo = item.OrganizationFaxNo || '';
            $scope.POSPrintMainObj.OrganizationNPI = item.OrganizationNPI || '';
            /*$scope.POSPrintMainObj.OrganizationContactNo = item.OrganizationContactNo || '';*/
            $scope.POSPrintMainObj.OrganizationAddressLine1 = item.OrganizationAddressLine1 || '';
            $scope.POSPrintMainObj.OrganizationAddressLine2 = item.OrganizationAddressLine2 || '';

            angular.forEach($scope.POSPrintMainObj.PaymentMethods, function (pitem) {
                $scope.POSPrintMainObj.TotalPaymentAmount += pitem.DepositAmount
            })
            angular.forEach($scope.POSPrintMainObj.InvoiceItems, function (Mitem) {
                $scope.POSPrintMainObj.PosChargeAmount += Mitem.TotalChargeAmount || 0;
                $scope.POSPrintMainObj.PosDiscountAmount += Mitem.DiscountAmount || 0;
                $scope.POSPrintMainObj.PosPatientPaymentAmt += Mitem.PatientPaymentAmount || 0;
                $scope.POSPrintMainObj.PosTotalNetAmount += Mitem.TotalNetAmount || 0;
                $scope.POSPrintMainObj.PosTotalPatbalance += Mitem.PatientBalanceAmount || 0;
            })

            var obj = eHnoteUserDataService.UsMobileFormatChange(item.OrganizationContactNo);
            $scope.POSPrintMainObj.OrganizationContactNo = obj.UsFormatMobileNumber;

            var POSIntegerNumber = Math.floor($scope.POSPrintMainObj.TotalPaymentAmount);
            var POSDecimalNumber = Math.round(($scope.POSPrintMainObj.TotalPaymentAmount - POSIntegerNumber) * 100);

            $scope.POSPrintMainObj.POSIntegerNumber = POSIntegerNumber;
            $scope.POSPrintMainObj.POSDecimalNumber = POSDecimalNumber;

            var IntegerCostWords = eHnotePrintService.ConvertNumberToWords($scope.POSPrintMainObj.POSIntegerNumber);
            $scope.POSPrintMainObj.IntegerAmountInWords = IntegerCostWords;

            if ($scope.POSPrintMainObj.POSDecimalNumber > 0) {
                var DecimalCostWords = eHnotePrintService.ConvertNumberToWords($scope.POSPrintMainObj.POSDecimalNumber);
                $scope.POSPrintMainObj.DecimalAmountInWords = DecimalCostWords;
            }


            //var CostInWords = eHnotePrintService.ConvertNumberToWords($scope.POSPrintMainObj.TotalPaymentAmount);
            //$scope.POSPrintMainObj.AmountInWords = CostInWords;

            var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
            var printTime = moment(new Date()).format("HH:mm A");
            var printDatemTime = printDate + '  ' + printTime;
            $scope.POSPrintMainObj.PrintedDatenTime = printDatemTime;

            $scope.$applyAsync(function () {
                var innerContents = document.getElementById('POS_ReceiptPrint').innerHTML;
                var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            });

        }
        $scope.onselectServiceItem = function (obj) {

            /*$scope.MastersPosItemlist.forEach(item => {
                if (item.ItemMasterId === obj.ItemMasterId) {
                    item.isActiveSelectedItem = true;
                }
            })*/
            var filteredarray = $filter("filter")($scope.mainPosObject.InvoiceItems, { "ItemMasterId": obj.ItemMasterId, "DeleteInd": "N" }, true) || [];
            if (filteredarray.length > 0) {
                alertify.error("Product already added!");
                $scope.PatientSearchObj.ServiceObj = "";
                return false;
            }
            if ($scope.PaymentsObj.PatientDepositPaymodeList.length > 0) {
                $scope.hasDepositSelected = ($scope.PaymentsObj.PatientDepositPaymodeList.length > 0);
                $scope.PaymentsObj.PatientDepositPaymodeList = [];
                $scope.mainPosObject.PatientDueAmount = $scope.mainPosObject.TotalNetAmount || 0;
                $scope.mainPosObject.PayableAmount = $scope.mainPosObject.TotalNetAmount || 0;
                $scope.EditPosMainData.PatientPaymentAmount = 0;
                $scope.PaymentsObj.PaymentAmount = 0;
            }

            //$scope.hasDepositSelected = ($scope.PaymentsObj.PatientDepositPaymodeList.length > 0);
            //if ($scope.hasDepositSelected) {
            //    alertify.error("First Please Remove Added Payment Amounts");
            //    return;
            //}


            $scope.mainPosObject.OverallDiscountValue = 0;
            $scope.mainPosObject.OverallDiscountType = "A";
            $scope.PosInvoiceItemsObj = getPosInvoiceItemsObj();

            $scope.PosInvoiceItemsObj.ItemMasterId = obj.ItemMasterId;
            $scope.PosInvoiceItemsObj.ItemMaster = obj.ItemMaster;
            $scope.PosInvoiceItemsObj.PosCategoryId = obj.PosCategoryId;
            $scope.PosInvoiceItemsObj.PosCategory = obj.PosCategory;
            $scope.PosInvoiceItemsObj.OrganizationItemMasterId = obj.OrganizationItemMasterId;
            $scope.PosInvoiceItemsObj.SalesPrice = obj.SalesPrice || 0;
            $scope.PosInvoiceItemsObj.UnitPrice = obj.SalesPrice || 0;
            $scope.PosInvoiceItemsObj.DiscountType = $scope.mainPosObject.OverallDiscountType == 'P' ? '%' : "$";
            $scope.PosInvoiceItemsObj.MRP = obj.MRP || 0;
            $scope.PosInvoiceItemsObj.CostPrice = obj.CostPrice || 0;

            $scope.PosInvoiceItemsObj.TotalChargeAmount = $scope.PosInvoiceItemsObj.UnitPrice * $scope.PosInvoiceItemsObj.Quantity;
            $scope.PosInvoiceItemsObj.TotalNetAmount = $scope.PosInvoiceItemsObj.UnitPrice * $scope.PosInvoiceItemsObj.Quantity;
            $scope.PosInvoiceItemsObj.PatientBalanceAmount = (obj.SalesPrice * $scope.PosInvoiceItemsObj.Quantity);


            $scope.PosInvoiceItemsObj.IsSelected = true;

            $scope.mainPosObject.InvoiceItems.push($scope.PosInvoiceItemsObj);
            $scope.PatientSearchObj.ServiceObj = "";
            $scope.mainPosObject.PaymentModeId = "";
            $scope.mainPosObject.PaymentAmount = "";

            //if ($scope.mainPosObject.OverallDiscountValue > 0) {
            //    $scope.calculateLineItemsAmount2();
            //}
            //else {
            //    $scope.calculateLineItemsAmount1();
            //}
            $scope.ResetcalculateLineItemsAmount();

            //$scope.OnSelectDiscountType(obj);
        };


        $scope.onTotalDiscountChange = function () {
            if ($scope.mainPosObject.OverallDiscountValue) {
                $scope.disableIndividualDiscount = true;
            } else {
                $scope.disableIndividualDiscount = false;
            }
            
        };

        $scope.OverallDisAmntdisabled = false;
        $scope.onIndividualDiscountChange = function () {

            var hasIndividualDiscount = $scope.mainPosObject.InvoiceItems.some(item => item.DiscountAmount > 0);
            $scope.disableTotalDiscount = hasIndividualDiscount;
            /* $scope.EditOverAllBool = true;*/

            if ($scope.mainPosObject.TotalDiscountAmount == 0) {
                $scope.OverallDisAmntdisabled = true;
            }


        };

        $scope.ResetcalculateLineItemsAmount = function () {

            var InvoiceItems = $scope.mainPosObject.InvoiceItems;
            var OverallDiscountAmount = 0;
            $scope.mainPosObject.OverallDiscountValue = 0;
            $scope.mainPosObject.OverallDiscountType === "A"
            if ($scope.mainPosObject.OverallDiscountType === "A") {
                OverallDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;
            } else {
                OverallDiscountAmount = (parseFloat($scope.mainPosObject.OverallDiscountValue) / 100) || 0;
            }

            angular.forEach(InvoiceItems, function (citem) {

                citem.UnitPrice = parseFloat(citem.UnitPrice) || 0;
                citem.Quantity = parseInt(citem.Quantity) || 1;

                var DiscountAmount = OverallDiscountAmount;
                citem.DiscountAmount = DiscountAmount;


                citem.TotalChargeAmount = citem.UnitPrice * citem.Quantity;
                citem.TotalNetAmount = (citem.UnitPrice * citem.Quantity) - citem.DiscountAmount;
                citem.PatientBalanceAmount = citem.TotalNetAmount - (citem.PatientPaymentAmount || 0);
            });
            
            $scope.calculateClaimTotalAmounts();
        };
        $scope.calculateLineItemsAmount = function () {

            var InvoiceItems = $scope.mainPosObject.InvoiceItems;
            var OverallDiscountAmount = 0;

            if ($scope.mainPosObject.OverallDiscountType === "A") {
                OverallDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;
            } else {
                OverallDiscountAmount = (parseFloat($scope.mainPosObject.OverallDiscountValue) / 100) || 0;
            }

            angular.forEach(InvoiceItems, function (citem) {

                citem.UnitPrice = parseFloat(citem.UnitPrice) || 0;
                citem.Quantity = parseInt(citem.Quantity) || 1;
                if (OverallDiscountAmount > 0) {
                    var DiscountAmount = OverallDiscountAmount;
                    citem.DiscountAmount = DiscountAmount;
                }
                else {
                    citem.DiscountAmount = citem.DiscountAmount || 0;
                }

                citem.TotalChargeAmount = citem.UnitPrice * citem.Quantity;
                citem.TotalNetAmount = (citem.UnitPrice * citem.Quantity) - citem.DiscountAmount;
                citem.PatientBalanceAmount = citem.TotalNetAmount - (citem.PatientPaymentAmount || 0);
            });

            $scope.calculateClaimTotalAmounts();
        };
        $scope.calculateLineItemsAmount1 = function () {


            var InvoiceItems = $scope.mainPosObject.InvoiceItems;

            var OverallDiscountAmount = 0;

            if ($scope.mainPosObject.OverallDiscountType === "A") {
                OverallDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;
            } else {
                OverallDiscountAmount = (parseFloat($scope.mainPosObject.OverallDiscountValue) / 100) || 0;
            }

            angular.forEach(InvoiceItems, function (citem) {

                citem.UnitPrice = parseFloat(citem.UnitPrice) || 0;
                citem.Quantity = parseInt(citem.Quantity) || 1;
                if (OverallDiscountAmount > 0) {
                    var DiscountAmount = OverallDiscountAmount;
                    //$scope.OverallDiscountAmountdata = DiscountAmount;
                    citem.DiscountAmount = DiscountAmount;
                } else {
                    citem.DiscountAmount = citem.DiscountAmount;
                }


                citem.TotalChargeAmount = citem.UnitPrice * citem.Quantity;
                citem.TotalNetAmount = (citem.UnitPrice * citem.Quantity) - citem.DiscountAmount;
                citem.PatientBalanceAmount = citem.TotalNetAmount - (citem.PatientPaymentAmount || 0);

            });

            $scope.calculateClaimTotalAmounts1();
        };
        $scope.calculateLineItemsAmount3 = function () {
            $scope.hasDepositSelected = ($scope.PaymentsObj.PatientDepositPaymodeList.length > 0);
            $scope.PaymentsObj.PatientDepositPaymodeList = [];
            $scope.EditPosMainData.PatientPaymentAmount = 0;
            $scope.PaymentsObj.PaymentAmount = 0;
            //if ($scope.hasDepositSelected) {
            //    alertify.error("First Please Remove Added Payment Amounts");
            //    $scope.mainPosObject.OverallDiscountValue = 0;
            //    return;
            //}

            var InvoiceItems = $scope.mainPosObject.InvoiceItems;
            var OverallDiscountAmount = 0;
            var totalChargeAmount = InvoiceItems.reduce((sum, item) => sum + (item.UnitPrice * item.Quantity), 0);

            if ($scope.mainPosObject.OverallDiscountType === "A") {
                OverallDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;
            } else {
                var discountPercentage = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;
                OverallDiscountAmount = (totalChargeAmount * discountPercentage) / 100;
            }
            if (OverallDiscountAmount > totalChargeAmount) {
                alertify.error("Discount Shold not be greater Than Charge Amount");
                $scope.mainPosObject.OverallDiscountValue = 0;
                $scope.mainPosObject.OverallDiscountType = "A";
                return false;
            }
            var remainingDiscount = OverallDiscountAmount;
            InvoiceItems.sort((a, b) => (a.UnitPrice * a.Quantity) - (b.UnitPrice * b.Quantity));
            angular.forEach(InvoiceItems, function (citem) {
                citem.UnitPrice = parseFloat(citem.UnitPrice) || 0;
                citem.Quantity = parseInt(citem.Quantity) || 1;
                citem.TotalChargeAmount = citem.UnitPrice * citem.Quantity;

                if (remainingDiscount > 0) {
                    var discountToApply = Math.min(citem.TotalChargeAmount, remainingDiscount);
                    citem.DiscountAmount = parseFloat(discountToApply).toFixed(2);
                    remainingDiscount -= discountToApply;
                } else {
                    citem.DiscountAmount = 0;
                }
                $scope.mainPosObject.OverallDiscountType == 'A' ? citem.DiscountType = '$' : citem.DiscountType = '%';
                citem.TotalNetAmount = Math.max(parseFloat(citem.TotalChargeAmount) - parseFloat(citem.DiscountAmount), 0);
                citem.PatientBalanceAmount = citem.TotalNetAmount - (citem.PatientPaymentAmount || 0);
                citem.TotalNetAmount = parseFloat(citem.TotalNetAmount).toFixed(2);
                citem.PatientBalanceAmount = parseFloat(citem.PatientBalanceAmount).toFixed(2);

            });

            $scope.calculateClaimTotalAmounts1();
            $scope.onTotalDiscountChange();
            $scope.formatDiscount();
        };
        $scope.calculateLineItemsAmount2 = function (pitem, type) {

            type = type || '';
            pitem = pitem || null;

            if (type == 'OverAllDisAmnt') {
                $scope.mainPosObject.OverallDiscountValue = 0;
                angular.forEach($scope.mainPosObject.InvoiceItems, function (citem) {
                    if (pitem.ItemMasterId === citem.ItemMasterId) {
                        citem.DiscountAmount = 0;
                        citem.UnitPrice = parseFloat(citem.UnitPrice) || 0;
                        citem.Quantity = parseInt(citem.Quantity) || 1;
                        citem.TotalChargeAmount = citem.UnitPrice * citem.Quantity;
                        citem.TotalNetAmount = parseFloat(citem.TotalChargeAmount.toFixed(2));
                        citem.PatientBalanceAmount = citem.TotalNetAmount - (citem.PatientPaymentAmount || 0);
                    }
                  
                });
            }
            $scope.hasDepositSelected = ($scope.PaymentsObj.PatientDepositPaymodeList.length > 0);
            $scope.PaymentsObj.PatientDepositPaymodeList = [];
            $scope.EditPosMainData.PatientPaymentAmount = 0;
            $scope.PaymentsObj.PaymentAmount = 0;

            var InvoiceItems = $scope.mainPosObject.InvoiceItems;
            var totalChargeAmount = 0;

            angular.forEach(InvoiceItems, function (item) {
                item.UnitPrice = parseFloat(item.UnitPrice) || 0;
                item.Quantity = parseInt(item.Quantity) || 1;
                item.TotalChargeAmount = item.UnitPrice * item.Quantity;
                totalChargeAmount += item.TotalChargeAmount;
            });

            let totalDiscountAmount = 0;
            let discountType = $scope.mainPosObject.OverallDiscountType;
            let overallValue = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;

            if (discountType === 'A') {
                if (overallValue > totalChargeAmount) {
                    alertify.error("Discount Shold not be greater Than Charge Amount");
                    $scope.mainPosObject.OverallDiscountValue = 0;
                    $scope.mainPosObject.OverallDiscountType = "A";
                    return false;
                }
                totalDiscountAmount = Math.min(overallValue, totalChargeAmount);
            } else {

                if (overallValue > 100) {
                    alertify.error("Percentage discount should not exceed 100%");
                    $scope.mainPosObject.OverallDiscountValue = 0;
                    $scope.mainPosObject.OverallDiscountType = "P"; 
                    return false;
                }
                let discountPercent = Math.min(overallValue, 100); 
                totalDiscountAmount = (totalChargeAmount * discountPercent) / 100;
               
            }
           
            let runningTotalDiscount = 0;
            let lastIndex = InvoiceItems.length - 1;

            angular.forEach(InvoiceItems, function (item, index) {
                item.DiscountType = discountType === 'A' ? '$' : '%';

                let itemProportion = parseFloat(item.TotalChargeAmount / totalChargeAmount);
                let itemDiscount = parseFloat(totalDiscountAmount * itemProportion);
                if (index === lastIndex) {
                    itemDiscount = totalDiscountAmount - runningTotalDiscount;
                }

                runningTotalDiscount += itemDiscount;

                item.DiscountAmount = itemDiscount.toFixed(2);
                item.TotalNetAmount = Math.max(item.TotalChargeAmount - itemDiscount, 0).toFixed(2);
                item.PatientBalanceAmount = (item.TotalNetAmount - (item.PatientPaymentAmount || 0)).toFixed(2);
            });

            $scope.calculateClaimTotalAmounts1();
            $scope.onTotalDiscountChange();
            $scope.formatDiscount();
        };

        $scope.OnSelectDiscountType = function (sitem,type) {
            $scope.hasDepositSelected = ($scope.PaymentsObj.PatientDepositPaymodeList.length > 0);
            $scope.PaymentsObj.PatientDepositPaymodeList = [];
            $scope.EditPosMainData.PatientPaymentAmount = 0;
            $scope.PaymentsObj.PaymentAmount = 0;
            //if ($scope.hasDepositSelected) {
            //    alertify.error("First Please Remove Added Payment Amounts");
            //    sitem.DiscountAmount = 0;
            //    return;
            //}

            if (type === 'uprice') {
                angular.forEach($scope.mainPosObject.InvoiceItems, function (item) {
                    if (sitem.ItemMasterId === item.ItemMasterId) {
                        item.DiscountAmount = 0;
                        item.UnitPrice = parseFloat(item.UnitPrice) || 0;
                        item.Quantity = parseInt(item.Quantity) || 1;
                        item.TotalChargeAmount = item.UnitPrice * item.Quantity;
                        item.TotalNetAmount = parseFloat(item.TotalChargeAmount.toFixed(2));
                        item.PatientBalanceAmount = item.TotalNetAmount - (item.PatientPaymentAmount || 0);
                    }
                });
                $scope.calculateClaimTotalAmounts();
                $scope.onIndividualDiscountChange();
                return;
            }

            angular.forEach($scope.mainPosObject.InvoiceItems, function (item) {                
                if (sitem.ItemMasterId == item.ItemMasterId) {
                    $scope.DiscountPersontage = 0;
                    $scope.DiscountPersontageflag = false;

                    item.UnitPrice = parseFloat(item.UnitPrice) || 0;
                    item.Quantity = parseInt(item.Quantity) || 1;
                    item.TotalChargeAmount = item.UnitPrice * item.Quantity;
                    if (item.DiscountType === "%") {
                        $scope.DiscountPersontage = (item.DiscountAmount / 100) * item.TotalChargeAmount;
                        $scope.DiscountPersontageflag = true;
                        item.DiscountAmount = item.DiscountAmount;
                    } else if (item.DiscountType === "$") {
                        item.DiscountAmount = item.DiscountAmount;
                    } else {
                        item.DiscountAmount = 0;
                    }
                    //item.DiscountAmount = Math.min(item.DiscountAmount, item.TotalChargeAmount);
                    if ($scope.DiscountPersontageflag == true) {
                        item.TotalNetAmount = parseFloat((item.TotalChargeAmount - $scope.DiscountPersontage).toFixed(2));
                    }
                    else {
                        item.TotalNetAmount = parseFloat((item.TotalChargeAmount - item.DiscountAmount).toFixed(2));
                    }
                    item.PatientBalanceAmount = item.TotalNetAmount - (item.PatientPaymentAmount || 0);
                    if (item.TotalNetAmount < 0) {
                        alertify.error("Discount  should not be Greater Than Total Charge Amount");
                        item.DiscountAmount = 0;
                        item.TotalChargeAmount = item.UnitPrice * item.Quantity;
                        item.UnitPrice = parseFloat(item.UnitPrice) || 0;
                        item.Quantity = parseInt(item.Quantity) || 1;
                        item.TotalChargeAmount = item.UnitPrice * item.Quantity;
                        item.TotalNetAmount = parseFloat(((item.UnitPrice * item.Quantity) - item.DiscountAmount).toFixed(2)) || 0;
                        item.PatientBalanceAmount = item.TotalNetAmount - (item.PatientPaymentAmount || 0);
                        return false;
                    }
                }
            });
            $scope.calculateClaimTotalAmounts();
            $scope.onIndividualDiscountChange();
        };

        $scope.DiscountTypechange = function (type, val) {
            $scope.hasDepositSelected = ($scope.PaymentsObj.PatientDepositPaymodeList.length > 0);
            if ($scope.hasDepositSelected) {
                alertify.error("First Please Remove Added Payment Amounts");
                $scope.mainPosObject.OverallDiscountValue = 0
                return;
            }
            $scope.mainPosObject.OverallDiscountValue = 0;
            $scope.mainPosObject.OverallDiscountType = type || 'A';
            angular.forEach($scope.mainPosObject.InvoiceItems, function (citem) {
                if (type == 'A') {
                    citem.DiscountType = '$';
                }
                else if (type == 'P') {
                    citem.DiscountType = '%';
                }
                else {

                }
            });
            $scope.calculateLineItemsAmount2();
        }

        $scope.calculateClaimTotalAmounts = function (index) {
            index = index || null;
            $scope.hasDepositSelected = ($scope.PaymentsObj.PatientDepositPaymodeList.length > 0);
            if ($scope.hasDepositSelected) {
                alertify.error("First Please Remove Added Payment Amounts");
                return;
            }
            var totalItems = $scope.mainPosObject.InvoiceItems.length;
            var TotalCharge = 0, TotalDiscountAmount = 0, TotalNetAmount = 0, PatientPaymentAmount = 0, PatientBalanceAmount = 0, WriteOffAmount = 0, TotalBalanceAmount = 0;
            angular.forEach($scope.mainPosObject.InvoiceItems, function (citem) {
                if (citem.DeleteInd == "N") {

                    TotalCharge += citem.TotalChargeAmount;
                    TotalNetAmount += parseFloat(citem.TotalNetAmount);
                    PatientPaymentAmount += citem.PatientPaymentAmount;
                    PatientBalanceAmount += parseFloat(citem.PatientBalanceAmount);
                    TotalBalanceAmount += parseFloat(citem.PatientBalanceAmount);


                    if (citem.DiscountType === "$") {
                        TotalDiscountAmount += parseFloat(citem.DiscountAmount) || 0;
                    } else {
                        TotalDiscountAmount += (citem.DiscountAmount / 100) * (citem.UnitPrice * citem.Quantity);
                    }
                    //if ($scope.mainPosObject.OverallDiscountType === "A") {
                    //    TotalDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;
                    //} else {
                    //    TotalDiscountAmount = (parseFloat($scope.mainPosObject.OverallDiscountValue) / 100) || 0;
                    //}


                }
            });

            $scope.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
            $scope.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
            $scope.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
            $scope.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
            $scope.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
            $scope.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
            $scope.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));
            $scope.mainPosObject.PatientDueAmount = $scope.mainPosObject.PatientBalanceAmount || 0;
            $scope.mainPosObject.PayableAmount = $scope.mainPosObject.TotalNetAmount || 0;

        };
        $scope.calculateClaimTotalAmounts1 = function () {

            var totalItems = $scope.mainPosObject.InvoiceItems.length;
            var TotalCharge = 0, TotalDiscountAmount = 0, TotalNetAmount = 0, PatientPaymentAmount = 0, PatientBalanceAmount = 0, WriteOffAmount = 0, TotalBalanceAmount = 0;
            angular.forEach($scope.mainPosObject.InvoiceItems, function (citem) {
                if (citem.DeleteInd == "N") {

                    TotalCharge += citem.TotalChargeAmount;
                    //TotalNetAmount += parseFloat(citem.TotalNetAmount);
                    PatientPaymentAmount += parseFloat(citem.PatientPaymentAmount);
                    PatientBalanceAmount += parseFloat(citem.PatientBalanceAmount);
                    TotalBalanceAmount += parseFloat(citem.PatientBalanceAmount);


                    if ($scope.mainPosObject.OverallDiscountType === "A") {
                       // TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        if ($scope.mainPosObject.OverallDiscountValue == '') {
                            $scope.mainPosObject.OverallDiscountValue = 0;
                        }
                        TotalDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue);
                        TotalNetAmount = parseFloat($scope.mainPosObject.TotalChargeAmount) - TotalDiscountAmount;
                    } else {
                        TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        TotalNetAmount += parseFloat(citem.TotalNetAmount);
                    }
                    //if ($scope.mainPosObject.OverallDiscountType === "A") {
                    //    TotalDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;

                    //} else {
                    //    TotalDiscountAmount = (parseFloat($scope.mainPosObject.OverallDiscountValue) / 100) || 0;
                    //}


                }
            });

            $scope.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
            $scope.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
            $scope.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
            $scope.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
            $scope.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
            $scope.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
            $scope.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));
            $scope.mainPosObject.PatientDueAmount = $scope.mainPosObject.PatientBalanceAmount || 0;
            if ($scope.mainPosObject.TotalNetAmount < 0) {
                alertify.error("Over All Discount  should not be Greater Than Total Charge Amount");
                $scope.mainPosObject.OverallDiscountValue = 0;
                TotalCharge = 0; TotalDiscountAmount = 0; TotalNetAmount = 0; PatientPaymentAmount = 0; PatientBalanceAmount = 0; WriteOffAmount = 0; TotalBalanceAmount = 0;
                angular.forEach($scope.mainPosObject.InvoiceItems, function (citem) {
                    citem.TotalChargeAmount = citem.UnitPrice * citem.Quantity;
                    citem.UnitPrice = parseFloat(citem.UnitPrice) || 0;
                    citem.Quantity = parseInt(citem.Quantity) || 1;
                    citem.DiscountAmount = 0;
                    citem.TotalNetAmount = (citem.UnitPrice * citem.Quantity) - citem.DiscountAmount;
                    citem.PatientBalanceAmount = citem.TotalNetAmount - (citem.PatientPaymentAmount || 0);


                    TotalCharge += citem.TotalChargeAmount;
                    TotalNetAmount += citem.TotalNetAmount;
                    PatientPaymentAmount += citem.PatientPaymentAmount;
                    PatientBalanceAmount += citem.PatientBalanceAmount;
                    TotalBalanceAmount += citem.PatientBalanceAmount;

                    if ($scope.mainPosObject.OverallDiscountType === "A") {
                        TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                    } else {
                        TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                    }

                });

                $scope.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
                $scope.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
                $scope.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
                $scope.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
                $scope.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
                $scope.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
                $scope.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));
                $scope.disableTotalDiscount = false;
                $scope.disableIndividualDiscount = false;
                return false;
            }


            $scope.mainPosObject.PayableAmount = $scope.mainPosObject.TotalNetAmount || 0;

        };

        $scope.calculatePaymentsAmount = function () {


            let validItems = [];

            let total = 0;
            $scope.PaymentsObj.PatientDepositPaymodeList.forEach((item, index) => {
                const amount = (item.DeleteInd !== 'Y' && item.PaymentId == 0) ? (parseFloat(item.DepositAmount) || 0) : 0;

                if ((total + amount) > $scope.mainPosObject.PatientBalanceAmount) {
                    alertify.error("Payment amount should not be greater than patient balance!");
                } else {
                    total += amount;
                    validItems.push(item);
                }
            });
            $scope.PaymentsObj.PatientDepositPaymodeList = validItems;
            $scope.PaymentsObj.PaymentAmount = parseFloat(total.toFixed(2));
        };

        $scope.savecalculatePaymentsAmount = function () {
            var patientDepositAmount = parseFloat($scope.PaymentsObj.PaymentAmount);
            for (let i = 0; i < $scope.mainPosObject.InvoiceItems.length; i++) {

                let balance = $scope.mainPosObject.InvoiceItems[i].PatientBalanceAmount;
                let availableBls = $scope.mainPosObject.InvoiceItems[i].PatientBalanceAmount;
                let originalBls = $scope.mainPosObject.InvoiceItems[i].PatientPaymentAmount;;
                if (patientDepositAmount >= balance) {

                    $scope.mainPosObject.InvoiceItems[i].PatientPaymentAmount += balance;
                    $scope.mainPosObject.InvoiceItems[i].PatientBalanceAmount = (availableBls - balance);
                    patientDepositAmount -= balance;
                    $scope.TotalPatientPaymentBalance += balance;
                } else {

                    $scope.mainPosObject.InvoiceItems[i].PatientPaymentAmount += patientDepositAmount;
                    $scope.mainPosObject.InvoiceItems[i].PatientBalanceAmount = (availableBls - patientDepositAmount);
                    $scope.TotalPatientPaymentBalance += patientDepositAmount;
                    patientDepositAmount = 0;
                    break;
                }


            }

            if ($scope.mainPosObject.OverallDiscountValue > 0) {
                $scope.calculateClaimTotalAmounts1();
            } else {
                $scope.calculateClaimTotalAmounts();
            }

        };
        //if (temparray[0].CoPayValueType === "A") {
        //    item.CoPaymentAmount = parseFloat(temparray[0].CoPayCostValue);
        //} else {
        //    item.CoPaymentAmount = (temparray[0].CoPayCostValue / 100) * item.UnitCharge;
        //}

        $scope.ChangePOSsoldby = function (value) {
            if (!value || value.trim() === '') {
                $scope.mainPosObject.SoldByUserId = null;
                $scope.mainPosObject.SoldBy = '';
            }
        }

        $scope.changePOSProvider = function (value) {
            if (!value || value.trim() === '') {
                $scope.mainPosObject.RenderingProviderId = null;
                $scope.mainPosObject.RenderingProviderName = '';
            }
        }

        $scope.changeSold = function (Id) {

            Id = Id || null;
            if (Id != null) {
                var obj = $filter("filter")($scope.allUserList, { "DoctorID": Id.DoctorID }, true)[0];
                $scope.mainPosObject.SoldByUserId = obj.DoctorID;
                $scope.mainPosObject.SoldBy = obj.SecondUserFullName;
            }
        }
        $scope.changeProvider = function (Id) {

            Id = Id || null;
            if (Id != null) {
                $scope.RenderingProviderObj = {};
                var obj = $filter("filter")($scope.allUserList, { "DoctorID": Id.DoctorID }, true)[0];
                $scope.mainPosObject.RenderingProviderId = obj.DoctorID;
                $scope.mainPosObject.RenderingProviderName = obj.SecondUserFullName;
                $scope.RenderingProviderObj = obj;
            }
        }
        $scope.changeDiscount = function (Id) {
            Id = Id || null;
            if (Id != null) {
                var obj = $filter("filter")($scope.DiscountTypeList, { "DiscountReasonId": Id }, true)[0];
                $scope.mainPosObject.DiscountReasonCode = obj.DiscountReasonCode;
            }
        }
        $scope.changeFacility = function (Id) {
            Id = Id || null;
            if (Id != null) {
                var obj = $filter("filter")($scope.OrganizationFacilityList, { "OrganizationFacilityId": Id }, true)[0];
                $scope.mainPosObject.BillingProviderName = obj.FacilityName;
            }
        }







        $scope.LoadPatientListSearch = function (val) {


            if (val == undefined || val == null || val == "") {
                $scope.AllPatientList = [];
                $scope.PatientSearchObj.PatientId = 0;
                $scope.ShowPatientDetailsDrop = false;
                return false;
            }
            var param = {
                "PageSize": 21,
                "UserId": "",
                "PageNumber": 1,
                "SearchText": "",
                "Count": 0,
                "SearchDetails": { "listdocpatients": "Y" },
                "EndAge": 0,
                "StartAge": 0,
                "StartDate": "",
                "EndDate": ""
            };


            if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                param['HospitalID'] = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

                $scope.HospitalArray = [];
                angular.forEach(doctorinfo.doctordata.UserAddress, function (item) {
                    if (item.ExtDetails !== undefined) {
                        if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                            var Obj = {
                                "HospitalName": item.ClinicName,
                                "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                                "ActiveIND": "Y",
                                "isChecked": true,
                                "BranchId": item.ExtDetails.HospitalInfo.HospitalID
                            };
                            $scope.HospitalArray.push(Obj);
                        }
                    }
                });

            }
            var list = [];
            //angular.forEach($scope.HospitalArray, function (items) {
            //    if (items.isChecked) {
            //        list.push(items.BranchId);
            //    }
            //});
            angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (items) {
                list.push(items.ClinicId);
            });
            param["HospitalIDLst"] = list;
            eHnoteMasterDataService.addPatientSearchInfo(param);
            var object = {
                "UserId": $scope.UserId,
                "HospitalID": $scope.HospitalId,
                "HospitalIDLst": param.HospitalIDLst.toString(),
                "SearchText": $scope.PatientSearchObj.SearchText || "",
                "SearchTypeID": $scope.PatientSearchObj.SearchTypeId || 0,
            }
            if ($scope.PatientSearchObj.SearchTypeId == 1) {
                object.Name = val;
            } else if ($scope.PatientSearchObj.SearchTypeId == 2) {
                object.PatientId = val;
            }
            eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError)
        };
        $scope.ShowPatientDetailsDrop = false;
        function OnGetopSearchPatientSuccess(data) {

            if (data.count > 0) {
                $scope.count = data.count;
                $scope.AllPatientList = [];
                if (data.rows.length > 0) {
                    $scope.AllPatientList = data.rows || [];
                }
                else {
                    $scope.count = 0;
                    $scope.AllPatientList = [];
                }
            }

            if (data.count > 0) {
                $scope.count = data.count;
                $scope.AllPatientList = [];
                $scope.patientDetailsList = [];
                $scope.patientinitval = {};
                angular.forEach(data.rows, function (item) {
                    $scope.patientinitval = {};
                    var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                    var val = array_list[Math.floor(Math.random() * array_list.length)];
                    if (item.EmailID !== undefined) {
                        $scope.patientinitval.EmailID = item.EmailID;
                    }

                    $scope.patientinitval.PatientID = item.PatientId;
                    $scope.patientinitval.Title = item.Title;
                    $scope.patientinitval.S3URL = item.ProfileImg || "";
                    $scope.patientinitval.FullName = item.FullName;
                    $scope.patientinitval.FirstName = item.FirstName;
                    $scope.patientinitval.LastName = item.LastName;
                    $scope.patientinitval.DOB = item.DOB;
                    $scope.patientinitval.AgeInYears = item.AgeInYears;
                    $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                    $scope.patientinitval.AgeInDays = item.AgeInDays;
                    $scope.patientinitval.AltCountryCode = item.AltCountryCode || '';
                    $scope.patientinitval.Altareacode = item.Altareacode || '';
                    $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || '';

                    $scope.patientinitval.Gender = item.Gender;
                    $scope.patientinitval.LastVisited = item.LastVisited;
                    $scope.patientinitval.CountryCode = item.CountryCode;
                    $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                    $scope.patientinitval.CurrentAge = item.CurrentAge;
                    $scope.patientinitval.colors = val;
                    $scope.patientinitval.OldMrno = item.OldMrno || "";
                    $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                    $scope.patientinitval.patientdisplayid = item.DisplayID;
                    $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                    $scope.patientinitval.familydisplayid = item.FamilyDisplayID;

                    $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                    $scope.patientinitval.Due = item.Due;
                    $scope.patientinitval.PatientTypeId = item.PatientTypeId;
                    $scope.patientinitval.IsVIPInd = item.IsVIPInd || false;
                    $scope.patientinitval.IsResearchInd = item.IsResearchInd || false;
                    $scope.patientinitval.IsHighRiskInd = item.IsHighRiskInd || false;
                    $scope.patientinitval.DisplayID = item.DisplayID || "";
                    $scope.patientinitval.Altareacode = item.Altareacode || "";
                    $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || "";
                    $scope.patientinitval.InsuranceDetails = item.InsuranceDetails || [];
                    var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                    $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                    var previouspatval = angular.copy($scope.patientinitval);
                    $scope.patientDetailsList.push(previouspatval);
                });
                $scope.AllPatientList = $scope.patientDetailsList;

                $scope.noresult = false;
                $scope.showloading = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.count = 0;
                $scope.AllPatientList = [];
            }
            if ($scope.PatientSearchObj.SearchText != "") {
                $scope.ShowPatientDetailsDrop = true;
            }
        }
        function OnGetopPatientSearchError() {
            $scope.count = 0;
            $scope.AllPatientList = [];
            $scope.PatientSearchObj.SearchText = "";
        }
        $scope.SelectedPatientData = function (patietnitem) {
            
            patietnitem.PatientID = patietnitem.PatientID || 0;
            if (patietnitem.PatientID == 0) {
                return false;
            }
            eHnoteAuditServices.getParticularPatientDetailsById(patietnitem.PatientID, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(response) {
                console.log(response);
                
                if (response.count > 0) {
                    patietnitem = response.rows[0];
                    patietnitem.PatientID = patietnitem.PatientId;
                    $scope.PatientSearchObj.PatientId = patietnitem.PatientID;
                    $scope.PatientSearchObj.SearchText = patietnitem.FullName;
                    $scope.PatientSearchObj.PatientFullName = patietnitem.FullName;
                    $scope.mainPosObject.PatientName = patietnitem.FullName || '';
                    $scope.PatientSearchObj.FirstName = patietnitem.FirstName || '';
                    $scope.PatientSearchObj.LastName = patietnitem.LastName || '';
                    $scope.mainPosObject.BuyerName = patietnitem.FullName || '';
                    $scope.mainPosObject.BuyerId = patietnitem.PatientID || '';
                    $scope.mainPosObject.PatientId = patietnitem.PatientID || '';
                    $scope.PatientSearchObj.DOB = patietnitem.DOB;
                    $scope.PatientSearchObj.S3URL = patietnitem.S3URL;
                    $scope.PatientSearchObj.PatientMRNo = patietnitem.DisplayID;
                    $scope.PatientSearchObj.MobileNo = patietnitem.PhoneNumber;
                    $scope.PatientSearchObj.MobileNo = $scope.PatientSearchObj.MobileNo || null;
                    if ($scope.PatientSearchObj.MobileNo != null) {
                        var Number = eHnoteUserDataService.UsMobileFormatChange($scope.PatientSearchObj.MobileNo);
                        $scope.PatientSearchObj.MobileNo = Number.UsFormatMobileNumber;

                    }
                    $scope.PatientSearchObj.EmailId = patietnitem.EmailID;
                    $scope.PatientSearchObj.Gender = patietnitem.Gender;
                    $scope.PatientSearchObj.AgeInYears = patietnitem.AgeInYears;
                    $scope.PatientSearchObj.AgeInMonths = patietnitem.AgeInMonths;

                    $scope.PatientSearchObj.Patientaddress1 = patietnitem.PostalAddress.AddressLine1;
                    $scope.PatientSearchObj.Patientaddress2 = patietnitem.PostalAddress.AddressLine2;
                    $scope.PatientSearchObj.Patientcity = patietnitem.PostalAddress.CityName;
                    $scope.PatientSearchObj.Patientstate = patietnitem.PostalAddress.StateCode;
                    $scope.PatientSearchObj.Patientzip = patietnitem.PostalAddress.ZipCode;

                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }
            

            $scope.AllPatientList = [];
            $scope.ShowPatientDetailsDrop = false;
            $scope.Subtab = 1;
        };

        $scope.uibclose = function () {
            $uibModalInstance.close("cancel");
        };


        $scope.ChangePosCategory = function (item) {
            $scope.PatientSearchObj.PosCategoryId = item;
            //$scope.mainPosObject = getMainPosObject();
        }


        $scope.GetPosOrganizationProcedure = function (text) {


            let params = {
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "ItemMasterId": null,
                "IsFrequent": "N",
                "SearchText": text || "",
                "PosCategoryId": $scope.PatientSearchObj.PosCategoryId || 0,
                "PageNumber": 1,
                "PageSize": 20
            }

            if (params.SearchText == '') {
                params.IsFrequent = 'Y';
            }

            return eHnoteSettingsDataService.GetPosOrganizationItemmasters(params).then(function (resp) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            });
        };
        $scope.GetPaymentmethodList = function () {
            var Obj = {
                "PaymentId": 0,
                "PaymentMethodId": 1,
                "PaymentMethodName": "Cash",
                "DepositAmount": "",
                "ReferenceNumber": "",
                "IsDepositAdded": false,
                "DeleteInd": "N",
                "PatientDepositId": null,
                "CardNumber": "",
                "CardType": "",
                "CardtypeId": 0,
            }
            return Obj;
        }

        $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
        //$scope.AddMultiplePatientDeposits = function (item, typeId) {

        //    if (item.PaymentMethodId == 0) {
        //        alertify.error("Please select Payment method");
        //        return;
        //    }
        //    if (item.DepositAmount == "") {
        //        alertify.error("Please Enter Payment amount");
        //        return;
        //    } else {

        //    }

        //    var List = $filter("filter")($scope.masterPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === item.PaymentMethodId; }) || [];
        //    if (List.length > 0) {
        //        item.PaymentMethodName = List[0].PaymentModeName;
        //    }

        //    var obj = {
        //        "PaymentId": 0,
        //        "PaymentMethodId": 0,
        //        "PaymentMethodName": "",
        //        "DepositAmount": "",
        //        "ReferenceNumber": "",
        //        "IsDepositAdded": false,
        //        "DeleteInd": "N",
        //        "PatientDepositId": null,
        //        "CardtypeId": 0,
        //        "CardType": '',
        //        "CardNumber": '',
        //    }


        //    typeId = typeId || 0;
        //    if (typeId == 1) {
        //        if ($scope.PaymentsObj.PatientDepositPaymodeList.length >= 5) {
        //            alertify.error("You can only add up to 5 records.");
        //            return;
        //        }
        //        $scope.PaymentsObj.PatientDepositPaymodeList.push(obj);
        //    } else {
        //        if ($scope.PaymentsObj.PatientDepositPaymodeList.length >= 5) {
        //            alertify.error("You can only add up to 5 records.");
        //            return;
        //        }
        //        if ($scope.PaymentsObj.PaymentAmount > $scope.mainPosObject.PatientBalanceAmount || $scope.PaymentsObj.PaymentAmount == $scope.mainPosObject.PatientBalanceAmount ) {
        //            alertify.error(`You have already paid. No balance left to add another payment mode.`);
        //            return false;
        //        }
        //        else {
        //            $scope.PaymentsObj.PatientDepositPaymodeList.push(obj);
        //        }

        //    }

        //};
        $scope.CalculateTotal = function () {
            const total = $scope.PaymentsObj.PatientDepositPaymodeList.reduce((sum, item) => {
                return sum + (item.DeleteInd !== 'Y' ? (parseFloat(item.DepositAmount) || 0) : 0);
            }, 0);

            $scope.PaymentsObj.PaymentAmount = total;
        };

        $scope.DeletePatientDeposit = function (item, index) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                let deletedAmount = parseFloat(item.DepositAmount) || 0;
                if (item.PaymentId != 0) {
                    item.DeleteInd = "Y";
                } else {
                    $scope.PaymentsObj.PatientDepositPaymodeList.splice(index, 1);
                }
                const selectedIndex = $scope.selectedDeposits.indexOf(item.PatientDepositId);
                if (selectedIndex > -1) {
                    $scope.selectedDeposits.splice(selectedIndex, 1);
                }
                $scope.mainPosObject.PatientBalanceAmount = parseFloat($scope.mainPosObject.PatientBalanceAmount)|| 0;
                $scope.mainPosObject.PatientBalanceAmount += parseFloat(deletedAmount);
                $scope.mainPosObject.PatientBalanceAmount = $scope.mainPosObject.PatientBalanceAmount.toFixed(2) || 0;
                $scope.mainPosObject.PatientDueAmount = $scope.mainPosObject.PatientBalanceAmount || 0;
                $scope.mainPosObject.PayableAmount = $scope.mainPosObject.PatientBalanceAmount || 0;
                if ($scope.EditPosMainData.PatientPaymentAmount > 0 ) {
                    $scope.EditPosMainData.PatientPaymentAmount = $scope.EditPosMainData.PatientPaymentAmount - deletedAmount || 0;
                }

                 
                $scope.CalculateTotal();

                $scope.$apply();
            }, function () {
                
            });
        };

        $scope.openDepositsPopup = function () {

            $scope.Patientobj = {
                "PatientId": $scope.mainPosObject.PatientId || 0,
                "selectedDeposits": $scope.selectedDeposits || [],
            };
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/DepositsPopUp.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "Patientobj": function () { return $scope.Patientobj; }
                },
                "windowClass": "modal__ninety--",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMasterDataService, eHnoteInsuranceService, Patientobj) {

                    $scope.selectedDeposits = Patientobj.selectedDeposits || []

                    var doctorinfo = eHnoteMasterDataService.getUserInfo();
                    $scope.UserId = eHnoteMasterDataService.getLoginId();
                    $scope.ParenthospitalId = 0;
                    $scope.SelectedDeposit = false;
                    $scope.HospitalId = 0;
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                    };
                    $scope.uibclose = function () {
                        $uibModalInstance.close("cancel");
                    };

                    $scope.GetPatientDepositsLitsObj = function () {
                        return {
                            "DepositFrom": "",
                            "DepositTo": "",
                            "PatientId": Patientobj.PatientId,
                            "OrganizationId": $scope.HospitalId,
                            "PaymentModeId": 0,
                            "PageSize": 10,
                            "PageNumber": 1,
                            "TransactionNumber": "",
                            "Type": 1
                        }
                    };


                    $scope.SearchPatientDepositsObj = angular.copy($scope.GetPatientDepositsLitsObj());


                    $scope.getPatientDepositAmountById = function () {
                        var obj = {
                            "DepositFrom": $scope.SearchPatientDepositsObj.DepositFrom || "",
                            "DepositTo": $scope.SearchPatientDepositsObj.DepositTo || "",
                            "PatientId": $scope.SearchPatientDepositsObj.PatientId,
                            "OrganizationId": $scope.SearchPatientDepositsObj.OrganizationId,
                            "PaymentModeId": 0,
                            "PageSize": 100,
                            "PageNumber": 1,
                            "TransactionNumber": "",
                            "SortBy": "Asc",
                        };
                        obj.PaymentModeId = parseInt(obj.PaymentModeId);
                        if (obj.DepositFrom != "") {
                            obj.DepositFrom = $filter("usdateFormatter")(obj.DepositFrom, "-");
                        }
                        if (obj.DepositTo != "") {
                            obj.DepositTo = $filter("usdateFormatter")(obj.DepositTo, "-");
                        }
                        eHnoteInsuranceService.GetPatientDepositAmountList(obj).then(function (resp) {
                            $scope.PatientDepositsListArray = [];
                            $scope.PatientTotalUnallocated = 0;
                            if (resp.data.status === "Success") {
                                $scope.PatientDepositsListArray = resp.data.rows || [];
                                if ($scope.PatientDepositsListArray.length > 0) {
                                    angular.forEach($scope.PatientDepositsListArray, function (item) {
                                        item.IsChecked = false;
                                        if (item.UnBilledAmount >= 0) {
                                            $scope.PatientTotalUnallocated += item.UnBilledAmount;
                                        }
                                    });

                                }
                                $scope.PtDepositsDataArray = [];
                                $scope.PtDepositsDataArray = $scope.PatientDepositsListArray.filter(item => item.DepositStatusId != 2 && item.UnBilledAmount != 0 );

                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });
                    }

                    $scope.getPatientDepositAmountById();

                    $scope.SelectPatientPayments = function (item) {
                        let obj = {
                            "Mainobj": item,
                            "IsPatientDeposit": true
                        }
                        $uibModalInstance.close(obj);
                    }
                    $scope.IsCheckAllEras = function (ischeck) {
                        if (ischeck) {
                            angular.forEach($scope.PtDepositsDataArray, function (item) {
                                item.IsChecked = true;
                            });
                        }
                        else {
                            angular.forEach($scope.PtDepositsDataArray, function (item) {
                                item.IsChecked = false;
                            });
                        }

                    }
                    $scope.SelectedDepositslist = function () {


                        var filterDeposits = $filter("filter")($scope.PtDepositsDataArray, { "IsChecked": true }, true) || [];
                        if (filterDeposits.length == 0) {
                            alertify.error("Please Select a Deposit.");
                            return false;
                        }
                        let obj = {
                            "Mainlist": filterDeposits || [],
                            "IsPatientDeposit": true
                        }
                        $uibModalInstance.close(obj);
                    }
                }
            });
            mInstanceAdd.result.then(function (resp) {
                //var remainingBalance = $scope.mainPosObject.PatientBalanceAmount;
                var remainingBalance = $scope.mainPosObject.TotalNetAmount;
      
                if (resp != 'cancel') {
                    $scope.PaymentsObj.PatientDepositPaymodeList = [];
                    $scope.PaymentsObj.PaymentAmount = 0;
                }
                angular.forEach(resp.Mainlist, function (depositItem) {
                    if ($scope.selectedDeposits.includes(depositItem.PatientDepositId)) {
                        alertify.error("Deposit is already selected!");
                        return;
                    }

                    let unbilled = depositItem.UnBilledAmount || 0;
                    let billed = depositItem.BilledAmount || 0;

                    if (unbilled <= 0) {
                        alertify.error("There is no Available Deposit Balance.");
                        return;
                    }

                   
                    let selectedAmount = Math.min(remainingBalance, unbilled);

                    if (selectedAmount <= 0) return;
                 
                    let alreadyExists = $scope.PaymentsObj.PatientDepositPaymodeList.some(function (d) {
                        return d.PatientDepositId === depositItem.PatientDepositId;
                    });

                    if (!alreadyExists) {
                        let depositCopy = angular.copy(depositItem.PatientDepositPaymodeList);
                        depositCopy[0].PaymentMethodId = 14;
                        depositCopy[0].PaymentMethodName = "Patient Deposits";
                        depositCopy[0].PaymentId = depositCopy[0].PaymentId || 0;
                        depositCopy[0].PaymentId = 0;
                        depositCopy[0].DepositAmount = selectedAmount;
                        depositCopy[0].CardNumber = "";
                        depositCopy[0].CardType = "";
                        depositCopy[0].CardtypeId = "";
                        depositCopy[0].OnlineTransactionNumber = "";
                        depositCopy[0].PaymentProcessType = "";
                        depositCopy[0].PaymentProcessTypeId = "";
                        depositCopy[0].ReferenceNumber = "";
                        $scope.PaymentsObj.PatientDepositPaymodeList.push(depositCopy[0]);

                        // Update totals
                        $scope.PaymentsObj.UnBilledAmount += selectedAmount;
                        $scope.PaymentsObj.BilledAmount += billed;
                        $scope.PaymentsObj.PaymentAmount += selectedAmount;
                        
                        $scope.PatientDepositDetails.DepositNumber = depositItem.ReceiptNo || "";
                        $scope.PatientDepositDetails.DepositAmount = selectedAmount;
                        $scope.PatientDepositDetails.DepositDate = $filter('date')(depositItem.DepositDate, "MM-dd-yyyy") || "";

                      
                        $scope.PaymentMethodObj = {
                            PaymentMethodId: 14,
                            PaymentMethodName: "Patient Deposits",
                            DepositAmount: selectedAmount,
                            ReferenceNumber: '',
                            IsDepositAdded: false,
                            DeleteInd: "N",
                            PatientDepositId: depositItem.PatientDepositId || 0,
                            CardNumber: '',
                            CardType: '',
                            CardtypeId: 0,
                            PatientDepositAmt: selectedAmount,
                            PatientDepositDate: $scope.PatientDepositDetails.DepositDate,
                            DepositNumber: $scope.PatientDepositDetails.DepositNumber
                        };
                        remainingBalance -= selectedAmount;
                        $scope.SelectedDeposit = true;
                    }
                });
                $scope.mainPosObject.PatientBalanceAmount = remainingBalance.toFixed(2);
                $scope.mainPosObject.PatientDueAmount = $scope.mainPosObject.PatientBalanceAmount || 0;
                $scope.mainPosObject.PayableAmount = $scope.mainPosObject.PatientBalanceAmount || 0;
                let totalAmount = 0;
                angular.forEach($scope.PaymentsObj.PatientDepositPaymodeList || [], function (item) {
                    totalAmount += parseFloat(item.DepositAmount) || 0;
                });
                $scope.mainPosObject.PaymentAmount = totalAmount;
               

                $scope.EditPosMainData.PatientPaymentAmount = $scope.mainPosObject.PaymentAmount || 0;

                //if (resp == "cancel") {
                //    $scope.PaymentsObj = angular.copy(getPaymentsObj());
                //}

            }, function () {

            });
        };

        function getSearchPosobj() {
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": 100,
                "PageNumber": 1,
                "InvoiceNumber": "",
                "PatientId": "",
                "SoldByUserId": "",
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PaymentStatusId": 0,
                "SearchText": "",
                "SearchTypeId": 2,
            };
            return obj;

        }
        $scope.SearchPosobj = getSearchPosobj();

        $scope.GetOrganizationPOSInvoices = function (val) {
            var val = val || null;
            $scope.POSInvoicesCount = null;
            $scope.POSPaymentListCount = null;
            $scope.POSInvoiceslist = [];

            var Frezobj = {
                "FromDate": $filter("date")(new Date($scope.SearchPosobj.FromDate), "MM-dd-yyyy") || '',
                "ToDate": $filter("date")(new Date($scope.SearchPosobj.ToDate), "MM-dd-yyyy") || '',
            };
            eHnoteMasterDataService.addPOSfreezingList(Frezobj);

            let param = {
                "OrganizationId": $scope.SearchPosobj.OrganizationId,
                "PageSize": $scope.SearchPosobj.PageSize,
                "PageNumber": $scope.SearchPosobj.PageNumber,
                "InvoiceNumber": $scope.SearchPosobj.InvoiceNumber || "",
                "PatientId": $scope.SearchPosobj.PatientId || "",
                "SoldByUserId": $scope.SearchPosobj.SoldByUserId || "",
                "FromDate": $scope.SearchPosobj.FromDate || "",
                "ToDate": $scope.SearchPosobj.ToDate || "",
                "PaymentStatusId": $scope.SearchPosobj.SoldByUserId || "",
            }

            eHnoteInsuranceService.GetOrganizationPOSInvoices(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.POSVoidInvoiceslist = resp.data.PosVoid || [];
                    if (resp.data.rows.length > 0) {
                        $scope.POSInvoicesCount = resp.data.count || 0;
                        $scope.POSInvoiceslist = resp.data.rows || [];

                        if ($scope.POSInvoiceslist.length > 0) {
                            angular.forEach($scope.POSInvoiceslist, function (item) {
                                item.Isshow = false;
                            })
                        }

                        $scope.POSPaymentListCount = $scope.POSInvoiceslist.filter(function (item) {
                            return item.PaymentStatusId != 4;
                        }).length;

                    }

                    var FilterPOSList = $filter("filter")($scope.POSInvoiceslist, function (Pitem,) { return Pitem.InvoiceId === val.InvoiceId; }) || [];
                    $scope.PatientPOSPaymodeList = [];
                    $scope.PatientPOSPaymodeList = FilterPOSList[0].PaymentMethods;
                    $scope.POSRemarks = '';
                    if (FilterPOSList[0].Remarks !="") {
                        $scope.POSRemarks= FilterPOSList[0].Remarks || '';
                    }
                  

                   /* $scope.Subtab = 1;*/
                    $scope.EditOverAllBool = true;
                    $scope.disableTotalDiscount = true;
                    let editItem = val;


                    //$scope.PatientSearchObj = {
                    //    PatientId: editItem.PatientId,
                    //    SearchText: editItem.FullName,
                    //    PatientFullName: editItem.FullName,
                    //    DOB: editItem.DOB,
                    //    PatientMRNo: editItem.DisplayID,
                    //    MobileNo: editItem.PhoneNumber,
                    //    Gender: editItem.Gender,
                    //    AgeInYears: editItem.AgeInYears,
                    //    AgeInMonths: editItem.AgeInMonths,
                    //    S3URL: editItem.S3URL
                    //};

                    $scope.UserId = editItem.CreatedByUserId;
                    // $scope.PaymentsObj.PaymentAmount = editItem.PatientPaymentAmount;

                    $scope.PaymentsObj = getPaymentsObj();
                    $scope.mainPosObject = {
                        InvoiceId: editItem.InvoiceId,
                        PatientId: editItem.PatientId,
                        PatientName: editItem.PatientName || '',
                        BuyerName: editItem.PatientName || '',
                        BuyerId: editItem.PatientId || '',
                        IsEmployee: editItem.IsEmployee || false,
                        SoldByUserId: editItem.SoldByUserId,
                        SoldBy: editItem.SoldBy || '',
                        BillingProviderId: editItem.BillingProviderId,
                        BillingProviderName: editItem.BillingProviderName || '',
                        RenderingProviderId: editItem.RenderingProviderId,
                        RenderingProviderName: editItem.RenderingProviderName || '',
                        InvoiceDate: $filter('date')(editItem.InvoiceDate, "yyyy-MM-dd"),
                        DiscountReasonId: editItem.DiscountReasonId,
                        DiscountReasonCode: editItem.DiscountReasonCode || '',
                        OverallDiscountValue: editItem.OverallDiscountValue || 0,
                        OverallDiscountType: editItem.OverallDiscountType || 'A',
                        TotalChargeAmount: editItem.TotalChargeAmount || 0,
                        TotalDiscountAmount: editItem.TotalDiscountAmount || 0,
                        TotalNetAmount: editItem.TotalNetAmount || 0,
                        PatientPaymentAmount: editItem.PatientPaymentAmount || 0,
                        PatientBalanceAmount: editItem.PatientBalanceAmount || 0,
                        WriteOffAmount: editItem.WriteOffAmount || 0,
                        TotalBalanceAmount: editItem.TotalBalanceAmount || 0,
                        PaymentStatus: editItem.PaymentStatus || '',
                        ReferenceNumber: editItem.ReferenceNumber || '',
                        PaymentStatusId: editItem.PaymentStatusId,
                        DeleteInd: editItem.DeleteInd || 'N',
                        InvoiceItems: [],
                        Remarks: editItem.Remarks
                    };
                    //$scope.EditPosMainData.PatientBalanceAmount = editItem.PatientBalanceAmount;
                    $scope.mainPosObject.PatientBalanceAmount = editItem.PatientBalanceAmount;
                    $scope.EditPosMainData.PatientPaymentAmount = editItem.PatientPaymentAmount;
                    $scope.PaymentsObj.PatientDepositPaymodeList = editItem.PaymentMethods;
                    $scope.mainPosObject.PatientDueAmount = $scope.mainPosObject.PatientBalanceAmount ||0

                    angular.forEach(editItem.InvoiceItems, function (item) {
                        let transactions = item.Transactions || [];

                        if (item.PatientBalanceAmount != 0) {
                            let PatientBalance = parseFloat(item.PatientBalanceAmount) || 0;
                            let Tranobj = {
                                "InvoiceItemTransactionId": 0,
                                "InvoiceItemId": item.InvoiceItemId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": item.TotalChargeAmount,
                                "PatientAmount": PatientBalance,
                                "PatientDepositId": null,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": null,
                                "ReferenceNumber": "",
                                "TransactionTypeId": 1,
                                "TransactionType": "Payment",
                                "TransactionSourceId": 10,
                                "TransactionSource": "POS",
                                "SettlementStatusId": 3,
                                "SettlementStatus": "Fully Settled",
                                "TransactionNotes": "Payment received",
                                "DeleteInd": 'N'
                            };
                            transactions.push(Tranobj);
                        }

                        let subobj = {
                            "InvoiceItemId": item.InvoiceItemId || null,
                            "InvoiceId": item.InvoiceId || null,
                            "ItemMasterId": item.ItemMasterId || null,
                            "ItemMasterName": item.ItemMasterName || "",
                            "ItemMaster": item.ItemMasterName || "",
                            "OrganizationItemId": item.OrganizationItemId || null,
                            "Quantity": item.Quantity || 0,
                            "UnitPrice": item.UnitPrice || 0,
                            "TotalChargeAmount": item.TotalChargeAmount || 0,
                            "DiscountValue": item.DiscountValue || 0,
                            "DiscountType": item.DiscountType || "$",
                            "DiscountAmount": item.DiscountAmount || 0,
                            "TotalNetAmount": item.TotalNetAmount || 0,
                            "PatientPaymentAmount": item.PatientPaymentAmount || 0,
                            "PatientBalanceAmount": item.PatientBalanceAmount || 0,
                            "WriteOffAmount": item.WriteOffAmount || 0,
                            "BalanceAmount": item.BalanceAmount || 0,
                            "DeleteInd": "N",
                            "Transactions": transactions
                        };

                        $scope.mainPosObject.InvoiceItems.push(subobj);
                    });



                }
            }, function (err) { console.log(err); });

        }

        $scope.navtoCollectPayment = function (id) {
            
            console.log($scope.PatientSearchObj);
            if ($scope.mainPosObject.BuyerName == "" || $scope.mainPosObject.BuyerName == null || $scope.mainPosObject.BuyerName == undefined) {
                alertify.error("Please enter the buyer name.");
                return false;
            }
            if ($scope.mainPosObject.SoldByUserId == "" || $scope.mainPosObject.SoldByUserId == null || $scope.mainPosObject.SoldByUserId == undefined) {
                alertify.error("Please Select a 'Sold By' user ");
                return false;
            }
            if ($scope.mainPosObject.RenderingProviderId == "" || $scope.mainPosObject.RenderingProviderId == null || $scope.mainPosObject.RenderingProviderId == undefined) {
                alertify.error("Please select a provider");
                return false;
            }
            if ($scope.mainPosObject.InvoiceItems.length == 0) {
                alertify.error("Please Select a POS item  ");
                return false;
            }
            $scope.mainPosObject.TotalBalanceAmount = $scope.mainPosObject.PatientDueAmount;
            $scope.mainPosObject.PatientBalanceAmount = $scope.mainPosObject.PatientBalanceAmount;

            var depositAmt = parseFloat($scope.mainPosObject.PayableAmount) || 0;
            if (depositAmt === 0) {
                alertify.error("Please Enter the Payable Amount");
                return;
            } 
            //$scope.mainPosObject.BillingProviderId = $scope.mainPosObject.BillingProviderId || 0;
            //if ($scope.mainPosObject.BillingProviderId == 0) {
            //    alertify.error("Please select Billing Provider");
            //    return false;
            //};
            var Parentobj = {
                "PatientId": $scope.PatientSearchObj.PatientId,
                "PatientFirstName": $scope.PatientSearchObj.FirstName,
                "PatientLastName": $scope.PatientSearchObj.LastName,
                "PatientDisplayId": $scope.PatientSearchObj.PatientMRNo,
                "PatientEmailId": $scope.PatientSearchObj.EmailId,
                "PatientGender": $scope.PatientSearchObj.Gender,
                "PatientAgeInYears": $scope.PatientSearchObj.AgeInYears,
                "PatientAgeInMonths": $scope.PatientSearchObj.AgeInMonths,
                "PatientDOB": $scope.PatientSearchObj.DOB,
                "PatientMobile": $scope.PatientSearchObj.MobileNo,
                "Patientaddress1": $scope.PatientSearchObj.Patientaddress1,
                "Patientaddress2": $scope.PatientSearchObj.Patientaddress2,
                "Patientcity": $scope.PatientSearchObj.Patientcity,
                "Patientstate": $scope.PatientSearchObj.Patientstate,
                "Patientzip": $scope.PatientSearchObj.Patientzip,
                "S3URL": $scope.PatientSearchObj.S3URL,
                "UserId": $scope.mainPosObject.UserId,
                "HospitalId": $scope.mainPosObject.OrganizationId,
                "PaymentAmount": $scope.mainPosObject.PayableAmount, /*$scope.mainPosObject.PatientBalanceAmount,*/// $scope.mainPosObject.PaymentAmount,// $scope.mainPosObject.TotalBalanceAmount,
                "DepositDate": $scope.mainPosObject.InvoiceDate,
                "InvoiceDate": $scope.mainPosObject.InvoiceDate,
                "PaymentModeId": $scope.mainPosObject.PaymentModeId||0,
                "PaymentMode": $scope.mainPosObject.PaymentMode||"",
                "PaymentTypeId": 3,
                "PaymentType": "PointOfSale",
                "ScreenType": "AddPOS",
                "mainPosObject": $scope.mainPosObject,
                "AllCardTypes": $scope.AllCardTypes,
                "BillingProviderId": $scope.mainPosObject.BillingProviderId,
                "BillingProviderName": $scope.mainPosObject.BillingProviderName,
                "RenderingProviderId": $scope.mainPosObject.RenderingProviderId,
                "RenderingProviderName": $scope.mainPosObject.RenderingProviderName,
                "Notes": $scope.POSRemarks || '',
                "EditOverAllBool": $scope.EditOverAllBool || false,
                "mainBillerDataObj": $scope.mainBillerDataObj || {},
                "BuyerName": $scope.mainPosObject.BuyerName,
                "LocationName": $scope.mainPosObject.LocationName,
                "PatientDepositId": $scope.PatientDepositID,
                "PatientPaymentObj": $scope.PaymentsObj,
                "IsPaymentMode": false,
                "IsShowPaymentAmount": true,
                "RenderingProviderObj": $scope.RenderingProviderObj || [],
                "DepositscreenTypeId": id,

            }
            $scope.mInstanceAdd = $uibModal.open({
               /* "templateUrl": "templates/UsClaims/UsPaymentCollection.html",*/
                "templateUrl": "templates/uibpopups/collectPayment.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "resolve": {
                    "Parentobj": function () { return Parentobj; }
                },
                /*"windowClass": "right-to-left-modal offcanves-right modal__width--30",*/
                "windowClass": "modal__sixty-- z-index-nine",
                "controller": "UsMainNmiPaymentCtrl",
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                if (resp != undefined) {

                    //$scope.PaymentsObj = $scope.PaymentsObj || {};
                    //$scope.PaymentsObj.PatientDepositPaymodeList = $scope.PaymentsObj.PatientDepositPaymodeList || [];
                    //$scope.selectedDeposits = $scope.selectedDeposits || [];

                    //if (resp && resp.PatientDepositPaymodeList && resp.PatientDepositPaymodeList.length > 0) {
                    //    var remainingBalance = $scope.mainPosObject.PatientBalanceAmount;
                    //    angular.forEach(resp.PatientDepositPaymodeList, function (depositItem) {
                    //        if ($scope.selectedDeposits.includes(depositItem.PatientDepositId)) {
                    //            alertify.error("Deposit " + (depositItem.DepositNumber || "") + " is already selected!");
                    //            return;
                    //        }
                    //        let availableAmount = depositItem.DepositAmount || 0;
                    //        if (availableAmount <= 0 || remainingBalance <= 0) {
                    //            return;
                    //        }
                    //        let usedAmount = Math.min(remainingBalance, availableAmount);
                    //        var sourceDeposit = angular.copy(depositItem);
                    //        sourceDeposit.PaymentId = 0;
                    //        sourceDeposit.PaymentMethodId = 14;
                    //        sourceDeposit.PaymentMethodName = "Patient Deposits";
                    //        sourceDeposit.DepositAmount = usedAmount;

                    //        $scope.PaymentsObj.PatientDepositPaymodeList.push(sourceDeposit);
                    //        $scope.selectedDeposits.push(depositItem.PatientDepositId);
                    //        $scope.PaymentsObj.PaymentAmount = ($scope.PaymentsObj.PaymentAmount || 0) + usedAmount
                    //        remainingBalance -= usedAmount;
                    //    });
                    //    $scope.mainPosObject.PatientBalanceAmount = remainingBalance;
                    //    //$scope.PaymentsObj.PatientDepositId = resp.PatientDepositPaymodeList[0].PatientDepositId;
                    //}

                    if (resp && resp.IsPosPrint === true) {
                        $scope.POSPrintList(resp);

                    }
                    if (resp != undefined) {
                        $scope.GetOrganizationPOSInvoices(resp);
                    }
                    $uibModalInstance.close();

                }
            }, function (cancel) {
            });
        };
        $scope.navtoCollectPaymentnew = function () {
            console.log($scope.PatientSearchObj);
            if ($scope.mainPosObject.BuyerName == "" || $scope.mainPosObject.BuyerName == null || $scope.mainPosObject.BuyerName == undefined) {
                alertify.error("Please enter the buyer name.");
                return false;
            }
            if ($scope.mainPosObject.SoldByUserId == "" || $scope.mainPosObject.SoldByUserId == null || $scope.mainPosObject.SoldByUserId == undefined) {
                alertify.error("Please Select a 'Sold By' user ");
                return false;
            }
            if ($scope.mainPosObject.RenderingProviderId == "" || $scope.mainPosObject.RenderingProviderId == null || $scope.mainPosObject.RenderingProviderId == undefined) {
                alertify.error("Please select a provider");
                return false;
            }
            if ($scope.mainPosObject.InvoiceItems.length == 0) {
                alertify.error("Please Select a POS item  ");
                return false;
            }
            $scope.mainPosObject.TotalBalanceAmount = $scope.mainPosObject.PatientDueAmount;
            $scope.mainPosObject.PatientBalanceAmount = $scope.mainPosObject.PatientBalanceAmount;

            var depositAmt = parseFloat($scope.mainPosObject.PayableAmount) || 0;
            if (depositAmt === 0) {
                alertify.error("Please Enter the Payable Amount");
                return;
            }
            $scope.mainPosObject.BillingProviderId = $scope.mainPosObject.BillingProviderId || 0;
            if ($scope.mainPosObject.BillingProviderId == 0) {
                alertify.error("Please select Billing Provider");
                return false;
            };
            var Parentobj = {
                "PatientId": $scope.PatientSearchObj.PatientId,
                "PatientFirstName": $scope.PatientSearchObj.FirstName,
                "PatientLastName": $scope.PatientSearchObj.LastName,
                "PatientDisplayId": $scope.PatientSearchObj.PatientMRNo,
                "PatientEmailId": $scope.PatientSearchObj.EmailId,
                "PatientGender": $scope.PatientSearchObj.Gender,
                "PatientAgeInYears": $scope.PatientSearchObj.AgeInYears,
                "PatientAgeInMonths": $scope.PatientSearchObj.AgeInMonths,
                "PatientDOB": $scope.PatientSearchObj.DOB,
                "PatientMobile": $scope.PatientSearchObj.MobileNo,
                "Patientaddress1": $scope.PatientSearchObj.Patientaddress1,
                "Patientaddress2": $scope.PatientSearchObj.Patientaddress2,
                "Patientcity": $scope.PatientSearchObj.Patientcity,
                "Patientstate": $scope.PatientSearchObj.Patientstate,
                "Patientzip": $scope.PatientSearchObj.Patientzip,
                "S3URL": $scope.PatientSearchObj.S3URL,
                "UserId": $scope.mainPosObject.UserId,
                "HospitalId": $scope.mainPosObject.OrganizationId,
                "PaymentAmount": $scope.mainPosObject.PayableAmount, /*$scope.mainPosObject.PatientBalanceAmount,*/// $scope.mainPosObject.PaymentAmount,// $scope.mainPosObject.TotalBalanceAmount,
                "DepositDate": $scope.mainPosObject.InvoiceDate,
                "InvoiceDate": $scope.mainPosObject.InvoiceDate,
                "PaymentModeId": $scope.mainPosObject.PaymentModeId || 0,
                "PaymentMode": $scope.mainPosObject.PaymentMode || "",
                "PaymentTypeId": 3,
                "PaymentType": "PointOfSale",
                "ScreenType": "AddPOS",
                "mainPosObject": $scope.mainPosObject,
                "AllCardTypes": $scope.AllCardTypes,
                "BillingProviderId": $scope.mainPosObject.BillingProviderId,
                "BillingProviderName": $scope.mainPosObject.BillingProviderName,
                "RenderingProviderId": $scope.mainPosObject.RenderingProviderId,
                "RenderingProviderName": $scope.mainPosObject.RenderingProviderName,
                "Notes": $scope.POSRemarks || '',
                "EditOverAllBool": $scope.EditOverAllBool || false,
                "mainBillerDataObj": $scope.mainBillerDataObj || {},
                "BuyerName": $scope.mainPosObject.BuyerName,
                "LocationName": $scope.mainPosObject.LocationName,
                "PatientDepositId": $scope.PatientDepositID,
                "PatientPaymentObj": $scope.PaymentsObj,
                "IsPaymentMode": false,
                "IsShowPaymentAmount": true,
                "RenderingProviderObj": $scope.RenderingProviderObj || [],
            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/UsPaymentCollection.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "resolve": {
                    "Parentobj": function () { return Parentobj; }
                },
                "windowClass": "right-to-left-modal offcanves-right modal__width--30",
                "controller": "UsMainNmiPaymentCtrl",
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                if (resp != undefined) {
                    if (resp && resp.IsPosPrint === true) {
                        $scope.POSPrintList(resp);
                    }
                    if (resp != undefined) {
                        $scope.GetOrganizationPOSInvoices(resp);
                    }
                    $uibModalInstance.close();
                }
            }, function (cancel) {
            });
        };
        $scope.ChangeDiscountAmount = function (item) {
            let inputValue = item.DiscountAmount.toString();

            inputValue = inputValue.replace(/[^0-9.]/g, '');

            if (inputValue.length > 1 && inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
                inputValue = inputValue.slice(1);
            }

            if (inputValue.startsWith('.')) {
                inputValue = '';
            }

            const decimalParts = inputValue.split('.');

            if (decimalParts.length > 2) {
                inputValue = decimalParts[0] + '.' + decimalParts[1];
            }
            item.DiscountAmount = inputValue;
        }
        //$scope.ChangePaymentModes = function (Id) {

        //    Id = Id || null;
        //    if (Id != null) {
        //        var obj = $filter("filter")($scope.masterPaymentModes, { "DoctorID": Id.PaymentModeId }, true)[0];
        //        $scope.mainPosObject.PaymentModeId = obj.DoctorID;
        //        $scope.mainPosObject.PaymentMode = obj.PaymentModeName;
        //    }
        //}
     
        $scope.onSelectBranchName = function (selectedItem) {
            if (selectedItem) {
                const branchData = $scope.mainBillerDataObj.AllBranchesList.find(item => item.ClinicId === selectedItem.ClinicId);
                if (branchData) {
                    $scope.mainPosObject.LocationName = branchData;
                    $scope.mainPosObject.OrganizationId = ClinicId;
                    $scope.mainPosObject.OrganizationName = ClinicName;

                }
            }
        };

        $scope.OnamountChange = function () {
            let taxableSum = 0;
            let nonTaxableSum = 0;

            angular.forEach($scope.mainPosObject.InvoiceItems, function (titem) {
                if (titem.Selected === true) {
                    taxableSum += titem.TotalChargeAmount || 0;
                } else {
                    nonTaxableSum += titem.TotalChargeAmount || 0;
                }
            });

            $scope.TaxableAmount = taxableSum;
            $scope.NonTaxableAmount = nonTaxableSum;
        };


        $scope.OnChangePaymentMode = function (id,index) {
            $scope.mainPosObject.PaymentType = id;
            var FilterPaymentmode = $filter('filter')($scope.masterPaymentModes, function (Pitem) { return Pitem.PaymentModeId === id; }) || [];
            if (FilterPaymentmode.length != 0) {
                $scope.mainPosObject.PaymentMode = FilterPaymentmode[0].PaymentModeName;            }
            if (id == 14) {

                $scope.id = id;
                $scope.index = index;
                $scope.openDepositsPopup();

            }
        }
        $scope.validatePaymentAmount = function () {
            //const paymentAmount = $scope.mainPosObject.PaymentAmount;
            const paymentAmount = $scope.mainPosObject.PayableAmount;
            const totalNetAmount = $scope.mainPosObject.TotalNetAmount;
            const paymentModeId = $scope.mainPosObject.PaymentModeId;
            const amountDeposit = $scope.AmountDeposit;
            const Balanceamount = $scope.mainPosObject.PatientBalanceAmount;

            if ($scope.mainPosObject.PayableAmount == "") {
                $scope.mainPosObject.PayableAmount = 0;
                $scope.mainPosObject.PatientDueAmount = $scope.mainPosObject.PatientBalanceAmount;
            }


            if ($scope.mainPosObject.PayableAmount != '') {

                let inputValue = $scope.mainPosObject.PayableAmount.toString();

                inputValue = inputValue.replace(/[^0-9.]/g, '');

                if (inputValue.length > 1 && inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
                    inputValue = inputValue.slice(1);
                }

                if (inputValue.startsWith('.')) {
                    inputValue = '';
                }
                const decimalParts = inputValue.split('.');
                if (decimalParts.length > 2) {
                    inputValue = decimalParts[0] + '.' + decimalParts[1];
                }

                $scope.mainPosObject.PayableAmount = inputValue;
            }

            if (paymentModeId ==14) {
                if (paymentAmount > amountDeposit) {
                    alertify.error("Please enter an amount less than or equal to the available deposit.");
                    $scope.mainPosObject.PayableAmount = $scope.mainPosObject.PatientBalanceAmount;
                    return;
                }
                if (paymentAmount > totalNetAmount) {
                    alertify.error("Payment amount exceeds the Patient Balance. Please enter a lesser amount.");
                    $scope.mainPosObject.PayableAmount = $scope.mainPosObject.PatientBalanceAmount || 0;
                    return ;
                }
            } else {
                if (paymentAmount > totalNetAmount) {
                    alertify.error("Payment amount exceeds the Patient Balance. Please enter a lesser amount.");
                    $scope.mainPosObject.PayableAmount = $scope.mainPosObject.PatientBalanceAmount || 0;
                    return;
                }
            }

            $scope.mainPosObject.PatientDueAmount = $scope.mainPosObject.PatientBalanceAmount - parseFloat($scope.mainPosObject.PayableAmount) || 0;
           
         return true;
        };
        $scope.changeBillingProvider = function (id, item) {
            var List1 = $filter("filter")($scope.BillingProvidersList, function (Pitem,) { return Pitem.OrganizationBillingProviderId === id; }) || [];
            if (List1.length != 0) {
                item.BillingProviderName = List1[0].BillingProviderName;
            }
        }
    }]);
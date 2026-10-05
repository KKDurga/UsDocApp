

"use strict";
eHnoteWebApp.controller("UsPOSListCtrl", ["$scope", "$rootScope", "$filter", "alertify", "$q", "$timeout", "$uibModal", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "eHnoteSettingsDataService", "eHnoteInsuranceService", "eHnotePatientDataService", "eHnoteUserDataService", "eHnotePrintService", "eHnotePaymentGatewayService", "datapersistanceFactory",
    function ($scope, $rootScope, $filter, alertify, $q, $timeout, $uibModal, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, eHnoteSettingsDataService, eHnoteInsuranceService, eHnotePatientDataService, eHnoteUserDataService, eHnotePrintService, eHnotePaymentGatewayService, datapersistanceFactory) {






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

        console.log($scope.mainBillerDataObj);

        $scope.HospitalAddressArray = [];
        if ($scope.doctorinfo.doctordata.UserAddress[0] !== undefined) {
            $scope.HospitalAddressArray = $scope.doctorinfo.doctordata.UserAddress[0];
        }

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
                "SelectedHospitalId": 0,
            };
            return obj;

        }


        $scope.refreshPOSInvoices = function () {
            $scope.SearchPosobj = getSearchPosobj();

            $scope.selectedDoctor = 'All Doctors';
            $scope.searchtxtb = "";
            if ($scope.mainBillerDataObj.AllBranchesList.length > 0) {
                $scope.mainBillerDataObj.AllBranchesList[0].IsChecked = true;
                $scope.ChangeApptBranch($scope.mainBillerDataObj.AllBranchesList[0], 1);
            }

            var Frezobj = {
                "FromDate": $filter("date")(new Date($scope.SearchPosobj.FromDate), "MM-dd-yyyy") || '',
                "ToDate": $filter("date")(new Date($scope.SearchPosobj.ToDate), "MM-dd-yyyy") || '',
            };
            eHnoteMasterDataService.addPOSfreezingList(Frezobj);
            $scope.GetOrganizationPOSInvoices();
        }

        $scope.excludeVoided = function (item) {
            return item.PaymentStatusId !== 4 && item.PaymentStatusId !== 5;
        };
        $scope.isCreatedDateValid = function (createdDt) {
            if (!createdDt) return false;

            var createdDate = new Date(createdDt);

            // Strip time from both dates
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            createdDate.setHours(0, 0, 0, 0);

            return createdDate <= today;
        };
        $scope.GetOrganizationPOSInvoices = function (val) {
            $scope.POSInvoicesCount = 0;
            $scope.POSPaymentListCount = 0;
            $scope.POSInvoiceslist = [];

            var Locationids = $scope.mainBillerDataObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0) // Exclude ClinicId === 0
                .map(pitem => pitem.ClinicId)
                .join(",");

            var Frezobj = {
                "FromDate": $filter("date")(new Date($scope.SearchPosobj.FromDate), "MM-dd-yyyy") || '',
                "ToDate": $filter("date")(new Date($scope.SearchPosobj.ToDate), "MM-dd-yyyy") || '',
                "Locationids": Locationids || '',
            };
            eHnoteMasterDataService.addPOSfreezingList(Frezobj);

            let param = {
                /*"OrganizationId": $scope.SearchPosobj.OrganizationId,*/
                "PageSize": $scope.SearchPosobj.PageSize,
                "PageNumber": $scope.SearchPosobj.PageNumber,
                "InvoiceNumber": $scope.SearchPosobj.InvoiceNumber || "",
                "PatientId": $scope.SearchPosobj.PatientId || "",
                "SoldByUserId": $scope.SearchPosobj.SoldByUserId || "",
                "FromDate": $scope.SearchPosobj.FromDate || "",
                "ToDate": $scope.SearchPosobj.ToDate || "",
                "PaymentStatusId": $scope.SearchPosobj.SoldByUserId || "",
                "Locationids": Locationids || '',
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
                        $scope.POSPaymentListCount = $scope.POSInvoicesCount;
                        //$scope.POSPaymentListCount = $scope.POSInvoiceslist.filter(function (item) {
                        //    return item.PaymentStatusId != 4;
                        //}).length;

                    }


                }
            }, function (err) { console.log(err); });

        }

        let posCallCount = 0;
        let posPageCount = 0;

        $scope.ChangePOSList = function (page) {
            $scope.SearchPosobj.PageNumber = page;
            if (posCallCount === 0) {
                posPageCount = page;
                posCallCount++;
                $scope.GetOrganizationPOSInvoices();
                setTimeout(() => {
                    posCallCount = 0;
                }, 200);
            } else {
                $scope.SearchPosobj.PageNumber = posPageCount;
            }
        };

        $scope.init = function () {
            $scope.SearchPosobj = getSearchPosobj();

            $scope.POSInvoiceslist = [];
            $scope.POSInvoicesCount = 0;
            var params = {
                "OrganizationId": $scope.HospitalId || 0,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "HospitalIds": $scope.HospitalIds || '',
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 20
            };

            $q.all([
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                /* eHnoteSettingsDataService.GetOrganizationBillingProviders(params),*/




            ]).then(function (resp) {
                console.log(resp);

                if (resp[0].data.status === "Success") {
                    $scope.AllCardTypes = resp[0].data.Cardtype;


                }
                //if (resp[1].data.Masterrefundreasons.length > 0) {
                //    $scope.Masterrefundreasons = resp[1].data.Masterrefundreasons || [];
                //}





            });
            $scope.selectedPOSfreezingList = eHnoteMasterDataService.getPOSfreezingList();
            if ($scope.selectedPOSfreezingList != '') {
                $scope.SearchPosobj.FromDate = $scope.selectedPOSfreezingList.FromDate || null;
                $scope.SearchPosobj.ToDate = $scope.selectedPOSfreezingList.ToDate || null;
            } else {
                $scope.SearchPosobj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
                $scope.SearchPosobj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
            }
            $scope.GetOrganizationPOSInvoices();

        }

        $scope.init();




        $scope.LoadPatientSearch = function (val) {


            if (val == undefined || val == null || val == "") {
                $scope.AllPatientList = [];
                $scope.SearchPosobj.PatientId = 0;
                $scope.ShowPatientListDrop = false;
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

            let doctorInfo = eHnoteMasterDataService.getUserInfo();
            if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                param['HospitalID'] = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                if ($scope.UserRoleId === 1 || $scope.UserRoleId === 56) {
                    $scope.HospitalArray = [];
                    angular.forEach(doctorInfo.doctordata.UserAddress, function (item) {
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
            }
            var list = [];
            angular.forEach($scope.HospitalArray, function (items) {
                if (items.isChecked) {
                    list.push(items.BranchId);
                }
            });
            param["HospitalIDLst"] = list;
            eHnoteMasterDataService.addPatientSearchInfo(param);
            var object = {
                "UserId": $scope.UserId,
                "HospitalID": $scope.HospitalId,
                "HospitalIDLst": param.HospitalIDLst.toString(),
                "SearchText": $scope.SearchPosobj.SearchText || "",
                "SearchTypeID": $scope.SearchPosobj.SearchTypeId || 0,
            }
            if ($scope.SearchPosobj.SearchTypeId == 1) {
                object.Name = val;
            } else if ($scope.SearchPosobj.SearchTypeId == 2) {
                object.PatientId = val;
            }
            eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError)
        };
        $scope.ShowPatientListDrop = false;
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
                    $scope.patientinitval.S3URL = item.S3URL || "";
                    $scope.patientinitval.FullName = item.FullName;
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
            if ($scope.SearchPosobj.SearchText != "") {
                $scope.ShowPatientListDrop = true;
            }
        }
        function OnGetopPatientSearchError() {
            $scope.count = 0;
            $scope.AllPatientList = [];
            $scope.SearchPosobj.SearchText = "";
        }

        $scope.SelectedPatient = function (patietnitem) {
            $scope.SearchPosobj.PatientId = patietnitem.PatientID;

            $scope.SearchPosobj.SearchText = patietnitem.FullName;
            $scope.AllPatientList = [];
            $scope.ShowPatientListDrop = false;
            $scope.GetOrganizationPOSInvoices();
        };

        $scope.clearPatientSearchData = function () {
            $scope.ShowPatientListDrop = false;
            $scope.SearchPosobj.SearchText = "";
            $scope.SearchPosobj.PatientId = 0;

        };





        $scope.openPoitOfSalePopup = function () {
            let obj = {
                "ScreenType": "AddPos",

            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/pointOfSalePopup.html",
                "controller": "UsPointOfSalePopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "mainObj": function () { return obj || null; },
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
                },
                "windowClass": "modal__popup--1 in",/*modal__popup--1 bottom-to-top-modal*/


                //"resolve": {
                //    "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
                //},
                //"controller": function ($scope, $uibModal, $uibModalInstance) {
                //    $scope.uibclose = function () {
                //        $uibModalInstance.dismiss("cancel");
                //    };
                //}
            });

            mInstanceAdd.result.then(function (resp) {
                $scope.GetOrganizationPOSInvoices();
            }, function () { });
        };



        $scope.EditPoitOfSalePopup = function (item, EditId) {
            let obj = {
                "ScreenType": "EditPos",
                "EditItem": item,
                "PatientId": item.PatientId,
                "EditId": EditId || 0,

            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/pointOfSalePopup.html",
                "controller": "UsPointOfSalePopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "mainObj": function () { return obj || null; },
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
                },
                "windowClass": "modal__popup--1 in",/*modal__popup--1 bottom-to-top-modal*/


                //"resolve": {
                //    "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
                //},
                //"controller": function ($scope, $uibModal, $uibModalInstance) {
                //    $scope.uibclose = function () {
                //        $uibModalInstance.dismiss("cancel");
                //    };
                //}
            });

            mInstanceAdd.result.then(function (resp) {
                $scope.GetOrganizationPOSInvoices();
            }, function () { });
        }

        $scope.DeletePOSInvoices = function (item) {

            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

                var obj = {
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "InvoiceId": item.InvoiceId,
                    "DeleteInd": "Y",
                }

                eHnoteInsuranceService.DeletePOSInvoicesById(obj).then(function (resp) {
                    if (resp.data.status == "Success") {
                        $scope.GetOrganizationPOSInvoices();
                    } else {
                        alertify.error(resp.data.Message);
                    }
                }, function (err) {

                });

                $scope.$apply();
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
                "PatientEmailId": "",
                "CreatedByUserName": "",
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


        $scope.POSPrintList = function (item, type) {
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
            $scope.POSPrintMainObj.PatientEmailId = item.PatientEmailId || "";
            $scope.POSPrintMainObj.PatientDisplayID = item.DisplayID || 0;

            $scope.POSPrintMainObj.FullName = item.FullName || '';
            $scope.POSPrintMainObj.OrganizationName = item.OrganizationName || '';
            $scope.POSPrintMainObj.CreatedByUserName = item.CreatedByUserName || '';
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
            //angular.forEach($scope.POSPrintMainObj.InvoiceItems, function (Mitem) {
            //    $scope.POSPrintMainObj.PosChargeAmount += Mitem.TotalChargeAmount || 0;
            //    $scope.POSPrintMainObj.PosDiscountAmount += Mitem.DiscountAmount || 0;
            //    $scope.POSPrintMainObj.PosPatientPaymentAmt += Mitem.PatientPaymentAmount || 0;
            //    $scope.POSPrintMainObj.PosTotalNetAmount += Mitem.TotalNetAmount || 0;
            //    $scope.POSPrintMainObj.PosTotalPatbalance += Mitem.PatientBalanceAmount || 0;
            //})

            $scope.POSPrintMainObj.PosChargeAmount = item.TotalChargeAmount || 0;
            $scope.POSPrintMainObj.PosDiscountAmount = item.TotalDiscountAmount || 0;
            $scope.POSPrintMainObj.PosTotalNetAmount = item.TotalNetAmount || 0;
            $scope.POSPrintMainObj.PosPatientPaymentAmt = item.PatientPaymentAmount || 0;
            $scope.POSPrintMainObj.PosTotalPatbalance = item.PatientBalanceAmount || 0;


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

            if (type === 'POSMail') {
                $timeout(function () {
                    $scope.GetPatientPOSDetailsEmailNew(type);
                }, 1000);
            } else {
                $timeout(function () {
                    var innerContents = document.getElementById('POS_ReceiptPrint').innerHTML;
                    var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    popupWinindow.document.open();
                    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                    popupWinindow.document.close();
                }, 500);

            }
        }

        $scope.VoidPatientPayment = function (item, ditem, actionType) {

            var templateToUse = (actionType === 'void') ? "VoidReasonPopUp.html" : "CancelReasonPopUp.html";

            var mInstanceAdd = $uibModal.open({
                "templateUrl": templateToUse,
                "size": "md",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": " ",
                "resolve": {
                    "sitem": function () { return item; },
                    "UserId": function () { return $scope.UserId; },
                    "HospitalId": function () { return $scope.HospitalId; },
                    "ditem": function () { return ditem; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, sitem, UserId, HospitalId, ditem) {
                    sitem = sitem || '';
                    ditem = ditem || '';
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    }
                    $scope.mainNMITransactionid = "";
                    if (sitem.PaymentMethods.length === 1) {
                        if (sitem.PaymentMethods[0].NMITransactionId !== 0) {
                            $scope.mainNMITransactionid = sitem.PaymentMethods[0].OnlineTransactionNumber || "";
                        }
                    }
                    $scope.HospitalId = HospitalId;
                    $scope.UserId = UserId;
                    //$scope.getVoidPatientObj = function () {
                    //    var Obj = {
                    //        "VoidRemarks": ''
                    //    }
                    //    return Obj;
                    //}
                    function getPaymentsObj() {
                        var obj = {
                            "PaymentId": 0,
                            "InvoiceId": 0,
                            "PaymentMethodId": 1,
                            "PaymentMethod": "Cash",
                            "PaymentAmount": null,
                            "TransactionTypeId": 1,
                            "TransactionType": "Payment",
                            "DeleteInd": "N",
                            "PatientDepositPaymodeList": []
                        }
                        return obj;
                    };
                    $scope.PaymentsObj = getPaymentsObj();
                    $scope.VoidPatientObj = {
                        "VoidRemarks": '',
                    }

                    $scope.SaveVoidDepositData = function () {
                        $scope.SavePatientVoidPOS(sitem, 'IsFromVoid');
                    }


                    $scope.navtoVoidOnlinePayment = function () {

                        $scope.VoidPatientObj.VoidRemarks = $scope.VoidPatientObj.VoidRemarks || "";
                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }

                        if ($scope.mainNMITransactionid == "") {
                            alertify.error("you cannot perform void, as TransactionId is empty");
                            return false;
                        }

                        $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                        $scope.mainNMITransactionObj.NMITransactionId = 0;
                        $scope.mainNMITransactionObj.UserId = UserId;
                        $scope.mainNMITransactionObj.PatientId = sitem.PatientId;
                        $scope.mainNMITransactionObj.OrganizationId = sitem.OrganizationId;
                        $scope.mainNMITransactionObj.PaymentAmount = ditem.DepositAmount;
                        $scope.mainNMITransactionObj.MerchentId = "";
                        $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
                        $scope.mainNMITransactionObj.CardHolderName = sitem.FullName || "";
                        $scope.mainNMITransactionObj.PatientEmail = sitem.PatientEmailId || "";
                        //sitem.PhoneNumber = sitem.PhoneNumber || null;
                        //if (sitem.PhoneNumber != null) {
                        //    var Number = eHnoteUserDataService.UsMobileFormatChange(sitem.PhoneNumber);
                        //    sitem.PhoneNumber = Number.UsFormatMobileNumber;

                        //}
                        $scope.mainNMITransactionObj.PatientMobile = sitem.PhoneNumber || "";
                        $scope.mainNMITransactionObj.PatientMrNo = sitem.DisplayID || "";
                        $scope.mainNMITransactionObj.OrderId = "";
                        $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
                        $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                        $scope.mainNMITransactionObj.BillPaymentTypeId = ditem.BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = ditem.BillPaymentType || "";
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = (actionType === 'void') ? 4 : 6;
                        $scope.mainNMITransactionObj.TransactionType = (actionType === 'void') ? 'void' : 'cancel',
                            $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = (actionType === 'void') ? 'void' : 'cancel';
                        $scope.mainNMITransactionObj.AppointmentId = sitem.AppointmentId || 0;
                        $scope.mainNMITransactionObj.VisitId = sitem.VisitId || 0;


                        eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
                            var res = resp.data || {};
                            if (res.Status == "Success") {
                                alertify.success("Transaction Voided Successfully.");

                                $scope.SavePatientVoidPOS(sitem, 'IsFromVoid');
                            }
                        });

                    };

                    $scope.SavePatientVoidPOS = function (sitem, type) {
                        type = type || "";
                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }

                        var ConvertedDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
                        var PaymentDate = $filter("usdateFormatter")(item.PaymentDate, "-");

                        let editItem = sitem;


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


                        $scope.PaymentsObj = getPaymentsObj();
                        $scope.PaymentsObj.PaymentAmount = ditem.DepositAmount || 0;
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
                            //TotalNetAmount: editItem.TotalNetAmount || 0,
                            TotalNetAmount: type === "IsFromVoid" ? 0 : editItem.TotalNetAmount || 0,
                            //PatientPaymentAmount: editItem.PatientPaymentAmount || 0,
                            PatientPaymentAmount: type === "IsFromVoid" ? 0 : editItem.PatientPaymentAmount || 0,
                            //PatientBalanceAmount: editItem.PatientBalanceAmount || 0,
                            PatientBalanceAmount: type === "IsFromVoid" ? editItem.TotalNetAmount : editItem.PatientBalanceAmount || 0,
                            WriteOffAmount: editItem.WriteOffAmount || 0,
                            //TotalBalanceAmount: editItem.TotalBalanceAmount || 0,
                            TotalBalanceAmount: type === "IsFromVoid" ? editItem.TotalNetAmount : editItem.PatientBalanceAmount || 0,
                            PaymentStatus: editItem.PaymentStatus || '',
                            ReferenceNumber: editItem.ReferenceNumber || '',
                            PaymentStatusId: editItem.PaymentStatusId,
                            DeleteInd: editItem.DeleteInd || 'N',
                            InvoiceItems: []
                        };
                        //$scope.EditPosMainData.PatientBalanceAmount = editItem.PatientBalanceAmount;
                        //$scope.mainPosObject.PatientBalanceAmount = editItem.PatientBalanceAmount;
                        $scope.PaymentsObj.PatientDepositPaymodeList = editItem.PaymentMethods;

                        let refundAmount = $scope.PaymentsObj.PaymentAmount || 0;

                        for (let i = 0; i < editItem.InvoiceItems.length; i++) {

                            let paidAmount = editItem.InvoiceItems[i].PatientPaymentAmount || 0;

                            if (refundAmount <= 0) {
                                break;
                            }

                            if (refundAmount >= paidAmount) {

                                editItem.InvoiceItems[i].PatientPaymentAmount -= paidAmount;
                                editItem.InvoiceItems[i].PatientBalanceAmount += paidAmount;
                                $scope.TotalPatientPaymentBalance -= paidAmount;
                                refundAmount -= paidAmount;
                            } else {

                                editItem.InvoiceItems[i].PatientPaymentAmount -= refundAmount;
                                editItem.InvoiceItems[i].PatientBalanceAmount += refundAmount;
                                $scope.TotalPatientPaymentBalance -= refundAmount;
                                refundAmount = 0;
                                break;
                            }
                        }

                        angular.forEach(editItem.InvoiceItems, function (item) {

                            let refundedAmount = (item.TotalNetAmount || 0) - item.PatientPaymentAmount;

                            let PosTransaction = [];
                            if (refundedAmount > 0) {
                                let Tranobj = {
                                    "InvoiceItemTransactionId": 0,
                                    "InvoiceItemId": item.InvoiceItemId,
                                    "OrganizationId": $scope.HospitalId,
                                    "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                    "TransactionAmount": -refundedAmount,
                                    "PatientAmount": -refundedAmount,
                                    "PatientDepositId": null,
                                    "AdjustmentReasonId": null,
                                    "AdjustmentReasonCode": null,
                                    "ReferenceNumber": item.ReferenceNumber || "",
                                    "TransactionTypeId": (actionType === 'void') ? 4 : 6,
                                    "TransactionType": (actionType === 'void') ? 'Void' : 'Cancel',
                                    "TransactionSourceId": 10,
                                    "TransactionSource": "POS",
                                    "SettlementStatusId": (actionType === 'void') ? 4 : 6,
                                    "SettlementStatus": (actionType === 'void') ? 'Voided' : 'Cancelled',
                                    "TransactionNotes": "POS Void issued",
                                    "DeleteInd": 'N'
                                };
                                PosTransaction.push(Tranobj);
                            }

                            let subobj = {
                                "InvoiceItemId": item.InvoiceItemId || null,
                                "InvoiceId": item.InvoiceId || null,
                                "ItemMasterId": item.ItemMasterId || null,
                                "ItemMasterName": item.ItemMasterName || "",
                                "OrganizationItemId": item.OrganizationItemId || null,
                                "Quantity": item.Quantity || null,
                                "UnitPrice": item.UnitPrice || null,
                                "TotalChargeAmount": item.TotalChargeAmount || 0,
                                "DiscountValue": item.DiscountValue || null,
                                "DiscountType": item.DiscountType || "",
                                "DiscountAmount": $scope.mainPosObject.OverallDiscountValue == 0 ?
                                    item.DiscountType === "%" ? ((item.DiscountAmount / 100) * item.TotalChargeAmount) : item.DiscountAmount : item.DiscountAmount,
                                "TotalNetAmount": item.TotalNetAmount || 0,
                                "PatientPaymentAmount": item.PatientPaymentAmount || 0,
                                "PatientBalanceAmount": item.PatientBalanceAmount || 0,
                                "WriteOffAmount": item.WriteOffAmount || 0,
                                "BalanceAmount": item.BalanceAmount || 0,
                                "DeleteInd": item.DeleteInd,
                                "Transactions": PosTransaction
                            };

                            $scope.mainPosObject.InvoiceItems.push(subobj);
                        });


                        var tempPayments = [];



                        if ($scope.PaymentsObj.PaymentAmount != 0 || type === "IsFromVoid") {

                            angular.forEach($scope.PaymentsObj.PatientDepositPaymodeList, function (sitem) {

                                let obj = {
                                    //"PaymentId": ditem.PaymentId,
                                    "PaymentId": 0,
                                    "InvoiceId": $scope.mainPosObject.InvoiceId || 0,
                                    "PaymentMethodId": sitem.PaymentMethodId || null,
                                    "PaymentMethod": sitem.PaymentMethodName || "",
                                    //"PaymentAmount": $scope.PaymentsObj.PaymentAmount || 0,
                                    "PaymentAmount": -sitem.PaymentAmount || 0,
                                    "PatientDepositId": sitem.PatientDepositId || null,
                                    "TransactionTypeId": (actionType === 'void') ? 4 : 6,
                                    "TransactionType": (actionType === 'void') ? 'Void' : 'Cancel',
                                    "DeleteInd": "N",
                                    "CardNumber": sitem.CardNumber || '',
                                    "CardType": sitem.CardType || '',
                                    "CardtypeId": sitem.CardTypeId || 0,
                                    "NMITransactionId": sitem.NMITransactionId || "",
                                    "OnlineTransactionNumber": sitem.OnlineTransactionNumber || null,
                                    "PaymentProcessTypeId": sitem.PaymentProcessTypeId || null,
                                    "PaymentProcessType": sitem.PaymentProcessType || null,
                                    "BillPaymentTypeId": sitem.BillPaymentTypeId || null,
                                    "BillPaymentType": sitem.BillPaymentType || null,
                                    "RefundNotes": "",
                                };
                                tempPayments.push(obj);

                            });
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
                            "OverallDiscountValue": $scope.mainPosObject.OverallDiscountValue || null,
                            "OverallDiscountType": $scope.mainPosObject.OverallDiscountType || "",
                            "TotalChargeAmount": $scope.mainPosObject.TotalChargeAmount || "",
                            "TotalDiscountAmount": $scope.mainPosObject.TotalDiscountAmount || null,
                            "TotalNetAmount": $scope.mainPosObject.TotalNetAmount || null,
                            "PatientPaymentAmount": ($scope.mainPosObject.PatientPaymentAmount || 0) - $scope.PaymentsObj.PaymentAmount || 0,
                            "PatientBalanceAmount": ($scope.mainPosObject.PatientBalanceAmount || 0) + $scope.PaymentsObj.PaymentAmount || 0,
                            "WriteOffAmount": $scope.mainPosObject.WriteOffAmount || 0,
                            "TotalBalanceAmount": ($scope.mainPosObject.TotalBalanceAmount || 0) + $scope.PaymentsObj.PaymentAmount || 0,
                            //"PaymentStatus": $scope.mainPosObject.PaymentStatus || 0,
                            //"PaymentStatusId": $scope.mainPosObject.PaymentStatusId || "",
                            "DeleteInd": $scope.mainPosObject.DeleteInd || "N",
                            "InvoiceItems": $scope.mainPosObject.InvoiceItems || [],
                            //"Payments": $scope.PaymentsObj.PatientDepositPaymodeList || [],
                            "Payments": tempPayments || [],
                            "ReferenceNumber": $scope.mainPosObject.ReferenceNumber || '',
                            "PaymentStatus": (actionType === 'void') ? 'Voided' : 'Cancelled',
                            "PaymentStatusId": (actionType === 'void') ? 4 : 5,
                            "Remarks": $scope.VoidPatientObj.VoidRemarks,
                            "PaymentId": ditem.PaymentId,
                            "PaymentTransactionTypeId": (actionType === 'void') ? 4 : 6,
                            "PaymentTransactionType": (actionType === 'void') ? 'Void' : 'Cancel',
                            "CancelReasonId": 0,
                        }
                        eHnoteInsuranceService.AddUpdatePOSSale(param).then(function (resp) {
                            if (resp.data.Status === "Success") {

                                $uibModalInstance.close();

                            }
                        }, function (err) { console.log(err); });
                    }
                }
            });

            mInstanceAdd.result.then(function () {

                $scope.GetOrganizationPOSInvoices();

            }, function () { });
        }
        $scope.ViewVoidPatientPOS = function () {

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "VoidPospopup.html",
                "backdrop": "static",
                "keyboard": false,
                //"size": "lg",
                "windowClass": "modal__ninety-- in",
                "resolve": {
                    "POSDataInvoiceslist": function () { return $scope.POSInvoiceslist; },
                    "HospitalId": function () { return $scope.HospitalId; },
                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, POSDataInvoiceslist, HospitalId) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.HospitalId = HospitalId || 0;
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
                    $scope.GetOrganizationPOSVoidRefundInvoices = function (val) {
                        $scope.SearchPosobj = getSearchPosobj();
                        $scope.RefundList = [];
                        $scope.VoidList = [];

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

                        eHnoteInsuranceService.GetOrganizationPOSVoidRefundInvoices(param).then(function (resp) {
                            if (resp.data.status === "Success") {
                                $scope.RefundList = resp.data.RefundList || [];
                                $scope.VoidList = resp.data.PosVoid || [];



                            }
                        }, function (err) { console.log(err); });

                    }

                    $scope.GetOrganizationPOSVoidRefundInvoices();

                    $scope.activeRemarkIndex = null;
                    $scope.ShowVoidPOSRemarks = function (index) {
                        if ($scope.activeRemarkIndex === index) {
                            $scope.activeRemarkIndex = null;
                        } else {
                            $scope.activeRemarkIndex = index;
                        }
                    };



                }

            });

        }

        $scope.GetTransactionStatus = function (item) {
            var obj = {
                "NMITransactionId": 0,
                "AsyncStatusGuid": "",
                "ResponseMethod": ""

            }
            if (item.PaymentMethods[0].NMITransactionId !== 0) {
                obj.NMITransactionId = item.PaymentMethods[0].NMITransactionId || "";
                obj.AsyncStatusGuid = item.PaymentMethods[0].AsyncStatusGuid || "";
                obj.ResponseMethod = item.PaymentMethods[0].ResponseMethod || "";

            }
            eHnotePaymentGatewayService.NMIAsyncStatus(obj).then(function (resp) {
                var res = resp.data || {};
                if (res.Status == "Success") {

                    $scope.GetOrganizationPOSInvoices();

                }
            })

        }

        $scope.RefundPatientPayment = function (item, ditem) {
            var obj = {
                "AllCardTypes": $scope.AllCardTypes || [],
                "Masterrefundreasons": $scope.mainBillerDataObj.Masterrefundreasons || [],
                "AllUsersList": $scope.AllUsersList || [],
            }
            var mInstanceAdd = $uibModal.open({
                "templateUrl": "RefundDepositpopup.html",
                "size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "z-index-9999999991",
                "resolve": {
                    "sitem": function () { return item; },
                    "UserId": function () { return $scope.UserId; },
                    "HospitalId": function () { return $scope.HospitalId; },
                    "obj": function () { return obj; },
                    "ditem": function () { return ditem; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, sitem, UserId, HospitalId, obj, ditem) {
                    sitem = sitem || '';
                    ditem = ditem || '';
                    $scope.uibclose = function () {
                        $uibModalInstance.close("cancel");
                    }
                    $scope.mainNMITransactionid = "";
                    if (ditem.NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = ditem.OnlineTransactionNumber || "";
                    }
                    $scope.HospitalId = HospitalId;
                    $scope.UserId = UserId;
                    $scope.isMultiPaymentMode = false;

                    $scope.posPaymentMethods = [];
                    if (sitem.PaymentMethods.length > 0) {
                        $scope.posPaymentMethods = sitem.PaymentMethods || [];
                    }

                    if ($scope.posPaymentMethods.length > 1) {
                        $scope.isMultiPaymentMode = true;
                    }





                    var mObj = datapersistanceFactory.getItem("masterDataArrays");
                    $scope.masterPaymentModes = [];
                    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                        $scope.masterPaymentModes = mObj.PaymentModes;
                        $scope.filterPaymentModes = function (item) {
                            return ![13, 14].includes(item.PaymentModeId);
                        };
                        $scope.masterPaymentModes = $filter("filter")($scope.masterPaymentModes, function (item) {
                            return item.PaymentModeId !== 13 && item.PaymentModeId !== 14;
                        }) || [];
                    };
                    var doctorinfo = eHnoteMasterDataService.getUserInfo();
                    $scope.UserId = eHnoteMasterDataService.getLoginId();
                    $scope.ParenthospitalId = 0;
                    $scope.HospitalId = 0;
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                    };
                    $scope.mainobj =angular.copy(sitem);
                    $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                    $scope.AllCardTypes = obj.AllCardTypes || [];
                    $scope.AllUsersList = obj.AllUsersList || [];
                    //$scope.getVoidPatientObj = function () {
                    //    var Obj = {
                    //        "VoidRemarks": ''
                    //    }
                    //    return Obj;
                    //}

                    function getPaymentsObj() {
                        var obj = {
                            "PaymentId": 0,
                            "InvoiceId": 0,
                            "PaymentMethodId": 1,
                            "PaymentMethod": "Cash",
                            "PaymentAmount": null,
                            "TransactionTypeId": 1,
                            "TransactionType": "Payment",
                            "DeleteInd": "N",
                            "PatientDepositPaymodeList": []
                        }
                        return obj;
                    };

                    console.log(ditem);
                    $scope.GetRefundpaymentObj = function () {
                        var obj = {
                            "UserId": $scope.UserId,
                            "RefundByUser": "",
                            "OrganizationId": $scope.HospitalId,
                            "PatientDepositId": ditem.PatientDepositId || null,
                            "RefundDepositId": null,
                            "ReceiptNo": $scope.mainobj.ReceiptNo || "",
                            "ReceiptId": 0,
                            "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "RefundAmount": sitem.PatientPaymentAmount || null,
                            "RefundBy": "",
                            "DeleteInd": "N",
                            "AppointmentId": $scope.mainobj.AppointmentID || null,
                            "PatientId": $scope.mainobj.PatientId || null,
                            "RefundreasonId": null,
                            "Refundreason": null,
                            "Remarks": null,
                            "CardtypeId": null,
                            "RefundPaymentMethodId": null,
                            "RefundPaymentMethod": "",
                            "ReceiptNumber": "",
                            "ReferenceNumber": "",
                            "CardNumber": "",
                            "DepositStatus": "Refund",
                            "DepositStatusId": "3",
                            "Transactions": [],
                            "OnlineTransactionNumber": "",
                            "NMITransactionId": 0

                        }

                        return obj;
                    };

                   
                    $scope.init = function () {

                        $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                        var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
                        }

                        if (!$scope.isMultiPaymentMode) {
                            angular.forEach($scope.posPaymentMethods, function (pitem) {
                                if (pitem.NMITransactionId != 0 && pitem.PaymentMethodId === 2) {
                                    $scope.RefundPaymentObj.PaymentMethodId = pitem.PaymentMethodId;
                                    $scope.RefundPaymentObj.PaymentMethodName = pitem.PaymentMethodName;
                                    $scope.RefundPaymentObj.CardType = pitem.CardType;
                                    $scope.RefundPaymentObj.CardNumber = pitem.CardNumber;
                                    $scope.RefundPaymentObj.OnlineTransactionNumber = pitem.OnlineTransactionNumber;
                                    $scope.RefundPaymentObj.NMITransactionId = pitem.NMITransactionId;
                                }
                            });



                        }
                    }
                    $scope.init();
                    $scope.changeRefund = function (id) {
                        var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.Refundreason = filtredArray[0].Refundreason || "";
                        }
                    }
                    $scope.ChangePaymentMode = function (id) {
                        var filtredArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": id }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.RefundPaymentMethod = filtredArray[0].PaymentModeName || "";
                        };

                        $scope.RefundPaymentObj.CardType = "";
                        $scope.RefundPaymentObj.CardNumber = "";
                        $scope.RefundPaymentObj.OnlineTransactionNumber = "";
                        $scope.RefundPaymentObj.NMITransactionId = 0;
                        if (id===2) {
                            angular.forEach($scope.posPaymentMethods, function (pitem) {
                                if (pitem.PaymentMethodId === 2) {

                                    console.log(pitem);
                                    $scope.RefundPaymentObj.CardType = pitem.CardType;
                                    $scope.RefundPaymentObj.CardtypeId = pitem.CardtypeId;
                                    $scope.RefundPaymentObj.CardNumber = pitem.CardNumber;
                                    $scope.RefundPaymentObj.OnlineTransactionNumber = pitem.OnlineTransactionNumber;
                                    $scope.RefundPaymentObj.NMITransactionId = pitem.NMITransactionId;
                                }
                            });
                        }
                    }
                    $scope.PaymentsObj = getPaymentsObj();

                    function getRefundStatus(originalPaymentAmount, refundAmount) {

                        if (refundAmount > 0 && refundAmount < originalPaymentAmount) return "Partially Refund";
                        if (refundAmount === originalPaymentAmount) return "Refund";
                        return "Refund";
                    }

                    $scope.changeRefundAmount = function (refunditem) {
                        var ramount = parseFloat(refunditem.RefundAmount) || 0;
                        var paymentamt = parseFloat($scope.mainobj.PatientPaymentAmount) || 0;
                        if (ramount > paymentamt) {
                            alertify.error("Please enter less than the payment amount");
                            $scope.RefundPaymentObj.RefundAmount = "";
                        }
                    }

                    $scope.navtoNMIPatientRefund = function () {
                        $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                        $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                        if ($scope.RefundPaymentObj.RefundAmount == null) {
                            alertify.error("Please Enter Refund Amount");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundreasonId == null) {
                            alertify.error("Please Select Refund Reason");
                            return;
                        }

                        if ($scope.mainNMITransactionid == "") {
                            alertify.error("you cannot perform void, as TransactionId is empty");
                            return false;
                        }

                        $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                        $scope.mainNMITransactionObj.NMITransactionId = 0;
                        $scope.mainNMITransactionObj.UserId = $scope.UserId;
                        $scope.mainNMITransactionObj.PatientId = $scope.mainobj.PatientId;
                        $scope.mainNMITransactionObj.OrganizationId = $scope.mainobj.OrganizationId;
                        $scope.mainNMITransactionObj.PaymentAmount = $scope.RefundPaymentObj.RefundAmount;
                        $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                        $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                        $scope.mainNMITransactionObj.CardHolderName = $scope.mainobj.PatientFullName || "";
                        $scope.mainNMITransactionObj.PatientEmail = $scope.mainobj.PatientEmailId || "";
                        $scope.mainNMITransactionObj.PatientMobile = $scope.mainobj.PatientMobile || "";

                        if ($scope.mainNMITransactionObj.PatientMobile != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                            $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                        }

                        $scope.mainNMITransactionObj.PatientMrNo = $scope.mainobj.PatientDisplayId || "";
                        $scope.mainNMITransactionObj.OrderId = "";
                        $scope.mainNMITransactionObj.OrderDescription = $scope.RefundPaymentObj.Refundreason || "";
                        $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                        $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PaymentMethods[0].BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PaymentMethods[0].BillPaymentType || "";
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = 5;
                        $scope.mainNMITransactionObj.TransactionType = "refund";
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = "refund";
                        $scope.mainNMITransactionObj.AppointmentId = $scope.mainobj.AppointmentId || 0;
                        $scope.mainNMITransactionObj.VisitId = $scope.mainobj.VisitId || 0;


                        eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                            var res = resp.data || {};
                            console.log(res)
                            if (res.Status == "Success") {
                                alertify.success(res.Status);

                                $scope.SavePatientRefundPOS();
                            }
                        })

                    };

                    $scope.SavePatientRefundPOS = function () {

                        $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                        $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                        $scope.RefundPaymentObj.RefundPaymentMethodId = $scope.RefundPaymentObj.RefundPaymentMethodId || null;

                        if ($scope.RefundPaymentObj.RefundPaymentMethodId == null) {
                            alertify.error("Please Select Payment Method to Refund");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount == null) {
                            alertify.error("Please Enter Refund Amount");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundreasonId == null) {
                            alertify.error("Please Select Refund Reason");
                            return;
                        }

                        let editItem = $scope.mainobj;


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
                            WriteOffAmount: editItem.WriteOffAmount || 0,
                            TotalBalanceAmount: editItem.TotalBalanceAmount || 0,
                            PaymentStatus: editItem.PaymentStatus || '',
                            ReferenceNumber: editItem.ReferenceNumber || '',
                            PaymentStatusId: editItem.PaymentStatusId,
                            DeleteInd: editItem.DeleteInd || 'N',
                            InvoiceItems: []
                        };

                        $scope.PaymentsObj.PatientDepositPaymodeList = editItem.PaymentMethods;
                        $scope.TotalPatientPaymentBalance = 0;
                        let refundAmount = $scope.RefundPaymentObj.RefundAmount;

                        for (let i = 0; i < editItem.InvoiceItems.length; i++) {

                            let paidAmount = editItem.InvoiceItems[i].PatientPaymentAmount;

                            if (refundAmount <= 0) {
                                break;
                            }

                            if (refundAmount >= paidAmount) {

                                editItem.InvoiceItems[i].PatientPaymentAmount -= paidAmount;
                                editItem.InvoiceItems[i].PatientBalanceAmount += paidAmount;
                                $scope.TotalPatientPaymentBalance -= paidAmount;
                                refundAmount -= paidAmount;
                            } else {

                                editItem.InvoiceItems[i].PatientPaymentAmount -= refundAmount;
                                editItem.InvoiceItems[i].PatientBalanceAmount += refundAmount;
                                $scope.TotalPatientPaymentBalance -= refundAmount;
                                refundAmount = 0;
                                break;
                            }
                        }

                        angular.forEach(editItem.InvoiceItems, function (item) {

                            let refundedAmount = (item.TotalNetAmount || 0) - item.PatientPaymentAmount;

                            let PosTransaction = [];
                            if (refundedAmount > 0) {
                                let Tranobj = {
                                    "InvoiceItemTransactionId": 0,
                                    "InvoiceItemId": item.InvoiceItemId,
                                    "OrganizationId": $scope.HospitalId,
                                    "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                    "TransactionAmount": -refundedAmount,
                                    "PatientAmount": -refundedAmount,
                                    "PatientDepositId": null,
                                    "AdjustmentReasonId": null,
                                    "AdjustmentReasonCode": null,
                                    "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                                    "TransactionTypeId": 3,
                                    "TransactionType": "Refund",
                                    "TransactionSourceId": 10,
                                    "TransactionSource": "POS",
                                    "SettlementStatusId": 4,
                                    "SettlementStatus": "Refunded",
                                    "TransactionNotes": "POS refund issued",
                                    "DeleteInd": 'N'
                                };
                                PosTransaction.push(Tranobj);
                            }

                            let subobj = {
                                "InvoiceItemId": item.InvoiceItemId || null,
                                "InvoiceId": item.InvoiceId || null,
                                "ItemMasterId": item.ItemMasterId || null,
                                "ItemMasterName": item.ItemMaster || "",
                                "OrganizationItemId": item.OrganizationItemId || null,
                                "Quantity": item.Quantity || null,
                                "UnitPrice": item.UnitPrice || null,
                                "TotalChargeAmount": item.TotalChargeAmount || 0,
                                "DiscountValue": item.DiscountValue || null,
                                "DiscountType": item.DiscountType || "",
                                "DiscountAmount": $scope.mainPosObject.OverallDiscountValue == 0 ?
                                    item.DiscountType === "%" ? ((item.DiscountAmount / 100) * item.TotalChargeAmount) : item.DiscountAmount : item.DiscountAmount,
                                "TotalNetAmount": item.TotalNetAmount || 0,
                                "PatientPaymentAmount": item.PatientPaymentAmount || 0,
                                "PatientBalanceAmount": item.PatientBalanceAmount || 0,
                                "WriteOffAmount": item.WriteOffAmount || 0,
                                "BalanceAmount": item.BalanceAmount || 0,
                                "DeleteInd": item.DeleteInd,
                                "Transactions": PosTransaction
                            };

                            $scope.mainPosObject.InvoiceItems.push(subobj);
                        });


                        var tempPayments = [];



                        if ($scope.RefundPaymentObj.RefundAmount != null) {

                            //angular.forEach($scope.PaymentsObj.PatientDepositPaymodeList, function (sitem) {

                            //    let obj = {
                            //        "PaymentId": 0,
                            //        "InvoiceId": $scope.mainPosObject.InvoiceId || 0,
                            //        "PaymentMethodId": sitem.PaymentMethodId || null,
                            //        "PaymentMethod": sitem.PaymentMethodName || "",
                            //        "PaymentAmount": $scope.RefundPaymentObj.RefundAmount || null,
                            //        "PatientDepositId": sitem.PatientDepositId || null,
                            //        "TransactionTypeId": 3,
                            //        "TransactionType": "Refund",
                            //        "DeleteInd": "N",
                            //        "CardNumber": sitem.CardNumber || '',
                            //        "CardType": sitem.CardType || '',
                            //        "CardtypeId": sitem.CardTypeId || 0,
                            //        "NMITransactionId": sitem.NMITransactionId || "",
                            //        "OnlineTransactionNumber": sitem.OnlineTransactionNumber || null,
                            //        "PaymentProcessTypeId": sitem.PaymentProcessTypeId || null,
                            //        "PaymentProcessType": sitem.PaymentProcessType || null,
                            //        "BillPaymentTypeId": sitem.BillPaymentTypeId || null,
                            //        "BillPaymentType": sitem.BillPaymentType || null,
                            //        "RefundNotes": $scope.RefundPaymentObj.RefundNotes || "",
                            //    };
                            //    tempPayments.push(obj);

                            //});
                            let obj = {
                                "PaymentId": 0,
                                "InvoiceId": $scope.mainPosObject.InvoiceId || 0,
                                "PaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || null,
                                "PaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
                                "PaymentAmount": -($scope.RefundPaymentObj.RefundAmount) || null,
                                "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,
                                "TransactionTypeId": 3,
                                "TransactionType": "Refund",
                                "DeleteInd": "N",
                                "CardNumber": $scope.RefundPaymentObj.CardNumber || '',
                                "CardType": $scope.RefundPaymentObj.CardType || '',
                                "CardtypeId": $scope.RefundPaymentObj.CardTypeId || 0,
                                "NMITransactionId": $scope.RefundPaymentObj.NMITransactionId || "",
                                "OnlineTransactionNumber": $scope.RefundPaymentObj.OnlineTransactionNumber || null,
                                "PaymentProcessTypeId": $scope.RefundPaymentObj.PaymentProcessTypeId || null,
                                "PaymentProcessType": $scope.RefundPaymentObj.PaymentProcessType || null,
                                "BillPaymentTypeId": $scope.RefundPaymentObj.BillPaymentTypeId || null,
                                "BillPaymentType": $scope.RefundPaymentObj.BillPaymentType || null,
                                "RefundNotes": $scope.RefundPaymentObj.RefundNotes || "",
                            };
                            tempPayments.push(obj);
                        }




                        let param = {
                            "UserId": $scope.UserId,
                            "InvoiceId": $scope.mainPosObject.InvoiceId,
                            "PatientId": $scope.mainPosObject.PatientId,
                            "PatientName": $scope.mainPosObject.PatientName,
                            "OrganizationId": $scope.HospitalId,
                            "PatientPaymentAmount": ($scope.mainPosObject.PatientPaymentAmount || 0) - $scope.RefundPaymentObj.RefundAmount,
                            "PatientBalanceAmount": ($scope.mainPosObject.PatientBalanceAmount || 0) + $scope.RefundPaymentObj.RefundAmount,
                            "WriteOffAmount": $scope.mainPosObject.WriteOffAmount || 0,
                            "TotalBalanceAmount": ($scope.mainPosObject.TotalBalanceAmount || 0) + $scope.RefundPaymentObj.RefundAmount,
                            "DeleteInd": $scope.mainPosObject.DeleteInd || "N",
                            "InvoiceItems": $scope.mainPosObject.InvoiceItems || [],
                            "Payments": tempPayments || [],
                            "PaymentStatus": "Refund",
                            "PaymentStatusId": 5,
                            "POSRefundId": null,
                            "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
                            "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
                            "RefundByUserId": $scope.UserId,
                            "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                            "AppointmentId": $scope.RefundPaymentObj.AppointmentID || null,
                            "RefundreasonId": $scope.RefundPaymentObj.RefundreasonId || null,
                            "RefundReason": $scope.RefundPaymentObj.Refundreason || "",
                            "Remarks": $scope.RefundPaymentObj.Remarks || "",
                            "CardtypeId": $scope.RefundPaymentObj.CardtypeId || "",
                            "RefundPaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || "",
                            "RefundPaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
                            "RefundStatus": "Initiated",
                            "RefundStatusId": "1",
                            "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                            "CardNumber": $scope.RefundPaymentObj.CardNumber || "",
                            "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,

                        };
                        let originalPaymentAmount = $scope.mainPosObject.PatientPaymentAmount || 0;
                        let refundedAmount = $scope.RefundPaymentObj.RefundAmount || 0;

                        console.log(originalPaymentAmount + "__" + refundedAmount);

                        let paymentStatusText = getRefundStatus(originalPaymentAmount, refundedAmount);

                       

                        

                        let paymentStatusIdMap = {
                            "Partially Refund": 6,
                            "Refund": 5
                        };

                        param.PaymentStatus = paymentStatusText;
                        param.PaymentStatusId = paymentStatusIdMap[paymentStatusText];
                        param.PaymentId = ditem.PaymentId;

                        console.log(param);
                        //return false;
                        eHnoteInsuranceService.AddUpdatePOSRefundSale(param).then(function (resp) {
                            if (resp.data.Status === "Success") {

                                $uibModalInstance.close();

                            }
                        }, function (err) { console.log(err); });
                    }

                    $scope.SaveRefundDepositData = function () {
                        $scope.SavePatientRefundPOS(sitem);
                    }
                }
            });

            mInstanceAdd.result.then(function () {

                $scope.GetOrganizationPOSInvoices();

            }, function () { });
        }
        $scope.POSSubtab = 1;
        $scope.SwitchPOSSubtabs = function (subtabChange) {
            $scope.POSSubtab = subtabChange;
        }
        $scope.AddAnotherPaymentMode = function (item, id) {
            function getPaymentsObj() {
                var obj = {
                    "PaymentId": 0,
                    "InvoiceId": 0,
                    "PaymentMethodId": 1,
                    "PaymentMethod": "Cash",
                    "PaymentAmount": null,
                    "TransactionTypeId": 1,
                    "TransactionType": "Payment",
                    "DeleteInd": "N",
                    "PatientDepositPaymodeList": []
                }
                return obj;
            };
            $scope.PaymentsObj = getPaymentsObj();

            let editItem = item;


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
                WriteOffAmount: editItem.WriteOffAmount || 0,
                TotalBalanceAmount: editItem.TotalBalanceAmount || 0,
                PaymentStatus: editItem.PaymentStatus || '',
                ReferenceNumber: editItem.ReferenceNumber || '',
                PaymentStatusId: editItem.PaymentStatusId,
                DeleteInd: editItem.DeleteInd || 'N',
                InvoiceItems: []
            };

            $scope.mainPosObject.PatientBalanceAmount = editItem.PatientBalanceAmount;
            $scope.PaymentsObj.PatientDepositPaymodeList = editItem.PaymentMethods;

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
                        "TransactionTypeId": 2,
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
                "PaymentAmount": $scope.mainPosObject.PatientBalanceAmount,
                "DepositDate": "",
                "InvoiceDate": $scope.mainPosObject.InvoiceDate,
                "PaymentModeId": 1,
                "PaymentMode": "Cash",
                "PaymentTypeId": 3,
                "PaymentType": "PointOfSale",
                "ScreenType": "AddPOS",
                "mainPosObject": $scope.mainPosObject,
                "AllCardTypes": $scope.AllCardTypes,
                "BillingProviderId": $scope.mainPosObject.BillingProviderId,
                "BillingProviderName": $scope.mainPosObject.BillingProviderName,
                "mainBillerDataObj": $scope.mainBillerDataObj || {},
                "IsPaymentMode": false,
                "IsShowPaymentAmount": false,
                "BillingProvidersList": $scope.mainBillerDataObj.BillingProviderList || [],
                "RenderingProviderObj": {},
                "DepositscreenTypeId": id,
            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/collectPayment.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "resolve": {
                    "Parentobj": function () { return Parentobj; }
                },
                "windowClass": "modal__sixty-- z-index-nine",
                "controller": "UsMainNmiPaymentCtrl",
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                $scope.GetOrganizationPOSInvoices();
                //$uibModalInstance.close();
            }, function (cancel) {
                $scope.GetOrganizationPOSInvoices();
            });


        }

        $scope.isToday = function (transactionDateStr) {
            var today = new Date();
            var todayStr = today.toISOString().slice(0, 10);
            return transactionDateStr === todayStr;
        };

        $scope.Showtransprodlist = function (item) {
            angular.forEach($scope.POSInvoiceslist, function (sitem) {
                if (sitem !== item) {
                    sitem.Isshow = false;
                }
            });
            item.Isshow = !item.Isshow;
            if (item.Isshow) {
                $scope.POSSubtab = 1;
            }
        };


        $scope.ViewRefundPatientPOS = function () {

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "RefundPospopup.html",
                "backdrop": "static",
                "keyboard": false,
                //"size": "lg",
                "windowClass": "  modal__ninety-- in",
                "resolve": {
                    "POSDataInvoiceslist": function () { return $scope.POSInvoiceslist; },
                    "HospitalId": function () { return $scope.HospitalId; },
                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, POSDataInvoiceslist, HospitalId) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.HospitalId = HospitalId || 0;
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


                    $scope.GetOrganizationPOSVoidRefundInvoices = function (val) {
                        $scope.SearchPosobj = getSearchPosobj();
                        $scope.RefundList = [];
                        $scope.VoidList = [];

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

                        eHnoteInsuranceService.GetOrganizationPOSVoidRefundInvoices(param).then(function (resp) {
                            if (resp.data.status === "Success") {
                                $scope.RefundList = resp.data.RefundList || [];
                                $scope.VoidList = resp.data.PosVoid || [];



                            }
                        }, function (err) { console.log(err); });

                    }

                    $scope.GetOrganizationPOSVoidRefundInvoices();
                }

            });

        }

        $scope.isToday = function (InvoiceDate) {
            var invoiceDateStr = $filter('date')(InvoiceDate, "MM-dd-yyyy");
            var todayStr = $filter('date')(new Date(), "MM-dd-yyyy");
            return invoiceDateStr === todayStr;
        };

        $scope.isCancelToday = function (posDate) {
            var invoiceDateStr = $filter('date')(posDate, "MM-dd-yyyy");
            var todayStr = $filter('date')(new Date(), "MM-dd-yyyy");
            return invoiceDateStr != todayStr;
        };

        $scope.GetPatientLedgerDetailsEmailNew = function (type) {

            if (!$scope.POSPrintMainObj.PatientEmailId) {
                alertify.error("There is no email for this patient");
                return false;
            }

            var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.ContactNo);
            $scope.HospitalAddressArray.ContactNo = obj1.UsFormatMobileNumber;

            var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.MobileNo);
            $scope.HospitalAddressArray.MobileNo = obj2.UsFormatMobileNumber;
            const branchAddress = ($scope.HospitalAddressArray.Address1 || "") + ", " + ($scope.HospitalAddressArray.Address2 || "") + ", " + ($scope.HospitalAddressArray.CityName || "") + ", " + ($scope.HospitalAddressArray.StateName || "") + ", " + ($scope.HospitalAddressArray.CountryName || "") + ", " + ($scope.HospitalAddressArray.PinCode || "");

            const obj = {
                "htmlContent": $scope.htmlContent,
                "PatientId": $scope.POSPrintMainObj.PatientId,
                "OrganizationId": $scope.HospitalId,
                "PatientEmail": $scope.POSPrintMainObj.PatientEmailId || "",
                "ClinicName": $scope.POSPrintMainObj.OrganizationName || "",
                "DoctorName": $scope.POSPrintMainObj.CreatedByUserName || "",
                "BranchAddress": branchAddress || "",
                "PatientFullName": $scope.POSPrintMainObj.FullName || "",
                "BranchContactNo": $scope.HospitalAddressArray.ContactNo || "",
                "BranchMobileNo": $scope.HospitalAddressArray.MobileNo || "",
                "IsFrom": type || "",
                "HospitalAddressArray": $scope.HospitalAddressArray || {},
                "UserId": $scope.UserId,
                "EmailCommunicationProviderId": doctorinfo.doctordata.UserAddress[0].EmailCommunicationProviderId || 0,
                "EmailCommunicationEnabled": doctorinfo.doctordata.UserAddress[0].EmailCommunicationEnabled || false,
                'POSId': $scope.POSPrintMainObj.InvoiceId || 0
            };

            eHnoteInsuranceService.GenerateLedgerUrl(obj).then(resp => {
                if (resp.data === "Success") {
                    alertify.success("Email Sent Successfully");
                }
            });
        };

        $scope.LocationTypeObj = {
            "SelectLocationString": "All Locations",
            "Name": "",
            "AllLocationCheck": true
        };

        $scope.stopClosingDropDown = function ($event) {
            $event.stopPropagation();
        };

        $scope.ChangeApptBranch = function (item, typeId) {

            $scope.SearchPosobj.SelectedHospitalId = item.ClinicId || 0;
            $scope.AppListselectedclinic = item || {};

            if (item.IsChecked) {
                if (item.ClinicId === 0) {
                    angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (mitem) {
                        mitem.IsChecked = true;
                    });
                }
            } else {
                if (item.ClinicId === 0) {
                    angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (mitem) {
                        mitem.IsChecked = false;
                    });
                }
            }


            var Locationids = '';
            Locationids = $scope.mainBillerDataObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            var nonZeroChecked = $scope.mainBillerDataObj.AllBranchesList
                .filter(branch => branch.ClinicId !== 0)
                .every(branch => branch.IsChecked === true);

            var clinicZeroItem = $scope.mainBillerDataObj.AllBranchesList.find(branch => branch.ClinicId === 0);
            if (clinicZeroItem) {
                clinicZeroItem.IsChecked = nonZeroChecked;
            }

            var checkedArray = _.where($scope.mainBillerDataObj.AllBranchesList, { IsChecked: true });
            var checkedCount = checkedArray.length;
            var totalBranches = $scope.mainBillerDataObj.AllBranchesList.length;

            if (checkedCount === totalBranches) {
                $scope.LocationTypeObj.SelectLocationString = "All Locations";
            } else if (checkedCount > 0) {
                $scope.LocationTypeObj.SelectLocationString = "Selected";
            } else {
                $scope.LocationTypeObj.SelectLocationString = "Select";
            }

            if (checkedCount == 1) {
                var filterlist = $filter("filter")($scope.mainBillerDataObj.AllBranchesList, function (item) {
                    return item.ClinicId == checkedArray[0].ClinicId;
                }) || [];
                if (filterlist.length > 0) {
                    $scope.LocationTypeObj.SelectLocationString = filterlist[0].ClinicName || "Select";
                }
            }

        }

        $scope.GetPatientPOSDetailsEmailNew = function (type) {

            $scope.htmlContent = document.getElementById('POS_ReceiptPrint').innerHTML;
            $scope.GetPatientLedgerDetailsEmailNew(type);
        };

    }]);
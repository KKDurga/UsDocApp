
"use strict";
eHnoteWebApp.controller("UsPaymentListCtrl", ["$scope", "$rootScope", "$filter", "alertify", "$q", "$timeout", "$uibModal", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "eHnoteSettingsDataService", "eHnoteInsuranceService", "eHnotePatientDataService", "datapersistanceFactory", "eHnoteUserDataService", "eHnotePrintService",
    function ($scope, $rootScope, $filter, alertify, $q, $timeout, $uibModal, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, eHnoteSettingsDataService, eHnoteInsuranceService, eHnotePatientDataService, datapersistanceFactory, eHnoteUserDataService, eHnotePrintService) {

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

        $scope.HospitalAddressArray = [];
        if ($scope.doctorinfo.doctordata.UserAddress[0] !== undefined) {
            $scope.HospitalAddressArray = $scope.doctorinfo.doctordata.UserAddress[0];
        }
        console.log($scope.mainBillerDataObj);
        $scope.AllHospitalData = [];
        $scope.AllHospitalData = $scope.mainBillerDataObj;
        $scope.BillingProviderList = [];
        $scope.BillingProviderList = $scope.mainBillerDataObj.BillingProviderList || [];


        if ($scope.mainBillerDataObj.AllDoctorsList.length == 0) {

            $scope.allUserList = $scope.mainBillerDataObj.AllUsersList;


            if ($scope.allUserList.length !== 0) {

                $scope.AllDoctorsList = angular.copy($scope.allUserList);
            }

            $scope.AllDoctorsList = _.uniq($scope.AllDoctorsList, false, function (p) { return p.DoctorID; });
            $scope.mainBillerDataObj.AllDoctorsList = angular.copy($scope.AllDoctorsList);

            $scope.mainBillerDataObj.AllDoctorsList = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                return item.RoleId === 1 || item.RoleId === 43;
            });

            angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (ditem) {
                ditem.isChecked = true;
            });
        }


        var mObj = datapersistanceFactory.getItem("masterDataArrays");

        var currentdate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.PaymentsListCount = 0;
        $scope.PatientPayments = 1;
        $scope.SwitchSubTabs = function (tabchange) {
            $scope.PatientPayments = tabchange;

            if ($scope.mainBillerDataObj.AllBranchesList.length > 0) {
                $scope.mainBillerDataObj.AllBranchesList[0].IsChecked = true;
                $scope.ChangeApptBranch($scope.mainBillerDataObj.AllBranchesList[0], 1);
            }

            if ($scope.PatientPayments == 1) {
                $scope.Resetall();
            }
            else if ($scope.PatientPayments == 3) {
                $scope.ResetRefund();
            }
            else if ($scope.PatientPayments == 4) {
                $scope.ResetVoid();
            }
            else if ($scope.PatientPayments == 5) {
                $scope.ResetTransactions();
            }
            else if ($scope.PatientPayments == 6) {
                $scope.GetOrgNMITransactionList(1);
            } else if ($scope.PatientPayments == 7) {
                $scope.ChangeReportsTab(1);
            }
            else if ($scope.PatientPayments == 8) {
                $timeout(function () {
                    $scope.initPatientPaymentGrid();
                }, 300);
            }
            else {
                $scope.Resetall1();
            }


        }
        $scope.masterPaymentModes = [];
        $scope.MasterPaymentMethods = [];
        $scope.MasterTransactionCategories = [];
        if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
            $scope.masterPaymentModes = angular.copy(mObj.PaymentModes);

            $scope.MasterPaymentMethods = $filter("filter")($scope.masterPaymentModes, function (item) {
                return item.PaymentModeId === 2 || item.PaymentModeId === 3;
            });
        }


        $scope.PatientPaymenyObj = {
            "IsPatientDeposit": false,
            "TotalAdvanceDepositAvailable": 0,
            "TotalAllocatedAmount": 0,
            "TotalCopaymentAvailable": 0,
            "TotalDeductableAvailable": 0,
            "TotalDepositAvailable": 0,
            "TotalGeneralAmountAvailable": 0,
            "TotalPatientBalance": 0,
            "TotalUnAllocatedAmount": 0,
            "TotalPatientClaimBalance": 0,
            "TotalPatientPayment": 0
        };
        function getSelectedPatientData() {
            var obj = {
                "SearchText": "",
                "PatientId": 0,
                "SearchTypeId": 2
            }
            return obj;
        };
        $scope.PatientSearchdata = getSelectedPatientData();

        $scope.PaymentTypeObj = {
            "SelectStatusString": "All",
            "Name": "",
            "AllStatusCheck": true
        };
        $scope.BillingProviderTypeObj = {
            "SelectStatusString": "All",
            "Name": "",
            "AllStatusCheck": true
        };
        $scope.TransactionStatusTypeObj = {
            "SelectStatusString": "All",
            "Name": "",
            "AllStatusCheck": true
        };

        $scope.GetPaymentFilterList = [
            {
                "PaymentName": "Deposit",
                "PaymentTypeId": 1
            },
            {
                "PaymentName": "Payment",
                "PaymentTypeId": 2
            },
        ];
        $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
        var FromDate = moment($scope.currentdate).subtract(1, 'months').format('MM-DD-YYYY');

        var currentDate = new Date();
        var PaymentReceiptFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        function formatDate(date) {
            var mm = (date.getMonth() + 1).toString().padStart(2, '0');
            var dd = date.getDate().toString().padStart(2, '0');
            var yyyy = date.getFullYear();
            return mm + '-' + dd + '-' + yyyy;
        }

        $scope.GetPaymentFilterObj = function () {
            var obj = {
                "PatientId": 0,
                "MrNo": "",
                "PatientClaimNumber": "",
                "PatientDisplayId": "",
                "ClaimNo": 0,
                "ClaimExpiryDate": null,
                "PaymentFromDate": formatDate(PaymentReceiptFromDate),
                "PaymentToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ReceiptFromDate": formatDate(PaymentReceiptFromDate),
                "ReceiptToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "BillingProviderIds": 0,
                "UserId": $scope.UserId,
                "PaymentMethodIds": 0,
                "ReferenceNumber": "",
                "PageSize": 100,
                "PageNumber": 1,
                "OrganizationId": $scope.HospitalId,
                "RenderingProviderName": "",
                "BillPaymentTypeId": 1,
                "TransmissionMethodId": 0,
                "ClaimStatusList": [],
                "CurrentResponsibilityId": 1,
                "RenderingProviderId": 0,
                "PaymentTypeId": 0,
                "TransactionFromDate": FromDate,
                "TransactionToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "TransactionNumber": "",
                "PaymentStatusIds": 0,
                "TransactionSourceIds": 0,
                "SelectedHospitalId": 0,
                "Count": 0,
                "TransactionCategoryId":0
            }
            return obj;
        }

        $scope.PaymentsListObj = $scope.GetPaymentFilterObj();

        $scope.ClaimStatusListObj = {
            "SelectStatusString": "All",
            "ClaimStatusName": "",
            "AllStatusCheck": true
        };

        $scope.LoadPatientDetailsSearch = function (val) {


            if (val == undefined || val == null || val == "") {
                $scope.AllPatientList = [];
                $scope.PatientSearchdata.PatientId = 0;
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
                "SearchText": $scope.PatientSearchdata.SearchText || "",
                "SearchTypeID": $scope.PatientSearchdata.SearchTypeId || 0,
            }
            if ($scope.PatientSearchdata.SearchTypeId == 1) {
                object.Name = val;
            } else if ($scope.PatientSearchdata.SearchTypeId == 2) {
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
            if ($scope.PatientSearchdata.SearchText != "") {
                $scope.ShowPatientListDrop = true;
            }
        }
        function OnGetopPatientSearchError() {
            $scope.count = 0;
            $scope.AllPatientList = [];
            $scope.PatientSearchdata.SearchText = "";
        }

        $scope.changePatientSearchType = function (id) {
            $scope.PatientSearchdata = getSelectedPatientData();
            $scope.PatientSearchdata.SearchTypeId = id;
            $scope.PaymentsListObj.PatientId = 0;
            $scope.OrgNMITransactionListObj.PatientId = 0;
            $scope.AllPatientList = [];
            $scope.ShowPatientListDrop = false;
            $scope.clearPatientSearchData();
        }

        $scope.clearPatientSearchData = function () {
            $scope.ShowPatientListDrop = false;
            $scope.PatientSearchdata.SearchText = "";
            $scope.PaymentsListObj.PatientId = 0;
            $scope.OrgNMITransactionListObj.PatientId = 0;
            $scope.PaymentsListObj.PatientClaimNumber = "";
        };

        $scope.SelectedPatient = function (patietnitem) {
            $scope.PatientSearchdata.PatientId = patietnitem.PatientID;
            $scope.PaymentsListObj.PatientId = patietnitem.PatientID;
            $scope.OrgNMITransactionListObj.PatientId = patietnitem.PatientID;
            $scope.PatientSearchdata.SearchText = patietnitem.FullName;
            $scope.AllPatientList = [];

            if ($scope.PatientPayments == 2) {
                $scope.getPatientDepositAmountById(1);
            }
            else if ($scope.PatientPayments == 6) {
                $scope.GetOrgNMITransactionList(1);
            }
            else {
                $scope.SearchPaymentsDetails(1);
            }

            $scope.ShowPatientListDrop = false;

        };

        $scope.init = function () {

            $scope.BillingProviderList = [];
            $scope.ClaimDataList = [];
            $scope.ClaimFormatList = [];
            $scope.ClaimStatusListDD = [];
            $scope.CurrentResponsibilityList = [];
            $scope.MasterClaimStatusList = [];
            $scope.AllCardTypes = [];
            $scope.MasterPaymentTransactionTypes = [];

            var bilobj = {
                /* "OrganizationId": $scope.HospitalId || 0,*/
                "ParentOrganizationId": $scope.ParentHospitalId,
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 20
            };

            $q.all([
                eHnoteSettingsDataService.GetOrganizationBillingProviders(bilobj),
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
            ]).then(function (resp) {

                if (resp[0].data.rows.length > 0) {
                    var tempList = resp[0].data.rows || [];
                    if (tempList.length > 0) {
                        var filtredArray = $filter("filter")(tempList, { "ActiveInd": 'Y' }, true) || [];
                        $scope.BillingProviderList = angular.copy(filtredArray);

                        $scope.CheckAllBillingType(true);
                        $scope.CheckAllPaymentType(true);
                    }
                }
                if (resp[0].data.Masterrefundreasons.length > 0) {
                    $scope.Masterrefundreasons = resp[0].data.Masterrefundreasons || [];
                }
                if (resp[0].data.TransactionCategory.length > 0) {
                    $scope.MasterTransactionCategories = resp[0].data.TransactionCategory || [];

                    $scope.MasterTransactionCategories.unshift({
                        TransactionCategoryId: 0,
                        TransactionCategoryName: 'All'
                    });
                }

                if (resp[1].data.status == "Success") {
                    if (resp[1].data.BillPaymentByModes.length > 0) {
                        $scope.ClaimDataList = angular.copy(resp[1].data.BillPaymentByModes);
                    }
                    if (resp[1].data.TransmissionMethods.length > 0) {
                        $scope.ClaimFormatList = resp[1].data.TransmissionMethods || [];
                        $scope.ClaimFormatList = $filter("filter")($scope.ClaimFormatList, function (item) {
                            return item.TransmissionMethodId === 1 || item.TransmissionMethodId === 2;
                        });
                    }
                    if (resp[1].data.ClaimStatus.length > 0) {
                        $scope.MasterClaimStatusList = angular.copy(resp[1].data.ClaimStatus);
                        $scope.ClaimStatusListDD = angular.copy(resp[1].data.ClaimStatus);
                        $scope.ClaimStatusListDD.forEach(function (item) {
                            item.IsChecked = true;
                        });
                        $scope.PaymentsListObj.ClaimStatusList = $scope.MasterClaimStatusList.map(function (status) {
                            return status.ClaimStatusId;
                        }).join(',');
                    }
                    if (resp[1].data.CurrentResponsibilities.length > 0) {
                        $scope.CurrentResponsibilityList = resp[1].data.CurrentResponsibilities || [];
                    }
                    if (resp[1].data.Cardtype.length > 0) {
                        $scope.AllCardTypes = resp[1].data.Cardtype || [];
                    }
                    if (resp[1].data.WriteOffReasons.length > 0) {
                        $scope.WriteOffReasons = resp[1].data.WriteOffReasons || [];
                    }
                    if (resp[1].data.Cardtype.length > 0) {
                        $scope.CardTypesData = resp[1].data.Cardtype || [];
                    }
                    if (resp[1].data.DepositTypes.length > 0) {
                        $scope.DepositTypes = resp[1].data.DepositTypes || [];
                    }
                    if (resp[1].data.MasterPaymentTransactionTypes.length > 0) {
                        $scope.MasterPaymentTransactionTypes = resp[1].data.MasterPaymentTransactionTypes || [];
                        $scope.CheckAllPaymentStatus(true);
                    }

                }


                $scope.selectedPatientPaymentsList = eHnoteMasterDataService.getPatientPaymentsfreezingList();
                if ($scope.selectedPatientPaymentsList != '' && $scope.selectedPatientPaymentsList.PaymentFromDate != null) {
                    $scope.PaymentsListObj.PaymentFromDate = $scope.selectedPatientPaymentsList.PaymentFromDate || null;
                    $scope.PaymentsListObj.PaymentToDate = $scope.selectedPatientPaymentsList.PaymentToDate || null;
                    $scope.PaymentsListObj.ReceiptFromDate = $scope.selectedPatientPaymentsList.ReceiptFromDate || null;
                    $scope.PaymentsListObj.ReceiptToDate = $scope.selectedPatientPaymentsList.ReceiptToDate || null;
                    $scope.PaymentsListObj.RenderingProviderId = $scope.selectedPatientPaymentsList.RenderingProviderId || 0;
                    $scope.PaymentsListObj.PaymentTypeId = $scope.selectedPatientPaymentsList.PaymentTypeId || 0;
                    $scope.PaymentsListObj.ReferenceNumber = $scope.selectedPatientPaymentsList.ReferenceNumber || '';

                    $scope.selectedPatientPaymentsList.BillingProviderids = $scope.selectedPatientPaymentsList.BillingProviderids || '';
                    if ($scope.BillingProviderList.length > 0 && $scope.selectedPatientPaymentsList.BillingProviderids != '') {
                        angular.forEach($scope.BillingProviderList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        var selectedProviderIds = $scope.selectedPatientPaymentsList.BillingProviderids.split(",");

                        // Re-check only those items in the array that match the ClinicIds
                        $scope.BillingProviderList.forEach(pitem => {
                            pitem.IsChecked = selectedProviderIds.includes(pitem.OrganizationBillingProviderId.toString());
                        });
                    }

                    $scope.selectedPatientPaymentsList.PaymentModeids = $scope.selectedPatientPaymentsList.PaymentModeids || '';
                    if ($scope.masterPaymentModes.length > 0 && $scope.selectedPatientPaymentsList.PaymentModeids != '') {
                        angular.forEach($scope.masterPaymentModes, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        var selectedPaymentIds = $scope.selectedPatientPaymentsList.PaymentModeids.split(",");

                        $scope.masterPaymentModes.forEach(pitem => {
                            pitem.IsChecked = selectedPaymentIds.includes(pitem.PaymentModeId.toString());
                        });
                    }
                }
                $scope.SearchPaymentsDetails();
            });
        }


        $scope.PatientDeposits = [];
        $scope.getPatientDepositAmountById = function (pageno, type) {
            $scope.PatientDepositsListArray = [];
            if ($scope.masterPaymentModes.length > 0) {
                var PaymentModeids = $scope.masterPaymentModes
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.PaymentModeId)
                    .join(",");
            }

            var Locationids = $scope.mainBillerDataObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            var Frezobj = {
                "ReceiptFromDate": $scope.PaymentsListObj.ReceiptFromDate || null,
                "ReceiptToDate": $scope.PaymentsListObj.ReceiptToDate || null,
                "PaymentModeids": PaymentModeids || '',
            };
            eHnoteMasterDataService.addPatientDepositfreezingList(Frezobj);

            $scope.PatientDepositsObj.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;
            var obj = {
                "DepositFrom": $scope.PaymentsListObj.ReceiptFromDate || "",
                "DepositTo": $scope.PaymentsListObj.ReceiptToDate || "",
                "PatientId": $scope.PaymentsListObj.PatientId,
                /*"OrganizationId": $scope.PaymentsListObj.OrganizationId,*/
                "PaymentModeId": $scope.PaymentsListObj.PaymentMethodId,
                "PageSize": $scope.PatientDepositsObj.PageSize,
                "PageNumber": $scope.PatientDepositsObj.PageNumber,
                "TransactionNumber": "",
                "SortBy": "Asc",
                "SearchType": "Deposit",
                "Locationids": Locationids || '',
                "TransactionCategoryId": $scope.PaymentsListObj.TransactionCategoryId || 0,
            };

            obj.PaymentModeId = parseInt(obj.PaymentModeId);


            if (obj.DepositFrom != "") {
                obj.DepositFrom = $filter("usdateFormatter")(obj.DepositFrom, "-");
            }
            if (obj.DepositTo != "") {
                obj.DepositTo = $filter("usdateFormatter")(obj.DepositTo, "-");
            }


            eHnoteInsuranceService.GetOverAllPatientDeposits(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    var DepositsList = resp.data.rows || [];
                    $scope.PatientDepositsListArray = resp.data.rows;
                    $scope.PatientDepositsObj.Count = resp.data.count;


                    if ($scope.PatientDepositsListArray.length > 0) {
                        angular.forEach($scope.PatientDepositsListArray, function (pitem) {
                            pitem.IsselectedDeposit = false;
                            var uniqueMap = {};

                            (pitem.PatientDepositPaymodeList || []).forEach(function (bitem) {
                                var original = bitem.DepositTypeName || "";
                                var key = original.replace(/\s+/g, '').toLowerCase();
                                if (!uniqueMap[key]) {
                                    uniqueMap[key] = original;
                                }
                            });

                            pitem.DepositTypeNames = Object.values(uniqueMap).join(', ') || pitem.DepositTypeName || "";
                        })

                    }

                    $scope.PatientPaymenyObj.IsPatientDeposit = resp.data.IsPatientDeposit;
                    $scope.PatientPaymenyObj.TotalAdvanceDepositAvailable = resp.data.TotalAdvanceDepositAvailable;
                    $scope.PatientPaymenyObj.TotalAllocatedAmount = resp.data.TotalAllocatedAmount;
                    $scope.PatientPaymenyObj.TotalCopaymentAvailable = resp.data.TotalCopaymentAvailable;
                    $scope.PatientPaymenyObj.TotalDeductableAvailable = resp.data.TotalDeductableAvailable;
                    $scope.PatientPaymenyObj.TotalDepositAvailable = resp.data.TotalDepositAvailable;
                    $scope.PatientPaymenyObj.TotalGeneralAmountAvailable = resp.data.TotalGeneralAmountAvailable;
                    $scope.PatientPaymenyObj.TotalPatientClaimBalance = resp.data.TotalPatientClaimBalance;
                    $scope.PatientPaymenyObj.TotalUnAllocatedAmount = resp.data.TotalUnAllocatedAmount;
                    $scope.PatientPaymenyObj.TotalPatientPayment = resp.data.TotalPatientPayment;
                    $scope.PatientPaymenyObj.TotalCopaymentDepositlistAmount = 0;
                    $scope.PatientPaymenyObj.TotalAdvanceDepositlistAmount = 0;
                    $scope.PatientPaymenyObj.TotalGeneralDepositlistAmount = 0;
                    $scope.PatientPaymenyObj.TotalOtherDepositlistAmount = 0;

                    if (DepositsList.length > 0) {
                        angular.forEach(DepositsList, function (item) {
                            if (item.DepositTypeId === 1) {
                                $scope.PatientPaymenyObj.TotalCopaymentDepositlistAmount += item.DepositAmount || 0;
                            }
                            else if (item.DepositTypeId === 2) {
                                $scope.PatientPaymenyObj.TotalAdvanceDepositlistAmount += item.DepositAmount || 0;
                            }
                            else if (item.DepositTypeId === 3) {
                                $scope.PatientPaymenyObj.TotalGeneralDepositlistAmount += item.DepositAmount || 0;
                            }
                            else {
                                $scope.PatientPaymenyObj.TotalOtherDepositlistAmount += item.DepositAmount || 0;
                            }
                        });
                    }

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }
        //$scope.getPatientDepositAmountById(1);

        $scope.SearchPaymentsDetails = function (pageno) {
            $scope.PaymentsListObj.PageNumber = pageno || 1;
            $scope.PatientPaymentsListArray = [];

            if ($scope.BillingProviderList.length > 0) {
                var BillingProviderids = $scope.BillingProviderList
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.OrganizationBillingProviderId)
                    .join(",");
            }
            if ($scope.masterPaymentModes.length > 0) {
                var PaymentModeids = $scope.masterPaymentModes
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.PaymentModeId)
                    .join(",");
            }

            var Locationids = $scope.mainBillerDataObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0) // Exclude ClinicId === 0
                .map(pitem => pitem.ClinicId)
                .join(",");

            var Frezobj = {
                "PaymentFromDate": $scope.PaymentsListObj.PaymentFromDate || null,
                "PaymentToDate": $scope.PaymentsListObj.PaymentToDate || null,
                "ReceiptFromDate": null,
                "ReceiptToDate": null,
                "BillingProviderids": BillingProviderids || '',
                /*"PaymentModeids": PaymentModeids || '',*/
                "RenderingProviderId": $scope.PaymentsListObj.RenderingProviderId || 0,
                "PaymentTypeId": $scope.PaymentsListObj.PaymentTypeId || 0,
                "ReferenceNumber": $scope.PaymentsListObj.ReferenceNumber || '',
            };
            eHnoteMasterDataService.addPatientPaymentsfreezingList(Frezobj);

            var obj = {
                "PatientId": $scope.PaymentsListObj.PatientId,
                "MrNo": $scope.PaymentsListObj.PatientDisplayId,
                "ClaimNo": $scope.PaymentsListObj.PatientClaimNumber,
                "PaymentFromDate": $scope.PaymentsListObj.PaymentFromDate,
                "PaymentToDate": $scope.PaymentsListObj.PaymentToDate,
                "ReceiptFromDate": null,
                "ReceiptToDate": null,
                "BillingProviderId": "",
                "UserId": $scope.PaymentsListObj.UserId,
                "PaymentMethodId": PaymentModeids,
                "ReferenceNumber": $scope.PaymentsListObj.ReferenceNumber,
                "PageSize": $scope.PaymentsListObj.PageSize,
                "PageNumber": $scope.PaymentsListObj.PageNumber || 1,
                /* "OrganizationId": $scope.HospitalId,*/
                "PaymentTypeId": $scope.PaymentsListObj.PaymentTypeId || 0,
                "Locationids": Locationids || '',

            }

            eHnoteInsuranceService.GetAllClaimPatientPayments(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.PaymentsListObj.Count = resp.data.count || 0;
                        $scope.PaymentsListCount = resp.data.count || 0;
                        $scope.PaymentsListObj.TotalBilledAmount = resp.data.TotalBilledAmount || 0;
                        $scope.PaymentsListObj.TotalUnBilledAmount = resp.data.TotalUnBilledAmount || 0;
                        $scope.PaymentsListObj.TotalDepositAmount = resp.data.TotalDepositAmount || 0;
                        $scope.PaymentsListObj.TotalCashAmount = resp.data.TotalCashAmount || 0;
                        $scope.PaymentsListObj.TotalMasterCardAmount = resp.data.TotalMasterCardAmount || 0;
                        $scope.PaymentsListObj.TotalVisaAmount = resp.data.TotalVisaAmount || 0;
                        $scope.PaymentsListObj.TotalPaymentAmount = resp.data.TotalPaymentAmount || 0;
                        $scope.PaymentsListObj.TotalCreditCardAmount = resp.data.TotalCreditCardAmount || 0;
                        $scope.PaymentsListObj.TotalDebitCardAmount = resp.data.TotalDebitCardAmount || 0;
                        $scope.PatientPaymentsListArray = angular.copy(resp.data.rows);
                        //angular.forEach($scope.PatientPaymentsListArray, function (item) {
                        //    var billarray = $filter("filter")($scope.BillingProviderList, { "OrganizationBillingProviderId": item.OrganizationBillingProviderId }, true) || [];
                        //    if (billarray.length > 0) {
                        //        item.BillingProviderName = billarray[0].BillingProviderName || "";
                        //    }
                        //});
                        $scope.filterPOSPaymentsList = function (item) {
                            return [14].includes(item.PaymentMethodId);
                        };
                    }
                }
            });
        }

        $scope.Resetall = function (from) {
            $scope.PaymentsListObj = $scope.GetPaymentFilterObj();
            if (from == 'clear') {
                if ($scope.BillingProviderList.length > 0) {
                    var BillingProviderids = $scope.BillingProviderList
                        /*.filter(pitem => pitem.IsChecked)*/
                        .map(pitem => pitem.OrganizationBillingProviderId)
                        .join(",");
                }
                if ($scope.masterPaymentModes.length > 0) {
                    var PaymentModeids = $scope.masterPaymentModes
                        /*.filter(pitem => pitem.IsChecked)*/
                        .map(pitem => pitem.PaymentModeId)
                        .join(",");
                }

                if ($scope.mainBillerDataObj.AllBranchesList.length > 0) {
                    $scope.mainBillerDataObj.AllBranchesList[0].IsChecked = true;
                    $scope.ChangeApptBranch($scope.mainBillerDataObj.AllBranchesList[0], 1);
                }

                var Frezobj = {
                    "PaymentFromDate": $scope.PaymentsListObj.PaymentFromDate || null,
                    "PaymentToDate": $scope.PaymentsListObj.PaymentToDate || null,
                    "ReceiptFromDate": null,
                    "ReceiptToDate": null,
                    "BillingProviderids": BillingProviderids || '',
                    /*"PaymentModeids": PaymentModeids || '',*/
                    "RenderingProviderId": $scope.PaymentsListObj.RenderingProviderId || 0,
                    "PaymentTypeId": $scope.PaymentsListObj.PaymentTypeId || 0,
                    "ReferenceNumber": $scope.PaymentsListObj.ReferenceNumber || '',
                };
                eHnoteMasterDataService.addPatientPaymentsfreezingList(Frezobj);
            }
            $scope.PatientSearchdata = getSelectedPatientData();
            $scope.BillingProviderTypeObj.AllStatusCheck = true;
            $scope.PaymentTypeObj.AllStatusCheck = true;
            $scope.CheckAllBillingType(true);
            $scope.CheckAllPaymentType(true);
            $scope.CheckAllPaymentStatus(true);
            $scope.ClaimStatusToggle();
            $scope.selectedPatientPaymentsList = eHnoteMasterDataService.getPatientPaymentsfreezingList();
            if ($scope.selectedPatientPaymentsList != '' && $scope.selectedPatientPaymentsList.PaymentFromDate != null) {
                $scope.PaymentsListObj.PaymentFromDate = $scope.selectedPatientPaymentsList.PaymentFromDate || null;
                $scope.PaymentsListObj.PaymentToDate = $scope.selectedPatientPaymentsList.PaymentToDate || null;
                $scope.PaymentsListObj.ReceiptFromDate = $scope.selectedPatientPaymentsList.ReceiptFromDate || null;
                $scope.PaymentsListObj.ReceiptToDate = $scope.selectedPatientPaymentsList.ReceiptToDate || null;
                $scope.PaymentsListObj.RenderingProviderId = $scope.selectedPatientPaymentsList.RenderingProviderId || 0;
                $scope.PaymentsListObj.PaymentTypeId = $scope.selectedPatientPaymentsList.PaymentTypeId || 0;
                $scope.PaymentsListObj.ReferenceNumber = $scope.selectedPatientPaymentsList.ReferenceNumber || '';

                $scope.selectedPatientPaymentsList.BillingProviderids = $scope.selectedPatientPaymentsList.BillingProviderids || '';
                if ($scope.BillingProviderList.length > 0 && $scope.selectedPatientPaymentsList.BillingProviderids != '') {
                    angular.forEach($scope.BillingProviderList, function (Aitem) {
                        Aitem.IsChecked = false;
                    });
                    var selectedProviderIds = $scope.selectedPatientPaymentsList.BillingProviderids.split(",");

                    // Re-check only those items in the array that match the ClinicIds
                    $scope.BillingProviderList.forEach(pitem => {
                        pitem.IsChecked = selectedProviderIds.includes(pitem.OrganizationBillingProviderId.toString());
                    });
                }

                $scope.selectedPatientPaymentsList.PaymentModeids = $scope.selectedPatientPaymentsList.PaymentModeids || '';
                if ($scope.masterPaymentModes.length > 0 && $scope.selectedPatientPaymentsList.PaymentModeids != '') {
                    angular.forEach($scope.masterPaymentModes, function (Aitem) {
                        Aitem.IsChecked = false;
                    });
                    var selectedPaymentIds = $scope.selectedPatientPaymentsList.PaymentModeids.split(",");

                    $scope.masterPaymentModes.forEach(pitem => {
                        pitem.IsChecked = selectedPaymentIds.includes(pitem.PaymentModeId.toString());
                    });
                }
            }
            $scope.SearchPaymentsDetails(1);
        }
        $scope.Resetall1 = function (from) {
            $scope.PaymentsListObj = $scope.GetPaymentFilterObj();

            if ($scope.mainBillerDataObj.AllBranchesList.length > 0) {
                $scope.mainBillerDataObj.AllBranchesList[0].IsChecked = true;
                $scope.ChangeApptBranch($scope.mainBillerDataObj.AllBranchesList[0], 1);
            }

            if (from == 'clear') {
                if ($scope.masterPaymentModes.length > 0) {
                    var PaymentModeids = $scope.masterPaymentModes
                        /* .filter(pitem => pitem.IsChecked)*/
                        .map(pitem => pitem.PaymentModeId)
                        .join(",");
                }
                var Frezobj = {
                    "ReceiptFromDate": $scope.PaymentsListObj.ReceiptFromDate || null,
                    "ReceiptToDate": $scope.PaymentsListObj.ReceiptToDate || null,
                    "PaymentModeids": PaymentModeids || '',
                };
                eHnoteMasterDataService.addPatientDepositfreezingList(Frezobj);
            }
            $scope.PatientSearchdata = getSelectedPatientData();
            $scope.BillingProviderTypeObj.AllStatusCheck = true;
            $scope.PaymentTypeObj.AllStatusCheck = true;
            $scope.CheckAllBillingType(true);
            $scope.CheckAllPaymentType(true);
            $scope.CheckAllPaymentStatus(true);
            $scope.ClaimStatusToggle();

            $scope.selectedPatientDepositList = eHnoteMasterDataService.getPatientDepositfreezingList();
            if ($scope.selectedPatientDepositList != '' && $scope.selectedPatientDepositList.ReceiptFromDate != null) {
                $scope.PaymentsListObj.ReceiptFromDate = $scope.selectedPatientDepositList.ReceiptFromDate || null;
                $scope.PaymentsListObj.ReceiptToDate = $scope.selectedPatientDepositList.ReceiptToDate || null;

                $scope.selectedPatientDepositList.PaymentModeids = $scope.selectedPatientDepositList.PaymentModeids || '';
                if ($scope.masterPaymentModes.length > 0 && $scope.selectedPatientDepositList.PaymentModeids != '') {
                    angular.forEach($scope.masterPaymentModes, function (Aitem) {
                        Aitem.IsChecked = false;
                    });
                    var selectedPaymentIds = $scope.selectedPatientDepositList.PaymentModeids.split(",");

                    $scope.masterPaymentModes.forEach(pitem => {
                        pitem.IsChecked = selectedPaymentIds.includes(pitem.PaymentModeId.toString());
                    });
                }
            }

            $scope.getPatientDepositAmountById(1);
        }

        $scope.init();

        $scope.calculateExpiryDate = function () {

            var currentDate = new Date();

            currentDate.setDate(currentDate.getDate() + 90);

            var expiryMonth = currentDate.getMonth() + 1;
            var expiryDay = currentDate.getDate();
            var expiryYear = currentDate.getFullYear();

            expiryMonth = expiryMonth < 10 ? '0' + expiryMonth : expiryMonth;
            expiryDay = expiryDay < 10 ? '0' + expiryDay : expiryDay;

            $scope.PaymentsListObj.ClaimExpiryDate = `${expiryMonth}-${expiryDay}-${expiryYear}`;
        };


        $scope.navtoClaimSummaryPopup = function (Obj, item, pitem,type) {
            $scope.calculateExpiryDate();
            item = item || '';
            Obj = Obj || '';
            pitem = pitem || '';
            type = type || '';
            let AppointmentId = null;
            let PatientId = null;
            let PatientClaimId = 0;
            if (type == 'Claims') {
                if (item != '') {
                    AppointmentId = item.AppointmentId;
                    PatientId = item.PatientId;
                    PatientClaimId = item.PatientClaimId;
                }
            } else {
                if (item != '') {
                    AppointmentId = pitem.AppointmentId;
                    PatientId = Obj.PatientId;
                    PatientClaimId = pitem.PatientClaimId;
                }
            }

            $scope.claimScreenParentObj = {
                "PatientId": PatientId || null,
                "AppointmentId": AppointmentId || null,
                "PatientFullName": item.PatientFullName || "",
                "VisitId": item.VisitId || '',
                "ActionType": "EditClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "IsCreateSuperBill": false,
                "PatientClaimId": PatientClaimId,
                "SuperBillArray": [],
                "ClaimExpiryDate": $scope.PaymentsListObj.ClaimExpiryDate || null,
                "IsClaimPatientDeposit": true,
            };
            $scope.mainBillerDataObj.Tabid = 2;
            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsAddUpdateClaimPopupCtrl",
                "windowClass": "modal__ninety--",
                "resolve": {
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
                }
            });

            $scope.mInstanceAdd.result.then(function (resp) {
                resp = resp || "";

            }, function () { });
        }

        $scope.SearchPatientwithClaimId = function (pageno, type) {
            var type = (type === undefined || type === '') ? 'All' : type;
            var params = {
                "OrganizationId": $scope.HospitalId,
                "OrganizationFacilityId": 0,
                "FromDate": "",
                "ToDate": "",
                "PatientId": 0,
                "SearchText": "",
                "PatientMRNo": "",
                "PatienClaimNumber": $scope.PaymentsListObj.ClaimNumber || "",
                "BatchNumber": "",
                "BillingProviderId": 0,
                "RenderingProviderId": 0,
                "TransmissionTypeId": 0,
                "ClaimTypeId": 0,
                "PayorId": 0,
                "ClaimStatusList": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
                "PageSize": 100,
                "PageNumber": 1,
                "Type": type,
                "BillPaymentTypeId": 0,
                "CurrentResponsibilityId": 0,
                "DenialId": 0
            };

            eHnotePatientDataService.GetOrganizationClaimsListData(params).then(function (resp) {
                console.log(resp);

                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                    $scope.navtoClaimSummaryPopup("",resp.data.rows[0], "", type);
                }
            }, function (err) {

            });
            $scope.PaymentsListObj.ClaimNumber = "";

        }

        $scope.allFilterPopover = {
            templateUrl: 'allFilterPopover.html',
        };

        $scope.searchtxtb = {
            "txt1": ""
        }

        $scope.changeDoctor = function (item) {
            $scope.PaymentsListObj.RenderingProviderId = item.DoctorID;
            $scope.PaymentsListObj.UserId = item.DoctorID;
            $scope.PaymentsListObj.RenderingProviderName = item.FullName;
            $scope.searchtxtb.txt1 = '';
        }

        $scope.ClaimStatusToggle = function (obj) {
            var checkedArray = _.where($scope.ClaimStatusListDD, { IsChecked: true });
            $scope.ClaimStatusListObj.AllStatusCheck = checkedArray.length > 0 && $scope.ClaimStatusListDD.length === checkedArray.length ? true : false;
            if ($scope.ClaimStatusListObj.AllStatusCheck) {
                $scope.ClaimStatusListObj.SelectStatusString = 'All';
                $scope.PaymentsListObj.ClaimStatusList = checkedArray.map(function (status) {
                    return status.ClaimStatusId;
                }).join(',');
            }

            if (!$scope.ClaimStatusListObj.AllStatusCheck && checkedArray.length > 0) {
                $scope.ClaimStatusListObj.SelectStatusString = 'Selected';
                $scope.PaymentsListObj.ClaimStatusList = checkedArray.map(function (status) {
                    return status.ClaimStatusId;
                }).join(',');
            }
            if (!$scope.ClaimStatusListObj.AllStatusCheck && checkedArray.length === 0) {
                $scope.ClaimStatusListObj.SelectStatusString = 'Select';
                $scope.PaymentsListObj.ClaimStatusList = checkedArray.map(function (status) {
                    return status.ClaimStatusId;
                }).join(',');
            }
        };

        $scope.checkAllClaimStatus = function (val) {
            if (val) {
                angular.forEach($scope.ClaimStatusListDD, function (item) {
                    item.IsChecked = true;
                });

                $scope.ClaimStatusListObj.SelectStatusString = 'All';
            }
            else {
                angular.forEach($scope.ClaimStatusListDD, function (item) {
                    item.IsChecked = false;
                });

                $scope.ClaimStatusListObj.SelectStatusString = 'Selected';
            }
            $scope.ClaimStatusToggle();
        };
        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }

        $scope.ShowRemarksListRefPopover = {
            templateUrl: 'ShowRemarksListRefPopoverPopovertemplate.html'
        };

        $scope.CheckAllPaymentType = function (val) {
            $scope.PaymentsListObj.PaymentMethodIds = 0;
            if (val) {
                angular.forEach($scope.masterPaymentModes, function (item) {
                    item.IsChecked = true;
                });

                $scope.PaymentsListObj.PaymentMethodIds = $scope.masterPaymentModes.map(function (status) {
                    return status.PaymentModeId;
                }).join(',');

                $scope.PaymentTypeObj.SelectStatusString = 'All';
            }
            else {
                angular.forEach($scope.masterPaymentModes, function (item) {
                    item.IsChecked = false;
                });

                $scope.PaymentsListObj.PaymentMethodIds = $scope.masterPaymentModes.map(function (status) {
                    return status.PaymentModeId;
                }).join(',');

                $scope.PaymentTypeObj.SelectStatusString = 'Select Status';
            }
        };
        $scope.PaymentTypeToggle = function () {

            var checkedArray = _.where($scope.masterPaymentModes, { IsChecked: true });
            $scope.PaymentTypeObj.AllStatusCheck = checkedArray.length > 0 && $scope.masterPaymentModes.length === checkedArray.length ? true : false;
            if ($scope.PaymentTypeObj.AllStatusCheck) {
                $scope.PaymentTypeObj.SelectStatusString = 'All';
            }

            $scope.PaymentsListObj.PaymentMethodIds = checkedArray.map(function (status) {
                return status.PaymentModeId;
            }).join(',');

            if (!$scope.PaymentTypeObj.AllStatusCheck && checkedArray.length > 0) {
                $scope.PaymentTypeObj.SelectStatusString = 'Selected';
            }
        };

        $scope.CheckAllBillingType = function (val) {

            $scope.PaymentsListObj.BillingProviderIds = 0;

            if (val) {
                angular.forEach($scope.BillingProviderList, function (item) {
                    item.IsChecked = true;
                });

                $scope.BillingProviderTypeObj.SelectStatusString = 'All';
                $scope.PaymentsListObj.BillingProviderIds = $scope.BillingProviderList.map(function (status) {
                    return status.OrganizationBillingProviderId;
                }).join(',');
            }
            else {
                angular.forEach($scope.BillingProviderList, function (item) {
                    item.IsChecked = false;
                });

                $scope.BillingProviderTypeObj.SelectStatusString = 'Select Status';
                $scope.PaymentsListObj.BillingProviderIds = $scope.BillingProviderList.map(function (status) {
                    return status.OrganizationBillingProviderId;
                }).join(',');
            }
        };
        $scope.BillingTypeToggle = function () {

            var checkedArray = _.where($scope.BillingProviderList, { IsChecked: true });
            $scope.BillingProviderTypeObj.AllStatusCheck = checkedArray.length > 0 && $scope.BillingProviderList.length === checkedArray.length ? true : false;
            if ($scope.BillingProviderTypeObj.AllStatusCheck) {
                $scope.BillingProviderTypeObj.SelectStatusString = 'All';
            }

            $scope.PaymentsListObj.BillingProviderIds = checkedArray.map(function (status) {
                return status.OrganizationBillingProviderId;
            }).join(',');

            if (!$scope.BillingProviderTypeObj.AllStatusCheck && checkedArray.length > 0) {
                $scope.BillingProviderTypeObj.SelectStatusString = 'Selected';
            }
        };


        $scope.AddDespositePrint = function (Tempitem) {

            if (Tempitem.DepositPaymentmodeList != undefined) {
                Tempitem.PatientDepositPaymodeList = Tempitem.DepositPaymentmodeList || [];
            }

            var CostInWords = "";
            CostInWords = eHnotePrintService.ConvertNumberToWords(Tempitem.DepositAmount);

            var PrintInfo = {
                "DepositeDetails": Tempitem,
                "BillingType": "Payment Receipt",
                "PrintedDatenTime": "",
                "CostInWords": CostInWords,
                "DepositDate": $filter("date")(Tempitem.DepositDate, "MM-dd-yyyy") || "",
                "PaymentType": Tempitem.PatientDepositPaymodeList.length > 0 || ""
            };
            var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
            var printTime = moment(new Date()).format("HH:mm");
            var printDatemTime = printDate + '  ' + printTime;
            PrintInfo.PrintedDatenTime = printDatemTime;

            eHnotePrintService.GenerateAddPatientDepositPrint(PrintInfo);
        };

        $scope.VoidPatientPayment = function (item) {

            var mInstanceAdd = $uibModal.open({
                "templateUrl": "PaymentVoidReasonPopUp.html",
                "size": "sm",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": " ",
                "resolve": {
                    "sitem": function () { return item; },
                    "UserId": function () { return $scope.UserId; },
                    "HospitalId": function () { return $scope.HospitalId; },

                },
                "controller": function ($scope, $uibModal, $uibModalInstance, sitem, UserId, HospitalId) {
                    sitem = sitem || '';
                    $scope.uibclose = function () {
                        $uibModalInstance.close("cancel");
                    }

                    $scope.HospitalId = HospitalId;
                    $scope.UserId = UserId;

                    $scope.mainNMITransactionid = "";
                    if (sitem.NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = sitem.OnlineTransactionNumber || "";
                    }
                    $scope.VoidPatientObj = {
                        "VoidRemarks": '',
                    }


                    $scope.SaveOnlineVoidPaymentData = function () {
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
                        $scope.mainNMITransactionObj.PaymentAmount = sitem.TotalPatientPayment;
                        $scope.mainNMITransactionObj.MerchentId = "";
                        $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
                        $scope.mainNMITransactionObj.CardHolderName = sitem.PatientFullName || "";
                        $scope.mainNMITransactionObj.PatientEmail = sitem.PatientEmailId || "";
                        $scope.mainNMITransactionObj.PatientMobile = sitem.PatientMobile || "";

                        if ($scope.mainNMITransactionObj.PatientMobile != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                            $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                        }

                        $scope.mainNMITransactionObj.PatientMrNo = sitem.PatientDisplayId || "";
                        $scope.mainNMITransactionObj.OrderId = "";
                        $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
                        $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                        $scope.mainNMITransactionObj.BillPaymentTypeId = sitem.BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = sitem.BillPaymentType || "";
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = 4;
                        $scope.mainNMITransactionObj.TransactionType = "void";
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = "void";
                        $scope.mainNMITransactionObj.AppointmentId = sitem.AppointmentId || 0;
                        $scope.mainNMITransactionObj.VisitId = sitem.VisitId || 0;


                        eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
                            console.log(resp.data);

                            var res = resp.data || {};
                            if (res.Status == "Success") {
                                alertify.success(res.responseText);

                                $scope.SavePatientVoidPayment();
                            }
                        })

                    };


                    $scope.SavePatientVoidPayment = function () {
                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }
                        let ClaimTransactions = [];
                        $scope.TotalTransactionAmount = 0;

                        angular.forEach(item.EOBClaimInfo, function (pitem) {

                            angular.forEach(pitem.EOBClaimLineItems, function (titem) {
                                if (titem.PatientWriteOffAmount != 0) {
                                    let obj3 = {
                                        "ClaimTransactionId": 0,
                                        "PatientDepositId": 0,
                                        "EOBClaimInfoId": pitem.EOBClaimInfoId || 0,
                                        "PatientClaimId": titem.PatientClaimId || 0,
                                        "ClaimLineItemId": titem.ClaimLineItemId,
                                        "OrganizationId": $scope.HospitalId,
                                        "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                        "TransactionAmount": titem.PatientWriteOffAmount,
                                        "PatientAmount": titem.PatientWriteOffAmount,
                                        "InsuranceAmount": 0,
                                        "ReferenceNumber": "",
                                        "TransactionTypeId": 103,
                                        "TransactionType": "WriteOff Reversal",
                                        "TransactionSourceId": 3,
                                        "TransactionSource": "Patient",
                                        "SettlementStatusId": 7,
                                        "SettlementStatus": "Cancel Payment",
                                        "TransactionNotes": $scope.VoidPatientObj.VoidRemarks || "",
                                        "EOBId": sitem.EOBId || 0,
                                    }
                                    ClaimTransactions.push(obj3);
                                }

                                if (titem.PaymentAmount != 0) {
                                    let obj3 = {
                                        "ClaimTransactionId": 0,
                                        "PatientDepositId": 0,
                                        "EOBClaimInfoId": pitem.EOBClaimInfoId || 0,
                                        "PatientClaimId": titem.PatientClaimId || 0,
                                        "ClaimLineItemId": titem.ClaimLineItemId,
                                        "OrganizationId": $scope.HospitalId,
                                        "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                        "TransactionAmount": titem.PaymentAmount,
                                        "PatientAmount": titem.PaymentAmount,
                                        "InsuranceAmount": 0,
                                        "ReferenceNumber": "",
                                        "TransactionTypeId": 101,
                                        "TransactionType": "Patient Payment Reversal",
                                        "TransactionSourceId": 3,
                                        "TransactionSource": "Patient",
                                        "SettlementStatusId": 7,
                                        "SettlementStatus": "Cancel Payment",
                                        "TransactionNotes": $scope.VoidPatientObj.VoidRemarks || "",
                                        "EOBId": sitem.EOBId || 0,
                                    }
                                    ClaimTransactions.push(obj3);
                                }

                            });

                        });

                        let obj = {
                            "EOBId": sitem.EOBId || 0,
                            "EOBClaimInfoId": sitem.EOBClaimInfoId || 0,
                            "BillingProviderId": sitem.OrganizationBillingProviderId || null,
                            "ClaimLineItemId": sitem.ClaimLineItemId,
                            "OrganizationId": sitem.OrganizationId,
                            "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                            "ReferenceNumber": sitem.ReferenceNumber,
                            "TransactionTypeId": "",
                            "TransactionType": "",
                            "TransactionSourceId": 3,
                            "TransactionSource": "Patient",
                            "SettlementStatusId": 7,
                            "SettlementStatus": "Cancel Payment",
                            "TransactionNotes": $scope.VoidPatientObj.VoidRemarks || "",
                            "UserId": $scope.UserId,
                            "PatientId": sitem.PatientId || null,
                            "PatientClaimId": sitem.PatientClaimId,
                            "ClaimTransactions": ClaimTransactions
                        }

                        console.log(JSON.stringify(obj))

                        eHnoteInsuranceService.UpdateVoidPatientPayment(obj).then(function (resp) {
                            console.log(resp);
                            if (resp.data.Status === "Success") {

                                $uibModalInstance.close(resp.data);
                                alertify.success("Payment cancelled successfully.")
                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });
                    }


                }
            });

            mInstanceAdd.result.then(function () {

                $scope.SearchPaymentsDetails(1);

            }, function () {
                $scope.SearchPaymentsDetails(1);
            });
        }

        $scope.RefundPatientPayment = function (item) {

            var obj = {
                "AllCardTypes": $scope.AllCardTypes || [],
                "Masterrefundreasons": $scope.Masterrefundreasons || [],
                "AllUsersList": $scope.AllHospitalData.AllUsersList || [],
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "RefundPaymentpopup.html",
                "backdrop": "static",
                "size": "lg",
                "keyboard": false,
                "windowClass": "",
                "resolve": {
                    //"PatientDepositsListArray": function () { return $scope.PatientDepositsListArray; },
                    "item": function () { return item; },
                    "obj": function () { return obj; },


                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, item, datapersistanceFactory, obj, eHnoteInsuranceService) {
                    $scope.mainobj = item;
                    $scope.mainNMITransactionid = "";
                    if ($scope.mainobj.NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = $scope.mainobj.OnlineTransactionNumber || "";
                    }

                    var mObj = datapersistanceFactory.getItem("masterDataArrays");
                    $scope.masterPaymentModes = [];
                    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                        $scope.masterPaymentModes = mObj.PaymentModes;
                        $scope.filterPaymentModes = function (item) {
                            return ![13, 14].includes(item.PaymentModeId);
                        };
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

                    $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                    $scope.AllCardTypes = obj.AllCardTypes || [];
                    $scope.AllUsersList = obj.AllUsersList || [];

                    $scope.GetRefundpaymentObj = function () {
                        var obj = {
                            "UserId": $scope.UserId,
                            "RefundByUser": "",
                            "OrganizationId": $scope.HospitalId,
                            "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "RefundAmount": $scope.mainobj.TotalPatientPayment || null,
                            "RefundBy": "",
                            "DeleteInd": "N",
                            "AppointmentId": $scope.mainobj.AppointmentID || null,
                            "PatientId": $scope.mainobj.PatientId || null,
                            "RefundreasonId": null,
                            "Refundreason": null,
                            "Remarks": null,
                            "CardtypeId": null,
                            "Cardtype": "",
                            "RefundPaymentMethodId": $scope.mainobj.PaymentMethodId || null,
                            "RefundPaymentMethod": $scope.mainobj.PaymentMethod || "",
                            "ReceiptNumber": "",
                            "ReferenceNumber": "",
                            "CardNumber": "",
                            "DepositStatus": "Refund",
                            "DepositStatusId": "3",
                            "Transactions": [],
                            "IsRefundDepositt": false


                        }

                        return obj;
                    };


                    $scope.init = function () {

                        $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                        var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
                        }
                    }
                    $scope.init();

                    $scope.RefundPaymentObj.RefundPaymentMethodId = $scope.mainobj.PaymentMethodId;
                    $scope.RefundPaymentObj.RefundPaymentMethod = $scope.mainobj.PaymentMethodName;

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
                        }
                    }

                    $scope.PatientRefund = function () {


                        let Transactions = [];
                        $scope.RefundPaymentObj.RefundAmount = parseFloat($scope.RefundPaymentObj.RefundAmount) || null;
                        $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;

                        if ($scope.RefundPaymentObj.RefundAmount == null) {
                            alertify.error("Please Enter Refund Amount");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundreasonId == null) {
                            alertify.error("Please Select Refund Reason");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.TotalPatientPayment) {
                            alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                            return;
                        }
                        var ClaimTransactions = [];
                        angular.forEach($scope.mainobj.ClaimTransactionsLevel, function (Aitem) {
                            let obj3 = {
                                "EOBId": Aitem.EOBId || 0,
                                "ClaimTransactionId": 0,
                                "PatientDepositId": Aitem.PatientDepositId,
                                "ClaimLineItemId": Aitem.ClaimLineItemId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                "TransactionAmount": -(Aitem.TransactionAmount),
                                "PatientAmount": -(Aitem.TransactionAmount),
                                "InsuranceAmount": 0,
                                "ReferenceNumber": Aitem.ReferenceNumber,
                                "TransactionTypeId": 57,
                                "TransactionType": "Selfpay Adjustment",
                                "TransactionSourceId": 101,
                                "TransactionSource": "Patient Void",
                                "SettlementStatusId": 3,
                                "SettlementStatus": "Fully Settled",
                                "TransactionNotes": ""
                            }
                            ClaimTransactions.push(obj3);
                        });

                        var params = {
                            "UserId": $scope.UserId,
                            "OrganizationId": $scope.HospitalId,
                            "EOBId": $scope.mainobj.EOBId || 0,
                            "ClaimTransactionId": null,
                            "PatientDepositId": $scope.mainobj.PatientDepositId || null,
                            "ClaimLineItemId": $scope.mainobj.ClaimLineItemId,
                            "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                            "TransactionAmount": $scope.mainobj.TotalPatientPayment,
                            "PatientAmount": $scope.mainobj.TotalPatientPayment,
                            "InsuranceAmount": 0,
                            "ReferenceNumber": $scope.mainobj.ReferenceNumber,
                            "TransactionTypeId": 101,
                            "TransactionType": "Payment Void",
                            "TransactionSourceId": 3,
                            "TransactionSource": "Patient",
                            "SettlementStatusId": 3,
                            "SettlementStatus": "Fully Settled",
                            "TransactionNotes": $scope.RefundPaymentObj.Refundreason || "",
                            "PatientId": $scope.mainobj.PatientId || null,
                            "PatientClaimId": $scope.mainobj.PatientClaimId || null,
                            "RefundDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                            "RefundAmount": $scope.mainobj.TotalPatientPayment || null,
                            "RefundByUserId": $scope.UserId,
                            "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                            "DeleteInd": "N",
                            "AppointmentId": $scope.RefundPaymentObj.AppointmentId || null,
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
                            "EOBClaimInfoId": $scope.mainobj.EOBClaimInfoId,
                            "EOBLineItemId": $scope.mainobj.EOBLineItemId,
                            "ClaimTransactions": ClaimTransactions



                        }

                        console.log(JSON.stringify(params));


                        eHnoteInsuranceService.UpdateRefundPatientPayment(params).then(function (resp) {
                            if (resp.data.Status == "Success") {
                                $uibModalInstance.close("cancel");
                            }

                        }, function (err) {

                        });
                    }


                    $scope.navtoNMIPatientRefund = function (item) {
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
                        $scope.mainNMITransactionObj.PaymentAmount = $scope.mainobj.TotalPatientPayment;
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
                        $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.BillPaymentType || "";
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = 102;
                        $scope.mainNMITransactionObj.TransactionType = "Payment Refund";
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = "Payment Refund";
                        $scope.mainNMITransactionObj.AppointmentId = $scope.mainobj.AppointmentId || 0;
                        $scope.mainNMITransactionObj.VisitId = $scope.mainobj.VisitId || 0;


                        eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                            var res = resp.data || {};
                            console.log(res)
                            if (res.Status == "Success") {
                                alertify.success(res.Status);

                                $scope.PatientRefund();
                            }
                        })

                    };

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }

            });

            mInstanceAdd.result.then(function () {



            }, function () { });
        }

        $scope.Showtransactionlist = function (item) {

            $scope.ViewDepositScreen = false;
            angular.forEach($scope.PatientDepositsListArray, function (sitem) {
                if (sitem !== item) {
                    sitem.Isshow = false;
                }
            });
            item.Isshow = !item.Isshow;
            if (!item.Isshow) return;
            item.PatientDepositTransactionList = [];

            var obj = {
                "PatientId": item.PatientId,
                /* "OrganizationId": item.OrganizationId,*/
                "PatientDepositId": item.PatientDepositId
            };


            eHnoteInsuranceService.GetPatientDepositTransactionList(obj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    var allTransactions = resp.data.rows || [];

                    if (allTransactions.length > 0) {
                        item.IsVoidTransactionInd = allTransactions.some(t => t.PaymentTransactionTypeId === 4);
                        item.IsCancelTransactionInd = allTransactions.some(t => t.PaymentTransactionTypeId === 6);
                    }

                    item.PatientDepositTransactionList = allTransactions.filter(function (t) {
                        return t.PaymentTransactionTypeId !== 4 && t.PaymentTransactionTypeId !== 6;
                    });



                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };

        $scope.isToday = function (transactionDateStr) {
            var today = new Date();
            var todayStr = today.toISOString().slice(0, 10);
            return transactionDateStr === todayStr;
        };

        $scope.ViewTransaction = function (item) {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "DepositTransactionList.html",
                "backdrop": "static",
                "keyboard": false,
                //"size": "lg",
                "windowClass": "modal__ninety-- in",
                "resolve": {
                    "item": function () { return item; },
                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, item) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    item = item || [];

                    $scope.TransactionListData = [];

                    $scope.GetPatientTransactionList = function (pageno, type) {

                        var obj = {
                            "PatientId": item.PatientId,
                            /*"OrganizationId": item.OrganizationId,*/
                            "PatientDepositId": item.PatientDepositId

                        };


                        eHnoteInsuranceService.GetPatientTransactionList(obj).then(function (resp) {
                            if (resp.data.Status === "Success") {
                                $scope.TransactionListData = resp.data.rows || [];

                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });
                    }
                    $scope.GetPatientTransactionList();

                }

            });

        }

        $scope.RefundPatientDepositdata = function (item, ID) {
            $scope.ViewDepositScreen = false;
            var obj = {
                "AllCardTypes": $scope.AllCardTypes || [],
                "Masterrefundreasons": $scope.Masterrefundreasons || [],
                "AllUsersList": $scope.AllHospitalData.AllUsersList || [],
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "RefundDepositpopup.html",
                "backdrop": "static",
                "size": "lg",
                "keyboard": false,
                "windowClass": "",
                "resolve": {
                    //"PatientDepositsListArray": function () { return $scope.PatientDepositsListArray; },
                    "mainobj": function () { return item; },
                    "obj": function () { return obj; },
                    "ID": function () { return ID; },

                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, mainobj, datapersistanceFactory, obj, eHnoteInsuranceService, ID) {
                    ID = ID || '';
                    $scope.mainNMITransactionid = "";
                    //if (mainobj.NMITransactionId !== 0) {
                    //    $scope.mainNMITransactionid = mainobj.OnlineTransactionNumber || "";
                    //}
                    $scope.IsRefundDisable = true;

                    var mObj = datapersistanceFactory.getItem("masterDataArrays");
                    $scope.masterPaymentModes = [];
                    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                        $scope.masterPaymentModes = mObj.PaymentModes;
                        $scope.filterPaymentModes = function (item) {
                            return ![13, 14].includes(item.PaymentModeId);
                        };
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
                    $scope.mainobj = mainobj;
                    $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                    $scope.AllCardTypes = obj.AllCardTypes || [];
                    $scope.AllUsersList = obj.AllUsersList || [];

                    $scope.GetRefundpaymentObj = function () {
                        var obj = {
                            "UserId": $scope.UserId,
                            "RefundByUser": "",
                            "OrganizationId": $scope.mainobj.OrganizationId,
                            "PatientDepositId": $scope.mainobj.PatientDepositId || null,
                            "RefundDepositId": null,
                            "ReceiptNo": $scope.mainobj.ReceiptNo || "",
                            "ReceiptId": 0,
                            "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "RefundAmount": mainobj.UnBilledAmount || null,
                            "RefundBy": "",
                            "DeleteInd": "N",
                            "AppointmentId": $scope.mainobj.AppointmentID || null,
                            "PatientId": $scope.mainobj.PatientId || null,
                            "RefundreasonId": null,
                            "Refundreason": null,
                            "Remarks": null,
                            "CardtypeId": null,
                            "Cardtype": "",
                            "RefundPaymentMethodId": 5,
                            "RefundPaymentMethod": "Check",
                            "ReceiptNumber": "",
                            "ReferenceNumber": "",
                            "CardNumber": "",
                            "DepositStatus": "Refund",
                            "DepositStatusId": "3",
                            "Transactions": [],
                            "IsCheckedRefund": false,


                        }

                        return obj;
                    };


                    $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                    if (mainobj.PatientDepositPaymodeList.length == 1) {
                        if (mainobj.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                            $scope.mainNMITransactionid = mainobj.PatientDepositPaymodeList[0].OnlineTransactionNumber || "";
                        }
                    }

                    $scope.handlePatPaymentRefundCheckbox = function (item) {
                        if (item.IsCheckedRefund == true) {
                            if (mainobj.PatientDepositPaymodeList.length == 1) {
                                if (mainobj.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                                    $scope.RefundPaymentObj.RefundPaymentMethodId = mainobj.PatientDepositPaymodeList[0].PaymentMethodId || 5;
                                    $scope.RefundPaymentObj.RefundPaymentMethod = mainobj.PatientDepositPaymodeList[0].PaymentMethodName || '';
                                    $scope.RefundPaymentObj.CardtypeId = mainobj.PatientDepositPaymodeList[0].CardtypeId || null;
                                    $scope.RefundPaymentObj.Cardtype = mainobj.PatientDepositPaymodeList[0].CardType || null;
                                    $scope.RefundPaymentObj.CardNumber = mainobj.PatientDepositPaymodeList[0].CardNumber || '';
                                }
                            }
                            $scope.RefundPaymentObj.IsCheckedRefund = true;
                        } else {
                            $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());
                            $scope.RefundPaymentObj.IsCheckedRefund = false;
                        }
                    };


                    $scope.changeIndividualRefund = function (amount) {
                        if (amount > mainobj.UnBilledAmount) {
                            alertify.error("Refund Amount should not be greater than the Unallocated Deposit Amount.");
                            $scope.RefundPaymentObj.RefundAmount = '';
                            return false;
                        } else {

                        }
                    }


                    $scope.init = function () {

                        /*$scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());*/

                        var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
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
                        }
                    }

                    $scope.PatientRefund = function () {


                        let Transactions = [];
                        $scope.RefundPaymentObj.RefundAmount = parseFloat($scope.RefundPaymentObj.RefundAmount) || null;
                        $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                        if ($scope.RefundPaymentObj.RefundreasonId == null) {
                            alertify.error("Please Select Refund Reason");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount == null || $scope.RefundPaymentObj.RefundAmount == 0) {
                            alertify.error("Please Enter Refund Amount");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.UnBilledAmount) {
                            alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                            return;
                        }
                        if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                            alertify.error("Please enter Refund remarks.");
                            return false;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount != null) {
                            let obj3 = {

                                "UserId": $scope.UserId,
                                "PatientId": $scope.mainobj.PatientId || null,
                                "RefundDepositId": null,
                                "RefundTransactionId": 0,
                                "PatientDepositId": $scope.mainobj.PatientDepositId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                                "TransactionAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                "RefundAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                "TransactionSourceId": 3,
                                "TransactionSource": "Patient",
                                "DeleteInd": "N",

                            }
                            Transactions.push(obj3);
                        }

                        var params = {
                            "UserId": $scope.UserId,
                            "OrganizationId": $scope.RefundPaymentObj.OrganizationId,
                            "DepositStatus": "Refund",
                            "DepositStatusId": "3",
                            "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,
                            "RefundDepositId": null,
                            "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
                            "RefundDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                            "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
                            "RefundByUserId": $scope.UserId,
                            "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                            "DeleteInd": "N",
                            "AppointmentId": $scope.RefundPaymentObj.AppointmentId || null,
                            "PatientId": $scope.RefundPaymentObj.PatientId || null,
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
                            "Transactions": Transactions || [],
                            "PatientDepositPaymodeListId": mainobj.PatientDepositPaymodeListId,
                            "PaymentTransactionTypeId": 3,
                            "PaymentTransactionType": 'Refund'

                        }

                        console.log(JSON.stringify(params));


                        eHnoteInsuranceService.AddUpdatePatientDepositRefund(params).then(function (resp) {
                            if (resp.data.Status == "Success") {
                                $uibModalInstance.close("cancel");
                            }

                        }, function (err) {

                        });
                    }


                    $scope.navtoNMIPatientRefund = function (item) {
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
                        $scope.RefundPaymentObj.Remarks = $scope.RefundPaymentObj.Remarks || "";
                        if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                            alertify.error("Please enter Refund remarks.");
                            return false;
                        }

                        $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                        $scope.mainNMITransactionObj.NMITransactionId = 0;
                        $scope.mainNMITransactionObj.UserId = $scope.UserId;
                        $scope.mainNMITransactionObj.PatientId = $scope.mainobj.PatientId;
                        $scope.mainNMITransactionObj.OrganizationId = $scope.mainobj.OrganizationId;
                        /* $scope.mainNMITransactionObj.PaymentAmount = $scope.mainobj.PatientDepositPaymodeList[0].DepositAmount;*/
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
                        $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentType || "";
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

                                $scope.PatientRefund();
                            }
                        })

                    };

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }

            });

            mInstanceAdd.result.then(function () {

                $scope.getPatientDepositAmountById();

            }, function () { });
        }

        $scope.VoidPatientDeposit = function (item, sitem) {

            var mInstanceAdd = $uibModal.open({
                "templateUrl": "VoidReasonPopUp.html",
                "size": "sm",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": " ",
                "resolve": {
                    "item": function () { return item; },
                    "UserId": function () { return $scope.UserId; },
                    "HospitalId": function () { return $scope.HospitalId; },
                    "sitem": function () { return sitem; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, item, UserId, HospitalId, sitem) {
                    item = item || '';

                    console.log(JSON.stringify(item));
                    $scope.uibclose = function () {
                        $uibModalInstance.close("cancel");
                    }
                    $scope.mainNMITransactionid = "";
                    if (sitem.NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = sitem.OnlineTransactionNumber || "";
                    }


                    //$scope.getVoidPatientObj = function () {
                    //    var Obj = {
                    //        "VoidRemarks": ''
                    //    }
                    //    return Obj;
                    //}

                    $scope.VoidPatientObj = {
                        "VoidRemarks": '',
                    }

                    $scope.SaveVoidDepositData = function () {
                        $scope.SavePatientVoidDeposit(item, sitem);
                    }

                    //$scope.SavePatientVoidDeposit = function (item) {

                    //    if ($scope.VoidPatientObj.VoidRemarks == '') {
                    //        alertify.error("Please enter Remarks.");
                    //        return false;
                    //    }

                    //    var ConvertedDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
                    //    var PaymentDate = $filter("usdateFormatter")(item.PaymentDate, "-");

                    //    var obj = {
                    //        "UserId": UserId,
                    //        "OrganizationId": HospitalId,
                    //        "PatientDepositId": item.PatientDepositId || 0,
                    //        "PatientId": item.PatientId || 0,
                    //        "ReceiptNo": "",
                    //        "ReceiptId": 0,
                    //        "DepositDate": ConvertedDate,
                    //        "PaymentDate": PaymentDate,
                    //        "DepositAmount": sitem.DepositAmount || null,// item.DepositAmount || 0,
                    //        /*"DepositedByUserId": $scope.PatientDepositsObj.DepositedByUserId,*/
                    //        "DepositedBy": item.DepositedBy,
                    //        "UnBilledAmount": item.UnBilledAmount,
                    //        "BilledAmount": 0,
                    //        "DeleteInd": "N",
                    //        "AppointmentId": item.AppointmentID,
                    //        "BillingProviderId": item.BillingProviderId,
                    //        "DepositTypeId": item.DepositTypeId,
                    //        "DepositType": item.DepositTypeName,
                    //        "PaymentMethodId": item.PaymentMethodId,
                    //        "PaymentMethodName": item.PaymentMethodName,
                    //        /* "ChequeNumber": $scope.PatientDepositsObj.ChequeNumber,*/
                    //        "CardNumber": "",
                    //        /* "OnlineTransactionNumber": $scope.PatientDepositsObj.OnlineTransactionNumber || '',*/
                    //        "CardName": "",
                    //        "CardExpiry": "",
                    //        "Notes": item.Notes,
                    //        "BatchNumber": item.BatchNumber,
                    //        "OrganizationFacilityId": item.OrganizationFacilityId,
                    //        "FacilityName": item.FacilityName,
                    //        "DepositStatusId": 2,
                    //        "DepositStatus": "Void Deposit",
                    //        "PageSize": 10,
                    //        "PageNumber": 1,
                    //        "PatientDepositPaymodeList": item.PatientDepositPaymodeList || [],
                    //        "VoidRemarks": $scope.VoidPatientObj.VoidRemarks || '',
                    //        "PatientDepositPaymodeListId": sitem.PatientDepositPaymodeListId,
                    //        "PaymentTransactionTypeId": 4,
                    //        "PaymentTransactionType ": 'Void'
                    //    }

                    //    eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
                    //        if (resp.data.Status == "Success") {
                    //        }
                    //        $scope.uibclose();
                    //    }, function (err) {

                    //    });
                    //}


                    $scope.SavePatientVoidDeposit = function (item, sitem) {
                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }

                        var Obj = {
                            "OrganizationId": HospitalId,
                            "TransactionId": 0,
                            "UpdateTransactionId": sitem.TransReciptNo,
                            "PatientDepositId": item.PatientDepositId || 0,
                            "Amount": sitem.TransactionAmount || 0,
                            "PaymentTransactionTypeId": 4,
                            "PaymentTransactionType": 'Void',
                            "TransactionDate": $filter("date")(sitem.TransactionDate, "MM-dd-yyyy") || "",
                            "NMITransactionId": sitem.NMITransactionId,
                            "PatientDepositPaymodeListId": sitem.PatientDepositPaymodeListId,
                            "EOBId": 0,
                            "UserId": UserId,
                            "VoidRemarks": $scope.VoidPatientObj.VoidRemarks,
                        }

                        eHnoteInsuranceService.AddUpdatePatientDepositVoid(Obj).then(function (resp) {
                            if (resp.data.Status == "Success") {
                            }
                            $scope.uibclose();
                        }, function (err) {

                        });


                    }

                    $scope.SaveOnlineVoidDeposit = function () {
                        $scope.navtoVoidOnlinePayment(item);
                    }

                    $scope.navtoVoidOnlinePayment = function (item) {
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
                        $scope.mainNMITransactionObj.PatientId = item.PatientId;
                        $scope.mainNMITransactionObj.OrganizationId = item.OrganizationId;
                        $scope.mainNMITransactionObj.PaymentAmount = sitem.DepositAmount;
                        $scope.mainNMITransactionObj.MerchentId = "";
                        $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
                        $scope.mainNMITransactionObj.CardHolderName = item.PatientFullName || "";
                        $scope.mainNMITransactionObj.PatientEmail = item.PatientEmailId || "";
                        $scope.mainNMITransactionObj.PatientMobile = item.PatientMobile || "";

                        if ($scope.mainNMITransactionObj.PatientMobile != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                            $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                        }

                        $scope.mainNMITransactionObj.PatientMrNo = item.PatientDisplayId || "";
                        $scope.mainNMITransactionObj.OrderId = "";
                        $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
                        $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                        $scope.mainNMITransactionObj.BillPaymentTypeId = sitem.BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = sitem.BillPaymentType || "";
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = 4;
                        $scope.mainNMITransactionObj.TransactionType = "void";
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = "void";
                        $scope.mainNMITransactionObj.AppointmentId = item.AppointmentId || 0;
                        $scope.mainNMITransactionObj.VisitId = item.VisitId || 0;


                        eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
                            console.log(resp.data);

                            var res = resp.data || {};
                            if (res.Status == "Success") {
                                alertify.success(res.responseText);

                                $scope.SavePatientVoidDeposit(item);
                            }
                        })

                    };
                }
            });

            mInstanceAdd.result.then(function () {

                $scope.getPatientDepositAmountById();
                $scope.ViewDepositScreen = false;
                $scope.ClearPatientDeposit();
                $scope.GetPatientVoidDepositList();

            }, function () { });
        }

        $scope.RefundPatientDeposit = function (item, sitem) {

            var obj = {
                "AllCardTypes": $scope.AllCardTypes || [],
                "Masterrefundreasons": $scope.Masterrefundreasons || [],
                "AllUsersList": $scope.AllHospitalData.AllUsersList || [],
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "RefundDepositpopup.html",
                "backdrop": "static",
                "size": "lg",
                "keyboard": false,
                "windowClass": "",
                "resolve": {
                    //"PatientDepositsListArray": function () { return $scope.PatientDepositsListArray; },
                    "mainobj": function () { return item; },
                    "obj": function () { return obj; },
                    "sitem": function () { return sitem; },

                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, mainobj, datapersistanceFactory, obj, eHnoteInsuranceService, sitem) {
                    sitem = sitem || '';
                    $scope.IsRefundDisable = false;
                    $scope.mainNMITransactionid = "";
                    if (sitem.NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = sitem.OnlineTransactionNumber || "";
                    }

                    var mObj = datapersistanceFactory.getItem("masterDataArrays");
                    $scope.masterPaymentModes = [];
                    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                        $scope.masterPaymentModes = mObj.PaymentModes;
                        $scope.filterPaymentModes = function (item) {
                            return ![13, 14].includes(item.PaymentModeId);
                        };
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
                    $scope.mainobj = mainobj;
                    $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                    $scope.AllCardTypes = obj.AllCardTypes || [];
                    $scope.AllUsersList = obj.AllUsersList || [];

                    $scope.GetRefundpaymentObj = function () {
                        var obj = {
                            "UserId": $scope.UserId,
                            "RefundByUser": "",
                            "OrganizationId": $scope.HospitalId,
                            "PatientDepositId": $scope.mainobj.PatientDepositId || null,
                            "RefundDepositId": null,
                            "ReceiptNo": $scope.mainobj.ReceiptNo || "",
                            "ReceiptId": 0,
                            "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "RefundAmount": sitem.TransactionAmount || null, //$scope.mainobj.UnBilledAmount || null,
                            "RefundBy": "",
                            "DeleteInd": "N",
                            "AppointmentId": $scope.mainobj.AppointmentID || null,
                            "PatientId": $scope.mainobj.PatientId || null,
                            "RefundreasonId": null,
                            "Refundreason": null,
                            "Remarks": null,
                            "CardtypeId": null,
                            "Cardtype": "",
                            "RefundPaymentMethodId": null,
                            "RefundPaymentMethod": "",
                            "ReceiptNumber": "",
                            "ReferenceNumber": "",
                            "CardNumber": "",
                            "DepositStatus": "Refund",
                            "DepositStatusId": "3",
                            "Transactions": [],
                            "PaymentTransactionTypeId": 3,
                            "PaymentTransactionType": 'Refund'


                        }

                        return obj;
                    };


                    $scope.init = function () {

                        $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                        var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
                        }
                    }
                    $scope.init();

                    $scope.RefundPaymentObj.RefundPaymentMethodId = sitem.PaymentMethodId;
                    $scope.RefundPaymentObj.RefundPaymentMethod = sitem.PaymentMethodName;

                    if ($scope.RefundPaymentObj.RefundPaymentMethodId == 2 || $scope.RefundPaymentObj.RefundPaymentMethodId == 3) {
                        $scope.RefundPaymentObj.CardNumber = sitem.CardNumber;
                        $scope.RefundPaymentObj.CardtypeId = sitem.CardtypeId;
                        $scope.RefundPaymentObj.Cardtype = sitem.CardType;
                    }

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
                        }
                    }

                    $scope.PatientRefund = function () {


                        let Transactions = [];
                        $scope.RefundPaymentObj.RefundAmount = parseFloat($scope.RefundPaymentObj.RefundAmount) || null;
                        $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;

                        if ($scope.RefundPaymentObj.RefundAmount == null) {
                            alertify.error("Please Enter Refund Amount");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundreasonId == null) {
                            alertify.error("Please Select Refund Reason");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.UnBilledAmount) {
                            alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount != null) {
                            let obj3 = {

                                "UserId": $scope.UserId,
                                "PatientId": $scope.mainobj.PatientId || null,
                                "RefundDepositId": null,
                                "RefundTransactionId": 0,
                                "PatientDepositId": $scope.mainobj.PatientDepositId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                                "TransactionAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                "RefundAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                "TransactionSourceId": 3,
                                "TransactionSource": "Patient",
                                "DeleteInd": "N",

                            }
                            Transactions.push(obj3);
                        }

                        var params = {
                            "UserId": $scope.UserId,
                            "OrganizationId": $scope.HospitalId,
                            "DepositStatus": "Refund",
                            "DepositStatusId": "3",
                            "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,
                            "RefundDepositId": null,
                            "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
                            "RefundDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                            "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
                            "RefundByUserId": $scope.UserId,
                            "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                            "DeleteInd": "N",
                            "AppointmentId": $scope.RefundPaymentObj.AppointmentId || null,
                            "PatientId": $scope.RefundPaymentObj.PatientId || null,
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
                            "Transactions": Transactions || [],
                            "PatientDepositPaymodeListId": sitem.PatientDepositPaymodeListId,
                            "TransactionId": sitem.TransReciptNo,
                            "PaymentTransactionTypeId": 3,
                            "PaymentTransactionType": 'Refund'



                        }

                        console.log(JSON.stringify(params));


                        eHnoteInsuranceService.AddUpdatePatientDepositRefund(params).then(function (resp) {
                            if (resp.data.Status == "Success") {
                                $uibModalInstance.close("cancel");
                            }

                        }, function (err) {

                        });
                    }


                    $scope.navtoNMIPatientRefund = function (item) {
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
                        $scope.mainNMITransactionObj.PaymentAmount = $scope.mainobj.PatientDepositPaymodeList[0].DepositAmount;
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
                        $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentType || "";
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

                                $scope.PatientRefund();
                            }
                        })

                    };

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }

            });

            mInstanceAdd.result.then(function () {

                $scope.getPatientDepositAmountById();
                $scope.ViewDepositScreen = false;
                $scope.ClearPatientDeposit();

            }, function () { });
        }


        $scope.AddPatientDepositPrint = function (item, type) {
            item = item || null;
            type = type || "";
            $scope.PatientDepositDetails = item || null;
            if ($scope.PatientDepositDetails.PatientMobile != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientDepositDetails.PatientMobile);
                $scope.PatientDepositDetails.PatientMobile = obj.UsFormatMobileNumber;
            }

            $scope.DepositTransactionList = [];
            $scope.HospitalAddress = $scope.HospitalAddressArray || null;
            if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
                $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.FaxNumber != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.FaxNumber);
                $scope.HospitalAddress.FaxNumber = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.ContactNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
                $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
            }


            var obj = {
                "PatientId": item.PatientId,
                "OrganizationId": item.OrganizationId,
                "PatientDepositId": item.PatientDepositId

            };

            eHnoteInsuranceService.GetPatientDepositTransactionList(obj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    resp.data.rows = resp.data.rows || [];

                    $scope.DepositTransactionList = resp.data.rows.filter(function (item) {
                        /*return item.PaymentTransactionTypeId == 1 && item.PaymentMethodId !== 15;*/
                        if (resp.data.rows.length > 1) {
                            return item.PaymentTransactionTypeId == 1 && item.PaymentMethodId !== 15;
                        } else {
                            return item.PaymentTransactionTypeId == 1;
                        }
                    });
                    if (type === 'DepositMail') {
                        $timeout(function () {
                            $scope.GetPatientDepositDetailsEmailNew(item, type);
                        }, 1000);
                    }
                } else {
                    alertify.error(resp.data.Message);
                }
            });



            if (type === "Print") {
                $timeout(function () {
                    var innerContents = document.getElementById('PatientEachDeposit_Print').innerHTML;
                    var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    popupWinindow.document.open();
                    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                    popupWinindow.document.close();
                }, 1000);
            }
        };



        $scope.GetPatientDepositsObj = function () {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientDepositId": 0,
                "PatientId": 0,
                "ReceiptNo": "",
                "ReceiptId": "",
                "DepositDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PaymentDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "DepositAmount": "",
                "DepositedByUserId": "",
                "DepositedBy": "",
                "UnBilledAmount": 0.00,
                "BilledAmount": 0.00,
                "DeleteInd": "N",
                "AppointmentId": "",
                "BillingProviderId": "",
                "BillingProviderObj": "",
                "DepositTypeId": 3,
                "DepositTypeName": "General",
                "PaymentMethodId": 1,
                "PaymentMethodName": "cash",
                "ChequeNumber": "",
                "CardNumber": "",
                "OnlineTransactionNumber": "",
                "CardName": "",
                "CardExpiry": "",
                "Notes": "",
                "BatchNumber": "",
                "OrganizationFacilityId": $scope.HospitalId,
                "FacilityName": "",
                "BillingProviderName": "",
                "IsConsent": false,
                "IsDepositPrint": false,
                "IsEmail": false,
                "IsSelectedRadiobtn": false,
                "DepositStatusId": 1,
                "DepositStatus": 'Deposited',
                "PageSize": 100,
                "PageNumber": 1,
                "Count": 0,
                "PatientDepositPaymodeList": [],
            }

            return obj;
        };

        $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());


        $scope.navtoOpenAddDepositAmount = function (type, Incomingfrom, Allocate, item, PaymentEditType) {



            $scope.Patientobj = {
                "PatientId": item.PatientId || null,
                "PatientFullName": item.PatientFullName || "",
                "DOB": item.PatientDOB || "",
                "Sex": item.Gender || "",
                "MobileNo": item.MobileNo || "",
                "EmailId": "",
                "Address1": "",
                "Address2": "",
                "CityName": "",
                "StateName": "",
                "StateCode": "",
                "ZipCode": "",
                "Gender": item.Gender || "",
                "S3URL": item.S3URL || "",
                "PatientDisplayId": item.PatientDisplayId || null,
                "CountryCode": "",
                "AgeInMonths": item.AgeInMonths || "",
                "AgeInYears": item.AgeInYears || "",
            };

            $scope.obj = {
                "PatientId": item.PatientId,
                "ScreenType": type || '',
                "Incomingfrom": Incomingfrom || '',
                "Type": '',
                "UsersList": $scope.AllHospitalData.AllUsersList || [],
                "Patientobj": $scope.Patientobj,
                /* "ClaimDetailsList": $scope.ClaimDetailsList,*/
                //  "OrganizationFacilityList": $scope.OrganizationFacilityList,
                "OrganizationFacilityList": [],
                "DepositTypes": $scope.DepositTypes,
                "WriteOffReasons": $scope.WriteOffReasons,
                "BillingProviderName": item.BillingProviderName || "",
                "FacilityName": "",
                "TotalPatientBalance": item.TotalPatientBalance || 0,
                "AllBranchesList": $scope.AllHospitalData.AllBranchesList || [],
                "HospitalId": $scope.HospitalId || 0,
                "Allocate": Allocate || 0,
                "item": item || '',
                "CardTypesData": $scope.CardTypesData || [],
                "PatientClaimId": item.PatientClaimId || null,
                "PaymentEditType": PaymentEditType || "",
            }

            var modalInstance = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddPatientDepositPopup.html",
                "controller": "UsAddPatientDepositsCtrl",
                "resolve": {
                    "Selectobj": function () { return $scope.obj; },
                },
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1"
                /*"windowClass": "modal__popup--1"*/

            });
            modalInstance.result.then(function () {
                $scope.init();
            }, function () { });
        }


        $scope.AllocatePaymentDeposite = function (item) {
            $scope.navtoOpenAddDepositAmount('', '', 3, item);
        }

        $scope.AddAnotherPaymentMode = function (item, id) {
            $scope.IsPaymentMode = false;
            $scope.ViewDepositScreen = false;
            var obj = $scope.GetPatientDepositsObj();

            obj.PatientDepositId = item.PatientDepositId;
            obj.PatientId = item.PatientId;
            obj.ReceiptId = item.ReceiptId;
            obj.ReceiptNo = item.ReceiptNo;
            obj.DepositDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
            obj.PaymentDate = $filter('date')(item.PaymentDate, "MM-dd-yyyy");
            obj.DepositAmount = 0;
            obj.UnBilledAmount = item.UnBilledAmount;
            obj.BilledAmount = item.BilledAmount;
            obj.Notes = item.Notes;
            obj.DepositedBy = item.DepositedBy;
            obj.DepositedByUserId = $scope.UserId; // Or fetch from item if needed
            obj.OrganizationId = item.OrganizationId;
            obj.OrganizationFacilityId = item.OrganizationFacilityId;
            obj.FacilityName = item.FacilityName;
            obj.BillingProviderId = item.BillingProviderId;
            obj.BillingProviderName = item.BillingProviderName;
            obj.DepositTypeId = item.DepositTypeId;
            obj.DepositTypeName = item.DepositTypeName;
            obj.PaymentMethodId = item.PaymentMethodId;
            obj.PaymentMethodName = item.PaymentMethodName;
            obj.BatchNumber = item.BatchNumber || '';
            obj.AppointmentId = item.AppointmentID;

            obj.IsDepositPrint = item.IsDepositPrint || false;
            obj.DepositStatusId = item.DepositStatusId;
            obj.DepositStatus = item.DepositStatus;



            $scope.PatientDepositsObj = obj;
            console.log($scope.PatientDetails);

            if ($scope.PatientDepositsObj.PatientId === 0) {
                alertify.error("Please Select Patient ");
                return;
            }


            //if ($scope.PatientDepositsObj.OrganizationFacilityId === 0) {
            //    alertify.error("Please select the location ");
            //    return;
            //}


            var Parentobj = {
                "PatientId": $scope.PatientDepositsObj.PatientId,
                "AppointmentId": $scope.PatientDepositsObj.AppointmentId,
                "PatientFirstName": item.PatientFullName,
                "PatientLastName": "",
                "PatientDisplayId": item.PatientDisplayId,
                "PatientEmailId": item.PatientEmailId,
                "PatientGender": item.Gender,
                "PatientAgeInYears": item.AgeInYears,
                "PatientAgeInMonths": item.AgeInMonths,
                "PatientDOB": item.DOB,
                "PatientMobileNumber": item.PatientMobile,
                "PatientZipCode": item.ZipCode,
                "UserId": $scope.UserId,
                "HospitalId": $scope.PatientDepositsObj.OrganizationFacilityId,
                "PaymentAmount": $scope.PatientDepositsObj.DepositAmount,
                "DepositDate": $scope.PatientDepositsObj.DepositDate,
                "PaymentModeId": 1,
                "PaymentMode": "Cash",
                "PaymentTypeId": 1,
                "PaymentType": "Deposit",
                "ScreenType": "AddDeposit",
                "AllCardTypes": $scope.AllCardTypes,
                "BillingProviderId": $scope.PatientDepositsObj.BillingProviderId,
                "IsDepositPrint": $scope.PatientDepositsObj.IsDepositPrint,
                "PatientDataObj": $scope.SelectedPatientDetails.PatientObj || {},
                "PatientDepositsObj": $scope.PatientDepositsObj || {},
                "DepositTypeId": $scope.PatientDepositsObj.DepositTypeId,
                "DepositType": $scope.PatientDepositsObj.DepositTypeName,
                "Notes": $scope.PatientDepositsObj.Notes,
                "PatientClaimId": null,
                "mainBillerDataObj": $scope.AllHospitalData || [],
                "IsPaymentMode": $scope.IsPaymentMode,
                "RenderingProviderId": item.RenderingProviderId || 0,
                "RenderingProviderName": item.RenderingProviderName || "",
                "DepositTypes": $scope.DepositTypes || [],
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
                "windowClass": "modal__sixty--  ",
                "controller": "UsMainNmiPaymentCtrl",
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                if (resp != undefined) {
                    if (resp.Status === "Success") {


                    }
                }

                $scope.getPatientDepositAmountById();

            }, function (cancel) {
            });
        };

        $scope.AddVoidPatientDeposit = function (item, actionType) {

            var templateToUse = (actionType === 'void') ? "VoidReasonPopUp.html" : "DepositCancelPopUp.html";
            var mInstanceAdd = $uibModal.open({
                "templateUrl": templateToUse,
                "size": "sm",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "z-index-nine__one",
                "resolve": {
                    "item": function () { return item; },
                    "UserId": function () { return $scope.UserId; },
                    "HospitalId": function () { return $scope.HospitalId; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, item, UserId, HospitalId) {
                    item = item || '';

                    console.log(JSON.stringify(item));
                    $scope.uibclose = function () {
                        $uibModalInstance.close("cancel");
                    }
                    $scope.mainNMITransactionid = "";
                    if (item.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = item.PatientDepositPaymodeList[0].OnlineTransactionNumber || "";
                    }


                    //$scope.getVoidPatientObj = function () {
                    //    var Obj = {
                    //        "VoidRemarks": ''
                    //    }
                    //    return Obj;
                    //}

                    $scope.VoidPatientObj = {
                        "VoidRemarks": '',
                    }

                    $scope.SaveVoidDepositData = function () {
                        $scope.SavePatientVoidDeposit(item);
                    }

                    $scope.SavePatientVoidDeposit = function (item) {
                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }

                        var Obj = {
                            "OrganizationId": item.OrganizationId,
                            "TransactionId": 0,
                            "UpdateTransactionId": 0,
                            "PatientDepositId": item.PatientDepositId || 0,
                            "Amount": item.DepositAmount || 0,
                            "PaymentTransactionTypeId": (actionType === 'void') ? 4 : 6,
                            "PaymentTransactionType": (actionType === 'void') ? 'Void' : 'Cancel',
                            "TransactionDate": $filter('date')(new Date(), "MM-dd-yyyy") || '',
                            "NMITransactionId": 0,
                            "PatientDepositPaymodeListId": 0,
                            "EOBId": 0,
                            "UserId": UserId,
                            "VoidRemarks": $scope.VoidPatientObj.VoidRemarks,
                            "PatientDepositPaymodeList": item.PatientDepositPaymodeList || [],
                        }

                        eHnoteInsuranceService.AddUpdatePatientDepositVoid(Obj).then(function (resp) {
                            if (resp.data.Status == "Success") {
                                if (item.PatientDepositPaymodeList[0].PaymentProcessTypeId != 3 || item.PatientDepositPaymodeList[0].PaymentProcessTypeId != 1) {
                                    if (actionType == 'void') {
                                        alertify.success('Deposit Void Successfully');
                                    }
                                }
                                if (actionType == 'cancel') {
                                    alertify.success('Deposit Cancel Successfully');
                                }
                            }
                            $scope.uibclose();
                        }, function (err) {

                        });

                    }

                    $scope.SaveOnlineVoidDeposit = function () {
                        $scope.navtoVoidOnlinePayment(item);
                    }

                    $scope.navtoVoidOnlinePayment = function (item) {
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
                        $scope.mainNMITransactionObj.PatientId = item.PatientId;
                        $scope.mainNMITransactionObj.OrganizationId = item.OrganizationId;
                        $scope.mainNMITransactionObj.PaymentAmount = item.PatientDepositPaymodeList[0].DepositAmount;
                        $scope.mainNMITransactionObj.MerchentId = "";
                        $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
                        $scope.mainNMITransactionObj.CardHolderName = item.PatientFullName || "";
                        $scope.mainNMITransactionObj.PatientEmail = item.PatientEmailId || "";
                        $scope.mainNMITransactionObj.PatientMobile = item.PatientMobile || "";

                        if ($scope.mainNMITransactionObj.PatientMobile != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                            $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                        }

                        $scope.mainNMITransactionObj.PatientMrNo = item.PatientDisplayId || "";
                        $scope.mainNMITransactionObj.OrderId = "";
                        $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
                        $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                        $scope.mainNMITransactionObj.BillPaymentTypeId = item.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = item.PatientDepositPaymodeList[0].BillPaymentType || "";
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = (actionType === 'void') ? 4 : 6;
                        $scope.mainNMITransactionObj.TransactionType = (actionType === 'void') ? 'void' : 'cancel';
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = (actionType === 'void') ? 'void' : 'cancel';
                        $scope.mainNMITransactionObj.AppointmentId = item.AppointmentId || 0;
                        $scope.mainNMITransactionObj.VisitId = item.VisitId || 0;


                        eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
                            console.log(resp.data);

                            var res = resp.data || {};
                            if (res.Status == "Success") {
                                alertify.success(res.responseText);

                                $scope.SavePatientVoidDeposit(item);
                            }
                        })

                    };
                }
            });

            mInstanceAdd.result.then(function () {

                $scope.getPatientDepositAmountById();

            }, function () { });
        }
        $scope.GetAllPatientsRefundTransactions = function (pageno, type) {
            $scope.PatientsRefundTransactions = [];
            $scope.PaymentsListObj.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;
            var obj = {
                "TransactionFrom": $scope.PaymentsListObj.TransactionFromDate || "",
                "TransactionTo": $scope.PaymentsListObj.TransactionToDate || "",
                "PatientId": $scope.PaymentsListObj.PatientId,
                "OrganizationId": $scope.PaymentsListObj.OrganizationId,
                "PaymentModeId": $scope.PaymentsListObj.PaymentMethodIds,
                "PageSize": $scope.PaymentsListObj.PageSize,
                "PageNumber": $scope.PaymentsListObj.PageNumber,
                "TransactionNumber": $scope.PaymentsListObj.TransactionNumber,

            };

            if (obj.TransactionFrom != "") {
                obj.TransactionFrom = $filter("usdateFormatter")(obj.TransactionFrom, "-");
            }
            if (obj.TransactionTo != "") {
                obj.TransactionTo = $filter("usdateFormatter")(obj.TransactionTo, "-");
            }


            eHnoteInsuranceService.GetAllPatientsRefundTransactions(obj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.PatientsRefundTransactions = resp.data.rows;

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }
        $scope.GetAllPatientsVoidTransactions = function (pageno, type) {
            $scope.PatientsVoidTransactions = [];
            $scope.PaymentsListObj.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;
            var obj = {
                "TransactionFrom": $scope.PaymentsListObj.TransactionFromDate || "",
                "TransactionTo": $scope.PaymentsListObj.TransactionToDate || "",
                "PatientId": $scope.PaymentsListObj.PatientId,
                "OrganizationId": $scope.PaymentsListObj.OrganizationId,
                "PaymentModeId": $scope.PaymentsListObj.PaymentMethodIds,
                "PageSize": $scope.PaymentsListObj.PageSize,
                "PageNumber": $scope.PaymentsListObj.PageNumber,
                "TransactionNumber": $scope.PaymentsListObj.TransactionNumber,

            };

            if (obj.TransactionFrom != "") {
                obj.TransactionFrom = $filter("usdateFormatter")(obj.TransactionFrom, "-");
            }
            if (obj.TransactionTo != "") {
                obj.TransactionTo = $filter("usdateFormatter")(obj.TransactionTo, "-");
            }


            eHnoteInsuranceService.GetAllPatientsVoidTransactions(obj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.PatientsVoidTransactions = resp.data.rows;

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }
        $scope.ResetRefund = function () {
            $scope.PaymentsListObj = $scope.GetPaymentFilterObj();
            $scope.count = 0;
            $scope.AllPatientList = [];
            $scope.PatientSearchdata.SearchText = "";
            $scope.GetAllPatientsRefundTransactions();
        }
        $scope.ResetVoid = function () {
            $scope.PaymentsListObj = $scope.GetPaymentFilterObj();
            $scope.count = 0;
            $scope.AllPatientList = [];
            $scope.PatientSearchdata.SearchText = "";
            $scope.GetAllPatientsVoidTransactions();
        }
        $scope.showPaymentslist = function (item) {
            angular.forEach($scope.PatientPaymentsListArray, function (sitem) {
                if (sitem !== item) {
                    sitem.Isshow = false;
                }
            });
            item.Isshow = !item.Isshow;
            if (!item.Isshow) return;
        }


        $scope.GetOrganizationPOSInvoices = function (item, sitem, val) {
            $scope.POSInvoicesCount = null;
            $scope.POSPaymentListCount = null;
            $scope.POSInvoiceslist = [];
            item = item || '';
            sitem = sitem || '';
            val = val || '';

            let param = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": 100,
                "PageNumber": 1,
                "InvoiceNumber": sitem.InvoiceNumber || "",
                "PatientId": item.PatientId || "",
                "SoldByUserId": "",
                "FromDate": "",
                "ToDate": "",
                "PaymentStatusId": "",
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

                    $scope.navtoPointOfSalePopup($scope.POSInvoiceslist[0], val);


                }
            }, function (err) { console.log(err); });

        }

        $scope.navtoPointOfSalePopup = function (item, EditId) {
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
                "windowClass": "modal__popup--1 in",
            });

            mInstanceAdd.result.then(function (resp) {

            }, function () { });
        }


        $scope.OpenPatientPaymentPrint = function (item) {
            item = item || null;

            $scope.PatientPaymentList = null;
            $scope.PatientPaymentList = item || null;

            $scope.PatientPaymentList.TotalPatientBalanceAmount = 0;

            angular.forEach($scope.PatientPaymentList.EOBClaimInfo, function (item) {
                angular.forEach(item.EOBClaimLineItems, function (pitem) {
                    $scope.PatientPaymentList.TotalPatientBalanceAmount += pitem.PatientBalance;
                })
            })
            if ($scope.PatientPaymentList.MobileNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientPaymentList.MobileNo);
                $scope.PatientPaymentList.MobileNo = obj.UsFormatMobileNumber;
            }


            if ($scope.mainBillerDataObj.AllBranchesList.length > 0) {
                var filtredArray = $filter("filter")($scope.mainBillerDataObj.AllBranchesList, { "BranchId": item.OrganizationId }, true) || [];
                if (filtredArray.length > 0) {
                    $scope.OrganizationAddressdata = null;
                    $scope.OrganizationAddressdata = filtredArray[0]
                    if ($scope.OrganizationAddressdata.FaxNumber != "") {
                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.OrganizationAddressdata.FaxNumber);
                        $scope.OrganizationAddressdata.FaxNumber = obj.UsFormatMobileNumber;
                    }
                }
            }

            $scope.HospitalAddress = $scope.HospitalAddressArray || null;
            if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
                $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.FaxNumber != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.FaxNumber);
                $scope.HospitalAddress.FaxNumber = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.ContactNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
                $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
            }


            $timeout(function () {
                var innerContents = document.getElementById('PatientPayment_Print').innerHTML;
                var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);
        };
        $scope.GetAllPatientsTransactions = function (pageno, type) {
            $scope.PatientsTransactions = [];
            $scope.PaymentsListObj.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;
            var obj = {
                "TransactionFrom": $scope.PaymentsListObj.TransactionFromDate || "",
                "TransactionTo": $scope.PaymentsListObj.TransactionToDate || "",
                "PatientId": $scope.PaymentsListObj.PatientId,
                "OrganizationId": $scope.PaymentsListObj.OrganizationId,
                "PaymentModeId": $scope.PaymentsListObj.PaymentMethodIds,
                "PageSize": $scope.PaymentsListObj.PageSize,
                "PageNumber": $scope.PaymentsListObj.PageNumber,
                "TransactionNumber": $scope.PaymentsListObj.TransactionNumber,
                "PaymentStatus": $scope.PaymentsListObj.PaymentStatusIds,
                /* "TransactionSource": $scope.PaymentsListObj.TransactionSourceIds,*/

            };

            if (obj.TransactionFrom != "") {
                obj.TransactionFrom = $filter("usdateFormatter")(obj.TransactionFrom, "-");
            }
            if (obj.TransactionTo != "") {
                obj.TransactionTo = $filter("usdateFormatter")(obj.TransactionTo, "-");
            }


            eHnoteInsuranceService.GetAllPatientsTransactions(obj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.PatientsTransactions = resp.data.rows;

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }
        $scope.ResetTransactions = function () {
            $scope.PaymentsListObj = $scope.GetPaymentFilterObj();
            $scope.count = 0;
            $scope.AllPatientList = [];
            $scope.PatientSearchdata.SearchText = "";
            $scope.GetAllPatientsTransactions();
        }
        $scope.CheckAllPaymentStatus = function (val) {
            $scope.PaymentsListObj.PaymentStatusIds = 0;
            if (val) {
                angular.forEach($scope.MasterPaymentTransactionTypes, function (item) {
                    item.IsChecked = true;
                });

                $scope.PaymentsListObj.PaymentStatusIds = $scope.MasterPaymentTransactionTypes.map(function (status) {
                    return status.PaymentTransactionTypeId;
                }).join(',');

                $scope.TransactionStatusTypeObj.SelectStatusString = 'All';
            }
            else {
                angular.forEach($scope.MasterPaymentTransactionTypes, function (item) {
                    item.IsChecked = false;
                });

                $scope.PaymentsListObj.PaymentStatusIds = $scope.MasterPaymentTransactionTypes.map(function (status) {
                    return status.PaymentTransactionTypeId;
                }).join(',');

                $scope.TransactionStatusTypeObj.SelectStatusString = 'Select Status';
            }
        };

        $scope.PaymentStatusToggle = function () {

            var checkedArray = _.where($scope.MasterPaymentTransactionTypes, { IsChecked: true });
            $scope.TransactionStatusTypeObj.AllStatusCheck = checkedArray.length > 0 && $scope.MasterPaymentTransactionTypes.length === checkedArray.length ? true : false;
            if ($scope.TransactionStatusTypeObj.AllStatusCheck) {
                $scope.TransactionStatusTypeObj.SelectStatusString = 'All';
            }

            $scope.PaymentsListObj.PaymentStatusIds = checkedArray.map(function (status) {
                return status.PaymentTransactionTypeId;
            }).join(',');

            if (!$scope.TransactionStatusTypeObj.AllStatusCheck && checkedArray.length > 0) {
                $scope.TransactionStatusTypeObj.SelectStatusString = 'Selected';
            }
        };



        $scope.geteachtransactionprint = function () {
            var Obj = {
                "TransactionDate": '',
                "TransReciptNo": '',
                "PaymentMethodName": '',
                "CardNumber": '',
                "OnlineTransactionNumber": '',
                "CardType": '',
                "TransactionAmount": 0,
                "ReceiptNumber": '',
                "PatientFullName": '',
                "PatientDisplayId": '',
                "CityTown": '',
                "State": '',
                "Country": '',
                "FaxNumber": '',
                "OrganizationName": '',
                "ClaimNumbers": '',
                "ClaimData": [],
            }
            return Obj;
        }
        $scope.DepositTransactionObj = angular.copy($scope.geteachtransactionprint());

        $scope.AddIndPrinttransactionPopUp = function (item, sitem) {
            item = item || null;
            sitem = sitem || null;
            $scope.TransactionReceiptText = sitem.PaymentTransactionTypeId == 3 ? "Refund Transaction Receipt" : "Deposit Transaction Receipt";

            $scope.DepositList = item || '';
            $scope.DepositTransactionObj.TransactionDate = sitem.TransactionDate || '';
            $scope.DepositTransactionObj.TransactionTime = sitem.TransactionTime || '';
            $scope.DepositTransactionObj.TransReciptNo = sitem.TransReciptNo || '';
            $scope.DepositTransactionObj.PaymentMethodName = sitem.PaymentMethodName || '';
            $scope.DepositTransactionObj.CardNumber = sitem.CardNumber || '';
            $scope.DepositTransactionObj.CardType = sitem.CardType || '';
            $scope.DepositTransactionObj.OnlineTransactionNumber = sitem.OnlineTransactionNumber || '';
            $scope.DepositTransactionObj.TransactionAmount = sitem.TransactionAmount || '';
            $scope.DepositTransactionObj.ReceiptNumber = item.ReceiptNo || '';
            $scope.DepositTransactionObj.OrganizationName = sitem.OrganizationName || '';

            var filtredArray = $filter("filter")($scope.mainBillerDataObj.AllBranchesList, { "BranchId": sitem.OrganizationId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.DepositTransactionObj.CityTown = filtredArray[0].CityTown;
                $scope.DepositTransactionObj.State = filtredArray[0].State;
                $scope.DepositTransactionObj.Country = filtredArray[0].Country;
                $scope.DepositTransactionObj.FaxNumber = filtredArray[0].FaxNumber || "";
                if ($scope.DepositTransactionObj.FaxNumber != "") {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.DepositTransactionObj.FaxNumber);
                    $scope.DepositTransactionObj.FaxNumber = obj.UsFormatMobileNumber;
                }
            }

            $scope.HospitalAddress = $scope.HospitalAddressArray || null;
            if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
                $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.FaxNumber != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.FaxNumber);
                $scope.HospitalAddress.FaxNumber = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.ContactNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
                $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
            }
            $scope.Depositprintpopup();
        };

        $scope.Depositprintpopup = function () {

            $timeout(function () {
                var innerContents = document.getElementById('PrintIndtransPopupNew').innerHTML;
                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);
        }

        $scope.AddPatientPaymentTransDeposit = function (item, sitem) {
            item = item || null;
            sitem = sitem || null;

            $scope.DepositList = item || '';
            $scope.DepositTransactionObj.TransactionDate = sitem.TransactionDate || '';
            $scope.DepositTransactionObj.TransactionTime = sitem.TransactionTime || '';
            $scope.DepositTransactionObj.TransReciptNo = sitem.TransReciptNo || '';
            $scope.DepositTransactionObj.PaymentMethodName = sitem.PaymentMethodName || '';
            $scope.DepositTransactionObj.CardNumber = sitem.CardNumber || '';
            $scope.DepositTransactionObj.CardType = sitem.CardType || '';
            $scope.DepositTransactionObj.OnlineTransactionNumber = sitem.OnlineTransactionNumber || '';
            $scope.DepositTransactionObj.InvoiceNumber = sitem.InvoiceNumber || '';
            $scope.DepositTransactionObj.TransactionAmount = sitem.TransactionAmount || '';
            $scope.DepositTransactionObj.PatientClaimNumber = sitem.PatientClaimNumber || '';
            $scope.DepositTransactionObj.ReceiptNumber = item.ReceiptNo || '';
            $scope.DepositTransactionObj.OrganizationName = sitem.OrganizationName || '';
            $scope.DepositTransactionObj.ClaimData = sitem.ClaimData || '';

            $scope.DepositTransactionObj.ClaimNumbers =
                $scope.DepositTransactionObj.ClaimData
                    .map(citem => citem.PatientClaimNumber)
                    .join(",");






            var filtredArray = $filter("filter")($scope.mainBillerDataObj.AllBranchesList, { "BranchId": sitem.OrganizationId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.DepositTransactionObj.CityTown = filtredArray[0].CityTown;
                $scope.DepositTransactionObj.State = filtredArray[0].State;
                $scope.DepositTransactionObj.Country = filtredArray[0].Country;
                $scope.DepositTransactionObj.FaxNumber = filtredArray[0].FaxNumber || "";
                if ($scope.DepositTransactionObj.FaxNumber != "") {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.DepositTransactionObj.FaxNumber);
                    $scope.DepositTransactionObj.FaxNumber = obj.UsFormatMobileNumber;
                }
            }

            $scope.DepositTransactionObj.OrganizationName = sitem.OrganizationName || '';

            var filtredArray = $filter("filter")($scope.mainBillerDataObj.AllBranchesList, { "BranchId": sitem.OrganizationId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.DepositTransactionObj.CityTown = filtredArray[0].CityTown;
                $scope.DepositTransactionObj.State = filtredArray[0].State;
                $scope.DepositTransactionObj.Country = filtredArray[0].Country;
                $scope.DepositTransactionObj.FaxNumber = filtredArray[0].FaxNumber || "";
                if ($scope.DepositTransactionObj.FaxNumber != "") {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.DepositTransactionObj.FaxNumber);
                    $scope.DepositTransactionObj.FaxNumber = obj.UsFormatMobileNumber;
                }
            }

            $scope.HospitalAddress = $scope.HospitalAddressArray || null;
            if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
                $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.FaxNumber != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.FaxNumber);
                $scope.HospitalAddress.FaxNumber = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.ContactNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
                $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
            }
            $scope.DepositPaymentprintpopup();
        };

        $scope.DepositPaymentprintpopup = function () {

            $timeout(function () {
                var innerContents = document.getElementById('PatientPaymentEachTrans_Print').innerHTML;
                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);
        }

        $scope.LocationTypeObj = {
            "SelectLocationString": "All Locations",
            "Name": "",
            "AllLocationCheck": true
        };

        $scope.stopClosingDropDown = function ($event) {
            $event.stopPropagation();
        };

        $scope.ChangeApptBranch = function (item, typeId) {

            $scope.PaymentsListObj.SelectedHospitalId = item.ClinicId || 0;
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

        $scope.GetPatientDepositEmail = function (item, type) {

            item.PatientEmailId = item.PatientEmailId || "";
            if (!item.PatientEmailId) {
                alertify.error("There is no email for this patient");
                return false;
            }

            const clinicname = item.OrganizationName || "";
            const doctorname = item.CreatedBy;
            var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.ContactNo);
            $scope.HospitalAddressArray.ContactNo = obj1.UsFormatMobileNumber;

            var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.MobileNo);
            $scope.HospitalAddressArray.MobileNo = obj2.UsFormatMobileNumber;
            const branchAddress = ($scope.HospitalAddressArray.Address1 || "") + ", " + ($scope.HospitalAddressArray.Address2 || "") + ", " + ($scope.HospitalAddressArray.CityName || "") + ", " + ($scope.HospitalAddressArray.StateName || "") + ", " + ($scope.HospitalAddressArray.CountryName || "") + ", " + ($scope.HospitalAddressArray.PinCode || "");

            const obj = {
                "htmlContent": $scope.htmlContent,
                "PatientId": item.PatientId,
                "OrganizationId": $scope.HospitalId,
                "PatientEmail": item.PatientEmailId || "",
                "ClinicName": clinicname || "",
                "DoctorName": doctorname || "",
                "BranchAddress": branchAddress || "",
                "PatientFullName": item.PatientFullName || "",
                "BranchContactNo": $scope.HospitalAddressArray.ContactNo || "",
                "BranchMobileNo": $scope.HospitalAddressArray.MobileNo || "",
                "IsFrom": type || "",
                "HospitalAddressArray": $scope.HospitalAddressArray || {}
            };

            eHnoteInsuranceService.GenerateLedgerUrl(obj).then(resp => {
                if (resp.data === "Success") {
                    alertify.success("Email Sent Successfully");
                }
            });
        };

        $scope.GetPatientDepositDetailsEmailNew = function (item, type) {

            $scope.htmlContent = document.getElementById('PatientEachDeposit_Print').innerHTML;
            $scope.GetPatientDepositEmail(item, type);
        };


        var currentDate = new Date();
        var NMITransactionFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        $scope.GetNMITransactionObj = function () {
            var obj = {
                "PatientId": 0,
                "UserId": $scope.UserId,
                "PaymentMethodId": 0,
                "PageSize": 100,
                "PageNumber": 1,
                "OrganizationId": $scope.HospitalId,
                "BillPaymentTypeId": 1,
                "TransmissionMethodId": 0,
                "PaymentTypeId": 0,
                "TransactionFromDate": formatDate(NMITransactionFromDate),
                "TransactionToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "OnlineTransactionNumber": "",
                "PaymentStatusId": 0,
                "PaymentStatus": "",
                "TransactionSourceIds": 0,
                "SelectedHospitalId": 0,
                "Count": 0,
            }
            return obj;
        }

        $scope.OrgNMITransactionListObj = $scope.GetNMITransactionObj();

        $scope.masterPaymentTypes = [
            {
                "PaymentTypeId": 1,
                "PaymentType": "Deposit"
            },
            {
                "PaymentTypeId": 2,
                "PaymentType": "Payment"
            },
            {
                "PaymentTypeId": 3,
                "PaymentType": "PointOfSale"
            }
        ];

        $scope.masterPaymentProcessingTypes = [
            {
                "PaymentProcessTypeId": 1,
                "PaymentProcessType": "Device(EMV)",
            },
            //{
            //    "PaymentProcessTypeId": 2,
            //    "PaymentProcessType": "Swipe",
            //},
            {
                "PaymentProcessTypeId": 3,
                "PaymentProcessType": "Payment Page"
            },
            //{
            //    "PaymentProcessTypeId": 4,
            //    "PaymentProcessType": "Without Gateway"
            //}
        ];


        $scope.PaymentStatusArray = [
            {
                "PaymentStatusId": 1,
                "PaymentStatus": "Approved",
            },
            {
                "PaymentStatusId": 2,
                "PaymentStatus": "Error",
            },
            {
                "PaymentStatusId": 3,
                "PaymentStatus": "Declined"
            },
            {
                "PaymentStatusId": 4,
                "PaymentStatus": "Failed"
            },
            {
                "PaymentStatusId": 5,
                "PaymentStatus": "Voided"
            },
            {
                "PaymentStatusId": 6,
                "PaymentStatus": "Refunded"
            },

        ];


        $scope.ChangePaymentType = function (Id) {
            if (Id == 1) {
                $scope.OrgNMITransactionListObj.PaymentTypeId = Id;
                $scope.OrgNMITransactionListObj.PaymentType = "Deposit";
            } else if (Id == 2) {
                $scope.OrgNMITransactionListObj.PaymentTypeId = Id;
                $scope.OrgNMITransactionListObj.PaymentType = "Payment";
            } else if (Id == 2) {
                $scope.OrgNMITransactionListObj.PaymentTypeId = Id;
                $scope.OrgNMITransactionListObj.PaymentType = "PointOfSale";
            } else {
                $scope.OrgNMITransactionListObj.PaymentTypeId = Id;
                $scope.OrgNMITransactionListObj.PaymentType = "All";
            }
        }

        $scope.changePaymentProcessingType = function (id) {
            if (id === 3) {
                $scope.OrgNMITransactionListObj.PaymentProcessTypeId = id;
                $scope.OrgNMITransactionListObj.PaymentProcessType = "Payment Page";
            } else if (id == 1) {
                $scope.OrgNMITransactionListObj.PaymentProcessTypeId = id;
                $scope.OrgNMITransactionListObj.PaymentProcessType = "Device(EMV)";
            } else {
                $scope.OrgNMITransactionListObj.PaymentProcessTypeId = id;
                $scope.OrgNMITransactionListObj.PaymentProcessType = "All";
            }
        };
        $scope.changePaymentStatus = function (id) {
            if (id === 1) {
                $scope.OrgNMITransactionListObj.PaymentStatusId = id;
                $scope.OrgNMITransactionListObj.PaymentStatus = "Approved";
            } else if (id == 2) {
                $scope.OrgNMITransactionListObj.PaymentStatusId = id;
                $scope.OrgNMITransactionListObj.PaymentStatus = "Error";
            } else if (id == 3) {
                $scope.OrgNMITransactionListObj.PaymentStatusId = id;
                $scope.OrgNMITransactionListObj.PaymentStatus = "Declined";
            } else if (id == 4) {
                $scope.OrgNMITransactionListObj.PaymentStatusId = id;
                $scope.OrgNMITransactionListObj.PaymentStatus = "Failed";
            } else if (id == 5) {
                $scope.OrgNMITransactionListObj.PaymentStatusId = id;
                $scope.OrgNMITransactionListObj.PaymentStatus = "Voided";
            } else if (id == 6) {
                $scope.OrgNMITransactionListObj.PaymentStatusId = id;
                $scope.OrgNMITransactionListObj.PaymentStatus = "Refunded";
            } else {
                $scope.OrgNMITransactionListObj.PaymentStatusId = 0;
                $scope.OrgNMITransactionListObj.PaymentStatus = "";
            }
        };

        $scope.GetOrgNMITransactionList = function (pageno) {

            $scope.OrgNMITransactionListObj.PageNumber = pageno || 1;
            $scope.NMITransactionsListArray = [];

            var Locationids = $scope.mainBillerDataObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0) // Exclude ClinicId === 0
                .map(pitem => pitem.ClinicId)
                .join(",");


            var Obj = {
                "PatientId": $scope.OrgNMITransactionListObj.PatientId,
                "LocationIds": Locationids,
                "FromDate": $scope.OrgNMITransactionListObj.TransactionFromDate || "",
                "ToDate": $scope.OrgNMITransactionListObj.TransactionToDate || "",
                "PageSize": $scope.OrgNMITransactionListObj.PageSize,
                "PageNumber": $scope.OrgNMITransactionListObj.PageNumber,
                "PaymentStatus": $scope.OrgNMITransactionListObj.PaymentStatus || "",
                "PaymentModeId": $scope.OrgNMITransactionListObj.PaymentModeId || 0,
                "PaymentProcessTypeId": $scope.OrgNMITransactionListObj.PaymentProcessTypeId || 0,
                "OnlineTransactionNumber": $scope.OrgNMITransactionListObj.OnlineTransactionNumber || "",
                "BillPaymentTypeId": $scope.OrgNMITransactionListObj.PaymentTypeId || 0,
            }

            eHnoteInsuranceService.GetOrganizationNMItransactionsList(Obj).then(function (resp) {

                if (resp.data.Status == 'Success') {
                    $scope.NMITransactionsListArray = resp.data.rows || [];
                    $scope.OrgNMITransactionListObj.Count = resp.data.count || 0;

                    angular.forEach($scope.NMITransactionsListArray, function (item) {
                        item.Transactiondate = $filter('date')(new Date(item.Transactiondate), "MM-dd-yyyy") || null;
                    });

                }

            });
        }


        $scope.ResetGetOrgNMITransactionList = function () {
            $scope.OrgNMITransactionListObj = $scope.GetNMITransactionObj();
            $scope.clearPatientSearchData();
            $scope.GetOrgNMITransactionList(1);
        }

        $scope.isDepositToday = function (DepositDate) {
            var DepositDateStr = $filter('date')(DepositDate, "MM-dd-yyyy");
            var todayStr = $filter('date')(new Date(), "MM-dd-yyyy");
            return DepositDateStr === todayStr;
        };

        $scope.isDepositCancelToday = function (date) {
            var DepositDateStr = $filter('date')(date, "MM-dd-yyyy");
            var todayStr = $filter('date')(new Date(), "MM-dd-yyyy");
            return DepositDateStr != todayStr;
        };

        var ReportcurrentDate = new Date();
        var ReportPaymentFromDate = new Date(ReportcurrentDate.getFullYear(), ReportcurrentDate.getMonth(), 1);
        function PaymentFromDate(date) {
            var mm = (date.getMonth() + 1).toString().padStart(2, '0');
            var dd = date.getDate().toString().padStart(2, '0');
            var yyyy = date.getFullYear();
            return mm + '-' + dd + '-' + yyyy;
        }

        $scope.PatientPaymentsReportsObj = {
            "UserId": $scope.UserId || null,
            "UserName": "",
            "PaymentMethodId": null,
            "PaymentMethodName": "",
            "UserFullName": "",
            "PaymentFromDate": PaymentFromDate(ReportPaymentFromDate),
            "PaymentToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "RecieptFromDate": "",
            "RecieptToDate": "",
            "PaymentTo": null,
            "SelectPaymentStatusString": "Select",
            "SelectUserStatusString": "Select",
            "SelectLocationString": "Select",
            "LocationName": "",
            "AllStatusCheck": false,
            "AllUserStatusCheck": false,
            "AllLocationStatusCheck": false,
            "masterPaymentModes": [],
            "ReportUsersList": [],
            "AllUsersList": $scope.AllHospitalData.AllUsersList || [],
            "AllMasterPaymentsMethods": $scope.masterPaymentModes || [],
            "AllBranchesList": [],
            "AllMasterBranchesList": $scope.mainBillerDataObj.AllBranchesList || [],
            "BillingProviderList": $scope.BillingProviderList || [],
            "SelectBillingProviderString": "All",
            "BillingProviderName": "",
            "AllBillingProviderStatusCheck": true,
            "AllDoctorCheck": true,
            "PatientPayFromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "PatientPayToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ServiceFromDate":"",
            "ServiceToDate": "",
            "PaymentDateRangeId":1,
            "ServiceDateRangeId":0,
        };

        if ($scope.PatientPaymentsReportsObj.AllUsersList.length > 0) {
            $scope.PatientPaymentsReportsObj.ReportUsersList = angular.copy($scope.PatientPaymentsReportsObj.AllUsersList);
            angular.forEach($scope.PatientPaymentsReportsObj.ReportUsersList, function (item) {
                item.IsChecked = true;
            });
            $scope.PatientPaymentsReportsObj.SelectUserStatusString = "Selected";
            $scope.PatientPaymentsReportsObj.AllUserStatusCheck = true;
            //$scope.PatientPaymentsReportsObj.ReportUsersList = $scope.PatientPaymentsReportsObj.AllUsersList.filter((x) => x.RoleId == 43 || x.RoleId == 1 || x.RoleId == 19 || x.RoleId == 2 || x.RoleId == 58 || x.RoleId == 62 || x.RoleId == 63 || x.RoleId == 64 || x.RoleId == 65 || x.RoleId == 66 || x.RoleId == 67 || x.RoleId == 68 || x.RoleId == 69 || x.RoleId == 71 || x.RoleId == 10 || x.RoleId == 28 || x.RoleId == 29 || x.RoleId == 38 || x.RoleId == 40);
        }

        if ($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods.length > 0) {
            $scope.PatientPaymentsReportsObj.masterPaymentModes = angular.copy($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods);
            angular.forEach($scope.PatientPaymentsReportsObj.masterPaymentModes, function (Aitem) {
                Aitem.IsChecked = true;
            });
            $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = "Selected";
            $scope.PatientPaymentsReportsObj.AllStatusCheck = true;
        }

        if ($scope.PatientPaymentsReportsObj.AllMasterBranchesList.length > 0) {
            $scope.PatientPaymentsReportsObj.AllBranchesList = angular.copy($scope.PatientPaymentsReportsObj.AllMasterBranchesList);
            angular.forEach($scope.PatientPaymentsReportsObj.AllBranchesList, function (Aitem) {
                Aitem.IsChecked = true;
            });
            $scope.PatientPaymentsReportsObj.SelectLocationString = "Selected";
            $scope.PatientPaymentsReportsObj.AllLocationStatusCheck = true;
        }

        $scope.UserPatientPaymentsObj = {
            "PrintingUserId": $scope.UserId || null,
            "PrintingUserName": "",
            "PaymentFromDate": $scope.PatientPaymentsReportsObj.PaymentFromDate || "",
            "PaymentToDate": $scope.PatientPaymentsReportsObj.PaymentToDate || "",
            "OrganizationId": $scope.HospitalId || null,
            "OrganizationName": "",
            "UserPatientPaymentList": [],
            "ShowPaymentListByUser": false,
        };

        $scope.PatientPaymentsByMethodObj = {
            "PrintingUserId": $scope.UserId || null,
            "PrintingUserName": "",
            "PaymentFromDate": $scope.PatientPaymentsReportsObj.PaymentFromDate || "",
            "PaymentToDate": $scope.PatientPaymentsReportsObj.PaymentToDate || "",
            "OrganizationId": $scope.HospitalId || null,
            "OrganizationName": "",
            "PatientPaymentListByPaymentMethod": [],
            "ShowPaymentListByPaymentMethod": false,
        };

        $scope.PaymentsByBillingProviderObj = {
            "PrintingUserId": $scope.UserId || null,
            "PrintingUserName": "",
            "PaymentFromDate": $scope.PatientPaymentsReportsObj.PaymentFromDate || "",
            "PaymentToDate": $scope.PatientPaymentsReportsObj.PaymentToDate || "",
            "OrganizationId": $scope.HospitalId || null,
            "OrganizationName": "",
            "PatientPaymentListByPaymentMethod": [],
            "ShowPaymentListByBillingProvider": false,
        };

        $scope.ChangeReportsTab = function (Id) {
            if (Id == 1) {
                $scope.UserPatientPaymentsObj.ShowPaymentListByUser = true;
                $scope.PatientPaymentsByMethodObj.ShowPaymentListByPaymentMethod = false;
                $scope.PaymentsByBillingProviderObj.ShowPaymentListByBillingProvider = false;
                /*$scope.GetUserPatientPaymentsList("Change");*/
                $scope.ClearFilters("Change");
            } else if (Id == 2) {
                $scope.UserPatientPaymentsObj.ShowPaymentListByUser = false;
                $scope.PatientPaymentsByMethodObj.ShowPaymentListByPaymentMethod = true;
                $scope.PaymentsByBillingProviderObj.ShowPaymentListByBillingProvider = false;
                /*$scope.GetPatientPaymentsListByPaymentMethod("Change");*/
                $scope.ClearFilters("Change");
            } else {
                $scope.UserPatientPaymentsObj.ShowPaymentListByUser = false;
                $scope.PatientPaymentsByMethodObj.ShowPaymentListByPaymentMethod = false;
                $scope.PaymentsByBillingProviderObj.ShowPaymentListByBillingProvider = true;
                $scope.ClearFilters("Change");
            }
        };

        $scope.ClicktoOpenAccordian = function (item) {
            item.IsOpenAccordian = item.IsOpenAccordian || false;
            if (item.IsOpenAccordian) {
                item.IsOpenAccordian = false;
            } else {
                angular.forEach($scope.UserPatientPaymentsObj.UserPatientPaymentList, function (Aitem) {
                    Aitem.IsOpenAccordian = false;
                });

                item.IsOpenAccordian = true;
                item.PaymentsList = angular.copy(item.PaymentsList) || [];
            }
        }

        $scope.GetUserPatientPaymentsList = function (IsFrom) {
            IsFrom = IsFrom || '';
            var Locationids = $scope.PatientPaymentsReportsObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            let UserIds = $scope.PatientPaymentsReportsObj.ReportUsersList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",") || "";

            if ($scope.PatientPaymentsReportsObj.masterPaymentModes.length > 0) {
                var PaymentModeids = $scope.PatientPaymentsReportsObj.masterPaymentModes
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.PaymentModeId)
                    .join(",");
            }

            if (UserIds == "") {
                alertify.error("Please Select User");
                return false;
            }

            let obj = {
                "UserId": $scope.UserId || null,
                "PaymentFromDate": $scope.PatientPaymentsReportsObj.PaymentFromDate || "",
                "PaymentToDate": $scope.PatientPaymentsReportsObj.PaymentToDate || "",
                "LocationIdsList": Locationids || "",
                "UserIdsList": UserIds || "",
                "PaymentMethodsList": PaymentModeids || "",
            };

            eHnoteInsuranceService.GetAllUsersPatientPaymentsList(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.UserPatientPaymentsObj.PaymentFromDate = resp.data.PaymentFromDate || "";
                    $scope.UserPatientPaymentsObj.PaymentFromDate = $filter('date')($scope.UserPatientPaymentsObj.PaymentFromDate, 'MM/dd/yyyy');
                    $scope.UserPatientPaymentsObj.PaymentToDate = resp.data.PaymentToDate || "";
                    $scope.UserPatientPaymentsObj.PaymentToDate = $filter('date')($scope.UserPatientPaymentsObj.PaymentToDate, 'MM/dd/yyyy');

                    $scope.TotalUsersCount = 0;
                    $scope.TotalPaymentAmountbyUser = 0;

                    if ($scope.AllHospitalData.AllUsersList.length > 0) {
                        let TempUserArray = $filter("filter")($scope.AllHospitalData.AllUsersList, function (kitem) { return kitem.DoctorID == $scope.UserId }, true);
                        if (TempUserArray.length > 0) {
                            $scope.UserPatientPaymentsObj.PrintingUserName = TempUserArray[0].FullName || '';
                            //    $scope.UserPatientPaymentsObj.PrintingUserName = TempUserArray[0].SecondUserFullName || '';
                        }
                    }

                    $scope.UserPatientPaymentsObj.OrganizationName = $scope.HospitalAddressArray.ClinicName || '';

                    if (resp.data.rows.length > 0) {
                        $scope.UserPatientPaymentsObj.UserPatientPaymentList = angular.copy(resp.data.rows) || [];

                        angular.forEach($scope.UserPatientPaymentsObj.UserPatientPaymentList, function (item) {
                            $scope.TotalUsersCount +=  item.UserCount;
                            $scope.TotalPaymentAmountbyUser += item.TotalPaymentAmount;
                        })


                    } else {
                        $scope.UserPatientPaymentsObj.UserPatientPaymentList = [];
                    }

                    $scope.PatientPaymentsReportsObj.LocationName = "";
                    $scope.PatientPaymentsReportsObj.UserFullName = "";
                    $scope.PatientPaymentsReportsObj.PaymentMethodName = "";

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };

        $scope.GetPatientPaymentsListByPaymentMethod = function (IsFrom) {
            IsFrom = IsFrom || '';
            var Locationids = $scope.PatientPaymentsReportsObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            var PaymentModeids = $scope.PatientPaymentsReportsObj.masterPaymentModes
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.PaymentModeId)
                .join(",");

            let UserIds = $scope.PatientPaymentsReportsObj.ReportUsersList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");

            if (PaymentModeids == "") {
                alertify.error("Please Select Payment Method");
                return false;
            }

            let obj = {
                "UserId": $scope.UserId || null,
                "PaymentFromDate": $scope.PatientPaymentsReportsObj.PaymentFromDate || "",
                "PaymentToDate": $scope.PatientPaymentsReportsObj.PaymentToDate || "",
                "LocationIdsList": Locationids || "",
                "UserIdsList": UserIds || "",
                "PaymentMethodsList": PaymentModeids || "",
            };

            eHnoteInsuranceService.GetPatientPaymentsListByPaymentMethod(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.PatientPaymentsByMethodObj.PaymentFromDate = resp.data.PaymentFromDate || "";
                    $scope.PatientPaymentsByMethodObj.PaymentFromDate = $filter('date')($scope.PatientPaymentsByMethodObj.PaymentFromDate, 'MM/dd/yyyy');
                    $scope.PatientPaymentsByMethodObj.PaymentToDate = resp.data.PaymentToDate || "";
                    $scope.PatientPaymentsByMethodObj.PaymentToDate = $filter('date')($scope.PatientPaymentsByMethodObj.PaymentToDate, 'MM/dd/yyyy');
                    $scope.TotalAmountbyPaymentMethod = 0;
                    $scope.TotalPaymentMethodCount = 0;
                    if ($scope.AllHospitalData.AllUsersList.length > 0) {
                        let TempUserArray = $filter("filter")($scope.AllHospitalData.AllUsersList, function (kitem) { return kitem.DoctorID == $scope.UserId }, true);
                        if (TempUserArray.length > 0) {
                            $scope.PatientPaymentsByMethodObj.PrintingUserName = TempUserArray[0].FullName || '';
                        }
                    }

                    $scope.PatientPaymentsByMethodObj.OrganizationName = $scope.HospitalAddressArray.ClinicName || '';

                    if (resp.data.rows.length > 0) {
                        $scope.PatientPaymentsByMethodObj.PatientPaymentListByPaymentMethod = angular.copy(resp.data.rows) || [];

                        angular.forEach($scope.PatientPaymentsByMethodObj.PatientPaymentListByPaymentMethod, function (item) {
                            $scope.TotalAmountbyPaymentMethod += item.TotalPaymentAmount;
                            $scope.TotalPaymentMethodCount += item.MethodCount;
                        })

                    } else {
                        $scope.PatientPaymentsByMethodObj.PatientPaymentListByPaymentMethod = [];
                    }

                    $scope.PatientPaymentsReportsObj.LocationName = "";
                    $scope.PatientPaymentsReportsObj.UserFullName = "";
                    $scope.PatientPaymentsReportsObj.PaymentMethodName = "";

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };

        $scope.CheckReportAllPaymentType = function (Val, Type) {
            if (Type == "User") {
                if (Val) {
                    $scope.PatientPaymentsReportsObj.SelectUserStatusString = "Selected";
                    angular.forEach($scope.PatientPaymentsReportsObj.ReportUsersList, function (Aitem) {
                        Aitem.IsChecked = true;
                    });
                } else {
                    $scope.PatientPaymentsReportsObj.SelectUserStatusString = "Select";
                    angular.forEach($scope.PatientPaymentsReportsObj.ReportUsersList, function (Aitem) {
                        Aitem.IsChecked = false;
                    });
                }
            } else {
                if (Val) {
                    $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = "Selected";
                    angular.forEach($scope.PatientPaymentsReportsObj.masterPaymentModes, function (Aitem) {
                        Aitem.IsChecked = true;
                    });
                } else {
                    $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = "Select";
                    angular.forEach($scope.PatientPaymentsReportsObj.masterPaymentModes, function (Aitem) {
                        Aitem.IsChecked = false;
                    });
                }
            }
        };

        $scope.ClickForFilteredData = function () {
            if ($scope.UserPatientPaymentsObj.ShowPaymentListByUser) {
                $scope.GetUserPatientPaymentsList("Change");
            } else if ($scope.PatientPaymentsByMethodObj.ShowPaymentListByPaymentMethod) {
                $scope.GetPatientPaymentsListByPaymentMethod("Change");
            } else {
                $scope.GetPaymentGroupbyBillingProvider();
            }
        };

        $scope.ChangeReportsLocation = function (item) {
            if (item.IsChecked) {
                if (item.ClinicId === 0) {
                    angular.forEach($scope.PatientPaymentsReportsObj.AllBranchesList, function (mitem) {
                        mitem.IsChecked = true;
                    });
                }
                $scope.PatientPaymentsReportsObj.SelectLocationString = "Selected";
            } else {
                if (item.ClinicId === 0) {
                    angular.forEach($scope.PatientPaymentsReportsObj.AllBranchesList, function (mitem) {
                        mitem.IsChecked = false;
                    });
                    $scope.PatientPaymentsReportsObj.SelectLocationString = "Select";
                }
            }
        };

        $scope.ClearFilters = function (Type) {
            Type = Type || "";

            $scope.PatientPaymentsReportsObj.PaymentFromDate = PaymentFromDate(ReportPaymentFromDate) || '';
            $scope.PatientPaymentsReportsObj.PaymentToDate = $filter('date')(new Date(), "MM-dd-yyyy") || '';

            if ($scope.PatientPaymentsReportsObj.AllUsersList.length > 0) {
                $scope.PatientPaymentsReportsObj.ReportUsersList = angular.copy($scope.PatientPaymentsReportsObj.AllUsersList);
                angular.forEach($scope.PatientPaymentsReportsObj.ReportUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.PatientPaymentsReportsObj.SelectUserStatusString = "Selected";
                $scope.PatientPaymentsReportsObj.AllUserStatusCheck = true;
            }

            if ($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods.length > 0) {
                $scope.PatientPaymentsReportsObj.masterPaymentModes = angular.copy($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods);
                angular.forEach($scope.PatientPaymentsReportsObj.masterPaymentModes, function (Aitem) {
                    Aitem.IsChecked = true;
                });
                $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = "Selected";
                $scope.PatientPaymentsReportsObj.AllStatusCheck = true;
            }

            if ($scope.PatientPaymentsReportsObj.AllMasterBranchesList.length > 0) {
                $scope.PatientPaymentsReportsObj.AllBranchesList = angular.copy($scope.PatientPaymentsReportsObj.AllMasterBranchesList);
                angular.forEach($scope.PatientPaymentsReportsObj.AllBranchesList, function (Aitem) {
                    Aitem.IsChecked = true;
                });
                $scope.PatientPaymentsReportsObj.SelectLocationString = "Selected";
                $scope.PatientPaymentsReportsObj.AllLocationStatusCheck = true;
            }

            if ($scope.UserPatientPaymentsObj.ShowPaymentListByUser) {
                if (Type == "") {
                    $scope.GetUserPatientPaymentsList("Change");
                } else {
                    $scope.UserPatientPaymentsObj.UserPatientPaymentList = [];
                }
            } else {
                if (Type == "") {
                    $scope.GetPatientPaymentsListByPaymentMethod("Change");
                } else {
                    $scope.PatientPaymentsByMethodObj.PatientPaymentListByPaymentMethod = [];
                }
            }

        };

        $scope.ChangeReportsPaymentType = function (item) {
            if (item.IsChecked) {
                $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = "Selected";
            }
        };

        $scope.ChangeReportsUser = function (item) {
            if (item.IsChecked) {
                $scope.PatientPaymentsReportsObj.SelectUserStatusString = "Selected";
            }
        };

        $scope.PrintPaymentsData = function (Type) {
            if (Type == "User") {

                if ($scope.AllHospitalData.AllUsersList.length > 0) {
                    let TempUserArray = $filter("filter")($scope.AllHospitalData.AllUsersList, function (kitem) { return kitem.DoctorID == $scope.UserId }, true);
                    if (TempUserArray.length > 0) {
                        $scope.UserPatientPaymentsObj.PrintingUserName = TempUserArray[0].FullName || '';
                    }
                }

                $scope.UserPatientPaymentsObj.OrganizationName = $scope.HospitalAddressArray.ClinicName || '';

                $timeout(function () {
                    var innerContents = document.getElementById('UserPatientPayment_Print').innerHTML;
                    var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    popupWinindow.document.open();
                    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                    popupWinindow.document.close();
                }, 1000);
            } else if (Type == "Payment") {

                if ($scope.AllHospitalData.AllUsersList.length > 0) {
                    let TempUserArray = $filter("filter")($scope.AllHospitalData.AllUsersList, function (kitem) { return kitem.DoctorID == $scope.UserId }, true);
                    if (TempUserArray.length > 0) {
                        $scope.PatientPaymentsByMethodObj.PrintingUserName = TempUserArray[0].FullName || '';
                    }
                }

                $scope.PatientPaymentsByMethodObj.OrganizationName = $scope.HospitalAddressArray.ClinicName || '';

                $timeout(function () {
                    var innerContents = document.getElementById('PatientPaymentPrintByPaymentMethod').innerHTML;
                    var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    popupWinindow.document.open();
                    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                    popupWinindow.document.close();
                }, 1000);
            } else {

                if ($scope.AllHospitalData.AllUsersList.length > 0) {
                    let TempUserArray = $filter("filter")($scope.AllHospitalData.AllUsersList, function (kitem) { return kitem.DoctorID == $scope.UserId }, true);
                    if (TempUserArray.length > 0) {
                        $scope.PatientPaymentsByMethodObj.PrintingUserName = TempUserArray[0].FullName || '';
                    }
                }

                $scope.PatientPaymentsByMethodObj.OrganizationName = $scope.HospitalAddressArray.ClinicName || '';

                $timeout(function () {
                    var innerContents = document.getElementById('PatientPaymentPrintByPaymentMethod').innerHTML;
                    var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    popupWinindow.document.open();
                    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                    popupWinindow.document.close();
                }, 1000);
            }
        }

        $scope.checkAllBillingProviders = function (val) {
            angular.forEach($scope.BillingProviderList, function (item) {
                item.IsChecked = val;
            });

            $scope.PatientPaymentsReportsObj.SelectBillingProviderString = val ? "All" : "Select Billing Provider";
            $scope.updateSelectedProviders();
        };

        $scope.ProviderToggle = function (item) {
            const checkedCount = $scope.BillingProviderList.filter(i => i.IsChecked).length;

            $scope.PatientPaymentsReportsObj.AllBillingProviderStatusCheck = checkedCount === $scope.BillingProviderList.length;
            if (checkedCount === 0) {
                $scope.PatientPaymentsReportsObj.SelectBillingProviderString = "Select Billing Provider";
            } else if ($scope.PatientPaymentsReportsObj.AllBillingProviderStatusCheck) {
                $scope.PatientPaymentsReportsObj.SelectBillingProviderString = "All";
            } else {
                $scope.PatientPaymentsReportsObj.SelectBillingProviderString = "Selected";
            }

            $scope.updateSelectedProviders();
        };

        $scope.updateSelectedProviders = function () {
            $scope.selectedBillingProviders = $scope.BillingProviderList.map(item => ({
                OrganizationBillingProviderId: item.OrganizationBillingProviderId,
                BillingProviderName: item.BillingProviderName,
                NPI: item.NPI,
                DeleteInd: item.IsChecked ? "N" : "Y" 
            }));
        };

        $scope.selectedDoctor = "All Doctors";
        $scope.DoctorToggle = function (item) {
            var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { isChecked: true });
            $scope.PatientPaymentsReportsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.selectedDoctor = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.selectedDoctor = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                } else {
                    $scope.selectedDoctor = "Selected";
                }
            }

        };

        $scope.checkAllDoctor = function (val) {
            if (val) {
                angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                    item.isChecked = true;
                });

                $scope.selectedDoctor = 'All Doctors';
            } else {
                angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                    item.isChecked = false;
                });

                $scope.selectedDoctor = 'Select';
            }
            var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { isChecked: true });
            $scope.PatientPaymentsReportsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;

        };

        $scope.PaymentDateRangeArray = [
            { Id: 1, Name: 'Current Date' },
            { Id: 2, Name: 'Current Month' },
            { Id: 3, Name: 'Last Month' },
            { Id: 4, Name: 'Last 3 months' }
        ];

        $scope.ServiceDateRangeArray = [
            { Id: 1, Name: 'Last week' },
            { Id: 2, Name: 'Current Month' },
            { Id: 3, Name: 'Last Month' },
            { Id: 4, Name: 'Last 3 months' },
        ];


        $scope.setPaymentDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Current Date
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate);
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(currentDate);
                    break;
                case 2: // Current month
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 3: // Last month
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 4: // Last 3 months
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 3 months
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                default:
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = $filter('date')(new Date(), "MM-dd-yyyy");
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = $filter('date')(new Date(), "MM-dd-yyyy");
            }

            $scope.PatientPaymentsReportsObj.PatientPayFromDate = $scope.PatientPaymentsReportsObj.PatientPayFromDate;
            $scope.PatientPaymentsReportsObj.PatientPayToDate = $scope.PatientPaymentsReportsObj.PatientPayToDate;

            if ($scope.PatientPaymentsReportsObj.PatientPayFromDate != '') {
                $scope.PatientPaymentsReportsObj.PatientPayFromDate = $filter('date')($scope.PatientPaymentsReportsObj.PatientPayFromDate, "MM-dd-yyyy");
            }
            if ($scope.PatientPaymentsReportsObj.PatientPayToDate != '') {
                $scope.PatientPaymentsReportsObj.PatientPayToDate = $filter('date')($scope.PatientPaymentsReportsObj.PatientPayToDate, "MM-dd-yyyy");
            }

        };

        $scope.setServiceDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Last week
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    $scope.PatientPaymentsReportsObj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 2: // current month
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.PatientPaymentsReportsObj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 3: // Last month
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.PatientPaymentsReportsObj.ServiceToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 4: //  Last 3 months
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    $scope.PatientPaymentsReportsObj.ServiceToDate = new Date(); // Reset to current date
                    break;
                default:
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = null;
                    $scope.PatientPaymentsReportsObj.ServiceToDate = null;
            }

            $scope.PatientPaymentsReportsObj.ServiceFromDate = $scope.PatientPaymentsReportsObj.ServiceFromDate;
            $scope.PatientPaymentsReportsObj.ServiceToDate = $scope.PatientPaymentsReportsObj.ServiceToDate;

            if ($scope.PatientPaymentsReportsObj.ServiceFromDate != '') {
                $scope.PatientPaymentsReportsObj.ServiceFromDate = $filter('date')($scope.PatientPaymentsReportsObj.ServiceFromDate, "MM-dd-yyyy");
            }
            if ($scope.PatientPaymentsReportsObj.ServiceToDate != '') {
                $scope.PatientPaymentsReportsObj.ServiceToDate = $filter('date')($scope.PatientPaymentsReportsObj.ServiceToDate, "MM-dd-yyyy");
            }

        };


        $scope.GetPaymentGroupbyBillingProvider = function (IsFrom) {
            $scope.PatientPaymentBillingProviderList = [];
            IsFrom = IsFrom || '';
            var PaymentModeids = $scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.PaymentModeId)
                .join(",");
            var Locationids = $scope.PatientPaymentsReportsObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            let UserIds = $scope.PatientPaymentsReportsObj.ReportUsersList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");

            if (PaymentModeids == "") {
                alertify.error("Please Select Payment Method");
                return false;
            }

            var BillingProviderids = $scope.BillingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            var RenderingProviderIds = $scope.mainBillerDataObj.AllDoctorsList
                .filter(pitem => pitem.isChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");


            let obj = {
                "ParentOrganization": $scope.ParentHospitalId,
                "BillingProviderIds": BillingProviderids || null,
                "RenderingProviderIds":RenderingProviderIds || null,
                "PaymentStartDate": $scope.PatientPaymentsReportsObj.PatientPayFromDate || "",
                "PaymentEndDate": $scope.PatientPaymentsReportsObj.PatientPayToDate || "",
                "ServiceStartDate": $scope.PatientPaymentsReportsObj.ServiceFromDate || "",
                "ServiceEndDate": $scope.PatientPaymentsReportsObj.ServiceToDate || "",
                "UserIds": UserIds || "",
                "LocationIds": Locationids || "",
                "PaymentTypeIds": PaymentModeids || "",
            };

            eHnoteInsuranceService.GetPatientPaymentsSummaryByBillingProvider(obj).then(function (resp) {
                if (resp.data.status == "Success") {

                    $scope.PatientPaymentBillingProviderList = resp.data.rows || [];
                    $scope.PaymentBillingProviderChartList = resp.data.MonthWise || [];

                    $scope.PatientPaymentsReportsObj.LocationName = "";
                    $scope.PatientPaymentsReportsObj.UserFullName = "";
                    $scope.PatientPaymentsReportsObj.PaymentMethodName = "";
                    $timeout($scope.BillingProviderChargesChart, 0);

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };




 $scope.paymentGridApi = null;
        function loadServerSideData(request) {

        let payload = {
            ParentOrganizationId: 3,
            StartRow: request.startRow,
            EndRow: request.endRow,
            SortModel: request.sortModel,
            FilterModel: request.filterModel
        };

        return eHnoteInsuranceService.GetPatientPaymentsListTest(payload)
            .then(function (resp) {
                if (resp.data.status === "Success") {
                    return {
                        rows: resp.data.Rows,
                        totalCount: resp.data.TotalCount
                    };
                } else {
                    throw 'Server error';
                }
            });
    }

    $scope.initPatientPaymentGrid = function () {
    console.log('Enterprise Loaded:', agGrid.LicenseManager != null);
    const gridDiv = document.getElementById('mypatientPaymentGrid');

    const gridOptions = {
        columnDefs: [
            { headerName: "Payment Date", field: "PaymentDate" },
            { headerName: "Patient", field: "PatientFirstName" },
            { headerName: "Provider", field: "BillingProviderName" },
            { headerName: "Rendering Provider", field: "RenderingProviderName" },
            { headerName: "CPT", field: "CPTCODE" },
            { headerName: "Amount", field: "PatientPaidAmount" }
        ],
        defaultColDef: {
            flex: 1,
            minWidth: 120,
            sortable: true,
            filter: true,
            resizable: true
        },
        rowModelType: 'serverSide',              
        serverSideStoreType: 'partial',
        cacheBlockSize: 100,
        maxBlocksInCache: 5,
        animateRows: true,
        onGridReady: function (params) {

            const serverSideDatasource = {
                getRows: function (ssParams) {

                    let payload = {
                        ParentOrganizationId: 3,
                        StartRow: ssParams.request.startRow,
                        EndRow: ssParams.request.endRow
                    };

                    eHnoteInsuranceService.GetPatientPaymentsListTest(payload)
                        .then(function (resp) {
console.log(resp);
                            if (resp.data.status === "Success") {
                                ssParams.success({
                                    rowData: resp.data.rows,
                                    rowCount:10000
                                });
                            } else {
                                ssParams.fail();
                            }
                        })
                        .catch(function () {
                            ssParams.fail();
                        });
                }
            };

            params.api.setGridOption('serverSideDatasource',serverSideDatasource);
        }
    };

    
    agGrid.createGrid(gridDiv, gridOptions);
        };


        function getMonthIndex(monthName) {
            var months = [
                "January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December"
            ];
            return months.indexOf(monthName);
        }

        $scope.BillingProviderChargesChart = function () {

            if (!$scope.PaymentBillingProviderChartList ||
                !$scope.PaymentBillingProviderChartList.length) {
                return;
            }

            var labels = [];
            var providerMap = {};
            var monthMap = {};

            // 1️⃣ Collect providers
            angular.forEach($scope.PaymentBillingProviderChartList, function (item) {
                if (providerMap[item.BillingProviderId] === undefined) {
                    providerMap[item.BillingProviderId] = labels.length;
                    labels.push(item.BillingProviderName);
                }
            });

            // 2️⃣ Collect months
            angular.forEach($scope.PaymentBillingProviderChartList, function (item) {
                if (!monthMap[item.Month]) {
                    monthMap[item.Month] = new Array(labels.length).fill(0);
                }
            });

            // 3️⃣ Map values
            angular.forEach($scope.PaymentBillingProviderChartList, function (item) {
                var providerIndex = providerMap[item.BillingProviderId];
                monthMap[item.Month][providerIndex] = item.TotalPaymentAmount || 0;
            });

            // 4️⃣ SORT MONTHS CORRECTLY
            var sortedMonths = Object.keys(monthMap).sort(function (a, b) {
                return getMonthIndex(a) - getMonthIndex(b);
            });

            // 5️⃣ Build datasets in sorted order
            var colors = ["#1f4e79", "#ed7d31", "#548235", "#7030a0", "#009688"];
            var datasets = [];

            angular.forEach(sortedMonths, function (month, index) {
                datasets.push({
                    label: month,
                    data: monthMap[month],
                    backgroundColor: colors[index % colors.length]
                });
            });

            var ctx = document.getElementById("billingProviderChart").getContext("2d");

            if ($scope.billingProviderChartInstance) {
                $scope.billingProviderChartInstance.destroy();
            }

            $scope.billingProviderChartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: "top" },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.dataset.label +
                                        ": $ " + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Billing Provider"
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value) {
                                    return "$ " + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        };





        $scope.$on('navtoPatientPaymentListNew', function (event, id) {
            $scope.PatientPayments = id;
            $scope.SwitchSubTabs(id);
        });

    }]);
"use strict";
eHnoteWebApp.controller("UsBillingReportsParent", ["$scope", "$filter", "$q", "$compile", "alertify", "$uibModal", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "eHnoteInsuranceService", "eHnoteSettingsDataService", "$timeout", "eHnotePatientDataService", "datapersistanceFactory", "$window", "eHnoteReferalDataService", "$document","eHnoteAccountUserServices",
    function ($scope, $filter, $q, $compile, alertify, $uibModal, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, eHnoteInsuranceService, eHnoteSettingsDataService, $timeout, eHnotePatientDataService, datapersistanceFactory, $window, eHnoteReferalDataService, $document, eHnoteAccountUserServices) {

        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
        $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
        $scope.GetAllIndicator = 0;
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }

        $scope.HospitalAddressArray = [];
        $scope.ARReportDetails = [];
        $scope.ARMonthlySummaryDetails = [];
        $scope.ARAgedReportDetails = [];
        $scope.AllARReportDetails = [];
        $scope.ArReportId = null;
        $scope.ArReporttab = null;

        if ($scope.doctorinfo.doctordata.UserAddress[0] !== undefined) {
            $scope.HospitalAddressArray = $scope.doctorinfo.doctordata.UserAddress[0];
        }
        console.log($scope.mainBillerDataObj);
        $scope.BillingProviderList = [];
        $scope.BillingProviderList = $scope.mainBillerDataObj.BillingProviderList || [];

        $scope.masterPaymentModes = [];
        if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
            $scope.masterPaymentModes = angular.copy(mObj.PaymentModes);
        }


        function GetARReportData() {
            var obj = {
                "Type": "ServiceDate",
                "FromDate": null,
                "ToDate": null,
                "MasterPayorIds": null,
                "BillingProviderIds": "",
                "LocationIds": "",
                "PatientAgingDataIds": "",
                "PatientIds": "",
                "BalanceRange": null,
                "BalanceRangeType": "",
                "PayorObj": "",
                "PatientObj": "",
                "SelectAgingString": "All",
                "SelectPatientsString": "All",
                "SelectLocationString": "All",
                "SelectProviderString": "All",
                "SelectPayorString": "All",
                "SelectedPayors": [],
                "Count": 0,
                "SearchText": "",
                "SearchTypeId": 1,
                "PageNumber": 1,
                "PageSize": 100,

            }
            return obj;
        };
        $scope.ARReportData = GetARReportData();

        $scope.BalanceRangeList = [
            { BalanceRangeTypeId: 1, BalanceRangeType: "GreaterThan or EqualTo" },
            { BalanceRangeTypeId: 2, BalanceRangeType: "LessThan or EqualTo" },
            { BalanceRangeTypeId: 3, BalanceRangeType: "EqualTo" }
        ];

        $scope.agingByOptions = [
            { value: "ServiceDate", label: "Service Date" },
            { value: "PostedDate", label: "Posted Date" },
            { value: "CreatedDate", label: "Created Date" }
        ];

        $scope.agingBy = "ServiceDate"; // default


        $scope.SearchARDetails = function (Pageno) {

            $scope.ARReportData.PageNumber = Pageno || 1;
            $scope.ARReportData.LocationIds = $scope.mainBillerDataObj.AllBranchesList
                .filter(pitem => pitem.ClinicId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.ClinicId)
                .join(",");

            $scope.ARReportData.MasterPayorIds = $scope.FilteredPayorList
                .filter(pitem => pitem.PayorId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.PayorId)
                .join(",");

            $scope.ARReportData.BillingProviderIds = $scope.ClaimProviderList
                .filter(pitem => pitem.OrganizationBillingProviderId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            $scope.ARReportData.PatientAgingDataIds = $scope.MasterPatientAgingData
                .filter(pitem => pitem.PatientAgingDataId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.PatientAgingDataId)
                .join(",");

            $scope.ARReportData.PatientIds = $scope.FilteredPatientList
                .filter(pitem => pitem.PatientId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.PatientId)
                .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "MasterPayorIds": $scope.ARReportData.MasterPayorIds || null,
                "BillingProviderIds": $scope.ARReportData.BillingProviderIds,
                "LocationIds": $scope.ARReportData.LocationIds,
                "PatientAgingDataIds": $scope.ARReportData.PatientAgingDataIds,
                "PatientIds": $scope.ARReportData.PatientIds,
                "BalanceRange": $scope.ARReportData.BalanceRange || 0,
                "BalanceRangeType": $scope.ARReportData.BalanceRangeType,
                "PageNumber": $scope.ARReportData.PageNumber,
                "PageSize": 100
            }

            eHnoteInsuranceService.GetAccountsReceivableDetailReport(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.ARReportData.Count = resp.data.count;
                        $scope.ARReportDetails = angular.copy(resp.data.rows);
                    } else {
                        $scope.ARReportDetails = [];
                    }
                }

            }, function (err) { console.log(err); });
        }

        $scope.GetOrganizationNewPayorAllList = function (val) {

            var param = {
                "SearchText": val || "",
                "Status": "Active",
                "PageSize": 10,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "GetAllIndicator": 0,
                "PayorId": 0,
                "PayorTypeId": 0
            };
            return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            }, function (error) {
                console.log(error);
            });
        };

        $scope.FilteredPayorList = [];
        let payorSearchTimeout = null;

        $scope.SearchPayorListMaster = function () {

            const SearchText = $scope.ARReportData.PayorObj || "";
            if (payorSearchTimeout) {
                $timeout.cancel(payorSearchTimeout);
            }

            payorSearchTimeout = $timeout(function () {
                const param = {
                    PageSize: 20,
                    PageNumber: 1,
                    SearchText: SearchText.trim()
                };

                eHnoteInsuranceService.GetMasterPayorsList(param).then(function (resp) {
                    if (resp.data && resp.data.rows) {
                        const rows = resp.data.rows.map(function (item) {
                            item.IsChecked = $scope.ARReportData.SelectedPayors.some(p => p.PayorId === item.PayorId);
                            return item;
                        });
                        $scope.FilteredPayorList = rows;
                    }

                    $scope.FilteredPayorList.unshift({
                        PayorName: "All",
                        PayorId: 0
                    });
                    $scope.FilteredPayorList.forEach(item => item.IsChecked = true);
                    $scope.ARReportData.SelectPayorString = "All";
                });

            }, 300);
        };

        $scope.togglePayorSelection = function (item) {

            if (item.PayorId === 0) {
                $scope.FilteredPayorList.forEach(branch => {
                    branch.IsChecked = item.IsChecked;
                });
            }

            const allNonZeroChecked = $scope.FilteredPayorList
                .filter(branch => branch.PayorId !== 0)
                .every(branch => branch.IsChecked);

            const allPayorItem = $scope.FilteredPayorList.find(branch => branch.PayorId === 0);

            if (allPayorItem) {
                allPayorItem.IsChecked = allNonZeroChecked;
            }

            const checkedPayors = $scope.FilteredPayorList.filter(branch => branch.IsChecked);
            const totalPayors = $scope.FilteredPayorList.length;

            $scope.ARReportData.SelectPayorString = checkedPayors.length === totalPayors ? "All" : checkedPayors.length === 1 ? (checkedPayors[0].PayorName || "Select") : checkedPayors.length > 1 ? "Selected" : "Select";

        };


        $scope.stopClosingDropDown = function (e) {
            e.stopPropagation();
        };

        $scope.onPayorDropdownOpen = function () {
            $scope.SearchPayorListMaster();
        };

        $scope.onPatientDropdownOpen = function (val) {
            $scope.SearchPatientList(val);
        };

        $scope.ChangePayorName = function (item) {
            $scope.ARReportData.PayorId = item.PayorId;
            $scope.ARReportData.PayorName = item.PayorName;
        }

        $scope.changeGetPayor = function () {
            $scope.ARReportData.PayorId = 0;
        };

        $scope.SelectApptBranch = function (item) {

            if (item.ClinicId === 0) {
                $scope.mainBillerDataObj.AllBranchesList.forEach(branch => {
                    branch.IsChecked = item.IsChecked;
                });
            }

            const allNonZeroChecked = $scope.mainBillerDataObj.AllBranchesList
                .filter(branch => branch.ClinicId !== 0)
                .every(branch => branch.IsChecked);

            const allLocationItem = $scope.mainBillerDataObj.AllBranchesList.find(branch => branch.ClinicId === 0);

            if (allLocationItem) {
                allLocationItem.IsChecked = allNonZeroChecked;
            }

            const checkedBranches = $scope.mainBillerDataObj.AllBranchesList.filter(branch => branch.IsChecked);
            const totalBranches = $scope.mainBillerDataObj.AllBranchesList.length;

            $scope.ARReportData.SelectLocationString = checkedBranches.length === totalBranches ? "All" : checkedBranches.length === 1 ? (checkedBranches[0].ClinicName || "Select") : checkedBranches.length > 1 ? "Selected" : "Select";
        };

        $scope.OnSelectProvider = function (item) {

            if (item.OrganizationBillingProviderId === 0) {
                $scope.ClaimProviderList.forEach(branch => {
                    branch.IsChecked = item.IsChecked;
                });
            }

            const allNonZeroChecked = $scope.ClaimProviderList
                .filter(branch => branch.OrganizationBillingProviderId !== 0)
                .every(branch => branch.IsChecked);

            const allLocationItem = $scope.ClaimProviderList.find(branch => branch.OrganizationBillingProviderId === 0);

            if (allLocationItem) {
                allLocationItem.IsChecked = allNonZeroChecked;
            }

            const checkedProvider = $scope.ClaimProviderList.filter(branch => branch.IsChecked);
            const totalProvider = $scope.ClaimProviderList.length;

            $scope.ARReportData.SelectProviderString = checkedProvider.length === totalProvider ? "All" : checkedProvider.length === 1 ? (checkedProvider[0].BillingProviderName || "Select") : checkedProvider.length > 1 ? "Selected" : "Select";
        };

        $scope.OnSelectPatientAging = function (item) {

            if (item.PatientAgingDataId === 0) {
                $scope.MasterPatientAgingData.forEach(branch => {
                    branch.IsChecked = item.IsChecked;
                });
            }

            const allNonZeroChecked = $scope.MasterPatientAgingData
                .filter(branch => branch.PatientAgingDataId !== 0)
                .every(branch => branch.IsChecked);

            const allAgingItem = $scope.MasterPatientAgingData.find(branch => branch.PatientAgingDataId === 0);

            if (allAgingItem) {
                allAgingItem.IsChecked = allNonZeroChecked;
            }

            const checkedAgings = $scope.MasterPatientAgingData.filter(branch => branch.IsChecked);
            const totalAgings = $scope.MasterPatientAgingData.length;

            $scope.ARReportData.SelectAgingString = checkedAgings.length === totalAgings ? "All" : checkedAgings.length === 1 ? (checkedAgings[0].PatientAgingData || "Select") : checkedAgings.length > 1 ? "Selected" : "Select";
        };

        $scope.togglePatientSelection = function (item) {

            if (item.PatientId === 0) {
                $scope.FilteredPatientList.forEach(branch => {
                    branch.IsChecked = item.IsChecked;
                });
            }

            const allNonZeroChecked = $scope.FilteredPatientList
                .filter(branch => branch.PatientId !== 0)
                .every(branch => branch.IsChecked);

            const allPatientItem = $scope.FilteredPatientList.find(branch => branch.PatientId === 0);

            if (allPatientItem) {
                allPatientItem.IsChecked = allNonZeroChecked;
            }

            const checkedPatients = $scope.FilteredPatientList.filter(branch => branch.IsChecked);
            const totalPatients = $scope.FilteredPatientList.length;

            $scope.ARReportData.SelectPatientsString = checkedPatients.length === totalPatients ? "All" : checkedPatients.length === 1 ? (checkedPatients[0].FullName || "Select") : checkedPatients.length > 1 ? "Selected" : "Select";
        };

        $scope.FilteredPatientList = [];

        $scope.SearchPatientList = function (val) {

            if (val == undefined || val == null || val == "") {
                $scope.ARReportData.PatientId = 0;
                return false;
            }

            var param = {
                "PageSize": 20,
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
                "SearchText": $scope.ARReportData.SearchText || "",
                "SearchTypeID": $scope.ARReportData.SearchTypeId || 0,
            }
            if ($scope.ARReportData.SearchTypeId == 1) {
                object.Name = val;
            } else if ($scope.ARReportData.SearchTypeId == 2) {
                object.PatientId = val;
            }
            eHnotePatientDataService.SearchAllPatientData(object, OnSuccess, OnError)
        };

        function OnSuccess(data) {

            if (data.count > 0) {
                $scope.FilteredPatientList = [];
                if (data.rows.length > 0) {
                    $scope.FilteredPatientList = data.rows || [];
                }
                //$scope.FilteredPatientList.unshift({
                //    FullName: "All",
                //    PatientId: 0
                //});
                $scope.FilteredPatientList.forEach(item => item.IsChecked = false);
            } else {
                $scope.FilteredPatientList = [];
            }
        }
        function OnError() {
            $scope.FilteredPatientList = [];
            $scope.ARReportData.SearchText = "";
        }

        $scope.init = function () {

            $scope.ClaimProviderList = [];
            $scope.MasterPatientAgingData = [];

            var obj = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 20
            };

            $q.all([
                eHnoteSettingsDataService.GetOrganizationBillingProviders(obj),
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
            ]).then(function (resp) {
                if (resp[0].data.Status === "Success") {
                    if (resp[0].data.rows.length > 0) {
                        $scope.ClaimProviderList = angular.copy(resp[0].data.rows);
                        $scope.ClaimProviderList.unshift({
                            BillingProviderName: "All",
                            OrganizationBillingProviderId: 0
                        });
                        $scope.ClaimProviderList.forEach(item => item.IsChecked = true);
                    }
                }
                if (resp[1].data.status == "Success") {
                    if (resp[1].data.MasterPatientAgingData.length > 0) {
                        $scope.MasterPatientAgingData = resp[1].data.MasterPatientAgingData || [];
                        $scope.MasterPatientAgingData.unshift({
                            PatientAgingData: "All",
                            PatientAgingDataId: 0
                        });
                        $scope.MasterPatientAgingData.forEach(item => item.IsChecked = true);
                    }
                }

                $scope.mainBillerDataObj.AllBranchesList.forEach(item => item.IsChecked = true);
                //$scope.SearchARDetails(1);
                //$scope.GetAllARReport();
                $scope.navtoOpenParticularGridReport('EmptyAgingReport');
            });
        }

        function formatDate(date) {
            const mm = ('0' + (date.getMonth() + 1)).slice(-2);
            const dd = ('0' + date.getDate()).slice(-2);
            const yyyy = date.getFullYear();
            return `${mm}-${dd}-${yyyy}`;
        }

        $scope.setDefaultDateRange = function () {
            const today = new Date();

            // Always set FromDate to January 1st of current year
            const fromDate = new Date(today.getFullYear(), 0, 1);

            $scope.ARReportData.FromDate = formatDate(fromDate);
            $scope.ARReportData.ToDate = $scope.ARReportData.ToDate || formatDate(today);
        };

        $scope.setDefaultDateRange();



        $scope.init();

        $scope.refreshARDetails = function (id) {
            id = id || null;
            $scope.ARReportData = GetARReportData();
            $scope.mainBillerDataObj.AllBranchesList.forEach(item => item.IsChecked = true);
            $scope.ClaimProviderList.forEach(item => item.IsChecked = true);
            $scope.MasterPatientAgingData.forEach(item => item.IsChecked = true);
            $scope.ARReportData.ToDate = $filter("date")(new Date(), "MM-dd-yyyy");
            $scope.setDefaultDateRange();
            $scope.FilteredPatientList = [];
            if ($scope.BillerReportMainTab === 1) {
                $scope.SearchARDetails(1);
            } else if ($scope.BillerReportMainTab === 2) {
                if (id == 1) {
                    $scope.GetAllARReport();
                } else {
                    $scope.navtoOpenParticularGridReport('EmptyAgingReport');
                }
                
            } else if ($scope.BillerReportMainTab === 3) {
                $scope.SearchARAgedDetails(1);
            } else if ($scope.BillerReportMainTab === 4) {
                $scope.SearchARSummaryDetails(1);
            } else if ($scope.BillerReportMainTab === 5) {
                $scope.SearchPatientDetails();
            } else if ($scope.BillerReportMainTab === 6) {
                $scope.isPopoverOpen = false;
                $scope.SearchInsuranceDetails();
            }else if ($scope.BillerReportMainTab === 7) {
                $scope.SearchExcelDetails();
            }else if ($scope.BillerReportMainTab === 8) {
                $scope.AuditInsSubTab = '';
                $scope.SearchAuditDetails();
            } else{
            }
        }

        $scope.SearchARSummaryDetails = function (Pageno) {

            $scope.ARReportData.PageNumber = Pageno || 1;
            $scope.ARReportData.LocationIds = $scope.mainBillerDataObj.AllBranchesList
                .filter(pitem => pitem.ClinicId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.ClinicId)
                .join(",");

            $scope.ARReportData.MasterPayorIds = $scope.FilteredPayorList
                .filter(pitem => pitem.PayorId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.PayorId)
                .join(",");

            $scope.ARReportData.BillingProviderIds = $scope.ClaimProviderList
                .filter(pitem => pitem.OrganizationBillingProviderId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            $scope.ARReportData.PatientIds = $scope.FilteredPatientList
                .filter(pitem => pitem.PatientId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.PatientId)
                .join(",");

            $scope.ARReportData.PatientAgingDataIds = $scope.MasterPatientAgingData
                .filter(pitem => pitem.PatientAgingDataId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.PatientAgingDataId)
                .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "MasterPayorIds": $scope.ARReportData.MasterPayorIds || null,
                "BillingProviderIds": $scope.ARReportData.BillingProviderIds,
                "LocationIds": $scope.ARReportData.LocationIds,
                "PatientIds": $scope.ARReportData.PatientIds,
                "PatientAgingDataIds": $scope.ARReportData.PatientAgingDataIds,
                "PageNumber": $scope.ARReportData.PageNumber,
                "PageSize": 100
            }

            eHnoteInsuranceService.GetAccountsReceivableMonthlySummaryReport(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.ARReportData.Count = resp.data.count;
                        $scope.ARMonthlySummaryDetails = angular.copy(resp.data.rows);
                    } else {
                        $scope.ARMonthlySummaryDetails = [];
                    }
                }

            }, function (err) { console.log(err); });
        };

        $scope.SearchARAgedDetails = function (Pageno) {

            $scope.ARReportData.PageNumber = Pageno || 1;
            $scope.ARReportData.LocationIds = $scope.mainBillerDataObj.AllBranchesList
                .filter(pitem => pitem.ClinicId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.ClinicId)
                .join(",");

            $scope.ARReportData.MasterPayorIds = $scope.FilteredPayorList
                .filter(pitem => pitem.PayorId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.PayorId)
                .join(",");

            $scope.ARReportData.BillingProviderIds = $scope.ClaimProviderList
                .filter(pitem => pitem.OrganizationBillingProviderId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            $scope.ARReportData.PatientAgingDataIds = $scope.MasterPatientAgingData
                .filter(pitem => pitem.PatientAgingDataId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.PatientAgingDataId)
                .join(",");

            $scope.ARReportData.PatientIds = $scope.FilteredPatientList
                .filter(pitem => pitem.PatientId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.PatientId)
                .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "MasterPayorIds": $scope.ARReportData.MasterPayorIds || null,
                "BillingProviderIds": $scope.ARReportData.BillingProviderIds,
                "LocationIds": $scope.ARReportData.LocationIds,
                "PatientAgingDataIds": $scope.ARReportData.PatientAgingDataIds,
                "BalanceRange": $scope.ARReportData.BalanceRange || 0,
                "BalanceRangeType": $scope.ARReportData.BalanceRangeType,
                "PatientIds": $scope.ARReportData.PatientIds,
                "PageNumber": $scope.ARReportData.PageNumber,
                "PageSize": 100
            }

            eHnoteInsuranceService.GetAccountsReceivableAgedReport(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.ARReportData.Count = resp.data.count;
                        $scope.ARAgedReportDetails = angular.copy(resp.data.rows);
                    } else {
                        $scope.ARAgedReportDetails = [];
                    }
                }

            }, function (err) { console.log(err); });
        };

        //Billing Report Code added by durga as on 22-07-2025

        $scope.BillerReportMainTab = 2;

        $scope.switchMainBillerReportTab = function (tabno) {
            $scope.isPopoverOpen = false;
            angular.element(document.querySelector('.popover')).remove();
            if ($scope.BillerReportMainTab === tabno) return;
            $scope.ArReportId = null;
            $scope.ArReporttab = null;
           
            $scope.BillerReportMainTab = tabno;

            if ([1, 2, 3, 4, 5, 6,7,8].includes($scope.BillerReportMainTab)) {
                $scope.refreshARDetails();
            }
        };


        const columnDefs = [
            { field: "billingProvider", headerName: "Billing Provider" },
            { field: "patient", headerName: "Patient" },
            { field: "insurance", headerName: "Insurance" },
            { field: "totalCharges", headerName: "Total Charges" },
            { field: "totalPayments", headerName: "Total Payments" },
            { field: "balance", headerName: "Balance" },
            { field: "aging_0_30", headerName: "0-30 Days" },
            { field: "aging_31_60", headerName: "31-60 Days" },
            { field: "aging_61_90", headerName: "61-90 Days" },
            { field: "aging_91_120", headerName: "91-120 Days" },
            { field: "aging_121_plus", headerName: ">120 Days" }
        ];

        // Sample AR Data
        const BillingProviderRowData = [
            {
                billingProvider: "Dr. John Smith",
                patient: "Patient 1",
                insurance: "Aetna",
                totalCharges: 15000,
                totalPayments: 8000,
                balance: 7000,
                aging_0_30: 1000,
                aging_31_60: 1500,
                aging_61_90: 2000,
                aging_91_120: 1000,
                aging_121_plus: 1500
            },
            {
                billingProvider: "Dr. Lisa Ray",
                patient: "Patient 2",
                insurance: "Cigna",
                totalCharges: 12000,
                totalPayments: 4000,
                balance: 8000,
                aging_0_30: 2000,
                aging_31_60: 2500,
                aging_61_90: 1000,
                aging_91_120: 1000,
                aging_121_plus: 1500
            }
        ];

        // AG Grid Options
        const billingProvidergridOptions = {
            columnDefs: columnDefs,
            rowData: [],
            defaultColDef: {
                sortable: true,
                filter: true,
                resizable: true
            }
        };



        $scope.loadBillingProviderReport = function () {
            const gridDiv = document.querySelector('#summaryGrid');
            const gridApi = agGrid.createGrid(gridDiv, billingProvidergridOptions);
            gridApi.setGridOption("rowData", BillingProviderRowData);
        };




        let insgridApi;

        function loadAgingByInsuranceGrid(columnDefs, rowData) {
            const gridOptions = {
                columnDefs: columnDefs,
                rowData: rowData,
                defaultColDef: {
                    resizable: true,
                    sortable: true,
                    filter: true,
                },
            };

            document.getElementById("summaryGrid").innerHTML = ""; // reset div
            insgridApi = agGrid.createGrid(document.querySelector("#summaryGrid"), gridOptions);
        }

        $scope.ShowAgingByInsuranceGrid = function () {
            const columnDefs = [
                { field: "insurance" },
                { field: "totalClaims" },
                { field: "totalAmount" },
                { field: "aging_0_30" },
                { field: "aging_31_60" },
                { field: "aging_61_90" },
                { field: "aging_91_120" },
                { field: "aging_120_plus" },
            ];
            const rowData = [
                {
                    insurance: "UHC",
                    totalClaims: 25,
                    totalAmount: 15000,
                    aging_0_30: 5000,
                    aging_31_60: 3000,
                    aging_61_90: 2500,
                    aging_91_120: 2000,
                    aging_120_plus: 2500,
                },
            ];
            loadAgingByInsuranceGrid(columnDefs, rowData);
        }


        $scope.reportTab = "";
        //$scope.ToggleReportTab = "";
        $scope.navtoOpenParticularGridReport = function (tabno) {
            if ($scope.reportTab === tabno) return;
            $scope.reportTab = tabno || "";
            if (tabno == 'SummaryByAllOptions') {
                $timeout(function () {
                    $scope.ShowSummaryAgingByAllOptionsGrid();
                }, 500);
            }
            else if (tabno == 'DetailByAllOptions') {
                $timeout(function () {
                    $scope.ShowDetailedAgingByAllOptionsGrid();
                }, 500);
            }
            else if (tabno == 'AgingDetailByInsurance') {
                $timeout(function () {
                    $scope.initInsuranceARGrid();
                }, 500);

            }
            else if (tabno == 'AgingDetailByPatient') {
                $timeout(function () {
                    $scope.initPatientARGrid();
                }, 500);
            }
            else if (tabno == 'AgingDetailByBillingProvider') {
                $timeout(function () {
                    $scope.initProviderARGrid();
                }, 500);
            }
            else if (tabno == 'EmptyAgingReport') {
                $timeout(function () {
                    $scope.ShowEmptySummaryGrid();
                }, 500);
            }


        };


        let patgridApi;

        function loadAgingByPatientGrid(columnDefs, rowData) {
            const gridOptions = {
                columnDefs: columnDefs,
                rowData: rowData,
                defaultColDef: {
                    resizable: true,
                    sortable: true,
                    filter: true,
                },
            };

            document.getElementById("summaryGrid").innerHTML = ""; // reset div
            patgridApi = agGrid.createGrid(document.querySelector("#summaryGrid"), gridOptions);
        }

        $scope.ShowAgingByPatientsGrid = function () {
            const columnDefs = [
                { field: "patientName" },
                { field: "patientId" },
                { field: "totalAmount" },
                { field: "aging_0_30" },
                { field: "aging_31_60" },
                { field: "aging_61_90" },
                { field: "aging_91_120" },
                { field: "aging_120_plus" },
            ];

            const rowData = [
                {
                    patientName: "Emily Rose",
                    patientId: "PAT101",
                    totalAmount: 1000,
                    aging_0_30: 400,
                    aging_31_60: 300,
                    aging_61_90: 150,
                    aging_91_120: 100,
                    aging_120_plus: 50,
                },
            ];

            loadAgingByPatientGrid(columnDefs, rowData);
        }



        let dettailgridApi;

        function loadDetailAGGrid(columnDefs, rowData) {
            const gridOptions = {
                columnDefs: columnDefs,
                rowData: rowData,
                defaultColDef: {
                    resizable: true,
                    sortable: true,
                    filter: true,
                },
            };

            document.getElementById("summaryGrid").innerHTML = ""; // reset div
            dettailgridApi = agGrid.createGrid(document.querySelector("#summaryGrid"), gridOptions);
        }
        $scope.ShowDetailedAgingByAllOptionsGrid = function () {

            const columnDefs = [
                { field: "claimNumber" },
                { field: "patientName" },
                { field: "insurance" },
                { field: "billingProvider" },
                { field: "dos" },
                { field: "billedAmount" },
                { field: "paidAmount" },
                { field: "balanceAmount" },
                { field: "agingBucket" },
            ];

            const rowData = [
                {
                    claimNumber: "CLM1001",
                    patientName: "John Doe",
                    insurance: "Aetna",
                    billingProvider: "Dr. Smith",
                    dos: "2024-06-10",
                    billedAmount: 500,
                    paidAmount: 300,
                    balanceAmount: 200,
                    agingBucket: "31-60 days",
                },
                {
                    claimNumber: "CLM1002",
                    patientName: "John Doe",
                    insurance: "Aetna",
                    billingProvider: "Dr. Smith",
                    dos: "2024-06-10",
                    billedAmount: 500,
                    paidAmount: 300,
                    balanceAmount: 200,
                    agingBucket: "31-60 days",
                },
            ];

            loadDetailAGGrid(columnDefs, rowData);
        }


        let summarygridApi;

        function loadsummaryAGGrid(columnDefs, rowData) {
            const gridOptions = {
                columnDefs: columnDefs,
                rowData: rowData,
                defaultColDef: {
                    resizable: true,
                    sortable: true,
                    filter: true,
                },
            };

            document.getElementById("summaryGrid").innerHTML = ""; // reset div
            summarygridApi = agGrid.createGrid(document.querySelector("#summaryGrid"), gridOptions);
        }

        $scope.ShowSummaryAgingByAllOptionsGrid = function () {
            const columnDefs = [
                { field: "entityType", headerName: "Group Type" }, // Insurance / Patient / Provider
                { field: "entityName", headerName: "Name" },
                { field: "totalBalance", headerName: "Total Balance", valueFormatter: currencyFormatter },
                { field: "aging_0_30", headerName: "0–30 Days", valueFormatter: currencyFormatter },
                { field: "aging_31_60", headerName: "31–60 Days", valueFormatter: currencyFormatter },
                { field: "aging_61_90", headerName: "61–90 Days", valueFormatter: currencyFormatter },
                { field: "aging_91_120", headerName: "91–120 Days", valueFormatter: currencyFormatter },
                { field: "aging_120_plus", headerName: ">120 Days", valueFormatter: currencyFormatter },
            ];

            const rowData = [
                {
                    entityType: "Insurance",
                    entityName: "Cigna",
                    totalBalance: 15500,
                    aging_0_30: 5000,
                    aging_31_60: 3000,
                    aging_61_90: 2500,
                    aging_91_120: 2000,
                    aging_120_plus: 1000,
                },
                {
                    entityType: "Insurance",
                    entityName: "UHC",
                    totalBalance: 12200,
                    aging_0_30: 4000,
                    aging_31_60: 2000,
                    aging_61_90: 2500,
                    aging_91_120: 1200,
                    aging_120_plus: 2500,
                },
                {
                    entityType: "Patient",
                    entityName: "John Doe",
                    totalBalance: 8200,
                    aging_0_30: 2000,
                    aging_31_60: 1500,
                    aging_61_90: 1000,
                    aging_91_120: 1700,
                    aging_120_plus: 2000,
                }
            ]
            loadsummaryAGGrid(columnDefs, rowData);
        }

        function currencyFormatter(params) {
            if (params.value == null) return "";
            return "$" + parseFloat(params.value).toFixed(2);
        }

        /* Aging Detail ( By Provider) */

        function CustomProviderFilter() { }

        CustomProviderFilter.prototype.init = function (params) {
            this.params = params;
            this.providerValue = '';
            this.selectedProvider = '';
            this.officeValue = '';
            this.selectedOffice = '';
            this.visibleRowIds = new Set();

            const allData = $scope.AllARReportDetails || [];

            this.eGui = document.createElement('div');
            this.eGui.style.padding = '10px';
            this.eGui.style.width = '260px';
            this.eGui.style.fontFamily = 'Arial';
            this.eGui.style.boxSizing = 'border-box';

            const styleInput = 'width: 100%; padding: 6px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;';
            const styleSelect = styleInput;

            // --- Search Provider ---
            const providerInput = document.createElement('input');
            providerInput.type = 'text';
            providerInput.placeholder = 'Search Provider';
            providerInput.style = styleInput;
            providerInput.id = 'providerFilterText';
            this.eGui.appendChild(providerInput);

            const providerSelect = document.createElement('select');
            providerSelect.id = 'providerDropdown';
            providerSelect.style = styleSelect;

            const provDefault = document.createElement('option');
            provDefault.value = '';
            provDefault.text = 'All';
            providerSelect.appendChild(provDefault);

            const providerNames = Array.from(new Set(allData.map(r => r.BillingProviderName).filter(Boolean)));
            providerNames.forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.text = name;
                providerSelect.appendChild(opt);
            });
            this.eGui.appendChild(providerSelect);

            // --- Search Office ---
            const officeInput = document.createElement('input');
            officeInput.type = 'text';
            officeInput.placeholder = 'Search Office';
            officeInput.style = styleInput;
            officeInput.id = 'officeFilterText';
            this.eGui.appendChild(officeInput);

            const officeSelect = document.createElement('select');
            officeSelect.id = 'officeDropdown';
            officeSelect.style = styleSelect;

            const offDefault = document.createElement('option');
            offDefault.value = '';
            offDefault.text = 'All';
            officeSelect.appendChild(offDefault);
            this.eGui.appendChild(officeSelect);

            // Populate offices depending on provider
            this.updateOfficeOptions();

            // --- Events ---
            providerInput.addEventListener('input', (e) => {
                this.providerValue = e.target.value.trim().toLowerCase();
                this.selectedProvider = '';
                providerSelect.value = '';

                // CLEAR office selection when provider search changes
                this.selectedOffice = '';
                officeSelect.value = '';
                officeInput.value = '';

                this.updateOfficeOptions();
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            providerSelect.addEventListener('change', (e) => {
                this.selectedProvider = e.target.value;
                this.providerValue = '';
                providerInput.value = '';

                // CLEAR office selection when provider selection changes
                this.selectedOffice = '';
                officeSelect.value = '';
                officeInput.value = '';

                this.updateOfficeOptions();
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            officeInput.addEventListener('input', (e) => {
                this.officeValue = e.target.value.trim().toLowerCase();
                this.selectedOffice = '';
                officeSelect.value = '';
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            officeSelect.addEventListener('change', (e) => {
                this.selectedOffice = e.target.value;
                this.officeValue = '';
                officeInput.value = '';
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            this.buildVisibleRowIds();
        };

        // update Office options dynamically
        CustomProviderFilter.prototype.updateOfficeOptions = function () {
            const officeSelect = this.eGui.querySelector('#officeDropdown');
            if (!officeSelect) return;
            officeSelect.innerHTML = '';

            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.text = 'All';
            officeSelect.appendChild(defaultOpt);

            const filteredData = ($scope.AllARReportDetails || []).filter(row => {
                if (this.selectedProvider) return row.BillingProviderName === this.selectedProvider;
                return true;
            });

            const officeNames = Array.from(new Set(filteredData.map(r => r.BranchName).filter(Boolean)));
            officeNames.forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.text = name;
                officeSelect.appendChild(opt);
            });

            // If previously selected office no longer exists in the options, clear it
            if (this.selectedOffice && !officeNames.includes(this.selectedOffice)) {
                this.selectedOffice = '';
            }

            // Ensure DOM select shows the model (or All if model empty)
            officeSelect.value = this.selectedOffice || '';
        };

        CustomProviderFilter.prototype.getGui = function () { return this.eGui; };

        CustomProviderFilter.prototype.isFilterActive = function () {
            return !!this.providerValue || !!this.selectedProvider || !!this.officeValue || !!this.selectedOffice;
        };

        CustomProviderFilter.prototype.getModel = function () {
            return {
                providerValue: this.providerValue,
                selectedProvider: this.selectedProvider,
                officeValue: this.officeValue,
                selectedOffice: this.selectedOffice
            };
        };

        CustomProviderFilter.prototype.setModel = function (model) {
            this.providerValue = model?.providerValue || '';
            this.selectedProvider = model?.selectedProvider || '';
            this.officeValue = model?.officeValue || '';
            this.selectedOffice = model?.selectedOffice || '';

            // sync DOM to model
            const providerInput = this.eGui.querySelector('#providerFilterText');
            const providerSelect = this.eGui.querySelector('#providerDropdown');
            const officeInput = this.eGui.querySelector('#officeFilterText');
            const officeSelect = this.eGui.querySelector('#officeDropdown');

            if (providerInput) providerInput.value = this.providerValue;
            if (providerSelect) providerSelect.value = this.selectedProvider || '';

            // update office options (this also syncs officeSelect.value)
            this.updateOfficeOptions();

            if (officeInput) officeInput.value = this.officeValue;
            if (officeSelect) officeSelect.value = this.selectedOffice || '';

            this.buildVisibleRowIds();
        };

        CustomProviderFilter.prototype.buildVisibleRowIds = function () {
            this.visibleRowIds.clear();

            const providerToMatch = (this.selectedProvider || this.providerValue || '').toLowerCase().trim();
            const officeToMatch = (this.selectedOffice || this.officeValue || '').toLowerCase().trim();

            const allNodes = [];
            this.params.api.forEachNode(node => allNodes.push(node));

            let includeProviderGroup = false;
            let includeOfficeGroup = false;

            for (const node of allNodes) {
                const row = node.data;
                if (!row) continue;

                if (row.rowType === 'provider') {
                    const provName = (row.ServiceFrom || '').toLowerCase().replace(/^provider\s*-\s*/, '').trim();
                    includeProviderGroup = !providerToMatch || provName.includes(providerToMatch);
                    includeOfficeGroup = !officeToMatch; // reset office include for the new provider
                    if (includeProviderGroup) this.visibleRowIds.add(node.id);
                }
                else if (row.rowType === 'office') {
                    const officeName = (row.ServiceFrom || '').toLowerCase().replace(/^office\s*-\s*/, '').trim();
                    includeOfficeGroup = !officeToMatch || officeName.includes(officeToMatch);
                    if (includeProviderGroup && includeOfficeGroup) this.visibleRowIds.add(node.id);
                }
                else {
                    if (includeProviderGroup && includeOfficeGroup) {
                        this.visibleRowIds.add(node.id);
                    }
                }
            }
        };

        CustomProviderFilter.prototype.doesFilterPass = function (params) {
            return this.visibleRowIds.has(params.node.id);
        };


        //Provider Patient filters
        function CustomProviderPatientTextFilter() { }

        CustomProviderPatientTextFilter.prototype.init = function (params) {
            this.params = params;
            this.patientSearchValue = '';
            this.selectedPatient = '';
            this.visibleRowIds = new Set();

            const allData = $scope.AllARReportDetails || [];

            this.eGui = document.createElement('div');
            this.eGui.style.padding = '10px';
            this.eGui.style.width = '260px';
            this.eGui.style.fontFamily = 'Arial';
            this.eGui.style.boxSizing = 'border-box';

            const styleInput = 'width: 100%; padding: 6px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;';
            const styleSelect = styleInput;

            // --- Search box
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Search Patient';
            input.style = styleInput;
            input.id = 'providerPatientFilterText';
            this.eGui.appendChild(input);

            // --- Dropdown
            const patientSelect = document.createElement('select');
            patientSelect.id = 'providerPatientDropdown';
            patientSelect.style = styleSelect;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'All';
            patientSelect.appendChild(defaultOption);

            // Collect unique patient names (from line items)
            const patientNames = Array.from(new Set(
                allData.map(r => r.PatientFullName).filter(Boolean)
            ));

            patientNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                patientSelect.appendChild(option);
            });

            this.eGui.appendChild(patientSelect);

            // --- Events
            input.addEventListener('input', (e) => {
                this.patientSearchValue = e.target.value.trim().toLowerCase();
                this.selectedPatient = '';
                patientSelect.value = '';
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            patientSelect.addEventListener('change', (e) => {
                this.selectedPatient = e.target.value;
                this.patientSearchValue = '';
                input.value = '';
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            this.buildVisibleRowIds();
        };

        CustomProviderPatientTextFilter.prototype.getGui = function () {
            return this.eGui;
        };

        CustomProviderPatientTextFilter.prototype.isFilterActive = function () {
            return !!this.patientSearchValue || !!this.selectedPatient;
        };

        CustomProviderPatientTextFilter.prototype.getModel = function () {
            return {
                patientSearchValue: this.patientSearchValue,
                selectedPatient: this.selectedPatient
            };
        };

        CustomProviderPatientTextFilter.prototype.setModel = function (model) {
            this.patientSearchValue = model?.patientSearchValue || '';
            this.selectedPatient = model?.selectedPatient || '';

            const input = this.eGui.querySelector('#providerPatientFilterText');
            const patientSelect = this.eGui.querySelector('#providerPatientDropdown');

            if (input) input.value = this.patientSearchValue;
            if (patientSelect) patientSelect.value = this.selectedPatient;

            this.buildVisibleRowIds();
        };

        CustomProviderPatientTextFilter.prototype.buildVisibleRowIds = function () {
            this.visibleRowIds.clear();

            const patientToMatch = (this.selectedPatient || this.patientSearchValue || '').toLowerCase().trim();
            if (!patientToMatch) return;

            const allNodes = [];
            this.params.api.forEachNode(node => allNodes.push(node));

            let currentProviderRowId = null;
            let currentOfficeRowId = null;

            for (let i = 0; i < allNodes.length; i++) {
                const node = allNodes[i];
                const row = node.data;
                if (!row) continue;

                const type = row.rowType;

                if (type === 'provider') currentProviderRowId = node.id;
                if (type === 'office') currentOfficeRowId = node.id;

                if (type === 'lineItem' && row.Patient &&
                    row.Patient.toLowerCase().includes(patientToMatch)) {

                    this.visibleRowIds.add(node.id);

                    if (currentOfficeRowId) this.visibleRowIds.add(currentOfficeRowId);
                    if (currentProviderRowId) this.visibleRowIds.add(currentProviderRowId);
                }
            }
        };

        CustomProviderPatientTextFilter.prototype.doesFilterPass = function (params) {
            return this.visibleRowIds.has(params.node.id);
        };


        function USformatDate(dateStr) {
            if (!dateStr) return "";
            const [year, month, day] = dateStr.split("-");
            return `${month}-${day}-${year}`;
        }



        // Track expanded state
        $scope.providerExpandedMap = {};
        $scope.officeExpandedMap = {};
        $scope.defaultRowHeight = 30;

        //function buildDynamicARProviderGrid(data) {
        //    let rowId = 1;
        //    const rows = [];
        //    const grouped = {};

        //    (data || []).forEach(item => {
        //        const provider = item.BillingProviderName || '';
        //        const office = item.BranchName || '';
        //        //if (!provider) return;
        //        //if (!grouped[provider]) grouped[provider] = {};
        //        //if (!grouped[provider][office]) grouped[provider][office] = [];
        //        //grouped[provider][office].push(item);

        //        if (provider) {
        //            if (!grouped[provider]) grouped[provider] = {};
        //            if (!grouped[provider][office]) grouped[provider][office] = [];
        //            grouped[provider][office].push(item);
        //        }

        //        // also treat office as provider if it exists as top-level in data
        //        if (office) {
        //            if (!grouped[office]) grouped[office] = {};
        //            if (!grouped[office][provider]) grouped[office][provider] = [];
        //        }
        //    });

        //    for (const provider in grouped) {
        //        const providerTotals = [0, 0, 0, 0, 0, 0]; // a0, a30, a60, a90_120, a120plus, total
        //        let hasValidProviderData = false;

        //        const providerRow = {
        //            id: rowId++,
        //            ServiceFrom: `Provider - ${provider}`,
        //            providerRowId: `provider-${provider}`,
        //            rowType: 'provider',
        //            Aging0_30: 0,
        //            Aging31_60: 0,
        //            Aging61_90: 0,
        //            Aging91_120: 0,
        //            Aging120plus: 0,
        //            Balance: 0
        //        };
        //        rows.push(providerRow);

        //        for (const office in grouped[provider]) {
        //            let a0 = 0, a30 = 0, a60 = 0, a90_120 = 0, a120plus = 0, balance = 0;
        //            let hasValidOfficeData = false;

        //            const officeKey = `office-${provider}-${office}`;
        //            const officeRow = {
        //                id: rowId++,
        //                ServiceFrom: `Office - ${office}`,
        //                providerRowId: `provider-${provider}`,
        //                officeRowId: officeKey,
        //                rowType: 'office',
        //                Aging0_30: 0,
        //                Aging31_60: 0,
        //                Aging61_90: 0,
        //                Aging91_120: 0,
        //                Aging120plus: 0,
        //                Balance: 0,
        //                hidden: true
        //            };
        //            rows.push(officeRow);

        //            grouped[provider][office].forEach(item => {
        //                const aging0_30 = parseFloat(item.zerotoThirty || 0);
        //                const aging31_60 = parseFloat(item.ThirtytoSixty || 0);
        //                const aging61_90 = parseFloat(item.SixtytoNinety || 0);
        //                const aging91_120 = parseFloat(item.NinetytoOnehundredtwenty || 0);
        //                const aging120plus = parseFloat(item.MorethanOnehundredtwenty || 0);

        //                const totalBalance = aging0_30 + aging31_60 + aging61_90 + aging91_120 + aging120plus;
        //                if (totalBalance <= 0) return;

        //                rows.push({
        //                    id: rowId++,
        //                    ServiceFrom: USformatDate(item.DOSfrom?.split('T')[0]),
        //                    ClaimDate: USformatDate(item.ClaimDate),
        //                    Patient: `${item.PatientFullName || ''} (${item.PatientMrNo || ''})`,
        //                    providerRowId: `provider-${provider}`,
        //                    officeRowId: officeKey,
        //                    CPT: item.CPT || '',
        //                    ClaimNo: item.PatientClaimNumber,

        //                    PatientClaimId: item.PatientClaimId,
        //                    PatientId: item.PatientId,
        //                    AppointmentId: item.AppointmentId,
        //                    VisitId: item.VisitId,
        //                    SuperBillId: item.SuperBillId,
        //                    ResponcibilityId: item.ResponcibilityId,
        //                    RenderingProviderId: item.RenderingProviderId,
        //                    ClaimExpiryDate: item.ClaimExpiryDate,

        //                    Aging0_30: aging0_30,
        //                    Aging31_60: aging31_60,
        //                    Aging61_90: aging61_90,
        //                    Aging91_120: aging91_120,
        //                    Aging120plus: aging120plus,
        //                    Balance: totalBalance,
        //                    rowType: 'lineItem',
        //                    hidden: true
        //                });

        //                a0 += aging0_30;
        //                a30 += aging31_60;
        //                a60 += aging61_90;
        //                a90_120 += aging91_120;
        //                a120plus += aging120plus;
        //                balance += totalBalance;
        //                hasValidOfficeData = true;
        //            });

        //            if (hasValidOfficeData) {
        //                officeRow.Aging0_30 = a0;
        //                officeRow.Aging31_60 = a30;
        //                officeRow.Aging61_90 = a60;
        //                officeRow.Aging91_120 = a90_120;
        //                officeRow.Aging120plus = a120plus;
        //                officeRow.Balance = balance;

        //                providerTotals[0] += a0;
        //                providerTotals[1] += a30;
        //                providerTotals[2] += a60;
        //                providerTotals[3] += a90_120;
        //                providerTotals[4] += a120plus;
        //                providerTotals[5] += balance;

        //                hasValidProviderData = true;
        //            } else {
        //                rows.splice(rows.indexOf(officeRow), 1);
        //            }
        //        }

        //        if (hasValidProviderData) {
        //            providerRow.Aging0_30 = providerTotals[0];
        //            providerRow.Aging31_60 = providerTotals[1];
        //            providerRow.Aging61_90 = providerTotals[2];
        //            providerRow.Aging91_120 = providerTotals[3];
        //            providerRow.Aging120plus = providerTotals[4];
        //            providerRow.Balance = providerTotals[5];
        //        } else {
        //            rows.splice(rows.indexOf(providerRow), 1);
        //        }
        //    }

        //    return rows;
        //};

        //$scope.providerGridOptions = {
        //    columnDefs: [
        //        {
        //            headerName: "Provider",
        //            field: "ServiceFrom",
        //            flex: 2.5,
        //            cellClass: getCellClass,
        //            filter: 'customProviderFilter',
        //            cellRenderer: function (params) {
        //                const d = params.data;
        //                if (d?.rowType === 'provider') {
        //                    const expanded = !!$scope.providerExpandedMap[d.providerRowId];
        //                    return `<span class="toggle-icon">${expanded ? '▼' : '▶'}</span> ${d.ServiceFrom}`;
        //                }
        //                if (d?.rowType === 'office') {
        //                    const expanded = !!$scope.officeExpandedMap[d.officeRowId];
        //                    return `<span class="toggle-icon">${expanded ? '▼' : '▶'}</span> ${d.ServiceFrom}`;
        //                }
        //                return d?.ServiceFrom || '';
        //            }
        //        },
        //        { headerName: "Claim Date", field: "ClaimDate", flex: 1.5, cellClass: getCellClass },
        //        { headerName: "Patient", field: "Patient", flex: 2, cellClass: getCellClass, filter: 'customProviderPatientTextFilter' },
        //        { headerName: "CPT", field: "CPT", flex: 1, cellClass: getCellClass },
        //        {
        //            headerName: "Claim No",
        //            field: "ClaimNo",
        //            flex: 1.5,
        //            cellClass: getCellClass,
        //            cellRenderer: function (params) {
        //                if (!params.data || params.data.rowType !== 'lineItem' || !params.value) {
        //                    return params.value || '';
        //                }

        //                const container = document.createElement('span');
        //                container.className = 'claim-arrow-cell';

        //                const text = document.createElement('span');
        //                text.innerText = params.value;

        //                const icon = document.createElement('i');
        //                icon.className = 'icons__w16-- drawarrow__w16--l claim-arrow-icon';

        //                icon.addEventListener('click', function (e) {
        //                    e.stopPropagation();
        //                    $scope.$applyAsync(() => {
        //                        $scope.navtoClaimSummaryInNewTab(params.data);
        //                    });
        //                });

        //                container.appendChild(text);
        //                container.appendChild(icon);

        //                return container;
        //            }
        //        },
        //        { headerName: "0-30", field: "Aging0_30", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "31-60", field: "Aging31_60", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "61-90", field: "Aging61_90", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "91-120", field: "Aging91_120", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "120+", field: "Aging120plus", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "Balance", field: "Balance", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter }
        //    ],
        //    components: {
        //        customProviderFilter: CustomProviderFilter,
        //        customProviderPatientTextFilter: CustomProviderPatientTextFilter,
        //    },
        //    context: { $scope: $scope },
        //    defaultColDef: {
        //        resizable: true,
        //        sortable: false,
        //        filter: false,
        //        suppressMovable: true
        //    },
        //    rowHeight: $scope.defaultRowHeight,
        //    suppressRowTransform: true,
        //    getRowStyle: function (params) {
        //        const type = params.data?.rowType;
        //        if (type === 'provider') return { fontWeight: 'bold', backgroundColor: '#f2f2f2' };
        //        if (type === 'office') return { fontWeight: 'bold', backgroundColor: '#d9edf7' };
        //        if (type === 'total') return { fontWeight: 'bold', backgroundColor: '#e0f7fa' };
        //        if (type === 'overallTotal') return { fontWeight: 'bold', backgroundColor: '#b2dfdb' };
        //        return {};
        //    },
        //    onGridReady: function (params) {
        //        $scope.gridApi = params.api;
        //        $scope.gridColumnApi = params.columnApi;

        //        // Restore hidden state
        //        setTimeout(function () {
        //            $scope.gridApi.forEachNode(function (node) {
        //                if (node.data && node.data.hidden) {
        //                    if (typeof node.setRowHeight === 'function') node.setRowHeight(0);
        //                }
        //            });
        //            $scope.gridApi.onRowHeightChanged();
        //        }, 0);

        //        // Add compact row CSS
        //        const style = document.createElement('style');
        //        style.innerHTML = `
        //    [class*="ag-theme-"] .ag-row { padding-top: 0 !important; padding-bottom: 0 !important; }
        //    [class*="ag-theme-"] .ag-cell { padding-top: 2px !important; padding-bottom: 2px !important; }

        //   .claim-arrow-cell { display: inline-flex;align-items: center; gap: 6px; white-space: nowrap;line-height: normal; }
        //   .claim-arrow-icon { display: inline-flex; align-items: center;cursor: pointer; }
        //`;
        //        document.head.appendChild(style);

        //        // Load initial data
        //        if (typeof $scope.gridApi.setGridOption === 'function') {
        //            $scope.gridApi.setGridOption('rowData', buildDynamicARProviderGrid($scope.AllARReportDetails));
        //        } else {
        //            $scope.gridApi.setRowData(buildDynamicARProviderGrid($scope.AllARReportDetails));
        //        }
        //    },
        //    onCellClicked: function (params) {
        //        if (!params.data) return;

        //        // PROVIDER accordion
        //        if (params.data.rowType === 'provider') {
        //            const providerKey = params.data.providerRowId;
        //            const expanded = !$scope.providerExpandedMap[providerKey];
        //            $scope.providerExpandedMap[providerKey] = expanded;

        //            const officeNodes = [];
        //            $scope.gridApi.forEachNode(function (node) {
        //                if (node.data && node.data.providerRowId === providerKey && node.data.rowType !== 'provider') {
        //                    node.data.hidden = !expanded;
        //                    if (typeof node.setRowHeight === 'function') {
        //                        node.setRowHeight(expanded ? $scope.defaultRowHeight : 0);
        //                    }
        //                    officeNodes.push(node);

        //                    // cascade office expansion state
        //                    if (node.data.rowType === 'office') {
        //                        $scope.officeExpandedMap[node.data.officeRowId] = expanded;
        //                    }
        //                }
        //            });
        //            $scope.gridApi.refreshCells({ rowNodes: officeNodes.concat([params.node]), columns: ["ServiceFrom"], force: true });
        //            $scope.gridApi.onRowHeightChanged();
        //        }

        //        // OFFICE accordion
        //        if (params.data.rowType === 'office') {
        //            const officeKey = params.data.officeRowId;
        //            const expanded = !$scope.officeExpandedMap[officeKey];
        //            $scope.officeExpandedMap[officeKey] = expanded;

        //            const affectedNodes = [];
        //            $scope.gridApi.forEachNode(function (node) {
        //                if (node.data && node.data.officeRowId === officeKey && node.data.rowType === 'lineItem') {
        //                    node.data.hidden = !expanded;
        //                    if (typeof node.setRowHeight === 'function') {
        //                        node.setRowHeight(expanded ? $scope.defaultRowHeight : 0);
        //                    }
        //                    affectedNodes.push(node);
        //                }
        //            });
        //            $scope.gridApi.refreshCells({ rowNodes: affectedNodes.concat([params.node]), columns: ["ServiceFrom"], force: true });
        //            $scope.gridApi.onRowHeightChanged();
        //        }
        //    }
        //};

        // -------------------- UTILITY FUNCTIONS --------------------

        function buildProviderTotals(providerRows, base) {
            const totals = sumAging(providerRows);
            return {
                ...base,
                rowType: 'PROVIDER_TOTAL',
                BranchName: '',
                PatientDisplayName: '',
                ClaimDate: '',
                CPT: '',
                ClaimNo: '',
                ...totals
            };
        }

        // -------------------- MAP LINE ITEM --------------------
        function mapProviderCptRow(item) {
            const aging0_30 = parseFloat(item.zerotoThirty || 0);
            const aging31_60 = parseFloat(item.ThirtytoSixty || 0);
            const aging61_90 = parseFloat(item.SixtytoNinety || 0);
            const aging91_120 = parseFloat(item.NinetytoOnehundredtwenty || 0);
            const aging120plus = parseFloat(item.MorethanOnehundredtwenty || 0);

            return {
                BillingProviderName: item.BillingProviderName || 'Unknown Provider',
                BranchName: item.BranchName || 'Unknown Office',
                PatientDisplayName: `${item.PatientFullName || ''} (${item.PatientMrNo || ''})`,
                ServiceLineKey: `${item.PatientClaimNumber || ''}-${item.CPT || ''}`,

                ServiceFrom: USformatDate(item.DOSfrom?.split('T')[0]),
                ClaimDate: USformatDate(item.ClaimDate),
                CPT: item.CPT || '',
                ClaimNo: item.PatientClaimNumber || '',

                Aging0_30: aging0_30,
                Aging31_60: aging31_60,
                Aging61_90: aging61_90,
                Aging91_120: aging91_120,
                Aging120plus: aging120plus,

                Balance: aging0_30 + aging31_60 + aging61_90 + aging91_120 + aging120plus,

                rowType: 'CPT'
            };
        }

        // -------------------- BUILD DYNAMIC PROVIDER GRID --------------------
        function buildDynamicARProviderGrid(data) {
            const flatRows = [];

            const groupedByProvider = _.groupBy(data, 'BillingProviderName');

            Object.entries(groupedByProvider).forEach(([provider, providerItems]) => {
                const providerRows = [];

                const groupedByOffice = _.groupBy(providerItems, 'BranchName');

                Object.entries(groupedByOffice).forEach(([office, officeItems]) => {
                    const officeRows = [];

                    const groupedByPatient = _.groupBy(
                        officeItems,
                        i => `${i.PatientFullName}-${i.PatientMrNo}`
                    );

                    Object.values(groupedByPatient).forEach(patientItems => {
                        const patientRows = patientItems.map(mapProviderCptRow);

                        flatRows.push(...patientRows);
                        officeRows.push(...patientRows);
                        providerRows.push(...patientRows);

                        // 🔹 Patient Total
                        flatRows.push(buildPatientTotals(patientRows, patientRows[0]));
                    });

                    // 🔹 Office Total
                    flatRows.push(buildOfficeTotals(officeRows, officeRows[0]));
                });

                // 🔹 Provider Total
                flatRows.push(buildProviderTotals(providerRows, providerRows[0]));
            });

            return flatRows;
        }

        // -------------------- PROVIDER GRID OPTIONS --------------------
        $scope.providerGridOptions = {
            treeData: true,

            getDataPath: function (data) {
                if (!data) return [];

                const safe = v => (v != null ? v : '');

                switch (data.rowType) {
                    case 'PROVIDER_TOTAL':
                        return [safe(data.BillingProviderName)];
                    case 'OFFICE_TOTAL':
                        return [safe(data.BillingProviderName), safe(data.BranchName)];
                    case 'PATIENT_TOTAL':
                        return [safe(data.BillingProviderName), safe(data.BranchName), safe(data.PatientDisplayName)];
                    default: // CPT / line items
                        return [
                            safe(data.BillingProviderName),
                            safe(data.BranchName),
                            safe(data.PatientDisplayName),
                            safe(data.ServiceLineKey)
                        ];
                }
            },

            autoGroupColumnDef: {
                headerName: 'Provider / Office / Patient',
                flex: 2.5,
                //filter: 'customProviderFilter',
                cellRendererParams: {
                    suppressCount: true,
                    innerRenderer: function (params) {
                        const data = params.data;
                        if (!data) return '';

                        if (params.node.level === 0) return data.BillingProviderName; // Provider
                        if (params.node.level === 1) return data.BranchName;           // Office
                        if (params.node.level === 2) return data.PatientDisplayName;   // Patient
                        return '';
                    }
                }
            },

            columnDefs: [
                { headerName: "Claim Date", field: "ClaimDate", flex: 1.5, cellClass: getCellClass },
                { headerName: "CPT", field: "CPT", flex: 1, cellClass: getCellClass },
                { headerName: "Claim No", field: "ClaimNo", flex: 1.5, cellClass: getCellClass },
                { headerName: "0-30", field: "Aging0_30", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
                { headerName: "31-60", field: "Aging31_60", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
                { headerName: "61-90", field: "Aging61_90", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
                { headerName: "91-120", field: "Aging91_120", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
                { headerName: "120+", field: "Aging120plus", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
                { headerName: "Balance", field: "Balance", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter }
            ],

            //components: {
            //    customProviderFilter: CustomProviderFilter,
            //    customProviderPatientTextFilter: CustomProviderPatientTextFilter
            //},

            defaultColDef: {
                resizable: true,
                sortable: false,
                filter: false,
                suppressMovable: true
            },

            getRowStyle: function (params) {
                const type = params.data?.rowType;

                if (type === 'PROVIDER_TOTAL') return { fontWeight: '600', backgroundColor: '#F5F7FA' };
                if (type === 'OFFICE_TOTAL') return { fontWeight: '600', backgroundColor: '#E8F0FE', borderLeft: '4px solid #4285F4' };
                if (type === 'PATIENT_TOTAL') return { fontWeight: '600', backgroundColor: '#EAF7F0', borderLeft: '4px solid #34A853' };
                return {};
            },

            onGridReady: function (params) {
                $scope.gridApi = params.api;
                $scope.gridColumnApi = params.columnApi;

                // Load data
                //$scope.gridApi.setRowData(buildDynamicARProviderGrid($scope.AllARReportDetails));
                if (typeof $scope.gridApi.setGridOption === 'function') {
                    $scope.gridApi.setGridOption('rowData', buildDynamicARProviderGrid($scope.AllARReportDetails));
                } else {
                    $scope.gridApi.setRowData(buildDynamicARProviderGrid($scope.AllARReportDetails));
                }
            }
        };


        $scope.initProviderARGrid = function () {
            const gridDiv = document.getElementById('providerARGrid');
            if (gridDiv) {
                $scope.providerExpandedMap = {};
                $scope.officeExpandedMap = {};
                $scope.providerGridOptions.rowData = buildDynamicARProviderGrid($scope.AllARReportDetails);
                $scope.gridApi = agGrid.createGrid(gridDiv, $scope.providerGridOptions);
            }
        };




        /* Aging Detail ( By Patient) */

        function PatientCustomTextFilter() { }

        PatientCustomTextFilter.prototype.init = function (params) {
            this.params = params;
            this.patientSearchValue = '';
            this.selectedPatient = '';
            this.value = '';
            this.selectedOffice = '';
            this.visibleRowIds = new Set();

            const allData = $scope.AllARReportDetails || [];

            this.eGui = document.createElement('div');
            this.eGui.style.padding = '10px';
            this.eGui.style.width = '260px';
            this.eGui.style.fontFamily = 'Arial';
            this.eGui.style.boxSizing = 'border-box';

            const styleInput = 'width: 100%; padding: 6px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;';
            const styleSelect = styleInput;

            // Patient Search Input
            const patientInput = document.createElement('input');
            patientInput.type = 'text';
            patientInput.placeholder = 'Search Patient';
            patientInput.style = styleInput;
            patientInput.id = 'patientFilterText';
            this.eGui.appendChild(patientInput);

            // Patient Dropdown
            const patientSelect = document.createElement('select');
            patientSelect.id = 'patientDropdown';
            patientSelect.style = styleSelect;

            const defaultPatientOption = document.createElement('option');
            defaultPatientOption.value = '';
            defaultPatientOption.text = 'All';
            patientSelect.appendChild(defaultPatientOption);

            const patientNames = Array.from(new Set(allData.filter(r => r.PatientBalance > 0).map(r => r.PatientFullName).filter(Boolean)));
            patientNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                patientSelect.appendChild(option);
            });
            this.eGui.appendChild(patientSelect);

            // Office Wrapper
            const officeWrapper = document.createElement('div');
            officeWrapper.style.display = 'none';
            officeWrapper.id = 'officeWrapper';

            const officeInput = document.createElement('input');
            officeInput.type = 'text';
            officeInput.placeholder = 'Search Office';
            officeInput.style = styleInput;
            officeInput.id = 'officeFilterText';
            officeWrapper.appendChild(officeInput);

            const officeSelect = document.createElement('select');
            officeSelect.id = 'officeDropdown';
            officeSelect.style = styleSelect;

            const defaultOfficeOption = document.createElement('option');
            defaultOfficeOption.value = '';
            defaultOfficeOption.text = 'All';
            officeSelect.appendChild(defaultOfficeOption);

            const officeNames = Array.from(new Set(allData.map(r => r.BranchName).filter(Boolean)));
            officeNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                officeSelect.appendChild(option);
            });
            officeWrapper.appendChild(officeSelect);
            this.eGui.appendChild(officeWrapper);

            // Event Listeners
            patientInput.addEventListener('input', (e) => {
                this.patientSearchValue = e.target.value.trim().toLowerCase();
                this.selectedPatient = '';
                patientSelect.value = '';
                this.toggleOfficeVisibility();
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            patientSelect.addEventListener('change', (e) => {
                this.selectedPatient = e.target.value;
                this.patientSearchValue = '';
                patientInput.value = '';

                if (!this.selectedPatient) {
                    // Patient 'All' selected
                    this.officeSearchValue = '';
                    this.selectedOffice = '';
                    officeInput.value = '';
                    officeSelect.value = '';

                    this.resetOfficeDropdown();  // Reset and repopulate
                }

                this.toggleOfficeVisibility();
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });


            officeInput.addEventListener('input', (e) => {
                this.value = e.target.value.trim().toLowerCase();
                this.selectedOffice = '';
                officeSelect.value = '';
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            officeSelect.addEventListener('change', (e) => {
                this.selectedOffice = e.target.value;
                this.value = '';
                officeInput.value = '';
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            this.toggleOfficeVisibility();
            this.buildVisibleRowIds();
        };

        PatientCustomTextFilter.prototype.toggleOfficeVisibility = function () {
            const wrapper = this.eGui.querySelector('#officeWrapper');
            wrapper.style.display = (this.selectedPatient || this.patientSearchValue) ? 'block' : 'none';
        };

        PatientCustomTextFilter.prototype.getGui = function () {
            return this.eGui;
        };

        PatientCustomTextFilter.prototype.isFilterActive = function () {
            return !!this.patientSearchValue || !!this.selectedPatient || !!this.value || !!this.selectedOffice;
        };

        PatientCustomTextFilter.prototype.getModel = function () {
            return {
                patientSearchValue: this.patientSearchValue,
                selectedPatient: this.selectedPatient,
                value: this.value,
                selectedOffice: this.selectedOffice
            };
        };

        PatientCustomTextFilter.prototype.setModel = function (model) {
            this.patientSearchValue = model?.patientSearchValue || '';
            this.selectedPatient = model?.selectedPatient || '';
            this.value = model?.value || '';
            this.selectedOffice = model?.selectedOffice || '';

            this.eGui.querySelector('#patientFilterText').value = this.patientSearchValue;
            this.eGui.querySelector('#patientDropdown').value = this.selectedPatient;
            this.eGui.querySelector('#officeFilterText').value = this.value;
            this.eGui.querySelector('#officeDropdown').value = this.selectedOffice;

            this.toggleOfficeVisibility();
            this.buildVisibleRowIds();
        };

        PatientCustomTextFilter.prototype.buildVisibleRowIds = function () {
            this.visibleRowIds.clear();

            const patientToMatch = (this.selectedPatient || this.patientSearchValue || '').toLowerCase().trim();
            const officeToMatch = (this.selectedOffice || this.value || '').toLowerCase().trim();

            if (!patientToMatch) return;

            const allNodes = [];
            this.params.api.forEachNode(node => allNodes.push(node));

            let includePatientGroup = false;
            let includeOfficeGroup = false;

            for (let i = 0; i < allNodes.length; i++) {
                const node = allNodes[i];
                const row = node.data;
                if (!row) continue;

                const type = row.rowType;

                if (type === 'patient') {
                    const raw = (row.ServiceFrom || '').toLowerCase();
                    const nameMatch = raw.replace(/^patient name:\s*/, '').split('(')[0].trim();
                    includePatientGroup = nameMatch.includes(patientToMatch);
                    includeOfficeGroup = !officeToMatch;
                    if (includePatientGroup) this.visibleRowIds.add(node.id);
                } else if (type === 'office') {
                    const officeName = (row.ServiceFrom || '').toLowerCase().replace(/^office\s*-\s*/, '');
                    includeOfficeGroup = !officeToMatch || officeName.includes(officeToMatch);
                    if (includePatientGroup && includeOfficeGroup) this.visibleRowIds.add(node.id);
                } else if (type === 'total' || type === 'officeTotal') {
                    if (includePatientGroup && includeOfficeGroup) {
                        this.visibleRowIds.add(node.id);
                    }
                } else {
                    if (includePatientGroup && includeOfficeGroup) {
                        this.visibleRowIds.add(node.id);
                    }
                }
            }
        };

        PatientCustomTextFilter.prototype.doesFilterPass = function (params) {
            return this.visibleRowIds.has(params.node.id);
        };

        PatientCustomTextFilter.prototype.resetOfficeDropdown = function () {
            const officeSelect = this.eGui.querySelector('#officeDropdown');

            officeSelect.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'All';
            officeSelect.appendChild(defaultOption);

            const allData = $scope.AllARReportDetails || [];

            const officeNames = Array.from(new Set(
                allData.map(r => r.BranchName).filter(Boolean)
            ));

            officeNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                officeSelect.appendChild(option);
            });
        };

        function getCellClass(params) {
            return (params.data && params.data.rowType) ? 'custom-bold' : '';
        }

        $scope.initPatientARGrid = function () {
            $timeout(function () {
                const gridDiv = document.getElementById('patientARGrid');
                if (gridDiv) {
                    $scope.patientExpandedMap = {};
                    $scope.officeExpandedMap = {};
                    $scope.patientGridOptions.rowData = buildDynamicPatientARGrid($scope.AllARReportDetails);
                    $scope.gridApi = agGrid.createGrid(gridDiv, $scope.patientGridOptions);
                } else {
                    console.error("Element #patientARGrid not found.");
                }
            }, 0);
        };

        $scope.patientExpandedMap = {};

        //$scope.patientGridOptions = {
        //    columnDefs: [
        //        {
        //            headerName: "Patient Name",
        //            field: "ServiceFrom",
        //            flex: 2,
        //            cellClass: getCellClass,
        //            filter: 'patientCustomTextFilter',
        //            cellRenderer: function (params) {
        //                const d = params.data;
        //                if (d?.rowType === 'patient') {
        //                    const expanded = !!$scope.patientExpandedMap[d.patientRowId];
        //                    return `<span class="toggle-icon">${expanded ? '▼' : '▶'}</span> ${d.ServiceFrom}`;
        //                }
        //                if (d?.rowType === 'office') {
        //                    const expanded = !!$scope.officeExpandedMap[d.officeRowId];
        //                    return `<span class="toggle-icon">${expanded ? '▼' : '▶'}</span> ${d.ServiceFrom}`;
        //                }
        //                return d?.ServiceFrom || '';
        //            }
        //        },
        //        { headerName: "Claim Date", field: "ClaimDate", flex: 1.5, cellClass: getCellClass },
        //        { headerName: "CPT", field: "CPT", flex: 1, cellClass: getCellClass },
        //        {
        //            headerName: "Claim No",
        //            field: "ClaimNo",
        //            flex: 1.5,
        //            cellClass: getCellClass,
        //            cellRenderer: function (params) {
        //                if (!params.data || params.data.rowType !== 'lineItem' || !params.value) {
        //                    return params.value || '';
        //                }

        //                const container = document.createElement('span');
        //                container.className = 'claim-arrow-cell';

        //                const text = document.createElement('span');
        //                text.innerText = params.value;

        //                const icon = document.createElement('i');
        //                icon.className = 'icons__w16-- drawarrow__w16--l claim-arrow-icon';

        //                icon.addEventListener('click', function (e) {
        //                    e.stopPropagation();
        //                    $scope.$applyAsync(() => {
        //                        $scope.navtoClaimSummaryInNewTab(params.data);
        //                    });
        //                });

        //                container.appendChild(text);
        //                container.appendChild(icon);

        //                return container;
        //            }
        //        },
        //        { headerName: "0-30", field: "Aging0_30", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "31-60", field: "Aging31_60", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "61-90", field: "Aging61_90", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "91-120", field: "Aging91_120", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "120+", field: "Aging120plus", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "Balance", field: "Balance", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter }
        //    ],
        //    components: {
        //        patientCustomTextFilter: PatientCustomTextFilter,
        //    },
        //    context: { $scope: $scope },
        //    defaultColDef: {
        //        resizable: true,
        //        sortable: false,
        //        filter: false,
        //        suppressMovable: true
        //    },
        //    rowHeight: $scope.defaultRowHeight,
        //    suppressRowTransform: true,
        //    getRowStyle: function (params) {
        //        const type = params.data?.rowType;
        //        if (type === 'patient') return { fontWeight: 'bold', backgroundColor: '#f2f2f2' };
        //        if (type === 'office') return { fontWeight: 'bold', backgroundColor: '#d9edf7' };
        //        if (type === 'total') return { fontWeight: 'bold', backgroundColor: '#e0f7fa' };
        //        if (type === 'overallTotal') return { fontWeight: 'bold', backgroundColor: '#b2dfdb' };
        //        return {};
        //    },
        //    onGridReady: function (params) {
        //        $scope.gridApi = params.api;
        //        $scope.gridColumnApi = params.columnApi;

        //        setTimeout(function () {
        //            $scope.gridApi.forEachNode(function (node) {
        //                if (node.data && node.data.hidden) {
        //                    if (typeof node.setRowHeight === 'function') node.setRowHeight(0);
        //                }
        //            });
        //            $scope.gridApi.onRowHeightChanged();
        //        }, 0);

        //        const style = document.createElement('style');
        //        style.innerHTML = `
        //    [class*="ag-theme-"] .ag-row { padding-top: 0 !important; padding-bottom: 0 !important; }
        //    [class*="ag-theme-"] .ag-cell { padding-top: 2px !important; padding-bottom: 2px !important; }

        //   .claim-arrow-cell { display: inline-flex;align-items: center; gap: 6px; white-space: nowrap;line-height: normal; }
        //   .claim-arrow-icon { display: inline-flex; align-items: center;cursor: pointer; }
        //`;
        //        document.head.appendChild(style);
        //    },
        //    onCellClicked: function (params) {
        //        if (!params.data) return;

        //        // PATIENT accordion
        //        if (params.data.rowType === 'patient') {
        //            const patientKey = params.data.patientRowId;
        //            const expanded = !$scope.patientExpandedMap[patientKey];
        //            $scope.patientExpandedMap[patientKey] = expanded;

        //            const officeNodes = [];

        //            $scope.gridApi.forEachNode(function (node) {

        //                if (node.data && node.data.patientRowId === patientKey && node.data.rowType !== 'patient') {
        //                    node.data.hidden = !expanded;
        //                    if (typeof node.setRowHeight === 'function') {
        //                        node.setRowHeight(expanded ? $scope.defaultRowHeight : 0);
        //                    }
        //                    officeNodes.push(node);

        //                    // if collapsing patient → also collapse its offices
        //                    if (node.data.rowType === 'office') {
        //                        $scope.officeExpandedMap[node.data.officeRowId] = expanded;
        //                    }
        //                }
        //            });

        //            $scope.gridApi.refreshCells({ rowNodes: officeNodes.concat([params.node]), columns: ["ServiceFrom"], force: true });
        //            $scope.gridApi.onRowHeightChanged();
        //        }

        //        // OFFICE accordion
        //        if (params.data.rowType === 'office') {
        //            const officeKey = params.data.officeRowId;
        //            const expanded = !$scope.officeExpandedMap[officeKey];
        //            $scope.officeExpandedMap[officeKey] = expanded;
        //            const affectedNodes = [];
        //            $scope.gridApi.forEachNode(function (node) {
        //                if (node.data && node.data.officeRowId === officeKey && node.data.rowType === 'lineItem') {
        //                    node.data.hidden = !expanded;
        //                    if (typeof node.setRowHeight === 'function') {
        //                        node.setRowHeight(expanded ? $scope.defaultRowHeight : 0);
        //                    }
        //                    affectedNodes.push(node);
        //                }
        //            });

        //            $scope.gridApi.refreshCells({
        //                rowNodes: affectedNodes.concat([params.node]),
        //                columns: ["ServiceFrom"],
        //                force: true
        //            });

        //            $scope.gridApi.onRowHeightChanged();
        //        }
        //    }
        //};

        //function buildDynamicPatientARGrid(data) {
        //    let rowId = 1;
        //    const rows = [];
        //    const grouped = {};

        //    // Group data by patient → office
        //    (data || []).forEach(item => {
        //        const patientName = item.PatientFullName;
        //        const office = item.BranchName || '';
        //        if (!patientName) return;
        //        if (!grouped[patientName]) grouped[patientName] = {};
        //        if (!grouped[patientName][office]) grouped[patientName][office] = [];

        //        grouped[patientName][office].push(item);
        //    });

        //    for (let patient in grouped) {
        //        const patientOffices = grouped[patient];
        //        const patientTotals = [0, 0, 0, 0, 0, 0];
        //        let hasValidPatientData = false;

        //        const firstOffice = Object.keys(patientOffices)[0];
        //        const firstItem = patientOffices[firstOffice][0];
        //        const patientMrNo = firstItem.PatientMrNo || '';
        //        const patientKey = `patient-${patientMrNo || patient}`;

        //        // We'll fill totals after processing offices
        //        const patientRow = {
        //            id: rowId++,
        //            ServiceFrom: `Patient Name: ${patient} (${patientMrNo})`,
        //            patientRowId: patientKey,
        //            rowType: 'patient',
        //            Aging0_30: 0,
        //            Aging31_60: 0,
        //            Aging61_90: 0,
        //            Aging91_120: 0,
        //            Aging120plus: 0,
        //            Balance: 0
        //        };
        //        rows.push(patientRow);

        //        for (let office in patientOffices) {
        //            const officeEntries = patientOffices[office];
        //            const validOfficeEntries = officeEntries.filter(entry => entry.PatientBalance > 0);
        //            if (!validOfficeEntries.length) continue;

        //            hasValidPatientData = true;
        //            const officeTotals = [0, 0, 0, 0, 0, 0];
        //            const officeKey = `office-${patientKey}-${office}`;

        //            // We'll fill totals after processing items
        //            const officeRow = {
        //                id: rowId++,
        //                ServiceFrom: `Office - ${office}`,
        //                officeRowId: officeKey,
        //                patientRowId: patientKey,
        //                rowType: 'office',
        //                Aging0_30: 0,
        //                Aging31_60: 0,
        //                Aging61_90: 0,
        //                Aging91_120: 0,
        //                Aging120plus: 0,
        //                Balance: 0,
        //                hidden: true
        //            };
        //            rows.push(officeRow);

        //            validOfficeEntries.forEach(entry => {
        //                const patientBalance = entry.PatientBalance || 0;
        //                if (patientBalance <= 0) return;


        //                const a0 = entry["zerotoThirty"] ? patientBalance : 0;
        //                const a30 = entry["ThirtytoSixty"] ? patientBalance : 0;
        //                const a60 = entry["SixtytoNinety"] ? patientBalance : 0;
        //                const a90_120 = entry["NinetytoOnehundredtwenty"] ? patientBalance : 0;
        //                const a120plus = entry["MorethanOnehundredtwenty"] ? patientBalance : 0;
        //                const total = a0 + a30 + a60 + a90_120 + a120plus;

        //                rows.push({
        //                    id: rowId++,
        //                    ServiceFrom: USformatDate(entry.DOSfrom?.split('T')[0]),
        //                    ClaimDate: USformatDate(entry.ClaimDate),
        //                    CPT: entry.CPT,
        //                    ClaimNo: entry.PatientClaimNumber,

        //                    PatientClaimId: entry.PatientClaimId,
        //                    PatientId: entry.PatientId,
        //                    AppointmentId: entry.AppointmentId,
        //                    VisitId: entry.VisitId,
        //                    SuperBillId: entry.SuperBillId,
        //                    ResponcibilityId: entry.ResponcibilityId,
        //                    RenderingProviderId: entry.RenderingProviderId,
        //                    ClaimExpiryDate: entry.ClaimExpiryDate,

        //                    Aging0_30: a0,
        //                    Aging31_60: a30,
        //                    Aging61_90: a60,
        //                    Aging91_120: a90_120,
        //                    Aging120plus: a120plus,
        //                    Balance: total,
        //                    officeRowId: officeKey,
        //                    patientRowId: patientKey,
        //                    rowType: 'lineItem',
        //                    hidden: true
        //                });

        //                officeTotals[0] += a0;
        //                officeTotals[1] += a30;
        //                officeTotals[2] += a60;
        //                officeTotals[3] += a90_120;
        //                officeTotals[4] += a120plus;
        //                officeTotals[5] += total;
        //            });

        //            // Assign office totals directly into office row
        //            officeRow.Aging0_30 = officeTotals[0];
        //            officeRow.Aging31_60 = officeTotals[1];
        //            officeRow.Aging61_90 = officeTotals[2];
        //            officeRow.Aging91_120 = officeTotals[3];
        //            officeRow.Aging120plus = officeTotals[4];
        //            officeRow.Balance = officeTotals[5];

        //            for (let i = 0; i < 6; i++) patientTotals[i] += officeTotals[i];
        //        }

        //        if (!hasValidPatientData) {
        //            rows.splice(rows.indexOf(patientRow), 1);
        //            continue;
        //        }

        //        // Assign patient totals directly into patient row
        //        patientRow.Aging0_30 = patientTotals[0];
        //        patientRow.Aging31_60 = patientTotals[1];
        //        patientRow.Aging61_90 = patientTotals[2];
        //        patientRow.Aging91_120 = patientTotals[3];
        //        patientRow.Aging120plus = patientTotals[4];
        //        patientRow.Balance = patientTotals[5];
        //    }

        //    return rows;
        //}

        function sumPatientAging(rows) {
            return rows.reduce((t, r) => {
                t.Aging0_30 += r.Aging0_30 || 0;
                t.Aging31_60 += r.Aging31_60 || 0;
                t.Aging61_90 += r.Aging61_90 || 0;
                t.Aging91_120 += r.Aging91_120 || 0;
                t.Aging120plus += r.Aging120plus || 0;
                t.Balance += r.Balance || 0;
                return t;
            }, {
                Aging0_30: 0,
                Aging31_60: 0,
                Aging61_90: 0,
                Aging91_120: 0,
                Aging120plus: 0,
                Balance: 0
            });
        }

        function buildPatientLevelTotal(rows, base) {
            const totals = sumPatientAging(rows);
            return {
                ...base,
                rowType: 'PATIENT_TOTAL',
                ClaimDate: '',
                CPT: '',
                ClaimNo: '',
                ...totals
            };
        }

        function buildOfficeLevelTotal(rows, base) {
            const totals = sumPatientAging(rows);
            return {
                ...base,
                rowType: 'OFFICE_TOTAL',
                ClaimDate: '',
                CPT: '',
                ClaimNo: '',
                ...totals
            };
        }

        $scope.patientGridOptions = {
            treeData: true,

            getDataPath: function (data) {

                // Patient total (top level)
                if (data.rowType === 'PATIENT_TOTAL') {
                    return [data.PatientDisplayName];
                }

                // Office total
                if (data.rowType === 'OFFICE_TOTAL') {
                    return [data.PatientDisplayName, data.BranchName];
                }

                // CPT rows
                return [
                    data.PatientDisplayName,
                    data.BranchName,
                    data.ServiceLineKey
                ];
            },

            autoGroupColumnDef: {
                headerName: 'Patient / Office',
                width: 350,
                //filter: 'patientCustomTextFilter',
                filterParams: {
                    applyMiniFilterWhileTyping: true
                },
                cellRendererParams: {
                    suppressCount: true,
                    innerRenderer: function (params) {
                        const d = params.data;
                        if (!d) return '';

                        if (params.node.level === 0) return d.PatientDisplayName;
                        if (params.node.level === 1) return d.BranchName;

                        return '';
                    }
                }
            },

            columnDefs: [
                { headerName: "Claim Date", field: "ClaimDate", width: 140 },
                { headerName: "CPT", field: "CPT", width: 120 },
                {
                    headerName: "Claim No",
                    field: "ClaimNo",
                    width: 140,
                    cellRenderer: function (params) {
                        if (params.data?.rowType !== 'CPT') return params.value || '';

                        const span = document.createElement('span');
                        span.className = 'claim-arrow-cell';

                        const text = document.createElement('span');
                        text.innerText = params.value;

                        const icon = document.createElement('i');
                        icon.className = 'icons__w16-- drawarrow__w16--l claim-arrow-icon';
                        icon.onclick = e => {
                            e.stopPropagation();
                            $scope.$applyAsync(() => {
                                $scope.navtoClaimSummaryInNewTab(params.data);
                            });
                        };

                        span.appendChild(text);
                        span.appendChild(icon);
                        return span;
                    }
                },
                { headerName: "0-30", field: "Aging0_30", width: 120, valueFormatter: currencyFormatter },
                { headerName: "31-60", field: "Aging31_60", width: 120, valueFormatter: currencyFormatter },
                { headerName: "61-90", field: "Aging61_90", width: 120, valueFormatter: currencyFormatter },
                { headerName: "91-120", field: "Aging91_120", width: 120, valueFormatter: currencyFormatter },
                { headerName: "120+", field: "Aging120plus", width: 120, valueFormatter: currencyFormatter },
                { headerName: "Balance", field: "Balance", width: 120, valueFormatter: currencyFormatter }
            ],
            //components: {
            //    patientCustomTextFilter: PatientCustomTextFilter
            //},
            getRowStyle: function (params) {
                const t = params.data?.rowType;

                if (t === 'PATIENT_TOTAL') {
                    return { fontWeight: '600', backgroundColor: '#F5F7FA' };
                }
                if (t === 'OFFICE_TOTAL') {
                    return {
                        fontWeight: '600',
                        backgroundColor: '#EAF7F0',
                        borderLeft: '4px solid #34A853'
                    };
                }
                return {};
            }
        };

        function mapPatientCptRow(item) {
            const bal = item.PatientBalance || 0;

            const a0 = item.zerotoThirty ? bal : 0;
            const a30 = item.ThirtytoSixty ? bal : 0;
            const a60 = item.SixtytoNinety ? bal : 0;
            const a90 = item.NinetytoOnehundredtwenty ? bal : 0;
            const a120 = item.MorethanOnehundredtwenty ? bal : 0;

            return {
                PatientDisplayName: `${item.PatientFullName} (${item.PatientMrNo || ''})`,
                BranchName: item.BranchName || 'Unknown Office',
                ServiceLineKey: `${item.PatientClaimNumber}-${item.CPT}`,

                ClaimDate: USformatDate(item.ClaimDate),
                CPT: item.CPT,
                ClaimNo: item.PatientClaimNumber,

                Aging0_30: a0,
                Aging31_60: a30,
                Aging61_90: a60,
                Aging91_120: a90,
                Aging120plus: a120,
                Balance: a0 + a30 + a60 + a90 + a120,

                rowType: 'CPT'
            };
        }

        function buildDynamicPatientARGrid(data) {
            const flatRows = [];

            const byPatient = _.groupBy(
                data.filter(d => d.PatientBalance > 0),
                d => `${d.PatientFullName}-${d.PatientMrNo}`
            );

            Object.values(byPatient).forEach(patientItems => {

                const patientRows = [];
                const patientName = `${patientItems[0].PatientFullName} (${patientItems[0].PatientMrNo || ''})`;

                const byOffice = _.groupBy(patientItems, 'BranchName');

                Object.entries(byOffice).forEach(([office, officeItems]) => {

                    const officeRows = officeItems.map(mapPatientCptRow);

                    flatRows.push(...officeRows);
                    patientRows.push(...officeRows);

                    flatRows.push(
                        buildOfficeLevelTotal(officeRows, officeRows[0])
                    );
                });

                flatRows.push(
                    buildPatientLevelTotal(patientRows, patientRows[0])
                );
            });

            return flatRows;
        }


        /* Aging Detail ( By Insurance) - Start */


        function CustomTextFilter() { }

        CustomTextFilter.prototype.init = function (params) {
            this.params = params;
            this.value = '';
            this.selectedOffice = '';
            this.insuranceValue = '';
            this.selectedInsurance = '';
            this.visibleRowIds = new Set();

            const allData = $scope.AllARReportDetails || [];

            this.eGui = document.createElement('div');
            this.eGui.style.padding = '10px';
            this.eGui.style.width = '260px';
            this.eGui.style.fontFamily = 'Arial';
            this.eGui.style.boxSizing = 'border-box';

            const styleInput = 'width: 100%; padding: 6px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;';
            const styleSelect = styleInput;

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Search Office';
            input.style = styleInput;
            input.id = 'filterText';
            this.eGui.appendChild(input);

            const officeSelect = document.createElement('select');
            officeSelect.id = 'officeDropdown';
            officeSelect.style = styleSelect;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'All';
            officeSelect.appendChild(defaultOption);

            const officeNames = Array.from(new Set(allData.map(r => r.BranchName).filter(Boolean)));
            officeNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                officeSelect.appendChild(option);
            });
            this.eGui.appendChild(officeSelect);

            const insuranceWrapper = document.createElement('div');
            insuranceWrapper.style.display = 'block';
            insuranceWrapper.id = 'insuranceWrapper';

            const insuranceInput = document.createElement('input');
            insuranceInput.type = 'text';
            insuranceInput.placeholder = 'Search Insurance';
            insuranceInput.style = styleInput;
            insuranceInput.id = 'insuranceFilterText';
            insuranceWrapper.appendChild(insuranceInput);

            const insuranceSelect = document.createElement('select');
            insuranceSelect.id = 'insuranceDropdown';
            insuranceSelect.style = styleSelect;

            insuranceWrapper.appendChild(insuranceSelect);
            this.eGui.appendChild(insuranceWrapper);

            // Events
            input.addEventListener('input', (e) => {
                this.value = e.target.value.trim().toLowerCase();
                this.selectedOffice = '';
                officeSelect.value = '';
                this.updateInsuranceOptions();
                //this.toggleInsuranceVisibility();
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            officeSelect.addEventListener('change', (e) => {
                this.selectedOffice = e.target.value;
                this.value = '';
                input.value = '';
                this.updateInsuranceOptions();
                //this.toggleInsuranceVisibility();
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            insuranceInput.addEventListener('input', (e) => {
                this.insuranceValue = e.target.value.trim().toLowerCase();
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            insuranceSelect.addEventListener('change', (e) => {
                this.selectedInsurance = e.target.value;
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            this.updateInsuranceOptions();
            this.buildVisibleRowIds();
            //this.toggleInsuranceVisibility();
        };

        CustomTextFilter.prototype.updateInsuranceOptions = function () {
            const insuranceSelect = this.eGui.querySelector('#insuranceDropdown');
            const insuranceInput = this.eGui.querySelector('#insuranceFilterText');
            insuranceSelect.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'All';
            insuranceSelect.appendChild(defaultOption);
            insuranceInput.value = '';
            this.insuranceValue = '';
            this.selectedInsurance = '';

            const filteredData = ($scope.AllARReportDetails || []).filter(row => {
                if (this.selectedOffice) return row.BranchName === this.selectedOffice;
                return true;
            });

            const insuranceNames = Array.from(new Set(filteredData.map(r => r.MasterPayorName).filter(Boolean)));

            insuranceNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                insuranceSelect.appendChild(option);
            });
        };

        CustomTextFilter.prototype.toggleInsuranceVisibility = function () {
            //const wrapper = this.eGui.querySelector('#insuranceWrapper');
            //wrapper.style.display = (this.selectedOffice || this.value) ? 'block' : 'none';
            insuranceWrapper.style.display = 'block';
        };

        CustomTextFilter.prototype.getGui = function () {
            return this.eGui;
        };

        CustomTextFilter.prototype.isFilterActive = function () {
            return !!this.value || !!this.selectedOffice || !!this.insuranceValue || !!this.selectedInsurance;
        };

        CustomTextFilter.prototype.getModel = function () {
            return {
                value: this.value,
                selectedOffice: this.selectedOffice,
                insuranceValue: this.insuranceValue,
                selectedInsurance: this.selectedInsurance
            };
        };

        CustomTextFilter.prototype.setModel = function (model) {
            this.value = model?.value || '';
            this.selectedOffice = model?.selectedOffice || '';
            this.insuranceValue = model?.insuranceValue || '';
            this.selectedInsurance = model?.selectedInsurance || '';

            const input = this.eGui.querySelector('#filterText');
            const officeSelect = this.eGui.querySelector('#officeDropdown');
            const insuranceInput = this.eGui.querySelector('#insuranceFilterText');
            const insuranceSelect = this.eGui.querySelector('#insuranceDropdown');

            if (input) input.value = this.value;
            if (officeSelect) officeSelect.value = this.selectedOffice;

            this.updateInsuranceOptions();

            if (insuranceInput) insuranceInput.value = this.insuranceValue;
            if (insuranceSelect) insuranceSelect.value = this.selectedInsurance;

            //this.toggleInsuranceVisibility();
            this.buildVisibleRowIds();
        };

        CustomTextFilter.prototype.buildVisibleRowIds = function () {
            this.visibleRowIds.clear();

            const officeToMatch = (this.selectedOffice || this.value || '').toLowerCase().trim();
            const insuranceToMatch = (this.selectedInsurance || this.insuranceValue || '').toLowerCase().trim();

            const allNodes = [];
            this.params.api.forEachNode(node => allNodes.push(node));

            let includeOfficeGroup = false;
            let includeInsuranceGroup = false;

            for (let i = 0; i < allNodes.length; i++) {
                const node = allNodes[i];
                const row = node.data;
                if (!row) continue;

                const type = row.rowType;

                if (type === 'office') {
                    const officeName = (row.ServiceFrom || '').toLowerCase().replace(/^office\s*-\s*/, '');
                    includeOfficeGroup = !officeToMatch || officeName.includes(officeToMatch);
                    // reset insurance flag at each new office
                    includeInsuranceGroup = !insuranceToMatch;
                    if (includeOfficeGroup) {
                        this.visibleRowIds.add(node.id);
                    }
                } else if (type === 'insurance') { // insurance row
                    const insuranceName = (row.ServiceFrom || '').toLowerCase().replace(/^insurance\s*-\s*/, '');
                    includeInsuranceGroup = !insuranceToMatch || insuranceName.includes(insuranceToMatch);

                    if (includeOfficeGroup && includeInsuranceGroup) {
                        this.visibleRowIds.add(node.id);
                    }
                } else if (type === 'total' || type === 'officeTotal' || type === 'insuranceTotal') {
                    // show totals only if their group matches
                    if (includeOfficeGroup && includeInsuranceGroup) {
                        this.visibleRowIds.add(node.id);
                    }
                } else {
                    // data rows
                    if (includeOfficeGroup && includeInsuranceGroup) {
                        this.visibleRowIds.add(node.id);
                    }
                }
            }
        };


        CustomTextFilter.prototype.doesFilterPass = function (params) {
            return this.visibleRowIds.has(params.node.id);
        };


        //Define CustomPatientFilter

        function CustomPatientTextFilter() { }

        CustomPatientTextFilter.prototype.init = function (params) {
            this.params = params;
            this.patientSearchValue = '';
            this.selectedPatient = '';
            this.visibleRowIds = new Set();

            const allData = $scope.AllARReportDetails || [];

            this.eGui = document.createElement('div');
            this.eGui.style.padding = '10px';
            this.eGui.style.width = '260px';
            this.eGui.style.fontFamily = 'Arial';
            this.eGui.style.boxSizing = 'border-box';

            const styleInput = 'width: 100%; padding: 6px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;';
            const styleSelect = styleInput;

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Search Patient';
            input.style = styleInput;
            input.id = 'patientFilterText';
            this.eGui.appendChild(input);

            const patientSelect = document.createElement('select');
            patientSelect.id = 'patientDropdown';
            patientSelect.style = styleSelect;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'All';
            patientSelect.appendChild(defaultOption);

            const patientNames = Array.from(new Set(
                allData
                    .filter(r => r.InsuranceBalance > 0)
                    .map(r => r.PatientFullName)
                    .filter(Boolean)
            ));

            patientNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                patientSelect.appendChild(option);
            });

            this.eGui.appendChild(patientSelect);

            input.addEventListener('input', (e) => {
                this.patientSearchValue = e.target.value.trim().toLowerCase();
                this.selectedPatient = '';
                patientSelect.value = '';
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            patientSelect.addEventListener('change', (e) => {
                this.selectedPatient = e.target.value;
                this.patientSearchValue = '';
                input.value = '';
                this.buildVisibleRowIds();
                params.filterChangedCallback();
            });

            this.buildVisibleRowIds();
        };

        CustomPatientTextFilter.prototype.getGui = function () {
            return this.eGui;
        };

        CustomPatientTextFilter.prototype.isFilterActive = function () {
            return !!this.patientSearchValue || !!this.selectedPatient;
        };

        CustomPatientTextFilter.prototype.getModel = function () {
            return {
                patientSearchValue: this.patientSearchValue,
                selectedPatient: this.selectedPatient
            };
        };

        CustomPatientTextFilter.prototype.setModel = function (model) {
            this.patientSearchValue = model?.patientSearchValue || '';
            this.selectedPatient = model?.selectedPatient || '';

            const input = this.eGui.querySelector('#patientFilterText');
            const patientSelect = this.eGui.querySelector('#patientDropdown');

            if (input) input.value = this.patientSearchValue;
            if (patientSelect) patientSelect.value = this.selectedPatient;

            this.buildVisibleRowIds();
        };

        CustomPatientTextFilter.prototype.buildVisibleRowIds = function () {
            this.visibleRowIds.clear();

            const patientToMatch = (this.selectedPatient || this.patientSearchValue || '').toLowerCase().trim();
            if (!patientToMatch) return;

            const allNodes = [];
            this.params.api.forEachNode(node => allNodes.push(node));

            let currentOfficeNode = null;
            let currentInsuranceNode = null;
            let currentOfficeRowId = null;
            let currentInsuranceRowId = null;

            for (let i = 0; i < allNodes.length; i++) {
                const node = allNodes[i];
                const row = node.data;
                if (!row) continue;

                const type = row.rowType;

                if (type === 'office') {
                    currentOfficeNode = node;
                    currentOfficeRowId = node.id;
                }

                if (type === 'insurance') {
                    currentInsuranceNode = node;
                    currentInsuranceRowId = node.id;
                }

                if (row.PatientFullName && row.PatientFullName.toLowerCase().includes(patientToMatch)) {
                    this.visibleRowIds.add(node.id);

                    if (currentInsuranceRowId) {
                        this.visibleRowIds.add(currentInsuranceRowId);
                    }

                    if (currentOfficeRowId) {
                        this.visibleRowIds.add(currentOfficeRowId);
                    }
                }
            }
        };

        CustomPatientTextFilter.prototype.doesFilterPass = function (params) {
            return this.visibleRowIds.has(params.node.id);
        };





        $scope.initInsuranceARGrid = function () {
            $timeout(function () {
                const gridDiv = document.getElementById('insuranceARGrid');
                if (gridDiv) {
                    $scope.insuranceExpandedMap = {};
                    $scope.officeExpandedMap = {};
                    $scope.insuranceGridOptions.rowData = buildDynamicInsuranceAgingGrid($scope.AllARReportDetails);
                    $scope.gridApi = agGrid.createGrid(gridDiv, $scope.insuranceGridOptions);
                } else {
                    console.error("Element #insuranceARGrid not found.");
                }
            }, 0);
        };

        // Track expanded state for each insurance
        $scope.insuranceExpandedMap = {};



        function sumAging(rows) {
            return rows.reduce((t, r) => {
                t.Aging0_30 += r.Aging0_30 || 0;
                t.Aging31_60 += r.Aging31_60 || 0;
                t.Aging61_90 += r.Aging61_90 || 0;
                t.Aging91_120 += r.Aging91_120 || 0;
                t.Aging120plus += r.Aging120plus || 0;
                t.Balance += r.Balance || 0;
                return t;
            }, {
                Aging0_30: 0,
                Aging31_60: 0,
                Aging61_90: 0,
                Aging91_120: 0,
                Aging120plus: 0,
                Balance: 0
            });
        }

        function buildPatientTotals(patientRows, base) {
            const totals = sumAging(patientRows);

            return {
                ...base,
                rowType: 'PATIENT_TOTAL',

                ClaimDate: '',
                CPT: '',
                ClaimNo: '',

                ...totals
            };
        }

        function buildInsuranceTotals(insuranceRows, base) {
            const totals = sumAging(insuranceRows);

            return {
                ...base,
                rowType: 'INSURANCE_TOTAL',

                PatientDisplayName: '',
                ClaimDate: '',
                CPT: '',
                ClaimNo: '',

                ...totals
            };
        }

        function buildOfficeTotals(officeRows, base) {
            const totals = sumAging(officeRows);

            return {
                ...base,
                rowType: 'OFFICE_TOTAL',

                MasterPayorName: '',
                PatientDisplayName: '',
                ClaimDate: '',
                CPT: '',
                ClaimNo: '',

                ...totals
            };
        }


        $scope.insuranceGridOptions = {
            treeData: true,

            getDataPath: function (data) {

                // Office total (top level)
                if (data.rowType === 'OFFICE_TOTAL') {
                    return [data.BranchName];
                }

                // Insurance total
                if (data.rowType === 'INSURANCE_TOTAL') {
                    return [data.BranchName, data.MasterPayorName];
                }

                // Patient total
                if (data.rowType === 'PATIENT_TOTAL') {
                    return [
                        data.BranchName,
                        data.MasterPayorName,
                        data.PatientDisplayName
                    ];
                }

                // CPT rows (leaf level)
                return [
                    data.BranchName,
                    data.MasterPayorName,
                    data.PatientDisplayName,
                    data.ServiceLineKey
                ];
            },

            autoGroupColumnDef: {
                headerName: 'Office / Insurance / Patient',
                width: 350,
                //filter: 'customTextFilter',
                cellRendererParams: {
                    suppressCount: true,
                    innerRenderer: function (params) {
                        const data = params.data;

                        if (!data) return '';

                        if (params.node.level === 0) {
                            return data.BranchName;          // Office
                        }
                        if (params.node.level === 1) {
                            return data.MasterPayorName;     // Insurance
                        }
                        if (params.node.level === 2) {
                            return data.PatientDisplayName;  // Patient
                        }
                        return '';
                    }
                }
            },

            columnDefs: [
                { headerName: "Claim Date", field: "ClaimDate", width: 140, minWidth: 130, suppressSizeToFit: true },
                { headerName: "CPT", field: "CPT", width: 120, minWidth: 110, suppressSizeToFit: true  },
                { headerName: "Claim No", field: "ClaimNo", width: 130, minWidth: 120, suppressSizeToFit: true },
                { headerName: "0-30", field: "Aging0_30", width: 120, minWidth: 110, suppressSizeToFit: true, valueFormatter: currencyFormatter },
                { headerName: "31-60", field: "Aging31_60", width: 120, minWidth: 110, suppressSizeToFit: true, valueFormatter: currencyFormatter },
                { headerName: "61-90", field: "Aging61_90", width: 120, minWidth: 110, suppressSizeToFit: true, valueFormatter: currencyFormatter },
                { headerName: "91-120", field: "Aging91_120", width: 120, minWidth: 110, suppressSizeToFit: true, valueFormatter: currencyFormatter },
                { headerName: "120+", field: "Aging120plus", width: 120, minWidth: 110, suppressSizeToFit: true, valueFormatter: currencyFormatter },
                { headerName: "Balance", field: "Balance", width: 120, minWidth: 110, suppressSizeToFit: true, valueFormatter: currencyFormatter }
            ],
            //components: {
            //    customTextFilter: CustomTextFilter,
            //    customPatientTextFilter: CustomPatientTextFilter,
            //},
            getRowStyle: function (params) {
                const type = params.data?.rowType;

                if (type === 'OFFICE_TOTAL') {
                    return {
                        fontWeight: '600',
                        backgroundColor: '#F5F7FA'
                    };
                }

                if (type === 'INSURANCE_TOTAL') {
                    return {
                        fontWeight: '600',
                        backgroundColor: '#E8F0FE',
                        borderLeft: '4px solid #4285F4'
                    };
                }

                if (type === 'PATIENT_TOTAL') {
                    return {
                        fontWeight: '600',
                        backgroundColor: '#EAF7F0',
                        borderLeft: '4px solid #34A853'
                    };
                }

                // CPT / leaf rows → no background
                return {};
            }
        };



        function mapCptRow(item) {
            const insuranceBalance = item.InsuranceBalance || 0;

            const aging0_30 = item.zerotoThirty ? insuranceBalance : 0;
            const aging31_60 = item.ThirtytoSixty ? insuranceBalance : 0;
            const aging61_90 = item.SixtytoNinety ? insuranceBalance : 0;
            const aging91_120 = item.NinetytoOnehundredtwenty ? insuranceBalance : 0;
            const aging120plus = item.MorethanOnehundredtwenty ? insuranceBalance : 0;

            return {
                BranchName: item.BranchName || 'Unknown Office',
                MasterPayorName: item.MasterPayorName || 'Unknown Insurance',
                PatientDisplayName: `${item.PatientFullName} (${item.PatientMrNo || ''})`,
                ServiceLineKey: `${item.PatientClaimNumber}-${item.CPT}`,

                ServiceFrom: USformatDate(item.DOSfrom?.split('T')[0]),
                ClaimDate: USformatDate(item.ClaimDate),
                CPT: item.CPT || '',
                ClaimNo: item.PatientClaimNumber || '',

                Aging0_30: aging0_30,
                Aging31_60: aging31_60,
                Aging61_90: aging61_90,
                Aging91_120: aging91_120,
                Aging120plus: aging120plus,

                Balance:
                    aging0_30 +
                    aging31_60 +
                    aging61_90 +
                    aging91_120 +
                    aging120plus,

                rowType: 'CPT'
            };
        }


        function buildDynamicInsuranceAgingGrid(data) {
            const flatRows = [];

            const groupedByOffice = _.groupBy(data, 'BranchName');

            Object.entries(groupedByOffice).forEach(([office, officeItems]) => {

                const officeRows = [];

                const groupedByInsurance = _.groupBy(
                    officeItems.filter(i => i.MasterPayorName && i.MasterPayorName.trim() !== ''),
                    'MasterPayorName'
                );


                Object.entries(groupedByInsurance).forEach(([insurance, insuranceItems]) => {

                    const insuranceRows = [];

                    const groupedByPatient = _.groupBy(
                        insuranceItems,
                        i => `${i.PatientFullName}-${i.PatientMrNo}`
                    );

                    Object.values(groupedByPatient).forEach(patientItems => {

                        const patientRows = patientItems.map(item => mapCptRow(item));

                        flatRows.push(...patientRows);
                        insuranceRows.push(...patientRows);
                        officeRows.push(...patientRows);

                        // 🔹 Patient Total
                        flatRows.push(
                            buildPatientTotals(patientRows, patientRows[0])
                        );
                    });

                    // 🔹 Insurance Total
                    flatRows.push(
                        buildInsuranceTotals(insuranceRows, insuranceRows[0])
                    );
                });

                // 🔹 Office Total
                flatRows.push(
                    buildOfficeTotals(officeRows, officeRows[0])
                );
            });

            return flatRows;
        }


        /* old code  */

        //$scope.insuranceGridOptions = {
        //    columnDefs: [
        //        {
        //            headerName: "Office",
        //            field: "ServiceFrom",
        //            flex: 2.5,
        //            cellClass: getCellClass,
        //            filter: 'customTextFilter',
        //            cellRenderer: function (params) {
        //                const d = params.data;
        //                if (d?.rowType === 'office') {
        //                    const expanded = !!$scope.officeExpandedMap[d.officeRowId];
        //                    return `<span class="toggle-icon">${expanded ? '▼' : '▶'}</span> ${d.ServiceFrom}`;
        //                }
        //                if (d?.rowType === 'insurance') {
        //                    const expanded = !!$scope.insuranceExpandedMap[d.insuranceRowId];
        //                    return `<span class="toggle-icon">${expanded ? '▼' : '▶'}</span> ${d.ServiceFrom}`;
        //                }
        //                return d?.ServiceFrom || '';
        //            }
        //        },
        //        { headerName: "Claim Date", field: "ClaimDate", flex: 1.5, cellClass: getCellClass },
        //        { headerName: "Patient", field: "Patient", flex: 2, cellClass: getCellClass, filter: 'customPatientTextFilter' },
        //        { headerName: "CPT", field: "CPT", flex: 1, cellClass: getCellClass },
        //        {
        //            headerName: "Claim No",
        //            field: "ClaimNo",
        //            flex: 1.5,
        //            cellClass: getCellClass,
        //            cellRenderer: function (params) {
        //                if (!params.data || params.data.rowType !== 'lineItem' || !params.value) {
        //                    return params.value || '';
        //                }

        //                const container = document.createElement('span');
        //                container.className = 'claim-arrow-cell';

        //                const text = document.createElement('span');
        //                text.innerText = params.value;

        //                const icon = document.createElement('i');
        //                icon.className = 'icons__w16-- drawarrow__w16--l claim-arrow-icon';

        //                icon.addEventListener('click', function (e) {
        //                    e.stopPropagation();
        //                    $scope.$applyAsync(() => {
        //                        $scope.navtoClaimSummaryInNewTab(params.data);
        //                    });
        //                });

        //                container.appendChild(text);
        //                container.appendChild(icon);

        //                return container;
        //            }
        //        },
        //        { headerName: "0-30", field: "Aging0_30", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "31-60", field: "Aging31_60", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "61-90", field: "Aging61_90", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "91-120", field: "Aging91_120", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "120+", field: "Aging120plus", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter },
        //        { headerName: "Balance", field: "Balance", flex: 1, cellClass: getCellClass, valueFormatter: currencyFormatter }
        //    ],
        //    components: {
        //        customTextFilter: CustomTextFilter,
        //        customPatientTextFilter: CustomPatientTextFilter,
        //    },
        //    context: { $scope: $scope },
        //    defaultColDef: {
        //        resizable: true,
        //        sortable: false,
        //        filter: false,
        //        suppressMovable: true
        //    },
        //    rowHeight: $scope.defaultRowHeight,
        //    suppressRowTransform: true,
        //    getRowStyle: function (params) {
        //        const type = params.data?.rowType;
        //        if (type === 'office') return { fontWeight: 'bold', backgroundColor: '#f2f2f2' };
        //        if (type === 'insurance') return { fontWeight: 'bold', backgroundColor: '#d9edf7' };
        //        if (type === 'total') return { fontWeight: 'bold', backgroundColor: '#e0f7fa' };
        //        if (type === 'overallTotal') return { fontWeight: 'bold', backgroundColor: '#b2dfdb' };
        //        return {};
        //    },
        //    onGridReady: function (params) {
        //        $scope.gridApi = params.api;
        //        $scope.gridColumnApi = params.columnApi;

        //        setTimeout(function () {
        //            $scope.gridApi.forEachNode(function (node) {
        //                if (node.data && node.data.hidden) {
        //                    if (typeof node.setRowHeight === 'function') node.setRowHeight(0);
        //                }
        //            });
        //            $scope.gridApi.onRowHeightChanged();
        //        }, 0);

        //        const style = document.createElement('style');
        //        style.innerHTML = `
        //    [class*="ag-theme-"] .ag-row { padding-top: 0 !important; padding-bottom: 0 !important; }
        //    [class*="ag-theme-"] .ag-cell { padding-top: 2px !important; padding-bottom: 2px !important; }

        //   .claim-arrow-cell { display: inline-flex;align-items: center; gap: 6px; white-space: nowrap;line-height: normal; }
        //   .claim-arrow-icon { display: inline-flex; align-items: center;cursor: pointer; }
        //`;
        //        document.head.appendChild(style);
        //    },
        //    onCellClicked: function (params) {
        //        if (!params.data) return;

        //        // OFFICE accordion
        //        if (params.data.rowType === 'office') {
        //            const officeKey = params.data.officeRowId;
        //            const expanded = !$scope.officeExpandedMap[officeKey];
        //            $scope.officeExpandedMap[officeKey] = expanded;

        //            const insuranceNodes = [];

        //            $scope.gridApi.forEachNode(function (node) {
        //                if (node.data && node.data.officeRowId === officeKey && node.data.rowType !== 'office') {
        //                    node.data.hidden = !expanded;
        //                    if (typeof node.setRowHeight === 'function') {
        //                        node.setRowHeight(expanded ? $scope.defaultRowHeight : 0);
        //                    }
        //                    insuranceNodes.push(node);

        //                    // cascade office expansion state
        //                    if (node.data.rowType === 'insurance') {
        //                        $scope.insuranceExpandedMap[node.data.insuranceRowId] = expanded;
        //                    }
        //                }
        //            });

        //            $scope.gridApi.refreshCells({
        //                rowNodes: insuranceNodes.concat([params.node]),
        //                columns: ["ServiceFrom"],
        //                force: true
        //            });

        //            $scope.gridApi.onRowHeightChanged();
        //        }

        //        // INSURANCE accordion
        //        if (params.data.rowType === 'insurance') {
        //            const insuranceKey = params.data.insuranceRowId;
        //            const expanded = !$scope.insuranceExpandedMap[insuranceKey];
        //            $scope.insuranceExpandedMap[insuranceKey] = expanded;
        //            const affectedNodes = [];
        //            $scope.gridApi.forEachNode(function (node) {
        //                if (node.data && node.data.insuranceRowId === insuranceKey && node.data.rowType === 'lineItem') {
        //                    node.data.hidden = !expanded;
        //                    if (typeof node.setRowHeight === 'function') {
        //                        node.setRowHeight(expanded ? $scope.defaultRowHeight : 0);
        //                    }
        //                    affectedNodes.push(node);
        //                }
        //            });

        //            $scope.gridApi.refreshCells({
        //                rowNodes: affectedNodes.concat([params.node]),
        //                columns: ["ServiceFrom"],
        //                force: true
        //            });

        //            $scope.gridApi.onRowHeightChanged();
        //        }
        //    }
        //};


        //function buildDynamicInsuranceAgingGrid(data) {
        //    let rowId = 1;
        //    const rows = [];
        //    const grouped = {};

        //    (data || []).forEach(item => {
        //        const office = item.BranchName || '';
        //        const insurance = item.MasterPayorName || '';
        //        if (!insurance) return;
        //        if (!grouped[office]) grouped[office] = {};
        //        if (!grouped[office][insurance]) grouped[office][insurance] = [];

        //        grouped[office][insurance].push(item);
        //    });

        //    for (const office in grouped) {
        //        const officeTotals = [0, 0, 0, 0, 0, 0]; // a0, a30, a60, a90_120, a120plus, total
        //        let hasValidOfficeData = false;

        //        const officeRow = {
        //            id: rowId++,
        //            ServiceFrom: `Office - ${office}`,
        //            officeRowId: `office-${office}`,
        //            rowType: 'office',
        //            Aging0_30: 0,
        //            Aging31_60: 0,
        //            Aging61_90: 0,
        //            Aging91_120: 0,
        //            Aging120plus: 0,
        //            Balance: 0
        //        };
        //        rows.push(officeRow);

        //        for (const insurance in grouped[office]) {
        //            let a0 = 0, a30 = 0, a60 = 0, a90_120 = 0, a120plus = 0, balance = 0;
        //            let hasValidInsuranceData = false;

        //            const insuranceKey = `insurance-${office}-${insurance}`;
        //            const insuranceHeaderRow = {
        //                id: rowId++,
        //                ServiceFrom: `Insurance - ${insurance}`,
        //                rowType: 'insurance',
        //                officeRowId: `office-${office}`,
        //                insuranceRowId: insuranceKey,
        //                Aging0_30: 0,
        //                Aging31_60: 0,
        //                Aging61_90: 0,
        //                Aging91_120: 0,
        //                Aging120plus: 0,
        //                Balance: 0,
        //                hidden: true
        //            };
        //            rows.push(insuranceHeaderRow);

        //            grouped[office][insurance].forEach(item => {
        //                const insuranceBalance = item.InsuranceBalance || 0;
        //                if (insuranceBalance <= 0) return;

        //                const aging0_30 = item["zerotoThirty"] ? insuranceBalance : 0;
        //                const aging31_60 = item["ThirtytoSixty"] ? insuranceBalance : 0;
        //                const aging61_90 = item["SixtytoNinety"] ? insuranceBalance : 0;
        //                const aging91_120 = item["NinetytoOnehundredtwenty"] ? insuranceBalance : 0;
        //                const aging120plus = item["MorethanOnehundredtwenty"] ? insuranceBalance : 0;

        //                const totalBalance = aging0_30 + aging31_60 + aging61_90 + aging91_120 + aging120plus;
        //                if (!totalBalance) return;

        //                const patientName = item.PatientFullName || '';
        //                const patientMrNo = item.PatientMrNo || '';
        //                const displayName = `${patientName} (${patientMrNo})`;

        //                rows.push({
        //                    id: rowId++,
        //                    ServiceFrom: USformatDate(item.DOSfrom?.split('T')[0]),
        //                    ClaimDate: USformatDate(item.ClaimDate),
        //                    Patient: displayName,
        //                    PatientFullName: patientName,
        //                    officeRowId: `office-${office}`,
        //                    insuranceRowId: insuranceKey,
        //                    CPT: item["CPT"] || '',
        //                    ClaimNo: item["PatientClaimNumber"] || '',

        //                    PatientClaimId: item.PatientClaimId,
        //                    PatientId: item.PatientId,
        //                    AppointmentId: item.AppointmentId,
        //                    VisitId: item.VisitId,
        //                    SuperBillId: item.SuperBillId,
        //                    ResponcibilityId: item.ResponcibilityId,
        //                    RenderingProviderId: item.RenderingProviderId,
        //                    ClaimExpiryDate: item.ClaimExpiryDate,

        //                    Aging0_30: aging0_30,
        //                    Aging31_60: aging31_60,
        //                    Aging61_90: aging61_90,
        //                    Aging91_120: aging91_120,
        //                    Aging120plus: aging120plus,
        //                    Balance: totalBalance,
        //                    rowType: 'lineItem',
        //                    hidden: true
        //                });

        //                a0 += aging0_30;
        //                a30 += aging31_60;
        //                a60 += aging61_90;
        //                a90_120 += aging91_120;
        //                a120plus += aging120plus;
        //                balance += totalBalance;
        //                hasValidInsuranceData = true;
        //            });

        //            if (hasValidInsuranceData) {
        //                insuranceHeaderRow.Aging0_30 = a0;
        //                insuranceHeaderRow.Aging31_60 = a30;
        //                insuranceHeaderRow.Aging61_90 = a60;
        //                insuranceHeaderRow.Aging91_120 = a90_120;
        //                insuranceHeaderRow.Aging120plus = a120plus;
        //                insuranceHeaderRow.Balance = balance;

        //                officeTotals[0] += a0;
        //                officeTotals[1] += a30;
        //                officeTotals[2] += a60;
        //                officeTotals[3] += a90_120;
        //                officeTotals[4] += a120plus;
        //                officeTotals[5] += balance;

        //                hasValidOfficeData = true;
        //            } else {
        //                rows.splice(rows.indexOf(insuranceHeaderRow), 1);
        //            }
        //        }

        //        if (!hasValidOfficeData) {
        //            rows.splice(rows.indexOf(officeRow), 1);
        //        } else {
        //            // Assign totals directly to office row
        //            officeRow.Aging0_30 = officeTotals[0];
        //            officeRow.Aging31_60 = officeTotals[1];
        //            officeRow.Aging61_90 = officeTotals[2];
        //            officeRow.Aging91_120 = officeTotals[3];
        //            officeRow.Aging120plus = officeTotals[4];
        //            officeRow.Balance = officeTotals[5];
        //        }
        //    }

        //    return rows;
        //}

        /* old code */


        /* Aging Detail ( By Insurance) - End */


        $scope.getReportHeading = function () {
            const titles = {
                SummaryByAllOptions: 'Aging Summary By All Options',
                DetailByAllOptions: 'Aging Detail By All Options',
                AgingDetailByInsurance: 'Aging Detail By Insurance',
                AgingDetailByPatient: 'Aging Detail By Patient',
                AgingDetailByBillingProvider: 'Aging Detail By Provider'
            };
            return titles[$scope.reportTab] || '';
        };

        let emptysummarygridApi = null;

        function loademptysummaryAGGrid(columnDefs, rowData) {
            const gridDiv = document.querySelector("#emptyARGrid");
            if (!gridDiv) {
                return;
            }
            if (emptysummarygridApi) {
                emptysummarygridApi.destroy();
                emptysummarygridApi = null;
            }
            gridDiv.innerHTML = "";
            const gridOptions = {
                columnDefs: columnDefs,
                rowData: rowData,
                defaultColDef: {
                    resizable: true,
                    sortable: true,
                    filter: true,
                },
            };

            emptysummarygridApi = agGrid.createGrid(gridDiv, gridOptions);

            if ($scope.reportTab !== "") {
                $scope.navtoOpenParticularGridReport($scope.reportTab);
            }
        }

        $scope.ShowEmptySummaryGrid = function () {
            const columnDefs = [];
            const rowData = [];

            $timeout(() => {
                loademptysummaryAGGrid(columnDefs, rowData);
            }, 0);
        };



        $scope.GetAllARReport = function () {
            $scope.AllARReportDetails = [];
            let param = {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "Type": $scope.ARReportData.Type || "",
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
            }

            eHnoteInsuranceService.GetAllAccountsReceivableReport(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.AllARReportDetails = angular.copy(resp.data.rows);
                        $timeout(() => {
                            $scope.navtoOpenParticularGridReport('EmptyAgingReport');
                        }, 0);
                    } else {
                        $scope.AllARReportDetails = [];
                        $timeout(() => {
                            $scope.navtoOpenParticularGridReport('EmptyAgingReport');
                        }, 0);
                    }

                    if ($scope.ArReporttab == 2 && $scope.ArReportId == 1) {
                        $timeout(() => {
                            $scope.navtoOpenParticularGridReport('AgingDetailByInsurance');
                        }, 0);
                    } else if ($scope.ArReporttab == 2 && $scope.ArReportId == 2) {
                        $timeout(() => {
                            $scope.navtoOpenParticularGridReport('AgingDetailByPatient');
                        }, 0);
                    } else {
                        if ($scope.ArReporttab == 2 && $scope.ArReportId == 3) {
                            $timeout(() => {
                                $scope.navtoOpenParticularGridReport('AgingDetailByBillingProvider');
                            }, 0);
                        }
                    }
                }

            }, function (err) { console.log(err); });
        };

        //$scope.onBtExport1 = function () {

        //    if (!$scope.gridApi) {
        //        console.warn("Grid API not available");
        //        return;
        //    }

        //    $scope.gridApi.exportDataAsExcel({
        //        fileName:
        //            ($scope.reportTab || 'Report') +
        //            $filter('date')(new Date(), 'yyyyMMdd') +
        //            '.xlsx',

        //        sheetName: $scope.reportTab,

        //        // 🔴 Removes + / - accordions
        //        suppressRowOutline: true,

        //        processCellCallback: function (params) {

        //            const colId = params.column.getColId();
        //            const data = params.node && params.node.data;
        //            const value = params.value;

        //            // 1️⃣ Office / Insurance / Patient column
        //            // Export ONLY the display label, not CPT / Claim
        //            if (colId === 'ag-Grid-AutoColumn') {
        //                if (!data) return '';

        //                if (data.rowType === 'OFFICE_TOTAL') {
        //                    return data.BranchName || '';
        //                }
        //                if (data.rowType === 'INSURANCE_TOTAL') {
        //                    return data.MasterPayorName || '';
        //                }
        //                if (data.rowType === 'PATIENT_TOTAL') {
        //                    return data.PatientDisplayName || '';
        //                }

        //                // CPT rows → leave empty
        //                return '';
        //            }

        //            // 2️⃣ Claim No – PRESERVE leading zeros
        //            if (colId === 'ClaimNo') {
        //                return value != null ? String(value) : '';
        //            }

        //            // 3️⃣ Amount columns – export as NUMBER
        //            if (
        //                colId === 'Aging0_30' ||
        //                colId === 'Aging31_60' ||
        //                colId === 'Aging61_90' ||
        //                colId === 'Aging91_120' ||
        //                colId === 'Aging120plus' ||
        //                colId === 'Balance'
        //            ) {
        //                return value != null ? Number(value) : 0;
        //            }

        //            return value;
        //        },

        //        excelStyles: [
        //            {
        //                id: 'currencyStyle',
        //                numberFormat: {
        //                    format: '$#,##0.00'
        //                }
        //            }
        //        ]
        //    });
        //};





        $scope.onBtExport = function () {
            if ($scope.gridApi) {
                $scope.gridApi.exportDataAsCsv({
                    fileName: ($scope.reportTab || 'Report') + '_' + $filter('date')(new Date(), 'yyyyMMdd') + '.csv',
                    sheetName: 'AgingDetail',
                    processCellCallback: function (params) {
                        if (typeof params.value === 'string' && params.value.startsWith('$')) {
                            return params.value.replace('$', '');
                        }
                        return params.value;
                    }

                });
            } else {
                console.warn("Grid API not available");
            }
        };
        $scope.onBtExporttoExcel = function () {
            if ($scope.gridApi) {
                $scope.gridApi.exportDataAsExcel({
                    fileName: ($scope.reportTab || 'Report') + '_' + $filter('date')(new Date(), 'yyyyMMdd') + '.xlsx',
                    sheetName: 'AgingDetail',
                    processCellCallback: function (params) {
                        if (typeof params.value === 'string' && params.value.startsWith('$')) {
                            return params.value.replace('$', '');
                        }
                        return params.value;
                    }
                });
            }
        };
        $scope.onBtExportPDF = function () {
            if (!$scope.gridApi) return;

            const visibleCols = $scope.gridApi.getAllDisplayedColumns();
            const columnHeaders = visibleCols.map(col => col.getColDef().headerName);
            const rowData = [];

            $scope.gridApi.forEachNodeAfterFilterAndSort(function (node) {
                const row = visibleCols.map(col => {
                    const colDef = col.getColDef();
                    if (colDef.valueGetter) {
                        try {
                            return colDef.valueGetter({
                                data: node.data,
                                node: node,
                                colDef: colDef,
                                api: $scope.gridApi,
                                columnApi: $scope.gridColumnApi
                            }) || '';
                        } catch (err) {
                            return '';
                        }
                    }
                    return (node.data && node.data[colDef.field] !== undefined)
                        ? node.data[colDef.field]
                        : '';
                });

                rowData.push(row);
            });

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.autoTable({
                head: [columnHeaders],
                body: rowData,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] },
                startY: 20
            });

            doc.save(($scope.reportTab || 'Report') + '_' + $filter('date')(new Date(), 'yyyyMMdd') + '.pdf');
        };



        $scope.onBtExportInsuranceWisePDF = function () {
            if (!$scope.gridApi) {
                alertify.error("Grid not initialized.");
                return;
            }

            let visibleData = [];

            // Collect filtered/sorted data from the grid
            $scope.gridApi.forEachNodeAfterFilterAndSort(function (node) {
                visibleData.push(node.data);
            });

            if (!visibleData.length) {
                alertify.error("No filtered data to export.");
                return;
            }

            $scope.groupedData = {};

            let currentOffice = null;
            let currentInsurance = null;

            (visibleData || []).forEach(item => {
                const val = item.ServiceFrom || "";

                if (val.startsWith("Office -")) {
                    currentOffice = val.replace("Office -", "").trim();
                    if (!$scope.groupedData[currentOffice]) {
                        $scope.groupedData[currentOffice] = {};
                    }
                }
                else if (val.startsWith("Insurance -")) {
                    currentInsurance = val.replace("Insurance -", "").trim();
                    if (currentOffice) {
                        if (!$scope.groupedData[currentOffice][currentInsurance]) {
                            $scope.groupedData[currentOffice][currentInsurance] = [];
                        }
                    }
                }
                else {
                    if (currentOffice && currentInsurance) {
                        $scope.groupedData[currentOffice][currentInsurance].push(item);
                    }
                }
            });

            $scope.getGroupedDataArray();
        };


        $scope.getGroupedDataArray = function () {
            $scope.GroupedOfficeArray = [];

            angular.forEach($scope.groupedData, function (insuranceGroup, officeName) {
                let officeObj = {
                    office: officeName,
                    insurances: [],
                    allClaims: []
                };

                angular.forEach(insuranceGroup, function (claims, insuranceName) {
                    officeObj.insurances.push({
                        insurance: insuranceName,
                        claims: claims
                    });
                    officeObj.allClaims = officeObj.allClaims.concat(claims);
                });

                $scope.GroupedOfficeArray.push(officeObj);
            });

            console.log($scope.GroupedOfficeArray);

            $timeout(function () {
                var innerContents = document.getElementById('ARInsuranceReport_Print').innerHTML;
                $scope.GenerateARReportPdfFromHtml(innerContents, 'Insurance_AR_Report_' + moment().format('YYYYMMDD') + '.pdf');


                //const { jsPDF } = window.jspdf;
                //const doc = new jsPDF('p', 'pt', 'a4');

                //doc.html(innerContents, {
                //    callback: function (doc) {
                //        doc.save('AR_Insurance_Report_' + moment().format('YYYYMMDD') + '.pdf');
                //    }
                //});
            }, 1000);
        };



        $scope.getOfficeTotalsForOffice = function (officeItem) {
            let totals = {
                zeroToThirty: 0,
                thirtyToSixty: 0,
                sixtyToNinety: 0,
                ninetyToOneTwenty: 0,
                moreThanOneTwenty: 0
            };

            officeItem.insurances.forEach(ins => {
                ins.claims.forEach(claim => {
                    totals.zeroToThirty += claim.Aging0_30 || 0;
                    totals.thirtyToSixty += claim.Aging31_60 || 0;
                    totals.sixtyToNinety += claim.Aging61_90 || 0;
                    totals.ninetyToOneTwenty += claim.Aging91_120 || 0;
                    totals.moreThanOneTwenty += claim.Aging120plus || 0;
                });
            });

            return totals;
        };
        $scope.getPatientOfficeTotalsForOffice = function (officeItem) {
            let totals = {
                zeroToThirty: 0,
                thirtyToSixty: 0,
                sixtyToNinety: 0,
                ninetyToOneTwenty: 0,
                moreThanOneTwenty: 0
            };

            officeItem.offices.forEach(ins => {
                ins.claims.forEach(claim => {
                    totals.zeroToThirty += claim.Aging0_30 || 0;
                    totals.thirtyToSixty += claim.Aging31_60 || 0;
                    totals.sixtyToNinety += claim.Aging61_90 || 0;
                    totals.ninetyToOneTwenty += claim.Aging91_120 || 0;
                    totals.moreThanOneTwenty += claim.Aging120plus || 0;
                });
            });

            return totals;
        };

        $scope.getInsuranceTotals = function (insurance) {
            let totals = {
                zeroToThirty: 0,
                thirtyToSixty: 0,
                sixtyToNinety: 0,
                ninetyToOneTwenty: 0,
                moreThanOneTwenty: 0
            };

            insurance.claims.forEach(claim => {
                totals.zeroToThirty += claim.Aging0_30 || 0;
                totals.thirtyToSixty += claim.Aging31_60 || 0;
                totals.sixtyToNinety += claim.Aging61_90 || 0;
                totals.ninetyToOneTwenty += claim.Aging91_120 || 0;
                totals.moreThanOneTwenty += claim.Aging120plus || 0;
            });

            return totals;
        };

        $scope.onBtExportPatientWisePDF = function () {
            if (!$scope.gridApi) {
                alertify.error("Grid not initialized.");
                return;
            }

            let visibleData = [];
            $scope.groupedPatientData = {};
            $scope.gridApi.forEachNodeAfterFilterAndSort(function (node) {
                visibleData.push(node.data);
            });

            if (!visibleData.length) {
                alertify.error("No filtered data to export.");
                return;
            }
            let currentPatient = null;
            let currentOffice = null;


            (visibleData || []).forEach(item => {
                const val = item.ServiceFrom || "";

                if (val.startsWith("Patient Name:")) {
                    currentPatient = val.replace("Patient Name:", "").trim();
                    if (!$scope.groupedPatientData[currentPatient]) {
                        $scope.groupedPatientData[currentPatient] = {};
                    }
                }
                else if (val.startsWith("Office -")) {
                    currentOffice = val.replace("Office -", "").trim();
                    if (currentOffice) {
                        if (!$scope.groupedPatientData[currentPatient][currentOffice]) {
                            $scope.groupedPatientData[currentPatient][currentOffice] = [];
                        }
                    }
                }
                else {
                    if (currentPatient && currentOffice) {
                        $scope.groupedPatientData[currentPatient][currentOffice].push(item);
                    }
                }
            });


            $scope.GroupedPatientArray = [];
            angular.forEach($scope.groupedPatientData, function (officeGroup, patientName) {
                let patientObj = {
                    patient: patientName,
                    offices: [],
                    allClaims: []
                };

                angular.forEach(officeGroup, function (claims, officeName) {
                    patientObj.offices.push({
                        office: officeName,
                        claims: claims
                    });
                    patientObj.allClaims = patientObj.allClaims.concat(claims);
                });

                $scope.GroupedPatientArray.push(patientObj);
            });

            console.log($scope.GroupedPatientArray);

            // Export to PDF
            $timeout(function () {
                var innerContents = document.getElementById('ARPatientReport_Print').innerHTML;
                $scope.GenerateARReportPdfFromHtml(innerContents, 'Patient_AR_Report_' + $filter('date')(new Date(), 'yyyyMMdd') + '.pdf');
                //const { jsPDF } = window.jspdf;
                //const doc = new jsPDF('p', 'pt', 'a4');

                //doc.html(innerContents, {
                //    callback: function (doc) {
                //        doc.save('Patient_AR_Report_' + $filter('date')(new Date(), 'yyyyMMdd') + '.pdf');
                //    }
                //});
            }, 1000);
        };

        $scope.onBtExportProviderWisePDF = function () {

            if (!$scope.gridApi) {
                alertify.error("Grid not initialized.");
                return;
            }

            let visibleData = [];
            $scope.groupedProviders = {};
            $scope.gridApi.forEachNodeAfterFilterAndSort(function (node) {
                visibleData.push(node.data);
            });

            if (!visibleData.length) {
                alertify.error("No filtered data to export.");
                return;
            }
            let currentProvider = null;
            let currentOffice = null;


            (visibleData || []).forEach(item => {
                const val = item.ServiceFrom || "";

                if (val.startsWith("Provider -")) {
                    currentProvider = val.replace("Provider -", "").trim();
                    if (!$scope.groupedProviders[currentProvider]) {
                        $scope.groupedProviders[currentProvider] = {};
                    }
                }
                else if (val.startsWith("Office -")) {
                    currentOffice = val.replace("Office -", "").trim();
                    if (currentOffice) {
                        if (!$scope.groupedProviders[currentProvider][currentOffice]) {
                            $scope.groupedProviders[currentProvider][currentOffice] = [];
                        }
                    }
                }
                else {
                    if (currentProvider && currentOffice) {
                        $scope.groupedProviders[currentProvider][currentOffice].push(item);
                    }
                }
            });

            $scope.GroupedProviderArray = [];

            angular.forEach($scope.groupedProviders, function (officeGroup, providerName) {
                let providerObj = {
                    provider: providerName,
                    offices: []
                };

                angular.forEach(officeGroup, function (claims, officeName) {
                    providerObj.offices.push({
                        office: officeName,
                        claims: claims
                    });
                });

                $scope.GroupedProviderArray.push(providerObj);
            });

            // Export to PDF
            $timeout(function () {
                var innerContents = document.getElementById('ARProviderReport_Print').innerHTML;
                $scope.GenerateARReportPdfFromHtml(innerContents, 'Provider_AR_Report_' + $filter('date')(new Date(), 'yyyyMMdd') + '.pdf');
                //const { jsPDF } = window.jspdf;
                //const doc = new jsPDF('p', 'pt', 'a4');

                //doc.html(innerContents, {
                //    callback: function (doc) {
                //        doc.save('Provider_AR_Report_' + $filter('date')(new Date(), 'yyyyMMdd') + '.pdf');
                //    }
                //});
            }, 1000);
        };

        $scope.ARReportHtml = "";
        $scope.ARReport3Url = "";
        $scope.GenerateARReportPdfFromHtml = function (innerContents, filename) {
            $scope.ARReportHtml = innerContents;
            if (!$scope.ARReportHtml) {
                alert("HTML content not available.");
                return;
            }
            var requestData = {
                Base64Content: $scope.ARReportHtml,
                FileName: filename,
                OrganizationId: $scope.HospitalId,
            };
            eHnoteInsuranceService.GenerateARReportPdfFromHtml(requestData).then(function (resp) {
                console.log(resp)
                if (resp.data) {
                    $scope.ARReport3Url = resp.data;
                    $scope.PrintS3PdfUrl($scope.ARReport3Url);
                }
                else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {

            });



        };
        $scope.PrintS3PdfUrl = function (s3url) {
            if (!s3url) return;
            var printWindow = window.open(s3url, '_blank');

            if (printWindow) {
                printWindow.onload = function () {
                    setTimeout(function () {
                        printWindow.focus();
                        printWindow.print();
                    }, 1000);
                };
            } else {
                alert('Please allow popups for this site to print the document.');
            }
        };

        $scope.GetPatientPaymentReportsObj = function () {
            var obj = {
                "UserId": $scope.UserId || null,
                "UserName": "",
                "PaymentMethodId": null,
                "PaymentMethodName": "",
                "UserFullName": "",
                "PaymentFromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
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
                "RenderingProviderDoctorsList": $scope.mainBillerDataObj.AllDoctorsList || [],
                "ReportUsersList": $scope.mainBillerDataObj.AllUsersList || [],
                "AllUsersList": $scope.mainBillerDataObj.AllUsersList || [],
                "AllMasterPaymentsMethods": $scope.masterPaymentModes || [],
                "AllBranchesList": $scope.mainBillerDataObj.AllBranchesList || [],
                "AllMasterBranchesList": $scope.mainBillerDataObj.AllBranchesList || [],
                "BillingProviderList": $scope.mainBillerDataObj.BillingProviderList || [],
                "SelectBillingProviderString": "All",
                "BillingProviderName": "",
                "AllBillingProviderStatusCheck": true,
                "AllDoctorCheck": true,
                "PatientPayFromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PatientPayToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ServiceFromDate": "",
                "ServiceToDate": "",
                "PaymentDateRangeId": 1,
                "ServiceDateRangeId": 0,

            }
            return obj;
        }
        $scope.SearchPatientDetails = function () {
            $scope.SubTab = "";
            var currentDate = new Date();
            $scope.PatientPaymentsReportsObj = angular.copy($scope.GetPatientPaymentReportsObj());
            $scope.PatientPaymentsReportsObj.PaymentDateRangeId = 1;
          //  $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date();
            $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date();


            if ($scope.PatientPaymentsReportsObj.AllMasterBranchesList.length > 0) {
                $scope.PatientPaymentsReportsObj.AllBranchesList = angular.copy($scope.PatientPaymentsReportsObj.AllMasterBranchesList);
                angular.forEach($scope.PatientPaymentsReportsObj.AllBranchesList, function (Aitem) {
                    Aitem.IsChecked = true;
                });
                $scope.PatientPaymentsReportsObj.SelectLocationString = "Selected";
                $scope.PatientPaymentsReportsObj.AllLocationStatusCheck = true;
            }

            //  $scope.PaymentsByBillingProviderObj = angular.copy($scope.GetPaymentGropbyBillingproviderObj());
            $scope.selectedDoctor = "All Doctors";

            if ($scope.PatientPaymentsReportsObj.BillingProviderList.length > 0) {
                angular.forEach($scope.PatientPaymentsReportsObj.BillingProviderList, function (item) {
                    item.IsChecked = true;
                });

            }
            if ($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods.length > 0) {
                $scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods = angular.copy($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods);
                angular.forEach($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods, function (Aitem) {
                    Aitem.IsChecked = true;
                });
                $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = "Selected";
                $scope.PatientPaymentsReportsObj.AllStatusCheck = true;
            }

            if ($scope.PatientPaymentsReportsObj.AllUsersList.length > 0) {
                $scope.PatientPaymentsReportsObj.ReportUsersList = angular.copy($scope.PatientPaymentsReportsObj.AllUsersList);
                angular.forEach($scope.PatientPaymentsReportsObj.ReportUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.PatientPaymentsReportsObj.SelectUserStatusString = "All";
                $scope.PatientPaymentsReportsObj.AllUserStatusCheck = true;
                //$scope.PatientPaymentsReportsObj.ReportUsersList = $scope.PatientPaymentsReportsObj.AllUsersList.filter((x) => x.RoleId == 43 || x.RoleId == 1 || x.RoleId == 19 || x.RoleId == 2 || x.RoleId == 58 || x.RoleId == 62 || x.RoleId == 63 || x.RoleId == 64 || x.RoleId == 65 || x.RoleId == 66 || x.RoleId == 67 || x.RoleId == 68 || x.RoleId == 69 || x.RoleId == 71 || x.RoleId == 10 || x.RoleId == 28 || x.RoleId == 29 || x.RoleId == 38 || x.RoleId == 40);
            }

            if ($scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList.length > 0) {
                angular.forEach($scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList, function (item) {
                    item.IsChecked = true;
                });
            }


            $scope.UserPatientPaymentsObj = {
                "PrintingUserId": $scope.UserId || null,
                "PrintingUserName": "",
                "PaymentFromDate": $scope.PatientPaymentsReportsObj.PatientPayFromDate || "",
                "PaymentToDate": $scope.PatientPaymentsReportsObj.PatientPayToDate || "",
                "ServiceStartDate": $scope.PatientPaymentsReportsObj.ServiceFromDate || "",
                "ServiceEndDate": $scope.PatientPaymentsReportsObj.ServiceToDate || "",
                "OrganizationId": $scope.HospitalId || null,
                "OrganizationName": "",
                "UserPatientPaymentList": [],
                "UserPrintedDatenTime": "",
            };

            $scope.PatientPaymentsByMethodObj = {
                "PrintingUserId": $scope.UserId || null,
                "PrintingUserName": "",
                "PaymentFromDate": $scope.PatientPaymentsReportsObj.PatientPayFromDate || "",
                "PaymentToDate": $scope.PatientPaymentsReportsObj.PatientPayToDate || "",
                "OrganizationId": $scope.HospitalId || null,
                "OrganizationName": "",
                "PatientPaymentListByPaymentMethod": [],
                "PrintedDatenTime": "",
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

            if ($scope.ArReporttab == 5 && $scope.ArReportId == 1) {
                $scope.navtoOpenPatientGridReport('BillingProvider');
            } else if ($scope.ArReporttab == 5 && $scope.ArReportId == 2) {
                $scope.navtoOpenPatientGridReport('RenderingProvider');
            } else if ($scope.ArReporttab == 5 && $scope.ArReportId == 3) {
                $scope.navtoOpenPatientGridReport('UserProvider');
            } else {
                if ($scope.ArReporttab == 5 && $scope.ArReportId == 4) {
                    $scope.navtoOpenPatientGridReport('PaymentType');
                }
            }
        }


        $scope.GetInsuranceReportsObj = function () {
            var obj = {
                "UserId": $scope.UserId || null,
                "UserName": "",
                "PaymentFromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PaymentToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "DOSFromDate": "",
                "DOSToDate": "",
                "PayorObj": "",
                "ServiceObj": "",
                "ReferringObj": "",
                "ChkPostedFromDate": "",
                "ChkPostedToDate": "",
                "ChkPostedDateRangeId": null,
                "PaymentDateRangeId": 1,
                "ServiceDateRangeId": 0,
                "PaymentTo": null,
                "SelectPaymentStatusString": "Select",
                "SelectRenderingStatusString": "Select",
                "SelectUserStatusString": "Select",
                "SelectLocationString": "Select",
                "LocationName": "",
                "AllStatusCheck": false,
                "AllRenderingStatusCheck": false,
                "AllUserStatusCheck": false,
                "AllLocationStatusCheck": false,
                "RenderingProviderList": $scope.mainBillerDataObj.AllDoctorsList || [],
                "AllUsersList": $scope.mainBillerDataObj.AllUsersList || [],
                "AllBranchesList": $scope.mainBillerDataObj.AllBranchesList || [],
                "BillingProviderList": $scope.mainBillerDataObj.BillingProviderList || [],
                "SelectBillingProviderString": "All",
                "BillingProviderName": "",
                "AllBillingProviderStatusCheck": true,
                "AllDoctorCheck": true,
                "AllPayorList": [],
                "AllReferalList": [],
                "AllProcedureList": [],
                "AllBillingProviderInd": 1,
                "AllRenderingProviderInd": 1,
                "AllLocationInd": 1,
                "AllMasterPayorsInd": 1,
                "AllProcedureInd": 1,
                "AllReferralProviderInd": 1,
                "AllPostingUsersInd": 1,
                "MonthsArray": [],

            }
            return obj;
        }


        $scope.SearchInsuranceDetails = function () {
            $scope.InsSubTab = "";
            $scope.InsuranceReportsObj = angular.copy($scope.GetInsuranceReportsObj());
            if ($scope.InsuranceReportsObj.AllBranchesList.length > 0) {
                $scope.InsuranceReportsObj.AllBranchesList = angular.copy($scope.InsuranceReportsObj.AllBranchesList);
                angular.forEach($scope.InsuranceReportsObj.AllBranchesList, function (Aitem) {
                    Aitem.IsChecked = true;
                });
                $scope.InsuranceReportsObj.SelectLocationString = "Selected";
                $scope.InsuranceReportsObj.AllLocationStatusCheck = true;
            }

            //  $scope.PaymentsByBillingProviderObj = angular.copy($scope.GetPaymentGropbyBillingproviderObj());
            $scope.selectedDoctor = "All Doctors";
            $scope.isPopoverOpen = false;

            if ($scope.InsuranceReportsObj.BillingProviderList.length > 0) {
                angular.forEach($scope.InsuranceReportsObj.BillingProviderList, function (item) {
                    item.IsChecked = true;
                });
            }

            if ($scope.InsuranceReportsObj.RenderingProviderList.length > 0) {
                angular.forEach($scope.InsuranceReportsObj.RenderingProviderList, function (item) {
                    item.IsChecked = true;
                });
                $scope.InsuranceReportsObj.SelectRenderingStatusString = "Selected";
                $scope.InsuranceReportsObj.AllRenderingStatusCheck = true;

            }

            if ($scope.InsuranceReportsObj.AllUsersList.length > 0) {
                $scope.InsuranceReportsObj.AllUsersList = angular.copy($scope.InsuranceReportsObj.AllUsersList);
                angular.forEach($scope.InsuranceReportsObj.AllUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.InsuranceReportsObj.SelectUserStatusString = "Selected";
                $scope.InsuranceReportsObj.AllUserStatusCheck = true;
            }

            var currentDate = new Date();
           $scope.InsuranceReportsObj.PaymentDateRangeId = 4;
           // $scope.InsuranceReportsObj.PaymentDateRangeId = 1;
           // $scope.InsuranceReportsObj.PaymentFromDate = new Date();
            $scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            
            $scope.InsuranceReportsObj.PaymentToDate = new Date();
            let obj = {
                "ParentOrganizationId": $scope.ParentHospitalId,

            };
            //$q.all([
            //    eHnoteInsuranceService.GetAllPcpProcedurePayorList(obj),
            //]).then(function (resp) {

            //    if (resp[0].data.rows.length > 0) {
            //        $scope.AllMasterPayorList = resp[0].data.rows || [];
            //        $scope.AllReferalList = resp[0].data.ReferalData || [];
            //        $scope.AllProcedureList = resp[0].data.ProcedureData || [];
            //    }
            //})

            if ($scope.ArReporttab == 6 && $scope.ArReportId == 1) {
                $scope.navtoOpenInsuranceGridReport('BillingProvider');
            } else if ($scope.ArReporttab == 6 && $scope.ArReportId == 2) {
                $scope.navtoOpenInsuranceGridReport('RenderingProvider');
            } else {
                if ($scope.ArReporttab == 6 && $scope.ArReportId == 3) {
                    $scope.navtoOpenInsuranceGridReport('Payor');
                }
            }

        }

        $scope.InsuranceProviderToggle = function (item) {
            const checkedCount = $scope.InsuranceReportsObj.BillingProviderList.filter(i => i.IsChecked).length;

            $scope.InsuranceReportsObj.AllBillingProviderStatusCheck = checkedCount === $scope.InsuranceReportsObj.BillingProviderList.length;
            if (checkedCount === 0) {
                $scope.InsuranceReportsObj.SelectBillingProviderString = "Select Billing Provider";
            } else if ($scope.InsuranceReportsObj.AllBillingProviderStatusCheck) {
                $scope.InsuranceReportsObj.SelectBillingProviderString = "All";
            } else {
                $scope.InsuranceReportsObj.SelectBillingProviderString = "Selected";
            }
        };

        $scope.InsuranceRenderingToggle = function (item) {
            var checkedArray = _.where($scope.InsuranceReportsObj.RenderingProviderList, { IsChecked: true });
            $scope.InsuranceReportsObj.AllRenderingStatusCheck = checkedArray.length > 0 && $scope.InsuranceReportsObj.RenderingProviderList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.InsuranceReportsObj.SelectRenderingStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.InsuranceReportsObj.SelectRenderingStatusString = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                } else {
                    $scope.InsuranceReportsObj.SelectRenderingStatusString = "Selected";
                }
            }

        };
        $scope.InsuranceUserToggle = function (item) {
            var checkedArray = _.where($scope.InsuranceReportsObj.AllUsersList, { IsChecked: true });
            $scope.InsuranceReportsObj.AllUserStatusCheck = checkedArray.length > 0 && $scope.InsuranceReportsObj.AllUsersList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.InsuranceReportsObj.SelectUserStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.InsuranceReportsObj.SelectUserStatusString = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                } else {
                    $scope.InsuranceReportsObj.SelectUserStatusString = "Selected";
                }
            }

        };
        $scope.checkAllRendering = function (val) {
            if (val) {
                angular.forEach($scope.InsuranceReportsObj.RenderingProviderList, function (item) {
                    item.IsChecked = true;
                });
                $scope.InsuranceReportsObj.SelectRenderingStatusString = 'All Doctors';
            } else {
                angular.forEach($scope.InsuranceReportsObj.RenderingProviderList, function (item) {
                    item.IsChecked = false;
                });
                $scope.InsuranceReportsObj.SelectRenderingStatusString = 'Select';
            }
            var checkedArray = _.where($scope.InsuranceReportsObj.RenderingProviderList, { IsChecked: true });
            $scope.InsuranceReportsObj.AllRenderingStatusCheck = checkedArray.length > 0 && $scope.InsuranceReportsObj.RenderingProviderList.length === checkedArray.length ? true : false;

        };
        $scope.checkAllInsuranceUser = function (val) {
            if (val) {
                angular.forEach($scope.InsuranceReportsObj.AllUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.InsuranceReportsObj.SelectUserStatusString = 'All Doctors';
            } else {
                angular.forEach($scope.InsuranceReportsObj.AllUsersList, function (item) {
                    item.IsChecked = false;
                });
                $scope.InsuranceReportsObj.SelectUserStatusString = 'Select';
            }
            var checkedArray = _.where($scope.InsuranceReportsObj.AllUsersList, { IsChecked: true });
            $scope.InsuranceReportsObj.AllUserStatusCheck = checkedArray.length > 0 && $scope.InsuranceReportsObj.AllUsersList.length === checkedArray.length ? true : false;

        };
        $scope.ClearInsuranceFilters = function (Type) {
            $scope.InsuranceReportsObj = angular.copy($scope.GetInsuranceReportsObj());
            angular.element(document.querySelector('.popover')).remove();
            Type = Type || "";
            if ($scope.InsuranceReportsObj.AllBranchesList.length > 0) {
                $scope.InsuranceReportsObj.AllBranchesList = angular.copy($scope.InsuranceReportsObj.AllBranchesList);
                angular.forEach($scope.InsuranceReportsObj.AllBranchesList, function (Aitem) {
                    Aitem.IsChecked = true;
                });
                $scope.InsuranceReportsObj.SelectLocationString = "Selected";
                $scope.InsuranceReportsObj.AllLocationStatusCheck = true;
            }
            if ($scope.InsuranceReportsObj.BillingProviderList.length > 0) {
                angular.forEach($scope.InsuranceReportsObj.BillingProviderList, function (item) {
                    item.IsChecked = true;
                });

            }



            $scope.InsuranceReportsObj.PatientPayFromDate = $filter('date')(new Date(), "MM-dd-yyyy") || '';
            $scope.InsuranceReportsObj.PatientPayToDate = $filter('date')(new Date(), "MM-dd-yyyy") || '';

            $scope.InsuranceReportsObj.ServiceFromDate = '';
            $scope.InsuranceReportsObj.ServiceToDate = '';
            var currentDate = new Date();
           // $scope.InsuranceReportsObj.PaymentDateRangeId = 1;
            $scope.InsuranceReportsObj.PaymentDateRangeId = 4;
            $scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
           // $scope.InsuranceReportsObj.PaymentFromDate = new Date();
            $scope.InsuranceReportsObj.PaymentToDate = new Date();
            $scope.InsuranceReportsObj.ServiceDateRangeId = 0;

            if ($scope.InsuranceReportsObj.AllUsersList.length > 0) {
                $scope.InsuranceReportsObj.AllUsersList = angular.copy($scope.InsuranceReportsObj.AllUsersList);
                angular.forEach($scope.InsuranceReportsObj.AllUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.InsuranceReportsObj.SelectUserStatusString = "All";
                $scope.InsuranceReportsObj.AllUserStatusCheck = true;
            }
            if ($scope.InsuranceReportsObj.RenderingProviderList.length > 0) {
                angular.forEach($scope.InsuranceReportsObj.RenderingProviderList, function (item) {
                    item.IsChecked = true;
                });
                $scope.selectedDoctor = "All Doctors";
                $scope.InsuranceReportsObj.AllDoctorCheck = true;
            }
        };


        function getLastCompletedMonthsInfo(monthCount) {

            var now = new Date();

            // End date = last day of previous month
            var endDate = new Date(now.getFullYear(), now.getMonth(), 0);

            // Start date = first day of (endDate - (monthCount - 1))
            var startDate = new Date(
                endDate.getFullYear(),
                endDate.getMonth() - (monthCount - 1),
                1
            );

            // Build months array
            var monthsArray = [];

            for (var i = monthCount - 1; i >= 0; i--) {
                var d = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
                monthsArray.push(moment(d).format("MMM-YYYY"));
            }

            return {
                startDate: startDate,
                endDate: endDate,
                months: monthsArray
            };
        }




        $scope.PaymentDateRangeArray = [
            { Id: 1, Name: 'Today' },
            /* { Id: 2, Name: 'Yesterday' },*/
            /* { Id: 3, Name: 'Last week' },*/
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 3 months' },
            //{ Id: 8, Name: 'Last 6 months' },
            { Id: 9, Name: 'This year' },
            { Id: 10, Name: 'Last year' },
            { Id: 11, Name: 'Custom Date' }
        ];

        $scope.ServiceDateRangeArray = [
            { Id: 1, Name: 'Today' },
            //{ Id: 2, Name: 'Yesterday' },
            { Id: 3, Name: 'Last week' },
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 3 months' },
            //{ Id: 8, Name: 'Last 6 months' },
            { Id: 9, Name: 'This year' },
            { Id: 10, Name: 'Last year' },
            { Id: 11, Name: 'Custom Date' }
        ];


        $scope.checkAllBillingProviders = function (val) {
            angular.forEach($scope.PatientPaymentsReportsObj.BillingProviderList, function (item) {
                item.IsChecked = val;
            });

            $scope.PatientPaymentsReportsObj.SelectBillingProviderString = val ? "All" : "Select Billing Provider";
   /*         $scope.updateSelectedProviders();*/
        };
        $scope.checkInsuranceAllBillingProviders = function (val) {
            angular.forEach($scope.InsuranceReportsObj.BillingProviderList, function (item) {
                item.IsChecked = val;
            });

            $scope.InsuranceReportsObj.SelectBillingProviderString = val ? "All" : "Select Billing Provider";         
        };

        $scope.ProviderToggle = function (item) {
            const checkedCount = $scope.PatientPaymentsReportsObj.BillingProviderList.filter(i => i.IsChecked).length;

            $scope.PatientPaymentsReportsObj.AllBillingProviderStatusCheck = checkedCount === $scope.PatientPaymentsReportsObj.BillingProviderList.length;
            if (checkedCount === 0) {
                $scope.PatientPaymentsReportsObj.SelectBillingProviderString = "Select Billing Provider";
            } else if ($scope.PatientPaymentsReportsObj.AllBillingProviderStatusCheck) {
                $scope.PatientPaymentsReportsObj.SelectBillingProviderString = "All";
            } else {
                $scope.PatientPaymentsReportsObj.SelectBillingProviderString = "Selected";
            }


        };


        $scope.DoctorToggle = function (item) {
            var checkedArray = _.where($scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList, { IsChecked: true });
            $scope.PatientPaymentsReportsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.selectedDoctor = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.selectedDoctor = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                } else if (checkedArray.length == $scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList.length) {
                    $scope.selectedDoctor = "All Doctors";
                } else {
                    $scope.selectedDoctor = "Selected";
                }
            }

        };

        $scope.checkAllDoctor = function (val) {
            if (val) {
                angular.forEach($scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList, function (item) {
                    item.IsChecked = true;
                });

                $scope.selectedDoctor = 'All Doctors';
            } else {
                angular.forEach($scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList, function (item) {
                    item.IsChecked = false;
                });

                $scope.selectedDoctor = 'Select';
            }
            var checkedArray = _.where($scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList, { IsChecked: true });
            $scope.PatientPaymentsReportsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList.length === checkedArray.length ? true : false;

        };

        $scope.stopClosingDropDown = function ($event) {
            $event.stopPropagation();
        };

        $scope.CheckReportAllPaymentType = function (Val, Type) {
            if (Type == "User") {
                if (Val) {
                    $scope.PatientPaymentsReportsObj.SelectUserStatusString = "All";
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
                    angular.forEach($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods, function (Aitem) {
                        Aitem.IsChecked = true;
                    });
                } else {
                    $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = "Select";
                    angular.forEach($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods, function (Aitem) {
                        Aitem.IsChecked = false;
                    });
                }
            }
        };






        $scope.navtoOpenPatientGridReport = function (tabno) {
            //if ($scope.SubTab === tabno) return;
            $scope.SubTab = tabno || "";
            $scope.ClearFilters();
            if (tabno == 'BillingProvider') {
                $timeout(function () {
                    //  $scope.ShowPatientPaymentGrid();
                    $scope.PatientBillingProviderlist = [];
                    $scope.GetPaymentGroupbyBillingProvider();
                }, 500);
            }
            else if (tabno == 'RenderingProvider') {
                $timeout(function () {
                    //  $scope.ShowPatientPaymentGrid();
                    $scope.PatientRenderingProviderlist = [];
                    $scope.GetPaymentGroupbyRenderingProvider();
                }, 500);
            }
            else if (tabno == 'UserProvider') {
                $timeout(function () {
                    //  $scope.ShowPatientPaymentGrid();
                    $scope.PatientUsersProviderlist = [];
                    $scope.GetPaymentGroupbyUserProvider();
                }, 500);
            }
            else if (tabno == 'PaymentType') {
                $timeout(function () {
                    //  $scope.ShowPatientPaymentGrid();
                    $scope.PatientPaymentTypelist = [];
                    $scope.GetPaymentGroupbyPaymentType();
                }, 500);
            }
        };

        $scope.ClickForFilteredData = function () {
            if ($scope.SubTab == 'BillingProvider') {
                $scope.GetPaymentGroupbyBillingProvider();
            }
            else if ($scope.SubTab == 'RenderingProvider') {
                $scope.GetPaymentGroupbyRenderingProvider();
            }
            else if ($scope.SubTab == 'UserProvider') {
                $scope.GetPaymentGroupbyUserProvider();
            }
            else if ($scope.SubTab == 'PaymentType') {
                $scope.GetPaymentGroupbyPaymentType();
            } else {
                alertify.error("Please select a sub tab to continue.");
                return false;
            }
        }

        $scope.ClearFilters = function (Type) {
            Type = Type || "";

            var currentDate = new Date();
            if ($scope.PatientPaymentsReportsObj.BillingProviderList.length > 0) {
                angular.forEach($scope.PatientPaymentsReportsObj.BillingProviderList, function (item) {
                    item.IsChecked = true;
                });

            }
            $scope.PatientPaymentsReportsObj.SelectBillingProviderString = "All";


            $scope.PatientPaymentsReportsObj.PatientPayFromDate = $filter('date')(new Date(), "MM-dd-yyyy") || '';
            $scope.PatientPaymentsReportsObj.PatientPayToDate = $filter('date')(new Date(), "MM-dd-yyyy") || '';

            $scope.PatientPaymentsReportsObj.ServiceFromDate = '';
            $scope.PatientPaymentsReportsObj.ServiceToDate = '';

           // $scope.PatientPaymentsReportsObj.PaymentDateRangeId = 4;
            $scope.PatientPaymentsReportsObj.PaymentDateRangeId = 1;
          //  $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date();
            $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date();
            $scope.PatientPaymentsReportsObj.ServiceDateRangeId = 0;


            if ($scope.PatientPaymentsReportsObj.AllMasterBranchesList.length > 0) {
                $scope.PatientPaymentsReportsObj.AllBranchesList = angular.copy($scope.PatientPaymentsReportsObj.AllMasterBranchesList);
                angular.forEach($scope.PatientPaymentsReportsObj.AllBranchesList, function (Aitem) {
                    Aitem.IsChecked = true;
                });
                $scope.PatientPaymentsReportsObj.SelectLocationString = "All";
                $scope.PatientPaymentsReportsObj.AllLocationStatusCheck = true;
            }

            if ($scope.PatientPaymentsReportsObj.AllUsersList.length > 0) {
                $scope.PatientPaymentsReportsObj.ReportUsersList = angular.copy($scope.PatientPaymentsReportsObj.AllUsersList);
                angular.forEach($scope.PatientPaymentsReportsObj.ReportUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.PatientPaymentsReportsObj.SelectUserStatusString = "All";
                $scope.PatientPaymentsReportsObj.AllUserStatusCheck = true;
            }
            if ($scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList.length > 0) {
                angular.forEach($scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList, function (item) {
                    item.IsChecked = true;
                });
                $scope.selectedDoctor = "All Doctors";
                $scope.PatientPaymentsReportsObj.AllDoctorCheck = true;
            }
            if ($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods.length > 0) {
                angular.forEach($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods, function (item) {
                    item.IsChecked = true;
                });
                $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = "All";
                $scope.PatientPaymentsReportsObj.AllStatusCheck = true;
            }
        };

        $scope.setPaymentDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Today
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate);
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    var currentDate = new Date();
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                    break;
                case 3: // Last week
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months

                    var result = getLastCompletedMonthsInfo(2);
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = result.startDate;
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = result.endDate

                    //$scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    //$scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 3 months

                    var result = getLastCompletedMonthsInfo(3);

                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = result.startDate;
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = result.endDate;

                    //$scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    //$scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 8: // Last 6 months
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 9: // This year
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 10: // Last year
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                case 11: // Custom Date
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = null;
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = null;
                    break;
                default:
                    $scope.PatientPaymentsReportsObj.PatientPayFromDate = moment().format("MM-DD-YYYY") || null;
                    $scope.PatientPaymentsReportsObj.PatientPayToDate = moment().format("MM-DD-YYYY") || null;
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
                case 1: // Today
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate);
                    $scope.PatientPaymentsReportsObj.ServiceToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    var currentDate = new Date();
                    $scope.PatientPaymentsReportsObj.ServiceToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                    break;
                case 3: // Last week

                    var today = new Date();
                    var day = today.getDay(); // 0 = Sunday, 1 = Monday, ...

                    // Calculate last week's Monday
                    var lastWeekStart = new Date(today);
                    lastWeekStart.setDate(today.getDate() - day - 6);

                    // Calculate last week's Sunday
                    var lastWeekEnd = new Date(lastWeekStart);
                    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

                    $scope.PatientPaymentsReportsObj.ServiceFromDate = lastWeekStart;
                    $scope.PatientPaymentsReportsObj.ServiceToDate = lastWeekEnd;


                    //$scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    //$scope.PatientPaymentsReportsObj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.PatientPaymentsReportsObj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.PatientPaymentsReportsObj.ServiceToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months

                    var result = getLastCompletedMonthsInfo(2);

                    $scope.PatientPaymentsReportsObj.ServiceFromDate  = result.startDate;
                    $scope.PatientPaymentsReportsObj.ServiceToDate = result.endDate;

                    //$scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    //$scope.PatientPaymentsReportsObj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 3 months

                    var result = getLastCompletedMonthsInfo(2);

                    $scope.PatientPaymentsReportsObj.ServiceFromDate = result.startDate;
                    $scope.PatientPaymentsReportsObj.ServiceToDate = result.endDate;

                    //$scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    //$scope.PatientPaymentsReportsObj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 8: // Last 6 months
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.PatientPaymentsReportsObj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 9: // This year
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.PatientPaymentsReportsObj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 10: // Last year
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.PatientPaymentsReportsObj.ServiceToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                case 11: // Custom Date
                    $scope.PatientPaymentsReportsObj.ServiceFromDate = null;
                    $scope.PatientPaymentsReportsObj.ServiceToDate = null;
                    break;
                default:
                    //$scope.PatientPaymentsReportsObj.ServiceFromDate = moment().format("MM-DD-YYYY") || null;
                    //$scope.PatientPaymentsReportsObj.ServiceToDate = moment().format("MM-DD-YYYY") || null;

                    $scope.PatientPaymentsReportsObj.ServiceFromDate = "";
                    $scope.PatientPaymentsReportsObj.ServiceToDate = "";
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

        let chartContainer = null;
        let RenderingchartContainer = null;
        let UserchartContainer = null;
        let PaymentchartContainer = null;

        const monthOrderMap = {
            January: 0,
            February: 1,
            March: 2,
            April: 3,
            May: 4,
            June: 5,
            July: 6,
            August: 7,
            September: 8,
            October: 9,
            November: 10,
            December: 11
        };

        function sortMonthWiseDataByYear(list) {
            if (!Array.isArray(list)) return [];

            return list.sort(function (a, b) {

                const [monthA, yearA] = a.Month.split("-");
                const [monthB, yearB] = b.Month.split("-");

                // Compare years first
                if (parseInt(yearA) !== parseInt(yearB)) {
                    return parseInt(yearA) - parseInt(yearB);
                }

                // Same year → compare month order
                return monthOrderMap[monthA] - monthOrderMap[monthB];
            });
        }





        $scope.GetPaymentGroupbyBillingProvider = function () {
            $scope.PaymentBillingProviderGraphList = [];
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

            var BillingProviderids = $scope.PatientPaymentsReportsObj.BillingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            var RenderingProviderIds = $scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");


            let obj = {
                "ParentOrganization": $scope.ParentHospitalId,
                "BillingProviderIds": BillingProviderids || null,
                "RenderingProviderIds": RenderingProviderIds || null,
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

                    $scope.PatientBillingProviderlist = resp.data.rows || [];
                    $scope.PaymentBillingProviderGraphList = resp.data.MonthWise || [];
                    if ($scope.PaymentBillingProviderGraphList.length > 0) {
                        /*$timeout($scope.BillingProviderChargesChart, 0);*/
                        $scope.PaymentBillingProviderGraphList = sortMonthWiseDataByYear($scope.PaymentBillingProviderGraphList);

                        $timeout(function () {
                           
                            chartContainer = $document[0].getElementById("billingProviderChart");
                            $scope.renderBillingProviderChart();
                        }, 0);


                    }

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };

        $scope.GetPaymentGroupbyRenderingProvider = function () {

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

            var BillingProviderids = $scope.PatientPaymentsReportsObj.BillingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            var RenderingProviderIds = $scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");


            let obj = {
                "ParentOrganization": $scope.ParentHospitalId,
                "BillingProviderIds": BillingProviderids || null,
                "RenderingProviderIds": RenderingProviderIds || null,
                "PaymentStartDate": $scope.PatientPaymentsReportsObj.PatientPayFromDate || "",
                "PaymentEndDate": $scope.PatientPaymentsReportsObj.PatientPayToDate || "",
                "ServiceStartDate": $scope.PatientPaymentsReportsObj.ServiceFromDate || "",
                "ServiceEndDate": $scope.PatientPaymentsReportsObj.ServiceToDate || "",
                "UserIds": UserIds || "",
                "LocationIds": Locationids || "",
                "PaymentTypeIds": PaymentModeids || "",
            };

            eHnoteInsuranceService.GetPatientPaymentsSummaryByRenderingProvider(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.PatientRenderingProviderlist = resp.data.rows || [];

                    $scope.RenderingProvidersGraphList = resp.data.MonthWise || [];

                    if ($scope.RenderingProvidersGraphList.length > 0) {
                      /*  $timeout($scope.RenderingProviderChargesChart, 0);*/

                        $timeout(function () {
                            $scope.RenderingProvidersGraphList = sortMonthWiseDataByYear($scope.RenderingProvidersGraphList);

                            RenderingchartContainer = $document[0].getElementById("RenderingProviderBarChart");
                            $scope.GetRenderingProviderChart();
                        }, 0);



                    }

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };


        $scope.GetPaymentGroupbyUserProvider = function () {
            $scope.PatientPaymentUsersList = [];
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

            var BillingProviderids = $scope.PatientPaymentsReportsObj.BillingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            var RenderingProviderIds = $scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");



            let obj = {
                "ParentOrganization": $scope.ParentHospitalId,
                "PaymentFromDate": $scope.PatientPaymentsReportsObj.PatientPayFromDate || "",
                "PaymentToDate": $scope.PatientPaymentsReportsObj.PatientPayToDate || "",
                "ServiceStartDate": $scope.PatientPaymentsReportsObj.ServiceFromDate || "",
                "ServiceEndDate": $scope.PatientPaymentsReportsObj.ServiceToDate || "",
                "UserIdsList": UserIds || "",
                "LocationIdsList": Locationids || "",
                "PaymentMethodsList": PaymentModeids || "",
            };

            eHnoteInsuranceService.GetAllUsersPatientPaymentsList(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.PatientUsersProviderlist = resp.data.rows || [];
                    $scope.PatientPaymentUsersList = resp.data.MonthWise || [];

                    if ($scope.PatientPaymentUsersList.length > 0) {
                        /*$timeout($scope.PatientPaymentUsersChargesChart, 0);*/

                        $scope.PatientPaymentUsersList = sortMonthWiseDataByYear($scope.PatientPaymentUsersList);
                    }

                    $timeout(function () {

                        UserchartContainer = $document[0].getElementById("PatPaymentUsersBarGraphChart");
                        $scope.PatientPaymentUsersChart();
                    }, 0);

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };
        $scope.GetPaymentGroupbyPaymentType = function () {

            $scope.PaymentTypesCharList = [];

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

            var BillingProviderIds = $scope.PatientPaymentsReportsObj.BillingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            var RenderingProviderIds = $scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");



            let obj = {
                "ParentOrganization": $scope.ParentHospitalId,
                "PaymentFromDate": $scope.PatientPaymentsReportsObj.PatientPayFromDate || "",
                "PaymentToDate": $scope.PatientPaymentsReportsObj.PatientPayToDate || "",
                "UserIdsList": UserIds || "",
                "LocationIdsList": Locationids || "",
                "BillingProviderIds": BillingProviderIds || "",
                "PaymentMethodsList": PaymentModeids || "",
            };

            eHnoteInsuranceService.GetPatientPaymentsListByPaymentMethod(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.PatientPaymentTypelist = resp.data.rows || [];
                    $scope.PaymentTypesCharList = resp.data.MonthWise || [];

                    if ($scope.PaymentTypesCharList.length > 0) {
                       /* $timeout($scope.PaymentTypeChargesChart, 0);*/

                        $scope.PaymentTypesCharList = sortMonthWiseDataByYear($scope.PaymentTypesCharList);

                        $timeout(function () {

                            PaymentchartContainer = $document[0].getElementById("PaymentTypeBarGraphChart");
                            $scope.PatientPaymentTypeChart();
                        }, 0);

                    }
                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };



        $scope.ShowPatientPaymentGrid = function (index) {

            $timeout(function () {

                const gridDiv = document.getElementById('mypatientPaymentGrid' + index);

                if (!gridDiv) {
                    console.warn('Grid div not found for index:', index);
                    return;
                }

                // Destroy previous grid safely
                if (gridDiv.__agGridInstance) {
                    gridDiv.__agGridInstance.api.destroy();
                }

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
                                        if (resp.data.status === "Success") {
                                            ssParams.success({
                                                rowData: resp.data.rows,
                                                rowCount: resp.data.totalCount || 10000
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

                        params.api.setGridOption('serverSideDatasource', serverSideDatasource);
                    }
                };

                const gridInstance = agGrid.createGrid(gridDiv, gridOptions);
                gridDiv.__agGridInstance = gridInstance;

            }, 0); // ⬅️ allows DOM to render
        };


        $scope.ClicktoOpenAccordian = function (item, index) {
            item.IsOpenAccordian = item.IsOpenAccordian || false;
            if (item.IsOpenAccordian) {
                item.IsOpenAccordian = false;
            } else {
                angular.forEach($scope.PatientBillingProviderlist, function (Aitem) {
                    Aitem.IsOpenAccordian = false;
                });
                item.IsOpenAccordian = true;
                $scope.$evalAsync(function () {
                    $scope.ShowPatientPaymentGrid(index);
                });
            }
        }







        $scope.openPaymentPopup = function (id, type) {
            let obj = {
                "id": id || 1,
                "type": type || '',
                "Mainobj": angular.copy($scope.PatientPaymentsReportsObj)
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/Reports/PatientGridContainer.html",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "PObj": function () { return obj; }
                },
                "windowClass": "offcanves-right",
                "controller": "UsPatientGridContainerCtrl",

            });
        }

        let InsBillingProviderchartContainer = null;
        let InsRenderingchartContainer = null;

        let InsRenderingPaymentchartContainer = null;
        let InsPayorPaymentchartContainer = null;


        $scope.GetInsurancePaymentGroupbyBillingProvider = function () {

            $scope.InsBillingProviderCharList = [];
            $scope.InsBillingProviderSummaryChartList = [];
            var Locationids = $scope.InsuranceReportsObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            let UserIds = $scope.InsuranceReportsObj.AllUsersList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");



            var BillingProviderids = $scope.InsuranceReportsObj.BillingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            var RenderingProviderIds = $scope.InsuranceReportsObj.RenderingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");
            var MasterPayorIds = null;
            $scope.InsuranceReportsObj.AllMasterPayorsInd = 1;
            if ($scope.InsuranceReportsObj.AllPayorList.length>0) {
                 MasterPayorIds = $scope.InsuranceReportsObj.AllPayorList
                    .map(pitem => pitem.PayorId)
                    .join(",");
                $scope.InsuranceReportsObj.AllMasterPayorsInd = 0;
            }
            var PcpReferralIds = null;
            $scope.InsuranceReportsObj.AllReferralProviderInd = 1;
            if ($scope.InsuranceReportsObj.AllReferalList.length>0) {
                PcpReferralIds = $scope.InsuranceReportsObj.AllReferalList
                    .map(pitem => pitem.PcpReferralId)
                    .join(",");
                $scope.InsuranceReportsObj.AllReferralProviderInd = 0;
            }

            var ProcedureIds = null;
            $scope.InsuranceReportsObj.AllProcedureInd = 1;
            if ($scope.InsuranceReportsObj.AllProcedureList.length>0) {
                ProcedureIds = $scope.InsuranceReportsObj.AllProcedureList
                    .map(pitem => pitem.ProcedureId)
                    .join(",");
                $scope.InsuranceReportsObj.AllProcedureInd = 0;
            }

            let obj = {
                "ParentOrganization": $scope.ParentHospitalId,
                "AllLocationInd": 0,
                "LocationIds": Locationids || "",
                "AllBillingProviderInd": 0,
                "BillingProviderIds": BillingProviderids || null,
                "AllRenderingProviderInd": 0,
                "RenderingProviderIds": RenderingProviderIds || null,
                "UserIds": UserIds || "",
                "AllMasterPayorsInd": $scope.InsuranceReportsObj.AllMasterPayorsInd||1,
                "MasterPayorIds": MasterPayorIds||null,
                "AllProcedureInd": $scope.InsuranceReportsObj.AllProcedureInd||1,
                "ProcedureIds": ProcedureIds||null,
                "AllReferralProviderInd": $scope.InsuranceReportsObj.AllReferralProviderInd||1,
                "ReferralProviderIds": PcpReferralIds||null,
                "AllPostingUsersInd": 0,
                "PostingUserIds": UserIds,
                "PaymentEndDate": $scope.InsuranceReportsObj.PaymentToDate || "",
                "PaymentStartDate": $scope.InsuranceReportsObj.PaymentFromDate || "",
                "DOSFrom": $scope.InsuranceReportsObj.DOSFromDate || "",
                "DOSTo": $scope.InsuranceReportsObj.DOSToDate || "",
                "ChkPostedFromDate": $scope.InsuranceReportsObj.ChkPostedFromDate || "",
                "ChkPostedToDate": $scope.InsuranceReportsObj.ChkPostedToDate || "",
                "PageSize": 100,
                "PageNumber": 1
            };

            eHnoteInsuranceService.GetAllSummaryInsurancePaymentsDataByBillingProviders_New(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.InsuranceBillingProviderlist = resp.data.rows || [];

                    $scope.InsBillingProviderCharList = resp.data.MonthWiseData || [];

                    $scope.ShowBillingProviderMonthsDataSummary = false;

                    if ($scope.InsBillingProviderCharList.length > 0) {
                        
                        if ($scope.InsuranceReportsObj.PaymentDateRangeId == 7 || $scope.InsuranceReportsObj.PaymentDateRangeId == 6 ) {
                            $scope.ShowBillingProviderMonthsDataSummary = true;
                            $scope.MonthsArray = $scope.InsuranceReportsObj.MonthsArray;
                            $scope.InsBillingProviderSummaryChartList = buildMonthWisePaymentMapTable($scope.InsBillingProviderCharList, $scope.MonthsArray, 'InsBillingProvider');
                        } else {
                            $scope.ShowBillingProviderMonthsDataSummary = false;
                        }
                        $scope.InsBillingProviderCharList = sortMonthWiseDataByYear($scope.InsBillingProviderCharList);

                        $timeout(function () {

                            InsBillingProviderchartContainer = $document[0].getElementById("InsBillingProviderBarChart");
                            $scope.GetInsBillingProviderChart();
                        }, 0);
                    }

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };



        $scope.navtoOpenInsuranceGridReport = function (tabno) {
            //if ($scope.SubTab === tabno) return;
            $scope.InsSubTab = tabno || "";
            if (tabno == 'BillingProvider') {
                $timeout(function () {
                    $scope.InsuranceBillingProviderlist = [];
                    $scope.GetInsurancePaymentGroupbyBillingProvider();
                }, 500);
            }
            else if (tabno == 'RenderingProvider') {
                $timeout(function () {
                    //  $scope.ShowPatientPaymentGrid();
                    $scope.InsuranceSummaryRenderingProviderlist = [];
                    $scope.GetInsuranceSummarybyRenderingProvider();
                }, 500);
            }
            else if (tabno == 'Payor') {
                $timeout(function () {
                    //  $scope.ShowPatientPaymentGrid();
                    $scope.InsuranceSummaryPayorlist = [];
                    $scope.GetInsuranceSummarybyPayor();
                }, 500);
            } else {
            }

        };

        $scope.ClickForInsuranceFilteredData = function () {
            angular.element(document.querySelector('.popover')).remove();
            if ($scope.InsSubTab == 'BillingProvider') {
                $scope.GetInsurancePaymentGroupbyBillingProvider();
            }
            else if ($scope.InsSubTab == 'RenderingProvider') {
                $scope.GetInsuranceSummarybyRenderingProvider();
            }
            else if ($scope.InsSubTab == 'Payor') {
                $scope.GetInsuranceSummarybyPayor();
            } else {
                alertify.error("Please select a sub tab to continue.");
                return false;
            }

        }

        $scope.openInsurancePaymentPopup = function (id, type,item) {
            let obj = {
                "id": id || 1,
                "type": type || '',
                "Mainobj": angular.copy($scope.InsuranceReportsObj),
                "selecteditem": item,
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/Reports/InsuranceGridContainer.html",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "PObj": function () { return obj; }
                },
                "windowClass": "offcanves-right",
                "controller": "UsInsuranceGridContainerCtrl",

            });
        }

        $scope.setInsuranceCheckDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Today
                    $scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate);
                    $scope.InsuranceReportsObj.PaymentToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    var currentDate = new Date();
                    $scope.InsuranceReportsObj.PaymentToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                    break;
                case 3: // Last week
                    $scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    $scope.InsuranceReportsObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.InsuranceReportsObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.InsuranceReportsObj.PaymentToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months
                    var result = getLastCompletedMonthsInfo(2);

                    $scope.InsuranceReportsObj.PaymentFromDate = result.startDate;
                    $scope.InsuranceReportsObj.PaymentToDate = result.endDate;
                    $scope.InsuranceReportsObj.MonthsArray = result.months;

                    //$scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    //$scope.InsuranceReportsObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 3 months

                    var result = getLastCompletedMonthsInfo(3);

                    $scope.InsuranceReportsObj.PaymentFromDate = result.startDate;
                    $scope.InsuranceReportsObj.PaymentToDate = result.endDate;
                    $scope.InsuranceReportsObj.MonthsArray = result.months;


                    //$scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    //$scope.InsuranceReportsObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 8: // Last 6 months
                    $scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.InsuranceReportsObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 9: // This year
                    $scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.InsuranceReportsObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 10: // Last year
                    $scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.InsuranceReportsObj.PaymentToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                case 11: // Custom Date
                    $scope.InsuranceReportsObj.PaymentFromDate = null;
                    $scope.InsuranceReportsObj.PaymentToDate = null;
                    break;
                default:
                  //  $scope.InsuranceReportsObj.PaymentFromDate = moment().format("MM-DD-YYYY") || null;
                  //  $scope.InsuranceReportsObj.PaymentToDate = moment().format("MM-DD-YYYY") || null;

                    $scope.InsuranceReportsObj.PaymentFromDate = "";
                    $scope.InsuranceReportsObj.PaymentToDate = "";
            }

            $scope.InsuranceReportsObj.PaymentFromDate = $scope.InsuranceReportsObj.PaymentFromDate;
            $scope.InsuranceReportsObj.PaymentToDate = $scope.InsuranceReportsObj.PaymentToDate;

            if ($scope.InsuranceReportsObj.PaymentFromDate != '') {
                $scope.InsuranceReportsObj.PaymentFromDate = $filter('date')($scope.InsuranceReportsObj.PaymentFromDate, "MM-dd-yyyy");
            }
            if ($scope.InsuranceReportsObj.PaymentToDate != '') {
                $scope.InsuranceReportsObj.PaymentToDate = $filter('date')($scope.InsuranceReportsObj.PaymentToDate, "MM-dd-yyyy");
            }
        };

        $scope.setDOSDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Today
                    $scope.InsuranceReportsObj.DOSFromDate = new Date(currentDate);
                    $scope.InsuranceReportsObj.DOSToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.InsuranceReportsObj.DOSFromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    var currentDate = new Date();
                    $scope.InsuranceReportsObj.DOSToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                    break;
                case 3: // Last week

                    var today = new Date();
                    var day = today.getDay(); // 0 = Sunday, 1 = Monday, ...

                    // Calculate last week's Monday
                    var lastWeekStart = new Date(today);
                    lastWeekStart.setDate(today.getDate() - day - 6);

                    // Calculate last week's Sunday
                    var lastWeekEnd = new Date(lastWeekStart);
                    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

                    $scope.InsuranceReportsObj.DOSFromDate = lastWeekStart;
                    $scope.InsuranceReportsObj.DOSToDate = lastWeekEnd;

                    //$scope.InsuranceReportsObj.DOSFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    //$scope.InsuranceReportsObj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.InsuranceReportsObj.DOSFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.InsuranceReportsObj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.InsuranceReportsObj.DOSFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.InsuranceReportsObj.DOSToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months

                    var result = getLastCompletedMonthsInfo(2);

                    $scope.InsuranceReportsObj.DOSFromDate = result.startDate;
                    $scope.InsuranceReportsObj.DOSToDate = result.endDate;

                    //$scope.InsuranceReportsObj.DOSFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    //$scope.InsuranceReportsObj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 3 months

                    var result = getLastCompletedMonthsInfo(3);

                    $scope.InsuranceReportsObj.DOSFromDate = result.startDate;
                    $scope.InsuranceReportsObj.DOSToDate = result.endDate;

                    //$scope.InsuranceReportsObj.DOSFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    //$scope.InsuranceReportsObj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 8: // Last 6 months
                    $scope.InsuranceReportsObj.DOSFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.InsuranceReportsObj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 9: // This year
                    $scope.InsuranceReportsObj.DOSFromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.InsuranceReportsObj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 10: // Last year
                    $scope.InsuranceReportsObj.DOSFromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.InsuranceReportsObj.DOSToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                case 11: // Custom Date
                    $scope.InsuranceReportsObj.DOSFromDate = null;
                    $scope.InsuranceReportsObj.DOSToDate = null;
                    break;
                default:
                    $scope.InsuranceReportsObj.DOSFromDate = "";
                    $scope.InsuranceReportsObj.DOSToDate = "";
            }

            $scope.InsuranceReportsObj.DOSFromDate = $scope.InsuranceReportsObj.DOSFromDate;
            $scope.InsuranceReportsObj.DOSToDate = $scope.InsuranceReportsObj.DOSToDate;

            if ($scope.InsuranceReportsObj.DOSFromDate != '') {
                $scope.InsuranceReportsObj.DOSFromDate = $filter('date')($scope.InsuranceReportsObj.DOSFromDate, "MM-dd-yyyy");
            }
            if ($scope.InsuranceReportsObj.DOSToDate != '') {
                $scope.InsuranceReportsObj.DOSToDate = $filter('date')($scope.InsuranceReportsObj.DOSToDate, "MM-dd-yyyy");
            }
        };

        $scope.GetInsuranceSummarybyRenderingProvider = function () {

            $scope.InsRenderingProviderSummaryChartList = [];
            var Locationids = $scope.InsuranceReportsObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            let UserIds = $scope.InsuranceReportsObj.AllUsersList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");



            var BillingProviderids = $scope.InsuranceReportsObj.BillingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            var RenderingProviderIds = $scope.InsuranceReportsObj.RenderingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");
            var MasterPayorIds = null;
            $scope.InsuranceReportsObj.AllMasterPayorsInd = 1;
            if ($scope.InsuranceReportsObj.AllPayorList.length > 0) {
                MasterPayorIds = $scope.InsuranceReportsObj.AllPayorList
                    .map(pitem => pitem.PayorId)
                    .join(",");
                $scope.InsuranceReportsObj.AllMasterPayorsInd = 0;
            }
            var PcpReferralIds = null;
            $scope.InsuranceReportsObj.AllReferralProviderInd = 1;
            if ($scope.InsuranceReportsObj.AllReferalList.length > 0) {
                PcpReferralIds = $scope.InsuranceReportsObj.AllReferalList
                    .map(pitem => pitem.PcpReferralId)
                    .join(",");
                $scope.InsuranceReportsObj.AllReferralProviderInd = 0;
            }

            var ProcedureIds = null;
            $scope.InsuranceReportsObj.AllProcedureInd = 1;
            if ($scope.InsuranceReportsObj.AllProcedureList.length > 0) {
                ProcedureIds = $scope.InsuranceReportsObj.AllProcedureList
                    .map(pitem => pitem.ProcedureId)
                    .join(",");
                $scope.InsuranceReportsObj.AllProcedureInd = 0;
            }

            let obj = {
                "ParentOrganization": $scope.ParentHospitalId,
                "AllLocationInd": 0,
                "LocationIds": Locationids || "",
                "AllBillingProviderInd": 0,
                "BillingProviderIds": BillingProviderids || null,
                "AllRenderingProviderInd": 0,
                "RenderingProviderIds": RenderingProviderIds || null,
                "UserIds": UserIds || "",
                "AllMasterPayorsInd": $scope.InsuranceReportsObj.AllMasterPayorsInd || 1,
                "MasterPayorIds": MasterPayorIds || null,
                "AllProcedureInd": $scope.InsuranceReportsObj.AllProcedureInd || 1,
                "ProcedureIds": ProcedureIds || null,
                "AllReferralProviderInd": $scope.InsuranceReportsObj.AllReferralProviderInd || 1,
                "ReferralProviderIds": PcpReferralIds || null,
                "AllPostingUsersInd": 0,
                "PostingUserIds": UserIds,
                "PaymentEndDate": $scope.InsuranceReportsObj.PaymentToDate || "",
                "PaymentStartDate": $scope.InsuranceReportsObj.PaymentFromDate || "",
                "DOSFrom": $scope.InsuranceReportsObj.DOSFromDate || "",
                "DOSTo": $scope.InsuranceReportsObj.DOSToDate || "",
                "ChkPostedFromDate": $scope.InsuranceReportsObj.ChkPostedFromDate || "",
                "ChkPostedToDate": $scope.InsuranceReportsObj.ChkPostedToDate || "",
                "PageSize": 100,
                "PageNumber": 1
            };

            eHnoteInsuranceService.GetInsurancePaymentsSummaryByRenderingProvider(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.InsuranceSummaryRenderingProviderlist = resp.data.rows || [];

                    $scope.InsRenderingProviderCharList = resp.data.MonthWise || [];
                    $scope.ShowRenderingProviderMonthsDataSummary = false;
                    if ($scope.InsRenderingProviderCharList.length > 0) {
                        $scope.InsRenderingProviderCharList = sortMonthWiseDataByYear($scope.InsRenderingProviderCharList);

                        if ($scope.InsuranceReportsObj.PaymentDateRangeId == 7 || $scope.InsuranceReportsObj.PaymentDateRangeId == 6) {
                            $scope.ShowRenderingProviderMonthsDataSummary = true;
                            $scope.MonthsArray = $scope.InsuranceReportsObj.MonthsArray;
                            $scope.InsRenderingProviderSummaryChartList = buildMonthWisePaymentMapTable($scope.InsRenderingProviderCharList, $scope.MonthsArray, 'InsRenderingProvider');
                        } else {
                            $scope.ShowRenderingProviderMonthsDataSummary = false;
                        }

                    }

                    $timeout(function () {

                        InsRenderingPaymentchartContainer = $document[0].getElementById("InsRenderingProviderPaymentBarChart");
                        $scope.GetInsRenderingProviderInsPaymentChart();
                    }, 0);

                    //if ($scope.InsuranceReportsObj.PaymentDateRangeId == 4 || $scope.InsuranceReportsObj.PaymentDateRangeId == 5) {
                    //    $timeout(function () {

                    //        InsRenderingchartContainer = $document[0].getElementById("InsRenderingProviderBarChart");
                    //        $scope.GetInsRenderingProviderChart();
                    //    }, 0);
                    //} else {
                    //    $timeout(function () {

                    //        InsRenderingPaymentchartContainer = $document[0].getElementById("InsRenderingProviderPaymentBarChart");
                    //        $scope.GetInsRenderingProviderInsPaymentChart();
                    //    }, 0);
                    //}

                    //if ($scope.ShowRenderingProviderMonthsDataSummary == false && InsRenderingPaymentchartContainer != null) {
                    //    $scope.showRenderingBarGraph = true;
                    //} else {
                    //    $scope.showRenderingBarGraph = false;
                    //}


                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };
        $scope.GetInsuranceSummarybyPayor = function () {

            $scope.PayorsChartListData = [];
            $scope.InsPayorsSummaryChartList = [];
            var Locationids = $scope.InsuranceReportsObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            let UserIds = $scope.InsuranceReportsObj.AllUsersList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");



            var BillingProviderids = $scope.InsuranceReportsObj.BillingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            var RenderingProviderIds = $scope.InsuranceReportsObj.RenderingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");

            var MasterPayorIds = null;
            $scope.InsuranceReportsObj.AllMasterPayorsInd = 1;
            if ($scope.InsuranceReportsObj.AllPayorList.length > 0) {
                MasterPayorIds = $scope.InsuranceReportsObj.AllPayorList
                    .map(pitem => pitem.PayorId)
                    .join(",");
                $scope.InsuranceReportsObj.AllMasterPayorsInd = 0;
            }
            var PcpReferralIds = null;
            $scope.InsuranceReportsObj.AllReferralProviderInd = 1;
            if ($scope.InsuranceReportsObj.AllReferalList.length > 0) {
                PcpReferralIds = $scope.InsuranceReportsObj.AllReferalList
                    .map(pitem => pitem.PcpReferralId)
                    .join(",");
                $scope.InsuranceReportsObj.AllReferralProviderInd = 0;
            }

            var ProcedureIds = null;
            $scope.InsuranceReportsObj.AllProcedureInd = 1;
            if ($scope.InsuranceReportsObj.AllProcedureList.length > 0) {
                ProcedureIds = $scope.InsuranceReportsObj.AllProcedureList
                    .map(pitem => pitem.ProcedureId)
                    .join(",");
                $scope.InsuranceReportsObj.AllProcedureInd = 0;
            }


            let obj = {
                "ParentOrganization": $scope.ParentHospitalId,
                "AllLocationInd": 0,
                "LocationIds": Locationids || "",
                "AllBillingProviderInd": 0,
                "BillingProviderIds": BillingProviderids || null,
                "AllRenderingProviderInd": 0,
                "RenderingProviderIds": RenderingProviderIds || null,
                "UserIds": UserIds || "",
                "AllMasterPayorsInd": $scope.InsuranceReportsObj.AllMasterPayorsInd || 1,
                "MasterPayorIds": MasterPayorIds || null,
                "AllProcedureInd": $scope.InsuranceReportsObj.AllProcedureInd || 1,
                "ProcedureIds": ProcedureIds || null,
                "AllReferralProviderInd": $scope.InsuranceReportsObj.AllReferralProviderInd || 1,
                "ReferralProviderIds": PcpReferralIds || null,
                "AllPostingUsersInd": 0,
                "PostingUserIds": UserIds,
                "PaymentEndDate": $scope.InsuranceReportsObj.PaymentToDate || "",
                "PaymentStartDate": $scope.InsuranceReportsObj.PaymentFromDate || "",
                "DOSFrom": $scope.InsuranceReportsObj.DOSFromDate || "",
                "DOSTo": $scope.InsuranceReportsObj.DOSToDate || "",
                "ChkPostedFromDate": $scope.InsuranceReportsObj.ChkPostedFromDate || "",
                "ChkPostedToDate": $scope.InsuranceReportsObj.ChkPostedToDate || "",
                "PageSize": 100,
                "PageNumber": 1
            };

            eHnoteInsuranceService.GetAllSummaryInsurancePaymentsDataByPayor(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.InsuranceSummaryPayorlist = resp.data.rows || [];

                    $scope.PayorsChartListData = resp.data.MonthWiseData || [];
                    $scope.ShowPayorsMonthsDataSummary = false;
                    if ($scope.PayorsChartListData.length > 0) {
                        $scope.PayorsChartListData = sortMonthWiseDataByYear($scope.PayorsChartListData);

                        if ($scope.InsuranceReportsObj.PaymentDateRangeId == 7 || $scope.InsuranceReportsObj.PaymentDateRangeId == 6) {
                            $scope.ShowPayorsMonthsDataSummary = true;
                            $scope.MonthsArray = $scope.InsuranceReportsObj.MonthsArray;
                            $scope.InsPayorsSummaryChartList = buildMonthWisePaymentMapTable($scope.PayorsChartListData, $scope.MonthsArray, 'PayorPayment');
                        } else {
                            $scope.ShowPayorsMonthsDataSummary = false;
                        }

                    }

                    $timeout(function () {

                        InsPayorPaymentchartContainer = $document[0].getElementById("PayorPaymentBarChart");
                        $scope.GetPayorInsPaymentChart();
                    }, 0);

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };

        $scope.ChangeReportsUser = function (item) {

            var checkedArray = _.where($scope.PatientPaymentsReportsObj.ReportUsersList, { IsChecked: true });
            $scope.PatientPaymentsReportsObj.AllUserStatusCheck = checkedArray.length > 0 && $scope.PatientPaymentsReportsObj.ReportUsersList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.PatientPaymentsReportsObj.SelectUserStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.PatientPaymentsReportsObj.SelectUserStatusString = checkedArray[0].SecondUserFullName;
                } else if (checkedArray.length == $scope.PatientPaymentsReportsObj.ReportUsersList.length) {
                    $scope.PatientPaymentsReportsObj.SelectUserStatusString = "All";
                } else {
                    $scope.PatientPaymentsReportsObj.SelectUserStatusString = "Selected";
                }
            }
        };

        function getMonthIndex(monthYear) {
            if (!monthYear) return -1;

            var parts = monthYear.split("-");   // "January-2026" → ["January","2026"]
            var monthName = parts[0];

            var months = [
                "January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December"
            ];

            return months.indexOf(monthName);
        }


        $scope.BillingProviderChargesChart = function () {

            if (!$scope.PaymentBillingProviderGraphList ||
                !$scope.PaymentBillingProviderGraphList.length) {
                return;
            }

            var labels = [];
            var providerMap = {};
            var monthMap = {};

            // 1️⃣ Collect providers
            angular.forEach($scope.PaymentBillingProviderGraphList, function (item) {
                if (providerMap[item.BillingProviderId] === undefined) {
                    providerMap[item.BillingProviderId] = labels.length;
                    labels.push(item.BillingProviderName);
                }
            });

            // 2️⃣ Collect months
            angular.forEach($scope.PaymentBillingProviderGraphList, function (item) {
                if (!monthMap[item.Month]) {
                    monthMap[item.Month] = new Array(labels.length).fill(0);
                }
            });

            // 3️⃣ Map values
            angular.forEach($scope.PaymentBillingProviderGraphList, function (item) {
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



        $scope.RenderingProviderChargesChart = function () {

            if (!$scope.RenderingProvidersGraphList ||
                !$scope.RenderingProvidersGraphList.length) {
                return;
            }

            var Renderinglabels = [];
            var providerMap = {};
            var monthMap = {};

            // 1️⃣ Collect providers
            angular.forEach($scope.RenderingProvidersGraphList, function (item) {
                if (providerMap[item.RenderingProviderId] === undefined) {
                    providerMap[item.RenderingProviderId] = Renderinglabels.length;
                    Renderinglabels.push(item.RenderingProviderName);
                }
            });

            // 2️⃣ Collect months
            angular.forEach($scope.RenderingProvidersGraphList, function (item) {
                if (!monthMap[item.Month]) {
                    monthMap[item.Month] = new Array(Renderinglabels.length).fill(0);
                }
            });

            // 3️⃣ Map values
            angular.forEach($scope.RenderingProvidersGraphList, function (item) {
                var providerIndex = providerMap[item.RenderingProviderId];
                monthMap[item.Month][providerIndex] = item.TotalPaymentAmount || 0;
            });

            // 4️⃣ SORT MONTHS CORRECTLY
            var sortedMonths = Object.keys(monthMap).sort(function (a, b) {
                return getMonthIndex(a) - getMonthIndex(b);
            });

            // 5️⃣ Build datasets in sorted order
            var colors = ["#1B5E20", "#1565C0", "#6A1B9A", "#1f4e79", "#ed7d31", "#548235", "#7030a0", "#009688", "#EF6C00", "#2E7D32", "#283593"];
            var datasets = [];

            angular.forEach(sortedMonths, function (month, index) {
                datasets.push({
                    label: month,
                    data: monthMap[month],
                    backgroundColor: colors[index % colors.length]
                });
            });

            var ctx = document.getElementById("RenderingProviderChart").getContext("2d");

            if ($scope.renderingProviderChartInstance) {
                $scope.renderingProviderChartInstance.destroy();
            }

            $scope.renderingProviderChartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: Renderinglabels,
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
                                text: "Rendering Provider"
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


        $scope.payerFilterPopover = {
            templateUrl: 'payerFilterPopover.html',
        };

        $scope.PatientPaymentUsersChargesChart = function () {

            var list = $scope.PatientPaymentUsersList;
            if (!list || !list.length) return;

            // 1️⃣ UNIQUE USERS
            var labels = [];
            var userIndexMap = {};

            list.forEach(function (item) {
                if (userIndexMap[item.UserId] === undefined) {
                    userIndexMap[item.UserId] = labels.length;
                    labels.push(item.UserName);
                }
            });

            // 2️⃣ UNIQUE MONTHS
            var months = [];
            var monthIndexMap = {};

            list.forEach(function (item) {
                if (monthIndexMap[item.Month] === undefined) {
                    monthIndexMap[item.Month] = months.length;
                    months.push(item.Month);
                }
            });

            // 3️⃣ SORT MONTHS (YEAR + MONTH)
            months.sort(function (a, b) {
                return getMonthIndex(a) - getMonthIndex(b);
            });

            // rebuild index after sort
            monthIndexMap = {};
            months.forEach(function (m, i) {
                monthIndexMap[m] = i;
            });

            // 4️⃣ CREATE EMPTY MATRIX [month][user]
            var matrix = months.map(function () {
                return new Array(labels.length).fill(0);
            });

            // 5️⃣ FILL MATRIX
            list.forEach(function (item) {
                var mIdx = monthIndexMap[item.Month];
                var uIdx = userIndexMap[item.UserId];

                if (mIdx !== undefined && uIdx !== undefined) {
                    matrix[mIdx][uIdx] += item.TotalPaymentAmount || 0;
                }
            });

            // 6️⃣ BUILD DATASETS
            var colors = [
                "#1B5E20", "#1565C0", "#6A1B9A",
                "#1f4e79", "#ed7d31", "#548235"
            ];

            var datasets = months.map(function (month, i) {
                return {
                    label: month,
                    data: matrix[i],
                    backgroundColor: colors[i % colors.length]
                };
            });

            // 7️⃣ RENDER CHART
            var canvas = document.getElementById("PaymentUsersChart");
            if (!canvas) {
                console.error("PaymentUsersChart canvas not found");
                return;
            }

            var ctx = canvas.getContext("2d");

            if ($scope.PaymentUserChartInstance) {
                $scope.PaymentUserChartInstance.destroy();
            }

            $scope.PaymentUserChartInstance = new Chart(ctx, {
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


        $scope.ChangeReportsPaymentType = function (item) {

            var checkedArray = _.where($scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods, { IsChecked: true });
            $scope.PatientPaymentsReportsObj.AllStatusCheck = checkedArray.length > 0 && $scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = checkedArray[0].PaymentModeName;
                } else if (checkedArray.length == $scope.PatientPaymentsReportsObj.AllMasterPaymentsMethods.length) {
                    $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = "All";
                } else {
                    $scope.PatientPaymentsReportsObj.SelectPaymentStatusString = "Selected";
                }
            }
        };


        $scope.PaymentTypeChargesChart = function () {

            var list = $scope.PaymentTypesCharList;
            if (!list || !list.length) return;

            // 1️⃣ UNIQUE USERS
            var PaymentTypelabels = [];
            var userIndexMap = {};

            list.forEach(function (item) {
                if (userIndexMap[item.PaymentMethodId] === undefined) {
                    userIndexMap[item.PaymentMethodId] = PaymentTypelabels.length;
                    PaymentTypelabels.push(item.PaymentMethodName);
                }
            });

            // 2️⃣ UNIQUE MONTHS
            var months = [];
            var monthIndexMap = {};

            list.forEach(function (item) {
                if (monthIndexMap[item.Month] === undefined) {
                    monthIndexMap[item.Month] = months.length;
                    months.push(item.Month);
                }
            });

            // 3️⃣ SORT MONTHS (YEAR + MONTH)
            months.sort(function (a, b) {
                return getMonthIndex(a) - getMonthIndex(b);
            });

            // rebuild index after sort
            monthIndexMap = {};
            months.forEach(function (m, i) {
                monthIndexMap[m] = i;
            });

            // 4️⃣ CREATE EMPTY MATRIX [month][user]
            var matrix = months.map(function () {
                return new Array(PaymentTypelabels.length).fill(0);
            });

            // 5️⃣ FILL MATRIX
            list.forEach(function (item) {
                var mIdx = monthIndexMap[item.Month];
                var uIdx = userIndexMap[item.PaymentMethodId];

                if (mIdx !== undefined && uIdx !== undefined) {
                    matrix[mIdx][uIdx] += item.TotalPaymentAmount || 0;
                }
            });

            // 6️⃣ BUILD DATASETS
            var colors = [
                "#1B5E20", "#1565C0", "#6A1B9A",
                "#1f4e79", "#ed7d31", "#548235"
            ];

            var datasets = months.map(function (month, i) {
                return {
                    label: month,
                    data: matrix[i],
                    backgroundColor: colors[i % colors.length]
                };
            });

            // 7️⃣ RENDER CHART
            var canvas = document.getElementById("PaymentTypeChart");
            if (!canvas) {
                console.error("PaymentTypeChart canvas not found");
                return;
            }

            var ctx = canvas.getContext("2d");

            if ($scope.PaymentUserChartInstance) {
                $scope.PaymentUserChartInstance.destroy();
            }

            $scope.PaymentUserChartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: PaymentTypelabels,
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

        $scope.calculateExpiryDate = function (item) {

            var currentDate = new Date();

            currentDate.setDate(currentDate.getDate() + 90);

            var expiryMonth = currentDate.getMonth() + 1;
            var expiryDay = currentDate.getDate();
            var expiryYear = currentDate.getFullYear();

            expiryMonth = expiryMonth < 10 ? '0' + expiryMonth : expiryMonth;
            expiryDay = expiryDay < 10 ? '0' + expiryDay : expiryDay;

            item.ClaimExpiryDate = `${expiryMonth}-${expiryDay}-${expiryYear}`;
        };

        $scope.navtoClaimSummaryInNewTab = function (item) {
            $scope.calculateExpiryDate(item);
            item = item || '';
            let AppointmentId = null;
            let PatientId = null;
            if (item != '') {
                AppointmentId = item.AppointmentId;
                PatientId = item.PatientId;
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
                "ResponcibilityId": item.ResponcibilityId || 0,
                "IsCreateSuperBill": false,
                "PatientClaimId": item.PatientClaimId,
                "SuperBillArray": [],
                "ClaimExpiryDate": item.ClaimExpiryDate || null,
                "AppointmentDoctorId": item.RenderingProviderId || 0,
                "PageNumber": 1,
            };
            $scope.mainBillerDataObj.Tabid = 2;
            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
            datapersistanceFactory.set("mainDataBillerObj", $scope.mainBillerDataObj);
            $window.open("#/claim/" + item.PatientClaimId, "_blank");
        }




        $scope.closeFilterPopover = function () {
            angular.element(document.querySelector('.popover')).remove();
        };
        $scope.isPopoverOpen = false;
        $scope.togglePopover = function () {
            $scope.isPopoverOpen = !$scope.isPopoverOpen;
        };
        $scope.ChangeInsurancePayor = function (item) {
            if ($scope.InsuranceReportsObj.AllPayorList.length > 0) {
                var filterList = $filter("filter")($scope.InsuranceReportsObj.AllPayorList, { "PayorId": item.OrganizationPayorId },true) || [];
                if (filterList.length == 0) {
                    let obj = {
                        "PayorId": item.OrganizationPayorId,
                        "PayorName": item.OrganizationPayorName,
                    }
                    $scope.InsuranceReportsObj.AllPayorList.push(obj);
                } else {
                    alertify.error("Payor is already selected");
                    return false;
                }
            } else {
                let obj = {
                    "PayorId": item.OrganizationPayorId,
                    "PayorName": item.OrganizationPayorName,
                }
                $scope.InsuranceReportsObj.AllPayorList.push(obj);
            }
            $scope.InsuranceReportsObj.PayorObj = "";
    
        }

        $scope.GetReferalPCPDoctors = function (val, typeid) {
            
            var searchText = "", searchNpi = "";
            if (/^[0-9]+$/.test(val)) {
                searchNpi = val;
            } else {
                searchText = val;
            }
            $scope.IsProviderDrListEmpty = false;

            var newreqObj = {
                'LocationId': null,
                'PageNumber': 1,
                'PageSize': 10,
                'SearchTaxt': searchText || '',
                'NPI': searchNpi || '',
                "SpecializationId": null,
                "RefaralTypeId": typeid,
                "DeleteInd": 'N',
                "OrganizationId": $scope.HospitalId
            };
            return eHnoteReferalDataService.GetReferalPCPDoctors(newreqObj).then(function (resp) {

                if (resp.data.status == "Success") {
                    if (resp.data.count == 0) {
                        $scope.IsProviderDrListEmpty = true;
                    }
                    return resp.data.PcpRefdetails.map(function (mitem) {
                        return mitem;
                    });
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {
                console.log(error);
            });

        };

        $scope.onSelectReferral = function (item) {
            if ($scope.InsuranceReportsObj.AllReferalList.length > 0) {
                var filterList = $filter("filter")($scope.InsuranceReportsObj.AllReferalList, { "PcpReferralId": item.PcpReferralId }, true) || [];
                if (filterList.length == 0) {
                    let obj = {
                        "PcpReferralId": item.PcpReferralId,
                        "FullName": item.FullName,
                    }
                    $scope.InsuranceReportsObj.AllReferalList.push(obj);
                } else {
                    alertify.error("Referal is already selected");
                    return false;
                }
            } else {
                let obj = {
                    "PcpReferralId": item.PcpReferralId,
                    "FullName": item.FullName,
                }
                $scope.InsuranceReportsObj.AllReferalList.push(obj);
            }
            $scope.InsuranceReportsObj.ReferringObj = "";

        }

        $scope.onselectServiceItem = function (item) {
            if ($scope.InsuranceReportsObj.AllProcedureList.length > 0) {
                var filterList = $filter("filter")($scope.InsuranceReportsObj.AllProcedureList, { "ProcedureId": item.ProcedureId }, true) || [];
                if (filterList.length == 0) {
                    let obj = {
                        "ProcedureId": item.ProcedureId,
                        "ProcedureName": item.ProcedureName,                       
                    }
                    $scope.InsuranceReportsObj.AllProcedureList.push(obj);
                } else {
                    alertify.error("Procedure is already selected");
                    return false;
                }
            } else {
                let obj = {
                    "ProcedureId": item.ProcedureId,
                    "ProcedureName": item.ProcedureName,
                }
                $scope.InsuranceReportsObj.AllProcedureList.push(obj);
            }
            $scope.InsuranceReportsObj.ServiceObj = "";

        }

        $scope.GetOrganizationProcedure = function (text) {
            var params = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",  // cptcode tblorganizationprocedure
                "SearchText": text || "", // searchtext
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "Status": 1,
                "IsFrequent": "N",
                "ParentOrganizationId": $scope.ParenthospitalId || null
            };
            if (params.SearchText == '') {
                params.IsFrequent = 'Y';
            }

            return eHnoteSettingsDataService.GetOrganizationProceduresSearchEngine(params).then(function (resp) {
                if (resp.data.rows !== undefined) {
                    //return resp.data.rows.map(function (item) {
                    //    return item;
                    //});
                    return resp.data.rows
                        .filter(function (item) {
                            return item.IsActive == true;
                        })
                        .map(function (item) {
                            return item;
                        });
                }
            });
        };

        $scope.DeleteProcedure = function (index, item) {
            $scope.InsuranceReportsObj.AllProcedureList.splice(index, 1);
        }

        $scope.DeleteReferal = function (index, item) {
            $scope.InsuranceReportsObj.AllReferalList.splice(index, 1);
        }

        $scope.DeletePayor = function (index, item) {
            $scope.InsuranceReportsObj.AllPayorList.splice(index, 1);
        }
        $scope.ClearAllPayor = function () {
            $scope.InsuranceReportsObj.AllPayorList=[];
        }
        $scope.ClearAllReferal = function () {
            $scope.InsuranceReportsObj.AllReferalList=[];
        }
        $scope.ClearAllProcedure = function () {
            $scope.InsuranceReportsObj.AllProcedureList=[];
        }


        // 🔒 Global provider → base color map
        const BarGraphChartColorMap = {};
        const baseColors = [
            "#1E88E5", // Blue
            "#43A047", // Green
            "#FB8C00", // Orange
            "#8E24AA", // Purple
            "#E53935", // Red
            "#00897B", // Teal
            "#6D4C41", // Brown
            "#3949AB", // Indigo
            "#F4511E", // Deep Orange
            "#C0CA33", // Lime
            "#00ACC1", // Cyan
            "#7CB342", // Light Green
            "#D81B60", // Pink
            "#5E35B1", // Deep Purple
            "#546E7A"  // Blue Grey
        ];



        function getLightShade(hex, percent) {
            hex = hex.replace("#", "");
            let r = parseInt(hex.substr(0, 2), 16);
            let g = parseInt(hex.substr(2, 2), 16);
            let b = parseInt(hex.substr(4, 2), 16);

            r = Math.round(r + (255 - r) * percent);
            g = Math.round(g + (255 - g) * percent);
            b = Math.round(b + (255 - b) * percent);

            return `rgb(${r}, ${g}, ${b})`;
        }



        const AgCharts = agCharts.AgCharts;


        /*---------------Patient Payment Billing Provider Bar-Graph Chart---------------*/

        let billingProviderChart = null;

        $scope.renderBillingProviderChart = function () {

            // 1️⃣ Get container
            if (!chartContainer) {
                chartContainer = document.getElementById("billingProviderChart");
            }
            if (!chartContainer) return;

            // 2️⃣ Prepare data
            const chartData = angular.isArray($scope.PaymentBillingProviderGraphList)
                ? $scope.PaymentBillingProviderGraphList.map(item => ({
                    month: item.Month,
                    provider: item.BillingProviderName,
                    payment: item.TotalPaymentAmount || 0,
                    writeOff: item.TotalWriteOffAmount || 0
                }))
                : [];

            if (!chartData.length) return;

            // 3️⃣ Build series
            const providers = [...new Set(chartData.map(x => x.provider))];
            const series = [];

            providers.forEach((provider, index) => {

                if (!BarGraphChartColorMap[provider]) {
                    BarGraphChartColorMap[provider] =
                        baseColors[index % baseColors.length];
                }

                const baseColor = BarGraphChartColorMap[provider];
                const lightColor = getLightShade(baseColor, 0.55);

                series.push(
                    {
                        type: "bar",
                        xKey: "month",
                        yKey: "payment",
                        yName: provider + " - Payment",
                        stackGroup: provider,
                        fill: baseColor,
                        stroke: baseColor,
                        data: chartData.filter(x => x.provider === provider)
                    },
                    {
                        type: "bar",
                        xKey: "month",
                        yKey: "writeOff",
                        yName: provider + " - Write-Off",
                        stackGroup: provider,
                        fill: lightColor,
                        stroke: baseColor,
                        data: chartData.filter(x => x.provider === provider)
                    }
                );
            });

            // 4️⃣ Chart options (tooltip included)
            const options = {
                container: chartContainer,

                series: series,

                legend: { position: "top" },

                tooltip: {
                    enabled: true,
                    renderer: function (params) {

                        if (!params.items || !params.items.length) return null;

                        const d = params.items[0].datum;

                        const paymentItem = params.items.find(i => i.yKey === "payment");
                        const writeOffItem = params.items.find(i => i.yKey === "writeOff");

                        return {
                            title: d.month,
                            content: `
                        <div style="font-weight:600; margin-bottom:6px;">
                            ${d.provider}
                        </div>

                        <div style="margin-bottom:4px;">
                            Payment Amount – $${(paymentItem?.value || 0).toLocaleString()}
                        </div>

                        <div>
                            Write-Off Amount – $${(writeOffItem?.value || 0).toLocaleString()}
                        </div>
                    `
                        };
                    }
                },

                axes: [
                    {
                        type: "category",
                        position: "bottom",
                        title: { text: "Month" }
                    },
                    {
                        type: "number",
                        position: "left",
                        title: { text: "Amount ($)" },
                        label: {
                            formatter: p =>
                                `$ ${Number(p.value).toLocaleString("en-US", {
                                    maximumFractionDigits: 2
                                })}`
                        }
                    }
                ]

            };

            // 5️⃣ Destroy & create
            if (billingProviderChart) {
                billingProviderChart.destroy();
            }

            billingProviderChart = agCharts.AgCharts.create(options);
        };


        /*---------------Patient Payment Rendering Provider Bar-Graph Chart---------------*/

        let RenderingProviderChart = null;
        const PaymentColorMap = {};
        const WriteOffColorMap = {};

        $scope.GetRenderingProviderChart = function () {

            // 1️⃣ Get container
            if (!RenderingchartContainer) {
                RenderingchartContainer = document.getElementById("RenderingProviderBarChart");
            }
            if (!RenderingchartContainer) return;

            // 2️⃣ Prepare data
            const chartData = angular.isArray($scope.RenderingProvidersGraphList)
                ? $scope.RenderingProvidersGraphList.map(item => ({
                    month: item.Month,
                    provider: item.RenderingProviderName,
                    payment: item.TotalPaymentAmount || 0,
                    writeOff: item.TotalWriteOffAmount || 0
                }))
                : [];

            if (!chartData.length) return;

            // 3️⃣ Build series dynamically
            const providers = [...new Set(chartData.map(x => x.provider))];
            const series = [];

            providers.forEach((provider, index) => {

                if (!PaymentColorMap[provider]) {
                    PaymentColorMap[provider] = baseColors[index % baseColors.length];
                    WriteOffColorMap[provider] =
                        baseColors[(index + 4) % baseColors.length];
                }

                series.push(
                    {
                        type: "bar",
                        xKey: "month",
                        yKey: "payment",
                        yName: provider + " - Payment",
                        stackGroup: provider,
                        fill: PaymentColorMap[provider],
                        stroke: PaymentColorMap[provider],
                        data: chartData.filter(x => x.provider === provider)
                    },
                    {
                        type: "bar",
                        xKey: "month",
                        yKey: "writeOff",
                        yName: provider + " - Write-Off",
                        stackGroup: provider,
                        fill: WriteOffColorMap[provider],
                        stroke: WriteOffColorMap[provider],
                        data: chartData.filter(x => x.provider === provider)
                    }
                );
            });

            // 4️⃣ Chart options (tooltip included)
            const options = {
                container: RenderingchartContainer,

                series: series,

                legend: { position: "top" },

                tooltip: {
                    renderer: function (params) {

                        const value = Number(params.datum[params.yKey] || 0);

                        return {
                            content: `${params.yName}: $${value.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`
                        };
                    }
                },

                axes: [
                    { type: "category", position: "bottom", title: { text: "Month" } },
                    {
                        type: "number",
                        position: "left",
                        title: { text: "Amount ($)" },
                        label: {
                            formatter: p =>
                                `$ ${Number(p.value).toLocaleString("en-US", {
                                    maximumFractionDigits: 2
                                })}`
                        }
                    }
                ]
            };

            // 5️⃣ Destroy & create
            if (RenderingProviderChart) {
                RenderingProviderChart.destroy();
            }

            RenderingProviderChart = agCharts.AgCharts.create(options);
        };


        /*---------------Patient Payment User Bar-Graph Chart---------------*/

        let PaymentUsersBarChart = null;
        const UserPaymentColorMap = {};
        const UserWriteOffColorMap = {};

        $scope.PatientPaymentUsersChart = function () {

            if (!UserchartContainer) {
                UserchartContainer =
                    document.getElementById("PatPaymentUsersBarGraphChart");
            }
            if (!UserchartContainer) return;

            // ✅ IF NO DATA → CLEAR CHART
            if (!angular.isArray($scope.PatientPaymentUsersList) ||
                $scope.PatientPaymentUsersList.length === 0) {

                if (PaymentUsersBarChart) {
                    PaymentUsersBarChart.destroy();
                    PaymentUsersBarChart = null;
                }

                Object.keys(UserPaymentColorMap).forEach(k => delete UserPaymentColorMap[k]);
                Object.keys(UserWriteOffColorMap).forEach(k => delete UserWriteOffColorMap[k]);

                return;
            }

            // Prepare chart data
            const chartData = $scope.PatientPaymentUsersList.map(item => ({
                month: item.Month,
                user: item.UserName,
                payment: item.TotalPaymentAmount || 0,
                writeOff: item.TotalWriteOffAmount || 0
            }));

            const users = [...new Set(chartData.map(x => x.user))];
            const series = [];

            users.forEach((user, index) => {

                if (!UserPaymentColorMap[user]) {
                    UserPaymentColorMap[user] = baseColors[index % baseColors.length];
                    UserWriteOffColorMap[user] =
                        baseColors[(index + 4) % baseColors.length];
                }

                series.push(
                    {
                        type: "bar",
                        xKey: "month",
                        yKey: "payment",
                        yName: user + " - Payment",
                        stackGroup: user,
                        fill: UserPaymentColorMap[user],
                        data: chartData.filter(x => x.user === user)
                    },
                    {
                        type: "bar",
                        xKey: "month",
                        yKey: "writeOff",
                        yName: user + " - Write-Off",
                        stackGroup: user,
                        fill: UserWriteOffColorMap[user],
                        data: chartData.filter(x => x.user === user)
                    }
                );
            });

            const options = {
                container: UserchartContainer,
                series,
                legend: { position: "top" },
                tooltip: {
                    renderer: function (params) {

                        if (!params.items || !params.items.length) return null;

                        const d = params.items[0].datum;

                        const paymentItem = params.items.find(i => i.yKey === "payment");
                        const writeOffItem = params.items.find(i => i.yKey === "writeOff");

                        const formatAmount = v =>
                            `$ ${Number(v || 0).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`;

                        return {
                            title: d.month,
                            content: `
                        <div style="font-weight:600">${d.user}</div>
                        <div>Payment – ${formatAmount(paymentItem?.value)}</div>
                        <div>Write-Off – ${formatAmount(writeOffItem?.value)}</div>
                    `
                        };
                    }
                },
                axes: [
                    { type: "category", position: "bottom" },
                    {
                        type: "number",
                        position: "left",
                        label: {
                            formatter: p =>
                                `$ ${Number(p.value).toLocaleString("en-US", {
                                    maximumFractionDigits: 2
                                })}`
                        }
                    }
                ]
            };

            if (PaymentUsersBarChart) {
                PaymentUsersBarChart.destroy();
            }

            PaymentUsersBarChart = agCharts.AgCharts.create(options);
        };




        /*---------------Patient Payment Type Bar-Graph Chart---------------*/

        let PaymentTypeBarChart = null;
        const PaymentTypeColorMap = {};
        const PaymentTypeWriteOffColorMap = {};

        $scope.PatientPaymentTypeChart = function () {

            // 1️⃣ Get container
            if (!PaymentchartContainer) {
                PaymentchartContainer = document.getElementById("PaymentTypeBarGraphChart");
            }
            if (!PaymentchartContainer) return;

            // 2️⃣ Prepare data
            const chartData = angular.isArray($scope.PaymentTypesCharList)
                ? $scope.PaymentTypesCharList.map(item => ({
                    month: item.Month,
                    paymentType: item.PaymentMethodName,
                    payment: item.TotalPaymentAmount || 0,
                    writeOff: item.TotalWriteOffAmount || 0
                }))
                : [];

            if (!chartData.length) return;

            // 3️⃣ Build series
            const paymentTypes = [...new Set(chartData.map(x => x.paymentType))];
            const series = [];

            paymentTypes.forEach((paymentType, index) => {

                if (!PaymentTypeColorMap[paymentType]) {
                    PaymentTypeColorMap[paymentType] =
                        baseColors[index % baseColors.length];
                    PaymentTypeWriteOffColorMap[paymentType] =
                        baseColors[(index + 4) % baseColors.length];
                }

                series.push(
                    {
                        type: "bar",
                        xKey: "month",
                        yKey: "payment",
                        yName: paymentType + " - Payment",
                        stackGroup: paymentType,
                        fill: PaymentTypeColorMap[paymentType],
                        stroke: PaymentTypeColorMap[paymentType],
                        data: chartData.filter(x => x.paymentType === paymentType)
                    },
                    {
                        type: "bar",
                        xKey: "month",
                        yKey: "writeOff",
                        yName: paymentType + " - Write-Off",
                        stackGroup: paymentType,
                        fill: PaymentTypeWriteOffColorMap[paymentType],
                        stroke: PaymentTypeWriteOffColorMap[paymentType],
                        data: chartData.filter(x => x.paymentType === paymentType)
                    }
                );
            });

            // 4️⃣ Chart options (tooltip included)
            const options = {
                container: PaymentchartContainer,

                series: series,

                legend: { position: "top" },

                tooltip: {
                    renderer: function (params) {

                        if (!params.items || !params.items.length) return null;

                        const d = params.items[0].datum;

                        const paymentItem = params.items.find(i => i.yKey === "payment");
                        const writeOffItem = params.items.find(i => i.yKey === "writeOff");

                        const formatAmount = val =>
                            `$ ${Number(val || 0).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`;

                        return {
                            title: d.month,
                            content: `
                        <div style="font-weight:600; margin-bottom:6px;">
                            ${d.paymentType}
                        </div>
                        <div>Payment – <b>${formatAmount(paymentItem?.value)}</b></div>
                        <div>Write-Off – <b>${formatAmount(writeOffItem?.value)}</b></div>
                    `
                        };
                    }
                },

                axes: [
                    { type: "category", position: "bottom" },
                    {
                        type: "number",
                        position: "left",
                        label: {
                            formatter: p =>
                                `$ ${Number(p.value).toLocaleString("en-US", {
                                    maximumFractionDigits: 2   // 👈 no forced .00
                                })}`
                        }
                    }
                ]
            };

            // 5️⃣ Destroy & create
            if (PaymentTypeBarChart) {
                PaymentTypeBarChart.destroy();
            }

            PaymentTypeBarChart = agCharts.AgCharts.create(options);
        };

        /*---------------Insurance Payment Billing Provider With Adjustment Amount Bar-Graph Chart---------------*/

        //let InsbillingProviderChart = null;

        //$scope.GetInsBillingProviderChart = function () {

        //    // 1️⃣ Get container
        //    if (!InsBillingProviderchartContainer) {
        //        InsBillingProviderchartContainer = document.getElementById("InsBillingProviderBarChart");
        //    }
        //    if (!InsBillingProviderchartContainer) return;

        //    // 2️⃣ Prepare data
        //    const chartData = angular.isArray($scope.InsBillingProviderCharList)
        //        ? $scope.InsBillingProviderCharList.map(item => ({
        //            month: item.Month,
        //            provider: item.BillingProviderName,
        //            Inspayment: item.TotalPaymentAmount || 0,
        //            Adjustment: item.TotalAdjustmentAmount || 0
        //        }))
        //        : [];

        //    if (!chartData.length) return;

        //    // 3️⃣ Build series
        //    const providers = [...new Set(chartData.map(x => x.provider))];
        //    const series = [];

        //    providers.forEach((provider, index) => {

        //        if (!BarGraphChartColorMap[provider]) {
        //            BarGraphChartColorMap[provider] =
        //                baseColors[index % baseColors.length];
        //        }

        //        const baseColor = BarGraphChartColorMap[provider];
        //        const lightColor = getLightShade(baseColor, 0.55);

        //        series.push(
        //            {
        //                type: "bar",
        //                xKey: "month",
        //                yKey: "Inspayment",
        //                yName: provider + " - Inspayment",
        //                stackGroup: provider,
        //                fill: baseColor,
        //                stroke: baseColor,
        //                data: chartData.filter(x => x.provider === provider)
        //            },
        //            {
        //                type: "bar",
        //                xKey: "month",
        //                yKey: "Adjustment",
        //                yName: provider + " - Adjustment",
        //                stackGroup: provider,
        //                fill: lightColor,
        //                stroke: baseColor,
        //                data: chartData.filter(x => x.provider === provider)
        //            }
        //        );
        //    });

        //    // 4️⃣ Chart options (tooltip included)
        //    const options = {
        //        container: InsBillingProviderchartContainer,

        //        series: series,

        //        legend: { position: "top" },

        //        tooltip: {
        //            enabled: true,
        //            renderer: function (params) {

        //                if (!params.items || !params.items.length) return null;

        //                const d = params.items[0].datum;

        //                const InspaymentItem = params.items.find(i => i.yKey === "Inspayment");
        //                const InsAdjustmentItem = params.items.find(i => i.yKey === "Adjustment");

        //                return {
        //                    title: d.month,
        //                    content: `
        //                <div style="font-weight:600; margin-bottom:6px;">
        //                    ${d.provider}
        //                </div>

        //                <div style="margin-bottom:4px;">
        //                    Ins Payment Amount – $${(InspaymentItem?.value || 0).toLocaleString()}
        //                </div>

        //                <div>
        //                    Adjustment Amount – $${(InsAdjustmentItem?.value || 0).toLocaleString()}
        //                </div>
        //            `
        //                };
        //            }
        //        },

        //        axes: [
        //            {
        //                type: "category",
        //                position: "bottom",
        //                title: { text: "Month" }
        //            },
        //            {
        //                type: "number",
        //                position: "left",
        //                title: { text: "Amount ($)" },
        //                label: {
        //                    formatter: p =>
        //                        `$ ${Number(p.value).toLocaleString("en-US", {
        //                            maximumFractionDigits: 2
        //                        })}`
        //                }
        //            }
        //        ]

        //    };

        //    // 5️⃣ Destroy & create
        //    if (InsbillingProviderChart) {
        //        InsbillingProviderChart.destroy();
        //    }

        //    InsbillingProviderChart = agCharts.AgCharts.create(options);
        //};

        /*---------------Insurance Payment Billing Provider With OUT Adjustment Amount Bar-Graph Chart---------------*/
        let InsbillingProviderChart = null;

        $scope.GetInsBillingProviderChart = function () {

            // 1️⃣ Get container
            if (!InsBillingProviderchartContainer) {
                InsBillingProviderchartContainer =
                    document.getElementById("InsBillingProviderBarChart");
            }
            if (!InsBillingProviderchartContainer) return;

            // 2️⃣ Prepare data (ONLY PAYMENT)
            const chartData = angular.isArray($scope.InsBillingProviderCharList)
                ? $scope.InsBillingProviderCharList.map(item => ({
                    month: item.Month,
                    provider: item.BillingProviderName,
                    payment: Number(item.TotalPaymentAmount) || 0
                }))
                : [];

            // ✅ If no data → clear chart
            if (!chartData.length) {
                if (InsbillingProviderChart) {
                    InsbillingProviderChart.destroy();
                    InsbillingProviderChart = null;
                }
                return;
            }

            // 3️⃣ Build series (NO custom colors)
            const providers = [...new Set(chartData.map(x => x.provider))];
            const series = [];

            providers.forEach(provider => {
                series.push({
                    type: "bar",
                    xKey: "month",
                    yKey: "payment",
                    yName: provider + " - Ins Payment",
                    data: chartData.filter(x => x.provider === provider)
                });
            });

            // 4️⃣ Chart options
            const options = {
                container: InsBillingProviderchartContainer,

                series: series,

                legend: { position: "top" },

                tooltip: {
                    renderer: function (params) {
                        const value = Number(params.datum[params.yKey] || 0);
                        return {
                            content: `${params.yName}: $${value.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`
                        };
                    }
                },

                axes: [
                    {
                        type: "category",
                        position: "bottom",
                        title: { text: "Month" }
                    },
                    {
                        type: "number",
                        position: "left",
                        title: { text: "Amount ($)" },
                        label: {
                            formatter: p =>
                                `$ ${Number(p.value).toLocaleString("en-US", {
                                    maximumFractionDigits: 2
                                })}`
                        }
                    }
                ]
            };

            // 5️⃣ Destroy & create
            if (InsbillingProviderChart) {
                InsbillingProviderChart.destroy();
            }

            InsbillingProviderChart = agCharts.AgCharts.create(options);
        };



        $scope.GetExcelDetailsObj = function () {
            let obj = {
                
                "UserId": $scope.UserId,
                "RequestedByUserId": null,               
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PageSize": 100,
                "PageNumber": 1,
                "StatusId": null,
                "ReportId": null,
                "SelectUserStatusString": "All",
                "AllUserStatusCheck": true,
                "UserFullName": "",
                "AllUsersList": angular.copy($scope.mainBillerDataObj.AllUsersList) || [],
            };

            return obj;

          
        }

        $scope.ExcelDetailsObj = $scope.GetExcelDetailsObj();

        $scope.SearchExcelDetails = function () {
            $scope.ExportSummarylist = [];
            if ($scope.ExcelDetailsObj.AllUsersList.length > 0) {               
                angular.forEach($scope.ExcelDetailsObj.AllUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.ExcelDetailsObj.SelectUserStatusString = "All";
                $scope.ExcelDetailsObj.AllUserStatusCheck = true;
            }
            $q.all([
                eHnoteAccountUserServices.GetMasterAndStatusList(),
            ]).then(function (resp) {

                if (resp[0].data.DashBoardReports.length > 0) {
                    $scope.MasterReportList = resp[0].data.DashBoardReports || [];
                }

                if (resp[0].data.ExportDataStatus.length > 0) {
                    $scope.ExportDataStatus = resp[0].data.ExportDataStatus || [];
                }
            });



            $scope.GetExportStatusList();
        }


        $scope.ClearExcelFilters = function () {
            $scope.ExcelDetailsObj = $scope.GetExcelDetailsObj();
            if ($scope.ExcelDetailsObj.AllUsersList.length > 0) {
                angular.forEach($scope.ExcelDetailsObj.AllUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.ExcelDetailsObj.SelectUserStatusString = "All";
                $scope.ExcelDetailsObj.AllUserStatusCheck = true;
            }
        }

        $scope.ClickForFilterExcelData = function () {
            $scope.GetExportStatusList();
        }

        $scope.GetExportStatusList = function () {

            let obj = {
                "OrganizationId": $scope.ExcelDetailsObj.OrganizationId,
                "RequestedByUserId": $scope.ExcelDetailsObj.RequestedByUserId,
                "FromDate": $scope.ExcelDetailsObj.FromDate,
                "ToDate": $scope.ExcelDetailsObj.ToDate,
                "PageSize": $scope.ExcelDetailsObj.PageSize,
                "PageNumber": $scope.ExcelDetailsObj.PageNumber,
                "StatusId": $scope.ExcelDetailsObj.StatusId,
                "ReportId": $scope.ExcelDetailsObj.ReportId,
            };

            eHnoteInsuranceService.GetReportExportJobsStatusList(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.ExportSummarylist = resp.data.rows || [];

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }


        $scope.ChangeReportsUser = function (item) {

            var checkedArray = _.where($scope.ExcelDetailsObj.AllUsersList, { IsChecked: true });
            $scope.ExcelDetailsObj.AllUserStatusCheck = checkedArray.length > 0 && $scope.ExcelDetailsObj.AllUsersList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.ExcelDetailsObj.SelectUserStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.ExcelDetailsObj.SelectUserStatusString = checkedArray[0].SecondUserFullName;
                } else if (checkedArray.length == $scope.ExcelDetailsObj.AllUsersList.length) {
                    $scope.ExcelDetailsObj.SelectUserStatusString = "All";
                } else {
                    $scope.ExcelDetailsObj.SelectUserStatusString = "Selected";
                }
            }
        };


        /*---------------Insurance Payment Rendering Provider Bar-Graph Chart---------------*/

        let InsRenderingProviderChart = null;

        $scope.GetInsRenderingProviderChart = function () {

            // 1️⃣ Get container
            if (!InsRenderingchartContainer) {
                InsRenderingchartContainer =
                    document.getElementById("InsRenderingProviderBarChart");
            }
            if (!InsRenderingchartContainer) return;

            // 2️⃣ Prepare data
            const chartData = angular.isArray($scope.InsRenderingProviderCharList)
                ? $scope.InsRenderingProviderCharList.map(item => ({
                    month: item.Month,
                    Renderingprovider: item.RenderingProviderName,
                    Inspayment: Number(item.TotalPaymentAmount) || 0,
                    Adjustment: Number(item.TotalAdjustment) || 0
                }))
                : [];

            if (!chartData.length) return;

            // 3️⃣ Build series
            const InsRenderingproviders = [
                ...new Set(chartData.map(x => x.Renderingprovider))
            ];

            const series = [];

            InsRenderingproviders.forEach((Renderingprovider, index) => {

                if (!BarGraphChartColorMap[Renderingprovider]) {
                    BarGraphChartColorMap[Renderingprovider] =
                        baseColors[index % baseColors.length];
                }

                const baseColor = BarGraphChartColorMap[Renderingprovider];
                const lightColor = getLightShade(baseColor, 0.55);

                const providerData =
                    chartData.filter(x => x.Renderingprovider === Renderingprovider);

                // Ins Payment
                series.push({
                    type: "bar",
                    xKey: "month",
                    yKey: "Inspayment",
                    yName: `${Renderingprovider} - Ins Payment`,
                    stackGroup: Renderingprovider,
                    fill: baseColor,
                    stroke: baseColor,
                    data: providerData
                });

                // Adjustment
                series.push({
                    type: "bar",
                    xKey: "month",
                    yKey: "Adjustment",
                    yName: `${Renderingprovider} - Adjustment`,
                    stackGroup: Renderingprovider,
                    fill: lightColor,
                    stroke: baseColor,
                    data: providerData
                });
            });

            // 4️⃣ Chart options
            const options = {
                container: InsRenderingchartContainer,

                legend: {
                    position: "top"
                },

                series: series,

                tooltip: {
                    enabled: true,
                    renderer: function (params) {

                        if (!params.items?.length) return null;

                        const month = params.items[0].datum.month;

                        const providerName =
                            params.items[0].yName.split(" - ")[0];

                        const InspaymentItem =
                            params.items.find(i => i.yKey === "Inspayment");

                        const AdjustmentItem =
                            params.items.find(i => i.yKey === "Adjustment");

                        return {
                            title: month,
                            content: `
                        <div style="font-weight:600; margin-bottom:6px;">
                            ${providerName}
                        </div>

                        <div style="margin-bottom:4px;">
                            Ins Payment Amount – $${(InspaymentItem?.value || 0).toLocaleString()}
                        </div>

                        <div>
                            Adjustment Amount – $${(AdjustmentItem?.value || 0).toLocaleString()}
                        </div>
                    `
                        };
                    }
                },

                axes: [
                    {
                        type: "category",
                        position: "bottom",
                        title: { text: "Month" }
                    },
                    {
                        type: "number",
                        position: "left",
                        title: { text: "Amount ($)" },
                        label: {
                            formatter: p =>
                                `$${Number(p.value).toLocaleString("en-US", {
                                    maximumFractionDigits: 2
                                })}`
                        }
                    }
                ]
            };

            // 5️⃣ Destroy & create
            if (InsRenderingProviderChart) {
                InsRenderingProviderChart.destroy();
            }

            InsRenderingProviderChart =
                agCharts.AgCharts.create(options);
        };



        /*---------------Insurance Payment Rendering Provider Without Adjustment Bar-Graph Chart---------------*/

        let InsRenderingProviderPaymentChart = null;

        $scope.GetInsRenderingProviderInsPaymentChart = function () {

            // 1️⃣ Get container
            if (!InsRenderingPaymentchartContainer) {
                InsRenderingPaymentchartContainer =
                    document.getElementById("InsRenderingProviderPaymentBarChart");
            }
            if (!InsRenderingPaymentchartContainer) return;

            // 2️⃣ Prepare data (ONLY PAYMENT)
            const chartData = angular.isArray($scope.InsRenderingProviderCharList)
                ? $scope.InsRenderingProviderCharList.map(item => ({
                    month: item.Month,
                    provider: item.RenderingProviderName,
                    payment: Number(item.TotalPaymentAmount) || 0
                }))
                : [];

            // ✅ If no data → clear chart
            if (!chartData.length) {
                if (InsRenderingProviderPaymentChart) {
                    InsRenderingProviderPaymentChart.destroy();
                    InsRenderingProviderPaymentChart = null;
                }
                return;
            }

            // 3️⃣ Build series (ONLY PAYMENT)
            const providers = [...new Set(chartData.map(x => x.provider))];
            const series = [];

            providers.forEach((provider, index) => {

                if (!BarGraphChartColorMap[provider]) {
                    BarGraphChartColorMap[provider] =
                        baseColors[index % baseColors.length];
                }

                const baseColor = BarGraphChartColorMap[provider];

                series.push({
                    type: "bar",
                    xKey: "month",
                    yKey: "payment",
                    yName: `${provider} - Ins Payment`,
                    fill: baseColor,
                    stroke: baseColor,
                    data: chartData.filter(x => x.provider === provider)
                });
            });

            // 4️⃣ Chart options
            const options = {
                container: InsRenderingPaymentchartContainer,

                legend: { position: "top" },

                series: series,

                tooltip: {
                    renderer: function (params) {

                        const value = Number(params.datum[params.yKey] || 0);

                        return {
                            content: `${params.yName}: $${value.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`
                        };
                    }
                },

                axes: [
                    {
                        type: "category",
                        position: "bottom",
                        title: { text: "Month" }
                    },
                    {
                        type: "number",
                        position: "left",
                        title: { text: "Amount ($)" },
                        label: {
                            formatter: p =>
                                `$${Number(p.value).toLocaleString("en-US", {
                                    maximumFractionDigits: 2
                                })}`
                        }
                    }
                ]
            };

            // 5️⃣ Destroy & create
            if (InsRenderingProviderPaymentChart) {
                InsRenderingProviderPaymentChart.destroy();
            }

            InsRenderingProviderPaymentChart = agCharts.AgCharts.create(options);
        };




        function normalizeMonth(monthStr) {
            // Converts "November-2025" → "Nov-2025"
            return moment(monthStr, "MMMM-YYYY").format("MMM-YYYY");
        }

        function buildMonthWisePaymentMapTable(data, monthsArray, type) {
            type = type || '';
            const providerMap = {};

            if (type == 'InsBillingProvider') {
                data.forEach(item => {

                    const monthKey = normalizeMonth(item.Month);

                    if (!providerMap[item.BillingProviderId]) {
                        providerMap[item.BillingProviderId] = {
                            BillingProviderId: item.BillingProviderId,
                            BillingProviderName: item.BillingProviderName,
                            BillingProviderNPI: item.BillingProviderNPI || '',
                            MonthPayments: {}
                        };
                    }

                    providerMap[item.BillingProviderId].MonthPayments[monthKey] =
                        item.TotalPaymentAmount || 0;
                });
            } else if (type == 'InsRenderingProvider') {
                data.forEach(item => {

                    const monthKey = normalizeMonth(item.Month);

                    if (!providerMap[item.RenderingProviderId]) {
                        providerMap[item.RenderingProviderId] = {
                            RenderingProviderId: item.RenderingProviderId,
                            RenderingProviderName: item.RenderingProviderName,
                            RenderingProviderNPI: item.RenderingProviderNPI || '',
                            MonthPayments: {}
                        };
                    }

                    providerMap[item.RenderingProviderId].MonthPayments[monthKey] =
                        item.TotalPaymentAmount || 0;
                });
            } else {
                data.forEach(item => {

                    const monthKey = normalizeMonth(item.Month);

                    if (!providerMap[item.OrganizationPayorId]) {
                        providerMap[item.OrganizationPayorId] = {
                            OrganizationPayorId: item.OrganizationPayorId,
                            OrganizationPayorName: item.OrganizationPayorName,
                            MonthPayments: {}
                        };
                    }

                    providerMap[item.OrganizationPayorId].MonthPayments[monthKey] =
                        item.TotalPaymentAmount || 0;
                });
            }

            // Ensure all months exist
            Object.values(providerMap).forEach(p => {
                monthsArray.forEach(m => {
                    if (p.MonthPayments[m] == null) {
                        p.MonthPayments[m] = 0;
                    }
                });
            });

            return Object.values(providerMap);
        }


        /*---------------Insurance Payment Payor Without Adjustment Bar-Graph Chart---------------*/

        let InsPayorPaymentChart = null;

        $scope.GetPayorInsPaymentChart = function () {

            // 1️⃣ Get container
            if (!InsPayorPaymentchartContainer) {
                InsPayorPaymentchartContainer =
                    document.getElementById("PayorPaymentBarChart");
            }
            if (!InsPayorPaymentchartContainer) return;

            // 2️⃣ Prepare data (ONLY PAYMENT)
            const chartData = angular.isArray($scope.PayorsChartListData)
                ? $scope.PayorsChartListData.map(item => ({
                    month: item.Month,
                    payorName: item.OrganizationPayorName,
                    payment: Number(item.TotalPaymentAmount) || 0
                }))
                : [];

            // ✅ If no data → clear chart
            if (!chartData.length) {
                if (InsPayorPaymentChart) {
                    InsPayorPaymentChart.destroy();
                    InsPayorPaymentChart = null;
                }
                return;
            }

            // 3️⃣ Build series (ONLY PAYMENT)
            const payors = [...new Set(chartData.map(x => x.payorName))];
            const series = [];

            payors.forEach((payorName, index) => {

                if (!BarGraphChartColorMap[payorName]) {
                    BarGraphChartColorMap[payorName] =
                        baseColors[index % baseColors.length];
                }

                const baseColor = BarGraphChartColorMap[payorName];

                series.push({
                    type: "bar",
                    xKey: "month",
                    yKey: "payment",
                    yName: `${payorName} - Ins Payment`,
                    fill: baseColor,
                    stroke: baseColor,
                    data: chartData.filter(x => x.payorName === payorName)
                });
            });

            // 4️⃣ Chart options
            const options = {
                container: InsPayorPaymentchartContainer,

                legend: { position: "top" },

                series: series,

                tooltip: {
                    renderer: function (params) {

                        const value = Number(params.datum[params.yKey] || 0);

                        return {
                            content: `${params.yName}: $${value.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`
                        };
                    }
                },

                axes: [
                    {
                        type: "category",
                        position: "bottom",
                        title: { text: "Month" }
                    },
                    {
                        type: "number",
                        position: "left",
                        title: { text: "Amount ($)" },
                        label: {
                            formatter: p =>
                                `$${Number(p.value).toLocaleString("en-US", {
                                    maximumFractionDigits: 2
                                })}`
                        }
                    }
                ]
            };

            // 5️⃣ Destroy & create
            if (InsPayorPaymentChart) {
                InsPayorPaymentChart.destroy();
            }

            InsPayorPaymentChart = agCharts.AgCharts.create(options);
        };





        $scope.GetPatientPaymentPrintGroupbyUser = function () {
            $scope.PatientPaymentUsersList = [];
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

            var BillingProviderids = $scope.PatientPaymentsReportsObj.BillingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            var RenderingProviderIds = $scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");



            let obj = {
                "ParentOrganization": $scope.ParentHospitalId,
                "PaymentFromDate": $scope.PatientPaymentsReportsObj.PatientPayFromDate || "",
                "PaymentToDate": $scope.PatientPaymentsReportsObj.PatientPayToDate || "",
                "ServiceStartDate": $scope.PatientPaymentsReportsObj.ServiceFromDate || "",
                "ServiceEndDate": $scope.PatientPaymentsReportsObj.ServiceToDate || "",
                "UserIdsList": UserIds || "",
                "LocationIdsList": Locationids || "",
                "PaymentMethodsList": PaymentModeids || "",
            };

            eHnoteInsuranceService.GetPatientPaymentUser_Print(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.UserPatientPaymentsObj.PaymentFromDate = resp.data.PaymentFromDate || "";
                    $scope.UserPatientPaymentsObj.PaymentFromDate = $filter('date')($scope.UserPatientPaymentsObj.PaymentFromDate, 'MM/dd/yyyy');
                    $scope.UserPatientPaymentsObj.PaymentToDate = resp.data.PaymentToDate || "";
                    $scope.UserPatientPaymentsObj.PaymentToDate = $filter('date')($scope.UserPatientPaymentsObj.PaymentToDate, 'MM/dd/yyyy');

                    $scope.TotalUsersCount = 0;
                    $scope.TotalPaymentAmountbyUser = 0;

                    var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
                    var printTime = moment(new Date()).format("HH:mm A");
                    var printDatemTime = printDate + '  ' + printTime;
                    $scope.UserPatientPaymentsObj.UserPrintedDatenTime = printDatemTime;

                    if ($scope.PatientPaymentsReportsObj.ReportUsersList.length > 0) {
                        let TempUserArray = $filter("filter")($scope.PatientPaymentsReportsObj.ReportUsersList, function (kitem) { return kitem.DoctorID == $scope.UserId }, true);
                        if (TempUserArray.length > 0) {
                            $scope.UserPatientPaymentsObj.PrintingUserName = TempUserArray[0].FullName || '';
                        }
                    }

                    $scope.UserPatientPaymentsObj.OrganizationName = $scope.HospitalAddressArray.ClinicName || '';

                    if (resp.data.rows.length > 0) {
                        $scope.UserPatientPaymentsObj.UserPatientPaymentList = angular.copy(resp.data.rows) || [];

                        angular.forEach($scope.UserPatientPaymentsObj.UserPatientPaymentList, function (item) {
                            $scope.TotalUsersCount += item.UserCount;
                            $scope.TotalPaymentAmountbyUser += item.TotalPaymentAmount;
                        })


                    } else {
                        $scope.UserPatientPaymentsObj.UserPatientPaymentList = [];
                    }

                    $timeout(function () {
                        var innerContents = document.getElementById('UserPatientPayment_Print').innerHTML;
                        var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                        popupWinindow.document.open();
                        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                        popupWinindow.document.close();
                    }, 1000);

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };

        $scope.switchMainBillerReportTabnew = function (tabno) {

            $scope.BillerReportMainTab = tabno;

            if ([1, 2, 3, 4, 5, 6, 7,8].includes($scope.BillerReportMainTab)) {
                $scope.refreshARDetails();
            }
        };

        $scope.$on('navtoARReportListNew', function (event, data) {
            data = data || {};
            $scope.ArReporttab = data.tab || null;
            $scope.ArReportId = data.Id || null;
            $scope.switchMainBillerReportTabnew($scope.ArReporttab);
        });

        $scope.switchtoArReport = function (tab, Id) {
            $scope.ArReporttab = tab;
            $scope.ArReportId = Id;
            $scope.GetAllARReport();
        }



           
       



        // ─── 2. Audit filter object  (add alongside GetInsuranceReportsObj) ─
        $scope.GetAuditReportsObj = function () {
            return {
                "BillingProviderList": angular.copy($scope.mainBillerDataObj.BillingProviderList || []),
                "SelectBillingProviderString": "All",
                "AllBillingProviderStatusCheck": true,
                "RenderingProviderList": angular.copy($scope.mainBillerDataObj.AllDoctorsList || []),
                "SelectRenderingStatusString": "All Doctors",
                "AllRenderingStatusCheck": true,
                "AllUsersList": angular.copy($scope.mainBillerDataObj.AllUsersList || []),
                "SelectUserStatusString": "All",
                "AllUserStatusCheck": true,
                "AllBranchesList": angular.copy($scope.mainBillerDataObj.AllBranchesList || []),
                "SelectLocationString": "All",
                "AllLocationStatusCheck": true,
                "AllPayorList": [],
                "AllProcedureList": [],
                "AllReferalList": [],
                "PayorObj": "",
                "ServiceObj": "",
                "ReferringObj": "",
                "AllMasterPayorsInd": 1,
                "AllProcedureInd": 1,
                "AllReferralProviderInd": 1,
                "AllLocationInd": 1,
                "AllBillingProviderInd": 1,
                "AllRenderingProviderInd": 1,
                "AllPostingUsersInd": 1,
                "UserFullName": "",
                "CheckDate": "",
                "CheckStartDate": "",
                "CheckEndDate": "",
                "ChkDateRangeId": null,
                "ChkPostedDateRangeId": null,
                "ChkPostedFromDate": "",
                "ChkPostedToDate": "",
                "ClaimStartDate": "",
                "ClaimEndDate": "",
                "ClaimCreateDateRangeId": null,
                "ServiceDateRangeId": 4,
                "DOSFromDate": "",
                "DOSToDate": "",
                "PageSize": 100,
                "PageNumber": 1
            };
        };
     
        var auditPayorChart = null;
        var auditPayorChartContainer = null;

        var auditBillingChart = null;
        var auditRenderingChart = null;
        var auditBillingChartContainer = null;
        var auditRenderingChartContainer = null;
        var auditBaseColors = [
            "#1F4E79", "#F4A623", "#2E7D32", "#00BCD4",
            "#9C27B0", "#8BC34A", "#E53935", "#3949AB", "#F4511E", "#00897B"
        ];

        $scope.ClaimCreateDateRangeArray = [
            { Id: 1, Name: 'Today' },
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 3 months' },
            { Id: 9, Name: 'This year' },
            { Id: 10, Name: 'Last year' },
            { Id: 11, Name: 'Custom Date' }
        ];

        $scope.SearchAuditDetails = function () {


            $scope.AuditReportObj = angular.copy($scope.GetAuditReportsObj());

            angular.forEach($scope.AuditReportObj.BillingProviderList, function (i) { i.IsChecked = true; });
            angular.forEach($scope.AuditReportObj.RenderingProviderList, function (i) { i.IsChecked = true; });
            angular.forEach($scope.AuditReportObj.AllUsersList, function (i) { i.IsChecked = true; });
            angular.forEach($scope.AuditReportObj.AllBranchesList, function (i) { i.IsChecked = true; });


            $scope.AuditBillingProviderList = [];
            $scope.AuditBillingProviderTotals = {};
            $scope.AuditBillingProviderChartList = [];

            $scope.AuditRenderingProviderList = [];
            $scope.AuditRenderingProviderTotals = {};
            $scope.AuditRenderingProviderChartList = [];

            $scope.AuditPayorList = [];
            $scope.AuditPayorTotals = {};
            $scope.AuditPayorChartList = [];

      

         

            $scope.setAuditDOSDateRange(4);   // default This Month

            if ($scope.ArReporttab == 8 && $scope.ArReportId == 1) {
                $scope.navtoOpenAuditGridReport('BillingProvider');
            } else if ($scope.ArReporttab == 8 && $scope.ArReportId == 2) {
                $scope.navtoOpenAuditGridReport('RenderingProvider');
            } else if ($scope.ArReporttab == 8 && $scope.ArReportId == 3) {
                $scope.navtoOpenAuditGridReport('Payor');
            }
        };


        // ─── 4. navtoOpenAuditGridReport  (called from dropdown menu clicks) 
        $scope.navtoOpenAuditGridReport = function (tabno) {
            $scope.AuditInsSubTab = tabno || '';

            if (tabno === 'BillingProvider') {
                $timeout(function () {
                    $scope.AuditBillingProviderList = [];
                    $scope.loadAuditBillingProvider();
                }, 500);
            } else if (tabno === 'RenderingProvider') {
                $timeout(function () {
                    $scope.AuditRenderingProviderList = [];
                    $scope.loadAuditRenderingProvider();
                }, 500);
            }
            else if (tabno === 'Payor') {                  // ← NEW
                $timeout(function () {
                    $scope.AuditPayorList = [];
                    $scope.loadAuditPayor();
                }, 500);
            }
        };


        // ─── 5. Apply / Clear for Audit filters ───────────────────────────
        $scope.ClickForAuditFilteredData = function () {
            angular.element(document.querySelector('.popover')).remove();
            if ($scope.AuditInsSubTab === 'BillingProvider') {
                $scope.loadAuditBillingProvider();
            } else if ($scope.AuditInsSubTab === 'RenderingProvider') {
                $scope.loadAuditRenderingProvider();
            }
            else if ($scope.AuditInsSubTab === 'Payor') {   // ← NEW
                $scope.loadAuditPayor();
            }            else {
                alertify.error("Please select a sub tab to continue.");
            }
        };

        $scope.ClearAuditFilters = function () {
            angular.element(document.querySelector('.popover')).remove();
            $scope.AuditReportObj = angular.copy($scope.GetAuditReportsObj());

            angular.forEach($scope.AuditReportObj.BillingProviderList, function (i) { i.IsChecked = true; });
            angular.forEach($scope.AuditReportObj.RenderingProviderList, function (i) { i.IsChecked = true; });
            angular.forEach($scope.AuditReportObj.AllUsersList, function (i) { i.IsChecked = true; });
            angular.forEach($scope.AuditReportObj.AllBranchesList, function (i) { i.IsChecked = true; });

            $scope.setAuditDOSDateRange(4);

            $scope.navtoOpenAuditGridReport($scope.AuditInsSubTab);


        };


        // ─── 6. Date range helpers ─────────────────────────────────────────
        function auditFormatDate(d) {
            return d ? $filter('date')(d, 'MM-dd-yyyy') : '';
        }

        $scope.setAuditDOSDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 3: from = new Date(d.setDate(d.getDate() - 7)); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.AuditReportObj.DOSFromDate = auditFormatDate(from);
            $scope.AuditReportObj.DOSToDate = auditFormatDate(to);
        };

        $scope.setAuditCreateDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.AuditReportObj.ClaimStartDate = auditFormatDate(from);
            $scope.AuditReportObj.ClaimEndDate = auditFormatDate(to);
        };

        $scope.setAuditChkPostedDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.AuditReportObj.ChkPostedFromDate = auditFormatDate(from);
            $scope.AuditReportObj.ChkPostedToDate = auditFormatDate(to);
        };
        $scope.setInsChkPostedDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.InsuranceReportsObj.ChkPostedFromDate = auditFormatDate(from);
            $scope.InsuranceReportsObj.ChkPostedToDate = auditFormatDate(to);
        };

        $scope.setAuditChkDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.AuditReportObj.CheckStartDate = auditFormatDate(from);
            $scope.AuditReportObj.CheckEndDate = auditFormatDate(to);
        };


        // ─── 7. Payload builder ────────────────────────────────────────────
        function buildAuditPayload() {
            var obj = $scope.AuditReportObj;

            var LocationIds = (obj.AllBranchesList || [])
                .filter(function (x) { return x.IsChecked && x.ClinicId !== 0; })
                .map(function (x) { return x.ClinicId; }).join(',');

            var BillingProviderIds = (obj.BillingProviderList || [])
                .filter(function (x) { return x.IsChecked; })
                .map(function (x) { return x.OrganizationBillingProviderId; }).join(',');

            var RenderingProviderIds = (obj.RenderingProviderList || [])
                .filter(function (x) { return x.IsChecked; })
                .map(function (x) { return x.DoctorID; }).join(',');

            var MasterPayorIds = null;
            obj.AllMasterPayorsInd = 1;
            if (obj.AllPayorList.length > 0) {
                MasterPayorIds = obj.AllPayorList.map(function (p) { return p.PayorId; }).join(',');
                obj.AllMasterPayorsInd = 0;
            }

            var ProcedureIds = null;
            obj.AllProcedureInd = 1;
            if (obj.AllProcedureList.length > 0) {
                ProcedureIds = obj.AllProcedureList.map(function (p) { return p.ProcedureId; }).join(',');
                obj.AllProcedureInd = 0;
            }

            var PcpReferralIds = null;
            obj.AllReferralProviderInd = 1;
            if (obj.AllReferalList.length > 0) {
                PcpReferralIds = obj.AllReferalList.map(function (p) { return p.PcpReferralId; }).join(',');
                obj.AllReferralProviderInd = 0;
            }

            var UserIds = (obj.AllUsersList || [])
                .filter(function (x) { return x.IsChecked; })
                .map(function (x) { return x.DoctorID; }).join(',');
            var IsProviderType = "BillingProvider";
            if ($scope.AuditInsSubTab == 'BillingProvider') {
                IsProviderType = "BillingProvider";
            } else if ($scope.AuditInsSubTab == 'RenderingProvider') {
                IsProviderType = "RenderingProvider";
            }
            else if ($scope.AuditInsSubTab == 'Payor') {
                IsProviderType = "Payor";
            }

            return {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "OrganizationId": $scope.HospitalId,
                "AllLocationInd": obj.AllLocationInd || 1,
                "LocationIds": LocationIds || "",
                "AllBillingProviderInd": obj.AllBillingProviderInd || 1,
                "BillingProviderIds": BillingProviderIds || null,
                "AllRenderingProviderInd": obj.AllRenderingProviderInd || 1,
                "RenderingProviderIds": RenderingProviderIds || null,
                "AllMasterPayorsInd": obj.AllMasterPayorsInd,
                "MasterPayorIds": MasterPayorIds,
                "AllProcedureInd": obj.AllProcedureInd,
                "ProcedureIds": ProcedureIds,
                "AllReferralProviderInd": obj.AllReferralProviderInd,
                "ReferalUserIds": PcpReferralIds,
                "PostingUserIds": UserIds,
                "FromDate": obj.DOSFromDate || "",
                "ToDate": obj.DOSToDate || "",
                "DOSFrom": obj.DOSFromDate || "",
                "DOSTo": obj.DOSToDate || "",
                "ClaimStartDate": obj.ClaimStartDate || "",
                "ClaimEndDate": obj.ClaimEndDate || "",
                "ChkPostedFromDate": obj.ChkPostedFromDate || "",
                "ChkPostedToDate": obj.ChkPostedToDate || "",
                "CheckDate": obj.CheckDate || "",
                "CheckStartDate": obj.CheckStartDate || "",
                "CheckEndDate": obj.CheckEndDate || "",
                "ChkDateRangeId": obj.ChkDateRangeId || "",
                "PageSize": obj.PageSize || 100,
                "PageNumber": obj.PageNumber || 1,
                "IsProviderType": IsProviderType ||"BillingProvider",
            };
        }

        function buildAuditTotals(list) {
            return list.reduce(function (t, r) {
                t.TotalChargeAmount += r.TotalChargeAmount || 0;
                t.TotalInsurancePayment += r.TotalInsurancePayment || 0;
                t.TotalInsuranceAdjustmentPayment += r.TotalInsuranceAdjustmentPayment || 0;
                t.TotalInsuranceBalance += r.TotalInsuranceBalance || 0;
                t.TotalPatientPayment += r.TotalPatientPayment || 0;
                t.TotalPatientWriteOff += r.TotalPatientWriteOff || 0;
                t.TotalPatientBalance += r.TotalPatientBalance || 0;
                return t;
            }, {
                TotalChargeAmount: 0, TotalInsurancePayment: 0,
                TotalInsuranceAdjustmentPayment: 0, TotalInsuranceBalance: 0,
                TotalPatientPayment: 0, TotalPatientWriteOff: 0, TotalPatientBalance: 0
            });
        }


        // ─── 8. Load Billing Provider ──────────────────────────────────────
        $scope.loadAuditBillingProvider = function () {
            $scope.AuditBillingProviderList = [];
            $scope.AuditBillingProviderTotals = {};
            $scope.AuditBillingProviderChartList = [];

            

            eHnoteInsuranceService.GetAuditSummaryReport_New(buildAuditPayload()).then(function (resp) {
                if (resp.data.status === 'Success') {
                    $scope.AuditBillingProviderList = resp.data.rows || [];
                    $scope.AuditBillingProviderTotals = buildAuditTotals($scope.AuditBillingProviderList);
                    $scope.AuditBillingProviderChartList = resp.data.MonthWiseData || [];

                    $timeout(function () {
                        auditBillingChartContainer = $document[0].getElementById('AuditBillingProviderBarChart');
                        $scope.renderAuditBillingChart();
                    }, 0);
                } else {
                    alertify.error(resp.data.Message || 'Error loading Audit Billing Provider data.');
                }
            }, function (err) { console.log(err); });
        };


        // ─── 9. Load Rendering Provider ───────────────────────────────────
        $scope.loadAuditRenderingProvider = function () {
            $scope.AuditRenderingProviderList = [];
            $scope.AuditRenderingProviderTotals = {};
            $scope.AuditRenderingProviderChartList = [];

            eHnoteInsuranceService.GetAuditSummaryReport_New(buildAuditPayload()).then(function (resp) {
                if (resp.data.status === 'Success') {
                    $scope.AuditRenderingProviderList = resp.data.rows || [];
                    $scope.AuditRenderingProviderTotals = buildAuditTotals($scope.AuditRenderingProviderList);
                    $scope.AuditRenderingProviderChartList = resp.data.MonthWiseData || [];

                    $timeout(function () {
                        auditRenderingChartContainer = $document[0].getElementById('AuditRenderingProviderBarChart');
                        $scope.renderAuditRenderingChart();
                    }, 0);
                } else {
                    alertify.error(resp.data.Message || 'Error loading Audit Rendering Provider data.');
                }
            }, function (err) { console.log(err); });
        };


        // ─── Place these alongside the existing Audit billing/rendering vars ──────────
        $scope.AuditPayorList = [];
        $scope.AuditPayorTotals = {};
        $scope.AuditPayorChartList = [];

        var auditPayorChart = null;
        var auditPayorChartContainer = null;


        // ─── 1. Extend navtoOpenAuditGridReport ───────────────────────────────────────
        // Replace your existing navtoOpenAuditGridReport with this version:
        $scope.navtoOpenAuditGridReport = function (tabno) {
            $scope.AuditInsSubTab = tabno || '';

            if (tabno === 'BillingProvider') {
                $timeout(function () {
                    $scope.AuditBillingProviderList = [];
                    $scope.loadAuditBillingProvider();
                }, 500);
            } else if (tabno === 'RenderingProvider') {
                $timeout(function () {
                    $scope.AuditRenderingProviderList = [];
                    $scope.loadAuditRenderingProvider();
                }, 500);
            } else if (tabno === 'Payor') {                  
                $timeout(function () {
                    $scope.AuditPayorList = [];
                    $scope.loadAuditPayor();
                }, 500);
            }
        };


        // ─── 2. Extend ClickForAuditFilteredData ─────────────────────────────────────
        // Replace your existing ClickForAuditFilteredData with this version:
        $scope.ClickForAuditFilteredData = function () {
            angular.element(document.querySelector('.popover')).remove();
            if ($scope.AuditInsSubTab === 'BillingProvider') {
                $scope.loadAuditBillingProvider();
            } else if ($scope.AuditInsSubTab === 'RenderingProvider') {
                $scope.loadAuditRenderingProvider();
            } else if ($scope.AuditInsSubTab === 'Payor') {   // ← NEW
                $scope.loadAuditPayor();
            } else {
                alertify.error("Please select a sub tab to continue.");
            }
        };


        // ─── 3. Update buildAuditPayload to pass IsProviderType correctly ─────────────
        // Inside buildAuditPayload(), replace the IsProviderType block with:
        //
        //   var IsProviderType = "BillingProvider";
        //   if ($scope.AuditInsSubTab === 'RenderingProvider') IsProviderType = "RenderingProvider";
        //   else if ($scope.AuditInsSubTab === 'Payor')        IsProviderType = "Payor";
        //
        // (No other payload changes needed — the same endpoint is reused.)


        // ─── 4. Load Payor ────────────────────────────────────────────────────────────
        $scope.loadAuditPayor = function () {
            $scope.AuditPayorList = [];
            $scope.AuditPayorTotals = {};
            $scope.AuditPayorChartList = [];

            eHnoteInsuranceService.GetAuditSummaryReport_New(buildAuditPayload()).then(function (resp) {
                if (resp.data.status === 'Success') {
                    $scope.AuditPayorList = resp.data.rows || [];
                    $scope.AuditPayorTotals = buildAuditTotals($scope.AuditPayorList);
                    $scope.AuditPayorChartList = resp.data.MonthWiseData || [];

                    $timeout(function () {
                        auditPayorChartContainer = $document[0].getElementById('AuditPayorBarChart');
                        $scope.renderAuditPayorChart();
                    }, 0);
                } else {
                    alertify.error(resp.data.Message || 'Error loading Audit Payor data.');
                }
            }, function (err) { console.log(err); });
        };
        // ─── 10. Charts ───────────────────────────────────────────────────
        $scope.renderAuditBillingChart = function () {
            if (!auditBillingChartContainer) return;
            var raw = angular.isArray($scope.AuditBillingProviderChartList) ? $scope.AuditBillingProviderChartList : [];
            if (!raw.length) {
                if (auditBillingChart) { auditBillingChart.destroy(); auditBillingChart = null; }
                return;
            }
            var map = {};
            raw.forEach(function (item) {
                var k = item.BillingProviderName || 'Unknown';
                if (!map[k]) map[k] = { provider: k, Charges: 0, InsPayment: 0, InsBalance: 0, PatientPayment: 0, PatientBalance: 0 };
                map[k].Charges += Number(item.TotalChargeAmount) || 0;
                map[k].InsPayment += Number(item.TotalInsurancePayment) || 0;
                map[k].InsBalance += Number(item.TotalInsuranceBalance) || 0;
                map[k].PatientPayment += Number(item.TotalPatientPayment) || 0;
                map[k].PatientBalance += Number(item.TotalPatientBalance) || 0;
            });
            var data = Object.values(map);
            var metrics = [
                { yKey: 'Charges', yName: 'Charges', color: auditBaseColors[0] },
                { yKey: 'InsPayment', yName: 'Ins Payment', color: auditBaseColors[1] },
                { yKey: 'InsBalance', yName: 'Ins Balance', color: auditBaseColors[2] },
                { yKey: 'PatientPayment', yName: 'Patient Payment', color: auditBaseColors[3] },
                { yKey: 'PatientBalance', yName: 'Patient Balance', color: auditBaseColors[4] }
            ];
            var series = metrics.map(function (m) {
                return {
                    type: 'bar', xKey: 'provider', yKey: m.yKey, yName: m.yName,
                    fill: m.color, stroke: m.color, data: data,
                    tooltip: { renderer: function (p) { return { content: p.yName + ': $' + Number(p.datum[p.yKey] || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }; } }
                };
            });
            if (auditBillingChart) auditBillingChart.destroy();
            auditBillingChart = agCharts.AgCharts.create({
                container: auditBillingChartContainer, series: series, legend: { position: 'bottom' },
                axes: [
                    { type: 'category', position: 'bottom', title: { text: 'Billing Provider' } },
                    { type: 'number', position: 'left', title: { text: 'Amount ($)' }, label: { formatter: function (p) { return '$' + Number(p.value).toLocaleString('en-US', { maximumFractionDigits: 0 }); } } }
                ]
            });
        };

        $scope.renderAuditRenderingChart = function () {
            if (!auditRenderingChartContainer) return;
            var raw = angular.isArray($scope.AuditRenderingProviderChartList) ? $scope.AuditRenderingProviderChartList : [];
            if (!raw.length) {
                if (auditRenderingChart) { auditRenderingChart.destroy(); auditRenderingChart = null; }
                return;
            }
            var map = {};
            raw.forEach(function (item) {
                var k = item.RenderingProviderName || 'Unknown';
                if (!map[k]) map[k] = { provider: k, Charges: 0, InsPayment: 0, InsBalance: 0, PatientPayment: 0, PatientBalance: 0 };
                map[k].Charges += Number(item.TotalChargeAmount) || 0;
                map[k].InsPayment += Number(item.TotalInsurancePayment) || 0;
                map[k].InsBalance += Number(item.TotalInsuranceBalance) || 0;
                map[k].PatientPayment += Number(item.TotalPatientPayment) || 0;
                map[k].PatientBalance += Number(item.TotalPatientBalance) || 0;
            });
            var data = Object.values(map);
            var metrics = [
                { yKey: 'Charges', yName: 'Charges', color: auditBaseColors[0] },
                { yKey: 'InsPayment', yName: 'Ins Payment', color: auditBaseColors[1] },
                { yKey: 'InsBalance', yName: 'Ins Balance', color: auditBaseColors[2] },
                { yKey: 'PatientPayment', yName: 'Patient Payment', color: auditBaseColors[3] },
                { yKey: 'PatientBalance', yName: 'Patient Balance', color: auditBaseColors[4] }
            ];
            var series = metrics.map(function (m) {
                return {
                    type: 'bar', xKey: 'provider', yKey: m.yKey, yName: m.yName,
                    fill: m.color, stroke: m.color, data: data,
                    tooltip: { renderer: function (p) { return { content: p.yName + ': $' + Number(p.datum[p.yKey] || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }; } }
                };
            });
            if (auditRenderingChart) auditRenderingChart.destroy();
            auditRenderingChart = agCharts.AgCharts.create({
                container: auditRenderingChartContainer, series: series, legend: { position: 'bottom' },
                axes: [
                    { type: 'category', position: 'bottom', title: { text: 'Rendering Provider' } },
                    { type: 'number', position: 'left', title: { text: 'Amount ($)' }, label: { formatter: function (p) { return '$' + Number(p.value).toLocaleString('en-US', { maximumFractionDigits: 0 }); } } }
                ]
            });
        };


        // ─── 11. Filter toggles ───────────────────────────────────────────
        $scope.checkAuditAllBillingProviders = function (val) {
            angular.forEach($scope.AuditReportObj.BillingProviderList, function (i) { i.IsChecked = val; });
            $scope.AuditReportObj.SelectBillingProviderString = val ? 'All' : 'Select Billing Provider';
        };
        $scope.AuditBillingProviderToggle = function () {
            var checked = $scope.AuditReportObj.BillingProviderList.filter(function (i) { return i.IsChecked; });
            $scope.AuditReportObj.AllBillingProviderStatusCheck = checked.length === $scope.AuditReportObj.BillingProviderList.length;
            $scope.AuditReportObj.SelectBillingProviderString =
                checked.length === 0 ? 'Select Billing Provider' :
                    $scope.AuditReportObj.AllBillingProviderStatusCheck ? 'All' : 'Selected';
        };

        $scope.checkAuditAllRendering = function (val) {
            angular.forEach($scope.AuditReportObj.RenderingProviderList, function (i) { i.IsChecked = val; });
            $scope.AuditReportObj.SelectRenderingStatusString = val ? 'All Doctors' : 'Select';
            $scope.AuditReportObj.AllRenderingStatusCheck = val;
        };
        $scope.AuditRenderingToggle = function () {
            var checked = _.where($scope.AuditReportObj.RenderingProviderList, { IsChecked: true });
            $scope.AuditReportObj.AllRenderingStatusCheck = checked.length === $scope.AuditReportObj.RenderingProviderList.length;
            $scope.AuditReportObj.SelectRenderingStatusString =
                checked.length === 0 ? 'Select' :
                    checked.length === 1 ? checked[0].SecondUserFullName + '-' + checked[0].NPI : 'Selected';
        };

        $scope.checkAuditAllUsers = function (val) {
            angular.forEach($scope.AuditReportObj.AllUsersList, function (i) { i.IsChecked = val; });
            $scope.AuditReportObj.SelectUserStatusString = val ? 'All' : 'Select';
            $scope.AuditReportObj.AllUserStatusCheck = val;
        };
        $scope.AuditUserToggle = function () {
            var checked = $scope.AuditReportObj.AllUsersList.filter(function (i) { return i.IsChecked; });
            $scope.AuditReportObj.AllUserStatusCheck = checked.length === $scope.AuditReportObj.AllUsersList.length;
            $scope.AuditReportObj.SelectUserStatusString =
                checked.length === 0 ? 'Select' :
                    $scope.AuditReportObj.AllUserStatusCheck ? 'All' : 'Selected';
        };


        // ─── 12. Payor typeahead (reuse existing GetOrganizationNewPayorAllList) ─
        $scope.AuditChangePayor = function (item) {
            var exists = $filter('filter')($scope.AuditReportObj.AllPayorList, { PayorId: item.OrganizationPayorId }, true);
            if (exists.length > 0) { alertify.error('Payor already selected'); return; }
            $scope.AuditReportObj.AllPayorList.push({ PayorId: item.OrganizationPayorId, PayorName: item.OrganizationPayorName });
            $scope.AuditReportObj.PayorObj = '';
        };
        $scope.AuditDeletePayor = function (i) { $scope.AuditReportObj.AllPayorList.splice(i, 1); };
        $scope.AuditClearAllPayor = function () { $scope.AuditReportObj.AllPayorList = []; };


        // ─── 13. Procedure typeahead (reuse existing GetOrganizationProcedure) ─
        $scope.AuditOnselectServiceItem = function (item) {
            var exists = $filter('filter')($scope.AuditReportObj.AllProcedureList, { ProcedureId: item.ProcedureId }, true);
            if (exists.length > 0) { alertify.error('Procedure already selected'); return; }
            $scope.AuditReportObj.AllProcedureList.push({ ProcedureId: item.ProcedureId, ProcedureName: item.ProcedureName });
            $scope.AuditReportObj.ServiceObj = '';
        };
        $scope.AuditDeleteProcedure = function (i) { $scope.AuditReportObj.AllProcedureList.splice(i, 1); };
        $scope.AuditClearAllProcedure = function () { $scope.AuditReportObj.AllProcedureList = []; };


        // ─── 14. Referral typeahead (reuse existing GetReferalPCPDoctors) ──
        $scope.AuditOnSelectReferral = function (item) {
            var exists = $filter('filter')($scope.AuditReportObj.AllReferalList, { PcpReferralId: item.PcpReferralId }, true);
            if (exists.length > 0) { alertify.error('Referral already selected'); return; }
            $scope.AuditReportObj.AllReferalList.push({ PcpReferralId: item.PcpReferralId, FullName: item.FullName });
            $scope.AuditReportObj.ReferringObj = '';
        };
        $scope.AuditDeleteReferal = function (i) { $scope.AuditReportObj.AllReferalList.splice(i, 1); };
        $scope.AuditClearAllReferal = function () { $scope.AuditReportObj.AllReferalList = []; };


        // ─── 15. Popover ──────────────────────────────────────────────────
        $scope.auditFilterPopover = { templateUrl: 'auditFilterPopover.html' };
        $scope.auditPopoverOpen = false;
        $scope.auditSearchTxt = { rendering: '' };

        $scope.toggleAuditPopover = function () {
            $scope.auditPopoverOpen = !$scope.auditPopoverOpen;
        };
        $scope.closeAuditFilterPopover = function () {
            angular.element(document.querySelector('.popover')).remove();
            $scope.auditPopoverOpen = false;
        };


        // ─── 16. Open detail popup ────────────────────────────────────────
        $scope.openAuditPaymentPopup = function (id, type, item) {
            $uibModal.open({
                templateUrl: "templates/UsClaims/Reports/AuditGridContainer.html",
                backdrop: "static", keyboard: false,
                resolve: { PObj: function () { return { id: id || 1, type: type || '', Mainobj: angular.copy($scope.AuditReportObj), selecteditem: item }; } },
                windowClass: "offcanves-right",
                controller: "UsAuditGridContainerCtrl"
            });
        };


        

        // ─── 5. Payor Chart ───────────────────────────────────────────────────────────
        $scope.renderAuditPayorChart = function () {
            if (!auditPayorChartContainer) return;

            var raw = angular.isArray($scope.AuditPayorChartList) ? $scope.AuditPayorChartList : [];
            if (!raw.length) {
                if (auditPayorChart) { auditPayorChart.destroy(); auditPayorChart = null; }
                return;
            }

            // Aggregate by payor name (handle MonthWiseData that may have one row per month)
            var map = {};
            raw.forEach(function (item) {
                var k = item.PayorName || item.OrganizationPayorName || 'Unknown';
                if (!map[k]) map[k] = { payor: k, Charges: 0, InsPayment: 0, InsBalance: 0, PatientPayment: 0, PatientBalance: 0 };
                map[k].Charges += Number(item.TotalChargeAmount) || 0;
                map[k].InsPayment += Number(item.TotalInsurancePayment) || 0;
                map[k].InsBalance += Number(item.TotalInsuranceBalance) || 0;
                map[k].PatientPayment += Number(item.TotalPatientPayment) || 0;
                map[k].PatientBalance += Number(item.TotalPatientBalance) || 0;
            });

            var data = Object.values(map);

            var metrics = [
                { yKey: 'Charges', yName: 'Charges', color: auditBaseColors[0] },
                { yKey: 'InsPayment', yName: 'Ins Payment', color: auditBaseColors[1] },
                { yKey: 'InsBalance', yName: 'Ins Balance', color: auditBaseColors[2] },
                { yKey: 'PatientPayment', yName: 'Patient Payment', color: auditBaseColors[3] },
                { yKey: 'PatientBalance', yName: 'Patient Balance', color: auditBaseColors[4] }
            ];

            var series = metrics.map(function (m) {
                return {
                    type: 'bar', xKey: 'payor', yKey: m.yKey, yName: m.yName,
                    fill: m.color, stroke: m.color, data: data,
                    tooltip: {
                        renderer: function (p) {
                            return {
                                content: p.yName + ': $' + Number(p.datum[p.yKey] || 0)
                                    .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            };
                        }
                    }
                };
            });

            if (auditPayorChart) auditPayorChart.destroy();

            auditPayorChart = agCharts.AgCharts.create({
                container: auditPayorChartContainer,
                series: series,
                legend: { position: 'bottom' },
                axes: [
                    { type: 'category', position: 'bottom', title: { text: 'Payor' } },
                    {
                        type: 'number', position: 'left', title: { text: 'Amount ($)' },
                        label: {
                            formatter: function (p) {
                                return '$' + Number(p.value).toLocaleString('en-US', { maximumFractionDigits: 0 });
                            }
                        }
                    }
                ]
            });
        };


        

      
        $scope.GetPatientPaymentsListByPayment_MethodPrint = function () {

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

            var BillingProviderids = $scope.PatientPaymentsReportsObj.BillingProviderList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.OrganizationBillingProviderId)
                .join(",");

            var RenderingProviderIds = $scope.PatientPaymentsReportsObj.RenderingProviderDoctorsList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");



            let obj = {
                "ParentOrganization": $scope.ParentHospitalId,
                "PaymentFromDate": $scope.PatientPaymentsReportsObj.PatientPayFromDate || "",
                "PaymentToDate": $scope.PatientPaymentsReportsObj.PatientPayToDate || "",
                "UserIdsList": UserIds || "",
                "LocationIdsList": Locationids || "",
                "PaymentMethodsList": PaymentModeids || "",
            };
            eHnoteInsuranceService.GetPatientPaymentMethod_Print(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.PatientPaymentsByMethodObj.PaymentFromDate = resp.data.PaymentFromDate || "";
                    $scope.PatientPaymentsByMethodObj.PaymentFromDate = $filter('date')($scope.PatientPaymentsByMethodObj.PaymentFromDate, 'MM/dd/yyyy');
                    $scope.PatientPaymentsByMethodObj.PaymentToDate = resp.data.PaymentToDate || "";
                    $scope.PatientPaymentsByMethodObj.PaymentToDate = $filter('date')($scope.PatientPaymentsByMethodObj.PaymentToDate, 'MM/dd/yyyy');
                    $scope.TotalAmountbyPaymentMethod = 0;
                    $scope.TotalPaymentMethodCount = 0;
                    var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
                    var printTime = moment(new Date()).format("HH:mm A");
                    var printDatemTime = printDate + '  ' + printTime;
                    $scope.PatientPaymentsReportsObj.PrintedDatenTime = printDatemTime;
                    if ($scope.PatientPaymentsReportsObj.ReportUsersList.length > 0) {
                        let TempUserArray = $filter("filter")($scope.PatientPaymentsReportsObj.ReportUsersList, function (kitem) { return kitem.DoctorID == $scope.UserId }, true);
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

                    $timeout(function () {
                        var innerContents = document.getElementById('PaymentMethod_Print').innerHTML;
                        var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                        popupWinindow.document.open();
                        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                        popupWinindow.document.close();
                    }, 1000);


                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };









    }]);
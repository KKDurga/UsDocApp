

"use strict";
eHnoteWebApp.controller("USAggregateReportsCtrl", ["$scope", "eHnoteInsuranceService", "alertify", "$timeout", "$q", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "localStorageFactory", "$uibModal", "eHnoteUserAppointmentDataService",
    function ($scope, eHnoteInsuranceService, alertify, $timeout, $q, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, localStorageFactory, $uibModal, eHnoteUserAppointmentDataService) {



        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
        $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        $scope.OperationAgregateTab = 1;
        $scope.AgregateSubTab = 1;

        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo &&
            $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode &&
            $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
        var currentDate = new Date();

        function GetARReportData() {
            var obj = {
                "SelectedRangeId": 1, 
                "LocationIds": null,
                "FromDate": moment().startOf('month').format("MM-DD-YYYY"), 
                "ToDate": moment().format("MM-DD-YYYY"), 
                "CurrentDate": moment().format("MM-DD-YYYY"),
                "Year": moment().year()
            }

            return obj;
        };
        $scope.ARReportData = GetARReportData();
        $scope.DateRangeArray = [
            { Id: 1, Name: 'Month to Date' },
            { Id: 2, Name: 'Quarter to Date' },
            { Id: 3, Name: 'Year to Date' },
            { Id: 4, Name: 'Custom Range' }
        ];


        $scope.LocationTypeObj = {
            "SelectLocationString": "All Locations",
            "Name": "",
            "AllLocationCheck": true
        };

        $scope.totalSums = {
            "TotalChargeAmount": 0,
            "TotalInsurancePaymentAmount": 0,
            "TotalPatientPaymentAmount": 0,
            "TotalAdjustmentAmount": 0,
            "TotalWriteOffAmount": 0,
            "TotalCollectionAmount": 0
        };
        $scope.dashboardFilterPopover = {
            templateUrl: 'dashboardFilterPopover.html',
        };

        $scope.ChangeApptBranch = function (item, typeId) {


            $scope.AppListselectedclinic = item || {};

            if (item.IsChecked) {
                if (item.ClinicId === 0) {
                    angular.forEach($scope.AllUserBranchesList, function (mitem) {
                        mitem.IsChecked = true;
                    });
                }
            } else {
                if (item.ClinicId === 0) {
                    angular.forEach($scope.AllUserBranchesList, function (mitem) {
                        mitem.IsChecked = false;
                    });
                }
            }


            var Locationids = '';
            Locationids = $scope.AllUserBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            typeId = typeId || 0;
            $scope.ARReportData.LocationIds = Locationids || '';



            var nonZeroChecked = $scope.AllUserBranchesList
                .filter(branch => branch.ClinicId !== 0)
                .every(branch => branch.IsChecked === true);

            var clinicZeroItem = $scope.AllUserBranchesList.find(branch => branch.ClinicId === 0);
            if (clinicZeroItem) {
                clinicZeroItem.IsChecked = nonZeroChecked;
            }

            var checkedArray = _.where($scope.AllUserBranchesList, { IsChecked: true });
            var checkedCount = checkedArray.length;
            var totalBranches = $scope.AllUserBranchesList.length;

            if (checkedCount === totalBranches) {
                $scope.LocationTypeObj.SelectLocationString = "All Locations";
            } else if (checkedCount > 0) {
                $scope.LocationTypeObj.SelectLocationString = "Selected";
            } else {
                $scope.LocationTypeObj.SelectLocationString = "Select";
            }

            if (checkedCount == 1) {
                var filterlist = $filter("filter")($scope.AllUserBranchesList, function (item) {
                    return item.ClinicId == checkedArray[0].ClinicId;
                }) || [];
                if (filterlist.length > 0) {
                    $scope.LocationTypeObj.SelectLocationString = filterlist[0].ClinicName || "Select";
                }
            }

        }

        $scope.init = function () {
            function InitializeNewBranches(data) {
                $scope.AllUserBranchesList = [];
                if (data.length !== 0) {
                    var EmptyClinicObj = {
                        "ClinicName": "All Locations",
                        "ClinicId": 0,
                        "BranchName": "All Locations",
                        "BranchId": 0,
                        "SubOrganizationId": 0,
                        "DefaultBillingProviderId": 0,
                        "Address1": "",
                        "Address2": "",
                        "Location": "",
                        "StateId": "",
                        "PinCode": "",
                        "CountryId": "",
                        "CityId": "",
                        "DistrictRegion": "",
                        "Latitude": "",
                        "Longitude": "",
                        "BranchEmail": "",
                        "CountryCode": "",
                        "mobilenum": "",
                        "Active": "Y",
                        "Doctors": [],
                        "CommunicationCountryCode": "",
                        "CommunicationMobileNo": ""
                    };
                    var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];
                    BrachesList.unshift(EmptyClinicObj);
                    $scope.AllUserBranchesList = BrachesList;
                    $scope.BranchesListArray = BrachesList;
                    $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList, function (item) {
                        return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
                    });

                    $scope.selectedBranch = $scope.defaultbranch[0];
                    $scope.HospitalObj = $scope.defaultbranch[0];
                    angular.forEach($scope.AllUserBranchesList, function (item) {
                        item.IsChecked = true;

                    });
                    var Locationids = '';
                    Locationids = $scope.AllUserBranchesList
                        .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                    $scope.ARReportData.LocationIds = Locationids || '';

                    if ($scope.RoleId === 2 || $scope.RoleId === 10 || $scope.RoleId === 11 || $scope.RoleId === 58) {
                        angular.forEach($scope.BranchesListArray, function (item, index) {
                            if (item.ClinicName !== "All Locations") {
                                if (item.ExtDetails.HospitalID === $scope.hospid) {
                                    $scope.selectedBranch = item;
                                    $scope.HospitalObj = item;
                                }
                            }
                        });
                    }
                }


                if ($scope.selectedBranch.BranchId === 0) {
                    if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                        $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;

                    }
                }
            }

            var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
            InitializeNewBranches(NewBranchList);
        }
        $scope.init();

        $scope.GetChargesVsCollectionData = function () {
            $scope.AllTotalCharges = [];
            let param = {
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": "2025",
                "CurrentDate": $scope.ARReportData.CurrentDate
            }

            eHnoteInsuranceService.GetMainDashboardTotalChargesVsCollectionData(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.AllTotalCharges = resp.data.rows || [];
                }

            }, function (err) { console.log(err); });
        };

       // $scope.GetChargesVsCollectionData();

        $scope.setDateRange = function (selectedRangeId) {
            var currentDate = new Date();
            var fromDate, toDate;

            switch (selectedRangeId) {
                case 1: // Month to Date
                    fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    toDate = new Date();
                    break;

                case 2: // Quarter to Date
                    // Determines which quarter we're in (0=Q1, 1=Q2, 2=Q3, 3=Q4)
                    // Calculates the starting month of that quarter (0, 3, 6, or 9)
                    // Sets the 'from' date as the 1st day of the quarter
                    var quarter = Math.floor(currentDate.getMonth() / 3); // 0=Q1,1=Q2,2=Q3,3=Q4
                    var quarterStartMonth = quarter * 3;
                    fromDate = new Date(currentDate.getFullYear(), quarterStartMonth, 1);
                    toDate = new Date();
                    break;

                case 3: // Year to Date
                    fromDate = new Date(currentDate.getFullYear(), 0, 1);
                    toDate = new Date();
                    break;

                case 4: // Custom Range
                    fromDate = null;
                    toDate = null;
                    break;

                default:
                    fromDate = moment().format("MM-DD-YYYY");
                    toDate = moment().format("MM-DD-YYYY");
            }

            $scope.ARReportData.FromDate = fromDate;
            $scope.ARReportData.ToDate = toDate;

            if ($scope.ARReportData.FromDate) {
                $scope.ARReportData.FromDate = $filter('date')($scope.ARReportData.FromDate, "MM-dd-yyyy");
            }
            if ($scope.ARReportData.ToDate) {
                $scope.ARReportData.ToDate = $filter('date')($scope.ARReportData.ToDate, "MM-dd-yyyy");
            }
        };



        $scope.ChangeAgregateSubTab = function (id) {
            $scope.AgregateSubTab = id;

            if ($scope.AgregateSubTab == 1) {
                $scope.GetDashboardAggregateRevenueChargesVsCollection();

            }
            else if ($scope.AgregateSubTab == 2) {

                $scope.GetDashboardOperationlARBalanceByPayer();
                $scope.GetDashboardOperationlARBalanceByMonthWise();

            }
            else if ($scope.AgregateSubTab == 3) {
                $scope.GetDashboardAggregatePayersChargesVsCollection();
                $scope.GetDashboardAggregatePayersCollection();
                $scope.GetDashboardAverageEncounterchargeperPayers();
                $scope.GetDashboardAggregateDenialClaimsByPayers();
            }
            else if ($scope.AgregateSubTab == 4) {
                $scope.GetDashboardOperationlProvidersChargesCollections();
                $scope.GetDashboardAggregateDenialClaimsByProviders();
            }
            else if ($scope.AgregateSubTab == 5) {
                $scope.GetDashboardOperationlProceduresCharges();
                $scope.GetDashboardOperationlProceduresCollections();
                $scope.GetDashboardOperationlCategoryWiseCPTCollections();
                $scope.GetDashboardAggregateAvearageChargePerEncounters();
                $scope.GetMainAggregateDashboardHighValueServices();

            }
            else if ($scope.AgregateSubTab == 6) {
                $scope.GetDashboardAggregateRevenuePatientVsInsurancePayments();
                $scope.GetDashboardAggregateRevenuePatientBalancesBuckets();
            }
            else if ($scope.AgregateSubTab == 7) {
                $scope.GetDashboardAggregateClaimsSubmitedAcceptedMonthWise();
            }
            

            else {

            }
        }

        $scope.FilterApply = function () {
            $scope.ChangeAgregateSubTab($scope.AgregateSubTab);
        }
      //  let payerCollectionsChartInstance = null;

        $scope.ResetFilter = function () {
            $scope.ARReportData = GetARReportData();
            var Locationids = '';

            $scope.LocationTypeObj.SelectLocationString = "All Locations";
            $scope.AllUserBranchesList.forEach(p => p.IsChecked = true);

            Locationids = $scope.AllUserBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");
            $scope.ARReportData.LocationIds = Locationids || '';
            $scope.ChangeAgregateSubTab($scope.OperationAgregateSubTab);
        }
       
        $scope.payerChargesCollectionsChartInstance = null;
        $scope.renderPayerChargesCollectionsChart = function () {
            let rows = $scope.TotalsPayersCharges || [];
            if (!rows.length) return;

            // Payors as labels
            let payors = rows.map(r => r.PayorName);

            // Flatten locations
            let locationNames = [...new Set(rows.flatMap(r => r.Locations.map(l => l.LocationName)))];

            let chargesColors = ["#4e73df", "#1cc88a", "#e74a3b", "#f6c23e"];
            let collectionsColors = ["#9ad0f5", "#7fe0b0", "#f59ca9", "#f8e08c"];

            let chargesDatasets = locationNames.map((loc, i) => ({
                label: loc + " Charges",
                data: rows.map(r => {
                    let found = r.Locations.find(l => l.LocationName === loc);
                    return found ? found.Charges : 0;
                }),
                backgroundColor: chargesColors[i % chargesColors.length],
                stack: "Charges"
            }));

            let collectionsDatasets = locationNames.map((loc, i) => ({
                label: loc + " Collections",
                data: rows.map(r => {
                    let found = r.Locations.find(l => l.LocationName === loc);
                    return found ? found.Collected : 0;
                }),
                backgroundColor: collectionsColors[i % collectionsColors.length],
                stack: "Collections"
            }));

            if ($scope.payerChargesCollectionsChartInstance) {
                $scope.payerChargesCollectionsChartInstance.destroy();
                $scope.payerChargesCollectionsChartInstance = null;
            }

            let canvas = getOrCreateCanvasLinePayerCharge("PayerChargesCollections");
            if (!canvas) return;

            let ctx = canvas.getContext("2d");
            $scope.payerChargesCollectionsChartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: payors,
                    datasets: [...chargesDatasets, ...collectionsDatasets]
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let payor = context.label;
                                    let datasetLabel = context.dataset.label;
                                    let loc = datasetLabel.replace(" Charges", "").replace(" Collections", "");
                                    let row = rows.find(r => r.PayorName === payor);
                                    let locData = row?.Locations.find(l => l.LocationName === loc);

                                    if (datasetLabel.endsWith("Charges")) {
                                        return loc + " - Charges: $" + (locData?.Charges || 0).toLocaleString();
                                    } else {
                                        return [
                                            loc + " - Collected: $" + (locData?.Collected || 0).toLocaleString(),
                                            "Net %: " + ((locData?.NetPercentage || 0).toFixed(2)) + "%"
                                        ];
                                    }
                                }
                            }
                        },
                        legend: { position: "top" }
                    },
                    scales: {
                        x: { stacked: true },
                        y: { stacked: true, beginAtZero: true }
                    }
                }
            });
        };
        $scope.payerCollectionsPercentChartInstance = null;
        $scope.renderPayerCollectionsPercentChart = function () {
            let rows = $scope.TotalsPayersCharges || [];
            if (!rows.length) return;

            let payors = rows.map(r => r.PayorName);
            let locationNames = [...new Set(rows.flatMap(r => r.Locations.map(l => l.LocationName)))];

            let colors = ["#4e73df", "#1cc88a", "#e74a3b", "#f6c23e", "#9ad0f5"];

            let datasets = locationNames.map((loc, i) => ({
                label: loc + " Net %",
                data: rows.map(r => {
                    let found = r.Locations.find(l => l.LocationName === loc);
                    return found ? found.NetPercentage : 0;
                }),
                backgroundColor: colors[i % colors.length]
            }));

            if ($scope.payerCollectionsPercentChartInstance) {
                $scope.payerCollectionsPercentChartInstance.destroy();
                $scope.payerCollectionsPercentChartInstance = null;
            }

            let canvas = getOrCreateCanvasLinePayerCollection("PayerCollectionsPercent");
            if (!canvas) return;

            let ctx = canvas.getContext("2d");
            $scope.payerCollectionsPercentChartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: payors,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.dataset.label + ": " + context.parsed.y.toFixed(2) + "%";
                                }
                            }
                        },
                        legend: { position: "top" }
                    },
                    scales: {
                        y: { beginAtZero: true, max: 100 }
                    }
                }
            });
        };

        

        $scope.GetDashboardAggregatePayersChargesVsCollection = function () {
            $scope.TotalsPayersCharges = [];

            $scope.totalPayorSums = {
                "TotalChargeAmount": 0,               
                "TotalCollectionAmount": 0,              
                "NetCollectionRate": 0
            };
            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": $scope.ARReportData.Year,
            }

            eHnoteInsuranceService.GetDashboardAggregatePayersChargesVsCollection(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalsPayersCharges = resp.data.rows || [];
                    angular.forEach($scope.TotalsPayersCharges, function (item) {
                        item.TotalChargesAmt = 0;
                        item.TotalCollectionsAmt = 0;
                        item.NetCollectionPercentage = 0;
                        angular.forEach(item.Locations, function (loc) {

                            item.TotalChargesAmt += loc.Charges || 0;
                            item.TotalCollectionsAmt += loc.Collected || 0;
                            item.NetCollectionPercentage += loc.NetPercentage || 0;

                            $scope.totalPayorSums.TotalChargeAmount += loc.Charges || 0;
                            $scope.totalPayorSums.TotalCollectionAmount += loc.Collected || 0;
                        });
                    });
                    let netAllowed = $scope.totalPayorSums.TotalChargeAmount - $scope.totalPayorSums.TotalAdjustmentWriteoffAmount;
                    $scope.totalPayorSums.TotalChargeAmount = $scope.totalPayorSums.TotalChargeAmount.toFixed(2);
                    $scope.totalPayorSums.TotalCollectionAmount = $scope.totalPayorSums.TotalCollectionAmount.toFixed(2);
                    $scope.totalPayorSums.NetCollectionRate = netAllowed > 0
                        ? (($scope.totalPayorSums.TotalCollectionAmount / netAllowed) * 100).toFixed(2)
                        : 0;
                    console.log($scope.TotalsPayersCharges);
                    $timeout($scope.renderPayerChargesCollectionsChart, 0);
                    $timeout($scope.renderPayerCollectionsPercentChart, 0);
                }

            }, function (err) { console.log(err); });
        };

        $scope.GetDashboardAggregatePayersCollection = function () {
            $scope.TotalsPayersCollections = [];


            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": $scope.ARReportData.Year,
            }

            eHnoteInsuranceService.GetDashboardAggregatePayersCollection(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalsPayersCollections = resp.data.rows || [];

                    angular.forEach($scope.TotalsPayersCollections, function (item) {
                        item.TotalChargesAmt = 0;
                        item.TotalCollectionsAmt = 0;
                        item.NetCollectionPercentage = 0;
                        item.TotalInsPaymentAmt = 0;
                        item.TotalPatPaymentAmt = 0;

                        angular.forEach(item.Locations, function (citem) {
                            item.TotalChargesAmt += citem.Charges || 0;
                            item.TotalCollectionsAmt += citem.Collected || 0;
                            item.NetCollectionPercentage += citem.NetPercentage || 0;
                            item.TotalInsPaymentAmt += citem.InsurancePayment || 0;
                            item.TotalPatPaymentAmt += citem.PatientPayment || 0;
                        })
                    })

                   
                    console.log($scope.TotalsPayersCollections);
                  //  $timeout($scope.renderPayerAgregateCollectionsChart, 0);
                }

            }, function (err) { console.log(err); });
        };

        $scope.GetDashboardAggregateRevenueChargesVsCollection = function () {
            $scope.AllTotalCharges = [];
            $scope.totalSums = {
                "TotalChargeAmount": 0,
                "TotalPaymentAmount": 0,
                "TotalPatientPaymentAmount": 0,
                "TotalAdjustmentAmount": 0,
                "TotalWriteOffAmount": 0,
                "TotalCollectionAmount": 0,
                "TotalAdjustmentWriteoffAmount": 0,
                "NetCollectionRate": 0,
                "TotalNetPercentage":0,
                "TotalInsurancePaymentAmount":0,
            };
            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");
            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": $scope.ARReportData.Year,
            }

            eHnoteInsuranceService.GetDashboardAggregateRevenueChargesVsCollection(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.AllTotalCharges = resp.data.rows || [];
                    if ($scope.AllTotalCharges.length > 0) {
                        angular.forEach($scope.AllTotalCharges, function (item) {
                            item.TotalInsAdjustmentAmt = 0;
                            item.TotalChargesAmt = 0;
                            item.TotalCollectionAmt = 0;
                            item.TotalPatientWriteOffAmt = 0;
                            item.TotalNetPercentage = 0;
                            item.TotalInsurancePaymentAmt = 0;
                            item.TotalPatientPaymentAmt = 0;
                            item.TotalAdjandWriteoffAmt = 0;
                            item.TotalRevenueAmt = 0;
                            angular.forEach(item.Locations, function (loc) {
                                loc.AdjustmentandWriteOffAmt = 0;
                                loc.RevenueAmount = 0;
                              
                                item.TotalChargesAmt += loc.Charges || 0;
                                item.TotalCollectionAmt += loc.Collected || 0;
                                item.TotalInsAdjustmentAmt += loc.AdjustmentAmount || 0;
                                item.TotalPatientWriteOffAmt += loc.WriteOffAmount || 0;
                                item.TotalNetPercentage += loc.NetPercentage || 0;
                                item.TotalInsurancePaymentAmt += loc.InsurancePayment || 0;
                                item.TotalPatientPaymentAmt += loc.PatientPayment || 0;
                                item.TotalAdjandWriteoffAmt += (loc.AdjustmentAmount || 0) + (loc.WriteOffAmount || 0);
                                item.TotalRevenueAmt += loc.Charges - ((loc.AdjustmentAmount || 0) + (loc.WriteOffAmount || 0));

                                loc.AdjustmentandWriteOffAmt = (loc.AdjustmentAmount || 0) + (loc.WriteOffAmount || 0);
                                loc.RevenueAmount = loc.Charges - ((loc.AdjustmentAmount || 0) + (loc.WriteOffAmount || 0));

                                $scope.totalSums.TotalChargeAmount += loc.Charges || 0;
                                $scope.totalSums.TotalCollectionAmount += loc.Collected || 0;
                                $scope.totalSums.TotalAdjustmentAmount += loc.AdjustmentAmount || 0;
                                $scope.totalSums.TotalWriteOffAmount += loc.WriteOffAmount || 0;
                                $scope.totalSums.TotalNetPercentage += loc.NetPercentage || 0;
                                $scope.totalSums.TotalInsurancePaymentAmount += loc.InsurancePayment || 0;
                                $scope.totalSums.TotalPatientPaymentAmount += loc.PatientPayment || 0;

                                $scope.totalSums.TotalAdjustmentWriteoffAmount += (loc.AdjustmentAmount || 0) + (loc.WriteOffAmount || 0);
                            });
                        });

                        let netAllowed = $scope.totalSums.TotalChargeAmount - $scope.totalSums.TotalAdjustmentWriteoffAmount;
                        $scope.totalSums.TotalChargeAmount = $scope.totalSums.TotalChargeAmount.toFixed(2);
                        $scope.totalSums.TotalCollectionAmount = $scope.totalSums.TotalCollectionAmount.toFixed(2);
                        $scope.totalSums.TotalAdjustmentAmount = $scope.totalSums.TotalAdjustmentAmount.toFixed(2);
                        $scope.totalSums.TotalWriteOffAmount = $scope.totalSums.TotalWriteOffAmount.toFixed(2);
                        $scope.totalSums.TotalAdjustmentWriteoffAmount = $scope.totalSums.TotalAdjustmentWriteoffAmount.toFixed(2);

                        $scope.totalSums.NetCollectionRate = netAllowed > 0
                            ? (($scope.totalSums.TotalCollectionAmount / netAllowed) * 100).toFixed(2)
                            : 0;

                    }
                    $timeout($scope.renderRevenueChargesCollectionsChart, 0);
                    $timeout($scope.renderRevenueNetPercentLineChart, 0);
                    $timeout($scope.renderGrossNetStackedChart, 0);
                    $timeout($scope.renderLocationAdjustmentsChart, 0);
                    

                }

            }, function (err) { console.log(err); });
        };

        $scope.GetDashboardAggregateRevenueChargesVsCollection();
       
        function getOrCreateCanvas(containerId, canvasId) {
            let container = document.getElementById(containerId);
            if (!container) return null;

            let canvas = document.getElementById(canvasId);
            if (!canvas) {
                canvas = document.createElement("canvas");
                canvas.id = canvasId;
                container.innerHTML = "";
                container.appendChild(canvas);
            }
            return canvas;
        }

        $scope.chargesCollectionsChartInstance = null;

        $scope.renderRevenueChargesCollectionsChart = function () {
            let rows = $scope.AllTotalCharges || [];
            if (!rows.length) return;

            let months = rows.map(r => r.Month);

            let locationNames = [...new Set(rows.flatMap(r => r.Locations.map(l => l.LocationName)))];

            // Define color palettes
            let chargesColors = ["#4e73df", "#1cc88a", "#e74a3b", "#f6c23e"];
            let collectionsColors = ["#9ad0f5", "#7fe0b0", "#f59ca9", "#f8e08c"];

            // Charges datasets
            let chargesDatasets = locationNames.map((loc, i) => ({
                label: loc + " Charges",
                data: rows.map(r => {
                    let found = r.Locations.find(l => l.LocationName === loc);
                    return found ? found.Charges : 0;
                }),
                backgroundColor: chargesColors[i % chargesColors.length],
                stack: "Charges"  // group all charges
            }));

            // Collections datasets
            let collectionsDatasets = locationNames.map((loc, i) => ({
                label: loc + " Collections",
                data: rows.map(r => {
                    let found = r.Locations.find(l => l.LocationName === loc);
                    return found ? found.Collected : 0;
                }),
                backgroundColor: collectionsColors[i % collectionsColors.length],
                stack: "Collections"  // group all collections
            }));

            // Destroy old chart if exists
            if ($scope.chargesCollectionsChartInstance) {
                $scope.chargesCollectionsChartInstance.destroy();
            }

            let canvas = getOrCreateCanvas("chargesCollectionsChart", "chargesCollectionsCanvas");
            if (!canvas) return;

            let ctx = canvas.getContext("2d");
            $scope.chargesCollectionsChartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: months,
                    datasets: [...chargesDatasets, ...collectionsDatasets]
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let month = context.label;
                                    let datasetLabel = context.dataset.label;

                                    let isCharges = datasetLabel.endsWith("Charges");
                                    let loc = datasetLabel.replace(" Charges", "").replace(" Collections", "");

                                    let row = rows.find(r => r.Month === month);
                                    let locData = row.Locations.find(l => l.LocationName === loc);

                                    if (isCharges) {
                                        return loc + " - Charges: $" + (locData?.Charges || 0).toLocaleString();
                                    } else {
                                        return [
                                            loc + " - Collected: $" + (locData?.Collected || 0).toLocaleString(),
                                            "Net %: " + ((locData?.NetPercentage || 0).toFixed(2)) + "%"
                                        ];
                                    }
                                }
                            }
                        },
                        legend: { position: "top" }
                    },
                    scales: {
                        x: { stacked: true },   // allow grouping
                        y: { stacked: true, beginAtZero: true }  // stack inside Charges & Collections groups
                    }
                }
            });
        };
        function getOrCreateCanvasLine(containerId, canvasId) {
            let container = document.getElementById(containerId);
            if (!container) return null;

            let canvas = document.getElementById(canvasId);
            if (!canvas) {
                canvas = document.createElement("canvas");
                canvas.id = canvasId;
                container.innerHTML = "";
                container.appendChild(canvas);
            }
            return canvas;
        }
        function getOrCreateCanvasLinePayerCharge(containerId) {
            let container = document.getElementById(containerId);
            if (!container) return null;

            // wipe old chart and canvas
            container.innerHTML = "";

            let canvas = document.createElement("canvas");
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            container.appendChild(canvas);

            return canvas;
        }

        function getOrCreateCanvasLinePayerCollection(containerId) {
            let container = document.getElementById(containerId);
            if (!container) return null;

            container.innerHTML = "";

            let canvas = document.createElement("canvas");
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            container.appendChild(canvas);

            return canvas;
        }


        $scope.chargesCollectionsLineInstance = null;

        $scope.renderRevenueNetPercentLineChart = function () {
            let rows = $scope.AllTotalCharges || [];
            if (!rows.length) return;

            let months = rows.map(r => r.Month);
            let locationNames = [...new Set(rows.flatMap(r => r.Locations.map(l => l.LocationName)))];

            let netColors = ["#4e73df", "#1cc88a", "#e74a3b", "#f6c23e"];

            // Net % datasets per location
            let netDatasets = locationNames.map((loc, i) => ({
                label: loc + " Net %",
                data: rows.map(r => {
                    let found = r.Locations.find(l => l.LocationName === loc);
                    if (!found || !found.Charges) return 0;
                    return (found.Collected / found.Charges * 100).toFixed(2);  // Net % calculation
                }),
                borderColor: netColors[i % netColors.length],
                borderWidth: 2,
                fill: false,
                tension: 0.3
            }));

            if ($scope.chargesCollectionsLineInstance) {
                $scope.chargesCollectionsLineInstance.destroy();
            }

            let canvas = getOrCreateCanvasLine("chargesCollectionsLine", "chargesCollectionsCanvasLine");
            if (!canvas) return;

            let ctx = canvas.getContext("2d");
            $scope.chargesCollectionsLineInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: months,
                    datasets: netDatasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let month = context.label;
                                    let datasetLabel = context.dataset.label;
                                    let loc = datasetLabel.replace(" Net %", "");

                                    let row = rows.find(r => r.Month === month);
                                    let locData = row.Locations.find(l => l.LocationName === loc);

                                    let charges = locData?.Charges || 0;
                                    let collected = locData?.Collected || 0;
                                    let netPercent = charges ? (collected / charges * 100).toFixed(2) : 0;

                                    return [
                                        loc + " - Net %: " + netPercent + "%",
                                        "Charges: $" + charges.toLocaleString(),
                                        "Collected: $" + collected.toLocaleString()
                                    ];
                                }
                            }
                        },
                        legend: { position: "top" }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,  // Net % goes 0-100
                            ticks: { callback: value => value + "%" }
                        }
                    }
                }
            });
        };
        $scope.grossNetStackedChartInstance = null;
        $scope.renderGrossNetStackedChart = function () {
            let rows = $scope.AllTotalCharges || [];
            if (!rows.length) return;

            let months = rows.map(r => r.Month);
            let locationNames = [...new Set(rows.flatMap(r => r.Locations.map(l => l.LocationName)))];

            let locationColors = ["#4e73df", "#1cc88a", "#e74a3b", "#f6c23e"];

            let datasets = [];
            locationNames.forEach((loc, i) => {
                let color = locationColors[i % locationColors.length];

                datasets.push({
                    label: loc + " Gross",
                    data: rows.map(r => {
                        let found = r.Locations.find(l => l.LocationName === loc);
                        return found ? found.Charges : 0;
                    }),
                    backgroundColor: color,
                    stack: loc  
                });

                datasets.push({
                    label: loc + " Net",
                    data: rows.map(r => {
                        let found = r.Locations.find(l => l.LocationName === loc);
                        /*return found ? found.Collected : 0;*/
                        return found ? found.Charges - ((found.AdjustmentAmount || 0) + (found.WriteOffAmount || 0)) : 0;
                    }),
                    backgroundColor: shadeColor(color, -30), 
                    stack: loc  
                });
            });

            if ($scope.grossNetStackedChartInstance) {
                $scope.grossNetStackedChartInstance.destroy();
            }

            let canvas = getOrCreateCanvas("grossNetStackedChart", "grossNetStackedCanvas");
            if (!canvas) return;

            let ctx = canvas.getContext("2d");
            $scope.grossNetStackedChartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: months,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let labelParts = context.dataset.label.split(" ");
                                    let type = labelParts.pop();               
                                    let loc = labelParts.join(" ");           
                                    return loc + " " + type + ": $" + context.raw.toLocaleString();
                                }
                            }
                        },
                        legend: { position: "top" }
                    },
                    scales: {
                        x: { stacked: false }, 
                        y: { stacked: true, beginAtZero: true } 
                    }
                }
            });
        };

        // Helper to darken color for Net
        function shadeColor(color, percent) {
            let f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent;
            let R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
            return "#" + (0x1000000 + (Math.round((t - R) * p / 100) + R) * 0x10000 + (Math.round((t - G) * p / 100) + G) * 0x100 + (Math.round((t - B) * p / 100) + B)).toString(16).slice(1);
        }

        let AdjustmentschartInstance = null;

        $scope.renderLocationAdjustmentsChart = function () {
            var container = document.getElementById("LocationAdjustments");
            if (!container) return;

            let allLocations = [];
            ($scope.AllTotalCharges || []).forEach(month => {
                (month.Locations || []).forEach(loc => {
                    let locName = loc.LocationName && loc.LocationName.trim() !== "" ? loc.LocationName : "Unknown";
                    if (!allLocations.includes(locName)) {
                        allLocations.push(locName);
                    }
                });
            });

            // Build chart data per month
            var chartData = ($scope.AllTotalCharges || []).map(function (month) {
                let row = { month: month.Month };
                allLocations.forEach(locName => {
                    let found = month.Locations.find(l => (l.LocationName && l.LocationName.trim() !== "" ? l.LocationName : "Unknown") === locName);
                    row[locName + "_adjustments"] = found ? found.AdjustmentAmount : 0;
                    row[locName + "_writeOff"] = found ? found.WriteOffAmount : 0;
                });
                return row;
            });

            // Series dynamically for each location (Adjustments + WriteOff)
            let series = [];
            allLocations.forEach(locName => {
                series.push({
                    type: "bar",
                    xKey: "month",
                    yKey: locName + "_adjustments",
                    yName: locName + " - Adjustments",
                    stacked: false,
                    fill: "#f5a623"
                });
                series.push({
                    type: "bar",
                    xKey: "month",
                    yKey: locName + "_writeOff",
                    yName: locName + " - Write Off",
                    stacked: false,
                    fill: "#ff4d4f"
                });
            });

            var adjustmentoptions = {
                container: container,
                data: chartData,
                series: series,
                axes: [
                    { type: "category", position: "bottom", title: { text: "Month" } },
                    { type: "number", position: "left", title: { text: "Amount" } }
                ],
                legend: { position: 'bottom' },
                tooltip: {
                    renderer: (params) => {
                        return {
                            content: `${params.yName}: $${(params.datum[params.yKey] || 0).toLocaleString()}`
                        };
                    }
                }
            };

            if (AdjustmentschartInstance) AdjustmentschartInstance.destroy();
            AdjustmentschartInstance = agCharts.AgCharts.create(adjustmentoptions);
        };

        $scope.GetDashboardOperationlProvidersChargesCollections = function () {
            $scope.TotalsProvidersChargesCollections = [];


            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
            }

            eHnoteInsuranceService.GetDashboardOperationlProvidersCharges(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalsProvidersChargesCollections = resp.data.rows || [];

                    if ($scope.TotalsProvidersChargesCollections.length > 0) {
                        angular.forEach($scope.TotalsProvidersChargesCollections, function (item) {
                            item.TotalProviderCharges = 0;
                            item.TotalProviderCollected = 0;
                            item.TotalProviderNetPercentage = 0;
                            angular.forEach(item.Locations, function (litem) {
                                item.TotalProviderCharges += litem.Charges || 0;
                                item.TotalProviderCollected += litem.Collected || 0;
                                item.TotalProviderNetPercentage += litem.NetPercentage || 0;
                            })
                        });
                    }


                    $timeout($scope.renderProviderChargesCollectionsChart, 0);
                }

            }, function (err) { console.log(err); });
        };

        let ProviderChargesChartInstance = null;
        $scope.renderProviderChargesCollectionsChart = function () {
            var container = document.getElementById("ProviderChargesvsCollections");
            if (!container) return;

            // Build chart data with sums
            var chartData = ($scope.TotalsProvidersChargesCollections || []).map(function (prov) {
                let totalCharges = 0, totalCollected = 0;

                (prov.Locations || []).forEach(loc => {
                    totalCharges += loc.Charges || 0;
                    totalCollected += loc.Collected || 0;
                });

                return {
                    Provider: prov.RenderingProvider,
                    Charges: totalCharges,
                    Collections: totalCollected,
                    Locations: prov.Locations // keep for tooltip
                };
            });

            var chartOptions = {
                container: container,
                data: chartData,
                series: [
                    {
                        type: "bar",
                        xKey: "Provider",
                        yKey: "Charges",
                        yName: "Charges",
                        fill: "#4a90e2"
                    },
                    {
                        type: "bar",
                        xKey: "Provider",
                        yKey: "Collections",
                        yName: "Collections",
                        fill: "#7ed321"
                    }
                ],
                axes: [
                    { type: "category", position: "bottom" },
                    { type: "number", position: "left", title: { text: "Amount ($)" } }
                ],
                legend: { position: 'bottom' },
                tooltip: {
                    renderer: (params) => {
                        if (!params.datum) return;
                        let provider = params.datum.Provider;
                        let locations = params.datum.Locations || [];

                        let breakdown = locations.map(loc =>
                            `${loc.LocationName || "Unknown"}: $${(params.yKey === "Charges" ? loc.Charges : loc.Collected).toLocaleString()}`
                        ).join("<br/>");

                        return {
                            title: provider,
                            content: `<b>${params.yName}:</b> $${params.datum[params.yKey].toLocaleString()}<br/><hr/>${breakdown}`
                        };
                    }
                }
            };

            if (ProviderChargesChartInstance && ProviderChargesChartInstance.destroy) {
                ProviderChargesChartInstance.destroy();
            }

            ProviderChargesChartInstance = agCharts.AgCharts.create(chartOptions);
        };
        $scope.GetDashboardOperationlProceduresCharges = function () {
            $scope.TotalsProceduresCharges = [];


            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
            }

            eHnoteInsuranceService.GetDashboardOperationlProceduresCharges(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalsProceduresCharges = resp.data.rows || [];
                    ($scope.TotalsProceduresCharges || []).forEach(function (payer) {
                        payer.TotalCharges = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.Charges) || 0);
                        }, 0);
                        payer.TotalCount = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.ServiceCount) || 0);
                        }, 0);
                        (payer.Locations || []).forEach(function (loc) {
                            if (payer.TotalCharges > 0) {
                                loc.ChargePercentage = payer.TotalCollections > 0 ?((loc.Charges / payer.TotalCharges) * 100).toFixed(2):0;
                            } else {
                                loc.ChargePercentage = 0;
                            }
                        });
                    });
                    console.log($scope.TotalsProceduresCharges);
                    $timeout($scope.renderProceduresChargesChart, 0);
                }

            }, function (err) { console.log(err); });
        };
        $scope.GetDashboardOperationlProceduresCollections = function () {
            $scope.TotalsProceduresCollections = [];


            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //  .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
            }

            eHnoteInsuranceService.GetDashboardOperationlProceduresCollections(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalsProceduresCollections = resp.data.rows || [];
                    ($scope.TotalsProceduresCollections || []).forEach(function (payer) {
                        payer.TotalCollectedPercentage = 0;
                        payer.TotalCharges = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.Charges) || 0);
                        }, 0);
                        payer.TotalCollections = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.Collected) || 0);
                        }, 0);
                        (payer.Locations || []).forEach(function (loc) {
                            if (payer.TotalCollections > 0) {
                                loc.CollectedPercentage = payer.TotalCollections > 0 ? ((loc.Collected / payer.TotalCollections) * 100).toFixed(2):0;
                                payer.TotalCollectedPercentage += parseFloat(loc.CollectedPercentage);
                            } else {
                                loc.CollectedPercentage = 0;
                                payer.TotalCollectedPercentage += parseFloat(loc.CollectedPercentage);
                            }
                        });
                    });
                    console.log($scope.TotalsProceduresCollections);
                    $timeout($scope.renderProceduresCollectionsChart, 0);
                }

            }, function (err) { console.log(err); });
        };

        let ProceduresChargesChartInstance = null;

        $scope.renderProceduresChargesChart = function () {
            var container = document.getElementById("ProceduresCharges");
            if (!container) return;

            let allLocations = [];
            ($scope.TotalsProceduresCharges || []).forEach(payer => {
                (payer.Locations || []).forEach(loc => {
                    if (!allLocations.includes(loc.LocationName)) {
                        allLocations.push(loc.LocationName);
                    }
                });
            });

            var chartData = ($scope.TotalsProceduresCharges || []).map(function (payer) {
                let row = { payor: payer.CPTCode };
                allLocations.forEach(locName => {
                    let found = payer.Locations.find(l => l.LocationName === locName);
                    row[locName] = found ? found.Charges : 0;
                });
                return row;
            });

            let series = allLocations.map(locName => {
                return {
                    type: "bar",
                    xKey: "payor",
                    yKey: locName,
                    yName: locName,
                    stacked: true
                };
            });

            var chartOptions = {
                container: container,
                width: 'auto',
                height: 'auto',
                data: chartData,
                series: series,
                axes: [
                    { type: "category", position: "bottom" },
                    { type: "number", position: "left", title: { text: "Amount ($)" } }
                ],
                legend: { position: 'bottom' },
                tooltip: {
                    renderer: (params) => {
                        return {
                            content: `${params.yName}: $${params.datum[params.yKey]}`

                        };
                    }
                }
            };

            if (ProceduresChargesChartInstance && ProceduresChargesChartInstance.destroy) {
                ProceduresChargesChartInstance.destroy();
            }


            ProceduresChargesChartInstance = agCharts.AgCharts.create(chartOptions);

        };


        let ProceduresCollectionsChartInstance = null;
        $scope.renderProceduresCollectionsChart = function () {
            var container = document.getElementById("ProceduresCollections");
            if (!container) return;

            let allLocations = [];
            ($scope.TotalsProceduresCollections || []).forEach(payer => {
                (payer.Locations || []).forEach(loc => {
                    if (!allLocations.includes(loc.LocationName)) {
                        allLocations.push(loc.LocationName);
                    }
                });
            });

            var chartData = ($scope.TotalsProceduresCollections || []).map(function (payer) {
                let row = { payor: payer.CPTCode };
                allLocations.forEach(locName => {
                    let found = payer.Locations.find(l => l.LocationName === locName);
                    row[locName] = found ? found.Collected : 0;
                });
                return row;
            });

            let series = allLocations.map(locName => {
                return {
                    type: "bar",
                    xKey: "payor",
                    yKey: locName,
                    yName: locName,
                    stacked: true
                };
            });

            var chartOptions = {
                container: container,
                width: 'auto',
                height: 'auto',
                data: chartData,
                series: series,
                axes: [
                    { type: "category", position: "bottom" },
                    { type: "number", position: "left", title: { text: "Amount ($)" } }
                ],
                legend: { position: 'bottom' },
                tooltip: {
                    renderer: (params) => {
                        return {
                            content: `${params.yName}: $${params.datum[params.yKey]}`
                        };
                    }
                }
            };

            if (ProceduresCollectionsChartInstance && ProceduresCollectionsChartInstance.destroy) {
                ProceduresCollectionsChartInstance.destroy();
            }
            ProceduresCollectionsChartInstance = agCharts.AgCharts.create(chartOptions);

        };

       
        $scope.GetDashboardOperationlCategoryWiseCPTCollections = function () {
            $scope.TotalsServiceWiseCollections = [];


            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
            }

            eHnoteInsuranceService.GetDashboardOperationlCategoryWiseCPTCollections(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalsServiceWiseCollections = resp.data.rows || [];
                    ($scope.TotalsServiceWiseCollections || []).forEach(function (payer) {
                        payer.TotalCollectedPercentage = 0;
                        payer.TotalCollections = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.Collected) || 0);
                        }, 0);
                        (payer.Locations || []).forEach(function (loc) {
                            if (payer.TotalCollections > 0) {
                                loc.CollectedPercentage = payer.TotalCollections>0? ((loc.Collected / payer.TotalCollections) * 100).toFixed(2):0;
                                payer.TotalCollectedPercentage += parseFloat(loc.CollectedPercentage);
                            } else {
                                loc.CollectedPercentage = 0;
                                payer.TotalCollectedPercentage += parseFloat(loc.CollectedPercentage);
                            }
                        });
                    });
                    console.log($scope.TotalsServiceWiseCollections);
                    $timeout($scope.renderServiceWiseCollectionsChart, 0);
                }

            }, function (err) { console.log(err); });
        };
        let ServiceWiseCollectionsChartInstance = null;
        $scope.renderServiceWiseCollectionsChart = function () {
            var container = document.getElementById("ServiceWiseCollections");
            if (!container) return;

            let allLocations = [];
            ($scope.TotalsServiceWiseCollections || []).forEach(payer => {
                (payer.Locations || []).forEach(loc => {
                    if (!allLocations.includes(loc.LocationName)) {
                        allLocations.push(loc.LocationName);
                    }
                });
            });

            var chartData = ($scope.TotalsServiceWiseCollections || []).map(function (payer) {
                let row = { payor: payer.ServicesTypeName };
                allLocations.forEach(locName => {
                    let found = payer.Locations.find(l => l.LocationName === locName);
                    row[locName] = found ? found.Collected : 0;
                });
                return row;
            });

            let series = allLocations.map(locName => {
                return {
                    type: "bar",
                    xKey: "payor",
                    yKey: locName,
                    yName: locName,
                    stacked: true
                };
            });

            var chartOptions = {
                container: container,
                width: 'auto',
                height: 'auto',
                data: chartData,
                series: series,
                axes: [
                    { type: "category", position: "bottom" },
                    { type: "number", position: "left", title: { text: "Amount ($)" } }
                ],
                legend: { position: 'bottom' },
                tooltip: {
                    renderer: (params) => {
                        return {
                            content: `${params.yName}: $${params.datum[params.yKey]}`
                        };
                    }
                }
            };

            if (ServiceWiseCollectionsChartInstance && ServiceWiseCollectionsChartInstance.destroy) {
                ServiceWiseCollectionsChartInstance.destroy();
            }
            ServiceWiseCollectionsChartInstance = agCharts.AgCharts.create(chartOptions);

        };
        $scope.GetDashboardAggregateRevenuePatientVsInsurancePayments = function () {
            $scope.TotalPatientInsurancePayments = [];


            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year":"2025"
            }

            eHnoteInsuranceService.GetDashboardAggregateRevenuePatientVsInsurancePayments(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalPatientInsurancePayments = resp.data.rows || [];
                    angular.forEach($scope.TotalPatientInsurancePayments, function (item) {
                        item.TotalInsPayment = 0;
                        item.TotalPatPayment = 0;
                        item.PatResponsbility = 0;
                        item.responsibilityRate = 0;
                        angular.forEach(item.Locations, function (loc) {
                            item.TotalInsPayment += loc.InsurancePaymentAmount || 0;
                            item.TotalPatPayment += loc.PatientPaymentAmount || 0;
                            item.PatResponsbility += loc.PatientResponsbilityAmount || 0;
                            loc.collectionrate = loc.PatientResponsbilityAmount>0?(loc.PatientPaymentAmount / loc.PatientResponsbilityAmount) * 100 : 0;
                            item.responsibilityRate = item.PatResponsbility > 0 ? (item.TotalPatPayment / item.PatResponsbility) * 100 : 0;
                        });

                    });
                    console.log($scope.TotalPatientInsurancePayments);
                    $timeout($scope.renderPatInsPaymentsChart, 0);
                    $timeout($scope.renderPatientCollectionsNetChart, 0);
                    
                }

            }, function (err) { console.log(err); });
        };

        let PaymentsChartInstance = null;

        $scope.renderPatInsPaymentsChart = function () {
            var container = document.getElementById("PatInssurancePayments");
            if (!container) return;

            // Build chartData
            var chartData = ($scope.TotalPatientInsurancePayments || []).map(function (month) {
                let totalInsurance = 0, totalPatient = 0;

                (month.Locations || []).forEach(loc => {
                    totalInsurance += loc.InsurancePaymentAmount || 0;
                    totalPatient += loc.PatientPaymentAmount || 0;
                });

                return {
                    month: month.Month,
                    Insurance: totalInsurance,
                    Patient: totalPatient,
                    Total: totalInsurance + totalPatient
                };
            });

            let series = [
                {
                    type: "bar",
                    xKey: "month",
                    yKey: "Insurance",
                    yName: "Insurance Payments",
                    fill: "#4a90e2"
                },
                {
                    type: "bar",
                    xKey: "month",
                    yKey: "Patient",
                    yName: "Self-Pay",
                    fill: "#7ed321"
                }
            ];

            var chartOptions = {
                container: container,
                data: chartData,
                series: series,
                axes: [
                    { type: "category", position: "bottom", title: { text: "Month" } },
                    { type: "number", position: "left", title: { text: "Payments ($)" } }
                ],
                legend: { position: "bottom" },
                tooltip: {
                    renderer: (params) => {
                        let data = params.datum;
                        let insurance = data.Insurance || 0;
                        let patient = data.Patient || 0;
                        let total = data.Total || 0;

                        let insurancePct = total > 0 ? ((insurance / total) * 100).toFixed(1) : 0;
                        let patientPct = total > 0 ? ((patient / total) * 100).toFixed(1) : 0;

                        return {
                            title: `${data.month}`,
                            content: `
                        <b>Total:</b> $${total.toLocaleString()}<br/>
                        Insurance: $${insurance.toLocaleString()} (${insurancePct}%)<br/>
                        Self: $${patient.toLocaleString()} (${patientPct}%)
                    `
                        };
                    }
                }
            };

            if (PaymentsChartInstance && PaymentsChartInstance.destroy) {
                PaymentsChartInstance.destroy();
            }
            PaymentsChartInstance = agCharts.AgCharts.create(chartOptions);
        };
        let PatientCollectionsChartInstance = null;

        $scope.renderPatientCollectionsNetChart = function () {
            var container = document.getElementById("PatientPaymentsPecentage");
            if (!container) return;

            // Build flat data: Month + Location values
            let chartData = [];
            ($scope.TotalPatientInsurancePayments || []).forEach(month => {
                (month.Locations || []).forEach(loc => {
                    const responsibility = loc.PatientResponsbilityAmount ?? loc.PatientResponsibilityAmount ?? 0;
                    const collected = loc.PatientPaymentAmount || 0;
                    const percent = responsibility > 0 ? (collected / responsibility) * 100 : 0;

                    chartData.push({
                        month: month.Month,
                        location: loc.LocationName,
                        responsibility,
                        collected,
                        percent
                    });
                });
            });

            // Unique locations → 1 line per location
            const uniqueLocations = [...new Set(chartData.map(d => d.location))];

            // Color palette (expand as needed)
            const colors = ["#4a90e2", "#50e3c2", "#f5a623", "#e94e77", "#7b8d8e", "#b8e986", "#9013fe", "#417505"];

            var chartOptions = {
                container: container,
                data: chartData,
                series: uniqueLocations.map((loc, idx) => ({
                    type: "line",
                    xKey: "month",
                    yKey: "percent",
                    yName: loc, // legend label
                    data: chartData.filter(d => d.location === loc), // one line per location
                    stroke: colors[idx % colors.length],
                    marker: { enabled: true, size: 6, fill: colors[idx % colors.length] }
                })),
                axes: [
                    { type: "category", position: "bottom", title: { text: "Month" } },
                    { type: "number", position: "left", title: { text: "Collections %" }, min: 0, max: 100 }
                ],
                legend: { enabled: true },
                tooltip: {
                    renderer: (params) => {
                        const d = params.datum;
                        return {
                            title: `${d.month} - ${d.location}`,
                            content: `
                        Responsibility: $${d.responsibility.toLocaleString()}<br/>
                        Collected: $${d.collected.toLocaleString()} (${d.percent.toFixed(0)}%)
                    `
                        };
                    }
                }
            };

            if (PatientCollectionsChartInstance && PatientCollectionsChartInstance.destroy) {
                PatientCollectionsChartInstance.destroy();
            }
            PatientCollectionsChartInstance = agCharts.AgCharts.create(chartOptions);
        };


        $scope.GetDashboardAggregateRevenuePatientBalancesBuckets = function () {
            $scope.TotalOutstandingPatientBalances = [];

            $scope.TotalPatientARAgingBlns = {
                "TotalzerotoThirty": 0,
                "TotalThirtytoSixty": 0,
                "TotalSixtytoNinety": 0,
                "TotalNinetytoOnehundredtwenty": 0,
                "TotalMorethanOnehundredtwenty": 0,
                "TotalARAmountBalance": 0,
                "TotalARChargeAmount": 0



            };
            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": "2025"
            }

            eHnoteInsuranceService.GetDashboardAggregateRevenuePatientBalancesBuckets(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalOutstandingPatientBalances = resp.data.rows || [];
                    angular.forEach($scope.TotalOutstandingPatientBalances, function (item) {
                        item.TotalARBalanceAmount = 0;
                        item.TotalARBalanceAmount += item.zerotoThirty
                                                    + item.ThirtytoSixty
                                                    + item.SixtytoNinety
                                                    + item.NinetytoOnehundredtwenty
                            + item.MorethanOnehundredtwenty;
                        $scope.TotalPatientARAgingBlns.TotalzerotoThirty += item.zerotoThirty;
                        $scope.TotalPatientARAgingBlns.TotalThirtytoSixty += item.ThirtytoSixty;
                        $scope.TotalPatientARAgingBlns.TotalSixtytoNinety += item.SixtytoNinety;
                        $scope.TotalPatientARAgingBlns.TotalNinetytoOnehundredtwenty += item.NinetytoOnehundredtwenty;
                        $scope.TotalPatientARAgingBlns.TotalMorethanOnehundredtwenty += item.MorethanOnehundredtwenty;
                        $scope.TotalPatientARAgingBlns.TotalARAmountBalance += item.TotalARBalanceAmount;
                        
                    });
                    console.log($scope.TotalOutstandingPatientBalances);
                    $timeout($scope.renderOutstandingPatientBalances, 0);

                }

            }, function (err) { console.log(err); });
        };
        let OutstandingChartInstance = null;

        $scope.renderOutstandingPatientBalances = function () {
            var container = document.getElementById("OutstandingPatientBalances");
            if (!container) return;

          
            let chartData = ($scope.TotalOutstandingPatientBalances || []).map(loc => {
                return {
                    location: loc.LocationName,
                    zerotoThirty: loc.zerotoThirty || 0,
                    ThirtytoSixty: loc.ThirtytoSixty || 0,
                    SixtytoNinety: loc.SixtytoNinety || 0,
                    NinetytoOnehundredtwenty: loc.NinetytoOnehundredtwenty || 0,
                    MorethanOnehundredtwenty: loc.MorethanOnehundredtwenty || 0
                };
            });

            // Chart options
            var options = {
                container: container,
                data: chartData,
                series: [
                    { type: "bar", xKey: "location", yKey: "zerotoThirty", yName: "0–30 Days", stacked: true, fill: "#f7b500" },
                    { type: "bar", xKey: "location", yKey: "ThirtytoSixty", yName: "31–60 Days", stacked: true, fill: "#1890ff" },
                    { type: "bar", xKey: "location", yKey: "SixtytoNinety", yName: "61–90 Days", stacked: true, fill: "#52c41a" },
                    { type: "bar", xKey: "location", yKey: "NinetytoOnehundredtwenty", yName: "91–120 Days", stacked: true, fill: "#722ed1" },
                    { type: "bar", xKey: "location", yKey: "MorethanOnehundredtwenty", yName: ">120 Days", stacked: true, fill: "#fa541c" }
                ],
                axes: [
                    { type: "category", position: "bottom", title: { text: "Location" } },
                    { type: "number", position: "left", title: { text: "Balance ($)" } }
                ],
                legend: { position: "top" },
                tooltip: {
                    renderer: (params) => {
                        return {
                            content: `${params.xValue}<br/>${params.yName}: $${(params.yValue || 0).toLocaleString()}`
                        };
                    }
                }
            };

            if (OutstandingChartInstance) OutstandingChartInstance.destroy();
            OutstandingChartInstance = agCharts.AgCharts.create(options);
        };
        $scope.GetDashboardAggregateAvearageChargePerEncounters = function () {
            $scope.TotalChargesPerEncounters = [];


            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": "2025"
            }

            eHnoteInsuranceService.GetDashboardAggregateAvearageChargePerEncounters(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalChargesPerEncounters = resp.data.rows || [];
                    angular.forEach($scope.TotalChargesPerEncounters, function (item) {
                        item.TotalsEncounters = 0;
                        item.TotalsCharges = 0;
                        item.TotalAvgChargeEncounter = 0;
                        angular.forEach(item.Locations, function (loc) {

                            item.TotalsEncounters += loc.TotalEncounters || 0;
                            item.TotalsCharges += loc.TotalCharges || 0;
                            item.TotalAvgChargeEncounter += loc.AverageChargePerEncounter || 0;

                           
                        });
                    });
                    console.log($scope.TotalChargesPerEncounters);
                    $timeout($scope.renderEncounterAvgChargeTrend, 0);

                }

            }, function (err) { console.log(err); });
        };
        let AvgChargeChartInstance = null;

        $scope.renderEncounterAvgChargeTrend = function () {
            const container = document.getElementById("EncounterAvgChargeTrend");
            if (!container) return;

            const rows = $scope.TotalChargesPerEncounters || [];

            const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const toShortMonth = (m) => {
                const map = {
                    January: "Jan", February: "Feb", March: "Mar", April: "Apr", May: "May", June: "Jun",
                    July: "Jul", August: "Aug", September: "Sep", October: "Oct", November: "Nov", December: "Dec",
                    Jan: "Jan", Feb: "Feb", Mar: "Mar", Apr: "Apr", Jun: "Jun", Jul: "Jul", Aug: "Aug", Sep: "Sep",
                    Oct: "Oct", Nov: "Nov", Dec: "Dec"
                };
                return map[m] || m;
            };
            const monthIndex = (m) => monthOrder.indexOf(toShortMonth(m));

            const locationSet = new Set();
            const monthMap = new Map();

            rows.forEach(r => {
                const mLabel = toShortMonth(r.Month);
                if (!monthMap.has(mLabel)) monthMap.set(mLabel, { month: mLabel });

                (r.Locations || []).forEach(loc => {
                    const name = loc.LocationName;
                    locationSet.add(name);
                    monthMap.get(mLabel)[name] = Number(loc.AverageChargePerEncounter) || 0;
                });
            });

            const data = Array.from(monthMap.values())
                .sort((a, b) => monthIndex(a.month) - monthIndex(b.month));

            const locations = Array.from(locationSet);

            const options = {
                container,
                data,
                series: locations.map(name => ({
                    type: "line",
                    xKey: "month",
                    yKey: name,
                    yName: name,
                    marker: { enabled: true, size: 5 }
                })),
                axes: [
                    { type: "category", position: "bottom", title: { text: "Month" } },
                    { type: "number", position: "left", title: { text: "Average Charge ($)" } }
                ],
                legend: { position: "top" },
                tooltip: {
                    renderer: (p) => {
                        const val = p.yValue == null ? 0 : p.yValue;
                        return { content: `${p.datum.month}<br/>${p.series.yName}: $${val.toFixed(2)}` };
                    }
                }
            };

            if (AvgChargeChartInstance) AvgChargeChartInstance.destroy();
            AvgChargeChartInstance = agCharts.AgCharts.create(options);
        };


        $scope.OpenExpandView = function (Id) {

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "expandedTableView.html",
                /*"size": "md",*/
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "resolve": {
                    Id: function () {
                        return Id;
                    }
                },
                "windowClass": "modal__popup--right modal__width--70",/*modal__ninety--*/
                "controller": function ($scope, $uibModal, $uibModalInstance, Id) {

                    $scope.TableViewforRevenueTab = Id || 1;
                    $scope.TabId = Id || 1;

                    $scope.ChangeTableViewforRevenue = function (id) {
                        $scope.TableViewforRevenueTab = id;
                        $scope.TabId = id;
                    }
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
        $scope.GetDashboardAggregateClaimsSubmitedAcceptedMonthWise = function () {
            $scope.TotalSubmitedAcceptedClaims = [];
            $scope.ClaimsTotalValues = {
                "TotalClaims": 0,
                "TotalSubmittedClaims":0,
                "TotalAcceptedClaims": 0,
                "TotalDenialsClaims": 0,
                "TotalReSubmittedClaims": 0
            }

            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": "2025"
            }

            eHnoteInsuranceService.GetDashboardAggregateClaimsSubmitedAcceptedMonthWise(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalSubmitedAcceptedClaims = resp.data.rows || [];

                    angular.forEach($scope.TotalSubmitedAcceptedClaims, function (item) {
                        $scope.ClaimsTotalValues.TotalSubmittedClaims += item.SubmittedClaims;
                        $scope.ClaimsTotalValues.TotalAcceptedClaims += item.AcceptedClaims;
                        $scope.ClaimsTotalValues.TotalDenialsClaims += item.DenielClaims;
                        $scope.ClaimsTotalValues.TotalReSubmittedClaims += item.ResubmittedClaims;

                        item.AcceptedPecentage = item.SubmittedClaims > 0 ? (item.AcceptedClaims / item.SubmittedClaims) * 100 : 0;
                        item.ResubmittedPecentage = item.SubmittedClaims > 0 ? (item.ResubmittedClaims / item.SubmittedClaims) * 100 : 0;

                    });

                    console.log($scope.TotalSubmitedAcceptedClaims);
                    $timeout($scope.renderSubmittedAcceptedChart, 0);
                    $timeout($scope.renderDenialRateChart, 0);
                    $timeout($scope.renderResubmissionChart, 0);
                   

                }

            }, function (err) { console.log(err); });
        };

       
        $scope.SubmittedAcceptedChartInstance = null;
        $scope.renderSubmittedAcceptedChart = function () {
            const container = document.getElementById("SubmittedAcceptedClaims");
            if (!container) return;

            const data = $scope.TotalSubmitedAcceptedClaims.map(r => ({
                location: r.LocationName,
                Submitted: Number(r.SubmittedClaims) || 0,
                Accepted: Number(r.AcceptedClaims) || 0
            }));

            const options = {
                container,
                data,
                series: [
                    {
                        type: "bar",    
                        xKey: "location",
                        yKey: "Submitted",
                        yName: "Submitted",
                        fill: "#36A2EB",
                        tooltip: {
                            renderer: (p) => {
                                const val = p.yValue == null ? 0 : p.yValue;
                                return { content: `${p.datum.location}<br/>Submitted: ${val}` };
                            }
                        }
                    },
                    {
                        type: "bar",    
                        xKey: "location",
                        yKey: "Accepted",
                        yName: "Accepted",
                        fill: "#4BC0C0",
                        tooltip: {
                            renderer: (p) => {
                                const val = p.yValue == null ? 0 : p.yValue;
                                return { content: `${p.datum.location}<br/>Accepted: ${val}` };
                            }
                        }
                    }
                ],
                axes: [
                    { type: "category", position: "bottom", title: { text: "Location" } },
                    { type: "number", position: "left", title: { text: "Number of Claims" } }
                ],
                legend: { position: "top" }
            };

            if ($scope.SubmittedAcceptedChartInstance) {
                $scope.SubmittedAcceptedChartInstance.destroy();
            }
            $scope.SubmittedAcceptedChartInstance = agCharts.AgCharts.create(options);
        };

        $scope.DenialRateChartInstance = null;

        $scope.renderDenialRateChart = function () {
            const container = document.getElementById("DenialRateChart");
            if (!container) return;

            const data = $scope.TotalSubmitedAcceptedClaims.map(r => ({
                location: r.LocationName,
                DenialRate: r.SubmittedClaims > 0
                    ? (r.DenielClaims / r.SubmittedClaims) * 100
                    : 0
            }));

            const options = {
                container,
                data,
                series: [
                    {
                        type: "bar",
                        xKey: "location",
                        yKey: "DenialRate",
                        yName: "Denial Rate %",
                        fill: "orange",
                        tooltip: {
                            renderer: (p) => {
                                const val = p.yValue == null ? 0 : p.yValue;
                                return { content: `${p.datum.location}<br/>Denial Rate: ${val.toFixed(2)}%` };
                            }
                        }
                    }
                ],
                axes: [
                    { type: "category", position: "bottom", title: { text: "Location" } },
                    { type: "number", position: "left", title: { text: "Denial Rate (%)" } }
                ],
                legend: { enabled: false }
            };

            if ($scope.DenialRateChartInstance) {
                $scope.DenialRateChartInstance.destroy();
            }

            $scope.DenialRateChartInstance = agCharts.AgCharts.create(options);
        };

        $scope.ResubmissionChartInstance = null;

        $scope.renderResubmissionChart = function () {
            const container = document.getElementById("ResubmissionClaims");
            if (!container) return;

            const data = $scope.TotalSubmitedAcceptedClaims.map(r => ({
                location: r.LocationName,
                Resubmitted: Number(r.ResubmittedClaims) || 0
            }));

            const options = {
                container,
                data,
                series: [
                    {
                        type: "bar",
                        xKey: "location",
                        yKey: "Resubmitted",
                        yName: "Resubmitted Claims",
                        fill: "green"
                    }
                ],
                axes: [
                    { type: "category", position: "bottom", title: { text: "Location" } },
                    { type: "number", position: "left", title: { text: "Number of Resubmissions" } }
                ],
                legend: { enabled: false },
                tooltip: {
                    renderer: (p) => {
                        const val = p.yValue == null ? 0 : p.yValue;
                        return { content: `${p.datum.location}<br/>Resubmitted: ${val}` };
                    }
                }
            };

            if ($scope.ResubmissionChartInstance) {
                $scope.ResubmissionChartInstance.destroy();
            }
            $scope.ResubmissionChartInstance = agCharts.AgCharts.create(options);
        };

        $scope.totalARBlns = {
            "TotalARBalance": 0,
            "TotalAROutStandDays": 0,
            "TotalHighRiskAmount": 0,
            "TotalARCollectionRate": 0,

        };
        $scope.TotalARAgingBlns = {
            "TotalzerotoThirty": 0,
            "TotalThirtytoSixty": 0,
            "TotalSixtytoNinety": 0,
            "TotalNinetytoOnehundredtwenty": 0,
            "TotalMorethanOnehundredtwenty": 0,
            "TotalARAmountBalance": 0,
            "TotalARChargeAmount": 0

        };
        $scope.GetDashboardOperationlARBalanceByPayer = function () {
            $scope.TotalARBalanceByPayer = [];
            $scope.TotalARAgingBlns = {
                "TotalzerotoThirty": 0,
                "TotalThirtytoSixty": 0,
                "TotalSixtytoNinety": 0,
                "TotalNinetytoOnehundredtwenty": 0,
                "TotalMorethanOnehundredtwenty": 0,
                "TotalARAmountBalance": 0,
                "TotalARChargeAmount": 0
            };

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": "2025",
                "PageSize": 10,
                "PageNumber":1
            }
           
            eHnoteInsuranceService.GetDashboardOperationlARBalanceByPayer(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalARBalanceByPayer = resp.data.rows || [];
                    $scope.totalARBlns.TotalHighRiskAmount = 0;
                    ($scope.TotalARBalanceByPayer || []).map(payer => {
                        payer.totalzerotoThirty = 0;
                        payer.totalThirtytoSixty = 0;
                        payer.totalSixtytoNinety = 0;
                        payer.totalNinetytoOnehundredtwenty = 0;
                        payer.totalMorethanOnehundredtwenty = 0;
                        payer.TotalARAmount = 0;
                        payer.totalHighriskthanninetyplus = 0;
                        payer.TotalARCharges = 0;

                        (payer.Locations || []).forEach(loc => {
                            payer.TotalARCharges += loc.Charges;
                            payer.totalzerotoThirty += loc.zerotoThirty || 0;
                            payer.totalThirtytoSixty += loc.ThirtytoSixty || 0;
                            payer.totalSixtytoNinety += loc.SixtytoNinety || 0;
                            payer.totalNinetytoOnehundredtwenty += loc.NinetytoOnehundredtwenty || 0;
                            payer.totalMorethanOnehundredtwenty += loc.MorethanOnehundredtwenty || 0;
                            payer.totalHighriskthanninetyplus += (loc.NinetytoOnehundredtwenty || 0) + (loc.MorethanOnehundredtwenty || 0);
                            $scope.totalARBlns.TotalHighRiskAmount += (loc.NinetytoOnehundredtwenty || 0) + (loc.MorethanOnehundredtwenty || 0);

                        });

                        payer.TotalARAmount =
                            payer.totalzerotoThirty +
                            payer.totalThirtytoSixty +
                            payer.totalSixtytoNinety +
                            payer.totalNinetytoOnehundredtwenty +
                            payer.totalMorethanOnehundredtwenty;

                        $scope.TotalARAgingBlns.TotalzerotoThirty += payer.totalzerotoThirty;
                        $scope.TotalARAgingBlns.TotalThirtytoSixty += payer.totalThirtytoSixty;
                        $scope.TotalARAgingBlns.TotalSixtytoNinety += payer.totalSixtytoNinety;
                        $scope.TotalARAgingBlns.TotalNinetytoOnehundredtwenty += payer.totalNinetytoOnehundredtwenty;
                        $scope.TotalARAgingBlns.TotalMorethanOnehundredtwenty += payer.totalMorethanOnehundredtwenty;
                        $scope.TotalARAgingBlns.TotalARAmountBalance += payer.TotalARAmount;
                        $scope.TotalARAgingBlns.TotalARChargeAmount += payer.TotalARCharges;
                        
                        $scope.totalDays = ($scope.ARReportData.ToDate - $scope.ARReportData.FromDate).Days + 1;
                        $scope.avgDailyCharges = ($scope.totalDays > 0) ? $scope.TotalARAgingBlns.TotalARChargeAmount / $scope.totalDays : 0;
                        $scope.arDays = ($scope.avgDailyCharges > 0) ? $scope.TotalARAgingBlns.TotalARAmountBalance / $scope.avgDailyCharges : 0;
                        console.log($scope.arDays);
                        //$scope.totalARBlns.TotalHighRiskAmount += payer.totalHighriskthanninetyplus;

                        return {
                            payer: payer.PayorName,
                            total: payer.TotalARAmount
                        };
                    });
                   

                    console.log($scope.TotalARBalanceByPayer);
                    $timeout($scope.renderARBalanceByPayer, 0);
                    $timeout($scope.renderARAgingBuckets, 0);

                }

            }, function (err) { console.log(err); });
        };
        $scope.ARBalanceChartInstance = null;
        $scope.renderARBalanceByPayer = function () {
            var container = document.getElementById("ARBalanceByPayer");
            if (!container) return;

            let payerTotals = ($scope.TotalARBalanceByPayer || []).map(payer => {
                let total = 0;
                (payer.Locations || []).forEach(loc => {
                    total += (loc.zerotoThirty || 0) +
                        (loc.ThirtytoSixty || 0) +
                        (loc.SixtytoNinety || 0) +
                        (loc.NinetytoOnehundredtwenty || 0) +
                        (loc.MorethanOnehundredtwenty || 0);
                });
                return {
                    payer: payer.PayorName,
                    total: total
                };
            });
            $scope.totalARBlns.TotalARBalance = payerTotals.reduce((sum, p) => sum + p.total, 0);
            var options = {
                container: container,
                data: payerTotals,
                series: [
                    {
                        type: "bar",
                        xKey: "payer",
                        yKey: "total",
                        yName: "A/R Balance"

                    }
                ],
                axes: [
                    {
                        type: "category",
                        position: "bottom",
                        title: { text: "Payer" }
                    },
                    {
                        type: "number",
                        position: "left",
                        title: { text: "Amount ($)" }

                    }
                ],
                legend: { enabled: false },
                tooltip: {
                    renderer: params => {
                        return {
                            content: `${params.datum.payer}<br/>A/R Balance: $${params.datum.total.toLocaleString()}`
                        };
                    }
                }
            };

            if ($scope.ARBalanceChartInstance) $scope.ARBalanceChartInstance.destroy();
            $scope.ARBalanceChartInstance = agCharts.AgCharts.create(options);
        };
        $scope.ARAgingChartInstance = null;
        $scope.renderARAgingBuckets = function () {
            var container = document.getElementById("ARAgingBuckets");
            if (!container) return;

            let totals = {
                zerotoThirty: 0,
                ThirtytoSixty: 0,
                SixtytoNinety: 0,
                NinetytoOnehundredtwenty: 0,
                MorethanOnehundredtwenty: 0
            };

            ($scope.TotalARBalanceByPayer || []).forEach(payer => {
                (payer.Locations || []).forEach(loc => {
                    totals.zerotoThirty += loc.zerotoThirty || 0;
                    totals.ThirtytoSixty += loc.ThirtytoSixty || 0;
                    totals.SixtytoNinety += loc.SixtytoNinety || 0;
                    totals.NinetytoOnehundredtwenty += loc.NinetytoOnehundredtwenty || 0;
                    totals.MorethanOnehundredtwenty += loc.MorethanOnehundredtwenty || 0;
                });
            });

            let chartData = [
                { bucket: "0–30 days", amount: totals.zerotoThirty },
                { bucket: "31–60 days", amount: totals.ThirtytoSixty },
                { bucket: "61–90 days", amount: totals.SixtytoNinety },
                { bucket: "91–120 days", amount: totals.NinetytoOnehundredtwenty },
                { bucket: ">120 days", amount: totals.MorethanOnehundredtwenty }
            ];

            let grandTotal = chartData.reduce((sum, d) => sum + d.amount, 0);

            var options = {
                container: container,
                data: chartData,
                series: [
                    {
                        type: "donut",
                        angleKey: "amount",
                        calloutLabelKey: "bucket",
                        sectorLabelKey: "amount",
                        sectorLabel: {
                            formatter: params => {
                                let percent = ((params.datum.amount / grandTotal) * 100).toFixed(0);
                                return percent > 0 ? `${percent}%` : "";
                            },
                            color: "white",
                            fontWeight: "bold",
                            position: "inside"
                        },
                        calloutLabel: {
                            formatter: params => `${params.datum.bucket}`
                        },
                        tooltip: {
                            renderer: params => {
                                return {
                                    content: `${params.datum.bucket}<br/>$${params.datum.amount.toLocaleString()}`
                                };
                            }
                        }
                    }
                ],
                legend: { enabled: true }
            };

            if ($scope.ARAgingChartInstance) $scope.ARAgingChartInstance.destroy();
            $scope.ARAgingChartInstance = agCharts.AgCharts.create(options);

            $scope.ARAgingSummary = chartData.map(d => {
                return {
                    bucket: d.bucket,
                    amount: d.amount,
                    percent: ((d.amount / grandTotal) * 100).toFixed(0)
                };
            });
            $scope.ARAgingTotal = grandTotal;
        };

        $scope.GetDashboardOperationlARBalanceByMonthWise = function () {
            $scope.TotalARBalanceByMonthwise = [];

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": "2025",
                "PageSize": 10,
                "PageNumber":1
            }

            eHnoteInsuranceService.GetDashboardOperationlARBalanceByMonthWise(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalARBalanceByMonthwise = resp.data.rows || [];
                    ($scope.TotalARBalanceByMonthwise || []).forEach(row => {
                        $scope.TotalhighRiskBalance = 0;
                        (row.Locations || []).forEach(loc => {
                            $scope.TotalhighRiskBalance += (loc.NinetytoOnehundredtwenty || 0) + (loc.MorethanOnehundredtwenty || 0);
                        });
                    });
                    $timeout($scope.renderARHighRiskgreaterthan90Days, 0);

                }

            }, function (err) { console.log(err); });
        };
        $scope.ARAgingMonthwiseChartInstance = null;

        $scope.renderARHighRiskgreaterthan90Days = function () {
            var container = document.getElementById("ARHighRiskChart");
            if (!container) return;

            let chartData = [];

            ($scope.TotalARBalanceByMonthwise || []).forEach(row => {
                let highRisk = 0;

                (row.Locations || []).forEach(loc => {
                    highRisk += (loc.NinetytoOnehundredtwenty || 0) + (loc.MorethanOnehundredtwenty || 0);
                });

                chartData.push({
                    month: row.Month,
                    highRisk: highRisk
                });
            });

            const options = {
                container: container,
                autoSize: true,
                title: {
                    text: ""
                },
                data: chartData,
                series: [
                    {
                        type: "bar",
                        xKey: "month",
                        yKey: "highRisk",
                        yName: "High-Risk A/R",
                        fill: "#FF4560",
                        stroke: "#FF4560"
                    }
                ],
                axes: [
                    {
                        type: "category",
                        position: "bottom",
                        title: {
                            text: "Month"
                        }
                    },
                    {
                        type: "number",
                        position: "left",
                        title: {
                            text: "Amount ($)"
                        },
                        label: {
                            formatter: function (params) {
                                return "$" + params.value.toLocaleString();
                            }
                        }
                    }
                ]
            };

            if ($scope.ARAgingMonthwiseChartInstance) {
                $scope.ARAgingMonthwiseChartInstance.destroy();
            }

            $scope.ARAgingMonthwiseChartInstance = agCharts.AgCharts.create(options);
        };
        $scope.GetDashboardAverageEncounterchargeperPayers = function () {
            $scope.AverageEncounterchargeperPayers = [];

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": "2025"
            }

            eHnoteInsuranceService.GetDashboardAverageEncounterchargeperPayers(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.AverageEncounterchargeperPayers = resp.data.rows || [];
                    $scope.TotalAverageEncounters =  0;
                    $scope.TotalAverageCharges = 0;
                    angular.forEach($scope.AverageEncounterchargeperPayers, function (item) {
                        $scope.TotalAverageEncounters += item.TotalEncounters || 0;
                        $scope.TotalAverageCharges += item.TotalCharges || 0;
                    })

                    $timeout($scope.renderAverageEncounterChart, 0);

                }

            }, function (err) { console.log(err); });
        };


        function getOrCreateCanvasavgEncounter(containerId, canvasId) {
            let container = document.getElementById(containerId);
            if (!container) return null;

            let canvas = document.getElementById(canvasId);
            if (!canvas) {
                canvas = document.createElement("canvas");
                canvas.id = canvasId;
                container.innerHTML = "";
                container.appendChild(canvas);
            }
            return canvas;
        }
        $scope.avgEncounterChartInstance = null;
        $scope.renderAverageEncounterChart = function () {
            let rows = $scope.AverageEncounterchargeperPayers || [];
            if (!rows.length) return;

            let payors = rows.map(r => r.PayerName);

            let charges = rows.map(r => r.AverageChargePerEncounter);
            //let reimbursements = rows.map(r => r.AverageReimbursementPerEncounter || 0);

            if ($scope.avgEncounterChartInstance) {
                $scope.avgEncounterChartInstance.destroy();
            }

            let canvas = getOrCreateCanvasavgEncounter("AverageEncounterchargeperPayers", "avgEncounterCanvas");
            if (!canvas) return;

            let ctx = canvas.getContext("2d");
            $scope.avgEncounterChartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: payors,
                    datasets: [
                        {
                            label: "Avg Reimbursement / Encounter",
                            data: charges,
                            backgroundColor: "#4e73df"
                        }
                        //{
                        //    label: "Avg Reimbursement / Encounter",
                        //    data: reimbursements,
                        //    backgroundColor: "#1cc88a"
                        //}
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.dataset.label + ": $" + context.raw.toFixed(2);
                                }
                            }
                        },
                        legend: { position: "top" }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: "Amount ($)" }
                        }
                    }
                }
            });
        };
        $scope.GetDashboardAggregateDenialClaimsByPayers = function () {
            $scope.TotalDenialClaimsByPayers = [];

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": "2025"
            }

            eHnoteInsuranceService.GetDashboardAggregateDenialClaimsByPayers(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalDenialClaimsByPayers = resp.data.rows || [];

                    if ($scope.TotalDenialClaimsByPayers.length > 0) {
                        $scope.TotalDenielClaimsPercentage = 0;
                        $scope.TotalSubmittedClaims = 0;
                        $scope.TotalDenielClaims = 0;
                        angular.forEach($scope.TotalDenialClaimsByPayers, function (item) {
                            item.DenielClaimsPercentage = 0;
                            item.DenielClaimsPercentage = (item.DenielClaims / item.SubmittedClaims) * 100 || 0;

                            $scope.TotalSubmittedClaims += item.SubmittedClaims || 0;
                            $scope.TotalDenielClaims += item.DenielClaims || 0;

                            $scope.TotalDenielClaimsPercentage += item.DenielClaimsPercentage || 0;
                        })
                    }

                    $timeout($scope.PayerrenderDenialRateChart, 0);

                }

            }, function (err) { console.log(err); });
        };
        $scope.ClaimsDenialRateChartInstance = null;
        $scope.PayerrenderDenialRateChart = function () {
            var container = document.getElementById("PayerDenialRatesChart");
            if (!container) return;

           

          
            let chartData = $scope.TotalDenialClaimsByPayers.map(r => {
                let denialRate = r.SubmittedClaims > 0
                    ? (r.DenielClaims / r.SubmittedClaims) * 100
                    : 0;
                return {
                    payer: r.PayerName,
                    submitted: r.SubmittedClaims,
                    denied: r.DenielClaims,
                    denialRate: +denialRate.toFixed(1)  
                };
            });

          
            var chartOptions = {
                container: container,
                autoSize: true,
                data: chartData,
                series: [{
                    type: 'bar',
                    xKey: 'payer',
                    yKey: 'denialRate',
                    yName: 'Denial Rate %',
                    
                    tooltip: {
                        renderer: (params) => {
                            let d = params.datum;
                            return {
                                title: d.payer,
                                content: `
                            Claims Submitted: ${d.submitted}
                            \nClaims Denied: ${d.denied}
                            \nDenial Rate: ${d.denialRate}%`
                            };
                        }
                    }
                }],
                axes: [
                    { type: 'category', position: 'bottom', title: { text: 'Payer' } },
                    { type: 'number', position: 'left', title: { text: 'Denial Rate %' }, min: 0 }
                ],
                legend: { enabled: false }
            };

            if ($scope.ClaimsDenialRateChartInstance && $scope.ClaimsDenialRateChartInstance.destroy) {
                $scope.ClaimsDenialRateChartInstance.destroy();
            }

            $scope.ClaimsDenialRateChartInstance = agCharts.AgCharts.create(chartOptions);
        };
        $scope.GetDashboardAggregateDenialClaimsByProviders = function () {
            $scope.TotalDenialClaimsByProviders = [];

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": "2025"
            }

            eHnoteInsuranceService.GetDashboardAggregateDenialClaimsByProviders(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalDenialClaimsByProviders = resp.data.rows || [];

                    $timeout($scope.ProviderrenderDenialRateChart, 0);

                }

            }, function (err) { console.log(err); });
        };
        $scope.ProviderClaimsDenialRateChartInstance = null;
        $scope.ProviderrenderDenialRateChart = function () {
            var container = document.getElementById("ProviderDenialRatesChart");
            if (!container) return;

            let chartData = $scope.TotalDenialClaimsByProviders.map(r => {
                let denialRate = r.SubmittedClaims > 0
                    ? (r.DenielClaims / r.SubmittedClaims) * 100
                    : 0;
                return {
                    provider: r.ProviderName,
                    submitted: r.SubmittedClaims,
                    denied: r.DenielClaims,
                    denialRate: +denialRate.toFixed(1)
                };
            });

            var chartOptions = {
                container: container,
                autoSize: true,
                data: chartData,
                series: [{
                    type: 'bar',
                    xKey: 'provider',
                    yKey: 'denialRate',
                    yName: 'Denial Rate %',
                    tooltip: {
                        renderer: (params) => {
                            let d = params.datum;
                            return {
                                title: d.provider,
                                content:
                                    `Claims Submitted: ${d.submitted}\n` +
                                    `Claims Denied: ${d.denied}\n` +
                                    `Denial Rate: ${d.denialRate}%`
                            };
                        }
                    }
                }],
                axes: [
                    { type: 'category', position: 'bottom', title: { text: 'Provider' } },
                    { type: 'number', position: 'left', title: { text: 'Denial Rate %' }, min: 0 }
                ],
                legend: { enabled: false }
            };

            if ($scope.ProviderClaimsDenialRateChartInstance && $scope.ProviderClaimsDenialRateChartInstance.destroy) {
                $scope.ProviderClaimsDenialRateChartInstance.destroy();
            }

            $scope.ProviderClaimsDenialRateChartInstance = agCharts.AgCharts.create(chartOptions);
        };
        $scope.GetMainAggregateDashboardHighValueServices = function () {
            $scope.HighValueServices = [];

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": "2025"
            }

            eHnoteInsuranceService.GetMainAggregateDashboardHighValueServices(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.HighValueServices = resp.data.rows || [];
                    angular.forEach($scope.HighValueServices, function (item) {
                       
                        item.TotalsCharges = 0;
                        item.TotalsCollections = 0;
                        angular.forEach(item.Services, function (ser) {
                            item.TotalsCharges += ser.Charges || 0;
                            item.TotalsCollections += ser.Collected || 0;
                           
                          


                        });
                    });
                    $timeout($scope.renderHighValueServicesChart, 0);

                }

            }, function (err) { console.log(err); });
        };
        $scope.HighValueServicesChartInstance = null;
        $scope.renderHighValueServicesChart = function () {
            var container = document.getElementById("serviceChart");
            if (!container) return;

            let chartData = $scope.HighValueServices.map(r => {
                let total = r.Services.reduce((sum, s) => sum + s.Charges, 0);
                let obj = { month: r.Month };
                r.Services.forEach(s => {
                  
                    if (s.ServiceType === "Premium IOL") {
                        obj["Premium IOL"] = total > 0 ? +((s.Charges / total) * 100).toFixed(1) : 0;
                    } else if (s.ServiceType === "Advanced Diagnostics") {
                        obj["Advanced Diagnostics"] = total > 0 ? +((s.Charges / total) * 100).toFixed(1) : 0;
                    } else if (s.ServiceType === "Laser Assisted SX") {
                        obj["Laser Assisted SX"] = total > 0 ? +((s.Charges / total) * 100).toFixed(1) : 0;
                    }
                });
                return obj;
            });

            console.log("Chart Data:", chartData);

            var chartOptions = {
                container: container,
                autoSize: true,
                data: chartData,
                series: [
                    { type: 'bar', xKey: 'month', yKey: 'Premium IOL', yName: 'Premium IOL', stacked: true },
                    { type: 'bar', xKey: 'month', yKey: 'Laser Assisted SX', yName: 'Laser Assisted SX', stacked: true },
                    { type: 'bar', xKey: 'month', yKey: 'Advanced Diagnostics', yName: 'Advanced Diagnostics', stacked: true }
                ],
                axes: [
                    { type: 'category', position: 'bottom', title: { text: 'Month' } },
                    {
                        type: 'number', position: 'left', title: { text: 'Utilization (%)' }, min: 0, max: 100,
                        label: { formatter: params => params.value + '%' }
                    }
                ],
                legend: { position: 'top' },
                title: {
                    text: '',
                    fontSize: 16
                }
            };

            if ($scope.HighValueServicesChartInstance && $scope.HighValueServicesChartInstance.destroy) {
                $scope.HighValueServicesChartInstance.destroy();
            }

            $scope.HighValueServicesChartInstance = agCharts.AgCharts.create(chartOptions);
        };
        $scope.closeFilterPopover = function () {
            angular.element(document.querySelector('.popover')).remove();
        };

        $scope.$on('navtoAggregateReport', function (event, data) {
            data = data || {};
            let Id = data.Id || 1;
            $scope.AgregateSubTab = Id;
            $scope.ChangeAgregateSubTab(Id);
        });

    }]);


//var currentDate = new Date();

//switch (filterType) {
//    case 1: // Month-to-Date
//        $scope.ARReportData.FromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//        $scope.ARReportData.ToDate = new Date(); // today
//        break;

//    case 2: // Year-to-Date
//        $scope.ARReportData.FromDate = new Date(currentDate.getFullYear(), 0, 1); // Jan 1st of current year
//        $scope.ARReportData.ToDate = new Date(); // today
//        break;

//    case 3: // Quarter-to-Date
//        var currentMonth = currentDate.getMonth();
//        var quarterStartMonth = Math.floor(currentMonth / 3) * 3; // 0, 3, 6, 9
//        $scope.ARReportData.FromDate = new Date(currentDate.getFullYear(), quarterStartMonth, 1);
//        $scope.ARReportData.ToDate = new Date(); // today
//        break;

//    default:
//        $scope.ARReportData.FromDate = null;
//        $scope.ARReportData.ToDate = null;
//        break;
//}

"use strict";
eHnoteWebApp.controller("USOperationalReportsCtrl", ["$scope", "eHnoteInsuranceService", "alertify", "$timeout", "$q", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "localStorageFactory", "$uibModal", "eHnoteUserAppointmentDataService",
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
        $scope.OperationAgregateSubTab = 1;

        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo &&
            $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode &&
            $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }


        function GetARReportData() {
            var obj = {

                "SelectedRangeId": 1,
                "LocationIds": null,
                //"FromDate": moment().subtract(30, 'days').format("MM-DD-YYYY"),
                "FromDate": moment().format("MM-DD-YYYY"),
                "ToDate": moment().format("MM-DD-YYYY"),
                "CurrentDate": moment().format("MM-DD-YYYY"), 
                "PageNumber": 1,
                "PageSize": 20,
                "Count":0,

            }
            return obj;
        };
        $scope.ARReportData = GetARReportData();

        $scope.DateRangeArray = [
            { Id: 1, Name: 'Today' },
            { Id: 2, Name: 'Yesterday' },
            { Id: 3, Name: 'Last week' },
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 6 months' },
            { Id: 8, Name: 'This year' },
            { Id: 9, Name: 'Last year' },
            { Id: 10, Name: 'Custom Date' }
        ];


        $scope.LocationTypeObj = {
            "SelectLocationString": "All Locations",
            "Name": "",
            "AllLocationCheck": true
        };

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



        $scope.setDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Today
                    $scope.ARReportData.FromDate = new Date(currentDate);
                    $scope.ARReportData.ToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.ARReportData.FromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    var currentDate = new Date();
                    $scope.ARReportData.ToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                    break;
                case 3: // Last week
                    $scope.ARReportData.FromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    $scope.ARReportData.ToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.ARReportData.FromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.ARReportData.ToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.ARReportData.FromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.ARReportData.ToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months
                    $scope.ARReportData.FromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    $scope.ARReportData.ToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 6 months
                    $scope.ARReportData.FromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.ARReportData.ToDate = new Date(); // Reset to current date
                    break;
                case 8: // This year
                    $scope.ARReportData.FromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.ARReportData.ToDate = new Date(); // Reset to current date
                    break;
                case 9: // Last year
                    $scope.ARReportData.FromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.ARReportData.ToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                case 10: // Custom Date
                    $scope.ARReportData.FromDate = null; 
                    $scope.ARReportData.ToDate = null;
                    break;
                default:
                    $scope.ARReportData.FromDate = moment().format("MM-DD-YYYY")||null;
                    $scope.ARReportData.ToDate = moment().format("MM-DD-YYYY")||null;
            }

            $scope.ARReportData.FromDate = $scope.ARReportData.FromDate;
            $scope.ARReportData.ToDate = $scope.ARReportData.ToDate;

            if ($scope.ARReportData.FromDate != '') {
                $scope.ARReportData.FromDate = $filter('date')($scope.ARReportData.FromDate, "MM-dd-yyyy");
            }
            if ($scope.ARReportData.ToDate != '') {
                $scope.ARReportData.ToDate = $filter('date')($scope.ARReportData.ToDate, "MM-dd-yyyy");
            }
        };




        $scope.FilterApply = function () {
            $scope.ChangeDashboardSubTab($scope.OperationAgregateSubTab);
        }


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
            $scope.ChangeDashboardSubTab($scope.OperationAgregateSubTab);
        }

        $scope.GetChargeandRevenueTotals = function () {
            $scope.TotalsRevenueCharges = [];
            $scope.totalSums = {
                "TotalChargeAmount": 0,
                "TotalInsurancePaymentAmount": 0,
                "TotalPatientPaymentAmount": 0,
                "TotalAdjustmentAmount": 0,
                "TotalWriteOffAmount": 0,
                "TotalCollectionAmount": 0,
                "TotalAdjustmentWriteoffAmount": 0,
                "TotalChargePercentage": 0,
                "TotalCollectionsPercentage": 0,
                "TotalAdjWriteoffPercentage":0
            };

            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "PageNumber": $scope.ARReportData.PageNumber,
                "PageSize": $scope.ARReportData.PageSize,
            }

            eHnoteInsuranceService.GetMainDashboardChargeandRevenueTotals(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalsRevenueCharges = resp.data.rows || [];
                  
                    console.log($scope.TotalsRevenueCharges);
                    if ($scope.TotalsRevenueCharges.length > 0) {
                        angular.forEach($scope.TotalsRevenueCharges, function (item) {
                            $scope.totalSums.TotalChargeAmount += item.TotalChargeAmount || 0;
                            $scope.totalSums.TotalInsurancePaymentAmount += item.TotalInsurancePaymentAmount || 0;
                            $scope.totalSums.TotalPatientPaymentAmount += item.TotalPatientPaymentAmount || 0;
                            $scope.totalSums.TotalAdjustmentAmount += item.TotalAdjustmentAmount || 0;
                            $scope.totalSums.TotalWriteOffAmount += item.TotalWriteOffAmount || 0;

                            $scope.totalSums.TotalCollectionAmount += item.TotalInsurancePaymentAmount + item.TotalPatientPaymentAmount;
                            $scope.totalSums.TotalAdjustmentWriteoffAmount += item.TotalAdjustmentAmount + item.TotalWriteOffAmount;

                            item.TotalCollection = item.TotalInsurancePaymentAmount + item.TotalPatientPaymentAmount;
                            item.TotalAdjWriteoff = item.TotalAdjustmentAmount + item.TotalWriteOffAmount;
                        });
                        angular.forEach($scope.TotalsRevenueCharges, function (item) {
                            item.ChargePercentage = $scope.totalSums.TotalChargeAmount > 0
                                ? ((item.TotalChargeAmount / $scope.totalSums.TotalChargeAmount) * 100).toFixed(2)
                                : 0;

                            item.CollectionPercentage = $scope.totalSums.TotalCollectionAmount > 0
                                ? ((item.TotalCollection / $scope.totalSums.TotalCollectionAmount) * 100).toFixed(2)
                                : 0;

                            item.AdjWriteoffPercentage = ($scope.totalSums.TotalAdjWriteoff > 0)
                                ? ((item.TotalAdjWriteoff / $scope.totalSums.TotalAdjWriteoff) * 100).toFixed(2)
                                : 0;
                            $scope.totalSums.TotalChargePercentage += item.ChargePercentage;
                            $scope.totalSums.TotalCollectionsPercentage += item.CollectionPercentage;
                            $scope.totalSums.TotalAdjWriteoffPercentage += item.AdjWriteoffPercentage;
                        });
                    }
                    $timeout($scope.renderLocationChart, 0);
                    $timeout($scope.renderLocationCollectionChart, 0);
                    $timeout($scope.renderLocationAdjustmentsChart, 0);

                }

            }, function (err) { console.log(err); });
        };
        $scope.GetChargeandRevenueTotals();

        $scope.GetChargesVsCollectionData = function () {
            $scope.AllTotalCharges = [];
            let param = {
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": new Date().getFullYear(),
                "CurrentDate": $scope.ARReportData.CurrentDate
            }

            eHnoteInsuranceService.GetMainDashboardTotalChargesVsCollectionData(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.AllTotalCharges = resp.data.rows || [];
                }

            }, function (err) { console.log(err); });
        };

        $scope.GetChargesVsCollectionData();





        let chartInstance = null;

        $scope.renderLocationChart = function () {
            var container = document.getElementById("LocationCharges");
            if (!container) return;

            var chartData = ($scope.TotalsRevenueCharges || []).map(function (item) {
                return {
                    location: item.LocationName,
                    charges: item.TotalChargeAmount || 0
                };
            });

            var Locationoptions = {
                container: container,
                data: chartData,
                series: [
                    {
                        type: "bar",
                        xKey: "location",
                        yKey: "charges",
                        yName: "Charges"
                    }
                ],
                axes: [
                    { type: "category", position: "bottom", title: { text: "" } },
                    { type: "number", position: "left", title: { text: "Charges" } }
                ],
                legend: { position: 'bottom' },
                tooltip: {
                    renderer: (params) => {
                        return {
                            content: `${params.yName}: $${params.datum[params.yKey].toLocaleString()}`
                        };
                    }
                }
            };

            if (chartInstance) chartInstance.destroy();
            chartInstance = agCharts.AgCharts.create(Locationoptions);
        }



        let collectionchartInstance = null;

        $scope.renderLocationCollectionChart = function () {
            var container = document.getElementById("LocationCollections");
            if (!container) return;

            var chartData = ($scope.TotalsRevenueCharges || []).map(function (item) {
                return {
                    location: item.LocationName,
                    insPayment: item.TotalInsurancePaymentAmount || 0,
                    patPayment: item.TotalPatientPaymentAmount || 0
                };
            });

            var Locationoptions = {
                container: container,
                data: chartData,
                series: [
                    {
                        type: "bar",
                        xKey: "location",
                        yKey: "insPayment",
                        yName: "Ins Payment",
                        stacked: true, 
                        fill: "#20e2d5" 
                    },
                    {
                        type: "bar",
                        xKey: "location",
                        yKey: "patPayment",
                        yName: "Patient Payment",
                        stacked: true, 
                        fill: "#2196F3" 
                    }
                ],
                axes: [
                    { type: "category", position: "bottom", title: { text: "" } },
                    { type: "number", position: "left", title: { text: "Total Collection ($)" } }
                ],
                legend: { position: 'bottom' },
                tooltip: {
                    renderer: (params) => {
                        return {
                            content: `${params.yName}: $${params.datum[params.yKey].toLocaleString()}`
                        };
                    }
                }
            };

            if (collectionchartInstance) {
                collectionchartInstance.destroy();
            }
            collectionchartInstance = agCharts.AgCharts.create(Locationoptions);
        };

        $scope.ChangeDashboardSubTab = function (id) {
            $scope.OperationAgregateSubTab = id;

            if ($scope.OperationAgregateSubTab == 1) {
                $scope.GetChargeandRevenueTotals();
            }
            else if ($scope.OperationAgregateSubTab == 2) {
               
                $scope.GetDashboardOperationlARBalanceByPayer();
                $scope.GetDashboardOperationlARBalanceByMonthWise();

            }
            else if ($scope.OperationAgregateSubTab == 3) {
                $scope.GetDashboardOperationlPayersCharges();
                $scope.GetDashboardOperationlPayersCollections();

            }
            else if ($scope.OperationAgregateSubTab ==4) {
                $scope.GetDashboardOperationlProvidersCharges();
                $scope.GetDashboardOperationlProvidersCollections();
            }
            else if ($scope.OperationAgregateSubTab == 5) {
                $scope.GetDashboardOperationlProceduresCharges();
                $scope.GetDashboardOperationlProceduresCollections();
                $scope.GetDashboardOperationlCategoryWiseCPTCollections();
            }
            else {

            }
        }

        let AdjustmentschartInstance = null;

        $scope.renderLocationAdjustmentsChart = function () {
            var container = document.getElementById("LocationAdjustments");
            if (!container) return;

            var chartData = ($scope.TotalsRevenueCharges || []).map(function (item) {
                return {
                    location: item.LocationName,
                    adjustments: item.TotalAdjustmentAmount || 0,
                    writeOff: item.TotalWriteOffAmount || 0
                };
            });

            var adjustmentoptions = {
                container: container,
                data: chartData,
                series: [
                    {
                        type: "bar",
                        xKey: "location",
                        yKey: "adjustments",
                        yName: "Adjustments",
                        stacked: false,
                        fill: '#f5a623'
                    },
                    {
                        type: "bar",
                        xKey: "location",
                        yKey: "writeOff",
                        yName: "Write Off",
                        stacked: false,
                        fill: '#ff4d4f'
                    }
                ],
                axes: [
                    { type: "category", position: "bottom", title: { text: "" } },
                    { type: "number", position: "left", title: { text: "Amount" } }
                ],
                legend: { position: 'bottom' },
                tooltip: {
                    renderer: (params) => {
                        return {
                            content: `${params.yName}: $${params.datum[params.yKey].toLocaleString()}`
                        };
                    }
                }
            };
         
            if (AdjustmentschartInstance) AdjustmentschartInstance.destroy();
            AdjustmentschartInstance = agCharts.AgCharts.create(adjustmentoptions);
        };


        $scope.GetDashboardOperationlPayersCharges = function () {
            $scope.TotalsPayersCharges = [];


            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "PageNumber": $scope.ARReportData.PageNumber,
                "PageSize": $scope.ARReportData.PageSize,
            }

            eHnoteInsuranceService.GetDashboardOperationlPayersCharges(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalsPayersCharges = resp.data.rows || [];
                    $scope.ARReportData.Count = resp.data.Count || 0;
                    ($scope.TotalsPayersCharges || []).forEach(function (payer) {
                        payer.TotalCharges = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.Charges) || 0);
                        }, 0);
                        (payer.Locations || []).forEach(function (loc) {
                            if (payer.TotalCharges > 0) {
                                loc.ChargePercentage = ((loc.Charges / payer.TotalCharges) * 100).toFixed(2);
                            } else {
                                loc.ChargePercentage = 0;
                            }
                        });
                    });
                   
                    console.log($scope.TotalsPayersCharges);
                    $timeout($scope.renderPayerChargesChart, 0);
                }
                
            }, function (err) { console.log(err); });
        };
        $scope.GetDashboardOperationlPayersCollections = function () {
            $scope.TotalsPayersCollections = [];
           

            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "PageNumber": $scope.ARReportData.PageNumber,
                "PageSize": $scope.ARReportData.PageSize,
            }

            eHnoteInsuranceService.GetDashboardOperationlPayersCollections(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    //$scope.TotalsPayersCollections = resp.data.rows || [];
                    //$scope.ARReportData.Count = resp.data.count || 0;
                    //($scope.TotalsPayersCollections || []).forEach(function (payer) {
                    //    payer.TotalCollectedPercentage = 0;
                    //    payer.TotalCollections = (payer.Locations || []).reduce(function (sum, loc) {
                    //        return sum + (parseFloat(loc.Collected) || 0);
                    //    }, 0);
                    //    (payer.Locations || []).forEach(function (loc) {
                    //        if (payer.TotalCollections > 0) {
                    //            loc.CollectedPercentage = ((loc.Collected / payer.TotalCollections) * 100).toFixed(2);
                    //            payer.TotalCollectedPercentage += loc.CollectedPercentage;
                    //        } else {
                    //            loc.CollectedPercentage = 0;
                    //        }
                    //    });
                    //});
                    $scope.TotalsPayersCollections = resp.data.rows || [];
                    $scope.ARReportData.Count = resp.data.count || 0;

                    ($scope.TotalsPayersCollections || []).forEach(function (payer) {

                        payer.TotalCollections = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.Collected) || 0);
                        }, 0);

                        payer.TotalCharges = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.Charges) || 0);
                        }, 0);

                        // FIX: collected / charges * 100  →  100 / 200 = 50%
                        payer.TotalCollectedPercentage = payer.TotalCharges > 0
                            ? parseFloat(((payer.TotalCollections / payer.TotalCharges) * 100).toFixed(2))
                            : 0;

                        (payer.Locations || []).forEach(function (loc) {
                            var charges = parseFloat(loc.Charges) || 0;
                            var collected = parseFloat(loc.Collected) || 0;
                            loc.CollectedPercentage = charges > 0
                                ? parseFloat(((collected / charges) * 100).toFixed(2))
                                : 0;
                        });
                    });
                    console.log($scope.TotalsPayersCollections);
                    $timeout($scope.renderPayerCollectionsChart, 0);
                }

            }, function (err) { console.log(err); });
        };
        let payerChargesChartInstance = null;

        $scope.renderPayerChargesChart = function () {
            var container = document.getElementById("PayerCharges");
            if (!container) return;

            let allLocations = [];
            ($scope.TotalsPayersCharges || []).forEach(payer => {
                (payer.Locations || []).forEach(loc => {
                    if (!allLocations.includes(loc.LocationName)) {
                        allLocations.push(loc.LocationName);
                    }
                });
            });

            var chartData = ($scope.TotalsPayersCharges || []).map(function (payer) {
                let row = { payor: payer.PayorName };
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

                if (payerChargesChartInstance && payerChargesChartInstance.destroy) {
                    payerChargesChartInstance.destroy();
                }

          
                payerChargesChartInstance = agCharts.AgCharts.create(chartOptions);
           
        };

        let payerCollectionsChartInstance = null;
        $scope.renderPayerCollectionsChart = function () {
            var container = document.getElementById("PayerCollections");
            if (!container) return;

            let allLocations = [];
            ($scope.TotalsPayersCollections || []).forEach(payer => {
                (payer.Locations || []).forEach(loc => {
                    if (!allLocations.includes(loc.LocationName)) {
                        allLocations.push(loc.LocationName);
                    }
                });
            });

            var chartData = ($scope.TotalsPayersCollections || []).map(function (payer) {
                let row = { payor: payer.PayorName };
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

            if (payerCollectionsChartInstance && payerCollectionsChartInstance.destroy) {
                payerCollectionsChartInstance.destroy();
            }
            payerCollectionsChartInstance = agCharts.AgCharts.create(chartOptions);

        };


      //  ------------ Provider -----------

        let ProviderChargesChartInstance = null;
        $scope.renderProviderChargesChart = function () {
            var container = document.getElementById("ProviderCharges");
            if (!container) return;

            let allLocations = [];
            ($scope.TotalsProvidersCharges || []).forEach(Provider => {
                (Provider.Locations || []).forEach(loc => {
                    if (!allLocations.includes(loc.LocationName)) {
                        allLocations.push(loc.LocationName);
                    }
                });
            });

            var chartData = ($scope.TotalsProvidersCharges || []).map(function (Prov) {
                let row = { Provider: Prov.RenderingProvider };
                allLocations.forEach(locName => {
                    let found = Prov.Locations.find(l => l.LocationName === locName);
                    row[locName] = found ? found.Charges : 0;
                });
                return row;
            });

            let series = allLocations.map(locName => {
                return {
                    type: "bar",
                    xKey: "Provider",
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

            if (ProviderChargesChartInstance && ProviderChargesChartInstance.destroy) {
                ProviderChargesChartInstance.destroy();
            }


            ProviderChargesChartInstance = agCharts.AgCharts.create(chartOptions);

        };

        let ProviderCollectionsChartInstance = null;
        $scope.renderProviderCollectionsChart = function () {
            var container = document.getElementById("ProviderCollections");
            if (!container) return;

            let allLocations = [];
            ($scope.TotalsProvidersCollections || []).forEach(Provider => {
                (Provider.Locations || []).forEach(loc => {
                    if (!allLocations.includes(loc.LocationName)) {
                        allLocations.push(loc.LocationName);
                    }
                });
            });

            var chartData = ($scope.TotalsProvidersCollections || []).map(function (Prov) {
                let row = { Provider: Prov.RenderingProvider };
                allLocations.forEach(locName => {
                    let found = Prov.Locations.find(l => l.LocationName === locName);
                    row[locName] = found ? found.Collected : 0;
                });
                return row;
            });

            let series = allLocations.map(locName => {
                return {
                    type: "bar",
                    xKey: "Provider",
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

            if (ProviderCollectionsChartInstance && ProviderCollectionsChartInstance.destroy) {
                ProviderCollectionsChartInstance.destroy();
            }


            ProviderCollectionsChartInstance = agCharts.AgCharts.create(chartOptions);

        };

        let ProviderAdjustmentChartInstance = null;
        $scope.renderProviderAdjustmentsChart = function () {
            var container = document.getElementById("ProviderAdjustment");
            if (!container) return;

            let allLocations = [];
            ($scope.TotalsProvidersAdjustments || []).forEach(Provider => {
                (Provider.Locations || []).forEach(loc => {
                    if (!allLocations.includes(loc.LocationName)) {
                        allLocations.push(loc.LocationName);
                    }
                });
            });

            var chartData = ($scope.TotalsProvidersAdjustments || []).map(function (Prov) {
                let row = { Provider: Prov.RenderingProvider };
                allLocations.forEach(locName => {
                    let found = Prov.Locations.find(l => l.LocationName === locName);
                    row[locName] = found ? found.AdjustmentAmount : 0;
                });
                return row;
            });

            let series = allLocations.map(locName => {
                return {
                    type: "bar",
                    xKey: "Provider",
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

            if (ProviderAdjustmentChartInstance && ProviderAdjustmentChartInstance.destroy) {
                ProviderAdjustmentChartInstance.destroy();
            }


            ProviderAdjustmentChartInstance = agCharts.AgCharts.create(chartOptions);

        };


        $scope.GetDashboardOperationlProvidersCharges = function () {
            $scope.TotalsPayersCharges = [];


            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "PageNumber": $scope.ARReportData.PageNumber,
                "PageSize": $scope.ARReportData.PageSize,
            }

            eHnoteInsuranceService.GetDashboardOperationlProvidersCharges(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalsProvidersCharges = resp.data.rows || [];
                    ($scope.TotalsProvidersCharges || []).forEach(function (payer) {
                        payer.TotalCharges = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.Charges) || 0);
                        }, 0);
                        (payer.Locations || []).forEach(function (loc) {
                            if (payer.TotalCharges > 0) {
                                loc.ChargePercentage = ((loc.Charges / payer.TotalCharges) * 100).toFixed(2);
                            } else {
                                loc.ChargePercentage = 0;
                            }
                        });
                    });
                 //   $scope.TotalsProvidersCollections = resp.data.rows || [];
                    $scope.TotalsProvidersAdjustments = resp.data.rows || [];
                    ($scope.TotalsProvidersAdjustments || []).forEach(function (payer) {
                        payer.TotalAdjustments = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.AdjustmentAmount) || 0);
                        }, 0);
                        (payer.Locations || []).forEach(function (loc) {
                            if (payer.TotalAdjustments > 0) {
                                loc.AdjustmentPercentage = ((loc.AdjustmentAmount / payer.TotalAdjustments) * 100).toFixed(2);
                            } else {
                                loc.AdjustmentPercentage = 0;
                            }
                        });
                    });

                    console.log($scope.TotalsProvidersCharges);
                    $timeout($scope.renderProviderChargesChart, 0);
                   // $timeout($scope.renderProviderCollectionsChart, 0);
                    $timeout($scope.renderProviderAdjustmentsChart, 0);
                }

            }, function (err) { console.log(err); });
        };

        $scope.GetDashboardOperationlProvidersCollections = function () {
            $scope.TotalsProvidersCollections = [];


            //$scope.ARReportData.LocationIds = $scope.AllUserBranchesList
            //    .filter(pitem => pitem.ClinicId != 0)
            //    .map(pitem => pitem.ClinicId)
            //    .join(",");

            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "PageNumber": $scope.ARReportData.PageNumber,
                "PageSize": $scope.ARReportData.PageSize,
            }

            eHnoteInsuranceService.GetDashboardOperationlProvidersCollections(param).then(function (resp) {
                if (resp.data.status === "Success") {
                  
                    $scope.TotalsProvidersCollections = resp.data.rows || [];
                    ($scope.TotalsProvidersCollections || []).forEach(function (payer) {
                        payer.TotalCollections = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.Collected) || 0);
                        }, 0);
                        (payer.Locations || []).forEach(function (loc) {
                            if (payer.TotalCollections > 0) {
                                loc.CollectedPercentage = ((loc.Collected / payer.TotalCollections) * 100).toFixed(2);
                            } else {
                                loc.CollectedPercentage = 0;
                            }
                        });
                    });
                    $timeout($scope.renderProviderCollectionsChart, 0);
                
                }
            }, function (err) { console.log(err); });
        };

                $scope.dashboardFilterPopover = {
                    templateUrl: 'dashboardFilterPopover.html',
                };

                $scope.closeFilterPopover = function () {
                    angular.element(document.querySelector('.popover')).remove();
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
                        "PageNumber": $scope.ARReportData.PageNumber,
                        "PageSize": $scope.ARReportData.PageSize,
                    }

                    eHnoteInsuranceService.GetDashboardOperationlProceduresCharges(param).then(function (resp) {
                        if (resp.data.status === "Success") {
                            $scope.TotalsProceduresCharges = resp.data.rows || [];
                            ($scope.TotalsProceduresCharges || []).forEach(function (payer) {
                                payer.TotalCharges = (payer.Locations || []).reduce(function (sum, loc) {
                                    return sum + (parseFloat(loc.Charges) || 0);
                                }, 0);
                                payer.TotalServiceCount = 0;
                                (payer.Locations || []).forEach(function (loc) {
                                    payer.TotalServiceCount += loc.ServiceCount;
                                    if (payer.TotalCharges > 0) {
                                        loc.ChargePercentage = ((loc.Charges / payer.TotalCharges) * 100).toFixed(2);
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
                    //    .join(",");

                    let param = {
                        "FromDate": $scope.ARReportData.FromDate || null,
                        "ToDate": $scope.ARReportData.ToDate || null,
                        "LocationIds": $scope.ARReportData.LocationIds,
                        "PageNumber": $scope.ARReportData.PageNumber,
                        "PageSize": $scope.ARReportData.PageSize,
                    }

                    eHnoteInsuranceService.GetDashboardOperationlProceduresCollections(param).then(function (resp) {
                        if (resp.data.status === "Success") {
                            $scope.TotalsProceduresCollections = resp.data.rows || [];
                            ($scope.TotalsProceduresCollections || []).forEach(function (payer) {
                                payer.TotalCollections = (payer.Locations || []).reduce(function (sum, loc) {
                                    return sum + (parseFloat(loc.Collected) || 0);
                                }, 0);
                                (payer.Locations || []).forEach(function (loc) {
                                    if (payer.TotalCollections > 0) {
                                        loc.CollectedPercentage = ((loc.Collected / payer.TotalCollections) * 100).toFixed(2);
                                    } else {
                                        loc.CollectedPercentage = 0;
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
                            {
                                type: "category",
                                position: "bottom",
                                label: {
                                    rotation: 45,       
                                    autoRotate: true,  
                                    avoidCollisions: false 
                                }
                            },
                            {
                                type: "number",
                                position: "left",
                                title: { text: "Amount ($)" }
                            }
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
                            {
                                type: "category", position: "bottom", label: {
                                    rotation: 45,
                                    autoRotate: true,
                                    avoidCollisions: false
                                } },
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
                "PageNumber": $scope.ARReportData.PageNumber,
                "PageSize": $scope.ARReportData.PageSize,
            }

            eHnoteInsuranceService.GetDashboardOperationlCategoryWiseCPTCollections(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.TotalsServiceWiseCollections = resp.data.rows || [];
                    ($scope.TotalsServiceWiseCollections || []).forEach(function (payer) {
                        payer.TotalCollections = (payer.Locations || []).reduce(function (sum, loc) {
                            return sum + (parseFloat(loc.Collected) || 0);
                        }, 0);
                        (payer.Locations || []).forEach(function (loc) {
                            if (payer.TotalCollections > 0) {
                                loc.CollectedPercentage = ((loc.Collected / payer.TotalCollections) * 100).toFixed(2);
                            } else {
                                loc.CollectedPercentage = 0;
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
        $scope.totalARBlns = {
            "TotalARBalance": 0,
            "TotalAROutStandDays": 0,
            "TotalHighRiskAmount": 0,
            "TotalARCollectionRate": 0,

        };
       
        $scope.GetDashboardOperationlARBalanceByPayer = function () {
            $scope.TotalARBalanceByPayer = [];
            $scope.TotalARAgingBlns = {
                "TotalzerotoThirty": 0,
                "TotalThirtytoSixty": 0,
                "TotalSixtytoNinety": 0,
                "TotalNinetytoOnehundredtwenty": 0,
                "TotalMorethanOnehundredtwenty": 0,
                "TotalARAmountBalance": 0

            };
            let param = {
                "FromDate": $scope.ARReportData.FromDate || null,
                "ToDate": $scope.ARReportData.ToDate || null,
                "LocationIds": $scope.ARReportData.LocationIds,
                "Year": new Date().getFullYear(),
                "PageNumber": $scope.ARReportData.PageNumber,
                "PageSize": $scope.ARReportData.PageSize,
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
                        $scope.TotalARAgingBlns.TotalARAmountBalance += payer.TotalARAmount || 0;
                        $scope.TotalARAgingBlns.TotalARChargeAmount += payer.TotalARCharges || 0;
                        //$scope.totalARBlns.TotalHighRiskAmount += payer.totalHighriskthanninetyplus;

                        return {
                            payer: payer.PayorName,
                            total: payer.TotalARAmount
                        };
                    });
                    //$scope.totalARBlns.TotalARCollectionRate = (($scope.TotalARAgingBlns.TotalARAmountBalance ||0) / ($scope.TotalARAgingBlns.TotalARChargeAmount || 0)) * 100 || 0;

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
                "Year": new Date().getFullYear(),
                "PageNumber": $scope.ARReportData.PageNumber,
                "PageSize": $scope.ARReportData.PageSize,
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
        $scope.ChangeArReasonPagination = function (PageNumber) {
            $scope.ARReportData.PageNumber = PageNumber;
            $scope.GetChargeandRevenueTotals();
        };
        $scope.ChangeArGingBuckets = function (PageNumber) {
            $scope.ARReportData.PageNumber = PageNumber;
            $scope.GetDashboardOperationlARBalanceByPayer();
        };
        $scope.ChangeArTotalCharges = function (PageNumber) {
            $scope.ARReportData.PageNumber = PageNumber;
            $scope.GetDashboardOperationlPayersCharges();
        };
        $scope.ChangeArPayersCollections = function (PageNumber) {
            $scope.ARReportData.PageNumber = PageNumber;
            $scope.GetDashboardOperationlPayersCollections();
        };       

        $scope.ChangeArPayersProdiver = function (PageNumber) {
            $scope.ARReportData.PageNumber = PageNumber;
            $scope.GetDashboardOperationlProvidersCollections();
        };

        $scope.ChangeProvidersCharges = function (PageNumber) {
            $scope.ARReportData.PageNumber = PageNumber;
            $scope.GetDashboardOperationlProvidersCharges();
        };

        $scope.ChangeProceduresCharges = function (PageNumber) {
            $scope.ARReportData.PageNumber = PageNumber;
            $scope.GetDashboardOperationlProceduresCharges();
        };


        $scope.ChangeProceduresCollection = function (PageNumber) {
            $scope.ARReportData.PageNumber = PageNumber;
            $scope.GetDashboardOperationlProceduresCollections();
        };
        $scope.CategoryWiseCPTCollections = function (PageNumber) {
            $scope.ARReportData.PageNumber = PageNumber;
            $scope.GetDashboardOperationlCategoryWiseCPTCollections();
        };

        $scope.$on('navtoOperationalReports', function (event, data) {
            data = data || {};
            let Id = data.Id || 1;
            $scope.OperationAgregateSubTab = Id;
            $scope.ChangeDashboardSubTab(Id);
        });

    }]);
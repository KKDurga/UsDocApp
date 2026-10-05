

"use strict";
eHnoteWebApp.controller("USMaindashboardReportsCtrl", ["$scope", "eHnoteInsuranceService", "alertify","$timeout", "$q", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "localStorageFactory", "$uibModal","eHnoteUserAppointmentDataService",
    function ($scope, eHnoteInsuranceService, alertify, $timeout,$q, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, localStorageFactory, $uibModal, eHnoteUserAppointmentDataService) {

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
                
                "LocationIds": null,
                "FromDate": moment().subtract(30, 'days').format("MM-DD-YYYY"),
                "ToDate": moment().format("MM-DD-YYYY"),
                "CurrentDate": moment().format("MM-DD-YYYY")
           

            }
            return obj;
        };
        $scope.ARReportData = GetARReportData();

        $scope.totalSums = {
            "TotalChargeAmount": 0,
            "TotalInsurancePaymentAmount": 0,
            "TotalPatientPaymentAmount": 0,
            "TotalAdjustmentAmount": 0,
            "TotalWriteOffAmount": 0,
            "TotalCollectionAmount":0
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

        //$scope.GetChargeandRevenueTotals = function () {
        //    $scope.TotalsRevenueCharges = [];

        //    $scope.ARReportData.LocationIds = $scope.AllUserBranchesList
        //        .filter(pitem => pitem.ClinicId != 0)
        //        .map(pitem => pitem.ClinicId)
        //        .join(",");

        //    let param = {
        //        "FromDate": $scope.ARReportData.FromDate || null,
        //        "ToDate": $scope.ARReportData.ToDate || null,
        //        "LocationIds": $scope.ARReportData.LocationIds,
        //    }

        //    eHnoteInsuranceService.GetMainDashboardChargeandRevenueTotals(param).then(function (resp) {
        //        if (resp.data.status === "Success") {
        //            $scope.TotalsRevenueCharges = resp.data.rows || [];
                  
        //            console.log($scope.TotalsRevenueCharges);
        //            if ($scope.TotalsRevenueCharges.length>0){
        //                angular.forEach($scope.TotalsRevenueCharges, function (item) {
        //                    $scope.totalSums.TotalChargeAmount += item.TotalChargeAmount || 0;
        //                    $scope.totalSums.TotalInsurancePaymentAmount += item.TotalInsurancePaymentAmount || 0;
        //                    $scope.totalSums.TotalPatientPaymentAmount += item.TotalPatientPaymentAmount || 0;
        //                    $scope.totalSums.TotalAdjustmentAmount += item.TotalAdjustmentAmount || 0;
        //                    $scope.totalSums.TotalWriteOffAmount += item.TotalWriteOffAmount || 0;

        //                    $scope.totalSums.TotalCollectionAmount += item.TotalInsurancePaymentAmount + item.TotalPatientPaymentAmount;
        //                    item.TotalCollection = item.TotalInsurancePaymentAmount + item.TotalPatientPaymentAmount;
        //                });
        //            }
        //            //$timeout($scope.renderLocationChart, 0);
        //            //$timeout($scope.renderLocationCollectionChart, 0);
        //            //$timeout($scope.renderLocationAdjustmentsChart, 0);
                    

                    
        //        }

        //    }, function (err) { console.log(err); });
        //};
        //$scope.GetChargeandRevenueTotals();

        //$scope.GetChargesVsCollectionData = function () {
        //    $scope.AllTotalCharges = [];
        //    let param = {
        //        "LocationIds": $scope.ARReportData.LocationIds,
        //        "Year": "2025",
        //        "CurrentDate": $scope.ARReportData.CurrentDate
        //    }

        //    eHnoteInsuranceService.GetMainDashboardTotalChargesVsCollectionData(param).then(function (resp) {
        //        if (resp.data.status === "Success") {
        //            $scope.AllTotalCharges=resp.data.rows || [];
        //        }

        //    }, function (err) { console.log(err); });
        //};

        //$scope.GetChargesVsCollectionData();


    














        $scope.OpenExpandView = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "expandedTableView.html",
                /*"size": "md",*/
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__popup--right modal__width--70",/*modal__ninety--*/
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };



        var options = {};

        // Create Chart
       

         options = {
            // Container: HTML Element to hold the chart
            container: document.getElementById('myChart'),
            // Data: Data to be displayed in the chart
            data: [
                { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
                { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
                { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
                { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
                { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
                { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 },
            ],
            // Series: Defines which chart type and data to use
            series: [{ type: 'bar', xKey: 'month', yKey: 'iceCreamSales' }],
        };
        var chart = agCharts.AgCharts.create(options);


        $scope.AgChartOptions = {
            container: document.getElementById("myChart1"),
            title: {
                text: "TotalCharges Vs Collection Data",
            },
            subtitle: {
                text: "",
            },
            data: [
                { quarter: "Jan", TotalCharges: 140, paymentCollection: 90 },
                { quarter: "Feb", TotalCharges: 130, paymentCollection: 70 },
                { quarter: "Mar", TotalCharges: 135, paymentCollection: 130 },
                { quarter: "Apr", TotalCharges: 120, paymentCollection: 10 },
                { quarter: "May", TotalCharges: 125, paymentCollection: 50 },
                { quarter: "Jun", TotalCharges: 124, paymentCollection: 80 },
                { quarter: "Jul", TotalCharges: 112, paymentCollection: 35 },
                { quarter: "Aug", TotalCharges: 118, paymentCollection: 89 },
                { quarter: "Sep", TotalCharges: 125, paymentCollection: 34 },
                { quarter: "Oct", TotalCharges: 130, paymentCollection: 70 },
                { quarter: "Nov", TotalCharges: 135, paymentCollection: 100 },
                { quarter: "Dec", TotalCharges: 140, paymentCollection: 108 }

            ],
            series: [
                {
                    type: "bar",
                    xKey: "quarter",
                    yKey: "TotalCharges",
                    yName: "TotalCharges",
                },
            
                {
                    type: "bar",
                    xKey: "quarter",
                    yKey: "paymentCollection",
                    yName: "paymentCollection",
                },
          
            ],
        };
        var chart = agCharts.AgCharts.create($scope.AgChartOptions);




        $scope.PayerChargesOptions = {
            container: document.getElementById("PayerCharges"),
            title: {
                text: "Apple's Revenue by Product Category",
            },
            subtitle: {
                text: "",
            },
            data: [                
                    { quarter: "Q1'18", iphone: 140, mac: 16, ipad: 14, wearables: 12, services: 20 },
                    { quarter: "Q2'18", iphone: 124, mac: 20, ipad: 14, wearables: 12, services: 30 },
                    { quarter: "Q3'18", iphone: 112, mac: 20, ipad: 18, wearables: 14, services: 36 },
                    { quarter: "Q4'18", iphone: 118, mac: 24, ipad: 14, wearables: 14, services: 36 }               

            ],
            series: [
                {
                    type: "bar",
                    xKey: "quarter",
                    yKey: "iphone",
                    yName: "iPhone",
                },
                {
                    type: "bar",
                    xKey: "quarter",
                    yKey: "mac",
                    yName: "Mac",
                },
                {
                    type: "bar",
                    xKey: "quarter",
                    yKey: "ipad",
                    yName: "iPad",
                },
                {
                    type: "bar",
                    xKey: "quarter",
                    yKey: "wearables",
                    yName: "Wearables",
                },
                {
                    type: "bar",
                    xKey: "quarter",
                    yKey: "services",
                    yName: "Services",
                },
            ],
        };
        var chart1 = agCharts.AgCharts.create($scope.PayerChargesOptions);


        $scope.ProviderRevenueOptions = {
            container: document.getElementById("ProviderRevenue"),            
            title: {
                text: "2023 Average Temperatures",
            },
            subtitle: {
                text: "Oxford, UK",
            },
            data: [{ month: "January", max: 8.5, min: 2.6 },
                { month: "February", max: 10.4, min: 3.0 },
                { month: "March", max: 10.9, min: 4.7 },
                { month: "April", max: 13.7, min: 5.0 },
                { month: "May", max: 18.2, min: 8.4 },
                { month: "June", max: 23.6, min: 12.2 },
                { month: "July", max: 21.3, min: 13.0 },
                { month: "August", max: 21.9, min: 13.1 },
                { month: "September", max: 22.6, min: 13.2 },
                { month: "October", max: 17.0, min: 9.7 },
                { month: "November", max: 11.1, min: 4.9 },
                { month: "December", max: 10.2, min: 5.2 },],
            series: [
                {
                    type: "line",
                    xKey: "month",
                    xName: "Month",
                    yKey: "min",
                    yName: "Min Temperature",
                    interpolation: { type: "smooth" },
                },
                {
                    type: "line",
                    xKey: "month",
                    xName: "Month",
                    yKey: "max",
                    yName: "Max Temperature",
                    interpolation: { type: "smooth" },
                },
            ],
        };
        var chart2 = agCharts.AgCharts.create($scope.ProviderRevenueOptions);


        $scope.LocationOptions = {
            container: document.getElementById("Location"),
            data: [{ asset: "Stocks", amount: 60000 },
                { asset: "Bonds", amount: 40000 },
                { asset: "Cash", amount: 7000 },
                { asset: "Real Estate", amount: 5000 },
                { asset: "Commodities", amount: 3000 },],
            title: {
                text: "Portfolio Composition",
            },
            series: [
                {
                    type: "donut",
                    calloutLabelKey: "asset",
                    angleKey: "amount",
                },
            ],
        };
        var chart3 = agCharts.AgCharts.create($scope.LocationOptions);



 

        $scope.ChangeDashboardTab = function (id) {
            $scope.OperationAgregateTab = id;
        }
      
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
                    { type: "category", position: "bottom", title: { text: "" },label: { enabled: false } },
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
                        stacked: true, // side by side
                        fill: "#4CAF50" // custom color (optional)
                    },
                    {
                        type: "bar",
                        xKey: "location",
                        yKey: "patPayment",
                        yName: "Patient Payment",
                        stacked: true, // side by side
                        fill: "#2196F3" // custom color (optional)
                    }
                ],
                axes: [
                    { type: "category", position: "bottom", title: { text: "" }, label: { enabled: false } },
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
                    { type: "category", position: "bottom", title: { text: "" }, label: { enabled: false } },
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

        $scope.$on('navtoDashBoardReportsTab', function (event, data) {
            data = data || {};
            let tab = data.tab || 1;
            let Id = data.Id || 1;
            $scope.OperationAgregateTab = tab;
            if (tab == 1) {
                $scope.OperationAgregateSubTab = Id;
                $scope.$broadcast("navtoOperationalReports", data);
            } else if(tab==2){
                $scope.AgregateSubTab = Id;
                $scope.$broadcast("navtoAggregateReport", data);
            }else {
                $scope.AgregateSubTab = Id;
                $scope.$broadcast("navtoARReportListNew", data);
            }
        });
}]);

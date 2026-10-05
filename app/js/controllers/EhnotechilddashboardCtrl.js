"use strict";

eHnoteWebApp.controller("EhnotechilddashboardCtrl", ["$scope", "$filter", "eHnoteMasterDataService", "alertify", "$uibModal", "InventoryService", "$q", "$timeout", "eHnoteProcedureDataService", "eHnoteSettingsDataService", "eHnoteMainDashboardDataServices", "localStorageFactory", "ReportUtilites", function ($scope, $filter, eHnoteMasterDataService, alertify, $uibModal, InventoryService, $q, $timeout, eHnoteProcedureDataService, eHnoteSettingsDataService, eHnoteMainDashboardDataServices, localStorageFactory, ReportUtilites) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();

    //$scope.StateSerach
    $scope.StateHeadArray = {};
    $scope.ClusterHeadArray = [];
    $scope.HospitalHeadArray = [];
    $scope.ClusterHeadArray = doctorinfo.doctordata.ClusterArray;
    $scope.HospitalArray = doctorinfo.doctordata.UserAddress;
    $scope.hospitalDetails2 = [];
    $scope.hospitalDetails3 = [];
    $scope.HospitalIdsList = [];
    var parentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    var ParentHospitalName = doctorinfo.doctordata.UserAddress[0].ClinicName;
    angular.forEach(doctorinfo.doctordata.UserAddress, function (item) {
        $scope.hospitalDetails2.push(item);
        // console.log($scope.hospitalDetails2);
    });


    $scope.Departments = [];
    eHnoteMainDashboardDataServices.GetAllDepartment(DepartmentSuccess, DepartmentError);
    function DepartmentSuccess(resp) {
        $scope.Departments = resp;
    }
    function DepartmentError(err) {
    }

    //$scope.showDepartmentdiv = true;

    var d = new Date();
    $scope.Search = {
        "FromDate": $filter('date')(new Date(d), "yyyy-MM-dd"),
        "ToDate": $filter('date')(new Date(d), "yyyy-MM-dd"),
        "PageSize": 10,
        "PageNumber": 1,
        "DoctorId": 0,
        "AllHospitalsIndicator": 1,
        "HospitalId": "",
        "Selectedname": "",
        "SelectedCluster": "",
        "SelectedDoctor": "",
        "SelectedDepartmentId": null,
        "SelectedDepartment": null
    };

    $scope.clearReportSearchlist = function () {
        $scope.Search = {
            "FromDate": $filter('date')(new Date(d), "dd-MMM-yyyy"),
            "ToDate": $filter('date')(new Date(d), "dd-MMM-yyyy"),
            "AllHospitalsIndicator": 1,
            "HospitalId": GetAllHospitalIds(),
            "HospitalObj": "",
            "AllDoctorsIndicator": 1,
            "DoctorId": 0,
            "PageSize": 10,
            "PageNumber": 1

        };
    };


    $scope.inti = function () {
        $scope.StateHeadArray.Regions = [];
        $scope.HospitalIdsList = [];
        $scope.Search.HospitalId = [];
        var array = [];
        angular.forEach($scope.ClusterHeadArray, function (item) {
            angular.forEach(item.Regions, function (item1) {
                array.push(item1);
            });
        });
        $scope.StateHeadArray.Regions = array;
        console.log($scope.StateHeadArray.Regions);

        angular.forEach($scope.ClusterHeadArray, function (item1, index) {
            angular.forEach(item1.Regions, function (Bitem, index) {
                angular.forEach($scope.hospitalDetails2, function (item, index) {
                    if (item1.StateId === item.ClusterStateId && Bitem.RegionId === item.regionid) {
                        //if (item1.regionid == item.regionid) {
                        //    $scope.HospitalIdsList.push(item);
                        //    $scope.Search.HospitalId.push(item.ClinicId);
                        //}

                        //if () {
                        $scope.HospitalIdsList.push(item);
                        $scope.Search.HospitalId.push(item.ClinicId);
                        $scope.Hospitallistarray = $scope.Search.HospitalId;
                        //}

                    }
                });

            });
        });

        $scope.Search.SelectedCluster = null;
        $scope.Search.DoctorId = 0;
    };

    $scope.inti();
    $scope.changeState = function (item) {
        // console.log($scope.ClusterHeadArray);

        item = item || "";
        if (item !== "") {
            $scope.StateHeadArray.Regions = [];
            $scope.HospitalIdsList = [];
            $scope.Search.HospitalId = [];
            $scope.StateHeadArray.Regions = item.Regions;
            $scope.SelectedState = item;
            //$scope.StateHeadArray = $filter("filter")($scope.ClusterHeadArray, { "StateId": item.StateId }, true)[0];
            //   angular.forEach($scope.ClusterHeadArray, function (item1, index) {
            angular.forEach($scope.StateHeadArray.Regions, function (Bitem, index) {
                angular.forEach($scope.hospitalDetails2, function (Aitem, index) {
                    if (item.StateId === Aitem.ClusterStateId && Bitem.RegionId === Aitem.regionid) {
                        $scope.HospitalIdsList.push(Aitem);
                        $scope.Search.HospitalId.push(Aitem.ClinicId);
                        $scope.Hospitallistarray = $scope.Search.HospitalId;
                        $scope.HospitalIdsList = $scope.HospitalIdsList;
                    }
                });

            });
            //console.log($scope.Search.HospitalId);
            // });
        } else {
            $scope.StateHeadArray.Regions = [];
            $scope.HospitalIdsList = [];
            $scope.Search.HospitalId = [];
            var array = [];
            angular.forEach($scope.ClusterHeadArray, function (item) {
                angular.forEach(item.Regions, function (item1) {
                    array.push(item1);
                });
            });
            $scope.StateHeadArray.Regions = array;
            angular.forEach($scope.ClusterHeadArray, function (item1, index) {
                angular.forEach(item1.Regions, function (Bitem, index) {
                    angular.forEach($scope.hospitalDetails2, function (item, index) {
                        if (item1.StateId === item.StateId && Bitem.RegionId === item.regionid) {
                            $scope.HospitalIdsList.push(item);
                            $scope.Search.HospitalId.push(item.ClinicId);
                            $scope.Hospitallistarray = $scope.Search.HospitalId;
                        }
                    });

                });
            });

            // $scope.Search.HospitalId = GetAllHospitalIds();
            //$scope.SelectedDoctor = null;
            //$scope.SelectedState = null;
            $scope.Search.SelectedCluster = null;
            $scope.Search.Selectedname = null;

            //$scope.Search.Selectedname = null;
            //$scope.Search.SelectedDoctor = null;
            //  $scope.clinicDoctorListarray = [];
            // $scope.HospitalIdsList = [];
            // $scope.StateHeadArray = [];
            $scope.Search.DoctorId = 0;
        }
    };

    $scope.changeCluster = function (Aitem, hitem) {
        $scope.HospitalIdsList = [];
        $scope.Search.HospitalId = [];
        Aitem = Aitem || null;
        hitem = hitem || null;
        if (Aitem !== null) {
            $scope.SelectedCluster = Aitem;
            $scope.abc = Aitem;
            var TempArray = $filter("filter")($scope.hospitalDetails2, { "regionid": $scope.abc.RegionId }, true);
            if (TempArray.length > 0) {
                $scope.HospitalIdsList = $scope.HospitalIdsList.concat(TempArray);
                $scope.Search.HospitalId = _.pluck($scope.HospitalIdsList, "ClinicId");
                $scope.Hospitallistarray1 = $scope.Search.HospitalId;
            }
           // console.log($scope.Search.HospitalId);
        }
        else if (hitem !== null) {
            $scope.StateHeadArray = $filter("filter")($scope.ClusterHeadArray, { "StateId": hitem.StateId }, true)[0];
            angular.forEach($scope.StateHeadArray.Regions, function (Bitem, index) {
                angular.forEach($scope.hospitalDetails2, function (item, index) {
                    if (hitem.StateId === item.ClusterStateId && Bitem.RegionId === item.regionid) {
                        $scope.HospitalIdsList.push(item);
                        $scope.Search.HospitalId.push(item.ClinicId);
                    }
                });
            });
            console.log($scope.Search.HospitalId);
            $scope.Search.Selectedname = null;
            $scope.Search.SelectedDoctor = null;
        } else {
            angular.forEach($scope.ClusterHeadArray, function (item1, index) {
                angular.forEach(item1.Regions, function (Bitem, index) {
                    angular.forEach($scope.hospitalDetails2, function (item, index) {
                        if (item1.StateId === item.ClusterStateId && Bitem.RegionId === item.regionid) {
                            $scope.HospitalIdsList.push(item);
                            $scope.Search.HospitalId.push(item.ClinicId);

                        }
                    });

                });
            });
          
            $scope.Search.Selectedname = null;
            $scope.Search.SelectedDoctor = null;
        }
       // console.log($scope.Search.HospitalId);
    };

    $scope.changeHospital = function (item) {
        //var data = localStorageFactory.getItem('allHospitalsDoctorsData');
        var data = localStorageFactory.getItem("allBranchesData") || [];
        $scope.Search.HospitalId = [];
        $scope.clinicDoctorListarray = [];
        item = item || "";
        if (item !== "") {
            $scope.Search.HospitalId.push(item.ClinicId);


            angular.forEach(data, function (i) {
                $scope.hospitalDetails3.push(i);
                //$scope.HospitalIdsList.push(i.HospitalInfo.HospitalDetails3.HospitalID);
            });
            //   $scope.hospitalDetails3 = $scope.hospitalDetails3.filter(function (item, pos) { return $scope.hospitalDetails3});
            $scope.SelectedHospital = $filter("filter")($scope.hospitalDetails3, function (Xitem, index) { return Xitem.HospitalInfo.HospitalDetails.ClinicId === item.ClinicId; })[0];
            // console.log($scope.SelectedHospital);
            $scope.SelectedHospital.DoctorDetails = $scope.SelectedHospital.DoctorDetails || [];
            $scope.clinicDoctorListarray = $scope.SelectedHospital.DoctorDetails;
            $scope.Search.AllHospitalsIndicator = 0;
        } else {
            $scope.Search.HospitalId = $scope.Hospitallistarray1 || $scope.Hospitallistarray;
            $scope.Search.SelectedDoctor = null;
            $scope.Search.AllHospitalsIndicator = 1;
        }

    };

    $scope.changeDepartment = function (item) {
        item = item || null;
        if (item != null) {
            $scope.Search.SelectedDepartment = item;
            $scope.Search.SelectedDepartmentId = item.Id;
        }
        else {
            $scope.Search.SelectedDepartmentId = null;
        }
    }




    //function GetAllHospitalIds() {
    //    var ids = [];
    //    angular.forEach($scope.hospitalDetails, function (item, index) {
    //        ids.push(item.HospitalInfo.HospitalDetails.HospitalID);
        
    //    });
    //    return ids;
    //}

    function GetAllHospitalIds() {
        var ids = [];
        angular.forEach($scope.hospitalDetails, function (item, index) {
            ids.push(item.ClinicId);
        });
        return ids;
    }

    GetAllHospitalIds();
    //$scope.Search.HospitalId = GetAllHospitalIds();



    $scope.maxSize = 10;
    $scope.exportMaxSize = 50000;
    $scope.GetAllIndicator = 1;
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;


    $scope.changeReportDate1 = function (item) {
        $scope.Search.FromDate = item;
    };
    $scope.changeReportDate2 = function (item) {
        $scope.Search.ToDate = item;
    };
    $scope.changeclinic = function (item) {
        if (item != undefined) {
            $scope.Search.DoctorId = item.DoctorID;
        }
        else {
            $scope.Search.DoctorId = 0;
        }
    };

    $scope.GetDepartmentReport = function (PageNumber, reportType) {

        var Object = {
            "DoctorId": $scope.Search.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalsList": $scope.Search.HospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SpecializationId": $scope.SpecializationId
        };
        eHnoteMainDashboardDataServices.GetTreatmentRevenueReportByBranch(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.DepartmentExportHistry = resp.data.rows;
                generateTable($scope.DepartmentExportHistry, 'Department Revenue Report');
            }
            else {
                $scope.showDepartmentReportDiv = true;
                $scope.DepartmentArray = resp.data.rows;
                $scope.TotalDepartmentReport = resp.data.count;

            }

        }, function (err) { });
    };

    $scope.GetTreatmentRevenueReport = function (PageNumber, reportType) {
        var Object = {
            "DoctorId": $scope.Search.DoctorId,
            "ProcedureType": 'TreatmentRevenue',
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.Search.HospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
            // "GetAllIndicator": $scope.GetAllIndicator
        };
        eHnoteMainDashboardDataServices.GetTreatmentRevenueReport(Object).then(function (resp) {

            //  if (resp.data.status === "Success") {
            if (reportType === 'export') {
                resp.data.TreatmentRevenue = resp.data.TreatmentRevenue || [];
                $scope.Report1ExportHistry = resp.data.TreatmentRevenue;
                generateTable($scope.Report1ExportHistry, 'TreatmentRevenue');
            }
            else {
                $scope.TreatmentRevenueReportData.TreatmentRevenueArray = resp.data.TreatmentRevenue;
                $scope.TotalTreatmentRevenueCount = resp.data.Count;

            }
            // }
        }, function (err) { });
    };


    $scope.GetAccountRevenueReport = function (PageNumber, reportType) {

        var Object = {
            "DoctorId": $scope.Search.DoctorId,
            "HospitalList": $scope.Search.HospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "AllHospitalsIndicator": $scope.Search.AllHospitalsIndicator,
            "ReportType": reportType
        };
        eHnoteMainDashboardDataServices.GetDailyReportByBranch(Object).then(function (resp) {
            if (reportType === 'export' && $scope.Search.AllHospitalsIndicator == 1) {
                if (resp.data != "") {
                    var file = new Blob([resp.data], { type: "text/csv" });
                    saveAs(file, "AccountRevenueReport" + 1 + ".csv");
                }
            } else {

                if (reportType === 'export') {
                    resp.data.Report = resp.data.Report || [];
                    $scope.AccountRevenueExportHistry = resp.data.Report;
                    generateTable($scope.AccountRevenueExportHistry, 'AccountRevenue');
                }
                else {
                    $scope.AccountRevenueArray = resp.data.Report;
                    $scope.TotalAccountRevenueReport = resp.data.Count;

                }

            }

        }, function (err) { });
    };
    // endreport18
    $scope.GetOpAdvanceRevenueDetailReport = function (PageNumber, reportType) {

        var Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.Search.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.Search.HospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
        };
        eHnoteMainDashboardDataServices.GetOpAdvanceRevenueDetailReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.AdvanceRevenue = resp.data.AdvanceRevenue || [];
                $scope.Report17ExportHistry = resp.data.AdvanceRevenue;
                generateTable($scope.Report17ExportHistry, 'Advance Amount');
            }
            else {
                $scope.AdvanceRevenueDetailArray = resp.data.AdvanceRevenue;
                $scope.TotalAdvanceRevenueDetailReport = resp.data.count;

            }

        }, function (err) { });
    };
    // endreport17

    $scope.GetGSTReport = function (PageNumber, reportType) {

        var Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.Search.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.Search.HospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
        };
        eHnoteMainDashboardDataServices.GetGSTReport(Object).then(function (resp) {
            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.GSTReportExportHistry = resp.data.rows;
                generateTable($scope.GSTReportExportHistry, 'GST Report');
            }
            else {
                $scope.GSTReportDetailArray = resp.data.rows;
                $scope.TotalGSTDetailReport = resp.data.count;

            }

        }, function (err) { });
    };
    //report42
    $scope.GetIncentiveReport = function (PageNumber, reportType) {
        var Object = {
            "DoctorId": $scope.Search.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalID": $scope.Search.HospitalId,
            "AllHospitalsIndicator": $scope.Search.AllHospitalsIndicator,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageNumber": PageNumber ? PageNumber : 1,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "ReportType": reportType

        };

        eHnoteMainDashboardDataServices.GetIncentiveReport(Object).then(function (resp) {
            if (reportType === 'export' && $scope.Search.AllHospitalsIndicator == 1) {
                if (resp.data != "") {
                    var file = new Blob([resp.data], { type: "text/csv" });
                    saveAs(file, "IncentiveReport" + 1 + ".csv");
                }
            } else {
                if (resp.data.status === "Success") {
                    if (reportType === 'export') {
                        resp.data.rows = resp.data.rows || [];
                        $scope.incentiveExportHistry = resp.data.rows;
                        generateTable($scope.incentiveExportHistry, 'Incentive');
                    } else {
                        $scope.IncentiveReportArray = resp.data.rows;
                        $scope.TotalIncentiveReportCount = resp.data.count;
                        //$scope.exportMaxSize = resp.data.count;


                    }
                }
            }
        }, function (err) { });
    };
    // endreport18
    $scope.GetAccountExpensesReport = function (PageNumber, reportType) {

        var Object = {
            "HospitalList": $scope.Search.HospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "ParentOrganizationId": parentHospitalId,
            "AllHospitalsIndicator": $scope.Search.AllHospitalsIndicator,
            "ReportType": reportType
        };
        eHnoteMainDashboardDataServices.GetExpensesReportByBranch(Object).then(function (resp) {
            if (reportType === 'export' && $scope.Search.AllHospitalsIndicator == 1) {
                if (resp.data != "") {
                    var file = new Blob([resp.data], { type: "text/csv" });
                    saveAs(file, "AccountExpensesReport" + 1 + ".csv");
                }
            } else {

                if (reportType === 'export') {
                    resp.data.Report = resp.data.Report || [];
                    $scope.AccountExpensesExportHistry = resp.data.Report;
                    generateTable($scope.AccountExpensesExportHistry, 'AccountExpenses');
                }
                else {
                    $scope.AccountExpensesArray = resp.data.Report;
                    $scope.TotalAccountExpensesReport = resp.data.Count;

                }
            }

        }, function (err) { });
    };
    //end
    $scope.GetOpReferralWiseCostReport = function (PageNumber, reportType) {

        var Object = {

            "DoctorId": $scope.Search.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.Search.HospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1


        };
        eHnoteMainDashboardDataServices.GetOpReferralWiseCostReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.ReferralReport = resp.data.ReferralReport || [];
                    $scope.Report15ExportHistry = resp.data.ReferralReport;
                    generateTable($scope.Report15ExportHistry, 'ReferralWise Cost Report');
                }
                else {
                    $scope.ReferralWiseCostReportArray = resp.data.ReferralReport;
                    $scope.TotalReferralWiseCostReport = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    //report43
    $scope.GetConvertedPatientReportByTreatment = function (PageNumber, reportType) {

        var Object = {
            //"IsParentOrganization": true,
            "HospitalsList": $scope.Search.HospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "ReportType": reportType,
            "AllHospitalsIndicator": $scope.Search.AllHospitalsIndicator,

        };
        //if (Object.OrganizationId === null || Object.OrganizationId === 0) {
        //    Object.OrganizationId = parentHospitalId;
        //} else {
        //    Object.IsParentOrganization = false;
        //}
        eHnoteMainDashboardDataServices.GetConvertedPatientReportByTreatment(Object).then(function (resp) {
            if (reportType === 'export' && $scope.Search.AllHospitalsIndicator == 1) {
                if (resp.data != "") {
                    var file = new Blob([resp.data], { type: "text/csv" });
                    saveAs(file, "ConvertedPatientReportByTreatment" + 1 + ".csv");
                }
            } else {
                if (reportType === 'export') {
                    //resp.data.Report = resp.data.Report || [];
                    $scope.ConvertedPatientReportByTreatmentExportHistry = resp.data.rows;
                    generateTable($scope.ConvertedPatientReportByTreatmentExportHistry, 'ConvertedPatientReportByTreatment');
                }
                else {
                    $scope.ConvertedPatientReportByTreatmentArray = resp.data.rows;
                    $scope.TotalConvertedPatientReportByTreatment = resp.data.Count;

                }

            }
        }, function (err) { });
    };
    //report41

    $scope.GetWaivedOffReport = function (PageNumber, reportType) {

        var Object = {
            "DoctorId": $scope.Search.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.Search.HospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "ReportType": reportType,
            "AllHospitalsIndicator": $scope.Search.AllHospitalsIndicator,
        };
        eHnoteMainDashboardDataServices.GetWaviedOffPatientReport(Object).then(function (resp) {
            if (reportType === 'export' && $scope.Search.AllHospitalsIndicator == 1) {
                if (resp.data != "") {
                    var file = new Blob([resp.data], { type: "text/csv" });
                    saveAs(file, "Waived Off Report" + 1 + ".csv");
                }
            } else {
                if (resp.data.Status === "Success") {
                    if (reportType === 'export') {
                        resp.data.rows = resp.data.rows || [];
                        $scope.WaivedOffExportHistry = resp.data.rows;
                        generateTable($scope.WaivedOffExportHistry, 'Waived Off Report');
                    }
                    else {
                        $scope.WaivedOffArray = resp.data.rows;
                        $scope.TotalWaivedOffReport = resp.data.count;

                    }
                }
            }


        }, function (err) { });
    };
    //endreport20



    $scope.GetDepartmentWiseRevenueReport = function (PageNumber, reportType) {

        var Object = {
            "DoctorId": $scope.Search.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.Search.HospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "DepartmentName": $scope.Search.SelectedDepartmentId || null
        };
        eHnoteMainDashboardDataServices.GetDepartmentWiseRevenueReport(Object).then(function (resp) {
            if (reportType === 'export') {
                resp.data.ReferralReport = resp.data.ReferralReport || [];
                $scope.DepartmentWiseExportHistry = resp.data.ReferralReport;
                generateTable($scope.DepartmentWiseExportHistry, 'DepartmentWiseRevenueReport');
            }
            else {
                $scope.DepartmentWiseArray = resp.data.ReferralReport;
                $scope.TotalDepartmentWiseReport = resp.data.Count;

            }

        }, function (err) { });
    };
    //endreport20
    $scope.GetTreatmentReport = function (PageNumber, reportType) {
        var Object = {
            "DoctorId": $scope.Search.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalID": $scope.Search.HospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
        };
        eHnoteMainDashboardDataServices.GetTreatmentReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.rows = resp.data.rows || [];
                    $scope.TreatmentExportHistry = resp.data.rows;
                    generateTable($scope.TreatmentExportHistry, 'TreatmentReport');
                }
                else {
                    $scope.TreatmentReportArray = resp.data.rows;
                    //angular.forEach($scope.TreatmentReportArray, function (item) {
                    //    item.CardNumber = item.CardNumber.replace(/\d{4}(?= \d{4})/g, "xxxx");
                    //});
                    $scope.TotalTreatmentReportCount = resp.data.count;
                    //$scope.exportMaxSize = resp.data.count;
                }
            }
        }, function (err) { });
    };
    //report21

    //$scope.GetDailyReport = function (PageNumber, reportType) {
    // var  Object = {
    //        "DoctorId": $scope.Search.DoctorId,
    //        "ParentOrganizationId": parentHospitalId,
    //        "HospitalsList": $scope.Search.HospitalId,
    //        "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
    //        "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
    //        "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
    //        "PageNumber": PageNumber ? PageNumber : 1
    //    };
    //    eHnoteMainDashboardDataServices.GetDailyReport(Object).then(function (resp) {

    //        if (resp.data.status === "Success") {
    //            if (reportType === 'export') {
    //                resp.data.rows = resp.data.rows || [];
    //                $scope.DailyExportHistry = resp.data.rows;
    //                generateTable($scope.DailyExportHistry, 'DailyReport');
    //                generateTableDailyReport($scope.DailyExportHistry, 'DailyReport');
    //            }
    //            else {
    //                $scope.DailyReportArray = resp.data.rows;
    //                angular.forEach($scope.DailyReportArray, function (data, index) {
    //                    data.ContentShow = false;
    //                });
    //                $scope.TotalDailyReportCount = resp.data.count;
    //                $scope.exportMaxSize = resp.data.count == 0 ? $scope.exportMaxSize : resp.data.count;
    //            }
    //        }


    //    }, function (err) { });
    //};


    //endreport37
    $scope.GetConsolidatedIncentiveReport = function (PageNumber, reportType) {
        var Object = {
            // "TreatmentDoctorId": $scope.reportSearch.DoctorId,
            //  "ConvesionDoctorId": $scope.reportSearch.ConversionDoctorId,
            "DoctorId": $scope.Search.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "StartDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.Search.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
        };
        eHnoteMainDashboardDataServices.GetConsolidatedIncentiveReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.ConsolidatedIncentiveExportHistry = resp.data.rows;
                generateTable($scope.ConsolidatedIncentiveExportHistry, 'Consolidated Incentive Report');
            }
            else {
                $scope.ConsolidatedIncentiveArray = resp.data.rows;
                $scope.TotalConsolidatedIncentiveReport = resp.data.count;

            }

        }, function (err) { });
    };

    $scope.data = ReportUtilites.getLeadData();
    $scope.initchild = function () {
        //  $scope.$on("GetreportData", function (evt, data) {
        var type = $scope.data.type;
        $scope.showDepartmentReportDiv = false;
        $scope.showTreatmentRevenueReportDiv = false;
        $scope.showAccountRevenueReportDiv = false;
        $scope.showOpAdvanceRevenueDetailDiv = false;
        $scope.showGSTReportDiv = false;
        $scope.showIncentiveReportDiv = false;
        $scope.showAccountExpensesReportDiv = false;
        $scope.showOPReferralWiseCostReportDiv = false;
        $scope.showConvertedPatientReportByTreatmentDiv = false;
        $scope.showwaivedoffReportDiv = false;
        $scope.showDepartmentWiseRevenueReportDiv = false;
        $scope.showTreatmentReportDiv = false;
        $scope.showDailyReportDiv = false;
        $scope.showDepartmentdiv = false;
        //  $scope.showDivHospital = true;

        if (type === "Department Revenue Report") {
            // $scope.showDivHospital = true;   
            $scope.showDepartmentReportDiv = true;
            $scope.GetDepartmentReport(1);
        }
        if (type === "TreatmentRevenue") {
            // $scope.showDivHospital = true;   
            $scope.showTreatmentRevenueReportDiv = true;
            $scope.GetTreatmentRevenueReport(1);
        }
        if (type === "AccountRevenue") {
            //$scope.showDivHospital = true;   
            $scope.showAccountRevenueReportDiv = true;
            $scope.GetAccountRevenueReport(1);
        }
        if (type === "Advance Amount") {
            // $scope.showDivHospital = true;   
            $scope.showOpAdvanceRevenueDetailDiv = true;
            $scope.GetOpAdvanceRevenueDetailReport(1);
        }
        if (type === "GST Report") {
            // $scope.showDivHospital = true;   
            $scope.showGSTReportDiv = true;
            $scope.GetGSTReport(1);
        }

        if (type === "IncentiveReport") {
            //  $scope.showDivHospital = true;   
            $scope.showIncentiveReportDiv = true;
            $scope.GetIncentiveReport(1);
        }
        if (type === "AccountExpenses") {
            //  $scope.showDivHospital = true;   
            $scope.showAccountExpensesReportDiv = true;
            $scope.GetAccountExpensesReport(1);
        }
        if (type === "ReferralWise Cost Report") {
            // $scope.showDivHospital = true;   
            $scope.showOPReferralWiseCostReportDiv = true;
            $scope.GetOpReferralWiseCostReport(1);
        }

        if (type === "ConvertedPatientReportByTreatment") {
            //  $scope.showDivHospital = true;   
            $scope.showConvertedPatientReportByTreatmentDiv = true;
            $scope.GetConvertedPatientReportByTreatment(1);
        }
        if (type === "Waived Off Report") {
            $scope.showDivHospital = true;
            $scope.showwaivedoffReportDiv = true;
            $scope.GetWaivedOffReport(1);
        }

        if (type === "DepartmentWiseRevenueReport") {
            $scope.showDivHospital = true;
            $scope.showDepartmentWiseRevenueReportDiv = true;
            $scope.showDepartmentdiv = true;
            $scope.GetDepartmentWiseRevenueReport(1);
        }
        if (type === "TreatmentReport") {
            //  $scope.showDivHospital = true;   
            $scope.showTreatmentReportDiv = true;
            $scope.GetTreatmentReport(1);
        }

        if (type === "Consolidated Incentive Report") {
            $scope.showConsolidatedIncentiveReporttDiv = true;
            $scope.GetConsolidatedIncentiveReport(1);
        }
        //if (type === "DailyReport") {
        //    $scope.showDivTodate = false;       
        //    $scope.showDailyReportJobrunDiv = true;  
        //    $scope.showDailyReportDiv = true;
        //    $scope.GetDailyReport(1);
        //}

    };
    $scope.initchild();





    $scope.getchildReportExport = function () {
        if ($scope.showDepartmentReportDiv) {
            $scope.GetDepartmentReport(1, 'export');
        }
        if ($scope.showTreatmentRevenueReportDiv) {
            $scope.GetTreatmentRevenueReport(1, 'export');
        }
        if ($scope.showAccountRevenueReportDiv) {
            $scope.GetAccountRevenueReport(1, 'export');
        }
        if ($scope.showOpAdvanceRevenueDetailDiv) {
            $scope.GetOpAdvanceRevenueDetailReport(1, 'export');
        }
        if ($scope.showGSTReportDiv) {
            $scope.GetGSTReport(1, 'export');
        }
        if ($scope.showIncentiveReportDiv) {
            $scope.GetIncentiveReport(1, 'export');
        }
        if ($scope.showAccountExpensesReportDiv) {
            $scope.GetAccountExpensesReport(1, 'export');
        }
        if ($scope.showOPReferralWiseCostReportDiv) {
            $scope.GetOpReferralWiseCostReport(1, 'export');
        }

        if ($scope.showConvertedPatientReportByTreatmentDiv) {
            $scope.GetConvertedPatientReportByTreatment(1, 'export');
        }
        //if ($scope.showConvertedPatientReportByTreatmentDiv) {
        //    $scope.GetConvertedPatientReportByTreatment(1, 'export');
        //}
        if ($scope.showwaivedoffReportDiv) {
            $scope.GetWaivedOffReport(1, 'export');
        }
        if ($scope.showDepartmentWiseRevenueReportDiv) {
            $scope.GetDepartmentWiseRevenueReport(1, 'export');
        }


        if ($scope.showTreatmentReportDiv) {
            $scope.GetTreatmentReport(1, 'export');
        }

        if ($scope.showConsolidatedIncentiveReporttDiv) {
            $scope.GetConsolidatedIncentiveReport(1, 'export');
        }

        //if ($scope.showDailyReportDiv) {
        //    $scope.GetDailyReport(1, 'export');
        //}
    };

    $scope.changechildReportDate = function () {

        if ($scope.showDepartmentReportDiv) {
            $scope.GetDepartmentReport(1);
        }
        if ($scope.showTreatmentRevenueReportDiv) {
            $scope.GetTreatmentRevenueReport(1);
        }
        if ($scope.showAccountRevenueReportDiv) {
            $scope.GetAccountRevenueReport(1);
        }
        if ($scope.showOpAdvanceRevenueDetailDiv) {
            $scope.GetOpAdvanceRevenueDetailReport(1);
        }
        if ($scope.showGSTReportDiv) {
            $scope.GetGSTReport(1);
        }
        if ($scope.showIncentiveReportDiv) {
            $scope.GetIncentiveReport(1);
        }
        if ($scope.showAccountExpensesReportDiv) {
            $scope.GetAccountExpensesReport(1);
        }

        if ($scope.showOPReferralWiseCostReportDiv) {
            $scope.GetOpReferralWiseCostReport(1);
        }
        if ($scope.showConvertedPatientReportByTreatmentDiv) {
            $scope.GetConvertedPatientReportByTreatment(1);
        }
        if ($scope.showwaivedoffReportDiv) {
            $scope.GetWaivedOffReport(1);
        }
        if ($scope.showDepartmentWiseRevenueReportDiv) {
            $scope.GetDepartmentWiseRevenueReport(1);
        }
        if ($scope.showTreatmentReportDiv) {
            $scope.GetTreatmentReport(1);
        }
        if ($scope.showDailyReportDiv) {
            $scope.GetDailyReport(1);
        }
        if ($scope.showConsolidatedIncentiveReporttDiv) {
            $scope.GetConsolidatedIncentiveReport(1);
        }
    }

    $scope.ChangeReportPage = function (PageNumber, type) {
        if (type === "TreatmentRevenue") {
            $scope.GetTreatmentRevenueReport(PageNumber);
        }
        if (type === "Department Revenue Report") {
            $scope.GetDepartmentReport(PageNumber);
        }
        if (type === "AccountRevenue") {
            $scope.GetAccountRevenueReport(PageNumber);
        }
        if (type === "Advance Amount") {
            $scope.GetOpAdvanceRevenueDetailReport(PageNumber);
        }
        if (type === "GST Report") {
            $scope.GetGSTReport(PageNumber);
        }
        if (type === "IncentiveReport") {
            $scope.GetIncentiveReport(PageNumber);
        }
        if (type === "AccountExpenses") {
            $scope.GetAccountExpensesReport(PageNumber);
        }
        if (type === "ReferralWise Cost Report") {
            $scope.GetOpReferralWiseCostReport(PageNumber);
        }
        if (type === "ConvertedPatientReportByTreatment") {
            $scope.GetConvertedPatientReportByTreatment(PageNumber);
        }
        if (type === "Waived Off Report") {
            $scope.GetWaivedOffReport(PageNumber);
        }
        if (type === "DepartmentWiseRevenueReport") {
            $scope.GetDepartmentWiseRevenueReport(PageNumber);
        }
        if (type === "TreatmentReport") {
            $scope.GetTreatmentReport(PageNumber);
        }
        if (type === "DailyReport") {
            $scope.GetDailyReport(PageNumber);
        }
        if (type === "Consolidated Incentive Report") {
            $scope.GetConsolidatedIncentiveReport(PageNumber);
        }

    };















    function generateTable(jsonData, typeValue) {
        var ReportName = "";
        var reports_exportData = [];
        if (typeValue === "TreatmentRevenue") {
            ReportName = "Treatment Revenue";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Name': itemExports.Name,
                    'Amount': itemExports.Amount

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Department Revenue Report") {
            ReportName = "Department Revenue Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Department': itemExports.Department ? itemExports.Department : "",
                    'Treatment': itemExports.Treatment,
                    'Amount': itemExports.Revenue
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Incentive") {
            ReportName = "Incentive Report";
            reports_exportData.length = 0;
            if (doctorinfo.doctordata.User[0].SpecializationId === 2) {
                angular.forEach(jsonData, function (itemExports) {
                    reports_exportData.push({

                        'SNO': itemExports.SNO ? itemExports.SNO : '',
                        'Date': $filter('date')(new Date(itemExports.BillingDate), "dd-MMMM-yyyy"),
                        'MR No': itemExports.PatientDisplayId,
                        'Patient Name': itemExports.FirstName,
                        "Receipt No": itemExports.ReceiptId,
                        'Procedure Type': itemExports.ProcedureType,
                        'Treatment Name': itemExports.ProcedureName ? itemExports.ProcedureName : '',
                        'Total Amount': itemExports.TotalAmount,
                        'Conversion Doctor Name': itemExports.ConversionDoctorName ? itemExports.ConversionDoctorName : '',
                        'Conversion Amount': itemExports.ConversionAmount ? itemExports.ConversionAmount : '',
                        'Treatment Doctor Name': itemExports.TreatmentDoctorName ? itemExports.TreatmentDoctorName : '',
                        'Treatment Amount': itemExports.TreatmentAmount ? itemExports.TreatmentAmount : '',
                        'Consultant Doctor Name': itemExports.ConsultantDoctorName ? itemExports.ConsultantDoctorName : '',
                        'Region': itemExports.Region ? itemExports.Region : '',
                        'State': itemExports.State ? itemExports.State : ''
                    });
                });
            }
            else {
                angular.forEach(jsonData, function (itemExports) {
                    reports_exportData.push({
                        'SNO': itemExports.SNO ? itemExports.SNO : '',
                        'Date': $filter('date')(new Date(itemExports.BillingDate), "dd-MMMM-yyyy"),
                        'MR No': itemExports.PatientDisplayId,
                        'Patient Name': itemExports.FirstName,
                        "Receipt No": itemExports.ReceiptId,
                        'Total Amount': itemExports.TotalAmount,
                        'Treatment Name': itemExports.ProcedureName,
                        'Treatment Doctor Name': itemExports.TreatmentDoctorName ? itemExports.TreatmentDoctorName : '',
                        'TreatmentAmount': itemExports.TreatmentAmount ? itemExports.TreatmentAmount : '',
                        'Consultant Doctor Name': itemExports.ConsultantDoctorName ? itemExports.ConsultantDoctorName : '',
                        'Region': itemExports.Region ? itemExports.Region : '',
                        'State': itemExports.State ? itemExports.State : ''
                    });
                });
            }



            jsonData = reports_exportData;
        }
        else if (typeValue === "DailyReport") {
            ReportName = "Daily Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports, Index) {
                reports_exportData.push({
                    //'Sl.No': Index + 1,
                    'SNO': itemExports.SNO,
                    'Particulars': itemExports.Name,
                    'Details': itemExports.Value
                    //"Receipt No": itemExports.ReceiptId,
                    //'Total Amount': itemExports.TotalAmount,
                    //'Treatment Name': itemExports.ProcedureName,
                    //'Conversion Amount': itemExports.ConversionAmount,f
                    //'TreatmentAmount': itemExports.TreatmentAmount
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Advance Amount") {
            ReportName = "Advance Amount";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Patient Id': itemExports.PatientDisplayId,
                    'Patient Name': itemExports.PatientName,
                    'Branch': itemExports.Branch,
                    'Payment Type': itemExports.PaymentType,
                    'Amount': itemExports.Amount

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "GST Report") {
            ReportName = "GST Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Billing Date': itemExports.BillingDate,
                    'MR NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Procedure Name': itemExports.ProcedureName,
                    'Total Received': itemExports.Totalreceived,
                    'GST': itemExports.GST,
                    'Branch': itemExports.OrganizationName

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "ReferralWise Cost Report") {
            ReportName = "ReferralWise Cost Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO ? itemExports.SNO : '',
                    'Source': itemExports.Source,
                    'Amount': itemExports.Amount

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Consolidated Incentive Report") {
            ReportName = "Consolidated Incentive Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO ? itemExports.SNO : '',
                    'Doctor Name': itemExports.DoctorName,
                    'Total Treatment Amount': itemExports.TotalTreatmentAmount,
                    'Incentive Treatment Amount': itemExports.IncentiveTreatmentAmount,
                    'Total Conversion Amount': itemExports.TTotalConversionAmount,
                    'Incentive Conversion Amount': itemExports.IncentiveConversionAmount,
                    'Total Referral Amount': itemExports.TotalRefferalAmount,
                    'Incentive Referral Amount': itemExports.IncentiveRefferalAmount
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "ConvertedPatientReportByTreatment") {
            ReportName = "ConvertedPatientReportByTreatment";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO ? itemExports.SNO : '',
                    'Appointment Date': itemExports.AppointmentDate,
                    'MR NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Status': itemExports.Status,
                    'Branch': itemExports.OrgName

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Waived Off Report") {
            ReportName = "Waived Off Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                //var Procedure = "";
                //var ReceiptId = "";
                //angular.forEach(itemExports.ProcedureName, function (item1, index) {
                //    if (itemExports.ProcedureName.length - 1 === index) {
                //        Procedure += item1.procedureName;
                //        ReceiptId += item1.ReceiptId;
                //    }
                //    else {
                //        Procedure += item1.procedureName + ',';
                //    }
                //});
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'MR No': itemExports.MRNO,
                    'Date': $filter("date")(itemExports.Date, "dd-MM-yyyy"),
                    //'Billing Id': itemExports.BillingId,
                    'Procedure Name (RECEIPT)': itemExports.ProcedureName,

                    'Patient Name': itemExports.PatientName,
                    'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                    'Branch': itemExports.Branch,
                    'Appointment Doctor': itemExports.AppointmentDoctor,
                    //'Procedure Name': itemExports.ProcedureName ? itemExports.ProcedureName : '',
                    //'Procedure Name': Procedure ? Procedure : '',
                    'Treatment Doctor': itemExports.TreatmentDoctor,
                    'Conversion Doctor': itemExports.ConversionDoctor,
                    //'Referral Doctor': itemExports.SalesPerson,
                    'Wavied Off Amount': itemExports.WaviedOffAmount,
                    'Status': itemExports.Status
                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "DepartmentWiseRevenueReport") {
            ReportName = "DepartmentWiseRevenueReport";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO ? itemExports.SNO : '',
                    'MR No': itemExports.PatientDisplayId,
                    'Patient Name': itemExports.PatientName,
                    'Register Date': itemExports.PatientRegisteredDate,
                    'Procedure': itemExports.Procedure,
                    'Appointment Doctor': itemExports.AppointmentDoctor,
                    'Department': itemExports.Department ? itemExports.Department : '',
                    'Billing Date': itemExports.BillingDate ? itemExports.BillingDate : '',
                    'Bill Amount': itemExports.Billing,
                    'Branch': itemExports.OrgName

                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "TreatmentReport") {
            ReportName = "Treatment Report";
            reports_exportData.length = 0;
            if (doctorinfo.doctordata.User[0].SpecializationId === 2) {
                angular.forEach(jsonData, function (itemExports) {
                    //itemExports.CardNumber = itemExports.CardNumber.replace(/.(?=.{4})/g, 'x');
                    // itemExports.CardNumber = itemExports.CardNumber.replace(/\d{4}(?= \d{4})/g, "xxxx");
                    var PaymentType = "";
                    angular.forEach(itemExports.PaymentType, function (item1, index) {
                        if (itemExports.PaymentType.length - 1 === index) {
                            PaymentType += item1.Name;
                        }
                        else {
                            PaymentType += item1.Name + ',';
                        }
                    });

                    reports_exportData.push({
                        'SNO': itemExports.SNO ? itemExports.SNO : '',
                        'Date': $filter('date')(new Date(itemExports.BillingDate), "dd-MMMM-yyyy"),
                        'OP No': itemExports.PatientDisplayId,
                        'Patient Name': itemExports.FirstName,
                        "Branch Name": itemExports.OrgName,
                        // "Department": itemExports.ProcedureType,
                        "Code": itemExports.ProcCode,
                        'Procedure': itemExports.Name,
                        'Treatment Doctor Name': itemExports.TreatmentDoctorName ? itemExports.TreatmentDoctorName : '',
                        'Converting Doctor Name': itemExports.ConversionDoctorName ? itemExports.ConversionDoctorName : '',
                        'Mode Of Payment': PaymentType ? PaymentType : '',
                        'Branch Receipt No': itemExports.ReceiptId,
                        'Transaction Id': itemExports.TransactionNumber,
                        'Card Last 4 Digits Number': itemExports.CardNumber,
                        'Card Type': itemExports.CardType,
                        'Amount': itemExports.TotalAmount,
                        'Region': itemExports.Region ? itemExports.Region : '',
                        'State': itemExports.State ? itemExports.State : ''
                    });
                });
            } else {
                angular.forEach(jsonData, function (itemExports) {
                    //itemExports.CardNumber = itemExports.CardNumber.replace(/.(?=.{4})/g, 'x');
                    //   itemExports.CardNumber = itemExports.CardNumber.replace(/\d{4}(?= \d{4})/g, "xxxx");
                    var PaymentType = "";
                    angular.forEach(itemExports.PaymentType, function (item1, index) {
                        if (itemExports.PaymentType.length - 1 === index) {
                            PaymentType += item1.Name;
                        }
                        else {
                            PaymentType += item1.Name + ',';
                        }
                    });
                    reports_exportData.push({
                        'SNO': itemExports.SNO ? itemExports.SNO : '',
                        'Date': $filter('date')(new Date(itemExports.BillingDate), "dd-MMMM-yyyy"),
                        'OP No': itemExports.PatientDisplayId,
                        'Patient Name': itemExports.FirstName,
                        "Branch Name": itemExports.OrgName,
                        "Department": itemExports.ProcedureType,
                        "Code": itemExports.ProcCode,
                        'Procedure': itemExports.Name,
                        'Treatment Doctor Name': itemExports.TreatmentDoctorName ? itemExports.TreatmentDoctorName : '',
                        // 'Converting Doctor Name': itemExports.ConversionDoctorName ? itemExports.ConversionDoctorName : '',
                        'Mode Of Payment': PaymentType ? PaymentType : '',
                        'Branch Receipt No': itemExports.ReceiptId,
                        'Transaction Id': itemExports.TransactionNumber,
                        'Card Last 4 Digits Number': itemExports.CardNumber,
                        'Card Type': itemExports.CardType,
                        'Amount': itemExports.TotalAmount,
                        'Region': itemExports.Region ? itemExports.Region : '',
                        'State': itemExports.State ? itemExports.State : ''
                    });
                });
            }

            jsonData = reports_exportData;
        }
        else if (typeValue === "AccountRevenue") {
            ReportName = "Account Revenue";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO ? itemExports.SNO : '',
                    'Branch': itemExports.Branch,
                    'New OP': itemExports.NewOp,
                    'Old Op': itemExports.OldOp,
                    'Followup': itemExports.Followup,
                    'Total Op': itemExports.TotalOp,
                    'Cash': itemExports.Cash,
                    'Card': itemExports.Card,
                    'Cheque': itemExports.Cheque,
                    'Paytm': itemExports.Paytm,
                    'Bank': itemExports.Bank,
                    'Bajaj': itemExports.Bajaj,
                    'BharatPe': itemExports.BharatPe,
                    //'CGHS': itemExports.CGHS,
                    'CapitalFloat': itemExports.CapitalFloat,
                    'CreditFair': itemExports.CreditFair,
                    'EZFINANZ': itemExports.EZFINANZ,
                    //'EHS': itemExports.EHS,
                    //'ECHS': itemExports.ECHSCredit,
                    'OnlineTransfer': itemExports.OnlineTransfer,
                    'FreeCharge': itemExports.FreeCharge,
                    'GooglePay': itemExports.GooglePay,

                    'HDFCEMI': itemExports.HDFCEMI,
                    'HDFCPaperLess': itemExports.HDFCPaperLess,
                    'INSURANCE': itemExports.INSURANCE,
                    'Liquiloans': itemExports.Liquiloans,

                    'MobiKwik': itemExports.MobiKwik,
                    'MEDIBuddy': itemExports.MEDIBuddy,
                    //'NTRVS': itemExports.NTRVS,
                    'Online': itemExports.Online,
                    'PhonePe': itemExports.PhonePe,
                    'PatientAdvance': itemExports.PatientAdvance,
                    'RGICredit': itemExports.RGICredit,
                    //'ReturnAdvance': itemExports.ReturnAdvance,
                    //'RefundAmount': itemExports.RefundAmount,

                    'RDT': itemExports.RDT,
                    //'Waived': itemExports.Waived,
                    'UPI': itemExports.UPI,
                    'Total': itemExports.Total
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "AccountExpenses") {
            ReportName = "Account Expenses";
            // tableToExcel(table, "Sheet 1", "" + ReportName + "Report.xls");
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO ? itemExports.SNO : '',
                    'Branch': itemExports.Branch,
                    'New OP': itemExports.NewOP,
                    'Old Op': itemExports.OldOp,
                    'Followup': itemExports.Followup,
                    'Total Op': itemExports.TotalOp,
                    'Salaries Payments': itemExports.SalariesPayments,
                    'Drinking Water Charges': itemExports.DrinkingWaterCharges,
                    'Repairs Maintenance': itemExports.RepairsMaintenance,
                    'Dental Material Purchases': itemExports.DentalMaterialPurchases,
                    'Lab Charges': itemExports.LabCharges,
                    'Hospital Maintenance Payments': itemExports.HospitalMaintenancePayments,
                    'Advertisement Payments': itemExports.AdvertisementPayments,
                    'Electricity Expenses': itemExports.ElectricityExpenses,
                    'Telephone Expenses': itemExports.TelephoneExpenses,
                    'Petrol Expenses': itemExports.PetrolExpenses,
                    'Camp Expenses': itemExports.CampExpenses,
                    'Consultation Payments': itemExports.ConsultationPayments,
                    'Postage Charges': itemExports.PostageCharges,
                    'StaffWelfare': itemExports.StaffWelfare,
                    'TravelConveyance': itemExports.TravelConveyance,
                    'PrintingStationery': itemExports.PrintingStationery,
                    'MedicalExpenses': itemExports.MedicalExpenses,
                    'Employee Adavance': itemExports.EmployeeAdavance,
                    'UniformandBadges': itemExports.UniformandBadges,
                    'Incentivesand Commission': itemExports.IncentivesandCommission,
                    'Head Office': itemExports.HeadOffice,
                    'Total': itemExports.Total
                });
            });
            jsonData = reports_exportData;
        }
        var col = [];
        if (jsonData.length === 0) {
            return;
        }
        for (var i = 0; i < jsonData.length; i++) {
            for (var key in jsonData[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        if (ReportName !== "") {
            var tr = table.insertRow(-1);              // TABLE ROW.        
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold; font-size:18px;";
            tabHead.colSpan = 5;
            tabHead.innerHTML = ReportName;


            //State
            var state = "";
            if ($scope.SelectedState !== "" && $scope.SelectedState !== null && $scope.SelectedState !== undefined) {
                state = $scope.SelectedState.Name;
            } else {
                state = "All  States"
            }

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = 5;
            tabHead.innerHTML = state;


            //Cluster
            var cluster = "";
            if ($scope.Search.SelectedCluster !== "" && $scope.Search.SelectedCluster !== null && $scope.Search.SelectedCluster !== undefined) {
                cluster = $scope.Search.SelectedCluster.Name;
            } else {
                cluster = "All Clusters"
            }

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = 5;
            tabHead.innerHTML = cluster;





            //if ($scope.Search.HospitalId.length > 2) {
            //    tr = table.insertRow(-1);
            //    tabHead = tr.insertCell(-1);
            //    tabHead.style = "border: 1px solid #000;text-align:center;";
            //    tabHead.colSpan = 5;
            //    tabHead.innerHTML = ParentHospitalName;
            //}



            //tr = table.insertRow(-1);
            //tabHead = tr.insertCell(-1);
            //tabHead.style = "border: 1px solid #000;text-align:center;"
            //tabHead.colSpan = 5;
            //tabHead.innerHTML = $scope.reportSearch.DoctorObj.FullName;
            var tr = table.insertRow(-1);
            var tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = 5;
            $scope.Search.Selectedname = $scope.Search.Selectedname || "";
            if ($scope.Search.Selectedname != "" && $scope.Search.Selectedname != undefined) {
                tabHead.innerHTML = $scope.Search.Selectedname.ClinicName;
            }
            else {
                tabHead.innerHTML = "All Locations";
            }


            //var tabHead = tr.insertCell(-1);
            //tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;"
            //tabHead.colSpan = 5;
            //tabHead.innerHTML = $scope.reportSearch.HospitalObj.ClinicName;

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = 5;
            tabHead.innerHTML = "From:" + $scope.Search.FromDate + " - " + "To:" + $scope.Search.ToDate;
            // tabHead.innerHTML = $scope.reportSearch.ToDate;
            var Doctor = "";
            $scope.Search.SelectedDoctor = $scope.Search.SelectedDoctor || null;
            if ($scope.Search.SelectedDoctor !== "" && $scope.Search.SelectedDoctor !== null) {
                Doctor = $scope.Search.SelectedDoctor.FullName;
            } else {
                Doctor = "All  Doctors"
            }

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = 5;
            tabHead.innerHTML = Doctor;



        }
        //tr = table.insertRow(-1);
        //var tabHead1 = tr.insertCell(-1);
        //tabHead1.style = "border: 1px solid #000;text-align:center;font-weight: bold;"
        //tabHead1.colSpan = 5;
        //tabHead1.innerHTML = "[" + new Date().toLocaleString() + "]"

        var tr = table.insertRow(-1);               // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < jsonData.length; i++) {
            tr = table.insertRow(-1);
            tr.style = "border: 1px solid #000;";
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = jsonData[i][col[j]];
            }
        }
        download(table);
    }

    var tableToExcel = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)));
            }, format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                });
            };
        return function (table, name, filename) {
            if (!table.nodeType) table = document.getElementById(table);
            var ctx = {
                worksheet: name || 'Worksheet',
                table: table.innerHTML
            };
            var link = document.createElement("a");
            link.href = uri + base64(format(template, ctx));
            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = filename;
            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    })();

    function download(table) {
        tableToExcel(table, "Sheet 1", "" + $scope.viewtype + "Report.xls");
    }





}]);
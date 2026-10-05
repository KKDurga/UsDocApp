"use strict";
eHnoteWebApp.controller("EhnotePurchaseDashBoardCtrl", ["$scope", "InventoryService", "eHnoteMasterDataService", "alertify", "$filter", "eHnotePrintService", "datapersistanceFactory", "$window", function ($scope, InventoryService, eHnoteMasterDataService, alertify, $filter, eHnotePrintService, datapersistanceFactory, $window) {



    var object = {};

    $scope.ViewType = null;

    $scope.Branches = [];
    $scope.ListArray = [];
    $scope.Search = {
        "FromDate": moment().format("DD-MM-YYYY"),
        "FromDate1": moment().format("DD-MM-YYYY"),
        "ToDate": moment().format("DD-MM-YYYY"),
        "ToDate1": moment().format("DD-MM-YYYY"),
        "EndDate": $filter("date")(new Date().setDate(new Date().getDate() + 60), "dd-MM-yyyy"),
        "OrganizationId": null,
        "SearchPatientTxt":null

    };

    $scope.ShowExportdiv = true;
    $scope.ShowTodatediv = true;
    $scope.ShowTodatediv2 = true;
    $scope.SearchFilterDiv = false;
   
    $scope.Page = { "PageNumber": 1, "PageSize": 10, "MaxSize": 5, "TotalCount": 0 };


    var mObj = datapersistanceFactory.getItem("masterDataArrays");
    $scope.masterPaymentModes = [];
    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
        $scope.masterPaymentModes = mObj.PaymentModes;
    }

    $scope.hospid = "";
   // $scope.Hospitalname = "";
    var parenthospid = "";
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined &&
        doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        parenthospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.DoctorName = doctorinfo.doctordata.User[0].FullName;
       // $scope.Hospitalname = "";
    }

    $scope.DashBoard = { "TotalSales": 0, "TotalPurchases": 0 };
    $scope.GetPharmaDashboard = function () {
        object = {
            "OrganizationId": $scope.Search.OrganizationId,
            "IsParentOrganization": true,
            "FromDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "ToDate": $filter("dateFormatter")($scope.Search.ToDate, "-")
        };
        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.IsParentOrganization = false;
        }
        InventoryService.GetPharmaDashboard(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.DashBoard.TotalSales = resp.data.TotalSalesRevenue;
                $scope.DashBoard.TotalPurchases = resp.data.TotalPurchases;
                $scope.DashBoard.SalesReturns = resp.data.SalesReturns;
                $scope.DashBoard.PurchaseReturns = resp.data.PurchaseReturns;
                $scope.DashBoard.ConvertedPrescriptionCount = resp.data.ConvertedPrescriptionCount;
                $scope.DashBoard.AdvicedPrescriptionCount = resp.data.AdvicedPrescriptionCount;


            } else {
                $scope.DashBoard.TotalSales = 0;
                $scope.DashBoard.TotalPurchases = 0;
                $scope.DashBoard.SalesReturns = 0;
                $scope.DashBoard.PurchaseReturns = 0;
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            alertify.error("Getting Dashboard Failed");
            console.log(err);
        });
    };
    $scope.GetBranches = function () {
        InventoryService.GetBranches(parenthospid).then(function (resp) {
            if (resp.data.Status !== 1) {
                alertify.error(resp.data.Message);
                $scope.Branches = [];
            } else {
                $scope.Branches = resp.data.data;

                $scope.Search.SelectedBranch = $filter("filter")($scope.Branches, { "OrganizationId": $scope.hospid }, true)[0];
                $scope.Search.OrganizationId = $scope.Search.SelectedBranch.OrganizationId;
                $scope.GetPharmaDashboard();
            }
        }, function (err) {
            alertify.error("Getting Branches Failed");
            console.log(err);
        });
    };
    $scope.Init = function () {
        $scope.GetBranches();      

    };
    $scope.Init();
    $scope.GetReport = function (Type) {
        $scope.ViewType = Type;
        $scope.Page.PageNumber = 1;
        $scope.SearchDashBoard();
    };
    $scope.GetPharmaPurchaseReport = function (SearchType) {
        object = {
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "OrganizationId": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
            "IsParentOrganization": true
        };
        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.IsParentOrganization = false;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaPurchaseReport(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.rows);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.Page.TotalCount = resp.data.count;
                    $scope.ListArray = resp.data.rows;
                }
            } else {
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Purchase Report Failed");
            console.log(err);
        });


    };
    //$scope.GetPharmaSalesReport = function (SearchType) {
    //    object = {
    //        "PageSize": $scope.Page.PageSize,
    //        "PageNumber": $scope.Page.PageNumber,
    //        "OrganizationId": $scope.Search.OrganizationId,
    //        "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
    //        "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
    //        "IsParentOrganization": true
    //    };
    //    if (object.OrganizationId === null) {
    //        object.OrganizationId = parenthospid;
    //    } else {
    //        object.IsParentOrganization = false;
    //    }
    //    if (SearchType === "Export") {
    //        object.PageNumber = 1;
    //        object.PageSize = $scope.Page.TotalCount;
    //    }
    //    InventoryService.GetPharmaSalesReport(object).then(function (resp) {
    //        if (resp.data.Status === "Success") {
    //            if (SearchType === "Export") {
    //                $scope.GenerateTable(resp.data.rows);
    //            } else {
    //                $scope.SearchFilterDiv = true;
    //                $scope.Page.TotalCount = resp.data.count;
    //                $scope.ListArray = resp.data.rows;
    //            }
    //        } else {
    //            $scope.Page.TotalCount = 0;
    //            $scope.ListArray = [];
    //            alertify.error(resp.data.Message);
    //        }
    //    }, function (err) {
    //        $scope.Page.TotalCount = 0;
    //        $scope.ListArray = [];
    //        alertify.error("Getting Sales Report Failed");
    //        console.log(err);
    //    });
    //};


    $scope.GetPharmaSalesDetailReport = function (SearchType) {
        object = {
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "HospitalID": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
            "GetAllIndicator": 1
        };


        if (object.HospitalID === null) {
            object.HospitalID = parenthospid;
        } else {
            object.GetAllIndicator = 0;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaSalesDetailReport(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.SalesRevenue);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.Page.TotalCount = resp.data.Count;
                    $scope.ListArray = resp.data.SalesRevenue;
                }
            } else {
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };


    $scope.GetPharmaSalesReturnsReport = function (SearchType) {
        object = {
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "OrganizationId": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
            "IsParentOrganization": true
        };
        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.IsParentOrganization = false;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaSalesReturnsReport(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.rows);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.Page.TotalCount = resp.data.count;
                    $scope.ListArray = resp.data.rows;
                }
            } else {
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };


    $scope.GetPharmaPurchaseReturnReport = function (SearchType) {
        object = {
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "OrganizationId": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
            "IsParentOrganization": true
        };



        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.IsParentOrganization = false;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaPurchaseReturnReport(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.rows);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.Page.TotalCount = resp.data.count;
                    $scope.ListArray = resp.data.rows;
                }
            } else {
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };


    $scope.GetPharmaSalesReportByProductReport = function (SearchType) {
        object = {
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "OrganizationId": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
            "IsParentOrganization": true
        };

        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.IsParentOrganization = false;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaSalesReportByProductReport(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (SearchType === "Export") {
                  
                    $scope.GenerateTable(resp.data.rows);
              
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.Page.TotalCount = resp.data.count;
                    $scope.ListArray = resp.data.rows;
                }
            } else {
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };

    $scope.GetPharmaPurchaseReportByGST = function (SearchType) {
        object = {
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "OrganizationId": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
            "IsParentOrganization": true
        };



        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.IsParentOrganization = false;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaPurchaseReportByGST(object).then(function (resp) {
            if (resp.data.Status === "success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.rows);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.Page.TotalCount = resp.data.count;
                    $scope.ListArray = resp.data.rows;
                }
            } else {
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };


    $scope.GetPharmaSaleReportByGST = function (SearchType) {
        object = {
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "OrganizationId": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
            "IsParentOrganization": true
        };
        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.IsParentOrganization = false;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaSaleReportByGST(object).then(function (resp) {
            if (resp.data.Status === "success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.rows);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.Page.TotalCount = resp.data.count;
                    $scope.ListArray = resp.data.rows;
                }
            } else {
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };


    $scope.GetPharmaAdvicedPrscptnReportByConSultation = function (SearchType) {
        object = {
            "DoctorId": 0,
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "OrganizationId": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
            "IsParentOrganization": true
        };
        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.IsParentOrganization = false;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaAdvicedPrscptnReportByConSultation(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.rows);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.ShowExportdiv = true;
                    $scope.Page.TotalCount = resp.data.count;
                    $scope.ListArray = resp.data.rows;
                }
            } else {
                $scope.ShowExportdiv = false;
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };

 
    $scope.GetPharmaExpiryStockReport = function (SearchType) {
        object = {
            //"DoctorId": 0,
            "IsExpiry":'Expired',
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "OrganizationId": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate1, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate1, "-"),
            "SearchText": $scope.Search.SearchPatientTxt ? $scope.Search.SearchPatientTxt : null,
            "GetallIndicator": true
        };
        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.GetallIndicator = false;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaExpiryStockReport(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.Rows);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.ShowExportdiv = true;
                    $scope.Page.TotalCount = resp.data.Count;
                    $scope.ListArray = resp.data.Rows;
                }
            } else {
                $scope.ShowExportdiv = false;
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };


    $scope.GetPharmaReadyToExpireStockReport = function (SearchType) {
        object = {
            //"DoctorId": 0,
            "IsExpiry": 'ReadyToExpire',
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "OrganizationId": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate1, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.EndDate, "-"),
            "SearchText": $scope.Search.SearchPatientTxt ? $scope.Search.SearchPatientTxt : null,
            "GetallIndicator": true
        };
        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.GetallIndicator = false;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaReadyToExpireStockReport(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.Rows);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.ShowExportdiv = true;
                    $scope.Page.TotalCount = resp.data.Count;
                    $scope.ListArray = resp.data.Rows;
                }
            } else {
                $scope.ShowExportdiv = false;
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };

    $scope.GetPharmaConvertedPrscptnReport = function (SearchType) {
        object = {
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "OrganizationId": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
            "IsParentOrganization": true,
            // "DoctorId": 0
        };
        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.IsParentOrganization = false;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaConvertedPrscptnReport(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.rows);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.ShowExportdiv = false;
                    $scope.Page.TotalCount = resp.data.count;
                    $scope.ListArray = resp.data.rows;
                }
            } else {
                $scope.ShowExportdiv = false;
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };
    $scope.GetpharmaNonMovingStockReport = function (SearchType) {
      
       var object = {
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "OrganizationId": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
            "GetAllIndicator": true,
            // "DoctorId": 0
        };
        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.GetAllIndicator = false;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetpharmaNonMovingStockReport(object).then(function (resp) {
            if (resp.data.status === "Success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.rows);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.ShowExportdiv = true;
                    $scope.Page.TotalCount = resp.data.Count;
                    $scope.ListArray = resp.data.rows;
                }
            } else {
                $scope.ShowExportdiv = false;
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };


    $scope.GetPharmaWaivedOffReport = function (SearchType) {
        object = {
            "PageSize": $scope.Page.PageSize,
            "PageNumber": $scope.Page.PageNumber,
            "HospitalID": $scope.Search.OrganizationId,
            "StartDate": $filter("dateFormatter")($scope.Search.FromDate, "-"),
            "EndDate": $filter("dateFormatter")($scope.Search.ToDate, "-"),
            "GetAllIndicator": 1
        };


        if (object.HospitalID === null) {
            object.HospitalID = parenthospid;
        } else {
            object.GetAllIndicator = 0;
        }
        if (SearchType === "Export") {
            object.PageNumber = 1;
            object.PageSize = $scope.Page.TotalCount;
        }
        InventoryService.GetPharmaWaivedOffReport(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (SearchType === "Export") {
                    $scope.GenerateTable(resp.data.rows);
                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.Page.TotalCount = resp.data.count;
                    $scope.ListArray = resp.data.rows;
                }
            } else {
                $scope.Page.TotalCount = 0;
                $scope.ListArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting WaivedOff Report Failed");
            console.log(err);
        });
    };



    //report
    $scope.getPaymentDetails = function (pageno, reportType, date, modeType, data, type) {
        object = {
            "PageSize": $scope.Page.PageSize,
            "PageNumber": pageno,
            "OrganizationId": $scope.Search.OrganizationId,
            "PaymentModeId": modeType || 0,
            "Date": date,
            "IsParentOrganization": true
        };
        if (object.OrganizationId === null) {
            object.OrganizationId = parenthospid;
        } else {
            object.IsParentOrganization = false;
        }
        if (type === "export") {
            object.PageNumber = 1;
            object.PageSize = $scope.TotalCount ||10;
        }
        InventoryService.GetPharmaSalesReport(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (type === "export") {
                    $scope.ViewType = "saleDetail";
                    $scope.View = "saleexport";                  
                    $scope.SaleRevenue = resp.data.rows;                 
                    $scope.pagewisetotal = 0;
                    for (var i = 0; i < $scope.SaleRevenue.length; i++) {
                        var product = $scope.SaleRevenue[i];
                        $scope.pagewisetotal += (product.TotalAmount);
                    }
                    $scope.GenerateTable($scope.SaleRevenue);

                } else {
                    $scope.View = "";
                    $scope.SearchFilterDiv = true;
                    $scope.TotalCount = resp.data.count;
                    $scope.ListArray1 = resp.data.rows;
                }
            }
            else {
                $scope.Page.TotalCount = 0;
                $scope.ListArray1 = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray1 = [];
            alertify.error("Getting Purchase Report Failed");
            console.log(err);
        });


    };


    $scope.ShowDashBoard = function () {
        $scope.ViewType = null;
        $scope.SearchFilterDiv = false;
        $scope.ShowTodatediv = true;
        $scope.ShowReadyToExpirediv = false;
        $scope.ShowTodatediv2 = true;
        $scope.showDiagnosisSearchTextDiv = false;
        $scope.Search.SearchPatientTxt = null;
        $scope.GetPharmaDashboard();

    };
    $scope.SearchDashBoard = function () {
        $scope.ShowReadyToExpirediv = false;
        $scope.showDiagnosisSearchTextDiv = false;
        $scope.ShowTodatediv2 = true;
        switch ($scope.ViewType) {
            case null:
                $scope.GetPharmaDashboard();
                break;
            case "Sales":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = true;
                $scope.ShowTodatediv2 = true;
                //$scope.GetPharmaSalesReport();
                $scope.GetPharmaSalesDetailReport();
                break;
            case "Purchase":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = true;
                $scope.ShowTodatediv2 = true;
                $scope.GetPharmaPurchaseReport();
                break;
            case "SalesReturns":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = true;
                $scope.ShowTodatediv2 = true;
                $scope.GetPharmaSalesReturnsReport();
                break;
            case "PurchasesReturns":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = true;
                $scope.ShowTodatediv2 = true;
                $scope.GetPharmaPurchaseReturnReport();
                break;
            case "SalesReportByProduct":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = true;
                $scope.ShowTodatediv2 = true;
                $scope.GetPharmaSalesReportByProductReport();
                break;
            case "PurchaseReportByGST":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = true;
                $scope.ShowTodatediv2 = true;
                $scope.GetPharmaPurchaseReportByGST();
                break;
            case "SaleReportByGST":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = true;
                $scope.ShowTodatediv2 = true;
                $scope.GetPharmaSaleReportByGST();
                break;

            case "AdvicedPrscptnReportByConSultation":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = true;
                $scope.ShowTodatediv2 = true;
                $scope.GetPharmaAdvicedPrscptnReportByConSultation();
                break;

            case "ConvertedPrscptnReport":
                $scope.ShowExportdiv = false;
                $scope.ShowTodatediv = true;
                $scope.ShowTodatediv2 = true;
                $scope.GetPharmaConvertedPrscptnReport();
                break;
            case "PharmaExpiryStockReport":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = false;
                $scope.showDiagnosisSearchTextDiv = true;
                $scope.ShowTodatediv2 = false;
                $scope.GetPharmaExpiryStockReport();
                break;

            case "PharmaReadyToExpireStockReport":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = true;
                $scope.showDiagnosisSearchTextDiv = true;
                $scope.ShowTodatediv2 = false;
                $scope.ShowReadyToExpirediv = true;
                $scope.GetPharmaReadyToExpireStockReport();
                break;
            case "pharmaNonMovingStockReport":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = true;
                $scope.ShowTodatediv2 = true;
                $scope.GetpharmaNonMovingStockReport();
                break;
            case 'saleDetail':
                $scope.getPaymentDetails(1, exportType, date, $scope.modeType, data);
                break;
            case "WaivedOffReport":
                $scope.ShowExportdiv = true;
                $scope.ShowTodatediv = true;
                $scope.ShowTodatediv2 = true;
                $scope.GetPharmaWaivedOffReport();
                break;
        }
    };
    $scope.ExportToExcel = function () {

        switch ($scope.ViewType) {
            case "Sales":
                $scope.GetPharmaSalesDetailReport("Export");
                //$scope.GetPharmaSalesReport("Export");
                break;
            case "Purchase":

                $scope.GetPharmaPurchaseReport("Export");
                break;
            case "SalesReturns":

                $scope.GetPharmaSalesReturnsReport("Export");
                break;
            case "PurchasesReturns":

                $scope.GetPharmaPurchaseReturnReport("Export");
                break;
            case "SalesReportByProduct":

                $scope.GetPharmaSalesReportByProductReport("Export");
                break;
            case "PurchaseReportByGST":
                $scope.GetPharmaPurchaseReportByGST("Export");
                break;
            case "SaleReportByGST":

                $scope.GetPharmaSaleReportByGST("Export");
                break;

            case "AdvicedPrscptnReportByConSultation":
                $scope.GetPharmaAdvicedPrscptnReportByConSultation("Export");
                break;

            case "ConvertedPrscptnReport":
                $scope.GetPharmaConvertedPrscptnReport("Export");
                break;
            case "pharmaNonMovingStockReport":
                $scope.GetpharmaNonMovingStockReport("Export");
                break;
            case "PharmaExpiryStockReport":               
                $scope.GetPharmaExpiryStockReport("Export");
                break;
            case "PharmaReadyToExpireStockReport":               
                $scope.GetPharmaReadyToExpireStockReport("Export");
                break;
            case "WaivedOffReport":
                $scope.GetPharmaWaivedOffReport("Export");
                break;
        }
    };

    $scope.GenerateTable = function (array) {
        var reports_exportData = [];
        reports_exportData.length = 0;
        switch ($scope.ViewType) {
            //case "Sales":
            //    angular.forEach(array, function (itemExports, index) {
            //        reports_exportData.push({
            //            "SNo": itemExports.SNO,
            //            "MR NO": itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
            //            "Receipt No": itemExports.ReceiptId,
            //            //"Bill Id": itemExports.BillId,
            //            "Bill Date": itemExports.BillDate,
            //            "Paid Date": itemExports.PaidDate,
            //            "Name": itemExports.PatientName,
            //            "Mobile": itemExports.MobileNo ? itemExports.MobileNo : '',
            //            "Total Sale": itemExports.TotalAmount,
            //            "Branch": itemExports.OrganizationName
            //        });
            //    });
            //    break;
            case "Sales":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNO": itemExports.SNO,
                        "Date": $filter("date")(itemExports.Date, "dd-MM-yyyy"),
                        "Cash": itemExports.CashAmount,
                        "Card": itemExports.CardAmount,
                        "Cheque": itemExports.ChequeAmount,
                        "Wallet": itemExports.Others
                    });
                });
                break;


            case "saleDetail":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNO": itemExports.SNO,
                        "MR NO": itemExports.PatientDisplayId,
                        "Receipt NO": itemExports.ReceiptId,                       
                        "Bill Date": $filter("date")(itemExports.BillDate, "dd-MM-yyyy"),
                        "Paid Date": $filter("date")(itemExports.PaidDate, "dd-MM-yyyy"),
                        "Name": itemExports.PatientName,
                        "Mobile": itemExports.MobileNo ? itemExports.MobileNo : '',                     
                        "Total Received": itemExports.TotalAmount,
                        "PaymentMode": itemExports.PaymentMode,
                        "Branch": itemExports.OrganizationName
                    });
                });
                $scope.ViewType = "Sales";
                break;

            case "Purchase":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNo": itemExports.SNO,
                        "GRN No": itemExports.PurchaseInvoiceId,
                        "Invoice No": itemExports.InvoiceNo,
                        "Inv Date": itemExports.PurchaseDate,
                        "Discount": itemExports.DiscountValue,
                        "Invoice Amount": itemExports.TotalAmount - itemExports.FrieghtCharges,
                        "FrieghtCharges": itemExports.FrieghtCharges,
                        "Total": itemExports.TotalAmount,
                        "Vendor Name": itemExports.VendorName,
                        "Branch Name": itemExports.OrganizationName
                    });
                });
                break;
            case "SalesReturns":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNo": itemExports.SNO,
                        "MR NO": itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                        "Receipt No": itemExports.ReceiptId,
                        //"Bill Id": itemExports.BillId,
                        "Bill Date": $filter("date")(itemExports.BillDate, "dd-MM-yyyy"),
                        "Return Date": $filter("date")(itemExports.ReturnedDate, "dd-MM-yyyy"),
                        "Name": itemExports.PatientName,
                        "Mobile": itemExports.MobileNo ? itemExports.MobileNo : '',
                        "Product": itemExports.ItemName,
                        "Quantity": itemExports.ReturnQuantity,
                        "Return Amount": itemExports.ReturnedAmount,
                        "Branch": itemExports.OrganizationName
                    });
                });
                break;
            case "PurchasesReturns":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNo": itemExports.SNO,
                        "Invoice Id": itemExports.PurchaseInvoiceId,
                        "Invoice Date": $filter("date")(itemExports.InvoiceDate, "dd-MM-yyyy"),
                        "Return Date": $filter("date")(itemExports.ReturnDate, "dd-MM-yyyy"),
                        "Product Name": itemExports.ProductName,
                        "Quantity(Strips)": itemExports.ReturnQuantity,
                        "Return Amount": itemExports.ReturnedAmount,
                        "Branch": itemExports.OrganizationName
                    });
                });
                break;

            case "SalesReportByProduct":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNo": itemExports.SNO,
                        "Product": itemExports.Product,
                        "Quantity": itemExports.Quantity,
                        "Amount": itemExports.Amount,
                        "Branch": itemExports.OrganizationName
                    });
                });
                break;

            case "PurchaseReportByGST":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNo": itemExports.SNO,
                        "Purchase Invoice Id": itemExports.PurchaseInvoiceId,
                        "InvoiceNo": itemExports.InvoiceNo,
                        "Invoice Date": $filter("date")(itemExports.InvoiceDate, "dd-MM-yyyy"),
                        "Feed Date": $filter("date")(itemExports.FeedDate, "dd-MM-yyyy"),
                        "Branch": itemExports.Branch,
                        "GST(0%)": itemExports.GST0,
                        "GST(5%)": itemExports.GST5,
                        "GST(12%)": itemExports.GST12,
                        "GST(18%)": itemExports.GST18,
                        "GST(28%)": itemExports.GST28,
                        "Tax(0%)": itemExports.Tax0,
                        "Tax(5%)": itemExports.Tax5,
                        "Tax(12%)": itemExports.Tax12,
                        "Tax(18%)": itemExports.Tax18,
                        "Tax(28%)": itemExports.Tax28,
                        "Net Amount": itemExports.NetAmount
                    });

                });
                break;


            case "SaleReportByGST":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNo": itemExports.SNO,
                        "Consume Id": itemExports.ConsumeId,
                        "Feed Date": $filter("date")(itemExports.FeedDate, "dd-MM-yyyy"),
                        "PatientName": itemExports.PatientName,
                        "GSTNumber": itemExports.GSTNumber,
                        "Branch": itemExports.Branch,
                        "GST(0%)": itemExports.GST0,
                        "GST(5%)": itemExports.GST5,
                        "GST(12%)": itemExports.GST12,
                        "GST(18%)": itemExports.GST18,
                        "GST(28%)": itemExports.GST28,
                        "Tax(0%)": itemExports.Tax0,
                        "Tax(5%)": itemExports.Tax5,
                        "Tax(12%)": itemExports.Tax12,
                        "Tax(18%)": itemExports.Tax18,
                        "Tax(28%)": itemExports.Tax28,
                        "Net Amount": itemExports.NetAmount
                    });

                });
                break;

            case "PharmaExpiryStockReport":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNo": itemExports.SNo,
                        "Purchase Date": $filter("date")(itemExports.PurchaseDate, "dd-MM-yyyy"),
                        "Stock DetailId": itemExports.StockDetailId,
                        "Product Name": itemExports.ItemName ? itemExports.ItemName : '',
                        "BatchNumber": itemExports.BatchNumber,
                        "Invoice No": itemExports.InvoiceNo,
                        "Available Stock": itemExports.AvailableStock,
                        "Quantity Sold": itemExports.QuantitySold,
                        "Medicine Type": itemExports.MedicineType,
                        "No Of Units": itemExports.NoOfUnits,
                        "No Of Items": itemExports.NoOfItems,
                        "Free Strips": itemExports.FreeStrips,
                        //"Inventory ItemDetailsId": itemExports.InventoryItemDetailsId,
                        //"Expiry Date": $filter("date")(itemExports.ExpiryDate, "dd-MM-yyyy"),
                        "Expiry Date": itemExports.ExpiryDate,
                        "Branch": itemExports.name
                       
                    });

                });
                break;
            case "PharmaReadyToExpireStockReport":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNo": itemExports.SNo,
                        "Purchase Date": $filter("date")(itemExports.PurchaseDate, "dd-MM-yyyy"),
                        "Stock DetailId": itemExports.StockDetailId,
                        "Product Name": itemExports.ItemName ? itemExports.ItemName : '',
                        "BatchNumber": itemExports.BatchNumber,
                        "Invoice No": itemExports.InvoiceNo,
                        "Available Stock": itemExports.AvailableStock,
                        "Quantity Sold": itemExports.QuantitySold,
                        "Medicine Type": itemExports.MedicineType,
                        "No Of Units": itemExports.NoOfUnits,
                        "No Of Items": itemExports.NoOfItems,
                        "Free Strips": itemExports.FreeStrips,
                        //"Inventory ItemDetailsId": itemExports.InventoryItemDetailsId,
                        //"Expiry Date": $filter("date")(itemExports.ExpiryDate, "dd-MM-yyyy"),
                        "Expiry Date": itemExports.ExpiryDate,
                        "Branch": itemExports.name
                       
                    });
                });
                break;
            case "pharmaNonMovingStockReport":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNo": itemExports.SNO,
                        "Purchase Date": $filter("date")(itemExports.PurchaseDate, "dd-MM-yyyy"),                      
                        "Product Name": itemExports.Product ? itemExports.Product : '',
                        "Batch Number": itemExports.BatchNumber,                   
                        "Available Stock": itemExports.AvailableStock,
                        "Used Stock": itemExports.UsedStock,
                        "PurchaseReturned": itemExports.PurchaseReturnedStock,
                        "Transfered Stock": itemExports.TransferedStock,
                        "Total Stock": itemExports.TotalStock,                  
                        "Expiry": itemExports.Expiry
             
                       
                    });
                });
                break;
            case "AdvicedPrscptnReportByConSultation":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "SNO": itemExports.SNO,
                        "Appointment Date": moment(itemExports.AppointmentDate).format("DD-MMM-YYYY"),
                        "MR NO": itemExports.MRNO,
                        "Patient Name": itemExports.PatientName,
                        "Gender": itemExports.Gender,
                        "Mobile No": itemExports.MobileNo ? itemExports.MobileNo : '', 
                        "Doctor": itemExports.AppointmentDoctor,
                        "Branch": itemExports.OrgName,
                       
             
                       
                    });
                });
                break;
            case "WaivedOffReport":
                angular.forEach(array, function (itemExports, index) {
                    reports_exportData.push({
                        "S.NO": itemExports.SNO,
                        "MR NO": itemExports.MRNO,
                        "PATIENT NAME": itemExports.PatientName,
                        "RECEIPT NO": itemExports.ReceiptNo,
                        "BILLID": itemExports.BillId,
                        "BILL DATE": $filter("date")(itemExports.BillDate, "dd-MM-yyyy"),
                        "ITEM NAME": itemExports.ItemName,
                        "WAIVED OFF AMOUNT": itemExports.WaivedOffAmount,
                        "REMARKS": itemExports.WaivedOffRemarks
                    });
                });
                break;
        }
        array = reports_exportData;
        var col = [];
        for (var i = 0; i < array.length; i++) {
            for (var key in array[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";


        if ($scope.ViewType !== "") {
            var tr = table.insertRow(-1);              // TABLE ROW.        
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold; font-size:18px;";
            tabHead.colSpan = 5;
            tabHead.innerHTML = $scope.ViewType;

            var tr = table.insertRow(-1);
            var tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = 5;
            $scope.SelectedToBranch = $filter("filter")($scope.Branches, function (item, index) { return item.OrganizationId === $scope.Search.OrganizationId }, true)[0];
            $scope.SelectedToBranch = $scope.SelectedToBranch|| "";
            if ($scope.SelectedToBranch != "") {
                tabHead.innerHTML = $scope.SelectedToBranch.OrganizationName;
            }
            else
            {
                tabHead.innerHTML = "All Locations";
            }
            if ($scope.ViewType != "PharmaExpiryStockReport"){
                tr = table.insertRow(-1);
                tabHead = tr.insertCell(-1);
                tabHead.style = "border: 1px solid #000;text-align:center;";
                tabHead.colSpan = 5;
                tabHead.innerHTML = "From:" + $scope.Search.FromDate + " - " + "To:" + $scope.Search.ToDate;
            }
           
            else {
                tr = table.insertRow(-1);
                tabHead = tr.insertCell(-1);
                tabHead.style = "border: 1px solid #000;text-align:center;";
                tabHead.colSpan = 5;
                tabHead.innerHTML = "Date:" + $scope.Search.ToDate;

            }

         
        }
        var tr = table.insertRow(-1);
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }

        for (var i = 0; i < array.length; i++) {
            tr = table.insertRow(-1);
            tr.style = "border: 1px solid #000;";
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = array[i][col[j]];
            }
        }
       // var detailsjsonData = JSON.parse(cashdata[i].Details);
        if ($scope.View === "saleexport"){
            tr = table.insertRow(-1);
            var tcRegNo = tr.insertCell(-1);
            tcRegNo.style = "border: 1px solid #000;text-align:right;font-weight: bold; font-size:18px;";
            tcRegNo.colSpan = 8;
            tcRegNo.innerHTML = 'Total Revenue : '+ $scope.pagewisetotal;
        };
            
       

        download(table);
    };
    function download(table) {
        tableToExcel(table, "Sheet 1", "" + $scope.ViewType + "Report.xls");
    }
    var tableToExcel = (function () {
        var uri = "data:application/vnd.ms-excel;base64,",
            template = "<html xmlns: o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'><head><xml><x: ExcelWorkbook><x: ExcelWorksheets><x: ExcelWorksheet><x: Name>{worksheet}</x: Name><x: WorksheetOptions><x: DisplayGridlines/></x: WorksheetOptions></x: ExcelWorksheet ></x: ExcelWorksheets ></x: ExcelWorkbook ></xml ></head><body><table>{table}</table></body></html>",
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
                worksheet: name || "Worksheet",
                table: table.innerHTML
            };
            var link = document.createElement("a");
            link.href = uri + base64(format(template, ctx));
            link.style = "visibility:hidden";
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    })();

    $scope.ChangeDate = function () {
        $scope.Page.PageNumber = 1;
    };
    $scope.ChangeDate1 = function (item) {
        $scope.Search.ToDate1 = item;
    };
    $scope.ChangeDate2 = function (item) {
        $scope.Search.FromDate1 = item;
    };
    $scope.ChangeDate3 = function (item) {
        item = moment(item).format("DD-MM-YYYY");
        $scope.Search.EndDate = item;
    };

    $scope.obj = {
        "FromDate": moment().format("DD-MM-YYYY"),
        "ToDate": moment().format("DD-MM-YYYY")
    };

    $scope.Jobrun = function () {

        $scope.Date = $scope.obj.FromDate;
        $scope.Date = $filter("dateFormatter")($scope.Date, "-");
        InventoryService.GetPharmaOpeningAndClosingStockBalanceJob($scope.hospid, $scope.Date, onSuccessBranches, onFailedBranches);
        function onSuccessBranches(data) {
            alertify.success("Successfully Run Job");
            $scope.branchDashboard = data;
            $scope.GetPharmaDashboard();
        }
        function onFailedBranches(data) {
        }
    };


    $scope.currentPage = 1;
    $scope.itemsperpage = 10;
    $scope.PharmaHistorylist = function () {

        var param = {
            "OrganizationId": $scope.hospid,
            "FromDate": $scope.obj.FromDate,
            "ToDate": $scope.obj.ToDate,
            "PageSize": $scope.itemsperpage,
            "PageNo": $scope.PharmacurrentPage

        }
        param.FromDate = $filter("dateFormatter")(param.FromDate, "-");
        param.ToDate = $filter("dateFormatter")(param.ToDate, "-");
        InventoryService.GetPharmaOpeningAndClosingStockHistory(param.OrganizationId, param.FromDate, param.ToDate, param.PageSize, param.PageNo, onSuccessBranches, onFailedBranches);
        function onSuccessBranches(data) {
            $scope.branchlistOptical = data.HistoryList;
            $scope.totalItems = data.count;
           // console.log($scope.branchlistOptical);
        }
        function onFailedBranches(data) {
            $scope.branchlistDashboards = [];
        }

    };
    $scope.PharmacurrentPage = 1;
    $scope.pageChangeddashboard = function (pageNo) {
        $scope.PharmacurrentPage = pageNo;
        $scope.PharmaHistorylist();
    };



    $scope.PrintAdvisedPrescription = function (item) {
        //console.log(item);
      
            var printobj = {
                "PatientName": item.PatientName,
                "PatientDisplayId": item.MRNO,
                "Gender": item.Gender,
                "AgeInYears": item.AgeInYears || 0,
                "AgeInMonths": item.AgeInMonths || 0,
                "AgeInDays": item.AgeInDays || 0,
                "MobileNo": item.MobileNo || "",
                "ContactNo": item.ContactNo || "",  
                "Medicines": item.Medicines ? item.Medicines : [],
                "BranchName": item.OrgName,
                "AppointmentDate": item.AppointmentDate,
                "AppointmentDoctor": item.AppointmentDoctor,
                "Address": item.Address,
                "BranchArea": item.BranchArea || "",
                "BranchCity": item.BranchCity || "",
                "BranchState": item.BranchState || "",
                "PinNo": item.PinNo,
                "BranchEmail": item.BranchEmail,
                "BranchPhoneNo": item.BranchPhoneNo,
                "DoctorName": $scope.DoctorName

            }
        eHnotePrintService.generateAdvisedPrescription(printobj);
      
    }

    //$scope.AdvisedPrescription = function (tabno, item, salesubtab) {
    //    // OpticalUtilites.setOpticalData(item);
    //    var object = {
    //        "tabno": tabno,
    //        "salesubtab ": salesubtab
    //    };
    //    $scope.$emit('InventoryPageEvent', { "object": object });
    //};

    $scope.AdvisedPrescription = function (tabno, item, salesubtab) {     
        var object = {
            "tabno": tabno,
            "items": item,
            "salesubtab ": salesubtab
        };
        $scope.$emit('InventoryPageEvent', { "object": object });
    };

    var windowObjectReference;
    $scope.BaseUrl = "https://ehnote-reportviewer.azurewebsites.net/reportviewer.aspx?ParentOrganizationId=";//dev       
    $scope.chnageReport = function (reportName) {

        $scope.ReportName = reportName;

        //$scope.SSRSReportUrl = $scope.BaseUrl + $scope.UrlparentHospitalId + "&reportName=" + $scope.ReportName + "&output=embed";  

        $scope.SSRSReportUrl = $scope.BaseUrl + doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID + "&reportName=" + $scope.ReportName + "&rs:Command=Render&rs:Embed=true";


        var strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=560,height=400,left=10,top=150";
        windowObjectReference = $window.open($scope.SSRSReportUrl, "Report Viewer", strWindowFeatures);


    };

}]);
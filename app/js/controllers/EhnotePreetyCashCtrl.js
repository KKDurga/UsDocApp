eHnoteWebApp.controller('EhnotePreetyCashCtrl', ["$scope", "$log", "$rootScope", "$location", "$uibModal", "$filter", "$timeout", "eHnoteMainAppointmentService", "eHnoteMasterDataService", "eHnoteValidateUsersDataService", "eHnoteLoginStatusService", "datacookieFactory", "$window", "eHnoteCacheStorageService", "datapersistanceFactory", "eHnotePatientDataService", "eHnoteUserAppointmentDataService", "alertify", "eHnoteAccountUserServices", "eHnoteMainAdminServices", function ($scope, $log, $rootScope, $location, $uibModal, $filter, $timeout, eHnoteMainAppointmentService, eHnoteMasterDataService, eHnoteValidateUsersDataService, eHnoteLoginStatusService, datacookieFactory, $window, eHnoteCacheStorageService, datapersistanceFactory, eHnotePatientDataService, eHnoteUserAppointmentDataService, alertify, eHnoteAccountUserServices, eHnoteMainAdminServices) {


    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
    $scope.GetAllIndicator = 1;
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
 
    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path("/login");
        return;
    }





    $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    // $scope.ParentHospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.UserId = doctorInfo.doctordata.User[0].DoctorID;
    $scope.RoleId = doctorInfo.doctordata.UserAddress[0].ExtDetails.RoleID;
    //console.log($scope.RoleId);
     
    $scope.today1 = new Date();
    $scope.PettyCashdate = $filter('date')(new Date(), "dd-MM-yyyy");


    $scope.FromDate = $filter("date")(new Date(), "dd-MM-yyyy");
    $scope.ToDate = $filter("date")(new Date(), "dd-MM-yyyy");

     

    
    $scope.Cashmanagedate = $filter('date')(new Date(), "dd-MM-yyyy");
    $scope.maxSize = 3;

    $scope.currentPage = 1;
    $scope.itemsperpage = 10;
    $scope.Cashitemsperpage = 10;

    $scope.SerchCashManagementlist = function () {



        var params = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.CashManagementHospitalId,
            "CashManagementId": "1",
            "RoleId": $scope.RoleId,
            "PageSize": $scope.Cashitemsperpage,
            "PageNumber": $scope.currentPage,
            "StartDate": $scope.FromDate,
            "EndDate": $scope.ToDate
        };

        params.StartDate = $filter("dateFormatter")(params.StartDate, "-");
        params.EndDate = $filter("dateFormatter")(params.EndDate, "-");

       

        eHnoteAccountUserServices.GetAccountsCashMgmt(params).then(function (resp) {
            $scope.CashMgmtlists = resp.data.CashList;
            $scope.CashtotalItems = resp.data.count;
            console.log($scope.CashMgmtlists);
        }, function (err) {
            $scope.CashMgmtlists = [];
        });
    };


    $scope.init = function () {
        $scope.SerchCashManagementlist();
    }
    $scope.init();

    function empty() {
        $scope.ExpensesList = {
            "ExpensesId": "",
            "ParticularId": "",
            "Amount": "",
            "CashFrom": "",
            "CashTo": "",
            "CreatedDt": "",
            "CreatedBy": "",
            "remarks": "",
            "ModifiedDt": "",
            "ModifiedBy": "",
            "DelInd": "0"

        };
    }
    empty();




    $scope.SerchExpenseslist = function () {
        var params = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.BranchId,
            "ExpensesId": "0",
            "RoleId": $scope.RoleId,
            "PageSize": $scope.itemsperpage,
            "PageNumber": $scope.expensescurrentPage,
            "StartDate": $scope.FromDate,
            "EndDate": $scope.ToDate
        };


        params.StartDate = $filter("dateFormatter")(params.StartDate, "-");
        params.EndDate = $filter("dateFormatter")(params.EndDate, "-");
 

        eHnoteAccountUserServices.GetAccountsExpenses(params).then(function (resp) {
            $scope.expenseslists = resp.data.ExpensesList;
            $scope.totalItems = resp.data.count;
            console.log($scope.expenseslists);
        }, function (err) {
            $scope.expenseslists = [];
        });

    };

    $scope.TabChange = function (type) {
        if (type == 'Expenses') {
            $scope.SerchExpenseslist();
            $scope.ShowAddPettyCash = false;
            //var param = $scope.HospitalId
            eHnoteAccountUserServices.getParticulars($scope.HospitalId, onAddUpdateBranchSuccess, onAddUpdateBranchError);
            function onAddUpdateBranchSuccess(data) {
                $scope.particularlists = data;

                console.log($scope.particularlists);
            }
            function onAddUpdateBranchError(data) {
                alertify.error(data.Message);
            }
        }
        else if (type == 'Dashboard') {
           // $scope.Dashboardlist();
        }
        else if (type == 'Management') {
            $scope.SerchCashManagementlist();
        }

    }




    $scope.dynamicPopover1 = {
        templateUrl: 'ExpensesTemplate.html',
        "scope": $scope
    };
    $scope.AddExpenses = function () {

        if ($scope.ExpensesList.ParticularId == "") {
            alertify.error("Particular  Is Mandatory");
            return false;
        }
        else if ($scope.ExpensesList.Amount == "") {
            alertify.error("Amount Is Mandatory");
            return false;
        }

        else if ($scope.ExpensesList.CashFrom == "") {
            alertify.error("CashFrom  Is Mandatory");
            return false;
        }
        else if ($scope.ExpensesList.CashTo == "") {
            alertify.error("CashTo  Is Mandatory");
            return false;
        }


        var params = {
            "ExpensesId": $scope.ExpensesList.ExpensesId,
            "ParticularId": $scope.ExpensesList.ParticularId,
            "Amount": $scope.ExpensesList.Amount,
            "CashFrom": $scope.ExpensesList.CashFrom,
            "CashTo": $scope.ExpensesList.CashTo,
            "CreatedDt": $scope.PettyCashdate,
            "CreatedBy": $scope.UserId,
            "Remarks": $scope.ExpensesList.remarks,
            "ModifiedDt": $scope.PettyCashdate,
            "OrganizationId": $scope.HospitalId,
            "ModifiedBy": $scope.UserId,
            "DelInd": "0"
        };

        params.CreatedDt = $filter("dateFormatter")(params.CreatedDt, "-");
        params.ModifiedDt = $filter("dateFormatter")(params.ModifiedDt, "-");
     

        eHnoteAccountUserServices.AddUpdateExpenses(params, onAddUpdateBranchSuccess, onAddUpdateBranchError);
        function onAddUpdateBranchSuccess(data) {
            $scope.SerchExpenseslist();
            //alertify.success("Branch added successfully");
            $scope.ShowAddPettyCash = true;

        }
        function onAddUpdateBranchError(data) {
            alertify.error(data.Message);
        }

        empty();
    };

    $scope.EditExpensen = function (item) {

        $scope.ExpensesList = angular.copy(item);

        $scope.ShowAddPettyCash = true;

        //$scope.today = $filter("date")(new Date(), "dd-MMM-yyyy");
        //$scope.currentdate = $filter("date")(new Date(item.CreatedDt), "dd-MMM-yyyy");
        //if ($scope.today === $scope.currentdate)  {
        //    $scope.ExpensesList = item;
        //    console.log($scope.ExpensesList);
        //    $scope.ShowAddPettyCash = true;
        //};

        //alertify.error("Edit current Only  date");

    };

    $scope.RemoveClick = function (item) {
        //$scope.ExpensesList = item;

        r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to Inactivate this referral? ", function () {
            var params = {
                "ExpensesId": item.ExpensesId,
                "ParticularId": item.ParticularId,
                "Amount": item.Amount,
                "CashFrom": item.CashFrom,
                "CashTo": item.CashTo,
                "CreatedDt": $scope.PettyCashdate,
                "CreatedBy": $scope.UserId,
                "Remarks": item.remarks,
                "ModifiedDt": $scope.PettyCashdate,
                "ModifiedBy": $scope.UserId,
                "DelInd": "1"
            }

            eHnoteAccountUserServices.AddUpdateExpenses(params, onDeleteSuccess, onDeleteFailed);

            function onDeleteSuccess(data) {
                $scope.SerchExpenseslist();
                alertify.success('Deleted Successfully');
            }
            function onDeleteFailed(data) {
            }
        }, function () {
            r = "You pressed Cancel!";
        });


    };



    //$scope.maxSize = 6;

    $scope.expensescurrentPage = 1;
    $scope.pageChangedexpenses = function (pageNo) {
        $scope.expensescurrentPage = pageNo;
        $scope.SerchExpenseslist();
    };
    //$scope.pageChangedexpenses = function () {
    //    var params = {
    //        "UserId": $scope.UserId,
    //        "HospitalId": $scope.HospitalId,
    //        "ExpensesId": "0",
    //        "RoleId": $scope.RoleId,
    //        "PageSize": "10",
    //        "PageNumber": "1",
    //        "StartDate": $scope.FromDate,
    //        "EndDate": $scope.ToDate
    //    };

    //    eHnoteAccountUserServices.GetAccountsExpenses(params).then(function (resp) {
    //        $scope.expensescurrentPage = 1;
    //        $scope.totalItems = resp.data.Message;
    //        $scope.expenseslists = resp.data.ExpensesList;

    //    }, function (err) {
    //        $scope.expenseslists = [];
    //    });
    //    $log.log('Page changed to: ' + $scope.currentPage);
    //} 




    $scope.pageChanged = function (pageNo) {
        $scope.currentPage = pageNo;
        $scope.SerchCashManagementlist();
    };
    //$scope.pageChanged = function () {
    //    var params = {
    //        "UserId": $scope.UserId,
    //        "HospitalId": $scope.HospitalId,
    //        "CashManagementId": "0",
    //        "RoleId": $scope.RoleId,
    //        "PageSize": "10",
    //        "PageNumber": "1",
    //        "StartDate": $scope.FromDate,
    //        "EndDate": $scope.ToDate
    //    };

    //    eHnoteAccountUserServices.GetAccountsCashMgmt(params).then(function (resp) {
    //        $scope.currentPage = 1;
    //        $scope.CashMgmtlists = resp.data.CashList;
    //        // $scope.totalItems = resp.data.CashList;
    //        console.log($scope.CashMgmtlists);
    //    }, function (err) {
    //        $scope.CashMgmtlists = [];
    //    });
    //    $log.log('Page changed to: ' + $scope.currentPage);
    //};






    var get_branches = {
        "HospitalID": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID

    };

    eHnoteMainAdminServices.getHospitalDetails(get_branches, onSuccessBranches, onFailedBranches);

    function onSuccessBranches(data) {
        $scope.branchDetails = data.rows;
        console.log($scope.branchDetails);

        $scope.FromBranchList = $filter("filter")(data.rows, function (item, index) { return item.HospitalInfo.HospitalDetails.HospitalID !== $scope.HospitalId });

        $scope.SelectedToBranch = $filter("filter")(data.rows, function (item, index) { return item.HospitalInfo.HospitalDetails.HospitalID === $scope.HospitalId })[0];
        

    }
    function onFailedBranches(data) {
    }

    $scope.EmptyCashmangement = function () {
        $scope.CashManagementList = {
            "CashManagementId": 0,
            "Amount": "",
            "TransactionId": "",
            "BankName": "",
            "AddedBy": "",
            "Comments": "",
            "FromBranchId": "",
            "ToBranchId": "",
            "GivenBy": "",
            "TransferTypeId": "",
            "OrganizationId": "",
            "CreatedBy": "",
            "ModifiedBy": ""


        };
    }
    $scope.EmptyCashmangement();

    $scope.dynamicPopover = {
        templateUrl: 'CashManagemenTemplate.html',
        "scope": $scope
    };
    $scope.sleecttransfer = "1";
    $scope.AddCashDetails = function (sleecttransfer) {

        if (sleecttransfer == "1") {
            if ($scope.CashManagementList.Amount == "") {
                alertify.error("Amount  Is Mandatory");
                return false;
            }
            else if ($scope.CashManagementList.TransactionId == "") {
                alertify.error("TransactionId id Is Mandatory");
                return false;
            }

            else if ($scope.CashManagementList.BankName == "") {
                alertify.error("BankName  Is Mandatory");
                return false;
            }
            else if ($scope.CashManagementList.AddedBy == "") {
                alertify.error("AddedBy  Is Mandatory");
                return false;
            }
            var param = {
                "CashManagementId": $scope.CashManagementList.CashManagementId,
                "Amount": $scope.CashManagementList.Amount,
                "TransactionId": $scope.CashManagementList.TransactionId,
                "BankName": $scope.CashManagementList.BankName,
                "AddedBy": $scope.CashManagementList.AddedBy,
                "Comments": $scope.CashManagementList.remarks,
                "OrganizationId": $scope.HospitalId,
                "CreatedBy": $scope.UserId,
                "TransferTypeId": "1",
                "ModifiedDt": $scope.Cashmanagedate,
                
            }

        

          

        }


        else if (sleecttransfer == "2") {
            if ($scope.CashManagementList.FromBranchId == "") {
                alertify.error("FromBranch name  Is Mandatory");
                return false;
            }
            else if ($scope.CashManagementList.Amount == "") {
                alertify.error("Amount  Is Mandatory");
                return false;
            }
            else if ($scope.CashManagementList.GivenBy == "") {
                alertify.error("GivenBy  Is Mandatory");
                return false;
            }
            else if ($scope.CashManagementList.AddedBy == "") {
                alertify.error("AddedBy id Is Mandatory");
                return false;
            }

            var param = {
                "CashManagementId": $scope.CashManagementList.CashManagementId,
                "Amount": $scope.CashManagementList.Amount,
                "AddedBy": $scope.CashManagementList.AddedBy,
                "Comments": $scope.CashManagementList.remarks,
                "FromBranchId": $scope.CashManagementList.FromBranchId,
                "ToBranchId": $scope.SelectedToBranch.HospitalInfo.HospitalDetails.HospitalID,
                "GivenBy": $scope.CashManagementList.GivenBy,
                "TransferTypeId": "2",
                "OrganizationId": $scope.HospitalId,
                "CreatedBy": $scope.UserId,
                "ModifiedDt": $scope.Cashmanagedate,
                
            }


        }


      

        param.ModifiedDt = $filter("dateFormatter")(param.ModifiedDt, "-");
       

        eHnoteAccountUserServices.AddUpdateCashManagement(param, onAddUpdateBranchSuccess, onAddUpdateBranchError);


        function onAddUpdateBranchSuccess(data) {
            $scope.SerchCashManagementlist();
            $scope.EmptyCashmangement();
            // alertify.success("Branch added successfully");

        }
        function onAddUpdateBranchError(data) {
            alertify.error(data.Message);
        }

    };





    //$scope.Dashboardlist = function () {
    //    var param = {
    //        "OrganizationId": $scope.HospitalId
    //    };

    //    eHnoteAccountUserServices.GetAccountsDashboard($scope.HospitalId, onSuccessBranches, onFailedBranches);

    //    function onSuccessBranches(data) {
    //        $scope.branchDashboard = data;

    //        console.log($scope.branchDashboard);

    //    }
    //    function onFailedBranches(data) {
    //    }
    //};


    $scope.Dashboardlist = function () {
        var param = {
            "OrganizationId": $scope.HospitalId,
            "RoleId": $scope.RoleId,
            "FromDate": $scope.FromDate,
            "ToDate": $scope.ToDate
        };
    
        
        eHnoteAccountUserServices.GetAccountsDashboard(param.OrganizationId, param.RoleId, param.FromDate,param.ToDate, onSuccessBranches, onFailedBranches);

        function onSuccessBranches(data) {
            $scope.branchDashboard = data;
            //console.log($scope.branchDashboard);
        }
        function onFailedBranches(data) {
        }
    };













    //$scope.dynamicPopover = {
    //    templateUrl: 'myPopoverTemplate.html'
    //};


    //$scope.ShowSelectedBranch = false;
    //$scope.HideTransactionID = true;
    //$scope.sleecttransfer = "";
    //$scope.ShowBranchSelect = function (val) {
    //    if (val === 1) {
    //        $scope.ShowSelectedBranch = true;
    //        $scope.HideTransactionID = false;
    //    }
    //    else {
    //        $scope.ShowSelectedBranch = false;
    //        $scope.HideTransactionID = true;
    //    }
    //};

    $scope.ShowAddPettyCash = false;
    $scope.ShowSearchFilter = true;
    $scope.ClickAddPettyCash = function () {
        $scope.ShowAddPettyCash = true;
        $scope.ShowSearchFilter = false;
    }
    $scope.ClickSearchFilter = function () {
        $scope.ShowAddPettyCash = false;
        $scope.ShowSearchFilter = true;
    }
    //
    $scope.ShowTransferedSearchFilter = true;
    $scope.ShowTransfereCash = false;
    $scope.ClickTransferedDetails = function () {
        $scope.ShowTransfereCash = true;
        $scope.ShowTransferedSearchFilter = false;
    }
    $scope.ClickSearchCashFilter = function () {
        $scope.ShowTransfereCash = false;
        $scope.ShowTransferedSearchFilter = true;
    }
    $scope.sleecttransfer = '1';
}]);
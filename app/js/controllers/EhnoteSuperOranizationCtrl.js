eHnoteWebApp.controller("EhnoteSuperOranizationCtrl", ["$scope", "$filter", "$location", "eHnoteValidateUsersDataService", "eHnoteUserDataService", "eHnoteMasterDataService", "datacookieFactory", "alertify", "$rootScope", "eHnoteSettingsDataService", "loginCookieFactory", "eHnotePatientAddressDataServices", "eHnoteMainAppointmentService", "eHnoteDbStaticDataService", "datapersistanceFactory", "localStorageFactory", "eHnoteMainAdminServices", function ($scope, $filter, $location, eHnoteValidateUsersDataService, eHnoteUserDataService, eHnoteMasterDataService, datacookieFactory, alertify, $rootScope, eHnoteSettingsDataService, loginCookieFactory, eHnotePatientAddressDataServices, eHnoteMainAppointmentService, eHnoteDbStaticDataService, datapersistanceFactory, localStorageFactory, eHnoteMainAdminServices) {


    function GetAllParentOrganizations() {
        eHnoteMainAdminServices.GetParentOrganization().then(function (resp) {
            $scope.ParentOrganizationList = resp.data;
            $scope.selectParentBranch = $scope.ParentOrganizationList[0];
            //$scope.ChangeParentOrganizationforRoles($scope.selectParentBranch.ParentOrganizationId);
            //$scope.ChangeParentOrganization($scope.selectParentBranch.ParentOrganizationId);
            //GetOrganizationRoles($scope.selectParentBranch.ParentOrganizationId);
            //loadRolesList($scope.selectParentBranch.ParentOrganizationId);
            $scope.ChangeHospital($scope.selectParentBranch.ParentOrganizationId);
        });
    }
    GetAllParentOrganizations();
    //function Grouplist() {
    //    eHnoteMainAdminServices.GetParentOrganization().then(function (resp) {
    //        $scope.ParentOrganizationListForGroup = resp.data;
    //        $scope.selectParentBranchForGroup = $scope.ParentOrganizationListForGroup[0];
    //        $scope.ChangeHospitalForGroup($scope.selectParentBranchForGroup.ParentOrganizationId);

    //    });
    //}
    //Grouplist();

    //$scope.ChangeHospitalForGroup = function (HospitalId) {
    //    eHnoteMainAdminServices.GetRoles(HospitalId, onListLoadRoleSuccess, onListLoadRoleError);
    //    function onListLoadRoleSuccess(data) {
    //        $scope.HospitalId = data.Hospital;
    //        $scope.listofroles = data.Roles;
    //    }
    //    function onListLoadRoleError(data) {
    //    }
       
    //}

    $scope.ChangeHospital = function (hospid) {
        var pageSize = 100;
        branchListing(pageSize, hospid);
    }

    function branchListing(pageSize, hospid) {
        var get_branches = {
            "pageNumber": 1,
            "HospitalID": parseInt(hospid),
            "pageSize": parseInt(pageSize),
            "IncludeBranch": "Y",
            "ActiveHospital": "Y",
            "ActiveDoctor": "Y"
        };
        eHnoteMainAdminServices.getHospitalDetails(get_branches, onSuccessBranches, onFailedBranches);
    }
    function onSuccessBranches(data) {
        $scope.AllBranchList = data.rows;
        $scope.hospitalDoctorsList = data.rows[0];
        $scope.selectBranch = data.rows[0];
       
        $scope.addHospital = {
            'clinic': data.rows[0]
        };
        $scope.count = data.count;
        $scope.totalItems = data.count;
        $scope.statsCount = data.Stats;
    }
    function onFailedBranches(data) {
    }
    $scope.ChangeSubHospital = function (item) {
        $scope.hospitalDoctorsList = item;
        $scope.selectBranch = item;
}

    $scope.LoginUser = function (Data) {
        datapersistanceFactory.set("SuperAdminUserLoginData", Data);
        var url = "/login";
        $location.url(url);
    }

}]);
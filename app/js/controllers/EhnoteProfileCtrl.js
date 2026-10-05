 

eHnoteWebApp.controller('EhnoteProfileCtrl', ['$scope', '$rootScope', '$filter', 'eHnoteLoginStatusService', 'eHnoteMasterDataService', 'datacookieFactory', '$location', 'eHnoteAdminUserServices', 'eHnoteValidateUsersDataService', 'dateFilter', 'alertify', 'datapersistanceFactory', function ($scope, $rootScope, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, datacookieFactory, $location, eHnoteAdminUserServices, eHnoteValidateUsersDataService, dateFilter, alertify, datapersistanceFactory) {
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
 
    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path('/login');
    }
    $scope.nonedit = "N";
    var docid = eHnoteMasterDataService.getLoginId();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID !== undefined) {
        var ParentHospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        var param = {
            "ParentHospitalID": ParentHospid,
            "USRId": docid,
            "USRType": "ADMIN",
            "ActiveIND": "Y"
        };
        //eHnoteAdminUserServices.AdminGroup(param, onadmingroupSuccess, onadmingroupError);
    }
    function onadmingroupSuccess(data) {
        $scope.adminGrouplist = data;
    }
    function onadmingroupError(data) {
    }
 
    $scope.searchProfileList = '';
    $scope.managebranch = function () {
        $rootScope.showMainPageHeader = true;
        var url = "/managebranch";
        $location.url(url);
    };
    $scope.manageusers = function () {
        $rootScope.showMainPageHeader = true;
        var url = "/manageusers";
        $location.url(url);
    };
    $scope.setDefaultValuetoRoles = function () {
        $scope.rolesCollection = {
            MANBRNS: 'N',
            MANUSRS: 'N',
            MANROLES: 'N',
            LSTCRTEM: 'N',
            BILLSETNG: 'N',
            REGPATIENT: 'N',
            VIEWCASE: 'N',
            EDITPRO: 'N',
            COMUNICATN: 'N',
            RERTSDASH: 'N',
            APPLSTVIEW: 'N',
            BKAPPTMENT: 'N',
            APPVIWBING: 'N',
            APPVIWVITL: 'N',
            STRTCNSULT: 'N',
            WKINCNSULT: 'N',
            UPDTPTIENT: 'N',
            GNLSETNG: 'N',
            VITALSETNG: 'N',
            MEDHRYSTNG: 'N',
            VSTRSNSTNG: 'N',
            DGNOSETNG: 'N',
            REFALSETNG: 'N',
            CONSULTATN: 'N',
            INVSETNG: 'N',
            BILLING: 'N',
            ADMIN: 'N',
            APPOINT: 'N',
            CONSULT: 'N',
            PATIENTS: 'N',
            SETTINGS: 'N',
            ADDCONSULT: 'N',
            IDGENERATN: 'N',
            MEMBERSHIP: 'N',
            OTHERS: 'N'
        };
    };
    $scope.ReadOnly = "N";
    $scope.availableRoles = [];
    $scope.editingItem = [];
    $scope.roleName = '';
    $scope.buttonName = 'ADD ROLE';
    $scope.editingFlag = false;
    $scope.editGroupCode = 0;
    $scope.roleGroup = 'DOCTOR';
    $scope.roleactiveFlag = 'Y';
    $scope.setDefaultValuetoRoles();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    var HospitalId = doctorinfo.hospitalID;
    //eHnoteAdminUserServices.GetRoles(HospitalId, onScuccessRoles, onErrorRoles);
    function onScuccessRoles(data) {
        $scope.availableRoles = data;
    }
    function onErrorRoles(data) {
    }
    $scope.AddorupdateRole = function () {
        if (!$scope.roleName) {
            window.alert("Role Name cannot be empty");
            return;
        }
        var addParam = {
            "GroupName": "",
            "USRType": "DOCTOR",
            "Active": "Y",
            "UserAccessID": [],
            "HospitalID": 0,
            "GroupCode": 0,
            "USRId": 0,
            "RoleID": "",
            "ReadOnly": "N"
        };
        addParam.GroupName = $scope.roleName.toUpperCase();
        addParam.HospitalID = HospitalId;
        addParam.USRId = eHnoteMasterDataService.getLoginId();
        addParam.RoleID = $scope.roleGroup;
        addParam.Active = $scope.roleactiveFlag;
        addParam.ReadOnly = $scope.ReadOnly;
        if ($scope.editingFlag) {
            addParam.GroupCode = parseInt($scope.editGroupCode);
        }
        var i = 1;
        var checkedItems = {};
        angular.forEach($scope.rolesCollection, function (value, key) {
            if (value == 'Y') {
                checkedItems[i] = key;
                i = i + 1;
            }
        });
        if (JSON.stringify(checkedItems) == '{}') {
            var r = confirm("You have not selected any access rights for this Role / Profile. Default profile role settings will be applied to this Role / Profile. Are you sure you want to continue? ");
            if (r == true) {
                addParam.UserAccessID = checkedItems;
                eHnoteAdminUserServices.AddUpdateRoles(addParam, AddcallbackSuccess, AddcallbackError);
            } else {
                return;
            }
        } else {
            addParam.UserAccessID = checkedItems;
            eHnoteAdminUserServices.AddUpdateRoles(addParam, AddcallbackSuccess, AddcallbackError);
        }
    };
    function AddcallbackSuccess(data) {
        $scope.nonedit = "N";
        $scope.availableRoles = data;
        $scope.setDefaultValuetoRoles();
        $scope.roleName = "";
        if ($scope.editingFlag) {
            alertify.success("Roles updated successfully");
        } else {
            alertify.success("Roles added successfully");
        }
        $scope.buttonName = 'ADD ROLE';
        $scope.editingFlag = false;
    }
    function AddcallbackError(data) {
        alertify.error("Oops!! internal error, Please try again");
    }
    $scope.ClearRoles = function () {
        $scope.nonedit = "N";
        $scope.roleName = "";
        $scope.setDefaultValuetoRoles();
        $scope.roleGroup = 'DOCTOR';
        $scope.editingFlag = false;
        $scope.buttonName = 'ADD ROLE';
    };
    $scope.EditClick = function (roleItem) {
        $scope.nonedit = roleItem.ReadOnly;
        $scope.setDefaultValuetoRoles();
        $scope.editingItem = roleItem;
        $scope.editingFlag = true;
        $scope.editGroupCode = roleItem.GroupCode;
        $scope.roleName = roleItem.GroupName;
        $scope.buttonName = 'UPDATE ROLE';
        $scope.roleactiveFlag = roleItem.Active;
        $scope.roleGroup = roleItem.RoleName;
        $scope.ReadOnly = roleItem.ReadOnly;
        angular.forEach(roleItem.UserAccessID, function (value, key) {
            $scope.rolesCollection[value] = 'Y';
        });
    };
    $scope.ActiveClick = function (roleItem) {
    };
    $scope.CheckAll = function (strItem) {
        switch (strItem) {
            case 'admin':
                $scope.rolesCollection.MANBRNS = $scope.rolesCollection.ADMIN,
                    $scope.rolesCollection.MANUSRS = $scope.rolesCollection.ADMIN,
                    $scope.rolesCollection.MANROLES = $scope.rolesCollection.ADMIN,
                    $scope.rolesCollection.LSTCRTEM = $scope.rolesCollection.ADMIN,
                    $scope.rolesCollection.BILLSETNG = $scope.rolesCollection.ADMIN;
                break;
            case 'appoint':
                $scope.rolesCollection.APPLSTVIEW = $scope.rolesCollection.APPOINT,
                    $scope.rolesCollection.BKAPPTMENT = $scope.rolesCollection.APPOINT,
                    $scope.rolesCollection.APPVIWBING = $scope.rolesCollection.APPOINT,
                    $scope.rolesCollection.APPVIWVITL = $scope.rolesCollection.APPOINT,
                    $scope.rolesCollection.STRTCNSULT = $scope.rolesCollection.APPOINT,
                    $scope.rolesCollection.WKINCNSULT = $scope.rolesCollection.APPOINT,
                    $scope.rolesCollection.UPDTPTIENT = $scope.rolesCollection.APPOINT;
                break;
            case 'consult':
                $scope.rolesCollection.CONSULTATN = $scope.rolesCollection.CONSULT,
                    $scope.rolesCollection.BILLING = $scope.rolesCollection.CONSULT;
                break;
            case 'patients':
                $scope.rolesCollection.REGPATIENT = $scope.rolesCollection.PATIENTS,
                    $scope.rolesCollection.VIEWCASE = $scope.rolesCollection.PATIENTS;
                break;
            case 'settings':
                $scope.rolesCollection.GNLSETNG = $scope.rolesCollection.SETTINGS,
                    $scope.rolesCollection.VITALSETNG = $scope.rolesCollection.SETTINGS,
                    $scope.rolesCollection.MEDHRYSTNG = $scope.rolesCollection.SETTINGS,
                    $scope.rolesCollection.VSTRSNSTNG = $scope.rolesCollection.SETTINGS,
                    $scope.rolesCollection.DGNOSETNG = $scope.rolesCollection.SETTINGS,
                    $scope.rolesCollection.REFALSETNG = $scope.rolesCollection.SETTINGS,
                    $scope.rolesCollection.INVSETNG = $scope.rolesCollection.SETTINGS,
                    $scope.rolesCollection.ADDCONSULT = $scope.rolesCollection.SETTINGS,
                    $scope.rolesCollection.IDGENERATN = $scope.rolesCollection.SETTINGS,
                    $scope.rolesCollection.MEMBERSHIP = $scope.rolesCollection.SETTINGS;
                break;
            case 'others':
                $scope.rolesCollection.EDITPRO = $scope.rolesCollection.OTHERS,
                    $scope.rolesCollection.COMUNICATN = $scope.rolesCollection.OTHERS,
                    $scope.rolesCollection.RERTSDASH = $scope.rolesCollection.OTHERS;
                break;
        }
    };
}]);
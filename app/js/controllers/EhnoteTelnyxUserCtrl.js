"use strict";
eHnoteWebApp.controller('EhnoteTelnyxUserCtrl', ['$scope', 'eHnoteMasterDataService', 'eHnoteUserDataService', 'eHnoteMainAdminServices', '$filter', 'NgMap', 'alertify', '$window', '$timeout', '$uibModal', "eHnoteMainAppointmentService", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnoteDbStaticDataService", "eHnotePatientDataService", "eHnotePatientAddressDataServices", "eHnoteSettingsDataService", "eHnotePatientVisitReasonServices", "eHnoteLoginStatusService", function ($scope, eHnoteMasterDataService, eHnoteUserDataService, eHnoteMainAdminServices, $filter, NgMap, alertify, $window, $timeout, $uibModal, eHnoteMainAppointmentService, eHnoteUserAppointmentDataService, localStorageFactory, eHnoteDbStaticDataService, eHnotePatientDataService, eHnotePatientAddressDataServices, eHnoteSettingsDataService, eHnotePatientVisitReasonServices, eHnoteLoginStatusService) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();

    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.ParentHospitalId = 0;
    $scope.HospitalId = 0;
    $scope.AllUsersList = [];
    $scope.AllReceptionUsersList = [];
    $scope.addNewHospital = false;
    
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    }
    $scope.UserId = eHnoteMasterDataService.getLoginId();


    function branchListing(pageSize) {
        pageSize = pageSize || 100;
        var get_branches = {
            "pageNumber": 1,
            "HospitalID": parseInt($scope.ParentHospitalId),
            "pageSize": parseInt(pageSize),
            "IncludeDoctors": "Y",
            "IncludeBranch": "Y",
            "ActiveHospital": "Y",
            "ActiveDoctor": "Y"
        };

        eHnoteMainAdminServices.getHospitalDetails(get_branches, onSuccessBranches, onFailedBranches);
    }
    function onSuccessBranches(data) {
        $scope.hospitalDoctorsList = data.rows;
        //$scope.selectBranch = $scope.hospitalDoctorsList[0];
        $scope.addHospital = {
            "clinic": data.rows[0]
        };
        $scope.changeClinic($scope.selectBranch);
        $scope.count = data.count;
        $scope.totalItems = data.count;
        $scope.statsCount = data.Stats;
    }
    function onFailedBranches(data) {
    }
    //branchListing();





    $scope.telnyxBranches = [];
    $scope.telnyxBranchUsers = [];
    $scope.telnyxCredentialList = [];
    // StatusFilter lives on this object rather than on a bare $scope primitive: the
    // template is pulled in with ng-include, so a primitive ng-model would be written to
    // the child scope and the controller would keep reading the stale '' - which is why
    // the request always went out with IsActive: null.
    // StatusFilter: '' = all, 'true' = active only, 'false' = inactive only
    $scope.telnyxSettings = { SelectedHospitalId: '', SelectedUserId: '', CredentialName: '', StatusFilter: '' };
    $scope.creatingCredential = false;

    var login = eHnoteLoginStatusService.getUserLoginDetails();


    function loadBranches() {
    //    var params = {
    //        "ParentOrganizationId": $scope.ParentHospitalId
     //   };
     //   eHnoteMainAppointmentService.GetTelnyxLinkedHospitals(params).then(function (resp) {
       //     $scope.telnyxBranches = (resp.data && resp.data.rows) || [];
       // });
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        
      var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, NewBranchList, doctorinfo) || []

            $scope.telnyxBranches =angular.copy(BrachesList) || [];
    }


    function loadCredentialList() {
        var params = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "HospitalId": $scope.HospitalId,
            // null => all statuses; true/false => only that status
            "IsActive": $scope.telnyxSettings.StatusFilter === '' ? null : ($scope.telnyxSettings.StatusFilter === 'true')
        }
        eHnoteMainAppointmentService.GetTelnyxUserCredentialsList(params).then(function (resp) {
            $scope.telnyxCredentialList = (resp.data && resp.data.rows) || [];
        });
    }

    $scope.onStatusFilterChange = function () {
        loadCredentialList();
    };






    $scope.createUserCredential = function () {
        if (!$scope.telnyxSettings.SelectedUserId) return;
        $scope.creatingCredential = true;



        var Params = {
            UserId: $scope.UserId,
            TelnyxUserId: $scope.telnyxSettings.SelectedUserId,
            HospitalId: $scope.telnyxSettings.SelectedHospitalId,
            CredentialName: $scope.telnyxSettings.CredentialName
        };

        eHnoteMainAppointmentService.CreateTelnyxUserCredential(Params).then(function (resp) {
            var res = resp.data;
            if (res && res.Status === 'Success') {
                alertify.success('Telnyx User Credentials Created Successfully');
                loadCredentialList();
                loadBranches();          // updates ConfiguredUsers counts if shown
                $scope.clearSelection();
            } else {
                console.error('Create credential failed:', res && res.Message);
            }
        }).finally(function () {
            $scope.creatingCredential = false;
        });
    };


    $scope.clearSelection = function () {
        // Clear only the provisioning form - the list's status filter is not part of it
        $scope.telnyxSettings.SelectedHospitalId = '';
        $scope.telnyxSettings.SelectedUserId = '';
        $scope.telnyxSettings.CredentialName = '';
        $scope.telnyxBranchUsers = [];
    };


    loadBranches();
    loadCredentialList();

    $scope.GetAllUsersByHospitalId = function (id) {

        console.log(id);

        var reqObj = {
            "BranchId": id || 0,
        }

        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.AllReceptionUsersList = [];
                $scope.AllUsersList = [];
                $scope.AllUsersList = resp.rows || [];

                $scope.AllUsersList = _.uniq($scope.AllUsersList, false, function (p) { return p.DoctorID; });

                $scope.AllReceptionUsersList = $scope.AllUsersList || [];
                //$scope.AllReceptionUsersList = $filter("filter")($scope.AllUsersList, function (item) {
                //    return item.RoleId === 2;
                //});

            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.clinicDoctorList = [];

            }
        }

        function onGetUsersFailure(data) {
        }
    };

    $scope.onBranchSelect = function (Id) {
        $scope.telnyxSettings.SelectedUserId = '';
        $scope.telnyxSettings.CredentialName = '';
        $scope.GetAllUsersByHospitalId(Id);
    };

    $scope.onUserSelect = function (userid) {
        console.log(userid);
        var filterUserArray = $filter("filter")($scope.AllReceptionUsersList, function (Nitem) {
            return Nitem.DoctorID === userid;
        }) || [];

        if (filterUserArray.length > 0) {
            var uname = filterUserArray[0].FullName.replace(/\s+/g, '');

            $scope.telnyxSettings.CredentialName = uname + filterUserArray[0].DoctorID + '-Hospital' + $scope.telnyxSettings.SelectedHospitalId;
        }
    };

    // Activate / deactivate without removing the credential.
    $scope.toggleUserCredentialStatus = function (c) {
        if (c.StatusUpdating) return;

        var makeActive = !c.IsActive;
        var textconfirm = makeActive
            ? "Activate calling credential for " + c.UserName + "? They will start receiving calls again."
            : "Deactivate calling credential for " + c.UserName + "? They will stop receiving calls, but the credential is kept.";

        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + textconfirm + "</h4>", function () {
            c.StatusUpdating = true;
            var params = {
                "UserCredentialId": c.UserCredentialId,
                "UserId": $scope.UserId,
                "TelnyxUserId": c.UserId,
                "HospitalId": c.HospitalId,
                "IsActive": makeActive
            };
            eHnoteMainAppointmentService.UpdateTelnyxCredentialStatus(params).then(function (resp) {
                if (resp.data && resp.data.Status === 'Success') {
                    alertify.success(makeActive ? 'Credential activated' : 'Credential deactivated');

                    // Admin toggled their OWN credential: apply it to this session now
                    // instead of waiting for the next heartbeat, so the call bar in the
                    // header reacts immediately.
                    if (c.UserId === $scope.UserId) {
                        $scope.$root.telnyxCredentialActive = makeActive;
                    }

                    loadCredentialList();
                    loadBranches();
                } else {
                    alertify.error((resp.data && resp.data.Message) || 'Unable to update status');
                }
            }).finally(function () {
                c.StatusUpdating = false;
            });
        }, function () {
            return;
        });
    };

    $scope.deleteUserCredential = function (c) {
        console.log(c);
       
        var textconfirm = "Remove calling credential for " + c.UserName + "?They will no longer receive calls.";

        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + textconfirm + "</h4>",function () {
            var params = {
                "UserCredentialId": c.UserCredentialId,
                "UserId": $scope.UserId,
                "DeleteInd": "Y",
                "TelnyxUserId": c.UserId,
                "HospitalId": c.HospitalId
            };
            eHnoteMainAppointmentService.DeleteUserTelnyxCredential(params).then(function (resp) {
                console.log(resp);
                if (resp.data && resp.data.Status === 'Success') {
                    loadCredentialList();
                    loadBranches();
                }
            });
        }, function () {
            return;
        });


        
    };
}]);







"use strict";
eHnoteWebApp.controller('EhnoteAdminProfileCtrl', ['$scope', '$window', 'eHnoteMasterDataService', 'eHnoteMainAdminServices', '$filter', 'NgMap', 'alertify', "eHnoteMainAppointmentService", function ($scope, $window, eHnoteMasterDataService, eHnoteMainAdminServices, $filter, NgMap, alertify, eHnoteMainAppointmentService) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    console.log(doctorinfo);
    var parentHospitalId;
    var hospitalCode;
    var hospitalId;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID !== undefined) {
        parentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        hospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        hospitalCode = "";
    }
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.rolesCollection = {};
    $scope.AllCheck = {};
    $scope.ReadOnly = "N";
    $scope.groupName = {
        "group": ""
    };
    $scope.roleName = {
        "role": ""
    };
    $scope.edit_status = false;
    $scope.delete_status = false;
    $scope.selectAllStatus = true;
    $scope.deselectAllStatus = false;
    $scope.selectGroupCode = '';
    $scope.newDeleteRolepupop = false;
    function loadRights() {
        var params = {
            "USRType": "ADMIN",
            "USRId": doctorinfo.doctorid,
            "RoleID": 1
        };
        eHnoteMainAdminServices.listeHnoteAccessRights(params, onLoadSuccess, onLoadError);
    }
    function onLoadSuccess(data) {
        $scope.rightsList = data;
    }
    function onLoadError(data) {
    }
    function loadRoles() {
        var rolesParams = { "HospitalID": parentHospitalId, "USRId": doctorinfo.doctorid, "USRType": "ADMIN", "ActiveIND": "Y" };
        eHnoteMainAdminServices.getRolesGroup(rolesParams, onLoadRoleSuccess, onLoadRoleError);
    }
    function onLoadRoleSuccess(data) {
        $scope.rolesList = data;
    }
    function onLoadRoleError(data) {
    }
    function loadRolesList() {
        eHnoteMainAdminServices.GetRoles(parentHospitalId, onListLoadRoleSuccess, onListLoadRoleError);
    }
    function onListLoadRoleSuccess(data) {
        $scope.rolesListing = data.Roles;
    }
    function onListLoadRoleError(data) {
    }
    loadRights();
    loadRoles();
    loadRolesList();
    $scope.selectAll = function () {
        $scope.selectAllStatus = false;
        $scope.deselectAllStatus = true;
        angular.forEach($scope.rightsList, function (values) {
            $scope.AllCheck[values.AccessCategoryDesc] = "Y";
            angular.forEach(values.AccessRights, function (items) {
                $scope.rolesCollection[items.AccessID] = "Y";
            });
        });
    };
    $scope.deselectAll = function () {
        $scope.selectAllStatus = true;
        $scope.deselectAllStatus = false;
        angular.forEach($scope.rightsList, function (values) {
            $scope.AllCheck[values.AccessCategoryDesc] = "N";
            angular.forEach(values.AccessRights, function (items) {
                $scope.rolesCollection[items.AccessID] = "N";
            });
        });
    };
    $scope.CheckAll = function (val, check) {
        angular.forEach($scope.rightsList, function (values) {
            if (values.AccessCategoryDesc === check) {
                angular.forEach(values.AccessRights, function (items) {
                    angular.forEach($scope.AllCheck, function (key, innerval) {
                        if (innerval === check) {
                            $scope.rolesCollection[items.AccessID] = key;
                        }
                    });
                });
            }
        });
    };
    $scope.editRoles = function (values) {
        $scope.selectAllStatus = true;
        $scope.deselectAllStatus = false;
        angular.forEach($scope.rightsList, function (i) {
            var newadmincount = 0;
            var admincount = 0;
            $scope.AllCheck[i.AccessCategoryDesc] = "N";
            newadmincount = i.AccessRights.length;
            angular.forEach(i.AccessRights, function (items) {
                $scope.rolesCollection[items.AccessID] = "N";
                angular.forEach(values.UserAccessID, function (data) {
                    if (items.AccessID === data) {
                        admincount = admincount + 1;
                    }
                });
            });
            if (newadmincount === admincount) {
                $scope.AllCheck[i.AccessCategoryDesc] = "Y";
            }
        });
        $scope.edit_status = true;
        $scope.rolesCollection = {};
        $scope.groupName.group = values.GroupName;
        $scope.groupCodeVal = values.GroupCode;
        $scope.selectGroupCode = $scope.groupCodeVal;
        $scope.roleName.role = values.RoleID.toString();
        angular.forEach(values.UserAccessID, function (item) {
            $scope.rolesCollection[item] = "Y";
        });
    };
    $scope.deleteRole = function (values) {
        $window.scrollTo(0, angular.element(document.getElementById('chekin')).offsetTop);
        $scope.edit_status = false;
        $scope.newDeleteRolepupop = true;
        $scope.newValue = values;
        $scope.delete_status = true;
        var addUpdateParams = {
            "GroupName": values.GroupName,
            "USRType": "DOCTOR",
            "Active": "N",
            "HospitalID": hospitalId,
            "GroupID": values.GroupCode,
            "USRId": doctorinfo.doctorid,
            "RoleID": values.RoleID,
            "ReadOnly": "N",
            "UserAccessID": values.UserAccessID
        };
        eHnoteMainAdminServices.AddUpdateRoles(addUpdateParams, onAddUpdateSuccess, onAddUpdateError);
    };
    $scope.isAddUpdateRolevaild = false;
    $scope.addUpdateRole = function () {
        var errorResult = false;
        if (!$scope.delete_status) {
            if ($scope.roleName.role === "") {
                alertify.error("Select Role name cannot be empty");
                errorResult = true;
                return;
            }
            if ($scope.groupName.group === "") {
                alertify.error("Group name cannot be empty");
                errorResult = true;
                return;
            }
            if (Object.keys($scope.rolesCollection).length === 0) {
                alertify.error("Please set the role to the group");
                errorResult = true;
                return;
            }
        }
        if ($scope.edit_status === false) {
            angular.forEach($scope.rolesListing, function (items) {
                if ($scope.roleName.role === items.RoleID && ($scope.groupName.group).toLowerCase() === (items.GroupName).toLowerCase()) {
                    alertify.error("Selected Role and Group name are already exists");
                    errorResult = true;
                    return;
                }
            });
        } else {
            angular.forEach($scope.rolesListing, function (items) {
                if ($scope.roleName.role === items.RoleID && ($scope.groupName.group).toLowerCase() === (items.GroupName).toLowerCase() && $scope.groupCodeVal !== items.GroupCode) {
                    alertify.error("Selected Role and Group name are already exists");
                    errorResult = true;
                    return;
                }
            });
        }
        if (errorResult === false) {
            var addUpdateParams = {
                "GroupName": $scope.groupName.group,
                "USRType": "DOCTOR",
                "Active": "Y",
                "HospitalID": parentHospitalId,
                "GroupID": 0,
                "USRId": doctorinfo.doctorid,
                "RoleID": parseInt($scope.roleName.role),
                "ReadOnly": "N"
            };
            if ($scope.edit_status) {
                addUpdateParams.GroupCode = $scope.groupCodeVal;
            }
            addUpdateParams.UserAccessRights = getKeyPairValue($scope.rolesCollection);
            eHnoteMainAdminServices.AddUpdateRoles(addUpdateParams, onAddUpdateSuccess, onAddUpdateError);
        }
    };
    function onAddUpdateSuccess(data) {
        if ($scope.edit_status) {
            alertify.success("Profile updated successfully");
        }
        else if ($scope.delete_status) {
        }
        else {
            alertify.success("Profile added successfully");
        }
        loadRolesList();
        $scope.resetForm();
        $scope.delete_status = false;
    }
    function onAddUpdateError(data) {
    }
    $scope.resetForm = function () {
        $scope.rolesCollection = {};
        $scope.edit_status = false;
        $scope.delete_status = false;
        $scope.groupCodeVal = "";
        $scope.groupName = {
            "group": ""
        };
        $scope.roleName = {
            "role": ""
        };
        $scope.AllCheck = {};
        $scope.selectAllStatus = true;
        $scope.deselectAllStatus = false;
        $scope.selectGroupCode = '';
    };

    var checkAllStatus = [];
    var checkLengthAccess = [];
    angular.forEach($scope.rightsList, function (status) {
        angular.forEach(status.AccessRights, function (itemStatus) {
            checkLengthAccess.push(itemStatus);
        });
    });
    $scope.accessCheck = function (item, order) {
        var accessListArray = [];
        var temp_arrayVal = [];
        var getParentVal;
        accessListArray.length = 0;
        temp_arrayVal.length = 0;
        angular.forEach($scope.rightsList, function (list) {
            if (list.AccessCategoryID === order.AccessCategoryID) {
                getParentVal = list.AccessCategoryDesc;
            }
            angular.forEach(list.AccessRights, function (accessList) {
                if (order.AccessCategoryID === accessList.AccessCategoryID) {
                    accessListArray.push(accessList);
                }
            });
        });
        var listLength = accessListArray.length;
        angular.forEach(accessListArray, function (manageList) {
            angular.forEach($scope.rolesCollection, function (keyItem, valItem) {
                if (manageList.AccessID === valItem) {
                    if (keyItem === "Y") {
                        temp_arrayVal.push(valItem);
                    }
                }
            });
        });
        if (temp_arrayVal.length === listLength) {
            $scope.AllCheck[getParentVal] = "Y";
        }
        else {
            $scope.AllCheck[getParentVal] = "N";
        }
    };
    $scope.newDeletepupopCancel = function () {
        $scope.newDeleteRolepupop = false;
    };
    $scope.newDeletepupopOk = function () {
        $scope.delete_status = true;
        $scope.edit_status = false;
        $scope.newDeleteRolepupop = false;
        $scope.addUpdateRole($scope.newValue);
        alertify.success("Profile deleted successfully");
    };


    //durga code on 14-03-2018

    $scope.AccessrightsList = [];
    $scope.selectAllRightsStatus = true;
    $scope.Groupobj = {
        "Name": "",
        "Id": 0
    };

    $scope.parentAccessRightsList = [];

    $scope.GetParentBranchAccessRights = function (ParentOrganizationId) {
        eHnoteMainAppointmentService.GetParentBranchAccessRights(ParentOrganizationId, onAddUpdateDoctorSuccess, onAddUpdateDoctorError);
        function onAddUpdateDoctorSuccess(data) {
            console.log(data);
            if (data.Status === 'Success') {
                $scope.parentAccessRightsList = data.rows.AccessRights || [];
                console.log($scope.parentAccessRightsList);
                angular.forEach($scope.parentAccessRightsList, function (mitem) {
                    angular.forEach(mitem.AccessList, function (citem) {
                        citem.GroupAccessRightId = 0;
                        citem.ActiveInd = 'N';
                    });
                });
            } else {
                $scope.parentAccessRightsList = [];
            }
        }
        function onAddUpdateDoctorError(error) {
            console.log(error);
        }
    };
    $scope.GetParentBranchAccessRights(parentHospitalId);
    $scope.ChangeAccessRights = function (roleid) {
        $scope.AccessrightsList = [];
        $scope.AccessrightsList = angular.copy($scope.parentAccessRightsList);
        console.log($scope.AccessrightsList);
    };

    function getAllRoleAccessList(roleid) {
        $scope.AccessrightsList = [];
        var params = { "RoleID": roleid };
        eHnoteMainAdminServices.listeHnoteAccessRights(params, onAccessRightsSuccess, onAccessRightsError);
    }
    function onAccessRightsSuccess(data) {
        if (data !== undefined) {
            if (data.RoleAccess !== undefined) {
                if (data.RoleAccess.length > 0) {
                    $scope.AccessrightsList = data.RoleAccess;

                    for (var i = 0; i < $scope.AccessrightsList.length; i++) {
                        $scope.AccessrightsList[i].isAllCategoryItemsSelected = true;
                    }

                    //var object = {
                    //    "AccessCategoryId": 16,
                    //    "AccessCategoryName": "Tele Appointment",
                    //    "ActiveInd": "Y",
                    //    "AccessList": [
                    //        {
                    //            "AccessRightId": 221,
                    //            "AccessRightName": "Tele Appointment booking",
                    //            "AccessCategoryId": 15,
                    //            "ActiveInd": "Y"
                    //        },
                    //        {
                    //            "AccessRightId": 222,
                    //            "AccessRightName": "Edit Tele Appointment",
                    //            "AccessCategoryId": 15,
                    //            "ActiveInd": "Y"
                    //        },
                    //        {
                    //            "AccessRightId": 223,
                    //            "AccessRightName": "Cancel Tele Appointment",
                    //            "AccessCategoryId": 15,
                    //            "ActiveInd": "Y"
                    //        },
                    //        {
                    //            "AccessRightId": 224,
                    //            "AccessRightName": "Start Tele Consultation",
                    //            "AccessCategoryId": 15,
                    //            "ActiveInd": "Y"
                    //        },
                    //        {
                    //            "AccessRightId": 225,
                    //            "AccessRightName": "Pre-Consultation Access",
                    //            "AccessCategoryId": 15,
                    //            "ActiveInd": "Y"
                    //        } 
                    //    ]
                    //}
                    //$scope.AccessrightsList.unshift(object);

                    $scope.AccessrightsList = eHnoteMainAdminServices.FilterAccessRights($scope.SpecializationId, $scope.AccessrightsList);
                }
            }
        }
    }
    function onAccessRightsError(data) {
        $scope.AccessrightsList = [];
    }


    //$scope.CheckAllCatergoryItems = function (val, id) {
    //    if (val) {
    //        angular.forEach($scope.AccessrightsList, function (item) {
    //            if (item.AccessCategoryId === id) {
    //                item.ActiveInd = "Y";
    //                angular.forEach(item.AccessList, function (subitem) {
    //                    subitem.ActiveInd = "Y";
    //                });
    //            }
    //        });
    //    } else {
    //        angular.forEach($scope.AccessrightsList, function (item) {
    //            if (item.AccessCategoryId === id) {
    //                item.ActiveInd = "N";
    //                angular.forEach(item.AccessList, function (subitem) {
    //                    subitem.ActiveInd = "N";
    //                });
    //            }
    //        });
    //    }
    //};


    $scope.CheckAllCatergoryItems = function (item) {
        item.ActiveInd = item.isAllCategoryItemsSelected ? "Y" : "N";
        angular.forEach(item.AccessList, function (iterator, index) {
            iterator.ActiveInd = item.ActiveInd;
        });
    };



    //$scope.CheckIndividualItem = function (val, id) {
    //    if (val === "Y") {
    //        angular.forEach($scope.AccessrightsList, function (item) {
    //            if (item.AccessCategoryId === id) {
    //                var activecount = 0;
    //                angular.forEach(item.AccessList, function (subitem) {
    //                    if (subitem.ActiveInd === "N") {
    //                        activecount++;
    //                    }
    //                });
    //                if (activecount === 0) {
    //                    item.isAllCategoryItemsSelected = true;
    //                    item.ActiveInd = "Y";
    //                } else {
    //                    item.isAllCategoryItemsSelected = false;
    //                }
    //            }
    //        });
    //    } else {
    //        angular.forEach($scope.AccessrightsList, function (item) {
    //            if (item.AccessCategoryId === id) {
    //                item.isAllCategoryItemsSelected = false;
    //            }
    //        });
    //    }
    //};


    $scope.CheckIndividualItem = function (subitem, item) {
        var CheckedAccessListArray = $filter("filter")(item.AccessList, { "ActiveInd": "N" }) || [];
        if (CheckedAccessListArray.length === 0) {
            item.isAllCategoryItemsSelected = true;
        } else {
            item.isAllCategoryItemsSelected = false;
        }

        var CheckedAccessListData = $filter("filter")(item.AccessList, { "ActiveInd": "Y" }) || [];
        if (CheckedAccessListData.length > 0) {
            item.isAllCategoryItemsSelected = true;
        } else {
            item.isAllCategoryItemsSelected = false;
        }

        if (item.AccessCategoryId === 7) {
            if (item.AccessList[8].AccessRightId === 143 && item.AccessList[8].ActiveInd === 'N') {
                item.AccessList[2].ActiveInd = 'N';
            }

        }
    };


    $scope.addUpdateGroupAccess = function (roleid) {


        if (!$scope.UserAccessRights.AllAccessRights.AdminAddUpdateAccessRights) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }
        var errorResult = false;
        if (roleid === "" || roleid === undefined) {
            alertify.error("Select a Role");
            errorResult = true;
            return;
        }
        if ($scope.Groupobj.Name === "" || $scope.Groupobj.Name === undefined) {
            alertify.error("Please Enter a GroupName");
            errorResult = true;
            return;
        }
        if (errorResult == false) {
            var params = {
                "GroupID": $scope.Groupobj.Id,
                "GroupName": $scope.Groupobj.Name,
                "USRType": "DOCTOR",
                "Active": "Y",
                "HospitalID": parentHospitalId,
                "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
                "SubOrganizationId": doctorinfo.doctordata.UserAddress[0].SubOrganizationId,
                "USRId": doctorinfo.doctorid,
                "RoleID": parseInt(roleid),
                "UserAccessRights": [],
               //  "AccessRights": [],

                "ReadOnly": "N",
                "GroupProfileId": $scope.GroupProfileId
            };

            $scope.selectedAccessrightsList = angular.copy($scope.AccessrightsList);
            if ($scope.selectedAccessrightsList.length !== 0) {
                $scope.selectedAccessrightsList1 = [];
                angular.forEach($scope.selectedAccessrightsList, function (item) {
                    var list = $filter("filter")(item.AccessList, { "ActiveInd": 'Y' }, true);
                    if (list.length !== 0) {
                        item.AccessList = list;
                        $scope.selectedAccessrightsList1.push(item);
                    }

                });
            }
            params.UserAccessRights = $scope.selectedAccessrightsList1;

            console.log(params)
             
            eHnoteMainAdminServices.AddUpdateRoleGroupAccessRights(params, onAddUpdateProfileSuccess, onAddUpdateProfileError);
        }
    };

    $scope.confirmDeleteProfile = function (groupItem) {
        if (groupItem.Active == 'Y') {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this Profile? </h4>", function () {
                var req = {
                    "GroupId": groupItem.GroupId,
                    "Active": "N",
                    "UserId": doctorinfo.doctorid,
                    "RoleId": groupItem.RoleId,
                };
                eHnoteMainAdminServices.DeleteAccessGroupById(req).then(function (response) {
                    if (response.data.status === 'Success') {
                        alertify.success("Profile deleted successfully");
                        getSubOrganizationAccessGroups(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);                     
                    }
                });
            });

        }
    };


    function onAddUpdateProfileSuccess(data) {
        if (data.status === 'Success') {
                if ($scope.edit_status) {
                    alertify.success("Profile updated successfully");
                } else {
                    alertify.success("Profile added successfully");
                }
        } else {
            alertify.error("Some Error Occurred");
        }
        getSubOrganizationAccessGroups(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
        $scope.resetRoleItems();
    }
    function onAddUpdateProfileError(err) {
        alertify.error(err.ExceptionMessage);
    }

    $scope.editGroupProfile = function (groupItem) {
        if (!$scope.UserAccessRights.AllAccessRights.AdminViewAccessRIghts) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }
        $scope.edit_status = true;
        $scope.Groupobj.Id = groupItem.GroupId;
        $scope.Groupobj.Name = groupItem.GroupName;
        $scope.Groupobj.SelectedRoleId = groupItem.RoleID.toString();
        $scope.GroupProfileId = groupItem.GroupProfileId;

        $scope.AccessrightsList = [];
        $scope.AccessrightsList = angular.copy($scope.parentAccessRightsList);

        eHnoteMainAdminServices.getParentSubOrgGroupAccessRightsbyId(groupItem.GroupId, 0, doctorinfo.doctordata.UserAddress[0].SubOrganizationId).then(function (resp) {
            console.log(JSON.stringify(resp));

            if (resp.data.status==='Success') {
                angular.forEach($scope.AccessrightsList, function (pitem) {
                    angular.forEach(resp.data.rows, function (citem) {
                        if (pitem.SubAccessCategoryId === citem.SubAccessCategoryId) {
                            angular.forEach(pitem.AccessList, function (aitem) {
                                aitem.ActiveInd = 'N';
                                    angular.forEach(citem.AccessList, function (sitem) {
                                        if (aitem.AccessRightId === sitem.AccessRightId) {
                                            aitem.ActiveInd = 'Y';
                                        }
                                    });
                                });
                        }
                    });
                });

                angular.forEach($scope.AccessrightsList, function (item) {
                    item.isAllCategoryItemsSelected = false;
                    var list = $filter("filter")(item.AccessList, { "ActiveInd": 'N' }, true);
                    if (list.length === 0) {
                        item.isAllCategoryItemsSelected = true;
                    }
                });
            }

          
        });


      

    };

    $scope.resetRoleItems = function () {
        $scope.edit_status = false;
        $scope.AccessrightsList = [];
        $scope.Groupobj = {
            "Name": "",
            "Id": 0
        };
        $scope.Groupobj.SelectedRoleId = "";
    };

    $scope.selectAllRights = function () {
        $scope.selectAllRightsStatus = false;
        angular.forEach($scope.AccessrightsList, function (item) {
            item.ActiveInd = 'Y';
            item.isAllCategoryItemsSelected = true;
            angular.forEach(item.AccessList, function (subitem) {
                subitem.ActiveInd = 'Y';
            });
        });
    };

    $scope.deselectAllRights = function () {
        $scope.selectAllRightsStatus = true;
        angular.forEach($scope.AccessrightsList, function (item) {
            item.ActiveInd = 'N';
            item.isAllCategoryItemsSelected = false;
            angular.forEach(item.AccessList, function (subitem) {
                subitem.ActiveInd = 'N';
            });
        });
    };

    $scope.subOrganizationGroupsArray = [];
    function getSubOrganizationGroups(SubOrganizationId) {
        
        eHnoteMainAdminServices.getSubOrgGroupsByIdNew(SubOrganizationId).then(function (resp) {
            console.log(resp.data);
            if (resp.data.rows.length > 0) {
                $scope.subOrganizationGroupsArray = resp.data.rows;
            }
        });

        console.log($scope.subOrganizationGroupsArray);

    }

    function getSubOrganizationAccessGroups(SubOrganizationId) {

        eHnoteMainAdminServices.getSubOrganizationGroupAccess(SubOrganizationId).then(function (resp) {
            console.log(resp.data);
            if (resp.data.rows.length > 0) {
                $scope.subOrganizationGroupsArray = resp.data.rows;
            }
        });

        console.log($scope.subOrganizationGroupsArray);

    }


    console.log(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
   // getSubOrganizationGroups(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);

    getSubOrganizationAccessGroups(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);

    $scope.RoleList = [];
    $scope.getSubOrgRoles = function (SubOrganizationId) {
        eHnoteMainAdminServices.GetSubOrganizationsRolesbyId(SubOrganizationId).then(function (resp) {
            console.log(resp.data);
            if (resp.data.row.length > 0) {
                $scope.RoleList = resp.data.row;
            } else {
                $scope.RoleList = [];
            }
        });
        console.log($scope.RoleList);
    };

    $scope.getSubOrgRoles(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
}]);
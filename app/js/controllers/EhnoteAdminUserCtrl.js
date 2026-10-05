"use strict";
eHnoteWebApp.controller('EhnoteAdminUserCtrl', ['$scope', 'eHnoteMasterDataService', 'eHnoteUserDataService', 'eHnoteMainAdminServices', '$filter', 'NgMap', 'alertify', '$window', '$timeout', '$uibModal', "eHnoteMainAppointmentService", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnoteDbStaticDataService", "eHnotePatientDataService", "eHnotePatientAddressDataServices", "eHnoteSettingsDataService", "eHnotePatientVisitReasonServices", "eHnoteInsuranceService", function ($scope, eHnoteMasterDataService, eHnoteUserDataService, eHnoteMainAdminServices, $filter, NgMap, alertify, $window, $timeout, $uibModal, eHnoteMainAppointmentService, eHnoteUserAppointmentDataService, localStorageFactory, eHnoteDbStaticDataService, eHnotePatientDataService, eHnotePatientAddressDataServices, eHnoteSettingsDataService, eHnotePatientVisitReasonServices, eHnoteInsuranceService) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();

    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    var parentHospitalId;
    var hospitalCode;
    var hospitalId;
    var TimeId = 0;
    $scope.addNewHospital = false;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID !== undefined) {
        parentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        hospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        hospitalCode = "";
        $scope.hospitalCD = hospitalCode;
    }
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    var speciality_default_push = { "DoctorSpecialitySEODesc": "", "DoctorSpecialityID": "", "DoctorSpecialityDesc": "Select the speciality", "SpecialityDesc": "", "ActiveIND": "Y" };
    doctorinfo.specialitylist.unshift(speciality_default_push);


  
    $scope.isQUeueManagementEnabled = false;
    //$scope.IsConnectedUsersAvailable = false;
    $scope.checkobj = {
        "IsConnectedUsersAvailable": false
    }
    if (doctorinfo.doctordata.UserAddress.length > 0) {
        $scope.isQUeueManagementEnabled = doctorinfo.doctordata.UserAddress[0].IsEnableQueueManagement;
    }

    eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
    function onspecsuccess(data) {
        $scope.specialitylist = data;
    }
    function onspecfailure(data) {
    }
    $scope.SearchEmergencyAccessFromUser = { "txt1": "", "txt2": "" };
    $scope.SearchEmergencyAccessToUser = { "txt1": "", "txt2": "" };
    $scope.orgOpthalDepartments = [];
    $scope.AdminScheduleObj = {
        "ShowNewAddSchedule": false,
        "IsShowEditSchedule": false,
        "SelectedScheduleIndex": null,
        "SelectedSchedule": "",
        "SelectedHospitalId": hospitalId
    };
    
    if (parentHospitalId != undefined) {

        var params = {
            "ParentOrganizationId": parentHospitalId
        };

        eHnoteUserDataService.getOrgOpthalDepartments(params, ongetDeptSuccess, ongetDeptFailure);
        function ongetDeptSuccess(resp) {
            console.log(JSON.stringify(resp));
            if (resp.data.count > 0) {
                $scope.orgOpthalDepartments = resp.data.rows;
            }

        }
        function ongetDeptFailure(data) {
        }
    }

    $scope.UsersStatusList = [
        {
            "Id": 1,
            "Name": "All"
        },
        {
            "Id": 2,
            "Name": "Active"
        },
        {
            "Id": 3,
            "Name": "Inactive"
        }
    ];
    $scope.AdminEmergencyAccessShowInd =
    {
        "IsEmergencyAccessTabActive": false,
    }

    $scope.changeSpecialization = function (specialization) {
        $scope.hosUserCollection.OpthalDepartments = [];
    }

    $scope.addMoreDepartments = function () {

        var obj = {
            "BranchSubSpecializationId": "",
            "SubSpecializationId": "",
            "SubSpecializationName": "",
            "BranchSpecializationId": "",
            "IsPrimarySubSpecialization": false
        };
        $scope.hosUserCollection.OpthalDepartments.push(obj);
    };

    $scope.EmergencyAccessReportObj = {
        "Date": $filter('date')(new Date(), 'MM-dd-yyyy'),
        "FromUser": "",
        "ToUser": "",
        "AllFromUsersCheck":"",
        "AllToUsersCheck":"",
    }
    $scope.addMoreRole = function () {

        var obj = {
            "RoleId": "",
            "RoleName": "",
            "GroupId": "",
            "GroupName": "",
            "GroupArray": [],
            "isEditHospitaluser": false

        };
        $scope.hosUserCollection.UserBranchRoles.push(obj);
    };

    $scope.removeDepartment = function (item, ind) {


        for (var i = $scope.hosUserCollection.OpthalDepartments.length - 1; i >= 0; i--) {
            if ($scope.hosUserCollection.OpthalDepartments[i].SubSpecializationId === item.SubSpecializationId) {
                $scope.hosUserCollection.OpthalDepartments.splice(i, 1);
            }
        }

    }

    $scope.changePrimaryDepartment = function (item, mitem, index) {
        mitem.IsPrimarySubSpecialization = item;
        if (item === true) {
            angular.forEach($scope.hosUserCollection.OpthalDepartments, function (kitem) {
                if (kitem.SubSpecializationId === mitem.SubSpecializationId) {
                    kitem.IsPrimarySubSpecialization = true;
                }
                else {
                    kitem.SubSpecializationobj.IsPrimarySubSpecialization = false;
                    kitem.IsPrimarySubSpecialization = false;
                }
            });
        }
    }

    $scope.changeSubSpecializationActive = function (item) {
        console.log(item.ActiveInd);
        if (item.ActiveInd == 'N') {
            item.IsPrimarySubSpecialization = false;
        }
    }

    $scope.changePrimarySubSpecialization = function (item) {


        if (item.IsPrimarySubSpecialization) {
            angular.forEach($scope.SubSpecializationsList, function (sitem) {
                if (sitem.SubSpecializationId === item.SubSpecializationId) {
                    sitem.IsPrimarySubSpecialization = true;
                } else {
                    sitem.IsPrimarySubSpecialization = false;
                }
            });
        }

    }


    $scope.removeRole = function (item, ind) {

        //  if (item.TreatmentData.TreatmentHistoryId === 0) {
        $scope.hosUserCollection.UserBranchRoles.splice(ind, 1);
        // }
        angular.forEach($scope.hosUserCollection.UserBranchRoles, function (Aitem) {
            if (Aitem.RoleId === 1 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                $scope.ShowDepartmentlist = true;
            }
        });
    };

    $scope.getAllUserslistforEmergencyReport = function () {
        var reqObj = {
            "BranchId": hospitalId,
           /* "SubSpecializationIdArray": subSplArray*/
        }
        $scope.EmergencyAccessAllFromUserList = [];
        $scope.EmergencyAccessAllToUserList = [];
        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;
                $scope.EmergencyAccessAllUserList = angular.copy(resp.rows);
                $scope.EmergencyAccessAllFromUserList = angular.copy(resp.rows);
                $scope.EmergencyAccessAllToUserList = angular.copy(resp.rows);
                if ($scope.EmergencyAccessAllFromUserList.length>0) {
                    angular.forEach($scope.EmergencyAccessAllFromUserList, function (item) {
                        item.isChecked = true;
                    })
                    $scope.EmergencyAccessReportObj.AllFromUsersCheck = true;
                }
                if ($scope.EmergencyAccessAllToUserList.length > 0) {
                    angular.forEach($scope.EmergencyAccessAllToUserList, function (item) {
                        item.isChecked = true;
                    })
                    $scope.EmergencyAccessReportObj.AllToUsersCheck = true;
                }
            }
        }
        function onGetUsersFailure(data) {
        }
    }
    $scope.listingUsers = true;
    $scope.step1 = false;
    $scope.step2 = false;
    $scope.step3 = false;
    $scope.isSameContactNo = false;
    $scope.SameAddress = false;
    $scope.editPassword = false;
    $scope.ShowDepartmentlist = false;
    $scope.Slotestabno = 1;
    $scope.currentdaycode = $filter('date')(new Date(), "EEE").toUpperCase();
    $scope.currentday = $filter('date')(new Date(), "EEEE").toUpperCase();
    var RoleObj = {
        "RoleId": "",
        "RoleName": ""
        //"GroupId": "",
        //"GroupName": "",


    }




    $scope.useractiveMenu = "userList";

    $scope.hosUserCollection = {
        "USRType": "ADMIN", "TermsAccepted": "Y", "Searchable": "Y", "UserDetails": { "FirstName": "", "LastName": "", "Exp": '', "TermsAccepted": "1", "FullName": "", "UserLoginID": "", "UserPassword": "", "Prospect": "N", "Gender": "M", "SpecialityCD": {} }, "UserOtherDetails": { "PanCardID": "", "ActiveIND": "Y" }, "UserPhone": [], "UserSettings": {}, "UserAddress": [], "USRId": doctorinfo.doctorid, "DoctorEmail": [], "DoctorDepartments": [{ "DepartmentID": '', "SubDepartmentID": '', "ActiveIND": "Y", "DoctorConsultationFees": 0, "BillingStructure": [], "DoctorDepartmentID": 0 }], "CustomSpecialityDesc": {}, "UserSpecialityDetails": [], "OpthalDepartments": [], "SpecializationId": "", "SpecializationObj": "",
        "UserBranchRoles": [
            {
                "RoleId": "",
                "RoleName": "",
                "GroupId": "",
                "GroupName": "",
                "GroupArray": [],
                "isEditHospitaluser": false

            }
        ],
        "UserSlotInfo": {
            "MultiSlotEnable": false,
            //"CrossConsultationOption": true,
            "CrossConsultationOption": false,
            "NormalSlots": {
                "ConsultationFee": 0,
                "FreeNoOfSlots": 1,
                "FreeFollowUpNoOfDays": 0
            },
            "TeleSlots": {
                "ConsultationFee": 0,
                "FreeNoOfSlots": 0,
                "FreeFollowUpNoOfDays": 0
            },
            "CrossConsultationNormalSlots": {
                "FreeNoOfTeleSlots": 1,
                "FreeTeleSlotsValidity": "",
                "FreeNoOfNormalSlots": "",
                "FreeNormalSlotsValidity": ""
            },
            "CrossConsultationTeleSlots": {
                "FreeNoOfTeleSlots": 1,
                "FreeTeleSlotsValidity": 0,
                "FreeNoOfNormalSlots": 0,
                "FreeNormalSlotsValidity": 0
            }
        },
        "UserCommunicationPhone": [],
        "CommunicationEmailId": ""
    };
    $scope.hospital = {
        "minpercase": "15",
        "Teleminpercase": "5",
        "ConsulationPrice": "",
        "ConsulationFreeSlots": "",
        "ConsulationFreeSlotsDays": "",
        "ConsulationFreeSlotsDaysType": "D",
        "TeleConsulationPrice": "",
        "TeleConsulationFreeSlots": "",
        "TeleConsulationFreeSlotsDays": "",
        "TeleConsulationFreeSlotsDaysType": "D"
    };
    $scope.groupId = {
        "group": ""
    };
    $scope.rolesID = {
        "role": "",
        "roleId": 0
    };

    $scope.group = { "GroupObj": "", "GroupId": "", "GroupName": "" };
    $scope.role = { "RoleObj": "", "RoleId": "", "RoleName": "" };
    $scope.eHnoteConfimrPassword = {
        'eHnoteConfimrPassword': ''
    };
    $scope.email_pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //$scope.password_pattern = /^(?=.*\d)(?=.*[a-zA-Z]).{8,20}$/;
    $scope.password_pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;
    $scope.subDepartmentsList = [];
    $scope.stateList = [];
    $scope.cityList = [];
    $scope.locationList = [];
    var doctor_phone = [];
    var doctor_Communicationphone = [];
    $scope.consultationDetails = [];
    $scope.TeleSlotconsultationDetails = [];
    $scope.accessLisingCollection = [];
    $scope.showAccessList = [];
    var departments_status = false;
    $scope.startTimeHH = {
        'start': "00"
    };
    $scope.endTimeHH = {
        'start': "00"
    };
    $scope.startTimeMM = {
        'end': "00"
    };
    $scope.endTimeMM = {
        'end': "00"
    };
    $scope.TimeSlotType = 'Normal Slot';
    $scope.TimeTNSlotType = 'TNormal Slot';
    $scope.edit_status = false;
    $scope.updateTimingsStatus = false;
    var timingTempValues = [];
    var teletimingTempValues = [];
    $scope.addHospitalDoc = false;
    $scope.newAddHospitalList = [];
    $scope.editDoctorBasic = false;
    $scope.ListingDisplay = [];
    $scope.addHospital = {
        "clinic": ""
    };
    var overlapped_check = true;

    $scope.showeditSubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId || 0;

    function resetForms() {
        $scope.startTimeHH = { 'start': "00" };
        $scope.endTimeHH = { 'start': "00" };
        $scope.startTimeMM = { 'end': "00" };
        $scope.endTimeMM = { 'end': "00" };

        $scope.hospital = {
            "minpercase": "5",
            "Teleminpercase": "5",
            "ConsulationPrice": "",
            "ConsulationFreeSlots": "",
            "ConsulationFreeSlotsDays": "",
            "ConsulationFreeSlotsDaysType": "D",
            "TeleConsulationPrice": "",
            "TeleConsulationFreeSlots": "",
            "TeleConsulationFreeSlotsDays": "",
            "TeleConsulationFreeSlotsDaysType": "D"
        };
        $scope.groupId = { "group": "" };
        $scope.rolesID = { "role": "" };
        $scope.listingUsers = true;
        $scope.step1 = false;
        $scope.step2 = false;
        $scope.step3 = false;
        $scope.hosUserCollection = {
            "USRType": "ADMIN", "TermsAccepted": "Y", "Searchable": "Y",
            "UserDetails": { "FirstName": "", "LastName": "", "Exp": '', "TermsAccepted": "1", "FullName": "", "UserLoginID": "", "UserPassword": "", "Prospect": "N", "Gender": "M", "SpecialityCD": {} },
            "UserOtherDetails": { "PanCardID": "", "ActiveIND": "Y" },
            "UserPhone": [],
            "UserSettings": {},
            "UserAddress": [],
            "USRId": doctorinfo.doctorid,
            "DoctorEmail": [],
            "DoctorDepartments": [{ "DepartmentID": '', "SubDepartmentID": '', "ActiveIND": "Y", "DoctorConsultationFees": 0, "BillingStructure": [], "DoctorDepartmentID": 0 }],
            "CustomSpecialityDesc": {},
            "UserSpecialityDetails": [],
            "UserSlotInfo": {
                "MultiSlotEnable": false,
                //"CrossConsultationOption": true,
                "CrossConsultationOption": false,
                "NormalSlots": {
                    "ConsultationFee": 0,
                    "FreeNoOfSlots": 1,
                    "FreeFollowUpNoOfDays": 0
                },
                "TeleSlots": {
                    "ConsultationFee": 0,
                    "FreeNoOfSlots": 0,
                    "FreeFollowUpNoOfDays": 0
                },
                "CrossConsultationNormalSlots": {
                    "FreeNoOfTeleSlots": 1,
                    "FreeTeleSlotsValidity": "",
                    "FreeNoOfNormalSlots": "",
                    "FreeNormalSlotsValidity": ""
                },
                "CrossConsultationTeleSlots": {
                    "FreeNoOfTeleSlots": 1,
                    "FreeTeleSlotsValidity": 0,
                    "FreeNoOfNormalSlots": 0,
                    "FreeNormalSlotsValidity": 0
                }
            },
            "UserCommunicationPhone": [],
            "CommunicationEmailId": ""
        };
    }
    $scope.addMultipleContacts = function () {
        var add_contacts = { "PhCntryCD": 91, "PhStateCD": 0, "PhAreaCD": '', "PhNumber": '', "PhType": "M", "PrimaryIND": "Y", "PublicDisplay": "Y" };

        $scope.hosUserCollection.UserPhone.push(add_contacts);
    };
    $scope.addMultipleCommunicationContacts = function () {
        $scope.hosUserCollection.UserCommunicationPhone = [];
        var add_contacts1 = { "PhCntryCD": 91, "PhStateCD": 0, "PhAreaCD": '', "PhNumber": '', "PhType": "M", "PrimaryIND": "Y", "PublicDisplay": "Y" };
        $scope.hosUserCollection.UserCommunicationPhone.push(add_contacts1);
    };
    $scope.addMultipleContacts();
    $scope.addMultipleCommunicationContacts();
    $scope.removeContact = function (index) {
        $scope.hosUserCollection.UserPhone.splice(index, 1);
    };
    $scope.removeCommunicationContact = function (index) {
        $scope.hosUserCollection.UserCommunicationPhone.splice(index, 1);
    };
    $scope.addMultipleSpeciality = function () {
        var add_speciality = { "DoctorSpecialitySEODesc": "", "DoctorSpecialityID": "", "DoctorSpecialityDesc": "Select the speciality", "SpecialityDesc": "", "ActiveIND": "Y" };
        $scope.hosUserCollection.UserSpecialityDetails.push(add_speciality);
    };
    $scope.removeSpeciality = function (index) {
        $scope.hosUserCollection.SpecialityDetails.splice(index, 1);
    };
    $scope.addMultipleSpeciality();
    $scope.addBillingStructure = function () {
        var billing_row = { "StructureName": "", "StructureDPName": "", "Amount": '', "Percentage": 0, "Type": "", "Status": "Y" };
        $scope.hosUserCollection.DoctorDepartments[0].BillingStructure.push(billing_row);
    };
    $scope.removeBillingStructure = function (index) {
        $scope.hosUserCollection.DoctorDepartments[0].BillingStructure.splice(index, 1);
    };
    $scope.addBillingStructure();
    function branchListing(pageSize) {
        pageSize = pageSize || 100;
        var get_branches = {
            "pageNumber": 1,
            "HospitalID": parseInt(parentHospitalId),
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
    $scope.GetTimeSlotForEmergencyAccess = function () {
        var duration = '15';
        $scope.TimeSlotStartValues = [];
        $scope.TimeSlotEndValues = [];
        var durationtime = parseInt(duration);

        var shour = "00"; //"00";
        var smin = "00";
        var ehour = "23"; // "23";
        var emin = "59";  //"59";
        var startingTime = moment().hours(shour).minutes(smin);
        var endingTime = moment().hours(ehour).minutes(emin);
        var currentStartTime = angular.copy(startingTime);
        while (currentStartTime < endingTime) {
            var slotObj = {
                "StartTime": currentStartTime.format("HH:mm"),
                "time": currentStartTime.format("HH:mm"),
                "EndTime": currentStartTime.add(durationtime, "minute").format("HH:mm"),
            }

            var t = $filter('date')(new Date(), "yyyy-MM-dd");
            var datetime = t + "T" + slotObj.StartTime;
            var NewStartTime = "";
            var NewStartTime = $filter('date')(datetime, "hh:mm: a");
            var NewStartTime1 = $filter('date')(datetime, "hh:mm a");

            var arr = slotObj.StartTime.split(':');
            //if (arr[0] == "00" && arr[2] == " AM") {
            //    NewStartTime = NewStartTime.replace('00', '12');
            //}
            var obj = {
                "time": angular.copy(NewStartTime1),
                "newtime": angular.copy(NewStartTime)
            }

            $scope.TimeSlotStartValues.push(obj);
            $scope.TimeSlotEndValues.push(obj);
        }
    };
    //function loadRights() {
    //    var params = {
    //        "USRType": "ADMIN",
    //        "USRId": doctorinfo.doctorid
    //    };
    //    eHnoteMainAdminServices.listeHnoteAccessRights(params, onLoadSuccess, onLoadError);
    //}


    //function onLoadSuccess(data) {
    //    $scope.rightsList = data;
    //    $scope.accessLisingCollection.length = 0;
    //    angular.forEach($scope.rightsList, function (row) {
    //        angular.forEach(row.AccessRights, function (item) {
    //            $scope.accessLisingCollection.push(item);
    //        });
    //    });
    //}
    //function onLoadError(data) {
    //}
    function loadDepartments() {
        var params = {
            "DoctorID": doctorinfo.doctorid,
            "HospitalCD": hospitalCode,
            "USRType": "DOCTOR",
            "PageSize": 100,
            "PageNumber": 1,
            "USRId": doctorinfo.doctorid
        };
    }
    function onDeptLoadSuccess(data) {
        if (data.status === "success") {
            if (data.response !== undefined && data.response.rows !== undefined) {
                $scope.DepartmentsList = data.response.rows;
            }
        }
        else {
        }
    }
    function onDeptLoadError(data) {
    }
    //loadRoles();
    //loadRights();
    loadRolesList();
    loadDepartments();

    $scope.roleFilter = function (val) {
        if (val.RoleName === $scope.role.RoleName) {
            return val;
        }
    };
    $scope.changeRole = function (roleName) {
        $scope.groupId.group = "";
        $scope.ListingDisplay = [];
        var roleObj = $filter("filter")($scope.rolesList, { "RoleName": roleName }, true)[0];
        $scope.rolesID.roleId = roleObj.RoleID;
        loadAccessRights(roleObj.RoleID);
        //code enable by bharath 23-07-2019
    };

    $scope.changeBranchRole = function (item, roleObj) {
        console.log(roleObj)
        //$scope.role.RoleId = roleObj.RoleId;
        //$scope.role.RoleName = roleObj.RoleName;
        $scope.ShowDepartmentlist = false;
        $scope.rolesID.roleId = roleObj.RoleId || "";
        item.RoleId = roleObj.RoleId || "";
        item.RoleName = roleObj.RoleName || "";

        item.GroupArray = $filter("filter")($scope.rolesListing, function (bitem, index) { return bitem.RoleID === item.RoleId; });
        $scope.hosUserCollection.doctorDetails.RoleId = roleObj.RoleId;
        $scope.hosUserCollection.UserAddress[0].ExtDetails.RoleID = item.RoleId;

        loadAccessRights(roleObj.RoleId);
        angular.forEach($scope.hosUserCollection.UserBranchRoles, function (Aitem) {
            if (Aitem.RoleId === 1 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                $scope.ShowDepartmentlist = true;
            }
        });

    };


    function loadAccessRights(roleId) {

        var params = { "RoleID": roleId };
        eHnoteMainAdminServices.listeHnoteAccessRights(params, onLoadSuccess, onLoadError);
    }

    function onLoadSuccess(data) {
        $scope.rightsList = data;
        $scope.accessLisingCollection.length = 0;
        angular.forEach($scope.rightsList.RoleAccess, function (row) {
            // angular.forEach(row.AccessList, function (item) {
            $scope.accessLisingCollection.push(row);
            // });
        });

    }
    function onLoadError(data) {
    }

    $scope.changeGroup = function (val) {
        $scope.groupRights = [];
        $scope.groupId.group = val;
        $scope.groupId.groupName = $scope.groupId.group;
        angular.forEach($scope.rolesListing, function (item) {
            if (item.GroupName === val) {
                $scope.groupRights.push(item.UserAccessID);
            }
        });
        var rightsListVal = getJsonVal($scope.groupRights);
        $scope.ListingDisplay.length = 0;
        angular.forEach(rightsListVal, function (item) {
            angular.forEach($scope.accessLisingCollection, function (access) {
                //if (item == access.AccessID) {
                //    $scope.ListingDisplay.push(access);
                //}
                if (item.AccessCategoryId === access.AccessCategoryId && item.ActiveInd === 'Y') {
                    angular.forEach(item.AccessList, function (accessitem) {
                        if (accessitem.ActiveInd === 'Y') {
                            $scope.ListingDisplay.push(accessitem);
                        }
                    });
                }
            });
        });

        angular.forEach($scope.accessLisingCollection, function (item, index) {
            if (item.AccessCategoryId === 2 && item.ActiveInd === 'Y') {
                $scope.showNormalSlot = true;
                // $scope.showTeleNormalSlot = false; 
                $scope.TimeSlotType = 'Normal Slot';
            } else if (item.AccessCategoryId === 18 && item.ActiveInd === 'Y') {

                //    $scope.showNormalSlot = false;
                $scope.showTeleNormalSlot = true;
                $scope.TimeSlotType = 'Tele Slot';
            }
            //else if ((item.AccessCategoryId === 2 && item.ActiveInd === 'Y') && (item.AccessCategoryId === 18 && item.ActiveInd === 'Y')) {
            //    $scope.showNormalSlot = true;
            //    $scope.showTeleNormalSlot = true; 
            //    $scope.TimeSlotType = 'Normal Slot';

            //}
        });

    };
    $scope.changeUserGroup = function (item, gobj) {
        gobj = gobj || "";
        if (gobj !== "") {
            $scope.group.GroupId = gobj.GroupId;
            item.GroupId = gobj.GroupId;
            item.GroupName = gobj.GroupName;
            $scope.group.GroupName = gobj.GroupName;
            $scope.hosUserCollection.UserAddress[0].ExtDetails.GroupID = gobj.GroupId;
            $scope.hosUserCollection.doctorDetails.GroupName = gobj.GroupName;

            $scope.groupRights = [];
            $scope.groupId.group = $scope.group.GroupName;
            $scope.groupId.groupName = $scope.group.GroupName;
            angular.forEach($scope.rolesListing, function (item) {
                if (item.GroupId === gobj.GroupId) {
                    $scope.groupRights.push(item.UserAccessID);
                }
            });
        }
        var rightsListVal = getJsonVal($scope.groupRights);
        $scope.ListingDisplay.length = 0;
        angular.forEach(rightsListVal, function (item) {
            angular.forEach($scope.accessLisingCollection, function (access) {

                if (item.AccessCategoryId === access.AccessCategoryId && item.ActiveInd === 'Y') {
                    angular.forEach(item.AccessList, function (accessitem) {
                        if (accessitem.ActiveInd === 'Y') {
                            $scope.ListingDisplay.push(accessitem);
                        }
                    });
                }
            });
        });

        angular.forEach($scope.accessLisingCollection, function (item, index) {
            if (item.AccessCategoryId === 2 && item.ActiveInd === 'Y') {
                $scope.showNormalSlot = true;

                $scope.TimeSlotType = 'Normal Slot';
            } else if (item.AccessCategoryId === 18 && item.ActiveInd === 'Y') {


                $scope.showTeleNormalSlot = true;
                $scope.TimeSlotType = 'Tele Slot';
            }

        });

    };
    $scope.getSubDepartmentID = function () {
        var selectedDeptID = $scope.hosUserCollection.DoctorDepartments[0].DepartmentID;
        angular.forEach($scope.DepartmentsList, function (item) {
            if (item.DepartmentDtl.DepartmentID === selectedDeptID) {
                $scope.subDepartmentsList = item.SubDepartmentDtls;
            }
        });
        if ($scope.subDepartmentsList.length === 0) {
            if ($scope.DoctorDepartments !== undefined) {
                $scope.DoctorDepartments.SubDepartmentID = "0";
            }
        }
    };
    $scope.changeClinic = function (clinic) {
        $scope.selectBranch = clinic;
        if (clinic !== null) {
            angular.forEach($scope.hospitalDoctorsList, function (item) {
                if (item.HospitalInfo.HospitalDetails.HospitalID === clinic.HospitalInfo.HospitalDetails.HospitalID) {
                    if (item.DoctorDetails === undefined) {
                        $scope.doctorListing = [];
                    } else {
                        $scope.doctorListing = item.DoctorDetails;
                    }
                    $scope.getDoctorDetails($scope.doctorListing[0]);
                }
            });
        }
    };
    $scope.OrgSpecializationsArray = [];
    $scope.AllSubSpecializationsArray = [];
    $scope.SelectedSplDeptArray = [];
    $scope.GetSpecializationsBySubOrgId = function (SubOrganizationId) {
        eHnoteMainAdminServices.GetOrgSpecializationsById(SubOrganizationId).then(function (resp) {
            console.log(resp.data);
            if (resp.data.row.length > 0) {
                $scope.OrgSpecializationsArray = resp.data.row;
                console.log($scope.OrgSpecializationsArray);
            }
        });
    };

    $scope.getUserEncryptedSIgnatureById = function (userid) {

        console.log(userid);

        eHnoteMainAdminServices.getEncryptedUserSignById(userid).then(function (resp) {
            console.log(resp);
            if (resp.data.status === "Success") {
                $scope.EncryptedUserSign = resp.data.EncryptedUserSign;
            };
        }, function (err) {
            console.log(err);
        });
    };

    $scope.getSubSpecializationsBySubOrgId = function (subOrgId) {

        eHnoteMainAdminServices.GetAllSubSpecializationsByOrgId(subOrgId).then(function (resp) {
            console.log(resp.data);
            if (resp.data.row.length > 0) {
                $scope.AllSubSpecializationsArray = resp.data.row;
            }
        }, function (err) {
            console.log(err);
        });
    };

    $scope.getSubSpecialitiesById = function (obj) {
        console.log(obj);
        obj = obj || "";
        $scope.SelectedSplDeptArray = [];
        var splId = parseFloat(splId) || 0;

        if (obj !== "") {
            $scope.hosUserCollection.SpecializationId = obj.SpecializationId;


            //BranchOrgSpecializationId
            //BranchSpecializationId
            $scope.filteredArray = $filter("filter")($scope.MainBranchSubSpecializationsArray, function (item, index) { return item.BranchSpecializationId === obj.BranchOrgSpecializationId; });
            if ($scope.filteredArray.length > 0) {
                $scope.SelectedSplDeptArray = angular.copy($scope.filteredArray);
                angular.forEach($scope.SelectedSplDeptArra, function (mitem) {
                    mitem.IsPrimarySubSpecialization = false;
                });
            } else {
                alertify.error("No Departments has been added for this specialization");
            }
        }
        console.log(splId);
        $scope.hosUserCollection.OpthalDepartments = [];

        console.log($scope.SelectedSplDeptArray);

    }

    $scope.DepartmentObj = {
        "SelectedDepartment": ""
    };
    $scope.AddDepartmenttoUser = function (deptObj) {

        console.log(deptObj);

        var obj = {
            "UserSubSpecializationId": 0,
            "BranchSubSpecializationId": deptObj.BranchSubSpecializationId,
            "SubSpecializationId": deptObj.SubSpecializationId,
            "OrganizationId": $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchId,
            "SubSpecializationName": deptObj.SubSpecializationName,
            "IsPrimarySubSpecialization": false
        };
        if ($scope.hosUserCollection.OpthalDepartments.length === 0) {
            obj.IsPrimarySubSpecialization = true;
            $scope.hosUserCollection.OpthalDepartments.push(obj);
        } else {

            $scope.filteredArray = $filter("filter")($scope.hosUserCollection.OpthalDepartments, function (item, index) { return item.SubSpecializationId === deptObj.SubSpecializationId; });
            if ($scope.filteredArray.length > 0) {
                alertify.error("Department Already Added");
            } else {
                $scope.hosUserCollection.OpthalDepartments.push(obj);
            }

        }


        $scope.DepartmentObj = {
            "SelectedDepartment": ""
        };
    }

    $scope.pageChange = function (val) {
        if (val === "addDoctor") {
            $scope.GetSpecializationsBySubOrgId(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
            $scope.getSubOrgRoles(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
            getSubOrganizationGroups(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);

            $scope.listingUsers = false;
            $scope.step1 = true;
            if ($scope.hosUserCollection.UserPhone === undefined || $scope.hosUserCollection.UserPhone.length === 0) {
                $scope.addMultipleContacts();
            }
            if ($scope.hosUserCollection.UserCommunicationPhone === undefined || $scope.hosUserCollection.UserCommunicationPhone.length === 0) {
                $scope.addMultipleCommunicationContacts();
            }
            if ($scope.hosUserCollection.SpecialityDetails === undefined || $scope.hosUserCollection.SpecialityDetails.length === 0) {
                $scope.addMultipleSpeciality();
            }
            $scope.eHnoteConfimrPassword = {
                'eHnoteConfimrPassword': ''
            };
            $scope.hosUserCollection.UserBranchRoles = [
                {
                    "RoleId": "",
                    "RoleName": "",
                    "GroupId": "",
                    "GroupName": "",
                    "GroupArray": [],
                    "isEditHospitaluser": false

                }
            ]

        } else if (val === "addClinic") {
            $scope.GetSpecializationsBySubOrgId(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
            $scope.getSubOrgRoles(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
            getSubOrganizationGroups(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
            angular.forEach($scope.allBranchesArray, function (hospitalDetials) {
                var isset = false;
                angular.forEach($scope.selectedDoctor.UserAddress, function (doctorItem) {
                    console.log(hospitalDetials.HospitalInfo.HospitalDetails.BranchId + "__" + doctorItem.ExtDetails.HospitalID);
                    if (hospitalDetials.HospitalInfo.HospitalDetails.BranchId === doctorItem.ExtDetails.HospitalID) {
                        isset = true;
                    }
                });
                if (!isset) {
                    $scope.newAddHospitalList.push(hospitalDetials);
                }
            });
            $scope.addHospital.clinic = $scope.newAddHospitalList[0];
            $scope.addNewHospital = true;
            if ($scope.newAddHospitalList.length == 0) {
                alertify.error("You have already added to all branches");
                return;
            }
            $scope.addHospitalDoc = true;
            angular.forEach($scope.selectBranch.DoctorDetails, function (item) {
                if (item.DoctorID === $scope.selectedDoctor.User[0].DoctorID) {
                    $scope.groupId.groupName = $scope.selectedDoctor.UserAddress[0].ExtDetails.GroupName;
                    $scope.rolesID.roleName = $scope.selectedDoctor.UserAddress[0].ExtDetails.RoleName;
                    $scope.rolesID.role = $scope.rolesID.roleName;
                    $scope.groupId.group = $scope.groupId.groupName;
                }
            });
            $scope.listingUsers = false;
            $scope.step3 = true;
            $scope.hosUserCollection.doctorDetails = $scope.selectedDoctor.User[0];
            $scope.hosUserCollection.UserPhone = $scope.selectedDoctor.UserPhone;
            $scope.hosUserCollection.UserCommunicationPhone = $scope.selectedDoctor.UserCommunicationPhone;
            $scope.hosUserCollection.SpecialityDetails = $scope.selectedDoctor.UserSpecilityDetails;
            $scope.hosUserCollection.doctorDetails.FirstName = ($scope.selectedDoctor.UserOtherDetails.FirstName === undefined) ? '' : $scope.selectedDoctor.UserOtherDetails.FirstName;
            $scope.hosUserCollection.doctorDetails.LastName = ($scope.selectedDoctor.UserOtherDetails.LastName === undefined) ? '' : $scope.selectedDoctor.UserOtherDetails.LastName;
            angular.forEach($scope.hosUserCollection.doctorDetails.UseAccessDetails, function (item, index) {
                if (item.AccessCategoryId === 2 && item.ActiveInd === 'Y') {
                    $scope.showNormalSlot = true;
                    $scope.TimeSlotType = 'Normal Slot';
                } else if (item.AccessCategoryId === 18 && item.ActiveInd === 'Y') {
                    $scope.showTeleNormalSlot = true;
                    $scope.TimeSlotType = 'Tele Slot';
                }

            });
            $scope.hosUserCollection.UserBranchRoles = [
                {
                    "RoleId": "",
                    "RoleName": "",
                    "GroupId": "",
                    "GroupName": "",
                    "GroupArray": [],
                    "isEditHospitaluser": false

                }
            ]

            $scope.changeUserBranch();
        } else if (val === "editUser") {
            $scope.hosUserCollection.doctorDetails = $scope.selectedDoctor.User[0];
            $scope.hosUserCollection.SpecializationId = $scope.selectedDoctor.User[0].SpecializationId;
            $scope.hosUserCollection.doctorDetails.FirstName = ($scope.selectedDoctor.UserOtherDetails.FirstName === undefined) ? '' : $scope.selectedDoctor.UserOtherDetails.FirstName;
            $scope.hosUserCollection.doctorDetails.LastName = ($scope.selectedDoctor.UserOtherDetails.LastName === undefined) ? '' : $scope.selectedDoctor.UserOtherDetails.LastName;
            $scope.hosUserCollection.doctorDetails.UserLoginID = $scope.selectedDoctor.User[0].UserLoginID;
            $scope.hosUserCollection.doctorDetails.DoctorPassword = $scope.selectedDoctor.User[0].UserPassword;
            $scope.hosUserCollection.UserDepartment = $scope.selectedDoctor.UserSubSpecialization || [];
            $scope.hosUserCollection.OpthalDepartments = $scope.selectedDoctor.UserSubSpecialization || [];
            $scope.hosUserCollection.UserBranchRoles = $scope.selectedDoctor.UserAddress[0].UserBranchRoles || [];


            //$scope.hosUserCollection.UserAddress.UserConsultation = $scope.selectedDoctor.UserConsultation||[];
            // $scope.hosUserCollection.UserAddress.UserTeleConsultation = $scope.selectedDoctor.UserTeleConsultation||[];

            if ($scope.selectedDoctor.UserPhone !== undefined && $scope.selectedDoctor.UserPhone.length !== 0) {
                $scope.hosUserCollection.UserPhone = $scope.selectedDoctor.UserPhone;
            } else {
                $scope.addMultipleContacts();
            }

            if ($scope.selectedDoctor.UserCommunicationPhone !== undefined && $scope.selectedDoctor.UserCommunicationPhone.length !== 0) {
                $scope.hosUserCollection.UserCommunicationPhone = $scope.selectedDoctor.UserCommunicationPhone;
            } else {
                $scope.addMultipleCommunicationContacts();
            }
            $scope.hosUserCollection.CommunicationEmailId = $scope.selectedDoctor.User[0].CommunicationEmailId || "";
            if ($scope.selectedDoctor.User[0].SpecializationId !== undefined) {
                angular.forEach($scope.specialitylist, function (item) {
                    if (item.Id === $scope.selectedDoctor.User[0].SpecializationId) {
                        $scope.hosUserCollection.SpecialityDetails = item.Name;
                    }
                });
            }
            if ($scope.selectedDoctor.UserOtherDetails.length > 0) {
                $scope.hosUserCollection.doctorOtherDetails.PanCardID = $scope.selectedDoctor.doctorOtherDetails.PanCardID;
            }
            $scope.hosUserCollection.UserAddress = $scope.selectedDoctor.UserAddress;
            if ($scope.selectedDoctor.UserDepartments !== undefined) {
                $scope.hosUserCollection.DoctorDepartments = $scope.selectedDoctor.UserDepartments;
                $scope.hosUserCollection.DoctorDepartments[0].DepartmentID = ($scope.selectedDoctor.UserDepartments[0].DepartmentID).toString();
                $scope.getSubDepartmentID();
                $scope.hosUserCollection.DoctorDepartments[0].SubDepartmentID = ($scope.selectedDoctor.UserDepartments[0].SubDepartmentID).toString();
                $scope.DoctorDepartmentID = $scope.hosUserCollection.UserDepartments[0].DoctorDepartmentID;
            }
            $scope.groupId.group = $scope.selectedDoctor.UserAddress[0].ExtDetails.GroupName;
            $scope.rolesID.role = $scope.selectedDoctor.UserAddress[0].ExtDetails.RoleName;
            $scope.rolesID.roleId = $scope.selectedDoctor.UserAddress[0].ExtDetails.RoleID;
            $scope.groupId.groupName = $scope.groupId.group;
            //$scope.groupId.groupName = $scope.selectedDoctor.User[0].GroupName || "";


            loadAccessRights($scope.rolesID.roleId);

            $timeout(function () {
                $scope.changeGroup($scope.groupId.group);
            }, 300);



            // $scope.changeGroup($scope.groupId.group);


            $scope.editDoctorBasic = true;
            $scope.listingUsers = false;
            $scope.step1 = true;
            $scope.changeCountry();
            $scope.changeState();
            $scope.changeCity();
        } else if (val === "viewListing") {
            $scope.listingUsers = true;
            $scope.step1 = false;
            $scope.step2 = false;
            $scope.step3 = false;
            resetData();
            resetFields();
            resetForms();
            branchListing();
            $scope.eHnoteConfimrPassword = {
                'eHnoteConfimrPassword': ''
            };
        }
    };
    $scope.changeCountry = function () {
        $scope.stateList.length = 0;
        $scope.cityList.length = 0;
        $scope.locationList.length = 0;
        $scope.changeState();
    };
    $scope.changeState = function () {
        $scope.cityList.length = 0;
        $scope.locationList.length = 0;
        $scope.changeCity();
    };
    $scope.changeCity = function () {
        $scope.locationList.length = 0;
    };
    $scope.resetPassword = function () {
        if ($scope.editPassword) {
            $scope.editPassword = false;
        }
        else {
            $scope.editPassword = true;
        }
    };
    var deleteTempStatus = false;
    $scope.getDoctorDetails = function (doctordetails, type) {
        type = type || "edit";
        if (type === "delete") {
            alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete</h4> ", function () {
                if (doctordetails !== undefined) {
                    var params = { "DoctorID": doctordetails.DoctorID, "USRType": "ADMIN", "USRId": doctordetails.DoctorID };
                    eHnoteMainAdminServices.getDoctorPost(params, onDoctorDetailsSuccess, onDoctorDetailsError);
                    if (type === "delete") {
                        deleteTempStatus = true;
                    }
                }
            }, function () {
            });
        } else {
            if (doctordetails !== undefined) {
                var params = {
                    "DoctorID": doctordetails.DoctorID,
                    "USRType": "ADMIN",
                    "USRId": doctordetails.DoctorID
                };
                //eHnoteMainAdminServices.getDoctorPost(params, onDoctorDetailsSuccess, onDoctorDetailsError);
            } else {
                $scope.selectedDoctor = [];
            }
        }
    };
    function onDoctorDetailsSuccess(data) {
        $scope.selectedDoctor = data;
        $scope.selectedDocID = data.User[0].DoctorID;
        $scope.showHideWalkinDoctorBranch = true;
        if (data) {
            if (data.UserAddress && data.UserAddress.length > 0) {
                if (data.UserAddress[0].ExtDetails.RoleID === 16) {
                    $scope.showHideWalkinDoctorBranch = false;
                }
            }
        }

        $scope.selectedDoctor = data;
        if (deleteTempStatus) {
            deleteUserDetails(data);
        }

    }
    function onDoctorDetailsError(data) {
    }
    $scope.isConsultationSlotsAvavilable = false;
    $scope.isConsultationTeleSlotsAvavilable = false;
    $scope.showNormalSlot = false;
    $scope.showTeleNormalSlot = false;
    $scope.isEditHospitaluser = false;
    $scope.editHospital = function (val, type) {
        type = type || '';
        $scope.isEditHospitaluser = false;
        $scope.showNormalSlot = false;
        $scope.showTeleNormalSlot = false;
        $scope.edit_AddressID = val.UserBranchId;
        $scope.consultationDetails.length = 0;
        $scope.newAddHospitalList.length = 0;
        $scope.TeleSlotconsultationDetails = [];
        $scope.addHospitalDoc = true;
        if (val.UserType === 'ParentUser') {
            eHnoteMainAppointmentService.GetParentOrgRolesById(val.ParentOrganizationId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.rolesList = resp.data.row;
                    if ($scope.rolesList.length > 0) {
                        $scope.role.RoleObj = $filter("filter")($scope.rolesList, { "RoleId": val.ExtDetails.RoleID }, true)[0];
                    }
                } else {
                    $scope.rolesList = [];
                }
            });
            eHnoteMainAppointmentService.getBranchSubSpecializationsById(val.SubOrganizationId, val.ClinicId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.SelectedSplDeptArray = resp.data.row;
                    if ($scope.Departmentsarray.length !== 0) {

                        $scope.filteredArray = $filter("filter")($scope.MainBranchSubSpecializationsArray, function (item, index) { return item.BranchSubSpecializationId === $scope.Departmentsarray[0].BranchSubSpecializationId; });
                        if ($scope.filteredArray.length > 0) {
                            $scope.SelectedSplDeptArray = angular.copy($scope.filteredArray);
                            angular.forEach($scope.SelectedSplDeptArra, function (mitem) {
                                mitem.IsPrimarySubSpecialization = false;
                            });
                        }
                    }
                } else {
                    alertify.error("No Departments are been added");
                }
            });
            $scope.getAllBranchesBySubOrganizationId = function (subOrganizationId) {


                eHnoteMainAppointmentService.getAllBranchesBySubOrganizationId(subOrganizationId, onHospitalListSuccess, OnHospitalListFailed);
                function onHospitalListSuccess(data) {
                    console.log(data);
                    if (data.rows.length > 0) {
                        $scope.allBranchesArray = data.rows;
                        $scope.selectBranch = $scope.allBranchesArray[0];
                        //   $scope.changeBranch($scope.selectBranch);
                    } else {
                        $scope.allBranchesArray = [];
                    }
                }
                function OnHospitalListFailed(error) {
                    console.log(error);
                }
            };
            angular.forEach($scope.allBranchesArray, function (itemHospital) {
                if (itemHospital.HospitalInfo.HospitalDetails.BranchId === val.ExtDetails.HospitalID) {
                    $scope.newAddHospitalList.push(itemHospital);
                }
            });
            var params = {
                "ParentOrganizationId": val.ParentOrganizationId,
                "SubOrganizationId": 0,
            };
            eHnoteMainAppointmentService.GetUserGroupsById(params, ongetGroupSuccess, onGetGroupError);
            function ongetGroupSuccess(resp) {
                //if (resp.Roles.length > 0) {
                //    $scope.listofroles = resp.Roles;
                //    $scope.GroupArray = [];
                //    $scope.filteredArray = $filter("filter")($scope.listofroles, function (item, index) { return item.RoleID === doctordata.RoleId; });
                //    if ($scope.filteredArray.length > 0) {
                //        $scope.GroupArray = $scope.filteredArray;
                //    };
                //} else {
                //    $scope.listofroles = [];
                //    $scope.GroupArray = [];
                //    alertify.error("No Groups are Added");
                //}

                if (resp.Roles.length > 0) {
                    $scope.subOrganizationGroupsArray = resp.Roles;
                    if ($scope.subOrganizationGroupsArray.length > 0) {
                        $scope.group.GroupObj = $filter("filter")($scope.subOrganizationGroupsArray, { "GroupId": val.ExtDetails.GroupID }, true)[0];
                    }
                    if (val.UserBranchRoles.length !== 0) {
                        $scope.hosUserCollection.UserBranchRoles = [];
                        angular.forEach(val.UserBranchRoles, function (Aitem) {
                            //angular.forEach(val.ExtDetails.UserBranchRoles, function (Aitem) {
                            $scope.editGroupArray = [];

                            $scope.editGroupArray = $filter("filter")($scope.subOrganizationGroupsArray, function (item, index) { return item.RoleID === Aitem.RoleId; });
                            if ($scope.editGroupArray.length !== 0) {
                                Aitem.GroupArray = $scope.editGroupArray || [];
                                Aitem.RoleObj = _.where($scope.rolesList, { "RoleId": Aitem.RoleId })[0];
                                Aitem.GroupObj = _.where(Aitem.GroupArray, { "GroupId": Aitem.GroupId })[0];
                            }
                            Aitem.isEditHospitaluser = true;
                            $scope.hosUserCollection.UserBranchRoles.push(Aitem);
                            if (Aitem.RoleId === 1 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                                $scope.ShowDepartmentlist = true;
                            }


                            //});
                        });
                    }
                    angular.forEach(val.UserBranchRoles, function (Aitem, index) {
                        angular.forEach(Aitem.AccessDetails, function (item, index) {
                            if (item.AccessCategoryId === 2 && item.ActiveInd === 'Y') {
                                $scope.showNormalSlot = true;

                                $scope.TimeSlotType = 'Normal Slot';
                            } else if (item.AccessCategoryId === 18 && item.ActiveInd === 'Y') {

                                //    $scope.showNormalSlot = false;
                                $scope.showTeleNormalSlot = true;
                                $scope.TimeSlotType = 'Tele Slot';
                            }

                        });
                    });
                }
                else {
                    $scope.subOrganizationGroupsArray = [];
                }
            }
            function onGetGroupError(data) {
                alertify.error(data.Message);
            }
        } else {
            eHnoteMainAdminServices.GetSubOrganizationsRolesbyId(val.SubOrganizationId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.rolesList = resp.data.row;
                    if ($scope.rolesList.length > 0) {
                        $scope.role.RoleObj = $filter("filter")($scope.rolesList, { "RoleId": val.ExtDetails.RoleID }, true)[0];
                    }
                } else {
                    $scope.rolesList = [];
                }
            });
            eHnoteMainAdminServices.getSubOrgGroupsById(val.SubOrganizationId).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    $scope.subOrganizationGroupsArray = resp.data.rows;
                    if ($scope.subOrganizationGroupsArray.length > 0) {
                        $scope.group.GroupObj = $filter("filter")($scope.subOrganizationGroupsArray, { "GroupId": val.ExtDetails.GroupID }, true)[0];
                    }
                    if (val.UserBranchRoles.length !== 0) {
                        $scope.hosUserCollection.UserBranchRoles = [];
                        angular.forEach(val.UserBranchRoles, function (Aitem) {
                            //angular.forEach(val.ExtDetails.UserBranchRoles, function (Aitem) {
                            $scope.editGroupArray = [];

                            $scope.editGroupArray = $filter("filter")($scope.subOrganizationGroupsArray, function (item, index) { return item.RoleID === Aitem.RoleId; });
                            if ($scope.editGroupArray.length !== 0) {
                                Aitem.GroupArray = $scope.editGroupArray || [];
                                Aitem.RoleObj = _.where($scope.rolesList, { "RoleId": Aitem.RoleId })[0];
                                Aitem.GroupObj = _.where(Aitem.GroupArray, { "GroupId": Aitem.GroupId })[0];
                            }
                            Aitem.isEditHospitaluser = true;
                            $scope.hosUserCollection.UserBranchRoles.push(Aitem);
                            if (Aitem.RoleId === 1 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                                $scope.ShowDepartmentlist = true;
                            }


                            //});
                        });
                    }
                    angular.forEach(val.UserBranchRoles, function (Aitem, index) {
                        angular.forEach(Aitem.AccessDetails, function (item, index) {
                            if (item.AccessCategoryId === 2 && item.ActiveInd === 'Y') {
                                $scope.showNormalSlot = true;

                                $scope.TimeSlotType = 'Normal Slot';
                            } else if (item.AccessCategoryId === 18 && item.ActiveInd === 'Y') {

                                //    $scope.showNormalSlot = false;
                                $scope.showTeleNormalSlot = true;
                                $scope.TimeSlotType = 'Tele Slot';
                            }

                        });
                    });
                }
                else {
                    $scope.subOrganizationGroupsArray = [];
                }
            });
            angular.forEach($scope.allBranchesArray, function (itemHospital) {
                if (itemHospital.HospitalInfo.HospitalDetails.BranchId === val.ExtDetails.HospitalID) {
                    $scope.newAddHospitalList.push(itemHospital);
                }
            });
            eHnoteMainAppointmentService.getBranchSubSpecializationsById(val.SubOrganizationId, val.ClinicId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.SelectedSplDeptArray = resp.data.row;
                    if ($scope.Departmentsarray.length !== 0) {

                        $scope.filteredArray = $filter("filter")($scope.MainBranchSubSpecializationsArray, function (item, index) { return item.BranchSubSpecializationId === $scope.Departmentsarray[0].BranchSubSpecializationId; });
                        if ($scope.filteredArray.length > 0) {
                            $scope.SelectedSplDeptArray = angular.copy($scope.filteredArray);
                            angular.forEach($scope.SelectedSplDeptArra, function (mitem) {
                                mitem.IsPrimarySubSpecialization = false;
                            });
                        }
                    }

                } else {
                    alertify.error("No Departments are been added");
                }
            });
        }

        if (type === 'edit') {
            $scope.isEditHospitaluser = true;
            ////console.log();
            //if ($scope.hosUserCollection.UserBranchRoles.length !==0) {
            //    angular.forEach($scope.hosUserCollection.UserBranchRoles, function (item) {
            //        item.isEditHospitaluser = true;
            //    });
            //}

        }


        eHnoteMainAdminServices.getBranchSpecialitiesById(val.ClinicId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.BranchSpecialitiesArray = resp.data.row;
                if ($scope.BranchSpecialitiesArray.length > 0) {
                    $scope.hosUserCollection.SpecializationObj = $filter("filter")($scope.BranchSpecialitiesArray, { "SpecializationId": $scope.selectedDoctor.User[0].SpecializationId }, true)[0];
                }
            }
        });
        eHnoteMainAdminServices.getBranchSpecializationById(val.SubOrganizationId, val.ClinicId).then(function (resp) {

            if (resp.data.row.length > 0) {
                $scope.MainBranchSubSpecializationsArray = resp.data.row;
            }
            console.log(resp.data);
        });

        //eHnoteMainAdminServices.getBranchSpecializationById(val.ClinicId, val.SubOrganizationId).then(function (resp) {

        //    if (resp.data.row.length > 0) {
        //        $scope.MainBranchSubSpecializationsArray = resp.data.row;
        //        $scope.filteredArray = $filter("filter")($scope.MainBranchSubSpecializationsArray, function (item, index) { return item.SpecializationId === $scope.selectedDoctor.User[0].SpecializationId;});
        //        if ($scope.filteredArray.length > 0) {
        //            $scope.SelectedSplDeptArray = angular.copy($scope.filteredArray);
        //        } else {
        //            alertify.error("No Departments has been added for this specialization");
        //        }
        //    }
        //    console.log(resp.data);
        //});

        //angular.forEach($scope.hospitalDoctorsList, function (itemHospital) {
        //    if (itemHospital.HospitalInfo.HospitalDetails.HospitalID == val.ExtDetails.HospitalID) {
        //        $scope.newAddHospitalList.push(itemHospital);
        //    }
        //});


        $scope.addHospital.clinic = $scope.newAddHospitalList[0];
        $scope.hosUserCollection.doctorDetails = $scope.selectedDoctor.User[0];

        //angular.forEach($scope.hosUserCollection.doctorDetails.UseAccessDetails, function (item, index) {
        //    if (item.AccessCategoryId === 2 && item.ActiveInd ==='Y') {
        //        $scope.showNormalSlot = true; 
        //       // $scope.showTeleNormalSlot = false; 
        //        $scope.TimeSlotType = 'Normal Slot';
        //    } else if (item.AccessCategoryId === 18 && item.ActiveInd === 'Y') {

        //    //    $scope.showNormalSlot = false;
        //        $scope.showTeleNormalSlot = true; 
        //        $scope.TimeSlotType = 'Tele Slot';
        //    }
        //    //else if ((item.AccessCategoryId === 2 && item.ActiveInd === 'Y') && (item.AccessCategoryId === 18 && item.ActiveInd === 'Y')) {
        //    //    $scope.showNormalSlot = true;
        //    //    $scope.showTeleNormalSlot = true; 
        //    //    $scope.TimeSlotType = 'Normal Slot';

        //    //}
        //});

        $scope.hosUserCollection.doctorDetails.FirstName = ($scope.selectedDoctor.UserOtherDetails.FirstName == undefined) ? '' : $scope.selectedDoctor.UserOtherDetails.FirstName;
        $scope.hosUserCollection.doctorDetails.LastName = ($scope.selectedDoctor.UserOtherDetails.LastName == undefined) ? '' : $scope.selectedDoctor.UserOtherDetails.LastName;
        $scope.hosUserCollection.UserPhone = $scope.selectedDoctor.UserPhone;
        $scope.hosUserCollection.UserCommunicationPhone = $scope.selectedDoctor.UserCommunicationPhone;
        $scope.hosUserCollection.SpecialityDetails = $scope.selectedDoctor.UserSpecilityDetails;
        console.log($scope.selectedDoctor.UserSubSpecialization);


        $scope.Departmentsarray = $filter("filter")($scope.selectedDoctor.UserSubSpecialization, { "OrganizationId": $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchId }, true);

        console.log($scope.Departmentsarray);


        $scope.hosUserCollection.OpthalDepartments = $scope.Departmentsarray || [];


        $scope.hosUserCollection.UserAddress = $scope.selectedDoctor.UserAddress;
        $scope.hosUserCollection.SpecializationId = $scope.selectedDoctor.User[0].SpecializationId;

        if ($scope.hosUserCollection.UserAddress.length !== 0) {

            $scope.UserAddress = $filter("filter")($scope.hosUserCollection.UserAddress, function (item, index) { return item.ClinicId === $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchId })[0];

            $scope.hosUserCollection.UserAddress = [];
            $scope.hosUserCollection.UserAddress.push($scope.UserAddress);
        }


        $scope.groupId.group = val.ExtDetails.GroupName;
        $scope.rolesID.role = val.ExtDetails.RoleName;
        $scope.rolesID.roleName = val.ExtDetails.RoleName;
        $scope.rolesID.roleId = val.ExtDetails.RoleID;
        $scope.groupId.groupName = val.ExtDetails.GroupName;
        $scope.role.RoleId = val.ExtDetails.RoleID;
        $scope.role.RoleName = val.ExtDetails.RoleName;
        $scope.role.RoleObj = $filter("filter")($scope.rolesList, { "RoleID": val.ExtDetails.RoleID }, true)[0];
        $scope.group.GroupId = val.ExtDetails.GroupID;
        $scope.group.GroupName = val.ExtDetails.GroupName;

        $scope.hosUserCollection.UserSlotInfo = val.UserSlotInfo;
        angular.forEach($scope.selectedDoctor.UserConsultation, function (itemConsultation, index) {
            if (itemConsultation.UserBranchId == val.UserBranchId) {
                itemConsultation.TimeId = index + 1;
                itemConsultation.StartTime = itemConsultation.StartTime.substr(0, 5);
                itemConsultation.EndTime = itemConsultation.EndTime.substr(0, 5);
                $scope.consultationDetails.push(itemConsultation);
                $scope.isConsultationSlotsAvavilable = true;
                $scope.hospital.minpercase = (itemConsultation.MinPerCase == undefined ? 15 : itemConsultation.MinPerCase).toString();
                $scope.hospital.ConsulationPrice = itemConsultation.ConsulationPrice || "";
                $scope.hospital.ConsulationFreeSlots = itemConsultation.ConsulationFreeSlots || "";
                $scope.hospital.ConsulationFreeSlotsDays = itemConsultation.ConsulationFreeSlotsDays || "";
                $scope.hospital.ConsulationFreeSlotsDaysType = itemConsultation.ConsulationFreeSlotsDaysType || "D";
            }
        });

        console.log($scope.consultationDetails);
        angular.forEach($scope.selectedDoctor.UserTeleConsultation, function (itemConsultation, index) {
            if (itemConsultation.UserBranchId == val.UserBranchId) {
                itemConsultation.TimeId = index + 1;
                itemConsultation.StartTime = itemConsultation.StartTime.substr(0, 5);
                itemConsultation.EndTime = itemConsultation.EndTime.substr(0, 5);
                $scope.TeleSlotconsultationDetails.push(itemConsultation);
                $scope.isConsultationTeleSlotsAvavilable = true;
                $scope.hospital.Teleminpercase = (itemConsultation.MinPerCase == undefined ? 15 : itemConsultation.MinPerCase).toString();
                $scope.hospital.TeleConsulationPrice = itemConsultation.TeleConsulationPrice || "";
                $scope.hospital.TeleConsulationFreeSlots = itemConsultation.TeleConsulationFreeSlots || "";
                $scope.hospital.TeleConsulationFreeSlotsDays = itemConsultation.TeleConsulationFreeSlotsDays || "";
                $scope.hospital.TeleConsulationFreeSlotsDaysType = itemConsultation.TeleConsulationFreeSlotsDaysType || "D";
            }
        });
        $scope.edit_status = true;
        $scope.listingUsers = false;
        $scope.step3 = true;
        angular.copy($scope.consultationDetails, timingTempValues);
        angular.copy($scope.TeleSlotconsultationDetails, teletimingTempValues);
    };
    function deleteUserDetails(data) {
        $scope.hosUserCollection.doctorDetails = data.User[0];
        $scope.hosUserCollection.UserPhone = data.UserPhone;
        $scope.hosUserCollection.UserCommunicationPhone = data.UserCommunicationPhone;
        $scope.hosUserCollection.SpecialityDetails = data.UserSpecilityDetails;
        $scope.hosUserCollection.UserAddress = data.UserAddress;
        angular.forEach($scope.hosUserCollection.UserAddress, function (item) {
            item.Active = "N";
        });
        $scope.addUpdateDoctor('', 3, 'yes');
    }
    $scope.ChangeChiefComplaintData = function (type, item) {
        item.ConsulationFreeSlotsDaysType = type;
    }
    $scope.ChangeTeleData = function (type, item) {
        item.ConsulationFreeSlotsDaysType = type;
    }
    $scope.AddClinicDoc = function () {
        $scope.hosUserCollection.UserAddress.length = 0;
        var gID = 0, rID = 0;
        angular.forEach($scope.rolesList, function (ritem) {
            if (ritem.RoleName === $scope.rolesID.role) {
                rID = ritem.RoleID;
            }
        });
        angular.forEach($scope.rolesListing, function (gitem) {
            if (gitem.GroupName === $scope.groupId.group) {
                gID = gitem.GroupCode;
            }
        });
        var hospitalBasicInfo = {
            "UserBranchId": ($scope.edit_status) ? $scope.edit_AddressID : undefined,
            "Active": "Y",
            "ClinicName": $scope.addHospital.clinic.HospitalInfo.HospitalDetails.HospitalName,
            "StateId": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.StateId,
            "ExtDetails": {
                "HospitalID": $scope.addHospital.clinic.HospitalInfo.HospitalDetails.HospitalID,
                "PrimaryIND": "Y",
                "RoleID": parseInt(rID),
                "GroupID": parseInt(gID),
                "HospitalInfo": {
                    "HospitalID": $scope.addHospital.clinic.HospitalInfo.HospitalDetails.HospitalID,
                    "HospitalCode": "",
                    "BranchCode": $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchCode
                },
                "ConsultDetails": $scope.consultationDetails,
                "TeleConsultDetails": $scope.TeleSlotconsultationDetails,
            },
            "CountryId": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.CountryId,
            "Address1": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.Address1,
            "Address2": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.Address2,
            "AddressType": "B",
            "CityId": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.CityId,
            "Location": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.Location,
            "PinCode": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.PinCode
        };
        if ($scope.addNewHospital) {
            hospitalBasicInfo.UserBranchId = 0;
        }
        else {
            hospitalBasicInfo.UserBranchId = ($scope.edit_status) ? $scope.edit_AddressID : undefined;
        }
        $scope.hosUserCollection.UserAddress.push(hospitalBasicInfo);
    };
    $scope.changemintues = function () {
        if ($scope.hospital.minpercase === "5") {
            $scope.consultationminituesvalue = [{ "mins": "00" }, { "mins": "05" }, { "mins": "10" }, { "mins": "15" }, { "mins": "20" }, { "mins": "25" }, { "mins": "30" }, { "mins": "35" }, { "mins": "40" }, { "mins": "45" }, { "mins": "50" }, { "mins": "55" }];
        }
        else if ($scope.hospital.minpercase === "10") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '10' }, { 'mins': '20' }, { 'mins': '30' }, { 'mins': '40' }, { 'mins': '50' }];
        }
        else if ($scope.hospital.minpercase === "15") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '15' }, { 'mins': '30' }, { 'mins': '45' }];
        }
        else if ($scope.hospital.minpercase === "20") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '20' }, { 'mins': '40' }];
        }
        else if ($scope.hospital.minpercase === "30") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '30' }];
        }
        else if ($scope.hospital.minpercase === "60") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }];
        }
    };
    $scope.Telechangemintues = function () {
        if ($scope.hospital.Teleminpercase === "5") {
            $scope.consultationminituesvalue = [{ "mins": "00" }, { "mins": "05" }, { "mins": "10" }, { "mins": "15" }, { "mins": "20" }, { "mins": "25" }, { "mins": "30" }, { "mins": "35" }, { "mins": "40" }, { "mins": "45" }, { "mins": "50" }, { "mins": "55" }];
        }
        else if ($scope.hospital.Teleminpercase === "10") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '10' }, { 'mins': '20' }, { 'mins': '30' }, { 'mins': '40' }, { 'mins': '50' }];
        }
        else if ($scope.hospital.Teleminpercase === "15") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '15' }, { 'mins': '30' }, { 'mins': '45' }];
        }
        else if ($scope.hospital.Teleminpercase === "20") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '20' }, { 'mins': '40' }];
        }
        else if ($scope.hospital.Teleminpercase === "30") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '30' }];
        }
        else if ($scope.hospital.Teleminpercase === "60") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }];
        }
    };
    $scope.changemintues();
    $scope.startValues = [];
    $scope.endValues = [];


    $scope.TimeSlots = {
        "SlotStartValues": [],
        "SlotStartTime": "",
        "SlotEndValues": [],
        "SlotEndTime": "",
        "OpSlotStartValues": [],
        "OpSlotStartTIme": [],
        "OpSlotEndValues": [],
        "OpSlotEndTime": [],
        "OTSlotStartValues": [],
        "OTSlotStartTime": [],
        "OTSlotEndValues": [],
        "OTSlotEndTime": [],
        "OpNewApptStartValues": [],
        "OpNewApptStartTime": [],
        "OpNewApptEndValues": [],
        "OpNewApptEndTime": [],
        "OpNewApptWalkinStartValues": [],
        "OpNewApptWalkinStartTime": [],
        "OpNewApptWalkinEndValues": [],
        "OpNewApptWalkinEndTime": [],
        "OpNewApptOnlineStartValues": [],
        "OpNewApptOnlineStartTime": [],
        "OpNewApptOnlineEndValues": [],
        "OpNewApptOnlineEndTime": [],
        "OpNewApptTeleStartValues": [],
        "OpNewApptTeleStartTime": [],
        "OpNewApptTeleEndValues": [],
        "OpNewApptTeleEndTime": [],
        "OpFollowUpStartValues": [],
        "OpFollowUpStartTime": [],
        "OpFollowUpEndValues": [],
        "OpFollowUpEndTime": [],
        "OpFollowUpWalkinStartValues": [],
        "OpFollowUpWalkinStartTime": [],
        "OpFollowUpWalkinEndValues": [],
        "OpFollowUpWalkinEndTime": [],
        "OpFollowUpOnlineStartValues": [],
        "OpFollowUpOnlineStartTime": [],
        "OpFollowUpOnlineEndValues": [],
        "OpFollowUpOnlineEndTime": [],
        "OpFollowUpTeleStartValues": [],
        "OpFollowUpTeleStartTime": [],
        "OpFollowUpTeleEndTime": [],
        "GeneralSlotTypeId": "",
        "GeneralSlotStartValues": [],
        "GeneralSlotEndValues": [],
        "GeneralStartTime": "",
        "GeneralEndTime": "",
        "VisitSlotSubTypeId": "",
        "VisitTypeSubStartValues": [],
        "VisitTypeSubEndValues": [],
        "VisitTypeStartTime": "",
        "VisitTypeEndTime": ""
    };


    function getNewTimeSlotsEmptyObj() {
        var obj = {
            "SlotStartValues": [],
            "SlotStartTime": "",
            "SlotEndValues": [],
            "SlotEndTime": "",
            "OpSlotStartValues": [],
            "OpSlotStartTIme": [],
            "OpSlotEndValues": [],
            "OpSlotEndTime": [],
            "OTSlotStartValues": [],
            "OTSlotStartTime": [],
            "OTSlotEndValues": [],
            "OTSlotEndTime": [],
            "OpNewApptStartValues": [],
            "OpNewApptStartTime": [],
            "OpNewApptEndValues": [],
            "OpNewApptEndTime": [],
            "OpNewApptWalkinStartValues": [],
            "OpNewApptWalkinStartTime": [],
            "OpNewApptWalkinEndValues": [],
            "OpNewApptWalkinEndTime": [],
            "OpNewApptOnlineStartValues": [],
            "OpNewApptOnlineStartTime": [],
            "OpNewApptOnlineEndValues": [],
            "OpNewApptOnlineEndTime": [],
            "OpNewApptTeleStartValues": [],
            "OpNewApptTeleStartTime": [],
            "OpNewApptTeleEndValues": [],
            "OpNewApptTeleEndTime": [],
            "OpFollowUpStartValues": [],
            "OpFollowUpStartTime": [],
            "OpFollowUpEndValues": [],
            "OpFollowUpEndTime": [],
            "OpFollowUpWalkinStartValues": [],
            "OpFollowUpWalkinStartTime": [],
            "OpFollowUpWalkinEndValues": [],
            "OpFollowUpWalkinEndTime": [],
            "OpFollowUpOnlineStartValues": [],
            "OpFollowUpOnlineStartTime": [],
            "OpFollowUpOnlineEndValues": [],
            "OpFollowUpOnlineEndTime": [],
            "OpFollowUpTeleStartValues": [],
            "OpFollowUpTeleStartTime": [],
            "OpFollowUpTeleEndTime": [],
            "GeneralSlotTypeId": "",
            "GeneralSlotStartValues": [],
            "GeneralSlotEndValues": [],
            "GeneralStartTime": "",
            "GeneralEndTime": "",
            "VisitSlotSubTypeId": "",
            "VisitTypeSubStartValues": [],
            "VisitTypeSubEndValues": [],
            "VisitTypeStartTime": "",
            "VisitTypeEndTime": "",
            "GeneralMaxSolts": ""
        }

        return obj;
    };

    $scope.TimeSlots = getNewTimeSlotsEmptyObj();

    $scope.generalSlotTypesArray = [
        {
            "VisitSlotType": "New",
            "VisitSlotTypeId": 1,
        },
        {
            "VisitSlotType": "FollowUp",
            "VisitSlotTypeId": 2,
        },
        {
            "VisitSlotType": "ASC",
            "VisitSlotTypeId": 3,
        }

    ];


    $scope.generalVisitSlotTypesArray = [
        {
            "VisitSlotSubType": "Walkin",
            "VisitSlotSubTypeId": 1,
        },
        {
            "VisitSlotSubType": "Online",
            "VisitSlotSubTypeId": 2,
        },
        {
            "VisitSlotSubType": "Tele",
            "VisitSlotSubTypeId": 3,
        }
    ];

    //$scope.TimeSlots.SlotStartValues = [];
    //$scope.TimeSlots.SlotEndValues = [];
    //$scope.TimeSlots.OpSlotStartValues = [];
    //$scope.TimeSlots.OpSlotEndValues = [];
    //$scope.TimeSlots.OTSlotStartValues = [];
    //$scope.TimeSlots.OTSlotEndValues = [];
    //$scope.TimeSlots.OpNewApptStartValues = [];
    //$scope.TimeSlots.OpNewApptEndValues = [];
    //$scope.TimeSlots.OpNewApptWalkinStartValues = [];
    //$scope.TimeSlots.OpNewApptWalkinEndValues = [];
    //$scope.TimeSlots.OpNewApptOnlineStartValues = [];
    //$scope.TimeSlots.OpNewApptOnlineEndValues = [];
    //$scope.TimeSlots.OpNewApptTeleStartValues = [];
    //$scope.TimeSlots.OpNewApptTeleEndValues = [];
    //$scope.TimeSlots.OpFollowUpStartValues = [];
    //$scope.TimeSlots.OpFollowUpEndValues = [];
    //$scope.TimeSlots.OpFollowUpWalkinStartValues = [];
    //$scope.TimeSlots.OpFollowUpWalkinEndValues = [];
    //$scope.TimeSlots.OpFollowUpOnlineStartValues = [];
    //$scope.TimeSlots.OpFollowUpOnlineEndValues = [];
    //$scope.TimeSlots.OpFollowUpTeleStartValues = [];
    //$scope.TimeSlots.OpFollowUpTeleEndValues = [];


    $scope.AddBusinessHours = function () {
        var newitem = { ApplyTo: false, DayCode: 'Sunday', DayCD: 'SUN', Active: 'N', StartTimeHH: '00', StartTimeMM: '00', StartTime: '00:00', EndTimeHH: '00', EndTimeMM: '00', EndTime: '00:00' };
        $scope.consultationDetails.push(newitem);
    };
    if ($scope.consultationDetails.length == 0) {
        $scope.AddBusinessHours();
    }
    $scope.getEndTime = function (val) {


        $scope.endValues = [];
        for (var i = parseInt(val); i < 24; i++) {
            if (i > 9) {
                $scope.endValues.push({ 'time': i });
            } else {
                $scope.endValues.push({ 'time': '0' + i });
            }
        }

        $scope.endTimeHH = {
            'start': ""
        };

        console.log($scope.endValues);

        console.log($scope.startTimeHH.start);
        if ($scope.startTimeHH.start !== '00' && ($scope.endTimeHH.start !== '00' || $scope.endTimeHH.start !== "")) {
            getStartTimeInAllowSlots($scope.startTimeHH.start);
        }
    };


    function getStartTime() {
        $scope.startValues.length = 0;
        for (var i = 0; i < 24; i++) {
            if (i > 9) {
                $scope.startValues.push({ 'time': i });
            }
            else {
                $scope.startValues.push({ 'time': '0' + i });
            }
        }
        $scope.getEndTime(0);

    }


    getStartTime();



    $scope.getSlotEndTimesList = function (val) {


        $scope.TimeSlots.SlotEndValues = [];

        $scope.TimeSlots.OpSlotStartValues = [];

        for (var i = parseInt(val); i < 24; i++) {
            if (i > 9) {
                $scope.TimeSlots.SlotEndValues.push({ 'time': i });
            } else {
                $scope.TimeSlots.SlotEndValues.push({ 'time': '0' + i });
            }
        }

        $scope.TimeSlots.SlotEndTime = "";




        if ($scope.TimeSlots.SlotEndTime !== '00' || $scope.TimeSlots.SlotEndTime !== "") {




            var val1 = 24;
            if ($scope.TimeSlots.SlotEndTime == '00' || $scope.TimeSlots.SlotEndTime == "") {
                val1 = 24;
            } else if ($scope.TimeSlots.SlotEndTime !== '00') {
                val1 = $scope.TimeSlots.SlotEndTime;
            }

            for (var i = parseInt($scope.TimeSlots.SlotStartTime); i <= parseInt(val1); i++) {
                if (i > 9) {
                    $scope.TimeSlots.OpSlotStartValues.push({ 'time': i });
                    $scope.TimeSlots.OTSlotStartValues.push({ 'time': i });
                }
                else {
                    $scope.TimeSlots.OpSlotStartValues.push({ 'time': '0' + i });
                    $scope.TimeSlots.OTSlotStartValues.push({ 'time': '0' + i });
                }
            };

            console.log($scope.TimeSlots.OpSlotStartValues);
            console.log($scope.TimeSlots.OTSlotStartValues);

            var tempTimeArray = [];
            angular.forEach($scope.TimeSlots.OpSlotStartValues, function (hitem) {
                angular.forEach($scope.consultationminituesvalue, function (mitem) {
                    tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
                });
            });

            $scope.TimeSlots.OpSlotStartValues = angular.copy(tempTimeArray);
            $scope.TimeSlots.OTSlotStartValues = angular.copy(tempTimeArray);

            console.log($scope.TimeSlots.OpSlotStartValues);
            console.log($scope.TimeSlots.OTSlotStartValues);

            $scope.newUserTimeSlotObj.SlotStartTime = $scope.TimeSlots.SlotStartTime.toString() + ':' + "00";
            $scope.newUserTimeSlotObj.SlotEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";


            $scope.newUserTimeSlotObj.OPStartTime = $scope.TimeSlots.SlotStartTime.toString() + ':' + "00";
            $scope.newUserTimeSlotObj.OPEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";

            if ($scope.TimeSlots.SlotEndTime === "") {
                $scope.newUserTimeSlotObj.OPEndTime = "";
            }

            $scope.newUserTimeSlotObj.OTStartTime = $scope.TimeSlots.SlotStartTime.toString() + ':' + "00";
            $scope.newUserTimeSlotObj.OTEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";
            if ($scope.TimeSlots.SlotEndTime === "") {
                $scope.newUserTimeSlotObj.OTEndTime = "";
            }

        }
        $scope.ChangeAllowOPOtSameSlots($scope.newUserTimeSlotObj);
    };



    $scope.getOTSlotEndTimesList = function (val) {

        $scope.TimeSlots.OTSlotEndValues = [];
        var val1 = 24;
        if ($scope.TimeSlots.OTSlotEndTime == '00' || $scope.TimeSlots.OTSlotEndTime == "") {
            val1 = 24;
        } else if ($scope.TimeSlots.OTSlotEndTime !== '00') {
            val1 = $scope.TimeSlots.OTSlotEndTime;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.TimeSlots.OTSlotEndValues.push({ 'time': i });
            } else {
                $scope.TimeSlots.OTSlotEndValues.push({ 'time': '0' + i });
            }
        }
        var tempTimeArray = [];
        angular.forEach($scope.TimeSlots.OTSlotEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.TimeSlots.OTSlotEndValues = angular.copy(tempTimeArray);

        console.log($scope.TimeSlots.OTSlotEndValues);

        if ($scope.TimeSlots.OTSlotEndValues.length > 0) {
            $scope.TimeSlots.OTSlotEndTime = $scope.TimeSlots.OTSlotStartTime.toString();


        } else {
            $scope.TimeSlots.OTSlotEndTime = '';
        }

    };

    $scope.changeEndSlotTimeList = function (obj) {
        //  $scope.getSlotEndTimesList();
        console.log(obj);
        console.log(obj.SlotEndTime);
        $scope.ChangeAllowOPOtSameSlots($scope.newUserTimeSlotObj);
        $scope.newUserTimeSlotObj.OPEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";
        $scope.newUserTimeSlotObj.OTEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";


    };

    $scope.ChangeOTSlotEndTimesList = function (val) {

    };


    $scope.getOpSlotEndTimesList = function (val) {

        $scope.TimeSlots.OpSlotEndValues = [];
        var val1 = 24;
        if ($scope.TimeSlots.OpSlotEndTime == '00' || $scope.TimeSlots.OpSlotEndTime == "") {
            val1 = 24;
        } else if ($scope.TimeSlots.OpSlotEndTime !== '00') {
            val1 = $scope.TimeSlots.OpSlotEndTime;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.TimeSlots.OpSlotEndValues.push({ 'time': i });
            } else {
                $scope.TimeSlots.OpSlotEndValues.push({ 'time': '0' + i });
            }
        }
        var tempTimeArray = [];
        angular.forEach($scope.TimeSlots.OpSlotEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.TimeSlots.OpSlotEndValues = angular.copy(tempTimeArray);

        console.log($scope.TimeSlots.OpSlotEndValues);

        if ($scope.TimeSlots.OpSlotEndValues.length > 0) {
            $scope.TimeSlots.OpSlotEndTime = $scope.TimeSlots.OpSlotStartTime.toString();
        } else {
            $scope.TimeSlots.OpSlotEndTime = '';
        }

    };



    $scope.getSlotTimesList = function () {

        $scope.TimeSlots.SlotStartValues = [];
        $scope.TimeSlots.SlotEndValues = [];



        for (var i = 0; i < 24; i++) {
            var thistime = "";
            if (i > 12) {
                var it = i - 12;
                if (it > 9) {
                    thistime = it + ':00' + ': PM';
                } else {
                    thistime = '0' + it + ':00' + ': PM';
                }
            }
            else {
                var it = i;
                if (it > 9) {
                    if (it >= 12) {
                        thistime = it + ':00' + ': PM';
                    } else {
                        thistime = it + ':00' + ': AM';
                    }

                } else {
                    thistime = '0' + it + ':00' + ': AM';
                }
            }

            var obj = {
                "time": "",
                "newtime": ""
            }

            if (i > 9) {
                obj.time = i + ':00';
                obj.newtime = thistime;
            }
            else {
                obj.time = '0' + i + ':00';
                obj.newtime = thistime;
            }
            $scope.TimeSlots.SlotStartValues.push(obj);
        }


        for (var i = 0; i < 24; i++) {
            var thistime = "";
            if (i > 12) {
                var it = i - 12;
                if (it > 9) {
                    thistime = it + ':00' + ': PM';
                } else {
                    thistime = '0' + it + ':00' + ': PM';
                }
            }
            else {
                var it = i;
                if (it > 9) {
                    if (it >= 12) {
                        thistime = it + ':00' + ': PM';
                    } else {
                        thistime = it + ':00' + ': AM';
                    }

                } else {
                    thistime = '0' + it + ':00' + ': AM';
                }
            }

            var obj = {
                "time": "",
                "newtime": ""
            }

            if (i > 9) {
                obj.time = i + ':00';
                obj.newtime = thistime;
            }
            else {
                obj.time = '0' + i + ':00';
                obj.newtime = thistime;
            }
            $scope.TimeSlots.SlotEndValues.push(obj);
        }



        console.log($scope.TimeSlots.SlotStartValues);
        console.log($scope.TimeSlots.SlotEndValues);
    };

    $scope.getSlotTimesList();



    $scope.getGeneralSlotEndTimesList = function (val) {


        var starray = val.time.split(':');
        console.log("Endtimes");

        var stTime = parseInt(starray[0]);


        $scope.TimeSlots.GeneralSlotEndValues = [];
        var val1 = 24;
        if ($scope.TimeSlots.SlotEndTime == '00' || $scope.TimeSlots.SlotEndTime == "") {
            val1 = 24;
        } else if ($scope.TimeSlots.SlotEndTime !== '00') {
            val1 = $scope.TimeSlots.SlotEndTime;
        }


        console.log(starray + "__" + val1);

        for (var i = parseInt(stTime); i < parseInt(val1); i++) {
            if (i > 9) {
                $scope.TimeSlots.GeneralSlotEndValues.push({ 'time': i });
            } else {
                $scope.TimeSlots.GeneralSlotEndValues.push({ 'time': '0' + i });
            }
        };

        var tempTimeArray = [];
        angular.forEach($scope.TimeSlots.GeneralSlotEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.TimeSlots.GeneralSlotEndValues = angular.copy(tempTimeArray);

        console.log($scope.TimeSlots.GeneralSlotEndValues);

        $scope.TimeSlots.GeneralEndTime = "";

    };


    $scope.getGeneralVisitSlotEndTimesList = function (val, obj) {


        var starray = val.time.split(':');
        console.log(starray);

        var stTime = parseInt(starray[0]);


        $scope.TimeSlots.VisitTypeSubEndValues = [];



        var EndtimeArray = obj.EndTime.split(':');
        var EndtTime = parseInt(EndtimeArray[0]);

        var val1 = EndtTime;


        for (var i = parseInt(stTime); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.TimeSlots.VisitTypeSubEndValues.push({ 'time': i });
            } else {
                $scope.TimeSlots.VisitTypeSubEndValues.push({ 'time': '0' + i });
            }
        };

        var tempTimeArray = [];
        angular.forEach($scope.TimeSlots.VisitTypeSubEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.TimeSlots.VisitTypeSubEndValues = angular.copy(tempTimeArray);

        console.log($scope.TimeSlots.VisitTypeSubEndValues);

        $scope.TimeSlots.GeneralEndTime = "";

    };




    $scope.getGeneralSlotStartTimesList = function (val) {


        $scope.TimeSlots.GeneralSlotStartValues = [];
        $scope.TimeSlots.GeneralSlotEndValues = [];


        $scope.TimeSlots.GeneralStartTime = "";




        if ($scope.TimeSlots.SlotEndTime !== '00' || $scope.TimeSlots.SlotEndTime !== "") {




            var val1 = 24;
            if ($scope.TimeSlots.SlotEndTime == '00' || $scope.TimeSlots.SlotEndTime == "") {
                val1 = 24;
            } else if ($scope.TimeSlots.SlotEndTime !== '00') {
                val1 = $scope.TimeSlots.SlotEndTime;
            }

            for (var i = parseInt($scope.TimeSlots.SlotStartTime); i < parseInt(val1); i++) {
                if (i > 9) {
                    $scope.TimeSlots.GeneralSlotStartValues.push({ 'time': i });
                    $scope.TimeSlots.GeneralSlotEndValues.push({ 'time': i });
                }
                else {
                    $scope.TimeSlots.GeneralSlotStartValues.push({ 'time': '0' + i });
                    $scope.TimeSlots.GeneralSlotEndValues.push({ 'time': '0' + i });

                }
            };



            console.log($scope.TimeSlots.GeneralSlotStartValues);
            console.log($scope.TimeSlots.GeneralSlotEndValues);



            var tempTimeArray = [];
            angular.forEach($scope.TimeSlots.GeneralSlotStartValues, function (hitem) {
                angular.forEach($scope.consultationminituesvalue, function (mitem) {
                    tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
                });
            });

            $scope.TimeSlots.GeneralSlotStartValues = angular.copy(tempTimeArray);


            console.log($scope.TimeSlots.GeneralSlotStartValues);



            var tempTimeArray2 = [];
            angular.forEach($scope.TimeSlots.GeneralSlotEndValues, function (hitem) {
                angular.forEach($scope.consultationminituesvalue, function (mitem) {
                    tempTimeArray2.push({ 'time': hitem.time + ':' + mitem.mins });
                });
            });

            $scope.TimeSlots.GeneralSlotEndValues = angular.copy(tempTimeArray2);


            //$scope.newUserTimeSlotObj.SlotStartTime = $scope.TimeSlots.SlotStartTime.toString() + ':' + "00";
            //$scope.newUserTimeSlotObj.SlotEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";


        }
    };
    //  $scope.getGeneralSlotStartTimesList(0);

    $scope.changeGeneralSlotEndTimesList = function () {

    }

    $scope.changeGeneralVisitSlotEndTimesList = function () {

    }



    $scope.getWalkinOnlineGeneralSlotStartTimeList = function (obj) {


        $scope.TimeSlots.VisitTypeSubStartValues = [];
        $scope.TimeSlots.VisitTypeSubEndValues = [];

        var sttimeArray = obj.StartTime.split(':');
        var stTime = parseInt(sttimeArray[0]);

        $scope.TimeSlots.GeneralStartTime = "";




        if (obj.StartTime !== '00' && (obj.EndTime !== '00' || $scope.TimeSlots.EndTime !== "")) {


            var EndtimeArray = obj.EndTime.split(':');
            var EndtTime = parseInt(EndtimeArray[0]);

            var val1 = EndtTime;


            for (var i = parseInt(stTime); i < parseInt(val1); i++) {
                if (i > 9) {
                    $scope.TimeSlots.VisitTypeSubStartValues.push({ 'time': i });
                    $scope.TimeSlots.VisitTypeSubEndValues.push({ 'time': i });
                }
                else {
                    $scope.TimeSlots.VisitTypeSubStartValues.push({ 'time': '0' + i });
                    $scope.TimeSlots.VisitTypeSubEndValues.push({ 'time': '0' + i });

                }
            };



            console.log($scope.TimeSlots.VisitTypeSubStartValues);
            console.log($scope.TimeSlots.VisitTypeSubEndValues);



            var tempTimeArray = [];
            angular.forEach($scope.TimeSlots.VisitTypeSubStartValues, function (hitem) {
                angular.forEach($scope.consultationminituesvalue, function (mitem) {
                    tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
                });
            });

            $scope.TimeSlots.VisitTypeSubStartValues = angular.copy(tempTimeArray);


            console.log($scope.TimeSlots.VisitTypeSubStartValues);



            var tempTimeArray2 = [];
            angular.forEach($scope.TimeSlots.VisitTypeSubEndValues, function (hitem) {
                angular.forEach($scope.consultationminituesvalue, function (mitem) {
                    tempTimeArray2.push({ 'time': hitem.time + ':' + mitem.mins });
                });
            });

            $scope.TimeSlots.VisitTypeSubEndValues = angular.copy(tempTimeArray2);






        }
    };


    $scope.selection = [];
    $scope.checkAll = function (selectedAll) {
        if ($scope.selection.length !== 7) {
            $scope.selection = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        }
        else {
            $scope.selection = [];
        }
    };
    $scope.toggleSelection = function toggleSelection(val) {
        var idx = $scope.selection.indexOf(val);
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }
        else {
            $scope.selection.push(val);
        }
        if ($scope.selection.length === 0 || $scope.selection.length < 7) {
            $scope.selectedAll = false;
        }
        if ($scope.selection.length === 7) {
            $scope.selectedAll = true;
        }
    };
    $scope.daycdList = [{ "id": "Sunday", "value": "SUN" }, { "id": "Monday", "value": "MON" }, { "id": "Tuesday", "value": "TUE" }, { "id": "Wednesday", "value": "WED" }, { "id": "Thursday", "value": "THU" }, { "id": "Friday", "value": "FRI" }, { "id": "Saturday", "value": "SAT" }];
    function resetFields() {
        $scope.startTimeHH.start = "00";
        $scope.startTimeMM.end = "00";
        $scope.endTimeHH.start = "00";
        $scope.endTimeMM.end = "00";
        $scope.selection.length = 0;
        getStartTime();
        $scope.updateTimingsStatus = false;
        overlapped_check = true;
        $scope.TimeSlotType = 'Normal Slot';
        $scope.TimeTNSlotType = 'TNormal Slot';

    }
    function resetData() {
        $scope.edit_AddressID = undefined;
        $scope.selection.length = 0;
        deleteTempStatus = false;
        $scope.addHospitalDoc = false;
        $scope.editDoctorBasic = false;
        departments_status = false;
        $scope.newAddHospitalList.length = 0;
        $scope.consultationDetails.length = 0;
        $scope.TeleSlotconsultationDetails = [];
        $scope.DoctorDepartmentID = undefined;
        $scope.editPassword = false;
        $scope.ListingDisplay.length = 0;
    }
    $scope.resetPreviousData = function (type) {
        if (type === 'Normal Slot') {
            resetFields();
            $scope.consultationDetails = angular.copy(timingTempValues);
        } else {
            resetFields();
            $scope.TeleSlotconsultationDetails = angular.copy(teletimingTempValues);
        }

    };

    $scope.editTimings = function (val) {
        TimeId = val.TimeId;
        getStartTime();
        $scope.selection.length = 0;
        $scope.selection.push(val.DayCD);
        var timeStartVal = (val.StartTime).split(":");
        var timeEndVal = (val.EndTime).split(":");
        $scope.startTimeHH.start = timeStartVal[0];
        $scope.startTimeMM.end = timeStartVal[1];
        $scope.endTimeHH.start = timeEndVal[0];
        $scope.endTimeMM.end = timeEndVal[1];
        $scope.updateTimingsStatus = true;
    };
    $scope.removeTimings = function (remove) {
        var index = -1;
        $scope.consultationDetails.some(function (obj, i) {
            return obj.TimeId === remove.TimeId ? index = i : false;
        });
        $scope.consultationDetails.splice(index, 1);
        //Need todo service call here delete delete userbranch timigs and timingsdetails in table level directly
    };
    $scope.removeTeleTimings = function (remove) {
        var index = -1;
        $scope.TeleSlotconsultationDetails.some(function (obj, i) {
            return obj.TimeId === remove.TimeId ? index = i : false;
        });
        $scope.TeleSlotconsultationDetails.splice(index, 1);
    };
    $scope.UpdateTimings = function () {
        var index = -1;
        $scope.consultationDetails.some(function (obj, i) {
            return obj.TimeId === TimeId ? index = i : false;
        });
        $scope.consultationDetails[index].EndTime = $scope.endTimeHH.start + ':' + $scope.endTimeMM.end;
        $scope.consultationDetails[index].StartTime = $scope.startTimeHH.start + ':' + $scope.startTimeMM.end;
        resetFields();
    };
    $scope.ChangeSlotType = function (type) {
        $scope.TimeSlotType = type;
    };
    $scope.ChangeTeleSlotType = function (type) {
        $scope.TimeTNSlotType = type;
    };
    $scope.submitTimings = function () {
        if ($scope.startTimeHH.start > $scope.endTimeHH.start) {
            alertify.error('Please select valid start time and end time');
            return;
        }
        if ($scope.startTimeHH.start >= $scope.endTimeHH.start) {
            if ($scope.startTimeMM.end > $scope.endTimeMM.end) {
                alertify.error('Please select valid start time and end time');
                return;
            }
        }
        if ($scope.startTimeHH.start === "00") {
            alertify.error('Please select valid start time');
            return;
        }
        if ($scope.endTimeHH.start === "00") {
            alertify.error('Please select valid end time');
            return;
        }
        if ($scope.startTimeHH.start === $scope.endTimeHH.start) {
            if ($scope.startTimeMM.end === $scope.endTimeMM.end) {
                $scope.validStartTimeEndTime = true;
                alertify.error('Please select valid start time and end time');
                return;
            }
        }
        if ($scope.selection.length === 0) {
            alertify.error("Please select a day");
            return;
        }
        overlapped_check = true;
        if (!$scope.updateTimingsStatus) {
            angular.forEach($scope.selection, function (day) {
                if ($scope.TimeSlotType == 'Normal Slot') {
                    if ($scope.consultationDetails.length !== 0) {
                        angular.forEach($scope.consultationDetails, function (timings) {
                            if (timings.DayCD === day) {
                                var startingTime = $scope.startTimeHH.start + ':' + $scope.startTimeMM.end;
                                var endingTime = $scope.endTimeHH.start + ':' + $scope.endTimeMM.end;
                                if ((startingTime > timings.StartTime) && (endingTime < timings.EndTime)) {
                                    overlapped_check = false;
                                    return;
                                } else if ((startingTime > timings.StartTime && startingTime < timings.EndTime) || (endingTime > timings.StartTime && endingTime < timings.EndTime)) {
                                    overlapped_check = false;
                                    return;
                                } else if (startingTime === timings.StartTime || endingTime === timings.EndTime) {
                                    overlapped_check = false;
                                    return;
                                }
                            }
                        });
                    }
                } else {
                    if ($scope.TeleSlotconsultationDetails.length !== 0) {
                        angular.forEach($scope.TeleSlotconsultationDetails, function (timings) {
                            if (timings.DayCD === day) {
                                var startingTime = $scope.startTimeHH.start + ':' + $scope.startTimeMM.end;
                                var endingTime = $scope.endTimeHH.start + ':' + $scope.endTimeMM.end;
                                if ((startingTime > timings.StartTime) && (endingTime < timings.EndTime)) {
                                    overlapped_check = false;
                                    return;
                                } else if ((startingTime > timings.StartTime && startingTime < timings.EndTime) || (endingTime > timings.StartTime && endingTime < timings.EndTime)) {
                                    overlapped_check = false;
                                    return;
                                } else if (startingTime === timings.StartTime || endingTime === timings.EndTime) {
                                    overlapped_check = false;
                                    return;
                                }
                            }
                        });
                    }
                }

                if (!overlapped_check) {
                    return;
                }
            });
        }
        if (!overlapped_check) {
            alertify.error("Timings cannot be overlapped");
            resetFields();
        }
        TimeId = 0;
        if (overlapped_check) {
            if ($scope.TimeSlotType == 'Normal Slot') {
                angular.forEach($scope.selection, function (selecteditemset) {
                    TimeId = $scope.consultationDetails.length + 1;

                    //var SlotsArray = [];
                    //SlotsArray = createTimeSlots($scope.startTimeHH.start, $scope.startTimeMM.end, $scope.endTimeHH.start, $scope.endTimeMM.end, parseInt($scope.hospital.minpercase));

                    //console.log(SlotsArray);
                    $scope.consultationDetails.push({
                        UserBranchConsultID: 0,
                        DayCD: selecteditemset,
                        EndTime: $scope.endTimeHH.start + ':' + $scope.endTimeMM.end,
                        StartTime: $scope.startTimeHH.start + ':' + $scope.startTimeMM.end,
                        Fees: 0,
                        MinPerCase: parseInt($scope.hospital.minpercase),
                        TimeId: TimeId

                    });
                });
                $scope.isConsultationSlotsAvavilable = true;
            } else {
                angular.forEach($scope.selection, function (selecteditemset) {
                    //var SlotsArray = [];
                    //SlotsArray = createTimeSlots($scope.startTimeHH.start, $scope.startTimeMM.end, $scope.endTimeHH.start, $scope.endTimeMM.end, parseInt($scope.hospital.minpercase));
                    TimeId = $scope.consultationDetails.length + 1;
                    $scope.TeleSlotconsultationDetails.push({
                        UserBranchConsultID: 0,
                        DayCD: selecteditemset,
                        EndTime: $scope.endTimeHH.start + ':' + $scope.endTimeMM.end,
                        StartTime: $scope.startTimeHH.start + ':' + $scope.startTimeMM.end,
                        Fees: 0,
                        MinPerCase: parseInt($scope.hospital.Teleminpercase),
                        TimeId: TimeId
                    });
                });
                $scope.isConsultationTeleSlotsAvavilable = true;
            }


            if ($scope.TimeSlotType == 'Normal Slot') {
                angular.forEach($scope.consultationDetails, function (value, key) {
                    if (value.DayCD === "SUN" && value.StartTime === "00:00" && value.EndTime === "00:00") {
                        $scope.consultationDetails.splice(key, 1);
                    }
                });
            }

            resetFields();
            $scope.updateTimingsStatus = false;
        }
        TimeId = 0;

        //  $scope.changeUserBranch();
        if ($scope.hosUserCollection.UserAddress.length !== 0) {

            $scope.UserAddress = $filter("filter")($scope.hosUserCollection.UserAddress, function (item, index) { return item.ClinicId === $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchId })[0];
            console.log($scope.hosUserCollection.UserAddress);

            $scope.UserAddress.ExtDetails.ConsultDetails = $scope.consultationDetails;
            $scope.UserAddress.ExtDetails.TeleConsultDetails = $scope.TeleSlotconsultationDetails;
            $scope.UserAddress.UserSlotInfo = $scope.hosUserCollection.UserSlotInfo;
            $scope.hosUserCollection.UserAddress = [];
            $scope.hosUserCollection.UserAddress.push($scope.UserAddress);
        }
        //$scope.hosUserCollection.UserAddress[0].ExtDetails.ConsultDetails = $scope.consultationDetails;
        //$scope.hosUserCollection.UserAddress[0].ExtDetails.TeleConsultDetails = $scope.TeleSlotconsultationDetails;
        //angular.forEach($scope.hosUserCollection.UserAddress, function (item) {
        //    if (item.ClinicId === $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchId) {
        //        item.ExtDetails.ConsultDetails = $scope.consultationDetails;
        //        item.ExtDetails.TeleConsultDetails = $scope.TeleSlotconsultationDetails;

        //    }
        //});

    };





    function createTimeSlots(startHour, startmin, endHour, endmin, interval) {



        //var arr = startHour.split(':')
        //var shour = $.trim(arr[0]);
        //var smin = $.trim(arr[1]);


        //var arr2 = endHour.split(':')
        //var ehour = $.trim(arr2[0]);
        //var emin = $.trim(arr2[1]);

        var startingTime = moment().hours(startHour).minutes(startmin);
        var endingTime = moment().hours(endHour).minutes(endmin);

        $scope.timeslots = [];

        var currentStartTime = angular.copy(startingTime);
        var token = 1;
        while (currentStartTime < endingTime) {

            var slotObj = {
                "StartTime": currentStartTime.format("h:mm"),
                "EndTime": currentStartTime.add(interval, "minute").format("h:mm"),
                "TokenNumber": token,
                "Available": "Y"
            }
            token++;
            $scope.timeslots.push(slotObj);
        }

        return $scope.timeslots;
    }

    $scope.wizardStep = function (val) {
        if (val === 1) {
            $scope.step1 = true;
            $scope.step2 = false;
            $scope.step3 = false;
        }
    };

    $scope.CopyMobile = function (isSameContactNo) {
        if (isSameContactNo === true) {
            $scope.hosUserCollection.UserCommunicationPhone[0].PhNumber = $scope.hosUserCollection.UserPhone[0].PhNumber;
        } else {
            $scope.hosUserCollection.UserCommunicationPhone[0].PhNumber = "";
        }

    };
    $scope.hosUserCollection.UserDepartment = [];
    $scope.ChangeDepartment = function (item) {

        if ($scope.SelectedSplDeptArray.length > 0) {
            angular.forEach($scope.SelectedSplDeptArray, function (kitem) {
                if (kitem.SubSpecializationId === item.SubSpecializationId) {
                    kitem.IsPrimarySubSpecialization = false;
                    item.SubSpecializationId = kitem.SubSpecializationId;
                    item.BranchSpecializationId = kitem.BranchSpecializationId;
                    item.BranchSubSpecializationId = kitem.BranchSubSpecializationId;
                    item.OrganizationId = $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchId;
                    item.SpecializationId = kitem.SpecializationId;
                    item.SubSpecializationName = kitem.SubSpecializationName;
                    item.IsPrimarySubSpecialization = kitem.IsPrimarySubSpecialization;
                    // $scope.hosUserCollection.UserDepartment.push(kitem);
                    //if ($scope.hosUserCollection.OpthalDepartments.length > 0) {
                    //    var List = $filter("filter")($scope.hosUserCollection.OpthalDepartments, { "SubSpecializationId": item.SubSpecializationId }, true);
                    //    if (List.length > 0) {
                    //        alertify.error("Department is already added");
                    //        return false;
                    //    }
                    //}
                    //else {
                    //    $scope.hosUserCollection.OpthalDepartments.push(kitem);
                    //    $scope.hosUserCollection.UserDepartment.push(kitem);
                    //}

                }
            });
            //if ($scope.SubSpefilteredArray.length > 0) {
            //    var List = $filter("filter")($scope.hosUserCollection.OpthalDepartments, { "SubSpecializationId": $scope.SubSpefilteredArray[0].SubSpecializationId }, true);
            //    if (List.length > 0) {
            //        alertify.error("Department is already added");
            //        return false;
            //    }
            //} else {
            //    $scope.hosUserCollection.OpthalDepartments.push($scope.SubSpefilteredArray[0]);
            //    $scope.hosUserCollection.UserDepartment.push($scope.SubSpefilteredArray[0]);
            //}
            //console.log(SubSpefilteredArray);
            //if (SubSpefilteredArray !=="") {
            //    $scope.SubSpefilteredpushArray = $filter("filter")($scope.hosUserCollection.UserDepartment, function (kitem, index) { return kitem.SubSpecializationId === SubSpefilteredArray.c }, true)[0];
            //    if ($scope.SubSpefilteredpushArray.length == 0) {
            //        console.log(SubSpefilteredArray);
            //        //$scope.mainInvBillingObject.BillingDetail.push(treatObject);

            //    }
            //}
        }

    }

    $scope.changeIsPrimary = function (item, mitem) {
        mitem.IsPrimarySubSpecialization = item;
        if (item === true) {
            if ($scope.hosUserCollection.OpthalDepartments.length > 0) {
                angular.forEach($scope.hosUserCollection.OpthalDepartments, function (kitem) {
                    if (kitem.SubSpecializationId === mitem.SubSpecializationId) {
                        kitem.IsPrimarySubSpecialization = true;
                    }
                    else {
                        kitem.IsPrimarySubSpecialization = false;
                    }
                });
            }
        }
    }

    $scope.addUpdateDoctor = function (form, step, skip) {
        form = form || "";
        skip = skip || "no";

        var step1FormSet;
        var step2FormSet;
        if (skip === "no" || form !== "") {
            if (!form.$valid) {
                $window.scrollTo(0, angular.element(document.getElementById("usernameID")).offsetTop);
                return;
            }
        }
        if (step === 2 && skip === "no") {
            departments_status = true;
            step2FormSet = form;
        }
        if (step === 0) {
            $scope.step1 = true;
            $scope.step2 = false;
            $scope.step3 = false;
            return;
        } else if (step === 1) {
            $scope.step1 = false;
            if ($scope.editDoctorBasic) {
                $scope.step1 = false;
                $scope.step2 = false;
                $scope.step3 = false;
                step1FormSet = form;
                $scope.listingUsers = true;
            } else {
                if ($scope.rolesID.role.RoleName === 'WalkIn Doctor') {
                    step1FormSet = form;
                    $scope.addUpdateDoctor('', 3, 'yes');
                }
                else {
                    $scope.step2 = false;
                    $scope.step3 = true;
                    step1FormSet = form;
                }
                return;
            }
        } else if (step === 2) {
            $scope.step1 = false;
            $scope.step2 = false;
            $scope.step3 = true;
            return;
        } else if (step === 3 && skip === "no") {
            departments_status = true;
        } else if (step === 3 && skip === "yes") {
        }
        if (!$scope.editDoctorBasic && !deleteTempStatus) {
            //$scope.AddClinicDoc();
        }
        //var departmentParams = [];
        //if (departments_status) {
        //    departmentParams = [];
        //    departmentParams.push({
        //        "DepartmentID": parseInt($scope.hosUserCollection.DoctorDepartments[0].DepartmentID),
        //        "SubDepartmentID": parseInt($scope.hosUserCollection.DoctorDepartments[0].SubDepartmentID),
        //        "ActiveIND": "Y",
        //        "BillingStructure": $scope.hosUserCollection.DoctorDepartments[0].BillingStructure,
        //        "DoctorDepartmentID": ($scope.DoctorDepartmentID == undefined) ? undefined : $scope.DoctorDepartmentID,
        //        "DoctorConsultationFees": 0
        //    });
        //    $scope.hosUserCollection.doctorOtherDetails.PanCardID = $scope.hosUserCollection.doctorOtherDetails.PanCardID;
        //}

        //var departmentParams = [];
        //if (departments_status) {
        //    departmentParams = [];
        //    departmentParams.push({
        //        "BranchSubSpecializationId": 990,
        //        "SubSpecializationId": 1,
        //        "SubSpecializationName": "Cornea & Anterior Segment",
        //        "BranchSpecializationId": 228
        //    });
        //}
        var docId;
        var doc_loginID;
        var doc_passwordLogin;
        if ($scope.edit_status || deleteTempStatus || $scope.addHospitalDoc || $scope.editDoctorBasic) {
            docId = $scope.hosUserCollection.doctorDetails.DoctorID;
        } else {
            docId = undefined;
        }
        doc_passwordLogin = $scope.hosUserCollection.doctorDetails.DoctorPassword;
        if (($scope.editDoctorBasic && $scope.editPassword) || docId == undefined) {
            doc_loginID = $scope.hosUserCollection.doctorDetails.UserLoginID;
            doc_passwordLogin = $scope.hosUserCollection.doctorDetails.DoctorPassword;
        } else {
            doc_loginID = undefined;
            doc_passwordLogin = undefined;
        }
        doc_loginID = $scope.hosUserCollection.doctorDetails.UserLoginID;
        doc_passwordLogin = $scope.hosUserCollection.doctorDetails.DoctorPassword;
        if (doc_loginID === undefined) {
            doc_loginID = $scope.hosUserCollection.doctorDetails.UserLoginID;
        }
        docId = docId || 0;

        console.log($scope.hosUserCollection.SpecializationId);

        if ($scope.hosUserCollection.UserAddress.length === 0) {
            alertify.error("Please Select the Branch");
            return false;
        }
        if ($scope.hosUserCollection.UserAddress.length !== 0) {
            if ($scope.hosUserCollection.UserAddress[0].ClinicName === '') {
                alertify.error("Please Select the Branch");
                return false;
            }

        }
        if ($scope.hosUserCollection.UserBranchRoles.length > 0) {

            //  var list1 = $filter("filter")($scope.hosUserCollection.UserBranchRoles, { "RoleId": '' }, true);
            var list1 = $filter("filter")($scope.hosUserCollection.UserBranchRoles, function (bitem, index) { return bitem.RoleId === ""; });
            if (list1.length !== 0) {
                alertify.error("Please Select the  Role");
                return false;
            }
            //var list2 = $filter("filter")($scope.hosUserCollection.UserBranchRoles, { "GroupId": '' }, true);
            var list2 = $filter("filter")($scope.hosUserCollection.UserBranchRoles, function (bitem, index) { return bitem.GroupId === ""; });
            if (list2.length !== 0) {
                alertify.error("Please Select the  Group");
                return false;
            }
        }

        if ($scope.hosUserCollection.OpthalDepartments.length === 0) {
            alertify.error("Please Select the Department");
            return false;
        }
        $scope.hosUserCollection.UserDepartments = [];
        if ($scope.hosUserCollection.OpthalDepartments.length > 1 || $scope.hosUserCollection.OpthalDepartments.length == 1) {
            angular.forEach($scope.hosUserCollection.OpthalDepartments, function (item) {
                if (item.SubSpecializationId !== "") {
                    $scope.hosUserCollection.UserDepartments.push(item);
                }

            });
        }
        console.log($scope.consultationDetails);
        console.log($scope.TeleSlotconsultationDetails);

        if ($scope.hosUserCollection.UserDepartments.length > 0) {

            var list = $filter("filter")($scope.hosUserCollection.UserDepartments, { "IsPrimarySubSpecialization": true }, true);
            if (list.length === 0) {
                alertify.error("Please Select the Primary Department");
                return false;
            }
        }


        var params = {
            "USRType": "ADMIN",
            "TermsAccepted": "Y",
            "Searchable": "Y",
            "UserId": doctorinfo.doctorid,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
            "SubOrganizationId": doctorinfo.doctordata.UserAddress[0].SubOrganizationId,
            "UserDetails": {
                "DoctorID": docId,
                "FirstName": ($scope.hosUserCollection.doctorDetails.FirstName === undefined) ? undefined : $scope.hosUserCollection.doctorDetails.FirstName,
                "LastName": ($scope.hosUserCollection.doctorDetails.LastName === undefined) ? undefined : $scope.hosUserCollection.doctorDetails.LastName,
                "Exp": parseInt($scope.hosUserCollection.doctorDetails.Exp),
                "TermsAccepted": "1",
                "FullName": ($scope.hosUserCollection.doctorDetails.FirstName === undefined) ? $scope.hosUserCollection.doctorDetails.FullName : $scope.hosUserCollection.doctorDetails.FirstName + ' ' + $scope.hosUserCollection.doctorDetails.LastName,
                "UserLoginID": doc_loginID,
                "UserPassword": doc_passwordLogin,
                "Prospect": "Y",
                "Active": "Y",
                "Gender": $scope.hosUserCollection.doctorDetails.Gender,
                "RoleId": parseInt($scope.role.RoleId),
                "GroupId": parseInt($scope.group.GroupId),
                "SpecializationId": $scope.hosUserCollection.SpecializationId || 0,
                "AvgConsultationTime": parseInt($scope.hospital.minpercase),
                "TeleAvgConsultationTime": parseInt($scope.hospital.Teleminpercase),
                "ConsulationPrice": $scope.hospital.ConsulationPrice,
                "ConsulationFreeSlots": $scope.hospital.ConsulationFreeSlots,
                "ConsulationFreeSlotsDays": $scope.hospital.ConsulationFreeSlotsDays,
                "ConsulationFreeSlotsDaysType": $scope.hospital.ConsulationFreeSlotsDaysType,
                "TeleConsulationPrice": $scope.hospital.TeleConsulationPrice,
                "TeleConsulationFreeSlots": $scope.hospital.TeleConsulationFreeSlots,
                "TeleConsulationFreeSlotsDays": $scope.hospital.TeleConsulationFreeSlotsDays,
                "TeleConsulationFreeSlotsDaysType": $scope.hospital.TeleConsulationFreeSlotsDaysType
            },
            "UserBranchRoles": $scope.hosUserCollection.UserBranchRoles || [],
            //"UserBranchRoles": [
            //    {
            //        "RoleId": "",
            //        "RoleName": "",
            //        "GroupId": "",
            //        "GroupName": "",
            //        "GroupArray": [],

            //    }
            //],
            "UserSlotInfo": {
                "MultiSlotEnable": $scope.hosUserCollection.UserSlotInfo.MultiSlotEnable,
                "CrossConsultationOption": $scope.hosUserCollection.UserSlotInfo.CrossConsultationOption,
                "NormalSlots": {
                    "ConsultationFee": $scope.hosUserCollection.UserSlotInfo.NormalSlots.ConsultationFee,
                    "FreeNoOfSlots": $scope.hosUserCollection.UserSlotInfo.NormalSlots.FreeNoOfSlots || 1,
                    "FreeFollowUpNoOfDays": $scope.hosUserCollection.UserSlotInfo.NormalSlots.FreeFollowUpNoOfDays
                },
                "TeleSlots": {
                    "ConsultationFee": $scope.hosUserCollection.UserSlotInfo.TeleSlots.ConsultationFee,
                    "FreeNoOfSlots": $scope.hosUserCollection.UserSlotInfo.TeleSlots.FreeNoOfSlots || 1,
                    "FreeFollowUpNoOfDays": $scope.hosUserCollection.UserSlotInfo.TeleSlots.FreeFollowUpNoOfDays
                },
                "CrossConsultationNormalSlots": {
                    "FreeNoOfTeleSlots": $scope.hosUserCollection.UserSlotInfo.CrossConsultationNormalSlots.FreeNoOfTeleSlots,
                    "FreeTeleSlotsValidity": $scope.hosUserCollection.UserSlotInfo.CrossConsultationNormalSlots.FreeTeleSlotsValidity,
                    "FreeNoOfNormalSlots": $scope.hosUserCollection.UserSlotInfo.CrossConsultationNormalSlots.FreeNoOfNormalSlots,
                    "FreeNormalSlotsValidity": $scope.hosUserCollection.UserSlotInfo.CrossConsultationNormalSlots.FreeNormalSlotsValidity
                },
                "CrossConsultationTeleSlots": {
                    "FreeNoOfTeleSlots": $scope.hosUserCollection.UserSlotInfo.CrossConsultationTeleSlots.FreeNoOfTeleSlots || 1,
                    "FreeTeleSlotsValidity": $scope.hosUserCollection.UserSlotInfo.CrossConsultationTeleSlots.FreeTeleSlotsValidity,
                    "FreeNoOfNormalSlots": $scope.hosUserCollection.UserSlotInfo.CrossConsultationTeleSlots.FreeNoOfNormalSlots,
                    "FreeNormalSlotsValidity": $scope.hosUserCollection.UserSlotInfo.CrossConsultationTeleSlots.FreeNormalSlotsValidity
                }
            },
            "DoctorSettings": {
                "ColorCode": "#3F51B5",
                "DoctorNickName": ""
            },
            "UserAddress": $scope.hosUserCollection.UserAddress,
            //"UserOpthalDepartments": $scope.hosUserCollection.OpthalDepartments,
            "SubSpecializations": $scope.hosUserCollection.UserDepartments,
            "CommunicationEmailId": $scope.hosUserCollection.CommunicationEmailId || $scope.hosUserCollection.doctorDetails.CommunicationEmailId
        };

        if (params.UserAddress.length === 0) {
            params.UserAddress = doctorinfo.doctordata.UserAddress || [];
        }
        console.log(JSON.stringify(params));
        var phType;
        doctor_phone.length = 0;
        if ($scope.hosUserCollection.UserPhone !== undefined) {
            for (var i = 0; i < $scope.hosUserCollection.UserPhone.length; i++) {
                if ($scope.hosUserCollection.UserPhone[i].PhType === "M") {
                    phType = (($scope.hosUserCollection.UserPhone[i].PhNumber).toString()).substring(0, 4);
                } else {
                    phType = $scope.hosUserCollection.UserPhone[i].PhAreaCD;
                }
                doctor_phone.push({
                    "PhCntryCD": 91,
                    "PhStateCD": 78,
                    "PhAreaCD": parseInt(phType),
                    "PhNumber": parseInt($scope.hosUserCollection.UserPhone[i].PhNumber),
                    "PhType": $scope.hosUserCollection.UserPhone[i].PhType.toString(),
                    "RowID": i,
                    "PrimaryIND": "Y",
                    "PublicDisplay": "Y"
                });
            }
        }
        params["CustomSpecialityDes"] = doctor_phone;
        params["UserPhone"] = doctor_phone;
        var phType1;
        doctor_Communicationphone.length = 0;
        if ($scope.hosUserCollection.UserCommunicationPhone !== undefined) {
            for (var i = 0; i < $scope.hosUserCollection.UserCommunicationPhone.length; i++) {
                if ($scope.hosUserCollection.UserCommunicationPhone[i].PhType === "M") {
                    phType1 = (($scope.hosUserCollection.UserCommunicationPhone[i].PhNumber).toString()).substring(0, 4);
                } else {
                    phType1 = $scope.hosUserCollection.UserCommunicationPhone[i].PhAreaCD;
                }
                doctor_Communicationphone.push({
                    "PhCntryCD": 91,
                    "PhStateCD": 78,
                    "PhAreaCD": parseInt(phType1),
                    "PhNumber": parseInt($scope.hosUserCollection.UserCommunicationPhone[i].PhNumber),
                    "PhType": $scope.hosUserCollection.UserCommunicationPhone[i].PhType.toString(),
                    "RowID": i,
                    "PrimaryIND": "Y",
                    "PublicDisplay": "Y"
                });
            }
        }
        //params["CustomSpecialityDes"] = doctor_phone;
        params["UserCommunicationPhone"] = doctor_Communicationphone;


        // params["UserDepartments"] = departmentParams;
        if (deleteTempStatus) {
            params.UserDetails.Prospect = "N";
            params.UserDetails.Active = "N";
        }
        if (params.UserDetails.SpecializationId === "") {
            var specialityValues = GetKeyValuePairSpceciality($scope.hosUserCollection.SpecialityDetails, $scope.specialitylist);

            params.UserDetails.SpecializationId = specialityValues.Id;
            if (params.UserDetails.SpecializationId == undefined) {
                params.UserDetails.SpecializationId = $scope.hosUserCollection.doctorDetails.SpecializationId;
                params.UserId = doctorinfo.doctorid;
            }
        }
        var customSpecialities = GetKeyValuePairCustomSpceciality($scope.hosUserCollection.SpecialityDetails);
        params.CustomSpecialityDesc = customSpecialities;



        console.log(JSON.stringify(params));


        if ($scope.edit_status || deleteTempStatus || $scope.addHospitalDoc || $scope.editDoctorBasic) {
            eHnoteMainAdminServices.UpdateUser(params, onAddUpdateDoctorSuccess, onAddUpdateDoctorError);
        } else {
            eHnoteMainAdminServices.AddUser(params, onAddUpdateDoctorSuccess, onAddUpdateDoctorError);
        }
        function onAddUpdateDoctorSuccess(data) {
            if (data.status === "Failure") {
                alertify.error(data.Message);
                return;
            }
            if (data === "ALREADY_LOGINID_EXISTS") {
                alertify.error("User Id already exist");
                return;
            }
            else if (data === "INVALID_EMAIL_ID") {
                alertify.error("Invalid email Id");
                return;
            }
            else if (data === "INVALID_DOCTOR_ID") {
                alertify.error("Invalid doctor Id");
                return;
            } else if (data === "LICENSE_LIMIT_EXCEEDED") {
                alertify.error("License limit got exceeded");
                return;
            } else if (data === "DOCTOR_LIMIT_EXCEEDED") {
                alertify.error("Doctor license limit got exceeded");
                return;
            } else if (data === "RECEPTIONIST_LIMIT_EXCEEDED") {
                alertify.error("Receptionist license limit got exceeded");
                return;
            } else {
                if ($scope.edit_status || $scope.editDoctorBasic) {
                    alertify.success("Users details updated successfully");
                } else if (deleteTempStatus) {
                    alertify.success("User deleted successfully");
                } else if ($scope.addHospitalDoc) {
                    alertify.success("Branch added successfully");
                } else if (!$scope.edit_status && !deleteTempStatus && !$scope.addHospitalDoc && !$scope.editDoctorBasic) {
                    alertify.success("User details added successfully");
                }
                if (step1FormSet !== undefined) {
                    step1FormSet.$setPristine(true);
                    step1FormSet.submited = false;
                    step1FormSet.$setUntouched();
                }
                if (step2FormSet !== undefined) {
                    step2FormSet.$setPristine(true);
                    step2FormSet.submited = false;
                    step2FormSet.$setUntouched();
                }
                $scope.edit_AddressID = undefined;
                $scope.selection.length = 0;
                deleteTempStatus = false;
                $scope.addHospitalDoc = false;
                $scope.editDoctorBasic = false;
                departments_status = false;
                $scope.newAddHospitalList.length = 0;
                $scope.consultationDetails.length = 0;
                $scope.DoctorDepartmentID = undefined;
                $scope.editPassword = false;
                $scope.addNewHospital = false;
                resetData();
                resetForms();
                $scope.init();
                $scope.eHnoteConfimrPassword.eHnoteConfimrPassword = "";
            }
        }
        function onAddUpdateDoctorError(err) {
            console.log(err);
        }
    };

    $scope.viewAssignaBranch = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "viewassignabranchpopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.closeAssignBranch = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };

    $scope.ViewAccessrights = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "VideAccessrightsorgroups.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.closeAccessrights = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }

    $scope.MainBranchSubSpecializationsArray = [];

    $scope.GetBranchSubSpecializations = function (SubOrganizationId, BranchId) {
        console.log(SubOrganizationId + "__" + BranchId);
        eHnoteMainAdminServices.getBranchSpecializationById(SubOrganizationId, BranchId).then(function (resp) {

            if (resp.data.row.length > 0) {
                $scope.MainBranchSubSpecializationsArray = resp.data.row;
            }
            console.log(resp.data);
        });
    };


    $scope.branchDoctorsList = [];
    $scope.doctorListing = [];
    $scope.getAllBranchUsers = function (subOrgid, BranchId) {

        $scope.doctorListing = [];
        eHnoteMainAppointmentService.getBranchUsersList(subOrgid, BranchId).then(function (resp) {
            console.log(resp);
            if (resp.data.rows.length > 0) {
                $scope.branchDoctorsList = resp.data.rows;
                console.log($scope.branchDoctorsList);

                angular.forEach($scope.branchDoctorsList, function (bitem) {

                    var object = {
                        "FullName": bitem.FirstName,
                        "FirstName": bitem.FirstName,
                        "LastName": bitem.LastName,
                        "DoctorID": bitem.UserId,
                        "Gender": bitem.Gender,
                        "UserBranchId": "",
                        "Active": bitem.ActiveInd,
                        "RoleID": "",
                        "RoleName": "",
                        "GroupID": "",
                        "GroupName": "",
                        "Mobile": bitem.Mobile,
                        "CountryCode": bitem.CountryCode,
                        "ContactNo": bitem.ContactNo,
                        "AreaCode": bitem.AreaCode,
                        "Landline": "",
                        "Email": bitem.Email,
                        "DoctorLoginID": bitem.Username,
                        "Password": bitem.Password,
                        "Experience": bitem.Experience,
                        "LoginStartDate": bitem.FirstName,
                        "LoginExpiryDate": bitem.FirstName,
                        "SpecializationId": bitem.SpecializationId,
                        "MinPerCase": "",
                        "TeleMinPerCase": "",
                        "MedRegNo": bitem.MedicalRegNo,
                        "DoctorAddress": bitem.UserAddress
                    }

                    $scope.currentBranchUser = [];
                    // $scope.currentBranchUser = $filter("filter")(bitem.UserBranchDetails, function (item, index) { return item.BranchId === BranchId; });
                    $scope.currentBranchUser = bitem;
                    //if ($scope.currentBranchUser.length > 0) {
                    //    //object.UserBranchId = $scope.currentBranchUser[0].UserBranchId;
                    //    //object.RoleID = $scope.currentBranchUser[0].RoleId;
                    //    //object.RoleName = $scope.currentBranchUser[0].RoleName;
                    //    //object.GroupID = $scope.currentBranchUser[0].GroupId;
                    //    //object.GroupName = $scope.currentBranchUser[0].GroupName;
                    //    //object.MinPerCase = $scope.currentBranchUser[0].AvgWalkInConsultationTime;
                    //    //object.TeleMinPerCase = $scope.currentBranchUser[0].AvgTeleConsultationTime;
                    //    //object.UserBranchDetails = $scope.currentBranchUser;

                    //} else {
                    //    object.UserBranchId = bitem.UserBranchDetails[0].UserBranchId;
                    //    object.RoleID = bitem.UserBranchDetails[0].RoleId;
                    //    object.RoleName = bitem.UserBranchDetails[0].RoleName;
                    //    object.GroupID = bitem.UserBranchDetails[0].GroupId;
                    //    object.GroupName = bitem.UserBranchDetails[0].GroupName;
                    //    object.MinPerCase = bitem.UserBranchDetails[0].AvgWalkInConsultationTime;
                    //    object.TeleMinPerCase = bitem.UserBranchDetails[0].AvgTeleConsultationTime;
                    //    object.UserBranchDetails.push(bitem.UserBranchDetails[0]);
                    //}
                    object.UserBranchId = bitem.UserBranchId;
                    object.RoleID = bitem.RoleId;
                    object.RoleName = bitem.RoleName;
                    object.GroupID = bitem.GroupId;
                    object.GroupName = bitem.GroupName;
                    object.MinPerCase = bitem.AvgWalkInConsultationTime;
                    object.TeleMinPerCase = bitem.AvgTeleConsultationTime;
                    //object.UserBranchDetails.push(bitem.UserBranchDetails[0]);
                    $scope.doctorListing.push(object);


                });

                $scope.getDoctorDetails($scope.doctorListing[0]);
            }
        });
    }


    $scope.changeBranch = function (clinic) {
        console.log(clinic)
        $scope.selectBranch = clinic;
        $scope.getAllBranchUsers(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.selectBranch.HospitalInfo.HospitalDetails.BranchId)
    };
    $scope.onBranchChange = function (parentOrgId, SubOrgId, BranchId) {
        $scope.getAllBranchUsers(SubOrgId, BranchId);
    }
    $scope.allBranchesArray = [];
    $scope.getAllBranchesBySubOrganizationId = function (subOrganizationId) {


        eHnoteMainAppointmentService.getAllBranchesBySubOrganizationId(subOrganizationId, onHospitalListSuccess, OnHospitalListFailed);
        function onHospitalListSuccess(data) {
            console.log(data);
            if (data.rows.length > 0) {
                $scope.allBranchesArray = data.rows;
                $scope.selectBranch = $scope.allBranchesArray[0];
                $scope.changeBranch($scope.selectBranch);
            } else {
                $scope.allBranchesArray = [];
            }
        }
        function OnHospitalListFailed(error) {
            console.log(error);
        }
    };

    $scope.subOrganizationGroupsArray = [];
    function getSubOrganizationGroups(SubOrganizationId) {
        // $scope.subOrganizationGroupsArray = [];
        //eHnoteMainAdminServices.getSubOrgGroupsById(SubOrganizationId).then(function (resp) {
        //    if (resp.data.rows.length > 0) {
        //        $scope.subOrganizationGroupsArray = resp.data.rows;
        //        $scope.rolesListing = resp.data.rows || [];
        //    }
        //    else {
        //        $scope.subOrganizationGroupsArray = [];
        //    }
        //});

        eHnoteMainAdminServices.getSubOrganizationGroupAccess(SubOrganizationId).then(function (resp) {
            console.log(resp.data);
            if (resp.data.rows.length > 0) {
                $scope.subOrganizationGroupsArray = resp.data.rows;
                $scope.rolesListing = resp.data.rows || [];
            } else {
                $scope.subOrganizationGroupsArray = [];
            }
        });




        console.log($scope.subOrganizationGroupsArray);

    }
    $scope.rolesList = [];
    $scope.listUserScreenRoles = [];
    $scope.getSubOrgRoles = function (SubOrganizationId) {
        eHnoteMainAdminServices.GetSubOrganizationsRolesbyId(SubOrganizationId).then(function (resp) {
            console.log(resp.data);
            if (resp.data.row.length > 0) {
                $scope.rolesList = resp.data.row;
                $scope.listUserScreenRoles = angular.copy(resp.data.row);
                var obj = {
                    "RoleId": 0,
                    "RoleName": "All Roles"
                };
                $scope.listUserScreenRoles.unshift(obj);

            } else {
                $scope.rolesList = [];
            }
        });

    };

    $scope.BranchSpecialitiesArray = [];

    $scope.mainBranchSpecilityDepartments = [];
    $scope.getBranchSpecialities = function (BranchId) {
        eHnoteMainAdminServices.getBranchSpecialitiesById(BranchId).then(function (resp) {
            console.log(resp.data);
            if (resp.data.row.length > 0) {
                $scope.BranchSpecialitiesArray = resp.data.row;
            }
        });
    };



    $scope.init = function () {
        $scope.getAllBranchesBySubOrganizationId(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
        $scope.getSubOrgRoles(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);

    };
    $scope.init();
    $scope.getMasterPayorList = function () {
        $scope.MasterBox14 = [];
        $scope.MasterBox15 = [];
        var param = {
            "SearchText": "",
            "Status": "Active",
            "PageSize": 1000,
            "PageNumber": 1,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": 0,
            "PayorId": 0,
            "PayorTypeId": 0
        };
        eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
            if (resp.data.rows.length > 0) {
                $scope.CopyMasterPayosTypesArray = angular.copy(resp.data.rows);
                if ($scope.CopyMasterPayosTypesArray.length > 0) {
                    let obj =
                    {
                        "SNO": 0,
                        "PayorId": 0,
                        "OrganizationPayorId": 0,
                        "PayorName": "Self Pay",
                        "PayorTypeId": 38,
                        "IsChecked": false,
                    }
                    $scope.CopyMasterPayosTypesArray.unshift(obj);

                }

                $scope.MasterPayosTypesArray = angular.copy($scope.CopyMasterPayosTypesArray);

                angular.forEach($scope.MasterPayosTypesArray, function (obj) {
                    obj.IsChecked = false;
                });
            }
        }, function (err) {
            alertify.error("Failed");
            console.log(err);
        });
    };

    $scope.changeUserBranch = function () {

        console.log($scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchId);
        $scope.hosUserCollection.UserAddress = [];
        var hospitalBasicInfo = {
            "UserBranchId": ($scope.edit_status) ? $scope.edit_AddressID : undefined,
            "Active": "Y",
            "ClinicName": $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchName,
            "StateId": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.StateId,
            "ExtDetails": {
                "HospitalID": $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchId,
                "PrimaryIND": "Y",
                "RoleID": $scope.role.RoleId,
                "GroupID": $scope.group.GroupId,
                "HospitalInfo": {
                    "HospitalID": $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchId,
                    "HospitalCode": "",
                    "BranchCode": $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchCode
                },
                "ConsultDetails": $scope.consultationDetails,
                "TeleConsultDetails": $scope.TeleSlotconsultationDetails,
            },
            "CountryId": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.CountryId,
            "Address1": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.Address1,
            "Address2": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.Address2,
            "AddressType": "B",
            "CityId": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.CityId,
            "Location": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.Location,
            "PinCode": $scope.addHospital.clinic.HospitalInfo.HospitalAddress.PinCode
        };
        if ($scope.addNewHospital) {
            hospitalBasicInfo.UserBranchId = 0;
        }
        else {
            hospitalBasicInfo.UserBranchId = ($scope.edit_status) ? $scope.edit_AddressID : undefined;
        }

        console.log(hospitalBasicInfo);
        $scope.hosUserCollection.UserAddress.push(hospitalBasicInfo);
        getSubOrganizationGroups(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
        console.log($scope.hosUserCollection.UserAddress);
        $scope.BranchSpecialitiesArray = [];
        $scope.MainBranchSubSpecializationsArray = [];
        $scope.getBranchSpecialities($scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchId);
        $scope.GetBranchSubSpecializations(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.addHospital.clinic.HospitalInfo.HospitalDetails.BranchId);
    };

    $scope.viewDoctorDetails = function (item) {

        console.log(item);


        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "ViewDoctorDetails.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "windowClass": "inventory-full-popup",
            "resolve": {
                items: function () {
                    return item;
                }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, items) {
                console.log(items);

                $scope.UserInfo = {
                    "UserBasicDetails": "",
                    "UserAdditionalInfo": "",
                    "UserBranches": [],
                    "UserRoles": [],
                    "UserTimeSlots": []
                };
                $scope.UserInfo.UserBasicDetails = items;


                $scope.closedoctordetails = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }

    function getNewUserSearchListObj() {
        var obj = {
            "SubOrganizationId": "",
            "BranchId": "",
            "BranchObj": "",
            "AllBranchInd": 1,
            "SpecializationId": "",
            "SpecializationObj": "",
            "AllSpecializationInd": 1,
            "UserSearchText": "",
            "PageSize": 10,
            "PageNumber": 1,
            "RoleId": 0,
            "RoleName": "",
            "StatusId": 2
        }
        return obj;
    }

    $scope.newUserSearchListObj = getNewUserSearchListObj();
    $scope.totalUsersCount = 0;


    $scope.allUsersArray = [];
    $scope.getAllUsers = function () {
        var obj = {
            "RoleId": $scope.newUserSearchListObj.RoleId||'',
        };
        eHnoteMasterDataService.addselectedAdminUserrole(obj);

        eHnoteMainAdminServices.getAllUsersBasicInfo($scope.newUserSearchListObj, ongetAllUsersSuccess, ongetAllUsersError);

        function ongetAllUsersSuccess(response) {
            console.log(response);
            $scope.allUsersArray = [];
            if (response.status === 'Success') {
                if (response.row.length > 0) {
                    $scope.allUsersArray = response.row;
                    console.log(response.Count);
                    $scope.allUsersArray = $filter("filter")($scope.allUsersArray, function (bitem, index) { return bitem.RoleId !== 60; });
                    angular.forEach($scope.allUsersArray, function (item) {
                        item.UserProfilePicUrl = item.UserProfilePicUrl || "";
                        item.AgeInYears = item.AgeInYears || "";
                        item.AgeInMonths = item.AgeInMonths || "";
                        item.AgeInDays = item.AgeInDays || "";
                        var obj = eHnoteUserDataService.UsMobileFormatChange(item.AreaCode + item.UserMobileNo);
                        item.MobileNumberFormate = obj.UsFormatMobileNumber;
                        item.IsUserDisabled = item.IsUserDisabled || false;
                        $scope.IsOTPAuthUser = item.IsOTPAuthUser;
                        $scope.SelectedUserId = item.UserId;

                        //if (item.IsOTPAuthUser && item.UserId===$scope.UserId) {
                        //    $scope.IsOTPAuthUser = true;
                        //}
                    });

                    $scope.totalUsersCount = response.Count;

                    angular.forEach($scope.allUsersArray, function (sitem) {
                        if (sitem.Active == "Y") {
                            sitem.UserActiveStatus = true;
                        } else {
                            sitem.UserActiveStatus = false;
                        }
                    });
                }
            }
        }
        function ongetAllUsersError(resp) {
            console.log(resp);
        }
    };

    $scope.UserBrancheMasterArray = [];
    $scope.newinit = function (Type) {
        $scope.BranchesListArray = [];

        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];

        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches(true, NewBranchList, doctorinfo) || [];
        $scope.newUserSearchListObj = getNewUserSearchListObj();
        $scope.selectedroleid = eHnoteMasterDataService.getSelectedAdminUserrole();
        if ($scope.selectedroleid != '') {
            $scope.newUserSearchListObj.RoleId = $scope.selectedroleid.RoleId || 0;
        } 
      

        console.log(doctorinfo);
        var EmptyClinicObj = {
            "ClinicName": "All Locations",
            "ClinicId": 0,
            "BranchName": "All Locations",
            "BranchId": 0,
            "SubOrganizationId": 0,
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
            "CountryCode": "+1",
            "mobilenum": "",
            "Active": "Y",
            "Doctors": [],
            "CommunicationCountryCode": "+1",
            "CommunicationMobileNo": ""
        };
        clinicAddress.unshift(EmptyClinicObj);
        $scope.BranchesListArray = clinicAddress;

        $scope.newUserSearchListObj.BranchObj = $scope.BranchesListArray[0];
        $scope.newUserSearchListObj.BranchId = $scope.BranchesListArray[0].BranchId;

        if ($scope.newUserSearchListObj.BranchId === 0) {
            if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.newUserSearchListObj.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }
        $scope.OrgSpecialitiesArray = [];
        if ($scope.newUserSearchListObj.BranchId === 0) {
            eHnoteMainAdminServices.getAllBranchSpecialitiesById($scope.newUserSearchListObj.SubOrganizationId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                    $scope.newUserSearchListObj.SpecializationObj = $scope.OrgSpecialitiesArray[0];
                    $scope.newUserSearchListObj.SpecializationId = $scope.OrgSpecialitiesArray[0].SpecializationId;
                }
            });
        } else {
            eHnoteMainAdminServices.getBranchSpecialitiesById($scope.newUserSearchListObj.BranchId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                    $scope.newUserSearchListObj.SpecializationObj = $scope.OrgSpecialitiesArray[0];
                    $scope.newUserSearchListObj.SpecializationId = $scope.OrgSpecialitiesArray[0].SpecializationId;
                }

            });
        }
        //console.log($scope.newUserSearchListObj);
        //$scope.getAllUsers();
        if (Type !== "" && Type === "DeActiveUser") {
            $scope.getAllDeActiveUsersList();
        } else {
            $scope.getAllUsers();
        }
    }

    $scope.changeUserListBranch = function (item) {
        console.log(item);
        $scope.newUserSearchListObj.BranchObj = item;
        $scope.newUserSearchListObj.BranchId = item.ClinicId;
        if ($scope.newUserSearchListObj.BranchId === 0) {
            $scope.newUserSearchListObj.AllBranchInd = 1;
        } else {
            $scope.newUserSearchListObj.AllBranchInd = 0;
        }
    };

    $scope.changeHospitalSpecialization = function (item) {
        console.log(item);
        $scope.newUserSearchListObj.SpecializationObj = item;
        $scope.newUserSearchListObj.SpecializationId = item.SpecializationId;

        if ($scope.newUserSearchListObj.SpecializationId === 0) {
            $scope.newUserSearchListObj.AllSpecializationInd = 1;
        } else {
            $scope.newUserSearchListObj.AllSpecializationInd = 0;
        }
    };



    $scope.newinit();





    $scope.allUsersPagechanged = function (pagenumber) {
        $scope.newUserSearchListObj.PageNumber = pagenumber;
        $scope.getAllUsers();
    };


    $scope.clearNewUserSearch = function () {
        $scope.newUserSearchListObj = getNewUserSearchListObj();
        var obj = {
            "RoleId": 0,
        };
        eHnoteMasterDataService.addselectedAdminUserrole(obj);
        $scope.newinit();
    };


    function getNewUserBasicInfoObject() {
        var obj = {
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
            "UserId": 0,
            "PrefixId": "",
            "Prefix": "",
            "FirstName": "",
            "LastName": "",
            "SuffixId": "",
            "Suffix":"",
            "Gender": "Male",
            "DOB": "",
            "Mobile": "",
            "ContactNo": "",
            "UserProfilePicUrl": "",
            "CountryCode": "91",
            "MainPhType": "M",
            "AreaCode": "",
            "Experience": "",
            "CommunicationMobile": "",
            //"CommunicationCountryCode": "91",
            "CommunicationPhType": "M",
            "CommunicationAreaCode": "",
            "CommunicationEmailId": "",
            "UserName": "",
            "CountryCode": "+1",
            "CommunicationCountryCode": "+1",
            "showResetPassword": true,
            "Password": "",
            "ConfirmPassword": "",
            "CreatedUserId": doctorinfo.doctorid,
            "SpecializationId": "",
            "UserWorkingBranches": [],
            "UserBranchRoles": [],
            "UserSpecialization": "",
            "UserDesignation": "",
            "NPI": "",
            "UPIN": "",
            "UserTaxId": "",
            "UserTaxonomyCode": "",
            "UserSSN": "",
            "UserFaxNumber": "",
            "MailingAddress": {
                "AddressId": 0,
                "AddressLine1": "",
                "AddressLine2": "",
                "CityId": "",
                "CityName": "",
                "StateId": "",
                "StateName": "",
                "CountryId": "",
                "CountyName": "",
                "ZipCode": "",
                "CountyId": "",
                "CountyName": "",
                "CountyCodeObj": ""

            },
            "PhysicalAddress": {
                "AddressId": 0,
                "AddressLine1": "",
                "AddressLine2": "",
                "CityId": "",
                "CityName": "",
                "StateId": "",
                "StateName": "",
                "CountryId": "",
                "CountyName": "",
                "ZipCode": "",
                "CountyId": "",
                "CountyName": "",
                "CountyCodeObj": ""


            },
            "AddressSameAsCopy": false,
            "SignatureOfUser": "",
            "EncryptedUserSign": "",
            "UserMobileNo": "",
            "UserCommunicationMobileNo": "",
            "AboutUser": "",
            "UserRoleId": "",
            "UserEmployerID": "",
            "AverageConsultationTime": "",
            "RestrictMultipleSlots": false,
            "UserSubSpecializations": [],
            "SignOffPassword": "",
            "SignOffPWDInd": false,
            "UserCommunicationMobileNumber": "",
            "UserMobileNumber": "",
            "IsUserDisabled": false,
            "IsTwoWayVarificationInd": false,
            "IsMFAEnabled": false,
            "IsTestUser": false,
        }
        return obj;
    }

    $scope.ChangeResetPassword = function (val) {
        if (val) {
            $scope.newUserBasicInfoObj.showResetPassword = false;
        } else {
            $scope.newUserBasicInfoObj.showResetPassword = true;
            $scope.newUserBasicInfoObj.ResetPassWord = true;
            $scope.newUserBasicInfoObj.Password = "";
            $scope.newUserBasicInfoObj.ConfirmPassword = "";
        }
    };

    $scope.newUserBasicInfoObj = getNewUserBasicInfoObject();
    $scope.adduseractiveMenu = 'basicInfo';
    $scope.RoomTypeList = [];
    $scope.switchUserTab = function (tab) {
        $scope.useractiveMenu = tab;
        $scope.showTimeSlot = false;
        $scope.checkobj.IsConnectedUsersAvailable = false;
        $scope.getSubOrgRoles(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
        if (tab == 'addupdateUser') {
            //$scope.clear();           
            $scope.adduseractiveMenu = 'basicInfo';
            $scope.TitlesList = [];
            $scope.SuffixList = [];
            $scope.UserBrancheMasterArray = [];
            $scope.newUserBasicInfoObj = getNewUserBasicInfoObject();
            $scope.validationObj = getUservalidationObj();
            eHnoteDbStaticDataService.GetAllTitlesByParentId(parentHospitalId).then(function (resp) {
                console.log(resp);
                $scope.TitlesList = resp.data;
                $scope.newUserBasicInfoObj.PrefixId = $scope.TitlesList[0].Id;
                $scope.newUserBasicInfoObj.UserName = "";
                $scope.newUserBasicInfoObj.Password = "";
            }, function (err) {
                console.log(err);
                alertify.error("Getting Titles Failed");
            });

            eHnoteDbStaticDataService.getMasterUserSuffixList().then(function (resp) {
                console.log(resp);
                $scope.SuffixList = resp.data.rows;
                //$scope.newUserBasicInfoObj.SuffixId = $scope.SuffixList[0].Id;
                $scope.DoctorSuffixList = $filter("filter")($scope.SuffixList, function (item) {
                    return item.Id === 10 || item.Id === 13;
                });
            }, function (err) {
                console.log(err);
                alertify.error("Getting Titles Failed");
            });

            angular.forEach($scope.BranchesListArray, function (item) {
                var obj = {
                    "BranchId": item.ClinicId,
                    "UserBranchId": 0,
                    "BranchName": item.ClinicName,
                    "ActiveInd": "N",
                    "DeleteInd": "Y"
                };
                if (item.ClinicId !== 0) {
                    $scope.UserBrancheMasterArray.push(obj);
                }

            });

            $scope.GetSpecializationsBySubOrgId(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
        }

        if (tab == 'userList') {
            $scope.newUserSearchListObj.UserSearchText = "";
            $scope.getAllUsers();
        }

        if (tab == 'deleteuserlist') {
            $scope.newUserSearchListObj = getNewUserSearchListObj();
            $scope.newinit("DeActiveUser");
            //$scope.getAllDeActiveUsersList();
        }

        $scope.Sign = newSignatureObj();
        $scope.SignatureOfUserBase64Code = "";
        $scope.tempTimeSlotsArray = [];
        $scope.newUserBranchTimeSlotObj = getTimeSlotObj();

        angular.forEach($scope.MainBranchSubSpecializationList, function (item) {
            item.isChecked = false;
        });
        if ($scope.UserSpecialitiesArray.length > 0) {
            $scope.MainBranchSubSpecializationList = [];
            angular.forEach($scope.UserSpecialitiesArray, function (item) {
                if (item.SpecializationId == 3) {
                    $scope.newUserBasicInfoObj.SpecializationId = item.SpecializationId;
                    $scope.changeUserSpecialtion(item.SpecializationId);
                }
            });
        }
        $scope.UserBrancheMasterArray = $scope.UserBrancheMasterArray || [];
        if ($scope.UserBrancheMasterArray.length === 1) {
            $scope.UserBrancheMasterArray[0].ActiveInd = "Y";
        }
    }

    $scope.MainUserObj = {
        "BasicInfo": "",
        "UserBranchTimeSlots": "",
        "UserBranchRolesnRights": [],
        "UserBranchSubSpecialities": []
    };


    $scope.UserBranchAccessRights = [];
    $scope.EmergencyUserAccessRights = [];
    $scope.UserBranchSubAccessCategories = [];
    $scope.UserBranchSubSpecialitiesArray = [];
    $scope.getUserBranchOtherDetails = function (UserId) {

        eHnoteMainAdminServices.getUserBranchParticularDtls(UserId).then(function (resp) {
            console.log(resp);
            $scope.UserBranchAccessRights = [];
            $scope.UserBranchSubAccessCategories = [];
            $scope.MainUserObj.UserBranchRolesnRights = [];
            if (resp.data.UserBranchDetails.length > 0) {
                $scope.MainUserObj.UserBranchRolesnRights = resp.data.UserBranchDetails;

            }
        });
    }

    $scope.editSubSpecialitites = function (maintiem) {


        $scope.MainBranchSubSpecializationsArray = [];
        $scope.SubSpecializationsList = [];

        eHnoteMainAdminServices.getBranchSpecializationById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, maintiem.BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.MainBranchSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.MainBranchSubSpecializationsArray, function (sitem) {
                    var object = {
                        "UserSubSpecializationId": 0,
                        "SubSpecializationId": sitem.SubSpecializationId,
                        "IsPrimarySubSpecialization": false,
                        "SubSpecializationName": sitem.SubSpecializationName,
                        "SpecializationId": sitem.SpecializationId,
                        "ActiveInd": "N",
                        "DeleteInd": "N"
                    };
                    $scope.SubSpecializationsList.push(object);
                });

                angular.forEach($scope.SubSpecializationsList, function (citem) {
                    angular.forEach(maintiem.Departments, function (mitem) {
                        if (citem.SubSpecializationId === mitem.SubSpecializationId) {
                            citem.ActiveInd = 'Y';
                            citem.UserSubSpecializationId = mitem.UserSubSpecializationId;
                            citem.IsPrimarySubSpecialization = mitem.IsPrimarySubSpecialization;
                        }
                    });
                });
                $scope.newUserBranchDepartmentObj = getnewUserBranchDepartmentsObj();


                var editBranch = $filter("filter")($scope.MainUserObj.BasicInfo.UserWorkingBranches, { "BranchId": maintiem.BranchId }, true);
                $scope.newUserBranchDepartmentObj.BranchObj = editBranch[0];
                $scope.newUserBranchDepartmentObj.BranchId = editBranch[0].BranchId;
                $scope.newUserBranchDepartmentObj.UserBranchId = editBranch[0].UserBranchId;
                $scope.newUserBranchDepartmentObj.BranchName = editBranch[0].BranchName;

                $scope.isAddSubSplDivEnabled = true;
            }
        });





    };

    $scope.AllUserBranchesList = [];


    function getNewUserBranchAccessRights() {
        var obj = {
            "BranchId": "",
            "BranchName": "",
            "BranchObj": "",
            "UserId": "",
            "PageSize": 10,
            "PageNumber": 1,
            "SubOrganizationId": doctorinfo.doctordata.UserAddress[0].SubOrganizationId
        };

        return obj;
    }

    $scope.newUserBranchAccessObj = getNewUserBranchAccessRights();

    $scope.ChangeRightsHospital = function (item) {

        console.log(item);
        $scope.newUserBranchAccessObj.BranchObj = item;
        $scope.newUserBranchAccessObj.BranchId = item.BranchId;
        $scope.newUserBranchAccessObj.PageSize = 10;
        $scope.newUserBranchAccessObj.PageNumber = 1;
        $scope.getUserBranchAccessRightsNew();
    };

    $scope.userBranchPagechanged = function (pageno) {
        $scope.newUserBranchAccessObj.PageNumber = pageno;
        $scope.getUserBranchAccessRightsNew();
    }

    $scope.switchaddUserTab = function (tab) {


        if ($scope.newUserBasicInfoObj.UserId === 0) {
            alertify.error("Please enter mandatory fields and save to Continue");
            return false;
        };
        $scope.adduseractiveMenu = tab;
        $scope.MainUserObj.BasicInfo = $scope.newUserBasicInfoObj;
        angular.forEach($scope.SuffixList, function (item) {
            if ($scope.newUserBasicInfoObj.SuffixId == item.Id) {
                $scope.newUserBasicInfoObj.Suffix = item.Name;
            }
        });

        var phoneNumberString = $scope.newUserBasicInfoObj.AreaCode + $scope.newUserBasicInfoObj.UserMobileNo;
        $scope.changeUserMobileNumber(phoneNumberString);
        var NumberString = $scope.newUserBasicInfoObj.CommunicationAreaCode + $scope.newUserBasicInfoObj.UserCommunicationMobileNo;
        $scope.changeUserCommunicationMobileNumber(NumberString);

        $scope.showAccessRightsList = true;
        if (tab == "rolesandAccessRights") {
            getSubOrganizationGroups(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);

            $scope.selectAllRightsStatus = true;
            //$scope.newUserBasicInfoObj.UserWorkingBranches
            $scope.AllUserBranchesList = [];
            $scope.AllUserBranchesList = angular.copy($scope.newUserBasicInfoObj.UserWorkingBranches);

            var allBranchObj = {
                "BranchId": 0,
                "BranchName": "All Locations"
            }

            $scope.AllUserBranchesList.unshift(allBranchObj);
            $scope.newUserBranchAccessObj = getNewUserBranchAccessRights();
            $scope.newUserBranchAccessObj.UserId = $scope.MainUserObj.BasicInfo.UserId;
            $scope.newUserBranchAccessObj.BranchObj = $scope.AllUserBranchesList[0];
            $scope.newUserBranchAccessObj.BranchId = 0;
            $scope.newUserBranchAccessObj.BranchName = "All Locations";
            $scope.getUserBranchAccessRightsNew();
        }
        if (tab == "EmergencyAccessRights") {
            getSubOrganizationGroups(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);

            $scope.selectEmergencyAllRightsStatus = true;
            //$scope.newUserBasicInfoObj.UserWorkingBranches
            $scope.AllUserBranchesList = [];
            $scope.AllUserBranchesList = angular.copy($scope.newUserBasicInfoObj.UserWorkingBranches);

            var allBranchObj = {
                "BranchId": 0,
                "BranchName": "All Locations"
            }
            $scope.showEmergencyAccessRightsList = true;
            $scope.AllUserBranchesList.unshift(allBranchObj);
            $scope.newUserBranchAccessObj = getNewUserBranchAccessRights();
            $scope.newUserBranchAccessObj.UserId = $scope.MainUserObj.BasicInfo.UserId;
            $scope.newUserBranchAccessObj.BranchObj = $scope.AllUserBranchesList[0];
            $scope.newUserBranchAccessObj.BranchId = 0;
            $scope.newUserBranchAccessObj.BranchName = "All Locations";
            $scope.getUserBranchAccessRightsNew();
            $scope.GetTimeSlotForEmergencyAccess();
            console.log($scope.TimeSlotStartValues);
            console.log($scope.TimeSlotEndValues);
            $scope.EmergencyUserAccessRights = angular.copy($scope.parentAccessRightsList);
        }
        if (tab == "subSpecialities") {

            $scope.getUserBranchOtherDetails($scope.MainUserObj.BasicInfo.UserId);
            $scope.MainBranchSubSpecializationsArray = [];
            $scope.SubSpecializationsList = [];
            $scope.isAddSubSplDivEnabled = false;
            eHnoteMainAdminServices.getBranchSpecializationById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, 0).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.MainBranchSubSpecializationsArray = resp.data.row;
                    angular.forEach($scope.MainBranchSubSpecializationsArray, function (sitem) {
                        var object = {
                            "UserSubSpecializationId": 0,
                            "SubSpecializationId": sitem.SubSpecializationId,
                            "IsPrimarySubSpecialization": false,
                            "SubSpecializationName": sitem.SubSpecializationName,
                            "SpecializationId": sitem.SpecializationId,
                            "ActiveInd": "N",
                            "DeleteInd": "N"
                        };
                        $scope.SubSpecializationsList.push(object);
                    });
                }
            });
        }

        if (tab == "timeSlots") {
            /*start*/
            $scope.UserSlotObj = getUserSlotObj();
            $scope.GetUserScheduledSlots();
            $scope.getMasterPayorList();

            /*End*/
            $scope.newUserTimeSlotObj = getuserBranchTimeSLotemptyObj();
            $scope.newUserTimeSlotAddReqObj = getnewUserbanchEntireTimeSLotObj();

            $scope.TimeSlots = getNewTimeSlotsEmptyObj();
            $scope.getSlotTimesList();
            $scope.getUserBranchOtherDetails($scope.MainUserObj.BasicInfo.UserId);
            $scope.showAddTimeSlotDev = true;

            var newdate = new Date();
            $scope.isCurrentPreviousMonth = true;
            var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');
            var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
            var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);
            $scope.selectedDate = firstDay;
            var startDate = firstDay;
            var EndDate = lastDay;
            var DateArray = [];
            var ExtraDaysCount = 0;
            var daynumber = new Date(firstDay).getDay();
            var currentMonthFirstDate = getMonthFirstDate(firstDay);
            DateArray = getDates(currentMonthFirstDate, EndDate);
            $scope.MainTimerArray = [];
            $scope.TimerWeekArray = [];
            $scope.selectedCurrentWeek = 1;
            console.log(newdate);
            formTimerArray(DateArray, newdate);
            $scope.startTimeHH.start = '00';
            $scope.endTimeHH.start = '';

            $scope.AdminScheduleObj = {
                "ShowNewAddSchedule": false,
                "IsShowEditSchedule": false,
                "SelectedScheduleIndex": null,
                "SelectedSchedule": ""
            };

        }
        $scope.OTPS = {
            "OTPUserName": "",
            "SearchText":"",
        }
        if (tab == "OTP") {
            var reqObj = {
                "BranchId": hospitalId,
                /* "SubSpecializationIdArray": subSplArray*/
            }
            eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
            function onGetUsersSuccess(resp) {
                if (resp.rows.length > 0) {
                    $scope.allUserList = resp.rows;
                }
            }
            function onGetUsersFailure(data) {
            }
            $scope.changeuser = function (item) {
                console.log("Selected User:", item);
                $scope.OTPS.OTPUserName = item.SecondUserFullName;
                $scope.SelectedEmail = item.Email;
                $scope.SelectedMobile = (item.CountryCode || '') + (item.AreaCode || '') + (item.UserMobileNo || '');
                //$scope.SelectedMobile = item.UserMobileNo;
               // $scope.SelectedMobile =(item.AreaCode || '') + (item.UserMobileNo || '');
                $scope.Selectedusername = item.SecondUserFullName;
                $scope.UserOTP = 0 ||"";
            };

            $scope.ClaerOTPuserdata = function () {
                $scope.Selectedusername = "";
                $scope.UserOTP = "";
                $scope.OTPS.OTPUserName = "";
                $scope.OTPS.SearchText = "";
                $scope.SelectedMobile = "",
                $scope.SelectedEmail=""
            }
            $scope.GetUserOTP = function () {
                var obj = {
                    "UserId": $scope.UserId,
                    "MobileNumber": $scope.SelectedMobile,
                    "EmailId": $scope.SelectedEmail
                }
                eHnoteMainAdminServices.GetLoginOTPbyUserId(obj).then(function (resp) {
                    if (resp.data.Status === "Success") {
                        $scope.UserOTP = resp.data.OTP;
                        if ($scope.UserOTP === 0) {
                            alertify.error("NO OTP found, Please check with another user");
                            $scope.Selectedusername = "";
                            $scope.OTPS.SelectedUserObj = item;
                        }
                    }
                });
            }
        }
        if (tab == "costing") {
            $scope.getUserBranchOtherDetails($scope.MainUserObj.BasicInfo.UserId);
        }

        if (tab == 'roomAllocation') {

            eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
                $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 7 });
            }, function (err) {
                console.log(err);
                alertify.error("Getting ClaimTypes Failed");
            });

            $scope.GetAllUsersAssignedRoomsList($scope.MainUserObj.BasicInfo.UserId);
        }

        if (tab == 'LeavesData') {

            $scope.getNewUserLeaveReqObj = getnewUserrleaveobj();
            $scope.getUserLeavereqObj = getnewLeaveObj();

            $scope.getUserLeavesList();
            
        }
    }

    $scope.file = null;

    function getUservalidationObj() {
        var obj = {
            "FirstName": false,
            "LastName": false,
            "Gender": false,
            "Experience": false,
            "Specialization": false,
            "Mobile": false,
            "ContactNo": false,
            "EmailId": false,
            "CommunicationMobile": false,
            "CommunicationEmailId": false,
            "UserName": false,
            "Password": false,
            "SamePassword": false,
            "ConfirmPassword": false,
            "DOB": false
        }
        return obj;
    };
    $scope.changeTitle = function (Titleid) {
        if (Titleid != null) {
            var filtertitle = $filter("filter")($scope.TitlesList, { "Id": Titleid }, true) || [];
            if (filtertitle.length > 0) {
                $scope.newUserBasicInfoObj.Title = filtertitle[0].Name;
                $scope.newUserBasicInfoObj.TitleId = filtertitle[0].Id;
            }

            if ($scope.newUserBasicInfoObj.Title === "Mr" || $scope.newUserBasicInfoObj.Title === "Master" || $scope.newUserBasicInfoObj.Title === "Baby Of" || $scope.newUserBasicInfoObj.Title === "Dr" || $scope.newUserBasicInfoObj.Title === "SMT.") {
                $scope.newUserBasicInfoObj.Gender = 'Male';
            }
            else if ($scope.newUserBasicInfoObj.Title === "Mrs" || $scope.newUserBasicInfoObj.Title === "Miss" || $scope.newUserBasicInfoObj.Title === 'Ms' || $scope.newUserBasicInfoObj.Title === "Baby") {
                $scope.newUserBasicInfoObj.Gender = 'Female';
            }
            else {
                $scope.newUserBasicInfoObj.Gender = "";
            }
        }
    }

    $scope.changeMaximumAppointments = function (item) {
        if (item.IsMaximumAppointmentsPerDay == false) {
            item.MaximumAppointmentsPerDay = null;
        }
    }

    $scope.changeMobileType = function (type) {
        if (type == 'M') {
            $scope.newUserBasicInfoObj.AreaCode = "";
            $scope.newUserBasicInfoObj.ContactNo = "";
        }
        if (type == 'L') {
            $scope.newUserBasicInfoObj.CountryCode = "";
            $scope.newUserBasicInfoObj.Mobile = "";
        }
    }

    $scope.validationObj = getUservalidationObj();
    $scope.saveUserBasicInfo = function (form, type, ResetID ) {


        console.log($scope.newUserBasicInfoObj);
        $scope.validationObj = getUservalidationObj();

        $scope.newUserBasicInfoObj.FirstName = $scope.newUserBasicInfoObj.FirstName || "";
        if ($scope.newUserBasicInfoObj.FirstName === "") {
            alertify.error("Please Enter First Name");
            $scope.validationObj.FirstName = true;
            return false;
        }
        $scope.newUserBasicInfoObj.LastName = $scope.newUserBasicInfoObj.LastName || "";
        if ($scope.newUserBasicInfoObj.LastName === "" || $scope.newUserBasicInfoObj.LastName === null || $scope.newUserBasicInfoObj.LastName === undefined) {
            alertify.error("Please Enter Last Name");
            $scope.validationObj.LastName = true;
            return false;
        }
        $scope.newUserBasicInfoObj.Gender = $scope.newUserBasicInfoObj.Gender || "";
        if ($scope.newUserBasicInfoObj.Gender === "") {
            alertify.error("Please Select Gender");
            $scope.validationObj.Gender = true;
            return false;
        }
        $scope.newUserBasicInfoObj.DOB = $scope.newUserBasicInfoObj.DOB || "";
        if ($scope.newUserBasicInfoObj.DOB === "") {
            alertify.error("Please Enter DOB");
            $scope.validationObj.DOB = true;
            return false;
        }

        //$scope.newUserBasicInfoObj.AreaCode = $scope.newUserBasicInfoObj.AreaCode || "";
        //if ($scope.newUserBasicInfoObj.AreaCode === "" || $scope.newUserBasicInfoObj.AreaCode.length != 3) {
        //    alertify.error("Please Enter Area Code");
        //    $scope.validationObj.Mobile = true;
        //    return false;
        //}
        //$scope.newUserBasicInfoObj.UserMobileNo = $scope.newUserBasicInfoObj.UserMobileNo || "";
        //if ($scope.newUserBasicInfoObj.UserMobileNo === "" || $scope.newUserBasicInfoObj.UserMobileNo.length != 7) {
        //    alertify.error("Please Enter Mobile Number");
        //    $scope.validationObj.Mobile = true;
        //    return false;
        //}
        //var Contactnumber = angular.copy($scope.newUserBasicInfoObj.UserMobileNumber) || "";
        //if ($scope.newUserBasicInfoObj.UserMobileNumber != '' || $scope.newUserBasicInfoObj.UserMobileNumber != '') {
        //    if ((Contactnumber.toString()).length < 14) {
        //        alertify.error("Please Enter Valid Mobile Number");
        //        return false;
        //    }
        //}

        var DisplayContact = angular.copy($scope.newUserBasicInfoObj.UserMobileNumber) || "";
        if ((DisplayContact.toString()).length < 14 || DisplayContact == "") {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter User Mobile Number");
            return false;
        }

        //$scope.newUserBasicInfoObj.CommunicationAreaCode = $scope.newUserBasicInfoObj.CommunicationAreaCode || "";
        //if ($scope.newUserBasicInfoObj.CommunicationAreaCode === "" || $scope.newUserBasicInfoObj.CommunicationAreaCode.length != 3) {
        //    alertify.error("Please Enter Communication Area Code");
        //    $scope.validationObj.CommunicationMobile = true;
        //    return false;
        //}
        //$scope.newUserBasicInfoObj.UserCommunicationMobileNo = $scope.newUserBasicInfoObj.UserCommunicationMobileNo || "";
        //if ($scope.newUserBasicInfoObj.UserCommunicationMobileNo === "" || $scope.newUserBasicInfoObj.UserCommunicationMobileNo.length != 7) {
        //    alertify.error("Please Enter Communication Mobile Number");
        //    $scope.validationObj.CommunicationMobile = true;
        //    return false;
        //}

        //var contactnumber = angular.copy($scope.newUserBasicInfoObj.UserCommunicationMobileNumber) || "";
        //if ($scope.newUserBasicInfoObj.UserCommunicationMobileNumber != '' || $scope.newUserBasicInfoObj.UserCommunicationMobileNumber != '') {
        //    if ((contactnumber.toString()).length < 14) {
        //        alertify.error("Please Enter Valid Communication Mobile Number");
        //        return false;
        //    }
        //}

        //var DisplayContactnumber = angular.copy($scope.newUserBasicInfoObj.UserCommunicationMobileNumber) || "";
        //if ((DisplayContactnumber.toString()).length < 14) {
        //    $scope.ValidateIndictor = true;
        //    alertify.error("Please Enter Valid Communication Mobile Number");
        //    return false;
        //}

        //var DisplayContactnumber = angular.copy($scope.newUserBasicInfoObj.UserCommunicationMobileNumber) || "";
        //if ($scope.newUserBasicInfoObj.UserCommunicationMobileNumber != '') {
        //    if ((DisplayContactnumber.toString()).length < 14) {
        //        alertify.error("Please Enter Valid Communication Mobile Number");
        //        return false;
        //    }
        //}

        //$scope.newUserBasicInfoObj.SpecializationId = $scope.newUserBasicInfoObj.SpecializationId || "";
        //if ($scope.newUserBasicInfoObj.SpecializationId === "") {
        //    alertify.error("Please Select any Specialization");
        //    $scope.validationObj.Specialization = true;
        //    return false;
        //}
        //$scope.newUserBasicInfoObj.Experience = $scope.newUserBasicInfoObj.Experience || "";
        //if ($scope.newUserBasicInfoObj.Experience === "" || $scope.newUserBasicInfoObj.Experience === null || $scope.newUserBasicInfoObj.Experience === undefined) {
        //    alertify.error("Please Enter Experience");
        //    $scope.validationObj.Experience = true;
        //    return false;
        //}
        //$scope.newUserBasicInfoObj.CommunicationEmailId = $scope.newUserBasicInfoObj.CommunicationEmailId || "";
        //if ($scope.newUserBasicInfoObj.CommunicationEmailId === "" || $scope.newUserBasicInfoObj.CommunicationEmailId === null || $scope.newUserBasicInfoObj.CommunicationEmailId === undefined) {
        //    alertify.error("Please Enter Communication Email Id");
        //    $scope.validationObj.CommunicationEmailId = true;
        //    return false;
        //}

        $scope.newUserBasicInfoObj.UserRoleId = $scope.newUserBasicInfoObj.UserRoleId || "";
        if ($scope.newUserBasicInfoObj.UserRoleId === "" || $scope.newUserBasicInfoObj.UserRoleId === null || $scope.newUserBasicInfoObj.UserRoleId === undefined) {
            alertify.error("Please Select User Role");
            return false;
        }

        if ($scope.newUserBasicInfoObj.UserRoleId === 1 || $scope.newUserBasicInfoObj.UserRoleId === 43) {
            $scope.newUserBasicInfoObj.SuffixId = $scope.newUserBasicInfoObj.SuffixId || "";
            if ($scope.newUserBasicInfoObj.SuffixId == "") {
                alertify.error("Please Select Suffix");
                return false;
            }
        }

        $scope.newUserBasicInfoObj.NPI = $scope.newUserBasicInfoObj.NPI || "";
        if ($scope.newUserBasicInfoObj.UserRoleId === 1 || $scope.newUserBasicInfoObj.UserRoleId === 43) {
            if ($scope.newUserBasicInfoObj.NPI == "") {
                alertify.error("Please Enter NPI");
                return false;
            }
            if ($scope.newUserBasicInfoObj.NPI.length < 10) {
                alertify.error("Please Enter Valid NPI");
                return false;
            }
        } else {
            if ($scope.newUserBasicInfoObj.NPI.length == 10) {

            } else {
                if ($scope.newUserBasicInfoObj.NPI.length == 0) {

                } else {
                    alertify.error("Please Enter Valid NPI");
                    return false;
                }
            }
        }

        //$scope.newUserBasicInfoObj.UserEmployerID = $scope.newUserBasicInfoObj.UserEmployerID || "";
        //if ($scope.newUserBasicInfoObj.UserEmployerID.length < 10) {
        //    alertify.error("Please Enter User Employee ID");
        //    return false;
        //}

        $scope.newUserBasicInfoObj.SpecializationId = $scope.newUserBasicInfoObj.SpecializationId || "";
        if ($scope.newUserBasicInfoObj.UserRoleId === 1 || $scope.newUserBasicInfoObj.UserRoleId === 43) {
            if ($scope.newUserBasicInfoObj.SpecializationId === "") {
                alertify.error("Please Select User Specialization");
                $scope.validationObj.Specialization = true;
                return false;
            }
        }

        var SubSpecializationcheckedArray = _.where($scope.MainBranchSubSpecializationList, { isChecked: true });
        if ($scope.newUserBasicInfoObj.UserRoleId === 1 || $scope.newUserBasicInfoObj.UserRoleId === 43) {
            if (SubSpecializationcheckedArray.length == 0) {
                angular.forEach($scope.MainBranchSubSpecializationList, function (item) {
                    if (item.SubSpecializationId === 6) {
                        item.isChecked = true;
                        item.IsPrimarySubSpecialization = true;
                    }
                });
            }
        }
        $scope.MainBranchSubSpecializationList = $scope.MainBranchSubSpecializationList || [];
        if ($scope.MainBranchSubSpecializationList.length > 0) {
            $scope.newUserBasicInfoObj.UserSubSpecializations = [];
            angular.forEach($scope.MainBranchSubSpecializationList, function (sitem) {
                if (sitem.isChecked == true) {
                    var obj = {
                        "UserSubSpecializationId": sitem.UserSubSpecializationId || 0,
                        /*"BranchSubSpecializationId": sitem.BranchSubSpecializationId,*/
                        "SubSpecializationId": sitem.SubSpecializationId,
                        "IsPrimarySubSpecialization": sitem.IsPrimarySubSpecialization,
                        "DeleteInd": sitem.DeleteInd || "N",
                    }
                    $scope.newUserBasicInfoObj.UserSubSpecializations.push(obj);
                }


            });

        }

        $scope.UserIsPrimarySubSpecialization = $filter("filter")($scope.newUserBasicInfoObj.UserSubSpecializations, function (subitem) {
            return (subitem.IsPrimarySubSpecialization === true);
        });

        if ($scope.newUserBasicInfoObj.UserRoleId === 1 || $scope.newUserBasicInfoObj.UserRoleId === 43) {
            if ($scope.UserIsPrimarySubSpecialization.length == 0) {
                alertify.error("Please Select Primary Sub Specialization");
                return false;
            };
        }


        //$scope.newUserBasicInfoObj.AreaCode = $scope.newUserBasicInfoObj.AreaCode || "";
        //if ($scope.newUserBasicInfoObj.AreaCode === "" || $scope.newUserBasicInfoObj.AreaCode.length != 3) {
        //    alertify.error("Please Enter Area Code");
        //    $scope.validationObj.Mobile = true;
        //    return false;
        //}
        //$scope.newUserBasicInfoObj.UserMobileNo = $scope.newUserBasicInfoObj.UserMobileNo || "";
        //if ($scope.newUserBasicInfoObj.UserMobileNo === "" || $scope.newUserBasicInfoObj.UserMobileNo.length != 7) {
        //    alertify.error("Please Enter Mobile Number");
        //    $scope.validationObj.Mobile = true;
        //    return false;
        //}
        //$scope.newUserBasicInfoObj.CommunicationAreaCode = $scope.newUserBasicInfoObj.CommunicationAreaCode || "";
        //if ($scope.newUserBasicInfoObj.CommunicationAreaCode === "" || $scope.newUserBasicInfoObj.CommunicationAreaCode.length != 3) {
        //    alertify.error("Please Enter Communication Area Code");
        //    $scope.validationObj.CommunicationMobile = true;
        //    return false;
        //}
        //$scope.newUserBasicInfoObj.UserCommunicationMobileNo = $scope.newUserBasicInfoObj.UserCommunicationMobileNo || "";
        //if ($scope.newUserBasicInfoObj.UserCommunicationMobileNo === "" || $scope.newUserBasicInfoObj.UserCommunicationMobileNo.length != 7) {
        //    alertify.error("Please Enter CommunicationMobile Number");
        //    $scope.validationObj.CommunicationMobile = true;
        //    return false;
        //}


        //$scope.newUserBasicInfoObj.CommunicationEmailId = $scope.newUserBasicInfoObj.CommunicationEmailId || "";
        //if ($scope.newUserBasicInfoObj.CommunicationEmailId === "" || $scope.newUserBasicInfoObj.CommunicationEmailId === null || $scope.newUserBasicInfoObj.CommunicationEmailId === undefined) {
        //    alertify.error("Please Enter CommunicationEmailId");
        //    $scope.validationObj.CommunicationEmailId = true;
        //    return false;
        //}
        $scope.newUserBasicInfoObj.UserName = $scope.newUserBasicInfoObj.UserName || "";
        if ($scope.newUserBasicInfoObj.UserName === "") {
            alertify.error("Please Enter User Name");
            $scope.validationObj.UserName = true;
            return false;
        }
        $scope.newUserBasicInfoObj.UserId = $scope.newUserBasicInfoObj.UserId || 0;
        if ($scope.newUserBasicInfoObj.UserId == 0 || $scope.newUserBasicInfoObj.showResetPassword == true) {
            $scope.newUserBasicInfoObj.Password = $scope.newUserBasicInfoObj.Password || "";
            if ($scope.newUserBasicInfoObj.Password === "") {
                alertify.error("Please Enter Valid Password");
                $scope.validationObj.Password = true;
                return false;
            }
            $scope.newUserBasicInfoObj.ConfirmPassword = $scope.newUserBasicInfoObj.ConfirmPassword || "";
            if ($scope.newUserBasicInfoObj.ConfirmPassword === "") {
                alertify.error("Please Enter Confirm Password");
                $scope.validationObj.ConfirmPassword = true;
                return false;
            }

            if ($scope.newUserBasicInfoObj.Password === $scope.newUserBasicInfoObj.ConfirmPassword) {
                $scope.validationObj.SamePassword = false;
            } else {
                alertify.error("Password Doesn't Match");
                $scope.validationObj.SamePassword = true;
                return false;
            }
        }

        if ($scope.newUserBasicInfoObj.SignOffPWDInd === true) {
            $scope.newUserBasicInfoObj.SignOffPassword = $scope.newUserBasicInfoObj.SignOffPassword || "";
            if ($scope.newUserBasicInfoObj.SignOffPassword == "") {
                alertify.error("Please Enter Valid SignOff Password");
                return false;
            }
        }

        var file = $scope.ProfilePic;
        var fd = new FormData();





        $scope.newUserBasicInfoObj.UserBranchesArray = [];


        $scope.newUserBasicInfoObj.UserBranchesArray = $filter("filter")($scope.UserBrancheMasterArray, function (Nitem) {
            return Nitem.ActiveInd === 'Y' || Nitem.ActiveInd === 'N' && Nitem.UserBranchId !== 0;
        });

        angular.forEach($scope.newUserBasicInfoObj.UserBranchesArray, function (titem) {
            if (titem.ActiveInd === 'N' && titem.UserBranchId !== 0) {
                titem.DeleteInd = "Y";
            }
        });


        if ($scope.newUserBasicInfoObj.UserBranchesArray.length === 0) {
            alertify.error("Please Select a Branch");
            return false;
        }

        $scope.UserBranchRolesMain = [];

        $scope.UserBranchRolesMain = $filter("filter")($scope.newUserBasicInfoObj.UserBranchRoles, function (Nitem) {
            return Nitem.RoleId === "";
        });

        //if ($scope.UserBranchRolesMain.length > 0) {
        //    alertify.error("Please Select a Role to Each Branch");
        //    return false;
        //};

        $scope.UserAvgconsultation = [];
        $scope.UserAvgconsultation = $filter("filter")($scope.newUserBasicInfoObj.UserBranchRoles, function (Mitem) {
            return (Mitem.RoleId === 1 || Mitem.RoleId === 43) && Mitem.WalkInAvgConslTime === "";
        });
        if ($scope.UserAvgconsultation.length > 0) {
            alertify.error("Please Select Avg Consultation Time");
            return false;
        };

        var RolesSuffixrestriction = [];
        $scope.newUserBasicInfoObj.SuffixId = $scope.newUserBasicInfoObj.SuffixId || 0;
        RolesSuffixrestriction = $filter("filter")($scope.newUserBasicInfoObj.UserBranchRoles, function (Nitem) {
            return (Nitem.RoleId === 1 || Nitem.RoleId === 4 || Nitem.RoleId === 43) && $scope.newUserBasicInfoObj.SuffixId == 0;
        });

        //if (RolesSuffixrestriction.length > 0) {
        //    alertify.error("Please Select Role Suffix");
        //    return false;
        //};

        console.log($scope.newUserBasicInfoObj.UserBranchRoles);
        angular.forEach($scope.newUserBasicInfoObj.UserBranchesArray, function (item) {
            angular.forEach($scope.newUserBasicInfoObj.UserBranchRoles, function (sitem) {
                if (item.BranchId === sitem.BranchId) {
                    item.RoleId = sitem.RoleId;
                    item.WalkInAvgConslTime = sitem.WalkInAvgConslTime;
                    item.TeleAvgConslTime = sitem.TeleAvgConslTime;
                    item.MultiSlotEnable = sitem.MultiSlotEnable;
                    item.IsMaximumAppointmentsPerDay = sitem.IsMaximumAppointmentsPerDay || false;
                    item.MaximumAppointmentsPerDay = sitem.MaximumAppointmentsPerDay || null;
                }
            });
        });




        $scope.newUserBasicInfoObj.UserSpecialization = $scope.newUserBasicInfoObj.UserSpecialization || "";
        $scope.newUserBasicInfoObj.UserDesignation = $scope.newUserBasicInfoObj.UserDesignation || "";
        $scope.newUserBasicInfoObj.NPI = $scope.newUserBasicInfoObj.NPI || "";
        $scope.newUserBasicInfoObj.ProviderId = $scope.newUserBasicInfoObj.ProviderId || "";

        if ($scope.Sign.SignatureOfUser !== "" && $scope.Sign.SignatureOfUser !== null) {
            $scope.newUserBasicInfoObj.SignatureOfUser = $scope.Sign.SignatureOfUser;

            if ($scope.Sign.SigantureId === 3) {
                $scope.newUserBasicInfoObj.EncryptedUserSign = $scope.Sign.EncryptedUserSign;
            }


        }

        /* fd.append("ParentOrganizationId", $scope.newUserBasicInfoObj.ParentOrganizationId);
         fd.append("CreatedUserId", $scope.newUserBasicInfoObj.CreatedUserId);
         fd.append("UserId", $scope.newUserBasicInfoObj.UserId);
         fd.append("FirstName", $scope.newUserBasicInfoObj.FirstName);
         fd.append("LastName", $scope.newUserBasicInfoObj.LastName);
         fd.append("PrefixId", $scope.newUserBasicInfoObj.PrefixId);
         fd.append("SuffixId", $scope.newUserBasicInfoObj.SuffixId || 0);
         fd.append("DOB", $filter("date")(new Date($scope.newUserBasicInfoObj.DOB), "yyyy-MM-dd HH:mm:ss"));
         fd.append("Gender", $scope.newUserBasicInfoObj.Gender);
         fd.append("Mobile", $scope.newUserBasicInfoObj.Mobile || 0);
         fd.append("ContactNo", $scope.newUserBasicInfoObj.ContactNo || 0);
         fd.append("CountryCode", $scope.newUserBasicInfoObj.CountryCode);
         fd.append("AreaCode", $scope.newUserBasicInfoObj.AreaCode);
         fd.append("EmailId", "");
         fd.append("CommunicationMobile", $scope.newUserBasicInfoObj.CommunicationMobile || 0);
         fd.append("CommunicationCountryCode", $scope.newUserBasicInfoObj.CommunicationCountryCode);
         fd.append("CommunicationAreaCode", $scope.newUserBasicInfoObj.CommunicationAreaCode);
         fd.append("CommunicationEmailId", $scope.newUserBasicInfoObj.CommunicationEmailId);
         fd.append('Experience', $scope.newUserBasicInfoObj.Experience);
         fd.append('UserName', $scope.newUserBasicInfoObj.UserName);
         fd.append('PassWord', $scope.newUserBasicInfoObj.Password);
         fd.append('ResetPassWord', $scope.newUserBasicInfoObj.showResetPassword);
         fd.append('SpecializationId', $scope.newUserBasicInfoObj.SpecializationId);
         fd.append('UserBranchesArray', JSON.stringify($scope.newUserBasicInfoObj.UserBranchesArray));
 
         fd.append('UserSpecialization', $scope.newUserBasicInfoObj.UserSpecialization);
         fd.append('UserDesignation', $scope.newUserBasicInfoObj.UserDesignation);
         fd.append('NPI', $scope.newUserBasicInfoObj.NPI);
         fd.append('ProviderId', $scope.newUserBasicInfoObj.ProviderId);
         
         angular.forEach(file, function (value, key) {
             fd.append(key, value);
         });*/



        $scope.newUserBasicInfoObj.MailingAddress.ZipCode = $scope.newUserBasicInfoObj.MailingAddress.ZipCode || "";
        $scope.newUserBasicInfoObj.PhysicalAddress.ZipCode = $scope.newUserBasicInfoObj.PhysicalAddress.ZipCode || "";
        $scope.newUserBasicInfoObj.SuffixId = $scope.newUserBasicInfoObj.SuffixId || 0;
        //$scope.newUserBasicInfoObj.ResetPassWord = $scope.newUserBasicInfoObj.showResetPassword || false;
        $scope.newUserBasicInfoObj.ContactNo = $scope.newUserBasicInfoObj.ContactNo == "" ? 0 : parseInt($scope.newUserBasicInfoObj.ContactNo);
        $scope.newUserBasicInfoObj.Mobile = $scope.newUserBasicInfoObj.Mobile == "" ? 0 : parseInt($scope.newUserBasicInfoObj.Mobile);
        $scope.newUserBasicInfoObj.CommunicationMobile = $scope.newUserBasicInfoObj.CommunicationMobile == "" ? 0 : parseInt($scope.newUserBasicInfoObj.CommunicationMobile);

        //console.log(JSON.stringify($scope.newUserBasicInfoObj));
        //return false;

        $scope.newUserBasicInfoObj.IsConnectedUsersAvailable = $scope.checkobj.IsConnectedUsersAvailable || false;

        //var checkedArraylist = _.where($scope.otherUsersArray, { isChecked: true });
        var checkedArraylist = [];

        angular.forEach($scope.otherUsersArray, function (kitem) {
            if (kitem.ConnectedUserId != 0 && !kitem.isChecked) {
                kitem.DeleteInd = 'Y';
                checkedArraylist.push(kitem);
            }
            if (kitem.ConnectedUserId === 0 && kitem.isChecked) {
                checkedArraylist.push(kitem);
            }
            if (kitem.ConnectedUserId != 0 && kitem.isChecked) {
                checkedArraylist.push(kitem);
            }
        });

        if (checkedArraylist.length > 0) {
            /*   var selectedArraylist = _.where($scope.otherUsersArray, { DeleteInd: 'N' });*/
            var selectedArraylist = _.where(checkedArraylist, { DeleteInd: 'N' });
            if (selectedArraylist.length === 0) {
                $scope.newUserBasicInfoObj.IsConnectedUsersAvailable = false;
            }
        }
        $scope.newUserBasicInfoObj.ConnectedUsers = checkedArraylist || [];

        if (ResetID == 1) {
            $scope.newUserBasicInfoObj.IsMFAEnabled = false;
        }

        eHnoteMainAdminServices.addUpdateUserBasicInfo($scope.newUserBasicInfoObj, $scope.ProfilePic, callbackfileuploadSuccess, callbackfileuploadError);
        function callbackfileuploadSuccess(resp) {

            console.log(resp);

            if (resp.status === "Success") {
                $scope.agreementFiles = [];
                $scope.ProfilePic = [];
                if ($scope.newUserBasicInfoObj.UserId === 0) {
                    alertify.success("User Added Successfully");
                } else {
                    alertify.success("User Updated Successfully");
                }

                console.log(type + "_type");
                if (type == 'Save') {
                    $scope.newUserBasicInfoObj = getNewUserBasicInfoObject();
                    $scope.switchUserTab('userList');
                } else {


                    $scope.TitlesList = [];
                    $scope.SuffixList = [];
                    $scope.UserBrancheMasterArray = [];
                    $scope.newUserBasicInfoObj = getNewUserBasicInfoObject();
                    $scope.validationObj = getUservalidationObj();



                    var item = resp.row[0];

                    eHnoteDbStaticDataService.GetAllTitlesByParentId(parentHospitalId).then(function (response) {
                        console.log(response);
                        $scope.TitlesList = response.data;
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Titles Failed");
                    });

                    eHnoteDbStaticDataService.getMasterUserSuffixList().then(function (resp2) {
                        console.log(resp2);
                        $scope.SuffixList = resp2.data.rows;

                        $scope.DoctorSuffixList = $filter("filter")($scope.SuffixList, function (item) {
                            return item.Id === 10 || item.Id === 13;
                        });
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Titles Failed");
                    });

                    angular.forEach($scope.BranchesListArray, function (item) {
                        var obj = {
                            "BranchId": item.ClinicId,
                            "UserBranchId": 0,
                            "BranchName": item.ClinicName,
                            "ActiveInd": "N",
                            "DeleteInd": "Y"
                        };
                        if (item.ClinicId !== 0) {
                            $scope.UserBrancheMasterArray.push(obj);
                        }

                    });

                    $scope.GetSpecializationsBySubOrgId(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
                    var userDob = "";
                    if (item.DOB) {
                        userDob = $filter('date')(new Date(item.DOB), "MM-dd-yyyy");
                    }

                    $scope.newUserBasicInfoObj.UserId = item.UserId;
                    $scope.newUserBasicInfoObj.FullName = item.FullName || "";
                    $scope.newUserBasicInfoObj.FirstName = item.FirstName;
                    $scope.newUserBasicInfoObj.LastName = item.LastName;
                    $scope.newUserBasicInfoObj.Gender = item.Gender;
                    $scope.newUserBasicInfoObj.IsTestUser = item.IsTestUser;
                    $scope.newUserBasicInfoObj.DOB = userDob;
                    $scope.newUserBasicInfoObj.Experience = item.Experience||"";
                    $scope.newUserBasicInfoObj.PrefixId = item.PrefixId;
                    $scope.newUserBasicInfoObj.Prefix = item.Prefix || "";
                    $scope.newUserBasicInfoObj.SuffixId = item.SuffixId;
                    $scope.newUserBasicInfoObj.Mobile = item.Mobile;
                    $scope.newUserBasicInfoObj.CountryCode = item.CountryCode;
                    $scope.newUserBasicInfoObj.AreaCode = item.AreaCode;
                    $scope.newUserBasicInfoObj.CommunicationMobile = item.CommunicationMobile;
                    $scope.newUserBasicInfoObj.CommunicationEmailId = item.CommunicationEmailId;
                    $scope.newUserBasicInfoObj.CommunicationCountryCode = item.CommunicationCountryCode;
                    $scope.newUserBasicInfoObj.UserName = item.UserName;
                    $scope.newUserBasicInfoObj.Password = item.Password;
                    $scope.newUserBasicInfoObj.ConfirmPassword = item.Password;
                    $scope.newUserBasicInfoObj.SpecializationId = item.SpecializationId;
                    $scope.newUserBasicInfoObj.showResetPassword = false;
                    $scope.newUserBasicInfoObj.UserProfilePicUrl = item.UserProfilePicUrl || "";
                    $scope.newUserBasicInfoObj.UserWorkingBranches = [];
                    $scope.newUserBasicInfoObj.UserBranchRoles = [];
                    $scope.newUserBasicInfoObj.UserSpecialization = item.UserSpecialization || "";
                    $scope.newUserBasicInfoObj.UserDesignation = item.UserDesignation || "";
                    $scope.newUserBasicInfoObj.NPI = item.NPI || "";
                    $scope.newUserBasicInfoObj.ProviderId = item.ProviderId || "";
                    $scope.newUserBasicInfoObj.UserTaxId = item.UserTaxId || "";
                    $scope.newUserBasicInfoObj.UserTaxonomyCode = item.UserTaxonomyCode || "";
                    $scope.newUserBasicInfoObj.UserSSN = item.UserSSN || "";
                    $scope.newUserBasicInfoObj.UserFaxNumber = item.UserFaxNumber || "";
                    $scope.newUserBasicInfoObj.ProviderId = item.ProviderId || "";
                    $scope.newUserBasicInfoObj.MailingAddress.AddressId = item.MailingAddress.AddressId || "";
                    $scope.newUserBasicInfoObj.MailingAddress.AddressLine1 = item.MailingAddress.AddressLine1 || "";
                    $scope.newUserBasicInfoObj.MailingAddress.AddressLine2 = item.MailingAddress.AddressLine2 || "";
                    $scope.newUserBasicInfoObj.MailingAddress.CityName = item.MailingAddress.CityName || "";
                    $scope.newUserBasicInfoObj.MailingAddress.CityId = item.MailingAddress.CityId;
                    $scope.newUserBasicInfoObj.MailingAddress.StateName = item.MailingAddress.StateName || "";
                    $scope.newUserBasicInfoObj.MailingAddress.StateId = item.MailingAddress.StateId;
                    $scope.newUserBasicInfoObj.MailingAddress.CountryName = item.MailingAddress.CountryName || "";
                    $scope.newUserBasicInfoObj.MailingAddress.CountryId = item.MailingAddress.CountryId;
                    $scope.newUserBasicInfoObj.MailingAddress.CountyName = item.MailingAddress.CountyName || "";
                    $scope.newUserBasicInfoObj.MailingAddress.CountyId = item.MailingAddress.CountyId;
                    $scope.newUserBasicInfoObj.MailingAddress.Zipcode = item.MailingAddress.Zipcode || "";
                    $scope.newUserBasicInfoObj.PhysicalAddress.AddressId = item.PhysicalAddress.AddressId || "";
                    $scope.newUserBasicInfoObj.PhysicalAddress.AddressLine1 = item.PhysicalAddress.AddressLine1 || "";
                    $scope.newUserBasicInfoObj.PhysicalAddress.AddressLine2 = item.PhysicalAddress.AddressLine2 || "";
                    $scope.newUserBasicInfoObj.PhysicalAddress.CityName = item.PhysicalAddress.CityName || "";
                    $scope.newUserBasicInfoObj.PhysicalAddress.CityId = item.PhysicalAddress.CityId;
                    $scope.newUserBasicInfoObj.PhysicalAddress.StateName = item.PhysicalAddress.StateName || "";
                    $scope.newUserBasicInfoObj.PhysicalAddress.StateId = item.PhysicalAddress.StateId;
                    $scope.newUserBasicInfoObj.PhysicalAddress.CountryName = item.PhysicalAddress.CountryName || "";
                    $scope.newUserBasicInfoObj.PhysicalAddress.CountryId = item.PhysicalAddress.CountryId;
                    $scope.newUserBasicInfoObj.PhysicalAddress.CountyName = item.PhysicalAddress.CountyName || "";
                    $scope.newUserBasicInfoObj.PhysicalAddress.CountyId = item.PhysicalAddress.CountyId;
                    $scope.newUserBasicInfoObj.PhysicalAddress.ZipCode = item.PhysicalAddress.ZipCode || "";

                    $scope.newUserBasicInfoObj.UserMobileNo = item.UserMobileNo;
                    $scope.newUserBasicInfoObj.CommunicationAreaCode = item.CommunicationAreaCode;
                    $scope.newUserBasicInfoObj.UserCommunicationMobileNo = item.UserCommunicationMobileNo;

                    $scope.newUserBasicInfoObj.AboutUser = item.AboutUser;
                    $scope.newUserBasicInfoObj.UserEmployerID = item.UserEmployerID||"";
                    $scope.newUserBasicInfoObj.UserRoleId = item.UserRoleId;

                    $scope.newUserBasicInfoObj.RestrictMultipleSlots = item.RestrictMultipleSlots;
                    $scope.newUserBasicInfoObj.SignOffPWDInd = item.SignOffPWDInd;
                    $scope.newUserBasicInfoObj.SignOffPassword = item.SignOffPassword;

                    item.AverageConsultationTime = item.AverageConsultationTime || 0;
                    $scope.newUserBasicInfoObj.AverageConsultationTime = item.AverageConsultationTime != 0 ? item.AverageConsultationTime.toString() : "",

                        angular.forEach(item.UserBranchesArray, function (sitem) {
                            angular.forEach($scope.UserBrancheMasterArray, function (citem) {
                                if (citem.BranchId === sitem.BranchId) {
                                    citem.UserBranchId = sitem.UserBranchId;
                                    citem.ActiveInd = 'Y';
                                    citem.DeleteInd = 'N';
                                    citem.RoleId = sitem.RoleId;
                                    citem.RoleName = sitem.RoleName;

                                    $scope.newUserBasicInfoObj.UserWorkingBranches.push(citem);
                                    var obj = {
                                        "BranchId": citem.BranchId,
                                        "BranchName": citem.BranchName,
                                        "UserBranchId": citem.UserBranchId,
                                        "RoleId": sitem.RoleId,
                                        "RoleName": sitem.RoleName,
                                        "RoleObj": "",
                                        "WalkInAvgConslTime": sitem.WalkInAvgConslTime ? sitem.WalkInAvgConslTime.toString() : "",
                                        "TeleAvgConslTime": sitem.TeleAvgConslTime ? sitem.TeleAvgConslTime.toString() : "",
                                        "MultiSlotEnable": sitem.MultiSlotEnable,
                                        "IsMaximumAppointmentsPerDay": sitem.IsMaximumAppointmentsPerDay || false,
                                        "MaximumAppointmentsPerDay": sitem.MaximumAppointmentsPerDay || null
                                    };
                                    $scope.newUserBasicInfoObj.UserBranchRoles.push(obj);
                                }
                            });
                        });


                    $scope.switchaddUserTab('rolesandAccessRights');
                }


                $scope.showTimeSlot = true;
                $scope.showcosting = true;
                //$scope.timeslotandcosting = resp.row[0].UserBranchesArray;
                //angular.forEach($scope.timeslotandcosting, function (nitem) {
                //    if (nitem.RoleId === 1 || nitem.RoleId === 43 || nitem.RoleId === 56 || nitem.RoleId === 57) {
                //        $scope.showTimeSlot = false;
                //        $scope.showcosting = false;
                //    }
                //});
                console.log(resp.row[0].UserRoleId + "_Roleid");
                if (resp.row[0].UserRoleId === 1 || resp.row[0].UserRoleId === 43 || resp.row[0].UserRoleId === 56 || resp.row[0].UserRoleId === 57 || resp.row[0].UserRoleId === 18) {
                    $scope.showTimeSlot = false;
                    $scope.showcosting = false;
                }

            } else if (resp.status === "Failure") {
                alertify.error(resp.Message);
            } else {
                alertify.error("Some Error Occured");
            }

        }
        function callbackfileuploadError(err) {
            alertify.error("Some Error Occured");
        }
    }

    $scope.checkUserPassword = function (obj) {

        if (obj.ConfirmPassword.length > 3) {
            $scope.validationObj.SamePassword = false;
            if (obj.Password === obj.ConfirmPassword) {
                $scope.validationObj.SamePassword = false;
            } else {
                $scope.validationObj.SamePassword = true;
            }
        }


    }

    //$scope.selectUserProfilePic = function ($files) {
    //    console.log($files);
    //    $scope.ProfilePic = [];
    //    if ($files.length > 0) {
    //        $scope.ProfilePic.push($files[0]);
    //    }      
    //};
    $scope.ProfilePic = [];
    $scope.selectUserProfilePic = function ($files) {
        if ($files.length > 0) {
            $scope.ProfilePic.push($files[0]);
        }
    };

    $scope.CopyUserMobile = function (isSameContactNo) {
        if (isSameContactNo) {
            $scope.newUserBasicInfoObj.CommunicationMobile = $scope.newUserBasicInfoObj.Mobile;
            //$scope.newUserBasicInfoObj.CommunicationCountryCode = $scope.newUserBasicInfoObj.CountryCode;
            //$scope.newUserBasicInfoObj.CommunicationCountryCode = $scope.newUserBasicInfoObj.CountryCode;
            $scope.newUserBasicInfoObj.CommunicationAreaCode = $scope.newUserBasicInfoObj.AreaCode;
            $scope.newUserBasicInfoObj.UserCommunicationMobileNo = $scope.newUserBasicInfoObj.UserMobileNo;
            $scope.newUserBasicInfoObj.UserCommunicationMobileNumber = $scope.newUserBasicInfoObj.UserMobileNumber;
        } else {
            $scope.newUserBasicInfoObj.CommunicationAreaCode = "";
            $scope.newUserBasicInfoObj.UserCommunicationMobileNo = "";
            $scope.newUserBasicInfoObj.UserCommunicationMobileNumber = ''
        }

    };
    $scope.navtoLeavesData = function (item) {
        $scope.newUserBasicInfoObj.UserId = item.UserId;
        $scope.getUserLeavereqObj.UserId = item.UserId;
        $scope.MainUserObj = $scope.MainUserObj || {};
        $scope.MainUserObj.BasicInfo = $scope.MainUserObj.BasicInfo || {}
        $scope.MainUserObj.BasicInfo.UserId = item.UserId;
        console.log($scope.getUserLeavereqObj);


        eHnoteMainAdminServices.GetUserLeavesListByYear($scope.getUserLeavereqObj).then(function (resp) {
            console.log(resp);

            $scope.UserLeavesArrayList = [];
            $scope.distinctYears = [];
            if (resp.data.status == "Success") {

                $scope.UserLeavesArrayList = resp.data.rows;



                if ($scope.UserLeavesArrayList.length > 0) {
                    angular.forEach($scope.UserLeavesArrayList, function (item) {
                        item.LeaveDate = $filter("date")(item.LeaveDate, "MM-dd-yyyy");
                        item.LeaveYear = new Date(item.LeaveDate).getFullYear();

                    });
                }

                $scope.filterLeavesMain($scope.selectedYear, $scope.Search.IsExpired);
                $scope.getNewUserLeaveReqObj.LeavesList = [];
                $scope.addLeaveObj.LeaveStartDate = "";
                $scope.addLeaveObj.LeaveEndDate = "";
                $scope.addLeaveObj.LeaveRemarks = "";



                angular.forEach($scope.UserLeavesArrayList, function (item) {
                    var year = new Date(item.LeaveDate).getFullYear();
                    if ($scope.distinctYears.indexOf(year) === -1) {

                        $scope.distinctYears.push(year);
                    }
                });
            }


        }, function (err) {
            alertify.success("Updating Failed");
        });
      
      
    }
    $scope.UserWorkingBranchArrays = [];
    $scope.LocationTypeObj = {
        "SelectLocationString": "All Locations",
        "Name": "",
        "AllLocationCheck": true
    };
   
    $scope.editParticularUser = function (item,tab) {

        tab = tab || '';
        if (!$scope.UserAccessRights.AllAccessRights.AdminAddUpdateUser) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }

        $scope.useractiveMenu = 'addupdateUser';
        $scope.adduseractiveMenu = 'basicInfo';
        if (tab != '') {
            $scope.adduseractiveMenu = tab||'basicInfo';
        }

        $scope.TitlesList = [];
        $scope.SuffixList = [];
        $scope.UserBrancheMasterArray = [];
        $scope.newUserBasicInfoObj = getNewUserBasicInfoObject();
        $scope.validationObj = getUservalidationObj();

        $scope.Sign = newSignatureObj();
        $scope.SignatureOfUserBase64Code = "";

        $scope.showTimeSlot = true;
        $scope.showcosting = true;
        //angular.forEach(item.UserBranchesArray, function (sitem) {
        //    if (sitem.RoleId === 1 || sitem.RoleId === 43 || sitem.RoleId === 56 || sitem.RoleId === 57) {
        //        $scope.showTimeSlot = false;
        //        $scope.showcosting = false;
        //    }
        //});
        if (item.RoleId === 1 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57 || item.RoleId === 18) {
            $scope.showTimeSlot = false;
            $scope.showcosting = false;
        }


        eHnoteDbStaticDataService.GetAllTitlesByParentId(parentHospitalId).then(function (resp) {
            console.log(resp);
            $scope.TitlesList = resp.data;
        }, function (err) {
            console.log(err);
            alertify.error("Getting Titles Failed");
        });

        eHnoteDbStaticDataService.getMasterUserSuffixList().then(function (resp) {
            console.log(resp);
            $scope.SuffixList = resp.data.rows;
            //$scope.newUserBasicInfoObj.SuffixId = $scope.SuffixList[0].Id;
            $scope.newUserBasicInfoObj.SuffixId = item.SuffixId;
            $scope.DoctorSuffixList = $filter("filter")($scope.SuffixList, function (item) {
                return item.Id === 10 || item.Id === 13;
            });
        }, function (err) {
            console.log(err);
            alertify.error("Getting Titles Failed");
        });

        angular.forEach($scope.BranchesListArray, function (item) {
            var obj = {
                "BranchId": item.ClinicId,
                "UserBranchId": 0,
                "BranchName": item.ClinicName,
                "ActiveInd": "N",
                "DeleteInd": "Y"
            };
            if (item.ClinicId !== 0) {
                $scope.UserBrancheMasterArray.push(obj);
            }

        });

        $scope.GetSpecializationsBySubOrgId(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);
        var userDob = "";
        if (item.DOB) {
            // userDob = $filter('date')(new Date(item.DOB), "dd-MMM-yyyy");
            userDob = $filter('date')(new Date(item.DOB), "MM-dd-yyyy");
        }

        $scope.newUserBasicInfoObj.UserId = item.UserId;
        $scope.newUserBasicInfoObj.FullName = item.FullName || "";
        $scope.newUserBasicInfoObj.FirstName = item.FirstName;
        $scope.newUserBasicInfoObj.LastName = item.LastName;
        $scope.newUserBasicInfoObj.Gender = item.Gender;
        $scope.newUserBasicInfoObj.IsTestUser = item.IsTestUser;
        $scope.newUserBasicInfoObj.DOB = userDob;
        $scope.newUserBasicInfoObj.Experience = item.Experience||"";
        $scope.newUserBasicInfoObj.PrefixId = item.PrefixId;
        $scope.newUserBasicInfoObj.Prefix = item.Prefix || "";
        $scope.newUserBasicInfoObj.SuffixId = item.SuffixId;
        $scope.newUserBasicInfoObj.Mobile = item.Mobile;
        $scope.newUserBasicInfoObj.CountryCode = item.CountryCode || "+1";
        $scope.newUserBasicInfoObj.AreaCode = item.AreaCode;
        $scope.newUserBasicInfoObj.CommunicationMobile = item.CommunicationMobile;
        $scope.newUserBasicInfoObj.CommunicationEmailId = item.CommunicationEmailId;
        $scope.newUserBasicInfoObj.CommunicationCountryCode = item.CommunicationCountryCode || "+1";
        $scope.newUserBasicInfoObj.UserName = item.UserName;
        $scope.newUserBasicInfoObj.Password = item.Password;
        $scope.newUserBasicInfoObj.ConfirmPassword = item.Password;
        $scope.newUserBasicInfoObj.SpecializationId = item.SpecializationId;
        $scope.newUserBasicInfoObj.showResetPassword = false;
        $scope.newUserBasicInfoObj.UserProfilePicUrl = item.UserProfilePicUrl || "";
        $scope.newUserBasicInfoObj.UserWorkingBranches = [];
        $scope.newUserBasicInfoObj.UserBranchRoles = [];

        $scope.newUserBasicInfoObj.UserRoleId = item.RoleId || 0;
        //$scope.newUserBasicInfoObj.UserRoleId = item.UserRoleId || 0;
        $scope.newUserBasicInfoObj.UserEmployerID = item.UserEmployeeId || "";
        $scope.newUserBasicInfoObj.AverageConsultationTime = item.AverageConsultationTime ? item.AverageConsultationTime.toString() : "",
            $scope.newUserBasicInfoObj.RestrictMultipleSlots = item.RestrictMultipleSlots || false;
        $scope.newUserBasicInfoObj.AboutUser = item.AboutUser || "";
        $scope.newUserBasicInfoObj.UserSpecialization = item.UserSpecialization || "";
        $scope.newUserBasicInfoObj.UserDesignation = item.UserDesignation || "";
        $scope.newUserBasicInfoObj.NPI = item.NPI || "";
        $scope.newUserBasicInfoObj.UPIN = item.UPIN || "";
        $scope.newUserBasicInfoObj.ProviderId = item.ProviderId || "";
        $scope.newUserBasicInfoObj.UserTaxId = item.UserTaxId || "";
        $scope.newUserBasicInfoObj.UserTaxonomyCode = item.UserTaxonomyCode || "";
        $scope.newUserBasicInfoObj.UserSSN = item.UserSSN || "";
        $scope.newUserBasicInfoObj.UserFaxNumber = item.UserFaxNumber || "";
        $scope.newUserBasicInfoObj.MailingAddress.AddressId = item.MailingAddress.AddressId || "";
        $scope.newUserBasicInfoObj.MailingAddress.AddressLine1 = item.MailingAddress.AddressLine1 || "";
        $scope.newUserBasicInfoObj.MailingAddress.AddressLine2 = item.MailingAddress.AddressLine2 || "";
        $scope.newUserBasicInfoObj.MailingAddress.CityName = item.MailingAddress.CityName || "";
        $scope.newUserBasicInfoObj.MailingAddress.CityId = item.MailingAddress.CityId;
        $scope.newUserBasicInfoObj.MailingAddress.StateName = item.MailingAddress.StateName || "";
        $scope.newUserBasicInfoObj.MailingAddress.StateId = item.MailingAddress.StateId;
        $scope.newUserBasicInfoObj.MailingAddress.CountryName = item.MailingAddress.CountryName || "";
        $scope.newUserBasicInfoObj.MailingAddress.CountryId = item.MailingAddress.CountryId;
        $scope.newUserBasicInfoObj.MailingAddress.CountyName = item.MailingAddress.CountyName || "";
        $scope.newUserBasicInfoObj.MailingAddress.CountyId = item.MailingAddress.CountyId || 0;
        $scope.newUserBasicInfoObj.MailingAddress.Zipcode = item.MailingAddress.Zipcode || "";
        $scope.newUserBasicInfoObj.PhysicalAddress.AddressId = item.PhysicalAddress.AddressId || "";
        $scope.newUserBasicInfoObj.PhysicalAddress.AddressLine1 = item.PhysicalAddress.AddressLine1 || "";
        $scope.newUserBasicInfoObj.PhysicalAddress.AddressLine2 = item.PhysicalAddress.AddressLine2 || "";
        $scope.newUserBasicInfoObj.PhysicalAddress.CityName = item.PhysicalAddress.CityName || "";
        $scope.newUserBasicInfoObj.PhysicalAddress.CityId = item.PhysicalAddress.CityId;
        $scope.newUserBasicInfoObj.PhysicalAddress.StateName = item.PhysicalAddress.StateName || "";
        $scope.newUserBasicInfoObj.PhysicalAddress.StateId = item.PhysicalAddress.StateId;
        $scope.newUserBasicInfoObj.PhysicalAddress.CountryName = item.PhysicalAddress.CountryName || "";
        $scope.newUserBasicInfoObj.PhysicalAddress.CountryId = item.PhysicalAddress.CountryId;
        $scope.newUserBasicInfoObj.PhysicalAddress.CountyName = item.PhysicalAddress.CountyName || "";
        $scope.newUserBasicInfoObj.PhysicalAddress.CountyId = item.PhysicalAddress.CountyId || 0;
        $scope.newUserBasicInfoObj.PhysicalAddress.ZipCode = item.PhysicalAddress.ZipCode || "";
        $scope.newUserBasicInfoObj.IsTwoWayVarificationInd = item.IsTwoWayVarificationInd || false;

        $scope.Sign.SignatureOfUser = item.SignatureOfUser;
        $scope.SignatureOfUserBase64Code = item.SignatureOfUser;

        $scope.newUserBasicInfoObj.SignOffPWDInd = item.SignOffPWDInd || false;
        $scope.newUserBasicInfoObj.SignOffPassword = item.SignOffPassword;

        $scope.newUserBasicInfoObj.UserMobileNo = item.UserMobileNo || "";
        $scope.newUserBasicInfoObj.UserCommunicationMobileNo = (item.CommunicationAreaCode + item.UserCommunicationMobileNo) || "";
        $scope.newUserBasicInfoObj.CommunicationAreaCode = item.CommunicationAreaCode || "";
        $scope.newUserBasicInfoObj.IsUserDisabled = item.IsUserDisabled || false;
        $scope.newUserBasicInfoObj.IsMFAEnabled = item.IsMFAEnabled;


        var phoneNumberString = $scope.newUserBasicInfoObj.AreaCode + $scope.newUserBasicInfoObj.UserMobileNo;
        $scope.changeUserMobileNumber(phoneNumberString);
        var NumberString = $scope.newUserBasicInfoObj.CommunicationAreaCode + $scope.newUserBasicInfoObj.UserCommunicationMobileNo;
        $scope.changeUserCommunicationMobileNumber(NumberString);
        $scope.UserEditBranchArrays = [];
        $scope.UserWorkingBranchArrays = [];
        if (item.UserBranchesArray.length > 0) {
            $scope.UserEditBranchArrays = item.UserBranchesArray;
            $scope.UserWorkingBranchArrays = item.UserBranchesArray || [];
            let obj = {
                BranchId: 0,
                BranchName: 'All Locations',
            }
            $scope.UserWorkingBranchArrays.unshift(obj);
            angular.forEach($scope.UserWorkingBranchArrays, function (mitem) {
                mitem.IsChecked = true;
            });

            $scope.LocationTypeObj.SelectLocationString = "All Locations";
        }

        $scope.changeUserSpecialtion(item.SpecializationId);
        $scope.selectedDoctors = "";
        if (item.UserSubSpecializationsArray.length > 0) {
            angular.forEach($scope.MainBranchSubSpecializationList, function (mainitem) {
                angular.forEach(item.UserSubSpecializationsArray, function (subitem) {
                    if (mainitem.SubSpecializationId == subitem.SubSpecializationId) {
                        mainitem.IsPrimarySubSpecialization = subitem.IsPrimarySubSpecialization || false;
                        mainitem.UserSubSpecializationId = subitem.UserSubSpecializationId || 0;
                        mainitem.isChecked = true;
                        if (mainitem.IsPrimarySubSpecialization == true) {
                            $scope.selectedDoctors = mainitem.SubSpecializationName || "";
                        }
                    }
                });
            });
        }





        angular.forEach(item.UserBranchesArray, function (sitem) {
            angular.forEach($scope.UserBrancheMasterArray, function (citem) {
                if (citem.BranchId === sitem.BranchId) {
                    citem.UserBranchId = sitem.UserBranchId;
                    citem.ActiveInd = 'Y';
                    citem.DeleteInd = 'N';
                    if (sitem.RoleId === 1 || sitem.RoleId === 4 || sitem.RoleId === 43 || sitem.RoleId === 56 || sitem.RoleId === 57) {
                        citem.FixedBranch = true;
                    } else {
                        citem.FixedBranch = false;
                    }
                    $scope.newUserBasicInfoObj.UserWorkingBranches.push(citem);
                    var obj = {
                        "BranchId": citem.BranchId,
                        "BranchName": citem.BranchName,
                        "UserBranchId": citem.UserBranchId,
                        "RoleId": sitem.RoleId,
                        "RoleName": sitem.RoleName,
                        "RoleObj": "",
                        "WalkInAvgConslTime": sitem.WalkInAvgConslTime ? sitem.WalkInAvgConslTime.toString() : "",
                        "TeleAvgConslTime": sitem.TeleAvgConslTime ? sitem.TeleAvgConslTime.toString() : "",
                        "MultiSlotEnable": sitem.MultiSlotEnable,
                        "IsMaximumAppointmentsPerDay": sitem.IsMaximumAppointmentsPerDay || false,
                        "MaximumAppointmentsPerDay": sitem.MaximumAppointmentsPerDay || null
                    };
                    $scope.newUserBasicInfoObj.UserBranchRoles.push(obj);
                }
            });
        });
        $scope.getUserEncryptedSIgnatureById(item.UserId);
        item.ConnectedUsers = item.ConnectedUsers || [];
        $scope.checkobj.IsConnectedUsersAvailable = item.IsConnectedUsersAvailable || false;
        if (item.ConnectedUsers.length > 0) {
            if ($scope.checkobj.IsConnectedUsersAvailable) {
                $scope.newConnectUserSearchListObj = getNewUserSearchListObj();
                $scope.newConnectUserSearchListObj.BranchId = $scope.newConnectUserSearchListObj.BranchId || 0;


                if ($scope.newConnectUserSearchListObj.BranchId === 0) {
                    if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                        $scope.newConnectUserSearchListObj.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                    }
                }
                $scope.newConnectUserSearchListObj.PageSize = 500;
                eHnoteMainAdminServices.getAllUsersBasicInfo($scope.newConnectUserSearchListObj, ongetAllUsersSuccess, ongetAllUsersError);

                function ongetAllUsersSuccess(response) {
                    $scope.allchildUsersArray = [];
                    if (response.status === 'Success') {
                        if (response.row.length > 0) {
                            $scope.allchildUsersArray = response.row;
                            $scope.otherUsersArray = [];
                            $scope.filterlist = $filter("filter")($scope.allchildUsersArray, function (ritem) {
                                return ritem.RoleId === 1 || ritem.RoleId === 43;
                            }) || [];

                            $scope.filterlist = $filter("filter")($scope.filterlist, function (subitem, index) {
                                return subitem.UserId != item.UserId;
                            });
                            if ($scope.filterlist.length > 0) {
                                angular.forEach($scope.filterlist, function (litem) {
                                    var obj = {
                                        "UserId": litem.UserId,
                                        "UserName": litem.UserName,
                                        "FullName": litem.FullName,
                                        "SecondUserFullName": litem.SecondUserFullName,
                                        "isChecked": false,
                                        "DeleteInd": 'N',
                                        "ConnectedUserId": 0
                                    }
                                    $scope.otherUsersArray.push(obj);
                                });
                                if ($scope.otherUsersArray.length > 0) {
                                    if (item.ConnectedUsers.length > 0) {
                                        if (item.ConnectedUsers.length > 0) {
                                            angular.forEach($scope.otherUsersArray, function (kitem) {
                                                angular.forEach(item.ConnectedUsers, function (mitem) {
                                                    if (mitem.ChildUserId === kitem.UserId) {
                                                        kitem.isChecked = true;
                                                        kitem.ConnectedUserId = mitem.ConnectedUserId;
                                                    }
                                                });
                                            });
                                        }
                                    }

                                }
                            }


                        }
                    }
                }
                function ongetAllUsersError(resp) {
                    console.log(resp);
                }

            }
        }
        else {
            $scope.checkobj.IsConnectedUsersAvailable = false;
            $scope.newConnectUserSearchListObj = getNewUserSearchListObj();
            $scope.newConnectUserSearchListObj.BranchId = $scope.newConnectUserSearchListObj.BranchId || 0;


            if ($scope.newConnectUserSearchListObj.BranchId === 0) {
                if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                    $scope.newConnectUserSearchListObj.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                }
            }
            $scope.newConnectUserSearchListObj.PageSize = 500;
            eHnoteMainAdminServices.getAllUsersBasicInfo($scope.newConnectUserSearchListObj, ongetAllUsersSuccess, ongetAllUsersError);

            function ongetAllUsersSuccess(response) {
                $scope.allchildUsersArray = [];
                if (response.status === 'Success') {
                    if (response.row.length > 0) {
                        $scope.allchildUsersArray = response.row;
                        $scope.otherUsersArray = [];
                        $scope.filterlist = $filter("filter")($scope.allchildUsersArray, function (hitem) {
                            return hitem.RoleId === 1 || hitem.RoleId === 43;
                        }) || [];

                        $scope.filterlist = $filter("filter")($scope.filterlist, function (subitem, index) {
                            return subitem.UserId != item.UserId;
                        });
                        if ($scope.filterlist.length > 0) {
                            angular.forEach($scope.filterlist, function (ritem) {
                                var obj = {
                                    "UserId": ritem.UserId,
                                    "UserName": ritem.UserName,
                                    "FullName": ritem.FullName,
                                    "SecondUserFullName": ritem.SecondUserFullName,
                                    "isChecked": false,
                                    "DeleteInd": 'N',
                                    "ConnectedUserId": 0
                                }
                                $scope.otherUsersArray.push(obj);
                            });
                        }


                    }
                }
            }
            function ongetAllUsersError(resp) {
                console.log(resp);
            }
            $scope.otherUsersArray = $scope.otherUsersArray || [];
            if ($scope.otherUsersArray.length > 0) {
                angular.forEach($scope.otherUsersArray, function (kitem) {
                    kitem.isChecked = false;
                });
            };
        }
        if (tab == 'LeavesData') {
            $scope.navtoLeavesData(item);
        }
    }


    function getnewUserBranchRoleObj() {
        var obj = {
            "UserBranchRoleId": 0,
            "UserBranchId": "",
            "BranchId": "",
            "BranchName": "",
            "BranchObj": "",
            "RoleId": "",
            "RoleName": "",
            "RoleObj": "",
            "GroupId": "",
            "GroupName": "",
            "GroupObj": "",
            "AccessRightsList": [],
            "DefaultTabId": "",
            "IsRightsForAllBranchInd": false
        };
        return obj;
    };

    function EmergencyAccessRightObj() {
        var obj = {
            "EmergencyAccessRightsDate": $filter('date')(new Date(), 'MM-dd-yyyy'),
            "EmergencyAccessRightsStratTime": "",
            "EmergencyAccessRightsEndTime": "",
            "EmergencyAccessRightsList": [],
            "EmergencyAccessRightsActiveInd": "",
        }
        return obj;
    }
    $scope.EmergencyAccessRightList = EmergencyAccessRightObj();
   // console.log($scope.EmergencyAccessRightList);
    $scope.newUserBranchRoleObj = getnewUserBranchRoleObj();
    function getnewUserBranchDepartmentsObj() {
        var obj = {
            "UserBranchRoleId": 0,
            "UserBranchId": "",
            "BranchId": "",
            "BranchName": "",
            "BranchObj": "",
            "DepartmentsList": []
        };
        return obj;
    };

    $scope.newUserBranchDepartmentObj = getnewUserBranchDepartmentsObj();




    $scope.updateBranchRolenRights = function (item) {


        $scope.newUserBranchRoleObj = getnewUserBranchRoleObj();

        $scope.AccessrightsList = angular.copy($scope.parentAccessRightsList);

        var filteresBranchArray = $filter("filter")($scope.UserBranchSubAccessCategories, { "UserBranchId": item.UserBranchId }, true);
        $scope.selectAllRightsStatus = true;


        var SubAccessList = [];
        SubAccessList = filteresBranchArray[0].SubAccessCategories;

        $scope.defaultTabArray = [];
        angular.forEach($scope.AccessrightsList, function (kitem) {
            kitem.isSubAccessCategorySelected = false;
            kitem.UserBranchSubAccessCategoryId = 0;
            angular.forEach(SubAccessList, function (fitem) {
                if (fitem.SubAccessCategoryId === kitem.SubAccessCategoryId) {
                    kitem.isSubAccessCategorySelected = true;
                }
            });
        });

        angular.forEach($scope.AccessrightsList, function (litem) {
            if (litem.isSubAccessCategorySelected) {
                angular.forEach(litem.AccessList, function (sitem) {
                    angular.forEach(item.AccessRights, function (mitem) {
                        if (sitem.AccessRightId === mitem.AccessRightId) {
                            sitem.ActiveInd = 'Y';
                            sitem.UserBranchAccessRightId = mitem.UserBranchAccessRightId;
                        }
                    });
                });
            }
        });

        angular.forEach($scope.AccessrightsList, function (atem) {
            var list = $filter("filter")(atem.AccessList, { "ActiveInd": 'N' }, true);
            if (list.length === 0) {
                atem.isAllCategoryItemsSelected = true;
            }
            var activelist = $filter("filter")(atem.AccessList, { "ActiveInd": 'Y' }, true);
            if (activelist.length > 0) {
                var filetredArray = $filter("filter")($scope.defaultTabArray, { "TabId": atem.MainAccessCategoryId }, true);
                if ($scope.defaultTabArray.length === 0 || filetredArray.length === 0) {
                    var obj = {
                        "TabId": atem.MainAccessCategoryId,
                        "TabName": atem.MainAccessCategoryName,
                        "SubTabId": atem.SubAccessCategoryId
                    }
                    $scope.defaultTabArray.push(obj)
                }
            }

        });



        $scope.mainDefaultTabArray = [];
        angular.forEach($scope.defaultTabArray, function (citem) {
            var obj = {
                "TabId": citem.TabId,
                "TabName": citem.TabName
            }
            var mainfilteredArray = $filter("filter")($scope.defaultTabArray, { "TabId": citem.TabId }, true);
            console.log(mainfilteredArray);
            if (mainfilteredArray.length <= 1) {
                $scope.mainDefaultTabArray.push(obj);
            }
        });
        if ($scope.newUserBasicInfoObj.UserRoleId === 18) {
            $scope.mainDefaultTabArray = $scope.mainDefaultTabArray.filter((x) => x.TabId !== 2);
        }

        $scope.newUserBranchRoleObj.DefaultTabId = item.DefaultTabId || "";


        var editBranch = $filter("filter")($scope.MainUserObj.BasicInfo.UserWorkingBranches, { "BranchId": item.BranchId }, true);

        if (editBranch.length > 0) {
            $scope.newUserBranchRoleObj.BranchObj = editBranch[0];
            $scope.newUserBranchRoleObj.BranchId = editBranch[0].BranchId;
            $scope.newUserBranchRoleObj.UserBranchId = editBranch[0].UserBranchId;
            $scope.newUserBranchRoleObj.BranchName = editBranch[0].BranchName;
            $scope.newUserBranchRoleObj.UserBranchRoleId = editBranch[0].UserBranchRoleId;
        }


        $scope.showAccessRightsList = false;


    };


    $scope.EmergencyUserAccessRights = angular.copy($scope.parentAccessRightsList);

    $scope.changeroleBranch = function (item, type) {

        if (type == 'AccessRights') {
            item.BranchId = item.BranchObj.BranchId;
            item.BranchName = item.BranchObj.BranchName;
            item.UserBranchId = item.BranchObj.UserBranchId;
            item.RoleName = item.BranchObj.RoleName;
            $scope.AccessrightsList = angular.copy($scope.parentAccessRightsList);

            //$scope.UserBranchAccessRights

            var filteresBranchArray = $filter("filter")($scope.UserBranchAccessRights, { "UserBranchId": item.UserBranchId }, true);

            if (filteresBranchArray.length > 0) {
                $scope.updateBranchRolenRights(filteresBranchArray[0]);
            }
        }
        if (type =='EmergencyAccessRights') {
            item.BranchId = item.BranchObj.BranchId;
            item.BranchName = item.BranchObj.BranchName;
            item.UserBranchId = item.BranchObj.UserBranchId;
            item.RoleName = item.BranchObj.RoleName;
            $scope.EmergencyUserAccessRights = angular.copy($scope.parentAccessRightsList);

            //$scope.UserBranchAccessRights

            var filteresBranchArray = $filter("filter")($scope.UserBranchAccessRights, { "UserBranchId": item.UserBranchId }, true);

            if (filteresBranchArray.length > 0) {
                $scope.updateEmergencyBranchRolenRights(filteresBranchArray[0]);
            }
        }

    };

    $scope.changeUserMainBranch = function (item) {



        if (item.ActiveInd === 'Y') {

            var obj = {
                "BranchId": item.BranchId,
                "BranchName": item.BranchName,
                "UserBranchId": item.UserBranchId,
                "RoleId": "",
                "RoleName": "",
                "RoleObj": "",
                "WalkInAvgConslTime": "",
                "TeleAvgConslTime": "",
                "MultiSlotEnable": true,//false
                "IsMaximumAppointmentsPerDay": false,
                "MaximumAppointmentsPerDay": null
            };
            $scope.newUserBasicInfoObj.UserBranchRoles.push(obj);

        } else {
            if (item.UserBranchId === 0) {
                angular.forEach($scope.newUserBasicInfoObj.UserBranchRoles, function (sitem, index) {
                    if (sitem.BranchId === item.BranchId) {
                        $scope.newUserBasicInfoObj.UserBranchRoles.splice(index, 1);
                    }
                });
            } else {
                //alertify.error("You Dont Have Permission,Contact Administrator");
                //item.ActiveInd = "N";
                //return false;
                angular.forEach($scope.newUserBasicInfoObj.UserBranchRoles, function (sitem, index) {
                    if (sitem.BranchId === item.BranchId) {
                        $scope.newUserBasicInfoObj.UserBranchRoles.splice(index, 1);
                    }
                });
            }

        }
    };

    $scope.selectAllRightsStatus = true;

    $scope.selectAllRights = function () {
        $scope.selectAllRightsStatus = false;
        $scope.defaultTabArray = [];
        angular.forEach($scope.AccessrightsList, function (item) {
            item.ActiveInd = 'Y';
            item.isAllCategoryItemsSelected = true;
            item.isSubAccessCategorySelected = true;
            angular.forEach(item.AccessList, function (subitem) {
                subitem.ActiveInd = 'Y';
            });

            var filetredArray = $filter("filter")($scope.defaultTabArray, { "TabId": item.MainAccessCategoryId }, true);
            if ($scope.defaultTabArray.length === 0 || filetredArray.length === 0) {
                var obj = {
                    "TabId": item.MainAccessCategoryId,
                    "TabName": item.MainAccessCategoryName,
                    "SubTabId": item.SubAccessCategoryId
                }
                $scope.defaultTabArray.push(obj)
            }
        });






        $scope.mainDefaultTabArray = [];
        angular.forEach($scope.defaultTabArray, function (citem) {
            var obj = {
                "TabId": citem.TabId,
                "TabName": citem.TabName
            }
            var mainfilteredArray = $filter("filter")($scope.defaultTabArray, { "TabId": citem.TabId }, true);
            console.log(mainfilteredArray);
            if (mainfilteredArray.length <= 1) {
                $scope.mainDefaultTabArray.push(obj);
            }
        });
    };

    $scope.deselectAllRights = function () {
        $scope.selectAllRightsStatus = true;

        angular.forEach($scope.AccessrightsList, function (item) {
            item.ActiveInd = 'N';
            item.isAllCategoryItemsSelected = false;
            item.isSubAccessCategorySelected = false;
            angular.forEach(item.AccessList, function (subitem) {
                subitem.ActiveInd = 'N';
            });
        });

        $scope.mainDefaultTabArray = [];

    };

    $scope.changeSubCategoryAccess = function (item) {
        item.ActiveInd = item.isSubAccessCategorySelected ? "Y" : "N";

        if (!item.isSubAccessCategorySelected) {
            item.isAllCategoryItemsSelected = false;
            angular.forEach(item.AccessList, function (iterator, index) {
                iterator.ActiveInd = "N";
            });
        }


        if (item.isAllCategoryItemsSelected) {
            var filetredArray = $filter("filter")($scope.defaultTabArray, { "TabId": item.MainAccessCategoryId }, true);
            if ($scope.defaultTabArray.length === 0 || filetredArray.length === 0) {
                var obj = {
                    "TabId": item.MainAccessCategoryId,
                    "TabName": item.MainAccessCategoryName,
                    "SubTabId": item.SubAccessCategoryId
                }
                $scope.defaultTabArray.push(obj)
            }
        } else {
            angular.forEach($scope.defaultTabArray, function (bitem, index) {
                if (bitem.TabId === item.MainAccessCategoryId && bitem.SubTabId === item.SubAccessCategoryId) {
                    $scope.defaultTabArray.splice(index, 1);
                }
            });
        }

        $scope.mainDefaultTabArray = [];
        angular.forEach($scope.defaultTabArray, function (citem) {
            var obj = {
                "TabId": citem.TabId,
                "TabName": citem.TabName
            }
            var mainfilteredArray = $filter("filter")($scope.defaultTabArray, { "TabId": citem.TabId }, true);
            console.log(mainfilteredArray);
            if (mainfilteredArray.length <= 1) {
                $scope.mainDefaultTabArray.push(obj);
            }
        });

    };

    $scope.CheckAllCatergoryItems = function (item) {
        item.ActiveInd = item.isAllCategoryItemsSelected ? "Y" : "N";
        angular.forEach(item.AccessList, function (iterator, index) {
            iterator.ActiveInd = item.ActiveInd;
        });

        var CheckedAccessData = $filter("filter")(item.AccessList, { "ActiveInd": "Y" }) || [];
        if (CheckedAccessData.length > 0) {
            item.isSubAccessCategorySelected = true;
        } else {
            item.isSubAccessCategorySelected = false;
        }

        if (item.isAllCategoryItemsSelected) {
            var filetredArray = $filter("filter")($scope.defaultTabArray, { "TabId": item.MainAccessCategoryId }, true);
            if ($scope.defaultTabArray.length === 0 || filetredArray.length === 0) {
                var obj = {
                    "TabId": item.MainAccessCategoryId,
                    "TabName": item.MainAccessCategoryName,
                    "SubTabId": item.SubAccessCategoryId
                }
                $scope.defaultTabArray.push(obj)
            }
        } else {
            angular.forEach($scope.defaultTabArray, function (bitem, index) {
                if (bitem.TabId === item.MainAccessCategoryId && bitem.SubTabId === item.SubAccessCategoryId) {
                    $scope.defaultTabArray.splice(index, 1);
                }
            });
        }

        $scope.mainDefaultTabArray = [];
        angular.forEach($scope.defaultTabArray, function (citem) {
            var obj = {
                "TabId": citem.TabId,
                "TabName": citem.TabName
            }
            var mainfilteredArray = $filter("filter")($scope.defaultTabArray, { "TabId": citem.TabId }, true);
            console.log(mainfilteredArray);
            if (mainfilteredArray.length <= 1) {
                $scope.mainDefaultTabArray.push(obj);
            }
        });

    };

    $scope.resetRoleItems = function () {
        $scope.newUserBranchRoleObj = getnewUserBranchRoleObj();
        $scope.AccessrightsList = [];
        $scope.selectAllRightsStatus = true;
        $scope.selectEmergencyAllRightsStatus = true;
        $scope.AccessrightsList = angular.copy($scope.parentAccessRightsList);

    };

    $scope.CheckIndividualItem = function (subitem, item) {
        var CheckedAccessListArray = $filter("filter")(item.AccessList, { "ActiveInd": "N" }) || [];
        if (CheckedAccessListArray.length === 0) {
            item.isAllCategoryItemsSelected = true;
        } else {
            item.isAllCategoryItemsSelected = false;
        }

        var CheckedAccessListData = $filter("filter")(item.AccessList, { "ActiveInd": "Y" }) || [];
        if (CheckedAccessListData.length > 0) {
            item.isSubAccessCategorySelected = true;
        } else {
            item.isSubAccessCategorySelected = false;
        }

        var filetredArray = $filter("filter")($scope.defaultTabArray, { "TabId": item.MainAccessCategoryId }, true);

        if ($scope.defaultTabArray.length === 0 || filetredArray.length === 0) {
            var obj = {
                "TabId": item.MainAccessCategoryId,
                "TabName": item.MainAccessCategoryName,
                "SubTabId": item.SubAccessCategoryId
            }
            $scope.defaultTabArray.push(obj)
        }
        var ActiveAccessListArray = $filter("filter")(item.AccessList, { "ActiveInd": "Y" }) || [];
        if (ActiveAccessListArray.length === 0) {
            angular.forEach($scope.defaultTabArray, function (bitem, index) {
                if (bitem.TabId === item.MainAccessCategoryId && bitem.SubTabId === item.SubAccessCategoryId) {
                    $scope.defaultTabArray.splice(index, 1);
                }
            });
        }


        $scope.mainDefaultTabArray = [];
        angular.forEach($scope.defaultTabArray, function (citem) {
            var obj = {
                "TabId": citem.TabId,
                "TabName": citem.TabName
            }
            var mainfilteredArray = $filter("filter")($scope.defaultTabArray, { "TabId": citem.TabId }, true);
            console.log(mainfilteredArray);
            if (mainfilteredArray.length <= 1) {
                $scope.mainDefaultTabArray.push(obj);
            }
        });


    };


    $scope.defaultTabArray = [];
    //$scope.defaultTabArray = [
    //    {
    //        "TabId": 1,
    //        "TabName": "Dashboard"
    //    },
    //    {
    //        "TabId": 2,
    //        "TabName": "OP"
    //    }
    //]

    $scope.changeroleBranchRole = function (item) {
        item.RoleId = item.RoleObj.RoleId;
        item.RoleName = item.RoleObj.RoleName;
        item.GroupId = "";
        item.GroupName = "";
        item.GroupObj = "";
        $scope.RoleGroupList = [];
        $scope.RoleGroupList = $filter("filter")($scope.rolesListing, function (bitem, index) { return bitem.RoleID === item.RoleId; });
    };


    $scope.changeroleBranchGroup = function (item) {
        item.GroupId = item.GroupObj.GroupId;
        item.GroupName = item.GroupObj.GroupName;
        $scope.AccessrightsList = [];
        $scope.AccessrightsList = angular.copy($scope.parentAccessRightsList);

        eHnoteMainAdminServices.getParentSubOrgGroupAccessRightsbyId(item.GroupId, 0, doctorinfo.doctordata.UserAddress[0].SubOrganizationId).then(function (resp) {
            console.log(JSON.stringify(resp));
            if (resp.data.status === 'Success') {
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
                $scope.defaultTabArray = [];
                angular.forEach($scope.AccessrightsList, function (item) {
                    item.isAllCategoryItemsSelected = false;
                    item.isSubAccessCategorySelected = false;
                    var list = $filter("filter")(item.AccessList, { "ActiveInd": 'N' }, true);
                    if (list.length === 0) {
                        item.isAllCategoryItemsSelected = true;
                    }

                    var activelist = $filter("filter")(item.AccessList, { "ActiveInd": 'Y' }, true);
                    if (activelist.length > 0) {
                        item.isSubAccessCategorySelected = true;
                    }
                    var filetredArray = $filter("filter")($scope.defaultTabArray, { "TabId": item.MainAccessCategoryId }, true);

                    if ($scope.defaultTabArray.length === 0 || filetredArray.length === 0) {

                        var obj = {
                            "TabId": item.MainAccessCategoryId,
                            "TabName": item.MainAccessCategoryName,
                            "SubTabId": item.SubAccessCategoryId
                        }
                        $scope.defaultTabArray.push(obj)
                    }





                });


                $scope.mainDefaultTabArray = [];
                angular.forEach($scope.defaultTabArray, function (citem) {
                    var obj = {
                        "TabId": citem.TabId,
                        "TabName": citem.TabName
                    }
                    var mainfilteredArray = $filter("filter")($scope.defaultTabArray, { "TabId": citem.TabId }, true);
                    console.log(mainfilteredArray);
                    if (mainfilteredArray.length <= 1) {
                        $scope.mainDefaultTabArray.push(obj);
                    }
                });
                if ($scope.newUserBasicInfoObj.UserRoleId === 18) {
                    $scope.mainDefaultTabArray = $scope.mainDefaultTabArray.filter((x) => x.TabId !== 2);
                }
            }
        });


    };





    function getnewUserBranchSpecializationObj() {
        var obj = {
            "UserBranchSpecializationId": 0,
            "UserBranchId": "",
            "BranchId": "",
            "BranchName": "",
            "BranchObj": "",
            "BranchSpecializationId": "",
            "SpecializationId": "",
            "SpecializationName": "",
            "SpecializationObj": "",
            "SubSpecializationId": "",
            "SubSpecializationName": "",
            "SubSpecializationObj": ""
        };
        return obj;
    }

    $scope.newUserBranchSpecializationObj = getnewUserBranchSpecializationObj();

    $scope.changeSpecializationBranch = function (item) {
        console.log(item);
        item.BranchId = item.BranchObj.BranchId;
        item.BranchName = item.BranchObj.BranchName;
        item.UserBranchId = item.BranchObj.UserBranchId;
        $scope.SubSpecializationsList = [];


        $scope.MainBranchSubSpecializationsArray = [];
        $scope.SubSpecializationsList = [];

        eHnoteMainAdminServices.getBranchSpecializationById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, item.BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.MainBranchSubSpecializationsArray = resp.data.row;



                $scope.filteredArray = $filter("filter")($scope.MainBranchSubSpecializationsArray, function (item, index) { return item.SpecializationId === $scope.MainUserObj.BasicInfo.SpecializationId; });
                if ($scope.filteredArray.length > 0) {
                    angular.forEach($scope.filteredArray, function (sitem) {
                        var object = {
                            "UserSubSpecializationId": 0,
                            "SubSpecializationId": sitem.SubSpecializationId,
                            "SubSpecializationName": sitem.SubSpecializationName,
                            "SpecializationId": sitem.SpecializationId,
                            "IsPrimarySubSpecialization": false,
                            "ActiveInd": "N",
                            "DeleteInd": "N"
                        };
                        $scope.SubSpecializationsList.push(object);
                    });
                } else {
                    angular.forEach($scope.MainBranchSubSpecializationsArray, function (sitem) {
                        var object = {
                            "UserSubSpecializationId": 0,
                            "IsPrimarySubSpecialization": false,
                            "SubSpecializationId": sitem.SubSpecializationId,
                            "SubSpecializationName": sitem.SubSpecializationName,
                            "SpecializationId": sitem.SpecializationId,
                            "ActiveInd": "N",
                            "DeleteInd": "N"
                        };
                        $scope.SubSpecializationsList.push(object);
                    });
                }




                $scope.filteredBranchArray = $filter("filter")($scope.MainUserObj.UserBranchRolesnRights, function (sitem, index) { return sitem.UserBranchId === item.UserBranchId; });

                if ($scope.filteredBranchArray.length > 0) {
                    angular.forEach($scope.SubSpecializationsList, function (citem) {
                        citem.ActiveInd = 'N';
                        angular.forEach($scope.filteredBranchArray[0].Departments, function (mitem) {
                            if (citem.SubSpecializationId === mitem.SubSpecializationId) {
                                citem.ActiveInd = 'Y';
                                citem.UserSubSpecializationId = mitem.UserSubSpecializationId;
                                citem.IsPrimarySubSpecialization = mitem.IsPrimarySubSpecialization;
                            }
                        });
                    });
                }

            }
        });



    };

    $scope.changeCostingBranch = function (item) {

        item.BranchId = item.BranchObj.BranchId;
        item.BranchName = item.BranchObj.BranchName;
        item.UserBranchId = item.BranchObj.UserBranchId;


        angular.forEach($scope.MainUserObj.UserBranchRolesnRights, function (sitem) {
            if (sitem.UserBranchId === item.UserBranchId) {
                //$scope.newUserBranchCostingObj.WalkInConsultationFeeObj.ConsultationFee = sitem.WalkInConsultationFeeObj[0].ConsultationFee;
                //$scope.newUserBranchCostingObj.WalkInConsultationFeeObj.FreeFollowUpsValidity = sitem.WalkInConsultationFeeObj[0].FreeFollowUpsValidity;
                //$scope.newUserBranchCostingObj.WalkInConsultationFeeObj.FreeTeleFollowUpsValidity = sitem.WalkInConsultationFeeObj[0].FreeTeleFollowUpsValidity;
                //$scope.newUserBranchCostingObj.WalkInConsultationFeeObj.NoOfFreeFollowUps = sitem.WalkInConsultationFeeObj[0].NoOfFreeFollowUps;
                //$scope.newUserBranchCostingObj.WalkInConsultationFeeObj.NoOfTeleFreeFollowUps = sitem.WalkInConsultationFeeObj[0].NoOfTeleFreeFollowUps;
                //$scope.newUserBranchCostingObj.TeleConsultationFeeObj.ConsultationFee = sitem.TeleConsultationFeeObj[0].ConsultationFee;
                //$scope.newUserBranchCostingObj.TeleConsultationFeeObj.FreeFollowUpsValidity = sitem.TeleConsultationFeeObj[0].FreeFollowUpsValidity;
                //$scope.newUserBranchCostingObj.TeleConsultationFeeObj.FreeTeleFollowUpsValidity = sitem.TeleConsultationFeeObj[0].FreeTeleFollowUpsValidity;
                //$scope.newUserBranchCostingObj.TeleConsultationFeeObj.NoOfFreeFollowUps = sitem.TeleConsultationFeeObj[0].NoOfFreeFollowUps;
                //$scope.newUserBranchCostingObj.TeleConsultationFeeObj.NoOfTeleFreeFollowUps = sitem.TeleConsultationFeeObj[0].NoOfTeleFreeFollowUps;

                $scope.newUserBranchCostingObj.ConsultationFeeObj.PhysicalConsultationCost = sitem.ConsultationFeeObj[0].PhysicalConsultationCost;
                $scope.newUserBranchCostingObj.ConsultationFeeObj.VideoConsultationCost = sitem.ConsultationFeeObj[0].VideoConsultationCost;
                $scope.newUserBranchCostingObj.ConsultationFeeObj.FastTrackCharges = sitem.ConsultationFeeObj[0].FastTrackCharges;
                $scope.newUserBranchCostingObj.ConsultationFeeObj.NoOfFreeFollowUps = sitem.ConsultationFeeObj[0].NoOfFreeFollowUps;
                $scope.newUserBranchCostingObj.ConsultationFeeObj.FollowUpValidityDays = sitem.ConsultationFeeObj[0].FollowUpValidityDays;


            }
        });

    };

    $scope.changeSpecialityBranchSpl = function (item) {
        item.SpecializationId = item.SpecializationObj.SpecializationId;
        item.SpecializationName = item.SpecializationObj.SpecializationName;
        $scope.SubSpecializationsList = [];
        $scope.filteredArray = $filter("filter")($scope.MainBranchSubSpecializationsArray, function (sitem, index) { return sitem.SpecializationId === item.SpecializationId; });
        if ($scope.filteredArray.length > 0) {
            $scope.SubSpecializationsList = angular.copy($scope.filteredArray);

        } else {
            alertify.error("No Departments has been added for this specialization");
        }
    }


    $scope.addUserBranchSpecialization = function (item) {


        var branchObj = {
            "UserBranchSpecializationId": 0,
            "BranchId": item.BranchId,
            "BranchName": item.BranchName,
            "SpecializationId": item.SpecializationId,
            "SpecializationName": item.SpecializationName,
            "Departments": []
        };

        var deptObj = {
            "UserSubSpecializationId": 0,
            "SubSpecializationId": item.SubSpecializationId,
            "SubSpecializationName": item.SubSpecializationName
        };

        branchObj.Departments.push(deptObj);



        if ($scope.MainUserObj.UserBranchSpecialities.length === 0) {
            $scope.MainUserObj.UserBranchSpecialities.push(branchObj);
        } else {
            var filteredArray = $filter("filter")($scope.MainUserObj.UserBranchSpecialities, function (iterator, ind) { return iterator.BranchId === item.BranchId && iterator.SpecializationId === item.SpecializationId; });
            if (filteredArray.length === 0) {
                $scope.MainUserObj.UserBranchSpecialities.push(branchObj);
            } else {
                var validateroleinbranch = false;
                angular.forEach($scope.MainUserObj.UserBranchSpecialities, function (bitem) {
                    if (bitem.BranchId === item.BranchId && bitem.SpecializationId === item.SpecializationId) {
                        angular.forEach(bitem.Departments, function (ritem) {
                            if (ritem.SubSpecializationId === item.SubSpecializationId) {
                                validateroleinbranch = true;
                            }
                        });
                    }
                });
                console.log(validateroleinbranch);
                if (validateroleinbranch) {
                    alertify.error("Same SubSpeciality Already Added for this Branch");
                    return false;
                }
                else {
                    angular.forEach($scope.MainUserObj.UserBranchSpecialities, function (bitem) {
                        if (bitem.BranchId === item.BranchId && bitem.SpecializationId === item.SpecializationId) {
                            bitem.Departments.push(deptObj);
                        }
                    });
                }
            }
        }

        $scope.newUserBranchSpecializationObj = getnewUserBranchSpecializationObj();
    };


    $scope.changeSubSpecializationBranch = function (item) {
        item.SubSpecializationId = item.SubSpecializationObj.SubSpecializationId;
        item.SubSpecializationName = item.SubSpecializationObj.SubSpecializationName;
    };

    $scope.deleteBranchSpecialization = function (childindex, parentIndex, mainitem) {
        mainitem.Departments.splice(childindex, 1);
        if (mainitem.Departments.length === 0) {
            $scope.MainUserObj.UserBranchSpecialities.splice(parentIndex, 1);
        }
    };

    $scope.isAddSubSplDivEnabled = false;
    $scope.showaddSubSplDiv = function () {
        $scope.isAddSubSplDivEnabled = true;
        $scope.newUserBranchDepartmentObj = getnewUserBranchDepartmentsObj();
    }


    $scope.saveUserBranchDepartments = function () {
        console.log($scope.newUserBranchDepartmentObj);
        $scope.newUserBranchDepartmentObj.BranchId = $scope.newUserBranchDepartmentObj.BranchId || "";

        if ($scope.newUserBranchDepartmentObj.BranchId == "") {
            alertify.error("Please Select Branch");
            return false;
        }
        var params = {
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "UserBranchId": $scope.newUserBranchDepartmentObj.UserBranchId,
            "BranchId": $scope.newUserBranchDepartmentObj.BranchId,
            "Departments": []
        };
        angular.forEach($scope.SubSpecializationsList, function (subitem) {
            if (subitem.ActiveInd == 'Y') {
                params.Departments.push(subitem);
            }
        });

        if (params.Departments.length === 0) {
            alertify.error("Please Select Sub Speciality");
            return false;
        };


        var filteredArray = $filter("filter")(params.Departments, function (iterator, ind) { return iterator.IsPrimarySubSpecialization === true; });

        if (filteredArray.length === 0) {
            alertify.error("Please Select a Primary Sub Speciality");
            return false;
        }



        eHnoteMainAdminServices.addUpdateUserBranchSubSpecialities(params, callbackuserbranchSuccess, callbackuserbranchError);
        function callbackuserbranchSuccess(resp) {
            if (resp.status === "Success") {
                alertify.success("User Data Updated Successfully");
                $scope.isAddSubSplDivEnabled = false;
                $scope.getUserBranchOtherDetails($scope.MainUserObj.BasicInfo.UserId);
                $scope.newUserBranchDepartmentObj = getnewUserBranchDepartmentsObj();
            }
        }
        function callbackuserbranchError(err) {
            alertify.error("Some Error Occured");
        }

    }


    $scope.clearUserBranchDept = function () {
        $scope.isAddSubSplDivEnabled = false;
        $scope.newUserBranchDepartmentObj = getnewUserBranchDepartmentsObj();

    }

    $scope.clearUserRoleRights = function (type) {
        if (type == 'AccessRights') {
            $scope.showAccessRightsList = true;
            $scope.newUserBranchRoleObj = getnewUserBranchRoleObj();
        }
        if (type == 'EmergencyAccessRights') {
            getSubOrganizationGroups(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);

            $scope.selectEmergencyAllRightsStatus = true;
            //$scope.newUserBasicInfoObj.UserWorkingBranches
            $scope.AllUserBranchesList = [];
            $scope.AllUserBranchesList = angular.copy($scope.newUserBasicInfoObj.UserWorkingBranches);

            var allBranchObj = {
                "BranchId": 0,
                "BranchName": "All Locations"
            }
            $scope.showEmergencyAccessRightsList = true;
            $scope.AllUserBranchesList.unshift(allBranchObj);
            $scope.newUserBranchAccessObj = getNewUserBranchAccessRights();
            $scope.newUserBranchAccessObj.UserId = $scope.MainUserObj.BasicInfo.UserId;
            $scope.newUserBranchAccessObj.BranchObj = $scope.AllUserBranchesList[0];
            $scope.newUserBranchAccessObj.BranchId = 0;
            $scope.newUserBranchAccessObj.BranchName = "All Locations";
            $scope.getUserBranchAccessRightsNew();
            $scope.GetTimeSlotForEmergencyAccess();
            console.log($scope.TimeSlotStartValues);
            console.log($scope.TimeSlotEndValues);
            $scope.EmergencyUserAccessRights = angular.copy($scope.parentAccessRightsList);
        }
    }

    $scope.saveUserRolesnRights = function (type) {

        console.log(JSON.stringify($scope.newUserBranchRoleObj));

        if ($scope.newUserBranchRoleObj.BranchId === "") {
            alertify.error("Please Select Branch");
            return false;
        }
        //if ($scope.newUserBranchRoleObj.DefaultTabId === "" || $scope.newUserBranchRoleObj.DefaultTabId == undefined || $scope.newUserBranchRoleObj.DefaultTabId==null) {
        //    alertify.error("Please Select a Default Tab");
        //    return false;
        //}
        var params = {
            "UserBranchRoleId": 0,
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "UserBranchId": $scope.newUserBranchRoleObj.UserBranchId,
            "BranchId": $scope.newUserBranchRoleObj.BranchId,
            "RoleId": $scope.newUserBranchRoleObj.RoleId,
            "GroupId": $scope.newUserBranchRoleObj.GroupId,
            "AccessRights": [],
            "DefaultTabId": $scope.newUserBranchRoleObj.DefaultTabId,
            "IsRightsForAllBranchInd": $scope.newUserBranchRoleObj.IsRightsForAllBranchInd,
            "EmergencyAccessRightsDate": "",
            "EmergencyAccessRightsStratTime": "",
            "EmergencyAccessRightsEndTime": "",
            "EmergencyAccessRightsList": [],
            "IsEmergencyRightActiveInd": false,
        };
        $scope.selectedAccessrightsList = angular.copy($scope.AccessrightsList);
        $scope.selectedAccessrightsList1 = [];
        angular.forEach($scope.selectedAccessrightsList, function (mitem) {
            if (mitem.isSubAccessCategorySelected) {
                $scope.selectedAccessrightsList1.push(mitem);
            }
        });
        angular.forEach($scope.selectedAccessrightsList1, function (mitem) {
            for (var i = mitem.AccessList.length - 1; i >= 0; i--) {
                if (mitem.AccessList[i].ActiveInd === "N") {
                    mitem.AccessList.splice(i, 1);
                }
            }
        });
        if (type == 'AccessRights') {
            if ($scope.selectedAccessrightsList1.length === 0) {
                alertify.error("Please Select Access Rights");
                return false;
            }
        }
        params.AccessRights = $scope.selectedAccessrightsList1;

        if (type == 'EmergencyAccessRights') {

            params.IsEmergencyRightActiveInd = true;
            $scope.selectedEmergencyAccessrightsList = angular.copy($scope.EmergencyUserAccessRights);
            $scope.selectedEmergencyAccessrightsList1 = [];
            angular.forEach($scope.selectedEmergencyAccessrightsList, function (mitem) {
                if (mitem.isSubAccessCategorySelected) {
                    $scope.selectedEmergencyAccessrightsList1.push(mitem);
                }
            });
            angular.forEach($scope.selectedEmergencyAccessrightsList1, function (mitem) {
                for (var i = mitem.AccessList.length - 1; i >= 0; i--) {
                    if (mitem.AccessList[i].ActiveInd === "N") {
                        mitem.AccessList.splice(i, 1);
                    }
                }
            });
            if ($scope.EmergencyAccessRightList.EmergencyAccessRightsActiveInd == 'InActive' || $scope.EmergencyAccessRightList.EmergencyAccessRightsActiveInd == "") {
                alertify.error("The User In InActive.Please Make Sure That  User is in Active Mode");
                return false;
            }
            if ($scope.selectedEmergencyAccessrightsList1.length === 0) {
                alertify.error("Please Select Access Rights");
                return false;
            }
            params.EmergencyAccessRightsList = $scope.selectedEmergencyAccessrightsList1;
            params.EmergencyAccessRightsDate = $scope.EmergencyAccessRightList.EmergencyAccessRightsDate;
            params.EmergencyAccessRightsStratTime = $scope.EmergencyAccessRightList.EmergencyAccessRightsStratTime;
            params.EmergencyAccessRightsEndTime = $scope.EmergencyAccessRightList.EmergencyAccessRightsEndTime;
        }
            params.FromUserId = $scope.UserId;
        eHnoteMainAdminServices.addUpdateUserBranchInfo(params, callbackuserbranchSuccess, callbackuserbranchError);
        function callbackuserbranchSuccess(resp) {
            console.log(resp);
            if (resp.status === "Success") {
                alertify.success("User Data Updated Successfully");
                $scope.newUserBranchRoleObj = getnewUserBranchRoleObj();
                $scope.EmergencyAccessRightList.EmergencyAccessRightsActiveInd = '';
                $scope.showAccessRightsList = true;
                $scope.showEmergencyAccessRightsList = true;
                $scope.AllUserBranchesList = [];
                $scope.AllUserBranchesList = angular.copy($scope.newUserBasicInfoObj.UserWorkingBranches);

                var allBranchObj = {
                    "BranchId": 0,
                    "BranchName": "All Locations"
                }

                $scope.AllUserBranchesList.unshift(allBranchObj);
                $scope.newUserBranchAccessObj = getNewUserBranchAccessRights();
                $scope.newUserBranchAccessObj.UserId = $scope.MainUserObj.BasicInfo.UserId;
                $scope.newUserBranchAccessObj.BranchObj = $scope.AllUserBranchesList[0];
                $scope.newUserBranchAccessObj.BranchId = 0;
                $scope.newUserBranchAccessObj.BranchName = "All Locations";
                $scope.getUserBranchAccessRightsNew();
            }

        }
        function callbackuserbranchError(err) {
            alertify.error("Some Error Occured");
        }

    }

    
    $scope.showAccessRightsList = true;
    $scope.showEmergencyAccessRightsList = true;
    $scope.showaddAssignAccessRightsDiv = function () {
        $scope.showAccessRightsList = false;
        $scope.resetRoleItems();
        $scope.selectAllRightsStatus = true;
    };

    $scope.showaddAssignEmergencyAccessRightsDiv = function () {
        $scope.showEmergencyAccessRightsList = false;
        $scope.resetRoleItemsEmergency();
        $scope.selectEmergencyAllRightsStatus = true;
        $scope.showEmergencyAccessRightsList = false;
    };
    $scope.totalUserBranchAccessCount = 0;

    $scope.getUserBranchAccessRightsNew = function () {
        console.log(JSON.stringify($scope.newUserBranchAccessObj));
        eHnoteMainAdminServices.getUserBranchAccessRightsById($scope.newUserBranchAccessObj, callbackuserbranchgetSuccess, callbackuserbranchgetError);
        function callbackuserbranchgetSuccess(resp) {
            console.log(resp);
            $scope.MainUserObj.UserBranchRolesnRights = [];
            if (resp.status === 'Success') {
                $scope.UserBranchAccessRights = [];
                $scope.UserBranchSubAccessCategories = [];
                $scope.UserBranchEmergencyAccessRights = [];
                $scope.UserBranchEmergencySubAccessCategories = [];

                $scope.totalUserBranchAccessCount = 0;
                if (resp.UserBranchDetails.length > 0) {
                    $scope.MainUserObj.UserBranchRolesnRights = resp.UserBranchDetails;
                    $scope.totalUserBranchAccessCount = resp.count;
                    angular.forEach($scope.MainUserObj.UserBranchRolesnRights, function (item) {
                        if (item.AccessRights.length > 0) {
                            var obj = {
                                "BranchName": item.BranchName,
                                "BranchId": item.BranchId,
                                "UserBranchId": item.UserBranchId,
                                "AccessRights": item.AccessRights,
                                "DefaultTabId": item.DefaultTabId,
                                "rightsCount": 16,
                                "IsEmergencyRightActiveInd": item.IsEmergencyRightActiveInd || false,
                                "EmergencyAccessRightsDate": item.EmergencyAccessRightsDate || "",
                                "EmergencyAccessRightsStratTime": item.EmergencyAccessRightsStratTime || "",
                                "EmergencyAccessRightsEndTime": item.EmergencyAccessRightsEndTime||""
                                  
                            };
                            $scope.UserBranchAccessRights.push(obj);
                            var obj = {
                                "BranchName": item.BranchName,
                                "BranchId": item.BranchId,
                                "UserBranchId": item.UserBranchId,
                                "DefaultTabId": item.DefaultTabId,
                                "SubAccessCategories": item.AccessCategoryList,
                                "IsEmergencyRightActiveInd": item.IsEmergencyRightActiveInd || false,
                                "EmergencyAccessRightsDate": item.EmergencyAccessRightsDate || "",
                                "EmergencyAccessRightsStratTime": item.EmergencyAccessRightsStratTime || "",
                                "EmergencyAccessRightsEndTime": item.EmergencyAccessRightsEndTime || ""
                            };
                            $scope.UserBranchSubAccessCategories.push(obj);
                        }
                    });
                   
                }
                $scope.totalUserBranchEmergencyAccessCount = 0;
                if (resp.EmergencyUseAccessDetails.length > 0) {
                    $scope.MainUserObj.UserBranchRolesnEmergencyRights = resp.EmergencyUseAccessDetails;
                    $scope.totalUserBranchEmergencyAccessCount = resp.count;
                    angular.forEach($scope.MainUserObj.UserBranchRolesnEmergencyRights, function (item) {
                        if (item.AccessRights.length > 0) {
                            var obj = {
                                "BranchName": item.BranchName,
                                "BranchId": item.BranchId,
                                "UserBranchId": item.UserBranchId,
                                "AccessRights": item.AccessRights,
                                "DefaultTabId": item.DefaultTabId,
                                "rightsCount": 16,
                                "IsEmergencyRightActiveInd": item.IsEmergencyRightActiveInd || false,
                                "EmergencyAccessRightsDate": item.EmergencyAccessRightsDate || "",
                                "EmergencyAccessRightsStratTime": item.EmergencyAccessRightsStratTime || "",
                                "EmergencyAccessRightsEndTime": item.EmergencyAccessRightsEndTime || ""

                            };
                            $scope.UserBranchEmergencyAccessRights.push(obj);
                            var obj = {
                                "BranchName": item.BranchName,
                                "BranchId": item.BranchId,
                                "UserBranchId": item.UserBranchId,
                                "DefaultTabId": item.DefaultTabId,
                                "SubAccessCategories": item.AccessCategoryList,
                                "IsEmergencyRightActiveInd": item.IsEmergencyRightActiveInd || false,
                                "EmergencyAccessRightsDate": item.EmergencyAccessRightsDate || "",
                                "EmergencyAccessRightsStratTime": item.EmergencyAccessRightsStratTime || "",
                                "EmergencyAccessRightsEndTime": item.EmergencyAccessRightsEndTime || ""
                            };
                            $scope.UserBranchEmergencySubAccessCategories.push(obj);
                        }
                    });
                    $scope.EmergencyUserAccessRights = angular.copy($scope.UserBranchEmergencyAccessRights);
                }
            }
        }
        function callbackuserbranchgetError(err) {
            alertify.error("Some Error Occured");
        }

    }



    $scope.today = moment();

    var day = moment("1995-12-25");

    $scope.mySelectedDates = [
        moment("2020-11-21"), moment("2020-11-22"), moment("2020-11-23")
    ];


    //$scope.highlightDays = [
    //    { date: moment("2020-11-29"), css: 'holiday', selectable: false, title: 'Holiday time !' },
    //    { date: moment("2020-11-22"), css: 'birthday', selectable: false, title: 'Im on Leave' },
    //]
    $scope.highlightDays = [];
    $scope.selectedDates = [];

    $scope.$watch('myArrayOfDates', function (newValue) {
        if (newValue) {
            console.log('my array changed, new size : ' + newValue.length);
        }
    }, true);


    $scope.$watch('selectedDates', function (newValue) {
        $scope.selectedDate = moment(newValue[0]);
        var StartDate = moment($scope.selectedDate).format('DD-MM-YYYY');
    }, true);


    $scope.userSlotTypeId = 0;
    $scope.isNormalSlot = true;
    $scope.mainSlotObject = {
        "selectedDates": [],
        "highlightDays": [],
        "UserAvailabilityTypeId": "",
        "UserSlotTypeId": "",
        "BranchId": ""
    };


    $scope.parentAccessRightsList = [];

    $scope.GetParentBranchAccessRights = function (ParentOrganizationId) {
        eHnoteMainAppointmentService.GetParentBranchAccessRights(ParentOrganizationId, onAddUpdateDoctorSuccess, onAddUpdateDoctorError);
        function onAddUpdateDoctorSuccess(data) {

            if (data.Status === 'Success') {
                $scope.parentAccessRightsList = data.rows.AccessRights || [];

                angular.forEach($scope.parentAccessRightsList, function (maintiem) {
                    maintiem.isSubAccessCategorySelected = false;
                    maintiem.UserBranchSubAccessCategoryId = 0;
                    maintiem.isAllCategoryItemsSelected = false;
                    maintiem.ActiveInd = "N";
                    angular.forEach(maintiem.AccessList, function (citem) {
                        citem.ActiveInd = 'N';
                        citem.DeleteInd = 'N';
                        citem.UserBranchAccessRightId = 0;
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


    //New Caldendar Code By Durga as ono 23-11-2020


    var newdate = new Date();
    $scope.isCurrentPreviousMonth = false;
    var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');

    var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);




    $scope.selectedDate = firstDay;


    var startDate = firstDay;
    var EndDate = lastDay;
    var DateArray = [];

    var ExtraDaysCount = 0;



    var daynumber = new Date(firstDay).getDay();





    var currentMonthFirstDate = getMonthFirstDate(firstDay);

    function getMonthFirstDate(firstDay) {
        var daynumber = new Date(firstDay).getDay();
        var days; // Days you want to subtract
        var date = new Date();
        var startingdate = "";
        if (daynumber === 1) {//MON
            days = 0;
        }
        else if (daynumber === 2) { //TUE
            days = 1;
        }
        else if (daynumber === 3) { //WED
            days = 2;
        }
        else if (daynumber === 4) { //THU
            days = 3;
        }
        else if (daynumber === 5) { //FRI
            days = 4;
        }
        else if (daynumber === 6) { //SAT
            days = 5;
        }
        else if (daynumber === 0) { //SUN
            days = 6;
        }
        ExtraDaysCount = days + 1;
        var last = new Date(firstDay.getTime() - (days * 24 * 60 * 60 * 1000));
        startingdate = $filter('date')(new Date(last), "yyyy-MM-dd")
        return startingdate;
    }

    console.log(DateArray);

    //function formatDate(date) {
    //    var dd = date.getDate();
    //    var mm = date.getMonth() + 1;
    //    var yyyy = date.getFullYear();
    //    if (dd < 10) { dd = '0' + dd }
    //    if (mm < 10) { mm = '0' + mm }
    //    date = mm + '/' + dd + '/' + yyyy;
    //    return date
    //}

    //function Last7Days() {
    //    var result = [];
    //    var date = new Date();
    //    for (var i = 0; i < 7; i++) {
    //        var d = new Date(date.getFullYear(), date.getMonth(), 1);
    //        d.setDate(d.getDate() - i);
    //        result.push(formatDate(d))
    //    }

    //    return (result.join(','));
    //}


    function getDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);
        var NoOfdays = stopDate.diff(currentDate, 'days');


        var maxDayCount = 34 + ExtraDaysCount;
        var diffDays = parseInt(maxDayCount) - parseInt(NoOfdays);

        //moment() stopDate.addDays(diffDays);
        var newstopDate = moment(stopDate, 'dd/MM/yyyy').add('days', diffDays);


        var newdatesdifference = newstopDate.diff(currentDate, 'days');

        if (newdatesdifference === 40) {
            var newstopDate = moment(stopDate, 'dd/MM/yyyy').add('days', diffDays + 1);
        }


        while (currentDate <= newstopDate) {
            var obj = "";
            if (currentDate <= stopDate) {
                obj = {
                    "FullDate": $filter('date')(new Date(currentDate), 'yyyy-MM-dd'),
                    "Date": $filter('date')(new Date(currentDate), 'd'),
                    "Day": $filter('date')(new Date(currentDate), 'EEE'),
                    "Month": $filter('date')(new Date(currentDate), 'M')
                }
            } else {
                obj = {
                    "FullDate": $filter('date')(new Date(currentDate), 'yyyy-MM-dd'),
                    "Date": $filter('date')(new Date(currentDate), 'd'),
                    "Day": $filter('date')(new Date(currentDate), 'EEE'),
                    "Month": $filter('date')(new Date(currentDate), 'M')
                }
            }



            dateArray.push(obj)
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }

    function getMonthDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);

        var newstopDate = stopDate;

        while (currentDate <= newstopDate) {
            var obj = "";
            if (currentDate <= stopDate) {
                obj = {
                    "FullDate": $filter('date')(new Date(currentDate), 'yyyy-MM-dd'),
                    "IsLeave": false,
                    "BranchArray": []
                }
            } else {
                obj = {
                    "FullDate": $filter('date')(new Date(currentDate), 'yyyy-MM-dd'),
                    "IsLeave": false,
                    "BranchArray": []
                }
            }



            dateArray.push(obj)
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }






    function formTimerArray(DateArray, selectedmonth) {


        for (var i = 0; i < DateArray.length; i++) {
            var obj = "";
            var IsCurrentDate = false;
            var IsFutureDate = false;
            var selectedWeek = false;
            var isHoliday = false;
            var holidayText = "";
            var currentselectedMonth = false;
            if (DateArray[i].FullDate == $filter('date')(new Date(), 'yyyy-MM-dd')) {
                IsCurrentDate = true;
            }

            if (moment(new Date(), "DD/MM/YYYY") < moment(DateArray[i].FullDate, "DD/MM/YYYY")) {
                IsFutureDate = true;
            }


            if (DateArray[i].Month === $filter('date')(new Date(selectedmonth), 'M')) {
                currentselectedMonth = true;
            }

            //angular.forEach($scope.HolidaysList, function (item) {
            //    var dateOne = $filter('date')(new Date(item.HolidayDate), 'yyyy-MM-dd');
            //    var dateTwo = DateArray[i].FullDate;
            //    if (dateOne === dateTwo) {
            //        isHoliday = true;
            //        holidayText = item.HolidayName;
            //    }
            //});

            var WeekNumber = 0;
            if (i >= 0 && i < 7) {
                WeekNumber = 1;
                selectedWeek = true;
                var weeknameObj = "";
                weeknameObj = {
                    "weekName": DateArray[i].Day
                }
                $scope.TimerWeekArray.push(weeknameObj);
            }
            if (i >= 7 && i < 14) {
                WeekNumber = 2;
            }
            if (i >= 14 && i < 21) {
                WeekNumber = 3;
            }
            if (i >= 21 && i < 28) {
                WeekNumber = 4;
            }
            if (i >= 28 && i < 35) {
                WeekNumber = 5;
            }
            if (i >= 35 && i < 42) {
                WeekNumber = 6;
            }

            $scope.weekitems = {
                "checkitem1": "N",
                "checkitem2": "N",
                "checkitem3": "N",
                "checkitem4": "N",
                "checkitem5": "N",
                "checkitem6": "N"
            }
            $scope.month = { "checkitem": "N" };


            obj = {
                "RowIndex": i + 1,
                "Day": DateArray[i].Day,
                "Week": WeekNumber,
                "Date": DateArray[i].Date,
                "FullDate": DateArray[i].FullDate,
                "IsCurrentDate": IsCurrentDate,
                "IsSelectedDate": false,
                "SelectedWeek": selectedWeek,
                "IsFutureDate": IsFutureDate,
                "IsSelectedMonth": currentselectedMonth,
                "IsHoliday": isHoliday,
                "IsHolidayText": holidayText,
                "IsDateSlotBooked": false,
                "IsDateSlotLeave": false,
                "BranchesName": "",
                "BranchesFullName": ""
            }



            $scope.MainTimerArray.push(obj);

        }

        console.log(selectedmonth);


        var firstDay = new Date(selectedmonth.getFullYear(), selectedmonth.getMonth(), 1);
        var lastDay = new Date(selectedmonth.getFullYear(), selectedmonth.getMonth() + 1, 0);
        var params = {
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "FromDate": $filter('date')(new Date(firstDay), "yyyy-MM-dd"),
            "ToDate": $filter('date')(new Date(lastDay), "yyyy-MM-dd"),
            "BranchId": 0,
            "SubOrganizationId": doctorinfo.doctordata.UserAddress[0].SubOrganizationId,
            "SlotTypeId": 0
        }

        console.log(JSON.stringify(params));


        eHnoteMainAdminServices.getUserTimeSlots(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
        function callbackgetuserbranchSuccess(resp) {
            console.log(JSON.stringify(resp));
            if (resp.status === "Success") {
                $scope.userBranchSlotList = resp.slotsList;


                var SlotsDateArray = getMonthDates(firstDay, lastDay);
                console.log(SlotsDateArray);


                angular.forEach(SlotsDateArray, function (bitem) {
                    angular.forEach($scope.userBranchSlotList, function (sitem) {
                        if (bitem.FullDate === sitem.SlotDate) {
                            if (sitem.SlotTypeId === 2) {
                                //bitem.IsLeave = sitem.IsLeave;
                                if (sitem.SlotType == "Leave") {
                                    bitem.IsLeave = true;
                                }
                                bitem.UserTimeSlotId = sitem.UserTimeSlotId;
                            }
                            if (sitem.SlotTypeId === 1) {
                                if (bitem.BranchArray.length === 0) {
                                    var obj = {
                                        "BranchId": sitem.BranchId,
                                        "BranchName": sitem.BranchName,
                                        "TimeSlotsArray": []
                                    }
                                    bitem.BranchArray.push(obj);
                                } else {
                                    var filteredArray = $filter("filter")(bitem.BranchArray, function (iterator, ind) { return iterator.BranchId === sitem.BranchId; });

                                    if (filteredArray.length === 0) {
                                        var obj = {
                                            "BranchId": sitem.BranchId,
                                            "BranchName": sitem.BranchName,
                                            "TimeSlotsArray": []
                                        }
                                        bitem.BranchArray.push(obj);
                                    }
                                }
                            }
                        }
                    });
                });



                angular.forEach(SlotsDateArray, function (mitem) {
                    angular.forEach(mitem.BranchArray, function (bitem) {
                        angular.forEach($scope.userBranchSlotList, function (citem) {
                            if (mitem.FullDate === citem.SlotDate && bitem.BranchId === citem.BranchId) {
                                var pobj = {
                                    "UserTimeSlotId": citem.UserTimeSlotId,
                                    "StartTime": citem.SlotStartTime,
                                    "EndTime": citem.SlotEndTime
                                }
                                bitem.TimeSlotsArray.push(pobj);
                            }
                        });
                    });
                });


                $scope.modifiedUserSlotsArray = SlotsDateArray;



                angular.forEach($scope.modifiedUserSlotsArray, function (mainitem) {
                    angular.forEach($scope.MainTimerArray, function (subitem) {
                        if (mainitem.FullDate === subitem.FullDate) {
                            //if (mainitem.SlotTypeId === 2) {
                            if (mainitem.IsLeave === true) {
                                subitem.IsDateSlotLeave = true;
                            } else {
                                if (mainitem.BranchArray.length > 0) {
                                    subitem.IsDateSlotBooked = true;
                                    var totalLength = mainitem.BranchArray.length;
                                    angular.forEach(mainitem.BranchArray, function (bitem, bindex) {
                                        if (bindex === 0) {
                                            subitem.BranchesName = bitem.BranchName;
                                        }

                                        if (bindex === totalLength + 1 || bindex === 0) {
                                            subitem.BranchesFullName = bitem.BranchName;
                                        } else {
                                            subitem.BranchesFullName = subitem.BranchesFullName + " ," + bitem.BranchName;
                                        }
                                    });
                                }
                            }

                        }
                    });
                });








            } else {
                $scope.userBranchSlotList = [];
            }

        }
        function callbackgetuserbranchError(err) {
            alertify.error("Some Error Occured");
        }

    }

    $scope.months = [{
        Id: 0,
        Name: 'JANUARY'
    }, {
        Id: 1,
        Name: 'FEBRUARY'
    }, {
        Id: 2,
        Name: 'MARCH'
    }, {
        Id: 3,
        Name: 'APRIL'
    }, {
        Id: 4,
        Name: 'MAY'
    }, {
        Id: 5,
        Name: 'JUNE'
    }, {
        Id: 6,
        Name: 'JULY'
    }, {
        Id: 7,
        Name: 'AUGUST'
    }, {
        Id: 8,
        Name: 'SEPTEMBER'
    }, {
        Id: 9,
        Name: 'OCTOBER'
    }, {
        Id: 10,
        Name: 'NOVEMBER'
    }, {
        Id: 11,
        Name: 'DECEMBER'
    }];

    $scope.selectedmonth = newdate.getMonth();




    $scope.years = [];
    $scope.currentYear = newdate.getFullYear();
    // 10 Years from current year
    $scope.maxYear = new Date(newdate.setFullYear(newdate.getFullYear() + 10)).getFullYear();
    for (var x = $scope.currentYear; x <= $scope.maxYear; x++) {
        $scope.years.push({ Id: x, Name: x });
    }

    $scope.selectedyear = $scope.currentYear;


    //$scope.changeMonthCalendar = function (selectedmonth, year) {
    //    console.log(selectedmonth)
    //    var thisMonth = new Date()
    //    var currentmonth = thisMonth.getMonth();
    //    var nextMonth = new Date(thisMonth);
    //    var monthdifference = selectedmonth - currentmonth;
    //    if (selectedmonth < currentmonth) {
    //        nextMonth.setMonth(thisMonth.getMonth() + monthdifference);
    //    } else if (selectedmonth > currentmonth) {
    //        nextMonth.setMonth(thisMonth.getMonth() + monthdifference);
    //    } else {
    //        nextMonth.setMonth(thisMonth.getMonth());
    //    }
    //    var selectedMonthStartDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    //    var selectedMonthEndDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
    //    console.log(selectedMonthStartDate);
    //    var currentMonthFirstDate = getMonthFirstDate(selectedMonthStartDate);
    //    DateArray = getDates(currentMonthFirstDate, selectedMonthEndDate);
    //    $scope.MainTimerArray = [];
    //    $scope.TimerWeekArray = [];
    //    $scope.selectedCurrentWeek = 1;
    //    formTimerArray(DateArray, nextMonth);
    //}


    $scope.changeYearMonthCalendar = function (selectedmonth, year) {

        var thisyear = new Date()
        var selectedYear = new Date(thisyear);




        var currentyear = thisyear.getFullYear();

        var yearDifference = year - currentyear;



        if (yearDifference === 0) {
            selectedYear.setYear(thisyear.getFullYear());
        } else {
            selectedYear.setYear(thisyear.getFullYear() + 1);
        }


        var thisMonth = new Date()

        var currentmonth = thisMonth.getMonth();


        var nextMonth = new Date(thisMonth);

        var monthdifference = selectedmonth - currentmonth;


        if (selectedmonth < currentmonth) {
            nextMonth.setMonth(thisMonth.getMonth() + monthdifference);
        } else if (selectedmonth > currentmonth) {
            nextMonth.setMonth(thisMonth.getMonth() + monthdifference);
        } else {
            nextMonth.setMonth(thisMonth.getMonth());
        }



        var selectedMonthStartDate = new Date(selectedYear.getFullYear(), nextMonth.getMonth(), 1);

        var selectedMonthEndDate = new Date(selectedYear.getFullYear(), nextMonth.getMonth() + 1, 0);



        var currentMonthFirstDate = getMonthFirstDate(selectedMonthStartDate);


        DateArray = getDates(currentMonthFirstDate, selectedMonthEndDate);
        $scope.MainTimerArray = [];
        $scope.TimerWeekArray = [];
        $scope.selectedCurrentWeek = 1;
        formTimerArray(DateArray, nextMonth);
    };


    $scope.navtoPreviousMonth = function (selectedmonth, selectedyear) {
        console.log(selectedmonth);
        console.log(selectedyear);
        console.log($scope.selectedDate);
        var past = moment($scope.selectedDate).subtract(1, 'month');


        var previousmonth = moment(past);
        console.log(previousmonth);
        var previousmonthDate = moment(previousmonth).format('YYYY/MM/DD');
        console.log(previousmonthDate);

        var newDate = new Date(previousmonthDate);

        console.log(newDate)

        var fullyear = newDate.getFullYear();
        var fullmonth = newDate.getMonth();

        $scope.selectedmonth = fullmonth;
        $scope.selectedyear = fullyear;


        var selectedMonthStartDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        $scope.selectedDate = selectedMonthStartDate;



        var currentDate = new Date();
        var currentfullyear = currentDate.getFullYear();
        var currentfullmonth = currentDate.getMonth();
        $scope.isCurrentPreviousMonth = false;
        if (currentfullyear === fullyear && currentfullmonth === fullmonth) {
            $scope.isCurrentPreviousMonth = true;
        }
        var selectedMonthEndDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);


        var currentMonthFirstDate = getMonthFirstDate(selectedMonthStartDate);


        DateArray = getDates(currentMonthFirstDate, selectedMonthEndDate);
        $scope.MainTimerArray = [];
        $scope.TimerWeekArray = [];
        $scope.selectedCurrentWeek = 1;
        formTimerArray(DateArray, newDate);
    }


    $scope.navtoPreviousMonthSlotsList = function (selectedmonth, selectedyear) {
        console.log(selectedmonth);
        console.log(selectedyear);
        console.log($scope.selectedDate);
        var past = moment($scope.selectedDate).subtract(1, 'month');


        var previousmonth = moment(past);
        console.log(previousmonth);
        var previousmonthDate = moment(previousmonth).format('YYYY/MM/DD');
        console.log(previousmonthDate);

        var newDate = new Date(previousmonthDate);

        console.log(newDate)

        var fullyear = newDate.getFullYear();
        var fullmonth = newDate.getMonth();

        $scope.selectedmonth = fullmonth;
        $scope.selectedyear = fullyear;


        var selectedMonthStartDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        $scope.selectedDate = selectedMonthStartDate;



        var currentDate = new Date();
        var currentfullyear = currentDate.getFullYear();
        var currentfullmonth = currentDate.getMonth();
        $scope.isCurrentPreviousMonth = false;
        if (currentfullyear === fullyear && currentfullmonth === fullmonth) {
            $scope.isCurrentPreviousMonth = true;
        }
        var selectedMonthEndDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
        $scope.getUserTimeSlots(selectedMonthStartDate, selectedMonthEndDate);

    }

    $scope.navtoNextMonth = function (selectedmonth, selectedyear) {
        console.log($scope.selectedDate);

        var next = moment($scope.selectedDate).add(1, 'month');
        console.log(next);

        var nextmonth = moment(next);
        console.log(nextmonth);

        var nextmonthDate = moment(nextmonth).format('YYYY/MM/DD');



        var newDate = new Date(nextmonthDate);






        var fullyear = newDate.getFullYear();
        var fullmonth = newDate.getMonth();

        $scope.selectedmonth = fullmonth;
        $scope.selectedyear = fullyear;


        var selectedMonthStartDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);

        $scope.selectedDate = selectedMonthStartDate;


        var currentDate = new Date();
        var currentfullyear = currentDate.getFullYear();
        var currentfullmonth = currentDate.getMonth();
        $scope.isCurrentPreviousMonth = false;
        if (currentfullyear === fullyear && currentfullmonth === fullmonth) {
            $scope.isCurrentPreviousMonth = true;
        }

        var selectedMonthEndDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);


        var currentMonthFirstDate = getMonthFirstDate(selectedMonthStartDate);


        DateArray = getDates(currentMonthFirstDate, selectedMonthEndDate);
        $scope.MainTimerArray = [];
        $scope.TimerWeekArray = [];
        $scope.selectedCurrentWeek = 1;
        formTimerArray(DateArray, newDate);
    }




    $scope.navtoNextMonthSlotsList = function (selectedmonth, selectedyear) {
        console.log($scope.selectedDate);

        var next = moment($scope.selectedDate).add(1, 'month');
        console.log(next);

        var nextmonth = moment(next);
        console.log(nextmonth);

        var nextmonthDate = moment(nextmonth).format('YYYY/MM/DD');



        var newDate = new Date(nextmonthDate);






        var fullyear = newDate.getFullYear();
        var fullmonth = newDate.getMonth();

        $scope.selectedmonth = fullmonth;
        $scope.selectedyear = fullyear;


        var selectedMonthStartDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);

        $scope.selectedDate = selectedMonthStartDate;


        var currentDate = new Date();
        var currentfullyear = currentDate.getFullYear();
        var currentfullmonth = currentDate.getMonth();
        $scope.isCurrentPreviousMonth = false;
        if (currentfullyear === fullyear && currentfullmonth === fullmonth) {
            $scope.isCurrentPreviousMonth = true;
        }

        var selectedMonthEndDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);


        $scope.getUserTimeSlots(selectedMonthStartDate, selectedMonthEndDate);
    }

    $scope.holidayActive = function (val) {
        return val ? 'holiday-calc' : '';
    };




    function getTimeSlotObj() {
        var obj = {
            "UserTimeSlotId": 0,
            "UserTimeSlot": "",
            "BranchId": "",
            "BranchName": "",
            "BranchObj": "",
            "TemplateId": 0,
            "SlotType": 1,
            "IsLeave": false,
            "LeaveRemarks": "",
            "StartTime": "",
            "EndTime": "",
            "SelectedDatesArray": [],
            "VisitType": "",
            "AllAllowSlotsObj": {},// 1-walk,2-online, 3-tele  --> changes for visittype 02-09-2022
            "AllBranches": false
        };
        return obj;
    };


    $scope.newUserBranchTimeSlotObj = getTimeSlotObj();

    $scope.tempTimeSlotsArray = [];
    $scope.mainTimeslotArray = [];

    function GetAllowAllTimeSlots() {
        var obj = {
            "AllVisitTypeSlots": true,
            "WalkInStartTimeHH": "00",
            "WalkInStartTimeMM": "00",
            "WalkInEndTimeHH": "00",
            "WalkInEndTimeMM": "00",
            "IsWalkIn": true,
            "OnlineStartTimeHH": "00",
            "OnlineStartTimeMM": "00",
            "OnlineEndTimeHH": "00",
            "OnlineEndTimeMM": "00",
            "IsOnline": true,
            "TelephonicStartTimeHH": "00",
            "TelephonicStartTimeMM": "00",
            "TelephonicEndTimeHH": "00",
            "TelephonicEndTimeMM": "00",
            "IsTelephonic": true
        }
        return obj;
    };
    $scope.NewAllowAllTimeSlots = GetAllowAllTimeSlots();

    $scope.WalkInEndValues = [];
    $scope.OnlineEndValues = [];
    $scope.TelephonicEndValues = [];
    $scope.AllowSlotsStartValues = [];
    /* $scope.weekitems = {
         "checkitem1": "N",
         "checkitem2": "N",
         "checkitem3": "N",
         "checkitem4": "N",
         "checkitem5": "N",
         "checkitem6": "N"
     }*/

    $scope.changeWholeWeek = function (checkitem, weekid) {
        //var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');
        var check = $filter("filter")($scope.MainTimerArray, { "Week": weekid });
        if (checkitem === "Y") {

            angular.forEach(check, function (item) {
                if (item.IsSelectedMonth && !item.IsHoliday) {
                    item.IsSelectedDate = true;
                }
            });
        }
        if (checkitem === "N") {
            angular.forEach(check, function (item) {
                item.IsSelectedDate = false;
            });
        }
        var filteredArrayMonth = $filter("filter")($scope.MainTimerArray, { 'IsSelectedMonth': true, "IsSelectedDate": false });
        if (filteredArrayMonth.length === 0) {
            $scope.month.checkitem = "Y";
        } else {
            $scope.month.checkitem = "N";
        }
    };

    $scope.checkunselectitem = function (id) {
        //console.log(item);
        var check = $filter("filter")($scope.MainTimerArray, { "Week": id });

        var filteredArray = $filter("filter")(check, { "IsSelectedDate": false, 'IsSelectedMonth': true });

        if (filteredArray.length === 0) {

            if (id === 1) {
                $scope.weekitems.checkitem1 = "Y";
            }
            if (id === 2) {
                $scope.weekitems.checkitem2 = "Y";
            }
            if (id === 3) {
                $scope.weekitems.checkitem3 = "Y";
            }
            if (id === 4) {
                $scope.weekitems.checkitem4 = "Y";
            }
            if (id === 5) {
                $scope.weekitems.checkitem5 = "Y";
            }
            if (id === 6) {
                $scope.weekitems.checkitem6 = "Y";
            }

        } else {

            if (id === 1) {
                $scope.weekitems.checkitem1 = "N";
            }
            if (id === 2) {
                $scope.weekitems.checkitem2 = "N";
            }
            if (id === 3) {
                $scope.weekitems.checkitem3 = "N";
            }
            if (id === 4) {
                $scope.weekitems.checkitem4 = "N";
            }
            if (id === 5) {
                $scope.weekitems.checkitem5 = "N";
            }
            if (id === 6) {
                $scope.weekitems.checkitem6 = "N";
            }
        }
        var filteredArrayMonth = $filter("filter")($scope.MainTimerArray, { 'IsSelectedMonth': true, "IsSelectedDate": false });
        if (filteredArrayMonth.length === 0) {
            $scope.month.checkitem = "Y";
        } else {
            $scope.month.checkitem = "N";
        }

    }

    // $scope.month = { "checkitem": "N" };

    $scope.selctWholeMonth = function (checkitem) {
        // var filteredArray = $filter("filter")(check, { "IsSelectedDate": false });
        //DateArray[i].Month = $filter('date')(new Date(selectedmonth), 'M');

        var filteredArray = $filter("filter")($scope.MainTimerArray, { 'IsSelectedMonth': true });
        if (checkitem === "Y") {
            angular.forEach(filteredArray, function (item) {
                if (item.IsSelectedMonth && !item.IsHoliday) {
                    item.IsSelectedDate = true;
                }
            });
            $scope.weekitems.checkitem1 = "Y";
            $scope.weekitems.checkitem2 = "Y";
            $scope.weekitems.checkitem3 = "Y";
            $scope.weekitems.checkitem4 = "Y";
            $scope.weekitems.checkitem5 = "Y";
            $scope.weekitems.checkitem6 = "Y";
        }
        if (checkitem === "N") {
            angular.forEach(filteredArray, function (item) {
                item.IsSelectedDate = false;
            });
            $scope.weekitems.checkitem1 = "N";
            $scope.weekitems.checkitem2 = "N";
            $scope.weekitems.checkitem3 = "N";
            $scope.weekitems.checkitem4 = "N";
            $scope.weekitems.checkitem5 = "N";
            $scope.weekitems.checkitem6 = "N";
        }
    };

    $scope.addCurrentSelectedSlot = function () {

        var selectedDatesArray = $filter("filter")($scope.MainTimerArray, { "IsSelectedDate": true });


        if (selectedDatesArray.length === 0) {
            alertify.error("Select Dates");
            return false;
        }



        $scope.newUserBranchTimeSlotObj.SelectedDatesArray = [];





        angular.forEach(selectedDatesArray, function (sitem) {
            console.log(sitem.FullDate);
            var obj = {
                "Date": sitem.FullDate
            };
            $scope.newUserBranchTimeSlotObj.SelectedDatesArray.push(obj);
        });


        if ($scope.endTimeHH.start == "") {
            $scope.endTimeHH.start = "00";
        }
        if ($scope.endTimeHH.end == "") {
            $scope.endTimeHH.end = "00";
        }
        if ($scope.startTimeHH.start == "") {
            $scope.startTimeHH.start = "00";
        }
        if ($scope.startTimeMM.end == "") {
            $scope.startTimeMM.end = "00";
        }




        $scope.newUserBranchTimeSlotObj.EndTime = $scope.endTimeHH.start + ':' + "00";
        $scope.newUserBranchTimeSlotObj.StartTime = $scope.startTimeHH.start + ':' + "00";


        $scope.NewAllowAllTimeSlots.WalkInStartTime = $scope.NewAllowAllTimeSlots.WalkInStartTimeHH.toString();
        $scope.NewAllowAllTimeSlots.WalkInEndTime = $scope.NewAllowAllTimeSlots.WalkInEndTimeHH.toString();
        $scope.NewAllowAllTimeSlots.OnlineStartTime = $scope.NewAllowAllTimeSlots.OnlineStartTimeHH.toString();
        $scope.NewAllowAllTimeSlots.OnlineEndTime = $scope.NewAllowAllTimeSlots.OnlineEndTimeHH.toString();
        $scope.NewAllowAllTimeSlots.TelephonicStartTime = $scope.NewAllowAllTimeSlots.TelephonicStartTimeHH.toString();
        $scope.NewAllowAllTimeSlots.TelephonicEndTime = $scope.NewAllowAllTimeSlots.TelephonicEndTimeHH.toString();

        if ($scope.NewAllowAllTimeSlots.WalkInStartTime === "" && $scope.NewAllowAllTimeSlots.OnlineStartTime === "" && $scope.NewAllowAllTimeSlots.TelephonicStartTime === "" && !$scope.newUserBranchTimeSlotObj.IsLeave) {
            alertify.error("Please select a time slot!");
            return;
        }

        $scope.newUserBranchTimeSlotObj.AllAllowSlotsObj = angular.copy($scope.NewAllowAllTimeSlots);

        if ($scope.newUserBranchTimeSlotObj.IsLeave) {
            if ($scope.newUserBranchTimeSlotObj.LeaveRemarks === "") {
                alertify.error("Please Enter Leave Remarks");
                return false;
            }




            var timeString = "";
            var totalLength = $scope.newUserBranchTimeSlotObj.SelectedDatesArray.length;

            angular.forEach(selectedDatesArray, function (bitem, index) {
                var ndate = $filter('date')(new Date(bitem.FullDate), "dd-MM-yyyy")
                console.log(ndate);
                if (index === totalLength + 1 || index === 0) {
                    timeString = ndate;
                } else {
                    timeString = timeString + "," + ndate;
                }
            });

            $scope.newUserBranchTimeSlotObj.UserTimeSlot = timeString;
            //$scope.newUserBranchTimeSlotObj.SelectedDatesArray = SelectedDatesArray||[];

            $scope.tempTimeSlotsArray.push($scope.newUserBranchTimeSlotObj);



            $scope.newUserBranchTimeSlotObj = getTimeSlotObj();
            $scope.NewAllowAllTimeSlots = GetAllowAllTimeSlots();

            angular.forEach($scope.MainTimerArray, function (aitem) {
                aitem.IsSelectedDate = false;
            });
            $scope.startTimeHH.start = "00";
            $scope.startTimeHH.end = "00";
            $scope.endTimeHH.start = "00";
            $scope.endTimeMM.end = "00";
        } else {
            if ($scope.newUserBranchTimeSlotObj.BranchId === "" || $scope.newUserBranchTimeSlotObj.BranchId === 0) {
                alertify.error("Please Select Branch");
                return false;
            }
            //$scope.newUserBranchTimeSlotObj.VisitType = $scope.newUserBranchTimeSlotObj.VisitType || "";
            //if ($scope.newUserBranchTimeSlotObj.VisitType == "") {
            //    alertify.error("Please Select Visit Type");
            //    return false;
            //}
            if ($scope.startTimeHH.start === $scope.endTimeHH.start) {
                alertify.error("Please Enter Valid End Time");
                return false;
            }


            var params = {
                "UserId": $scope.MainUserObj.BasicInfo.UserId,
                "BranchId": $scope.newUserBranchTimeSlotObj.BranchId,
                "TimeSlotsArray": [],
                "TempTimeSlots": $scope.tempTimeSlotsArray || []
            };

            angular.forEach(selectedDatesArray, function (sitem) {
                console.log(sitem.FullDate);
                //var obj = {
                //    "Date": sitem.FullDate,
                //    "StartTime": $scope.newUserBranchTimeSlotObj.StartTime,
                //    "EndTime": $scope.newUserBranchTimeSlotObj.EndTime
                //};
                //params.TimeSlotsArray.push(obj);
                if ($scope.NewAllowAllTimeSlots.WalkInStartTime !== "" && $scope.NewAllowAllTimeSlots.WalkInEndTime !== "") {
                    var obj = {
                        "Date": sitem.FullDate,
                        "StartTime": $scope.NewAllowAllTimeSlots.WalkInStartTime,
                        "EndTime": $scope.NewAllowAllTimeSlots.WalkInEndTime,
                        "VisitType": 1
                    };
                    params.TimeSlotsArray.push(obj);
                }
                if ($scope.NewAllowAllTimeSlots.OnlineStartTime !== "" && $scope.NewAllowAllTimeSlots.OnlineEndTime !== "") {
                    var obj = {
                        "Date": sitem.FullDate,
                        "StartTime": $scope.NewAllowAllTimeSlots.OnlineStartTime,
                        "EndTime": $scope.NewAllowAllTimeSlots.OnlineEndTime,
                        "VisitType": 2
                    };
                    params.TimeSlotsArray.push(obj);
                }
                if ($scope.NewAllowAllTimeSlots.TelephonicStartTime !== "" && $scope.NewAllowAllTimeSlots.TelephonicEndTime !== "") {
                    var obj = {
                        "Date": sitem.FullDate,
                        "StartTime": $scope.NewAllowAllTimeSlots.TelephonicStartTime,
                        "EndTime": $scope.NewAllowAllTimeSlots.TelephonicEndTime,
                        "VisitType": 3
                    };
                    params.TimeSlotsArray.push(obj);
                }
            });


            var timeslotduplicate = CompareDuplpicatesolts(params);
            if (timeslotduplicate === true) {
                alertify.error("Duplicate Slots");
                return false;
            }


            eHnoteMainAdminServices.checkIsUserSlotAvail(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
            function callbackgetuserbranchSuccess(resp) {
                console.log(JSON.stringify(resp));
                if (resp.isUserSlotAvailable) {


                    var timeString = "";
                    var totalLength = $scope.newUserBranchTimeSlotObj.SelectedDatesArray.length;

                    angular.forEach(selectedDatesArray, function (bitem, index) {
                        var ndate = $filter('date')(new Date(bitem.FullDate), "dd-MM-yyyy");
                        console.log(ndate);
                        if (index === totalLength + 1 || index === 0) {
                            timeString = ndate;
                        } else {
                            timeString = timeString + "," + ndate;
                        }
                    });

                    $scope.newUserBranchTimeSlotObj.UserTimeSlot = timeString;

                    $scope.tempTimeSlotsArray.push($scope.newUserBranchTimeSlotObj);



                    $scope.newUserBranchTimeSlotObj = getTimeSlotObj();
                    $scope.NewAllowAllTimeSlots = GetAllowAllTimeSlots();

                    angular.forEach($scope.MainTimerArray, function (aitem) {
                        aitem.IsSelectedDate = false;
                    });

                    $scope.weekitems.checkitem1 = "N";
                    $scope.weekitems.checkitem2 = "N";
                    $scope.weekitems.checkitem3 = "N";
                    $scope.weekitems.checkitem4 = "N";
                    $scope.weekitems.checkitem5 = "N";
                    $scope.weekitems.checkitem6 = "N";
                    $scope.month.checkitem = "N";

                    $scope.startTimeHH.start = "00";
                    $scope.startTimeHH.end = "00";
                    $scope.endTimeHH.start = "00";
                    $scope.endTimeMM.end = "00";
                } else {

                    alertify.error(resp.Message);
                }

            }
            function callbackgetuserbranchError(err) {
                alertify.error("Some Error Occured");
            }
        }






    }

    $scope.changeTimeSlotBranch = function (item) {
        item.BranchObj = item.BranchObj || "";
        if (item.BranchObj !== "") {
            item.BranchId = item.BranchObj.BranchId;
            item.BranchName = item.BranchObj.BranchName;
            item.UserBranchId = item.BranchObj.UserBranchId;
        }
    };



    $scope.saveUserTimeSlots = function () {
        console.log(JSON.stringify($scope.tempTimeSlotsArray));


        $scope.mainTimeslotArray = [];



        angular.forEach($scope.tempTimeSlotsArray, function (item) {
            console.log(item);


            if (item.IsLeave) {
                angular.forEach(item.SelectedDatesArray, function (sitem) {
                    var obj = {
                        "UserTimeSlotId": 0,
                        "BranchId": item.BranchId,
                        "UserBranchId": item.UserBranchId,
                        "SlotType": 0,
                        "IsLeave": item.IsLeave,
                        "StartTime": item.StartTime,
                        "EndTime": item.EndTime,
                        "ActiveInd": "Y",
                        "DeleteInd": "N",
                        "SlotDate": sitem.Date,
                        "LeaveRemarks": item.LeaveRemarks,
                        "VisitType": item.VisitType,
                        "AllBranches": item.AllBranches,
                        "ParentOrganizationId": $scope.newUserBasicInfoObj.ParentOrganizationId
                    };
                    console.log(obj)
                    $scope.mainTimeslotArray.push(obj);
                });
            } else {
                angular.forEach(item.SelectedDatesArray, function (sitem) {
                    if (item.AllAllowSlotsObj.WalkInStartTimeHH != '' && item.AllAllowSlotsObj.WalkInEndTimeHH != '' && (item.AllAllowSlotsObj.IsWalkIn == true)) {
                        var obj = {
                            "UserTimeSlotId": 0,
                            "BranchId": item.BranchId,
                            "UserBranchId": item.UserBranchId,
                            "SlotType": parseInt(item.SlotType),
                            "IsLeave": item.IsLeave,
                            "StartTime": item.AllAllowSlotsObj.WalkInStartTime,
                            "EndTime": item.AllAllowSlotsObj.WalkInEndTime,
                            "ActiveInd": "Y",
                            "DeleteInd": "N",
                            "SlotDate": sitem.Date,
                            "LeaveRemarks": item.LeaveRemarks,
                            "VisitType": 1,
                            "AllBranches": item.AllBranches,
                            "ParentOrganizationId": $scope.newUserBasicInfoObj.ParentOrganizationId
                        };
                        $scope.mainTimeslotArray.push(obj);
                    }
                    if (item.AllAllowSlotsObj.OnlineStartTimeHH != '' && item.AllAllowSlotsObj.OnlineEndTimeHH != '' && (item.AllAllowSlotsObj.IsOnline == true)) {
                        var obj = {
                            "UserTimeSlotId": 0,
                            "BranchId": item.BranchId,
                            "UserBranchId": item.UserBranchId,
                            "SlotType": parseInt(item.SlotType),
                            "IsLeave": item.IsLeave,
                            "StartTime": item.AllAllowSlotsObj.OnlineStartTime,
                            "EndTime": item.AllAllowSlotsObj.OnlineEndTime,
                            "ActiveInd": "Y",
                            "DeleteInd": "N",
                            "SlotDate": sitem.Date,
                            "LeaveRemarks": item.LeaveRemarks,
                            "VisitType": 2,
                            "AllBranches": item.AllBranches,
                            "ParentOrganizationId": $scope.newUserBasicInfoObj.ParentOrganizationId
                        };
                        $scope.mainTimeslotArray.push(obj);
                    }
                    if (item.AllAllowSlotsObj.TelephonicStartTimeHH != '' && item.AllAllowSlotsObj.TelephonicEndTimeHH != '' && (item.AllAllowSlotsObj.IsTelephonic == true)) {
                        var obj = {
                            "UserTimeSlotId": 0,
                            "BranchId": item.BranchId,
                            "UserBranchId": item.UserBranchId,
                            "SlotType": parseInt(item.SlotType),
                            "IsLeave": item.IsLeave,
                            "StartTime": item.AllAllowSlotsObj.TelephonicStartTime,
                            "EndTime": item.AllAllowSlotsObj.TelephonicEndTime,
                            "ActiveInd": "Y",
                            "DeleteInd": "N",
                            "SlotDate": sitem.Date,
                            "LeaveRemarks": item.LeaveRemarks,
                            "VisitType": 3,
                            "AllBranches": item.AllBranches,
                            "ParentOrganizationId": $scope.newUserBasicInfoObj.ParentOrganizationId
                        };
                        $scope.mainTimeslotArray.push(obj);
                    }

                });
            }

        });



        var params = {
            "CreatedUserId": doctorinfo.doctorid,
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "StartTime": $scope.tempTimeSlotsArray[0].StartTime,
            "EndTime": $scope.tempTimeSlotsArray[0].EndTime,
            "TimeSlotsArray": []
        }
        params.TimeSlotsArray = $scope.mainTimeslotArray;
        console.log(JSON.stringify(params));

        //return false;

        eHnoteMainAdminServices.addUpdateUserTimeSlots(params, callbackuserbranchSuccess, ccallbackuserbranchError);
        function callbackuserbranchSuccess(resp) {
            console.log(resp);
            if (resp.Status === "Success") {
                alertify.success("Time Slots Added Successfully");
                $scope.tempTimeSlotsArray = [];
                $scope.mainTimeslotArray = [];

                $scope.showAddTimeSlotDev = true;



                var newdate = new Date();
                $scope.isCurrentPreviousMonth = true;
                var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');

                var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
                var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);




                $scope.selectedDate = firstDay;


                var startDate = firstDay;
                var EndDate = lastDay;
                var DateArray = [];

                var ExtraDaysCount = 0;



                var daynumber = new Date(firstDay).getDay();




                var fullyear = newdate.getFullYear();
                var fullmonth = newdate.getMonth();

                $scope.selectedmonth = fullmonth;
                $scope.selectedyear = fullyear;



                var currentMonthFirstDate = getMonthFirstDate(firstDay);

                DateArray = getDates(currentMonthFirstDate, EndDate);
                $scope.MainTimerArray = [];
                $scope.TimerWeekArray = [];
                $scope.selectedCurrentWeek = 1;
                console.log(newdate);
                formTimerArray(DateArray, newdate);
            }


        }
        function ccallbackuserbranchError(err) {
            alertify.error("Some Error Occured");
        }

    };

    $scope.deleteTempTimeSlots = function (item, index) {
        $scope.tempTimeSlotsArray.splice(index, 1);
    }

    $scope.userBranchSlotList = [];


    function restructureUserTimeSlots() {
        var dateArray = [];
        var date = new Date();

        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var currentDate = moment(firstDay);
        var stopDate = moment(lastDay);
        while (firstDay <= lastDay) {
            var obj = "";
            if (currentDate <= stopDate) {
                obj = {
                    "FullDate": $filter('date')(new Date(currentDate), 'dd-MM-yyyy'),
                    "BranchesArray": ""
                }
            } else {
                obj = {
                    "FullDate": $filter('date')(new Date(currentDate), 'dd-MM-yyyy'),
                    "BranchesArray": ""
                }
            }



            dateArray.push(obj)
            currentDate = moment(currentDate).add(1, 'days');
        }

        return dateArray;
    }

    $scope.modifiedUserSlotsArray = [];
    $scope.getUserTimeSlots = function (firstDay, lastDay) {



        var params = {
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "FromDate": $filter('date')(new Date(firstDay), "yyyy-MM-dd"),
            "ToDate": $filter('date')(new Date(lastDay), "yyyy-MM-dd"),
            "BranchId": ($scope.newUserBranchTimeSlotObj.BranchObj !== "") ? $scope.newUserBranchTimeSlotObj.BranchObj.BranchId : 0,
            "SubOrganizationId": doctorinfo.doctordata.UserAddress[0].SubOrganizationId,
            //  "SlotTypeId": $scope.userSlotTypeId
            "SlotTypeId": 0
        }

        console.log(JSON.stringify(params));


        eHnoteMainAdminServices.getUserTimeSlots(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
        function callbackgetuserbranchSuccess(resp) {
            console.log(JSON.stringify(resp));
            if (resp.status === "Success") {
                $scope.userBranchSlotList = resp.slotsList;
                var SlotsDateArray = getMonthDates(firstDay, lastDay);
                console.log(SlotsDateArray);


                angular.forEach(SlotsDateArray, function (bitem) {
                    angular.forEach($scope.userBranchSlotList, function (sitem) {
                        if (bitem.FullDate === sitem.SlotDate) {
                            bitem.FollowUpAppointmentEndTime = sitem.FollowUpAppointmentEndTime;
                            bitem.FollowUpAppointmentMaxSlots = sitem.FollowUpAppointmentMaxSlots;
                            bitem.FollowUpAppointmentStartTime = sitem.FollowUpAppointmentStartTime;
                            bitem.FollowUpOnlineEndTime = sitem.FollowUpOnlineEndTime;
                            bitem.FollowUpOnlineStartTime = sitem.FollowUpOnlineStartTime;
                            bitem.FollowUpTeleEndTime = sitem.FollowUpTeleEndTime;
                            bitem.FollowUpTeleStartTime = sitem.FollowUpTeleStartTime;
                            bitem.FollowUpWalkinEndTime = sitem.FollowUpWalkinEndTime;
                            bitem.FollowUpWalkinStartTime = sitem.FollowUpWalkinStartTime;
                            bitem.IsFollowUpWalkinOnlineSameSlots = sitem.IsFollowUpWalkinOnlineSameSlots;
                            bitem.IsNewAppointmentWalkinOnlineTeleSameSlots = sitem.IsNewAppointmentWalkinOnlineTeleSameSlots;
                            bitem.IsNewFollowUpAscSameSlots = sitem.IsNewFollowUpAscSameSlots;
                            bitem.IsOpOTSameSlots = sitem.IsOpOTSameSlots;
                            bitem.LeaveRemarks = sitem.LeaveRemarks;
                            bitem.NewAppointmentEndTime = sitem.NewAppointmentEndTime;
                            bitem.NewAppointmentMaxSlots = sitem.NewAppointmentMaxSlots;
                            bitem.NewAppointmentOnlineEndTIme = sitem.NewAppointmentOnlineEndTIme;
                            bitem.NewAppointmentOnlineStartTime = sitem.NewAppointmentOnlineStartTime;
                            bitem.NewAppointmentStartTime = sitem.NewAppointmentStartTime;
                            bitem.NewAppointmentTeleEndTime = sitem.NewAppointmentTeleEndTime;
                            bitem.NewAppointmentTeleStartTime = sitem.NewAppointmentTeleStartTime;
                            bitem.NewAppointmentWalkinEndTime = sitem.NewAppointmentWalkinEndTime;
                            bitem.NewAppointmentWalkinStartTime = sitem.NewAppointmentWalkinStartTime;
                            bitem.OPEndTime = sitem.OPEndTime;
                            bitem.OPStartTime = sitem.OPStartTime;
                            bitem.OTAppointmentMaxSlots = sitem.OTAppointmentMaxSlots;
                            bitem.OTEndTime = sitem.OTEndTime;
                            bitem.OTStartTime = sitem.OTStartTime;
                            bitem.SlotDate = sitem.SlotDate;
                            bitem.SlotStartTime = sitem.SlotStartTime;
                            bitem.SlotEndTime = sitem.SlotEndTime;
                            bitem.SlotType = sitem.SlotType;
                            bitem.SlotTypeId = sitem.SlotTypeId;
                            bitem.UserTimeSlotId = sitem.UserTimeSlotId;
                            if (sitem.SlotTypeId === 2) {
                                //bitem.IsLeave = sitem.IsLeave;

                                if (sitem.SlotType == "Leave") {
                                    bitem.IsLeave = true;
                                }
                                bitem.UserTimeSlotId = sitem.UserTimeSlotId;
                            }

                        }
                    });
                });

                console.log(SlotsDateArray);




                $scope.modifiedUserSlotsArray = SlotsDateArray;

                console.log($scope.modifiedUserSlotsArray);


            } else {
                $scope.userBranchSlotList = [];
            }

        }
        function callbackgetuserbranchError(err) {
            alertify.error("Some Error Occured");
        }
    }


    $scope.showAddTimeSlotDev = true;


    $scope.showBranchUserSlots = function (val) {
        $scope.newUserBranchTimeSlotObj = getTimeSlotObj();
        $scope.NewAllowAllTimeSlots = GetAllowAllTimeSlots();
        $scope.startTimeHH.start = "00";
        $scope.endTimeHH.start = "";
        $scope.getEndTime(0);
        $scope.newUserBranchTimeSlotObj.BranchObj = $scope.MainUserObj.BasicInfo.UserWorkingBranches[0];
        $scope.newUserBranchTimeSlotObj.BranchId = $scope.MainUserObj.BasicInfo.UserWorkingBranches[0].BranchId;
        $scope.newUserBranchTimeSlotObj.UserBranchId = $scope.MainUserObj.BasicInfo.UserWorkingBranches[0].UserBranchId;

        console.log(val);
        $scope.showAddTimeSlotDev = !val;
        if (!$scope.showAddTimeSlotDev) {
            $scope.isCurrentPreviousMonth = true;
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


            var fullyear = date.getFullYear();
            var fullmonth = date.getMonth();

            $scope.selectedmonth = fullmonth;
            $scope.selectedyear = fullyear;
            $scope.userSlotTypeId = 1;
            $scope.isNormalSlot = true;
            $scope.getUserTimeSlots(firstDay, lastDay);
        } else {
            var newdate = new Date();
            $scope.isCurrentPreviousMonth = true;
            var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');

            var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
            var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);




            $scope.selectedDate = firstDay;


            var startDate = firstDay;
            var EndDate = lastDay;
            var DateArray = [];

            var ExtraDaysCount = 0;



            var daynumber = new Date(firstDay).getDay();


            var fullyear = newdate.getFullYear();
            var fullmonth = newdate.getMonth();

            $scope.selectedmonth = fullmonth;
            $scope.selectedyear = fullyear;


            var currentMonthFirstDate = getMonthFirstDate(firstDay);

            DateArray = getDates(currentMonthFirstDate, EndDate);
            $scope.MainTimerArray = [];
            $scope.TimerWeekArray = [];
            $scope.selectedCurrentWeek = 1;
            console.log(newdate);
            formTimerArray(DateArray, newdate);
        }
    }

    $scope.deleteParticularSlot = function (citem) {

        var slottypeid = parseFloat($scope.userSlotTypeId) || 1;
        var params = {
            "UserTimeSlotId": citem.UserTimeSlotId,
            "UserId": doctorinfo.doctorid,
            "SlotType": slottypeid
        }

        eHnoteMainAdminServices.deleteUserTimeSlots(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
        function callbackgetuserbranchSuccess(resp) {
            console.log(JSON.stringify(resp));
            if (resp.status === "Success") {

                alertify.success("Deleted Successfully");


                var date = new Date();
                var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                var fullyear = date.getFullYear();
                var fullmonth = date.getMonth();
                $scope.selectedmonth = fullmonth;
                $scope.selectedyear = fullyear;
                $scope.getUserTimeSlots(firstDay, lastDay);
            } else {
                $scope.userBranchSlotList = [];
            }

        }
        function callbackgetuserbranchError(err) {
            alertify.error("Some Error Occured");
        }
    }

    function getUserBranchCostingObj() {

        var obj = {
            "CreatedUserId": doctorinfo.doctorid,
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "UserBranchId": "",
            "BranchId": "",
            "BranchName": "",
            "BranchObj": "",
            "WalkInConsultationFeeObj": {
                "ConsultationFee": "",
                "NoOfFreeFollowUps": "",
                "FreeFollowUpsValidity": "",
                "NoOfTeleFreeFollowUps": "",
                "FreeTeleFollowUpsValidity": ""
            },
            "TeleConsultationFeeObj": {
                "ConsultationFee": "",
                "NoOfFreeFollowUps": "",
                "FreeFollowUpsValidity": "",
                "NoOfTeleFreeFollowUps": "",
                "FreeTeleFollowUpsValidity": ""
            },
            "ConsultationFeeObj": {
                "AppointmentTypeId": "12",
                "PhysicalConsultationCost": "",
                "VideoConsultationCost": "",
                "FastTrackCharges": "",
                "NoOfFreeFollowUps": "",
                "FollowUpValidityDays": ""
            },
            "IsTeleSlotsIncluded": false
        }
        return obj;
    }
    $scope.newUserBranchCostingObj = getUserBranchCostingObj();

    $scope.saveUserBranchCosting = function () {


        if ($scope.newUserBranchCostingObj.BranchId == "") {
            alertify.error("Please Select Branch");
            return false;
        }
        //$scope.newUserBranchCostingObj.WalkInConsultationFeeObj.ConsultationFee = parseFloat($scope.newUserBranchCostingObj.WalkInConsultationFeeObj.ConsultationFee) || 0;
        //$scope.newUserBranchCostingObj.TeleConsultationFeeObj.ConsultationFee = parseFloat($scope.newUserBranchCostingObj.TeleConsultationFeeObj.ConsultationFee) || 0;



        $scope.newUserBranchCostingObj.ConsultationFeeObj.PhysicalConsultationCost = parseFloat($scope.newUserBranchCostingObj.ConsultationFeeObj.PhysicalConsultationCost) || 0;
        $scope.newUserBranchCostingObj.ConsultationFeeObj.VideoConsultationCost = parseFloat($scope.newUserBranchCostingObj.ConsultationFeeObj.VideoConsultationCost) || 0;
        $scope.newUserBranchCostingObj.ConsultationFeeObj.FastTrackCharges = parseFloat($scope.newUserBranchCostingObj.ConsultationFeeObj.FastTrackCharges) || 0;
        $scope.newUserBranchCostingObj.ConsultationFeeObj.NoOfFreeFollowUps = parseFloat($scope.newUserBranchCostingObj.ConsultationFeeObj.NoOfFreeFollowUps) || 0;
        $scope.newUserBranchCostingObj.ConsultationFeeObj.FollowUpValidityDays = parseFloat($scope.newUserBranchCostingObj.ConsultationFeeObj.FollowUpValidityDays) || 0;

        var params = {
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "UserBranchId": $scope.newUserBranchCostingObj.UserBranchId,
            "BranchId": $scope.newUserBranchCostingObj.BranchId,
            //"WalkInConsultationFeeObj": $scope.newUserBranchCostingObj.WalkInConsultationFeeObj,
            //"TeleConsultationFeeObj": $scope.newUserBranchCostingObj.TeleConsultationFeeObj,
            "ConsultationFeeObj": $scope.newUserBranchCostingObj.ConsultationFeeObj
        };


        console.log(JSON.stringify(params));
        //return false;

        eHnoteMainAdminServices.addUpdateUserBranchCosting(params, callbackuserbranchSuccess, callbackuserbranchError);
        function callbackuserbranchSuccess(resp) {

            console.log(resp);
            $scope.MainUserObj.UserBranchRolesnRights = [];
            if (resp.status === "Success") {
                alertify.success("User Data Updated Successfully");
                $scope.MainUserObj.UserBranchRolesnRights = resp.UserBranchDetails;
                $scope.newUserBranchCostingObj = getUserBranchCostingObj();
            }

        }
        function callbackuserbranchError(err) {
            alertify.error("Some Error Occured");
        }
    }
    $scope.userInfoType = "0";
    $scope.userProfileType = "0";
    $scope.addUserChange = function (userInfoType) {
        $scope.userInfoType = userInfoType;
    };

    $scope.addEduction = function () {
        $scope.eductionInfoArray.push($scope.userEducationInfo);
        $scope.resetEductionInfoObject();
    };
    $scope.userEducationInfo = getEductionInfoObject();
    $scope.eductionInfoArray = [];
    var i = 1;
    function getEductionInfoObject() {
        i++;
        var obj = {
            "Id": i,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
            "degree": "",
            "institute": "",
            "durationFrom": "",
            "durationTo": ""
        }
        return obj;
    }
    $scope.resetEductionInfoObject = function () {
        $scope.userEducationInfo = getEductionInfoObject();
    };

    $scope.userMembershipInfo = getMembershipInfoObject();
    $scope.membershipInfoArray = [];
    function getMembershipInfoObject() {
        i++;
        var membershipObj = {
            "Id": i,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
            "membership": ""
        }
        return membershipObj;
    };
    $scope.resetMembershipInfoObject = function () {
        $scope.userMembershipInfo = getMembershipInfoObject();
    };
    $scope.addMembership = function () {
        $scope.membershipInfoArray.push($scope.userMembershipInfo);
        $scope.resetMembershipInfoObject();
    };
    $scope.specialityId = "";
    eHnoteUserDataService.getspeciality(onsuccess, onfailure);
    function onsuccess(data) {
        $scope.specialitylist = data;
    }
    function onfailure(data) {
    }

    $scope.userSpecialityInfo = getSpecialityInfoObject();
    $scope.SpecialityInfoArray = [];
    function getSpecialityInfoObject() {
        i++;
        var specialityObj = {
            "Id": i,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
            "specialityId": "",
            "speciality": "",
            "subSpeciality": ""
        }
        return specialityObj;
    };
    $scope.resetSpecialityInfoObject = function () {
        $scope.userSpecialityInfo = getSpecialityInfoObject();
    };
    $scope.addSpeciality = function () {
        $scope.SpecialityInfoArray.push($scope.userSpecialityInfo);
        $scope.resetSpecialityInfoObject();
    };
    //$scope.changeSpeciality = function () {
    //    var SelectedItems = $filter("filter")($scope.specialitylist, { "ClinicId": item.HospitalId }, true);
    //};
    $scope.userServicesInfo = getServiceInfoObject();
    $scope.serviceInfoArray = [];
    function getServiceInfoObject() {
        i++;
        var serviceObj = {
            "Id": i,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
            "service": ""
        }
        return serviceObj;
    };
    $scope.resetserviceInfoObject = function () {
        $scope.userServicesInfo = getServiceInfoObject();
    };
    $scope.addService = function () {
        $scope.serviceInfoArray.push($scope.userServicesInfo);
        $scope.resetserviceInfoObject();
    };

    $scope.userAchivementsInfo = getAchivementsInfoObject();
    $scope.achivementsInfoArray = [];
    function getAchivementsInfoObject() {
        i++;
        var achivementsObj = {
            "Id": i,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
            "achivement": ""
        }
        return achivementsObj;
    };
    $scope.resetAchivementInfoObject = function () {
        $scope.userAchivementsInfo = getAchivementsInfoObject();
    };
    $scope.addService = function () {
        $scope.achivementsInfoArray.push($scope.userAchivementsInfo);
        $scope.resetAchivementInfoObject();
    };

    $scope.userPublicationInfo = getPublicationInfoObject();
    $scope.publicationInfoArray = [];
    function getPublicationInfoObject() {
        i++;
        var publicationObj = {
            "Id": i,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
            "publication": ""
        }
        return publicationObj;
    };
    $scope.resetPublicationInfoObject = function () {
        $scope.userPublicationInfo = getPublicationInfoObject();
    };
    $scope.addPublications = function () {
        $scope.publicationInfoArray.push($scope.userPublicationInfo);
        $scope.resetPublicationInfoObject();
    };

    $scope.userAwardsInfo = getAwardInfoObject();
    $scope.awardInfoArray = [];
    function getAwardInfoObject() {
        i++;
        var awardObj = {
            "Id": i,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
            "award": ""
        }
        return awardObj;
    };
    $scope.resetAwardInfoObject = function () {
        $scope.userAwardsInfo = getAwardInfoObject();
    };
    $scope.addAward = function () {
        $scope.awardInfoArray.push($scope.userAwardsInfo);
        $scope.resetAwardInfoObject();
    };


    $scope.changeUserslotType = function (type) {

        $scope.isCurrentPreviousMonth = true;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


        var fullyear = date.getFullYear();
        var fullmonth = date.getMonth();

        $scope.selectedmonth = fullmonth;
        $scope.selectedyear = fullyear;
        $scope.userSlotTypeId = type;
        $scope.getUserTimeSlots(firstDay, lastDay);

    }

    $scope.cancelUserProfile = function () {
        $scope.newUserBasicInfoObj = getNewUserBasicInfoObject();
        $scope.switchUserTab('userList');
    };

    $scope.CopyUserMailingAddress = function (SameAddress) {

        if (SameAddress == true) {
            $scope.newUserBasicInfoObj.PhysicalAddress.AddressLine1 = $scope.newUserBasicInfoObj.MailingAddress.AddressLine1;
            $scope.newUserBasicInfoObj.PhysicalAddress.AddressLine2 = $scope.newUserBasicInfoObj.MailingAddress.AddressLine2;

            $scope.newUserBasicInfoObj.PhysicalAddress.CityName = $scope.newUserBasicInfoObj.MailingAddress.CityName;
            $scope.newUserBasicInfoObj.PhysicalAddress.CityId = $scope.newUserBasicInfoObj.MailingAddress.CityId;

            $scope.newUserBasicInfoObj.PhysicalAddress.StateName = $scope.newUserBasicInfoObj.MailingAddress.StateName;
            $scope.newUserBasicInfoObj.PhysicalAddress.StateId = $scope.newUserBasicInfoObj.MailingAddress.StateId;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryName = $scope.newUserBasicInfoObj.MailingAddress.CountryName;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryId = $scope.newUserBasicInfoObj.MailingAddress.CountryId;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyName = $scope.newUserBasicInfoObj.MailingAddress.CountyName;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyId = $scope.newUserBasicInfoObj.MailingAddress.CountyId;
            $scope.newUserBasicInfoObj.PhysicalAddress.ZipCode = $scope.newUserBasicInfoObj.MailingAddress.Zipcode;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyCodeObj = $scope.newUserBasicInfoObj.MailingAddress.CountyCodeObj;

        } else {

            $scope.newUserBasicInfoObj.PhysicalAddress.AddressLine1 = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.AddressLine2 = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.CityName = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.CityId = 0;
            $scope.newUserBasicInfoObj.PhysicalAddress.StateName = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.StateId = 0;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryName = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryId = 0;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyName = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyId = 0;
            $scope.newUserBasicInfoObj.PhysicalAddress.ZipCode = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyCodeObj = "";

        }
    }


    $scope.ChangeSignOffPWDInd = function (checkitem) {
        $scope.newUserBasicInfoObj.SignOffPWDInd = checkitem;
        $scope.newUserBasicInfoObj.SignOffPassword = "";
    }

    $scope.OnCity = function (item) {
        $scope.newUserBasicInfoObj.MailingAddress.CityName = item.CityName || "";
        $scope.newUserBasicInfoObj.MailingAddress.CityId = item.CityId;

        eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
            if (resp.data.length > 0) {


                $scope.newUserBasicInfoObj.MailingAddress.StateName = resp.data[0].StateName;
                $scope.newUserBasicInfoObj.MailingAddress.StateId = resp.data[0].StateId;
                $scope.newUserBasicInfoObj.MailingAddress.CountryName = resp.data[0].CountryName;
                $scope.newUserBasicInfoObj.MailingAddress.CountryId = resp.data[0].CountryId;

            }

        });
    }

    $scope.changeCity1 = function (type) {
        if (type == "") {
            $scope.newUserBasicInfoObj.MailingAddress.CityName = "";
            $scope.newUserBasicInfoObj.MailingAddress.CityId = 0;

        }
    }


    $scope.ONchangeState = function (item, type) {
        if (type === "Mailing") {
            $scope.newUserBasicInfoObj.MailingAddress.StateName = item.Name;
            $scope.newUserBasicInfoObj.MailingAddress.StateId = item.StateId;
            $scope.newUserBasicInfoObj.MailingAddress.CityName = "";
        } else {
            $scope.newUserBasicInfoObj.PhysicalAddress.StateName = item.Name;
            $scope.newUserBasicInfoObj.PhysicalAddress.StateId = item.StateId;
            $scope.newUserBasicInfoObj.PhysicalAddress.CityName = "";
        }
    }

    $scope.changeState1 = function (type) {
        if (type == "") {
            $scope.newUserBasicInfoObj.MailingAddress.StateName = "";
            $scope.newUserBasicInfoObj.MailingAddress.StateId = 0;

        }
    }

    $scope.ONchangeCountry = function (item, type) {
        if (type === "Mailing") {
            $scope.newUserBasicInfoObj.MailingAddress.CountryName = item.Name;
            $scope.newUserBasicInfoObj.MailingAddress.CountryId = item.CountryId;
        } else {
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryName = item.Name;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryId = item.CountryId;

        }
    }

    $scope.changeCountry1 = function (type) {
        if (type == "") {
            $scope.newUserBasicInfoObj.MailingAddress.CountryName = "";
            $scope.newUserBasicInfoObj.MailingAddress.CountryId = 0;

        }
    }
    $scope.getAddedCities = function (val) {
        var params = {

            "UserId": doctorinfo.doctorid,
            "SearchText": val,
            "StateId": ""
        };

        return eHnotePatientDataService.getFrequentlyUsedCitiesByUserId(params).then(function (resp) {

            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };
    $scope.countyCodesArray = [];
    $scope.changeZipCode = function (val, type) {
        val = val || "";
        if (val.length >= 5) {
            eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    var basedZipcode = resp.data.rows || [];
                    if (basedZipcode.length !== 0) {

                        $scope.newUserBasicInfoObj.MailingAddress.CityName = basedZipcode[0].CityName;
                        $scope.newUserBasicInfoObj.MailingAddress.CityId = basedZipcode[0].CityId;
                        $scope.newUserBasicInfoObj.MailingAddress.StateName = basedZipcode[0].StateName;
                        $scope.newUserBasicInfoObj.MailingAddress.StateId = basedZipcode[0].StateId;
                        $scope.newUserBasicInfoObj.MailingAddress.CountryName = basedZipcode[0].CountryName;
                        $scope.newUserBasicInfoObj.MailingAddress.CountryId = basedZipcode[0].CountryId;
                        //$scope.newUserBasicInfoObj.MailingAddress.CountyName = basedZipcode[0].CountyName;
                        //$scope.newUserBasicInfoObj.MailingAddress.CountyId = basedZipcode[0].CountyId;
                        $scope.searchCountyByZipCode(val);
                    }
                }
            });
        }

        else {
            $scope.newUserBasicInfoObj.MailingAddress.CityId = 0;
            $scope.newUserBasicInfoObj.MailingAddress.CityName = "";
            $scope.newUserBasicInfoObj.MailingAddress.StateName = "";
            $scope.newUserBasicInfoObj.MailingAddress.StateId = 0;
            $scope.newUserBasicInfoObj.MailingAddress.CountryName = "";
            $scope.newUserBasicInfoObj.MailingAddress.CountryId = 0;
            $scope.newUserBasicInfoObj.MailingAddress.CountyName = "";
            $scope.newUserBasicInfoObj.MailingAddress.CountyId = 0;
            $scope.newUserBasicInfoObj.MailingAddress.CountyCodeObj = "";
        }
    }

    $scope.searchCountyByZipCode = function (zipcode) {
        eHnoteSettingsDataService.getCountiesByZipCode(zipcode).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.countyCodesArray = resp.data.rows || [];
                $scope.newUserBasicInfoObj.MailingAddress.CountyName = resp.data.rows[0].CountyName;
                $scope.newUserBasicInfoObj.MailingAddress.CountyId = resp.data.rows[0].CountyId;
            }
        });
    };
    $scope.ONchangeCounty = function (item, type) {
        if (type === "Mailing") {
            $scope.newUserBasicInfoObj.MailingAddress.CountyName = item.CountyName;
            $scope.newUserBasicInfoObj.MailingAddress.CountyId = item.CountyId;
        } else {
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyName = item.CountyName;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyId = item.CountyId;
        }
    }
    $scope.ChangeCounty = function (item, subitem, type) {
        subitem.CountyCodeObj = subitem.CountyCodeObj || "";
        if (type === "Mailing") {
            item.newUserBasicInfoObj.CountyName = subitem.CountyCodeObj.CountyName;
            item.newUserBasicInfoObj.CountyId = subitem.CountyCodeObj.CountyId;
        } else {
            item.PhysicalAddress.CountyName = subitem.CountyCodeObj.CountyName;
            item.PhysicalAddress.CountyId = subitem.CountyCodeObj.CountyId;
        }
    }


    $scope.OnCity1 = function (item) {
        $scope.newUserBasicInfoObj.PhysicalAddress.CityName = item.CityName || "";
        $scope.newUserBasicInfoObj.PhysicalAddress.CityId = item.CityId;

        eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
            if (resp.data.length > 0) {


                $scope.newUserBasicInfoObj.PhysicalAddress.StateName = resp.data[0].StateName;
                $scope.newUserBasicInfoObj.PhysicalAddress.StateId = resp.data[0].StateId;
                $scope.newUserBasicInfoObj.PhysicalAddress.CountryName = resp.data[0].CountryName;
                $scope.newUserBasicInfoObj.PhysicalAddress.CountryId = resp.data[0].CountryId;

            }
        });
    }
    $scope.changeCity2 = function (type) {
        if (type == "") {
            $scope.newUserBasicInfoObj.PhysicalAddress.CityName = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.CityId = 0;

        }
    }

    $scope.ONchangeState1 = function (item, type) {
        if (type === "Physical") {
            $scope.newUserBasicInfoObj.PhysicalAddress.StateName = item.Name;
            $scope.newUserBasicInfoObj.PhysicalAddress.StateId = item.StateId;
            $scope.newUserBasicInfoObj.PhysicalAddress.CityName = "";
        }
        else {
            $scope.newUserBasicInfoObj.MailingAddress.StateName = item.Name;
            $scope.newUserBasicInfoObj.MailingAddress.StateId = item.StateId;
            $scope.newUserBasicInfoObj.MailingAddress.CityName = "";
        }
    }


    $scope.changeState2 = function (type) {
        if (type == "") {
            $scope.newUserBasicInfoObj.PhysicalAddress.StateName = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.StateId = 0;

        }
    }

    $scope.ONchangeCountry1 = function (item, type) {
        if (type === "Physical") {
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryName = item.Name;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryId = item.CountryId;
        } else {
            $scope.newUserBasicInfoObj.MailingAddress.CountryName = item.Name;
            $scope.newUserBasicInfoObj.MailingAddress.CountryId = item.CountryId;

        }
    }


    $scope.changeCounrty2 = function (type) {
        if (type == "") {
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryName = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryId = 0;

        }
    }

    $scope.getAddedCities1 = function (val) {
        var params = {

            "UserId": doctorinfo.doctorid,
            "SearchText": val,
            "StateId": ""
        };

        return eHnotePatientDataService.getFrequentlyUsedCitiesByUserId(params).then(function (resp) {

            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };
    $scope.Allstates1 = [];

    $scope.states = eHnotePatientAddressDataServices.getStates(hospitalId, getstatesSuccess, getstatesFailed);
    function getstatesSuccess(data) {
        $scope.Allstates1 = data;
    }
    function getstatesFailed(data) {
    }
    $scope.countyCodesArray = [];
    $scope.changeZipCode1 = function (val) {
        val = val || "";
        if (val.length >= 5) {
            eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    var basedZipcode = resp.data.rows || [];
                    if (basedZipcode.length !== 0) {

                        $scope.newUserBasicInfoObj.PhysicalAddress.CityName = basedZipcode[0].CityName;
                        $scope.newUserBasicInfoObj.PhysicalAddress.CityId = basedZipcode[0].CityId;
                        $scope.newUserBasicInfoObj.PhysicalAddress.StateName = basedZipcode[0].StateName;
                        $scope.newUserBasicInfoObj.PhysicalAddress.StateId = basedZipcode[0].StateId;
                        $scope.newUserBasicInfoObj.PhysicalAddress.CountryName = basedZipcode[0].CountryName;
                        $scope.newUserBasicInfoObj.PhysicalAddress.CountryId = basedZipcode[0].CountryId;
                        //$scope.newUserBasicInfoObj.PhysicalAddress.CountyName = basedZipcode[0].CountyName;
                        //$scope.newUserBasicInfoObj.PhysicalAddress.CountyId = basedZipcode[0].CountyId;
                        $scope.searchCountyByZipCode1(val);


                    }
                }
            });
        }
        else {
            $scope.newUserBasicInfoObj.PhysicalAddress.CityName = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.CityId = 0;
            $scope.newUserBasicInfoObj.PhysicalAddress.StateName = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.StateId = 0;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryName = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.CountryId = 0;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyName = "";
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyId = 0;

        }

    }

    $scope.searchCountyByZipCode1 = function (zipcode) {
        eHnoteSettingsDataService.getCountiesByZipCode(zipcode).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.countyCodesArray = resp.data.rows || [];
                $scope.newUserBasicInfoObj.PhysicalAddress.CountyName = resp.data.rows[0].CountyName;
                $scope.newUserBasicInfoObj.PhysicalAddress.CountyId = resp.data.rows[0].CountyId;
            }
        });
    };
    $scope.ONchangeCounty1 = function (item, type) {
        if (type === "Physical") {
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyName = item.CountyName;
            $scope.newUserBasicInfoObj.PhysicalAddress.CountyId = item.CountyId;
        }
    }


    $scope.changeSuffix = function (Suffixid) {
        if (Suffixid === null) {
            $scope.newUserBasicInfoObj.SuffixId = 0;
        }
    }

    $scope.AllCountryCodeList = [];
    $scope.countries = eHnotePatientAddressDataServices.getCountries(getcountriesSuccess, getcountriesFailed);
    function getcountriesSuccess(data) {
        $scope.Allcountries = data;

        $scope.AllCountryCodeList = [];
        angular.forEach($scope.Allcountries, function (citem) {
            citem.InternationalDialing = citem.InternationalDialing || "";
            if (citem.InternationalDialing != '') {
                $scope.AllCountryCodeList.push(citem);
            }
        });
        $scope.Allcountries = _.uniq($scope.Allcountries, false, function (p) { return p.InternationalDialing; });
    }
    function getcountriesFailed(data) {
    }



    function newSignatureObj() {
        var obj = {
            "SignatureOfUser": "",
            "SigantureId": 1,
            "DoctorSpecialization": "",
            "DoctorDesignation": "",
            "EncryptedUserSign": ""
        };
        return obj;
    }
    $scope.Sign = newSignatureObj();
    //$scope.SignatureOfUserBase64Code = "";
    $scope.PreviewImage = "";
    $scope.clear = function () {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, 180, 60);
        // $scope.Sign.SignatureOfUser = "";
    };
    $scope.saveDraw = function () {
        $scope.Sign.SignatureOfUser = "";
        $scope.Sign.EncryptedUserSign = "";
        var canvas = document.getElementById('canvas');

        var sign = canvas.toDataURL();

        if (sign !== "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAA8CAYAAADPLpCHAAABLklEQVR4Xu3SAQ0AAAjDMO7fND6W4uCjO6dAqMBCW0xR4ICGIFUA6NQ7jQGagVQBoFPvNAZoBlIFgE690xigGUgVADr1TmOAZiBVAOjUO40BmoFUAaBT7zQGaAZSBYBOvdMYoBlIFQA69U5jgGYgVQDo1DuNAZqBVAGgU+80BmgGUgWATr3TGKAZSBUAOvVOY4BmIFUA6NQ7jQGagVQBoFPvNAZoBlIFgE690xigGUgVADr1TmOAZiBVAOjUO40BmoFUAaBT7zQGaAZSBYBOvdMYoBlIFQA69U5jgGYgVQDo1DuNAZqBVAGgU+80BmgGUgWATr3TGKAZSBUAOvVOY4BmIFUA6NQ7jQGagVQBoFPvNAZoBlIFgE690xigGUgVADr1TmOAZiBVAOjUO415zC4APTuPaa4AAAAASUVORK5CYII=") {
            $scope.Sign.SignatureOfUser = sign;
        }
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, 180, 60);
    };




    $scope.onSelectFilesUpload = function (files) {

        if (files.length == 0 || files == undefined) {
            alertify.error("Upload Below 2 MB");
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        // Check if file is present and matches one of the allowed types
        if (!allowedTypes.includes(files[0].type)) {
            alert("Please upload a valid JPEG,JPG or PNG image file.");
            files = null;
            return;
        }
        if (files === null) {
            return;
        }

        $scope.Sign.SignaturteOfUser = "";
        if (files.length != 0 && files.length != undefined) {
            $scope.getBase64(files[0]);
        }

    };

    $scope.changeSignaturePattern = function (type) {
        $scope.Sign.SigantureId = type;
        $scope.signPlusObj.readyToSign = false;
    }

    $scope.toDataURL = function (dataURL, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', dataURL);
        xhr.responseType = 'blob';
        xhr.send();
    };

    $scope.dataURIToBlob = function (dataURI, callback) {
        var binStr = atob(dataURI.split(',')[1]),
            len = binStr.length,
            arr = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
        }
        callback(new Blob([arr], {
            type: 'image/png'
        }));
    };

    $scope.getBase64 = function (file, callback) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            //  console.log("base64" + reader.result);
            $scope.Sign.SignatureOfUser = reader.result;
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    $scope.changesignature = function () {
        $scope.Sign.SignatureOfUser = "";
        $scope.SignatureOfUserBase64Code = "";
    }

    function CompareDuplpicatesolts(paramobj) {
        var timesoltarray = angular.copy(paramobj.TimeSlotsArray) || [];
        var temptimesoltarray = angular.copy($scope.tempTimeSlotsArray) || [];
        var timeslotduplicate = false;
        if (temptimesoltarray.length > 0) {
            angular.forEach(timesoltarray, function (titem1) {
                titem1.tempstarttime = titem1.StartTime.replace(":", "");
                titem1.tempendtime = titem1.EndTime.replace(":", "");

                if (!timeslotduplicate) {
                    angular.forEach(temptimesoltarray, function (titem2, index) {
                        angular.forEach(titem2.SelectedDatesArray, function (titem3) {

                            if (titem1.Date === titem3.Date) {
                                titem2.tempstarttime = titem2.StartTime.replace(":", "");
                                titem2.tempendtime = titem2.EndTime.replace(":", "");

                                if ((parseInt(titem2.tempstarttime) <= parseInt(titem1.tempstarttime)) && (parseInt(titem1.tempstarttime) <= parseInt(titem2.tempendtime))) {
                                    timeslotduplicate = true;
                                    return false;
                                }
                                if ((parseInt(titem2.tempstarttime) <= parseInt(titem1.tempendtime)) && (parseInt(titem1.tempendtime) <= parseInt(titem2.tempendtime))) {
                                    timeslotduplicate = true;
                                    return false;
                                }

                            }

                        });
                    });
                }

                //if (timeslotduplicate === true) {
                //    return false;
                //}
            });
        }

        return timeslotduplicate;

    }

    $scope.WalkIngetEndTime = function (val) {
        $scope.WalkInEndValues = [];
        var val1 = 24;
        if ($scope.endTimeHH.start == '00') {
            val1 = 24;
        } else if ($scope.endTimeHH.start !== '00') {
            val1 = $scope.endTimeHH.start;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.WalkInEndValues.push({ 'time': i });
            } else {
                $scope.WalkInEndValues.push({ 'time': '0' + i });
            }
        }
        var tempTimeArray = [];
        angular.forEach($scope.WalkInEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.WalkInEndValues = angular.copy(tempTimeArray);
        if ($scope.WalkInEndValues.length > 0) {

            $scope.NewAllowAllTimeSlots.WalkInEndTimeHH = $scope.endTimeHH.start.toString() + ':' + "00";

        } else {
            $scope.NewAllowAllTimeSlots.WalkInEndTimeHH = '';
        }

    };


    $scope.OnlinegetEndTime = function (val) {
        //var walkinendtime = parseInt($scope.NewAllowAllTimeSlots.WalkInEndTimeHH.replace(":", ""));
        //var onlineval = parseInt(val.replace(":", ""));
        //if ($scope.NewAllowAllTimeSlots.TelephonicEndTimeHH !== "") {
        //    var telephonicendtime = parseInt($scope.NewAllowAllTimeSlots.TelephonicEndTimeHH.replace(":", ""));
        //} else {
        //    var telephonicendtime = 0;
        //}
        //if ($scope.NewAllowAllTimeSlots.TelephonicStartTimeHH !== "") {
        //    var telephonicstarttime = parseInt($scope.NewAllowAllTimeSlots.TelephonicStartTimeHH.replace(":", ""));
        //} else {
        //    var telephonicstarttime = 0;
        //}
        //if (onlineval < walkinendtime || (onlineval >= telephonicstarttime && onlineval < telephonicendtime)) {
        //    $scope.NewAllowAllTimeSlots.OnlineStartTimeHH = "";
        //    alertify.error("This slot is already selected!");
        //    return;
        //}
        $scope.OnlineEndValues = [];
        var val1 = 24;
        if ($scope.endTimeHH.start == '00') {
            val1 = 24;
        } else if ($scope.endTimeHH.start !== '00') {
            val1 = $scope.endTimeHH.start;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.OnlineEndValues.push({ 'time': i });
            } else {
                $scope.OnlineEndValues.push({ 'time': '0' + i });
            }
        }
        var tempTimeArray = [];
        angular.forEach($scope.OnlineEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.OnlineEndValues = angular.copy(tempTimeArray);
        if ($scope.OnlineEndValues.length > 0) {
            //  $scope.NewAllowAllTimeSlots.OnlineEndTimeHH = $scope.OnlineEndValues[0].time.toString();
            $scope.NewAllowAllTimeSlots.OnlineEndTimeHH = $scope.endTimeHH.start.toString() + ':' + "00";
            //$scope.NewAllowAllTimeSlots.OnlineEndTimeMM = $scope.endTimeMM.end.toString();
        } else {
            $scope.NewAllowAllTimeSlots.OnlineEndTimeHH = '';
        }
    };
    $scope.TelephonicgetEndTime = function (val) {
        //var walkinendtime = parseInt($scope.NewAllowAllTimeSlots.WalkInEndTimeHH.replace(":", ""));
        //if ($scope.NewAllowAllTimeSlots.OnlineEndTimeHH !== "") {
        //    var onlineendtime = parseInt($scope.NewAllowAllTimeSlots.OnlineEndTimeHH.replace(":", ""));
        //} else {
        //    var onlineendtime = 0;
        //}
        //if ($scope.NewAllowAllTimeSlots.OnlineStartTimeHH !== "") {
        //    var onlinestarttime = parseInt($scope.NewAllowAllTimeSlots.OnlineStartTimeHH.replace(":", ""));
        //} else {
        //    var onlinestarttime = 0;
        //}

        //var onlinestarttime = parseInt($scope.NewAllowAllTimeSlots.OnlineStartTimeHH.replace(":", ""));
        //var telval = parseInt(val.replace(":", ""));
        //if (telval < walkinendtime || (telval >= onlinestarttime && telval < onlineendtime)) {
        //    $scope.NewAllowAllTimeSlots.TelephonicStartTimeHH = "";
        //    alertify.error("This slot is already selected!");
        //    return;
        //}
        $scope.TelephonicEndValues = [];
        var val1 = 24;
        if ($scope.endTimeHH.start == '00') {
            val1 = 24;
        } else if ($scope.endTimeHH.start !== '00') {
            val1 = $scope.endTimeHH.start;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.TelephonicEndValues.push({ 'time': i });
            } else {
                $scope.TelephonicEndValues.push({ 'time': '0' + i });
            }
        }
        var tempTimeArray = [];
        angular.forEach($scope.TelephonicEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.TelephonicEndValues = angular.copy(tempTimeArray);
        if ($scope.TelephonicEndValues.length > 0) {
            // $scope.NewAllowAllTimeSlots.TelephonicEndTimeHH = $scope.TelephonicEndValues[0].time.toString();
            $scope.NewAllowAllTimeSlots.TelephonicEndTimeHH = $scope.endTimeHH.start.toString() + ':' + "00";
            //$scope.NewAllowAllTimeSlots.TelephonicEndTimeMM = $scope.endTimeMM.end.toString();
        } else {
            $scope.NewAllowAllTimeSlots.TelephonicEndTimeHH = '';
        }
        //$scope.NewAllowAllTimeSlots.OnlineStartTimeHH = "";
        //$scope.NewAllowAllTimeSlots.OnlineEndTimeHH = "";
    };
    function getStartTimeInAllowSlots(val) {
        val = val || 0;
        $scope.AllowSlotsStartValues = [];
        $scope.NewAllowAllTimeSlots.AllVisitTypeSlots = true;
        $scope.NewAllowAllTimeSlots.IsWalkIn = true;
        $scope.NewAllowAllTimeSlots.IsOnline = true;
        $scope.NewAllowAllTimeSlots.IsTelephonic = true;
        var val1 = 24;
        if ($scope.endTimeHH.start == '00') {
            val1 = 24;
        } else if ($scope.endTimeHH.start !== '00') {
            val1 = $scope.endTimeHH.start;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.AllowSlotsStartValues.push({ 'time': i });
            }
            else {
                $scope.AllowSlotsStartValues.push({ 'time': '0' + i });
            }
        }
        // new code
        var tempTimeArray = [];
        angular.forEach($scope.AllowSlotsStartValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.AllowSlotsStartValues = angular.copy(tempTimeArray);


        $scope.newUserTimeSlotObj.SlotStartTime = $scope.startTimeHH.start.toString() + ':' + "00";
        $scope.newUserTimeSlotObj.SlotEndTime = $scope.endTimeHH.start.toString() + ':' + "00";

    };


    $scope.changeEndTimeSlot = function () {
        getStartTimeInAllowSlots($scope.startTimeHH.start);
    };
    $scope.ChangeAllAllowSlotsModes = function () {
        if ($scope.NewAllowAllTimeSlots.AllVisitTypeSlots) {
            getStartTimeInAllowSlots($scope.startTimeHH.start);
            $scope.NewAllowAllTimeSlots.IsWalkIn = true;
            $scope.NewAllowAllTimeSlots.IsOnline = true;
            $scope.NewAllowAllTimeSlots.IsTelephonic = true;
        }
    };
    $scope.changeWalkInCheck = function (checked) {
        if (checked == false) {
            $scope.NewAllowAllTimeSlots.WalkInStartTimeHH = "";
            //$scope.NewAllowAllTimeSlots.WalkInStartTimeMM = "";
            $scope.NewAllowAllTimeSlots.WalkInEndTimeHH = "";
            //$scope.NewAllowAllTimeSlots.WalkInEndTimeMM = "";
        } else {
            $scope.NewAllowAllTimeSlots.WalkInStartTimeHH = $scope.startTimeHH.start.toString() + ":" + "00";
            //$scope.NewAllowAllTimeSlots.WalkInStartTimeMM = $scope.startTimeMM.end.toString();
            $scope.WalkIngetEndTime($scope.startTimeHH.start);
        }
    };
    $scope.ChangeOnlinecheck = function (checked) {
        if (checked == false) {
            $scope.NewAllowAllTimeSlots.OnlineStartTimeHH = "";
            //$scope.NewAllowAllTimeSlots.OnlineStartTimeMM = "";
            $scope.NewAllowAllTimeSlots.OnlineEndTimeHH = "";
            //$scope.NewAllowAllTimeSlots.OnlineEndTimeMM = "";
        } else {
            $scope.NewAllowAllTimeSlots.OnlineStartTimeHH = $scope.startTimeHH.start.toString();
            //$scope.NewAllowAllTimeSlots.OnlineStartTimeMM = $scope.startTimeMM.end.toString();
            $scope.OnlinegetEndTime($scope.startTimeHH.start);
        }
    };
    $scope.changeTelephonicCheck = function (checked) {
        if (checked == false) {
            $scope.NewAllowAllTimeSlots.TelephonicStartTimeHH = "";
            $scope.NewAllowAllTimeSlots.TelephonicStartTimeMM = "";
            $scope.NewAllowAllTimeSlots.TelephonicEndTimeHH = "";
            $scope.NewAllowAllTimeSlots.TelephonicEndTimeMM = "";
        } else {
            $scope.NewAllowAllTimeSlots.TelephonicStartTimeHH = $scope.startTimeHH.start.toString() + ":" + "00";
            $scope.NewAllowAllTimeSlots.TelephonicStartTimeMM = $scope.startTimeMM.end.toString();
            $scope.TelephonicgetEndTime($scope.startTimeHH.start);
        }
    };
    $scope.changeMinSlots = function (type) {
        if (type === 'start') {
            $scope.NewAllowAllTimeSlots.WalkInStartTimeMM = $scope.startTimeMM.end.toString();
            $scope.NewAllowAllTimeSlots.OnlineStartTimeMM = $scope.startTimeMM.end.toString();
            $scope.NewAllowAllTimeSlots.TelephonicStartTimeMM = $scope.startTimeMM.end.toString();

            $scope.changeAllowstartMintes();
        } else if (type === 'end') {
            $scope.NewAllowAllTimeSlots.TelephonicEndTimeMM = $scope.endTimeMM.end.toString();
            $scope.NewAllowAllTimeSlots.OnlineEndTimeMM = $scope.endTimeMM.end.toString();
            $scope.NewAllowAllTimeSlots.WalkInEndTimeMM = $scope.endTimeMM.end.toString();

            $scope.changeAllowendMintes();
        }
    };

    // $scope.AllowminutesValues = [];
    $scope.changeAllowstartMintes = function () {
        var val = parseInt($scope.startTimeMM.end) || 0;
        var val1 = 45;//parseInt($scope.endTimeMM.end) || 0;
        $scope.AllowminutesValues = [];

        while (val <= val1) {
            if (val == 0) {
                $scope.AllowminutesValues.push({ 'mins': '00' });
            } else {
                $scope.AllowminutesValues.push({ 'mins': val.toString() });
            }
            val = parseInt(val) + parseInt($scope.hospital.minpercase);//15;
        }

    };
    // $scope.AllowminutesValues1 = [];
    $scope.changeAllowendMintes = function () {
        var val = 0;//parseInt($scope.endTimeMM.end) || 0;
        var val1 = parseInt($scope.endTimeMM.end) || 0;
        $scope.AllowminutesValues1 = [];

        while (val <= val1) {
            if (val == 0) {
                $scope.AllowminutesValues1.push({ 'mins': '00' });
            } else {
                $scope.AllowminutesValues1.push({ 'mins': val.toString() });
            }
            val = parseInt(val) + parseInt($scope.hospital.minpercase);//15;
        }

    };



    function getnewUserBranchRoomsObj() {
        var obj = {
            "UserBranchRoomId": "",
            "HospitalId": "",
            "HospitalObj": "",
            "RoomTypeId": "",
            "RoomId": "",
            "DoctorId": $scope.MainUserObj.BasicInfo.UserId,
            "UserId": doctorinfo.doctorid,
            "DeleteInd": "N",
            "ActiveInd": "Y",
            "IsDefaultRoom": false
        };
        return obj;
    };

    $scope.newUserBranchRoomObj = getnewUserBranchRoomsObj();
    $scope.GetWaitingRoomList = function (branchId, roomtypeid) {
        var params = {
            "HospitalId": branchId,
            "RoomTypeId": roomtypeid,
            "SearchText": "",
            "PageNumber": 1,
            "PageSize": 100
        }
        eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
            if (data.Status === "Success") {
                $scope.RoomListarray = data.rows || [];
                $scope.RoomListarrayCount = data.count;
            } else {
                $scope.RoomListarray = [];
            }


        }).error(function (error) {

        });
    }



    $scope.GetWaitingRoomByType = function (RoomTypeId) {
        $scope.GetWaitingRoomList($scope.newUserBranchRoomObj.HospitalId, RoomTypeId);
    };

    $scope.AssignedUserRoomsArray = [];

    $scope.GetAllUsersAssignedRoomsList = function (docid) {
        var params = {
            "HospitalId": 0,
            "DoctorId": docid,
            "RoomTypeId": 0,
            "PageSize": 100,
            "PageNumber": 1
        }
        eHnoteSettingsDataService.GetUsersAssignedRoomsList(params).success(function (resp) {

            console.log(resp);

            if (resp.Status === "Success") {
                $scope.AssignedUserRoomsArray = resp.rows || [];
            } else {
                $scope.AssignedUserRoomsArray = [];
            }


        }).error(function (error) {

        });
    }

    $scope.changeRoomBranch = function (item) {

        console.log(item);

        $scope.newUserBranchRoomObj.HospitalId = item.HospitalObj.BranchId || "";

        item.HospitalId = item.HospitalObj.BranchId;
        item.BranchName = item.HospitalObj.BranchName;
        item.UserBranchId = item.HospitalObj.UserBranchId;



        $scope.GetWaitingRoomList(item.HospitalId, 0);
    };


    $scope.AddUpdateAssignRoom = function () {


        if ($scope.newUserBranchRoomObj.HospitalId === "" || $scope.newUserBranchRoomObj.HospitalId === 0) {
            alertify.error("Select Branch");
            return false;
        }
        else if ($scope.newUserBranchRoomObj.RoomTypeId === "" || $scope.newUserBranchRoomObj.RoomTypeId === 0) {
            alertify.error("Enter Room Name");
            return false;
        }
        //else if ($scope.newUserBranchRoomObj.RoomId === "" || $scope.newUserBranchRoomObj.RoomId === 0) {
        //    alertify.error("Select Room");
        //    return false;
        //}


        console.log($scope.MainUserObj.BasicInfo.UserId);


        var params = {
            "UserBranchRoomId": $scope.newUserBranchRoomObj.UserBranchRoomId,
            "HospitalId": $scope.newUserBranchRoomObj.HospitalId,
            "UserId": $scope.UserId,
            "DoctorId": $scope.MainUserObj.BasicInfo.UserId,
            "RoomTypeId": $scope.newUserBranchRoomObj.RoomTypeId,
            "RoomId": $scope.newUserBranchRoomObj.RoomId,
            "DeleteInd": $scope.newUserBranchRoomObj.DeleteInd,
            "ActiveInd": $scope.newUserBranchRoomObj.ActiveInd,
            "IsDefaultRoom": $scope.newUserBranchRoomObj.IsDefaultRoom === false ? "N" : "Y"
        }




        eHnoteSettingsDataService.AddUpdateUserRoomsinBranch(params).success(function (data) {
            if (data.Status === "Success") {
                alertify.success('Added Successfully');
                $scope.GetAllUsersAssignedRoomsList($scope.MainUserObj.BasicInfo.UserId);

                $scope.newUserBranchRoomObj = getnewUserBranchRoomsObj();
            } else {
                alertify.error('Room already exists');

            }

        }).error(function (error) {

        });
    }

    //$scope.OnSelectLeave = function () {
    //    if ($scope.newUserTimeSlotObj.SlotType === 2) {
    //        $scope.newUserTimeSlotObj.IsLeave = true;
    //    } else {
    //        $scope.newUserTimeSlotObj.IsLeave = false;
    //    }
    //};
    $scope.OnSelectLeave = function () {
        if ($scope.newUserTimeSlotObj.SlotTypeId === 2) {
            $scope.newUserTimeSlotObj.IsLeave = true;
            $scope.newUserTimeSlotObj.LeaveRemarks = "";
            $scope.newUserTimeSlotObj.BranchObj = ""
            $scope.generalVisitSlotsArray = [];



        } else {
            $scope.newUserTimeSlotObj.IsLeave = false;
            $scope.newUserTimeSlotObj = getuserBranchTimeSLotemptyObj();
            $scope.newUserTimeSlotAddReqObj = getnewUserbanchEntireTimeSLotObj();
            $scope.TimeSlots = getNewTimeSlotsEmptyObj();
            $scope.getSlotTimesList();
            $scope.newUserTimeSlotAddReqObj.UserBranchSlotsArray = [];
            $scope.generalVisitSlotsArray = [];



        }
    };

    $scope.TelephonicCheckEndTime = function (endtime) {
        var telephonicendtime = parseInt(endtime.replace(":", ""));
        if ($scope.NewAllowAllTimeSlots.TelephonicStartTimeHH !== "") {
            var telephonicstarttime = parseInt($scope.NewAllowAllTimeSlots.TelephonicStartTimeHH.replace(":", ""));
        } else {
            var telephonicstarttime = 0;
        }

        if (telephonicendtime <= telephonicstarttime) {
            $scope.NewAllowAllTimeSlots.TelephonicEndTimeHH = "";
            alertify.error("End time cannot be greater than or equal to start time");
            return;
        }
        $scope.NewAllowAllTimeSlots.OnlineStartTimeHH = "";
        $scope.NewAllowAllTimeSlots.OnlineEndTimeHH = "";

    };

    $scope.WalkInCheckEndTime = function (endtime) {
        var walkinendtime = parseInt(endtime.replace(":", ""));
        if ($scope.NewAllowAllTimeSlots.WalkInStartTimeHH !== "") {
            var walkinstarttime = parseInt($scope.NewAllowAllTimeSlots.WalkInStartTimeHH.replace(":", ""));
        } else {
            var walkinstarttime = 0;
        }

        if (walkinendtime <= walkinstarttime) {
            $scope.NewAllowAllTimeSlots.WalkInEndTimeHH = "";
            alertify.error("End time cannot be greater than or equal to start time");
            return;
        }
        $scope.NewAllowAllTimeSlots.OnlineStartTimeHH = "";
        $scope.NewAllowAllTimeSlots.OnlineEndTimeHH = "";
        $scope.NewAllowAllTimeSlots.TelephonicStartTimeHH = "";
        $scope.NewAllowAllTimeSlots.TelephonicEndTimeHH = "";
    };

    $scope.OnlineCheckEndTime = function (endtime) {
        var onlineendtime = parseInt(endtime.replace(":", ""));
        if ($scope.NewAllowAllTimeSlots.OnlineStartTimeHH !== "") {
            var onlinestarttime = parseInt($scope.NewAllowAllTimeSlots.OnlineStartTimeHH.replace(":", ""));
        } else {
            var onlinestarttime = 0;
        }

        if (onlineendtime <= onlinestarttime) {
            $scope.NewAllowAllTimeSlots.OnlineEndTimeHH = "";
            alertify.error("End time cannot be greater than or equal to start time");
            return;
        }
    };

    $scope.OnAllBranchCheck = function (val) {
        if (val) {
            $scope.newUserBranchTimeSlotObj.BranchObj = "";
        }
    };

    $scope.ConsultationTypes = [
        {
            "Name": "Physical Consultation",
            "Id": 1
        },
        {
            "Name": "Tele Consultation",
            "Id": 2
        }
    ];

    $scope.UserEditBranchArrays = [];
    $scope.changeroleforAssignRoles = function (UserBranchrole, UserBranches) {

        if (UserBranchrole.UserBranchId !== 0) {
            if (UserBranches.length > 0) {
                angular.forEach(UserBranches, function (item) {
                    if (item.UserBranchId === UserBranchrole.UserBranchId) {
                        if (item.RoleId === 1 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57) {
                            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'> Are You Sure Change the Role This Branch? All The Existing Appointments With This Person Will Be Cancelled! Click YES to continue", function () {
                                alertify.success("change the role this branch");
                            }, function () {
                                UserBranchrole.RoleId = item.RoleId;
                                r = "Cancel!";
                            });
                        }
                    }
                });
            }
        }
    };

    $scope.searchHospital = {
        "txt1": ""
    };
    $scope.searchtxtSpc = {
        "txt1": ""
    };
    $scope.searchHospital = {
        "Txt": ""
    }
    $scope.blurchange = function () {
        $scope.searchHospital.txt1 = "";
        $scope.searchtxtSpc.txt1 = "";
        $scope.searchHospital.Txt = "";
        $scope.OTPS.OTPUserName = "";
    }

    $scope.UserMobileNoFocus = false;
    $scope.AreaCode = function () {
        if ($scope.newUserBasicInfoObj.AreaCode.length === 3) {
            $scope.UserMobileNoFocus = true;
        }
        else {
            $scope.UserMobileNoFocus = false;
        }
    };

    $scope.UserCommunicationMobileNoFocus = false;
    $scope.CommunicationAreaCode = function () {
        if ($scope.newUserBasicInfoObj.CommunicationAreaCode.length === 3) {
            $scope.UserCommunicationMobileNoFocus = true;
        }
        else {
            $scope.UserCommunicationMobileNoFocus = false;
        }
    };



    function getuserBranchTimeSLotemptyObj() {
        var obj = {
            "BranchObj": "",
            "BranchId": "",
            "UserBranchId": "",
            "UserTimeSlotId": 0,
            "SlotDate": "",
            "SlotStartTime": "",
            "SlotEndTime": "",
            "SlotTypeId": 1,
            "OTStartTime": "",
            "OTEndTime": "",
            "IsNewFollowUpAscSameSlots": true,
            "NewAppointmentStartTime": "",
            "NewAppointmentEndTime": "",
            "FollowUpAppointmentStartTime": "",
            "FollowUpAppointmentEndTime": "",
            "IsNewAppointmentWalkinOnlineTeleSameSlots": true,
            "NewAppointmentWalkinStartTime": "",
            "NewAppointmentWalkinEndTime": "",
            "NewAppointmentOnlineStartTime": "",
            "NewAppointmentOnlineEndTIme": "",
            "NewAppointmentTeleStartTime": "",
            "NewAppointmentTeleEndTime": "",
            "IsFollowUpWalkinOnlineSameSlots": true,
            "FollowUpWalkinStartTime": "",
            "FollowUpWalkinEndTime": "",
            "FollowUpOnlineStartTime": "",
            "FollowUpOnlineEndTime": "",
            "FollowUpTeleStartTime": "",
            "FollowUpTeleEndTime": "",
            "NewAppointmentMaxSlots": 0,
            "FollowUpAppointmentMaxSlots": 0,
            "OTAppointmentMaxSlots": 0,
            "IsLeave": false,
            "LeaveRemarks": ""
        };

        return obj;
    }

    $scope.newUserTimeSlotObj = getuserBranchTimeSLotemptyObj();


    //$scope.newUserTimeSlotAddReqObj = {
    //    "UserId": doctorinfo.doctorid,
    //    "DoctorId": "",
    //    "BranchId": "",
    //    "UserBranchId": "",
    //    "UserBranchSlotsArray": [

    //    ]
    //};

    function getnewUserbanchEntireTimeSLotObj() {
        var obj = {
            "UserId": doctorinfo.doctorid,
            "DoctorId": "",
            "BranchId": "",
            "UserBranchId": "",
            "UserBranchSlotsArray": [

            ]
        }
        return obj;
    };

    $scope.newUserTimeSlotAddReqObj = getnewUserbanchEntireTimeSLotObj();

    $scope.isdiffSlotsAvailable = false;

    $scope.generalVisitSlotsArray = [];


    $scope.ChangeAllowSameforWalkinOnlineTeleSlots = function (obj) {

        console.log(obj.IsSameSlotsForWalkinOnlineTele);

        if (obj.IsSameSlotsForWalkinOnlineTele) {
            $scope.getWalkinOnlineGeneralSlotStartTimeList(obj);
        } else {

        }
    }

    $scope.addGeneralVisitSlotTypesTimes = function () {

        var counter = 0;
        angular.forEach($scope.generalVisitSlotsArray, function (mitem) {
            if (mitem.VisitSlotTypeId == $scope.TimeSlots.GeneralSlotTypeId) {
                counter++;
            }
        });
        if (counter > 0) {
            alertify.error("Already Added");
            return false;
        }

        var counter1 = 0;
        angular.forEach($scope.generalVisitSlotsArray, function (nitem) {
            if (nitem.StartTime == $scope.TimeSlots.GeneralStartTime || nitem.EndTime == $scope.TimeSlots.GeneralEndTime.time) {
                counter1++;
            }
        });
        if (counter1 > 0) {
            alertify.error("Already Added Time");
            return false;
        }

        var counter2 = 0;
        angular.forEach($scope.generalVisitSlotsArray, function (time1) {
            time1.tempstarttime = time1.StartTime.replace(":", "");
            time1.tempendtime = time1.EndTime.replace(":", "");

            var tempstarttime2 = $scope.TimeSlots.GeneralStartTime.time.replace(":", "");
            var tempendtime2 = $scope.TimeSlots.GeneralEndTime.time.replace(":", "");

            if ((parseInt(tempstarttime2) <= parseInt(time1.tempstarttime)) && (parseInt(time1.tempstarttime) <= parseInt(tempendtime2))) {
                counter2++;
            }
            if ((parseInt(tempstarttime2) <= parseInt(time1.tempendtime)) && (parseInt(time1.tempendtime) <= parseInt(tempendtime2))) {
                counter2++;
            }


        });
        if (counter2 > 0) {
            alertify.error("Already Added Time");
            return false;
        }

        if ($scope.TimeSlots.GeneralSlotTypeId == '') {
            alertify.error("Select Appointment");
            return false;
        }

        if ($scope.TimeSlots.GeneralStartTime.time == undefined) {
            alertify.error("Select Start Time");
            return false;
        }
        if ($scope.TimeSlots.GeneralEndTime.time == undefined) {
            alertify.error("Select End Time");
            return false;
        }
        if ($scope.TimeSlots.GeneralStartTime.time == $scope.TimeSlots.GeneralEndTime.time) {
            alertify.error("Please change End time");
            return false;
        }


        var Obj = {
            "VisitSlotTypeId": $scope.TimeSlots.GeneralSlotTypeId,
            "VisitSlotType": "",
            "StartTime": $scope.TimeSlots.GeneralStartTime.time,
            "EndTime": $scope.TimeSlots.GeneralEndTime.time,
            "IsSameSlotsForWalkinOnlineTele": false,
            "SpecificTimes": [],
            "Maxslots": $scope.TimeSlots.GeneralMaxSolts || ""
        }

        if (Obj.VisitSlotTypeId === 1) {
            Obj.VisitSlotType = "New";
        } else if (Obj.VisitSlotTypeId === 2) {
            Obj.VisitSlotType = "FollowUp";
        } else if (Obj.VisitSlotTypeId === 3) {
            Obj.VisitSlotType = "ASC";
        }

        $scope.generalVisitSlotsArray.push(Obj);


        $scope.TimeSlots.GeneralStartTime = "";
        $scope.TimeSlots.GeneralEndTime = "";
        $scope.TimeSlots.GeneralSlotTypeId = "";
        $scope.TimeSlots.GeneralMaxSolts = "";
        $scope.getGeneralSlotStartTimesList(0);




    };


    $scope.addGeneralVisitSlotSubTimes = function (mainobj) {

        var count = 0;
        angular.forEach($scope.generalVisitSlotsArray, function (xitem) {
            if (xitem.VisitSlotTypeId == mainobj.VisitSlotTypeId) {
                if (xitem.SpecificTimes.length > 0) {
                    angular.forEach(xitem.SpecificTimes, function (yitem) {
                        if (yitem.VisitSlotSubTypeId == $scope.TimeSlots.VisitSlotSubTypeId) {
                            count++;
                        }
                    });
                }
            }


        });
        if (count > 0) {
            alertify.error("Already Added");
            return false;
        }


        var coun = 0;
        angular.forEach($scope.generalVisitSlotsArray, function (pitem) {
            if (pitem.VisitSlotTypeId == mainobj.VisitSlotTypeId) {
                if (pitem.SpecificTimes.length > 0) {
                    angular.forEach(pitem.SpecificTimes, function (qitem) {
                        if (qitem.StartTime == $scope.TimeSlots.VisitTypeStartTime.time || qitem.EndTime == $scope.TimeSlots.VisitTypeEndTime.time) {
                            coun++;
                        }
                    });
                }

            }
        });
        if (coun > 0) {
            alertify.error("Already Added Time");
            return false;
        }

        var counter2 = 0;
        angular.forEach($scope.generalVisitSlotsArray, function (time) {
            if (time.SpecificTimes.length > 0) {
                angular.forEach(time.SpecificTimes, function (time1) {
                    time1.tempstarttime = time1.StartTime.replace(":", "");
                    time1.tempendtime = time1.EndTime.replace(":", "");
                    var tempstarttime2 = $scope.TimeSlots.VisitTypeStartTime.time.replace(":", "");
                    var tempendtime2 = $scope.TimeSlots.VisitTypeEndTime.time.replace(":", "");

                    if ((parseInt(tempstarttime2) <= parseInt(time1.tempstarttime)) && (parseInt(time1.tempstarttime) <= parseInt(tempendtime2))) {
                        counter2++;
                    }
                    if ((parseInt(tempstarttime2) <= parseInt(time1.tempendtime)) && (parseInt(time1.tempendtime) <= parseInt(tempendtime2))) {
                        counter2++;
                    }
                });
            }
        });


        if (counter2 > 0) {
            alertify.error("Already Added Time");
            return false;
        }

        if ($scope.TimeSlots.VisitSlotSubTypeId == '') {
            alertify.error("Select Visit");
            return false;
        }
        if ($scope.TimeSlots.VisitTypeStartTime.time == undefined) {
            alertify.error("Select Start Time");
            return false;
        }
        if ($scope.TimeSlots.VisitTypeEndTime.time == undefined) {
            alertify.error("Select End Time");
            return false;
        }

        if ($scope.TimeSlots.VisitTypeStartTime.time == $scope.TimeSlots.VisitTypeEndTime.time) {
            alertify.error("Please change End time");
            return false;
        }

        var Obj = {
            "VisitSlotSubTypeId": $scope.TimeSlots.VisitSlotSubTypeId,
            "VisitSlotSubType": "",
            "StartTime": $scope.TimeSlots.VisitTypeStartTime.time,
            "EndTime": $scope.TimeSlots.VisitTypeEndTime.time,
            "IsSameSlotsForWalkinOnlineTele": false,
            "SpecificTimes": [],
        }

        if (Obj.VisitSlotSubTypeId === 1) {
            Obj.VisitSlotSubType = "WalkIn";
        } else if (Obj.VisitSlotSubTypeId === 2) {
            Obj.VisitSlotSubType = "Online";
        } else if (Obj.VisitSlotSubTypeId === 3) {
            Obj.VisitSlotSubType = "Tele";
        }

        mainobj.SpecificTimes.push(Obj);


        $scope.TimeSlots.VisitTypeStartTime = "";
        $scope.TimeSlots.VisitTypeEndTime = "";
        $scope.TimeSlots.VisitSlotSubTypeId = "";
        mainobj.IsSameSlotsForWalkinOnlineTele = false;

        $scope.getWalkinOnlineGeneralSlotStartTimeList(mainobj);
    };


    $scope.ChangeAllowOPOtSameSlots = function (obj) {

        console.log(obj.IsNewFollowUpAscSameSlots);

        if (obj.IsNewFollowUpAscSameSlots) {

            //$scope.TimeSlots.OTSlotEndValues = [];
            //$scope.TimeSlots.OTSlotEndTime = [];
            //$scope.TimeSlots.OpSlotEndValues = [];
            //$scope.TimeSlots.OpSlotEndTime = [];
            $scope.getGeneralSlotStartTimesList(0);
            $scope.generalVisitSlotsArray = [];

        } else {
            $scope.getGeneralSlotStartTimesList(0);
            $scope.generalVisitSlotsArray = [];

        }
    };

    $scope.ChangeAllowNewApptFollowUpSameSlots = function (obj) {
        if (obj.IsNormalFollowUpSameSlots) {

        } else {

        }
    };

    $scope.ChangeNormalWalkinOnlineSlots = function (obj) {
        if (obj.IsNormalWalkinOnlineSameSlots) {

        } else {

        }
    };

    $scope.ChangeFollowUpWalkinOnlineSlots = function (obj) {
        if (obj.IsFollowUpWalkinOnlineSameSlots) {

        } else {

        }
    };

    $scope.enableFooll = false;
    $scope.AddMOreSpecificTimeSlots = function (vitem, indexx) {


        angular.forEach($scope.generalVisitSlotsArray, function (item, ind) {
            if (indexx === ind) {
            } else {
                item.IsSameSlotsForWalkinOnlineTele = false;
            }

        });


        vitem.IsSameSlotsForWalkinOnlineTele = !vitem.IsSameSlotsForWalkinOnlineTele;

        if (vitem.IsSameSlotsForWalkinOnlineTele) {
            $scope.getWalkinOnlineGeneralSlotStartTimeList(vitem);
        } else {

        }
    };

    $scope.DeleteVisitSlotTime = function (item, index) {
        $scope.generalVisitSlotsArray.splice(index, 1);

    };


    $scope.DeleteVisitSlotSubTime = function (mainobj, index) {
        mainobj.SpecificTimes.splice(index, 1);
    };



    $scope.clearNewUserBranchTime = function () {

        if ($scope.newUserTimeSlotObj.SlotTypeId == 2) {
            $scope.newUserTimeSlotObj.BranchObj = "";
            $scope.newUserTimeSlotObj.LeaveRemarks = "";
        } else {
            $scope.newUserTimeSlotObj = getuserBranchTimeSLotemptyObj();

            $scope.newUserTimeSlotAddReqObj = getnewUserbanchEntireTimeSLotObj();


            $scope.TimeSlots = getNewTimeSlotsEmptyObj();
            $scope.getSlotTimesList();
            $scope.newUserTimeSlotAddReqObj.UserBranchSlotsArray = [];

            $scope.generalVisitSlotsArray = [];
        }
    };


    $scope.SaveUserBranchCurrentSLot = function () {

        var selectedDatesArray = $filter("filter")($scope.MainTimerArray, { "IsSelectedDate": true });


        if (selectedDatesArray.length === 0) {
            alertify.error("Select Dates");
            return false;
        }
        if ($scope.newUserTimeSlotObj.BranchId === "" || $scope.newUserTimeSlotObj.BranchId === 0) {
            alertify.error("Please Select Branch");
            return false;
        }



        $scope.newUserTimeSlotAddReqObj.UserBranchSlotsArray = [];



        $scope.newUserTimeSlotObj.SlotStartTime = $scope.TimeSlots.SlotStartTime;
        $scope.newUserTimeSlotObj.SlotEndTime = $scope.TimeSlots.SlotEndTime;

        if ($scope.newUserTimeSlotObj.IsNewFollowUpAscSameSlots) {
            $scope.newUserTimeSlotObj.OTEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";
            //    $scope.newUserTimeSlotObj.OTEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";

        } else {
            if ($scope.generalVisitSlotsArray.length > 0) {
                var NewApptTimeSLotsArray = $filter("filter")($scope.generalVisitSlotsArray, { "VisitSlotTypeId": 1 }, true);
                if (NewApptTimeSLotsArray.length > 0) {
                    $scope.newUserTimeSlotObj.NewAppointmentStartTime = NewApptTimeSLotsArray[0].StartTime;
                    $scope.newUserTimeSlotObj.NewAppointmentEndTime = NewApptTimeSLotsArray[0].EndTime;
                    $scope.newUserTimeSlotObj.NewAppointmentMaxSlots = NewApptTimeSLotsArray[0].Maxslots || 0;
                    if (NewApptTimeSLotsArray[0].SpecificTimes.length > 0) {

                        $scope.newUserTimeSlotObj.IsNewAppointmentWalkinOnlineTeleSameSlots = false;

                        var NewApptWalkinTimeSLotsArray = $filter("filter")(NewApptTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 1 }, true);
                        if (NewApptWalkinTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.NewAppointmentWalkinStartTime = NewApptWalkinTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.NewAppointmentWalkinEndTime = NewApptWalkinTimeSLotsArray[0].EndTime;
                        }

                        var NewApptOnlineTimeSLotsArray = $filter("filter")(NewApptTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 2 }, true);
                        if (NewApptOnlineTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.NewAppointmentOnlineStartTime = NewApptOnlineTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.NewAppointmentOnlineEndTIme = NewApptOnlineTimeSLotsArray[0].EndTime;
                        }

                        var NewApptTeleTimeSLotsArray = $filter("filter")(NewApptTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 3 }, true);
                        if (NewApptTeleTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.NewAppointmentTeleStartTime = NewApptTeleTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.NewAppointmentTeleEndTIme = NewApptTeleTimeSLotsArray[0].EndTime;
                        }

                    }
                }

                var FollowUpTimeSLotsArray = $filter("filter")($scope.generalVisitSlotsArray, { "VisitSlotTypeId": 2 }, true);
                if (FollowUpTimeSLotsArray.length > 0) {
                    $scope.newUserTimeSlotObj.FollowUpAppointmentStartTime = FollowUpTimeSLotsArray[0].StartTime;
                    $scope.newUserTimeSlotObj.FollowUpAppointmentEndTime = FollowUpTimeSLotsArray[0].EndTime;
                    $scope.newUserTimeSlotObj.FollowUpAppointmentMaxSlots = FollowUpTimeSLotsArray[0].Maxslots || 0;
                    if (FollowUpTimeSLotsArray[0].SpecificTimes.length > 0) {


                        $scope.newUserTimeSlotObj.IsFollowUpWalkinOnlineSameSlots = false;

                        var FollowUpWalkinTimeSLotsArray = $filter("filter")(FollowUpTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 1 }, true);
                        if (FollowUpWalkinTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.FollowUpWalkinStartTime = FollowUpWalkinTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.FollowUpWalkinEndTime = FollowUpWalkinTimeSLotsArray[0].EndTime;
                        }


                        var FollowUpOnlineTimeSLotsArray = $filter("filter")(FollowUpTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 2 }, true);
                        if (FollowUpOnlineTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.FollowUpOnlineStartTime = FollowUpOnlineTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.FollowUpOnlineEndTime = FollowUpOnlineTimeSLotsArray[0].EndTime;
                        }

                        var FollowUpTeleTimeSLotsArray = $filter("filter")(FollowUpTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 3 }, true);
                        if (FollowUpTeleTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.FollowUpTeleStartTime = FollowUpTeleTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.FollowUpTeleEndTime = FollowUpTeleTimeSLotsArray[0].EndTime;
                        }

                    }
                }


                var ASCTimeSLotsArray = $filter("filter")($scope.generalVisitSlotsArray, { "VisitSlotTypeId": 3 }, true);
                if (ASCTimeSLotsArray.length > 0) {
                    $scope.newUserTimeSlotObj.OTStartTime = ASCTimeSLotsArray[0].StartTime;
                    $scope.newUserTimeSlotObj.OTEndTime = ASCTimeSLotsArray[0].EndTime;
                    $scope.newUserTimeSlotObj.OTAppointmentMaxSlots = ASCTimeSLotsArray[0].Maxslots || 0;
                } else {
                    $scope.newUserTimeSlotObj.OTStartTime = "00:00";
                    $scope.newUserTimeSlotObj.OTEndTime = "00:00";
                }
            }
        }


        angular.forEach(selectedDatesArray, function (sitem) {
            console.log(sitem.FullDate);
            $scope.newUserTimeSlotObj.SlotDate = sitem.FullDate;
            $scope.newUserTimeSlotAddReqObj.BranchId = $scope.newUserTimeSlotObj.BranchId;
            $scope.newUserTimeSlotAddReqObj.DoctorId = $scope.MainUserObj.BasicInfo.UserId;
            $scope.newUserTimeSlotAddReqObj.UserBranchId = $scope.newUserTimeSlotObj.UserBranchId;


            var obj = {
                "BranchObj": "",
                "BranchId": $scope.newUserTimeSlotAddReqObj.BranchId,
                "UserBranchId": $scope.newUserTimeSlotAddReqObj.UserBranchId,
                "UserTimeSlotId": 0,
                "SlotDate": sitem.FullDate,
                "SlotStartTime": $scope.newUserTimeSlotObj.SlotStartTime.toString() + ':' + "00",
                "SlotEndTime": $scope.newUserTimeSlotObj.SlotEndTime.toString() + ':' + "00",
                "SlotTypeId": $scope.newUserTimeSlotObj.SlotTypeId,
                "IsOpOTSameSlots": $scope.newUserTimeSlotObj.IsOpOTSameSlots,
                "OPStartTime": $scope.newUserTimeSlotObj.SlotStartTime.toString() + ':' + "00",
                "OPEndTime": $scope.newUserTimeSlotObj.SlotEndTime.toString() + ':' + "00",
                "OTStartTime": $scope.newUserTimeSlotObj.OTStartTime,
                "OTEndTime": $scope.newUserTimeSlotObj.OTEndTime,
                "IsNewFollowUpAscSameSlots": $scope.newUserTimeSlotObj.IsNewFollowUpAscSameSlots,
                "NewAppointmentStartTime": $scope.newUserTimeSlotObj.NewAppointmentStartTime,
                "NewAppointmentEndTime": $scope.newUserTimeSlotObj.NewAppointmentEndTime,
                "FollowUpAppointmentStartTime": $scope.newUserTimeSlotObj.FollowUpAppointmentStartTime,
                "FollowUpAppointmentEndTime": $scope.newUserTimeSlotObj.FollowUpAppointmentEndTime,
                "IsNewAppointmentWalkinOnlineTeleSameSlots": $scope.newUserTimeSlotObj.IsNewAppointmentWalkinOnlineTeleSameSlots,
                "NewAppointmentWalkinStartTime": $scope.newUserTimeSlotObj.NewAppointmentWalkinStartTime,
                "NewAppointmentWalkinEndTime": $scope.newUserTimeSlotObj.NewAppointmentWalkinEndTime,
                "NewAppointmentOnlineStartTime": $scope.newUserTimeSlotObj.NewAppointmentOnlineStartTime,
                "NewAppointmentOnlineEndTIme": $scope.newUserTimeSlotObj.NewAppointmentOnlineEndTIme,
                "NewAppointmentTeleStartTime": $scope.newUserTimeSlotObj.NewAppointmentTeleStartTime,
                "NewAppointmentTeleEndTIme": $scope.newUserTimeSlotObj.NewAppointmentTeleEndTIme,
                "IsFollowUpWalkinOnlineSameSlots": $scope.newUserTimeSlotObj.IsFollowUpWalkinOnlineSameSlots,
                "FollowUpWalkinStartTime": $scope.newUserTimeSlotObj.FollowUpWalkinStartTime,
                "FollowUpWalkinEndTime": $scope.newUserTimeSlotObj.FollowUpWalkinEndTime,
                "FollowUpOnlineStartTime": $scope.newUserTimeSlotObj.FollowUpOnlineStartTime,
                "FollowUpOnlineEndTime": $scope.newUserTimeSlotObj.FollowUpOnlineEndTime,
                "FollowUpTeleStartTime": $scope.newUserTimeSlotObj.FollowUpTeleStartTime,
                "FollowUpTeleEndTime": $scope.newUserTimeSlotObj.FollowUpTeleEndTime,
                "NewAppointmentMaxSlots": parseInt($scope.newUserTimeSlotObj.NewAppointmentMaxSlots) || 0,
                "FollowUpAppointmentMaxSlots": parseInt($scope.newUserTimeSlotObj.FollowUpAppointmentMaxSlots) || 0,
                "OTAppointmentMaxSlots": parseInt($scope.newUserTimeSlotObj.OTAppointmentMaxSlots) || 0,
                "IsLeave": $scope.newUserTimeSlotObj.IsLeave,
                "LeaveRemarks": $scope.newUserTimeSlotObj.LeaveRemarks
            }

            $scope.newUserTimeSlotAddReqObj.UserBranchSlotsArray.push(obj);
        });





        if ($scope.newUserTimeSlotObj.IsLeave) {
            if ($scope.newUserTimeSlotObj.LeaveRemarks === "") {
                alertify.error("Please Enter Leave Remarks");
                return false;
            }

            $scope.newUserTimeSlotObj.SlotStartTime = "00";
            $scope.newUserTimeSlotObj.SlotEndTime = "00";

        } else {

            //if ($scope.newUserTimeSlotObj.SlotStartTime === "" && $scope.newUserTimeSlotObj.SlotEndTime === "") {
            //    alertify.error("Please select a time slot!");
            //    return;
            //};

            if ($scope.newUserTimeSlotObj.SlotStartTime === "") {
                alertify.error("Please select Start time");
                return;
            };
            if ($scope.newUserTimeSlotObj.SlotEndTime === "") {
                alertify.error("Please select End time");
                return;
            }

            if ($scope.newUserTimeSlotObj.SlotStartTime === $scope.newUserTimeSlotObj.SlotEndTime) {
                alertify.error("Please Choose Valid End Time");
                return false;
            }
        }

        //$scope.newUserTimeSlotObj.SlotStartTime = $scope.newUserTimeSlotObj.SlotStartTime || "";
        //$scope.newUserTimeSlotObj.SlotEndTime = $scope.newUserTimeSlotObj.SlotEndTime || "";

        var params = {
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "BranchId": $scope.newUserTimeSlotObj.BranchId,
            "TimeSlotsArray": [],
            "TempTimeSlots": $scope.tempTimeSlotsArray || []
        };

        angular.forEach(selectedDatesArray, function (sitem) {
            console.log(sitem.FullDate);
            var obj = {
                "Date": sitem.FullDate,
                "StartTime": $scope.newUserTimeSlotObj.SlotStartTime.toString() + ':' + "00",
                "EndTime": $scope.newUserTimeSlotObj.SlotEndTime.toString() + ':' + "00",
                "SlotTypeId": 1
            };
            params.TimeSlotsArray.push(obj);
        });


        var timeslotduplicate = CompareDuplpicatesolts(params);
        if (timeslotduplicate === true) {
            alertify.error("Duplicate Slots");
            return false;
        }




        // console.log(JSON.stringify($scope.newUserTimeSlotAddReqObj));


        eHnoteMainAdminServices.checkIsUserSlotAvail(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
        function callbackgetuserbranchSuccess(resp) {
            console.log(JSON.stringify(resp));
            if (resp.isUserSlotAvailable) {

                $scope.continuetoSaveCurrentSLot($scope.newUserTimeSlotAddReqObj);


            } else {

                alertify.error(resp.Message);
            }

        }
        function callbackgetuserbranchError(err) {
            alertify.error("Some Error Occured");
        }







    }


    $scope.continuetoSaveCurrentSLot = function (params) {






        eHnoteMainAdminServices.addUpdateUserBranchTimeSlotsNew(params, callbackuserbranchSuccess, ccallbackuserbranchError);
        function callbackuserbranchSuccess(resp) {
            console.log(resp);
            if (resp.status === "Success") {
                if ($scope.newUserTimeSlotObj.IsLeave) {
                    alertify.success("Leave Added Successfully");
                } else {
                    alertify.success("Time Slots Added Successfully");
                }


                $scope.newUserTimeSlotObj = getuserBranchTimeSLotemptyObj();

                $scope.newUserTimeSlotAddReqObj = getnewUserbanchEntireTimeSLotObj();


                $scope.TimeSlots = getNewTimeSlotsEmptyObj();
                $scope.getSlotTimesList();
                $scope.newUserTimeSlotAddReqObj.UserBranchSlotsArray = [];

                $scope.generalVisitSlotsArray = [];

                angular.forEach($scope.MainTimerArray, function (aitem) {
                    aitem.IsSelectedDate = false;
                });
                $scope.weekitems.checkitem1 = "N";
                $scope.weekitems.checkitem2 = "N";
                $scope.weekitems.checkitem3 = "N";
                $scope.weekitems.checkitem4 = "N";
                $scope.weekitems.checkitem5 = "N";
                $scope.weekitems.checkitem6 = "N";
                $scope.month.checkitem = "N";

                $scope.startTimeHH.start = "00";
                $scope.startTimeHH.end = "00";
                $scope.endTimeHH.start = "00";
                $scope.endTimeMM.end = "00";


                $scope.tempTimeSlotsArray = [];
                $scope.mainTimeslotArray = [];

                $scope.showAddTimeSlotDev = true;



                var newdate = new Date();
                $scope.isCurrentPreviousMonth = true;
                var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');

                var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
                var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);




                $scope.selectedDate = firstDay;


                var startDate = firstDay;
                var EndDate = lastDay;
                var DateArray = [];

                var ExtraDaysCount = 0;



                var daynumber = new Date(firstDay).getDay();




                var fullyear = newdate.getFullYear();
                var fullmonth = newdate.getMonth();

                $scope.selectedmonth = fullmonth;
                $scope.selectedyear = fullyear;



                var currentMonthFirstDate = getMonthFirstDate(firstDay);

                DateArray = getDates(currentMonthFirstDate, EndDate);
                $scope.MainTimerArray = [];
                $scope.TimerWeekArray = [];
                $scope.selectedCurrentWeek = 1;
                console.log(newdate);
                formTimerArray(DateArray, newdate);
            }


        }
        function ccallbackuserbranchError(err) {
            alertify.error("Some Error Occured");
        }
    }




    $scope.deleteLeaveSlot = function (item) {
        if (item.IsLeave) {
            var obj = {
                "UserTimeSlotId": item.UserTimeSlotId,
                "BranchId": "",
                "UserBranchId": "",
                "SlotType": 0,
                "IsLeave": false,
                "StartTime": "",
                "EndTime": "",
                "ActiveInd": "Y",
                "DeleteInd": "N",
                "SlotDate": item.FullDate,
                "LeaveRemarks": "",
                "VisitType": "",
                "AllBranches": "",
                "ParentOrganizationId": $scope.newUserBasicInfoObj.ParentOrganizationId
            };
            var params = {
                "CreatedUserId": doctorinfo.doctorid,
                "UserId": $scope.MainUserObj.BasicInfo.UserId,
                "StartTime": "",
                "EndTime": "",
                "TimeSlotsArray": []
            }
            $scope.mainTimeslotArray.push(obj);
            params.TimeSlotsArray = $scope.mainTimeslotArray;
            eHnoteMainAdminServices.addUpdateUserTimeSlots(params, callbackuserbranchSuccess1, ccallbackuserbranchError1);
            function callbackuserbranchSuccess1(resp) {
                console.log(resp);
                if (resp.Status === "Success") {
                    alertify.success("Time Slots Added Successfully");
                    $scope.tempTimeSlotsArray = [];
                    $scope.mainTimeslotArray = [];

                    $scope.showAddTimeSlotDev = true;



                    var newdate = new Date();
                    $scope.isCurrentPreviousMonth = true;
                    var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');

                    var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
                    var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);




                    $scope.selectedDate = firstDay;


                    var startDate = firstDay;
                    var EndDate = lastDay;
                    var DateArray = [];

                    var ExtraDaysCount = 0;



                    var daynumber = new Date(firstDay).getDay();




                    var fullyear = newdate.getFullYear();
                    var fullmonth = newdate.getMonth();

                    $scope.selectedmonth = fullmonth;
                    $scope.selectedyear = fullyear;



                    var currentMonthFirstDate = getMonthFirstDate(firstDay);

                    DateArray = getDates(currentMonthFirstDate, EndDate);
                    $scope.MainTimerArray = [];
                    $scope.TimerWeekArray = [];
                    $scope.selectedCurrentWeek = 1;
                    console.log(newdate);
                    formTimerArray(DateArray, newdate);
                }


            }
            function ccallbackuserbranchError1(err) {
                alertify.error("Some Error Occured");
            }

        }
    };

    $scope.EditVisitSlotTime = function (vitem, index) {
        $scope.TimeSlots.GeneralSlotTypeId = vitem.VisitSlotTypeId;

        var starttimobj = $filter("filter")($scope.TimeSlots.GeneralSlotStartValues, { "time": vitem.StartTime }, true)[0];
        var endtimobj = $filter("filter")($scope.TimeSlots.GeneralSlotEndValues, { "time": vitem.EndTime }, true)[0];
        console.log(starttimobj);
        $scope.TimeSlots.GeneralStartTime = starttimobj;
        $scope.TimeSlots.GeneralEndTime = endtimobj;
        $scope.TimeSlots.GeneralMaxSolts = vitem.Maxslots;
        $scope.generalVisitSlotsArray.splice(index, 1);

    }

    $scope.EditVisitSlotSubTime = function (vitem, sitem, index) {
        vitem.IsSameSlotsForWalkinOnlineTele = !vitem.IsSameSlotsForWalkinOnlineTele;
        if (vitem.IsSameSlotsForWalkinOnlineTele) {
            $scope.getWalkinOnlineGeneralSlotStartTimeList(vitem);
            $scope.TimeSlots.VisitSlotSubTypeId = sitem.VisitSlotSubTypeId;
            var starttimobj1 = $filter("filter")($scope.TimeSlots.VisitTypeSubStartValues, { "time": sitem.StartTime }, true)[0];
            var endtimobj1 = $filter("filter")($scope.TimeSlots.VisitTypeSubEndValues, { "time": sitem.EndTime }, true)[0];
            $scope.TimeSlots.VisitTypeStartTime = starttimobj1;
            $scope.TimeSlots.VisitTypeEndTime = endtimobj1;
            angular.forEach($scope.generalVisitSlotsArray, function (pitem) {
                pitem.SpecificTimes.splice(index, 1);
            });
        }
    }

    $scope.changeActiveStatus = function (item, listArray) {

        $scope.saveStatus(item, listArray);
    };

    $scope.saveStatus = function (userActivestatus, userStatus) {
        var Userstatus = "";
        $scope.Aelrtmsg = "";
        if (userActivestatus === true) {
            Userstatus = 'Y';
            $scope.Aelrtmsg = " User Activated ";
        } else if (userActivestatus === false) {
            Userstatus = 'N';
            $scope.Aelrtmsg = " User De Activated ";
        }

        var obj = {
            "UserId": userStatus.UserId,
            "ActiveInd": Userstatus,
            "IsUserDisabled": userStatus.IsUserDisabled || false
        }
        eHnoteMainAdminServices.AdminUserActiveStatus(obj, Onsuccess, Onerror)
    }
    function Onsuccess(resp) {
        console.log(resp);
        if (resp.Status === "Success") {
            alertify.success('Successfully' + $scope.Aelrtmsg);
            if ($scope.useractiveMenu === "userList") {
                $scope.getAllUsers();
            } else if ($scope.useractiveMenu === "deleteuserlist") {
                $scope.getAllDeActiveUsersList();
            }
        }
    }
    function Onerror(error) {
        console.log(error);
        alertify.error('Some Error');
    }

    //user disabled
    $scope.changeDisabledStatus = function (userdisablestatus, userStatus) {
        $scope.Aelrtmsg = "";
        if (userdisablestatus === true) {
            $scope.Aelrtmsg = " User Disable ";
        } else if (userdisablestatus === false) {
            $scope.Aelrtmsg = " User Activated ";
        }
        var obj = {
            "UserId": userStatus.UserId,
            "ActiveInd": userStatus.Active || "Y",
            "IsUserDisabled": userdisablestatus || false
        }
        eHnoteMainAdminServices.AdminUserActiveStatus(obj, Onsuccess1, Onerror1)
    }
    function Onsuccess1(resp) {
        console.log(resp);
        if (resp.Status === "Success") {
            alertify.success('Successfully' + $scope.Aelrtmsg);
            if ($scope.useractiveMenu === "userList") {
                $scope.getAllUsers();
            } else if ($scope.useractiveMenu === "deleteuserlist") {
                $scope.getAllDeActiveUsersList();
            }
        }
    }
    function Onerror1(error) {
        console.log(error);
        alertify.error('Some Error');
    }

    $scope.allDeActiveUsersArray = [];
    $scope.getAllDeActiveUsersList = function () {
        console.log($scope.newUserSearchListObj);
        eHnoteMainAdminServices.getAllDeActiveUserBasicInfo($scope.newUserSearchListObj, ongetdeactivesSuccess, ongetdeactivesError);

        function ongetdeactivesSuccess(response) {
            console.log(response);
            $scope.allDeActiveUsersArray = [];
            if (response.status === 'Success') {
                if (response.row.length > 0) {
                    $scope.allDeActiveUsersArray = response.row;
                    console.log(response.Count);

                    angular.forEach($scope.allDeActiveUsersArray, function (item) {
                        item.UserProfilePicUrl = item.UserProfilePicUrl || "";
                        item.AgeInYears = item.AgeInYears || "";
                        item.AgeInMonths = item.AgeInMonths || "";
                        item.AgeInDays = item.AgeInDays || "";
                    });
                    $scope.totalUsersCount = response.Count;
                    angular.forEach($scope.allUsersArray, function (sitem) {
                        sitem.UserActiveStatus = false;
                    });
                }
            }
        }
        function ongetdeactivesError(resp) {
            console.log(resp);
        }
    };

    $scope.clearNewDeactiveUserSearch = function () {
        $scope.newUserSearchListObj = getNewUserSearchListObj();
        $scope.newinit("DeActiveUser");
    };

    $scope.allDeactiveUsersPagechanged = function (pagenumber) {
        $scope.newUserSearchListObj.PageNumber = pagenumber;
        $scope.getAllDeActiveUsersList();
    };

    $scope.SaveLeaveUserbaranch = function () {

        var selectedDatesArray = $filter("filter")($scope.MainTimerArray, { "IsSelectedDate": true });

        if (selectedDatesArray.length === 0) {
            alertify.error("Select Dates");
            return false;
        }
        if ($scope.newUserTimeSlotObj.BranchId === "" || $scope.newUserTimeSlotObj.BranchId === 0) {
            alertify.error("Please Select Branch");
            return false;
        }

        if ($scope.newUserTimeSlotObj.LeaveRemarks === "") {
            alertify.error("Please Enter Leave Remarks");
            return false;
        }

        if ($scope.newUserTimeSlotObj.IsLeave) {

            $scope.newUserTimeSlotObj.SlotStartTime = "00";
            $scope.newUserTimeSlotObj.SlotEndTime = "00";
            $scope.newUserTimeSlotObj.OTStartTime = "";
            $scope.newUserTimeSlotObj.OTEndTime = "";
        }

        angular.forEach(selectedDatesArray, function (sitem) {
            console.log(sitem.FullDate);
            $scope.newUserTimeSlotObj.SlotDate = sitem.FullDate;
            $scope.newUserTimeSlotAddReqObj.BranchId = $scope.newUserTimeSlotObj.BranchId;
            $scope.newUserTimeSlotAddReqObj.DoctorId = $scope.MainUserObj.BasicInfo.UserId;
            $scope.newUserTimeSlotAddReqObj.UserBranchId = $scope.newUserTimeSlotObj.UserBranchId;


            var obj = {
                "BranchObj": "",
                "BranchId": $scope.newUserTimeSlotAddReqObj.BranchId,
                "UserBranchId": $scope.newUserTimeSlotAddReqObj.UserBranchId,
                "UserTimeSlotId": 0,
                "SlotDate": sitem.FullDate,
                "SlotStartTime": $scope.newUserTimeSlotObj.SlotStartTime.toString() + ':' + "00",
                "SlotEndTime": $scope.newUserTimeSlotObj.SlotEndTime.toString() + ':' + "00",
                "SlotTypeId": $scope.newUserTimeSlotObj.SlotTypeId,
                "IsOpOTSameSlots": $scope.newUserTimeSlotObj.IsOpOTSameSlots,
                "OPStartTime": $scope.newUserTimeSlotObj.SlotStartTime.toString() + ':' + "00",
                "OPEndTime": $scope.newUserTimeSlotObj.SlotEndTime.toString() + ':' + "00",
                "OTStartTime": $scope.newUserTimeSlotObj.OTStartTime,
                "OTEndTime": $scope.newUserTimeSlotObj.OTEndTime,
                "IsNewFollowUpAscSameSlots": $scope.newUserTimeSlotObj.IsNewFollowUpAscSameSlots,
                "NewAppointmentStartTime": $scope.newUserTimeSlotObj.NewAppointmentStartTime,
                "NewAppointmentEndTime": $scope.newUserTimeSlotObj.NewAppointmentEndTime,
                "FollowUpAppointmentStartTime": $scope.newUserTimeSlotObj.FollowUpAppointmentStartTime,
                "FollowUpAppointmentEndTime": $scope.newUserTimeSlotObj.FollowUpAppointmentEndTime,
                "IsNewAppointmentWalkinOnlineTeleSameSlots": $scope.newUserTimeSlotObj.IsNewAppointmentWalkinOnlineTeleSameSlots,
                "NewAppointmentWalkinStartTime": $scope.newUserTimeSlotObj.NewAppointmentWalkinStartTime,
                "NewAppointmentWalkinEndTime": $scope.newUserTimeSlotObj.NewAppointmentWalkinEndTime,
                "NewAppointmentOnlineStartTime": $scope.newUserTimeSlotObj.NewAppointmentOnlineStartTime,
                "NewAppointmentOnlineEndTIme": $scope.newUserTimeSlotObj.NewAppointmentOnlineStartTime,
                "NewAppointmentTeleStartTime": $scope.newUserTimeSlotObj.NewAppointmentTeleStartTime,
                "NewAppointmentTeleEndTIme": $scope.newUserTimeSlotObj.NewAppointmentTeleEndTIme,
                "IsFollowUpWalkinOnlineSameSlots": $scope.newUserTimeSlotObj.IsFollowUpWalkinOnlineSameSlots,
                "FollowUpWalkinStartTime": $scope.newUserTimeSlotObj.FollowUpWalkinStartTime,
                "FollowUpWalkinEndTime": $scope.newUserTimeSlotObj.FollowUpWalkinEndTime,
                "FollowUpOnlineStartTime": $scope.newUserTimeSlotObj.FollowUpOnlineStartTime,
                "FollowUpOnlineEndTime": $scope.newUserTimeSlotObj.FollowUpOnlineEndTime,
                "FollowUpTeleStartTime": $scope.newUserTimeSlotObj.FollowUpTeleStartTime,
                "FollowUpTeleEndTime": $scope.newUserTimeSlotObj.FollowUpTeleEndTime,
                "IsLeave": $scope.newUserTimeSlotObj.IsLeave,
                "LeaveRemarks": $scope.newUserTimeSlotObj.LeaveRemarks
            }

            $scope.newUserTimeSlotAddReqObj.UserBranchSlotsArray.push(obj);
        });

        $scope.continuetoSaveCurrentSLot($scope.newUserTimeSlotAddReqObj);



    }

    $scope.BranchId = doctorinfo.hospitalID;

    $scope.getBranchSpecialitiesdetails = function () {
        $scope.UserSpecialitiesArray = [];
        eHnoteMainAdminServices.getBranchSpecialitiesById($scope.BranchId).then(function (resp) {
            console.log(resp.data);
            if (resp.data.row.length > 0) {
                $scope.UserSpecialitiesArray = resp.data.row;
            }
        });

    };
    // $scope.getBranchSpecialitiesdetails();


    $scope.AllDoctorCheck = true;
    $scope.selectedDoctors = "All";
    $scope.searchtxtb = { "txt1": "", "txt2": "" };
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }
    $scope.checkAllDoctor = function (val) {
        if (val) {
            angular.forEach($scope.MainBranchSubSpecializationList, function (item) {
                item.isChecked = true;
                item.IsPrimarySubSpecialization = false;
                if (item.SubSpecializationId === 11) {
                    item.IsPrimarySubSpecialization = true;
                }
            });

            $scope.selectedDoctors = 'All';
        } else {
            angular.forEach($scope.MainBranchSubSpecializationList, function (item) {
                item.isChecked = false;
                item.IsPrimarySubSpecialization = false;
            });

            $scope.selectedDoctors = 'Select SubSpecialities';
        }
        var checkedArray = _.where($scope.MainBranchSubSpecializationList, { isChecked: true });
        $scope.AllDoctorCheck = checkedArray.length > 0 && $scope.MainBranchSubSpecializationList.length === checkedArray.length ? true : false;

    };

    $scope.DoctorToggle = function (item) {
        var checkedArray = _.where($scope.MainBranchSubSpecializationList, { isChecked: true });

        if (checkedArray.length == 1) {
            checkedArray[0].IsPrimarySubSpecialization = true;
        }
        var UncheckedArray = _.where($scope.MainBranchSubSpecializationList, { isChecked: false });
        if (UncheckedArray.length > 0) {
            angular.forEach(UncheckedArray, function (item) {
                item.IsPrimarySubSpecialization = false;
            });
        }

        $scope.AllDoctorCheck = checkedArray.length > 0 && $scope.MainBranchSubSpecializationList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedDoctors = "Select  SubSpecialities ";
        } else {
            if (checkedArray.length > 0) {
                $scope.selectedDoctors = checkedArray[0].SubSpecializationName;


            } else {
                $scope.selectedDoctors = "Select  SubSpecialities";
            }
        }

    };
    $scope.showSubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId || 0;
    //$scope.getBranchSpecializationByIdDetails = function () {
    //    $scope.MainBranchSubSpecialization = [];
    //    eHnoteMainAdminServices.getBranchSpecializationById($scope.showSubOrganizationId, $scope.BranchId ).then(function (resp) {
    //        if (resp.data.row.length > 0) {
    //            $scope.MainBranchSubSpecialization = resp.data.row;

    //        }
    //    });

    //}

    $scope.getBranchSpecializationByIdDetails = function () {
        $scope.MainBranchSubSpecializationList = [];
        eHnoteMainAdminServices.getBranchSpecializationById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.MainBranchSubSpecializationList = resp.data.row;
                if ($scope.MainBranchSubSpecializationList.length > 0) {
                    angular.forEach($scope.MainBranchSubSpecializationList, function (Ditem) {
                        Ditem.IsPrimarySubSpecialization = false;
                        Ditem.isChecked = false;
                    });
                }
            }
        });

    }
    // $scope.getBranchSpecializationByIdDetails();


    $scope.clickfirstitem = function (item) {
        if (item.IsPrimarySubSpecialization) {
            angular.forEach($scope.MainBranchSubSpecializationList, function (sitem) {
                if (sitem.SubSpecializationId === item.SubSpecializationId) {
                    sitem.IsPrimarySubSpecialization = true;
                } else {
                    sitem.IsPrimarySubSpecialization = false;
                }
            });
        }
    }

    $scope.getSpecialityandSubSpecialityBySubOrgId = function (SubOrganizationId, BranchId) {
        var suborgId = SubOrganizationId;
        var BranchId = 0;

        eHnoteMainAdminServices.getAllBranchSpecialitiesById(suborgId).then(function (response) {
            //var u = response;
            $scope.UserSpecialitiesArray = [];
            if (response.data.status == "Success") {
                $scope.UserSpecialitiesArray = response.data.row || [];
            } else {
                alertify.error(response.data.Message);
            }
        }, function (error) {
            var e = error;
        });

        eHnoteMainAdminServices.GetAllSubSpecializationsByOrgId(SubOrganizationId).then(function (resp) {
            $scope.subSpecializations = [];
            if (resp.data.status == "Success") {
                if (resp.data.row.length > 0) {
                    //$scope.MainBranchSubSpecializationList = resp.data.row || [];
                    //angular.forEach($scope.MainBranchSubSpecializationList, function (item) {
                    //    item.IsPrimarySubSpecialization = false;
                    //    item.isChecked = false;
                    //});
                    $scope.AllSubSpecializationsArray = resp.data.row || [];
                    angular.forEach($scope.AllSubSpecializationsArray, function (item) {
                        item.IsPrimarySubSpecialization = false;
                        item.isChecked = false;
                    });
                }
            } else {
                alertify.error(response.data.Message);
            }

        });
    };
    $scope.getSpecialityandSubSpecialityBySubOrgId(doctorinfo.doctordata.UserAddress[0].SubOrganizationId);

    $scope.changeUserSpecialtion = function (SpecializationId) {
        $scope.MainBranchSubSpecializationList = [];
        angular.forEach($scope.AllSubSpecializationsArray, function (item) {
            if (item.SpecializationId == SpecializationId) {
                $scope.MainBranchSubSpecializationList.push(item);
            }
        });
        $scope.checkAllDoctor(false);
    };


    $scope.GotoUsersList = function () {
        $scope.useractiveMenu = 'userList';
        /*$scope.clearNewUserSearch();*/
        $scope.newinit();
         
    };












    //SIGNTOPAZ CODE Added by Durga on 23-01-2023

    var tmr;

    var resetIsSupported = false;

    function onLoadSIg() {
        if (IsSigWebInstalled()) {
            resetIsSupported = GetResetSupported();
            if (!resetIsSupported) {
                var sigweb_link = document.createElement("a");
                sigweb_link.href = "https://www.topazsystems.com/software/sigweb.exe";
                sigweb_link.innerHTML = "https://www.topazsystems.com/software/sigweb.exe";

                var note = document.getElementById("sigWebVrsnNote");
                note.innerHTML = "There is a newer version of SigWeb available here: ";
                note.appendChild(sigweb_link);
            }
        }
        else {
            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
        }
    }
    //onLoadSIg();


    function GetResetSupported() {
        var minSigWebVersionResetSupport = "1.6.4.0";

        if (isOlderSigWebVersionInstalled(minSigWebVersionResetSupport)) {
            console.log("Old SigWeb version installed.");
            return false;
        }
        return true;
    }

    function isOlderSigWebVersionInstalled(cmprVer) {
        var sigWebVer = GetSigWebVersion();
        if (sigWebVer != "") {
            return isOlderVersion(cmprVer, sigWebVer);
        } else {
            return false;
        }
    }

    function isOlderVersion(oldVer, newVer) {
        const oldParts = oldVer.split('.')
        const newParts = newVer.split('.')
        for (var i = 0; i < newParts.length; i++) {
            const a = parseInt(newParts[i]) || 0
            const b = parseInt(oldParts[i]) || 0
            if (a < b) return true
            if (a > b) return false
        }
        return false;
    }

    $scope.signPlusObj = {
        "readyToSign": false,
        "SignString": ""
    }


    $scope.OnSign = function () {
        if (IsSigWebInstalled()) {
            var ctx = document.getElementById('signPadUD').getContext('2d');
            SetDisplayXSize(500);
            SetDisplayYSize(100);
            SetTabletState(0, tmr);
            SetJustifyMode(0);
            ClearTablet();
            SetKeyString("0000000000000000");
            SetEncryptionMode(0);
            if (tmr == null) {
                tmr = SetTabletState(1, ctx, 50);
            }
            else {
                SetTabletState(0, tmr);
                tmr = null;
                tmr = SetTabletState(1, ctx, 50);
            }
            $scope.signPlusObj.readyToSign = true;
        } else {
            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
        }
    };

    $scope.OnClear = function () {
        ClearTablet();

        //var ctx = document.getElementById('cnv').getContext('2d');
        //ClearTablet();
        //ctx.clearReact(0,0,50,50)

        //SetTabletState(0, tmr);

    }


    $scope.saveDrawNew = function () {
        if (NumberOfTabletPoints() == 0) {
            alert("Please sign before continuing");
        }
        else {
            SetTabletState(0, tmr);


            //NOW, EXTRACT THE SIGNATURE IN THE TOPAZ BIOMETRIC FORMAT -- SIGSTRING
            //OR AS A BASE64-ENCODED PNG IMAGE
            //OR BOTH

            //********************USE THIS SECTION IF YOU WISH TO APPLY AUTOKEY TO YOUR TOPAZ SIGNATURE
            //READ ABOUT AUTOKEY AND THE TOPAZ SIGNATURE FORMAT HERE: http://topazsystems.com/links/robustsignatures.pdf
            //AUTOKEY IS CRITICAL TO SAVING AN eSIGN-COMPLIANT SIGNATURE
            //AUTOKEY ONLY APPLIES TO THE TOPAZ-FORMAT SIGSTRING AND DOES NOT APPLY TO AN IMAGE OF THE SIGNATURE
            //AUTOKEY ALLOWS THE DEVELOPER TO CRYPTOGRAPHICALLY BIND THE TOPAZ SIGNATURE TO A SET OF DATA
            //THE PURPOSE OF THIS IS TO SHOW THAT THE SIGNATURE IS BEING APPLIED TO THE DATA YOU PASS IN USING AutoKeyAddData()
            //IN GENERAL TOPAZ RECOMMENDS REPLICATING A TRADITIONAL 'PAPER AND PEN' APPROACH
            //IN OTHER WORDS, IF YOU WERE TO PRINT OUT ON PAPER THE TERMS/INFORMATION THE SIGNER IS SUPPOSED TO READ AND AGREE WITH
            //THE DATA ON THIS PAPER IS WHAT SHOULD IN WHOLE BE PASSED INTO AUTOKEYADDANSIDATA() DIGITALLY
            //THE TOPAZ SIGSTRING IS THEN BOUND TO THIS DATA, AND CAN ONLY BE SUCCESSFULLY DECRYPTED LATER USING THIS DATA
            //AUTOKEYADDDATA IS DEPRECATED AND REPLACED BY AUTOKEYADDANSIDATA

            var CryptoData = "";
            CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
            CryptoData = CryptoData + "Concatenate all this data into a single variable.";
            AutoKeyAddANSIData(CryptoData);
            SetEncryptionMode(2);

            //*******END AUTOKEY SECTION


            //NOTE THAT THE AUTOKEY SECTION ABOVE IS NOT REQUIRED TO RETURN A TOPAZ SIGSTRING
            //BUT IT IS STRONGLY RECOMMENDED IF YOU REQUIRE eSIGN COMPLIANCE
            //RETURN THE TOPAZ-FORMAT SIGSTRING
            SetSigCompressionMode(1);
            //alert("KEYSTRING:" + GetKeyString());
            $scope.signPlusObj.SignString = GetSigString();
            //THIS RETURNS THE SIGNATURE IN TOPAZ'S OWN FORMAT WITH BIOMETRIC INFORMATION
            $scope.Sign.EncryptedUserSign = GetSigString();

            //TO RETURN THIS SIGSTRING LATER TO A NEW WEB PAGE USING SIGWEB, REPEAT THE CODE FROM THIS FUNCTION ABOVE STARTING AFTER SetTabletState(0, tmr)
            //BUT AT THE END USE SetSigString() INSTEAD OF GetSigString()
            //NOTE THAT SetSigString() TAKES 2 ARGUMENTS
            //SetSigString(str SigString, context canvas)

            //TO RETURN A BASE64-ENCODED PNG IMAGE OF THE SIGNATURE
            SetImageXSize(500);
            SetImageYSize(100);
            SetImagePenWidth(5);
            GetSigImageB64(SignedImageCallback);
            function SignedImageCallback(str) {

                var convertedSignatureObj = "data:image/png;base64," + str;

                $scope.Sign.SignatureOfUser = convertedSignatureObj;

                $scope.signPlusObj.readyToSign = false;
                // ClearTablet();
                const canvas = document.getElementById("signPadUD");
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);


            }


        }
    }

    $scope.LoadSig = function () {
        SetTabletState(0, tmr);
        var ctx = document.getElementById('SigPlusLDR').getContext('2d');
        SetSigString($scope.signPlusObj.SignString, ctx);

        SetImageXSize(500);
        SetImageYSize(100);
        SetImagePenWidth(5);
        GetSigImageB64(SignedImageCallback);
        function SignedImageCallback(str) {
            var convertedSignatureObj = "data:image/png;base64," + str;
            $scope.Sign.SignatureOfUser2 = convertedSignatureObj;
        }
    }


    function endDemo() {
        ClearTablet();
        SetTabletState(0, tmr);
    }

    function close() {
        if (resetIsSupported) {
            Reset();
        } else {
            endDemo();
        }
    }


    $scope.$on('$destroy', function () {
        delete window.onbeforeunload;

        close();
        clearInterval(tmr);
        evt.preventDefault(); //For Firefox, needed for browser closure
    });
  










    /* NewSlots start*/

    $scope.changeAdvanceActiveInactive = function (item) {

        console.log(JSON.stringify(item));
    }

    $scope.Viewschedulespopup = function (item) {
        item.UserScheduleDetails = item.UserScheduleDetails || [];
        if (item.UserScheduleDetails.length > 0) {
            $scope.GetVisitReasonNew(item.UserScheduleDetails[0].BranchId);
        }
        console.log(JSON.stringify(item));

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/viewschedulespopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            // "windowClass": "newassessmentspopupuib",
            "windowClass": "modal__ninetynine--",
            "resolve": {
                "FinalObj": function () { return item; },
                "Brancheslist": function () { return $scope.MainUserObj.BasicInfo.UserWorkingBranches; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, FinalObj, Brancheslist) {

                $scope.FinalObj = FinalObj || '';
                $scope.MasterPayosTypesArray = $scope.MasterPayosTypesArray || [];
                $scope.Brancheslist = Brancheslist || [];
                $scope.Obj = {
                    "SlotStartValues": [],
                    "SlotEndValues": [],
                    "ScheduleVisitTypeDetails": [],
                    "NewAppointmentSlots": [],
                    "ClinicalFollowAppointmentSlots": [],
                    "PostOpFollowAppointmentSlots": [],
                    "ASCFollowAppointmentSlots": [],
                    "InvestigationSlots": [],
                    "isAdvancedView": false,
                   
                    "isDurationBasedSlots": false
                };

                $scope.allDaySlots = [];
                $scope.SlotType = "1";

                $scope.getUserSlotTimesListNew = function () {

                   
                    for (var i = 0; i < 24; i++) {
                        var hour12 = i % 12 || 12; // Convert 24-hour to 12-hour format
                        var period = i < 12 ? "AM" : "PM";
                        var formattedTime = (hour12 < 10 ? "0" : "") + hour12 + ":00 " + period; // Ensure 2-digit format

                        var obj = {
                            time: (i < 10 ? "0" : "") + i + ":00",
                            newtime: formattedTime
                        };

                        // Push to both SlotStartValues and SlotEndValues
                        $scope.Obj.SlotStartValues.push(obj);
                        $scope.Obj.SlotEndValues.push(obj);
                    }


                };
                $scope.getUserSlotTimesListNew();
                // ApptDuration based timeslots
                $scope.ChangeTimeslotsBasedonApptDuration = function (item, duration) {

                    item.SlotStartValues = [];
                    item.SlotEndValues = [];
                    var durationtime = parseInt(duration);

                    var shour = "00";  //"00";
                    var smin = "00";
                    var ehour = "23";  // "23";
                    var emin = "59";   //"59";
                    var startingTime = moment().hours(shour).minutes(smin);
                    var endingTime = moment().hours(ehour).minutes(emin);
                    var currentStartTime = angular.copy(startingTime);
                    while (currentStartTime < endingTime) {
                        var slotObj = {
                            "StartTime": currentStartTime.format("HH:mm"),
                            "time": currentStartTime.format("HH:mm"),
                            "EndTime": currentStartTime.add(durationtime, "minute").format("HH:mm"),
                        }

                        var t = $filter('date')(new Date(), "yyyy-MM-dd");
                        var datetime = t + "T" + slotObj.StartTime;
                        var NewStartTime = "";
                        var NewStartTime = $filter('date')(datetime, "hh:mm: a");

                        var arr = NewStartTime.split(':');
                        if (arr[0] == "12" && arr[2] == " AM") {
                            NewStartTime = NewStartTime.replace('12', '00');
                        }
                        var obj = {
                            "time": angular.copy(slotObj.time),
                            "newtime": angular.copy(NewStartTime)
                        }

                        item.SlotStartValues.push(obj);
                        item.SlotEndValues.push(obj);
                    }
                    //console.log(JSON.stringify(item.SlotStartValues));
                };
                $scope.ChangeTimeslotsBasedonApptDuration($scope.Obj, $scope.FinalObj.AverageConsultationTime);

                // Duration dropdown for Advanced Slots: 5-minute increments so it lines up with the
                // 5-min Select Timeslot step (see onDurationChange), plus the doctor's AverageConsultationTime
                // itself even if it isn't a multiple of 5, kept sorted.
                function buildDurationOptions(maxMinutes) {
                    var options = [];
                    for (var m = 5; m <= (maxMinutes || 120); m += 5) {
                        options.push(m);
                    }
                    var avgConsultTime = parseInt($scope.FinalObj.AverageConsultationTime, 10);
                    if (avgConsultTime > 0 && options.indexOf(avgConsultTime) === -1) {
                        options.push(avgConsultTime);
                        options.sort(function (a, b) { return a - b; });
                    }
                    return options;
                }
                $scope.DurationOptions = buildDurationOptions();
                $scope.onVisitReasonChange = function (row) {
                    row.DurationMinutes = null;
                    row.StartTime = null;

                    // if duration comes from reason master, set it here
                    var reason = $scope.VisitReasonList.find(function (x) {
                        return x.ReasonId === row.VisitReasonId;
                    });

                    if (reason && reason.DefaultDurationMinutes) {
                        row.DurationMinutes = reason.DefaultDurationMinutes;
                    }

                    $scope.refreshAvailableSlots(row);
                };
                $scope.onDurationChange = function (Sitem) {
                    var isDurationBasedSlots = !!$scope.UserDetailedSlotObj.isDurationBasedSlots;
                    var avgConsultationTime = parseInt($scope.FinalObj.AverageConsultationTime, 10) || 15;

                    // Only Advanced Slots (Duration-Based) sizes a slot by the chosen Duration. A plain
                    // Slot Wise schedule is always one AverageConsultationTime long, so the Duration
                    // field - which belongs to the other tab - must not leak into its list.
                    var duration = isDurationBasedSlots
                        ? (parseInt($scope.addNewAdvancedSlotReqObj.DurationMinutes, 10) || avgConsultationTime)
                        : avgConsultationTime;

                    console.log(duration+"__duration");
                    if (!duration) {
                        Sitem.allDaySlots = [];
                        $scope.AllDaySlotsObj = {
                            "AllSlotsCheck": false,
                            "Slot": "",
                            "SlotsText": "Select Slot"
                        };
                        return;
                    }

                    // Advanced Slots (Duration-Based): start times step every 5 minutes, independent of
                    // the org's AverageConsultationTime or the chosen Duration - e.g. 6:00, 6:05, 6:10 -
                    // because a duration-based slot may begin anywhere.
                    // Plain Slot Wise: the grid IS the consultation time, so it steps 8:00, 8:15, 8:30.
                    // This was hard-coded to 5 and so put non-duration-based schedules on the wrong grid.
                    var stepMinutes = isDurationBasedSlots ? 5 : avgConsultationTime;

                    Sitem.allDaySlots = [];

                    var arr = Sitem.StartTime.split(':');
                    var shour = $.trim(arr[0]);
                    var smin = $.trim(arr[1]);

                    var arr2 = Sitem.EndTime.split(':');
                    var ehour = $.trim(arr2[0]);
                    var emin = $.trim(arr2[1]);

                    var startingTime = moment().hours(shour).minutes(smin);
                    var endingTime = moment().hours(ehour).minutes(emin);

                    var startMins = parseInt(smin, 10);
                    var remainder = startMins % stepMinutes;
                    var anchoredMin = (remainder === 0) ? startMins : (startMins + stepMinutes - remainder);
                    var currentStartTime = moment().hours(shour).minutes(anchoredMin);

                    // If anchoring pushed past start hour
                    if (currentStartTime < startingTime) {
                        currentStartTime = angular.copy(startingTime);
                    }

                    function formatTime(timeString) {
                        var parts = timeString.split(":");
                        var hour = +parts[0] % 24;
                        return (hour % 12 || 12) + ":" + parts[1] + (hour < 12 ? "AM" : "PM");
                    }

                    while (currentStartTime < endingTime) {
                        var slotStart = currentStartTime.format("HH:mm");

                        // Calculate end time without mutating currentStartTime
                        var slotEndMoment = angular.copy(currentStartTime).add(duration, 'minute');

                        // If slot end exceeds working window, stop
                        if (slotEndMoment > endingTime) {
                            break;
                        }

                        var slotEnd = slotEndMoment.format("HH:mm");

                        var slotObj = {
                            "StartTime": slotStart,
                            "EndTime": slotEnd,
                            "IsSelected": false,
                            "IsChecked": false,
                            "SlotTypeId": 0,
                            "Available": "Y",
                            "seqStartTime": slotStart.replace(":", ""),
                            "seqEndTime": slotEnd.replace(":", ""),
                            "NewFormattedStime": formatTime(slotStart),
                            "NewFormattedEtime": formatTime(slotEnd)
                        };

                        Sitem.allDaySlots.push(slotObj);

                        // Advance by step (15 min), NOT by duration
                        currentStartTime.add(stepMinutes, 'minute');
                    }

                    // Reset timeslot selection state
                    $scope.AllDaySlotsObj = {
                        "AllSlotsCheck": false,
                        "Slot": "",
                        "SlotsText": "Select Slot"
                    };
                };
                $scope.refreshAvailableSlots = function (row) {
                }

                $scope.Obj.ScheduleVisitTypeDetails = [
                    {
                        "ScheduleVisitTypeDetailId": 0,
                        "UserScheduleDetailId": 0,
                        "SlotStartValues": angular.copy($scope.Obj.SlotStartValues) || [],
                        "SlotEndValues": angular.copy($scope.Obj.SlotEndValues) || [],
                        "StartTime": "",
                        "EndTime": "",
                        "VisitTypeId": 1,
                        "VisitTypeName": "New Appointment",
                        "DisplayName": "New Appointment"
                    },
                    {
                        "ScheduleVisitTypeDetailId": 0,
                        "UserScheduleDetailId": 0,
                        "SlotStartValues": angular.copy($scope.Obj.SlotStartValues) || [],
                        "SlotEndValues": angular.copy($scope.Obj.SlotEndValues) || [],
                        "StartTime": "",
                        "EndTime": "",
                        "VisitTypeId": 2,
                        "VisitTypeName": "Clinic Followup Appointment",
                        "DisplayName": "Clinic Follow-Ups"
                    },
                    {
                        "ScheduleVisitTypeDetailId": 0,
                        "UserScheduleDetailId": 0,
                        "SlotStartValues": angular.copy($scope.Obj.SlotStartValues) || [],
                        "SlotEndValues": angular.copy($scope.Obj.SlotEndValues) || [],
                        "StartTime": "",
                        "EndTime": "",
                        "VisitTypeId": 3,
                        "VisitTypeName": "Post-Op Followup Appointment",
                        "DisplayName": "Post-Op Follow-Ups"
                    },
                    {
                        "ScheduleVisitTypeDetailId": 0,
                        "UserScheduleDetailId": 0,
                        "SlotStartValues": angular.copy($scope.Obj.SlotStartValues) || [],
                        "SlotEndValues": angular.copy($scope.Obj.SlotEndValues) || [],
                        "StartTime": "",
                        "EndTime": "",
                        "VisitTypeId": 4,
                        "VisitTypeName": "ASC",
                        "DisplayName": "ASC"
                    }
                ]

                $scope.Obj.NewAppointmentSlots = [{
                    "ScheduleVisitTypeDetailId": 0,
                    "UserScheduleDetailId": 0,
                    "SlotStartValues": angular.copy($scope.Obj.SlotStartValues) || [],
                    "SlotEndValues": angular.copy($scope.Obj.SlotEndValues) || [],
                    "StartTime": "",
                    "EndTime": "",
                    "VisitTypeId": 1,

                }];
                $scope.Obj.ClinicalFollowAppointmentSlots = [{
                    "ScheduleVisitTypeDetailId": 0,
                    "UserScheduleDetailId": 0,
                    "SlotStartValues": angular.copy($scope.Obj.SlotStartValues) || [],
                    "SlotEndValues": angular.copy($scope.Obj.SlotEndValues) || [],
                    "StartTime": "",
                    "EndTime": "",
                    "VisitTypeId": 2,

                }];
                $scope.Obj.PostOpFollowAppointmentSlots = [{
                    "ScheduleVisitTypeDetailId": 0,
                    "UserScheduleDetailId": 0,
                    "SlotStartValues": angular.copy($scope.Obj.SlotStartValues) || [],
                    "SlotEndValues": angular.copy($scope.Obj.SlotEndValues) || [],
                    "StartTime": "",
                    "EndTime": "",
                    "VisitTypeId": 3,

                }];
                $scope.Obj.ASCFollowAppointmentSlots = [{
                    "ScheduleVisitTypeDetailId": 0,
                    "UserScheduleDetailId": 0,
                    "SlotStartValues": angular.copy($scope.Obj.SlotStartValues) || [],
                    "SlotEndValues": angular.copy($scope.Obj.SlotEndValues) || [],
                    "StartTime": "",
                    "EndTime": "",
                    "VisitTypeId": 4,

                }];
                $scope.Obj.InvestigationSlots = [{
                    "ScheduleVisitTypeDetailId": 0,
                    "UserScheduleDetailId": 0,
                    "SlotStartValues": angular.copy($scope.Obj.SlotStartValues) || [],
                    "SlotEndValues": angular.copy($scope.Obj.SlotEndValues) || [],
                    "StartTime": "",
                    "EndTime": "",
                    "VisitTypeId": 5,
                }];
                function getUserDetailedSlotObj() {
                    var obj = {
                        "UserId": doctorinfo.doctorid,
                        "BranchId": null,
                        "DoctorId": null,
                        "Type": 'Duration',
                        "ScheduleDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "FromDate": null,
                        "ToDate": null,
                        "ScheduleDuration": "",
                        "ScheduleDurationType": "M",
                        "UserScheduleId": 0,
                        "ScheduleEveryType": "1",
                        "DeleteInd": "N",
                        "IsDetailedSchedule": true,
                        "SlotStartValues": angular.copy($scope.Obj.SlotEndValues) || [],
                        "SlotEndValues": angular.copy($scope.Obj.SlotEndValues) || [],
                        "NewAppointmentMaxSlots": null,
                        "ClinicFollowUpAppointmentMaxSlots": null,
                        "ASCAppointmentMaxSlots": null,
                        "PostOpFollowUpAppointmentMaxSlots": null,
                        "InvestigationMaxSlots": null,
                        "UserScheduleDetails": [
                            {
                                "UserScheduleDetailId": 0,
                                "UserScheduleId": 0,
                                "BranchId": null,
                                "UserBranchId": null,
                                "Day": "Mon",
                                "DayId": 1,
                                "IsAdvancedSchedule": false,
                                "IsEdit": false,
                                "StartTime": "",
                                "EndTime": "",
                                "OnlineSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 1,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "BreakSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 2,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "NewAppointmentMaxSlots": null,
                                "ClinicFollowUpAppointmentMaxSlots": null,
                                "ASCAppointmentMaxSlots": null,
                                "PostOpFollowUpAppointmentMaxSlots": null,
                                "InvestigationMaxSlots": null,
                                // "ScheduleVisitTypeDetails": angular.copy($scope.Obj.ScheduleVisitTypeDetails) || [],
                                "NewAppointmentSlots": angular.copy($scope.Obj.NewAppointmentSlots) || [],
                                "ClinicalFollowAppointmentSlots": angular.copy($scope.Obj.ClinicalFollowAppointmentSlots) || [],
                                "PostOpFollowAppointmentSlots": angular.copy($scope.Obj.PostOpFollowAppointmentSlots) || [],
                                "ASCFollowAppointmentSlots": angular.copy($scope.Obj.ASCFollowAppointmentSlots) || [],
                                "InvestigationSlots": angular.copy($scope.Obj.InvestigationSlots) || [],
                                "DeleteInd": "N",
                                "MaximumOverAllSlots": 0
                            },
                            {
                                "UserScheduleDetailId": 0,
                                "UserScheduleId": 0,
                                "BranchId": null,
                                "UserBranchId": null,
                                "Day": "Tue",
                                "DayId": 2,
                                "IsAdvancedSchedule": false,
                                "IsEdit": false,
                                "StartTime": "",
                                "EndTime": "",
                                "OnlineSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 1,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "BreakSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 2,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "NewAppointmentMaxSlots": null,
                                "ClinicFollowUpAppointmentMaxSlots": null,
                                "ASCAppointmentMaxSlots": null,
                                "PostOpFollowUpAppointmentMaxSlots": null,
                                "InvestigationMaxSlots": null,
                                "NewAppointmentSlots": angular.copy($scope.Obj.NewAppointmentSlots) || [],
                                "ClinicalFollowAppointmentSlots": angular.copy($scope.Obj.ClinicalFollowAppointmentSlots) || [],
                                "PostOpFollowAppointmentSlots": angular.copy($scope.Obj.PostOpFollowAppointmentSlots) || [],
                                "ASCFollowAppointmentSlots": angular.copy($scope.Obj.ASCFollowAppointmentSlots) || [],
                                "InvestigationSlots": angular.copy($scope.Obj.InvestigationSlots) || [],
                                "DeleteInd": "N",
                                "MaximumOverAllSlots": 0
                            },
                            {
                                "UserScheduleDetailId": 0,
                                "UserScheduleId": 0,
                                "BranchId": null,
                                "UserBranchId": null,
                                "IsAdvancedSchedule": false,
                                "IsEdit": false,
                                "DayId": 3,
                                "Day": "Wed",
                                "StartTime": "",
                                "EndTime": "",
                                "OnlineSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 1,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "BreakSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 2,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "NewAppointmentMaxSlots": null,
                                "ClinicFollowUpAppointmentMaxSlots": null,
                                "ASCAppointmentMaxSlots": null,
                                "PostOpFollowUpAppointmentMaxSlots": null,
                                "InvestigationMaxSlots": null,
                                "NewAppointmentSlots": angular.copy($scope.Obj.NewAppointmentSlots) || [],
                                "ClinicalFollowAppointmentSlots": angular.copy($scope.Obj.ClinicalFollowAppointmentSlots) || [],
                                "PostOpFollowAppointmentSlots": angular.copy($scope.Obj.PostOpFollowAppointmentSlots) || [],
                                "ASCFollowAppointmentSlots": angular.copy($scope.Obj.ASCFollowAppointmentSlots) || [],
                                "InvestigationSlots": angular.copy($scope.Obj.InvestigationSlots) || [],
                                "DeleteInd": "N",
                                "MaximumOverAllSlots": 0
                            },
                            {
                                "UserScheduleDetailId": 0,
                                "UserScheduleId": 0,
                                "BranchId": null,
                                "UserBranchId": null,
                                "IsAdvancedSchedule": false,
                                "IsEdit": false,
                                "Day": "Thu",
                                "DayId": 4,
                                "StartTime": "",
                                "EndTime": "",
                                "OnlineSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 1,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "BreakSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 2,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "NewAppointmentMaxSlots": null,
                                "ClinicFollowUpAppointmentMaxSlots": null,
                                "ASCAppointmentMaxSlots": null,
                                "PostOpFollowUpAppointmentMaxSlots": null,
                                "InvestigationMaxSlots": null,
                                "NewAppointmentSlots": angular.copy($scope.Obj.NewAppointmentSlots) || [],
                                "ClinicalFollowAppointmentSlots": angular.copy($scope.Obj.ClinicalFollowAppointmentSlots) || [],
                                "PostOpFollowAppointmentSlots": angular.copy($scope.Obj.PostOpFollowAppointmentSlots) || [],
                                "ASCFollowAppointmentSlots": angular.copy($scope.Obj.ASCFollowAppointmentSlots) || [],
                                "InvestigationSlots": angular.copy($scope.Obj.InvestigationSlots) || [],
                                "DeleteInd": "N",
                                "MaximumOverAllSlots": 0
                            },
                            {
                                "UserScheduleDetailId": 0,
                                "UserScheduleId": 0,
                                "BranchId": null,
                                "UserBranchId": null,
                                "IsAdvancedSchedule": false,
                                "IsEdit": false,
                                "Day": "Fri",
                                "DayId": 5,
                                "StartTime": "",
                                "EndTime": "",
                                "OnlineSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 1,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "BreakSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 2,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "NewAppointmentMaxSlots": null,
                                "ClinicFollowUpAppointmentMaxSlots": null,
                                "ASCAppointmentMaxSlots": null,
                                "PostOpFollowUpAppointmentMaxSlots": null,
                                "InvestigationMaxSlots": null,
                                "NewAppointmentSlots": angular.copy($scope.Obj.NewAppointmentSlots) || [],
                                "ClinicalFollowAppointmentSlots": angular.copy($scope.Obj.ClinicalFollowAppointmentSlots) || [],
                                "PostOpFollowAppointmentSlots": angular.copy($scope.Obj.PostOpFollowAppointmentSlots) || [],
                                "ASCFollowAppointmentSlots": angular.copy($scope.Obj.ASCFollowAppointmentSlots) || [],
                                "InvestigationSlots": angular.copy($scope.Obj.InvestigationSlots) || [],
                                "DeleteInd": "N",
                                "MaximumOverAllSlots": 0
                            },
                            {
                                "UserScheduleDetailId": 0,
                                "UserScheduleId": 0,
                                "BranchId": null,
                                "UserBranchId": null,
                                "IsAdvancedSchedule": false,
                                "IsEdit": false,
                                "Day": "Sat",
                                "DayId": 6,
                                "StartTime": "",
                                "EndTime": "",
                                "OnlineSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 1,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "BreakSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 2,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "NewAppointmentMaxSlots": null,
                                "ClinicFollowUpAppointmentMaxSlots": null,
                                "ASCAppointmentMaxSlots": null,
                                "PostOpFollowUpAppointmentMaxSlots": null,
                                "InvestigationMaxSlots": null,
                                "NewAppointmentSlots": angular.copy($scope.Obj.NewAppointmentSlots) || [],
                                "ClinicalFollowAppointmentSlots": angular.copy($scope.Obj.ClinicalFollowAppointmentSlots) || [],
                                "PostOpFollowAppointmentSlots": angular.copy($scope.Obj.PostOpFollowAppointmentSlots) || [],
                                "ASCFollowAppointmentSlots": angular.copy($scope.Obj.ASCFollowAppointmentSlots) || [],
                                "InvestigationSlots": angular.copy($scope.Obj.InvestigationSlots) || [],
                                "DeleteInd": "N",
                                "MaximumOverAllSlots": 0
                            },
                            {
                                "UserScheduleDetailId": 0,
                                "UserScheduleId": 0,
                                "BranchId": null,
                                "UserBranchId": null,
                                "IsAdvancedSchedule": false,
                                "IsEdit": false,
                                "Day": "Sun",
                                "DayId": 7,
                                "StartTime": "",
                                "EndTime": "",
                                "OnlineSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 1,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "BreakSlots": [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 2,
                                        "DeleteInd": "N"
                                    }
                                ],
                                "NewAppointmentMaxSlots": null,
                                "ClinicFollowUpAppointmentMaxSlots": null,
                                "ASCAppointmentMaxSlots": null,
                                "PostOpFollowUpAppointmentMaxSlots": null,
                                "InvestigationMaxSlots": null,
                                "NewAppointmentSlots": angular.copy($scope.Obj.NewAppointmentSlots) || [],
                                "ClinicalFollowAppointmentSlots": angular.copy($scope.Obj.ClinicalFollowAppointmentSlots) || [],
                                "PostOpFollowAppointmentSlots": angular.copy($scope.Obj.PostOpFollowAppointmentSlots) || [],
                                "ASCFollowAppointmentSlots": angular.copy($scope.Obj.ASCFollowAppointmentSlots) || [],
                                "InvestigationSlots": angular.copy($scope.Obj.InvestigationSlots) || [],
                                "DeleteInd": "N",
                                "MaximumOverAllSlots": 0
                            }
                        ],
                        "UserDaySlots": [],
                        "UserDayBreakSlots": [],
                        "UserScheduleName": "",
                        "IsInsuranceBasedScheduling": false,
                        "isDurationBasedSlots": false,
                    }
                    return obj;

                };
                $scope.UserDetailedSlotObj = angular.copy(getUserDetailedSlotObj());

                $scope.selectedSlotDayObj = "";



                $scope.getTimeSlotsByEveryType = function (typeid) {
                    console.log(typeid);
                    typeid = parseFloat(typeid) || 0;

                    $scope.ScheduledDateArray = [];

                    $scope.currentDate = new Date();

                    if (typeid === 1) {
                        $scope.ScheduledDateArray = getAllWeekDates();
                    }
                    if (typeid === 2) {

                        //$scope.currentWeekNumber = Math.ceil(((($scope.currentDate - new Date($scope.currentDate.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
                        //if ($scope.currentWeekNumber % 2 === 0) {
                        //    $scope.ScheduledDateArray = [];
                        //    for (var i = 1; i <= 4; i++) {
                        //        var nextEvenWeekDate = new Date($scope.currentDate.getTime() + (i * 14 * 24 * 60 * 60 * 1000));

                        //        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        //        var day = daysOfWeek[nextEvenWeekDate.getDay()];

                        //        $scope.DisplayDate = $filter('date')(new Date(nextEvenWeekDate), "yyyy-MM-dd");

                        //        var obj = {
                        //            "Date": $scope.DisplayDate,
                        //            "Day": day,
                        //            "StartTime": "",
                        //            "EndTime": "",
                        //        }

                        //        $scope.ScheduledDateArray.push(obj);
                        //    }
                        //}




                        //var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 1;

                        //for (var i = 0; i < monthCount; i++) {

                        //    $scope.currentDate.setDate(1);
                        //    $scope.currentDate.setMonth($scope.currentDate.getMonth() + i);
                        //    var firstDayOfWeek = $scope.currentDate.getDay();

                        //    var secondWeekStartDate = new Date($scope.currentDate.getTime() + (8 - firstDayOfWeek) * 24 * 60 * 60 * 1000);
                        //    var nextEvenWeekStartDate = new Date(secondWeekStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);

                        //    for (var j = 0; j < 5; j++) {
                        //        var date = new Date(nextEvenWeekStartDate.getTime() + j * 14 * 24 * 60 * 60 * 1000);




                        //            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        //            var day = daysOfWeek[date.getDay()];

                        //            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                        //            var obj = {
                        //                "Date": $scope.DisplayDate,
                        //                "Day": day,
                        //                "StartTime": "",
                        //                "EndTime": "",
                        //            }
                        //            $scope.ScheduledDateArray.push(obj);



                        //    }

                        //}


                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 2 || sditem.WeekNumber === 4) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }

                        //var secondarray = getSecondWeekDates();
                        //if (secondarray.length > 0) {
                        //    angular.forEach(secondarray, function (sditem) {
                        //        $scope.ScheduledDateArray.push(sditem)
                        //    });
                        //}

                        //var fourtharray = getForthWeekDates();
                        //if (fourtharray.length > 0) {
                        //    angular.forEach(fourtharray, function (sditem) {
                        //        $scope.ScheduledDateArray.push(sditem)
                        //    });
                        //}




                    }

                    if (typeid === 3) {

                        //$scope.currentWeekNumber = Math.ceil(((($scope.currentDate - new Date($scope.currentDate.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
                        //if ($scope.currentWeekNumber % 2 !== 0) {
                        //    $scope.ScheduledDateArray = [];
                        //    for (var i = 1; i <= 4; i++) {
                        //        var nextOddWeekDate = new Date($scope.currentDate.getTime() + ((i * 14 - 7) * 24 * 60 * 60 * 1000));


                        //        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        //        var day = daysOfWeek[nextOddWeekDate.getDay()];

                        //        $scope.DisplayDate = $filter('date')(new Date(nextOddWeekDate), "yyyy-MM-dd");

                        //        var obj = {
                        //            "Date": $scope.DisplayDate,
                        //            "Day": day,
                        //            "StartTime": "",
                        //            "EndTime": "",
                        //        }
                        //        $scope.ScheduledDateArray.push(obj);
                        //    }
                        //}



                        //var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 1;

                        //for (var i = 0; i < monthCount; i++) {

                        //    $scope.currentDate.setDate(1);


                        //    $scope.currentDate.setMonth($scope.currentDate.getMonth() + i);

                        //    var firstDayOfWeek = $scope.currentDate.getDay();

                        //    var secondWeekStartDate = new Date($scope.currentDate.getTime() + (8 - firstDayOfWeek) * 24 * 60 * 60 * 1000);

                        //    var nextOddWeekStartDate = new Date(secondWeekStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);


                        //    for (var j = 0; j < 5; j++) {
                        //        var date = new Date(nextOddWeekStartDate.getTime() + j * 14 * 24 * 60 * 60 * 1000);
                        //        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        //        var day = daysOfWeek[date.getDay()];

                        //        $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                        //        var obj = {
                        //            "Date": $scope.DisplayDate,
                        //            "Day": day,
                        //            "StartTime": "",
                        //            "EndTime": "",
                        //        }
                        //        $scope.ScheduledDateArray.push(obj);
                        //    }

                        //}








                        //for (var i = 0; i < monthCount; i++) {

                        //    var monthStartDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() + i, 1);

                        //    var firstDayOfWeek = monthStartDate.getDay();

                        //    var secondWeekStartDate = new Date(monthStartDate.getTime() + (8 - firstDayOfWeek) * 24 * 60 * 60 * 1000);


                        //    for (var j = 0; j < 2; j++) {
                        //        var date = new Date(secondWeekStartDate.getTime() + j * 14 * 24 * 60 * 60 * 1000 + 1 * 24 * 60 * 60 * 1000);


                        //        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        //        var day = daysOfWeek[date.getDay()];

                        //        $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                        //        var obj = {
                        //            "Date": $scope.DisplayDate,
                        //            "Day": day,
                        //            "StartTime": "",
                        //            "EndTime": "",
                        //        }
                        //        $scope.ScheduledDateArray.push(obj);
                        //    }
                        //}

                        $scope.ScheduledDateArray = [];

                        //var Firstarray = getFirstWeekDates();
                        //if (Firstarray.length > 0) {


                        //    angular.forEach(Firstarray, function (sditem) {
                        //        $scope.ScheduledDateArray.push(sditem)
                        //    });
                        //}

                        //var Thirdarray = getThirdWeekDates();
                        //if (Thirdarray.length > 0) {

                        //    angular.forEach(Thirdarray, function (sditem) {
                        //        $scope.ScheduledDateArray.push(sditem)
                        //    });
                        //}

                        //var Fiftharray = getFifthWeekDates()
                        //if (Fiftharray.length > 0) {

                        //    angular.forEach(Fiftharray, function (sditem) {
                        //        $scope.ScheduledDateArray.push(sditem)
                        //    });
                        //}


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 1 || sditem.WeekNumber === 3 || sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }

                    if (typeid === 4) {
                        $scope.ScheduledDateArray = [];



                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 1) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }

                    if (typeid === 5) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 2) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    if (typeid === 6) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 3) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }

                    if (typeid === 7) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 4) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }


                    if (typeid === 8) {
                        $scope.ScheduledDateArray = [];

                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }

                    if (typeid === 9) {
                        $scope.ScheduledDateArray = [];

                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });

                            if ($scope.ScheduledDateArray.length === 0) {
                                angular.forEach(array, function (sditem) {
                                    if (sditem.WeekNumber === 4) {
                                        $scope.ScheduledDateArray.push(sditem);
                                    }
                                });
                            }
                        }
                    }

                    if (typeid === 10) {

                    }
                    $scope.filteredArray = $filter('orderBy')($scope.ScheduledDateArray, 'Date', false)
                }

                function getAllWeekDates() {

                    var array = [];
                    console.log($scope.UserDetailedSlotObj.ScheduleDate);
                    var actualSelectedDt = $filter('date')(new Date($scope.UserDetailedSlotObj.ScheduleDate), "yyyy-MM-dd");

                    $scope.currentDate = new Date($filter('date')(new Date($scope.UserDetailedSlotObj.ScheduleDate), "yyyy-MM-dd") + ' ' + "00:00:00");    // when today date 1st its go for the pervious date

                    console.log($scope.currentDate);
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;


                    for (var i = 0; i < monthCount; i++) {
                        var monthStartDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() + i, 1);

                        var numDaysInMonth = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1, 0).getDate();

                        for (var j = 0; j < numDaysInMonth; j++) {
                            var date = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth(), j + 1);
                            console.log(date);
                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");
                            var weekno = getWeekOfMonth(date);
                            console.log(weekno);
                            var result = comparetwodates(actualSelectedDt, $scope.DisplayDate);
                            console.log(result);
                            if (!result) {
                                var obj = {
                                    "Date": $scope.DisplayDate,
                                    "Day": day,
                                    "WeekNumber": weekno,
                                    "StartTime": "",
                                    "EndTime": "",
                                }
                                array.push(obj);
                            }

                        }
                    }

                    return array;

                }

                function getWeekOfMonth(date) {

                    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

                    /*     const dayOfWeek = firstDayOfMonth.getDay() - 1;*/
                    const dayOfWeek = firstDayOfMonth.getDay();
                    const dayOfMonth = date.getDate() + dayOfWeek;
                    return Math.ceil(dayOfMonth / 7);
                }

                function comparetwodates(dt1, dt2) {
                    let date1 = new Date(dt1); // December 31, 2022
                    let date2 = new Date(dt2); // January 1, 2022

                    var result = false;
                    // compare the two dates
                    if (date1.getTime() > date2.getTime()) {
                        result = true;
                    } else if (date1.getTime() < date2.getTime()) {
                        result = false;
                    } else {
                        result = false;
                    }
                    return result;
                }

                function getFirstWeekDates() {

                    var array = [];
                    $scope.currentDate = new Date();
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;

                    for (var i = 0; i < monthCount; i++) {

                        $scope.currentDate.setDate(1);


                        $scope.currentDate.setMonth($scope.currentDate.getMonth() + i);
                        var firstDayOfWeek = $scope.currentDate.getDay();
                        var firstDayOfFirstWeek = new Date($scope.currentDate.getTime() - firstDayOfWeek * 24 * 60 * 60 * 1000);

                        for (var j = 0; j < 7; j++) {
                            var date = new Date(firstDayOfFirstWeek.getTime() + j * 24 * 60 * 60 * 1000);

                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                            var obj = {
                                "Date": $scope.DisplayDate,
                                "Day": day,
                                "StartTime": "",
                                "EndTime": "",
                            }
                            array.push(obj);

                        }
                    }

                    return array;
                }

                function getSecondWeekDates() {
                    $scope.currentDate = new Date();
                    var Array = [];
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;
                    for (var i = 0; i < monthCount; i++) {

                        $scope.currentDate.setDate(1);

                        $scope.currentDate.setMonth($scope.currentDate.getMonth() + i);

                        var firstDayOfWeek = $scope.currentDate.getDay();
                        //var secondWeekStartDate = new Date($scope.currentDate.getTime() + (7 - firstDayOfWeek + 7) * 24 * 60 * 60 * 1000);
                        var secondWeekStartDate = new Date($scope.currentDate.getTime() + (7 - firstDayOfWeek) * 24 * 60 * 60 * 1000);



                        for (var j = 0; j < 7; j++) {
                            var date = new Date(secondWeekStartDate.getTime() + j * 24 * 60 * 60 * 1000);


                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                            var obj = {
                                "Date": $scope.DisplayDate,
                                "Day": day,
                                "StartTime": "",
                                "EndTime": "",
                            }
                            Array.push(obj);

                        }
                    }

                    return Array;
                }

                function getThirdWeekDates() {
                    var array = [];
                    $scope.currentDate = new Date();
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;
                    for (var i = 0; i < monthCount; i++) {

                        $scope.currentDate.setDate(1);

                        $scope.currentDate.setMonth($scope.currentDate.getMonth() + i);

                        var firstDayOfWeek = $scope.currentDate.getDay();

                        /*   var thirdWeekStartDate = new Date($scope.currentDate.getTime() + (14 - firstDayOfWeek + 7) * 24 * 60 * 60 * 1000);*/

                        var thirdWeekStartDate = new Date($scope.currentDate.getTime() + (14 - firstDayOfWeek) * 24 * 60 * 60 * 1000);


                        for (var j = 0; j < 7; j++) {
                            var date = new Date(thirdWeekStartDate.getTime() + j * 24 * 60 * 60 * 1000);


                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                            var obj = {
                                "Date": $scope.DisplayDate,
                                "Day": day,
                                "StartTime": "",
                                "EndTime": "",
                            }
                            array.push(obj);


                        }


                    }

                    return array;
                }

                function getForthWeekDates() {
                    var Array = [];
                    $scope.currentDate = new Date();
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;
                    for (var i = 0; i < monthCount; i++) {
                        $scope.currentDate.setDate(1);
                        $scope.currentDate.setMonth($scope.currentDate.getMonth() + i);
                        var firstDayOfWeek = $scope.currentDate.getDay();

                        /*   var fourthWeekStartDate = new Date($scope.currentDate.getTime() + (21 - firstDayOfWeek + 7) * 24 * 60 * 60 * 1000);*/

                        var fourthWeekStartDate = new Date($scope.currentDate.getTime() + (21 - firstDayOfWeek) * 24 * 60 * 60 * 1000);


                        for (var j = 0; j < 7; j++) {
                            var date = new Date(fourthWeekStartDate.getTime() + j * 24 * 60 * 60 * 1000);


                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                            var obj = {
                                "Date": $scope.DisplayDate,
                                "Day": day,
                                "StartTime": "",
                                "EndTime": "",
                            }
                            Array.push(obj);

                        }
                    }

                    return Array;
                }

                function getFifthWeekDates() {

                    var Array = [];
                    $scope.currentDate = new Date();
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;


                    for (var i = 0; i < monthCount; i++) {

                        var monthStartDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() + i, 1);

                        var firstDayOfWeek = monthStartDate.getDay();



                        var fifthWeekStartDate = new Date(monthStartDate.getTime() + (29 - firstDayOfWeek) * 24 * 60 * 60 * 1000);

                        if (fifthWeekStartDate.getMonth() === monthStartDate.getMonth()) {

                            for (var j = 0; j < 7; j++) {
                                var date = new Date(fifthWeekStartDate.getTime() + j * 24 * 60 * 60 * 1000);

                                var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                var day = daysOfWeek[date.getDay()];

                                $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                                var obj = {
                                    "Date": $scope.DisplayDate,
                                    "Day": day,
                                    "StartTime": "",
                                    "EndTime": "",
                                }
                                Array.push(obj);

                            }
                        }
                    }
                    return Array;
                }

                function lastWeekDates() {

                    var Array = [];
                    $scope.currentDate = new Date();
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;

                    for (var i = 0; i < monthCount; i++) {

                        var monthStartDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() + i, 1);

                        var numDaysInMonth = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1, 0).getDate();

                        var monthEndDate = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth(), numDaysInMonth);

                        var lastSunday = new Date(monthEndDate.getTime() - (monthEndDate.getDay() + 1) * 24 * 60 * 60 * 1000);


                        console.log(numDaysInMonth);


                        if (numDaysInMonth <= 28) {
                            Array = getForthWeekDates();
                        } else {
                            Array = getFifthWeekDates();
                        }

                    }

                    return Array;

                }
                $scope.clearTimeSlotsByEveryType = function () {
                    $scope.ScheduledDateArray = [];
                }
                $scope.OnChangeslot = function (type, val) {
                    $scope.getTimeSlotsByEveryType(type, val);
                };

                $scope.getAllOnlineVisitReasons = function () {
                    var obj = {
                        "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
                       
                        "SearchText": "",
                        "IsActive": 0

                    };
                    eHnotePatientVisitReasonServices.GetOnlineAppointmentVisitReasons(obj).then(function (resp) {
                        $scope.AllOnlineApptVistReasonsArray = [];
                        if (resp.data.rows.length > 0) {
                            $scope.AllOnlineApptVistReasonsArray = resp.data.rows || [];

                            $scope.AllOnlineApptVistReasonsArray = (resp.data.rows || []).sort(function (a, b) {
                                return (a.OnlineVisitReason || "").localeCompare(
                                    (b.OnlineVisitReason || ""),
                                    undefined,
                                    {
                                        numeric: true,
                                        sensitivity: "base"
                                    }
                                );
                            });
                        }
                    });
                };
                $scope.restructureAdvanceTimeSlots = function (arrayobj) {

                    if ($scope.UserDetailedSlotObj.UserScheduleDetails.length > 0) {
                        angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (Sitem) {
                            Sitem.allDaySlots = [];
                            var arr = Sitem.StartTime.split(':');
                            var shour = $.trim(arr[0]);
                            var smin = $.trim(arr[1]);

                            var arr2 = Sitem.EndTime.split(':')
                            var ehour = $.trim(arr2[0]);
                            var emin = $.trim(arr2[1]);

                            var startingTime = moment().hours(shour).minutes(smin);
                            var endingTime = moment().hours(ehour).minutes(emin);
                            var currentStartTime = angular.copy(startingTime);
                            // Sitem.allDaySlots feeds the "Select Timeslot" dropdown for BOTH tabs
                            // (Slot Wise and Advanced Slots share the same list — see template).
                            // Normal Slot Wise: Start Time steps by the org's AverageConsultationTime
                            // itself (e.g. 8:00, 8:15, 8:30...). Advanced Slots (Duration-Based): steps
                            // every 5 minutes regardless of the chosen Duration (matches onDurationChange),
                            // with EndTime using the currently-selected advanced Duration.
                            var slotWiseDuration = parseInt($scope.UserDetailedSlotObj.AverageConsultationTime, 10) || 15;
                            var isDurationBasedSlots = !!$scope.UserDetailedSlotObj.isDurationBasedSlots;
                            var advancedDuration = (isDurationBasedSlots && $scope.addNewAdvancedSlotReqObj)
                                ? (parseInt($scope.addNewAdvancedSlotReqObj.DurationMinutes, 10) || slotWiseDuration)
                                : slotWiseDuration;
                            var slotEndDuration = isDurationBasedSlots ? advancedDuration : slotWiseDuration;
                            var slotWiseStepMinutes = isDurationBasedSlots ? 5 : slotWiseDuration;
                            while (currentStartTime < endingTime) {

                                var slotObj = {
                                    "StartTime": currentStartTime.format("HH:mm"),
                                    "EndTime": angular.copy(currentStartTime).add(slotEndDuration, "minute").format("HH:mm"),
                                    "IsSelected": false,
                                    "SlotTypeId": 0,
                                    "Available": "Y"
                                }
                                slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                slotObj.NewStartTime = "";
                                slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
                                function formatTime(timeString) {
                                    const [hourString, minute] = timeString.split(":");
                                    const hour = +hourString % 24;
                                    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
                                }

                                slotObj.NewFormattedStime = formatTime(slotObj.StartTime);
                                slotObj.NewFormattedEtime = formatTime(slotObj.EndTime);

                                console.log(slotObj.NewFormattedStime);
                                console.log(slotObj.NewFormattedEtime);

                                Sitem.allDaySlots.push(slotObj);
                                currentStartTime.add(slotWiseStepMinutes, "minute");
                            }
                        });

                        // code for new design (advanced view)

                        angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (item) {
                            item.ScheduledSlotVisitReasonsArray = item.ScheduledSlotVisitReasonsArray || [];
                            angular.forEach(item.SlotsList, function (kitem) {
                                let obj;
                                obj = {
                                    "SlotId": 0,
                                    "SlotType": "1",
                                    "SlotTypeName": "Availability",
                                    "VisitReasons": kitem.VisitReasons || [],
                                    "TimeSlot": "",
                                    "MaxNumberOfSlots": kitem.MaxNumberOfSlots,
                                    "ScheduleVisitTypeDetailId": kitem.ScheduleVisitTypeDetailId || 0,
                                    "UserScheduleDetailId": kitem.UserScheduleDetailId || 0,
                                    "DurationMinutes": kitem.DurationMinutes || 0,
                                    "PayorTypes": kitem.PayorTypes||[]
                                };
                                let tempArray = $filter('filter')(item.allDaySlots, { 'StartTime': kitem.StartTime }, true);
                                if (tempArray.length > 0) {
                                    obj.TimeSlot = tempArray[0];
                                }
                                item.ScheduledSlotVisitReasonsArray.push(obj);
                            });

                            angular.forEach(item.OnlineSlots, function (kitem) {
                                if (kitem.StartTime != "" && kitem.EndTime != "") {
                                    let obj;
                                    obj = {
                                        "SlotId": 0,
                                        "SlotType": "3",
                                        "SlotTypeName": "Online Slot",
                                        "VisitReasons": [],
                                        "TimeSlot": "",
                                        "MaxNumberOfSlots": kitem.MaxNumberOfSlots,
                                        "ScheduleVisitTypeDetailId": kitem.ScheduleVisitTypeDetailId || 0,
                                        "UserScheduleDetailId": kitem.UserScheduleDetailId || 0,
                                        "OnlineVisitReasons": kitem.OnlineVisitReasons || [],
                                        "DurationMinutes": kitem.DurationMinutes || 0,
                                        "PayorTypes": kitem.PayorTypes ||[]
                                    };
                                    let tempArray = $filter('filter')(item.allDaySlots, { 'StartTime': kitem.StartTime }, true);
                                    if (tempArray.length > 0) {
                                        obj.TimeSlot = tempArray[0];
                                    }
                                    item.ScheduledSlotVisitReasonsArray.push(obj);
                                }
                            });

                            angular.forEach(item.BreakSlots, function (kitem) {
                                if (kitem.StartTime != "" && kitem.EndTime != "") {
                                    let obj;
                                    obj = {
                                        "SlotId": 0,
                                        "SlotType": "2",
                                        "SlotTypeName": "Break Slot",
                                        "VisitReasons": [],
                                        "TimeSlot": "",
                                        "MaxNumberOfSlots": null,
                                        "ScheduleVisitTypeDetailId": kitem.ScheduleVisitTypeDetailId || 0,
                                        "UserScheduleDetailId": kitem.UserScheduleDetailId || 0,
                                        "DurationMinutes": kitem.DurationMinutes || 0,
                                        "PayorTypes": kitem.PayorTypes ||[]
                                    };
                                    let tempArray = $filter('filter')(item.allDaySlots, { 'StartTime': kitem.StartTime }, true);
                                    if (tempArray.length > 0) {
                                        obj.TimeSlot = tempArray[0];
                                    }
                                    item.ScheduledSlotVisitReasonsArray.push(obj);
                                }
                            });

                        });

                    }
                    console.log($scope.UserDetailedSlotObj.UserScheduleDetails);
                    $scope.getAllOnlineVisitReasons();
                };

                $scope.FinalObj.UserScheduleId = $scope.FinalObj.UserScheduleId || 0;
                if ($scope.FinalObj.UserScheduleId != 0) {
                    $scope.UserDetailedSlotObj.Type = $scope.FinalObj.Type;
                    $scope.UserDetailedSlotObj.FromDate = $filter('date')($scope.FinalObj.FromDate, "MM-dd-yyyy") || null;
                    $scope.UserDetailedSlotObj.ToDate = $filter('date')($scope.FinalObj.ToDate, "MM-dd-yyyy") || null;
                    $scope.UserDetailedSlotObj.BranchId = $scope.FinalObj.BranchId;
                    $scope.UserDetailedSlotObj.IsDetailedSchedule = $scope.FinalObj.IsDetailedSchedule;
                    $scope.UserDetailedSlotObj.ScheduleDuration = $scope.FinalObj.ScheduleDuration;
                    $scope.UserDetailedSlotObj.ScheduleEveryType = $scope.FinalObj.ScheduleEveryType.toString();
                    $scope.UserDetailedSlotObj.ScheduleDurationType = $scope.FinalObj.ScheduleDurationType;
                    $scope.UserDetailedSlotObj.UserScheduleId = $scope.FinalObj.UserScheduleId || 0;
                    $scope.UserDetailedSlotObj.DoctorId = $scope.FinalObj.DoctorId;
                    $scope.UserDetailedSlotObj.NewAppointmentMaxSlots = $scope.FinalObj.NewAppointmentMaxSlots || null;
                    $scope.UserDetailedSlotObj.ClinicFollowUpAppointmentMaxSlots = $scope.FinalObj.ClinicFollowUpAppointmentMaxSlots || null;
                    $scope.UserDetailedSlotObj.ASCAppointmentMaxSlots = $scope.FinalObj.ASCAppointmentMaxSlots || null;
                    $scope.UserDetailedSlotObj.PostOpFollowUpAppointmentMaxSlots = $scope.FinalObj.PostOpFollowUpAppointmentMaxSlots || null;
                    $scope.UserDetailedSlotObj.InvestigationMaxSlots = $scope.FinalObj.InvestigationMaxSlots || null;
                    $scope.UserDetailedSlotObj.AverageConsultationTime = $scope.FinalObj.AverageConsultationTime || "";
                    $scope.UserDetailedSlotObj.UserScheduleName = $scope.FinalObj.UserScheduleName || "";
                    $scope.UserDetailedSlotObj.IsInsuranceBasedScheduling = $scope.FinalObj.IsInsuranceBasedScheduling || "";
                    // A real boolean, not "" - the Select Timeslot builder switches on this flag
                    // (5-minute steps when duration-based, AverageConsultationTime steps otherwise),
                    // so a leftover truthy value from a previously opened schedule made a plain
                    // Slot Wise schedule list 8:00-8:15, 8:05-8:20, 8:10-8:25 instead of 8:00, 8:15, 8:30.
                    $scope.UserDetailedSlotObj.isDurationBasedSlots = !!$scope.FinalObj.isDurationBasedSlots;
                    //$scope.UserDetailedSlotObj.UserScheduleDetails = [];

                    //angular.forEach($scope.FinalObj.UserScheduleDetails, function (fitem) {
                    //    fitem.NewAppointmentSlots = [];
                    //    fitem.ClinicalFollowAppointmentSlots = [];
                    //    fitem.PostOpFollowAppointmentSlots = [];
                    //    fitem.ASCFollowAppointmentSlots = [];
                    //    $scope.UserDetailedSlotObj.UserScheduleDetails.push(fitem);
                    //});

                    angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (kitem, index) {
                        if ($scope.FinalObj.UserScheduleDetails[0].IsAdvancedSchedule) {
                            kitem.IsAdvancedSchedule = true;
                        }
                        angular.forEach($scope.FinalObj.UserScheduleDetails, function (fitem, index1) {
                            fitem.NewAppointmentSlots = [];
                            fitem.ClinicalFollowAppointmentSlots = [];
                            fitem.PostOpFollowAppointmentSlots = [];
                            fitem.ASCFollowAppointmentSlots = [];
                            fitem.InvestigationSlots = [];
                            if (kitem.DayId === fitem.DayId) {
                                fitem.IsShowAllDays = false;
                                $scope.UserDetailedSlotObj.UserScheduleDetails[index] = angular.copy($scope.FinalObj.UserScheduleDetails[index1]);
                            }
                        });
                    });



                    if ($scope.UserDetailedSlotObj.UserScheduleDetails.length > 0) {
                        angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (Aitem) {
                            var list1 = $filter("filter")($scope.Brancheslist, function (kitem, index) { return kitem.BranchId == Aitem.BranchId && kitem.UserBranchId == Aitem.UserBranchId });
                            if (list1.length > 0) {
                                Aitem.BranchObj = list1[0];
                            }
                            Aitem.OnlineSlots = Aitem.OnlineSlots || [];
                            Aitem.BreakSlots = Aitem.BreakSlots || [];

                            if (Aitem.IsAdvancedSchedule) {
                                $scope.Obj.isAdvancedView = true;
                            }

                            if (Aitem.OnlineSlots.length == 0) {
                                var obj = {
                                    "UserScheduleOnlineBreakDetailId": 0,
                                    "UserScheduleId": 0,
                                    "BranchId": null,
                                    "UserBranchId": null,
                                    "SlotStartValues": [],
                                    "SlotEndValues": [],
                                    "StartTime": "",
                                    "EndTime": "",
                                    "TypeId": 1,
                                    "DeleteInd": "N"
                                }
                                Aitem.OnlineSlots.push(obj);
                            }
                            if (Aitem.BreakSlots.length == 0) {
                                var obj = {
                                    "UserScheduleOnlineBreakDetailId": 0,
                                    "UserScheduleId": 0,
                                    "BranchId": null,
                                    "UserBranchId": null,
                                    "SlotStartValues": [],
                                    "SlotEndValues": [],
                                    "StartTime": "",
                                    "EndTime": "",
                                    "TypeId": 2,
                                    "DeleteInd": "N"
                                }
                                Aitem.BreakSlots.push(obj);
                            }



                            Aitem.ScheduleVisitTypeDetails = Aitem.ScheduleVisitTypeDetails || [];
                            if (Aitem.ScheduleVisitTypeDetails.length == 0) {
                                Aitem.ScheduleVisitTypeDetails = angular.copy($scope.Obj.ScheduleVisitTypeDetails);
                            }
                            if (Aitem.ScheduleVisitTypeDetails.length > 0) {
                                var list1 = $filter("filter")(Aitem.ScheduleVisitTypeDetails, function (kitem, index) { return kitem.VisitTypeId == 1 });
                                if (list1.length == 0) {
                                    var obj = {
                                        "ScheduleVisitTypeDetailId": 0,
                                        "UserScheduleDetailId": 0,
                                        "SlotStartValues": [],
                                        "SlotEndValues": [],
                                        "StartTime": "",
                                        "EndTime": "",
                                        "VisitTypeId": 1,
                                    };

                                    Aitem.NewAppointmentSlots.push(obj);
                                } else {
                                    Aitem.NewAppointmentSlots = list1;
                                }

                                var list2 = $filter("filter")(Aitem.ScheduleVisitTypeDetails, function (kitem, index) { return kitem.VisitTypeId == 2 });
                                if (list2.length == 0) {
                                    var obj = {
                                        "ScheduleVisitTypeDetailId": 0,
                                        "UserScheduleDetailId": 0,
                                        "SlotStartValues": [],
                                        "SlotEndValues": [],
                                        "StartTime": "",
                                        "EndTime": "",
                                        "VisitTypeId": 2,

                                    };
                                    // Aitem.ScheduleVisitTypeDetails.push(obj);
                                    Aitem.ClinicalFollowAppointmentSlots.push(obj);
                                } else {
                                    Aitem.ClinicalFollowAppointmentSlots = list2;
                                }
                                var list3 = $filter("filter")(Aitem.ScheduleVisitTypeDetails, function (kitem, index) { return kitem.VisitTypeId == 3 });
                                if (list3.length == 0) {
                                    var obj = {
                                        "ScheduleVisitTypeDetailId": 0,
                                        "UserScheduleDetailId": 0,
                                        "SlotStartValues": [],
                                        "SlotEndValues": [],
                                        "StartTime": "",
                                        "EndTime": "",
                                        "VisitTypeId": 3,
                                    };
                                    //  Aitem.ScheduleVisitTypeDetails.push(obj);
                                    Aitem.PostOpFollowAppointmentSlots.push(obj);
                                } else {
                                    Aitem.PostOpFollowAppointmentSlots = list3;
                                }
                                var list4 = $filter("filter")(Aitem.ScheduleVisitTypeDetails, function (kitem, index) { return kitem.VisitTypeId == 4 });
                                if (list4.length == 0) {
                                    var obj = {
                                        "ScheduleVisitTypeDetailId": 0,
                                        "UserScheduleDetailId": 0,
                                        "SlotStartValues": [],
                                        "SlotEndValues": [],
                                        "StartTime": "",
                                        "EndTime": "",
                                        "VisitTypeId": 4,
                                    };
                                    //Aitem.ScheduleVisitTypeDetails.push(obj);
                                    Aitem.ASCFollowAppointmentSlots.push(obj);
                                } else {
                                    Aitem.ASCFollowAppointmentSlots = list4;
                                }

                                var list5 = $filter("filter")(Aitem.ScheduleVisitTypeDetails, function (kitem, index) { return kitem.VisitTypeId == 5 });
                                if (list5.length == 0) {
                                    var obj = {
                                        "ScheduleVisitTypeDetailId": 0,
                                        "UserScheduleDetailId": 0,
                                        "SlotStartValues": [],
                                        "SlotEndValues": [],
                                        "StartTime": "",
                                        "EndTime": "",
                                        "VisitTypeId": 5,
                                    };
                                    //Aitem.ScheduleVisitTypeDetails.push(obj);
                                    Aitem.InvestigationSlots.push(obj);
                                } else {
                                    Aitem.InvestigationSlots = list5;
                                }

                                //angular.forEach(Aitem.ScheduleVisitTypeDetails, function (Mitem) {
                                //    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                //    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                //    Mitem.ScheduleVisitTypeDetailId = 0;
                                //    Mitem.UserScheduleDetailId = 0;
                                //});

                                angular.forEach(Aitem.NewAppointmentSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = Aitem.StartTime.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (st >= mst && st < met) {
                                                    tempStartValues.push(hitem);
                                                }
                                            } else {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }

                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;

                                    // bind start and end time values in edt case for slot range
                                    angular.forEach(Aitem.SlotsList, function (hitem) {
                                        if (hitem.VisitReasons[0].VisitTypeId === 1) {
                                            Mitem.StartTime = hitem.StartTime;
                                            Mitem.EndTime = hitem.EndTime;
                                        }
                                    });
                                });
                                angular.forEach(Aitem.ClinicalFollowAppointmentSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = Aitem.StartTime.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (st >= mst && st < met) {
                                                    tempStartValues.push(hitem);
                                                }
                                            } else {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }
                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;

                                    // bind start and end time values in edt case for slot range
                                    angular.forEach(Aitem.SlotsList, function (hitem) {
                                        if (hitem.VisitReasons[0].VisitTypeId === 2) {
                                            Mitem.StartTime = hitem.StartTime;
                                            Mitem.EndTime = hitem.EndTime;
                                        }
                                    });
                                });
                                angular.forEach(Aitem.PostOpFollowAppointmentSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = Aitem.StartTime.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (st >= mst && st < met) {
                                                    tempStartValues.push(hitem);
                                                }
                                            } else {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }
                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;

                                    // bind start and end time values in edt case for slot range
                                    angular.forEach(Aitem.SlotsList, function (hitem) {
                                        if (hitem.VisitReasons[0].VisitTypeId === 3) {
                                            Mitem.StartTime = hitem.StartTime;
                                            Mitem.EndTime = hitem.EndTime;
                                        }
                                    });
                                });
                                angular.forEach(Aitem.ASCFollowAppointmentSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = Aitem.StartTime.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (st >= mst && st < met) {
                                                    tempStartValues.push(hitem);
                                                }
                                            } else {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }
                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;

                                    // bind start and end time values in edt case for slot range
                                    angular.forEach(Aitem.SlotsList, function (hitem) {
                                        if (hitem.VisitReasons[0].VisitTypeId === 4) {
                                            Mitem.StartTime = hitem.StartTime;
                                            Mitem.EndTime = hitem.EndTime;
                                        }
                                    });
                                });
                                angular.forEach(Aitem.InvestigationSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = Aitem.StartTime.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (st >= mst && st < met) {
                                                    tempStartValues.push(hitem);
                                                }
                                            } else {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }
                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;

                                    // bind start and end time values in edt case for slot range
                                    angular.forEach(Aitem.SlotsList, function (hitem) {
                                        if (hitem.VisitReasons[0].VisitTypeId === 5) {
                                            Mitem.StartTime = hitem.StartTime;
                                            Mitem.EndTime = hitem.EndTime;
                                        }
                                    });
                                });
                                angular.forEach(Aitem.OnlineSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = Aitem.StartTime.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (st >= mst && st < met) {
                                                    tempStartValues.push(hitem);
                                                }
                                            } else {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }
                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;
                                });
                                angular.forEach(Aitem.BreakSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = Aitem.StartTime.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (st >= mst && st < met) {
                                                    tempStartValues.push(hitem);
                                                }
                                            } else {
                                                tempStartValues.push(hitem);
                                            }

                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = Aitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }
                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;
                                });

                            }

                        });
                        $scope.selectedSlotDayObj = $scope.UserDetailedSlotObj.UserScheduleDetails[0];
                        $scope.UserDetailedSlotObj.UserScheduleDetails[0].IsEdit = true;
                        var List = $filter("filter")($scope.UserDetailedSlotObj.UserScheduleDetails, { "IsAdvancedSchedule": true }) || [];

                        if (List.length > 0) {
                            $scope.restructureAdvanceTimeSlots($scope.UserDetailedSlotObj.UserScheduleDetails[0]);
                        }


                    }

                    if ($scope.UserDetailedSlotObj.UserScheduleDetails.length > 0) {
                        angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (uitem) {
                            uitem.SlotStartValues = angular.copy($scope.UserDetailedSlotObj.SlotStartValues) || [];
                            uitem.SlotEndValues = angular.copy($scope.UserDetailedSlotObj.SlotStartValues) || [];
                            uitem.StartTime = uitem.StartTime || "";
                            if (uitem.SlotStartValues.length > 0 && uitem.StartTime != '') {
                                uitem.SlotEndValues = [];
                                var count = 0;
                                angular.forEach(uitem.SlotStartValues, function (sitem) {
                                    if (uitem.StartTime == sitem.time) {
                                        count++;
                                        return;
                                    }
                                    if (count > 0) {
                                        uitem.SlotEndValues.push(sitem);
                                    }
                                });
                            }
                        });
                    }
                }

                // $scope.OnChangeslot($scope.FinalObj.ScheduleEveryType, $scope.FinalObj.ScheduleDuration);

                if ($scope.UserDetailedSlotObj.UserScheduleDetails.length > 0) {
                    angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (item) {
                        item.IsEdit = false;
                    });
                    $scope.UserDetailedSlotObj.UserScheduleDetails[0].IsEdit = true;
                }


                $scope.selectobj = {
                    "selecteditem": "Mon"
                }
                $scope.Changeitem = function (Aitem) {
                    angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (item) {
                        item.IsEdit = false;
                    });
                    Aitem.IsEdit = true;
                    $scope.selectedSlotDayObj = Aitem;
                }

                $scope.closeuib = function () {
                    $uibModalInstance.dismiss("cancel");
                };


                $scope.DetailedCopyweekAdvancevalues = function (item, mainitem) {
                    console.log(item);
                    console.log(mainitem);


                    $scope.NewAppointmentSlots = [];
                    var NewAppointmentList = $filter("filter")(item.allDaySlots, { "SlotTypeId": 1 }, true);
                    if (NewAppointmentList.length > 0) {
                        angular.forEach(NewAppointmentList, function (oitem) {
                            var obj = {
                                "ScheduleVisitTypeDetailId": 0,
                                "UserScheduleDetailId": 0,
                                "SlotStartValues": [],
                                "SlotEndValues": [],
                                "StartTime": oitem.StartTime,
                                "EndTime": oitem.EndTime,
                                "VisitTypeId": 1,

                            };

                            $scope.NewAppointmentSlots.push(obj);
                        });
                    }

                    $scope.ClinicalFollowAppointmentSlots = [];
                    var ClinicalFollowUpList = $filter("filter")(item.allDaySlots, { "SlotTypeId": 2 }, true);
                    if (ClinicalFollowUpList.length > 0) {

                        angular.forEach(ClinicalFollowUpList, function (oitem) {
                            var obj = {
                                "ScheduleVisitTypeDetailId": 0,
                                "UserScheduleDetailId": 0,
                                "SlotStartValues": [],
                                "SlotEndValues": [],
                                "StartTime": oitem.StartTime,
                                "EndTime": oitem.EndTime,
                                "VisitTypeId": 2,

                            };

                            $scope.ClinicalFollowAppointmentSlots.push(obj);
                        });
                    }

                    $scope.PostOpFollowAppointmentSlots = [];
                    var PostOpFollowUpList = $filter("filter")(item.allDaySlots, { "SlotTypeId": 3 }, true);
                    if (PostOpFollowUpList.length > 0) {
                        angular.forEach(PostOpFollowUpList, function (oitem) {
                            var obj = {
                                "ScheduleVisitTypeDetailId": 0,
                                "UserScheduleDetailId": 0,
                                "SlotStartValues": [],
                                "SlotEndValues": [],
                                "StartTime": oitem.StartTime,
                                "EndTime": oitem.EndTime,
                                "VisitTypeId": 3,
                            };
                            $scope.PostOpFollowAppointmentSlots.push(obj);
                        });
                    }


                    $scope.ASCFollowAppointmentSlots = [];
                    var AscAppointmentList = $filter("filter")(item.allDaySlots, { "SlotTypeId": 4 }, true);
                    if (AscAppointmentList.length > 0) {
                        angular.forEach(AscAppointmentList, function (oitem) {
                            var obj = {
                                "ScheduleVisitTypeDetailId": 0,
                                "UserScheduleDetailId": 0,
                                "SlotStartValues": [],
                                "SlotEndValues": [],
                                "StartTime": oitem.StartTime,
                                "EndTime": oitem.EndTime,
                                "VisitTypeId": 4,
                            };

                            $scope.ASCFollowAppointmentSlots.push(obj);
                        });
                    }

                    $scope.InvestigationSlots = [];
                    var InvestigationSlotsList = $filter("filter")(item.allDaySlots, { "SlotTypeId": 5 }, true);
                    if (InvestigationSlotsList.length > 0) {
                        angular.forEach(InvestigationSlotsList, function (oitem) {
                            var obj = {
                                "ScheduleVisitTypeDetailId": 0,
                                "UserScheduleDetailId": 0,
                                "SlotStartValues": [],
                                "SlotEndValues": [],
                                "StartTime": oitem.StartTime,
                                "EndTime": oitem.EndTime,
                                "VisitTypeId": 5,
                            };

                            $scope.InvestigationSlots.push(obj);
                        });
                    }

                    $scope.OnlineSlots = [];
                    var OnlineSlotsList = $filter("filter")(item.allDaySlots, { "SlotTypeId": 6 }, true);
                    if (OnlineSlotsList.length > 0) {

                        angular.forEach(OnlineSlotsList, function (oitem) {
                            var obj = {
                                "UserScheduleOnlineBreakDetailId": 0,
                                "UserScheduleId": 0,
                                "BranchId": item.BranchId || null,
                                "UserBranchId": item.UserBranchId || null,
                                "StartTime": oitem.StartTime,
                                "EndTime": oitem.EndTime,
                                "TypeId": 1,
                                "DeleteInd": "N"
                            }
                            $scope.OnlineSlots.push(obj);
                        });

                    }

                    $scope.BreakSlots = [];
                    var BreakSlotsList = $filter("filter")(item.allDaySlots, { "SlotTypeId": 7 }, true);
                    if (BreakSlotsList.length > 0) {
                        angular.forEach(BreakSlotsList, function (oitem) {
                            var obj = {
                                "UserScheduleOnlineBreakDetailId": 0,
                                "UserScheduleId": 0,
                                "BranchId": item.BranchId || null,
                                "UserBranchId": item.UserBranchId || null,
                                "StartTime": oitem.StartTime,
                                "EndTime": oitem.EndTime,
                                "TypeId": 2,
                                "DeleteInd": "N"
                            }
                            $scope.BreakSlots.push(obj);
                        });
                    }





                    angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (uitem) {
                        if (uitem.IsEdit) {
                            uitem.OnlineSlots = $scope.OnlineSlots || [];
                            uitem.BreakSlots = $scope.BreakSlots || [];
                            uitem.IsAdvancedSchedule = true;
                            uitem.NewAppointmentSlots = $scope.NewAppointmentSlots || [];
                            uitem.ClinicalFollowAppointmentSlots = $scope.ClinicalFollowAppointmentSlots || [];
                            uitem.PostOpFollowAppointmentSlots = $scope.PostOpFollowAppointmentSlots || [];
                            uitem.ASCFollowAppointmentSlots = $scope.ASCFollowAppointmentSlots || [];
                            uitem.InvestigationSlots = $scope.InvestigationSlots || [];
                        }
                    });



                    if (item.DayId == 1) {
                        if (mainitem.UserScheduleDetails.length > 0) {
                            angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                                Sitem.StartTime = item.StartTime;
                                Sitem.EndTime = item.EndTime;
                                Sitem.BranchObj = item.BranchObj;
                                Sitem.IsAdvancedSchedule = true;
                                Sitem.BranchId = item.BranchId;
                                Sitem.UserBranchId = item.UserBranchId;
                                Sitem.OnlineSlots = $scope.OnlineSlots || [];
                                Sitem.BreakSlots = $scope.BreakSlots || [];;
                                Sitem.NewAppointmentSlots = $scope.NewAppointmentSlots || [];
                                Sitem.ClinicalFollowAppointmentSlots = $scope.ClinicalFollowAppointmentSlots || [];
                                Sitem.PostOpFollowAppointmentSlots = $scope.PostOpFollowAppointmentSlots || [];
                                Sitem.ASCFollowAppointmentSlots = $scope.ASCFollowAppointmentSlots || [];
                                Sitem.InvestigationSlots = $scope.InvestigationSlots || [];
                                Sitem.allDaySlots = item.allDaySlots || [];
                            });
                        }
                    }
                    if (item.DayId == 2) {
                        if (mainitem.UserScheduleDetails.length > 0) {
                            angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                                if (Sitem.DayId != 1 && Sitem.DayId != 2) {
                                    Sitem.StartTime = item.StartTime;
                                    Sitem.EndTime = item.EndTime;
                                    Sitem.BranchObj = item.BranchObj;
                                    Sitem.IsAdvancedSchedule = true;
                                    Sitem.BranchId = item.BranchId;
                                    Sitem.UserBranchId = item.UserBranchId;
                                    Sitem.OnlineSlots = $scope.OnlineSlots || [];
                                    Sitem.BreakSlots = $scope.BreakSlots || [];;
                                    Sitem.NewAppointmentSlots = $scope.NewAppointmentSlots || [];
                                    Sitem.ClinicalFollowAppointmentSlots = $scope.ClinicalFollowAppointmentSlots || [];
                                    Sitem.PostOpFollowAppointmentSlots = $scope.PostOpFollowAppointmentSlots || [];
                                    Sitem.ASCFollowAppointmentSlots = $scope.ASCFollowAppointmentSlots || [];
                                    Sitem.InvestigationSlots = $scope.InvestigationSlots || [];
                                    Sitem.allDaySlots = item.allDaySlots || [];
                                }

                            });
                        }
                    }
                    if (item.DayId == 3) {
                        if (mainitem.UserScheduleDetails.length > 0) {
                            angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                                if (Sitem.DayId != 1 && Sitem.DayId != 2 && Sitem.DayId != 3) {
                                    Sitem.StartTime = item.StartTime;
                                    Sitem.EndTime = item.EndTime;
                                    Sitem.BranchObj = item.BranchObj;
                                    Sitem.BranchId = item.BranchId;
                                    Sitem.IsAdvancedSchedule = true;
                                    Sitem.UserBranchId = item.UserBranchId;
                                    Sitem.OnlineSlots = $scope.OnlineSlots || [];
                                    Sitem.BreakSlots = $scope.BreakSlots || [];;
                                    Sitem.NewAppointmentSlots = $scope.NewAppointmentSlots || [];
                                    Sitem.ClinicalFollowAppointmentSlots = $scope.ClinicalFollowAppointmentSlots || [];
                                    Sitem.PostOpFollowAppointmentSlots = $scope.PostOpFollowAppointmentSlots || [];
                                    Sitem.ASCFollowAppointmentSlots = $scope.ASCFollowAppointmentSlots || [];
                                    Sitem.InvestigationSlots = $scope.InvestigationSlots || [];
                                    Sitem.allDaySlots = item.allDaySlots || [];
                                }

                            });
                        }
                    }
                    if (item.DayId == 4) {
                        if (mainitem.UserScheduleDetails.length > 0) {
                            angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                                if (Sitem.DayId != 1 && Sitem.DayId != 2 && Sitem.DayId != 3 && Sitem.DayId != 4) {
                                    Sitem.StartTime = item.StartTime;
                                    Sitem.EndTime = item.EndTime;
                                    Sitem.BranchObj = item.BranchObj;
                                    Sitem.BranchId = item.BranchId;
                                    Sitem.IsAdvancedSchedule = true;
                                    Sitem.UserBranchId = item.UserBranchId;
                                    Sitem.OnlineSlots = $scope.OnlineSlots || [];
                                    Sitem.BreakSlots = $scope.BreakSlots || [];;
                                    Sitem.NewAppointmentSlots = $scope.NewAppointmentSlots || [];
                                    Sitem.ClinicalFollowAppointmentSlots = $scope.ClinicalFollowAppointmentSlots || [];
                                    Sitem.PostOpFollowAppointmentSlots = $scope.PostOpFollowAppointmentSlots || [];
                                    Sitem.ASCFollowAppointmentSlots = $scope.ASCFollowAppointmentSlots || [];
                                    Sitem.InvestigationSlots = $scope.InvestigationSlots || [];
                                    Sitem.allDaySlots = item.allDaySlots || [];
                                }

                            });
                        }
                    }
                    if (item.DayId == 5) {
                        if (mainitem.UserScheduleDetails.length > 0) {
                            angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                                if (Sitem.DayId == 5 || Sitem.DayId == 6 || Sitem.DayId == 7) {
                                    Sitem.StartTime = item.StartTime;
                                    Sitem.EndTime = item.EndTime;
                                    Sitem.BranchObj = item.BranchObj;
                                    Sitem.BranchId = item.BranchId;
                                    Sitem.IsAdvancedSchedule = true;
                                    Sitem.UserBranchId = item.UserBranchId;
                                    Sitem.OnlineSlots = $scope.OnlineSlots || [];
                                    Sitem.BreakSlots = $scope.BreakSlots || [];;
                                    Sitem.NewAppointmentSlots = $scope.NewAppointmentSlots || [];
                                    Sitem.ClinicalFollowAppointmentSlots = $scope.ClinicalFollowAppointmentSlots || [];
                                    Sitem.PostOpFollowAppointmentSlots = $scope.PostOpFollowAppointmentSlots || [];
                                    Sitem.ASCFollowAppointmentSlots = $scope.ASCFollowAppointmentSlots || [];
                                    Sitem.InvestigationSlots = $scope.InvestigationSlots || [];
                                    Sitem.allDaySlots = item.allDaySlots || [];
                                }

                            });
                        }
                    }


                }

                $scope.DetailedCopyweekvalues = function (item, mainitem) {
                    console.log(item);
                    console.log(mainitem);
                    if (item.DayId == 1) {
                        if (mainitem.UserScheduleDetails.length > 0) {
                            angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                                Sitem.StartTime = item.StartTime;
                                Sitem.EndTime = item.EndTime;
                                Sitem.BranchObj = item.BranchObj;
                                Sitem.BranchId = item.BranchId;
                                Sitem.UserBranchId = item.UserBranchId;
                                Sitem.OnlineSlots = item.OnlineSlots;
                                Sitem.BreakSlots = item.BreakSlots;
                                Sitem.NewAppointmentSlots = angular.copy(item.NewAppointmentSlots);
                                Sitem.ClinicalFollowAppointmentSlots = angular.copy(item.ClinicalFollowAppointmentSlots);
                                Sitem.PostOpFollowAppointmentSlots = angular.copy(item.PostOpFollowAppointmentSlots);
                                Sitem.ASCFollowAppointmentSlots = angular.copy(item.ASCFollowAppointmentSlots);
                                Sitem.InvestigationSlots = angular.copy(item.InvestigationSlots);



                            });
                        }
                    }
                    if (item.DayId == 2) {
                        if (mainitem.UserScheduleDetails.length > 0) {
                            angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                                if (Sitem.DayId != 1 && Sitem.DayId != 2) {
                                    Sitem.StartTime = item.StartTime;
                                    Sitem.EndTime = item.EndTime;
                                    Sitem.BranchObj = item.BranchObj;
                                    Sitem.BranchId = item.BranchId;
                                    Sitem.UserBranchId = item.UserBranchId;
                                    Sitem.OnlineSlots = item.OnlineSlots;
                                    Sitem.BreakSlots = item.BreakSlots;
                                    Sitem.NewAppointmentSlots = angular.copy(item.NewAppointmentSlots);
                                    Sitem.ClinicalFollowAppointmentSlots = angular.copy(item.ClinicalFollowAppointmentSlots);
                                    Sitem.PostOpFollowAppointmentSlots = angular.copy(item.PostOpFollowAppointmentSlots);
                                    Sitem.ASCFollowAppointmentSlots = angular.copy(item.ASCFollowAppointmentSlots);
                                    Sitem.InvestigationSlots = angular.copy(item.InvestigationSlots);
                                }

                            });
                        }
                    }
                    if (item.DayId == 3) {
                        if (mainitem.UserScheduleDetails.length > 0) {
                            angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                                if (Sitem.DayId != 1 && Sitem.DayId != 2 && Sitem.DayId != 3) {
                                    Sitem.StartTime = item.StartTime;
                                    Sitem.EndTime = item.EndTime;
                                    Sitem.BranchObj = item.BranchObj;
                                    Sitem.BranchId = item.BranchId;
                                    Sitem.UserBranchId = item.UserBranchId;
                                    Sitem.OnlineSlots = item.OnlineSlots;
                                    Sitem.BreakSlots = item.BreakSlots;
                                    Sitem.NewAppointmentSlots = angular.copy(item.NewAppointmentSlots);
                                    Sitem.ClinicalFollowAppointmentSlots = angular.copy(item.ClinicalFollowAppointmentSlots);
                                    Sitem.PostOpFollowAppointmentSlots = angular.copy(item.PostOpFollowAppointmentSlots);
                                    Sitem.ASCFollowAppointmentSlots = angular.copy(item.ASCFollowAppointmentSlots);
                                    Sitem.InvestigationSlots = angular.copy(item.InvestigationSlots);
                                }

                            });
                        }
                    }
                    if (item.DayId == 4) {
                        if (mainitem.UserScheduleDetails.length > 0) {
                            angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                                if (Sitem.DayId != 1 && Sitem.DayId != 2 && Sitem.DayId != 3 && Sitem.DayId != 4) {
                                    Sitem.StartTime = item.StartTime;
                                    Sitem.EndTime = item.EndTime;
                                    Sitem.BranchObj = item.BranchObj;
                                    Sitem.BranchId = item.BranchId;
                                    Sitem.UserBranchId = item.UserBranchId;
                                    Sitem.OnlineSlots = item.OnlineSlots;
                                    Sitem.BreakSlots = item.BreakSlots;
                                    Sitem.NewAppointmentSlots = angular.copy(item.NewAppointmentSlots);
                                    Sitem.ClinicalFollowAppointmentSlots = angular.copy(item.ClinicalFollowAppointmentSlots);
                                    Sitem.PostOpFollowAppointmentSlots = angular.copy(item.PostOpFollowAppointmentSlots);
                                    Sitem.ASCFollowAppointmentSlots = angular.copy(item.ASCFollowAppointmentSlots);
                                    Sitem.InvestigationSlots = angular.copy(item.InvestigationSlots);
                                }

                            });
                        }
                    }
                    if (item.DayId == 5) {
                        if (mainitem.UserScheduleDetails.length > 0) {
                            angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                                if (Sitem.DayId == 5 || Sitem.DayId == 6 || Sitem.DayId == 7) {
                                    Sitem.StartTime = item.StartTime;
                                    Sitem.EndTime = item.EndTime;
                                    Sitem.BranchObj = item.BranchObj;
                                    Sitem.BranchId = item.BranchId;
                                    Sitem.UserBranchId = item.UserBranchId;
                                    Sitem.OnlineSlots = item.OnlineSlots;
                                    Sitem.BreakSlots = item.BreakSlots;
                                    Sitem.NewAppointmentSlots = angular.copy(item.NewAppointmentSlots);
                                    Sitem.ClinicalFollowAppointmentSlots = angular.copy(item.ClinicalFollowAppointmentSlots);
                                    Sitem.PostOpFollowAppointmentSlots = angular.copy(item.PostOpFollowAppointmentSlots);
                                    Sitem.ASCFollowAppointmentSlots = angular.copy(item.ASCFollowAppointmentSlots);
                                    Sitem.InvestigationSlots = angular.copy(item.InvestigationSlots);
                                }

                            });
                        }
                    }

                    if (item.DayId == 1 || item.DayId == 2 || item.DayId == 3 || item.DayId == 4 || item.DayId == 5) {
                        alertify.success("Copied for Whole Week");
                        return false;
                    }
                }

                $scope.ChangeAdvancedTime = function (item) {
                    item.IsAdvancedSchedule = item.IsAdvancedSchedule || false;
                    if (item.IsAdvancedSchedule) {
                        if (item.StartTime != '' && item.EndTime != '') {
                            item.allDaySlots = [];
                            var arr = item.StartTime.split(':');
                            var shour = $.trim(arr[0]);
                            var smin = $.trim(arr[1]);

                            var arr2 = item.EndTime.split(':')
                            var ehour = $.trim(arr2[0]);
                            var emin = $.trim(arr2[1]);

                            var startingTime = moment().hours(shour).minutes(smin);
                            var endingTime = moment().hours(ehour).minutes(emin);
                            var currentStartTime = angular.copy(startingTime);
                            while (currentStartTime < endingTime) {

                                var slotObj = {
                                    "StartTime": currentStartTime.format("HH:mm"),
                                    "EndTime": currentStartTime.add($scope.FinalObj.AverageConsultationTime, "minute").format("HH:mm"),
                                    "IsSelected": false,
                                    "SlotTypeId": 0,
                                    "Available": "Y",
                                    "NewFormattedStime": "",
                                    "NewFormattedEtime": ""
                                }
                                slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                slotObj.NewStartTime = "";
                                slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                function formatTime(timeString) {
                                    const [hourString, minute] = timeString.split(":");
                                    const hour = +hourString % 24;
                                    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
                                }

                                slotObj.NewFormattedStime = formatTime(slotObj.StartTime);
                                slotObj.NewFormattedEtime = formatTime(slotObj.EndTime);

                                console.log(slotObj.NewFormattedStime);
                                console.log(slotObj.NewFormattedEtime);
                                item.allDaySlots.push(slotObj);
                            }

                        }
                    }


                }

                $scope.SaveDetailedUserSlot = function (item, slottype) {
                    item.UserScheduleDetails = item.UserScheduleDetails || [];
                    if (item.UserScheduleDetails.length > 0) {
                        var list2 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.BranchId !== null });
                        if (list2.length == 0) {
                            alertify.error("Please Select Branch");
                            return false;
                        }
                        var list = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.StartTime !== '' });
                        if (list.length == 0) {
                            alertify.error("Please Select Start Time");
                            return false;
                        }
                        var list1 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.EndTime !== '' });
                        if (list1.length == 0) {
                            alertify.error("Please Select End Time");
                            return false;
                        }

                        if ($scope.Obj.isAdvancedView == false) {

                            $scope.NewAppointmentTimesInd = false;
                            $scope.ClinicalFollowAppointmentTimesInd = false;
                            $scope.PostOpFollowAppointmentTimesInd = false;
                            $scope.ASCFollowAppointmentTimesInd = false;
                            $scope.InvestigationApointmentTimesInd = false;
                            $scope.OnlineAppointmentTimesInd = false;
                            $scope.BreaktTimesInd = false;

                            angular.forEach(item.UserScheduleDetails, function (kitem) {
                                if (kitem.NewAppointmentSlots.length > 0) {
                                    var ListNew = $filter("filter")(kitem.NewAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime == '') });
                                    var ListNew1 = $filter("filter")(kitem.NewAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime == '' && Nitem.EndTime !== '') });
                                }
                                if (ListNew != '' || ListNew1 != '') {
                                    if (ListNew == '' && ListNew1 == '') {

                                    } else {
                                        $scope.NewAppointmentTimesInd = false;
                                        if (ListNew != 0) {
                                            $scope.NewAppointmentTimesInd = true;
                                        } else if (ListNew1 != 0) {
                                            $scope.NewAppointmentTimesInd = true;
                                        } else {
                                            $scope.NewAppointmentTimesInd = false;
                                        }
                                    }
                                }

                                if (kitem.ClinicalFollowAppointmentSlots.length > 0) {
                                    var ListClinical = $filter("filter")(kitem.ClinicalFollowAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime == '') });
                                    var ListClinical1 = $filter("filter")(kitem.ClinicalFollowAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime == '' && Nitem.EndTime !== '') });
                                }
                                if (ListClinical != '' || ListClinical1 != '') {
                                    if (ListClinical == '' && ListClinical1 == '') {

                                    } else {
                                        $scope.ClinicalFollowAppointmentTimesInd = false;
                                        if (ListClinical != 0) {
                                            $scope.ClinicalFollowAppointmentTimesInd = true;
                                        } else if (ListClinical1 != 0) {
                                            $scope.ClinicalFollowAppointmentTimesInd = true;
                                        } else {
                                            $scope.ClinicalFollowAppointmentTimesInd = false;
                                        }
                                    }
                                }

                                if (kitem.PostOpFollowAppointmentSlots.length > 0) {
                                    var ListPostOp = $filter("filter")(kitem.PostOpFollowAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime == '') });
                                    var ListPostOp1 = $filter("filter")(kitem.PostOpFollowAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime == '' && Nitem.EndTime !== '') });
                                }
                                if (ListPostOp != '' || ListPostOp1 != '') {
                                    if (ListPostOp == '' && ListPostOp1 == '') {

                                    } else {
                                        $scope.PostOpFollowAppointmentTimesInd = false;
                                        if (ListPostOp != 0) {
                                            $scope.PostOpFollowAppointmentTimesInd = true;
                                        } else if (ListPostOp1 != 0) {
                                            $scope.PostOpFollowAppointmentTimesInd = true;
                                        } else {
                                            $scope.PostOpFollowAppointmentTimesInd = false;
                                        }
                                    }
                                }

                                if (kitem.ASCFollowAppointmentSlots.length > 0) {
                                    var ListASC = $filter("filter")(kitem.ASCFollowAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime == '') });
                                    var ListASC1 = $filter("filter")(kitem.ASCFollowAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime == '' && Nitem.EndTime !== '') });
                                }
                                if (ListASC != '' || ListASC1 != '') {
                                    if (ListASC == '' && ListASC1 == '') {

                                    } else {
                                        $scope.ASCFollowAppointmentTimesInd = false;
                                        if (ListASC != 0) {
                                            $scope.ASCFollowAppointmentTimesInd = true;
                                        } else if (ListASC1 != 0) {
                                            $scope.ASCFollowAppointmentTimesInd = true;
                                        } else {
                                            $scope.ASCFollowAppointmentTimesInd = false;
                                        }
                                    }
                                }

                                if (kitem.InvestigationSlots.length > 0) {
                                    var ListInv = $filter("filter")(kitem.InvestigationSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime == '') });
                                    var ListInv1 = $filter("filter")(kitem.InvestigationSlots, function (Nitem, index) { return (Nitem.StartTime == '' && Nitem.EndTime !== '') });
                                }
                                if (ListInv != '' || ListInv1 != '') {
                                    if (ListInv == '' && ListInv1 == '') {

                                    } else {
                                        $scope.InvestigationApointmentTimesInd = false;
                                        if (ListInv != 0) {
                                            $scope.InvestigationApointmentTimesInd = true;
                                        } else if (ListInv1 != 0) {
                                            $scope.InvestigationApointmentTimesInd = true;
                                        } else {
                                            $scope.InvestigationApointmentTimesInd = false;
                                        }
                                    }
                                }

                                if (kitem.OnlineSlots.length > 0) {
                                    var ListOnline = $filter("filter")(kitem.OnlineSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime == '') });
                                    var ListOnline1 = $filter("filter")(kitem.OnlineSlots, function (Nitem, index) { return (Nitem.StartTime == '' && Nitem.EndTime !== '') });
                                }
                                if (ListOnline != '' || ListOnline1 != '') {
                                    if (ListOnline == '' && ListOnline1 == '') {

                                    } else {
                                        $scope.OnlineAppointmentTimesInd = false;
                                        if (ListOnline != 0) {
                                            $scope.OnlineAppointmentTimesInd = true;
                                        } else if (ListOnline1 != 0) {
                                            $scope.OnlineAppointmentTimesInd = true;
                                        } else {
                                            $scope.OnlineAppointmentTimesInd = false;
                                        }
                                    }
                                }

                                if (kitem.BreakSlots.length > 0) {
                                    var ListBreak = $filter("filter")(kitem.BreakSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime == '') });
                                    var ListBreak1 = $filter("filter")(kitem.BreakSlots, function (Nitem, index) { return (Nitem.StartTime == '' && Nitem.EndTime !== '') });
                                }
                                if (ListBreak != '' || ListBreak1 != '') {
                                    if (ListBreak == '' && ListBreak1 == '') {

                                    } else {
                                        $scope.BreaktTimesInd = false;
                                        if (ListBreak != 0) {
                                            $scope.BreaktTimesInd = true;
                                        } else if (ListBreak1 != 0) {
                                            $scope.BreaktTimesInd = true;
                                        } else {
                                            $scope.BreaktTimesInd = false;
                                        }
                                    }
                                }

                            });
                            if ($scope.NewAppointmentTimesInd) {
                                alertify.error("Please Select the Proper Start and End Time in the New Appointment");
                                return false;
                            }
                            if ($scope.ClinicalFollowAppointmentTimesInd) {
                                alertify.error("Please Select the Proper Start and End Time in the Clinical Follow-Up");
                                return false;
                            }
                            if ($scope.PostOpFollowAppointmentTimesInd) {
                                alertify.error("Please Select the Proper Start and End Time in the Post-OP Follow-Up");
                                return false;
                            }
                            if ($scope.ASCFollowAppointmentTimesInd) {
                                alertify.error("Please Select the Proper Start and End Time in the ASC");
                                return false;
                            }
                            if ($scope.InvestigationApointmentTimesInd) {
                                alertify.error("Please Select the Proper Start and End Time in the Investigation");
                                return false;
                            }
                            if ($scope.OnlineAppointmentTimesInd) {
                                alertify.error("Please Select the Proper Start and End Time in the Online Slots");
                                return false;
                            }
                            if ($scope.BreaktTimesInd) {
                                alertify.error("Please Select the Proper Start and End Time in the Break");
                                return false;
                            }
                        }
                        let slotscount1 = 0;
                        $scope.IsDetailedSlotsSelected = false;
                        if ($scope.Obj.isAdvancedView == false) {
                            angular.forEach(item.UserScheduleDetails, function (kitem) {
                                if (kitem.NewAppointmentSlots.length > 0) {
                                    let newapptlist = $filter("filter")(kitem.NewAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime !== '') });
                                    if (newapptlist.length > 0) {
                                        slotscount1++;
                                    }
                                }
                                if (kitem.ClinicalFollowAppointmentSlots.length > 0) {
                                    let clinicapptlist = $filter("filter")(kitem.ClinicalFollowAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime !== '') });
                                    if (clinicapptlist.length > 0) {
                                        slotscount1++;
                                    }
                                }
                                if (kitem.PostOpFollowAppointmentSlots.length > 0) {
                                    let postapptlist = $filter("filter")(kitem.PostOpFollowAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime !== '') });
                                    if (postapptlist.length > 0) {
                                        slotscount1++;
                                    }
                                }
                                if (kitem.ASCFollowAppointmentSlots.length > 0) {
                                    let ascapptlist = $filter("filter")(kitem.ASCFollowAppointmentSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime !== '') });
                                    if (ascapptlist.length > 0) {
                                        slotscount1++;
                                    }
                                }
                                if (kitem.InvestigationSlots.length > 0) {
                                    let invapptlist = $filter("filter")(kitem.InvestigationSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime !== '') });
                                    if (invapptlist.length > 0) {
                                        slotscount1++;
                                    }
                                }
                                if (kitem.OnlineSlots.length > 0) {
                                    let onlineslots = $filter("filter")(kitem.OnlineSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime !== '') });
                                    if (onlineslots.length > 0) {
                                        slotscount1++;
                                    }
                                }
                                if (kitem.BreakSlots.length > 0) {
                                    let breakslotslist = $filter("filter")(kitem.BreakSlots, function (Nitem, index) { return (Nitem.StartTime !== '' && Nitem.EndTime !== '') });
                                    if (breakslotslist.length > 0) {
                                        slotscount1++;
                                    }
                                }
                            });
                        }

                        if (slotscount1 === 0) {
                            $scope.IsDetailedSlotsSelected = false;
                        } else {
                            $scope.IsDetailedSlotsSelected = true;
                        }

                    }
                    $scope.newUserAddReqObj = item;



                    $scope.continuetoSaveDetailedUserSlot($scope.newUserAddReqObj, slottype);
                }

                $scope.continuetoSaveDetailedUserSlot = function (item, slottype) {

                    item.UserScheduleDetails = item.UserScheduleDetails || [];
                    if (item.UserScheduleDetails.length > 0) {
                        var list1 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.StartTime !== '' && kitem.EndTime !== '' });
                        if (list1.length == 0) {
                            alertify.error("Select StartTime and EndTime");
                            return false;
                        }
                        var list2 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.BranchId !== null });
                        if (list2.length == 0) {
                            alertify.error("Select Branch");
                            return false;
                        }
                    }
                    item.UserDayBreakSlots = item.UserDayBreakSlots || [];


                    if (item.UserScheduleName === '') {
                        alertify.error("Please Enter Schedule Name");
                        return false;
                    }

                    if ($scope.UserScheduleSlotsArray.length > 0) {
                        var UserSlotEdit = $filter('filter')($scope.UserScheduleSlotsArray, { 'UserScheduleName': item.UserScheduleName }, true);
                    }

                    UserSlotEdit = UserSlotEdit || [];
                    if (UserSlotEdit.length > 0) {
                        if (UserSlotEdit[0].UserScheduleId != item.UserScheduleId) {
                            alertify.error("User Schedule Name Already Exist");
                            return false;
                        }
                    }

                    //if (item.Type == 'Duration') {
                    //    item.UserDayBreakSlots = [];
                    //    item.ScheduleDuration = item.ScheduleDuration || null;
                    //    //item.FromDate = null;
                    //    //item.ToDate = null;
                    //    if (item.ScheduleDuration == null) {
                    //        alertify.error("Please Enter Duration");
                    //        return false;
                    //    }
                    //    //var currentDate = new Date();
                    //    //var oneMonthLater = new Date(currentDate.getFullYear(), currentDate.getMonth() + item.ScheduleDuration, 0);

                    //    var currentDate = new Date();
                    //    var oneMonthLater = new Date();
                    //    item.ScheduleDuration = parseInt(item.ScheduleDuration);
                    //    oneMonthLater.setMonth(currentDate.getMonth() + item.ScheduleDuration);

                    //    item.UserDaySlots = [];
                    //    if ($scope.ScheduledDateArray.length > 0) {
                    //        angular.forEach($scope.ScheduledDateArray, function (Aitem) {
                    //            var obj = {
                    //                "UserDaySlotId": 0,
                    //                "BranchId": null,
                    //                "UserBranchId": null,
                    //                "DayId": null,
                    //                "Day": Aitem.Day || '',
                    //                "SlotDate": Aitem.Date || "",
                    //                "DeleteInd": "N"
                    //            }
                    //            item.UserDaySlots.push(obj);

                    //        })

                    //    }
                    //}
                    //if (item.Type == 'Date') {
                    //    item.UserDayBreakSlots = [];
                    //    item.FromDate = item.FromDate || null;
                    //    item.ToDate = item.ToDate || null;
                    //    if (item.FromDate == null) {
                    //        alertify.error("Please Select From Date");
                    //        return false;
                    //    }
                    //    if (item.ToDate == null) {
                    //        alertify.error("Please Select To Date");
                    //        return false;
                    //    }
                    //    var currentDate = new Date(item.FromDate);
                    //    var ToDateDate = new Date(item.ToDate);
                    //    item.UserDaySlots = [];
                    //    for (var d = currentDate; d <= ToDateDate; d.setDate(d.getDate() + 1)) {
                    //        // datesArray.push(new Date(d));
                    //        var date = new Date(d);
                    //        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    //        var day = daysOfWeek[date.getDay()];

                    //        $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                    //        var obj = {
                    //            "UserDaySlotId": 0,
                    //            "BranchId": null,
                    //            "UserBranchId": null,
                    //            "DayId": null,
                    //            "Day": day || '',
                    //            "SlotDate": $scope.DisplayDate || "",
                    //            "DeleteInd": "N"
                    //        }
                    //        item.UserDaySlots.push(obj);

                    //    }
                    //}

                    //if (item.UserDaySlots.length > 0) {

                    //    item.FromDate = item.UserDaySlots[0].SlotDate;
                    //    item.ToDate = item.UserDaySlots[item.UserDaySlots.length - 1].SlotDate;

                    //    angular.forEach(item.UserDaySlots, function (Aitem) {
                    //        var list1 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.Day == Aitem.Day });

                    //        if (list1.length > 0) {

                    //            // Aitem.UserScheduleId = list1[0].UserScheduleId;
                    //            Aitem.Day = list1[0].Day;
                    //            Aitem.DayId = list1[0].DayId;
                    //            Aitem.UserBranchId = list1[0].UserBranchId;
                    //            Aitem.BranchId = list1[0].BranchId;

                    //            if (list1[0].BreakSlots.length > 0 && list1[0].StartTime !== "" && list1[0].UserScheduleId !== 0) {
                    //                angular.forEach(list1[0].BreakSlots, function (Sitem) {
                    //                    if (Sitem.StartTime !== "" && Sitem.EndTime !== "") {
                    //                        var Breakobj = {
                    //                            "UserDayBreakSlotId": 0,
                    //                            "BranchId": list1[0].BranchId,
                    //                            "UserBranchId": list1[0].UserBranchId,
                    //                            "DayId": list1[0].DayId,
                    //                            "Day": list1[0].Day || '',
                    //                            "SlotDate": Aitem.SlotDate || "",
                    //                            "StartTime": Sitem.StartTime,
                    //                            "EndTime": Sitem.EndTime,
                    //                            "DeleteInd": "N",
                    //                        }
                    //                        item.UserDayBreakSlots.push(Breakobj);
                    //                    }
                    //                });
                    //            }
                    //        }
                    //    });
                    //}

                    if (item.UserScheduleDetails.length > 0) {
                        angular.forEach(item.UserScheduleDetails, function (mitem) {
                            mitem.ScheduleVisitTypeDetails = mitem.ScheduleVisitTypeDetails || [];
                            mitem.OnlineSlots = mitem.OnlineSlots || [];
                            mitem.BreakSlots = mitem.BreakSlots || [];
                            if (mitem.OnlineSlots.length > 0) {
                                var list1 = $filter("filter")(mitem.OnlineSlots, function (kitem, index) { return kitem.StartTime !== '' && kitem.EndTime !== '' });
                                if (list1.length == 0) {
                                    mitem.OnlineSlots = [];
                                }
                            }
                            if (mitem.BreakSlots.length > 0) {
                                var list2 = $filter("filter")(mitem.BreakSlots, function (kitem, index) { return kitem.StartTime !== '' && kitem.EndTime !== '' });
                                if (list2.length == 0) {
                                    mitem.BreakSlots = [];
                                }
                            }

                            if (slottype === 'slotwise') {
                                // Per-day flag, not the schedule-wide IsAdvancedSlotsSelected: otherwise one day with payor slots marks every other day advanced, dropping their plain schedule.
                            
                                mitem.SlotsList = mitem.SlotsList || [];
                                mitem.IsAdvancedSchedule = mitem.SlotsList.length > 0 || mitem.BreakSlots.length > 0 || mitem.OnlineSlots.length > 0;
                                mitem.allDaySlots = mitem.allDaySlots || [];
                            } else {
                                mitem.IsAdvancedSchedule = false;
                                mitem.allDaySlots = mitem.allDaySlots || [];
                            }

                            if (slottype !== 'slotwise') {
                                mitem.ScheduleVisitTypeDetails = [];
                                mitem.SlotsList = [];

                                if (mitem.NewAppointmentSlots.length > 0) {
                                    angular.forEach(mitem.NewAppointmentSlots, function (item) {
                                        if (item.StartTime !== '' && item.EndTime !== '') {
                                            let obj;
                                            obj = {
                                                "UserScheduleSlotsListId": 0,
                                                "UserScheduleDetailId": item.UserScheduleDetailId || 0,
                                                "StartTime": item.StartTime,
                                                "EndTime": item.EndTime,
                                                "MaxNumberOfSlots": mitem.NewAppointmentMaxSlots || null,
                                                "VisitReasons": [
                                                    {
                                                        "UserScheduleSlotVisitReasonId": 0,
                                                        "ReasonId": 0,
                                                        "Reason": "All Visit Reasons",
                                                        "VisitTypeId": 1
                                                    }
                                                ]
                                            };
                                            mitem.SlotsList.push(obj);
                                        }
                                    });
                                }
                                if (mitem.ClinicalFollowAppointmentSlots.length > 0) {
                                    angular.forEach(mitem.ClinicalFollowAppointmentSlots, function (item) {
                                        if (item.StartTime !== '' && item.EndTime !== '') {
                                            let obj;
                                            obj = {
                                                "UserScheduleSlotsListId": 0,
                                                "UserScheduleDetailId": item.UserScheduleDetailId || 0,
                                                "StartTime": item.StartTime,
                                                "EndTime": item.EndTime,
                                                "MaxNumberOfSlots": mitem.ClinicFollowUpAppointmentMaxSlots || null,
                                                "VisitReasons": [
                                                    {
                                                        "UserScheduleSlotVisitReasonId": 0,
                                                        "ReasonId": 0,
                                                        "Reason": "All Visit Reasons",
                                                        "VisitTypeId": 2
                                                    }
                                                ]
                                            };
                                            mitem.SlotsList.push(obj);
                                        }
                                    });
                                }

                                if (mitem.PostOpFollowAppointmentSlots.length > 0) {
                                    angular.forEach(mitem.PostOpFollowAppointmentSlots, function (item) {
                                        if (item.StartTime !== '' && item.EndTime !== '') {
                                            let obj;
                                            obj = {
                                                "UserScheduleSlotsListId": 0,
                                                "UserScheduleDetailId": item.UserScheduleDetailId || 0,
                                                "StartTime": item.StartTime,
                                                "EndTime": item.EndTime,
                                                "MaxNumberOfSlots": mitem.PostOpFollowUpAppointmentMaxSlots || null,
                                                "VisitReasons": [
                                                    {
                                                        "UserScheduleSlotVisitReasonId": 0,
                                                        "ReasonId": 0,
                                                        "Reason": "All Visit Reasons",
                                                        "VisitTypeId": 3
                                                    }
                                                ]
                                            };
                                            mitem.SlotsList.push(obj);
                                        }
                                    });
                                }

                                if (mitem.ASCFollowAppointmentSlots.length > 0) {
                                    angular.forEach(mitem.ASCFollowAppointmentSlots, function (item) {
                                        if (item.StartTime !== '' && item.EndTime !== '') {
                                            let obj;
                                            obj = {
                                                "UserScheduleSlotsListId": 0,
                                                "UserScheduleDetailId": item.UserScheduleDetailId || 0,
                                                "StartTime": item.StartTime,
                                                "EndTime": item.EndTime,
                                                "MaxNumberOfSlots": mitem.ASCAppointmentMaxSlots || null,
                                                "VisitReasons": [
                                                    {
                                                        "UserScheduleSlotVisitReasonId": 0,
                                                        "ReasonId": 0,
                                                        "Reason": "All Visit Reasons",
                                                        "VisitTypeId": 4
                                                    }
                                                ]
                                            };
                                            mitem.SlotsList.push(obj);
                                        }
                                    });
                                }

                                if (mitem.InvestigationSlots.length > 0) {
                                    angular.forEach(mitem.InvestigationSlots, function (item) {
                                        if (item.StartTime !== '' && item.EndTime !== '') {
                                            let obj;
                                            obj = {
                                                "UserScheduleSlotsListId": 0,
                                                "UserScheduleDetailId": item.UserScheduleDetailId || 0,
                                                "StartTime": item.StartTime,
                                                "EndTime": item.EndTime,
                                                "MaxNumberOfSlots": mitem.InvestigationMaxSlots || null,
                                                "VisitReasons": [
                                                    {
                                                        "UserScheduleSlotVisitReasonId": 0,
                                                        "ReasonId": 0,
                                                        "Reason": "All Visit Reasons",
                                                        "VisitTypeId": 5
                                                    }
                                                ]
                                            };
                                            mitem.SlotsList.push(obj);
                                        }
                                    });
                                }

                                if (mitem.OnlineSlots.length > 0) {
                                    let tempOnlineSlots = [];
                                    angular.forEach(mitem.OnlineSlots, function (item) {
                                        if (item.StartTime !== '' && item.EndTime !== '') {
                                            let obj;
                                            obj = {
                                                "UserScheduleOnlineBreakDetailId": item.UserScheduleOnlineBreakDetailId || 0,
                                                "UserScheduleDetailId": item.UserScheduleDetailId || 0,
                                                "BranchId": mitem.BranchId,
                                                "UserBranchId": mitem.UserBranchId,
                                                "StartTime": item.StartTime,
                                                "EndTime": item.EndTime,
                                                "TypeId": 1,
                                                "DeleteInd": "N",
                                                "VisitReasons": []
                                            };
                                            tempOnlineSlots.push(obj);
                                        }
                                    });
                                    mitem.OnlineSlots = angular.copy(tempOnlineSlots);
                                }

                                if (mitem.BreakSlots.length > 0) {
                                    let tempBreakSlots = [];
                                    angular.forEach(mitem.BreakSlots, function (item) {
                                        if (item.StartTime !== '' && item.EndTime !== '') {
                                            let obj;
                                            obj = {
                                                "UserScheduleOnlineBreakDetailId": item.UserScheduleOnlineBreakDetailId || 0,
                                                "UserScheduleDetailId": item.UserScheduleDetailId || 0,
                                                "BranchId": mitem.BranchId,
                                                "UserBranchId": mitem.UserBranchId,
                                                "StartTime": item.StartTime,
                                                "EndTime": item.EndTime,
                                                "TypeId": 2,
                                                "DeleteInd": "N",
                                                "VisitReasons": []
                                            };
                                            tempBreakSlots.push(obj);
                                        }
                                    });
                                    mitem.BreakSlots = angular.copy(tempBreakSlots);
                                }
                            }

                        });
                    }

                    // code for removing redundant details
                    let tempScheduleDetailsArray = [];
                    angular.forEach(item.UserScheduleDetails, function (sitem) {
                        let obj;
                        obj = {
                            "UserScheduleDetailId": sitem.UserScheduleDetailId,
                            "UserScheduleId": sitem.UserScheduleId,
                            "BranchId": sitem.BranchId,
                            "BranchName": sitem.BranchName,
                            "UserBranchId": sitem.UserBranchId,
                            "Day": sitem.Day,
                            "DayId": sitem.DayId,
                            "StartTime": sitem.StartTime,
                            "EndTime": sitem.EndTime,
                            "DeleteInd": sitem.DeleteInd,
                            "IsAdvancedSchedule": sitem.IsAdvancedSchedule,
                            "OnlineSlots": sitem.OnlineSlots || [],
                            "BreakSlots": sitem.BreakSlots || [],
                            "NewAppointmentMaxSlots": sitem.NewAppointmentMaxSlots || null,
                            "ClinicFollowUpAppointmentMaxSlots": sitem.ClinicFollowUpAppointmentMaxSlots || null,
                            "PostOpFollowUpAppointmentMaxSlots": sitem.PostOpFollowUpAppointmentMaxSlots || null,
                            "ASCAppointmentMaxSlots": sitem.ASCAppointmentMaxSlots || null,
                            "InvestigationMaxSlots": sitem.InvestigationMaxSlots || null,
                            "MaximumOverAllSlots": sitem.MaximumOverAllSlots || null,
                            "displaystarttime": sitem.displaystarttime || "",
                            "displayEndtime": sitem.displayEndtime || "",
                            "IsEdit": sitem.IsEdit,
                            "IsShowAllDays": sitem.IsShowAllDays,
                            "SlotsList": sitem.SlotsList || [],
                           // "DurationMinutes": sitem.DurationMinutes || '',
                        };
                        tempScheduleDetailsArray.push(obj);
                    });

                    item.UserScheduleDetails = angular.copy(tempScheduleDetailsArray);

                    console.log(slottype + "__slottype");
                    console.log($scope.IsDetailedSlotsSelected + "__IsDetailedSlotsSelected");
                 
                    var params = {
                        "UserId": doctorinfo.doctorid,
                        "DoctorId": $scope.MainUserObj.BasicInfo.UserId,
                        "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "Type": item.Type || "Duration",
                        "FromDate": item.FromDate || null,
                        "ToDate": item.ToDate || null,
                        "ScheduleDate": item.ScheduleDate || "",
                        "ScheduleDuration": item.ScheduleDuration || "",
                        "ScheduleDurationType": item.ScheduleDurationType || "M",
                        "UserScheduleId": item.UserScheduleId || 0,
                        "DeleteInd": "N",
                        "IsDetailedSchedule": (slottype !== 'slotwise' && $scope.IsDetailedSlotsSelected) ? true : false,
                        "UserScheduleDetails": item.UserScheduleDetails || [],
                        "UserDaySlots": item.UserDaySlots || [],
                        "UserDayBreakSlots": item.UserDayBreakSlots || [],
                        "ScheduleEveryType": item.ScheduleEveryType,
                        "AverageConsultationTime": item.AverageConsultationTime || "",
                        "UserScheduleName": item.UserScheduleName,
                        "IsInsuranceBasedScheduling": item.IsInsuranceBasedScheduling || false,
                        "isDurationBasedSlots": item.isDurationBasedSlots || false,

                    }

                    //console.log(JSON.stringify(params));
                    //return false;
                    eHnoteMainAdminServices.AddupdateUserSlotSchedule(params, callbackuserbranchSuccess, callbackuserbranchError);
                    function callbackuserbranchSuccess(resp) {
                        console.log(resp);
                        if (resp.status === "Success") {
                            alertify.success("Time Slots Added Successfully");
                            $uibModalInstance.close();
                        }
                    }
                    function callbackuserbranchError(err) {
                        alertify.error("Some Error Occured");
                    }
                }


                $scope.activeAdvancedTab = 1;

                // Angular 1.4's expression parser doesn't allow a comma-separated statement sequence
                // inside a ternary branch (`cond ? a() : (b(), c=1)` throws a $parse:syntax error) — these
                // wrappers exist so the Slot Wise / Advanced Slots tab links can do "call
                // changetoAdvanceMode AND flip isDurationBasedSlots" from a single ng-click.
                $scope.switchToSlotWiseTab = function (item) {
                    $scope.changetoAdvanceMode(item);
                    $scope.Obj.isDurationBasedSlots = false;
                };
                $scope.switchToAdvancedSlotsTab = function (item) {
                    $scope.changetoAdvanceMode(item);
                    $scope.Obj.isDurationBasedSlots = true;
                };
                $scope.onDurationBasedSlotsToggle = function () {
                    angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (sitem) {
                        // Any day that already has a Select Timeslot list has to be rebuilt, not just
                        // the one currently expanded - the step (5 minutes vs AverageConsultationTime)
                        // is baked into that list, so a day expanded before the toggle kept the old
                        // arrangement and saved slots on the wrong grid.
                        sitem.allDaySlots = sitem.allDaySlots || [];
                        if (sitem.IsShowAllDays || sitem.allDaySlots.length > 0) {
                            //$scope.UserDetailedSlotObj.AverageConsultationTime = $scope.FinalObj.AverageConsultationTime || "";
                            //$scope.addNewAdvancedSlotReqObj.DurationMinutes = $scope.addNewAdvancedSlotReqObj.DurationMinutes || 0;
                            //if (!$scope.addNewAdvancedSlotReqObj.DurationMinutes) {
                            //    $scope.addNewAdvancedSlotReqObj.DurationMinutes = parseInt($scope.UserDetailedSlotObj.AverageConsultationTime, 10);
                            //}
                            $scope.changetoAdvanceMode(sitem);
                        }
                    });
                };
                $scope.changetoAdvanceMode = function (obj) {
                    $scope.Obj.isAdvancedView = true;
                    $scope.selectedSlotDayObj = $scope.UserDetailedSlotObj.UserScheduleDetails[0];
                    $scope.allDaySlots = [];

                    angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (uitem) {
                        //uitem.IsAdvancedSchedule = true;

                        if (uitem.DayId === obj.DayId) {
                            uitem.allDaySlots = [];
                            if (uitem.StartTime != '' && uitem.EndTime != '') {
                                //var arr = $scope.selectedSlotDayObj.StartTime.split(':');

                                var arr = uitem.StartTime.split(':');
                                var shour = $.trim(arr[0]);
                                var smin = $.trim(arr[1]);

                                //var arr2 = $scope.selectedSlotDayObj.EndTime.split(':');                         
                                var arr2 = uitem.EndTime.split(':')
                                var ehour = $.trim(arr2[0]);
                                var emin = $.trim(arr2[1]);

                                var startingTime = moment().hours(shour).minutes(smin);
                                var endingTime = moment().hours(ehour).minutes(emin);
                                var currentStartTime = angular.copy(startingTime);
                                // item.allDaySlots feeds the "Select Timeslot" dropdown for BOTH tabs
                                // (Slot Wise and Advanced Slots share the same list — see template).
                                // Normal Slot Wise: Start Time steps by the org's AverageConsultationTime
                                // itself (e.g. 8:00, 8:15, 8:30...). Advanced Slots (Duration-Based): steps
                                // every 5 minutes regardless of the chosen Duration (matches onDurationChange),
                                // with EndTime using the currently-selected advanced Duration.
                                // EndTime is computed off a COPY of currentStartTime instead of mutating
                                // it directly (moment .add() mutates).
                                var slotWiseDuration = parseInt($scope.UserDetailedSlotObj.AverageConsultationTime, 10) || 15;
                                var isDurationBasedSlots = !!$scope.UserDetailedSlotObj.isDurationBasedSlots;
                                var advancedDuration = (isDurationBasedSlots && $scope.addNewAdvancedSlotReqObj)
                                    ? (parseInt($scope.addNewAdvancedSlotReqObj.DurationMinutes, 10) || slotWiseDuration)
                                    : slotWiseDuration;
                                var slotEndDuration = isDurationBasedSlots ? advancedDuration : slotWiseDuration;
                                var slotWiseStepMinutes = isDurationBasedSlots ? 5 : slotWiseDuration;
                                while (currentStartTime < endingTime) {

                                    var slotObj = {
                                        "StartTime": currentStartTime.format("HH:mm"),
                                        "EndTime": angular.copy(currentStartTime).add(slotEndDuration, "minute").format("HH:mm"),
                                        "IsSelected": false,
                                        "SlotTypeId": 0,
                                        "Available": "Y",
                                        "NewFormattedStime": "",
                                        "NewFormattedEtime": ""
                                    }
                                    slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                    slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                    var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                    slotObj.NewStartTime = "";
                                    slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                    function formatTime(timeString) {
                                        const [hourString, minute] = timeString.split(":");
                                        const hour = +hourString % 24;
                                        return (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM");
                                    }

                                    slotObj.NewFormattedStime = formatTime(slotObj.StartTime);
                                    slotObj.NewFormattedEtime = formatTime(slotObj.EndTime);

                                    //console.log(slotObj.NewFormattedStime);
                                    //console.log(slotObj.NewFormattedEtime);

                                    uitem.allDaySlots.push(slotObj);
                                    currentStartTime.add(slotWiseStepMinutes, "minute");
                                }
                            };
                        }
                    });
                };

                $scope.changetoDetailedMode = function (obj) {
                    if ($scope.UserDetailedSlotObj.UserScheduleId !== 0 && $scope.UserDetailedSlotObj.UserScheduleDetails[0].IsAdvancedSchedule) {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>You have already saved data in advanced mode, if you switch to detailed mode all data will be cleared! Are you sure? </h4>",
                            function () {
                                $scope.Obj.isAdvancedView = false;
                                $scope.allDaySlots = [];

                                angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (uitem) {
                                    if (uitem.DayId === obj.DayId) {
                                        uitem.IsAdvancedSchedule = false;
                                        uitem.NewAppointmentSlots = angular.copy($scope.Obj.NewAppointmentSlots);
                                        uitem.ClinicalFollowAppointmentSlots = angular.copy($scope.Obj.ClinicalFollowAppointmentSlots);
                                        uitem.PostOpFollowAppointmentSlots = angular.copy($scope.Obj.PostOpFollowAppointmentSlots);
                                        uitem.ASCFollowAppointmentSlots = angular.copy($scope.Obj.ASCFollowAppointmentSlots);
                                        uitem.InvestigationSlots = angular.copy($scope.Obj.InvestigationSlots) || [];
                                        uitem.OnlineSlots = [
                                            {
                                                "UserScheduleOnlineBreakDetailId": 0,
                                                "UserScheduleId": 0,
                                                "BranchId": null,
                                                "UserBranchId": null,
                                                "SlotStartValues": [],
                                                "SlotEndValues": [],
                                                "StartTime": "",
                                                "EndTime": "",
                                                "TypeId": 1,
                                                "DeleteInd": "N"
                                            }
                                        ];
                                        uitem.BreakSlots = [
                                            {
                                                "UserScheduleOnlineBreakDetailId": 0,
                                                "UserScheduleId": 0,
                                                "BranchId": null,
                                                "UserBranchId": null,
                                                "SlotStartValues": [],
                                                "SlotEndValues": [],
                                                "StartTime": "",
                                                "EndTime": "",
                                                "TypeId": 2,
                                                "DeleteInd": "N"
                                            }
                                        ];
                                        angular.forEach(uitem.NewAppointmentSlots, function (Mitem) {
                                            Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                            Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                            if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                                let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                                angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                                    st = hitem.time.split(":").join("");
                                                    mst = uitem.StartTime.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (mst == "") {
                                                        mst = "0000";
                                                    }
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (st >= mst && st < met) {
                                                            tempStartValues.push(hitem);
                                                        }
                                                    } else {
                                                        tempStartValues.push(hitem);
                                                    }
                                                });
                                                angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                                    et = eitem.time.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (et <= met && et > mst) {
                                                            tempEndValues.push(eitem);
                                                        }
                                                    } else {
                                                        tempEndValues.push(eitem);
                                                    }
                                                });
                                                Mitem.SlotStartValues = angular.copy(tempStartValues);
                                                Mitem.SlotEndValues = angular.copy(tempEndValues);
                                            }

                                            Mitem.ScheduleVisitTypeDetailId = 0;
                                            Mitem.UserScheduleDetailId = 0;
                                        });
                                        angular.forEach(uitem.ClinicalFollowAppointmentSlots, function (Mitem) {
                                            Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                            Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                            if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                                let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                                angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                                    st = hitem.time.split(":").join("");
                                                    mst = uitem.StartTime.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (mst == "") {
                                                        mst = "0000";
                                                    }
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (st >= mst && st < met) {
                                                            tempStartValues.push(hitem);
                                                        }
                                                    } else {
                                                        tempStartValues.push(hitem);
                                                    }
                                                });
                                                angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                                    et = eitem.time.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (et <= met && et > mst) {
                                                            tempEndValues.push(eitem);
                                                        }
                                                    } else {
                                                        tempEndValues.push(eitem);
                                                    }
                                                });
                                                Mitem.SlotStartValues = angular.copy(tempStartValues);
                                                Mitem.SlotEndValues = angular.copy(tempEndValues);
                                            }

                                            Mitem.ScheduleVisitTypeDetailId = 0;
                                            Mitem.UserScheduleDetailId = 0;
                                        });
                                        angular.forEach(uitem.PostOpFollowAppointmentSlots, function (Mitem) {
                                            Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                            Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                            if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                                let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                                angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                                    st = hitem.time.split(":").join("");
                                                    mst = uitem.StartTime.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (mst == "") {
                                                        mst = "0000";
                                                    }
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (st >= mst && st < met) {
                                                            tempStartValues.push(hitem);
                                                        }
                                                    } else {
                                                        tempStartValues.push(hitem);
                                                    }
                                                });
                                                angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                                    et = eitem.time.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (et <= met && et > mst) {
                                                            tempEndValues.push(eitem);
                                                        }
                                                    } else {
                                                        tempEndValues.push(eitem);
                                                    }
                                                });
                                                Mitem.SlotStartValues = angular.copy(tempStartValues);
                                                Mitem.SlotEndValues = angular.copy(tempEndValues);
                                            }

                                            Mitem.ScheduleVisitTypeDetailId = 0;
                                            Mitem.UserScheduleDetailId = 0;
                                        });
                                        angular.forEach(uitem.ASCFollowAppointmentSlots, function (Mitem) {
                                            Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                            Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                            if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                                let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                                angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                                    st = hitem.time.split(":").join("");
                                                    mst = uitem.StartTime.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (mst == "") {
                                                        mst = "0000";
                                                    }
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (st >= mst && st < met) {
                                                            tempStartValues.push(hitem);
                                                        }
                                                    } else {
                                                        tempStartValues.push(hitem);
                                                    }
                                                });
                                                angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                                    et = eitem.time.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (et <= met && et > mst) {
                                                            tempEndValues.push(eitem);
                                                        }
                                                    } else {
                                                        tempEndValues.push(eitem);
                                                    }
                                                });
                                                Mitem.SlotStartValues = angular.copy(tempStartValues);
                                                Mitem.SlotEndValues = angular.copy(tempEndValues);
                                            }

                                            Mitem.ScheduleVisitTypeDetailId = 0;
                                            Mitem.UserScheduleDetailId = 0;
                                        });
                                        angular.forEach(uitem.InvestigationSlots, function (Mitem) {
                                            Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                            Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                            if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                                let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                                angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                                    st = hitem.time.split(":").join("");
                                                    mst = uitem.StartTime.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (mst == "") {
                                                        mst = "0000";
                                                    }
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (st >= mst && st < met) {
                                                            tempStartValues.push(hitem);
                                                        }
                                                    } else {
                                                        tempStartValues.push(hitem);
                                                    }
                                                });
                                                angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                                    et = eitem.time.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (et <= met && et > mst) {
                                                            tempEndValues.push(eitem);
                                                        }
                                                    } else {
                                                        tempEndValues.push(eitem);
                                                    }
                                                });
                                                Mitem.SlotStartValues = angular.copy(tempStartValues);
                                                Mitem.SlotEndValues = angular.copy(tempEndValues);
                                            }

                                            Mitem.ScheduleVisitTypeDetailId = 0;
                                            Mitem.UserScheduleDetailId = 0;
                                        });
                                        angular.forEach(uitem.OnlineSlots, function (Mitem) {
                                            Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                            Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                            if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                                let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                                angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                                    st = hitem.time.split(":").join("");
                                                    mst = uitem.StartTime.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (mst == "") {
                                                        mst = "0000";
                                                    }
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (st >= mst && st < met) {
                                                            tempStartValues.push(hitem);
                                                        }
                                                    } else {
                                                        tempStartValues.push(hitem);
                                                    }
                                                });
                                                angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                                    et = eitem.time.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (et <= met && et > mst) {
                                                            tempEndValues.push(eitem);
                                                        }
                                                    } else {
                                                        tempEndValues.push(eitem);
                                                    }
                                                });
                                                Mitem.SlotStartValues = angular.copy(tempStartValues);
                                                Mitem.SlotEndValues = angular.copy(tempEndValues);
                                            }

                                            Mitem.ScheduleVisitTypeDetailId = 0;
                                            Mitem.UserScheduleDetailId = 0;
                                        });
                                        angular.forEach(uitem.BreakSlots, function (Mitem) {
                                            Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                            Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                            if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                                let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                                angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                                    st = hitem.time.split(":").join("");
                                                    mst = uitem.StartTime.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (mst == "") {
                                                        mst = "0000";
                                                    }
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (st >= mst && st < met) {
                                                            tempStartValues.push(hitem);
                                                        }
                                                    } else {
                                                        tempStartValues.push(hitem);
                                                    }
                                                });
                                                angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                                    et = eitem.time.split(":").join("");
                                                    met = uitem.EndTime.split(":").join("");
                                                    if (met == "") {
                                                        met = "0000"
                                                    }
                                                    if (met != "0000" && mst != "0000") {
                                                        if (et <= met && et > mst) {
                                                            tempEndValues.push(eitem);
                                                        }
                                                    } else {
                                                        tempEndValues.push(eitem);
                                                    }
                                                });
                                                Mitem.SlotStartValues = angular.copy(tempStartValues);
                                                Mitem.SlotEndValues = angular.copy(tempEndValues);
                                            }

                                            Mitem.ScheduleVisitTypeDetailId = 0;
                                            Mitem.UserScheduleDetailId = 0;
                                        });
                                    }
                                });
                                //console.log("testing online slots",$scope.UserDetailedSlotObj.UserScheduleDetails);
                            },
                            function () {

                            });
                    } else {
                        //$scope.Obj.isAdvancedView = false;
                        //$scope.allDaySlots = [];
                        //angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (uitem) {
                        //    uitem.IsAdvancedSchedule = false;
                        //});
                        $scope.Obj.isAdvancedView = false;
                        $scope.allDaySlots = [];
                        angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (uitem) {
                            if (uitem.DayId === obj.DayId) {
                                uitem.IsAdvancedSchedule = false;
                                uitem.NewAppointmentSlots = angular.copy($scope.Obj.NewAppointmentSlots);
                                uitem.ClinicalFollowAppointmentSlots = angular.copy($scope.Obj.ClinicalFollowAppointmentSlots);
                                uitem.PostOpFollowAppointmentSlots = angular.copy($scope.Obj.PostOpFollowAppointmentSlots);
                                uitem.ASCFollowAppointmentSlots = angular.copy($scope.Obj.ASCFollowAppointmentSlots);
                                uitem.InvestigationSlots = angular.copy($scope.Obj.InvestigationSlots) || [];
                                uitem.OnlineSlots = [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "SlotStartValues": [],
                                        "SlotEndValues": [],
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 1,
                                        "DeleteInd": "N"
                                    }
                                ];
                                uitem.BreakSlots = [
                                    {
                                        "UserScheduleOnlineBreakDetailId": 0,
                                        "UserScheduleId": 0,
                                        "BranchId": null,
                                        "UserBranchId": null,
                                        "SlotStartValues": [],
                                        "SlotEndValues": [],
                                        "StartTime": "",
                                        "EndTime": "",
                                        "TypeId": 2,
                                        "DeleteInd": "N"
                                    }
                                ];
                                angular.forEach(uitem.NewAppointmentSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = uitem.StartTime.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (st >= mst && st < met) {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }

                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;
                                });
                                angular.forEach(uitem.ClinicalFollowAppointmentSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = uitem.StartTime.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (st >= mst && st < met) {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }

                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;
                                });
                                angular.forEach(uitem.PostOpFollowAppointmentSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = uitem.StartTime.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (st >= mst && st < met) {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }

                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;
                                });
                                angular.forEach(uitem.ASCFollowAppointmentSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = uitem.StartTime.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (st >= mst && st < met) {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }

                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;
                                });

                                angular.forEach(uitem.InvestigationSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = uitem.StartTime.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (st >= mst && st < met) {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }

                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;
                                });
                                angular.forEach(uitem.OnlineSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = uitem.StartTime.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (st >= mst && st < met) {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }

                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;
                                });
                                angular.forEach(uitem.BreakSlots, function (Mitem) {
                                    Mitem.SlotStartValues = angular.copy($scope.Obj.SlotStartValues) || [];
                                    Mitem.SlotEndValues = angular.copy($scope.Obj.SlotEndValues) || [];
                                    if (Mitem.SlotStartValues.length > 0 && Mitem.SlotEndValues.length > 0) {
                                        let st; let mst; let et; let met; let tempStartValues = []; let tempEndValues = [];
                                        angular.forEach(Mitem.SlotStartValues, function (hitem) {
                                            st = hitem.time.split(":").join("");
                                            mst = uitem.StartTime.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (mst == "") {
                                                mst = "0000";
                                            }
                                            if (st >= mst && st < met) {
                                                tempStartValues.push(hitem);
                                            }
                                        });
                                        angular.forEach(Mitem.SlotEndValues, function (eitem) {
                                            et = eitem.time.split(":").join("");
                                            met = uitem.EndTime.split(":").join("");
                                            if (met == "") {
                                                met = "0000"
                                            }
                                            if (met != "0000" && mst != "0000") {
                                                if (et <= met && et > mst) {
                                                    tempEndValues.push(eitem);
                                                }
                                            } else {
                                                tempEndValues.push(eitem);
                                            }
                                        });
                                        Mitem.SlotStartValues = angular.copy(tempStartValues);
                                        Mitem.SlotEndValues = angular.copy(tempEndValues);
                                    }

                                    Mitem.ScheduleVisitTypeDetailId = 0;
                                    Mitem.UserScheduleDetailId = 0;
                                });
                            }

                        });
                    }

                };

                $scope.activeVisitType = function (typeId) {
                    $scope.activeAdvancedTab = typeId;
                };

                $scope.getFieldClass = function (item) {
                    var aclass = "";
                    if (item.SlotTypeId === 1) {
                        aclass = "bg-6598fc";
                    }
                    if (item.SlotTypeId === 2) {
                        aclass = "bg-fda574";
                    }
                    if (item.SlotTypeId === 3) {
                        aclass = "bg-5eaf8d";
                    }
                    if (item.SlotTypeId === 4) {
                        aclass = "bg-67b7c9";
                    }
                    if (item.SlotTypeId === 5) {
                        aclass = "bg-8a6ae7";
                    }
                    if (item.SlotTypeId === 6) {
                        aclass = "bg-ff9f9f";
                    }
                    return aclass;
                }

                $scope.activeParticularSlotvisit = function (item) {
                    if (!item.IsSelected) {
                        item.IsSelected = true;
                        item.SlotTypeId = $scope.activeAdvancedTab;
                    } else {
                        item.IsSelected = false;
                        item.SlotTypeId = 0;
                    }
                };


                $scope.saveAdvancedSlots = function () {

                    if ($scope.UserDetailedSlotObj.UserScheduleDetails.length > 0) {

                        // this code for not changing schedule type when no detailed or advanced are selected
                        let slotscount = 0;
                        $scope.IsAdvancedSlotsSelected = false;
                        angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (Sitem) {
                            Sitem.ScheduledSlotVisitReasonsArray = Sitem.ScheduledSlotVisitReasonsArray || [];
                            if (Sitem.ScheduledSlotVisitReasonsArray.length > 0) {
                                slotscount++;
                            }
                        });

                        if (slotscount == 0) {
                            $scope.IsAdvancedSlotsSelected = false;
                        } else {
                            $scope.IsAdvancedSlotsSelected = true;
                        }

                        /* On a duration-based (Advanced Slots) schedule the "Select Timeslot" list is
                           a 5-minute grid whose EndTime is only stamped with the duration that was
                           selected AT THE MOMENT the list was last rebuilt (see slotEndDuration in
                           buildAllDaySlots). Pick the timeslot before the duration - or change the
                           duration afterwards - and the copied TimeSlot.EndTime is left at
                           StartTime + AverageConsultationTime while DurationMinutes carries the real
                           length. That is how a 45-minute 3:30 PM break got saved as 15:30-15:45, and
                           every calendar that reads EndTime then drew it 15 minutes long.
                           The end time is recomputed from the duration here so it no longer depends on
                           the order the form was filled in. */
                        function slotEndTimeFromDuration(kitem) {
                            var timeSlot = kitem.TimeSlot || {};
                            var startTime = timeSlot.StartTime || "";
                            var duration = parseInt(kitem.DurationMinutes, 10);

                            if (!$scope.UserDetailedSlotObj.isDurationBasedSlots || !duration || duration <= 0 || startTime === "") {
                                return timeSlot.EndTime;
                            }
                            var parts = startTime.split(":");
                            return moment().hours($.trim(parts[0])).minutes($.trim(parts[1]))
                                .add(duration, "minute").format("HH:mm");
                        }

                        // this loop for SlotsList array creation, also online and break slots
                        angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (Sitem) {
                            Sitem.ScheduledSlotVisitReasonsArray = Sitem.ScheduledSlotVisitReasonsArray || [];
                            Sitem.SlotsList = [];
                            Sitem.OnlineSlots = [];
                            Sitem.BreakSlots = [];
                            angular.forEach(Sitem.ScheduledSlotVisitReasonsArray, function (kitem) {
                                if (kitem.SlotType == "1") {
                                    let obj;
                                    obj = {
                                        "UserScheduleSlotsListId": kitem.UserScheduleSlotsListId || 0,
                                        "UserScheduleDetailId": kitem.UserScheduleDetailId || 0,
                                        "StartTime": kitem.TimeSlot.StartTime,
                                        "EndTime": slotEndTimeFromDuration(kitem),
                                        "MaxNumberOfSlots": kitem.MaxNumberOfSlots || null,
                                        "VisitReasons": [],
                                        "DurationMinutes": kitem.DurationMinutes || 0,
                                        "PayorTypes": []
                                    };
                                    angular.forEach(kitem.VisitReasons, function (hitem) {
                                        let visitreasonobj;
                                        visitreasonobj = {
                                            "UserScheduleSlotVisitReasonId": hitem.UserScheduleSlotVisitReasonId || 0,
                                            "ReasonId": hitem.ReasonId,
                                            //"Reason": hitem.Reason,
                                            "Reason": "",
                                            "VisitTypeId": hitem.VisitTypeId,
                                            "ParentAppointmentVisitReasonId": hitem.ParentAppointmentVisitReasonId  ,
                                             "DurationMinutes": kitem.DurationMinutes||0,
                                        };
                                        obj.VisitReasons.push(visitreasonobj);
                                    });
                                    angular.forEach(kitem.PayorTypes, function (ptItem) {
                                        obj.PayorTypes.push({
                                            "OrganizationPayorId": ptItem.OrganizationPayorId,
                                            "PayorId": ptItem.PayorId,
                                            "PayorTypeId": ptItem.PayorTypeId,
                                            "PayorTypeName": ptItem.PayorTypeName,
                                            "PayorName": ptItem.PayorName
                                        });
                                    });
                                    Sitem.SlotsList.push(obj);
                                }

                                if (kitem.SlotType == "2") {
                                    let obj;
                                    obj = {
                                        "UserScheduleOnlineBreakDetailId": kitem.UserScheduleOnlineBreakDetailId || 0,
                                        "UserScheduleDetailId": kitem.UserScheduleDetailId || 0,
                                        "BranchId": Sitem.BranchId,
                                        "UserBranchId": Sitem.UserBranchId,
                                        "StartTime": kitem.TimeSlot.StartTime,
                                        "EndTime": slotEndTimeFromDuration(kitem),
                                        "TypeId": 1,
                                        "DeleteInd": "N",
                                        "VisitReasons": [],
                                        "DurationMinutes": kitem.DurationMinutes || 0,
                                        "PayorTypes": []
                                    };
                                    angular.forEach(kitem.PayorTypes, function (ptItem) {
                                        obj.PayorTypes.push({
                                            "OrganizationPayorId": ptItem.OrganizationPayorId,
                                            "PayorId": ptItem.PayorId,
                                            "PayorTypeId": ptItem.PayorTypeId,
                                            "PayorTypeName": ptItem.PayorTypeName,
                                            "PayorName": ptItem.PayorName
                                        });
                                    });
                                    Sitem.BreakSlots.push(obj);
                                }
                                if (kitem.SlotType == "3") {
                                    let obj;
                                    obj = {
                                        "UserScheduleOnlineBreakDetailId": kitem.UserScheduleOnlineBreakDetailId || 0,
                                        "UserScheduleDetailId": kitem.UserScheduleDetailId || 0,
                                        "BranchId": Sitem.BranchId,
                                        "UserBranchId": Sitem.UserBranchId,
                                        "StartTime": kitem.TimeSlot.StartTime,
                                        "EndTime": slotEndTimeFromDuration(kitem),
                                        "TypeId": 2,
                                        "DeleteInd": "N",
                                        "MaxNumberOfSlots": kitem.MaxNumberOfSlots || null,
                                        "OnlineVisitReasons": [],
                                        "DurationMinutes": kitem.DurationMinutes || 0,
                                        "PayorTypes": []
                                    };
                                    angular.forEach(kitem.OnlineVisitReasons, function (hitem) {
                                        obj.OnlineVisitReasons.push({
                                            "ParentOnlineAppointmentVisitReasonId": hitem.ParentOnlineAppointmentVisitReasonId,
                                            "OnlineVisitReason": hitem.OnlineVisitReason,
                                            "UserScheduleSlotVisitReasonId": hitem.UserScheduleSlotVisitReasonId || 0,
                                        });

                                    });
                                    angular.forEach(kitem.PayorTypes, function (ptItem) {
                                        obj.PayorTypes.push({
                                            "OrganizationPayorId": ptItem.OrganizationPayorId,
                                            "PayorId": ptItem.PayorId,
                                            "PayorTypeId": ptItem.PayorTypeId,
                                            "PayorTypeName": ptItem.PayorTypeName,
                                            "PayorName": ptItem.PayorName
                                        });
                                    });
                                    Sitem.OnlineSlots.push(obj);
                                }
                               
                            });
                        });

                    }


                    $scope.UserDetailedSlotObj.IsDetailedSchedule = false;

                    //console.log(JSON.stringify($scope.UserDetailedSlotObj));
                    //return;

                    $scope.SaveDetailedUserSlot($scope.UserDetailedSlotObj, 'slotwise');

                };
                $scope.ShowHideAllDays = function (item) {
                    angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (hitem) {
                        if (item.DayId === hitem.DayId) {
                            hitem.IsShowAllDays = !hitem.IsShowAllDays;
                            hitem.allDaySlots = [];
                            if (hitem.StartTime != '' && hitem.EndTime != '') {
                                var arr = hitem.StartTime.split(':');
                                var shour = $.trim(arr[0]);
                                var smin = $.trim(arr[1]);


                                var arr2 = hitem.EndTime.split(':')
                                var ehour = $.trim(arr2[0]);
                                var emin = $.trim(arr2[1]);

                                var startingTime = moment().hours(shour).minutes(smin);
                                var endingTime = moment().hours(ehour).minutes(emin);
                                var currentStartTime = angular.copy(startingTime);
                                // hitem.allDaySlots feeds the "Select Timeslot" dropdown for BOTH tabs
                                // (Slot Wise and Advanced Slots share the same list — see template).
                                // Normal Slot Wise: Start Time steps by the org's AverageConsultationTime
                                // itself (e.g. 8:00, 8:15, 8:30...). Advanced Slots (Duration-Based): steps
                                // every 5 minutes regardless of the chosen Duration (matches onDurationChange),
                                // with EndTime using the currently-selected advanced Duration.
                                var slotWiseDuration = parseInt($scope.UserDetailedSlotObj.AverageConsultationTime, 10) || 15;
                                var isDurationBasedSlots = !!$scope.UserDetailedSlotObj.isDurationBasedSlots;
                                var advancedDuration = (isDurationBasedSlots && $scope.addNewAdvancedSlotReqObj)
                                    ? (parseInt($scope.addNewAdvancedSlotReqObj.DurationMinutes, 10) || slotWiseDuration)
                                    : slotWiseDuration;
                                var slotEndDuration = isDurationBasedSlots ? advancedDuration : slotWiseDuration;
                                var slotWiseStepMinutes = isDurationBasedSlots ? 5 : slotWiseDuration;
                                while (currentStartTime < endingTime) {

                                    var slotObj = {
                                        "StartTime": currentStartTime.format("HH:mm"),
                                        "EndTime": angular.copy(currentStartTime).add(slotEndDuration, "minute").format("HH:mm"),
                                        "IsSelected": false,
                                        "SlotTypeId": 0,
                                        "Available": "Y",
                                        "NewFormattedStime": "",
                                        "NewFormattedEtime": ""
                                    }
                                    slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                    slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                    var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                    slotObj.NewStartTime = "";
                                    slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                    function formatTime(timeString) {
                                        const [hourString, minute] = timeString.split(":");
                                        const hour = +hourString % 24;
                                        return (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM");
                                    }

                                    slotObj.NewFormattedStime = formatTime(slotObj.StartTime);
                                    slotObj.NewFormattedEtime = formatTime(slotObj.EndTime);

                                    //console.log(slotObj.NewFormattedStime);
                                    //console.log(slotObj.NewFormattedEtime);

                                    hitem.allDaySlots.push(slotObj);
                                    currentStartTime.add(slotWiseStepMinutes, "minute");
                                }
                            };

                        } else {
                            hitem.IsShowAllDays = false;
                        }
                    });
                    $scope.addNewAdvancedSlotReqObj.DurationMinutes = $scope.addNewAdvancedSlotReqObj.DurationMinutes || 0;
                    if (!$scope.addNewAdvancedSlotReqObj.DurationMinutes) {
                        $scope.addNewAdvancedSlotReqObj.DurationMinutes = parseInt($scope.UserDetailedSlotObj.AverageConsultationTime, 10);
                    }
                    if (!$scope.UserDetailedSlotObj.IsDetailedSchedule) {
                        $scope.Obj.isAdvancedView = true;
                    }
                };

                $scope.SlotsParamObj = {
                    "AllVisitReasonsCheck": false,
                    "AllAppointmentTypeStatusCheck": false,
                    "ApptTypename": "",
                    "VisitRsnName": "",
                    "IsOptionsDisabled": false,
                    "IsonlineVisitreason": false
                };

                $scope.AllDaySlotsObj = {
                    "AllSlotsCheck": false,
                    "Slot": "",
                    "SlotsText": "Select Slot"
                };

                $scope.NewVisitRsnToggle = function (item) {
                    var checkedArray = _.where($scope.GetVisitReasonArray, { IsChecked: true });
                    $scope.SlotsParamObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.GetVisitReasonArray.length === checkedArray.length;

                    if (!$scope.SlotsParamObj.AllVisitReasonsCheck && checkedArray.length > 0) {
                        $scope.NewselectedVisitReason = 'Selected';
                    }
                    if (checkedArray.length === 0) {
                        $scope.NewselectedVisitReason = 'Select Visit Reason';
                    }

                    // Auto-fill duration from the just-toggled visit reason
                    if (item.IsChecked && item.DefaultDurationMinutes) {
                        var durationVal = parseInt(item.DefaultDurationMinutes, 10);
                        // Only auto-fill if it's a valid DurationOption
                        if ($scope.DurationOptions.indexOf(durationVal) !== -1) {
                            $scope.addNewAdvancedSlotReqObj.DurationMinutes = durationVal;
                            // Find the currently active (IsEdit) day and regenerate slots
                            var activeDayItem = null;
                            angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (sitem) {
                                if (sitem.IsEdit) {
                                    activeDayItem = sitem;
                                }
                            });
                            if (activeDayItem && activeDayItem.StartTime && activeDayItem.EndTime) {
                                $scope.onDurationChange(activeDayItem);
                            }
                        }
                    }
                };

                $scope.NewselectedVisitReason = 'Select Visit Reason';
                $scope.NewCheckAllVisitReasons = function (boolval) {
                    if (boolval) {
                        angular.forEach($scope.GetVisitReasonArray, function (item) {
                            item.IsChecked = true;
                        });
                        $scope.NewselectedVisitReason = 'All Visit Reasons';
                    } else {
                        angular.forEach($scope.GetVisitReasonArray, function (item) {
                            item.IsChecked = false;
                        });
                        $scope.NewselectedVisitReason = 'Select Visit Reason';
                    }
                    var checkedArray = _.where($scope.GetVisitReasonArray, { IsChecked: true });
                    $scope.SlotsParamObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.GetVisitReasonArray.length === checkedArray.length;
                };

                $scope.NewAppointmentTypeToggle = function (item) {
                    var checkedArray = _.where($scope.appointmentTypes, { IsChecked: true });
                    $scope.SlotsParamObj.AllAppointmentTypeStatusCheck = checkedArray.length > 0 && $scope.appointmentTypes.length === checkedArray.length ? true : false;

                    if (item.IsChecked) {
                        angular.forEach($scope.GetVisitReasonArray, function (hitem) {
                            if (hitem.VisitTypeId === item.AppointmentTypeId) {
                                hitem.IsChecked = true;
                                hitem.IsHide = false;
                            }
                        });
                        $scope.SlotsParamObj.AllVisitReasonsCheck = true;
                    } else {
                        angular.forEach($scope.GetVisitReasonArray, function (hitem) {
                            if (hitem.VisitTypeId === item.AppointmentTypeId) {
                                hitem.IsChecked = false;
                                hitem.IsHide = true;
                            }
                        });
                        if (checkedArray.length > 0) {
                            $scope.SlotsParamObj.AllVisitReasonsCheck = true;
                        } else {
                            $scope.SlotsParamObj.AllVisitReasonsCheck = false;
                        }

                    }

                };

                // Advanced Slots' "Select Timeslot" candidates are generated by onDurationChange at the
                // org's step interval (e.g. every 20 min) but each spans the CHOSEN duration (e.g. 60
                // min) — so consecutive candidates overlap by design (7:00-8:00, 7:20-8:20, 7:40-8:40...).
                // Checking one must block picking any other candidate that overlaps its span, otherwise
                // the admin could add two slots that both claim 7:00-8:00's time, e.g. 7:00-8:00 AND
                // 7:20-8:20 together. Recomputes disabled state for the whole list from scratch every
                // time, based on whichever slots are currently checked — used from both the direct
                // add flow (AllDaySlotToggle) and the edit-load flow (EditSlotinSlotWise).
                function recomputeSlotOverlapDisabling(allDaySlots) {
                    allDaySlots = allDaySlots || [];
                    var checked = allDaySlots.filter(function (s) { return s.IsChecked; });
                    angular.forEach(allDaySlots, function (slot) {
                        if (slot.IsChecked) {
                            slot.IsOverlapDisabled = false;
                            return;
                        }
                        slot.IsOverlapDisabled = checked.some(function (c) {
                            return slot.seqStartTime < c.seqEndTime && slot.seqEndTime > c.seqStartTime;
                        });
                    });
                }

                $scope.AllDaySlotToggle = function (item, parentObj) {
                    recomputeSlotOverlapDisabling(parentObj.allDaySlots);
                    var checkedArray = _.where(parentObj.allDaySlots, { IsChecked: true });
                    $scope.AllDaySlotsObj.AllSlotsCheck = checkedArray.length > 0 && parentObj.allDaySlots.length === checkedArray.length ? true : false;
                    if ($scope.AllDaySlotsObj.AllSlotsCheck) {
                        $scope.AllDaySlotsObj.SlotsText = "All";
                    } else {
                        $scope.AllDaySlotsObj.SlotsText = "Selected";
                    }
                };

                $scope.NewSelectVisitType = 'Select Visit Types';
                $scope.NewCheckAllAppointmenTypeStatus = function (boolval) {
                    if (boolval) {
                        angular.forEach($scope.appointmentTypes, function (item) {
                            if (item.AppointmentTypeId == 1 || item.AppointmentTypeId == 2 || item.AppointmentTypeId == 3 || item.AppointmentTypeId == 4 || item.AppointmentTypeId == 5) {
                                item.IsChecked = true;
                            }
                        });

                        angular.forEach($scope.GetVisitReasonArray, function (hitem) {
                            angular.forEach($scope.appointmentTypes, function (kitem) {
                                if (kitem.IsChecked && kitem.AppointmentTypeId === hitem.VisitTypeId) {
                                    hitem.IsChecked = false;
                                    hitem.IsHide = false;
                                }
                            });
                        });

                        $scope.NewSelectVisitType = 'All';
                    }
                    else {
                        angular.forEach($scope.appointmentTypes, function (item) {
                            item.IsChecked = false;
                        });

                        angular.forEach($scope.GetVisitReasonArray, function (hitem) {
                            hitem.IsChecked = false;
                            hitem.IsHide = true;
                        });

                        $scope.NewSelectVisitType = 'Select Visit Types';
                    }
                    var checkedArray = _.where($scope.appointmentTypes, { IsChecked: true });
                    $scope.SlotsParamObj.AllAppointmentTypeStatusCheck = checkedArray.length > 0 && $scope.appointmentTypes.length === checkedArray.length ? true : false;

                };

                $scope.CheckAllSlots = function (boolval, obj) {
                    if (boolval) {
                        angular.forEach(obj.allDaySlots, function (item) {
                            item.IsChecked = true;
                        });
                        // Checking every candidate at once would include overlapping duration-based
                        // slots (e.g. 7:00-8:00 AND 7:20-8:20 together) — greedily keep only the first
                        // of each overlapping group, in chronological order, drop the rest.
                        angular.forEach(obj.allDaySlots, function (item) {
                            recomputeSlotOverlapDisabling(obj.allDaySlots);
                            if (item.IsOverlapDisabled) {
                                item.IsChecked = false;
                            }
                        });
                        recomputeSlotOverlapDisabling(obj.allDaySlots);

                        $scope.AllDaySlotsObj.SlotsText = 'All';
                    }
                    else {
                        angular.forEach(obj.allDaySlots, function (item) {
                            item.IsChecked = false;
                        });
                        recomputeSlotOverlapDisabling(obj.allDaySlots);

                        $scope.AllDaySlotsObj.SlotsText = 'Select Slot';
                    }
                    var checkedArray = _.where(obj.allDaySlots, { IsChecked: true });
                    $scope.AllDaySlotsObj.AllSlotsCheck = checkedArray.length > 0 && obj.allDaySlots.length === checkedArray.length ? true : false;

                };

                //New Slots Code Added by Durga on 11-04-2023

                $scope.ScheduledSlotVisitReasonsArray = [];

                function getAddNewAdvancedSlotReqObj() {
                    var obj = {
                        "SlotId": 0,
                        "SlotType": "1",
                        "SlotTypeName": "Availability",
                        "VisitReasons": [],
                        "OnlineVisitReasons": [],
                        "TimeSlot": "",
                        "MaxNumberOfSlots": "",
                        "ScheduleVisitTypeDetailId": 0,
                        "UserScheduleDetailId": 0,
                        "IsEdit": false,
                        "PayorObj": '',
                        "SlotStartTime": "",   
                        "SlotEndTime": "",     
                        "DurationMinutes": null,
                        "PayorTypes": []       
                    };
                    return obj;
                }

                $scope.addNewAdvancedSlotReqObj = getAddNewAdvancedSlotReqObj();

                $scope.activeParticularAdvancedSlot = function (item) {
                    if (!item.IsSelected) {
                        item.IsSelected = true;
                    } else {
                        item.IsSelected = false;
                    }
                };

                $scope.getFieldAdvancedClass = function (item) {
                    var aclass = "";
                    if (item.IsSelected) {
                        aclass = "bg-5eaf8d";
                    }

                    return aclass;
                }
                $scope.NewSelectedOnlineVisitReason = "Select";

                $scope.OnlineVisitReasonToggle = function (item) {

                    var checkedArray = _.where($scope.AllOnlineApptVistReasonsArray, { IsChecked: true });

                    $scope.SlotsParamObj.AllOnlineVisitReasonsCheck =
                        checkedArray.length > 0 &&
                        checkedArray.length == $scope.AllOnlineApptVistReasonsArray.length;

                    if (checkedArray.length > 0) {
                        $scope.NewSelectedOnlineVisitReason = "Selected";
                    }
                    else {
                        $scope.NewSelectedOnlineVisitReason = "Select";
                    }

                };


                $scope.CheckAllOnlineVisitReasons = function (boolval) {

                    angular.forEach($scope.AllOnlineApptVistReasonsArray, function (item) {

                        item.IsChecked = boolval;

                    });

                    if (boolval) {
                        $scope.NewSelectedOnlineVisitReason = "All Online Visit Reasons";
                    }
                    else {
                        $scope.NewSelectedOnlineVisitReason = "Select";
                    }

                };
                $scope.addSlotForlist = function (mainitem) {
                    console.log($scope.addNewAdvancedSlotReqObj);
                   // let filteredVisitReasonArray = _.where($scope.GetVisitReasonArray, { IsChecked: true });


                    let filteredVisitReasonArray = [];
                    let filteredOnlineVisitReasonArray = [];
                     // Availability
                    if ($scope.addNewAdvancedSlotReqObj.SlotType == "1") {    
                        filteredVisitReasonArray = _.where($scope.GetVisitReasonArray, { IsChecked: true });                       

                    }
                    else if ($scope.addNewAdvancedSlotReqObj.SlotType == "3") {
                        filteredOnlineVisitReasonArray = _.where($scope.AllOnlineApptVistReasonsArray, { IsChecked: true });   

                    }

                    //if ($scope.addNewAdvancedSlotReqObj.TimeSlot == "") {
                    //    alertify.error("Please select slot!");
                    //    return;
                    //}
                    let SelectedSlotslen;
                    let tempArray = $filter('filter')(mainitem.allDaySlots, { "IsChecked": true }, true);
                    if (tempArray.length == 0) {
                        alertify.error("Please select slot!"); 
                        return;
                    } else {
                        SelectedSlotslen = tempArray.length;
                    }

                    if (
                        ($scope.addNewAdvancedSlotReqObj.SlotType == "1" &&
                            filteredVisitReasonArray.length == 0)
                        ||
                        ($scope.addNewAdvancedSlotReqObj.SlotType == "3" &&
                            filteredOnlineVisitReasonArray.length == 0)
                    ) {
                        alertify.error("Please select visit reason!");
                        return;
                    }
                    //if ($scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots == "" && $scope.addNewAdvancedSlotReqObj.SlotType == 1) {
                    //    alertify.error("Please enter maxslots!");
                    //    return;
                    //}

                    // Range-overlap check, not just exact-start match: a duration-based candidate (e.g. a
                    // 60-min slot at 8:00) can start at a time that never exactly equals an already-added
                    // slot's start, while still landing squarely inside it (e.g. an existing 7:40-8:40
                    // Availability slot) — the old exact-match check let those through silently.
                    let slotcount = 0;
                    angular.forEach(mainitem.ScheduledSlotVisitReasonsArray, function (item) {
                        angular.forEach(mainitem.allDaySlots, function (kitem) {
                            if (kitem.IsChecked &&
                                kitem.seqStartTime < item.TimeSlot.seqEndTime &&
                                kitem.seqEndTime > item.TimeSlot.seqStartTime) {
                                slotcount++;
                            }
                        });
                    });
                    if (slotcount > 0) {
                        alertify.error("Slot has already been added!");
                        return;
                    }

                    let sum = 0;
                    mainitem.ScheduledSlotVisitReasonsArray = mainitem.ScheduledSlotVisitReasonsArray || [];
                    if (mainitem.ScheduledSlotVisitReasonsArray.length > 0) {
                        angular.forEach(mainitem.ScheduledSlotVisitReasonsArray, function (item) {
                            item.MaxNumberOfSlots = item.MaxNumberOfSlots || "";
                            if (item.MaxNumberOfSlots != "") {
                                sum += parseInt(item.MaxNumberOfSlots);
                            }
                        });
                    }

                    sum += (parseInt($scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots)) * SelectedSlotslen;
                    mainitem.MaximumOverAllSlots = mainitem.MaximumOverAllSlots || 0; 
                    if (parseInt(mainitem.MaximumOverAllSlots) !== 0) {
                        if (sum > parseInt(mainitem.MaximumOverAllSlots)) {
                            alertify.error("Overall Max slot limit cannot be exceeded!");
                            $scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots = "";
                            return;
                        }
                    }

                    if (mainitem.MaximumOverAllSlots === 0) {
                        $scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots = $scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots || "";
                        if ($scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots != '') {
                            alertify.error("Please enter overall max slot for the schedule");
                            return false;
                        }
                    }

                    angular.forEach(mainitem.allDaySlots, function (hitem) {
                        if (hitem.IsChecked) {
                            let obj = getAddNewAdvancedSlotReqObj();
                            obj.SlotId = $scope.addNewAdvancedSlotReqObj.SlotId;
                            obj.SlotType = $scope.addNewAdvancedSlotReqObj.SlotType;
                            obj.TimeSlot = angular.copy(hitem);
                            obj.VisitReasons = angular.copy(filteredVisitReasonArray) || [];
                            obj.OnlineVisitReasons = angular.copy(filteredOnlineVisitReasonArray) || [];
                            obj.MaxNumberOfSlots = angular.copy($scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots);
                            obj.DurationMinutes = angular.copy($scope.addNewAdvancedSlotReqObj.DurationMinutes);
                            obj.IsInsuranceBasedScheduling = angular.copy($scope.UserDetailedSlotObj.IsInsuranceBasedScheduling);
                            obj.isDurationBasedSlots = angular.copy($scope.UserDetailedSlotObj.isDurationBasedSlots);
                            obj.PayorTypes = [];
                            if ($scope.UserDetailedSlotObj.IsInsuranceBasedScheduling) {
                                angular.forEach($scope.MasterPayosTypesArray, function (pt) {
                                    if (pt.IsChecked) {
                                        obj.PayorTypes.push(angular.copy(pt));
                                    }
                                });
                            }
                            mainitem.ScheduledSlotVisitReasonsArray.push(obj);
                        }
                    });

                    $scope.clearSlotsForApptList(mainitem,'add');
                };



                $scope.onSlotStartTimeChange = function () {
                    var startTime = $scope.addNewAdvancedSlotReqObj.SlotStartTime;
                    if (!startTime) {
                        $scope.SlotEndTimeValues = angular.copy($scope.SlotStartTimeValues);
                        return;
                    }

                    // Only show end times AFTER start time
                    $scope.SlotEndTimeValues = [];
                    var startFound = false;
                    angular.forEach($scope.SlotStartTimeValues, function (item) {
                        if (startFound) {
                            $scope.SlotEndTimeValues.push(item);
                        }
                        if (item.time === startTime) {
                            startFound = true;
                        }
                    });

                    // Add day end time
                    var activeDayItem = null;
                    angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (sitem) {
                        if (sitem.IsEdit) {
                            activeDayItem = sitem;
                        }
                    });
                    if (activeDayItem) {
                        var endTimeStr = activeDayItem.EndTime;
                        var existing = _.find($scope.SlotEndTimeValues, { time: endTimeStr });
                        if (!existing) {
                            var endMoment = moment().hours(endTimeStr.split(':')[0]).minutes(endTimeStr.split(':')[1]);
                            $scope.SlotEndTimeValues.push({
                                "time": endTimeStr,
                                "newtime": endMoment.format("hh:mm A")
                            });
                        }
                    }

                    // Reset end time
                    $scope.addNewAdvancedSlotReqObj.SlotEndTime = "";
                };

       
                $scope.clearSlotsForApptList = function (mainitem,type) {
                    angular.forEach($scope.GetVisitReasonArray, function (hitem) {
                        hitem.IsChecked = false;
                    });

                    angular.forEach($scope.AllOnlineApptVistReasonsArray, function (hitem) {
                        hitem.IsChecked = false;
                    });

                    angular.forEach(mainitem.allDaySlots, function (hitem) {
                        hitem.IsChecked = false;
                    });

                    $scope.SlotsParamObj = {
                        "AllVisitReasonsCheck": false,
                        "AllAppointmentTypeStatusCheck": false,
                        "ApptTypename": "",
                        "VisitRsnName": "",
                        "IsOptionsDisabled": false,
                        "IsonlineVisitreason": false
                    };
                    $scope.AllDaySlotsObj = {
                        "AllSlotsCheck": false,
                        "Slot": "",
                        "SlotsText": "Select Slot"
                    };
                    $scope.NewselectedVisitReason = 'Select Visit Reason';
                    $scope.NewSelectedOnlineVisitReason = "Select";
                    $scope.addNewAdvancedSlotReqObj = getAddNewAdvancedSlotReqObj();
                    // Clear the timeslot list since duration is reset
                    mainitem.allDaySlots = [];
                    // Legacy Slot Wise has no Duration control to repopulate this list afterward (unlike
                    // Advanced Slots, where picking a new Duration triggers onDurationChange) — regenerate
                    // it now at the org default so the next Add (same Slot Type or a different one, e.g.
                    // switching straight to Break Slot without touching the dropdown) has candidates.
                    if (!$scope.Obj.isDurationBasedSlots && mainitem.StartTime && mainitem.EndTime) {
                        $scope.addNewAdvancedSlotReqObj.DurationMinutes = parseInt($scope.FinalObj.AverageConsultationTime, 10) || 15;
                        $scope.onDurationChange(mainitem);
                    }
                    $scope.UserDetailedSlotObj.SelectedPayorText = 'Select';
                    $scope.UserDetailedSlotObj.SelectedPayorTypes = [];
                    angular.forEach($scope.MasterPayosTypesArray, function (item) {
                        item.IsChecked = false;
                    });
                    $scope.addNewAdvancedSlotReqObj.SlotStartTime = "";
                    $scope.addNewAdvancedSlotReqObj.SlotEndTime = "";
                    if (type == 'add') {
                        let editedUserSchedule = $filter("filter")($scope.UserDetailedSlotObj.UserScheduleDetails, function (item) {
                            return item.IsShowAllDays;
                        }) || [];
                        if (editedUserSchedule.length > 0) {
                            editedUserSchedule[0].IsShowAllDays = false;
                            $scope.ShowHideAllDays(editedUserSchedule[0]);
                        }
                      
                    }
                };
                $scope.removeSlotAdvanceList = function (citem, sitem, parentobj) {
                    let index1 = parentobj.ScheduledSlotVisitReasonsArray.indexOf(sitem);
                    if (index1 > -1) {
                        angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (item) {
                            if (parentobj.DayId === item.DayId) {
                                let index2 = item.ScheduledSlotVisitReasonsArray[index1].VisitReasons.indexOf(citem);
                                if (index2 > -1) {
                                    item.ScheduledSlotVisitReasonsArray[index1].VisitReasons.splice(index2, 1);
                                }
                                if (item.ScheduledSlotVisitReasonsArray[index1].VisitReasons.length > 0) {
                                    item.ScheduledSlotVisitReasonsArray[index1].IsDataAdded = true;
                                } else {
                                    item.ScheduledSlotVisitReasonsArray[index1].IsDataAdded = false;
                                }
                            }

                        });
                    }
                };

                $scope.removeFromSlotWiseList = function (obj, parentObj) {
                    let index = parentObj.ScheduledSlotVisitReasonsArray.indexOf(obj);
                    if (index > -1) {
                        parentObj.ScheduledSlotVisitReasonsArray.splice(index, 1);
                    }
                };

                $scope.onSlotTypeSelect = function (val) {
                    // Reset duration and timeslots on slot type change
                    $scope.addNewAdvancedSlotReqObj.SlotStartTime = "";
                    $scope.addNewAdvancedSlotReqObj.SlotEndTime = "";
                    $scope.addNewAdvancedSlotReqObj.DurationMinutes = null;
                    var activeDayItem = null;
                    angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (sitem) {
                        if (sitem.IsEdit) {
                            activeDayItem = sitem;
                        }
                    });
                    if (activeDayItem) {
                        activeDayItem.allDaySlots = [];
                    }

                    $scope.AllDaySlotsObj = {
                        "AllSlotsCheck": false,
                        "Slot": "",
                        "SlotsText": "Select Slot"
                    };

                    if (val === "2") {
                        $scope.SlotsParamObj.IsOptionsDisabled = true;
                        $scope.SlotsParamObj.IsonlineVisitreason = false;
                        angular.forEach($scope.GetVisitReasonArray, function (item) {
                            item.IsChecked = false;
                        });
                        $scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots = "";
                        $scope.NewselectedVisitReason = 'Select Visit Reason';
                        angular.forEach($scope.MasterPayosTypesArray, function (item) {
                            item.IsChecked = false;
                        });
                        $scope.UserDetailedSlotObj.SelectedPayorText = "Select";
                        angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (sitem) {
                            if (sitem.IsEdit) {
                                activeDayItem = sitem;
                            }
                        });

                        if (activeDayItem && activeDayItem.StartTime && activeDayItem.EndTime) {
                            var defaultDuration = parseInt($scope.FinalObj.AverageConsultationTime, 10) || 15;
                            // Temporarily set duration to default and generate slots
                            $scope.addNewAdvancedSlotReqObj.DurationMinutes = defaultDuration;
                            $scope.onDurationChange(activeDayItem);
                            // Reset duration back to null (user can override)
                            $scope.addNewAdvancedSlotReqObj.DurationMinutes = null;
                        }
                    } else if (val === "3") {
                        $scope.SlotsParamObj.IsOptionsDisabled = false;
                        $scope.SlotsParamObj.IsonlineVisitreason = true;
                        $scope.getAllOnlineVisitReasons();
                    } else {
                        $scope.SlotsParamObj.IsOptionsDisabled = false;
                        $scope.SlotsParamObj.IsonlineVisitreason = false;
                    }
                };

                // "Slot Wise" tab's Slot Type handler (pre-duration-work behavior, restored for the BA's
                // tab split) — same reset/side-effect logic as onSlotTypeSelect above, but never touches
                // allDaySlots or shows a Duration control. This tab's Select Timeslot list is generated
                // once, at the org's default AverageConsultationTime, by changetoAdvanceMode when the tab
                // is opened (unchanged since before the duration-based work), and stays valid across Slot
                // Type changes since it was never type- or duration-specific to begin with. DurationMinutes
                // is still set here (silently, no UI) to the org default so slots added from this tab carry
                // a real duration value in the save payload, matching what was always saved historically.
                $scope.onSlotTypeSelectLegacy = function (val) {
                    $scope.addNewAdvancedSlotReqObj.SlotStartTime = "";
                    $scope.addNewAdvancedSlotReqObj.SlotEndTime = "";
                    $scope.addNewAdvancedSlotReqObj.DurationMinutes = parseInt($scope.FinalObj.AverageConsultationTime, 10) || 15;

                    $scope.AllDaySlotsObj = {
                        "AllSlotsCheck": false,
                        "Slot": "",
                        "SlotsText": "Select Slot"
                    };

                    // Regenerate this tab's Select Timeslot candidates on every Slot Type change, not just
                    // when the tab first opens. addSlotForlist wipes allDaySlots after each successful Add
                    // (comment there: "Clear the timeslot list since duration is reset") expecting the
                    // Advanced Slots tab's Duration dropdown to rebuild it — but legacy Slot Wise has no
                    // Duration control to trigger that, so after adding one slot the list stayed empty for
                    // every Slot Type picked afterward (e.g. switching to Break Slot showed nothing).
                    var activeDayItem = null;
                    angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (sitem) {
                        if (sitem.IsEdit) {
                            activeDayItem = sitem;
                        }
                    });
                    if (activeDayItem && activeDayItem.StartTime && activeDayItem.EndTime) {
                        $scope.onDurationChange(activeDayItem);
                    }

                    if (val === "2") {
                        $scope.SlotsParamObj.IsOptionsDisabled = true;
                        $scope.SlotsParamObj.IsonlineVisitreason = false;
                        angular.forEach($scope.GetVisitReasonArray, function (item) {
                            item.IsChecked = false;
                        });
                        $scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots = "";
                        $scope.NewselectedVisitReason = 'Select Visit Reason';
                        angular.forEach($scope.MasterPayosTypesArray, function (item) {
                            item.IsChecked = false;
                        });
                        $scope.UserDetailedSlotObj.SelectedPayorText = "Select";
                    } else if (val === "3") {
                        $scope.SlotsParamObj.IsOptionsDisabled = false;
                        $scope.SlotsParamObj.IsonlineVisitreason = true;
                        $scope.getAllOnlineVisitReasons();
                    } else {
                        $scope.SlotsParamObj.IsOptionsDisabled = false;
                        $scope.SlotsParamObj.IsonlineVisitreason = false;
                    }
                };

                $scope.removeOnlineAdvancedSlots = function (obj, parentobj) {
                    let index = parentobj.ScheduledSlotVisitReasonsArray.indexOf(obj);
                    if (index > -1) {
                        angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (item) {
                            if (item.DayId === parentobj.DayId) {
                                item.ScheduledSlotVisitReasonsArray.splice(index, 1);
                            }
                        });
                    }
                };

                $scope.removeBreakAdvancedSlots = function (obj, parentobj) {
                    let index = parentobj.ScheduledSlotVisitReasonsArray.indexOf(obj);
                    if (index > -1) {
                        angular.forEach($scope.UserDetailedSlotObj.UserScheduleDetails, function (item) {
                            if (item.DayId === parentobj.DayId) {
                                item.ScheduledSlotVisitReasonsArray.splice(index, 1);
                            }
                        });
                    }
                };

                $scope.clearDayDataInEdit = function (obj) {
                    obj.StartTime = "";
                    obj.EndTime = "";
                    obj.BranchObj = "";
                    obj.BranchId = null;
                    obj.UserBranchId = null;
                    obj.MaximumOverAllSlots = "";
                    obj.ScheduledSlotVisitReasonsArray = [];

                    obj.NewAppointmentSlots = angular.copy($scope.Obj.NewAppointmentSlots);
                    obj.ClinicalFollowAppointmentSlots = angular.copy($scope.Obj.ClinicalFollowAppointmentSlots);
                    obj.PostOpFollowAppointmentSlots = angular.copy($scope.Obj.PostOpFollowAppointmentSlots);
                    obj.ASCFollowAppointmentSlots = angular.copy($scope.Obj.ASCFollowAppointmentSlots);
                    obj.InvestigationSlots = angular.copy($scope.Obj.InvestigationSlots) || [];
                    obj.OnlineSlots = [
                        {
                            "UserScheduleOnlineBreakDetailId": 0,
                            "UserScheduleId": 0,
                            "BranchId": null,
                            "UserBranchId": null,
                            "SlotStartValues": [],
                            "SlotEndValues": [],
                            "StartTime": "",
                            "EndTime": "",
                            "TypeId": 1,
                            "DeleteInd": "N"
                        }
                    ];
                    obj.BreakSlots = [
                        {
                            "UserScheduleOnlineBreakDetailId": 0,
                            "UserScheduleId": 0,
                            "BranchId": null,
                            "UserBranchId": null,
                            "SlotStartValues": [],
                            "SlotEndValues": [],
                            "StartTime": "",
                            "EndTime": "",
                            "TypeId": 2,
                            "DeleteInd": "N"
                        }
                    ];
                    obj.SlotsList = [];

                    obj.NewAppointmentMaxSlots = null;
                    obj.ClinicFollowUpAppointmentMaxSlots = null;
                    obj.PostOpFollowUpAppointmentMaxSlots = null;
                    obj.ASCAppointmentMaxSlots = null;
                    obj.InvestigationMaxSlots = null;
                };

                $scope.OnChangeMaxSlots = function (item, val) {
                    item.MaximumOverAllSlots = item.MaximumOverAllSlots || "";
                    item.NewAppointmentMaxSlots = item.NewAppointmentMaxSlots || "";
                    item.ClinicFollowUpAppointmentMaxSlots = item.ClinicFollowUpAppointmentMaxSlots || "";
                    item.PostOpFollowUpAppointmentMaxSlots = item.PostOpFollowUpAppointmentMaxSlots || "";
                    item.ASCAppointmentMaxSlots = item.ASCAppointmentMaxSlots || "";
                    item.InvestigationMaxSlots = item.InvestigationMaxSlots || "";

                    let sum = 0;
                    sum += ((item.NewAppointmentMaxSlots != "") ? parseInt(item.NewAppointmentMaxSlots) : 0) + ((item.ClinicFollowUpAppointmentMaxSlots != "") ? parseInt(item.ClinicFollowUpAppointmentMaxSlots) : 0) + ((item.PostOpFollowUpAppointmentMaxSlots != "") ? parseInt(item.PostOpFollowUpAppointmentMaxSlots) : 0) + ((item.ASCAppointmentMaxSlots != "") ? parseInt(item.ASCAppointmentMaxSlots) : 0) + ((item.InvestigationMaxSlots != "") ? parseInt(item.InvestigationMaxSlots) : 0);
                    if (item.MaximumOverAllSlots !== "") {
                        if (sum > parseInt(item.MaximumOverAllSlots)) {
                            alertify.error("Number of slots cannot exceed overall max slot limit");
                            if (val === 1) {
                                item.NewAppointmentMaxSlots = "";
                            }
                            if (val === 2) {
                                item.ClinicFollowUpAppointmentMaxSlots = "";
                            }
                            if (val === 3) {
                                item.PostOpFollowUpAppointmentMaxSlots = "";
                            }
                            if (val === 4) {
                                item.ASCAppointmentMaxSlots = "";
                            }
                            if (val === 5) {
                                item.InvestigationMaxSlots = "";
                            }
                            return;
                        }
                    }
                };

                $scope.EditSlotinSlotWise = function (obj, parentObj) {
                    obj = obj || "";
                    parentObj = parentObj || "";
                    if (obj != "") {
                        $scope.addNewAdvancedSlotReqObj.SlotType = obj.SlotType;
                        $scope.addNewAdvancedSlotReqObj.SlotTypeName = obj.SlotTypeName;
                        $scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots = obj.MaxNumberOfSlots;
                        $scope.addNewAdvancedSlotReqObj.DurationMinutes = obj.DurationMinutes || 0;
                        //newcondition
                        if (!$scope.addNewAdvancedSlotReqObj.DurationMinutes) {
                            $scope.addNewAdvancedSlotReqObj.DurationMinutes = parseInt($scope.FinalObj.AverageConsultationTime) || 15;
                            obj.DurationMinutes = parseInt($scope.FinalObj.AverageConsultationTime) || 0;
                        }
                        $scope.addNewAdvancedSlotReqObj.IsEdit = true;

                        // Regenerate timeslots based on this slot's duration
                        if (obj.DurationMinutes) {
                            $scope.onDurationChange(parentObj);
                        }

                        if (obj.SlotType == "2") {
                            $scope.SlotsParamObj.IsOptionsDisabled = true;
                            $scope.SlotsParamObj.IsonlineVisitreason = false;
                        } else if (obj.SlotType == "3") {
                            $scope.SlotsParamObj.IsOptionsDisabled = false;
                            $scope.SlotsParamObj.IsonlineVisitreason = true;
                        } else {
                            $scope.SlotsParamObj.IsOptionsDisabled = false;
                            $scope.SlotsParamObj.IsonlineVisitreason = false;
                        }
                    }

                    // Time Slot Selection
                    angular.forEach(parentObj.allDaySlots, function (item) {
                        item.IsChecked = false;
                        if (item.seqStartTime === obj.TimeSlot.seqStartTime) {
                            item.IsChecked = true;
                        }
                    });
                    recomputeSlotOverlapDisabling(parentObj.allDaySlots);

                    // Availability Visit Reasons
                    if (obj.SlotType == "1") {
                        angular.forEach($scope.GetVisitReasonArray, function (item) {
                            item.IsChecked = false;
                            angular.forEach(obj.VisitReasons, function (kitem) {
                                if (kitem.ReasonId == item.ReasonId) {
                                    item.IsChecked = true;

                                }
                            });
                        });

       
                        if (obj.PayorTypes.length > 0) {
                            $scope.UserDetailedSlotObj.SelectedPayorTypes = [];
                            $scope.MasterPayosTypesArray = angular.copy($scope.CopyMasterPayosTypesArray);
                            angular.forEach($scope.MasterPayosTypesArray, function (item) {
                                item.IsChecked = false;
                                angular.forEach(obj.PayorTypes, function (kitem) {
if(kitem.PayorId==0){
kitem.PayorName="Self Pay";
}
                                    if (kitem.OrganizationPayorId == item.OrganizationPayorId) {
                                        item.IsChecked = true;
                                        $scope.UserDetailedSlotObj.SelectedPayorTypes.push(kitem);

                                    }
                                });
                            });
                            $scope.UserDetailedSlotObj.SelectedPayorText = $scope.UserDetailedSlotObj.SelectedPayorTypes.length ? $scope.UserDetailedSlotObj.SelectedPayorTypes.map(function (x) { return x.PayorName; }).join(", ") : "Open to All";

                        }
                    }

                    // Online Visit Reasons
                    if (obj.SlotType == "3") {
                        angular.forEach($scope.AllOnlineApptVistReasonsArray, function (item) {
                            item.IsChecked = false;
                            angular.forEach(obj.OnlineVisitReasons, function (kitem) {
                                if (kitem.ParentOnlineAppointmentVisitReasonId == item.ParentOnlineAppointmentVisitReasonId) {
                                    item.IsChecked = true;
                                }
                            });
                        });
                        if (obj.PayorTypes.length > 0) {
                            $scope.UserDetailedSlotObj.SelectedPayorTypes = [];
                            $scope.MasterPayosTypesArray = angular.copy($scope.CopyMasterPayosTypesArray);
                            angular.forEach($scope.MasterPayosTypesArray, function (item) {
                                item.IsChecked = false;
                                angular.forEach(obj.PayorTypes, function (kitem) {
if(kitem.PayorId==0){
kitem.PayorName="Self Pay";
}
                                    if (kitem.OrganizationPayorId == item.OrganizationPayorId) {
                                        item.IsChecked = true;
                                        $scope.UserDetailedSlotObj.SelectedPayorTypes.push(kitem);
                                    }
                                });
                            });
                            $scope.UserDetailedSlotObj.SelectedPayorText = $scope.UserDetailedSlotObj.SelectedPayorTypes.length ? $scope.UserDetailedSlotObj.SelectedPayorTypes.map(function (x) { return x.PayorName; }).join(", ") : "Open to All";

                        }
                    }
                };
                //$scope.EditSlotinSlotWise = function (obj, parentObj) {
                //    obj = obj || "";
                //    parentObj = parentObj || "";
                //    if (obj != "") {
                //        $scope.addNewAdvancedSlotReqObj.SlotType = obj.SlotType;
                //        $scope.addNewAdvancedSlotReqObj.SlotTypeName = obj.SlotTypeName;
                //        $scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots = obj.MaxNumberOfSlots;
                //        $scope.addNewAdvancedSlotReqObj.IsEdit = true;
                //        if ($scope.addNewAdvancedSlotReqObj.SlotType == "2" || $scope.addNewAdvancedSlotReqObj.SlotType == "3") {
                //            $scope.SlotsParamObj.IsOptionsDisabled = true;
                //        } else {
                //            $scope.SlotsParamObj.IsOptionsDisabled = false;
                //        }
                //    }

                //    angular.forEach(parentObj.allDaySlots, function (item) {
                //        item.IsChecked = false;
                //        if (item.seqStartTime === obj.TimeSlot.seqStartTime) {
                //            item.IsChecked = true;
                //        }
                //    });

                //    angular.forEach($scope.GetVisitReasonArray, function (item) {
                //        item.IsChecked = false;
                //        angular.forEach(obj.VisitReasons, function (kitem) {
                //            if (kitem.ReasonId === item.ReasonId) {
                //                item.IsChecked = true;
                //            }
                //        });
                //    });
                //};

                //$scope.UpdateSlotDetails = function (obj) {

                //    obj.ScheduledSlotVisitReasonsArray = obj.ScheduledSlotVisitReasonsArray || [];
                //    let filteredVisitReasonArray = _.where($scope.GetVisitReasonArray, { IsChecked: true });

                //    let SelectedSlotslen;
                //    let tempArray = $filter('filter')(obj.allDaySlots, { "IsChecked": true }, true);
                //    if (tempArray.length == 0) {
                //        alertify.error("Please select slot!");
                //        return;
                //    } else {
                //        SelectedSlotslen = tempArray.length;
                //    }

                //    if (filteredVisitReasonArray.length == 0 && $scope.addNewAdvancedSlotReqObj.SlotType == 1) {
                //        alertify.error("Please select visit reason!");
                //        return;
                //    }

                //    let sum = 0;
                //    let selectedSlot = $filter('filter')(obj.allDaySlots, { "IsChecked": true }, true)[0];

                //    if (obj.ScheduledSlotVisitReasonsArray.length > 0) {
                //        angular.forEach(obj.ScheduledSlotVisitReasonsArray, function (item) {
                //            item.MaxNumberOfSlots = item.MaxNumberOfSlots || "";
                //            if (item.MaxNumberOfSlots != "") {
                //                if (item.TimeSlot.seqStartTime !== selectedSlot.seqStartTime) {
                //                    sum += parseInt(item.MaxNumberOfSlots);
                //                }
                //            }
                //        });
                //    }

                //    sum += parseInt($scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots);
                //    obj.MaximumOverAllSlots = obj.MaximumOverAllSlots || 0;
                //    if (parseInt(obj.MaximumOverAllSlots) !== 0) {
                //        if (sum > parseInt(obj.MaximumOverAllSlots)) {
                //            alertify.error("Overall Max slot limit cannot be exceeded!");
                //            $scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots = "";
                //            return;
                //        }
                //    }

                //    angular.forEach(obj.ScheduledSlotVisitReasonsArray, function (item) {
                //        if (item.TimeSlot.seqStartTime === selectedSlot.seqStartTime) {
                //            item.SlotType = $scope.addNewAdvancedSlotReqObj.SlotType;
                //            item.MaxNumberOfSlots = $scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots;
                //            item.VisitReasons = angular.copy(filteredVisitReasonArray);
                //        }
                //    });

                //    $scope.clearSlotsForApptList(obj);
                //};




                $scope.UpdateSlotDetails = function (obj) {

                    obj.ScheduledSlotVisitReasonsArray = obj.ScheduledSlotVisitReasonsArray || [];

                    // Availability & Online Visit Reasons
                    let filteredVisitReasonArray = [];
                    let filteredOnlineVisitReasonArray = [];

                    if ($scope.addNewAdvancedSlotReqObj.SlotType == "1") {

                        filteredVisitReasonArray = _.where($scope.GetVisitReasonArray, { IsChecked: true });

                    }
                    else if ($scope.addNewAdvancedSlotReqObj.SlotType == "3") {

                        filteredOnlineVisitReasonArray = _.where($scope.AllOnlineApptVistReasonsArray, { IsChecked: true });

                    }

                    let SelectedSlotslen;
                    let tempArray = $filter('filter')(obj.allDaySlots, { "IsChecked": true }, true);

                    if (tempArray.length == 0) {
                        alertify.error("Please select slot!");
                        return;
                    } else {
                        SelectedSlotslen = tempArray.length;
                    }

                    // Visit Reason Validation
                    if (
                        ($scope.addNewAdvancedSlotReqObj.SlotType == "1" &&
                            filteredVisitReasonArray.length == 0)
                        ||
                        ($scope.addNewAdvancedSlotReqObj.SlotType == "3" &&
                            filteredOnlineVisitReasonArray.length == 0)
                    ) {
                        alertify.error("Please select visit reason!");
                        return;
                    }

                    let sum = 0;
                    let selectedSlot = $filter('filter')(obj.allDaySlots, { "IsChecked": true }, true)[0];

                    if (obj.ScheduledSlotVisitReasonsArray.length > 0) {

                        angular.forEach(obj.ScheduledSlotVisitReasonsArray, function (item) {

                            item.MaxNumberOfSlots = item.MaxNumberOfSlots || "";

                            if (item.MaxNumberOfSlots != "") {

                                if (item.TimeSlot.seqStartTime !== selectedSlot.seqStartTime) {

                                    sum += parseInt(item.MaxNumberOfSlots);

                                }
                            }

                        });

                    }

                    sum += parseInt($scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots);

                    obj.MaximumOverAllSlots = obj.MaximumOverAllSlots || 0;

                    if (parseInt(obj.MaximumOverAllSlots) !== 0) {

                        if (sum > parseInt(obj.MaximumOverAllSlots)) {

                            alertify.error("Overall Max slot limit cannot be exceeded!");
                            $scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots = "";
                            return;

                        }

                    }

                    angular.forEach(obj.ScheduledSlotVisitReasonsArray, function (item) {

                        if (item.TimeSlot.seqStartTime === selectedSlot.seqStartTime) {

                            item.SlotType = $scope.addNewAdvancedSlotReqObj.SlotType;
                            item.MaxNumberOfSlots = $scope.addNewAdvancedSlotReqObj.MaxNumberOfSlots;

                            if ($scope.addNewAdvancedSlotReqObj.SlotType == "1") {

                                item.VisitReasons = angular.copy(filteredVisitReasonArray);
                                item.OnlineVisitReasons = [];

                            }
                            else if ($scope.addNewAdvancedSlotReqObj.SlotType == "3") {

                                item.VisitReasons = [];
                                item.OnlineVisitReasons = angular.copy(filteredOnlineVisitReasonArray);

                            }
    item.IsInsuranceBasedScheduling = angular.copy($scope.UserDetailedSlotObj.IsInsuranceBasedScheduling);
                            item.isDurationBasedSlots = angular.copy($scope.UserDetailedSlotObj.isDurationBasedSlots);
        item.PayorTypes = [];
        if ($scope.UserDetailedSlotObj.IsInsuranceBasedScheduling) {
            angular.forEach($scope.MasterPayosTypesArray, function (pt) {
                if (pt.IsChecked) {
                    item.PayorTypes.push(angular.copy(pt));
                }
            });
        }
                        }

                    });

                    $scope.clearSlotsForApptList(obj);

                };
                //change start time
                $scope.ChangeStartTimeSchedule = function (item) {
                    item.EndTime = "";
                    item.SlotEndValues = [];
                    if (item.SlotStartValues.length > 0) {
                        var count = 0;
                        angular.forEach(item.SlotStartValues, function (sitem) {
                            if (item.StartTime == sitem.time) {
                                count++;
                                return;
                            }
                            if (count > 0) {
                                item.SlotEndValues.push(sitem);
                            }
                        });
                    }
                }
                function getPayorListReqObj() {
                    var obj = {
                        "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.HospitalId }, true)[0],
                        "PayorTypeId": "",
                        "PayorId": 0,
                        "searchPayorName": "",
                        "PageSize": 10,
                        "PageNumber": 1,
                        "Status": "Active",
                        "TotalCount": 0,
                        "GetAllIndicator": false,
                        "PayorObj": ""
                    }
                    return obj;
                }
                $scope.searchConsultationHospitalTxt = "";
                $scope.getInsurancePayorListReqObj = getPayorListReqObj();
              
                $scope.TogglePayorType = function (item, slotObj) {
if(item.IsChecked){
  let chPayor = $filter("filter")(slotObj.SelectedPayorTypes, function (sitem) {
            return item.PayorId === sitem.PayorId;
        }) || [];
if(chPayor.length==0){
slotObj.SelectedPayorTypes.push(item);
}
}else{
 let chPayor = $filter("filter")(slotObj.SelectedPayorTypes, function (sitem) {
            return item.PayorId != sitem.PayorId;
        }) || [];
slotObj.SelectedPayorTypes=chPayor||[];
}

                  

                    slotObj.SelectedPayorText =
                        slotObj.SelectedPayorTypes.length
                            ? slotObj.SelectedPayorTypes.map(function (x) {
                                return x.PayorName;
                            }).join(", ")
                            : "Open to All";
                };
                $scope.ChangeInsurancePayor = function (obj, mainitem, GetMode) {

                    $scope.addNewAdvancedSlotReqObj.PayorId = obj.PayorId;
                    $scope.addNewAdvancedSlotReqObj.PayorName = obj.PayorName;
                    $scope.addNewAdvancedSlotReqObj.PayorCode = obj.PayorCode;
                    $scope.addNewAdvancedSlotReqObj.OrganizationPayorId = obj.OrganizationPayorId;



                }
            }

        });

        $scope.mInstanceAdd.result.then(function (resp) {
            $scope.GetUserScheduledSlots();
            $scope.AdminScheduleObj.ShowNewAddSchedule = false;
            $scope.AdminScheduleObj.IsShowEditSchedule = false;

        }, function (cancel) {
        });

    }

    function getUserSlotObj() {
        var obj = {
            "UserId": doctorinfo.doctorid,
            "BranchId": null,
            "DoctorId": null,
            "Type": "Duration",
            "ScheduleDate": $filter('date')(new Date(), "yyyy-MM-dd"),
            "FromDate": null,
            "ToDate": null,
            "ScheduleDuration": "",
            "ScheduleDurationType": "M",
            "UserScheduleId": 0,
            "DeleteInd": "N",
            "SlotStartValues": [],
            "SlotEndValues": [],
            "NewAppointmentMaxSlots": null,
            "ClinicFollowUpAppointmentMaxSlots": null,
            "ASCAppointmentMaxSlots": null,
            "PostOpFollowUpAppointmentMaxSlots": null,
            "InvestigationMaxSlots": null,
            "IsDetailedSchedule": false,
            "UserScheduleDetails": [
                {
                    "UserScheduleDetailId": 0,
                    "UserScheduleId": 0,
                    "BranchObj": "",
                    "BranchId": null,
                    "UserBranchId": null,
                    "Day": "Mon",
                    "DayId": 1,
                    "StartTime": "",
                    "EndTime": "",
                    "DeleteInd": "N",
                    "OnlineSlots": [],
                    "BreakSlots": [],
                    "ScheduledSlotVisitReasonsArray": []
                },
                {
                    "UserScheduleDetailId": 0,
                    "UserScheduleId": 0,
                    "BranchObj": "",
                    "BranchId": null,
                    "UserBranchId": null,
                    "Day": "Tue",
                    "DayId": 2,
                    "StartTime": "",
                    "EndTime": "",
                    "DeleteInd": "N",
                    "OnlineSlots": [],
                    "BreakSlots": [],
                    "ScheduledSlotVisitReasonsArray": []
                },
                {
                    "UserScheduleDetailId": 0,
                    "UserScheduleId": 0,
                    "BranchObj": "",
                    "BranchId": null,
                    "UserBranchId": null,
                    "DayId": 3,
                    "Day": "Wed",
                    "StartTime": "",
                    "EndTime": "",
                    "DeleteInd": "N",
                    "OnlineSlots": [],
                    "BreakSlots": [],
                    "ScheduledSlotVisitReasonsArray": []
                },
                {
                    "UserScheduleDetailId": 0,
                    "UserScheduleId": 0,
                    "BranchObj": "",
                    "BranchId": null,
                    "UserBranchId": null,
                    "Day": "Thu",
                    "DayId": 4,
                    "StartTime": "",
                    "EndTime": "",
                    "DeleteInd": "N",
                    "OnlineSlots": [],
                    "BreakSlots": [],
                    "ScheduledSlotVisitReasonsArray": []
                },
                {
                    "UserScheduleDetailId": 0,
                    "UserScheduleId": 0,
                    "BranchObj": "",
                    "BranchId": null,
                    "UserBranchId": null,
                    "Day": "Fri",
                    "DayId": 5,
                    "StartTime": "",
                    "EndTime": "",
                    "DeleteInd": "N",
                    "OnlineSlots": [],
                    "BreakSlots": [],
                    "ScheduledSlotVisitReasonsArray": []
                },
                {
                    "UserScheduleDetailId": 0,
                    "UserScheduleId": 0,
                    "BranchObj": "",
                    "BranchId": null,
                    "UserBranchId": null,
                    "Day": "Sat",
                    "DayId": 6,
                    "StartTime": "",
                    "EndTime": "",
                    "DeleteInd": "N",
                    "OnlineSlots": [],
                    "BreakSlots": [],
                    "ScheduledSlotVisitReasonsArray": []
                },
                {
                    "UserScheduleDetailId": 0,
                    "UserScheduleId": 0,
                    "BranchObj": "",
                    "BranchId": null,
                    "UserBranchId": null,
                    "Day": "Sun",
                    "DayId": 7,
                    "StartTime": "",
                    "EndTime": "",
                    "DeleteInd": "N",
                    "OnlineSlots": [],
                    "BreakSlots": [],
                    "ScheduledSlotVisitReasonsArray": []
                }
            ],
            "UserDaySlots": [],
            "UserDayBreakSlots": [],
            "UserScheduleName": ""
        }
        return obj;

    };
    $scope.UserSlotObj = getUserSlotObj();
    $scope.UserScheduleSlotsArray = [];






    //$scope.getUserSlotTimesList = function () {

    //    $scope.UserSlotObj.SlotStartValues = [];
    //    $scope.UserSlotObj.SlotEndValues = [];

    //    for (var i = 0; i < 24; i++) {
    //        var thistime = "";
    //        if (i > 12) {
    //            var it = i - 12;
    //            if (it > 9) {
    //                thistime = it + ':00' + ': PM';
    //            } else {
    //                thistime = '0' + it + ':00' + ': PM';
    //            }
    //        }
    //        else {
    //            var it = i;
    //            if (it > 9) {
    //                if (it >= 12) {
    //                    thistime = it + ':00' + ': PM';
    //                } else {
    //                    thistime = it + ':00' + ': AM';
    //                }

    //            } else {
    //                thistime = '0' + it + ':00' + ': AM';
    //            }
    //        }

    //        var obj = {
    //            "time": "",
    //            "newtime": ""
    //        }

    //        if (i > 9) {
    //            obj.time = i + ':00';
    //            obj.newtime = thistime;
    //        }
    //        else {
    //            obj.time = '0' + i + ':00';
    //            obj.newtime = thistime;
    //        }
    //        $scope.UserSlotObj.SlotStartValues.push(obj);
    //    }


    //    for (var i = 0; i < 24; i++) {
    //        var thistime = "";
    //        if (i > 12) {
    //            var it = i - 12;
    //            if (it > 9) {
    //                thistime = it + ':00' + ': PM';
    //            } else {
    //                thistime = '0' + it + ':00' + ': PM';
    //            }
    //        }
    //        else {
    //            var it = i;
    //            if (it > 9) {
    //                if (it >= 12) {
    //                    thistime = it + ':00' + ': PM';
    //                } else {
    //                    thistime = it + ':00' + ': AM';
    //                }

    //            } else {
    //                thistime = '0' + it + ':00' + ': AM';
    //            }
    //        }

    //        var obj = {
    //            "time": "",
    //            "newtime": ""
    //        }

    //        if (i > 9) {
    //            obj.time = i + ':00';
    //            obj.newtime = thistime;
    //        }
    //        else {
    //            obj.time = '0' + i + ':00';
    //            obj.newtime = thistime;
    //        }
    //        $scope.UserSlotObj.SlotEndValues.push(obj);
    //    }

    //};

    $scope.getUserSlotTimesList = function () {
        $scope.UserSlotObj.SlotStartValues = [];
        $scope.UserSlotObj.SlotEndValues = [];

        for (var i = 0; i < 24; i++) {
            var hour12 = i % 12 || 12; // Convert 24-hour to 12-hour format
            var period = i < 12 ? "AM" : "PM";
            var formattedTime = (hour12 < 10 ? "0" : "") + hour12 + ":00 " + period; // Ensure 2-digit format

            var obj = {
                time: (i < 10 ? "0" : "") + i + ":00",
                newtime: formattedTime
            };

            // Push to both SlotStartValues and SlotEndValues
            $scope.UserSlotObj.SlotStartValues.push(obj);
            $scope.UserSlotObj.SlotEndValues.push(obj);
        }
    };

    //$scope.getUserSlotTimesList();

    //$scope.getUserSlotTimesList();
    $scope.getEndTimesList = function (val, item, mainitem) {


        mainitem.SlotEndValues = [];

        for (var i = 0; i < 24; i++) {
            var thistime = "";
            if (i > 12) {
                var it = i - 12;
                if (it > 9) {
                    thistime = it + ':00' + ': PM';
                } else {
                    thistime = '0' + it + ':00' + ': PM';
                }
            }
            else {
                var it = i;
                if (it > 9) {
                    if (it >= 12) {
                        thistime = it + ':00' + ': PM';
                    } else {
                        thistime = it + ':00' + ': AM';
                    }

                } else {
                    thistime = '0' + it + ':00' + ': AM';
                }
            }

            var obj = {
                "time": "",
                "newtime": ""
            }

            if (i > 9) {
                obj.time = i + ':00';
                obj.newtime = thistime;
            }
            else {
                obj.time = '0' + i + ':00';
                obj.newtime = thistime;
            }
            mainitem.SlotEndValues.push(obj);
        }

        //for (var i = parseInt(val); i < 24; i++) {
        //    if (i > 9) {
        //        mainitem.SlotEndValues.push({ 'time': i + ':00' });
        //    } else {
        //        mainitem.SlotEndValues.push({ 'time': '0' + i + ':00' });
        //    }
        //}

        item.EndTime = "";
    };

    $scope.changeSlotBranch = function (item,mainitem) {
        item.BranchObj = item.BranchObj || "";
        if (item.BranchObj !== "") {
            item.BranchId = item.BranchObj.BranchId;
            item.BranchName = item.BranchObj.BranchName;
            item.UserBranchId = item.BranchObj.UserBranchId;
            $scope.AdminScheduleObj.SelectedHospitalId = item.BranchId;
        }

        angular.forEach(mainitem.UserScheduleDetails, function (bobj) {
            bobj.BranchObj = item.BranchObj;
            bobj.BranchId = item.BranchObj.BranchId;
            bobj.BranchName = item.BranchObj.BranchName;
            bobj.UserBranchId = item.BranchObj.UserBranchId;
           
        });


        $scope.GetVisitReasonNew(item.BranchObj.BranchId);
    };

    $scope.AddSchedule = function () {
        $scope.UserSlotObj = getUserSlotObj();
        $scope.getUserSlotTimesList();
        if ($scope.UserScheduleSlotsArray.length >= 1) {
            $scope.UserSlotObj.Type = 'Date';
        }
        $scope.UserScheduleSlotsArray.push($scope.UserSlotObj);
    }

    $scope.AddScheduleNew = function () {
        $scope.UserSlotObj = getUserSlotObj();
        $scope.getUserSlotTimesList();
        if ($scope.UserScheduleSlotsArray.length >= 1) {
            $scope.UserSlotObj.Type = 'Date';
        }
        $scope.NewUserSlotObj = angular.copy($scope.UserSlotObj);
        $scope.AdminScheduleObj.ShowNewAddSchedule = true;
        $scope.AdminScheduleObj.IsShowEditSchedule = false;
    };

    $scope.CloseNewAddScheduleObj = function () {
        $scope.NewUserSlotObj = getUserSlotObj();
        $scope.AdminScheduleObj.ShowNewAddSchedule = false;
        $scope.AdminScheduleObj.IsShowEditSchedule = false;
    };

    $scope.Copyweekvalues = function (item, mainitem) {
        console.log(item);
        console.log(mainitem);
        if (item.DayId == 1) {
            if (mainitem.UserScheduleDetails.length > 0) {
                angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                    Sitem.StartTime = item.StartTime;
                    Sitem.EndTime = item.EndTime;
                    Sitem.BranchObj = item.BranchObj;
                    Sitem.BranchId = item.BranchId;
                    Sitem.MaximumOverAllSlots = item.MaximumOverAllSlots;
                    Sitem.UserBranchId = item.UserBranchId;
                });
            }
        }
        if (item.DayId == 2) {
            if (mainitem.UserScheduleDetails.length > 0) {
                angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                    if (Sitem.DayId != 1 && Sitem.DayId != 2) {
                        Sitem.StartTime = item.StartTime;
                        Sitem.EndTime = item.EndTime;
                        Sitem.BranchObj = item.BranchObj;
                        Sitem.MaximumOverAllSlots = item.MaximumOverAllSlots;
                        Sitem.BranchId = item.BranchId;
                        Sitem.UserBranchId = item.UserBranchId;
                    }

                });
            }
        }
        if (item.DayId == 3) {
            if (mainitem.UserScheduleDetails.length > 0) {
                angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                    if (Sitem.DayId != 1 && Sitem.DayId != 2 && Sitem.DayId != 3) {
                        Sitem.StartTime = item.StartTime;
                        Sitem.EndTime = item.EndTime;
                        Sitem.BranchObj = item.BranchObj;
                        Sitem.MaximumOverAllSlots = item.MaximumOverAllSlots;
                        Sitem.BranchId = item.BranchId;
                        Sitem.UserBranchId = item.UserBranchId;
                    }

                });
            }
        }
        if (item.DayId == 4) {
            if (mainitem.UserScheduleDetails.length > 0) {
                angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                    if (Sitem.DayId != 1 && Sitem.DayId != 2 && Sitem.DayId != 3 && Sitem.DayId != 4) {
                        Sitem.StartTime = item.StartTime;
                        Sitem.EndTime = item.EndTime;
                        Sitem.BranchObj = item.BranchObj;
                        Sitem.MaximumOverAllSlots = item.MaximumOverAllSlots;
                        Sitem.BranchId = item.BranchId;
                        Sitem.UserBranchId = item.UserBranchId;
                    }

                });
            }
        }
        if (item.DayId == 5) {
            if (mainitem.UserScheduleDetails.length > 0) {
                angular.forEach(mainitem.UserScheduleDetails, function (Sitem) {
                    if (Sitem.DayId == 5 || Sitem.DayId == 6 || Sitem.DayId == 7) {
                        Sitem.StartTime = item.StartTime;
                        Sitem.EndTime = item.EndTime;
                        Sitem.BranchObj = item.BranchObj;
                        Sitem.MaximumOverAllSlots = item.MaximumOverAllSlots;
                        Sitem.BranchId = item.BranchId;
                        Sitem.UserBranchId = item.UserBranchId;
                    }

                });
            }
        }

    }


    $scope.SaveUserCurrentSLot = function (item) {
        item.UserScheduleDetails = item.UserScheduleDetails || [];
        if (item.UserScheduleDetails.length > 0) {
            var list1 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.StartTime !== '' });
            if (list1.length == 0) {
                alertify.error("Please Select Start Time");
                return false;
            }
            var list = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.EndTime !== '' });
            if (list.length == 0) {
                alertify.error("Please Select End Time");
                return false;
            }
            var list2 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.BranchId !== null });
            if (list2.length == 0) {
                alertify.error("Please Select Branch");
                return false;
            }
        }
        $scope.newUserAddReqObj = item;

        if (item.Type == 'Duration') {
            item.ScheduleDuration = item.ScheduleDuration || null;
            item.FromDate = null;
            item.ToDate = null;
            if (item.ScheduleDuration == null) {
                alertify.error("Please Enter Duration");
                return false;
            }
            var currentDate = new Date();
            var oneMonthLater = new Date();
            item.ScheduleDuration = parseInt(item.ScheduleDuration);
            oneMonthLater.setMonth(currentDate.getMonth() + item.ScheduleDuration);
            $scope.UsertempTimeSlotsArray = [];
            for (var d = currentDate; d <= oneMonthLater; d.setDate(d.getDate() + 1)) {
                // datesArray.push(new Date(d));
                var date = new Date(d);
                var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var day = daysOfWeek[date.getDay()];

                $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                var obj = {
                    "Date": $scope.DisplayDate,
                    "Day": day,
                    "StartTime": "",
                    "EndTime": "",

                }
                $scope.UsertempTimeSlotsArray.push(obj);
            }
        }
        if (item.Type == 'Date') {
            item.FromDate = item.FromDate || null;
            item.ToDate = item.ToDate || null;
            if (item.FromDate == null) {
                alertify.error("Please Select From Date");
                return false;
            }
            if (item.ToDate == null) {
                alertify.error("Please Select To Date");
                return false;
            }
            var currentDate = new Date(item.FromDate);
            var ToDateDate = new Date(item.ToDate);
            item.ScheduleDuration = null;
            $scope.UsertempTimeSlotsArray = [];
            for (var d = currentDate; d <= ToDateDate; d.setDate(d.getDate() + 1)) {
                // datesArray.push(new Date(d));
                var date = new Date(d);
                var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var day = daysOfWeek[date.getDay()];

                $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                var obj = {
                    "Date": $scope.DisplayDate,
                    "Day": day,
                    "StartTime": "",
                    "EndTime": "",

                }
                $scope.UsertempTimeSlotsArray.push(obj);
            }
        }

        $scope.TimeSlotsArray = [];
        if ($scope.UsertempTimeSlotsArray.length > 0) {
            angular.forEach($scope.UsertempTimeSlotsArray, function (Aitem) {
                var list1 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.Day == Aitem.Day });

                if (list1.length > 0) {
                    var Breakobj = {
                        "BranchId": list1[0].BranchId,
                        "Date": Aitem.Date || "",
                        "StartTime": list1[0].StartTime,
                        "EndTime": list1[0].EndTime,

                    }
                    $scope.TimeSlotsArray.push(Breakobj);
                }
            });
        }

        var mainBranchId = $scope.AdminScheduleObj.SelectedHospitalId || doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        var params = {
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "BranchId": mainBranchId,
            "TimeSlotsArray": $scope.TimeSlotsArray || [],
        };


        eHnoteMainAdminServices.CheckIsUserSlotAvailNew(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
        function callbackgetuserbranchSuccess(resp) {
            console.log(JSON.stringify(resp));
            if (resp.isUserSlotAvailable) {

                $scope.continuetoSaveUserCurrentSLot($scope.newUserAddReqObj);


            } else {

                //  alertify.error(resp.Message);
                var r = alertify.confirm(
                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20' >  Previous slots will be updated with new information, Do you want to continue? </h4> ",
                    function () {
                        $scope.continuetoSaveUserCurrentSLot($scope.newUserAddReqObj);
                    }, function () {
                        return false;
                    });
            }

        }
        function callbackgetuserbranchError(err) {
            alertify.error("Some Error Occured");
        }

    }

    $scope.continuetoSaveUserCurrentSLot = function (item) {
        item.UserScheduleDetails = item.UserScheduleDetails || [];
        if (item.UserScheduleDetails.length > 0) {
            var list1 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.StartTime !== '' && kitem.EndTime !== '' });
            if (list1.length == 0) {
                alertify.error("Select StartTime and EndTime");
                return false;
            }
            var list2 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.BranchId !== null });
            if (list2.length == 0) {
                alertify.error("Select Branch");
                return false;
            }
        }


        if (item.Type == 'Duration') {
            item.ScheduleDuration = item.ScheduleDuration || null;
            item.FromDate = null;
            item.ToDate = null;
            if (item.ScheduleDuration == null) {
                alertify.error("Please Enter Duration");
                return false;
            }
            //var currentDate = new Date();
            // var oneMonthLater = new Date(currentDate.getFullYear(), currentDate.getMonth() + item.ScheduleDuration, 0);
            var currentDate = new Date();
            var oneMonthLater = new Date();
            item.ScheduleDuration = parseInt(item.ScheduleDuration);
            oneMonthLater.setMonth(currentDate.getMonth() + item.ScheduleDuration);
            item.UserDaySlots = [];
            for (var d = currentDate; d <= oneMonthLater; d.setDate(d.getDate() + 1)) {
                // datesArray.push(new Date(d));
                var date = new Date(d);
                var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var day = daysOfWeek[date.getDay()];

                $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                var obj = {
                    "UserDaySlotId": 0,
                    "BranchId": null,
                    "UserBranchId": null,
                    "DayId": null,
                    "Day": day || '',
                    "SlotDate": $scope.DisplayDate || "",
                    "DeleteInd": "N"
                }
                item.UserDaySlots.push(obj);
            }
        }
        if (item.Type == 'Date') {
            item.FromDate = item.FromDate || null;
            item.ToDate = item.ToDate || null;
            if (item.FromDate == null) {
                alertify.error("Please Select From Date");
                return false;
            }
            if (item.ToDate == null) {
                alertify.error("Please Select To Date");
                return false;
            }
            var currentDate = new Date(item.FromDate);
            var ToDateDate = new Date(item.ToDate);
            item.UserDaySlots = [];
            item.ScheduleDuration = null;
            for (var d = currentDate; d <= ToDateDate; d.setDate(d.getDate() + 1)) {
                // datesArray.push(new Date(d));
                var date = new Date(d);
                var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var day = daysOfWeek[date.getDay()];

                $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                var obj = {
                    "UserDaySlotId": 0,
                    "BranchId": null,
                    "UserBranchId": null,
                    "DayId": null,
                    "Day": day || '',
                    "SlotDate": $scope.DisplayDate || "",
                    "DeleteInd": "N"
                }
                item.UserDaySlots.push(obj);
            }
        }
        if (item.UserDaySlots.length > 0) {
            angular.forEach(item.UserDaySlots, function (Aitem) {

                item.FromDate = item.UserDaySlots[0].SlotDate;
                item.ToDate = item.UserDaySlots[item.UserDaySlots.length - 1].SlotDate;

                var list1 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.Day == Aitem.Day });

                if (list1.length > 0) {
                    // Aitem.UserScheduleId = list1[0].UserScheduleId;
                    Aitem.Day = list1[0].Day;
                    Aitem.DayId = list1[0].DayId;
                    Aitem.UserBranchId = list1[0].UserBranchId;
                    Aitem.BranchId = list1[0].BranchId;

                }
            });
        }

        console.log(item.UserDaySlots);
        console.log(item);
        var mainBranchId = $scope.AdminScheduleObj.SelectedHospitalId || doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        var params = {
            "UserId": doctorinfo.doctorid,
            "DoctorId": $scope.MainUserObj.BasicInfo.UserId,
            "BranchId": mainBranchId,
            "Type": item.Type || "Duration",
            "FromDate": item.FromDate || null,
            "ToDate": item.ToDate || null,
            "ScheduleDate": $filter("date")(new Date(item.ScheduleDate), "yyyy-MM-dd"),
            "ScheduleDuration": item.ScheduleDuration || "",
            "ScheduleDurationType": item.ScheduleDurationType || "",
            "UserScheduleId": item.UserScheduleId || 0,
            "IsDetailedSchedule": item.IsDetailedSchedule || false,
            "DeleteInd": "N",
            "NewAppointmentMaxSlots": item.NewAppointmentMaxSlots || null,
            "ClinicFollowUpAppointmentMaxSlots": item.ClinicFollowUpAppointmentMaxSlots || null,
            "PostOpFollowUpAppointmentMaxSlots": item.PostOpFollowUpAppointmentMaxSlots || null,
            "InvestigationMaxSlots": item.InvestigationMaxSlots || null,
            "ASCAppointmentMaxSlots": item.ASCAppointmentMaxSlots || null,
            "UserScheduleDetails": item.UserScheduleDetails || [],
            //"OnlineSlots": item.OnlineSlots || [],
            //"BreakSlots": item.BreakSlots || [],
            "UserDaySlots": item.UserDaySlots || [],
            "UserDayBreakSlots": item.UserDayBreakSlots || []
        }


        eHnoteMainAdminServices.AddupdateUserSlotSchedule(params, callbackuserbranchSuccess, callbackuserbranchError);
        function callbackuserbranchSuccess(resp) {
            console.log(resp);
            if (resp.status === "Success") {
                alertify.success("Time Slots Added Successfully");
                $scope.GetUserScheduledSlots();
                $scope.AdminScheduleObj.IsShowEditSchedule = false;
                $scope.AdminScheduleObj.ShowNewAddSchedule = false;
            }
        }
        function callbackuserbranchError(err) {
            alertify.error("Some Error Occured");
        }
    }


    $scope.GetUserScheduledSlots = function () {
        var params = {
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        }

        eHnoteMainAdminServices.GetUserScheduledSlots(params, callbackuserSlotSuccess, callbackuserSlotError);
        function callbackuserSlotSuccess(resp) {
            if (resp.status === "Success") {
                $scope.UserScheduleSlotsArray = resp.rows || [];


                $scope.SlotStartValues = [];

                for (var i = 0; i < 24; i++) {

                    var thistime = "";
                    if (i > 12) {
                        var it = i - 12;
                        if (it > 9) {
                            thistime = it + ':00' + ': PM';
                        } else {
                            thistime = '0' + it + ':00' + ': PM';
                        }
                    }
                    else {
                        var it = i;
                        if (it > 9) {
                            if (it >= 12) {
                                thistime = it + ':00' + ': PM';
                            } else {
                                thistime = it + ':00' + ': AM';
                            }

                        } else {
                            thistime = '0' + it + ':00' + ': AM';
                        }
                    }

                    var obj = {
                        "time": "",
                        "newtime": ""
                    }

                    if (i > 9) {
                        obj.time = i + ':00';
                        obj.newtime = thistime;
                    }
                    else {
                        obj.time = '0' + i + ':00';
                        obj.newtime = thistime;
                    }

                    $scope.SlotStartValues.push(obj);
                }

                $scope.SlotEndValues = [];
                for (var i = 0; i < 24; i++) {
                    var thistime = "";
                    if (i > 12) {
                        var it = i - 12;
                        if (it > 9) {
                            thistime = it + ':00' + ': PM';
                        } else {
                            thistime = '0' + it + ':00' + ': PM';
                        }
                    }
                    else {
                        var it = i;
                        if (it > 9) {
                            if (it >= 12) {
                                thistime = it + ':00' + ': PM';
                            } else {
                                thistime = it + ':00' + ': AM';
                            }

                        } else {
                            thistime = '0' + it + ':00' + ': AM';
                        }
                    }

                    var obj = {
                        "time": "",
                        "newtime": ""
                    }

                    if (i > 9) {
                        obj.time = i + ':00';
                        obj.newtime = thistime;
                    }
                    else {
                        obj.time = '0' + i + ':00';
                        obj.newtime = thistime;
                    }
                    /*var thistime = (i > 12) ? (i - 12 + ': PM') : (i + ': AM');*/
                    //var obj = {
                    //    "time": "",
                    //    "newtime": thistime
                    //}

                    //if (i > 9) {
                    //    obj.time = i + ':00';
                    //}
                    //else {
                    //    obj.time = '0' + i + ':00';
                    //}

                    $scope.SlotEndValues.push(obj);
                }
                console.log($scope.SlotStartValues);
                console.log($scope.SlotEndValues);


                if ($scope.UserScheduleSlotsArray.length > 0) {
                    angular.forEach($scope.UserScheduleSlotsArray, function (item) {
                        item.IsAdvancedSlotsActive = false;
                        item.IsAnyAdvancedSchedule = false;
                        item.SlotStartValues = angular.copy($scope.SlotStartValues) || [];
                        item.SlotEndValues = angular.copy($scope.SlotEndValues) || [];
                        item.Type = item.Type || 'Duration';
                        item.FromDate = item.FromDate || "";
                        item.ToDate = item.ToDate || "";
                        //if (item.FromDate != null) {
                        //    item.FromDate = $filter('date')(new Date(item.FromDate), 'MM-dd-yyyy')
                        //}
                        //if (item.ToDate != null) {
                        //    item.ToDate = $filter('date')(new Date(item.ToDate), "MM-dd-yyyy");
                        //}


                        if (item.UserScheduleDetails.length > 0) {
                            angular.forEach(item.UserScheduleDetails, function (Aitem) {
                                var list1 = $filter("filter")($scope.MainUserObj.BasicInfo.UserWorkingBranches, function (kitem, index) { return kitem.BranchId == Aitem.BranchId && kitem.UserBranchId == Aitem.UserBranchId });
                                if (list1.length > 0) {
                                    Aitem.BranchObj = list1[0];
                                }

                                var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                var dateStarttime = currentDt + "T" + Aitem.StartTime;
                                var dateEndtime = currentDt + "T" + Aitem.EndTime;

                                var CurrentStartTime = $filter("date")(new Date(dateStarttime), "h:mm a");
                                var CurrentEndTime = $filter("date")(new Date(dateEndtime), "h:mm a");

                                Aitem.displaystarttime = CurrentStartTime || '';
                                Aitem.displayEndtime = CurrentEndTime || '';
                                Aitem.OnlineSlots = Aitem.OnlineSlots || [];
                                Aitem.BreakSlots = Aitem.BreakSlots || [];

                                if (Aitem.BreakSlots.length > 0) {
                                    angular.forEach(Aitem.BreakSlots, function (Citem) {
                                        var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                        var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                        var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                        var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                        var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                        Citem.displaystarttime = CurrentStartTime || '';
                                        Citem.displayEndtime = CurrentEndTime || '';

                                    });
                                }
                                if (Aitem.OnlineSlots.length > 0) {
                                    angular.forEach(Aitem.OnlineSlots, function (Citem) {
                                        var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                        var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                        var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                        var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                        var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                        Citem.displaystarttime = CurrentStartTime || '';
                                        Citem.displayEndtime = CurrentEndTime || '';

                                    });
                                }

                                //if (Aitem.ScheduleVisitTypeDetails.length > 0) {
                                //    angular.forEach(Aitem.ScheduleVisitTypeDetails, function (Citem) {
                                //        var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                //        var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                //        var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                //        var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                //        var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                //        Citem.displaystarttime = CurrentStartTime || '';
                                //        Citem.displayEndtime = CurrentEndTime || '';

                                //    });
                                //}

                                if (Aitem.SlotsList.length > 0) {
                                    angular.forEach(Aitem.SlotsList, function (Citem) {
                                        var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                        var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                        var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                        var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                        var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                        Citem.displaystarttime = CurrentStartTime || '';
                                        Citem.displayEndtime = CurrentEndTime || '';

                                    });
                                }
                            });

                            // IsAdvancedSchedule is per-day (a day only gets custom slots when it's edited), but the
                            // view picks the advanced/detailed template using only UserScheduleDetails[0] - so a schedule
                            // where only a later day (e.g. Wed) has slots was falling back to the plain template and
                            // hiding the ShowAllDays button for that day entirely.
                            item.IsAnyAdvancedSchedule = _.some(item.UserScheduleDetails, function (d) { return d.IsAdvancedSchedule; });
                        }

                        item.Daylist = "";
                        if (item.UserDaySlots.length > 0) {
                            var uniqlist = _.uniq(item.UserDaySlots, false, function (p) { return p.Day; });
                            var joinList = "";
                            joinList = _.pluck(uniqlist, "Day").join(",");
                            item.Daylist = joinList;
                        }

                        item.ScheduleMonthMultiEveryType = item.ScheduleMonthMultiEveryType || "";
                        item.ScheduleMonthMultiEveryList = [];
                        if (item.ScheduleMonthMultiEveryType != '') {
                            item.ScheduleMonthMultiEveryList = item.ScheduleMonthMultiEveryType.split(',');
                        }

                    })
                } else {
                    $scope.UserScheduleSlotsArray = [];
                }
            }
        }
        function callbackuserSlotError(err) {
            alertify.error("Some Error Occured");
        }
    }

    $scope.DeleteUserScheduledSlots = function (item, index) {
        item.UserScheduleId = item.UserScheduleId || 0;
        if (item.UserScheduleId == 0) {
            $scope.UserScheduleSlotsArray.splice(index, 1);
        } else {
            alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this schedule?</h4> ", function () {
                var params = {
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "DoctorId": item.DoctorId,
                    "BranchId": item.BranchId,
                    "UserScheduleId": item.UserScheduleId,
                    "DeleteInd": "Y",

                }

                eHnoteMainAdminServices.DeleteUserScheduledSlots(params, callbackuserSlotSuccess, callbackuserSlotError);
                function callbackuserSlotSuccess(resp) {
                    if (resp.Status === "Success") {
                        $scope.GetUserScheduledSlots();
                        $scope.AdminScheduleObj.ShowNewAddSchedule = false;
                        $scope.AdminScheduleObj.IsShowEditSchedule = false;
                    }
                }
                function callbackuserSlotError(err) {
                    alertify.error("Some Error Occured");
                }
            }, function () {
            });
        }



    }


    //$scope.AddTimeSlots = function (item) {
    //    var obj = {
    //        "UserScheduleOnlineBreakDetailId": item.ScheduleVisitTypeDetailId,
    //        "UserScheduleId": item.UserScheduleDetailId,
    //        "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
    //        "UserBranchId": null,
    //        "StartTime": item.StartTime,
    //        "EndTime": item.EndTime,
    //        "TypeId": item.VisitTypeId,
    //        "DeleteInd": item.DeleteInd || 'N'
    //    }
    //    $scope.OnlineSlots = [];
    //    $scope.OnlineSlots.push(obj);
    //}
    /* NewSlots End*/

    function getnewHolidayReqObj() {
        var obj = {

        };
        return obj;
    }

    $scope.holidayReqObj = getnewHolidayReqObj();


    function getnewUserrleaveobj() {
        var obj = {
            //"CreatedUserId": $scope.UserId,
            "CreatedUserId": doctorinfo.doctorid,
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "OrganizationId": '',
            "AllBranchIndicator": "N",
            "LeavesList": [],
            "IsLeaveForAllBranches": false,
        }

        return obj;
    }

    $scope.emptyLeaveObj = {
        "UserLeaveId": 0,
        "LeaveRemarks": "",
        "LeaveDate": "",
        "IsApproved": "N",
        "LeaveTypeId": 1,
        "DeleteInd": "N"
    };


    $scope.addLeaveObj = {
        "UserLeaveId": 0,
        "LeaveRemarks": "",
        "LeaveStartDate": "",
        "LeaveEndDate": "",
        "IsApproved": "N",
        "LeaveTypeId": 1,
        "DeleteInd": "N"
    };

    $scope.SelectedLeaveobj = {
        "IsEdit": false,
        "index": null,
        "IsUpdate": false
    };

    $scope.getNewUserLeaveReqObj = getnewUserrleaveobj();

    $scope.showLeaveSTartDatePicker = function () {
        $('#leaveStartDate').datepicker('show');
    };

    $scope.showLeaveEndDatePicker = function () {
        $('#leaveEndDate').datepicker('show');
    };


    function getExactDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);
        var NoOfdays = stopDate.diff(currentDate, 'days');


        /*        console.log(currentDate + "currentDate_" + stopDate + "_stopDate_" + NoOfdays);*/

        var diffDays = parseInt(NoOfdays);
        var newstopDate = moment(stopDate);

        //console.log(diffDays);
        //console.log(newstopDate);

        while (currentDate <= newstopDate) {
            var obj = {
                "FullDate": $filter('date')(new Date(currentDate), 'MM-dd-yyyy'),
                "Date": $filter('date')(new Date(currentDate), 'd'),
                "Day": $filter('date')(new Date(currentDate), 'EEE'),
                "Month": $filter('date')(new Date(currentDate), 'M')
            }
            dateArray.push(obj)
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }
    $scope.addMoreLeaveRequests = function () {

        if ($scope.addLeaveObj.LeaveStartDate == "") {
            alertify.error("Please Select Start Date");
            return false;

        }
        if ($scope.addLeaveObj.LeaveRemarks == "") {
            alertify.error("Please Enter Leave Remarks");
            return false;
        }
        var multipleDates = [];

        var stDate = $filter('date')(new Date($scope.addLeaveObj.LeaveStartDate), "yyyy-MM-dd");
        var etDate = $filter('date')(new Date($scope.addLeaveObj.LeaveEndDate), "yyyy-MM-dd");

        //const range = moment.range(stDate, etDate);
        //console.log(range)


        multipleDates = getExactDates(stDate, etDate);
        // multipleDates = enumerateDaysBetweenDates($scope.addLeaveObj.LeaveStartDate, $scope.addLeaveObj.LeaveEndDate);
        /*        console.log(multipleDates);*/




        angular.forEach(multipleDates, function (ditem) {
            ditem.FullDate = $filter('date')(new Date(ditem.FullDate), "yyyy-MM-dd");
            var existingDate = $scope.getNewUserLeaveReqObj.LeavesList.find(function (item) {
                return item.LeaveDate === ditem.FullDate;
            });
            if (!existingDate) {
                var reobj = {
                    "UserLeaveId": 0,
                    "LeaveRemarks": $scope.addLeaveObj.LeaveRemarks,
                    "LeaveDate": ditem.FullDate,
                    "IsApproved": "N",
                    "LeaveTypeId": 1,
                    "DeleteInd": "N"
                };

                $scope.getNewUserLeaveReqObj.UserId = $scope.MainUserObj.BasicInfo.UserId;

                $scope.getNewUserLeaveReqObj.LeavesList.push(reobj);
            }
        });

        $scope.addLeaveObj.UserLeaveId = 0;
        $scope.addLeaveObj.LeaveRemarks = "";
        $scope.addLeaveObj.LeaveStartDate = "";
        $scope.addLeaveObj.LeaveEndDate = "";
        $scope.addLeaveObj.IsApproved = "N";
        $scope.addLeaveObj.DeleteInd = "N";
        $scope.addLeaveObj.LeaveTypeId = 1;
        $scope.SelectedLeaveobj.IsEdit = false;
        $scope.SelectedLeaveobj.IsUpdate = false;
    }


    $scope.changeLStartDate = function (obj) {
        $scope.addLeaveObj.LeaveEndDate = obj.LeaveStartDate;
    }
    $scope.saveUserLeaveList = function () {
        var locationIds = $scope.UserWorkingBranchArrays.filter(pitem => pitem.IsChecked && pitem.BranchId !== 0).map(pitem => pitem.BranchId).join(",");
        console.log(locationIds);
        $scope.getNewUserLeaveReqObj.OrganizationId = angular.copy(locationIds)||"";
        //if ($scope.UserWorkingBranchArrays.length > 0 && !$scope.getNewUserLeaveReqObj.IsLeaveForAllBranches) {
        //    $scope.getNewUserLeaveReqObj.OrganizationId = $scope.getNewUserLeaveReqObj.OrganizationId || 0;
        //    if ($scope.getNewUserLeaveReqObj.OrganizationId == 0 ) {
        //        alertify.error("Please Select Location");
        //        return false;
        //    }
        //}
        $scope.getNewUserLeaveReqObj.OrganizationId = $scope.getNewUserLeaveReqObj.OrganizationId||"";
        if ($scope.getNewUserLeaveReqObj.OrganizationId == "") {
            alertify.error("Please Select Branch");
            return false;
        }
        if ($scope.addLeaveObj.LeaveStartDate == "") {
            alertify.error("Please Select Start Date");
            return false;
        }
        if ($scope.addLeaveObj.LeaveRemarks == "") {
            alertify.error("Please Enter Leave Remarks");
            return false;
        }
        var multipleDates = [];

        var stDate = $filter('date')(new Date($scope.addLeaveObj.LeaveStartDate), "yyyy-MM-dd");
        var etDate = $filter('date')(new Date($scope.addLeaveObj.LeaveEndDate), "yyyy-MM-dd");

        multipleDates = getExactDates(stDate, etDate);

        angular.forEach(multipleDates, function (ditem) {
            ditem.FullDate = $filter('date')(new Date(ditem.FullDate), "yyyy-MM-dd");
            var existingDate = $scope.getNewUserLeaveReqObj.LeavesList.find(function (item) {
                return item.LeaveDate === ditem.FullDate;
            });
            if (!existingDate) {
                var reobj = {
                    "UserLeaveId": $scope.addLeaveObj.UserLeaveId || 0,
                    "LeaveRemarks": $scope.addLeaveObj.LeaveRemarks,
                    "LeaveDate": ditem.FullDate,
                    "IsApproved": "N",
                    "LeaveTypeId": 1,
                    "DeleteInd": "N"
                };

                $scope.getNewUserLeaveReqObj.UserId = $scope.MainUserObj.BasicInfo.UserId;
              
                $scope.getNewUserLeaveReqObj.LeavesList.push(reobj);
            }
        });

       
        

        $scope.getNewUserLeaveReqObj.LeavesList = $scope.getNewUserLeaveReqObj.LeavesList || [];
        if ($scope.getNewUserLeaveReqObj.LeavesList.length == 0) {
            if ($scope.addLeaveObj.LeaveStartDate == "") {
                alertify.error("Please Select Start Date");
                return false;
            }
            if ($scope.addLeaveObj.LeaveRemarks == "") {
                alertify.error("Please Enter Leave Remarks");
                return false;
            }
            var obj = {
                "UserLeaveId": $scope.addLeaveObj.UserLeaveId || 0,
                "LeaveRemarks": $scope.addLeaveObj.LeaveRemarks,
                "LeaveDate": $scope.addLeaveObj.LeaveStartDate,
                "IsApproved": "N",
                "LeaveTypeId": 1,
                "DeleteInd": "N"
            };
            $scope.getNewUserLeaveReqObj.UserId = $scope.MainUserObj.BasicInfo.UserId;
            $scope.getNewUserLeaveReqObj.LeavesList.push(obj);
        }
        console.log($scope.getNewUserLeaveReqObj);

        eHnoteMainAdminServices.AddUpdateUserLeaves($scope.getNewUserLeaveReqObj).then(function (resp) {
            console.log(resp);

            if (resp.data.Status == "Failure") {
                alertify.error("Leave on this date already exists for the user");
                $scope.getNewUserLeaveReqObj.LeavesList = [];
                //$scope.addLeaveObj.LeaveRemarks = "";
                //$scope.addLeaveObj.LeaveStartDate = "";
                return false;
            }
            if (resp.data.Status == "Success") {
                alertify.success("Leave Added Successfully");
                $scope.addLeaveObj.UserLeaveId = 0;
                $scope.addLeaveObj.LeaveRemarks = "";
                $scope.addLeaveObj.LeaveStartDate = "";
                $scope.addLeaveObj.LeaveEndDate = "";
                $scope.addLeaveObj.IsApproved = "N";
                $scope.addLeaveObj.DeleteInd = "N";
                $scope.addLeaveObj.LeaveTypeId = 1;
                $scope.getNewUserLeaveReqObj.OrganizationId = 0;
                $scope.getNewUserLeaveReqObj.IsLeaveForAllBranches = false;
                $scope.SelectedLeaveobj.IsEdit = false;
                $scope.SelectedLeaveobj.IsUpdate = false;
                /* HolidaysParams.EnableUpdate = false;*/
                angular.forEach($scope.UserWorkingBranchArrays, function (mitem) {
                    mitem.IsChecked = true;
                });

                $scope.LocationTypeObj.SelectLocationString = "All Locations";

                $scope.getUserLeavesList();
                $scope.getNewUserLeaveReqObj.LeavesList = [];
            }
            $scope.SelectedLeaveobj.IsEdit = false;
        }, function (err) {
            alertify.success("Updating Failed");
        });
    };

    //$scope.saveUserLeaveList = function () {

    //    $scope.getNewUserLeaveReqObj.LeavesList = $scope.getNewUserLeaveReqObj.LeavesList || [];
    //    if ($scope.getNewUserLeaveReqObj.LeavesList.length == 0) {
    //        if ($scope.addLeaveObj.LeaveStartDate == "") {
    //            alertify.error("Please Select Start Date");
    //            return false;
    //        }
    //        if ($scope.addLeaveObj.LeaveRemarks == "") {
    //            alertify.error("Please Enter Leave Remarks");
    //            return false;
    //        }
    //        var obj = {
    //            "UserLeaveId": $scope.addLeaveObj.UserLeaveId || 0,
    //            "LeaveRemarks": $scope.addLeaveObj.LeaveRemarks,
    //            "LeaveDate": $scope.addLeaveObj.LeaveStartDate,
    //            "IsApproved": "N",
    //            "LeaveTypeId": 1,
    //            "DeleteInd": "N"
    //        };
    //        $scope.getNewUserLeaveReqObj.UserId = $scope.MainUserObj.BasicInfo.UserId;
    //        $scope.getNewUserLeaveReqObj.LeavesList.push(obj);
    //    }
    //    console.log($scope.getNewUserLeaveReqObj);

    //    eHnoteMainAdminServices.AddUpdateUserLeaves($scope.getNewUserLeaveReqObj).then(function (resp) {
    //        console.log(resp);

    //        if (resp.data.Status == "Failure") {
    //            alertify.error("Leave on this date already exists for the user");
    //            $scope.getNewUserLeaveReqObj.LeavesList = [];
    //            $scope.addLeaveObj.LeaveRemarks = "";
    //            $scope.addLeaveObj.LeaveStartDate = "";
    //            return false;
    //        }
    //        if (resp.data.Status == "Success") {
    //            alertify.success("Leave Added Successfully");


    //            $scope.getUserLeavesList();
    //            $scope.getNewUserLeaveReqObj.LeavesList = [];
    //        }
    //        $scope.SelectedLeaveobj.IsEdit = false;
    //    }, function (err) {
    //        alertify.success("Updating Failed");
    //    });

    //};


    function getnewLeaveObj() {
        var obj = {
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "CalendarYear": null, // new Date().getFullYear(),
            "BranchId": 0,
            "AllBranchIndicator": "N",
            "GetAllIndicator": 0,

        };

        return obj;
    }

    $scope.getUserLeavereqObj = getnewLeaveObj();
    $scope.distinctYears = [];

    $scope.getUserLeavesList = function () {
        $scope.getUserLeavereqObj.BranchId = $scope.getUserLeavereqObj.BranchId || 0;
        $scope.getUserLeavereqObj.UserId = $scope.MainUserObj.BasicInfo.UserId;
        console.log($scope.getUserLeavereqObj);


        eHnoteMainAdminServices.GetUserLeavesListByYear($scope.getUserLeavereqObj).then(function (resp) {
            console.log(resp);

            $scope.UserLeavesArrayList = [];
            $scope.distinctYears = [];
            if (resp.data.status == "Success") {

                $scope.UserLeavesArrayList = resp.data.rows;



                if ($scope.UserLeavesArrayList.length > 0) {
                    angular.forEach($scope.UserLeavesArrayList, function (item) {
                        item.LeaveDate = $filter("date")(item.LeaveDate, "MM-dd-yyyy");
                        item.LeaveYear = new Date(item.LeaveDate).getFullYear();

                    });
                }

                $scope.filterLeavesMain($scope.selectedYear, $scope.Search.IsExpired);
                $scope.getNewUserLeaveReqObj.LeavesList = [];
                $scope.addLeaveObj.LeaveStartDate = "";
                $scope.addLeaveObj.LeaveEndDate = "";
                $scope.addLeaveObj.LeaveRemarks = "";



                angular.forEach($scope.UserLeavesArrayList, function (item) {
                    var year = new Date(item.LeaveDate).getFullYear();
                    if ($scope.distinctYears.indexOf(year) === -1) {

                        $scope.distinctYears.push(year);
                    }
                });
            }


        }, function (err) {
            alertify.success("Updating Failed");
        });
    }

    $scope.editLeave = function (item, index) {
        $scope.addLeaveObj.UserLeaveId = item.UserLeaveId;
        $scope.addLeaveObj.LeaveRemarks = item.LeaveRemarks || "";
        $scope.addLeaveObj.LeaveStartDate = item.LeaveDate || "";
        $scope.addLeaveObj.LeaveEndDate = item.LeaveDate || "";
        $scope.addLeaveObj.IsApproved = item.IsApproved || "N";
        $scope.addLeaveObj.DeleteInd = item.DeleteInd || "N";
        $scope.addLeaveObj.LeaveTypeId = item.LeaveTypeId || 1;
        $scope.getNewUserLeaveReqObj.OrganizationId = item.BranchId || 0;
        $scope.index = index;
        $scope.SelectedLeaveobj.index = index;
        $scope.SelectedLeaveobj.IsEdit = true;
        $scope.SelectedLeaveobj.IsUpdate = true;
        angular.forEach($scope.UserWorkingBranchArrays, function (mitem) {
                mitem.IsChecked = false;
            
        });
        angular.forEach($scope.UserWorkingBranchArrays, function (mitem) {
            if (mitem.BranchId == item.BranchId) {
                mitem.IsChecked = true;
            }
        });

        $scope.LocationTypeObj.SelectLocationString = item.BranchName||"Selected";
    };
    $scope.deleteLeave = function (item, index) {
        var index = $scope.getNewUserLeaveReqObj.LeavesList.indexOf(item);
        if (item.UserLeaveId === 0) {
            if (index > -1) {
                $scope.getNewUserLeaveReqObj.LeavesList.splice(index, 1);
            }
        } else {
            $scope.getNewUserLeaveReqObj.LeavesList[index].DeleteInd = "Y";
        }
        $scope.SelectedLeaveobj.IsEdit = false;
        $scope.SelectedLeaveobj.IsUpdate = false;
    };

    $scope.DeleteUserLeave = function (item) {
        item = item || "";
        item.DeleteInd = "Y";
        item.LeaveDate = $filter("date")(new Date(item.LeaveDate), "yyyy-MM-dd");
        $scope.getNewUserLeaveReqObj.OrganizationId = item.BranchId;
        var obj = {
            "UserLeaveId": item.UserLeaveId || 0,
            "LeaveRemarks": item.LeaveRemarks,
            "LeaveDate": item.LeaveDate,
            "IsApproved": "N",
            "LeaveTypeId": 1,
            "DeleteInd": "Y"
        };
        $scope.getNewUserLeaveReqObj.UserId = $scope.MainUserObj.BasicInfo.UserId;
        $scope.getNewUserLeaveReqObj.LeavesList.push(obj);
        eHnoteMainAdminServices.AddUpdateUserLeaves($scope.getNewUserLeaveReqObj).then(function (resp) {
            console.log(resp);
            alertify.success("Deleted Successfully");

            $scope.getUserLeavesList();
        }, function (err) {
            alertify.success("Deleting Failed");
        });
    }

    $scope.cancelUserLeaveList = function () {
        $scope.getNewUserLeaveReqObj.LeavesList = [];
        $scope.addLeaveObj.LeaveStartDate = "";
        $scope.addLeaveObj.LeaveEndDate = "";
        $scope.addLeaveObj.LeaveRemarks = "";
        $scope.SelectedLeaveobj.IsEdit = false;
        $scope.getNewUserLeaveReqObj.OrganizationId = 0;

        angular.forEach($scope.UserWorkingBranchArrays, function (mitem) {
            mitem.IsChecked = true;

        });
        $scope.LocationTypeObj.SelectLocationString = "All Locations";

    }

    $scope.ShowEditSchedule = function (ind) {
        $scope.AdminScheduleObj.IsShowEditSchedule = true;
        $scope.AdminScheduleObj.ShowNewAddSchedule = false;
        $scope.AdminScheduleObj.SelectedScheduleIndex = ind;
        let tempArray = [];
        $scope.AdminScheduleObj.SelectedSchedule = angular.copy($scope.UserScheduleSlotsArray[ind]);
        angular.forEach($scope.AdminScheduleObj.SelectedSchedule.UserScheduleDetails, function (hitem) {
            tempArray = $filter('filter')($scope.MainUserObj.BasicInfo.UserWorkingBranches, { 'BranchId': hitem.BranchId }, true);
            if (tempArray.length > 0) {
                hitem.BranchObj = tempArray[0];
            }
        });
    };

    $scope.viewadschedule = function () {


        $scope.newUserBasicInfoObj.AverageConsultationTime = parseFloat($scope.newUserBasicInfoObj.AverageConsultationTime) || 0;
        if ($scope.newUserBasicInfoObj.AverageConsultationTime === 0) {
            alertify.error("please add Average consultation time in user profile to continue.");
            return false;
        }
        $scope.NewUserScheduleSlotsArray = [];
        $scope.UserSlotObj = getUserSlotObj();
        $scope.getUserSlotTimesList();
        //if ($scope.UserScheduleSlotsArray.length >= 1) {
        //    $scope.UserSlotObj.Type = 'Date';
        //}
        $scope.NewUserScheduleSlotsArray.push($scope.UserSlotObj);

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/add-schedule-popup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            //"size": "lg",
            "windowClass": " modal__ninetynine--",
            // "windowClass": "newassessmentspopupuib",
            "controller": function ($scope, $uibModal, $uibModalInstance, NewUserScheduleSlotsArray) {

                $scope.newUserBasicInfoObj.AvgConsultationTime = "";

                if ($scope.newUserBasicInfoObj.AverageConsultationTime != 0) {
                    $scope.newUserBasicInfoObj.AvgConsultationTime = $scope.newUserBasicInfoObj.AverageConsultationTime.toString() || "";
                }
              
                var MaintainAvgConsultationTime = parseFloat($scope.newUserBasicInfoObj.AverageConsultationTime) || 0;

                $scope.closeuib = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                function getAllWeekDates() {

                    var array = [];
                    console.log($scope.NewUserScheduleSlotsArray[0].ScheduleDate);
                    /*    var actualSelectedDt = $filter('date')(new Date($scope.NewUserScheduleSlotsArray[0].ScheduleDate), "yyyy-MM-dd");*/
                    var actualSelectedDt = $filter('date')($scope.NewUserScheduleSlotsArray[0].ScheduleDate, "yyyy-MM-dd");

                    //$scope.currentDate = new Date($filter('date')(new Date($scope.NewUserScheduleSlotsArray[0].ScheduleDate), "yyyy-MM-dd"));
                    $scope.currentDate = new Date($filter('date')($scope.NewUserScheduleSlotsArray[0].ScheduleDate, "yyyy-MM-dd") + ' ' + "00:00:00");    // when today date 1st its go for the pervious date
                    // $scope.currentDate = $filter('date')($scope.NewUserScheduleSlotsArray[0].ScheduleDate, "yyyy-MM-dd");


                    console.log($scope.currentDate);
                    var monthCount = parseInt($scope.NewUserScheduleSlotsArray[0].ScheduleDuration) || 0;


                    for (var i = 0; i < monthCount; i++) {
                        var monthStartDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() + i, 1);

                        var numDaysInMonth = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1, 0).getDate();

                        for (var j = 0; j < numDaysInMonth; j++) {
                            var date = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth(), j + 1);
                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];
                            console.log(date);
                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");
                            var weekno = getWeekOfMonth(date);

                            var result = comparetwodates(actualSelectedDt, $scope.DisplayDate);
                            console.log(result);

                            if (!result) {
                                var obj = {
                                    "Date": $scope.DisplayDate,
                                    "Day": day,
                                    "WeekNumber": weekno,
                                    "StartTime": "",
                                    "EndTime": "",
                                }
                                array.push(obj);
                            }

                        }
                    }

                    return array;

                }

                function getWeekOfMonth(date) {
                    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                    const dayOfWeek = firstDayOfMonth.getDay();
                    const dayOfMonth = date.getDate() + dayOfWeek;
                    return Math.ceil(dayOfMonth / 7);
                }

                function comparetwodates(dt1, dt2) {
                    let date1 = new Date(dt1); // December 31, 2022
                    let date2 = new Date(dt2); // January 1, 2022

                    var result = false;
                    // compare the two dates
                    if (date1.getTime() > date2.getTime()) {
                        result = true;
                    } else if (date1.getTime() < date2.getTime()) {
                        result = false;
                    } else {
                        result = false;
                    }
                    return result;
                }

                function getFirstWeekDates() {

                    var array = [];
                    $scope.currentDate = new Date();
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;

                    for (var i = 0; i < monthCount; i++) {

                        $scope.currentDate.setDate(1);


                        $scope.currentDate.setMonth($scope.currentDate.getMonth() + i);
                        var firstDayOfWeek = $scope.currentDate.getDay();
                        var firstDayOfFirstWeek = new Date($scope.currentDate.getTime() - firstDayOfWeek * 24 * 60 * 60 * 1000);

                        for (var j = 0; j < 7; j++) {
                            var date = new Date(firstDayOfFirstWeek.getTime() + j * 24 * 60 * 60 * 1000);

                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                            var obj = {
                                "Date": $scope.DisplayDate,
                                "Day": day,
                                "StartTime": "",
                                "EndTime": "",
                            }
                            array.push(obj);

                        }
                    }

                    return array;
                }

                function getSecondWeekDates() {
                    $scope.currentDate = new Date();
                    var Array = [];
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;
                    for (var i = 0; i < monthCount; i++) {

                        $scope.currentDate.setDate(1);

                        $scope.currentDate.setMonth($scope.currentDate.getMonth() + i);

                        var firstDayOfWeek = $scope.currentDate.getDay();
                        //var secondWeekStartDate = new Date($scope.currentDate.getTime() + (7 - firstDayOfWeek + 7) * 24 * 60 * 60 * 1000);
                        var secondWeekStartDate = new Date($scope.currentDate.getTime() + (7 - firstDayOfWeek) * 24 * 60 * 60 * 1000);



                        for (var j = 0; j < 7; j++) {
                            var date = new Date(secondWeekStartDate.getTime() + j * 24 * 60 * 60 * 1000);


                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                            var obj = {
                                "Date": $scope.DisplayDate,
                                "Day": day,
                                "StartTime": "",
                                "EndTime": "",
                            }
                            Array.push(obj);

                        }
                    }

                    return Array;
                }

                function getThirdWeekDates() {
                    var array = [];
                    $scope.currentDate = new Date();
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;
                    for (var i = 0; i < monthCount; i++) {

                        $scope.currentDate.setDate(1);

                        $scope.currentDate.setMonth($scope.currentDate.getMonth() + i);

                        var firstDayOfWeek = $scope.currentDate.getDay();

                        /*   var thirdWeekStartDate = new Date($scope.currentDate.getTime() + (14 - firstDayOfWeek + 7) * 24 * 60 * 60 * 1000);*/

                        var thirdWeekStartDate = new Date($scope.currentDate.getTime() + (14 - firstDayOfWeek) * 24 * 60 * 60 * 1000);


                        for (var j = 0; j < 7; j++) {
                            var date = new Date(thirdWeekStartDate.getTime() + j * 24 * 60 * 60 * 1000);


                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                            var obj = {
                                "Date": $scope.DisplayDate,
                                "Day": day,
                                "StartTime": "",
                                "EndTime": "",
                            }
                            array.push(obj);


                        }


                    }

                    return array;
                }

                function getForthWeekDates() {
                    var Array = [];
                    $scope.currentDate = new Date();
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;
                    for (var i = 0; i < monthCount; i++) {
                        $scope.currentDate.setDate(1);
                        $scope.currentDate.setMonth($scope.currentDate.getMonth() + i);
                        var firstDayOfWeek = $scope.currentDate.getDay();

                        /*   var fourthWeekStartDate = new Date($scope.currentDate.getTime() + (21 - firstDayOfWeek + 7) * 24 * 60 * 60 * 1000);*/

                        var fourthWeekStartDate = new Date($scope.currentDate.getTime() + (21 - firstDayOfWeek) * 24 * 60 * 60 * 1000);


                        for (var j = 0; j < 7; j++) {
                            var date = new Date(fourthWeekStartDate.getTime() + j * 24 * 60 * 60 * 1000);


                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                            var obj = {
                                "Date": $scope.DisplayDate,
                                "Day": day,
                                "StartTime": "",
                                "EndTime": "",
                            }
                            Array.push(obj);

                        }
                    }

                    return Array;
                }

                function getFifthWeekDates() {

                    var Array = [];
                    $scope.currentDate = new Date();
                    var monthCount = parseInt($scope.UserDetailedSlotObj.ScheduleDuration) || 0;


                    for (var i = 0; i < monthCount; i++) {

                        var monthStartDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() + i, 1);

                        var firstDayOfWeek = monthStartDate.getDay();



                        var fifthWeekStartDate = new Date(monthStartDate.getTime() + (29 - firstDayOfWeek) * 24 * 60 * 60 * 1000);

                        if (fifthWeekStartDate.getMonth() === monthStartDate.getMonth()) {

                            for (var j = 0; j < 7; j++) {
                                var date = new Date(fifthWeekStartDate.getTime() + j * 24 * 60 * 60 * 1000);

                                var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                var day = daysOfWeek[date.getDay()];

                                $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");

                                var obj = {
                                    "Date": $scope.DisplayDate,
                                    "Day": day,
                                    "StartTime": "",
                                    "EndTime": "",
                                }
                                Array.push(obj);

                            }
                        }
                    }
                    return Array;
                }

                $scope.getTimeSlotsByEveryType = function (typeid) {
                    console.log(typeid);
                    typeid = parseFloat(typeid) || 0;

                    $scope.ScheduledDateArray = [];

                    $scope.currentDate = new Date();

                    if (typeid === 1) {
                        $scope.ScheduledDateArray = getAllWeekDates();
                    }
                    if (typeid === 2) {

                        $scope.ScheduledDateArray = [];
                        var array = getAllWeekDates();

                        console.log(array);
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 2 || sditem.WeekNumber === 4) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }

                    }

                    if (typeid === 3) {
                        $scope.ScheduledDateArray = [];
                        var array = getAllWeekDates();
                        console.log(array);
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 1 || sditem.WeekNumber === 3 || sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }

                    if (typeid === 4) {
                        $scope.ScheduledDateArray = [];



                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 1) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }

                    if (typeid === 5) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 2) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    if (typeid === 6) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 3) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }

                    if (typeid === 7) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 4) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }


                    if (typeid === 8) {
                        $scope.ScheduledDateArray = [];

                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }

                    if (typeid === 9) {
                        $scope.ScheduledDateArray = [];

                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });

                            if ($scope.ScheduledDateArray.length === 0) {
                                angular.forEach(array, function (sditem) {
                                    if (sditem.WeekNumber === 4) {
                                        $scope.ScheduledDateArray.push(sditem);
                                    }
                                });
                            }
                        }
                    }
                    console.log($scope.ScheduledDateArray);

                    $scope.filteredArray = $filter('orderBy')($scope.ScheduledDateArray, 'Date', false)
                    console.log($scope.filteredArray);

                }

                $scope.OnChangeslot = function (val) {
                    $scope.getTimeSlotsByEveryType(val);
                }

                $scope.changeType = function (type) {
                    console.log(type);

                };

                $scope.NewUserScheduleSlotsArray = angular.copy(NewUserScheduleSlotsArray);

                $scope.clearDayData = function (obj) {
                    obj.StartTime = "";
                    obj.EndTime = "";
                    obj.BranchObj = "";
                    obj.MaximumOverAllSlots = "";
                    obj.BranchId = null;
                    obj.UserBranchId = null;
                };

                $scope.continuetoSaveUserCurrentSLotNew = function (item) {
                    item.UserScheduleDetails = item.UserScheduleDetails || [];

                    console.log($scope.ScheduledDateArray);
                    if (item.UserScheduleDetails.length > 0) {
                        var list1 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.StartTime !== '' && kitem.EndTime !== '' });
                        if (list1.length == 0) {
                            alertify.error("Select StartTime and EndTime");
                            return false;
                        }
                        var list2 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.BranchId !== null });
                        if (list2.length == 0) {
                            alertify.error("Select Branch");
                            return false;
                        }
                    }


                    //if (item.Type == 'Duration') {
                    //    item.ScheduleDuration = item.ScheduleDuration || null;
                    //    item.FromDate = null;
                    //    item.ToDate = null;
                    //    if (item.ScheduleDuration == null) {
                    //        alertify.error("Please Enter Duration");
                    //        return false;
                    //    }

                    //    item.UserDaySlots = [];
                    //    if ($scope.ScheduledDateArray.length > 0) {
                    //        angular.forEach($scope.ScheduledDateArray, function (Aitem) {
                    //            var obj = {
                    //                "UserDaySlotId": 0,
                    //                "BranchId": null,
                    //                "UserBranchId": null,
                    //                "DayId": null,
                    //                "Day": Aitem.Day || '',
                    //                "SlotDate": Aitem.Date || "",
                    //                "DeleteInd": "N"
                    //            }
                    //            item.UserDaySlots.push(obj);

                    //        })

                    //    }


                    //    //var currentDate = new Date();
                    //    // var oneMonthLater = new Date(currentDate.getFullYear(), currentDate.getMonth() + item.ScheduleDuration, 0);
                    //    //var currentDate = new Date();
                    //    //var oneMonthLater = new Date();
                    //    //item.ScheduleDuration = parseInt(item.ScheduleDuration);
                    //    //oneMonthLater.setMonth(currentDate.getMonth() + item.ScheduleDuration);
                    //    //item.UserDaySlots = [];
                    //    //for (var d = currentDate; d <= oneMonthLater; d.setDate(d.getDate() + 1)) {
                    //    //    // datesArray.push(new Date(d));
                    //    //    var date = new Date(d);
                    //    //    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    //    //    var day = daysOfWeek[date.getDay()];

                    //    //    $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                    //    //    var obj = {
                    //    //        "UserDaySlotId": 0,
                    //    //        "BranchId": null,
                    //    //        "UserBranchId": null,
                    //    //        "DayId": null,
                    //    //        "Day": day || '',
                    //    //        "SlotDate": $scope.DisplayDate || "",
                    //    //        "DeleteInd": "N"
                    //    //    }
                    //    //    item.UserDaySlots.push(obj);
                    //    //}
                    //}
                    //if (item.Type == 'Date') {
                    //    item.FromDate = item.FromDate || null;
                    //    item.ToDate = item.ToDate || null;
                    //    if (item.FromDate == null) {
                    //        alertify.error("Please Select From Date");
                    //        return false;
                    //    }
                    //    if (item.ToDate == null) {
                    //        alertify.error("Please Select To Date");
                    //        return false;
                    //    }
                    //    var currentDate = new Date(item.FromDate);
                    //    var ToDateDate = new Date(item.ToDate);
                    //    item.UserDaySlots = [];
                    //    item.ScheduleDuration = null;
                    //    for (var d = currentDate; d <= ToDateDate; d.setDate(d.getDate() + 1)) {
                    //        // datesArray.push(new Date(d));
                    //        var date = new Date(d);
                    //        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    //        var day = daysOfWeek[date.getDay()];

                    //        $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                    //        var obj = {
                    //            "UserDaySlotId": 0,
                    //            "BranchId": null,
                    //            "UserBranchId": null,
                    //            "DayId": null,
                    //            "Day": day || '',
                    //            "SlotDate": $scope.DisplayDate || "",
                    //            "DeleteInd": "N"
                    //        }
                    //        item.UserDaySlots.push(obj);
                    //    }
                    //}
                    //if (item.UserDaySlots.length > 0) {
                    //    angular.forEach(item.UserDaySlots, function (Aitem) {

                    //        item.FromDate = item.UserDaySlots[0].SlotDate;
                    //        item.ToDate = item.UserDaySlots[item.UserDaySlots.length - 1].SlotDate;

                    //        var list1 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.Day == Aitem.Day });

                    //        if (list1.length > 0) {
                    //            // Aitem.UserScheduleId = list1[0].UserScheduleId;
                    //            Aitem.Day = list1[0].Day;
                    //            Aitem.DayId = list1[0].DayId;
                    //            Aitem.UserBranchId = list1[0].UserBranchId;
                    //            Aitem.BranchId = list1[0].BranchId;

                    //        }
                    //    });
                    //}

                    var params = {
                        "UserId": doctorinfo.doctorid,
                        "DoctorId": $scope.MainUserObj.BasicInfo.UserId,
                        "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "Type": item.Type || "Duration",
                        "FromDate": item.FromDate || null,
                        "ToDate": item.ToDate || null,
                        "ScheduleDate": $filter("date")(new Date(item.ScheduleDate), "yyyy-MM-dd"),
                        "ScheduleDuration": item.ScheduleDuration || "",
                        "ScheduleDurationType": item.ScheduleDurationType || "",
                        "UserScheduleId": item.UserScheduleId || 0,
                        "IsDetailedSchedule": item.IsDetailedSchedule || false,
                        "DeleteInd": "N",
                        "NewAppointmentMaxSlots": item.NewAppointmentMaxSlots || null,
                        "ClinicFollowUpAppointmentMaxSlots": item.ClinicFollowUpAppointmentMaxSlots || null,
                        "PostOpFollowUpAppointmentMaxSlots": item.PostOpFollowUpAppointmentMaxSlots || null,
                        "InvestigationMaxSlots": item.InvestigationMaxSlots || null,
                        "ASCAppointmentMaxSlots": item.ASCAppointmentMaxSlots || null,
                        "UserScheduleDetails": item.UserScheduleDetails || [],
                        //"OnlineSlots": item.OnlineSlots || [],
                        //"BreakSlots": item.BreakSlots || [],
                        "UserDaySlots": item.UserDaySlots || [],
                        "UserDayBreakSlots": item.UserDayBreakSlots || [],
                        "ScheduleEveryType": item.ScheduleEveryType,
                        "UserScheduleName": item.UserScheduleName,
                        "AverageConsultationTime": $scope.newUserBasicInfoObj.AvgConsultationTime
                    }


                    eHnoteMainAdminServices.AddupdateUserSlotSchedule(params, callbackuserbranchSuccess, callbackuserbranchError);
                    function callbackuserbranchSuccess(resp) {
                        console.log(resp);
                        if (resp.status === "Success") {
                            alertify.success("Time Slots Added Successfully");
                            $scope.GetUserScheduledSlots();
                            $scope.AdminScheduleObj.IsShowEditSchedule = false;
                            $scope.AdminScheduleObj.ShowNewAddSchedule = false;
                            $scope.closeuib();
                        }
                    }
                    function callbackuserbranchError(err) {
                        alertify.error("Some Error Occured");
                    }
                }

                $scope.SaveUserCurrentSLotNew = function (item) {
                    item.UserScheduleDetails = item.UserScheduleDetails || [];
                    item.UserScheduleDetails = $filter("filter")(item.UserScheduleDetails, function (kitem) { return kitem.StartTime !== '' || kitem.EndTime !== '';}) || [];
                    if (item.UserScheduleDetails.length > 0) {
                        var list1 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.StartTime !== '' });
                        if (list1.length == 0) {
                            alertify.error("Please Select Start Time");
                            return false;
                        }
                        var list = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.EndTime !== '' });
                        if (list.length == 0) {
                            alertify.error("Please Select End Time");
                            return false;
                        }
                        var list2 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.BranchId !== null });
                        if (list2.length == 0) {
                            alertify.error("Please Select Branch");
                            return false;
                        }
                        if (item.UserScheduleName === '') {
                            alertify.error("Please Enter Schedule Name");
                            return false;
                        }
                    }

                    if ($scope.newUserBasicInfoObj.AvgConsultationTime == "") {
                        alertify.error("Please Select Appointment Duration!");
                        return false;
                    }

                    if ($scope.UserScheduleSlotsArray.length > 0) {
                        var UserSlot = $filter('filter')($scope.UserScheduleSlotsArray, { 'UserScheduleName': item.UserScheduleName }, true);
                    }

                    UserSlot = UserSlot || [];
                    if (UserSlot.length > 0) {
                        alertify.error("User Schedule Name Already Exist");
                        return false;
                    }

                    $scope.newUserAddReqObj = item;

                    //if (item.Type == 'Duration') {
                    //    item.ScheduleDuration = item.ScheduleDuration || null;
                    //    item.FromDate = null;
                    //    item.ToDate = null;
                    //    if (item.ScheduleDuration == null) {
                    //        alertify.error("Please Enter Duration");
                    //        return false;
                    //    }
                    //    $scope.UsertempTimeSlotsArray = [];
                    //    if ($scope.ScheduledDateArray.length > 0) {
                    //        angular.forEach($scope.ScheduledDateArray, function (Btem) {
                    //            var obj = {
                    //                "Date": Btem.Date,
                    //                "Day": Btem.Day,
                    //                "StartTime": "",
                    //                "EndTime": "",

                    //            }
                    //            $scope.UsertempTimeSlotsArray.push(obj);
                    //        });
                    //    }



                    //    //var currentDate = new Date();
                    //    //var oneMonthLater = new Date();
                    //    //item.ScheduleDuration = parseInt(item.ScheduleDuration);
                    //    //oneMonthLater.setMonth(currentDate.getMonth() + item.ScheduleDuration);
                    //    //$scope.UsertempTimeSlotsArray = [];
                    //    //for (var d = currentDate; d <= oneMonthLater; d.setDate(d.getDate() + 1)) {
                    //    //    // datesArray.push(new Date(d));
                    //    //    var date = new Date(d);
                    //    //    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    //    //    var day = daysOfWeek[date.getDay()];

                    //    //    $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                    //    //    var obj = {
                    //    //        "Date": $scope.DisplayDate,
                    //    //        "Day": day,
                    //    //        "StartTime": "",
                    //    //        "EndTime": "",

                    //    //    }
                    //    //    $scope.UsertempTimeSlotsArray.push(obj);
                    //    //}
                    //}
                    //if (item.Type == 'Date') {
                    //    item.FromDate = item.FromDate || null;
                    //    item.ToDate = item.ToDate || null;
                    //    if (item.FromDate == null) {
                    //        alertify.error("Please Select From Date");
                    //        return false;
                    //    }
                    //    if (item.ToDate == null) {
                    //        alertify.error("Please Select To Date");
                    //        return false;
                    //    }
                    //    var currentDate = new Date(item.FromDate);
                    //    var ToDateDate = new Date(item.ToDate);
                    //    item.ScheduleDuration = null;
                    //    $scope.UsertempTimeSlotsArray = [];
                    //    for (var d = currentDate; d <= ToDateDate; d.setDate(d.getDate() + 1)) {
                    //        // datesArray.push(new Date(d));
                    //        var date = new Date(d);
                    //        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    //        var day = daysOfWeek[date.getDay()];

                    //        $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                    //        var obj = {
                    //            "Date": $scope.DisplayDate,
                    //            "Day": day,
                    //            "StartTime": "",
                    //            "EndTime": "",

                    //        }
                    //        $scope.UsertempTimeSlotsArray.push(obj);
                    //    }
                    //}

                    //$scope.TimeSlotsArray = [];
                    //if ($scope.UsertempTimeSlotsArray.length > 0) {
                    //    angular.forEach($scope.UsertempTimeSlotsArray, function (Aitem) {
                    //        var list1 = $filter("filter")(item.UserScheduleDetails, function (kitem, index) { return kitem.Day == Aitem.Day });

                    //        if (list1.length > 0) {
                    //            var Breakobj = {
                    //                "BranchId": list1[0].BranchId,
                    //                "Date": Aitem.Date || "",
                    //                "StartTime": list1[0].StartTime,
                    //                "EndTime": list1[0].EndTime,

                    //            }
                    //            $scope.TimeSlotsArray.push(Breakobj);
                    //        }
                    //    });
                    //}

                    var params = {
                        "UserId": $scope.MainUserObj.BasicInfo.UserId,
                        "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "TimeSlotsArray": $scope.TimeSlotsArray || [],
                    };


                    eHnoteMainAdminServices.CheckIsUserSlotAvailNew(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
                    function callbackgetuserbranchSuccess(resp) {
                        console.log(JSON.stringify(resp));
                        if (resp.isUserSlotAvailable) {

                            $scope.continuetoSaveUserCurrentSLotNew($scope.newUserAddReqObj);
                        } else {
                            //  alertify.error(resp.Message);
                            var r = alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20' >  Previous slots will be updated with new information, Do you want to continue? </h4> ",
                                function () {
                                    $scope.continuetoSaveUserCurrentSLotNew($scope.newUserAddReqObj);
                                }, function () {
                                    return false;
                                });
                        }

                    }
                    function callbackgetuserbranchError(err) {
                        alertify.error("Some Error Occured");
                    }

                }

                // ApptDuration based timeslots
                function pushTimeslots(item, duration) {
                    item.SlotStartValues = [];
                    item.SlotEndValues = [];
                    var durationtime = parseInt(duration);

                    var shour = "00"; //"00";
                    var smin = "00";
                    var ehour = "23"; // "23";
                    var emin = "59";  //"59";
                    var startingTime = moment().hours(shour).minutes(smin);
                    var endingTime = moment().hours(ehour).minutes(emin);
                    var currentStartTime = angular.copy(startingTime);
                    while (currentStartTime < endingTime) {
                        var slotObj = {
                            "StartTime": currentStartTime.format("HH:mm"),
                            "time": currentStartTime.format("HH:mm"),
                            "EndTime": currentStartTime.add(durationtime, "minute").format("HH:mm"),
                        }

                        var t = $filter('date')(new Date(), "yyyy-MM-dd");
                        var datetime = t + "T" + slotObj.StartTime;
                        var NewStartTime = "";
                        var NewStartTime = $filter('date')(datetime, "hh:mm: a");

                        var arr = NewStartTime.split(':');
                        if (arr[0] == "12" && arr[2] == " AM") {
                            NewStartTime = NewStartTime.replace('12', '00');
                        }
                        var obj = {
                            "time": angular.copy(slotObj.time),
                            "newtime": angular.copy(NewStartTime)
                        }

                        item.SlotStartValues.push(obj);
                        item.SlotEndValues.push(obj);
                    }
                    //  console.log(JSON.stringify(item.SlotStartValues));
                    if (item.UserScheduleDetails.length > 0) {
                        angular.forEach(item.UserScheduleDetails, function (uitem) {
                            uitem.SlotStartValues = angular.copy(item.SlotStartValues) || [];
                            uitem.SlotEndValues = angular.copy(item.SlotEndValues) || [];
                        });
                    }
                };
                if ($scope.NewUserScheduleSlotsArray.length > 0) {
                    pushTimeslots($scope.NewUserScheduleSlotsArray[0], $scope.newUserBasicInfoObj.AvgConsultationTime);
                }

                $scope.ChangeTimeslotsBasedonApptDuration = function (item, duration) {

                    duration = duration || "";
                    if (duration == '') {
                        return false;
                    }

                    alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Do you wish to change the Duration? the scheduled duration time will be reset.</h4> ", function () {


                        MaintainAvgConsultationTime = duration;

                        if ($scope.NewUserScheduleSlotsArray.length > 0) {
                            angular.forEach($scope.NewUserScheduleSlotsArray, function (nitem) {
                                if (nitem.UserScheduleDetails.length > 0) {
                                    angular.forEach(nitem.UserScheduleDetails, function (subitem) {
                                        subitem.StartTime = "";
                                        subitem.EndTime = "";
                                    });
                                }
                            });
                        }

                        pushTimeslots(item, duration);

                    }, function () {
                        $scope.newUserBasicInfoObj.AvgConsultationTime = MaintainAvgConsultationTime || 0;
                    });
                }
                $scope.ChangeStartTimeSchedule = function (item, Mainitem) {
                    item.EndTime = "";
                    item.SlotEndValues = [];
                    if (item.SlotStartValues.length > 0) {
                        var count = 0;
                        angular.forEach(item.SlotStartValues, function (sitem) {
                            if (item.StartTime == sitem.time) {
                                count++;
                                return;
                            }
                            if (count > 0) {
                                item.SlotEndValues.push(sitem);
                            }
                        });
                    }
                }

            },
            "resolve": {
                "NewUserScheduleSlotsArray": function () {
                    return $scope.NewUserScheduleSlotsArray;
                }
            }
        });
    };

    //$scope.ShowHideAllDays = function (item) {
    //    item.IsShowAllDays = !item.IsShowAllDays;
    //};

    $scope.OnSelectWeekDay = function (array, obj) {
        angular.forEach(array, function (item) {
            if (item.IsChecked && obj.DayId < item.DayId) {
                item.StartTime = obj.StartTime;
                item.EndTime = obj.EndTime;
                //item.DurationMinutes = obj.DurationMinutes;
                item.BranchObj = obj.BranchObj;
                item.BranchId = obj.BranchId;
                item.UserBranchId = obj.UserBranchId;
                item.OnlineSlots = obj.OnlineSlots;
                item.BreakSlots = obj.BreakSlots;
                item.NewAppointmentSlots = angular.copy(obj.NewAppointmentSlots);
                item.ClinicalFollowAppointmentSlots = angular.copy(obj.ClinicalFollowAppointmentSlots);
                item.PostOpFollowAppointmentSlots = angular.copy(obj.PostOpFollowAppointmentSlots);
                item.ASCFollowAppointmentSlots = angular.copy(obj.ASCFollowAppointmentSlots);
                item.allDaySlots = angular.copy(obj.allDaySlots);
                item.ScheduledSlotVisitReasonsArray = angular.copy(obj.ScheduledSlotVisitReasonsArray);
                item.InvestigationSlots = angular.copy(obj.InvestigationSlots);
                item.IsShowAllDays = false;

                item.NewAppointmentMaxSlots = obj.NewAppointmentMaxSlots || null;
                item.ClinicFollowUpAppointmentMaxSlots = obj.ClinicFollowUpAppointmentMaxSlots || null;
                item.PostOpFollowUpAppointmentMaxSlots = obj.PostOpFollowUpAppointmentMaxSlots || null;
                item.ASCAppointmentMaxSlots = obj.ASCAppointmentMaxSlots || null;
                item.InvestigationMaxSlots = obj.InvestigationMaxSlots || null;

                item.MaximumOverAllSlots = obj.MaximumOverAllSlots || null;

            } else {
                item.IsShowAllDays = false;
            }
        });
    };

    // admin slots new design
    $scope.getBranchAppointmentTypes = function () {
        let hospitalId = 0;
        eHnoteMainAppointmentService.getBranchAppointmentTypes(hospitalId).then(function (resp) {
            console.log(resp);
            $scope.appointmentTypes = [];
            if (resp.data.rows != undefined) {
                $scope.appointmentTypes = resp.data.rows;
                angular.forEach($scope.appointmentTypes, function (item) {
                    item.IsChecked = false;
                });
                $scope.appointmentTypes = $scope.appointmentTypes.filter((x) => x.AppointmentTypeId === 1 || x.AppointmentTypeId === 2 || x.AppointmentTypeId === 3 || x.AppointmentTypeId === 4 || x.AppointmentTypeId === 5)
            }
        });

    };

    $scope.GetVisitReasonNew = function (id) {
        id = id || 0;
        if (id == 0) {
            var Branchid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        } else {
            var Branchid = id;
        }
        var getParams = {
            "OrganizationId": Branchid,
            "ReasonTypeId": 1,
            "SearchText": "",
            "VisitTypeId": null
        };
        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
            if (resp.data !== undefined) {
                $scope.GetVisitReasonArray = resp.data.rows || [];
                if ($scope.GetVisitReasonArray.length > 0) {
                    $scope.GetVisitReasonArray = $filter("filter")($scope.GetVisitReasonArray, function (item) {
                        return item.ActiveIND === 'Y';
                    });
                    angular.forEach($scope.GetVisitReasonArray, function (hitem) {
                        hitem.IsChecked = false;
                        /* hitem.IsHide = true;*/
                    });
                }
            }
        });
    };

    $scope.getBranchAppointmentTypes();
    $scope.GetVisitReasonNew();

    $scope.changeUserMobileNumber = function (phoneNumberString) {
        $scope.USnumberString = phoneNumberString || "";
        if ($scope.USnumberString != "") {
            console.log($scope.USnumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            //  return `${part1}${part2}${part3}`;
            $scope.newUserBasicInfoObj.UserMobileNumber = part1 + part2 + part3;
            if ($scope.USnumberString.length > 9) {
                var Area = $scope.USnumberString.slice(0, 3);
                $scope.newUserBasicInfoObj.AreaCode = Area;
                var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                $scope.newUserBasicInfoObj.UserMobileNo = contact;
            }
        } else {
            $scope.newUserBasicInfoObj.UserMobileNo = "";
            $scope.newUserBasicInfoObj.AreaCode = "";
            $scope.newUserBasicInfoObj.UserMobileNumber = "";
        }
    }


    $scope.changeUserCommunicationMobileNumber = function (phoneNumberString) {
        $scope.USnumberString = phoneNumberString || "";
        if ($scope.USnumberString != "") {
            console.log($scope.USnumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            //  return `${part1}${part2}${part3}`;
            $scope.newUserBasicInfoObj.UserCommunicationMobileNumber = part1 + part2 + part3;

            if ($scope.USnumberString.length > 9) {
                var Area = $scope.USnumberString.slice(0, 3);
                $scope.newUserBasicInfoObj.CommunicationAreaCode = Area;
                var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                $scope.newUserBasicInfoObj.UserCommunicationMobileNo = contact;
            }
        } else {
            $scope.newUserBasicInfoObj.UserCommunicationMobileNo = "";
            $scope.newUserBasicInfoObj.CommunicationAreaCode = "";
            $scope.newUserBasicInfoObj.UserCommunicationMobileNumber = "";
        }
    }

    //$scope.otherUsersArray = [
    //    {
    //    "UserId": 2,
    //        "UserName": "User 1",
    //    "isChecked":false
    //},
    //{

    //    "UserId": 3,
    //    "UserName": "User 2",
    //    "isChecked": false
    //},
    //{

    //    "UserId": 4,
    //    "UserName": "User 3",
    //    "isChecked": false
    //}]

    $scope.selectedotherusers = 'All';
    $scope.checkAllOtherUser = function (val) {
        if (val) {
            angular.forEach($scope.otherUsersArray, function (item) {
                item.isChecked = true;
            });

            $scope.selectedotherusers = 'All';
        } else {
            angular.forEach($scope.otherUsersArray, function (item) {
                item.isChecked = false;
            });

            $scope.selectedotherusers = 'Select Other User';
        }
        var checkedArray = _.where($scope.otherUsersArray, { isChecked: true });
        $scope.allOtherUserCheck = checkedArray.length > 0 && $scope.otherUsersArray.length === checkedArray.length ? true : false;

    };

    $scope.OtheruserToggle = function (item) {
        if (!item.isChecked) {
            if (item.ConnectedUserId != 0) {
                item.DeleteInd = 'Y';
            }
        }
        var checkedArray = _.where($scope.otherUsersArray, { isChecked: true });

        var UncheckedArray = _.where($scope.otherUsersArray, { isChecked: false });


        $scope.allOtherUserCheck = checkedArray.length > 0 && $scope.otherUsersArray.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedotherusers = 'Select Other User';
        } else {
            if (checkedArray.length > 0) {
                //  $scope.selectedotherusers =  checkedArray[0].UserName;
                $scope.selectedotherusers = 'Selected';

            } else {
                $scope.selectedotherusers = 'Select Other User';
            }
        }

    };

    $scope.changeConnectOtherUsers = function (val, obj) {
        $scope.checkobj.IsConnectedUsersAvailable = val || false;
        if (val) {
            $scope.newConnectUserSearchListObj = getNewUserSearchListObj();
            $scope.newConnectUserSearchListObj.BranchId = $scope.newConnectUserSearchListObj.BranchId || 0;
            if ($scope.newConnectUserSearchListObj.BranchId === 0) {
                if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                    $scope.newConnectUserSearchListObj.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                }
            }
            $scope.newConnectUserSearchListObj.PageSize = 500;
            eHnoteMainAdminServices.getAllUsersBasicInfo($scope.newConnectUserSearchListObj, ongetAllUsersSuccess, ongetAllUsersError);

            function ongetAllUsersSuccess(response) {
                $scope.allchildUsersArray = [];
                if (response.status === 'Success') {
                    if (response.row.length > 0) {
                        $scope.allchildUsersArray = response.row;
                        $scope.otherUsersArray = [];
                        $scope.filterlist = $filter("filter")($scope.allchildUsersArray, function (item) {
                            return item.RoleId === 1 || item.RoleId === 43;
                        }) || [];
                        $scope.filterlist = $filter("filter")($scope.filterlist, function (subitem, index) {
                            return subitem.UserId != obj.UserId;
                        });
                        if ($scope.filterlist.length > 0) {
                            angular.forEach($scope.filterlist, function (item) {
                                var obj = {
                                    "UserId": item.UserId,
                                    "UserName": item.UserName,
                                    "FullName": item.FullName,
                                    "SecondUserFullName": item.SecondUserFullName,
                                    "isChecked": false,
                                    "DeleteInd": 'N',
                                    "ConnectedUserId": 0
                                }
                                $scope.otherUsersArray.push(obj);
                            });
                        }

                    }
                }
            }
            function ongetAllUsersError(resp) {
                console.log(resp);
            }

        } else {

            angular.forEach($scope.otherUsersArray, function (oitem) {
                if (oitem.ConnectedUserId != 0) {
                    oitem.DeleteInd = 'Y';
                    oitem.isChecked = false;
                }
            });
        }
    }



    $scope.connectSchedules = function (sid, docid) {

        var sScheduleId = sid || 0;
        var connecteddocid = docid || 0
        var mainobj = {
            "MainUserObj": $scope.MainUserObj,
            "UserId": doctorinfo.doctorid,
            "BranchId": $scope.BranchId,
            "SlotsArray": $scope.UserScheduleSlotsArray,
            "UserScheduleId": sScheduleId || 0,
            "ConnectedUserId": connecteddocid,
            "allUsersList": $scope.allchildUsersArray || []
        }

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/connectSchedulePopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "windowClass": "appointment-full-popup",
            "resolve": {
                "mainitem": function () {
                    return mainobj;
                }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, mainitem) {

                console.log(mainitem);

                console.log(mainitem.ConnectedUserId);

                $scope.AllUsersList = mainobj.allUsersList;

                $scope.slotsArray = mainitem.SlotsArray || [];
                $scope.Type = "Duration";
                $scope.ScheduleEveryType = "";
                $scope.ScheduledDateArray = [];
                $scope.SearchWeekobj = {
                    "txt": "",
                    "selecteditem": "Select"
                };

                $scope.disableScheduleSelection = false;
                $scope.connectedUsersObj = {
                    "isAvailable": false,
                    "UsersList": []
                }
                $scope.SelectedMonthobj = {
                    "Selecteditem": "Select"
                }
                $scope.RepeatMonth = [
                    {
                        "Id": 10,
                        "Name": "Every Month 1st",
                        "isChecked": false,
                        "Active": "Y"
                    },
                    {
                        "Id": 11,
                        "Name": "Every Month 2nd",
                        "isChecked": false,
                        "Active": "Y"
                    },
                    {
                        "Id": 12,
                        "Name": "Every Month 3rd",
                        "isChecked": false,
                        "Active": "Y"
                    },
                    {
                        "Id": 13,
                        "Name": "Every Month 4th",
                        "isChecked": false,
                        "Active": "Y"
                    },
                    {
                        "Id": 15,
                        "Name": "Every Month 5th",
                        "isChecked": false,
                        "Active": "Y"
                    },
                    {
                        "Id": 14,
                        "Name": "Every Month last",
                        "isChecked": false,
                        "Active": "Y"
                    }
                ];

                function getnewAddUpdateScheduleObj() {
                    var obj = {
                        "UserId": mainitem.UserId,
                        "BranchId": mainitem.BranchId,
                        "DoctorId": $scope.MainUserObj.BasicInfo.UserId,
                        "Type": "Duration",
                        "ScheduleDate": $filter('date')(new Date(), "yyyy-MM-dd"),
                        "FromDate": null,
                        "ToDate": null,
                        "ScheduleDuration": "",
                        "ScheduleDurationType": "M",
                        "UserScheduleId": 0,
                        "ConnectedUserObj": "",
                        "UserScheduleObj": "",
                        "UserScheduleName": "",
                        "showDaySelection": false,
                        "IsAlternateDaysSelected": false,
                        "ScheduleMonthEveryType": "",
                        "UserScheduleDetails": [],
                        "UserDaySlots": [],
                        "ScheduleMonthorWeekType": 1,
                        "ScheduleMonthMultiEveryType": ""
                    }

                    return obj;
                }

                $scope.addUpdateScheduleObj = getnewAddUpdateScheduleObj();


                if (mainitem.UserScheduleId !== 0) {

                    var selectedScheduledArray = $filter("filter")($scope.slotsArray, { "UserScheduleId": mainitem.UserScheduleId });
                    if (selectedScheduledArray.length > 0) {
                        $scope.addUpdateScheduleObj.UserScheduleObj = selectedScheduledArray[0];
                        $scope.addUpdateScheduleObj.UserScheduleId = selectedScheduledArray[0].UserScheduleId;
                        $scope.addUpdateScheduleObj.UserScheduleName = selectedScheduledArray[0].UserScheduleName;
                        $scope.addUpdateScheduleObj.UserScheduleDetails = selectedScheduledArray[0].UserScheduleDetails;
                        $scope.disableScheduleSelection = true;
                    }

                }


                if (mainitem.ConnectedUserId !== 0) {
                    if ($scope.AllUsersList.length > 0) {
                        var selectedDocListArray = $filter("filter")($scope.AllUsersList, { "UserId": mainitem.ConnectedUserId }, true);
                        if (selectedDocListArray.length > 0) {
                            var connectedUsersList = selectedDocListArray[0].ConnectedUsers || [];
                            if (connectedUsersList.length > 0) {
                                angular.forEach(connectedUsersList, function (mitem) {
                                    if (mitem.BranchId === mainitem.BranchId) {
                                        var selectedDocListArray = $filter("filter")($scope.AllUsersList, { "UserId": mitem.ChildUserId }, true);
                                        if (selectedDocListArray.length > 0) {
                                            var Obj = {
                                                "UserId": selectedDocListArray[0].UserId,
                                                "UserName": selectedDocListArray[0].FullName
                                            }
                                            $scope.connectedUsersObj.UsersList.push(Obj);
                                            $scope.connectedUsersObj.isAvailable = true;
                                            $scope.slotsArray = [];
                                            $scope.addUpdateScheduleObj.DoctorId = 0;
                                        }
                                    }

                                });
                            }
                        }
                    }
                }
                $scope.changeUserScheduleObj = function (obj) {
                    console.log(obj);
                    $scope.addUpdateScheduleObj.UserScheduleId = obj.UserScheduleId;
                    $scope.addUpdateScheduleObj.UserScheduleName = obj.UserScheduleName;
                    $scope.addUpdateScheduleObj.UserScheduleDetails = obj.UserScheduleDetails;
                };

                $scope.changeMonthEveryType = function (obj) {
                    console.log(obj);
                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";
                };


                $scope.daysofweek = [{
                    "WeekId": 1,
                    "WeekDay": "Monday",
                    "isChecked": false,
                    "StartDate": "",
                    "Active": "Y"
                },
                {
                    "WeekId": 2,
                    "WeekDay": "Tuesday",
                    "isChecked": false,
                    "StartDate": "",
                    "Active": "Y"
                },
                {
                    "WeekId": 3,
                    "WeekDay": "Wednesday",
                    "StartDate": "",
                    "isChecked": false,
                    "Active": "Y"
                },
                {
                    "WeekId": 4,
                    "WeekDay": "Thursday",
                    "StartDate": "",
                    "isChecked": false,
                    "Active": "Y"
                },
                {
                    "WeekId": 5,
                    "WeekDay": "Friday",
                    "StartDate": "",
                    "isChecked": false,
                    "Active": "Y"
                },
                {
                    "WeekId": 6,
                    "WeekDay": "Saturday",
                    "StartDate": "",
                    "isChecked": false,
                    "Active": "Y"
                }];

                if ($scope.addUpdateScheduleObj.UserScheduleObj != "") {
                    var uniqDayslist = _.uniq($scope.addUpdateScheduleObj.UserScheduleObj.UserScheduleDetails, false, function (p) { return p.Day; });
                    if (uniqDayslist.length > 0) {
                        angular.forEach($scope.daysofweek, function (item) {
                            item.Active = "N";
                        });

                        angular.forEach(uniqDayslist, function (ditem) {
                            var tempArray = $filter('filter')($scope.daysofweek, { 'WeekId': ditem.DayId }, true);
                            if (tempArray.length > 0) {
                                tempArray[0].Active = "Y";
                            }
                        });
                    }
                }

                function getAlternateDatesByDayWise(dayid,selectedstartdate) {

                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;

                    var currentDate = new Date(selectedstartdate);
                    var month = currentDate.getMonth();
                    var weekdayCount = 0;
                    for (var i = 0; i <= emonths; i++) {
                        console.log(currentDate.getMonth() + "__" + month);
                        while (currentDate.getMonth() === month) {
                            if (currentDate.getDay() === dayid) {
                                weekdayCount++;
                                if (weekdayCount % 2 === 1) {
                                    $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                    var dayno = daysOfWeek[currentDate.getDay()];
                                    var weekno = getWeekOfMonth(currentDate);
                                    var obj = {
                                        "Date": $scope.DisplayDate,
                                        "Day": dayno,
                                        "WeekNumber": weekno,
                                        "StartTime": "",
                                        "EndTime": "",
                                    }
                                    selecteddates.push(obj);
                                }
                            }

                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                        month++;
                        //after 12 months increasing 1 year
                        if (month > 11) {
                            month = 0;
                            currentDate.setFullYear(currentDate.getFullYear());
                        }
                    }
                    return selecteddates;
                }

                function getDatesByDayWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;
                    for (var i = 0; i < emonths; i++) {
                        currentDate.setDate(1);
                        for (var day = 1; day <= 7; day++) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {
                                $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                var dayno = daysOfWeek[currentDate.getDay()];
                                var weekno = getWeekOfMonth(currentDate);
                                var obj = {
                                    "Date": $scope.DisplayDate,
                                    "Day": dayno,
                                    "WeekNumber": weekno,
                                    "StartTime": "",
                                    "EndTime": "",
                                }
                                selecteddates.push(obj);
                                break;
                            }
                        }
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                    return selecteddates;
                }
                function getDatesBysecondweekWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;

                    for (var i = 0; i < emonths; i++) {
                        currentDate.setDate(1);
                        var count = 0;
                        for (var day = 1; day <= 31; day++) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {
                                count++;
                                if (count === 2) {
                                    $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                    var dayno = daysOfWeek[currentDate.getDay()];
                                    var weekno = getWeekOfMonth(currentDate);
                                    var obj = {
                                        "Date": $scope.DisplayDate,
                                        "Day": dayno,
                                        "WeekNumber": weekno,
                                        "StartTime": "",
                                        "EndTime": "",
                                    }
                                    selecteddates.push(obj);
                                    break;
                                }
                            }
                        }
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                    return selecteddates;
                }
                function getDatesByThirdweekWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;

                    for (var i = 0; i < emonths; i++) {
                        currentDate.setDate(1);
                        var count = 0;
                        for (var day = 1; day <= 31; day++) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {
                                count++;
                                if (count === 3) {
                                    $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                    var dayno = daysOfWeek[currentDate.getDay()];
                                    var weekno = getWeekOfMonth(currentDate);
                                    var obj = {
                                        "Date": $scope.DisplayDate,
                                        "Day": dayno,
                                        "WeekNumber": weekno,
                                        "StartTime": "",
                                        "EndTime": "",
                                    }
                                    selecteddates.push(obj);
                                    break;
                                }
                            }
                        }
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                    return selecteddates;
                }

                function getDatesByFourthweekWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;

                    for (var i = 0; i < emonths; i++) {
                        currentDate.setDate(1);
                        var count = 0;
                        for (var day = 1; day <= 31; day++) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {
                                count++;
                                if (count === 4) {
                                    $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                    var dayno = daysOfWeek[currentDate.getDay()];
                                    var weekno = getWeekOfMonth(currentDate);
                                    var obj = {
                                        "Date": $scope.DisplayDate,
                                        "Day": dayno,
                                        "WeekNumber": weekno,
                                        "StartTime": "",
                                        "EndTime": "",
                                    }
                                    selecteddates.push(obj);
                                    break;
                                }
                            }
                        }
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                    return selecteddates;
                }

                function getDatesByFifthweekWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;
                    var currentmonth = "";

                    for (var i = 0; i < emonths; i++) {
                        currentDate.setDate(1);
                        var currentmonth = currentDate.getMonth();

                        var count = 0;
                        for (var day = 1; day <= 31; day++) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {
                                count++;
                                if (count === 5) {
                                    var afterconvert = currentDate.getMonth();
                                    if (currentmonth == afterconvert) {
                                        $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                        var dayno = daysOfWeek[currentDate.getDay()];
                                        var weekno = getWeekOfMonth(currentDate);
                                        var obj = {
                                            "Date": $scope.DisplayDate,
                                            "Day": dayno,
                                            "WeekNumber": weekno,
                                            "StartTime": "",
                                            "EndTime": "",
                                        }
                                        selecteddates.push(obj);
                                    }
                                    break;
                                }
                            }
                        }

                        var copydate = angular.copy(currentDate);
                        var currentmonth1 = copydate.getMonth();
                        if (currentmonth + 1 == currentmonth1) {

                        } else {
                            currentDate.setDate(1);
                            currentDate.setMonth(currentDate.getMonth() + 1);
                        }
                    }
                    return selecteddates;
                }

                function getDatesByLastweekWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;

                    for (var i = 0; i < emonths; i++) {

                        var lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                        for (var day = lastDayOfMonth; day >= 1; day--) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {

                                $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                var dayno = daysOfWeek[currentDate.getDay()];
                                var weekno = getWeekOfMonth(currentDate);
                                var obj = {
                                    "Date": $scope.DisplayDate,
                                    "Day": dayno,
                                    "WeekNumber": weekno,
                                    "StartTime": "",
                                    "EndTime": "",
                                }
                                selecteddates.push(obj);
                                break;


                            }
                        }
                        if (currentDate.getDate() > 28) {
                            currentDate.setDate(1);
                            currentDate.setMonth(currentDate.getMonth() + 1);
                        } else {
                            currentDate.setMonth(currentDate.getMonth() + 1);
                        }
                    }
                    return selecteddates;
                }


                $scope.changeConnectedUsersObj = function (obj) {
                    console.log(obj)
                    $scope.UserScheduleSlotsArray = [];
                    $scope.slotsArray = [];
                    $scope.addUpdateScheduleObj.DoctorId = obj.UserId;
                    var params = {
                        "UserId": obj.UserId,
                        "BranchId": mainitem.BranchId
                    }
                    eHnoteMainAdminServices.GetUserScheduledSlots(params, callbackuserSlotSuccess, callbackuserSlotError);
                    function callbackuserSlotSuccess(resp) {
                        if (resp.status === "Success") {
                            $scope.UserScheduleSlotsArray = resp.rows || [];


                            $scope.SlotStartValues = [];
                            for (var i = 0; i < 24; i++) {

                                var thistime = "";
                                if (i > 12) {
                                    var it = i - 12;
                                    if (it > 9) {
                                        thistime = it + ':00' + ': PM';
                                    } else {
                                        thistime = '0' + it + ':00' + ': PM';
                                    }
                                }
                                else {
                                    var it = i;
                                    if (it > 9) {
                                        if (it >= 12) {
                                            thistime = it + ':00' + ': PM';
                                        } else {
                                            thistime = it + ':00' + ': AM';
                                        }

                                    } else {
                                        thistime = '0' + it + ':00' + ': AM';
                                    }
                                }

                                var obj = {
                                    "time": "",
                                    "newtime": ""
                                }

                                if (i > 9) {
                                    obj.time = i + ':00';
                                    obj.newtime = thistime;
                                }
                                else {
                                    obj.time = '0' + i + ':00';
                                    obj.newtime = thistime;
                                }

                                $scope.SlotStartValues.push(obj);
                            }

                            $scope.SlotEndValues = [];
                            for (var i = 0; i < 24; i++) {
                                var thistime = "";
                                if (i > 12) {
                                    var it = i - 12;
                                    if (it > 9) {
                                        thistime = it + ':00' + ': PM';
                                    } else {
                                        thistime = '0' + it + ':00' + ': PM';
                                    }
                                }
                                else {
                                    var it = i;
                                    if (it > 9) {
                                        if (it >= 12) {
                                            thistime = it + ':00' + ': PM';
                                        } else {
                                            thistime = it + ':00' + ': AM';
                                        }

                                    } else {
                                        thistime = '0' + it + ':00' + ': AM';
                                    }
                                }

                                var obj = {
                                    "time": "",
                                    "newtime": ""
                                }

                                if (i > 9) {
                                    obj.time = i + ':00';
                                    obj.newtime = thistime;
                                }
                                else {
                                    obj.time = '0' + i + ':00';
                                    obj.newtime = thistime;
                                }
                                /*var thistime = (i > 12) ? (i - 12 + ': PM') : (i + ': AM');*/
                                //var obj = {
                                //    "time": "",
                                //    "newtime": thistime
                                //}

                                //if (i > 9) {
                                //    obj.time = i + ':00';
                                //}
                                //else {
                                //    obj.time = '0' + i + ':00';
                                //}

                                $scope.SlotEndValues.push(obj);
                            }
                            console.log($scope.SlotStartValues);
                            console.log($scope.SlotEndValues);


                            if ($scope.UserScheduleSlotsArray.length > 0) {
                                angular.forEach($scope.UserScheduleSlotsArray, function (item) {
                                    item.IsAdvancedSlotsActive = false;
                                    item.SlotStartValues = angular.copy($scope.SlotStartValues) || [];
                                    item.SlotEndValues = angular.copy($scope.SlotEndValues) || [];
                                    item.Type = item.Type || 'Duration';
                                    item.FromDate = item.FromDate || "";
                                    item.ToDate = item.ToDate || "";

                                    if (item.UserScheduleDetails.length > 0) {
                                        angular.forEach(item.UserScheduleDetails, function (Aitem) {
                                            var list1 = $filter("filter")($scope.MainUserObj.BasicInfo.UserWorkingBranches, function (kitem, index) { return kitem.BranchId == Aitem.BranchId && kitem.UserBranchId == Aitem.UserBranchId });
                                            if (list1.length > 0) {
                                                Aitem.BranchObj = list1[0];
                                            }

                                            var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                            var dateStarttime = currentDt + "T" + Aitem.StartTime;
                                            var dateEndtime = currentDt + "T" + Aitem.EndTime;

                                            var CurrentStartTime = $filter("date")(new Date(dateStarttime), "h:mm a");
                                            var CurrentEndTime = $filter("date")(new Date(dateEndtime), "h:mm a");

                                            Aitem.displaystarttime = CurrentStartTime || '';
                                            Aitem.displayEndtime = CurrentEndTime || '';
                                            Aitem.OnlineSlots = Aitem.OnlineSlots || [];
                                            Aitem.BreakSlots = Aitem.BreakSlots || [];

                                            if (Aitem.BreakSlots.length > 0) {
                                                angular.forEach(Aitem.BreakSlots, function (Citem) {
                                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                                    var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                                    var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                                    var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                                    var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                                    Citem.displaystarttime = CurrentStartTime || '';
                                                    Citem.displayEndtime = CurrentEndTime || '';

                                                });
                                            }
                                            if (Aitem.OnlineSlots.length > 0) {
                                                angular.forEach(Aitem.OnlineSlots, function (Citem) {
                                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                                    var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                                    var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                                    var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                                    var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                                    Citem.displaystarttime = CurrentStartTime || '';
                                                    Citem.displayEndtime = CurrentEndTime || '';

                                                });
                                            }


                                            if (Aitem.SlotsList.length > 0) {
                                                angular.forEach(Aitem.SlotsList, function (Citem) {
                                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                                    var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                                    var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                                    var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                                    var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                                    Citem.displaystarttime = CurrentStartTime || '';
                                                    Citem.displayEndtime = CurrentEndTime || '';

                                                });
                                            }
                                        });

                                        // See callbackuserSlotSuccess above for GetUserScheduledSlots: IsAdvancedSchedule
                                        // is per-day, so derive a schedule-wide flag rather than only checking day[0].
                                        item.IsAnyAdvancedSchedule = _.some(item.UserScheduleDetails, function (d) { return d.IsAdvancedSchedule; });
                                    }
                                })


                                $scope.slotsArray = $scope.UserScheduleSlotsArray || [];

                            } else {
                                $scope.UserScheduleSlotsArray = [];
                                alertify.error("No Schedules Added For the User,Please Add Schedule and continue");
                            }



                        }
                    }
                    function callbackuserSlotError(err) {
                        alertify.error("Some Error Occured");
                    }
                };

                function getAllWeekDates() {

                    var array = [];
                    console.log($scope.addUpdateScheduleObj.ScheduleDate);

                    var actualSelectedDt = $filter('date')($scope.addUpdateScheduleObj.ScheduleDate, "yyyy-MM-dd");


                    $scope.currentDate = new Date($filter('date')($scope.addUpdateScheduleObj.ScheduleDate, "yyyy-MM-dd") + ' ' + "00:00:00");


                    console.log($scope.currentDate);
                    var monthCount = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 0;


                    for (var i = 0; i < monthCount; i++) {
                        var monthStartDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() + i, 1);

                        var numDaysInMonth = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1, 0).getDate();

                        for (var j = 0; j < numDaysInMonth; j++) {
                            var date = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth(), j + 1);
                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];
                            console.log(date);
                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");
                            var weekno = getWeekOfMonth(date);

                            var result = comparetwodates(actualSelectedDt, $scope.DisplayDate);
                            console.log(result);

                            if (!result) {
                                var obj = {
                                    "Date": $scope.DisplayDate,
                                    "Day": day,
                                    "WeekNumber": weekno,
                                    "StartTime": "",
                                    "EndTime": "",
                                }
                                array.push(obj);
                            }

                        }
                    }

                    return array;

                }

                function getWeekOfMonth(date) {
                    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                    const dayOfWeek = firstDayOfMonth.getDay();
                    const dayOfMonth = date.getDate() + dayOfWeek;
                    return Math.ceil(dayOfMonth / 7);
                }

                function comparetwodates(dt1, dt2) {
                    let date1 = new Date(dt1); // December 31, 2022
                    let date2 = new Date(dt2); // January 1, 2022

                    var result = false;
                    // compare the two dates
                    if (date1.getTime() > date2.getTime()) {
                        result = true;
                    } else if (date1.getTime() < date2.getTime()) {
                        result = false;
                    } else {
                        result = false;
                    }
                    return result;
                }



                $scope.getTimeSlotsByEveryType = function (typeid) {
                    console.log(typeid);
                    typeid = parseFloat(typeid) || 0;

                    $scope.ScheduledDateArray = [];

                    $scope.currentDate = new Date();
                    $scope.addUpdateScheduleObj.showDaySelection = false;
                    $scope.addUpdateScheduleObj.IsAlternateDaysSelected = false;
                    if (typeid === 1) {
                        $scope.ScheduledDateArray = getAllWeekDates();
                    }
                    else if (typeid === 2) {

                        $scope.ScheduledDateArray = [];
                        var array = getAllWeekDates();

                        console.log(array);
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 2 || sditem.WeekNumber === 4) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }

                    }
                    else if (typeid === 3) {
                        $scope.ScheduledDateArray = [];
                        var array = getAllWeekDates();
                        console.log(array);
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 1 || sditem.WeekNumber === 3 || sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 4) {
                        $scope.ScheduledDateArray = [];



                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 1) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 5) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 2) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 6) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 3) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 7) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 4) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 8) {
                        $scope.ScheduledDateArray = [];

                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 9) {
                        $scope.ScheduledDateArray = [];

                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });

                            if ($scope.ScheduledDateArray.length === 0) {
                                angular.forEach(array, function (sditem) {
                                    if (sditem.WeekNumber === 4) {
                                        $scope.ScheduledDateArray.push(sditem);
                                    }
                                });
                            }
                        }
                    }
                    else {
                        //if (typeid != "" && typeid != 0) {
                        //    $scope.addUpdateScheduleObj.showDaySelection = true;
                        //}
                    }
                    console.log($scope.ScheduledDateArray);

                    $scope.filteredArray = $filter('orderBy')($scope.ScheduledDateArray, 'Date', false)
                    console.log($scope.filteredArray);

                }

                $scope.OnChangeslot = function (val) {
                    if ($scope.addUpdateScheduleObj.showDaySelection) {
                        //var strtpe = parseInt($scope.addUpdateScheduleObj.ScheduleEveryType);

                        var checkedMonthArray = _.where($scope.RepeatMonth, { isChecked: true }) || [];

                        $scope.ScheduledDateArray = [];
                        $scope.addUpdateScheduleObj.ScheduleDuration = $scope.addUpdateScheduleObj.ScheduleDuration || "";
                        if ($scope.addUpdateScheduleObj.ScheduleDuration == '') {
                            $scope.filteredArray = [];
                            return false;
                        }

                        if (checkedMonthArray.length == 0) {
                            $scope.filteredArray = [];
                            return false;
                        }

                        angular.forEach(checkedMonthArray, function (mitem) {
                            var strtpe = mitem.Id;
                            if (strtpe === 14) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesByLastweekWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            } else if (strtpe === 10) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesByDayWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            } else if (strtpe === 11) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesBysecondweekWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            } else if (strtpe === 12) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesByThirdweekWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            } else if (strtpe === 13) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesByFourthweekWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            }
                            else if (strtpe === 15) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesByFifthweekWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            }

                        });

                        $scope.ScheduledDateArray = _.uniq($scope.ScheduledDateArray, false, function (p) { return p.Date; });

                        $scope.filteredArray = $filter('orderBy')($scope.ScheduledDateArray, 'Date', false);
                        console.log($scope.filteredArray);
                    } else {

                        console.log($scope.addUpdateScheduleObj.ScheduleEveryType)
                        if ($scope.addUpdateScheduleObj.ScheduleEveryType == "10") {


                            var startdateselected = false;


                            var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                            if (checkedArray.length > 0) {

                                angular.forEach(checkedArray, function (citem) {
                                    if (citem.StartDate!=="") {
                                        startdateselected = true;
                                    }
                                });

                                if (startdateselected) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getAlternateDatesByDayWise(citem.WeekId, citem.StartDate);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                } else {
                                    alertify.error("Please Select Alternate StartDate");
                                    $scope.addUpdateScheduleObj.ScheduleDuration = "";
                                    return false;
                                }


                            }


                            $scope.ScheduledDateArray = _.uniq($scope.ScheduledDateArray, false, function (p) { return p.Date; });

                            $scope.filteredArray = $filter('orderBy')($scope.ScheduledDateArray, 'Date', false);
                            console.log($scope.filteredArray);

                        } else {
                            $scope.getTimeSlotsByEveryType(val);
                        }

                    }

                }

                //$scope.OnChangeslot = function (val) {
                //    if ($scope.addUpdateScheduleObj.showDaySelection) {
                //        var strtpe = parseInt($scope.addUpdateScheduleObj.ScheduleEveryType);

                //        if (strtpe === 14) {
                //            $scope.ScheduledDateArray = getDatesByLastweekWise($scope.addUpdateScheduleObj.ScheduleMonthEveryType);
                //        } else if (strtpe === 10) {
                //            $scope.ScheduledDateArray = getDatesByDayWise($scope.addUpdateScheduleObj.ScheduleMonthEveryType);
                //        } else if (strtpe === 11) {
                //            $scope.ScheduledDateArray = getDatesBysecondweekWise($scope.addUpdateScheduleObj.ScheduleMonthEveryType);
                //        } else if (strtpe === 12) {
                //            $scope.ScheduledDateArray = getDatesByThirdweekWise($scope.addUpdateScheduleObj.ScheduleMonthEveryType);
                //        } else if (strtpe === 13) {
                //            $scope.ScheduledDateArray = getDatesByFourthweekWise($scope.addUpdateScheduleObj.ScheduleMonthEveryType);
                //        }

                //        $scope.filteredArray = $filter('orderBy')($scope.ScheduledDateArray, 'Date', false);
                //        console.log($scope.filteredArray);
                //    } else {
                //        $scope.getTimeSlotsByEveryType(val);
                //    }

                //}

                $scope.changeType = function (type) {
                    console.log(type);
                    $scope.addUpdateScheduleObj.Type = type;
                    $scope.calendarSelectedSlots = [];
                };



                $scope.clearDayData = function (obj) {
                    obj.StartTime = "";
                    obj.EndTime = "";
                    obj.BranchObj = "";
                    obj.MaximumOverAllSlots = "";
                    obj.BranchId = null;
                    obj.UserBranchId = null;
                };



                $scope.closeuib = function () {
                    $uibModalInstance.dismiss("cancel");
                };


                $scope.calendarSelectedSlots = [];

                $scope.addmoreDatesinCustom = function () {

                    var selectedDatesArray = $filter("filter")($scope.MainTimerArray, { "IsSelectedDate": true });
                    selectedDatesArray = selectedDatesArray || [];
                    if (selectedDatesArray.length === 0) {
                        alertify.error("Select Dates");
                        return false;
                    } else {
                        angular.forEach(selectedDatesArray, function (sitem) {
                            var obj = {
                                "UserDaySlotId": 0,
                                "BranchId": null,
                                "Week": sitem.Week,
                                "UserBranchId": null,
                                "DayId": null,
                                "Day": sitem.Day || '',
                                "SlotDate": sitem.FullDate || "",
                                "DeleteInd": "N"
                            }
                            $scope.calendarSelectedSlots.push(obj);
                        });
                    }

                    console.log($scope.calendarSelectedSlots);

                    angular.forEach($scope.MainTimerArray, function (aitem) {
                        aitem.IsSelectedDate = false;
                    });

                    $scope.weekitems.checkitem1 = "N";
                    $scope.weekitems.checkitem2 = "N";
                    $scope.weekitems.checkitem3 = "N";
                    $scope.weekitems.checkitem4 = "N";
                    $scope.weekitems.checkitem5 = "N";
                    $scope.weekitems.checkitem6 = "N";
                }

                $scope.SaveSelectedScheduleToCalendar = function () {

                    if (mainitem.ConnectedUserId !== 0) {
                        if ($scope.connectedUsersObj.UsersList.length > 0) {
                            if ($scope.addUpdateScheduleObj.DoctorId === 0) {
                                alertify.error("Please Select a User");
                                return false;
                            }
                        }
                    }

                    if ($scope.addUpdateScheduleObj.UserScheduleId === 0) {
                        alertify.error("Please Select a Schedule");
                        return false;
                    }
                    if ($scope.addUpdateScheduleObj.Type == 'Custom') {
                        //var selectedDatesArray = $filter("filter")($scope.MainTimerArray, { "IsSelectedDate": true });
                        //selectedDatesArray = selectedDatesArray || [];
                        //if (selectedDatesArray.length === 0) {
                        //    alertify.error("Select Dates");
                        //    return false;
                        //} else {
                        //    angular.forEach(selectedDatesArray, function (sitem) {
                        //        var obj = {
                        //            "UserDaySlotId": 0,
                        //            "BranchId": null,
                        //            "UserBranchId": null,
                        //            "DayId": null,
                        //            "Day": sitem.Day || '',
                        //            "SlotDate": sitem.FullDate || "",
                        //            "DeleteInd": "N"
                        //        }
                        //        $scope.addUpdateScheduleObj.UserDaySlots.push(obj);
                        //    });
                        //}

                        if ($scope.calendarSelectedSlots.length === 0) {
                            alertify.error("Please select dates from the Calendar");
                            return false;
                        }
                        $scope.addUpdateScheduleObj.UserDaySlots = $scope.calendarSelectedSlots || []

                    }


                    if ($scope.addUpdateScheduleObj.Type == 'Duration') {
                        $scope.addUpdateScheduleObj.ScheduleDuration = $scope.addUpdateScheduleObj.ScheduleDuration || null;
                        $scope.addUpdateScheduleObj.FromDate = null;
                        $scope.addUpdateScheduleObj.ToDate = null;
                        $scope.addUpdateScheduleObj.ScheduleEveryType = $scope.addUpdateScheduleObj.ScheduleEveryType || "";
                        if ($scope.addUpdateScheduleObj.ScheduleMonthorWeekType == 1) {
                            if ($scope.addUpdateScheduleObj.ScheduleEveryType == "") {
                                alertify.error("Please Select Week");
                                return false;
                            }
                        } else if ($scope.addUpdateScheduleObj.ScheduleMonthorWeekType == 2) {
                            var checkedMonthArray = _.where($scope.RepeatMonth, { isChecked: true }) || [];
                            if (checkedMonthArray.length == 0) {
                                alertify.error("Please Select Repeat");
                                return false;
                            }

                            var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                            if (checkedArray.length == 0) {
                                alertify.error("Please Select Day");
                                return false;
                            }

                            var SelectedMonthType = _.pluck(checkedMonthArray, "Id").join(",");
                            $scope.addUpdateScheduleObj.ScheduleMonthMultiEveryType = SelectedMonthType || "";
                        }

                        /* if ($scope.addUpdateScheduleObj.ScheduleEveryType == "10" || $scope.addUpdateScheduleObj.ScheduleEveryType == "11" || $scope.addUpdateScheduleObj.ScheduleEveryType == "12" ||
                             $scope.addUpdateScheduleObj.ScheduleEveryType == "13" || $scope.addUpdateScheduleObj.ScheduleEveryType == "14") {
                             var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                             if (checkedArray.length == 0) {
                                 alertify.error("Please Select Day");
                                 return false;
                             }
                         }*/

                        if ($scope.addUpdateScheduleObj.ScheduleDuration == null) {
                            alertify.error("Please Enter Duration");
                            return false;
                        }

                        $scope.addUpdateScheduleObj.UserDaySlots = [];
                        if ($scope.ScheduledDateArray.length > 0) {
                            angular.forEach($scope.ScheduledDateArray, function (Aitem) {
                                var obj = {
                                    "UserDaySlotId": 0,
                                    "BranchId": null,
                                    "UserBranchId": null,
                                    "DayId": null,
                                    "Day": Aitem.Day || '',
                                    "SlotDate": Aitem.Date || "",
                                    "DeleteInd": "N"
                                }
                                $scope.addUpdateScheduleObj.UserDaySlots.push(obj);
                            });
                        }
                    }
                    if ($scope.addUpdateScheduleObj.Type == 'Date') {
                        $scope.addUpdateScheduleObj.FromDate = $scope.addUpdateScheduleObj.FromDate || null;
                        $scope.addUpdateScheduleObj.ToDate = $scope.addUpdateScheduleObj.ToDate || null;
                        if ($scope.addUpdateScheduleObj.FromDate == null) {
                            alertify.error("Please Select From Date");
                            return false;
                        }
                        if ($scope.addUpdateScheduleObj.ToDate == null) {
                            alertify.error("Please Select To Date");
                            return false;
                        }
                        var currentDate = new Date($scope.addUpdateScheduleObj.FromDate);
                        var ToDateDate = new Date($scope.addUpdateScheduleObj.ToDate);
                        $scope.addUpdateScheduleObj.UserDaySlots = [];
                        $scope.addUpdateScheduleObj.ScheduleDuration = null;
                        for (var d = currentDate; d <= ToDateDate; d.setDate(d.getDate() + 1)) {
                            // datesArray.push(new Date(d));
                            var date = new Date(d);
                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                            var obj = {
                                "UserDaySlotId": 0,
                                "BranchId": null,
                                "UserBranchId": null,
                                "DayId": null,
                                "Day": day || '',
                                "SlotDate": $scope.DisplayDate || "",
                                "DeleteInd": "N"
                            }
                            $scope.addUpdateScheduleObj.UserDaySlots.push(obj);
                        }
                    }
                    if ($scope.addUpdateScheduleObj.UserDaySlots.length > 0) {
                        angular.forEach($scope.addUpdateScheduleObj.UserDaySlots, function (Aitem) {

                            $scope.addUpdateScheduleObj.FromDate = $scope.addUpdateScheduleObj.UserDaySlots[0].SlotDate;
                            $scope.addUpdateScheduleObj.ToDate = $scope.addUpdateScheduleObj.UserDaySlots[$scope.addUpdateScheduleObj.UserDaySlots.length - 1].SlotDate;

                            var list1 = $filter("filter")($scope.addUpdateScheduleObj.UserScheduleDetails, function (kitem, index) { return kitem.Day == Aitem.Day });

                            if (list1.length > 0) {
                                Aitem.Day = list1[0].Day;
                                Aitem.DayId = list1[0].DayId;
                                Aitem.UserBranchId = list1[0].UserBranchId;
                                Aitem.BranchId = list1[0].BranchId;
                            }
                        });
                    }





                    $scope.UsertempTimeSlotsArray = [];

                    if ($scope.addUpdateScheduleObj.Type == 'Duration') {
                        $scope.addUpdateScheduleObj.ScheduleDuration = $scope.addUpdateScheduleObj.ScheduleDuration || null;

                        if ($scope.addUpdateScheduleObj.ScheduleDuration == null) {
                            alertify.error("Please Enter Duration");
                            return false;
                        }
                        var currentDate = new Date();
                        var oneMonthLater = new Date();
                        $scope.addUpdateScheduleObj.ScheduleDuration = parseInt($scope.addUpdateScheduleObj.ScheduleDuration);
                        oneMonthLater.setMonth(currentDate.getMonth() + $scope.addUpdateScheduleObj.ScheduleDuration);

                        $scope.UsertempTimeSlotsArray = [];
                        if ($scope.ScheduledDateArray.length > 0) {
                            angular.forEach($scope.ScheduledDateArray, function (Btem) {
                                var obj = {
                                    "Date": Btem.Date,
                                    "Day": Btem.Day,
                                    "StartTime": "",
                                    "EndTime": "",

                                }
                                $scope.UsertempTimeSlotsArray.push(obj);
                            });
                        }
                    }
                    if ($scope.addUpdateScheduleObj.Type == 'Date') {
                        $scope.addUpdateScheduleObj.FromDate = $scope.addUpdateScheduleObj.FromDate || null;
                        $scope.addUpdateScheduleObj.ToDate = $scope.addUpdateScheduleObj.ToDate || null;
                        if ($scope.addUpdateScheduleObj.FromDate == null) {
                            alertify.error("Please Select From Date");
                            return false;
                        }
                        if ($scope.addUpdateScheduleObj.ToDate == null) {
                            alertify.error("Please Select To Date");
                            return false;
                        }
                        var currentDate = new Date($scope.addUpdateScheduleObj.FromDate);
                        var ToDateDate = new Date($scope.addUpdateScheduleObj.ToDate);
                        $scope.addUpdateScheduleObj.ScheduleDuration = null;
                        $scope.UsertempTimeSlotsArray = [];
                        for (var d = currentDate; d <= ToDateDate; d.setDate(d.getDate() + 1)) {
                            // datesArray.push(new Date(d));
                            var date = new Date(d);
                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                            var obj = {
                                "Date": $scope.DisplayDate,
                                "Day": day,
                                "StartTime": "",
                                "EndTime": "",

                            }
                            $scope.UsertempTimeSlotsArray.push(obj);
                        }
                    }

                    $scope.TimeSlotsArray = [];
                    if ($scope.UsertempTimeSlotsArray.length > 0) {
                        angular.forEach($scope.UsertempTimeSlotsArray, function (Aitem) {
                            var list1 = $filter("filter")($scope.addUpdateScheduleObj.UserScheduleDetails, function (kitem, index) { return kitem.Day == Aitem.Day });

                            if (list1.length > 0) {
                                var Breakobj = {
                                    "BranchId": list1[0].BranchId,
                                    "Date": Aitem.Date || "",
                                    "StartTime": list1[0].StartTime,
                                    "EndTime": list1[0].EndTime,

                                }
                                $scope.TimeSlotsArray.push(Breakobj);
                            }
                        });
                    }

                    var params = {
                        "UserId": $scope.MainUserObj.BasicInfo.UserId,
                        "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "TimeSlotsArray": $scope.TimeSlotsArray || [],
                    };


                    eHnoteMainAdminServices.CheckIsUserSlotAvailNew(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
                    function callbackgetuserbranchSuccess(resp) {
                        console.log(JSON.stringify(resp));
                        if (resp.isUserSlotAvailable) {
                            $scope.continuetoSaveScheduletoCalendar($scope.addUpdateScheduleObj);
                        } else {
                            //  alertify.error(resp.Message);
                            var r = alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20' > Previous slots will be updated with new information, Do you want to continue?</h4> ",
                                function () {
                                    $scope.continuetoSaveScheduletoCalendar($scope.addUpdateScheduleObj);
                                }, function () {
                                    return false;
                                });
                        }

                    }
                    function callbackgetuserbranchError(err) {
                        alertify.error("Some Error Occured");
                    }






                }


                $scope.continuetoSaveScheduletoCalendar = function () {

                    var params = {
                        "UserId": $scope.addUpdateScheduleObj.UserId,
                        "DoctorId": $scope.addUpdateScheduleObj.DoctorId,
                        "BranchId": $scope.addUpdateScheduleObj.BranchId,
                        "Type": $scope.addUpdateScheduleObj.Type || "Duration",
                        "FromDate": $scope.addUpdateScheduleObj.FromDate || null,
                        "ToDate": $scope.addUpdateScheduleObj.ToDate || null,
                        "ScheduleDate": $filter("date")(new Date($scope.addUpdateScheduleObj.ScheduleDate), "yyyy-MM-dd"),
                        "ScheduleDuration": $scope.addUpdateScheduleObj.ScheduleDuration || "",
                        "ScheduleDurationType": $scope.addUpdateScheduleObj.ScheduleDurationType || "",
                        "UserScheduleId": $scope.addUpdateScheduleObj.UserScheduleId || 0,
                        "DeleteInd": "N",
                        "UserDaySlots": $scope.addUpdateScheduleObj.UserDaySlots || [],
                        "UserDayBreakSlots": $scope.addUpdateScheduleObj.UserDayBreakSlots || [],
                        "ScheduleEveryType": $scope.addUpdateScheduleObj.ScheduleEveryType,
                        "UserScheduleName": $scope.addUpdateScheduleObj.UserScheduleName,
                        "ScheduleMonthorWeekType": $scope.addUpdateScheduleObj.ScheduleMonthorWeekType,
                        "ScheduleMonthMultiEveryType": $scope.addUpdateScheduleObj.ScheduleMonthMultiEveryType
                    }



                    eHnoteMainAdminServices.AddupdateSlotCalendarSchedule(params, callbackuserbranchSuccess, callbackuserbranchError);
                    function callbackuserbranchSuccess(resp) {
                        console.log(resp);
                        if (resp.status === "Success") {
                            alertify.success("Time Slots Added Successfully");
                            $scope.GetUserScheduledSlots();
                            $scope.AdminScheduleObj.IsShowEditSchedule = false;
                            $scope.AdminScheduleObj.ShowNewAddSchedule = false;
                            $scope.closeuib();
                        }
                    }
                    function callbackuserbranchError(err) {
                        alertify.error("Some Error Occured");
                    }
                }


                $scope.onSelectAlternateWeekDays = function () {
                    var checkedArray = _.where($scope.daysofweek, { isChecked: true });

                    $scope.addUpdateScheduleObj.IsAlternateDaysSelected = false;
                    if (checkedArray.length == 0) {
                        $scope.SearchWeekobj.selecteditem = "Select";
                        $scope.addUpdateScheduleObj.IsAlternateDaysSelected = false;
                    } else if (checkedArray.length == 1) {
                        $scope.SearchWeekobj.selecteditem = checkedArray[0].WeekDay;
                        $scope.addUpdateScheduleObj.IsAlternateDaysSelected = true;
                    } else if ($scope.daysofweek.length == checkedArray.length) {
                        $scope.SearchWeekobj.selecteditem = "All";
                        $scope.addUpdateScheduleObj.IsAlternateDaysSelected = true;
                    } else {
                        $scope.SearchWeekobj.selecteditem = "Selected";
                        $scope.addUpdateScheduleObj.IsAlternateDaysSelected = true;
                    }

                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    angular.forEach($scope.daysofweek, function (ditem) {
                        ditem.StartDate = "";
                    });
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";
                }

                $scope.changeWeekDayDate = function () {
                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";
                }

                //dayofweek multiple
                $scope.onselectedDaysofweek = function () {
                    var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                    if (checkedArray.length == 0) {
                        $scope.SearchWeekobj.selecteditem = "Select";
                    } else if (checkedArray.length == 1) {
                        $scope.SearchWeekobj.selecteditem = checkedArray[0].WeekDay;
                    } else if ($scope.daysofweek.length == checkedArray.length) {
                        $scope.SearchWeekobj.selecteditem = "All";
                    } else {
                        $scope.SearchWeekobj.selecteditem = "Selected";
                    }

                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";
                }

                $scope.OnClickRepeatMonth = function () {
                    var checkedArray = _.where($scope.RepeatMonth, { isChecked: true });
                    if (checkedArray.length == 0) {
                        $scope.SelectedMonthobj.Selecteditem = "Select";
                        $scope.addUpdateScheduleObj.showDaySelection = false;

                    } else if (checkedArray.length == 1) {
                        $scope.SelectedMonthobj.Selecteditem = checkedArray[0].Name;
                        $scope.addUpdateScheduleObj.showDaySelection = true;

                    } else if ($scope.RepeatMonth.length == checkedArray.length) {
                        $scope.SelectedMonthobj.Selecteditem = "All";
                        $scope.addUpdateScheduleObj.showDaySelection = true;

                    } else {
                        $scope.SelectedMonthobj.Selecteditem = "Selected";
                        $scope.addUpdateScheduleObj.showDaySelection = true;
                    }

                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";
                }
                $scope.ChangeScheduleMonthorWeek = function (Id) {
                    angular.forEach($scope.RepeatMonth, function (ritem) {
                        ritem.isChecked = false;
                    });
                    $scope.addUpdateScheduleObj.showDaySelection = false;
                    $scope.SelectedMonthobj.Selecteditem = "Select";

                    $scope.addUpdateScheduleObj.ScheduleEveryType = "";
                    angular.forEach($scope.daysofweek, function (ritem) {
                        ritem.isChecked = false;
                    });
                    $scope.SearchWeekobj.selecteditem = "Select";
                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";

                    if ($scope.addUpdateScheduleObj.ScheduleMonthorWeekType == 2) {
                        $scope.addUpdateScheduleObj.IsAlternateDaysSelected = false;
                    }
                }

            }
        });
    };


    $scope.connectScheduleFromList = function (item) {
        $scope.connectSchedules(item.UserScheduleId, 0);
    };

    $scope.connectSchedulesForConnectedUsers = function () {

        $scope.connectSchedules(0, $scope.MainUserObj.BasicInfo.UserId);
    }
    $scope.ClearHolidaysinputtext = function (addLeaveObj) {
        if (addLeaveObj) {
            addLeaveObj.LeaveStartDate = "";
            addLeaveObj.LeaveEndDate = "";
            addLeaveObj.LeaveRemarks = "";
            $scope.getNewUserLeaveReqObj.OrganizationId = 0;
            $scope.getNewUserLeaveReqObj.IsLeaveForAllBranches = false;
            /* HolidaysParams.EnableUpdate = false;*/
            angular.forEach($scope.UserWorkingBranchArrays, function (mitem) {
                mitem.IsChecked = true;
            });

            $scope.LocationTypeObj.SelectLocationString = "All Locations";
        }

    };
    $scope.ActiveStatusArray = [{ "Id": 0, "Name": "ALL " },{ "Id": 1, "Name": "Active " }, { "Id": 2, "Name": "InActive" }];
    $scope.Search = {
        "IsExpired": 1
    };
    $scope.isDateActive = function (leavedate) {

        var result = false;
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        var eventDate = new Date(leavedate);
        eventDate.setHours(0, 0, 0, 0);

        /*    console.log(currentDate + "__" + eventDate);*/

        if (currentDate <= eventDate) {
            result = true;
        }
        return result;
    };




    $scope.filterLeavesMain = function (selectedYear, selectedStatus) {


        $scope.currentdate = new Date();
        $scope.currentyear = $scope.currentdate.getFullYear();
        $scope.selectedYear = selectedYear || $scope.currentyear;
        $scope.selectedStatus = selectedStatus || 0;


        var filteredLeaves = angular.copy($scope.UserLeavesArrayList);

        var filteredLeaves = $scope.UserLeavesArrayList.filter(function (item) {
            var year = new Date(item.LeaveDate).getFullYear();
            console.log(year + "" + $scope.selectedYear);
            return year ===  parseInt($scope.selectedYear);
        });
        $scope.filteredLeavesArray = [];


        var filterleavelist = [];


        if (selectedStatus === 1) {
            angular.forEach(filteredLeaves, function (ulitem) {
                var leaveDate = new Date(ulitem.LeaveDate);
                var currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                if (leaveDate >= currentDate) {
                    filterleavelist.push(ulitem);
                }
            });
            $scope.Cpyfilterarray = filterleavelist;
            $scope.filteredLeavesArray = $scope.Cpyfilterarray || [];
        }
        else if (selectedStatus === 2) {
            angular.forEach(filteredLeaves, function (ulitem) {
                var leaveDate = new Date(ulitem.LeaveDate);
                var currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                if (leaveDate < currentDate) {
                    filterleavelist.push(ulitem);
                }
            });
            $scope.Cpyfilterarray = filterleavelist;
            $scope.filteredLeavesArray = $scope.Cpyfilterarray || [];
        }
        else {
            $scope.Cpyfilterarray = angular.copy(filteredLeaves);
            $scope.filteredLeavesArray = $scope.Cpyfilterarray || [];
        }
    };
    $scope.getUniqueYears = function () {
        var years = [];
        angular.forEach($scope.UserLeavesArrayList, function (item) {
            var year = new Date(item.LeaveDate).getFullYear();
            if (years.indexOf(year) === -1) {
                years.push(year);
            }
        });
        return years;
    };







    $scope.ShowAllDays = function (sitem) {
        sitem.IsShowAllDays = !sitem.IsShowAllDays;
    };
    $scope.EnabelDsableAccessRightsClick = function (type) {
        if (type == 'Active') {
            $scope.EmergencyAccessRightList.EmergencyAccessRightsActiveInd = 'Active';
        }
        if (type == 'InActive') {
            $scope.EmergencyAccessRightList.EmergencyAccessRightsActiveInd = 'InActive';
        }
    }
    $scope.selectEmergencyAllRightsStatus = true;

    $scope.selectEmergencyAllRights = function () {
        $scope.selectEmergencyAllRightsStatus = false;
        $scope.EmergencydefaultTabArray = [];
        angular.forEach($scope.EmergencyUserAccessRights, function (item) {
            item.ActiveInd = 'Y';
            item.isAllCategoryItemsSelected = true;
            item.isSubAccessCategorySelected = true;
            angular.forEach(item.AccessList, function (subitem) {
                subitem.ActiveInd = 'Y';
            });

            var filetredArray = $filter("filter")($scope.EmergencydefaultTabArray, { "TabId": item.MainAccessCategoryId }, true);
            if ($scope.defaultTabArray.length === 0 || filetredArray.length === 0) {
                var obj = {
                    "TabId": item.MainAccessCategoryId,
                    "TabName": item.MainAccessCategoryName,
                    "SubTabId": item.SubAccessCategoryId
                }
                $scope.EmergencydefaultTabArray.push(obj)
            }
        });
        $scope.mainEmergencyDefaultTabArray = [];
        angular.forEach($scope.EmergencydefaultTabArray, function (citem) {
            var obj = {
                "TabId": citem.TabId,
                "TabName": citem.TabName
            }
            var mainfilteredArray = $filter("filter")($scope.EmergencydefaultTabArray, { "TabId": citem.TabId }, true);
            console.log(mainfilteredArray);
            if (mainfilteredArray.length <= 1) {
                $scope.mainEmergencyDefaultTabArray.push(obj);
            }
        });
    };
    $scope.deselectEmergencyAllRights = function () {
        $scope.selectEmergencyAllRightsStatus = true;

        angular.forEach($scope.EmergencyUserAccessRights, function (item) {
            item.ActiveInd = 'N';
            item.isAllCategoryItemsSelected = false;
            item.isSubAccessCategorySelected = false;
            angular.forEach(item.AccessList, function (subitem) {
                subitem.ActiveInd = 'N';
            });
        });

        $scope.mainEmergencyDefaultTabArray = [];

    };
    $scope.resetEmergencyRoleItems = function () {
        $scope.newUserBranchRoleObj = getnewUserBranchRoleObj();
        $scope.EmergencyUserAccessRights = [];
        $scope.selectEmergencyAllRightsStatus = true;
        $scope.EmergencyUserAccessRights = angular.copy($scope.parentAccessRightsList);

    };
    $scope.updateEmergencyBranchRolenRights = function (item) {


        $scope.newUserBranchRoleObj = getnewUserBranchRoleObj();

        $scope.EmergencyUserAccessRights = angular.copy($scope.parentAccessRightsList);

        var filteresBranchArray = $filter("filter")($scope.UserBranchSubAccessCategories, { "UserBranchId": item.UserBranchId }, true);
        $scope.selectEmergencyAllRightsStatus = true;


        var SubAccessList = [];
        SubAccessList = filteresBranchArray[0].SubAccessCategories;

        $scope.EmergencydefaultTabArray = [];
        angular.forEach($scope.EmergencyUserAccessRights, function (kitem) {
            kitem.isSubAccessCategorySelected = true;
            kitem.UserBranchSubAccessCategoryId = 0;
            angular.forEach(SubAccessList, function (fitem) {
                if (fitem.SubAccessCategoryId === kitem.SubAccessCategoryId) {
                    kitem.isSubAccessCategorySelected = true;
                }
            });
        });

        angular.forEach($scope.EmergencyUserAccessRights, function (litem) {
            if (litem.isSubAccessCategorySelected) {
                angular.forEach(litem.AccessList, function (sitem) {
                    angular.forEach(item.AccessRights, function (mitem) {
                        if (sitem.AccessRightId == mitem.AccessRightId) {
                            sitem.ActiveInd = 'Y';
                            sitem.UserBranchAccessRightId = mitem.UserBranchAccessRightId;
                        }
                    });
                });
            }
        });

        angular.forEach($scope.EmergencyUserAccessRights, function (atem) {
            var list = $filter("filter")(atem.AccessList, { "ActiveInd": 'N' }, true);
            if (list.length === 0) {
                atem.isAllCategoryItemsSelected = true;
            }
            var activelist = $filter("filter")(atem.AccessList, { "ActiveInd": 'Y' }, true);
            if (activelist.length > 0) {
                var filetredArray = $filter("filter")($scope.EmergencydefaultTabArray, { "TabId": atem.MainAccessCategoryId }, true);
                if ($scope.EmergencydefaultTabArray.length === 0 || filetredArray.length === 0) {
                    var obj = {
                        "TabId": atem.MainAccessCategoryId,
                        "TabName": atem.MainAccessCategoryName,
                        "SubTabId": atem.SubAccessCategoryId
                    }
                    $scope.EmergencydefaultTabArray.push(obj)
                }
            }

        });



        $scope.mainEmergencyDefaultTabArray = [];
        angular.forEach($scope.EmergencydefaultTabArray, function (citem) {
            var obj = {
                "TabId": citem.TabId,
                "TabName": citem.TabName
            }
            var mainfilteredArray = $filter("filter")($scope.EmergencydefaultTabArray, { "TabId": citem.TabId }, true);
            console.log(mainfilteredArray);
            if (mainfilteredArray.length <= 1) {
                $scope.mainEmergencyDefaultTabArray.push(obj);
            }
        });
        if ($scope.newUserBasicInfoObj.UserRoleId === 18) {
            $scope.mainEmergencyDefaultTabArray = $scope.mainEmergencyDefaultTabArray.filter((x) => x.TabId !== 2);
        }

        $scope.newUserBranchRoleObj.DefaultTabId = item.DefaultTabId || "";


        var editBranch = $filter("filter")($scope.MainUserObj.BasicInfo.UserWorkingBranches, { "BranchId": item.BranchId }, true);

        if (editBranch.length > 0) {
            $scope.newUserBranchRoleObj.BranchObj = editBranch[0];
            $scope.newUserBranchRoleObj.BranchId = editBranch[0].BranchId;
            $scope.newUserBranchRoleObj.UserBranchId = editBranch[0].UserBranchId;
            $scope.newUserBranchRoleObj.BranchName = editBranch[0].BranchName;
            $scope.newUserBranchRoleObj.UserBranchRoleId = editBranch[0].UserBranchRoleId;
        }
        $scope.showEmergencyAccessRightsList = false;
    };
    $scope.SubactiveMenu = 'BranchUserList';
    $scope.SubTabClick = function (type) {
      
        if (type == 1) {
            $scope.SubactiveMenu = 'BranchUserList';
        } else if (type == 2) {
            $scope.SubactiveMenu = 'AccesssList';
            $scope.getAllUserslistforEmergencyReport();
            $scope.GetEmergencAccessList();
        }
        else {
            console.log('checking');
        }
        $scope.showEmergencyAccessRightsList = true;
        $scope.AdminEmergencyAccessShowInd.IsEmergencyAccessTabActive = true;
        $scope.NavtoEmergencyAccess();
    }
    $scope.SearchEmergencyAccessFromUserTitle = "Select Users";
    $scope.SearchEmergencyAccessToUserTitle = "Select Users";
    $scope.EmergencyAccessToggleFromUser = function () {
        var checkedArray = _.where($scope.EmergencyAccessAllFromUserList, { isChecked: true });
        $scope.EmergencyAccessReportObj.AllFromUsersCheck = checkedArray.length > 0 && $scope.EmergencyAccessAllFromUserList.length === checkedArray.length ? true : false;
        if (checkedArray.length == 0) {
            $scope.SearchEmergencyAccessFromUserTitle = "Select Users";
        } else {
            if (checkedArray.length === 1) {
                $scope.SearchEmergencyAccessFromUserTitle = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.SearchEmergencyAccessFromUserTitle = "Selected Users";
            }
        }
    }
    $scope.EmergencyAccessToggleToUser = function () {
        var checkedArray = _.where($scope.EmergencyAccessAllToUserList, { isChecked: true });
        $scope.EmergencyAccessReportObj.AllFromUsersCheck = checkedArray.length > 0 && $scope.EmergencyAccessAllToUserList.length === checkedArray.length ? true : false;
        if (checkedArray.length == 0) {
            $scope.SearchEmergencyAccessToUserTitle = "Select Users";
        } else {
            if (checkedArray.length === 1) {
                $scope.SearchEmergencyAccessToUserTitle = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.SearchEmergencyAccessToUserTitle = "Selected Users";
            }
        }
    }
    $scope.EmergencyAllFromUsersSelect = function (val) {
        if (val) {
            angular.forEach($scope.EmergencyAccessAllFromUserList, function (item) {
                item.isChecked = true;
            });

            $scope.SearchEmergencyAccessFromUserTitle = 'All';
        } else {
            angular.forEach($scope.EmergencyAccessAllFromUserList, function (item) {
                item.isChecked = false;
            });
            $scope.SearchEmergencyAccessFromUserTitle = 'Select Users';
        }
        var checkedArray = _.where($scope.EmergencyAccessAllFromUserList, { isChecked: true });
        $scope.EmergencyAccessReportObj.AllFromUsersCheck = checkedArray.length > 0 && $scope.EmergencyAccessAllFromUserList.length === checkedArray.length ? true : false;
    }
   
    $scope.EmergencyAllToUsersSelect = function (val) {
        if (val) {
            angular.forEach($scope.EmergencyAccessAllToUserList, function (item) {
                item.isChecked = true;
            });

            $scope.SearchEmergencyAccessToUserTitle = 'All';
        } else {
            angular.forEach($scope.EmergencyAccessAllToUserList, function (item) {
                item.isChecked = false;
            });
            $scope.SearchEmergencyAccessToUserTitle = 'Select Users';
        }
        var checkedArray = _.where($scope.EmergencyAccessAllToUserList, { isChecked: true });
        $scope.EmergencyAccessReportObj.AllToUsersCheck = checkedArray.length > 0 && $scope.EmergencyAccessAllToUserList.length === checkedArray.length ? true : false;
    }
    $scope.EmergencyAccessRightsReportList = [];
    $scope.GetEmergencAccessList = function () {
        var FromUserIdlist = "";
        for (var i in $scope.EmergencyAccessAllToUserList) {
            if ($scope.EmergencyAccessAllToUserList[i].isChecked) {
                FromUserIdlist += "," + $scope.EmergencyAccessAllToUserList[i].DoctorID;
            }
        }
        if (FromUserIdlist.charAt(0) === ",") {
            FromUserIdlist = FromUserIdlist.slice(1);
        }
        var ToUserIdlist = "";
        for (var i in $scope.EmergencyAccessAllToUserList) {
            if ($scope.EmergencyAccessAllToUserList[i].isChecked) {
                ToUserIdlist += "," + $scope.EmergencyAccessAllToUserList[i].DoctorID;
            }
        }
        if (ToUserIdlist.charAt(0) === ",") {
            ToUserIdlist = ToUserIdlist.slice(1);
        }
        var obj = {
            "Date": $scope.EmergencyAccessReportObj.Date||"",
            "EmergencyAccessFromUser": FromUserIdlist||"",
            "EmergencyAccessToUser": ToUserIdlist || "",
            "BranchId": hospitalId||"",
        }
        eHnoteMainAdminServices.GetEmergencyAccessListByIds(obj).then(function (resp) {
            console.log(resp.data);
            if (resp.data.rows.length > 0) {
                $scope.EmergencyAccessRightsReportList = [];
                $scope.EmergencyAccessRightsReportList = resp.data.rows;
                $scope.EmergencyAceesRightsShowReportArray = [];
                if (resp.data.rows.length > 0) {
                    $scope.totalUserBranchEmergencyAccessCount = 0;
                    angular.forEach($scope.EmergencyAccessRightsReportList, function (item) {
                        
                        if (item.AccessRights.length > 0) {
                            var obj = {
                                "BranchName": item.BranchName,
                                "AccessRights": item.AccessRights,
                                "DefaultTabId": item.DefaultTabId,
                                "rightsCount": 16,
                                "IsEmergencyRightActiveInd": item.IsEmergencyRightActiveInd || false,
                                "EmergencyAccessRightsDate": item.EmergencyAccessRightsDate || "",
                                "EmergencyAccessRightsStratTime": item.EmergencyAccessRightsStratTime || "",
                                "EmergencyAccessRightsEndTime": item.EmergencyAccessRightsEndTime || "",
                                "FromUser": item.FromUser || "",
                                "ToUser": item.ToUser || "",

                            };
                            $scope.EmergencyAceesRightsShowReportArray.push(obj);
                        }
                    });
                  
                }
            }
        });
    }
    $scope.resetRoleItemsEmergency = function () {
        $scope.newUserBranchRoleObj = getnewUserBranchRoleObj();
        $scope.EmergencyUserAccessRights = [];
        $scope.showEmergencyAccessRightsList = true;
        $scope.selectEmergencyAllRightsStatus = true;
        $scope.EmergencyUserAccessRights = angular.copy($scope.parentAccessRightsList);
    };
    $scope.NavtoEmergencyAccess = function () {
        if ($scope.activeMenu  == 'EmergencyAccessRights') {
            $scope.AdminEmergencyAccessShowInd.IsEmergencyAccessTabActive = true;
        }
    }
    $scope.NavtoEmergencyAccess();
    $scope.EmergencyTimeSlotsChanging = function (item) {
        $scope.EmergencyAccessRightList.EmergencyAccessRightsEndTime = '';
        $scope.TimeSlotEndValues = [];
        if ($scope.TimeSlotStartValues.length > 0) {
            var count = 0;
            angular.forEach($scope.TimeSlotStartValues, function (titem) {
                if (titem.time == item.EmergencyAccessRightsStratTime) {
                    count++;
                    return;
                }
                if (count > 0) {
                    $scope.TimeSlotEndValues.push(titem);
                }
            })
        }
    }
   
    $scope.changeAppointmentBranch = function (obj, type, screen) {
        if (obj.IsChecked) {
            $scope.LocationTypeObj.SelectLocationString = "Selected";
            if (obj.BranchId === 0) {
                angular.forEach($scope.UserWorkingBranchArrays, function (mitem) {
                    mitem.IsChecked = true;
                });

                $scope.LocationTypeObj.SelectLocationString = "All Locations";
            }
            else {


                if ($scope.UserWorkingBranchArrays.every(mitem => mitem.BranchId === 0 || mitem.IsChecked)) {
                    $scope.UserWorkingBranchArrays.forEach(mitem => {
                        if (mitem.BranchId === 0) {
                            mitem.IsChecked = true;

                            $scope.LocationTypeObj.SelectLocationString = "All Locations";
                        }
                    });
                }

            }

        }
        else {
            if (obj.BranchId === 0) {
                angular.forEach($scope.UserWorkingBranchArrays, function (mitem) {
                    mitem.IsChecked = false;
                });
            }
            else {


                angular.forEach($scope.UserWorkingBranchArrays, function (mitem) {
                    if (mitem.BranchId === 0) {
                        mitem.IsChecked = false;
                    }
                });

            }

            $scope.LocationTypeObj.SelectLocationString = "Selected";

            var nofalsecount = 0;
            angular.forEach($scope.UserWorkingBranchArrays, function (mitem) {
                if (mitem.IsChecked) {
                    nofalsecount++;
                }
            });
            if (nofalsecount === 0) {
                $scope.LocationTypeObj.SelectLocationString = "Select Location";
            }
        }

    };

    $scope.SaveResetMFAUserBasicInfo = function (form, type) {

        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'> If you Reset, QR code will be shown once your login with your credentials? </h4>", function () {

            $scope.saveUserBasicInfo(form, type, 1);

        }, function () {

        });

    }
 $scope.DenialpopoverContent = {
            templateUrl: 'DenialpopoverContent.html',
        };
    $scope.Payorpop = {
        templateUrl: 'Payorpop.html',
    };
}]);


function GetKeyValuePairSpceciality(lists, s_items) {
    var items = {};
    var rowno = 1;
    angular.forEach(s_items, function (s_list) {
        if (s_list.Name == lists) {
            items.Id = s_list.Id;
            items.Value = s_list.Name;
        }
    });
    return items;
}

function GetKeyValuePairCustomSpceciality(lists) {
    var items = {};
    angular.forEach(lists, function (item) {
        if (item.CustomSpecialityDesc !== undefined) {
            items[item.SepcialityCode] = item.CustomSpecialityDesc;
        }
    });
    return items;
}
function getJsonVal(accessList) {
    var data = [];
    if (accessList.length > 0) {
        for (var property in accessList[0]) {
            data.push(accessList[0][property]);
        }
    }
    return data;
}







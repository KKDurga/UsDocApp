"use strict";
 

eHnoteWebApp.controller("EhnoteNewDashBoardCtrl", ["$scope", "$rootScope", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "$location", "eHnoteMainDashboardDataServices", "$timeout", "alertify", "eHnoteUserAppointmentDataService", "localStorageFactory", "datapersistanceFactory", "eHnoteAccountUserServices", "$interval", "OpticalService", "InventoryService", "ReportUtilites", "eHnoteSurgeryService", "$sce", "$window", "eHnoteMainAppointmentService", "eHnoteMainAdminServices", "eHnotePrintService", function ($scope, $rootScope, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, $location, eHnoteMainDashboardDataServices, $timeout, alertify, eHnoteUserAppointmentDataService, localStorageFactory, datapersistanceFactory, eHnoteAccountUserServices, $interval, OpticalService, InventoryService, ReportUtilites, eHnoteSurgeryService, $sce, $window, eHnoteMainAppointmentService, eHnoteMainAdminServices, eHnotePrintService) {

    $scope.ListAdditionalReports = [];

    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
     
    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path('/login');
        return;
    }
   var doctorinfo = eHnoteMasterDataService.getUserInfo();
    console.log("doctorinfo", doctorinfo);
    var parentHospitalId;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID !== undefined) {
        parentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }

    function formNewAdditionalReportObj() {
        var obj = {
            "StartTime": $filter('date')(new Date(), "dd-MMM-yyyy"),
            "EndTime": $filter('date')(new Date(), "dd-MMM-yyyy"),
            "ParentOrganizationId": "",
            "SubOrganizationId": "",
            "BranchId": "",
            "SpecializationId": "",
            "SubSpecializationId": "",
            "DoctorId": "",
            "UserId": "",
            "ReportName":""
        };

        return obj;
    }

    $scope.getNewAdditionalReportObj = formNewAdditionalReportObj();
    $scope.SubOrganizationList = [];
    $scope.hospitalDetails = [];
    $scope.OrgSpecialitiesArray = [];
    $scope.allSubSpecializationsArray = [];
    $scope.clinicDoctorList = [];
    $scope.userList = [];

    $scope.initNew = function () {
        if (doctorinfo !== "") {

            if (doctorinfo.doctordata.UserSubOrganization !== undefined) {
                doctorinfo.doctordata.UserSubOrganization = doctorinfo.doctordata.UserSubOrganization || [];
                if (doctorinfo.doctordata.UserSubOrganization.length > 0) {

                    $scope.SubOrganizationList = [];
                    $scope.SubOrganizationReportList = [];
                    $scope.SubOrganizationList = doctorinfo.doctordata.UserSubOrganization;
                    $scope.SubOrganizationReportList = doctorinfo.doctordata.UserSubOrganization;
                    if ($scope.SubOrganizationList.length > 0) {
                        $scope.SelectedSubOrganization = $scope.SubOrganizationList[0];

                        $scope.SubOrganizationId = $scope.SubOrganizationList[0].SubOrganizationId;

                        $scope.SubOrganizationIdsList = [];
                        angular.forEach($scope.SubOrganizationList, function (item, index) {
                            $scope.SubOrganizationIdsList.push(item.SubOrganizationId);
                        });
                    }
                    var suborg = { "SubOrganizationId": 0, "SubOrganizationName": "All" };
                    $scope.SubOrganizationList.unshift(suborg);
                    console.log("suborg",$scope.SubOrganizationList);
                }
            }
        }


        //var data = localStorageFactory.getItem("allBranchesData") || [];
        //initializeBranches(data);

    };
    //$scope.selectedBranch = [];

    function initializeBranches(data) {
        $scope.hospitalDetails = [];
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.SummaryAllBranchesReports, data, doctorinfo) || [];
        $scope.hospitalDetails = clinicAddress;

        $scope.HospitalIdsList = [];
        angular.forEach(clinicAddress, function (item, index) {
            $scope.HospitalIdsList.push(item.BranchId);
        });

        $scope.defaultbranch = $filter("filter")(clinicAddress, function (item) {
            return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
        });

        $scope.selectedBranch = $scope.defaultbranch[0];

        var allhosp = { "BranchId": 0, "BranchName": "All" };
        $scope.hospitalDetails.unshift(allhosp);
        console.log("hosp", $scope.hospitalDetails);

        //GetBranchSpecialization($scope.SubOrganizationId, $scope.selectedBranch.BranchId);
        //GetBranchSubSpecialization($scope.SubOrganizationId, $scope.selectedBranch.BranchId);
    }

    function GetBranchSpecialization(SubOrganizationId, BranchId) {

        $scope.OrgSpecialitiesArray = [];
        if (BranchId === 0) {
            eHnoteMainAdminServices.getAllBranchSpecialitiesById(SubOrganizationId).then(function (response) {
                if (response.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = response.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                }
            });
        } else {
            eHnoteMainAdminServices.getBranchSpecialitiesById(BranchId).then(function (response) {
                if (response.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = response.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                }
            });
        }
        console.log($scope.OrgSpecialitiesArray);
    };

    function GetBranchSubSpecialization(SubOrganizationId, BranchId, SpecializationId) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = [];
               // $scope.allSubSpecializationsReportArray = [];
                $scope.allSubSpecializationsArray = resp.data.row;

                if (SpecializationId !== 0 && SpecializationId !== undefined) {
                    $scope.allSubSpecializationsArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.SpecializationId === SpecializationId; });
                }

                var subspe = { "SubSpecializationId": 0, "SubSpecializationName": "All"};
               // $scope.allSubSpecializationsReportArray = resp.data.row;
                //$scope.allSubSpecializationsReportArray.unshift(subspe);
                $scope.allSubSpecializationsArray.unshift(subspe);

               //getDoctorsbySubSpecializations(BranchId);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }

        });
    };

    $scope.getAllBranchesBySubOrganizationId = function (subOrganizationId) {
        eHnoteMainAppointmentService.getAllBranchesBySubOrganizationId(subOrganizationId, onHospitalListSuccess, OnHospitalListFailed);
        function onHospitalListSuccess(data) {
            if (data.rows.length > 0) {
                $scope.allBranchesArray = [];
                $scope.allBranchesArray = data.rows;
                initializeBranches($scope.allBranchesArray);
            } else {
                $scope.allBranchesArray = [];
            }
        }
        function OnHospitalListFailed(error) {
            console.log(error);
        }
    };

    function getDoctorsbySubSpecializations(branchId) {

        console.log(branchId);
        var branchesList = [];
       
        $scope.allUserList = [];
        $scope.selectedDoctor = "";

        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.hospitalDetails, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {


            var TempAppListdoctoraddress = $filter("filter")($scope.hospitalDetails, function (iterator, ind) { return iterator.ClinicId === branchId; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        }




        //  var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        if ($scope.subDepartId !== "" && $scope.subDepartId !== undefined) {

            var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.SubSpecializationId === $scope.subDepartId; });
        }
        else {
            var listSubSplArray = $scope.allSubSpecializationsArray;
        }
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": hospitalID,
            "SubSpecializationIdArray": subSplArray
        }



        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            console.log("----",resp);
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;
                var RoleID = userLoginDetails.RoleID;

                //$scope.getNewAdditionalReportObj.BranchId = $filter("filter")($scope.hospitalDetails, function (item, index) { return item.ClinicId === branchId; })[0];

                //$scope.getNewAdditionalReportObj.SubOrganizationId = $filter("filter")($scope.SubOrganizationList, function (item, index) { return item.SubOrganizationId === $scope.SubOrganizationId; })[0];

                //$scope.getNewAdditionalReportObj.SpecializationId = $filter("filter")($scope.OrgSpecialitiesArray, function (item, index) { return item.SpecializationId === $scope.OrgSpecialitiesArray[0].SpecializationId; })[0];

                //$scope.getNewAdditionalReportObj.SubSpecializationId = $filter("filter")($scope.allSubSpecializationsArray, function (item, index) { return item.SubSpecializationId === $scope.allSubSpecializationsArray[0].SubSpecializationId; })[0];

               // $scope.SelectedHospitalIdsList = [];
                $scope.clinicDoctorAllList = [];
                $scope.clinicDoctorList = [];
                $scope.userList = [];

                $scope.clinicDoctorAllList = $scope.allUserList;

                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    angular.forEach(Aitem.UserBranchRoles, function (item) {
                        if (item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57) {
                            $scope.clinicDoctorList.push(Aitem);
                        } else {
                            $scope.userList.push(Aitem);
                        }

                    });
                });
                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                var allcli = { "DoctorID": 0, "FullName": "All" };
                $scope.clinicDoctorList.unshift(allcli);
                $scope.userList = _.uniq($scope.userList, false, function (p) { return p.DoctorID; });
                var alluser = { "DoctorID": 0, "FullName": "All" };
                $scope.userList.unshift(alluser);
            }

        }
        function onGetUsersFailure(data) {
        }
    };

    $scope.initNew(); 



    $scope.changenewreport = function (type) {
        $scope.ShowList = true;
        $scope.getNewAdditionalReportObj = formNewAdditionalReportObj();
        $scope.hospitalDetails = [];
        $scope.OrgSpecialitiesArray = [];
        $scope.allSubSpecializationsArray = [];
        $scope.clinicDoctorList = [];
        $scope.userList = [];
        $scope.ListAdditionalReports = [];
        $scope.typename = type;
    };
   
        $scope.array = [{ "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" },
            { "name": "abc", "mobile": "123456789", "address1": "abcgd", "address2": "hghc", "id": "455234542", "user": "fvhvhsc", "password": "hghbjhd", "option": "hjdbsjbhdbs", "car": "yes", "bike": "no", "patientid": "2435", "presentaddreess": "ggvh2545", "indexno": "65654", "values": "654635", "doctors": "no", "patient": "yes" }];
   
    $scope.back = function () {
        $scope.ShowList = false;
    };

    $scope.currentpage = 1;
    $scope.pagesize = 10;
    $scope.maxsize = 10;
    $scope.count;
    $scope.exportMaxSize = 50000;

    $scope.viewReports = function (pagenumber ,reporttype) {
        $scope.ListAdditionalReports = [];
        if ($scope.typename === "AllBillReportOP") {
            $scope.getallbillingreportsOP(pagenumber, reporttype);
        }
        if ($scope.typename === "AllNewRegistration") {
            $scope.getallnewregistration(pagenumber, reporttype);
        }
    };

    $scope.getallbillingreportsOP = function (pagenumber, reporttype) {

        var obj = {
            "BranchId": $scope.getNewAdditionalReportObj.BranchId,
            "DoctorId": $scope.getNewAdditionalReportObj.DoctorId,
            "EndTime": $scope.getNewAdditionalReportObj.EndTime,
            "ParentOrganizationId": parentHospitalId,
            "ReportName": $scope.typename,
            "SpecializationId": $scope.getNewAdditionalReportObj.SpecializationId,
            "StartTime": $scope.getNewAdditionalReportObj.StartTime,
            "SubOrganizationId": $scope.getNewAdditionalReportObj.SubOrganizationId,
            "SubSpecializationId": $scope.getNewAdditionalReportObj.SubSpecializationId,
            "UserId": $scope.getNewAdditionalReportObj.UserId,
            "PageSize": reporttype === 'export' ? $scope.exportMaxSize : $scope.pagesize,
            "PageNumber": pagenumber ? pagenumber : $scope.currentpage
        };
        // $scope.getNewAdditionalReportObj;
        console.log("===", obj);
        eHnoteMainDashboardDataServices.GetAllBillReportsOP(obj).then(function (resp) {
            if (reporttype === 'export') {
                if (resp.data.rows !== "") {
                    //var blob = new Blob([resp.data], {
                    //    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    //});
                    //saveAs(blob, 'File_Name_With_Some_Unique_Id_Time' + '.csv');
                    ////var file = new Blob([resp.data.rows], { type: "text/csv" });
                    ////saveAs(file, "AllBillibgOP" + 1 + ".csv");
                    generateTable(resp.data.rows);
                }
            } else {
                if (resp.data.rows.length > 0) {
                    $scope.ListAdditionalReports = resp.data.rows;
                    $scope.count = resp.data.Count;
                } else {
                    $scope.ListAdditionalReports = [];
                }
            }
        },
            function (erroe) {
                console.log(resp);
            });
    };
    $scope.getallnewregistration = function (pagenumber, reporttype) {
        var obj = {
            "BranchId": $scope.getNewAdditionalReportObj.BranchId,
            "DoctorId": $scope.getNewAdditionalReportObj.DoctorId,
            "EndTime": $scope.getNewAdditionalReportObj.EndTime,
            "ParentOrganizationId": parentHospitalId,
            "ReportName": $scope.typename,
            "SpecializationId": $scope.getNewAdditionalReportObj.SpecializationId,
            "StartTime": $scope.getNewAdditionalReportObj.StartTime,
            "SubOrganizationId": $scope.getNewAdditionalReportObj.SubOrganizationId,
            "SubSpecializationId": $scope.getNewAdditionalReportObj.SubSpecializationId,
            "UserId": $scope.getNewAdditionalReportObj.UserId,
            "PageSize": reporttype === 'export' ? $scope.exportMaxSize : $scope.pagesize,
            "PageNumber": pagenumber ? pagenumber : $scope.currentpage
        };
        eHnoteMainDashboardDataServices.GetAllNewRegistrations(obj).then(function (resp) {
            if (reporttype === 'export') {
                //var blob = new Blob([resp.data.rows], {
                //    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                //});
                //saveAs(blob, "Report.xls");
                $timeout(function () {
                    $scope.exporttoexcel();
                }, 1000);
            }
            if (resp.data.rows != 0) {
                    var totalregistrationlist = resp.data.rows;
                    $scope.count = resp.data.Count;
                    $scope.ListAdditionalReports = [];
                    var date1;
                    var date2;
                    var count = 0;
                    var newarr = [];
                    angular.forEach(totalregistrationlist, function (item) {
                        date1 = item.AppointmentDate;
                        if (date1 != date2) {
                            angular.forEach(totalregistrationlist, function (sitem) {
                                if (date1 == sitem.AppointmentDate) {
                                    date2 = sitem.AppointmentDate;
                                    count++;
                                    newarr.push(sitem);
                                }
                            });
                            $scope.ListAdditionalReports.push({ "appointmentdate": date1, "totalpatients": count, "patientdetails": newarr })
                            count = 0;
                            newarr = [];
                        }
                    });
                    console.log($scope.ListAdditionalReports);
                } else {
                    $scope.ListAdditionalReports = [];
                }
        },
            function (error) {
                console.log(resp);
            });
    };

    $scope.exporttoexcel = function () {
        var rows = document.getElementById("tblCustomers").rows;
        var data = "";
        for (var row = 0; row < rows.length; row++) {
            for (var column = 0; column < rows[row].cells.length; column++) {
                data += rows[row].cells[column].innerHTML.trim() + ",";
            }
            data += "\n";
        }
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(new Blob([data], { type: 'text/csv;charset=utf-8;' }), "Employee.csv");
        }
        else {
            var a = document.createElement("a");
            a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(data);
            a.target = '_blank';
            a.download = 'AllNewRegistration.csv';
            document.body.appendChild(a);
            a.click();
        }
    }

    $scope.Clearlist = function () {
        $scope.getNewAdditionalReportObj = formNewAdditionalReportObj();
    }

    $scope.changereports = function (pagenumber) {
        $scope.viewReports(pagenumber);
    }

    $scope.gettoexcel = function (type, reporttype) {
        if (type === "AllBillReportOP") {
            $scope.getallbillingreportsOP(1,reporttype);
        }
        if ($scope.typename === "AllNewRegistration") {
            $scope.getallnewregistration(1, reporttype);
        }
    }

    function generateTable(jsontable) {
        var ReportName = "";
        var reports_exportData = [];
        if ($scope.typename === "AllBillReportOP") {
            ReportName = "AllBillReportOP";
            reports_exportData.length = 0;
            var pay_type;
            angular.forEach(jsontable, function (itemExports) {

                reports_exportData.push({
                    "Sno": itemExports.SNO,
                    "Patient ID": itemExports.PatientDisplayId,
                    "Patient Name": itemExports.PatientName,
                        "Care Provider Name": itemExports.Doctor,
                    "Billing Date": itemExports.BillDate,
                        "Billing No": itemExports.InvoiceNo,
                    "Billed items": itemExports.BilledItems,
                        "Treatment Cost": itemExports.TreatmentCost,
                    "Bill Amount": itemExports.BillAmount,
                        "Cash": itemExports.Cash,
                    "Card": itemExports.Card,
                        "Online": "",
                    "Cheque": itemExports.Cheque,
                        "Advance Adj": itemExports.Advance,
                    "Due": itemExports.Due,
                        "Discount": itemExports.Discount,
                    "CB Refund Number": itemExports.RefundNumber,
                        "Created User Name": itemExports.CreatedUserName
                });
            });
            jsontable = reports_exportData;
        }
        if ($scope.typename === "AllNewRegistration") {
            reports_exportData.length = 0;
          
        }
        var col = [];
        if (jsontable.length === 0) {
            return;
        }
        for (var i = 0; i < jsontable.length; i++) {
            for (var key in jsontable[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
                //if (jsontable[i].length > 1) {
                //    for (var j = 0; j < jsontable[i].length; j++) {
                //        for (var key1 in jsontable[i][j]) {
                //            if (col.indexOf(key1) === -1) {
                //                col.push(key1);
                //            }
                //        }
                //    }
                //}
            }
        }
        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);               // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < jsontable.length; i++) {
            tr = table.insertRow(-1);
            tr.style = "border: 1px solid #000;";
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = jsontable[i][col[j]];
            }
        }
       // download(table);
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

    //function download(table) {
    //    tableToExcel(table, 'Sheet 1', 'dataDownload.xls');
    //}
    function download(table) {
        tableToExcel(table, "Sheet 1", "" + $scope.typename + "Report.xls");
    }




    $scope.changesubOrganisationList = function (val) {
    $scope.SubOrganizationIdsList = [];

    if (val === null || val===0) {
        $scope.SubOrganizationIdsList = GetAllSubOrganizationIds();
        $scope.HospitalIdsList = GetAllHospitalIds();
       // $scope.GetAllIndicator = 1;
       // $scope.SelectedHospital = null;
       //// $scope.SubOrganizationId = 0;
       // var BranchId = 0;
       // $scope.SelectedDepartment = "";
       // $scope.SubDepartmentId = "";
        //getDoctorsbySubSpecializations(BranchId);
        eHnoteMainDashboardDataServices.getAllBranchesByParentOrgId(parentHospitalId, callbackSuccess, callbackError);
        function callbackSuccess(resp) {
            console.log(resp);
            initializeBranches(resp.rows);
        }
        function callbackError(resp) {
            console.log(resp);
        }
    } else {

        $scope.getAllBranchesBySubOrganizationId(val);
        $scope.SubOrganizationIdsList.push(val);
        //$scope.GetAllIndicator = 0;
        //GetBranchSpecialization(val);
        //GetBranchSubSpecialization(val, $scope.selectedBranch.BranchId);
    }
        $scope.hospitalDetails = [];
        $scope.OrgSpecialitiesArray = [];
        $scope.allSubSpecializationsArray = [];
        $scope.clinicDoctorList = [];
        $scope.userList = [];
    }

    $scope.changebranchlist = function (val) {

        $scope.HospitalIdsList = [];
        $scope.selectbranchid = val;

        if (val === null || val === 0) {
            $scope.HospitalIdsList = GetAllHospitalIds();
            $scope.GetAllIndicator = 1;
            $scope.clinicDoctorList = [];
            
            if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
            }
            if ($scope.getNewAdditionalReportObj.SubOrganizationId === 0) {

                GetBranchSpecialization($scope.selectedBranch.SubOrganizationId, $scope.selectbranchid);

            } else {

                GetBranchSpecialization($scope.selectedBranch.SubOrganizationId, 0);
            }

        //GetBranchSubSpecialization($scope.selectedBranch.SubOrganizationId, 0);
        } else {

            $scope.HospitalIdsList.push(val.ClinicId);
            $scope.GetAllIndicator = 0;
            GetBranchSpecialization($scope.getNewAdditionalReportObj.SubOrganizationId, $scope.selectbranchid);

            //if ($scope.getNewAdditionalReportObj.SubOrganizationId === 0) {

            //    GetBranchSubSpecialization($scope.SubOrganizationId, $scope.selectbranchid);
            //} else {

            //    GetBranchSubSpecialization($scope.getNewAdditionalReportObj.SubOrganizationId, $scope.selectbranchid);
            //}
        }
        $scope.OrgSpecialitiesArray = [];
        $scope.allSubSpecializationsArray = [];
        $scope.clinicDoctorList = [];
        $scope.userList = [];
    }

    $scope.changespecializationlist = function (val) {
        $scope.selectspecializationid = val;

        if ($scope.getNewAdditionalReportObj.SubOrganizationId === 0) {

            GetBranchSubSpecialization($scope.SubOrganizationId, $scope.selectbranchid, $scope.selectspecializationid);

        } else {

            GetBranchSubSpecialization($scope.getNewAdditionalReportObj.SubOrganizationId, $scope.selectbranchid, $scope.selectspecializationid);
        }
        $scope.allSubSpecializationsArray = [];
        $scope.clinicDoctorList = [];
        $scope.userList = [];
    }

    $scope.changeDepartmentId = function(val){
        if (val === null || val===0) {
            $scope.subDepartId = "";
            //$scope.SubDepartmentIdsList = GetAllDepartmentIds();
            $scope.GetAllIndicator = 1;
            getDoctorsbySubSpecializations($scope.selectbranchid);
            
        } else {
            $scope.subDepartId = val;
            $scope.GetAllIndicator = 0;
            getDoctorsbySubSpecializations($scope.selectbranchid);
        }
        $scope.clinicDoctorList = [];
        $scope.userList = [];

    }

    function GetAllSubOrganizationIds() {
        var ids = [];
        angular.forEach($scope.SubOrganizationList, function (item, index) {
            ids.push(item.SubOrganizationId);
        });
        return ids;
    }
    function GetAllHospitalIds() {
        var ids = [];
        angular.forEach($scope.hospitalDetails, function (item, index) {
            ids.push(item.ClinicId);
        });
        return ids;
    }

}]);
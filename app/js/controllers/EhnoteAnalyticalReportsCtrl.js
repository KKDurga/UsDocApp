"use strict";
 

eHnoteWebApp.controller("EhnoteAnalyticalReportsCtrl", ["$scope", "$rootScope", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "$location", "eHnoteMainDashboardDataServices", "$timeout", "alertify", "eHnoteUserAppointmentDataService", "localStorageFactory", "datapersistanceFactory", "eHnoteAccountUserServices", "$interval", "OpticalService", "InventoryService", "ReportUtilites", "eHnoteSurgeryService", "$sce", "$window", "eHnoteMainAppointmentService", "eHnoteMainAdminServices", "eHnotePrintService", function ($scope, $rootScope, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, $location, eHnoteMainDashboardDataServices, $timeout, alertify, eHnoteUserAppointmentDataService, localStorageFactory, datapersistanceFactory, eHnoteAccountUserServices, $interval, OpticalService, InventoryService, ReportUtilites, eHnoteSurgeryService, $sce, $window, eHnoteMainAppointmentService, eHnoteMainAdminServices, eHnotePrintService) {

    $scope.ListAdditionalReports = [];

    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

    
    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        $location.path('/login');
        return;
    }
   var doctorinfo = eHnoteMasterDataService.getUserInfo();
 
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
  

    //$scope.PatientAgeDiseasePecentageArray = [
    //    {
    //        "ageCategoryId": 1,
    //        "label": "0 - 10",
    //        "value": "500",
    //        "color":"#008b86",
    //        "diseasedPercentage": "0.83%",
    //    },
    //    {
    //        "ageCategoryId": 2,
    //        "label": "11 - 20",
    //        "value": "900",
    //        "color": "#008b86",
    //        "diseasedPercentage": "1.50%",
    //    },
    //    {
    //        "ageCategoryId": 3,
    //        "label": "21 - 30",
    //        "value": "2598",
    //        "color": "#008b86",
    //        "diseasedPercentage": "4.33%",
    //    },
    //    {
    //        "ageCategoryId": 4,
    //        "label": "31 - 40",
    //        "value": "9579",
    //        "color": "#008b86",
    //        "diseasedPercentage": "15.97%",
    //    },
    //    {
    //        "ageCategoryId": 5,
    //        "label": "41 - 50",
    //        "value": "10580",
    //        "color": "#008b86",
    //        "diseasedPercentage": "17.63%",
    //    },
    //    {
    //        "ageCategoryId": 6,
    //        "label": "51 - 60",
    //        "value": "15920",
    //        "color": "#008b86",
    //        "diseasedPercentage": "26.53%",
    //    },
    //    {
    //        "ageCategoryId": 7,
    //        "label": "61 - 70",
    //        "value": "11500",
    //        "color": "#008b86",
    //        "diseasedPercentage": "19.17%",
    //    },
    //    {
    //        "ageCategoryId": 8,
    //        "label": "71 - 80",
    //        "value": "4944",
    //        "color": "#008b86",
    //        "diseasedPercentage": "8.24%",
    //    },
    //    {
    //        "ageCategoryId": 9,
    //        "label": "81 - 90",
    //        "value": "3375",
    //        "color": "#008b86",
    //        "diseasedPercentage": "5.63%",
    //    },
    //    {
    //        "ageCategoryId": 9,
    //        "label": "91 - 100",
    //        "value": "104",
    //        "color": "#008b86",
    //        "diseasedPercentage": "0.17%",
    //    }

    //];


    $scope.PatientAgeDiseasePecentageArray = [
        {
            "ageCategoryId": 1,
            "label": "0 - 10",
            "color": "#008b86",
            "value": "0.83%",
        },
        {
            "ageCategoryId": 2,
            "label": "11 - 20",
            "color": "#008b86",
            "value": "1.50%",
        },
        {
            "ageCategoryId": 3,
            "label": "21 - 30",
            "color": "#008b86",
            "value": "4.33%",
        },
        {
            "ageCategoryId": 4,
            "label": "31 - 40",
            "color": "#008b86",
            "value": "15.97%",
        },
        {
            "ageCategoryId": 5,
            "label": "41 - 50",
            "color": "#008b86",
            "value": "17.63%",
        },
        {
            "ageCategoryId": 6,
            "label": "51 - 60",
            "color": "#008b86",
            "value": "26.53%",
        },
        {
            "ageCategoryId": 7,
            "label": "61 - 70",
            "color": "#008b86",
            "value": "19.17%",
        },
        {
            "ageCategoryId": 8,
            "label": "71 - 80",
            "color": "#008b86",
            "value": "8.24%",
        },
        {
            "ageCategoryId": 9,
            "label": "81 - 90",
            "color": "#008b86",
            "value": "5.63%",
        },
        {
            "ageCategoryId": 9,
            "label": "91 - 100",
            "color": "#008b86",
            "value": "0.17%",
        }

    ];


    $scope.init = function () {
       
        $scope.myDataSource = {
            chart: {
                usehovercolor: "1",
                caption: "",
                subcaption: "",
                theme: "fusion",
                entityfillhovercolor: "#f39c11",
                entitytooltext: "$lname has total no.of <b>$dataValue</b> k diseases",
                legendcaption: ""
            },
            data: [
                {
                    data: [
                        {
                            id: "SA",
                            value: "17.65%",
                            color:"#ADADAD",
                            link: "newchart-json-sa"
                        },
                        {
                            id: "NA",
                            value: "20.25%",
                            color: "#E5E5E5",
                            link: "newchart-json-na"
                        },
                        {
                            id: "EU",
                            value: "6.45",
                            color: "#BCBCBC",
                            link: "newchart-json-eu"
                        },
                        {
                            id: "AS",
                            value: "16.71%",
                            color: "#D2D2D2",
                            link: "newchart-json-as"
                        },
                        {
                            id: "AU",
                            value: "22.16%",
                            color: "#969696",
                            link: "newchart-json-au"
                        },
                        {
                            id: "AF",
                            value: "12.62%",
                            color: "#6F6F6F",
                            link: "newchart-json-af"
                        },
                        {
                            id: "AN",
                            value: "4.24%",
                            color: "#C5F8F7",
                            link: "newchart-json-af"
                        }
                    ]
                }
            ],
            linkeddata: [
                {
                    id: "na",
                    linkedchart: {
                        chart: {
                            caption: "Diseases By Country",
                            showvalues: "1",
                            theme: "fusion",
                            palettecolors: "#FED417,#B9BEBF,#D18A30",
                            plottooltext: "$seriesname: $datavalue"
                        },
                        categories: [
                            {
                                category: [
                                    {
                                        label: "United States"
                                    },
                                    {
                                        label: "Canada"
                                    },
                                    {
                                        label: "Mexico"
                                    }
                                ]
                            }
                        ],
                        dataset: [
                            {
                                seriesname: "Gold",
                                data: [
                                    {
                                        value: "37"
                                    },
                                    {
                                        value: "4"
                                    },
                                    {
                                        value: "0"
                                    }
                                ]
                            },
                            {
                                seriesname: "Silver",
                                data: [
                                    {
                                        value: "38"
                                    },
                                    {
                                        value: "3"
                                    },
                                    {
                                        value: "3"
                                    }
                                ]
                            },
                            {
                                seriesname: "Bronze",
                                data: [
                                    {
                                        value: "53"
                                    },
                                    {
                                        value: "15"
                                    },
                                    {
                                        value: "2"
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    id: "sa",
                    linkedchart: {
                        chart: {
                            caption: "Rio 2016 Medal Distribution - South America",
                            plottooltext: "$seriesname: $datavalue",
                            palettecolors: "#FED417,#B9BEBF,#D18A30",
                            showvalues: "1",
                            placevaluesinside: "0",
                            theme: "fusion"
                        },
                        categories: [
                            {
                                category: [
                                    {
                                        label: "Brazil"
                                    },
                                    {
                                        label: "Argentina"
                                    },
                                    {
                                        label: "Cuba"
                                    }
                                ]
                            }
                        ],
                        dataset: [
                            {
                                seriesname: "Gold",
                                data: [
                                    {
                                        value: "7"
                                    },
                                    {
                                        value: "3"
                                    },
                                    {
                                        value: "5"
                                    }
                                ]
                            },
                            {
                                seriesname: "Silver",
                                data: [
                                    {
                                        value: "6"
                                    },
                                    {
                                        value: "1"
                                    },
                                    {
                                        value: "2"
                                    }
                                ]
                            },
                            {
                                seriesname: "Bronze",
                                data: [
                                    {
                                        value: "6"
                                    },
                                    {
                                        value: "0"
                                    },
                                    {
                                        value: "4"
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    id: "as",
                    linkedchart: {
                        chart: {
                            caption: "Rio 2016 Medal Distribution - Asia",
                            plottooltext: "$seriesname: $datavalue",
                            showvalues: "1",
                            palettecolors: "#FED417,#B9BEBF,#D18A30",
                            theme: "fusion"
                        },
                        categories: [
                            {
                                category: [
                                    {
                                        label: "China"
                                    },
                                    {
                                        label: "Japan"
                                    },
                                    {
                                        label: "South Korea"
                                    }
                                ]
                            }
                        ],
                        dataset: [
                            {
                                seriesname: "Gold",
                                data: [
                                    {
                                        value: "26"
                                    },
                                    {
                                        value: "12"
                                    },
                                    {
                                        value: "9"
                                    }
                                ]
                            },
                            {
                                seriesname: "Silver",
                                data: [
                                    {
                                        value: "18"
                                    },
                                    {
                                        value: "8"
                                    },
                                    {
                                        value: "3"
                                    }
                                ]
                            },
                            {
                                seriesname: "Bronze",
                                data: [
                                    {
                                        value: "26"
                                    },
                                    {
                                        value: "21"
                                    },
                                    {
                                        value: "9"
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    id: "af",
                    linkedchart: {
                        chart: {
                            caption: "Rio 2016 Medal Distribution - Africa",
                            showvalues: "1",
                            palettecolors: "#FED417,#B9BEBF,#D18A30",
                            plottooltext: "$seriesname: $datavalue",
                            theme: "fusion"
                        },
                        categories: [
                            {
                                category: [
                                    {
                                        label: "Kenya"
                                    },
                                    {
                                        label: "South Africa"
                                    },
                                    {
                                        label: "Ethiopia"
                                    }
                                ]
                            }
                        ],
                        dataset: [
                            {
                                seriesname: "Gold",
                                data: [
                                    {
                                        value: "6"
                                    },
                                    {
                                        value: "2"
                                    },
                                    {
                                        value: "1"
                                    }
                                ]
                            },
                            {
                                seriesname: "Silver",
                                data: [
                                    {
                                        value: "6"
                                    },
                                    {
                                        value: "6"
                                    },
                                    {
                                        value: "2"
                                    }
                                ]
                            },
                            {
                                seriesname: "Bronze",
                                data: [
                                    {
                                        value: "1"
                                    },
                                    {
                                        value: "2"
                                    },
                                    {
                                        value: "5"
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    id: "au",
                    linkedchart: {
                        chart: {
                            caption: "Rio 2016 Medal Distribution - Australia",
                            showvalues: "1",
                            palettecolors: "#FED417,#B9BEBF,#D18A30",
                            plottooltext: "$seriesname: $datavalue",
                            theme: "fusion"
                        },
                        categories: [
                            {
                                category: [
                                    {
                                        label: "Australia"
                                    },
                                    {
                                        label: "New Zealand"
                                    }
                                ]
                            }
                        ],
                        dataset: [
                            {
                                seriesname: "Gold",
                                data: [
                                    {
                                        value: "8"
                                    },
                                    {
                                        value: "4"
                                    }
                                ]
                            },
                            {
                                seriesname: "Silver",
                                data: [
                                    {
                                        value: "11"
                                    },
                                    {
                                        value: "9"
                                    }
                                ]
                            },
                            {
                                seriesname: "Bronze",
                                data: [
                                    {
                                        value: "10"
                                    },
                                    {
                                        value: "5"
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    id: "eu",
                    linkedchart: {
                        chart: {
                            caption: "Rio 2016 Medal Distribution - Europe",
                            showvalues: "1",
                            palettecolors: "#FED417,#B9BEBF,#D18A30",
                            plottooltext: "$seriesname: $datavalue",
                            theme: "fusion"
                        },
                        categories: [
                            {
                                category: [
                                    {
                                        label: "Great Britain"
                                    },
                                    {
                                        label: "Russia"
                                    },
                                    {
                                        label: "Germany"
                                    }
                                ]
                            }
                        ],
                        dataset: [
                            {
                                seriesname: "Gold",
                                data: [
                                    {
                                        value: "27"
                                    },
                                    {
                                        value: "19"
                                    },
                                    {
                                        value: "17"
                                    }
                                ]
                            },
                            {
                                seriesname: "Silver",
                                data: [
                                    {
                                        value: "23"
                                    },
                                    {
                                        value: "18"
                                    },
                                    {
                                        value: "10"
                                    }
                                ]
                            },
                            {
                                seriesname: "Bronze",
                                data: [
                                    {
                                        value: "17"
                                    },
                                    {
                                        value: "19"
                                    },
                                    {
                                        value: "15"
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        };



        $scope.myDataSource2 = {
            chart: {
                theme: "fusion",
                caption: "",
                subcaption: "",
                xaxisname: "Diseases",
                yaxisname: "Age-Decade",
                showvalues: "1",
                valuefontcolor: "#ffffff",
                plottooltext:"<b>$value</b> % of <b>$columnlabel</b> in the age group of <b>$rowlabelyrs</b>",
            },
            colorrange: {
                gradient: "1",
                minvalue: "0",
                mapbypercent: "1",
                startlabel: "Low",
                endlabel: "High"
            },
            dataset: [
                {
                    data: [
                        {
                            rowid: "1",
                            columnid: "1",
                            value: "2.1"
                        },
                        {
                            rowid: "1",
                            columnid: "2",
                            value: "4.3"
                        },
                        {
                            rowid: "1",
                            columnid: "3",
                            value: "4.0"
                        },
                        {
                            rowid: "1",
                            columnid: "4",
                            value: "3.3"
                        },
                        {
                            rowid: "1",
                            columnid: "5",
                            value: "3.1"
                        },
                        {
                            rowid: "1",
                            columnid: "6",
                            value: "3.6"
                        },
                        {
                            rowid: "1",
                            columnid: "7",
                            value: "4.5"
                        },

                        {
                            rowid: "2",
                            columnid: "1",
                            value: "2.9"
                        },
                        {
                            rowid: "2",
                            columnid: "2",
                            value: "3.5"
                        },
                        {
                            rowid: "2",
                            columnid: "3",
                            value: "4.2"
                        },
                        {
                            rowid: "2",
                            columnid: "4",
                            value: "3.3"
                        },
                        {
                            rowid: "2",
                            columnid: "5",
                            value: "2.9"
                        },
                        {
                            rowid: "2",
                            columnid: "6",
                            value: "3.6"
                        },
                        {
                            rowid: "2",
                            columnid: "7",
                            value: "2.5"
                        },

                        {
                            rowid: "3",
                            columnid: "1",
                            value: "3.9"
                        },
                        {
                            rowid: "3",
                            columnid: "2",
                            value: "3.4"
                        },
                        {
                            rowid: "3",
                            columnid: "3",
                            value: "4.1"
                        },
                        {
                            rowid: "3",
                            columnid: "4",
                            value: "3.5"
                        },
                        {
                            rowid: "3",
                            columnid: "5",
                            value: "3.1"
                        },
                        {
                            rowid: "3",
                            columnid: "6",
                            value: "2.6"
                        },
                        {
                            rowid: "3",
                            columnid: "7",
                            value: "4.5"
                        },

                        {
                            rowid: "4",
                            columnid: "1",
                            value: "3.4"
                        },
                        {
                            rowid: "4",
                            columnid: "2",
                            value: "4.2"
                        },
                        {
                            rowid: "4",
                            columnid: "3",
                            value: "3.1"
                        },
                        {
                            rowid: "4",
                            columnid: "4",
                            value: "3.3"
                        },
                        {
                            rowid: "4",
                            columnid: "5",
                            value: "2.1"
                        },
                        {
                            rowid: "4",
                            columnid: "6",
                            value: "4.6"
                        },
                        {
                            rowid: "4",
                            columnid: "7",
                            value: "4.0"
                        },
                        {
                            rowid: "5",
                            columnid: "1",
                            value: "2.9"
                        },
                        {
                            rowid: "5",
                            columnid: "2",
                            value: "4.3"
                        },
                        {
                            rowid: "5",
                            columnid: "3",
                            value: "3.1"
                        },
                        {
                            rowid: "5",
                            columnid: "4",
                            value: "3.3"
                        },
                        {
                            rowid: "5",
                            columnid: "5",
                            value: "4.2"
                        },
                        {
                            rowid: "5",
                            columnid: "6",
                            value: "4.1"
                        },
                        {
                            rowid: "5",
                            columnid: "7",
                            value: "2.8"
                        },
                        {
                            rowid: "6",
                            columnid: "1",
                            value: "3.7"
                        },
                        {
                            rowid: "6",
                            columnid: "2",
                            value: "4.3"
                        },
                        {
                            rowid: "6",
                            columnid: "3",
                            value: "3.8"
                        },
                        {
                            rowid: "6",
                            columnid: "4",
                            value: "3.3"
                        },
                        {
                            rowid: "6",
                            columnid: "5",
                            value: "3.1"
                        },
                        {
                            rowid: "6",
                            columnid: "6",
                            value: "2.6"
                        },
                        {
                            rowid: "6",
                            columnid: "7",
                            value: "3.9"
                        },

                        {
                            rowid: "7",
                            columnid: "1",
                            value: "4.7"
                        },
                        {
                            rowid: "7",
                            columnid: "2",
                            value: "3.3"
                        },
                        {
                            rowid: "7",
                            columnid: "3",
                            value: "3.9"
                        },
                        {
                            rowid: "7",
                            columnid: "4",
                            value: "2.5"
                        },
                        {
                            rowid: "7",
                            columnid: "5",
                            value: "1.7"
                        },
                        {
                            rowid: "7",
                            columnid: "6",
                            value: "4.1"
                        },
                        {
                            rowid: "7",
                            columnid: "7",
                            value: "3.6"
                        },


                        {
                            rowid: "8",
                            columnid: "1",
                            value: "3.7"
                        },
                        {
                            rowid: "8",
                            columnid: "2",
                            value: "3.3"
                        },
                        {
                            rowid: "8",
                            columnid: "3",
                            value: "2.5"
                        },
                        {
                            rowid: "8",
                            columnid: "4",
                            value: "3.6"
                        },
                        {
                            rowid: "8",
                            columnid: "5",
                            value: "4.1"
                        },
                        {
                            rowid: "8",
                            columnid: "6",
                            value: "2.6"
                        },
                        {
                            rowid: "8",
                            columnid: "7",
                            value: "4.5"
                        },
                        {
                            rowid: "9",
                            columnid: "1",
                            value: "2.1"
                        },
                        {
                            rowid: "9",
                            columnid: "2",
                            value: "3.7"
                        },
                        {
                            rowid: "9",
                            columnid: "3",
                            value: "2.0"
                        },
                        {
                            rowid: "9",
                            columnid: "4",
                            value: "3.1"
                        },
                        {
                            rowid: "9",
                            columnid: "5",
                            value: "2.7"
                        },
                        {
                            rowid: "9",
                            columnid: "6",
                            value: "4.6"
                        },
                        {
                            rowid: "9",
                            columnid: "7",
                            value: "3.9"
                        },
                        {
                            rowid: "10",
                            columnid: "1",
                            value: "2.7"
                        },
                        {
                            rowid: "10",
                            columnid: "2",
                            value: "3.1"
                        },
                        {
                            rowid: "10",
                            columnid: "3",
                            value: "2.8"
                        },
                        {
                            rowid: "10",
                            columnid: "4",
                            value: "3.9"
                        },
                        {
                            rowid: "10",
                            columnid: "5",
                            value: "4.1"
                        },
                        {
                            rowid: "10",
                            columnid: "6",
                            value: "3.6"
                        },
                        {
                            rowid: "10",
                            columnid: "7",
                            value: "3.5"
                        },
                    ]
                }
            ],
            columns: {
                column: [
                    {
                        id: "1",
                        label: "Refractive Errors"
                    },
                    {
                        id: "2",
                        label: "Cataract"
                    },
                    {
                        id: "3",
                        label: "Keratoconus"
                    },
                    {
                        id: "4",
                        label: "Glaucoma"
                    },
                    {
                        id: "5",
                        label: "Diabetic Retinopathy"
                    },
                    {
                        id: "6",
                        label: "Age-related macular degeneration"
                    },
                    {
                        id: "7",
                        label: "Retinitis Pigmentosa"
                    }
                ]
            },
            rows: {
                row: [
                    {
                        id: "1",
                        label: "0 - 10 yrs"
                    },
                    {
                        id: "2",
                        label: "11 - 20 yrs"
                    },
                    {
                        id: "3",
                        label: "21 - 30 yrs"
                    },
                    {
                        id: "4",
                        label: "31 - 40 yrs"
                    },
                    {
                        id: "5",
                        label: "41 - 50 yrs"
                    },
                    {
                        id: "6",
                        label: "51 - 60 yrs"
                    },
                    {
                        id: "7",
                        label: "61 - 70 yrs"
                    },
                    {
                        id: "8",
                        label: "71 - 80 yrs"
                    },
                    {
                        id: "9",
                        label: "81 - 90 yrs"
                    },
                    {
                        id: "10",
                        label: "91 - 100 yrs"
                    }
                ]
            }
        };

        $scope.myDataSource3 = {
            chart: {
                //caption: "Prevalence of refractive errors in rural and urban areas",
              
                plottooltext: "<b>$dataValue</b> visitors from $label in $seriesName",
                theme: "fusion"
            },
            categories: [
                {
                    category: [
                        {
                            label: "High Myopia"
                        },
                        {
                            label: "Moderate Myopia"
                        },
                        {
                            label: "Mild Myopia"
                        },
                        {
                            label: "High Hyperopia"
                        },
                        {
                            label: "Moderate Hyperopia"
                        },
                        {
                            label: "Mild Hyperopia"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "Rural",
                    data: [
                        {
                            value: "5500"
                        },
                        {
                            value: "4400"
                        },
                        {
                            value: "8800"
                        },
                        {
                            value: "10000"
                        },
                        {
                            value: "12000"
                        }
                        ,
                        {
                            value: "3000"
                        }
                    ]
                },
                {
                    seriesname: "Urban",
                    data: [
                        {
                            value: "4900"
                        },
                        {
                            value: "5900"
                        },
                        {
                            value: "6900"
                        },
                        {
                            value: "6100"
                        },
                        {
                            value: "14000"
                        },
                        {
                            value: "20000"
                        }
                    ]
                }
            ]
           
        };

      
            $scope.myDataSource4 = {
                chart: {
                    //caption: "Frequency of change in refractive powers in Childern",
                    plottooltext: "<b>$percentValue</b> of web servers run on $label servers",
                    showlegend: "1",
                    showpercentvalues: "1",
                    legendposition: "bottom",
                    usedataplotcolorforlabels: "1",
                    theme: "fusion"
                },
                data: [
                    {
                        label: "Apache",
                        value: "32647479"
                    },
                    {
                        label: "Microsoft",
                        value: "22100932"
                    },
                    {
                        label: "Zeus",
                        value: "14376"
                    },
                    {
                        label: "Other",
                        value: "18674221"
                    }
                ]
        };


        $scope.myDataSource5 = {
            chart: {
                //caption: "Corneal Infections due to Trauma in Male & Female",
                subcaption:"Corneal infection due to Trauma",
                plottooltext: "<b>$percentValue</b> of web servers run on $label servers",
                showlegend: "1",
                showpercentvalues: "1",
                legendposition: "bottom",
                usedataplotcolorforlabels: "1",
                theme: "fusion"
            },
            data: [
                {
                    label: "Male",
                    value: "896",
                    color:"#07a0d4"
                },
                {
                    label: "Female",
                    value: "589",
                    color: "#ff9f9f"
                } 
            ]
        };
        $scope.myDataSource6 = {
            chart: {
                //caption: "Corneal Infections due to Trachoma in Male & Female",
                subcaption: "Corneal infection due to Trachoma",
                plottooltext: "<b>$percentValue</b> of web servers run on $label servers",
                showlegend: "1",
                showpercentvalues: "1",
                legendposition: "bottom",
                usedataplotcolorforlabels: "1",
                theme: "fusion"
            },
            data: [
                {
                    label: "Male",
                    value: "786",
                    color: "#07a0d4"
                },
                {
                    label: "Female",
                    value: "535",
                    color: "#ff9f9f"
                } 
            ]
        };


        $scope.myDataSource7 = {
            chart: {
                //caption: "Analytics for surgeries",
                //subcaption: "(Inflation Adjusted)",
                xaxisname: "surgeries",
                yaxisname:"count of surgeries",
                theme: "fusion",
                showvalues: "1",
                showsumatend: "0",
                numberscalevalue: "100",
                positivecolor: "",
                plottooltext:"<b>$dataValue</b> patients had <b>$label</b>",
            },
            data: [
                {
                    label: "Cataract",
                    value: "1520"
                },
                {
                    label: "Lasers",
                    value: "1320"
                },
                {
                    label: "Injections",
                    value: "250"
                },
                {
                    label: "Vitrectomy",
                    value: "254"
                },
                {
                    label: "Trabeculectomy",
                    value: "147"
                } 
            ]
        };

        $scope.myDataSource8 = {
            chart: {
                //caption: "Surgeries performed based on country",
                //subcaption: " Top 5 Developed Countries",
                xaxisname: "surgeries",
                yaxisname:"surgeries country wise",
                numbersuffix: " %",
                showsum: "1",
                plottooltext:"$label had performed on <b>$dataValue</b>% of patients from $seriesname",
                theme: "fusion",
                drawcrossline: "1"
            },
            categories: [
                {
                    category: [
                        {
                            label: "Cataract"
                        },
                        {
                            label: "Lasers"
                        },
                        {
                            label: "Injections"
                        },
                        {
                            label: "Vitrectomy"
                        },
                        {
                            label: "Trabeculectomy"
                        }
                      
                    ]
                }
            ],
            dataset: [
                {

                                     
                    seriesName: "India",                    
                    Total: "1000",
                    data: [
                        {
                            SurgeryId: "1",
                            SurgeryName: "Cataract", 
                            Value: "11.97%"
                        },    {
                            SurgeryId: "2",
                            SurgeryName: "Lasers", 
                            Value: "16.76%"
                        },    {
                            SurgeryId: "3",
                            SurgeryName: "Injections", 
                            Value: "13.51%"
                        },    {
                            SurgeryId: "4",
                            SurgeryName: "Vitrectomy", 
                            Value: "26.65%"
                        },    {
                            SurgeryId: "5",
                            SurgeryName: "Trabeculectomy", 
                            Value: "15.07%"
                        }
                     


                    ]
                },
                {

                                     
                    seriesName: "Africa",                    
                    Total: "1000",
                    data: [
                        {
                            SurgeryId: "1",
                            SurgeryName: "Cataract", 
                            Value: "18.05%"
                        },    {
                            SurgeryId: "2",
                            SurgeryName: "Lasers", 
                            Value: "19.94%"
                        },    {
                            SurgeryId: "3",
                            SurgeryName: "Injections", 
                            Value: "24.94%"
                        },    {
                            SurgeryId: "4",
                            SurgeryName: "Vitrectomy", 
                            Value: "30.09%"
                        },    {
                            SurgeryId: "5",
                            SurgeryName: "Trabeculectomy", 
                            Value: "13.04%"
                        }  
                    ]
                },
                {
                  
                    seriesName: "North Asia",                    
                    Total: "1000",
                    data: [
                        {
                            SurgeryId: "1",
                            SurgeryName: "Cataract", 
                            Value: "19.47%"
                        },    {
                            SurgeryId: "2",
                            SurgeryName: "Lasers", 
                            Value: "13.01%"
                        },    {
                            SurgeryId: "3",
                            SurgeryName: "Injections", 
                            Value: "22.08%"
                        },    {
                            SurgeryId: "4",
                            SurgeryName: "Vitrectomy", 
                            Value: "23.20%"
                        },    {
                            SurgeryId: "5",
                            SurgeryName: "Trabeculectomy", 
                            Value: "18.84%"
                        }
                     


                    ]
                },
                {
                  
                    seriesName: "Mongolia",                    
                    Total: "1000",
                    data: [
                        {
                            SurgeryId: "1",
                            SurgeryName: "Cataract", 
                            Value: "17.24%"
                        },    {
                            SurgeryId: "2",
                            SurgeryName: "Lasers", 
                            Value: "7.23%"
                        },    {
                            SurgeryId: "3",
                            SurgeryName: "Injections", 
                            Value: "19.22%"
                        },    {
                            SurgeryId: "4",
                            SurgeryName: "Vitrectomy", 
                            Value: "7.84%"
                        },    {
                            SurgeryId: "5",
                            SurgeryName: "Trabeculectomy", 
                            Value: "27.54%"
                        }
                    ]
                },
                {
                  
                    seriesName: "China",                    
                    Total: "1000",
                    data: [
                        {
                            SurgeryId: "1",
                            SurgeryName: "Cataract", 
                            Value: "15.21%"
                        },    {
                            SurgeryId: "2",
                            SurgeryName: "Lasers", 
                            Value: "18.21%"
                        },    {
                            SurgeryId: "3",
                            SurgeryName: "Injections", 
                            Value: "15.06%"
                        },    {
                            SurgeryId: "4",
                            SurgeryName: "Vitrectomy", 
                            Value: "4.39%"
                        },    {
                            SurgeryId: "5",
                            SurgeryName: "Trabeculectomy", 
                            Value: "21.45%"
                        }
                    ]
                },
                {
                  
                    seriesName: "Latin America",                    
                    Total: "1000",
                    data: [
                        {
                            SurgeryId: "1",
                            SurgeryName: "Cataract", 
                            Value: "18.05%"
                        },    {
                            SurgeryId: "2",
                            SurgeryName: "Lasers", 
                            Value: "24.86%"
                        },    {
                            SurgeryId: "3",
                            SurgeryName: "Injections", 
                            Value: "5.19%"
                        },    {
                            SurgeryId: "4",
                            SurgeryName: "Vitrectomy", 
                            Value: "7.84%"
                        },    {
                            SurgeryId: "5",
                            SurgeryName: "Trabeculectomy", 
                            Value: "4.06%"
                        }
                     


                    ]
                },

               
              
            ]
        };


        $scope.myDataSource9 = {
            chart: {
                //caption: "Boost App Data",
                yaxisname: "visual outcomes",
                xaxisname:"Year",
                subcaption: "",
                numdivlines: "3",
                showvalues: "0",
                legenditemfontsize: "15",
                legenditemfontbold: "1",
                plottooltext:"<b>$dataValue</b>% of visual outcomes are $seriesName in $label",
                theme: "fusion"
            },
            categories: [
                {
                    category: [
                        {
                            label: "2016"
                        },
                        {
                            label: "2017"
                        },
                        {
                            label: "2018"
                        },
                        {
                            label: "2019"
                        },
                        {
                            label: "2020"
                        },
                        {
                            label: "2021"
                        },
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "Good",
                    data: [
                        {
                            value: "55"
                        },
                        {
                            value: "45"
                        },
                        {
                            value: "52"
                        },
                        {
                            value: "29"
                        },
                        {
                            value: "48"
                        },
                        {
                            value: "28"
                        } 
                    ]
                },
                {
                    seriesname: "Bad",
                    data: [
                        {
                            value: "50"
                        },
                        {
                            value: "30"
                        },
                        {
                            value: "49"
                        },
                        {
                            value: "22"
                        },
                        {
                            value: "43"
                        },
                        {
                            value: "14"
                        } 
                    ]
                }
            ]
        };

        $scope.myDataSource10 = {
            chart: {
                //caption: "Improvement of education in children",
                yaxisname: "% of childern",
                subcaption: "2012-2016",
                showhovereffect: "1",
                numbersuffix: "%",
                drawcrossline: "1",
                plottooltext: "<b>$dataValue</b> of children were on $seriesName",
                theme: "fusion"
            },
            categories: [
                {
                    category: [
                        {
                            label: "3"
                        },
                        {
                            label: "2.5"
                        },
                        {
                            label: "2"
                        },
                        {
                            label: "1.5"
                        },
                        {
                            label: "1"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "CGP before glasses",
                    data: [
                        {
                            value: "10"
                        },
                        {
                            value: "20"
                        },
                        {
                            value: "35"
                        },
                        {
                            value: "33"
                        },
                        {
                            value: "52"
                        }
                    ]
                },
                {
                    seriesname: "CGP after prescribing glasses",
                    data: [
                        {
                            value: "50"
                        },
                        {
                            value: "40"
                        },
                        {
                            value: "30"
                        },
                        {
                            value: "20"
                        },
                        {
                            value: "10"
                        }
                    ]
                } 
            ]
        };

        $scope.myDataSource11 = {
            chart: {
                //caption: "Eye Disorder Referral",
                //subcaption: "For all users in 2017",
                showpercentvalues: "1",
                defaultcenterlabel: "",
                aligncaptionwithcanvas: "0",
                captionpadding: "0",
                decimals: "1",
                plottooltext:
                    "<b>$percentValue</b> of Eye Disorder are on <b>$label</b>",
                centerlabel: "# Users: $value",
                theme: "fusion"
            },
            data: [
                {
                    label: "Refractive Errors",
                    value: "1000"
                },
                {
                    label: "Cataract",
                    value: "5300"
                },
                {
                    label: "Keratoconus",
                    value: "10500"
                },
                {
                    label: "Glaucoma",
                    value: "18900"
                },
                {
                    label: "Diabetic Retinopathy",
                    value: "17904"
                },
                {
                    label: "Age-related macular degeneration",
                    value: "17904"
                },
                {
                    label: "Retinitis Pigmentosa",
                    value: "17904"
                }
            ]
        };

        $scope.myDataSource12 = {
            chart: {
                //caption: "Provision of equipment's to local teams tostrengthen eye care health",
                //subcaption: "2012-2016",
                xaxisname: "Country",
                yaxisname: "Total number of Equipments",
                formatnumberscale: "1",
                plottooltext:"$label was provided with <b>$dataValue</b>  <b>$seriesName</b>",
                theme: "fusion",
                drawcrossline: "1"
            },
            categories: [
                {
                    category: [
                        {
                            label: "Africa"
                        },
                        {
                            label: "India"
                        },
                        {
                            label: "China"
                        },
                        {
                            label: "Mangolia"
                        },
                        {
                            label: "North Asia"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "Auto refractometer",
                    data: [
                        {
                            value: "125000"
                        },
                        {
                            value: "300000"
                        },
                        {
                            value: "480000"
                        },
                        {
                            value: "800000"
                        },
                        {
                            value: "1100000"
                        }
                    ]
                },
                {
                    seriesname: "OCT",
                    data: [
                        {
                            value: "70000"
                        },
                        {
                            value: "150000"
                        },
                        {
                            value: "350000"
                        },
                        {
                            value: "600000"
                        },
                        {
                            value: "1400000"
                        }
                    ]
                },
                {
                    seriesname: "Fundus Photographs",
                    data: [
                        {
                            value: "10000"
                        },
                        {
                            value: "100000"
                        },
                        {
                            value: "300000"
                        },
                        {
                            value: "600000"
                        },
                        {
                            value: "900000"
                        }
                    ]
                },
                {
                    seriesname: "Slit lamp Examination",
                    data: [
                        {
                            value: "10000"
                        },
                        {
                            value: "100000"
                        },
                        {
                            value: "300000"
                        },
                        {
                            value: "600000"
                        },
                        {
                            value: "900000"
                        }
                    ]
                }
            ]
        };


        $scope.myDataSource13 = {
            chart: {
                theme: "fusion",
                //caption: "Eye Disorders Reffred",
                //subcaption: "",
                showvalues: "1",
                numbersuffix: " trn",
                numberprefix: "$",
                plottooltext:
                    "<b>$label</b> of world population owns <b>$dataValue</b> of global wealth",
                is2d: "0"
            },
            data: [
                {
                    label: "Ptosis",
                    value: "29"
                },
                {
                    label: "Ectropion",
                    value: "85"
                },
                {
                    label: "Entropion",
                    value: "96"
                },
                {
                    label: "Refractive surgery",
                    value: "84"
                },
                {
                    label: "Thyroid eye disease",
                    value: "25"
                }
            ]
        };

        $scope.myDataSource14 = {
            chart: {
                //caption: "Age Category",
                //subcaption: "",
                xaxisname: "Age Decade",
                yaxisname: "% of Patients",
                theme: "fusion",
                plottooltext: "$value of patients are presented in $label years of age group"
            },
            data: $scope.PatientAgeDiseasePecentageArray 
        };

        $scope.myDataSource15 = {
            chart: {
                theme: "fusion",
                //caption: "Patient Category",
                //subcaption: "Credit Suisse 2017",
                showvalues: "1",
                numbersuffix: " %",
                plottooltext:"<b>$dataValue</b> are from <b>$label</b>",
                is2d: "0"
            },
            data: [
                {
                    label: "Rural",
                    value: "59.53",
                    color: "#27ae61"
                },
                {
                    label: "Urban ",
                    value: "24.64",
                    color: "#f1c40f"
                },
                {
                    label: "Metro",
                    value: "15.83",
                    color: "#008b86"
                }
            
            ]
        };



        $scope.myDataSource16 = {
            chart: {
                //caption: "Diagnosis by gender",
                subcaption: "",
                yaxisname: "% of Gender",
                numvisibleplot: "8",
                labeldisplay: "auto",
                plottooltext:"<b>$dataValue</b>% of <b>$seriesName</b> have <b>$label</b>",
                theme: "fusion"
            },
            categories: [
                {
                    category: [                     
                        {
                            label: "Refractive Errors"
                        },
                        {
                            label: "Cataract"
                        },
                        {
                            label: "Keratoconus"
                        },
                        {
                            label: "Glaucoma"
                        },
                        {
                            label: "Diabetic Retinopathy"
                        },
                        {
                            label: "Age-related macular degeneration"
                        },
                        {
                            label: "Retinitis Pigmentosa"
                        },
                    
              
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "Male",
                    data: [
                        {
                            value: "14.97%"
                        },
                        {
                            value: "19.74%"
                        },
                        {
                            value: "2.55%"
                        },
                        {
                            value: "19.65%"
                        },
                        {
                            value: "19.92%"
                        },
                        {
                            value: "20.75%"
                        },
                        {
                            value: "2.42%"
                        },    
                    ]
                },
                {
                    seriesname: "Female",
                    data: [
                        {
                            value: "11.90%"
                        },
                        {
                            value: "20.86%"
                        },
                        {
                            value: "4.15%"
                        },
                        {
                            value: "13.38%"
                        },
                        {
                            value: "19.30%"
                        },
                        {
                            value: "28.99%"
                        },
                        {
                            value: "1.43%"
                        },
                    
                       
                    ]
                }
            ]
        };
        //$scope.myDataSource16 = {
        //    chart: {
        //        caption: "Market Share of Web Servers",
        //        plottooltext: "<b>$percentValue</b> of web servers run on $label servers",
        //        showlegend: "1",
        //        showpercentvalues: "1",
        //        legendposition: "bottom",
        //        usedataplotcolorforlabels: "1",
        //        theme: "fusion"
        //    },
        //    data: [
        //        {
        //            label: "Apache",
        //            value: "32647479"
        //        },
        //        {
        //            label: "Microsoft",
        //            value: "22100932"
        //        },
        //        {
        //            label: "Zeus",
        //            value: "14376"
        //        },
        //        {
        //            label: "Other",
        //            value: "18674221"
        //        }
        //    ]
        //};

        $scope.myDataSource17 = {
            chart: {
                //caption: "Refractive Errors",
                yaxisname: "Count",
                xaxisname: "Refractive Errors",
                numbersuffix: " k",
                rotatelabels: "0",
                setadaptiveymin: "1",
                theme: "fusion"
            },
            data: [
                {
                    label: "High Myopia",
                    value: "23.78%"
                },
                {
                    label: "Moderate Myopia",
                    value: "20.51%"
                },
                {
                    label: "Mild Myopia",
                    value: "20.79%"
                },
                {
                    label: "High Hyperopia",
                    value: "4.07%"
                },
                {
                    label: "Moderate Hyperopia",
                    value: "10.21%"
                },
                {
                    label: "Mild Hyperopia",
                    value: "20.65%"
                },
           
            ]
        };


        $scope.myDataSource18 = {
            chart: {
                //caption: "Diagnosis by Visual acuity",
                //subcaption: "2012-2016",
                xaxisname: "Visual activity",
                yaxisname: "% of Diagnosis",
                formatnumberscale: "1",
                plottooltext:"<b>$dataValue</b>% of <b>$seriesName</b> are present with  visual acuity $label",
                theme: "fusion",
                drawcrossline: "1"
            },
            categories: [
                {
                    category: [
                        {
                            label: "> 20/40"
                        },
                        {
                            label: "< 20/40 -20/60"
                        },
                        {
                            label: "< 20/60 -20/200"
                        },
                        {
                            label: "< 20/200 -20/400"
                        },
                        {
                            label: "< 20/400 -HM"
                        },
                        {
                            label: "<HM -PL"
                        },
                        {
                            label: "NPL"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "Refractive Errors",
                    data: [
                        {
                            value: "33.03%"
                        },
                        {
                            value: "29.80%"
                        },
                        {
                            value: "30.75%"
                        },
                        {
                            value: "42.76%"
                        },
                        {
                            value: "30.50%"
                        },
                        {
                            value: "13.87%"
                        },
                        {
                            value: "2.84%"
                        }
                    ]
                },
                {
                    seriesname: "Cataract",
                    data: [
                        {
                            value: "36.79%"
                        },
                        {
                            value: "25.94%"
                        },
                        {
                            value: "22.80%"
                        },
                        {
                            value: "17.51%"
                        },
                        {
                            value: "18.91%"
                        },
                        {
                            value: "22.83%"
                        },
                        {
                            value: "34.62%"
                        }
                    ]
                },
                {
                    seriesname: "Keratoconus",
                    data: [
                        {
                            value: "5.44%"
                        },
                        {
                            value: "3.54%"
                        },
                        {
                            value: "3.56%"
                        },
                        {
                            value: "2.69%"
                        },
                        {
                            value: "3.33%"
                        },
                        {
                            value: "5.54%"
                        },
                        {
                            value: "0.02%"
                        }
                    ]
                },
                {
                    seriesname: "Glaucoma",
                    data: [
                        {
                            value: "3.05%"
                        },
                        {
                            value: "7.65%"
                        },
                        {
                            value: "9.65%"
                        },
                        {
                            value: "8.70%"
                        },
                        {
                            value: "9.60%"
                        },
                        {
                            value: "11.59%"
                        },
                        {
                            value: "13.10%"
                        }
                    ]
                },
                {
                    seriesname: "Diabetic Retinopathy",
                    data: [
                        {
                            value: "4.77%"
                        },
                        {
                            value: "15.49%"
                        },
                        {
                            value: "15.08%"
                        },
                        {
                            value: "13.12%"
                        },
                        {
                            value: "19.17%"
                        },
                        {
                            value: "22.83%"
                        },
                        {
                            value: "23.65%"
                        }
                    ]
                },
                {
                    seriesname: "Age-related macular degeneration",
                    data: [
                        {
                            value: "13.57%"
                        },
                        {
                            value: "15.75%"
                        },
                        {
                            value: "15.08%"
                        },
                        {
                            value: "12.06%"
                        },
                        {
                            value: "13.90%"
                        },
                        {
                            value: "16.68%"
                        },
                        {
                            value: "18.13%"
                        }
                    ]
                },
                {
                    seriesname: "Retinitis Pigmentosa",
                    data: [
                        {
                            value: "3.35%"
                        },
                        {
                            value: "1.84%"
                        },
                        {
                            value: "3.08%"
                        },
                        {
                            value: "3.16%"
                        },
                        {
                            value: "4.59%"
                        },
                        {
                            value: "6.65%"
                        },
                        {
                            value: "7.64%"
                        }
                    ]
                },
                //{
                //    seriesname: "Amazon AppStore",
                //    data: [
                //        {
                //            value: "10000"
                //        },
                //        {
                //            value: "100000"
                //        },
                //        {
                //            value: "300000"
                //        },
                //        {
                //            value: "600000"
                //        },
                //        {
                //            value: "900000"
                //        },
                //        {
                //            value: "600000"
                //        },
                //        {
                //            value: "900000"
                //        }
                //    ]
                //}
            ]
                
            
        };

        $scope.myDataSource19 = {
            chart: {
                //caption: "Investigations performed on patients",
                //subcaption: " Top 5 Developed Countries",
                xaxisname: "Investigations",
                yaxisname:"Investigation country wise",
                numbersuffix: " %",
                showsum: "1",
                plottooltext:"$label is performed in <b>$dataValue</b> in $seriesName",
                theme: "fusion",
                drawcrossline: "1"
            },
            categories: [
                {
                    category: [
                        {
                            label: "Pachymetry"
                        },
                        {
                            label: "Orb-scan"
                        },
                        {
                            label: "A-Scan"
                        },
                        {
                            label: "HVF"
                        },
                        {
                            label: "OCT-Glaucoma"
                        },
                        {
                            label: "OCT/OCT-A"
                        },
                        {
                            label: "Fundus photography"
                        },
                        {
                            label: "Fundus Floyrescein Angiography"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesName: "India",
                    Total: "1000",
                    data: [
                        {
                            InvestigationId: "1",
                            InvestigationName: "Pachymetry",
                            Value: "13.09%"
                        },
                        {
                            InvestigationId: "2",
                            InvestigationName: "Orb-scan",
                            Value: "17.34%"
                        },
                        {
                            InvestigationId: "3",
                            InvestigationName: "A-Scan",
                            Value: "16.18%"
                        },
                        {
                            InvestigationId: "4",
                            InvestigationName: "HVF",
                            Value: "16.85%"
                        },
                        {
                            InvestigationId: "5",
                            InvestigationName: "OCT-Glaucoma",
                            Value: "16.56%"
                        },
                        {
                            InvestigationId: "6",
                            InvestigationName: "OCT/OCT-A",
                            Value: "16.30%"
                        },
                        {
                            InvestigationId: "7",
                            InvestigationName: "Fundus Photgraphy",
                            Value: "18%"
                        },
                        {
                            InvestigationId: "8",
                            InvestigationName: "Fundus Floyrescein Angiography",
                            Value: "16.71%"
                        }
                    ]
                },
                {
                    seriesName: "Africa",
                    Total: "1000",
                    data: [
                        {
                            InvestigationId: "1",
                            InvestigationName: "Pachymetry",
                            Value: "28.07%"
                        },
                        {
                            InvestigationId: "2",
                            InvestigationName: "Orb-scan",
                            Value: "23.60%"
                        },
                        {
                            InvestigationId: "3",
                            InvestigationName: "A-Scan",
                            Value: "16.54%"
                        },
                        {
                            InvestigationId: "4",
                            InvestigationName: "HVF",
                            Value: "16.75%"
                        },
                        {
                            InvestigationId: "5",
                            InvestigationName: "OCT-Glaucoma",
                            Value: "16.66%"
                        },
                        {
                            InvestigationId: "6",
                            InvestigationName: "OCT/OCT-A",
                            Value: "17.97%"
                        },
                        {
                            InvestigationId: "7",
                            InvestigationName: "Fundus Photgraphy",
                            Value: "14%"
                        },
                        {
                            InvestigationId: "8",
                            InvestigationName: "Fundus Floyrescein Angiography",
                            Value: "15.42%"
                        },
                      
                    ]
                },
                {
                    seriesName: "North Asia",
                    Total: "1000",
                    data: [
                        {
                            InvestigationId: "1",
                            InvestigationName: "Pachymetry",
                            Value: "22.82%"
                        },
                        {
                            InvestigationId: "2",
                            InvestigationName: "Orb-scan",
                            Value: "15.12%"
                        },
                        {
                            InvestigationId: "3",
                            InvestigationName: "A-Scan",
                            Value: "16.45%"
                        },
                        {
                            InvestigationId: "4",
                            InvestigationName: "HVF",
                            Value: "16.53%"
                        },
                        {
                            InvestigationId: "5",
                            InvestigationName: "OCT-Glaucoma",
                            Value: "17.48%"
                        },
                        {
                            InvestigationId: "6",
                            InvestigationName: "OCT/OCT-A",
                            Value: "17.88%"
                        },
                        {
                            InvestigationId: "7",
                            InvestigationName: "Fundus Photgraphy",
                            Value: "15.96%"
                        },
                        {
                            InvestigationId: "8",
                            InvestigationName: "Fundus Floyrescein Angiography",
                            Value: "16.79%"
                        },
                      
                    ]
                },
                {
                    seriesName: "Mongolia",
                    Total: "1000",
                    data: [
                        {
                            InvestigationId: "1",
                            InvestigationName: "Pachymetry",
                            Value: "11.41%"
                        },
                        {
                            InvestigationId: "2",
                            InvestigationName: "Orb-scan",
                            Value: "16.90%"
                        },
                        {
                            InvestigationId: "3",
                            InvestigationName: "A-Scan",
                            Value: "18.89%"
                        },
                        {
                            InvestigationId: "4",
                            InvestigationName: "HVF",
                            Value: "16.68%"
                        },
                        {
                            InvestigationId: "5",
                            InvestigationName: "OCT-Glaucoma",
                            Value: "17.49%"
                        },
                        {
                            InvestigationId: "6",
                            InvestigationName: "OCT/OCT-A",
                            Value: "15.17%"
                        },
                        {
                            InvestigationId: "7",
                            InvestigationName: "Fundus Photgraphy",
                            Value: "19.50%"
                        },
                        {
                            InvestigationId: "8",
                            InvestigationName: "Fundus Floyrescein Angiography",
                            Value: "16.98%"
                        },
                      
                    ]
                },
                {
                    seriesName: "China",
                    Total: "1000",
                    data: [
                        {
                            InvestigationId: "1",
                            InvestigationName: "Pachymetry",
                            Value: "12.42%"
                        },
                        {
                            InvestigationId: "2",
                            InvestigationName: "Orb-scan",
                            Value: "9.25%"
                        },
                        {
                            InvestigationId: "3",
                            InvestigationName: "A-Scan",
                            Value: "15.27%"
                        },
                        {
                            InvestigationId: "4",
                            InvestigationName: "HVF",
                            Value: "16.40%"
                        },
                        {
                            InvestigationId: "5",
                            InvestigationName: "OCT-Glaucoma",
                            Value: "16.56%"
                        },
                        {
                            InvestigationId: "6",
                            InvestigationName: "OCT/OCT-A",
                            Value: "16.18%"
                        },
                        {
                            InvestigationId: "7",
                            InvestigationName: "Fundus Photgraphy",
                            Value: "15.99%"
                        },
                        {
                            InvestigationId: "8",
                            InvestigationName: "Fundus Floyrescein Angiography",
                            Value: "17.12%"
                        },
                      
                    ]
                },
                {
                    seriesName: "Latin America",
                    Total: "1000",
                    data: [
                        {
                            InvestigationId: "1",
                            InvestigationName: "Pachymetry",
                            Value: "12.19%"
                        },
                        {
                            InvestigationId: "2",
                            InvestigationName: "Orb-scan",
                            Value: "17.79%"
                        },
                        {
                            InvestigationId: "3",
                            InvestigationName: "A-Scan",
                            Value: "16.67%"
                        },
                        {
                            InvestigationId: "4",
                            InvestigationName: "HVF",
                            Value: "16.79%"
                        },
                        {
                            InvestigationId: "5",
                            InvestigationName: "OCT-Glaucoma",
                            Value: "15.25%"
                        },
                        {
                            InvestigationId: "6",
                            InvestigationName: "OCT/OCT-A",
                            Value: "16.50%"
                        },
                        {
                            InvestigationId: "7",
                            InvestigationName: "Fundus Photgraphy",
                            Value: "16.55%"
                        },
                        {
                            InvestigationId: "8",
                            InvestigationName: "Fundus Floyrescein Angiography",
                            Value: "16.98%"
                        },
                      
                    ]
                },

            ]
           
         
        };

        $scope.myDataSource20 = {
            chart: {
                caption: "",
                subcaption: "",
                xaxisname: "Inventory",
                yaxisname:"Inventory country wise",
                numbersuffix: " %",
                showsum: "1",
                plottooltext:"$label is performed in <b>$dataValue</b> of patients in $seriesName",
                theme: "fusion",
                drawcrossline: "1"
            },
            categories: [
                {
                    category: [
                        {
                            label: "OCT"
                        },
                        {
                            label: "Auto refractometer"
                        },
                        {
                            label: "Fundus photography"
                        },
                        {
                            label: "A-Scan"
                        },
                        {
                            label: "B-Scan"
                        },
                        {
                            label: "Pachymetry"
                        },
                        {
                            label: "Orb-Scan"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesName: "India",
                    Total: "1000",
                    data: [
                        {
                            EquipentId: "1",
                            EquipmentName: "OCT",
                            Value: "5%"
                        },
                        {
                            EquipentId: "2",
                            EquipmentName: "Auto refractometer",
                            Value: "12.91%"
                        },
                        {
                            EquipentId: "3",
                            EquipmentName: "Fundus photography",
                            Value: "7.45%"
                        },
                        {
                            EquipentId: "4",
                            EquipmentName: "A-Scan",
                            Value: "10.77%"
                        },
                        {
                            EquipentId: "5",
                            EquipmentName: "B-Scan",
                            Value: "15.88%"
                        },
                        {
                            EquipentId: "6",
                            EquipmentName: "Pachymetry",
                            Value: "12.82%"
                        },
                        {
                            EquipentId: "7",
                            EquipmentName: "Orb-Scan",
                            Value: "20.82%"
                        },

                    ]
                },
                {
                    CountryId: "2",
                    CountryName: "Africa",
                    seriesName: "Africa",
                    Total: "2000",
                    data: [
                        {
                            EquipentId: "1",
                            EquipmentName: "OCT",
                            Value: "15.25%"
                        }, {
                            EquipentId: "2",
                            EquipmentName: "Auto refractometer",
                            Value: "21.21%"
                        },
                        {
                            EquipentId: "3",
                            EquipmentName: "Fundus photography",
                            Value: "13.14%"
                        }, {
                            EquipentId: "4",
                            EquipmentName: "A-Scan",
                            Value: "14.78%"
                        }, {
                            EquipentId: "5",
                            EquipmentName: "B-Scan",
                            Value: "8.82%"
                        },
                        {
                            EquipentId: "6",
                            EquipmentName: "Pachymetry",
                            Value: "3.94%"
                        },
                        {
                            EquipentId: "7",
                            EquipmentName: "Orb-Scan",
                            Value: "18.24%"
                        },

                    ]
                },
                {
                    CountryId: "3",
                    CountryName: "North Asia",
                    seriesName: "North Asia",
                    Total: "3000",
                    data: [
                        {
                            EquipentId: "1",
                            EquipmentName: "OCT",
                            Value: "17.37%"
                        }, {
                            EquipentId: "2",
                            EquipmentName: "Auto refractometer",
                            Value: "17.34%"
                        },
                        {
                            EquipentId: "3",
                            EquipmentName: "Fundus photography",
                            Value: "15.23%"
                        }, {
                            EquipentId: "4",
                            EquipmentName: "A-Scan",
                            Value: "19.22%"
                        }, {
                            EquipentId: "5",
                            EquipmentName: "B-Scan",
                            Value: "22.01%"
                        },
                        {
                            EquipentId: "6",
                            EquipmentName: "Pachymetry",
                            Value: "17.52%"
                        },
                        {
                            EquipentId: "7",
                            EquipmentName: "Orb-Scan",
                            Value: "17.31%"
                        },

                    ]
                },
                {
                    CountryId: "4",
                    CountryName: "Mongolia",
                    seriesName: "Mongolia",
                    Total: "4000",
                    data: [
                        {
                            EquipentId: "1",
                            EquipmentName: "OCT",
                            Value: "19.96%"
                        }, {
                            EquipentId: "2",
                            EquipmentName: "Auto refractometer",
                            Value: "10.07%"
                        },
                        {
                            EquipentId: "3",
                            EquipmentName: "Fundus photography",
                            Value: "15.90%"
                        }, {
                            EquipentId: "4",
                            EquipmentName: "A-Scan",
                            Value: "16.76%"
                        }, {
                            EquipentId: "5",
                            EquipmentName: "B-Scan",
                            Value: "15.69%"
                        },
                        {
                            EquipentId: "6",
                            EquipmentName: "Pachymetry",
                            Value: "19.96%"
                        },
                        {
                            EquipentId: "7",
                            EquipmentName: "Orb-Scan",
                            Value: "5.97%"
                        },

                    ]
                },
                {
                    CountryId: "5",
                    CountryName: "China",
                    seriesName: "China",
                    Total: "5000",
                    data: [
                        {
                            EquipentId: "1",
                            EquipmentName: "OCT",
                            Value: "22.50%"
                        }, {
                            EquipentId: "2",
                            EquipmentName: "Auto refractometer",
                            Value: "21.21%"
                        },
                        {
                            EquipentId: "3",
                            EquipmentName: "Fundus photography",
                            Value: "20.26%"
                        }, {
                            EquipentId: "4",
                            EquipmentName: "A-Scan",
                            Value: "21.71%"
                        }, {
                            EquipentId: "5",
                            EquipmentName: "B-Scan",
                            Value: "21.91%"
                        },
                        {
                            EquipentId: "6",
                            EquipmentName: "Pachymetry",
                            Value: "25.80%"
                        },
                        {
                            EquipentId: "7",
                            EquipmentName: "Orb-Scan",
                            Value: "15.26%"
                        },

                    ]
                },
                {
                    CountryId: "6",
                    CountryName: "Latin America",
                    seriesName: "Latin America",
                    Total: "6000",
                    data: [
                        {
                            EquipentId: "1",
                            EquipmentName: "OCT",
                            Value: "19.92%"
                        }, {
                            EquipentId: "2",
                            EquipmentName: "Auto refractometer",
                            Value: "17.26%"
                        },
                        {
                            EquipentId: "3",
                            EquipmentName: "Fundus photography",
                            Value: "28.02%"
                        }, {
                            EquipentId: "4",
                            EquipmentName: "A-Scan",
                            Value: "16.76%"
                        }, {
                            EquipentId: "5",
                            EquipmentName: "B-Scan",
                            Value: "15.69%"
                        },
                        {
                            EquipentId: "6",
                            EquipmentName: "Pachymetry",
                            Value: "19.96%"
                        },
                        {
                            EquipentId: "7",
                            EquipmentName: "Orb-Scan",
                            Value: "22.40%"
                        },

                    ]
                },
           
        ]
        };



        $scope.myDataSource21 = {
            chart: {
                caption: "",
                subcaption: "",
                xaxisname: "Diagnosis",
                yaxisname: "Country Wise Diagnosis",
                formatnumberscale: "1",
                plottooltext:"<b>$dataValue</b> of $label are present in <b>$seriesName</b>",
                theme: "fusion"
            },
            categories: [
                {
                    category: [
                        {
                            label: "Refractive Errors"
                        },
                        {
                            label: "Cataract"
                        },
                        {
                            label: "Keratoconus"
                        },
                        {
                            label: "Glaucoma"
                        },
                        {
                            label: "Diabetic Retinopathy"
                        },
                        {
                            label: "Age-related macular degeneration"
                        },
                        {
                            label: "Retinitis Pigmentosa"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "India",
                    data: [
                        {
                            value: "5849"
                        },
                        {
                            value: "1789"
                        },
                        {
                            value: "587"
                        },
                        {
                            value: "1570"
                        },
                        {
                            value: "886"
                        },
                        {
                            value: "547"
                        },
                        {
                            value: "457"
                        }
                    ]
                },
                {
                    seriesname: "Africa",
                    data: [
                        {
                            value: "7896"
                        },
                        {
                            value: "5870"
                        },
                        {
                            value: "885"
                        },
                        {
                            value: "1450"
                        },
                        {
                            value: "2970"
                        },
                        {
                            value: "5807"
                        },
                        {
                            value: "4454"
                        }

                    ]
                },
                {
                    seriesname: "North Asia",
                    data: [
                        {
                            value: "7857"
                        },
                        {
                            value: "965"
                        },
                        {
                            value: "1440"
                        },
                        {
                            value: "4145"
                        },
                        {
                            value: "5141"
                        },
                        {
                            value: "3570"
                        },
                        {
                            value: "7534"
                        }
                    ]
                },
                {
                    seriesname: "Mangolia",
                    data: [
                        {
                            value: "967"
                        },
                        {
                            value: "789"
                        },
                        {
                            value: "250"
                        },
                        {
                            value: "216"
                        },
                        {
                            value: "424"
                        },
                        {
                            value: "1145"
                        },
                        {
                            value: "456"
                        }
                    ]
                },
                {
                    seriesname: "China",
                    data: [
                        {
                            value: "967"
                        },
                        {
                            value: "547"
                        },
                        {
                            value: "3140"
                        },
                        {
                            value: "2451"
                        },
                        {
                            value: "4230"
                        },
                        {
                            value: "4570"
                        },
                        {
                            value: "3452"
                        }
                    ]
                },
                {
                    seriesname: "Latin America",
                    data: [
                        {
                            value: "857"
                        },
                        {
                            value: "524"
                        },
                        {
                            value: "5420"
                        },
                        {
                            value: "4791"
                        },
                        {
                            value: "2520"
                        },
                        {
                            value: "745"
                        },
                        {
                            value: "6870"
                        }
                    ]
                }
            ]
        };


        $scope.myDataSource22 = {
            chart: {
                xaxisname: "Doctors",
                yaxisname: "Surgeries",
                formatnumberscale: "1",
                plottooltext:"<b>$dataValue</b> of  <b>$seriesName</b> are performed by $label",
                theme: "fusion",
                drawcrossline: "1"
            },
            categories: [
                {
                    category: [
                        {
                            label: "Dr. John"
                        },
                        {
                            label: "Dr. Patrick"
                        },
                        {
                            label: "Dr. Hannah"
                        },
                        {
                            label: "Dr. Jennifer"
                        },
                        {
                            label: "Dr. James"
                        },
                        {
                            label: "Dr. Robert"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "Cataract",
                    data: [
                        {
                            value: "7789"
                        },
                        {
                            value: "9967"
                        },
                        {
                            value: "874"
                        },
                        {
                            value: "7888"
                        },
                        {
                            value: "5476"
                        },
                        {
                            value: "6544"
                        }
                    ]
                },
                {
                    seriesname: "Trabeculectomy",
                    data: [
                        {
                            value: "5964"
                        },
                        {
                            value: "2559"
                        },
                        {
                            value: "5556"
                        },
                        {
                            value: "7458"
                        },
                        {
                            value: "9667"
                        },
                        {
                            value: "5697"
                        }
                    ]
                },
                {
                    seriesname: "Vitreretinal surgery",
                    data: [
                        {
                            value: "9874"
                        },
                        {
                            value: "7296"
                        },
                        {
                            value: "4569"
                        },
                        {
                            value: "4487"
                        },
                        {
                            value: "5584"
                        },
                        {
                            value: "5775"
                        }
                    ]
                },
                {
                    seriesname: "Injections",
                    data: [
                        {
                            value: "8597"
                        },
                        {
                            value: "7747"
                        },
                        {
                            value: "7446"
                        },
                        {
                            value: "5644"
                        },
                        {
                            value: "9664"
                        },
                        {
                            value: "8557"
                        }
                    ]
                },
                {
                    seriesname: "Lasers",
                    data: [
                        {
                            value: "8569"
                        },
                        {
                            value: "6796"
                        },
                        {
                            value: "6897"
                        },
                        {
                            value: "5644"
                        },
                        {
                            value: "8587"
                        },
                        {
                            value: "8657"
                        }
                    ]
                },
                {
                    seriesname: "Enucleation",
                    data: [
                        {
                            value: "8849"
                        },
                        {
                            value: "5547"
                        },
                        {
                            value: "7458"
                        },
                        {
                            value: "4477"
                        },
                        {
                            value: "554"
                        },
                        {
                            value: "8547"
                        }
                    ]
                },
                {
                    seriesname: "Eye lid surgery",
                    data: [
                        {
                            value: "5879"
                        },
                        {
                            value: "7446"
                        },
                        {
                            value: "944"
                        },
                        {
                            value: "9667"
                        },
                        {
                            value: "755"
                        },
                        {
                            value: "6458"
                        }
                    ]
                },
                {
                    seriesname: "Eye muscle surgery",
                    data: [
                        {
                            value: "5987"
                        },
                        {
                            value: "7555"
                        },
                        {
                            value: "7445"
                        },
                        {
                            value: "8554"
                        },
                        {
                            value: "8547"
                        },
                        {
                            value: "2447"
                        }
                    ]
                }
            ]
        };



        $scope.myDataSource23 = {
            chart: {
                yaxisname: "No of campaigns",
                xaxisname: "years",
                showhovereffect: "1",
                drawcrossline: "1",
                plottooltext:"<b>$dataValue</b> $seriesName campaigns happened in year $label",
                theme: "fusion"
            },
            categories: [
                {
                    category: [
                        {
                            label: "2015-2016"
                        },
                        {
                            label: "2016-2017"
                        },
                        {
                            label: "2017-2018"
                        },
                        {
                            label: "2018-2019"
                        },
                        {
                            label: "2019-2020"
                        },
                        {
                            label: "2020-2021"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "Glaucoma campaign",
                    data: [
                        {
                            value: "100"
                        },
                        {
                            value: "210"
                        },
                        {
                            value: "100"
                        },
                        {
                            value: "123"
                        },
                        {
                            value: "26"
                        },
                        {
                            value: "95"
                        }
                    ]
                },
                {
                    seriesname: "Cataract campaign",
                    data: [
                        {
                            value: "231"
                        },
                        {
                            value: "122"
                        },
                        {
                            value: "220"
                        },
                        {
                            value: "234"
                        },
                        {
                            value: "55"
                        },
                        {
                            value: "90"
                        }
                    ]
                },
                {
                    seriesname: "Refractive campaign",
                    data: [
                        {
                            value: "200"
                        },
                        {
                            value: "103"
                        },
                        {
                            value: "110"
                        },
                        {
                            value: "102"
                        },
                        {
                            value: "70"
                        },
                        {
                            value: "105"
                        }
                    ]
                },
                {
                    seriesname: "Diabetic Retinopathy Campaign",
                    data: [
                        {
                            value: "144"
                        },
                        {
                            value: "120"
                        },
                        {
                            value: "124"
                        },
                        {
                            value: "231"
                        },
                        {
                            value: "15"
                        },
                        {
                            value: "95"
                        }
                    ]
                },
                {
                    seriesname: "Oncology Campaign",
                    data: [
                        {
                            value: "152"
                        },
                        {
                            value: "111"
                        },
                        {
                            value: "141"
                        },
                        {
                            value: "115"
                        },
                        {
                            value: "35"
                        },
                        {
                            value: "119"
                        }
                    ]
                }
            ]
        };

        $scope.myDataSource24 = {
           /* plottooltext: "<b>$yDataValue</b>$ is utilized in  <b>$seriesNames</b> in the age group of $label",*/
            chart: {
                xaxisname: "Age Decade",
                yaxisname: "Expenses",
                numberprefix: "$",
                formatnumberscale: "1",
                plottooltext:"<b>$dataValue is utilized in <b>$seriesName</b> n the age group of $label",
                theme: "fusion",
                drawcrossline: "1"
            },
            categories: [
                {
                    category: [
                        {
                            label: "0-10 yrs"
                        },
                        {
                            label: "11-20 yrs"
                        },
                        {
                            label: "21-30 yrs"
                        },
                        {
                            label: "31-40 yrs"
                        },
                        {
                            label: "41-50 yrs"
                        },
                        {
                            label: "51-60 yrs"
                        },
                        {
                            label: "61-70 yrs"
                        },
                        {
                            label: "71-80 yrs"
                        },
                        {
                            label: "81-90 yrs"
                        },
                        {
                            label: "91-100 yrs"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "India",
                    anchorbgcolor: "#d25400",
                    data: [
                        {
                          value: "5980074"
                        },
                        {
                            value: "560057"
                        },
                        {
                            value:"5800877"
                        },
                        {
                            value: "5800474"
                        },
                        {
                            value: "500674"
                        },
                        {
                            value:"6900874"
                        },
                        {
                            value: "5500997"
                        },
                        {
                            value: "5580074"
                        },
                        {
                            value: "2010054"
                        },
                        {
                            value: "1100020"
                        }
                    ]
                },
                {
                    seriesname: "Africa",
                    anchorbgcolor: "#f1c40f",
                    data: [
                        {
                            value: "8500997"
                        },
                        {
                            value: "756009"
                        },
                        {
                            value:"960067"
                        },
                        {
                            value: "5620074"
                        },
                        {
                            value: "550069"
                        },
                        {
                            value:"8500479"
                        },
                        {
                            value: "8570074"
                        },
                        {
                            value: "8005547"
                        },
                        {
                            value: "1234004"
                        },
                        {
                            value: "2003031"
                        }
                    ]
                },
                {
                    seriesname: "North Asia",
                    anchorbgcolor: "#008b86",
                    data: [
                        {
                            value: "5590097"
                        },
                        {
                            value: "850054"
                        },
                        {
                            value: "9600647"
                        },
                        {
                            value: "5600765"
                        },
                        {
                            value:"560074"
                        },
                        {
                            value:"9650047"
                        },
                        {
                            value: "8500547"
                        },
                        {
                            value: "6600547"
                        },
                        {
                            value:"2300036"
                        },
                        {
                            value: "1200030"
                        }
                    ]
                },
                {
                    seriesname: "Mongolia",
                    anchorbgcolor: "#f39c11",
                    data: [
                        {
                            value:"8890096"
                        },
                        {
                            value: "5900087"
                        },
                        {
                            value:"8500054"
                        },
                        {
                            value: "2600587"
                        },
                        {
                            value: "8500047"
                        },
                        {
                            value: "5590095"
                        },
                        {
                            value: "6650057"
                        },
                        {
                            value: "5005697"
                        },
                        {
                            value: "1300040"
                        },
                        {
                            value: "3340001"
                        }
                    ]
                },
                {
                    seriesname: "China",
                    anchorbgcolor: "#068cb0",
                    data: [
                        {
                            value: "7445007"
                        },
                        {
                            value: "8500097"
                        },
                        {
                            value: "6800585"
                        },
                        {
                            value: "5500864"
                        },
                        {
                            value: "8600067"
                        },
                        {
                            value: "8500224"
                        },
                        {
                            value: "4400588"
                        },
                        {
                            value: "5500471"
                        },
                        {
                            value: "2200154"
                        },
                        {
                            value: "1500012"
                        }
                    ]
                },
                {
                    seriesname: "Latin America",
                    anchorbgcolor: "#07a0d4",
                    data: [
                        {
                            value: "8890067"
                        },
                        {
                            value: "5500064"
                        },
                        {
                            value: "5200024"
                        },
                        {
                            value: "2280064"
                        },
                        {
                            value:"7450001"
                        },
                        {
                            value: "4400587"
                        },
                        {
                            value:"6690087"
                        },
                        {
                            value: "6300474"
                        },
                        {
                            value:"1220001"
                        },
                        {
                            value: "1300032"
                        }
                    ]
                }
            ]
        };


        $scope.myDataSource25 = {
            chart: {
                yaxisname: "Expenses",
                xaxisname: "Surgeries",
                numberprefix: "$",
                plottooltext:" <b>$dataValue</b> is utilized for $seriesName surgery in $label",
                theme: "fusion",
                drawcrossline: "1"
            },
            categories: [
                {
                    category: [
                        {
                            label: "India"
                        },
                        {
                            label: "Africa"
                        },
                        {
                            label: "North Asia"
                        },
                        {
                            label: "Mongolia"
                        },
                        {
                            label: "China"
                        },
                        {
                            label: "Latin America"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "Cataract",
                    data: [
                        {
                            value: "4000000"
                        },
                        {
                            value: "8300000"
                        },
                        {
                            value: "5000000"
                        },
                        {
                            value: "4200000"
                        },
                        {
                            value: "7900000"
                        },
                        {
                            value: "3800000"
                        }
                    ]
                },
                {
                    seriesname: "Trabeculectomy",
                    data: [
                        {
                            value: "3500000"
                        },
                        {
                            value: "6200000"
                        },
                        {
                            value: "4100000"
                        },
                        {
                            value: "3700000"
                        },
                        {
                            value: "7200000"
                        },
                        {
                            value: "310000"
                        }
                    ]
                },
                {
                    seriesname: "Vitreretinal surgery",
                    data: [
                        {
                            value: "2100000"
                        },
                        {
                            value: "400000"
                        },
                        {
                            value: "4500000"
                        },
                        {
                            value: "180000"
                        },
                        {
                            value: "5700000"
                        },
                        {
                            value: "270000"
                        }
                    ]
                },
                {
                    seriesname: "Injections",
                    data: [
                        {
                            value: "1800000"
                        },
                        {
                            value: "3300000"
                        },
                        {
                            value: "2300000"
                        },
                        {
                            value: "1600000"
                        },
                        {
                            value: "440000"
                        },
                        {
                            value: "3500000"
                        }
                    ]
                },
                {
                    seriesname: "Lasers",
                    data: [
                        {
                            value: "600000"
                        },
                        {
                            value: "2000000"
                        },
                        {
                            value: "2000000"
                        },
                        {
                            value: "500000"
                        },
                        {
                            value: "2300000"
                        },
                        {
                            value: "1500000"
                        }
                    ]
                },
                {
                    seriesname: "Enucleation",
                    data: [
                        {
                            value: "600000"
                        },
                        {
                            value: "2000000"
                        },
                        {
                            value: "2000000"
                        },
                        {
                            value: "500000"
                        },
                        {
                            value: "2300000"
                        },
                        {
                            value: "1500000"
                        }
                    ]
                },
                {
                    seriesname: "Eye lid surgery",
                    data: [
                        {
                            value: "600000"
                        },
                        {
                            value: "2000000"
                        },
                        {
                            value: "2000000"
                        },
                        {
                            value: "500000"
                        },
                        {
                            value: "2300000"
                        },
                        {
                            value: "1500000"
                        }
                    ]
                },
                {
                    seriesname: "Eye muscle surgery",
                    data: [
                        {
                            value: "600000"
                        },
                        {
                            value: "2000000"
                        },
                        {
                            value: "2000000"
                        },
                        {
                            value: "500000"
                        },
                        {
                            value: "2300000"
                        },
                        {
                            value: "1500000"
                        }
                    ]
                }
            ]
        };


        $scope.myDataSource26 = {
            chart: {
                xaxisname:"Age decade",
                yaxisname: "% of glasses prescribed",
                numbersuffix:"%",
                numdivlines: "3",
                showvalues: "0",
                legenditemfontsize: "15",
                legenditemfontbold: "1",
                plottooltext:"<b>$dataValue</b> was glasses prescribed in the age group of $seriesName in $label",
                theme: "fusion"
            },
            categories: [
                {
                    category: [
                        {
                            label: "0-10 yrs"
                        },
                        {
                            label: "11-20 yrs"
                        },
                        {
                            label: "21-30 yrs"
                        },
                        {
                            label: "31-40 yrs"
                        },
                        {
                            label: "41-50 yrs"
                        },
                        {
                            label: "51-60 yrs"
                        },
                        {
                            label: "61-70 yrs"
                        },
                        {
                            label: "71-80 yrs"
                        },
                        {
                            label: "81-90 yrs"
                        },
                        {
                            label: "91-100 yrs"
                        }
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "India",
                    data: [
                        {
                            value: "12.20%",
                            count:"8569",
                        },
                        {
                            value: "9.95%",
                            count: "6987",
                        },
                        {
                            value: "12.45%",
                            count: "8749",
                        },
                        {
                            value: "6.82%",
                            count: "4789",
                        },
                        {
                            value: "6.80%",
                            count: "4778",
                        },
                        {
                            value: "6.53%",
                            count: "4587",
                        },
                        {
                            value: "11.17%",
                            count: "7849",
                        },
                        {
                            value: "12.24%",
                            count: "8597",
                        },
                        {
                            value: "11.19%",
                            count: "7859",
                        },
                        {
                            value: "10.66%",
                            count: "7489",
                        }
                    ]
                },
                {
                    seriesname: "Africa",
                    data: [
                        {
                            value: "11.32%",
                            count: "8597",
                        },
                        {
                            value: "10.00%",
                            count: "7597",
                        },
                        {
                            value: "12.76%",
                            count: "9687",
                        },
                        {
                            value: "9.82%",
                            count: "7458",
                        },
                        {
                            value: "11.28%",
                            count: "8569",
                        },
                        {
                            value: "10.39%",
                            count: "7894",
                        },
                        {
                            value: "7.73%",
                            count: "5874",
                        },
                        {
                            value: "10.40%",
                            count: "7896",
                        },
                        {
                            value: "6.30%",
                            count: "4785",
                        },
                        {
                            value: "9.99%",
                            count: "7589",
                        }
                    ]
                },
                {
                    seriesname: "North Asia",
                    data: [
                        {
                            value: "6.86%",
                            count: "4777",
                        },
                        {
                            value: "10.71%",
                            count: "7458",
                        },
                        {
                            value: "9.88%",
                            count: "6879",
                        },
                        {
                            value: "8.17%",
                            count: "5689",
                        },
                        {
                            value: "8.19%",
                            count: "5698",
                        },
                        {
                            value: "10.71%",
                            count: "7458",
                        },
                        {
                            value: "10.04%",
                            count: "6987",
                        },
                        {
                            value: "10.76%",
                            count: "7489",
                        },
                        {
                            value: "13.92%",
                            count: "9687",
                        },
                        {
                            value: "10.76%",
                            count: "7489",
                        }
                    ]
                },
                {
                    seriesname: "Mongolia",
                    data: [
                        {
                            value: "12.82%",
                            count: "9657",
                        },
                        {
                            value: "12.82%",
                            count: "9657",
                        },
                        {
                            value: "10.48%",
                            count: "7896",
                        },
                        {
                            value: "6.35%",
                            count: "4785",
                        },
                        {
                            value: "7.80%",
                            count: "5874",
                        },
                        {
                            value: "9.90%",
                            count: "7459",
                        },
                        {
                            value: "11.68%",
                            count: "8796",
                        },
                        {
                            value: "6.36%",
                            count: "4789",
                        },
                        {
                            value: "9.90%",
                            count: "7458",
                        },
                        {
                            value: "11.90%",
                            count: "8967",
                        }
                    ]
                },
                {
                    seriesname: "China",
                    data: [
                        {
                            value: "11.04%",
                            count: "7458",
                        },
                        {
                            value: "11.04%",
                            count: "7459",
                        },
                        {
                            value: "10.98%",
                            count: "7418",
                        },
                        {
                            value: "3.80%",
                            count: "2567",
                        },
                        {
                            value: "7.09%",
                            count: "4789",
                        },
                        {
                            value: "10.34%",
                            count: "6987",
                        },
                        {
                            value: "11.62%",
                            count: "7854",
                        },
                        {
                            value: "10.34%",
                            count: "6987",
                        },
                        {
                            value: "12.72%",
                            count: "8597",
                        },
                        {
                            value: "11.04%",
                            count: "7458",
                        }
                    ]
                },
                {
                    seriesname: "Latin America",
                    data: [
                        {
                            value: "11.14%",
                            count: "8569",
                        },
                        {
                            value: "11.99%",
                            count: "6987",
                        },
                        {
                            value: "9.26%",
                            count: "8749",
                        },
                        {
                            value: "9.26%",
                            count: "4789",
                        },
                        {
                            value: "8.18%",
                            count: "4778",
                        },
                        {
                            value: "7.27%",
                            count: "4587",
                        },
                        {
                            value: "12.26%",
                            count: "7849",
                        },
                        {
                            value: "12.02%",
                            count: "8597",
                        },
                        {
                            value: "9.30%",
                            count: "7859",
                        },
                        {
                            value: "9.31%",
                            count: "7489",
                        }
                    ]
                }
            ]
        };

        $scope.myDataSource27 = {
            chart: {
                theme: "fusion",
                showlabels: "1",
                showvalues: "1",
                showpercentvalues: "1",
                streamlineddata: "0",
                plottooltext: "$label: <b>$dataValue</b>"
            },
            data: [
                {
                    label: "Refractive Errors",
                    value: "9874",
                    discountpercentage:"16.68%",
                },
                {
                    label: "Cataract",
                    value: "10598",
                    discountpercentage: "17.91%"
                },
                {
                    label: "Keratoconus",
                    value: "6021",
                    discountpercentage: "10.17%"
                },
                {
                    label: "Glaucoma",
                    value: "10256",
                    discountpercentage: "17.33%"
                },
                {
                    label: "Diabetic Retinopathy",
                    value: "10987",
                    discountpercentage: "18.56%"
                },
                {
                    label: "Age-related macular degeneration",
                    value: "10897",
                    discountpercentage: "18.41%"
                },
                {
                    label: "Retinitis Pigmentosa",
                    value: "556",
                    discountpercentage: "0.94%"
                }
            ]
        };


        $scope.myDataSource28 = {
            chart: {
                xaxisname: "Country",
                yaxisname: "Number of Millions",
                legendposition: "Right",
                drawanchors: "0",
                showvalues: "0",
                plottooltext: "<b>$dataValue</b> of funds provided to $label",
                theme: "fusion"
            },
            data: [
                {
                    label: "India",
                    value: "8899650"
                },
                {
                    label: "Africa",
                    value: "5566599"
                },
                {
                    label: "North Asia",
                    value: "4454777"
                },
                {
                    label: "Mongolia",
                    value: "8882774"
                },
                {
                    label: "China",
                    value: "9542414"
                },
                {
                    label: "Latin America",
                    value: "5569697"
                } 
            ]
        };


        $scope.myDataSource29 =  {
            chart: {
                plottooltext: "<b>$percentValue</b> of Expenses on $label",
                showlegend: "1",
                showpercentvalues: "1",
                legendposition: "bottom",
                usedataplotcolorforlabels: "1",
                theme: "fusion"
            },
            data: [
                {
                    label: "Travel",
                    value: "8899777"
                },
                {
                    label: "Campaigns",
                    value: "5566997"
                },
                {
                    label: "Surgery wise",
                    value: "6699878"
                },
                {
                    label: "Inventory",
                    value: "8559974"
                },
                {
                    label: "Glasses purchased",
                    value: "7789968"
                },
                {
                    label: "Staff",
                    value: "7265577"
                },
                {
                    label: "Flight manintenance",
                    value: "9988477"
                }
            ]
        }


        $scope.myDataSource30 = {
            chart: {
                yaxisname: "% of Opthal Training",
                xaxisname: "Country",
                anchorradius: "5",
                plottooltext: "<b>$dataValue</b> of opthal traning provided in $label",
                showhovereffect: "1",
                showvalues: "0",
                numbersuffix: "%",
                theme: "fusion",
                anchorbgcolor: "#72D7B2",
                palettecolors: "#72D7B2"
            },
            data: [
                {
                    label: "India",
                    value: "26.81"
                },
                {
                    label: "Africa",
                    value: "17.04"
                },
                {
                    label: "North Asia",
                    value: "29.86"
                },
                {
                    label: "Mongolia",
                    value: "16.89"
                },
                {
                    label: "China",
                    value: "4.65"
                },
                {
                    label: "Latin America",
                    value: "4.75"
                } 
            ]
        };

        $scope.myDataSource31 = {
            chart: {
               
                xaxisname: "Diagnosis",
                yaxisname: "% of Diagnosis",
                formatnumberscale: "1",
                numbersuffix: "%",
                plottooltext:"<b>$dataValue</b> patients with <b>$label</b> were <b>$seriesName</b>",
                theme: "fusion",
                drawcrossline: "1"
            },
            categories: [
                {
                    category: [
                        {
                            label: "0-9 mmHg"
                        },
                        {
                            label: "10-21 mmHg"
                        },
                        {
                            label: "22-30 mmHg"
                        },
                        {
                            label: "> 30 mmHg"
                        } 
                    ]
                }
            ],
            dataset: [
                {
                    seriesname: "Refractive errors",
                    data: [
                        {
                            value: "6.11"
                        },
                        {
                            value: "26.12"
                        },
                        {
                            value: "6.06"
                        },
                        {
                            value: "16.31"
                        } 
                    ]
                },
                {
                    seriesname: "Cataract",
                    data: [
                        {
                            value: "11.23"
                        },
                        {
                            value: "20.49"
                        },
                        {
                            value: "14.80"
                        },
                        {
                            value: "18.23"
                        }
                    ]
                },
                {
                    seriesname: "Keratoconus",
                    data: [
                        {
                            value: "5.85"
                        },
                        {
                            value: "23.12"
                        },
                        {
                            value: "6.49"
                        },
                        {
                            value: "3.54"
                        }
                    ]
                },
                {
                    seriesname: "Glaucoma",
                    data: [
                        {
                            value: "22.61"
                        },
                        {
                            value: "5.28"
                        },
                        {
                            value: "17.53"
                        },
                        {
                            value: "25.46"
                        }
                    ]
                },
                {
                    seriesname: "Diabetic Retinopathy",
                    data: [
                        {
                            value: "26.33"
                        },
                        {
                            value: "3.23"
                        },
                        {
                            value: "25.80"
                        },
                        {
                            value: "16.11"
                        }
                    ]
                },
                {
                    seriesname: "Age-related macular degeneration",
                    data: [
                        {
                            value: "6.80"
                        },
                        {
                            value: "10.04"
                        },
                        {
                            value: "17.37"
                        },
                        {
                            value: "7.29"
                        }
                    ]
                },
                {
                    seriesname: "Retinitis Pigmentosa",
                    data: [
                        {
                            value: "21.06"
                        },
                        {
                            value: "11.73"
                        },
                        {
                            value: "11.95"
                        },
                        {
                            value: "13.07"
                        }
                    ]
                } 
            ]
        };
    }


   
    $scope.init();



    $scope.GenderArray = [
        {
            "GenderId": 1,
            "GenderName": "Male",
        },
        {
            "GenderId": 2,
            "GenderName": "Female",
        }
    ];


    $scope.TotalPatientsCount = "60000";
    $scope.TotalMalePatientsCount = "40000";
    $scope.TotalFemalePatientsCount = "20000";

    $scope.PatientsCountArray = [
        {
            "genderId": 1,
            "genderName": "Male",
            "count": "40000",
            "percentage": "66.67%"
        },
        {
            "genderId": 2,
            "genderName": "Female",
            "count": "20000",
            "percentage": "33.33%"
        }
    ];

    $scope.PatientAgeCategory = [
        {
            "ageCategoryId": 1,
            "ageCategoryName": "0 - 10 yrs"
        },
        {
            "ageCategoryId": 2,
            "ageCategoryName": "11 - 20 yrs"
        },
        {
            "ageCategoryId": 3,
            "ageCategoryName": "21 - 30 yrs"
        },
        {
            "ageCategoryId": 4,
            "ageCategoryName": "31 - 40 yrs"
        },
        {
            "ageCategoryId": 5,
            "ageCategoryName": "41 - 50 yrs"
        },
        {
            "ageCategoryId": 6,
            "ageCategoryName": "51 - 60 yrs"
        },
        {
            "ageCategoryId": 7,
            "ageCategoryName": "61 - 70 yrs"
        },
        {
            "ageCategoryId": 8,
            "ageCategoryName": "71 - 80 yrs"
        },
        {
            "ageCategoryId": 9,
            "ageCategoryName": "81 - 90 yrs"
        },
        {
            "ageCategoryId": 10,
            "ageCategoryName": "91 - 100 yrs"
        }
    ];


    

}]);
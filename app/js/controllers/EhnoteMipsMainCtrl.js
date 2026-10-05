"use strict";
eHnoteWebApp.controller("EhnoteMipsMainCtrl", ["$scope", "$http", "$log", "$rootScope", "$uibModal", "$routeParams", "$filter", "$timeout", "alertify", "eHnoteMasterDataService", "eHnoteUserDataService", "eHnoteMainAppointmentService", "eHnotePatientDataService", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnoteMainAdminServices", "datapersistanceFactory", "$window", "eHnotePatientVisitReasonServices", "eHnoteCacheStorageService", "eHnoteConditionsDataService", "eHnoteSettingsDataService", "eHnoteDiagnosisDataServices", "$location", function ($scope, $http, $log, $rootScope, $uibModal, $routeParams, $filter, $timeout, alertify, eHnoteMasterDataService, eHnoteUserDataService, eHnoteMainAppointmentService, eHnotePatientDataService, eHnoteUserAppointmentDataService, localStorageFactory, eHnoteMainAdminServices, datapersistanceFactory, $window, eHnotePatientVisitReasonServices, eHnoteCacheStorageService, eHnoteConditionsDataService, eHnoteSettingsDataService, eHnoteDiagnosisDataServices, $location) {


    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID;
    $scope.UserId = eHnoteMasterDataService.getLoginId();

    $scope.EhnoteMainMipsTabs = {
        "EhnoteMipsTabs": '',
    };
    $scope.EhnoteMainMipsTabs.EhnoteMipsTabs = 'Dashboard';
    $scope.SwitchMipsTabs = function (type) {
        if (type == 'Dashboard') {
            $scope.EhnoteMainMipsTabs.EhnoteMipsTabs = 'Dashboard';
        }
        else if (type == 'List') {
            $scope.EhnoteMainMipsTabs.EhnoteMipsTabs = 'List';
        }
        else if (type == 'Automated') {
            $scope.EhnoteMainMipsTabs.EhnoteMipsTabs = 'Automated';
        }
        else if (type == 'Measures') {
            $scope.EhnoteMainMipsTabs.EhnoteMipsTabs = 'Measures';
        }
        else {
            console.log('checking')
        }
    }
    $scope.GetMainMipsReportObj = {
        "MipsReport_StartDate": $filter('date')(new Date(), "MM-dd-yyyy") || "",
        "MipsReport_EndDate": $filter('date')(new Date(), "MM-dd-yyyy") || "",
        "MipsReport_ProviderName": "",
        "MipsReport_AuthorName": "",
        "MipsReport_CQMS": "",
        "AllDoctorCheck": true,
        "AllCQMSCheck":true,
    }
    $scope.AutomatedMeasureReportObj = {
        "AutomatedMeasure_StartDate": "",
        "AutomatedMeasure_EndDate": "",
        "AutomatedMeasure_DoctorIDs": "",
        "AutomatedMeasure_AllDoctorsCheck": "",
        "AutomatedMeasure_DoctorID":""
    }
    $scope.AutomatedMeasureReportObj.AutomatedMeasure_StartDate = $filter('date')(new Date(), 'MM-dd-yyyy');
    $scope.AutomatedMeasureReportObj.AutomatedMeasure_EndDate = $filter('date')(new Date(), 'MM-dd-yyyy');


    $scope.MeasureReport = function () {
        var obj = {
            "FromDate": "",
            "ToDate": "",
            "Type": "",
            "OrganizationId":"",
            "DoctorId":0,
        }
        return obj;
    }
    $scope.MeasureReportObj = $scope.MeasureReport();
    $scope.MeasureReportObj.FromDate = $filter('date')(new Date(), 'MM-dd-yyyy');
    $scope.MeasureReportObj.ToDate = $filter('date')(new Date(), 'MM-dd-yyyy');
    $scope.MeasureType = function () {
        var obj = [
            {
                "TypeName": "RT1/Electronic Prescribing",
                "Type": "RT1"
            },
            {
                "TypeName": "RT2/Patient Electronic Access",
                "Type": "RT2"
            },
            {
                "TypeName": "RT7/Transitions of Care",
                "Type": "RT7"
            },
            {
                "TypeName": "RT15/Reconciling Health Information",
                "Type": "RT15"
            },
        ]
        return obj;
    }
    $scope.MeasureTypeArray = $scope.MeasureType();
    $scope.selectedMipsDoctor = "Select Doctor";
    $scope.selectedAutomatedMeasureReport = "All";
    $scope.selectedCQMSList = "All";
    $scope.AutomatedNewReportData = [];
    $scope.stopClosingDropDown = function () {
        event.stopPropagation();
    }   
    $scope.searchDoctorInMipReport = { "txt1": "", "txt2": "" };
    $scope.searchCQMSInMipReport = { "txt1": "", "txt2": "" };
    $scope.searchDoctorInAutomatedMeasureReport = { "txt1": "", "txt2": "" };
    $scope.GetScribeDoctorList = function () {
        $scope.allSubSpecializationsArray = [];
        var doctorInfo = eHnoteMasterDataService.getUserInfo();
        eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorInfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.row.length > 0) {
                    $scope.allSubSpecializationsArray = resp.data.row;
                    $scope.listSubSplArray = angular.copy(resp.data.row);
                    angular.forEach($scope.allSubSpecializationsArray, function (item) {
                        item.isChecked = true;
                    });
                }
                var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

                var reqObj = {
                    "BranchId": $scope.HospitalId,
                    "SubSpecializationIdArray": subSplArray
                }
                eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                function onGetUsersSuccess(resp) {
                    if (resp.rows.length > 0) {
                        $scope.allUserList = resp.rows;
                        $scope.AllDoctorList = resp.rows;
                        $scope.MipsReportDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                        $scope.AutomatedMeasureDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                        $scope.MipsReportDoctorList = $filter("filter")($scope.AutomatedMeasureDoctorList, function (item) {
                            return item.RoleId === 1 || item.RoleId === 43;
                        });
                        $scope.AutomatedMeasureDoctorList = $filter("filter")($scope.AutomatedMeasureDoctorList, function (item) {
                            return item.RoleId === 1 || item.RoleId === 43;
                        });
                        if ($scope.MipsReportDoctorList.length > 0) {
                            angular.forEach($scope.MipsReportDoctorList, function (citem, $index) {
                                citem.id = citem.DoctorID;
                                citem.title = citem.FullName;
                                citem.isChecked = true;
                            });
                        }
                        if ($scope.AutomatedMeasureDoctorList.length > 0) {
                            angular.forEach($scope.AutomatedMeasureDoctorList, function (citem, $index) {
                                citem.id = citem.DoctorID;
                                citem.title = citem.FullName;
                                citem.isChecked = true;
                            });
                            $scope.AutomatedMeasureReportObj.AutomatedMeasure_AllDoctorsCheck = true;
                        }
                    }
                }
                function onGetUsersFailure(data) {
                }

            }
        });
    }


    $scope.init = function () {
        $scope.GetScribeDoctorList();
        $scope.CQMQRDACAT3Details = [];
        $scope.CQMQRDACAT1Details = [];
    }

    $scope.init();

    $scope.GetCQMSlistData = function () {
        eHnoteMainAppointmentService.GetCQMSListData().then(function (resp) {
            if (resp.data.length > 0) {
                $scope.CQMSList = [];
                $scope.CQMSList = resp.data;
                if ($scope.CQMSList.length > 0) {
                    angular.forEach($scope.CQMSList, function (citem, $index) {
                        citem.isChecked = true;
                    });
                }
            }
        }, function () {
      });
    }
    $scope.GetCQMSlistData();
    $scope.MipsReportcheckAllDoctor = function (val) {
        if (val) {
            angular.forEach($scope.MipsReportDoctorList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedMipsDoctor = 'All';
        } else {
            angular.forEach($scope.MipsReportDoctorList, function (item) {
                item.isChecked = false;
            });
            $scope.selectedMipsDoctor = 'Select Doctors';
        }
        var checkedArray = _.where($scope.MipsReportDoctorList, { isChecked: true });
        $scope.GetMainMipsReportObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MipsReportDoctorList.length === checkedArray.length ? true : false;
    };
    $scope.MipsReportDoctorToggle = function () {
        var checkedArray = _.where($scope.NewPatientReportDoctorList, { isChecked: true });
        $scope.GetMainMipsReportObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MipsReportDoctorList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedMipsDoctor = "Select Doctor";
        } else {
            if (checkedArray.length === 1) {
                //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                $scope.selectedMipsDoctor = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.selectedMipsDoctor = "Selected Doctors";
            }
        }
    }
    $scope.SearchMipsList = function () {
        if ($scope.GetMainMipsReportObj.MipsReport_ProviderName == '') {
            alertify.error("Please Select  Doctor");
            return;
        }
        var selectedCQMSList = $filter("filter")($scope.CQMSList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedCQMSList.length == 0) {
            alertify.error("Please Select at Least one CQMS");
            return false;
        }
        var OrganizationId = $scope.HospitalId;
        var newlist = "";
        for (var i in $scope.MipsReportDoctorList) {
            if ($scope.MipsReportDoctorList[i].isChecked) {
                newlist += "," + $scope.MipsReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }
        var newlistCQMS = "";
        for (var i in $scope.CQMSList) {
            if ($scope.CQMSList[i].isChecked) {
                newlistCQMS += "," + $scope.CQMSList[i].Id;
            }
        }
        if (newlistCQMS.charAt(0) === ",") {
            newlistCQMS = newlistCQMS.slice(1);
        }

        var DoctorId = $scope.GetMainMipsReportObj.MipsReport_ProviderName;
        var UserId = $scope.UserId;
        var req = {
            "FromDate": $scope.GetMainMipsReportObj.MipsReport_StartDate||'',
            "ToDate": $scope.GetMainMipsReportObj.MipsReport_EndDate||"",
            "OrganizationId": OrganizationId||"",
            "DoctorId": DoctorId||0 ,
            "UserId": UserId||"",
            "CQMId": newlistCQMS,
        }
        eHnoteMainAppointmentService.getMipsReportByDoctorIds(req).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.MipsReportsFromDate = resp.data.FromDate || "";
                $scope.MipsReportsToDate = resp.data.ToDate || "";
                $scope.CQMQRDACAT3Details = resp.data.CQMQRDACAT3Details || [];
                $scope.CQMQRDACAT1Details = resp.data.CQMQRDACAT1Details || [];
                $scope.CQMDenominatorMasterDetails = resp.data.CQMDenominatorMasterDetails || [];
                $scope.CQMDenominatorExclusionMasterDetails = resp.data.CQMDenominatorExclusionMasterDetails || [];
                $scope.CQMNumeratorMasterDetails = resp.data.CQMNumeratorMasterDetails || [];
            }
        });
        function onGetUsersFailure(data) {
        }
    }
    $scope.GetQrdaDocument = function () {
        if ($scope.GetMainMipsReportObj.MipsReport_ProviderName == '') {
            alertify.error("Please Select  Doctor");
            return;
        }
        var selectedCQMSList = $filter("filter")($scope.CQMSList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedCQMSList.length == 0) {
            alertify.error("Please Select at Least one CQMS");
            return false;
        }
        var OrganizationId = $scope.HospitalId;
        var newlist = "";
        for (var i in $scope.MipsReportDoctorList) {
            if ($scope.MipsReportDoctorList[i].isChecked) {
                newlist += "," + $scope.MipsReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }
        var newlistCQMS = "";
        for (var i in $scope.CQMSList) {
            if ($scope.CQMSList[i].isChecked) {
                newlistCQMS += "," + $scope.CQMSList[i].Id;
            }
        }
        if (newlistCQMS.charAt(0) === ",") {
            newlistCQMS = newlistCQMS.slice(1);
        }

        var DoctorId = $scope.GetMainMipsReportObj.MipsReport_ProviderName;
        var UserId = $scope.UserId;
        var req = {
            "FromDate": $scope.GetMainMipsReportObj.MipsReport_StartDate||'',
            "ToDate": $scope.GetMainMipsReportObj.MipsReport_EndDate||"",
            "OrganizationId": OrganizationId||"",
            "DoctorId": DoctorId||0 ,
            "UserId": UserId||"",
            "CQMId": newlistCQMS,
        }
        eHnoteMainAppointmentService.GetQrdaDocument(req).then(function (resp) {
            if (resp.data != null) {
                var abc = resp.data;
                window.open(abc);
            } else {
                window.open("https://ehnotedevstorage.blob.core.windows.net/dev/3/Attachment/Send/171-20230929072152.xml", "_blank");
            }
        });
        function onGetUsersFailure(data) {
        }
    }

    $scope.MipsReportcheckAllCQMS = function (val) {
        if (val) {
            angular.forEach($scope.CQMSList, function (item) {
                item.isChecked = true;
            });
            $scope.selectedCQMSList = 'All';
        } else {
            angular.forEach($scope.CQMSList, function (item) {
                item.isChecked = false;
            });
            $scope.selectedCQMSList = 'Select CQMS';
        }
        var checkedArray = _.where($scope.CQMSList, { isChecked: true });
        $scope.GetMainMipsReportObj.AllCQMSCheck = checkedArray.length > 0 && $scope.CQMSList.length === checkedArray.length ? true : false;
    };

    $scope.MipsReportCQMSToggle = function () {
        var checkedArray = _.where($scope.CQMSList, { isChecked: true });
        $scope.GetMainMipsReportObj.AllCQMSCheck = checkedArray.length > 0 && $scope.CQMSList.length === checkedArray.length ? true : false;
        if (checkedArray.length == 0) {
            $scope.selectedCQMSList = "Select CQMS";
        } else {
            if (checkedArray.length === 1) {
                //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                $scope.selectedCQMSList = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.selectedCQMSList = "Selected CQMS";
            }
        }
    }



    $scope.viewQrda1Document = function (item) {
        var req = {
            "FromDate": $scope.GetMainMipsReportObj.MipsReport_StartDate || '',
            "ToDate": $scope.GetMainMipsReportObj.MipsReport_EndDate || "",
            "PatientId": item.PatientId,
            "UserKey": item.UserKey,
            "OrganizationId": $scope.HospitalId || "",
            "UserId": $scope.UserId
        }

        eHnoteMainAppointmentService.GetCQMDetailbyPatientId(req).then(function (resp) {
            if (resp.data != null) {
                var abc = resp.data;
                window.open(abc);
            } else {
                window.open("https://ehnotedevstorage.blob.core.windows.net/dev/1/QRDA_Cat-1_B148130F-5C35-484D-B249-15834C4757BE_4002_Provider,%20Provider_1_20230928_0139.xml", "_blank");
            }
        });
        function onGetUsersFailure(data) {
        }
    }
    $scope.AutomatedMeasureDoctorToggle = function () {
        var checkedArray = _.where($scope.AutomatedMeasureDoctorList, { isChecked: true });
        $scope.AutomatedMeasureReportObj.AutomatedMeasure_AllDoctorsCheck = checkedArray.length > 0 && $scope.AutomatedMeasureDoctorList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedAutomatedMeasureReport = "Select Doctor";
        } else {
            if (checkedArray.length === 1) {
                //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                $scope.selectedAutomatedMeasureReport = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.selectedAutomatedMeasureReport = "Selected Doctors";
            }
        }
    }
    $scope.AutomatedMeasureReportcheckAllDoctor = function (val) {
        if (val) {
            angular.forEach($scope.AutomatedMeasureDoctorList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedAutomatedMeasureReport = 'All';
        } else {
            angular.forEach($scope.AutomatedMeasureDoctorList, function (item) {
                item.isChecked = false;
            });
            $scope.selectedAutomatedMeasureReport = 'Select Doctors';
        }
        var checkedArray = _.where($scope.AutomatedMeasureDoctorList, { isChecked: true });
        $scope.AutomatedMeasureReportObj.AutomatedMeasure_AllDoctorsCheck = checkedArray.length > 0 && $scope.AutomatedMeasureDoctorList.length === checkedArray.length ? true : false;
    };
    $scope.SearchAutomatedMeasureReport = function () {
        if ($scope.AutomatedMeasureReportObj.AutomatedMeasure_StartDate == '') {
            alertify.error("Please Select  StartDate");
            return;
        }
        if ($scope.AutomatedMeasureReportObj.AutomatedMeasure_EndDate == '') {
            alertify.error("Please Select  EndDate");
            return;
        }
        if ($scope.AutomatedMeasureReportObj.AutomatedMeasure_DoctorID=="") {
            alertify.error("Please Select Doctor");
            return;
        }
        //var SelectedDoctors = $filter("filter")($scope.AutomatedMeasureDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        //if (SelectedDoctors.length == 0) {
        //    alertify.error("Please Select at Least one Doctor");
        //    return false;
        //}
        var OrganizationId = $scope.HospitalId;
        //var newlist = "";
        //for (var i in $scope.AutomatedMeasureDoctorList) {
        //    if ($scope.AutomatedMeasureDoctorList[i].isChecked) {
        //        newlist += "," + $scope.AutomatedMeasureDoctorList[i].DoctorID;
        //    }
        //}
        //if (newlist.charAt(0) === ",") {
        //    newlist = newlist.slice(1);
        //}
        var UserId = $scope.UserId;
        var StartDate = $filter('date')(new Date($scope.AutomatedMeasureReportObj.AutomatedMeasure_StartDate), 'yyyy-MM-dd');
        var EndDate = $filter('date')(new Date($scope.AutomatedMeasureReportObj.AutomatedMeasure_EndDate), 'yyyy-MM-dd');
        var DoctorId = $scope.AutomatedMeasureReportObj.AutomatedMeasure_DoctorID || 0;
        var req = {
            "FromDate": StartDate || '',
            "ToDate": EndDate || "",
            "OrganizationId": OrganizationId || "",
            "DoctorId": DoctorId || 0,
            "UserId": UserId || "",
        }
        eHnoteMainAppointmentService.getAutomatedMeasureReportByDoctorIds(req).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.AutomatedMeasureDataList = [];
                $scope.AutomatedMeasureDataList = resp.data || [];
                $scope.AutomatedMUResults = resp.data.MUResults || [];
            }
        });
        function onGetUsersFailure(data) {
        }
    }
    $scope.SearchNewAutomatedMeasure = function () {
        if ($scope.MeasureReportObj.Type == "") {
            alertify.error("Please Select Type");
            return;
        }
        var OrganizationId = $scope.HospitalId;
        var StartDate = $filter('date')(new Date($scope.MeasureReportObj.FromDate), 'yyyy-MM-dd');
        var EndDate = $filter('date')(new Date($scope.MeasureReportObj.ToDate), 'yyyy-MM-dd');
        var Type = $scope.MeasureReportObj.Type;
        var req = {
            "FromDate": StartDate || '',
            "ToDate": EndDate || "",
            "OrganizationId": OrganizationId || "",
            "Type": Type || 0,
            "DoctorId": $scope.MeasureReportObj.DoctorId || 0,
        }
        eHnoteMainAppointmentService.GetAutomatedMeasureReportByType(req).then(function (resp) {
            if (resp.data != "") {
                $scope.AutomatedNewReportData = [];
                $scope.AutomatedNewReportMeasureDetails = [];
                $scope.AutomatedNewReportData = resp.data || [];
                $scope.AutomatedNewReportMeasureDetails = resp.data.MeasureDetails || [];

                // for Changing mobile no into Us formate
                if ($scope.AutomatedNewReportMeasureDetails.length > 0) {
                    angular.forEach($scope.AutomatedNewReportMeasureDetails, function (aitem) {
                        if (aitem.DenominatorDetails.length > 0) {
                            angular.forEach(aitem.DenominatorDetails, function (nitem) {
                                if (nitem.MobileNo != '') {
                                    var MobileNo = eHnoteUserDataService.UsMobileFormatChange(nitem.MobileNo);
                                    nitem.MobileNo = MobileNo.UsFormatMobileNumber;
                                }
                            });
                        }
                        if (aitem.NumeratorDetails.length > 0) {
                            angular.forEach(aitem.NumeratorDetails, function (nitem) {
                                if (nitem.MobileNo != '') {
                                    var MobileNo = eHnoteUserDataService.UsMobileFormatChange(nitem.MobileNo);
                                    nitem.MobileNo = MobileNo.UsFormatMobileNumber;
                                }
                            });
                        }
                    });
                }
            }
            else {
                $scope.AutomatedNewReportData = [];
                $scope.AutomatedNewReportMeasureDetails = [];
                alertify.error('an error occured');
                return false;
            }
        });
        function onGetUsersFailure(data) {
        }
    }
    $scope.ShowHideMeasureUserData = function (item) {
        item.IsShowAllUserData = !item.IsShowAllUserData;
    }
}]);
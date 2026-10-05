"use strict";
eHnoteWebApp.controller("UsPreAuthorizationCtrl", ["$scope", "$http", "$log", "$rootScope", "$uibModal", "$routeParams", "$filter", "$timeout", "alertify", "eHnoteMasterDataService", "eHnoteInsuranceService", "eHnotePatientAddressDataServices", "eHnotePatientDataService", "InventoryService", function ($scope, $http, $log, $rootScope, $uibModal, $routeParams, $filter, $timeout, alertify, eHnoteMasterDataService, eHnoteInsuranceService, eHnotePatientAddressDataServices, eHnotePatientDataService, InventoryService) {


    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    }

    function GetAddPreAuthorization() {
        var obj = {
            "PatientPreAuthorizationId": 0,
            "UserId": $scope.UserId,
            "BranchId": $scope.HospitalId,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "PatientId": 0,
            "PayorId": 0,
            "PreAuthorizationNumber": "",
            "StartDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "EndDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "NumberOfVisits": "",
            "TOSCodeId": 0,
            "Notes": "",
            "DeleteInd" : "N",
            "PayorObj": "",
            "ServiceTypeobj": "",
            "patientDocumentDetails": [],
            "TempDocuments": [],
            "FullName" : ""
        };
        return obj;
    };

    $scope.AddPreAuthorizationObj = GetAddPreAuthorization();
    $scope.SearchPatient = {
        "SearchText": "",
        "TypeId" : 1
    };
    $scope.GetSearchPatient = {
        "SearchText": "",
        "TypeId" : 1
    };
    $scope.PatientsList = [];
    $scope.GetPatientsList = [];
    function GetAuthorizationObj() {
        var obj = {
            "BranchId": $scope.HospitalId,
            "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "PatientId":0,
            "Status": 0,
            "PageSize": 10,
            "PageNumber": 1
        };
        return obj;
    };
    $scope.GetListObj = GetAuthorizationObj();
    $scope.GetListPageCount = 0;
    $scope.GetPreAuthorizationArray = [];
    $scope.StatusList = [
        {"Id" : 0, "Name" : "All"},
        {"Id" : 1, "Name" : "Active"},
        {"Id" : 2, "Name" : "Expiry"}
    ];

    $scope.OrganizationPayorList = [];
    $scope.GetOrganizationNewPayorAllList = function (val) {
        var param = {
            "SearchText": val,
            "PageSize": 100,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.HospitalId,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "GetAllIndicator": 0,
            "PayorTypeId": 0
        }
        eHnoteInsuranceService.GetOrganizationPayorsList(param).then(function (response) {
            //if (response.data.rows !== undefined) {
            //    return response.data.rows.map(function (item) {
            //        return item;
            //    });
            //}
            $scope.OrganizationPayorList = [];
            if (response.data.rows !== undefined) {
                $scope.OrganizationPayorList = response.data.rows;
            }
        });
    };
    $scope.GetOrganizationNewPayorAllList();
    $scope.onSelectPayor = function (authorization) {
        authorization.PayorObj = authorization.PayorObj || "";
        if (authorization.PayorObj == "") {
            authorization.PayorObj = "";
            authorization.PayorId = 0;
        } else {
            authorization.PayorId = authorization.PayorObj.PayorId;
        }
    };
    $scope.ChangePayor = function (authorization) {
        authorization.PayorId = 0;
    };

    $scope.OrgTOSCODESArray = [];
    $scope.getOrganizationTOSCodes = function () {

        eHnotePatientAddressDataServices.GetOrganizationTOSCodes($scope.ParenthospitalId).then(function (resp) {
            console.log(resp);
            if (resp.data.rows.length > 0) {
                $scope.OrgTOSCODESArray = resp.data.rows || [];
            }
        });
    };
    $scope.getOrganizationTOSCodes();
    $scope.changeTOSCode = function (authorization) {
        authorization.ServiceTypeobj = authorization.ServiceTypeobj || "";
        if (authorization.ServiceTypeobj != "") {
            authorization.TOSCodeId = authorization.ServiceTypeobj.ServicesTypeId;
        }
    };

    $scope.LoadPatientSearch = function (val, type, gettype) {
        val = val || "";

        $scope.AddPreAuthorizationObj.PatientId = 0;
        $scope.GetListObj.PatientId = 0;

        if (type === 1) {
            if (val.length < 3) {
                return false;
            }
        } else if (type === 2){
            if (val.length !== 10) {
                return false;
            }
        }
        if (type === 1) {
            var obj = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "Name": val,
                "Mobile": null,
                "PatientId": null,
                "PageSize": 10,
                "PageNo": 1
            };
        } else if (type === 2) {
            var obj = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "Name": null,
                "Mobile": null,
                "PatientId": val,
                "PageSize": 10,
                "PageNo": 1
            };
        }

        return InventoryService.SearchInvPatient(obj).then(function (resp) {
            $scope.PatientsList = [];
            $scope.GetPatientsList = [];
            if (resp.data.data.length !== 0) {
                if (resp.data.data != undefined) {
                    if (gettype == "popup") {
                        $scope.PatientsList = resp.data.data || [];
                    } else if (gettype == "pre") {
                        $scope.GetPatientsList = resp.data.data || [];
                    }
                }
                return $scope.PatientsList.map(function (item) {
                    if (item.MobileNo === 0) {
                        item.MobileNo = "";
                    }
                    return item;
                });

            }
        }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
    };
    $scope.onSelectPatient = function (patientitem) {
        $scope.PatientsList = [];
        $scope.SearchPatient.SearchText = patientitem.fullname;
        $scope.AddPreAuthorizationObj.PatientId = patientitem.PatientId;
        $scope.AddPreAuthorizationObj.FullName = patientitem.fullname;
    };

    $scope.AddPreAuthorization = function () {
        $scope.AddPreAuthorizationObj.StartDate = $filter('date')(new Date($scope.AddPreAuthorizationObj.StartDate), "yyyy-MM-dd");
        $scope.AddPreAuthorizationObj.EndDate = $filter('date')(new Date($scope.AddPreAuthorizationObj.EndDate), "yyyy-MM-dd");

        $scope.AddPreAuthorizationObj.patientDocumentDetails = $scope.AddPreAuthorizationObj.patientDocumentDetails || [];
        if ($scope.AddPreAuthorizationObj.TempDocuments.length > 0) {
            angular.forEach($scope.AddPreAuthorizationObj.TempDocuments, function (item) {
                $scope.AddPreAuthorizationObj.patientDocumentDetails.push(item);
            });
        }


        eHnotePatientDataService.AddUpdatePreAuthorizationById($scope.AddPreAuthorizationObj, onsuccess, onerror);

        function onsuccess(resp) {
            console.log(resp);
            if (resp.status == "Success") {
                if ($scope.AddPreAuthorizationObj.PatientPreAuthorizationId == 0) {
                    alertify.success("Added Successfully");
                } else {
                    alertify.success("Updated Successfully");
                }
                $scope.AddPreAuthorizationObj = GetAddPreAuthorization();
                $scope.ClearPreAuthorization();
            }
            else {
                alertify.error(Message);
            }
        }

        function onerror(err) {
            console.log(err);
        };
    }

    $scope.GetPreAuthorization = function (pagenumber) {

        var obj = {
            "BranchId": $scope.HospitalId,
            "FromDate": $filter('date')(new Date($scope.GetListObj.FromDate), "yyyy-MM-dd"),
            "ToDate": $filter('date')(new Date($scope.GetListObj.ToDate), "yyyy-MM-dd"),
            "PatientId": $scope.GetListObj.PatientId || 0,
            "Status": $scope.GetListObj.Status,
            "PageSize": $scope.GetListObj.PageSize || 10,
            "PageNumber": pagenumber || 1
        };
      

        eHnotePatientDataService.GetOrganizationPreAuthorizationList(obj).then(function (resp) {
            console.log(resp);
            $scope.GetPreAuthorizationArray = [];
            if (resp.data.status == "Success") {
                $scope.GetPreAuthorizationArray = resp.data.rows;
                $scope.GetListPageCount = resp.data.count

            } else {
                alertify.error(Message);
            }
        }, function (err) {
            console.log(err);
        });
    };
    $scope.GetPreAuthorization(1);

    $scope.ChangePatientSearch = function (type) {
        $scope.GetSearchPatient.TypeId = type;
        $scope.GetPatientsList = [];
        $scope.GetSearchPatient.SearchText = "";
    }
    $scope.ClearPreAuthorization = function () {
        $scope.GetSearchPatient.TypeId = 1;
        $scope.PatientsList = [];
        $scope.GetPatientsList = [];
        $scope.GetSearchPatient.SearchText = "";
        $scope.GetListObj = GetAuthorizationObj();
        $scope.GetPreAuthorization(1);
    }
    $scope.SelectedPatient = function (patientitem) {
        $scope.GetPatientsList = [];
        $scope.SearchPatient.SearchText = patientitem.fullname;
        $scope.GetListObj.PatientId = patientitem.PatientId;
    };

    $scope.NewPreAuthorization = function () {
        $scope.PatientsList = [];
        $scope.SearchPatient.SearchText = "";
        $scope.AddPreAuthorizationObj = GetAddPreAuthorization();
        $scope.AddNewPreAuthorization();
    }

    $scope.AddNewPreAuthorization = function () {
      //  $scope.AddPreAuthorizationObj = GetAddPreAuthorization();

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "AddNewPreAuthorization.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "md"
        });
        $scope.mInstanceAdd.result.then(function (resp) {
            $scope.PatientsList = [];
            $scope.GetPatientsList = [];
            $scope.SearchPatient.SearchText = "";
            $scope.SearchPatient.TypeId = 1;
            $scope.AddPreAuthorization();
        }, function (cancel) {
        });
    };
    $scope.ClosePreAuthorization = function () {
        $scope.PatientsList = [];
        $scope.GetPatientsList = [];
        $scope.SearchPatient.SearchText = "";
        $scope.SearchPatient.TypeId = 1;
        $scope.mInstanceAdd.dismiss("cancel");
    };
    $scope.SavePreAuthorization = function () {
        $scope.AddPreAuthorizationObj.PatientId = $scope.AddPreAuthorizationObj.PatientId || 0;
        if ($scope.AddPreAuthorizationObj.PatientId == 0){
            alertify.error("Pelase Select Patient");
            return false;
        }
        $scope.AddPreAuthorizationObj.PayorId = $scope.AddPreAuthorizationObj.PayorId || 0;
        if ($scope.AddPreAuthorizationObj.PayorId == 0) {
            alertify.error("Select Payor");
            return false;
        }
        $scope.AddPreAuthorizationObj.PreAuthorizationNumber = $scope.AddPreAuthorizationObj.PreAuthorizationNumber || "";
        if ($scope.AddPreAuthorizationObj.PreAuthorizationNumber == "") {
            alertify.error("Enter Authorization Number");
            return false;
        }
        $scope.AddPreAuthorizationObj.TOSCodeId = $scope.AddPreAuthorizationObj.TOSCodeId || 0;
        if ($scope.AddPreAuthorizationObj.TOSCodeId == 0) {
            alertify.error("Select Service Type");
            return false;
        }

        $scope.mInstanceAdd.close("cancel");
    };

    $scope.DeletePreAuthorization = function (item) {
        var obj = {
            "PatientPreAuthorizationId": item.PatientPreAuthorizationId,
            "UserId": $scope.UserId,
            "BranchId": $scope.HospitalId,
            "ParentOrganizationId": $scope.ParentOrganizationId,
            "PatientId": item.PatientId,
            "PayorId": item.PayorId,
            "PreAuthorizationNumber": item.PreAuthorizationNumber,
            "StartDate": item.StartDate,
            "EndDate": item.EndDate,
            "TOSCodeId": item.TOSCodeId,
            "Notes": item.Notes,
            "DeleteInd": "Y",
            "PayorObj": "",
            "ServiceTypeobj": ""
        }
   
        eHnotePatientDataService.AddUpdatePreAuthorizationById(obj).then(function (resp) {
        console.log(resp);
        if (resp.data.status == "Success") {
            alertify.success("Deleted Successfully");

            $scope.AddPreAuthorizationObj = GetAddPreAuthorization();
            $scope.ClearPreAuthorization();
        }
        else {
            alertify.error(Message);
        }
    }, function (err) {
        console.log(err);
    });

    };

    $scope.EditPreAuthorization = function (item) {
        $scope.AddPreAuthorizationObj = GetAddPreAuthorization();
        $scope.SearchPatient.SearchText = item.PatientFullName;
        $scope.AddPreAuthorizationObj.PatientPreAuthorizationId = item.PatientPreAuthorizationId;
        $scope.AddPreAuthorizationObj.PreAuthorizationNumber = item.PreAuthorizationNumber;
        $scope.AddPreAuthorizationObj.PatientId = item.PatientId;
        $scope.AddPreAuthorizationObj.PayorId = item.PayorId;
        $scope.AddPreAuthorizationObj.StartDate = $filter('date')(new Date(item.StartDate), "MM-dd-yyyy");
        $scope.AddPreAuthorizationObj.EndDate = $filter('date')(new Date(item.EndDate), "MM-dd-yyyy");
        $scope.AddPreAuthorizationObj.NumberOfVisits = item.NumberOfVisits;
        $scope.AddPreAuthorizationObj.TOSCodeId = item.TOSCodeId;
        $scope.AddPreAuthorizationObj.Notes = item.Notes;

        if ($scope.OrgTOSCODESArray.length > 0) {
            $scope.AddPreAuthorizationObj.ServiceTypeobj = $filter("filter")($scope.OrgTOSCODESArray, function (Nitem) {
                return Nitem.ServicesTypeId === item.TOSCodeId;
            })[0] || "";
        }
        $scope.AddPreAuthorizationObj.patientDocumentDetails = item.patientDocumentDetails || [];
        $scope.AddPreAuthorizationObj.patientDocumentDetails.forEach(function (pitem) {
            pitem.DeleteInd = "N";
        });

        $scope.AddNewPreAuthorization();
    };

    $scope.Fileupload = "";
    $scope.selectedFiles = function (files) {
        if (files == null || files == "") {
            return false;
        }
        $scope.Fileupload = files;
        if ($scope.Fileupload != null) {
            angular.forEach($scope.Fileupload, function (item) {
                var pName = item.name, name = "";
                var type = item.type.split("/")[1];
                if (pName.length > 9) {
                    name = pName.substring(0, 9) + "..." + "." + type;
                } else {
                    name = angular.copy(pName) + '.' + type;
                }
                var obj = {
                    "S3URL": "",
                    "DocumentExt": item.type,
                    "DocumentName": name,
                    "DeleteInd": "N",
                    "DocumentId": 0,
                    "file": item
                };
                $scope.AddPreAuthorizationObj.TempDocuments.push(obj);

                //angular.element("input[type='file']").val(null);
            });
        }

    }
    $scope.removeImage = function (item, mainitem) {
        if (item.DocumentId != 0) {
            item.DeleteInd = "Y";
        } else {
            var index = mainitem.TempDocuments.indexOf(item);
            mainitem.TempDocuments.splice(index, 1);
        }
    };


}]);

eHnoteWebApp.controller('EhnoteVisitReasonCtrl', ['$scope', '$filter', 'eHnoteMasterDataService', 'eHnotePatientVisitReasonServices', '$timeout', 'alertify', 'eHnoteMainAppointmentService', 'eHnoteUserAppointmentDataService', 'eHnoteAdminDepartmentService', 'eHnotePatientAddressDataServices', 'datapersistanceFactory', function ($scope, $filter, eHnoteMasterDataService, eHnotePatientVisitReasonServices, $timeout, alertify, eHnoteMainAppointmentService, eHnoteUserAppointmentDataService, eHnoteAdminDepartmentService, eHnotePatientAddressDataServices, datapersistanceFactory) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.visitReason = "";
    $scope.editvisitReason = false;
    $scope.CanceleditvisitReason = false;
    $scope.viewsearch = false;
    $scope.VisitSumbitText = 'Add';
    $scope.VisitCancelSumbitText = 'Add';
    $scope.SuccessMessage = "";
    $scope.DefaultVisitId = 0;
    $scope.VisitRsnID = 0;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    console.log($scope.MainSettingObj.BranchesArray);

    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || 0;
    }

    $scope.UserVisitReasonObj = {
        "searchdoc": "",
        "DoctorObj": {
            "FullName": ""
        },
    };

    $scope.ParentObj.IsIOJParentOrganization;

    $scope.UserVisitReasonObj.DoctorObj.UserFullName = "Select";
    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    $scope.VisitTypeList = "";
    $scope.EditClick = function (item) {
        $scope.visitReasonForOpFocus = true;
        $scope.addedVisitReason = true;
        $scope.visitReason = item.Reason;
        $scope.VisitRsnID = item.ReasonId;
        $scope.FacilityTypeId = item.FacilityTypeId;
        $scope.VisitSumbitText = 'Update';
        $scope.editvisitReason = true;
        $scope.color = item.VisitReasonColorCode;
        $scope.VisitReasonRemarks = item.Remarks || '';
        $scope.VisitTypeList = item.VisitTypeId;
        if (item.IsFrequent == "Y") {
            $scope.VisitReasonObj.IsFrequent = true;
        } else {
            $scope.VisitReasonObj.IsFrequent = false;
        }
    };
    $scope.CancelVisitEditClick = function (item) {
        $scope.CancelvisitReason = item.Reason;
        $scope.VisitcancelRsnID = item.ReasonId;
        $scope.VisitCancelSumbitText = 'Update';
        $scope.CanceleditvisitReason = true;
    };

    $scope.RemoveClick = function (item, type) {
        if (item.ActiveIND == 'Y') {
            alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to Inactivate this visit reason? </h4>", function () {
                var params = {
                    "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "VisitReason": item.Reason,
                    "ActiveIND": "N",
                    "UserId": doctorinfo.doctorid,
                    "VisitReasonId": item.ReasonId,
                    "ReasonTypeId": type,
                    "VisitReasonColorCode": $scope.color,
                    "VisitTypeId": $scope.VisitTypeList,
                };
                //if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                //    var hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                //    eHnotePatientVisitReasonServices.AddUpdateVisitReasonServicesList(params, hospid, onDeleteSuccess, onDeleteFailed);
                //}
                //else {
                //    var hospid = undefined;
                //    eHnotePatientVisitReasonServices.AddUpdateVisitReasonServicesList(params, hospid, onDeleteSuccess, onDeleteFailed);
                //}
                eHnotePatientVisitReasonServices.AddUpdateVisitReasonServicesList(params, callbackSuccess, callbackError);
                function callbackSuccess(data) {
                    if (type == 1) {
                        $scope.visitReasonList = data.rows;
                        //$scope.totalItems = data.count;
                        alertify.success("Deleted Successfully");
                        //$scope.currentPage = 1;
                        $scope.searchvisitReason = "";
                        $scope.viewsearch = false;
                    } else {
                        $scope.visitReasonCancelList = data.rows;
                        //$scope.totalItems = data.count;
                        alertify.success("Deleted Successfully");
                        $scope.CancelvisitReason = "";
                        $scope.searchcancelvisitReason = "";
                        $scope.viewsearch = false;
                    }


                }
                function callbackError(data) {
                }
            }, function () {
                r = "You pressed Cancel!";
            });
        }
    };

    $scope.getVisitReasonListObj = function () {
        var obj = {

            "OrganizationId": "",
            "UserId": "",
            "VisitTypeId": "",
            "FacilityTypeId": "",
            "visitReasonSearch": "",
            "PageNumber": 1,
            "PageSize": 10
        }
        return obj;
    }

    $scope.VisitReasonListObj = $scope.getVisitReasonListObj;
    $scope.GetVisitResonsListforvisit = function () {
        var obj = {

            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": doctorinfo.doctorid,
            "FacilityTypeId": "",
            "visitReasonSearch": "",
            "PageNumber": 1,
            "PageSize": 10
        }
        return obj;
    }
    $scope.GetVisitResonsListforvisitobj = $scope.GetVisitResonsListforvisit();
    $scope.GetVisitResonforvistobj = function () {
        var params = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "VisitReason": '',
            "ActiveIND": "Y",
            "UserId": doctorinfo.doctorid,
            "VisitReasonId": 0,
            "ReasonTypeId": '',
            "FacilityTypeId": 0,
            "FacilityType": '',
            "DeleteIND": "N",
            "Remarks": "",
            //"IsFrequent": false
            "VisitSumbitText": 'Add',
            "MastervisitItem": '',
            "AppointmentReasonId": 0,
            "ReasonId": 0,
            "Reason": '',
            "searchvisit": ""

        };
        return params;
    }
    $scope.VisitResonforvistobj = $scope.GetVisitResonforvistobj();
    $scope.clearNewvisitCondition = function () {
        $scope.VisitResonforvistobj = $scope.GetVisitResonforvistobj();
        $scope.addedRemarksForVisit = false;
    }

    $scope.EditNewVisitClick = function (item) {
        $scope.visitReasonForVisitFocus = true;
        $scope.addedVisitReasonForVisit = true;
        $scope.addedRemarksForVisit = true;
        $scope.VisitResonforvistobj.ReasonId = item.VisitTypeId || 0;
        $scope.VisitResonforvistobj.Reason = item.VisitType || '';
        $scope.VisitResonforvistobj.VisitSumbitText = 'Update';
        $scope.VisitResonforvistobj.VisitReasonId = item.VisitReasonId || 0;
        $scope.VisitResonforvistobj.VisitReason = item.VisitReason || 0;
        $scope.VisitResonforvistobj.FacilityTypeId = item.FacilityTypeId || 0;
        $scope.VisitResonforvistobj.Remarks = item.Remarks || '';

    }
    $scope.MasterVisitReasonsNewVist = [];
    $scope.GetMasterVisitReasonsNewVist = function (val) {
        var req = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "SearchText": '',
            //"PageSize": 10,
            //"PageNumber": 1,
            //"Type": '',
            //"UserId": doctorinfo.doctorid,
            //"IsFrequent": "N"

        };


        //if (req.SearchText == "") {
        //    req.IsFrequent = "Y";
        //}



        eHnotePatientVisitReasonServices.GetMasterVisitReasonsNewVist(req).then(function (resp) {

            $scope.MasterVisitReasonsNewVist = resp.data.rows || [];


        })
    };
    $scope.Isshowmasterdata = false;
    $scope.OnSelectMasterVisitReasonsNewVist = function (name, item) {
        console.log(item);
        var List1 = $filter("filter")($scope.MasterVisitReasonsNewVist, function (Ditem,) { return Ditem.VisitReason === name.VisitReason; }) || [];
        if (List1.length != 0) {
            item.VisitReason = List1[0].VisitReason;
            item.FacilityTypeId = List1[0].FacilityTypeId;
            item.FacilityType = List1[0].FacilityType;
        } else {
            item.VisitReason = '';
            item.FacilityTypeId = 0;
            item.FacilityType = '';
            $scope.Isshowmasterdata = true;
        }
    };
    $scope.VisitReasonChange = function (item) {
        //item.VisitReason = '';
        item.FacilityTypeId = 0;
        item.FacilityType = '';
    }
    $scope.GetMasterVisitReasonsNewVist();
    $scope.AddVistReasonForNewVisit = function () {
        $scope.VisitResonforvistobj.FacilityTypeId = $scope.VisitResonforvistobj.FacilityTypeId || 0;
        $scope.VisitResonforvistobj.VisitReason = $scope.VisitResonforvistobj.VisitReason || '';
        //if ($scope.VisitResonforvistobj.AppointmentReasonId == 0) {
        //    alertify.error('Please Select Appointment Visit Reason');
        //    return false;
        //}
        if ($scope.VisitResonforvistobj.VisitReason == '') {
            alertify.error('Please Enter Clinical Visit Reason');
            return false;
        }
        //if ($scope.VisitResonforvistobj.FacilityTypeId == 0) {
        //    alertify.error('Please Select Facility Type');
        //    return false;
        //}
        var params = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "VisitReason": $scope.VisitResonforvistobj.VisitReason || '',
            "ActiveIND": "Y",
            "UserId": doctorinfo.doctorid,
            "VisitReasonId": $scope.VisitResonforvistobj.VisitReasonId || 0,
            //"ReasonTypeId": '',
            "FacilityTypeId": 0,
            "FacilityType": '',
            "DeleteInd": "N",
            "Remarks": $scope.VisitResonforvistobj.Remarks || "",
            "AppointmentVisittypeId": $scope.VisitResonforvistobj.ReasonId || 0,
            //"IsFrequent": false

        };
        eHnotePatientVisitReasonServices.AddVistReasonForNewVisit(params).then(function (resp) {
            if (resp.data.Status == 'Success') {
                $scope.GetVisitReasonsForNewVist();
                if ($scope.VisitResonforvistobj.VisitSumbitText === 'Add') {
                    alertify.success("Visit Reason Added Successfully");

                }
                if ($scope.VisitResonforvistobj.VisitSumbitText === 'Update') {
                    alertify.success("Visit Reason Updated");

                }
                $scope.VisitResonforvistobj = $scope.GetVisitResonforvistobj();

            }
            if (resp.data.Status == 'Failure') {
                //$scope.GetVisitReasonsForNewVist();
                //alertify.error(resp.data.Message);
                alertify.error("Visit Reason Already Exists");
                $scope.VisitResonforvistobj = $scope.GetVisitResonforvistobj();

            }
        }, function (err) {
            alertify.error("Getting Failed");
        });
    }
    $scope.visitReasonListForNewVisit = [];
    $scope.ChangevisitPaginationForNewVist = function (pagenumber) {
        $scope.GetVisitResonsListforvisitobj.PageNumber = pagenumber;
        $scope.GetVisitReasonsForNewVist();

    }
    $scope.ClearVisitReasonForNewVisit = function () {
        $scope.GetVisitResonsListforvisitobj = $scope.GetVisitResonsListforvisit();
        $scope.GetVisitReasonsForNewVist();
    }
    $scope.AppointmentVisitreasonsList = [];
    $scope.GetAppointmentVisitReasons = function () {


        var Params = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "SearchText": "",
            "VisitTypeId": 0
        };
        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(Params).then(function (resp) {
            $scope.AppointmentVisitreasonsList = [];
            if (resp.data.rows.length !== 0) {
                tempAllVisitreasons = resp.data.rows || [];
                if (tempAllVisitreasons.length > 0) {
                    angular.forEach(tempAllVisitreasons, function (item) {
                        item.IsChecked = false;
                        item.CrmVisitReasonId = 0;
                    });
                    if (tempAllVisitreasons.length > 0) {
                        $scope.AppointmentVisitreasonsList = $filter("filter")(tempAllVisitreasons, function (item) {
                            return item.ActiveInd === 'Y';
                        });
                    }
                    //$scope.AllVisitreasons = tempAllVisitreasons || [];


                }
            }

        })

    }

    $scope.GetVisitReasonsForNewVist = function () {

        var Params = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": doctorinfo.doctorid,
            "FacilityTypeId": $scope.GetVisitResonsListforvisitobj.FacilityTypeId,
            "SearchText": $scope.GetVisitResonsListforvisitobj.visitReasonSearch,
            "PageNumber": $scope.GetVisitResonsListforvisitobj.PageNumber || 1,
            "PageSize": $scope.GetVisitResonsListforvisitobj.PageSize || 10,
            "IsFrequent": "N"
        };

        eHnotePatientVisitReasonServices.GetVisitReasonsForNewVist(Params).then(function (resp) {

            $scope.visitReasonListForNewVisit = resp.data.rows;
            $scope.visitReasonListcountForNewVisit = resp.data.count;
            //$scope.GetVisitResonsListforvisitobj = $scope.GetVisitResonsListforvisit();
            if ($scope.visitReasonListForNewVisit.length > 0) {
                angular.forEach($scope.visitReasonListForNewVisit, function (item) {
                    if (item.IsFrequent == 'Y') {
                        item.IsFrequentInd = true;
                    }
                    else {
                        item.IsFrequentInd = false;
                    }
                });
            }

        })

    }
    $scope.ChangeFacility = function (FacilityTypeId) {
        FacilityTypeId = FacilityTypeId || 0;
        if (FacilityTypeId != 0) {
            var facilitytype = $filter("filter")($scope.OrgnizationFacilityTypesArray, { "OrganizationFacilityId": FacilityTypeId }, true) || [];;
            if (facilitytype.length > 0) {
                $scope.VisitResonforvistobj.FacilityType = facilitytype[0].FacilityName || '';
            } else {
                $scope.VisitResonforvistobj.FacilityType || '';
            }
        }

    }
    $scope.submitClick = function (visitreasonform) {
        if ($scope.VisitTypeList === "" || $scope.VisitTypeList === null) {
            alertify.error("Please select visit type");
            return false;
        }

        $scope.visitReason = $scope.visitReason || '';
        if ($scope.visitReason === "") {
            alertify.error("Please select visit reason");
            return false;
        }
        //if ($scope.color === "" || $scope.color === null) {
        //    alertify.error("Please select color");
        //    return false;
        //}
        $scope.FacilityTypeId = $scope.FacilityTypeId || 0
        var facilitytype = $filter("filter")($scope.FacilityTypesArray, { "FacilityTypeId": $scope.FacilityTypeId }, true);
        if (facilitytype.length > 0) {
            var FacilityType = facilitytype[0].FacilityTypeCode + '-' + facilitytype[0].FacilityType;
        }
        else {
            var FacilityType = " ";
        }
        if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateVisitReason) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }


        if ($scope.VisitReasonObj.IsFrequent == true) {
            $scope.VisitReasonObj.IsFrequent = "Y";
        } else if ($scope.VisitReasonObj.IsFrequent == false) {
            $scope.VisitReasonObj.IsFrequent = "N";
        }
        if (!visitreasonform.$valid) {
            return;
        } else {
            if ($scope.editvisitReason) {
                var params = {
                    "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "VisitReason": $scope.visitReason,
                    "ActiveIND": "Y",
                    "UserId": doctorinfo.doctorid,
                    "VisitReasonId": $scope.VisitRsnID,
                    "ReasonTypeId": $scope.VisitcurrentPage,
                    "VisitReasonColorCode": $scope.color,
                    "VisitTypeId": $scope.VisitTypeList,
                    "FacilityTypeId": $scope.FacilityTypeId,
                    "FacilityType": FacilityType,
                    "DeleteIND": "N",
                    "Remarks": $scope.VisitReasonRemarks || "",
                    "IsFrequent": $scope.VisitReasonObj.IsFrequent


                };
                eHnotePatientVisitReasonServices.AddUpdateVisitReasonServicesList(params, callbackSuccess, callbackError);
            } else {

                var isDuplicate = false;

                //if ($scope.visitReason && $scope.visitReasonList.length > 0) {
                //    angular.forEach($scope.visitReasonList, function (item) {
                //        if (item.Reason === $scope.visitReason) {

                //            isDuplicate = true;
                //        }
                //    });
                //}
                if (isDuplicate === false) {
                    var params = {
                        "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "VisitReason": $scope.visitReason,
                        "ActiveIND": "Y",
                        "UserId": doctorinfo.doctorid,
                        "VisitReasonId": 0,
                        "ReasonTypeId": $scope.VisitcurrentPage,
                        "VisitReasonColorCode": $scope.color,
                        "VisitTypeId": $scope.VisitTypeList,
                        "FacilityTypeId": $scope.FacilityTypeId,
                        "FacilityType": FacilityType,
                        "DeleteIND": "N",
                        "Remarks": $scope.VisitReasonRemarks || "",
                        "IsFrequent": $scope.VisitReasonObj.IsFrequent
                    };
                    eHnotePatientVisitReasonServices.AddUpdateVisitReasonServicesList(params, callbackSuccess, callbackError);

                }
                else {
                    alertify.error('Visit reason already exists');
                }
            }

            function callbackSuccess(resp) {

                if (resp.status != undefined) {
                    if (resp.status === 'Failure') {
                        alertify.error(" Visit reason Already Exists");
                        return false;
                    }
                }


                if (resp.status === 'Success') {

                    $scope.visitReasonList = resp.rows;
                    //$scope.totalItems = resp.count;
                    $scope.visitReasonListcount = resp.count;

                    if ($scope.VisitRsnID == 0) {
                        alertify.success("Visit Reason Added Successfully");
                        $scope.VisitReasonObj.IsFrequent = false;
                    } else {
                        alertify.success("Visit Reason Updated!");
                        $scope.VisitReasonObj.IsFrequent = false;
                    }
                    $scope.VisitReasonRemarks = "";
                    $scope.visitReason = "";
                    $scope.visitreasonform.$setPristine(true);
                    $scope.visitreasonform.submited = false;
                    $scope.visitreasonform.$setUntouched();
                    $scope.editvisitReason = false;
                    $scope.VisitSumbitText = 'Add';
                    //$scope.currentPage = 1;
                    $scope.searchvisitReason = "";
                    $scope.viewsearch = false;
                    $scope.color = '';
                    $scope.VisitTypeList = "";
                    $scope.VisitRsnID = 0;
                    $scope.FacilityTypeId = 0;
                    $scope.SearchVisitReasonType();
                } else {
                    alertify.error("Already Exists");
                    return false;
                }



            }
            function callbackError(data) {
            }
        }
    };

    $scope.CancelsubmitClick = function (Cancelvisitreasonform) {


        if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateCancelReason) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }
        if (!Cancelvisitreasonform.$valid) {
            return;
        } else {
            if ($scope.CanceleditvisitReason) {
                var params = {
                    "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "VisitReason": $scope.CancelvisitReason,
                    "ActiveIND": "Y",
                    "UserId": doctorinfo.doctorid,
                    "VisitReasonId": $scope.VisitcancelRsnID,
                    "ReasonTypeId": $scope.VisitcurrentPage,
                    "VisitReasonColorCode": $scope.color,
                    "VisitTypeId": $scope.VisitTypeList,
                };
                eHnotePatientVisitReasonServices.AddUpdateVisitReasonServicesList(params, callbackSuccess, callbackError);
            } else {
                var isDuplicate = false;
                if ($scope.CancelvisitReason && $scope.visitReasonCancelList.length > 0) {
                    angular.forEach($scope.visitReasonCancelList, function (item) {
                        if (item.Reason === $scope.CancelvisitReason) {
                            isDuplicate = true;
                        }
                    });
                }
                if (isDuplicate === false) {

                    var params = {
                        "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "VisitReason": $scope.CancelvisitReason,
                        "ActiveIND": "Y",
                        "UserId": doctorinfo.doctorid,
                        "VisitReasonId": 0,
                        "ReasonTypeId": $scope.VisitcurrentPage,
                        "VisitReasonColorCode": $scope.color,
                        "VisitTypeId": $scope.VisitTypeList,
                    };
                    eHnotePatientVisitReasonServices.AddUpdateVisitReasonServicesList(params, callbackSuccess, callbackError);
                    //if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                    //    var hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    //    eHnotePatientVisitReasonServices.AddUpdateVisitReasonServicesList(params, hospid, onSuccess, onFailed);
                    //}
                    //else {
                    //    var hospid = undefined;
                    //    eHnotePatientVisitReasonServices.AddUpdateVisitReasonServicesList(params, onSuccess, onFailed);
                    //}
                }
                else {
                    alertify.error('Cancel Visit reason already exists');
                }
            }

            function callbackSuccess(resp) {
                if (resp.status != undefined) {
                    if (resp.status === 'Failure') {
                        alertify.error("Already Exists");
                        return false;
                    }
                }
                if (resp.status === 'Success') {

                    $scope.visitReasonCancelList = resp.rows;
                    //$scope.totalItems = data.count;
                    if ($scope.VisitcancelRsnID == undefined) {
                        alertify.success("Added Successfully");
                    } else {
                        alertify.success("Updated Successfully");
                    }
                    $scope.VisitCancelSumbitText = 'Add';
                    $scope.CancelvisitReason = "";
                    $scope.Cancelvisitreasonform.$setPristine(true);
                    $scope.Cancelvisitreasonform.submited = false;
                    $scope.Cancelvisitreasonform.$setUntouched();
                    $scope.CanceleditvisitReason = false;
                    //$scope.currentPage = 1;
                    $scope.searchcancelvisitReason = "";
                    $scope.viewsearch = false;
                }
            }
            function callbackError(data) {
            }
        }
    };

    $scope.getVisitReasonType = function () {
        var obj = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": doctorinfo.doctorid,
            "VisitTypeId": $scope.VisitReasonListObj.VisitTypeId || 0,
            "FacilityTypeId": $scope.VisitReasonListObj.FacilityTypeId || 0,
            "visitReasonSearch": "",
            "PageNumber": $scope.VisitReasonListObj.PageNumber || 1,
            "PageSize": $scope.VisitReasonListObj.PageSize || 10,
            "IsFrequent": "N"
        };
        eHnotePatientVisitReasonServices.getPatientVisitReasonWithPageNationList(obj).then(function (resp) {
            $scope.visitReasonList = resp.data.rows;
            $scope.visitReasonListcount = resp.data.count;
            if ($scope.visitReasonList.length > 0) {
                angular.forEach($scope.visitReasonList, function (item) {
                    if (item.IsFrequent == 'Y') {
                        item.IsFrequentInd = true;
                    }
                    else {
                        item.IsFrequentInd = false;
                    }
                });
            }
        })

    }

    $scope.$on('VisitValidation', function (event) {
        $scope.getAllOrgAppointmentVisitReasons();
    })


    $scope.VisitcurrentPage = 1;
    $scope.VisitsetPage = function (pageNo) {

        $scope.VisitcurrentPage = pageNo;
        // 8 = AI Call Questionnaires. Like 4, it has its own controller and none of
        // the visit-reason forms below, so the resets would throw on undefined.
        if ($scope.VisitcurrentPage == 4 || $scope.VisitcurrentPage == 8) {

        } else {
            // loadvistReason(pageNo);
            $scope.visitreasonform.$setPristine();
            $scope.visitreasonform.$setUntouched();
            $scope.Cancelvisitreasonform.$setPristine();
            $scope.Cancelvisitreasonform.$setUntouched();
            $scope.visitReason = "";
            $scope.CancelvisitReason = "";
            var SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
            var userBranchid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.GetBranchSubSpecializations(SubOrginactionID, userBranchid);
            $scope.VisitTypeList = "";
            $scope.VisitReasonRemarks = "";
        }



        if (pageNo == 3) {
            $scope.UserVisitReasonObj.DoctorId = "";
            $scope.UserVisitTypeid = "";
            $scope.othervisitrsnid = "";
            // $scope.getVisitReasonType();
            $scope.GetDefaultReasonForDoctors();

        }
        if (pageNo == 2) {
            $scope.GetCancelVisitReasonNew();
            $scope.newCancelVisitReason = getCancelVisitreason();
        }

        if ($scope.VisitcurrentPage == 1) {
            //$scope.getVisitReasonType();
            $scope.getAllOrgAppointmentVisitReasons();
        }
        if ($scope.VisitcurrentPage == 3) {
            $scope.UserVisitReasonObj.DoctorObj.UserFullName = "Select";
            $scope.UserVisitReasonObj.DoctorId = 0;
            $scope.UserVisitTypeid = "";
            $scope.othervisitrsnid = "";
            $scope.DefaultVisitId = 0
            $scope.UserdefaultvisitReasonList = [];

        }
        if ($scope.VisitcurrentPage == 5) {
            //$scope.GetVisitReasonsForNewVist();
            $scope.GetAppointmentVisitReasons();
            $scope.getAllOrgVisitTypeVisitReasons();
            $scope.AddNewClinicalVisitReasonObj.addNewVisitTypeVisitReason = false;
        }
        if ($scope.VisitcurrentPage == 6) {
            $scope.addedOnlineVisitReason = false;
            $scope.getAllOnlineVisitReasons();
        }
        if ($scope.VisitcurrentPage == 7) {
            initVisitReasonGroupsPage();
        }

    };
    // $scope.pageChanged = function () {
    //     var getParams = {
    //         "OrganizationId": 1,
    //         "ReasonTypeId": 1,
    //     };

    //    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
    //        var hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
    //        eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams, hospid, onreadchangeSuccess, onreadFailed);
    //    }
    //    else {
    //        var hospid = undefined;
    //        eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams, hospid, onreadchangeSuccess, onreadFailed);
    //    }
    //    eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams, callbackSuccess, callbackError);
    //    function callbackSuccess(data) {
    //        $scope.visitReasonList = data.rows;
    //        $scope.totalItems = data.count;
    //     }
    //    function callbackError(data) {
    //     }
    //};
    $scope.clearsearchvisitReason = function () {
        $scope.searchvisitReason = "";
        loadvistReason();
    };
    $scope.clearsearchcancelvisitReason = function () {
        $scope.searchcancelvisitReason = "";
        loadvistReason(2);
    };

    $scope.searchValueReason = function (searchText) {

        if (searchText.length > 0) {
            var getParams = {
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "ReasonTypeId": 1,
                "SearchText": searchText,
            };

            eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams).then(function (resp) {


                $scope.UservisitReasonList = resp.data.rows;
                $scope.visitReasonList = resp.data.rows;
                $scope.totalItems = resp.data.count;
                $scope.viewsearch = false;

            });
            //function callbackSuccess(data) {

            //}
            //function callbackError(data) {
            //}
            //$scope.viewsearch = true;
            //var getParams = {
            //    "ActiveIND": "Y",
            //    "UserId": doctorinfo.doctorid,
            //    "SearchText": searchText
            //};
            //var hospid = undefined;
            //if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            //    hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            //}
            //eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams, hospid, onreadSuccess, onreadSuccess);
            //function onreadSearchSuccess(data) {
            //    $scope.visitReasonList = data.rows;
            //    $scope.totalItems = data.count;
            //}
            //function onreadSearchFailed(data) {
            //}
        } else {
            loadvistReason();
        }
    };

    $scope.searchcancelValueReason = function (searchcancelvisitReason) {
        if (searchcancelvisitReason.length > 0) {
            var getParams = {
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "ReasonTypeId": 2,
                "SearchText": searchcancelvisitReason,
            };

            eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams).then(function (resp) {
                $scope.visitReasonCancelList = resp.data.rows;
                //$scope.totalItems = data.count;
                $scope.viewsearch = false;

            });
            //function callbackSuccess(data) {
            //    $scope.visitReasonCancelList = data;
            //    //$scope.totalItems = data.count;
            //    $scope.viewsearch = false;
            //}
            //function callbackError(data) {
            //}

        } else {
            loadvistReason(2);
        }
    };



    function loadvistReason(pageNo) {
        if (pageNo == 2) {
            var getParams = {
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "ReasonTypeId": 2,
            };

            eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams).then(function (resp) {
                console.log(JSON.stringify(resp));
                $scope.visitReasonCancelList = resp.data.rows;

                $scope.viewsearch = false;
            });

        } else {
            var getParams = {
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "ReasonTypeId": 1,
            };

            eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams).then(function (resp) {
                $scope.visitReasonList = resp.data.rows;
                $scope.UservisitReasonList = resp.data.rows;

                $scope.viewsearch = false;
            });

        }

    }
    loadvistReason();


    $scope.AllApptVistReasonsArray = [];
    function getnewApptReasonReqObj() {
        var obj = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": "",
            "OrganizationId": 0,
            "AppointmentTypeId": 0,
            "IsFrequent": "N",
            "IsParent": "Y",
            "IsActive":"Y",
            "TotalCount": "",
        };
        return obj;
    }

    $scope.newGetApptVisitReasonsobj = getnewApptReasonReqObj();

    $scope.getAllOrgAppointmentVisitReasons = function () {
        var obj = {
            "ParentOrganizationId": $scope.newGetApptVisitReasonsobj.ParentOrganizationId,
            "PageSize": $scope.newGetApptVisitReasonsobj.PageSize || 10,
            "PageNumber": $scope.newGetApptVisitReasonsobj.PageNumber || 1,
            "SearchText": $scope.newGetApptVisitReasonsobj.SearchText || "",
            "OrganizationId": $scope.newGetApptVisitReasonsobj.OrganizationId || 0,
            "AppointmentTypeId": $scope.newGetApptVisitReasonsobj.AppointmentTypeId || 0,
            "IsFrequent": $scope.newGetApptVisitReasonsobj.IsFrequent,
            "IsParent": $scope.newGetApptVisitReasonsobj.IsParent,
            //"IsActive": $scope.newGetApptVisitReasonsobj.IsActive
        };
        eHnotePatientVisitReasonServices.GetOrganizationAppointmentVisitReasons(obj).then(function (resp) {
            $scope.AllApptVistReasonsArray = [];
            $scope.newGetApptVisitReasonsobj.TotalCount = 0;

            if (resp.data.rows.length > 0) {
                $scope.AllApptVistReasonsArray = resp.data.rows || [];
            }
            console.log($scope.AllApptVistReasonsArray);
            $scope.newGetApptVisitReasonsobj.TotalCount = resp.data.count;
        });
    };

    $scope.inti = function () {
        //$scope.getVisitReasonType();
        console.log("init called")

        $scope.VisitReasonRemarks = "";
    }



    $scope.clearvisitCondition = function () {
        $scope.visitReason = "";
        $scope.VisitSumbitText = 'Add';
        $scope.color = '';
        $scope.VisitTypeList = "";
        $scope.VisitRsnID = 0;
        $scope.FacilityTypeId = 0;
        $scope.editvisitReason = false;
    }
    $scope.clearcancelvisitCondition = function () {
        $scope.CancelvisitReason = "";
        $scope.VisitCancelSumbitText = '';


    }


    $scope.color = '';

    $scope.Sellectdoctor = function (item) {
        $scope.UserVisitReasonObj.DoctorId = angular.copy(item.DoctorID);
        $scope.UserVisitReasonObj.DoctorObj = angular.copy(item);
    };

    $scope.GetBranchSubSpecializations = function (SubOrganizationId, BranchId) {
        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                $scope.getDoctorsbySubSpecializations(BranchId);


            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }


        });
    };

    $scope.getDoctorsbySubSpecializations = function (branchId) {
        $scope.clinicDoctorList = [];
        $scope.allUserList = [];
        $scope.selectedDoctor = "";

        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": branchId,
            "SubSpecializationIdArray": subSplArray
        }


        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            console.log(resp);
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;

                $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                $scope.clinicDoctorList = [];



                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                        //if ($scope.selectedBranch.ClinicId === 0) {
                        //    $scope.clinicDoctorList.push(Aitem);
                        //} else {
                        //    if (item.BranchId === $scope.selectedBranch.ClinicId) {
                        //        $scope.clinicDoctorList.push(Aitem);
                        //    }
                        //}


                        $scope.clinicDoctorList.push(Aitem);
                    }
                });

                //$scope.clinicDoctorList1 = $filter("filter")($scope.clinicDoctorList, function (item) { return item.RoleId == 43 || item.RoleId == 1; }) || [];

            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.mainBookedAppointmentList = [];
            }


        }

        function onGetUsersFailure(data) {
        }
    }

    $scope.DefaultVisitreasonList = [];
    function GetDefaultReasonObj() {
        var obj = {
            "DoctorObj": "",
            "DoctorId": 0,
            "ApptTypeId": "",
            "searchdoc": ""
        };
        return obj;
    }
    $scope.DefaultReasonObj = GetDefaultReasonObj();

    $scope.GetDefaultReasonForDoctors = function () {
        var obj = {
            "DoctorId": $scope.DefaultReasonObj.DoctorId || 0,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "VisitTypeId": $scope.DefaultReasonObj.ApptTypeId || 0,
            "PageNumber": $scope.DefaultvisitPageNumber || 1,
            "PageSize": $scope.DefaultvisitPageSize || 10,
            "Status": 0  //-- > 0 - All, 1-Active, 2-Inactive
        };
        eHnoteMainAppointmentService.GetDefaultReasonsForDoctors(obj, callbackSuccess3, callbackError3);
        function callbackSuccess3(rows) {
            if (rows.Status == "Success") {
                if (rows.rows.length > 0) {
                    $scope.DefaultVisitreasonList = rows.rows || [];
                    $scope.DefaultVisitreasonListCount = rows.count;
                } else {
                    $scope.DefaultVisitreasonList = [];
                }
            } else {
                alertify.error(rows.Message);
                return false;
            }
        }
        function callbackError3(data) {
        }
    };

    $scope.Addvisitreason = function () {

        if ($scope.UserVisitReasonObj.DoctorId == 0) {
            alertify.error("Please Select a Dcotor");
            return false;
        }
        if ($scope.UserVisitTypeid == 0) {
            alertify.error("Please Select Appointment Type");
            return false;
        }
        if ($scope.othervisitrsnid == 0) {
            alertify.error("Please Select Visit Reason");
            return false;
        }

        var getitem = {
            "DefaultVisitId": $scope.DefaultVisitId || 0,
            "UserId": doctorinfo.doctorid,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "DoctorId": $scope.UserVisitReasonObj.DoctorId,
            "VisitTypeId": $scope.UserVisitTypeid,
            "VisitReasonId": $scope.othervisitrsnid,
            "DeleteInd": "N",
            "ActiveInd": "Y"

        };
        eHnoteMainAppointmentService.AddUpdateDoctorDefaultVisitReasons(getitem, callbackSuccess2, callbackError2);
        function callbackSuccess2(data) {
            if (data.Status == "Success") {
                $scope.DefaultReasonObj = GetDefaultReasonObj();
                $scope.GetDefaultReasonForDoctors();
                alertify.success("Added Successfully");
                $scope.UserVisitReasonObj.DoctorObj.UserFullName = "Select";
                $scope.UserVisitReasonObj.DoctorId = 0;
                $scope.UserVisitTypeid = "";
                $scope.othervisitrsnid = "";
            } else {
                alertify.error("Default Visit Reason Already Exists ");
            }

        }
        function callbackError2(data) {
            alertify.error("Some Error Occurs");
        }
        $scope.DefaultVisitId = 0;
        $scope.UserVisitReasonObj.searchdoc = "";
    };
    $scope.GetDefaultReasonForDoctors();

    $scope.Clearvisitreason = function () {
        $scope.UserVisitReasonObj.DoctorObj.UserFullName = "Select";
        $scope.UserVisitReasonObj.DoctorId = 0;
        $scope.UserVisitTypeid = "";
        $scope.othervisitrsnid = "";
        $scope.DefaultVisitId = 0;
    };

    $scope.EditUserDefaultVisit = function (item) {
        $scope.defaultVisitReasonFocus = true;
        $scope.addedUserDefaultVisitReason = true;
        $scope.DefaultVisitId = item.DefaultVisitId;
        $scope.UserVisitTypeid = item.VisitTypeId;
        $scope.othervisitrsnid = item.VisitReasonId;
        $scope.UserVisitReasonObj.DoctorObj = item;
        $scope.UserVisitReasonObj.DoctorId = item.DoctorId;
        $scope.UserVisitReasonObj.DoctorObj.UserFullName = item.DoctorName;

        $scope.UservisitReasonList1 = $filter("filter")($scope.UservisitReasonList, function (items) { return items.ReasonId == item.VisitReasonId; }) || [0];
        $scope.ChangeappointType(item.VisitTypeId);
    };

    $scope.UserdefaultvisitReasonList = [];
    $scope.ChangeappointType = function (id) {

        $scope.UserdefaultvisitReasonList = [];
        //$scope.UservisitReasonList1 = $filter("filter")($scope.visitReasonList, function (item) { return item.VisitTypeId == id; }) || [0];
        //$scope.getVisitReasonType();

        //var obj = {
        //    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        //    "UserId": doctorinfo.doctorid,
        //    "VisitTypeId": 0,
        //    "visitReasonSearch": "",
        //    "PageNumber": $scope.VisitReasonListObj.PageNumber || 1,
        //    "PageSize": $scope.VisitReasonListObj.PageSize || 10
        //};
        //eHnotePatientVisitReasonServices.getPatientVisitReasonWithPageNationList(obj).then(function (resp) {
        //    $scope.UserdefaultvisitReasonList = resp.data.rows;
        //    $scope.UserdefaultvisitReasonListCount = resp.data.count;
        //    $scope.UserdefaultvisitReasonListArray = $filter("filter")($scope.UserdefaultvisitReasonList, function (item) { return item.VisitTypeId == id; }) || [0];
        //})     

        var getParams = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ReasonTypeId": 1,
            "SearchText": '',
            "VisitTypeId": id
        };
        eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams).then(function (resp) {
            $scope.UserdefaultvisitReasonList = resp.data.rows;
            $scope.UserdefaultvisitReasonListCount = resp.data.count;
            // $scope.UserdefaultvisitReasonListArray = $filter("filter")($scope.UserdefaultvisitReasonList, function (item) { return item.VisitTypeId == id; }) || [0];
        })
    };

    $scope.RemoveClickuser = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
            var params = {
                "DefaultVisitId": item.DefaultVisitId,
                "UserId": doctorinfo.doctorid,
                "BranchId": item.BranchId,
                "DoctorId": item.DoctorId,
                "VisitTypeId": item.VisitTypeId,
                "VisitReasonId": item.VisitReasonId,
                "DeleteInd": "Y"
            };

            eHnoteMainAppointmentService.AddUpdateDoctorDefaultVisitReasons(params, callbackSuccess4, callbackError4);
            function callbackSuccess4(data) {
                alertify.success("Deleted Successfully");
                $scope.GetDefaultReasonForDoctors();
            }
            function callbackError4(data) {
                alertify.error("Some Error Occurs");
            }
        }, function () {
            return;
        });
    };

    $scope.ChangeDefalutDoctor = function (item) {
        $scope.DefaultReasonObj.DoctorObj = item;
        $scope.DefaultReasonObj.DoctorId = item.DoctorID;
    };
    $scope.ChangeDefalutvisit = function (item) {
        $scope.VisitResonforvistobj.ReasonId = item.ReasonId || 0;
        $scope.VisitResonforvistobj.Reason = item.Reason || '';
    };
    $scope.ChangeDefalutappointType = function (item) {
        if (item == "") {
            $scope.DefaultReasonObj.ApptTypeId = "";
        }
    };
    $scope.ClickClearDefalutVisitreason = function () {
        $scope.DefaultReasonObj = GetDefaultReasonObj();
        $scope.GetDefaultReasonForDoctors();
    }



    $scope.maxSize = 10;

    // $scope.getVisitReasonType();

    $scope.inti();
    $scope.SearchVisitReasonType = function () {

        var Params = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": doctorinfo.doctorid,
            "VisitTypeId": $scope.VisitReasonListObj.VisitTypeId,
            "FacilityTypeId": $scope.VisitReasonListObj.FacilityTypeId,
            "visitReasonSearch": $scope.VisitReasonListObj.visitReasonSearch,
            "PageNumber": $scope.VisitReasonListObj.PageNumber || 1,
            "PageSize": $scope.VisitReasonListObj.PageSize || 10,
            "IsFrequent": "N"
        };

        eHnotePatientVisitReasonServices.getPatientVisitReasonWithPageNationList(Params).then(function (resp) {

            $scope.visitReasonList = resp.data.rows;
            $scope.visitReasonListcount = resp.data.count;

            if ($scope.visitReasonList.length > 0) {
                angular.forEach($scope.visitReasonList, function (item) {
                    if (item.IsFrequent == 'Y') {
                        item.IsFrequentInd = true;
                    }
                    else {
                        item.IsFrequentInd = false;
                    }
                });
            }

        })

    }

    $scope.ClearVisitReasonType = function () {
        $scope.VisitReasonListObj.VisitTypeId = "";
        $scope.VisitReasonListObj.FacilityTypeId = "";
        $scope.VisitReasonListObj.visitReasonSearch = "";
        $scope.SearchVisitReasonType();
    }



    $scope.ChangevisitPagination = function (pagenumber) {
        $scope.VisitReasonListObj.PageNumber = pagenumber;
        $scope.SearchVisitReasonType();

    }

    $scope.changeVisitActive = function (item, active) {
        if (item.ActiveInd == 'N') {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Active? </h4>", function () {


                var params = {
                    "UserId": doctorinfo.doctorid,
                    "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "VisitReasonId": item.ReasonId,
                    "ActiveInd": 'Y'
                }
                eHnotePatientVisitReasonServices.updateVisitReasonActiveStatusList(params).success(function (data) {
                    if (data.status === "Success") {
                        $scope.getVisitReasonType();
                        //    item.ActiveIND = active;
                    }
                }).error(function (error) {

                });


            }, function () {
                return;
            });
        }
        if (item.ActiveInd == 'Y') {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to In-Active? </h4>", function () {


                var params = {
                    "UserId": doctorinfo.doctorid,
                    "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "VisitReasonId": item.ReasonId,
                    "ActiveInd": 'N'
                }
                eHnotePatientVisitReasonServices.updateVisitReasonActiveStatusList(params).success(function (data) {
                    if (data.status === "Success") {
                        $scope.getVisitReasonType();
                        //    item.ActiveIND = active;
                    }
                }).error(function (error) {

                });


            }, function () {
                return;
            });
        }



    }

    $scope.DefaultvisitPageNumber = 1;
    $scope.DefaultvisitPageSize = 10;
    $scope.ChangedDefaultvisit = function (Pagenumber) {
        $scope.DefaultvisitPageNumber = Pagenumber;
        $scope.GetDefaultReasonForDoctors();

    }

    $scope.changeDefaultvisitActive = function (item, active) {

        if (item.ActiveInd == 'N') {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Active? </h4>", function () {

                var params = {
                    "UserId": doctorinfo.doctorid,
                    "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "DefaultVisitId": item.DefaultVisitId,
                    "ActiveInd": 'Y'
                }
                eHnotePatientVisitReasonServices.updateDefaultVisitReasonActiveStatusList(params).success(function (data) {
                    if (data.status === "Success") {
                        $scope.GetDefaultReasonForDoctors();
                    }
                }).error(function (error) {

                });


            }, function () {
                return;
            });
        }
        if (item.ActiveInd == 'Y') {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to In-Active? </h4>", function () {

                var params = {
                    "UserId": doctorinfo.doctorid,
                    "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "DefaultVisitId": item.DefaultVisitId,
                    "ActiveInd": 'N'
                }
                eHnotePatientVisitReasonServices.updateDefaultVisitReasonActiveStatusList(params).success(function (data) {
                    if (data.status === "Success") {
                        $scope.GetDefaultReasonForDoctors();
                    }
                }).error(function (error) {

                });


            }, function () {
                return;
            });
        }


    }
    $scope.BranchList1 = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.hospid }, true)[0],
        $scope.obj.HospitalObj = $scope.BranchList1;


    $scope.hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;

    function getCancelVisitreason() {
        var obj = {
            "UserId": $scope.UserId,
            "OrganizationId": 0,
            "OrganizationCancelVisitReasonId": 0,
            "CancelVisitReasonId": 0,
            "DeleteInd": "N",
            "ReasonforCancellation": "",
            "Value": "",
            "ParentOrganizationId": 0,
            "HospitalId": "",
            "HospitalName": ""
        }
        return obj;

    }
    $scope.newCancelVisitReason = getCancelVisitreason();

    $scope.GetCancelVisitReasonNew = function () {
        var params = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PageSize": $scope.CancelVisitReasonPageSize || 10,
            "PageNumber": $scope.CancelVisitReasonPageNumber || 1,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "SearchText": "",
            "GetAllIndicator": 0,
        }

        if ($scope.newCancelVisitReason.OrganizationId == 0) {
            params.GetAllIndicator = 1;
        } else if ($scope.newCancelVisitReason.OrganizationId != 0) {
            params.GetAllIndicator = 0;
        }
        eHnotePatientVisitReasonServices.GetOrganizationCancelVisitReasonsList(params).then(function (resp) {

            console.log(resp.data);

            $scope.CancelVisitReasonList = [];
            if (resp.data.status = "Success") {
                $scope.CancelVisitReasonArray = resp.data.rows;
                $scope.CancelVisitReasonArrayCount = resp.data.Count;
            }

        }, function (error) {
            console.log(error);
        });
    };
    $scope.GetCancelVisitReasonNew();


    $scope.CancelSubmit = function () {

        if ($scope.newCancelVisitReason.ReasonforCancellation === "") {
            alertify.error("Please Enter Reason For ReasonforCancellation")
            return false;
        }

        var Obj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.newCancelVisitReason.OrganizationId,
            "CancelVisitReasonId": $scope.newCancelVisitReason.CancelVisitReasonId,
            "ReasonForCancel": $scope.newCancelVisitReason.ReasonforCancellation,
            "DeleteInd": "N",
            "ActiveInd": "Y",
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": 0,
        }

        if ($scope.newCancelVisitReason.OrganizationId == 0) {
            Obj.GetAllIndicator = 1;
        } else if ($scope.newCancelVisitReason.OrganizationId != 0) {
            Obj.GetAllIndicator = 0;
        }



        eHnotePatientVisitReasonServices.AddupdateCancelVisitReasonsList(Obj).then(function (resp) {
            console.log(resp.data);


            if (resp.data.status === 'Failure') {
                alertify.error(" Reason For Cancellation  Already Exists");
                return false;
            }

            if (resp.data.status = "Success") {
                if ($scope.newCancelVisitReason.CancelVisitReasonId === 0) {
                    $scope.GetCancelVisitReasonNew();
                    alertify.success('Reason For Cancellation Added Successfully');
                    $scope.newCancelVisitReason = getCancelVisitreason();
                }
                else {
                    $scope.GetCancelVisitReasonNew();
                    alertify.success('Reason for Cancellation Updated !');
                    $scope.newCancelVisitReason = getCancelVisitreason();
                }

            }
            $scope.VisitReasonSumbitText = 'Add'

        });


    }

    $scope.VisitReasonSumbitText = 'Add'

    $scope.searchHospital = {
        "txt1": "",
        "txt2": ""
    };

    $scope.ChangeHospital = function (item) {
        $scope.obj.HospitalObj = item;
        $scope.selectedBranchs = item;
        $scope.newCancelVisitReason.OrganizationId = $scope.selectedBranchs.BranchId;

    }

    $scope.ClearCancel = function () {
        $scope.newCancelVisitReason = getCancelVisitreason();
        $scope.VisitReasonSumbitText = 'Add'
    }

    $scope.CancelVisitEditClick1 = function (item) {
        $scope.reasonForCancelFocus = true;
        $scope.openedReasonForCancellaation = true;
        $scope.obj.HospitalObj.ClinicName = item.OrganizationName;
        $scope.newCancelVisitReason.OrganizationId = item.OrganizationId;
        $scope.newCancelVisitReason.ReasonforCancellation = item.CancelReason;
        $scope.newCancelVisitReason.CancelVisitReasonId = item.CancelVisitReasonId;
        $scope.VisitReasonSumbitText = 'Update'

    }

    $scope.changeCancelvisitActive = function (item) {
        if (item.ActiveInd == 'N') {
            var params = {
                "UserId": doctorinfo.doctorid,
                "HospitalId": item.OrganizationId,
                "CancelVisitReasonId": item.CancelVisitReasonId,
                "ActiveInd": 'Y'
            }
            eHnotePatientVisitReasonServices.UpdateCancelVisitActiveStatusList(params).success(function (data) {
                if (data.status === "Success") {
                    $scope.GetCancelVisitReasonNew();
                    alertify.success('Activated Successfully');
                }
            }).error(function (error) {

            });
        }
        if (item.ActiveInd == 'Y') {
            var params = {
                "UserId": doctorinfo.doctorid,
                "HospitalId": item.OrganizationId,
                "CancelVisitReasonId": item.CancelVisitReasonId,
                "ActiveInd": 'N'
            }
            eHnotePatientVisitReasonServices.UpdateCancelVisitActiveStatusList(params).success(function (data) {
                if (data.status === "Success") {
                    $scope.GetCancelVisitReasonNew();
                    alertify.success('Unactivated Successfully');
                }
            }).error(function (error) {
            });
        }
    }

    $scope.CancelVisitReasonPageNumber = 1;
    $scope.CancelVisitReasonPageSize = 10;
    $scope.ChangedCancelVisitReason = function (Pagenumber) {
        $scope.CancelVisitReasonPageNumber = Pagenumber;
        //$scope.SearchCancelVisitReasonType();
        $scope.GetCancelVisitReasonNew();

    }


    function SaerchgetCancelVisitreason() {
        var obj = {
            "UserId": $scope.UserId,
            "OrganizationId": 0,
            "CancelVisitReasonId": 0,
            "ReasonforCancellation": "",
            "Value": "",
            "ParentOrganizationId": 0,
            "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.hospid }, true)[0]
        }
        return obj;

    }
    $scope.SearchnewCancelVisitReason = SaerchgetCancelVisitreason();




    $scope.SerachChangeHospital = function (item) {
        $scope.SearchnewCancelVisitReason.BranchObj = item;
        $scope.SearchnewCancelVisitReason.OrganizationId = item.BranchId;
        $scope.SearchnewCancelVisitReason.OrganizationName = item.BranchName;
    }

    $scope.SearchCancelVisitReasonType = function () {
        var Params = {
            "OrganizationId": $scope.SearchnewCancelVisitReason.OrganizationId,
            "PageSize": $scope.CancelVisitReasonPageSize || 10,
            "PageNumber": $scope.CancelVisitReasonPageNumber || 1,
            "SearchText": $scope.SearchnewCancelVisitReason.ReasonforCancellation,
        };
        eHnotePatientVisitReasonServices.GetOrganizationCancelVisitReasonsList(Params).then(function (resp) {
            if (resp.data.status = "Success") {
                $scope.CancelVisitReasonArray = resp.data.rows;
                $scope.CancelVisitReasonArrayCount = resp.data.Count;
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.ClearCancelVisitReasonType = function () {
        $scope.SearchnewCancelVisitReason.ReasonforCancellation = "";
        $scope.SearchnewCancelVisitReason = SaerchgetCancelVisitreason();
        $scope.GetCancelVisitReasonNew();
    }

    $scope.VisitReasonObj = {
        "IsFrequent": false
    }

    $scope.ChangeVisitReasonFrequentStatus = function (item, ind) {
        if (ind == true) {
            var Frequentval = "Y"
        } else {
            var Frequentval = "N"
        }

        if (item.IsFrequent == "Y") {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck VisitReason", function () {
                var obj = {
                    "UserId": $scope.UserId,
                    "OrganizationId": item.OrganizationId,
                    "ReasonId": item.ReasonId,
                    "IsFrequent": Frequentval
                };
                eHnotePatientVisitReasonServices.UpdateVisitreasonIsFrequentStatusById(obj).then(function (resp) {
                    if (resp.data.status === "Success") {
                        alertify.success('Frequently Updated Successfully');
                        $scope.SearchVisitReasonType();
                    }
                    if (resp.data.status === 'Failure') {
                        alertify.error(resp.data.Message);
                        item.IsFrequentInd = false;
                    }
                });

            }, function () {
                r = "You pressed Cancel!";
                if (ind == false) {
                    item.IsFrequentInd = true;
                }
            });
        }

        if (item.IsFrequent == "N") {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": item.OrganizationId,
                "ReasonId": item.ReasonId,
                "IsFrequent": Frequentval
            };
            eHnotePatientVisitReasonServices.UpdateVisitreasonIsFrequentStatusById(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success('Frequently Updated Successfully');
                    $scope.SearchVisitReasonType();
                }
                if (resp.data.status === 'Failure') {
                    alertify.error(resp.data.Message);
                    item.IsFrequentInd = false;
                }
            });

        }

    }

    $scope.ShowRemarksListRefPopover = {
        templateUrl: 'ShowRemarksListRefPopoverPopovertemplate.html'
    };


    $scope.addedVisitReason = false;
    $scope.showRemarksField = false;
    $scope.openedReasonForCancellaation = false;
    $scope.addedUserDefaultVisitReason = false;
    $scope.addedVisitReasonForVisit = false;
    $scope.addedRemarksForVisit = false;

    $scope.navtoAddNewApptVisitReason = function () {
        $scope.addedVisitReason = true;
        $scope.editvisitReason = false;
        $scope.AddNewAppointmentVisitReasonObj = getnewAddAppointmentVisitReasonObj();
        angular.forEach($scope.BranchListArrayForAdd, function (mitem) {
            mitem.IsChecked = true;
        });
        $scope.AllBranchObj.SelectStatusString = "All Locations";
        $scope.getParentOrgAppointmentVisitReasons();
    };
    $scope.addRemarks = function () {
        $scope.showRemarksField = true;
    };
    $scope.addReasonForCancellation = function () {
        $scope.openedReasonForCancellaation = true;
    };
    $scope.addUserDefaultVisitReason = function () {
        $scope.addedUserDefaultVisitReason = true;
    };
    $scope.addVisitReasonForVisit = function () {
        $scope.addedVisitReasonForVisit = true;
    };
    $scope.addRemarksForVisit = function () {
        $scope.addedRemarksForVisit = true;
    };

    $scope.closeVisitReason = function () {
        $scope.visitReason = "";
        $scope.VisitSumbitText = 'Add';
        $scope.color = '';
        $scope.VisitTypeList = "";
        $scope.VisitRsnID = 0;
        $scope.FacilityTypeId = 0;
        $scope.editvisitReason = false;
        $scope.VisitReasonRemarks = '';
        $scope.VisitReasonObj.IsFrequent = false;
        $scope.addedVisitReason = false;
    };
    $scope.closeReasonForCancellation = function () {
        $scope.obj.HospitalObj.ClinicName = '';
        $scope.newCancelVisitReason.OrganizationId = 0;
        $scope.newCancelVisitReason.ReasonforCancellation = '';
        $scope.newCancelVisitReason.CancelVisitReasonId = 0;
        $scope.VisitReasonSumbitText = 'Add'
        $scope.openedReasonForCancellaation = false;
    };

    $scope.closeUserDefaultVisitReason = function () {
        $scope.addedUserDefaultVisitReason = false;
        $scope.UserVisitReasonObj.DoctorObj.UserFullName = "Select";
        $scope.UserVisitReasonObj.DoctorId = 0;
        $scope.UserVisitTypeid = "";
        $scope.othervisitrsnid = "";
        $scope.DefaultVisitId = 0;
    };
    $scope.closeVisitReasonForVisit = function () {
        $scope.VisitResonforvistobj = $scope.GetVisitResonforvistobj();
        $scope.addedVisitReasonForVisit = false;
    };
    $scope.LostSettingsFocus = function () {
        $scope.visitReasonForOpFocus = false;
        $scope.visitReasonForVisitFocus = false;
        $scope.defaultVisitReasonFocus = false;
        $scope.reasonForCancelFocus = false;
    };





    function getnewAddAppointmentVisitReasonObj() {
        var obj = {
            "UserId": $scope.UserId,
            "ParentOrganizationId": $scope.ParentHospitalId,
            "ParentAppointmentVisitReasonId": 0,
            "AppointmentVisitReason": "",
            "AppointmentTypeId": 0,
            "AppointmentType": "",
            "DeleteInd": "N",
            "OrgAppointmentVisitReasonId": 0,
            "OrganizationId": 0,
            "OrganizationFacilityId": 0,
            "FacilityTypeId": 0,
            "FacilityType": "",
            "VisitReasonColorCode": "",
            "IsFrequent": false,
            "IsEdit": false,
            "ActiveInd": "Y",
            "Remarks": "",
            "DeleteInd": "N",
            "IsFemtoTemplateShow": false,
            "IsYagTemplateShow": false,
        };

        return obj;
    };


    $scope.AddNewAppointmentVisitReasonObj = getnewAddAppointmentVisitReasonObj();

    $scope.BranchListArrayForAdd = angular.copy($scope.MainSettingObj.BranchesArray);
    $scope.BranchListArrayForGet = angular.copy($scope.MainSettingObj.BranchesArray);

    function getnewAddClinicalVisitReasonObj() {
        var obj = {
            "UserId": $scope.UserId,
            "ParentOrganizationId": $scope.ParentHospitalId,
            "OrganizationId": 0,
            "ParentClinicalVisitReasonId": 0,
            "ClinicalVisitReason": "",
            "ParentAppointmentVisitReasonId": 0,
            "OrgAppointmentVisitReasonId": 0,
            "ParentAppointmentVisitReason": "",
            "AppointmentTypeId": 0,
            "AppointmentType": "",
            "ActiveInd": "Y",
            "Remarks": "",
            "ProcOperativeNote": "",
            "ProcDescription": "",
            "ProcChecklist": "",
            "IsASC": "N",
            "IsEMR": "Y",
            "OldVisitTypeId": 0,
            "addNewVisitTypeVisitReason": false,
            "editvisitReason": false,
            "DeleteInd": "N",
        };

        return obj;
    };


    $scope.AddNewClinicalVisitReasonObj = getnewAddClinicalVisitReasonObj();

    function getnewClinicalReasonReqObj() {
        var obj = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "ParentAppointmentVisitReasonId": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": "",
            "OrganizationId": 0,
            "AppointmentTypeId": 0,
            "IsFrequent": "N",
            "IsParent": "Y",
            "IsActive": "Y",
            "TotalCount": 0,
        };
        return obj;
    }

    $scope.newGetClinicalVisitReasonsobj = getnewClinicalReasonReqObj();

    angular.forEach($scope.BranchListArrayForAdd, function (bitem) {
        bitem.IsChecked = true;
    });
    $scope.AllBranchObj = {
        "SelectStatusString": "All Locations",
        "Name": ""
    };


    $scope.toggleBranchSelection = function (item) {

        if (item.IsChecked) {
            $scope.AllBranchObj.SelectStatusString = "Selected";
            if (item.ClinicId === 0) {
                angular.forEach($scope.BranchListArrayForAdd, function (mitem) {
                    mitem.IsChecked = true;
                });

                $scope.AllBranchObj.SelectStatusString = "All Locations";
            } else {


                if ($scope.BranchListArrayForAdd.every(mitem => mitem.ClinicId === 0 || mitem.IsChecked)) {
                    $scope.BranchListArrayForAdd.forEach(mitem => {
                        if (mitem.ClinicId === 0) {
                            mitem.IsChecked = true;

                            $scope.AllBranchObj.SelectStatusString = "All Locations";
                        }
                    });
                }

            }

        }
        else {
            if (item.ClinicId === 0) {
                angular.forEach($scope.BranchListArrayForAdd, function (mitem) {
                    mitem.IsChecked = false;
                });
            } else {


                angular.forEach($scope.BranchListArrayForAdd, function (mitem) {
                    if (mitem.ClinicId === 0) {
                        mitem.IsChecked = false;
                    }
                });

            }

            $scope.AllBranchObj.SelectStatusString = "Selected";

            var nofalsecount = 0;
            angular.forEach($scope.BranchListArrayForAdd, function (mitem) {
                if (mitem.IsChecked) {
                    nofalsecount++;
                }
            });
            if (nofalsecount === 0) {
                $scope.AllBranchObj.SelectStatusString = "Select Location";
            }
        }
    }

    $scope.changeApptVisitAppointmentType = function (obj) {
        var filteredAPptType = $filter("filter")($scope.masterappointmentTypes, { "Id": obj.AppointmentTypeId }, true) || [];
        if (filteredAPptType.length > 0) {
            obj.AppointmentType = filteredAPptType[0].Name;
        }
    };

    $scope.navtoAddApptVisitReasonsClick = function () {


        var IsFrequestA = "N";
        if ($scope.AddNewAppointmentVisitReasonObj.IsFrequent == true) {
            IsFrequestA = "Y";
        }

        let i = 0;
        angular.forEach($scope.BranchListArrayForAdd, function (item) {
            if (item.IsChecked == true) {
                i++;
            }
        });

        if (i == 0) {
            alertify.error('Please select the location');
            return false;
        }

        if ($scope.AddNewAppointmentVisitReasonObj.AppointmentVisitReason == "") {
            alertify.error('Please enter visit reason');
            return false;
        }

        if ($scope.AddNewAppointmentVisitReasonObj.AppointmentTypeId == 0) {
            alertify.error('Please select visit type');
            return false;
        }


        var params = {
            "UserId": $scope.UserId,
            "ParentOrganizationId": $scope.ParentHospitalId,
            "ParentAppointmentVisitReasonId": $scope.AddNewAppointmentVisitReasonObj.ParentAppointmentVisitReasonId || 0,
            "AppointmentVisitReason": $scope.AddNewAppointmentVisitReasonObj.AppointmentVisitReason || "",
            "AppointmentTypeId": $scope.AddNewAppointmentVisitReasonObj.AppointmentTypeId,
            "AppointmentType": $scope.AddNewAppointmentVisitReasonObj.AppointmentType,
            "DeleteInd": "N",
            "ActiveInd": "Y",
            "LocationArray": []
        };



        angular.forEach($scope.BranchListArrayForAdd, function (bitem) {
            if (bitem.IsChecked) {
                var obj = {
                    "OrgAppointmentVisitReasonId": $scope.AddNewAppointmentVisitReasonObj.OrgAppointmentVisitReasonId || 0,
                    "OrganizationId": bitem.ClinicId,
                    "OrganizationFacilityId": 0,
                    "FacilityTypeId": 0,
                    "FacilityType": "",
                    "VisitReasonColorCode": $scope.AddNewAppointmentVisitReasonObj.VisitReasonColorCode,
                    "IsFrequent": IsFrequestA,
                    "ActiveInd": "Y",
                    "Remarks": $scope.AddNewAppointmentVisitReasonObj.Remarks,
                    "DeleteInd": "N",
                    "IsFemtoTemplateShow": $scope.AddNewAppointmentVisitReasonObj.IsFemtoTemplateShow,
                    "IsYagTemplateShow": $scope.AddNewAppointmentVisitReasonObj.IsYagTemplateShow,
                };

                params.LocationArray.push(obj)
            }
        });

       
        eHnotePatientVisitReasonServices.AddUpdateOrganizationAppointmentVisitResons(params, callbackAddApptSuccess, callbackAddApptFailure);

        function callbackAddApptSuccess(response) {

            console.log(response);
            response.LocationArray = response.LocationArray || [];
            if (response.LocationArray.length === 0) {
                alertify.error("This Visit Reason already exists");
            }

            else if (response.status == 'Success') {
                alertify.success("Saved Successfully");
                $scope.clearAppointmentVisitAdd();
                $scope.editvisitReason = false;
                $scope.VisitReasonPageNo = $scope.newGetApptVisitReasonsobj.PageNumber || 1;
                $scope.VisitReasonTotalCount = $scope.newGetApptVisitReasonsobj.TotalCount || 0;
                $scope.newGetApptVisitReasonsobj = getnewApptReasonReqObj();
                $scope.newGetApptVisitReasonsobj.PageNumber = $scope.VisitReasonPageNo;
                $scope.newGetApptVisitReasonsobj.TotalCount = $scope.VisitReasonTotalCount;
                $scope.getAllOrgAppointmentVisitReasons();
                $scope.getParentOrgAppointmentVisitReasons();
            } else {
                alertify.error(response.Message);
            }

        }
        function callbackAddApptFailure(error) {
            console.log(error);

        }
    };

    $scope.ParentOrgApptVisitReasonsArray = [];
    $scope.getParentOrgAppointmentVisitReasons = function () {

        var params = {
            "ParentOrganizationId": $scope.ParentHospitalId
        }
        eHnotePatientVisitReasonServices.GetParentOrgApptVisitReasons(params).then(function (resp) {

            if (resp.data.rows.length > 0) {
                $scope.ParentOrgApptVisitReasonsArray = resp.data.rows || [];
            }
        })
    }

    $scope.onSelectApptVisitReasons = function (mainitem, obj) {
        console.log(mainitem);
        if (mainitem !== "") {
            $scope.AddNewAppointmentVisitReasonObj.ParentAppointmentVisitReasonId = mainitem.ParentAppointmentVisitReasonId;
            $scope.AddNewAppointmentVisitReasonObj.AppointmentTypeId = mainitem.AppointmentTypeId;
            $scope.AddNewAppointmentVisitReasonObj.AppointmentType = mainitem.AppointmentType;
            $scope.AddNewAppointmentVisitReasonObj.AppointmentVisitReason = mainitem.AppointmentVisitReason || "";
        }
    };

    $scope.onchangeApptVisitReason = function (mainitem) {

        
        if ($scope.AddNewAppointmentVisitReasonObj.OrgAppointmentVisitReasonId === 0) {
            $scope.AddNewAppointmentVisitReasonObj.ParentAppointmentVisitReasonId = 0;
        }
        
    };

    $scope.clearAppointmentVisitAdd = function () {
        $scope.AddNewAppointmentVisitReasonObj = getnewAddAppointmentVisitReasonObj();
        $scope.AllBranchObj.SelectStatusString = "Select Location";
        angular.forEach($scope.BranchListArrayForAdd, function (bitem) {
            bitem.IsChecked = true;
        });
    }
    $scope.masterappointmentTypes = [];
    eHnotePatientAddressDataServices.getAppointmentTypes(onTypesSuccess, onTypesFailed);
    function onTypesSuccess(data) {

        $scope.masterappointmentTypes = data;
        console.log($scope.masterappointmentTypes);
    }

    function onTypesFailed(err) {
        console.log(err);
    }






    $scope.SearchAppointmentVisitReasons = function () {
        $scope.getAllOrgAppointmentVisitReasons();
    };

    $scope.ClearAppointmentVisitReasons = function () {
        $scope.newGetApptVisitReasonsobj = getnewApptReasonReqObj();
        $scope.getAllOrgAppointmentVisitReasons();
    }


    $scope.changeAppointmentVisitReasonActive = function (item, active) {
        if (item.ActiveInd == 'N') {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Active? </h4>", function () {


                var params = {
                    "UserId": $scope.UserId,
                    "HospitalId": item.OrganizationId,
                    "OrgAppointmentVisitReasonId": item.OrgAppointmentVisitReasonId,
                    "ActiveInd": 'Y'
                }
                eHnotePatientVisitReasonServices.UpdateAppointmentVisitReasonActiveStatus(params).success(function (data) {
                    if (data.status === "Success") {
                        $scope.getAllOrgAppointmentVisitReasons();
                    }
                }).error(function (error) {

                });


            }, function () {
                return;
            });
        }
        if (item.ActiveInd == 'Y') {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to In-Active? </h4>", function () {


                var params = {
                    "UserId": $scope.UserId,
                    "HospitalId": item.OrganizationId,
                    "OrgAppointmentVisitReasonId": item.OrgAppointmentVisitReasonId,
                    "ActiveInd": 'N'
                }
                eHnotePatientVisitReasonServices.UpdateAppointmentVisitReasonActiveStatus(params).success(function (data) {
                    if (data.status === "Success") {
                        $scope.getAllOrgAppointmentVisitReasons();
                    }
                }).error(function (error) {

                });


            }, function () {
                return;
            });
        }



    }


    $scope.EditAppointmentVisitReasonClick = function (item) {
        $scope.visitReasonForOpFocus = true;
        $scope.addedVisitReason = true;
        $scope.editvisitReason = true;
        $scope.AddNewAppointmentVisitReasonObj = getnewAddAppointmentVisitReasonObj();


        angular.forEach($scope.BranchListArrayForAdd, function (bitem) {
            bitem.IsChecked = false;
            if (bitem.ClinicId === item.OrganizationId) {
                bitem.IsChecked = true;
            }
        });
        $scope.AllBranchObj = {
            "SelectStatusString": "Selected",
            "Name": ""
        };

        $scope.AddNewAppointmentVisitReasonObj.ParentAppointmentVisitReasonId = item.ParentAppointmentVisitReasonId || 0;
        $scope.AddNewAppointmentVisitReasonObj.AppointmentVisitReason = item.AppointmentVisitReason || "";
        $scope.AddNewAppointmentVisitReasonObj.AppointmentTypeId = item.AppointmentTypeId || 0;
        $scope.AddNewAppointmentVisitReasonObj.AppointmentType = item.AppointmentType || 0;
        $scope.AddNewAppointmentVisitReasonObj.VisitReasonColorCode = item.VisitReasonColorCode || "";
        $scope.AddNewAppointmentVisitReasonObj.OrganizationId = item.OrganizationId || "";
        $scope.AllBranchObj.SelectStatusString = item.OrganizationName || "";
        $scope.AddNewAppointmentVisitReasonObj.OrgAppointmentVisitReasonId = item.OrgAppointmentVisitReasonId || 0;
        $scope.AddNewAppointmentVisitReasonObj.IsFemtoTemplateShow = item.IsFemtoTemplateShow || false;
        $scope.AddNewAppointmentVisitReasonObj.IsYagTemplateShow = item.IsYagTemplateShow || false;
        $scope.AddNewAppointmentVisitReasonObj.IsFrequent = "N";
        if (item.IsFrequent) {
            $scope.AddNewAppointmentVisitReasonObj.IsFrequent = "Y";
        }
        $scope.AddNewAppointmentVisitReasonObj.ActiveInd = item.ActiveInd || "";
        $scope.AddNewAppointmentVisitReasonObj.Remarks = item.Remarks || "";
        $scope.AddNewAppointmentVisitReasonObj.DeleteInd = item.DeleteInd || "";
        $scope.AddNewAppointmentVisitReasonObj.IsEdit = true;
    };


    $scope.ChangeAppointmentvisitReasonPagination = function (pagenumber) {
        $scope.newGetApptVisitReasonsobj.PageNumber = pagenumber;
        $scope.getAllOrgAppointmentVisitReasons();

    }

    $scope.closeAppointmentVisitReason = function () {
        $scope.addedVisitReason = false;
        $scope.AddNewAppointmentVisitReasonObj = getnewAddAppointmentVisitReasonObj();
    };
    $scope.changeOrgForAPptVisitReasons = function (orgid) {
        var OrganizationID = parseFloat(orgid) || 0;
        if (OrganizationID === 0) {
            $scope.newGetApptVisitReasonsobj.IsParent = "Y";
        } else {
            $scope.newGetApptVisitReasonsobj.IsParent = "N";
        }
        $scope.newGetApptVisitReasonsobj.OrganizationId = orgid;
        //$scope.getAllOrgAppointmentVisitReasons();
    }

    $scope.getAllOrgVisitTypeVisitReasons = function () {
        var obj = {
            "ParentOrganizationId": $scope.newGetClinicalVisitReasonsobj.ParentOrganizationId,
            "PageSize": $scope.newGetClinicalVisitReasonsobj.PageSize || 10,
            "PageNumber": $scope.newGetClinicalVisitReasonsobj.PageNumber || 1,
            "SearchText": $scope.newGetClinicalVisitReasonsobj.SearchText || "",
            "OrganizationId": $scope.newGetClinicalVisitReasonsobj.OrganizationId || 0,
            "ParentAppointmentVisitReasonId": $scope.newGetClinicalVisitReasonsobj.ParentAppointmentVisitReasonId || 0,
            "AppointmentTypeId": $scope.newGetClinicalVisitReasonsobj.AppointmentTypeId || 0,
            "IsFrequent": $scope.newGetClinicalVisitReasonsobj.IsFrequent || "N",
            "IsParent": $scope.newGetClinicalVisitReasonsobj.IsParent || "Y"
        };
        eHnotePatientVisitReasonServices.GetOrganizationVisitTypeVisitReasons(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.newGetClinicalVisitReasonsobj.TotalCount = 0;
                    if (resp.data.rows.length > 0) {
                        $scope.AllClinicalVistReasonsArray = resp.data.rows || [];
                    }
                    console.log($scope.AllClinicalVistReasonsArray);
                    $scope.newGetClinicalVisitReasonsobj.TotalCount = resp.data.count;

                } else {
                    $scope.AllClinicalVistReasonsArray = [];
                }
            }
        });
    };

    $scope.navtoAddVisitTypeVisitReasonsClick = function () {

        let i = 0;
        angular.forEach($scope.BranchListArrayForAdd, function (item) {
            if (item.IsChecked == true) {
                i++;
            }
        });

        if (i == 0) {
            alertify.error('Please select the location');
            return false;
        }

        if ($scope.AddNewClinicalVisitReasonObj.ParentAppointmentVisitReasonId == 0) {
            alertify.error('Please select appointment visit reason');
            return false;
        }

        if ($scope.AddNewClinicalVisitReasonObj.ClinicalVisitReason == "") {
            alertify.error('Please enter visit reason');
            return false;
        }

        var params = {
            "UserId": $scope.UserId,
            "ParentOrganizationId": $scope.ParentHospitalId,
            "ParentClinicalVisitReasonId": $scope.AddNewClinicalVisitReasonObj.ParentClinicalVisitReasonId || 0,
            "ClinicalVisitReason": $scope.AddNewClinicalVisitReasonObj.ClinicalVisitReason || "",
            "ParentAppointmentVisitReasonId": $scope.AddNewClinicalVisitReasonObj.ParentAppointmentVisitReasonId || 0,
            "AppointmentTypeId": $scope.AddNewClinicalVisitReasonObj.AppointmentTypeId,
            "ActiveInd": "Y",
            "Remarks": $scope.AddNewClinicalVisitReasonObj.Remarks,
            "ProcOperativeNote": "",
            "ProcDescription": "",
            "ProcChecklist": "",
            "IsASC": "N",
            "IsEMR": "Y",
            "OldVisitTypeId": 0,
            "DeleteInd": "N",
            "LocationArray": []
        };



        angular.forEach($scope.BranchListArrayForAdd, function (bitem) {
            if (bitem.IsChecked) {
                var obj = {
                    "OrgClinicalVisitReasonId": $scope.AddNewClinicalVisitReasonObj.OrgClinicalVisitReasonId || 0,
                    "ClinicalVisitReason": $scope.AddNewClinicalVisitReasonObj.ClinicalVisitReason || "",
                    "OrgAppointmentVisitReasonId": 0,
                    "ParentClinicalVisitReasonId": $scope.AddNewClinicalVisitReasonObj.ParentClinicalVisitReasonId || 0,
                    "ParentAppointmentVisitReasonId": $scope.AddNewClinicalVisitReasonObj.ParentAppointmentVisitReasonId || 0,
                    "AppointmentTypeId": $scope.AddNewClinicalVisitReasonObj.AppointmentTypeId || 0,
                    "OrganizationId": bitem.ClinicId,
                    "OrganizationFacilityId": $scope.AddNewClinicalVisitReasonObj.OrganizationFacilityId || 0,
                    "FacilityTypeId": $scope.AddNewClinicalVisitReasonObj.FacilityTypeId || 0,
                    "FacilityType": $scope.AddNewClinicalVisitReasonObj.FacilityType || "",
                    "ActiveInd": "Y",
                    "Remarks": $scope.AddNewClinicalVisitReasonObj.Remarks || "",
                    "ProcOperativeNote": "",
                    "ProcDescription": "",
                    "ProcChecklist": "",
                    "DeleteInd": "N"
                };
                params.LocationArray.push(obj)
            }
        });

        console.log(JSON.stringify(params));

        eHnotePatientVisitReasonServices.AddUpdateOrganizationVisitTypeVisitReasons(params, callbackAddApptSuccess, callbackAddApptFailure);

        function callbackAddApptSuccess(response) {

            console.log(response);

            if (response.status == 'Success') {

                alertify.success("Saved Successfully");
                $scope.getAllOrgVisitTypeVisitReasons();
                $scope.AddNewClinicalVisitReasonObj = getnewAddClinicalVisitReasonObj();
            }
        }
        function callbackAddApptFailure(error) {
            console.log(error);

        }
    };

    $scope.onSelectAppoitmentVisitReasons = function (item) {
        $scope.AddNewClinicalVisitReasonObj.ParentAppointmentVisitReasonId = item.ParentAppointmentVisitReasonId || 0;
        $scope.AddNewClinicalVisitReasonObj.ParentAppointmentVisitReason = item.Reason || '';
        $scope.AddNewClinicalVisitReasonObj.AppointmentType = item.AppointmentType || '';
        $scope.AddNewClinicalVisitReasonObj.AppointmentTypeId = item.AppointmentTypeId || 0;
        $scope.AddNewClinicalVisitReasonObj.FacilityType = item.FacilityType || "";
        $scope.AddNewClinicalVisitReasonObj.FacilityTypeId = item.FacilityTypeId || 0;
        $scope.AddNewClinicalVisitReasonObj.OrganizationFacilityId = item.OrganizationFacilityId || 0;
    };

    $scope.ChangeClinicalvisitReasonPagination = function (pagenumber) {
        $scope.newGetClinicalVisitReasonsobj.PageNumber = pagenumber;
        $scope.getAllOrgVisitTypeVisitReasons();
    }

    $scope.EditClinicaltVisitReasonClick = function (item) {

        $scope.AddNewClinicalVisitReasonObj = getnewAddClinicalVisitReasonObj();
        angular.forEach($scope.BranchListArrayForAdd, function (bitem) {
            bitem.IsChecked = false;
            if (bitem.ClinicId === item.OrganizationId) {
                bitem.IsChecked = true;
            }
        });
        $scope.AllBranchObj = {
            "SelectStatusString": "Selected",
            "Name": ""
        };

        $scope.AddNewClinicalVisitReasonObj.ParentClinicalVisitReasonId = item.ParentClinicalVisitReasonId || 0;
        $scope.AddNewClinicalVisitReasonObj.ParentAppointmentVisitReasonId = item.ParentAppointmentVisitReasonId || 0;
        $scope.AddNewClinicalVisitReasonObj.ParentAppointmentVisitReason = item.ParentAppointmentVisitReason || "";
        $scope.AddNewClinicalVisitReasonObj.AppointmentTypeId = item.AppointmentTypeId || 0;
        $scope.AddNewClinicalVisitReasonObj.AppointmentType = item.AppointmentType || "";
        $scope.AddNewClinicalVisitReasonObj.OrganizationId = item.OrganizationId || 0;
        $scope.AddNewClinicalVisitReasonObj.OrganizationName = item.OrganizationName || "";
        $scope.AllBranchObj.SelectStatusString = item.OrganizationName || "";
        $scope.AddNewClinicalVisitReasonObj.OrgClinicalVisitReasonId = item.OrgClinicalVisitReasonId || 0;
        $scope.AddNewClinicalVisitReasonObj.OrganizationFacilityId = item.OrganizationFacilityId || 0;
        $scope.AddNewClinicalVisitReasonObj.OrganizationFacilityName = item.OrganizationFacilityName || "";
        $scope.AddNewClinicalVisitReasonObj.IsFrequent = item.IsFrequent || "N";
        $scope.AddNewClinicalVisitReasonObj.ActiveInd = item.ActiveInd || "N";
        $scope.AddNewClinicalVisitReasonObj.Remarks = item.Remarks || "";
        $scope.addedRemarksForVisit = true;
        $scope.AddNewClinicalVisitReasonObj.editvisitReason = true;
        $scope.AddNewClinicalVisitReasonObj.addNewVisitTypeVisitReason = true;
        $scope.AddNewClinicalVisitReasonObj.ClinicalVisitReason = item.ClinicalVisitReason || "";
        $scope.AddNewClinicalVisitReasonObj.FacilityType = item.FacilityType || "";
        $scope.AddNewClinicalVisitReasonObj.FacilityTypeId = item.FacilityTypeId || 0;
        $scope.AddNewClinicalVisitReasonObj.DeleteInd = item.DeleteInd || "";
    };

    $scope.ClearClinicalVisitReason = function () {
        $scope.newGetClinicalVisitReasonsobj = getnewClinicalReasonReqObj();
        $scope.getAllOrgVisitTypeVisitReasons();
    }

    $scope.navtoAddNewClinicalVisitReason = function () {
        $scope.addedRemarksForVisit = true;
        $scope.AddNewClinicalVisitReasonObj = getnewAddClinicalVisitReasonObj();
        $scope.AddNewClinicalVisitReasonObj.addNewVisitTypeVisitReason = true;
        angular.forEach($scope.BranchListArrayForAdd, function (mitem) {
            mitem.IsChecked = true;
        });
        $scope.AllBranchObj.SelectStatusString = "All Locations";
    };

    $scope.changeOrgForClinicalVisitReasons = function (orgid) {
        var OrganizationID = parseFloat(orgid) || 0;
        if (OrganizationID === 0) {
            $scope.newGetClinicalVisitReasonsobj.IsParent = "Y";
        } else {
            $scope.newGetClinicalVisitReasonsobj.IsParent = "N";
        }
        $scope.newGetClinicalVisitReasonsobj.OrganizationId = orgid;
    }

    $scope.clearNewClinicalvisitCondition = function () {
        angular.forEach($scope.BranchListArrayForAdd, function (bitem) {
            bitem.IsChecked = true;
        });
        $scope.AddNewClinicalVisitReasonObj = getnewAddClinicalVisitReasonObj();
        $scope.AddNewClinicalVisitReasonObj.addNewVisitTypeVisitReason = true;
        $scope.addedRemarksForVisit = true;
    }

    $scope.closeVisitTypeVisitReason = function () {
        $scope.AddNewClinicalVisitReasonObj.addNewVisitTypeVisitReason = false;
    };

    $scope.changeClinicalVisitReasonActive = function (item, active) {
        if (item.ActiveInd == 'N') {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Active? </h4>", function () {


                var params = {
                    "UserId": $scope.UserId,
                    "HospitalId": item.OrganizationId,
                    "OrgClinicalVisitReasonId": item.OrgClinicalVisitReasonId,
                    "ActiveInd": 'Y'
                }
                eHnotePatientVisitReasonServices.UpdateVisitTypeVisitReasonActiveStatus(params).success(function (data) {
                    if (data.status === "Success") {
                        $scope.getAllOrgVisitTypeVisitReasons();
                    }
                }).error(function (error) {

                });


            }, function () {
                return;
            });
        }
        if (item.ActiveInd == 'Y') {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to In-Active? </h4>", function () {


                var params = {
                    "UserId": $scope.UserId,
                    "HospitalId": item.OrganizationId,
                    "OrgClinicalVisitReasonId": item.OrgClinicalVisitReasonId,
                    "ActiveInd": 'N'
                }
                eHnotePatientVisitReasonServices.UpdateVisitTypeVisitReasonActiveStatus(params).success(function (data) {
                    if (data.status === "Success") {
                        $scope.getAllOrgVisitTypeVisitReasons();
                    }
                }).error(function (error) {

                });

            }, function () {
                return;
            });
        }

    }

    // online Appt visit
    function getAddNewOnlineAppointmentVisitReasonObj() {
        return {
            UserId: $scope.UserId,
            ParentOrganizationId: $scope.ParentHospitalId,
            ParentOnlineAppointmentVisitReasonId: 0,
            OnlineVisitReason: "",
            ActiveInd: "Y",
            DeleteInd: "N",
            Remarks: "",       
        };
    }
    $scope.AddNewOnlineAppointmentVisitReasonObj = getAddNewOnlineAppointmentVisitReasonObj();

    $scope.addedOnlineVisitReason = false;

    // Add New
    $scope.navtoAddNewOnlineVisitReason = function () {
        $scope.addedOnlineVisitReason = true;
        $scope.clearOnlineAppointmentVisitReason();
    };

    // Clear
    $scope.clearOnlineAppointmentVisitReason = function () {
        $scope.AddNewOnlineAppointmentVisitReasonObj = getAddNewOnlineAppointmentVisitReasonObj();
    };

    // Edit
    $scope.editOnlineAppointmentVisitReason = function (item) {
        $scope.addedOnlineVisitReason = true;
        $scope.AddNewOnlineAppointmentVisitReasonObj = angular.copy(item);
    };

    // Close
    $scope.closeOnlineAppointmentVisitReason = function () {
        $scope.clearOnlineAppointmentVisitReason();
        $scope.addedOnlineVisitReason = false;
    };

    function getOnlineApptReasonReqObj() {
        var obj = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": "",
            "OrganizationId": 0,
            "AppointmentTypeId": 0,
            "IsFrequent": "N",
            "IsParent": "Y",
            "IsActive": "Y",
            "TotalCount": "",
        };
        return obj;
    }

    $scope.OnlineGetApptVisitReasonsobj = getOnlineApptReasonReqObj();


    $scope.saveOnlineAppointmentVisitReason = function () {

        if (!$scope.AddNewOnlineAppointmentVisitReasonObj.OnlineVisitReason ||
            $scope.AddNewOnlineAppointmentVisitReasonObj.OnlineVisitReason.trim() == "") {
            alertify.error("Please enter Online Visit Reason");
            return false;
        }

        var isUpdate = $scope.AddNewOnlineAppointmentVisitReasonObj.ParentOnlineAppointmentVisitReasonId > 0;

        var params = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "UserId": $scope.UserId,        
            "ParentOnlineAppointmentVisitReasonId": $scope.AddNewOnlineAppointmentVisitReasonObj.ParentOnlineAppointmentVisitReasonId ||  0,
            "OnlineVisitReason": $scope.AddNewOnlineAppointmentVisitReasonObj.OnlineVisitReason ||"",
            "ActiveInd": "Y",
            "DeleteInd": "N",
            "Remarks": $scope.AddNewOnlineAppointmentVisitReasonObj.Remarks,
                    
        };

        eHnotePatientVisitReasonServices.AddUpdateOnlineAppointmentVisitReasons(params).then(function (resp) {


            if (resp.data.status === "Success") {
                if (isUpdate) {
                    alertify.success("Online Visit Reason updated successfully.");
                } else {
                    alertify.success("Online Visit Reason added successfully.");
                }
                $scope.getAllOnlineVisitReasons();
                $scope.addedOnlineVisitReason = false;
                $scope.clearOnlineAppointmentVisitReason();
            }
            else {

                alertify.error(resp.data.Message);

            }        
        });

    }

    $scope.getAllOnlineVisitReasons = function () {
        var obj = {
            "ParentOrganizationId": $scope.OnlineGetApptVisitReasonsobj.ParentOrganizationId,
            "PageSize": $scope.OnlineGetApptVisitReasonsobj.PageSize || 10,
            "PageNumber": $scope.OnlineGetApptVisitReasonsobj.PageNumber || 1,
            "SearchText": $scope.OnlineGetApptVisitReasonsobj.SearchText || "",
            "IsActive":0
           
        };
        eHnotePatientVisitReasonServices.GetOnlineAppointmentVisitReasons(obj).then(function (resp) {
            $scope.AllOnlineApptVistReasonsArray = [];
            if (resp.data.rows.length > 0) {
                $scope.AllOnlineApptVistReasonsArray = resp.data.rows || [];
                $scope.OnlineGetApptVisitReasonsobj.TotalCount = resp.data.count;
            }
           
          
        });
    };

    $scope.EditOnlineVisitReasonClick = function (reason) {
        $scope.addedOnlineVisitReason = true;
        $scope.AddNewOnlineAppointmentVisitReasonObj.ParentOnlineAppointmentVisitReasonId = reason.ParentOnlineAppointmentVisitReasonId;         
        $scope.AddNewOnlineAppointmentVisitReasonObj.OrgOnlineAppointmentVisitReasonId = reason.OrgOnlineAppointmentVisitReasonId;         
        $scope.AddNewOnlineAppointmentVisitReasonObj.OnlineVisitReason = reason.OnlineVisitReason;
        $scope.AddNewOnlineAppointmentVisitReasonObj.Remarks = reason.Remarks;        
        $scope.AddNewOnlineAppointmentVisitReasonObj.ActiveInd = reason.ActiveInd;          
        $scope.AddNewOnlineAppointmentVisitReasonObj.IsFrequent = reason.IsFrequentInd;          
    };


    $scope.changeOnlineAppointmentVisitReasonActive = function (item) {
        var activeStatus = (item.ActiveInd == "Y") ? "N" : "Y";
        var message = (item.ActiveInd == "Y")
            ? "Are you sure you want to In-Active?"
            : "Are you sure you want to Active?";

        alertify.confirm(
            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + message + "</h4>",
            function () {

                var params = {
                    "ParentOnlineAppointmentVisitReasonId": item.ParentOnlineAppointmentVisitReasonId,
                    "ParentOrganizationId": $scope.ParentHospitalId,
                    "UserId": $scope.UserId,
                    "OnlineVisitReason": item.OnlineVisitReason,
                    "Remarks": item.Remarks,
                    "DeleteInd": "N",
                    "ActiveInd": activeStatus
                };

              eHnotePatientVisitReasonServices.AddUpdateOnlineAppointmentVisitReasons(params).then(function (resp) {
                    if (resp.data.status === "Success") {
                        $scope.getAllOnlineVisitReasons();
                  }
                  else {

                      alertify.error(resp.data.Message);

                  }
                })
                                 
            },
            function () {
                return;
            });
    };

    $scope.SearchOnlineAppointmentVisitReasons = function () {
        $scope.getAllOnlineVisitReasons();
    };

    $scope.ClearOnlineAppointmentVisitReasons = function () {
        $scope.OnlineGetApptVisitReasonsobj = getOnlineApptReasonReqObj();
        $scope.getAllOnlineVisitReasons();
    }

    $scope.ChangeOnlineAppointmentvisitReasonPagination = function (pagenumber) {
        $scope.OnlineGetApptVisitReasonsobj.PageNumber = pagenumber;
        $scope.getAllOnlineVisitReasons();

    }

    // ===================== Visit Reason Groups (productivity weighting) =====================
    // Backed by SettingController.GetVisitReasonGroups / AddUpdateVisitReasonGroup
    // (eHnotePatientVisitReasonServices), Proc_GetVisitReasonGroups / Proc_AddUpdateVisitReasonGroup.
    // Visit reason checklist is sourced from GetOrganizationActiveAppointmentVisitReasonsById.

    $scope.ProviderTypeList = [
        { "Id": 1, "Name": "OD" },
        { "Id": 2, "Name": "MD" },
        { "Id": 3, "Name": "Technician" }
    ];

    $scope.MinutesOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
    $scope.PointsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Location list/mapping is the same as the Appointment Visit Reasons tab: BranchListArrayForGet,
    // whose ClinicId 0 entry is "All Locations" (EhnoteSettingsCtrl EmptyClinicObj).
    function getVisitReasonGroupLocationName(organizationId) {
        var branch = $filter('filter')($scope.BranchListArrayForGet, function (b) {
            return String(b.ClinicId) === String(organizationId || 0);
        })[0];
        return branch ? branch.ClinicName : "";
    }

    function getVisitReasonGroupObj() {
        return {
            "VisitReasonGroupId": 0,
            "ProviderTypeId": "",
            "OrganizationId": 0,
            "AppointmentTypeId": "",
            "Minutes": "",
            "Points": "",
            "ParentAppointmentVisitReasonIds": []
        };
    }

    function getVisitReasonGroupSearchObj() {
        return { "ProviderTypeId": "", "OrganizationId": 0, "ParentAppointmentVisitReasonId": "" };
    }

    $scope.VisitReasonGroupObj = getVisitReasonGroupObj();
    $scope.VisitReasonGroupSearchObj = getVisitReasonGroupSearchObj();
    $scope.VisitReasonGroupsArray = [];
    $scope.AllVisitReasonGroups = [];
    $scope.VisitReasonChecklist = [];
    $scope.UnmappedVisitReasonsArray = [];
    $scope.PendingVisitReasonGroupRows = [];
    $scope.addedVisitReasonGroup = false;
    $scope.VisitReasonGroupSearchText = "";
    $scope.AllVisitReasonGroupChecklistCheck = false;
    $scope.selectedVisitReasonGroupText = 'Select Visit Reasons';

    function updateSelectedVisitReasonGroupText() {
        var checked = $filter('filter')($scope.VisitReasonChecklist, { IsChecked: true });
        if (!checked.length) {
            $scope.selectedVisitReasonGroupText = 'Select Visit Reasons';
        } else if (checked.length === 1) {
            $scope.selectedVisitReasonGroupText = checked[0].AppointmentVisitReason;
        } else {
            $scope.selectedVisitReasonGroupText = checked.length + ' Visit Reasons Selected';
        }
    }

    $scope.toggleVisitReasonGroupSelection = function (reason) {
        var ids = $scope.VisitReasonGroupObj.ParentAppointmentVisitReasonIds;
        var idx = ids.indexOf(reason.ParentAppointmentVisitReasonId);
        if (reason.IsChecked && idx === -1) {
            ids.push(reason.ParentAppointmentVisitReasonId);
        } else if (!reason.IsChecked && idx !== -1) {
            ids.splice(idx, 1);
        }
        updateSelectedVisitReasonGroupText();
    };

    $scope.checkAllVisitReasonGroupChecklist = function (checkAll) {
        var visible = $filter('filter')($scope.VisitReasonChecklist, {
            AppointmentTypeId: $scope.VisitReasonGroupObj.AppointmentTypeId || undefined,
            AppointmentVisitReason: $scope.VisitReasonGroupSearchText
        });
        angular.forEach(visible, function (reason) {
            reason.IsChecked = checkAll;
            $scope.toggleVisitReasonGroupSelection(reason);
        });
    };

    $scope.getActiveVisitReasonsForGroups = function () {
        var obj = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            //"OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ReasonTypeId": 1,
            "VisitTypeId": null,
            "SearchText": ""
        };
        eHnotePatientVisitReasonServices.GetParentOrganizationActiveAppointmentVisitReasonsById(obj).then(function (resp) {
            var rows = (resp.data && resp.data.rows) || [];
            var seen = {};
            var list = [];
            angular.forEach(rows, function (r) {
                if (seen[r.ParentAppointmentVisitReasonId]) { return; }
                seen[r.ParentAppointmentVisitReasonId] = true;
                list.push({
                    "ParentAppointmentVisitReasonId": r.ParentAppointmentVisitReasonId,
                    "AppointmentVisitReason": r.AppointmentVisitReason,
                    "AppointmentTypeId": r.AppointmentTypeId,
                    "IsChecked": false
                });
            });
             $scope.VisitReasonChecklist = $filter("filter")(list, function (item) {
                 return item.AppointmentTypeId != 4 && item.AppointmentTypeId != 3;
            }) || [];
            $scope.getVisitReasonGroups();
        }, function () {
            alertify.error("Unable to load Visit Reasons. Please try again.");
        });
    };

    // Takes the provider-type-filtered groups, NOT the grid rows - a Visit Reason search
    // narrows the grid, but it must not make every other reason look unmapped.
    function refreshUnmappedVisitReasons(groups) {
        var providerTypeId = $scope.VisitReasonGroupSearchObj.ProviderTypeId;
        var mappedIds = {};
        angular.forEach(groups || [], function (grp) {
            if (grp.ActiveInd !== 'Y') { return; }
            if (providerTypeId && grp.ProviderTypeId !== providerTypeId) { return; }
            angular.forEach(grp.ParentAppointmentVisitReasonIds, function (id) { mappedIds[id] = true; });
        });

        $scope.UnmappedVisitReasonsArray = $filter('filter')($scope.VisitReasonChecklist, function (r) {
            return !mappedIds[r.ParentAppointmentVisitReasonId];
        });
    }

    // organizationId 0 = All Locations (no location filter), as in getAllOrgAppointmentVisitReasons
    function fetchVisitReasonGroups(organizationId) {
        var obj = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "ProviderTypeId": 0,
            "OrganizationId": organizationId || 0,
            "PageSize": 0,
            "PageNumber": 1,
            "SearchText": "",
            "IsActive": 0
        };
        return eHnotePatientVisitReasonServices.GetVisitReasonGroups(obj).then(function (resp) {
            var rows = (resp.data && resp.data.rows) || [];
            angular.forEach(rows, function (grp) {
                // Proc returns ParentAppointmentVisitReasonIds as objects:
                //   [{ VisitReasonIds: 4604, AppointmentVisitReason: "10-vista" }, ...]
                // Split it into the flat id list the save/edit flow needs and the names the grid shows.
                var reasons = grp.ParentAppointmentVisitReasonIds || [];
                grp.ParentAppointmentVisitReasonIds = reasons.map(function (r) { return r.VisitReasonIds; });
                grp.VisitReasonNames = reasons.map(function (r) { return r.AppointmentVisitReason; });
                grp.ProviderTypeName = grp.ProviderType;
                // a group saved before locations existed has none - shown as All Locations
                grp.OrganizationId = grp.OrganizationId || 0;
                grp.OrganizationName = getVisitReasonGroupLocationName(grp.OrganizationId);
            });
            return rows;
        });
    }

    // Always loads every provider type and location into AllVisitReasonGroups (the duplicate check
    // needs the full list); Provider Type / Visit Reason searches are applied client side.
    $scope.getVisitReasonGroups = function () {
        fetchVisitReasonGroups(0).then(function (rows) {
            $scope.AllVisitReasonGroups = rows;
            applyVisitReasonGroupSearch();
        });
    };

    // A specific Location is sent to GetVisitReasonGroups; All Locations uses the full list.
    // Provider Type and Visit Reason are then filtered client side as before.
    function applyVisitReasonGroupSearch() {
        var organizationId = $scope.VisitReasonGroupSearchObj.OrganizationId || 0;
        if (!organizationId) {
            filterVisitReasonGroups($scope.AllVisitReasonGroups);
            return;
        }
        fetchVisitReasonGroups(organizationId).then(function (rows) {
            // ignore a response for a location that is no longer selected
            if (String($scope.VisitReasonGroupSearchObj.OrganizationId || 0) !== String(organizationId)) { return; }
            filterVisitReasonGroups(rows);
        });
    }

    // Both filters are client side and independent - either one on its own, or both together.
    function filterVisitReasonGroups(sourceRows) {
        var providerTypeId = $scope.VisitReasonGroupSearchObj.ProviderTypeId;
        var visitReasonId = $scope.VisitReasonGroupSearchObj.ParentAppointmentVisitReasonId;

        var rows = !providerTypeId
            ? sourceRows
            : $filter('filter')(sourceRows, function (grp) {
                return String(grp.ProviderTypeId) === String(providerTypeId);
            });

        // "Unmapped" is about the provider type only, so work it out before the reason filter.
        refreshUnmappedVisitReasons(rows);

        if (visitReasonId) {
            rows = $filter('filter')(rows, function (grp) {
                // ids were flattened out of the proc's objects in getVisitReasonGroups()
                return (grp.ParentAppointmentVisitReasonIds || []).some(function (id) {
                    return String(id) === String(visitReasonId);
                });
            });
        }

        $scope.VisitReasonGroupsArray = rows;
    }

    $scope.SearchVisitReasonGroups = function () {
        applyVisitReasonGroupSearch();
    };

    $scope.ClearVisitReasonGroupSearch = function () {
        $scope.VisitReasonGroupSearchObj = getVisitReasonGroupSearchObj();
        applyVisitReasonGroupSearch();
    };

    $scope.navtoAddNewVisitReasonGroup = function () {
        $scope.addedVisitReasonGroup = true;
        $scope.clearVisitReasonGroup();
    };

    $scope.clearVisitReasonGroup = function () {
        $scope.VisitReasonGroupObj = getVisitReasonGroupObj();
        $scope.PendingVisitReasonGroupRows = [];
        clearVisitReasonGroupEntryFields();
    };

    // resets only the entry fields, leaves rows already staged in the list untouched
    function clearVisitReasonGroupEntryFields() {
        $scope.VisitReasonGroupSearchText = "";
        $scope.AllVisitReasonGroupChecklistCheck = false;
        angular.forEach($scope.VisitReasonChecklist, function (r) { r.IsChecked = false; });
        updateSelectedVisitReasonGroupText();
    }

    $scope.closeVisitReasonGroup = function () {
        $scope.clearVisitReasonGroup();
        $scope.addedVisitReasonGroup = false;
    };

    $scope.EditVisitReasonGroupClick = function (grp) {
        $scope.addedVisitReasonGroup = true;
        $scope.VisitReasonGroupObj = angular.copy(grp);
        $scope.PendingVisitReasonGroupRows = []; // edit works one row at a time
        $scope.VisitReasonGroupSearchText = "";
        angular.forEach($scope.VisitReasonChecklist, function (r) {
            r.IsChecked = grp.ParentAppointmentVisitReasonIds.indexOf(r.ParentAppointmentVisitReasonId) !== -1;
        });
        updateSelectedVisitReasonGroupText();
    };

    // returns "" when the entry is valid, otherwise the message to show
    function validateVisitReasonGroupEntry(obj) {
        if (!obj.ProviderTypeId) { return "Please select a Provider Type"; }
        if (obj.OrganizationId === null || obj.OrganizationId === undefined || obj.OrganizationId === "") { return "Please select a Location"; }
        if (!obj.ParentAppointmentVisitReasonIds || obj.ParentAppointmentVisitReasonIds.length === 0) { return "Please select at least one Visit Reason"; }
        if (obj.Minutes === null || obj.Minutes === "" || obj.Minutes === undefined) { return "Please select Standard Time"; }
        if (obj.Points === null || obj.Points === "" || obj.Points === undefined) { return "Please select Points"; }
        return "";
    }

    // Provider Type / Visit Type deliberately stay selected after "+" so the next row is quick to
    // enter - so they are NOT evidence of an in-progress entry. Only the three data fields count.
    function isVisitReasonGroupEntryEmpty(obj) {
        return (!obj.ParentAppointmentVisitReasonIds || obj.ParentAppointmentVisitReasonIds.length === 0)
            && (obj.Minutes === null || obj.Minutes === "" || obj.Minutes === undefined)
            && (obj.Points === null || obj.Points === "" || obj.Points === undefined);
    }

    // A visit reason may belong to only one active group per Provider Type and Location.
    // A group saved before locations existed (OrganizationId 0) counts for every location.
    // Checks `row` against the saved active groups (skipping the group being edited) and any
    // rows staged in the same save. Returns "" when clean, otherwise the message to show.
    function getVisitReasonGroupDuplicateMessage(row, stagedRows) {
        var taken = {};
        var names = {};
        var sameProvider = function (r) { return String(r.ProviderTypeId) === String(row.ProviderTypeId); };
        var sameProviderAndLocation = function (r) {
            var a = r.OrganizationId || 0, b = row.OrganizationId || 0;
            return sameProvider(r) && (a === 0 || b === 0 || String(a) === String(b));
        };

        angular.forEach($scope.AllVisitReasonGroups, function (grp) {
            if (grp.ActiveInd !== 'Y' || !sameProviderAndLocation(grp)) { return; }
            var editingId = row.EditingVisitReasonGroupId || row.VisitReasonGroupId;
            if (editingId && grp.VisitReasonGroupId === editingId) { return; }
            angular.forEach(grp.ParentAppointmentVisitReasonIds, function (id, i) {
                taken[id] = true;
                names[id] = (grp.VisitReasonNames || [])[i];
            });
        });
        angular.forEach(stagedRows || [], function (r) {
            if (!sameProviderAndLocation(r)) { return; }
            angular.forEach(r.ParentAppointmentVisitReasonIds, function (id) { taken[id] = true; });
        });
        angular.forEach($scope.VisitReasonChecklist, function (r) {
            names[r.ParentAppointmentVisitReasonId] = r.AppointmentVisitReason;
        });

        var duplicates = [];
        angular.forEach(row.ParentAppointmentVisitReasonIds, function (id) {
            if (taken[id]) { duplicates.push(names[id] || id); }
        });
        if (!duplicates.length) { return ""; }

        var providerType = $filter('filter')($scope.ProviderTypeList, function (p) { return sameProvider({ ProviderTypeId: p.Id }); })[0];
        return "Visit Reason already mapped for " + (providerType ? providerType.Name : "this Provider Type")
            + " (" + getVisitReasonGroupLocationName(row.OrganizationId) + "): " + duplicates.join(", ");
    }

    function buildVisitReasonGroupRow(obj) {
        var providerType = $filter('filter')($scope.ProviderTypeList, { Id: obj.ProviderTypeId }, true)[0];
        var names = [];
        angular.forEach($scope.VisitReasonChecklist, function (r) {
            if (obj.ParentAppointmentVisitReasonIds.indexOf(r.ParentAppointmentVisitReasonId) !== -1) {
                names.push(r.AppointmentVisitReason);
            }
        });
        return {
            "VisitReasonGroupId": obj.VisitReasonGroupId || 0,
            "ProviderTypeId": obj.ProviderTypeId,
            "ProviderTypeName": providerType ? providerType.Name : "",
            "OrganizationId": obj.OrganizationId || 0,
            "OrganizationName": getVisitReasonGroupLocationName(obj.OrganizationId),
            "ParentAppointmentVisitReasonIds": angular.copy(obj.ParentAppointmentVisitReasonIds),
            "VisitReasonNames": names,
            "Minutes": obj.Minutes,
            "Points": obj.Points,
            "ActiveInd": "Y",
            "DeleteInd": "N"
        };
    }

    // One row per location: a specific location gives one row; All Locations (ClinicId 0) expands
    // into a row for every actual location in BranchListArrayForGet - no "All Locations" id is saved.
    // On edit the existing VisitReasonGroupId stays on the row for the group's saved location
    // (or the first row, for a group saved before locations existed); the others are inserts.
    function buildVisitReasonGroupRows(obj) {
        if (obj.OrganizationId) {
            return [buildVisitReasonGroupRow(obj)];
        }

        var savedGroup = obj.VisitReasonGroupId
            ? $filter('filter')($scope.AllVisitReasonGroups, { VisitReasonGroupId: obj.VisitReasonGroupId }, true)[0]
            : null;
        var savedOrganizationId = savedGroup ? savedGroup.OrganizationId : 0;
        var locations = $filter('filter')($scope.BranchListArrayForGet, function (b) { return b.ClinicId !== 0; });
        var keepIdOn = $filter('filter')(locations, { ClinicId: savedOrganizationId }, true).length
            ? savedOrganizationId
            : (locations.length ? locations[0].ClinicId : 0);

        return locations.map(function (b) {
            var row = angular.copy(obj);
            row.OrganizationId = b.ClinicId;
            row.VisitReasonGroupId = (obj.VisitReasonGroupId && b.ClinicId === keepIdOn) ? obj.VisitReasonGroupId : 0;
            var built = buildVisitReasonGroupRow(row);
            // lets the duplicate check skip the group being edited for every expanded row
            built.EditingVisitReasonGroupId = obj.VisitReasonGroupId || 0;
            return built;
        });
    }

    // "+" - stage the current entry and clear the fields for the next one
    $scope.addVisitReasonGroupRow = function () {
        var message = validateVisitReasonGroupEntry($scope.VisitReasonGroupObj);
        var newRows = message ? [] : buildVisitReasonGroupRows($scope.VisitReasonGroupObj);
        if (!message && newRows.length === 0) { message = "Please select a Location"; }
        for (var i = 0; !message && i < newRows.length; i++) {
            message = getVisitReasonGroupDuplicateMessage(newRows[i], $scope.PendingVisitReasonGroupRows.concat(newRows.slice(0, i)));
        }
        if (message) {
            alertify.error(message);
            return;
        }
        Array.prototype.push.apply($scope.PendingVisitReasonGroupRows, newRows);

        // keep Provider Type / Location / Visit Type so consecutive rows are quick to enter
        $scope.VisitReasonGroupObj.ParentAppointmentVisitReasonIds = [];
        $scope.VisitReasonGroupObj.Minutes = "";
        $scope.VisitReasonGroupObj.Points = "";
        clearVisitReasonGroupEntryFields();
    };

    $scope.removeVisitReasonGroupRow = function (index) {
        $scope.PendingVisitReasonGroupRows.splice(index, 1);
    };

    $scope.saveVisitReasonGroup = function () {
        var obj = $scope.VisitReasonGroupObj;
        var isUpdate = obj.VisitReasonGroupId > 0;
        var rows = [];

        if (isUpdate) {
            var editMessage = validateVisitReasonGroupEntry(obj);
            if (editMessage) {
                alertify.error(editMessage);
                return;
            }
            rows = buildVisitReasonGroupRows(obj);
        } else {
            rows = angular.copy($scope.PendingVisitReasonGroupRows);
            // a filled-in entry that was never staged with "+" still gets saved
            if (!isVisitReasonGroupEntryEmpty(obj)) {
                var entryMessage = validateVisitReasonGroupEntry(obj);
                if (entryMessage) {
                    alertify.error(entryMessage);
                    return;
                }
                Array.prototype.push.apply(rows, buildVisitReasonGroupRows(obj));
            }
            if (rows.length === 0) {
                alertify.error("Please add at least one Visit Reason Group to the list");
                return;
            }
        }
        if (rows.length === 0) {
            alertify.error("Please select a Location");
            return;
        }

        // each row against saved groups and the rows before it (update excludes its own group id)
        for (var i = 0; i < rows.length; i++) {
            var duplicateMessage = getVisitReasonGroupDuplicateMessage(rows[i], rows.slice(0, i));
            if (duplicateMessage) {
                alertify.error(duplicateMessage);
                return;
            }
        }

        var params = {
            "UserId": $scope.UserId,
            "ParentOrganizationId": $scope.ParentHospitalId,
            "RVM": rows.map(function (r) {
                return {
                    "VisitReasonGroupId": r.VisitReasonGroupId || 0,
                    "ProviderTypeId": r.ProviderTypeId,
                    "OrganizationId": r.OrganizationId || 0,
                    "ParentAppointmentVisitReasonIds": r.ParentAppointmentVisitReasonIds,
                    "Minutes": r.Minutes,
                    "Points": r.Points,
                    "ActiveInd": r.ActiveInd || "Y",
                    "DeleteInd": r.DeleteInd || "N"
                };
            })
        };

        eHnotePatientVisitReasonServices.AddUpdateVisitReasonGroup(params).then(function (resp) {
            if (isVisitReasonGroupSuccess(resp.data)) {
                alertify.success(isUpdate
                    ? "Visit Reason Group updated successfully."
                    : params.RVM.length + (params.RVM.length === 1 ? " Visit Reason Group added successfully." : " Visit Reason Groups added successfully."));
                $scope.getVisitReasonGroups();
                $scope.addedVisitReasonGroup = false;
                $scope.clearVisitReasonGroup();
            } else {
                alertify.error(visitReasonGroupErrorMessage(resp.data));
            }
        });
    };

    // GetVisitReasonGroups returns "status", AddUpdateVisitReasonGroup returns "Status" - read either.
    function isVisitReasonGroupSuccess(data) {
        var status = data && (data.status || data.Status);
        return String(status).toLowerCase() === "success";
    }

    function visitReasonGroupErrorMessage(data) {
        return (data && (data.Message || data.message)) || "Could not save. Please try again.";
    }

    $scope.changeVisitReasonGroupActive = function (grp, activate) {
        // re-activating must not bring back a reason that another active group now owns
        var duplicateMessage = activate ? getVisitReasonGroupDuplicateMessage(grp) : "";
        if (duplicateMessage) {
            alertify.error(duplicateMessage);
            return;
        }
        var message = activate ? "Are you sure you want to Active?" : "Are you sure you want to In-Active?";
        alertify.confirm(
            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + message + "</h4>",
            function () {
                var params = {
                    "UserId": $scope.UserId,
                    "ParentOrganizationId": $scope.ParentHospitalId,
                    "RVM": [{
                        "VisitReasonGroupId": grp.VisitReasonGroupId,
                        "ProviderTypeId": grp.ProviderTypeId,
                        "OrganizationId": grp.OrganizationId || 0,
                        "ParentAppointmentVisitReasonIds": grp.ParentAppointmentVisitReasonIds,
                        "Minutes": grp.Minutes,
                        "Points": grp.Points,
                        "ActiveInd": activate ? "Y" : "N",
                        "DeleteInd": "N"
                    }]
                };

                eHnotePatientVisitReasonServices.AddUpdateVisitReasonGroup(params).then(function (resp) {
                    if (isVisitReasonGroupSuccess(resp.data)) {
                        $scope.getVisitReasonGroups();
                    } else {
                        alertify.error(visitReasonGroupErrorMessage(resp.data));
                    }
                });
            },
            function () { return; }
        );
    };

    function initVisitReasonGroupsPage() {
        $scope.addedVisitReasonGroup = false;
        $scope.VisitReasonGroupSearchObj = getVisitReasonGroupSearchObj();
        $scope.VisitReasonGroupObj = getVisitReasonGroupObj();
        $scope.getActiveVisitReasonsForGroups();
    }

}]);
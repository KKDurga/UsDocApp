"use strict";
eHnoteWebApp.controller('UsCRMReasonTypeCtrl', ['$scope', '$filter', 'eHnoteMasterDataService', 'eHnotePatientVisitReasonServices', '$timeout', 'alertify',"$q",
    function ($scope, $filter, eHnoteMasterDataService, eHnotePatientVisitReasonServices, $timeout, alertify, $q) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    

        $scope.ParentHospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }


        $scope.Searchobj = {
            "txt1": "",         
        };
        function getReasonReqObj() {
            let obj = {
                "CrmReasonTypeId": null,
                "ReasonTypeId": null,
                "ReasonTypeName": "",
                "DurationFrom": null,
                "DurationTo": null,
                "AgeFrom": null,
                "AgeTo": null,
                "VisitReasonobj": "",
                "TransferToCall": false,
                "VisitReasonName": null,
                "VisitReasonId": null,
                "VisitTypeId": null,
                "DeleteInd": "N",
                "DurationTypeFrom": "Y",
                "DurationTypeTo": "Y",
                "AgeDurationTypeFrom": "Y",
                "AgeDurationType": "Y",
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "SelectStatusString": "Select",
                "VisitReasonList": [],



            }
            return obj;
        }
        $scope.ReasonObj = getReasonReqObj();

        $scope.GetCrmReasonType = function (val) {
            val = val || '';
            let obj = {
                "SearchText": val,
                "PageSize": 100,
                "PageNo": 1,
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,

            }
            eHnotePatientVisitReasonServices.GetOrganizationCrmReasonTypes(obj).then(function (resp) {
                $scope.AllCrmReasonTypes = [];
                if (resp.data.rows.length > 0) {
                    $scope.AllCrmReasonTypes = resp.data.rows || [];
                }
                console.log(resp);
            });
        }
       
        $scope.init = function () {
            $scope.AllVisitreasons = [];
            $scope.AllCrmReasonTypes = [];
            $scope.AllReasonTypes = [];
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "VisitTypeId": 0,
                "visitReasonSearch": "",
                "PageNumber": 1,
                "PageSize": 1000,
                "IsFrequent": "N"
            };
            $q.all([
                eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(obj),
                eHnotePatientVisitReasonServices.GetParentOrgReasonTypes($scope.ParentHospitalId),
            ]).then(function (resp) {
               let  tempAllVisitreasons = [];
                if (resp[0].data.rows.length !== 0) {
                   tempAllVisitreasons = resp[0].data.rows||[];
                    if (tempAllVisitreasons.length > 0) {
                        angular.forEach(tempAllVisitreasons, function (item) {
                            item.IsChecked = false;
                            item.CrmVisitReasonId = 0;
                        });
                        if (tempAllVisitreasons.length > 0) {
                            $scope.AllVisitreasons = $filter("filter")(tempAllVisitreasons, function (item) {
                                return item.ActiveInd === 'Y';
                            });
                        }
                        //$scope.AllVisitreasons = tempAllVisitreasons || [];

                    
                    }
                }
                if (resp[1].data.rows.length !== 0) {
                    $scope.AllReasonTypes = resp[1].data.rows;
                }


            });
            $scope.GetCrmReasonType();
        }
        $scope.init();


        $scope.Changereason = function (item) {
            $scope.ReasonObj.VisitReasonobj = item;
            $scope.ReasonObj.VisitTypeId = item.VisitTypeId;
            $scope.ReasonObj.VisitReasonId = item.ReasonId;
            $scope.ReasonObj.VisitReasonName = item.Reason;
            $scope.Searchobj = {
                "txt1": "",
            };
        }


        $scope.ReasonStatusToggle = function (obj) {
            var checkedArray = _.where($scope.AllVisitreasons, { IsChecked: true });
            $scope.AllVisitreasons.length === checkedArray.length ? true : false;
        

            if (checkedArray.length > 0) {
                $scope.ReasonObj.SelectStatusString = 'Selected';
            } else {
                $scope.ReasonObj.SelectStatusString = 'Select';
            }
        };

        $scope.ChangeDuration = function (type) {
            if (type =='To'&&$scope.ReasonObj.DurationTypeTo == "M" && $scope.ReasonObj.DurationTypeFrom == "Y") {
                $scope.ReasonObj.DurationTypeFrom= "M";
            }
        }

        $scope.SaveReasonType = function () {
            if ($scope.ReasonObj.ReasonTypeName =="") {
                alertify.error("Enter Reason Type");
                return false;
            }
           
            
            let VisitReasonList = [];

            angular.forEach($scope.AllVisitreasons, function (item) {
                if (item.IsChecked == true || (item.IsChecked == false && item.CrmVisitReasonId != 0)) {

                    let DeleteInd = 'N';

                    if (item.IsChecked == false && item.CrmVisitReasonId != 0) {
                        DeleteInd = 'Y';
                    }
                    let obj = {
                        "CrmVisitReasonId": item.CrmVisitReasonId||0,
                        "VisitReasonId": item.ReasonId,
                        "VisitReasonName": item.Reason,
                        "DeleteInd": DeleteInd||"N",
                    }
                    VisitReasonList.push(obj);
                }

            });

            let MonthsFrom = 0;
            let MonthsTo = 0;
            if ($scope.ReasonObj.DurationTypeFrom == "Y") {
                let DurationFrom = parseInt($scope.ReasonObj.DurationFrom) || 0;
                if (DurationFrom != 0) {
                    MonthsFrom = DurationFrom * 12;
                }
            } else {
                 MonthsFrom = parseInt($scope.ReasonObj.DurationFrom) || 0;
            }

            if ($scope.ReasonObj.DurationTypeTo == "Y") {
                let DurationTo = parseInt($scope.ReasonObj.DurationTo)||0;
                if (DurationTo!=0) {
                    MonthsTo = DurationTo * 12;
                }
            } else {
                 MonthsTo = parseInt($scope.ReasonObj.DurationTo) || 0;
            }
            
           
            //if ($scope.ReasonObj.VisitReasonId == "") {
            //    alertify.error("Select Visit Reason");
            //    return false;
            //}

            $scope.ReasonObj.DurationFrom = $scope.ReasonObj.DurationFrom || null;

            if ($scope.ReasonObj.DurationFrom != null && $scope.ReasonObj.DurationTo == null) {
                alertify.error("Please enter the 'From' and 'To' durations!");
                return false;
            } 
            $scope.ReasonObj.DurationTo = $scope.ReasonObj.DurationTo || null;
            if ($scope.ReasonObj.DurationTo != null && $scope.ReasonObj.DurationFrom== null) {
                alertify.error("Please enter the 'From' and 'To' durations!");
                return false;
            }
            $scope.ReasonObj.AgeTo = $scope.ReasonObj.AgeTo || null;
            $scope.ReasonObj.AgeFrom = $scope.ReasonObj.AgeFrom || null;
            if (!$scope.ReasonObj.TransferToCall) {
                if ($scope.ReasonObj.AgeFrom == null || $scope.ReasonObj.AgeTo == null) {
                    alertify.error("Please enter the 'From' and 'To' ages!");
                    return false;
                }
            }
            if ($scope.ReasonObj.ReasonTypeId != 3 && $scope.ReasonObj.ReasonTypeId != 4) {
                let checkedArray = _.where($scope.AllVisitreasons, { IsChecked: true });
                if (checkedArray.length == 0) {
                    alertify.error("Select Visit Reason");
                    return false;
                }
            }
                  
            let obj = {
                "CrmReasonTypeId": $scope.ReasonObj.CrmReasonTypeId,
                "ReasonTypeId": $scope.ReasonObj.ReasonTypeId,
                "ReasonTypeName": $scope.ReasonObj.ReasonTypeName,
                "DurationFrom": $scope.ReasonObj.DurationFrom,
                "DurationTo": $scope.ReasonObj.DurationTo,
                "AgeFrom": $scope.ReasonObj.AgeFrom,
                "AgeTo": $scope.ReasonObj.AgeTo,                
                "TransferToCall": $scope.ReasonObj.TransferToCall||false,
                "VisitReasonName": $scope.ReasonObj.VisitReasonName,
                "VisitReasonId": $scope.ReasonObj.VisitReasonId,
                "VisitTypeId": $scope.ReasonObj.VisitTypeId,
                "DurationTypeFrom": $scope.ReasonObj.DurationTypeFrom||"Y",
                "DurationTypeTo": $scope.ReasonObj.DurationTypeTo||"Y",
                "AgeDurationType": $scope.ReasonObj.AgeDurationType||"Y",
                "DeleteInd": $scope.ReasonObj.DeleteInd||'N',
                "UserId": $scope.ReasonObj.UserId,
                "OrganizationId": $scope.ReasonObj.OrganizationId,
                "VisitReasonList": VisitReasonList,
                "MonthsTo": MonthsTo,
                "MonthsFrom": MonthsFrom,

            }
            eHnotePatientVisitReasonServices.AddUpdateCRMReasonTypes(obj).then(function (resp) {
                if (resp.data.Status == "Success") {
                    alertify.success("Saved Successfully");
                    
                    $scope.ReasonObj = getReasonReqObj();
                    angular.forEach($scope.AllVisitreasons, function (item) {
                        item.IsChecked = false;
                        item.CrmVisitReasonId = 0;
                    });
                    $scope.GetCrmReasonType();
                }
                else {
                    angular.forEach($scope.AllVisitreasons, function (item) {
                        item.IsChecked = false;
                        item.CrmVisitReasonId = 0;
                    });
                    if (resp.data.ErrorMsg == "Error Occured In The Procedure : ReasonType Already Exists") {
                        alertify.error("ReasonType Already Exists");
                        return false;
                    } else {                    
                        alertify.error("Failed");
                        return false;
                    }
              
                }
            });
        }


        $scope.EditReasonType = function (item) {
            $scope.CRMReasonTypeFocus = true;
            $scope.addedVisitReasonType = true;
            $scope.ReasonObj = getReasonReqObj();
            $scope.AllVisitreasons = $scope.AllVisitreasons || [];
            angular.forEach($scope.AllVisitreasons, function (item) {
                item.IsChecked = false;
                item.CrmVisitReasonId = 0;
            });
            $scope.ReasonObj.CrmReasonTypeId = item.CrmReasonTypeId||null;
            $scope.ReasonObj.ReasonTypeId = item.ReasonTypeId;
            $scope.ReasonObj.ReasonTypeName = item.ReasonTypeName;
            $scope.ReasonObj.DurationFrom = item.DurationFrom;
            $scope.ReasonObj.DurationTo = item.DurationTo;
            $scope.ReasonObj.AgeFrom = item.AgeFrom;
            $scope.ReasonObj.AgeTo = item.AgeTo;
            $scope.ReasonObj.TransferToCall = item.TransferToCall;
            $scope.ReasonObj.VisitReasonName = item.VisitReasonName;
            $scope.ReasonObj.VisitReasonId = item.VisitReasonId;
            $scope.ReasonObj.VisitTypeId = item.VisitTypeId;
            $scope.ReasonObj.DurationTypeFrom = item.DurationTypeFrom;
            $scope.ReasonObj.DurationTypeTo = item.DurationTypeTo;
            $scope.ReasonObj.AgeDurationType = item.AgeDurationType;
            $scope.ReasonObj.DeleteInd = item.DeleteInd;

            if (item.VisitReasonList.length > 0) {
                angular.forEach($scope.AllVisitreasons, function (Aitem) {
                    angular.forEach(item.VisitReasonList, function (Bitem) {
                        Aitem.IsChecked = Aitem.IsChecked || false;
                        Aitem.CrmVisitReasonId = Aitem.CrmVisitReasonId || 0;
                        if (Aitem.ReasonId == Bitem.VisitReasonId) {
                            Aitem.CrmVisitReasonId = Bitem.CrmVisitReasonId;
                            Aitem.IsChecked =true;
                        }
                    });                

                });           
            }

            if ($scope.AllVisitreasons.length > 0) {
                $scope.ReasonObj.VisitReasonobj = $filter("filter")($scope.AllVisitreasons, { "ReasonId": item.VisitReasonId }, true)[0];
            }


        };
        $scope.ClearReasonType = function () {
            $scope.ReasonObj = getReasonReqObj();
        }
        $scope.DeleteReasonType = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete? </h4>", function () {
                $scope.ReasonObj = getReasonReqObj();
                $scope.ReasonObj.CrmReasonTypeId = item.CrmReasonTypeId||null;
                $scope.ReasonObj.ReasonTypeId = item.ReasonTypeId;
                $scope.ReasonObj.ReasonTypeName = item.ReasonTypeName;
                $scope.ReasonObj.DurationFrom = item.DurationFrom;
                $scope.ReasonObj.DurationTo = item.DurationTo;
                $scope.ReasonObj.AgeFrom = item.AgeFrom;
                $scope.ReasonObj.AgeTo = item.AgeTo;
                $scope.ReasonObj.TransferToCall = item.TransferToCall;
                $scope.ReasonObj.VisitReasonName = item.VisitReasonName;
                $scope.ReasonObj.VisitReasonId = item.VisitReasonId;
                $scope.ReasonObj.VisitTypeId = item.VisitTypeId;
                $scope.ReasonObj.DurationTypeFrom = item.DurationTypeFrom;
                $scope.ReasonObj.DurationTypeTo = item.DurationTypeTo;
                $scope.ReasonObj.AgeDurationType = item.AgeDurationType;
                $scope.ReasonObj.DeleteInd = item.DeleteInd;

                let obj = {
                    "CrmReasonTypeId": $scope.ReasonObj.CrmReasonTypeId,
                    "ReasonTypeId": $scope.ReasonObj.ReasonTypeId,
                    "ReasonTypeName": $scope.ReasonObj.ReasonTypeName,
                    "DurationFrom": $scope.ReasonObj.DurationFrom,
                    "DurationTo": $scope.ReasonObj.DurationTo,
                    "AgeFrom": $scope.ReasonObj.AgeFrom,
                    "AgeTo": $scope.ReasonObj.AgeTo,
                    "TransferToCall": $scope.ReasonObj.TransferToCall || false,
                    "VisitReasonName": $scope.ReasonObj.VisitReasonName,
                    "VisitReasonId": $scope.ReasonObj.VisitReasonId,
                    "VisitTypeId": $scope.ReasonObj.VisitTypeId,
                    "DurationTypeFrom": $scope.ReasonObj.DurationTypeFrom || "Y",
                    "DurationTypeTo": $scope.ReasonObj.DurationTypeTo || "Y",
                    "AgeDurationType": $scope.ReasonObj.AgeDurationType || "Y",
                    "DeleteInd": 'Y',
                    "UserId": $scope.ReasonObj.UserId,
                    "OrganizationId": $scope.ReasonObj.OrganizationId,

                }
                eHnotePatientVisitReasonServices.AddUpdateCRMReasonTypes(obj).then(function (resp) {
                    if (resp.data.Status == "Success") {
                        alertify.success("Deleted Successfully");
                        angular.forEach($scope.AllVisitreasons, function (item) {
                            item.IsChecked = false;
                            item.CrmVisitReasonId = 0;
                        });
                        $scope.GetCrmReasonType();
                        $scope.ReasonObj = getReasonReqObj();
                    }
                    else {
                        alertify.error("Failed");
                        return false;
                    }
                });


            }, function () {
                return;
            });
          
            
        }

        //$scope.onselectResontype = function (selectedReason) {
        //    $scope.ReasonObj.ReasonTypeName = selectedReason.ReasonTypeName||"";
        //    $scope.ReasonObj.ReasonTypeId = selectedReason.ReasonTypeId || null;
        //};
        $scope.validSelection = false;

        $scope.onselectResontype = function (selectedReason) {
            if (selectedReason) {
                $scope.ReasonObj.ReasonTypeName = selectedReason.ReasonTypeName || "";
                $scope.ReasonObj.ReasonTypeId = selectedReason.ReasonTypeId || null;
                $scope.validSelection = true;
            } else {
                $scope.validSelection = false;
            }
        };

        $scope.changefocusOption = function (item) {
            if (!$scope.validSelection) {
                // Reset ReasonTypeName if no valid selection was made
                $scope.ReasonObj.ReasonTypeName = item||"";
            }
        };
        $scope.ChangeTransfertocall = function (item) {
            if ($scope.ReasonObj.TransferToCall) {
                $scope.ReasonObj.AgeTo = null;
                $scope.ReasonObj.AgeFrom = null;
                $scope.ReasonObj.DurationFrom = null;
                $scope.ReasonObj.DurationTo = null;
                $scope.ReasonObj.VisitReasonobj = '';
                $scope.ReasonObj.VisitTypeId = null;
                $scope.ReasonObj.VisitReasonId = null;
                $scope.ReasonObj.VisitReasonName = null;

                if ($scope.AllVisitreasons.length>0) {
                    angular.forEach($scope.AllVisitreasons, function (item) {
                        item.IsChecked = false;

                    });
                }
            }
        }

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }


        $scope.addedVisitReasonType = false;
        $scope.addVisitReasonType = function () {
            $scope.addedVisitReasonType = true;
        };
        $scope.closeVisitReasonType = function () {
            $scope.ReasonObj = getReasonReqObj();
            $scope.addedVisitReasonType = false;
        };
        $scope.LostSettingsFocus = function () {
            $scope.CRMReasonTypeFocus = false;
        };
}]);
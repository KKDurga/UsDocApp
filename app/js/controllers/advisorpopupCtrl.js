"use strict";
eHnoteWebApp.controller("advisorpopupCtrl", ["$scope", "$uibModalInstance", "$filter", "alertify", "FinalObj", "eHnoteMasterDataService", "eHnoteSettingsDataService", "eHnoteMainAppointmentService", "AdvisedOrderDetailsArray", "cacheStorageItem", "eHnoteReferalDataService", "eHnoteDiagnosisDataServices", "eHnoteDbStaticDataService", "Modalities", "eHnoteMainAdminServices", "eHnoteUserDataService", "$uibModal","allUserListForPopUps",
    function ($scope, $uibModalInstance, $filter, alertify, FinalObj, eHnoteMasterDataService, eHnoteSettingsDataService, eHnoteMainAppointmentService, AdvisedOrderDetailsArray, cacheStorageItem, eHnoteReferalDataService, eHnoteDiagnosisDataServices, eHnoteDbStaticDataService, Modalities, eHnoteMainAdminServices, eHnoteUserDataService, $uibModal, allUserListForPopUps) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        //$scope.HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.AdvisedOrderDetailsArray = AdvisedOrderDetailsArray;
        $scope.cacheStorageItem = cacheStorageItem;
        $scope.Modalities = Modalities || [];
        $scope.allUserList = [];
        $scope.MultiselectDoctorlist = [];
        $scope.AllInternalCoordinatorList = [];
        $scope.allSubSpecializationsArray = [];
        if ($scope.cacheStorageItem.allSubSpecializationsArray.length > 0) {
            $scope.allSubSpecializationsArray = $scope.cacheStorageItem.allSubSpecializationsArray || [];
            $scope.listSubSplArray = angular.copy($scope.cacheStorageItem.allSubSpecializationsArray)||[];
        }
        $scope.allUserListForPopUps = allUserListForPopUps||[]
        if ($scope.allUserListForPopUps.length > 0) {
        
           
                $scope.allUserList = $scope.allUserListForPopUps||[];
                $scope.AllInternalCoordinatorList = angular.copy($scope.allUserList);
                $scope.AllInternalCoordinatorList = _.uniq($scope.AllInternalCoordinatorList, false, function (p) { return p.DoctorID; });
                $scope.AllInternalCoordinatorList = $filter("filter")($scope.AllInternalCoordinatorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });

                $scope.AllCoordinatorList = angular.copy($scope.allUserList);
                $scope.AllCoordinatorList = _.uniq($scope.AllCoordinatorList, false, function (p) { return p.DoctorID; });
                $scope.AllCoordinatorList = $filter("filter")($scope.AllCoordinatorList, function (item) {
                    return item.RoleId === 18; //item.RoleId === 1 || item.RoleId === 43;
                });

                angular.forEach($scope.allUserList, function (kitem) {
                    kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.FullName;
                    $scope.MultiselectDoctorlist.push(kitem);
                });
         
        }
        $scope.adviseObj = {
            'SearchProcedureObj': "",
            'DiagnosisObject': "",
            'SearchReferalObj': ""
        };

        $scope.ResultObj = {
            "DurationDate": "",
            "DoctorsName": "",
            "LocationName": "",
            "InvestigationName": "",
            "LocationId": null,
            "Notes": "",
            "ResultId": 0,
        }

        $scope.Referralobj = {
            "Type": "Internal",
            "PatientReferralDetailId": 0,
            "SpecializationId": "",
            "SpecializationName": "",
            "SubSpecializationObj": "",
            "IsnewProvider": false,
            "referralDoctorObj": "",
            "referralDoctorId": "",
            "referralDoctorName": "",
            "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
            "DurationDate": "",
            "Duration": "",
            "DurationType": "",
            "ReferralReason": "",
            "Remarks": "",
            "DiagnosisObject": "",
            "IsUrgency": false,
            "IsFollowUpAfterReferral": false,
            "IsAddResult": false,
            "IsIncludeInCaseHistory": false,
            "DiagnosisList": [],
            "ReferralImageArray": [],
        };
        
        $scope.GetPCPObj = function () {
            return {
                "PcpReferalId": 0,
                "FirstName": "",
                'LastName': '',
                'SuffixId': '',
                'Title': 'Mr',
                'Age': '',
                "MobileNo": null,
                "AlternateMobileNo": null,
                "Gender": "",
                "EmailId": "",
                'Address1': '',
                'Address2': '',
                'LocationId': null,
                "StateId": null,
                'CityId': null,
                'PinCode': '',
                'NPI': '',
                'SSN': '',
                'EmployeeId': '',
                'ZipCodePlusNo': '',
                "SpecializationId": null,
                "SubSpecializationId": null,
                "DeleteInd": false,
                "countrycode": "",
                "OrganizationId": $scope.HospitalID,
                "UserId": $scope.UserId,
                "ZipCode": '',
                "LocationName": "",
                "PcpOrganizationName": "",
                "CityName": "",
                "StateName": "",
                "ContactNo": null,
                "Slicence": "",
                "TaxonomyId": "",
                "Contactcountrycode": "",
                "SpecializationObj":"",
                "SubSpecializationObj": ""
            };
        };
        $scope.PCPObj = angular.copy($scope.GetPCPObj());

        $scope.GetOrganizationCPTProcedure = function (val) {
            var obj = {
                "OrganizationId": $scope.HospitalID,
                "ProcedureId": 0,
                "CPTCODE": "",
                "SearchText": val || "",
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "GetAllIndicator": 0,
                "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "IsFrequent": "N",
                "Status": 0
            };
            if (val == "") {
                obj.IsFrequent="Y"
            }
            return eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.rows.length !== 0) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });

                    }
                }
            });
        };

        $scope.onSelectAssesmentPlannewDiagnosis = function (mainobject, Diagnosisitem) {

            if (Diagnosisitem.DiagnosisList.length > 0) {
                var filterdiagnosis = $filter("filter")(Diagnosisitem.DiagnosisList, function (Aitem, index) { return Aitem.DiagnosisId == mainobject.DiagnosisId },);
                if (filterdiagnosis.length > 0) {
                    mainobject = "";
                    $scope.adviseObj.DiagnosisObject = "";
                    alertify.error("Diagnosis Already Added");
                    return false;
                }
            }

            

            var obj = {
                "ActiveInd": "Y",
                "DiagnosisDetailId": mainobject.DiagnosisId || 0,
                "DiagnosisId": mainobject.DiagnosisId,
                "DiagnosisName": mainobject.DiagnosisName,
                "ICDCode": mainobject.ICD10CODE,
                "Diagnosis": true
            }

            Diagnosisitem.DiagnosisList.push(obj);
            $scope.adviseObj.DiagnosisObject = "";
        };

        $scope.OnClickAdvisedProcedure = function (mainitem) {

            if ($scope.AdvisedOrderDetailsArray.length > 0) {
                var filterProcedure = $filter("filter")($scope.AdvisedOrderDetailsArray, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId && Aitem.DeleteInd == 'N'},);
                if (filterProcedure.length > 0) {
                    $scope.adviseObj.SearchProcedureObj = "";
                    alertify.error("Procedure Already Added");
                    return false;
                }
            }

            if ($scope.AdvisedOrderDetailsArray.length !== 0) {
                angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                    item.IsEditData = false;
                });
            }
            if (mainitem.OrderType == 'Investigation') {
                mainitem.OrderType = 'Investigations';
            }
            if (mainitem.ProcedureName !== "Referral") {
                var object = {
                    "PatientOrderId": 0,
                    "SpecializationId": 0,
                    "OrderTypeId": mainitem.OrderTypeId,
                    "DescriptionId": mainitem.ProcedureId || "",
                    "Description": mainitem.ProcedureName || "",
                    "ProcedureCode": mainitem.ProcedureCode || 0,
                    "OrgDescriptionId": mainitem.OrganizationProcedureId || 0,
                    "Remarks": "",
                    "OrganId": 1,
                    "OrganName": "OD",
                    "BillingCode": "",
                    "BookingStatusId": "2",
                    "CPTCode": mainitem.CPTCode,
                    "StatusId": "1",
                    "DeleteInd": "N",
                    "InvSpecialityId": "",
                    "PatientSurgeryId": 0,
                    "SurgeryListId": 0,
                    "IsEditData": true,
                    "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                    "DurationType": mainitem.DurationType || "D",
                    "CoordinatorId": mainitem.CoordinatorId || 0,
                    "ExternalCoManagerId": mainitem.ExternalCoManagerId || 0,
                    "InternalCoManagerId": mainitem.InternalCoManagerId || 0,
                    "ShowDateFormat": true,
                    "Duration": '',
                    "DurationType": '',
                    "DurationDate": '',
                    "DiagnosisList": [],
                    "OrderType": mainitem.OrderType,
                    "ModalityId": 1,
                    "AdvicedInvestigationId": 0,
                    "PatientInvestigationId": 0,
                    "PatientProcedureId": 0,
                    "StatusId": 1,
                    "Subtab":"1",
                    "Status":"Active"
                }
                $scope.Referralobj.FinalObj = object.OrderType;
                $scope.Referralobj.OrderTypeId = object.OrderTypeId;
                $scope.AdvisedOrderDetailsArray.push(object);
            }

            $scope.adviseObj.SearchProcedureObj = "";
            $scope.adviseObj.DiagnosisObject = "";
            //if (mainitem.ProcedureName == "Referral") {
            //    var obj = {
            //        "PatientOrderId": 0,
            //        //"OrderReferralDetailId": 0,
            //        "PatientReferralDetailId":0,
            //        "SpecializationId": 0,
            //        "Remarks": "",
            //        "DeleteInd": "N",
            //        "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
            //        "ReferralDoctorName": "",
            //        "ReferralDoctorId": 0,
            //        "SpecializationName": "",
            //        "Alarm": "",
            //        "ShowDateFormat": true,
            //        "IsUrgency": false,
            //        "IsFollowUpAfterReferral": false,
            //        "IsIncludeInCaseHistory": false,
            //        "DurationDate": "",
            //        "Duration": "",
            //        "ReferralReason": "",
            //        "DurationType": "",
            //        "DiagnosisList": [],
            //        "IsEditData": true,
            //        "FinalObj": "Referral",
            //        "OrderType": mainitem.OrderType,
            //        "OrderTypeId": mainitem.OrderTypeId,
            //        "Description": mainitem.ProcedureName || "",
            //    }
            //    $scope.AdvisedOrderDetailsArray.push(obj);
            //    $scope.Referralobj.FinalObj = obj.OrderType;
            //    $scope.Referralobj.OrderTypeId = object.OrderTypeId;
            //}
            $scope.ContentButtonShowInvestigation = false;
            $scope.ContentButtonShowActiveProcedure = false;
            $scope.ContentButtonShowActiveSurgery = false;
            $scope.ContentButtonShowActiveReferral = false;
            
            if (mainitem.OrderTypeId == 1) {
                $scope.ContentButtonShowInvestigation = true;
            } else if (mainitem.OrderTypeId == 2) {
                $scope.ContentButtonShowActiveProcedure = true;
            }
            else if (mainitem.OrderTypeId == 3) {
                $scope.ContentButtonShowActiveSurgery = true;
            }
        };

        $scope.GetOrganName = function () {
            return [{
                "OrganId": 1,
                "OrganName": "OD"
            },
            {
                "OrganId": 2,
                "OrganName": "OS"
            },
            {
                "OrganId": 3,
                "OrganName": "OU"
            },
                {
                    "OrganId": 4,
                    "OrganName": "General"
                }
            ];
        };

        $scope.GetOrganNameList = angular.copy($scope.GetOrganName());

        $scope.ContentButtonShowActiveReferral = false;
        $scope.ContentButtonShowActiveProcedure = false;
        $scope.ContentButtonShowActiveSurgery = false;
        $scope.ContentButtonShowInvestigation = false;

        $scope.Referralobj.FinalObj = FinalObj;

        if ($scope.AdvisedOrderDetailsArray.length > 0) {

            angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                item.IsEditData = false;
            });
            
            if ($scope.Referralobj.FinalObj == 'Investigations') {
                var SubOrdersArray = $filter("filter")($scope.AdvisedOrderDetailsArray, function (iterator, ind) { return iterator.DeleteInd === 'N' && iterator.OrderTypeId == 1; });
                if (SubOrdersArray.length > 0) {
                    SubOrdersArray[0].IsEditData = true;
                    $scope.ContentButtonShowInvestigation = true;
                }
                
            } else if ($scope.Referralobj.FinalObj == 'Procedure') {
                var SubOrdersArray1 = $filter("filter")($scope.AdvisedOrderDetailsArray, function (iterator, ind) { return iterator.DeleteInd === 'N' && iterator.OrderTypeId == 2; });
                if (SubOrdersArray1.length > 0) {
                    SubOrdersArray1[0].IsEditData = true;
                    $scope.ContentButtonShowActiveProcedure = true;
                }
                
            } else if ($scope.Referralobj.FinalObj == 'Surgery') {
                var SubOrdersArray2 = $filter("filter")($scope.AdvisedOrderDetailsArray, function (iterator, ind) { return iterator.DeleteInd === 'N' && iterator.OrderTypeId == 3; });
                if (SubOrdersArray2.length > 0) {
                    SubOrdersArray2[0].IsEditData = true;
                    $scope.ContentButtonShowActiveSurgery = true;
                }
                
            } else if ($scope.Referralobj.FinalObj == 'Referral') {
                var SubOrdersArray3 = $filter("filter")($scope.AdvisedOrderDetailsArray, function (iterator, ind) { return iterator.DeleteInd === 'N' && iterator.OrderTypeId == 4; });
                if (SubOrdersArray3.length > 0) {
                    SubOrdersArray3[0].IsEditData = true;
                    $scope.ContentButtonShowActiveReferral = true;
                }
            }

            if ($scope.ContentButtonShowInvestigation == false && $scope.ContentButtonShowActiveProcedure == false && $scope.ContentButtonShowActiveSurgery == false && $scope.ContentButtonShowActiveReferral == false) {
                var SubOrdersArray4 = $filter("filter")($scope.AdvisedOrderDetailsArray, function (iterator) { return iterator.DeleteInd === 'N' });
                if (SubOrdersArray4.length > 0) {
                    SubOrdersArray4[0].IsEditData = true;
                    if (SubOrdersArray4[0].OrderTypeId == 1) {
                        $scope.ContentButtonShowInvestigation = true;
                    } else if (SubOrdersArray4[0].OrderTypeId == 2) {
                        $scope.ContentButtonShowActiveProcedure = true;
                    }
                    else if (SubOrdersArray4[0].OrderTypeId == 3) {
                        $scope.ContentButtonShowActiveSurgery = true;
                    }
                    else if (SubOrdersArray4[0].OrderTypeId == 4) {
                        $scope.ContentButtonShowActiveReferral = true;
                    }
                }
            }
        }

        if ($scope.AdvisedOrderDetailsArray.length > 0) {
            angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                $scope.cacheStorageItem.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];
                if ($scope.cacheStorageItem.AssessmentPlan.length > 0) {
                    angular.forEach($scope.cacheStorageItem.AssessmentPlan, function (Aitem) {
                        var i = 0;
                        var List = 0;
                        if (Aitem.StatusList.length > 0) {
                            List = $filter("filter")(Aitem.StatusList, function (FAitem) { return FAitem.DiagnosisStatusId == 2 },);
                            if (List.length > 0) {
                                i++;
                            }
                        }
                        if (i > 0) {
                            var obj = {
                                "ActiveInd": "Y",
                                "DiagnosisDetailId": 0,
                                "DiagnosisId": Aitem.DiagnosisId,
                                "DiagnosisName": Aitem.ICD10DIAGNAME,
                                "ICDCode": Aitem.ICD10CODE,
                                "Diagnosis": false
                            }
                            item.DiagnosisList = item.DiagnosisList || [];
                            var List1 = 0;
                            List1 = $filter("filter")(item.DiagnosisList, function (Ditem) { return Ditem.DiagnosisId == Aitem.DiagnosisId },);
                            if (List1.length == 0) {
                                item.DiagnosisList.push(obj);
                            }
                        }
                    });
                }
            });
        }
        
        $scope.GetProcedureStatus = function () {
            return [{
                "StatusId": 1,
                "Status": "Active"
            },
                {
                    "StatusId": 2,
                    "Status": "InActive"
                },
                {
                    "StatusId": 3,
                    "Status": "Completed"
                }
            ];
        };
        
        $scope.GetProcedureStatusList = angular.copy($scope.GetProcedureStatus());

        $scope.ChangeAdvisedOrder = function (mainitem) {
            angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                item.IsEditData = false;
            });

            if (mainitem.ReferralId == 14) {
                $scope.Referralobj.referralDoctorObj = mainitem.ReferralDoctorName;
            }

           
            mainitem.IsEditData = true;
            $scope.Referralobj.FinalObj = mainitem.OrderType;

            $scope.Referralobj.IsAddResult = false;
        }

        //$scope.Getdoclist = function () {
        //    eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.SubOrganizationId, $scope.HospitalID).then(function (resp) {
        //        if (resp.data.status === "Success") {
        //            if (resp.data.row.length > 0) {
        //                $scope.allSubSpecializationsArray = resp.data.row;
        //                $scope.listSubSplArray = angular.copy(resp.data.row);
        //                angular.forEach($scope.allSubSpecializationsArray, function (item) {
        //                    item.isChecked = true;
        //                });
        //            }
        //            var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        //            var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");
        //            var reqObj = {
        //                "BranchId": $scope.HospitalID,
        //                "SubSpecializationIdArray": subSplArray
        //            }

        //            eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        //            function onGetUsersSuccess(resp) {
        //                $scope.allUserList = [];
        //                $scope.MultiselectDoctorlist = [];
        //                $scope.AllInternalCoordinatorList = [];
        //                if (resp.rows.length > 0) {
        //                    $scope.allUserList = resp.rows;
        //                    $scope.AllInternalCoordinatorList = angular.copy($scope.allUserList);
        //                    $scope.AllInternalCoordinatorList = _.uniq($scope.AllInternalCoordinatorList, false, function (p) { return p.DoctorID; });
        //                    $scope.AllInternalCoordinatorList = $filter("filter")($scope.AllInternalCoordinatorList, function (item) {
        //                        return item.RoleId === 1 || item.RoleId === 43;
        //                    });

        //                    $scope.AllCoordinatorList = angular.copy($scope.allUserList);
        //                    $scope.AllCoordinatorList = _.uniq($scope.AllCoordinatorList, false, function (p) { return p.DoctorID; });
        //                    $scope.AllCoordinatorList = $filter("filter")($scope.AllCoordinatorList, function (item) {
        //                        return item.RoleId === 18; //item.RoleId === 1 || item.RoleId === 43;
        //                    });

        //                    angular.forEach($scope.allUserList, function (kitem) {
        //                        kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.FullName;
        //                        $scope.MultiselectDoctorlist.push(kitem);
        //                    });
        //                }
        //            }
        //            function onGetUsersFailure(data) {
        //            }
        //        }
        //    });
        //}

        //$scope.Getdoclist();

        $scope.closeuib = function () {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.ChangeItem = function (item) {
            if (item.ShowDateFormat) {
                item.DurationDate = null;
            } else {
                item.Duration = "";
                item.DurationType = "";
            }
            item.ShowDateFormat = !item.ShowDateFormat;
        };

        $scope.GetDiagnosisList = function (val) {
            val = val || "";
            var object = {
                "LevelType": 'O',
                "HospitalId": $scope.HospitalID,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "Type": '',
                "IsFrequent": 'N',
                "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || null
            };

            if (val == '') {
                object.IsFrequent = 'Y';
            }
            return eHnoteSettingsDataService.GetMasterDiagnosis(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.DiagnosisList !== undefined) {
                        
                        return response.data.DiagnosisList.map(function (item) {
                            return item;
                        });
                    } 
                } 
            });

        };

        $scope.SaveAdvisorPopup = function () {

            if ($scope.AdvisedOrderDetailsArray.length > 0) {
                //var listSubSplArray = $filter("filter")($scope.AdvisedOrderDetailsArray, function (iterator, ind) { return iterator.IsEditData === true; });
                //if ($scope.adviseObj.OrderType == "Investigations") {
                //    $scope.cacheStorageItem.InvestigationsDetails.push(listSubSplArray[0]);
                //}
                //else if ($scope.adviseObj.OrderType == "Surgery") {
                //    $scope.cacheStorageItem.SurgeriesDetails.push(listSubSplArray[0]);
                //}
                //else if ($scope.adviseObj.OrderType == "Procedures") {
                //    $scope.cacheStorageItem.ProceduresDetails.push(listSubSplArray[0]);
                //}

                $scope.cacheStorageItem.InvestigationsDetails = [];
                $scope.cacheStorageItem.SurgeriesDetails = [];
                $scope.cacheStorageItem.ProceduresDetails = [];
                $scope.cacheStorageItem.ReferralDetails = [];

                angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {

                    if (item.OrderType == "Investigations" && item.DeleteInd == 'N') {
                        $scope.cacheStorageItem.InvestigationsDetails.push(item);
                    }

                    if (item.OrderType == "Surgery" && item.DeleteInd == 'N') {
                        item.UserId = $scope.UserId;
                        $scope.cacheStorageItem.SurgeriesDetails.push(item);
                    }

                    if (item.OrderType == "Procedure" && item.DeleteInd == 'N') {
                         $scope.cacheStorageItem.ProceduresDetails.push(item);
                    }

                    if (item.OrderType == "Referral" && item.DeleteInd == 'N') {
                        $scope.cacheStorageItem.ReferralDetails.push(item);
                    }

                    item.DiagnosisList = $filter("filter")(item.DiagnosisList, function (FAitem, index) { return FAitem.Diagnosis == true },);

                });
            }

            if ($scope.cacheStorageItem.InvestigationsDetails.length !== 0) {
                angular.forEach($scope.cacheStorageItem.InvestigationsDetails, function (Aitem) {
                    angular.forEach(Aitem.DiagnosisList, function (Bitem) {
                        $scope.cacheStorageItem.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];

                        var List = $filter("filter")($scope.cacheStorageItem.AssessmentPlan, function (FAitem, index) { return FAitem.DiagnosisId == Bitem.DiagnosisId },);
                        if (List.length == 0) {
                            var obj = {
                                "ConsultationDiagnosisId": 0,
                                "AssessmentPlanId": 0,
                                "AssessmentPlan": {
                                    "AssessmentPlanId": 0,
                                    "PlanofDiscussionsNotes": "",
                                    "PatientInstructions": "",
                                    "AssessmentsNotes": "",
                                    "DoctorNotes": "",
                                    "ActionsTaken": ""
                                },
                                "SnomedCodeId": 0,
                                "SnomedCode": "",
                                "CreatedDateTime": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                "SpecializationId": Aitem.SpecializationId,
                                "OrganId": Aitem.OrganId,
                                "SubTab": "1",
                                "PriorityId": null,
                                "ODSeverityId": null,
                                "OSSeverityId": null,
                                "OrganName": GetEyeName(Aitem.OrganId),
                                "DiagnosisId": Bitem.DiagnosisId || 0,
                                "DiagnosisObject": "",
                                "PlanofDiscussionsNotes": "",
                                "PatientInstructions": "",
                                "ActionsTaken": "",
                                "DoctorNotes": "",
                                "DiagnosisRiskLevel": 'Mild',
                                "FindingDiagnosisId": 0,
                                "DiagnosisHistoryId": 0,
                                "ICD10CODE": Bitem.ICDCode || "",
                                "ICD10DIAGDESCRIPTION": Bitem.DiagnosisName || "",
                                "ICD10DIAGNAME": Bitem.DiagnosisName || "",
                                "DiagnosisStatus": null,
                                "PlanOfcareNotesArray": [],
                                "ProceduresArray": [],
                                "PrescriptionArray": [],
                                "SurgeryArray": [],
                                "ReferralArray": [],
                                "InvestigationsArray": [],
                                "InvestigationFindingId": 0,
                                "FindingId": 0,
                                "DeleteInd": "N",
                                "ProceduresAddedTime": "",
                                "PrescriptionAddedTime": "",
                                "PlanOfCareAddedTime": "",
                                "SurgeryAddedTime": "",
                                "IsEditData": false,
                                "SelectedInvestigationObj": "",
                                "InvsearchBy": 1,
                                "OPDPsearchBy": 1,
                                "SurgerysearchBy": 1,
                                "ProcedureSurgerysearchBy": 1,
                                "Type": "Optha",
                                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                "AssessmentsNotes": "",
                                "CodeSystem": "",
                                "StatusList": [{
                                    "OrganStatusId": null,
                                    "OrganId": "1",
                                    "SeverityId": null,
                                    "Verificationstatusid": null,
                                    "DiagnosisStatus": 'Not Examined',
                                    "DiagnosisStatusId": 6,
                                    "EndDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "StartDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "DeleteInd": 'N',

                                },
                                {
                                    "OrganStatusId": null,
                                    "OrganId": "2",
                                    "SeverityId": null,
                                    "Verificationstatusid": null,
                                    "DiagnosisStatus": 'Not Examined',
                                    "DiagnosisStatusId": 6,
                                    "EndDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "StartDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "DeleteInd": 'N',

                                }
                                ],
                            }

                            var object = {
                                "PatientInvestigationId": 0,
                                "ProcedureCode": "",
                                "OrgInvestigationId": 0,
                                "SpecializationId": Aitem.SpecializationId,
                                "InvestigationId": Aitem.DescriptionId || 0,
                                "InvestigationName": Aitem.Description,
                                "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                                "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                "OrganId": Aitem.OrganId,
                                "InvestigationNotes": Aitem.Remarks || "",
                                "DeleteInd": "N",
                                "IsEdit": false,
                                "Duration": Aitem.Duration || "",
                                "DurationType": Aitem.DurationType || "",
                                "ShowDateFormat": false,
                                "DurationDate": Aitem.DurationDate || "",
                                "Remarks": Aitem.Remarks || "",
                                "Status": Aitem.Status || "",
                                "StatusId": Aitem.StatusId || 0,
                            }
                            obj.InvestigationsArray.push(object);
                            $scope.cacheStorageItem.AssessmentPlan.push(obj);
                        } else {
                            angular.forEach(cacheStorageItem.AssessmentPlan, function (ASSitem) {
                                var List = $filter("filter")(ASSitem.InvestigationsArray, function (FAitem, index) { return FAitem.InvestigationId == Aitem.DescriptionId },);
                                if (List.length == 0) {
                                    var object = {
                                        "PatientInvestigationId": 0,
                                        "ProcedureCode": "",
                                        "OrgInvestigationId": 0,
                                        "SpecializationId": Aitem.SpecializationId,
                                        "InvestigationId": Aitem.DescriptionId || 0,
                                        "InvestigationName": Aitem.Description,
                                        "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                                        "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                        "OrganId": Aitem.OrganId,
                                        "InvestigationNotes": Aitem.Remarks || "",
                                        "DeleteInd": "N",
                                        "IsEdit": false,
                                        "Duration": Aitem.Duration || "",
                                        "DurationType": Aitem.DurationType || "",
                                        "ShowDateFormat": false,
                                        "DurationDate": Aitem.DurationDate || "",
                                        "Remarks": Aitem.Remarks || "",
                                        "Status": Aitem.Status || "",
                                        "StatusId": Aitem.StatusId || 0,
                                    }
                                    ASSitem.InvestigationsArray.push(object);
                                }
                            });
                        }

                    });
                });

            }
            if ($scope.cacheStorageItem.SurgeriesDetails.length !== 0) {
                
                angular.forEach($scope.cacheStorageItem.SurgeriesDetails, function (Aitem) {
                    angular.forEach(Aitem.DiagnosisList, function (Bitem) {
                        $scope.cacheStorageItem.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];
                        var List = $filter("filter")($scope.cacheStorageItem.AssessmentPlan, function (FAitem, index) { return FAitem.DiagnosisId == Bitem.DiagnosisId },);
                        if (List.length == 0) {
                            var obj = {
                                "ConsultationDiagnosisId": 0,
                                "AssessmentPlanId": 0,
                                "AssessmentPlan": {
                                    "AssessmentPlanId": 0,
                                    "PlanofDiscussionsNotes": "",
                                    "PatientInstructions": "",
                                    "AssessmentsNotes": "",
                                    "DoctorNotes": "",
                                    "ActionsTaken": ""
                                },
                                "SnomedCodeId": 0,
                                "SnomedCode": "",
                                "CreatedDateTime": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                "SpecializationId": Aitem.SpecializationId,
                                "OrganId": Aitem.OrganId,
                                "SubTab": "1",
                                "PriorityId": null,
                                "ODSeverityId": null,
                                "OSSeverityId": null,
                                "OrganName": GetEyeName(Aitem.OrganId),
                                "DiagnosisId": Bitem.DiagnosisId || 0,
                                "DiagnosisObject": "",
                                "PlanofDiscussionsNotes": "",
                                "PatientInstructions": "",
                                "ActionsTaken": "",
                                "DoctorNotes": "",
                                "DiagnosisRiskLevel": 'Mild',
                                "FindingDiagnosisId": 0,
                                "DiagnosisHistoryId": 0,
                                "ICD10CODE": Bitem.ICDCode || "",
                                "ICD10DIAGDESCRIPTION": Bitem.DiagnosisName || "",
                                "ICD10DIAGNAME": Bitem.DiagnosisName || "",
                                "DiagnosisStatus": null,
                                "PlanOfcareNotesArray": [],
                                "ProceduresArray": [],
                                "PrescriptionArray": [],
                                "SurgeryArray": [],
                                "ReferralArray": [],
                                "InvestigationsArray": [],
                                "InvestigationFindingId": 0,
                                "FindingId": 0,
                                "DeleteInd": "N",
                                "ProceduresAddedTime": "",
                                "PrescriptionAddedTime": "",
                                "PlanOfCareAddedTime": "",
                                "SurgeryAddedTime": "",
                                "IsEditData": false,
                                "SelectedInvestigationObj": "",
                                "InvsearchBy": 1,
                                "OPDPsearchBy": 1,
                                "SurgerysearchBy": 1,
                                "ProcedureSurgerysearchBy": 1,
                                "Type": "Optha",
                                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                "AssessmentsNotes": "",
                                "CodeSystem": "",
                                "StatusList": [{
                                    "OrganStatusId": null,
                                    "OrganId": "1",
                                    "SeverityId": null,
                                    "Verificationstatusid": null,
                                    "DiagnosisStatus": 'Not Examined',
                                    "DiagnosisStatusId": 6,
                                    "EndDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "StartDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "DeleteInd": 'N',

                                },
                                {
                                    "OrganStatusId": null,
                                    "OrganId": "2",
                                    "SeverityId": null,
                                    "Verificationstatusid": null,
                                    "DiagnosisStatus": 'Not Examined',
                                    "DiagnosisStatusId": 6,
                                    "EndDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "StartDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "DeleteInd": 'N',

                                }
                                ],
                            }

                            var object = {
                                "PatientSurgeryId": Aitem.PatientSurgeryId || 0,
                                "ProcedureCode": Aitem.ProcedureCode || "",
                                "OrgSurgeryId": Aitem.OrgDescriptionId || 0,
                                "SurgeryId": Aitem.DescriptionId,
                                "SurgeryName": Aitem.Description || "",
                                "SpecializationId": Aitem.SpecializationId,
                                "SurgeryDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                                "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                "OrganId": Aitem.OrganId,
                                "OrganName": GetEyeName(Aitem.OrganId,),
                                "SurgeryNotes": Aitem.Remarks || "",
                                "DeleteInd": "N",
                                "IsEdit": false,
                                "InternalCoManagerId": Aitem.InternalCoManagerId || null,
                                "CoordinatorId": Aitem.CoordinatorId || null,
                                "CoordinatorRemarks": '',
                                "ExternalCoManagerRemarks": Aitem.Remarks || "",
                                "InternalCoManagerRemarks": '',
                                "IsCoordinatorRemarks": false,
                                "IsExternalCoManagerRemarks": false,
                                "IsInternalCoManagerRemarks": false,
                                "ExternalCoManagerId": Aitem.ExternalCoManagerId || null,
                                "Duration": Aitem.Duration || "",
                                "DurationType": Aitem.DurationType || "",
                                "ShowDateFormat": false,
                                "DurationDate": Aitem.DurationDate || "",
                                "Remarks": Aitem.Remarks || "",
                                "UserId": $scope.UserId,
                                "Status": Aitem.Status || "",
                                "StatusId": Aitem.StatusId || 0,
                            }
                            obj.SurgeryArray.push(object);
                            $scope.cacheStorageItem.AssessmentPlan.push(obj);
                        } else {
                            angular.forEach(cacheStorageItem.AssessmentPlan, function (ASSitem) {
                                var List = $filter("filter")(ASSitem.SurgeryArray, function (FAitem, index) { return FAitem.SurgeryId == Aitem.DescriptionId },);
                                if (List.length == 0) {
                                    var object = {
                                        "PatientSurgeryId": Aitem.PatientSurgeryId || 0,
                                        "ProcedureCode": Aitem.ProcedureCode || "",
                                        "OrgSurgeryId": Aitem.OrgDescriptionId || 0,
                                        "SurgeryId": Aitem.DescriptionId,
                                        "SurgeryName": Aitem.Description || "",
                                        "SpecializationId": Aitem.SpecializationId,
                                        "SurgeryDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                                        "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                        "OrganId": Aitem.OrganId,
                                        "OrganName": GetEyeName(Aitem.OrganId,),
                                        "SurgeryNotes": Aitem.Remarks || "",
                                        "DeleteInd": "N",
                                        "IsEdit": false,
                                        "InternalCoManagerId": Aitem.InternalCoManagerId || null,
                                        "CoordinatorId": Aitem.CoordinatorId || null,
                                        "CoordinatorRemarks": '',
                                        "ExternalCoManagerRemarks": Aitem.Remarks || "",
                                        "InternalCoManagerRemarks": '',
                                        "IsCoordinatorRemarks": false,
                                        "IsExternalCoManagerRemarks": false,
                                        "IsInternalCoManagerRemarks": false,
                                        "ExternalCoManagerId": Aitem.ExternalCoManagerId || null,
                                        "Duration": Aitem.Duration || "",
                                        "DurationType": Aitem.DurationType || "",
                                        "ShowDateFormat": false,
                                        "DurationDate": Aitem.DurationDate || "",
                                        "Remarks": Aitem.Remarks || "",
                                        "UserId": $scope.UserId,
                                        "Status": Aitem.Status || "",
                                        "StatusId": Aitem.StatusId || 0,
                                    }
                                    ASSitem.SurgeryArray.push(object);
                                }
                            });
                        }

                    });
                });
            }
            if ($scope.cacheStorageItem.ProceduresDetails.length !== 0) {
                
                angular.forEach($scope.cacheStorageItem.ProceduresDetails, function (Aitem) {
                    angular.forEach(Aitem.DiagnosisList, function (Bitem) {
                        $scope.cacheStorageItem.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];
                        var List = $filter("filter")($scope.cacheStorageItem.AssessmentPlan, function (FAitem, index) { return FAitem.DiagnosisId == Bitem.DiagnosisId },);
                        if (List.length == 0) {
                            var obj = {
                                "ConsultationDiagnosisId": 0,
                                "AssessmentPlanId": 0,
                                "AssessmentPlan": {
                                    "AssessmentPlanId": 0,
                                    "PlanofDiscussionsNotes": "",
                                    "PatientInstructions": "",
                                    "AssessmentsNotes": "",
                                    "DoctorNotes": "",
                                    "ActionsTaken": ""
                                },
                                "SnomedCodeId": 0,
                                "SnomedCode": "",
                                "CreatedDateTime": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                "SpecializationId": Aitem.SpecializationId,
                                "OrganId": Aitem.OrganId,
                                "SubTab": "1",
                                "PriorityId": null,
                                "ODSeverityId": null,
                                "OSSeverityId": null,
                                "OrganName": GetEyeName(Aitem.OrganId),
                                "DiagnosisId": Bitem.DiagnosisId || 0,
                                "DiagnosisObject": "",
                                "PlanofDiscussionsNotes": "",
                                "PatientInstructions": "",
                                "ActionsTaken": "",
                                "DoctorNotes": "",
                                "DiagnosisRiskLevel": 'Mild',
                                "FindingDiagnosisId": 0,
                                "DiagnosisHistoryId": 0,
                                "ICD10CODE": Bitem.ICDCode || "",
                                "ICD10DIAGDESCRIPTION": Bitem.DiagnosisName || "",
                                "ICD10DIAGNAME": Bitem.DiagnosisName || "",
                                "DiagnosisStatus": null,
                                "PlanOfcareNotesArray": [],
                                "ProceduresArray": [],
                                "PrescriptionArray": [],
                                "SurgeryArray": [],
                                "ReferralArray": [],
                                "InvestigationsArray": [],
                                "InvestigationFindingId": 0,
                                "FindingId": 0,
                                "DeleteInd": "N",
                                "ProceduresAddedTime": "",
                                "PrescriptionAddedTime": "",
                                "PlanOfCareAddedTime": "",
                                "SurgeryAddedTime": "",
                                "IsEditData": false,
                                "SelectedInvestigationObj": "",
                                "InvsearchBy": 1,
                                "OPDPsearchBy": 1,
                                "SurgerysearchBy": 1,
                                "ProcedureSurgerysearchBy": 1,
                                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                "Type": "Optha",
                                "AssessmentsNotes": "",
                                "CodeSystem": "",
                                "StatusList": [{
                                    "OrganStatusId": null,
                                    "OrganId": "1",
                                    "SeverityId": null,
                                    "Verificationstatusid": null,
                                    "DiagnosisStatus": 'Not Examined',
                                    "DiagnosisStatusId": 6,
                                    "EndDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "StartDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "DeleteInd": 'N',

                                },
                                {
                                    "OrganStatusId": null,
                                    "OrganId": "2",
                                    "SeverityId": null,
                                    "Verificationstatusid": null,
                                    "DiagnosisStatus": 'Not Examined',
                                    "DiagnosisStatusId": 6,
                                    "EndDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "StartDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                    "DeleteInd": 'N',

                                }
                                ],
                            }

                            var object = {
                                "PatientProcedureId": 0,
                                "SpecializationId": Aitem.SpecializationId,
                                "ProcedureCode": Aitem.ProcedureCode || "",
                                "OrgProcedureId": Aitem.OrgDescriptionId || 0,
                                "ProcedureId": Aitem.DescriptionId,
                                "ProcedureName": Aitem.Description,
                                "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                "ProceduredDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                                "OrganId": Aitem.OrganId,
                                "OrganName": GetEyeName(Aitem.OrganId),
                                "ProcedureNotes": Aitem.Remarks || "",
                                "DeleteInd": "N",
                                "IsEdit": false,
                                "Duration": Aitem.Duration || "",
                                "DurationType": Aitem.DurationType || "",
                                "ShowDateFormat": false,
                                "DurationDate": Aitem.DurationDate || "",
                                "Status": Aitem.Status || "",
                                "StatusId": Aitem.StatusId || 0,
                            };
                            obj.ProceduresArray.push(object);
                            $scope.cacheStorageItem.AssessmentPlan.push(obj);
                        } else {
                            angular.forEach(cacheStorageItem.AssessmentPlan, function (ASSitem) {
                                var List = $filter("filter")(ASSitem.ProceduresArray, function (FAitem, index) { return FAitem.ProcedureId == Aitem.DescriptionId },);
                                if (List.length == 0) {
                                    var object = {
                                        "PatientProcedureId": 0,
                                        "SpecializationId": Aitem.SpecializationId,
                                        "ProcedureCode": Aitem.ProcedureCode || "",
                                        "OrgProcedureId": Aitem.OrgDescriptionId || 0,
                                        "ProcedureId": Aitem.DescriptionId,
                                        "ProcedureName": Aitem.Description,
                                        "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                        "ProceduredDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                                        "OrganId": Aitem.OrganId,
                                        "OrganName": GetEyeName(Aitem.OrganId),
                                        "ProcedureNotes": Aitem.Remarks || "",
                                        "DeleteInd": "N",
                                        "IsEdit": false,
                                        "Duration": Aitem.Duration || "",
                                        "DurationType": Aitem.DurationType || "",
                                        "ShowDateFormat": false,
                                        "DurationDate": Aitem.DurationDate || "",
                                        "Status": Aitem.Status || "",
                                        "StatusId": Aitem.StatusId || 0,
                                    };
                                    ASSitem.ProceduresArray.push(object);
                                }
                            });
                        }

                    });
                });
            }
            if ($scope.cacheStorageItem.ReferralDetails.length > 0) {
                
                angular.forEach($scope.cacheStorageItem.ReferralDetails, function (Aitem) {
                    if (Aitem.DeleteInd == "N") {
                        angular.forEach(Aitem.DiagnosisList, function (Bitem) {
                            $scope.cacheStorageItem.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];
                            var List = $filter("filter")($scope.cacheStorageItem.AssessmentPlan, function (FAitem, index) { return FAitem.DiagnosisId == Bitem.DiagnosisId; });
                            if (List.length == 0) {
                                var obj = {
                                    "ConsultationDiagnosisId": 0,
                                    "AssessmentPlanId": 0,
                                    "AssessmentPlan": {
                                        "AssessmentPlanId": 0,
                                        "PlanofDiscussionsNotes": "",
                                        "PatientInstructions": "",
                                        "AssessmentsNotes": "",
                                        "DoctorNotes": "",
                                        "ActionsTaken": ""
                                    },
                                    "SnomedCodeId": 0,
                                    "SnomedCode": "",
                                    "CreatedDateTime": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                    "SpecializationId": Aitem.SpecializationId,
                                    "OrganId": Aitem.OrganId,
                                    "SubTab": "1",
                                    "PriorityId": null,
                                    "ODSeverityId": null,
                                    "OSSeverityId": null,
                                    "OrganName": GetEyeName(Aitem.OrganId),
                                    "DiagnosisId": Bitem.DiagnosisId || 0,
                                    "DiagnosisObject": "",
                                    "PlanofDiscussionsNotes": "",
                                    "PatientInstructions": "",
                                    "ActionsTaken": "",
                                    "DoctorNotes": "",
                                    "DiagnosisRiskLevel": 'Mild',
                                    "FindingDiagnosisId": 0,
                                    "DiagnosisHistoryId": 0,
                                    "ICD10CODE": Bitem.ICDCode || "",
                                    "ICD10DIAGDESCRIPTION": Bitem.DiagnosisName || "",
                                    "ICD10DIAGNAME": Bitem.DiagnosisName || "",
                                    "DiagnosisStatus": null,
                                    "PlanOfcareNotesArray": [],
                                    "ProceduresArray": [],
                                    "PrescriptionArray": [],
                                    "SurgeryArray": [],
                                    "ReferralArray": [],
                                    "InvestigationsArray": [],
                                    "InvestigationFindingId": 0,
                                    "FindingId": 0,
                                    "DeleteInd": "N",
                                    "ProceduresAddedTime": "",
                                    "PrescriptionAddedTime": "",
                                    "PlanOfCareAddedTime": "",
                                    "SurgeryAddedTime": "",
                                    "IsEditData": false,
                                    "SelectedInvestigationObj": "",
                                    "InvsearchBy": 1,
                                    "OPDPsearchBy": 1,
                                    "SurgerysearchBy": 1,
                                    "ProcedureSurgerysearchBy": 1,
                                    "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                    "Type": "Optha",
                                    "AssessmentsNotes": "",
                                    "CodeSystem": "",
                                    "StatusList": [{
                                        "OrganStatusId": null,
                                        "OrganId": "1",
                                        "SeverityId": null,
                                        "Verificationstatusid": null,
                                        "DiagnosisStatus": 'Not Examined',
                                        "DiagnosisStatusId": 6,
                                        "EndDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                        "StartDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                        "DeleteInd": 'N',

                                    },
                                    {
                                        "OrganStatusId": null,
                                        "OrganId": "2",
                                        "SeverityId": null,
                                        "Verificationstatusid": null,
                                        "DiagnosisStatus": 'Not Examined',
                                        "DiagnosisStatusId": 6,
                                        "EndDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                        "StartDate": $filter('date')(new Date(), "yyyy-MM-dd") || null,
                                        "DeleteInd": 'N',

                                    }
                                    ],
                                }

                                var object = {
                                    "PatientReferralDetailId": 0,
                                    "OrderReferralDetailId": 0,
                                    "SpecializationId": Aitem.SpecializationId || null,
                                    "Remarks": Aitem.Remarks || "",
                                    "Type": Aitem.Type,
                                    "DeleteInd": "N",
                                    "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                    "ReferralDoctorName": Aitem.ReferralDoctorName || "",
                                    "ReferralDoctorId": Aitem.ReferralDoctorId || null,
                                    "SpecializationName": Aitem.SpecializationName || "",
                                    "Alarm": Aitem.Alarm || "",
                                    "ShowDateFormat": Aitem.ShowDateFormat || false,
                                    "IsUrgency": Aitem.IsUrgency || false,
                                    "IsFollowUpAfterReferral": Aitem.IsFollowUpAfterReferral || false,
                                    "IsIncludeInCaseHistory": Aitem.IsIncludeInCaseHistory || false,
                                    "DurationDate": Aitem.DurationDate || "",
                                    "Duration": Aitem.Duration || "",
                                    "ReferralImageArray": [],
                                    "DiagnosisList": Aitem.DiagnosisList || [],
                                    "ReferralReason": Aitem.ReferralReason || "",
                                    "DurationType": Aitem.DurationType || "",
                                    "ReferralId": Aitem.ReferralId || 0,
                                    "Referral": Aitem.Referral || "",
                                };
                                obj.ReferralArray.push(object);
                                $scope.cacheStorageItem.AssessmentPlan.push(obj);
                            } else {
                                angular.forEach(cacheStorageItem.AssessmentPlan, function (ASSitem) {
                                    var List = $filter("filter")(ASSitem.ReferralArray, function (FAitem, index) { return FAitem.ReferralId == Aitem.ReferralId },);
                                    if (List.length == 0) {
                                        var object = {
                                            "PatientReferralDetailId": 0,
                                            "OrderReferralDetailId": 0,
                                            "SpecializationId": Aitem.SpecializationId || null,
                                            "Remarks": Aitem.Remarks || "",
                                            "Type": Aitem.Type,
                                            "DeleteInd": "N",
                                            "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                            "ReferralDoctorName": Aitem.ReferralDoctorName || "",
                                            "ReferralDoctorId": Aitem.ReferralDoctorId || null,
                                            "SpecializationName": Aitem.SpecializationName || "",
                                            "Alarm": Aitem.Alarm || "",
                                            "ShowDateFormat": Aitem.ShowDateFormat || false,
                                            "IsUrgency": Aitem.IsUrgency || false,
                                            "IsFollowUpAfterReferral": Aitem.IsFollowUpAfterReferral || false,
                                            "IsIncludeInCaseHistory": Aitem.IsIncludeInCaseHistory || false,
                                            "DurationDate": Aitem.DurationDate || "",
                                            "Duration": Aitem.Duration || "",
                                            "ReferralImageArray": [],
                                            "DiagnosisList": Aitem.DiagnosisList || [],
                                            "ReferralReason": Aitem.ReferralReason || "",
                                            "DurationType": Aitem.DurationType || "",
                                            "ReferralId": Aitem.ReferralId || 0,
                                            "Referral": Aitem.Referral || "",
                                        };
                                        ASSitem.ReferralArray.push(object);
                                    }
                                });
                            }

                        });
                    }
                });
            }

            var obj = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalID,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "ConsultationId": $scope.cacheStorageItem.ConsultationID,
                "StatusFlag": "D",
                "IsNKDSelected": false,
                "PatientId": $scope.cacheStorageItem.patientid,
                "AssessmentplanArray": $scope.cacheStorageItem.AssessmentPlan,
                "InvestigationsDetails": $scope.cacheStorageItem.InvestigationsDetails,
                "SurgeriesDetails": $scope.cacheStorageItem.SurgeriesDetails,
                "ProceduresDetails": $scope.cacheStorageItem.ProceduresDetails,
                "ReferralDetails": $scope.cacheStorageItem.ReferralDetails
            }
            eHnoteSettingsDataService.AddUpdateAppointmentAssessmentplanDetails(obj).then(function (resp) {
                if (resp.data.Status === 'Success') {
                    $scope.cacheStorageItem.AssessmentPlan = resp.data.AssessmentPlanArray;

                    $scope.cacheStorageItem.InvestigationsDetails = resp.data.InvestigationsDetails;
                    $scope.cacheStorageItem.SurgeriesDetails = resp.data.SurgeriesDetails;
                    $scope.cacheStorageItem.ProceduresDetails = resp.data.ProceduresDetails;
                    $scope.cacheStorageItem.ReferralDetails = resp.data.ReferralDetails;

                    $uibModalInstance.close($scope.cacheStorageItem);
                } else {
                    alertify.error(resp.Message);
                }
            });

        };

        $scope.changereferalSubSpecialization = function (item) {
            item = item || "";
            if (item == "") {
                $scope.Referralobj.SpecializationId = "";
                $scope.Referralobj.SpecializationName = "";
                return false;
            }
            $scope.Referralobj.SubSpecializationId = item.SubSpecializationId;
            $scope.Referralobj.SpecializationId = item.SpecializationId;
            
        }

        $scope.SearchPCPDOClist = function (val,typeId,item) {
            var reqObj = {
                'LocationId': null,
                'PageNumber': 1,
                'PageSize': 1000,
                'SearchTaxt': val || "",
                "SpecializationId": $scope.SpecializationId || null,
                "DeleteInd": 'N',
                "OrganizationId": $scope.HospitalID || 0,
                "RefaralTypeId": typeId||""

            };
            $scope.Referralobj.SpecializationId = $scope.Referralobj.SpecializationId || "";
            if ($scope.Referralobj.SpecializationId !== "") {
                reqObj.SpecializationId = $scope.Referralobj.SpecializationId;
            }

            item.ReferralId = item.ReferralId || "";
            if (item.ReferralId === 14) {
                $scope.IsReferToHospitalsInd = true;
            } else {
                $scope.IsReferToHospitalsInd = false;
            }

            return eHnoteReferalDataService.GetReferalPCPDoctors(reqObj).then(function (resp) {
                if ($scope.IsReferToHospitalsInd) {
                    resp.data.PcpRefdetails = $filter("filter")(resp.data.PcpRefdetails, function (item) { return item.RefaralTypeId === 4; });
                } else {
                    resp.data.PcpRefdetails = $filter("filter")(resp.data.PcpRefdetails, function (item) { return item.RefaralTypeId === 1 || item.RefaralTypeId === 2; });
                }
                return resp.data.PcpRefdetails.map(function (item) {
                    return item;
                });

            });
        };

        $scope.SearchInternalDOClist = function (val) {
                $scope.AllDoctorList = angular.copy($scope.allUserList);
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });
                $scope.Referralobj.SubSpecializationId = $scope.Referralobj.SubSpecializationId || null;
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, { "FullName": val });
                return $scope.AllDoctorList.map(function (item) {
                    return item;

                });

        }

         $scope.onSelectAssesmentPlannewDiagnosis1 = function (object, Mainobj) {
            Mainobj.DiagnosisList = Mainobj.DiagnosisList || [];
            if (Mainobj.DiagnosisList.length > 0) {
                var filterdiagnosis = $filter("filter")(Mainobj.DiagnosisList, function (Aitem, index) { return Aitem.DiagnosisId == object.DiagnosisId }, true);
                if (filterdiagnosis.length > 0) {
                    Mainobj.DiagnosisObject = "";
                    alertify.error("Diagnosis Already Added");
                    return false;
                }
            }

            var obj = {
                "ActiveInd": "Y",
                "DiagnosisDetailId": object.DiagnosisId || 0,
                "DiagnosisId": object.DiagnosisId,
                "DiagnosisName": object.DiagnosisName,
                "ICDCode": object.ICD10CODE,
                "Diagnosis": true
            }

            Mainobj.DiagnosisList.push(obj);
            $scope.Referralobj.DiagnosisObject = "";
            Mainobj.DiagnosisObject = "";
        };

        $scope.uploadPatientFiles = function ($files, ritem) {
            $scope.patientfiles = $files;
            if ($scope.patientfiles === "" || $scope.patientfiles === null || $scope.patientfiles === undefined) {
                return;
            }


            var file = $scope.patientfiles;
            var fd = new FormData();
            $scope.cacheStorageItem.TreatmentPlanId = $scope.cacheStorageItem.TreatmentPlanId || 0;
            fd.append("UserID", eHnoteMasterDataService.getLoginId());
            fd.append("HospitalID", $scope.HospitalID);
            fd.append("PatientID", $scope.cacheStorageItem.patientid);
            fd.append("PatientName", $scope.cacheStorageItem.PatientName);
            fd.append("AppointmentID", $scope.cacheStorageItem.appointmentid);
            fd.append("TreatmentPlanId", $scope.cacheStorageItem.TreatmentPlanId);

            fd.append("Remarks", '');
            fd.append("SignedDate", $filter('date')(new Date(), "yyyy-MM-dd"));
            fd.append("OrgConsentFormId", 0);
            fd.append("FileTypeId", 10);
            fd.append("IsPartiallyUploaded", 'Y');
            fd.append("LabTestId", 0);
            fd.append("ShowNewConsultation", 'Y');
            angular.forEach(file, function (value, key) {
                fd.append(key, value);
            });


            eHnoteDiagnosisDataServices.addPatientUploadfile(fd, callbackfileuploadSuccess, callbackfileuploadError);
            function callbackfileuploadSuccess(resp) {
                ritem.ReferralImageArray = ritem.ReferralImageArray || [];
                $scope.TempFileUploadPdfArray = [];
                $('#noFile').html('No file chosen...');
                if (resp.PatientFiles !== undefined) {
                    if (resp.PatientFiles.length > 0) {
                        var filteredArray = $filter('filter')(resp.PatientFiles, { "IsPartiallyUploaded": true });
                        for (var i = 0; i < filteredArray.length; i++) {
                            if (filteredArray[i].FileTypeId == 10) {
                                $scope.docname = "";
                                filteredArray[i].docNameDisplay = '';
                                var extension = ".jpg";
                                if (filteredArray[i].DocName) {
                                    extension = filteredArray[i].DocName.split(".")[1];
                                }
                                var pName = filteredArray[i].DocName.split("_")[0];
                                if (pName.length > 9) {
                                    name = pName.substring(0, 9) + "..." + "." + extension;
                                } else {
                                    name = angular.copy(pName) + '.' + extension;
                                }
                                filteredArray[i].docNameDisplay = name;

                                if (filteredArray[i].DocURL.indexOf(".pdf") > -1) {
                                    filteredArray[i].DeleteInd = false;
                                    $scope.TempFileUploadPdfArray.push(filteredArray[i]);
                                } else {
                                    filteredArray[i].DeleteInd = false;
                                    ritem.ReferralImageArray.push(filteredArray[i]);
                                }
                                $scope.cacheStorageItem.ConsultationID = filteredArray[i].ConsultationId;
                            }

                        }
                    }
                }
            }
            function callbackfileuploadError(err) {
                alertify.success("Uploading Failed");
            }

        };

        $scope.GetMasterSuffix = function () {
            $scope.SuffixList = [];
            eHnoteDbStaticDataService.getMasterUserSuffixList().then(function (resp) {
                $scope.SuffixList = resp.data;
            }, function (err) {
                alertify.error("Getting Titles Failed");
            });
        }
        $scope.GetMasterSuffix();

        $scope.SearchLocationByZipcode = function (val) {
            var Zipcode = val || "";
            if (val.length >= 5) {
                return eHnoteSettingsDataService.GetLocationsByZipCode(Zipcode).then(function (response) {
                    if (response.data.rows !== undefined) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }
                });
            }
        };

        $scope.SearchZipcodebyCounty = function (item) {
            if (item != "") {
                $scope.PCPObj.LocationId = item.LocationId;
                $scope.PCPObj.LocationName = item.LocationName;
                $scope.PCPObj.CityId = item.CityId;
                $scope.PCPObj.CityName = item.CityName;
                $scope.PCPObj.StateId = item.StateId;
                $scope.PCPObj.StateName = item.StateName;
            }
        };

        $scope.changeZipcodetoProcedure = function (item) {
            $scope.PCPObj.LocationName = "";
            $scope.PCPObj.CityName = "";
            $scope.PCPObj.StateName = "";
            $scope.PCPObj.CountyName = "";
        };

        $scope.AddReferalPCPDoctor = function () {
            if ($scope.PCPObj.FirstName === '') {
                alertify.error("Please Enter Name ");
                return;
            }
            $scope.PCPObj.Gender = $scope.PCPObj.Gender || ""
            if ($scope.PCPObj.Gender === '') {
                alertify.error("Please Enter Gender ");
                return;
            }
            $scope.PCPObj.MobileNo = $scope.PCPObj.MobileNo || null;
            if ($scope.PCPObj.MobileNo === null) {
                alertify.error("Please Enter MobileNo ");
                return;
            }
            if ($scope.PCPObj.EmailId === '') {
                alertify.error("Please Enter EmailId ");
                return;
            }
            if ($scope.PCPObj.NPI === '') {
                alertify.error("Please Enter NPI ");
                return;
            }
            if ($scope.PCPObj.ZipCode === '') {
                alertify.error("Please Enter ZipCode ");
                return;
            }

            var reqObj = {
                "PcpReferalId": $scope.PCPObj.PcpReferalId,
                "FirstName": $scope.PCPObj.FirstName,
                'LastName': $scope.PCPObj.LastName,
                'Title': $scope.PCPObj.Title,
                'PcpOrganizationName': $scope.PCPObj.PcpOrganizationName || '',
                'Age': $scope.PCPObj.Age,
                "MobileNo": $scope.PCPObj.MobileNo,
                "AlternateMobileNo": $scope.PCPObj.AlternateMobileNo,
                "Gender": $scope.PCPObj.Gender,
                "EmailId": $scope.PCPObj.EmailId,
                "SuffixId": $scope.PCPObj.SuffixId,
                'Address1': $scope.PCPObj.Address1,
                'Address2': $scope.PCPObj.Address2,
                'LocationId': $scope.PCPObj.LocationId,
                "StateId": $scope.PCPObj.StateId,
                'CityId': $scope.PCPObj.CityId,
                'PinCode': $scope.PCPObj.PinCode,
                'ZipCodePlusNo': $scope.PCPObj.ZipCodePlusNo,
                "SpecializationId": $scope.PCPObj.SpecializationId || null,
                "SubSpecializationId": $scope.PCPObj.SubSpecializationId || null,
                "DeleteInd": $scope.PCPObj.DeleteInd,
                "countrycode": $scope.PCPObj.countrycode,
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                'NPI': $scope.PCPObj.NPI,
                'SSN': $scope.PCPObj.SSN || '',
                'EmployeeId': $scope.PCPObj.EmployeeId || '',
                'Slicence': $scope.PCPObj.Slicence,
                'TaxonomyId': $scope.PCPObj.TaxonomyId,
                'ContactNo': $scope.PCPObj.ContactNo,
                'Contactcountrycode': $scope.PCPObj.Contactcountrycode
            };
            eHnoteReferalDataService.ModifyReferalPCPDoctor(reqObj).then(function (resp) {

                if (resp.data.Status == "Success") {
                    alertify.success("Successfully Added");
                    $scope.Referralobj.IsnewProvider = false;
                  
                }
                else {
                    alertify.error(resp.data.Message);
                }

            });
        };

        $scope.ChangeSpecialization = function (item) {
            if (item != undefined) {
                $scope.PCPObj.SubSpecializationId = item.SubSpecializationId;
            }
        };
        $scope.ChangeSubspecialization = function (item) {
            if (item != undefined) {
                $scope.PCPObj.SpecializationId = item.SpecializationId;
            }
        };

        $scope.cacheStorageItem.ReferralDetails = $scope.cacheStorageItem.ReferralDetails || [];    

        $scope.ChangeProvider = function (item) {
            if (item == true) {
                $scope.Referralobj.IsnewProvider = false;
            } else {
                $scope.Referralobj.IsnewProvider = true;
            }
        };

        $scope.ChangeReferalDetails = function (ritem) {

            
            angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                item.IsEditData = false;
            })
            ritem.IsEditData = true;
        }

        $scope.OnSelectDoctor = function (item, obj) {
            $scope.Referralobj.SpecializationId = $scope.Referralobj.SpecializationId || "";
            if ($scope.Referralobj.SpecializationId =="") {
                alertify.error('Please Select Specialization');
                $scope.Referralobj.referralDoctorObj = "";
                return false;
            }
            obj.ReferralDoctorId = item.DoctorID;
            obj.ReferralDoctorName = item.FullName;
            obj.SpecializationId = $scope.Referralobj.SpecializationId;
            obj.SubSpecializationId = $scope.Referralobj.SubSpecializationId;
            
            //$scope.Referralobj.SubSpecializationObj = "";
            //$scope.Referralobj.referralDoctorObj = "";
        };

        $scope.RemoveDoctorName = function (item) {
            //item.OrderReferralDetailId = "";
            item.PatientReferralDetailId
            item.ReferralDoctorName = "";
            item.ReferralDoctorId = 0;
            item.Duration = 0;
            item.DurationType = "D";
            item.Alarm = "";
            item.ReferralReason = "";
            item.Remarks = "";
            item.DiagnosisObject = "";
            item.IsUrgency = false;
            item.IsFollowUpAfterReferral = false;
            item.IsIncludeInCaseHistory = false;
        }

        $scope.ChangeAdvisedOrders = function () {
            $scope.ProcedureListFocus = false;
        }

        $scope.ChangeFinalType = function (type, item) {

            item.OrderType = type;
            if (item.OrderType =='Investigations') {
                item.OrderTypeId = 1;
            }
            if (item.OrderType == 'Procedures') {
                item.OrderTypeId = 2;
            }
            if (item.OrderType == 'Surgery') {
                item.OrderTypeId = 3;
                item.CoordinatorId = null;
                item.ExternalCoManagerId = null;
                item.InternalCoManagerId = null;
            }
            if ($scope.AdvisedOrderDetailsArray.length !== 0) {
                angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                    item.IsEditData = false;
                });

                var tempAdvisedOrder = $filter("filter")($scope.AdvisedOrderDetailsArray, function (advitem, index) { return advitem.DeleteInd == "N" && advitem.OrderType == type }) || [];
                if (tempAdvisedOrder.length > 0) {
                    tempAdvisedOrder[0].IsEditData = true;
                }

            }
        }

        $scope.DelectAdvicedOrder = function (item, type) {
            var index = $scope.AdvisedOrderDetailsArray.indexOf(item);
            if (item.AdvicedInvestigationId === 0) {
                if (index > -1) {
                    $scope.AdvisedOrderDetailsArray.splice(index, 1);
                    
                }
            } else {
                $scope.AdvisedOrderDetailsArray[index].DeleteInd = 'Y';
                
            }

        }

        $scope.ChangeModalities = function (item,id) {
            item.ModalityId = id || null;
        }

        
        $scope.ordershistorypopup = {
            "templateUrl": "templates/UIBPopovers/ordershistorypopup.html",
        };

        $scope.ShowTab = 'Order';
        $scope.ChangeAllOrdersTab = function (type) {
            $scope.ShowTab = type;
            $scope.Referralobj.IsnewProvider = false;
        };

        $scope.GetReferralMasterData = function (val) {
            var obj = {
                "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "UserId": $scope.UserId,
                "SearchText": val || null,
                "PageNumber": 1,
                "PageSize": 20,
            };
            return eHnoteSettingsDataService.GetReferralMasterData(obj).then(function (response) {
                if (response.data.Referral.length !== 0) {
                    return response.data.Referral.map(function (item) {
                        return item;
                    });

                }
            });
        };

        $scope.OnClickAdvisedReferal = function (mainitem) {
            $scope.AdvisedOrderDetailsArray = $scope.AdvisedOrderDetailsArray || [];
            if ($scope.AdvisedOrderDetailsArray.length > 0) {
                var filterProcedure = $filter("filter")($scope.AdvisedOrderDetailsArray, function (Aitem, index) { return Aitem.ReferralId == mainitem.ReferralId && Aitem.DeleteInd =='N'},);
                if (filterProcedure.length > 0) {
                    $scope.adviseObj.SearchReferalObj = "";
                    alertify.error("Already Added This Referral");
                    return false;
                }
            }

            if ($scope.AdvisedOrderDetailsArray.length !== 0) {
                angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                    item.IsEditData = false;
                });
            }
            $scope.adviseObj.SearchReferalObj = "";
            
            var obj = {
                "PatientOrderId": 0,
                "PatientReferralDetailId": 0,
                "SpecializationId": 0,
                "Remarks": "",
                "DeleteInd": "N",
                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "ReferralDoctorName": "",
                "ReferralDoctorId": 0,
                "SpecializationName": "",
                "Alarm": "",
                "IsUrgency": false,
                "IsFollowUpAfterReferral": false,
                "IsIncludeInCaseHistory": false,
                "DurationDate": "",
                "Duration": "",
                "ReferralReason": "",
                "DurationType": "",
                "DiagnosisList": [],
                "IsEditData": true,
                "FinalObj": "Referral",
                "OrderType": 'Referral',
                "OrderTypeId": 4,
                "Description": mainitem.Referral || "",
                "ReferralId": mainitem.ReferralId,
                "Referral": mainitem.Referral || "",
                "ShowDateFormat": true,
                "DurationDate": '',
                "referralDoctorObj": "",
                "Subtab": "1",
                "Type": "Internal"
            }
            $scope.AdvisedOrderDetailsArray.push(obj);
            $scope.Referralobj.FinalObj = obj.OrderType;
            $scope.Referralobj.OrderTypeId = obj.OrderTypeId;

            $scope.Referralobj.IsnewProvider = false;
            $scope.Referralobj.Type = 'Internal';
            $scope.Referralobj.SpecializationObj = '';
            $scope.Referralobj.referralDoctorObj = '';
            
            $scope.ContentButtonShowActiveReferral = true;
            $scope.ContentButtonShowActiveProcedure = false;
            $scope.ContentButtonShowActiveSurgery = false;
            $scope.ContentButtonShowInvestigation = false;
        };

        function GetEyeName(SelectedEye) {
            if (SelectedEye === 1 || SelectedEye === "1") {
                return "OD";
            }
            if (SelectedEye === 2 || SelectedEye === "2") {
                return "OS";
            }
            if (SelectedEye === 3 || SelectedEye === "3") {
                return "OU";
            }
            if (SelectedEye === 4 || SelectedEye === "4") {
                return "General";
            }

            if (SelectedEye === 5 || SelectedEye === "5") {
                return "Hair";
            }
            if (SelectedEye === 6 || SelectedEye === "6") {
                return "Skin";
            }
            if (SelectedEye === 7 || SelectedEye === "7") {
                return "Laser";
            }
        }

        $scope.ChangeReferaltype = function (Ritem, Mitem) {
            $scope.Referralobj.IsnewProvider = false;
            $scope.Referralobj.SubSpecializationObj = "";
            $scope.Referralobj.referralDoctorObj = "";
            Mitem.Type = Ritem.Type || "Internal";
        };

        $scope.ChangeReferalDateFormet = function (item) {
            if (item.ShowDateFormat) {
                item.DurationDate = null;
            } else {
                item.Duration = "";
                item.DurationType = "";
            }
            item.ShowDateFormat = !item.ShowDateFormat;
        };

        $scope.getBranchSpecializations = function(SubOrganizationId, BranchId) {
            $scope.OrgSpecialitiesArray = [];
            if (BranchId === 0) {
                eHnoteMainAdminServices.getAllBranchSpecialitiesById(SubOrganizationId).then(function (resp) {
                    if (resp.data.row.length > 0) {
                        $scope.OrgSpecialitiesArray = resp.data.row;
                    }
                });
            } else {
                eHnoteMainAdminServices.getBranchSpecialitiesById(BranchId).then(function (resp) {
                    if (resp.data.row.length > 0) {
                        $scope.OrgSpecialitiesArray = resp.data.row;
                    }
                });
            }
        }
        $scope.getBranchSpecializations(0, $scope.HospitalID);

        $scope.changereferalSpecialization = function (item) {
            item = item || "";

            if (item == 3 || "") {
                $scope.SelectSpecializationObj = true;
            }
            else {
                $scope.SelectSpecializationObj = false;
            }

            $scope.Referralobj.referralDoctorObj = "";
        };

        $scope.OnSelectReferalHospital = function (item, Mitem) {
            Mitem.ReferralDoctorName = item.FullName || '';
            Mitem.ReferralReason = $scope.cacheStorageItem.PatientName + " s being referred to " + item.FullName + " due to high fever";
            Mitem.ReferralDoctorId = item.DoctorID || null;
        };


        $scope.OnSelectReferalDoctor = function (item, Mitem) {
            Mitem.ReferralDoctorName = item.FullName || '';
            Mitem.ReferralDoctorId = item.DoctorID || null;
        };

        $scope.ChangeProcedureStatus = function (Aitem) {
            var List = $filter("filter")($scope.GetProcedureStatusList, function (pitem, index) { return pitem.StatusId == Aitem.StatusId; });
            Aitem.Status = List[0].Status || "Active";
        };

        $scope.GetExternalPCP = function (val) {
            var reqObj = {
                'LocationId': null,
                'PageNumber': 1,
                'PageSize': 1000,
                'SearchTaxt': val || "",
                "SpecializationId": $scope.SpecializationId || null,
                "DeleteInd": 'N',
                "OrganizationId": $scope.HospitalID || 0

            };

            eHnoteReferalDataService.GetReferalPCPDoctors(reqObj).then(function (resp) {
                $scope.AllExternalCoordinatorList = [];
                if (resp.data.PcpRefdetails.length > 0) {
                    $scope.AllExternalCoordinatorList = resp.data.PcpRefdetails || [];
                }
            });
        };
        $scope.GetExternalPCP();

        $scope.changePhNumber = function (item) {
            item = item.toString();
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            $scope.PCPObj.MobileNo = obj.UsFormatMobileNumber;
        }
        $scope.ChangeDurationType = function (item) {
            if (item.DurationType === "SD" || item.DurationType === "NV" || item.DurationType === "T" || item.DurationType === "ASAP") {
                item.Duration = "";
            }
        };

        $scope.AddResult = function (item) {
            if (item.PatientInvestigationId != 0 || item.PatientProcedureId != 0 || item.OrgDescriptionId !=0) {
                $scope.PatientInvestigationId = item.PatientInvestigationId || 0;
                $scope.PatientProcedureId = item.PatientProcedureId || 0;
                $scope.ResultObj.InvestigationName = item.Description || "";
                $scope.Referralobj.IsAddResult = true;
                $scope.ResultObj.DurationDate = $filter('date')(item.ResultDate, "MM-dd-yyyy"),
                $scope.ResultObj.DoctorsName = item.ResultAddedBy || "";
                $scope.ResultObj.LocationName = item.ResultLocation || "";
                $scope.ResultObj.Notes = item.InterpretationNotes || "";
                $scope.ResultObj.ResultId = item.ResultId || 0;
                $scope.ResultObj.LocationId = item.LocationId || 0;
                $scope.TypeId = $scope.PatientProcedureId != 0 ? 1 : $scope.PatientInvestigationId != 0 ? 2 : 0;
            } else {
                $scope.ResultObj.InvestigationName = "";
                $scope.ResultObj.DurationDate = "";
                $scope.ResultObj.DoctorsName = "";
                $scope.ResultObj.LocationName = "";
                $scope.ResultObj.Notes = "";
                $scope.ResultObj.ResultId = 0;
                $scope.ResultObj.LocationId = 0;
                $scope.ResultObj.PatientInvestigationId = 0;
                $scope.ResultObj.PatientProcedureId = 0;
                $scope.TypeId = 0;
            }
        };
        $scope.CloseResult = function () {
            $scope.Referralobj.IsAddResult = false;
            $scope.ResultObj.DurationDate = "";
            $scope.ResultObj.DoctorsName = "";
            $scope.ResultObj.LocationName = "";
            $scope.ResultObj.Notes = "";
        };

        $scope.searchtxtb = { "txt1": "", "txt2": "" };
        $scope.searchtxtb.txt1 = "";

        $scope.SelectUserName = function (kitem) {
            $scope.ResultObj.DoctorsName = kitem.UserFullName + '-' + kitem.NPI;
        }

        $scope.GetOrganizationFacilities = function () {
            var params = {
                "OrganizationId": $scope.HospitalID || 0,
                "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 10
            };

            eHnoteSettingsDataService.GetOrganizationBillingProviders(params).then(function (resp) {
                console.log(resp.data);
                $scope.LocationList = [];
                if (resp.data.Status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.LocationList = resp.data.rows || [];
                    }
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {
                console.log(error);
            });
        };
        $scope.GetOrganizationFacilities();

        $scope.AddUpdateResult = function (item) {

            if ($scope.ResultObj.Notes != "") {
                item.InterpretationNotes = $scope.ResultObj.Notes;
            } else {
                item.InterpretationNotes = "";
            }
            if ($scope.ResultObj.LocationName != "") {
                item.ResultLocation = $scope.ResultObj.LocationName;
            } else {
                item.ResultLocation = "";
            }
            if ($scope.ResultObj.DurationDate != "") {
                item.ResultDate = $scope.ResultObj.DurationDate;
            } else {
                item.ResultDate = "";
            }
            if ($scope.ResultObj.DoctorsName != "") {
                item.ResultAddedBy = $scope.ResultObj.DoctorsName;
            } else {
                item.ResultAddedBy = "";
            }

            var obj = {
                "ResultId": $scope.ResultObj.ResultId || 0,
                "PatientInvestigationId": $scope.PatientInvestigationId || 0,
                "PatientProcedureId": $scope.PatientProcedureId || 0,
                "InvestigationName": $scope.ResultObj.InvestigationName || "",
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "UserId": $scope.UserId,
                "ConsultationId": $scope.cacheStorageItem.ConsultationID,
                "PatientId": $scope.cacheStorageItem.patientid,
                "DurationDate": $filter('date')(new Date($scope.ResultObj.DurationDate), "yyyy-MM-dd"),
                "DoctorsName": $scope.ResultObj.DoctorsName || "",
                "LocationName": $scope.ResultObj.LocationName || "",
                "LocationId": $scope.ResultObj.LocationId || null,
                "Notes": $scope.ResultObj.Notes || "",
                "TypeId": $scope.TypeId || 0,
            }
            eHnoteSettingsDataService.AddUpdateResultsforInvestigation(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.cacheStorageItem.InvestigationResults = [];
                    $scope.cacheStorageItem.InvestigationResults = resp.data.rows;
                    $scope.Referralobj.IsAddResult = false;

                    if (resp.data.rows.length > 0) {
                        item.PhysicalAddress1 = resp.data.rows[0].PhysicalAddress1 || "";
                        item.PhysicalAddress2 = resp.data.rows[0].PhysicalAddress2 || "";
                        item.PhysicalCityName = resp.data.rows[0].PhysicalCityName || "";
                        item.PhysicalStateName = resp.data.rows[0].PhysicalStateName || "";
                        item.PhysicalZipCode = resp.data.rows[0].PhysicalZipCode || "";
                        item.ContactMobileNumber = resp.data.rows[0].ContactMobileNumber || "";

                    } else {
                        item.PhysicalAddress1 = "";
                        item.PhysicalAddress2 = "";
                        item.PhysicalCityName = "";
                        item.PhysicalStateName = "";
                        item.PhysicalZipCode = "";
                        item.ContactMobileNumber = "";
                    }
                }
            });
        }

        $scope.ClearResult = function () {
            $scope.ResultObj.DurationDate = "";
            $scope.ResultObj.DoctorsName = "";
            $scope.ResultObj.LocationName = "";
            $scope.ResultObj.LocationId = null;
            $scope.ResultObj.Notes = "";
            $scope.ResultObj.DoctorsName = "";
        }

        $scope.ChangeLocation = function (locationname) {
            var filterlocation = $filter("filter")($scope.LocationList, function (Litem, index) { return Litem.FacilityName == locationname }, true);
            if (filterlocation.length > 0) {
                $scope.ResultObj.LocationId = filterlocation[0].OrganizationBillingProviderId;
            }
        }
        $scope.Focustocalender = function () {
            $scope.IsCalenderOpen = !$scope.IsCalenderOpen;
        }
        $scope.Costestimatedpopup = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Costestimatedpopupnew.html",
                "backdrop": "static",
                "backdropClass": "customassessmentspopupback",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "customassessmentspopup",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        }
        $scope.Patienteducationpopup = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Patienteducationpopupnew.html",
                "backdrop": "static",
                "backdropClass": "customassessmentspopupback",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "customassessmentspopup",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        }
    }]);
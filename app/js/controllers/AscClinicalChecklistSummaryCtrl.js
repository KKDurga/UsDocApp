"use strict";
eHnoteWebApp.controller("AscClinicalChecklistSummaryCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "datapersistanceFactory", "$window", "eHnoteMainAppointmentService", "$q", "eHnotePatientAddressDataServices", "eHnoteOrgReferralDataServices", "localStorageFactory", "eHnoteSurgeryService", "$timeout", "eHnotePrintService", "eHnoteSettingsDataService", "SurgeryStaticDataService", "eHnoteInsuranceService", "Lightbox", "eHnoteDbStaticDataService", "eHnoteMainAdminServices", "eHnoteAuditServices", "eHnoteDiagnosisDataServices", "datacookieFactory", "$translate", "eHnoteUserDataService",
    function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, datapersistanceFactory, $window, eHnoteMainAppointmentService, $q, eHnotePatientAddressDataServices, eHnoteOrgReferralDataServices, localStorageFactory, eHnoteSurgeryService, $timeout, eHnotePrintService, eHnoteSettingsDataService, SurgeryStaticDataService, eHnoteInsuranceService, Lightbox, eHnoteDbStaticDataService, eHnoteMainAdminServices, eHnoteAuditServices, eHnoteDiagnosisDataServices, datacookieFactory, $translate, eHnoteUserDataService) {

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.SelectedFile = 1;
        $scope.LoginUserRoleID = doctorinfo.RoleID;
        $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };

        $scope.ChecklistFilesObj = {
            "TempImagesArray": [],
            "SaveTempImagesArray": []
        }

        $scope.FollowUptemplateover = {
            templateUrl: 'ChecklistTemplatSave.html',
        };

        $scope.ChecklistArray = [];
        $scope.ChecklistArray = $scope.allUserList.filter((x) => x.RoleId == 38 || x.RoleId == 8);

        $scope.ClinicalChecklistParentObj = {
            "ClinicalChecklist": [],
            "IsAllClinicalCheckListChecked": '',
            "ClinicalChecklistTemplates": [],
            "MedicineChecklistTemplates": [],
            "SelectedClinicalChecklistTemplate": "",
            "AdmissionRemarks": "",
            "CheckListRemarks": "",
            "NewChecklistName": "",
            "ChecklistValueType": "",
            "NurseReviewedByName": "",
            "CheckListChartStatus": "D",
            "LastSignOffUserDetails": [],
            "IsClickSaveClinicalChecklistBtn": false,
        };


        let BranchSettingsData = datapersistanceFactory.getItem("BranchSettingsData");
        $scope.IsShowEmptyASCChecklist = BranchSettingsData?.IsShowEmptyASCChecklist || false;
       

        $scope.ShowAddChecklistPopup = function () {
            $scope.modalInstance = $uibModal.open({
                "templateUrl": "templates/ASC/AscClinicalChecklist.html",
                "controller": "AscClinicalChecklistCtrl",
                "resolve": {
                    "allUserList": function () { return angular.copy($scope.allUserList); },

                },
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "backdrop": "static",
                "keyboard": false
            });

            $scope.modalInstance.result.then(function (data) {
                $scope.ClinicalChecklistParentObj.CheckListRemarks = data.CheckListRemarks || "";
                $scope.ClinicalChecklistParentObj.PreAdmissionChecklistDocuments = data.Documents || [];
                $scope.ClinicalChecklistParentObj.ClinicalChecklist = data.Checklist || [];
                $scope.ClinicalChecklistParentObj.ChecklistReviewedByName = data.ChecklistReviewedByName || null;
                $scope.ClinicalChecklistParentObj.ChecklistReviewedDate = data.ChecklistReviewedDate || "";

            }, function (cancel) {

            });
        };

        $scope.CheckListInd = false;
        $scope.GetChecklistDeatilsdata = function (str) {
            $scope.TempOrgASCChecklistLogs = [];
            var param = {
                "AppointmentId": $scope.cacheStorageItem.AppointmentId
            }


            eHnoteSurgeryService.GetPreAdmissionChecklistDetails(param.AppointmentId).then(function (resp) {

                console.log(resp);
                if (resp.data.status === "Success") {
                    if (str == 'unsign') {
                        $scope.CheckListInd = false;
                    }
                    else {
                        $scope.CheckListInd = true;
                    }
                    $scope.ClinicalChecklistParentObj.SurgeryList = angular.copy(resp.data.SurgeryArray);
                    $scope.ClinicalChecklistParentObj.LastSignOffUserDetails = angular.copy(resp.data.LastSignOffUserDetails) || [];
                    angular.forEach(resp.data.rows, function (hitem) {
                        angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (item) {
                            if (hitem.CheckListCategoryId === item.CheckListCategoryId && hitem.CheckListId === item.CheckListId) {
                                angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                                    if (hitem.CheckListId == kitem.CheckListId) {
                                        kitem.PatientAscCheckListDetailId = hitem.PatientAscCheckListDetailId || 0;
                                        if (kitem.Value == hitem.Value) {
                                            kitem.IsChecked = true;
                                            item.Value = kitem.Value || '';
                                        }
                                    }
                                });
                                item.ChecklistDate = $filter('date')(hitem.ChecklistDate, "MM-dd-yyyy") || null;

                                if (item.CheckListCategoryId === 1) {
                                    if (item.Value == "N/A" || item.Value == "No" || item.Value == "Not") {
                                        item.ChecklistDate = null;
                                    }
                                }
                                item.Remarks = hitem.Remarks || "";

                                if (item.Remarks != "") {
                                    item.ShowNotesInd = true;
                                }
                                if (item.ChecklistDate != "") {
                                    item.IsChecked = true;
                                }
                            }

                        });
                    });
                    $scope.TempOrgASCChecklistLogs = resp.data.rows || [];
                    angular.forEach($scope.TempOrgASCChecklistLogs, function (kitem) {
                        kitem.Remarks = kitem.Remarks || "";
                        kitem.ChecklistDate = $filter("date")(kitem.ChecklistDate, "MM-dd-yyyy") || null;

                    });
                    $scope.ClinicalChecklistParentObj.CheckListChartStatus = resp.data.CheckListChartStatus || '';
                    $scope.ClinicalChecklistParentObj.CheckListRemarks = resp.data.CheckListRemarks || "";
                    $scope.LogObj.CheckListRemarks = resp.data.CheckListRemarks || "";
                    if ($scope.ClinicalChecklistParentObj.CheckListRemarks != '') {
                        $scope.ClinicalChecklistParentObj.AdmissionRemarksInd = true;
                    } else {
                        $scope.ClinicalChecklistParentObj.AdmissionRemarksInd = false;
                    }
                    if (resp.data.PreAdmissionChecklistDocuments.length > 0) {
                        $scope.ChecklistFilesObj.SaveTempImagesArray = resp.data.PreAdmissionChecklistDocuments || [];
                        $scope.ChecklistFilesObj.TempImagesArray = [];
                    }
                    $scope.ClinicalChecklistParentObj.ChecklistReviewedBy = resp.data.ChecklistReviewedBy || null;
                    $scope.LogObj.ReviewedBy = resp.data.ChecklistReviewedBy || 0;
                    if ($scope.ClinicalChecklistParentObj.ChecklistReviewedBy != null) {
                        var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.ClinicalChecklistParentObj.ChecklistReviewedBy }, true);
                        if (TempFilter.length > 0) {
                            $scope.ClinicalChecklistParentObj.NurseReviewedByName = angular.copy(TempFilter[0].FullName);


                            var SuffixName = '';
                            TempFilter[0].SuffixName = TempFilter[0].SuffixName || '';
                            if (TempFilter[0].SuffixName != "") {
                                SuffixName = TempFilter[0].FullName + ' ' + TempFilter[0].SuffixName + ',';
                            } else {
                                SuffixName = TempFilter[0].FullName + ',';
                            }

                            var LicenseNumber = "";

                            TempFilter[0].LicenseNumber = TempFilter[0].LicenseNumber || "";
                            if (TempFilter[0].LicenseNumber != "") {
                                LicenseNumber = 'Lic:' + ' ' + TempFilter[0].LicenseNumber + ',';
                            }



                            $scope.ClinicalChecklistParentObj.ChecklistReviewedByName = angular.copy(SuffixName + ' ' + LicenseNumber);


                        }
                        else {
                            $scope.ClinicalChecklistParentObj.ChecklistReviewedByName = null;
                        }
                    }



                    if (resp.data.ChecklistReviewedDate != '' && resp.data.ChecklistReviewedTime != "") {
                        $scope.ClinicalChecklistParentObj.ChecklistReviewedDate = resp.data.ChecklistReviewedDate + 'T' + resp.data.ChecklistReviewedTime;
                    }



                    $scope.ClinicalChecklistParentObj.ChecklistReviewedDate = $filter('date')($scope.ClinicalChecklistParentObj.ChecklistReviewedDate, 'MM-dd-yyyy hh:mm a') || "";

                }


                $scope.ChecklistObject = {
                    "CheckListRemarks": $scope.ClinicalChecklistParentObj.CheckListRemarks || '',
                    "Documents": $scope.ChecklistFilesObj.SaveTempImagesArray || [],
                    "Checklist": $scope.ClinicalChecklistParentObj.ClinicalChecklist || [],
                    "ChecklistReviewedByName": $scope.ClinicalChecklistParentObj.ChecklistReviewedByName || null,
                    "ChecklistReviewedDate": $scope.ClinicalChecklistParentObj.ChecklistReviewedDate || ""
                }

                $uibModalInstance.close($scope.ChecklistObject);
            });
        }
        $scope.LogObj = {
            "UserId": $scope.UserId || null,
            "OrganizationId": $scope.HospitalId || null,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            "LogArray": [],
            "ReviewedBy": 0,
            "CheckListRemarks":'',

        }
        $scope.findDifferences = function (savedArray, editedArray) {
            var differences = [];
            /* var maxLength = Math.max(arr1.length, arr2.length);*/

            angular.forEach(savedArray, function (item) {
                item.ChecklistDate = item.ChecklistDate || null;
                item.Remarks = item.Remarks || '';
                var edited = editedArray.filter(function (eitem) {
                    eitem.ChecklistDate = eitem.ChecklistDate || null;
                    eitem.Remarks = eitem.Remarks || '';
                    return ((eitem.CheckListCategoryId == item.CheckListCategoryId) && (item.CheckListId == eitem.CheckListId) && (item.Value == eitem.Value) && (item.Remarks == eitem.Remarks) && (item.ChecklistDate == eitem.ChecklistDate));
                }) || [];


                if (edited.length == 0) {
                    //differences.push({
                    //    CheckListCategoryId: item.CheckListCategoryId,
                    //    CheckListId: item.CheckListId,
                    //    savedValue: item.Value,
                    //});
                    differences.push(item);
                    
                    /*count++;*/
                }

            });

            return differences;
        };
       
        $scope.SaveClinicalChecklistData = function (str) {
            $scope.LogObj.LogArray = [];
            $scope.Isreview = false;         
            let ClinicalChecklist = [];
            angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (item) {
                let checkedvaluearray = $filter('filter')(item.OrganizationCheckListDetails, { "IsChecked": true }, true);
                let checkedvalue;
                if (checkedvaluearray.length > 0) {
                    checkedvalue = checkedvaluearray[0];
                }
                if (checkedvalue !== undefined) {
                    if (checkedvalue.CheckListId === item.CheckListId) {
                        let obj = {
                            "PatientAscCheckListDetailId": checkedvalue.PatientAscCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "ChecklistDate": item.ChecklistDate,
                            "Remarks": item.Remarks,
                            "DeleteInd": "N",
                            "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                            "Value": (checkedvalue != undefined) ? checkedvalue.Value : ""
                        };
                        ClinicalChecklist.push(obj);
                    }
                }

            });


            //if ($scope.TempOrgASCChecklistLogs.length > 0) {

            //    //$scope.TempOrgASCChecklistLogs
            //    //OrgASCChecklist
            //    $scope.differences = $scope.findDifferences(ClinicalChecklist, $scope.TempOrgASCChecklistLogs) || [];
            //    if ($scope.differences.length > 0) {

            //        let ClinicalChecklist = $filter("filter")($scope.differences, { "CheckListCategoryId": 1 }, true) || [];

            //        if (ClinicalChecklist.length > 0) {
            //            let obj = {
            //                "LogId": 0,
            //                "ModuleId": 3,
            //                "ModuleName": "Pre Admission",
            //                "SubModuleId": 33,
            //                "SubModuleName": "Pre-Admission(Nurse)",
            //                "ScreenType": "ClinicalChecklist",
            //                "ActionType": "Edited",
            //                "ActionDescription": `Clinical Checklist in Pre-Admission(Nurse) For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
            //                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //            };
            //            $scope.LogObj.LogArray.push(obj);
            //        }

            //    }
            //}
            //else {

            //    let sClinicalChecklist = $filter("filter")(ClinicalChecklist, { "CheckListCategoryId": 1 }, true) || [];

            //    if (sClinicalChecklist.length > 0) {
            //        let obj = {
            //            "LogId": 0,
            //            "ModuleId": 3,
            //            "ModuleName": "Pre Admission",
            //            "SubModuleId": 33,
            //            "SubModuleName": "Pre-Admission(Nurse)",
            //            "ScreenType": "ClinicalChecklist",
            //            "ActionType": "Added",
            //            "ActionDescription": `Clinical Checklist in Pre-Admission(Nurse)  For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
            //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //        };
            //        $scope.LogObj.LogArray.push(obj);
            //    }

            //}

          
            let editClinicalChecklist = [];

            ClinicalChecklist = $filter("filter")(ClinicalChecklist, function (item) {
                return (item.CheckListCategoryId == 1 && item.CheckListSubTypeId == 1) && item.CheckListId !== 170 && item.CheckListId !== 168 && item.CheckListId !== 169;
            }) || [];


            //editClinicalChecklist = $filter("filter")($scope.TempOrgASCChecklistLogs, { "CheckListCategoryId": 1 }, true) || [];
            editClinicalChecklist = $filter("filter")($scope.TempOrgASCChecklistLogs, function (item) {
                return item.CheckListCategoryId == 1 && item.CheckListId !== 170 && item.CheckListId !== 168 && item.CheckListId !== 169;
            }) || [];
            var IsUserAlreadyAddedCCList = $filter("filter")(editClinicalChecklist, { "CreatedBy": $scope.UserId }, true) || [];
            if (editClinicalChecklist.length > 0) {
                $scope.differences = $scope.findDifferences(ClinicalChecklist, editClinicalChecklist) || [];
                if ($scope.differences.length > 0) {
                    var Affecteditem = '';
                    var OldAffecteditem = '';
                    angular.forEach($scope.differences, function (itemA) {
                        if (Affecteditem !== '') {
                            Affecteditem += ', '; 
                        }
                        //Affecteditem += `${itemA.CheckListName}: ${itemA.savedValue}`;
                        let checklistDatePart = itemA.ChecklistDate ? `: ${itemA.ChecklistDate}` : '';

                        if (itemA.Remarks && itemA.Remarks.trim() !== '') {
                            Affecteditem += `${itemA.CheckListName}${itemA.Value ? ': ' + itemA.Value : ''}${`: Notes: ${itemA.Remarks.trim()}`}${checklistDatePart}`;
                        } else {
                            Affecteditem += `${itemA.CheckListName}${itemA.Value ? ': ' + itemA.Value : ''}${checklistDatePart}`;
                        }

                        angular.forEach(editClinicalChecklist, function (itemB) {
                            if (itemA.CheckListId === itemB.CheckListId) {
                                if (OldAffecteditem !== '') {
                                    OldAffecteditem += ', ';
                                }
                                //OldAffecteditem += `${itemB.CheckListName}: ${itemB.Value}`;
                                let checklistDatePart = itemB.ChecklistDate ? `: ${itemB.ChecklistDate}` : '';

                                if (itemB.Remarks && itemB.Remarks.trim() !== '') {
                                    OldAffecteditem += `${itemB.CheckListName}${itemB.Value ? ': ' + itemB.Value : ''}${`: Notes: ${itemB.Remarks.trim()}`}${checklistDatePart}`;
                                } else {
                                    OldAffecteditem += `${itemB.CheckListName}${itemB.Value ? ': ' + itemB.Value : ''}${checklistDatePart}`;
                                }
                            }
                        });
                    });

                    var ActionType = "Edited";
                    if (IsUserAlreadyAddedCCList.length === 0 && OldAffecteditem === '') {
                        ActionType = "Added";
                    }

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 33,
                        "SubModuleName": "Pre-Admission(Nurse)",
                        "ScreenType": "ClinicalChecklist",
                        "ActionType": ActionType,
                        /*"ActionDescription": `Clinical Checklist in Pre-Admission(Nurse) For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,*/
                        "OldActionDescription": OldAffecteditem,
                        "NewActionDescription": Affecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            else if (ClinicalChecklist.length > 0) {
                var Affecteditem = '';
                angular.forEach(ClinicalChecklist, function (itemA) {
                    if (itemA.PatientAscCheckListDetailId === 0) {
                        if (Affecteditem !== '') {
                            Affecteditem += ', ';
                        }
                        let checklistDatePart = itemA.ChecklistDate ? `: ${itemA.ChecklistDate}` : '';

                        if (itemA.Remarks && itemA.Remarks.trim() !== '') {
                            Affecteditem += `${itemA.CheckListName}${itemA.Value ? ': ' + itemA.Value : ''}${`: Notes: ${itemA.Remarks.trim()}`}${checklistDatePart}`;
                        } else {
                            Affecteditem += `${itemA.CheckListName}${itemA.Value ? ': ' + itemA.Value : ''}${checklistDatePart}`;
                        }
                    }
                });
                if (Affecteditem != '') {
                    let obj = {                                                                                                                                                                                                                                                                                                   
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 33,
                        "SubModuleName": "Pre-Admission(Nurse)",
                        "ScreenType": "ClinicalChecklist",
                        "ActionType": "Added",
                        /* "ActionDescription": `Clinical Checklist in Pre-Admission(Nurse)  For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,*/
                        "OldActionDescription": '',
                        "NewActionDescription": Affecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }

            }
            var ReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            $scope.ClinicalChecklistParentObj.CheckListChartStatus = $scope.ClinicalChecklistParentObj.CheckListChartStatus || '';
            if ($scope.ClinicalChecklistParentObj.CheckListChartStatus == '') {
                $scope.ClinicalChecklistParentObj.CheckListChartStatus = "D";
            }

            var sCurrentDate = $filter('date')(new Date(), "yyyy-MM-dd");
            let req = {
                "VisitId": $scope.cacheStorageItem.PatientVisitId,

                //"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "UserId": $scope.UserId || null,
                "HospitalId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "AppointmentDate": $scope.cacheStorageItem.AppointmentDt || sCurrentDate,
                "ClinicalChecklist": ClinicalChecklist || [],
                "Remarks": $scope.ClinicalChecklistParentObj.CheckListRemarks,
                "TempDocumentDetails": [],
                "DocumentDetails": [],
                "ChecklistReviewedBy": $scope.ClinicalChecklistParentObj.ChecklistReviewedBy || null,
                "ChecklistReviewedDate": ReviewedDate || "",
                "CheckListChartStatus": (str === "SignOff") ? "E" : $scope.ClinicalChecklistParentObj.CheckListChartStatus,
            };
            let sighnoffforlogs = str || '';
            if (sighnoffforlogs == 'SignOff') {

                //Signoff: Pre - op Nurse signed off by Geisha Mojica for Appointment ID: 690632
                //Unsigned: Pre - op Nurse unsigned by Geisha Mojica for Appointment ID: 690632
                let givenByUser = '';
                if ($scope.PreAdmSignOffUserId != 0) {
                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreAdmSignOffUserId });
                    if (ReviewedByArraylist.length > 0) {
                        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                    }


                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 33,
                        "SubModuleName": "Pre-Admission(Nurse)",
                        "ScreenType": "Signed off",
                        "ActionType": "Signed off",
                        "OldActionDescription": '',
                        "NewActionDescription":`Pre-Admission(Nurse) signed off by ${givenByUser}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            /* let sighnoffforlogs = str || '';*/
            if (sighnoffforlogs == 'Unsign') {

                //Signoff: Pre - op Nurse signed off by Geisha Mojica for Appointment ID: 690632
                //Unsigned: Pre - op Nurse unsigned by Geisha Mojica for Appointment ID: 690632
                let givenByUser = '';
                if ($scope.UserId != 0) {
                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.UserId });
                    if (ReviewedByArraylist.length > 0) {
                        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) + " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber)
                    }
                }

                let obj = {
                    "LogId": 0,
                    "ModuleId": 3,
                    "ModuleName": "Pre Admission",
                    "SubModuleId": 33,
                    "SubModuleName": "Pre-Admission(Nurse)",
                    "ScreenType": "Unsign",
                    "ActionType": "unsigned",
                    "ActionDescription": `Pre-Admission(Nurse)  by ${givenByUser}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
            $scope.ChecklistFilesObj.TempImagesArray = $scope.ChecklistFilesObj.TempImagesArray || [];
            if ($scope.ChecklistFilesObj.TempImagesArray.length > 0) {
                angular.forEach($scope.ChecklistFilesObj.TempImagesArray, function (item) {
                    item.DocumentID = item.DocumentID || 0;
                    var object = {
                        "file": item.file,
                        "S3URL": item.S3URL || '',
                        "DeleteInd": item.DeleteInd,
                        "DocumentID": item.DocumentID,
                        "DocumentName": item.DocumentName,
                        "FileName": item.FileName,
                        "FileExt": item.FileExt,
                        "FileTypeId": item.FileTypeId,
                        "DisplayName": item.DisplayName,
                    };
                    if (item.DocumentID === 0) {
                        req.TempDocumentDetails.push(object);
                        req.DocumentDetails.push(object);
                    }
                    else {
                        req.DocumentDetails.push(object);
                    }
                });
                if (req.DocumentDetails.length > 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 33,
                        "SubModuleName": "Pre-Admission(Nurse)",
                        "ScreenType": "Files",
                        "ActionType": "Imported",
                        "NewActionDescription": req.DocumentDetails[0].DisplayName + "Uploaded files in Pre-Admission(Nurse)",
                        "OldActionDescription": '',
                        /*"ActionDescription": `Files in Pre-Admission(Nurse) For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,*/
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            $scope.ClinicalChecklistParentObj.ChecklistReviewedBy = $scope.ClinicalChecklistParentObj.ChecklistReviewedBy || 0;

            if ($scope.ClinicalChecklistParentObj.ChecklistReviewedBy != $scope.LogObj.ReviewedBy) {
                let ActionType = '';
                if ($scope.LogObj.ReviewedBy == 0 && $scope.ClinicalChecklistParentObj.ChecklistReviewedBy != 0) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }
                let givenByUser = '';
                if ($scope.ClinicalChecklistParentObj.ChecklistReviewedBy != 0) {
                    var ReviewedByArraylist = $filter("filter")(
                        $scope.allUserList,
                        function (item) { return item.DoctorID == $scope.ClinicalChecklistParentObj.ChecklistReviewedBy }
                    );
                    if (ReviewedByArraylist.length > 0) {
                        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                    }
                }
                let ActionDescription = givenByUser
                    ? `Reviewed by ${givenByUser} In Pre-Admission(Nurse)`
                    : ``;


                let OldAffecteditem = '';

                if ($scope.LogObj.ReviewedBy) {
                    let OldDescription = $filter("filter")(
                        $scope.allUserList,
                        function (item) { return item.DoctorID == $scope.LogObj.ReviewedBy }
                    );

                    if (OldDescription.length > 0) {
                        let OldActionDescription = angular.copy(OldDescription[0].SecondUserFullName) +
                            (OldDescription[0].LicenseNumber ? " Lic:" + angular.copy(OldDescription[0].LicenseNumber) : "");

                        OldAffecteditem = `Reviewed by  ${OldActionDescription} In  Pre-Admission(Nurse)`;
                    }
                }

                let obj = {
                    "LogId": 0,
                    "ModuleId": 3,
                    "ModuleName": "Pre Admission",
                    "SubModuleId": 33,
                    "SubModuleName": "Pre-Admission(Nurse)",
                    "ScreenType": "ReviewedBy",
                    "ActionType": ActionType,
                    "OldActionDescription": OldAffecteditem,
                    "NewActionDescription": ActionDescription,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }

            $scope.ClinicalChecklistParentObj.CheckListRemarks = $scope.ClinicalChecklistParentObj.CheckListRemarks || '';
            if ($scope.ClinicalChecklistParentObj.CheckListRemarks != '' || $scope.LogObj.CheckListRemarks != '') {
                let Affecteditem = "", OldAffecteditem = "";
                if ($scope.ClinicalChecklistParentObj.CheckListRemarks != '') {
                    Affecteditem = "\nPre-Admission(Nurse) Notes: " + $scope.ClinicalChecklistParentObj.CheckListRemarks;
                } else {
                    Affecteditem = " ";
                }
                if ($scope.LogObj.CheckListRemarks != '') {
                    OldAffecteditem = "\nPre-Admission(Nurse) Notes: " + $scope.LogObj.CheckListRemarks;
                }

                let ActionType = '';
                if ($scope.LogObj.CheckListRemarks == '' && $scope.ClinicalChecklistParentObj.CheckListRemarks != '') {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.ClinicalChecklistParentObj.CheckListRemarks !== $scope.LogObj.CheckListRemarks) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 33,
                        "SubModuleName": "Pre-Admission(Nurse)",
                        "ScreenType": "Notes",
                        "ActionType": ActionType,
                        /*"ActionDescription": ActionDescription,*/
                        "OldActionDescription": OldAffecteditem,
                        "NewActionDescription": Affecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            if ($scope.LogObj.LogArray.length > 0) {
                req.Logs = $scope.LogObj || {};
            }
            console.log(JSON.stringify(req));
            $scope.ClinicalChecklistParentObj.IsClickSaveClinicalChecklistBtn = true;
            eHnoteSurgeryService.AddUpdatePreAdmChecklistDetails(req, callbackSuccess, callbackError);
            function callbackSuccess(response) {
                if (response.Status === "Success") {
                    alertify.success("Checklist Submitted Successfully!");
                    $scope.ClinicalChecklistParentObj.IsClickSaveClinicalChecklistBtn = false;
                    // $scope.ClinicalChecklistParentObj.IsShowAddScreen = false;
                    $scope.GetChecklistDeatilsdata();
                } else {
                    $scope.ClinicalChecklistParentObj.IsClickSaveClinicalChecklistBtn = false;
                    alertify.error("Some Error Occurred");
                }

            };
            function callbackError(err) {
                $scope.ClinicalChecklistParentObj.IsClickSaveClinicalChecklistBtn = false;
                alertify.error("Uploading Failed");
            }

        };


        $scope.OnSelectChecklistTemplate = function (obj, val) {
            obj = obj || null;
            if (obj === null) {
                return;
            }
            if (val == 1) {
                $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked = '';
            }
            angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (item) {
                if (item.CheckListCategoryId === val) {
                    item.ChecklistDate = null;
                    item.Remarks = "";
                    angular.forEach(item.OrganizationCheckListDetails, function (hitem) {
                        hitem.IsChecked = false;
                    });
                }
            });
            if (obj.TemplateDetails.length === 0) {
                angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (item) {
                    if (item.CheckListCategoryId === val) {
                        angular.forEach(item.OrganizationCheckListDetails, function (hitem) {
                            if (hitem.Value == "No" || hitem.Value == "Not") {
                                hitem.IsChecked = true;
                                item.Value = hitem.Value || '';
                            } else {
                                hitem.IsChecked = false;
                                item.Value = hitem.Value || '';
                            }
                        });
                    }
                });
            } else {
                angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (item) {
                    item.IsChecked = false;
                    item.ShowNotesInd = false;
                    if (item.CheckListCategoryId === val) {
                        angular.forEach(obj.TemplateDetails, function (kitem) {
                            if (kitem.OrganizationPreOpCheckListId == item.OrganizationPreOpCheckListId) {
                                angular.forEach(item.OrganizationCheckListDetails, function (hitem) {
                                    if ((hitem.Value == "Yes" || hitem.Value == "Done" || hitem.Value == "Reviewed") && hitem.OrganizationPreOpCheckListValueId == kitem.OrganizationPreOpCheckListValueId) {
                                        hitem.IsChecked = true;
                                        item.IsChecked = true;
                                        item.ChecklistDate = $filter("date")(new Date(), "MM-dd-yyyy") || null;
                                        item.Value = hitem.Value || '';
                                    } else if ((hitem.Value == "No" || hitem.Value == "Not" || hitem.Value == "N/A") && hitem.OrganizationPreOpCheckListValueId == kitem.OrganizationPreOpCheckListValueId) {
                                        hitem.IsChecked = true;
                                        item.IsChecked = true;
                                        item.Value = hitem.Value || '';
                                        //    item.ChecklistDate = $filter("date")(new Date(), "MM-dd-yyyy") || null;
                                    } else if ((hitem.Value == "X1" || hitem.Value == "X2" || hitem.Value == "X3") && hitem.OrganizationPreOpCheckListValueId == kitem.OrganizationPreOpCheckListValueId) {
                                        hitem.IsChecked = true;
                                        item.IsChecked = true;
                                        item.Value = hitem.Value || '';
                                        item.ChecklistDate = null;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        };


        $scope.OnSelectAllClinicalChecklist = function (val) {
            if (val === 'Yes') {
                $scope.ClinicalChecklistParentObj.SelectedClinicalChecklistTemplate = 'Select Template'
                $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked = 'Yes';
                angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (item) {
                    item.ShowNotesInd = false;
                    item.Remarks = "";

                    item.ChecklistDate = null;
                    if (item.CheckListCategoryId === 1) {
                        angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                            if (kitem.Value === "Yes" || kitem.Value === "Done" || kitem.Value === "Reviewed") {
                                kitem.IsChecked = true;
                                item.IsChecked = true;
                                item.Value = kitem.Value || '';
                                item.ChecklistDate = $filter("date")(new Date(), "MM-dd-yyyy") || null;
                            } else {
                                kitem.IsChecked = false;
                            }
                        });
                    }
                });
            }
            if (val === 'No') {
                $scope.ClinicalChecklistParentObj.SelectedClinicalChecklistTemplate = 'Select Template'
                $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked = 'No';
                angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (item) {
                    item.ShowNotesInd = false;
                    item.Remarks = "";

                    item.ChecklistDate = null;
                    if (item.CheckListCategoryId === 1) {
                        angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                            if (kitem.Value === "No" || kitem.Value === "Not") {
                                kitem.IsChecked = true;
                                item.IsChecked = true;
                                item.Value = kitem.Value || '';
                                /*item.ChecklistDate = $filter("date")(new Date(), "MM-dd-yyyy") || null;*/
                            } else {
                                kitem.IsChecked = false;
                            }
                        });
                    }
                });
            }
            if (val === 'NA') {
                $scope.ClinicalChecklistParentObj.SelectedClinicalChecklistTemplate = 'Select Template'
                $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked = 'NA';
                angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (item) {
                    item.ShowNotesInd = false;
                    item.Remarks = "";

                    item.ChecklistDate = null;
                    if (item.CheckListCategoryId === 1) {
                        angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                            if (kitem.Value === "N/A") {
                                kitem.IsChecked = true;
                                item.IsChecked = true;
                                item.Value = kitem.Value || '';
                                /*item.ChecklistDate = $filter("date")(new Date(), "MM-dd-yyyy") || null;*/
                            } else {
                                kitem.IsChecked = false;
                            }
                        });
                    }
                });
            }
        };


        $scope.OnChecklistSelect = function (obj, parentobj) {
            angular.forEach(parentobj.OrganizationCheckListDetails, function (item) {
                item.IsChecked = false;
            })
            obj.IsChecked = true;
            parentobj.IsChecked = true;
            parentobj.Value = obj.Value || '';
            parentobj.ChecklistDate = null;
            if (obj.Value !== "N/A" && obj.Value !== "No" && obj.Value !== "Not") {
                parentobj.ChecklistDate = $filter('date')(new Date(), "MM-dd-yyyy");
            }
            if (parentobj.CheckListCategoryId === 1) {
                if (obj.Value == "Yes") {
                    $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked = $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked == 'Yes' ? $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked : '';
                }
                if (obj.Value == "No") {
                    $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked = $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked == 'No' ? $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked : '';
                }
                if (obj.Value == "N/A") {
                    $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked = $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked == 'NA' ? $scope.ClinicalChecklistParentObj.IsAllClinicalCheckListChecked : '';
                }
            }
        };

        $scope.GetClinicalCheckListTemplates = function () {
            let req = {
                // "ParentOrganizationId": $scope.ParentHospitalId,
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "CheckListCategoryId": 1
            };
            eHnoteSurgeryService.GetPreOpCheckListTemplates(req).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.ClinicalChecklistParentObj.ClinicalChecklistTemplates = angular.copy(resp.data.rows);
                }

            }, function (err) {
                console.log(err);
            });
        };
       
        $scope.OnChecklistSummaryScreenLoad = function (ComingFrom) {
            $scope.TempOrgASCChecklistLogs = [];
            let Object = {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "CheckListModuleId": 1
            };

            let CheckObj = {
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            };

            let checkobj2 = {
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "CheckListCategoryId": 1

            };

            $q.all([
                eHnoteSurgeryService.GetOrganizationASCCheckListData(Object),
                eHnoteSurgeryService.GetPreAdmissionChecklistDetails(CheckObj.AppointmentId),
                eHnoteSurgeryService.GetPreOpCheckListTemplates(checkobj2)
            ]).then(function (resp) {

                if (resp[0].data.status === "Success") {
                    let tempChecklistsArray = $filter('filter')(resp[0].data.rows, { 'CheckListCategoryId': 1, 'CheckListSubTypeId': 1 }, true);
                    if (tempChecklistsArray.length>0) {
                        angular.forEach(tempChecklistsArray, function (item) {
                            angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                                kitem.IsChecked = false;
                            });
                            item.ChecklistDate = null;
                            item.Remarks = "";
                        });
                        $scope.ClinicalChecklistParentObj.ClinicalChecklist = angular.copy(tempChecklistsArray);
                    }
              
                   
                }


                if (resp[1].data.status === "Success") {

                    $scope.ClinicalChecklistParentObj.SurgeryList = angular.copy(resp[1].data.SurgeryArray) || [];
                    $scope.ClinicalChecklistParentObj.LastSignOffUserDetails = angular.copy(resp[1].data.LastSignOffUserDetails) || [];
                    angular.forEach(resp[1].data.rows, function (hitem) {
                        angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (item) {
                            if (hitem.CheckListCategoryId === item.CheckListCategoryId && hitem.CheckListId === item.CheckListId) {
                                angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                                    if (hitem.CheckListId == kitem.CheckListId) {
                                        kitem.PatientAscCheckListDetailId = hitem.PatientAscCheckListDetailId || 0;
                                        if (kitem.Value == hitem.Value) {
                                            kitem.IsChecked = true;
                                            item.Value = kitem.Value || '';
                                        }
                                    }
                                });
                                item.ChecklistDate = $filter('date')(hitem.ChecklistDate, "MM-dd-yyyy") || null;

                                if (item.CheckListCategoryId === 1) {
                                    if (item.Value == "N/A" || item.Value == "No" || item.Value == "Not") {
                                        item.ChecklistDate = null;
                                    }
                                }
                                item.Remarks = hitem.Remarks || "";

                                if (item.Remarks != "") {
                                    item.ShowNotesInd = true;
                                }
                                if (item.ChecklistDate != "") {
                                    item.IsChecked = true;
                                }
                            }

                        });
                    });
                    $scope.TempOrgASCChecklistLogs = resp[1].data.rows || [];
                    angular.forEach($scope.TempOrgASCChecklistLogs, function (kitem) {
                        kitem.Remarks = kitem.Remarks || "";
                        kitem.ChecklistDate = $filter("date")(kitem.ChecklistDate, "MM-dd-yyyy") || null;

                    });

                    $scope.ClinicalChecklistParentObj.CheckListRemarks = resp[1].data.CheckListRemarks || "";
                    $scope.LogObj.CheckListRemarks = resp[1].data.CheckListRemarks || "";
                    if ($scope.ClinicalChecklistParentObj.CheckListRemarks != '') {
                        $scope.ClinicalChecklistParentObj.AdmissionRemarksInd = true;
                    } else {
                        $scope.ClinicalChecklistParentObj.AdmissionRemarksInd = false;
                    }

                    if (resp[1].data.PreAdmissionChecklistDocuments.length > 0) {
                        $scope.ChecklistFilesObj.SaveTempImagesArray = resp[1].data.PreAdmissionChecklistDocuments || [];
                    }/* else {
                        $scope.ClinicalChecklistParentObj.SaveTempImagesArray = $scope.ClinicalChecklistParentObj.PreAdmissionChecklistDocuments || [];
                    }*/
                    $scope.ClinicalChecklistParentObj.ChecklistReviewedBy = resp[1].data.ChecklistReviewedBy || 0;
                    $scope.LogObj.ReviewedBy = resp[1].data.ChecklistReviewedBy || 0;
                    if ($scope.ClinicalChecklistParentObj.ChecklistReviewedBy != 0) {
                        var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.ClinicalChecklistParentObj.ChecklistReviewedBy }, true);
                        if (TempFilter.length > 0) {
                            $scope.ClinicalChecklistParentObj.NurseReviewedByName = angular.copy(TempFilter[0].FullName);


                            var SuffixName = '';
                            TempFilter[0].SuffixName = TempFilter[0].SuffixName || '';
                            if (TempFilter[0].SuffixName != "") {
                                SuffixName = TempFilter[0].FullName + ' ' + TempFilter[0].SuffixName + ',';
                            } else {
                                SuffixName = TempFilter[0].FullName + ',';
                            }

                            var LicenseNumber = "";

                            TempFilter[0].LicenseNumber = TempFilter[0].LicenseNumber || "";
                            if (TempFilter[0].LicenseNumber != "") {
                                LicenseNumber = 'Lic:' + ' ' + TempFilter[0].LicenseNumber +',';
                            }



                            $scope.ClinicalChecklistParentObj.ChecklistReviewedByName = angular.copy(SuffixName + ' ' + LicenseNumber);
                        }
                        else {
                            $scope.ClinicalChecklistParentObj.ChecklistReviewedByName = null;
                        }
                    }

                    resp[1].data.ChecklistReviewedDate = resp[1].data.ChecklistReviewedDate || '';
                    resp[1].data.ChecklistReviewedTime = resp[1].data.ChecklistReviewedTime || '';

                    if (resp[1].data.ChecklistReviewedDate != '' && resp[1].data.ChecklistReviewedTime != "") {
                        $scope.ClinicalChecklistParentObj.ChecklistReviewedDate = resp[1].data.ChecklistReviewedDate + 'T' + resp[1].data.ChecklistReviewedTime;
                    }

                    $scope.ClinicalChecklistParentObj.CheckListChartStatus = resp[1].data.CheckListChartStatus || '';


                    $scope.ClinicalChecklistParentObj.ChecklistReviewedDate = $filter('date')($scope.ClinicalChecklistParentObj.ChecklistReviewedDate, 'MM-dd-yyyy hh:mm a') || "";
                }


                if (resp[2].data.status === "Success") {
                    $scope.ClinicalChecklistParentObj.ClinicalChecklistTemplates = angular.copy(resp[2].data.rows);
                }


                if (ComingFrom != 'ComingFromScanner') {
                    if ($scope.ClinicalChecklistParentObj.ClinicalChecklist.length > 0 || $scope.ClinicalChecklistParentObj.CheckListRemarks != ' ' || $scope.ChecklistFilesObj.SaveTempImagesArray.length > 0 || $scope.ClinicalChecklistParentObj.ChecklistReviewedBy != 0) {
                        $scope.CheckListInd = true;
                    }
                    else {
                        $scope.CheckListInd = false;
                    }
                }

            });



        };
        $scope.OnChecklistSummaryScreenLoad();


        $scope.GetOrganizationASCCheckListData = function () {

            let Object = {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "CheckListModuleId": 1
            };            
            eHnoteSurgeryService.GetOrganizationASCCheckListData(Object).then(function (resp) {
                    if (resp.data.status === "Success") {
                        let tempChecklistsArray = $filter('filter')(resp.data.rows, { 'CheckListCategoryId': 1, 'CheckListSubTypeId': 1 }, true);
                        if (tempChecklistsArray.length > 0) {
                            angular.forEach(tempChecklistsArray, function (item) {
                                angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                                    kitem.IsChecked = false;
                                });
                                item.ChecklistDate = null;
                                item.Remarks = "";
                            });
                            $scope.ClinicalChecklistParentObj.ClinicalChecklist = angular.copy(tempChecklistsArray);
                        }
                    }
                   
                }, function (err) {
                    console.log(err);
                });
        }




        $scope.IsOpenCheckListTemp = function () {
            $scope.IsOpenCheckList = true;
        }



        $scope.TempObj =
        {
            "ChecklistTemplateName": ""
        }
        $scope.AddChecklistTemplate = function (val) {

            if ($scope.TempObj.ChecklistTemplateName === "") {
                alertify.error("Please enter template name!");
                return false;
            } else {
                let templateReq = {
                    "UserId": $scope.UserId,
                    "HospitalId": $scope.HospitalId,
                    "UserPreOpCheckListTemplateId": 0,
                    "TemplateName": $scope.TempObj.ChecklistTemplateName,
                    "CheckListCategoryId": val,
                    "DeleteInd": "N",
                    "TemplateDetails": [],
                    "RoleId": $scope.RoleId
                };
                let ConcernedChecklistArray = $filter('filter')($scope.ClinicalChecklistParentObj.ClinicalChecklist, { 'CheckListCategoryId': templateReq.CheckListCategoryId }, true);
                angular.forEach(ConcernedChecklistArray, function (item) {
                    angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                        if (kitem.IsChecked) {
                            let obj = {
                                "UserPreOpCheckListTemplateDetailId": 0,
                                "UserPreOpCheckListTemplateId": 0,
                                "CheckListId": item.CheckListId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "OrganizationPreOpCheckListValueId": kitem.OrganizationPreOpCheckListValueId,
                                "DeleteInd": "N"
                            };
                            templateReq.TemplateDetails.push(obj);
                        }
                    });
                });
                /*console.log(templateReq);*/
                if (templateReq.TemplateDetails.length == 0) {
                    alertify.error("Please Add atleast One Check list!");
                    return false;

                }
                eHnoteSurgeryService.AddUpdatePreOpCheckListTemplates(templateReq).then(function (resp) {
                    if (resp.data.status === "Success") {
                        alertify.success("Template saved successfully!");
                        $scope.GetClinicalCheckListTemplates();
                        $scope.TempObj.ChecklistTemplateName = '';
                        $scope.IsOpenCheckList = false;
                    }
                    if (resp.data.status === "Failure") {
                        alertify.error(resp.data.Message)
                    }
                }, function (err) {
                    console.log(err);
                });

            }

            $scope.FollowUptemplateover = {
                templateUrl: 'ChecklistTemplatSave.html',
            };

        };

        $scope.CheckListDeleteUploadedFileNew = function (item, index, mainitem) {
            $scope.ChecklistFilesObj.TempImagesArray.splice(index, 1);
            //if (item.DocumentID == 0) {
            //    $scope.ChecklistFilesObj.TempImagesArray.splice(index, 1);
            //} else {
            //    $scope.ChecklistFilesObj.TempImagesArray[index].DeleteInd = 'Y';
            //}
        }


        $scope.scanFiles = function (type) {

            let PatientSurgeryId = null;
            if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
                if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                    PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
                }
            }
            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
                    PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
                }
            }

            var obj = {
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientName": $scope.cacheStorageItem.PatientName || '',
                "Tab": "ASCFileUploads",
                "SignedDate": $scope.currentDate,
                "FileTypeId": 29,
                "FileName": '',
                "DisplayName": '',
                "PatientSurgeryId": PatientSurgeryId
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
                "backdrop": "static",
                "scope": $scope,
                "size": "lg",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "windowClass": "modal__eighty--",
                "keyboard": false,
                "controller": "DocumentScannerCtrl",
            });
            $scope.mInstanceAdd.result.then(function (data) {
                console.log(data);
                //$scope.OnChecklistSummaryScreenLoad('ComingFromScanner');
                $scope.GetScanImagesDataAfterScan();

            }, function (cancel) {
            });

        }

        $scope.selectedImgschecklist = function (files) {
            $scope.SelectedFile = 29; //PreAdmission Checklist file upload
            files = files || [];
            if (files.length > 0) {
                angular.forEach(files, function (item) {
                    files = item || [];
                    $scope.file = item;
                    if ($scope.file != null) {

                        var pName = $scope.file.name, name = "";
                        var type = $scope.file.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "file": $scope.file,
                            "S3URL": "",
                            "DeleteInd": 'N',
                            "DocumentID": 0,
                            "DocumentName": $scope.file.name || "",
                            "FileName": $scope.file.name || "",
                            "FileExt": $scope.file.type,
                            "FileTypeId": parseInt($scope.SelectedFile),
                            "DisplayName": $scope.file.name || ""
                        };

                        $scope.ChecklistFilesObj.TempImagesArray.push(obj);


                        angular.element("input[type='file']").val(null);
                    }
                });
            }
        };

        $scope.DeletePreadminClinicalCheckListDocumentGetlist = function (item, index, mainitem) {

            item.DisplayName = item.DisplayName || "";
            if (item.DisplayName == "") {
                item.DisplayName = item.FileName;
            }
            $scope.DeleteFileUploadArray = { "DocumentID": item.DocumentID, "FileName": item.DisplayName, "Remarks": "" };

            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                $scope.LogObj.LogArray = [];
                let obj = {
                    "LogId": 0,
                    "ModuleId": 3,
                    "ModuleName": "Pre Admission",
                    "SubModuleId": 33,
                    "SubModuleName": "Pre-Admission(Nurse)",
                    "ScreenType": "Files",
                    "ActionType": "Deleted",
                    "OldActionDescription": item.DisplayName + 'Delete files in Pre-Admission(Nurse).',
                    "NewActionDescription": '',
                    /*"ActionDescription": `Files in Pre-Admission(Nurse) For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,*/
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
                var params = {
                    "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                    "DeleteIndicator": 0,
                    "ImagesArray": [],
                    "UploadType": "Delete",
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "Remarks": "",
                    "Logs": {},
                };
                if ($scope.LogObj.LogArray.length > 0) {
                    params.Logs = $scope.LogObj || {};
                }
                params.ImagesArray.push($scope.DeleteFileUploadArray);
                eHnoteDiagnosisDataServices.DeleteASCDocumentList(params, onupdateDeletesuccess, onupdateDelerror);
            }, function () { });
            function onupdateDeletesuccess(response) {
                if (response.Status === 'Success') {
                    /*$scope.ChangeTab(12);*/
                    $scope.ChecklistFilesObj.SaveTempImagesArray.splice(index, 1);
                }
            }
            function onupdateDelerror(errordata) {
                console.log(errordata);
            }
        }

        $scope.AddNewChecklist = function (item) {
            angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (citem) {
                citem.IsshowAdd = false;
            });
            if (item.CheckListCategoryId === 1) {
                item.IsshowAdd = true;
            }
        };
        $scope.CloseChecklistData = function (item) {
            $scope.ClinicalChecklistParentObj.NewChecklistName = "";
            item.IsshowAdd = false;
        }

        $scope.AddNewChecklistData = function (item) {
            $scope.LogObj.LogArray = [];
            if ($scope.ClinicalChecklistParentObj.NewChecklistName === "") {
                alertify.error("Please enter checklist name!");
                return false;
            }
            if ($scope.ClinicalChecklistParentObj.ChecklistValueType === "") {
                alertify.error("Please Select Any One Value!");
                return false;
            }
            let tempArray = [];
            if ($scope.ClinicalChecklistParentObj.ChecklistValueType == "1") {
                tempArray = [
                    {
                        "OrganizationPreOpCheckListValueId": 0,
                        "CheckListId": 0,
                        "OrganizationPreOpheckListId": 0,
                        "Value": "Yes",
                        "DeleteInd": "N"
                    },
                    {
                        "OrganizationPreOpCheckListValueId": 0,
                        "CheckListId": 0,
                        "OrganizationPreOpCheckListId": 0,
                        "Value": "No",
                        "DeleteInd": "N"
                    },
                    {
                        "OrganizationPreOpCheckListValueId": 0,
                        "CheckListId": 0,
                        "OrganizationPreOpCheckListId": 0,
                        "Value": "N/A",
                        "DeleteInd": "N"
                    }
                ];
            } else if ($scope.ClinicalChecklistParentObj.ChecklistValueType == "2") {
                tempArray = [
                    {
                        "OrganizationPreOpCheckListValueId": 0,
                        "CheckListId": 0,
                        "OrganizationPreOpCheckListId": 0,
                        "Value": "Done",
                        "DeleteInd": "N"
                    },
                    {
                        "OrganizationPreOpCheckListValueId": 0,
                        "CheckListId": 0,
                        "OrganizationPreOpCheckListId": 0,
                        "Value": "Not",
                        "DeleteInd": "N"
                    },
                    {
                        "OrganizationPreOpCheckListValueId": 0,
                        "CheckListId": 0,
                        "OrganizationPreOpCheckListId": 0,
                        "Value": "N/A",
                        "DeleteInd": "N"
                    }
                ];
            } else if ($scope.ClinicalChecklistParentObj.ChecklistValueType == "3") {
                tempArray = [
                    {
                        "OrganizationPreOpCheckListValueId": 0,
                        "CheckListId": 0,
                        "OrganizationPreOpCheckListId": 0,
                        "Value": "Reviewed",
                        "DeleteInd": "N"
                    },
                    {
                        "OrganizationPreOpCheckListValueId": 0,
                        "CheckListId": 0,
                        "OrganizationPreOpCheckListId": 0,
                        "Value": "Not",
                        "DeleteInd": "N"
                    },
                    {
                        "OrganizationPreOpCheckListValueId": 0,
                        "CheckListId": 0,
                        "OrganizationPreOpCheckListId": 0,
                        "Value": "N/A",
                        "DeleteInd": "N"
                    }
                ];
            }

            let req = {
                "OrganizationPreOpCheckListId": 0,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "UserId": $scope.UserId,
                "CheckListCategoryId": item.CheckListCategoryId,
                "CheckListId": 0,
                "CheckListModuleId": 1,
                "CheckListName": $scope.ClinicalChecklistParentObj.NewChecklistName,
                "CheckListSubTypeId": item.CheckListSubTypeId,
                "DeleteInd": "N",
                "OrganizationCheckListDetails": tempArray,
                "Logs": {},
            };

            $scope.ClinicalChecklistParentObj.NewChecklistName = $scope.ClinicalChecklistParentObj.NewChecklistName || '';
            if ($scope.ClinicalChecklistParentObj.NewChecklistName != '') {
                let ActionDescription = '';

                ActionDescription = `New Item for Clinical Checklist in Pre-Admission(Nurse) For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                let obj = {
                    "ModuleId": 3,
                    "ModuleName": "Pre Admission",
                    "SubModuleId": 33,
                    "SubModuleName": "Pre-Admission(Nurse)",
                    "ScreenType": "ClinicalChecklist",
                    "ActionType": "Added",
                    "ActionDescription": ActionDescription,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }

            if ($scope.LogObj.LogArray.length > 0) {
                req.Logs = $scope.LogObj || {};
            }
            eHnoteSurgeryService.AddUpdateOrganizationPreOpCheckListData(req).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Checklist added successfully!");
                    //$scope.init();
                    $scope.GetOrganizationASCCheckListData();
                }
                if (resp.data.status === "Failure") {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {
                console.log(err);
            });
            $scope.CloseChecklistData(item);
        };

        $scope.closeuib = function () {
            $scope.CheckListInd = true;

        };

        $scope.ChangeChecklistReviewedby = function (Id) {
            var TempFilter = $filter('filter')($scope.ChecklistArray, { 'DoctorID': Id }, true);
            if (TempFilter.length > 0) {
                $scope.ClinicalChecklistParentObj.ChecklistReviewedBy = TempFilter[0].DoctorID;
                $scope.ClinicalChecklistParentObj.ChecklistReviewedByName = TempFilter[0].FullName;
            } else {
                $scope.ClinicalChecklistParentObj.ChecklistReviewedBy = null;
                $scope.ClinicalChecklistParentObj.ChecklistReviewedByName = null;
            }
        };

        $scope.EditCheck = function () {
            $scope.CheckListInd = false;
            $scope.ClinicalChecklistParentObj.ChecklistReviewedBy = $scope.ClinicalChecklistParentObj.ChecklistReviewedBy || null
            if ($scope.ClinicalChecklistParentObj.ChecklistReviewedBy == null) {
                if ($scope.LoginUserRoleID == 8 || $scope.LoginUserRoleID == 38 ) {
                    $scope.ClinicalChecklistParentObj.ChecklistReviewedBy = $scope.UserId || null;
                }            
            } 
        }
        $scope.ClinicalCheckListSignOff = function (str) {

            let obj = {
                "Screen": "Nurse CheckList",
                "Type": "SignOff",
                "UserType": "Nurse",
                "allUserList": angular.copy($scope.allUserList) || [],
            };

            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/SignOffPasswordNew.html",
                "controller": "UsSignOffPasswordPopupCtrl",
                //"size": "md",
                "windowClass": "",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "obj": function () { return obj; }
                }
            });
            signmodalInstance.result.then(function (resp) {
                $scope.PreAdmSignOffUserId = resp.DoctorId || 0;
                $scope.SaveClinicalChecklistData("SignOff");
            }, function (data) {

            });
        };

        $scope.UnsignFromSumary = function () {

            let obj = {
                "Screen": "Nurse CheckList",
                "Type": "Unsign",
                "UserType": "Nurse",
                "allUserList": angular.copy($scope.allUserList) || [],
            };

            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/SignOffPasswordNew.html",
                "controller": "UsSignOffPasswordPopupCtrl",
                "size": "md",
                //"windowClass": "appointment-full-popup",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "obj": function () { return obj; }
                }
            });
            signmodalInstance.result.then(function (resp) {
                $scope.EditCheck()
                let PreAdmSignOffUserId = resp.DoctorId || 0;
                let UnsignRemarks = resp.Remarks || '';
                    //Signoff: Pre - op Nurse signed off by Geisha Mojica for Appointment ID: 690632
                    //Unsigned: Pre - op Nurse unsigned by Geisha Mojica for Appointment ID: 690632
                    let givenByUser = '';
                if (PreAdmSignOffUserId != 0) {
                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == PreAdmSignOffUserId });
                    if (ReviewedByArraylist.length > 0) {
                        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                    }
                    if (UnsignRemarks) {
                        givenByUser += `, Notes: ${UnsignRemarks}`;
                    }

                    $scope.LogObj.LogArray = [];
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 33,
                        "SubModuleName": "Nurse",
                        "ScreenType": "unsigned",
                        "ActionType": "unsigned",
                        "OldActionDescription": '',
                        "NewActionDescription": `Pre-Admission(Nurse)  Unsign  by ${givenByUser}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);

                    $scope.AddAuditLog($scope.LogObj);
                }
                $scope.GetChecklistDeatilsdata('unsign');
            }, function (data) {

            });
        }
        $scope.AddAuditLog = function (obj) {
      
            eHnoteSurgeryService.AddAuditLog(obj).then(function (resp) {
                if (resp.data.Status === 'Success') {
                    $scope.ActionArea = 0;
                    console.log(req.ModuleType + "added");
                }
            }, function () {

            });
        }
        $scope.GetScanImagesDataAfterScan = function () {
            var param = {
                "AppointmentId": $scope.cacheStorageItem.AppointmentId
            }

            eHnoteSurgeryService.GetPreAdmissionChecklistDetails(param.AppointmentId).then(function (resp) {
                if (resp.data.status === "Success") {
if (resp.data.PreAdmissionChecklistDocuments.length > 0) {
                        $scope.ChecklistFilesObj.SaveTempImagesArray = resp.data.PreAdmissionChecklistDocuments || [];
                    }
                };
            });
        };
    }]);
"use strict";
eHnoteWebApp.controller("AscClinicalChecklistCtrl", ["$scope", "$uibModalInstance","$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "datapersistanceFactory", "$window", "eHnoteMainAppointmentService", "$q", "eHnotePatientAddressDataServices", "eHnoteOrgReferralDataServices", "localStorageFactory", "eHnoteSurgeryService", "$timeout", "eHnotePrintService", "eHnoteSettingsDataService", "SurgeryStaticDataService", "eHnoteInsuranceService", "Lightbox", "eHnoteDbStaticDataService", "eHnoteMainAdminServices", "eHnoteAuditServices", "eHnoteDiagnosisDataServices", "datacookieFactory", "$translate", "eHnoteUserDataService","allUserList",
    function ($scope, $uibModalInstance, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, datapersistanceFactory, $window, eHnoteMainAppointmentService, $q, eHnotePatientAddressDataServices, eHnoteOrgReferralDataServices, localStorageFactory, eHnoteSurgeryService, $timeout, eHnotePrintService, eHnoteSettingsDataService, SurgeryStaticDataService, eHnoteInsuranceService, Lightbox, eHnoteDbStaticDataService, eHnoteMainAdminServices, eHnoteAuditServices, eHnoteDiagnosisDataServices, datacookieFactory, $translate, eHnoteUserDataService,allUserList) {
        $scope.allUserList = allUserList;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.SelectedFile = 1;
        $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };
        $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();

        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.RoleId = userLoginDetails.RoleID;

        $scope.ChecklistFilesObj = {
            "TempImagesArray":[]
        }

        $scope.FollowUptemplateover = {
            templateUrl: 'ChecklistTemplatSave.html',
        };
        $scope.ChecklistArray = [];
        $scope.ChecklistArray = $scope.allUserList.filter((x) => x.RoleId == 38 || x.RoleId == 8 );


        $scope.SurgeryDiagnosisObj = {
            "Diagnosis": "",
            "DiagnosisId": null,
            "OrganizationDiagnosisId": null,
            "OrganizationSurgeryId": null,
            "SurgeryId": null,
            "SurgeryDate": "",
            "OperativeProcedure": "",
            "Surgeon": "",
            "SelectedSurgery": {
                "PatientSurgeryId": null
            },
            "DoctorNotes": ""
        };
        $scope.cacheStorageItem.SurgeryList = $scope.cacheStorageItem.SurgeryList || [];
        //if ($scope.cacheStorageItem.SurgeryList.length > 0) {
        //    angular.forEach($scope.cacheStorageItem.SurgeryList, function (item, index) {
        //        if (index != 0) {
        //            $scope.SurgeryDiagnosisObj.OperativeProcedure += ', ';
        //        }
        //        $scope.SurgeryDiagnosisObj.OperativeProcedure += item.SurgeryName;
        //        // $scope.SurgeryDiagnosisObj.SurgeryDate = item.SurgerySuggestedDate; // not the suggested date but bind appt date 
        //        $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
        //        $scope.SurgeryDiagnosisObj.OrganizationSurgeryId = item.OrganizationSurgeryId;
        //        $scope.SurgeryDiagnosisObj.SurgeryId = item.SurgeryId;
        //        $scope.SurgeryDiagnosisObj.OrganId = item.OrganId;
        //        $scope.SurgeryDiagnosisObj.PatientSurgeryId = item.PatientSurgeryId;
        //        item.DiagnosisList = item.DiagnosisList || [];
        //        if (item.DiagnosisList.length > 0) {
        //            $scope.SurgeryDiagnosisObj.Diagnosis = item.DiagnosisList[0].DiagnosisName;
        //            $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId = item.DiagnosisList[0].OrganizationDiagnosisId;
        //            $scope.SurgeryDiagnosisObj.DiagnosisId = item.DiagnosisList[0].DiagnosisId;
        //        }

        //        $scope.SurgeryDiagnosisObj.Diagnosis2 = $scope.SurgeryDiagnosisObj.Diagnosis2 || '';
        //        if (item.DiagnosisList.length > 1) {
        //            $scope.SurgeryDiagnosisObj.Diagnosis2 = item.DiagnosisList[1].DiagnosisName;
        //        }

        //        item.DoctorId = item.DoctorId || '';
        //        if (item.DoctorId != '') {
        //            let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': item.DoctorId }, true);
        //            if (temparray3.length > 0) {
        //                $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
        //            } else {
        //                $scope.SurgeryDiagnosisObj.Surgeon = "";
        //            }
        //        }
        //    });
        //}


        $scope.ClinicalChecklistObj = {
            "IsShowAddScreen": null,
            "ClinicalChecklist": [],
            "IsAllClinicalCheckListChecked": '',
            "ClinicalChecklistTemplates": [],
            "MedicineChecklistTemplates": [],
            "SelectedClinicalChecklistTemplate": "",
            "AdmissionRemarks": "",
            "NewChecklistName": "",
            "ChecklistValueType": "",
        };

        $scope.GetChecklistDeatilsdata = function (){
            var param = {
                "AppointmentId": $scope.cacheStorageItem.AppointmentId
            }


            eHnoteSurgeryService.GetPreAdmissionChecklistDetails(param.AppointmentId).then(function (resp) {
                console.log(resp);
                if (resp.data.status === "Success") {

                    $scope.ClinicalChecklistObj.SurgeryList = angular.copy(resp.data.SurgeryArray);

                    angular.forEach(resp.data.rows, function (hitem) {
                        angular.forEach($scope.ClinicalChecklistObj.ClinicalChecklist, function (item) {
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

                    $scope.ClinicalChecklistObj.AdmissionRemarks = resp.data.CheckListRemarks || "";
                    if ($scope.ClinicalChecklistObj.AdmissionRemarks != '') {
                        $scope.ClinicalChecklistObj.AdmissionRemarksInd = true;
                    } else {
                        $scope.ClinicalChecklistObj.AdmissionRemarksInd = false;
                    }
                    if (resp.data.PreAdmissionChecklistDocuments.length > 0) {
                        $scope.ChecklistFilesObj.SaveTempImagesArray = resp.data.PreAdmissionChecklistDocuments || [];
                        $scope.ChecklistFilesObj.TempImagesArray = [];
                    }
                    $scope.ClinicalChecklistObj.ChecklistReviewedBy = resp.data.ChecklistReviewedBy || null;
                    if ($scope.ClinicalChecklistObj.ChecklistReviewedBy != null) {
                        var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.ClinicalChecklistObj.ChecklistReviewedBy }, true);
                        if (TempFilter.length > 0) {
                            //$scope.ClinicalChecklistObj.ChecklistReviewedByName = angular.copy(TempFilter[0].FullName);


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
                                LicenseNumber = 'Lic:' + ' ' + TempFilter[0].LicenseNumber+',';
                            }



                            $scope.ClinicalChecklistObj.ChecklistReviewedByName = angular.copy(SuffixName + ' ' + LicenseNumber);
                               
                         
                        }
                        else {
                            $scope.ClinicalChecklistObj.ChecklistReviewedByName = '';
                        }
                    }

                   

                    if (resp.data.ChecklistReviewedDate != '' && resp.data.ChecklistReviewedTime != "" ) {
                        $scope.ClinicalChecklistObj.ChecklistReviewedDate = resp.data.ChecklistReviewedDate + 'T' + resp.data.ChecklistReviewedTime;
                    }
                  


                    $scope.ClinicalChecklistObj.ChecklistReviewedDate = $filter('date')($scope.ClinicalChecklistObj.ChecklistReviewedDate, 'MM-dd-yyyy hh:mm a') || "";

                }
            

                $scope.ChecklistObject = {
                    "AdmissionRemarks": $scope.ClinicalChecklistObj.AdmissionRemarks || '',
                    "Documents": $scope.ChecklistFilesObj.SaveTempImagesArray || [],
                    "Checklist": $scope.ClinicalChecklistObj.ClinicalChecklist || [],
                    "ChecklistReviewedByName": $scope.ClinicalChecklistObj.ChecklistReviewedByName || null,
                    "ChecklistReviewedDate": $scope.ClinicalChecklistObj.ChecklistReviewedDate || ""
                }

                $uibModalInstance.close($scope.ChecklistObject);
            });
        }

        $scope.OnLoadChecklistScreen = function () {

            let req = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "CheckListModuleId": 1
            };

            let req2 = {
               // "ParentOrganizationId": $scope.ParentHospitalId,
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "CheckListCategoryId": 1
            };

            let req3 = {
                "AppointmentId": $scope.cacheStorageItem.AppointmentId
            };

            $q.all([
                eHnoteSurgeryService.GetOrganizationASCCheckListData(req),
                eHnoteSurgeryService.GetPreOpCheckListTemplates(req2),
                eHnoteSurgeryService.GetPreAdmissionChecklistDetails(req3.AppointmentId)
            ]).then(function (resp) {
                if (resp[0].data.status === "Success") {
                    angular.forEach(resp[0].data.rows, function (item) {
                        angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                            kitem.IsChecked = false;
                        });
                        item.ChecklistDate = null;
                        item.Remarks = "";
                    });
                    $scope.ClinicalChecklistObj.ClinicalChecklist = angular.copy(resp[0].data.rows);
                }

                if (resp[1].data.status === "Success") {
                    $scope.ClinicalChecklistObj.ClinicalChecklistTemplates = angular.copy(resp[1].data.rows);
                }

                if (resp[2].data.status === "Success") {

                    $scope.ClinicalChecklistObj.SurgeryList = angular.copy(resp[2].data.SurgeryArray);

                    angular.forEach(resp[2].data.rows, function (hitem) {
                        angular.forEach($scope.ClinicalChecklistObj.ClinicalChecklist, function (item) {
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

                    $scope.ClinicalChecklistObj.AdmissionRemarks = resp[2].data.CheckListRemarks || "";
                    if ($scope.ClinicalChecklistObj.AdmissionRemarks != '') {
                        $scope.ClinicalChecklistObj.AdmissionRemarksInd = true;
                    } else {
                        $scope.ClinicalChecklistObj.AdmissionRemarksInd = false;
                    }
                    if (resp[2].data.PreAdmissionChecklistDocuments.length > 0) {
                        $scope.ChecklistFilesObj.SaveTempImagesArray = resp[2].data.PreAdmissionChecklistDocuments || [];
                        $scope.ChecklistFilesObj.TempImagesArray = [];
                    }


                    $scope.ClinicalChecklistObj.ChecklistReviewedBy=resp[2].data.ChecklistReviewedBy || null;
                    if ($scope.ClinicalChecklistObj.ChecklistReviewedBy != null) {
                        var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.ClinicalChecklistObj.ChecklistReviewedBy }, true);
                        if (TempFilter.length > 0) {
                            $scope.ClinicalChecklistObj.ChecklistReviewedByName = angular.copy(TempFilter[0].FullName);
                        }
                        else {
                            $scope.ClinicalChecklistObj.ChecklistReviewedByName  = '';
                        }
                    }
                }

                $scope.AllNurseList = angular.copy($scope.allUserList);
                $scope.AllNurseList = _.uniq($scope.AllNurseList, false, function (p) { return p.DoctorID; });
                $scope.AllNurseList = $filter("filter")($scope.AllNurseList, function (item) {
                    return item.RoleId === 8;
                });

                if ($scope.ClinicalChecklistObj.SurgeryList.length > 0) {

                    angular.forEach($scope.ClinicalChecklistObj.SurgeryList, function (item) {

                        var surgerylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.SurgeonId }, true);
                        if (surgerylist.length > 0) {
                            $scope.SurgeryDiagnosisObj.Surgeon = angular.copy(surgerylist[0].FullName);
                            $scope.SurgeryDiagnosisObj.SurgeonID = angular.copy(item.SurgeonId);
                        } else {
                            $scope.SurgeryDiagnosisObj.Surgeon = $scope.SurgeryDiagnosisObj.Surgeon || '';
                        }

                        var cosurgerylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.CoSurgeonId }, true);
                        if (cosurgerylist.length > 0) {
                            $scope.SurgeryDiagnosisObj.CoSurgeonId = angular.copy(item.SurgeonId);
                        }

                        var Anesthetistlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.AnesthetistId }, true);
                        if (Anesthetistlist.length > 0) {
                            $scope.SurgeryDiagnosisObj.Anesthetist = angular.copy(Anesthetistlist[0].FullName);
                            $scope.SurgeryDiagnosisObj.AnesthetistID = angular.copy(item.AnesthetistId);
                        } else {
                            $scope.SurgeryDiagnosisObj.Anesthetist = $scope.SurgeryDiagnosisObj.Anesthetist || '';
                        }

                        var Nurselist = $filter("filter")($scope.AllNurseList, function (kitem) { return kitem.DoctorID == item.NurseId }, true);
                        if (Nurselist.length > 0) {
                            $scope.SurgeryDiagnosisObj.Nurse = angular.copy(Nurselist[0].FullName);
                            $scope.SurgeryDiagnosisObj.NurseID = angular.copy(item.NurseId);
                        } else {
                            $scope.SurgeryDiagnosisObj.Nurse = $scope.SurgeryDiagnosisObj.Nurse || '';
                        }

                        $scope.SurgeryDiagnosisObj.OperativeProcedure = item.SurgeryName;
                        $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                        $scope.SurgeryDiagnosisObj.OrganizationSurgeryId = item.OrganizationSurgeryId;
                        $scope.SurgeryDiagnosisObj.SurgeryId = item.SurgeryId;
                        $scope.SurgeryDiagnosisObj.OrganId = item.OrganId;

                        item.DiagnosisList = item.DiagnosisList || [];
                        if (item.DiagnosisList.length > 0) {
                            $scope.SurgeryDiagnosisObj.Diagnosis = item.DiagnosisList[0].DiagnosisName;
                            $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId = item.DiagnosisList[0].OrganizationDiagnosisId;
                            $scope.SurgeryDiagnosisObj.DiagnosisId = item.DiagnosisList[0].DiagnosisId;
                        }

                        $scope.SurgeryDiagnosisObj.Diagnosis2 = $scope.SurgeryDiagnosisObj.Diagnosis2 || '';
                        if (item.DiagnosisList.length > 1) {
                            $scope.SurgeryDiagnosisObj.Diagnosis2 = item.DiagnosisList[1].DiagnosisName;
                        }

                        $scope.SurgeryDiagnosisObj.InternalCoManagerId = item.InternalCoManagerId || null;
                        item.InternalCoManagerId = item.InternalCoManagerId || '';
                        if (item.InternalCoManagerId != '') {
                            let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.InternalCoManagerId }, true);
                            if (temparray.length > 0) {
                                $scope.SurgeryDiagnosisObj.InternalCoManager = temparray[0].FullName;
                            } else {
                                $scope.SurgeryDiagnosisObj.InternalCoManager = "";
                            }
                        }

                        $scope.SurgeryDiagnosisObj.ExternalCoManagerId = item.ExternalCoManagerId || null;
                        item.ExternalCoManagerId = item.ExternalCoManagerId || '';
                        if (item.ExternalCoManagerId != '') {
                            let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.ExternalCoManagerId }, true);
                            if (temparray.length > 0) {
                                $scope.SurgeryDiagnosisObj.ExternalCoManager = temparray[0].FullName;
                            } else {
                                $scope.SurgeryDiagnosisObj.ExternalCoManager = "";
                            }
                        }
                    });
                }

                //$scope.MainObj.IsPreAdmSummaryNav = false;

               

            });

        };

        $scope.OnLoadChecklistScreen();

        $scope.SaveClinicalChecklistData = function () {

            let ClinicalChecklist = [];
            angular.forEach($scope.ClinicalChecklistObj.ClinicalChecklist, function (item) {
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

            var ReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            var sCurrentDate = $filter('date')(new Date(), "yyyy-MM-dd");
            let req = {
                "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "UserId": $scope.UserId || null,
                "HospitalId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "AppointmentDate": $scope.cacheStorageItem.AppointmentDt || sCurrentDate,
                "ClinicalChecklist": ClinicalChecklist || [],
                "Remarks": $scope.ClinicalChecklistObj.AdmissionRemarks,
                "TempDocumentDetails": [],
                "DocumentDetails": [],
                "ChecklistReviewedBy": $scope.ClinicalChecklistObj.ChecklistReviewedBy || null,
                "ChecklistReviewedDate": ReviewedDate || "",
            };

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
            }

            console.log(JSON.stringify(req));

            eHnoteSurgeryService.AddUpdatePreAdmChecklistDetails(req, callbackSuccess, callbackError);
            function callbackSuccess(response) {
                if (response.Status === "Success") {
                    alertify.success("Checklist Submitted Successfully!");
                   // $scope.ClinicalChecklistObj.IsShowAddScreen = false;
                    $scope.GetChecklistDeatilsdata();
                } else {
                    alertify.error("Some Error Occurred");
                }
            };
            function callbackError(err) {
                alertify.error("Uploading Failed");
            }

        };

        $scope.OnSelectChecklistTemplate = function (obj, val) {
            obj = obj || null;
            if (obj === null) {
                return;
            }
            if (val == 1) {
                $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked = '';
            }
            angular.forEach($scope.ClinicalChecklistObj.ClinicalChecklist, function (item) {
                if (item.CheckListCategoryId === val) {
                    item.ChecklistDate = null;
                    item.Remarks = "";
                    angular.forEach(item.OrganizationCheckListDetails, function (hitem) {
                        hitem.IsChecked = false;
                    });
                }
            });
            if (obj.TemplateDetails.length === 0) {
                angular.forEach($scope.ClinicalChecklistObj.ClinicalChecklist, function (item) {
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
                angular.forEach($scope.ClinicalChecklistObj.ClinicalChecklist, function (item) {
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
                $scope.ClinicalChecklistObj.SelectedClinicalChecklistTemplate='Select Template'
                $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked = 'Yes';
                angular.forEach($scope.ClinicalChecklistObj.ClinicalChecklist, function (item) {
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
                $scope.ClinicalChecklistObj.SelectedClinicalChecklistTemplate = 'Select Template'
                $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked = 'No';
                angular.forEach($scope.ClinicalChecklistObj.ClinicalChecklist, function (item) {
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
                $scope.ClinicalChecklistObj.SelectedClinicalChecklistTemplate = 'Select Template'
                $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked = 'NA';
                angular.forEach($scope.ClinicalChecklistObj.ClinicalChecklist, function (item) {
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
                    $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked = $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked == 'Yes' ? $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked : '';
                }
                if (obj.Value == "No") {
                    $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked = $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked == 'No' ? $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked : '';
                }
                if (obj.Value == "N/A") {
                    $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked = $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked == 'NA' ? $scope.ClinicalChecklistObj.IsAllClinicalCheckListChecked : '';
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
                    $scope.ClinicalChecklistObj.ClinicalChecklistTemplates = angular.copy(resp.data.rows);
                }

            }, function (err) {
                console.log(err);
            });
        };

        //$scope.AddChecklistTemplate = function (val) {
        //    let modalInstance = $uibModal.open({
        //        "templateUrl": "templates/uibpopups/ChecklistTemplateNamePopUp.html",
        //        "controller": function ($scope, $uibModalInstance, CheckListCategoryId) {
        //            $scope.closePopup = function () {
        //                $uibModalInstance.dismiss("cancel");
        //            };

                   
        //        },
        //        "backdrop": "static",
        //        "keyboard": false,
        //        "size": "sm",
        //        "scope": $scope,
        //        "resolve": {
        //            "CheckListCategoryId": function () {
        //                return val;
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function (data) {
        //        if (val === 1) {
        //            $scope.GetClinicalCheckListTemplates();
        //        }
        //    }, function (data) {
        //        console.log(data);
        //    });
        //};

        $scope.IsOpenCheckListTemp = function () {
            $scope.IsOpenCheckList = true;
        }



        $scope.TempObj =
        {
            "ChecklistTemplateName" :""
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
                let ConcernedChecklistArray = $filter('filter')($scope.ClinicalChecklistObj.ClinicalChecklist, { 'CheckListCategoryId': templateReq.CheckListCategoryId }, true);
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

        };
      
        //asc checklist file upload
        //$scope.ChecklistFilesObj = angular.copy($scope.GetFilesObj());
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
        $scope.CheckListDeleteUploadedFileNew = function (item, index, mainitem) {
            $scope.ChecklistFilesObj.TempImagesArray.splice(index, 1);
            //if (item.DocumentID == 0) {
            //    $scope.ChecklistFilesObj.TempImagesArray.splice(index, 1);
            //} else {
            //    $scope.ChecklistFilesObj.TempImagesArray[index].DeleteInd = 'Y';
            //}
        }

        $scope.$on("PreAdmSummaryNavSubEvent", function (event, data) {
            if (data == 1) {
                $scope.ChangeTab(5);
            } else if (data == 2) {
                $scope.ChangeTab(10);
            } else if (data == 3) {
                $scope.OnLoadChecklistScreen();
            }
        });


        $scope.Ascbasicdetailspopup = function () {

            let reqIds = {
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "HospitalId": $scope.HospitalId,
                "ParenthospitalId": $scope.ParenthospitalId,
            };

            var modalInstance = $uibModal.open({
                "templateUrl": "templates/uibpopups/Ascbasicdetailspopup.html",
                "resolve": {
                    "AllUserList": function () { return $scope.allUserList; },
                    "AllAnesthetistList": function () { return $scope.AnesthetistArray; },
                    "AllNurseList": function () { return $scope.AllNurseList; },
                    "AppointmentId": function () { return $scope.cacheStorageItem.AppointmentId; },
                    "PatientSurgeryId": function () { return $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId; },
                    "SurgeonID": function () { return $scope.SurgeryDiagnosisObj.SelectedSurgery.DoctorId; },
                    "SurgeryList": function () { return $scope.ClinicalChecklistObj.SurgeryList; },
                    "reqIds": function () { return reqIds; },
                    "SurgeryDiagnosisObj": function () { return $scope.SurgeryDiagnosisObj; },
                    "PatientDetails": function () { return $scope.selectedPatientData; },
                    "cacheStorageItem": function () { return $scope.cacheStorageItem; }

                },
                "controller": function ($scope, $uibModal, $uibModalInstance, AllUserList, AllAnesthetistList, AllNurseList, AppointmentId, PatientSurgeryId, SurgeonID, SurgeryDiagnosisObj, reqIds, PatientDetails, SurgeryList, cacheStorageItem) {
                    $scope.PatientID = cacheStorageItem.PatientID;
                    $scope.cacheStorageItem = cacheStorageItem;

                    $scope.UserId = reqIds.UserId;
                    $scope.SpecializationId = reqIds.SpecializationId;
                    $scope.HospitalId = reqIds.HospitalId;

                    $scope.ParenthospitalId = reqIds.ParenthospitalId || null;

                    $scope.adviseObj = {
                        'SearchProcedureObj': "",
                        'DiagnosisObject': "",
                        'SearchReferalObj': ""
                    };

                    $scope.EditSurgeryObj = {
                        "AllUserList": [],
                        "AllAnesthetistList": [],
                        "AllNurseList": [],
                        "UserID": null,
                        "AnesthetistID": null,
                        "NurseID": null,
                        "Height": "",
                        "Weight": ""
                    }


                    $scope.HeightUnits = [
                        {
                            "Unit": "Ft/Inches",
                            "UnitId": 1
                        },
                        {
                            "Unit": "Cms",
                            "UnitId": 2
                        }
                    ];

                    $scope.WeightUnits = [
                        {
                            "Unit": "Kgs",
                            "UnitId": 1
                        },
                        {
                            "Unit": "lbs",
                            "UnitId": 2
                        }
                    ];

                    $scope.SurgeryList = SurgeryList;
                    $scope.EditSurgeryObj.Height = $scope.SurgeryList[0].Height;
                    $scope.EditSurgeryObj.Weight = $scope.SurgeryList[0].Weight;


                    $scope.EditSurgeryObj.AllUserList = AllUserList;
                    $scope.EditSurgeryObj.AllAnesthetistList = AllAnesthetistList;
                    $scope.EditSurgeryObj.AllNurseList = AllNurseList;
                    if (SurgeryDiagnosisObj.SurgeonID != '') {
                        $scope.EditSurgeryObj.SurgeonID = SurgeryDiagnosisObj.SurgeonID;
                    } else {
                        $scope.EditSurgeryObj.SurgeonID = SurgeonID;
                    }
                    $scope.EditSurgeryObj.AnesthetistID = SurgeryDiagnosisObj.AnesthetistID;
                    $scope.EditSurgeryObj.CoSurgeonId = SurgeryDiagnosisObj.CoSurgeonId;
                    $scope.EditSurgeryObj.ExternalCoManagerId = SurgeryDiagnosisObj.ExternalCoManagerId;
                    $scope.EditSurgeryObj.InternalCoManagerId = SurgeryDiagnosisObj.InternalCoManagerId;
                    $scope.EditSurgeryObj.NurseID = SurgeryDiagnosisObj.NurseID;

                    $scope.EditSurgeryObj.Age = $scope.cacheStorageItem.Age;
                    $scope.EditSurgeryObj.Gender = $scope.cacheStorageItem.Gender;
                    $scope.EditSurgeryObj.Race = $scope.cacheStorageItem.RaceName;
                    $scope.EditSurgeryObj.Height = $scope.cacheStorageItem.Height;
                    $scope.EditSurgeryObj.Weight = $scope.cacheStorageItem.Weight;


                    $scope.GetDiagnosisList = function (val) {
                        let object = {
                            "LevelType": 'O',
                            "HospitalId": $scope.HospitalId,
                            "UserId": $scope.UserId,
                            "SpecializationId": $scope.SpecializationId,
                            "SearchText": val,
                            "PageSize": 10,
                            "PageNumber": 1,
                            "Type": '',
                            "IsFrequent": 'N',
                            "ParentOrganizationId": $scope.ParenthospitalId
                        };

                        if (object.SearchText == '') {
                            object.IsFrequent = 'Y';
                        }
                        if ($scope.Assesmenttab === 2) {
                            if ($scope.AdvisedOrderDetailsArray.length == 0) {
                                alertify.error("Please Select Any Order And Continue To search");
                                return false;
                            }
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

                    $scope.DiagnosisArray = [];

                    if ($scope.SurgeryList.length > 0) {
                        angular.forEach($scope.SurgeryList, function (item) {
                            if (item.DiagnosisList.length > 0) {
                                angular.forEach(item.DiagnosisList, function (kitem) {
                                    kitem.DeleteInd = "N";
                                    $scope.DiagnosisArray.push(kitem);
                                });

                            }
                        });
                    }

                    $scope.onSelectHeight = function (id) {
                        if (id == 2) {
                            $scope.EditSurgeryObj.HeightUnitName = "Cms";
                        } else {
                            $scope.EditSurgeryObj.HeightUnitName = "Ft/Inches";
                        }
                    };

                    $scope.onSelectWeight = function (id) {
                        if (id == 2) {
                            $scope.EditSurgeryObj.WeightUnitName = "lbs";
                        } else {
                            $scope.EditSurgeryObj.WeightUnitName = "Kgs";
                        }
                    };

                    $scope.onSelectDiagnosis = function (mainobject) {

                        let filterdiagnosis = $filter("filter")($scope.DiagnosisArray, function (Aitem, index) { return Aitem.DiagnosisId == mainobject.DiagnosisId },);
                        if (filterdiagnosis.length > 0) {
                            mainobject = "";
                            $scope.adviseObj.DiagnosisObject = "";
                            alertify.error("Diagnosis Already Added");
                            return false;
                        }

                        let obj = {
                            "DeleteInd": "N",
                            "DiagnosisDetailId": 0,
                            "DiagnosisId": mainobject.DiagnosisId,
                            "DiagnosisName": mainobject.DiagnosisName,
                            "ICDCode": mainobject.ICD10CODE,
                        }

                        $scope.DiagnosisArray.push(obj);


                        $scope.adviseObj.DiagnosisObject = "";
                    };

                    $scope.RemoveDiagnosis = function (obj) {
                        if (obj.DiagnosisDetailId == 0) {
                            let index = $scope.DiagnosisArray.indexOf(obj);
                            if (index > -1) {
                                $scope.DiagnosisArray.splice(index, 1);
                            }
                        } else {
                            obj.DeleteInd = "Y";
                        }

                    }

                    $scope.SaveEditSurgeryStaff = function (item) {
                        var obj = {
                            //"PatientSurgeryID": PatientSurgeryId,
                            "AppointmentID": AppointmentId,
                            "AnesthetistID": item.AnesthetistID,
                            "NurseID": item.NurseID,
                            "SurgeonID": item.SurgeonID,
                            "UserId": $scope.UserId,
                            "AppointmentTypeId": 7,
                            "Height": $scope.EditSurgeryObj.Height || null,
                            "Weight": $scope.EditSurgeryObj.Weight || null,
                            "PatientId": $scope.PatientID,
                            "DiagnosisList": $scope.DiagnosisArray || [],
                            "ExternalCoManagerId": $scope.EditSurgeryObj.ExternalCoManagerId,
                            "InternalCoManagerId": $scope.EditSurgeryObj.InternalCoManagerId,
                            "CoSurgeonId": $scope.EditSurgeryObj.CoSurgeonId,
                            "HeightUnitId": $scope.EditSurgeryObj.HeightUnitId,
                            "HeightUnitName": $scope.EditSurgeryObj.HeightUnitName || 'Cms',
                            "WeightUnitId": $scope.EditSurgeryObj.WeightUnitId,
                            "WeightUnitName": $scope.EditSurgeryObj.WeightUnitName || 'lbs',
                            "Logs": {},
                        };
                        eHnoteSurgeryService.AddUpdateSurgeryStaffList(obj).then(function (response) {
                            console.log(response);
                            if (response.data.status === "Success") {
                                $uibModalInstance.close(response);
                            }
                        });
                    };
                    $scope.close = function (item) {
                        $uibModalInstance.dismiss("cancel");
                    };
                },
                "backdrop": "static",
                "size": "lg",
                "keyboard": false,
                // "windowClass": "modal__popup--1 bottom-to-top-modal in",
            });
            modalInstance.result.then(function (data) {
                if (data.data.status === "Success") {

                    let patientId = $scope.cacheStorageItem.PatientID || 0;
                    eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
                    function ongetPatientDetailsSuccess(data) {
                        if (data !== undefined) {
                            var patientitem = data;
                            $scope.cacheStorageItem.Height = patientitem.Patient[0].Height;
                            $scope.cacheStorageItem.Weight = patientitem.Patient[0].Weight;

                            $scope.AddToCache();
                        }
                    }

                    function ongetPatientDetailsError(error) {
                        console.log(error);
                    }

                    $scope.OnLoadChecklistScreen();
                }
            }, function (cancel) {

            });
        }
        $scope.DeletePreadminClinicalCheckListDocumentGetlist = function (item, index, mainitem) {

            item.DisplayName = item.DisplayName || "";
            if (item.DisplayName == "") {
                item.DisplayName = item.FileName;
            }
            $scope.DeleteFileUploadArray = { "DocumentID": item.DocumentID, "FileName": item.DisplayName, "Remarks": "" };

            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                var params = {
                    "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                    "DeleteIndicator": 0,
                    "ImagesArray": [],
                    "UploadType": "Delete",
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "Remarks": ""
                };
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
            angular.forEach($scope.ClinicalChecklistObj.ClinicalChecklist, function (citem) {
                citem.IsshowAdd = false;
            });
            if (item.CheckListCategoryId === 1) {
                item.IsshowAdd = true;
            }
        };
        $scope.CloseChecklistData = function (item) {
            $scope.ClinicalChecklistObj.NewChecklistName = "";
            item.IsshowAdd = false;
        }

        $scope.AddNewChecklistData = function (item) {
            if ($scope.ClinicalChecklistObj.NewChecklistName === "") {
                alertify.error("Please enter checklist name!");
                return false;
            }
            let tempArray = [];
            if ($scope.ClinicalChecklistObj.ChecklistValueType == "1") {
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
            } else if ($scope.ClinicalChecklistObj.ChecklistValueType == "2") {
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
            } else if ($scope.ClinicalChecklistObj.ChecklistValueType == "3") {
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
                "CheckListName": $scope.ClinicalChecklistObj.NewChecklistName,
                "CheckListSubTypeId": item.CheckListSubTypeId,
                "DeleteInd": "N",
                "OrganizationCheckListDetails": tempArray
            };
            eHnoteSurgeryService.AddUpdateOrganizationPreOpCheckListData(req).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Checklist added successfully!");
                    //$scope.init();
                    $scope.OnLoadChecklistScreen();
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
            $uibModalInstance.dismiss("cancel");
        };


        $scope.ChangeChecklistReviewedby = function (Id) {
            var TempFilter = $filter('filter')($scope.ChecklistArray, { 'DoctorID': Id }, true);
            if (TempFilter.length > 0) {
                $scope.ClinicalChecklistObj.ChecklistReviewedBy = TempFilter[0].DoctorID;
                $scope.ClinicalChecklistObj.ChecklistReviewedByName = TempFilter[0].FullName;
            } else {
                $scope.ClinicalChecklistObj.ChecklistReviewedBy= '';
                $scope.ClinicalChecklistObj.ChecklistReviewedByName = '';
            }
        };

        $scope.FollowUptemplateover = {
            templateUrl: 'ChecklistTemplatSave.html',
        };

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
                $scope.OnLoadChecklistScreen();

            }, function (cancel) {
            });

        }

    }]);
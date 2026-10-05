"use strict";
eHnoteWebApp.controller("USOperativeNotesCtrl", ["$scope", "$uibModalInstance", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "datapersistanceFactory", "$window", "eHnoteMainAppointmentService", "$q", "eHnotePatientAddressDataServices", "eHnoteOrgReferralDataServices", "localStorageFactory", "eHnoteSurgeryService", "$timeout", "eHnotePrintService", "eHnoteSettingsDataService", "SurgeryStaticDataService", "eHnoteInsuranceService", "Lightbox", "eHnoteDbStaticDataService", "eHnoteMainAdminServices", "eHnoteAuditServices", "eHnoteDiagnosisDataServices", "datacookieFactory", "$translate", "eHnoteUserDataService", "allUserList","USPrintService",
    function ($scope, $uibModalInstance, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, datapersistanceFactory, $window, eHnoteMainAppointmentService, $q, eHnotePatientAddressDataServices, eHnoteOrgReferralDataServices, localStorageFactory, eHnoteSurgeryService, $timeout, eHnotePrintService, eHnoteSettingsDataService, SurgeryStaticDataService, eHnoteInsuranceService, Lightbox, eHnoteDbStaticDataService, eHnoteMainAdminServices, eHnoteAuditServices, eHnoteDiagnosisDataServices, datacookieFactory, $translate, eHnoteUserDataService, allUserList, USPrintService) {
        $scope.allUserList = allUserList;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
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


        $scope.closeuib = function () {
            $uibModalInstance.dismiss("cancel");
        }

        //if ($scope.MainObj == undefined) {
        //    $scope.MainObj = {
        //        "IsSummaryNav":false
        //    }
        //} else {
        //    $scope.MainObj.IsSummaryNav = false;
        //}


        $scope.isAddingScreenVisible = true;
        $scope.isEditScreenVisible = false;

        $scope.ChecklistArray = [];
        $scope.OperativeArray = [];
      
        $scope.ChecklistArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43);
        $scope.OperativeArray = $scope.ChecklistArray.filter((x) => x.SuffixId == 10);

        $scope.Diagnosis = [];
        $scope.SurgeryDiagnosisObj = {
            "Diagnosis": "",
            "DiagnosisId": null,
            "OrganizationDiagnosisId": null,
            "OrganizationSurgeryId": null,
            "SurgeryId": null,
            "SurgeryDate": "",
            "OperativeProcedure": "",
            "Surgeon": "",
            "AnesthetistId": null,
            "Anesthetist": "",
            "SelectedSurgery": {
                "PatientSurgeryId": null
            },
            "DoctorNotes": ""
        };
        $scope.cacheStorageItem.SurgeryList = $scope.cacheStorageItem.SurgeryList || [];
        //if ($scope.cacheStorageItem.SurgeryList.length > 0) {
        //    angular.forEach($scope.cacheStorageItem.SurgeryList, function (item,index) {    
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

      
        $scope.OperativeNotesObj = {
            "IsShow": null,
            "PatientOperativeNotesId":0,
            "ProcedureDetails": "",
            "Complications": "",
            "ProcedureDetailsTempList": [],
            "ComplicationTemplatesList": [],
            "LastSignOffUserDetails": [],
            "Findings": '',
            "SurgeonOperativeNotes": '',
            "FindingsDetailsTempList": [],
            "SurgeonOperativeTemplatesList": [],
            "OperativeNotesReviewedBy": null,
            "OperativeReviewedName": "",
            "OperativeReviewedNameSuffix": "",
            "ReviewedByLicenseNumber": "",
            "OperativeReviewedDate":null
        };

        $scope.SurgicalHistoryArray = [];
        $scope.SystemicHistoryArray = [];
        $scope.AllergyItemsArray =[];
        $scope.CurrentEyeMedicationList =[];
        $scope.CurrentSystemicMedicationList =[];
        $scope.GetOperativeNotesDetails = function () {
            var obj = {
                "HospitalId": $scope.HospitalId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            }
            eHnoteSurgeryService.GetOperativeNotesDetails(obj).then(function (resp) {
                if (resp.data.Status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.OperativeNotesObj.OperativeChartStatus = resp.data.rows[0].OperativeChartStatus;
                        if (resp.data.rows[0].Complications == '' || resp.data.rows[0].Complications == null) {
                            $scope.OperativeNotesObj.Complications = resp.data.ComplicationsNotes || "";
                        } else {
                            $scope.OperativeNotesObj.Complications = resp.data.rows[0].Complications;
                        }

                        if (resp.data.rows[0].Findings == '' || resp.data.rows[0].Findings == null) {
                            $scope.OperativeNotesObj.Findings = resp.data.DischargeFindings;
                        } else {
                            $scope.OperativeNotesObj.Findings = resp.data.rows[0].Findings;
                        }

                        if (resp.data.rows[0].SurgeonOperativeNotes == '' || resp.data.rows[0].SurgeonOperativeNotes == null) {
                            $scope.OperativeNotesObj.SurgeonOperativeNotes = resp.data.PostOpSurgeonOperativeNotes;
                        } else {
                            $scope.OperativeNotesObj.SurgeonOperativeNotes = resp.data.rows[0].SurgeonOperativeNotes;
                        }
                        $scope.OperativeNotesObj.ProcedureDetails = resp.data.rows[0].ProcedureDetails;
                        //$scope.OperativeNotesObj.Findings = resp.data.rows[0].Findings;
                        //$scope.OperativeNotesObj.SurgeonOperativeNotes = resp.data.rows[0].SurgeonOperativeNotes;
                        $scope.Diagnosis = resp.data.Diagnosis || [];
                        $scope.ImplantsDetailsArray = resp.data.ImplantsDetailsArray || [];
                        $scope.SurgicalHistoryArray = resp.data.SurgicalHistoryArray || [];
                        $scope.SystemicHistoryArray = resp.data.SystemicHistoryArray || [];
                        $scope.AllergyItemsArray = resp.data.AllergyItemsArray || [];
                        $scope.CurrentEyeMedicationList = resp.data.CurrentEyeMedicationList || [];
                        $scope.CurrentSystemicMedicationList = resp.data.CurrentSystemicMedicationList || [];

                    } else {
                        $scope.Diagnosis = resp.data.Diagnosis || []; 
                        $scope.ImplantsDetailsArray = resp.data.ImplantsDetailsArray || [];
                        $scope.OperativeNotesObj.LastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
                        $scope.OperativeNotesObj.Complications = resp.data.ComplicationsNotes || "";
                        $scope.OperativeNotesObj.Findings = resp.data.DischargeFindings;
                        $scope.OperativeNotesObj.SurgeonOperativeNotes = resp.data.PostOpSurgeonOperativeNotes;
                        $scope.SurgicalHistoryArray = resp.data.SurgicalHistoryArray || [];
                        $scope.SystemicHistoryArray = resp.data.SystemicHistoryArray || [];
                        $scope.AllergyItemsArray = resp.data.AllergyItemsArray || [];
                        $scope.CurrentEyeMedicationList = resp.data.CurrentEyeMedicationList || [];
                        $scope.CurrentSystemicMedicationList = resp.data.CurrentSystemicMedicationList || [];
                    }
                    
                }
            }, function () {

            });

        }
        //$scope.GetOperativeNotesDetails();

     
        $scope.SaveOperativeNotes = function (str) {
            var ReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            var obj = {
                "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                "UserId": $scope.UserId || null,
                "PatientOperativeNotesId": $scope.OperativeNotesObj.PatientOperativeNotesId,
                "HospitalId": $scope.HospitalId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "ProcedureDetails": $scope.OperativeNotesObj.ProcedureDetails || "",
                "Complications": $scope.OperativeNotesObj.Complications || "",
                "Findings": $scope.OperativeNotesObj.Findings || "",
                "SurgeonOperativeNotes": $scope.OperativeNotesObj.SurgeonOperativeNotes || "",
                "OperativeChartStatus": (str === "SignOff") ? "E" : "D",
                "DeleteInd": "N",
                "OperativeReviewedDate": ReviewedDate,
                "OperativeNotesReviewedBy": $scope.OperativeNotesObj.OperativeNotesReviewedBy || null

            }
           
            eHnoteSurgeryService.AddUpdateOperativeNotesDetails(obj).then(function (resp) {
                if (resp.data.Status == "Success") {
                   
                    if (obj.OperativeChartStatus === "D") {
                        alertify.success("Operative Notes Added successfully!");
                    }
                                
                    //$scope.GetOperativeNotesDetails();
                    //$scope.OperativeNotesObj.IsShowAddScreen = false;

                    $scope.OnOperativeScreenLoad();
                }
            }, function () {

            });
        }


        //$scope.AddChecklistTemplateComplications = function () {
        //    let modalInstance = $uibModal.open({
        //        "templateUrl": "templates/uibpopups/ChecklistTemplateNamePopUp.html",
        //        "controller": function ($scope, $uibModalInstance, surgicalnotes) {
        //            $scope.closePopup = function () {
        //                $uibModalInstance.dismiss("cancel");
        //            };

        //            $scope.SaveTemplateName = function () {
        //                $scope.TemplateName = $scope.TemplateName || "";
        //                if ($scope.TemplateName === "") {
        //                    alertify.error("Please enter template name!");
        //                    return false;
        //                } else {
        //                    let templateReq = {
        //                        "UserId": $scope.UserId || "",
        //                        "HospitalId": $scope.HospitalId || "",
        //                        "TemplateId": 0,
        //                        "TemplateName": $scope.TemplateName || "",
        //                        "DeleteInd": "N",
        //                        "TemplateNotes": [],
        //                        "TypeId": '2',
        //                        "TypeName": 'Complications',
        //                    };


        //                    templateReq.TemplateNotes = $scope.OperativeNotesObj.Complications || "";                          
        //                    eHnoteSurgeryService.AddUpdateIntraOpTemplates(templateReq).then(function (resp) {
        //                        if (resp.data.Status === "Success") {
        //                            alertify.success("Template saved successfully!");
        //                            $uibModalInstance.close();
        //                        }
        //                        if (resp.data.status === "Failure") {
        //                            alertify.error(resp.data.Message)
        //                        }
        //                    }, function (err) {
        //                        console.log(err);
        //                    });

        //                }

        //            };
        //        },
        //        "backdrop": "static",
        //        "keyboard": false,
        //        "size": "sm",
        //        "scope": $scope,
        //        "resolve": {
        //            "surgicalnotes": function () {
        //                return $scope.OperativeNotesObj.Complications;
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function (data) {
        //        $scope.GetPreOpMedicineCheckListTemplates();
        //    }, function (data) {
        //        console.log(data);
        //    });
        //};

        $scope.GetPreOpMedicineCheckListTemplates = function () {

            let req = {
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
            };
            eHnoteSurgeryService.GetIntraOPSurgicalNoteTemplates(req).then(function (resp) {
                if (resp.data.Status === "Success") {
                   
                    $scope.OperativeNotesObj.ComplicationTemplatesList = [];
                    $scope.OperativeNotesObj.ProcedureDetailsTempList = [];
                    $scope.OperativeNotesObj.ProcedureDetailsTempList = resp.data.ProcedureTemplates || [];                  
                    $scope.OperativeNotesObj.ComplicationTemplatesList = resp.data.ComplicationTemplates || [];
                }

            }, function (err) {
                console.log(err);
            });
        };

        //$scope.GetPreOpMedicineCheckListTemplates();

       
        $scope.OperativeNotesObj.ComplicationsInd = false;
        $scope.OnselectSurgicalNotesComplicationsTemplates = function (item) {
            item.TemplateNotes = item.TemplateNotes || "";
            $scope.OperativeNotesObj.ComplicationsInd = true;
            if (item.TemplateNotes != '') {
                $scope.OperativeNotesObj.Complications = item.TemplateNotes || "";
            }
            else {
                $scope.OperativeNotesObj.Complications = '';
            }
        };

        $scope.OperativeNotesSignOff = function () {

            let obj = {
                "Screen": "OperativeNotes",
                "Type": "SignOff",
                "allUserList": angular.copy($scope.allUserList) || [],
            };

            //let signmodalInstance = $uibModal.open({
            //    "templateUrl": "templates/consultation/SignOffPasswordRequired.html",
            //    "controller": "UsPasswordAuthenticationPopupCtrl",
            //    "size": "md",
            //    "windowClass": " ",
            //    "backdrop": "static",
            //    "keyboard": false,
            //    "resolve": {
            //        "obj": function () { return obj; }
            //    }
            //});
            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/SignOffPassword.html",
                "controller": "UsSignOffPasswordPopupCtrl",
                "size": "md",
                "windowClass": " ",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "obj": function () { return obj; }
                }
            });
            signmodalInstance.result.then(function (resp) {
                $scope.SaveOperativeNotes("SignOff");
            }, function (data) {

            });
        };


        //$scope.AddChecklistProcedureTemplate = function () {
        //    let modalInstance = $uibModal.open({
        //        "templateUrl": "templates/uibpopups/ChecklistTemplateNamePopUp.html",
        //        "controller": function ($scope, $uibModalInstance, surgicalnotes) {
        //            $scope.closePopup = function () {
        //                $uibModalInstance.dismiss("cancel");
        //            };

        //            $scope.SaveTemplateName = function () {
        //                $scope.TemplateName = $scope.TemplateName || "";
        //                if ($scope.TemplateName === "") {
        //                    alertify.error("Please enter template name!");
        //                    return false;
        //                } else {
        //                    let templateReq = {
        //                        "UserId": $scope.UserId || "",
        //                        "HospitalId": $scope.HospitalId || "",
        //                        "TemplateId": 0,
        //                        "TemplateName": $scope.TemplateName || "",
        //                        "DeleteInd": "N",
        //                        "TemplateNotes": [],
        //                        "TypeId": '4',
        //                        "TypeName": 'ProcedureDetails',
        //                    };
        //                    templateReq.TemplateNotes = $scope.OperativeNotesObj.ProcedureDetails || "";
        //                    /*console.log(templateReq);*/
        //                    eHnoteSurgeryService.AddUpdateIntraOpTemplates(templateReq).then(function (resp) {
        //                        if (resp.data.Status === "Success") {
        //                            alertify.success("Template saved successfully!");
        //                            $uibModalInstance.close();
        //                        }
        //                        if (resp.data.status === "Failure") {
        //                            alertify.error('TemplateName Already Exists')
        //                        }
        //                    }, function (err) {
        //                        console.log(err);
        //                    });

        //                }

        //            };
        //        },
        //        "backdrop": "static",
        //        "keyboard": false,
        //        "size": "sm",
        //        "scope": $scope,
        //        "resolve": {
        //            "surgicalnotes": function () {
        //                return $scope.OperativeNotesObj.ProcedureDetails;
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function (data) {
        //        $scope.GetPreOpMedicineCheckListTemplates();
        //    }, function (data) {
        //        console.log(data);
        //    });
        //};

        $scope.TempObj = {
            "IsProcedureNotesTemplateSavePopOver": false,
            "IsComplicationsTemplateSavePopOver": false,
            "EnterProcedureNotesTemplateName": "",
            "EnterComplicationsTemplateName": "",
            "EnterFindingsTemplateName": "",
            "EnterSurgeonTemplateName": "",
        }

        $scope.clickcreatetemplateover = {
            templateUrl: 'AddProcedureNotesTemplatSave.html',
        };
     

        $scope.Complicationstemplateover = {
            templateUrl: 'AddComplicationsTemplatSave.html',
        };

        $scope.Findingstemplateover = {
            templateUrl: 'AddFindingsTemplatSave.html',
        };

        $scope.Surgeontemplateover = {
            templateUrl: 'AddSurgeonTemplatSave.html',
        };

       

        $scope.IsOpenFindingsTemp = function () {
            $scope.IsOpenFindings = true;
        }

        $scope.IsOpenSurgeonTemp = function () {
            $scope.IsOpenSurgeon = true;
        }



        $scope.SaveProcedureNotesTemplate = function () {
            $scope.TempObj.EnterProcedureNotesTemplateName = $scope.TempObj.EnterProcedureNotesTemplateName || "";
            $scope.OperativeNotesObj.ProcedureDetails = $scope.OperativeNotesObj.ProcedureDetails || '';
            if ($scope.OperativeNotesObj.ProcedureDetails=='') {
                alertify.error("Please Enter Procedure Notes!");
                return false;
            }
            if ($scope.TempObj.EnterProcedureNotesTemplateName === "") {
                alertify.error("Please Enter Template Name!");
                return false;
            } else {
                let templateReq = {
                    "UserId": $scope.UserId || "",
                    "HospitalId": $scope.HospitalId || "",
                    "TemplateId": 0,
                    "TemplateName": $scope.TempObj.EnterProcedureNotesTemplateName || "",
                    "DeleteInd": "N",
                    "TemplateNotes": [],
                    "TypeId": '4',
                    "TypeName": 'ProcedureDetails',
                };
                templateReq.TemplateNotes = $scope.OperativeNotesObj.ProcedureDetails || "";
                /*console.log(templateReq);*/
                eHnoteSurgeryService.AddUpdateIntraOpTemplates(templateReq).then(function (resp) {
                    if (resp.data.Status === "Success") {
                        alertify.success("Template saved successfully!");
                        $scope.TempObj.EnterProcedureNotesTemplateName = "";
                        $scope.TempObj.IsProcedureNotesTemplateSavePopOver = false;
                        $scope.GetPreOpMedicineCheckListTemplates();
                        //$uibModalInstance.close();
                    }
                    if (resp.data.status === "Failure") {
                        alertify.error('TemplateName Already Exists')
                    }
                }, function (err) {
                    console.log(err);
                });

            }

        };

        $scope.SaveComplicationsTemplate = function () {
            $scope.TempObj.EnterComplicationsTemplateName = $scope.TempObj.EnterComplicationsTemplateName || "";
            if ($scope.OperativeNotesObj.Complications == '') {
                alertify.error("Please Enter Complications !");
                return false;
            }
            if ($scope.TempObj.EnterComplicationsTemplateName === "") {
                alertify.error("Please Enter Template Name!");
                return false;
            } else {
                let templateReq = {
                    "UserId": $scope.UserId || "",
                    "HospitalId": $scope.HospitalId || "",
                    "TemplateId": 0,
                    "TemplateName": $scope.TempObj.EnterComplicationsTemplateName || "",
                    "DeleteInd": "N",
                    "TemplateNotes": [],
                    "TypeId": '2',
                    "TypeName": 'Complications',
                };


                templateReq.TemplateNotes = $scope.OperativeNotesObj.Complications || "";
                /*console.log(templateReq);*/
                eHnoteSurgeryService.AddUpdateIntraOpTemplates(templateReq).then(function (resp) {
                    if (resp.data.Status === "Success") {
                        alertify.success("Template saved successfully!");
                        $scope.TempObj.EnterComplicationsTemplateName = "";
                        $scope.TempObj.IsComplicationsTemplateSavePopOver = false;
                        $scope.GetPreOpMedicineCheckListTemplates();
                        //$uibModalInstance.close();
                    }
                    if (resp.data.status === "Failure") {
                        alertify.error(resp.data.Message)
                    }
                }, function (err) {
                    console.log(err);
                });

            }

        };
       
        //$scope.GetPreOpMedicineCheckListTemplates();
        $scope.OperativeNotesObj.ProcedureDetailsInd = false;
        $scope.OnselectProcedureNotesTemplates = function (item) {
            item.TemplateNotes = item.TemplateNotes || "";
            $scope.OperativeNotesObj.ProcedureDetailsInd = true;
            if (item.TemplateNotes != '') {
                $scope.OperativeNotesObj.ProcedureDetails = item.TemplateNotes || "";
            }
            else {
                $scope.OperativeNotesObj.ProcedureDetails = '';
            }
        }

        $scope.ClearProcedureTempNotes = function (item) {
            if (item == '') {

                $scope.OperativeNotesObj.SelectedProcedureNotesTemplate = 'Select';
            }
        }
        $scope.ClearComplicationsTempNotes = function (item) {
            if (item == '') {

                $scope.OperativeNotesObj.SelectedSurgicalComplicationsTemplate = 'Select';
            }
        }
        $scope.ClearFindingsTempNotes = function (item) {
            if (item == '') {
                $scope.OperativeNotesObj.SelectedFindingsTemplate = 'Select';
            }
        }
        $scope.ClearSurgeonOperativeTempNotes = function (item) {
            if (item == '') {
                $scope.OperativeNotesObj.SelectedSurgeonOperativeTemplate = 'Select';
            }
        }

        $scope.OnOperativeScreenLoad = function () {

            let req = {
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
            };
            
            let req1 = {
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
            };

            let obj = {
                "HospitalId": $scope.HospitalId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            }
            
            

            $q.all([
                eHnoteSurgeryService.GetIntraOPSurgicalNoteTemplates(req),
                /*eHnoteSurgeryService.GetIntraOPSurgicalNoteTemplates(req1),*/
                eHnoteSurgeryService.GetOperativeNotesDetails(obj)
            ]).then(function (resp) {

                if (resp[0].data.Status === "Success") {
                    $scope.OperativeNotesObj.ProcedureDetailsTempList = resp[0].data.ProcedureTemplates || [];
                    $scope.OperativeNotesObj.ComplicationTemplatesList = resp[0].data.ComplicationTemplates || [];
                    $scope.OperativeNotesObj.FindingsDetailsTempList = resp[0].data.FindingsTemplates || [];
                    $scope.OperativeNotesObj.SurgeonOperativeTemplatesList = resp[0].data.IntraOPSurgeonTemplates || [];
                }

                //if (resp[1].data.Status === "Success") {
                //    $scope.OperativeNotesObj.ComplicationTemplatesList = resp[1].data.ComplicationTemplates || [];
                //}

                if (resp[1].data.Status == "Success") {

                  
                    if (resp[1].data.Diagnosis.length > 0) {
                        $scope.OperativeNotesObj.Diagnosis = resp[1].data.Diagnosis;
                    }
                    if (resp[1].data.LastSignOffUserDetails.length > 0) {
                        $scope.OperativeNotesObj.LastSignOffUserDetails = resp[1].data.LastSignOffUserDetails;
                    }                 
                    if (resp[1].data.rows.length > 0) {

                        $scope.isAddingScreenVisible = false;
                        $scope.isEditScreenVisible = true;


                        $scope.OperativeNotesObj.Complications = resp[1].data.rows[0].Complications || "";
                        $scope.OperativeNotesObj.Findings = resp[1].data.rows[0].Findings || "";
                        $scope.OperativeNotesObj.SurgeonOperativeNotes = resp[1].data.rows[0].SurgeonOperativeNotes || "";
                        $scope.OperativeNotesObj.ProcedureDetails = resp[1].data.rows[0].ProcedureDetails || "";


                        $scope.OperativeNotesObj.Complications = $scope.OperativeNotesObj.Complications.replace(/\n/g, '<br>');
                        $scope.OperativeNotesObj.Findings = $scope.OperativeNotesObj.Findings.replace(/\n/g, '<br>');
                        $scope.OperativeNotesObj.SurgeonOperativeNotes = $scope.OperativeNotesObj.SurgeonOperativeNotes.replace(/\n/g, '<br>');                       
                        $scope.OperativeNotesObj.ProcedureDetails = $scope.OperativeNotesObj.ProcedureDetails.replace(/\n/g, '<br>');
                        $scope.OperativeNotesObj.OperativeReviewedDate = resp[1].data.rows[0].OperativeReviewedDate;
                        $scope.OperativeNotesObj.OperativeNotesReviewedBy = resp[1].data.rows[0].OperativeNotesReviewedBy || null;

                        $scope.OperativeNotesObj.OperativeReviewedDate = $filter('date')($scope.OperativeNotesObj.OperativeReviewedDate, "MM-dd-yyyy hh:mm a");

                        $scope.OperativeNotesObj.OperativeNotesReviewedBy = $scope.OperativeNotesObj.OperativeNotesReviewedBy || 0;
                        if ($scope.OperativeNotesObj.OperativeNotesReviewedBy != 0) {
                            var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.OperativeNotesObj.OperativeNotesReviewedBy }, true);
                            if (TempFilter.length > 0) {
                                $scope.OperativeNotesObj.OperativeReviewedName = angular.copy(TempFilter[0].FullName);
                                $scope.OperativeNotesObj.OperativeReviewedNameSuffix = angular.copy(TempFilter[0].SuffixName);
                                $scope.OperativeNotesObj.ReviewedByLicenseNumber = angular.copy(TempFilter[0].LicenseNumber);
                                if (TempFilter[0].SuffixId == 10) {
                                    $scope.OperativeNotesObj.OperativeReviewedName = ' Dr. ' + $scope.OperativeNotesObj.OperativeReviewedName;
                                }
                            }
                            else {
                                $scope.OperativeNotesObj.OperativeReviewedName = '';
                                $scope.OperativeNotesObj.OperativeReviewedNameSuffix = '';
                                $scope.OperativeNotesObj.ReviewedByLicenseNumber = '';
                            }
                        }

                        if ($scope.OperativeNotesObj.Complications != '') {
                            $scope.OperativeNotesObj.ComplicationsInd = true;
                        }
                        if ($scope.OperativeNotesObj.Findings !="") {
                            $scope.OperativeNotesObj.FindingsInd  = true;
                        }
                        if ($scope.OperativeNotesObj.SurgeonOperativeNotes !='') {
                            $scope.OperativeNotesObj.SurgeonOperativeNotesInd = true; 
                        }
                        if ($scope.OperativeNotesObj.ProcedureDetails !='') {
                            $scope.OperativeNotesObj.ProcedureDetailsInd = true;
                        }

                        $scope.OperativeNotesObj.OperativeChartStatus = resp[1].data.rows[0].OperativeChartStatus;

                        //if (resp[1].data.rows[0].Complications == '' || resp[1].data.rows[0].Complications == null) {
                        //    $scope.OperativeNotesObj.Complications = resp[1].data.Complications || "";
                        //} else {
                        //    $scope.OperativeNotesObj.Complications = resp[1].data.rows[0].Complications;
                        //}

                      

                        //if (resp[1].data.rows[0].Findings == '' || resp[1].data.rows[0].Findings == null) {
                        //    $scope.OperativeNotesObj.Findings = resp[1].data.DischargeFindings;
                        //} else {
                        //    $scope.OperativeNotesObj.Findings = resp[1].data.rows[0].Findings;
                        //}

                        //if (resp[1].data.rows[0].SurgeonOperativeNotes == '' || resp[1].data.rows[0].SurgeonOperativeNotes == null) {
                        //    $scope.OperativeNotesObj.SurgeonOperativeNotes = resp[1].data.PostOpSurgeonOperativeNotes;
                        //} else {
                        //    $scope.OperativeNotesObj.SurgeonOperativeNotes = resp[1].data.rows[0].SurgeonOperativeNotes;
                        //}

                        //$scope.OperativeNotesObj.Findings = resp[1].data.rows[0].Findings;
                        //$scope.OperativeNotesObj.SurgeonOperativeNotes = resp[1].data.rows[0].SurgeonOperativeNotes;
                        $scope.Diagnosis = resp[1].data.Diagnosis || [];
                        $scope.ImplantsDetailsArray = resp[1].data.ImplantsDetailsArray || [];
                        $scope.SurgicalHistoryArray = resp[1].data.SurgicalHistoryArray || [];
                        $scope.SystemicHistoryArray = resp[1].data.SystemicHistoryArray || [];
                        $scope.AllergyItemsArray = resp[1].data.AllergyItemsArray || [];
                        $scope.CurrentEyeMedicationList = resp[1].data.CurrentEyeMedicationList || [];
                        $scope.CurrentSystemicMedicationList = resp[1].data.CurrentSystemicMedicationList || [];
                       
                    } else {
                        $scope.Diagnosis = resp[1].data.Diagnosis || [];
                        $scope.ImplantsDetailsArray = resp[1].data.ImplantsDetailsArray || [];
                        $scope.OperativeNotesObj.Complications = resp[1].data.ComplicationsNotes || "";
                        $scope.SurgicalHistoryArray = resp[1].data.SurgicalHistoryArray || [];
                        $scope.SystemicHistoryArray = resp[1].data.SystemicHistoryArray || [];
                        $scope.AllergyItemsArray = resp[1].data.AllergyItemsArray || [];
                        $scope.CurrentEyeMedicationList = resp[1].data.CurrentEyeMedicationList || [];
                        $scope.CurrentSystemicMedicationList = resp[1].data.CurrentSystemicMedicationList || [];
                    }

                }
                else {
                    $scope.isAddingScreenVisible = true;
                    $scope.isEditScreenVisible = false;
                }


               

                $scope.AllNurseList = angular.copy($scope.allUserList);
                $scope.AllNurseList = _.uniq($scope.AllNurseList, false, function (p) { return p.DoctorID; });
                $scope.AllNurseList = $filter("filter")($scope.AllNurseList, function (item) {
                    return item.RoleId === 8;
                });

                $scope.OperativeNotesObj.SurgeryList = resp[1].data.SurgeryList || [];
                $scope.OperativeNotesObj.SurgeryList = $scope.OperativeNotesObj.SurgeryList || [];
                if ($scope.OperativeNotesObj.SurgeryList.length > 0) {

                    angular.forEach($scope.OperativeNotesObj.SurgeryList, function (item) {

                        var surgerylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.SurgeonId }, true);
                        if (surgerylist.length > 0) {
                            $scope.SurgeryDiagnosisObj.Surgeon = angular.copy(surgerylist[0].FullName);
                            $scope.SurgeryDiagnosisObj.SurgeonID = angular.copy(item.SurgeonId);
                        } else {
                            $scope.SurgeryDiagnosisObj.Surgeon = $scope.SurgeryDiagnosisObj.Surgeon || '';
                        }

                        item.SurgeonId = item.SurgeonId || null;
                        if (item.SurgeonId != null) {
                            var surgerylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.SurgeonId }, true);
                            if (surgerylist.length > 0) {
                                $scope.SurgeryDiagnosisObj.Surgeon = angular.copy(surgerylist[0].FullName);
                                $scope.SurgeryDiagnosisObj.SurgeonID = angular.copy(item.SurgeonId);
                            } else {
                                $scope.SurgeryDiagnosisObj.Surgeon = $scope.SurgeryDiagnosisObj.Surgeon || '';
                            }
                        } else {
                            var surgerylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.cacheStorageItem.DoctorID }, true);
                            if (surgerylist.length > 0) {
                                $scope.SurgeryDiagnosisObj.Surgeon = angular.copy(surgerylist[0].FullName);
                                $scope.SurgeryDiagnosisObj.SurgeonID = angular.copy(item.SurgeonId);
                            } else {
                                $scope.SurgeryDiagnosisObj.Surgeon = $scope.SurgeryDiagnosisObj.Surgeon || '';
                            }
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
                            $scope.SurgeryDiagnosisObj.ICDCode = item.DiagnosisList[0].ICDCode;
                        }

                        $scope.SurgeryDiagnosisObj.Diagnosis2 = $scope.SurgeryDiagnosisObj.Diagnosis2 || '';
                        if (item.DiagnosisList.length > 1) {
                            $scope.SurgeryDiagnosisObj.Diagnosis2 = item.DiagnosisList[1].DiagnosisName;
                            $scope.SurgeryDiagnosisObj.ICDCode2 = item.DiagnosisList[1].ICDCode;
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


                //$scope.MainObj.IsSummaryNav = false;
            });

        };

        $scope.OnOperativeScreenLoad();

        $scope.$on("SummaryNavSubEvent", function (event, data) {
            if (data == 0) {
                $scope.ChangeTab(9);
            } else if (data == 1) {
                $scope.ChangeTab(2);
            } else if (data == 2) {
                $scope.ChangeTab(3);
            } else if (data == 3) {
                $scope.ChangeTab(4);
            } else if (data == 4) {
                $scope.ChangeTab(11);
            } else if (data == 5) {
                $scope.OnOperativeScreenLoad();
            }
            
        });

        $scope.ShowFilesPopup = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/FilesPopUp.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal in  ",
                //"windowClass": "offcanves-right",
                "scope": $scope,
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.closeuibpopup = function () {
                        $uibModalInstance.dismiss();
                    };
                },
            });
        };

        $scope.Ascbasicdetailspopup = function () {

            let reqIds = {
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "HospitalId": $scope.HospitalId,
                "ParenthospitalId": $scope.ParenthospitalId || null,
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
                    "SurgeryList": function () { return $scope.OperativeNotesObj.SurgeryList; },
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
                            "ParentOrganizationId": $scope.ParenthospitalId || null,
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
                            "AppointmentTypeId": 4,
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

                    $scope.OnOperativeScreenLoad();
                }
            }, function (cancel) {

            });
        }
    
        $scope.AddTemplateFindingNotes = function () {
         
            if ($scope.OperativeNotesObj.Findings == '') {
                alertify.error("Please Enter Findings!");
                return false;
            }
            if ($scope.TempObj.EnterFindingsTemplateName === "") {
                alertify.error("Please Enter Template Name!");
                return false;
            } else {
                let templateReq = {
                    "UserId": $scope.UserId || "",
                    "HospitalId": $scope.HospitalId || "",
                    "TemplateId": 0,
                    "TemplateName": $scope.TempObj.EnterFindingsTemplateName || "",
                    "DeleteInd": "N",
                    "TemplateNotes": [],
                    "TypeId": '3',
                    "TypeName": 'Findings',
                };
                templateReq.TemplateNotes = $scope.OperativeNotesObj.Findings || "";                
                eHnoteSurgeryService.AddUpdateIntraOpTemplates(templateReq).then(function (resp) {
                    if (resp.data.Status === "Success") {
                        alertify.success("Template saved successfully!");
                        $scope.GetFindingsAndSergeonTemplates();
                        $scope.IsOpenFindings = false;
                        $scope.TempObj.EnterFindingsTemplateName = '';
                    }
                    if (resp.data.status === "Failure") {
                        alertify.error('TemplateName Already Exists')
                    }
                }, function (err) {
                    console.log(err);
                });

            }

        };

      
        $scope.AddTemplateSurgeonOperativeNotes = function () {
            
            if ($scope.OperativeNotesObj.SurgeonOperativeNotes == '') {
                alertify.error("Please Enter Surgeon Operative Notes!");
                return false;
            }
            if ($scope.TempObj.EnterSurgeonTemplateName === "") {
                alertify.error("Please Enter Template Name!");
                return false;
            } else {
                let templateReq = {
                    "UserId": $scope.UserId || "",
                    "HospitalId": $scope.HospitalId || "",
                    "TemplateId": 0,
                    "TemplateName": $scope.TempObj.EnterSurgeonTemplateName || "",
                    "DeleteInd": "N",
                    "TemplateNotes": [],
                    "TypeId": '1',
                    "TypeName": 'SurgeonOperative',
                };
                templateReq.TemplateNotes = $scope.OperativeNotesObj.SurgeonOperativeNotes || "";
                /*console.log(templateReq);*/
                eHnoteSurgeryService.AddUpdateIntraOpTemplates(templateReq).then(function (resp) {
                    if (resp.data.Status === "Success") {
                        alertify.success("Template saved successfully!");                      
                        $scope.GetFindingsAndSergeonTemplates();
                        $scope.IsOpenSurgeon = false;
                        $scope.TempObj.EnterSurgeonTemplateName = ''
                    }
                    if (resp.data.status === "Failure") {
                        alertify.error('TemplateName Already Exists')
                    }
                }, function (err) {
                    console.log(err);
                });

            }

        };

        $scope.GetFindingsAndSergeonTemplates = function () {
            let req = {
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
            };
            eHnoteSurgeryService.GetIntraOPSurgicalNoteTemplates(req).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.OperativeNotesObj.FindingsDetailsTempList = [];
                    $scope.OperativeNotesObj.FindingsDetailsTempList = resp.data.FindingsTemplates || [];
                    $scope.OperativeNotesObj.SurgeonOperativeTemplatesList = [];
                    $scope.OperativeNotesObj.SurgeonOperativeTemplatesList = resp.data.IntraOPSurgeonTemplates || [];
                }

            }, function (err) {
                console.log(err);
            });
        };

        $scope.ChangeOperativeReviewedbyItem = function (Id) {
            var TempFilter = $filter('filter')($scope.OperativeArray, { 'DoctorID': Id }, true);
            if (TempFilter.length > 0) {
                $scope.OperativeNotesObj.OperativeNotesReviewedBy = TempFilter[0].DoctorID;
                $scope.OperativeNotesObj.OperativeReviewedName = TempFilter[0].FullName;
                $scope.OperativeNotesObj.OperativeReviewedNameSuffix = angular.copy(TempFilter[0].SuffixName);
                $scope.OperativeNotesObj.ReviewedByLicenseNumber = angular.copy(TempFilter[0].LicenseNumber);
            } else {
                $scope.OperativeNotesObj.OperativeNotesReviewedBy = null;
                $scope.OperativeNotesObj.OperativeReviewedName = '';
                $scope.OperativeNotesObj.OperativeReviewedNameSuffix = '';
                $scope.OperativeNotesObj.ReviewedByLicenseNumber = '';
            }
        };
        $scope.OnselectFindingsTemplates = function (item) {
            item.TemplateNotes = item.TemplateNotes || "";
            $scope.OperativeNotesObj.FindingsInd = true;
            if (item.TemplateNotes != '') {
                $scope.OperativeNotesObj.Findings = item.TemplateNotes || "";
            }
            else {
                $scope.OperativeNotesObj.Findings = '';
            }
        };
        $scope.OnselectSurgeonOperativeTemplates = function (item) {
            item.TemplateNotes = item.TemplateNotes || "";
            $scope.OperativeNotesObj.SurgeonOperativeNotesInd = true;
            if (item.TemplateNotes != '') {
                $scope.OperativeNotesObj.SurgeonOperativeNotes = item.TemplateNotes || "";
            }
            else {
                $scope.OperativeNotesObj.SurgeonOperativeNotes = '';
            }
        };

        $scope.UnsignFromSumary = function (item) {

            let obj = {
                "Screen": "OperativeNotes",
                "Type": "Unsign",
                "allUserList": angular.copy($scope.allUserList) || [],
            };
            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/SignOffPassword.html",
                "controller": "UsSignOffPasswordPopupCtrl",
                "size": "md",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": " ",
                "resolve": {
                    "obj": function () { return obj; }
                }
            });
            signmodalInstance.result.then(function (resp) {
                $scope.NavFromSumaryOperativeNotes($scope.OperativeNotesObj);
            }, function (data) {
            });
        }

        $scope.NavFromSumaryOperativeNotes = function (item) {
            $scope.isAddingScreenVisible = true;
            $scope.isEditScreenVisible = false;

            $scope.OperativeNotesObj.Complications = item.Complications.replace(/<br>/g, '\n');
            $scope.OperativeNotesObj.Findings = item.Findings.replace(/<br>/g, '\n');
            $scope.OperativeNotesObj.SurgeonOperativeNotes = item.SurgeonOperativeNotes.replace(/<br>/g, '\n');
            $scope.OperativeNotesObj.ProcedureDetails = item.ProcedureDetails.replace(/<br>/g, '\n');

            if (item.Complications != '') {
                $scope.OperativeNotesObj.ComplicationsInd = true;
            }
            if (item.Findings != "") {
                $scope.OperativeNotesObj.FindingsInd = true;
            }
            if (item.SurgeonOperativeNotes != '') {
                $scope.OperativeNotesObj.SurgeonOperativeNotesInd = true;
            }
            if (item.ProcedureDetails != '') {
                $scope.OperativeNotesObj.ProcedureDetailsInd = true;
            }
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
        $scope.HeaderLogo = '';
        $scope.OperativeNotesPrint = function () {
            if (doctorinfo.doctordata.UserAddress.length > 0) {
                var EhnoteLogoURL = [];
                EhnoteLogoURL = doctorinfo.doctordata.UserAddress[0].OrganizationLogoUrl;
            }
            if (EhnoteLogoURL !== '') {
                var EhnoteLogo = '';
                if (EhnoteLogoURL !== '') {
                    $scope.toDataURL(EhnoteLogoURL, function (dataURL) {
                        EhnoteLogo = dataURL;
                        $scope.HeaderLogo = EhnoteLogo;
                    });
                } else {
                    $scope.HeaderLogo = EhnoteLogo;
                }
            }
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                if (doctorinfo.doctordata.User[0].Suffix !== '') {
                    CreatedByName = CreatedByName+doctorinfo.doctordata.User[0].FullName + ' ' + doctorinfo.doctordata.User[0].Suffix || "";
                } else {
                    CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
                }
            }
            $scope.Surgeondoctor = '';
            $scope.Anesthetist = '';
            $scope.PreOpDiagnosis = '';
            $scope.SurgeryName = '';
            $scope.OrganId = "";
            $scope.OrganName = "";
            var Surgeonlist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.cacheStorageItem.DoctorID });
            if (Surgeonlist.length > 0) {
                $scope.Surgeondoctor = Surgeonlist[0].FullName;
                if (Surgeonlist[0].SuffixId == 10) {
                    $scope.Surgeondoctor = ' Dr. ' + $scope.Surgeondoctor;
                }
                if (Surgeonlist[0].SuffixName !== '') {
                    $scope.Surgeondoctor = $scope.Surgeondoctor + ' ' + Surgeonlist[0].SuffixName;
                }
            }
            if ($scope.OperativeNotesObj.SurgeryList.length > 0) {
                angular.forEach($scope.OperativeNotesObj.SurgeryList, function (sitem) {
                    var Anesthesistlist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == sitem.AnesthetistId });
                    if (Anesthesistlist.length > 0) {
                        $scope.Anesthetist = Anesthesistlist[0].FullName;
                        if (Anesthesistlist[0].SuffixId == 10) {
                            $scope.Anesthetist = ' Dr. ' + $scope.Anesthetist;
                        }
                        if (Anesthesistlist[0].SuffixName !== '') {
                            $scope.Anesthetist = $scope.Anesthetist + ' ' + Anesthesistlist[0].SuffixName;
                        }
                    }
                    if (sitem.SurgeryName !== '' && sitem.SurgeryName !== null) {
                        $scope.SurgeryName = sitem.SurgeryName;
                    }
                    if (sitem.DiagnosisList.length > 0) {
                        angular.forEach(sitem.DiagnosisList, function (sitem) {
                            var IcdCode = '';
                            if (sitem.ICDCode !== '' && sitem.ICDCode !== null) {
                                IcdCode = sitem.ICDCode;
                            }
                            if ($scope.PreOpDiagnosis !== '') {
                                $scope.PreOpDiagnosis = $scope.PreOpDiagnosis + ' , ' + IcdCode + '-' + sitem.DiagnosisName;
                            }
                            if ($scope.PreOpDiagnosis == '') {
                                $scope.PreOpDiagnosis = IcdCode + '-' + sitem.DiagnosisName;
                            }
                        });
                    }
                    $scope.OrganId = sitem.OrganId || "";
                    if (sitem.OrganId !== '' && sitem.OrganId !== null) {
                        if ($scope.OrganId == 1) {
                            $scope.OrganName = "OD";
                        } else if ($scope.OrganId == 2) {
                            $scope.OrganName = "OS";
                        } else if ($scope.OrganId == 3) {
                            $scope.OrganName = "OU";
                        } else if ($scope.OrganId == 4) {
                            $scope.OrganName = "General";
                        }
                    }
                });
            } else {
                $scope.Surgeondoctor = '';
                $scope.Anesthetist = '';
                $scope.PreOpDiagnosis = '';
                $scope.SurgeryName = '';
                $scope.OrganId = "";
                $scope.OrganName = "";
            }
            $timeout(function () {
                var Object = {
                    'SurgeryDate': $scope.SurgeryDiagnosisObj.SurgeryDate || '',
                    'OperativeProcedure': $scope.SurgeryDiagnosisObj.OperativeProcedure || '',
                    'OrganId': $scope.SurgeryDiagnosisObj.OrganId || '',
                    'Surgeon': $scope.Surgeondoctor || '',
                    "Anesthetist": $scope.Anesthetist || '',
                    "Diagnosis": $scope.PreOpDiagnosis || '',
                    "SurgeryName": $scope.SurgeryName || '',
                    "OrganName": $scope.OrganName || '',
                    "CreatedBy": CreatedByName,
                    "ConsultationDate": $scope.cacheStorageItem.AppointmentDate || '',
                    "AppointmentTime": $scope.cacheStorageItem.AppointmentTime || '',
                    "Name": $scope.cacheStorageItem.PatientName || '',
                    "Age": $scope.cacheStorageItem.Age || '',
                    "Gender": $scope.cacheStorageItem.Gender || '',
                    "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
                    "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                    "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
                    "PostOpDiagnosisArray": $scope.OperativeNotesObj.Diagnosis || [], /*PostOpDiagnosis*/
                    "LensUsedArray": $scope.ImplantsDetailsArray || [],
                    "ProcedureNotes": $scope.OperativeNotesObj.ProcedureDetails || '',
                    "ComplicationsNotes": $scope.OperativeNotesObj.Complications || '',
                    "Findings": $scope.OperativeNotesObj.Findings || '',
                    "SurgeonOperativeNotes": $scope.OperativeNotesObj.SurgeonOperativeNotes || '',
                    "VisitType": $scope.cacheStorageItem.AppointmentType || '',
                    "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                    "EhnoteLogoURL": $scope.HeaderLogo || '',
                    "SignOffUserDetails": $scope.OperativeNotesObj.LastSignOffUserDetails || [],
                    "OperativeReviewedName": $scope.OperativeNotesObj.OperativeReviewedName || '',
                    "OperativeReviewedNameSuffix": $scope.OperativeNotesObj.OperativeReviewedNameSuffix ||'',
                    "ReviewedByLicenseNumber": $scope.OperativeNotesObj.ReviewedByLicenseNumber ||'',
                    "OperativeReviewedDate": $scope.OperativeNotesObj.OperativeReviewedDate || '',
                }
                USPrintService.GenerateASCOperativeNotesPrint(Object);
            }, 500);
        }
    }]);
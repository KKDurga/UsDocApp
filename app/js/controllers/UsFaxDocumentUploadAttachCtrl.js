eHnoteWebApp.controller('UsFaxDocumentUploadAttachCtrl', ['$scope', '$rootScope', '$filter', 'eHnoteProcedureDataService', 'eHnoteMasterDataService', 'datacookieFactory', 'eHnoteCacheStorageService', 'eHnoteValidateUsersDataService', 'eHnotePatientDataService', '$location', 'alertify', 'eHnoteLoginStatusService', 'eHnotePrintService', 'eHnoteMainAppointmentService', '$window', 'eHnoteDiagnosisDataServices', "Lightbox", "eHnoteSettingsDataService", "textAngularManager", "taRegisterTool", "$timeout", "$uibModal", "$uibModalInstance", "$compile", "eHnoteSurgeryService", "eHnotePatientVisitReasonServices", "datapersistanceFactory", "eHnoteUserAppointmentDataService", "localStorageFactory", "ChartObj","eHnotePatientAddressDataServices",
    function ($scope, $rootScope, $filter, eHnoteProcedureDataService, eHnoteMasterDataService, datacookieFactory, eHnoteCacheStorageService, eHnoteValidateUsersDataService, eHnotePatientDataService, $location, alertify, eHnoteLoginStatusService, eHnotePrintService, eHnoteMainAppointmentService, $window, eHnoteDiagnosisDataServices, Lightbox, eHnoteSettingsDataService, textAngularManager, taRegisterTool, $timeout, $uibModal, $uibModalInstance, $compile, eHnoteSurgeryService, eHnotePatientVisitReasonServices, datapersistanceFactory, eHnoteUserAppointmentDataService, localStorageFactory, ChartObj, eHnotePatientAddressDataServices) {


        var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }
        ChartObj.attachments = ChartObj.attachments || [];
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };
       
        $scope.SortByDate = 1;
        $scope.SelectedFile = 1;
        $scope.SortByDateASC = "Asc";
        $scope.PreviousUrl = "/op";
        $scope.PaitentDetails = $scope.PaitentDetails || {};
        // new design code 
        $scope.DocumentMainObjTab = {
            "TabNo": 1
        }
        

        $scope.selectedApptDates = eHnoteMasterDataService.getSelectedCrmApptDates();

        console.log($scope.selectedApptDates);
        if ($scope.selectedApptDates.Screen != "") {
            $scope.PreviousUrl = $scope.selectedApptDates.Screen;
        }
       

        console.log($scope.PreviousUrl);
        var FromDate = moment($scope.currentdate).subtract(90, 'days').format('MM-DD-YYYY');
        $scope.uibclose = function () {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.GetFilesObj = function () {
            return {

                "UserID": eHnoteMasterDataService.getLoginId(),
                "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "PatientID": ChartObj.patientID || 0,
                "AppointmentID": 0,
                "VisitId": 0,
                "TreatmentPlanId": 0,
                "PatientName": "",
                "Remarks": "",
                "SignedDate": $filter('date')(new Date(), "yyyy-MM-dd"),
                "OrgConsentFormId": "",
                "FileTypeId": "",
                "IsPartiallyUploaded": "",
                "LabTestId": "",
                "ShowNewConsultation": "N",
                "DocumentDetails": [],
                "TempImagesArray": [],

            };
        };
        $scope.FilesObj = angular.copy($scope.GetFilesObj());
        $scope.GetLogObj = function () {
            return {
                "UserId": eHnoteMasterDataService.getLoginId() || null,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID || null,
                "AppointmentId": 0,
                "PatientId": ChartObj.patientID || 0,
                "LogArray": [],
                "DocumentDetails": []
            }
        }
        $scope.LogObj = $scope.GetLogObj();
        $scope.AddReamrksinEditDocument = function (obj) {
            if (obj.DocumentID == 0) {
                obj.ShowRemarks = true;
                return;
            }

            console.log($scope.PreviousUrl + "__" + $scope.UserAccessRights.AllAccessRights.OPFileEdit);

            if ($scope.PreviousUrl === '/op') {
                if (!$scope.UserAccessRights.AllAccessRights.OPFileRemarks) {
                    if (obj.IsUserEditDeleteReamrksAccess == true) {
                        obj.ShowRemarks = true;
                    } else {
                        alertify.error("You do not have access. Please contact an administrator");
                        return false;
                    }
                } else {
                    obj.ShowRemarks = true;
                }
            }
            console.log($scope.PreviousUrl + "__" + $scope.UserAccessRights.AllAccessRights.CRMFileEdit);

            if ($scope.PreviousUrl === '/crm') {
                if (!$scope.UserAccessRights.AllAccessRights.CRMFileRemarks) {
                    if (obj.IsUserEditDeleteReamrksAccess == true) {
                        obj.ShowRemarks = true;
                    } else {
                        alertify.error("You do not have access. Please contact an administrator");
                        return false;
                    }
                } else {
                    obj.ShowRemarks = true;
                }
            }
        };
        $scope.SearchObj = {
            "FromDate": FromDate,
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "Type": "CreatedDate",
        }
        $scope.DocumentTypeArray = [
            {
                "Id": 1,
                "Name": "General",
                "IsChecked": true
            },
            {
                "Id": 11,
                "Name": "Surgery Consents",
                "IsChecked": true
            },
            {
                "Id": 12,
                "Name": "Appointment Consents",
                "IsChecked": true
            },
            {
                "Id": 13,
                "Name": "Medical Records",
                "IsChecked": true
            },
            {
                "Id": 10,
                "Name": "Referral",
                "IsChecked": true
            },
            {
                "Id": 14,
                "Name": "Other Documents",
                "IsChecked": true
            },
            {
                "Id": 15,
                "Name": "Authorization",
                "IsChecked": true
            },
            {
                "Id": 16,
                "Name": "Drawing Pad",
                "IsChecked": true
            },
            {
                "Id": 5,
                "Name": "Investigation",
                "IsChecked": true
            },
            {
                "Id": 18,
                "Name": "PreOP",
                "IsChecked": true
            },
            {
                "Id": 17,
                "Name": "PreAdmission",
                "IsChecked": true
            },
            {
                "Id": 19,
                "Name": "IntraOp-(Nurse)",
                "IsChecked": true
            },
            {
                "Id": 20,
                "Name": "IntraOp-(Anesthetist)",
                "IsChecked": true
            },
            {
                "Id": 21,
                "Name": "IntraOp-(Surgeon)",
                "IsChecked": true
            },
            {
                "Id": 22,
                "Name": "PostOp-(Nurse)",
                "IsChecked": true
            },
            {
                "Id": 23,
                "Name": "PostOp-(Anesthetist)",
                "IsChecked": true
            },
            {
                "Id": 24,
                "Name": "PostOp-(Surgeon)",
                "IsChecked": true
            },
            {
                "Id": 25,
                "Name": "PostOp-(Discharge)",
                "IsChecked": true
            },
            {
                "Id": 26,
                "Name": "Pre-anesthesia-Cardiovascular",
                "IsChecked": true
            },
            {
                "Id": 27,
                "Name": "Cardiologist Evaluation",
                "IsChecked": true
            },
            {
                "Id": 28,
                "Name": "Cardiologist Evaluation-Cardiovascular",
                "IsChecked": true
            },
            {
                "Id": 29,
                "Name": "PreAdmission Checklist",
                "IsChecked": true
            },
            {
                "Id": 30,
                "Name": "Admit Checklist",
                "IsChecked": true
            },          
            {
                "Id": 36,
                "Name": "Pentacam Report",
                "IsChecked": true
            },
          
        ];
        $scope.GetAllPatientUploadsNew = async function () {

            let DocumentTypeList = "";

            for (let i in $scope.DocumentTypeArray) {
                if ($scope.DocumentTypeArray[i].IsChecked) {
                    DocumentTypeList += "," + $scope.DocumentTypeArray[i].Id;
                }
            }

            if (DocumentTypeList.charAt(0) === ",") {
                DocumentTypeList = DocumentTypeList.slice(1);
            }


            var obj = {
                "PatientId": ChartObj.patientID || null,
                "FromDate": $filter('date')($scope.SearchObj.FromDate, "yyyy-MM-dd"),
                "ToDate": $filter('date')($scope.SearchObj.ToDate, "yyyy-MM-dd"),
                "Type": $scope.SearchObj.Type,
                "SortByDateASC": $scope.SortByDateASC || "",
                "SortByDocuType": DocumentTypeList || "",
            }
            const resp = await eHnoteDiagnosisDataServices.GetAllPatientUploadsNew(obj);
            if (resp !== undefined) {
                $scope.PatientimageFile = resp.data.rows || [];
                //console.log($scope.PatientimageFile);
                $scope.SelectedAppointmentUploadFiles = [];
                $scope.currentAppointmentInd = 0;
                $scope.SelectedDate1 = '';
                if ($scope.PatientimageFile.length > 0) {
                    angular.forEach($scope.PatientimageFile, function (item) {
                        if (item.Files.length > 0) { item.ShowData = true; }
                    });
                }
                $scope.MainDocumentObj.Apptcount = $scope.PatientimageFile.length||0;
                CheckuncheckUpdates();
                $scope.MainDocumentObj.SelectedApptDate = $scope.MainDocumentObj.SelectedApptDate || '';
                if ($scope.MainDocumentObj.SelectedApptDate != '') {
                    const index = $scope.PatientimageFile.findIndex(function (item) {
                        return item.DateValue === $scope.MainDocumentObj.SelectedApptDate;
                    });
                    if (index !== -1) {
                        $scope.PatientAllDocumentsList = []
                        $scope.AllPatientDocumentsCopy = [];
                        $scope.GetDocumentListEvent($scope.PatientimageFile[index]);
                    } else {
                        $scope.GetDocumentListEvent($scope.PatientimageFile[0]);
                    }
                }
                else {
                    $scope.GetDocumentListEvent($scope.PatientimageFile[0]);
                }
            }
        };
        $scope.isPopoverOpen = false;
        $scope.togglePopover = function ($event) {
            $event.stopPropagation(); // prevent document click
            $scope.isPopoverOpen = !$scope.isPopoverOpen;
        };
        function CheckuncheckUpdates() {
            var attachedDocIds = ChartObj.attachments.map(function (doc) {
                return doc.DocumentID;
            });
            $scope.PatientimageFile.forEach(function (doc) {
                if (doc.Files.length > 0) {
                    doc.Files.forEach(function (docitem) {
                        if (attachedDocIds.includes(docitem.DocumentID)) {
                            docitem.isSelected = true;
                            var alreadyExists = $scope.AttachmentsArray.some(function (a) {
                                return a.DocumentID === docitem.DocumentID;
                            });
                            if (!alreadyExists) {
                                var attachmentObj = {
                                    FileId: 0,
                                    FileName: docitem.FileName,
                                    S3URL: docitem.DocURL,
                                    ExternalFileName: docitem.FileName,
                                    FileExt: docitem.FileExt,
                                    ConsultationId: null,
                                    MimeType: null,
                                    CreatedByUser: doctorinfo.doctordata.User[0].FullName,
                                    CreatedDate: $scope.currentdate,
                                    DeleteInd: "N",
                                    DirectSecureMessageId: 0,
                                    DocumentID: docitem.DocumentID || 0,
                                    isSelected: true
                                };
                                $scope.AttachmentsArray.push(attachmentObj);
                            }
                        } else {
                            docitem.isSelected = false;
                        }
                    })
                }
            });
        };
        
        $scope.AttachmentsArray = ChartObj.attachments || [];
        $scope.DocumnetsAttched = $scope.DocumnetsAttched || [];
        $scope.SearchDocumentList = function () {
            if ($scope.DocumentMainObjTab.TabNo == 1) {
                getAllPatientDocumentsVisitById();
            }
            if ($scope.DocumentMainObjTab.TabNo == 2) {
                $scope.GetAllPatientUploadsNew();
            }
            $scope.isPopoverOpen = false;
        }
        $scope.PushFiles = async function (item, event) {
            var attachmentObj = {
                "FileId": 0,
                "FileName": item.FileName,
                "S3URL": item.DocURL,
                "ExternalFileName": item.FileName,
                "FileExt": item.FileExt,
                "ConsultationId": null,
                "MimeType": null,
                "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                "CreatedDate": $scope.currentdate,
                "DeleteInd": "N",
                "DirectSecureMessageId": 0,
                "DocumentID": item.DocumentID || 0,
                "isSelected": item.isSelected ||false
            };
            var existingIndex = $scope.AttachmentsArray.findIndex(function (attachment) {
                return attachment.DocumentID === attachmentObj.DocumentID;
            });
            if (attachmentObj.isSelected) {
                if (existingIndex !== -1) {
                    $scope.AttachmentsArray[existingIndex] = attachmentObj;
                } else {
                    $scope.AttachmentsArray.push(attachmentObj);
                }
            }
            else {
                if (existingIndex !== -1) {
                    $scope.AttachmentsArray.splice(existingIndex, 1);
                }
            }
            let filescount = angular.copy($scope.PatientAllDocumentsList.filter(file => file.isSelected == true).length);
            $scope.MainDocumentObj.selectAllDcoument = (filescount == $scope.PatientAllDocumentsList.length) ? true : false;
            //$scope.PatientAllDocumentsList.forEach
            //if (event.target.checked) {

            //    /* $scope.eObj.AttachmentsArray.push(attachmentObj);*/
            //} else {
            //    //$scope.AttachmentsArray = $scope.AttachmentsArray.filter(function (attachment) {
            //    //    return attachment.FileName !== item.FileName;
            //    //});
            //    //$scope.eObj.AttachmentsArray = $scope.eObj.AttachmentsArray.filter(function (attachment) {
            //    //    return attachment.FileName !== item.FileName;
            //    //});
            //}
        };
        $scope.CreateAttachments = function () {
            $scope.AttachmentsArray = $scope.AttachmentsArray || [];
            if ($scope.AttachmentsArray.length == 0) {
                alertify.error("Please Select Atleast one Document");
                return false;
            }
            if ($scope.AttachmentsArray.length > 0) {
                angular.forEach($scope.AttachmentsArray, function (fitem) {
                    var existingIndex = $scope.DocumnetsAttched.findIndex(function (doc) {
                        return doc.DocumentID === fitem.DocumentID;
                    });

                    var attachmentObj = {
                        "FileId": 0,
                        "FileName": fitem.FileName,
                        "fileUrl": fitem.S3URL,
                        "S3URL": fitem.S3URL,
                        "ExternalFileName": fitem.ExternalFileName,
                        "FileExt": fitem.FileExt,
                        "ConsultationId": null,
                        "MimeType": null,
                        "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                        "CreatedDate": $scope.currentdate,
                        "DeleteInd": "N",
                        "DirectSecureMessageId": 0,
                        "DocumentID": fitem.DocumentID || 0,
                        "isSelected": fitem.isSelected || false
                    };

                    if (existingIndex !== -1) {
                        // Update existing item
                        $scope.DocumnetsAttched[existingIndex] = attachmentObj;
                    } else {
                        // Push new item
                        $scope.DocumnetsAttched.push(attachmentObj);
                    }
                });
                $uibModalInstance.close($scope.DocumnetsAttched);
            };
        };
        $scope.selectedImgs = function (files) {

            if ($scope.FilesObj.SignedDate < $scope.currentDate) {
                $scope.FilesObj = angular.copy($scope.GetFilesObj());
            }

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
                            "FileTypeId": parseInt($scope.SelectedFile),
                            "S3URL": "",
                            "Remarks": "",
                            "IsEdit": true,
                            /* "DeleteInd": false, Db Side Adding as String So Chnaged This*/
                            "DeleteInd": "N",
                            "IsShowEditDeleteInd": true,
                            "DocumentID": 0,
                            "DisplayName": $scope.file.name || "",
                            "FileName": $scope.file.name || "",
                            "DocumentExt": $scope.file.type,
                            "FileExt": $scope.file.type,
                            "IsUserEditDeleteReamrksAccess": true,
                            "Thumbnail": "",
                        };
                        if ($scope.file.type != 'application/pdf') {
                            let reader = new FileReader();
                            reader.onload = function (event) {
                                let img = new Image();
                                img.src = event.target.result;
                                img.onload = function () {
                                    let canvas = document.createElement("canvas");
                                    let ctx = canvas.getContext("2d");

                                    // Define thumbnail size (e.g., 100x100 pixels)
                                    let maxWidth = 100;
                                    let maxHeight = 120;
                                    let width = img.width;
                                    let height = img.height;

                                    // Maintain aspect ratio
                                    if (width > height) {
                                        height *= maxWidth / width;
                                        width = maxWidth;
                                    } else {
                                        width *= maxHeight / height;
                                        height = maxHeight;
                                    }

                                    canvas.width = width;
                                    canvas.height = height;
                                    ctx.drawImage(img, 0, 0, width, height);

                                    // Convert to Base64 and store it
                                    obj.Thumbnail = canvas.toDataURL("image/png");

                                    $scope.FilesObj.TempImagesArray.push(obj);
                                    $scope.$apply();

                                };
                            };

                            reader.readAsDataURL(item);
                            //    $scope.FilesObj.TempImagesArray.push(obj);
                        } else {
                            $scope.FilesObj.TempImagesArray.push(obj);
                        }




                        angular.element("input[type='file']").val(null);
                    }
                });
            }
            $scope.IsDisabled = false;
        };
        $scope.PatientFileUpload = function () {
            var obj = {
                "UserID": eHnoteMasterDataService.getLoginId(),
                "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "PatientID": ChartObj.patientID || 0,
                "PatientName": $scope.PaitentDetails.FullName || '',
                "AppointmentID": $scope.FilesObj.AppointmentID || 0,
                "AppointmentDate": "",
                "VisitId": $scope.FilesObj.VisitId || 0,
                "TreatmentPlanId": 0,
                "Remarks": "",
                "SignedDate": $filter('date')($scope.FilesObj.SignedDate, "yyyy-MM-dd"),
                "OrgConsentFormId": $scope.SelectedConsertFromId,
                "FileTypeId": parseInt($scope.SelectedFile),
                "IsPartiallyUploaded": "N",
                "LabTestId": 0,
                "ShowNewConsultation": "N",
                "DocumentDetails": [],
                "TempDocumentDetails": [],
                "Logs": {}
            };
            $scope.LogObj.LogArray = [];
            $scope.FilesObj.TempImagesArray = $scope.FilesObj.TempImagesArray || [];
            if ($scope.FilesObj.TempImagesArray.length > 0) {
                angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
                    item.DocumentID = item.DocumentID || 0;

                    var object = {
                        "file": item.file,
                        "S3URL": item.S3URL || '',
                        "FileTypeId": item.FileTypeId,
                        "Remarks": item.Remarks || '',
                        "DeleteInd": item.DeleteInd,
                        "DocumentID": item.DocumentID,
                        "DisplayName": item.DisplayName,
                        "FileName": item.FileName,
                        "FileExt": item.FileExt,
                        "Thumbnail": item.Thumbnail,

                    };

                    if (item.DocumentID === 0) {
                        obj.TempDocumentDetails.push(object);

                    }
                    else {
                        obj.DocumentDetails.push(object);
                    }
                });
                //  here the documentid  =0 and  !=0 are pusing the DocumentDetails in loops  for the s3 url ganarating in api requirement 
                angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
                    item.DocumentID = item.DocumentID || 0;
                    var object = {
                        "file": item.file,
                        "S3URL": item.S3URL || '',
                        "FileTypeId": item.FileTypeId,
                        "Remarks": item.Remarks || '',
                        "DeleteInd": item.DeleteInd,
                        "DocumentID": item.DocumentID,
                        "DisplayName": item.DisplayName,
                        "FileName": item.FileName,
                        "FileExt": item.FileExt,
                    };
                    if (item.DocumentID != 0) {
                        // obj.DocumentDetails.push(object);
                    }
                })
            }
            $scope.SelectedDate = $filter('date')($scope.FilesObj.SignedDate, "yyyy-MM-dd");
            console.log(obj);
            // Logs 
            if (obj.DocumentDetails.length > 0) {

                let EditingDocumentList = $filter('filter')(obj.DocumentDetails, function (item) {
                    return item.DocumentID != 0;
                }) || [];
                let AddingDocumentsList = $filter('filter')(obj.DocumentDetails, { 'DocumentID': 0 }, true) || [];
                if (AddingDocumentsList.length > 0) {
                    angular.forEach(AddingDocumentsList, function (item) {
                        let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': item.FileTypeId }, true);
                        let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                        let logobj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC  ",
                            "SubModuleId": 24,
                            "SubModuleName": "Documents",
                            "ScreenType": "ASC List",
                            "ActionType": "Imported",
                            "ActionDescription": ActionDescription,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(logobj);
                    });
                }
                if (EditingDocumentList.length > 0) {

                    let NewValue = EditingDocumentList || [];
                    let OldValue = $scope.LogObj.DocumentDetails || [];
                    NewValue.forEach(function (Newitem) {
                        var differentItem = OldValue.filter(function (olditem) {
                            olditem.Value = olditem.Value || "";
                            return ((olditem.DocumentID == Newitem.DocumentID) && (olditem.FileTypeId == Newitem.FileTypeId) && (olditem.Remarks == Newitem.Remarks))
                        }) || [];
                        if (differentItem.length == 0) {
                            let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': Newitem.FileTypeId }, true);
                            let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                            let obj = {
                                "LogId": 0,
                                "ModuleId": 2,
                                "ModuleName": "ASC",
                                "SubModuleId": 24,
                                "SubModuleName": "Documents",
                                "ScreenType": "ASC List",
                                "ActionType": "Edited",
                                "ActionDescription": ActionDescription,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                    });
                }
            }

            obj.Logs = angular.copy($scope.LogObj);

            eHnoteDiagnosisDataServices.AddPatientfileUpload(obj, OnFilesObjMaterialSuccess, OnFilesObjMaterialError);

            function OnFilesObjMaterialSuccess(data) {
                alertify.success("Image uploaded successfully");
                $scope.FilesObj = angular.copy($scope.GetFilesObj());
                $scope.GetAllPatientUploadsNew();
                $scope.IsDisabled = true;

            }

            function OnFilesObjMaterialError(data) {
                console.log(data);
                $scope.IsDisabled = false;
            }
        };
        $scope.DeleteUploadedFileNew = function (item, index, mainitem) {
            if (item.DocumentID == 0) {
                $scope.FilesObj.TempImagesArray.splice(index, 1);
            } else {


                console.log($scope.PreviousUrl + "__" + $scope.UserAccessRights.AllAccessRights.OPFileEdit);

                if ($scope.PreviousUrl === '/op') {
                    if (!$scope.UserAccessRights.AllAccessRights.OPFileDelete && !item.IsUserEditDeleteReamrksAccess) {
                        // alertify.error("you dont have access,please contact manager");
                        alertify.error("You do not have access. Please contact an administrator");
                        return false;
                    } else {
                        continuetodeletefile(item, index, mainitem)
                    }
                }
                console.log($scope.PreviousUrl + "__" + $scope.UserAccessRights.AllAccessRights.CRMFileEdit);

                if ($scope.PreviousUrl === '/crm') {
                    if (!$scope.UserAccessRights.AllAccessRights.CRMFileDelete && !item.IsUserEditDeleteReamrksAccess) {
                        // alertify.error("you dont have access,please contact manager");
                        alertify.error("You do not have access. Please contact an administrator");
                        return false;
                    } else {
                        continuetodeletefile(item, index, mainitem)
                    }
                }
                if ($scope.PreviousUrl === 'ASC') {
                    if (!$scope.UserAccessRights.AllAccessRights.OPFileDelete && !item.IsUserEditDeleteReamrksAccess) {
                        // alertify.error("you dont have access,please contact manager");
                        alertify.error("You do not have access. Please contact an administrator");
                        return false;
                    } else {
                        continuetodeletefile(item, index, mainitem)
                    }
                }

            }
        };
        function continuetodeletefile(item, index, mainitem) {
            $scope.DeleteFileUploadArray = { "DocumentID": item.DocumentID, "FileName": item.DocumentName, "Remarks": "" };
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                $scope.DeleteDate = mainitem.SignedDate;
                var params = {
                    "AppointmentID": item.AppointmentId,
                    "DeleteIndicator": 0,
                    "ImagesArray": [],
                    "UploadType": "Delete",
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "Remarks": "",
                    "Logs": {}
                };
                params.ImagesArray.push($scope.DeleteFileUploadArray);
                $scope.LogObj.LogArray = [];
                let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': item.FileTypeId }, true);
                let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`
                if (params.ImagesArray.length > 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 24,
                        "SubModuleName": "Documents",
                        "ScreenType": "ASC List",
                        "ActionType": "Deleted",
                        "ActionDescription": ActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
                params.Logs = angular.copy($scope.LogObj);
                eHnoteDiagnosisDataServices.DeletePatientConsultationImg(params, onupdateDeletesuccess, onupdateDelerror);
            }, function () { });
            function onupdateDeletesuccess(response) {
                if (response.Status === 'Success') {
                    alertify.success("File deleted successfully");

                    let DocumentTypeList = "";
                    for (let i in $scope.DocumentTypeArray) {
                        if ($scope.DocumentTypeArray[i].IsChecked) {
                            DocumentTypeList += "," + $scope.DocumentTypeArray[i].Id;
                        }
                    }
                    if (DocumentTypeList.charAt(0) === ",") {
                        DocumentTypeList = DocumentTypeList.slice(1);
                    }
                    var obj = {
                        "PatientId": ChartObj.patientID || null,
                        "FromDate": $filter('date')($scope.SearchObj.FromDate, "yyyy-MM-dd"),
                        "ToDate": $filter('date')($scope.SearchObj.ToDate, "yyyy-MM-dd"),
                        "Type": $scope.SearchObj.Type,
                        "SortByDateASC": $scope.SortByDateASC || "",
                        "SortByDocuType": DocumentTypeList || "",
                    }
                    eHnoteDiagnosisDataServices.GetAllPatientUploadsNew(obj).then(function (resp) {
                        $scope.PatientimageFile = resp.data.rows || [];
                        $scope.SelectedAppointmentUploadFiles = [];
                        $scope.currentAppointmentInd = 0;

                        if ($scope.PatientimageFile.length > 0) {
                            angular.forEach($scope.PatientimageFile, function (item) {
                                item.ShowData = true;
                            });
                        }

                        let tempfileArray = $filter('filter')($scope.PatientimageFile, { 'DateValue': $scope.DeleteDate }, true);
                        if (tempfileArray.length > 0) {
                            $scope.FilesObj = angular.copy($scope.GetFilesObj());
                            $scope.FilesObj.SignedDate = tempfileArray[0].DateValue;
                            if (tempfileArray[0].Files.length > 0) {
                                angular.forEach(tempfileArray[0].Files, function (item) {
                                    $scope.IsShowEditDeleteInd = true;

                                    //if (($scope.UserId == item.CreatedById) || ($scope.userLoginDetails.RoleID == 63 || $scope.userLoginDetails.RoleID == 65 || $scope.userLoginDetails.RoleID == 67 || $scope.userLoginDetails.RoleID == 69 || $scope.userLoginDetails.RoleID == 70 || $scope.userLoginDetails.RoleID == 71)) {
                                    //    $scope.IsShowEditDeleteInd = true;
                                    //}

                                    console.log($scope.PreviousUrl + "__" + $scope.UserAccessRights.AllAccessRights.OPFileEdit);

                                    var IsUserEditDeleteReamrksAccess = item.CreatedById == $scope.UserId ? true : false;


                                    var obj = {
                                        "file": "",
                                        "DocURL": item.DocURL,
                                        "S3URL": item.DocURL,
                                        "FileTypeId": item.FileTypeId,
                                        "Remarks": item.Remarks || "",
                                        "IsShowEditDeleteInd": $scope.IsShowEditDeleteInd || false,
                                        "DeleteInd": false,
                                        "DocumentID": item.DocumentID,
                                        "DocumentName": item.DocName || "",
                                        "FileName": item.DocName || "",
                                        "DisplayName": item.DisplayName || "",
                                        "DocumentExt": item.FileExt,
                                        "FileExt": item.FileExt,
                                        "IsUserEditDeleteReamrksAccess": IsUserEditDeleteReamrksAccess || false,
                                        "Thumbnail": item.Thumbnail,
                                    };

                                    $scope.FilesObj.TempImagesArray.push(obj);
                                });
                            }


                        }

                        if (tempfileArray.length == 0) {
                            $scope.FilesObj = angular.copy($scope.GetFilesObj());
                        }

                    });
                }
            }
            function onupdateDelerror(errordata) {
                console.log(errordata);
            }
        }

        $scope.ClearFilename = function (item) {
            item.FileName = '';
        }
        $scope.scanFiles = function () {
            var obj = {
                "PatientId": appoint_info.PatientID || null,
                "AppointmentId": $scope.MainDocumentObj.AppointmentID || null,
                "AppointmentDate": $scope.MainDocumentObj.AppointmentDate||null,
                "PatientName": appoint_info.PatientName || '',
                "Tab": "FileUploads",
                "SignedDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
                "FileTypeId": parseInt($scope.SelectedFile),
                "IsPartiallyUploaded": "Y",
                "TreatmentPlanId": appoint_info.TreatmentPlanId,
                "ShowNewConsultation": "Y",
                "LabTestId": 0,
                "Remarks": '',
                "FileName": '',
                "DisplayName": '',
                "DocumentTypeArray": $scope.DocumentTypeArray || [],
                "AllVisitsArray": $scope.AllVisitsArray || [],
                "PatientVisitId": $scope.MainDocumentObj.selectedvisitid ||'',
                "VisitId": $scope.MainDocumentObj.selectedvisitid || '',
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
                "backdrop": "static",
                "scope": $scope,
                "size": "lg",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "windowClass": "modal__eighty-- z-index-seven",
                "keyboard": false,
                "controller": "DocumentScannerCtrl",
            });
            $scope.mInstanceAdd.result.then(function (data) {
                console.log(data);
                if ($scope.DocumentMainObjTab.TabNo == 1) {
                    $scope.GetAllPatientDcoumentsById();
                }
                if ($scope.DocumentMainObjTab.TabNo == 2) {
                    $scope.GetAllPatientUploadsNew();
                }
            }, function (cancel) {
            });

        }

        $scope.ClearData = function () {
            $scope.SelectedDate1 = '';
            $scope.FilesObj = angular.copy($scope.GetFilesObj());
        }
        $scope.ShowSelectedAppointmentUploadFilesnew = function (Obj) {
            console.log(Obj);
            $scope.FilesObj = angular.copy($scope.GetFilesObj());
            $scope.FilesObj.PatientID = Obj.PatientId;
            $scope.FilesObj.AppointmentID = Obj.AppointmentId;
            $scope.FilesObj.SignedDate = Obj.DateValue;
            if (Obj.Files.length > 0) {
                angular.forEach(Obj.Files, function (item) {
                    $scope.IsShowEditDeleteInd = true;
                    console.log($scope.PreviousUrl + "__" + $scope.UserAccessRights.AllAccessRights.OPFileEdit);
                    var IsUserEditDeleteReamrksAccess = item.CreatedById == $scope.UserId ? true : false;
                    var obj = {
                        "file": "",
                        "DocURL": item.DocURL,
                        "S3URL": item.DocURL,
                        "FileTypeId": item.FileTypeId,
                        "Remarks": item.Remarks || "",
                        "IsEdit": false,
                        "DeleteInd": false,
                        "IsShowEditDeleteInd": $scope.IsShowEditDeleteInd || false,
                        "DocumentID": item.DocumentID,
                        "DocumentName": item.DocName || "",
                        "DisplayName": item.DisplayName || "",
                        "FileName": item.DocName || "",
                        "DocumentExt": item.FileExt,
                        "FileExt": item.FileExt,
                        "IsUserEditDeleteReamrksAccess": IsUserEditDeleteReamrksAccess || false,
                        "Thumbnail": item.Thumbnail,
                    };

                    $scope.FilesObj.TempImagesArray.push(obj);
                });
                $scope.LogObj.DocumentDetails = angular.copy($scope.FilesObj.TempImagesArray) || [];
            }
        };
        $scope.EditUploadedFile = function (obj) {
            console.log($scope.PreviousUrl + "__" + $scope.UserAccessRights.AllAccessRights.OPFileEdit);
            if ($scope.PreviousUrl === '/op') {
                if (!$scope.UserAccessRights.AllAccessRights.OPFileEdit && !obj.IsUserEditDeleteReamrksAccess) {
                    // alertify.error("you dont have access,please contact manager");
                    alertify.error("You do not have access. Please contact an administrator");
                    return false;
                } else {
                    obj.ShowRemarks = true;
                    obj.IsEdit = true;
                }
            }
            console.log($scope.PreviousUrl + "__" + $scope.UserAccessRights.AllAccessRights.CRMFileEdit);
            if ($scope.PreviousUrl === '/crm') {
                if (!$scope.UserAccessRights.AllAccessRights.CRMFileEdit && !obj.IsUserEditDeleteReamrksAccess) {
                    //alertify.error("you dont have access,please contact manager");
                    alertify.error("You do not have access. Please contact an administrator");
                    return false;
                } else {
                    obj.ShowRemarks = true;
                    obj.IsEdit = true;
                }
            }
            if ($scope.PreviousUrl === 'ASC') {
                if (!$scope.UserAccessRights.AllAccessRights.OPFileEdit && !obj.IsUserEditDeleteReamrksAccess) {
                    // alertify.error("you dont have access,please contact manager");
                    alertify.error("You do not have access. Please contact an administrator");
                    return false;
                } else {
                    obj.ShowRemarks = true;
                    obj.IsEdit = true;
                }
            }
        };
        // new design documents ulopad by 1616 - 06-06-2025
        $scope.AllPatientDocumentsList = [];
        $scope.MainDocumentObj = {
            "selectAllDcoument": '',
            "SelectedApptDate": "",
            "selectedvisitid": 0,
            "selectedapptointmentid": 0,
            "Apptcount": 0,
            "PatientId": ChartObj.patientID||0,
            "PatientName": $scope.PaitentDetails.FullName||""
        }
        
        $scope.selectAllDocumnets = function () {
            console.log("check");
        }
        $scope.ChangeTab = function (Tabno) {
            $scope.DocumentMainObjTab.TabNo = Tabno;
            if ($scope.DocumentMainObjTab.TabNo==1) {
                getAllPatientDocumentsVisitById();
            }
            if ($scope.DocumentMainObjTab.TabNo==2) {
                $scope.GetAllPatientUploadsNew();
            }
        }
        $scope.GetAllDocumentType = function () {
            eHnotePatientAddressDataServices.GetAllDocumentType().then(function (resp) {
                let obj;
                $scope.DocumentTypeArray = [];
                angular.forEach(resp.data.NoteFilesTypes, function (item) {
                    obj = {
                        "Id": item.FileTypeId,
                        "Name": item.Filetype,
                        "IsChecked": true
                    };
                    $scope.DocumentTypeArray.push(obj);

                });
                $scope.DocumentTypeList = angular.copy($scope.DocumentTypeArray);
            }, function (err) {
                console.log(err);
                alertify.error("Getting DocumentType Failed");
            });
        };

        $scope.init = function () {
            // onload calling
            $scope.ChangeTab(1);
            $scope.GetAllDocumentType();
            // adding info to cache
            $scope.cacheStorageItem.PatientID = ChartObj.patientID || 0;
            $scope.cacheStorageItem.PatientName = $scope.PaitentDetails.FullName || 0;
            $scope.AddToCache();
        }
        $scope.init();
        $scope.navtoOpenVisitFileUploads = function (item) {

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/visitUploadFilesPopup.html",
                "backdrop": "static",
                "size": "lg",
                "windowClass": "zindexpopup",
                "keyboard": false,
                "resolve": {
                    "mainPatientProfileObj": function () { return $scope.MainDocumentObj; },
                    "doctorinfo": function () { return doctorinfo; },
                    "DocumentTypeArray": function () { return $scope.DocumentTypeArray; },
                    "UserAccessRights": function () { return $scope.UserAccessRights; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, mainPatientProfileObj, eHnoteMasterDataService, doctorinfo, DocumentTypeArray, $filter, eHnoteDiagnosisDataServices, UserAccessRights) {
                    let Edititem = item || '';
                    let MainObj = mainPatientProfileObj || '';
                    //let doctorinfo = doctorinfo
                    let PatientId = 0, AppointmentId = 0, VisitId = 0, PatientName = '';
                    $scope.DocumentTypeArray = DocumentTypeArray || [];
                    $scope.UserAccessRights = UserAccessRights || {};
                    if (MainObj != '') {
                        PatientId = MainObj.PatientId || 0
                        AppointmentId = MainObj.selectedapptointmentid || 0
                        VisitId = MainObj.selectedvisitid || 0
                        PatientName = MainObj.PatientName || ''
                    }
                    $scope.PreviousUrl = "/op";
                    $scope.selectedApptDates = eHnoteMasterDataService.getSelectedCrmApptDates();

                    if ($scope.selectedApptDates.Screen != "") {
                        $scope.PreviousUrl = $scope.selectedApptDates.Screen;
                    }
                    $scope.GetFilesObj = function () {
                        return {

                            "UserID": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "PatientID": PatientId || 0,
                            "AppointmentID": AppointmentId || 0,
                            "VisitId": VisitId || 0,
                            "TreatmentPlanId": 0,
                            "PatientName": PatientName || "",
                            "Remarks": "",
                            "SignedDate": $filter('date')(new Date(), "yyyy-MM-dd"),
                            "OrgConsentFormId": "",
                            "FileTypeId": "",
                            "IsPartiallyUploaded": "",
                            "LabTestId": "",
                            "ShowNewConsultation": "N",
                            "DocumentDetails": [],
                            "TempImagesArray": [],

                        };
                    };
                    $scope.FilesObj = angular.copy($scope.GetFilesObj());
                    $scope.GetLogObj = function () {
                        return {
                            "UserId": eHnoteMasterDataService.getLoginId() || null,
                            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID || null,
                            "AppointmentId": AppointmentId || null,
                            "PatientId": PatientId || null,
                            "LogArray": [],
                            "DocumentDetails": []
                        }
                    }
                    $scope.LogObj = $scope.GetLogObj();
                    if (Edititem != '') {
                        var IsUserEditDeleteReamrksAccess = Edititem.CreatedById == $scope.FilesObj.UserID ? true : false;

                        let obj = {
                            "DocumentID": Edititem.DocumentID,
                            "S3URL": Edititem.DocURL,

                            "DocumentName": Edititem.DocName || "",
                            "FileName": Edititem.FileName || "",
                            "DeleteInd": 'N',
                            "FileExt": Edititem.FileExt || "",
                            "Remarks": Edititem.Remarks || "",
                            "FileTypeId": Edititem.FileTypeId || 1,
                            "OrgConsentFormId": 0,
                            "SignedDate": Edititem.SignedDate || "",
                            "CreatedById": Edititem.CreatedById || 0,
                            "PatientId": Edititem.PatientId || 0,
                            "DisplayName": Edititem.DisplayName || "",
                            "Filetype": Edititem.Filetype || "",
                            "DoctorName": Edititem.DoctorName || "",
                            "IsUserEditDeleteReamrksAccess": IsUserEditDeleteReamrksAccess || false,

                        }
                        $scope.FilesObj.TempImagesArray.push(obj);
                    }
                    $scope.SelectedFile = Edititem.FileTypeId ||13;
                    $scope.file = null;
                    $scope.selectedImgs = function (files) {

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
                                        "FileTypeId": parseInt($scope.SelectedFile),
                                        "S3URL": "",
                                        "Remarks": "",
                                        "IsEdit": true,
                                        /* "DeleteInd": false, Db Side Adding as String So Chnaged This*/
                                        "DeleteInd": "N",
                                        "IsShowEditDeleteInd": true,
                                        "DocumentID": 0,
                                        "DisplayName": $scope.file.name || "",
                                        "FileName": $scope.file.name || "",
                                        "DocumentExt": $scope.file.type,
                                        "FileExt": $scope.file.type,
                                        "IsUserEditDeleteReamrksAccess": true
                                    };

                                    $scope.FilesObj.TempImagesArray.push(obj);


                                    angular.element("input[type='file']").val(null);
                                }
                            });
                        }
                        //    $scope.IsDisabled = false;
                    };
                    $scope.ChangeDocumentType = function () {
                        angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
                            item.DocumentID = item.DocumentID || 0;
                            if (item.DocumentID == 0) {
                                item.FileTypeId = parseInt($scope.SelectedFile);
                            }
                        });
                    }
                    $scope.DeleteUploadedFileNew = function (item, index, mainitem) {
                        if (item.DocumentID == 0) {
                            $scope.FilesObj.TempImagesArray.splice(index, 1);
                            alertify.success("File deleted successfully");

                        } else {
                            if ($scope.PreviousUrl === '/op') {
                                if (!$scope.UserAccessRights.AllAccessRights.OPFileDelete && !item.IsUserEditDeleteReamrksAccess) {
                                    // alertify.error("you dont have access,please contact manager");
                                    alertify.error("You do not have access. Please contact an administrator");
                                    return false;
                                } else {
                                    $scope.DeletePatientFilesByVisitId(item, index);
                                }
                            }


                            else if ($scope.PreviousUrl === '/crm') {
                                if (!$scope.UserAccessRights.AllAccessRights.CRMFileDelete && !item.IsUserEditDeleteReamrksAccess) {
                                    // alertify.error("you dont have access,please contact manager");
                                    alertify.error("You do not have access. Please contact an administrator");
                                    return false;
                                } else {
                                    $scope.DeletePatientFilesByVisitId(item, index);
                                }
                            }
                            else if ($scope.PreviousUrl === 'ASC') {
                                if (!$scope.UserAccessRights.AllAccessRights.OPFileDelete && !item.IsUserEditDeleteReamrksAccess) {
                                    // alertify.error("you dont have access,please contact manager");
                                    alertify.error("You do not have access. Please contact an administrator");
                                    return false;
                                } else {
                                    $scope.DeletePatientFilesByVisitId(item, index);
                                }
                            }
                            /*item.DeleteInd = 'Y';*/

                        }
                    }

                    $scope.PatientFileUpload = function () {

                        var obj = {
                            "UserID": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "PatientID": PatientId || 0,
                            "PatientName": PatientName || '',
                            "AppointmentID": AppointmentId || 0,
                            "VisitId": VisitId || 0,
                            "TreatmentPlanId": 0,
                            "Remarks": "",
                            "AppointmentDate": $filter('date')(MainObj.AppointmentDate, "yyyy-MM-dd"),
                            "SignedDate": $filter('date')($scope.FilesObj.SignedDate, "yyyy-MM-dd"),
                            "OrgConsentFormId": $scope.SelectedConsertFromId,
                            "FileTypeId": parseInt($scope.SelectedFile),
                            "IsPartiallyUploaded": "N",
                            "LabTestId": 0,
                            "ShowNewConsultation": "N",
                            "DocumentDetails": [],
                            "TempDocumentDetails": [],
                            "Logs": {}
                        };
                        $scope.LogObj.LogArray = [];
                        $scope.FilesObj.TempImagesArray = $scope.FilesObj.TempImagesArray || [];
                        if ($scope.FilesObj.TempImagesArray.length > 0) {
                            angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
                                item.DocumentID = item.DocumentID || 0;

                                var object = {
                                    "file": item.file,
                                    "S3URL": item.S3URL || '',
                                    "FileTypeId": parseInt(item.FileTypeId),
                                    "Remarks": item.Remarks || '',
                                    "DeleteInd": item.DeleteInd,
                                    "DocumentID": item.DocumentID,
                                    "DisplayName": item.DisplayName,
                                    "FileName": item.FileName,
                                    "FileExt": item.FileExt,
                                };
                                if (item.DocumentID === 0) {
                                    obj.TempDocumentDetails.push(object);

                                }
                                else {
                                    obj.DocumentDetails.push(object);
                                }
                            });
                            //  here the documentid  =0 and  !=0 are pusing the DocumentDetails in loops  for the s3 url ganarating in api requirement 
                            angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
                                item.DocumentID = item.DocumentID || 0;
                                var object = {
                                    "file": item.file,
                                    "S3URL": item.S3URL || '',
                                    "FileTypeId": parseInt($scope.SelectedFile),
                                    "Remarks": item.Remarks || '',
                                    "DeleteInd": item.DeleteInd,
                                    "DocumentID": item.DocumentID,
                                    "DisplayName": item.DisplayName,
                                    "FileName": item.FileName,
                                    "FileExt": item.FileExt,
                                };
                                if (item.DocumentID != 0) {
                                    // obj.DocumentDetails.push(object);
                                }
                            })
                        }


                        $scope.SelectedDate = $filter('date')($scope.FilesObj.SignedDate, "yyyy-MM-dd");

                        // Logs 
                        if (obj.DocumentDetails.length > 0) {

                            let EditingDocumentList = $filter('filter')(obj.DocumentDetails, function (item) {
                                return item.DocumentID != 0;
                            }) || [];
                            let AddingDocumentsList = $filter('filter')(obj.DocumentDetails, { 'DocumentID': 0 }, true) || [];
                            if (AddingDocumentsList.length > 0) {
                                angular.forEach(AddingDocumentsList, function (item) {
                                    let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': item.FileTypeId }, true);
                                    let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${AppointmentId}`;
                                    let logobj = {
                                        "LogId": 0,
                                        "ModuleId": 2,
                                        "ModuleName": "ASC  ",
                                        "SubModuleId": 24,
                                        "SubModuleName": "Documents",
                                        "ScreenType": "ASC List",
                                        "ActionType": "Imported",
                                        "ActionDescription": ActionDescription,
                                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                    };
                                    $scope.LogObj.LogArray.push(logobj);
                                });
                            }
                            if (EditingDocumentList.length > 0) {

                                let NewValue = EditingDocumentList || [];
                                let OldValue = $scope.LogObj.DocumentDetails || [];
                                NewValue.forEach(function (Newitem) {
                                    var differentItem = OldValue.filter(function (olditem) {
                                        olditem.Value = olditem.Value || "";
                                        return ((olditem.DocumentID == Newitem.DocumentID) && (olditem.FileTypeId == Newitem.FileTypeId) && (olditem.Remarks == Newitem.Remarks))
                                    }) || [];
                                    if (differentItem.length == 0) {
                                        let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': Newitem.FileTypeId }, true);
                                        let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${AppointmentId}`;
                                        let obj = {
                                            "LogId": 0,
                                            "ModuleId": 2,
                                            "ModuleName": "ASC",
                                            "SubModuleId": 24,
                                            "SubModuleName": "Documents",
                                            "ScreenType": "ASC List",
                                            "ActionType": "Edited",
                                            "ActionDescription": ActionDescription,
                                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                        };
                                        $scope.LogObj.LogArray.push(obj);
                                    }
                                });
                            }
                        }

                        obj.Logs = angular.copy($scope.LogObj);

                        eHnoteDiagnosisDataServices.AddPatientfileUpload(obj, OnFilesObjMaterialSuccess, OnFilesObjMaterialError);

                        function OnFilesObjMaterialSuccess(data) {
                            alertify.success("Image uploaded successfully");
                            $scope.FilesObj = angular.copy($scope.GetFilesObj());
                            $uibModalInstance.close("close");
                            $scope.IsDisabled = true;

                        }

                        function OnFilesObjMaterialError(data) {
                            console.log(data);
                            $scope.IsDisabled = false;
                        }
                    };


                    $scope.DeletePatientFilesByVisitId = function (sitem, index) {
                        let DeleteFileUploadArray = { "DocumentID": sitem.DocumentID, "FileName": sitem.FileName, "Remarks": "" };
                        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                            $scope.DeleteDate = sitem.SignedDate;
                            var params = {
                                "AppointmentID": sitem.AppointmentId,
                                "VisitId": sitem.VisitId,
                                "DeleteIndicator": 0,
                                "ImagesArray": [],
                                "UploadType": "Delete",
                                "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                                "Remarks": "",
                                "Logs": {}
                            };
                            params.ImagesArray.push(DeleteFileUploadArray);
                            $scope.LogObj.LogArray = [];
                            let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': sitem.FileTypeId }, true);
                            let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${sitem.AppointmentId}`
                            if (params.ImagesArray.length > 0) {
                                let obj = {
                                    "LogId": 0,
                                    "ModuleId": 2,
                                    "ModuleName": "ASC",
                                    "SubModuleId": 24,
                                    "SubModuleName": "Documents",
                                    "ScreenType": "ASC List",
                                    "ActionType": "Deleted",
                                    "ActionDescription": ActionDescription,
                                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                            params.Logs = angular.copy($scope.LogObj);
                            eHnoteDiagnosisDataServices.DeletePatientFilesByVisitId(params, onupdateDeletesuccess, onupdateDelerror);
                        }, function () { });
                        function onupdateDeletesuccess(response) {
                            if (response.Status === 'Success') {
                                alertify.success("File deleted successfully");
                                $scope.FilesObj.TempImagesArray.splice(index, 1);
                                //    $scope.GetAllPatientUploadsNew();
                            }
                        }
                        function onupdateDelerror(errordata) {
                            console.log(errordata);
                        }
                    }
                    $scope.uibclose = function () {
                        $uibModalInstance.close("close");

                    };
                }
            });
            $scope.mInstanceAdd.result.then(function (result) {

                if ($scope.DocumentMainObjTab.TabNo==1) {
                    $scope.GetAllPatientDcoumentsById();
                }
                if ($scope.DocumentMainObjTab.TabNo==2) {
                    $scope.GetAllPatientUploadsNew();
                }

            }, function (cancel) {
            });
        }
        
        $scope.DeletePatientFilesByVisitId = function (sitem, index) {
            let DeleteFileUploadArray = { "DocumentID": sitem.DocumentID, "FileName": sitem.FileName, "Remarks": "" };
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                $scope.DeleteDate = sitem.SignedDate;
                var params = {
                    "AppointmentID": sitem.AppointmentId,
                    "VisitId": sitem.VisitId,
                    "DeleteIndicator": 0,
                    "ImagesArray": [],
                    "UploadType": "Delete",
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "Remarks": "",
                    "Logs": {}
                };
                params.ImagesArray.push(DeleteFileUploadArray);
                $scope.LogObj.LogArray = [];
                let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': sitem.FileTypeId }, true);
                let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${sitem.AppointmentId}`
                if (params.ImagesArray.length > 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 24,
                        "SubModuleName": "Documents",
                        "ScreenType": "ASC List",
                        "ActionType": "Deleted",
                        "ActionDescription": ActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
                params.Logs = angular.copy($scope.LogObj);
                eHnoteDiagnosisDataServices.DeletePatientFilesByVisitId(params, onupdateDeletesuccess, onupdateDelerror);
            }, function () { });
            function onupdateDeletesuccess(response) {
                if (response.Status === 'Success') {
                    alertify.success("File deleted successfully");
                    /*$scope.FilesObj.TempImagesArray.splice(index, 1);*/
                    //    $scope.GetAllPatientUploadsNew();
                    if ($scope.DocumentMainObjTab.TabNo == 1) {
                        $scope.GetAllPatientDcoumentsById();
                    }
                    if ($scope.DocumentMainObjTab.TabNo == 2) {
                        $scope.GetAllPatientUploadsNew();
                    }
                }
            }
            function onupdateDelerror(errordata) {
                console.log(errordata);
            }
        }
        $scope.selectedDocumentTypeId = "";
        $scope.filesfilteringOnchange = function () {
            $scope.PatientAllDocumentsList = angular.copy($scope.AllPatientDocumentsCopy);
            if (!$scope.selectedDocumentTypeId) {
                $scope.PatientAllDocumentsList = angular.copy($scope.AllPatientDocumentsCopy); // Reset to all
                return; 
            }
            if ($scope.PatientAllDocumentsList.length == 0) {
                alertify.error("No files have been uploaded.");
                return false;
            }
            $scope.PatientAllDocumentsList = $scope.PatientAllDocumentsList.filter(function (doc) {
                return doc.FileTypeId === $scope.selectedDocumentTypeId;
            });
        }
        $scope.refreshDocuments = function () {
            $scope.PatientAllDocumentsList = angular.copy($scope.AllPatientDocumentsCopy);
        }
        function getAllPatientDocumentsVisitById() {
            let reqobj = {
                "PatientId": ChartObj.patientID || 0,
                "FromDate": $scope.SearchObj.FromDate||"",
                "ToDate": $scope.SearchObj.ToDate || ""
            }
            eHnoteDiagnosisDataServices.getAllPatientDocumentsByVisitId(reqobj).then(function (resp) {
                if (resp.data.Status=="Success") {
                    $scope.PatientAllApptList = resp.data.rows || [];
                    if ($scope.PatientAllApptList.length > 0) {
                         $scope.PatientAllApptList.forEach(uitem => {
                             uitem.visits?.forEach(subitem => {
                                 subitem.Isopen = false;
                                 subitem.IsVisitSignedDone = (
                                     (uitem.AppointmentTypeId !== 4 && uitem.AppointmentTypeId !== 14 && uitem.AppointmentTypeId !== 6 && uitem.AppointmentTypeId !== 7 && subitem.OPChartStatus === 'E') ||
                                     (uitem.AppointmentTypeId === 7 && uitem.StatusFlag === 'D')
                                 );
                             });
                         });
                    }
                    if (Array.isArray($scope.PatientAllApptList) && $scope.PatientAllApptList.length > 0) {
                        let selectedVisit = null;
                        let matchedVisitId = null;

                        for (let appt of $scope.PatientAllApptList) {
                            if (appt?.visits?.length) {
                                const matchedVisit = appt.visits.find(v => v.VisitId === ChartObj.visitid);
                                if (matchedVisit) {
                                    selectedVisit = appt;
                                    matchedVisitId = matchedVisit.VisitId;
                                    break;
                                }
                            }
                        }
                        if (selectedVisit) {
                            $scope.MainDocumentObj.selectedapptointmentid = selectedVisit.AppointmentId;
                            $scope.MainDocumentObj.selectedvisitid = matchedVisitId;
                            $scope.MainDocumentObj.Apptcount = $scope.PatientAllApptList.length;

                            $scope.navtoparticularAppt(selectedVisit);
                        } else {
                            console.warn("No valid appointment found.");
                        }

                    } else {
                        console.warn("PatientAllApptList is empty or not defined.");
                    }



                    $scope.MainDocumentObj.Apptcount = $scope.PatientAllApptList.length;
                    // for calling onload events 
                    //if ($scope.PatientAllApptList.length>0) {
                    //    $scope.navtoparticularAppt($scope.PatientAllApptList[0]);
                    //}
                }
            });
        }
        $scope.ShowAppointmentDetails = function (item) {
            var datetime = item.AppointmentDate + "T" + item.StartTime;
            item.NewStartTime = "";
            item.NewStartTime = $filter('date')(datetime, "hh:mm a");
            $scope.AppointmentDetails = [];
            var obj = {
                "NewStartTime": item.NewStartTime,
                "DoctorName": item.DoctorName,
                "AppointmentDate": item.AppointmentDate,
                "AppointmentId": item.AppointmentId,
                "HospitalName": item.HospitalName,

            }
            $scope.AppointmentDetails.push(obj);
        }
        
        $scope.GetDocumentListEvent = function (docitem) {
            $scope.MainDocumentObj.SelectedApptDate = docitem.DateValue || "";
            $scope.MainDocumentObj.selectAllDcoument = false;
            if (Array.isArray(docitem.Files) && docitem.Files.length > 0) {
                docitem.Files.forEach(file => file.isSelected = false);
                if (Array.isArray($scope.AttachmentsArray) && $scope.AttachmentsArray.length > 0) {
                    $scope.AttachmentsArray
                        .filter(attachment => attachment.isSelected)
                        .forEach(attachment => {
                            const match = docitem.Files.find(file => file.DocumentID === attachment.DocumentID);
                            if (match) match.isSelected = true;
                        });
                }
                const selectedCount = docitem.Files.filter(file => file.isSelected).length;
                $scope.MainDocumentObj.selectAllDcoument = (selectedCount === docitem.Files.length);
                $scope.PatientAllDocumentsList = angular.copy(docitem.Files);
                $scope.AllPatientDocumentsCopy = angular.copy($scope.PatientAllDocumentsList);
            } else {
                $scope.PatientAllDocumentsList = [];
                $scope.AllPatientDocumentsCopy = [];
            }
        }
        $scope.refreshfilters = function () {
            $scope.SearchObj.FromDate = FromDate;
            $scope.SearchObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
            $scope.SearchObj.Type = "CreatedDate";
            $scope.SearchDocumentList();
        }
        $scope.FilesDateinfoPopover = {
            templateUrl: 'templates/uibpopups/FilesDateinfoPopover.html',
        };
       
        $scope.navtoparticularAppt = function (mainitem) {
            $scope.MainDocumentObj.selectedapptointmentid = mainitem.AppointmentId || 0;
            $scope.MainDocumentObj.AppointmentID = mainitem.AppointmentId || 0;
            $scope.MainDocumentObj.AppointmentDate = mainitem.AppointmentDate || 0;
            $scope.navtoselectparticularVisit(mainitem.visits[0], mainitem);
        }
        $scope.navtoselectparticularVisit = function (visititem, mainitem, $event) {
            if ($event) {
                $event.stopPropagation();
            }
            $scope.MainDocumentObj.selectedvisitid = visititem.VisitId || 0;
            $scope.GetAllPatientDcoumentsById();
           
        };
        $scope.selectAllDocumnets = function (ischecked) {
            if (ischecked) {
                $scope.PatientAllDocumentsList.forEach(function (item) {
                    item.isSelected = true;
                    $scope.PushFiles(item);
                });
            }
            else {
                $scope.AttachmentsArray = $scope.AttachmentsArray.filter(function (attachment) {
                    return !$scope.PatientAllDocumentsList.some(function (doc) {
                               doc.isSelected = false;
                        return doc.DocumentID === attachment.DocumentID;
                    });
                });
            }
        }
        $scope.totalFileItems = 0;
        $scope.FilescurrentPage = 1;
        $scope.maxSize = 10;
        $scope.GetAllPatientDcoumentsById = function () {
            if ($scope.totalFileItems != 0 && $scope.totalFileItems <= $scope.maxSize) {
                $scope.FilescurrentPage = 1;
            } else {
                var totalPages = Math.ceil($scope.totalFileItems / $scope.maxSize);
                if ($scope.FilescurrentPage > totalPages) {
                    $scope.FilescurrentPage = totalPages;
                }
            }
            var obj = {
                "PatientId": ChartObj.patientID,
                "VisitId": $scope.MainDocumentObj.selectedvisitid||0,
                "FileTypeId": null,
                "PageSize": $scope.maxSize || 10,
                "PageNumber": $scope.FilescurrentPage || 1,
            }
            eHnoteDiagnosisDataServices.GetPatientFileUploadsByVisitId(obj).then(function (resp) {
                //$scope.PatientimageFile = resp.data.rows || [];
                $scope.currentAppointmentInd = 0;
                $scope.totalFileItems = resp.data.count;

                let Documentlist = resp.data.rows || [];
                $scope.MainDocumentObj.selectAllDcoument = false;
                if (Array.isArray(Documentlist) && Documentlist.length > 0) {
                    Documentlist.forEach(file => file.isSelected = false);
                    if (Array.isArray($scope.AttachmentsArray) && $scope.AttachmentsArray.length > 0) {
                        $scope.AttachmentsArray
                            .filter(attachment => attachment.isSelected)
                            .forEach(attachment => {
                                const match = Documentlist.find(file => file.DocumentID === attachment.DocumentID);
                                if (match) match.isSelected = true;
                            });
                    }
                    const selectedCount = Documentlist.filter(file => file.isSelected).length;
                    $scope.MainDocumentObj.selectAllDcoument = (selectedCount === Documentlist.length);
                    $scope.PatientAllDocumentsList = angular.copy(Documentlist);
                    $scope.AllPatientDocumentsCopy = angular.copy($scope.PatientAllDocumentsList);
                } else {
                    $scope.PatientAllDocumentsList = [];
                    $scope.AllPatientDocumentsCopy = [];
                }
            });
        };


    }]);
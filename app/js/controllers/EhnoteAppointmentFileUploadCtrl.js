"use strict";
eHnoteWebApp.controller("EhnoteAppointmentFileUploadCtrl", ["$scope", "$rootScope", "$filter", "eHnoteMasterDataService", "eHnoteCacheStorageService", "eHnotePatientDataService", "alertify", "eHnotePrintService", "eHnoteDiagnosisDataServices", "Lightbox", "eHnoteSettingsDataService", "$timeout", "$uibModal", "eHnoteUserAppointmentDataService", "eHnoteInsuranceService", "eHnotePatientAddressDataServices", "datapersistanceFactory", "eHnoteLoginStatusService", "$q", "eHnoteSurgeryService", function ($scope, $rootScope, $filter, eHnoteMasterDataService, eHnoteCacheStorageService, eHnotePatientDataService, alertify, eHnotePrintService, eHnoteDiagnosisDataServices, Lightbox, eHnoteSettingsDataService, $timeout, $uibModal, eHnoteUserAppointmentDataService, eHnoteInsuranceService, eHnotePatientAddressDataServices, datapersistanceFactory, eHnoteLoginStatusService, $q, eHnoteSurgeryService) {

    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

    console.log(appointmentinfo);
    $scope.AppId = appointmentinfo.AppointmentID;
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();


    $scope.PreviousUrl = "/op";
    $scope.selectedApptDates = eHnoteMasterDataService.getSelectedCrmApptDates();

    console.log($scope.selectedApptDates);
    if ($scope.selectedApptDates.Screen != "") {
        $scope.PreviousUrl = $scope.selectedApptDates.Screen;
    }

    console.log($scope.PreviousUrl);


    $scope.MainSpecialization = {
        "SpecializationId": $scope.doctorinfo.doctordata.User[0].SpecializationId
    }
    $scope.ShowNewConsultation = 'N';
    $scope.UserSettingObject = datapersistanceFactory.getItem('UserSettingsData');
    if ($scope.UserSettingObject !== undefined) {
        if ($scope.UserSettingObject.ShowNewConsultation) {
            $scope.ShowNewConsultation = 'Y';
        }
    }
    $scope.showInsuranceUploadTabOnly = false;
    $scope.IsDisabled = false;


    $scope.PreTreatmentFileUploadCount = 0;
    $scope.GeneralFileUploadCount = 0;
    $scope.PostTreatmentFileUploadCount = 0;
    $scope.ConsentsFileUploadCount = 0;
    $scope.SelectedFileName = "No file chosen...";
    $scope.files = [];
    $scope.file = "";
    var UploadConsentModal = "";

    if ($scope.doctorinfo.RoleID === 1) {
        $scope.DoctorId = $scope.doctorinfo.doctorid;
    } else {
        $scope.DoctorId = 0;
    }
    $rootScope.patientdetailesConsultation = true;
    $scope.$emit("patientInfoDetails", appointmentinfo);
    //$scope.currentDate = appointmentinfo.ConsultationDt;

    $scope.SelectedConsertFromId = 0;
    $scope.SelectedConsertFrom = "";
    var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.ConsentImageDataArray = cacheStorageItem.PatientConsertArray;
    $scope.ConsentPdfDataArray = cacheStorageItem.PatientPdfConsertArray;

    // getPatientNoteFiles();
    $scope.ConsentImageDataArray = [];
    $scope.ConsentPdfDataArray = [];
    $scope.patientfiles = "";
    $scope.FileUploadPDfArray = [];
    $scope.FileUploadImageArray = [];
    $scope.SelectedFile = 1;
    $scope.DeleteInd = false;
    $scope.DoctorConsertFromName = "";
    $scope.fileremarks = "";
    $scope.tab = 1;
    $scope.Subtab = 1;
    $scope.FileUploadIndex = 0;

    $scope.FileUploadLength = [];
    $scope.onSelectFilesUpload = function ($files) {
        $scope.patientfiles = $files;
    };
    $scope.TempFileUploadImgArray = [];
    $scope.TempFileUploadPdfArray = [];

    $scope.patientInsuranceTpasArray = [];

    $scope.DocumentTypeList = [];
    $scope.SelectedAppointmentUploadFiles = [];


    $scope.SortByDate = 1;
    $scope.SortByDateASC = "Asc";
    $scope.DocumentTypeArray = [
        {
            "Id": 1,
            "Name": "General",
            "IsChecked":true
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
        }
    ];
    
    


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

    $scope.GetAllAppointmentsByPatientId = function () {
        var obj = {
            "PatientId": $scope.cacheStorageItem.PatientID || null
        }
        eHnotePatientDataService.GetAllAppointmentsByPatientId(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.AllAppointments = [];
                $scope.AllVisitsArray = [];
                if (resp.data.VisitsArray.length > 0) {
                    $scope.AllVisitsArray = resp.data.VisitsArray || [];
                    if ($scope.AllVisitsArray.length > 0) {
                        angular.forEach($scope.AllVisitsArray, function (item) {
                            item.AppointmentformatDate = moment(item.VisitDate).format('MM-DD-YYYY');
                        });
                    }
                }

                if (resp.data.Rows.length>0) {
                    $scope.AllAppointments = resp.data.rows || [];
                    if ($scope.AllAppointments.length > 0) {
                        angular.forEach($scope.AllAppointments, function (item) {
                            item.AppointmentformatDate = moment(item.AppointmentDate).format('MM-DD-YYYY');
                        });
                    }
                }
            }

        }, function (err) {
            console.log(err);
        });
    };

    $scope.selectedInsTpaObj = "";

    function restructureUploads(docArray) {

        if (docArray.length > 0) {
            $scope.TempImagesArray = [];
            $scope.TempPdfArray = [];
            angular.forEach(docArray, function (kitem) {
                var pName = kitem.DocumentName, name = "";
                var type = kitem.DocumentExt.split("/")[1];
                if (pName.length > 9) {
                    name = pName.substring(0, 9) + "..." + "." + type;
                } else {
                    name = angular.copy(pName) + '.' + type;
                }
                kitem.FileName = name;
                if (kitem.DocumentExt != 'application/pdf') {
                    $scope.TempImagesArray.push(kitem);
                    $scope.tempPrecriptionCount++;
                }
                else {
                    $scope.TempPdfArray.push(kitem);
                }
            });
            console.log($scope.TempImagesArray);
            console.log($scope.TempPdfArray);
        }
    }
    $scope.getPatientinsurancepaDetails = function () {
        $scope.patientInsuranceTpasArray = [];
        $scope.selectedInsTpaObj = "";
        eHnoteInsuranceService.getPatientInsuranceDtls(appointmentinfo.PatientID).then(function (response) {
            console.log(response);
            if (response.data !== undefined) {
                if (response.data.rows.length > 0) {
                    $scope.patientInsuranceTpasArray = response.data.rows;
                    $scope.selectedInsTpaObj = $scope.patientInsuranceTpasArray[0];
                    $scope.TempImagesArray = [];
                    $scope.TempPdfArray = [];
                    if ($scope.selectedInsTpaObj.PatientDocumentDetails.length > 0) {
                        restructureUploads($scope.selectedInsTpaObj.PatientDocumentDetails);
                    }

                }
            }
        });
    }
    if (appointmentinfo.CaptureBillingFrom === 'RegisterPatient') {
        $scope.showInsuranceUploadTabOnly = true;
        $scope.getPatientinsurancepaDetails();

        $scope.tab = 3;
        $scope.Subtab = 1;
    }

    //var todate = moment($scope.currentdate).add(90, 'days').format('MM-DD-YYYY');
    var FromDate = moment($scope.currentdate).subtract(90, 'days').format('MM-DD-YYYY');
    $scope.SearchObj={
        "FromDate": FromDate,
        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
         //"FromDate":null,
        //"ToDate": null,
        "Type": "CreatedDate",

    }

    $scope.GetAllPatientUploadsNew = function () {

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
            "PatientId": $scope.cacheStorageItem.PatientID || null,
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
            $scope.SelectedDate1 = '';

            if ($scope.PatientimageFile.length > 0) {
                angular.forEach($scope.PatientimageFile, function (item) {
                    if (item.Files.length > 0) { item.ShowData = true; }

                });
            }
            


        });
    };
    $scope.UploadPage = 1;
    $scope.UploadPageSize = 100;
    $scope.UploadHasMore = false;
    $scope.UploadLoading = false;
    $scope.ChangeFileSearchViewType = function (loadMore) {
        $scope.PatientimageFile = [];
        $scope.FilesObj.TempImagesArray = [];
        if ($scope.SearchObj.Type == "All") {
            $scope.SearchObj.FromDate = null;
            $scope.SearchObj.ToDate = null;
            $scope.UploadPage = 1;
            $scope.UploadHasMore = false;
            $scope.UploadLoading = false;
            $scope.GetAllPatientUploadsPaged(false);
        } else {
            var FromDate = moment($scope.currentdate).subtract(90, 'days').format('MM-DD-YYYY');
            $scope.SearchObj.FromDate = FromDate;
            $scope.SearchObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
            $scope.GetAllPatientUploadsNew();
        }
    }
    // ── Main fetch function ───────────────────────────────────────
    $scope.GetAllPatientUploadsPaged = function (loadMore) {
var fromDate = moment($scope.SearchObj.FromDate, "DD-MM-YYYY");
var toDate   = moment($scope.SearchObj.ToDate, "DD-MM-YYYY");

if (fromDate.isAfter(toDate)) {
    alertify.error("Invalid date range. Please correct and try again.");
    return;
}
          // if ($scope.SearchObj.FromDate > $scope.SearchObj.ToDate) {
        //     alertify.error("Invalid date range. Please correct and try again.");
        //     return;
        // }
        // Build document type CSV
        let docTypeList = $scope.DocumentTypeArray
            .filter(d => d.IsChecked)
            .map(d => d.Id)
            .join(',');

        // Reset on fresh search
        if (!loadMore) {
            $scope.UploadPage = 1;
            $scope.PatientimageFile = [];
            $scope.UploadHasMore = false;
        }

        var obj = {
            PatientId: $scope.cacheStorageItem.PatientID || null,
            // Empty string = SP defaults to last 1 year
            FromDate: $scope.SearchObj.FromDate
                ? $filter('date')($scope.SearchObj.FromDate, 'yyyy-MM-dd')
                : '',
            ToDate: $scope.SearchObj.ToDate
                ? $filter('date')($scope.SearchObj.ToDate, 'yyyy-MM-dd')
                : '',
            Type: $scope.SearchObj.Type,
            SortByDateASC: "desc" || '',
            SortByDocuType: docTypeList || '',
            PageNumber: $scope.UploadPage,
            PageSize: $scope.UploadPageSize
        };

        $scope.UploadLoading = true;

        eHnoteDiagnosisDataServices.GetAllPatientUploadsPaged(obj)
            .then(function (resp) {

                var newRows = resp.data.rows || [];

                // Append on Load More, replace on fresh search
                $scope.PatientimageFile = loadMore
                    ? $scope.PatientimageFile.concat(newRows)
                    : newRows;

                // Update pagination flags from response
                $scope.UploadHasMore = resp.data.HasMore;
                //$scope.UploadPage = resp.data.PageNumber;

                // Auto-expand groups that have files
                angular.forEach($scope.PatientimageFile, function (item) {
                    if (item.Files && item.Files.length > 0) {
                        item.ShowData = true;
                    }
                });

                $scope.SelectedAppointmentUploadFiles = [];
                $scope.currentAppointmentInd = 0;
                $scope.SelectedDate1 = '';
                $scope.UploadLoading = false;
            })
            .catch(function () {
                $scope.UploadLoading = false;
            });
    };
    $scope.OpenPatientFile = function (file) {
        // Use cached SAS if already fetched
        if (file.SasUrl) {
            //window.open(file.SasUrl, '_blank');
            $scope.ShowSelectedAppointmentUploadFilesnew(file);
            return;
        }
        file.LoadingSas = true;
        eHnoteDiagnosisDataServices.GetFileSasUrl({ DocURL: file.DocURL })
            .then(function (resp) {
                file.SasUrl = resp.data.SasUrl;  // cache on object
                file.DocURL = resp.data.SasUrl;
                file.LoadingSas = false;
            //    window.open(file.SasUrl, '_blank');
                $scope.ShowSelectedAppointmentUploadFilesnew(file);
            })
            .catch(function () {
                file.LoadingSas = false;
                alert("Unable to open file. Please try again.");
            });
    };

    // ── Load More button ──────────────────────────────────────────
    $scope.LoadMoreUploads = function () {
        $scope.UploadPage += 1;
        $scope.GetAllPatientUploadsPaged(true);
    };

    // ── Apply filter (date range / type change) ───────────────────
    $scope.ApplyUploadFilter = function () {
        $scope.GetAllPatientUploadsPaged(false);
    };

    // ── On tab open / page init ───────────────────────────────────
    $scope.UserAccess = {
        "UserAccessRightEdit": false,
        "UserAccessRightDelete": false,
        "UserAccessRightRemarks": false
    };
    function GetUserAccess() {

        if ($scope.PreviousUrl === '/op') {
            $scope.UserAccess.UserAccessRightEdit = $scope.UserAccessRights.AllAccessRights.OPFileEdit == true ? true : false;
            $scope.UserAccess.UserAccessRightDelete = $scope.UserAccessRights.AllAccessRights.OPFileDelete == true ? true : false;
            $scope.UserAccess.UserAccessRightRemarks = $scope.UserAccessRights.AllAccessRights.OPFileRemarks == true ? true : false;
        }
        if ($scope.PreviousUrl === '/crm') {
            $scope.UserAccess.UserAccessRightEdit = $scope.UserAccessRights.AllAccessRights.CRMFileEdit == true ? true : false;
            $scope.UserAccess.UserAccessRightDelete = $scope.UserAccessRights.AllAccessRights.CRMFileDelete == true ? true : false;
            $scope.UserAccess.UserAccessRightRemarks = $scope.UserAccessRights.AllAccessRights.CRMFileRemarks == true ? true : false;
        }
    };

    $scope.init = function () {

        $q.all([
            eHnotePatientAddressDataServices.GetAllDocumentType()
        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                let obj;
                $scope.DocumentTypeArray = [];
                angular.forEach(resp[0].data.NoteFilesTypes, function (item) {
                    obj = {
                        "Id": item.FileTypeId,
                        "Name": item.Filetype,
                        "IsChecked": true
                    };
                    $scope.DocumentTypeArray.push(obj);

                });
                $scope.DocumentTypeList = angular.copy($scope.DocumentTypeArray);



                $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
                $scope.AppointmentId = null;
                $scope.GetAllAppointmentsByPatientId();
                $scope.GetAllPatientUploadsNew();
                //$scope.GetAllPatientUploadsPaged(false);

                $scope.SelectedDate = $filter('date')(new Date(), "yyyy-MM-dd");
                $scope.SelectedDate1 = '';
                $scope.files = '';
                GetUserAccess();

            }
        });
       
    }





    $scope.SearchList = function () {

        if ($scope.SortByDateASC == "desc") {
            $scope.SortByDate = 2;
        }
        if ($scope.SortByDateASC == "Asc") {
            $scope.SortByDate = 1;
        }
        if ($scope.SearchObj.Type == "All") {

            $scope.GetAllPatientUploadsPaged(false);
        } else {
            $scope.GetAllPatientUploadsNew();
        }
     
    }

    $scope.init();

    $scope.changeApptDate = function (item) {
        item = item || '';
        if (item !='') {
            $scope.FilesObj.VisitId = item.VisitId || 0;
            $scope.FilesObj.AppointmentID = item.AppointmentId || 0;
        } else {
            $scope.FilesObj.AppointmentID = 0;
            $scope.FilesObj.VisitId = 0;
            $scope.FilesObj.SignedDate = $filter('date')(new Date(), "yyyy-MM-dd");
        }
        if ($scope.FilesObj.SignedDate < $scope.currentDate) {
            $scope.FilesObj = angular.copy($scope.GetFilesObj());
        }
    }

    $scope.GetFilesObj = function () {
        return {

            "UserID": eHnoteMasterDataService.getLoginId(),
            "HospitalID": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PatientID": "",
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
            "IsClickSaveFilestBtn": false,

        };
    };
    $scope.FilesObj = angular.copy($scope.GetFilesObj());
    $scope.GetLogObj = function () {
        return {
            "UserId": eHnoteMasterDataService.getLoginId()|| null,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID|| null,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            "LogArray": [],
            "DocumentDetails":[]
        }
    }
    $scope.LogObj = $scope.GetLogObj();
    $scope.AddAuditLog = function (selectedItem) {
        $scope.LogObj.LogArray = [];
        let SubModuleName = selectedItem.SubModuleName || "";
        let SubModuleId = selectedItem.SubModuleId || 0;
        let ScreenType = selectedItem.ScreenType || "ASC List";
        let ActionType = selectedItem.ActionType || "Accessed";
        let ActionDescription = selectedItem.ActionDescription || "";
        let obj = {
            "LogId": 0,
            "ModuleId": 2,
            "ModuleName": "ASC",
            "SubModuleId": SubModuleId,
            "SubModuleName": SubModuleName,
            "ScreenType": ScreenType,
            "ActionType": ActionType,
            "ActionDescription": ActionDescription,
            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };
        $scope.LogObj.LogArray.push(obj);
        eHnoteSurgeryService.AddAuditLog($scope.LogObj).then(function (resp) {
            if (resp.data.status == "Success") {
                console.log("Added");
            }
        });
    }

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

    $scope.ClearFilename = function (item) {
        item.FileName = '';
    }

    $scope.ClearData = function () {
        $scope.SelectedDate1 = '';
        $scope.FilesObj = angular.copy($scope.GetFilesObj());
    }
    $scope.FilesObj.IsClickSaveFilestBtn = false;
    $scope.PatientFileUpload = function () {
       var obj = {
            "UserID": eHnoteMasterDataService.getLoginId(),
            "HospitalID": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PatientID": $scope.cacheStorageItem.PatientID || 0,
            "PatientName": $scope.cacheStorageItem.PatientName || '',
            "AppointmentID": $scope.FilesObj.AppointmentID || 0,
            "AppointmentDate": $filter('date')($scope.cacheStorageItem.AppointmentDt, "yyyy-MM-dd"),
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
                    "S3URL": item.S3URL||'',
                    "FileTypeId": item.FileTypeId,
                    "Remarks": item.Remarks||'',
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
            })||[];
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
        $scope.FilesObj.IsClickSaveFilestBtn = true;
        eHnoteDiagnosisDataServices.AddPatientfileUpload(obj, OnFilesObjMaterialSuccess, OnFilesObjMaterialError);

        function OnFilesObjMaterialSuccess(data) {
            alertify.success("Image uploaded successfully");
            $scope.FilesObj = angular.copy($scope.GetFilesObj());
            //$scope.GetAllPatientUploadsNew();
            if ($scope.SearchObj.Type == "All") {
                $scope.UploadPage = 1;
                $scope.UploadHasMore = false;
                $scope.UploadLoading = false;
                $scope.GetAllPatientUploadsPaged(false);
            } else {
                $scope.GetAllPatientUploadsNew();
            }
            $scope.FilesObj.IsClickSaveFilestBtn = false;
            $scope.IsDisabled = true;

        }

        function OnFilesObjMaterialError(data) {
            console.log(data);
            $scope.FilesObj.IsClickSaveFilestBtn = false;
            $scope.IsDisabled = false;
        }
    };

    $scope.AddAccessLog = function (item) {
      
        let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': item.FileTypeId }, true);
        let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        let LogItem = {
            "SubModuleId": 24,
            "SubModuleName": "Documents",
            "ScreenType": "ASC List",
            "ActionType": "Accessed",
            "ActionDescription": ActionDescription,
        }
        $scope.AddAuditLog(LogItem);
    }

    $scope.viewDocument = function (imgitem) {

        if (!imgitem.DocURL || imgitem.DocURL.trim() === "") {
            alertify.error("File not found!");
            return;
        }

        // If DocURL exists → then run your original function
        $scope.AddAccessLog(imgitem);
    };

    $scope.openDocument = function (imgitem) {
        if (!imgitem.DocURL || imgitem.DocURL.trim() === "") {
            alertify.error("File not found!");
            return;
        }
        // Open file in new tab
        window.open(imgitem.DocURL, "_blank");
    };

    $scope.ShowSelectedAppointmentUploadFilesnew = function (Obj) {
        console.log(Obj);
        $scope.FilesObj = angular.copy($scope.GetFilesObj());

        $scope.FilesObj.PatientID = Obj.PatientId;
        $scope.FilesObj.AppointmentID = Obj.AppointmentId;

        $scope.FilesObj.SignedDate = Obj.DateValue || Obj.CreatedDt;


        Obj.Files = Obj.Files || [];
        if (Obj.Files.length > 0) {
            angular.forEach(Obj.Files, function (item) {
                $scope.IsShowEditDeleteInd = true;




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
        else {
            $scope.IsShowEditDeleteInd = true;




            var IsUserEditDeleteReamrksAccess = Obj.CreatedById == $scope.UserId ? true : false;




            var fobj = {
                "file": "",
                "DocURL": Obj.DocURL,
                "S3URL": Obj.DocURL,
                "FileTypeId": Obj.FileTypeId,
                "Remarks": Obj.Remarks || "",
                "IsEdit": false,
                "DeleteInd": false,
                "IsShowEditDeleteInd": $scope.IsShowEditDeleteInd || false,
                "DocumentID": Obj.DocumentID,
                "DocumentName": Obj.DocName || "",
                "DisplayName": Obj.DisplayName || "",
                "FileName": Obj.DocName || "",
                "DocumentExt": Obj.FileExt,
                "FileExt": Obj.FileExt,
                "IsUserEditDeleteReamrksAccess": IsUserEditDeleteReamrksAccess || false,
                "Thumbnail": Obj.Thumbnail,
            };

            $scope.FilesObj.TempImagesArray.push(fobj);
            $scope.LogObj.DocumentDetails = angular.copy($scope.FilesObj.TempImagesArray) || [];
        }
        //let LogItem = {
        //    "SubModuleId": 24,
        //    "SubModuleName": "Documents",
        //    "ScreenType": "ASC List",
        //    "ActionType": "Accessed",
        //    "ActionDescription": `Discharge summary document in Documents for Appointment ID: : ${$scope.cacheStorageItem.AppointmentId}`,
        //}
        //$scope.AddAuditLog(LogItem);
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
                "HospitalID": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "Remarks": "",
                "Logs": {}
            };
            params.ImagesArray.push($scope.DeleteFileUploadArray);
            $scope.LogObj.LogArray = [];
            let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': item.FileTypeId }, true);
            let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`
            if (params.ImagesArray.length>0) {
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
                    "PatientId":$scope.cacheStorageItem.PatientID || null,
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

    $scope.uploadPatientFilesNew = function ($files) {
        $scope.SelectedAppointmentUploadFiles = [];
        $scope.patientfiles = $files;
        $scope.patientfiles = $scope.patientfiles || '';
        if ($scope.patientfiles === "" || $scope.patientfiles === null || $scope.patientfiles === undefined) {
            return;
        }



        var file = $scope.patientfiles;
        var remarks = $scope.fileremarks;
        var fd = new FormData();

        fd.append("UserID", eHnoteMasterDataService.getLoginId());
        fd.append("HospitalID", $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
        fd.append("PatientID", appointmentinfo.PatientID);
        fd.append("PatientName", appointmentinfo.PatientName || '');
        fd.append("AppointmentID", $scope.AppointmentId||0);
        fd.append("TreatmentPlanId", 0);
        fd.append("Remarks", remarks);
        fd.append("SignedDate", $filter('date')($scope.FilesObj.SignedDate, "yyyy-MM-dd"));
        fd.append("OrgConsentFormId", $scope.SelectedConsertFromId);
        fd.append("FileTypeId", parseInt($scope.SelectedFile));
        fd.append("IsPartiallyUploaded", 'N');
        fd.append("LabTestId", 0);
        fd.append("ShowNewConsultation", $scope.ShowNewConsultation);
        angular.forEach(file, function (value, key) {
            fd.append(key, value);
        });

        $scope.SelectedDate = $filter('date')($scope.FilesObj.SignedDate, "yyyy-MM-dd");
        return false;
        eHnoteDiagnosisDataServices.addPatientUploadfile(fd, callbackfileuploadSuccess, callbackfileuploadError);
        function callbackfileuploadSuccess(resp) {
            $scope.TempFileUploadImgArray = [];
            $scope.TempFileUploadPdfArray = [];
            $scope.files = '';
            $scope.SelectedDate1 = '';
            $scope.AppointmentId = 0;
            alertify.success("Image uploaded successfully");
            $scope.currentDate = $filter('date')(new Date(), "MM-dd-yyyy");
            $('.file').html('No file chosen...');
            if (resp.PatientFiles !== undefined) {
                if (resp.PatientFiles.length > 0) {

                    $scope.GetAllPatientUploadsNew();
                    //    getAllFiles(appointmentinfo.PatientID, $scope.DoctorId, appointmentinfo.AppointmentId);
                }
            }
        }
        function callbackfileuploadError(err) {
            alertify.success("Uploading Failed");
        }

    };

    $scope.uploadPatientFiles = function ($files) {
        $scope.SelectedAppointmentUploadFiles = [];
        $scope.patientfiles = $files;
        if ($scope.patientfiles === "" || $scope.patientfiles === null || $scope.patientfiles === undefined) {
            return;
            // alertify.error('Select a File To Upload');
        }


        var file = $scope.patientfiles;
        var remarks = $scope.fileremarks;
        var fd = new FormData();

        fd.append("UserID", eHnoteMasterDataService.getLoginId());
        fd.append("HospitalID", appointmentinfo.HospitalId);
        fd.append("PatientID", appointmentinfo.PatientID);
        fd.append("PatientName", appointmentinfo.PatientName||'');
        fd.append("AppointmentID", $scope.AppId);
        fd.append("TreatmentPlanId", appointmentinfo.TreatmentPlanId);

        fd.append("Remarks", remarks);
        fd.append("SignedDate", $filter('date')(new Date($scope.currentDate), "yyyy-MM-dd"));
        fd.append("OrgConsentFormId", $scope.SelectedConsertFromId);
        fd.append("FileTypeId", parseInt($scope.SelectedFile));
        fd.append("IsPartiallyUploaded", 'Y');
        fd.append("LabTestId", 0);
        fd.append("ShowNewConsultation", $scope.ShowNewConsultation);
        angular.forEach(file, function (value, key) {
            fd.append(key, value);
        });


        eHnoteDiagnosisDataServices.addPatientUploadfile(fd, callbackfileuploadSuccess, callbackfileuploadError);
        function callbackfileuploadSuccess(resp) {
            $scope.TempFileUploadImgArray = [];
            $scope.TempFileUploadPdfArray = [];
            $('#noFile').html('No file chosen...');
            if (resp.PatientFiles !== undefined) {
                if (resp.PatientFiles.length > 0) {
                    var filteredArray = $filter('filter')(resp.PatientFiles, { "IsPartiallyUploaded": true });
                    for (var i = 0; i < filteredArray.length; i++) {
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
                            $scope.TempFileUploadImgArray.push(filteredArray[i]);
                        }
                    }

                    if (appointmentinfo.TreatmentPlanId === 0) {
                        appointmentinfo.TreatmentPlanId = resp.PatientFiles[0].TreatmentPlanId;
                    }
                    if (appointmentinfo.Patient !== undefined) {
                        appointmentinfo.Patient[0].PatientDisplayId = appointmentinfo.Patient[0].PatientDisplayId || null;
                        appointmentinfo.Patient[0].PatientDisplayId = resp.PatientFiles[0].PatientDisplayId;
                    }
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }
            }
        }
        function callbackfileuploadError(err) {
            alertify.success("Uploading Failed");
        }

    };


    $scope.UploadTempFileUploads = function () {
        $scope.ImagesArray = [];
        $scope.ImagesArray = $scope.TempFileUploadImgArray.concat($scope.TempFileUploadPdfArray);
        var params = {
            "AppointmentID": $scope.AppId,
            "DeleteIndicator": 0,
            "ImagesArray": $scope.ImagesArray,
            "HospitalID": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "Remarks": "",
            "UpdateType": "Edit",
            'UserId': eHnoteMasterDataService.getLoginId(),
            "TreatmentPlanId": appointmentinfo.TreatmentPlanId     // added by sabarish for android and web purpose.
        };
        eHnoteDiagnosisDataServices.ModifyPatientConsultationImg(params, onupdateModifysuccess, onupdateModifyerror);
        function onupdateModifysuccess(response) {
            if (response.Status === "Success") {
                alertify.success("File Uploading Successfully");
                $scope.TempFileUploadImgArray = [];
                $scope.TempFileUploadPdfArray = [];
                /* getPatientNoteFiles($scope.AppId);*/
                getAllFiles(appointmentinfo.PatientID, $scope.DoctorId, $scope.AppId);
            }
        }
        function onupdateModifyerror(err) {
            console.log(err);
        }
    };


    $scope.ShowTempImagesPreview = function (index) {
        Lightbox.openModal($scope.TempFileUploadImgArray, index);
    };


    $scope.DeleteTempImages = function (item) {
        $scope.DeleteFileUploadArray = { "DocumentID": item.DocumentID, "FileName": item.DocumentName };

        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
            var params = {
                "AppointmentID": item.AppointmentId,
                "DeleteIndicator": 0,
                "ImagesArray": [],
                "HospitalID": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "Remarks": "",
                "UpdateType": "Delete"
            };
            params.ImagesArray.push($scope.DeleteFileUploadArray);
            eHnoteDiagnosisDataServices.DeletePatientConsultationImg(params, onupdateDeletesuccess, onupdateDelerror);
        }, function () { });
        function onupdateDeletesuccess(response) {
            if (response.Status === 'Success') {
                if ($scope.DeleteFileUploadArray.FileName.indexOf('.pdf') > -1) {
                    for (var k = 0; k < $scope.TempFileUploadPdfArray.length; k++) {
                        if ($scope.TempFileUploadPdfArray[k].DocumentID === $scope.DeleteFileUploadArray.DocumentID) {
                            $scope.TempFileUploadPdfArray.splice(k, 1);
                            $scope.ItemFileUpload = "";
                        }
                    }
                } else {
                    for (var k = 0; k < $scope.TempFileUploadImgArray.length; k++) {
                        if ($scope.TempFileUploadImgArray[k].DocumentID === $scope.DeleteFileUploadArray.DocumentID) {
                            $scope.TempFileUploadImgArray.splice(k, 1);
                            $scope.ItemFileUpload = "";
                        }
                    }
                }
                alertify.success("File Deleted successfully");
            }
        }
        function onupdateDelerror(errordata) {
            console.log(errordata);
        }
    };

    $scope.preimgitemPreview = function (index) {
        Lightbox.openModal($scope.PreTreatmentImgUploads, index);
    };
    $scope.genimgitemPreview = function (index) {
        Lightbox.openModal($scope.generalImgUploads, index);
    };
    $scope.postimgitemPreview = function (index) {
        Lightbox.openModal($scope.PostTreatmentImgUploads, index);
    };
    $scope.consentimgitemPreview = function (index) {
        Lightbox.openModal($scope.ConsentImgUploads, index);
    };


    $scope.openPdfFileUploads = function (url) {
        window.open(url);
    };

    $scope.saveEditedFileUpload = function (item) {
        $scope.ModifyFileUploadArray = { "DocumentID": item.DocumentID, "FileName": item.DocName, "Remarks": item.Remarks, "FileTypeId": item.FileTypeId || 1 };
        var params = {
            "AppointmentID": item.AppointmentId,
            "DeleteIndicator": 0,
            "ImagesArray": [],
            "HospitalID": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "Remarks": "",
            "UpdateType": "Edit"
        };
        params.ImagesArray.push($scope.ModifyFileUploadArray);
        eHnoteDiagnosisDataServices.ModifyPatientConsultationImg(params, onModifysuccess, onModifyrror);

        function onModifysuccess(response) {
            if (response.Status === 'Success') {
                alertify.success("Updated successfully");
                $scope.GetAllPatientUploadsNew();
                //  getAllFiles(appointmentinfo.PatientID, $scope.DoctorId, item.AppointmentId);
            }
        }
        function onModifyrror(errordata) {
            console.log(errordata);
        }
    };


    $scope.DeleteImages = function (item) {
        $scope.DeleteFileUploadArray = { "DocumentID": item.DocumentID, "FileName": item.DocName };
        var remarks = item.Remarks;
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
            var params = {
                "AppointmentID": item.AppointmentId,
                "DeleteIndicator": 0,
                "ImagesArray": [],
                "HospitalID": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "Remarks": remarks
            };
            params.ImagesArray.push($scope.DeleteFileUploadArray);
            eHnoteDiagnosisDataServices.DeletePatientConsultationImg(params, onupdateDeletesuccess, onupdateDelerror);
        }, function () { });
        function onupdateDeletesuccess(response) {
            if (response.Status === 'Success') {
                $('#noFile').html('No file chosen...');
                if ($scope.DeleteFileUploadArray.FileName.indexOf('.pdf') > -1) {
                    for (var k = 0; k < $scope.FileUploadPDfArray.length; k++) {
                        if ($scope.FileUploadPDfArray[k].DocumentID === $scope.DeleteFileUploadArray.DocumentID) {
                            $scope.FileUploadPDfArray.splice(k, 1);
                            $scope.ItemFileUpload = "";
                        }
                    }
                } else {
                    for (var k = 0; k < $scope.FileUploadImageArray.length; k++) {
                        if ($scope.FileUploadImageArray[k].DocumentID === $scope.DeleteFileUploadArray.DocumentID) {
                            $scope.FileUploadImageArray.splice(k, 1);
                            $scope.ItemFileUpload = "";
                        }
                    }
                }
                alertify.success("File deleted successfully");
            }
        }
        function onupdateDelerror(errordata) {
            console.log(errordata);
        }
    };



    var docid = $scope.doctorinfo.doctorid;

    //Consent Forms
    var params = {
        "DoctorID": docid,
        "USRType": "DOCTOR",
        "USRId": docid
    };
    $scope.doctorConsentFormList = [];

    function loadConsentFormDdl() {
        $scope.doctorConsentFormList = [];
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
            var hospcd = "";
            params.ParentOrganizationId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            params.searchtext = '';
            
            eHnoteSettingsDataService.GetOrgConsentForms(params).then(function (resp) {
                angular.forEach(resp.data, function (val, key) {
                    if (val.ActiveIND === "Y") {
                        $scope.doctorConsentFormList.push({
                            "ConsentFormDesc": val.DocumentName,
                            "documentid": val.DocId,
                            "DoctorID": docid,
                            "formUrl": val.URL !== undefined ? val.URL : "",
                            "ActiveIND": val.ActiveIND
                        });
                    }
                });

            }, function (err) {
                console.log(err);
            });
        } else {
            var hospcd = undefined;
            params.HospitalId = undefined;
            eHnoteSettingsDataService.getDoctorsConsentForm(params, hospcd, onSuccess, onError);
        }
        function onSuccess(reponse) {
            angular.forEach(reponse.data, function (val, key) {
                if (val.ActiveIND === "Y") {
                    $scope.doctorConsentFormList.push({
                        "ConsentFormDesc": val.DocumentName,
                        "documentid": val.DocId,
                        "DoctorID": docid,
                        "formUrl": val.URL !== undefined ? val.URL : "",
                        "ActiveIND": val.ActiveIND
                    });
                }
            });
        }
        function onError(reponse) {
            console.log("error");
        }
    }
    $scope.bindConsentDdl = function (val) {
        if ($scope.doctorConsentFormList.length === 0 && val === '4')
            loadConsentFormDdl();
    };
    $scope.ConsentFileUploadURlArray = [];
    $scope.openLightboxModal = function (index, url) {
        $scope.ConsentFileUploadURlArray.push({
            "url": url,
            "thumbUrl": url
        });
        Lightbox.openModal($scope.ConsentFileUploadURlArray, index);
    };

    $scope.openPdfViewConsent = function (url, index) {
        window.open(url);
    };

    $scope.deleteImageConsent = function (item) {
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.DeleteImgconsentUpload = {
            "documentid": item.documentID,
            "Desc": item.consentFormDesc,
            "type": item.Type,
            "PatiendId": appointmentinfo.PatientID,
            "DoctorId": docid
        };
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
            var params = {
                "ConsultaionConsentFormId": item.documentID,
                "ConsultationId": cacheStorageItem.ConsultationID,
                "ActiveIND": "N",
                "FileName": item.url.substring(item.url.lastIndexOf('/') + 1)
            };
            eHnotePatientDataService.deleteaudionotes(params, onupdateDeletesuccess, onupdateDelerror);
        }, function () {


        });
        function onupdateDeletesuccess(response) {
            if (response.data.Status === "Success") {
                if ($scope.DeleteImgconsentUpload.type !== "application/pdf") {
                    for (var k = 0; k < $scope.ConsentImageDataArray.length; k++) {
                        if ($scope.ConsentImageDataArray[k].documentID === $scope.DeleteImgconsentUpload.documentid) {
                            $scope.ConsentImageDataArray.splice(k, 1);
                        }
                    }
                } else {
                    for (var k = 0; k < $scope.ConsentPdfDataArray.length; k++) {
                        if ($scope.ConsentPdfDataArray[k].documentID === $scope.DeleteImgconsentUpload.documentid) {
                            $scope.ConsentPdfDataArray.splice(k, 1);
                        }
                    }
                }
                cacheStorageItem.PatientConsertArray = $scope.ConsentImageDataArray;
                cacheStorageItem.PatientPdfConsertArray = $scope.ConsentPdfDataArray;
                eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
                alertify.success("Consent Forms deleted successfully");
            }
        }
        function onupdateDelerror(errordata) {
            console.log(errordata);
        }
    };

    $scope.ConsentChange = function (FromName) {
        if (FromName !== "") {
            $scope.SelectedConsertFrom = FromName;
            angular.forEach($scope.doctorConsentFormList, function (item) {
                if (item.ConsentFormDesc === FromName) {
                    $scope.SelectedConsertFromId = item.documentid;
                }
            });
        }
    };

    //Consent FormList based on Doctor

    $scope.ConsentFormList = [];
    $scope.consentFormArray = [];
    $scope.searchDoctorConsentList = "";

    $scope.ConsentSearch = function () {
        var req = {
            //"HospitalId": doctorinfo.hospitalID,
            "ParentOrganizationId": doctorinfo.hospitalID,
            "searchtext": $scope.searchDoctorConsentList
        };
        eHnoteSettingsDataService.GetOrgConsentForms(req).then(function (resp) {
            $scope.consentFormArray = resp.data;
        }, function (err) {
        });
    };





    $scope.GetDoctorConsentInSettings = function (docid, url, filetype) {
        if (filetype === "jpg" || filetype === "PNG" || filetype === "jpeg" || filetype === "png") {
            $scope.arrayImgdoc = [];
            $scope.arrayImgdoc.push({
                "url": url,
                "thumbUrl": url
            });
            Lightbox.openModal($scope.arrayImgdoc, 0);
        } else if (filetype === "pdf") {
            window.open(url);
        }
    };

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
    var base64Img = "";

    $scope.printConsent = function (item) {
        if (item.FileExtension === 'pdf') {
            window.open(item.URL);
        } else {
            $scope.printConsentArray = [];
            //$scope.toDataURL(item.URL, function (dataURL) {
            //    base64Img = dataURL;
            //    $scope.printConsentArray.push({
            //        "url": item.URL,
            //        "thumbUrl": item.URL,
            //        "base64Img": base64Img,
            //        "DocumentName": item.DocumentName,
            //        "ActiveIND": item.ActiveIND
            //    });
            //});

            $scope.toDataURL(item.URL, function (dataURL) {
                base64Img = dataURL;
                $scope.printConsentArray.push({
                    "url": item.URL,
                    "thumbUrl": item.URL,
                    "base64Img": base64Img,
                    "DocumentName": item.DocumentName,
                    "ActiveIND": item.ActiveIND
                });
            });

            $timeout(function () {
                eHnotePrintService.generateConsentPrint($scope.printConsentArray);
            }, 600);
        }
    };



    $scope.DeleteDoctorConsent = function (consent) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
            var object = {
                "DocId": consent.DocId,
                "HospitalId": consent.HospitalId,
                "FileName": consent.URL === "" ? "" : consent.URL.substring(consent.URL.lastIndexOf('/') + 1),
                "UserId": $scope.doctorinfo.doctorid
            };
            eHnoteSettingsDataService.DeleteDoctorConsent(object).then(function (resp) {
                $scope.GetDoctorsConsentFroms();
                alertify.success("Deleted Successfully");
            }, function (err) {
                console.log(err);
                alertify.error("Deleting Failed");
            });
        }, function () {
            return;
        });
    };
    $scope.selected = {};

    $scope.onFileSelectConsentSettings = function ($files, name) {
        //if (name === "" || name === undefined) {
        //    alert("Enter consent form name");
        //    return false;
        //} else {
        $scope.DoctorConsertFromName = name;
        $scope.files = $files;
        $scope.SelectedFileName = $scope.files[0].name;
        //}
    };

    var url = "";
    $scope.uploadConsentfilesInSettings = function () {
        $scope.OrganisationConsentFormId = 0;
        $scope.DoctorConsertFromName = $scope.DoctorConsertFromName || "";
        if ($scope.DoctorConsertFromName === "") {
            $scope.errorupload = "Enter name for the Consent form and Upload file";
        } else {
            var file = $scope.files;
            var Name = $scope.DoctorConsertFromName;
            var HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            var fd = new FormData();
            fd.append("HospitalId", HospitalId);
            fd.append("DoctorID", $scope.doctorinfo.doctorid);
            fd.append("DoctorName", $scope.doctorinfo.doctordata.User[0].FullName);
            fd.append("OrganisationConsentFormId", $scope.OrganisationConsentFormId);
            fd.append("ConsentName", Name);
            angular.forEach(file, function (value, key) {
                fd.append(key, value);
            });
            if ($scope.ConsentFormList.length > 0) {
                var List = $filter("filter")($scope.ConsentFormList, { "DocumentName": $scope.DoctorConsertFromName }, true);
                if (List.length > 0) {
                    alertify.error('Consent Name is already exists');
                    return;
                }
            }
            return false;
            eHnoteSettingsDataService.consentFormImageUploadInSettings(fd, callbackDocConsentSuccess, callbackDocConsentError);
        }
    };
    function callbackDocConsentSuccess(resp) {
        if (resp.length !== 0) {
            alertify.success("Uploaded Successfully");
            //var object = {
            //    "DocId": resp[0].OrganisationConsentFormId,
            //    "DocumentName": resp[0].DocumentName,
            //    "FileExtension": resp[0].FileExtension,
            //    "URL": resp[0].URL,
            //    "HospitalId": resp[0].HospitalId,
            //    "ActiveIND": "Y"
            //};
            var object = {
                "documentid": resp[0].OrganisationConsentFormId,
                "ConsentFormDesc": resp[0].DocumentName,
                "FileExtension": resp[0].FileExtension,
                "formUrl": resp[0].URL,
                "HospitalId": resp[0].HospitalId,
                "ActiveIND": "Y"
            };
            $scope.doctorConsentFormList.push(object);
            $scope.DoctorConsertFromName = "";
            $('#txt_ConsentFormSettings').val('');
            $('#noFiles').html('No file chosen...');
            UploadConsentModal.dismiss("cancel");
            $scope.GetDoctorsConsentFroms();
        }
    }
    function callbackDocConsentError(err) {
        alertify.success("Uploading Failed");
    }
    $scope.consentFiles = "";
    $scope.onFileSelectConsent = function ($files) {
        if ($files === null) {
            return;
        }
        $scope.OrganisationConsentFormId = 0;
        if ($scope.SelectedConsertFrom === "" || $scope.SelectedConsertFrom === undefined) {
            alertify.error("Select Consent Form Name");
            angular.element("#signedChooseBtn").val("");
            return false;
        } else {
            // $scope.consentFiles = $file;
            $scope.patientfiles = $files;
        }
    };


    $scope.uploadConsentFiles = function () {
        if ($scope.consentFiles === '' || $scope.consentFiles === null || $scope.consentFiles === undefined) {
            alertify.error('Select a File To Upload');
        }
        var file = $scope.consentFiles;
        var fd = new FormData();
        var Name = appointmentinfo.PatientName;
        var HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var type = $scope.consentFiles.type;
        fd.append("UserId", docid);
        fd.append("ConsentName", Name);
        fd.append("SignedDate", $filter('date')(new Date($scope.currentDate), "yyyy-MM-dd"));
        fd.append("OrgConsentFormId", $scope.SelectedConsertFromId);
        fd.append("file", file);
        fd.append("AppointmentId", appointmentinfo.AppointmentID);
        fd.append("FileExtension", type);
        eHnoteSettingsDataService.addPatientConsentForm(fd, onupdatesuccess, onupdateerror);
        function onupdatesuccess(resp) {
            var documentid = resp.DocumentId;
            if (type !== "application/pdf") {
                var result1 = "";
                angular.forEach(cacheStorageItem.PatientConsertArray, function (data, index) {
                    if (data.consentFormID === $scope.SelectedConsertFromId) {
                        result1 = true;
                    }
                });
                if (result1 === true) {
                    alertify.error("Consent Form already exist");
                    return false;
                } else {
                    $scope.ConsentImageDataArray.push({
                        "consentFormID": $scope.SelectedConsertFromId,
                        "consentFormDesc": $scope.SelectedConsertFrom,
                        "documentID": documentid,
                        "url": resp.URL,
                        "Type": type,
                        "signedDate": $scope.currentDate,
                        "DeleteInd": false
                    });
                }
            } else {
                var result2 = "";
                angular.forEach(cacheStorageItem.PatientpdfConsertArray, function (data, index) {
                    if (data.consentFormID === $scope.SelectedConsertFromId) {
                        result2 = true;
                    }
                });
                if (result2 === true) {
                    alertify.error("Consent Form already exist");
                    return false;
                } else {
                    $scope.ConsentPdfDataArray.push({
                        "consentFormID": $scope.SelectedConsertFromId,
                        "consentFormDesc": $scope.SelectedConsertFrom,
                        "documentID": documentid,
                        "url": resp.URL,
                        "Type": type,
                        "signedDate": $scope.currentDate,
                        "DeleteInd": false
                    });
                }
            }
            $scope.SelectedConsertFrom = "";
            angular.element("#txt_ConsentFormSettings").val("");
            //getPatientNoteFiles();
        }
        function onupdateerror(err) {
            console.log(err);
        }
    };
    $scope.CompleteList = [];
    $scope.ChkDoctorConsertActive = function (index, status) {
    };
    $scope.DeletePatientFiles = function () {
        $scope.filteredConsentPdfDataArray = $filter('filter')($scope.ConsentPdfDataArray, { 'DeleteInd': true });
        $scope.filteredConsentImageDataArray = $filter('filter')($scope.ConsentImageDataArray, { 'DeleteInd': true });
        $scope.filteredFileUploadPDfArray = $filter('filter')($scope.FileUploadPDfArray, { 'DeleteInd': true });
        $scope.filteredFileUploadImageArray = $filter('filter')($scope.FileUploadImageArray, { 'DeleteInd': true });
        if ($scope.filteredConsentPdfDataArray.length > 0) {
            for (i = $scope.ConsentPdfDataArray.length - 1; i >= 0; i -= 1) {
                if ($scope.ConsentPdfDataArray[i].DeleteInd) {
                    $scope.ConsentPdfDataArray.splice(i, 1);
                }
            }
        }
        if ($scope.filteredConsentImageDataArray.length > 0) {
            for (i = $scope.ConsentImageDataArray.length - 1; i >= 0; i -= 1) {
                if ($scope.ConsentImageDataArray[i].DeleteInd) {
                    $scope.ConsentImageDataArray.splice(i, 1);
                }
            }
        }
        if ($scope.filteredFileUploadPDfArray.length > 0) {
            for (i = $scope.FileUploadPDfArray.length - 1; i >= 0; i -= 1) {
                if ($scope.FileUploadPDfArray[i].DeleteInd) {
                    $scope.FileUploadPDfArray.splice(i, 1);
                }
            }
        }
        if ($scope.filteredFileUploadImageArray.length > 0) {
            for (i = $scope.FileUploadImageArray.length - 1; i >= 0; i -= 1) {
                if ($scope.FileUploadImageArray[i].DeleteInd) {
                    $scope.FileUploadImageArray.splice(i, 1);
                }
            }
        }
    };
    $scope.GetDoctorsConsentFroms = function () {
        $scope.consentFormArray = [];
        var request = {
            //"HospitalId": doctorinfo.hospitalID,
            "ParentOrganizationId": doctorinfo.hospitalID,
            "searchtext": $scope.searchDoctorConsentList
        };
        eHnoteSettingsDataService.GetOrgConsentForms(request).then(function (resp) {
            $scope.ConsentFormList = resp.data;
            for (var i = 0; i < $scope.ConsentFormList.length; i++) {
                if ($scope.ConsentFormList[i].ActiveIND === 'Y') {
                    $scope.consentFormArray.push($scope.ConsentFormList[i]);
                }
            }

        }, function (err) {
            console.log(err);
        });
    };
    //$scope.GetDoctorsConsentFroms();

    // getAllFiles(appointmentinfo.PatientID, $scope.DoctorId);


    function getAllFiles1(patientid, doctorId, apptid) {


        eHnoteDiagnosisDataServices.GetAllFileUploads(patientid, doctorId).then(function (response) {
            $scope.PatientimageFile = response.data.Appointments || [];
            $scope.currentAppointmentInd = 0;
            if ($scope.PatientimageFile.length>0) {
                angular.forEach($scope.PatientimageFile, function (item, ind) {
                    $scope.AppId = $scope.PatientimageFile[0].AppointmentId;
                    appointmentinfo.AppointmentId = $scope.PatientimageFile[0].AppointmentId;
                    appointmentinfo.HospitalId = $scope.PatientimageFile[0].HospitalId;
                    $scope.currentDate = $scope.PatientimageFile[0].AppointmentDate;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                    if (item.AppointmentId === $scope.AppId) {
                        $scope.FileUploadIndex = ind;
                        $scope.currentAppointmentInd = ind;
                    }
                });
            }


            if ($scope.MainSpecialization.SpecializationId === 2) {
                $scope.GetTreatmentFileUpload();
            }


            var arr = [];
            arr = $scope.PatientimageFile[$scope.currentAppointmentInd] || [];
            $scope.generalImgUploads = [];
            $scope.generalPdfUploads = [];
            $scope.PreTreatmentImgUploads = [];
            $scope.PreTreatmentPdfUploads = [];
            $scope.PostTreatmentImgUploads = [];
            $scope.PostTreatmentPdfUploads = [];
            $scope.ConsentImgUploads = [];
            $scope.ConsentPdfUploads = [];

            $scope.ForumFiles = [];
            $scope.ForumPdfUploads = [];
            $scope.ForumImgUploads = [];

            $scope.ForumFiles = angular.copy(arr.ForumFiles) || [];
            if ($scope.ForumFiles && $scope.ForumFiles.length > 0) {
                //var filteredArray = $filter('filter')(arr.Files, { 'IsPartiallyUploaded': false });
                angular.forEach($scope.ForumFiles, function (item) {
                    var extension = ".jpg";
                    //if (item.DocName) {
                    //    extension = item.DocName.split(".")[1];
                    //}



                    if (item.DocURL) {
                        extension = item.DocURL.split(/[#?]/)[0].split('.').pop().trim();
                    }




                    var pName = item.DocName.split("_")[0];
                    if (pName.length > 9) {
                        name = pName.substring(0, 9) + "..." + "." + extension;
                    } else {
                        name = angular.copy(pName) + '.' + extension;
                    }
                    item.docNameDisplay = name;
                    if (item.DocURL.indexOf(".pdf") > -1) {
                        item.DeleteInd = false;
                        item.IsRemarksinEdit = false;

                        switch (item.FileTypeId) {
                            case 6:
                                $scope.ForumPdfUploads.push(item);
                                break;
                        }

                    } else {
                        item.DeleteInd = false;
                        item.IsRemarksinEdit = false;
                        switch (item.FileTypeId) {
                            case 6:
                                $scope.ForumImgUploads.push(item);
                                break;
                        }
                    }
                });
            }

            if (arr.Files && arr.Files.length > 0) {
                var filteredArray = $filter('filter')(arr.Files, { 'IsPartiallyUploaded': false });
                angular.forEach(filteredArray, function (item) {
                    var extension = ".jpg";
                    if (item.DocName) {
                        extension = item.DocName.split(".")[1];
                    }
                    var pName = item.DocName.split("_")[0];
                    if (pName.length > 9) {
                        name = pName.substring(0, 9) + "..." + "." + extension;
                    } else {
                        name = angular.copy(pName) + '.' + extension;
                    }
                    item.docNameDisplay = name;
                    if (item.DocURL.indexOf(".pdf") > -1) {
                        item.DeleteInd = false;
                        item.IsRemarksinEdit = false;

                        switch (item.FileTypeId) {
                            case 1:
                                $scope.generalPdfUploads.push(item);
                                break;
                            case 2:
                                $scope.PreTreatmentPdfUploads.push(item);
                                break;
                            case 3:
                                $scope.PostTreatmentPdfUploads.push(item);
                                break;
                            case 4:
                                $scope.ConsentPdfUploads.push(item);
                                break;
                        }

                    } else {
                        item.DeleteInd = false;
                        item.IsRemarksinEdit = false;
                        switch (item.FileTypeId) {
                            case 1:
                                $scope.generalImgUploads.push(item);
                                break;
                            case 2:
                                $scope.PreTreatmentImgUploads.push(item);
                                break;
                            case 3:
                                $scope.PostTreatmentImgUploads.push(item);
                                break;
                            case 4:
                                $scope.ConsentImgUploads.push(item);
                                break;
                        }
                    }
                });
            }
            let tempfileArray = $filter('filter')($scope.PatientimageFile, { 'AppointmentId': apptid }, true);
            if (tempfileArray.length > 0) {
                $scope.SelectedAppointmentUploadFiles = tempfileArray[0].Files;
            }
        });
    }




    $scope.focusFileUpload = function (id, ind) {
        $timeout(function () {
            $("#" + id + "_" + ind).focus();
        }, 400);

    };
    $scope.getFiles = function (arr, ind) {
        $scope.FileUploadIndex = ind;
        $scope.OpenUploadFilePopup = false;
        $scope.TempFileUploadImgArray = [];
        $scope.TempFileUploadPdfArray = [];
        $scope.AppId = arr.AppointmentId;
        getPatientNoteFiles(arr.AppointmentId);
        $scope.GetTreatmentFileUpload();
    };
    $scope.DeleteUploadedFile = function (item) {
        $scope.DeleteFileUploadArray = { "DocumentID": item.DocumentID, "FileName": item.DocName, "Remarks": "" };
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
            var params = {
                "AppointmentID": item.AppointmentId,
                "DeleteIndicator": 0,
                "ImagesArray": [],
                "UploadType": "Delete",
                "HospitalID": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "Remarks": ""
            };
            params.ImagesArray.push($scope.DeleteFileUploadArray);
            eHnoteDiagnosisDataServices.DeletePatientConsultationImg(params, onupdateDeletesuccess, onupdateDelerror);
        }, function () { });
        function onupdateDeletesuccess(response) {
            if (response.Status === 'Success') {
                getPatientNoteFiles(item.AppointmentId);
                alertify.success("File deleted successfully");
            }
        }
        function onupdateDelerror(errordata) {
            console.log(errordata);
        }
    };

    function getPatientNoteFiles(appid) {
        var param = { "AppointmentId": appid };

        eHnoteDiagnosisDataServices.getPatientNotesFiles(param, ongetFileSuccess, ongetFileError);
        function ongetFileSuccess(resp) {



            $scope.generalImgUploads = [];
            $scope.generalPdfUploads = [];
            $scope.PreTreatmentImgUploads = [];
            $scope.PreTreatmentPdfUploads = [];
            $scope.PostTreatmentImgUploads = [];
            $scope.PostTreatmentPdfUploads = [];
            $scope.ConsentImgUploads = [];
            $scope.ConsentPdfUploads = [];


            $scope.ForumFiles = angular.copy(resp.ForumFiles) || [];
            $scope.ForumPdfUploads = [];
            $scope.ForumImgUploads = [];




            if ($scope.ForumFiles && $scope.ForumFiles.length > 0) {
                //var filteredArray = $filter('filter')(arr.Files, { 'IsPartiallyUploaded': false });
                angular.forEach($scope.ForumFiles, function (item) {
                    var extension = ".jpg";
                    //if (item.DocName) {
                    //    extension = item.DocName.split(".")[1];
                    //}




                    if (item.DocURL) {
                        extension = item.DocURL.split(/[#?]/)[0].split('.').pop().trim();
                    }



                    var pName = item.DocName.split("_")[0];
                    if (pName.length > 9) {
                        name = pName.substring(0, 9) + "..." + "." + extension;
                    } else {
                        name = angular.copy(pName) + '.' + extension;
                    }
                    item.docNameDisplay = name;
                    if (item.DocURL.indexOf(".pdf") > -1) {
                        item.DeleteInd = false;
                        item.IsRemarksinEdit = false;

                        switch (item.FileTypeId) {
                            case 6:
                                $scope.ForumPdfUploads.push(item);
                                break;
                        }

                    } else {
                        item.DeleteInd = false;
                        item.IsRemarksinEdit = false;
                        switch (item.FileTypeId) {
                            case 6:
                                $scope.ForumImgUploads.push(item);
                                break;
                        }
                    }
                });
            }





            if (resp.PatientFiles !== undefined) {
                if (resp.PatientFiles.length > 0) {
                    var filteredArray = $filter("filter")(resp.PatientFiles, { "IsPartiallyUploaded": false });
                    for (var i = 0; i < filteredArray.length; i++) {
                        $scope.docname = "";
                        filteredArray[i].docNameDisplay = '';
                        var extension = ".jpg";
                        if (filteredArray[i].DocName) {
                            extension = filteredArray[i].DocName.split(".")[1];
                        }
                        var pName = filteredArray[i].DocName.split("_")[0];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + extension;
                        }
                        else {
                            name = angular.copy(pName) + "." + extension;
                        }
                        filteredArray[i].docNameDisplay = name;



                        if (filteredArray[i].DocURL.indexOf(".pdf") > -1) {
                            filteredArray[i].DeleteInd = false;
                            filteredArray.IsRemarksinEdit = false;
                            switch (filteredArray[i].FileTypeId) {
                                case 1:
                                    $scope.generalPdfUploads.push(filteredArray[i]);
                                    break;
                                case 2:
                                    $scope.PreTreatmentPdfUploads.push(filteredArray[i]);
                                    break;
                                case 3:
                                    $scope.PostTreatmentPdfUploads.push(filteredArray[i]);
                                    break;
                                case 4:
                                    $scope.ConsentPdfUploads.push(filteredArray[i]);
                                    break;
                            }
                        } else {
                            filteredArray[i].DeleteInd = false;
                            filteredArray.IsRemarksinEdit = false;
                            switch (filteredArray[i].FileTypeId) {
                                case 1:
                                    $scope.generalImgUploads.push(filteredArray[i]);
                                    break;
                                case 2:
                                    $scope.PreTreatmentImgUploads.push(filteredArray[i]);
                                    break;
                                case 3:
                                    $scope.PostTreatmentImgUploads.push(filteredArray[i]);
                                    break;
                                case 4:
                                    $scope.ConsentImgUploads.push(filteredArray[i]);
                                    break;
                            }
                        }
                    }
                }
            }





            $scope.PreTreatmentFileUploadCount++;
            $scope.GeneralFileUploadCount++;
            $scope.PostTreatmentFileUploadCount++;
            $scope.ConsentsFileUploadCount++;
            $scope.ForumFileUploadCount++;

        }
        function ongetFileError(err) {
            console.log(err);
        }
    }



    $scope.OpenUploadConsentPopUp = function () {


        UploadConsentModal = $uibModal.open({
            "templateUrl": "templates/Dental/UploadConsentPopUp.html",
            "size": "md",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope
        });

    };

    $scope.CloseUploadConsentPopUp = function () {

        UploadConsentModal.dismiss("cancel");

    };

    $scope.GetTreatmentFileUpload = function () {
        var appid = $scope.PatientimageFile[$scope.FileUploadIndex].AppointmentId, pagesize = 50, pagenumber = 1, type = true;
        eHnoteUserAppointmentDataService.GetPatientTreatmentsByApptId(appid, pagesize, pagenumber, type, onsuccess, onerror);
        function onsuccess(resp) {
            if (resp.count > 0) {
                //$scope.cacheStorageItem.allTreatmentArray = angular.copy(resp.rows);
                $scope.allTreatmentArrayList = [];
                $scope.allTreatmentArrayList = angular.copy(resp.rows);
                $scope.allTreatmentArray = [];
                angular.forEach($scope.allTreatmentArrayList, function (item) {
                    if (item.Treatments.length > 0) {
                        $scope.allTreatmentArray.push(item);
                    }
                });
                if ($scope.allTreatmentArray.length > 0) {
                    angular.forEach($scope.allTreatmentArray, function (mitem) {
                        angular.forEach(mitem.Treatments, function (item, index) {
                            item.TreatmentData.TreatmentNotesArray = [];
                            if (item.TreatmentNotesArray != undefined && item.TreatmentNotesArray.length > 0) {
                                item.TreatmentData.TreatmentNotesArray = angular.copy(item.TreatmentNotesArray);
                            }
                            item.TreatmentNotesArray = [];
                        });
                    });
                }
            }
        }
        function onerror(error) {
            console.log(error);
        }
    };



    $scope.addImagesParticularTreatment = function (mainitem, subitem, index, parentindex, ArrayName) {
        var modalInstance = $uibModal.open({
            "templateUrl": "templates/Dental/DentalTreatmentImages.html",
            "controller": "EhnoteDentalTreatmentImages",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "ParentObject": {
                    "ArrayName": ArrayName,
                    "mainitem": mainitem,
                    "subitem": subitem,
                    "AllDoctorsList": $scope.AllDoctorsList,
                    "Index": index,
                    "PatientId": appointmentinfo.PatientID,
                    "AppointmentId": $scope.PatientimageFile[$scope.FileUploadIndex].AppointmentId,
                    "ParentIndex": parentindex,
                    "ShowAllTreatments": false
                }
            }
        });
        modalInstance.result.then(function (result) {
            if (result === 'save') {

            }
        }, function (cancel) {
        });
    };


    $scope.insTpaUploadObj = {
        "UserId": eHnoteMasterDataService.getLoginId(),
        "PatientId": appointmentinfo.PatientID,
        "HospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        "DocumentObj": "",
        "DocumentTypeId": "",
        "PatientInsuranceDetailId": 0,
        "InsuranceUploads": [],
        "TempImagesArray": [],
        "TempPdfArray": []
    };
    $scope.selectDocumentType = function (item) {

        $scope.insTpaUploadObj.DocumentTypeId = item.Id;

    };

    $scope.selectInsTpaFile = function ($files) {
        console.log($files);
        if ($files.length > 0) {
            $scope.insTpaUploadObj.InsuranceUploads = $files;
            if ($scope.insTpaUploadObj.InsuranceUploads != null) {
                if ($scope.insTpaUploadObj.InsuranceUploads.length > 0) {
                    $scope.insTpaUploadObj.TempImagesArray = [];
                    $scope.insTpaUploadObj.TempPdfArray = [];
                    angular.forEach($scope.insTpaUploadObj.InsuranceUploads, function (kitem) {

                        var pName = kitem.name, name = "";
                        var type = kitem.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "file": kitem,
                            "DocumentTypeId": $scope.insTpaUploadObj.DocumentTypeId,
                            "DeleteInd": false,
                            "DocumentId": 0,
                            "DocumentExt": kitem.type,
                            "DisplayName": name
                        }
                        if (kitem.type != 'application/pdf') {
                            $scope.insTpaUploadObj.TempImagesArray.push(obj);

                        }
                        else {
                            $scope.insTpaUploadObj.TempPdfArray.push(obj);
                        }
                    });
                }
            }
        }
    };

    $scope.uploadPatientInsTpaDocuments = function () {

        console.log($scope.insTpaUploadObj);
        var file = $scope.insTpaUploadObj.InsuranceUploads;
        var fd = new FormData();
        if ($scope.insTpaUploadObj.DocumentTypeId == undefined || $scope.insTpaUploadObj.DocumentTypeId == null || $scope.insTpaUploadObj.DocumentTypeId == "") {
            alertify.error("Please select Document Type");
            return
        }
        else if (file == undefined || file == null || file == "") {
            alertify.error("Please select file");
            return
        }

        $scope.insTpaUploadObj.PatientInsuranceDetailId = $scope.selectedInsTpaObj.PatientInsuranceDetailId;

        fd.append("PatientInsuranceDetailId", $scope.insTpaUploadObj.PatientInsuranceDetailId);
        fd.append("PatientId", $scope.insTpaUploadObj.PatientId);
        fd.append("BranchId", $scope.insTpaUploadObj.HospitalId);
        fd.append("UserId", $scope.insTpaUploadObj.UserId);
        fd.append("DocumentTypeId", $scope.insTpaUploadObj.DocumentTypeId);
        fd.append("InsuranceUploads", $scope.insTpaUploadObj.InsuranceUploads);




        angular.forEach(file, function (value, key) {
            fd.append(key, value);
        });
        eHnoteDiagnosisDataServices.addPatientInsuranceTpaFileUpload(fd, callbackfileuploadSuccess, callbackfileuploadError);
        function callbackfileuploadSuccess(resp) {
            console.log(resp);
            if (resp.Status === "Success") {
                $scope.TempImagesArray = [];
                $scope.TempPdfArray = [];
                if (resp.DocumentDetails.length > 0) {
                    $scope.selectedInsTpaObj.PatientDocumentDetails.push(resp.DocumentDetails[resp.DocumentDetails.length - 1]);
                    restructureUploads(resp.DocumentDetails);
                    $scope.insTpaUploadObj.DocumentTypeId = "";
                    $scope.insTpaUploadObj.InsuranceUploads = "";
                    $scope.GetAllDocumentType();
                    angular.element("input[type='file']").val('');
                }
            } else {
                alertify.error("Some Error Occured");
            }

        }
        function callbackfileuploadError(err) {
            alertify.success("Uploading Failed");
        }
    }

    $scope.checkpatientInsuranceUploads = function (item, index) {
        $scope.FileUploadIndex = index;
        $scope.selectedInsTpaObj = item;
        $scope.TempImagesArray = [];
        $scope.TempPdfArray = [];
        if ($scope.selectedInsTpaObj.PatientDocumentDetails.length > 0) {
            restructureUploads($scope.selectedInsTpaObj.PatientDocumentDetails);
        }
    }



    $scope.scanFiles = function () {
        var obj = {
            "PatientId": appointmentinfo.PatientID || null,
            "AppointmentId": $scope.FilesObj.AppointmentID || null,
            "AppointmentDate": $filter('date')($scope.cacheStorageItem.AppointmentDt, "yyyy-MM-dd"),
            "PatientName": appointmentinfo.PatientName || '',
            "Tab": "FileUploads",
            "SignedDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
            "FileTypeId": parseInt($scope.SelectedFile),
            "IsPartiallyUploaded": "Y",
            "TreatmentPlanId": appointmentinfo.TreatmentPlanId,
            "ShowNewConsultation": "Y",
            "LabTestId": 0,
            "Remarks": '',
            "FileName": '',
            "DisplayName": '',
            "DocumentTypeArray": $scope.DocumentTypeArray || [],
            "AllVisitsArray": $scope.AllVisitsArray || [],
            "IsFrom":"Files_Main"
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
            $scope.GetAllPatientUploadsNew(appointmentinfo.PatientID);
            // getAllFiles(appointmentinfo.PatientID, $scope.DoctorId, appointmentinfo.AppointmentId);

        }, function (cancel) {
        });

    }

    $scope.FileUploadTabsObj = {
        "SelectedTab": 1
    };

    $scope.SwitchFileUploadsTab = function (val) {
        $scope.FileUploadTabsObj.SelectedTab = val;
    };
    $scope.SelectedAppointmentUploadFiles = [];
    $scope.ShowSelectedAppointmentUploadFiles = function (Obj) {
        Obj.Files = Obj.Files || [];
        // $scope.AppId = Obj.AppointmentId;
        $scope.SelectedDate = Obj.DateValue;
        //appointmentinfo.AppointmentId = Obj.AppointmentId;
        //appointmentinfo.HospitalId = Obj.HospitalId;

        // $scope.currentDate = Obj.DateValue;
        eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
        if (Obj.Files.length > 0) {
            $scope.SelectedAppointmentUploadFiles = angular.copy(Obj.Files);
        } else {
            $scope.SelectedAppointmentUploadFiles = [];
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



    $scope.ShowRemarksforFileUpload = function (obj) {
        obj.ShowRemarks = true;
    };

    $scope.ShowAppointmentDetails = function (item) {
        //$scope.AppointmentDetails = item.AppointmentDetails || [];
        //if ($scope.AppointmentDetails.length > 0) {
        //    angular.forEach($scope.AppointmentDetails, function (item) {
        //        var datetime = item.AppointmentDate + "T" + item.StartTime;
        //        item.NewStartTime = "";
        //        item.NewStartTime = $filter('date')(datetime, "hh:mm a");

        //    })
        //}
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

    $scope.FilesDateinfoPopover = {
        templateUrl: 'templates/uibpopups/FilesDateinfoPopover.html',
    };
    $scope.FileUploadFilterOnDate = {
        templateUrl: 'FileUploadFilterOnDate.html',
        "scope": $scope
    };
    $scope.FileUploadFilterOnDocuType = {
        templateUrl: 'FileUploadFilterOnDocuType.html',
        "scope": $scope
    };
    $scope.DocumentTypelistObj = {
        "SelectStatusString": "Select DocumentType",
        "Name": "",
        "AllDocuTypeCheck": true
    };
   
    $scope.DateTimeSortingFiles = function (val) {
        if (val == 1) {
            $scope.SortByDateASC = "Asc";
        }
        if (val == 2) {
            $scope.SortByDateASC = "desc";
        }
    }
    $scope.checkAllDocuments = function (val) {
        if (val) {
            angular.forEach($scope.DocumentTypeArray, function (item) {
                item.IsChecked = true;
            });
          }
        else {
            angular.forEach($scope.DocumentTypeArray, function (item) {
                item.IsChecked = false;
            });
        }
    };
    $scope.DocumentTypeFilter = function (obj) {
        var checkedArray = _.where($scope.DocumentTypeArray, { IsChecked: true });
        $scope.DocumentTypelistObj.AllDocuTypeCheck = checkedArray.length > 0 && $scope.DocumentTypeArray.length === checkedArray.length ? true : false;
    };

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

    $scope.ChangeDocumentType = function () {
        angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
            item.DocumentID = item.DocumentID || 0;
            if (item.DocumentID == 0) {
                item.FileTypeId = parseInt($scope.SelectedFile);
            }
        });
    }

    $scope.getBlobImage = function (blobName) {
        $http.get(`http://localhost:2481/api/image/${blobName}`, { responseType: 'arraybuffer' })
            .then(function (response) {
                let blob = new Blob([response.data], { type: 'image/jpeg' });
                let imageUrl = URL.createObjectURL(blob);
                $scope.imageSrc = imageUrl;  // Set image source
            })
            .catch(function (error) {
                console.error('Error loading image:', error);
            });
    };

    $scope.sampleimageSrc = "";
    //$scope.getFileByBlobName = function () {
    //    var blobName = "3/MedicalRecord_2025-03-23-204713-48009.jpg";
    //    eHnoteDiagnosisDataServices.GetPatientBlobImage(blobName).then(function (resp) {

    //        console.log(JSON.stringify(resp))

    //        let blob = new Blob([resp.data], { type: 'image/jpeg' });
    //        console.log('Blob:', blob);  // Check the Blob object
    //        console.log('Blob Type:', blob.type);  // Verify content type

    //        let imageUrl = URL.createObjectURL(blob);
    //        console.log('Generated Image URL:', imageUrl);
    //        $scope.sampleimageSrc = imageUrl;
    //        $scope.$apply();


    //    });
    //}

    $scope.getFileByBlobName = function () {
        var blobName = "3/MedicalRecord_2025-03-23-204713-48009.jpg";
        eHnoteDiagnosisDataServices.GetPatientBlobImageasnase64(blobName).then(function (resp) {

            console.log(JSON.stringify(resp))

            
            $scope.sampleimageSrc = resp.data.Base64Data;
            


        });
    }
    $scope.splitfileobject = {
        "splitRemarks": "",
        "SelectedDate1": "",
        "MasterFileTypeId":1
    }
    $scope.viewSplitFiles = function () {
        $scope.mInstanceSplitView = $uibModal.open({
            templateUrl: 'splitfilesview.html',
            backdrop: 'static',
            keyboard: false,
            windowClass: 'modal__popup--1 full-page-modal',
            scope: $scope,
            size: 'xl',
            controller: function ($scope, $uibModalInstance, $timeout, $rootScope) {

                $scope.thumbnails = [];
                $scope.selectedPages = [];
                $scope.renderedPages = [];
                $scope.visiblePages = [];
                $scope.pdfDoc = null;
                $scope.pageRotations = {};
                $scope.renderTasks = {};
                $scope.selectedPdfUrls = [];
                $scope.Splitobj = {
                    "selectedAll": false,
                }
                $scope.pdfDocs = [];
                $scope._pdfCache = {};
                $scope._getOrLoadPdf = async function (fileBlob, key) {
                    if (!fileBlob) throw new Error('Missing file blob for selected page.');
                    if (!$scope._pdfCache[key]) {
                        const bytes = await fileBlob.arrayBuffer();
                        const doc = await PDFLib.PDFDocument.load(bytes);
                        $scope._pdfCache[key] = { bytes, doc };
                    }
                    return $scope._pdfCache[key];
                };
                $scope.extractSinglePage = async function (fileBlob, pageNumber, cacheKey) {
                    const { doc } = await $scope._getOrLoadPdf(fileBlob, cacheKey);
                    const newPdf = await PDFLib.PDFDocument.create();
                    const [copied] = await newPdf.copyPages(doc, [pageNumber - 1]); // zero-based
                    newPdf.addPage(copied);
                    const pdfBytes = await newPdf.save();
                    return new Blob([pdfBytes], { type: 'application/pdf' });
                };

                $timeout(() => { $scope.loadPDF(); }, 0);

                $scope.loadPDF = async function () {
                    try {
                        $scope.thumbnails = [];
                        $scope.renderedPages = [];
                        $scope.visiblePages = [];
                        $scope.pdfDocs = [];

                        for (let fileIndex = 0; fileIndex < $scope.FilesObj.TempImagesArray.length; fileIndex++) {
                            const fileObj = $scope.FilesObj.TempImagesArray[fileIndex];
                            const ext = (fileObj.FileExt || '').toLowerCase();

                            const isPDF = ext === 'pdf' || ext === 'application/pdf' || fileObj.DocURL?.toLowerCase().endsWith('.pdf');

                            if (isPDF) {
                                const pdfBlob = fileObj.file || await (await fetch(fileObj.DocURL)).blob();
                                fileObj._pdfBlob = pdfBlob;

                                const arrayBuffer = await pdfBlob.arrayBuffer();
                                const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                                $scope.pdfDocs[fileIndex] = pdfDoc;
                                $rootScope.$broadcast("loader_show");
                                for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                                    $scope.renderedPages.push({
                                        fileIndex,
                                        pageNum,
                                        FileExt: 'pdf',
                                        fileObj
                                    });

                                    await renderThumbnail(fileObj, fileIndex, pageNum);
                                    renderFullPage(fileObj, fileIndex, pageNum, 'pdf');
                                }
                            } else {
                                // Image Handling
                                const imageUrl = fileObj.file instanceof Blob || fileObj.file instanceof File
                                    ? URL.createObjectURL(fileObj.file)
                                    : fileObj.DocURL;

                                $scope.renderedPages.push({
                                    fileIndex,
                                    pageNum: 1,
                                    FileExt: 'image',
                                    fileObj,
                                    imageData: imageUrl
                                });

                                $scope.thumbnails.push({
                                    fileObj,
                                    fileIndex: fileIndex,
                                    pageNumber: 1,
                                    FileExt: fileObj.FileExt,
                                    imageData: imageUrl,
                                    selected: false,
                                    DeleteInd: "N",
                                    DisplayName: fileObj.DisplayName || fileObj.FileName || "Unknown",
                                    Thumbnail: fileObj.Thumbnail || "",
                                    FileTypeId: fileObj.FileTypeId || $scope.splitfileobject.MasterFileTypeId
                                });

                                renderFullPage(fileObj, fileIndex, 1, 'image');
                            }
                        }

                        $scope.visiblePages = [...$scope.renderedPages];
                        $scope.$applyAsync();
                        $rootScope.$broadcast("loader_hide");
                    } catch (err) {
                        console.error("Error loading files:", err);
                    }
                };

                // ===== Render Thumbnail =====
                async function renderThumbnail(fileObj, fileIndex, pageNum) {
                    try {
                        let imageData;
                        const ext = (fileObj.FileExt || '').toLowerCase();

                        if (ext === 'pdf' || ext === 'application/pdf') {
                            const pdfDoc = $scope.pdfDocs[fileIndex];
                            const page = await pdfDoc.getPage(pageNum);
                            const scale = 0.2;
                            const viewport = page.getViewport({ scale });

                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;

                            await page.render({ canvasContext: ctx, viewport }).promise;
                            imageData = canvas.toDataURL('image/png');
                        } else {
                            imageData = fileObj.file instanceof Blob ? URL.createObjectURL(fileObj.file) : fileObj.DocURL;
                        }

                        $scope.thumbnails.push({
                            file: fileObj.file || fileObj._pdfBlob,
                            FileName: fileObj.FileName,
                            FileExt: fileObj.FileExt,
                            pageNumber: pageNum,
                            fileIndex: fileIndex,
                            imageData: imageData,
                            selected: false,
                            DeleteInd: "N",
                            DisplayName: fileObj.DisplayName || fileObj.FileName || "Unknown.pdf",
                            Thumbnail: fileObj.Thumbnail || "",
                            FileTypeId: fileObj.FileTypeId || $scope.splitfileobject.MasterFileTypeId
                        });
                    } catch (err) {
                        console.error('Error generating thumbnail for file:', fileObj, err);
                    }
                }

                // ===== Render Full Page =====
                function renderFullPage(fileObj, fileIndex, pageNum, type = 'pdf') {
                    const canvasId = 'canvas-page-' + fileIndex + '-' + pageNum;
                    const canvas = document.getElementById(canvasId);

                    if (!canvas) {
                        setTimeout(() => renderFullPage(fileObj, fileIndex, pageNum, type), 100);
                        return;
                    }

                    const ctx = canvas.getContext('2d');

                    if (type === 'pdf' || type === 'application/pdf') {
                        const pdfDoc = $scope.pdfDocs[fileIndex];
                        pdfDoc.getPage(pageNum).then(page => {
                            const scale = 1.0;
                            const rotation = $scope.pageRotations[fileIndex + '-' + pageNum] || 0;
                            const viewport = page.getViewport({ scale, rotation });

                            canvas.width = viewport.width;
                            canvas.height = viewport.height;
                            page.render({ canvasContext: ctx, viewport }).promise.catch(err => console.error(err));
                        });
                    } else if (type === 'image') {
                        const img = new Image();
                        img.onload = function () {
                            const scale = 1.0;
                            canvas.width = img.width * scale;
                            canvas.height = img.height * scale;
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        };
                        img.src = fileObj.file instanceof Blob || fileObj.file instanceof File
                            ? URL.createObjectURL(fileObj.file)
                            : fileObj.DocURL;
                    }
                }

                $scope.selectedPdfUrls = $scope.selectedPdfUrls || [];
                $scope.selectedPages = $scope.selectedPages || [];
                $scope.Splitobj.selectedAll = $scope.Splitobj.selectedAll || false;

                $scope.toggleSelectAll = function () {
                    const newState = $scope.Splitobj.selectedAll;
                    $scope.selectedPdfUrls = [];
                    $scope.selectedPages = [];

                    if ($scope.thumbnails && $scope.thumbnails.length > 0) {
                        $scope.thumbnails.forEach(thumb => {
                            thumb.selected = newState;
                            if (newState) {
                                $scope.selectedPdfUrls.push(thumb);
                                $scope.selectedPages.push({
                                    fileIndex: thumb.fileIndex,
                                    pageNum: thumb.pageNumber
                                });
                            }
                        });
                    }

                    $scope.selectedCount = $scope.selectedPages.length;
                    updateVisiblePages();
                };

                $scope.toggleSelect = function (thumb) {
                    if (!thumb) return;

                    if (thumb.selected) {
                        if (!$scope.selectedPdfUrls.some(p =>
                            p.fileIndex === thumb.fileIndex && p.pageNumber === thumb.pageNumber
                        )) {
                            $scope.selectedPdfUrls.push(thumb);
                        }
                    } else {
                        $scope.selectedPdfUrls = $scope.selectedPdfUrls.filter(p =>
                            !(p.fileIndex === thumb.fileIndex && p.pageNumber === thumb.pageNumber)
                        );
                    }

                    $scope.Splitobj.selectedAll = $scope.thumbnails.length > 0 && $scope.thumbnails.every(t => t.selected);
                    $scope.selectedCount = $scope.selectedPdfUrls.length;
                    updateVisiblePages();
                };


                // ========== Update Visible Pages ========== //
                function updateVisiblePages() {
                    if ($scope.selectedPdfUrls.length === 0) {
                        $scope.visiblePages = [...$scope.renderedPages];
                    } else {
                        // Sort by fileIndex, then by pageNum
                        const sorted = [...$scope.selectedPdfUrls].sort((a, b) => {
                            if (a.fileIndex === b.fileIndex) {
                                return a.pageNumber - b.pageNumber;
                            }
                            return a.fileIndex - b.fileIndex;
                        });

                        $scope.visiblePages = sorted.map(t => ({
                            fileObj: t.fileObj,
                            fileIndex: t.fileIndex,
                            pageNum: t.pageNumber,
                            FileExt: (t.FileExt && t.FileExt.toLowerCase().includes('pdf')) ? 'pdf' : 'image'
                        }));

                    }

                    $timeout(() => {
                        setTimeout(() => {
                            $scope.visiblePages.forEach(p => {
                                renderFullPage(p.fileObj, p.fileIndex, p.pageNum, p.FileExt);
                            });
                        }, 100);
                    }, 0);

                    $scope.$applyAsync();
                }

                $scope.scrollToPage = function (fileIndex, pageNumber) {
                    const target = document.getElementById('canvas-page-' + fileIndex + '-' + pageNumber);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                };
                $scope.splitfileobject.MasterFileTypeId = $scope.SelectedFile|| 1;
                $scope.loadDocumentTypes = function () {
                    ehnoteservice.getDocumentTypes().then(function (res) {
                        $scope.DocumentTypeArray = res.data || [];

                        // set default only if not already set
                        if (!$scope.splitfileobject.MasterFileTypeId) {
                            $scope.splitfileobject.MasterFileTypeId = 1;
                            $scope.updateAllOriginalFileTypes($scope.splitfileobject.MasterFileTypeId);
                        }
                    });
                };

                $scope.updateAllOriginalFileTypes = function (typeId) {
                    $scope.splitfileobject.MasterFileTypeId = typeId;

                    ($scope.OriginalFiles || []).forEach(f => f.FileTypeId = typeId);
                    ($scope.SplitFilesArray || []).forEach(p => p.FileTypeId = typeId);
                    ($scope.FilesObj?.TempImagesArray || []).forEach(f => f.FileTypeId = typeId);
                    ($scope.thumbnails || []).forEach(t => t.FileTypeId = typeId);
                };

                $scope.PatientFileUpload = async function () {
                    if (!$scope.selectedPdfUrls || $scope.selectedPdfUrls.length === 0) {
                        alertify.error("Please select Document.");
                        return;
                    }
                    alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'> The selected Document will be saved and removed from the original file ? </h4>", async function () {
                        try {
                            var obj = {
                                "UserID": eHnoteMasterDataService.getLoginId(),
                                "HospitalID": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                                "PatientID": $scope.cacheStorageItem.PatientID || 0,
                                "PatientName": $scope.cacheStorageItem.PatientName || '',
                                "AppointmentID": $scope.FilesObj.AppointmentID || 0,
                                "AppointmentDate": $filter('date')($scope.cacheStorageItem.AppointmentDt, "yyyy-MM-dd"),
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
                                "Logs": {},
                                "Split": "splitpages"
                            };
                            $scope.LogObj.LogArray = [];
                            $scope.FilesObj.TempImagesArray = $scope.FilesObj.TempImagesArray || [];
                            $scope.selectedPdfUrls = $scope.selectedPdfUrls || [];
                            if ($scope.selectedPdfUrls && $scope.selectedPdfUrls.length > 0) {
                                for (const item of $scope.selectedPdfUrls) {
                                    item.DocumentID = item.DocumentID || 0;

                                    if (!item.file && item.fileObj && item.fileObj.file) {
                                        item.file = item.fileObj.file;
                                    }

                                    if (!item.FileName && item.file && item.file.name) {
                                        item.FileName = item.file.name;
                                    }
                                    if (!item.FileExt && item.file && item.file.type) {
                                        item.FileExt = item.file.type;
                                    }

                                    const isPDF = item.FileExt && item.FileExt.toLowerCase().includes('pdf');

                                    if (isPDF) {
                                        // ---- PDF handling ----
                                        const srcBlob = item.file;
                                        if (!srcBlob) continue;

                                        const pagesToExtract = item.selectedPages && item.selectedPages.length > 0
                                            ? item.selectedPages
                                            : [item.pageNumber];

                                        for (const pageNum of pagesToExtract) {
                                            const singlePageBlob = await $scope.extractSinglePage(srcBlob, pageNum, item.fileIndex);

                                            var object = {
                                                "file": singlePageBlob,
                                                "S3URL": item.S3URL || '',
                                                "FileTypeId": item.FileTypeId,
                                                "Remarks": $scope.splitfileobject.splitRemarks || '',
                                                "DeleteInd": item.DeleteInd,
                                                "DocumentID": item.DocumentID,
                                                "DisplayName": item.DisplayName || item.FileName,
                                                "FileName": item.FileName,
                                                "FileExt": item.FileExt,
                                                "Thumbnail": item.Thumbnail,
                                            };

                                            if (item.DocumentID === 0) {
                                                obj.TempDocumentDetails.push(object);
                                            } else {
                                                obj.DocumentDetails.push(object);
                                            }
                                        }
                                    } else {
                                        // ---- Image handling ----
                                        var object = {
                                            "file": item.file,  // already File object
                                            "S3URL": item.S3URL || '',
                                            "FileTypeId": item.FileTypeId,
                                            "Remarks": $scope.splitfileobject.splitRemarks || '',
                                            "DeleteInd": item.DeleteInd,
                                            "DocumentID": item.DocumentID,
                                            "DisplayName": item.DisplayName || item.FileName,
                                            "FileName": item.FileName,
                                            "FileExt": item.FileExt,
                                            "Thumbnail": item.Thumbnail || (item.file ? URL.createObjectURL(item.file) : null),
                                        };

                                        if (item.DocumentID === 0) {
                                            obj.TempDocumentDetails.push(object);
                                        } else {
                                            obj.DocumentDetails.push(object);
                                        }
                                    }
                                }
                            }

                            else if ($scope.FilesObj.TempImagesArray.length > 0) {
                                angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
                                    item.DocumentID = item.DocumentID || 0;

                                    var object = {
                                        "file": item.file,
                                        "S3URL": item.S3URL || '',
                                        "FileTypeId": item.FileTypeId,
                                        "Remarks": $scope.splitfileobject.splitRemarks || '',
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
                                        "Remarks": $scope.splitfileobject.splitRemarks || '',
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
                        } catch (error) {
                            console.error("Error during file upload process:", error);
                            $scope.IsDisabled = false;
                        }

                    }, function () { });
                    function OnFilesObjMaterialSuccess(data) {
                        alertify.success("Files Uploaded Successfully");
                        //$scope.thumbnails.forEach(function (thumb) {
                        //    if (thumb.selected) {
                        //        thumb.selected = false;
                        //    }
                        //});

                        //$scope.selectedAllDisabled = $scope.thumbnails.some(t => t.disabled);

                        $scope.thumbnails = $scope.thumbnails.filter(function (thumb) {
                            return !thumb.selected; // keep only unselected
                        });

                        const removedPages = $scope.selectedPdfUrls
                            .filter(p => p.selected)
                            .map(p => ({ fileIndex: p.fileIndex, pageNum: p.pageNumber }));

                        $scope.renderedPages = $scope.renderedPages.filter(p =>
                            !removedPages.some(r => r.fileIndex === p.fileIndex && r.pageNum === p.pageNum)
                        );

                        $scope.visiblePages = $scope.renderedPages.map(p => ({
                            fileObj: p.fileObj,
                            fileIndex: p.fileIndex,
                            pageNum: p.pageNum,
                            FileExt: p.FileExt
                        }));
                        const isFullFileSuccess = $scope.selectedPdfUrls.length === 0;
                        const allPagesRemoved = $scope.visiblePages.length === 0;

                        $scope.visiblePages.forEach(p => {
                            const canvasId = `canvas-page-${p.fileIndex}-${p.pageNum}`;
                            const canvas = document.getElementById(canvasId);
                            if (canvas) {
                                const ctx = canvas.getContext('2d');
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                            }
                        });

                        $timeout(() => {
                            setTimeout(() => {
                                $scope.visiblePages.forEach(p => {
                                    renderFullPage(p.fileObj, p.fileIndex, p.pageNum, p.FileExt);
                                });
                            }, 100);
                        }, 0);

                        $scope.Splitobj.selectedAll = false;

                        $scope.FilesObj = angular.copy($scope.GetFilesObj());
                        $scope.GetAllPatientUploadsNew();
                        $scope.IsDisabled = true;
                        $scope.splitfileobject.SelectedDate1 = "";
                        $scope.splitfileobject.MasterFileTypeId = 1;
                        $scope.splitfileobject.splitRemarks = "";
                        $scope.selectedCount = "";
                        $scope.selectedPdfUrls = [];
                        if ((isFullFileSuccess || allPagesRemoved) && $scope.closeuibpopup) {
                            $scope.$parent.FilesObj.TempImagesArray = [];
                            $scope.closeuibpopup();
                            return;
                        }
                        $scope.$applyAsync();
                    }

                    function OnFilesObjMaterialError(data) {
                        console.log(data);
                        $scope.IsDisabled = false;
                    }
                };


                $scope.closeuibpopup = function () {
                    $uibModalInstance.dismiss('close');
                    $scope.$parent.SelectedFile = 1;
                    $scope.$parent.SelectedDate1 = "";
                    $scope.$parent.FilesObj.TempImagesArray = [];
                };
            }
        });
    };
}]);
"use strict";
eHnoteWebApp.controller("UsAscPreAuthorizationCtrl", ["$scope", "$http", "$log", "$rootScope", "$uibModal", "$routeParams", "$filter", "$timeout", "alertify", "eHnoteMasterDataService", "eHnoteInsuranceService", "eHnotePatientAddressDataServices", "eHnotePatientDataService", "InventoryService", "localStorageFactory", "eHnoteUserAppointmentDataService", "eHnoteMainAppointmentService", "eHnoteLoginStatusService", "eHnoteUserDataService", "$location", "eHnoteCacheStorageService", function ($scope, $http, $log, $rootScope, $uibModal, $routeParams, $filter, $timeout, alertify, eHnoteMasterDataService, eHnoteInsuranceService, eHnotePatientAddressDataServices, eHnotePatientDataService, InventoryService, localStorageFactory, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnoteLoginStatusService, eHnoteUserDataService, $location, eHnoteCacheStorageService) {


    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    }
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

    $scope.surgeryListGetObj = {
        "FromDate": "",
        "ToDate": "",
        "HospitalId": "",
        "HospitalObj": "",
        "DoctorId": "",
        "DoctorObj": "",
        "Status": "0",
        "GetAllDoctorsIndicator": "1",
        "SearchText": "",
        "CounselorStatusId": "0",
        "CounselorObj": "",
        "NewpatSearchType": 1,
        "PatientDisplayId": "",
        "OldPatientDisplayId": "",
        "firstname": "",
        "PatientId": 0,
        "DOB": "",
        "PreAuthStatusId":null
    };
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    };
    $scope.cacheStorageItem.AppointmentType = 'preauth';
    $scope.surgeryListGetObj.FromDate = $filter("date")(new Date(), "MM-dd-yyyy");
    $scope.surgeryListGetObj.ToDate = $filter("date")(new Date(), "MM-dd-yyyy");

    $scope.GetPreOpCallObj = function () {
        return {
            "UserId": $scope.UserId,
            "AppointmentId": null,
            "PatientId": null,
            "HospitalId": $scope.HospitalId,
            "PatientAscPreOpCallDetailId": 0,
            "ContactType": "",
            "IsConnectedWithPatient": false,
            "IsConnectedWithFamilyOrFriend": false,
            "IsLeftMsgWithFamilyOrFriend": false,
            "IsLeftMsgWithPatient": false,
            "IsNoResponse": false,
            "IsArrivalTimeShared": false,
            "IsAccompanyShared": false,
            "IsDrinkPlentyWaterShared": false,
            "IsNpoAfterMidnightShared": false,
            "IsTakeBpHeartMedShared": false,
            "IsDoNotTakeBpMedShared": false,
            "IsCoPay": false,
            "IsNoMakeupJewelMoistShared": false,
            "DropStartDate": "",
            "DropsStartTime": "",
            "ContactStartDate": "",
            "ContactStartTime": "",
            "CoPayNotes": "",
            "Remarks": "",
            "DeleteInd": "N"
        }
    };

    $scope.PatientInsuranceList = [];

    $scope.OpenNewPreAuthPopover = function (item) {
        $scope.PatientInsuranceList = item;
    };


    $scope.PreOpCallObj = angular.copy($scope.GetPreOpCallObj());
    $scope.GetStatus = function () {
        return [{
            "Id": 1,
            /*"Name": "Request Denied"*/
            "Name": "Denied",
            "isChecked":false
        },
        {
            "Id": 2,
            "Name": "Pending",
            "isChecked": false
        },
        {
            "Id": 3,
            "Name": "Approved",
            "isChecked": false
        }
        ];
    };
    $scope.GetStatusList = angular.copy($scope.GetStatus());
    $scope.NavObj = {      
        "IsApptSelectedInfoInd": true
    }
    $scope.Preauthapptnoteslist = [];
    $scope.clickpreauthpopup = function (item) {
        let Obj = {
            "PatientId": item.PatientID,
            "AppointmentId": item.AppointmentID,
        }
        $scope.ContactList = [];
        if (item.Patient.ContactNo !== "") {
            let object = {
                "value": item.Patient.ContactNo
            };
            $scope.ContactList.push(object);
        }
        if (item.Patient.MobileNo !== "") {
            let object = {
                "value": item.Patient.MobileNo
            };
            $scope.ContactList.push(object);
        }
        eHnotePatientDataService.GetPatientAscPreAuthDetails(Obj).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.PreOpCallDetails = [];
                $scope.Preauthapptnoteslist = [];
                $scope.Preauthapptnoteslist = resp.data.AppointmentNotes || [];


                $scope.AppointmentList = resp.data.AppointmentList || [];
                resp.data.rows = resp.data.rows || [];
                let AppointmentPreauthDetails = [], PatientInsuranceList=[];
                let PatientDetails = [], PreAuthLogs=[];
                if (resp.data.rows.length > 0) {
                    AppointmentPreauthDetails = resp.data.rows || [];
                   /* PreAuthNotesList = resp.data.PreAuthNotesList || [];*/
                }
                PatientDetails = resp.data.PatientDetails || [];
                PatientInsuranceList = resp.data.PatientInsuranceList || [];
                PreAuthLogs = resp.data.PreAuthLogs || [];
                $scope.selectedapptid = item.AppointmentID;
             
                $scope.mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/uibpopups/pre-auth-edit-popup.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "keyboard": false,
                    "windowClass": "newassessmentspopupuib ",
                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                        $scope.closeuib = function () {
                            $uibModalInstance.dismiss("cancel");
                        };
                        AppointmentPreauthDetails = AppointmentPreauthDetails || [];
                        let ndate = moment().format("YYYY-MM-DD");
                        if (item.SurgeryTime != '') {
                            let edate = ndate + " " + item.SurgeryTime;
                            var surgerytime= moment(edate).format("hh:mm A");
                         
                        }

                        var obj = eHnoteUserDataService.UsMobileFormatChange(item.Patient.MobileNo);
                        $scope.PatientMobileNumber = obj.UsFormatMobileNumber;

                        if (item.Patient.S3URL != '') {
                            var PatientImage = item.Patient.S3URL
                        } else {
                            var PatientImage = ""
                        }

                        if (item.SurgeryList.length > 0) {
                            var OrganId = item.SurgeryList[0].OrganId || null;
                            var OrganName = "";
                            if (OrganId == 1 ) {
                                OrganName = "OD";
                            } else if (OrganId == 2 ) {
                                OrganName = "OS";
                            } else if (OrganId == 3 ) {
                                OrganName = "OU";
                            }  else {
                                OrganName = "";
                            }
                      
                        }
                        $scope.SelectedPatientApptDetails = {
                            "FullName": item.Patient.FullName,
                            "PatientDisplayId": item.Patient.PatientDisplayId,
                            "Gender": item.Patient.Gender,
                            "Age": item.Patient.CurrentAge.year + 'Y ' + item.Patient.CurrentAge.month + 'M',
                            "SurgeryName": item.SurgeryList.length>0 ? item.SurgeryList[0].SurgeryName : '',
                            "SurgeryTime": surgerytime,
                            "SurgeryDate": item.SurgeryDate,
                            "InsuranceDetails": item.AppointmentInsuranceList,
                            "PatientMobileNumber": $scope.PatientMobileNumber||"",
                            "PatientImage": PatientImage,
                            "OrganName": OrganName || "",
                            "DOB": item.Patient.DOB,
                            "S3URL": item.Patient.S3URL || "",
                        };
                
                        if ($scope.PreOpCallDetails.length > 0) {
                            $scope.IsPreOpCallSummaryShow = true;
                        } else {
                            $scope.IsPreOpCallSummaryShow = false;
                        }
                        angular.forEach($scope.AppointmentList, function (item) {
                            item.StartTime = item.StartTime || null;
                            if (item.StartTime !== null) {
                                var datetime = moment(item.StartTime, "HH:mm:ss");
                                item.StartTime = datetime.format("hh:mm A") || null;
                            }
                        });
                        $scope.selectedapptinfo = function (aaitem) {
                            $scope.selectedapptid = aaitem.AppointmentID;
                            $scope.PreAuthObj = GetPreAuthObj();
                            $scope.PreAuthObj.AppointmentId = aaitem.AppointmentID;
                            $scope.PreAuthObj.StatusId = aaitem.PreAuthDetails.StatusId;
                            $scope.PreAuthObj.PatientDocumentDetails = aaitem.PreAuthDetails.PatientDocumentDetails;
                            if (aaitem.PreAuthDetails.StartDate != '') {
                                $scope.PreAuthObj.StartDate = $filter('date')(new Date(aaitem.PreAuthDetails.StartDate), "MM-dd-yyyy");
                            }
                            if (aaitem.PreAuthDetails.EndDate != '') {
                                $scope.PreAuthObj.EndDate = $filter('date')(new Date(aaitem.PreAuthDetails.EndDate), "MM-dd-yyyy");
                            }
                            //$scope.PreAuthObj.Notes = aaitem.PreAuthDetails.Notes;
                            $scope.PreAuthObj.PreAuthorizationNumber = aaitem.PreAuthDetails.PreAuthorizationNumber;
                            $scope.PreAuthObj.PatientASCPreAuthorizationId = aaitem.PreAuthDetails.PatientASCPreAuthorizationId;
                            $scope.PreAuthObj.AppointmentNotes = aaitem.AppointmentNotes;
                            $scope.PreAuthObj.PreAuthLogs = aaitem.PreAuthLogs;
                            
                        }
                        $scope.ShowPreOpCallForm = function () {
                            $scope.PreOpCallObj = angular.copy($scope.GetPreOpCallObj());
                            $scope.IsPreOpCallSummaryShow = !$scope.IsPreOpCallSummaryShow;
                        };

                        $scope.newclicktime = function (item, type) {
                            $scope.currentTime = $filter("date")(new Date(), "h:mm a");
                            if (type == 'StartTime') {
                                item.ContactStartTime = $scope.currentTime;
                            }
                            if (type == 'DropsTime') {
                                item.DropsStartTime = $scope.currentTime;
                            }

                        };
                        $scope.AddPreOpCallDetails = function () {
                            if ($scope.PreOpCallObj.ContactType == "" || $scope.PreOpCallObj.ContactStartDate == "" || $scope.PreOpCallObj.ContactStartTime == "") {
                                alertify.error("Please give atleast one value!");
                                return;
                            }
                            $scope.PreOpCallObj.PatientId = item.PatientID;
                            $scope.PreOpCallObj.AppointmentId = item.AppointmentID;
                            eHnotePatientDataService.AddUpdatePatientPreOpCallDetails($scope.PreOpCallObj).then(function (resp) {
                                if (resp.data.Status == "Success") {
                                    let Obj = {
                                        "PatientId": item.PatientID,
                                        "AppointmentId": item.AppointmentID,
                                    }
                                    eHnotePatientDataService.GetPatientPreOpCallDetailsList(Obj).then(function (resp) {
                                        if (resp.data.status == "Success") {
                                            $scope.PreOpCallDetails = resp.data.rows || [];
                                            $scope.IsPreOpCallSummaryShow = true;
                                        }

                                    }, function (err) {

                                    });
                                    
                                }
                            }, function () {

                            });
                        };

                        $scope.OpenFile = function (item) {
                            window.open(item.S3URL,"_blank");
                        }

                        $scope.GetStatus = function () {
                            return [{
                                "Id": 1,
                                "Name": "Denied"
                            },
                            {
                                "Id": 2,
                                "Name": "Pending"
                            },
                            {
                                "Id": 3,
                                "Name": "Approved"
                            }
                            ];
                        };
                        $scope.GetStatusList = angular.copy($scope.GetStatus());
                        item.Patient = item.Patient || '';
                        let PatientName=''
                        if (item.Patient != '') {
                            PatientName = item.Patient.FullName || '';
                        }
                        //function GetPreAuthObj() {
                        //    return {
                        //        "UserId": eHnoteMasterDataService.getLoginId(),
                        //        "AppointmentId": item.AppointmentID,
                        //        "PatientId": item.PatientID,
                        //        "HospitalId": $scope.HospitalId,
                        //        "DeleteInd": "N",
                        //        "PatientName": PatientName||"",
                        //        "PatientASCPreAuthorizationId": 0,
                        //        "PayorId": 1,
                        //        "OrganizationPayorId": 1,
                        //        "PreAuthorizationNumber": "",
                        //        "StatusId": '',
                        //        "Notes": "",
                        //        "StartDate": "",
                        //        "EndDate": "",
                        //        "PatientDocumentDetails": [],
                        //        "TempDocuments": [],
                        //        "AppointmentNotes": [],
                        //        "PreAuthLogs": [],
                        //        "PreAuthNotesList": [],
                        //        "PreAuthNoteId": 0,
                        //        "Patient": {},
                        //        "PatientInsuranceList":[],
                        //    }
                        //};

                        function GetPreAuthObj() {
                            return {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "AppointmentId": item.AppointmentID,
                                "PatientId": item.PatientID,
                                "HospitalId": $scope.HospitalId,
                                "DeleteInd": "N",
                                "PatientName": "",
                                "PatientASCPreAuthorizationId": 0,
                                //"PayorId": 1,
                                //"OrganizationPayorId": 1,
                                //"PreAuthorizationNumber": "",
                                //"StatusId": '',
                                //"Notes": "",
                                //"StartDate": "",
                                //"EndDate": "",
                                "PatientDocumentDetails": [],
                                "PreAuthDetails": [],

                                "TempDocuments": [],
                                "AppointmentNotes": [],
                                "PreAuthLogs": [],
                                "PreAuthNotesList": [],
                                "PreAuthNoteId": 0,
                                "Patient": {},
                                "PatientInsuranceList": [],
                            }
                        };
                        $scope.PreAuthObj = GetPreAuthObj();
                        $scope.PreAuthFileUploadService = function (file, Invid) {
                            if (file == undefined || file == null || file == "") {
                                return false;
                            }
                            file = file || "";
                            if (file != "") {
                                var DocumentArray = [];
                                var Documentobj = {
                                    "file": file,
                                    "DeleteInd": "N",
                                    "DocumentId": 0,
                                    "DocumentExt": "",
                                    "DocumentName": ""
                                };
                                DocumentArray.push(Documentobj);
                                var obj = {
                                    "UserId": eHnoteMasterDataService.getLoginId(),
                                    "HospitalId": $scope.HospitalId,
                                    "PatientName": $scope.PreAuthObj.PatientName,
                                    "PatientId": item.PatientID,
                                    "AppointmentId": $scope.PreAuthObj.AppointmentId,
                                    "S3Url": "",
                                    "DocumentArray": DocumentArray || []
                                };
                                eHnotePatientDataService.GetFileUploadToS3Url(obj, Success1, Error1);
                                function Success1(response) {
                                    if (response != "") {
                                        //file.type
                                        //file.name
                                        angular.forEach($scope.PreAuthObj.PreAuthDetails, function (item) {
                                            if (Invid.IdentifierId === item.IdentifierId) {
                                                let obj = {
                                                    "UserId": eHnoteMasterDataService.getLoginId(),
                                                    "HospitalId": $scope.HospitalId,
                                                    "PatientName": $scope.PreAuthObj.PatientName,
                                                    "PatientId": item.PatientID,
                                                    "AppointmentId": $scope.PreAuthObj.AppointmentId,
                                                    "S3Url": response || "",
                                                    "S3URL": response || "",
                                                    "DocumentExt": file[0].type || "",
                                                    "DocumentName": file[0].name || "",
                                                    "FileTypeId": 15 || "",
                                                    "DeleteInd": 'N' || "",
                                                    "PatientASCPreAuthorizationId": item.PatientASCPreAuthorizationId || "",
                                                    "PatientAppointmentInsuranceDetailId": item.PatientAppointmentInsuranceDetailId || ""
                                                }
                                                item.PatientDocumentDetails = item.PatientDocumentDetails || [];
                                                item.PatientDocumentDetails.push(obj);
                                            }
                                        });

                                    }
                                    angular.element("input[type='file']").val(null);
                                }
                                function Error1(err) {
                                    alertify.error(err);
                                }
                            }
                        }

                        $scope.selectedFiles = function (files) {
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
                                            "S3URL": "",
                                            "DocumentExt": $scope.file.type,
                                            "DocumentName": $scope.file.name,
                                            "DeleteInd": "N",
                                            "DocumentId": 0,
                                            "file": $scope.file,
                                            "FileTypeId": 15,
                                        };

                                        $scope.PreAuthObj.TempDocuments.push(obj);


                                        angular.element("input[type='file']").val(null);
                                    }
                                });
                            }

                        };

                    
                        $scope.DeleteUploadedFile = function (index, item, FILE) {
                            FILE.DocumentId = FILE.DocumentId || 0;
                            if (FILE.DocumentId !== 0) {
                                FILE.DeleteInd = "Y";
                            } else {
                                item.PatientDocumentDetails.splice(index, 1);
                            }
                        }
                        $scope.ApptSubmiteText = 'Add';
                        $scope.EditPreAuthNote = function (item, index, Mainitem) {
                            $scope.PreAuthObj.Notes = item.Notes;
                            $scope.PreAuthObj.PreAuthNoteId = item.PatientNotesId;
                            $scope.ApptSubmiteText = 'Update';
                            $scope.PreAuthObj.PreAuthNotesList.splice(index, 1);
                        }
                        $scope.DeleteApptNote = function (item, index, Mainitem) {
                            $scope.UserId = eHnoteMasterDataService.getLoginId()
                            if ($scope.UserId == item.UserId) {
                                item.PatientNotesId = item.PatientNotesId || 0;
                                if (item.PatientNotesId  == 0 ) {
                                    $scope.PreAuthObj.PreAuthNotesList.splice(index, 1);
                                } else {
                                    angular.forEach($scope.PreAuthObj.PreAuthNotesList, function (Aitem) {
                                        if (Aitem.PatientNotesId == item.PatientNotesId) {
                                            Aitem.DeleteInd = "Y";
                                        }
                                    });
                                }
                            }
                            $scope.ApptSubmiteText = 'Add';
                        }
                        $scope.ClearPreauth = function (item, index, Mainitem) {
                            $scope.PreAuthObj.Notes = '';
                            $scope.PreAuthObj.PreAuthorizationNumber = "";
                            $scope.PreAuthObj.StatusId = '';
                            $scope.PreAuthObj.Notes = "";
                            $scope.PreAuthObj.StartDate = "";
                            $scope.PreAuthObj.Endate = "";
                            $scope.PreAuthObj.TempDocuments = [];



                        }

                        $scope.AddPreAuthNotestolist = function (item) {
                            $scope.PreAuthObj.Notes = $scope.PreAuthObj.Notes || '';
                            if ($scope.PreAuthObj.Notes == '') {
                                alertify.error("Please Enter Notes");
                                return false;
                            }
                            $scope.PreAuthObj.PreAuthNotesList = $scope.PreAuthObj.PreAuthNotesList || [];
                            var obj = {
                                "PatientNotesId": $scope.PreAuthObj.PreAuthNoteId || 0,
                                "Notes": $scope.PreAuthObj.Notes || "",
                                "DeleteInd": "N",
                                "CreatedBy": userLoginDetails.displayName || "",
                                "UserId": eHnoteMasterDataService.getLoginId() || "",
                                "CreatedDt": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a'),
                                "PatientASCPreAuthorizationId": $scope.PreAuthObj.PatientASCPreAuthorizationId||0,
                            }
                            $scope.PreAuthObj.PreAuthNotesList.push(obj);


                            $scope.PreAuthObj.PreAuthNoteId = 0;
                            $scope.PreAuthObj.Notes = '';
                            $scope.ApptSubmiteText = 'Add';

                        }

                        $scope.SavePreAuth = function () {
                            $scope.PreAuthObj.PatientDocumentDetails = $scope.PreAuthObj.PatientDocumentDetails || [];
                            if ($scope.PreAuthObj.TempDocuments.length > 0) {
                                angular.forEach($scope.PreAuthObj.TempDocuments, function (item) {
                                    $scope.PreAuthObj.PatientDocumentDetails.push(item);
                                });
                            }
                            //if ($scope.PreAuthObj.PreAuthorizationNumber == "" && $scope.PreAuthObj.StatusId == '' && $scope.PreAuthObj.StatusId == '' && $scope.PreAuthObj.StartDate == "" && $scope.PreAuthObj.Endate == "") {
                            //    alertify.error("Please Enter Data");
                            //    return false;
                            //}


                            var obj = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "AppointmentId": $scope.selectedapptid||0,
                                "PatientId": item.PatientID,
                                "HospitalId": $scope.HospitalId,
                                "DeleteInd": $scope.PreAuthObj.DeleteInd,
                                "PatientName": item.Patient.FullName,
                                "PatientASCPreAuthorizationId": $scope.PreAuthObj.PatientASCPreAuthorizationId || 0,
                                "PayorId": item.AppointmentInsuranceList.length > 0 ? item.AppointmentInsuranceList[0].PayorId:'',
                                "OrganizationPayorId": item.AppointmentInsuranceList.length > 0 ? item.AppointmentInsuranceList[0].OrganizationPayorId:'',
                                "PreAuthorizationNumber": $scope.PreAuthObj.PreAuthorizationNumber,
                                //"StatusId": $scope.PreAuthObj.StatusId,
                                //"Notes": $scope.PreAuthObj.Notes,
                                //"StartDate": $scope.PreAuthObj.StartDate,
                                //"EndDate": $scope.PreAuthObj.EndDate || "",
                                //"PatientDocumentDetails": $scope.PreAuthObj.PatientDocumentDetails || [],
                                "PreAuthDetails": $scope.PreAuthObj.PreAuthDetails || [],
                                "PreAuthNotesList": $scope.PreAuthObj.PreAuthNotesList || [],

                            }                            
                            eHnotePatientDataService.ModifyAscPreAuthorizationDetails(obj,onSuccess, onError);
                                
                            function onSuccess(resp) {
                                if (resp.status == "Success") {
                                    $uibModalInstance.close();
                                }
                            }
                            function onError(resp) {
                                console.log(resp);
                            }
                           
                        }

                        $scope.ShowRemarksListRefPopover = {
                            templateUrl: 'PreauthPopovertemplate.html'
                        };
                        $scope.scanFiles = function (sitem) {

                            var obj = {
                                "PatientId": $scope.PreAuthObj.PatientId || null,
                                "AppointmentId": $scope.PreAuthObj.AppointmentId || null,
                                "PatientName": $scope.SelectedPatientApptDetails.FullName || "",
                                "Tab": "ASCFileUploads",
                                "SignedDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
                                "FileTypeId": 15,
                                "FileName": '',
                                "DisplayName": '',
                                "PatientSurgeryId": ""
                            }

                            $scope.mInstanceAdd = $uibModal.open({
                                "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
                                "backdrop": "static",
                                "scope": $scope,
                                "size": "lg",
                                "resolve": {
                                    "mainObject": function () { return obj; }
                                },
                                "windowClass": "modal__eighty--  ",
                                "keyboard": false,
                                "controller": "DocumentScannerCtrl",
                            });
                            $scope.mInstanceAdd.result.then(function (data) {
                                if (data.Status == "Success") {
                                    /*$scope.PreAuthObj.TempDocuments = data.DocumentDetails || [];*/
                                    data.DocumentDetails = data.DocumentDetails || [];
                                    let obj = {}
                                    if (data.DocumentDetails.length > 0) {
                                         obj = {
                                            "FileId": data.DocumentDetails[0].FileId,
                                            "DocumentID": data.DocumentDetails[0].DocumentID,
                                            "DocumentName": data.DocumentDetails[0].DocumentName,
                                            "DocumentExt": data.DocumentDetails[0].DocumentExt,
                                            "S3URL": data.DocumentDetails[0].S3URL,
                                            "DeleteInd": "N",
                                            "FileTypeId": 15,
                                            "SignedDate": data.DocumentDetails[0].SignedDate,
                                            "DisplayName": data.DocumentDetails[0].DisplayName
                                        }
                                    }
                                    
                                    let IdentifierId = sitem.IdentifierId || 0;
                                    angular.forEach($scope.PreAuthObj.PreAuthDetails, function (item) {
                                        if (IdentifierId === item.IdentifierId) {
                                            let obj1 = {
                                                "UserId": eHnoteMasterDataService.getLoginId(),
                                                "HospitalId": $scope.HospitalId,
                                                "PatientName": $scope.PreAuthObj.PatientName,
                                                "PatientId": item.PatientID,
                                                "AppointmentId": $scope.PreAuthObj.AppointmentId,
                                                "S3Url": obj.S3URL || "",
                                                "S3URL": obj.S3URL || "",
                                                "DocumentExt": obj.DocumentExt || "",
                                                "DocumentID": obj.DocumentID || null,
                                                "DocumentName": obj.DocumentName || "",
                                                "FileTypeId": 15 || "",
                                                "DeleteInd": 'N' || "",
                                                "PatientASCPreAuthorizationId": item.PatientASCPreAuthorizationId || "",
                                                "PatientAppointmentInsuranceDetailId": item.PatientAppointmentInsuranceDetailId || ""
                                            }
                                            item.PatientDocumentDetails = item.PatientDocumentDetails || [];
                                            item.PatientDocumentDetails.push(obj1);
                                        }
                                    });
                                }
                            }, function (cancel) {
                            });
                        }
                        $scope.init = function () {
                            $scope.PreAuthObj = GetPreAuthObj();
                            if (AppointmentPreauthDetails.length > 0) {
                                $scope.PreAuthObj.PreAuthDetails = AppointmentPreauthDetails[0].AppointmentPreauthDetails || [];

                                $scope.PreAuthObj.PreAuthNotesList = AppointmentPreauthDetails[0].PreAuthNotesList || [];
                                angular.forEach($scope.PreAuthObj.PreAuthDetails, function (aaitem) {
                                    aaitem.StartDate = aaitem.StartDate || null;
                                    aaitem.EndDate = aaitem.EndDate || null;
                                    if (aaitem.StartDate != null) {
                                        aaitem.StartDate = $filter('date')(aaitem.StartDate, "MM-dd-yyyy");
                                    }
                                    if (aaitem.EndDate != null) {

                                        aaitem.EndDate = $filter('date')(aaitem.EndDate, "MM-dd-yyyy");
                                    }
                                });
                            }
                            else {
                                PatientInsuranceList = PatientInsuranceList || [];
                                $scope.PreAuthObj.PreAuthDetails = [];
                                angular.forEach(PatientInsuranceList, function (item) {
                                    let obj = {
                                        "PreAuthorizationNumber": null,
                                        "StartDate": null,
                                        "EndDate": null,
                                        "DeleteInd": 'N',
                                        "PayorId": item.PayorId||0,
                                        "OrganizationPayorId": item.MasterPayorId||0,
                                        "StatusId": null,
                                        "PatientAppointmentInsuranceDetailId": item.PatientAppointmentInsuranceDetailId || 0,
                                        "IdentifierId": item.IdentifierId || null,
                                        "PatientInsuranceDetailId": item.PatientInsuranceDetailId || 0,
                                        "PatientDocumentDetails": [],
                                        "GroupId": item.GroupId || null,
                                        "PolicyId": item.PolicyId || null,
                                        "PayorName": item.PayorName || null,
                                        "IdentifierName": item.IdentifierName || null,
                                        "PlanName": item.PlanName || null

                                    }
                                    $scope.PreAuthObj.PreAuthDetails.push(obj);
                                });

                            }
                            if (PatientDetails.length > 0) {
                                $scope.PreAuthObj.Patient = PatientDetails[0] || {};
                                $scope.PreAuthObj.Patient.MobileNo = $scope.PreAuthObj.Patient.MobileNo || '';
                                if ($scope.PreAuthObj.Patient.MobileNo != '') {
                                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PreAuthObj.Patient.MobileNo);
                                    $scope.PreAuthObj.Patient.MobileNo = obj.UsFormatMobileNumber;
                                }
                            }
                            $scope.PreAuthObj.PreAuthLogs =  PreAuthLogs || [];


                           
                            //if ($scope.AppointmentList.length > 0) {
                            //    var filterArray = $filter('filter')($scope.AppointmentList, { 'AppointmentID': item.AppointmentID }, true) || [];
                            //    if (filterArray.length > 0) {


                            //        let sitem = filterArray[0] || {};


                            //        //$scope.PreAuthObj.PreAuthDetails = filterArray[0].PreAuthDetails || [];

                            //        $scope.PreAuthObj.StatusId = sitem.PreAuthDetails.StatusId;
                            //        $scope.PreAuthObj.PatientDocumentDetails = sitem.PreAuthDetails.PatientDocumentDetails;
                            //        if (sitem.PreAuthDetails.StartDate != '') {
                            //            $scope.PreAuthObj.StartDate = $filter('date')(new Date(sitem.PreAuthDetails.StartDate), "MM-dd-yyyy");
                            //        }
                            //        if (sitem.PreAuthDetails.EndDate != '') {
                            //            $scope.PreAuthObj.EndDate = $filter('date')(new Date(sitem.PreAuthDetails.EndDate), "MM-dd-yyyy");
                            //        }
                            //        //$scope.PreAuthObj.Notes = sitem.PreAuthDetails.Notes;
                            //        $scope.PreAuthObj.PreAuthorizationNumber = sitem.PreAuthDetails.PreAuthorizationNumber;
                            //        $scope.PreAuthObj.PatientASCPreAuthorizationId = sitem.PreAuthDetails.PatientASCPreAuthorizationId;
                            //        $scope.PreAuthObj.AppointmentNotes = $scope.AppointmentList.length > 0 ? sitem.AppointmentNotes : [];
                            //        $scope.PreAuthObj.PreAuthLogs = $scope.AppointmentList.length > 0 ? sitem.PreAuthLogs : [];

                            //        sitem = sitem || '';
                            //        if (sitem != '') {
                            //            sitem.PatientInsuranceList = sitem.PatientInsuranceList || [];
                            //            if (sitem.PatientInsuranceList.length > 0) {
                            //                $scope.PreAuthObj.PatientInsuranceList = sitem.PatientInsuranceList || [];

                            //            }
                            //            sitem.Patient = sitem.Patient || '';
                            //            if (sitem.Patient != '') {
                            //                $scope.PreAuthObj.Patient = sitem.Patient || {};
                            //                $scope.PreAuthObj.Patient.MobileNo = $scope.PreAuthObj.Patient.MobileNo || '';
                            //                if ($scope.PreAuthObj.Patient.MobileNo != '') {
                            //                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PreAuthObj.Patient.MobileNo);
                            //                    $scope.PreAuthObj.Patient.MobileNo = obj.UsFormatMobileNumber;
                            //                }
                            //            }
                            //            sitem.PreAuthDetails.PreAuthNotesList = sitem.PreAuthDetails.PreAuthNotesList || [];
                            //            if (sitem.PreAuthDetails.PreAuthNotesList.length > 0) {

                            //                $scope.PreAuthObj.PreAuthNotesList = sitem.PreAuthDetails.PreAuthNotesList || [];
                            //            }
                            //        }
                            //    }
                            //}
                        }
                        $scope.init();



                        $scope.PreAuthFileUpload = function (file, id) {
                            if (file == undefined || file == null || file == "") {
                                return false;
                            } else {
                                $scope.PreAuthFileUploadService(file, id);
                            }
                        }
                       
                    }
                });

                $scope.mInstanceAdd.result.then(function () {
                    $scope.GetPreAuthAppointmentsList();

                }, function () {

                });

            }

        }, function (err) {

        });
        
    };

    $scope.GetPreAuthAppointmentsList = function () {
        var HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.GetAllIndicator = 1;
        if ($scope.surgeryListGetObj.HospitalObj.ClinicId !== 0 && $scope.surgeryListGetObj.HospitalObj.ClinicId !== undefined) {
            HospitalID = $scope.surgeryListGetObj.HospitalObj.ClinicId;
            $scope.GetAllIndicator = 0;
        }
        if ($scope.surgeryListGetObj.DOB != "") {
            let DOB = '';
            DOB = $scope.surgeryListGetObj.DOB + " 00:00:00";
        //    $scope.surgeryListGetObj.DOB = $filter('date')(new Date(DOB), "yyyy-MM-dd");
            var parsedDate = new Date(DOB);
            /* $scope.surgeryListGetObj.DOB = $filter('date')(new Date(DOB), "yyyy-MM-dd");*/
            if (!isNaN(parsedDate.getTime())) {
                $scope.surgeryListGetObj.DOB = $filter('date')(parsedDate, "yyyy-MM-dd");
            } else {
                // Log an error or handle the invalid date case
                alertify.error("Invalid date format:", DOB);
                // Return false or handle the error in another way
                DOB = "";
                return false;
            }
        }
        //var DoctorId = doctorInfo.doctorid;
        //var DoctorId = 0;
        //if ($scope.surgeryListGetObj.DoctorObj.DoctorID !== 0 && $scope.surgeryListGetObj.DoctorObj.DoctorID !== undefined) {
        //    DoctorId = $scope.surgeryListGetObj.DoctorObj.DoctorID;
        //}

        let newlist1 = "";
        for (var i in $scope.BranchDoctorsList) {
            if ($scope.BranchDoctorsList[i].isChecked) {
                newlist1 += "," + $scope.BranchDoctorsList[i].DoctorID;
            }
        }
        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }
        let newlist2 = "";
        for (var i in $scope.GetStatusList) {
            if ($scope.GetStatusList[i].isChecked) {
                newlist2 += "," + $scope.GetStatusList[i].Id;
            }
        }
        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }
        if ($scope.AllDoctorsObj.AllAuthstatusCheck==true) {
            newlist2 += "," + '0';
        }
        var CounselorId = 0;
        if ($scope.surgeryListGetObj.CounselorObj) {
            CounselorId = $scope.surgeryListGetObj.CounselorObj.DoctorID;
        }
        var StartDate = $filter("date")(new Date($scope.surgeryListGetObj.FromDate), "yyyy-MM-dd");
        var EndDate = $filter("date")(new Date($scope.surgeryListGetObj.ToDate), "yyyy-MM-dd");
        var CounselorstatusId = parseInt($scope.surgeryListGetObj.CounselorStatusId);

        var checkedArrayList = [];
        if ($scope.BranchDoctorsList.length > 0) {
            checkedArrayList = _.where($scope.BranchDoctorsList, { isChecked: true });
        }

        var checkAscpreauthlist = [];
        if ($scope.GetStatusList.length > 0) {
            checkAscpreauthlist = _.where($scope.GetStatusList, { isChecked: true });
        }

        
        var cacheobj = {
            "SelectedDoctorsList": checkedArrayList || [],
            "OPFromDate": $scope.surgeryListGetObj.FromDate || "",
            "AscPreauthStatusList": checkAscpreauthlist || [],
        };
        eHnoteMasterDataService.addSelectedAscPreauth(cacheobj);

        if (newlist1 == '') {
            alertify.error('Please select atleast one Doctor');
            return false;
        }
        if (newlist2=='') {
            alertify.error('Please select atleast one PreAuth Status');
            return false;
        }


        var params = {
            "HospitalID": HospitalID,
            "DoctorIds": newlist1,
           /* "CounselorId": CounselorId,*/
            "StartDate": StartDate||"",
           /* "EndDate": EndDate||"",*/
            "PageSize": $scope.SurgeryListPageSize,
            "PageNo": $scope.SurgeryListPageNo,
            "GetAllIndicator": $scope.GetAllIndicator,
            //"SurgeryStatusInd": $scope.SurgeryStatusInd,
            //"CounselorStatusId": CounselorstatusId,
            "SearchText": $scope.surgeryListGetObj.firstname,
            "DOB": $scope.surgeryListGetObj.DOB || null,
            "SearchPatientDisplayId": $scope.surgeryListGetObj.PatientDisplayId,
            "OldPatientMRNO": $scope.surgeryListGetObj.OldPatientDisplayId,
            "PreAuthStatusId": newlist2,
        };
        eHnotePatientDataService.GetPreAuthAppointmentsList(params).then(function (resp) {
            $scope.PreAuthAppointmentsList = resp.data.rows;
            $scope.PreAuthAppointmentsListCount = resp.data.Count;
          
            if ($scope.PreAuthAppointmentsList.length > 0) {
                $scope.NavObj.IsApptSelectedInfoInd = true; 

                angular.forEach($scope.PreAuthAppointmentsList, function (item) {
                    var datetime = item.ConsultationDt + "T" + item.StartTime;
                    item.ConvertDateStartTime = $filter('date')(datetime, "hh:mm a");
                    item.ConsultationDate = angular.copy($filter('date')(new Date(item.ConsultationDt), "MM-dd-yyyy"));
                    item.PreauthDetails = item.PreauthDetails || [];
                    item.PreauthStatudId = item.PreauthStatudId || 0;
                    item.PatientInsuranceList = item.PatientInsuranceList || [];
                    if (item.PreauthDetails.length > 0) {
                        angular.forEach($scope.PreAuthAppointmentsList, function (Pritem) {
                            if (Pritem.IdentifierId == 1) {
                                item.PreauthStatudId = Pritem.StatusId || 0;
                            }
                            Pritem.EndDate = Pritem.EndDate || null;
                            Pritem.StartDate != Pritem.StartDate || null;

                            if (Pritem.EndDate != null) {
                                Pritem.PreAuthDetails.EndDate = moment(Pritem.EndDate, "YYYY-MM-DD HH:mm:ss").format("MM-DD-YYYY");
                            }

                            if (Pritem.StartDate != null) {
                                Pritem.StartDate = moment(Pritem.StartDate, "YYYY-MM-DD HH:mm:ss").format("MM-DD-YYYY");
                            }

                        });
                    }

                    var obj = eHnoteUserDataService.UsMobileFormatChange(item.Patient.MobileNo);
                    (item.USMobileNo) = obj.UsFormatMobileNumber;
                });
                //var statusList = newlist2.split(',');
                //$scope.PreAuthAppointmentsList = $scope.PreAuthAppointmentsList.filter(function (item) {
                //    if (statusList.length > 0) {
                //        return statusList.includes(item.PreauthStatudId.toString());
                //    }
                //    return true; // If statusList is empty, do not filter out any items
                //});
            }

        }, function (err) {
            console.log(err);
        });
    };

    var BrachesList = [];

    function InitializeNewBranches(data) {

        BrachesList = [];

        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.OTListAllBranchesSurgeries, data, doctorinfo) || [];
        var EmptyClinicObj = {
            "ClinicName": "All Locations",
            "ClinicId": 0,
            "BranchName": "All Locations",
            "BranchId": 0,
            "SubOrganizationId": 0,
            "Address1": "",
            "Address2": "",
            "Location": "",
            "StateId": "",
            "PinCode": "",
            "CountryId": "",
            "CityId": "",
            "DistrictRegion": "",
            "Latitude": "",
            "Longitude": "",
            "BranchEmail": "",
            "CountryCode": "",
            "mobilenum": "",
            "Active": "Y",
            "Doctors": [],
            "CommunicationCountryCode": "",
            "CommunicationMobileNo": ""
        };
        clinicAddress.unshift(EmptyClinicObj);
        BrachesList = clinicAddress;
        $scope.BranchesListArray = clinicAddress;

        $scope.defaultbranch = $filter("filter")($scope.BranchesListArray, function (item) {
            return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
        });

        $scope.selectedBranch = $scope.defaultbranch[0];
        if ($scope.selectedBranch !== undefined) {
            GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);
        }
    }
    function GetBranchSubSpecializations(SubOrganizationId, BranchId) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                console.log($scope.allSubSpecializationsArray);
                getDoctorsbySubSpecializations(BranchId);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.BranchDoctorsList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Users are been added");
            }
        });
    };

    function getDoctorsbySubSpecializations(branchId) {

        console.log(branchId);
        var branchesList = [];

        $scope.clinicDoctorList = [];
        $scope.allUserList = [];
        $scope.selectedDoctor = "";
        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")(BrachesList, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {
            var TempAppListdoctoraddress = $filter("filter")(BrachesList, function (iterator, ind) { return iterator.ClinicId === branchId; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        }

        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": hospitalID,
            "SubSpecializationIdArray": subSplArray
        }

        console.log(JSON.stringify(reqObj));
        //return false;
        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            console.log(resp);
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;
                var RoleID = userLoginDetails.RoleID;

                if ($scope.BranchCall === "OnChange") {
                    $scope.ReloadDoctors($scope.allUserList);
                } else {
                    if ($scope.RoleId === 1 || $scope.RoleId === 56) {
                        InitialiseNewBranchCosunelors($scope.allUserList);
                    } else {
                        InitialiseNewBranchDoctor($scope.allUserList);
                    }
                }

                $scope.GetPreAuthAppointmentsList();

            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.mainBookedAppointmentList = [];
            }
        }

        function onGetUsersFailure(data) {
        }
    }

    $scope.ReloadDoctors = function (doctorslist) {

        var docAll = {};
        $scope.AllBranchDoctorlist = angular.copy(doctorslist);
        $scope.BranchDoctorsList = $filter("filter")($scope.AllBranchDoctorlist, function (item) {
            return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 16 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
        });
        $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) {
            return p.DoctorID;
        });
      
        //if ($scope.BranchDoctorsList.length > 0) {
        //    if ($scope.RoleId !== 1 && $scope.RoleId !== 56) {
        //        docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
        //        $scope.BranchDoctorsList.unshift(angular.copy(docAll));
        //    }

        //} else {
        //    if ($scope.RoleId !== 1 && $scope.RoleId !== 56) {
        //        docAll = { "DoctorID": 0, "FullName": "No Docotors", "AddressID": 0, "MinPerCase": 15 };
        //        $scope.BranchDoctorsList.push(angular.copy(docAll));
        //    }

        //}
        if ($scope.RoleId !== 1 && $scope.RoleId !== 56) {
            $scope.surgeryListGetObj.DoctorObj = $scope.BranchDoctorsList[0];
        }

    };
    function InitialiseNewBranchDoctor(data) {
        $scope.AllUserBranchesList = [];
        $scope.AllUserBranchesList = BrachesList;
        console.log($scope.AllUserBranchesList);
        $scope.BranchDoctorsList = angular.copy(data);
        $scope.AllCounselorsList = angular.copy(data);
        $scope.AllDoctorAnesthesiologist = angular.copy(data);
        $scope.AllDoctorAssistant = angular.copy(data);

        $scope.clinicOptometristsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
            return item.RoleId === 10;
        });
        $scope.clinicOptometristsList = _.uniq($scope.clinicOptometristsList, false, function (p) {
            return p.DoctorID;
        });
        $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
            return item.RoleId === 1 || item.RoleId === 43;
        });

        $scope.AllCounselorsList = $filter("filter")($scope.AllCounselorsList, function (item) {
            return item.RoleId === 18;
        });
        var couAll = { "DoctorID": 0, "FullName": "All Counselors", "AddressID": 0, "MinPerCase": 15 };
        $scope.AllCounselorsList.unshift(couAll);

        $scope.AllDoctorAnesthesiologist = $filter("filter")($scope.AllDoctorAnesthesiologist, function (item) {
            return item.RoleId === 30;
        });
        $scope.AllDoctorAssistant = $filter("filter")($scope.AllDoctorAssistant, function (item) {
            return item.RoleId === 29;
        });


        if (userLoginDetails.RoleID !== 1 && userLoginDetails.RoleID !== 56) {
            //var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
            //$scope.BranchDoctorsList.unshift(docAll);

            var opthoall = { "DoctorID": 0, "FullName": "All Optometrists", "AddressID": 0, "MinPerCase": 15 };
            $scope.clinicOptometristsList.unshift(opthoall);
        }

        //if (docAll != undefined) {
        //    $scope.BranchDoctorsList.unshift(docAll);
        //}

        var currentClinic = doctorinfo.doctordata.UserAddress[0];
        if ($scope.AllUserBranchesList.length > 0) {
            angular.forEach($scope.AllUserBranchesList, function (value, key) {
                if ($scope.BranchDoctorsList.length > 0) {
                    $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) {
                        return p.DoctorID;
                    });

                }
            });
        }
        if ($scope.BranchDoctorsList.length > 0) {
            angular.forEach($scope.BranchDoctorsList, function (item) {
                item.isChecked = true;
            });
            var checkedArray = _.where($scope.BranchDoctorsList, { isChecked: true });
            $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.BranchDoctorsList.length === checkedArray.length ? true : false;
        }
        if ($scope.GetStatusList.length > 0) {
            angular.forEach($scope.GetStatusList, function (item) {
                item.isChecked = true;
            });
            var checkedArray1 = _.where($scope.GetStatusList, { isChecked: true });
            $scope.AllDoctorsObj.AllAuthstatusCheck = checkedArray1.length > 0 && $scope.GetStatusList.length === checkedArray1.length ? true : false;

        }
        var checkedArray = _.where($scope.BranchDoctorsList, { isChecked: true });
        $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.BranchDoctorsList.length === checkedArray.length ? true : false;

        $scope.defaultbranch = $filter("filter")(BrachesList, function (item) { return item.ClinicId === doctorinfo.doctordata.UserAddress[0].ClinicId; });
        $scope.surgeryListGetObj.HospitalObj = $scope.defaultbranch[0];

        $rootScope.IsSurgeryCostRestricted = $scope.defaultbranch[0].IsSurgeryCostRestricted ? $scope.defaultbranch[0].IsSurgeryCostRestricted : false;
        var DocArray = [];
        DocArray = $filter("filter")($scope.BranchDoctorsList, function (item) { return item.DoctorID === eHnoteMasterDataService.getLoginId(); });
        if (DocArray.length > 0) {
            $scope.surgeryListGetObj.DoctorObj = DocArray[0];
        } else {
            $scope.surgeryListGetObj.DoctorObj = $scope.BranchDoctorsList[0];
        }

        var CounselerArray = [];
        CounselerArray = $filter("filter")($scope.AllCounselorsList, function (item) { return item.DoctorID === eHnoteMasterDataService.getLoginId(); });
        if (CounselerArray.length > 0) {
            $scope.surgeryListGetObj.CounselorObj = CounselerArray[0];
        } else {
            $scope.surgeryListGetObj.CounselorObj = $scope.AllCounselorsList[0];
        }
        $scope.selectedAscPreauthList = eHnoteMasterDataService.getSelectedAscPreauth() || '';
        if ($scope.selectedAscPreauthList !='') {
            $scope.selectedAscPreauthList.OPFromDate = $scope.selectedAscPreauthList.OPFromDate || '';
            if ($scope.selectedAscPreauthList.OPFromDate!='') {
                $scope.surgeryListGetObj.FromDate= $scope.selectedAscPreauthList.OPFromDate;
            }
            $scope.selectedAscPreauthList.SelectedDoctorsList = $scope.selectedAscPreauthList.SelectedDoctorsList || [];
            if ($scope.selectedAscPreauthList.SelectedDoctorsList.length > 0) {
                angular.forEach($scope.BranchDoctorsList, function (Mitem) {
                    Mitem.isChecked = false;
                });
                angular.forEach($scope.selectedAscPreauthList.SelectedDoctorsList, function (Selecteditem) {
                    angular.forEach($scope.BranchDoctorsList, function (Mainitem) {
                        if (Selecteditem.DoctorID == Mainitem.DoctorID) {
                            Mainitem.isChecked = true;
                        }
                    });
                });
                var checkedArray = _.where($scope.BranchDoctorsList, { isChecked: true });
                $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.BranchDoctorsList.length === checkedArray.length ? true : false;
                if ($scope.AllDoctorsObj.AllDoctorCheck) {
                    $scope.selectedDoctors = 'All Doctors';
                }  
                if (!$scope.AllDoctorsObj.AllDoctorCheck && checkedArray.length == 0) {
                    $scope.selectedDoctors = 'Select Doctor';
                }
                if (!$scope.AllDoctorsObj.AllDoctorCheck && checkedArray.length > 0) {
                    $scope.selectedDoctors = 'Selected Doctor';
                }


            }
           
            $scope.selectedAscPreauthList.AscPreauthStatusList = $scope.selectedAscPreauthList.AscPreauthStatusList || [];
            if ($scope.selectedAscPreauthList.AscPreauthStatusList.length > 0) {
                angular.forEach($scope.GetStatusList, function (Mitem) {
                    Mitem.isChecked = false; 
                });
                angular.forEach($scope.selectedAscPreauthList.AscPreauthStatusList, function (Selecteditem) {
                    angular.forEach($scope.GetStatusList, function (Mainitem) {
                        if (Selecteditem.Id == Mainitem.Id) {
                            Mainitem.isChecked = true;
                        }
                    });
                });
                var checkedArray1 = _.where($scope.GetStatusList, { isChecked: true });
                $scope.AllDoctorsObj.AllAuthstatusCheck = checkedArray1.length > 0 && $scope.GetStatusList.length === checkedArray1.length ? true : false;
                if ($scope.AllDoctorsObj.AllAuthstatusCheck) {
                    $scope.selectedSuthStatus = 'All Status';
                }
                if (!$scope.AllDoctorsObj.AllAuthstatusCheck && checkedArray1.length == 0) {
                    $scope.selectedSuthStatus = 'Select Status';
                }
                if (!$scope.AllDoctorsObj.AllAuthstatusCheck && checkedArray1.length > 0) {
                    $scope.selectedSuthStatus = 'Selected Status';
                }


            }

        }
    }

    function InitialiseNewBranchCosunelors(data) {

        $scope.AllUserBranchesList = BrachesList || [];

        $scope.BranchDoctorsList = [];
        var countryCode = "";
        if (doctorinfo.doctordata.UserPhone !== undefined) {
            countryCode = doctorinfo.doctordata.UserPhone[0].PhCntryCD;
        }
        var clinicObj = {
            "FullName": doctorinfo.doctordata.User[0].FullName,
            "DoctorID": doctorinfo.doctordata.User[0].DoctorID,
            "EmailId": doctorinfo.doctordata.UserEmail[0].EmailID,
            "MobileNo": doctorinfo.doctordata.UserAddress[0].MobileNo,
            "CountryCode": countryCode,
            "Gender": doctorinfo.doctordata.User[0].Gender,
            "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
            "Active": "Y",
            "SpecializationId": doctorinfo.doctordata.User[0].SpecializationId,
            "MinPerCase": doctorinfo.doctordata.UserAddress[0].ExtDetails.MinPerCase,
            "RoleId": doctorinfo.doctordata.UserAddress[0].ExtDetails.RoleID,
            "ClinicName": doctorinfo.doctordata.UserAddress[0].ClinicName,
            "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail,
        };
        $scope.BranchDoctorsList.push(clinicObj);
      
        $scope.branchesforDoctors = [];
        for (var i = 0; i < BrachesList.length; i++) {
            $scope.branchesforDoctors.push(BrachesList[i]);
        }
        if ($scope.branchesforDoctors.length === 0) {
            $scope.branchesforDoctors = BrachesList;
        }
        $scope.AllCounselorsList = [];

        $scope.AllCounselorsList = angular.copy(data);

        $scope.AllCounselorsList = $filter("filter")($scope.AllCounselorsList, function (item) {
            return item.RoleId === 18;
        });
        var couAll = { "DoctorID": 0, "FullName": "All Counselors", "AddressID": 0, "MinPerCase": 15 };
        $scope.AllCounselorsList.unshift(couAll);

        $scope.defaultbranch = $filter("filter")(BrachesList, function (item) { return item.ClinicId === doctorinfo.doctordata.UserAddress[0].ClinicId; });
        $scope.surgeryListGetObj.HospitalObj = $scope.defaultbranch[0];

        $scope.surgeryListGetObj.DoctorObj = $scope.BranchDoctorsList[0];
        $scope.surgeryListGetObj.CounselorObj = $scope.AllCounselorsList[0];

    }

    $scope.SearchSurgeryList = function () {
       
        $scope.IsPatientSelected = true;
        $scope.showpatientDetails = true;
        if ($scope.RoleId == 4 || $scope.RoleId == 43 || $scope.RoleId == 1 || $scope.RoleId == 56 || $scope.RoleId == 57) {
            $scope.SurgeryStatusInd = 9;
        } else if ($scope.RoleId === 2 || $scope.RoleId === 58) {
            $scope.SurgeryStatusInd = 9;
        } else if ($scope.RoleId === 18) {
            $scope.SurgeryStatusInd = 1;
        }
        $scope.SurgeryListPageNo = 1;
        $scope.PreAuthAppointmentArray = [];
        $scope.GetPreAuthAppointmentsList();
    };

    $scope.init = function () {
        $scope.PreAuthAppointmentsList = [];
        $scope.PreAuthAppointmentsListCount = [];

        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeNewBranches(NewBranchList);
    };
    $scope.init();
    $scope.ChangeDoctor = function (doctorobj) {
        $scope.surgeryListGetObj.DoctorObj= doctorobj;
    };

    $scope.ChangeCounsel = function (counselobj) {
        $scope.surgeryListGetObj.CounselorObj = counselobj;
    };

    $scope.ChangeSearch = function () {
        $scope.surgeryListGetObj.PatientDisplayId = "";
        $scope.surgeryListGetObj.firstname = "";
        $scope.surgeryListGetObj.DOB = "";
    }

    $scope.PreAuthAppointmentArray = [];
    $scope.changePatientApptSearchText = function (text, type) {
      

        $scope.NavObj.IsApptSelectedInfoInd = false; 
        $timeout(function () {
            if (type == 1) {
                if (text === "" || text === undefined) {
                    $scope.filteredAppointmentArray = angular.copy($scope.BookedAppointmentList);
                } else {
                   // $scope.PreAuthAppointmentArray = $filter("filter")($scope.PreAuthAppointmentsList, { "Patient.PatientDisplayId": text }) || [];


                   $scope.PreAuthAppointmentArray = $filter("filter")($scope.PreAuthAppointmentsList, { "Patient": { "PatientDisplayId": text } }) || [];

                }
            }
            if (type == 2) {
                if (text === "" || text === undefined) {
                    $scope.PreAuthAppointmentArray = angular.copy($scope.PreAuthAppointmentsList);
                } else {
                    //$scope.filteredAppointmentArray = $filter("filter")($scope.PreAuthAppointmentsList, { "Patient.FullName": text }) || [];

                    $scope.PreAuthAppointmentArray = $filter("filter")($scope.PreAuthAppointmentsList, { "Patient": { "FullName": text } }) || [];                  
                  
                }
            }
           
            if (type == 4) {
                text = text + " 00:00:00";
                /*  text = $filter('date')(new Date(text), "yyyy-MM-dd");*/
                var parsedDate = new Date(text);
                if (!isNaN(parsedDate.getTime())) {
                    text = $filter('date')(parsedDate, "yyyy-MM-dd");
                } else {
                    // Log an error or handle the invalid date case
                    alertify.error("Invalid date format:", text);
                    // Return false or handle the error in another way
                    text = "";
                    return false;
                }
                if (text === "" || text === undefined) {
                    $scope.PreAuthAppointmentArray = angular.copy($scope.PreAuthAppointmentsList);
                } else {
                    $scope.PreAuthAppointmentArray = $filter("filter")($scope.PreAuthAppointmentsList, function (event) {
                    
                        if (event.Patient && event.Patient.DOB) {
                            return event.Patient.DOB === text;
                        }
                    }) || [];
                }
            }
        }, 50);
    };

    $scope.clearpatientData = function () {
        $scope.surgeryListGetObj.PatientDisplayId = "";
        $scope.surgeryListGetObj.firstname = "";
     
        $scope.PreAuthAppointmentArray = angular.copy($scope.PreAuthAppointmentsList);
    };



    // New Design code 
    $scope.AllDoctorsObj = {
        "AllDoctorCheck": false,
        "AllAuthstatusCheck":false
    }
    $scope.selectedDoctors = "Selected";
    $scope.selectedSuthStatus = "Selected";

    $scope.DoctorToggle = function (item) {
        var checkedArray = _.where($scope.BranchDoctorsList, { isChecked: true });
        $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.BranchDoctorsList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedDoctors = "Select Doctor";
        } else {
            if (checkedArray.length === 1) {
                $scope.selectedDoctors = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.selectedDoctors = "Selected Doctors";
            }
        }
    };
    
    $scope.checkAllDoctor = function (val) {
        if (val) {
            angular.forEach($scope.BranchDoctorsList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedDoctors = 'All';
        } else {
            angular.forEach($scope.BranchDoctorsList, function (item) {
                item.isChecked = false;
            });

            $scope.selectedDoctors = 'Select Doctors';
        }
        var checkedArray = _.where($scope.BranchDoctorsList, { isChecked: true });
        $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.BranchDoctorsList.length === checkedArray.length ? true : false;
    };
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }

    $scope.openPreauthInfoPopup = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "preauthorizationpopup.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "appointment-full-popup",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };

    $scope.ClearPreauthscreen = function () {
        $scope.surgeryListGetObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.BranchDoctorsList.forEach(item => item.isChecked = true);
        $scope.GetStatusList.forEach(item => item.isChecked = true);
        $scope.AllDoctorsObj.AllDoctorCheck = true;
        $scope.surgeryListGetObj.PreAuthStatusId = "";
        $scope.selectedDoctors = 'All Doctors';
        $scope.selectedSuthStatus = 'All Status';
        $scope.SearchSurgeryList();
    }
    // multi checkbox dropdown
    $scope.PreauthStatusToggle = function (item) {
        var checkedArray = _.where($scope.GetStatusList, { isChecked: true });
        $scope.AllDoctorsObj.AllAuthstatusCheck = checkedArray.length > 0 && $scope.GetStatusList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedSuthStatus = "Select Status";
        } else {
            if (checkedArray.length === 1) {
                $scope.selectedSuthStatus = checkedArray[0].Name;
            } else {
                $scope.selectedSuthStatus = "Selected Status";
            }
        }
    };
    $scope.checkAllPreAuthStatus = function (val) {
        if (val) {
            angular.forEach($scope.GetStatusList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedSuthStatus = 'All Status';
        } else {
            angular.forEach($scope.GetStatusList, function (item) {
                item.isChecked = false;
            });

            $scope.selectedSuthStatus = 'Select Status';
        }
        var checkedArray = _.where($scope.GetStatusList, { isChecked: true });
        $scope.AllDoctorsObj.AllAuthstatusCheck = checkedArray.length > 0 && $scope.GetStatusList.length === checkedArray.length ? true : false;

    };

    $scope.AddPatietnDetailsLog = function (selectedItem) {
        let obj = {
            "UserHistoryId": 0,
            "UserId": $scope.UserId || null,
            "PatientId": selectedItem.PatientId || 0,
        };
        eHnoteMainAppointmentService.AddPatientDetailsLog(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                console.log("Added");
            }
        });
    }


    $scope.NavToPatientProfile = function (item) {
        let pitem = {
            "PatientDetails": {}  
        };
        pitem.PatientDetails.PatientID = item.PatientID;
        if (!$scope.cacheStorageItem) {
            $scope.cacheStorageItem = {};
        }

        let object = {
            "PatientId": item.PatientID,
        }
        $scope.AddPatietnDetailsLog(object);


        $scope.cacheStorageItem.PatientID = item.PatientID;
        $scope.cacheStorageItem.AppointmentId = item.AppointmentID;
        $scope.cacheStorageItem.IsfromScreen = 'preauth';
        $scope.AddToCache();
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        let screen = 'ASC'
        var obj = {
            "Screen": screen,
        };
        eHnoteMasterDataService.addSelectedCrmApptDates(obj);
        appointmentinfo.PatientID = item.PatientID;
        eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
        eHnoteMasterDataService.addPatientDetailsforBarcode(pitem);
        /*$location.url("/AscModule");*/
        $location.url("/profile");
    }
}]);
"use strict";
eHnoteWebApp.controller("DocumentScannerCtrl", ["$scope", "$rootScope", "$filter", "eHnoteMainAppointmentService", "eHnoteMasterDataService", "eHnoteCacheStorageService", "$window", "alertify", "$timeout", "$uibModal", "datapersistanceFactory", "eHnoteSettingsDataService", "mainObject", "$uibModalInstance", "eHnotePatientDataService","eHnotePatientVisitReasonServices",
    function ($scope, $rootScope, $filter, eHnoteMainAppointmentService, eHnoteMasterDataService, eHnoteCacheStorageService, $window, alertify, $timeout, $uibModal, datapersistanceFactory, eHnoteSettingsDataService, mainObject, $uibModalInstance, eHnotePatientDataService, eHnotePatientVisitReasonServices) {

        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();

        $scope.IsDisabled = false;
        console.log(JSON.stringify(mainObject));
        console.log(appointmentinfo);
        $scope.AppId = appointmentinfo.AppointmentID;
        var doctorinfo = eHnoteMasterDataService.getUserInfo();

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.UserId = eHnoteMasterDataService.getLoginId();

        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;

        $scope.IsMultipleFilesUpload = false;
        $scope.IsScanUploadStarted = false;
        $scope.mainObject = mainObject || '';
        var DWObject = null;  
        var blankField = "";
        var extrFieldsCount = 0;
        var upload_returnSth = true;
        $scope.$on('$destroy', function () {
            if (DWObject) {  
                DWObject.RemoveAllImages();
                DWObject = null;
            }
            if (Dynamsoft && Dynamsoft.DWT) {
                Dynamsoft.DWT.DeleteDWTObject('dwtcontrolContainer');
            }
        });

        if (mainObject.Tab === "Insurance") {
            $scope.IsMultipleFilesUpload = false;
        } else {
            $scope.IsMultipleFilesUpload = true;
        }
        $scope.closeuib = function () {
            if ($scope.Splitobj.IsscanFileSplitSave) {
                $uibModalInstance.close();
            } else {
                $uibModalInstance.dismiss("cancel");
            }
        };
        $scope.IsSplitScannedDocument = false;
        $scope.savecompleteSignature = function (type) {
            if (type == "Split") {
                $scope.IsSplitScannedDocument = true;

                $scope.SelectedFile = $scope.mainObject.FileTypeId;
                $scope.splitRemarks = $scope.mainObject.Remarks;
                
            }
            $scope.UploadImage();
        }


        function getnewPatientSignedObj() {
            var obj = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientConsentDocumentId": 0,
                "PatientId": mainObject.PatientId,
                "PatientName": mainObject.PatientName,
                "AppointmentId": mainObject.AppointmentId,
                "ConsentFormId": 0,
                "Base64": "",
                "S3URL": "",
                "DocumentExt": "",
                "DocumentName": "",
                "IsPatientSignatureDone": false,
                "IsStaffSignatureDone": false,
                "StaffUserId": 0,
                "StaffUserName": "",
                "IsProviderSignatureDone": false,
                "ProviderUserId": 0,
                "ProviderUserName": "",
                "IsCounselorSignatureDone": false,
                "CounselorUserId": 0,
                "CounselorUserName": "",
                "IsAnesthesistSignatureDone": false,
                "AnesthesistUserId": 0,
                "AnesthesistUserName": "",
                "GaurdianUserId": 0,
                "GaurdianUserName": "",
                "IsGaurdianSignatureDone": false,
                "IsPartiallySaved": false,
                "HTMLContent": "",
                "IsPatientSignRequired": false,
                "IsDoctorSignRequired": false,
                "IsAnesthesistSignRequired": false,
                "IsCounselorSignRequired": false,
                "IsStaffSignRequired": false,
                "IsGuardianSignRequired": false,
                "GaurdianFirstName": "",
                "GaurdianLastName": "",
                "VisitId": mainObject.PatientVisitId
            };
            return obj;
        }

        $scope.AddUpdateSignatueObj = getnewPatientSignedObj();
























        $scope.GetAllUsers = function () {

            eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, doctorinfo.hospitalID).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.row.length > 0) {
                        $scope.allSubSpecializationsArray = resp.data.row;
                        $scope.listSubSplArray = angular.copy(resp.data.row);
                        angular.forEach($scope.allSubSpecializationsArray, function (item) {
                            item.isChecked = true;
                        });
                    }
                    var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                    var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");
                    var reqObj = {
                        "BranchId": doctorinfo.hospitalID,
                        "SubSpecializationIdArray": subSplArray
                    }

                    eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                    function onGetUsersSuccess(resp) {
                        if (resp.rows.length > 0) {
                            $scope.allUserList = resp.rows;
                            if ($scope.allUserList.length !== 0) {
                                $scope.StaffList = [];
                                $scope.ProviderList = [];
                                $scope.CounsellorList = [];
                                $scope.AnesthesistList = [];
                                $scope.GaurdianList = [];
                                $scope.StaffList = angular.copy($scope.allUserList);
                                $scope.ProviderList = angular.copy($scope.allUserList);
                                $scope.CounsellorList = angular.copy($scope.allUserList);
                                $scope.AnesthesistList = angular.copy($scope.allUserList);
                                $scope.GaurdianList = angular.copy($scope.allUserList);


                                $scope.ProviderList = $filter("filter")($scope.ProviderList, function (item) {
                                    return item.RoleId === 1 || item.RoleId === 43;
                                });

                                $scope.CounsellorList = $filter("filter")($scope.CounsellorList, function (item) {
                                    return item.RoleId === 18;
                                });

                                $scope.AnesthesistList = $filter("filter")($scope.AnesthesistList, function (item) {
                                    return item.RoleId === 30;
                                });

                                if ($scope.AddUpdateSignatueObj.AnesthesistUserId !== 0) {
                                    var filterList = $filter("filter")($scope.AnesthesistList, { "DoctorID": $scope.AddUpdateSignatueObj.AnesthesistUserId }, true) || [];
                                    if (filterList.length > 0) {
                                        $scope.AddUpdateSignatueObj.AnesthesistUserObj = filterList[0];
                                    }
                                }
                                if ($scope.AddUpdateSignatueObj.CounselorUserId !== 0) {
                                    var CounsellorfilterList = $filter("filter")($scope.CounsellorList, { "DoctorID": $scope.AddUpdateSignatueObj.CounselorUserId }, true) || [];
                                    if (CounsellorfilterList.length > 0) {
                                        $scope.AddUpdateSignatueObj.CounselorUserObj = CounsellorfilterList[0];
                                    }
                                }
                                if ($scope.AddUpdateSignatueObj.StaffUserId !== 0) {
                                    var StafffilterList = $filter("filter")($scope.StaffList, { "DoctorID": $scope.AddUpdateSignatueObj.StaffUserId }, true) || [];
                                    if (StafffilterList.length > 0) {
                                        $scope.AddUpdateSignatueObj.StaffUserObj = StafffilterList[0];
                                    }
                                }
                                if ($scope.AddUpdateSignatueObj.ProviderUserId !== 0) {
                                    var Providerfilterlist = $filter("filter")($scope.ProviderList, { "DoctorID": $scope.AddUpdateSignatueObj.ProviderUserId }, true) || [];
                                    if (Providerfilterlist.length > 0) {
                                        $scope.AddUpdateSignatueObj.ProviderUserObj = Providerfilterlist[0];
                                    }
                                }
                            }

                        } else {
                            alertify.error("No Users Found in Selected Departments");
                        }
                    }

                    function onGetUsersFailure(data) {
                    }

                }
            });
        };

        $uibModalInstance.rendered.then(function () {


            function Dynamsoft_OnReady() {
                blankField = document.getElementsByClassName('div-fields-item')[0].cloneNode(true);
                DWObject = Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer');


                if (DWObject) {
                    DWObject.Viewer.width = 300;
                    DWObject.Viewer.height = 200;
                    for (var i = 0; i < scriptLanguages.length; i++)
                        document.getElementById("ddlLanguages").options.add(new Option(scriptLanguages[i].desc, i));
                    document.getElementById("ddlLanguages").options.selectedIndex = 2;

                    DWObject.RegisterEvent('OnGetFilePath', ds_load_file_to_upload_directly);

                    if (DWObject.Addon.PDF.IsModuleInstalled()) {
                        /** PDFR already installed */
                    }
                }
            }
            Dynamsoft.DWT.AutoLoad = false;
            
            var DeviceFriendlyName = "TestUserId_" + $scope.UserId;
            if ($window.location.host == "ioj.ehnote.com") {
                DeviceFriendlyName = "IOJProdUserId_" + $scope.UserId;
            } else if ($window.location.host == 'insts.ehnote.com') {
                DeviceFriendlyName = "IOJStageUserId_" + $scope.UserId;
            }
            else if ($window.location.host == 'portal.ehnote.com') {
            DeviceFriendlyName = "EHnoteProdUserId_" + $scope.UserId;
            }
            else if ($window.location.host == 'stage.ehnote.com') {
                DeviceFriendlyName = "EHnoteStageUserId_" + $scope.UserId;
            }
            
            Dynamsoft.DWT.DeviceFriendlyName = DeviceFriendlyName;

            Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used

            Dynamsoft.DWT.RegisterEvent('OnWebTwainError', function (errorCode, errorString) {
                console.error('DWT Error Code:', errorCode);
                console.error('DWT Error String:', errorString);

                if (errorString.indexOf('License') > -1 || errorString.indexOf('license') > -1) {
                    alertify.error("Scanner license limit reached. Please contact your administrator.");
                } else if (errorString.indexOf('Failed to fetch') > -1 || errorString.indexOf('127.0.0.1') > -1) {
                    alertify.error("Scanner service not installed or not running on this machine.");
                } else {
                    alertify.error("Scanner failed to initialize: " + errorString);
                }

                DWObject = null;
                //$uibModalInstance.dismiss('cancel');
            });

            DWObject = null, blankField = "", extrFieldsCount = 0, upload_returnSth = true;
              var  strHTTPServer = location.hostname, strActionPage, strFullActionPagePath, ObjString,
                CurrentPathName = unescape(location.pathname),
                CurrentPath = CurrentPathName.substring(0, CurrentPathName.lastIndexOf("/") + 1);

            var scriptLanguages = [
                { desc: "PHP", val: "php" },
                { desc: "PHP-MySQL", val: "phpMySQL" },
                { desc: "CSharp", val: "csharp" },
                { desc: "CSharp-MSSQL", val: "csMSSQL" },
                { desc: "VB.NET", val: "vbnet" },
                { desc: "VBNET-MSSQL", val: "vbnetMSSQL" },
                { desc: "JSP", val: "jsp" },
                { desc: "JSP-Oracle", val: "jspOracle" },
                { desc: "ASP", val: "asp" },
                { desc: "ASP-MSSQL", val: "aspMSSQL" },
                { desc: "ColdFusion", val: "cfm" },
                { desc: "CS-Azure", val: "csAzure" }
            ];


            $scope.init = function () {
                if (Dynamsoft) {
                    Dynamsoft.DWT.Load();
                }
            }

            $scope.AcquireImage = function () {
                if (DWObject) {
                    DWObject.SelectSourceAsync().then(function () {
                        return DWObject.AcquireImageAsync({
                            IfDisableSourceAfterAcquire: true // Scanner source will be disabled/closed automatically after the scan.
                        });
                    }).then(function () {
                        return DWObject.CloseSourceAsync();
                    }).catch(function (exp) {
                        alert(exp.message);
                    });
                }
            }

            $scope.init();

            $scope.UploadImage = function () {
                if (DWObject) {
                    var nCount = 0, nCountUpLoaded = 0;
                    aryFilePaths = [];
                    UploadImage_inner();
                }
            }

            function UploadImage_inner() {
                if (DWObject.HowManyImagesInBuffer == 0)
                    return;

                var i, aryIndices = [], Digital = new Date(),
                    uploadfilename = Digital.getMilliseconds();
                upload_preparation(uploadfilename);
                // Upload the image(s) to the server asynchronously
                if (document.getElementById("ddlLanguages").options.selectedIndex == 11 /*Azure*/) return;





                if (document.getElementsByName('ImageType')[0].checked) {
                    var count = DWObject.HowManyImagesInBuffer;
                    aryIndices = [];
                    for (i = 0; i < count; i++) aryIndices.push(i);

                    var uploadJPGsOneByOne = function (errorCode, errorString, sHttpResponse) {
                        if (errorCode != 0 && errorCode != -2003) {
                            //alert(errorString);
                            return;
                        }

                        if (upload_returnSth)
                            _printUploadedFiles(sHttpResponse);
                        if (aryIndices.length > 0) {
                            if (upload_returnSth)
                                DWObject.HTTPUpload(strFullActionPagePath, aryIndices.splice(0, 1), Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG, Dynamsoft.DWT.EnumDWT_UploadDataFormat.Binary, uploadfilename + "-" + (count - aryIndices.length) + ".jpg", OnHttpUploadSuccess, uploadJPGsOneByOne);
                            else
                                DWObject.HTTPUpload(strFullActionPagePath, aryIndices.splice(0, 1), Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG, Dynamsoft.DWT.EnumDWT_UploadDataFormat.Binary, uploadfilename + "-" + (count - aryIndices.length) + ".jpg", uploadJPGsOneByOne, OnHttpServerReturnedSomething);
                        }
                    };
                    if (upload_returnSth)
                        DWObject.HTTPUpload(strFullActionPagePath, aryIndices.splice(0, 1), Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG, Dynamsoft.DWT.EnumDWT_UploadDataFormat.Binary, uploadfilename + "-" + (count - aryIndices.length) + ".jpg", OnHttpUploadSuccess, uploadJPGsOneByOne);
                    else
                        DWObject.HTTPUpload(strFullActionPagePath, aryIndices.splice(0, 1), Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG, Dynamsoft.DWT.EnumDWT_UploadDataFormat.Binary, uploadfilename + "-" + (count - aryIndices.length) + ".jpg", uploadJPGsOneByOne, OnHttpServerReturnedSomething);
                }
                else if (document.getElementsByName('ImageType')[1].checked) {
                    aryIndices = [];
                    for (i = 0; i < DWObject.HowManyImagesInBuffer; i++) aryIndices.push(i);
                    DWObject.HTTPUpload(strFullActionPagePath, aryIndices, Dynamsoft.DWT.EnumDWT_ImageType.IT_TIF, Dynamsoft.DWT.EnumDWT_UploadDataFormat.Binary, uploadfilename + ".tif", OnHttpUploadSuccess, OnHttpServerReturnedSomething);
                }
                else if (document.getElementsByName('ImageType')[2].checked) {
                    aryIndices = [];
                    for (i = 0; i < DWObject.HowManyImagesInBuffer; i++) aryIndices.push(i);
                    DWObject.HTTPUpload(strFullActionPagePath, aryIndices, Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF, Dynamsoft.DWT.EnumDWT_UploadDataFormat.Binary, uploadfilename + ".pdf", OnHttpUploadSuccess, OnHttpServerReturnedSomething);
                }
            }

            function upload_preparation(_name) {
                strActionPage = CurrentPath + 'action/';
                preparetoUploadtoAzure(_name);
                DWObject.IfSSL = Dynamsoft.Lib.detect.ssl;
                var _strPort = location.port == "" ? 80 : location.port;
                if (Dynamsoft.Lib.detect.ssl == true) {
                    _strPort = location.port == "" ? 443 : location.port;
                    strFullActionPagePath = "https://" + strHTTPServer + ":" + _strPort + strActionPage;
                } else {
                    strFullActionPagePath = "http://" + strHTTPServer + ":" + _strPort + strActionPage;
                }

                DWObject.HTTPPort = _strPort;
                if ([0, 2, 4, 6].indexOf(document.getElementById("ddlLanguages").selectedIndex) != -1) {
                    /* Add Fields to the Post */
                    var fields = document.getElementsByClassName('div-fields-item');

                    DWObject.ClearAllHTTPFormField();
                    for (var n = 0; n < fields.length; n++) {
                        var o = fields[n];
                        if (o.children[0].value != '')
                            DWObject.SetHTTPFormField(o.children[0].value, o.children[1].value);
                    }
                }
            }

            function preparetoUploadtoAzure(__name) {
                var uploadfilename = '';
                var extention = "png";

                $scope.IsScanUploadStarted = true;

                //For JPEG, upload the current image
                console.log(DWObject.HowManyImagesInBuffer + "__ImagesInBuffer");

                if (DWObject.HowManyImagesInBuffer === 1) {
                    if (document.getElementsByName('ImageType')[0].checked) {
                        console.log("jpg");
                        DWObject.GetSelectedImagesSize(Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG);
                        uploadfilename = __name + '.jpg';
                        extention = "jpg";

                    }
                    else { //For TIFF, PDF, upload all images
                        var nCount = DWObject.HowManyImagesInBuffer;
                        var arySelectIndex = [];
                        for (i = 0; i < nCount; i++) {
                            arySelectIndex.push(i);
                        }
                        DWObject.SelectImages(arySelectIndex);
                        if (document.getElementsByName('ImageType')[1].checked) {
                            console.log("tif");
                            DWObject.GetSelectedImagesSize(Dynamsoft.DWT.EnumDWT_ImageType.IT_TIF);
                            uploadfilename = __name + '.tif';
                            extention = "tif";
                        }
                        else {
                            console.log("pdf");
                            DWObject.GetSelectedImagesSize(Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF);
                            uploadfilename = __name + '.pdf';
                            extention = "pdf";
                        }
                    }
                    //$scope.IsMultipleFilesUpload = false;

                } else if (DWObject.HowManyImagesInBuffer > 1) {

                    console.log("morethan 1 DOc");

                    if (mainObject.Tab === "Insurance") {
                        DWObject.GetSelectedImagesSize(Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG);
                        uploadfilename = __name + '.jpg';
                        extention = "jpg";
                    } else {
                        var nCount = DWObject.HowManyImagesInBuffer;
                        var arySelectIndex = [];
                        for (let i = 0; i < nCount; i++) {
                            arySelectIndex.push(i);
                        }
                        DWObject.SelectImages(arySelectIndex);
                        DWObject.GetSelectedImagesSize(Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF);
                        uploadfilename = __name + '.pdf';
                        extention = "pdf";
                    }

                    //Commented By Durga for multiple image uploads service urls generation

                    // $scope.IsMultipleFilesUpload = true;
                }


                var strImg, aryImg, _uint8_STR, _bin_ARR, _blobImg;
                strImg = DWObject.SaveSelectedImagesToBase64Binary();
                console.log(strImg);

                if (mainObject.Tab === "FileUploads") {
                    if ($scope.IsSplitScannedDocument) {

                        $scope.StringImageToPDF(strImg, DWObject.HowManyImagesInBuffer);

                    } else {
                        continuetoAddPatientConsultationScannedImage(strImg, extention);
                       
                    }
                }
                else if (mainObject.Tab === "ASCFileUploads") {
                    continuetoAddASCPatientScannedImage(strImg, extention)
                } else if (mainObject.Tab === "ConsentDocuments") {
                    continuetoaddPatientConsentSignedDocument(strImg, extention)
                }
                else {
                    continuetoAddPatientInsuranceDocument(strImg, extention);
                }

                strImg = null;


            }

            function checkIfImagesInBuffer() {
                if (DWObject.HowManyImagesInBuffer == 0) {
                    return false;
                }
                else
                    return true;
            }

            $scope.rotateImgage = function (type) {
                console.log(type);
                if (checkIfImagesInBuffer()) {
                    if (type === 'left') {

                        DWObject.RotateLeft(DWObject.CurrentImageIndexInBuffer);
                    }

                    if (type === 'right') {
                        DWObject.RotateLeft(DWObject.CurrentImageIndexInBuffer);
                    }
                } else {
                    alertify.error("scan a file to rotate");
                }
            }

            $scope.clearImages = function () {
                if (DWObject) {  
                    DWObject.RemoveAllImages();
                }
            };

        });


        if (mainObject.Tab === "ConsentDocuments") {
            $scope.AddUpdateSignatueObj.IsPatientSignRequired = mainObject.ParentItem.IsPatientSignRequired;
            $scope.AddUpdateSignatueObj.IsDoctorSignRequired = mainObject.ParentItem.IsDoctorSignRequired;
            $scope.AddUpdateSignatueObj.IsAnesthesistSignRequired = mainObject.ParentItem.IsAnesthesistSignRequired;
            $scope.AddUpdateSignatueObj.IsCounselorSignRequired = mainObject.ParentItem.IsCounselorSignRequired;
            $scope.AddUpdateSignatueObj.IsStaffSignRequired = mainObject.ParentItem.IsStaffSignRequired;
            $scope.AddUpdateSignatueObj.IsGuardianSignRequired = mainObject.ParentItem.IsGuardianSignRequired;

            $scope.AddUpdateSignatueObj.IsPatientSignatureDone = mainObject.ParentItem.IsPatientSignatureDone;
            $scope.AddUpdateSignatueObj.IsProviderSignatureDone = mainObject.ParentItem.IsProviderSignatureDone;
            $scope.AddUpdateSignatueObj.IsAnesthesistSignatureDone = mainObject.ParentItem.IsAnesthesistSignatureDone;
            $scope.AddUpdateSignatueObj.IsCounselorSignatureDone = mainObject.ParentItem.IsCounselorSignatureDone;
            $scope.AddUpdateSignatueObj.IsStaffSignatureDone = mainObject.ParentItem.IsStaffSignatureDone;
            $scope.AddUpdateSignatueObj.IsGaurdianSignatureDone = mainObject.ParentItem.IsGaurdianSignatureDone;

            $scope.AddUpdateSignatueObj.ConsentFormId = mainObject.ParentItem.ConsentFormId;
            $scope.AddUpdateSignatueObj.ConsentFormName = mainObject.ParentItem.ConsentFormName || '';
            $scope.AddUpdateSignatueObj.PatientConsentDocumentId = mainObject.ParentItem.PatientConsentFormId;

            $scope.AddUpdateSignatueObj.AnesthesistUserId = mainObject.ParentItem.AnesthesistUserId || 0;
            $scope.AddUpdateSignatueObj.CounselorUserId = mainObject.ParentItem.CounselorUserId || 0;
            $scope.AddUpdateSignatueObj.StaffUserId = mainObject.ParentItem.StaffUserId || 0;
            $scope.AddUpdateSignatueObj.ProviderUserId = mainObject.ParentItem.ProviderUserId || 0;
            $scope.AddUpdateSignatueObj.GaurdianFirstName = mainObject.ParentItem.GaurdianFirstName;
            $scope.AddUpdateSignatueObj.GaurdianLastName = mainObject.ParentItem.GaurdianLastName;

            $scope.GetAllUsers();
        }
        function languageSelected() {
            if (document.getElementById("ddlLanguages").selectedIndex > 7)
                upload_returnSth = false;
            else
                upload_returnSth = true;
            if ([0, 2, 4, 6].indexOf(document.getElementById("ddlLanguages").selectedIndex) == -1) {
                document.getElementById("extra-fields-div-id").style.display = 'none';
                document.getElementById('div-extra-fields').style.display = 'none';
            }
            else {
                document.getElementById("extra-fields-div-id").style.display = '';
                if (document.getElementById('div-extra-fields').children.length > 1 ||
                    document.getElementById('div-extra-fields').children[0].children[0].value != '') {
                    document.getElementById('div-extra-fields').style.display = '';
                }
            }
        }

        function addAField() {
            extrFieldsCount++;
            if (extrFieldsCount == 3) {
                document.getElementById('div-extra-fields').style.overflowY = 'scroll';
            }
            if (document.getElementById('div-extra-fields').style.display == "none")
                document.getElementById('div-extra-fields').style.display = '';
            else {
                document.getElementById('div-extra-fields').appendChild(blankField);
                blankField = document.getElementsByClassName('div-fields-item')[extrFieldsCount - 1].cloneNode(true);
            }
        }

      

        

        //$scope.clearImages = function () {
        //    DWObject.RemoveAllImages();
        //}


        $scope.saveFileAsPDF = function () {
            var OnSuccess = function (resp) {
                console.log(resp);
            }
            var OnFailure = function (errorCode, errorString) {
                alert(errorString);
            }
            if (DWObject.HowManyImagesInBuffer == 0) {
                alert("No images in buffer.");
                return;
            }
            DWObject.SaveAsPDF("", 0, OnSuccess, OnFailure);
        }

        var bUpload = false;
        $scope.LoadImages = function () {
            if (DWObject) {
                if (DWObject.Addon && DWObject.Addon.PDF) {
                    DWObject.Addon.PDF.SetResolution(300);
                    DWObject.Addon.PDF.SetConvertMode(Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL);
                }
                bUpload = false;
                DWObject.IfShowFileDialog = true;
                DWObject.LoadImageEx('', 5,
                    function () {
                    },
                    function (errorCode, errorString) {
                        alert('Load Image:' + errorString);
                    }
                );
            }
        }



        $scope.saveFileAsJPG = function () {

        }

        function OnHttpUploadSuccess() {
            console.log('successful');
        }

        function OnHttpServerReturnedSomething(errorCode, errorString, sHttpResponse) {
            if (errorCode != 0 && errorCode != -2003)
                alert(errorString);
            else {
                var textFromServer = sHttpResponse;
                _printUploadedFiles(textFromServer);
            }
        }

        function _printUploadedFiles(info) {
            //console.log(info);
            if (info.indexOf('DWTUploadFileName') != -1) {
                var url, _strPort;
                DWObject.IfSSL = Dynamsoft.Lib.detect.ssl;
                _strPort = location.port == "" ? 80 : location.port;
                url = 'http://' + location.hostname + ':' + location.port;
                if (Dynamsoft.Lib.detect.ssl == true) {
                    _strPort = location.port == "" ? 443 : location.port;
                    url = 'https://' + location.hostname + ':' + location.port;
                }
                var savedIntoToDB = false, imgIndexInDB = "-1";
                if (info.indexOf("DWTUploadFileIndex:") != -1) {
                    savedIntoToDB = true;
                    imgIndexInDB = info.substring(info.indexOf('DWTUploadFileIndex') + 19, info.indexOf('DWTUploadFileName'));
                    //console.log(imgIndexInDB);
                }
                var fileName = info.substring(info.indexOf('DWTUploadFileName') + 18, info.indexOf('UploadedFileSize'));
                var fileSize = info.substr(info.indexOf('UploadedFileSize') + 17);
                if (savedIntoToDB) {
                    if (info.indexOf('CSHARP') != -1) {
                        url += CurrentPath + 'action/csharp-db.aspx?imgID=' + imgIndexInDB;
                    }
                    else if (info.indexOf('VBNET') != -1) {
                        url += CurrentPath + 'action/vbnet-db.aspx?imgID=' + imgIndexInDB;
                    }
                    else if (info.indexOf('PHP') != -1) {
                        url += CurrentPath + 'action/php-mysql.php?imgID=' + imgIndexInDB;
                    }
                    else if (info.indexOf('JSP') != -1) {
                        url += CurrentPath + 'action/jsp-oracle.jsp?imgID=' + imgIndexInDB;
                    }
                }
                else {
                    url += CurrentPath + 'action/Dynamsoft_Upload/' + encodeURI(fileName);
                }
                var newTR = document.createElement('tr');
                _str = "<td class='tc'><a class='bluelink'" + ' href="' + url + '" target="_blank">' + fileName + "</a></td>" + "<td class='tc'>" + fileSize + '</td>';
                if (info.indexOf("FieldsTrue:") != -1)
                    _str += "<td class='tc'><a class='bluelink'" + '" href="' + url.substring(0, url.length - 4) + '_1.txt' + '" target="_blank">Fields</td>';
                else {
                    _str += "<td class='tc'>No Fields</td>";
                }
                newTR.innerHTML = _str;
                document.getElementById('div-uploadedFile').appendChild(newTR);
            }
        }

        

        
        var aryFilePaths = [];
        function ds_load_file_to_upload_directly(bSave, filesCount, index, path, filename) {
            nCount = filesCount;
            var filePath = path + "\\" + filename;
            if (Dynamsoft.Lib.env.bLinux || Dynamsoft.Lib.env.bMac)
                filePath = path + "/" + filename;
            aryFilePaths.push(filePath);
            if (bUpload == true) {
                if (aryFilePaths.length == nCount) {
                    upload_preparation();
                    var i = 0;
                    var uploadFileOneByOne = function () {
                        DWObject.HTTPUploadThroughPostDirectly(strHTTPServer, filePath, strActionPage, filename,
                            function () {
                                console.log('Upload Image:' + aryFilePaths[i] + ' -- successful');
                                i++;
                                if (i != nCount)
                                    uploadFileOneByOne();
                                else
                                    bUpload = false;
                            },
                            OnHttpServerReturnedSomething
                        );
                    };
                    uploadFileOneByOne();
                }
            }
        };

      


        /*******************/
        /* Upload to Azure */

        var Base64Binary = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            decode: function (input, arrayBuffer) {
                //get last chars to see if are valid
                var lkey1 = this._keyStr.indexOf(input.charAt(input.length - 1));
                var lkey2 = this._keyStr.indexOf(input.charAt(input.length - 2));
                var bytes = (input.length / 4) * 3;
                if (lkey1 == 64) bytes--; //padding chars, so skip
                if (lkey2 == 64) bytes--; //padding chars, so skip		
                var uarray;
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                var j = 0;
                if (arrayBuffer)
                    uarray = new Uint8Array(arrayBuffer);
                else
                    uarray = new Uint8Array(bytes);
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                for (i = 0; i < bytes; i += 3) {
                    //get the 3 octects in 4 ascii chars
                    enc1 = this._keyStr.indexOf(input.charAt(j++));
                    enc2 = this._keyStr.indexOf(input.charAt(j++));
                    enc3 = this._keyStr.indexOf(input.charAt(j++));
                    enc4 = this._keyStr.indexOf(input.charAt(j++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    uarray[i] = chr1;
                    if (enc3 != 64) uarray[i + 1] = chr2;
                    if (enc4 != 64) uarray[i + 2] = chr3;
                }
                return uarray;
            }
        };

        function uploadImageInner_azure(blobSasUrl, fileDataAsArrayBuffer) {
            var ajaxRequest = new XMLHttpRequest();
            try {
                ajaxRequest.open('PUT', blobSasUrl, true);
                ajaxRequest.setRequestHeader('x-ms-blob-type', 'BlockBlob');
                ajaxRequest.send(fileDataAsArrayBuffer);
                ajaxRequest.onreadystatechange = function () {
                    if (ajaxRequest.readyState == 4) {
                        console.log('Upload image to azure server successfully.');
                    }
                };
            }
            catch (e) {
                console.log("can't upload the image to server.\n" + e.toString());
            }
        }

        

        mainObject.DocumentTypeArray = mainObject.DocumentTypeArray || [];

        if (mainObject.DocumentTypeArray.length > 0) {
            $scope.DocumentTypeArray = mainObject.DocumentTypeArray || [];
        } else {

        $scope.DocumentTypeArray = [
            {
                "Id": 1,
                "Name": "General"
            },
            {
                "Id": 11,
                "Name": "Surgery Consents"
            },
            {
                "Id": 12,
                "Name": "Appointment Consents"
            },
            {
                "Id": 13,
                "Name": "Medical Records"
            },
            {
                "Id": 10,
                "Name": "Referral"
            },
            {
                "Id": 14,
                "Name": "Other Documents"
            },
            {
                "Id": 15,
                "Name": "Authorization"
            }
        ];
        }
        mainObject.AllVisitsArray = mainObject.AllVisitsArray || [];

        if (mainObject.AllVisitsArray.length > 0) {
            $scope.AllVisitsArray = mainObject.AllVisitsArray || [];
        } else {
            $scope.AllVisitsArray = [];
        }

        $scope.changedApptDate = function (item) {
            item = item || '';
            if (item != '') {
                $scope.mainObject.VisitId = item.VisitId || 0;
                $scope.mainObject.AppointmentId = item.AppointmentId || 0;
            } else {
                $scope.mainObject.AppointmentId = 0;
                $scope.mainObject.VisitId = 0;
                $scope.mainObject.SignedDate = $filter('date')(new Date(), "yyyy-MM-dd");
            }
           
        }

        $scope.mainResult = "";

        function continuetoAddPatientInsuranceDocument(base64result, ext) {

            var obj = {
                "PatientImageDocumentId": 0,
                "UserId": $scope.UserId,
                "PatientId": mainObject.PatientId,
                "AppointmentId": mainObject.AppointmentId,
                "S3URL": "",
                "DocumentName": "",
                "FileExt": ext,
                "Base64": base64result,
                "PatientName": mainObject.PatientName,
                "HospitalId": $scope.HospitalId
            };

            eHnoteSettingsDataService.AddUpdatePatientInsuranceScannedDocument(obj).then(function (resp) {
                console.log(resp);

                if (resp.data) {
                    DWObject.RemoveAllImages();
                    $scope.mainResult = JSON.parse(resp.data);
                    $uibModalInstance.close($scope.mainResult);
                }

            }, function (err) {
                DWObject.RemoveAllImages();
                console.log(err);
            });
        }

        function continuetoAddPatientConsultationScannedImage(base64result, ext) {
            if ($scope.mainObject.DisplayName == '') {
                alertify.error("please Enter FileName");
                return;
            }
            var obj = {
                "PatientImageDocumentId": 0,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                /*"PatientId": mainObject.PatientId,*/
                "PatientId": $scope.cacheStorageItem.PatientID,
                "AppointmentId": mainObject.AppointmentId,
                "AppointmentDate": mainObject.AppointmentDate,
                "VisitId": mainObject.VisitId,
                /*"PatientName": mainObject.PatientName,*/
                "PatientName": $scope.cacheStorageItem.PatientName,
                "SignedDate": mainObject.SignedDate,
                "FileTypeId": $scope.mainObject.FileTypeId,
                "IsPartiallyUploaded": "Y",
                "TreatmentPlanId": mainObject.TreatmentPlanId,
                "ShowNewConsultation": mainObject.ShowNewConsultation,
                "LabTestId": mainObject.LabTestId,
                "S3URL": "",
                "DisplayName": $scope.mainObject.DisplayName || "",
                "FileName": $scope.mainObject.FileName || "",
                "Remarks": $scope.mainObject.Remarks || "",
                "FileExt": ext,
                "IsMultipleFilesUpload": $scope.IsMultipleFilesUpload,
                "Base64": base64result
            };

            if (obj.FileExt == 'pdf') {
                obj.IsMultipleFilesUpload = true;
            } else {
                obj.IsMultipleFilesUpload = false;
            }



            eHnotePatientDataService.AddPatientConsultationScannedImage(obj).then(function (resp) {

                if (resp.data) {
                    DWObject.RemoveAllImages();
                    $scope.mainResult = resp.data;
                    $uibModalInstance.close($scope.mainResult);
                    $scope.IsDisabled = true;
                } else {
                    $scope.IsDisabled = false;
                }
                $scope.IsScanUploadStarted = false;
            }, function (err) {
                console.log(err);
                DWObject.RemoveAllImages();
                $scope.IsDisabled = false;
                $scope.IsScanUploadStarted = false;
            });
        };
        $scope.LogObj = {
            "UserId": $scope.UserId || null,
            "OrganizationId": $scope.HospitalId || null,
            "AppointmentId": mainObject.AppointmentId || null,
            "PatientId": mainObject.PatientId || null,

        }
        function continuetoAddASCPatientScannedImage(base64result, ext) {
            $scope.LogObj.LogArray = [];
            var obj = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientId": mainObject.PatientId,
                "AppointmentId": mainObject.AppointmentId,
                "VisitId": mainObject.VisitId || null,
                "PatientName": mainObject.PatientName,
                "SignedDate": mainObject.SignedDate,
                "FileTypeId": $scope.mainObject.FileTypeId,
                "S3URL": "",
                "DisplayName": $scope.mainObject.DisplayName || "",
                "FileName": $scope.mainObject.FileName || "",
                "FileExt": ext,
                "IsMultipleFilesUpload": $scope.IsMultipleFilesUpload,
                "Base64": base64result,
                "PatientSurgeryId": $scope.mainObject.PatientSurgeryId,
                "Logs": {},
            };

            if (obj.FileExt == 'pdf') {
                obj.IsMultipleFilesUpload = true;
            } else {
                obj.IsMultipleFilesUpload = false;
            }
            if ($scope.mainObject.FileTypeId == 27) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 3,
                    "ModuleName": "Pre Admission",
                    "SubModuleId": 34,
                    "SubModuleName": "Physician",
                    "ScreenType": "Files",
                    "ActionType": "Imported",
                    "ActionDescription": `Uploaded files in Physician for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
            if ($scope.mainObject.FileTypeId == 28) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 3,
                    "ModuleName": "Pre Admission",
                    "SubModuleId": 34,
                    "SubModuleName": "Physician",
                    "ScreenType": "Files",
                    "ActionType": "Imported",
                    "ActionDescription": `Uploaded files in H&P for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
            if ($scope.mainObject.FileTypeId==29) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 3,
                    "ModuleName": "Pre Admission",
                    "SubModuleId": 33,
                    "SubModuleName": "Pre-Admission(Nurse)",
                    "ScreenType": "Files",
                    "ActionType": "Imported",
                    "ActionDescription": `Files in Pre-Admission(Nurse) For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
            if ($scope.mainObject.FileTypeId == 18) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 9,
                    "SubModuleName": "Pre-Op",
                    "ScreenType": "Files",
                    "ActionType": "Imported",
                    "ActionDescription": `Files in Pre-Op Nurse For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
            if ($scope.mainObject.FileTypeId == 19) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 10,
                    "SubModuleName": "Intra-Op",
                    "ScreenType": "Files",
                    "ActionType": "Imported",
                    "ActionDescription": `Files In Intra-Op For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
            if ($scope.mainObject.FileTypeId == 17) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 3,
                    "ModuleName": "Pre Admission",
                    "SubModuleId": 35,
                    "SubModuleName": "Anesthesia",
                    "ScreenType": "Files",
                    "ActionType": "Imported",
                    "ActionDescription": `Uploaded files in Anesthesia for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
            if ($scope.mainObject.FileTypeId == 33) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 3,
                    "ModuleName": "Pre Admission",
                    "SubModuleId": 35,
                    "SubModuleName": "Anesthesia",
                    "ScreenType": "Files",
                    "ActionType": "Imported",
                    "ActionDescription": `Uploaded files in H&P for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
            if ($scope.mainObject.FileTypeId == 35) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 2,
                    "SubModuleName": "Admit",
                    "ScreenType": "Files",
                    "ActionType": "Imported",
                    "ActionDescription": `Files(External) in Admit for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
            if ($scope.mainObject.FileTypeId == 30) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 2,
                    "SubModuleName": "Admit",
                    "ScreenType": "Files",
                    "ActionType": "Imported",
                    "ActionDescription": `Files in Admit for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
            if ($scope.LogObj.LogArray.length > 0) {
                obj.Logs = $scope.LogObj || {};
            }

            console.log(obj.IsMultipleFilesUpload);
            eHnotePatientDataService.AddASCPatientScannedImage(obj).then(function (resp) {

                if (resp.data) {
                    DWObject.RemoveAllImages();
                    $scope.mainResult = resp.data;
                    $uibModalInstance.close($scope.mainResult);
                    $scope.IsDisabled = true;
                } else {
                    $scope.IsDisabled = false;
                }
                $scope.IsScanUploadStarted = false;
            }, function (err) {
                console.log(err);
                DWObject.RemoveAllImages();
                $scope.IsDisabled = false;
                $scope.IsScanUploadStarted = false;
            });
        };


        function continuetoaddPatientConsentSignedDocument(base64result, ext) {
            var obj = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientConsentDocumentId": $scope.AddUpdateSignatueObj.PatientConsentDocumentId,
                "PatientId": $scope.AddUpdateSignatueObj.PatientId,
                "PatientName": $scope.AddUpdateSignatueObj.PatientName,
                "AppointmentId": $scope.AddUpdateSignatueObj.AppointmentId,
                "ConsentFormId": $scope.AddUpdateSignatueObj.ConsentFormId,
                "S3URL": $scope.AddUpdateSignatueObj.S3URL,
                "Base64": base64result,
                "DocumentExt": ext,
                "DocumentName": $scope.AddUpdateSignatueObj.DocumentName,
                "IsPatientSignatureDone": $scope.AddUpdateSignatueObj.IsPatientSignatureDone,
                "IsStaffSignatureDone": $scope.AddUpdateSignatueObj.IsStaffSignatureDone,
                "StaffUserId": $scope.AddUpdateSignatueObj.StaffUserId,
                "IsProviderSignatureDone": $scope.AddUpdateSignatueObj.IsProviderSignatureDone,
                "ProviderUserId": $scope.AddUpdateSignatueObj.ProviderUserId,
                "IsCounselorSignatureDone": $scope.AddUpdateSignatueObj.IsCounselorSignatureDone,
                "CounselorUserId": $scope.AddUpdateSignatueObj.CounselorUserId,
                "IsAnesthesistSignatureDone": $scope.AddUpdateSignatueObj.IsAnesthesistSignatureDone,
                "AnesthesistUserId": $scope.AddUpdateSignatueObj.AnesthesistUserId,
                "GaurdianUserId": $scope.AddUpdateSignatueObj.GaurdianUserId,
                "GaurdianFirstName": $scope.AddUpdateSignatueObj.GaurdianFirstName,
                "GaurdianLastName": $scope.AddUpdateSignatueObj.GaurdianLastName,
                "IsGaurdianSignatureDone": $scope.AddUpdateSignatueObj.IsGaurdianSignatureDone,
                "IsPartiallySaved": true,
                "IsScannedDocument": true,
                "HTMLContent": "",
                "DisplayName": $scope.AddUpdateSignatueObj.ConsentFormName || '',
                "VisitId": $scope.AddUpdateSignatueObj.VisitId,
                "ConsentTemplateId": mainObject.ParentItem.ConsentTemplateId,
            };

         

          

         /*   console.log(JSON.stringify(obj));*/
            

            eHnoteSettingsDataService.AddUpdatePatientSignedConsentDocuments(obj).then(function (resp) {
                console.log(resp);
                $scope.AddUpdateSignatueObj = getnewPatientSignedObj();
                DWObject.RemoveAllImages();
                alertify.success("Consent Form Save  Successfully ");
                $uibModalInstance.close("save");
                $scope.IsDisabled = true;
               
            }, function (err) {
                console.log(err);
            });
        }


        

        //scannerjs code by durga added on 29-04-2023
        //$scope.scanWithoutAspriseDialog = function () {
        //    scanner.scan(displayImagesOnPage,
        //        {
        //            "use_asprise_dialog": false,
        //            "output_settings": [
        //                {
        //                    "type": "return-base64",
        //                    "format": "jpg"
        //                }
        //            ]
        //        }
        //    );
        //}



        ///** Processes the scan result */
        //function displayImagesOnPage(successful, mesg, response) {
        //    if (!successful) { // On error
        //        console.error('Failed: ' + mesg);
        //        return;
        //    }

        //    if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
        //        console.info('User cancelled');
        //        return;
        //    }

        //    var scannedImages = scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
        //    for (var i = 0; (scannedImages instanceof Array) && i < scannedImages.length; i++) {
        //        var scannedImage = scannedImages[i];
        //        processScannedImage(scannedImage);
        //    }
        //}

        ///** Images scanned so far. */
        //var imagesScanned = [];

        ///** Processes a ScannedImage */
        //function processScannedImage(scannedImage) {
        //    imagesScanned.push(scannedImage);
        //    var elementImg = scanner.createDomElementFromModel({
        //        'name': 'img',
        //        'attributes': {
        //            'class': 'scanned',
        //            'src': scannedImage.src
        //        }
        //    });
        //    document.getElementById('images').appendChild(elementImg);
        //}

        $scope.SearchStaffList = function (val) {
            $scope.StaffList = $scope.StaffList || [];
            $scope.FilterStaffList = angular.copy($scope.StaffList);
            val = val || "";
            if (val !== null) {
                $scope.FilterStaffList = $filter("filter")($scope.FilterStaffList, { "FullName": val });
                return $scope.FilterStaffList.map(function (item) {
                    return item;

                });
            }
        }

        $scope.SearchProviderList = function (val) {
            $scope.ProviderList = $scope.ProviderList || [];
            $scope.FilterProviderList = angular.copy($scope.ProviderList);
            val = val || "";
            if (val !== null) {
                $scope.FilterProviderList = $filter("filter")($scope.FilterProviderList, { "FullName": val });
                return $scope.FilterProviderList.map(function (item) {
                    return item;

                });
            }
        }

        $scope.SearchCounsellorList = function (val) {
            $scope.CounsellorList = $scope.CounsellorList || [];
            $scope.FilterCounsellorList = angular.copy($scope.CounsellorList);
            val = val || "";
            if (val !== null) {
                $scope.FilterCounsellorList = $filter("filter")($scope.FilterCounsellorList, { "FullName": val });
                return $scope.FilterCounsellorList.map(function (item) {
                    return item;

                });
            }
        }

        $scope.SearchAnesthesistList = function (val) {
            $scope.AnesthesistList = $scope.AnesthesistList || [];
            $scope.FilterAnesthesistList = angular.copy($scope.AnesthesistList);
            val = val || "";
            if (val !== null) {
                $scope.FilterAnesthesistList = $filter("filter")($scope.FilterAnesthesistList, { "FullName": val });
                return $scope.FilterAnesthesistList.map(function (item) {
                    return item;

                });
            }
        }

        $scope.onSelectUser = function (type, obj) {
            if (type == 'Staff') {
                console.log(obj);
                $scope.AddUpdateSignatueObj.StaffUserId = obj.DoctorID;
            }

            if (type == 'Provider') {
                console.log(obj);
                $scope.AddUpdateSignatueObj.ProviderUserId = obj.DoctorID;
            }
            if (type == 'Counselor') {
                console.log(obj);
                $scope.AddUpdateSignatueObj.CounselorUserId = obj.DoctorID;
            }
            if (type == 'Anesthesist') {
                console.log(obj);
                $scope.AddUpdateSignatueObj.AnesthesistUserId = obj.DoctorID;
            }
        }
        $scope.Splitobj = {
            "selectedAll": false,
        }
        $scope.viewScanFilesSplit = function () {
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
                    
                    //$scope.MasterFileTypeId = null;
                    $scope.pdfDocs = [];
                    $scope._pdfCache = {};
                    //$scope.splitRemarks = "";
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
                    
                    $scope.loadPDF = function () {
                        const url = $scope.ScannedS3URLData.S3URL;

                        $scope.pdfDoc = null;
                        $scope.thumbnails = [];
                        $scope.renderedPages = [];
                        $scope.selectedPages = [];
                        $scope.visiblePages = [];

                        // Determine file type by extension
                        //const extension = url.split('.').pop().toLowerCase();
                        const extension = $scope.ScannedS3URLData.DocumentExt;

                        if (extension === 'pdf') {
                         // PDF handling
                            pdfjsLib.getDocument({
                                url: url,
                                withCredentials: false
                            }).promise.then(function (pdfDoc_) {
                                $scope.pdfDoc = pdfDoc_;
                                const totalPages = pdfDoc_.numPages;
                                
                                for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                                    $scope.renderedPages.push({ pageNum });
                                    renderThumbnail(pageNum);
                                }

                                $scope.visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);

                                    $timeout(() => {
                                        $scope.visiblePages.forEach(renderFullPage);
                                    }, 100);

                                    $scope.$applyAsync();
                                    
                            }).catch(err => {
                                console.error("Error loading PDF:", err);
                            });

                        } else if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
                            
                            const urls = Array.isArray($scope.ScannedS3URLData.S3URLs) ?
                                $scope.ScannedS3URLData.S3URLs : [url];

                            urls.forEach((imgUrl, index) => {
                                const pageNum = index + 1;
                                const img = new Image();
                                img.crossOrigin = "anonymous"; // avoid tainted canvas
                                img.src = imgUrl;

                                img.onload = () => {

                                    const scale = 0.5;  // small thumbnail but sharp
                                    const thumbWidth = img.width * scale;
                                    const thumbHeight = img.height * scale;

                                    const canvasThumb = document.createElement("canvas");
                                    canvasThumb.width = thumbWidth;
                                    canvasThumb.height = thumbHeight;

                                    const ctxThumb = canvasThumb.getContext("2d");

                                    ctxThumb.imageSmoothingEnabled = true;
                                    ctxThumb.imageSmoothingQuality = "high";

                                    ctxThumb.drawImage(img, 0, 0, thumbWidth, thumbHeight);

                                    $scope.thumbnails.push({
                                        page: pageNum,
                                        //image: canvasThumb.toDataURL("image/png"),
                                        image: canvasThumb.toDataURL(),
                                        selected: false
                                    });

                                    $scope.renderedPages.push({ pageNum });
                                    $scope.visiblePages.push(pageNum);

                                    $scope.$applyAsync();

                                    $timeout(() => renderFullPage(pageNum), 50);
                                };


                            });
                        } else {
                            console.error("Unsupported file type:", extension);
                        }
                    };


                    function renderThumbnail(pageNum) {

              

                        if ($scope.thumbnails.some(t => t.page === pageNum)) return;

                        $scope.pdfDoc.getPage(pageNum).then(function (page) {

                            const scale = 2.0;

                            const viewport = page.getViewport({ scale });

                            const canvas = document.createElement('canvas');

                            const context = canvas.getContext('2d');

                            canvas.width = viewport.width;

                            canvas.height = viewport.height;

                            page.render({ canvasContext: context, viewport }).promise.then(() => {

                                const imageData = canvas.toDataURL("image/jpeg", 0.7);

                                const { jsPDF } = window.jspdf;

                                const pdf = new jsPDF({

                                    orientation: viewport.width > viewport.height ? 'landscape' : 'portrait',

                                    unit: "pt",

                                    format: [viewport.width, viewport.height]

                                });

                                // embed image into new PDF

                                pdf.addImage(imageData, 'JPEG', 0, 0, viewport.width, viewport.height, undefined, 'FAST');

                                const arrayBuffer = pdf.output("arraybuffer");

                                const uint8Array = new Uint8Array(arrayBuffer);

                                const binary = Array.from(uint8Array).map(b => String.fromCharCode(b)).join('');

                                const base64 = btoa(binary);

                                const thumb = {

                                    page: pageNum,

                                    selected: false,

                                    image: imageData,

                                    FileName: `page-${pageNum}.pdf`,

                                    FileUrl: `data:application/pdf;base64,${base64}`,

                                    pdfData: base64

                                };

                                $scope.$apply(() => {

                                    $scope.thumbnails.push(thumb);

                                });

                             });

                        });

                    }

                    // ===== Render Full Page =====
                    function renderFullPage(pageNum) {
                        if ($scope.pdfDoc) {
                            // ===== Existing PDF logic =====
                            $scope.pdfDoc.getPage(pageNum).then(function (page) {
                                var scale = 1.5;
                                var rotation = $scope.pageRotations[pageNum] || 0;
                                var viewport = page.getViewport({ scale: scale, rotation: rotation });

                                var canvasId = 'canvas-page-' + pageNum;

                                $timeout(function () {
                                    var canvas = document.getElementById(canvasId);
                                    if (!canvas) return;

                                    var context = canvas.getContext('2d');
                                    canvas.width = viewport.width;
                                    canvas.height = viewport.height;

                                    if (!$scope.renderTasks) $scope.renderTasks = {};
                                    var oldRenderTask = $scope.renderTasks[pageNum];
                                    if (oldRenderTask && typeof oldRenderTask.cancel === 'function') {
                                        try { oldRenderTask.cancel(); } catch (e) { }
                                    }

                                    var renderTask = page.render({ canvasContext: context, viewport });
                                    $scope.renderTasks[pageNum] = renderTask;

                                    renderTask.promise.then(() => {
                                        delete $scope.renderTasks[pageNum];
                                        console.log('Successfully rendered page:', pageNum);
                                    }).catch(err => {
                                        if (err && err.name !== 'RenderingCancelledException') console.error('Error rendering page', pageNum, err);
                                    });

                                }, 0);
                            }).catch(err => console.error('Failed to get page', pageNum, err));
                        }
                        else {
                            // ===== PNG/JPG logic =====
                            const urls = Array.isArray($scope.ScannedS3URLData.S3URLs) ? $scope.ScannedS3URLData.S3URLs : [$scope.ScannedS3URLData.S3URL];
                            const imgUrl = urls[pageNum - 1]; // match pageNum with index

                            if (!imgUrl) return;

                            const img = new Image();
                            img.crossOrigin = "anonymous";
                            img.src = imgUrl;

                            img.onload = () => {
                                const canvas = document.getElementById('canvas-page-' + pageNum);
                                if (!canvas) return;

                                const ctx = canvas.getContext('2d');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                ctx.drawImage(img, 0, 0, img.width, img.height);
                                console.log('Image page rendered:', pageNum);
                            };

                            img.onerror = err => console.error('Failed to render image page', pageNum, err);
                        }
                    }


                    $scope.selectedPdfUrls = $scope.selectedPdfUrls || [];
                    $scope.selectedPages = $scope.selectedPages || [];
                    $scope.Splitobj.selectedAll = $scope.Splitobj.selectedAll || false;

                    $scope.toggleSelectAll = function (Ind) {
                        $scope.Splitobj.selectedAll = Ind || false;
                        if ($scope.Splitobj.selectedAll) {
                            angular.forEach($scope.thumbnails, function (kitem) {
                                kitem.selected = true;
                            });
                        } else {
                            angular.forEach($scope.thumbnails, function (kitem) {
                                kitem.selected = false;
                            });
                        }
                        $timeout(function () {
                            
                            $scope.selectedPdfUrls = [];
                            $scope.selectedPages = [];

                            angular.forEach($scope.thumbnails, function (thumb) {
                                
                                if (thumb.selected) {
                                    thumb.index = thumb.page - 1;
                                    $scope.selectedPdfUrls.push(thumb);
                                    $scope.selectedPages.push(thumb.page);
                                }
                            });
                            $scope.selectedCount = $scope.selectedPages.length;
                            updateVisiblePages();
                        }, 0);
                    };
                    
                    $scope.toggleSelect = function (thumb) {
                        if (thumb.selected) {
                            const exists = $scope.selectedPdfUrls.some(p => p.page === thumb.page);
                            if (!exists) {
                                thumb.index = thumb.page - 1;
                                $scope.selectedPdfUrls.push(thumb);
                            }

                            if (!$scope.selectedPages.includes(thumb.page)) {
                                $scope.selectedPages.push(thumb.page);
                            }
                        } else {
                            $scope.selectedPages = $scope.selectedPages.filter(p => p !== thumb.page);
                            $scope.selectedPdfUrls = $scope.selectedPdfUrls.filter(p => p.page !== thumb.page);
                        }
                        $scope.Splitobj.selectedAll = $scope.thumbnails.length > 0 && $scope.thumbnails.every(t => t.selected);
                        $scope.selectedCount = $scope.selectedPages.length;
                        /*uploadbase64tos3(thumb);*/
                        updateVisiblePages();
                    };


                    // ========== Update Visible Pages ========== //
                    function updateVisiblePages() {
                        if ($scope.selectedPages.length === 0) {
                            $scope.visiblePages = $scope.renderedPages.map(p => p.pageNum);
                        } else {
                            $scope.visiblePages = [...$scope.selectedPages].sort((a, b) => a - b);
                        }

                        $timeout(function () {
                            $scope.visiblePages.forEach(renderFullPage);
                        });
                    }

                    $scope.scrollToPage = function (pageNum) {
                        const el = document.getElementById('pdf-page-' + pageNum);
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    };
                    $scope.Splitobj.MasterFileTypeId = $scope.SelectedFile || 1;
                    $scope.loadDocumentTypes = function () {
                        ehnoteservice.getDocumentTypes().then(function (res) {
                            $scope.DocumentTypeArray = res.data || [];

                            // set default only if not already set
                            if (!$scope.Splitobj.MasterFileTypeId) {
                                $scope.Splitobj.MasterFileTypeId = 1;
                                $scope.updateAllOriginalFileTypes($scope.Splitobj.MasterFileTypeId);
                            }
                        });
                    };

                    $scope.updateAllOriginalFileTypes = function (typeId) {
                        $scope.Splitobj.MasterFileTypeId = typeId;

                        ($scope.OriginalFiles || []).forEach(f => f.FileTypeId = typeId);
                        ($scope.SplitFilesArray || []).forEach(p => p.FileTypeId = typeId);
                        ($scope.FilesObj?.TempImagesArray || []).forEach(f => f.FileTypeId = typeId);
                        ($scope.thumbnails || []).forEach(t => t.FileTypeId = typeId);
                    };

                    $scope.ScannedSplitDocumentSave = async function () {
                        if ($scope.selectedPdfUrls.length === 0) {
                            alertify.error("Please select Document.");
                            return;
                        }
                        if ($scope.mainObject.DisplayName == '') {
                            alertify.error("please Enter FileName");
                            return;
                        }
                        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'> The selected Document will be saved and removed from the original file ? </h4>", async function () {
                            try {

                                

                                var base64Results = [];
                                var selected = [];
                                selected = $scope.thumbnails.filter(t => t.selected);

                                if (selected.length != 0) {
                                    var obj = {
                                        "PatientImageDocumentId": 0,
                                        "UserId": $scope.UserId,
                                        "HospitalId": $scope.HospitalId,
                                        "PatientId": $scope.cacheStorageItem.PatientID,
                                        "AppointmentId": $scope.mainObject.AppointmentId,
                                        "AppointmentDate": $scope.mainObject.AppointmentDate,
                                        "VisitId": $scope.mainObject.VisitId,
                                        "PatientName": $scope.cacheStorageItem.PatientName,
                                        "SignedDate": $scope.mainObject.SignedDate,
                                        "FileTypeId": $scope.mainObject.FileTypeId,
                                        "IsPartiallyUploaded": "Y",
                                        "TreatmentPlanId": $scope.mainObject.TreatmentPlanId,
                                        "ShowNewConsultation": $scope.mainObject.ShowNewConsultation,
                                        "LabTestId": $scope.mainObject.LabTestId,
                                        "S3URL": "",
                                        "DisplayName": $scope.mainObject.DisplayName || "",
                                        "FileName": $scope.mainObject.FileName || "",
                                        "Remarks": $scope.mainObject.Remarks || "",
                                        "FileExt": "pdf",
                                        "IsMultipleFilesUpload": false,
                                        "Base64": '',
                                        "SelectedBase64Array": selected || []
                                    };

                                    if (obj.FileExt == 'pdf') {
                                        obj.IsMultipleFilesUpload = true;
                                    } else {
                                        obj.IsMultipleFilesUpload = false;
                                    }
                                    var ActionDateTime = $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss");
                                    if (obj.FileName == '' && selected.length > 0) {
                                        obj.FileName = $scope.mainObject.PatientName + "-" + ActionDateTime + "-" + selected[0].FileName;
                                    }
                                    eHnotePatientDataService.AddPatientConsultationScannedImage(obj).then(function (resp) {
                                        if (resp.data) {
                                            $scope.selectedPages = [];
                                            const NotSelectedArray = $scope.thumbnails.filter(t => !t.selected);
                                            if (NotSelectedArray.length == 0) {
                                                $scope.Splitobj.IsscanFileSplitSave = true;
                                                $scope.closeuibpopup();
                                                
                                                if (resp.data) {
                                                    $scope.IsDisabled = true;
                                                } else {
                                                    $scope.IsDisabled = false;
                                                }
                                            } else {
                                                alertify.success("Files Uploaded Successfully");
                                                
                                                $scope.thumbnails = $scope.thumbnails.filter(function (thumb) {
                                                    return !thumb.selected; // keep only unselected
                                                });

                                                
                                                //angular.forEach($scope.selectedPdfUrls, function (kitem) {
                                                //    $scope.renderedPages.splice(kitem.index, 1);
                                                //});
                                                const removedPages = $scope.selectedPdfUrls
                                                    .filter(p => p.selected)
                                                    .map(p => ({pageNum: p.page }));

                                                $scope.renderedPages = $scope.renderedPages.filter(p =>
                                                    !removedPages.some(r => r.pageNum === p.pageNum)
                                                );


                                                $scope.visiblePages = $scope.renderedPages.map(p => ({
                                                    fileObj: p.fileObj,
                                                    pageNum: p.pageNum,
                                                    FileExt: p.FileExt
                                                }));
                                                const isFullFileSuccess = $scope.selectedPdfUrls.length === 0;
                                                const allPagesRemoved = $scope.visiblePages.length === 0;

                                                $scope.visiblePages.forEach(p => {
                                                    const canvasId = `canvas-page-${p.pageNum}`;
                                                    const canvas = document.getElementById(canvasId);
                                                    if (canvas) {
                                                        const ctx = canvas.getContext('2d');
                                                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                    }
                                                });

                                                updateVisiblePages();
                                                //$scope.toggleSelectAll(false)

                                                $scope.Splitobj.selectedAll = false;

                                                $scope.FilesObj = angular.copy($scope.GetFilesObj());
                                                $scope.GetAllPatientUploadsNew();
                                                $scope.IsDisabled = true;
                                                
                                                $scope.Splitobj.MasterFileTypeId = 1;
                                                $scope.splitRemarks = "";
                                                $scope.selectedCount = "";
                                                $scope.selectedPdfUrls = [];
                                                if ((isFullFileSuccess || allPagesRemoved) && $scope.closeuibpopup) {
                                                    $scope.$parent.FilesObj.TempImagesArray = [];
                                                    $scope.closeuibpopup();
                                                    return;
                                                }
                                                $scope.$applyAsync();

                                                $scope.mainObject.DisplayName = '';
                                                $scope.mainObject.FileTypeId = 1;
                                                $scope.mainObject.SelectedDate1 = '';
                                                $scope.mainObject.Remarks = '';
                                            }
                                        }
                                    }, function (err) {

                                    });
                                }

                            } catch (error) {
                                console.error("Error during file upload process:", error);
                                $scope.IsDisabled = false;
                            }

                        }, function () { });
                    };


                    $scope.closeuibpopup = function () {
                        $uibModalInstance.dismiss('close');
                        $scope.$parent.SelectedFile = 1;
                        $scope.$parent.SelectedDate1 = "";
                        $scope.$parent.FilesObj.TempImagesArray = [];
                        $scope.clearImages();
                        $scope.mainObject.DisplayName = '';
                        $scope.mainObject.Remarks = '';
                        $scope.mainObject.SelectedDate1 = '';
                        $scope.mainObject.FileTypeId = 1;
                    };
                }
            });
        };

        $scope.StringImageToPDF = function (String, Fcount) {
            var Obj = {
                "PatientId": mainObject.PatientId || 0,
                "HospitalId": $scope.HospitalId || 0,
                "PatientName": mainObject.PatientName,
                "AppointmentDate": mainObject.AppointmentDate,
                "Base64String": String || '',
                "FileCount": Fcount || 0,
            }
            eHnotePatientVisitReasonServices.UploadBase64ImagetoPDF(Obj).then(function (resp) {
                if (resp.data.S3URL !== "") {
                    $scope.ScannedS3URLData = resp.data || '',
                    $scope.viewScanFilesSplit();
                }
            })
        };

        
    }]);    
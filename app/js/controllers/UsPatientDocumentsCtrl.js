eHnoteWebApp.controller("UsPatientDocumentsCtrl", ["$scope", "eHnotePatientDataService", "$timeout", "alertify", "$uibModalInstance", "eHnoteMasterDataService", "eHnoteCacheStorageService", "ParentObject", "$uibModal", "$rootScope", "eHnoteMainAppointmentService", "textAngularManager", "$filter", "USPrintService", "eHnoteSettingsDataService", "$sce", "eHnoteUserDataService", "datapersistanceFactory", "eHnoteSurgeryService", "eHnoteLoginStatusService", "eHnoteAuditServices", "$q", function ($scope, eHnotePatientDataService, $timeout, alertify, $uibModalInstance, eHnoteMasterDataService, eHnoteCacheStorageService, ParentObject, $uibModal, $rootScope, eHnoteMainAppointmentService, textAngularManager, $filter, USPrintService, eHnoteSettingsDataService, $sce, eHnoteUserDataService, datapersistanceFactory, eHnoteSurgeryService, eHnoteLoginStatusService, eHnoteAuditServices, $q) {


    console.log(ParentObject);
    $scope.ParentObject = angular.copy(ParentObject) || '';

    $scope.Documentobj = {
        "SubType": 'Patient',
        "IsActiveMoreFieldsTab": false
    };

    $scope.PatientId = $scope.ParentObject.PatientId;
    /*$scope.PatientName = $scope.ParentObject.mainitem.PatientFullName;*/
    $scope.PatientName = $scope.ParentObject.PatientDetails.FullName;

    $scope.AppointmentId = $scope.ParentObject.mainitem.AppointmentID;
    $scope.AppointmentDate = $scope.ParentObject.AppointmentDate;
    $scope.VisitId = $scope.ParentObject.mainitem.VisitId;
    $scope.AppointmentTypeId = 0;
    $scope.UserId = $scope.ParentObject.UserId;
    $scope.HospitalId = $scope.ParentObject.HospitalId;
    $scope.ParentOrganizationId = $scope.ParentObject.ParentHospitalId;
    $scope.selectedPatientSurgeryObj = $scope.ParentObject.mainitem;

    //$scope.SelectedConsentFormId =$scope.ParentObject.selectedObj.ConsentFormId || 0;


    $scope.selectedHospitalAddress = $scope.ParentObject.HospitalAddress;

    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();


    $scope.PatientDetailsObj = angular.copy($scope.ParentObject.PatientDetails) || '';

    var mObj = datapersistanceFactory.getItem("masterDataArrays");
    $scope.RelationShipTypeList = angular.copy(mObj.masterRelationTypes);

    $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();

    console.log($scope.RelationShipTypeList);

    //$scope.PaitentDetails = {
    //    "FullName": $scope.selectedPatientData.Patient[0].FullName || "",
    //    "PatientDisplayId": $scope.selectedPatientData.Patient[0].PatientDisplayId || "",
    //    "MobileNo": $scope.selectedPatientData.Patient[0].MobileNo || 0,
    //    "DOB": $scope.selectedPatientData.Patient[0].DOB || "",
    //    "AgeInYears": $scope.selectedPatientData.Patient[0].AgeInYears || 0,
    //    "AgeInMonths": $scope.selectedPatientData.Patient[0].AgeInMonths || 0,
    //    "S3URL": $scope.selectedPatientData.Patient[0].S3URL || "",
    //    "SocialSecurityNo": $scope.selectedPatientData.Patient[0].SocialSecurityNo || "",
    //    "BloodGroupName": $scope.selectedPatientData.Patient[0].PatientOtherDetails[0].BloodGroupName || "",
    //    "MaritalStatusName": $scope.selectedPatientData.Patient[0].PatientOtherDetails[0].MaritalStatus || "",
    //    "ContactInfo": {
    //        "EmailID": $scope.selectedPatientData.Patient[0].EmailId || "",
    //    }
    //}


    //$scope.PostalAddressSummaryObj = {
    //    "AddressId": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressId || 0,
    //    "AddressLine1": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressLine1 || "",
    //    "AddressLine2": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressLine2 || "",
    //    "ZipCode": $scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode || "",
    //    "CountyId": $scope.selectedPatientData.PatientAddress.PostalAddress.CountyId || 0,
    //    "CountyName": $scope.selectedPatientData.PatientAddress.PostalAddress.CountyName || "",
    //    "CityName": $scope.selectedPatientData.PatientAddress.PostalAddress.CityName || "",
    //    "CityId": $scope.selectedPatientData.PatientAddress.PostalAddress.CityId || 0,
    //    "StateName": $scope.selectedPatientData.PatientAddress.PostalAddress.StateName || "",
    //    "StateId": $scope.selectedPatientData.PatientAddress.PostalAddress.StateId || 0,
    //    "CountryName": $scope.selectedPatientData.PatientAddress.PostalAddress.CountryName || "",
    //    "CountryId": $scope.selectedPatientData.PatientAddress.PostalAddress.CountryId || 0,
    //}

    //$scope.PermanentAddressSummaryObj = {
    //    "AddressId": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressId || 0,
    //    "AddressLine1": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressLine1 || "",
    //    "AddressLine2": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressLine2 || "",
    //    "ZipCode": $scope.selectedPatientData.PatientAddress.PermanentAddress.ZipCode || "",
    //    "CountyId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountyId || 0,
    //    "CountyName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountyName || "",
    //    "CityName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CityName || "",
    //    "CityId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CityId || 0,
    //    "StateName": $scope.selectedPatientData.PatientAddress.PermanentAddress.StateName || "",
    //    "StateId": $scope.selectedPatientData.PatientAddress.PermanentAddress.StateId || 0,
    //    "CountryName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountryName || "",
    //    "CountryId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountryId || 0,
    //}

    //$scope.PatientOfficeNumber = $scope.selectedPatientData.Patient[0].OfficeAreaCode + $scope.selectedPatientData.Patient[0].PatientOfficeNumber;
    //var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
    //$scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;

    //$scope.DemographicSummaryObj = {
    //    "LanguageName": $scope.selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
    //    "Proficiency": $scope.selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
    //    "SexualOrientation": $scope.selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
    //    "GenderIdentityStatus": $scope.selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
    //}
    $scope.OrgDigitalSignType = $scope.OrganizationSettingsData.AppointmentSettings.DigitalSigatureType || "Drawing";
    // Signature datetime editing state
    $scope.SignatureDateTimeEdit = {
        // Patient signature datetime
        PatientDateTime: null,
        IsPatientEditing: false,
        PatientOriginalDateTime: null,

        // Staff signature datetime  
        StaffDateTime: null,
        IsStaffEditing: false,
        StaffOriginalDateTime: null,

        // Provider signature datetime
        ProviderDateTime: null,
        IsProviderEditing: false,
        ProviderOriginalDateTime: null,

        // Counselor signature datetime
        CounselorDateTime: null,
        IsCounselorEditing: false,
        CounselorOriginalDateTime: null,

        // Anesthesiologist signature datetime
        AnesthesistDateTime: null,
        IsAnesthesistEditing: false,
        AnesthesistOriginalDateTime: null,

        // Guardian signature datetime
        GaurdianDateTime: null,
        IsGaurdianEditing: false,
        GaurdianOriginalDateTime: null
    };

    // Check if user has permission to edit signature datetime
    $scope.CanEditSignatureDateTime = false;
    if ($scope.UserAccessRights && $scope.UserAccessRights.AllAccessRights && $scope.UserAccessRights.AllAccessRights.EditDatetimeOfConsentForm) {
      
        $scope.CanEditSignatureDateTime = true;
    }
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.RoleId = userLoginDetails.RoleID;
    function getnewPatientSignedObj() {
        var obj = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "PatientConsentDocumentId": 0,
            "PatientId": $scope.PatientId,
            "PatientName": $scope.PatientName,
            "AppointmentId": $scope.AppointmentId,
            "VisitId": $scope.VisitId,
            "AppointmentDate": $scope.AppointmentDate,
            "ConsentTemplateId": 0,
            "ConsentFormId": 0,
            "Base64": "",
            "S3URL": "",
            "DocumentExt": "",
            "DocumentName": "",
            "IsPatientSignatureDone": false,
            "IsPatientInitialSignatureDone": false,
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
            "GaurdianFirstName": "",
            "GaurdianLastName": "",
            "GaurdianRelationShipId": "",
            "IsGaurdianSignatureDone": false,
            "IsPartiallySaved": false,
            "HTMLContent": "",
            "PatientSignedDateTime": "",
            "ProviderSignedDateTime": "",
            "StaffSignedDateTime": "",
            "CounselorSignedDateTime": "",
            "AnesthesistSignedDateTime": "",
            "GaurdianSignedDateTime": "",
            "PatientSignCaptureUserId": 0,
            "ProviderSignCaptureUserId": 0,
            "StaffSignCaptureUserId": 0,
            "CounselorSignCaptureUserId": 0,
            "AnesthesistSignCaptureUserId": 0,
            "GaurdianSignCaptureUserId": 0,
        };
        return obj;
    }

    $scope.MainPatientSignedObj = getnewPatientSignedObj();
    $scope.GetLogObj = function () {
        return {
            "UserId": $scope.UserId || null,
            "OrganizationId": $scope.HospitalId || null,
            "AppointmentId": $scope.AppointmentId || null,
            "PatientId": $scope.PatientId || null,
            "LogArray": [],
            "PatientEncryptedSig": "",
            "PatientIntialEncryptedSig": "",
            "StaffEncryptedSig": "",
            "CounselorEncryptedSig": "",
            "AnesthesistEncryptedSig": "",
            "GuardianEncryptedSig": "",
            "ProviderEncryptedSig": ""
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
    //$scope.AnesthesiaList = [
    //    {
    //        "AnesthesiaTypeId": 1,
    //        "AnesthesiaType": "TopicalAnesthesia",
    //        "IsSelected": false,
    //        "PatientAnesthesiaPlanId": 0,
    //    },
    //    {
    //        "AnesthesiaTypeId": 2,
    //        "AnesthesiaType": "LocalAnesthesia",
    //        "IsSelected": false,
    //        "PatientAnesthesiaPlanId": 0
    //    },
    //    {
    //        "AnesthesiaTypeId": 3,
    //        "AnesthesiaType": "GeneralAnesthesia",
    //        "IsSelected": false,
    //        "PatientAnesthesiaPlanId": 0
    //    },
    //    {
    //        "AnesthesiaTypeId": 4,
    //        "AnesthesiaType": "PeribulbarAnesthesia",
    //        "IsSelected": false,
    //        "PatientAnesthesiaPlanId": 0
    //    },
    //    {
    //        "AnesthesiaTypeId": 5,
    //        "AnesthesiaType": "Sub-TenonAnesthesia",
    //        "IsSelected": false,
    //        "PatientAnesthesiaPlanId": 0
    //    },
    //    {
    //        "AnesthesiaTypeId": 6,
    //        "AnesthesiaType": "RegionalAnesthesia",
    //        "IsSelected": false,
    //        "PatientAnesthesiaPlanId": 0
    //    },
    //    {
    //        "AnesthesiaTypeId": 7,
    //        "AnesthesiaType": "IVSedation",
    //        "IsSelected": false,
    //        "PatientAnesthesiaPlanId": 0
    //    },
    //    {
    //        "AnesthesiaTypeId": 8,
    //        "AnesthesiaType": "Monitored Anesthesia Care (MAC)",
    //        "IsSelected": false,
    //        "PatientAnesthesiaPlanId": 0
    //    },
    //    {
    //        "AnesthesiaTypeId": 9,
    //        "AnesthesiaType": "Oral Sedation",
    //        "IsSelected": false,
    //        "PatientAnesthesiaPlanId": 0
    //    }
    //]


    console.log($scope.PatientId);
    console.log($scope.AppointmentId);



    $scope.switchDocTabMain = function (type) {
        $scope.Documentobj.SubType = type;
        $scope.PatientAppointmentConsentForms = [];

        $scope.selectedPatientConsentObj.HtmlContent = "";
        $scope.selectedPatientConsentObj.pdfDocument = "";
        $scope.selectedPatientTempConsentObj.HtmlContent = "";
        $scope.switchToPatientConsent(1);
    };

    $scope.PatientAppointmentConsentForms = [];




    $scope.patientAllConsentDocuments = [];
    $scope.getPatientSignedConsentDocuments = function () {



        var params = {
            "PatientId": $scope.PatientId,
            "Date": "",
            "AppointmentId": ""
        }

        console.log(params);

        eHnoteSettingsDataService.GetPatientConsentDocuments(params).then(function (resp) {
            console.log(resp);
            if (resp.data.status === 'Success') {
                $scope.patientAllConsentDocuments = resp.data.rows || [];
            }

        }, function (err) {
            console.log(err);
        });
    }
    $scope.onSelectApptConsentFormNew = function (item) {
        console.log(item);
        $scope.selectedPatientTempConsentObj.HtmlContent = "";


        $scope.MainPatientSignedObj = getnewPatientSignedObj();
        $scope.signPlusObj = addnewsignPlusObj();
        $scope.MainPatientSignedObj.ConsentTemplateId = $scope.consentsMainObj.SelectedConsentTemplateId;
        $scope.MainPatientSignedObj.ConsentFormId = item.ConsentFormId;
        $scope.MainPatientSignedObj.ConsentFormName = item.ConsentFormName || '';
        $scope.MainPatientSignedObj.PatientConsentDocumentId = item.PatientConsentFormId;
        $scope.MainPatientSignedObj.IsPatientSignatureDone = item.IsPatientSignatureDone;
        $scope.MainPatientSignedObj.IsProviderSignatureDone = item.IsProviderSignatureDone;
        $scope.MainPatientSignedObj.IsAnesthesistSignatureDone = item.IsAnesthesistSignatureDone;
        $scope.MainPatientSignedObj.IsCounselorSignatureDone = item.IsCounselorSignatureDone;
        $scope.MainPatientSignedObj.IsStaffSignatureDone = item.IsStaffSignatureDone;
        $scope.MainPatientSignedObj.IsGaurdianSignatureDone = item.IsGaurdianSignatureDone;
        $scope.signPlusObj.PatientConsentDocumentId = $scope.MainPatientSignedObj.PatientConsentDocumentId || 0;
        $scope.signPlusObj.StaffUserId = item.StaffUserId || 0;
        $scope.signPlusObj.StaffUserObj = item.StaffUserName || "";
        $scope.MainPatientSignedObj.StaffUserId = item.StaffUserId || 0;
        $scope.MainPatientSignedObj.StaffUserName = item.StaffUserName || "";
        $scope.MainPatientSignedObj.ProviderUserId = item.ProviderUserId || 0;
        $scope.signPlusObj.ProviderUserId = item.ProviderUserId || 0;
        $scope.signPlusObj.ProviderUserObj = item.ProviderUserName || "";
        $scope.MainPatientSignedObj.ProviderUserName = item.ProviderUserName || "";
        $scope.signPlusObj.CounselorUserId = item.CounselorUserId || 0;
        $scope.MainPatientSignedObj.CounselorUserId = item.CounselorUserId || 0;
        $scope.signPlusObj.CounselorUserObj = item.CounselorUserName || "";
        $scope.MainPatientSignedObj.CounselorUserName = item.CounselorUserName || "";
        $scope.signPlusObj.AnesthesistUserId = item.AnesthesistUserId || 0;
        $scope.MainPatientSignedObj.AnesthesistUserId = item.AnesthesistUserId || 0;
        $scope.signPlusObj.AnesthesistUserObj = item.AnesthesistUserName || "";
        $scope.MainPatientSignedObj.AnesthesistUserName = item.AnesthesistUserName || "";
        $scope.signPlusObj.IsPatientDigitalSignTaken = $scope.MainPatientSignedObj.IsPatientSignatureDone;
        $scope.signPlusObj.IsProviderDigitalSignTaken = $scope.MainPatientSignedObj.IsProviderSignatureDone;
        $scope.signPlusObj.IsStaffDigitalSignTaken = $scope.MainPatientSignedObj.IsStaffSignatureDone;
        $scope.signPlusObj.IsAnesthesistDigitalSignTaken = $scope.MainPatientSignedObj.IsAnesthesistSignatureDone;
        $scope.signPlusObj.IsCounselorDigitalSignTaken = $scope.MainPatientSignedObj.IsCounselorSignatureDone;
        $scope.signPlusObj.IsGaurdianDigitalSignTaken = $scope.MainPatientSignedObj.IsGaurdianSignatureDone;
        $scope.MainPatientSignedObj.GaurdianFirstName = item.GaurdianFirstName || "";
        $scope.MainPatientSignedObj.GaurdianLastName = item.GaurdianLastName || "";
        $scope.signPlusObj.GaurdianFirstName = item.GaurdianFirstName || "";
        $scope.signPlusObj.GaurdianLastName = item.GaurdianLastName || "";
        $scope.signPlusObj.GaurdianRelationShipId = item.GaurdianRelationShipId || "";

        $scope.MainPatientSignedObj.GaurdianFirstName = item.GaurdianFirstName || "";
        $scope.MainPatientSignedObj.GaurdianLastName = item.GaurdianLastName || "";
        $scope.MainPatientSignedObj.GaurdianRelationShipId = item.GaurdianRelationShipId || "";

        $scope.signaturesTab.Patient = item.IsPatientSignRequired || false;
        $scope.signaturesTab.Staff = item.IsStaffSignRequired || false;
        $scope.signaturesTab.Provider = item.IsDoctorSignRequired || false;
        $scope.signaturesTab.Anesthesist = item.IsAnesthesistSignRequired || false;
        $scope.signaturesTab.Counselor = item.IsCounselorSignRequired || false;
        $scope.signaturesTab.Gaurdian = item.IsGuardianSignRequired || false;

        item.PatientSignedDateTime = item.PatientSignedDateTime || null;
        if (item.PatientSignedDateTime !== null) {
            //$scope.MainPatientSignedObj.PatientSignedDateTime = $filter('date')(item.PatientSignedDateTime, "MM-dd-yyyy hh:mm a");
            $scope.MainPatientSignedObj.PatientSignedDateTime = moment(item.PatientSignedDateTime).format("MM-DD-YYYY hh:mm A");
            $scope.MainPatientSignedObj.PatientSignCaptureUserId = item.PatientSignCaptureUserId;
        }
        item.ProviderSignedDateTime = item.ProviderSignedDateTime || null;
        if (item.ProviderSignedDateTime !== null) {
            $scope.MainPatientSignedObj.ProviderSignedDateTime = moment(item.ProviderSignedDateTime).format("MM-DD-YYYY hh:mm A");
            $scope.MainPatientSignedObj.ProviderSignCaptureUserId = item.ProviderSignCaptureUserId;
        }

        item.CounselorSignedDateTime = item.CounselorSignedDateTime || null;
        if (item.CounselorSignedDateTime !== null) {
            $scope.MainPatientSignedObj.CounselorSignedDateTime = moment(item.CounselorSignedDateTime).format("MM-DD-YYYY hh:mm A");
            $scope.MainPatientSignedObj.CounselorSignCaptureUserId = item.CounselorSignCaptureUserId;
        }

        item.AnesthesistSignedDateTime = item.AnesthesistSignedDateTime || null;
        if (item.AnesthesistSignedDateTime !== null) {
            $scope.MainPatientSignedObj.AnesthesistSignedDateTime = moment(item.AnesthesistSignedDateTime).format("MM-DD-YYYY hh:mm A");
            $scope.MainPatientSignedObj.AnesthesistSignCaptureUserId = item.AnesthesistSignCaptureUserId;
        }
        item.StaffSignedDateTime = item.StaffSignedDateTime || null;
        if (item.StaffSignedDateTime !== null) {
            $scope.MainPatientSignedObj.StaffSignedDateTime = moment(item.StaffSignedDateTime).format("MM-DD-YYYY hh:mm A");
            $scope.MainPatientSignedObj.StaffSignCaptureUserId = item.StaffSignCaptureUserId;
        }

        item.GaurdianSignedDateTime = item.GaurdianSignedDateTime || null;
        if (item.GaurdianSignedDateTime !== null) {
            $scope.MainPatientSignedObj.GaurdianSignedDateTime = moment(item.GaurdianSignedDateTime).format("MM-DD-YYYY hh:mm A");
            $scope.MainPatientSignedObj.GaurdianSignCaptureUserId = item.GaurdianSignCaptureUserId;
        }




        $scope.selectedPatientTempConsentObj.HtmlContent = item.PDFcontent;
        var editorScope = textAngularManager.retrieveEditor('htmlPatientTemplateconsent').scope;
        $timeout(function () {
            editorScope.displayElements.text[0].focus();
            var innerTaTextElementId = editorScope.displayElements.text[0].id;
            placeCaretAtEnd(document.getElementById(innerTaTextElementId));
        });
        setTimeout(attachHeaderKeyGuard, 300);
        FillPatientConsentDetails();
        $scope.getPatientConsendDocSigs($scope.ParentObject.PatientId, $scope.MainPatientSignedObj.PatientConsentDocumentId);
    };


    $scope.getPatientConsendDocSigs = function (patientid, documentid) {
        documentid = documentid || 0;

        eHnoteSettingsDataService.GetPatientEncryptedSig(patientid, documentid).then(function (response) {
            console.log(response);

            if (response.data.IsPatientSignatureDone) {
                let PatientEncryptedSig = '';
                if (response.data.PatientEncryptedSig) {
                    PatientEncryptedSig = response.data.PatientEncryptedSig || '';
                } else if (response.data.PatientSignString) {
                    PatientEncryptedSig = response.data.PatientSignString || '';
                }
                response.data.PatientEncryptedSig = response.data.PatientEncryptedSig ||  "";
                //response.data.PatientEncryptedSig = response.data.PatientSignString || "";
                if (PatientEncryptedSig != "") {
                    $scope.GetSignatureDeleteObj.PatientSignature = true;
                    $scope.signPlusObj.PatientSignString = PatientEncryptedSig;
                    var canvasp = document.getElementById('patientSigantureImg');
                    var contextp = canvasp.getContext('2d');
                    var imagep = new Image();
                    imagep.onload = function () {
                        /*   context.drawImage(image, 0, 0);*/
                        var centerXp = canvasp.width / 2 - imagep.width / 2;
                        var centerYp = canvasp.height / 2 - imagep.height / 2;
                        // contextp.drawImage(imagep, centerXp, centerYp);
                        contextp.drawImage(imagep, 0, 0, canvasp.width, canvasp.height);
                    };
                    imagep.src = response.data.PatientEncryptedSig;
                }
                response.data.PatientIntialEncryptedSig = response.data.PatientIntialEncryptedSig || "";
                $scope.GetSignatureDeleteObj.PatientIntialSignature = false;
                if (response.data.PatientIntialEncryptedSig != "") {
                    $scope.GetSignatureDeleteObj.PatientIntialSignature = true;
                    $scope.MainPatientSignedObj.IsPatientInitialSignatureDone = true;
                    $scope.signPlusObj.PatientIntialSignString = response.data.PatientIntialEncryptedSig;
                    var canvaspi = document.getElementById('patientIntSigantureImg');
                    var contextpi = canvaspi.getContext('2d');
                    var imagepi = new Image();
                    imagepi.onload = function () {
                        /*   context.drawImage(image, 0, 0);*/
                        var centerXp = canvaspi.width / 2 - imagepi.width / 2;
                        var centerYp = canvaspi.height / 2 - imagepi.height / 2;
                        // contextp.drawImage(imagep, centerXp, centerYp);
                        contextpi.drawImage(imagepi, 0, 0, canvaspi.width, canvaspi.height);
                    };
                    imagepi.src = response.data.PatientIntialEncryptedSig;
                }
            }

            if (response.data.IsStaffSignatureDone) {
                response.data.StaffEncryptedSig = response.data.StaffEncryptedSig || "";

                if (response.data.StaffEncryptedSig != "") {
                    $scope.GetSignatureDeleteObj.StaffSignature = true;
                    $scope.signPlusObj.StaffSignString = response.data.StaffEncryptedSig;
                    var canvasS = document.getElementById('staffSigantureImg');

                    var contextS = canvasS.getContext('2d');
                    var imageS = new Image();
                    imageS.onload = function () {
                        /*   context.drawImage(image, 0, 0);*/
                        //var centerXS = canvasS.width / 2 - imageS.width / 2;
                        //var centerYS = canvasS.height / 2 - imageS.height / 2;
                        //contextS.drawImage(imageS, centerXS, centerYS);
                        contextS.drawImage(imageS, 0, 0, canvasS.width, canvasS.height);
                    };
                    imageS.src = response.data.StaffEncryptedSig;
                }
            }

            if (response.data.IsProviderSignatureDone) {
                response.data.ProviderEncryptedSig = response.data.ProviderEncryptedSig || "";
                if (response.data.ProviderEncryptedSig != "") {
                    $scope.GetSignatureDeleteObj.ProviderSignature = true;
                    $scope.signPlusObj.ProviderSignString = response.data.ProviderEncryptedSig;
                    var canvasD = document.getElementById('doctorSigantureImg');
                    var contextD = canvasD.getContext('2d');
                    var imageD = new Image();
                    imageD.onload = function () {
                        /*   context.drawImage(image, 0, 0);*/
                        var centerXD = canvasD.width / 2 - imageD.width / 2;
                        var centerYD = canvasD.height / 2 - imageD.height / 2;
                        //contextD.drawImage(imageD, centerXD, centerYD);
                        contextD.drawImage(imageD, 0, 0, canvasD.width, canvasD.height);
                    };
                    imageD.src = response.data.ProviderEncryptedSig;
                }
            }

            if (response.data.IsCounselorSignatureDone) {
                response.data.CounselorEncryptedSig = response.data.CounselorEncryptedSig || "";
                if (response.data.CounselorEncryptedSig != "") {
                    $scope.GetSignatureDeleteObj.CounselorSignature = true;
                    $scope.signPlusObj.CounselorSignString = response.data.CounselorEncryptedSig;
                    var canvasC = document.getElementById('counselorSigantureImg');
                    var contextC = canvasC.getContext('2d');
                    var imageC = new Image();
                    imageC.onload = function () {
                        var centerXC = canvasC.width / 2 - imageC.width / 2;
                        var centerYC = canvasC.height / 2 - imageC.height / 2;
                        /*   contextC.drawImage(imageC, centerXC, centerYC);*/
                        contextC.drawImage(imageC, 0, 0, canvasC.width, canvasC.height);
                    };
                    imageC.src = response.data.CounselorEncryptedSig;
                }
            }

            if (response.data.IsAnesthesistSignatureDone) {
                response.data.AnesthesistEncryptedSig = response.data.AnesthesistEncryptedSig || "";
                if (response.data.AnesthesistEncryptedSig != "") {
                    $scope.GetSignatureDeleteObj.AnesthesistSignature = true;
                    $scope.signPlusObj.AnesthesistSignString = response.data.AnesthesistEncryptedSig;
                    var canvasA = document.getElementById('anesthesistSigantureImg');
                    var contextA = canvasA.getContext('2d');
                    var imageA = new Image();
                    imageA.onload = function () {
                        /*   context.drawImage(image, 0, 0);*/
                        var centerXA = canvasA.width / 2 - imageA.width / 2;
                        var centerYA = canvasA.height / 2 - imageA.height / 2;
                        /*    contextA.drawImage(imageA, centerXA, centerYA);*/
                        contextA.drawImage(imageA, 0, 0, canvasA.width, canvasA.height);
                    };
                    imageA.src = response.data.AnesthesistEncryptedSig;
                }
            }

            if (response.data.IsGaurdianSignatureDone) {
                response.data.GuardianEncryptedSig = response.data.GuardianEncryptedSig || "";
                //response.data.GuardianEncryptedSig = response.data.GaurdianSignString || "";
                if (response.data.GuardianEncryptedSig != "") {
                    $scope.GetSignatureDeleteObj.GaurdianSignature = true;
                    $scope.MainPatientSignedObj.IsGaurdianSignatureDone = true;
                    $scope.signPlusObj.GaurdianSignString = response.data.GuardianEncryptedSig;
                    var canvasG = document.getElementById('gaurdianSigantureImg');
                    var contextG = canvasG.getContext('2d');
                    var imageG = new Image();
                    imageG.onload = function () {
                        /*   context.drawImage(image, 0, 0);*/
                        var centerXA = canvasG.width / 2 - imageG.width / 2;
                        var centerYA = canvasG.height / 2 - imageG.height / 2;
                        /*    contextA.drawImage(imageA, centerXA, centerYA);*/
                        contextG.drawImage(imageG, 0, 0, canvasG.width, canvasG.height);
                    };
                    imageG.src = response.data.GuardianEncryptedSig;
                }
            }

            // Assign log information 
            $scope.LogObj.PatientEncryptedSig = response.data.PatientEncryptedSig || "";
            $scope.LogObj.PatientIntialEncryptedSig = response.data.PatientIntialEncryptedSig || "";
            $scope.LogObj.StaffEncryptedSig = response.data.StaffEncryptedSig || "";
            $scope.LogObj.CounselorEncryptedSig = response.data.CounselorEncryptedSig || "";
            $scope.LogObj.AnesthesistEncryptedSig = response.data.AnesthesistEncryptedSig || "";
            $scope.LogObj.GuardianEncryptedSig = response.data.GuardianEncryptedSig || "";
            $scope.LogObj.ProviderEncryptedSig = response.data.ProviderEncryptedSig || "";

        }, function (err) {
            console.log(err);
        });
    }


    $scope.consentsMainObj = {
        "OrganizationConsents": [],
        "PatientConsents": [],
        "MainConsents": [],
        "SelectedConsentTemplateId": 0,
        "SelectedConsentFormId": 0
    };

    $scope.SignMainObj = {
        "ProviderClearbutton": true,
        "StaffClearbutton": true,
        "CounselorClearbutton": true,
        "AnesthesistClearbutton": true,

    };

    $scope.consentsMainObj.SelectedConsentFormId = $scope.ParentObject.selectedObj.ConsentFormId || 0;
    $scope.GetPatientAppointmentConsentsById = function () {
        $scope.consentsMainObj.MainConsents = [];
        $scope.consentsMainObj.OrganizationConsents = [];
        $scope.consentsMainObj.PatientConsents = [];

        console.log($scope.selectedPatientSurgeryObj.PreAdmissionAppointmentId);
        console.log($scope.selectedPatientSurgeryObj.VisitTypeId);



        var serviceTypeId = $scope.selectedPatientSurgeryObj.VisitTypeId || 0;
        var ApptType = "";
        if ($scope.ParentObject.mainitem.AppointmentTypeId === 7) {
            serviceTypeId = 0;
            ApptType = "PreOp";
        }

        var obj = {
            /*"OrganizationId": $scope.HospitalId,*/
            "OrganizationId": $scope.ParentObject.ApptHospitalId,
            "AppointmentId": $scope.AppointmentId || 0,
            "PatientId": $scope.PatientId,
            "ServiceTypeId": serviceTypeId,
            "AppointmentType": ApptType,
            "VisitId": $scope.VisitId,
        };

        eHnoteSettingsDataService.GetPatientAppointmentConsentsById(obj).then(function (resp) {


            $scope.Isbulksignofdone = resp.data.Isbulksignofdone || false;
            $scope.IsAnesthesiabulksignofdone = resp.data.IsAnesthesiabulksignofdone || false;
            $scope.ConsentAnesthesistEncryptedSig = resp.data.AnesthesistEncryptedSig || false;
            $scope.ConsentAnesthesiaId = resp.data.AnesthesiaId || 0;
            $scope.admissiondatetime = resp.data.Admissiondatetime || null;


            $scope.IsshowBulkSignrefreshButton = false;
            resp.data.OrganizationConsents = resp.data.OrganizationConsents || [];
            if (resp.data.OrganizationConsents.length > 0) {
                $scope.consentsMainObj.OrganizationConsents = resp.data.OrganizationConsents;
                angular.forEach($scope.consentsMainObj.OrganizationConsents, function (oitem) {
                    oitem.isConsentAddedForPatient = false;
                });
            }
            resp.data.PatientAppointmentConsents = resp.data.PatientAppointmentConsents || [];

            // Remove Button showing based on Userlogin and Create
            if (resp.data.PatientAppointmentConsents.length > 0) {
                if (($scope.ParentObject.UserId == resp.data.PatientAppointmentConsents[0].ProviderUserId) || ($scope.ParentObject.UserId == resp.data.PatientAppointmentConsents[0].ProviderSignCaptureUserId)) {
                    $scope.SignMainObj.ProviderClearbutton = false;
                } else {
                    $scope.SignMainObj.ProviderClearbutton = true;
                }
                if (($scope.ParentObject.UserId == resp.data.PatientAppointmentConsents[0].StaffUserId) || ($scope.ParentObject.UserId == resp.data.PatientAppointmentConsents[0].StaffSignCaptureUserId)) {
                    $scope.SignMainObj.StaffClearbutton = false;
                } else {
                    $scope.SignMainObj.StaffClearbutton = true;
                }

                if (($scope.ParentObject.UserId == resp.data.PatientAppointmentConsents[0].CounselorUserId) || ($scope.ParentObject.UserId == resp.data.PatientAppointmentConsents[0].CounselorSignCaptureUserId)) {
                    $scope.SignMainObj.CounselorClearbutton = false;
                } else {
                    $scope.SignMainObj.CounselorClearbutton = true;
                }

                if (($scope.ParentObject.UserId == resp.data.PatientAppointmentConsents[0].AnesthesistUserId) || ($scope.ParentObject.UserId == resp.data.PatientAppointmentConsents[0].AnesthesistSignCaptureUserId)) {
                    $scope.SignMainObj.AnesthesistClearbutton = false;
                } else {
                    $scope.SignMainObj.AnesthesistClearbutton = true;
                }
            }
            var filteredArray = $filter("filter")($scope.consentsMainObj.OrganizationConsents, { "IsPrimary": "Y" }, true);
            if (resp.data.PatientAppointmentConsents.length > 0) {
                $scope.consentsMainObj.PatientConsents = resp.data.PatientAppointmentConsents;
                $scope.consentsMainObj.SelectedConsentTemplateId = $scope.consentsMainObj.PatientConsents[0].ConsentTemplateId || 0;
                if ($scope.consentsMainObj.SelectedConsentTemplateId === 0) {
                    if (filteredArray.length > 0) {
                        $scope.consentsMainObj.SelectedConsentTemplateId = filteredArray[0].ConsentTemplateId;
                    }
                }
                reformAppointmentConsentsandOrgConsents($scope.consentsMainObj.SelectedConsentTemplateId);
            } else {

                if (filteredArray.length > 0) {
                    if ($scope.ParentObject.selectedObj == '') {
                        $scope.consentsMainObj.SelectedConsentTemplateId = filteredArray[0].ConsentTemplateId;
                    } else {
                        $scope.consentsMainObj.SelectedConsentTemplateId = $scope.ParentObject.selectedObj.ConsentTemplateId || 0;
                    }
                    reformAppointmentConsentsandOrgConsents($scope.consentsMainObj.SelectedConsentTemplateId);
                }
            }



        }, function (err) {
            console.log(err);
        });
    }
    function getnewMainConsentObj() {
        var obj = {
            "PatientConsentFormId": 0,
            "IsPartiallySaved": false,
            "HTMLContent": "",
            "S3URL": "",
            "ConsentFormId": 0,
            "ConsentFormName": "",
            "ConsentTemplateId": 0,
            "ConsentTypeId": 0,
            "ConsentTypeName": "",
            "PDFcontent": "",
            "IsPatientSignRequired": false,
            "IsDoctorSignRequired": false,
            "IsAnesthesistSignRequired": false,
            "IsCounselorSignRequired": false,
            "IsStaffSignRequired": false,
            "IsGuardianSignRequired": false,
            "IsSignRequiredForEachVisit": false,
            "IsPatientSignatureDone": "",
            "IsProviderSignatureDone": "",
            "ProviderUserId": 0,
            "ProviderUserName": "",
            "IsStaffSignatureDone": "",
            "StaffUserId": 0,
            "StaffUserName": "",
            "IsCounselorSignatureDone": "",
            "CounselorUserId": 0,
            "CounselorUserName": "",
            "IsAnesthesistSignatureDone": "",
            "AnesthesistUserId": 0,
            "AnesthesistUserName": "",
            "IsGaurdianSignatureDone": "",
            "GaurdianUserId": 0,
            "GaurdianFirstName": "",
            "GaurdianLastName": "",
            "GaurdianRelationShipId": "",
            "PatientClass": "disabled",
            "ProviderClass": "disabled",
            "StaffClass": "disabled",
            "AnesthesistClass": "disabled",
            "CounselorClass": "disabled",
            "GaurdianClass": "disabled",
            "IsSelected": false
        };
        return obj;
    }
    function reformAppointmentConsentsandOrgConsents(consentTemplateId) {
        $scope.consentsMainObj.MainConsents = [];


        $scope.MainPatientSignedObj.ConsentTemplateId = consentTemplateId;
        var filteredOrgConsentTemplateArray = $filter("filter")($scope.consentsMainObj.OrganizationConsents, { "ConsentTemplateId": consentTemplateId }, true);
        if (filteredOrgConsentTemplateArray.length > 0) {


            if ($scope.consentsMainObj.PatientConsents.length === 0) {
                angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (oitem) {
                    var obj = getnewMainConsentObj();
                    obj.ConsentFormId = oitem.OrganisationConsentFormId;
                    obj.ConsentFormName = oitem.DocumentName;
                    obj.ConsentTemplateId = oitem.ConsentTemplateId;
                    obj.ConsentTypeId = oitem.ConsentTypeId;
                    obj.ConsentTypeName = oitem.ConsentTypeName;
                    obj.PDFcontent = oitem.PDFcontent || "";
                    obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                    obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                    obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                    obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                    obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                    obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                    obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                    obj.IsPatientSignatureDone = false;
                    obj.IsProviderSignatureDone = false;
                    obj.ProviderUserId = 0;
                    obj.ProviderUserName = "";
                    obj.IsStaffSignatureDone = false;
                    obj.StaffUserId = 0;
                    obj.StaffUserName = "";
                    obj.IsCounselorSignatureDone = false;
                    obj.CounselorUserId = 0;
                    obj.CounselorUserName = "";
                    obj.IsAnesthesistSignatureDone = false;
                    obj.AnesthesistUserId = 0;
                    obj.AnesthesistUserName = "";
                    obj.IsGaurdianSignatureDone = false;
                    obj.GaurdianUserId = 0;
                    obj.GaurdianFirstName = "";
                    obj.GaurdianLastName = "";
                    obj.GaurdianRelationShipId = "";
                    obj.IsSelected = true;
                    $scope.consentsMainObj.MainConsents.push(obj);
                });
            }
            else {
                angular.forEach($scope.consentsMainObj.PatientConsents, function (item1) {
                    if (filteredOrgConsentTemplateArray[0].ConsentTemplateDetails.length > 0) {
                        angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (item2) {
                            if (item1.ConsentFormId === item2.OrganisationConsentFormId) {
                                item2.isConsentAddedForPatient = true;
                            }
                        });
                    }

                });


                angular.forEach($scope.consentsMainObj.PatientConsents, function (oitem) {
                    var obj = getnewMainConsentObj();
                    obj.PatientConsentFormId = oitem.PatientConsentDocumentId || 0;
                    obj.PatientConsentDocumentId = oitem.PatientConsentDocumentId || 0;
                    obj.ConsentFormId = oitem.ConsentFormId;
                    obj.ConsentFormName = oitem.ConsentFormName;
                    obj.ConsentTemplateId = consentTemplateId;
                    obj.ConsentTypeId = oitem.ConsentTypeId;
                    obj.ConsentTypeName = oitem.ConsentTypeName;
                    obj.HTMLContent = oitem.HTMLContent;
                    obj.S3URL = oitem.S3URL;
                    obj.PDFcontent = oitem.HTMLContent;
                    obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                    obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                    obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                    obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                    obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                    obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                    obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                    obj.IsPatientSignatureDone = oitem.IsPatientSignatureDone;
                    obj.IsProviderSignatureDone = oitem.IsProviderSignatureDone;
                    obj.ProviderUserId = oitem.ProviderUserId || 0;
                    obj.ProviderUserName = oitem.ProviderUserName || "";
                    obj.IsStaffSignatureDone = oitem.IsStaffSignatureDone;
                    obj.StaffUserId = oitem.StaffUserId || 0;
                    obj.StaffUserName = oitem.StaffUserName || "";
                    obj.IsCounselorSignatureDone = oitem.IsCounselorSignatureDone;
                    obj.CounselorUserId = oitem.CounselorUserId || 0;
                    obj.CounselorUserName = oitem.CounselorUserName || "";
                    obj.IsAnesthesistSignatureDone = oitem.IsAnesthesistSignatureDone;
                    obj.AnesthesistUserId = oitem.AnesthesistUserId || 0;
                    obj.AnesthesistUserName = oitem.AnesthesistUserName;
                    obj.IsGaurdianSignatureDone = oitem.IsGaurdianSignatureDone;
                    obj.GaurdianUserId = oitem.GaurdianUserId;
                    obj.GaurdianFirstName = oitem.GaurdianFirstName || "";
                    obj.GaurdianLastName = oitem.GaurdianLastName || "";
                    obj.GaurdianRelationShipId = oitem.GaurdianRelationShipId || 0;
                    obj.IsScannedDocument = oitem.IsScannedDocument;
                    obj.AppointmentId = oitem.AppointmentId;
                    obj.PatientId = oitem.PatientId;
                    obj.DocumentName = oitem.DocumentName;
                    obj.DeleteInd = oitem.DeleteInd || 'Y';
                    obj.IsSelected = true;
                    obj.PatientSignedDateTime = oitem.PatientSignedDateTime || "";
                    obj.ProviderSignedDateTime = oitem.ProviderSignedDateTime || "";
                    obj.StaffSignedDateTime = oitem.StaffSignedDateTime || "";
                    obj.CounselorSignedDateTime = oitem.CounselorSignedDateTime || "";
                    obj.AnesthesistSignedDateTime = oitem.AnesthesistSignedDateTime || "";
                    obj.GaurdianSignedDateTime = oitem.GaurdianSignedDateTime || "";
                    obj.PatientSignCaptureUserId = oitem.PatientSignCaptureUserId || 0;
                    obj.ProviderSignCaptureUserId = oitem.ProviderSignCaptureUserId || 0;
                    obj.StaffSignCaptureUserId = oitem.StaffSignCaptureUserId || 0;
                    obj.CounselorSignCaptureUserId = oitem.CounselorSignCaptureUserId || 0;
                    obj.AnesthesistSignCaptureUserId = oitem.AnesthesistSignCaptureUserId || 0;
                    obj.GaurdianSignCaptureUserId = oitem.GaurdianSignCaptureUserId || 0;
                    obj.IsConsentFormExpired = oitem.IsConsentFormExpired || false;
                    obj.IsExpiredtoNewConsent = oitem.IsExpiredtoNewConsent || false;
                    $scope.consentsMainObj.MainConsents.push(obj);
                });

                angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (oitem) {
                    if (!oitem.isConsentAddedForPatient) {
                        var obj = getnewMainConsentObj();
                        obj.ConsentFormId = oitem.OrganisationConsentFormId;
                        obj.ConsentFormName = oitem.DocumentName;
                        obj.ConsentTemplateId = oitem.ConsentTemplateId;
                        obj.ConsentTypeId = oitem.ConsentTypeId;
                        obj.ConsentTypeName = oitem.ConsentTypeName;
                        obj.PDFcontent = oitem.PDFcontent;
                        obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                        obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                        obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                        obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                        obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                        obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                        obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                        obj.IsPatientSignatureDone = false;
                        obj.IsProviderSignatureDone = false;
                        obj.ProviderUserId = 0;
                        obj.ProviderUserName = "";
                        obj.IsStaffSignatureDone = false;
                        obj.StaffUserId = 0;
                        obj.StaffUserName = "";
                        obj.IsCounselorSignatureDone = false;
                        obj.CounselorUserId = 0;
                        obj.CounselorUserName = "";
                        obj.IsAnesthesistSignatureDone = false;
                        obj.AnesthesistUserId = 0;
                        obj.AnesthesistUserName = "";
                        obj.IsGaurdianSignatureDone = false;
                        obj.GaurdianUserId = 0;
                        obj.GaurdianFirstName = "";
                        obj.GaurdianLastName = "";
                        obj.GaurdianRelationShipId = "";
                        obj.IsScannedDocument = false;
                        obj.IsSelected = true;
                        $scope.consentsMainObj.MainConsents.push(obj);
                    }

                });
            }


            angular.forEach($scope.consentsMainObj.MainConsents, function (item) {




                if (!item.IsPatientSignRequired) {
                    item.PatientClass = 'disabled';
                } else {
                    if (item.IsPatientSignatureDone) {
                        item.PatientClass = 'complete';
                    } else {
                        item.PatientClass = 'incomplete';
                    }
                }


                if (!item.IsDoctorSignRequired) {
                    item.ProviderClass = 'disabled';
                } else {
                    if (item.IsProviderSignatureDone) {
                        item.ProviderClass = 'complete';
                    } else {
                        item.ProviderClass = 'incomplete';
                    }
                }


                if (!item.IsStaffSignRequired) {
                    item.StaffClass = 'disabled';
                } else {
                    if (item.IsStaffSignatureDone) {
                        item.StaffClass = 'complete';
                    } else {
                        item.StaffClass = 'incomplete';
                    }
                }



                if (!item.IsGuardianSignRequired) {
                    item.GaurdianClass = 'disabled';
                } else {
                    if (item.IsGaurdianSignatureDone) {
                        item.GaurdianClass = 'complete';
                    } else {
                        item.GaurdianClass = 'incomplete';
                    }
                }


                if (!item.IsAnesthesistSignRequired) {
                    item.AnesthesistClass = 'disabled';
                } else {
                    if (item.IsAnesthesistSignatureDone) {
                        item.AnesthesistClass = 'complete';
                    } else {
                        item.AnesthesistClass = 'incomplete';
                    }
                }


                if (!item.IsCounselorSignRequired) {
                    item.CounselorClass = 'disabled';
                } else {
                    if (item.IsCounselorSignatureDone) {
                        item.CounselorClass = 'complete';
                    } else {
                        item.CounselorClass = 'incomplete';
                    }
                }

                item.CanBulksignconsent = item.ProviderClass == 'incomplete' || item.AnesthesistClass == 'incomplete';
                //&&
                if (item.CanBulksignconsent && $scope.admissiondatetime) {
                    $scope.IsshowBulkSignrefreshButton = true;
                }
            });
        }



        var selectedArray = [], selectedObj = "";



        $scope.PatientAppointmentConsentForms = [];
        angular.forEach($scope.consentsMainObj.MainConsents, function (sitem, index) {

            sitem.CanShowPrintButton =(sitem.PatientConsentFormId > 0 &&sitem.ProviderClass !== 'incomplete' &&sitem.StaffClass !== 'incomplete'  &&sitem.AnesthesistClass !== 'incomplete' &&( sitem.PatientClass !== 'incomplete' ||sitem.GaurdianClass !== 'incomplete')) ||(sitem.S3URL && sitem.S3URL.trim() !== '');
            var pobj = {
                "PatientConsentFormId": sitem.PatientConsentFormId || 0,
                "OrganizationConsentFormId": sitem.ConsentFormId,
                "ConsentFormName": sitem.ConsentFormName,
                "ConsentTypeId": sitem.ConsentTypeId,
                "ConsentTypeName": sitem.ConsentTypeName,
                "PdfContent": sitem.PDFcontent,
                "S3URL": sitem.S3URL,
                "IsActive": false,
                "PatientClass": sitem.PatientClass,
                "ProviderClass": sitem.ProviderClass,
                "StaffClass": sitem.StaffClass,
                "AnesthesistClass": sitem.AnesthesistClass,
                "CounselorClass": sitem.CounselorClass,
                "GaurdianClass": sitem.GaurdianClass,
                "IsConsentFormExpired": sitem.IsConsentFormExpired || false,
                "IsExpiredtoNewConsent": sitem.IsExpiredtoNewConsent || false,
                "CanShowPrintButton": sitem.CanShowPrintButton || false,
                "IsPatientSignRequired" :sitem.IsPatientSignRequired,
                "IsDoctorSignRequired" :sitem.IsDoctorSignRequired,
                "IsAnesthesistSignRequired" :sitem.IsAnesthesistSignRequired,
                "IsCounselorSignRequired" :sitem.IsCounselorSignRequired,
                "IsStaffSignRequired" : sitem.IsStaffSignRequired,
                "IsGuardianSignRequired" : sitem.IsGuardianSignRequired,
            };
            if (index == 0) {
                pobj.IsActive = true;
            }
            $scope.PatientAppointmentConsentForms.push(pobj);
        });


        var filteredArray = $filter("filter")($scope.consentsMainObj.MainConsents, { "ConsentFormId": $scope.consentsMainObj.SelectedConsentFormId }, true);
        if (filteredArray.length > 0) {
            $scope.onSelectApptConsentFormNew(filteredArray[0]);
            angular.forEach($scope.PatientAppointmentConsentForms, function (mitem) {
                mitem.IsActive = false;
                if (mitem.OrganizationConsentFormId === filteredArray[0].ConsentFormId) {
                    mitem.IsActive = true;
                }


            });
        } else {
            $scope.onSelectApptConsentFormNew($scope.consentsMainObj.MainConsents[0]);
        }

    }



    $scope.switchToPatientConsent = function (ptno) {
        $scope.PatientConsentTab = ptno;

        if ($scope.PatientConsentTab === 1) {
            $scope.getPatientSignedConsentDocuments();
        }
        if ($scope.PatientConsentTab === 2) {
            $scope.PatientAppointmentConsentForms = [];
            if ($scope.ParentObject.Page == "PreOp") {
                $scope.GetPatientAppointmentConsentsById();
            } else {
                $scope.GetPatientAppointmentConsentsById();
            }
        }

        if ($scope.PatientConsentTab === 3) {
            $scope.GetPatientAppointmentConsentsById();
        }
    };


    $scope.editorToolbarPatientButtonConfig = [];
    /*$scope.editorToolbarPatientTemplateConfig = [["html"]];*/

    $scope.selectedPatientConsentObj = {
        "HtmlContent": "",
        "pdfDocument": ""
    }
    $scope.selectedPatientTempConsentObj = {
        "HtmlContent": ""
    };

    $scope.signaturesTab = {
        "Patient": true,
        "Staff": true,
        "Provider": true,
        "Anesthesist": true,
        "Counselor": true,
        "Gaurdian": true,
        "activeSigatureTab": 1
    };

    //$scope.signaturesTab.activeSigatureTab = 1;
    $scope.switchSignatureTab = function (tabono) {
        $scope.signaturesTab.activeSigatureTab = tabono;
    };

    var tmr; var resetIsSupported = false;


    function addnewsignPlusObj() {
        var obj = {
            "PatientConsentDocumentId": 0,
            "patientreadyToSign": false,
            "staffreadyToSign": false,
            "providerreadyToSign": false,
            "counselorreadyToSign": false,
            "anesthesistreadyToSign": false,
            "gaurdianreadyToSign": false,
            "PatientSignBy": "Drawing",
            "DoctorSignBy": "Drawing",
            "StaffSignBy": "Drawing",
            "CounselorSignBy": "Drawing",
            "AnesthesistSignBy": "Drawing",
            "GaurdianSignBy": "Drawing",
            "PatientSignString": "",
            "StaffSignString": "",
            "StaffUserId": "",
            "StaffUserObj": "",
            "ProviderSignString": "",
            "ProviderUserId": "",
            "ProviderUserObj": "",
            "CounselorSignString": "",
            "CounselorUserId": "",
            "CounselorUserObj": "",
            "AnesthesistSignString": "",
            "AnesthesistUserId": "",
            "AnesthesistUserObj": "",
            "GaurdianSignString": "",
            "GaurdianUserObj": "",
            "GaurdianUserId": "",
            "GaurdianFirstName": "",
            "GaurdianLastName": "",
            "GaurdianRelationShipId": "",
            "PatientName": $scope.PatientName,
            "IsPatientDigitalSignTaken": false,
            "IsStaffDigitalSignTaken": false,
            "IsProviderDigitalSignTaken": false,
            "IsCounselorDigitalSignTaken": false,
            "IsAnesthesistDigitalSignTaken": false,
            "IsGaurdianDigitalSignTaken": false,
            "PatientSignedDateTime": "",
            "ProviderSignedDateTime": "",
            "StaffSignedDateTime": "",
            "CounselorSignedDateTime": "",
            "AnesthesistSignedDateTime": "",
            "GaurdianSignedDateTime": "",
            "PatientIntialSignString": "",
            "ShowPatientCanvas": true,
            "ShowPatientInitialCanvas": false,
            "ValidatePassword": "",
            "StaffValidate": false,
            "ProviderValidate": false,
            "CounselorValidate": false,
            "AnesthesistValidate": false,
        };
        return obj;
    }
    $scope.signPlusObj = addnewsignPlusObj();

    function restructureMainPatientSIgnObj(selectedObj) {
        $scope.MainPatientSignedObj.ConsentFormId = selectedObj.ConsentFormId;
        $scope.MainPatientSignedObj.ConsentFormName = selectedObj.ConsentFormName || '';
        $scope.MainPatientSignedObj.PatientConsentDocumentId = selectedObj.PatientConsentFormId;
        $scope.MainPatientSignedObj.IsPatientSignatureDone = selectedObj.IsPatientSignatureDone;
        $scope.MainPatientSignedObj.IsProviderSignatureDone = selectedObj.IsProviderSignatureDone;
        $scope.MainPatientSignedObj.IsAnesthesistSignatureDone = selectedObj.IsAnesthesistSignatureDone;
        $scope.MainPatientSignedObj.IsCounselorSignatureDone = selectedObj.IsCounselorSignatureDone;
        $scope.MainPatientSignedObj.IsStaffSignatureDone = selectedObj.IsStaffSignatureDone;
        $scope.signPlusObj.PatientConsentDocumentId = $scope.MainPatientSignedObj.PatientConsentDocumentId || 0;
        $scope.signPlusObj.StaffUserId = selectedObj.StaffUserId || 0;
        $scope.signPlusObj.StaffUserObj = selectedObj.StaffUserName || "";
        $scope.MainPatientSignedObj.StaffUserId = selectedObj.StaffUserId || 0;
        $scope.MainPatientSignedObj.ProviderUserId = selectedObj.ProviderUserId || 0;
        $scope.signPlusObj.ProviderUserId = selectedObj.ProviderUserId || 0;
        $scope.signPlusObj.ProviderUserObj = selectedObj.ProviderUserName || "";
        $scope.signPlusObj.CounselorUserId = selectedObj.CounselorUserId || 0;
        $scope.MainPatientSignedObj.CounselorUserId = selectedObj.CounselorUserId || 0;
        $scope.signPlusObj.CounselorUserObj = selectedObj.CounselorUserName || "";
        $scope.signPlusObj.AnesthesistUserId = selectedObj.AnesthesistUserId || 0;
        $scope.MainPatientSignedObj.AnesthesistUserId = selectedObj.AnesthesistUserId || 0;
        $scope.signPlusObj.AnesthesistUserObj = selectedObj.AnesthesistUserName || "";
        $scope.signPlusObj.IsPatientDigitalSignTaken = $scope.MainPatientSignedObj.IsPatientSignatureDone;
        $scope.signPlusObj.IsProviderDigitalSignTaken = $scope.MainPatientSignedObj.IsProviderSignatureDone;
        $scope.signPlusObj.IsStaffDigitalSignTaken = $scope.MainPatientSignedObj.IsStaffSignatureDone;
        $scope.signPlusObj.IsAnesthesistDigitalSignTaken = $scope.MainPatientSignedObj.IsAnesthesistSignatureDone;
        $scope.signPlusObj.IsCounselorDigitalSignTaken = $scope.MainPatientSignedObj.IsCounselorSignatureDone;

        $scope.signPlusObj.GaurdianFirstName = selectedObj.GaurdianFirstName || "";
        $scope.signPlusObj.GaurdianLastName = selectedObj.GaurdianLastName || "";
        $scope.signPlusObj.GaurdianRelationShipId = selectedObj.GaurdianRelationShipId || "";

        $scope.MainPatientSignedObj.GaurdianFirstName = selectedObj.GaurdianFirstName || "";
        $scope.MainPatientSignedObj.GaurdianLastName = selectedObj.GaurdianLastName || "";
        $scope.MainPatientSignedObj.GaurdianRelationShipId = selectedObj.GaurdianRelationShipId || "";

        $scope.getPatientConsendDocSigs($scope.ParentObject.PatientId, $scope.MainPatientSignedObj.PatientConsentDocumentId);
        $scope.selectedPatientTempConsentObj.HtmlContent = selectedObj.PDFcontent;

        $scope.MainPatientSignedObj.IsPatientSignRequired = selectedObj.IsPatientSignRequired || false;
        $scope.MainPatientSignedObj.IsStaffSignRequired = selectedObj.IsStaffSignRequired || false;
        $scope.MainPatientSignedObj.IsCounselorSignRequired = selectedObj.IsCounselorSignRequired || false;
        $scope.MainPatientSignedObj.IsDoctorSignRequired = selectedObj.IsDoctorSignRequired || false;
        $scope.MainPatientSignedObj.IsAnesthesistSignRequired = selectedObj.IsAnesthesistSignRequired || false;
        $scope.MainPatientSignedObj.IsGuardianSignRequired = selectedObj.IsGuardianSignRequired || false;

        console.log($scope.selectedPatientTempConsentObj.HtmlContent);
        setTimeout(attachHeaderKeyGuard, 300);
        console.log("pdfcontent");
        if (selectedObj.IsPatientSignRequired) {
            $scope.signaturesTab.Patient = true;
        }
        if (selectedObj.IsStaffSignRequired) {
            $scope.signaturesTab.Staff = true;
        }
        if (selectedObj.IsDoctorSignRequired) {
            $scope.signaturesTab.Provider = true;
        }
        if (selectedObj.IsAnesthesistSignRequired) {
            $scope.signaturesTab.Anesthesist = true;
        }
        if (selectedObj.IsCounselorSignRequired) {
            $scope.signaturesTab.Counselor = true;
        }
        if (selectedObj.IsGuardianSignRequired) {
            $scope.signaturesTab.Gaurdian = true;
        }


        if (selectedObj.PatientSignedDateTime !== null) {
            $scope.MainPatientSignedObj.PatientSignedDateTime = $filter('date')(selectedObj.PatientSignedDateTime, "MM-dd-yyyy hh:mm a");
            $scope.MainPatientSignedObj.PatientSignCaptureUserId = selectedObj.PatientSignCaptureUserId;
        }
        if (selectedObj.ProviderSignedDateTime !== null) {
            $scope.MainPatientSignedObj.ProviderSignedDateTime = $filter('date')(selectedObj.ProviderSignedDateTime, "MM-dd-yyyy hh:mm a");
            $scope.MainPatientSignedObj.ProviderSignCaptureUserId = selectedObj.ProviderSignCaptureUserId;
        }

        if (selectedObj.CounselorSignedDateTime !== null) {
            $scope.MainPatientSignedObj.CounselorSignedDateTime = $filter('date')(selectedObj.CounselorSignedDateTime, "MM-dd-yyyy hh:mm a");
            $scope.MainPatientSignedObj.CounselorSignCaptureUserId = selectedObj.CounselorSignCaptureUserId;
        }

        if (selectedObj.AnesthesistSignedDateTime !== null) {
            $scope.MainPatientSignedObj.AnesthesistSignedDateTime = $filter('date')(selectedObj.AnesthesistSignedDateTime, "MM-dd-yyyy hh:mm a");
            $scope.MainPatientSignedObj.AnesthesistSignCaptureUserId = selectedObj.AnesthesistSignCaptureUserId;
        }
        if (selectedObj.StaffSignedDateTime !== null) {
            $scope.MainPatientSignedObj.StaffSignedDateTime = $filter('date')(selectedObj.StaffSignedDateTime, "MM-dd-yyyy hh:mm a");
            $scope.MainPatientSignedObj.StaffSignCaptureUserId = selectedObj.StaffSignCaptureUserId;
        }

        if (selectedObj.GaurdianSignedDateTime !== null) {
            $scope.MainPatientSignedObj.GaurdianSignedDateTime = $filter('date')(selectedObj.GaurdianSignedDateTime, "MM-dd-yyyy hh:mm a");
            $scope.MainPatientSignedObj.GaurdianSignCaptureUserId = selectedObj.GaurdianSignCaptureUserId;
        }

        FillPatientConsentDetails();
    }

    if ($scope.ParentObject.Page == 'Sign') {
        $scope.PatientConsentTab = 2;
        $scope.Documentobj.SubType = 'Patient';
        $scope.AppointmentId = $scope.ParentObject.AppointmentId;
        $scope.MainPatientSignedObj.PatientId = $scope.ParentObject.PatientId;
        $scope.MainPatientSignedObj.AppointmentId = $scope.ParentObject.AppointmentId;
        $scope.MainPatientSignedObj.ConsentTemplateId = $scope.ParentObject.ConsentTemplateId;
        $scope.ParentObject.mainitem.AppointmentDetails = $scope.ParentObject.mainitem.AppointmentDetails || [];
        if ($scope.ParentObject.mainitem.AppointmentDetails.length > 0) {
            $scope.AppointmentTypeId = $scope.ParentObject.mainitem.AppointmentDetails[0].AppointmentTypeId;
        }

        $scope.selectedPatientTempConsentObj.HtmlContent = "";
        if ($scope.ParentObject.selectedArray.length > 0) {
            angular.forEach($scope.ParentObject.selectedArray, function (sitem) {
                var pobj = {
                    "PatientConsentFormId": 0,
                    "OrganizationConsentFormId": sitem.ConsentFormId,
                    "ConsentFormName": sitem.ConsentFormName,
                    "ConsentTypeId": sitem.ConsentTypeId,
                    "ConsentTypeName": sitem.ConsentTypeName,
                    "PdfContent": sitem.PDFcontent,
                    "IsActive": false
                };
                $scope.PatientAppointmentConsentForms.push(pobj);
            });
        } else {
            var pobj = {
                "PatientConsentFormId": 0,
                "OrganizationConsentFormId": $scope.ParentObject.selectedObj.ConsentFormId,
                "ConsentFormName": $scope.ParentObject.selectedObj.ConsentFormName,
                "ConsentTypeId": $scope.ParentObject.selectedObj.ConsentTypeId,
                "ConsentTypeName": $scope.ParentObject.selectedObj.ConsentTypeName,
                "PdfContent": $scope.ParentObject.selectedObj.PDFcontent,
                "IsActive": false
            };
            $scope.PatientAppointmentConsentForms.push(pobj);
        }

        $scope.GetPatientAppointmentConsentsById();

        restructureMainPatientSIgnObj($scope.ParentObject.selectedObj);


    }
    else if ($scope.ParentObject.Page == "PreOp") {
        $scope.PatientConsentTab = 2;
        $scope.AppointmentTypeId = $scope.ParentObject.mainitem.AppointmentTypeId;
        $scope.GetPatientAppointmentConsentsById();
    }
    else {
        $scope.PatientConsentTab = 1;
        $scope.AppointmentTypeId = $scope.ParentObject.mainitem.AppointmentTypeId;
        $scope.getPatientSignedConsentDocuments();
        $scope.signaturesTab.Patient = true;
        $scope.signaturesTab.Staff = true;
        $scope.signaturesTab.Provider = true;
        $scope.signaturesTab.Anesthesist = true;
        $scope.signaturesTab.Counselor = true;
        $scope.signaturesTab.Gaurdian = true;
    }




    $scope.closeuibdoc = function () {
        $uibModalInstance.close($scope.consentsMainObj);
    };


    $rootScope.$on("selectedDocumentConsentobj", function (event, data) {
        console.log(data);
        $scope.Documentobj.SubType = 'Patient';
        $scope.PatientConsentTab = 2;
        $scope.selectedPatientTempConsentObj.HtmlContent = "";
        var pobj = {
            "OrganizationConsentFormId": data.ConsentFormId,
            "ConsentFormName": data.DocumentName,
            "ConsentTypeId": data.ConsentTypeId,
            "ConsentTypeName": data.ConsentTypeName,
            "PdfContent": data.PDFcontent,
            "IsActive": false
        };

        $scope.MainPatientSignedObj.ConsentFormId = data.ConsentFormId;
        $scope.selectedPatientTempConsentObj.HtmlContent = data.PDFcontent;
        $scope.PatientAppointmentConsentForms.push(pobj);
        setTimeout(attachHeaderKeyGuard, 300);
    });



    $rootScope.$on("selectedMultipleConsentsObj", function (event, data) {
        console.log(data);


        $scope.outPutObj = data;

        if ($scope.outPutObj.selectedArray.length > 0) {
            $scope.selectedPatientTempConsentObj.HtmlContent = "";

            angular.forEach($scope.outPutObj.selectedArray, function (sitem) {
                var pobj = {
                    "OrganizationConsentFormId": sitem.ConsentFormId,
                    "ConsentFormName": sitem.DocumentName,
                    "ConsentTypeId": sitem.ConsentTypeId,
                    "ConsentTypeName": sitem.ConsentTypeName,
                    "PdfContent": sitem.PDFcontent,
                    "IsActive": false
                };
                $scope.PatientAppointmentConsentForms.push(pobj);
            });

            $scope.MainPatientSignedObj.ConsentFormId = $scope.outPutObj.selectedObj.ConsentFormId;
            $scope.selectedPatientTempConsentObj.HtmlContent = $scope.outPutObj.selectedObj.PDFcontent;
            setTimeout(attachHeaderKeyGuard, 300);
        }
        $scope.Documentobj.SubType = 'Patient';
        $scope.PatientConsentTab = 2;

        //var pobj = {
        //    "OrganizationConsentFormId": data.ConsentFormId,
        //    "ConsentFormName": data.DocumentName,
        //    "ConsentTypeId": data.ConsentTypeId,
        //    "ConsentTypeName": data.ConsentTypeName,
        //    "PdfContent": data.PDFcontent,
        //    "IsActive": false
        //};



    });


    $scope.addSigatureoftheUser = function () {

        var obj = {
            "PatientId": $scope.PatientId,
            "PatientName": $scope.PatientName,
            "signPlusObj": $scope.signPlusObj
        }
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "addsignatuurepopovertemplatenew.html",
            "backdrop": "static",
            "scope": $scope,
            "size": "lg",
            "resolve": {
                "mainObject": function () { return obj; },
                "RoleId": function () { return $scope.RoleId; }
            },
            //"windowClass": "zindexpopupConsentSign  ", /*z- index - eight__one*/
            "keyboard": false,
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, mainObject, RoleId) {

                $scope.mainObject = mainObject || '';
                $scope.RoleId = RoleId;
               

                // Role Based Disable sign Pad
                $scope.signPlusObj.PatientSignCanvasDisable = true;
                $scope.signPlusObj.PatientGaurdianCanvasDisable = true;
                $scope.signPlusObj.ProviderCanvasDisable = true;
                $scope.signPlusObj.CounselorCanvasDisable = true;
                $scope.signPlusObj.StaffCanvasDisable = true;
                $scope.signPlusObj.AnesthesistCanvasDisable = true;

                if ($scope.RoleId == 1 || $scope.RoleId == 43) {

                    $scope.signPlusObj.ProviderCanvasDisable = false;

                }
                if ($scope.RoleId == 8 || $scope.RoleId == 10|| $scope.RoleId == 18 || $scope.RoleId == 66 || $scope.RoleId == 67) {
                    if ($scope.signPlusObj.StaffSignString == '') {
                        $scope.signPlusObj.StaffCanvasDisable = false;
                    }
                    $scope.signPlusObj.PatientSignCanvasDisable = false;
                    $scope.signPlusObj.PatientGaurdianCanvasDisable = false;

                    var Stafffilterlist = $filter("filter")($scope.StaffList, { "DoctorID": $scope.ParentObject.UserId }, true) || [];
                    if (Stafffilterlist.length > 0 && !$scope.signPlusObj.StaffUserId) {
                        $scope.signPlusObj.StaffUserObj = Stafffilterlist[0] || '';
                        $scope.signPlusObj.StaffUserId = Stafffilterlist[0].DoctorID;
                        $scope.signPlusObj.StaffValidate = true;
                    }

                }
                if ($scope.RoleId == 18) {
                    if ($scope.signPlusObj.CounselorSignString == '') {
                        $scope.signPlusObj.CounselorCanvasDisable = false;
                    }
                    $scope.signPlusObj.PatientSignCanvasDisable = false;
                    $scope.signPlusObj.PatientGaurdianCanvasDisable = false;

                    var Counselorfilterlist = $filter("filter")($scope.CounsellorList, { "DoctorID": $scope.ParentObject.UserId }, true) || [];
                    if (Counselorfilterlist.length > 0) {
                        $scope.signPlusObj.CounselorUserObj = Counselorfilterlist[0] || '';
                        $scope.signPlusObj.CounselorUserId = Counselorfilterlist[0].DoctorID;
                        $scope.signPlusObj.CounselorValidate = true;
                    }


                }
                if (($scope.RoleId == 30) && ($scope.signPlusObj.AnesthesistSignString == '')) {

                    $scope.signPlusObj.AnesthesistCanvasDisable = false;

                    var Anesthesistfilterlist = $filter("filter")($scope.AnesthesistList, { "DoctorID": $scope.ParentObject.UserId }, true) || [];
                    if (Anesthesistfilterlist.length > 0) {
                        $scope.signPlusObj.AnesthesistUserObj = Anesthesistfilterlist[0] || '';
                        $scope.signPlusObj.AnesthesistUserId = Anesthesistfilterlist[0].DoctorID;
                        $scope.signPlusObj.AnesthesistValidate = true;
                    }

                }

                if ($scope.mainObject.signPlusObj.ProviderUserId == 0 || $scope.mainObject.signPlusObj.ProviderUserId === $scope.ParentObject.UserId) {
                    var Providerfilterlist = $filter("filter")($scope.ProviderList, { "DoctorID": $scope.ParentObject.UserId }, true) || [];
                    if (Providerfilterlist.length > 0) {
                        $scope.signPlusObj.ProviderUserObj = Providerfilterlist[0] || '';
                        $scope.signPlusObj.ProviderUserId = Providerfilterlist[0].DoctorID;

                        if (Providerfilterlist[0].RoleId == 1 || Providerfilterlist[0].RoleId == 43) {
                            $scope.signPlusObj.ProviderValidate = true;
                        }
                    }
                } else {
                    $scope.signPlusObj.ProviderUserObj = $scope.mainObject.signPlusObj.ProviderUserObj
                    $scope.signPlusObj.ProviderUserId = $scope.mainObject.signPlusObj.ProviderUserId;
                    $scope.signPlusObj.ProviderValidate = true;
                }

                if ($scope.signPlusObj.PatientSignString != '') {
                    $scope.signPlusObj.IsPatientDigitalSignTaken = true;
                    $scope.MainPatientSignedObj.PatientSignString = $scope.signPlusObj.PatientSignString;
                }

                if ($scope.signPlusObj.PatientIntialSignString != '') {
                    $scope.signPlusObj.IsPatientDigitalSignTaken = true;
                    $scope.MainPatientSignedObj.PatientIntialSignString = $scope.signPlusObj.PatientIntialSignString;
                }

                if ($scope.signPlusObj.GaurdianSignString !='') {
                    $scope.signPlusObj.IsGaurdianDigitalSignTaken = true;

                    $scope.MainPatientSignedObj.GaurdianFirstName = $scope.signPlusObj.GaurdianFirstName || "";
                    $scope.MainPatientSignedObj.GaurdianLastName = $scope.signPlusObj.GaurdianLastName || "";
                    $scope.MainPatientSignedObj.GaurdianSignString = $scope.signPlusObj.GaurdianSignString || "";
                }

                if ($scope.signPlusObj.ProviderSignString != '') {
                    $scope.signPlusObj.IsProviderDigitalSignTaken = true;

                    $scope.MainPatientSignedObj.ProviderSignString = $scope.signPlusObj.ProviderSignString;
                    $scope.MainPatientSignedObj.ProviderUserId = $scope.signPlusObj.ProviderUserId || 0;
                    $scope.MainPatientSignedObj.ProviderUserObj = $scope.signPlusObj.ProviderUserObj || "";
                }

                if ($scope.signPlusObj.StaffSignString !='') {
                    $scope.signPlusObj.IsStaffDigitalSignTaken = true;

                    $scope.MainPatientSignedObj.StaffSignString = $scope.signPlusObj.StaffSignString;
                    $scope.MainPatientSignedObj.StaffUserObj = $scope.signPlusObj.StaffUserObj || "";
                    $scope.MainPatientSignedObj.StaffUserId = $scope.signPlusObj.StaffUserId || 0;
                }
                if ($scope.signPlusObj.CounselorSignString != '') {
                    $scope.signPlusObj.IsCounselorDigitalSignTaken = true;

                    $scope.MainPatientSignedObj.CounselorSignString = $scope.signPlusObj.CounselorSignString;
                    $scope.MainPatientSignedObj.CounselorUserId = $scope.signPlusObj.CounselorUserId || 0;
                    $scope.MainPatientSignedObj.CounselorUserObj = $scope.signPlusObj.CounselorUserObj || "";
                }

                if ($scope.signPlusObj.AnesthesistSignString != '') {
                    $scope.signPlusObj.IsAnesthesistDigitalSignTaken = true;

                    $scope.MainPatientSignedObj.AnesthesistSignString = $scope.signPlusObj.AnesthesistSignString;
                    $scope.MainPatientSignedObj.AnesthesistUserObj = $scope.signPlusObj.AnesthesistUserObj;
                    $scope.MainPatientSignedObj.AnesthesistUserId = $scope.signPlusObj.AnesthesistUserId || 0;
                }

                if ($scope.signaturesTab.Patient) {
                    $scope.signaturesTab.activeSigatureTab = 1;
                } else if ($scope.signaturesTab.Staff){
                    $scope.signaturesTab.activeSigatureTab = 2;
                } else if ($scope.signaturesTab.Provider) {
                    $scope.signaturesTab.activeSigatureTab = 3;
                } else if ($scope.signaturesTab.Counselor) {
                    $scope.signaturesTab.activeSigatureTab = 4;
                } else if ($scope.signaturesTab.Anesthesist) {
                    $scope.signaturesTab.activeSigatureTab = 5;
                } else if ($scope.signaturesTab.Gaurdian) {
                    $scope.signaturesTab.activeSigatureTab = 6;
                }
                $scope.initializeSignatureDateTime('Patient');
                $scope.initializeSignatureDateTime('Staff');
                $scope.initializeSignatureDateTime('Provider');
                $scope.initializeSignatureDateTime('Counselor');
                $scope.initializeSignatureDateTime('Anesthesist');
                $scope.initializeSignatureDateTime('Gaurdian');
                //$scope.signaturesTab.activeSigatureTab = 1;
                $scope.switchSignatureTab = function (tabono) {
                    $scope.signaturesTab.activeSigatureTab = tabono;

                    if ($scope.signPlusObj.StaffUserId == 0) {
                        $scope.signPlusObj.StaffUserObj = "";
                    }

                    if ($scope.signaturesTab.activeSigatureTab === 2 && $scope.ParentObject.UserId == $scope.signPlusObj.StaffUserId && $scope.signPlusObj.StaffSignString == '') {
                        $scope.OnLoadUserSignature($scope.signPlusObj.StaffUserObj, 'Staff', 'signStaffPadUD');
                    }
                    if ($scope.signaturesTab.activeSigatureTab === 3 && $scope.ParentObject.UserId == $scope.signPlusObj.ProviderUserId && $scope.signPlusObj.ProviderSignString == '') {
                        $scope.OnLoadUserSignature($scope.signPlusObj.ProviderUserObj, 'Provider', 'signProviderPadUD');
                    }
                    if ($scope.signaturesTab.activeSigatureTab === 4 && $scope.ParentObject.UserId == $scope.signPlusObj.CounselorUserId && $scope.signPlusObj.CounselorSignString == '') {
                        $scope.OnLoadUserSignature($scope.signPlusObj.CounselorUserObj, 'Counselor', 'signCounsellorPadUD');
                    }
                    if ($scope.signaturesTab.activeSigatureTab === 5 && $scope.ParentObject.UserId == $scope.signPlusObj.AnesthesistUserId && $scope.signPlusObj.AnesthesistSignString == '') {
                        $scope.OnLoadUserSignature($scope.signPlusObj.AnesthesistUserObj, 'Anesthesist', 'signAnesthesistPadUD');
                    }
                };

                var tmr; var resetIsSupported = false;
                $scope.signPlusObj.ShowPatientCanvas = true;
                $scope.signPlusObj.ShowPatientInitialCanvas = false;
                $scope.signPlusObj.SelectedPatientType = 'PatientName';
                //$scope.ShowPatientIntialCanvas = false;
                var PatientSignatureelements = [];

                //PatientSignatureelements = document.querySelectorAll('[id^="NPatientIntialSignature"]');
                //if (PatientSignatureelements.length>0) {
                //    $scope.ShowPatientIntialCanvas = true;
                //}
                //$scope.signPlusObj = {
                //    "PatientConsentDocumentId":0,
                //    "patientreadyToSign": false,
                //    "staffreadyToSign": false,
                //    "providerreadyToSign": false,
                //    "counselorreadyToSign": false,
                //    "anesthesistreadyToSign": false,
                //    "gaurdianreadyToSign": false,
                //    "PatientSignString": "",
                //    "StaffSignString": "",
                //    "StaffUserId": "",
                //    "StaffUserObj": "",
                //    "ProviderSignString": "",
                //    "ProviderUserId": "",
                //    "ProviderUserObj": "",
                //    "CounselorSignString": "",
                //    "CounselorUserId": "",
                //    "CounselorUserObj": "",
                //    "AnesthesistSignString": "",
                //    "AnesthesistUserId": "",
                //    "AnesthesistUserObj": "",
                //    "GaurdianSignString": "",
                //    "GaurdianUserObj": "",
                //    "GaurdianUserId": "",
                //    "GaurdianFirstName": "",
                //    "GaurdianLastName": "",
                //    "PatientName": mainObject.PatientName,
                //    "IsPatientDigitalSignTaken": false,
                //    "IsStaffDigitalSignTaken": false,
                //    "IsProviderDigitalSignTaken": false,
                //    "IsCounselorDigitalSignTaken": false,
                //    "IsAnesthesistDigitalSignTaken": false,

                //}

                $scope.saveandnextSignatures = function (type) {
                    /*console.log(type);*/
                    var Tab = 0;

                    if (type == "Patient") {
                        var PatientSignatureelements = document.querySelectorAll('[id^="NPatientSignature"]');
                        PatientSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##PatientSignature##';
                            }
                        });

                        var PatientSignatureDateelements = document.querySelectorAll('[id^="NPatientSignDateTime"]');
                        PatientSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##PatientSignDateTime##';
                        });

                        var PatientSignatureelements = document.querySelectorAll('[id^="NPatientIntialSignature"]');
                        PatientSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##PatientIntialSignature##';
                            }
                        });

                        if ($scope.signaturesTab.Staff) {
                            Tab = 2;
                        } else if ($scope.signaturesTab.Provider){
                            Tab = 3;
                        } else if ($scope.signaturesTab.Counselor) {
                            Tab = 4;
                        } else if ($scope.signaturesTab.Anesthesist) {
                            Tab = 5;
                        } else if ($scope.signaturesTab.Gaurdian) {
                            Tab = 6;
                        }

                        $scope.savePatientSignatureDrawtoDB(Tab, "SaveAndNext");
                        //  $scope.signaturesTab.activeSigatureTab = 2;
                    }
                    else if (type == "Staff") {

                        var StaffSignatureelements = document.querySelectorAll('[id^="NStaffSignature"]');
                        StaffSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##StaffSignature##';
                            }
                        });

                        var StaffSignatureDateelements = document.querySelectorAll('[id^="NStaffSignedDateTime"]');
                        StaffSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##StaffSignedDateTime##';
                        });

                        if ($scope.signaturesTab.Provider) {
                            Tab = 3;
                        } else if ($scope.signaturesTab.Counselor) {
                            Tab = 4;
                        } else if ($scope.signaturesTab.Anesthesist) {
                            Tab = 5;
                        } else if ($scope.signaturesTab.Gaurdian) {
                            Tab = 6;
                        }

                        $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.StaffUserObj, type, Tab, '', $scope.signPlusObj.StaffSignBy);
                        //$scope.signaturesTab.activeSigatureTab = 3;
                    }
                    else if (type == "Provider") {

                        var ProviderSignatureelements = document.querySelectorAll('[id^="NProviderSignature"]');
                        ProviderSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##ProviderSignature##';
                            }
                        });
                        var ProviderSignatureDateelements = document.querySelectorAll('[id^="NProviderSignedDateTime"]');
                        ProviderSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##ProviderSignedDateTime##';
                        });

                        if ($scope.signaturesTab.Counselor) {
                            Tab = 4;
                        } else if ($scope.signaturesTab.Anesthesist) {
                            Tab = 5;
                        } else if ($scope.signaturesTab.Gaurdian) {
                            Tab = 6;
                        }

                        //    $scope.saveProviderSignatureDraw(4);
                        $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.ProviderUserObj, type, Tab, '', $scope.signPlusObj.DoctorSignBy);
                        //$scope.signaturesTab.activeSigatureTab = 4;
                    }
                    else if (type == "Counselor") {

                        var CounselorSignatureelements = document.querySelectorAll('[id^="NCounselorSignature"]');
                        CounselorSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##CounselorSignature##';
                            }
                        });

                        var CounselorSignatureDateelements = document.querySelectorAll('[id^="NCounselorSignDateTime"]');
                        CounselorSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##CounselorSignDateTime##';
                        });

                        if ($scope.signaturesTab.Anesthesist) {
                            Tab = 5;
                        } else if ($scope.signaturesTab.Gaurdian) {
                            Tab = 6;
                        }

                        $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.CounselorUserObj, type, Tab, '', $scope.signPlusObj.CounselorSignBy);
                        // $scope.saveCounsellorSignatureDraw(5);
                        // $scope.signaturesTab.activeSigatureTab = 5;
                    }
                    else if (type == "Anesthesist") {

                        var AnesthesiaSignatureelements = document.querySelectorAll('[id^="NAnesthesistSignature"]');
                        AnesthesiaSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##AnesthesistSignature##';
                            }
                        });

                        var AnesthesiaSignatureDateelements = document.querySelectorAll('[id^="NAnesthesistSignDateTime"]');
                        AnesthesiaSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##AnesthesistSignDateTime##';
                        });

                        if ($scope.signaturesTab.Gaurdian) {
                            Tab = 6;
                        }
                        $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.AnesthesistUserObj, type, Tab, '', $scope.signPlusObj.AnesthesistSignBy);
                        //$scope.saveAnesthesistSignatureDraw(6);
                        //$scope.signaturesTab.activeSigatureTab = 6;
                    }
                    else {

                        var GaurdianSigantureelements = document.querySelectorAll('[id^="NGaurdianSiganture"]');
                        GaurdianSigantureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##GaurdianSiganture##';
                            }
                        });

                        var GaurdianSigantureDateelements = document.querySelectorAll('[id^="NGaurdianSignDateTime"]');
                        GaurdianSigantureDateelements.forEach(function (element) {
                            element.innerHTML = '##GaurdianSignDateTime##';
                        });

                        $scope.signaturesTab.activeSigatureTab = 1;
                    }

                    if ($scope.signaturesTab.activeSigatureTab === 2 && $scope.ParentObject.UserId == $scope.signPlusObj.StaffUserId && $scope.signPlusObj.StaffSignString == '') {
                        $scope.OnLoadUserSignature($scope.signPlusObj.StaffUserObj, 'Staff', 'signStaffPadUD');
                    } else if ($scope.signaturesTab.activeSigatureTab === 3 && $scope.ParentObject.UserId == $scope.signPlusObj.ProviderUserId && $scope.signPlusObj.ProviderSignString == '') {
                        $scope.OnLoadUserSignature($scope.signPlusObj.ProviderUserObj, 'Provider', 'signProviderPadUD');
                    } else if ($scope.signaturesTab.activeSigatureTab === 4 && $scope.ParentObject.UserId == $scope.signPlusObj.CounselorUserId && $scope.signPlusObj.CounselorSignString == '') {
                        $scope.OnLoadUserSignature($scope.signPlusObj.CounselorUserObj, 'Counselor', 'signCounsellorPadUD');
                    } else if($scope.signaturesTab.activeSigatureTab === 5 && $scope.ParentObject.UserId == $scope.signPlusObj.AnesthesistUserId && $scope.signPlusObj.AnesthesistSignString == '') {
                        $scope.OnLoadUserSignature($scope.signPlusObj.AnesthesistUserObj, 'Anesthesist', 'signAnesthesistPadUD');
                    }
                }

                $scope.saveandpreviousSignatures = function (type) {
                    //console.log(type);
                    if (type == "Gaurdian") {
                        if ($scope.signaturesTab.Anesthesist) {
                            $scope.signaturesTab.activeSigatureTab = 5;
                        } else if ($scope.signaturesTab.Counselor) {
                            $scope.signaturesTab.activeSigatureTab = 4;
                        } else if ($scope.signaturesTab.Provider) {
                            $scope.signaturesTab.activeSigatureTab = 3;
                        } else if ($scope.signaturesTab.Staff) {
                            $scope.signaturesTab.activeSigatureTab = 2;
                        } else if ($scope.signaturesTab.Patient) {
                            $scope.signaturesTab.activeSigatureTab = 1;
                        }
                    }
                    else if (type == "Anesthesist") {
                        if ($scope.signaturesTab.Counselor) {
                            $scope.signaturesTab.activeSigatureTab = 4;
                        } else if ($scope.signaturesTab.Provider) {
                            $scope.signaturesTab.activeSigatureTab = 3;
                        } else if ($scope.signaturesTab.Staff) {
                            $scope.signaturesTab.activeSigatureTab = 2;
                        } else if ($scope.signaturesTab.Patient) {
                            $scope.signaturesTab.activeSigatureTab = 1;
                        }
                    }
                    else if (type == "Counselor") {
                        if ($scope.signaturesTab.Provider) {
                            $scope.signaturesTab.activeSigatureTab = 3;
                        } else if ($scope.signaturesTab.Staff) {
                            $scope.signaturesTab.activeSigatureTab = 2;
                        } else if ($scope.signaturesTab.Patient) {
                            $scope.signaturesTab.activeSigatureTab = 1;
                        }
                    }
                    else if (type == "Provider") {
                        if ($scope.signaturesTab.Staff) {
                            $scope.signaturesTab.activeSigatureTab = 2;
                        } else if ($scope.signaturesTab.Patient) {
                            $scope.signaturesTab.activeSigatureTab = 1;
                        }
                    }
                    else if (type == "Staff") {
                        if ($scope.signaturesTab.Patient) {
                            $scope.signaturesTab.activeSigatureTab = 1;
                        }
                    }
                }
                $scope.saveandcompleteSignatures = function (type) {

                    if (type == "Patient") {
                        var PatientSignatureelements = document.querySelectorAll('[id^="NPatientSignature"]');
                        PatientSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##PatientSignature##';
                            }
                        });

                        var PatientSignatureDateelements = document.querySelectorAll('[id^="NPatientSignDateTime"]');
                        PatientSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##PatientSignDateTime##';
                        });

                        var PatientSignatureelements = document.querySelectorAll('[id^="NPatientIntialSignature"]');
                        PatientSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##PatientIntialSignature##';
                            }
                        });

                        $scope.savePatientSignatureDrawtoDB(2, 'complete');
                        //  $scope.signaturesTab.activeSigatureTab = 2;
                    }
                    else if (type == "Staff") {
                        var StaffSignatureelements = document.querySelectorAll('[id^="NStaffSignature"]');
                        StaffSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##StaffSignature##';
                            }
                        });

                        var StaffSignatureDateelements = document.querySelectorAll('[id^="NStaffSignedDateTime"]');
                        StaffSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##StaffSignedDateTime##';
                        });
                        // $scope.saveStaffSignatureDraw(3, 'complete');
                        $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.StaffUserObj, type, 3, 'complete', $scope.signPlusObj.StaffSignBy);
                        //$scope.signaturesTab.activeSigatureTab = 3;
                    }
                    else if (type == "Provider") {

                        var ProviderSignatureelements = document.querySelectorAll('[id^="NProviderSignature"]');
                        ProviderSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##ProviderSignature##';
                            }
                        });
                        var ProviderSignatureDateelements = document.querySelectorAll('[id^="NProviderSignedDateTime"]');
                        ProviderSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##ProviderSignedDateTime##';
                        });


                        // $scope.saveProviderSignatureDraw(4, 'complete');
                        $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.ProviderUserObj, type, 4, 'complete', $scope.signPlusObj.DoctorSignBy);
                        //$scope.signaturesTab.activeSigatureTab = 4;
                    }
                    else if (type == "Counselor") {


                        var CounselorSignatureelements = document.querySelectorAll('[id^="NCounselorSignature"]');
                        CounselorSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##CounselorSignature##';
                            }
                        });

                        var CounselorSignatureDateelements = document.querySelectorAll('[id^="NCounselorSignDateTime"]');
                        CounselorSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##CounselorSignDateTime##';
                        });

                        //$scope.saveCounsellorSignatureDraw(5, 'complete');
                        $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.CounselorUserObj, type, 5, 'complete', $scope.signPlusObj.CounselorSignBy);
                        // $scope.signaturesTab.activeSigatureTab = 5;
                    }
                    else if (type == "Anesthesist") {
                        var AnesthesiaSignatureelements = document.querySelectorAll('[id^="NAnesthesistSignature"]');
                        AnesthesiaSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##AnesthesistSignature##';
                            }
                        });
                        let Anesthesiaelement = document.querySelector("[id^='NAnesthesiologistName']");
                        if (Anesthesiaelement) {
                            let anesthesistName = $scope.signPlusObj?.AnesthesistUserObj?.FullName;
                            if (anesthesistName) {
                                Anesthesiaelement.innerText = anesthesistName;
                            }
                        }
                        var AnesthesiaSignatureDateelements = document.querySelectorAll('[id^="NAnesthesistSignDateTime"]');
                        AnesthesiaSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##AnesthesistSignDateTime##';
                        });
                        // $scope.saveAnesthesistSignatureDraw(6, 'complete');
                        $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.AnesthesistUserObj, type, 6, 'complete', $scope.signPlusObj.AnesthesistSignBy);
                        //$scope.signaturesTab.activeSigatureTab = 6;
                    } else if (type == "Gaurdian") {

                        var GaurdianSigantureelements = document.querySelectorAll('[id^="NGaurdianSiganture"]');
                        GaurdianSigantureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##GaurdianSiganture##';
                            }
                        });

                        var GaurdianSigantureDateelements = document.querySelectorAll('[id^="NGaurdianSignDateTime"]');
                        GaurdianSigantureDateelements.forEach(function (element) {
                            element.innerHTML = '##GaurdianSignDateTime##';
                        });

                        $scope.saveGaurdianSignatureDraw(6, 'complete');
                    }
                }

                $uibModalInstance.rendered.then(function () {



                    //$scope.signPlusObj.PatientSignString = $scope.mainObject.signPlusObj.PatientSignString || "";
                    //$scope.signPlusObj.StaffSignString = $scope.mainObject.signPlusObj.StaffSignString || "";
                    //$scope.signPlusObj.StaffUserId = $scope.mainObject.signPlusObj.StaffUserId || 0;
                    //$scope.signPlusObj.StaffUserObj = $scope.mainObject.signPlusObj.StaffUserName || "";

                    //$scope.signPlusObj.ProviderSignString = $scope.mainObject.signPlusObj.ProviderSignString || "";
                    //$scope.signPlusObj.ProviderUserId = $scope.mainObject.signPlusObj.ProviderUserId || 0;
                    //$scope.signPlusObj.ProviderUserObj = $scope.mainObject.signPlusObj.ProviderUserName || "";

                    //$scope.signPlusObj.CounselorEncryptedSignString = $scope.mainObject.signPlusObj.CounselorSignString || "";
                    //$scope.signPlusObj.CounselorUserId = $scope.mainObject.signPlusObj.CounselorUserId || 0;
                    //$scope.signPlusObj.CounselorUserObj = $scope.mainObject.signPlusObj.CounselorUserObj || "";

                    //$scope.signPlusObj.AnesthesistSignString = $scope.mainObject.signPlusObj.AnesthesistSignString || "";
                    //$scope.signPlusObj.AnesthesistUserId = $scope.mainObject.signPlusObj.AnesthesistUserId || 0;
                    //$scope.signPlusObj.AnesthesistUserObj = $scope.mainObject.signPlusObj.AnesthesistUserObj || "";


                    //$scope.signPlusObj.IsPatientDigitalSignTaken = $scope.mainObject.signPlusObj.IsPatientDigitalSignTaken;
                    //$scope.signPlusObj.IsProviderDigitalSignTaken = $scope.mainObject.signPlusObj.IsProviderDigitalSignTaken;
                    //$scope.signPlusObj.IsStaffDigitalSignTaken = $scope.mainObject.signPlusObj.IsStaffDigitalSignTaken;
                    //$scope.signPlusObj.IsAnesthesistDigitalSignTaken = $scope.mainObject.signPlusObj.IsAnesthesistDigitalSignTaken;
                    //$scope.signPlusObj.IsCounselorDigitalSignTaken = $scope.mainObject.signPlusObj.IsCounselorDigitalSignTaken;

                    if ($scope.signPlusObj.IsPatientDigitalSignTaken) {
                        if ($scope.signPlusObj.PatientSignString != "") {
                            $scope.signPlusObj.patientreadyToSign = true;
                            $scope.signPlusObj.IsPatientDigitalSignTaken = true;
                            var canvas = document.getElementById('signPatientPadUD');
                            var context = canvas.getContext('2d');
                            var image = new Image();
                            image.onload = function () {
                                ///*   context.drawImage(image, 0, 0);*/
                                //var centerX = canvas.width / 2 - image.width / 2;
                                //var centerY = canvas.height / 2 - image.height / 2;
                                //context.drawImage(image, centerX, centerY);
                                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                            };
                            image.src = $scope.signPlusObj.PatientSignString;
                            $scope.signPlusObj.PatientIntialSignString = $scope.signPlusObj.PatientIntialSignString || "";
                            if ($scope.signPlusObj.PatientIntialSignString != "") {

                                var canvaspi = document.getElementById('signPatientIntialPadUD');
                                var contextpi = canvaspi.getContext('2d');
                                var imagepi = new Image();
                                imagepi.onload = function () {
                                    /*   context.drawImage(image, 0, 0);*/
                                    var centerXp = canvaspi.width / 2 - imagepi.width / 2;
                                    var centerYp = canvaspi.height / 2 - imagepi.height / 2;
                                    // contextp.drawImage(imagep, centerXp, centerYp);
                                    contextpi.drawImage(imagepi, 0, 0, canvaspi.width, canvaspi.height);
                                };
                                imagepi.src = $scope.signPlusObj.PatientIntialSignString;
                            }
                        }

                    }



                    if ($scope.signPlusObj.IsStaffDigitalSignTaken) {
                        if ($scope.signPlusObj.StaffSignString != "") {
                            $scope.signPlusObj.staffreadyToSign = true;
                            $scope.GetSignatureDeleteObj.StaffSignature = true;
                            var canvasS = document.getElementById('signStaffPadUD');
                            var contextS = canvasS.getContext('2d');
                            var imageS = new Image();
                            imageS.onload = function () {
                                /*   context.drawImage(image, 0, 0);*/
                                //var centerXS = canvasS.width / 2 - imageS.width / 2;
                                //var centerYS = canvasS.height / 2 - imageS.height / 2;
                                //contextS.drawImage(imageS, centerXS, centerYS);
                                contextS.drawImage(imageS, 0, 0, canvasS.width, canvasS.height);
                            };
                            imageS.src = $scope.signPlusObj.StaffSignString;
                        }
                    }

                    if ($scope.signPlusObj.IsProviderDigitalSignTaken) {

                        if ($scope.signPlusObj.ProviderSignString != "") {
                            $scope.GetSignatureDeleteObj.ProviderSignature = true;
                            $scope.signPlusObj.providerreadyToSign = true;
                            var canvasD = document.getElementById('signProviderPadUD');
                            var contextD = canvasD.getContext('2d');
                            var imageD = new Image();
                            imageD.onload = function () {
                                /*   context.drawImage(image, 0, 0);*/
                                //var centerXD = canvasD.width / 2 - imageD.width / 2;
                                //var centerYD = canvasD.height / 2 - imageD.height / 2;
                                //contextD.drawImage(imageD, centerXD, centerYD);
                                contextD.drawImage(imageD, 0, 0, canvasD.width, canvasD.height);
                            };
                            imageD.src = $scope.signPlusObj.ProviderSignString;
                        }
                    }

                    if ($scope.signPlusObj.IsCounselorDigitalSignTaken) {
                        if ($scope.signPlusObj.CounselorSignString != "") {
                            $scope.GetSignatureDeleteObj.CounselorSignature = true;
                            $scope.signPlusObj.counselorreadyToSign = true;
                            var canvasC = document.getElementById('signCounsellorPadUD');
                            var contextC = canvasC.getContext('2d');
                            var imageC = new Image();
                            imageC.onload = function () {
                                //var centerXC = canvasC.width / 2 - imageC.width / 2;
                                //var centerYC = canvasC.height / 2 - imageC.height / 2;
                                //contextC.drawImage(imageC, centerXC, centerYC);
                                contextC.drawImage(imageC, 0, 0, canvasC.width, canvasC.height);
                            };
                            imageC.src = $scope.signPlusObj.CounselorSignString;
                        }
                    }

                    if ($scope.signPlusObj.IsAnesthesistDigitalSignTaken) {
                        if ($scope.signPlusObj.AnesthesistSignString != "") {
                            $scope.GetSignatureDeleteObj.AnesthesistSignature = true;
                            $scope.signPlusObj.anesthesistreadyToSign = true;
                            var canvasA = document.getElementById('signAnesthesistPadUD');
                            var contextA = canvasA.getContext('2d');
                            var imageA = new Image();
                            imageA.onload = function () {
                                //var centerXA = canvasA.width / 2 - imageA.width / 2;
                                //var centerYA = canvasA.height / 2 - imageA.height / 2;
                                //contextA.drawImage(imageA, centerXA, centerYA);
                                contextA.drawImage(imageA, 0, 0, canvasA.width, canvasA.height);
                            };
                            imageA.src = $scope.signPlusObj.AnesthesistSignString;
                        }
                    }

                    if ($scope.signPlusObj.IsGaurdianDigitalSignTaken) {
                        if ($scope.signPlusObj.GaurdianSignString != "") {
                            $scope.GetSignatureDeleteObj.GaurdianSignature = true;
                            $scope.signPlusObj.gaurdianreadyToSign = true;
                            var canvasG = document.getElementById('signGaurdianPadUD');
                            var contextG = canvasG.getContext('2d');
                            var imageG = new Image();
                            imageG.onload = function () {
                                //var centerXG = canvasG.width / 2 - imageG.width / 2;
                                //var centerYG = canvasG.height / 2 - imageG.height / 2;
                                //contextG.drawImage(imageG, centerXG, centerYG);
                                contextG.drawImage(imageG, 0, 0, canvasG.width, canvasG.height);
                            };
                            imageG.src = $scope.signPlusObj.GaurdianSignString;
                        }
                    }





                });

                $scope.onSelectUser = function (type, obj) {
                    if (type == 'Staff') {
                        console.log(obj);
                        $scope.signPlusObj.ValidatePassword = '';
                        $scope.OnClearStaffSignature();
                        $scope.signPlusObj.StaffUserId = obj.DoctorID;

                        if ($scope.signPlusObj.StaffUserId == $scope.ParentObject.UserId) {
                            $scope.signPlusObj.StaffValidate = true;
                            $scope.signPlusObj.StaffCanvasDisable = false;
                            $scope.OnLoadUserSignature($scope.signPlusObj.StaffUserObj, 'Staff', 'signStaffPadUD');
                        } else {
                            $scope.signPlusObj.StaffValidate = false;
                            $scope.signPlusObj.StaffCanvasDisable = true;
                        }
                    }

                    if (type == 'Provider') {
                        console.log(obj);
                        $scope.signPlusObj.ValidatePassword = '';
                        $scope.OnClearProviderSignature();
                        $scope.signPlusObj.ProviderUserId = obj.DoctorID;

                        if ($scope.signPlusObj.ProviderUserId == $scope.ParentObject.UserId) {
                            $scope.signPlusObj.ProviderValidate = true;

                            $scope.signPlusObj.ProviderCanvasDisable = false;

                            $scope.OnLoadUserSignature($scope.signPlusObj.ProviderUserObj, 'Provider', 'signProviderPadUD');
                        } else {
                            $scope.signPlusObj.ProviderValidate = false;

                            $scope.signPlusObj.ProviderCanvasDisable = true;
                        }
                    }
                    if (type == 'Counselor') {
                        console.log(obj);
                        $scope.signPlusObj.ValidatePassword = '';
                        $scope.OnClearCounsellorSignature();
                        $scope.signPlusObj.CounselorUserId = obj.DoctorID;

                        if ($scope.signPlusObj.CounselorUserId == $scope.ParentObject.UserId) {
                            $scope.signPlusObj.CounselorValidate = true;

                            $scope.signPlusObj.CounselorCanvasDisable = false;
                            $scope.OnLoadUserSignature($scope.signPlusObj.CounselorUserObj, 'Counselor', 'signCounsellorPadUD');
                        } else {
                            $scope.signPlusObj.CounselorValidate = false;

                            $scope.signPlusObj.CounselorCanvasDisable = true;
                        }

                    }
                    if (type == 'Anesthesist') {
                        console.log(obj);
                        $scope.signPlusObj.ValidatePassword = '';
                        $scope.OnClearAnesthesistSignature();
                        $scope.signPlusObj.AnesthesistUserId = obj.DoctorID;

                        if ($scope.signPlusObj.AnesthesistUserId == $scope.ParentObject.UserId) {
                            $scope.signPlusObj.AnesthesistValidate = true;

                            $scope.signPlusObj.AnesthesistCanvasDisable = false;
                            $scope.OnLoadUserSignature($scope.signPlusObj.AnesthesistUserObj, 'Anesthesist', 'signAnesthesistPadUD');
                        } else {
                            $scope.signPlusObj.AnesthesistValidate = false;

                            $scope.signPlusObj.AnesthesistCanvasDisable = true;
                        }
                    }
                }

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

                $scope.SearchGaurdianList = function (val) {
                    $scope.GaurdianList = $scope.GaurdianList || [];
                    $scope.FilterGaurdianList = angular.copy($scope.GaurdianList);
                    val = val || "";
                    if (val !== null) {
                        $scope.FilterGaurdianList = $filter("filter")($scope.FilterGaurdianList, { "FullName": val });
                        return $scope.FilterGaurdianList.map(function (item) {
                            return item;

                        });
                    }
                }

                $scope.OnSignGaurdianSignature = function () {
                    $scope.signPlusObj.gaurdianreadyToSign = true;
                    $scope.signPlusObj.GaurdianSignBy = "Topaz";
                    if (IsSigWebInstalled()) {
                        var ctx = document.getElementById('signGaurdianPadUD').getContext('2d');
                        SetDisplayPenWidth(5);
                        SetDisplayXSize(1200);
                        SetDisplayYSize(700);
                        SetTabletState(0, tmr);
                        SetJustifyMode(5);
                        ClearTablet();
                        AutoKeyAddData("0000000000000000");
                        SetKeyString("0000000000000000");
                        SetEncryptionMode(3);
                        if (tmr == null) {
                            tmr = SetTabletState(1, ctx, 50);
                        }
                        else {
                            SetTabletState(0, tmr);
                            tmr = null;
                            tmr = SetTabletState(1, ctx, 50);
                        }

                    } else {
                        alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                    }
                };
                $scope.OnClearGaurdianSignature = function () {
                    ClearTablet();


                    var canvas = document.getElementById('signGaurdianPadUD');
                    var context = canvas.getContext('2d');
                    // Clear the canvas
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    $scope.signPlusObj.IsGaurdianDigitalSignTaken = false;
                    $scope.signPlusObj.GaurdianSignString = "";
                    $scope.signPlusObj.gaurdianreadyToSign = false;
                    $scope.signPlusObj.GaurdianSignBy = 'Drawing';
                    //4-9-24
                    //$scope.MainPatientSignedObj.GaurdianSignedDateTime = "";
                    //$scope.MainPatientSignedObj.GaurdianSignCaptureUserId = 0;

                    //var GaurdianSigantureelements = document.querySelectorAll('[id^="NGaurdianSiganture"]');
                    //GaurdianSigantureelements.forEach(function (element) {
                    //    if (element.querySelector('table')) {
                    //        element.innerHTML = '##GaurdianSiganture##';
                    //    }
                    //});

                    //var GaurdianSigantureDateelements = document.querySelectorAll('[id^="NGaurdianSignDateTime"]');
                    //GaurdianSigantureDateelements.forEach(function (element) {
                    //    element.innerHTML = '##GaurdianSignDateTime##';
                    //});
                    //$scope.MainPatientSignedObj.IsGaurdianSignatureDone = false;
                }
                $scope.saveGaurdianSignatureDraw = function (pageno, type) {
                    var tabno = pageno || 0;
                    var savetype = type || "";
                    //$scope.signPlusObj.GaurdianSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                    $scope.signPlusObj.GaurdianSignedDateTime = $scope.SignatureDateTimeEdit.GaurdianDateTime ||
                        moment(new Date()).format("MM-DD-YYYY hh:mm A");
                    if ($scope.signPlusObj.GaurdianSignBy == "Topaz") {
                        if (NumberOfTabletPoints() == 0) {
                            //alert("Please sign before continuing");
                            if ($scope.MainPatientSignedObj.IsGaurdianSignatureDone) {
                                if (savetype == "complete") {
                                    $scope.savecompleteSignature();
                                } else {
                                    if (tabno !== 0) {
                                        $scope.signaturesTab.activeSigatureTab = tabno;
                                    }
                                }
                            } else {
                                alertify.error("Please add Signature");
                            }
                        }
                        else {
                            SetTabletState(0, tmr);




                            var CryptoData = "";
                            CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                            CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                            AutoKeyAddANSIData(CryptoData);
                            SetEncryptionMode(2);

                            SetSigCompressionMode(2);



                            SetImageXSize(1200);
                            SetImageYSize(800);
                            SetImagePenWidth(10);
                            GetSigImageB64(SignedImageCallback);
                            function SignedImageCallback(str) {

                                var convertedSignatureObj = "data:image/png;base64," + str;

                                $scope.signPlusObj.GaurdianSignString = convertedSignatureObj;
                                console.log($scope.signPlusObj.GaurdianSignString);
                                alertify.success("Signature added Successfully ");

                                if (savetype == "complete") {
                                    $scope.savecompleteSignature();
                                } else {
                                    if (tabno !== 0) {
                                        $scope.signaturesTab.activeSigatureTab = tabno;
                                    }
                                }
                            }


                        }
                    } else {
                        var canvas = document.getElementById('signGaurdianPadUD');
                        var sign = canvas.toDataURL();

                        console.log(sign);


                        if (sign === 'data:image/png;base64,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') {
                            alertify.error("Please sign to continue");
                            return false;
                        }

                        $scope.signPlusObj.GaurdianSignString = sign;
                        console.log($scope.signPlusObj.GaurdianSignString);
                        alertify.success("Signature added Successfully ");

                        if (savetype == "complete") {
                            $scope.savecompleteSignature();
                        } else {
                            if (tabno !== 0) {
                                $scope.signaturesTab.activeSigatureTab = tabno;
                            }
                        }
                    }


                }


                $scope.OnSignAnesthesistSignature = function () {
                    $scope.signPlusObj.anesthesistreadyToSign = true;
                    $scope.signPlusObj.IsAnesthesistDigitalSignTaken = true;
                    $scope.signPlusObj.AnesthesistSignBy = "Topaz";
                    if (IsSigWebInstalled()) {
                        var ctx = document.getElementById('signAnesthesistPadUD').getContext('2d');
                        SetDisplayPenWidth(5);
                        SetDisplayXSize(1200);
                        SetDisplayYSize(700);
                        SetTabletState(0, tmr);
                        SetJustifyMode(5);
                        ClearTablet();
                        AutoKeyAddData("0000000000000000");
                        SetKeyString("0000000000000000");
                        SetEncryptionMode(3);
                        if (tmr == null) {
                            tmr = SetTabletState(1, ctx, 50);
                        }
                        else {
                            SetTabletState(0, tmr);
                            tmr = null;
                            tmr = SetTabletState(1, ctx, 50);
                        }

                    } else {
                        alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                    }
                };
                $scope.OnClearAnesthesistSignature = function () {
                    ClearTablet();


                    var canvas = document.getElementById('signAnesthesistPadUD');
                    var context = canvas.getContext('2d');
                    // Clear the canvas
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    $scope.signPlusObj.IsAnesthesistDigitalSignTaken = false;
                    $scope.signPlusObj.AnesthesistSignString = "";
                    $scope.signPlusObj.anesthesistreadyToSign = false;
                    $scope.signPlusObj.AnesthesistSignBy = 'Drawing';
                    //4-9-24
                    //$scope.MainPatientSignedObj.AnesthesistSignedDateTime = "";
                    //$scope.MainPatientSignedObj.AnesthesistSignCaptureUserId = 0;
                    //$scope.MainPatientSignedObj.IsAnesthesistSignatureDone = false;
                    //var AnesthesiaSignatureelements = document.querySelectorAll('[id^="NAnesthesistSignature"]');
                    //AnesthesiaSignatureelements.forEach(function (element) {
                    //    if (element.querySelector('table')) {
                    //        element.innerHTML = '##AnesthesistSignature##';
                    //    }
                    //});

                    //var AnesthesiaSignatureDateelements = document.querySelectorAll('[id^="NAnesthesistSignDateTime"]');
                    //AnesthesiaSignatureDateelements.forEach(function (element) {
                    //    element.innerHTML = '##AnesthesistSignDateTime##';
                    //});
                }
                $scope.saveAnesthesistSignatureDraw = function (pageno, type) {
                    var tabono = pageno || 0;
                    var savetype = type | "";
                    if (NumberOfTabletPoints() == 0) {
                        //alert("Please sign before continuing");
                        alertify.error("Please add Signature");
                    }
                    else {
                        SetTabletState(0, tmr);




                        var CryptoData = "";
                        CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                        CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                        AutoKeyAddANSIData(CryptoData);
                        SetEncryptionMode(2);

                        SetSigCompressionMode(1);



                        SetImageXSize(500);
                        SetImageYSize(100);
                        SetImagePenWidth(5);
                        GetSigImageB64(SignedImageCallback);
                        function SignedImageCallback(str) {

                            var convertedSignatureObj = "data:image/png;base64," + str;

                            $scope.signPlusObj.AnesthesistSignString = convertedSignatureObj;
                            console.log($scope.signPlusObj.AnesthesistSignString);
                            alertify.success("Signature added Successfully ");
                            //if (tabono !== 0) {
                            //    $scope.signaturesTab.activeSigatureTab = tabono;
                            //}

                            if (savetype == 'complete') {
                                $scope.savecompleteSignature();
                            }
                            else {
                                if (tabono !== 0) {
                                    $scope.signaturesTab.activeSigatureTab = tabono;
                                }
                            }
                        }


                    }
                }


                $scope.OnSignCounsellorSignature = function () {
                    $scope.signPlusObj.counselorreadyToSign = true;
                    $scope.signPlusObj.IsCounselorDigitalSignTaken = false;
                    $scope.signPlusObj.CounselorSignBy = "Topaz";
                    if (IsSigWebInstalled()) {
                        var ctx = document.getElementById('signCounsellorPadUD').getContext('2d');
                        SetDisplayPenWidth(5);
                        SetDisplayXSize(1200);
                        SetDisplayYSize(700);
                        SetTabletState(0, tmr);
                        SetJustifyMode(5);
                        ClearTablet();
                        AutoKeyAddData("0000000000000000");
                        SetKeyString("0000000000000000");
                        SetEncryptionMode(3);
                        if (tmr == null) {
                            tmr = SetTabletState(1, ctx, 50);
                        }
                        else {
                            SetTabletState(0, tmr);
                            tmr = null;
                            tmr = SetTabletState(1, ctx, 50);
                        }

                    } else {
                        alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                    }
                };
                $scope.OnClearCounsellorSignature = function () {
                    ClearTablet();
                    var canvas = document.getElementById('signCounsellorPadUD');
                    var context = canvas.getContext('2d');
                    // Clear the canvas
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    $scope.signPlusObj.IsCounselorDigitalSignTaken = false;
                    $scope.signPlusObj.CounselorSignString = "";
                    $scope.signPlusObj.counselorreadyToSign = false;
                    $scope.signPlusObj.CounselorSignBy = 'Drawing';
                    //4-9-24
                    //$scope.MainPatientSignedObj.CounselorSignedDateTime = "";
                    //$scope.MainPatientSignedObj.CounselorSignCaptureUserId = 0;
                    //$scope.MainPatientSignedObj.IsCounselorSignatureDone = false;
                    //var CounselorSignatureelements = document.querySelectorAll('[id^="NCounselorSignature"]');
                    //CounselorSignatureelements.forEach(function (element) {
                    //    if (element.querySelector('table')) {
                    //        element.innerHTML = '##CounselorSignature##';
                    //    }
                    //});

                    //var CounselorSignatureDateelements = document.querySelectorAll('[id^="NCounselorSignDateTime"]');
                    //CounselorSignatureDateelements.forEach(function (element) {
                    //    element.innerHTML = '##CounselorSignDateTime##';
                    //});
                }
                $scope.saveCounsellorSignatureDraw = function (pageno, type) {
                    var tabno = pageno || 0;
                    var savetype = type || "";
                    if (NumberOfTabletPoints() == 0) {
                        //alert("Please sign before continuing");
                        alertify.error("Please add Signature");
                    }
                    else {
                        SetTabletState(0, tmr);




                        var CryptoData = "";
                        CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                        CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                        AutoKeyAddANSIData(CryptoData);
                        SetEncryptionMode(2);

                        SetSigCompressionMode(1);



                        SetImageXSize(500);
                        SetImageYSize(100);
                        SetImagePenWidth(5);
                        GetSigImageB64(SignedImageCallback);
                        function SignedImageCallback(str) {

                            var convertedSignatureObj = "data:image/png;base64," + str;

                            $scope.signPlusObj.CounselorSignString = convertedSignatureObj;
                            console.log($scope.signPlusObj.CounselorSignString);
                            alertify.success("Signature added Successfully ");
                            if (savetype == "complete") {
                                $scope.savecompleteSignature();
                            } else {
                                if (tabno !== 0) {
                                    $scope.signaturesTab.activeSigatureTab = tabno;
                                }
                            }

                        }


                    }
                }


                $scope.OnSignProviderSignature = function () {
                    $scope.signPlusObj.providerreadyToSign = true;
                    $scope.signPlusObj.IsProviderDigitalSignTaken = false;
                    $scope.signPlusObj.DoctorSignBy = "Topaz";
                    if (IsSigWebInstalled()) {
                        var ctx = document.getElementById('signProviderPadUD').getContext('2d');
                        SetDisplayPenWidth(5);
                        SetDisplayXSize(1200);
                        SetDisplayYSize(700);
                        SetTabletState(0, tmr);
                        SetJustifyMode(5);
                        ClearTablet();
                        AutoKeyAddData("0000000000000000");
                        SetKeyString("0000000000000000");
                        SetEncryptionMode(3);
                        if (tmr == null) {
                            tmr = SetTabletState(1, ctx, 50);
                        }
                        else {
                            SetTabletState(0, tmr);
                            tmr = null;
                            tmr = SetTabletState(1, ctx, 50);
                        }

                    } else {
                        alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                    }
                };
                $scope.OnClearProviderSignature = function () {
                    ClearTablet();



                    var canvas = document.getElementById('signProviderPadUD');
                    var context = canvas.getContext('2d');
                    // Clear the canvas
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    $scope.signPlusObj.IsPatientDigitalSignTaken = false;
                    $scope.signPlusObj.ProviderSignString = "";
                    $scope.signPlusObj.providerreadyToSign = false;
                    $scope.signPlusObj.DoctorSignBy = 'Drawing';
                    //4-9-24
                    //$scope.MainPatientSignedObj.ProviderSignedDateTime = "";
                    //$scope.MainPatientSignedObj.ProviderSignCaptureUserId = 0;
                    //$scope.MainPatientSignedObj.IsProviderSignatureDone = false;
                    //var ProviderSignatureelements = document.querySelectorAll('[id^="NProviderSignature"]');
                    //ProviderSignatureelements.forEach(function (element) {
                    //    if (element.querySelector('table')) {
                    //        element.innerHTML = '##ProviderSignature##';
                    //    }
                    //});

                    //var ProviderSignatureDateelements = document.querySelectorAll('[id^="NProviderSignedDateTime"]');
                    //ProviderSignatureDateelements.forEach(function (element) {
                    //    element.innerHTML = '##ProviderSignedDateTime##';
                    //});

                }
                $scope.saveProviderSignatureDraw = function (pageno, type) {
                    var tabno = pageno || 0;
                    var savetype = type || "";
                    if (NumberOfTabletPoints() == 0) {
                        //alert("Please sign before continuing");
                        alertify.error("Please add Signature");

                    }
                    else {
                        SetTabletState(0, tmr);




                        var CryptoData = "";
                        CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                        CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                        AutoKeyAddANSIData(CryptoData);
                        SetEncryptionMode(2);

                        SetSigCompressionMode(1);



                        SetImageXSize(500);
                        SetImageYSize(100);
                        SetImagePenWidth(5);
                        GetSigImageB64(SignedImageCallback);
                        function SignedImageCallback(str) {

                            var convertedSignatureObj = "data:image/png;base64," + str;

                            $scope.signPlusObj.ProviderSignString = convertedSignatureObj;
                            console.log($scope.signPlusObj.ProviderSignString);
                            alertify.success("Signature added Successfully ");
                            if (savetype == 'complete') {
                                $scope.savecompleteSignature();
                            }
                            else {
                                if (tabno !== 0) {
                                    $scope.signaturesTab.activeSigatureTab = tabno;
                                }
                            }
                        }


                    }
                }


                $scope.OnSignStaffSignature = function () {
                    $scope.signPlusObj.staffreadyToSign = true;
                    $scope.signPlusObj.IsStaffDigitalSignTaken = false;
                    $scope.signPlusObj.StaffSignBy = "Topaz";
                    if (IsSigWebInstalled()) {
                        var ctx = document.getElementById('signStaffPadUD').getContext('2d');
                        SetDisplayPenWidth(5);
                        SetDisplayXSize(1200);
                        SetDisplayYSize(700);
                        SetTabletState(0, tmr);
                        SetJustifyMode(5);
                        ClearTablet();
                        AutoKeyAddData("0000000000000000");
                        SetKeyString("0000000000000000");
                        SetEncryptionMode(3);
                        if (tmr == null) {
                            tmr = SetTabletState(1, ctx, 50);
                        }
                        else {
                            SetTabletState(0, tmr);
                            tmr = null;
                            tmr = SetTabletState(1, ctx, 50);
                        }

                    } else {
                        alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                    }
                };
                $scope.OnClearStaffSignature = function () {
                    ClearTablet();

                    var canvas = document.getElementById('signStaffPadUD');
                    var context = canvas.getContext('2d');
                    // Clear the canvas
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    $scope.signPlusObj.IsStaffDigitalSignTaken = false;
                    $scope.signPlusObj.StaffSignString = "";
                    $scope.signPlusObj.staffreadyToSign = false;
                    $scope.signPlusObj.StaffSignBy = 'Drawing';
                    //4-9-24
                    //$scope.MainPatientSignedObj.StaffSignedDateTime = "";
                    //$scope.MainPatientSignedObj.StaffSignCaptureUserId = 0;
                    //$scope.MainPatientSignedObj.IsStaffSignatureDone = false;
                    //var StaffSignatureelements = document.querySelectorAll('[id^="NStaffSignature"]');
                    //StaffSignatureelements.forEach(function (element) {
                    //    if (element.querySelector('table')) {
                    //        element.innerHTML = '##StaffSignature##';
                    //    }
                    //});

                    //var StaffSignatureDateelements = document.querySelectorAll('[id^="NStaffSignedDateTime"]');
                    //StaffSignatureDateelements.forEach(function (element) {
                    //    element.innerHTML = '##StaffSignedDateTime##';
                    //});
                    $scope.signPlusObj.StaffCanvasDisable = false;
                }
                $scope.saveStaffSignatureDraw = function (tabno, type) {
                    var pageNo = tabno || 0;
                    var savetype = type || "";
                    if (NumberOfTabletPoints() == 0) {
                        //alert("Please sign before continuing");
                        alertify.error("Please add Signature");
                    }
                    else {
                        SetTabletState(0, tmr);




                        var CryptoData = "";
                        CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                        CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                        AutoKeyAddANSIData(CryptoData);
                        SetEncryptionMode(2);

                        SetSigCompressionMode(1);



                        SetImageXSize(500);
                        SetImageYSize(100);
                        SetImagePenWidth(5);
                        GetSigImageB64(SignedImageCallback);
                        function SignedImageCallback(str) {

                            var convertedSignatureObj = "data:image/png;base64," + str;

                            $scope.signPlusObj.StaffSignString = convertedSignatureObj;

                            // $scope.signPlusObj.patientreadyToSign = false;

                            console.log($scope.signPlusObj.StaffSignString);
                            alertify.success("Signature added Successfully ");
                            if (savetype == 'complete') {
                                $scope.savecompleteSignature();
                            }
                            else {
                                if (pageNo !== 0) {
                                    $scope.signaturesTab.activeSigatureTab = pageNo;
                                }
                            }


                        }


                    }
                }

                $scope.OnLoadPatientSignature = function () {



                    eHnoteSettingsDataService.GetPatientEncryptedSig($scope.mainObject.PatientId, 0).then(function (response) {
                        console.log(response);
                        response.data.PatientEncryptedSig = response.data.PatientEncryptedSig || "";
                        if (response.data.PatientEncryptedSig != "") {
                            $scope.signPlusObj.patientreadyToSign = true;
                            $scope.signPlusObj.IsPatientDigitalSignTaken = true;
                            var canvas = document.getElementById('signPatientPadUD');
                            var context = canvas.getContext('2d');
                            var image = new Image();
                            image.onload = function () {
                                /*   context.drawImage(image, 0, 0);*/
                                var centerX = canvas.width / 2 - image.width / 2;
                                var centerY = canvas.height / 2 - image.height / 2;
                                context.drawImage(image, centerX, centerY);
                            };
                            image.src = response.data.PatientEncryptedSig;

                            $scope.signPlusObj.PatientSignString = response.data.PatientEncryptedSig;
                            if (response.data.PatientIntialEncryptedSig != "") {

                                $scope.signPlusObj.PatientIntialSignString = response.data.PatientIntialEncryptedSig || "";
                                var canvaspi = document.getElementById('signPatientIntialPadUD');
                                var contextpi = canvaspi.getContext('2d');
                                var imagepi = new Image();
                                imagepi.onload = function () {
                                    /*   context.drawImage(image, 0, 0);*/
                                    var centerXp = canvaspi.width / 2 - imagepi.width / 2;
                                    var centerYp = canvaspi.height / 2 - imagepi.height / 2;
                                    // contextp.drawImage(imagep, centerXp, centerYp);
                                    contextpi.drawImage(imagepi, 0, 0, canvaspi.width, canvaspi.height);
                                };
                                imagepi.src = response.data.PatientIntialEncryptedSig;
                            }
                        } else {
                            alertify.error("Patient Dosent have Saved Sign");
                            return false;
                        }


                    }, function (err) {
                        console.log(err);
                    });
                }


                $scope.OnLoadUserSignature = function (obj, type, cId) {

                    obj = obj || "";
                    if (obj != "") {
                        eHnoteSettingsDataService.GetUserEncryptedSig(obj.DoctorID).then(function (response) {
                            console.log(response);

                            response.data.UserEncryptedSig = response.data.UserEncryptedSig || "";

                            if (response.data.UserEncryptedSig == '') {
                                alertify.error("There is no signature added for this user");
                                return false;
                            }

                            if (response.data.UserEncryptedSig != "") {


                                var canvas = document.getElementById(cId);
                                var context = canvas.getContext('2d');
                                var image = new Image();
                                image.onload = function () {
                                    //context.drawImage(image, 0, 0);
                                    var centerX = canvas.width / 2 - image.width / 2;
                                    var centerY = canvas.height / 2 - image.height / 2;
                                    context.drawImage(image, centerX, centerY);
                                };
                                image.src = response.data.UserEncryptedSig;

                                if (type == 'Staff') {
                                    $scope.signPlusObj.staffreadyToSign = true;
                                    $scope.signPlusObj.IsStaffDigitalSignTaken = true;
                                    $scope.signPlusObj.StaffSignString = response.data.UserEncryptedSig;
                                }
                                else if (type == 'Provider') {
                                    $scope.signPlusObj.providerreadyToSign = true;
                                    $scope.signPlusObj.IsProviderDigitalSignTaken = true;
                                    $scope.signPlusObj.ProviderSignString = response.data.UserEncryptedSig;
                                }
                                else if (type == 'Counselor') {
                                    $scope.signPlusObj.counselorreadyToSign = true;
                                    $scope.signPlusObj.IsCounselorDigitalSignTaken = true;
                                    $scope.signPlusObj.CounselorSignString = response.data.UserEncryptedSig;
                                }
                                else if (type == 'Anesthesist') {
                                    $scope.signPlusObj.anesthesistreadyToSign = true;
                                    $scope.signPlusObj.IsAnesthesistDigitalSignTaken = true;
                                    $scope.signPlusObj.AnesthesistSignString = response.data.UserEncryptedSig;
                                }
                            }

                        }, function (err) {
                            console.log(err);
                        });
                    } else {
                        alertify.error("please select a user");
                        return false;
                    }
                }
                $scope.PatientValidateLoadSignOff = function (obj, type, cId) {

                    let DoctorId = null;

                    if (type == 'Staff') {
                        $scope.signPlusObj.StaffUserId = $scope.signPlusObj.StaffUserId || null;
                        $scope.signPlusObj.ValidatePassword = $scope.signPlusObj.ValidatePassword || "";
                        $scope.signPlusObj.DoctorId = $scope.signPlusObj.StaffUserId || null;
                    }

                    if (type == 'Provider') {
                        $scope.signPlusObj.ProviderUserId = $scope.signPlusObj.ProviderUserId || null;
                        $scope.signPlusObj.DoctorId = $scope.signPlusObj.ProviderUserId;
                        $scope.signPlusObj.ValidatePassword = $scope.signPlusObj.ValidatePassword || "";

                    }
                    if (type == 'Counselor') {
                        $scope.signPlusObj.CounselorUserId = $scope.signPlusObj.CounselorUserId || null;
                        $scope.signPlusObj.DoctorId = $scope.signPlusObj.CounselorUserId;
                        $scope.signPlusObj.ValidatePassword = $scope.signPlusObj.ValidatePassword || "";

                    }
                    if (type == 'Anesthesist') {
                        $scope.signPlusObj.AnesthesistUserId = $scope.signPlusObj.AnesthesistUserId || null;
                        $scope.signPlusObj.DoctorId = $scope.signPlusObj.AnesthesistUserId;
                        $scope.signPlusObj.ValidatePassword = $scope.signPlusObj.ValidatePassword || "";

                    }

                    if ($scope.signPlusObj.DoctorId == null) {
                        alertify.error("Select User");
                        return false;
                    }


                    $scope.signPlusObj.ValidatePassword = $scope.signPlusObj.ValidatePassword || "";
                    if ($scope.signPlusObj.ValidatePassword == "") {
                        alertify.error("Please Enter Valid Password");
                        return false;
                    }

                    let params = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "OrganizationId": $scope.HospitalId,
                        "PatientId": $scope.cacheStorageItem.PatientId || 0,
                        "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                        "SignatureUserId": $scope.signPlusObj.DoctorId || null,
                        "SignaturePassword": $scope.signPlusObj.ValidatePassword || "",
                        "ConsentFormId": 0
                    }

                    eHnoteSettingsDataService.GetValidateConsentUserSig(params).then(function (response) {
                        console.log(JSON.stringify(response));
                        if (response.data.status == "Success") {



                            response.data.UserEncryptedSig = response.data.UserEncryptedSig || "";

                            if (response.data.UserEncryptedSig =='') {
                                alertify.error("There is no signature added for this user");
                                return false;
                            }
                            if (response.data.UserEncryptedSig != "") {
                                var canvas = document.getElementById(cId);
                                var context = canvas.getContext('2d');
                                var image = new Image();
                                image.onload = function () {
                                    //context.drawImage(image, 0, 0);
                                    var centerX = canvas.width / 2 - image.width / 2;
                                    var centerY = canvas.height / 2 - image.height / 2;
                                    context.drawImage(image, centerX, centerY);
                                };
                                image.src = response.data.UserEncryptedSig;
                                $scope.signPlusObj.ValidatePassword = "";
                                if (type == 'Staff') {
                                    $scope.signPlusObj.staffreadyToSign = true;
                                    $scope.signPlusObj.IsStaffDigitalSignTaken = true;
                                    $scope.signPlusObj.StaffSignString = response.data.UserEncryptedSig;

                                }
                                else if (type == 'Provider') {
                                    $scope.signPlusObj.providerreadyToSign = true;
                                    $scope.signPlusObj.IsProviderDigitalSignTaken = true;
                                    $scope.signPlusObj.ProviderSignString = response.data.UserEncryptedSig;
                                }
                                else if (type == 'Counselor') {
                                    $scope.signPlusObj.counselorreadyToSign = true;
                                    $scope.signPlusObj.IsCounselorDigitalSignTaken = true;
                                    $scope.signPlusObj.CounselorSignString = response.data.UserEncryptedSig;
                                }
                                else if (type == 'Anesthesist') {
                                    $scope.signPlusObj.anesthesistreadyToSign = true;
                                    $scope.signPlusObj.IsAnesthesistDigitalSignTaken = true;
                                    $scope.signPlusObj.AnesthesistSignString = response.data.UserEncryptedSig;
                                }
                            }

                        } else if (response.data.Status == "Failure") {
                            $scope.signPlusObj.ValidatePassword = "";
                            alertify.error("Invalid Password");
                            return false;
                        }

                    }, function (err) {
                        console.log(err);
                    });
                };
                $scope.OnSignPatientSignature = function () {
                    $scope.signPlusObj.patientreadyToSign = true;
                    $scope.signPlusObj.IsPatientDigitalSignTaken = false;
                    $scope.signPlusObj.PatientSignBy = "Topaz";

                    if (IsSigWebInstalled()) {
                        var ctx = document.getElementById('signPatientPadUD').getContext('2d');
                        SetDisplayPenWidth(5);
                        SetDisplayXSize(1200);
                        SetDisplayYSize(700);
                        SetTabletState(0, tmr);
                        // SetJustifyMode(0);
                        SetJustifyMode(5)
                        ClearTablet();
                        SetEncryptionMode(3);
                        AutoKeyAddData("0000000000000000");
                        SetKeyString("0000000000000000");

                        // SetSigString()
                        if (tmr == null) {
                            tmr = SetTabletState(1, ctx, 50);
                        }
                        else {
                            SetTabletState(0, tmr);
                            tmr = null;
                            tmr = SetTabletState(1, ctx, 50);
                        }

                    } else {
                        alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                    }
                };
                $scope.OnClearPatientSignature = function () {
                    ClearTablet();
                    var canvas = document.getElementById('signPatientPadUD');
                    var context = canvas.getContext('2d');
                    // Clear the canvas
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    $scope.signPlusObj.IsPatientDigitalSignTaken = false;
                    $scope.signPlusObj.PatientSignBy = 'Drawing';
                    $scope.signPlusObj.PatientSignString = '';
                    //4-9-24
                    //$scope.MainPatientSignedObj.PatientSignedDateTime = "";
                    //$scope.MainPatientSignedObj.PatientSignCaptureUserId = 0;
                    //$scope.MainPatientSignedObj.IsPatientSignatureDone = false;
                    //patientintial
                    //var intialcanvas = document.getElementById('signPatientIntialPadUD');
                    //var intialcontext = intialcanvas.getContext('2d');
                    //intialcontext.clearRect(0, 0, intialcanvas.width, intialcanvas.height);
                    //$scope.signPlusObj.PatientIntialSignString = '';
                    //patientintial
                    //var PatientSignatureelements = document.querySelectorAll('[id^="NPatientSignature"]');
                    //PatientSignatureelements.forEach(function (element) {
                    //    if (element.querySelector('table')) {
                    //        element.innerHTML = '##PatientSignature##';
                    //    }
                    //});

                    //var PatientSignatureDateelements = document.querySelectorAll('[id^="NPatientSignDateTime"]');
                    //PatientSignatureDateelements.forEach(function (element) {
                    //    element.innerHTML = '##PatientSignDateTime##';
                    //});
                }
                $scope.OnClearPatientIntialSignature = function () {
                    var intialcanvas = document.getElementById('signPatientIntialPadUD');
                    var intialcontext = intialcanvas.getContext('2d');
                    intialcontext.clearRect(0, 0, intialcanvas.width, intialcanvas.height);
                    $scope.signPlusObj.PatientIntialSignString = '';
                    //4-9-24
                    //$scope.MainPatientSignedObj.IsPatientInitialSignatureDone = false;
                    //var PatientSignatureelements = document.querySelectorAll('[id^="NPatientIntialSignature"]');
                    //PatientSignatureelements.forEach(function (element) {
                    //    if (element.querySelector('table')) {
                    //        element.innerHTML = '##PatientIntialSignature##';
                    //    }
                    //});
                }
                $scope.savePatientSignatureDraw = function (pageno, type) {
                    var tabno = pageno || 0;
                    var savetype = type || "";
                    if (NumberOfTabletPoints() == 0) {
                        // alert("Please sign before continuing");
                        alertify.error("Please add Signature");
                    }
                    else {
                        SetTabletState(0, tmr);




                        var CryptoData = "";
                        CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                        CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                        AutoKeyAddANSIData(CryptoData);
                        SetEncryptionMode(2);

                        SetSigCompressionMode(1);



                        SetImageXSize(500);
                        SetImageYSize(100);
                        SetImagePenWidth(20);
                        GetSigImageB64(SignedImageCallback);
                        function SignedImageCallback(str) {

                            var convertedSignatureObj = "data:image/png;base64," + str;

                            $scope.signPlusObj.PatientSignString = convertedSignatureObj;

                            // $scope.signPlusObj.patientreadyToSign = false;

                            console.log($scope.signPlusObj.PatientSignString);

                            alertify.success("Signature added Successfully ");

                            if (savetype == "complete") {
                                $scope.savecompleteSignature();
                            } else {
                                if (tabno !== 0) {
                                    $scope.signaturesTab.activeSigatureTab = tabno;
                                }
                            }

                        }


                    }
                }

                $scope.savePatientSignatureDrawtoDB = function (pageno, type) {
                    var tabno = pageno || 0;
                    var savetype = type || "";
                    //$scope.signPlusObj.PatientSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                    $scope.signPlusObj.PatientSignedDateTime = $scope.SignatureDateTimeEdit.PatientDateTime ||
                        moment(new Date()).format("MM-DD-YYYY hh:mm A");
                    if ($scope.signPlusObj.PatientSignBy == "Topaz") {
                        if (NumberOfTabletPoints() == 0) {
                            // alert("Please sign before continuing");
                            if ($scope.MainPatientSignedObj.IsPatientSignatureDone) {
                                if (savetype == "complete") {
                                    $scope.savecompleteSignature();
                                } else {
                                    if (tabno !== 0) {
                                        $scope.signaturesTab.activeSigatureTab = tabno;
                                    }
                                }
                            } else {
                                alertify.error("Please sign to continue");
                            }
                        }
                        else {
                            SetTabletState(0, tmr);
                            var CryptoData = "";
                            CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                            CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                            AutoKeyAddANSIData(CryptoData);
                            SetEncryptionMode(2);

                            SetSigCompressionMode(2);



                            SetImageXSize(1200);
                            SetImageYSize(800);
                            SetImagePenWidth(10);

                            //var PatientEncryptedTopazSig = GetSigString();

                            //console.log(PatientEncryptedTopazSig);

                            if ($scope.signPlusObj.ShowPatientCanvas) {
                                GetSigImageB64(SignedImageCallback);
                                function SignedImageCallback(str) {

                                    var convertedSignatureObj = "data:image/png;base64," + str;

                                    $scope.signPlusObj.PatientSignString = convertedSignatureObj;

                                    // $scope.signPlusObj.patientreadyToSign = false;

                                    console.log($scope.signPlusObj.PatientSignString);

                                    if (savetype == "complete") {
                                        $scope.savecompleteSignature();
                                    } else {
                                        if (tabno !== 0) {
                                            $scope.signaturesTab.activeSigatureTab = tabno;

                                            if ($scope.signaturesTab.activeSigatureTab === 2 && $scope.ParentObject.UserId == $scope.signPlusObj.StaffUserId && $scope.signPlusObj.StaffSignString == '') {
                                                $scope.OnLoadUserSignature($scope.signPlusObj.StaffUserObj, 'Staff', 'signStaffPadUD');
                                            }
                                            if ($scope.signaturesTab.activeSigatureTab === 3 && $scope.ParentObject.UserId == $scope.signPlusObj.ProviderUserId && $scope.signPlusObj.ProviderSignString == '') {
                                                $scope.OnLoadUserSignature($scope.signPlusObj.ProviderUserObj, 'Provider', 'signProviderPadUD');
                                            }
                                            if ($scope.signaturesTab.activeSigatureTab === 4 && $scope.ParentObject.UserId == $scope.signPlusObj.CounselorUserId && $scope.signPlusObj.CounselorSignString == '') {
                                                $scope.OnLoadUserSignature($scope.signPlusObj.CounselorUserObj, 'Counselor', 'signCounsellorPadUD');
                                            }
                                            if ($scope.signaturesTab.activeSigatureTab === 5 && $scope.ParentObject.UserId == $scope.signPlusObj.AnesthesistUserId && $scope.signPlusObj.AnesthesistSignString == '') {
                                                $scope.OnLoadUserSignature($scope.signPlusObj.AnesthesistUserObj, 'Anesthesist', 'signAnesthesistPadUD');
                                            }
                                        }
                                    }

                                    //var params = {
                                    //    "PatientId": $scope.mainObject.PatientId,
                                    //    "UserId": $scope.UserId,
                                    //    "IsPatientSigUsedFurther": true,
                                    //    "PatientEncryptedSig": $scope.signPlusObj.PatientSignString
                                    //}

                                    //eHnoteSettingsDataService.UpdatePatientTopazEncryptSig(params).then(function (resp) {
                                    //    console.log(resp);
                                    //    alertify.success("Signature added Successfully");

                                    //    if (savetype == "complete") {
                                    //        $scope.savecompleteSignature();
                                    //    } else {
                                    //        if (tabno !== 0) {
                                    //            $scope.signaturesTab.activeSigatureTab = tabno;
                                    //        }
                                    //    }
                                    //}, function (err) {
                                    //    console.log(err);
                                    //});

                                }

                            } else if ($scope.signPlusObj.ShowPatientInitialCanvas) {
                                GetSigImageB64(SignedImageCallback);
                                function SignedImageCallback(str2) {

                                    var convertedSignatureObj2 = "data:image/png;base64," + str2;
                                    $scope.signPlusObj.PatientIntialSignString = convertedSignatureObj2;

                                    if (savetype == "complete") {
                                        $scope.savecompleteSignature();
                                    } else {
                                        if (tabno !== 0) {
                                            $scope.signaturesTab.activeSigatureTab = tabno;
                                        }
                                    }
                                }

                            } else { }

                        }
                    } else {
                        if ($scope.signPlusObj.ShowPatientCanvas) {
                            var canvas = document.getElementById('signPatientPadUD');
                            var sign = canvas.toDataURL();
                            //if (savetype !== '' && sign === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGJJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAgQdWMQCX4yW9owAAAABJRU5ErkJggg==') {
                            if (savetype !== '' && sign === 'data:image/png;base64,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') {
                                alertify.error("Please sign to continue");
                                return false;
                            }
                            if (sign !== 'data:image/png;base64,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') {
                                $scope.signPlusObj.PatientSignString = sign;
                            }
                        }
                        if ($scope.signPlusObj.ShowPatientInitialCanvas) {
                            var intialcanvas = document.getElementById('signPatientIntialPadUD');
                            var sign2 = intialcanvas.toDataURL();
                            if (savetype !== '' && sign2 === 'data:image/png;base64,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') {
                                alertify.error("Please sign to continue");
                                return false;
                            }
                            if (sign2 !== 'data:image/png;base64,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') {
                                $scope.signPlusObj.PatientIntialSignString = sign2;
                            }
                        }

                        // $scope.signPlusObj.patientreadyToSign = false;


                        if (savetype == "complete") {
                            $scope.savecompleteSignature();
                        } else {
                            if (tabno !== 0) {
                                $scope.signaturesTab.activeSigatureTab = tabno;
                            }
                        }

                        //var params = {
                        //    "PatientId": $scope.mainObject.PatientId,
                        //    "UserId": $scope.UserId,
                        //    "IsPatientSigUsedFurther": true,
                        //    "PatientEncryptedSig": $scope.signPlusObj.PatientSignString
                        //}

                        //eHnoteSettingsDataService.UpdatePatientTopazEncryptSig(params).then(function (resp) {
                        //    console.log(resp);
                        //    alertify.success("Signature added Successfully");

                        //    if (savetype == "complete") {
                        //        $scope.savecompleteSignature();
                        //    } else {
                        //        if (tabno !== 0) {
                        //            $scope.signaturesTab.activeSigatureTab = tabno;
                        //        }
                        //    }
                        //}, function (err) {
                        //    console.log(err);
                        //});
                    }


                }

                $scope.saveUserSignatureDrawtoDB = function (obj, type, pageno, savetype, signtype) {
                    var tabno = pageno || 0;
                    var savetype = savetype || "";
                    var digitalsigntype = signtype || "Drawing";
                    var signedDateTime;
                    switch (type) {
                        case 'Staff':
                            signedDateTime = $scope.SignatureDateTimeEdit.StaffDateTime ||
                                moment(new Date()).format("MM-DD-YYYY hh:mm A");
                            break;
                        case 'Provider':
                            signedDateTime = $scope.SignatureDateTimeEdit.ProviderDateTime ||
                                moment(new Date()).format("MM-DD-YYYY hh:mm A");
                            break;
                        case 'Counselor':
                            signedDateTime = $scope.SignatureDateTimeEdit.CounselorDateTime ||
                                moment(new Date()).format("MM-DD-YYYY hh:mm A");
                            break;
                        case 'Anesthesist':
                            signedDateTime = $scope.SignatureDateTimeEdit.AnesthesistDateTime ||
                                moment(new Date()).format("MM-DD-YYYY hh:mm A");
                            break;
                        default:
                            signedDateTime = moment(new Date()).format("MM-DD-YYYY hh:mm A");
                    }

                    // Set the signed datetime for the specific type
           
                    if (digitalsigntype == "Topaz") {

                        if (NumberOfTabletPoints() == 0) {
                            // alert("Please sign before continuing");
                            if ($scope.MainPatientSignedObj.IsStaffSignatureDone) {
                                if (savetype == "complete") {
                                    $scope.savecompleteSignature();
                                } else {
                                    if (tabno !== 0) {
                                        $scope.signaturesTab.activeSigatureTab = tabno;
                                    }
                                }
                            } else {
                                alertify.error("Please add Signature");
                            }
                        }
                        else {
                            SetTabletState(0, tmr);




                            var CryptoData = "";
                            CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                            CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                            AutoKeyAddANSIData(CryptoData);
                            SetEncryptionMode(2);

                            SetSigCompressionMode(1);




                            SetImageXSize(1200);
                            SetImageYSize(800);
                            SetImagePenWidth(10);
                            GetSigImageB64(SignedImageCallback);
                            function SignedImageCallback(str) {

                                var convertedSignatureObj = "data:image/png;base64," + str;

                                var siguserid = 0;

                                if (type == 'Staff') {
                                    $scope.signPlusObj.StaffSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                    $scope.signPlusObj.StaffSignString = convertedSignatureObj;
                                    siguserid = $scope.signPlusObj.StaffUserId;
                                }
                                else if (type == 'Provider') {
                                    $scope.signPlusObj.ProviderSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                    siguserid = $scope.signPlusObj.ProviderUserId;
                                    $scope.signPlusObj.ProviderSignString = convertedSignatureObj;
                                }
                                else if (type == 'Counselor') {
                                    $scope.signPlusObj.CounselorSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                    siguserid = $scope.signPlusObj.CounselorUserId;
                                    $scope.signPlusObj.CounselorSignString = convertedSignatureObj;
                                }
                                else if (type == 'Anesthesist') {
                                    $scope.signPlusObj.AnesthesistSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                    siguserid = $scope.signPlusObj.AnesthesistUserId;
                                    $scope.signPlusObj.AnesthesistSignString = convertedSignatureObj;
                                }


                                // $scope.signPlusObj.patientreadyToSign = false;


                                if (savetype == "complete") {
                                    $scope.savecompleteSignature();
                                } else {
                                    if (tabno !== 0) {
                                        $scope.signaturesTab.activeSigatureTab = tabno;
                                    }
                                }


                                //var params = {
                                //    "SigUserId": siguserid,
                                //    "UserId": $scope.UserId,
                                //    "IsUserSigUsedFurther": true,
                                //    "UserEncryptedSig": convertedSignatureObj
                                //}

                                //eHnoteSettingsDataService.UpdateUserTopazEncryptSig(params).then(function (resp) {
                                //    console.log(resp);
                                //    alertify.success("Signature added Successfully ");
                                //    if (savetype == "complete") {
                                //        $scope.savecompleteSignature();
                                //    } else {
                                //        if (tabno !== 0) {
                                //            $scope.signaturesTab.activeSigatureTab = tabno;
                                //        }
                                //    }
                                //}, function (err) {
                                //    console.log(err);
                                //});

                            }


                        }
                    } else {

                        var canvasId = "";
                        if (type == "Staff") {
                            canvasId = "signStaffPadUD";
                            if ($scope.signPlusObj.StaffUserId == 0) {
                                alertify.error("please select a user");
                                return false;
                            }
                        }
                        else if (type == "Provider") {
                            canvasId = "signProviderPadUD";
                            if ($scope.signPlusObj.ProviderUserId == 0) {
                                alertify.error("please select a user");
                                return false;
                            }
                        }
                        else if (type == "Counselor") {
                            canvasId = "signCounsellorPadUD";
                            if ($scope.signPlusObj.CounselorUserId == 0) {
                                alertify.error("please select a user");
                                return false;
                            }
                        }
                        else if (type == "Anesthesist") {
                            canvasId = "signAnesthesistPadUD";
                            if ($scope.signPlusObj.AnesthesistUserId == 0) {
                                alertify.error("please select a user");
                                return false;
                            }
                        }
                        var canvas = document.getElementById(canvasId);
                        var convertedSignatureObj = canvas.toDataURL();

                        console.log(convertedSignatureObj);


                        if (convertedSignatureObj === 'data:image/png;base64,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') {
                            alertify.error("Please sign to continue");
                            return false;
                        }


                        var siguserid = 0;

                        if (type == 'Staff') {
                            $scope.signPlusObj.StaffSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                            $scope.signPlusObj.StaffSignString = convertedSignatureObj;
                            siguserid = $scope.signPlusObj.StaffUserId;
                        }
                        else if (type == 'Provider') {
                            $scope.signPlusObj.ProviderSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                            siguserid = $scope.signPlusObj.ProviderUserId;
                            $scope.signPlusObj.ProviderSignString = convertedSignatureObj;
                        }
                        else if (type == 'Counselor') {
                            $scope.signPlusObj.CounselorSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                            siguserid = $scope.signPlusObj.CounselorUserId;
                            $scope.signPlusObj.CounselorSignString = convertedSignatureObj;
                        }
                        else if (type == 'Anesthesist') {
                            $scope.signPlusObj.AnesthesistSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                            siguserid = $scope.signPlusObj.AnesthesistUserId;
                            $scope.signPlusObj.AnesthesistSignString = convertedSignatureObj;
                        }
                        if (type == 'Staff') {
                            $scope.signPlusObj.StaffSignedDateTime = signedDateTime;
                        } else if (type == 'Provider') {
                            $scope.signPlusObj.ProviderSignedDateTime = signedDateTime;
                        } else if (type == 'Counselor') {
                            $scope.signPlusObj.CounselorSignedDateTime = signedDateTime;
                        } else if (type == 'Anesthesist') {
                            $scope.signPlusObj.AnesthesistSignedDateTime = signedDateTime;
                        }

                        // $scope.signPlusObj.patientreadyToSign = false;


                        if (savetype == "complete") {
                            $scope.savecompleteSignature();
                        } else {
                            if (tabno !== 0) {
                                $scope.signaturesTab.activeSigatureTab = tabno;
                            }
                        }


                        //var params = {
                        //    "SigUserId": siguserid,
                        //    "UserId": $scope.UserId,
                        //    "IsUserSigUsedFurther": true,
                        //    "UserEncryptedSig": convertedSignatureObj
                        //}

                        //eHnoteSettingsDataService.UpdateUserTopazEncryptSig(params).then(function (resp) {
                        //    console.log(resp);
                        //    alertify.success("Signature added Successfully ");
                        //    if (savetype == "complete") {
                        //        $scope.savecompleteSignature();
                        //    } else {
                        //        if (tabno !== 0) {
                        //            $scope.signaturesTab.activeSigatureTab = tabno;
                        //        }
                        //    }
                        //}, function (err) {
                        //    console.log(err);
                        //});

                    }


                }

                $scope.closeuib = function () {

                    var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'> Do you want Update the Signature's?</h4>", function () {


                        // Staff
                        var StaffSignatureelements = document.querySelectorAll('[id^="NStaffSignature"]');
                        StaffSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##StaffSignature##';
                            }
                        });

                        var StaffSignatureDateelements = document.querySelectorAll('[id^="NStaffSignedDateTime"]');
                        StaffSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##StaffSignedDateTime##';
                        });

                        //Provider
                        var ProviderSignatureelements = document.querySelectorAll('[id^="NProviderSignature"]');
                        ProviderSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##ProviderSignature##';
                            }
                        });
                        var ProviderSignatureDateelements = document.querySelectorAll('[id^="NProviderSignedDateTime"]');
                        ProviderSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##ProviderSignedDateTime##';
                        });


                        //Counselor
                        var CounselorSignatureelements = document.querySelectorAll('[id^="NCounselorSignature"]');
                        CounselorSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##CounselorSignature##';
                            }
                        });

                        var CounselorSignatureDateelements = document.querySelectorAll('[id^="NCounselorSignDateTime"]');
                        CounselorSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##CounselorSignDateTime##';
                        });


                        //Anesthesia
                        var AnesthesiaSignatureelements = document.querySelectorAll('[id^="NAnesthesistSignature"]');
                        AnesthesiaSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##AnesthesistSignature##';
                            }
                        });

                        var AnesthesiaSignatureDateelements = document.querySelectorAll('[id^="NAnesthesistSignDateTime"]');
                        AnesthesiaSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##AnesthesistSignDateTime##';
                        });

                        // Patient Sign
                        var PatientSignatureelements = document.querySelectorAll('[id^="NPatientSignature"]');
                        PatientSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##PatientSignature##';
                            }
                        });

                        var PatientSignatureDateelements = document.querySelectorAll('[id^="NPatientSignDateTime"]');
                        PatientSignatureDateelements.forEach(function (element) {
                            element.innerHTML = '##PatientSignDateTime##';
                        });

                        // Patient Intial 

                        var PatientSignatureelements = document.querySelectorAll('[id^="NPatientIntialSignature"]');
                        PatientSignatureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##PatientIntialSignature##';
                            }
                        });


                        //Gaurdian 

                        var GaurdianSigantureelements = document.querySelectorAll('[id^="NGaurdianSiganture"]');
                        GaurdianSigantureelements.forEach(function (element) {
                            if (element.querySelector('table')) {
                                element.innerHTML = '##GaurdianSiganture##';
                            }
                        });

                        var GaurdianSigantureDateelements = document.querySelectorAll('[id^="NGaurdianSignDateTime"]');
                        GaurdianSigantureDateelements.forEach(function (element) {
                            element.innerHTML = '##GaurdianSignDateTime##';
                        });



                        $uibModalInstance.close($scope.signPlusObj);

                    }, function () {

                        // click on the No

                        if ($scope.MainPatientSignedObj.PatientConsentDocumentId == 0) {

                            // Patient Sign

                            $scope.signPlusObj.PatientSignString = $scope.MainPatientSignedObj.PatientSignString || "";
                            $scope.signPlusObj.PatientIntialSignString = $scope.MainPatientSignedObj.PatientIntialSignString || "";

                            //Gaurdian

                            $scope.signPlusObj.GaurdianFirstName = $scope.MainPatientSignedObj.GaurdianFirstName || "";
                            $scope.signPlusObj.GaurdianLastName = $scope.MainPatientSignedObj.GaurdianLastName || "";
                            $scope.signPlusObj.GaurdianSignString = $scope.MainPatientSignedObj.GaurdianSignString || "";

                            //Provider

                            $scope.signPlusObj.ProviderUserId = $scope.MainPatientSignedObj.ProviderUserId || 0;
                            $scope.signPlusObj.ProviderUserName = $scope.MainPatientSignedObj.ProviderUserName || "";
                            $scope.signPlusObj.ProviderSignString = $scope.MainPatientSignedObj.ProviderSignString || "";
                            $scope.signPlusObj.ProviderUserObj = $scope.MainPatientSignedObj.ProviderUserObj;

                            // Staff

                            $scope.signPlusObj.StaffUserId = $scope.MainPatientSignedObj.StaffUserId || 0;
                            $scope.signPlusObj.StaffUserName = $scope.MainPatientSignedObj.StaffUserName || "";
                            $scope.signPlusObj.StaffSignString = $scope.MainPatientSignedObj.StaffSignString || "";
                            $scope.signPlusObj.StaffUserObj = $scope.MainPatientSignedObj.StaffUserObj;

                            //Counselor

                            $scope.signPlusObj.CounselorUserId = $scope.MainPatientSignedObj.CounselorUserId || 0;
                            $scope.signPlusObj.CounselorUserName = $scope.MainPatientSignedObj.CounselorUserName || "";
                            $scope.signPlusObj.CounselorSignString = $scope.MainPatientSignedObj.CounselorSignString || "";
                            $scope.signPlusObj.CounselorUserObj = $scope.MainPatientSignedObj.CounselorUserObj;

                            //Anesthesia

                            $scope.signPlusObj.AnesthesistUserId = $scope.MainPatientSignedObj.AnesthesistUserId || 0;
                            $scope.signPlusObj.AnesthesistUserName = $scope.MainPatientSignedObj.AnesthesistUserName || "";
                            $scope.signPlusObj.AnesthesistSignString = $scope.MainPatientSignedObj.AnesthesistSignString || "";
                            $scope.signPlusObj.AnesthesistUserObj = $scope.MainPatientSignedObj.AnesthesistUserObj;



                        } else {

                            // Patien Sign

                            $scope.signPlusObj.PatientSignString = $scope.MainPatientSignedObj.PatientSignString || "";
                            $scope.signPlusObj.PatientIntialSignString = $scope.MainPatientSignedObj.PatientIntialSignString || "";

                            //Gaurdian

                            $scope.signPlusObj.GaurdianFirstName = $scope.MainPatientSignedObj.GaurdianFirstName || "";
                            $scope.signPlusObj.GaurdianLastName = $scope.MainPatientSignedObj.GaurdianLastName || "";
                            $scope.signPlusObj.GaurdianSignString = $scope.MainPatientSignedObj.GaurdianSignString || "";

                            //Provider

                            $scope.signPlusObj.ProviderSignString = $scope.MainPatientSignedObj.ProviderSignString || "";
                            $scope.signPlusObj.ProviderUserId = $scope.MainPatientSignedObj.ProviderUserId || 0;
                            $scope.signPlusObj.ProviderUserObj = $scope.MainPatientSignedObj.ProviderUserObj || "";

                            // Staff

                            $scope.signPlusObj.StaffUserObj  = $scope.MainPatientSignedObj.StaffUserObj || "";
                            $scope.signPlusObj.StaffUserId = $scope.MainPatientSignedObj.StaffUserId || 0;
                            $scope.signPlusObj.StaffSignString = $scope.MainPatientSignedObj.StaffSignString || "";

                            //Anesthesia

                            $scope.signPlusObj.AnesthesistUserObj = $scope.signPlusObj.AnesthesistUserObj;
                            $scope.signPlusObj.AnesthesistUserId = $scope.signPlusObj.AnesthesistUserId || 0;
                            $scope.signPlusObj.AnesthesistSignString = $scope.MainPatientSignedObj.AnesthesistSignString||"";

                            //Counselor

                            $scope.signPlusObj.CounselorUserId  = $scope.MainPatientSignedObj.CounselorUserId || 0;
                            $scope.signPlusObj.CounselorUserObj = $scope.MainPatientSignedObj.CounselorUserObj || "";
                            $scope.signPlusObj.CounselorSignString = $scope.MainPatientSignedObj.CounselorSignString||"";


                        }


                        //$uibModalInstance.dismiss("cancel");
                    });

                };

                function GetResetSupported() {
                    var minSigWebVersionResetSupport = "1.6.4.0";

                    if (isOlderSigWebVersionInstalled(minSigWebVersionResetSupport)) {
                        console.log("Old SigWeb version installed.");
                        return false;
                    }
                    return true;
                }

                function isOlderSigWebVersionInstalled(cmprVer) {
                    var sigWebVer = GetSigWebVersion();
                    if (sigWebVer != "") {
                        return isOlderVersion(cmprVer, sigWebVer);
                    } else {
                        return false;
                    }
                }

                function isOlderVersion(oldVer, newVer) {
                    const oldParts = oldVer.split('.')
                    const newParts = newVer.split('.')
                    for (var i = 0; i < newParts.length; i++) {
                        const a = parseInt(newParts[i]) || 0
                        const b = parseInt(oldParts[i]) || 0
                        if (a < b) return true
                        if (a > b) return false
                    }
                    return false;
                }


                $scope.onLoadSIg = function () {
                    if (IsSigWebInstalled()) {
                        resetIsSupported = GetResetSupported();
                        if (!resetIsSupported) {
                            var sigweb_link = document.createElement("a");
                            sigweb_link.href = "https://www.topazsystems.com/software/sigweb.exe";
                            sigweb_link.innerHTML = "https://www.topazsystems.com/software/sigweb.exe";

                            var note = document.getElementById("sigWebVrsnNote");
                            note.innerHTML = "There is a newer version of SigWeb available here: ";
                            note.appendChild(sigweb_link);
                        }

                        //$scope.OnSignPatientSignature();
                    }
                    else {
                        alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                    }
                }



                //$scope.signaturesTab.activeSigatureTab = 1;

                $scope.onLoadSIg();

                $scope.savecompleteSignature = function () {

                    $uibModalInstance.close($scope.signPlusObj);
                }

                $scope.OnSignPatientInitialSignature = function () {

                    if (IsSigWebInstalled()) {
                        var ctx = document.getElementById('signPatientIntialPadUD').getContext('2d');
                        SetDisplayPenWidth(5);
                        SetDisplayXSize(1200);
                        SetDisplayYSize(700);
                        SetTabletState(0, tmr);
                        // SetJustifyMode(0);
                        SetJustifyMode(5)
                        ClearTablet();
                        SetEncryptionMode(3);
                        AutoKeyAddData("0000000000000000");
                        SetKeyString("0000000000000000");

                        if (tmr == null) {
                            tmr = SetTabletState(1, ctx, 50);
                        }
                        else {
                            SetTabletState(0, tmr);
                            tmr = null;
                            tmr = SetTabletState(1, ctx, 50);
                        }

                    } else {
                        alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                    }
                };

                $scope.SavePatientSignacture = function (Subtype) {
                    $scope.savePatientSignatureDrawtoDB();
                    if (Subtype == 'PatientName') {
                        $scope.signPlusObj.ShowPatientCanvas = true;
                        $scope.signPlusObj.ShowPatientInitialCanvas = false;
                    } else {
                        $scope.signPlusObj.ShowPatientCanvas = false;
                        $scope.signPlusObj.ShowPatientInitialCanvas = true;
                    }
                    $scope.signPlusObj.PatientSignBy = "Drawing";
                }

                //if ($scope.signPlusObj.ProviderUserId != 0 && $scope.signPlusObj.ProviderValidate && $scope.signPlusObj.ProviderSignString == '') {
                //    $scope.OnLoadUserSignature($scope.signPlusObj.ProviderUserObj, 'Provider', 'signProviderPadUD');

                //} else if ($scope.signPlusObj.CounselorUserId != 0 && $scope.signPlusObj.CounselorValidate && $scope.signPlusObj.CounselorSignString == '') {
                //    $scope.OnLoadUserSignature($scope.signPlusObj.CounselorUserObj, 'Counselor', 'signCounsellorPadUD');

                //} else if ($scope.signPlusObj.AnesthesistUserId != 0 && $scope.signPlusObj.AnesthesistValidate && $scope.signPlusObj.AnesthesistSignString == '') {
                //    $scope.OnLoadUserSignature($scope.signPlusObj.AnesthesistUserObj, 'Anesthesist', 'signAnesthesistPadUD');

                //} else if ($scope.signPlusObj.StaffUserId != 0 && $scope.signPlusObj.StaffValidate && $scope.signPlusObj.StaffSignString == '') {
                //    $scope.OnLoadUserSignature($scope.signPlusObj.StaffUserObj, 'Staff', 'signStaffPadUD');

                //} else {

                //}
            }
        });
        $scope.mInstanceAdd.result.then(function (result) {
            console.log(result);




            $scope.GetSignatureDeleteObj.PatientSignature = false;
            $scope.GetSignatureDeleteObj.PatientIntialSignature = false;
            $scope.GetSignatureDeleteObj.StaffSignature = false;
            $scope.GetSignatureDeleteObj.ProviderSignature = false;
            $scope.GetSignatureDeleteObj.CounselorSignature = false;
            $scope.GetSignatureDeleteObj.AnesthesistSignature = false;
            $scope.GetSignatureDeleteObj.GaurdianSignature = false;

            if (result.PatientSignString !== "") {
                $scope.MainPatientSignedObj.IsPatientSignatureDone = true;
                $scope.signPlusObj.IsPatientDigitalSignTaken = true;
                $scope.MainPatientSignedObj.PatientSignCaptureUserId = $scope.signPlusObj.PatientSignCaptureUserId || 0;

                $scope.signPlusObj.PatientSignedDateTime = $scope.signPlusObj.PatientSignedDateTime || "";
                if ($scope.signPlusObj.PatientSignedDateTime != "") {
                    $scope.MainPatientSignedObj.PatientSignedDateTime = $scope.signPlusObj.PatientSignedDateTime;
                }
                else {
                    $scope.MainPatientSignedObj.PatientSignedDateTime = $scope.MainPatientSignedObj.PatientSignedDateTime || '';
                }
                if ($scope.MainPatientSignedObj.PatientSignCaptureUserId == 0) {
                    $scope.MainPatientSignedObj.PatientSignCaptureUserId = $scope.UserId;
                }

                $scope.MainPatientSignedObj.PatientSignString = result.PatientSignString;
                var PatientSigDateTimeElement = document.querySelectorAll('[id^="NPatientSignDateTime"]');
                PatientSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientSignDateTime##/g, $scope.MainPatientSignedObj.PatientSignedDateTime);
                });
                $scope.GetSignatureDeleteObj.PatientSignature = true;
                genPatientImg(result.PatientSignString);
            }
            if (result.PatientIntialSignString !== "") {
                $scope.MainPatientSignedObj.IsPatientInitialSignatureDone = true;
                $scope.GetSignatureDeleteObj.PatientIntialSignature = true;
                genPatientIntImg(result.PatientIntialSignString);
                $scope.MainPatientSignedObj.PatientIntialSignString = result.PatientIntialSignString;
            }
            if (result.StaffSignString !== "") {
                $scope.SignMainObj.StaffClearbutton = false;
                $scope.MainPatientSignedObj.IsStaffSignatureDone = true;
                $scope.signPlusObj.IsStaffDigitalSignTaken = true;
                $scope.MainPatientSignedObj.StaffUserId = result.StaffUserId || 0;
                $scope.MainPatientSignedObj.StaffUserName = result.StaffUserObj.FullName || "";
                $scope.MainPatientSignedObj.StaffSignString = result.StaffSignString;

                $scope.MainPatientSignedObj.StaffSignCaptureUserId = $scope.MainPatientSignedObj.StaffSignCaptureUserId || 0;
                $scope.signPlusObj.StaffSignedDateTime = $scope.signPlusObj.StaffSignedDateTime || "";
                if ($scope.signPlusObj.StaffSignedDateTime != "") {
                    $scope.MainPatientSignedObj.StaffSignedDateTime = $scope.signPlusObj.StaffSignedDateTime;
                }
                else {
                    $scope.MainPatientSignedObj.StaffSignedDateTime = $scope.MainPatientSignedObj.StaffSignedDateTime || '';
                }
                if ($scope.MainPatientSignedObj.StaffSignCaptureUserId == 0) {
                    $scope.MainPatientSignedObj.StaffSignCaptureUserId = $scope.UserId;
                }

                $scope.MainPatientSignedObj.StaffUserObj = result.StaffUserObj;
                var StaffSigDateTimeElement = document.querySelectorAll('[id^="NStaffSignedDateTime"]');
                StaffSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##StaffSignedDateTime##/g, $scope.MainPatientSignedObj.StaffSignedDateTime);
                });
                genStaffImg(result.StaffSignString);
                $scope.GetSignatureDeleteObj.StaffSignature = true;
            }
            if (result.ProviderSignString !== "") {
                $scope.SignMainObj.ProviderClearbutton = false;
                $scope.MainPatientSignedObj.IsProviderSignatureDone = true;
                $scope.signPlusObj.IsProviderDigitalSignTaken = true;
                $scope.MainPatientSignedObj.ProviderUserId = result.ProviderUserId || 0;
                $scope.MainPatientSignedObj.ProviderUserName = result.ProviderUserObj.FullName || "";
                $scope.MainPatientSignedObj.ProviderSignCaptureUserId = $scope.MainPatientSignedObj.ProviderSignCaptureUserId || 0;

                $scope.signPlusObj.ProviderSignedDateTime = $scope.signPlusObj.ProviderSignedDateTime || "";
                if ($scope.signPlusObj.ProviderSignedDateTime != "") {
                    $scope.MainPatientSignedObj.ProviderSignedDateTime = $scope.signPlusObj.ProviderSignedDateTime;
                }
                else {
                    $scope.MainPatientSignedObj.ProviderSignedDateTime = $scope.MainPatientSignedObj.ProviderSignedDateTime || '';
                }
                if ($scope.MainPatientSignedObj.ProviderSignCaptureUserId == 0) {
                    $scope.MainPatientSignedObj.ProviderSignCaptureUserId = $scope.UserId;
                }


                $scope.MainPatientSignedObj.ProviderSignString = result.ProviderSignString;

                var ProviderSigDateTimeElement = document.querySelectorAll('[id^="NProviderSignedDateTime"]');
                ProviderSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##ProviderSignedDateTime##/g, $scope.MainPatientSignedObj.ProviderSignedDateTime);
                });
                genProviderImg(result.ProviderSignString);
                $scope.GetSignatureDeleteObj.ProviderSignature = true;
            }
            if (result.CounselorSignString !== "") {
                $scope.SignMainObj.CounselorClearbutton = false;
                $scope.MainPatientSignedObj.IsCounselorSignatureDone = true;
                $scope.signPlusObj.IsCounselorDigitalSignTaken = true;
                $scope.MainPatientSignedObj.CounselorUserId = result.CounselorUserId || 0;
                $scope.MainPatientSignedObj.CounselorUserName = result.CounselorUserObj.FullName || "";
                $scope.MainPatientSignedObj.CounselorSignString = result.CounselorSignString;
                $scope.MainPatientSignedObj.CounselorSignCaptureUserId = $scope.MainPatientSignedObj.CounselorSignCaptureUserId || 0;
                $scope.signPlusObj.CounselorSignedDateTime = $scope.signPlusObj.CounselorSignedDateTime || "";
                if ($scope.signPlusObj.CounselorSignedDateTime != "") {
                    $scope.MainPatientSignedObj.CounselorSignedDateTime = $scope.signPlusObj.CounselorSignedDateTime;
                }
                else {
                    $scope.MainPatientSignedObj.CounselorSignedDateTime = $scope.MainPatientSignedObj.CounselorSignedDateTime || '';
                }
                if ($scope.MainPatientSignedObj.CounselorSignCaptureUserId == 0) {
                    $scope.MainPatientSignedObj.CounselorSignCaptureUserId = $scope.UserId;
                }


                $scope.MainPatientSignedObj.CounselorUserObj = result.CounselorUserObj;
                var CounselorSigDateTimeElement = document.querySelectorAll('[id^="NCounselorSignDateTime"]');
                CounselorSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##CounselorSignDateTime##/g, $scope.MainPatientSignedObj.CounselorSignedDateTime);
                });
                genCounselorImg(result.CounselorSignString);
                $scope.GetSignatureDeleteObj.CounselorSignature = true;
            }

            if (result.AnesthesistSignString !== "") {
                $scope.SignMainObj.AnesthesistClearbutton = false;
                $scope.MainPatientSignedObj.IsAnesthesistSignatureDone = true;
                $scope.signPlusObj.IsAnesthesistDigitalSignTaken = true;
                $scope.MainPatientSignedObj.AnesthesistUserId = result.AnesthesistUserId || 0;
                $scope.MainPatientSignedObj.AnesthesistUserName = result.AnesthesistUserObj.FullName || "";
                $scope.MainPatientSignedObj.AnesthesistSignString = result.AnesthesistSignString;
                $scope.MainPatientSignedObj.AnesthesistSignCaptureUserId = $scope.MainPatientSignedObj.AnesthesistSignCaptureUserId || 0;
                $scope.signPlusObj.AnesthesistSignedDateTime = $scope.signPlusObj.AnesthesistSignedDateTime || "";
                if ($scope.signPlusObj.AnesthesistSignedDateTime != "") {
                    $scope.MainPatientSignedObj.AnesthesistSignedDateTime = $scope.signPlusObj.AnesthesistSignedDateTime;
                }
                else {
                    $scope.MainPatientSignedObj.AnesthesistSignedDateTime = $scope.MainPatientSignedObj.AnesthesistSignedDateTime || '';
                }
                if ($scope.MainPatientSignedObj.AnesthesistSignCaptureUserId == 0) {
                    $scope.MainPatientSignedObj.AnesthesistSignCaptureUserId = $scope.UserId;
                }

                $scope.MainPatientSignedObj.AnesthesistUserObj = result.AnesthesistUserObj;
                var AnesthesistSigDateTimeElement = document.querySelectorAll('[id^="NAnesthesistSignDateTime"]');
                AnesthesistSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##AnesthesistSignDateTime##/g, $scope.MainPatientSignedObj.AnesthesistSignedDateTime);
                });
                if (result.AnesthesistUserObj && result.AnesthesistUserObj.FullName) {
                    const anesthesistName = result?.AnesthesistUserObj?.FullName || ""
                    let AnesthesistNameElement = document.querySelectorAll('[id^="NAnesthesiologistName"]');
                    AnesthesistNameElement.forEach(function (element) {
                        element.innerHTML = element.innerHTML.replace(/##AnesthesiologistName##/g, anesthesistName);
                    });
                }
                genAnesthesistImg(result.AnesthesistSignString);
                $scope.GetSignatureDeleteObj.AnesthesistSignature = true;
            }
            if (result.GaurdianSignString !== "") {
                $scope.MainPatientSignedObj.IsGaurdianSignatureDone = true;
                $scope.signPlusObj.IsGaurdianDigitalSignTaken = true;
                $scope.MainPatientSignedObj.GaurdianUserId = 0;
                $scope.MainPatientSignedObj.GaurdianUserName = "";
                $scope.MainPatientSignedObj.GaurdianFirstName = result.GaurdianFirstName;
                $scope.MainPatientSignedObj.GaurdianLastName = result.GaurdianLastName;
                $scope.MainPatientSignedObj.GaurdianSignString = result.GaurdianSignString;
                $scope.MainPatientSignedObj.GaurdianRelationShipId = result.GaurdianRelationShipId;
                $scope.signPlusObj.GaurdianSignedDateTime = $scope.signPlusObj.GaurdianSignedDateTime || "";
                if ($scope.signPlusObj.GaurdianSignedDateTime != "") {
                    $scope.MainPatientSignedObj.GaurdianSignedDateTime = $scope.signPlusObj.GaurdianSignedDateTime;
                }
                else {
                    $scope.MainPatientSignedObj.GaurdianSignedDateTime = $scope.MainPatientSignedObj.GaurdianSignedDateTime || '';
                }
                $scope.MainPatientSignedObj.GaurdianSignCaptureUserId = $scope.MainPatientSignedObj.GaurdianSignCaptureUserId || 0;
                if ($scope.MainPatientSignedObj.GaurdianSignCaptureUserId == 0) {
                    $scope.MainPatientSignedObj.GaurdianSignCaptureUserId = $scope.UserId;
                }

                var GaurdianSigDateTimeElement = document.querySelectorAll('[id^="NGaurdianSignDateTime"]');
                GaurdianSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##GaurdianSignDateTime##/g, $scope.MainPatientSignedObj.GaurdianSignedDateTime);
                });

                var relationshipname = "";

                let temparray = $filter('filter')($scope.RelationShipTypeList, { 'RelationId': $scope.signPlusObj.GaurdianRelationShipId }, true);
                if (temparray.length > 0) {
                    relationshipname = temparray[0].RelationName || "";
                }
                var GaurdianRelationShipElement = document.querySelectorAll('[id^="NGaurdianRelationShip"]');
                GaurdianRelationShipElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##GaurdianRelationShip##/g, relationshipname);
                });

                var GaurdianNameElement = document.querySelectorAll('[id^="NPatientGaurdianName"]');
                GaurdianNameElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientGaurdianName##/g, $scope.signPlusObj.GaurdianFirstName + " " + $scope.signPlusObj.GaurdianLastName);
                });
                gengaurdianImg(result.GaurdianSignString);
                $scope.GetSignatureDeleteObj.GaurdianSignature = true;
            }
            $scope.MainPatientSignedObj.PatientName = result.PatientName;




            if (($scope.ParentObject.UserId == result.ProviderUserId) || ($scope.ParentObject.UserId == $scope.MainPatientSignedObj.ProviderSignCaptureUserId)) {
                $scope.SignMainObj.ProviderClearbutton = false;
            } else {
                $scope.SignMainObj.ProviderClearbutton = true;
            }
            if (($scope.ParentObject.UserId == result.StaffUserId) || ($scope.ParentObject.UserId == $scope.MainPatientSignedObj.StaffSignCaptureUserId)) {
                $scope.SignMainObj.StaffClearbutton = false;
            } else {
                $scope.SignMainObj.StaffClearbutton = true;
            }

            if (($scope.ParentObject.UserId == result.CounselorUserId) || ($scope.ParentObject.UserId == $scope.MainPatientSignedObj.CounselorSignCaptureUserId)) {
                $scope.SignMainObj.CounselorClearbutton = false;
            } else {
                $scope.SignMainObj.CounselorClearbutton = true;
            }

            if (($scope.ParentObject.UserId == result.AnesthesistUserId) || ($scope.ParentObject.UserId == $scope.MainPatientSignedObj.AnesthesistSignCaptureUserId)) {
                $scope.SignMainObj.AnesthesistClearbutton = false;
            } else {
                $scope.SignMainObj.AnesthesistClearbutton = true;
            }



            $scope.fillCustomSignatureValues(result);
        }, function (cancel) {
        });
    };

    $scope.IsContentSaveBtnHide = false;
    var HEADER_CONFIG_REGEX = /<!--HEADER-CONFIG:([\s\S]*?)-->/;

    function extractHeaderConfig(htmlContent) {
        var match = htmlContent.match(HEADER_CONFIG_REGEX);
        if (match && match[1]) {
            try { return JSON.parse(match[1]); } catch (e) { return null; }
        }
        return null;
    }
    // calcTopMargin moved to USPrintService.HeaderHelpers.calcPdfTopMargin
    $scope.addUpdatePatientSignedDocument = function (isPartiallySigned) {
        $scope.IsContentSaveBtnHide = true;

        var H = USPrintService.HeaderHelpers;
        var fullHtml = $scope.selectedPatientTempConsentObj.HtmlContent || '';

        // Extract cfg + body using centralized helpers
        var cfg = H.extractHeaderConfig(fullHtml) || {};
        var hasHeader = cfg.IsApplied === true;
        var bodyHtml = H.extractBodyHtml(fullHtml);
        var headerHtml = hasHeader ? H.buildHeaderDiv(cfg) : '';

        // Combine header + body
        var completeHtml = headerHtml + bodyHtml;

        // Embed config into HTML (adds <!--HEADER-CONFIG:{...}--> comment)
        //var finalHtmlForDB = H.embedHeaderConfig(completeHtml, cfg);
        // Build pdfmake content nodes from body HTML (same as openPrintPreview does)
        var pdfmakehtmlcontent = H.buildPdfContent(bodyHtml);

        // Build the header fn and margin — one-liner each
        var headerFn = hasHeader ? H.buildPageHeader(cfg) : null;
        var dynamicTopMargin = hasHeader ? H.calcPdfTopMargin(cfg) : 40;

        var consentName = $scope.MainPatientSignedObj.ConsentFormName || '';

        var PrintInfo = {
            "htmlcontent": pdfmakehtmlcontent,
            "pdfHeader": headerFn,
            "consentName": consentName,
            "hasHeader": hasHeader,
            "topMargin": dynamicTopMargin
        };

        var file = USPrintService.GenerateAddPatientConsentDocumentPrint(PrintInfo);
        pdfMake.createPdf(file).getDataUrl(function (dataURL) {
            var base64result = dataURL.split(',')[1];
            continuetoAddPatientConsentDocumentSave(base64result, isPartiallySigned);
        });
        //let payload = {
        //    "HtmlContent": finalHtmlForDB,
        //    "HeaderCfg": cfg,
        //    "HeaderText": consentName,

        //}
        //eHnotePatientDataService.GenerateSignedConsentPdfBase64(payload)
        //    .then(base64 => continuetoAddPatientConsentDocumentSave(base64.data, isPartiallySigned))
        //    .catch(err => {
        //        console.warn('Puppeteer failed, falling back to pdfmake:', err);
        //    //    fallbackToPdfMake(isPartiallySigned, H, bodyHtml, cfg, consentName);
        //    });
    };
    //$scope.addUpdatePatientSignedDocument = function (isPartiallySigned) {
    //    $scope.IsContentSaveBtnHide = true;
    //    // var myInnerHtml = document.getElementById("htmlPatientTemplateconsent").innerHTML;
    //    //var myInnerHtml = $scope.selectedPatientTempConsentObj.HtmlContent;

    //    //  var editorContent = angular.element(document.querySelector('.ta-scroll-window')).html();

    //    var myInnerHtml = document.querySelector('[id^="taTextElement"]').innerHTML;
    //    console.log(myInnerHtml);

    //   // var pdfmakehtmlcontent = htmlToPdfmake(myInnerHtml);
    //    var container = document.createElement('div');
    //    container.innerHTML = myInnerHtml;

    //    // Remove dark mode styles manually
    //    container.querySelectorAll('*').forEach(el => {
    //        el.style.backgroundColor = 'white';
    //        el.style.color = 'black';
    //    });

    //    var cleanedHtml = container.innerHTML;
    //    var pdfmakehtmlcontent = htmlToPdfmake(cleanedHtml);


    //    var PrintInfo = {
    //        "htmlcontent": pdfmakehtmlcontent || '',
    //    };

    //    var file = USPrintService.GenerateAddPatientConsentDocumentPrint(PrintInfo);

    //    pdfMake.createPdf(file).getDataUrl(function (dataURL) {
    //        var url = dataURL;
    //        console.log(url);
    //        var base64result = url.split(',')[1];

    //        console.log(base64result);

    //        continuetoAddPatientConsentDocumentSave(base64result, isPartiallySigned);
    //    });


    //}



    function continuetoAddPatientConsentDocumentSave(base64result, isPartiallySigned) {


        $scope.MainPatientSignedObj.PatientSignedDateTime = $scope.MainPatientSignedObj.PatientSignedDateTime || "";
        $scope.MainPatientSignedObj.ProviderSignedDateTime = $scope.MainPatientSignedObj.ProviderSignedDateTime || "";
        $scope.MainPatientSignedObj.StaffSignedDateTime = $scope.MainPatientSignedObj.StaffSignedDateTime || "";
        $scope.MainPatientSignedObj.CounselorSignedDateTime = $scope.MainPatientSignedObj.CounselorSignedDateTime || "";
        $scope.MainPatientSignedObj.AnesthesistSignedDateTime = $scope.MainPatientSignedObj.AnesthesistSignedDateTime || "";
        $scope.MainPatientSignedObj.GaurdianSignedDateTime = $scope.MainPatientSignedObj.GaurdianSignedDateTime || "";

        var patientSigDT = null, providerSigDT = null, staffSigDT = null, counselorSigDT = null, anesthesistSigDT = null, gaurdianSigDT = null;
        if ($scope.MainPatientSignedObj.PatientSignedDateTime !== "") {
            patientSigDT = moment($scope.MainPatientSignedObj.PatientSignedDateTime).format('YYYY-MM-DD HH:mm:ss') || null;
        }

        if ($scope.MainPatientSignedObj.ProviderSignedDateTime !== "") {
            providerSigDT = moment($scope.MainPatientSignedObj.ProviderSignedDateTime).format('YYYY-MM-DD HH:mm:ss') || null;
        }
        if ($scope.MainPatientSignedObj.StaffSignedDateTime !== "") {
            staffSigDT = moment($scope.MainPatientSignedObj.StaffSignedDateTime).format('YYYY-MM-DD HH:mm:ss') || null;
        }
        if ($scope.MainPatientSignedObj.CounselorSignedDateTime !== "") {
            counselorSigDT = moment($scope.MainPatientSignedObj.CounselorSignedDateTime).format('YYYY-MM-DD HH:mm:ss') || null;
        }
        if ($scope.MainPatientSignedObj.AnesthesistSignedDateTime !== "") {
            anesthesistSigDT = moment($scope.MainPatientSignedObj.AnesthesistSignedDateTime).format('YYYY-MM-DD HH:mm:ss') || null;
        }

        if ($scope.MainPatientSignedObj.GaurdianSignedDateTime !== "") {
            gaurdianSigDT = moment($scope.MainPatientSignedObj.GaurdianSignedDateTime).format('YYYY-MM-DD HH:mm:ss') || null;
        }

        var isRequiredsinesCount = 0;
        if ($scope.MainPatientSignedObj.IsPatientSignRequired) {
            isRequiredsinesCount++;
        }
        if ($scope.MainPatientSignedObj.IsStaffSignRequired) {
            isRequiredsinesCount++;
        }
        if ($scope.MainPatientSignedObj.IsCounselorSignRequired) {
            isRequiredsinesCount++;
        }
        if ($scope.MainPatientSignedObj.IsDoctorSignRequired) {
            isRequiredsinesCount++;
        }
        if ($scope.MainPatientSignedObj.IsAnesthesistSignRequired) {
            isRequiredsinesCount++;
        }
        if ($scope.MainPatientSignedObj.IsGuardianSignRequired) {
            isRequiredsinesCount++;
        }



        var isSignatureDoneCount = 0;
        if ($scope.MainPatientSignedObj.IsPatientSignatureDone && $scope.MainPatientSignedObj.IsPatientSignRequired) {
            isSignatureDoneCount++;
        }
        if ($scope.MainPatientSignedObj.IsStaffSignatureDone && $scope.MainPatientSignedObj.IsStaffSignRequired) {
            isSignatureDoneCount++;
        }
        if ($scope.MainPatientSignedObj.IsCounselorSignatureDone && $scope.MainPatientSignedObj.IsCounselorSignRequired) {
            isSignatureDoneCount++;
        }
        if ($scope.MainPatientSignedObj.IsProviderSignatureDone && $scope.MainPatientSignedObj.IsDoctorSignRequired) {
            isSignatureDoneCount++;
        }
        if ($scope.MainPatientSignedObj.IsAnesthesistSignatureDone && $scope.MainPatientSignedObj.IsAnesthesistSignRequired) {
            isSignatureDoneCount++;
        }
        if ($scope.MainPatientSignedObj.IsGaurdianSignatureDone && $scope.MainPatientSignedObj.IsGuardianSignRequired) {
            isSignatureDoneCount++;
        }

        var isPartiallySigned = true;
        if (isRequiredsinesCount != 0 && isSignatureDoneCount != 0) {
            if (isRequiredsinesCount === isSignatureDoneCount) {
                isPartiallySigned = false;
            }
        }


        var cApptDate = $filter('date')(new Date(), "yyyy-MM-dd");

        var obj = {
            "UserId": $scope.MainPatientSignedObj.UserId,
            /*"HospitalId": $scope.MainPatientSignedObj.HospitalId,*/
            "HospitalId": $scope.ParentObject.ApptHospitalId,
            "ConsentTemplateId": $scope.MainPatientSignedObj.ConsentTemplateId,
            "PatientConsentDocumentId": $scope.MainPatientSignedObj.PatientConsentDocumentId,
            "PatientId": $scope.MainPatientSignedObj.PatientId,
            "VisitId": $scope.MainPatientSignedObj.VisitId,
            "PatientName": $scope.MainPatientSignedObj.PatientName,
            "AppointmentId": $scope.MainPatientSignedObj.AppointmentId,
            "AppointmentDate": $scope.MainPatientSignedObj.AppointmentDate || cApptDate,
            "ConsentFormId": $scope.MainPatientSignedObj.ConsentFormId,
            "S3URL": $scope.MainPatientSignedObj.S3URL,
            "Base64": base64result,
            "DocumentExt": $scope.MainPatientSignedObj.DocumentExt,
            "DocumentName": $scope.MainPatientSignedObj.DocumentName,
            "IsPatientSignatureDone": $scope.MainPatientSignedObj.IsPatientSignatureDone,
            "IsStaffSignatureDone": $scope.MainPatientSignedObj.IsStaffSignatureDone,
            "StaffUserId": $scope.MainPatientSignedObj.StaffUserId,
            "IsProviderSignatureDone": $scope.MainPatientSignedObj.IsProviderSignatureDone,
            "ProviderUserId": $scope.MainPatientSignedObj.ProviderUserId,
            "IsCounselorSignatureDone": $scope.MainPatientSignedObj.IsCounselorSignatureDone,
            "CounselorUserId": $scope.MainPatientSignedObj.CounselorUserId,
            "IsAnesthesistSignatureDone": $scope.MainPatientSignedObj.IsAnesthesistSignatureDone,
            "AnesthesistUserId": $scope.MainPatientSignedObj.AnesthesistUserId,
            "GaurdianUserId": $scope.MainPatientSignedObj.GaurdianUserId,
            "IsGaurdianSignatureDone": $scope.MainPatientSignedObj.IsGaurdianSignatureDone,
            "IsPartiallySaved": isPartiallySigned,
            "IsScannedDocument": false,
            "HTMLContent": document.querySelector('[id^="taTextElement"]').innerHTML,
            "GaurdianFirstName": $scope.MainPatientSignedObj.GaurdianFirstName || "",
            "GaurdianLastName": $scope.MainPatientSignedObj.GaurdianLastName || "",
            "GaurdianRelationShipId": $scope.MainPatientSignedObj.GaurdianRelationShipId || null,
            "PatientSignedDateTime": patientSigDT || null,
            "ProviderSignedDateTime": providerSigDT || null,
            "StaffSignedDateTime": staffSigDT || null,
            "CounselorSignedDateTime": counselorSigDT || null,
            "AnesthesistSignedDateTime": anesthesistSigDT || null,
            "GaurdianSignedDateTime": gaurdianSigDT || null,
            "PatientSignCaptureUserId": $scope.MainPatientSignedObj.PatientSignCaptureUserId || 0,
            "ProviderSignCaptureUserId": $scope.MainPatientSignedObj.ProviderSignCaptureUserId || 0,
            "StaffSignCaptureUserId": $scope.MainPatientSignedObj.StaffSignCaptureUserId || 0,
            "CounselorSignCaptureUserId": $scope.MainPatientSignedObj.CounselorSignCaptureUserId || 0,
            "AnesthesistSignCaptureUserId": $scope.MainPatientSignedObj.AnesthesistSignCaptureUserId || 0,
            "GaurdianSignCaptureUserId": $scope.MainPatientSignedObj.GaurdianSignCaptureUserId || 0,
            "DisplayName": $scope.MainPatientSignedObj.ConsentFormName || '',
            "PatientEncryptedSig": $scope.signPlusObj.PatientSignString || "",
            "DoctorEncryptedSig": $scope.signPlusObj.ProviderSignString || "",
            "StaffEncryptedSig": $scope.signPlusObj.StaffSignString || "",
            "CounselorEncryptedSig": $scope.signPlusObj.CounselorSignString || "",
            "AnesthesistEncryptedSig": $scope.signPlusObj.AnesthesistSignString || "",
            "GuardianEncryptedSig": $scope.signPlusObj.GaurdianSignString || "",
            "PatientIntialEncryptedSig": $scope.signPlusObj.PatientIntialSignString || "",
            "OldPatientConsentFormId": $scope.OldPatientConsentFormId || 0,
            "Logs": {},
        };
        $scope.LogObj.LogArray = [];

        //Patient Sig
        if (obj.PatientEncryptedSig != "" || $scope.LogObj.PatientEncryptedSig != "") {
            let ActionType = ''
            if ($scope.LogObj.PatientEncryptedSig == "") {
                ActionType = 'Added';
            } else if (obj.PatientEncryptedSig == '' && $scope.LogObj.PatientEncryptedSig != '') {
                ActionType = 'Deleted';
            } else if (obj.PatientEncryptedSig != '' || $scope.LogObj.PatientEncryptedSig != '') {
                if (obj.PatientEncryptedSig != $scope.LogObj.PatientEncryptedSig) {
                    ActionType = 'Edited';
                }
            } else {
                consolelog('ji');
            };
            let ActionDescription = `$ Patient signature in "${obj.DisplayName}" Consent form Appointment ID: ${$scope.LogObj.AppointmentId}` || "";
            if (obj.PatientEncryptedSig != $scope.LogObj.PatientEncryptedSig) {
                let Reqobj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 6,
                    "SubModuleName": "Consent Form",
                    "ScreenType": "ASC Chart",
                    "ActionType": ActionType,
                    "ActionDescription": ActionDescription,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(Reqobj);
            }
        }
        // Patinet inital sig 
        if (obj.PatientIntialEncryptedSig != "" || $scope.LogObj.PatientIntialEncryptedSig != "") {
            let ActionType = ''
            if ($scope.LogObj.PatientIntialEncryptedSig == "") {
                ActionType = 'Added';
            } else if (obj.PatientIntialEncryptedSig == '' && $scope.LogObj.PatientIntialEncryptedSig != '') {
                ActionType = 'Deleted';
            } else if (obj.PatientIntialEncryptedSig != '' || $scope.LogObj.PatientIntialEncryptedSig != '') {
                if (obj.PatientIntialEncryptedSig != $scope.LogObj.PatientIntialEncryptedSig) {
                    ActionType = 'Edited';
                }
            } else {
                consolelog('ji');
            };
            let ActionDescription = `  Patient intial signature in "${obj.DisplayName}" Consent form,Appointment ID: ${$scope.LogObj.AppointmentId}` || "";
            if (obj.PatientIntialEncryptedSig != $scope.LogObj.PatientIntialEncryptedSig) {
                let Reqobj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 6,
                    "SubModuleName": "Consent Form",
                    "ScreenType": "ASC Chart",
                    "ActionType": ActionType,
                    "ActionDescription": ActionDescription,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(Reqobj);
            }
        }
        //Staff dSig
        if (obj.StaffEncryptedSig != "" || $scope.LogObj.StaffEncryptedSig != "") {
            let ActionType = ''
            if ($scope.LogObj.StaffEncryptedSig == "") {
                ActionType = 'Added';
            } else if (obj.StaffEncryptedSig == '' && $scope.LogObj.StaffEncryptedSig != '') {
                ActionType = 'Deleted';
            } else if (obj.StaffEncryptedSig != '' || $scope.LogObj.StaffEncryptedSig != '') {
                if (obj.StaffEncryptedSig != $scope.LogObj.StaffEncryptedSig) {
                    ActionType = 'Edited';
                }
            } else {
                consolelog('ji');
            };
            let ActionDescription = ` Staff signature in "${obj.DisplayName}" Consent form ,Appointment ID: ${$scope.LogObj.AppointmentId}` || "";
            if (obj.StaffEncryptedSig != $scope.LogObj.StaffEncryptedSig) {
                let Reqobj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 6,
                    "SubModuleName": "Consent Form",
                    "ScreenType": "ASC Chart",
                    "ActionType": ActionType,
                    "ActionDescription": ActionDescription,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(Reqobj);
            }
        }
        //Counselor Sig
        if (obj.CounselorEncryptedSig != "" || $scope.LogObj.CounselorEncryptedSig != "") {
            let ActionType = ''
            if ($scope.LogObj.CounselorEncryptedSig == "") {
                ActionType = 'Added';
            } else if (obj.CounselorEncryptedSig == '' && $scope.LogObj.CounselorEncryptedSig != '') {
                ActionType = 'Deleted';
            } else if (obj.CounselorEncryptedSig != '' || $scope.LogObj.CounselorEncryptedSig != '') {
                if (obj.CounselorEncryptedSig != $scope.LogObj.CounselorEncryptedSig) {
                    ActionType = 'Edited';
                }
            } else {
                consolelog('ji');
            };
            let ActionDescription = ` Counselor signature in "${obj.DisplayName}" Consent form,  Appointment ID: ${$scope.LogObj.AppointmentId}` || "";
            if (obj.CounselorEncryptedSig != $scope.LogObj.CounselorEncryptedSig) {
                let Reqobj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 6,
                    "SubModuleName": "Consent Form",
                    "ScreenType": "ASC Chart",
                    "ActionType": ActionType,
                    "ActionDescription": ActionDescription,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(Reqobj);
            }
        }
        //Anesthesist Sig
        if (obj.AnesthesistEncryptedSig != "" || $scope.LogObj.AnesthesistEncryptedSig != "") {
            let ActionType = ''
            if ($scope.LogObj.AnesthesistEncryptedSig == "") {
                ActionType = 'Added';
            } else if (obj.AnesthesistEncryptedSig == '' && $scope.LogObj.AnesthesistEncryptedSig != '') {
                ActionType = 'Deleted';
            } else if (obj.AnesthesistEncryptedSig != '' || $scope.LogObj.AnesthesistEncryptedSig != '') {
                if (obj.AnesthesistEncryptedSig != $scope.LogObj.AnesthesistEncryptedSig) {
                    ActionType = 'Edited';
                }
            } else {
                consolelog('ji');
            };
            let ActionDescription = ` Anesthesist signature in "${obj.DisplayName} " Consent form, Appointment ID: ${$scope.LogObj.AppointmentId}` || "";
            if (obj.AnesthesistEncryptedSig != $scope.LogObj.AnestofhesistEncryptedSig) {
                let Reqobj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 6,
                    "SubModuleName": "Consent Form",
                    "ScreenType": "ASC Chart",
                    "ActionType": ActionType,
                    "ActionDescription": ActionDescription,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(Reqobj);
            }
        }
        // GuardianSig
        if (obj.GuardianEncryptedSig != "" || $scope.LogObj.GuardianEncryptedSig != "") {
            let ActionType = ''
            if ($scope.LogObj.GuardianEncryptedSig == "") {
                ActionType = 'Added';
            } else if (obj.GuardianEncryptedSig == '' && $scope.LogObj.GuardianEncryptedSig != '') {
                ActionType = 'Deleted';
            } else if (obj.GuardianEncryptedSig != '' || $scope.LogObj.GuardianEncryptedSig != '') {
                if (obj.GuardianEncryptedSig != $scope.LogObj.GuardianEncryptedSig) {
                    ActionType = 'Edited';
                }
            } else {
                consolelog('ji');
            };
            let ActionDescription = ` Guardian signature in "${obj.DisplayName}" Consent form, Appointment ID: ${$scope.LogObj.AppointmentId}` || "";
            if (obj.GuardianEncryptedSig != $scope.LogObj.GuardianEncryptedSig) {
                let Reqobj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 6,
                    "SubModuleName": "Consent Form",
                    "ScreenType": "ASC Chart",
                    "ActionType": ActionType,
                    "ActionDescription": ActionDescription,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(Reqobj);
            }
        }
        // Provider Sign
        if (obj.DoctorEncryptedSig != "" || $scope.LogObj.ProviderEncryptedSig != "") {
            let ActionType = ''
            if ($scope.LogObj.ProviderEncryptedSig == "") {
                ActionType = 'Added';
            } else if (obj.DoctorEncryptedSig == '' && $scope.LogObj.ProviderEncryptedSig != '') {
                ActionType = 'Deleted';
            } else if (obj.DoctorEncryptedSig != '' || $scope.LogObj.ProviderEncryptedSig != '') {
                if (obj.DoctorEncryptedSig != $scope.LogObj.ProviderEncryptedSig) {
                    ActionType = 'Edited';
                }
            } else {
                consolelog('ji');
            };
            let ActionDescription = ` Provider signature in "${obj.DisplayName}" Consent form, Appointment ID: ${$scope.LogObj.AppointmentId}` || "";
            if (obj.DoctorEncryptedSig != $scope.LogObj.ProviderEncryptedSig) {
                let Reqobj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 4,
                    "SubModuleName": "Discharge summary",
                    "ScreenType": "ASC Chart",
                    "ActionType": ActionType,
                    "ActionDescription": ActionDescription,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(Reqobj);
            }
        }


        obj.Logs = angular.copy($scope.LogObj) || {};
        eHnoteSettingsDataService.AddUpdatePatientSignedConsentDocuments(obj).then(function (resp) {
            if (resp.data.Status == 'Success') {

                $scope.MainPatientSignedObj = getnewPatientSignedObj();
                $scope.selectedPatientTempConsentObj.HtmlContent = "";
                alertify.success("Consent Form Save  Successfully ");

                if ($scope.ParentObject.Page == "PreOp") {
                    $scope.GetPatientAppointmentConsentsById();
                } else {
                    $scope.consentsMainObj.SelectedConsentFormId = 0;
                    $scope.GetPatientAppointmentConsentsById();
                    //$scope.closeuibdoc();
                }
                $scope.OldPatientConsentFormId = 0;

                $scope.IsContentSaveBtnHide = false;
            } else {
                $scope.IsContentSaveBtnHide = false;
            }

        }, function (err) {
            console.log(err);
        });
    }

    $scope.FillPatientValues = function () {

        var HospitalAddress = $scope.selectedHospitalAddress[0].Address1 + "," + $scope.selectedHospitalAddress[0].Address2 + "," + '<br>' + $scope.selectedHospitalAddress[0].CityName + "," + $scope.selectedHospitalAddress[0].StateName + "," + $scope.selectedHospitalAddress[0].CountryName + "," + $scope.selectedHospitalAddress[0].PinCode

        //var PatientName = "Durgareddy", PatientMobile = "9700056151", PatientMRno = "WMV098767", Date = "WMV098767";

        $scope.PatientFillObj = {
            "PatientName": $scope.PatientName,
            "PatientMobile": $scope.selectedPatientSurgeryObj.Patient.MobileNo || "",
            "PatientGender": $scope.selectedPatientSurgeryObj.Patient.Gender || "",
            "PatientAge": $scope.selectedPatientSurgeryObj.Patient.Age || "",
            "PatientDOB": $scope.selectedPatientSurgeryObj.Patient.DOB || "",
            "PatientFirstName": $scope.selectedPatientSurgeryObj.Patient.FirstName || "",
            "PatientLastName": $scope.selectedPatientSurgeryObj.Patient.LastName || "",
            "PatientMrNo": $scope.selectedPatientSurgeryObj.Patient.PatientDisplayId || "",
            "PatientSSN": $scope.selectedPatientSurgeryObj.Patient.SSN || "",
            "PatientCity": "",
            "PatientState": "",
            "PatientAddress1": "",
            "PatientAddress2": "",
            "PatientZipCode": "",
            "PatientContactNumber": $scope.selectedPatientSurgeryObj.Patient.ContactNo || "",
            "PatientBloodGroup": $scope.selectedPatientSurgeryObj.Patient.BloodGroup || "",
            "PatientNationality": "",
            "PatientEmail": $scope.selectedPatientSurgeryObj.Patient.EmailId || "",
            "PatientMaritalStatus": "",
            /*"BranchName": $scope.selectedPatientSurgeryObj.BranchName || '',*/
            "BranchName": $scope.selectedHospitalAddress[0].HospitalName || '',
            "DoctorFullName": $scope.selectedPatientSurgeryObj.Patient.DoctorFullName || '',
            "DoctorMobile": $scope.selectedPatientSurgeryObj.Patient.DoctorMobileNo || '',
            "HospitalAddress": HospitalAddress
        };

        if ($scope.PatientFillObj.PatientDOB != '') {
            $scope.PatientDOB = $filter('date')($scope.PatientFillObj.PatientDOB, "MM-dd-yyyy");
        }

        if ($scope.PatientFillObj.PatientMobile != '') {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientFillObj.PatientMobile);
            $scope.PatientMobileNumber = obj.UsFormatMobileNumber;
        }

        if ($scope.PatientFillObj.DoctorMobile != '') {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientFillObj.DoctorMobile);
            $scope.DoctorMobileNumber = obj.UsFormatMobileNumber;
        }

        var PatientNameelements = document.querySelectorAll('[id^="NPatientName"]');
        PatientNameelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##PatientName##/g, $scope.PatientFillObj.PatientName);
        });

        var PatientMobileelements = document.querySelectorAll('[id^="NPatientMobile"]');
        PatientMobileelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##PatientMobile##/g, $scope.PatientMobileNumber);
        });
        var PatientGenderelements = document.querySelectorAll('[id^="NPatientGender"]');
        PatientGenderelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##PatientGender##/g, $scope.PatientFillObj.PatientGender);
        });
        var PatientAgeelements = document.querySelectorAll('[id^="NPatientAge"]');
        PatientAgeelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##PatientAge##/g, $scope.PatientFillObj.PatientAge);
        });
        var PatientMrNoelements = document.querySelectorAll('[id^="NPatientMrNo"]');
        PatientMrNoelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##PatientMrNo##/g, $scope.PatientFillObj.PatientMrNo);
        });
        var PatientFirstNameelements = document.querySelectorAll('[id^="NPatientFirstName"]');
        PatientFirstNameelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##PatientFirstName##/g, $scope.PatientFillObj.PatientFirstName);
        });
        var PatientLastNameelements = document.querySelectorAll('[id^="NPatientLastName"]');
        PatientLastNameelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##PatientLastName##/g, $scope.PatientFillObj.PatientLastName);
        });
        var PatientSSNelements = document.querySelectorAll('[id^="NPatientSSN"]');
        PatientSSNelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##PatientSSN##/g, $scope.PatientFillObj.PatientSSN);
        });
        var PatientEmailelements = document.querySelectorAll('[id^="NPatientEmail"]');
        PatientEmailelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##PatientEmail##/g, $scope.PatientFillObj.PatientEmail);
        });
        var PatientDOBelements = document.querySelectorAll('[id^="NPatientDOB"]');
        PatientDOBelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##PatientDOB##/g, $scope.PatientDOB);
        });
        var PatientBloodGroupelements = document.querySelectorAll('[id^="NPatientBloodGroup"]');
        PatientBloodGroupelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##PatientBloodGroup##/g, $scope.PatientFillObj.PatientBloodGroup);
        });

        var HospitalNameelements = document.querySelectorAll('[id^="NHospitalName"]');
        HospitalNameelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##HospitalName##/g, $scope.PatientFillObj.BranchName);
        });
        var DoctorNameelements = document.querySelectorAll('[id^="NDoctorName"]');
        DoctorNameelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##DoctorName##/g, $scope.PatientFillObj.DoctorFullName);
        });
        var DoctorMobileelements = document.querySelectorAll('[id^="NDoctorMobile"]');
        DoctorMobileelements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##DoctorMobile##/g, $scope.DoctorMobileNumber);
        });
        var HospitalAddresselements = document.querySelectorAll('[id^="NHospitalAddress"]');
        HospitalAddresselements.forEach(function (element) {
            element.innerHTML = element.innerHTML.replace(/##HospitalAddress##/g, $scope.PatientFillObj.HospitalAddress);
        });


        var editorScope = textAngularManager.retrieveEditor('htmlPatientTemplateconsent').scope;
        $timeout(function () {
            editorScope.displayElements.text[0].focus();
            var innerTaTextElementId = editorScope.displayElements.text[0].id;
            placeCaretAtEnd(document.getElementById(innerTaTextElementId));
        });
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientName##/g, $scope.PatientFillObj.PatientName);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientMobile##/g, $scope.PatientMobileNumber);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientGender##/g, $scope.PatientFillObj.PatientGender);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientAge##/g, $scope.PatientFillObj.PatientAge );
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientMrNo##/g, $scope.PatientFillObj.PatientMrNo);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientFirstName##/g, $scope.PatientFillObj.PatientFirstName);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientLastName##/g, $scope.PatientFillObj.PatientLastName);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientSSN##/g, $scope.PatientFillObj.PatientSSN);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientEmail##/g, $scope.PatientFillObj.PatientEmail);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientDOB##/g, $scope.PatientDOB);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientBloodGroup##/g, $scope.PatientFillObj.PatientBloodGroup);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##HospitalName##/g, $scope.PatientFillObj.BranchName);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##DoctorName##/g, $scope.PatientFillObj.DoctorFullName);
        //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##DoctorMobile##/g, $scope.DoctorMobileNumber);

        // document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##HospitalAddress##/g, $scope.PatientFillObj.HospitalAddress);


        /* document.getElementById('imgOrgLogo').src = "";*/

        /*     var nbase64c = "data:image/png;base64," + base64c;*/

        /*  var nbase64c = "data:image/png;base64,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";*/



        //console.log(nbase64c);

        //document.getElementById('imgOrgLogo').src = nbase64c;
        //let eled = document.getElementById('imgOrgLogo');
        //eled.innerHTML = '<img src="' + nbase64c + '">';
    };

    $scope.fillCustomSignatureValues = function (resp) {



        var mainhtmlstring = $scope.selectedPatientTempConsentObj.HtmlContent;

        if (resp.PatientSignString != "") {
            var random4DigitNumber = getRandom4DigitNumber();
            /*  style = "width:150px;80px;display:inline-block;"*/
            /*   var patientsignaturedom = '<span><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.PatientSignString + '"></span>';*/
            /*    if (resp.PatientIntialSignString == '') {*/
            var patientsignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.PatientSignString + '"></td></tr></table>';

            //} else if (resp.PatientIntialSignString !== '') {
            //    //var patientsignaturedom = '<table><tr><td><img class="imgSignature" style="width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.PatientIntialSignString + '"></td>' +
            //    //    '<td><img class="imgSignature" style="width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '_resp" src="' + resp.PatientSignString + '"></td></tr></table>';

            //    var patientsignaturedom = '<table><tr><td><img class="imgSignature" style="width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.PatientIntialSignString + '"><img class="imgSignature" style="width:150px;80px;"  src="' + resp.PatientSignString + '"></td></tr></table>';
            //}
            //document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##PatientSignature##/g, patientsignaturedom);



            var PatientSignatureelements = document.querySelectorAll('[id^="NPatientSignature"]');
            PatientSignatureelements.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##PatientSignature##/g, patientsignaturedom);
            });
        } else {
            if ($scope.MainPatientSignedObj.IsPatientSignatureDone) {
                var PatientSignatureelements = document.querySelectorAll('[id^="NPatientSignature"]');
                PatientSignatureelements.forEach(function (element) {
                    if (element.querySelector('table')) {
                        element.innerHTML = '##PatientSignature##';
                    }
                });

                $scope.GetSignatureDeleteObj.PatientSignature = false;
                /*$scope.GetSignatureDeleteObj.PatientIntialSignature = false;*/
                if ($scope.GetSignatureDeleteObj.PatientSignature && $scope.GetSignatureDeleteObj.PatientIntialSignature) {
                    $scope.MainPatientSignedObj.IsPatientSignatureDone = false;
                }
                var canvasP = document.getElementById('patientSigantureImg');
                var contextP = canvasP.getContext('2d');
                contextP.clearRect(0, 0, canvasP.width, canvasP.height);


            }
        }
        if (resp.PatientIntialSignString != "") {
            var random4DigitNumber = getRandom4DigitNumber();
            var patientintsignaturedom = '<table><tr><td><img class="imgSignature" style="width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.PatientIntialSignString + '"></td></tr></table>';
            $scope.MainPatientSignedObj.IsPatientInitialSignatureDone = true;
            var PatientintSignatureelements = document.querySelectorAll('[id^="NPatientIntialSignature"]');
            PatientintSignatureelements.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##PatientIntialSignature##/g, patientintsignaturedom);
            });
        } else {
            var PatientSignatureelements = document.querySelectorAll('[id^="NPatientIntialSignature"]');
            PatientSignatureelements.forEach(function (element) {
                if (element.querySelector('table')) {
                    element.innerHTML = '##PatientIntialSignature##';
                }

                $scope.GetSignatureDeleteObj.PatientIntialSignature = false;

                var canvasPInt = document.getElementById('patientIntSigantureImg');
                var contextPInt = canvasPInt.getContext('2d');
                contextPInt.clearRect(0, 0, canvasPInt.width, canvasPInt.height);
            });
        }
        if (resp.StaffSignString != "") {
            var random4DigitNumber = getRandom4DigitNumber();
            /*   var staffsignaturedom = '<span><img class="imgSignature" style="width:150px;80px;display:inline-block;" id="StaffImg_' + random4DigitNumber + '" src="' + resp.StaffSignString + '"></span>';*/
            var staffsignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.StaffSignString + '"></td></tr></table>';


            /*  document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##StaffSignature##/g, staffsignaturedom);*/

            var StaffSignatureelements = document.querySelectorAll('[id^="NStaffSignature"]');
            StaffSignatureelements.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##StaffSignature##/g, staffsignaturedom);
            });
        } else {
            if ($scope.MainPatientSignedObj.IsStaffSignatureDone) {
                var StaffSignatureelements = document.querySelectorAll('[id^="NStaffSignature"]');
                StaffSignatureelements.forEach(function (element) {
                    if (element.querySelector('table')) {
                        element.innerHTML = '##StaffSignature##';
                    }
                });

                $scope.GetSignatureDeleteObj.StaffSignature = false;
                var canvasS = document.getElementById('staffSigantureImg');
                var contextS = canvasS.getContext('2d');
                contextS.clearRect(0, 0, canvasS.width, canvasS.height);
            }
        }


        if (resp.ProviderSignString != "") {
            var random4DigitNumber = getRandom4DigitNumber();
            /*     var providersignaturedom = '<span><img class="imgSignature" style="width:150px;80px;display:inline-block;"  id="ProviderImg_' + random4DigitNumber + '" src="' + resp.ProviderSignString + '"></span>';*/
            var providersignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.ProviderSignString + '"></td></tr></table>';

            var ProviderSignatureelements = document.querySelectorAll('[id^="NProviderSignature"]');
            ProviderSignatureelements.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##ProviderSignature##/g, providersignaturedom);
            });
        } else {

            if ($scope.MainPatientSignedObj.IsProviderSignatureDone) {
                var ProviderSignatureelements = document.querySelectorAll('[id^="NProviderSignature"]');
                ProviderSignatureelements.forEach(function (element) {
                    if (element.querySelector('table')) {
                        element.innerHTML = '##ProviderSignature##';
                    }
                });

                $scope.GetSignatureDeleteObj.ProviderSignature = false;
                var canvasD = document.getElementById('doctorSigantureImg');
                var contextD = canvasD.getContext('2d');
                contextD.clearRect(0, 0, canvasD.width, canvasD.height);
            }
        }

        if (resp.CounselorSignString != "") {
            var random4DigitNumber = getRandom4DigitNumber();
            /*   var CounselorSignaturedom = '<span><img class="imgSignature" style="width:150px;80px;display:inline-block;" id="CounselorImg_' + random4DigitNumber + '"  src="' + resp.CounselorSignString + '"></span>';*/
            var CounselorSignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.CounselorSignString + '"></td></tr></table>';
            /*  document.getElementById('htmlPatientTemplateconsent').innerHTML = document.getElementById('htmlPatientTemplateconsent').innerHTML.replace(/##CounselorSignature##/g, CounselorSignaturedom);*/

            var CounselorSignatureelements = document.querySelectorAll('[id^="NCounselorSignature"]');
            CounselorSignatureelements.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##CounselorSignature##/g, CounselorSignaturedom);
            });
        } else {
            if ($scope.MainPatientSignedObj.IsCounselorSignatureDone) {
                var CounselorSignatureelements = document.querySelectorAll('[id^="NCounselorSignature"]');
                CounselorSignatureelements.forEach(function (element) {
                    if (element.querySelector('table')) {
                        element.innerHTML = '##CounselorSignature##';
                    }
                });


                $scope.GetSignatureDeleteObj.CounselorSignature = false;
                var canvasP = document.getElementById('doctorSigantureImg');
                var contextP = canvasP.getContext('2d');
                contextP.clearRect(0, 0, canvasP.width, canvasP.height);
            }
        }

        if (resp.AnesthesistSignString != "") {
            var random4DigitNumber = getRandom4DigitNumber();
            /*         var anesthesistsignaturedom = '<span><img class="imgSignature" style="width:150px;80px;display:inline-block;" id="AnesthesistImg_' + random4DigitNumber + '" src="' + resp.AnesthesistSignString + '"></span>';*/
            var anesthesistsignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.AnesthesistSignString + '"></td></tr></table>';


            var AnesthesistSignatureelements = document.querySelectorAll('[id^="NAnesthesistSignature"]');
            AnesthesistSignatureelements.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##AnesthesistSignature##/g, anesthesistsignaturedom);
            });
        } else {
            if ($scope.MainPatientSignedObj.IsAnesthesistSignatureDone) {
                var CounselorSignatureelements = document.querySelectorAll('[id^="NAnesthesistSignature"]');
                CounselorSignatureelements.forEach(function (element) {
                    if (element.querySelector('table')) {
                        element.innerHTML = '##AnesthesistSignature##';
                    }
                });
            }
        }

        if (resp.GaurdianSignString != "") {
            var random4DigitNumber = getRandom4DigitNumber();
            /*         var gaurdiansignaturedom = '<span><img class="imgSignature" style="width:150px;80px;display:inline-block;" id="GuardianImg_' + random4DigitNumber + '" src="' + resp.GaurdianSignString + '"></span>';*/
            var gaurdiansignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.GaurdianSignString + '"></td></tr></table>';

            var GaurdianSigantureelements = document.querySelectorAll('[id^="NGaurdianSiganture"]');
            GaurdianSigantureelements.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##GaurdianSiganture##/g, gaurdiansignaturedom);
            });
        }


        var editorScope = textAngularManager.retrieveEditor('htmlPatientTemplateconsent').scope;
        $timeout(function () {
            editorScope.displayElements.text[0].focus();
            var innerTaTextElementId = editorScope.displayElements.text[0].id;
            placeCaretAtEnd(document.getElementById(innerTaTextElementId));
        });
    }

    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    function getRandom4DigitNumber() {
        return Math.floor(Math.random() * 9000) + 1000; // Generates a random 4-digit number
    }


    $scope.clearSignDetails = function (type, id) {


        var canvas = document.getElementById(id);
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (type == 'PatientSignature') {
            var PatientSignatureelements = document.querySelectorAll('[id^="NPatientSignature"]');
            PatientSignatureelements.forEach(function (element) {
                if (element.querySelector('table')) {
                    element.innerHTML = '##PatientSignature##';
                }
            });

            var PatientSignatureDateelements = document.querySelectorAll('[id^="NPatientSignDateTime"]');
            PatientSignatureDateelements.forEach(function (element) {
                element.innerHTML = '##PatientSignDateTime##';
            });
            $scope.signPlusObj.IsPatientDigitalSignTaken = false;
            $scope.signPlusObj.PatientSignString = "";
            /*    $scope.signPlusObj.PatientIntialSignString = "";*/
            $scope.GetSignatureDeleteObj.PatientSignature = false;
            if (!$scope.GetSignatureDeleteObj.PatientSignature && !$scope.GetSignatureDeleteObj.PatientIntialSignature) {
                $scope.MainPatientSignedObj.IsPatientSignatureDone = false;
            }
            $scope.MainPatientSignedObj.PatientSignedDateTime = "";
            $scope.MainPatientSignedObj.PatientSignCaptureUserId = 0;
            //if (id == 'patientIntSigantureImg') {
            //    var canvas = document.getElementById(id);
            //    var context = canvas.getContext('2d');
            //    context.clearRect(0, 0, canvas.width, canvas.height);
            //}
        }
        else if (type == 'patientIntSigantureImg') {

            var PatientSignatureelements = document.querySelectorAll('[id^="NPatientIntialSignature"]');
            PatientSignatureelements.forEach(function (element) {
                if (element.querySelector('table')) {
                    element.innerHTML = '##PatientIntialSignature##';
                }
            });

            $scope.signPlusObj.PatientIntialSignString = "";
            $scope.GetSignatureDeleteObj.PatientIntialSignature = false;
            if (id == 'patientIntSigantureImg') {
                var canvas = document.getElementById(id);
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
            $scope.GetSignatureDeleteObj.PatientIntialSignature = false;
            if (!$scope.GetSignatureDeleteObj.PatientSignature && !$scope.GetSignatureDeleteObj.PatientIntialSignature) {
                $scope.MainPatientSignedObj.IsPatientSignatureDone = false;
            }
        }
        else if (type == 'StaffSignature') {
            var StaffSignatureelements = document.querySelectorAll('[id^="NStaffSignature"]');
            StaffSignatureelements.forEach(function (element) {
                if (element.querySelector('table')) {
                    element.innerHTML = '##StaffSignature##';
                }
            });

            var StaffSignatureDateelements = document.querySelectorAll('[id^="NStaffSignedDateTime"]');
            StaffSignatureDateelements.forEach(function (element) {
                element.innerHTML = '##StaffSignedDateTime##';
            });
            $scope.signPlusObj.IsStaffDigitalSignTaken = false;
            $scope.signPlusObj.StaffSignString = "";
            $scope.MainPatientSignedObj.IsStaffSignatureDone = false;

            $scope.signPlusObj.StaffUserId = 0;
            $scope.signPlusObj.StaffUserObj = "";
            $scope.signPlusObj.StaffUserName = "";
            $scope.MainPatientSignedObj.StaffUserName = "";
            $scope.MainPatientSignedObj.StaffUserId = 0;
            $scope.MainPatientSignedObj.StaffSignedDateTime = "";
            $scope.MainPatientSignedObj.StaffSignCaptureUserId = 0;
        }
        else if (type == 'ProviderSignature') {
            var ProviderSignatureelements = document.querySelectorAll('[id^="NProviderSignature"]');
            ProviderSignatureelements.forEach(function (element) {
                if (element.querySelector('table')) {
                    element.innerHTML = '##ProviderSignature##';
                }
            });
            var ProviderSignatureDateelements = document.querySelectorAll('[id^="NProviderSignedDateTime"]');
            ProviderSignatureDateelements.forEach(function (element) {
                element.innerHTML = '##ProviderSignedDateTime##';
            });
            $scope.signPlusObj.IsProviderDigitalSignTaken = false;
            $scope.signPlusObj.ProviderSignString = "";
            $scope.MainPatientSignedObj.IsProviderSignatureDone = false;


            $scope.signPlusObj.ProviderUserId = 0;
            $scope.signPlusObj.ProviderUserObj = "";
            $scope.signPlusObj.ProviderUserName = "";
            $scope.MainPatientSignedObj.ProviderUserName = "";
            $scope.MainPatientSignedObj.ProviderUserId = 0;
            $scope.MainPatientSignedObj.ProviderSignedDateTime = "";
            $scope.MainPatientSignedObj.ProviderSignCaptureUserId = 0;
        }
        else if (type == 'CounselorSignature') {
            var CounselorSignatureelements = document.querySelectorAll('[id^="NCounselorSignature"]');
            CounselorSignatureelements.forEach(function (element) {
                if (element.querySelector('table')) {
                    element.innerHTML = '##CounselorSignature##';
                }
            });
            var CounselorSignatureDateelements = document.querySelectorAll('[id^="NCounselorSignDateTime"]');
            CounselorSignatureDateelements.forEach(function (element) {
                element.innerHTML = '##CounselorSignDateTime##';
            });

            $scope.signPlusObj.IsCounselorDigitalSignTaken = false;
            $scope.signPlusObj.CounselorSignString = "";
            $scope.MainPatientSignedObj.IsCounselorSignatureDone = false;

            $scope.signPlusObj.CounselorUserId = 0;
            $scope.signPlusObj.CounselorUserObj = "";
            $scope.signPlusObj.CounselorUserName = "";
            $scope.MainPatientSignedObj.CounselorUserName = "";
            $scope.MainPatientSignedObj.CounselorUserId = 0;
            $scope.MainPatientSignedObj.CounselorSignedDateTime = "";
            $scope.MainPatientSignedObj.CounselorSignCaptureUserId = 0;
        }
        else if (type == 'AnesthesistSignature') {
            var CounselorSignatureelements = document.querySelectorAll('[id^="NAnesthesistSignature"]');
            CounselorSignatureelements.forEach(function (element) {
                if (element.querySelector('table')) {
                    element.innerHTML = '##AnesthesistSignature##';
                }
            });
            var CounselorSignatureDateelements = document.querySelectorAll('[id^="NAnesthesistSignDateTime"]');
            CounselorSignatureDateelements.forEach(function (element) {
                element.innerHTML = '##AnesthesistSignDateTime##';
            });

            $scope.signPlusObj.IsAnesthesistDigitalSignTaken = false;
            $scope.signPlusObj.AnesthesistSignString = "";
            $scope.MainPatientSignedObj.IsAnesthesistSignatureDone = false;
            $scope.signPlusObj.AnesthesistUserId = 0;
            $scope.signPlusObj.AnesthesistUserObj = "";
            $scope.signPlusObj.AnesthesistUserName = "";
            $scope.MainPatientSignedObj.AnesthesistUserName = "";
            $scope.MainPatientSignedObj.AnesthesistUserId = 0;
            $scope.MainPatientSignedObj.AnesthesistSignedDateTime = "";
            $scope.MainPatientSignedObj.AnesthesistSignCaptureUserId = 0;

        }
        else if (type == 'GaurdianSignature') {
            var GaurdianSigantureelements = document.querySelectorAll('[id^="NGaurdianSiganture"]');
            GaurdianSigantureelements.forEach(function (element) {
                if (element.querySelector('table')) {
                    element.innerHTML = '##GaurdianSiganture##';
                }
            });
            var CounselorSignatureDateelements = document.querySelectorAll('[id^="NGaurdianSignDateTime"]');
            CounselorSignatureDateelements.forEach(function (element) {
                element.innerHTML = '##GaurdianSignDateTime##';
            });
            $scope.signPlusObj.IsGaurdianDigitalSignTaken = false;
            $scope.signPlusObj.GaurdianSignString = "";
            $scope.MainPatientSignedObj.IsGaurdianSignatureDone = false;
            $scope.signPlusObj.GaurdianUserId = 0;
            $scope.signPlusObj.GaurdianUserObj = "";
            $scope.signPlusObj.GaurdianFirstName = "";
            $scope.signPlusObj.GaurdianLastName = "";
            $scope.signPlusObj.GaurdianRelationShipId = "";
            $scope.MainPatientSignedObj.GaurdianFirstName = "";
            $scope.MainPatientSignedObj.GaurdianLastName = "";
            $scope.MainPatientSignedObj.GaurdianRelationShipId = "";
            $scope.MainPatientSignedObj.GaurdianUserId = 0;
            $scope.MainPatientSignedObj.GaurdianSignedDateTime = "";
            $scope.MainPatientSignedObj.GaurdianSignCaptureUserId = 0;
        }
        //var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Are you sure you want to Clear  the Signature? </h4>",
        //    function () {

        //    }, function () {
        //        return false;
        //    });



    }

    function genPatientImg(basestr) {
        var canvas = document.getElementById("patientSigantureImg");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = basestr;
    }
    function genPatientIntImg(basestr) {
        var canvas = document.getElementById("patientIntSigantureImg");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = basestr;
    }
    function genStaffImg(basestr) {
        var canvas = document.getElementById("staffSigantureImg");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = basestr;
    }
    function genProviderImg(basestr) {
        var canvas = document.getElementById("doctorSigantureImg");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = basestr;
    }
    function genCounselorImg(basestr) {
        var canvas = document.getElementById("counselorSigantureImg");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = basestr;
    }
    function genAnesthesistImg(basestr) {
        var canvas = document.getElementById("anesthesistSigantureImg");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = basestr;
    }
    function gengaurdianImg(basestr) {
        var canvas = document.getElementById("gaurdianSigantureImg");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = basestr;
    }

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
                    //"BranchId": doctorinfo.hospitalID,
                    "BranchId": $scope.ParentObject.ApptHospitalId,
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

                            $scope.StaffList = $filter("filter")($scope.StaffList, function (item) {
                                return item.RoleId === 8 ||item.RoleId === 10 || item.RoleId === 18 || item.RoleId === 66 || item.RoleId === 67;
                            });


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

    $scope.GetAllUsers();


    $scope.AnesthesiaList = [];
    $scope.GetAnesthesiaList = function () {
        let req = {
            "ParentOrganizationId": $scope.ParentOrganizationId,
            "CheckListModuleId": 3
        };
        eHnoteSurgeryService.GetOrganizationASCCheckListData(req).then(function (resp) {

            $scope.AnesthesiaList = angular.copy(resp.data.AnaesthesiaTypes) || [];

        });
    }
    $scope.GetAnesthesiaList();


    //$scope.onSelectPatientConsentDocument = function (obj) {
    //    $scope.selectedPatientConsentObj.pdfDocument = "";

    //    //var gurl = "https://docs.google.com/gview?url=" + obj.S3URL + "&embedded=true";
    //    var gurl = "https://docs.google.com/gview?url=" + encodeURIComponent(obj.S3URL) + "&embedded=true";

    //    //console.log(gurl);

    //    $scope.selectedPatientConsentObj.pdfDocument = $sce.trustAsResourceUrl(gurl);;
    //    $scope.selectedPatientConsentObj.pdfDocument = obj.S3URL;
    //};
    // Print HTML content
    //$scope.printHTMLContent = function () {
    //    var printWindow = window.open('', '_blank');
    //    if (printWindow) {
    //        printWindow.document.write('<!DOCTYPE html><html><head><title>Print</title></head><body>');
    //        printWindow.document.write($scope.selectedPatientConsentObj.HtmlContent);
    //        printWindow.document.write('</body></html>');
    //        printWindow.document.close();
    //        printWindow.print();
    //    }
    //};

    //// Download as PDF (requires html2pdf.js library)
    //$scope.downloadHTMLAsPDF = function () {
    //    var element = document.getElementById('html-consent-content');
    //    var filename = ($scope.selectedConsentFormName || 'Document') + '.pdf';

    //    if (typeof html2pdf !== 'undefined') {
    //        html2pdf().from(element).save(filename);
    //    } else {
    //        // Fallback: download as HTML
    //        var blob = new Blob([$scope.selectedPatientConsentObj.HtmlContent], { type: 'text/html' });
    //        var link = document.createElement('a');
    //        link.href = URL.createObjectURL(blob);
    //        link.download = filename.replace('.pdf', '.html');
    //        link.click();
    //    }
    //};
    $scope.printHTMLContent = function () {
        var H = USPrintService.HeaderHelpers;

        // Get the HTML content (it's already trusted)
        var fullHtml = $scope.selectedPatientConsentObj.HtmlContent;

        // If it's a trusted object, convert to string
        if (fullHtml && fullHtml.$$unwrapTrustedValue) {
            fullHtml = fullHtml.$$unwrapTrustedValue();
        }

        if (!fullHtml || fullHtml.trim() === '') {
            alertify.error('No content to print.');
            return;
        }

        // Extract header config and body HTML (same as openPrintPreview)
        var cfg = H.extractHeaderConfig(fullHtml) || $scope.headerConfig || {};
        var hasHeader = cfg.IsApplied === true;
        var bodyHtml = H.extractBodyHtml(fullHtml);
        var headerHtml = hasHeader ? H.buildHeaderDiv(cfg) : '';

        // Build the print document (EXACT SAME as openPrintPreview)
        var printDoc = [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '<meta charset="utf-8">',
            '<title>' + ($scope.selectedConsentFormName || 'Consent Form') + '</title>',
            '<style>',
            '@page { size: A4; margin: 15mm; }',
            '@media print {',
            '   body { margin: 0; }',
            '   .no-print { display: none !important; }',
            '}',
            'body {',
            '   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
            '   font-size: 11pt; line-height: 1.4; color: #000;',
            '   margin: 0; padding: 0;',
            '}',

            // ── Repeating header via <thead> ─────────────────────────────
            'table.print-doc { width: 100%; border-collapse: collapse; }',
            'table.print-doc thead { display: table-header-group; }',
            'table.print-doc td.print-header-cell { padding: 0 0 3pt 0; }',
            'table.print-doc td.print-body-cell   { padding: 3pt 0 0 0; vertical-align: top; }',

            // ── Header layout container ──────────────────────────────────
            '.doc-header-block {',
            '   margin: 0 !important;',
            '   padding: 0 !important;',
            '   pointer-events: auto !important;',
            '   user-select: auto !important;',
            '   background: transparent !important;',
            '}',

            // ── Header inner table — exact 2-column alignment ────────────
            '.doc-header-block table {',
            '   width: 100% !important;',
            '   table-layout: fixed !important;',
            '   border-collapse: collapse !important;',
            '   margin: 0 !important;',
            '}',
            '.doc-header-block td {',
            '   vertical-align: middle !important;',
            '   padding: 0 !important;',
            '}',
            '.doc-header-block td:first-child {',
            '   padding-right: 16px !important;',
            '   white-space: nowrap;',
            '}',

            // ── Logo — force clean sizing ────────────────────────────────
            '.doc-header-block img {',
            '   max-height: 70px !important;',
            '   height: auto !important;',
            '   object-fit: contain !important;',
            '   display: block !important;',
            '   margin: 0 !important;',
            '}',

            // ── RESET header-internal text — kill browser default h1/h2/h3 margins ──
            '.doc-header-block h1,',
            '.doc-header-block h2,',
            '.doc-header-block h3,',
            '.doc-header-block h4,',
            '.doc-header-block h5,',
            '.doc-header-block h6,',
            '.doc-header-block p,',
            '.doc-header-block div {',
            '   margin: 0 !important;',
            '   padding: 0 !important;',
            '   line-height: 1.3 !important;',
            '}',
            '.doc-header-block h1 { font-size: 18px; font-weight: bold; }',
            '.doc-header-block h2 { font-size: 16px; font-weight: bold; }',
            '.doc-header-block h3 { font-size: 14px; font-weight: bold; }',
            '.doc-header-block h4 { font-size: 13px; font-weight: bold; }',
            '.doc-header-block h5 { font-size: 12px; font-weight: bold; }',
            '.doc-header-block h6 { font-size: 11px; font-weight: bold; }',
            '.doc-header-block p,',
            '.doc-header-block div { font-size: 11px; }',

            // ── Body ─────────────────────────────────────────────────────
            '.doc-body p, .doc-body div { margin: 4px 0; }',

            // ── Print toolbar ────────────────────────────────────────────
            '.print-bar {',
            '   position: sticky; top: 0; z-index: 9999;',
            '   background: #fff8e1; border-bottom: 1px solid #e0c674;',
            '   padding: 10px 14px; text-align: center;',
            '   font-family: Arial, sans-serif; font-size: 13px; color: #333;',
            '}',
            '.print-bar .tip { display:block; font-weight:600; color:#8a6d3b; margin-bottom:6px; }',
            '.print-bar button {',
            '   background: #1a5c4a; color: #fff; border: none;',
            '   padding: 8px 20px; font-size: 14px; border-radius: 4px;',
            '   cursor: pointer; margin: 0 4px;',
            '}',
            '.print-bar button.secondary { background: #888; }',

            '</style>',
            '</head>',
            '<body>',

            '<div class="print-bar no-print">',
            '   <button onclick="window.print()">&#128424; Print / Save as PDF</button>',
            '   <button class="secondary" onclick="window.close()">Close</button>',
            '</div>',

            '<table class="print-doc">',
            hasHeader
                ? '<thead><tr><td class="print-header-cell">' + headerHtml + '</td></tr></thead>'
                : '',
            '<tbody><tr><td class="print-body-cell"><div class="doc-body">',
            bodyHtml,
            '</div></td></tr></tbody>',
            '</table>',

            '</body>',
            '</html>'
        ].join('\n');

        // Open in new window
        var w = window.open('', '_blank');
        if (!w) {
            alertify.error('Please allow pop-ups to print the document.');
            return;
        }
        w.document.open();
        w.document.write(printDoc);
        w.document.close();
        w.focus();
    };

    // Download HTML Content as PDF (with repeating header like openPrintPreview)
    $scope.downloadHTMLAsPDF = function () {
        var H = USPrintService.HeaderHelpers;

        // Get the HTML content (it's already trusted)
        var fullHtml = $scope.selectedPatientConsentObj.HtmlContent;

        // If it's a trusted object, convert to string
        if (fullHtml && fullHtml.$$unwrapTrustedValue) {
            fullHtml = fullHtml.$$unwrapTrustedValue();
        }

        if (!fullHtml || fullHtml.trim() === '') {
            alertify.error('No content to download.');
            return;
        }

        // Extract header config and body HTML (same as openPrintPreview)
        var cfg = H.extractHeaderConfig(fullHtml) || $scope.headerConfig || {};
        var hasHeader = cfg.IsApplied === true;
        var bodyHtml = H.extractBodyHtml(fullHtml);
        var headerHtml = hasHeader ? H.buildHeaderDiv(cfg) : '';

        // Build the print document (EXACT SAME as openPrintPreview)
        var printDoc = [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '<meta charset="utf-8">',
            '<title>' + ($scope.selectedConsentFormName || 'Consent Form') + '</title>',
            '<style>',
            '@page { size: A4; margin: 15mm; }',
            '@media print {',
            '   body { margin: 0; }',
            '   .no-print { display: none !important; }',
            '}',
            'body {',
            '   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
            '   font-size: 11pt; line-height: 1.4; color: #000;',
            '   margin: 0; padding: 0;',
            '}',

            // ── Repeating header via <thead> ─────────────────────────────
            'table.print-doc { width: 100%; border-collapse: collapse; }',
            'table.print-doc thead { display: table-header-group; }',
            'table.print-doc td.print-header-cell { padding: 0 0 3pt 0; }',
            'table.print-doc td.print-body-cell   { padding: 3pt 0 0 0; vertical-align: top; }',

            // ── Header layout container ──────────────────────────────────
            '.doc-header-block {',
            '   margin: 0 !important;',
            '   padding: 0 !important;',
            '   pointer-events: auto !important;',
            '   user-select: auto !important;',
            '   background: transparent !important;',
            '}',

            // ── Header inner table ────────────────────────────────────────
            '.doc-header-block table {',
            '   width: 100% !important;',
            '   table-layout: fixed !important;',
            '   border-collapse: collapse !important;',
            '   margin: 0 !important;',
            '}',
            '.doc-header-block td {',
            '   vertical-align: middle !important;',
            '   padding: 0 !important;',
            '}',
            '.doc-header-block td:first-child {',
            '   padding-right: 16px !important;',
            '   white-space: nowrap;',
            '}',

            // ── Logo ──────────────────────────────────────────────────────
            '.doc-header-block img {',
            '   max-height: 70px !important;',
            '   height: auto !important;',
            '   object-fit: contain !important;',
            '   display: block !important;',
            '   margin: 0 !important;',
            '}',

            // ── Header text reset ─────────────────────────────────────────
            '.doc-header-block h1,',
            '.doc-header-block h2,',
            '.doc-header-block h3,',
            '.doc-header-block h4,',
            '.doc-header-block h5,',
            '.doc-header-block h6,',
            '.doc-header-block p,',
            '.doc-header-block div {',
            '   margin: 0 !important;',
            '   padding: 0 !important;',
            '   line-height: 1.3 !important;',
            '}',
            '.doc-header-block h1 { font-size: 18px; font-weight: bold; }',
            '.doc-header-block h2 { font-size: 16px; font-weight: bold; }',
            '.doc-header-block h3 { font-size: 14px; font-weight: bold; }',
            '.doc-header-block h4 { font-size: 13px; font-weight: bold; }',
            '.doc-header-block h5 { font-size: 12px; font-weight: bold; }',
            '.doc-header-block h6 { font-size: 11px; font-weight: bold; }',
            '.doc-header-block p,',
            '.doc-header-block div { font-size: 11px; }',

            // ── Body ─────────────────────────────────────────────────────
            '.doc-body p, .doc-body div { margin: 4px 0; }',

            // ── Download bar (instead of print bar) ──────────────────────
            '.download-bar {',
            '   position: sticky; top: 0; z-index: 9999;',
            '   background: #e8f5e9; border-bottom: 1px solid #81c784;',
            '   padding: 10px 14px; text-align: center;',
            '   font-family: Arial, sans-serif; font-size: 13px; color: #333;',
            '}',
            '.download-bar button {',
            '   background: #1a5c4a; color: #fff; border: none;',
            '   padding: 8px 20px; font-size: 14px; border-radius: 4px;',
            '   cursor: pointer; margin: 0 4px;',
            '}',
            '.download-bar button.secondary { background: #888; }',

            '</style>',
            '</head>',
            '<body>',

            '<div class="download-bar no-print">',
            '   <span style="font-weight:600; color:#2e7d32; margin-right:15px;">',
            '       &#9432; Use Ctrl+P (or Cmd+P) and "Save as PDF" to download',
            '   </span>',
            '   <button onclick="window.print()">&#128424; Print / Save as PDF</button>',
            '   <button class="secondary" onclick="window.close()">Close</button>',
            '</div>',

            '<table class="print-doc">',
            hasHeader
                ? '<thead><tr><td class="print-header-cell">' + headerHtml + '</td></tr></thead>'
                : '',
            '<tbody><tr><td class="print-body-cell"><div class="doc-body">',
            bodyHtml,
            '</div></td></tr></tbody>',
            '</table>',

            '</body>',
            '</html>'
        ].join('\n');

        // Open in new window with print dialog
        var w = window.open('', '_blank');
        if (!w) {
            alertify.error('Please allow pop-ups to download the document.');
            return;
        }
        w.document.open();
        w.document.write(printDoc);
        w.document.close();

        // Auto-open print dialog for Save as PDF
        w.onload = function () {
            w.focus();
            w.print();
        };
    };
    // Zoom controls
    $scope.htmlContentZoom = 100;

    $scope.zoomIn = function () {
        if ($scope.htmlContentZoom < 200) $scope.htmlContentZoom += 10;
    };

    $scope.zoomOut = function () {
        if ($scope.htmlContentZoom > 50) $scope.htmlContentZoom -= 10;
    };

    $scope.resetZoom = function () {
        $scope.htmlContentZoom = 100;
    };
    $scope.onSelectPatientConsentDocument = function (obj) {
        $scope.selectedPatientConsentObj.pdfDocument = "";
        $scope.selectedPatientConsentObj.HtmlContent = "";
        $scope.isHTMLContentActive = false;  // ← ADD THIS LINE


        // Track document name for toolbar
        $scope.selectedConsentFormName = obj.ConsentFormName || 'ConsentDocument';
        $scope.selectedConsentFormType = obj.ConsentFormTypeName || '';

        if (obj.HTMLContent && obj.HTMLContent.trim() !== '') {
            $scope.selectedPatientConsentObj.HtmlContent = $sce.trustAsHtml(obj.HTMLContent);
            $scope.htmlContentZoom = 100; // Reset zoom
            $scope.isHTMLContentActive = true;  

        } else {
            var gurl = "https://docs.google.com/gview?url=" + encodeURIComponent(obj.S3URL) + "&embedded=true";
            $scope.selectedPatientConsentObj.pdfDocument = $sce.trustAsResourceUrl(gurl);
            $scope.selectedPatientConsentObj.pdfDocument = obj.S3URL;
            $scope.isHTMLContentActive = false;  

        }
    };



    $scope.onSelectApptConsentForm = function (item) {

        angular.forEach($scope.PatientAppointmentConsentForms, function (mitem) {
            mitem.IsActive = false;
        });
        $scope.consentsMainObj.SelectedConsentFormId = item.OrganizationConsentFormId;
        item.IsActive = true;
        let unsignItem = {
            "SubModuleId": 6,
            "SubModuleName": "Consent Form",
            "ScreenType": "ASC List",
            "ActionType": "Accessed",
            "ActionDescription": `Patient consent ${item.ConsentFormName} for Appointment ID: ${$scope.LogObj.AppointmentId}`,
        }
        $scope.AddAuditLog(unsignItem);
        var canvasp = document.getElementById('patientSigantureImg');
        if (canvasp !== null && canvasp !== "" && canvasp !== undefined) {
            var contextp = canvasp.getContext('2d');
            contextp.clearRect(0, 0, canvasp.width, canvasp.height);
        }

        var canvasPI = document.getElementById('patientIntSigantureImg');
        if (canvasPI !== null && canvasPI !== "" && canvasPI !== undefined) {
            var contextp = canvasPI.getContext('2d');
            contextp.clearRect(0, 0, canvasPI.width, canvasPI.height);
        }

        var canvasS = document.getElementById('staffSigantureImg');
        if (canvasS !== null && canvasS !== "" && canvasS !== undefined) {
            var contextS = canvasS.getContext('2d');
            contextS.clearRect(0, 0, canvasS.width, canvasS.height);
        }
        var canvasD = document.getElementById('doctorSigantureImg');
        if (canvasD !== null && canvasD !== "" && canvasD !== undefined) {
            var contextD = canvasD.getContext('2d');
            contextD.clearRect(0, 0, canvasD.width, canvasD.height);
        }
        var canvasC = document.getElementById('counselorSigantureImg');
        if (canvasC !== null && canvasC !== "" && canvasC !== undefined) {
            var contextC = canvasC.getContext('2d');
            contextC.clearRect(0, 0, canvasC.width, canvasC.height);
        }
        var canvasA = document.getElementById('anesthesistSigantureImg');
        if (canvasA !== null && canvasA !== "" && canvasA !== undefined) {
            var contextA = canvasA.getContext('2d');
            contextA.clearRect(0, 0, canvasA.width, canvasA.height);
        }

        var canvasG = document.getElementById('gaurdianSigantureImg');
        if (canvasG !== null && canvasG !== "" && canvasG !== undefined) {
            var contextG = canvasG.getContext('2d');
            contextG.clearRect(0, 0, canvasG.width, canvasG.height);
        }
        //$scope.GetSignatureDeleteObj.PatientSignature = false;
        //$scope.GetSignatureDeleteObj.StaffSignature = false;
        //$scope.GetSignatureDeleteObj.ProviderSignature = false;
        //$scope.GetSignatureDeleteObj.CounselorSignature = false;
        //$scope.GetSignatureDeleteObj.AnesthesistSignature = false;
        //$scope.GetSignatureDeleteObj.GaurdianSignature = false;

        //$scope.ParentObject.selectedArray = $scope.ParentObject.selectedArray || [];
        if ($scope.ParentObject.Page == "PreOp") {
            var filteredArray = $filter("filter")($scope.consentsMainObj.MainConsents, { "ConsentFormId": item.OrganizationConsentFormId }, true) || [];
            if (filteredArray.length > 0) {
                //$scope.onSelectApptConsentFormNew(filteredArray[0]);
                angular.forEach(filteredArray, function (sitem) {
                    if (item.PatientConsentFormId == sitem.PatientConsentFormId) {
                        $scope.onSelectApptConsentFormNew(sitem);
                    }
                });
            }
        } else {
            var filteredArray = $filter("filter")($scope.consentsMainObj.MainConsents, { "ConsentFormId": item.OrganizationConsentFormId }, true) || [];
            if (filteredArray.length > 0) {
                //$scope.onSelectApptConsentFormNew(filteredArray[0]);
                angular.forEach(filteredArray, function (sitem) {
                    if (item.PatientConsentFormId == sitem.PatientConsentFormId) {
                        $scope.onSelectApptConsentFormNew(sitem);
                    }
                });
            }
        }

    }
    $scope.GetSignatureDeleteObj = {
        "PatientSignature": true,
        "StaffSignature": true,
        "ProviderSignature": true,
        "CounselorSignature": true,
        "AnesthesistSignature": true,
        "GaurdianSignature": true,
        "PatientIntialSignature": false,
    }

    $scope.DeleteSignature = function (type) {
        if (type == 1) {

            $scope.GetSignatureDeleteObj.PatientSignature = false;
            $scope.GetSignatureDeleteObj.PatientIntialSignature = false;
        }
        if (type == 2) {

            $scope.GetSignatureDeleteObj.StaffSignature = false;
        }

        if (type == 3) {

            $scope.GetSignatureDeleteObj.ProviderSignature = false;
        }

        if (type == 4) {
            $scope.GetSignatureDeleteObj.CounselorSignature = false;

        }
        if (type == 5) {
            $scope.GetSignatureDeleteObj.AnesthesistSignature = false;
        }

        if (type == 6) {
            $scope.GetSignatureDeleteObj.GaurdianSignature = false;
        }

    }


    function patientConsentFieldsNewobj() {
        var obj = {
            "PatientId": "",
            "PatientMrNumber": "",
            "PatientOldMrNumber": "",
            "PatientFullName": "",
            "PatientFirstName": "",
            "PatientLastName": "",
            "PatientGender": "",
            "PatientAge": "",
            "PatientDOB": "",
            "PatientMobileNumber": "",
            "PatientHomeNumber": "",
            "PatientEmail": "",
            "PatientSSN": "",
            "PatientBloodGroup": "",
            "PatientPostalAddress1": "",
            "PatientPostalAddress2": "",
            "PatientPostalCityName": "",
            "PatientPostalAreaName": "",
            "PatientPostalStateName": "",
            "PatientPostalZipCode": "",
            "PatientPermanentAddress1": "",
            "PatientPermanentAddress2": "",
            "PatientPermanentCityName": "",
            "PatientPermanentAreaName": "",
            "PatientPermanentStateName": "",
            "PatientPermanentZipCode": "",
            "AppointmentId": "",
            "AppointmentDoctorFirstName": "",
            "AppointmentDoctorLastName": "",
            "AppointmentDoctorFullName": "",
            "AppointmentDoctorMobile": "",
            "AppointmentDate": "",
            "SurgeryDate": "",
            "SurgeryProcedureName": "",
            "SurgeryProcedureCPTCode": "",
            "SurgeryStartTime": "",
            "SurgeryEndTime": "",
            "SurgeryEye": "",
            "PreAdmissionAppointmentDate": "",
            "SurgeryDiagnosis": "",
            "SurgeryKlonopinTiming": "",
            "ReferralDoctorFullName": "",
            "ReferralDoctorFirstName": "",
            "ReferralDoctorLastName": "",
            "ReferralDoctorNPI": "",
            "ReferralDoctorAddress": "",
            "OrganizationName": "",
            "OrganizationMobileNumber": "",
            "OrganizationAddress": "",
            "SurgeryAppointmentTime": "",
            "SurgeryAnesthesiaType": "",
            "PreAdmissionTime": "",
            "AnesthetistName": "",
            "CordinatorIOLType": "",
            "DoctorSpecializationName":"",
            "HospitalContactNumber":"",
            "PatientPermanentAddress":"",
            "PatientVisitDiagnosis":"",
            "DiagnosisName":"",
            "PatientPostalAddress":"",
            "PolicyId":"",
            "RelationName":"",
            "TotalPatientClaimBalance":0,
            "VisitDate":"",
            "CurrentDate":"",
        }
        return obj;
    }
    function FillPatientConsentDetails() {

        var Requestype = "ASC";
        if ($scope.AppointmentTypeId === 7) {
            Requestype = "PreOp";
        }
        else if ($scope.AppointmentTypeId === 4 || $scope.AppointmentTypeId === 14) {
            Requestype = "ASC";
        } else {
            Requestype = "OutPatient";
        }

        var params = {
            "PatientId": $scope.PatientId,
            "AppointmentId": $scope.AppointmentId,
            "OrganizationId": $scope.HospitalId,
            "Requestype": Requestype,
            "VisitId": $scope.VisitId,
        }

        console.log(params);

        eHnoteSettingsDataService.GetPatientAppointmentConsentFieldsData(params).then(function (resp) {
            console.log(JSON.stringify(resp));
            $scope.fillObject = patientConsentFieldsNewobj();
            if (resp.data.status == "Success") {

                $scope.fillObject.PatientId = resp.data.PatientDetails.PatientId || "";
                $scope.fillObject.PatientMrNumber = resp.data.PatientDetails.MrNumber || "";
                $scope.fillObject.PatientOldMrNumber = resp.data.PatientDetails.OldMrno || "";
                $scope.fillObject.PatientFullName = resp.data.PatientDetails.FullName || "";
                $scope.fillObject.PatientFirstName = resp.data.PatientDetails.FirstName || "";
                $scope.fillObject.PatientLastName = resp.data.PatientDetails.LastName || "";
                $scope.fillObject.PatientGender = resp.data.PatientDetails.Gender || "";
                $scope.fillObject.PatientAge = resp.data.PatientDetails?.AgeInYears || "";
                $scope.fillObject.PatientDOB = resp.data.PatientDetails.DOB || "";
                $scope.fillObject.PatientMobileNumber = resp.data.PatientDetails.MobileNumber || "";
                $scope.fillObject.PatientHomeNumber = resp.data.PatientDetails.HomeNumber || "";
                $scope.fillObject.PatientEmail = resp.data.PatientDetails.Email || "";
                $scope.fillObject.PatientSSN = resp.data.PatientDetails.SSN || "";
                $scope.fillObject.PatientBloodGroup = resp.data.PatientDetails.BloodGroup || "";
                $scope.fillObject.PCPDoctorName = resp.data.PatientDetails.PCPDoctorName || "";
                $scope.fillObject.ExternalComanagerName = resp.data.PatientDetails.ExternalComanagerName || "";
                $scope.fillObject.ExtrenalDetails = resp.data.PatientDetails.ExtrenalDetails || "";
                $scope.fillObject.PCP = resp.data.PatientDetails.PCP || [];
                $scope.fillObject.PatientInsuranceDetails = resp.data.PatientDetails.PatientInsuranceDetails || [];

                resp.data.PatientDetails.PostalAddress = resp.data.PatientDetails.PostalAddress || [];
                if (resp.data.PatientDetails.PostalAddress.length > 0) {
                    $scope.fillObject.PatientPostalAddress1 = resp.data.PatientDetails.PostalAddress[0].Address1 || "";
                    $scope.fillObject.PatientPostalAddress2 = resp.data.PatientDetails.PostalAddress[0].Address2 || "";
                    $scope.fillObject.PatientPostalCityName = resp.data.PatientDetails.PostalAddress[0].CityName || "";
                    $scope.fillObject.PatientPostalAreaName = resp.data.PatientDetails.PostalAddress[0].AreaName || "";
                    $scope.fillObject.PatientPostalStateName = resp.data.PatientDetails.PostalAddress[0].StateName || "";
                    $scope.fillObject.PatientPostalZipCode = resp.data.PatientDetails.PostalAddress[0].ZipCode || "";
                }

                resp.data.PatientDetails.PermanentAddress = resp.data.PatientDetails.PermanentAddress || [];
                if (resp.data.PatientDetails.PermanentAddress.length > 0) {
                    $scope.fillObject.PatientPermanentAddress1 = resp.data.PatientDetails.PermanentAddress[0].Address1 || "";
                    $scope.fillObject.PatientPermanentAddress2 = resp.data.PatientDetails.PermanentAddress[0].Address2 || "";
                    $scope.fillObject.PatientPermanentCityName = resp.data.PatientDetails.PermanentAddress[0].CityName || "";
                    $scope.fillObject.PatientPermanentAreaName = resp.data.PatientDetails.PermanentAddress[0].AreaName || "";
                    $scope.fillObject.PatientPermanentStateName = resp.data.PatientDetails.PermanentAddress[0].StateName || "";
                    $scope.fillObject.PatientPermanentZipCode = resp.data.PatientDetails.PermanentAddress[0].ZipCode || "";
                }
                if ($scope.fillObject.PatientPermanentAddress1 !== "" || $scope.fillObject.PatientPermanentAddress2 !== "" || $scope.fillObject.PatientPermanentCityName !== "" || $scope.fillObject.PatientPermanentStateName !== "" || $scope.fillObject.PatientPermanentZipCode!=="") {
                    $scope.fillObject.PatientPermanentAddress = $scope.fillObject.PatientPermanentAddress1 + "," + $scope.fillObject.PatientPermanentAddress2 + "," + '' + $scope.fillObject.PatientPermanentCityName + "," + $scope.fillObject.PatientPermanentStateName + "," + $scope.fillObject.PatientPermanentZipCode;
                }
                if ($scope.fillObject.PatientPostalAddress1 !== "" || $scope.fillObject.PatientPostalAddress2 !== "" || $scope.fillObject.PatientPostalCityName !== "" || $scope.fillObject.PatientPostalStateName !== "" || $scope.fillObject.PatientPostalZipCode!=="") {
                    $scope.fillObject.PatientPostalAddress = $scope.fillObject.PatientPostalAddress1 + "," + $scope.fillObject.PatientPostalAddress2 + "," + '' + $scope.fillObject.PatientPostalCityName + "," + $scope.fillObject.PatientPostalStateName + "," + $scope.fillObject.PatientPostalZipCode;
                }
                $scope.fillObject.DiagnosisName = '';
                if (resp.data.AssessmentPlan.length > 0) {
                    angular.forEach(resp.data.AssessmentPlan, function (item) {
                        if ($scope.fillObject.DiagnosisName == '') {
                            $scope.fillObject.DiagnosisName = item.DiagnosisName;
                        } else {
                            $scope.fillObject.DiagnosisName = $scope.fillObject.DiagnosisName + '\n' + item.DiagnosisName;
                        }


                    });
                }

                $scope.fillObject.AppointmentId = resp.data.AppointmentDetails.AppointmentId || "";
                $scope.MainPatientSignedObj.AppointmentId = $scope.fillObject.AppointmentId;
                $scope.fillObject.AppointmentDoctorFirstName = resp.data.AppointmentDetails.AppointmentDoctorFirstName || "";
                $scope.fillObject.AppointmentDoctorLastName = resp.data.AppointmentDetails.AppointmentDoctorLastName || "";
                $scope.fillObject.AppointmentDoctorFullName = resp.data.AppointmentDetails.AppointmentDoctorFullName || "";
                $scope.fillObject.AppointmentDoctorMobile = resp.data.AppointmentDetails.AppointmentDoctorMobile || "";
                $scope.fillObject.AppointmentDate = resp.data.AppointmentDetails.AppointmentDate || "";
                $scope.fillObject.DoctorSpecializationName = resp.data.AppointmentDetails.Specialization || "";

                /*$scope.fillObject.SurgeryDate = $filter('date')(resp.data.AppointmentDetails.AppointmentDate, "MM-dd-yyyy") || "";*/

                $scope.fillObject.SurgeryDate = $filter('date')(resp.data.ASCDetails.SurgeryDate, "MM-dd-yyyy") || "";
                $scope.fillObject.SurgeryProcedureName = resp.data.ASCDetails.SurgeryProcedureName || "";
                $scope.fillObject.SurgeryProcedureCPTCode = resp.data.ASCDetails.SurgeryProcedureCPTCode || "";
                $scope.fillObject.SurgeryStartTime = resp.data.ASCDetails.SurgeryStartTime || "";
                //if ($scope.fillObject.SurgeryStartTime != '' && $scope.fillObject.SurgeryDate != '') {
                //    let Surgdate = $scope.fillObject.SurgeryDate + " " + $scope.fillObject.SurgeryStartTime;
                //    $scope.fillObject.SurgeryStartTime = $filter('date')(new Date(Surgdate), "hh:mm a");
                //}
                $scope.fillObject.SurgeryAppointmentTime = resp.data.ASCDetails.SurgryAppointmentTime || "";
                if ($scope.fillObject.SurgeryAppointmentTime != '' && $scope.fillObject.SurgeryDate != '') {
                    let Surgdate = $scope.fillObject.SurgeryDate + " " + $scope.fillObject.SurgeryAppointmentTime;
                    $scope.fillObject.SurgeryAppointmentTime = $filter('date')(new Date(Surgdate), "hh:mm a");
                }

                $scope.fillObject.SurgeryEndTime = resp.data.ASCDetails.SurgeryEndTime || "";
                //if ($scope.fillObject.SurgeryEndTime != '' && $scope.fillObject.SurgeryDate != '') {
                //    let Surgdate = $scope.fillObject.SurgeryDate + " " + $scope.fillObject.SurgeryEndTime;
                //    $scope.fillObject.SurgeryEndTime = $filter('date')(new Date(Surgdate), "hh:mm a");
                //}
                $scope.fillObject.SurgeryEye = resp.data.ASCDetails.SurgeryEye || "";
                $scope.fillObject.PreAdmissionAppointmentDate = $filter('date')(resp.data.ASCDetails.PreAdmissionAppointmentDate, "MM-dd-yyyy") || "";
                $scope.fillObject.PreAdmissionTime = resp.data.ASCDetails.PreAdmissionAppointmentTime || "";

                if ($scope.fillObject.PreAdmissionTime != '' && $scope.fillObject.PreAdmissionAppointmentDate != '') {
                    let Surgdate = $scope.fillObject.PreAdmissionAppointmentDate + " " + $scope.fillObject.PreAdmissionTime;
                    $scope.fillObject.PreAdmissionTime = $filter('date')(new Date(Surgdate), "hh:mm a");
                }

                resp.data.ASCDetails.DiagnosisList = resp.data.ASCDetails.DiagnosisList || [];
                if (resp.data.ASCDetails.DiagnosisList.length > 0) {
                    angular.forEach(resp.data.ASCDetails.DiagnosisList, function (ditem) {
                        $scope.fillObject.SurgeryDiagnosis += ditem.DiagnosisName + " ;";
                    });
                }
                resp.data.ASCDetails.AnesthesiaTypelist = resp.data.ASCDetails.AnesthesiaTypelist || [];
                if (resp.data.ASCDetails.AnesthesiaTypelist.length > 0) {
                    angular.forEach(resp.data.ASCDetails.AnesthesiaTypelist, function (ditem) {
                        $scope.fillObject.SurgeryAnesthesiaType += ditem.AnesthesiaType + " ;";
                    });
                }

                $scope.fillObject.AnesthetistName = resp.data.ASCDetails.AnesthetistName || "";
                $scope.fillObject.CordinatorIOLType = resp.data.ASCDetails.CordinatorIOLType || "";


                //$scope.fillObject.SurgeryKlonopinTiming = resp.data.ASCDetails.SurgeryDSurgeryKlonopinTimingiagnosis || "";
                $scope.fillObject.ReferralDoctorFirstName = resp.data.ReferalDetails.ReferralDoctorFirstName || "";
                $scope.fillObject.ReferralDoctorLastName = resp.data.ReferalDetails.ReferralDoctorLastName || "";
                $scope.fillObject.ReferralDoctorFullName = $scope.fillObject.ReferralDoctorFirstName + " " + $scope.fillObject.ReferralDoctorLastName;
                $scope.fillObject.ReferralDoctorNPI = resp.data.ReferalDetails.ReferralDoctorNPI;

                if (resp.data.ReferalDetails.length > 0) {
                    $scope.fillObject.ReferralDoctorAddress = resp.data.ReferalDetails.Address1 + " " + resp.data.ReferalDetails.Address2 + "," + '<br>' + resp.data.ReferalDetails.CityName + "," + resp.data.ReferalDetails.StateName + "," + resp.data.ReferalDetails.ZipCode;
                } else {
                    $scope.fillObject.ReferralDoctorAddress = "";
                }

                resp.data.ASCDetails.ASCMedications = resp.data.ASCDetails.ASCMedications || [];
                if (resp.data.ASCDetails.ASCMedications.length > 0) {
                    angular.forEach(resp.data.ASCDetails.ASCMedications, function (Kitem) {
                        Kitem.MedicationTime = Kitem.MedicationTime || [];
                        if (Kitem.MedicationTime.length > 0) {
                            $scope.fillObject.SurgeryKlonopinTiming = Kitem.MedicationTime[0].MedicationTime || "";
                        }
                    });
                }


                $scope.fillObject.OrganizationName = resp.data.OrganizationDetails.OrganizationName;
                $scope.fillObject.HospitalContactNumber = resp.data.OrganizationDetails.OrganizationMobileNumber||'';
                resp.data.OrganizationDetails.OrganizationAddress = resp.data.OrganizationDetails.OrganizationAddress || [];
                if (resp.data.OrganizationDetails.OrganizationAddress.length > 0) {
                    $scope.fillObject.OrganizationAddress = resp.data.OrganizationDetails.OrganizationAddress[0].Address1 + "," + resp.data.OrganizationDetails.OrganizationAddress[0].Address2 + "," + '' + resp.data.OrganizationDetails.OrganizationAddress[0].CityName + "," + resp.data.OrganizationDetails.OrganizationAddress[0].StateName + "," + resp.data.OrganizationDetails.OrganizationAddress[0].ZipCode;
                }
                resp.data.Billing = resp.data.Billing || [];
                if (resp.data.Billing.length>0) {
                    $scope.fillObject.PolicyId = resp.data.Billing[0].PolicyId || '';
                    $scope.fillObject.RelationName = resp.data.Billing[0].RelationName || '';
                }
                if ($scope.fillObject.RelationName == 'Self') {
                    $scope.fillObject.RelationName = $scope.fillObject.PatientFullName || '';
                }
                resp.data.TotalPatientClaimBalance = resp.data.TotalPatientClaimBalance || 0;
                $scope.fillObject.TotalPatientClaimBalance = resp.data.TotalPatientClaimBalance || 0;
                resp.data.Visitdate = resp.data.Visitdate || '';
                $scope.fillObject.VisitDate = resp.data.Visitdate || '';
                $scope.fillObject.CurrentDate = $filter('date')(new Date(), "MM-dd-yyyy");
                if ($scope.fillObject.VisitDate!=='') {
                    $scope.fillObject.VisitDate = $filter('date')($scope.fillObject.VisitDate, "MM-dd-yyyy");
                }

                if ($scope.fillObject.PatientDOB != '') {
                    $scope.fillObject.PatientDOB = $filter('date')($scope.fillObject.PatientDOB, "MM-dd-yyyy");
                }

                if ($scope.fillObject.PatientMobileNumber != '') {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.fillObject.PatientMobileNumber);
                    $scope.fillObject.PatientMobileNumber = obj.UsFormatMobileNumber;
                }

                if ($scope.fillObject.AppointmentDoctorMobile != '') {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.fillObject.AppointmentDoctorMobile);
                    $scope.fillObject.AppointmentDoctorMobile = obj.UsFormatMobileNumber;
                }
                if ($scope.fillObject.HospitalContactNumber != '') {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.fillObject.HospitalContactNumber);
                    $scope.fillObject.HospitalContactNumber = obj.UsFormatMobileNumber;
                }
                var SurgeryKlonopinelements = document.querySelectorAll('[id^="NPreOpKlonopinTime"]');
                SurgeryKlonopinelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PreOpKlonopinTime##/g, $scope.fillObject.SurgeryKlonopinTiming);
                });

                var PatientNameelements = document.querySelectorAll('[id^="NPatientName"]');
                PatientNameelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientName##/g, $scope.fillObject.PatientFullName);
                });
                var HomeNumberelements = document.querySelectorAll('[id^="NPatientHomeNumber"]');
                HomeNumberelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientHomeNumber##/g, $scope.fillObject.PatientHomeNumber);
                });
                var PCPNameElements = document.querySelectorAll('[id^="NPCPName"]');
                PCPNameElements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PCPName##/g, $scope.fillObject.PCPDoctorName);
                });

                var PatientMobileelements = document.querySelectorAll('[id^="NPatientMobile"]');
                PatientMobileelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientMobile##/g, $scope.fillObject.PatientMobileNumber);
                });
                var PatientGenderelements = document.querySelectorAll('[id^="NPatientGender"]');
                PatientGenderelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientGender##/g, $scope.fillObject.PatientGender);
                });
                var PatientAgeelements = document.querySelectorAll('[id^="NPatientAge"]');
                PatientAgeelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientAge##/g, $scope.fillObject.PatientAge);
                });
                var CoManagerNameelements = document.querySelectorAll('[id^="NCo-ManagerName"]');
                CoManagerNameelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##Co-ManagerName##/g, $scope.fillObject.ExternalComanagerName);
                });
                let exteranlCoMangerAdderss = $scope.fillObject.ExtrenalDetails;
                $scope.fillObject.CoManagerAddress = "";
                if (exteranlCoMangerAdderss) {
                    const addressParts = [
                        exteranlCoMangerAdderss.Address1,
                        exteranlCoMangerAdderss.Address2,
                        exteranlCoMangerAdderss.CityName,
                        exteranlCoMangerAdderss.StateName,
                        exteranlCoMangerAdderss.ZipCode,
                        exteranlCoMangerAdderss.CountyName
                    ].filter(part => part);
                    $scope.fillObject.CoManagerAddress = addressParts.join(', ');
                }
                var CoManagerAddresselements = document.querySelectorAll('[id^="NCo-ManagerAddress"]');
                CoManagerAddresselements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##Co-ManagerAddress##/g, $scope.fillObject.CoManagerAddress);
                });
                $scope.fillObject.PCPAddress = "";
                if ($scope.fillObject.PCP && $scope.fillObject.PCP.length > 0) {
                    let pcpAdderss = $scope.fillObject.PCP[0];
                    if (pcpAdderss) {
                        const addressParts = [
                            pcpAdderss.Address1,
                            pcpAdderss.Address2,
                            pcpAdderss.CityName,
                            pcpAdderss.StateName,
                            pcpAdderss.ZipCode,
                            pcpAdderss.CountyName
                        ].filter(part => part);
                        $scope.fillObject.PCPAddress = addressParts.join(', ');
                    }
                }
                var PCPAddresselements = document.querySelectorAll('[id^="NPCPAddress"]');
                PCPAddresselements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PCPAddress##/g, $scope.fillObject.PCPAddress);
                });
                const insuranceDetails = $scope.fillObject.PatientInsuranceDetails || [];
                $scope.fillObject.primaryInsuranceName = "";
                $scope.fillObject.secondaryInsuranceName = "";
                insuranceDetails.forEach(item => {
                    const insuranceName = `${item.OrganizationPayorName} , ${item.PlanName}`;
                    if (item.IdentifierId === 1) {
                        $scope.fillObject.primaryInsuranceName = insuranceName;
                    } else if (item.IdentifierId === 2) {
                        $scope.fillObject.secondaryInsuranceName = insuranceName;
                    }
                });
                var primaryinsuranceelements = document.querySelectorAll('[id^="NPrimaryInsuranceName"]');
                primaryinsuranceelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PrimaryInsuranceName##/g, $scope.fillObject.primaryInsuranceName);
                });
                var secondaryinsuranceelements = document.querySelectorAll('[id^="NSecondaryInsuranceName"]');
                secondaryinsuranceelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##SecondaryInsuranceName##/g, $scope.fillObject.secondaryInsuranceName);
                });
                var PatientMrNoelements = document.querySelectorAll('[id^="NPatientMrNo"]');
                PatientMrNoelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientMrNo##/g, $scope.fillObject.PatientMrNumber);
                });
                var PatientFirstNameelements = document.querySelectorAll('[id^="NPatientFirstName"]');
                PatientFirstNameelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientFirstName##/g, $scope.fillObject.PatientFirstName);
                });
                var PatientLastNameelements = document.querySelectorAll('[id^="NPatientLastName"]');
                PatientLastNameelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientLastName##/g, $scope.fillObject.PatientLastName);
                });
                var PatientSSNelements = document.querySelectorAll('[id^="NPatientSSN"]');
                PatientSSNelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientSSN##/g, $scope.fillObject.PatientSSN);
                });
                var PatientEmailelements = document.querySelectorAll('[id^="NPatientEmail"]');
                PatientEmailelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientEmail##/g, $scope.fillObject.PatientEmail);
                });
                var PatientDOBelements = document.querySelectorAll('[id^="NPatientDOB"]');
                PatientDOBelements.forEach(function (element) {
                    /*element.innerHTML = element.innerHTML.replace(/##PatientDOB##/g, $scope.PatientDOB);*/
                    element.innerHTML = element.innerHTML.replace(/##PatientDOB##/g, $scope.fillObject.PatientDOB);
                });
                var PatientBloodGroupelements = document.querySelectorAll('[id^="NPatientBloodGroup"]');
                PatientBloodGroupelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientBloodGroup##/g, $scope.fillObject.PatientBloodGroup);
                });

                var HospitalNameelements = document.querySelectorAll('[id^="NHospitalName"]');
                HospitalNameelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##HospitalName##/g, $scope.fillObject.OrganizationName);
                });
                var DoctorNameelements = document.querySelectorAll('[id^="NDoctorName"]');
                DoctorNameelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##DoctorName##/g, $scope.fillObject.AppointmentDoctorFullName);
                });
                var DoctorMobileelements = document.querySelectorAll('[id^="NDoctorMobile"]');
                DoctorMobileelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##DoctorMobile##/g, $scope.fillObject.AppointmentDoctorMobile);
                });
                var HospitalAddresselements = document.querySelectorAll('[id^="NHospitalAddress"]');
                HospitalAddresselements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##HospitalAddress##/g, $scope.fillObject.OrganizationAddress);
                });
                var HospitalContactNumberelements = document.querySelectorAll('[id^="NHospitalContactNumber"]');
                HospitalContactNumberelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##HospitalContactNumber##/g, $scope.fillObject.HospitalContactNumber);
                });
                var DoctorSpecializationNameelements = document.querySelectorAll('[id^="NDoctorSpecializationName"]');
                DoctorSpecializationNameelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##DoctorSpecializationName##/g, $scope.fillObject.DoctorSpecializationName);
                });
                var PatientPermanentAddresselements = document.querySelectorAll('[id^="NPatientPermanentAddress"]');
                PatientPermanentAddresselements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientPermanentAddress##/g, $scope.fillObject.PatientPermanentAddress);
                });
                var PatientPostalAddresselements = document.querySelectorAll('[id^="NPatientPostalAddress"]');
                PatientPostalAddresselements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientPostalAddress##/g, $scope.fillObject.PatientPostalAddress);
                });
                var diagnosis = $scope.fillObject.DiagnosisName.replace(/\n/g, '<br>');

                var PatientVisitDiagnosiselements = document.querySelectorAll('[id^="NPatientVisitDiagnosis"]');
                PatientVisitDiagnosiselements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientVisitDiagnosis##/g, diagnosis);
                });




                var SurgeryDateElement = document.querySelectorAll('[id^="NSurgeryDate"]');
                SurgeryDateElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##SurgeryDate##/g, $scope.fillObject.SurgeryDate);
                });

                var SurgeryNameElement = document.querySelectorAll('[id^="NSurgeryName"]');
                SurgeryNameElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##SurgeryName##/g, $scope.fillObject.SurgeryProcedureName + " (" + $scope.fillObject.SurgeryProcedureCPTCode + " )");
                });

                var SelectedEye = "";
                var Spanishsurgeryeye = "";
                if ($scope.fillObject.SurgeryEye === "OD") {
                    SelectedEye = "Right Eye";
                    Spanishsurgeryeye = "Ojo derecho";
                } else if ($scope.fillObject.SurgeryEye === "OS") {
                    SelectedEye = "Left Eye";
                    Spanishsurgeryeye = "Ojo izquirdo";
                } else if ($scope.fillObject.SurgeryEye === "OU") {
                    SelectedEye = "Both Eyes";
                    Spanishsurgeryeye = "Ambos ojos";
                }

                var SurgeryEyeElement = document.querySelectorAll('[id^="NSurgeryEye"]');
                SurgeryEyeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##SurgeryEye##/g, SelectedEye); //$scope.fillObject.SurgeryEye
                });

                var SpanishsurgeryeyeElement = document.querySelectorAll('[id^="NSpanishsurgeryeye"]');
                SpanishsurgeryeyeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##Spanishsurgeryeye##/g, Spanishsurgeryeye);
                });

                var SurgeryStartTimeElement = document.querySelectorAll('[id^="NStartTimeOfSurgery"]');
                SurgeryStartTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##StartTimeOfSurgery##/g, $scope.fillObject.SurgeryStartTime);
                });

                var SurgeryEndTimeElement = document.querySelectorAll('[id^="NEndtimeOfSurgery"]');
                SurgeryEndTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##EndtimeOfSurgery##/g, $scope.fillObject.SurgeryEndTime);
                });


                var SurgeryPreAdmissionDateelement = document.querySelectorAll('[id^="NPreAdmissionDate"]');
                SurgeryPreAdmissionDateelement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PreAdmissionDate##/g, $scope.fillObject.PreAdmissionAppointmentDate);
                });
                var ReferalProviderElement = document.querySelectorAll('[id^="NReferralProviderName"]');
                ReferalProviderElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##ReferralProviderName##/g, $scope.fillObject.ReferralDoctorFullName);
                });

                var ReferalProviderAddressElement = document.querySelectorAll('[id^="NReferalProviderAddress"]');
                ReferalProviderAddressElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##ReferalProviderAddress##/g, $scope.fillObject.ReferralDoctorAddress);
                });

                var SurgeryDiagnosisElement = document.querySelectorAll('[id^="NSurgeryDiagnosis"]');
                SurgeryDiagnosisElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##SurgeryDiagnosis##/g, $scope.fillObject.SurgeryDiagnosis);
                });

                var SurgeryAppointmentTimeElement = document.querySelectorAll('[id^="NSurgeryAppointmentTime"]');
                SurgeryAppointmentTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##SurgeryAppointmentTime##/g, $scope.fillObject.SurgeryAppointmentTime);
                });
                var PreAdmissionTimeElement = document.querySelectorAll('[id^="NPreAdmissionTime"]');
                PreAdmissionTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PreAdmissionTime##/g, $scope.fillObject.PreAdmissionTime);
                });

                if ($scope.fillObject.SurgeryAnesthesiaType != '') {
                    var SurgeryAnesthesiaTypeElement = document.querySelectorAll('[id^="NSurgeryAnesthesiaType"]');
                    SurgeryAnesthesiaTypeElement.forEach(function (element) {
                        element.innerHTML = element.innerHTML.replace(/##SurgeryAnesthesiaType##/g, $scope.fillObject.SurgeryAnesthesiaType);
                    });
                }

                if ($scope.fillObject.CordinatorIOLType !='') {
                    var CoordinatorIOLtype = document.querySelectorAll('[id^="NIOLTypeName"]');
                    CoordinatorIOLtype.forEach(function (element) {
                        element.innerHTML = element.innerHTML.replace(/##IOLTypeName##/g, $scope.fillObject.CordinatorIOLType);
                    });
                }

                if ($scope.fillObject.AnesthetistName) {
                    var AnesthesistNameElement = document.querySelectorAll('[id^="NAnesthesiologistName"]');
                    AnesthesistNameElement.forEach(function (element) {
                        element.innerHTML = element.innerHTML.replace(/##AnesthesiologistName##/g, $scope.fillObject.AnesthetistName);
                    });
                }

                var editorScope = textAngularManager.retrieveEditor('htmlPatientTemplateconsent').scope;
                $timeout(function () {
                    editorScope.displayElements.text[0].focus();
                    var innerTaTextElementId = editorScope.displayElements.text[0].id;
                    placeCaretAtEnd(document.getElementById(innerTaTextElementId));
                });


                var PolicyNumberelements = document.querySelectorAll('[id^="NPolicyNumber"]');
                PolicyNumberelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PolicyNumber##/g, $scope.fillObject.PolicyId);
                });
                var InsuredPersonNameelements = document.querySelectorAll('[id^="NInsuredPersonName"]');
                InsuredPersonNameelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##InsuredPersonName##/g, $scope.fillObject.RelationName);
                });
                var PatientDueAmountelements = document.querySelectorAll('[id^="NPatientDueAmount"]');
                PatientDueAmountelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientDueAmount##/g, $scope.fillObject.TotalPatientClaimBalance);
                });
                var AppointmentDateelements = document.querySelectorAll('[id^="NAppointmentDate"]');
                AppointmentDateelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##AppointmentDate##/g, $scope.fillObject.VisitDate);
                });
                var CurrentDateelements = document.querySelectorAll('[id^="NCurrentDate"]');
                CurrentDateelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##CurrentDate##/g, $scope.fillObject.CurrentDate);
                });

            }


        }, function (err) {
            console.log(err);
        });
    }



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


    $scope.navtoprintsignedConsent = function (item) {
        console.log(item);
        let LogItem = {
            "SubModuleId": 6,
            "SubModuleName": "Consent Form",
            "ScreenType": "ASC Chart",
            "ActionType": "Accessed",
            "ActionDescription": ` ${item.ConsentFormName}  Consent form Print of Appointment ID: ${$scope.LogObj.AppointmentId}`,
        }
        $scope.AddAuditLog(LogItem);
        item.PdfContent = item.PdfContent || '';



        //if (item.PdfContent) {
        //    $scope.openPrintPreview(item.PdfContent)
        //}
        ////else
        ////if (item.S3URL && item.S3URL !== "") {

        ////    window.open(item.S3URL, '_blank');

        ////    return;
        ////}

        // STEP 2
        // Generate PDF first time
        //var originalHTML = item.HTMLContent || item.PdfContent || "";
        var originalHTML = '';
        if (item.PatientConsentFormId == $scope.MainPatientSignedObj.PatientConsentDocumentId) {
            originalHTML = $scope.selectedPatientTempConsentObj.HtmlContent;

        } else {
            originalHTML = item.HTMLContent || item.PdfContent || "";
        }
        
        // *** KEY FIX: inject signature into HTML string before sending ***
      

        // Extract header config from the HTML comment
        var H = USPrintService.HeaderHelpers;
        var cfg = H.extractHeaderConfig(originalHTML || '') || {};
        var consentName = item.ConsentFormName || item.DocumentName || '';
        var fullHtml = $scope.selectedPatientTempConsentObj.HtmlContent || '';

        // Extract cfg + body using centralized helpers
        var hasHeader = cfg.IsApplied === true;
        var bodyHtml = H.extractBodyHtml(fullHtml);
        var headerHtml = hasHeader ? H.buildHeaderDiv(cfg) : '';

        // Combine header + body
        var completeHtml = headerHtml + bodyHtml;

        // Embed config into HTML (adds <!--HEADER-CONFIG:{...}--> comment)
        //var finalHtmlForDB = H.embedHeaderConfig(completeHtml, cfg);
        // Build pdfmake content nodes from body HTML (same as openPrintPreview does)
        var pdfmakehtmlcontent = H.buildPdfContent(bodyHtml);

        // Build the header fn and margin — one-liner each
        var headerFn = hasHeader ? H.buildPageHeader(cfg) : null;
        var dynamicTopMargin = hasHeader ? H.calcPdfTopMargin(cfg) : 40;

        var consentName = $scope.MainPatientSignedObj.ConsentFormName || '';

        var PrintInfo = {
            "htmlcontent": pdfmakehtmlcontent,
            "pdfHeader": headerFn,
            "consentName": consentName,
            "hasHeader": hasHeader,
            "topMargin": dynamicTopMargin
        };

        var file = USPrintService.GenerateAddPatientConsentDocumentPrint(PrintInfo);
        pdfMake.createPdf(file).getDataUrl(function (dataURL) {
            var base64result = dataURL.split(',')[1];
            var req = {
                UserId: $scope.UserId,
                AppointmentId: $scope.AppointmentId,
                PatientConsentDocumentId: item.PatientConsentFormId,

                HtmlContent: originalHTML,

                HeaderText: consentName || "",
                HeaderCfg: cfg || null,

                Base64: base64result, // NOW VALID

                PatientName: $scope.PatientName || '',
                AppointmentDate: $scope.AppointmentDate || null,
                PatientId: $scope.PatientId || 0,
                HospitalId: $scope.HospitalId || 0,
                S3URL: item.S3URL || '',
            };

            eHnotePatientDataService.GenerateConsentPdfOnPrint(req)
                .then(function (resp) {

                    if (!resp.data || resp.data.Status !== "Success") {

                        alertify.error("PDF generation failed");
                        return;
                    }

                    item.S3URL = resp.data.S3URL;

                    window.open(item.S3URL, '_blank');

                }, function (err) {

                    console.log(err);

                    alertify.error("Unable to generate PDF");
                });
        });
        //var req = {
        //    UserId: $scope.UserId,
        //    AppointmentId: $scope.AppointmentId,
        //    PatientConsentDocumentId:item.PatientConsentFormId,

        //    HtmlContent: originalHTML,

        //    HeaderText: consentName || "",

        //    HeaderCfg:cfg || null,
        //    Base64: base64result || null,
        //    PatientName: $scope.PatientName || '',
        //    AppointmentDate:  $scope.AppointmentDate || null,
        //    PatientId: $scope.PatientId || 0,
        //    HospitalId: $scope.HospitalId || 0,
        //};

        //eHnotePatientDataService.GenerateConsentPdfOnPrint(req).then(function (resp) {

        //        if (!resp.data ||
        //            resp.data.Status !== "Success") {

        //            alertify.error("PDF generation failed");
        //            return;
        //        }

        //        // Save returned S3URL locally
        //        item.S3URL = resp.data.S3URL;

        //        // Open PDF
        //        window.open(item.S3URL, '_blank');

        //    }, function (err) {

        //        console.log(err);

        //        alertify.error(
        //            "Unable to generate PDF");
        //    });

    }
    $scope.openPrintPreview = function (fullHtml) {
        var H = USPrintService.HeaderHelpers;

        //var fullHtml = $scope.mainConsentObj.HtmlContent || '';

        var cfg = H.extractHeaderConfig(fullHtml) || $scope.headerConfig || {};
        var hasHeader = cfg.IsApplied === true;
        var bodyHtml = H.extractBodyHtml(fullHtml);
        var headerHtml = hasHeader ? H.buildHeaderDiv(cfg) : '';

        var printDoc = [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '<meta charset="utf-8">',
            '<title> </title>',
            '<style>',
            '@page { size: A4; margin: 15mm; }',
            '@media print {',
            '   body { margin: 0; }',
            '   .no-print { display: none !important; }',
            '}',
            'body {',
            '   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
            '   font-size: 11pt; line-height: 1.4; color: #000;',
            '   margin: 0; padding: 0;',
            '}',

            // ── Repeating header via <thead> ─────────────────────────────
            'table.print-doc { width: 100%; border-collapse: collapse; }',
            'table.print-doc thead { display: table-header-group; }',
            'table.print-doc td.print-header-cell { padding: 0 0 3pt 0; }',
            'table.print-doc td.print-body-cell   { padding: 3pt 0 0 0; vertical-align: top; }',

            // ── Header layout container ──────────────────────────────────
            '.doc-header-block {',
            '   margin: 0 !important;',
            '   padding: 0 !important;',
            '   pointer-events: auto !important;',
            '   user-select: auto !important;',
            '   background: transparent !important;',          // no grey tint in print
            //'   border-bottom: 1px solid #e0e0e0 !important;',
            '}',

            // ── Header inner table — exact 2-column alignment ────────────
            '.doc-header-block table {',
            '   width: 100% !important;',
            '   table-layout: fixed !important;',
            '   border-collapse: collapse !important;',
            '   margin: 0 !important;',
            '}',
            '.doc-header-block td {',
            '   vertical-align: middle !important;',            // ← middle-align logo with title
            '   padding: 0 !important;',
            '}',
            '.doc-header-block td:first-child {',
            '   padding-right: 16px !important;',        // increased from 12
            '   white-space: nowrap;',
            '}',

            // ── Logo — force clean sizing ────────────────────────────────
            '.doc-header-block img {',
            '   max-height: 70px !important;',           // only cap height, not width
            '   height: auto !important;',
            '   object-fit: contain !important;',
            '   display: block !important;',
            '   margin: 0 !important;',
            // don't override width — buildHeaderDiv set the exact px from cfg.logoSize
            '}',

            // ── RESET header-internal text — kill browser default h1/h2/h3 margins ──
            '.doc-header-block h1,',
            '.doc-header-block h2,',
            '.doc-header-block h3,',
            '.doc-header-block h4,',
            '.doc-header-block h5,',
            '.doc-header-block h6,',
            '.doc-header-block p,',
            '.doc-header-block div {',
            '   margin: 0 !important;',                         // ← THIS IS THE KEY FIX
            '   padding: 0 !important;',
            '   line-height: 1.3 !important;',
            '}',
            '.doc-header-block h1 { font-size: 18px; font-weight: bold; }',
            '.doc-header-block h2 { font-size: 16px; font-weight: bold; }',
            '.doc-header-block h3 { font-size: 14px; font-weight: bold; }',
            '.doc-header-block h4 { font-size: 13px; font-weight: bold; }',
            '.doc-header-block h5 { font-size: 12px; font-weight: bold; }',
            '.doc-header-block h6 { font-size: 11px; font-weight: bold; }',
            '.doc-header-block p,',
            '.doc-header-block div { font-size: 11px; }',

            // ── Body ─────────────────────────────────────────────────────
            '.doc-body p, .doc-body div { margin: 4px 0; }',

            // ── Print toolbar ────────────────────────────────────────────
            '.print-bar {',
            '   position: sticky; top: 0; z-index: 9999;',
            '   background: #fff8e1; border-bottom: 1px solid #e0c674;',
            '   padding: 10px 14px; text-align: center;',
            '   font-family: Arial, sans-serif; font-size: 13px; color: #333;',
            '}',
            '.print-bar .tip { display:block; font-weight:600; color:#8a6d3b; margin-bottom:6px; }',
            '.print-bar button {',
            '   background: #1a5c4a; color: #fff; border: none;',
            '   padding: 8px 20px; font-size: 14px; border-radius: 4px;',
            '   cursor: pointer; margin: 0 4px;',
            '}',
            '.print-bar button.secondary { background: #888; }',

            '</style>',
            '</head>',
            '<body>',

            '<div class="print-bar no-print">',
            //'   <span class="tip">',
            //'       &#9432; Tip: in the print dialog, open "More settings" and uncheck ',
            //'       <b>"Headers and footers"</b> to hide the date and URL.',
            //'   </span>',
            '   <button onclick="window.print()">&#128424; Print / Save as PDF</button>',
            '   <button class="secondary" onclick="window.close()">Close</button>',
            '</div>',

            '<table class="print-doc">',
            hasHeader
                //? '<thead><tr><td class="print-header-cell">' + headerHtml + '</td></tr></thead>'
                ? '<thead><tr><td>' + headerHtml + '</td></tr></thead>'

                : '',
            '<tbody><tr><td class="print-body-cell"><div class="doc-body">',
            bodyHtml,
            '</div></td></tr></tbody>',
            '</table>',

            '</body>',
            '</html>'
        ].join('\n');

        var w = window.open('', '_blank');
        if (!w) {
            alertify.error('Please allow pop-ups to preview the document.');
            return;
        }
        w.document.open();
        w.document.write(printDoc);
        w.document.close();
        w.focus();
    };

    $scope.SaveAnesthesiaType = function () {
        var AnesthesiaType = '';
        if ($scope.AnesthesiaList.length > 0) {
            angular.forEach($scope.AnesthesiaList, function (ditem) {
                if (ditem.IsSelected) {
                    AnesthesiaType += ditem.AnesthesiaType + " ;";
                }
            });
        }

        var SurgeryAnesthesiaTypeElement = document.querySelectorAll('[id^="NSurgeryAnesthesiaType"]');
        SurgeryAnesthesiaTypeElement.forEach(function (element) {
            element.innerHTML = '##SurgeryAnesthesiaType##';
        });

        if (AnesthesiaType != '') {
            var SurgeryAnesthesiaTypeElement = document.querySelectorAll('[id^="NSurgeryAnesthesiaType"]');
            SurgeryAnesthesiaTypeElement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##SurgeryAnesthesiaType##/g, AnesthesiaType);
            });
        }
    };

    $scope.ClearAnesthesiaCheck = function () {
        angular.forEach($scope.AnesthesiaList, function (item) {
            item.IsSelected = false;
        });
    };

    //$scope.Patientdetails = function () {
    //    let patientId = $scope.cacheStorageItem.PatientID || 0;
    //    eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
    //    function ongetPatientDetailsSuccess(data) {
    //        if (data !== undefined) {
    //            var patientitem = data;
    //            $scope.cacheStorageItem.PatientTagList = patientitem.Patient[0].PatientTagList;          
    //        }
    //    }
    //    function ongetPatientDetailsError(error) {
    //        console.log(error);
    //    }
    //}
    //$scope.Patientdetails();

    $scope.patiendetilsopen = function () {
        let patientId = $scope.cacheStorageItem.PatientID || 0;
        eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(data) {
            if (data !== undefined) {
                var selectedPatientData = data;

                $scope.PaitentDetails = {
                    "FullName": selectedPatientData.Patient[0].FullName || "",
                    "PatientDisplayId": selectedPatientData.Patient[0].PatientDisplayId || "",
                    "MobileNo": selectedPatientData.Patient[0].MobileNo || 0,
                    "DOB": selectedPatientData.Patient[0].DOB || "",
                    "AgeInYears": selectedPatientData.Patient[0].AgeInYears || 0,
                    "AgeInMonths": selectedPatientData.Patient[0].AgeInMonths || 0,
                    "S3URL": selectedPatientData.Patient[0].S3URL || "",
                    "SocialSecurityNo": selectedPatientData.Patient[0].SocialSecurityNo || "",
                    "BloodGroupName": selectedPatientData.Patient[0].PatientOtherDetails[0].BloodGroupName || "",
                    "MaritalStatusName": selectedPatientData.Patient[0].PatientOtherDetails[0].MaritalStatus || "",
                    "ExternalComanagerName": selectedPatientData.Patient[0].ExternalComanagerName || '',
                    "InternalComanagerName": selectedPatientData.Patient[0].InternalComanagerName || '',
                    "PCPDoctorName": selectedPatientData.Patient[0].PCPDoctorName || '',
                    "RefferalName": selectedPatientData.Patient[0].ReferralName || '',
                    "ContactInfo": {
                        "EmailID": selectedPatientData.Patient[0].EmailId || "",
                    }
                }

                $scope.PostalAddressSummaryObj = {
                    "AddressId": selectedPatientData.PatientAddress.PostalAddress.AddressId || 0,
                    "AddressLine1": selectedPatientData.PatientAddress.PostalAddress.AddressLine1 || "",
                    "AddressLine2": selectedPatientData.PatientAddress.PostalAddress.AddressLine2 || "",
                    "ZipCode": selectedPatientData.PatientAddress.PostalAddress.ZipCode || "",
                    "CountyId": selectedPatientData.PatientAddress.PostalAddress.CountyId || 0,
                    "CountyName": selectedPatientData.PatientAddress.PostalAddress.CountyName || "",
                    "CityName": selectedPatientData.PatientAddress.PostalAddress.CityName || "",
                    "CityId": selectedPatientData.PatientAddress.PostalAddress.CityId || 0,
                    "StateName": selectedPatientData.PatientAddress.PostalAddress.StateName || "",
                    "StateId": selectedPatientData.PatientAddress.PostalAddress.StateId || 0,
                    "CountryName": selectedPatientData.PatientAddress.PostalAddress.CountryName || "",
                    "CountryId": selectedPatientData.PatientAddress.PostalAddress.CountryId || 0,
                }

                $scope.PermanentAddressSummaryObj = {
                    "AddressId": selectedPatientData.PatientAddress.PermanentAddress.AddressId || 0,
                    "AddressLine1": selectedPatientData.PatientAddress.PermanentAddress.AddressLine1 || "",
                    "AddressLine2": selectedPatientData.PatientAddress.PermanentAddress.AddressLine2 || "",
                    "ZipCode": selectedPatientData.PatientAddress.PermanentAddress.ZipCode || "",
                    "CountyId": selectedPatientData.PatientAddress.PermanentAddress.CountyId || 0,
                    "CountyName": selectedPatientData.PatientAddress.PermanentAddress.CountyName || "",
                    "CityName": selectedPatientData.PatientAddress.PermanentAddress.CityName || "",
                    "CityId": selectedPatientData.PatientAddress.PermanentAddress.CityId || 0,
                    "StateName": selectedPatientData.PatientAddress.PermanentAddress.StateName || "",
                    "StateId": selectedPatientData.PatientAddress.PermanentAddress.StateId || 0,
                    "CountryName": selectedPatientData.PatientAddress.PermanentAddress.CountryName || "",
                    "CountryId": selectedPatientData.PatientAddress.PermanentAddress.CountryId || 0,
                }

                $scope.PatientOfficeNumber = selectedPatientData.Patient[0].OfficeAreaCode + selectedPatientData.Patient[0].PatientOfficeNumber;
                var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
                $scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;

                $scope.PatientMobileNumber = selectedPatientData.Patient[0].MobileNo;
                var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMobileNumber);
                $scope.PatientMobileNumber = obj2.UsFormatMobileNumber;

                $scope.DemographicSummaryObj = {
                    "LanguageName": selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
                    "Proficiency": selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
                    "SexualOrientation": selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
                    "GenderIdentityStatus": selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
                }

            }
        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }
    }

    $scope.OldPatientConsentFormId = 0;
    $scope.AddExpiredTOnewConsent = function (item) {

        angular.forEach($scope.consentsMainObj.OrganizationConsents, function (Mitem) {
            if ($scope.consentsMainObj.SelectedConsentTemplateId === Mitem.ConsentTemplateId) {
                if (Mitem.ConsentTemplateDetails.length > 0) {
                    angular.forEach(Mitem.ConsentTemplateDetails, function (sitem) {
                        if (sitem.OrganisationConsentFormId === item.OrganizationConsentFormId) {
                            if (!sitem.IsPatientSignRequired) {
                                item.PatientClass = 'disabled';
                            } else {
                                item.PatientClass = 'incomplete';
                            }

                            if (!sitem.IsDoctorSignRequired) {
                                item.ProviderClass = 'disabled';
                            } else {
                                item.ProviderClass = 'incomplete';
                            }

                            if (!sitem.IsStaffSignRequired) {
                                item.StaffClass = 'disabled';
                            } else {
                                item.StaffClass = 'incomplete';
                            }

                            if (!sitem.IsGuardianSignRequired) {
                                item.GaurdianClass = 'disabled';
                            } else {
                                item.GaurdianClass = 'incomplete';
                            }

                            if (!sitem.IsAnesthesistSignRequired) {
                                item.AnesthesistClass = 'disabled';
                            } else {
                                item.AnesthesistClass = 'incomplete';
                            }

                            if (!sitem.IsCounselorSignRequired) {
                                item.CounselorClass = 'disabled';
                            } else {
                                item.CounselorClass = 'incomplete';
                            }

                            $scope.OldPatientConsentFormId = item.PatientConsentFormId;

                            item.PatientConsentFormId = 0;
                            item.PdfContent = sitem.PDFcontent;
                            $scope.selectedPatientTempConsentObj.HtmlContent = sitem.PDFcontent;
                            $scope.MainPatientSignedObj = getnewPatientSignedObj();
                            $scope.MainPatientSignedObj.ConsentFormId = item.OrganizationConsentFormId;
                            $scope.MainPatientSignedObj.ConsentTemplateId = sitem.ConsentTemplateId;
                            $scope.signPlusObj = addnewsignPlusObj();
                            FillPatientConsentDetails();
                            setTimeout(attachHeaderKeyGuard, 300);
                        }
                    });
                }

            }
        });

    }


    $scope.getTrustedUrl = function (url, openInDocsViewer) {
        var extension = url.split('?')[0].split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
            return $sce.trustAsResourceUrl(url); // use <img> instead of iframe
        }
        return $sce.trustAsResourceUrl(
            openInDocsViewer ? 'https://docs.google.com/gview?embedded=true&url=' + (url) : url
        );
    };
    function attachHeaderKeyGuard() {
        var editable = document.querySelector('#htmlPatientTemplateconsent [id^="taTextElement"]')
            || document.querySelector('#htmlcontentconsent [id^="taTextElement"]')
            || (function () {
                var hdr = document.querySelector('.doc-header-block');
                return hdr ? hdr.closest('[id^="taTextElement"]') : null;
            })();

        if (!editable) {
            setTimeout(attachHeaderKeyGuard, 200);
            return;
        }
        if (editable.__headerGuardAttached) return;
        editable.__headerGuardAttached = true;

        editable.addEventListener('keydown', function (e) {
            var sel = window.getSelection();
            if (!sel || sel.rangeCount === 0) return;
            var range = sel.getRangeAt(0);

            function isInHeader(node) {
                while (node && node !== editable) {
                    if (node.nodeType === 1 && node.classList &&
                        node.classList.contains('doc-header-block')) return true;
                    node = node.parentNode;
                }
                return false;
            }

            function findBlockAncestor(node) {
                while (node && node !== editable) {
                    if (node.nodeType === 1) {
                        var tag = node.tagName;
                        if (tag === 'P' || tag === 'DIV' || /^H[1-6]$/.test(tag) ||
                            tag === 'UL' || tag === 'OL' || tag === 'PRE' || tag === 'LI') {
                            return node;
                        }
                    }
                    node = node.parentNode;
                }
                return null;
            }

            function cursorAtBlockStart() {
                if (!range.collapsed) return false;
                if (range.startOffset === 0) return true;
                var node = range.startContainer;
                if (node.nodeType === 3 &&
                    node.nodeValue.substring(0, range.startOffset).trim() === '') return true;
                return false;
            }

            // Is this element an empty paragraph (<p> with only <br> or whitespace)?
            function isEmptyParagraph(el) {
                if (!el || el.nodeType !== 1) return false;
                var txt = (el.textContent || '').replace(/\u00A0|\u200B/g, '').trim();
                if (txt.length > 0) return false;
                if (el.querySelector('img,table,hr,input,span[id]')) return false;
                return true;
            }


            // ── GUARD 1: cursor INSIDE header → block content keys ──
            if (isInHeader(range.startContainer)) {
                var allowNav = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                    'Home', 'End', 'PageUp', 'PageDown', 'Tab', 'Escape'];
                if (allowNav.indexOf(e.key) === -1) {
                    e.preventDefault();
                    e.stopPropagation();
                    var hdr = editable.querySelector('.doc-header-block');
                    if (hdr) {
                        var firstBody = hdr.nextElementSibling;
                        while (firstBody && firstBody.tagName === 'BR') {
                            firstBody = firstBody.nextElementSibling;
                        }
                        if (firstBody) {
                            var r = document.createRange();
                            r.setStart(firstBody, 0);
                            r.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(r);
                        }
                    }
                }
                return;
            }


            // ── GUARD 2: Backspace — only block if IMMEDIATE previous sibling IS the header ──
            //
            // CORRECTED RULE:
            //   Look at the previous sibling of the current block:
            //     - If it IS the header itself → BLOCK (merge would put content in header)
            //     - If it's anything else (empty <p>, another block with text) → ALLOW
            //       (normal merge behavior, no header interference)
            //
            // This allows:
            //   - Deleting blank lines the user created with Enter (prev = empty <p>)
            //   - Normal backspace anywhere else (prev = content block)
            //
            // And still blocks:
            //   - Backspace directly against the header (prev = doc-header-block)
            if (e.key === 'Backspace' && cursorAtBlockStart()) {
                var currentBlock = findBlockAncestor(range.startContainer);
                if (currentBlock) {
                    var prev = currentBlock.previousElementSibling;

                    // If previous sibling IS the header itself → block
                    if (prev && prev.classList &&
                        prev.classList.contains('doc-header-block')) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }
                    // Otherwise allow — even if several empty <p> separate us from the header,
                    // deleting one at a time is safe. Each backspace removes one empty line.
                }
            }


            // ── GUARD 3: Delete that would pull header content forward ──
            if (e.key === 'Delete') {
                var endBlock = range.startContainer;
                while (endBlock && endBlock !== editable) {
                    if (endBlock.nodeType === 1 &&
                        endBlock.nextElementSibling &&
                        endBlock.nextElementSibling.classList &&
                        endBlock.nextElementSibling.classList.contains('doc-header-block')) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }
                    endBlock = endBlock.parentNode;
                }
            }
        }, true);
    }
    // Check if user can edit a specific signature type's datetime
    $scope.canEditSignatureDateTimeFor = function (signatureType) {
        if (!$scope.CanEditSignatureDateTime) {
            return false; // User doesn't have global permission
        }

        var selectedForm = $scope.selectedPatientTempConsentObj;
        if (!selectedForm) {
            return false;
        }

        // Check based on signature type and form properties
        switch (signatureType) {
            case 'Patient':
                return $scope.signaturesTab.Patient
                    //&&
                    //!$scope.MainPatientSignedObj.IsPatientSignatureDone;

            case 'Staff':
                return $scope.signaturesTab.Staff
                    //&&
                    //!$scope.MainPatientSignedObj.IsStaffSignatureDone;

            case 'Provider':
                return $scope.signaturesTab.Provider
                    //&&
                    //!$scope.MainPatientSignedObj.IsProviderSignatureDone;

            case 'Counselor':
                return $scope.signaturesTab.Counselor
                    //&&
                    //!$scope.MainPatientSignedObj.IsCounselorSignatureDone;

            case 'Anesthesist':
                return $scope.signaturesTab.Anesthesist
                    //&&
                    //!$scope.MainPatientSignedObj.IsAnesthesistSignatureDone;

            case 'Gaurdian':
                return $scope.signaturesTab.Gaurdian
                    //&&
                    //!$scope.MainPatientSignedObj.IsGaurdianSignatureDone;

            default:
                return false;
        }
    };

    // Initialize signature datetime when opening signature modal
    // Initialize signature datetime - use existing if available, otherwise current time
    $scope.initializeSignatureDateTime = function (signatureType) {
        var datetimeToUse;

        // Check if there's an existing datetime for this signature type
        switch (signatureType) {
            case 'Patient':
                // Use existing if available, otherwise current time
                datetimeToUse = $scope.MainPatientSignedObj.PatientSignedDateTime ||
                    moment(new Date()).format("MM-DD-YYYY hh:mm A");
                $scope.SignatureDateTimeEdit.PatientDateTime = datetimeToUse;
                $scope.SignatureDateTimeEdit.PatientOriginalDateTime = datetimeToUse;
                break;

            case 'Staff':
                datetimeToUse = $scope.MainPatientSignedObj.StaffSignedDateTime ||
                    moment(new Date()).format("MM-DD-YYYY hh:mm A");
                $scope.SignatureDateTimeEdit.StaffDateTime = datetimeToUse;
                $scope.SignatureDateTimeEdit.StaffOriginalDateTime = datetimeToUse;
                break;

            case 'Provider':
                datetimeToUse = $scope.MainPatientSignedObj.ProviderSignedDateTime ||
                    moment(new Date()).format("MM-DD-YYYY hh:mm A");
                $scope.SignatureDateTimeEdit.ProviderDateTime = datetimeToUse;
                $scope.SignatureDateTimeEdit.ProviderOriginalDateTime = datetimeToUse;
                break;

            case 'Counselor':
                datetimeToUse = $scope.MainPatientSignedObj.CounselorSignedDateTime ||
                    moment(new Date()).format("MM-DD-YYYY hh:mm A");
                $scope.SignatureDateTimeEdit.CounselorDateTime = datetimeToUse;
                $scope.SignatureDateTimeEdit.CounselorOriginalDateTime = datetimeToUse;
                break;

            case 'Anesthesist':
                datetimeToUse = $scope.MainPatientSignedObj.AnesthesistSignedDateTime ||
                    moment(new Date()).format("MM-DD-YYYY hh:mm A");
                $scope.SignatureDateTimeEdit.AnesthesistDateTime = datetimeToUse;
                $scope.SignatureDateTimeEdit.AnesthesistOriginalDateTime = datetimeToUse;
                break;

            case 'Gaurdian':
                datetimeToUse = $scope.MainPatientSignedObj.GaurdianSignedDateTime ||
                    moment(new Date()).format("MM-DD-YYYY hh:mm A");
                $scope.SignatureDateTimeEdit.GaurdianDateTime = datetimeToUse;
                $scope.SignatureDateTimeEdit.GaurdianOriginalDateTime = datetimeToUse;
                break;
        }

        console.log("Initialized " + signatureType + " datetime:", datetimeToUse);
    };

    // Open datetime edit modal
    $scope.openSignatureDateTimeEditor = function (signatureType) {
        if (!$scope.canEditSignatureDateTimeFor(signatureType)) {
            return; // Not authorized
        }

        var modalInstance = $uibModal.open({
            templateUrl: 'signatureDateTimeEditorModal.html',
            //controller: 'SignatureDateTimeEditorCtrl',
            size: 'sm',
            backdrop: 'static',
            //windowClass: "modal__eighty-- zindexpopup  ",

            resolve: {
                signatureType: function () { return signatureType; },
                currentDateTime: function () {
                    switch (signatureType) {
                        case 'Patient': return $scope.SignatureDateTimeEdit.PatientDateTime;
                        case 'Staff': return $scope.SignatureDateTimeEdit.StaffDateTime;
                        case 'Provider': return $scope.SignatureDateTimeEdit.ProviderDateTime;
                        case 'Counselor': return $scope.SignatureDateTimeEdit.CounselorDateTime;
                        case 'Anesthesist': return $scope.SignatureDateTimeEdit.AnesthesistDateTime;
                        case 'Gaurdian': return $scope.SignatureDateTimeEdit.GaurdianDateTime;
                        default: return moment(new Date()).format("MM-DD-YYYY hh:mm A");
                    }
                }
            },
            "controller": function ($scope, $uibModalInstance, signatureType, currentDateTime) {
                console.log("=== DateTime Editor Opened ===");
                console.log("Signature Type:", signatureType);
                console.log("Current DateTime:", currentDateTime);

                $scope.signatureType = signatureType;

                // Parse the current datetime
                var parsedMoment = moment(currentDateTime, "MM-DD-YYYY hh:mm A");

                if (!parsedMoment.isValid()) {
                    console.warn("Invalid datetime, using current time");
                    parsedMoment = moment();
                }

                // Set initial values as strings (for custom directives)
                $scope.editedDate = parsedMoment.format("M-D-YYYY");  // "4-29-2026"
                $scope.editedTime = parsedMoment.format("hh:mm A");   // "03:02 PM"
                $scope.maxDate = new Date();

                console.log("Initial values:", {
                    date: $scope.editedDate,
                    time: $scope.editedTime
                });

                // ✅ Update preview function - called by ng-change
                $scope.updatePreview = function () {
                    console.log("updatePreview called with:", {
                        date: $scope.editedDate,
                        time: $scope.editedTime
                    });

                    if (!$scope.editedDate || !$scope.editedTime) {
                        $scope.previewDateTime = "";
                        return;
                    }

                    // Parse date (multiple formats supported)
                    var dateMoment = moment($scope.editedDate, [
                        "M-D-YYYY",      // 4-29-2026
                        "MM-DD-YYYY",    // 04-29-2026
                        "M/D/YYYY",      // 4/29/2026
                        "MM/DD/YYYY"     // 04/29/2026
                    ]);

                    // Parse time (multiple formats supported)
                    var timeMoment = moment($scope.editedTime, [
                        "hh:mm A",       // 03:02 PM
                        "h:mm A",        // 3:02 PM
                        "HH:mm",         // 15:02
                        "hh:mm a"        // 03:02 pm
                    ]);

                    if (dateMoment.isValid() && timeMoment.isValid()) {
                        // Combine and format
                        var dateStr = dateMoment.format("MM-DD-YYYY");
                        var timeStr = timeMoment.format("hh:mm A");
                        var combined = moment(dateStr + " " + timeStr, "MM-DD-YYYY hh:mm A");

                        $scope.previewDateTime = combined.format("MM-DD-YYYY hh:mm A");
                        console.log("Preview:", $scope.previewDateTime);
                    } else {
                        $scope.previewDateTime = "Invalid date/time";
                        console.warn("Invalid:", {
                            dateValid: dateMoment.isValid(),
                            timeValid: timeMoment.isValid()
                        });
                    }
                };

                // ✅ Time picker click handler - called by ng-click
                $scope.GetCurrenttime = function () {
                    let currentTime1 = $filter("date")(new Date(), "hh:mm a");
                    $scope.editedTime = currentTime1 || null;

                    console.log("Current time set:", $scope.editedTime);

                    // Update preview after setting time
                    $scope.updatePreview();
                };

                // Confirm button
                $scope.confirmDateTime = function () {
                    console.log("=== Confirm Clicked ===");
                    console.log("Date:", $scope.editedDate);
                    console.log("Time:", $scope.editedTime);

                    // Validate
                    if (!$scope.editedDate || !$scope.editedTime) {
                        alertify.error("Please enter both date and time");
                        return;
                    }

                    // Parse
                    var dateMoment = moment($scope.editedDate, [
                        "M-D-YYYY", "MM-DD-YYYY", "M/D/YYYY", "MM/DD/YYYY"
                    ]);

                    var timeMoment = moment($scope.editedTime, [
                        "hh:mm A", "h:mm A", "HH:mm", "hh:mm a"
                    ]);

                    if (!dateMoment.isValid() || !timeMoment.isValid()) {
                        alertify.error("Invalid date or time format");
                        return;
                    }

                    // Combine
                    var combined = moment(
                        dateMoment.format("MM-DD-YYYY") + " " + timeMoment.format("hh:mm A"),
                        "MM-DD-YYYY hh:mm A"
                    );

                    // Validate not future
                    if (combined.isAfter(moment())) {
                        alertify.error("Cannot set a future date/time for signature");
                        return;
                    }

                    // Return formatted
                    var formattedDateTime = combined.format("MM-DD-YYYY hh:mm A");
                    console.log("Returning:", formattedDateTime);

                    $uibModalInstance.close(formattedDateTime);
                };

                // Cancel button
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                // Initialize preview
                $scope.updatePreview();

                console.log("=== Controller Initialized ===");
            }

        });

        modalInstance.result.then(function (newDateTime) {
            // User confirmed - update the datetime
            switch (signatureType) {
                case 'Patient':
                    $scope.SignatureDateTimeEdit.PatientDateTime = newDateTime;
                    break;
                case 'Staff':
                    $scope.SignatureDateTimeEdit.StaffDateTime = newDateTime;
                    break;
                case 'Provider':
                    $scope.SignatureDateTimeEdit.ProviderDateTime = newDateTime;
                    break;
                case 'Counselor':
                    $scope.SignatureDateTimeEdit.CounselorDateTime = newDateTime;
                    break;
                case 'Anesthesist':
                    $scope.SignatureDateTimeEdit.AnesthesistDateTime = newDateTime;
                    break;
                case 'Gaurdian':
                    $scope.SignatureDateTimeEdit.GaurdianDateTime = newDateTime;
                    break;
            }

            alertify.success("Signature date updated successfully");
        }, function () {
            // User cancelled - do nothing
        });
    };
    $scope._cachedDoctorEncryptedSig = null;

  

 



    // ── Bulk sign state ──────────────────────────────────────────────────────
    $scope.bulkSignState = {
        inProgress: false,
        total: 0,
        done: 0,
        failed: []
    };

    // ── MAIN FUNCTION — called from "Sign All Consents" button ───────────────
    
    function injectSignaturesIntoHtml(htmlContent, providerSigBase64, signedDateTime,citem) {
        if (!htmlContent) return '';

        // Build the same img tag that genProviderImg() renders into the DOM
        // Look at genProviderImg — it sets innerHTML of NProviderSignature elements
        // to a <table> with an <img>. We replicate that exact structure:
        if ($scope.Isbulksignofdone && providerSigBase64 && (citem.IsDoctorSignRequired && !citem.IsProviderSignatureDone)) {

            var sigImgHtml = '<table style="border:none;"><tbody><tr><td>'
                + '<img src="' + providerSigBase64 + '" '
                + 'style="max-width:200px;max-height:80px;display:block;" />'
                + '</td></tr></tbody></table>';

            // Replace ##ProviderSignature## placeholder
            htmlContent = htmlContent.replace(/##ProviderSignature##/gi, sigImgHtml);

            // Replace ##ProviderSignedDateTime## placeholder  
            htmlContent = htmlContent.replace(/##ProviderSignedDateTime##/gi, signedDateTime);


        

        // Clear any other unfilled placeholders so iTextSharp doesn't choke on ##...##
        // (patient sig placeholder left as-is if patient already signed — their img is already in the HTML)
        // Only clear the REMAINING unfilled ones:
        htmlContent = htmlContent.replace(/##ProviderSignature##/gi, '');
            htmlContent = htmlContent.replace(/##ProviderSignedDateTime##/gi, '');
        }

        if (($scope.IsAnesthesiabulksignofdone)&&($scope.ConsentAnesthesistEncryptedSig) && (citem.IsAnesthesistSignRequired && !citem.IsAnesthesistSignatureDone)) {

            var anesthesistSigImgHtml =
                '<table style="border:none;"><tbody><tr><td>'
                + '<img src="' + $scope.ConsentAnesthesistEncryptedSig + '" '
                + 'style="max-width:200px;max-height:80px;display:block;" />'
                + '</td></tr></tbody></table>';

            htmlContent = htmlContent.replace(
                /##AnesthesistSignature##/gi,
                anesthesistSigImgHtml
            );

            htmlContent = htmlContent.replace(
                /##AnesthesistSignDateTime##/gi,
                signedDateTime || ''
            );
            htmlContent = htmlContent.replace(/##AnesthesistSignature##/gi, '');
            htmlContent = htmlContent.replace(/##AnesthesistSignDateTime##/gi, '');
        }
        return htmlContent;
    }
    $scope.ProviderSigBase64 = '';
    $scope.AppointmentDoctorId =
        $scope.ParentObject.mainitem.DoctorID || 0;
    $scope.LoadAppointmentDoctorSignature = function () {

        if (!$scope.AppointmentDoctorId) {
            console.log("Doctor ID missing");
            return;
        }

        eHnoteSettingsDataService
            .GetUserEncryptedSig($scope.AppointmentDoctorId)
            .then(function (resp) {

                $scope.ProviderSigBase64 =
                    resp.data.UserEncryptedSig || '';

                console.log(
                    "Provider signature loaded",
                    $scope.ProviderSigBase64
                );

            }, function (err) {

                console.log("Failed to load provider signature", err);

            });
    };
    $scope.LoadAppointmentDoctorSignature();
    $scope.bulkSignAllConsents = function () {
        var allConsents = $scope.consentsMainObj.MainConsents || [];

        // Only consents where doctor sign is required and not yet done
        var toSign = allConsents.filter(function (c) {
            return c.CanBulksignconsent === true
                ;
        });

        if (toSign.length === 0) {
            alertify.error("No consents require doctor signature, or all already signed.");
            return;
        }

        // Get doctor sig — from signPlusObj (already loaded) or fetch once
        var providerSigBase64 = $scope.ProviderSigBase64 || null;

        if (!providerSigBase64) {
            // Fetch from API — same call as OnLoadUserSignature uses
            eHnoteSettingsDataService.GetUserEncryptedSig($scope.UserId)
                .then(function (resp) {
                    providerSigBase64 = resp.data.UserEncryptedSig || '';
                    if (!providerSigBase64) {
                        alertify.error("No saved signature found for this doctor.");
                        return;
                    }
                    _sendBulkSignRequest(toSign, providerSigBase64);
                });
        } else {
            _sendBulkSignRequest(toSign, providerSigBase64);
        }
    };
    $scope.Isbulksignofdone =  false;
    $scope.IsAnesthesiabulksignofdone =  false;
    $scope.IsshowBulkSignrefreshButton = false;
    function _sendBulkSignRequest(toSign, providerSigBase64) {
        var signedDateTime = null, signedDateTimeForDB = null;
        if ($scope.admissiondatetime) {
            signedDateTime = $filter('date')($scope.admissiondatetime, "MM-dd-yyyy hh:mm a");
            signedDateTimeForDB = $filter('date')($scope.admissiondatetime, "yyyy-MM-dd HH:mm:ss");
        } else {
            signedDateTime = moment(new Date()).format("MM-DD-YYYY hh:mm A");
            signedDateTimeForDB = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        }
    
        var cApptDate = $filter('date')(new Date(), "yyyy-MM-dd");

        // Build request list — HTML is processed HERE on frontend
        var reqList = toSign.map(function (c) {
            var originalHTML = c.HTMLContent || c.PDFcontent || "";
            // *** KEY FIX: inject signature into HTML string before sending ***
            var processedHtml = injectSignaturesIntoHtml(
                originalHTML,
                providerSigBase64,
                signedDateTime, c
            );

            // Extract header config from the HTML comment
            var H = USPrintService.HeaderHelpers;
            var cfg = H.extractHeaderConfig(c.HTMLContent || '') || null;
            var consentName = c.ConsentFormName || c.DocumentName || '';
            if (($scope.Isbulksignofdone) && (providerSigBase64) && (c.IsDoctorSignRequired && !c.IsProviderSignatureDone)) {
                c.ProviderSignedDateTime = signedDateTimeForDB || null;
                c.IsProviderSignatureDone = true;
                c.ProviderUserId = $scope.AppointmentDoctorId || 0;
                c.ProviderSignCaptureUserId = $scope.AppointmentDoctorId || 0;
            //    c.DoctorEncryptedSig = providerSigBase64 || null; based on userid it in db they will get and add to appoitnemnt consent
            }
            if (($scope.IsAnesthesiabulksignofdone)&&($scope.ConsentAnesthesistEncryptedSig )&& (c.IsAnesthesistSignRequired && !c.IsAnesthesistSignatureDone)) {
                c.AnesthesistSignedDateTime = signedDateTimeForDB || null;
                c.IsAnesthesistSignatureDone = true;
                c.AnesthesistUserId = $scope.ConsentAnesthesiaId || 0;
                c.AnesthesistSignCaptureUserId = $scope.ConsentAnesthesiaId || 0;
            //    c.AnesthesistEncryptedSig = $scope.ConsentAnesthesistEncryptedSig || null; based on userid it in db they will get and add to appoitnemnt consent
            }
            return {
                "UserId": $scope.MainPatientSignedObj.UserId,
                "HospitalId": $scope.ParentObject.ApptHospitalId,
                "ConsentTemplateId": c.ConsentTemplateId || 0,
                "PatientConsentDocumentId": c.PatientConsentDocumentId || 0,
                "PatientId": $scope.MainPatientSignedObj.PatientId,
                "VisitId": $scope.MainPatientSignedObj.VisitId || 0,
                "PatientName": $scope.MainPatientSignedObj.PatientName,
                "AppointmentId": $scope.MainPatientSignedObj.AppointmentId,
                "AppointmentDate": $scope.MainPatientSignedObj.AppointmentDate || cApptDate,
                "ConsentFormId": c.ConsentFormId || 0,
                "S3URL": c.S3URL || "",
                "Base64": "",               // backend generates PDF from HTMLContent
                "DocumentExt": "pdf",
                "DocumentName": c.DocumentName || "",
                "DisplayName": consentName,
                // Preserve existing signatures
                "IsPatientSignatureDone": c.IsPatientSignatureDone || false,
                "IsStaffSignatureDone": c.IsStaffSignatureDone || false,
                "StaffUserId": c.StaffUserId || 0,
                "IsCounselorSignatureDone": c.IsCounselorSignatureDone || false,
                "CounselorUserId": c.CounselorUserId || 0,
                "IsAnesthesistSignatureDone": c.IsAnesthesistSignatureDone || false,
                "AnesthesistUserId": c.AnesthesistUserId || 0,
                "IsGaurdianSignatureDone": c.IsGaurdianSignatureDone || false,
                "GaurdianUserId": c.GaurdianUserId || 0,
                "GaurdianFirstName": c.GaurdianFirstName || "",
                "GaurdianLastName": c.GaurdianLastName || "",
                "GaurdianRelationShipId": c.GaurdianRelationShipId || null,
                // Doctor — signing now
                "IsProviderSignatureDone": c.IsProviderSignatureDone,
                "ProviderUserId": c.ProviderUserId,
                "ProviderSignedDateTime": c.ProviderSignedDateTime ,
                "ProviderSignCaptureUserId": c.ProviderSignCaptureUserId,
                // Datetimes
                "PatientSignedDateTime": c.PatientSignedDateTime || null,
                "StaffSignedDateTime": c.StaffSignedDateTime || null,
                "CounselorSignedDateTime": c.CounselorSignedDateTime || null,
                "AnesthesistSignedDateTime": c.AnesthesistSignedDateTime || null,
                "GaurdianSignedDateTime": c.GaurdianSignedDateTime || null,
                "PatientSignCaptureUserId": c.PatientSignCaptureUserId || 0,
                "StaffSignCaptureUserId": c.StaffSignCaptureUserId || 0,
                "CounselorSignCaptureUserId": c.CounselorSignCaptureUserId || 0,
                "AnesthesistSignCaptureUserId": c.AnesthesistSignCaptureUserId || 0,
                "GaurdianSignCaptureUserId": c.GaurdianSignCaptureUserId || 0,
                // Encrypted sigs
                "PatientEncryptedSig": c.PatientEncryptedSig || "",
                "DoctorEncryptedSig": c.DoctorEncryptedSig,
                "StaffEncryptedSig": c.StaffEncryptedSig || "",
                "CounselorEncryptedSig": c.CounselorEncryptedSig || "",
                "AnesthesistEncryptedSig": c.AnesthesistEncryptedSig || "",
                "GuardianEncryptedSig": c.GuardianEncryptedSig || "",
                "PatientIntialEncryptedSig": c.PatientIntialEncryptedSig || "",
                "IsPartiallySaved": false,
                "IsScannedDocument": false,
                // *** PROCESSED HTML — signatures already injected ***
                "HTMLContent": processedHtml,
                // Header info for backend PDF generation
                "HeaderText": consentName,
                "HeaderCfg": cfg,
                "OldPatientConsentFormId": 0,
                "Logs": {}
            };
        });

        $scope.bulkSignState = { inProgress: true, total: reqList.length, done: 0, failed: [] };

        eHnoteSettingsDataService.BulkAddUpdatePatientSignedConsentDocuments(reqList)
            .then(function (resp) {
                $scope.bulkSignState.inProgress = false;
                var r = resp.data;
                if (r.Status === 'Success') {
                    alertify.success("All " + r.SuccessCount + " consent(s) signed successfully.");
                } else {
                    alertify.error(r.SuccessCount + " signed. " + r.FailedCount + " failed. Check logs.");
                    console.error("Bulk sign failures:", r.FailedDetails);
                }
                $scope.GetPatientAppointmentConsentsById();
            }, function (err) {
                $scope.bulkSignState.inProgress = false;
                alertify.error("Bulk sign request failed. Please try again.");
                console.error(err);
            });
    }
    $scope.OldappointmentConsent = {
        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
    }
    $scope.GetPendingProviderSignatureConsents = function () {
  

        var obj = {
            /*"OrganizationId": $scope.HospitalId,*/
            "HospitalId": $scope.HospitalId,
            //"AppointmentId": $scope.AppointmentId || 0,
            "PatientId": $scope.PatientId,
            "VisitId": $scope.VisitId,
            "FromDate": null,
            "ToDate": null,
            "PageNumber": 1,
            "PageSize": 10,
        };

        eHnoteSettingsDataService.GetPendingProviderSignatureConsents(obj).then(function (resp) {



       
            resp.data.PatientAppointmentConsents = resp.data.PatientAppointmentConsents || [];


            console.log(resp);


        }, function (err) {
            console.log(err);
        });
    }
    $scope.changeCurrentDate = function (cdate, type) {

        var currentdate = $filter('date')(new Date(), "MM-dd-yyyy");

        if (type === 1) {
       
        } else {
            $scope.GetPendingProviderSignatureConsents();
        }
    }
}]);